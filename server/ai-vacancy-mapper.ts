import OpenAI from "openai";
import { storage } from "./storage";

interface JobPosting {
  jobTitle: string;
  jobDescription: string;
  requiredQualifications?: string;
  preferredQualifications?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  location?: string;
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

export class AIVacancyMapper {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async analyzeJobPosting(jobPosting: JobPosting): Promise<VacancyAnalysis> {
    try {
      // Get all work roles and career tracks from the database
      const workRoles = await storage.getWorkRoles();
      const careerTracks = await storage.getCareerTracks();
      
      // Create a summary of work roles for the AI
      const workRolesSummary = workRoles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        description: role.description,
        categoryId: role.categoryId,
        specialtyAreaId: role.specialtyAreaId
      }));

      const careerTracksSummary = careerTracks.map(track => ({
        id: track.id,
        name: track.name,
        description: track.description,
        overview: track.overview
      }));

      const prompt = `
You are an expert cybersecurity workforce analyst specializing in NICE Framework mapping. Your primary role is to critically evaluate cybersecurity job postings for accuracy, realism, and framework alignment.

CRITICAL EVALUATION PRIORITIES:
1. CYBERSECURITY RELEVANCE: Immediately flag non-cybersecurity roles attempting to claim cybersecurity alignment
2. EDUCATION-LEVEL MISMATCHES: Detect when education requirements don't match role seniority
3. SALARY TRANSPARENCY: Heavily penalize missing compensation information for senior roles
4. EXPERIENCE CONTRADICTIONS: Identify conflicting experience requirements
5. UNREALISTIC SCOPE: Flag roles that combine multiple distinct job functions

JOB POSTING TO ANALYZE:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}
Preferred Qualifications: ${jobPosting.preferredQualifications || 'Not specified'}
Salary Range: ${jobPosting.salaryMin && jobPosting.salaryMax ? `$${jobPosting.salaryMin.toLocaleString()} - $${jobPosting.salaryMax.toLocaleString()}` : 'Not specified'}
Location: ${jobPosting.location || 'Not specified'}

AVAILABLE NICE WORK ROLES:
${JSON.stringify(workRolesSummary, null, 2)}

AVAILABLE CAREER TRACKS:
${JSON.stringify(careerTracksSummary, null, 2)}

STRICT SCORING METHODOLOGY:
Start with base score of 100, then apply MANDATORY deductions:

CRITICAL DEDUCTIONS (Apply ALL that match):
- Non-Cybersecurity Role: -40 points (if job lacks cybersecurity competencies/frameworks/responsibilities)
- Education-Level Mismatch: -25 points (high school for Director, no degree for Senior, etc.)
- Missing Salary Range: -20 points (for Mid-Level and above roles)
- Major Experience Contradictions: -20 points (3 years required vs 15+ years preferred)
- Role Scope Conflicts: -20 points (combining 3+ distinct job functions)

MAJOR DEDUCTIONS:
- Skills Overload: -15 points (expert in 5+ unrelated technologies)
- Certification Confusion: -15 points (mixing entry and expert certs)
- Experience Misalignment: -15 points (experience doesn't match stated level)
- Compensation Below Market: -15 points (salary significantly below market)

MODERATE DEDUCTIONS:
- Redundant Requirements: -10 points (duplicate qualifications)
- Missing Cybersecurity Frameworks: -10 points (no NIST, ISO, NICE mention)
- Vague Requirements: -10 points (non-specific technical requirements)

MINOR DEDUCTIONS:
- Minor Inconsistencies: -5 points (small language contradictions)

FINAL SCORE INTERPRETATION:
- 90-100: Excellent (minimal issues, ready to post)
- 75-89: Good (minor improvements needed)
- 60-74: Fair (significant revisions required)
- 40-59: Poor (major overhaul needed)
- 0-39: Critical (completely unusable, fundamental problems)

CYBERSECURITY RELEVANCE TEST:
A role is NOT cybersecurity-related if it lacks:
- Cybersecurity frameworks (NIST, ISO 27001, NICE)
- Security tools and technologies
- Risk management responsibilities
- Incident response duties
- Security compliance requirements
- Vulnerability management tasks
- Security architecture responsibilities

NON-CYBERSECURITY INDICATORS:
- General IT project management without security focus
- Basic network administration without security context
- Pure software development without security considerations
- Business operations without security responsibilities

EXAMPLE DEDUCTION APPLICATION:
For a "Director Portfolio & Program Management" role with only high school education required, no cybersecurity competencies, and no salary range:
- Base Score: 100
- Non-Cybersecurity Role: -40 (lacks any cybersecurity frameworks, tools, or responsibilities)
- Education-Level Mismatch: -25 (high school for Director role)
- Missing Salary Range: -20 (Director level requires compensation transparency)
- Major Experience Contradictions: -20 (3 years minimum vs 15+ years preferred)
- Final Score: 100 - 40 - 25 - 20 - 20 = -5 (minimum 0)

RESPONSE FORMAT (JSON only):
{
  "primaryMatches": [
    {
      "workRoleId": number,
      "workRoleName": "string",
      "workRoleCode": "string", 
      "matchPercentage": number,
      "matchReason": "Honest assessment of alignment or lack thereof",
      "category": "string",
      "specialtyArea": "string"
    }
  ],
  "otherNotableRoles": [],
  "bestTrackMatch": null_if_not_cybersecurity_role,
  "extractedRequirements": {
    "skills": ["skill1", "skill2"],
    "experience": ["experience requirement"],
    "education": ["education requirement"],
    "certifications": ["cert1", "cert2"],
    "experienceLevel": "determined level"
  },
  "salaryAnalysis": {
    "extractedSalary": {
      "min": number_or_null,
      "max": number_or_null,
      "payGrade": "string_if_mentioned"
    },
    "marketAlignment": "insufficient_data",
    "seniorityMismatch": "severe|moderate|minor|none",
    "mismatchDetails": "explanation of any salary-seniority gaps"
  },
  "matchSummary": "Honest overall assessment",
  "roleConsistencyAnalysis": {
    "summary": "HIGH PRIORITY for revision before posting" (if score <60),
    "conflictsFound": ["All specific conflicts identified"],
    "unrealisticExpectations": ["All unrealistic requirements"],
    "redundantOrDuplicateRequirements": ["All redundancies"],
    "missingCompetencies": ["All missing cybersecurity competencies"],
    "recommendedImprovements": ["All specific improvement suggestions"],
    "overallConsistencyScore": calculated_final_score,
    "severityLevel": "critical|high|medium|low",
    "scoringBreakdown": {
      "baseScore": 100,
      "deductions": [
        {"category": "Exact Category Name", "points": -exact_points, "reason": "Specific explanation with evidence"}
      ],
      "finalScore": exact_calculated_result
    }
  }
}

BE BRUTALLY HONEST: This role has fundamental problems that require major revision before posting.`;

