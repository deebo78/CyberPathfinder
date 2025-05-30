import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImportModal } from "@/components/modals/import-modal";
import { Database, Search, Upload, UserCircle, Settings } from "lucide-react";

export function TopNavigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Database className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-medium text-gray-900">NICE Framework DB</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Button onClick={() => setIsImportModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Link href="/admin">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              <div className="relative">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <UserCircle className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
}
