import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Network, Users, BookOpen, Target, Cog, ArrowRight, Eye } from "lucide-react";

interface Category {
  id: number;
  code: string;
  name: string;
}

interface WorkRole {
  id: number;
  code: string;
  name: string;
  categoryId: number;
}

interface RelationshipStats {
  workRoles: number;
  tasks: number;
  knowledge: number;
  skills: number;
}

interface WorkRoleWithRelations {
  id?: number;
  code?: string;
  name?: string;
  workRoleTasks?: Array<{ task: { id: number; code: string; description: string } }>;
  workRoleKnowledge?: Array<{ knowledgeItem: { id: number; code: string; description: string } }>;
  workRoleSkills?: Array<{ skill: { id: number; code: string; description: string } }>;
}

export default function Relationships() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedWorkRole, setSelectedWorkRole] = useState<number | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: workRoles = [] } = useQuery<WorkRole[]>({
    queryKey: ["/api/work-roles"],
  });

  const { data: stats } = useQuery<RelationshipStats>({
    queryKey: ["/api/statistics"],
  });

  const { data: workRoleDetails } = useQuery<WorkRoleWithRelations>({
    queryKey: [`/api/work-roles/${selectedWorkRole}`],
    enabled: !!selectedWorkRole,
  });

  const filteredWorkRoles = selectedCategory 
    ? workRoles.filter(wr => wr.categoryId === selectedCategory)
    : workRoles;

  const getCategoryColor = (categoryCode: string) => {
    const colors = {
      'OG': 'bg-purple-100 text-purple-800 border-purple-200',
      'IN': 'bg-blue-100 text-blue-800 border-blue-200',
      'DD': 'bg-green-100 text-green-800 border-green-200',
      'IO': 'bg-orange-100 text-orange-800 border-orange-200',
      'PD': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[categoryCode as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (categoryCode: string) => {
    const icons: Record<string, JSX.Element> = {
      'OG': <Network className="w-4 h-4" />,
      'IN': <Eye className="w-4 h-4" />,
      'DD': <Cog className="w-4 h-4" />,
      'IO': <Target className="w-4 h-4" />,
      'PD': <Users className="w-4 h-4" />,
    };
    return icons[categoryCode] || <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">NICE Framework Relationships</h1>
        <p className="text-muted-foreground">
          Interactive visualization of the complete NICE Cybersecurity Workforce Framework 2.0.0
        </p>
      </div>

      {/* Overall Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Framework Overview - 100% Complete
            </CardTitle>
            <CardDescription>
              Complete database of all NICE Framework components with bidirectional relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.workRoles}</div>
                <div className="text-sm text-green-700">Work Roles</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.tasks}</div>
                <div className="text-sm text-blue-700">Tasks</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.knowledge}</div>
                <div className="text-sm text-purple-700">Knowledge Items</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.skills}</div>
                <div className="text-sm text-orange-700">Skills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Level */}
      <Card>
        <CardHeader>
          <CardTitle>1. Categories (5 Total)</CardTitle>
          <CardDescription>
            High-level functional areas of cybersecurity work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {categories.map((category) => {
              const categoryWorkRoles = workRoles.filter(wr => wr.categoryId === category.id);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category.id ? null : category.id);
                    setSelectedWorkRole(null);
                  }}
                >
                  {getCategoryIcon(category.code)}
                  <div className="text-center">
                    <div className="font-semibold">{category.code}</div>
                    <div className="text-xs opacity-75">{categoryWorkRoles.length} roles</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Arrow */}
      {selectedCategory && (
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      {/* Work Roles Level */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <CardTitle>2. Work Roles ({filteredWorkRoles.length} in selected category)</CardTitle>
            <CardDescription>
              Specific job functions within the selected category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWorkRoles.map((workRole) => (
                <Button
                  key={workRole.id}
                  variant={selectedWorkRole === workRole.id ? "default" : "outline"}
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => {
                    setSelectedWorkRole(selectedWorkRole === workRole.id ? null : workRole.id);
                  }}
                >
                  <div>
                    <div className="font-semibold text-sm">{workRole.code}</div>
                    <div className="text-xs opacity-75 truncate">{workRole.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arrow */}
      {selectedWorkRole && (
        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>
      )}



      {/* TKS Details */}
      {selectedWorkRole && workRoleDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Tasks ({workRoleDetails?.workRoleTasks?.length || 0})
              </CardTitle>
              <CardDescription>
                Specific work activities for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {workRoleDetails?.workRoleTasks?.slice(0, 5).map((item: any) => (
                <div key={item.task.id} className="p-2 bg-blue-50 rounded text-sm">
                  <Badge variant="outline" className="text-xs mb-1">{item.task.code}</Badge>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.task.description}
                  </div>
                </div>
              ))}
              {(workRoleDetails?.workRoleTasks?.length ?? 0) > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{(workRoleDetails?.workRoleTasks?.length ?? 0) - 5} more tasks...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Knowledge Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Knowledge ({workRoleDetails?.workRoleKnowledge?.length || 0})
              </CardTitle>
              <CardDescription>
                Required knowledge areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {workRoleDetails?.workRoleKnowledge?.slice(0, 5).map((item: any) => (
                <div key={item.knowledgeItem.id} className="p-2 bg-purple-50 rounded text-sm">
                  <Badge variant="outline" className="text-xs mb-1">{item.knowledgeItem.code}</Badge>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.knowledgeItem.description}
                  </div>
                </div>
              ))}
              {(workRoleDetails?.workRoleKnowledge?.length ?? 0) > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{(workRoleDetails?.workRoleKnowledge?.length ?? 0) - 5} more knowledge items...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cog className="w-5 h-5 text-orange-600" />
                Skills ({workRoleDetails?.workRoleSkills?.length || 0})
              </CardTitle>
              <CardDescription>
                Required technical and soft skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {workRoleDetails?.workRoleSkills?.slice(0, 5).map((item: any) => (
                <div key={item.skill.id} className="p-2 bg-orange-50 rounded text-sm">
                  <Badge variant="outline" className="text-xs mb-1">{item.skill.code}</Badge>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.skill.description}
                  </div>
                </div>
              ))}
              {(workRoleDetails?.workRoleSkills?.length ?? 0) > 5 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{(workRoleDetails?.workRoleSkills?.length ?? 0) - 5} more skills...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Relationship Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Flow</CardTitle>
          <CardDescription>
            How the NICE Framework components connect together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 p-6">
            {/* Categories */}
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">5 Categories</span>
            </div>
            
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
            
            {/* Work Roles */}
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-semibold">41 Work Roles</span>
            </div>
            
            <div className="flex items-center gap-8">
              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-45" />
              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-135" />
            </div>
            
            {/* TKS */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">942 Tasks</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">631 Knowledge</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Cog className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">538 Skills</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-800">
              🎉 Complete NICE Framework 2.0.0 Database
            </h3>
            <p className="text-sm text-green-700">
              All 41 work roles mapped with authentic Tasks, Knowledge Items, and Skills relationships. 
              Navigate through any component to explore career pathways and competency requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}