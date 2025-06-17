import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";

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

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  // Statistics endpoint
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
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



  // Import History routes
  app.get("/api/import-history", async (req, res) => {
    try {
      const history = await storage.getImportHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching import history:", error);
      res.status(500).json({ message: "Failed to fetch import history" });
    }
  });

  // NICE Framework automated import endpoint
  app.post("/api/import/nice-framework", async (req, res) => {
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

  // File upload and import endpoint
  app.post("/api/import", upload.single('file'), async (req: any, res) => {
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

  // Export endpoint
  app.get("/api/export/:type", async (req, res) => {
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

  // File upload endpoint for job posting analysis
  app.post("/api/extract-document", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      console.log("File upload request received");
      
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });

      const fs = await import('fs');
      const path = await import('path');
      
      let extractedText = '';
      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      try {
        console.log("Attempting to read file:", filePath);
        
        if (fileExtension === '.txt' || req.file.mimetype.startsWith('text/')) {
          console.log("Reading as text file");
          extractedText = await fs.promises.readFile(filePath, 'utf-8');
        } else {
          console.log("Reading as fallback text (may not work for binary files)");
          extractedText = await fs.promises.readFile(filePath, 'utf-8');
        }
        
        console.log("Extracted text length:", extractedText.length);
        console.log("First 100 chars:", extractedText.substring(0, 100));
        
        // Clean up the uploaded file
        await fs.promises.unlink(filePath);
        console.log("File cleanup complete");
        
        // Extract potential job title from first line or filename
        const lines = extractedText.split('\n').filter(line => line.trim());
        let jobTitle = '';
        
        if (lines.length > 0) {
          const firstLine = lines[0].trim();
          if (firstLine.length < 100 && !firstLine.toLowerCase().includes('job description')) {
            jobTitle = firstLine;
          } else {
            // Use filename without extension as title
            jobTitle = path.basename(req.file.originalname, path.extname(req.file.originalname));
          }
        } else {
          jobTitle = path.basename(req.file.originalname, path.extname(req.file.originalname));
        }
        
        const result = {
          jobTitle,
          jobDescription: extractedText,
          filename: req.file.originalname
        };
        
        console.log("Sending response:", { 
          jobTitle: result.jobTitle,
          descriptionLength: result.jobDescription.length,
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
  app.post("/api/analyze-profile", async (req, res) => {
    try {
      console.log("Received profile analysis request:", req.body);
      
      const profileSchema = z.object({
        experience: z.string().optional(),
        education: z.string().optional(),
        certifications: z.string().optional(),
        interests: z.string().optional(),
        careerGoals: z.string().optional(),
        currentLevel: z.string().optional()
      });

      const profile = profileSchema.parse(req.body);
      console.log("Parsed profile:", profile);
      
      const analysis = await aiCareerMapper.analyzeUserProfile(profile);
      console.log("Analysis result:", analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing profile:", error);
      res.status(500).json({ message: "Failed to analyze profile" });
    }
  });

  app.get("/api/career-tracks", async (req, res) => {
    try {
      // Return only the authentic 19 career tracks
      const authenticTrackIds = [31, 4, 5, 6, 8, 2, 35, 37, 30, 41, 48, 42, 38, 43, 39, 44, 45, 14, 22];
      const allTracks = await storage.getCareerTracks();
      const tracks = allTracks.filter(track => authenticTrackIds.includes(track.id));
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

  app.post("/api/track-recommendation/:id", async (req, res) => {
    try {
      const trackId = parseInt(req.params.id);
      const profileSchema = z.object({
        experience: z.string().optional(),
        education: z.string().optional(),
        certifications: z.string().optional(),
        interests: z.string().optional(),
        careerGoals: z.string().optional(),
        currentLevel: z.string().optional()
      });

      const profile = profileSchema.parse(req.body);
      const recommendation = await aiCareerMapper.getDetailedTrackRecommendation(trackId, profile);
      res.json(recommendation);
    } catch (error) {
      console.error("Error getting track recommendation:", error);
      res.status(500).json({ message: "Failed to get track recommendation" });
    }
  });

  // Vacancy Mapping API endpoints
  app.post("/api/analyze-vacancy", async (req, res) => {
    try {
      console.log("Received vacancy analysis request:", req.body);
      
      const vacancySchema = z.object({
        jobTitle: z.string(),
        jobDescription: z.string(),
        requiredQualifications: z.string().optional(),
        preferredQualifications: z.string().optional()
      });

      const jobPosting = vacancySchema.parse(req.body);
      console.log("Parsed job posting:", jobPosting);
      
      const analysis = await aiVacancyMapper.analyzeJobPosting(jobPosting);
      console.log("Vacancy analysis result:", analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing vacancy:", error);
      res.status(500).json({ message: "Failed to analyze job posting" });
    }
  });

  app.post("/api/work-role-match/:id", async (req, res) => {
    try {
      const workRoleId = parseInt(req.params.id);
      const vacancySchema = z.object({
        jobTitle: z.string(),
        jobDescription: z.string(),
        requiredQualifications: z.string().optional(),
        preferredQualifications: z.string().optional()
      });

      const jobPosting = vacancySchema.parse(req.body);
      const match = await aiVacancyMapper.getDetailedWorkRoleMatch(workRoleId, jobPosting);
      res.json(match);
    } catch (error) {
      console.error("Error getting work role match:", error);
      res.status(500).json({ message: "Failed to get work role match" });
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
  return httpServer;
}
