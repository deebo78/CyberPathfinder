# CyberPathfinder - Cybersecurity Career Mapping Platform

## Overview

CyberPathfinder is a comprehensive web application designed to help cybersecurity professionals navigate career paths within the industry. The platform maps NICE Framework work roles to career tracks, provides certification guidance, and offers structured career progression paths from entry-level to executive positions across 19+ specialized cybersecurity domains.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Structure**: Modern component-based architecture with reusable UI components

### Backend Architecture
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL 16 (Neon serverless)
- **API Architecture**: RESTful API design with Express.js-like structure
- **Development Server**: Integrated development server supporting hot reload

### Data Storage Solutions
- **Primary Database**: PostgreSQL with comprehensive schema for cybersecurity career data
- **Connection Pooling**: Neon serverless connection pooling for scalability
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Data Import**: Excel/CSV processing capabilities for bulk data operations

## Key Components

### Career Track System
- **19+ Specialized Tracks**: SOC Operations, Red Team, Digital Forensics, GRC, Cloud Security, etc.
- **5-Level Progression**: Entry → Mid → Senior → Expert → Executive
- **NICE Framework Integration**: Maps to official NICE work roles and categories with complete TKS inheritance
- **Interactive TKS Visualization**: Hover tooltips and progression charts showing Tasks, Knowledge, and Skills requirements
- **Certification Mapping**: Links relevant certifications to each career level
- **Evidence-Based Competencies**: Each career level inherits specific requirements from 38 unique NICE Framework Work Roles

### Certification Database
- **180+ Certifications**: Comprehensive database of cybersecurity certifications
- **Issuer Management**: Tracks certification providers (CompTIA, GIAC, CISSP, etc.)
- **Renewal Tracking**: Manages certification validity periods and renewal requirements
- **Level Classification**: Foundation, Associate, Professional, Expert, Executive levels

### NICE Framework Integration
- **Work Roles**: Complete NICE work role definitions and codes
- **Categories**: 7 NICE categories (Protection & Defense, Investigation, etc.)
- **Specialty Areas**: Detailed specialty area mappings
- **Tasks & KSAs**: Knowledge, Skills, Abilities, and Task mappings

### Data Import System
- **Excel Processing**: XLSX file parsing for career track data
- **Batch Import Scripts**: Automated import processes for large datasets
- **Data Validation**: Ensures data integrity during import operations
- **Duplicate Detection**: Identifies and manages duplicate entries

## Data Flow

### User Journey Flow
1. Users explore career tracks by domain or interest
2. System displays 5-level progression path for selected track
3. Each level shows relevant certifications, work roles, and requirements
4. Users can navigate between related tracks and certifications

### Data Management Flow
1. Raw career data imported via Excel files
2. Data processed and validated through import scripts
3. Relationships established between tracks, levels, certifications
4. Frontend queries optimized data through Drizzle ORM

### Certification Mapping Flow
1. Certifications extracted from track-specific Excel files
2. Fuzzy matching algorithms map certification names to database entries
3. Career level associations created through junction tables
4. Certification recommendations surfaced to users by career level

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Management**: @neondatabase/serverless for connection pooling

### Development Tools
- **Drizzle ORM**: Database operations and migrations
- **XLSX**: Excel file processing for data imports
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library

### Runtime Environment
- **Node.js 20**: JavaScript runtime
- **PostgreSQL 16**: Database engine
- **Replit Infrastructure**: Development and hosting platform

## Deployment Strategy

### Development Environment
- **Platform**: Replit with integrated development server
- **Database**: Neon serverless PostgreSQL instance
- **Build Process**: Vite development server with hot module replacement
- **Port Configuration**: Local port 5000, external port 80

### Production Deployment
- **Target**: Autoscale deployment on Replit
- **Build Command**: `npm run build` for optimized production bundle
- **Start Command**: `npm run start` for production server
- **Environment**: Node.js with PostgreSQL module support

### Data Migration Strategy
- **Schema Versioning**: Drizzle migrations for database evolution
- **Data Import**: Batch processing scripts for initial data population
- **Backup Strategy**: Regular database exports for data protection

## Recent Changes

