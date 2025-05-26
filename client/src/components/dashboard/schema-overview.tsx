import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Map, Link, Settings } from "lucide-react";

const schemaGroups = [
  {
    title: "Core Tables",
    icon: Table,
    color: "text-blue-600",
    items: ["work_roles", "tasks", "knowledge_items", "skills", "abilities"],
  },
  {
    title: "Taxonomy",
    icon: Map,
    color: "text-green-600",
    items: ["categories", "specialty_areas", "work_role_categories"],
  },
  {
    title: "Relationships",
    icon: Link,
    color: "text-orange-600",
    items: ["work_role_tasks", "work_role_knowledge", "work_role_skills", "work_role_abilities"],
  },
  {
    title: "System",
    icon: Settings,
    color: "text-gray-600",
    items: ["audit_logs", "import_history", "data_validation"],
  },
];

export function SchemaOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Schema Overview</CardTitle>
        <p className="text-sm text-gray-600">Relational structure of NICE Framework components</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemaGroups.map((group) => {
            const Icon = group.icon;
            
            return (
              <div
                key={group.title}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <Icon className={`w-5 h-5 mr-2 ${group.color}`} />
                  <h4 className="font-medium text-gray-900">{group.title}</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