      // Try gpt-4o-mini first as fallback, then gpt-4o
      let response;
      try {
        response = await this.openai.chat.completions.create({
          model: "gpt-4o-mini", // Try the mini version first
          messages: [
            {
              role: "system",
              content: "You are an expert cybersecurity workforce analyst specializing in the NICE Framework. Provide detailed, accurate analysis of job postings and their alignment with NICE work roles."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3
        });
      } catch (miniError) {
        console.log('gpt-4o-mini failed, trying gpt-4o:', miniError);
        response = await this.openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are an expert cybersecurity workforce analyst specializing in the NICE Framework. Provide detailed, accurate analysis of job postings and their alignment with NICE work roles."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3
        });
      }

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate the response structure and add any missing fields
      if (!analysis.primaryMatches) analysis.primaryMatches = [];
      if (!analysis.otherNotableRoles) analysis.otherNotableRoles = [];
      if (!analysis.extractedRequirements) {
        analysis.extractedRequirements = {
          skills: [],
          experience: [],
          education: [],
          certifications: []
        };
      }
      if (!analysis.matchSummary) {
        analysis.matchSummary = "Analysis completed successfully.";
      }
      if (!analysis.roleConsistencyAnalysis) {
        analysis.roleConsistencyAnalysis = {
          summary: "No consistency analysis available.",
          conflictsFound: [],
          unrealisticExpectations: [],
          redundantOrDuplicateRequirements: [],
          recommendedImprovements: [],
          overallConsistencyScore: 75,
          severityLevel: "low"
        };
      }

      // Only validate the scoring structure exists, don't override AI calculations
      if (analysis.roleConsistencyAnalysis?.scoringBreakdown) {
        const finalScore = analysis.roleConsistencyAnalysis.scoringBreakdown.finalScore;
        const overallScore = analysis.roleConsistencyAnalysis.overallConsistencyScore;
        
        console.log(`AI Analysis Score: Overall ${overallScore}, Final ${finalScore}`);
        
        // Only fix if there's a genuine mismatch (more than 1 point difference)
        if (Math.abs(finalScore - overallScore) > 1) {
          console.log(`Warning: Score mismatch detected - using AI's calculated score: ${finalScore}`);
          analysis.roleConsistencyAnalysis.overallConsistencyScore = finalScore;
        }
      }

