import XLSX from 'xlsx';
import { db } from './server/db.js';
import { careerLevelCertifications, certifications } from './shared/schema.js';
import { eq, and } from 'drizzle-orm';

async function fixIAMAndOTCertifications() {
  console.log('Fixing IAM and OT certification mappings...');
  
  // Process IAM track (ID 38)
  try {
    console.log('Processing IAM track...');
    const iamWorkbook = XLSX.readFile('attached_assets/Track_9_Identity_and_Access_Management_with_Certs.xlsx');
    const iamWorksheet = iamWorkbook.Sheets[iamWorkbook.SheetNames[0]];
    const iamData = XLSX.utils.sheet_to_json(iamWorksheet);
    
    await processTrackCertifications(38, iamData);
    
  } catch (error) {
    console.log('Error processing IAM:', error.message);
  }
  
  // Process OT track (ID 39)
  try {
    console.log('Processing OT track...');
    const otWorkbook = XLSX.readFile('attached_assets/Track_10_OT_Security_with_Certs.xlsx');
    const otWorksheet = otWorkbook.Sheets[otWorkbook.SheetNames[0]];
    const otData = XLSX.utils.sheet_to_json(otWorksheet);
    
    await processTrackCertifications(39, otData);
    
  } catch (error) {
    console.log('Error processing OT:', error.message);
  }
  
  console.log('IAM and OT certification mappings fixed!');
}

async function processTrackCertifications(trackId, data) {
  console.log(`Processing track ID ${trackId}...`);
  
  // Get all certifications
  const allCerts = await db.select().from(certifications);
  const certMap = new Map();
  allCerts.forEach(cert => {
    certMap.set(cert.name.toLowerCase(), cert);
    certMap.set(cert.code.toLowerCase(), cert);
  });
  
  // Get career levels for this track
  const careerLevels = await db.query.careerTracks.findFirst({
    where: eq(db.schema.careerTracks.id, trackId),
    with: {
      careerLevels: true
    }
  });
  
  if (!careerLevels?.careerLevels) {
    console.log(`No career levels found for track ${trackId}`);
    return;
  }
  
  const levelMap = new Map();
  careerLevels.careerLevels.forEach(level => {
    levelMap.set(level.name, level.id);
  });
  
  for (const row of data) {
    const levelName = row['Career Level'];
    const certColumn = row['Relevant Certifications'] || row['Certifications'];
    
    if (!levelName || !certColumn) continue;
    
    const careerLevelId = levelMap.get(levelName);
    if (!careerLevelId) {
      console.log(`Career level not found: ${levelName}`);
      continue;
    }
    
    const certList = certColumn.split(',').map(cert => cert.trim()).filter(cert => cert);
    
    for (let i = 0; i < certList.length; i++) {
      const certName = certList[i].trim();
      if (!certName || certName.length < 3) continue;
      
      // Try to find certification by name or code
      let certification = certMap.get(certName.toLowerCase());
      if (!certification) {
        // Try partial matches
        for (const [key, cert] of certMap) {
          if (key.includes(certName.toLowerCase()) || certName.toLowerCase().includes(key)) {
            certification = cert;
            break;
          }
        }
      }
      
      if (certification) {
        try {
          // Check if mapping already exists
          const existing = await db.select().from(careerLevelCertifications)
            .where(and(
              eq(careerLevelCertifications.careerLevelId, careerLevelId),
              eq(careerLevelCertifications.certificationId, certification.id)
            ));
          
          if (existing.length === 0) {
            await db.insert(careerLevelCertifications).values({
              careerLevelId: careerLevelId,
              certificationId: certification.id,
              priority: i + 1
            });
            console.log(`Mapped ${certification.code} to ${levelName}`);
          }
        } catch (error) {
          console.log(`Error mapping ${certName}:`, error.message);
        }
      } else {
        console.log(`Certification not found: ${certName}`);
      }
    }
  }
}

fixIAMAndOTCertifications().catch(console.error);