# Database Update Script for NICE Framework v2.0
# This script will update your CyberPathfinder database with the new NICE Framework data

## Overview
The new NICE Framework v2.0 includes:
- 41 Work Roles organized into 5 categories
- 2,111 TKS (Tasks, Knowledge, Skills) statements with assigned levels
- Four competency levels: Entry-Level, Mid-Level, Senior-Level, Expert/Lead

## Step 1: Create Migration Scripts

### 1.1 Update Work Roles Table

```sql
-- Backup existing data first
CREATE TABLE work_roles_backup AS SELECT * FROM work_roles;

-- Clear existing work roles
TRUNCATE TABLE work_roles CASCADE;

-- Insert new NICE v2.0 work roles
INSERT INTO work_roles (role_code, title, description, work_role_category, specialty_area) VALUES
-- OVERSIGHT and GOVERNANCE (OG)
('OG-WRL-001', 'Communications Security (COMSEC) Management', 'Responsible for managing the Communications Security (COMSEC) resources of an organization.', 'Oversight and Governance', 'Cybersecurity Management'),
('OG-WRL-002', 'Cybersecurity Policy and Planning', 'Responsible for developing and maintaining cybersecurity plans, strategy, and policy to support and align with organizational cybersecurity initiatives and regulatory compliance.', 'Oversight and Governance', 'Cybersecurity Management'),
('OG-WRL-003', 'Cybersecurity Workforce Management', 'Responsible for developing cybersecurity workforce plans, assessments, strategies, and guidance, including cybersecurity-related staff training, education, and hiring processes.', 'Oversight and Governance', 'Cybersecurity Management'),
('OG-WRL-004', 'Cybersecurity Curriculum Development', 'Responsible for developing, planning, coordinating, and evaluating cybersecurity awareness, training, or education content, methods, and techniques based on instructional needs and requirements.', 'Oversight and Governance', 'Training and Education'),
('OG-WRL-005', 'Cybersecurity Instruction', 'Responsible for developing and conducting cybersecurity awareness, training, or education.', 'Oversight and Governance', 'Training and Education'),
('OG-WRL-006', 'Cybersecurity Legal Advice', 'Responsible for providing cybersecurity legal advice and recommendations, including monitoring related legislation and regulations.', 'Oversight and Governance', 'Legal and Compliance'),
('OG-WRL-007', 'Executive Cybersecurity Leadership', 'Responsible for establishing vision and direction for an organization''s cybersecurity operations and resources and their impact on digital and physical spaces.', 'Oversight and Governance', 'Executive Leadership'),
('OG-WRL-008', 'Privacy Compliance', 'Responsible for developing and overseeing an organization''s privacy compliance program and staff, including establishing and managing privacy-related governance, policy, and incident response needs.', 'Oversight and Governance', 'Legal and Compliance'),
('OG-WRL-009', 'Product Support Management', 'Responsible for planning, estimating costs, budgeting, developing, implementing, and managing product support strategies.', 'Oversight and Governance', 'Program Management'),
('OG-WRL-010', 'Program Management', 'Responsible for leading, coordinating, and the overall success of a defined program.', 'Oversight and Governance', 'Program Management'),
('OG-WRL-011', 'Secure Project Management', 'Responsible for managing cybersecurity projects or integrating cybersecurity considerations into projects.', 'Oversight and Governance', 'Program Management'),
('OG-WRL-012', 'Security Control Assessment', 'Responsible for conducting assessments of cybersecurity and privacy controls to determine the extent to which controls are implemented correctly.', 'Oversight and Governance', 'Risk Management'),
('OG-WRL-013', 'Systems Authorization', 'Responsible for providing formal authorization and approval to operate a system at an acceptable level of risk.', 'Oversight and Governance', 'Risk Management'),
('OG-WRL-014', 'Systems Security Management', 'Responsible for the management and administration of security measures applied to an information system.', 'Oversight and Governance', 'Cybersecurity Management'),
('OG-WRL-015', 'Technology Portfolio Management', 'Responsible for managing a portfolio of IT investments that align with organizational missions and business functions.', 'Oversight and Governance', 'Technology Management'),
('OG-WRL-016', 'Technology Program Auditing', 'Responsible for conducting evaluations of an IT program or its individual components.', 'Oversight and Governance', 'Risk Management'),

-- DESIGN and DEVELOPMENT (DD)
('DD-WRL-001', 'Cybersecurity Architecture', 'Responsible for designing and developing a framework for cybersecurity capabilities that align with business requirements.', 'Design and Development', 'Systems Architecture'),
('DD-WRL-002', 'Enterprise Architecture', 'Responsible for designing and developing business, information, and technology architecture models.', 'Design and Development', 'Systems Architecture'),
('DD-WRL-003', 'Secure Software Development', 'Responsible for developing and writing secure code for software applications.', 'Design and Development', 'Software Development'),
('DD-WRL-004', 'Secure Systems Development', 'Responsible for designing and developing systems with integrated cybersecurity capabilities.', 'Design and Development', 'Systems Development'),
('DD-WRL-005', 'Software Security Assessment', 'Responsible for analyzing software applications and services to identify vulnerabilities and security risks.', 'Design and Development', 'Software Development'),
('DD-WRL-006', 'Systems Requirements Planning', 'Responsible for consult with customers to evaluate functional requirements.', 'Design and Development', 'Systems Engineering'),
('DD-WRL-007', 'Systems Testing and Evaluation', 'Responsible for planning, executing, and managing testing of systems to evaluate results against specifications.', 'Design and Development', 'Test and Evaluation'),
('DD-WRL-008', 'Technology Research and Development', 'Responsible for conducting technology assessment and integration processes.', 'Design and Development', 'Research and Development'),
('DD-WRL-009', 'Operational Technology (OT) Cybersecurity Engineering', 'Responsible for protecting OT systems through engineering and cybersecurity practices.', 'Design and Development', 'Systems Engineering'),

-- IMPLEMENTATION and OPERATION (IO)
('IO-WRL-001', 'Data Analysis', 'Responsible for examining data with the purpose of drawing conclusions.', 'Implementation and Operation', 'Data Management'),
('IO-WRL-002', 'Database Administration', 'Responsible for administering databases and/or data management systems.', 'Implementation and Operation', 'Data Management'),
('IO-WRL-003', 'Knowledge Management', 'Responsible for managing and administering processes and tools that enable the organization to identify, document, and access intellectual capital.', 'Implementation and Operation', 'Knowledge Management'),
('IO-WRL-004', 'Network Operations', 'Responsible for planning, implementing, and operating network services/systems.', 'Implementation and Operation', 'Network Services'),
('IO-WRL-005', 'Systems Administration', 'Responsible for setting up and maintaining a system or specific components of a system.', 'Implementation and Operation', 'Systems Administration'),
('IO-WRL-006', 'Systems Security Analysis', 'Responsible for conducting analysis of systems and networks to identify vulnerabilities.', 'Implementation and Operation', 'Systems Analysis'),
('IO-WRL-007', 'Technical Support', 'Responsible for providing technical support to customers who need assistance.', 'Implementation and Operation', 'Customer Service'),

-- PROTECTION and DEFENSE (PD)
('PD-WRL-001', 'Defensive Cybersecurity', 'Responsible for defending against unauthorized activity within information systems and computer networks.', 'Protection and Defense', 'Cyber Defense'),
('PD-WRL-002', 'Digital Forensics', 'Responsible for collecting, processing, preserving, analyzing, and presenting computer-related evidence.', 'Protection and Defense', 'Digital Forensics'),
('PD-WRL-003', 'Incident Response', 'Responsible for responding to crises or urgent situations within the pertinent domain.', 'Protection and Defense', 'Incident Response'),
('PD-WRL-004', 'Infrastructure Support', 'Responsible for testing, implementing, deploying, maintaining, and administering infrastructure hardware and software.', 'Protection and Defense', 'Infrastructure Support'),
('PD-WRL-005', 'Insider Threat Analysis', 'Responsible for identifying and assessing insider threats and vulnerabilities.', 'Protection and Defense', 'Threat Analysis'),
('PD-WRL-006', 'Threat Analysis', 'Responsible for identifying and assessing capabilities and activities of cyber threats.', 'Protection and Defense', 'Threat Analysis'),
('PD-WRL-007', 'Vulnerability Analysis', 'Responsible for conducting assessments of threats and vulnerabilities.', 'Protection and Defense', 'Vulnerability Assessment'),

-- INVESTIGATION (IN)
('IN-WRL-001', 'Cybercrime Investigation', 'Responsible for investigating crimes conducted through digital means.', 'Investigation', 'Law Enforcement'),
('IN-WRL-002', 'Digital Evidence Analysis', 'Responsible for conducting analysis of digital evidence.', 'Investigation', 'Digital Forensics');
```

