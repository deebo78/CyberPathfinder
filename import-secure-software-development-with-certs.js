import XLSX from 'xlsx';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function importSecureSoftwareDevelopmentWithCerts() {
  console.log('Starting Secure Software Development import with certifications...');

  try {
    // Read the Secure Software Development track with certifications file
    const workbook = XLSX.readFile('attached_assets/Track_7_Secure_Software_Development_with_Certs.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Processing ${data.length} career level entries`);

    // Find the Secure Software Development track
    const trackResult = await pool.query(
      "SELECT id FROM career_tracks WHERE name ILIKE '%Secure Software%' OR name ILIKE '%Software Development%'"
    );

    if (trackResult.rows.length === 0) {
      console.log('Secure Software Development track not found, creating it...');
      const insertResult = await pool.query(
        "INSERT INTO career_tracks (name, description) VALUES ($1, $2) RETURNING id",
        ['Secure Software Development', 'Design, develop, and maintain secure software applications with built-in security controls and practices']
      );
      var trackId = insertResult.rows[0].id;
    } else {
      var trackId = trackResult.rows[0].id;
      console.log(`Found Secure Software Development track with ID: ${trackId}`);
    }

    // Get all certifications for mapping
    const certResult = await pool.query("SELECT id, code, name FROM certifications");
    const certMap = new Map();
    certResult.rows.forEach(cert => {
      certMap.set(cert.code.toLowerCase(), cert.id);
      certMap.set(cert.name.toLowerCase(), cert.id);
      
      // Add common certification variations for software development
      const certName = cert.name.toLowerCase();
      if (certName.includes('cissp')) certMap.set('cissp', cert.id);
      if (certName.includes('security+')) certMap.set('security+', cert.id);
      if (certName.includes('comptia security+')) certMap.set('comptia security+', cert.id);
      if (certName.includes('csslp')) certMap.set('csslp', cert.id);
      if (certName.includes('ceh')) certMap.set('ceh', cert.id);
      if (certName.includes('gweb')) certMap.set('gweb', cert.id);
      if (certName.includes('aws')) certMap.set('aws', cert.id);
      if (certName.includes('azure')) certMap.set('azure', cert.id);
      if (certName.includes('oscp')) certMap.set('oscp', cert.id);
      if (certName.includes('owasp')) certMap.set('owasp', cert.id);
    });

    for (const row of data) {
      const level = row['Career Level'] || row['Level'] || row['Experience Level'];
      const title = row['Job Title'] || row['Position'] || row['Role'] || row['Work Role Title'];
      const description = row['Description'] || row['Job Description'] || row['Notes'] || '';
      const experienceYears = row['Experience Range'] || row['Years Experience'] || row['Experience'];
      const certifications = row['Certifications'] || row['Recommended Certifications'] || row['Certification Requirements'] || '';

      if (!level || !title) {
        console.log('Skipping row with missing level or title:', row);
        continue;
      }

      console.log(`\nProcessing: ${level} - ${title}`);

      // Check if position already exists
      const existingPosition = await pool.query(
        "SELECT id FROM career_levels WHERE career_track_id = $1 AND name = $2",
        [trackId, title]
      );

      let careerLevelId;
      if (existingPosition.rows.length > 0) {
        careerLevelId = existingPosition.rows[0].id;
        console.log(`Position already exists: ${title}`);
      } else {
        // Insert career level
        const insertResult = await pool.query(
          "INSERT INTO career_levels (career_track_id, name, description, experience_range) VALUES ($1, $2, $3, $4) RETURNING id",
          [trackId, title, description, experienceYears]
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
              if (cleanCert.includes(key) || key.includes(cleanCert)) {
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

    console.log('\nSecure Software Development import with certifications completed successfully!');

  } catch (error) {
    console.error('Error importing Secure Software Development track:', error);
  } finally {
    await pool.end();
  }
}

importSecureSoftwareDevelopmentWithCerts();