import { 
  categories, specialtyAreas, workRoles, tasks, knowledgeItems, skills,
  workRoleTasks, workRoleKnowledge, workRoleSkills, importHistory,
  type Category, type InsertCategory,
  type SpecialtyArea, type InsertSpecialtyArea,
  type WorkRole, type InsertWorkRole,
  type Task, type InsertTask,
  type KnowledgeItem, type InsertKnowledgeItem,
  type Skill, type InsertSkill,
  type ImportHistory, type InsertImportHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Specialty Areas
  getSpecialtyAreas(): Promise<SpecialtyArea[]>;
  getSpecialtyAreaById(id: number): Promise<SpecialtyArea | undefined>;
  createSpecialtyArea(specialtyArea: InsertSpecialtyArea): Promise<SpecialtyArea>;
  updateSpecialtyArea(id: number, specialtyArea: Partial<InsertSpecialtyArea>): Promise<SpecialtyArea | undefined>;
  deleteSpecialtyArea(id: number): Promise<boolean>;

  // Work Roles
  getWorkRoles(): Promise<WorkRole[]>;
  getWorkRoleById(id: number): Promise<WorkRole | undefined>;
  getWorkRoleWithRelations(id: number): Promise<any>;
  createWorkRole(workRole: InsertWorkRole): Promise<WorkRole>;
  updateWorkRole(id: number, workRole: Partial<InsertWorkRole>): Promise<WorkRole | undefined>;
  deleteWorkRole(id: number): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Knowledge Items
  getKnowledgeItems(): Promise<KnowledgeItem[]>;
  getKnowledgeItemById(id: number): Promise<KnowledgeItem | undefined>;
  createKnowledgeItem(knowledgeItem: InsertKnowledgeItem): Promise<KnowledgeItem>;
  updateKnowledgeItem(id: number, knowledgeItem: Partial<InsertKnowledgeItem>): Promise<KnowledgeItem | undefined>;
  deleteKnowledgeItem(id: number): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  getSkillById(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Search
  searchAll(query: string): Promise<any>;

  // Statistics
  getStatistics(): Promise<any>;

  // Import History
  getImportHistory(): Promise<ImportHistory[]>;
  createImportHistory(importHistory: InsertImportHistory): Promise<ImportHistory>;

  // Bulk operations
  bulkCreateWorkRoles(workRoles: InsertWorkRole[]): Promise<WorkRole[]>;
  bulkCreateTasks(tasks: InsertTask[]): Promise<Task[]>;
  bulkCreateKnowledgeItems(knowledgeItems: InsertKnowledgeItem[]): Promise<KnowledgeItem[]>;
  bulkCreateSkills(skills: InsertSkill[]): Promise<Skill[]>;

}

export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Specialty Areas
  async getSpecialtyAreas(): Promise<SpecialtyArea[]> {
    return await db.select().from(specialtyAreas).orderBy(specialtyAreas.name);
  }

  async getSpecialtyAreaById(id: number): Promise<SpecialtyArea | undefined> {
    const [specialtyArea] = await db.select().from(specialtyAreas).where(eq(specialtyAreas.id, id));
    return specialtyArea || undefined;
  }

  async createSpecialtyArea(specialtyArea: InsertSpecialtyArea): Promise<SpecialtyArea> {
    const [created] = await db.insert(specialtyAreas).values(specialtyArea).returning();
    return created;
  }

  async updateSpecialtyArea(id: number, specialtyArea: Partial<InsertSpecialtyArea>): Promise<SpecialtyArea | undefined> {
    const [updated] = await db.update(specialtyAreas).set(specialtyArea).where(eq(specialtyAreas.id, id)).returning();
    return updated || undefined;
  }

  async deleteSpecialtyArea(id: number): Promise<boolean> {
    const result = await db.delete(specialtyAreas).where(eq(specialtyAreas.id, id));
    return result.rowCount > 0;
  }

  // Work Roles
  async getWorkRoles(): Promise<WorkRole[]> {
    return await db.select().from(workRoles).orderBy(workRoles.code);
  }

  async getWorkRoleById(id: number): Promise<WorkRole | undefined> {
    const [workRole] = await db.select().from(workRoles).where(eq(workRoles.id, id));
    return workRole || undefined;
  }

  async getWorkRoleWithRelations(id: number): Promise<any> {
    const workRole = await db.query.workRoles.findFirst({
      where: eq(workRoles.id, id),
      with: {
        category: true,
        specialtyArea: true,
        workRoleTasks: {
          with: {
            task: true,
          },
        },
        workRoleKnowledge: {
          with: {
            knowledgeItem: true,
          },
        },
        workRoleSkills: {
          with: {
            skill: true,
          },
        },
        workRoleAbilities: {
          with: {
            ability: true,
          },
        },
      },
    });
    return workRole;
  }

  async createWorkRole(workRole: InsertWorkRole): Promise<WorkRole> {
    const [created] = await db.insert(workRoles).values(workRole).returning();
    return created;
  }

  async updateWorkRole(id: number, workRole: Partial<InsertWorkRole>): Promise<WorkRole | undefined> {
    const [updated] = await db.update(workRoles).set(workRole).where(eq(workRoles.id, id)).returning();
    return updated || undefined;
  }

  async deleteWorkRole(id: number): Promise<boolean> {
    const result = await db.delete(workRoles).where(eq(workRoles.id, id));
    return result.rowCount > 0;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(tasks.code);
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values(task).returning();
    return created;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updated] = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return updated || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  // Knowledge Items
  async getKnowledgeItems(): Promise<KnowledgeItem[]> {
    return await db.select().from(knowledgeItems).orderBy(knowledgeItems.code);
  }

  async getKnowledgeItemById(id: number): Promise<KnowledgeItem | undefined> {
    const [knowledgeItem] = await db.select().from(knowledgeItems).where(eq(knowledgeItems.id, id));
    return knowledgeItem || undefined;
  }

  async createKnowledgeItem(knowledgeItem: InsertKnowledgeItem): Promise<KnowledgeItem> {
    const [created] = await db.insert(knowledgeItems).values(knowledgeItem).returning();
    return created;
  }

  async updateKnowledgeItem(id: number, knowledgeItem: Partial<InsertKnowledgeItem>): Promise<KnowledgeItem | undefined> {
    const [updated] = await db.update(knowledgeItems).set(knowledgeItem).where(eq(knowledgeItems.id, id)).returning();
    return updated || undefined;
  }

  async deleteKnowledgeItem(id: number): Promise<boolean> {
    const result = await db.delete(knowledgeItems).where(eq(knowledgeItems.id, id));
    return result.rowCount > 0;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.code);
  }

  async getSkillById(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill || undefined;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [created] = await db.insert(skills).values(skill).returning();
    return created;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [updated] = await db.update(skills).set(skill).where(eq(skills.id, id)).returning();
    return updated || undefined;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return result.rowCount > 0;
  }



  // Search
  async searchAll(query: string): Promise<any> {
    const searchPattern = `%${query}%`;
    
    const [workRoleResults, taskResults, knowledgeResults, skillResults] = await Promise.all([
      db.select().from(workRoles).where(ilike(workRoles.name, searchPattern)).limit(10),
      db.select().from(tasks).where(ilike(tasks.description, searchPattern)).limit(10),
      db.select().from(knowledgeItems).where(ilike(knowledgeItems.description, searchPattern)).limit(10),
      db.select().from(skills).where(ilike(skills.description, searchPattern)).limit(10),
    ]);

    return {
      workRoles: workRoleResults,
      tasks: taskResults,
      knowledge: knowledgeResults,
      skills: skillResults,
    };
  }

  // Statistics
  async getStatistics(): Promise<any> {
    const [
      workRolesCount,
      tasksCount,
      knowledgeCount,
      skillsCount,
      categoriesCount,
      specialtyAreasCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(workRoles),
      db.select({ count: count() }).from(tasks),
      db.select({ count: count() }).from(knowledgeItems),
      db.select({ count: count() }).from(skills),
      db.select({ count: count() }).from(categories),
      db.select({ count: count() }).from(specialtyAreas),
    ]);

    return {
      workRoles: Number(workRolesCount[0].count) || 0,
      tasks: Number(tasksCount[0].count) || 0,
      knowledge: Number(knowledgeCount[0].count) || 0,
      skills: Number(skillsCount[0].count) || 0,
      categories: Number(categoriesCount[0].count) || 0,
      specialtyAreas: Number(specialtyAreasCount[0].count) || 0,
    };
  }

  // Import History
  async getImportHistory(): Promise<ImportHistory[]> {
    return await db.select().from(importHistory).orderBy(desc(importHistory.createdAt));
  }

  async createImportHistory(importHistoryData: InsertImportHistory): Promise<ImportHistory> {
    const [created] = await db.insert(importHistory).values(importHistoryData).returning();
    return created;
  }

  // Bulk operations
  async bulkCreateWorkRoles(workRolesList: InsertWorkRole[]): Promise<WorkRole[]> {
    if (workRolesList.length === 0) return [];
    return await db.insert(workRoles).values(workRolesList).returning();
  }

  async bulkCreateTasks(tasksList: InsertTask[]): Promise<Task[]> {
    if (tasksList.length === 0) return [];
    return await db.insert(tasks).values(tasksList).returning();
  }

  async bulkCreateKnowledgeItems(knowledgeItemsList: InsertKnowledgeItem[]): Promise<KnowledgeItem[]> {
    if (knowledgeItemsList.length === 0) return [];
    return await db.insert(knowledgeItems).values(knowledgeItemsList).returning();
  }

  async bulkCreateSkills(skillsList: InsertSkill[]): Promise<Skill[]> {
    if (skillsList.length === 0) return [];
    return await db.insert(skills).values(skillsList).returning();
  }


}

export const storage = new DatabaseStorage();
