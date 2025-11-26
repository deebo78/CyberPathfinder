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
- **Admin Access Control**: API key authentication (X-Admin-API-Key header) for admin endpoints, with environment-based UI toggle (VITE_ENABLE_ADMIN) for hiding admin features in frontend.

### Security Architecture
- **Authentication**: Admin endpoints require X-Admin-API-Key header with valid ADMIN_API_KEY
- **Rate Limiting**: Tiered rate limiting - 100 req/15min general, 50 req/15min API, 20 req/15min admin endpoints
- **Diagnostic Endpoints**: Protected by ALLOW_DIAGNOSTICS=true environment variable requirement
- **Error Handling**: Sanitized error responses prevent sensitive data leakage
- **File Uploads**: Validated file types (.xlsx, .csv, .doc, .docx), size limits (10MB), path sanitization
- **CORS**: Configured for Replit development URLs and production domains
- **Security Headers**: Helmet.js middleware with CSP, HSTS, and other security headers
- **Documentation**: See SECURITY.md for complete security architecture details

### Recent Changes

#### November 26, 2025
- **Comprehensive Security Audit & Remediation (Phase 2)**:
  - Added AI endpoint rate limiting: 10 req/15min for cost-sensitive endpoints (/api/analyze-profile, /api/analyze-vacancy, /api/upload-resume, /api/extract-document, /api/track-recommendation/:id, /api/work-role-match/:id)
  - Implemented file magic bytes validation (validateFileMagicBytes) to prevent extension spoofing
  - Added prompt injection protection with sanitizeAIInput helper (5000 char limit, control char stripping, injection pattern filtering)
  - Created sanitizeOrUndefined helper to preserve undefined for optional AI inputs (prevents empty strings in prompts)
  - Verified all database queries use Drizzle ORM parameterization (no SQL injection vectors)
  - Updated SECURITY.md with API key generation instructions and prompt injection documentation

- **Comprehensive Security Audit & Remediation (Phase 1)**:
  - Created server/security.ts with centralized security middleware and configuration
  - Replaced VITE_ENABLE_ADMIN flag-based auth with proper API key authentication (requireAdminApiKey middleware)
  - Protected all admin endpoints: /api/statistics, /api/search, /api/import/*, /api/export/*
  - Added restrictDiagnosticAccess middleware for test endpoints (/api/test, /api/test-openai, /api/test-database)
  - Re-enabled and configured tiered rate limiting with SECURITY_CONFIG
  - Fixed error handler that threw after sending response
  - Added safeParseId helper for input validation on route parameters
  - Enhanced file upload security with file type validation and path sanitization
  - Implemented sanitizeLogData function to prevent sensitive data in logs
  - Fixed CORS to accept dynamic Replit development URLs
  - Created SECURITY.md documentation and updated .env.example
  - E2E verified: Admin endpoints return 503 without key, public endpoints accessible, health check functional

#### November 14, 2025
- **Career Tracks Explorer NICE Framework v2.0 Category Integration**: Replaced hardcoded legacy category mappings with dynamic NICE Framework categories
  - Updated `/api/career-tracks` backend to JOIN with work_roles and categories tables, returning category metadata for each track
  - Removed hardcoded 19-track category mappings (trackCategoryMap) from frontend
  - Implemented dynamic category organization using NICE Framework v2.0's 5 official categories:
    - OG (Oversight and Governance) - 16 work roles - Purple, Briefcase icon
    - DD (Design and Development) - 9 work roles - Blue, Code icon
    - IO (Implementation and Operation) - 7 work roles - Green, Server icon
    - PD (Protection and Defense) - 7 work roles - Red, Shield icon
    - IN (Investigation) - 2 work roles - Orange, Eye icon
  - Created category-based icon and color mapping system for consistent visual grouping
  - E2E testing confirmed: All 41 NICE work roles display correctly organized by 5 categories (previously only 2 tracks showed due to name mismatch)
  - API defaults to NICE v2.0 tracks only, preventing NULL category issues

- **Full UI Migration to NICE Framework v2.0 Statistics**: All public-facing statistics now display NICE Framework v2.0 data exclusively
  - Created `/api/framework-stats` endpoint providing centralized statistics (41 career tracks, 4 experience levels, 41 work roles, 158+ certifications)
  - Updated homepage to show "41 Career Tracks" from NICE Framework v2.0
  - Modified Career Tracks Explorer to fetch dynamic counts from API (replacing hardcoded "19 Career Tracks")
  - Updated Certification Mapping page to display dynamic career tracks count
  - **Experience Levels Display**: Fixed to show exactly 4 levels (Entry-Level, Mid-Level, Senior-Level, Expert/Lead) - the NICE Framework v2.0 standard
  - Legacy level variations (Executive-Level, Expert-Level) excluded from public display
  - All statistics fully data-driven from database with proper fallbacks
  - E2E testing confirmed: Career Tracks Explorer shows 41 tracks, 4 levels, 41 work roles, 158 certifications

- **Metadata-Driven Refactoring Completed**: Removed all hardcoded track ID references from resume analyzer
  - Added TrackMetadata interface with salaryWeighting, allowsEntryLevel, requiresExecutiveExperience fields
  - Updated salary calculations to use track metadata instead of hardcoded multipliers (ID 4, 31, 42)
  - Built dynamic AI prompt constraints from track metadata, replacing hardcoded track restrictions
  - Fixed `/api/career-tracks` endpoint to default to NICE v2.0 (41 tracks) with scope parameter for backward compatibility
    - Default: Returns 41 NICE Framework v2.0 tracks
    - `scope=all`: Returns all 58 tracks (41 NICE + 17 legacy)
    - `scope=legacy-authentic`: Returns 20 curated legacy tracks
  - Validated end-to-end resume analysis: successfully returns NICE-only recommendations with correct salary ranges
  - Synced database schema with `npm run db:push` to ensure resume_analyses table availability

#### November 13, 2025
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