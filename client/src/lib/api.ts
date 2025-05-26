import { apiRequest } from "./queryClient";

export const api = {
  // Statistics
  getStatistics: () => fetch("/api/statistics").then((res) => res.json()),

  // Search
  search: (query: string) => fetch(`/api/search?q=${encodeURIComponent(query)}`).then((res) => res.json()),

  // Categories
  getCategories: () => fetch("/api/categories").then((res) => res.json()),
  createCategory: (data: any) => apiRequest("POST", "/api/categories", data),

  // Specialty Areas
  getSpecialtyAreas: () => fetch("/api/specialty-areas").then((res) => res.json()),
  createSpecialtyArea: (data: any) => apiRequest("POST", "/api/specialty-areas", data),

  // Work Roles
  getWorkRoles: () => fetch("/api/work-roles").then((res) => res.json()),
  getWorkRole: (id: number) => fetch(`/api/work-roles/${id}`).then((res) => res.json()),
  createWorkRole: (data: any) => apiRequest("POST", "/api/work-roles", data),

  // Tasks
  getTasks: () => fetch("/api/tasks").then((res) => res.json()),
  createTask: (data: any) => apiRequest("POST", "/api/tasks", data),

  // Knowledge Items
  getKnowledgeItems: () => fetch("/api/knowledge-items").then((res) => res.json()),
  createKnowledgeItem: (data: any) => apiRequest("POST", "/api/knowledge-items", data),

  // Skills
  getSkills: () => fetch("/api/skills").then((res) => res.json()),
  createSkill: (data: any) => apiRequest("POST", "/api/skills", data),

  // Abilities
  getAbilities: () => fetch("/api/abilities").then((res) => res.json()),
  createAbility: (data: any) => apiRequest("POST", "/api/abilities", data),

  // Import History
  getImportHistory: () => fetch("/api/import-history").then((res) => res.json()),

  // Export
  exportData: (type: string) => window.open(`/api/export/${type}`, '_blank'),
};