### 1.2 Create New Career Level Structure Based on NICE v2.0

```sql
-- Create a new table for NICE v2.0 levels if it doesn't exist
CREATE TABLE IF NOT EXISTS nice_competency_levels (
    id SERIAL PRIMARY KEY,
    level_code VARCHAR(20) NOT NULL UNIQUE,
    level_name VARCHAR(100) NOT NULL,
    level_order INTEGER NOT NULL,
    description TEXT,
    typical_experience TEXT
);

-- Insert NICE v2.0 competency levels
INSERT INTO nice_competency_levels (level_code, level_name, level_order, description, typical_experience) VALUES
('ENTRY', 'Entry-Level', 1, 'Foundation level for cybersecurity professionals. Focuses on fundamental knowledge and basic skills.', '0-2 years'),
('MID', 'Mid-Level', 2, 'Intermediate level requiring operational knowledge and hands-on skills. Can work independently on routine tasks.', '3-5 years'),
('SENIOR', 'Senior-Level', 3, 'Advanced level with deep expertise. Can lead projects and mentor others.', '6-10 years'),
('EXPERT', 'Expert/Lead', 4, 'Expert level with comprehensive knowledge. Leads teams and drives strategic initiatives.', '10+ years');
```

### 1.3 Map TKS Statements to Database

