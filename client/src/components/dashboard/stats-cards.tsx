import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ListTodo, Brain, ServerCog } from "lucide-react";

interface StatsCardsProps {
  statistics?: {
    workRoles: number;
    tasks: number;
    knowledge: number;
    skills: number;
  };
  isLoading?: boolean;
}

export function StatsCards({ statistics, isLoading }: StatsCardsProps) {
  const stats = [
    {
      name: "Work Roles",
      value: statistics?.workRoles || 0,
      icon: Briefcase,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "ListTodo",
      value: statistics?.tasks || 0,
      icon: ListTodo,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "Knowledge Areas",
      value: statistics?.knowledge || 0,
      icon: Brain,
      color: "text-orange-600 bg-orange-100",
    },
    {
      name: "Skills & Abilities",
      value: (statistics?.skills || 0) + (statistics?.abilities || 0),
      icon: ServerCog,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
