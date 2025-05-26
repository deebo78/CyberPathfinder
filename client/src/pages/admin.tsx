import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportModal } from "@/components/modals/import-modal";
import { DataTable } from "@/components/tables/data-table";
import { useNiceFramework } from "@/hooks/use-nice-framework";
import { CloudUpload, Download, Database, CheckCircle } from "lucide-react";

export default function Admin() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { importHistory, isLoadingImportHistory } = useNiceFramework();

  const handleExport = (type: string) => {
    window.open(`/api/export/${type}`, '_blank');
  };

  const columns = [
    {
      accessorKey: "filename",
      header: "Filename",
    },
    {
      accessorKey: "importType",
      header: "Type",
    },
    {
      accessorKey: "recordsImported",
      header: "Records",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800",
          completed: "bg-green-100 text-green-800",
          failed: "bg-red-100 text-red-800",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string);
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/" className="text-gray-700 hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-primary font-medium">Administration</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Administration</h2>
        <p className="text-gray-600">Database management and data operations</p>
      </div>

      {/* Import/Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CloudUpload className="w-5 h-5 mr-2" />
              Data Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Import NICE Framework data from Excel or CSV files</p>
            <Button onClick={() => setIsImportModalOpen(true)} className="w-full">
              Import Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Data Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Export framework data for backup or analysis</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('work-roles')}>
                Work Roles
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('tasks')}>
                Tasks
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('knowledge-items')}>
                Knowledge
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('skills')}>
                Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Operations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span>Validate Data</span>
              <span className="text-xs text-gray-500">Check integrity</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Database className="w-6 h-6 mb-2" />
              <span>Backup Database</span>
              <span className="text-xs text-gray-500">Create backup</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <CloudUpload className="w-6 h-6 mb-2" />
              <span>Restore Database</span>
              <span className="text-xs text-gray-500">From backup</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={importHistory || []}
            isLoading={isLoadingImportHistory}
          />
        </CardContent>
      </Card>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
