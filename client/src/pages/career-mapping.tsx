import { useState } from "react";
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
import { Loader2, User, Target, Award, BookOpen, TrendingUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
}

interface CareerAnalysis {
  recommendations: CareerRecommendation[];
  overallAssessment: string;
  strengthAreas: string[];
  developmentAreas: string[];
}

export default function CareerMapping() {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

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

  const { data: careerTracks } = useQuery({
    queryKey: ["/api/career-tracks"],
    enabled: !!analysis
  });

  const onSubmit = (data: ProfileFormData) => {
    analyzeProfileMutation.mutate(data);
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Assessment
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
                  {analysis.recommendations.map((recommendation, index) => (
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Recommended Level:</h4>
                          <Badge variant="default">{recommendation.recommendedLevel}</Badge>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Relevant Skills:</h4>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.relevantSkills.slice(0, 3).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {recommendation.relevantSkills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{recommendation.relevantSkills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Next Steps:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {recommendation.nextSteps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}