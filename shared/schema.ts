import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Specialty Areas table
export const specialtyAreas = pgTable("specialty_areas", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Work Roles table
export const workRoles = pgTable("work_roles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  specialtyAreaId: integer("specialty_area_id").references(() => specialtyAreas.id),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Items table
export const knowledgeItems = pgTable("knowledge_items", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Abilities table
export const abilities = pgTable("abilities", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relationship tables
export const workRoleTasks = pgTable("work_role_tasks", {
  id: serial("id").primaryKey(),
  workRoleId: integer("work_role_id").references(() => workRoles.id).notNull(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
});

export const workRoleKnowledge = pgTable("work_role_knowledge", {
  id: serial("id").primaryKey(),
  workRoleId: integer("work_role_id").references(() => workRoles.id).notNull(),
  knowledgeItemId: integer("knowledge_item_id").references(() => knowledgeItems.id).notNull(),
});

export const workRoleSkills = pgTable("work_role_skills", {
  id: serial("id").primaryKey(),
  workRoleId: integer("work_role_id").references(() => workRoles.id).notNull(),
  skillId: integer("skill_id").references(() => skills.id).notNull(),
});

export const workRoleAbilities = pgTable("work_role_abilities", {
  id: serial("id").primaryKey(),
  workRoleId: integer("work_role_id").references(() => workRoles.id).notNull(),
  abilityId: integer("ability_id").references(() => abilities.id).notNull(),
});

// Import History table for tracking data imports
export const importHistory = pgTable("import_history", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  importType: text("import_type").notNull(),
  recordsImported: integer("records_imported").notNull(),
  status: text("status").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  specialtyAreas: many(specialtyAreas),
  workRoles: many(workRoles),
}));

export const specialtyAreasRelations = relations(specialtyAreas, ({ one, many }) => ({
  category: one(categories, {
    fields: [specialtyAreas.categoryId],
    references: [categories.id],
  }),
  workRoles: many(workRoles),
}));

export const workRolesRelations = relations(workRoles, ({ one, many }) => ({
  specialtyArea: one(specialtyAreas, {
    fields: [workRoles.specialtyAreaId],
    references: [specialtyAreas.id],
  }),
  category: one(categories, {
    fields: [workRoles.categoryId],
    references: [categories.id],
  }),
  workRoleTasks: many(workRoleTasks),
  workRoleKnowledge: many(workRoleKnowledge),
  workRoleSkills: many(workRoleSkills),
  workRoleAbilities: many(workRoleAbilities),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  workRoleTasks: many(workRoleTasks),
}));

export const knowledgeItemsRelations = relations(knowledgeItems, ({ many }) => ({
  workRoleKnowledge: many(workRoleKnowledge),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  workRoleSkills: many(workRoleSkills),
}));

export const abilitiesRelations = relations(abilities, ({ many }) => ({
  workRoleAbilities: many(workRoleAbilities),
}));

export const workRoleTasksRelations = relations(workRoleTasks, ({ one }) => ({
  workRole: one(workRoles, {
    fields: [workRoleTasks.workRoleId],
    references: [workRoles.id],
  }),
  task: one(tasks, {
    fields: [workRoleTasks.taskId],
    references: [tasks.id],
  }),
}));

export const workRoleKnowledgeRelations = relations(workRoleKnowledge, ({ one }) => ({
  workRole: one(workRoles, {
    fields: [workRoleKnowledge.workRoleId],
    references: [workRoles.id],
  }),
  knowledgeItem: one(knowledgeItems, {
    fields: [workRoleKnowledge.knowledgeItemId],
    references: [knowledgeItems.id],
  }),
}));

export const workRoleSkillsRelations = relations(workRoleSkills, ({ one }) => ({
  workRole: one(workRoles, {
    fields: [workRoleSkills.workRoleId],
    references: [workRoles.id],
  }),
  skill: one(skills, {
    fields: [workRoleSkills.skillId],
    references: [skills.id],
  }),
}));

export const workRoleAbilitiesRelations = relations(workRoleAbilities, ({ one }) => ({
  workRole: one(workRoles, {
    fields: [workRoleAbilities.workRoleId],
    references: [workRoles.id],
  }),
  ability: one(abilities, {
    fields: [workRoleAbilities.abilityId],
    references: [abilities.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertSpecialtyAreaSchema = createInsertSchema(specialtyAreas).omit({
  id: true,
  createdAt: true,
});

export const insertWorkRoleSchema = createInsertSchema(workRoles).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertKnowledgeItemSchema = createInsertSchema(knowledgeItems).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertAbilitySchema = createInsertSchema(abilities).omit({
  id: true,
  createdAt: true,
});

export const insertImportHistorySchema = createInsertSchema(importHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type SpecialtyArea = typeof specialtyAreas.$inferSelect;
export type InsertSpecialtyArea = z.infer<typeof insertSpecialtyAreaSchema>;

export type WorkRole = typeof workRoles.$inferSelect;
export type InsertWorkRole = z.infer<typeof insertWorkRoleSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type InsertKnowledgeItem = z.infer<typeof insertKnowledgeItemSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Ability = typeof abilities.$inferSelect;
export type InsertAbility = z.infer<typeof insertAbilitySchema>;

export type ImportHistory = typeof importHistory.$inferSelect;
export type InsertImportHistory = z.infer<typeof insertImportHistorySchema>;
