import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { 
  requireAdminApiKey, 
  checkAdminEnabled,
  restrictDiagnosticAccess, 
  validateNumericParam,
  validateFileType,
  validateFileMagicBytes,
  aiEndpointRateLimiter,
  sanitizeAIInput,
  validateInputLength,
  SECURITY_CONFIG 
} from "./security";
import {
  authenticateUser,
  createUser,
  changePassword,
  updateSessionActivity,
  resetUserPassword,
  createSession,
  validateSession,
  deleteSession,
  deleteAllUserSessions,
  cleanupExpiredSessions,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sanitizeUser
} from "./auth";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { 
  insertCategorySchema, insertSpecialtyAreaSchema, insertWorkRoleSchema, 
  insertTaskSchema, insertKnowledgeItemSchema, insertSkillSchema,
  insertCertificationSchema
} from "@shared/schema";
import { aiCareerMapper } from "./ai-career-mapper";
import { aiVacancyMapper } from "./ai-vacancy-mapper";
import { AIResumeAnalyzer } from "./ai-resume-analyzer";
import { getCareerTrackWithTKS, getCareerTrackTKSProgression } from "./routes/career-track-tks";
import fs from "fs";
import mammoth from "mammoth";
import OpenAI from "openai";

// Configure multer with security constraints
// SECURITY: Limit file size and use secure temp directory
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: SECURITY_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 1 // Only allow single file uploads
  },
  fileFilter: (req, file, cb) => {
    // Validate file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      cb(new Error(`File type ${ext} not allowed`));
      return;
    }
    cb(null, true);
  }
});

const resumeAnalyzer = new AIResumeAnalyzer();

// Legacy middleware for UI visibility checks (uses VITE_ENABLE_ADMIN flag)
// SECURITY NOTE: This only controls UI visibility, NOT actual security
// Use requireAdminApiKey for actual protected operations
function requireAdminAccess(req: Request, res: Response, next: NextFunction): void {
  const isAdminEnabled = process.env.VITE_ENABLE_ADMIN === 'true';
  if (!isAdminEnabled) {
    res.status(403).json({ message: "Admin access is disabled" });
    return;
  }
  next();
}

// Helper to safely parse and validate numeric IDs
// SECURITY: Prevents NaN and injection issues with parseInt
function safeParseId(value: string): number | null {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return null;
  }
  return parsed;
}

// Session cookie name
const SESSION_COOKIE = 'session_id';

// Middleware to require authentication
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (!sessionId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  
  validateSession(sessionId).then(async user => {
    if (!user) {
      res.clearCookie(SESSION_COOKIE);
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }
    // Update session activity timestamp on each authenticated request
    await updateSessionActivity(sessionId);
    (req as any).user = user;
    (req as any).sessionId = sessionId; // Store for password change endpoint
    next();
  }).catch(() => {
    res.status(401).json({ message: "Authentication error" });
  });
}

