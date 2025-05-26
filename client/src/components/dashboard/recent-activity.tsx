import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Upload } from "lucide-react";

const mockActivities = [
  {
    type: "create",
    title: "New work role added",
    description: "Cybersecurity Analyst (AN-ASA-001)",
    time: "2 hours ago",
    icon: Plus,
    color: "text-blue-600 bg-blue-100",
  },
  {
    type: "edit",
    title: "Task updated",
    description: "T0001: Identify systemic security issues",
    time: "5 hours ago",
    icon: Edit,
    color: "text-green-600 bg-green-100",
  },
  {
    type: "import",
    title: "Bulk import completed",
    description: "152 knowledge items imported",
    time: "1 day ago",
    icon: Upload,
    color: "text-orange-600 bg-orange-100",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
