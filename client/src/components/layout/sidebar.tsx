import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  ListTodo, 
  Brain, 
  ServerCog, 
  Star, 
  Layers, 
  Grid3x3,
  Settings,
  Download,
  Database,
  Network,
  TrendingUp,
  Building2,
  Award
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Database },
  { name: "Career Mapping", href: "/career-mapping", icon: TrendingUp },
  { name: "Map Vacancy", href: "/map-vacancy", icon: Building2 },
  { name: "Career Tracks", href: "/career-tracks", icon: Star },
  { name: "Certification Mapping", href: "/certification-mapping", icon: Award },
  { name: "Work Roles", href: "/work-roles", icon: Briefcase },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Knowledge Areas", href: "/knowledge", icon: Brain },
  { name: "Skills", href: "/skills", icon: ServerCog },

  { name: "Specialty Areas", href: "/specialty-areas", icon: Layers },
  { name: "Categories", href: "/categories", icon: Grid3x3 },
  { name: "Relationships", href: "/relationships", icon: Network },
];

const bottomNavigation = [
  { name: "Administration", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0 flex flex-col">
      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                  isActive && "bg-blue-50 text-primary border-r-2 border-primary"
                )}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                  isActive && "bg-blue-50 text-primary border-r-2 border-primary"
                )}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
          <button className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 w-full text-left">
            <Download className="w-5 h-5 mr-3" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
