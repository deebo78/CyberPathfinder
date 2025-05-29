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
  extractedRequirements: {
    skills: string[];
    experience: string[];
    education: string[];
    certifications: string[];
  };
  matchSummary: string;
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
      // Get all work roles from the database
      const workRoles = await storage.getWorkRoles();
      
      // Create a summary of work roles for the AI
      const workRolesSummary = workRoles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.workRoleId,
        description: role.description,
        category: role.category?.name || 'Unknown',
        specialtyArea: role.specialtyArea?.name || 'Unknown'
      }));

      const prompt = `
Analyze this job posting and match it to the most appropriate NICE Framework work roles.

JOB POSTING:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}
Preferred Qualifications: ${jobPosting.preferredQualifications || 'Not specified'}

AVAILABLE NICE WORK ROLES:
${JSON.stringify(workRolesSummary, null, 2)}

INSTRUCTIONS:
1. Analyze the job posting requirements and responsibilities
2. Extract key skills, experience levels, education requirements, and certifications mentioned
3. Match the job posting to work roles with similarity percentages (0-100%)
4. Identify primary matches (75% or higher) and other notable roles (50-74%)
5. Provide clear reasoning for each match
6. Create a summary of the overall analysis

Response format (JSON):
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
  "otherNotableRoles": [
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
  "extractedRequirements": {
    "skills": ["skill1", "skill2"],
    "experience": ["experience requirement"],
    "education": ["education requirement"],
    "certifications": ["cert1", "cert2"]
  },
  "matchSummary": "Overall analysis summary explaining the best matches and why"
}`;

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