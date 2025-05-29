import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UserProfile {
  experience?: string;
  education?: string;
  certifications?: string;
  interests?: string;
  careerGoals?: string;
  currentLevel?: string;
}

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

export class AICareerMapper {
  async analyzeUserProfile(profile: UserProfile): Promise<CareerAnalysis> {
    try {
      // Get career tracks and NICE Framework data
      const careerTracks = await storage.getCareerTracks();
      const categories = await storage.getCategories();
      const workRoles = await storage.getWorkRoles();
      const skills = await storage.getSkills();

      // Create context for AI analysis
      const contextData = {
        careerTracks: careerTracks.map(track => ({
          id: track.id,
          name: track.name,
          description: track.description,
          overview: track.overview
        })),
        niceCategories: categories.map(cat => ({
          code: cat.code,
          name: cat.name
        })),
        sampleSkills: skills.slice(0, 50).map(skill => skill.description)
      };

      const prompt = `You are an expert cybersecurity career advisor with deep knowledge of the NICE Cybersecurity Workforce Framework 2.0.0. Analyze the user's profile and recommend the most suitable career tracks.

User Profile:
- Experience: ${profile.experience || 'Not specified'}
- Education: ${profile.education || 'Not specified'}
- Certifications: ${profile.certifications || 'Not specified'}
- Interests: ${profile.interests || 'Not specified'}
- Career Goals: ${profile.careerGoals || 'Not specified'}
- Current Level: ${profile.currentLevel || 'Not specified'}

Available Career Tracks:
${JSON.stringify(contextData.careerTracks, null, 2)}

NICE Framework Categories:
${JSON.stringify(contextData.niceCategories, null, 2)}

Provide a comprehensive career analysis in JSON format with:
1. Top 3-5 recommended career tracks with match scores (0-100)
2. Reasoning for each recommendation
3. Recommended starting level for each track
4. Next steps for career advancement
5. Overall assessment of the user's profile
6. Strength areas based on their background
7. Areas for development

Response format:
{
  "recommendations": [
    {
      "trackId": number,
      "trackName": "string",
      "matchScore": number,
      "reasoning": "string",
      "recommendedLevel": "string",
      "nextSteps": ["string"],
      "relevantSkills": ["string"]
    }
  ],
  "overallAssessment": "string",
  "strengthAreas": ["string"],
  "developmentAreas": ["string"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert cybersecurity career advisor. Provide detailed, actionable career guidance based on the NICE Framework and realistic industry progression paths."
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
      return analysis as CareerAnalysis;

    } catch (error) {
      console.error('AI Career Mapping Error:', error);
      throw new Error('Failed to analyze career profile: ' + error.message);
    }
  }

  async getDetailedTrackRecommendation(trackId: number, userProfile: UserProfile): Promise<any> {
    try {
      const track = await storage.getCareerTrackById(trackId);
      if (!track) {
        throw new Error('Career track not found');
      }

      const trackDetails = await storage.getCareerTrackWithPositions(trackId);
      const relatedWorkRoles = await storage.getWorkRolesByCategory(track.categories);

      const prompt = `Provide detailed career guidance for the "${track.name}" career track based on this user's profile.

User Profile:
- Experience: ${userProfile.experience || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Certifications: ${userProfile.certifications || 'Not specified'}
- Interests: ${userProfile.interests || 'Not specified'}
- Career Goals: ${userProfile.careerGoals || 'Not specified'}

Career Track Details:
${JSON.stringify(trackDetails, null, 2)}

Provide a detailed analysis including:
1. Specific position recommendations within this track
2. Gap analysis between user's current state and track requirements
3. Concrete action plan with timelines
4. Recommended certifications and training
5. Networking and experience opportunities
6. Salary progression expectations

Format as JSON with detailed actionable guidance.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a cybersecurity career strategist providing detailed, actionable career planning advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content || '{}');

    } catch (error) {
      console.error('Detailed Track Recommendation Error:', error);
      throw new Error('Failed to generate detailed recommendation: ' + error.message);
    }
  }
}

export const aiCareerMapper = new AICareerMapper();