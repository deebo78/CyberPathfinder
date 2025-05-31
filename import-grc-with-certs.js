import XLSX from 'xlsx';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function importGRCWithCerts() {
  console.log('Starting GRC import with certifications...');

  try {
    // Read the GRC track file
    const workbook = XLSX.readFile('attached_assets/Track_5_GRC_Risk_Compliance.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Processing ${data.length} career level entries`);

    // Find the GRC track
    const trackResult = await pool.query(
      "SELECT id FROM career_tracks WHERE name ILIKE '%GRC%' OR name ILIKE '%Governance%' OR name ILIKE '%Risk%' OR name ILIKE '%Compliance%'"
    );

    if (trackResult.rows.length === 0) {
      console.log('GRC track not found, creating it...');
      const insertResult = await pool.query(
        "INSERT INTO career_tracks (name, description) VALUES ($1, $2) RETURNING id",
        ['GRC (Governance, Risk, Compliance)', 'Governance, Risk, and Compliance career track focusing on organizational security policies, risk management, and regulatory compliance']
      );
      var trackId = insertResult.rows[0].id;
    } else {
      var trackId = trackResult.rows[0].id;
      console.log(`Found GRC track with ID: ${trackId}`);
    }

    // Get all certifications for mapping
    const certResult = await pool.query("SELECT id, code, name FROM certifications");
    const certMap = new Map();
    certResult.rows.forEach(cert => {
      certMap.set(cert.code.toLowerCase(), cert.id);
      certMap.set(cert.name.toLowerCase(), cert.id);
      // Add common variations
      if (cert.name.includes('CISSP')) certMap.set('cissp', cert.id);
      if (cert.name.includes('CISM')) certMap.set('cism', cert.id);
      if (cert.name.includes('CISA')) certMap.set('cisa', cert.id);
      if (cert.name.includes('Security+')) certMap.set('security+', cert.id);
      if (cert.name.includes('CRISC')) certMap.set('crisc', cert.id);
      if (cert.name.includes('CGEIT')) certMap.set('cgeit', cert.id);
    });

    for (const row of data) {
      const level = row['Career Level'] || row['Level'] || row['Experience Level'];
      const title = row['Work Role Title'] || row['Job Title'] || row['Position'] || row['Role'];
      const description = row['Notes'] || row['Description'] || row['Job Description'] || '';
      const experienceYears = row['Experience Range'] || row['Years Experience'] || row['Experience'];
      const certifications = row['Certifications'] || row['Recommended Certifications'] || '';

      if (!level || !title) {
        console.log('Skipping row with missing level or title:', row);
        continue;
      }

      console.log(`\nProcessing: ${level} - ${title}`);

      // Check if position already exists
      const existingPosition = await pool.query(
        "SELECT id FROM career_levels WHERE career_track_id = $1 AND title = $2",
        [trackId, title]
      );

      let careerLevelId;
      if (existingPosition.rows.length > 0) {
        careerLevelId = existingPosition.rows[0].id;
        console.log(`Position already exists: ${title}`);
      } else {
        // Insert career level
        const insertResult = await pool.query(
          "INSERT INTO career_levels (career_track_id, level, title, description, typical_experience) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [trackId, level, title, description, experienceYears]
        );
        careerLevelId = insertResult.rows[0].id;
        console.log(`Inserted new position: ${title}`);
      }

      // Process certifications
      if (certifications && certifications.trim()) {
        const certList = certifications.split(/[,;|\n]/).map(c => c.trim()).filter(c => c);
        console.log(`Processing ${certList.length} certifications for ${level}`);

        for (const certName of certList) {
          const cleanCert = certName.toLowerCase().trim();
          let certId = null;

          // Try exact matches first
          certId = certMap.get(cleanCert);

          // Try partial matches for common certifications
          if (!certId) {
            for (const [key, id] of certMap) {
              if (key.includes(cleanCert) || cleanCert.includes(key)) {
                certId = id;
                break;
              }
            }
          }

          if (certId) {
            // Check if mapping already exists
            const existingMapping = await pool.query(
              "SELECT id FROM career_level_certifications WHERE career_level_id = $1 AND certification_id = $2",
              [careerLevelId, certId]
            );

            if (existingMapping.rows.length === 0) {
              await pool.query(
                "INSERT INTO career_level_certifications (career_level_id, certification_id) VALUES ($1, $2)",
                [careerLevelId, certId]
              );
              console.log(`  Mapped certification: ${certName}`);
            }
          } else {
            console.log(`  Could not find certification match for: "${certName}"`);
          }
        }
      }
    }

    console.log('\nGRC import with certifications completed successfully!');

  } catch (error) {
    console.error('Error importing GRC track:', error);
  } finally {
    await pool.end();
  }
}

importGRCWithCerts();