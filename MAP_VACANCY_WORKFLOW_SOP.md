# Map Vacancy Feature - Standard Operating Procedure (SOP)

## Overview
The Map Vacancy feature is a core component of the CyberPathfinder platform that analyzes job postings and maps them to NICE Framework work roles. This AI-powered system helps organizations identify qualified candidates by matching job requirements to standardized cybersecurity roles and career tracks.

## Purpose
- **Primary Goal**: Bridge the gap between job postings and NICE Framework work roles
- **Secondary Goal**: Provide actionable insights for talent acquisition and workforce planning
- **Outcome**: Enable precise candidate matching based on standardized cybersecurity competencies

## Technical Architecture

### Frontend Components
- **Location**: `client/src/pages/map-vacancy.tsx`
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/UI components with Tailwind CSS
- **State Management**: React useState hooks with TanStack Query for API calls

### Backend Components
- **API Endpoint**: `/api/analyze-vacancy` (POST)
- **Route Handler**: `server/routes.ts`
- **AI Processing**: `server/ai-vacancy-mapper.ts`
- **AI Model**: OpenAI GPT-4o with structured JSON responses

### Database Integration
- **Work Roles**: Fetched from `work_roles` table
- **Career Tracks**: Retrieved from `career_tracks` table
- **Storage Interface**: Uses existing storage abstraction layer

## Detailed Workflow

### Phase 1: Data Input and Collection

#### Step 1.1: Job Posting Input Methods
**Manual Entry** (Current Implementation):
- Job Title (required field)
- Job Description (required field) 
- Required Qualifications (optional)
- Preferred Qualifications (optional)

**File Upload** (Planned Feature):
- Support for common formats (.txt, .pdf, .docx)
- Automatic content parsing and extraction
- Status: Currently shows TODO placeholder

#### Step 1.2: Input Validation
```typescript
const vacancySchema = z.object({
  jobTitle: z.string(),
  jobDescription: z.string(),
  requiredQualifications: z.string().optional(),
  preferredQualifications: z.string().optional()
});
```
- Frontend validation ensures required fields are populated
- Backend validation using Zod schema for type safety
- Error handling with user-friendly toast notifications

### Phase 2: AI Analysis and Processing

#### Step 2.1: Data Preparation
1. **Framework Data Retrieval**:
   - Fetch all work roles from database
   - Retrieve career track information
   - Create structured summaries for AI processing

2. **Context Building**:
   - Work roles summary includes: ID, name, code, description, category, specialty area
   - Career tracks summary includes: ID, name, description, overview
   - Maintain referential integrity with database

#### Step 2.2: AI Processing Pipeline
**Model Configuration**:
- Model: GPT-4o (latest OpenAI model as of May 2024)
- Temperature: 0.3 (for consistent, focused analysis)
- Response Format: Structured JSON object
- Role: Expert cybersecurity workforce analyst

**Analysis Components**:
1. **Primary Work Role Matching**
2. **Secondary Role Identification**
3. **Career Track Alignment**
4. **Requirement Extraction**
5. **Match Summary Generation**

#### Step 2.3: Structured Output Generation
```typescript
interface VacancyAnalysis {
  primaryMatches: WorkRoleMatch[];
  otherNotableRoles: WorkRoleMatch[];
  bestTrackMatch: TrackMatch | null;
  extractedRequirements: ExtractedRequirements;
  matchSummary: string;
}
```

### Phase 3: Results Processing and Validation

#### Step 3.1: Response Validation
- Parse JSON response from AI model
- Validate structure against expected interface
- Apply fallback values for missing fields
- Error handling for malformed responses

#### Step 3.2: Data Enrichment
- Cross-reference work role IDs with database
- Validate career track alignments
- Calculate confidence scores and match percentages
- Generate actionable recommendations

### Phase 4: Results Presentation

#### Step 4.1: Primary Matches Display
- **Match Percentage**: Visual progress indicator
- **Work Role Details**: Name, code, specialty area
- **Match Reasoning**: AI-generated explanation
- **Category Classification**: NICE Framework categorization

#### Step 4.2: Career Track Alignment
- **Best Track Match**: Highest confidence career pathway
- **Career Progression**: 5-level progression structure
- **Level Alignment**: Job posting level vs track expectations
- **Recommendations**: Actionable insights for hiring decisions

#### Step 4.3: Extracted Requirements
- **Skills**: Technical and soft skills identified
- **Experience**: Years and type of experience required
- **Education**: Educational background requirements
- **Certifications**: Professional certifications mentioned
- **Experience Level**: Entry/Mid/Senior/Expert/Executive classification

## API Workflow Sequence

