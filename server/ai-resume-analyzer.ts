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
You are an expert Cybersecurity Career Advisor and Resume Analyst with deep knowledge of the NICE Framework. Analyze this resume thoroughly and provide comprehensive, gender-neutral career guidance.

IMPORTANT: Use gender-neutral language throughout your analysis. Refer to the candidate as "the candidate," "they," or "them" regardless of the name or any perceived gender indicators.

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
   - Certifications with status and dates
   - Notable projects
   - Determine experience level (entry/mid/senior/expert/executive)

2. CRITICAL VALIDATION CHECKS:
   **Timeline Consistency Analysis**:
   - Cross-reference education dates with claimed work experience
   - Flag if senior positions predate relevant education by significant margins
   - Validate certification dates against claimed expertise in those areas
   - Check if training/teaching roles align with current certification status
   - Identify gaps between claimed experience start dates and educational milestones

   **Credential Verification**:
   - Flag expired certifications that don't support current training claims
   - Validate if technical experience timeline matches certification acquisition
   - Check for "future" or "in-progress" certifications claimed as current expertise
   - Assess if advanced roles match educational background timing

   **Experience Level Validation**:
   - Verify if claimed seniority aligns with education completion dates
   - Flag director/executive claims without supporting educational foundation
   - Cross-check years of experience against biographical timeline consistency

3. CAREER TRACK MATCHING:
   - Match the candidate to top 3-5 most suitable career tracks
   - Calculate match scores (0-100) based on their skills, experience, interests
   - Provide detailed reasoning for each match
   - Recommend appropriate career level within each track
   - Identify their skill gaps and development areas
   - Suggest realistic salary ranges
   - Estimate transition timeline
   - **FACTOR IN VALIDATION ISSUES**: Reduce recommendations if timeline inconsistencies exist

4. COMPREHENSIVE ASSESSMENT:
   - Overall professional assessment of the candidate
   - Their key strength areas
   - Their development opportunities
   - Strategic next steps for their career
   - Career advancement roadmap tailored to their profile
   - **INCLUDE CREDIBILITY ASSESSMENT**: Flag any timeline or credential inconsistencies

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

CRITICAL VALIDATION EXAMPLES TO DETECT:
1. Education vs Experience Timeline Issues:
   - Undergraduate degree in 2020 + claimed 15+ years senior experience starting 2009
   - Director roles in 2012 without prior relevant degree completion
   - Graduate studies starting 2025 but claiming advanced expertise for years prior

2. Certification Authority vs Current Status:
   - Expired CISSP since 2018 + current claims of developing CISSP training
   - Teaching/training roles without valid current certifications
   - Claims of expertise in areas where certifications lapsed

3. Skills vs Certification Timeline:
   - Red team/STIG experience 2009-2012 + Security+ not acquired until 2024
   - Advanced technical roles predating foundational certifications by years
   - Specialized expertise claims before acquiring basic industry certifications

4. Future Expertise Claims:
   - "In Progress" certifications listed as current competencies
   - CMMC expertise claims + CMMC CCP exam listed as future/in-progress
   - Training others in areas where personal certification is incomplete

SCORING IMPACT FOR VALIDATION ISSUES:
- Critical issues (timeline impossible): Reduce credibility score by 40-50 points
- High severity (major inconsistencies): Reduce by 25-35 points  
- Medium severity (questionable timelines): Reduce by 15-25 points
- Low severity (minor discrepancies): Reduce by 5-10 points

LANGUAGE GUIDELINES:
- Use "the candidate," "they," "them," "their" throughout
- Avoid gendered assumptions based on names
- Focus on skills and qualifications objectively
- Use inclusive, professional language
- Be direct about validation concerns - credibility matters for hiring decisions

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
  "validationFindings": {
    "overallCredibilityScore": number (0-100),
    "timelineConsistency": {
      "isConsistent": boolean,
      "issues": [
        {
          "type": "education_experience_mismatch" | "certification_timeline" | "experience_level_mismatch" | "credential_authority",
          "severity": "low" | "medium" | "high" | "critical",
          "description": "...",
          "evidence": "...",
          "impact": "..."
        }
      ]
    },
    "credentialVerification": {
      "expiredCertificationConcerns": [...],
      "futureExpertiseClaims": [...],
      "trainingAuthorityMismatches": [...]
    },
    "recommendationAdjustments": {
      "levelDowngrade": boolean,
      "confidenceReduction": number,
      "additionalVerificationNeeded": [...]
    }
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