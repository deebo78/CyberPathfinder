import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const { data: certificationsWithMappings, isLoading: certificationsLoading } = useQuery({
    queryKey: ["/api/certifications-with-mappings"],
  });

  const filteredCertifications = certificationsWithMappings?.filter((cert: any) =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
              <div className="text-2xl font-bold text-blue-600">{certificationsWithMappings?.length || 0}</div>
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

        {/* Certification Cards with Authentic Mapping */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertifications.map((cert: any) => {
            const mappings = cert.mappings || [];
            const uniqueTracks = [...new Map(mappings.map((m: any) => [m.trackId, m])).values()];
            const uniqueJobTitles = [...new Set(mappings.map((m: any) => m.careerLevelName))];
            
            return (
              <Card key={cert.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{cert.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {cert.code}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {cert.level}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        <div className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {cert.issuer}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {cert.description}
                  </p>

                  {/* Mapped Career Tracks */}
                  {uniqueTracks.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Target className="h-4 w-4 mr-1 text-blue-600" />
                        <p className="text-xs font-medium text-gray-700">Relevant Career Tracks:</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {uniqueTracks.slice(0, 3).map((track: any, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-blue-50"
                            onClick={() => window.location.href = `/career-tracks/${track.trackId}`}
                          >
                            {track.trackName}
                          </Badge>
                        ))}
                        {uniqueTracks.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{uniqueTracks.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Levels */}
                  {uniqueJobTitles.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 mr-1 text-green-600" />
                        <p className="text-xs font-medium text-gray-700">Career Levels:</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {uniqueJobTitles.slice(0, 4).map((title: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {title}
                          </Badge>
                        ))}
                        {uniqueJobTitles.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{uniqueJobTitles.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {mappings.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">
                        No career track mapping available yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCertifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No certifications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}