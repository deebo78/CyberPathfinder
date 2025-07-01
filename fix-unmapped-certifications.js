import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixUnmappedCertifications() {
  const client = await pool.connect();

  try {
    console.log("🔍 Mapping unmapped certifications to career tracks...");

    // Define mappings based on certification focus areas
    const certificationMappings = [
      // Network Security & SOC Operations
      { certCode: 'CISCO-CCNA-SEC', trackName: 'SOC Operations', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'CISCO-CCNP-SEC', trackName: 'SOC Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'ISC2-SSCP', trackName: 'SOC Operations', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'MS-SC-200', trackName: 'SOC Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'MS-SC-900', trackName: 'SOC Operations', levels: ['Entry-Level'] },

      // Incident Response & Digital Forensics
      { certCode: 'GIAC-GCIH', trackName: 'SOC Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'CCE-(CER', trackName: 'Digital Forensics', levels: ['Senior-Level', 'Expert-Level'] },
      { certCode: 'CERT-FORE', trackName: 'Digital Forensics', levels: ['Senior-Level', 'Expert-Level'] },

      // Penetration Testing & Red Team
      { certCode: 'GIAC-GPEN', trackName: 'Red Team Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'GIAC-RED', trackName: 'Red Team Operations', levels: ['Senior-Level', 'Expert-Level'] },
      { certCode: 'CERT-RED', trackName: 'Red Team Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'CRTO-II', trackName: 'Red Team Operations', levels: ['Expert-Level'] },
      { certCode: 'GIAC-ADVANCED', trackName: 'Red Team Operations', levels: ['Expert-Level'] },
      { certCode: 'GIAC-EXPLOIT', trackName: 'Red Team Operations', levels: ['Expert-Level'] },
      { certCode: 'OS-OSEP', trackName: 'Red Team Operations', levels: ['Expert-Level'] },
      { certCode: 'OS-OSWE', trackName: 'Red Team Operations', levels: ['Expert-Level'] },
      { certCode: 'TCM-SECU', trackName: 'Red Team Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'TCM-PNPT', trackName: 'Red Team Operations', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'ELEARN-ECPPT', trackName: 'Red Team Operations', levels: ['Senior-Level'] },
      { certCode: 'CRES-CERT', trackName: 'Red Team Operations', levels: ['Senior-Level', 'Expert-Level'] },

      // Vulnerability Management
      { certCode: 'CERT-VULN', trackName: 'Vulnerability Management', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'GIAC-CERTIFIED', trackName: 'Vulnerability Management', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'QUAL-VULN', trackName: 'Vulnerability Management', levels: ['Mid-Level', 'Senior-Level'] },

      // Cloud Security
      { certCode: 'CSA-CCSK', trackName: 'Cloud and Infrastructure Security', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'AZURE', trackName: 'Cloud and Infrastructure Security', levels: ['Mid-Level', 'Senior-Level'] },

      // GRC & Risk Management
      { certCode: 'ISF-CISMP', trackName: 'GRC (Governance, Risk, Compliance)', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'FAIR-RISK', trackName: 'GRC (Governance, Risk, Compliance)', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'NIST-CSF', trackName: 'GRC (Governance, Risk, Compliance)', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'NIST-CSF-PRACTITIONER', trackName: 'GRC (Governance, Risk, Compliance)', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'MBA-RISK', trackName: 'GRC (Governance, Risk, Compliance)', levels: ['Expert-Level', 'Executive-Level'] },

      // Threat Intelligence
      { certCode: 'GIAC-CYBER', trackName: 'Threat Intelligence', levels: ['Mid-Level', 'Senior-Level'] },

      // Secure Development
      { certCode: 'GIAC-GSSP-JAVA', trackName: 'Secure Software Development', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'GIAC-GWAPT', trackName: 'Secure Software Development', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'OWASP-DEVSECOPS', trackName: 'Secure Software Development', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'GITH-CI/C', trackName: 'Secure Software Development', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'SECU-CODI', trackName: 'Secure Software Development', levels: ['Mid-Level', 'Senior-Level'] },
      { certCode: 'SECURE-CODE-JAVA', trackName: 'Secure Software Development', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'THREAT-MODEL-PRO', trackName: 'Secure Software Development', levels: ['Senior-Level', 'Expert-Level'] },

      // Architecture & Engineering
      { certCode: 'GIAC-ENTERPRISE', trackName: 'Cybersecurity Architecture & Engineering', levels: ['Expert-Level'] },
      { certCode: 'SABSA-FOUND', trackName: 'Cybersecurity Architecture & Engineering', levels: ['Senior-Level', 'Expert-Level'] },

      // Education & Training
      { certCode: 'EC-CCT', trackName: 'Cybersecurity Education & Training', levels: ['Entry-Level', 'Mid-Level'] },
      { certCode: 'EC-ECSA', trackName: 'Cybersecurity Education & Training', levels: ['Mid-Level', 'Senior-Level'] },

      // Executive Leadership
      { certCode: 'EXEC-LEAD', trackName: 'Executive Leadership CISO Track', levels: ['Expert-Level', 'Executive-Level'] },
      { certCode: 'MBA-WITH', trackName: 'Executive Leadership CISO Track', levels: ['Expert-Level', 'Executive-Level'] },
      { certCode: 'GIAC-STRATEGIC', trackName: 'Executive Leadership CISO Track', levels: ['Expert-Level', 'Executive-Level'] },

      // Program Management
      { certCode: 'AND-LEAD', trackName: 'Program and Project Management', levels: ['Senior-Level', 'Expert-Level'] },

      // Infrastructure Security
      { certCode: 'RED-HAT', trackName: 'Cloud and Infrastructure Security', levels: ['Mid-Level', 'Senior-Level'] },
    ];

    let totalMappings = 0;

    for (const mapping of certificationMappings) {
      // Get certification ID
      const certResult = await client.query(
        'SELECT id FROM certifications WHERE code = $1',
        [mapping.certCode]
      );

      if (certResult.rows.length === 0) {
        console.log(`⚠️  Certification ${mapping.certCode} not found`);
        continue;
      }

      const certificationId = certResult.rows[0].id;

      // Get career track ID
      const trackResult = await client.query(
        'SELECT id FROM career_tracks WHERE name = $1',
        [mapping.trackName]
      );

      if (trackResult.rows.length === 0) {
        console.log(`⚠️  Career track ${mapping.trackName} not found`);
        continue;
      }

      const careerTrackId = trackResult.rows[0].id;

      // Map to each specified level
      for (const levelName of mapping.levels) {
        // Get career level ID
        const levelResult = await client.query(
          'SELECT id FROM career_levels WHERE career_track_id = $1 AND name = $2',
          [careerTrackId, levelName]
        );

        if (levelResult.rows.length === 0) {
          console.log(`⚠️  Career level ${levelName} not found for track ${mapping.trackName}`);
          continue;
        }

        const careerLevelId = levelResult.rows[0].id;

        // Check if mapping already exists
        const existingResult = await client.query(
          'SELECT id FROM career_level_certifications WHERE career_level_id = $1 AND certification_id = $2',
          [careerLevelId, certificationId]
        );

        if (existingResult.rows.length === 0) {
          // Insert new mapping
          await client.query(
            'INSERT INTO career_level_certifications (career_level_id, certification_id, relevance_score, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
            [careerLevelId, certificationId, 85] // Default relevance score
          );

          console.log(`✅ Mapped ${mapping.certCode} to ${mapping.trackName} - ${levelName}`);
          totalMappings++;
        } else {
          console.log(`⏭️  ${mapping.certCode} already mapped to ${mapping.trackName} - ${levelName}`);
        }
      }
    }

    console.log(`\n🎉 Successfully created ${totalMappings} new certification mappings!`);

    // Show summary of remaining unmapped certifications
    const unmappedResult = await client.query(`
      SELECT c.code, c.name
      FROM certifications c
      LEFT JOIN career_level_certifications clc ON c.id = clc.certification_id
      WHERE clc.certification_id IS NULL
      ORDER BY c.name
    `);

    if (unmappedResult.rows.length > 0) {
      console.log(`\n📋 Remaining unmapped certifications (${unmappedResult.rows.length}):`);
      unmappedResult.rows.forEach(cert => {
        console.log(`   - ${cert.code}: ${cert.name}`);
      });
    } else {
      console.log(`\n🎯 All certifications are now mapped to career tracks!`);
    }

  } catch (error) {
    console.error('❌ Error mapping certifications:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the function
fixUnmappedCertifications();