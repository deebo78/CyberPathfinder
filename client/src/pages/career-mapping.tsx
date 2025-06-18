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
import { Loader2, User, Target, Award, BookOpen, TrendingUp, Upload, FileText, DollarSign, MapPin, Clock } from "lucide-react";
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
  };
  timeToTransition?: string;
}

interface CareerAnalysis {
  recommendations: CareerRecommendation[];
  overallAssessment: string;
  strengthAreas: string[];
  developmentAreas: string[];
}

export default function CareerMapping() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      // Validate file type
      if (file.type !== 'text/plain') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a text (.txt) file. PDF support coming soon.",
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
                Currently supports text (.txt) files. PDF support coming soon.
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
                        Upload a text file of your resume for analysis
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
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
                      Supported: .txt files up to 10MB
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

        <TabsContent value="results" className="space-y-6">
          {analysis && (
            <>
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

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Career Tracks</CardTitle>
                  <CardDescription>
                    Based on your profile, here are the career tracks that best match your background and goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                ${recommendation.salaryRange.min.toLocaleString()} - ${recommendation.salaryRange.max.toLocaleString()}
                              </p>
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
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No career recommendations available. Please try uploading your resume again or use the manual profile form.</p>
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