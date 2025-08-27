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
    id: number;
    name: string;
    description?: string;
    trackId?: number;
    trackName?: string;
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
  salaryAnalysis?: {
    extractedSalary: {
      min: number | null;
      max: number | null;
      payGrade: string | null;
    };
    marketAlignment: string;
    seniorityMismatch: string;
    mismatchDetails: string;
  };
  matchSummary: string;
  qualityAssessment?: string;
  roleConsistencyAnalysis?: {
    summary: string;
    conflictsFound: string[];
    unrealisticExpectations: string[];
    redundantOrDuplicateRequirements: string[];
    missingCompetencies: string[];
    recommendedImprovements: string[];
    exampleRewrites?: Array<{
      section: string;
      original: string;
      improved: string;
      rationale: string;
    }>;
    overallConsistencyScore?: number;
    severityLevel: string;
    scoringBreakdown?: {
      baseScore: number;
      deductions: Array<{
        category: string;
        points: number;
        reason: string;
      }>;
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
      // Get all work roles, career tracks, and certifications from the database
      const workRoles = await storage.getWorkRoles();
      const careerTracks = await storage.getCareerTracks();
      const certifications = await storage.getCertifications();
      
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

      // Create certification reference for level validation
      const certificationReference = certifications.map(cert => ({
        code: cert.code,
        name: cert.name,
        level: cert.level,
        issuer: cert.issuer
      }));

      const prompt = `
You are an expert cybersecurity workforce analyst specializing in NICE Framework mapping. Analyze this job posting for alignment with NICE work roles and assess its overall quality using a severity-based approach.

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

CERTIFICATION LEVEL REFERENCE:
${JSON.stringify(certificationReference, null, 2)}

ANALYSIS INSTRUCTIONS:

1. WORK ROLE MATCHING:
- Find the best matching NICE work roles for this position
- Match based on job duties, required skills, and responsibilities described
- Provide realistic match percentages (10-100%)
- Be honest about poor fits - most non-cybersecurity roles should have 0-20% matches
- For genuine cybersecurity roles, matches should be 60-95%

2. CAREER TRACK RECOMMENDATION:
- Recommend the most appropriate career track from the available options
- Consider the job's focus area, required skills, and seniority level
- Set bestTrackMatch to null if the role is not genuinely cybersecurity-related

3. JOB POSTING QUALITY ASSESSMENT:
Perform these three steps:

Step 1: 🕵️‍♂️ Detect Inconsistencies & Omissions
Look for any of these issues (and flag others you judge equivalent):
• Non-Cybersecurity Role
• Education-Level Mismatch
• Salary-Experience Misalignment (salary too low/high for stated experience requirements)
• Major Experience Contradictions
• Role Level Blurred or Undefined (entry vs. senior, etc.)
• Certification Requirements Unclear or Unrealistic
• Certification Level Mischaracterization (e.g., calling CISSP, CISA, CISM "intermediate" when they are Professional-level)
• Certification Misalignment with Job Level and Salary Grade
• GRC vs. Technical Scope Misalignment
• Any other red-flag likely to confuse or deter qualified applicants

SALARY ANALYSIS FOCUS:
- Only flag salary issues when there is a clear mismatch between compensation and experience/education requirements
- DO NOT suggest generic wording improvements like "commensurate with experience and qualifications"
- DO flag when salary is significantly below or above market rate for the stated experience level
- Reference market benchmarks: Entry ($45K-75K), Mid ($75K-110K), Senior ($110K-150K), Expert ($150K-200K)

CRITICAL: Use the Certification Level Reference to validate any certification requirements mentioned in the job posting. Flag when:
- Professional/Expert-level certifications are incorrectly labeled as "intermediate" or "entry-level"
- Foundation-level certifications are required for senior positions
- Certification requirements don't align with the stated experience level or salary range

Step 2: 📝 List Issues with Specific Examples
Output each problem as its own bullet beginning with an em-dash (—).
For each issue identified, provide SPECIFIC examples from the job posting that demonstrate the problem.
Include exact quotes or phrases that cause the confusion or misalignment.
Format: — Issue Type: Specific problem description with "quoted examples from posting"
**Do not** attach numeric scores, weights, or percentages anywhere.

Step 3: 🚦 Assign ONE Overall Severity Category
Based on the quantity *and* seriousness of the issues, choose **exactly one** label:
• **CRITICAL PRIORITY** (3+ major inconsistencies **or** the role itself is not cybersecurity)
• **HIGH PRIORITY** (2 major **or** 3+ medium issues)
• **MODERATE PRIORITY** (1 major **or** 2 medium issues)
• **LOW PRIORITY** (only minor improvements needed)
• **READY TO POST** (no meaningful issues detected)

FORMAT FOR QUALITY ASSESSMENT:
Place the severity category first, followed by a one-sentence summary and detailed issue list with specific examples:
Example:
"qualityAssessment": "CRITICAL PRIORITY\\nSummary: This role lacks cybersecurity relevance and has multiple critical inconsistencies.\\nIssues:\\n— Education-Level Mismatch: High school requirement stated for Director-level position requiring \"strategic leadership and executive decision-making\"\\n— Non-Cybersecurity Role: No mention of security frameworks, tools, or cybersecurity competencies in job description\\n— Certification Level Mischaracterization: CISSP and CISM described as \"intermediate-level\" when they are Professional-level certifications"

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
  "bestTrackMatch": {
    "id": track_id_number,
    "name": "track_name_from_available_tracks",
    "description": "track_description_from_available_tracks"
  } // or null if not cybersecurity related,
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
  "qualityAssessment": "SEVERITY CATEGORY\nSummary: One-sentence overall health assessment\nIssues:\n— Issue 1 description\n— Issue 2 description\n— Additional issues as needed",
  "roleConsistencyAnalysis": {
    "summary": "Overall priority level for revision",
    "conflictsFound": ["All specific conflicts identified"],
    "unrealisticExpectations": ["All unrealistic requirements"],
    "redundantOrDuplicateRequirements": ["All redundancies"],
    "missingCompetencies": ["All missing cybersecurity competencies"],
    "recommendedImprovements": ["All specific improvement suggestions"],
    "internalConsistencyCheck": "Validation that all recommended changes work together harmoniously without creating new conflicts",
    "coherentSolutionSet": "Summary of how all recommendations align to create a consistent, improved job posting",
    "exampleRewrites": [
      {
        "section": "section name",
        "original": "original problematic text",
        "improved": "specific rewrite suggestion",
        "rationale": "DETAILED explanation including: 1) What specific problem this fixes, 2) Why this change improves candidate attraction, 3) How it aligns with industry standards, 4) What impact the original wording had on qualified candidates, 5) How this change works with other recommendations to create a coherent job posting"
      }
    ],
    "severityLevel": "critical|high|moderate|low|ready"
  }
}

REWRITE EXAMPLES REQUIREMENT:
For EVERY significant issue identified in the qualityAssessment, provide specific rewrite examples in the exampleRewrites array.
Include the exact problematic text from the job posting and show how to fix it.

IMPORTANT: DO NOT provide rewrite examples for salary sections unless there is a clear salary-experience misalignment.
DO NOT suggest adding generic phrases like "commensurate with experience and qualifications" to salary ranges.

EXAMPLE REWRITE FORMAT:
{
  "section": "Certification Requirements",
  "original": "Possesses or obtains within 12 months of employment an intermediate-level cybersecurity certification (e.g., CISSP, CRISC, CISA, CISM)",
  "improved": "Possesses or obtains within 12 months of employment a professional-level cybersecurity certification (e.g., CISSP, CRISC, CISA, CISM)",
  "rationale": "CISSP, CRISC, CISA, and CISM are professional-level certifications that typically require 3-5 years of experience and demonstrate advanced expertise in cybersecurity governance, risk management, and compliance. Calling them 'intermediate-level' misrepresents their difficulty and value, potentially deterring qualified candidates who recognize these as senior-level achievements. The CISSP alone requires 5 years of experience in two or more security domains, making it clearly a professional-level certification. This mischaracterization could also lead to compensation issues since professional-level certifications command higher salaries than intermediate ones."
}

CRITICAL: For every issue mentioned in qualityAssessment, provide a corresponding rewrite example showing the specific text that needs to be changed and exactly how to improve it.

RATIONALE REQUIREMENTS:
Each rewrite rationale must be comprehensive and educational, including:
1. SPECIFIC PROBLEM: What exactly is wrong with the original text
2. INDUSTRY CONTEXT: Why this matters in cybersecurity hiring
3. CANDIDATE IMPACT: How the original wording affects qualified applicants
4. MARKET ALIGNMENT: How the change aligns with industry standards
5. COHERENCE: How this change works with other recommendations
6. MEASURABLE BENEFIT: What improvement this creates (better candidate quality, reduced confusion, etc.)

Minimum 3-4 sentences per rationale. Avoid generic explanations.

INTERNAL CONSISTENCY VALIDATION:
Before finalizing recommendations, validate that all suggested changes work together harmoniously:
- If suggesting role level changes AND certification level changes, ensure they align (e.g., don't suggest "intermediate role" with "professional certifications")
- If suggesting salary changes AND experience changes, ensure compensation matches new experience requirements
- If suggesting education changes AND certification changes, ensure they're complementary not contradictory
- Provide ONE coherent set of recommendations that work together as a complete solution

EXAMPLE COHERENT SOLUTION SET:
If certifications are professional-level (CISSP, CISA, CISM), then:
- Role level should be "Senior" or "Professional" level
- Experience should be 5+ years minimum
- Salary should align with senior/professional range ($110K-150K)
- Education should match professional expectations (Bachelor's required, Master's preferred)`;

      // Try gpt-4o-mini first as fallback, then gpt-4o
      let response;
      try {
        response = await this.openai.chat.completions.create({
          model: "gpt-4o-mini", // Try the mini version first
          messages: [
            {
              role: "system",
              content: "You are an expert cybersecurity workforce analyst specializing in the NICE Framework. Provide detailed, accurate analysis of job postings and their alignment with NICE work roles. Use EXACT mathematical calculations for scoring - do not approximate."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1, // Lower temperature for more consistent responses
          seed: 12345 // Fixed seed for reproducible results
        });
      } catch (miniError) {
        console.log('gpt-4o-mini failed, trying gpt-4o:', miniError);
        response = await this.openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: "You are an expert cybersecurity workforce analyst specializing in the NICE Framework. Provide detailed, accurate analysis of job postings and their alignment with NICE work roles. Use EXACT mathematical calculations for scoring - do not approximate."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1, // Lower temperature for more consistent responses
          seed: 12345 // Fixed seed for reproducible results
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

      console.log('Job posting analysis completed successfully');
      
      // Add default qualityAssessment if missing
      if (!analysis.qualityAssessment) {
        analysis.qualityAssessment = "MODERATE PRIORITY\nSummary: Analysis completed with standard assessment.\nIssues:\n— No specific issues identified in initial analysis";
      }
      
      // Post-process bestTrackMatch if it's just an ID
      if (analysis.bestTrackMatch && typeof analysis.bestTrackMatch === 'number') {
        const trackId = analysis.bestTrackMatch;
        const matchingTrack = careerTracksSummary.find(track => track.id === trackId);
        if (matchingTrack) {
          analysis.bestTrackMatch = {
            id: matchingTrack.id,
            name: matchingTrack.name,
            description: matchingTrack.description || matchingTrack.overview || 'Career track in cybersecurity field'
          };
        } else {
          analysis.bestTrackMatch = null;
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
      // OpenAI API failed, providing fallback analysis
      return {
        primaryMatches: [],
        otherNotableRoles: [],
        bestTrackMatch: {
          id: 1,
          name: 'General Cybersecurity',
          description: 'Unable to perform AI analysis due to API error'
        },
        extractedRequirements: {
          skills: ['General cybersecurity knowledge'],
          experience: ['Entry to mid-level experience'],
          education: ['Bachelor\'s degree preferred'],
          certifications: ['Security+ or equivalent'],
          experienceLevel: 'Entry'
        },
        salaryAnalysis: {
          extractedSalary: { min: null, max: null, payGrade: null },
          marketAlignment: 'insufficient_data',
          seniorityMismatch: 'unknown',
          mismatchDetails: 'Unable to analyze due to API error'
        },
        matchSummary: 'Analysis could not be completed due to API error. Manual review recommended.',
        qualityAssessment: 'MODERATE PRIORITY\nSummary: Unable to perform analysis due to API error.\nIssues:\n— API connection failed, manual review required',
        roleConsistencyAnalysis: {
          summary: 'Unable to perform consistency analysis due to API error.',
          conflictsFound: [],
          unrealisticExpectations: [],
          redundantOrDuplicateRequirements: [],
          missingCompetencies: [],
          recommendedImprovements: ['Please verify job posting requirements manually'],
          severityLevel: 'moderate'
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