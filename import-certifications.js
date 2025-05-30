import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

// Authentic cybersecurity certifications data
const certifications = [
  // CompTIA Certifications
  {
    code: "COMP-SEC+",
    name: "CompTIA Security+",
    description: "Entry-level certification covering basic cybersecurity principles and practices",
    issuer: "CompTIA",
    level: "Foundation",
    domain: "General",
    renewalPeriod: "3 years",
    prerequisites: "None"
  },
  {
    code: "COMP-NET+",
    name: "CompTIA Network+",
    description: "Foundational networking skills with security focus",
    issuer: "CompTIA",
    level: "Foundation",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "None"
  },
  {
    code: "COMP-CYSA+",
    name: "CompTIA CySA+",
    description: "Cybersecurity analyst skills for threat detection and analysis",
    issuer: "CompTIA",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "Network+ and Security+ or equivalent experience"
  },
  {
    code: "COMP-PENTEST+",
    name: "CompTIA PenTest+",
    description: "Penetration testing and vulnerability assessment skills",
    issuer: "CompTIA",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "Network+ and Security+ or equivalent experience"
  },
  {
    code: "COMP-CASP+",
    name: "CompTIA CASP+",
    description: "Advanced-level cybersecurity practitioner certification",
    issuer: "CompTIA",
    level: "Expert",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "10+ years IT experience with 5+ years security experience"
  },

  // ISC2 Certifications
  {
    code: "ISC2-CISSP",
    name: "Certified Information Systems Security Professional",
    description: "Advanced cybersecurity management and architecture certification",
    issuer: "ISC2",
    level: "Professional",
    domain: "Management",
    renewalPeriod: "3 years",
    prerequisites: "5 years paid security experience"
  },
  {
    code: "ISC2-SSCP",
    name: "Systems Security Certified Practitioner",
    description: "Hands-on security skills for IT administrators and security professionals",
    issuer: "ISC2",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "1 year paid security experience"
  },
  {
    code: "ISC2-CCSP",
    name: "Certified Cloud Security Professional",
    description: "Cloud security architecture, design, operations, and service orchestration",
    issuer: "ISC2",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "5 years IT experience with 3+ years security and 1+ year cloud security"
  },
  {
    code: "ISC2-CISSP-ISSAP",
    name: "CISSP - Information Systems Security Architecture Professional",
    description: "Advanced security architecture and engineering concentration",
    issuer: "ISC2",
    level: "Expert",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "CISSP certification plus additional experience"
  },

  // EC-Council Certifications
  {
    code: "EC-CEH",
    name: "Certified Ethical Hacker",
    description: "Ethical hacking and penetration testing methodology",
    issuer: "EC-Council",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "2 years security experience or training"
  },
  {
    code: "EC-CHFI",
    name: "Computer Hacking Forensic Investigator",
    description: "Digital forensics and incident response capabilities",
    issuer: "EC-Council",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "2 years security/forensics experience"
  },
  {
    code: "EC-ECSA",
    name: "EC-Council Certified Security Analyst",
    description: "Advanced penetration testing and security analysis",
    issuer: "EC-Council",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "CEH certification or equivalent experience"
  },

  // SANS/GIAC Certifications
  {
    code: "GIAC-GSEC",
    name: "GIAC Security Essentials",
    description: "Foundational cybersecurity knowledge and hands-on skills",
    issuer: "GIAC",
    level: "Associate",
    domain: "General",
    renewalPeriod: "4 years",
    prerequisites: "None"
  },
  {
    code: "GIAC-GCIH",
    name: "GIAC Certified Incident Handler",
    description: "Incident response and digital forensics skills",
    issuer: "GIAC",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "4 years",
    prerequisites: "GSEC or equivalent experience"
  },
  {
    code: "GIAC-GPEN",
    name: "GIAC Penetration Tester",
    description: "Penetration testing methodology and tools",
    issuer: "GIAC",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "4 years",
    prerequisites: "Security experience recommended"
  },
  {
    code: "GIAC-GCFA",
    name: "GIAC Certified Forensic Analyst",
    description: "Advanced incident response and digital forensics",
    issuer: "GIAC",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "4 years",
    prerequisites: "GCIH or equivalent experience"
  },
  {
    code: "GIAC-GSLC",
    name: "GIAC Security Leadership",
    description: "Information security leadership and management",
    issuer: "GIAC",
    level: "Expert",
    domain: "Management",
    renewalPeriod: "4 years",
    prerequisites: "5+ years security leadership experience"
  },

  // Cisco Certifications
  {
    code: "CISCO-CCNA-SEC",
    name: "Cisco Certified Network Associate Security",
    description: "Network security implementation and monitoring",
    issuer: "Cisco",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "CCNA or equivalent knowledge"
  },
  {
    code: "CISCO-CCNP-SEC",
    name: "Cisco Certified Network Professional Security",
    description: "Advanced network security design and implementation",
    issuer: "Cisco",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "CCNA Security or equivalent experience"
  },

  // Microsoft Certifications
  {
    code: "MS-SC-900",
    name: "Microsoft Security, Compliance, and Identity Fundamentals",
    description: "Microsoft security, compliance, and identity fundamentals",
    issuer: "Microsoft",
    level: "Foundation",
    domain: "Technical",
    renewalPeriod: "None",
    prerequisites: "None"
  },
  {
    code: "MS-SC-200",
    name: "Microsoft Security Operations Analyst",
    description: "Security operations using Microsoft Sentinel and Defender",
    issuer: "Microsoft",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "Annual",
    prerequisites: "Fundamental knowledge of Microsoft 365 and Azure"
  },
  {
    code: "MS-SC-300",
    name: "Microsoft Identity and Access Administrator",
    description: "Identity and access management using Microsoft Azure AD",
    issuer: "Microsoft",
    level: "Associate",
    domain: "Technical",
    renewalPeriod: "Annual",
    prerequisites: "Experience with Azure and identity solutions"
  },

  // AWS Certifications
  {
    code: "AWS-SEC-SPEC",
    name: "AWS Certified Security - Specialty",
    description: "Specialized knowledge in securing AWS workloads and applications",
    issuer: "Amazon Web Services",
    level: "Professional",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "2+ years hands-on experience securing AWS workloads"
  },

  // ISACA Certifications
  {
    code: "ISACA-CISA",
    name: "Certified Information Systems Auditor",
    description: "Information systems auditing, control, and assurance",
    issuer: "ISACA",
    level: "Professional",
    domain: "Governance",
    renewalPeriod: "3 years",
    prerequisites: "5 years information systems experience"
  },
  {
    code: "ISACA-CISM",
    name: "Certified Information Security Manager",
    description: "Information security management and governance",
    issuer: "ISACA",
    level: "Professional",
    domain: "Management",
    renewalPeriod: "3 years",
    prerequisites: "5 years information security experience with 3+ years management"
  },
  {
    code: "ISACA-CRISC",
    name: "Certified in Risk and Information Systems Control",
    description: "IT risk identification, assessment, and mitigation",
    issuer: "ISACA",
    level: "Professional",
    domain: "Governance",
    renewalPeriod: "3 years",
    prerequisites: "3 years experience in IS/IT risk and control"
  },

  // Cloud Security Alliance
  {
    code: "CSA-CCSK",
    name: "Certificate of Cloud Security Knowledge",
    description: "Fundamental cloud security knowledge and best practices",
    issuer: "Cloud Security Alliance",
    level: "Foundation",
    domain: "Technical",
    renewalPeriod: "3 years",
    prerequisites: "None"
  },

  // Other Important Certifications
  {
    code: "NIST-NICE",
    name: "NICE Cybersecurity Workforce Framework",
    description: "National Initiative for Cybersecurity Education framework competency",
    issuer: "NIST",
    level: "Foundation",
    domain: "General",
    renewalPeriod: "None",
    prerequisites: "None"
  },
  {
    code: "ISF-CISMP",
    name: "Certificate in Information Security Management Principles",
    description: "Information security management fundamentals",
    issuer: "Information Security Forum",
    level: "Foundation",
    domain: "Management",
    renewalPeriod: "3 years",
    prerequisites: "None"
  }
];