```sql
-- Create TKS statements table if not exists
CREATE TABLE IF NOT EXISTS tks_statements (
    id SERIAL PRIMARY KEY,
    tks_id VARCHAR(10) NOT NULL UNIQUE,
    tks_type CHAR(1) NOT NULL, -- 'T' for Task, 'K' for Knowledge, 'S' for Skill
    description TEXT NOT NULL,
    assigned_level VARCHAR(20) NOT NULL,
    justification TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Import TKS statements (this would be done via your import script)
-- Sample insert for reference:
INSERT INTO tks_statements (tks_id, tks_type, description, assigned_level, justification) VALUES
('K0018', 'K', 'Knowledge of encryption algorithms', 'Entry-Level', 'This is foundational, factual knowledge of what encryption algorithms are (e.g., AES, RSA), a core concept for any cybersecurity professional.'),
('K0055', 'K', 'Knowledge of microprocessors', 'Entry-Level', 'This is foundational, factual knowledge of what microprocessors are, representing a fundamental computer science concept.');
```

### 1.4 Create Work Role to TKS Mapping Table

```sql
CREATE TABLE IF NOT EXISTS work_role_tks_mapping (
    id SERIAL PRIMARY KEY,
    work_role_id VARCHAR(20) NOT NULL,
    tks_id VARCHAR(10) NOT NULL,
    importance VARCHAR(20) DEFAULT 'Required',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (work_role_id) REFERENCES work_roles(role_code),
    FOREIGN KEY (tks_id) REFERENCES tks_statements(tks_id),
    UNIQUE(work_role_id, tks_id)
);
```

## Step 2: Update Career Tracks to Align with NICE v2.0

Based on the NICE Framework categories, here's how your career tracks should map:

