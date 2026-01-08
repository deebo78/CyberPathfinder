# CyberPathfinder - Cybersecurity Career Mapping Platform

## Overview
CyberPathfinder is a web application designed to guide cybersecurity professionals through their careers. It utilizes the NICE Framework v2.0, offering 41 standardized career tracks across 5 cybersecurity domains. The platform provides evidence-based competency requirements, dynamic salary calculations adjusted for geography and certifications, and advanced validation for resumes and job postings to ensure accurate career guidance. The vision is to empower cybersecurity professionals with clear, structured pathways for career progression and skill development.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Interactive tooltips should be targeted to specific elements, not large areas, to prevent interface interference during navigation.
Map Vacancy Analysis: NICE Framework encompasses broad IT roles that support cybersecurity - only flag "Non-Cyber/IT Role" for positions clearly outside both cybersecurity AND information technology domains (e.g., pure marketing, finance, HR roles with no tech component). Technical Support, Network Operations, System Administration, etc. are valid NICE work roles.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **UI/UX Decisions**: Compact card designs, horizontal layouts, color-coded severity levels, tabbed interfaces, and intuitive navigation.

### Backend Architecture
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL 16 (Neon serverless)
- **API Architecture**: RESTful API design

### Data Storage Solutions
- **Primary Database**: PostgreSQL storing cybersecurity career data, certifications, and NICE Framework information.
- **Connection Pooling**: Neon serverless connection pooling.
- **Schema Management**: Drizzle Kit for migrations.

### Key Features & Technical Implementations
- **Career Track System**: 41 NICE Framework v2.0 work roles as career tracks with 4 standardized progression levels (Entry, Mid, Senior, Expert/Lead) across 5 domains. Includes proficiency-leveled Tasks, Knowledge, and Skills (TKS) assignments.
- **Proficiency Level System**: TKS statements are assigned to specific proficiency levels within each work role for precise competency mapping.
- **Certification Database**: Manages 180+ certifications with issuer and renewal tracking.
- **NICE Framework Integration**: Full integration of NICE Framework v2.0 work roles, categories, specialty areas, tasks, and KSA mappings.
- **Data Import System**: Processes Excel/CSV files for bulk data operations, including automated NICE Framework v2.0 import.
- **Market-Tiered Salary Calculation Engine**: Differentiated calculation paths for executive vs. non-executive positions, incorporating geographic market tiers, career track multipliers, and certification premiums.
- **Transparent Match Score System**: A 100-point scoring system with detailed breakdowns for skills and soft skills analysis.
- **Map Vacancy Analysis System**: Analyzes job postings for consistency, identifies conflicts, and offers AI-powered improvement suggestions.
- **Resume Validation & Credibility Assessment**: Analyzes resumes for timeline consistency, credential authority, and future expertise claims, generating a credibility score.

### Security Architecture
- **User Authentication**: Cookie-based session management with bcrypt hashing, invite-only registration, and role-based access (admin, user).
- **Session Security**: Features idle and absolute timeouts, session invalidation on password change, and automatic cleanup of expired sessions.
- **Admin API Protection**: API key authentication for administrative endpoints.
- **Rate Limiting**: Tiered rate limiting for general, API, and admin endpoints.
- **File Uploads**: Validated file types, size limits, and path sanitization.
- **CORS**: Configured for development and production environments.
- **Security Headers**: Utilizes Helmet.js for various security headers.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **@neondatabase/serverless**: For connection pooling.

### Development Tools
- **Drizzle ORM**: Database operations and migrations.
- **XLSX**: Excel file processing.
- **Mammoth**: DOCX file extraction.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn/ui**: Pre-built UI component library.

### Runtime Environment
- **Node.js 20**: JavaScript runtime.
- **PostgreSQL 16**: Database engine.
- **Replit Infrastructure**: Development and hosting platform.
- **OpenAI GPT-4o**: Used for AI-powered analysis in features like Map Vacancy and Resume Validation.