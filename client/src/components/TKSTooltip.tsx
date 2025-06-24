import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BookOpen, Target, Zap } from 'lucide-react';

interface TKSData {
  tasks: Array<{ code: string; description: string; importance: string }>;
  knowledge: Array<{ code: string; description: string; importance: string }>;
  skills: Array<{ code: string; description: string; importance: string }>;
  workRoles: Array<{ code: string; name: string; category: string; priority: number }>;
  tksStats: { taskCount: number; knowledgeCount: number; skillCount: number };
}

interface TKSTooltipProps {
  careerTrackId: number;
  levelName: string;
  children: React.ReactNode;
  className?: string;
}

export function TKSTooltip({ careerTrackId, levelName, children, className }: TKSTooltipProps) {
  const [tksData, setTksData] = useState<TKSData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchTKSData = async () => {
    if (tksData) return; // Already loaded

    setLoading(true);
    try {
      const response = await fetch(`/api/career-tracks/${careerTrackId}/tks`);
      if (response.ok) {
        const data = await response.json();
        const levelData = data.careerLevels?.find((level: any) => level.name === levelName);
        if (levelData) {
          // Extract TKS data from the level data structure
          const tasks = levelData.careerLevelTasks?.map((clt: any) => ({
            code: clt.task.code,
            description: clt.task.description,
            importance: clt.importance || 'medium'
          })) || [];
          
          const knowledge = levelData.careerLevelKnowledge?.map((clk: any) => ({
            code: clk.knowledgeItem.code,
            description: clk.knowledgeItem.description,
            importance: clk.importance || 'medium'
          })) || [];
          
          const skills = levelData.careerLevelSkills?.map((cls: any) => ({
            code: cls.skill.code,
            description: cls.skill.description,
            importance: cls.importance || 'medium'
          })) || [];
          
          const workRoles = levelData.careerLevelWorkRoles?.map((clwr: any) => ({
            code: clwr.workRole.code,
            name: clwr.workRole.name,
            category: clwr.workRole.category?.name || 'Unknown',
            priority: clwr.priority || 1
          })) || [];
          
          setTksData({
            tasks,
            knowledge,
            skills,
            workRoles,
            tksStats: {
              taskCount: tasks.length,
              knowledgeCount: knowledge.length,
              skillCount: skills.length
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching TKS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    // Clear any pending timeouts
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    
    // Add a small delay before showing to prevent flickering
    const timeout = setTimeout(() => {
      setIsVisible(true);
      fetchTKSData();
    }, 100);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear any pending show timeout
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    
    // Add a delay to allow moving to the tooltip
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 300);
    setHideTimeout(timeout);
  };

  const handleTooltipMouseEnter = () => {
    // Clear any pending timeouts when entering tooltip
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    setIsVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    // Clear any pending timeouts
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    // Hide with a small delay to prevent flickering
    setTimeout(() => setIsVisible(false), 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cleanup timeouts on unmount
      if (hideTimeout) clearTimeout(hideTimeout);
      if (showTimeout) clearTimeout(showTimeout);
    };
  }, [isVisible, hideTimeout, showTimeout]);

  return (
    <>
      <div
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-50"
          style={{
            left: Math.min(position.x - 200, window.innerWidth - 420),
            top: Math.max(position.y - 280, 20),
            maxWidth: '400px'
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <Card className="shadow-lg border-2 border-blue-200 bg-white pointer-events-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                NICE Framework Requirements - {levelName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Loading TKS data...</span>
                </div>
              ) : tksData ? (
                <div className="space-y-3">
                  {/* Work Roles Summary */}
                  <div className="border-b pb-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Mapped Work Roles:</div>
                    <div className="flex flex-wrap gap-1">
                      {tksData.workRoles && tksData.workRoles.length > 0 ? (
                        tksData.workRoles.map((role) => (
                          <Badge key={role.code} variant="outline" className="text-xs px-1 py-0">
                            {role.code}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No work roles mapped</span>
                      )}
                    </div>
                  </div>

                  {/* TKS Summary Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-red-50 rounded p-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-medium">Tasks</span>
                      </div>
                      <div className="text-lg font-bold text-red-600">{tksData.tksStats?.taskCount || 0}</div>
                    </div>
                    <div className="bg-blue-50 rounded p-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium">Knowledge</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">{tksData.tksStats?.knowledgeCount || 0}</div>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium">Skills</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">{tksData.tksStats?.skillCount || 0}</div>
                    </div>
                  </div>

                  {/* Quick Preview */}
                  <Tabs defaultValue="tasks" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-6">
                      <TabsTrigger value="tasks" className="text-xs px-2">Tasks</TabsTrigger>
                      <TabsTrigger value="knowledge" className="text-xs px-2">Knowledge</TabsTrigger>
                      <TabsTrigger value="skills" className="text-xs px-2">Skills</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tasks" className="mt-2">
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {tksData.tasks && tksData.tasks.length > 0 ? (
                            <>
                              {tksData.tasks.slice(0, 5).map((task, index) => (
                                <div key={index} className="text-xs p-1 bg-red-50 rounded">
                                  <span className="font-mono text-red-700">{task.code}:</span>
                                  <span className="ml-1 text-gray-700">{task.description.slice(0, 60)}...</span>
                                </div>
                              ))}
                              {tksData.tasks.length > 5 && (
                                <div className="text-xs text-gray-500 text-center py-1">
                                  +{tksData.tasks.length - 5} more tasks
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-gray-500 text-center py-4">
                              No tasks data available
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="knowledge" className="mt-2">
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {tksData.knowledge && tksData.knowledge.length > 0 ? (
                            <>
                              {tksData.knowledge.slice(0, 5).map((item, index) => (
                                <div key={index} className="text-xs p-1 bg-blue-50 rounded">
                                  <span className="font-mono text-blue-700">{item.code}:</span>
                                  <span className="ml-1 text-gray-700">{item.description.slice(0, 60)}...</span>
                                </div>
                              ))}
                              {tksData.knowledge.length > 5 && (
                                <div className="text-xs text-gray-500 text-center py-1">
                                  +{tksData.knowledge.length - 5} more knowledge items
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-gray-500 text-center py-4">
                              No knowledge data available
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-2">
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {tksData.skills && tksData.skills.length > 0 ? (
                            <>
                              {tksData.skills.slice(0, 5).map((skill, index) => (
                                <div key={index} className="text-xs p-1 bg-green-50 rounded">
                                  <span className="font-mono text-green-700">{skill.code}:</span>
                                  <span className="ml-1 text-gray-700">{skill.description.slice(0, 60)}...</span>
                                </div>
                              ))}
                              {tksData.skills.length > 5 && (
                                <div className="text-xs text-gray-500 text-center py-1">
                                  +{tksData.skills.length - 5} more skills
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-gray-500 text-center py-4">
                              No skills data available
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>

                  <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    Hover to view • Data from NICE Framework 2.0
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-4">
                  No TKS data available for this level
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}