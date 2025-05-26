import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SchemaOverview } from "@/components/dashboard/schema-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, CheckCircle, Database } from "lucide-react";
import { useNiceFramework } from "@/hooks/use-nice-framework";

export default function Dashboard() {
  const { statistics, isLoadingStats } = useNiceFramework();

  const handleBulkImport = () => {
    // This would trigger the import modal
    console.log("Opening bulk import modal");
  };

  const handleValidation = () => {
    console.log("Running data validation");
  };

  const handleBackup = () => {
    console.log("Creating database backup");
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="#" className="text-gray-700 hover:text-primary">
              <Database className="w-4 h-4 mr-2" />
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-primary font-medium">Dashboard</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">NICE Framework Database Overview</h2>
        <p className="text-gray-600">Comprehensive cybersecurity workforce framework data management and visualization</p>
      </div>

      {/* Statistics Cards */}
      <StatsCards statistics={statistics} isLoading={isLoadingStats} />

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto border-2 border-dashed hover:border-primary hover:bg-blue-50"
              onClick={handleBulkImport}
            >
              <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Bulk Import</p>
              <p className="text-xs text-gray-500">Upload Excel/CSV files</p>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto border-2 border-dashed hover:border-primary hover:bg-blue-50"
              onClick={handleValidation}
            >
              <CheckCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Validate Data</p>
              <p className="text-xs text-gray-500">Check referential integrity</p>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto border-2 border-dashed hover:border-primary hover:bg-blue-50"
              onClick={handleBackup}
            >
              <Database className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Backup Database</p>
              <p className="text-xs text-gray-500">Create full backup</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RecentActivity />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Roles Overview</CardTitle>
            <Button variant="link" className="text-primary hover:text-blue-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {/* This would show a preview of work roles data */}
            <div className="text-center text-gray-500 py-8">
              Work roles data will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Schema Visualization */}
      <SchemaOverview />
    </div>
  );
}
