import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImportModal } from "@/components/modals/import-modal";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Database, Search, Upload, UserCircle, Settings, LogOut, Users, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function TopNavigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Only show admin tools to developers/admins with proper access
  const isDeveloperMode = import.meta.env.VITE_ENABLE_ADMIN === 'true';
  const userFacingPages = ["/career-mapping", "/map-vacancy", "/career-tracks"];
  const isUserFacingPage = userFacingPages.some(page => location.startsWith(page));
  const showAdminTools = isDeveloperMode && !isUserFacingPage;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Database className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-medium text-gray-900">CyberPathfinder</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {showAdminTools && (
                <>
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
                </>
              )}
              {!showAdminTools && isDeveloperMode && (
                <Link href="/admin">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              
              {isAuthenticated && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                      data-testid="button-user-menu"
                    >
                      <div className={`p-1.5 rounded-full ${isAdmin ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        {isAdmin ? (
                          <Shield className="w-5 h-5 text-purple-600" />
                        ) : (
                          <UserCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">
                        {user.displayName || user.email.split('@')[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.displayName || user.email.split('@')[0]}</span>
                        <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => setLocation("/users")} data-testid="menu-item-users">
                          <Users className="w-4 h-4 mr-2" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 focus:text-red-600"
                      data-testid="menu-item-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
