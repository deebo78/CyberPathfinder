import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, Building2, Star, Award, Download } from "lucide-react";

const mainNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Career Mapping", href: "/career-mapping", icon: TrendingUp },
  { name: "Map Vacancy", href: "/map-vacancy", icon: Building2 },
  { name: "Career Tracks", href: "/career-tracks", icon: Star },
  { name: "Certifications", href: "/certification-mapping", icon: Award },
  { name: "Export Data", href: "/export", icon: Download },
];

export default function MainNavigation() {
  const [location] = useLocation();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}