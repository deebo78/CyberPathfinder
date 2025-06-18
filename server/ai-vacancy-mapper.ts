import OpenAI from "openai";
import { storage } from "./storage";

interface JobPosting {
  jobTitle: string;
  jobDescription: string;
  requiredQualifications?: string;
  preferredQualifications?: string;
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
You are an expert Cyber Workforce Analyst specializing in NICE Framework alignment and job posting optimization. Your role is to:

1. Map job postings to appropriate NICE Framework work roles
2. Identify best-fit career tracks from the NICE-aligned catalog
3. Extract and organize job requirements (skills, experience, education, certifications)
4. Analyze internal consistency and alignment within the job posting
5. Detect role creep, unrealistic expectations, conflicting qualifications, and inconsistencies
6. Provide actionable improvement recommendations for clearer, more effective job postings

JOB POSTING TO ANALYZE:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}
Preferred Qualifications: ${jobPosting.preferredQualifications || 'Not specified'}

AVAILABLE NICE WORK ROLES:
${JSON.stringify(workRolesSummary, null, 2)}

AVAILABLE CAREER TRACKS:
${JSON.stringify(careerTracksSummary, null, 2)}

ANALYSIS FRAMEWORK:
Career Progression Levels (standard across tracks):
- Entry-Level: 0-2 years experience, bachelor's degree preferred, basic certifications
- Mid-Level: 3-5 years experience, specialized skills, intermediate certifications
- Senior-Level: 6-10 years experience, leadership responsibilities, advanced certifications  
- Expert-Level: 10+ years experience, technical leadership, expert certifications
- Executive-Level: 15+ years experience, strategic leadership, executive responsibilities

CONSISTENCY ANALYSIS CRITERIA & SCORING:
- Role Scope Conflicts: Combining incompatible responsibilities (-15 to -25 points)
- Experience Misalignment: Requirements inconsistent with stated level (-10 to -20 points)
- Education Contradictions: Conflicting degree requirements (-5 to -15 points)
- Certification Confusion: Mixing entry-level and expert certifications (-10 to -20 points)
- Skills Overload: Unrealistic breadth of technical skills (-15 to -25 points)
- Compensation Misalignment: Salary ranges inconsistent with experience/responsibility (-10 to -15 points)
- Redundant Requirements: Duplicate or overlapping qualifications (-5 to -10 points)

SCORING METHODOLOGY:
- Start with base score of 100
- Deduct points for each identified issue based on severity
- Final score ranges: 90-100 (excellent), 75-89 (good), 60-74 (fair), 40-59 (poor), 0-39 (critical issues)
- Severity levels: high (score <60), medium (60-79), low (80+)

RESPONSE FORMAT (JSON only):
{
  "primaryMatches": [
    {
      "workRoleId": number,
      "workRoleName": "string",
      "workRoleCode": "string", 
      "matchPercentage": number,
      "matchReason": "string",
      "category": "string",
      "specialtyArea": "string"
    }
  ],
  "otherNotableRoles": [similar format],
  "bestTrackMatch": {
    "trackId": number,
    "trackName": "string",
    "matchPercentage": number,
    "careerProgression": [
      {
        "level": "Entry-Level",
        "title": "Junior [Role Title]",
        "description": "Brief description of this level",
        "typicalExperience": "0-2 years",
        "keyResponsibilities": ["responsibility1", "responsibility2"],
        "isJobMatch": false
      },
      {
        "level": "Mid-Level", 
        "title": "[Role Title]",
        "description": "Brief description of this level",
        "typicalExperience": "3-5 years",
        "keyResponsibilities": ["responsibility1", "responsibility2"],
        "isJobMatch": true
      }
    ],
    "jobPositionLevel": "Mid-Level",
    "levelAlignment": {
      "isAligned": true/false,
      "issues": ["issue1 if not aligned"],
      "recommendations": ["recommendation1", "recommendation2"]
    }
  },
  "extractedRequirements": {
    "skills": ["skill1", "skill2"],
    "experience": ["experience requirement"],
    "education": ["education requirement"],
    "certifications": ["cert1", "cert2"],
    "experienceLevel": "Mid-Level"
  },
  "matchSummary": "Overall analysis summary",
  "roleConsistencyAnalysis": {
    "summary": "Detailed assessment of job posting consistency, clarity, and alignment with industry standards",
    "conflictsFound": [
      "SPECIFIC conflicts with exact details (e.g., 'Requires 10+ years experience but labeled as entry-level position')",
      "SPECIFIC misalignments between job title, responsibilities, and qualifications",
      "SPECIFIC contradictions in technical requirements or certifications"
    ],
    "unrealisticExpectations": [
      "SPECIFIC examples of scope creep (e.g., 'Combines network security, application development, and project management - typically 3 separate roles')",
      "SPECIFIC skill combinations that are market-unrealistic (e.g., 'Expert-level skills in 8+ unrelated technologies')",
      "SPECIFIC experience mismatches (e.g., 'Junior role requiring senior-level decision-making authority')"
    ],
    "redundantOrDuplicateRequirements": [
      "SPECIFIC instances of repetition with examples (e.g., 'Security clearance mentioned in 3 different sections')",
      "SPECIFIC overlapping skills that could be consolidated (e.g., 'Lists both Python programming and Python scripting separately')"
    ],
    "recommendedImprovements": [
      "SPECIFIC, actionable suggestions with clear implementation steps",
      "SPECIFIC NICE Framework alignments (e.g., 'Align with Systems Administration (IO-WRL-005) by focusing on...')",
      "SPECIFIC ways to improve candidate attraction (e.g., 'Split into two roles: Security Analyst and Network Administrator')",
      "SPECIFIC language improvements (e.g., 'Replace vague requirement X with specific skill Y')"
    ],
    "overallConsistencyScore": 85,
    "severityLevel": "low",
    "scoringBreakdown": {
      "baseScore": 100,
      "deductions": [
        {"category": "Skills Overload", "points": -10, "reason": "Specific explanation"},
        {"category": "Redundant Requirements", "points": -5, "reason": "Specific explanation"}
      ],
      "finalScore": 85
    }
  }
}

