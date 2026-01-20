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
import { Building2, Users, Target, AlertCircle, MapPin, TrendingUp, CheckCircle2, XCircle, ArrowRight, BookOpen, Upload, FileText, Loader2, AlertTriangle, Edit3, Printer, Download } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VacancyAnalysis {
  primaryMatches: WorkRoleMatch[];
  otherNotableRoles: WorkRoleMatch[];
  bestTrackMatch: {
    trackId?: number;
    id?: number;
    trackName?: string;
    name?: string;
    description?: string;
    rationale?: string;
    matchPercentage?: number;
    careerProgression?: CareerLevel[];
    jobPositionLevel?: string;
    levelAlignment?: {
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
    expectedSalary?: {
      min: number;
      max: number;
      calculationBreakdown: {
        baseRange: { min: number; max: number };
        trackMultiplier: number;
        trackName: string;
        geoMultiplier: number;
        marketTier: string;
        location: string;
        certificationPremium: number;
        certifications: string[];
      };
      calculationDetails: string;
    };
    marketAlignment: 'aligned' | 'below_market' | 'above_market' | 'insufficient_data';
    seniorityMismatch: 'none' | 'minor' | 'moderate' | 'severe';
    mismatchDetails: string;
    comparisonSummary?: string;
  };
  roleConsistencyAnalysis?: {
    summary: string;
    issuesFound?: string[];
    // Legacy fields for backward compatibility
    conflictsFound?: string[];
    unrealisticExpectations?: string[];
    redundantOrDuplicateRequirements?: string[];
    missingCompetencies?: string[];
    recommendedImprovements?: string[];
    exampleRewrites?: Array<{
      section: string;
      original: string;
      improved: string;
      rationale: string;
    }>;
    overallConsistencyScore?: number;
    severityLevel?: 'low' | 'medium' | 'high' | 'critical' | 'ready';
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
  qualityAssessment?: string;
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

  // Print/Save utility functions
  const handlePrintAnalysis = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const analysisHtml = generateVacancyAnalysisHTML(analysis);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Posting Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .match { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
            .match-score { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .badge { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
            .severity { padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .critical { background: #fef2f2; color: #991b1b; }
            .high { background: #fefce8; color: #a16207; }
            .moderate { background: #f0f9ff; color: #1e40af; }
            .low { background: #f0fdf4; color: #166534; }
            .print-only { display: block; }
            @media screen { .print-only { display: none; } }
          </style>
        </head>
        <body>
          ${analysisHtml}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const handleSaveAnalysis = () => {
    const analysisHtml = generateVacancyAnalysisHTML(analysis, true);
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Job Posting Analysis Report</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .match { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
            .match-score { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .badge { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
            .severity { padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .critical { background: #fef2f2; color: #991b1b; }
            .high { background: #fefce8; color: #a16207; }
            .moderate { background: #f0f9ff; color: #1e40af; }
            .low { background: #f0fdf4; color: #166534; }
            .metadata { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          ${analysisHtml}
        </body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-posting-analysis-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Saved",
      description: "Your job posting analysis report has been saved as an HTML file.",
    });
  };

  const generateVacancyAnalysisHTML = (analysis: VacancyAnalysis | null, includeMetadata = false) => {
    if (!analysis) return '';
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
      <div class="header">
        <h1>CyberPathfinder Job Posting Analysis Report</h1>
        <p>Generated on ${currentDate}</p>
        ${includeMetadata ? `<div class="metadata"><p><strong>Report Type:</strong> NICE Framework Job Posting Analysis<br><strong>Platform:</strong> CyberPathfinder - Map Vacancy Analysis</p></div>` : ''}
      </div>
      
      <div class="section">
        <h2>Analysis Summary</h2>
        <p>${analysis.matchSummary}</p>
      </div>
      
      <div class="section">
        <h2>Primary Work Role Matches</h2>
        ${analysis.primaryMatches.map(match => `
          <div class="match">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0;">${match.workRoleName}</h3>
              <span class="match-score">${match.matchPercentage}% Match</span>
            </div>
            <p><strong>Code:</strong> ${match.workRoleCode} • <strong>Specialty:</strong> ${match.specialtyArea}</p>
            <p>${match.matchReason}</p>
          </div>
        `).join('')}
      </div>
      
      ${analysis.bestTrackMatch ? `
        <div class="section">
          <h2>Best Career Track Match</h2>
          <div class="match">
            <h3>${analysis.bestTrackMatch.trackName}</h3>
            <p><strong>Match Percentage:</strong> ${analysis.bestTrackMatch.matchPercentage}%</p>
            <p><strong>Position Level:</strong> ${analysis.bestTrackMatch.jobPositionLevel}</p>
            ${analysis.bestTrackMatch.levelAlignment && !analysis.bestTrackMatch.levelAlignment.isAligned ? `
              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 4px; margin-top: 10px;">
                <strong>Level Alignment Issues:</strong>
                <ul>
                  ${analysis.bestTrackMatch.levelAlignment.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
      
      <div class="section">
        <h2>Extracted Requirements</h2>
        <p><strong>Experience Level:</strong> ${analysis.extractedRequirements.experienceLevel}</p>
        <div style="margin: 15px 0;">
          <h4>Skills:</h4>
          ${analysis.extractedRequirements.skills.map(skill => `<span class="badge">${skill}</span>`).join(' ')}
        </div>
        <div style="margin: 15px 0;">
          <h4>Certifications:</h4>
          ${analysis.extractedRequirements.certifications.map(cert => `<span class="badge">${cert}</span>`).join(' ')}
        </div>
        <div style="margin: 15px 0;">
          <h4>Education:</h4>
          ${analysis.extractedRequirements.education.map(edu => `<span class="badge">${edu}</span>`).join(' ')}
        </div>
      </div>
      
      ${analysis.salaryAnalysis ? `
        <div class="section">
          <h2>Salary Analysis</h2>
          ${analysis.salaryAnalysis.extractedSalary.min && analysis.salaryAnalysis.extractedSalary.max ? `
            <p><strong>Posted Salary:</strong> $${analysis.salaryAnalysis.extractedSalary.min.toLocaleString()} - $${analysis.salaryAnalysis.extractedSalary.max.toLocaleString()}</p>
          ` : ''}
          ${analysis.salaryAnalysis.expectedSalary ? `
            <p><strong>Expected Range:</strong> $${analysis.salaryAnalysis.expectedSalary.min}K - $${analysis.salaryAnalysis.expectedSalary.max}K</p>
            <div style="background: #f0f4f8; padding: 10px; border-radius: 4px; margin: 10px 0; font-size: 0.9em;">
              <strong>Calculation Breakdown:</strong>
              <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Base Range: $${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.baseRange.min}K - $${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.baseRange.max}K</li>
                <li>Track Multiplier: ×${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.trackMultiplier.toFixed(2)} (${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.trackName})</li>
                <li>Location (${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.marketTier}): ×${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.geoMultiplier.toFixed(2)}</li>
                ${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certificationPremium > 0 ? `
                  <li>Certification Premium: +$${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certificationPremium}K</li>
                ` : ''}
              </ul>
            </div>
            ${analysis.salaryAnalysis.comparisonSummary ? `
              <p style="font-style: italic; color: #555;">${analysis.salaryAnalysis.comparisonSummary}</p>
            ` : ''}
          ` : ''}
          <p><strong>Market Alignment:</strong> ${analysis.salaryAnalysis.marketAlignment.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Seniority Match:</strong> ${analysis.salaryAnalysis.seniorityMismatch}</p>
          ${analysis.salaryAnalysis.mismatchDetails ? `<p><strong>Details:</strong> ${analysis.salaryAnalysis.mismatchDetails}</p>` : ''}
        </div>
      ` : ''}
      
      ${analysis.roleConsistencyAnalysis ? `
        <div class="section">
          <h2>Quality Assessment</h2>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
            <span class="severity ${(analysis.roleConsistencyAnalysis.severityLevel || 'moderate').toLowerCase()}">
              ${analysis.roleConsistencyAnalysis.severityLevel || 'Moderate'} Priority
            </span>
            ${analysis.roleConsistencyAnalysis.overallConsistencyScore ? `
              <span><strong>Score:</strong> ${analysis.roleConsistencyAnalysis.overallConsistencyScore}/100</span>
            ` : ''}
          </div>
          <p>${analysis.roleConsistencyAnalysis.summary}</p>
          
          
          ${analysis.roleConsistencyAnalysis?.exampleRewrites && analysis.roleConsistencyAnalysis.exampleRewrites.length > 0 ? `
            <div style="margin: 15px 0;">
              <h4>Suggested Rewrites:</h4>
              ${analysis.roleConsistencyAnalysis.exampleRewrites.map((rewrite: any) => `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <p><strong>${rewrite.section}</strong></p>
                  <p style="color: #c53030;"><em>Original:</em> "${rewrite.original}"</p>
                  <p style="color: #276749;"><em>Improved:</em> "${rewrite.improved}"</p>
                  <p style="color: #555; font-size: 0.9em;"><em>Why:</em> ${rewrite.rationale}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  };

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
        <div className="space-y-6" data-testid="vacancy-analysis-results">
          {analysis && (
            <>
              {/* Print-only header - hidden on screen, visible when printing */}
              <div className="hidden print:block print-header" data-testid="print-header-vacancy">
                <h1 style={{ fontSize: '24pt', marginBottom: '10px' }}>CyberPathfinder Job Posting Analysis Report</h1>
                <p style={{ color: '#666' }}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              {/* Print/Save Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-green-600">Analysis Complete</CardTitle>
                      <CardDescription>
                        Your job posting has been analyzed against NICE Framework standards.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrintAnalysis}
                        variant="outline"
                        size="sm"
                        data-testid="button-print-vacancy-analysis"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button
                        onClick={handleSaveAnalysis}
                        variant="outline"
                        size="sm"
                        data-testid="button-save-vacancy-analysis"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            
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
                        <h3 className="font-semibold text-gray-900">{analysis.bestTrackMatch.name || analysis.bestTrackMatch.trackName}</h3>
                        {analysis.bestTrackMatch.matchPercentage && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {analysis.bestTrackMatch.matchPercentage}% match
                          </Badge>
                        )}
                      </div>
                      
                      {analysis.bestTrackMatch.jobPositionLevel && (
                        <div className="text-sm text-gray-600">
                          Position Level: <span className="font-medium">{analysis.bestTrackMatch.jobPositionLevel}</span>
                        </div>
                      )}

                      {/* Level Alignment */}
                      {analysis.bestTrackMatch.levelAlignment && (
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
                          
                          {analysis.bestTrackMatch.levelAlignment.issues && analysis.bestTrackMatch.levelAlignment.issues.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">Issues:</p>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {analysis.bestTrackMatch.levelAlignment.issues.map((issue, idx) => (
                                  <li key={idx}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {analysis.bestTrackMatch.levelAlignment.recommendations && analysis.bestTrackMatch.levelAlignment.recommendations.length > 0 && (
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
                      )}

                      {/* Career Progression */}
                      {analysis.bestTrackMatch.careerProgression && analysis.bestTrackMatch.careerProgression.length > 0 && (
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
                      )}
                      
                      {/* Recommendation Rationale */}
                      {analysis.bestTrackMatch.rationale && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Why This Recommendation</h4>
                          <p className="text-sm text-blue-800">{analysis.bestTrackMatch.rationale}</p>
                        </div>
                      )}
                      
                      {/* Track Description */}
                      {analysis.bestTrackMatch.description && (
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm text-gray-600">{analysis.bestTrackMatch.description}</p>
                        </div>
                      )}
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
                      {/* Quality Assessment Display */}
                      {analysis.qualityAssessment ? (
                        <div className="space-y-4">
                          {(() => {
                            const lines = analysis.qualityAssessment.split('\n');
                            const severityLine = lines[0] || 'MODERATE PRIORITY';
                            const summaryLine = lines.find((line: string) => line.startsWith('Summary:'));
                            const issueLines = lines.filter((line: string) => line.startsWith('—'));
                            
                            const getSeverityStyle = (severity: string) => {
                              if (severity.includes('CRITICAL')) return 'bg-red-50 text-red-700 border-red-200';
                              if (severity.includes('HIGH')) return 'bg-orange-50 text-orange-700 border-orange-200';
                              if (severity.includes('MODERATE')) return 'bg-amber-50 text-amber-700 border-amber-200';
                              if (severity.includes('LOW')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
                              if (severity.includes('READY')) return 'bg-green-50 text-green-700 border-green-200';
                              return 'bg-gray-50 text-gray-700 border-gray-200';
                            };

                            return (
                              <>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                  <div className="text-lg font-bold text-gray-900 mb-1">
                                    Quality Assessment
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`mt-2 ${getSeverityStyle(severityLine)}`}
                                  >
                                    {severityLine}
                                  </Badge>
                                </div>
                                
                                {summaryLine && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                                    <p className="text-sm text-gray-700">{summaryLine.replace('Summary: ', '')}</p>
                                  </div>
                                )}
                                
                                {issueLines.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Identified</h4>
                                    <div className="bg-red-50 rounded-lg p-3 space-y-2">
                                      <ul className="text-sm text-red-700 space-y-1">
                                        {issueLines.map((issue: string, index: number) => (
                                          <li key={index} className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5 font-bold">•</span>
                                            <span>{issue.replace('— ', '')}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-sm text-gray-700">{analysis.roleConsistencyAnalysis.summary}</p>
                        </div>
                      )}

                      {/* Salary Analysis */}
                      {analysis.salaryAnalysis && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Salary Analysis</h4>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            {/* Posted Salary */}
                            {analysis.salaryAnalysis.extractedSalary.min && analysis.salaryAnalysis.extractedSalary.max && (
                              <div className="flex justify-between text-sm">
                                <span>Posted Salary:</span>
                                <span className="font-medium">
                                  ${analysis.salaryAnalysis.extractedSalary.min.toLocaleString()} - ${analysis.salaryAnalysis.extractedSalary.max.toLocaleString()}
                                </span>
                              </div>
                            )}
                            
                            {/* Expected Salary with Calculation Breakdown */}
                            {analysis.salaryAnalysis.expectedSalary && (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span>Expected Range:</span>
                                  <span className="font-medium text-blue-700">
                                    ${analysis.salaryAnalysis.expectedSalary.min}K - ${analysis.salaryAnalysis.expectedSalary.max}K
                                  </span>
                                </div>
                                
                                {/* Calculation Breakdown */}
                                <div className="bg-white rounded border border-gray-200 p-3 text-xs space-y-2">
                                  <div className="font-medium text-gray-700 mb-1">Calculation Breakdown:</div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <span className="text-gray-500">Base Range:</span>
                                    <span>${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.baseRange.min}K - ${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.baseRange.max}K</span>
                                    
                                    <span className="text-gray-500">Track Multiplier:</span>
                                    <span>×{analysis.salaryAnalysis.expectedSalary.calculationBreakdown.trackMultiplier.toFixed(2)} ({analysis.salaryAnalysis.expectedSalary.calculationBreakdown.trackName})</span>
                                    
                                    <span className="text-gray-500">Location ({analysis.salaryAnalysis.expectedSalary.calculationBreakdown.marketTier}):</span>
                                    <span>×{analysis.salaryAnalysis.expectedSalary.calculationBreakdown.geoMultiplier.toFixed(2)}</span>
                                    
                                    {analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certificationPremium > 0 && (
                                      <>
                                        <span className="text-gray-500">Cert Premium:</span>
                                        <span>+${analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certificationPremium}K</span>
                                      </>
                                    )}
                                  </div>
                                  {analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certifications.length > 0 && (
                                    <div className="text-gray-500 mt-1">
                                      Certs: {analysis.salaryAnalysis.expectedSalary.calculationBreakdown.certifications.join(', ')}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {/* Comparison Summary */}
                            {analysis.salaryAnalysis.comparisonSummary && (
                              <div className={`text-sm p-2 rounded ${
                                analysis.salaryAnalysis.marketAlignment === 'below_market'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : analysis.salaryAnalysis.marketAlignment === 'above_market'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                {analysis.salaryAnalysis.comparisonSummary}
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

                      {/* Issues Found - only show if qualityAssessment isn't present (to avoid redundancy) */}
                      {!analysis.qualityAssessment && (() => {
                        const issues = analysis.roleConsistencyAnalysis.issuesFound || [
                          ...(analysis.roleConsistencyAnalysis.conflictsFound || []),
                          ...(analysis.roleConsistencyAnalysis.unrealisticExpectations || []),
                          ...(analysis.roleConsistencyAnalysis.redundantOrDuplicateRequirements || []),
                          ...(analysis.roleConsistencyAnalysis.missingCompetencies || [])
                        ];
                        return issues.length > 0 ? (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                            <div className="space-y-2">
                              {issues.map((issue, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{issue}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {/* Example Rewrites */}
                      {analysis.roleConsistencyAnalysis.exampleRewrites && analysis.roleConsistencyAnalysis.exampleRewrites.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Edit3 className="h-4 w-4" />
                            Example Rewrites
                          </h4>
                          <div className="space-y-4">
                            {analysis.roleConsistencyAnalysis.exampleRewrites.map((rewrite, idx) => (
                              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {rewrite.section}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-xs font-medium text-red-700 mb-1">Original (Problematic):</h5>
                                    <p className="text-sm text-gray-700 bg-red-50 border border-red-200 rounded p-2 italic">
                                      "{rewrite.original}"
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium text-green-700 mb-1">Improved Version:</h5>
                                    <p className="text-sm text-gray-900 bg-green-50 border border-green-200 rounded p-2 font-medium">
                                      "{rewrite.improved}"
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium text-blue-700 mb-1">Why This Improves The Posting:</h5>
                                    <p className="text-xs text-gray-600">
                                      {rewrite.rationale}
                                    </p>
                                  </div>
                                </div>
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