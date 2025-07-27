import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Users, Briefcase, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const exportOptions = [
  {
    key: "career-track-work-roles",
    title: "Career Track Work Role Composition",
    description: "Complete breakdown of which NICE Framework work roles make up each stage of every career track",
    icon: <Briefcase className="h-5 w-5" />,
    filename: "career-track-work-roles.json"
  },
  {
    key: "detailed-track-work-role-mapping",
    title: "Detailed Track-Work Role Mapping",
    description: "Detailed flat export with metadata including categories, specialty areas, and priorities",
    icon: <FileText className="h-5 w-5" />,
    filename: "detailed-track-work-role-mapping.json"
  },
  {
    key: "certifications-with-mappings",
    title: "Certifications with Career Mappings",
    description: "All certifications with their mappings to career tracks and levels",
    icon: <Shield className="h-5 w-5" />,
    filename: "certifications-with-mappings.json"
  },
  {
    key: "career-tracks",
    title: "Career Tracks",
    description: "Complete list of all cybersecurity career tracks",
    icon: <Users className="h-5 w-5" />,
    filename: "career-tracks.json"
  }
];

export default function ExportDashboard() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (exportType: string, filename: string) => {
    setDownloading(exportType);
    
    try {
      const response = await fetch(`/api/export/${exportType}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Create and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: `${filename} has been downloaded successfully.`,
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Data Export Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Export comprehensive data about career tracks, work roles, and their relationships
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {exportOptions.map((option) => (
          <Card key={option.key} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {option.icon}
                {option.title}
              </CardTitle>
              <CardDescription>
                {option.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExport(option.key, option.filename)}
                disabled={downloading === option.key}
                className="w-full"
              >
                {downloading === option.key ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Export Information
        </h2>
        <div className="text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            <strong>Career Track Work Role Composition:</strong> Shows the hierarchical structure of career tracks 
            with their levels and associated NICE Framework work roles. Perfect for understanding career progression paths.
          </p>
          <p>
            <strong>Detailed Mapping:</strong> Provides a flat structure export with complete metadata including 
            NICE categories, specialty areas, and priority rankings for advanced analysis.
          </p>
        </div>
      </div>
    </div>
  );
}