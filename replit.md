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
- **NICE Framework Integration**: Maps to official NICE work roles and categories
- **Certification Mapping**: Links relevant certifications to each career level

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

### January 16, 2025 - Map Vacancy Feature Enhancement
- **Role Consistency Analysis**: Added comprehensive job posting analysis that identifies conflicts, unrealistic expectations, and redundant requirements
- **AI-Powered Recommendations**: Enhanced OpenAI GPT-4o prompts to provide actionable improvement suggestions for job postings
- **Interactive UI Components**: Built comprehensive consistency analysis dashboard with color-coded severity levels
- **Data Integrity Fix**: Resolved critical issue where career tracks showed legacy job positions mixed with standardized levels
- **Database Cleanup**: Removed 37 legacy job-specific positions and 132 orphaned certification mappings
- **Standardization Complete**: All 19 career tracks now display consistent 5-level progression structure

### June 17, 2025 - Interface Simplification & Scoring System Enhancement
- **File Upload Removed**: Temporarily removed file upload feature from Map Vacancy page to simplify user experience
- **Manual Input Focus**: Streamlined interface to use copy/paste workflow for job posting content
- **Token Limit Protection**: Prevented AI analysis failures from oversized content uploads
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

- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.