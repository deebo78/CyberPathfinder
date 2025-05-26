import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [importType, setImportType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file || !importType) {
      toast({
        title: "Error",
        description: "Please select a file and import type",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("importType", importType);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        onClose();
        setFile(null);
        setImportType("");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      setFile(null);
      setImportType("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import NICE Framework Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Select Import Type
            </Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose what to import" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complete">Complete Framework (All Tables)</SelectItem>
                <SelectItem value="work-roles">Work Roles Only</SelectItem>
                <SelectItem value="tasks">Tasks Only</SelectItem>
                <SelectItem value="knowledge">Knowledge Items Only</SelectItem>
                <SelectItem value="skills">Skills & Abilities Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Drop files here or click to browse</p>
              <p className="text-xs text-gray-500 mb-4">Supports Excel (.xlsx), CSV, and JSON files</p>
              <Input
                type="file"
                accept=".xlsx,.csv,.json"
                onChange={handleFileChange}
                className="max-w-xs"
              />
              {file && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || !importType || isUploading}>
              {isUploading ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