### Request Flow
1. **Frontend Submission**:
   ```
   POST /api/analyze-vacancy
   Content-Type: application/json
   {
     "jobTitle": "string",
     "jobDescription": "string", 
     "requiredQualifications": "string?",
     "preferredQualifications": "string?"
   }
   ```

2. **Backend Processing**:
   - Validate request payload
   - Fetch NICE Framework data from database
   - Prepare AI analysis prompt
   - Call OpenAI API with structured prompt
   - Process and validate AI response
   - Return structured analysis

3. **Frontend Response Handling**:
   - Display loading state during processing
   - Handle success/error states with toast notifications
   - Render comprehensive analysis results
   - Enable further interactions (candidate matching, detailed views)

## Error Handling and Resilience

### Frontend Error Management
- **Input Validation**: Real-time field validation with user feedback
- **Network Errors**: Retry mechanisms with exponential backoff
- **User Feedback**: Toast notifications for all error states
- **Loading States**: Progress indicators during API calls

### Backend Error Management
- **Database Connection**: Graceful handling of database unavailability
- **AI API Failures**: Fallback mechanisms and retry logic
- **Data Validation**: Comprehensive input sanitization
- **Logging**: Detailed error logging for debugging

### Common Error Scenarios
1. **Missing Required Fields**: Frontend validation prevents submission
2. **AI API Timeout**: Backend retry with exponential backoff
3. **Invalid Work Role References**: Database validation and fallback
4. **Malformed AI Response**: Response parsing with error recovery

## Performance Considerations

### Optimization Strategies
- **Database Queries**: Efficient fetching of work roles and tracks
- **AI API Calls**: Batch processing for multiple analyses
- **Caching**: Frontend query caching with TanStack Query
- **Response Time**: Target under 10 seconds for analysis completion

### Scalability Factors
- **Concurrent Requests**: Rate limiting and queue management
- **Database Load**: Connection pooling and query optimization
- **AI API Limits**: Usage monitoring and quota management

## Security and Compliance

### Data Protection
- **Input Sanitization**: Prevent injection attacks
- **API Key Security**: Secure environment variable management
- **User Data**: No persistent storage of job posting content
- **Audit Trail**: Request logging for compliance

### Privacy Considerations
- **Data Retention**: Temporary processing only, no long-term storage
- **Anonymization**: No personal information in job posting analysis
- **Access Control**: Authenticated access to mapping features

## Future Enhancements

### Planned Features
1. **File Upload Support**: PDF, Word, and text file processing
2. **Candidate Matching**: Direct integration with candidate database
3. **Batch Processing**: Multiple job posting analysis
4. **Custom Work Roles**: Organization-specific role definitions
5. **Analytics Dashboard**: Mapping trends and insights

### Integration Opportunities
- **ATS Systems**: Direct integration with Applicant Tracking Systems
- **HR Platforms**: Seamless workflow with existing HR tools
- **Certification Tracking**: Real-time certification validation
- **Skills Assessment**: Integration with technical assessment platforms

## Maintenance and Monitoring

### Regular Maintenance Tasks
- **AI Model Updates**: Monitor for new OpenAI model releases
- **Framework Updates**: Sync with NICE Framework revisions
- **Performance Monitoring**: Track API response times and accuracy
- **Error Rate Analysis**: Monitor and address common failure patterns

### Key Performance Indicators (KPIs)
- **Analysis Accuracy**: User satisfaction with work role matches
- **Response Time**: Average time from submission to results
- **Success Rate**: Percentage of successful analyses
- **User Adoption**: Feature usage statistics and trends

## Troubleshooting Guide

### Common Issues and Solutions
1. **Analysis Taking Too Long**:
   - Check OpenAI API status
   - Verify database connectivity
   - Review job posting complexity

2. **Poor Match Quality**:
   - Enhance job posting detail
   - Review work role database completeness
   - Adjust AI prompt parameters

3. **System Errors**:
   - Check environment variables
   - Verify database schema integrity
   - Monitor application logs

### Support Escalation
- **Level 1**: Frontend validation and user guidance
- **Level 2**: Backend API troubleshooting
- **Level 3**: AI model and database analysis
- **Level 4**: Infrastructure and security review

## Documentation and Training

### User Documentation
- **User Guide**: Step-by-step mapping instructions
- **Best Practices**: Optimal job posting formats for analysis
- **FAQ**: Common questions and troubleshooting

### Technical Documentation
- **API Documentation**: Endpoint specifications and examples
- **Database Schema**: Work role and track relationship documentation
- **Deployment Guide**: Environment setup and configuration

This SOP provides comprehensive guidance for understanding, operating, and maintaining the Map Vacancy feature to ensure consistent, reliable performance in production environments.