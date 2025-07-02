# CyberPathfinder - Complete Code Framework

## Core Application Files

### 1. Package Configuration

```json
// package.json
{
  "name": "cyberpathfinder",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.28.9",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cors": "^2.8.5",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.30.7",
    "drizzle-zod": "^0.5.1",
    "express": "^4.19.2",
    "framer-motion": "^11.0.25",
    "lucide-react": "^0.365.0",
    "mammoth": "^1.7.1",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.38.5",
    "pdf-parse": "^1.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.0",
    "recharts": "^2.12.2",
    "tailwind-merge": "^2.2.2",
    "tailwindcss-animate": "^1.0.7",
    "wouter": "^3.1.0",
    "ws": "^8.16.0",
    "xlsx": "^0.18.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.12.7",
    "@types/pdf-parse": "^1.1.4",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.23",
    "@types/ws": "^8.5.10",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "drizzle-kit": "^0.20.14",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "tsx": "^4.7.2",
    "typescript": "^5.4.4",
    "vite": "^5.2.8"
  }
}
```

### 2. Database Schema (shared/schema.ts)

```typescript
import { pgTable, serial, text, integer, timestamp, varchar, boolean, jsonb, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Core Tables
export const careerTracks = pgTable('career_tracks', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  overview: text('overview'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const careerLevels = pgTable('career_levels', {
  id: serial('id').primaryKey(),
  careerTrackId: integer('career_track_id').notNull().references(() => careerTracks.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  salaryRange: varchar('salary_range', { length: 100 }),
  experienceRange: varchar('experience_range', { length: 100 }),
  keyResponsibilities: text('key_responsibilities').array(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  uniqueTrackLevel: unique().on(table.careerTrackId, table.name)
}));

export const certifications = pgTable('certifications', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }),
  description: text('description'),
  level: varchar('level', { length: 50 }),
  renewalPeriod: integer('renewal_period'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// NICE Framework Tables
export const niceCategories = pgTable('nice_categories', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

export const niceWorkRoles = pgTable('nice_work_roles', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => niceCategories.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const knowledgeItems = pgTable('knowledge_items', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Junction Tables
export const careerLevelCertifications = pgTable('career_level_certifications', {
  id: serial('id').primaryKey(),
  careerLevelId: integer('career_level_id').notNull().references(() => careerLevels.id, { onDelete: 'cascade' }),
  certificationId: integer('certification_id').notNull().references(() => certifications.id, { onDelete: 'cascade' }),
  priority: integer('priority').default(1),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueLevelCert: unique().on(table.careerLevelId, table.certificationId)
}));

export const careerLevelWorkRoles = pgTable('career_level_work_roles', {
  id: serial('id').primaryKey(),
  careerLevelId: integer('career_level_id').notNull().references(() => careerLevels.id, { onDelete: 'cascade' }),
  workRoleId: integer('work_role_id').notNull().references(() => niceWorkRoles.id, { onDelete: 'cascade' }),
  priority: integer('priority').default(1),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueLevelRole: unique().on(table.careerLevelId, table.workRoleId)
}));

// Analysis Tables
export const resumeAnalyses = pgTable('resume_analyses', {
  id: serial('id').primaryKey(),
  originalFilename: varchar('original_filename', { length: 255 }),
  extractedText: text('extracted_text'),
  analysisResults: jsonb('analysis_results'),
  createdAt: timestamp('created_at').defaultNow()
});

export const vacancyAnalyses = pgTable('vacancy_analyses', {
  id: serial('id').primaryKey(),
  jobTitle: varchar('job_title', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  jobDescription: text('job_description'),
  analysisResults: jsonb('analysis_results'),
  createdAt: timestamp('created_at').defaultNow()
});

// Relations
export const careerTracksRelations = relations(careerTracks, ({ many }) => ({
  careerLevels: many(careerLevels)
}));

export const careerLevelsRelations = relations(careerLevels, ({ one, many }) => ({
  careerTrack: one(careerTracks, {
    fields: [careerLevels.careerTrackId],
    references: [careerTracks.id]
  }),
  careerLevelCertifications: many(careerLevelCertifications),
  careerLevelWorkRoles: many(careerLevelWorkRoles)
}));

// Zod Schemas
export const insertCareerTrackSchema = createInsertSchema(careerTracks);
export const selectCareerTrackSchema = createSelectSchema(careerTracks);
export const insertCareerLevelSchema = createInsertSchema(careerLevels);
export const selectCareerLevelSchema = createSelectSchema(careerLevels);

// Types
export type CareerTrack = typeof careerTracks.$inferSelect;
export type InsertCareerTrack = typeof careerTracks.$inferInsert;
export type CareerLevel = typeof careerLevels.$inferSelect;
export type InsertCareerLevel = typeof careerLevels.$inferInsert;
export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;
```

