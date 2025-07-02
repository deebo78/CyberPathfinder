-- CyberPathfinder Complete Database Setup Script
-- This script creates the complete database schema and includes sample data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create core tables
CREATE TABLE IF NOT EXISTS career_tracks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    overview TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_levels (
    id SERIAL PRIMARY KEY,
    career_track_id INTEGER NOT NULL REFERENCES career_tracks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    salary_range VARCHAR(100),
    experience_range VARCHAR(100),
    key_responsibilities TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_track_id, name)
);

CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    description TEXT,
    level VARCHAR(50),
    renewal_period INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_level_certifications (
    id SERIAL PRIMARY KEY,
    career_level_id INTEGER NOT NULL REFERENCES career_levels(id) ON DELETE CASCADE,
    certification_id INTEGER NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_level_id, certification_id)
);

-- NICE Framework tables
CREATE TABLE IF NOT EXISTS nice_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nice_specialty_areas (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES nice_categories(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nice_work_roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES nice_categories(id),
    specialty_area_id INTEGER REFERENCES nice_specialty_areas(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_items (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Junction tables for TKS inheritance
CREATE TABLE IF NOT EXISTS career_level_work_roles (
    id SERIAL PRIMARY KEY,
    career_level_id INTEGER NOT NULL REFERENCES career_levels(id) ON DELETE CASCADE,
    work_role_id INTEGER NOT NULL REFERENCES nice_work_roles(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_level_id, work_role_id)
);

CREATE TABLE IF NOT EXISTS career_level_tasks (
    id SERIAL PRIMARY KEY,
    career_level_id INTEGER NOT NULL REFERENCES career_levels(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    importance VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(20) DEFAULT 'inherited',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_level_id, task_id)
);

CREATE TABLE IF NOT EXISTS career_level_knowledge (
    id SERIAL PRIMARY KEY,
    career_level_id INTEGER NOT NULL REFERENCES career_levels(id) ON DELETE CASCADE,
    knowledge_item_id INTEGER NOT NULL REFERENCES knowledge_items(id) ON DELETE CASCADE,
    importance VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(20) DEFAULT 'inherited',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_level_id, knowledge_item_id)
);

CREATE TABLE IF NOT EXISTS career_level_skills (
    id SERIAL PRIMARY KEY,
    career_level_id INTEGER NOT NULL REFERENCES career_levels(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    importance VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(20) DEFAULT 'inherited',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(career_level_id, skill_id)
);

-- Analysis tables
CREATE TABLE IF NOT EXISTS resume_analyses (
    id SERIAL PRIMARY KEY,
    original_filename VARCHAR(255),
    extracted_text TEXT,
    analysis_results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vacancy_analyses (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    job_description TEXT,
    analysis_results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_levels_track_id ON career_levels(career_track_id);
CREATE INDEX IF NOT EXISTS idx_career_level_certifications_level_id ON career_level_certifications(career_level_id);
CREATE INDEX IF NOT EXISTS idx_career_level_certifications_cert_id ON career_level_certifications(certification_id);
CREATE INDEX IF NOT EXISTS idx_career_level_work_roles_level_id ON career_level_work_roles(career_level_id);
CREATE INDEX IF NOT EXISTS idx_career_level_work_roles_work_role_id ON career_level_work_roles(work_role_id);
CREATE INDEX IF NOT EXISTS idx_career_level_tasks_level_id ON career_level_tasks(career_level_id);
CREATE INDEX IF NOT EXISTS idx_career_level_knowledge_level_id ON career_level_knowledge(career_level_id);
CREATE INDEX IF NOT EXISTS idx_career_level_skills_level_id ON career_level_skills(career_level_id);
CREATE INDEX IF NOT EXISTS idx_certifications_code ON certifications(code);
CREATE INDEX IF NOT EXISTS idx_nice_work_roles_code ON nice_work_roles(code);
CREATE INDEX IF NOT EXISTS idx_tasks_code ON tasks(code);
CREATE INDEX IF NOT EXISTS idx_knowledge_items_code ON knowledge_items(code);
CREATE INDEX IF NOT EXISTS idx_skills_code ON skills(code);

-- Insert sample NICE Framework categories
INSERT INTO nice_categories (code, name, description) VALUES
('SP', 'Securely Provision', 'Conceptualize, design, procure, and/or build secure information technology systems'),
('OM', 'Operate and Maintain', 'Provide the support, administration, and maintenance necessary to ensure effective and efficient information technology system performance and security'),
('OV', 'Oversight and Development', 'Provide leadership, management, direction, or development and advocacy so the organization may effectively conduct cybersecurity work'),
('PR', 'Protect and Defend', 'Identify, analyze, and mitigate threats to internal information technology systems and/or networks'),
('AN', 'Analyze', 'Perform highly-specialized review and evaluation of incoming cybersecurity information to determine its usefulness for intelligence'),
('CO', 'Collect and Operate', 'Provide specialized denial and deception operations and collection of cybersecurity information that may be used to develop intelligence'),
('IN', 'Investigate', 'Investigate cybersecurity events or crimes related to information technology systems, networks, and digital evidence')
ON CONFLICT (code) DO NOTHING;

-- Insert sample career tracks
INSERT INTO career_tracks (name, description, overview) VALUES
('SOC Operations', 'Security Operations Center career pathway focusing on real-time threat monitoring, analysis, and response', 'Comprehensive career progression from entry-level analyst to senior SOC manager roles'),
('Red Team Operations', 'Career pathway for Red Team Operations professionals', 'Offensive security career path focusing on penetration testing and red team operations'),
('Digital Forensics', 'Career pathway for Digital Forensics professionals', 'Specialized track for digital investigation and forensic analysis'),
('Vulnerability Management', 'Career pathway for Vulnerability Management professionals', 'Focus on identifying, assessing, and remediating security vulnerabilities'),
('Threat Intelligence', 'Career pathway for Threat Intelligence professionals', 'Intelligence-driven cybersecurity career path'),
('GRC (Governance, Risk, Compliance)', 'Career pathway for GRC (Governance, Risk, Compliance) professionals', 'Comprehensive governance and compliance career progression'),
('Cloud and Infrastructure Security', 'Career pathway focusing on cloud security, infrastructure protection, and hybrid environment security management', 'Modern cloud security specialization track'),
('Cybersecurity Architecture & Engineering', 'Career pathway focusing on security system design, implementation, and architectural solutions', 'Technical architecture and engineering career path'),
('Secure Software Development', 'Career pathway for Secure Software Development professionals', 'Software security and secure development practices'),
('Identity and Access Management', 'Career pathway focusing on access control, identity governance, and user lifecycle management', 'IAM specialization and career progression'),
('Executive Leadership CISO Track', 'Specialized career pathway focused on preparation for Chief Information Security Officer roles and executive cybersecurity leadership', 'Executive leadership development track')
ON CONFLICT (name) DO NOTHING;

-- Insert sample career levels for SOC Operations
INSERT INTO career_levels (career_track_id, name, description, salary_range, experience_range, sort_order) 
SELECT 
    ct.id,
    level_data.name,
    level_data.description,
    level_data.salary_range,
    level_data.experience_range,
    level_data.sort_order
FROM career_tracks ct
CROSS JOIN (
    VALUES 
    ('Entry-Level', 'Entry-level Security Operations Center analyst position', '$45,000 - $65,000', '0-2 years', 1),
    ('Mid-Level', 'Mid-level SOC analyst with specialized skills', '$65,000 - $85,000', '2-5 years', 2),
    ('Senior-Level', 'Senior SOC analyst and team lead roles', '$85,000 - $110,000', '5-8 years', 3),
    ('Expert-Level', 'SOC expert and senior management positions', '$110,000 - $140,000', '8-12 years', 4),
    ('Executive-Level', 'SOC director and executive leadership roles', '$140,000 - $200,000', '12+ years', 5)
) AS level_data(name, description, salary_range, experience_range, sort_order)
WHERE ct.name = 'SOC Operations'
ON CONFLICT (career_track_id, name) DO NOTHING;

-- Insert sample certifications
INSERT INTO certifications (code, name, issuer, description, level) VALUES
('COMPTIA-SEC+', 'CompTIA Security+', 'CompTIA', 'Foundation-level cybersecurity certification', 'Foundation'),
('COMPTIA-CYSA+', 'CompTIA CySA+', 'CompTIA', 'Cybersecurity analyst certification', 'Associate'),
('COMPTIA-CASP+', 'CompTIA CASP+', 'CompTIA', 'Advanced cybersecurity practitioner certification', 'Expert'),
('ISC2-CISSP', 'Certified Information Systems Security Professional', 'ISC2', 'Advanced cybersecurity management certification', 'Expert'),
('ISC2-SSCP', 'Systems Security Certified Practitioner', 'ISC2', 'Hands-on security skills certification', 'Associate'),
('ISC2-CCSP', 'Certified Cloud Security Professional', 'ISC2', 'Cloud security specialist certification', 'Professional'),
('GIAC-GSEC', 'GIAC Security Essentials', 'GIAC', 'Foundational security knowledge certification', 'Professional'),
('GIAC-GCIH', 'GIAC Certified Incident Handler', 'GIAC', 'Incident response and handling certification', 'Professional'),
('GIAC-GPEN', 'GIAC Penetration Tester', 'GIAC', 'Penetration testing certification', 'Professional'),
('CISCO-CCNA-SEC', 'Cisco Certified Network Associate Security', 'Cisco', 'Network security certification', 'Associate'),
('CISCO-CCNP-SEC', 'Cisco Certified Network Professional Security', 'Cisco', 'Advanced network security certification', 'Professional'),
('MS-SC-900', 'Microsoft Security, Compliance, and Identity Fundamentals', 'Microsoft', 'Microsoft security fundamentals', 'Foundation'),
('MS-SC-200', 'Microsoft Security Operations Analyst', 'Microsoft', 'Microsoft security operations certification', 'Associate'),
('AZURE-SECURITY', 'Microsoft Azure Security Engineer Associate', 'Microsoft', 'Azure security specialist certification', 'Associate')
ON CONFLICT (code) DO NOTHING;

-- Insert sample work roles
INSERT INTO nice_work_roles (code, name, description, category_id) 
SELECT 
    wr_data.code,
    wr_data.name,
    wr_data.description,
    nc.id
FROM (
    VALUES 
    ('PR-CIR-001', 'Cyber Defense Analyst', 'Uses data to identify and respond to cyber threats', 'PR'),
    ('PR-INF-001', 'Cyber Defense Infrastructure Support Specialist', 'Tests, implements, and maintains security infrastructure', 'PR'),
    ('PR-CIR-002', 'Cyber Defense Incident Responder', 'Investigates and responds to cyber security incidents', 'PR'),
    ('AN-TWA-001', 'Threat/Warning Analyst', 'Develops cyber threat assessments and intelligence', 'AN'),
    ('AN-ASA-001', 'All-Source Analyst', 'Analyzes threat intelligence from multiple sources', 'AN'),
    ('CO-OPL-001', 'Exploitation Analyst', 'Conducts offensive cyber operations', 'CO'),
    ('SP-RSK-001', 'Authorizing Official/Designating Representative', 'Risk assessment and authorization specialist', 'SP'),
    ('SP-ARC-001', 'Security Architect', 'Designs secure system architectures', 'SP'),
    ('SP-DEV-001', 'Software Developer', 'Develops secure software applications', 'SP'),
    ('OM-ANA-001', 'System Administrator', 'Maintains and administers secure systems', 'OM')
) AS wr_data(code, name, description, category_code)
JOIN nice_categories nc ON nc.code = wr_data.category_code
ON CONFLICT (code) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (code, description) VALUES
('T0023', 'Characterize and analyze network traffic to identify anomalous activity and potential threats to network resources'),
('T0046', 'Develop and implement network backup and recovery procedures'),
('T0081', 'Coordinate and provide expert technical support to enterprise-wide cyber defense technicians'),
('T0103', 'Examine network topologies to understand data flows through the network'),
('T0126', 'Perform integrated cyber defense trend analysis and reporting'),
('T0139', 'Receive and analyze network alerts from various sources within the enterprise'),
('T0163', 'Perform cyber defense incident triage'),
('T0170', 'Perform event correlation using information gathered from a variety of sources'),
('T0214', 'Receive and respond to cyber defense incidents'),
('T0230', 'Analyze security logs to identify evidence of malicious activity'),
('T0290', 'Determine tactics, techniques, and procedures used for intrusion'),
('T0312', 'Coordinate with intelligence analysts to correlate threat assessment data'),
('T0332', 'Develop cyber security reports and briefings'),
('T0345', 'Recommend computing environment vulnerability corrections'),
('T0365', 'Identify and analyze anomalies in network traffic'),
('T0388', 'Perform malware analysis, network analysis, and disk and memory forensics'),
('T0503', 'Monitor network traffic for malicious activity'),
('T0548', 'Provide technical summary of findings'),
('T0564', 'Apply approved security policies and procedures'),
('T0579', 'Assess the effectiveness of security controls')
ON CONFLICT (code) DO NOTHING;

-- Insert sample knowledge items
INSERT INTO knowledge_items (code, description) VALUES
('K0001', 'Knowledge of computer networking concepts and protocols'),
('K0002', 'Knowledge of risk management processes'),
('K0003', 'Knowledge of laws, regulations, policies, and ethics related to cybersecurity'),
('K0004', 'Knowledge of cybersecurity and privacy principles'),
('K0005', 'Knowledge of cyber threats and vulnerabilities'),
('K0006', 'Knowledge of specific operational impacts of cybersecurity lapses'),
('K0013', 'Knowledge of cyber defense and vulnerability assessment tools'),
('K0018', 'Knowledge of encryption algorithms'),
('K0019', 'Knowledge of cryptography and cryptographic key management concepts'),
('K0021', 'Knowledge of data backup and recovery procedures'),
('K0033', 'Knowledge of host/network access control mechanisms'),
('K0040', 'Knowledge of organization mission and business function'),
('K0042', 'Knowledge of incident response and handling methodologies'),
('K0044', 'Knowledge of cybersecurity and privacy principles and organizational requirements'),
('K0058', 'Knowledge of network traffic analysis methods'),
('K0061', 'Knowledge of how traffic flows across the network'),
('K0062', 'Knowledge of packet-level analysis'),
('K0070', 'Knowledge of system and application security threats and vulnerabilities'),
('K0106', 'Knowledge of what constitutes a network attack'),
('K0157', 'Knowledge of cyber defense policies, procedures, and regulations'),
('K0161', 'Knowledge of different classes of attacks'),
('K0162', 'Knowledge of cyber attackers and their objectives'),
('K0167', 'Knowledge of system administration, network, and operating system hardening techniques'),
('K0179', 'Knowledge of network security architecture concepts'),
('K0191', 'Knowledge of signature implementation impact for viruses, malware, and attacks patterns')
ON CONFLICT (code) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (code, description) VALUES
('S0025', 'Skill in detecting host and network based intrusions'),
('S0027', 'Skill in determining how a security system should work'),
('S0036', 'Skill in identifying systems security requirements'),
('S0054', 'Skill in reading and interpreting signatures'),
('S0063', 'Skill in collecting, processing, packaging, transporting, and storing electronic evidence'),
('S0078', 'Skill in recognizing and categorizing types of vulnerabilities'),
('S0096', 'Skill in reading and interpreting system logs'),
('S0120', 'Skill in detecting and analyzing network threats'),
('S0147', 'Skill in assessing security systems designs'),
('S0156', 'Skill in performing damage assessments'),
('S0167', 'Skill in recognizing vulnerabilities in security systems'),
('S0169', 'Skill in conducting vulnerability scans and recognizing vulnerabilities'),
('S0184', 'Skill in using security event correlation tools'),
('S0194', 'Skill in using malware analysis tools'),
('S0199', 'Skill in recognizing indicators of compromise'),
('S0214', 'Skill in conducting security assessments'),
('S0219', 'Skill in analyzing malware'),
('S0248', 'Skill in writing security policies and procedures'),
('S0297', 'Skill in identifying security requirements'),
('S0365', 'Skill in identifying cybersecurity threats which may jeopardize organization and operational security')
ON CONFLICT (code) DO NOTHING;

-- Create sample TKS mappings for SOC Operations Entry-Level
INSERT INTO career_level_work_roles (career_level_id, work_role_id, priority)
SELECT cl.id, wr.id, 1
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN nice_work_roles wr ON wr.code = 'PR-CIR-001'
WHERE ct.name = 'SOC Operations' AND cl.name = 'Entry-Level'
ON CONFLICT (career_level_id, work_role_id) DO NOTHING;

-- Create sample certification mappings
INSERT INTO career_level_certifications (career_level_id, certification_id, priority)
SELECT cl.id, c.id, 1
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN certifications c ON c.code IN ('COMPTIA-SEC+', 'MS-SC-900')
WHERE ct.name = 'SOC Operations' AND cl.name = 'Entry-Level'
ON CONFLICT (career_level_id, certification_id) DO NOTHING;

INSERT INTO career_level_certifications (career_level_id, certification_id, priority)
SELECT cl.id, c.id, 1
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN certifications c ON c.code IN ('COMPTIA-CYSA+', 'GIAC-GSEC', 'MS-SC-200')
WHERE ct.name = 'SOC Operations' AND cl.name = 'Mid-Level'
ON CONFLICT (career_level_id, certification_id) DO NOTHING;

-- Create sample task mappings
INSERT INTO career_level_tasks (career_level_id, task_id, importance, source)
SELECT cl.id, t.id, 'high', 'inherited'
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN tasks t ON t.code IN ('T0023', 'T0139', 'T0163', 'T0214', 'T0230')
WHERE ct.name = 'SOC Operations' AND cl.name = 'Entry-Level'
ON CONFLICT (career_level_id, task_id) DO NOTHING;

-- Create sample knowledge mappings
INSERT INTO career_level_knowledge (career_level_id, knowledge_item_id, importance, source)
SELECT cl.id, k.id, 'high', 'inherited'
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN knowledge_items k ON k.code IN ('K0001', 'K0004', 'K0005', 'K0013', 'K0042')
WHERE ct.name = 'SOC Operations' AND cl.name = 'Entry-Level'
ON CONFLICT (career_level_id, knowledge_item_id) DO NOTHING;

-- Create sample skill mappings
INSERT INTO career_level_skills (career_level_id, skill_id, importance, source)
SELECT cl.id, s.id, 'high', 'inherited'
FROM career_levels cl
JOIN career_tracks ct ON cl.career_track_id = ct.id
JOIN skills s ON s.code IN ('S0025', 'S0036', 'S0096', 'S0120', 'S0199')
WHERE ct.name = 'SOC Operations' AND cl.name = 'Entry-Level'
ON CONFLICT (career_level_id, skill_id) DO NOTHING;

-- Add more comprehensive data comments
COMMENT ON TABLE career_tracks IS 'Core cybersecurity career specialization tracks';
COMMENT ON TABLE career_levels IS 'Five-level progression structure for each career track';
COMMENT ON TABLE certifications IS 'Industry cybersecurity certifications database';
COMMENT ON TABLE nice_work_roles IS 'NICE Framework work role definitions';
COMMENT ON TABLE career_level_certifications IS 'Certification mappings to career levels';
COMMENT ON TABLE career_level_work_roles IS 'NICE work role mappings to career levels';
COMMENT ON TABLE career_level_tasks IS 'Task inheritance from NICE Framework';
COMMENT ON TABLE career_level_knowledge IS 'Knowledge item inheritance from NICE Framework';
COMMENT ON TABLE career_level_skills IS 'Skill inheritance from NICE Framework';

-- Create views for common queries
CREATE OR REPLACE VIEW career_track_summary AS
SELECT 
    ct.id,
    ct.name,
    ct.description,
    COUNT(DISTINCT cl.id) as career_levels,
    COUNT(DISTINCT clc.certification_id) as mapped_certifications,
    COUNT(DISTINCT clwr.work_role_id) as mapped_work_roles
FROM career_tracks ct
LEFT JOIN career_levels cl ON ct.id = cl.career_track_id
LEFT JOIN career_level_certifications clc ON cl.id = clc.career_level_id
LEFT JOIN career_level_work_roles clwr ON cl.id = clwr.career_level_id
GROUP BY ct.id, ct.name, ct.description
ORDER BY ct.name;

CREATE OR REPLACE VIEW certification_coverage AS
SELECT 
    c.id,
    c.code,
    c.name,
    c.issuer,
    c.level,
    COUNT(DISTINCT clc.career_level_id) as career_level_mappings,
    COUNT(DISTINCT cl.career_track_id) as career_track_mappings
FROM certifications c
LEFT JOIN career_level_certifications clc ON c.id = clc.certification_id
LEFT JOIN career_levels cl ON clc.career_level_id = cl.id
GROUP BY c.id, c.code, c.name, c.issuer, c.level
ORDER BY career_level_mappings DESC, c.name;

-- Final success message
SELECT 'CyberPathfinder database setup completed successfully!' as status,
       (SELECT COUNT(*) FROM career_tracks) as career_tracks,
       (SELECT COUNT(*) FROM career_levels) as career_levels,
       (SELECT COUNT(*) FROM certifications) as certifications,
       (SELECT COUNT(*) FROM nice_work_roles) as work_roles,
       (SELECT COUNT(*) FROM tasks) as tasks,
       (SELECT COUNT(*) FROM knowledge_items) as knowledge_items,
       (SELECT COUNT(*) FROM skills) as skills;