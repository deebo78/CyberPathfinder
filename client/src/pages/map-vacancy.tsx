import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Upload, Building2, Users, Target, AlertCircle, MapPin, TrendingUp, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VacancyAnalysis {
  primaryMatches: WorkRoleMatch[];
  otherNotableRoles: WorkRoleMatch[];
  bestTrackMatch: {
    trackId: number;
    trackName: string;
    matchPercentage: number;
    careerProgression: CareerLevel[];
    jobPositionLevel: string;
    levelAlignment: {
      isAligned: boolean;
      issues: string[];
      recommendations: string[];
    };
  } | null;
  extractedRequirements: {
    skills: string[];
    experience: string[];
    education: string[];
    certifications: string[];
    experienceLevel: string;
  };
  matchSummary: string;
}

interface CareerLevel {
  level: string;
  title: string;
  description: string;
  typicalExperience: string;
  keyResponsibilities: string[];
  isJobMatch: boolean;
}

interface WorkRoleMatch {
  workRoleId: number;
  workRoleName: string;
  workRoleCode: string;
  matchPercentage: number;
  matchReason: string;
  category: string;
  specialtyArea: string;
  candidateCount?: number;
}

export default function MapVacancy() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredQualifications, setRequiredQualifications] = useState("");
  const [preferredQualifications, setPreferredQualifications] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<VacancyAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeVacancyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/analyze-vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze vacancy");
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Job posting has been mapped to NICE Framework work roles.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // TODO: Parse file content for job description
    }
  };

  const handleAnalyze = () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a job title and description.",
        variant: "destructive",
      });
      return;
    }

    analyzeVacancyMutation.mutate({
      jobTitle,
      jobDescription,
      requiredQualifications,
      preferredQualifications,
    });
  };

  const getCandidatesByWorkRole = async (workRoleId: number) => {
    // TODO: Implement candidate matching functionality
    toast({
      title: "Feature Coming Soon",
      description: "Candidate matching will be available in the next phase.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Map Vacancy</h1>
        <p className="text-gray-600">
          Analyze job postings and map them to NICE Framework work roles to find qualified candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Job Posting Details
              </CardTitle>
              <CardDescription>
                Enter the job details or upload a job posting document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Cybersecurity Analyst"
                />
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="required">Required Qualifications</Label>
                <Textarea
                  id="required"
                  value={requiredQualifications}
                  onChange={(e) => setRequiredQualifications(e.target.value)}
                  placeholder="List required skills, experience, certifications..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="preferred">Preferred Qualifications</Label>
                <Textarea
                  id="preferred"
                  value={preferredQualifications}
                  onChange={(e) => setPreferredQualifications(e.target.value)}
                  placeholder="List preferred qualifications..."
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="file">Or Upload Job Posting</Label>
                <div className="mt-2">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.doc,.docx,.pdf"
                  />
                  {file && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={analyzeVacancyMutation.isPending}
                className="w-full"
              >
                {analyzeVacancyMutation.isPending ? "Analyzing..." : "Analyze Job Posting"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis ? (
            <>
              {/* Career Track Visualization */}
              {analysis.bestTrackMatch && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Career Track Progression
                    </CardTitle>
                    <CardDescription>
                      {analysis.bestTrackMatch.trackName} - {analysis.bestTrackMatch.matchPercentage}% match
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Career Level Progression */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                          {analysis.bestTrackMatch.careerProgression.map((level, index) => (
                            <div key={level.level} className="flex-1 relative">
                              <div className={`flex flex-col items-center ${level.isJobMatch ? 'z-10' : ''}`}>
                                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center mb-2 ${
                                  level.isJobMatch 
                                    ? 'bg-blue-500 border-blue-500 text-white' 
                                    : 'bg-gray-100 border-gray-300 text-gray-500'
                                }`}>
                                  {level.isJobMatch ? (
                                    <MapPin className="h-6 w-6" />
                                  ) : (
                                    <span className="text-xs font-semibold">{index + 1}</span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-semibold text-gray-700">{level.level}</p>
                                  <p className="text-xs text-gray-500">{level.typicalExperience}</p>
                                </div>
                              </div>
                              {index < analysis.bestTrackMatch!.careerProgression.length - 1 && (
                                <div className="absolute top-6 left-6 w-full h-0.5 bg-gray-300 -z-10"></div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Job Position Details */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900">Your Job Posting Position</h4>
                              <p className="text-sm text-blue-700 mb-2">
                                Matches: {analysis.bestTrackMatch.jobPositionLevel}
                              </p>
                              {analysis.bestTrackMatch.careerProgression
                                .filter(level => level.isJobMatch)
                                .map(level => (
                                  <div key={level.level} className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                      <strong>{level.title}</strong> - {level.description}
                                    </p>
                                    <div className="text-xs text-gray-600">
                                      <p><strong>Key Responsibilities:</strong></p>
                                      <ul className="list-disc list-inside ml-2">
                                        {level.keyResponsibilities.map((resp, i) => (
                                          <li key={i}>{resp}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Alignment Analysis */}
                        <div className={`mt-4 p-4 rounded-lg ${
                          analysis.bestTrackMatch.levelAlignment.isAligned 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            {analysis.bestTrackMatch.levelAlignment.isAligned ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h4 className={`font-semibold ${
                                analysis.bestTrackMatch.levelAlignment.isAligned 
                                  ? 'text-green-900' 
                                  : 'text-yellow-900'
                              }`}>
                                {analysis.bestTrackMatch.levelAlignment.isAligned 
                                  ? 'Requirements Well Aligned' 
                                  : 'Requirements Misalignment Detected'}
                              </h4>
                              
                              {!analysis.bestTrackMatch.levelAlignment.isAligned && 
                               analysis.bestTrackMatch.levelAlignment.issues.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-yellow-800 font-medium">Issues:</p>
                                  <ul className="text-sm text-yellow-700 list-disc list-inside ml-2">
                                    {analysis.bestTrackMatch.levelAlignment.issues.map((issue, i) => (
                                      <li key={i}>{issue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {analysis.bestTrackMatch.levelAlignment.recommendations.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-800">Recommendations:</p>
                                  <ul className="text-sm text-gray-700 list-disc list-inside ml-2">
                                    {analysis.bestTrackMatch.levelAlignment.recommendations.map((rec, i) => (
                                      <li key={i}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>
                    NICE Framework work role matches for your job posting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Match Summary</h4>
                      <p className="text-sm text-gray-600">{analysis.matchSummary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="primary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="primary">Primary Matches (75%+)</TabsTrigger>
                  <TabsTrigger value="notable">Other Notable Roles</TabsTrigger>
                </TabsList>

                <TabsContent value="primary" className="space-y-4">
                  {analysis.primaryMatches.length > 0 ? (
                    analysis.primaryMatches.map((match) => (
                      <Card key={match.workRoleId} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{match.workRoleName}</h3>
                              <p className="text-sm text-gray-600">
                                {match.workRoleCode} • {match.category} • {match.specialtyArea}
                              </p>
                            </div>
                            <Badge variant="default" className="ml-2">
                              {match.matchPercentage}% match
                            </Badge>
                          </div>
                          <Progress value={match.matchPercentage} className="mb-3" />
                          <p className="text-sm text-gray-600 mb-3">{match.matchReason}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => getCandidatesByWorkRole(match.workRoleId)}
                            className="flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            View Qualified Candidates
                            {match.candidateCount && (
                              <Badge variant="secondary" className="ml-1">
                                {match.candidateCount}
                              </Badge>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>No work roles match above 75% threshold</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="notable" className="space-y-4">
                  {analysis.otherNotableRoles.length > 0 ? (
                    analysis.otherNotableRoles.map((match) => (
                      <Card key={match.workRoleId} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{match.workRoleName}</h3>
                              <p className="text-sm text-gray-600">
                                {match.workRoleCode} • {match.category} • {match.specialtyArea}
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {match.matchPercentage}% match
                            </Badge>
                          </div>
                          <Progress value={match.matchPercentage} className="mb-3" />
                          <p className="text-sm text-gray-600 mb-3">{match.matchReason}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => getCandidatesByWorkRole(match.workRoleId)}
                            className="flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            View Qualified Candidates
                            {match.candidateCount && (
                              <Badge variant="secondary" className="ml-1">
                                {match.candidateCount}
                              </Badge>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center text-gray-500">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>No additional notable role matches found</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              {/* Extracted Requirements Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Requirements</CardTitle>
                  <CardDescription>
                    Key requirements identified from the job posting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Experience Level Indicator */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-gray-600" />
                        <h4 className="font-semibold text-sm text-gray-700">Target Experience Level</h4>
                      </div>
                      <Badge variant="default" className="text-sm">
                        {analysis.extractedRequirements.experienceLevel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.extractedRequirements.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.extractedRequirements.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Experience</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.extractedRequirements.experience.map((exp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Education</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.extractedRequirements.education.map((edu, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {edu}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p>Enter job posting details and click "Analyze Job Posting" to see NICE Framework matches.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}