CRITICAL SCORING INSTRUCTIONS:
1. BE MATHEMATICALLY CONSISTENT: If you identify unrealistic expectations or conflicts, the score MUST reflect this (typically 60-74 for fair, 40-59 for poor)
2. MATCH SEVERITY TO SCORE: high severity = <60, medium = 60-79, low = 80+
3. EXPLAIN DEDUCTIONS: Show exact point deductions in scoringBreakdown
4. BE HONEST: If no significant issues exist, score should be 90+ with minimal/no issues listed
5. AVOID CONTRADICTIONS: Don't flag "unrealistic expectations" with an 85% score - this is illogical

DETAILED ANALYSIS GUIDELINES:

1. CONFLICT DETECTION - Look for these specific issues:
   - Title vs. Responsibility Mismatch: "Senior" title but entry-level tasks
   - Experience Contradictions: Different experience requirements in different sections
   - Certification Conflicts: Mixing beginner and expert certifications
   - Salary vs. Requirements: Compensation doesn't match skill/experience level
   - Technical Impossibilities: Requiring expertise in conflicting technologies

2. UNREALISTIC EXPECTATIONS - Identify these patterns:
   - Role Consolidation: Combining 2+ distinct job functions
   - Technology Overload: Requiring expertise in 5+ unrelated tech stacks
   - Timeline Unrealism: "Immediate expert proficiency" in complex systems
   - Market Scarcity: Skills combinations that exist in <1% of candidates
   - Level Inflation: Junior roles with senior responsibilities

3. REDUNDANCY DETECTION - Find these duplications:
   - Skill Repetition: Same requirement listed multiple ways
   - Experience Double-Counting: Similar experience requirements restated
   - Education Overlap: Multiple ways of stating same degree requirement
   - Certification Redundancy: Related certs listed separately when one covers the other

4. IMPROVEMENT RECOMMENDATIONS - Provide specific actions:
   - "Split into [Role A] focusing on [X] and [Role B] focusing on [Y]"
   - "Reduce required technologies from [list] to core 3: [specific techs]"
   - "Align salary range with [specific market data/level]"
   - "Replace '[vague requirement]' with '[specific, measurable requirement]'"
   - "Map to NICE Framework role [Code] by emphasizing [specific tasks/skills]"

5. MARKET INTELLIGENCE - Add context about:
   - Typical salary ranges for the identified role and experience level
   - Common skill gaps in the current cybersecurity market
   - Certification pathways that align with career progression
   - Geographic considerations if location affects requirements

6. NICE FRAMEWORK ALIGNMENT - Enhance recommendations with:
   - Specific NICE work role codes that best match the position
   - Tasks from the NICE Framework that should be emphasized
   - Knowledge, Skills, and Abilities (KSAs) that are missing but should be included
   - Career progression pathway within the NICE Framework

7. CANDIDATE ATTRACTION IMPROVEMENTS - Suggest:
   - How to make the role more appealing to diverse candidates
   - Ways to clarify growth opportunities and career development
   - Benefits or perks that would strengthen the posting
   - Language adjustments to improve inclusivity

Important: If the job posting is genuinely well-written and consistent, state this clearly with a 90+ score rather than manufacturing issues. Be honest about quality and provide value-added insights even for well-written postings.`;

      const response = await this.openai.chat.completions.create({
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

      return analysis as VacancyAnalysis;

    } catch (error) {
      console.error('AI Vacancy Mapping Error:', error);
      throw new Error('Failed to analyze job posting: ' + (error as Error).message);
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