// Middleware to require admin role
function requireAdminRole(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1)
      });
      
      const { email, password } = loginSchema.parse(req.body);
      const user = await authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const sessionId = await createSession(user.id);
      
      res.cookie(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ 
        user: sanitizeUser(user),
        mustChangePassword: user.mustChangePassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.cookies?.[SESSION_COOKIE];
      if (sessionId) {
        await deleteSession(sessionId);
      }
      res.clearCookie(SESSION_COOKIE);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });
  
  // Get current session
  app.get("/api/auth/session", async (req, res) => {
    try {
      const sessionId = req.cookies?.[SESSION_COOKIE];
      if (!sessionId) {
        return res.json({ authenticated: false });
      }
      
      const user = await validateSession(sessionId);
      if (!user) {
        res.clearCookie(SESSION_COOKIE);
        return res.json({ authenticated: false });
      }
      
      res.json({ 
        authenticated: true,
        user: sanitizeUser(user),
        mustChangePassword: user.mustChangePassword
      });
    } catch (error) {
      console.error("Session check error:", error);
      res.json({ authenticated: false });
    }
  });
  
  // Change password
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const passwordSchema = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8, "Password must be at least 8 characters")
      });
      
      const { currentPassword, newPassword } = passwordSchema.parse(req.body);
      const user = (req as any).user;
      const currentSessionId = (req as any).sessionId;
      
      const authenticated = await authenticateUser(user.email, currentPassword);
      if (!authenticated) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Pass current session ID to keep this session active while invalidating others
      const success = await changePassword(user.id, newPassword, currentSessionId);
      if (!success) {
        return res.status(500).json({ message: "Failed to change password" });
      }
      
      res.json({ message: "Password changed successfully. Other sessions have been logged out." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Set password (for first-time login)
  app.post("/api/auth/set-password", requireAuth, async (req, res) => {
    try {
      const passwordSchema = z.object({
        newPassword: z.string().min(8, "Password must be at least 8 characters")
      });
      
      const { newPassword } = passwordSchema.parse(req.body);
      const user = (req as any).user;
      const currentSessionId = (req as any).sessionId;
      
      if (!user.mustChangePassword) {
        return res.status(400).json({ message: "Password change not required" });
      }
      
      // Pass current session ID to keep this session active
      const success = await changePassword(user.id, newPassword, currentSessionId);
      if (!success) {
        return res.status(500).json({ message: "Failed to set password" });
      }
      
      res.json({ message: "Password set successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Set password error:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });
  
  // ============================================
  // USER MANAGEMENT ROUTES (Admin only)
  // ============================================
  
  // List all users
  app.get("/api/admin/users", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users.map(u => sanitizeUser(u)));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Create/invite user
  app.post("/api/admin/users", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const userSchema = z.object({
        email: z.string().email(),
        role: z.enum(['admin', 'user']).default('user'),
        displayName: z.string().optional()
      });
      
      const { email, role, displayName } = userSchema.parse(req.body);
      const { user, tempPassword } = await createUser(email, role, displayName);
      
      res.status(201).json({ 
        user: sanitizeUser(user),
        tempPassword // Show once to admin so they can share with user
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      if ((error as any)?.code === '23505') {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Update user
  app.patch("/api/admin/users/:id", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const id = safeParseId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const updateSchema = z.object({
        role: z.enum(['admin', 'user']).optional(),
        displayName: z.string().optional(),
        isActive: z.boolean().optional()
      });
      
      const updates = updateSchema.parse(req.body);
      const user = await updateUser(id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(sanitizeUser(user));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Reset user password
  app.post("/api/admin/users/:id/reset-password", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const id = safeParseId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const tempPassword = await resetUserPassword(id);
      if (!tempPassword) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await deleteAllUserSessions(id);
      
      res.json({ tempPassword });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  
  // Delete user
  app.delete("/api/admin/users/:id", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const id = safeParseId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const currentUser = (req as any).user;
      if (currentUser.id === id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const deleted = await deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Statistics endpoint (admin only)
  // SECURITY: Requires API key authentication in production, UI flag check in development
  app.get("/api/statistics", requireAdminApiKey, async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Search endpoint (admin only)
  // SECURITY: Requires API key authentication
  app.get("/api/search", requireAdminApiKey, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const results = await storage.searchAll(q);
      res.json(results);
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // OpenAI API Test Endpoint
  // SECURITY: Protected by restrictDiagnosticAccess - requires admin auth in production
  app.get("/api/test-openai", restrictDiagnosticAccess, async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      apiKeyConfigured: false,
      testCallStatus: 'not_attempted',
      error: null,
      details: {}
    };

    try {
      // Check if API key is configured
      const apiKey = process.env.OPENAI_API_KEY;
      diagnostics.apiKeyConfigured = !!apiKey;
      
      // SECURITY: Don't expose API key details in production
      if (apiKey && !isProduction) {
        diagnostics.apiKeyLength = apiKey.length;
        diagnostics.apiKeyPrefix = apiKey.substring(0, 7);
      }

      if (!apiKey) {
        diagnostics.error = "OPENAI_API_KEY environment variable is not set";
        diagnostics.testCallStatus = 'failed';
        return res.status(500).json(diagnostics);
      }

      // Initialize OpenAI client
      console.log("Initializing OpenAI client for test...");
      const openai = new OpenAI({ apiKey });
      
      // Make a minimal test call
      console.log("Making test call to OpenAI API...");
      diagnostics.testCallStatus = 'attempting';
      
      const testResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: "Say 'API test successful' in exactly those words." }
        ],
        max_tokens: 10
      });

      diagnostics.testCallStatus = 'success';
      diagnostics.details = {
        model: testResponse.model,
        response: testResponse.choices[0].message.content,
        usage: testResponse.usage
      };

      console.log("OpenAI API test successful");
      res.json({
        success: true,
        message: "OpenAI API is configured and working correctly",
        ...diagnostics
      });

    } catch (error: unknown) {
      const err = error as Error & { type?: string; status?: number; code?: string; response?: { status: number; data: unknown } };
      console.error("OpenAI API test error:", err.message);
      
      diagnostics.testCallStatus = 'failed';
      
      // SECURITY: Sanitize error details in production
      if (isProduction) {
        diagnostics.error = {
          message: 'API test failed. Check server logs for details.',
          code: err.code
        };
      } else {
        diagnostics.error = {
          message: err.message || 'Unknown error',
          type: err.type || err.constructor?.name,
          status: err.status,
          code: err.code
        };
      }

      res.status(500).json({
        success: false,
        message: "OpenAI API test failed",
        ...diagnostics
      });
    }
  });

  // Database Test Endpoint
  // SECURITY: Protected by restrictDiagnosticAccess - requires admin auth in production
  app.get("/api/test-database", restrictDiagnosticAccess, async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrlConfigured: false,
      testQueryStatus: 'not_attempted',
      error: null,
      details: {}
    };

    try {
      // Check if DATABASE_URL is configured
      const dbUrl = process.env.DATABASE_URL;
      diagnostics.databaseUrlConfigured = !!dbUrl;
      
      // SECURITY: Never expose database URL, even partially
      // Previous code exposed urlPrefix which could leak connection details

      if (!dbUrl) {
        diagnostics.error = "Database connection is not configured";
        diagnostics.testQueryStatus = 'failed';
        return res.status(500).json(diagnostics);
      }

      // Try to fetch a small number of career tracks
      console.log("Testing database connection by fetching career tracks...");
      diagnostics.testQueryStatus = 'attempting';
      
      const careerTracks = await storage.getCareerTracks();
      
      diagnostics.testQueryStatus = 'success';
      diagnostics.details = {
        careerTracksCount: careerTracks.length,
        sampleTrack: careerTracks[0] ? {
          id: careerTracks[0].id,
          name: careerTracks[0].name
        } : null
      };

      console.log("Database test successful");
      res.json({
        success: true,
        message: "Database is configured and working correctly",
        ...diagnostics
      });

    } catch (error: unknown) {
      const err = error as Error & { code?: string; severity?: string; detail?: string; hint?: string };
      console.error("Database test error:", err.message);
      
      diagnostics.testQueryStatus = 'failed';
      
      // SECURITY: Sanitize error details in production
      if (isProduction) {
        diagnostics.error = {
          message: 'Database test failed. Check server logs for details.',
          code: err.code
        };
      } else {
        diagnostics.error = {
          message: err.message || 'Unknown error',
          type: err.constructor?.name,
          code: err.code
        };
      }

      res.status(500).json({
        success: false,
        message: "Database test failed",
        ...diagnostics
      });
    }
  });
  
  // Health check endpoint - minimal, no sensitive data
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const category = insertCategorySchema.parse(req.body);
      const created = await storage.createCategory(category);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  // Specialty Areas routes
  app.get("/api/specialty-areas", async (req, res) => {
    try {
      const specialtyAreas = await storage.getSpecialtyAreas();
      res.json(specialtyAreas);
    } catch (error) {
      console.error("Error fetching specialty areas:", error);
      res.status(500).json({ message: "Failed to fetch specialty areas" });
    }
  });

  app.post("/api/specialty-areas", async (req, res) => {
    try {
      const specialtyArea = insertSpecialtyAreaSchema.parse(req.body);
      const created = await storage.createSpecialtyArea(specialtyArea);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating specialty area:", error);
      res.status(400).json({ message: "Failed to create specialty area" });
    }
  });

  // Work Roles routes
  app.get("/api/work-roles", async (req, res) => {
    try {
      const workRoles = await storage.getWorkRoles();
      res.json(workRoles);
    } catch (error) {
      console.error("Error fetching work roles:", error);
      res.status(500).json({ message: "Failed to fetch work roles" });
    }
  });

  app.get("/api/work-roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workRole = await storage.getWorkRoleWithRelations(id);
      if (!workRole) {
        return res.status(404).json({ message: "Work role not found" });
      }
      res.json(workRole);
    } catch (error) {
      console.error("Error fetching work role:", error);
      res.status(500).json({ message: "Failed to fetch work role" });
    }
  });

  app.post("/api/work-roles", async (req, res) => {
    try {
      const workRole = insertWorkRoleSchema.parse(req.body);
      const created = await storage.createWorkRole(workRole);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating work role:", error);
      res.status(400).json({ message: "Failed to create work role" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const task = insertTaskSchema.parse(req.body);
      const created = await storage.createTask(task);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  // Knowledge Items routes
  app.get("/api/knowledge-items", async (req, res) => {
    try {
      const knowledgeItems = await storage.getKnowledgeItems();
      res.json(knowledgeItems);
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
      res.status(500).json({ message: "Failed to fetch knowledge items" });
    }
  });

  app.post("/api/knowledge-items", async (req, res) => {
    try {
      const knowledgeItem = insertKnowledgeItemSchema.parse(req.body);
      const created = await storage.createKnowledgeItem(knowledgeItem);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating knowledge item:", error);
      res.status(400).json({ message: "Failed to create knowledge item" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const skill = insertSkillSchema.parse(req.body);
      const created = await storage.createSkill(skill);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(400).json({ message: "Failed to create skill" });
    }
  });



  // Import History routes (admin only)
  // SECURITY: Requires API key authentication
  app.get("/api/import-history", requireAdminApiKey, async (req, res) => {
    try {
      const history = await storage.getImportHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({ message: "Failed to fetch import history" });
    }
  });

  // NICE Framework automated import endpoint (admin only)
  // SECURITY: Requires API key authentication
  app.post("/api/import/nice-framework", requireAdminApiKey, async (req, res) => {
    try {
      const { NiceFrameworkImporter } = await import("./nice-importer");
      const importer = new NiceFrameworkImporter();
      
      await importer.importCompleteFramework();
      
      res.status(200).json({
        message: "NICE Framework 2.0.0 imported successfully",
        status: "completed"
      });
    } catch (error) {
      console.error("Error importing NICE Framework:", error);
      res.status(500).json({ message: "NICE Framework import failed" });
    }
  });

  // File upload and import endpoint (admin only)
  // SECURITY: Requires API key authentication
  app.post("/api/import", requireAdminApiKey, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { importType } = req.body;
      if (!importType) {
        return res.status(400).json({ message: "Import type is required" });
      }

      // Check if it's a JSON file for NICE Framework import
      if (req.file.mimetype === 'application/json' || req.file.originalname.endsWith('.json')) {
        try {
          const fs = await import('fs');
          const jsonContent = fs.readFileSync(req.file.path, 'utf8');
          const jsonData = JSON.parse(jsonContent);
          
          const { NiceFrameworkImporter } = await import("./nice-importer");
          const importer = new NiceFrameworkImporter();
          
          await importer.importFromJsonFile(jsonData);
          
          // Clean up the uploaded file
          fs.unlinkSync(req.file.path);
          
          res.status(200).json({
            message: "NICE Framework JSON imported successfully",
            status: "completed"
          });
          
        } catch (error) {
          console.error("Error processing JSON import:", error);
          res.status(500).json({ message: "JSON import failed" });
        }
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 req.file.originalname.endsWith('.xlsx')) {
        try {
          const fs = await import('fs');
          const XLSX = require('xlsx');
          
          // Read the Excel file
          const workbook = XLSX.readFile(req.file.path);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          let recordsImported = 0;
          
          // Process based on import type
          if (importType === 'tasks') {
            for (const row of jsonData) {
              try {
                // Expect columns: Code, Description (or similar variations)
                const code = row.Code || row.code || row['Task ID'] || row['TKS ID'];
                const description = row.Description || row.description || row['Task Description'] || row['TKS Description'];
                
                if (code && description) {
                  await storage.createTask({
                    code: String(code),
                    description: String(description)
                  });
                  recordsImported++;
                }
              } catch (error) {
                console.error(`Error importing task row:`, error);
              }
            }
          }
          
          // Update import history with actual results
          const importHistory = await storage.createImportHistory({
            filename: req.file.originalname,
            importType,
            recordsImported,
            status: "completed",
            metadata: { fileSize: req.file.size, mimetype: req.file.mimetype, totalRows: jsonData.length }
          });
          
          // Clean up the uploaded file
          fs.unlinkSync(req.file.path);
          
          res.status(200).json({
            message: `Successfully imported ${recordsImported} ${importType}`,
            importId: importHistory.id,
            recordsImported,
            status: "completed"
          });
          
        } catch (error) {
          console.error("Error processing Excel import:", error);
          res.status(500).json({ message: "Excel import failed" });
        }
      } else {
        // For other file types, create a placeholder import history record
        const importHistory = await storage.createImportHistory({
          filename: req.file.originalname,
          importType,
          recordsImported: 0,
          status: "pending",
          metadata: { fileSize: req.file.size, mimetype: req.file.mimetype }
        });

        res.status(201).json({
          message: "File uploaded successfully",
          importId: importHistory.id,
          status: "pending"
        });
      }
    } catch (error) {
      console.error("Error processing import:", error);
      res.status(500).json({ message: "Import failed" });
    }
  });

  // Export endpoint - restricted to admin users
  // SECURITY: Requires API key authentication
  app.get("/api/export/:type", requireAdminApiKey, async (req, res) => {
    try {
      const { type } = req.params;
      
      let data;
      switch (type) {
        case "work-roles":
          data = await storage.getWorkRoles();
          break;
        case "tasks":
          data = await storage.getTasks();
          break;
        case "knowledge-items":
          data = await storage.getKnowledgeItems();
          break;
        case "skills":
          data = await storage.getSkills();
          break;
        case "career-track-work-roles":
          data = await storage.getCareerTrackWorkRoleComposition();
          break;
        case "detailed-track-work-role-mapping":
          data = await storage.getDetailedCareerTrackWorkRoleMapping();
          break;
        case "certifications":
          data = await storage.getCertifications();
          break;
        case "career-tracks":
          data = await storage.getCareerTracks();
          break;
        case "certifications-with-mappings":
          data = await storage.getCertificationsWithMappings();
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.json"`);
      res.json(data);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Export failed" });
    }
  });

  // Relational navigation endpoints
  app.get("/api/certifications/:id/career-levels", async (req, res) => {
    try {
      const certificationId = parseInt(req.params.id);
      const careerLevels = await storage.getCareerLevelsByCertification(certificationId);
      res.json(careerLevels);
    } catch (error) {
      console.error("Error fetching career levels for certification:", error);
      res.status(500).json({ message: "Failed to fetch career levels" });
    }
  });

  app.get("/api/certifications/:id/tracks", async (req, res) => {
    try {
      const certificationId = parseInt(req.params.id);
      const tracks = await storage.getTracksByCertification(certificationId);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks for certification:", error);
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  app.get("/api/career-levels/:id/certifications", async (req, res) => {
    try {
      const careerLevelId = parseInt(req.params.id);
      const certifications = await storage.getCertificationsByCareerLevel(careerLevelId);
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications for career level:", error);
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.get("/api/certifications-with-mappings", async (req, res) => {
    try {
      const certifications = await storage.getCertificationsWithMappings();
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications with mappings:", error);
      res.status(500).json({ message: "Failed to fetch certifications with mappings" });
    }
  });

  // Test endpoint to verify routing
  // SECURITY: Protected in production to avoid exposing API info
  app.get("/api/test", restrictDiagnosticAccess, (req, res) => {
    res.json({ message: "API routing is working", timestamp: Date.now() });
  });

  // File upload endpoint for job posting analysis
  // SECURITY: AI endpoint with rate limiting and file content validation
  app.post("/api/extract-document", aiEndpointRateLimiter, upload.single('file'), async (req: MulterRequest, res) => {
    try {
      console.log("File upload request received");
      
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const fsModule = await import('fs');
      const pathModule = await import('path');
      
      const filePath = req.file.path;
      const fileExtension = pathModule.extname(req.file.originalname).toLowerCase();
      
      // SECURITY: Validate file content matches extension (magic bytes check)
      if (!validateFileMagicBytes(filePath, fileExtension)) {
        fsModule.unlinkSync(filePath);
        return res.status(400).json({ message: "File content does not match file extension" });
      }
      
      let extractedText = '';
      
      try {
        console.log("Attempting to read file:", filePath);
        
        if (fileExtension === '.pdf' || req.file.mimetype === 'application/pdf') {
          console.log("PDF file detected - returning error for now");
          return res.status(400).json({ 
            message: "PDF files require conversion. Please save your PDF as a .txt file or copy/paste the content directly into the job description field." 
          });
        } else if (fileExtension === '.txt' || req.file.mimetype.startsWith('text/')) {
          console.log("Reading as text file");
          extractedText = await fs.promises.readFile(filePath, 'utf-8');
        } else if (fileExtension === '.docx' || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          console.log("Processing DOCX file with mammoth");
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText = result.value;
          if (result.messages && result.messages.length > 0) {
            console.log("Document parsing warnings:", result.messages);
          }
        } else if (fileExtension === '.doc' || req.file.mimetype === 'application/msword') {
          console.log("Processing DOC file with mammoth");
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText = result.value;
          if (result.messages && result.messages.length > 0) {
            console.log("Document parsing warnings:", result.messages);
          }
        } else {
          console.log("Unsupported file format - trying as text fallback");
          extractedText = await fs.promises.readFile(filePath, 'utf-8');
        }
        
        console.log("Extracted text length:", extractedText.length);
        console.log("First 100 chars:", extractedText.substring(0, 100));
        
        // Clean up the uploaded file
        await fs.promises.unlink(filePath);
        console.log("File cleanup complete");
        
        // Parse structured job posting fields using AI
        const structuredData = await aiVacancyMapper.extractJobPostingFields(extractedText);
        
        // Extract potential job title from first line or filename as fallback
        const lines = extractedText.split('\n').filter(line => line.trim());
        let fallbackJobTitle = '';
        
        if (lines.length > 0) {
          const firstLine = lines[0].trim();
          if (firstLine.length < 100 && !firstLine.toLowerCase().includes('job description')) {
            fallbackJobTitle = firstLine;
          } else {
            // Use filename without extension as title
            fallbackJobTitle = path.basename(req.file.originalname, path.extname(req.file.originalname));
          }
        } else {
          fallbackJobTitle = path.basename(req.file.originalname, path.extname(req.file.originalname));
        }
        
        const result = {
          jobTitle: structuredData.jobTitle || fallbackJobTitle,
          jobDescription: structuredData.jobDescription || extractedText,
          requiredQualifications: structuredData.requiredQualifications || '',
          preferredQualifications: structuredData.preferredQualifications || '',
          salaryMin: structuredData.salaryMin || null,
          salaryMax: structuredData.salaryMax || null,
          location: structuredData.location || '',
          extractedText: extractedText,
          filename: req.file.originalname
        };
        
        console.log("Sending response:", { 
          jobTitle: result.jobTitle,
          descriptionLength: result.extractedText.length,
          filename: result.filename
        });
        
        res.json(result);
        
      } catch (readError: any) {
        console.error("File read error:", readError);
        // Clean up file on error
        try {
          await fs.promises.unlink(filePath);
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
        
        // More specific error handling
        const errorMessage = readError?.message || String(readError);
        if (errorMessage.includes('EISDIR')) {
          return res.status(400).json({ message: "Uploaded item is a directory, not a file" });
        } else if (errorMessage.includes('ENOENT')) {
          return res.status(400).json({ message: "File not found after upload" });
        } else {
          return res.status(400).json({ message: "Cannot read file - may be binary format. Please use text files (.txt) or paste content manually." });
        }
      }
      
    } catch (error) {
      console.error("Error extracting document:", error);
      res.status(500).json({ message: "Failed to extract text from document" });
    }
  });

  // Career Mapping API endpoints
  // SECURITY: AI endpoints have strict rate limiting (10 req/15min) and input sanitization
  app.post("/api/analyze-profile", aiEndpointRateLimiter, async (req, res) => {
    try {
      console.log("Received profile analysis request");
      
      // SECURITY: Validate input lengths before processing
      const lengthChecks = [
        validateInputLength(req.body.experience, 'experience', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.education, 'education', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.certifications, 'certifications', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.interests, 'interests', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.careerGoals, 'careerGoals', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
      ];
      
      const invalidCheck = lengthChecks.find(c => !c.valid);
      if (invalidCheck) {
        return res.status(400).json({ message: invalidCheck.error });
      }
      
      const profileSchema = z.object({
        experience: z.string().optional(),
        education: z.string().optional(),
        certifications: z.string().optional(),
        interests: z.string().optional(),
        careerGoals: z.string().optional(),
        currentLevel: z.string().optional()
      });

      const rawProfile = profileSchema.parse(req.body);
      
      // SECURITY: Sanitize text inputs while preserving undefined for optional fields
      // Use helper to ensure empty/whitespace-only inputs become undefined
      const sanitizeOrUndefined = (val: string | undefined): string | undefined => {
        if (!val) return undefined;
        const sanitized = sanitizeAIInput(val);
        return sanitized || undefined; // Empty string becomes undefined
      };
      
      const profile = {
        experience: sanitizeOrUndefined(rawProfile.experience),
        education: sanitizeOrUndefined(rawProfile.education),
        certifications: sanitizeOrUndefined(rawProfile.certifications),
        interests: sanitizeOrUndefined(rawProfile.interests),
        careerGoals: sanitizeOrUndefined(rawProfile.careerGoals),
        currentLevel: sanitizeOrUndefined(rawProfile.currentLevel),
      };
      
      const analysis = await aiCareerMapper.analyzeUserProfile(profile);
      console.log("Analysis result:", analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing profile:", error);
      res.status(500).json({ message: "Failed to analyze profile" });
    }
  });

  // Career tracks with TKS inheritance endpoints
  app.get("/api/career-tracks/:id/tks", getCareerTrackWithTKS);
  app.get("/api/career-tracks/:id/tks-progression", getCareerTrackTKSProgression);

  app.get("/api/career-tracks", async (req, res) => {
    try {
      // Support scope query parameter: nice-v2 (default), all, legacy-authentic
      const scope = req.query.scope as string || 'nice-v2';
      
      let tracks;
      if (scope === 'legacy-authentic') {
        // Return curated 20-track set for backward compatibility
        const authenticTrackIds = [31, 4, 5, 6, 8, 2, 35, 37, 30, 41, 48, 42, 38, 43, 39, 44, 45, 14, 22, 46];
        const allTracks = await storage.getCareerTracks();
        tracks = allTracks.filter(track => authenticTrackIds.includes(track.id));
      } else if (scope === 'all') {
        // Return all tracks (NICE v2.0 + legacy)
        tracks = await storage.getCareerTracks();
      } else {
        // Default: Return NICE Framework v2.0 tracks only
        tracks = await storage.getCareerTracks({ isNiceV2: true });
      }
      
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching career tracks:", error);
      res.status(500).json({ message: "Failed to fetch career tracks" });
    }
  });

  app.get("/api/career-tracks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const track = await storage.getCareerTrackWithPositions(id);
      if (!track) {
        return res.status(404).json({ message: "Career track not found" });
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching career track:", error);
      res.status(500).json({ message: "Failed to fetch career track" });
    }
  });

  // SECURITY: AI endpoint with rate limiting and input sanitization
  app.post("/api/track-recommendation/:id", aiEndpointRateLimiter, async (req, res) => {
    try {
      const trackId = safeParseId(req.params.id);
      if (trackId === null) {
        return res.status(400).json({ message: "Invalid track ID" });
      }
      
      const profileSchema = z.object({
        experience: z.string().optional(),
        education: z.string().optional(),
        certifications: z.string().optional(),
        interests: z.string().optional(),
        careerGoals: z.string().optional(),
        currentLevel: z.string().optional()
      });

      const rawProfile = profileSchema.parse(req.body);
      
      // SECURITY: Sanitize inputs while preserving undefined for optional fields
      const sanitizeOrUndefined = (val: string | undefined): string | undefined => {
        if (!val) return undefined;
        const sanitized = sanitizeAIInput(val);
        return sanitized || undefined;
      };
      
      const profile = {
        experience: sanitizeOrUndefined(rawProfile.experience),
        education: sanitizeOrUndefined(rawProfile.education),
        certifications: sanitizeOrUndefined(rawProfile.certifications),
        interests: sanitizeOrUndefined(rawProfile.interests),
        careerGoals: sanitizeOrUndefined(rawProfile.careerGoals),
        currentLevel: sanitizeOrUndefined(rawProfile.currentLevel),
      };
      
      const recommendation = await aiCareerMapper.getDetailedTrackRecommendation(trackId, profile);
      res.json(recommendation);
    } catch (error) {
      console.error("Error getting track recommendation:", error);
      res.status(500).json({ message: "Failed to get track recommendation" });
    }
  });

  // Vacancy Mapping API endpoints
  // SECURITY: AI endpoint with rate limiting and input sanitization
  app.post("/api/analyze-vacancy", aiEndpointRateLimiter, async (req, res) => {
    try {
      console.log("Received vacancy analysis request");
      
      // SECURITY: Validate input lengths before processing
      const lengthChecks = [
        validateInputLength(req.body.jobTitle, 'jobTitle', 500),
        validateInputLength(req.body.jobDescription, 'jobDescription', SECURITY_CONFIG.MAX_JOB_DESCRIPTION_LENGTH),
        validateInputLength(req.body.requiredQualifications, 'requiredQualifications', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.preferredQualifications, 'preferredQualifications', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.location, 'location', 500),
      ];
      
      const invalidCheck = lengthChecks.find(c => !c.valid);
      if (invalidCheck) {
        return res.status(400).json({ message: invalidCheck.error });
      }
      
      const vacancySchema = z.object({
        jobTitle: z.string(),
        jobDescription: z.string(),
        requiredQualifications: z.string().optional(),
        preferredQualifications: z.string().optional(),
        salaryMin: z.number().nullable().optional(),
        salaryMax: z.number().nullable().optional(),
        location: z.string().optional()
      });

      const rawPosting = vacancySchema.parse(req.body);
      
      // SECURITY: Sanitize inputs while preserving undefined for optional fields
      const sanitizeOrUndefined = (val: string | undefined, maxLen?: number): string | undefined => {
        if (!val) return undefined;
        const sanitized = sanitizeAIInput(val, maxLen);
        return sanitized || undefined;
      };
      
      const jobPosting = {
        jobTitle: sanitizeAIInput(rawPosting.jobTitle, 500),
        jobDescription: sanitizeAIInput(rawPosting.jobDescription, SECURITY_CONFIG.MAX_JOB_DESCRIPTION_LENGTH),
        requiredQualifications: sanitizeOrUndefined(rawPosting.requiredQualifications),
        preferredQualifications: sanitizeOrUndefined(rawPosting.preferredQualifications),
        salaryMin: rawPosting.salaryMin,
        salaryMax: rawPosting.salaryMax,
        location: sanitizeOrUndefined(rawPosting.location, 500),
      };
      
      const analysis = await aiVacancyMapper.analyzeJobPosting(jobPosting);
      console.log("Vacancy analysis result:", analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing vacancy:", error);
      res.status(500).json({ message: "Failed to analyze job posting" });
    }
  });

  // Resume Upload and Analysis API endpoint
  // SECURITY: AI endpoint with rate limiting and file content validation
  app.post("/api/upload-resume", aiEndpointRateLimiter, upload.single('resume'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      // SECURITY: Validate file content matches extension (magic bytes check)
      const extension = path.extname(req.file.originalname).toLowerCase();
      if (!validateFileMagicBytes(req.file.path, extension)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "File content does not match file extension" });
      }

      console.log("Processing uploaded resume:", req.file.originalname);
      
      let resumeText = "";
      
      // Parse different file types
      if (req.file.mimetype === 'text/plain') {
        resumeText = fs.readFileSync(req.file.path, 'utf-8');
      } else if (req.file.mimetype === 'application/pdf') {
        // Handle PDF files - temporarily disabled due to parsing issues
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "PDF support is temporarily unavailable. Please upload DOC, DOCX, or TXT files." });
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 req.file.mimetype === 'application/msword') {
        // Handle DOC/DOCX files
        try {
          const result = await mammoth.extractRawText({ path: req.file.path });
          resumeText = result.value;
          if (result.messages && result.messages.length > 0) {
            console.log("Document parsing warnings:", result.messages);
          }
        } catch (docError) {
          console.error("DOC/DOCX parsing error:", docError);
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: "Unable to parse Word document. Please try saving as TXT format." });
        }
      } else {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files." });
      }

      if (!resumeText.trim()) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Could not extract text from the resume file" });
      }

      console.log("Extracted resume text length:", resumeText.length);
      
      // Analyze resume with AI
      const analysis = await resumeAnalyzer.analyzeResume({
        filename: req.file.originalname,
        content: resumeText
      });
      
      // Save analysis to database
      const analysisId = await resumeAnalyzer.saveResumeAnalysis({
        filename: req.file.originalname,
        content: resumeText
      }, analysis);
      
      console.log("Resume analysis completed, saved with ID:", analysisId);
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.json({
        analysisId,
        ...analysis
      });
      
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }
      
      console.error("=== RESUME UPLOAD ERROR ===");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: "Failed to analyze resume: " + errorMessage,
        details: errorMessage.includes('OpenAI API') ? 'API service temporarily unavailable' : 'Resume processing error'
      });
    }
  });

  // Get resume analysis by ID
  app.get("/api/resume-analysis/:id", async (req, res) => {
    try {
      const analysisId = parseInt(req.params.id);
      const analysis = await storage.getResumeAnalysisById(analysisId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Resume analysis not found" });
      }

      // Parse the JSON fields that are stored as strings in the database
      const parsedAnalysis = {
        id: analysis.id,
        filename: analysis.filename,
        extractedData: typeof analysis.extractedData === 'string' 
          ? JSON.parse(analysis.extractedData) 
          : analysis.extractedData,
        recommendations: typeof analysis.careerRecommendations === 'string' 
          ? JSON.parse(analysis.careerRecommendations) 
          : analysis.careerRecommendations,
        overallAssessment: (() => {
          try {
            const metadata = typeof analysis.analysisMetadata === 'string' 
              ? JSON.parse(analysis.analysisMetadata) 
              : analysis.analysisMetadata || {};
            return metadata.overallAssessment || '';
          } catch {
            return '';
          }
        })(),
        strengthAreas: (() => {
          try {
            const metadata = typeof analysis.analysisMetadata === 'string' 
              ? JSON.parse(analysis.analysisMetadata) 
              : analysis.analysisMetadata || {};
            return metadata.strengthAreas || [];
          } catch {
            return [];
          }
        })(),
        developmentAreas: (() => {
          try {
            const metadata = typeof analysis.analysisMetadata === 'string' 
              ? JSON.parse(analysis.analysisMetadata) 
              : analysis.analysisMetadata || {};
            return metadata.developmentAreas || [];
          } catch {
            return [];
          }
        })(),
        validationFindings: (() => {
          try {
            const metadata = typeof analysis.analysisMetadata === 'string' 
              ? JSON.parse(analysis.analysisMetadata) 
              : analysis.analysisMetadata || {};
            return metadata.validationFindings || null;
          } catch {
            return null;
          }
        })(),
        createdAt: analysis.createdAt
      };

      res.json(parsedAnalysis);
    } catch (error) {
      console.error("Error fetching resume analysis:", error);
      res.status(500).json({ message: "Failed to fetch resume analysis" });
    }
  });

  // SECURITY: AI endpoint with rate limiting and input sanitization
  app.post("/api/work-role-match/:id", aiEndpointRateLimiter, async (req, res) => {
    try {
      const workRoleId = safeParseId(req.params.id);
      if (workRoleId === null) {
        return res.status(400).json({ message: "Invalid work role ID" });
      }
      
      // SECURITY: Validate input lengths before processing
      const lengthChecks = [
        validateInputLength(req.body.jobTitle, 'jobTitle', 500),
        validateInputLength(req.body.jobDescription, 'jobDescription', SECURITY_CONFIG.MAX_JOB_DESCRIPTION_LENGTH),
        validateInputLength(req.body.requiredQualifications, 'requiredQualifications', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
        validateInputLength(req.body.preferredQualifications, 'preferredQualifications', SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH),
      ];
      
      const invalidCheck = lengthChecks.find(c => !c.valid);
      if (invalidCheck) {
        return res.status(400).json({ message: invalidCheck.error });
      }
      
      const vacancySchema = z.object({
        jobTitle: z.string(),
        jobDescription: z.string(),
        requiredQualifications: z.string().optional(),
        preferredQualifications: z.string().optional()
      });

      const rawPosting = vacancySchema.parse(req.body);
      
      // SECURITY: Sanitize inputs while preserving undefined for optional fields
      const sanitizeOrUndefined = (val: string | undefined, maxLen?: number): string | undefined => {
        if (!val) return undefined;
        const sanitized = sanitizeAIInput(val, maxLen);
        return sanitized || undefined;
      };
      
      const jobPosting = {
        jobTitle: sanitizeAIInput(rawPosting.jobTitle, 500),
        jobDescription: sanitizeAIInput(rawPosting.jobDescription, SECURITY_CONFIG.MAX_JOB_DESCRIPTION_LENGTH),
        requiredQualifications: sanitizeOrUndefined(rawPosting.requiredQualifications),
        preferredQualifications: sanitizeOrUndefined(rawPosting.preferredQualifications),
      };
      
      const match = await aiVacancyMapper.getDetailedWorkRoleMatch(workRoleId, jobPosting);
      res.json(match);
    } catch (error) {
      console.error("Error getting work role match:", error);
      res.status(500).json({ message: "Failed to get work role match" });
    }
  });

  // Framework statistics endpoint
  app.get("/api/framework-stats", async (req, res) => {
    try {
      const stats = await storage.getFrameworkStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching framework stats:", error);
      res.status(500).json({ message: "Failed to fetch framework stats" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.get("/api/certifications/by-level/:level", async (req, res) => {
    try {
      const level = req.params.level;
      const certifications = await storage.getCertificationsByLevel(level);
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications by level:", error);
      res.status(500).json({ message: "Failed to fetch certifications by level" });
    }
  });

  app.get("/api/certifications/by-issuer/:issuer", async (req, res) => {
    try {
      const issuer = req.params.issuer;
      const certifications = await storage.getCertificationsByIssuer(issuer);
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications by issuer:", error);
      res.status(500).json({ message: "Failed to fetch certifications by issuer" });
    }
  });

  const httpServer = createServer(app);
  
  // Clean up expired sessions on startup and periodically (every 15 minutes)
  cleanupExpiredSessions().catch(err => console.error("Initial session cleanup failed:", err));
  setInterval(() => {
    cleanupExpiredSessions().catch(err => console.error("Periodic session cleanup failed:", err));
  }, 15 * 60 * 1000); // 15 minutes
  
  return httpServer;
}
