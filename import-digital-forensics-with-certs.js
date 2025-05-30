import XLSX from 'xlsx';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, and } from 'drizzle-orm';
import ws from "ws";
import * as schema from "./shared/schema.ts";

const { careerTracks, careerLevels, careerPositions, certifications, careerLevelCertifications } = schema;

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function importDigitalForensicsWithCerts() {
  try {
    console.log('Starting Digital Forensics import with certifications...');
    
    const workbook = XLSX.readFile('./attached_assets/Track_4_Digital_Forensics_with_Certs.xlsx');
    const worksheet = workbook.Sheets['Sheet1'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = data[0];
    const rows = data.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
    
    console.log(`Processing ${rows.length} career level entries`);
    
    const forensicsTrack = await db.select().from(careerTracks).where(eq(careerTracks.name, 'Digital Forensics')).limit(1);
    
    if (!forensicsTrack.length) {
      console.error('Digital Forensics track not found');
      return;
    }
    
    const trackId = forensicsTrack[0].id;
    console.log(`Found Digital Forensics track with ID: ${trackId}`);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const careerLevelName = row[0];
      const jobTitle = row[1];
      const certificationsList = row[2];
      
      console.log(`\nProcessing: ${careerLevelName} - ${jobTitle}`);
      
      let careerLevel = await db.select().from(careerLevels)
        .where(and(
          eq(careerLevels.careerTrackId, trackId),
          eq(careerLevels.name, careerLevelName)
        )).limit(1);
      
      if (!careerLevel.length) {
        console.log(`Career level ${careerLevelName} not found, skipping...`);
        continue;
      }
      
      const levelId = careerLevel[0].id;
      
      const existingPosition = await db.select().from(careerPositions)
        .where(and(
          eq(careerPositions.careerLevelId, levelId),
          eq(careerPositions.jobTitle, jobTitle)
        )).limit(1);
      
      if (!existingPosition.length) {
        await db.insert(careerPositions).values({
          careerLevelId: levelId,
          jobTitle: jobTitle,
          sortOrder: i + 1
        });
        console.log(`Created position: ${jobTitle}`);
      } else {
        console.log(`Position already exists: ${jobTitle}`);
      }
      
      if (certificationsList && certificationsList.trim()) {
        const certNames = certificationsList.split(',').map(cert => cert.trim());
        console.log(`Processing ${certNames.length} certifications for ${careerLevelName}`);
        
        for (let j = 0; j < certNames.length; j++) {
          const certName = certNames[j];
          
          const existingCerts = await db.select().from(certifications);
          const matchingCert = existingCerts.find(cert => 
            cert.name.toLowerCase().includes(certName.toLowerCase()) ||
            certName.toLowerCase().includes(cert.name.toLowerCase()) ||
            cert.code.toLowerCase().includes(certName.toLowerCase().replace(/[^a-z0-9]/gi, ''))
          );
          
          if (matchingCert) {
            const existingMapping = await db.select().from(careerLevelCertifications)
              .where(and(
                eq(careerLevelCertifications.careerLevelId, levelId),
                eq(careerLevelCertifications.certificationId, matchingCert.id)
              )).limit(1);
            
            if (!existingMapping.length) {
              await db.insert(careerLevelCertifications).values({
                careerLevelId: levelId,
                certificationId: matchingCert.id,
                priority: j + 1,
                notes: `Recommended for ${careerLevelName} in Digital Forensics`
              });
              console.log(`  Mapped certification: ${matchingCert.name} (${matchingCert.code})`);
            } else {
              console.log(`  Certification already mapped: ${matchingCert.name}`);
            }
          } else {
            console.log(`  Could not find certification match for: "${certName}"`);
          }
        }
      }
    }
    
    console.log('\nDigital Forensics import with certifications completed successfully!');
    
  } catch (error) {
    console.error('Error importing Digital Forensics with certifications:', error);
  } finally {
    await pool.end();
  }
}

importDigitalForensicsWithCerts();