import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WorkRoles from "@/pages/work-roles";
import Tasks from "@/pages/tasks";
import Knowledge from "@/pages/knowledge";
import Skills from "@/pages/skills";
import CareerMapping from "@/pages/career-mapping";
import MapVacancy from "@/pages/map-vacancy";
import CareerTracksExplorer from "@/pages/career-tracks-explorer";
import CareerTrackDetail from "@/pages/career-track-detail";
import CertificationMapping from "@/pages/certification-mapping";
import SpecialtyAreas from "@/pages/specialty-areas";
import Categories from "@/pages/categories";
import Relationships from "@/pages/relationships";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isLandingPage = location === "/";
  
  // Pages that should not show the sidebar - main user-facing features
  const noSidebarPages = [
    "/career-mapping",
    "/map-vacancy", 
    "/career-tracks"
  ];
  const shouldShowSidebar = !isLandingPage && !noSidebarPages.some(page => location.startsWith(page));
  
  if (isLandingPage) {
    return (
      <div className="min-h-screen">
        <Switch>
          <Route path="/" component={Landing} />
        </Switch>
      </div>
    );
  }

  return (
    <div className="flex h-screen pt-16">
      <TopNavigation />
      {shouldShowSidebar && <Sidebar />}
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/career-mapping" component={CareerMapping} />
          <Route path="/map-vacancy" component={MapVacancy} />
          <Route path="/career-tracks/:id" component={CareerTrackDetail} />
          <Route path="/career-tracks" component={CareerTracksExplorer} />
          <Route path="/certification-mapping" component={CertificationMapping} />
          <Route path="/work-roles" component={WorkRoles} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/skills" component={Skills} />
          <Route path="/specialty-areas" component={SpecialtyAreas} />
          <Route path="/categories" component={Categories} />
          <Route path="/relationships" component={Relationships} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 font-roboto">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