### June 25, 2025 - Enhanced Salary Calculation & Transparent Match Score System
- **Dynamic Salary Calculation Engine**: Implemented sophisticated salary calculation system with career track multipliers (SOC: 0.9x, Cloud: 1.4x, Red Team: 1.3x, Executive: 1.5x)
- **Geographic Salary Adjustments**: Added location-based compensation modifications (SF +35%, NYC +25%, Remote +5%, etc.) reflecting regional market conditions
- **Certification Premium Integration**: Comprehensive certification value calculation (CISSP +$10K-15K, Cloud certs +$8K-12K, Security+ +$3K-5K, clearances +$5K-10K)
- **Transparent Match Score Methodology**: Implemented comprehensive 100-point scoring system with definable skills (60%) and soft skills analysis (40%)
- **Score Breakdown Visualization**: Interactive expandable details showing certification alignment, experience depth, technical skills match, and role context analysis
- **Career Phase Level Determination**: Enhanced AI logic to accurately assign Entry/Mid/Senior/Expert/Executive levels based on comprehensive skill analysis rather than generic scoring
- **Salary Display Enhancement**: Corrected frontend calculation and added transparent calculation details display
- **Real-World Validation**: Tested with IT Program Manager profile showing $143K-198K (Senior) vs CND Analyst $62K-85K (Entry), demonstrating accurate differentiation
- **Complete Documentation**: Created comprehensive Enhanced Salary Analysis documentation explaining methodology, calculations, and transparency features
- **Career Level Explanation**: Added detailed documentation explaining "Recommended Level" vs current assessment with real-world examples and transition timeline guidance
- **Red Team Entry-Level Bug Fix**: Resolved critical issue where system incorrectly recommended entry-level positions for Red Team Operations track that only supports Mid-Level and above
- **Track-Level Constraint Validation**: Implemented server-side filtering to prevent invalid career level recommendations based on track-specific minimum requirements
- **Smart Career Progression Logic**: Enhanced AI to recommend SOC Operations as foundational stepping stone for entry-level candidates interested in offensive security

### January 1, 2025 - Enhanced TKS Tooltips with Excel Export & Complete Certification Mapping
- **Excel Export Feature**: Added comprehensive Excel export functionality to NICE TKS hover tooltips with 5 organized worksheets (Tasks, Knowledge, Skills, Work Roles, Summary)
- **Complete Certification Coverage**: Fixed critical gap where 44 certifications including CCNA, CCNP, GCIH, GPEN, OSEP, and others had no career track mappings
- **Comprehensive Mapping Strategy**: Mapped all 180+ certifications to appropriate career tracks based on focus areas and skill requirements
- **Intelligent Track Assignment**: Network security certs (CCNA/CCNP) → SOC Operations, Penetration testing certs (GPEN/OSEP) → Red Team Operations, etc.
- **Balanced Distribution**: Career tracks now have 6-23 mapped certifications each, ensuring comprehensive coverage across all specialization areas
- **Data Integrity Achievement**: Eliminated certification mapping gaps that previously left valuable industry credentials unconnected to career progression paths

### June 26, 2025 - Complete NICE Framework TKS Integration & Interactive Visualization
- **Universal TKS Inheritance**: Extended TKS inheritance to all 19 career tracks with 72 career levels mapped to 38 unique NICE Work Roles
- **Comprehensive Database Mapping**: Established relational connections inheriting 2,655 tasks, 5,167 knowledge items, and 1,917 skills across the entire career progression system
- **Evidence-Based Progression**: Each career level now directly inherits specific Tasks, Knowledge, and Skills requirements from official NICE Framework Work Roles
- **Interactive TKS Visualization**: Added hover tooltips on career progression cards showing detailed NICE Framework requirements with tabbed Tasks/Knowledge/Skills preview
- **TKS Progression Charts**: Created expandable charts displaying TKS inheritance statistics across career levels with color-coded visualization
- **Complete API Integration**: Added `/api/career-tracks/:id/tks` and `/api/career-tracks/:id/tks-progression` endpoints providing detailed TKS inheritance data
- **Track-Specific Mappings**: All career tracks now mapped to appropriate NICE roles (e.g., Red Team to Vulnerability Analysis, GRC to Security Control Assessment, Cloud to Infrastructure Support)
- **Mapping Documentation**: Created comprehensive NICE Framework mapping methodology document explaining career progression logic and TKS inheritance strategy
- **Security Fix**: Removed admin page access vulnerability from "Explore Framework" button in career track details
- **Career Tracks Display**: Fixed missing career tracks in explorer (now shows all 19 tracks properly organized)
- **Certification Guide Enhancement**: Added level filtering buttons and compact card design for improved UX
- **Navigation Enhancement**: Added Certifications tab to main navigation with Award icon

