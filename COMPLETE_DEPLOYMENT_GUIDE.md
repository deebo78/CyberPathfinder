# CyberPathfinder - Complete Deployment Guide

## Quick Start Setup (15 minutes)

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Code editor (VS Code recommended)

### Step 1: Project Initialization
```bash
# Create new project directory
mkdir cyberpathfinder
cd cyberpathfinder

# Initialize Node.js project
npm init -y

# Install all dependencies
npm install @hookform/resolvers @neondatabase/serverless @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip @tanstack/react-query class-variance-authority clsx cors date-fns drizzle-orm drizzle-zod express framer-motion lucide-react mammoth multer openai pdf-parse react react-dom react-hook-form recharts tailwind-merge tailwindcss-animate wouter ws xlsx zod

# Install development dependencies
npm install --save-dev @types/cors @types/express @types/multer @types/node @types/pdf-parse @types/react @types/react-dom @types/ws @vitejs/plugin-react autoprefixer drizzle-kit postcss tailwindcss tsx typescript vite
```

### Step 2: Environment Configuration
Create `.env` file:
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# AI Configuration
OPENAI_API_KEY="sk-your-openai-api-key"

# Application Configuration
NODE_ENV="development"
PORT=5000
VITE_API_URL="http://localhost:5000"

# Optional: Admin Access
VITE_ENABLE_ADMIN="true"
```

### Step 3: Project Structure Setup
```bash
# Create directory structure
mkdir -p client/src/{components,pages,lib,components/ui}
mkdir -p server/{routes}
mkdir -p shared
mkdir -p uploads

# Create essential configuration files
touch drizzle.config.ts vite.config.ts tailwind.config.ts tsconfig.json
touch server/index.ts server/db.ts server/routes.ts
touch shared/schema.ts
touch client/src/App.tsx client/index.html
```

### Step 4: Database Setup
```bash
# Copy the COMPLETE_DATABASE_SETUP.sql content to your database
# Run the SQL script in your PostgreSQL instance
psql $DATABASE_URL -f COMPLETE_DATABASE_SETUP.sql

# Push schema using Drizzle
npm run db:push
```

### Step 5: Copy Framework Code
Use the code from `COMPLETE_CODE_FRAMEWORK.md` and place each component in its respective file:

- Copy package.json configuration
- Copy all TypeScript configurations
- Copy database schema to `shared/schema.ts`
- Copy server files to `server/` directory
- Copy React components to `client/src/` directory

### Step 6: Build and Run
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## Data Import Process

### Core NICE Framework Data
The application requires comprehensive NICE Framework data:

#### 1. Categories (7 total)
- SP: Securely Provision
- OM: Operate and Maintain  
- OV: Oversight and Development
- PR: Protect and Defend
- AN: Analyze
- CO: Collect and Operate
- IN: Investigate

#### 2. Work Roles (38 total)
Key work roles mapped to career tracks:
- PR-CIR-001: Cyber Defense Analyst → SOC Operations
- CO-OPL-001: Exploitation Analyst → Red Team Operations
- IN-FOR-001: Digital Forensics Analyst → Digital Forensics
- AN-TWA-001: Threat/Warning Analyst → Threat Intelligence
- SP-RSK-001: Risk Analyst → GRC

#### 3. Tasks (942 total)
Sample critical tasks:
- T0023: Network traffic analysis for anomaly detection
- T0163: Cyber defense incident triage
- T0214: Cyber defense incident response
- T0290: Intrusion tactics, techniques, procedures analysis
- T0503: Network traffic monitoring for malicious activity

#### 4. Knowledge Items (631 total)
Essential knowledge areas:
- K0001: Computer networking concepts and protocols
- K0004: Cybersecurity and privacy principles
- K0005: Cyber threats and vulnerabilities
- K0013: Cyber defense and vulnerability assessment tools
- K0042: Incident response and handling methodologies

#### 5. Skills (538 total)
Critical cybersecurity skills:
- S0025: Host and network intrusion detection
- S0063: Electronic evidence collection and processing
- S0120: Network threat detection and analysis
- S0169: Vulnerability scanning and recognition
- S0199: Indicators of compromise recognition

### Career Track Data Structure

#### Track Categories
1. **Defensive Operations**
   - SOC Operations
   - Digital Forensics
   - Vulnerability Management

2. **Offensive Security**
   - Red Team Operations
   - Threat Intelligence

3. **Governance & Compliance**
   - GRC (Governance, Risk, Compliance)
   - Privacy Policy Legal Affairs

4. **Technical Architecture**
   - Cloud and Infrastructure Security
   - Cybersecurity Architecture & Engineering
   - Secure Software Development

5. **Identity & Access**
   - Identity and Access Management
   - OT (Operational Technology) Security

6. **Investigation & Response**
   - Cybercrime Investigation
   - Digital Forensics

7. **Leadership & Management**
   - Executive Leadership CISO Track
   - Program and Project Management
   - Cybersecurity Education & Training

#### Career Level Progression (5 levels each)
1. **Entry-Level**: 0-2 years, $45K-$65K
2. **Mid-Level**: 2-5 years, $65K-$90K
3. **Senior-Level**: 5-8 years, $90K-$120K
4. **Expert-Level**: 8-12 years, $120K-$160K
5. **Executive-Level**: 12+ years, $160K-$250K

### Certification Mapping

#### Foundation Level (Entry)
- CompTIA Security+
- Microsoft SC-900
- EC-Council CCT

#### Associate Level (Mid)
- CompTIA CySA+
- Cisco CCNA Security
- Microsoft SC-200
- ISC2 SSCP

#### Professional Level (Senior)
- GIAC GSEC
- GIAC GCIH
- Cisco CCNP Security
- CompTIA CASP+

#### Expert Level
- ISC2 CISSP
- ISC2 CCSP
- GIAC Advanced certifications
- Offensive Security OSEP/OSWE

#### Executive Level
- CISSP with management experience
- CISM
- MBA with Cybersecurity focus
- Executive leadership courses

## Advanced Configuration

### AI Integration Setup
```typescript
// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // optional
});

