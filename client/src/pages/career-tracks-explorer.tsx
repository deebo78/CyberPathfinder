import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Shield,
  Server,
  Code,
  Eye,
  Lock,
  Scale,
  Cpu,
  Cloud,
  UserCheck,
  Settings,
  Search as SearchIcon,
  FileText,
  GraduationCap,
  Briefcase,
  Target,
  Award,
  BookOpen,
  Clock
} from "lucide-react";

interface CareerTrack {
  id: number;
  name: string;
  description: string;
  overview: string;
}

const trackIcons: { [key: string]: any } = {
  "SOC Operations": Shield,
  "Red Team Operations": Target,
  "Vulnerability Management": SearchIcon,
  "Digital Forensics": Eye,
  "GRC Risk Compliance": Scale,
  "Cybersecurity Architecture Engineering": Cpu,
  "Secure Software Development": Code,
  "Cloud and Infrastructure Security": Cloud,
  "Identity and Access Management": UserCheck,
  "OT Security": Settings,
  "Cybercrime Investigation": Search,
  "Cybersecurity Education Training": GraduationCap,
  "Executive Leadership CISO Track": Briefcase,
  "Program and Project Management": FileText,
  "Technology Research and Tool Development": Server,
  "Security Automation and Orchestration": Settings,
  "Customer Facing Security Roles": Users,
  "Threat Intelligence": TrendingUp,
  "Privacy Policy Legal Affairs": Scale
};

export default function CareerTracksExplorer() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: careerTracks, isLoading } = useQuery({
    queryKey: ["/api/career-tracks"],
  });

  const filteredTracks = (careerTracks as CareerTrack[])?.filter((track: CareerTrack) =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTrackIcon = (trackName: string) => {
    const IconComponent = trackIcons[trackName] || Shield;
    return IconComponent;
  };

  const getTrackColor = (trackName: string) => {
    const colors = [
      "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500", 
      "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-pink-500",
      "bg-cyan-500", "bg-amber-500", "bg-lime-500", "bg-violet-500",
      "bg-rose-500", "bg-emerald-500", "bg-sky-500", "bg-yellow-500",
      "bg-fuchsia-500", "bg-slate-500", "bg-zinc-500"
    ];
    return colors[trackName.length % colors.length];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Career Tracks Explorer</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Discover all 19 cybersecurity career pathways in the NICE Framework
          </p>
          <p className="text-gray-500 max-w-3xl mx-auto">
            Each track represents a distinct career progression path with specific roles, 
            responsibilities, and skill requirements aligned with industry standards.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search career tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">19</div>
              <div className="text-sm text-gray-600">Career Tracks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Experience Levels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">41</div>
              <div className="text-sm text-gray-600">Work Roles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">750K+</div>
              <div className="text-sm text-gray-600">Open Positions</div>
            </CardContent>
          </Card>
        </div>

        {/* Career Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track: CareerTrack) => {
            const Icon = getTrackIcon(track.name);
            const colorClass = getTrackColor(track.name);
            
            return (
              <Card key={track.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Track {track.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {track.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {track.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {track.overview || "Comprehensive career pathway with multiple progression levels and specialized roles."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      Multiple Levels
                    </div>
                    <Link href={`/career-tracks/${track.id}`}>
                      <Button variant="outline" size="sm" className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        Explore
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTracks.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No career tracks found matching "{searchTerm}"</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6 opacity-90">
            Use our AI-powered career mapping tool to find your perfect cybersecurity career path.
          </p>
          <Link href="/career-mapping">
            <Button size="lg" variant="secondary" className="text-gray-900">
              <TrendingUp className="h-5 w-5 mr-2" />
              Get Personalized Recommendations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}