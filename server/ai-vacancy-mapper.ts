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
Analyze this job posting and provide comprehensive matching to NICE Framework work roles and career tracks.

JOB POSTING:
Title: ${jobPosting.jobTitle}
Description: ${jobPosting.jobDescription}
Required Qualifications: ${jobPosting.requiredQualifications || 'Not specified'}
Preferred Qualifications: ${jobPosting.preferredQualifications || 'Not specified'}

AVAILABLE NICE WORK ROLES:
${JSON.stringify(workRolesSummary, null, 2)}

AVAILABLE CAREER TRACKS:
${JSON.stringify(careerTracksSummary, null, 2)}

INSTRUCTIONS:
1. Analyze the job posting requirements and responsibilities
2. Extract key skills, experience levels, education requirements, and certifications
3. Determine the experience level this job is targeting (Entry-Level, Mid-Level, Senior-Level, Expert-Level, Executive-Level)
4. Match to work roles with similarity percentages (75%+ = primary, 50-74% = notable)
5. Identify the best matching career track and create a career progression visualization
6. Analyze if the job requirements align with the identified career level
7. Provide recommendations for improving job description alignment

Career Progression Levels (standard across tracks):
- Entry-Level: 0-2 years experience, bachelor's degree preferred, basic certifications
- Mid-Level: 3-5 years experience, specialized skills, intermediate certifications
- Senior-Level: 6-10 years experience, leadership responsibilities, advanced certifications  
- Expert-Level: 10+ years experience, technical leadership, expert certifications
- Executive-Level: 15+ years experience, strategic leadership, executive responsibilities

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
  "matchSummary": "Overall analysis summary"
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