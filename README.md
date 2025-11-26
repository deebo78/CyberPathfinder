# CyberPathfinder

**AI-Powered Cybersecurity Career Mapping Platform**

CyberPathfinder is a comprehensive web application designed to help cybersecurity professionals navigate their career paths. Built on the official NICE (National Initiative for Cybersecurity Education) Framework v2.0, it provides AI-powered career guidance, resume analysis, salary projections, and certification mapping.

![CyberPathfinder](https://img.shields.io/badge/NICE%20Framework-v2.0-blue)
![Career Tracks](https://img.shields.io/badge/Career%20Tracks-41-green)
![Certifications](https://img.shields.io/badge/Certifications-180%2B-orange)

---

## Table of Contents

- [Features](#features)
- [NICE Framework Integration](#nice-framework-integration)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Salary Calculation System](#salary-calculation-system)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 1. Career Tracks Explorer
Browse all 41 NICE Framework v2.0 work roles organized by 5 official categories:
- **Oversight and Governance (OG)** - 16 work roles
- **Design and Development (DD)** - 9 work roles
- **Implementation and Operation (IO)** - 7 work roles
- **Protection and Defense (PD)** - 7 work roles
- **Investigation (IN)** - 2 work roles

Each career track includes:
- Detailed role descriptions
- 4 progression levels (Entry-Level → Mid-Level → Senior-Level → Expert/Lead)
- Required competencies (Tasks, Knowledge, Skills)
- Mapped certifications
- Salary ranges by level and location

### 2. Certification Mapping
Explore 180+ cybersecurity certifications including:
- CISSP, CISM, CISA
- CompTIA Security+, CySA+, CASP+
- CEH, OSCP, GPEN
- AWS, Azure, GCP Security certifications
- And many more...

Features:
- Filter by level, issuer, or career track
- View certification details (renewal period, requirements)
- See which career tracks each certification supports

### 3. AI-Powered Resume Analysis
Upload your resume for comprehensive AI analysis:

**Resume Processing:**
- Supports TXT and DOCX formats
- PDF support temporarily unavailable (convert to TXT or DOCX)
- Extracts personal info, experience, education, certifications, and skills

**Career Recommendations:**
- 3-5 ranked career track recommendations
- Match scores (0-100) with detailed breakdowns
- Gap analysis (strengths vs. areas to develop)
- Personalized next steps and action items
- Transition timeline estimates

**Match Score System (100 points):**
- Definable Skills (60%): Certification alignment, experience depth, technical skills
- Soft Skills Analysis (40%): Role context, industry knowledge, career progression

### 4. Resume Validation & Credibility Assessment
AI-powered validation that checks:
- Timeline consistency
- Certification verification (expiry, future claims)
- Education-experience alignment
- Credential authority validation
- Overall credibility score with severity-coded issues

### 5. Advanced Salary Calculation Engine
Transparent salary projections based on:
- **Base salary by experience level** ($60K-$250K range)
- **Track-specific multipliers** (based on role demand)
- **Geographic adjustments:**
  - San Francisco/Silicon Valley: +35%
  - New York/Boston: +25%
  - Seattle/DC: +20%
  - Austin/Denver/Chicago: +10%
  - Remote: +5%
  - Small cities/rural: -15%
- **Certification premiums:**
  - CISSP/CISM: +$12K
  - AWS/Azure cloud certs: +$10K
  - OSCP/GCIH specialized: +$7K
  - Multiple certs (3+): +$8K bonus

**Executive positions** use a separate market-tiered calculation with city-size-based salary bands.

### 6. Map Vacancy (Job Posting) Analysis
Paste any job posting for AI analysis:
- Identify inconsistencies and conflicts
- Evaluate required experience vs. offered salary
- Check certification demands vs. compensation
- Generate improvement suggestions
- Relevance scoring for cybersecurity alignment

---

## NICE Framework Integration

CyberPathfinder is built on the **NICE Cybersecurity Workforce Framework v2.0**, the authoritative standard for cybersecurity career development.

### Framework Structure

| Component | Count | Description |
|-----------|-------|-------------|
| Categories | 5 | High-level groupings of cybersecurity work |
| Work Roles | 41 | Specific job roles within cybersecurity |
| TKS Statements | ~2,100 | Tasks, Knowledge, and Skills required |
| Proficiency Levels | 4 | Entry, Mid, Senior, Expert/Lead |

### The 5 Categories

1. **Oversight and Governance (OG)** - Leadership, policy, and strategic planning
2. **Design and Development (DD)** - Systems architecture and software development
3. **Implementation and Operation (IO)** - Deploying and maintaining systems
4. **Protection and Defense (PD)** - Defending against cyber threats
5. **Investigation (IN)** - Analyzing cyber incidents and threats

### TKS (Tasks, Knowledge, Skills)

Each work role has associated:
- **Tasks**: Specific activities performed in the role
- **Knowledge**: Information and understanding required
- **Skills**: Observable competencies needed

TKS statements are mapped to proficiency levels, enabling precise career progression guidance.

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library (Radix UI primitives)
- **TanStack Query** for data fetching
- **Wouter** for routing
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Node.js 20** runtime
- **Express.js** web framework
- **Drizzle ORM** for type-safe database operations
- **OpenAI GPT-4o** for AI-powered analysis
- **Multer** for file uploads
- **Mammoth** for DOCX parsing

### Database
- **PostgreSQL 16** (Neon serverless)
- Connection pooling for scalability
- JSONB columns for flexible data storage

### Development
- **Vite** for fast development and building
- **TypeScript** throughout
- **Drizzle Kit** for migrations

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (or Neon account)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cyberpathfinder.git
   cd cyberpathfinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5000`

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Connection (Required)
DATABASE_URL=postgresql://user:password@host:5432/database

# PostgreSQL Connection Details (if not using DATABASE_URL)
PGHOST=your-database-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name

# OpenAI API Key (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Admin Features (Optional)
VITE_ENABLE_ADMIN=true
```

---

## Database Setup

### Schema Overview

The database includes the following main tables:

| Table | Description |
|-------|-------------|
| `categories` | NICE Framework categories (5 records) |
| `work_roles` | NICE work roles (41 records) |
| `tasks` | Task statements |
| `knowledge` | Knowledge statements |
| `skills` | Skill statements |
| `work_role_tasks` | Work role ↔ Task mappings with proficiency levels |
| `work_role_knowledge` | Work role ↔ Knowledge mappings |
| `work_role_skills` | Work role ↔ Skill mappings |
| `career_tracks` | Career progression tracks (41 records) |
| `career_levels` | Experience levels within tracks |
| `certifications` | Certification database (180+ records) |
| `certification_issuers` | Certification issuing organizations |
| `resume_analyses` | Stored resume analysis results |

### Data Import

The NICE Framework data can be imported using the provided import script:

```bash
npx tsx scripts/import-nice-v2.ts
```

This imports:
- All 41 work roles with categories
- ~2,100 TKS statements
- Work role ↔ TKS mappings with proficiency levels
- Career tracks and levels

---

## Project Structure

```
cyberpathfinder/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Shadcn/ui components
│   │   │   └── dashboard/  # Dashboard-specific components
│   │   ├── pages/          # Page components
│   │   │   ├── landing.tsx
│   │   │   ├── career-tracks-explorer.tsx
│   │   │   ├── career-mapping.tsx
│   │   │   ├── certification-mapping.tsx
│   │   │   └── map-vacancy.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── App.tsx         # Main app component
│   └── index.html
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   ├── ai-resume-analyzer.ts  # OpenAI integration
│   ├── index.ts            # Server entry point
│   └── vite.ts             # Vite dev server integration
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle ORM schema definitions
├── scripts/                # Utility scripts
│   └── import-nice-v2.ts   # NICE Framework data import
└── package.json
```

---

## API Endpoints

### Career Tracks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/career-tracks` | Get all career tracks (defaults to NICE v2.0) |
| GET | `/api/career-tracks/:id` | Get career track by ID with levels |
| GET | `/api/career-tracks/:id/levels` | Get levels for a specific track |

**Query Parameters for `/api/career-tracks`:**
- `scope=all` - Returns all tracks (NICE + legacy)
- `scope=legacy-authentic` - Returns curated legacy tracks
- Default: Returns 41 NICE Framework v2.0 tracks

### Certifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/certifications` | Get all certifications |
| GET | `/api/certifications/:id` | Get certification by ID |
| GET | `/api/certification-issuers` | Get all certification issuers |

### NICE Framework

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/work-roles` | Get all work roles |
| GET | `/api/work-roles/:id` | Get work role with TKS |
| GET | `/api/categories` | Get all categories |
| GET | `/api/framework-stats` | Get framework statistics |

### Resume Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload-resume` | Upload and analyze resume |
| GET | `/api/resume-analyses` | Get all saved analyses |
| GET | `/api/resume-analyses/:id` | Get specific analysis |

### Job Posting Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze-job-posting` | Analyze a job posting |

---

## Salary Calculation System

### Non-Executive Positions

```
Final Salary = (Base Range × Track Multiplier × Geographic Adjustment) + Certification Premium
```

**Base Ranges by Level:**
| Level | Min | Max |
|-------|-----|-----|
| Entry-Level | $60K | $85K |
| Mid-Level | $85K | $130K |
| Senior-Level | $130K | $180K |
| Expert/Lead | $180K | $250K |

**Geographic Adjustments:**
| Location | Multiplier |
|----------|------------|
| San Francisco / Silicon Valley | 1.35 |
| New York / Boston | 1.25 |
| Seattle / DC Metro | 1.20 |
| Austin / Denver / Chicago | 1.10 |
| Remote | 1.05 |
| National Average | 1.00 |
| Small cities / Rural | 0.85 |

**Certification Premiums:**
| Certification | Premium |
|---------------|---------|
| CISSP / CISM | +$12,000 |
| AWS / Azure Cloud | +$10,000 |
| OSCP / GCIH Specialized | +$7,000 |
| Multiple Certs (3+) | +$8,000 |

### Executive Positions

Executive salaries use market-tiered bands with geographic caps:

| Tier | Cities | Range | Cap |
|------|--------|-------|-----|
| A | San Francisco, NYC, Boston | $330K - $500K | $520K |
| B | Seattle, DC, LA, Chicago, Austin | $260K - $380K | $400K |
| C | Charlotte, Nashville, Portland | $210K - $300K | $320K |
| D | Small cities / Rural | $170K - $240K | $260K |

**Executive Certification Premiums:**
| Certification | Premium |
|---------------|---------|
| CISSP / CISM | +$8,000 |
| CISA | +$6,000 |
| Cloud Specialty (AWS/Azure/GCP) | +$5,000 |
| Multiple Expert Certs | +$10,000 |

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the existing component patterns
- Write meaningful commit messages
- Test your changes thoroughly

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **NICE Framework** - National Initiative for Cybersecurity Education
- **CISA** - Cybersecurity and Infrastructure Security Agency
- **OpenAI** - For GPT-4o powering our AI features

---

## Support

For questions or support, please open an issue on GitHub.

---

**Built with passion for the cybersecurity community**
