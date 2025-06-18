import OpenAI from "openai";
import { storage } from "./storage";

interface ResumeData {
  filename: string;
  content: string;
}

interface ExtractedResumeData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  experience: {
    totalYears: number;
    cybersecurityYears: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      responsibilities: string[];
      technologies: string[];
    }>;
  };
  education: {
    degrees: Array<{
      degree: string;
      field: string;
      institution: string;
      year?: string;
    }>;
    relevantCoursework: string[];
  };
  skills: {
    technical: string[];
    cybersecurity: string[];
    tools: string[];
    programming: string[];
  };
  certifications: Array<{
    name: string;
    issuer: string;
    year?: string;
    status: 'current' | 'expired' | 'in-progress';
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'expert' | 'executive';
}

interface CareerRecommendation {
  trackId: number;
  trackName: string;
  matchScore: number;
  reasoning: string;
  recommendedLevel: string;
  nextSteps: string[];
  relevantSkills: string[];
  gapAnalysis: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  timeToTransition: string;
}

interface ResumeAnalysisResult {
  extractedData: ExtractedResumeData;
  careerRecommendations: CareerRecommendation[];
  overallAssessment: string;
  strengthAreas: string[];
  developmentAreas: string[];
  nextSteps: string[];
}

export class AIResumeAnalyzer {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async analyzeResume(resumeData: ResumeData): Promise<ResumeAnalysisResult> {
    try {
      // Get career tracks and work roles for context
      const careerTracks = await storage.getCareerTracks();
      const workRoles = await storage.getWorkRoles();

      const careerTracksSummary = careerTracks.map(track => ({
        id: track.id,
        name: track.name,
        description: track.description
      }));

      const workRolesSummary = workRoles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        description: role.description
      }));

      const prompt = `
You are an expert Cybersecurity Career Advisor and Resume Analyst with deep knowledge of the NICE Framework. Analyze this resume thoroughly and provide comprehensive career guidance.

RESUME CONTENT:
${resumeData.content}

AVAILABLE CAREER TRACKS:
${JSON.stringify(careerTracksSummary, null, 2)}

NICE FRAMEWORK WORK ROLES:
${JSON.stringify(workRolesSummary, null, 2)}

ANALYSIS REQUIREMENTS:

1. EXTRACT RESUME DATA:
   - Personal information (name, contact details)
   - Work experience with years calculation
   - Education background
   - Technical and cybersecurity skills
   - Certifications with status
   - Notable projects
   - Determine experience level (entry/mid/senior/expert/executive)

2. CAREER TRACK MATCHING:
   - Match to top 3-5 most suitable career tracks
   - Calculate match scores (0-100) based on skills, experience, interests
   - Provide detailed reasoning for each match
   - Recommend appropriate career level within each track
   - Identify skill gaps and development areas
   - Suggest realistic salary ranges
   - Estimate transition timeline

3. COMPREHENSIVE ASSESSMENT:
   - Overall professional assessment
   - Key strength areas
   - Development opportunities
   - Strategic next steps
   - Career advancement roadmap

CAREER LEVEL DEFINITIONS:
- Entry (0-2 years): New to cybersecurity, foundational skills
- Mid (3-5 years): Solid experience, specialized knowledge
- Senior (6-10 years): Advanced expertise, leadership capabilities
- Expert (11+ years): Deep specialization, industry recognition
- Executive: C-level, strategic leadership, business impact

SCORING CRITERIA:
- Technical skills alignment (30%)
- Experience relevance (25%)
- Certification match (20%)
- Education background (15%)
- Career trajectory (10%)

SALARY BENCHMARKS (USD):
- Entry: $45K-75K
- Mid: $75K-110K  
- Senior: $110K-150K
- Expert: $150K-200K+
- Executive: $200K-300K+

Respond with detailed JSON analysis following this structure:
{
  "extractedData": {
    "personalInfo": {...},
    "experience": {...},
    "education": {...},
    "skills": {...},
    "certifications": [...],
    "projects": [...],
    "experienceLevel": "..."
  },
  "careerRecommendations": [
    {
      "trackId": number,
      "trackName": "...",
      "matchScore": number,
      "reasoning": "...",
      "recommendedLevel": "...",
      "nextSteps": [...],
      "relevantSkills": [...],
      "gapAnalysis": {
        "strengths": [...],
        "gaps": [...],
        "recommendations": [...]
      },
      "salaryRange": {
        "min": number,
        "max": number,
        "currency": "USD"
      },
      "timeToTransition": "..."
    }
  ],
  "overallAssessment": "...",
  "strengthAreas": [...],
  "developmentAreas": [...],
  "nextSteps": [...]
}

Be thorough, specific, and actionable in your recommendations. Focus on realistic career progression based on current qualifications.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system", 
            content: "You are an expert cybersecurity career advisor specializing in NICE Framework alignment and career progression analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');

      // Validate and ensure all required fields exist
      if (!analysis.extractedData) {
        analysis.extractedData = {
          personalInfo: {},
          experience: { totalYears: 0, cybersecurityYears: 0, positions: [] },
          education: { degrees: [], relevantCoursework: [] },
          skills: { technical: [], cybersecurity: [], tools: [], programming: [] },
          certifications: [],
          projects: [],
          experienceLevel: 'entry'
        };
      }

      if (!analysis.careerRecommendations) {
        analysis.careerRecommendations = [];
      }

      if (!analysis.overallAssessment) {
        analysis.overallAssessment = "Resume analysis completed successfully.";
      }

      if (!analysis.strengthAreas) {
        analysis.strengthAreas = [];
      }

      if (!analysis.developmentAreas) {
        analysis.developmentAreas = [];
      }

      if (!analysis.nextSteps) {
        analysis.nextSteps = [];
      }

      return analysis as ResumeAnalysisResult;

    } catch (error) {
      console.error('AI Resume Analysis Error:', error);
      throw new Error('Failed to analyze resume: ' + (error as Error).message);
    }
  }

  async saveResumeAnalysis(resumeData: ResumeData, analysis: ResumeAnalysisResult): Promise<number> {
    try {
      const resumeAnalysis = await storage.createResumeAnalysis({
        filename: resumeData.filename,
        originalText: resumeData.content,
        extractedData: analysis.extractedData,
        careerRecommendations: analysis.careerRecommendations,
        analysisMetadata: {
          overallAssessment: analysis.overallAssessment,
          strengthAreas: analysis.strengthAreas,
          developmentAreas: analysis.developmentAreas,
          nextSteps: analysis.nextSteps,
          analyzedAt: new Date().toISOString()
        }
      });

      return resumeAnalysis.id;
    } catch (error) {
      console.error('Error saving resume analysis:', error);
      throw new Error('Failed to save resume analysis: ' + (error as Error).message);
    }
  }
}