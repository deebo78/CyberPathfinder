import XLSX from 'xlsx';
import { db } from './server/db.js';
import { certifications } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function extractAndImportMissingCertifications() {
  console.log('Starting extraction and import of missing certifications...');
  
  // List of all certification mapping files
  const certFiles = [
    'Track_2_Red_Team_Operations_with_Certs.xlsx',
    'Track_1_SOC_Operations_with_Certs.xlsx',
    'Track_3_Vulnerability_Management_With_Certs.xlsx',
    'Track_4_Digital_Forensics_with_Certs.xlsx',
    'Track_5_GRC_Risk_Compliance_with_Certs.xlsx',
    'Track_6_Cybersecurity_Architecture_Engineering_with_Certs.xlsx',
    'Track_7_Secure_Software_Development_with_Certs.xlsx',
    'Track_8_Cloud_Infrastructure_Security_with_Certs.xlsx',
    'Track_9_Identity_Access_Management_with_Certs.xlsx',
    'Track_10_OT_Security_with_Certs.xlsx',
    'Track_11_Cybercrime_Investigation_with_Certs.xlsx',
    'Track_12_Cybersecurity_Education_Training_with_Certs.xlsx',
    'Track_13_Executive_Leadership_CISO_Track_with_Certs.xlsx',
    'Track_14_Program_and_Project_Management_with_Certs.xlsx',
    'Track_15_Technology_Research_and_Tool_Development_with_Certs.xlsx',
    'Track_16_Security_Automation_and_Orchestration_with_Certs.xlsx',
    'Track_17_Customer_Facing_Security_Roles_with_Certs.xlsx',
    'Track_18_Threat_Intelligence_with_Certs.xlsx',
    'Track_19_Privacy_Policy_Legal_Affairs_with_Certs.xlsx'
  ];

  // Get existing certifications
  const existingCerts = await db.select().from(certifications);
  const existingCodes = new Set(existingCerts.map(cert => cert.code));
  const existingNames = new Set(existingCerts.map(cert => cert.name.toLowerCase()));
  
  const missingCertifications = new Map();
  
  for (const fileName of certFiles) {
    try {
      console.log(`Processing ${fileName}...`);
      const workbook = XLSX.readFile(`attached_assets/${fileName}`);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      for (const row of data) {
        const certColumn = row['Relevant Certifications'] || row['Certifications'] || row['Recommended Certifications'];
        if (!certColumn) continue;
        
        const certList = certColumn.split(',').map(cert => cert.trim()).filter(cert => cert);
        
        for (let certName of certList) {
          certName = certName.trim();
          if (!certName || certName.length < 3) continue;
          
          // Skip if we already have this certification
          if (existingNames.has(certName.toLowerCase())) continue;
          
          // Generate a reasonable code
          const code = generateCertCode(certName);
          if (existingCodes.has(code)) continue;
          
          // Parse certification details
          const certDetails = parseCertificationDetails(certName);
          
          missingCertifications.set(certName, {
            code: code,
            name: certName,
            issuer: certDetails.issuer,
            level: certDetails.level,
            domain: certDetails.domain,
            description: `${certName} certification`,
            renewalPeriod: certDetails.renewalPeriod,
            prerequisites: certDetails.prerequisites
          });
        }
      }
    } catch (error) {
      console.log(`Error processing ${fileName}:`, error.message);
    }
  }
  
  console.log(`Found ${missingCertifications.size} missing certifications`);
  
  // Insert missing certifications in batches
  const certificationsToInsert = Array.from(missingCertifications.values());
  const batchSize = 50;
  
  for (let i = 0; i < certificationsToInsert.length; i += batchSize) {
    const batch = certificationsToInsert.slice(i, i + batchSize);
    try {
      await db.insert(certifications).values(batch);
      console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(certificationsToInsert.length/batchSize)}`);
    } catch (error) {
      console.log(`Error inserting batch:`, error.message);
      // Try inserting individually for this batch
      for (const cert of batch) {
        try {
          await db.insert(certifications).values(cert);
        } catch (individualError) {
          console.log(`Failed to insert ${cert.name}:`, individualError.message);
        }
      }
    }
  }
  
  console.log('Missing certifications import completed!');
}

function generateCertCode(certName) {
  // Extract issuer and main part
  if (certName.includes('CompTIA')) {
    const match = certName.match(/CompTIA\s+(.+)/i);
    return match ? `COMP-${match[1].toUpperCase().replace(/[^A-Z0-9]/g, '')}` : 'COMP-UNKNOWN';
  }
  if (certName.includes('GIAC')) {
    const match = certName.match(/GIAC\s+([A-Z]+)/i) || certName.match(/\(([A-Z]+)\)/);
    return match ? `GIAC-${match[1].toUpperCase()}` : 'GIAC-UNKNOWN';
  }
  if (certName.includes('Microsoft') || certName.includes('MS-')) {
    const match = certName.match(/(MS-[A-Z0-9-]+)/i) || certName.match(/Microsoft\s+([A-Z0-9-]+)/i);
    return match ? match[1].toUpperCase() : 'MS-UNKNOWN';
  }
  if (certName.includes('AWS')) {
    const match = certName.match(/AWS\s+(.+)/i);
    return match ? `AWS-${match[1].toUpperCase().replace(/[^A-Z0-9]/g, '')}` : 'AWS-UNKNOWN';
  }
  if (certName.includes('Cisco') || certName.includes('CCNA') || certName.includes('CCNP')) {
    const match = certName.match(/(CC[A-Z]+)/i);
    return match ? `CISCO-${match[1].toUpperCase()}` : 'CISCO-UNKNOWN';
  }
  if (certName.includes('ISACA')) {
    const match = certName.match(/ISACA\s+([A-Z]+)/i) || certName.match(/(CISA|CISM|CRISC|CGEIT)/i);
    return match ? `ISACA-${match[1].toUpperCase()}` : 'ISACA-UNKNOWN';
  }
  if (certName.includes('ISC') || certName.includes('(ISC)²')) {
    const match = certName.match(/(CISSP|SSCP|CCSP|CAP)/i);
    return match ? `ISC2-${match[1].toUpperCase()}` : 'ISC2-UNKNOWN';
  }
  if (certName.includes('EC-Council')) {
    const match = certName.match(/(CEH|CHFI|ECSA|CND)/i);
    return match ? `EC-${match[1].toUpperCase()}` : 'EC-UNKNOWN';
  }
  
  // Generate generic code
  const words = certName.split(/\s+/).filter(w => w.length > 2);
  if (words.length >= 2) {
    return `${words[0].substring(0,4).toUpperCase()}-${words[1].substring(0,4).toUpperCase()}`;
  }
  return certName.substring(0,8).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function parseCertificationDetails(certName) {
  let issuer = 'Various';
  let level = 'Professional';
  let domain = 'Cybersecurity';
  let renewalPeriod = '3 years';
  let prerequisites = 'Relevant experience recommended';
  
  // Determine issuer
  if (certName.includes('CompTIA')) issuer = 'CompTIA';
  else if (certName.includes('GIAC')) issuer = 'GIAC';
  else if (certName.includes('Microsoft') || certName.includes('MS-')) issuer = 'Microsoft';
  else if (certName.includes('AWS')) issuer = 'Amazon Web Services';
  else if (certName.includes('Cisco')) issuer = 'Cisco';
  else if (certName.includes('ISACA')) issuer = 'ISACA';
  else if (certName.includes('ISC') || certName.includes('(ISC)²')) issuer = 'ISC2';
  else if (certName.includes('EC-Council')) issuer = 'EC-Council';
  else if (certName.includes('Google')) issuer = 'Google';
  else if (certName.includes('Offensive Security')) issuer = 'Offensive Security';
  
  // Determine level
  if (certName.toLowerCase().includes('foundation') || certName.toLowerCase().includes('fundamentals') || certName.toLowerCase().includes('basic')) {
    level = 'Foundation';
  } else if (certName.toLowerCase().includes('associate') || certName.toLowerCase().includes('practitioner')) {
    level = 'Associate';
  } else if (certName.toLowerCase().includes('expert') || certName.toLowerCase().includes('advanced') || certName.toLowerCase().includes('senior')) {
    level = 'Expert';
  } else if (certName.toLowerCase().includes('professional') || certName.toLowerCase().includes('specialist')) {
    level = 'Professional';
  } else if (certName.toLowerCase().includes('architect') || certName.toLowerCase().includes('executive') || certName.toLowerCase().includes('director')) {
    level = 'Expert';
  }
  
  // Determine domain
  if (certName.toLowerCase().includes('cloud')) domain = 'Cloud Security';
  else if (certName.toLowerCase().includes('network')) domain = 'Network Security';
  else if (certName.toLowerCase().includes('forensic')) domain = 'Digital Forensics';
  else if (certName.toLowerCase().includes('penetration') || certName.toLowerCase().includes('pentest')) domain = 'Penetration Testing';
  else if (certName.toLowerCase().includes('incident')) domain = 'Incident Response';
  else if (certName.toLowerCase().includes('risk') || certName.toLowerCase().includes('governance')) domain = 'Risk Management';
  else if (certName.toLowerCase().includes('architect')) domain = 'Security Architecture';
  else if (certName.toLowerCase().includes('development') || certName.toLowerCase().includes('software')) domain = 'Secure Development';
  
  // Set renewal period based on issuer
  if (issuer === 'GIAC') renewalPeriod = '4 years';
  else if (issuer === 'Microsoft') renewalPeriod = '2 years';
  else if (issuer === 'AWS') renewalPeriod = '3 years';
  else if (issuer === 'Cisco') renewalPeriod = '3 years';
  
  return { issuer, level, domain, renewalPeriod, prerequisites };
}

extractAndImportMissingCertifications().catch(console.error);