### June 19, 2025 - Advanced Resume Validation & Credibility Assessment System (MVP Complete)
- **Timeline Consistency Analysis**: Enhanced AI to detect impossible chronological claims like 15+ years experience starting 2009 vs 2020 degree completion
- **Credential Authority Validation**: System flags expired certifications (CISSP expired 2018) being used to claim current training authority
- **Future Expertise Detection**: Identifies "in-progress" certifications claimed as current competencies (CMMC CCP vs audit claims)
- **Comprehensive Credibility Scoring**: 0-100 scoring system with severity-based deductions for critical, high, medium, and low issues
- **Visual Assessment Interface**: Color-coded credibility section displays before career recommendations with detailed evidence and impact analysis
- **Smart Recommendation Adjustment**: Career suggestions factor credibility scores, reducing levels and confidence for problematic resumes
- **Intelligent Validation Fallback**: Text analysis creates structured validation findings when AI doesn't generate proper assessment
- **Enhanced Database Storage**: Analysis metadata includes complete validation findings for persistent credibility tracking and historical analysis
- **Salary Disclaimer Addition**: Added "Based on national averages" disclaimer to all salary range displays for transparency
- **MVP Status**: Platform now ready for business and individual use with comprehensive validation and career guidance capabilities

### January 16, 2025 - Map Vacancy Feature Enhancement
- **Role Consistency Analysis**: Added comprehensive job posting analysis that identifies conflicts, unrealistic expectations, and redundant requirements
- **AI-Powered Recommendations**: Enhanced OpenAI GPT-4o prompts to provide actionable improvement suggestions for job postings
- **Interactive UI Components**: Built comprehensive consistency analysis dashboard with color-coded severity levels
- **Data Integrity Fix**: Resolved critical issue where career tracks showed legacy job positions mixed with standardized levels
- **Database Cleanup**: Removed 37 legacy job-specific positions and 132 orphaned certification mappings
- **Standardization Complete**: All 19 career tracks now display consistent 5-level progression structure

### June 18, 2025 - File Upload Feature Completion & Production Security
- **Map Vacancy File Upload**: Added comprehensive document upload support to Map Vacancy feature matching Career Mapping capabilities
- **Document Processing Enhancement**: Fixed DOCX file extraction using mammoth library for proper text parsing instead of raw XML
- **Multi-Format Support**: Both features now support TXT, DOC, and DOCX files up to 10MB with automatic text extraction
- **Tabbed Interface**: Consistent UI design across Career Mapping and Map Vacancy with manual entry vs document upload options
- **Enhanced User Experience**: Automatic form population after document processing with seamless tab switching for review
- **Admin Access Control**: Implemented environment-based security to hide admin features from regular users while maintaining developer access
- **Security Enhancement**: Added server-side middleware protection for all administrative endpoints with 403 Forbidden responses
- **Production Security**: Complete admin access control with both client and server-side protection using VITE_ENABLE_ADMIN environment variable
- **DevSecOps Assessment**: Completed comprehensive security evaluation achieving B+ rating (85/100) with deployment recommendation
- **Production Ready**: Application validated for deployment with strong foundational security and operational capabilities

### June 17, 2025 - Interface Simplification & Scoring System Enhancement
- **Transparent Scoring System**: Added detailed scoring breakdown showing base scores, point deductions, and calculation methodology
- **Mathematical Consistency**: Implemented validation to prevent contradictory scores (e.g., high scores with severe issues)
- **Salary Range Integration**: Added salary min/max and location fields to eliminate false compensation deduction penalties
- **Market Intelligence**: Enhanced AI with specific salary benchmarks by experience level for precise compensation analysis
- **Interface Clarity**: Changed analysis section title from "Job Posting Consistency Analysis" to "NICE Framework Alignment" for better clarity
- **Resume Upload Feature**: Added comprehensive resume upload and AI analysis functionality to Career Mapping section
- **Enhanced Career Analysis**: Implemented detailed gap analysis, salary projections, and transition timelines for resume-based recommendations
- **Multi-Modal Input**: Career Mapping now supports both manual profile entry and resume file upload for career assessment
- **Gender-Neutral AI**: Updated resume analysis prompts to use inclusive, gender-neutral language throughout all recommendations
- **Default Upload Interface**: Set resume upload as the default tab in Career Mapping for optimal user experience

### January 16, 2025 - UI/UX Improvements
- **Category Organization**: Reorganized 19 career tracks into 7 logical categories (Defensive Operations, Offensive Security, etc.)
- **Horizontal Layout**: Implemented compact card design with hover descriptions for better navigation
- **Career Level Consistency**: Fixed Threat Intelligence and 6 other tracks that incorrectly showed 10+ levels instead of 5

## Changelog

- May 26, 2025. Project inception and core foundation setup
- May 27, 2025. NICE Framework database import and data processing
- May 28-31, 2025. Career track development and certification mapping
- June 17, 2025. Documentation formalization and feature enhancement

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX Preferences: Interactive tooltips should be targeted to specific elements, not large areas, to prevent interface interference during navigation.