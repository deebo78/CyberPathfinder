import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Target, Award, BookOpen, TrendingUp, Upload, FileText, DollarSign, MapPin, Clock, AlertTriangle, Printer, Download, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  experience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
  interests: z.string().optional(),
  careerGoals: z.string().optional(),
  currentLevel: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface CareerRecommendation {
  trackId: number;
  trackName: string;
  matchScore: number;
  reasoning: string;
  recommendedLevel: string;
  nextSteps: string[];
  relevantSkills: string[];
  gapAnalysis?: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    calculationDetails?: string;
  };
  timeToTransition?: string;
  mentorNarrative?: string;
}

interface ValidationIssue {
  type: 'education_experience_mismatch' | 'certification_timeline' | 'experience_level_mismatch' | 'credential_authority';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string;
  impact: string;
}

interface ValidationFindings {
  overallCredibilityScore: number;
  timelineConsistency: {
    isConsistent: boolean;
    issues: ValidationIssue[];
  };
  credentialVerification: {
    expiredCertificationConcerns: string[];
    futureExpertiseClaims: string[];
    trainingAuthorityMismatches: string[];
  };
  recommendationAdjustments: {
    levelDowngrade: boolean;
    confidenceReduction: number;
    additionalVerificationNeeded: string[];
  };
}

interface NearMissRole {
  trackId: number;
  trackName: string;
  matchScore: number;
  briefReason: string;
}

interface CareerAnalysis {
  recommendations: CareerRecommendation[];
  nearMissRoles?: NearMissRole[];
  overallAssessment: string;
  strengthAreas: string[];
  developmentAreas: string[];
  validationFindings?: ValidationFindings;
}