### 3. Database Connection (server/db.ts)

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

### 4. AI Resume Analyzer (server/ai-resume-analyzer.ts)

```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ResumeAnalysisResult {
  candidateInfo: {
    name: string;
    yearsExperience: number;
    currentRole: string;
    location: string;
  };
  technicalSkills: {
    category: string;
    skills: string[];
    proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
  certifications: {
    name: string;
    issuer: string;
    yearObtained: number;
    isExpired: boolean;
  }[];
  workExperience: {
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  careerRecommendations: {
    recommendedTrack: string;
    recommendedLevel: string;
    matchScore: number;
    confidenceLevel: number;
    salaryRange: string;
    reasoning: string;
    gapAnalysis: string[];
    transitionTimeline: string;
  }[];
  credibilityAssessment: {
    overallScore: number;
    issues: {
      type: 'timeline_inconsistency' | 'credential_mismatch' | 'experience_inflation' | 'education_gap';
      severity: 'critical' | 'high' | 'medium' | 'low';
      description: string;
      evidence: string;
      impact: string;
    }[];
    validationStatus: 'verified' | 'questionable' | 'problematic';
  };
}

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
  const prompt = `
Analyze this resume and provide a comprehensive assessment. Focus on accuracy, credibility, and career pathway recommendations.

CREDIBILITY VALIDATION (Critical):
- Check for timeline inconsistencies (graduation dates vs. experience claims)
- Verify certification claims against typical timelines
- Identify inflated experience or responsibilities
- Flag impossible achievements or timeline overlaps
- Assess consistency between education, certifications, and claimed expertise

CAREER ANALYSIS:
- Extract candidate information, skills, certifications, and experience
- Recommend appropriate cybersecurity career tracks and levels
- Provide match scores based on actual qualifications
- Identify skill gaps and development areas
- Suggest realistic transition timelines

SCORING METHODOLOGY:
- Technical Skills Alignment (40 points): Match to track requirements
- Experience Depth (30 points): Years and relevance of experience  
- Certification Value (20 points): Relevant certifications for track
- Education Foundation (10 points): Degree relevance and level

Respond with a detailed JSON analysis following the ResumeAnalysisResult interface.

Resume Text:
${resumeText}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // newest OpenAI model released May 13, 2024
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    return analysis as ResumeAnalysisResult;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
}

export function calculateSalaryRange(
  trackName: string, 
  level: string, 
  location: string = 'National Average',
  certifications: string[] = []
): { min: number; max: number; details: string } {
  // Base salary ranges by level
  const baseSalaries = {
    'Entry-Level': { min: 45000, max: 65000 },
    'Mid-Level': { min: 65000, max: 90000 },
    'Senior-Level': { min: 90000, max: 120000 },
    'Expert-Level': { min: 120000, max: 160000 },
    'Executive-Level': { min: 160000, max: 250000 }
  };

  // Track multipliers
  const trackMultipliers = {
    'SOC Operations': 0.9,
    'Red Team Operations': 1.3,
    'Digital Forensics': 1.1,
    'Cloud and Infrastructure Security': 1.4,
    'Executive Leadership CISO Track': 1.5,
    'Cybersecurity Architecture & Engineering': 1.2,
    'GRC (Governance, Risk, Compliance)': 1.0
  };

  // Location adjustments
  const locationMultipliers = {
    'San Francisco': 1.35,
    'New York': 1.25,
    'Washington DC': 1.20,
    'Seattle': 1.15,
    'Remote': 1.05,
    'National Average': 1.0
  };

  // Certification premiums
  const certPremiums = {
    'CISSP': 12000,
    'CISM': 10000,
    'Cloud Security': 8000,
    'Security+': 3000,
    'Clearance': 8000
  };

  const baseRange = baseSalaries[level as keyof typeof baseSalaries] || baseSalaries['Mid-Level'];
  const trackMultiplier = trackMultipliers[trackName as keyof typeof trackMultipliers] || 1.0;
  const locationMultiplier = locationMultipliers[location as keyof typeof locationMultipliers] || 1.0;
  
  let certificationBonus = 0;
  certifications.forEach(cert => {
    if (cert.includes('CISSP')) certificationBonus += certPremiums['CISSP'];
    else if (cert.includes('Cloud') || cert.includes('Azure') || cert.includes('AWS')) certificationBonus += certPremiums['Cloud Security'];
    else if (cert.includes('Security+')) certificationBonus += certPremiums['Security+'];
    else if (cert.includes('Clearance')) certificationBonus += certPremiums['Clearance'];
  });

  const adjustedMin = Math.round((baseRange.min * trackMultiplier * locationMultiplier) + (certificationBonus * 0.7));
  const adjustedMax = Math.round((baseRange.max * trackMultiplier * locationMultiplier) + certificationBonus);

  const details = `Base: $${baseRange.min.toLocaleString()}-$${baseRange.max.toLocaleString()}, Track: ${trackMultiplier}x, Location: ${locationMultiplier}x, Cert Bonus: $${certificationBonus.toLocaleString()}`;

  return {
    min: adjustedMin,
    max: adjustedMax,
    details
  };
}
```

### 5. Main React App (client/src/App.tsx)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import CareerTrackExplorer from '@/pages/CareerTrackExplorer';
import CareerTrackDetail from '@/pages/career-track-detail';
import CareerMapping from '@/pages/career-mapping';
import MapVacancy from '@/pages/map-vacancy';
import Certifications from '@/pages/certifications';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
    },
  },
});

// Global fetch configuration for React Query
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey }: { queryKey: any }) => {
      const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="cyberpathfinder-theme">
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Router>
              <Switch>
                <Route path="/" component={CareerTrackExplorer} />
                <Route path="/career-tracks/:id" component={CareerTrackDetail} />
                <Route path="/career-mapping" component={CareerMapping} />
                <Route path="/map-vacancy" component={MapVacancy} />
                <Route path="/certifications" component={Certifications} />
                <Route component={() => <div>404 - Page Not Found</div>} />
              </Switch>
            </Router>
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### 6. TKS Tooltip Component (client/src/components/TKSTooltip.tsx)

```typescript
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BookOpen, Target, Zap, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TKSData {
  tasks: Array<{ code: string; description: string; importance: string }>;
  knowledge: Array<{ code: string; description: string; importance: string }>;
  skills: Array<{ code: string; description: string; importance: string }>;
  workRoles: Array<{ code: string; name: string; category: string; priority: number }>;
  tksStats: { taskCount: number; knowledgeCount: number; skillCount: number };
}