// Model Selection (newest as of May 2024)
const model = "gpt-4o"; // Latest OpenAI model

// Prompt Engineering Templates
const RESUME_ANALYSIS_PROMPT = `
Analyze this resume for cybersecurity career recommendations.
Focus on: timeline consistency, skill assessment, certification validation.
Provide detailed career pathway suggestions with match scores.
`;

const VACANCY_ANALYSIS_PROMPT = `
Evaluate this job posting for NICE Framework alignment.
Assess: role consistency, requirement realism, market competitiveness.
Provide improvement recommendations and scoring breakdown.
`;
```

### Database Optimization
```sql
-- Performance Indexes
CREATE INDEX CONCURRENTLY idx_career_levels_track_sort ON career_levels(career_track_id, sort_order);
CREATE INDEX CONCURRENTLY idx_tks_mappings_level ON career_level_tasks(career_level_id);
CREATE INDEX CONCURRENTLY idx_cert_mappings_level ON career_level_certifications(career_level_id);

-- Query Optimization Views
CREATE MATERIALIZED VIEW career_track_stats AS
SELECT 
    ct.id,
    ct.name,
    COUNT(DISTINCT cl.id) as levels,
    COUNT(DISTINCT clc.certification_id) as certifications,
    COUNT(DISTINCT clt.task_id) as tasks
FROM career_tracks ct
LEFT JOIN career_levels cl ON ct.id = cl.career_track_id
LEFT JOIN career_level_certifications clc ON cl.id = clc.career_level_id
LEFT JOIN career_level_tasks clt ON cl.id = clt.career_level_id
GROUP BY ct.id, ct.name;

-- Refresh command
REFRESH MATERIALIZED VIEW career_track_stats;
```

### Security Configuration
```typescript
// Environment-based Admin Access
const isAdminEnabled = process.env.VITE_ENABLE_ADMIN === 'true';

// File Upload Security
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// API Rate Limiting
import rateLimit from 'express-rate-limit';

const aiAnalysisLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 AI requests per windowMs
  message: 'Too many AI analysis requests'
});

app.use('/api/analyze-', aiAnalysisLimit);
```

## Production Deployment

### Replit Deployment
1. Create new Replit project
2. Upload complete codebase
3. Configure environment variables in Replit Secrets
4. Connect Neon database
5. Enable autoscale deployment

### Alternative Deployment Options

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

#### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: cyberpathfinder
services:
- name: web
  source_dir: /
  github:
    repo: your-username/cyberpathfinder
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
```

## Monitoring and Maintenance

### Performance Monitoring
```typescript
// Application Performance Monitoring
import { performance } from 'perf_hooks';

const performanceMiddleware = (req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
  });
  
  next();
};

app.use(performanceMiddleware);

// Database Query Performance
const queryWithTiming = async (query) => {
  const start = performance.now();
  const result = await db.execute(query);
  const duration = performance.now() - start;
  
  if (duration > 1000) {
    console.warn(`Slow query detected: ${duration.toFixed(2)}ms`);
  }
  
  return result;
};
```

### Health Checks
```typescript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.execute('SELECT 1');
    
    // Check OpenAI API
    const openaiStatus = process.env.OPENAI_API_KEY ? 'configured' : 'missing';
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      openai: openaiStatus,
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Data Backup Strategy
```bash
# Daily database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cyberpathfinder_backup_$DATE.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to cloud storage
aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/

# Keep last 30 days of backups
find . -name "cyberpathfinder_backup_*.sql.gz" -mtime +30 -delete
```

This complete deployment guide provides everything needed to build, deploy, and maintain CyberPathfinder in production environments.