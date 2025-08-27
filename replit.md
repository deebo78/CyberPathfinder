# CyberPathfinder - Cybersecurity Career Mapping Platform

## Overview
CyberPathfinder is a comprehensive web application designed to help cybersecurity professionals navigate career paths. The platform maps NICE Framework work roles to career tracks, provides certification guidance, and offers structured career progression paths from entry-level to executive positions across 19+ specialized cybersecurity domains. It aims to provide evidence-based competency requirements, dynamic salary calculations with geographic and certification adjustments, and advanced resume/job posting validation for accurate career guidance.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX Preferences: Interactive tooltips should be targeted to specific elements, not large areas, to prevent interface interference during navigation.

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
- **Career Track System**: 19+ specialized tracks with 5-level progression (Entry → Mid → Senior → Expert → Executive), integrated with NICE Framework for TKS inheritance and certification mapping.
- **Certification Database**: 180+ certifications with issuer management, renewal tracking, and level classification.
- **NICE Framework Integration**: Complete work role, category, specialty area, task, and KSA mappings with interactive visualization.
- **Data Import System**: Excel/CSV processing capabilities (XLSX, DOC, DOCX) for bulk data operations with validation and duplicate detection.
- **Dynamic Salary Calculation Engine**: Incorporates career track multipliers, geographic adjustments, and certification premiums.
- **Transparent Match Score System**: 100-point scoring system with definable skills and soft skills analysis, providing detailed breakdowns.
- **Map Vacancy Analysis System**: Analyzes job postings for consistency, identifies conflicts, and provides AI-powered improvement suggestions. Includes critical issue detection and nuanced scoring for education and relevance.
- **Resume Validation & Credibility Assessment**: Analyzes resumes for timeline consistency, credential authority, and future expertise claims, providing a credibility score with visual assessment.
- **Admin Access Control**: Environment-based security (VITE_ENABLE_ADMIN) for hiding admin features and securing endpoints.

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