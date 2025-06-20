import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Award, Target, Users, Building2 } from "lucide-react";

interface Certification {
  id: number;
  code: string;
  name: string;
  issuer: string;
  level: string;
  description: string;
  prerequisites: string;
}

interface CareerTrack {
  id: number;
  name: string;
  description: string;
  careerLevels?: Array<{
    name: string;
    careerPositions: Array<{
      jobTitle: string;
    }>;
  }>;
}

export default function CertificationMapping() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const { data: certificationsWithMappings, isLoading: certificationsLoading } = useQuery({
    queryKey: ["/api/certifications-with-mappings"],
  });

  const certifications = (certificationsWithMappings as any[]) || [];
  
  const filteredCertifications = certifications.filter((cert: any) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === "All" || cert.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  if (certificationsLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certification mapping...</p>
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
            <Award className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Certification to Career Mapping</h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            See how certifications align with career tracks and job titles
          </p>
          <p className="text-gray-500 max-w-3xl mx-auto">
            Discover which certifications are most valuable for specific career paths and job roles in cybersecurity.
          </p>
        </div>

        {/* Level Filter Buttons */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-lg border shadow-sm p-1">
            {["All", "Foundation", "Associate", "Professional", "Expert"].map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedLevel(level)}
                variant={selectedLevel === level ? "default" : "ghost"}
                size="sm"
                className="px-4 py-2"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search certifications..."
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
              <div className="text-2xl font-bold text-blue-600">{certifications.length || 0}</div>
              <div className="text-sm text-gray-600">Total Certifications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">19</div>
              <div className="text-sm text-gray-600">Career Tracks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">11</div>
              <div className="text-sm text-gray-600">Certification Bodies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">100+</div>
              <div className="text-sm text-gray-600">Job Roles</div>
            </CardContent>
          </Card>
        </div>

        {/* Compact Certification Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCertifications.map((cert: any) => {
            const mappings = cert.mappings || [];
            const trackMap = new Map();
            mappings.forEach((m: any) => trackMap.set(m.trackId, m));
            const uniqueTracks = Array.from(trackMap.values());
            
            const jobTitleSet = new Set<string>();
            mappings.forEach((m: any) => {
              if (m.careerLevelName) {
                jobTitleSet.add(String(m.careerLevelName));
              }
            });
            const uniqueJobTitles = Array.from(jobTitleSet);
            
            return (
              <Card key={cert.id} className="hover:shadow-md transition-all h-fit">
                <CardContent className="p-4">
                  {/* Header with badges */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {cert.code}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          cert.level === 'Foundation' ? 'bg-green-100 text-green-800' :
                          cert.level === 'Associate' ? 'bg-blue-100 text-blue-800' :
                          cert.level === 'Professional' ? 'bg-purple-100 text-purple-800' :
                          cert.level === 'Expert' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {cert.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm leading-tight mb-1">{cert.name}</h3>
                    <div className="flex items-center text-xs text-gray-600">
                      <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{cert.issuer}</span>
                    </div>
                  </div>

                  {/* Career Tracks */}
                  {uniqueTracks.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <Target className="h-3 w-3 mr-1 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Tracks:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {uniqueTracks.slice(0, 2).map((track: any, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-blue-50 truncate max-w-[120px]"
                            onClick={() => window.location.href = `/career-tracks/${track.trackId}`}
                          >
                            {track.trackName}
                          </Badge>
                        ))}
                        {uniqueTracks.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{uniqueTracks.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Levels */}
                  {uniqueJobTitles.length > 0 && (
                    <div>
                      <div className="flex items-center mb-1">
                        <Users className="h-3 w-3 mr-1 text-green-600" />
                        <span className="text-xs font-medium text-gray-700">Levels:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {uniqueJobTitles.slice(0, 2).map((title: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs truncate max-w-[100px]">
                            {String(title)}
                          </Badge>
                        ))}
                        {uniqueJobTitles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{uniqueJobTitles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {mappings.length === 0 && (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">
                        No mapping data
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No results message */}
        {filteredCertifications.length === 0 && !certificationsLoading && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No certifications found</p>
            {selectedLevel !== "All" && (
              <p className="text-sm text-gray-400">
                Try selecting "All" or a different level filter
              </p>
            )}
          </div>
        )}

        {filteredCertifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No certifications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}