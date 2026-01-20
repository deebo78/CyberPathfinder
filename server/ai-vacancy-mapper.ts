import OpenAI from "openai";
import { storage } from "./storage";
import { 
  MarketTier, 
  getLocationTier, 
  getExecutiveSalaryBand, 
  getExecutiveSalaryCaps, 
  EXECUTIVE_CERT_PREMIUMS 
} from "@shared/compensation";

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
  kstAlignmentExplanation?: string; // HR-friendly explanation of why this role matches based on KSTs
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
    marketAlignment: string;
    seniorityMismatch: string;
    mismatchDetails: string;
    comparisonSummary?: string;
  };
  matchSummary: string;
  qualityAssessment?: string;
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
    severityLevel?: string;
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

  /**
   * Calculates expected salary range based on role, level, location, and certifications
   * Uses the same methodology as Career Planning for consistency
   */
  private calculateExpectedSalary(
    experienceLevel: string,
    track: { id: number; name: string; salaryWeighting?: number | string | null },
    location: string | undefined,
    certifications: string[]
  ): {
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
  } {
    // Base salary ranges by experience level (in thousands)
    const baseSalaryRanges: Record<string, { min: number; max: number }> = {
      'Entry': { min: 55, max: 75 },
      'Mid': { min: 75, max: 105 },
      'Senior': { min: 105, max: 145 },
      'Expert': { min: 140, max: 190 },
      'Lead': { min: 140, max: 190 }
    };

    // Normalize experience level
    const normalizedLevel = experienceLevel.includes('Entry') ? 'Entry' :
                           experienceLevel.includes('Mid') ? 'Mid' :
                           experienceLevel.includes('Senior') ? 'Senior' :
                           experienceLevel.includes('Expert') || experienceLevel.includes('Lead') ? 'Expert' : 'Mid';

    // Get track multiplier (salaryWeighting from career track)
    const trackMultiplier = track.salaryWeighting ? Number(track.salaryWeighting) : 1.0;

    // Geographic multiplier based on market tier
    const tier = getLocationTier(location);
    const geoMultipliers: Record<MarketTier, { multiplier: number; description: string }> = {
      [MarketTier.TIER_A]: { multiplier: 1.25, description: 'Premium Market (SF/NYC/Boston)' },
      [MarketTier.TIER_B]: { multiplier: 1.12, description: 'Large Metro (DC/Seattle/LA/Chicago)' },
      [MarketTier.TIER_C]: { multiplier: 1.0, description: 'Mid-Size Market' },
      [MarketTier.TIER_D]: { multiplier: 0.88, description: 'Small City/Rural' }
    };
    const geoInfo = geoMultipliers[tier];

    // Certification premiums (in thousands)
    let certPremium = 0;
    const matchedCerts: string[] = [];
    const normalizedCerts = certifications.map(c => c.toUpperCase());
    
    if (normalizedCerts.some(c => c.includes('CISSP') || c.includes('CISM'))) {
      certPremium += 12;
      matchedCerts.push('CISSP/CISM (+$12K)');
    }
    if (normalizedCerts.some(c => c.includes('AWS') || c.includes('AZURE') || c.includes('GCP') || c.includes('CLOUD'))) {
      certPremium += 10;
      matchedCerts.push('Cloud Certs (+$10K)');
    }
    if (normalizedCerts.some(c => c.includes('CEH') || c.includes('OSCP') || c.includes('GPEN') || c.includes('GCIH'))) {
      certPremium += 7;
      matchedCerts.push('Specialized (+$7K)');
    }
    if (normalizedCerts.length >= 3 && certPremium === 0) {
      certPremium += 8;
      matchedCerts.push('Multiple Certs (+$8K)');
    }

    const baseRange = baseSalaryRanges[normalizedLevel] || baseSalaryRanges['Mid'];
    const minSalary = Math.round((baseRange.min * trackMultiplier * geoInfo.multiplier) + certPremium);
    const maxSalary = Math.round((baseRange.max * trackMultiplier * geoInfo.multiplier) + certPremium);

    const calculationDetails = `${normalizedLevel}-Level: $${baseRange.min}K-$${baseRange.max}K base × ${trackMultiplier.toFixed(2)} (${track.name}) × ${geoInfo.multiplier.toFixed(2)} (${geoInfo.description}) + $${certPremium}K certs = $${minSalary}K-$${maxSalary}K`;

    return {
      min: minSalary,
      max: maxSalary,
      calculationBreakdown: {
        baseRange: baseRange,
        trackMultiplier: trackMultiplier,
        trackName: track.name,
        geoMultiplier: geoInfo.multiplier,
        marketTier: `Tier ${tier}`,
        location: location || 'Not specified',
        certificationPremium: certPremium,
        certifications: matchedCerts
      },
      calculationDetails
    };
  }

  /**
   * Generates HR-friendly explanations of why work roles match based on NICE Framework KSTs
   */
  private async generateKSTAlignmentExplanations(
    matches: WorkRoleMatch[],
    jobPosting: JobPosting
  ): Promise<WorkRoleMatch[]> {
    if (matches.length === 0) return matches;

    try {
      // Fetch KSTs for matched work roles (limit to top 3 to keep prompt size manageable)
      const topMatches = matches.slice(0, 3);
      const workRoleKSTs = await Promise.all(
        topMatches.map(async (match) => {
          const roleWithRelations = await storage.getWorkRoleWithRelations(match.workRoleId);
          if (!roleWithRelations) return null;
          
          // Get sample KSTs (first 5 of each type)
          const tasks = (roleWithRelations.workRoleTasks || [])
            .slice(0, 5)
            .map((t: any) => t.task?.description || '')
            .filter((d: string) => d);
          const knowledge = (roleWithRelations.workRoleKnowledge || [])
            .slice(0, 5)
            .map((k: any) => k.knowledgeItem?.description || '')
            .filter((d: string) => d);
          const skills = (roleWithRelations.workRoleSkills || [])
            .slice(0, 5)
            .map((s: any) => s.skill?.description || '')
            .filter((d: string) => d);
          
          return {
            workRoleId: match.workRoleId,
            workRoleName: match.workRoleName,
            tasks,
            knowledge,
            skills
          };
        })
      );

      const validKSTs = workRoleKSTs.filter(k => k !== null);
      if (validKSTs.length === 0) return matches;

      // Generate HR-friendly explanations using AI
      const prompt = `
You are an HR advisor helping explain why job positions align with specific NICE Framework work roles. 
Write explanations that non-technical HR professionals can understand.

JOB POSTING:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}

MATCHED WORK ROLES WITH THEIR NICE FRAMEWORK COMPETENCIES:
${JSON.stringify(validKSTs, null, 2)}

For each work role, write a 2-3 sentence paragraph explaining WHY this role matches the job posting.
- Connect specific job duties or requirements to the role's competencies
- Use plain, everyday language (avoid jargon like "KSTs" or "NICE Framework")
- Explain what someone in this role actually does that matches what the job needs
- Be specific but concise

RESPONSE FORMAT (JSON):
{
  "explanations": [
    {
      "workRoleId": number,
      "explanation": "2-3 sentence paragraph explaining the alignment in HR-friendly language"
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You translate technical competency frameworks into clear, everyday language for HR professionals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const explanations = result.explanations || [];

      // Merge explanations into matches
      return matches.map(match => {
        const explanation = explanations.find((e: any) => e.workRoleId === match.workRoleId);
        return {
          ...match,
          kstAlignmentExplanation: explanation?.explanation || undefined
        };
      });

    } catch (error) {
      console.error('Error generating KST explanations:', error);
      return matches; // Return original matches without explanations on error
    }
  }

  async analyzeJobPosting(jobPosting: JobPosting): Promise<VacancyAnalysis> {
    try {
      // Get all work roles, career tracks (NICE v2.0 only), and certifications from the database
      const workRoles = await storage.getWorkRoles();
      const careerTracks = await storage.getCareerTracks({ isNiceV2: true });
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
• Non-Cyber/IT Role (ONLY flag roles clearly outside cybersecurity AND information technology domains)
• Education-Level Mismatch
• Salary-Experience Misalignment (salary too low/high for stated experience requirements)
• Major Experience Contradictions
• Role Level Blurred or Undefined (entry vs. senior, etc.)
• Certification Requirements Unclear or Unrealistic
• Certification Level Mischaracterization (e.g., calling CISSP, CISA, CISM "intermediate" when they are Professional-level)
• Certification Prerequisite Errors (e.g., stating eligibility for PMP with insufficient experience for education level)
• Certification Misalignment with Job Level and Salary Grade
• GRC vs. Technical Scope Misalignment
• Any other red-flag likely to confuse or deter qualified applicants

IMPORTANT: NICE Framework includes many IT roles that support cybersecurity objectives (Technical Support, Network Operations, System Administration, etc.). Do NOT flag these as "Non-Cyber/IT Role". Only flag roles that are clearly outside both cybersecurity AND information technology domains (e.g., marketing, finance, HR roles with no tech component).

SALARY ANALYSIS FOCUS:
- Always evaluate salary alignment using market benchmarks, never default to "insufficient_data"
- Reference market benchmarks: Entry ($45K-75K), Mid ($75K-110K), Senior ($110K-150K), Expert ($150K-200K)
- Project Management roles typically command 10-20% premium over general IT roles

EXPLICIT SALARY EVALUATION RULES:
1. Determine experience level from job posting (Entry/Mid/Senior/Expert)
2. Compare salary range midpoint against benchmark range
3. For Mid-level (3+ years experience): benchmark is $75K-110K
   - If salary midpoint < $75K → "below_market"
   - If salary midpoint $75K-110K → "aligned" 
   - If salary midpoint > $132K (120% of $110K) → "above_market"
4. Always calculate and show your work in mismatchDetails
5. "insufficient_data" ONLY if no salary range provided

EXAMPLE: $47,982 - $63,351 midpoint = $55,667 for Mid-level role
Since $55,667 < $75,000 (mid-level minimum) = "below_market"

CRITICAL: Use the Certification Level Reference to validate any certification requirements mentioned in the job posting. Flag when:
- Professional/Expert-level certifications are incorrectly labeled as "intermediate" or "entry-level"
- Foundation-level certifications are required for senior positions
- Certification requirements don't align with the stated experience level or salary range
- Certification prerequisite requirements are factually incorrect (e.g., PMP eligibility requires 5 years experience with high school diploma, not 3 years)

CERTIFICATION PREREQUISITE VALIDATION:
Common certification prerequisites to validate:
- PMP: Requires 5 years experience (high school) OR 3 years experience (bachelor's degree)
- CISSP: Requires 5 years experience in 2+ security domains
- CISA: Requires 5 years experience in IS auditing, control, or security
- CISM: Requires 5 years experience in information security management
- CRISC: Requires 3 years experience in IS risk and control
Flag when job postings state eligibility requirements that contradict these official prerequisites.

IMPORTANT - SECURITY CLEARANCES ARE NOT CERTIFICATIONS:
Security clearances (SECRET, TOP SECRET, TS/SCI, etc.) are government-granted access levels based on background investigations and adjudication. They are NOT professional certifications and should NOT be:
- Listed under "certifications" in extractedRequirements
- Flagged as certification mismatches or mischaracterizations
- Compared against certification level references
Instead, clearance requirements should be noted as part of "experience" requirements if mentioned, but never treated as credential issues.

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
    "description": "track_description_from_available_tracks",
    "rationale": "Explain WHY this career track was recommended - consider factors like: seniority level indicated by experience requirements, strategic vs tactical focus, leadership/oversight responsibilities, and how the role fits into a broader career trajectory. Be specific about what in the job posting led to this recommendation."
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
    "marketAlignment": "aligned|below_market|above_market|insufficient_data",
    "seniorityMismatch": "severe|moderate|minor|none",
    "mismatchDetails": "explanation of any salary-seniority gaps"
  },
  "matchSummary": "Honest overall assessment",
  "qualityAssessment": "SEVERITY CATEGORY\nSummary: One-sentence overall health assessment\nIssues:\n— Issue 1 description\n— Issue 2 description\n— Additional issues as needed",
  "roleConsistencyAnalysis": {
    "summary": "2-3 sentence assessment of the job posting's overall quality and what needs improvement",
    "issuesFound": ["Each distinct issue with a brief description - do NOT repeat the full qualityAssessment issues here, just list the category names"],
    "exampleRewrites": [
      {
        "section": "section name (e.g., Education Requirements, Certification Requirements, Experience Requirements)",
        "original": "exact problematic text quoted from the job posting",
        "improved": "your specific rewrite that fixes the issue",
        "rationale": "2-3 sentences explaining: what's wrong with the original, how the fix helps, and why it matters for candidates"
      }
    ],
    "severityLevel": "critical|high|moderate|low|ready"
  }
}

REWRITE GUIDELINES:
- Provide ONE rewrite example per significant issue (not every minor concern)
- Quote the EXACT problematic text from the job posting in "original"
- Keep rationales concise: 2-3 sentences max explaining the problem and benefit of the fix
- DO NOT rewrite salary sections unless there's a clear misalignment
- Ensure all rewrites work together consistently (e.g., if you upgrade education, ensure certifications align)

EXAMPLE REWRITE:
{
  "section": "Certification Requirements",
  "original": "intermediate-level cybersecurity certification (e.g., CISSP, CRISC, CISA, CISM)",
  "improved": "professional-level cybersecurity certification (e.g., CISSP, CRISC, CISA, CISM)",
  "rationale": "CISSP, CISA, and CISM require 5+ years experience and are professional-level certifications, not intermediate. Mislabeling them may deter qualified candidates who recognize their true value."
}`;

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
          issuesFound: [],
          exampleRewrites: [],
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
      
      // Calculate expected salary based on matched track, level, location, and certifications
      if (analysis.bestTrackMatch && analysis.extractedRequirements) {
        const trackId = analysis.bestTrackMatch.id;
        const matchedTrack = careerTracks.find(t => t.id === trackId);
        
        if (matchedTrack) {
          const experienceLevel = analysis.extractedRequirements.experienceLevel || 'Mid';
          const location = jobPosting.location || undefined; // Pass undefined to get Tier C default
          const certifications = analysis.extractedRequirements.certifications || [];
          
          const expectedSalary = this.calculateExpectedSalary(
            experienceLevel,
            { 
              id: matchedTrack.id, 
              name: matchedTrack.name, 
              salaryWeighting: matchedTrack.salaryWeighting 
            },
            location,
            certifications
          );
          
          // Ensure salaryAnalysis exists
          if (!analysis.salaryAnalysis) {
            analysis.salaryAnalysis = {
              extractedSalary: { min: null, max: null, payGrade: null },
              marketAlignment: 'insufficient_data',
              seniorityMismatch: 'none',
              mismatchDetails: ''
            };
          }
          
          // Add expected salary calculation
          analysis.salaryAnalysis.expectedSalary = expectedSalary;
          
          // Generate comparison summary if we have both extracted and expected salaries
          if (analysis.salaryAnalysis.extractedSalary.min && analysis.salaryAnalysis.extractedSalary.max) {
            const extractedMid = (analysis.salaryAnalysis.extractedSalary.min + analysis.salaryAnalysis.extractedSalary.max) / 2;
            const expectedMid = ((expectedSalary.min + expectedSalary.max) / 2) * 1000; // Convert from K
            const percentDiff = Math.round(((extractedMid - expectedMid) / expectedMid) * 100);
            
            if (percentDiff < -15) {
              analysis.salaryAnalysis.comparisonSummary = `Posted salary is ${Math.abs(percentDiff)}% below expected range. This may affect ability to attract qualified candidates.`;
            } else if (percentDiff > 15) {
              analysis.salaryAnalysis.comparisonSummary = `Posted salary is ${percentDiff}% above expected range. This is competitive and should attract strong candidates.`;
            } else {
              analysis.salaryAnalysis.comparisonSummary = `Posted salary is well-aligned with market expectations for this role and location.`;
            }
          }
        }
      }

      // Generate HR-friendly KST alignment explanations for primary matches
      if (analysis.primaryMatches && analysis.primaryMatches.length > 0) {
        analysis.primaryMatches = await this.generateKSTAlignmentExplanations(
          analysis.primaryMatches,
          jobPosting
        );
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
          summary: 'Unable to perform consistency analysis due to API error. Please verify job posting requirements manually.',
          issuesFound: [],
          exampleRewrites: [],
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
- CRITICAL: If only one salary figure is given (e.g., "$54,000", "54K"), use it for BOTH min and max
- If salary is mentioned as "up to $X", use X as max and leave min null
- If hourly rate is given, convert to annual (multiply by 2080)
- Return null for both if no salary information found

SINGLE SALARY VALUE EXAMPLES:
- "$54,000" → min: 54000, max: 54000
- "54K" → min: 54000, max: 54000  
- "Salary: $54,000" → min: 54000, max: 54000

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