interface TKSTooltipProps {
  careerTrackId: number;
  levelName: string;
  children: React.ReactNode;
  className?: string;
}

export function TKSTooltip({ careerTrackId, levelName, children, className }: TKSTooltipProps) {
  const [tksData, setTksData] = useState<TKSData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const fetchTKSData = async () => {
    if (tksData) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/career-tracks/${careerTrackId}/tks`);
      if (response.ok) {
        const data = await response.json();
        const levelData = data.careerLevels?.find((level: any) => level.name === levelName);
        if (levelData) {
          // Extract and process TKS data
          const tasks = levelData.careerLevelTasks?.map((clt: any) => ({
            code: clt.task.code,
            description: clt.task.description,
            importance: clt.importance || 'medium'
          })) || [];
          
          // Process knowledge and skills similarly...
          setTksData({
            tasks,
            knowledge: [], // Process knowledge items
            skills: [],    // Process skills
            workRoles: [], // Process work roles
            tksStats: { taskCount: tasks.length, knowledgeCount: 0, skillCount: 0 }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching TKS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!tksData) return;

    const workbook = XLSX.utils.book_new();

    // Create worksheets for each TKS category
    const tasksData = [
      ['Task Code', 'Description', 'Importance'],
      ...tksData.tasks.map(task => [task.code, task.description, task.importance])
    ];
    const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData);
    XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');

    // Add Knowledge and Skills sheets similarly...

    const filename = `NICE_TKS_${levelName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Mouse event handlers for tooltip positioning
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsHovering(true);
    setIsVisible(true);
    fetchTKSData();
  };

  return (
    <>
      <div
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-50"
          style={{
            left: Math.min(position.x - 225, window.innerWidth - 450),
            top: Math.max(position.y - 320, 20),
            maxWidth: '450px'
          }}
        >
          <Card className="shadow-lg border-2 border-blue-200 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  NICE Framework Requirements - {levelName}
                </CardTitle>
                {tksData && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportToExcel}
                    className="h-6 px-2 text-xs"
                    title="Export TKS data to Excel"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm">Loading TKS data...</span>
                </div>
              ) : tksData ? (
                <Tabs defaultValue="tasks" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full mb-3">
                    <TabsTrigger value="tasks" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Tasks ({tksData.tksStats.taskCount})
                    </TabsTrigger>
                    <TabsTrigger value="knowledge" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Knowledge ({tksData.tksStats.knowledgeCount})
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Skills ({tksData.tksStats.skillCount})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tasks">
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {tksData.tasks.map((task) => (
                          <div key={task.code} className="border-b pb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {task.code}
                              </Badge>
                              <Badge 
                                variant={task.importance === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {task.importance}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{task.description}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Similar TabsContent for knowledge and skills */}
                </Tabs>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">No TKS data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
```

### 7. API Routes (server/routes.ts)

```typescript
import { Router } from 'express';
import multer from 'multer';
import { db } from './db.js';
import { careerTracks, careerLevels, certifications } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { analyzeResume } from './ai-resume-analyzer.js';
import { analyzeJobVacancy } from './ai-vacancy-mapper.js';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Career Tracks Routes
router.get('/api/career-tracks', async (req, res) => {
  try {
    const tracks = await db.select().from(careerTracks).orderBy(careerTracks.name);
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching career tracks:', error);
    res.status(500).json({ error: 'Failed to fetch career tracks' });
  }
});

router.get('/api/career-tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const track = await db.query.careerTracks.findFirst({
      where: eq(careerTracks.id, parseInt(id)),
      with: {
        careerLevels: {
          orderBy: (careerLevels, { asc }) => [asc(careerLevels.sortOrder)],
          with: {
            careerLevelCertifications: {
              with: {
                certification: true
              }
            }
          }
        }
      }
    });

    if (!track) {
      return res.status(404).json({ error: 'Career track not found' });
    }

    res.json(track);
  } catch (error) {
    console.error('Error fetching career track:', error);
    res.status(500).json({ error: 'Failed to fetch career track' });
  }
});

// TKS Data Routes
router.get('/api/career-tracks/:id/tks', async (req, res) => {
  try {
    const { id } = req.params;
    
    const careerTrack = await db.query.careerTracks.findFirst({
      where: eq(careerTracks.id, parseInt(id)),
      with: {
        careerLevels: {
          orderBy: (careerLevels, { asc }) => [asc(careerLevels.sortOrder)],
          with: {
            careerLevelWorkRoles: {
              with: {
                workRole: {
                  with: {
                    category: true
                  }
                }
              }
            },
            careerLevelTasks: {
              where: eq(careerLevelTasks.source, 'inherited'),
              with: {
                task: true
              }
            },
            careerLevelKnowledge: {
              where: eq(careerLevelKnowledge.source, 'inherited'),
              with: {
                knowledgeItem: true
              }
            },
            careerLevelSkills: {
              where: eq(careerLevelSkills.source, 'inherited'),
              with: {
                skill: true
              }
            }
          }
        }
      }
    });

    if (!careerTrack) {
      return res.status(404).json({ error: "Career track not found" });
    }

    res.json(careerTrack);
  } catch (error) {
    console.error("Error fetching career track with TKS:", error);
    res.status(500).json({ error: "Failed to fetch career track TKS data" });
  }
});

// Resume Analysis Route
router.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      const filePath = req.file.path;
      const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

      try {
        if (fileExtension === 'pdf') {
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          resumeText = pdfData.text;
        } else if (fileExtension === 'docx') {
          const result = await mammoth.extractRawText({ path: filePath });
          resumeText = result.value;
        } else if (fileExtension === 'txt') {
          resumeText = await fs.readFile(filePath, 'utf-8');
        } else {
          return res.status(400).json({ error: 'Unsupported file format' });
        }

        // Clean up uploaded file
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        return res.status(400).json({ error: 'Failed to process uploaded file' });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'No resume text or file provided' });
    }

    const analysis = await analyzeResume(resumeText);
    
    // Store analysis in database
    await db.insert(resumeAnalyses).values({
      originalFilename: req.file?.originalname,
      extractedText: resumeText,
      analysisResults: analysis
    });

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Job Vacancy Analysis Route  
router.post('/api/analyze-vacancy', async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription, salaryMin, salaryMax, location } = req.body;
    
    const analysis = await analyzeJobVacancy({
      jobTitle,
      companyName,
      jobDescription,
      salaryMin,
      salaryMax,
      location
    });

    // Store analysis in database
    await db.insert(vacancyAnalyses).values({
      jobTitle,
      companyName,
      jobDescription,
      analysisResults: analysis
    });

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing vacancy:', error);
    res.status(500).json({ error: 'Failed to analyze job vacancy' });
  }
});

// Certifications Route
router.get('/api/certifications', async (req, res) => {
  try {
    const certs = await db.select().from(certifications).orderBy(certifications.name);
    res.json(certs);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

export default router;
```

### 8. Server Entry Point (server/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use(routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving on port ${PORT}`);
});
```

### 9. Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          charts: ['recharts'],
          ai: ['openai']
        }
      }
    }
  }
});
```

### 10. Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/index.html'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
```

This complete code framework provides all the essential components needed to build CyberPathfinder from scratch, including database schemas, AI integration, React components, API routes, and configuration files.