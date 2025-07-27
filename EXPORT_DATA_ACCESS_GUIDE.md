# Export Data Access Guide

## Overview

The CyberPathfinder platform includes comprehensive data export functionality that allows authorized users to download detailed information about career tracks, NICE Framework work role mappings, and certification relationships. This feature is restricted to administrative users to maintain data security and prevent unauthorized access to the complete dataset.

## Accessing Export Functionality

### For Administrators/Developers

The Export Data feature is available to users with administrative privileges through the following methods:

#### Method 1: Admin Navigation (Recommended)
1. Ensure you have administrative access (VITE_ENABLE_ADMIN environment variable set to 'true')
2. Navigate to any main user-facing page (Career Mapping, Map Vacancy, Career Tracks, or Certifications)
3. The "Export Data" tab will appear in the main navigation bar for admin users
4. Click the "Export Data" tab to access the export dashboard

#### Method 2: Direct URL Access
1. Navigate directly to: `https://your-domain.com/export`
2. Admin users will see the full export dashboard
3. Regular users will be redirected or see a restricted view

#### Method 3: API Direct Access
For programmatic access, use the following endpoints:
- `/api/export/career-track-work-roles` - Hierarchical career track structure
- `/api/export/detailed-track-work-role-mapping` - Flat structure with metadata
- `/api/export/certifications-with-mappings` - Certification mappings
- `/api/export/career-tracks` - Basic career track information

## Available Export Types

### 1. Career Track Work Role Composition
**Endpoint:** `/api/export/career-track-work-roles`
**File:** `career-track-work-roles.json`

**Description:** Complete hierarchical breakdown showing which NICE Framework work roles make up each stage of every career track.

**Structure:**
```json
{
  "trackId": 37,
  "trackName": "Cloud and Infrastructure Security",
  "trackDescription": "Career pathway focusing on cloud security...",
  "levels": [
    {
      "levelId": 35,
      "levelName": "Entry-Level",
      "experienceRange": null,
      "workRoles": [
        {
          "workRoleId": 117,
          "workRoleCode": "PD-WRL-004",
          "workRoleName": "Infrastructure Support",
          "workRoleDescription": "Responsible for testing, implementing...",
          "category": "PROTECTION and DEFENSE",
          "specialtyArea": "General",
          "priority": 1
        }
      ]
    }
  ]
}
```

### 2. Detailed Track-Work Role Mapping
**Endpoint:** `/api/export/detailed-track-work-role-mapping`
**File:** `detailed-track-work-role-mapping.json`

**Description:** Flat structure export with complete metadata including categories, specialty areas, and priorities for advanced analysis.

**Structure:**
```json
{
  "trackId": 37,
  "trackName": "Cloud and Infrastructure Security",
  "trackDescription": "Career pathway focusing on cloud security...",
  "levelId": 35,
  "levelName": "Entry-Level",
  "levelExperienceRange": null,
  "levelDescription": "Entry-Level positions in Cloud and Infrastructure Security",
  "levelSortOrder": 1,
  "workRoleId": 117,
  "workRoleCode": "PD-WRL-004",
  "workRoleName": "Infrastructure Support",
  "workRoleDescription": "Responsible for testing, implementing...",
  "categoryName": "PROTECTION and DEFENSE",
  "specialtyAreaName": "General",
  "priority": 1
}
```

### 3. Certifications with Career Mappings
**Endpoint:** `/api/export/certifications-with-mappings`
**File:** `certifications-with-mappings.json`

**Description:** All certifications with their mappings to career tracks and levels.

### 4. Career Tracks
**Endpoint:** `/api/export/career-tracks`
**File:** `career-tracks.json`

**Description:** Complete list of all 19 cybersecurity specialization tracks.

## Security Considerations

- Export functionality is restricted to administrative users only
- Regular users do not see the Export Data navigation option
- Direct API access requires appropriate authentication
- Exported data contains sensitive organizational intelligence about career progressions
- Files should be handled according to your organization's data protection policies

## Usage Instructions

1. **Access the Export Dashboard:** Navigate to `/export` or use the "Export Data" tab (admin users only)
2. **Select Export Type:** Choose from the four available export options based on your analysis needs
3. **Download Data:** Click the "Download JSON" button for your selected export type
4. **File Processing:** The system will generate and download the JSON file automatically
5. **Data Analysis:** Use the downloaded JSON files with your preferred analysis tools

## Technical Notes

- All exports are generated in real-time from the current database state
- File sizes vary based on the amount of career track and work role mapping data
- JSON format ensures compatibility with most data analysis tools
- Hierarchical exports are optimized for visualization tools
- Flat exports are optimized for database imports and statistical analysis

## Support

For technical issues or questions about the export functionality:
1. Check that you have proper administrative access
2. Verify the VITE_ENABLE_ADMIN environment variable is correctly set
3. Ensure you're accessing the platform with appropriate permissions
4. Contact your system administrator for access-related issues

## Data Usage Guidelines

The exported data represents comprehensive mapping between cybersecurity career tracks and NICE Framework work roles. This information should be used responsibly for:
- Career development planning
- Workforce analysis
- Training program development
- Strategic cybersecurity talent management
- Academic research (with appropriate permissions)

**Last Updated:** January 28, 2025
**Version:** 1.0