export default function CareerMapping() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Print/Save utility functions
  const handlePrintAnalysis = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const analysisHtml = generateAnalysisHTML(analysis);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Career Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .recommendation { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .match-score { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .badge { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
            .salary { color: #059669; font-weight: bold; }
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
    const analysisHtml = generateAnalysisHTML(analysis, true);
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Career Analysis Report</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .recommendation { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .match-score { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 16px; font-weight: bold; }
            .badge { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
            .salary { color: #059669; font-weight: bold; }
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
    a.download = `career-analysis-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Saved",
      description: "Your career analysis report has been saved as an HTML file.",
    });
  };

  const generateAnalysisHTML = (analysis: CareerAnalysis | null, includeMetadata = false) => {
    if (!analysis) return '';
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
      <div class="header">
        <h1>CyberPathfinder Career Analysis Report</h1>
        <p>Generated on ${currentDate}</p>
        ${includeMetadata ? `<div class="metadata"><p><strong>Report Type:</strong> Cybersecurity Career Mapping Analysis<br><strong>Platform:</strong> CyberPathfinder - NICE Framework Career Guidance</p></div>` : ''}
      </div>
      
      <div class="section">
        <h2>Overall Assessment</h2>
        <p>${analysis.overallAssessment}</p>
      </div>
      
      <div class="section">
        <h2>Strength Areas</h2>
        ${analysis.strengthAreas.map(strength => `<span class="badge">${strength}</span>`).join(' ')}
      </div>
      
      <div class="section">
        <h2>Development Areas</h2>
        ${analysis.developmentAreas.map(area => `<span class="badge">${area}</span>`).join(' ')}
      </div>
      
      ${analysis.validationFindings && analysis.validationFindings.timelineConsistency?.issues.length > 0 ? `
        <div class="section">
          <h2>Verification Notes</h2>
          <p><strong>Verification Score:</strong> ${analysis.validationFindings.overallCredibilityScore}/100</p>
          ${analysis.validationFindings.timelineConsistency.issues.map(issue => `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 10px; margin: 10px 0;">
              <p><strong>${issue.severity.toUpperCase()}:</strong> ${issue.description}</p>
              ${issue.evidence ? `<p><strong>Details:</strong> ${issue.evidence}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <h2>Match Score Calculation Methodology</h2>
        <div style="background: #f0f9ff; border: 1px solid #0284c7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4 style="color: #0369a1; margin: 0 0 10px 0;">Definable Skills (60%):</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Certification Alignment (25%)</li>
                <li>Experience Length & Depth (20%)</li>
                <li>Technical Skills Match (15%)</li>
              </ul>
            </div>
            <div>
              <h4 style="color: #7c3aed; margin: 0 0 10px 0;">Soft Skills Analysis (40%):</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Previous Role Context (20%)</li>
                <li>Industry Domain Knowledge (10%)</li>
                <li>Career Progression Pattern (10%)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Recommended Career Tracks</h2>
        ${analysis.recommendations.map(rec => `
          <div class="recommendation">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0; color: #1f2937;">${rec.trackName}</h3>
              <span class="match-score">${rec.matchScore}% Match</span>
            </div>
            <p><strong>Recommended Level:</strong> ${rec.recommendedLevel}</p>
            ${rec.salaryRange ? `
              <p class="salary">Salary Range: $${rec.salaryRange.min}K - $${rec.salaryRange.max}K USD</p>
              ${rec.salaryRange.calculationDetails ? `<p style="font-size: 0.9em; color: #666; margin-top: 5px;"><em>${rec.salaryRange.calculationDetails}</em></p>` : ''}
            ` : ''}
            <p>${rec.reasoning}</p>
            
            ${rec.gapAnalysis ? `
              ${rec.gapAnalysis.strengths && rec.gapAnalysis.strengths.length > 0 ? `
                <div style="margin-top: 15px; background: #f0fdf4; border: 1px solid #22c55e; border-radius: 6px; padding: 12px;">
                  <h4 style="color: #166534; margin: 0 0 8px 0;">Your Strengths:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${rec.gapAnalysis.strengths.map(strength => `<li>${strength}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${rec.gapAnalysis.gaps && rec.gapAnalysis.gaps.length > 0 ? `
                <div style="margin-top: 15px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px;">
                  <h4 style="color: #92400e; margin: 0 0 8px 0;">Skill Gaps:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${rec.gapAnalysis.gaps.map(gap => `<li>${gap}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${rec.gapAnalysis.recommendations && rec.gapAnalysis.recommendations.length > 0 ? `
                <div style="margin-top: 15px; background: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 12px;">
                  <h4 style="color: #1e40af; margin: 0 0 8px 0;">Action Items:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${rec.gapAnalysis.recommendations.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            ` : ''}
            
            <div style="margin-top: 15px;">
              <h4>Next Steps:</h4>
              <ul>
                ${rec.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
            ${rec.relevantSkills.length > 0 ? `
              <div style="margin-top: 15px;">
                <h4>Relevant Skills:</h4>
                ${rec.relevantSkills.map(skill => `<span class="badge">${skill}</span>`).join(' ')}
              </div>
            ` : ''}
            ${rec.timeToTransition ? `<p><strong>Estimated Transition Time:</strong> ${rec.timeToTransition}</p>` : ''}
            ${rec.mentorNarrative ? `
              <div style="margin-top: 15px; background: linear-gradient(to right, #faf5ff, #eef2ff); border: 1px solid #a855f7; border-radius: 8px; padding: 15px;">
                <h4 style="color: #7c3aed; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
                  <span style="width: 24px; height: 24px; background: #7c3aed; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 12px;">&#128100;</span>
                  Career Mentor Insights
                </h4>
                <p style="margin: 0; font-style: italic; color: #581c87; line-height: 1.6;">"${rec.mentorNarrative}"</p>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      
      ${analysis.nearMissRoles && analysis.nearMissRoles.length > 0 ? `
        <div class="section">
          <h2>Other Roles Worth Exploring (70-74% Match)</h2>
          <p style="color: #6b7280; font-size: 0.9em; margin-bottom: 15px;">These roles scored just below the recommendation threshold. With targeted skill development, they could become strong matches.</p>
          ${analysis.nearMissRoles.map(role => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; margin-bottom: 8px;">
              <div>
                <strong>${role.trackName}</strong>
                <p style="margin: 4px 0 0 0; font-size: 0.85em; color: #6b7280;">${role.briefReason}</p>
              </div>
              <span style="color: #d97706; font-weight: bold; white-space: nowrap; margin-left: 16px;">${role.matchScore}%</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      experience: "",
      education: "",
      certifications: "",
      interests: "",
      careerGoals: "",
      currentLevel: ""
    }
  });

  const analyzeProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze profile");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setActiveTab("results");
    }
  });

  const uploadResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze resume");
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      // Fetch the complete analysis data using the analysis ID
      if (data.analysisId) {
        try {
          const response = await fetch(`/api/resume-analysis/${data.analysisId}`);
          if (response.ok) {
            const completeAnalysis = await response.json();
            setAnalysis(completeAnalysis);
          } else {
            // Fallback to the data from upload response
            setAnalysis(data);
          }
        } catch (error) {
          console.error("Error fetching complete analysis:", error);
          // Fallback to the data from upload response
          setAnalysis(data);
        }
      } else {
        setAnalysis(data);
      }
      
      setActiveTab("results");
      setUploadedFile(null);
      toast({
        title: "Resume Analyzed",
        description: "Your career recommendations are ready!",
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

  const { data: careerTracks } = useQuery({
    queryKey: ["/api/career-tracks"],
    enabled: !!analysis
  });

  const onSubmit = (data: ProfileFormData) => {
    analyzeProfileMutation.mutate(data);
  };

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

  const handleUploadResume = () => {
    if (uploadedFile) {
      uploadResumeMutation.mutate(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Launch Your Career!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover your ideal cybersecurity career path based on your experience, education, and goals. 
          Get personalized recommendations aligned with the NICE Framework.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Manual Profile
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Resume
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!analysis} className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Career Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tell Us About Yourself
              </CardTitle>
              <CardDescription>
                Help us understand your background to provide the most accurate career recommendations.
                All fields are optional, but more information leads to better recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Professional Experience
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your work experience, including years in cybersecurity, IT, or related fields..."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Education Background
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your educational background, degrees, relevant coursework..."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your cybersecurity certifications (CISSP, CEH, Security+, etc.)..."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas of Interest</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What aspects of cybersecurity interest you most? (threat hunting, compliance, incident response, etc.)..."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="careerGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Career Goals
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What are your short-term and long-term career goals in cybersecurity?"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Career Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your current level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                              <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                              <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                              <SelectItem value="expert">Expert Level (11+ years)</SelectItem>
                              <SelectItem value="executive">Executive Level</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={analyzeProfileMutation.isPending}
                  >
                    {analyzeProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Your Profile...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Get Career Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your resume for instant AI-powered career analysis and personalized recommendations.
                Supports DOC, DOCX, and TXT files.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Choose your resume file
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Upload your resume in DOC, DOCX, or TXT format
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
                        Select Resume File
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
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
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
                    onClick={handleUploadResume}
                    disabled={uploadResumeMutation.isPending}
                    className="w-full"
                  >
                    {uploadResumeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Analyze Resume & Get Recommendations
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI extracts your skills, experience, and education</li>
                  <li>• Matches you to relevant NICE Framework career tracks</li>
                  <li>• Provides personalized career recommendations</li>
                  <li>• Suggests certifications and next steps</li>
                  <li>• Estimates salary ranges and transition timelines</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6" data-testid="analysis-results">
          {analysis && (
            <>
              {/* Print-only header - hidden on screen, visible when printing */}
              <div className="hidden print:block print-header" data-testid="print-header">
                <h1 style={{ fontSize: '24pt', marginBottom: '10px' }}>CyberPathfinder Career Analysis Report</h1>
                <p style={{ color: '#666' }}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysis.overallAssessment}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Strength Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.strengthAreas.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">Development Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.developmentAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Verification Section - smaller and positioned after strengths/development */}
              {analysis.validationFindings && analysis.validationFindings.timelineConsistency?.issues && 
               analysis.validationFindings.timelineConsistency.issues.length > 0 && (
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Verification Notes
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Some discrepancies were detected in the resume. These may be honest mistakes that can be clarified.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Verification Score:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={analysis.validationFindings.overallCredibilityScore} 
                          className="w-16 h-1.5"
                        />
                        <span className="text-xs font-medium">
                          {analysis.validationFindings.overallCredibilityScore}/100
                        </span>
                      </div>
                    </div>

                    {analysis.validationFindings.timelineConsistency.issues.map((issue, index) => (
                      <div key={index} className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <div className="flex items-start gap-2">
                          <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            issue.severity === 'critical' ? 'bg-red-500' :
                            issue.severity === 'high' ? 'bg-amber-500' :
                            issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-yellow-400'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 mb-1">{issue.description}</p>
                            {issue.evidence && (
                              <p className="text-xs text-gray-600 bg-white p-2 rounded border">
                                <strong>Details:</strong> {issue.evidence}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> These observations are based on automated analysis and may reflect honest mistakes or formatting issues. 
                        Consider reviewing these details to ensure accuracy in your application materials.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recommended Career Tracks</CardTitle>
                      <CardDescription>
                        Based on your profile, here are the career tracks that best match your background and goals.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrintAnalysis}
                        variant="outline"
                        size="sm"
                        data-testid="button-print-analysis"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button
                        onClick={handleSaveAnalysis}
                        variant="outline"
                        size="sm"
                        data-testid="button-save-analysis"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Match Score Methodology Explanation */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Match Score Calculation Methodology</h4>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Definable Skills (60%):</span>
                          <div className="ml-2 space-y-0.5">
                            <div>• Certification Alignment (25%)</div>
                            <div>• Experience Length & Depth (20%)</div>
                            <div>• Technical Skills Match (15%)</div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Soft Skills Analysis (40%):</span>
                          <div className="ml-2 space-y-0.5">
                            <div>• Previous Role Context (20%)</div>
                            <div>• Industry Domain Knowledge (10%)</div>
                            <div>• Career Progression Pattern (10%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {analysis.recommendations && analysis.recommendations.length > 0 ? (
                    analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{recommendation.trackName}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Match Score:</span>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={recommendation.matchScore} 
                                className="w-20 h-2"
                              />
                              <span className="font-bold">{recommendation.matchScore}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="mt-2 text-xs text-gray-600">
                          <details className="cursor-pointer">
                            <summary className="hover:text-gray-800 flex items-center gap-1">
                              <span>View detailed score breakdown</span>
                            </summary>
                            <div className="mt-2 p-3 bg-gray-50 rounded border text-xs space-y-2">
                              <div className="font-medium text-gray-800">Score Analysis:</div>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <div className="font-medium text-blue-700">Definable Skills (60%)</div>
                                  <div className="ml-2 space-y-1 text-gray-700">
                                    {recommendation.reasoning.toLowerCase().includes('certification') ? (
                                      <div>✓ Certifications: Contributing to alignment score</div>
                                    ) : (
                                      <div>• Certifications: Limited match detected</div>
                                    )}
                                    <div>• Experience: {recommendation.recommendedLevel} level ({
                                      recommendation.recommendedLevel === 'Entry' ? '0-2 years' :
                                      recommendation.recommendedLevel === 'Mid' ? '3-5 years' :
                                      recommendation.recommendedLevel === 'Senior' ? '6-10 years' :
                                      recommendation.recommendedLevel === 'Expert' ? '11+ years' : 'Executive'
                                    })</div>
                                    {recommendation.relevantSkills?.length > 0 && (
                                      <div>✓ Technical Skills: {recommendation.relevantSkills.length} relevant matches</div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-green-700">Soft Skills Analysis (40%)</div>
                                  <div className="ml-2 space-y-1 text-gray-700">
                                    {recommendation.reasoning.toLowerCase().includes('leadership') || 
                                     recommendation.reasoning.toLowerCase().includes('management') ? (
                                      <div>✓ Leadership context detected</div>
                                    ) : (
                                      <div>• Role responsibilities: Technical focus</div>
                                    )}
                                    {recommendation.reasoning.toLowerCase().includes('experience') && (
                                      <div>✓ Industry domain relevance</div>
                                    )}
                                    <div>• Career progression: Aligned with track requirements</div>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <div className="text-gray-600 italic">
                                  <strong>Calculation:</strong> Definable Skills (60%) + Soft Skills Analysis (40%) = {recommendation.matchScore}% match
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>

                        <p className="text-muted-foreground">{recommendation.reasoning}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Recommended Level:</h4>
                            <Badge variant="default">{recommendation.recommendedLevel}</Badge>
                          </div>

                          {recommendation.salaryRange && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                Salary Range:
                              </h4>
                              <p className="text-sm font-medium text-green-600">
                                ${recommendation.salaryRange.min}K - ${recommendation.salaryRange.max}K
                              </p>
                              {recommendation.salaryRange.calculationDetails ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 cursor-help hover:text-blue-700">
                                        <Info className="h-3 w-3" />
                                        <span className="underline">View calculation breakdown</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-md p-3 bg-white border border-gray-200 shadow-lg" data-testid={`tooltip-salary-calc-${recommendation.trackId}`}>
                                      <p className="text-sm font-semibold mb-1 text-gray-900">Salary Calculation:</p>
                                      <p className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap">
                                        {recommendation.salaryRange.calculationDetails}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                  Based on national averages
                                </p>
                              )}
                            </div>
                          )}

                          {recommendation.timeToTransition && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Transition Time:
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {recommendation.timeToTransition}
                              </p>
                            </div>
                          )}

                          <div>
                            <h4 className="font-medium mb-2">Relevant Skills:</h4>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.relevantSkills?.slice(0, 3).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {recommendation.relevantSkills && recommendation.relevantSkills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{recommendation.relevantSkills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Gap Analysis Section - only for resume-based analysis */}
                        {recommendation.gapAnalysis && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div>
                              <h4 className="font-medium mb-2 text-green-700">Your Strengths:</h4>
                              <ul className="space-y-1">
                                {recommendation.gapAnalysis.strengths?.map((strength, idx) => (
                                  <li key={idx} className="text-sm text-green-600 flex items-start gap-1">
                                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 text-orange-700">Skill Gaps:</h4>
                              <ul className="space-y-1">
                                {recommendation.gapAnalysis.gaps?.map((gap, idx) => (
                                  <li key={idx} className="text-sm text-orange-600 flex items-start gap-1">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {gap}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 text-blue-700">Action Items:</h4>
                              <ul className="space-y-1">
                                {recommendation.gapAnalysis.recommendations?.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-blue-600 flex items-start gap-1">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-medium mb-2">Next Steps:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {recommendation.nextSteps?.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Mentor Narrative Section */}
                        {recommendation.mentorNarrative && (
                          <div className="mt-4 pt-4 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <h4 className="font-semibold text-purple-800">Career Mentor Insights</h4>
                            </div>
                            <p className="text-sm text-purple-900 leading-relaxed italic">
                              "{recommendation.mentorNarrative}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No career recommendations available. Please try uploading your resume again or use the manual profile form.</p>
                    </div>
                  )}

                  {analysis.nearMissRoles && analysis.nearMissRoles.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        Other Roles Worth Exploring (70-74% Match)
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">
                        These roles scored just below the recommendation threshold. With targeted skill development, they could become strong matches.
                      </p>
                      <div className="grid gap-2">
                        {analysis.nearMissRoles.map((role, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-800">{role.trackName}</span>
                              <p className="text-xs text-gray-500 mt-0.5">{role.briefReason}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                              <Progress value={role.matchScore} className="w-16 h-1.5" />
                              <span className="text-xs font-medium text-amber-600 whitespace-nowrap">{role.matchScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}