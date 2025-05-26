import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import { 
  insertCategorySchema, insertSpecialtyAreaSchema, insertWorkRoleSchema, 
  insertTaskSchema, insertKnowledgeItemSchema, insertSkillSchema, insertAbilitySchema 
} from "@shared/schema";

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

  // Abilities routes
  app.get("/api/abilities", async (req, res) => {
    try {
      const abilities = await storage.getAbilities();
      res.json(abilities);
    } catch (error) {
      console.error("Error fetching abilities:", error);
      res.status(500).json({ message: "Failed to fetch abilities" });
    }
  });

  app.post("/api/abilities", async (req, res) => {
    try {
      const ability = insertAbilitySchema.parse(req.body);
      const created = await storage.createAbility(ability);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating ability:", error);
      res.status(400).json({ message: "Failed to create ability" });
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

  // File upload and import endpoint
  app.post("/api/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { importType } = req.body;
      if (!importType) {
        return res.status(400).json({ message: "Import type is required" });
      }

      // For now, we'll create a placeholder import history record
      // In a real implementation, you would parse the Excel/CSV file here
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
        case "abilities":
          data = await storage.getAbilities();
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

  const httpServer = createServer(app);
  return httpServer;
}
