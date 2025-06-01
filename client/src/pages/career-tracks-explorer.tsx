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

interface Certification {
  id: number;
  code: string;
  name: string;
  description: string;
  issuer: string;
  level: string;
  domain: string;
  renewalPeriod: string;
  prerequisites: string;
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

  const { data: certifications, isLoading: certificationsLoading } = useQuery({
    queryKey: ["/api/certifications"],
  });

  // Fetch job titles for each track
  const getJobTitlesForTrack = (trackId: number) => {
    const jobTitlesMap: { [key: number]: string[] } = {
      37: ["Cloud Security Support Technician", "Cloud Security Analyst", "Cloud Security Engineer", "Cloud Security Architect", "Chief Cloud Security Officer"],
      22: ["Digital Evidence Technician", "Cybercrime Investigator", "Forensic Analyst Lead", "Cybercrime Operations Manager", "Director of Cybercrime & Digital Investigations"],
      35: ["Security Engineer", "Systems Security Analyst", "Cybersecurity Architect", "Lead Security Architect", "Chief Security Architect"],
      2: ["Threat Intelligence Analyst", "Senior Threat Intelligence Analyst", "Threat Intelligence Manager", "Director of Threat Intelligence"],
      31: ["SOC Analyst", "Security Analyst", "Senior SOC Analyst", "SOC Manager", "Director of Security Operations"],
      4: ["Penetration Tester", "Red Team Operator", "Senior Red Team Lead", "Red Team Manager", "Director of Offensive Security"],
      5: ["Vulnerability Analyst", "Security Assessment Specialist", "Senior Vulnerability Manager", "Director of Vulnerability Management"],
      6: ["Digital Forensics Technician", "Digital Forensics Analyst", "Senior Forensics Investigator", "Forensics Manager", "Director of Digital Forensics"],
      8: ["GRC Analyst", "Compliance Specialist", "Risk Manager", "Senior GRC Manager", "Chief Risk Officer"],
      30: ["Identity Analyst", "IAM Specialist", "Senior Identity Architect", "IAM Manager", "Director of Identity & Access Management"],
      41: ["OT Security Specialist", "Industrial Control Systems Analyst", "Senior OT Security Engineer", "OT Security Manager"],
      48: ["Security Educator", "Training Specialist", "Senior Training Manager", "Director of Security Training"],
      42: ["CISO", "Deputy CISO", "Chief Security Officer", "VP of Cybersecurity"],
      38: ["Security Project Manager", "Program Manager", "Senior Program Manager", "Director of Security Programs"],
      43: ["Security Researcher", "Security Tool Developer", "Senior Research Engineer", "Director of Security Research"],
      39: ["Security Automation Engineer", "DevSecOps Engineer", "Senior Automation Architect", "Director of Security Engineering"],
      44: ["Security Consultant", "Customer Success Manager", "Senior Solutions Architect", "Director of Customer Security"],
      45: ["Privacy Analyst", "Compliance Officer", "Privacy Manager", "Chief Privacy Officer"],
      14: ["DevSecOps Engineer", "Application Security Engineer", "Senior AppSec Architect", "Director of Application Security"]
    };
    
    return jobTitlesMap[trackId] || ["Cybersecurity Professional", "Senior Cybersecurity Specialist", "Security Manager"];
  };

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

