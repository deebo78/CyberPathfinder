import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, and } from 'drizzle-orm';
import ws from "ws";
import * as schema from "./shared/schema.ts";

const { careerTracks, careerLevels, careerPositions, careerLevelCertifications } = schema;

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function removeIncorrectVulnPositions() {
  try {
    console.log('Removing incorrect Vulnerability Management positions...');
    
    // Find Vulnerability Management track
    const vulnTrack = await db.select().from(careerTracks)
      .where(eq(careerTracks.name, 'Vulnerability Management')).limit(1);
    
    if (!vulnTrack.length) {
      console.error('Vulnerability Management track not found');
      return;
    }
    
    const trackId = vulnTrack[0].id;
    console.log(`Found Vulnerability Management track with ID: ${trackId}`);
    
    // Get all career levels for this track
    const levels = await db.select().from(careerLevels)
      .where(eq(careerLevels.careerTrackId, trackId));
    
    console.log(`Found ${levels.length} career levels`);
    
    // Remove positions that were incorrectly added
    const incorrectPositions = [
      'Vulnerability Management Analyst',
      'Vulnerability Management Specialist', 
      'Vulnerability Program Manager',
      'Vulnerability Assessment Lead / Engineer',
      'Director of Vulnerability Management'
    ];
    
    for (const levelData of levels) {
      const positions = await db.select().from(careerPositions)
        .where(eq(careerPositions.careerLevelId, levelData.id));
      
      for (const position of positions) {
        if (incorrectPositions.includes(position.jobTitle)) {
          console.log(`Removing position: ${position.jobTitle} from ${levelData.name}`);
          
          // First remove any certification mappings for this position's level
          await db.delete(careerLevelCertifications)
            .where(eq(careerLevelCertifications.careerLevelId, levelData.id));
          
          // Then remove the position
          await db.delete(careerPositions)
            .where(eq(careerPositions.id, position.id));
        }
      }
    }
    
    console.log('Removal completed successfully!');
    
  } catch (error) {
    console.error('Error removing incorrect positions:', error);
  } finally {
    await pool.end();
  }
}

removeIncorrectVulnPositions();