async function importCertifications() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Starting certification import...');
    
    // Insert certifications
    for (const cert of certifications) {
      const insertQuery = `
        INSERT INTO certifications (code, name, description, issuer, level, domain, renewal_period, prerequisites)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          issuer = EXCLUDED.issuer,
          level = EXCLUDED.level,
          domain = EXCLUDED.domain,
          renewal_period = EXCLUDED.renewal_period,
          prerequisites = EXCLUDED.prerequisites
      `;
      
      await pool.query(insertQuery, [
        cert.code,
        cert.name,
        cert.description,
        cert.issuer,
        cert.level,
        cert.domain,
        cert.renewalPeriod,
        cert.prerequisites
      ]);
      
      console.log(`Imported: ${cert.name}`);
    }

    // Create import history record
    const historyQuery = `
      INSERT INTO import_history (filename, import_type, records_imported, status, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await pool.query(historyQuery, [
      'cybersecurity-certifications.js',
      'CERTIFICATIONS',
      certifications.length,
      'SUCCESS',
      JSON.stringify({
        issuers: [...new Set(certifications.map(c => c.issuer))],
        levels: [...new Set(certifications.map(c => c.level))],
        domains: [...new Set(certifications.map(c => c.domain))]
      })
    ]);

    console.log(`Successfully imported ${certifications.length} certifications`);
    
  } catch (error) {
    console.error('Error importing certifications:', error);
    
    // Log error to import history
    try {
      const errorQuery = `
        INSERT INTO import_history (filename, import_type, records_imported, status, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `;
      
      await pool.query(errorQuery, [
        'cybersecurity-certifications.js',
        'CERTIFICATIONS',
        0,
        'ERROR',
        JSON.stringify({ error: error.message })
      ]);
    } catch (logError) {
      console.error('Error logging to import history:', logError);
    }
  } finally {
    await pool.end();
  }
}

// Run the import
importCertifications();

export { importCertifications, certifications };