  const getRelevantCertifications = (trackName: string, level: string) => {
    if (!certifications) return [];
    
    const certs = certifications as Certification[];
    
    // Define certification mapping for career tracks
    const trackCertMap: { [key: string]: { [key: string]: string[] } } = {
      "SOC Operations": {
        "Foundation": ["COMP-SEC+", "COMP-NET+", "MS-SC-900", "GIAC-GSEC"],
        "Associate": ["COMP-CYSA+", "ISC2-SSCP", "MS-SC-200"],
        "Professional": ["ISC2-CISSP", "GIAC-GCIH", "GIAC-GCFA"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "Red Team Operations": {
        "Associate": ["COMP-PENTEST+", "EC-CEH"],
        "Professional": ["EC-ECSA", "GIAC-GPEN", "EC-CHFI"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "Vulnerability Management": {
        "Foundation": ["COMP-SEC+", "COMP-NET+"],
        "Associate": ["COMP-CYSA+", "COMP-PENTEST+"],
        "Professional": ["ISC2-CISSP", "GIAC-GPEN"],
        "Expert": ["COMP-CASP+"]
      },
      "Digital Forensics": {
        "Associate": ["COMP-SEC+", "GIAC-GSEC"],
        "Professional": ["EC-CHFI", "GIAC-GCFA", "GIAC-GCIH"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "GRC Risk Compliance": {
        "Foundation": ["COMP-SEC+", "ISF-CISMP"],
        "Professional": ["ISACA-CISA", "ISACA-CISM", "ISACA-CRISC", "ISC2-CISSP"],
        "Expert": ["GIAC-GSLC"]
      },
      "Cloud and Infrastructure Security": {
        "Foundation": ["CSA-CCSK", "MS-SC-900"],
        "Associate": ["COMP-SEC+", "MS-SC-300"],
        "Professional": ["ISC2-CCSP", "AWS-SEC-SPEC", "CISCO-CCNP-SEC"],
        "Expert": ["COMP-CASP+", "ISC2-CISSP-ISSAP"]
      },
      "Identity and Access Management": {
        "Foundation": ["MS-SC-900"],
        "Associate": ["MS-SC-300", "COMP-SEC+"],
        "Professional": ["ISC2-CISSP", "ISC2-CCSP"],
        "Expert": ["COMP-CASP+"]
      }
    };

    const trackCerts = trackCertMap[trackName];
    if (!trackCerts) {
      // Default certifications for tracks not specifically mapped
      const defaultByLevel: { [key: string]: string[] } = {
        "Foundation": ["COMP-SEC+", "COMP-NET+", "MS-SC-900"],
        "Associate": ["COMP-CYSA+", "ISC2-SSCP", "GIAC-GSEC"],
        "Professional": ["ISC2-CISSP", "GIAC-GCIH", "ISACA-CISM"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      };
      const relevantCodes = defaultByLevel[level] || [];
      return certs.filter(cert => relevantCodes.includes(cert.code));
    }

    const relevantCodes = trackCerts[level] || [];
    return certs.filter(cert => relevantCodes.includes(cert.code));
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
              <div className="text-2xl font-bold text-orange-600">{certifications ? (certifications as Certification[]).length : 0}</div>
              <div className="text-sm text-gray-600">Certifications</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracks" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Career Tracks</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Certifications Guide</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="mt-6">
            {/* Career Tracks Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTracks.map((track: CareerTrack) => {
                const Icon = getTrackIcon(track.name);
                const colorClass = getTrackColor(track.name);
                
                return (
                  <Link key={track.id} href={`/career-tracks/${track.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {track.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {track.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {track.overview || "Comprehensive career pathway with multiple progression levels and specialized roles."}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            {/* Certification Guide */}
            <div className="space-y-8">
              {/* Certification Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span>Cybersecurity Certifications by Career Level</span>
                  </CardTitle>
                  <CardDescription>
                    Professional certifications recommended for different career stages in cybersecurity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Foundation", "Associate", "Professional", "Expert"].map((level) => {
                      const levelCerts = certifications ? 
                        (certifications as Certification[]).filter(cert => cert.level === level) : [];
                      
                      return (
                        <div key={level} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{levelCerts.length}</div>
                          <div className="text-sm text-gray-600">{level} Level</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Certification by Level */}
              {["Foundation", "Associate", "Professional", "Expert"].map((level) => {
                const levelCerts = certifications ? 
                  (certifications as Certification[]).filter(cert => cert.level === level) : [];
                
                if (levelCerts.length === 0) return null;

                return (
                  <Card key={level}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span>{level} Level Certifications</span>
                      </CardTitle>
                      <CardDescription>
                        Recommended certifications for {level.toLowerCase()} cybersecurity professionals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {levelCerts.map((cert) => (
                          <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{cert.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                                <Badge variant="outline" className="text-xs">
                                  {cert.domain}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                              {cert.description}
                            </p>
                            <div className="space-y-1 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Renewal: {cert.renewalPeriod}</span>
                              </div>
                              {cert.prerequisites && cert.prerequisites !== "None" && (
                                <div className="text-xs text-orange-600">
                                  Prerequisites: {cert.prerequisites}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Track-Specific Certification Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Track-Specific Certification Pathways</span>
                  </CardTitle>
                  <CardDescription>
                    Certification recommendations tailored to specific career tracks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredTracks.slice(0, 6).map((track: CareerTrack) => {
                      const Icon = getTrackIcon(track.name);
                      const levels = ["Foundation", "Associate", "Professional", "Expert"];
                      
                      return (
                        <div key={track.id} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-gray-900">{track.name}</h4>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {levels.map((level) => {
                              const relevantCerts = getRelevantCertifications(track.name, level);
                              
                              return (
                                <div key={level} className="bg-gray-50 rounded p-3">
                                  <h5 className="font-medium text-sm text-gray-700 mb-2">{level}</h5>
                                  <div className="space-y-1">
                                    {relevantCerts.length > 0 ? (
                                      relevantCerts.map((cert) => (
                                        <Badge key={cert.id} variant="secondary" className="text-xs block mb-1">
                                          {cert.code}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-400">No specific recommendations</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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