```sql
-- Update career tracks with NICE v2.0 alignment
UPDATE career_tracks SET 
    description = 'Aligned with NICE v2.0 Protection and Defense work roles, focusing on SOC operations, incident response, and defensive cybersecurity.',
    nice_category = 'Protection and Defense'
WHERE name = 'SOC Operations';

UPDATE career_tracks SET 
    description = 'Encompasses NICE v2.0 offensive security roles including threat analysis and vulnerability assessment.',
    nice_category = 'Protection and Defense'
WHERE name = 'Red Team Operations';

UPDATE career_tracks SET 
    description = 'Aligned with NICE v2.0 Vulnerability Analysis work role (PD-WRL-007).',
    nice_category = 'Protection and Defense'
WHERE name = 'Vulnerability Management';

UPDATE career_tracks SET 
    description = 'Aligned with NICE v2.0 Digital Forensics (PD-WRL-002) and Digital Evidence Analysis (IN-WRL-002).',
    nice_category = 'Protection and Defense, Investigation'
WHERE name = 'Digital Forensics';

UPDATE career_tracks SET 
    description = 'Maps to NICE v2.0 Oversight and Governance roles including Security Control Assessment and Systems Authorization.',
    nice_category = 'Oversight and Governance'
WHERE name = 'GRC (Governance, Risk, Compliance)';

UPDATE career_tracks SET 
    description = 'Aligned with NICE v2.0 Design and Development roles, specifically DD-WRL-001 and DD-WRL-002.',
    nice_category = 'Design and Development'
WHERE name = 'Cybersecurity Architecture & Engineering';

UPDATE career_tracks SET 
    description = 'Maps to NICE v2.0 Secure Software Development (DD-WRL-003) and Software Security Assessment (DD-WRL-005).',
    nice_category = 'Design and Development'
WHERE name = 'Secure Software Development';

-- Continue for all other tracks...
```

## Step 3: Create Import Script for TKS Data

```javascript
// Import script for TKS statements from Excel
import { db } from './server/db';
import { tksStatements, workRoleTksMapping } from './shared/schema';
import fs from 'fs';

async function importTKSData() {
  // Read the extracted JSON files
  const tksData = JSON.parse(fs.readFileSync('/home/claude/tks_statements_extracted.json', 'utf8'));
  
  // Insert TKS statements
  for (const tks of tksData) {
    const tksType = tks.TKS_ID.charAt(0); // K for Knowledge, S for Skill, T for Task
    
    await db.insert(tksStatements).values({
      tksId: tks.TKS_ID,
      tksType: tksType,
      description: tks.TKS_Description,
      assignedLevel: tks['Assigned Level'],
      justification: tks.Justification
    }).onConflictDoNothing();
  }
  
  console.log(`Imported ${tksData.length} TKS statements`);
}
```

## Step 4: Update Career Level Progressions

The new NICE v2.0 framework provides clear competency levels. Update your career_levels table:

```sql
-- Map career levels to NICE competency levels
ALTER TABLE career_levels ADD COLUMN nice_competency_level VARCHAR(20);

UPDATE career_levels SET nice_competency_level = 'ENTRY' WHERE level_name IN ('Entry', 'Junior', 'Associate');
UPDATE career_levels SET nice_competency_level = 'MID' WHERE level_name IN ('Mid-Level', 'Analyst II', 'Professional');
UPDATE career_levels SET nice_competency_level = 'SENIOR' WHERE level_name IN ('Senior', 'Lead', 'Principal');
UPDATE career_levels SET nice_competency_level = 'EXPERT' WHERE level_name IN ('Expert', 'Architect', 'Director', 'Executive');
```

## Step 5: Implement Work Role to Career Track Mapping

Based on the NICE v2.0 categories, here's the suggested mapping:

| Career Track | Primary NICE Work Roles |
|--------------|------------------------|
| SOC Operations | PD-WRL-001, PD-WRL-003, IO-WRL-006 |
| Red Team Operations | PD-WRL-006, PD-WRL-007 |
| Vulnerability Management | PD-WRL-007 |
| Digital Forensics | PD-WRL-002, IN-WRL-002 |
| GRC | OG-WRL-012, OG-WRL-013 |
| Cybersecurity Architecture | DD-WRL-001, DD-WRL-002 |
| Secure Software Development | DD-WRL-003, DD-WRL-005 |
| Cloud & Infrastructure | IO-WRL-004, IO-WRL-005, PD-WRL-004 |
| Identity & Access Management | OG-WRL-014 |
| OT Security | DD-WRL-009 |
| Cybercrime Investigation | IN-WRL-001 |
| Education & Training | OG-WRL-004, OG-WRL-005 |
| Executive Leadership | OG-WRL-007 |
| Program Management | OG-WRL-009, OG-WRL-010, OG-WRL-011 |
| Privacy & Legal | OG-WRL-006, OG-WRL-008 |
