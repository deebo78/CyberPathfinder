import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavigation } from "@/components/layout/top-navigation";
import Dashboard from "@/pages/dashboard";
import WorkRoles from "@/pages/work-roles";
import Tasks from "@/pages/tasks";
import Knowledge from "@/pages/knowledge";
import Skills from "@/pages/skills";

import SpecialtyAreas from "@/pages/specialty-areas";
import Categories from "@/pages/categories";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen pt-16">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/work-roles" component={WorkRoles} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/skills" component={Skills} />

          <Route path="/specialty-areas" component={SpecialtyAreas} />
          <Route path="/categories" component={Categories} />
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
          <TopNavigation />
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
