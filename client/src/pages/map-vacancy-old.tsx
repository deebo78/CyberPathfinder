import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Target, AlertCircle, MapPin, TrendingUp, CheckCircle2, XCircle, ArrowRight, BookOpen, Upload, FileText, Loader2 } from "lucide-react";
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
  roleConsistencyAnalysis?: {
    summary: string;
    conflictsFound: string[];
    unrealisticExpectations: string[];
    redundantOrDuplicateRequirements: string[];
    recommendedImprovements: string[];
    overallConsistencyScore: number;
    severityLevel: 'low' | 'medium' | 'high';
    scoringBreakdown?: {
      baseScore: number;
      deductions: Array<{
        category: string;
        points: number;
        reason: string;
      }>;
      finalScore: number;
    };
  };
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
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [location, setLocation] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      console.log("Analysis result received:", result);
      console.log("Role consistency analysis:", result.roleConsistencyAnalysis);
      console.log("Full result object keys:", Object.keys(result));
      setAnalysis(result);
      toast({
        title: "Analysis Complete", 
        description: `Analysis complete. Consistency data: ${result.roleConsistencyAnalysis ? 'included' : 'missing'}`,
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

  const uploadJobPostingMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch("/api/extract-document", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to extract text from document");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Fill the form fields with extracted text
      setJobDescription(data.extractedText);
      setActiveTab("manual"); // Switch to manual tab to show extracted content
      setUploadedFile(null);
      toast({
        title: "Document Processed",
        description: "Job posting content extracted successfully. Review and add any missing details.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - accept TXT, DOC, and DOCX files
      const allowedTypes = [
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a DOC, DOCX, or TXT file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleUploadJobPosting = () => {
    if (uploadedFile) {
      uploadJobPostingMutation.mutate(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      location,
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
                Job Posting Analysis
              </CardTitle>
              <CardDescription>
                Analyze job postings by uploading a document or entering details manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="upload">Upload Document</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 mt-6">
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
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requiredQualifications">Required Qualifications</Label>
                    <Textarea
                      id="requiredQualifications"
                      value={requiredQualifications}
                      onChange={(e) => setRequiredQualifications(e.target.value)}
                      placeholder="List required skills, experience, and qualifications..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredQualifications">Preferred Qualifications</Label>
                    <Textarea
                      id="preferredQualifications"
                      value={preferredQualifications}
                      onChange={(e) => setPreferredQualifications(e.target.value)}
                      placeholder="List preferred skills and qualifications..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Min Salary ($)</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        placeholder="e.g., 70000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Max Salary ($)</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        placeholder="e.g., 120000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Remote, New York, NY"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleAnalyze} 
                    disabled={analyzeVacancyMutation.isPending}
                    className="w-full"
                  >
                    {analyzeVacancyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Analyze Job Posting
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="upload" className="space-y-6 mt-6">
                  {!uploadedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Upload Job Posting Document
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Upload a job posting in DOC, DOCX, or TXT format
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.doc,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full max-w-md"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Document
                          </Button>
                        </div>
                        <div className="text-sm text-gray-500">
                          Supported: DOC, DOCX, TXT files up to 10MB
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={handleRemoveFile}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                      <Button
                        onClick={handleUploadJobPosting}
                        disabled={uploadJobPostingMutation.isPending}
                        className="w-full"
                      >
                        {uploadJobPostingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Document...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Extract Job Posting Content
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Upload your job posting document</li>
                      <li>• Text is automatically extracted and parsed</li>
                      <li>• Content appears in the manual entry form for review</li>
                      <li>• Add any missing details and analyze</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
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

              {/* Debug section - visible during results */}
              <Card className="bg-yellow-50 border-2 border-yellow-400">
                <CardContent className="pt-6">
                  <p className="text-lg font-bold text-yellow-800">
                    Debug: Frontend is updated - timestamp: {new Date().toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Analysis received: {analysis ? 'Yes' : 'No'}
                  </p>
                  {analysis && (
                    <p className="text-sm text-yellow-700">
                      Consistency analysis data: {analysis.roleConsistencyAnalysis ? 'Available' : 'Missing'}
                    </p>
                  )}
                </CardContent>
              </Card>
              {analysis.roleConsistencyAnalysis && (
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      NICE Framework Alignment
                      <Badge 
                        variant={analysis.roleConsistencyAnalysis.severityLevel === 'high' ? 'destructive' : 
                                analysis.roleConsistencyAnalysis.severityLevel === 'medium' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {analysis.roleConsistencyAnalysis.severityLevel} priority
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Quality assessment and alignment with NICE Framework standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Overall Consistency Score</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {analysis.roleConsistencyAnalysis.overallConsistencyScore}%
                        </span>
                      </div>
                      <Progress value={analysis.roleConsistencyAnalysis.overallConsistencyScore} className="mb-3" />
                      <p className="text-sm text-gray-700 mb-3">{analysis.roleConsistencyAnalysis.summary}</p>
                      
                      {analysis.roleConsistencyAnalysis.scoringBreakdown && (
                        <div className="bg-white border border-gray-200 rounded p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Detailed Scoring Methodology
                            </h5>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  Scoring Standards
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Complete Scoring Standards Reference</DialogTitle>
                                  <DialogDescription>
                                    Comprehensive guide to job posting quality evaluation and point deductions
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                  
                                  {/* Quality Scale */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">Quality Scale</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                                        <div className="font-medium text-green-800">90-100: Excellent</div>
                                        <div className="text-sm text-green-600">Minimal issues, best practices followed</div>
                                      </div>
                                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                        <div className="font-medium text-blue-800">75-89: Good</div>
                                        <div className="text-sm text-blue-600">Minor improvements needed</div>
                                      </div>
                                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <div className="font-medium text-yellow-800">60-74: Fair</div>
                                        <div className="text-sm text-yellow-600">Moderate issues requiring attention</div>
                                      </div>
                                      <div className="p-3 bg-red-50 border border-red-200 rounded">
                                        <div className="font-medium text-red-800">40-59: Poor</div>
                                        <div className="text-sm text-red-600">Significant problems affecting candidates</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Deduction Categories */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-4">Deduction Categories</h3>
                                    <div className="space-y-4">
                                      
                                      {/* Skills Overload */}
                                      <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-700 mb-2">Skills Overload (-15 to -25 points)</h4>
                                        <p className="text-sm text-gray-600 mb-2">Requiring unrealistic breadth of technical expertise</p>
                                        <div className="space-y-1 text-sm">
                                          <div>• 5+ unrelated technology stacks: <span className="font-medium">-15 points</span></div>
                                          <div>• 7+ unrelated technology stacks: <span className="font-medium">-20 points</span></div>
                                          <div>• 10+ unrelated technology stacks: <span className="font-medium">-25 points</span></div>
                                        </div>
                                        <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                                          <div className="text-red-600">❌ "Expert in Python, Java, C++, JavaScript, Go, Rust" (-25 points)</div>
                                          <div className="text-green-600">✅ "Expert in Python with familiarity in Java or C++" (no deduction)</div>
                                        </div>
                                      </div>

                                      {/* Role Scope Conflicts */}
                                      <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-700 mb-2">Role Scope Conflicts (-15 to -25 points)</h4>
                                        <p className="text-sm text-gray-600 mb-2">Combining responsibilities from multiple distinct job functions</p>
                                        <div className="space-y-1 text-sm">
                                          <div>• 2 distinct roles combined: <span className="font-medium">-15 points</span></div>
                                          <div>• 3+ distinct roles combined: <span className="font-medium">-20 points</span></div>
                                          <div>• Management + technical expert roles: <span className="font-medium">-25 points</span></div>
                                        </div>
                                        <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                                          <div className="text-red-600">❌ "Security Analyst + Network Admin + Project Manager" (-20 points)</div>
                                          <div className="text-green-600">✅ "Security Analyst with network monitoring responsibilities" (no deduction)</div>
                                        </div>
                                      </div>

                                      {/* Experience Misalignment */}
                                      <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-700 mb-2">Experience Misalignment (-10 to -20 points)</h4>
                                        <p className="text-sm text-gray-600 mb-2">Experience requirements inconsistent with stated level</p>
                                        <div className="space-y-1 text-sm">
                                          <div>• Minor contradiction (1-2 year variance): <span className="font-medium">-10 points</span></div>
                                          <div>• Major contradiction (3-5 year variance): <span className="font-medium">-15 points</span></div>
                                          <div>• Extreme contradiction (5+ year variance): <span className="font-medium">-20 points</span></div>
                                        </div>
                                      </div>

                                      {/* Compensation Misalignment */}
                                      <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-700 mb-2">Compensation Misalignment (-10 to -15 points)</h4>
                                        <p className="text-sm text-gray-600 mb-2">Salary ranges inconsistent with market rates</p>
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-xs border-collapse">
                                            <thead>
                                              <tr className="border-b">
                                                <th className="text-left p-2">Level</th>
                                                <th className="text-left p-2">Market Range</th>
                                                <th className="text-left p-2">Undercompensation</th>
                                                <th className="text-left p-2">Deduction</th>
                                              </tr>
                                            </thead>
                                            <tbody className="text-xs">
                                              <tr className="border-b">
                                                <td className="p-2">Entry-Level</td>
                                                <td className="p-2">$45K-75K</td>
                                                <td className="p-2">&lt;$40K</td>
                                                <td className="p-2 font-medium">-15 points</td>
                                              </tr>
                                              <tr className="border-b">
                                                <td className="p-2">Mid-Level</td>
                                                <td className="p-2">$75K-110K</td>
                                                <td className="p-2">&lt;$65K</td>
                                                <td className="p-2 font-medium">-10 points</td>
                                              </tr>
                                              <tr className="border-b">
                                                <td className="p-2">Senior-Level</td>
                                                <td className="p-2">$110K-150K</td>
                                                <td className="p-2">&lt;$100K</td>
                                                <td className="p-2 font-medium">-10 points</td>
                                              </tr>
                                              <tr className="border-b">
                                                <td className="p-2">Expert-Level</td>
                                                <td className="p-2">$150K-200K</td>
                                                <td className="p-2">&lt;$140K</td>
                                                <td className="p-2 font-medium">-10 points</td>
                                              </tr>
                                              <tr>
                                                <td className="p-2">Executive-Level</td>
                                                <td className="p-2">$200K+</td>
                                                <td className="p-2">&lt;$180K</td>
                                                <td className="p-2 font-medium">-15 points</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>

                                      {/* Other Categories */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-gray-200 rounded-lg p-4">
                                          <h4 className="font-semibold text-red-700 mb-2">Certification Confusion (-10 to -20 points)</h4>
                                          <div className="space-y-1 text-xs">
                                            <div>• Entry + intermediate certs: -10 points</div>
                                            <div>• Entry + expert certs: -15 points</div>
                                            <div>• Conflicting cert paths: -20 points</div>
                                          </div>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-4">
                                          <h4 className="font-semibold text-red-700 mb-2">Redundant Requirements (-5 to -10 points)</h4>
                                          <div className="space-y-1 text-xs">
                                            <div>• Minor redundancy (2-3 instances): -5 points</div>
                                            <div>• Moderate redundancy (4-5 instances): -7 points</div>
                                            <div>• Major redundancy (6+ instances): -10 points</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Calculation Process */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">Calculation Process</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Start with base score of 100 points</li>
                                        <li>Apply deductions based on identified issues</li>
                                        <li>Add any applicable NICE Framework alignment bonuses</li>
                                        <li>Validate final score against severity indicators</li>
                                        <li>Generate specific improvement recommendations</li>
                                      </ol>
                                    </div>
                                  </div>

                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          {/* Scoring Scale Explanation */}
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <h6 className="text-xs font-semibold text-blue-800 mb-2">Quality Scoring Scale</h6>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-green-700">90-100: Excellent</div>
                              <div className="text-blue-700">75-89: Good</div>
                              <div className="text-yellow-700">60-74: Fair</div>
                              <div className="text-red-700">40-59: Poor</div>
                            </div>
                          </div>

                          {/* Mathematical Breakdown */}
                          <div className="text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="font-medium">Starting Base Score:</span>
                              <span className="font-bold text-green-600">+{analysis.roleConsistencyAnalysis.scoringBreakdown.baseScore}</span>
                            </div>
                            
                            {analysis.roleConsistencyAnalysis.scoringBreakdown.deductions.map((deduction, i) => (
                              <div key={i} className="border-l-4 border-red-300 pl-3 py-2 bg-red-50 rounded-r">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <span className="font-medium text-red-700">{deduction.category}</span>
                                    <p className="text-xs text-red-600 mt-1">{deduction.reason}</p>
                                  </div>
                                  <span className="font-bold text-red-600 ml-2">{deduction.points}</span>
                                </div>
                              </div>
                            ))}
                            
                            <div className="border-t-2 border-gray-300 pt-3 mt-3">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Final Quality Score:</span>
                                <span className={`font-bold text-lg ${
                                  analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore >= 90 ? 'text-green-600' :
                                  analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore >= 75 ? 'text-blue-600' :
                                  analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore >= 60 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Issues Found */}
                    {(analysis.roleConsistencyAnalysis.conflictsFound.length > 0 || 
                      analysis.roleConsistencyAnalysis.unrealisticExpectations.length > 0 || 
                      analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements.length > 0) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Issues Identified
                        </h4>
                        <div className="space-y-4">
                          {analysis.roleConsistencyAnalysis.conflictsFound.length > 0 && (
                            <div>
                              <h5 className="font-medium text-red-700 mb-2">Conflicts Found</h5>
                              <ul className="space-y-1">
                                {analysis.roleConsistencyAnalysis.conflictsFound.map((conflict, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    {conflict}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.roleConsistencyAnalysis.unrealisticExpectations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-orange-700 mb-2">Unrealistic Expectations</h5>
                              <ul className="space-y-1">
                                {analysis.roleConsistencyAnalysis.unrealisticExpectations.map((expectation, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    {expectation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements.length > 0 && (
                            <div>
                              <h5 className="font-medium text-yellow-700 mb-2">Redundant Requirements</h5>
                              <ul className="space-y-1">
                                {analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements.map((redundant, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    {redundant}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.roleConsistencyAnalysis.recommendedImprovements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Recommended Improvements
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <ul className="space-y-2">
                            {analysis.roleConsistencyAnalysis.recommendedImprovements.map((improvement, index) => (
                              <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Next Steps
                      </h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Review the recommendations above to improve job posting clarity and attract more qualified candidates.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                          Export Analysis Report
                        </Button>
                        <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                          View NICE Framework Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4" />
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