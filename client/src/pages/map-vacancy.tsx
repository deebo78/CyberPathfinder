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
  salaryAnalysis?: {
    extractedSalary: {
      min: number | null;
      max: number | null;
      payGrade?: string;
    };
    marketAlignment: 'aligned' | 'below_market' | 'above_market' | 'insufficient_data';
    seniorityMismatch: 'none' | 'minor' | 'moderate' | 'severe';
    mismatchDetails: string;
  };
  roleConsistencyAnalysis?: {
    summary: string;
    conflictsFound: string[];
    unrealisticExpectations: string[];
    redundantOrDuplicateRequirements: string[];
    missingCompetencies?: string[];
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
  ksaAlignment?: {
    matchedKSAs: string[];
    missingCriticalKSAs: string[];
  };
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
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Job posting analysis completed successfully.",
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
      // Fill all form fields with extracted structured data
      if (data.jobTitle && data.jobTitle !== 'untitled') {
        setJobTitle(data.jobTitle);
      }
      setJobDescription(data.jobDescription || data.extractedText);
      setRequiredQualifications(data.requiredQualifications || '');
      setPreferredQualifications(data.preferredQualifications || '');
      setSalaryMin(data.salaryMin ? String(data.salaryMin) : '');
      setSalaryMax(data.salaryMax ? String(data.salaryMax) : '');
      setLocation(data.location || '');
      
      setActiveTab("manual");
      setUploadedFile(null);
      toast({
        title: "Document Processed",
        description: `Job posting parsed successfully. ${data.salaryMin || data.salaryMax ? 'Salary range detected.' : ''} Review and analyze.`,
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

    const data = {
      jobTitle,
      jobDescription,
      requiredQualifications,
      preferredQualifications,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      location,
    };

    analyzeVacancyMutation.mutate(data);
  };

  const getCandidatesByWorkRole = async (workRoleId: number) => {
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
          {analysis && (
            <>
              {/* Primary Matches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Primary Work Role Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.primaryMatches.map((match, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{match.workRoleName}</h3>
                            <p className="text-sm text-gray-600">{match.workRoleCode} • {match.specialtyArea}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {match.matchPercentage}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{match.matchReason}</p>
                        <Button
                          onClick={() => getCandidatesByWorkRole(match.workRoleId)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Find Candidates
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Best Career Track Match */}
              {analysis.bestTrackMatch && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Career Track Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{analysis.bestTrackMatch.trackName}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {analysis.bestTrackMatch.matchPercentage}% match
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Position Level: <span className="font-medium">{analysis.bestTrackMatch.jobPositionLevel}</span>
                      </div>

                      {/* Level Alignment */}
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {analysis.bestTrackMatch.levelAlignment.isAligned ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          )}
                          <span className="text-sm font-medium">
                            {analysis.bestTrackMatch.levelAlignment.isAligned ? "Well Aligned" : "Needs Adjustment"}
                          </span>
                        </div>
                        
                        {analysis.bestTrackMatch.levelAlignment.issues.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">Issues:</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {analysis.bestTrackMatch.levelAlignment.issues.map((issue, idx) => (
                                <li key={idx}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {analysis.bestTrackMatch.levelAlignment.recommendations.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Recommendations:</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {analysis.bestTrackMatch.levelAlignment.recommendations.map((rec, idx) => (
                                <li key={idx}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Career Progression */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Career Progression</h4>
                        <div className="space-y-2">
                          {analysis.bestTrackMatch.careerProgression.map((level, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded border ${
                                level.isJobMatch 
                                  ? 'bg-blue-50 border-blue-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{level.title}</span>
                                {level.isJobMatch && (
                                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                    Current Level
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{level.typicalExperience}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* NICE Framework Alignment */}
              {analysis.roleConsistencyAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      NICE Framework Alignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Overall Score */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {analysis.roleConsistencyAnalysis.overallConsistencyScore}/100
                        </div>
                        <div className="text-sm text-gray-600">Overall Consistency Score</div>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 ${
                            analysis.roleConsistencyAnalysis.severityLevel === 'high' 
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : analysis.roleConsistencyAnalysis.severityLevel === 'medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          {analysis.roleConsistencyAnalysis.severityLevel.toUpperCase()} PRIORITY
                        </Badge>
                      </div>

                      {/* Summary */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                        <p className="text-sm text-gray-700">{analysis.roleConsistencyAnalysis.summary}</p>
                      </div>

                      {/* Scoring Breakdown */}
                      {analysis.roleConsistencyAnalysis.scoringBreakdown && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Scoring Breakdown</h4>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Base Score:</span>
                              <span className="font-medium">{analysis.roleConsistencyAnalysis.scoringBreakdown.baseScore}</span>
                            </div>
                            {analysis.roleConsistencyAnalysis.scoringBreakdown.deductions.map((deduction, idx) => (
                              <div key={idx} className="flex justify-between text-sm text-red-600">
                                <span>{deduction.category}:</span>
                                <span>-{deduction.points}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between text-sm font-medium">
                              <span>Final Score:</span>
                              <span>{analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Salary Analysis */}
                      {analysis.salaryAnalysis && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Salary Analysis</h4>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {analysis.salaryAnalysis.extractedSalary.min && analysis.salaryAnalysis.extractedSalary.max && (
                              <div className="flex justify-between text-sm">
                                <span>Extracted Range:</span>
                                <span className="font-medium">
                                  ${analysis.salaryAnalysis.extractedSalary.min.toLocaleString()} - ${analysis.salaryAnalysis.extractedSalary.max.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {analysis.salaryAnalysis.extractedSalary.payGrade && (
                              <div className="flex justify-between text-sm">
                                <span>Pay Grade:</span>
                                <span className="font-medium">{analysis.salaryAnalysis.extractedSalary.payGrade}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span>Market Alignment:</span>
                              <Badge variant="outline" className={`${
                                analysis.salaryAnalysis.marketAlignment === 'below_market' 
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : analysis.salaryAnalysis.marketAlignment === 'above_market'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : analysis.salaryAnalysis.marketAlignment === 'aligned'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {analysis.salaryAnalysis.marketAlignment.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Seniority Match:</span>
                              <Badge variant="outline" className={`${
                                analysis.salaryAnalysis.seniorityMismatch === 'severe' 
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : analysis.salaryAnalysis.seniorityMismatch === 'moderate'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : analysis.salaryAnalysis.seniorityMismatch === 'minor'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                {analysis.salaryAnalysis.seniorityMismatch === 'none' ? 'ALIGNED' : analysis.salaryAnalysis.seniorityMismatch.toUpperCase()}
                              </Badge>
                            </div>
                            {analysis.salaryAnalysis.mismatchDetails && (
                              <div className="text-sm text-gray-600 italic">
                                {analysis.salaryAnalysis.mismatchDetails}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Missing Competencies */}
                      {analysis.roleConsistencyAnalysis.missingCompetencies && analysis.roleConsistencyAnalysis.missingCompetencies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Missing Competencies</h4>
                          <div className="space-y-2">
                            {analysis.roleConsistencyAnalysis.missingCompetencies.map((competency, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{competency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Issues and Recommendations */}
                      {(analysis.roleConsistencyAnalysis.conflictsFound.length > 0 ||
                        analysis.roleConsistencyAnalysis.unrealisticExpectations.length > 0 ||
                        analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements.length > 0) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                          <div className="space-y-2">
                            {analysis.roleConsistencyAnalysis.conflictsFound.map((conflict, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{conflict}</span>
                              </div>
                            ))}
                            {analysis.roleConsistencyAnalysis.unrealisticExpectations.map((expectation, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{expectation}</span>
                              </div>
                            ))}
                            {analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements.map((redundant, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{redundant}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.roleConsistencyAnalysis.recommendedImprovements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommended Improvements</h4>
                          <div className="space-y-2">
                            {analysis.roleConsistencyAnalysis.recommendedImprovements.map((improvement, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{improvement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Other Notable Roles */}
              {analysis.otherNotableRoles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      Other Relevant Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.otherNotableRoles.map((match, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{match.workRoleName}</h4>
                            <p className="text-sm text-gray-600">{match.workRoleCode}</p>
                          </div>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {match.matchPercentage}% match
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Extracted Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    Extracted Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Experience Level</h4>
                      <Badge variant="outline">{analysis.extractedRequirements.experienceLevel}</Badge>
                    </div>
                    
                    {analysis.extractedRequirements.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.extractedRequirements.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysis.extractedRequirements.certifications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.extractedRequirements.certifications.map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}