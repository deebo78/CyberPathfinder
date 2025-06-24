import { db } from "../db";
import { 
  careerTracks, 
  careerLevels, 
  careerLevelWorkRoles,
  careerLevelTasks,
  careerLevelKnowledge, 
  careerLevelSkills,
  workRoles,
  tasks,
  knowledgeItems,
  skills,
  categories
} from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Get career track with complete TKS inheritance from NICE Framework
 */
export async function getCareerTrackWithTKS(req: any, res: any) {
  try {
    const { id } = req.params;
    
    // Get career track with all levels and their TKS requirements
    const careerTrack = await db.query.careerTracks.findFirst({
      where: eq(careerTracks.id, parseInt(id)),
      with: {
        careerLevels: {
          orderBy: (careerLevels, { asc }) => [asc(careerLevels.sortOrder)],
          with: {
            careerLevelWorkRoles: {
              with: {
                workRole: {
                  with: {
                    category: true
                  }
                }
              }
            },
            careerLevelTasks: {
              where: eq(careerLevelTasks.source, 'inherited'),
              with: {
                task: true
              }
            },
            careerLevelKnowledge: {
              where: eq(careerLevelKnowledge.source, 'inherited'),
              with: {
                knowledgeItem: true
              }
            },
            careerLevelSkills: {
              where: eq(careerLevelSkills.source, 'inherited'),
              with: {
                skill: true
              }
            }
          }
        }
      }
    });

    if (!careerTrack) {
      return res.status(404).json({ error: "Career track not found" });
    }

    // Transform data to show TKS inheritance structure
    const enrichedCareerTrack = {
      ...careerTrack,
      careerLevels: careerTrack.careerLevels.map(level => ({
        ...level,
        niceFrameworkMappings: {
          workRoles: level.careerLevelWorkRoles.map(clwr => ({
            code: clwr.workRole.code,
            name: clwr.workRole.name,
            category: clwr.workRole.category?.name,
            priority: clwr.priority
          })),
          inheritedTKS: {
            tasks: level.careerLevelTasks.map(clt => ({
              code: clt.task.code,
              description: clt.task.description,
              importance: clt.importance
            })),
            knowledge: level.careerLevelKnowledge.map(clk => ({
              code: clk.knowledgeItem.code,
              description: clk.knowledgeItem.description,
              importance: clk.importance
            })),
            skills: level.careerLevelSkills.map(cls => ({
              code: cls.skill.code,
              description: cls.skill.description,
              importance: cls.importance
            }))
          },
          tksStats: {
            taskCount: level.careerLevelTasks.length,
            knowledgeCount: level.careerLevelKnowledge.length,
            skillCount: level.careerLevelSkills.length
          }
        }
      }))
    };

    res.json(enrichedCareerTrack);
  } catch (error) {
    console.error("Error fetching career track with TKS:", error);
    res.status(500).json({ error: "Failed to fetch career track TKS data" });
  }
}

/**
 * Get TKS requirements comparison across career levels
 */
export async function getCareerTrackTKSProgression(req: any, res: any) {
  try {
    const { id } = req.params;
    
    const progression = await db
      .select({
        levelName: careerLevels.name,
        sortOrder: careerLevels.sortOrder,
        experienceRange: careerLevels.experienceRange,
        taskCount: db.$count(careerLevelTasks, eq(careerLevelTasks.careerLevelId, careerLevels.id)),
        knowledgeCount: db.$count(careerLevelKnowledge, eq(careerLevelKnowledge.careerLevelId, careerLevels.id)),
        skillCount: db.$count(careerLevelSkills, eq(careerLevelSkills.careerLevelId, careerLevels.id))
      })
      .from(careerLevels)
      .where(eq(careerLevels.careerTrackId, parseInt(id)))
      .orderBy(careerLevels.sortOrder);

    res.json({
      careerTrackId: parseInt(id),
      tksProgression: progression
    });
  } catch (error) {
    console.error("Error fetching TKS progression:", error);
    res.status(500).json({ error: "Failed to fetch TKS progression data" });
  }
}