      return analysis as VacancyAnalysis;

    } catch (error) {
      console.error('AI Vacancy Mapping Error:', error);
      
      // Check if it's an OpenAI API error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('OpenAI API endpoint not found. Please verify your API key and model access.');
      }
      
      // For other errors, provide fallback analysis
      console.warn('OpenAI API failed, providing fallback analysis');
      return {
        primaryMatches: [],
        otherNotableRoles: [],
        bestTrackMatch: {
          trackId: 1,
          trackName: 'General Cybersecurity',
          matchPercentage: 50,
          matchReason: 'Unable to perform AI analysis due to API error'
        },
        extractedRequirements: {
          skills: ['General cybersecurity knowledge'],
          experience: ['Entry to mid-level experience'],
          education: ['Bachelor\'s degree preferred'],
          certifications: ['Security+ or equivalent']
        },
        matchSummary: 'Analysis could not be completed due to API error. Manual review recommended.',
        roleConsistencyAnalysis: {
          summary: 'Unable to perform consistency analysis due to API error.',
          conflictsFound: [],
          unrealisticExpectations: [],
          redundantOrDuplicateRequirements: [],
          recommendedImprovements: ['Please verify job posting requirements manually'],
          overallConsistencyScore: 50,
          severityLevel: 'medium' as const
        }
      } as VacancyAnalysis;
    }
  }

  async extractJobPostingFields(rawText: string): Promise<{
    jobTitle?: string;
    jobDescription?: string;
    requiredQualifications?: string;
    preferredQualifications?: string;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
  }> {
    try {
      const prompt = `
Extract structured job posting information from the following text. Focus on identifying:

1. Job Title: The main position title
2. Job Description: COMPLETE job description including ALL sections like "Position Description", "Primary Duties and Responsibilities", "Duties", "Responsibilities", etc. Combine all descriptive content about what the role entails.
3. Required Qualifications: Must-have requirements (sections like "Minimum Qualifications", "Required", "Must Have")
4. Preferred Qualifications: Nice-to-have requirements (sections like "Preferred Qualifications", "Preferred", "Nice to Have")
5. Salary Range: Extract minimum and maximum salary figures in USD
6. Location: Work location or "Remote" if applicable

IMPORTANT JOB DESCRIPTION EXTRACTION RULES:
- Include the complete job overview, position description, and ALL detailed duties/responsibilities
- Look for sections like "Primary Duties and Responsibilities", "Key Responsibilities", "Job Duties", "What You'll Do"
- Combine all relevant job content into one comprehensive description
- Do NOT just extract a summary - include the full detailed responsibilities

IMPORTANT SALARY EXTRACTION RULES:
- Look for salary ranges like "$50,000 - $75,000", "$50K-75K", "50-75k", etc.
- Convert abbreviated formats (50K = 50000, 75K = 75000)
- If only one salary figure is given, use it for both min and max
- If salary is mentioned as "up to $X", use X as max and leave min null
- If hourly rate is given, convert to annual (multiply by 2080)
- Return null for both if no salary information found

Return ONLY valid JSON in this exact format:
{
  "jobTitle": "extracted title or null",
  "jobDescription": "complete comprehensive job description including all duties and responsibilities or null", 
  "requiredQualifications": "required skills/experience or null",
  "preferredQualifications": "preferred skills/experience or null",
  "salaryMin": numeric_value_or_null,
  "salaryMax": numeric_value_or_null,
  "location": "location string or null"
}

Job Posting Text:
${rawText}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert job posting parser. Extract structured information accurately and return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const extracted = JSON.parse(response.choices[0].message.content || '{}');
      return extracted;

    } catch (error) {
      console.error('Error extracting job posting fields:', error);
      // Return empty structure on error
      return {};
    }
  }

  async getDetailedWorkRoleMatch(workRoleId: number, jobPosting: JobPosting): Promise<any> {
    try {
      const workRole = await storage.getWorkRoleWithRelations(workRoleId);
      if (!workRole) {
        throw new Error('Work role not found');
      }

      const prompt = `
Provide a detailed analysis of how this job posting aligns with the specific NICE Framework work role.

JOB POSTING:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}
Preferred Qualifications: ${jobPosting.preferredQualifications || 'Not specified'}

NICE WORK ROLE:
${JSON.stringify(workRole, null, 2)}

Provide a detailed match analysis including:
1. Overall compatibility percentage
2. Specific skills alignment
3. Experience level match
4. Gap analysis
5. Recommendations for the hiring organization

Response in JSON format with detailed analysis.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || '{}');

    } catch (error) {
      console.error('Detailed Work Role Match Error:', error);
      throw new Error('Failed to get detailed work role match: ' + (error as Error).message);
    }
  }
}

export const aiVacancyMapper = new AIVacancyMapper();