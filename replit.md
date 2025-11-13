# CyberPathfinder - Cybersecurity Career Mapping Platform

## Overview
CyberPathfinder is a comprehensive web application designed to help cybersecurity professionals navigate career paths. The platform leverages the NICE Framework v2.0 with 41 official work roles as career tracks, providing certification guidance and structured career progression paths with 4 standardized levels (Entry-Level, Mid-Level, Senior-Level, Expert/Lead) across 5 cybersecurity domains (Oversight & Governance, Design & Development, Implementation & Operation, Protection & Defense, Investigation). The platform provides evidence-based competency requirements with leveled proficiency assignments, dynamic salary calculations with geographic and certification adjustments, and advanced resume/job posting validation for accurate career guidance.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Interactive tooltips should be targeted to specific elements, not large areas, to prevent interface interference during navigation.
Map Vacancy Analysis: NICE Framework encompasses broad IT roles that support cybersecurity - only flag "Non-Cyber/IT Role" for positions clearly outside both cybersecurity AND information technology domains (e.g., pure marketing, finance, HR roles with no tech component). Technical Support, Network Operations, System Administration, etc. are valid NICE work roles.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite
- **Component Structure**: Modern component-based architecture with reusable UI components
- **UI/UX Decisions**: Compact card designs, horizontal layouts, color-coded severity levels for analysis, tabbed interfaces, and intuitive navigation.

### Backend Architecture
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL 16 (Neon serverless)
- **API Architecture**: RESTful API design with Express.js-like structure
- **Development Server**: Integrated development server supporting hot reload

### Data Storage Solutions
- **Primary Database**: PostgreSQL with comprehensive schema for cybersecurity career data (career tracks, certifications, NICE Framework data).
- **Connection Pooling**: Neon serverless connection pooling for scalability.
- **Schema Management**: Drizzle Kit for migrations and schema evolution.

### Key Features & Technical Implementations
- **Career Track System**: 41 NICE Framework v2.0 work roles as career tracks with standardized 4-level progression (Entry-Level → Mid-Level → Senior-Level → Expert/Lead), organized across 5 domains (OG, DD, IO, PD, IN). Each track includes proficiency-leveled TKS (Tasks, Knowledge, Skills) assignments indicating competency requirements at each career stage.
- **Proficiency Level System**: TKS statements are assigned to specific proficiency levels (Entry-Level, Mid-Level, Senior-Level, Expert/Lead) within each work role, enabling precise competency mapping for career progression. Some TKS apply across all levels, expanding to all four levels during import.
- **Certification Database**: 180+ certifications with issuer management, renewal tracking, and level classification.
- **NICE Framework Integration**: Complete NICE Framework v2.0 work role, category, specialty area, task, and KSA mappings with interactive visualization. Database schema includes proficiency_level columns in work_role_tasks, work_role_knowledge, and work_role_skills join tables.
- **Data Import System**: Excel/CSV processing capabilities (XLSX, DOC, DOCX) for bulk data operations with validation and duplicate detection. Includes automated NICE Framework v2.0 import script (import-nice-v2.ts) for processing official NICE data.
- **Market-Tiered Salary Calculation Engine**: Features separate calculation paths for executive vs non-executive positions. Executive salaries use geographic market tiers (Tier A: SF/NYC $330K-500K, Tier B: Large metros $260K-380K, Tier C: Mid-markets $210K-300K, Tier D: Small cities $170K-240K) preventing unrealistic salary ranges in smaller markets. Non-executive positions use career track multipliers, geographic adjustments, and certification premiums.
- **Transparent Match Score System**: 100-point scoring system with definable skills and soft skills analysis, providing detailed breakdowns.
- **Map Vacancy Analysis System**: Analyzes job postings for consistency, identifies conflicts, and provides AI-powered improvement suggestions. Includes critical issue detection and nuanced scoring for education and relevance.
- **Resume Validation & Credibility Assessment**: Analyzes resumes for timeline consistency, credential authority, and future expertise claims, providing a credibility score with visual assessment.
- **Admin Access Control**: Environment-based security (VITE_ENABLE_ADMIN) for hiding admin features and securing endpoints.

### Recent Changes (November 13, 2025)
- **NICE Framework v2.0 Migration Completed**: Successfully migrated from 19 custom career tracks to 41 official NICE Framework v2.0 work roles
  - Imported 2,111 TKS statements (942 tasks, 631 knowledge items, 538 skills)
  - Created 5,459 work role → TKS mappings with proficiency levels
  - Generated 41 career tracks (one per work role) with 4 standardized levels each
  - Established 16,977 career level → TKS mappings for competency requirements
  - Added proficiency_level columns to work_role_tasks, work_role_knowledge, work_role_skills tables
  - Legacy 19-track data preserved during migration for backward compatibility

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Connection Management**: @neondatabase/serverless for connection pooling.

### Development Tools
- **Drizzle ORM**: Database operations and migrations.
- **XLSX**: Excel file processing for data imports.
- **Mammoth**: DOCX file extraction.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn/ui**: Pre-built component library.

### Runtime Environment
- **Node.js 20**: JavaScript runtime.
- **PostgreSQL 16**: Database engine.
- **Replit Infrastructure**: Development and hosting platform.
- **OpenAI GPT-4o**: Used for AI-powered analysis and recommendations in features like Map Vacancy and Resume Validation.