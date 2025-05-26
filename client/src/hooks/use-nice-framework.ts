import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useNiceFramework() {
  const {
    data: statistics,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["/api/statistics"],
    queryFn: api.getStatistics,
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: api.getCategories,
  });

  const {
    data: specialtyAreas,
    isLoading: isLoadingSpecialtyAreas,
    error: specialtyAreasError,
  } = useQuery({
    queryKey: ["/api/specialty-areas"],
    queryFn: api.getSpecialtyAreas,
  });

  const {
    data: workRoles,
    isLoading: isLoadingWorkRoles,
    error: workRolesError,
  } = useQuery({
    queryKey: ["/api/work-roles"],
    queryFn: api.getWorkRoles,
  });

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: api.getTasks,
  });

  const {
    data: knowledgeItems,
    isLoading: isLoadingKnowledge,
    error: knowledgeError,
  } = useQuery({
    queryKey: ["/api/knowledge-items"],
    queryFn: api.getKnowledgeItems,
  });

  const {
    data: skills,
    isLoading: isLoadingSkills,
    error: skillsError,
  } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: api.getSkills,
  });

  const {
    data: abilities,
    isLoading: isLoadingAbilities,
    error: abilitiesError,
  } = useQuery({
    queryKey: ["/api/abilities"],
    queryFn: api.getAbilities,
  });

  const {
    data: importHistory,
    isLoading: isLoadingImportHistory,
    error: importHistoryError,
  } = useQuery({
    queryKey: ["/api/import-history"],
    queryFn: api.getImportHistory,
  });

  return {
    statistics,
    isLoadingStats,
    statsError,
    categories,
    isLoadingCategories,
    categoriesError,
    specialtyAreas,
    isLoadingSpecialtyAreas,
    specialtyAreasError,
    workRoles,
    isLoadingWorkRoles,
    workRolesError,
    tasks,
    isLoadingTasks,
    tasksError,
    knowledgeItems,
    isLoadingKnowledge,
    knowledgeError,
    skills,
    isLoadingSkills,
    skillsError,
    abilities,
    isLoadingAbilities,
    abilitiesError,
    importHistory,
    isLoadingImportHistory,
    importHistoryError,
  };
}
