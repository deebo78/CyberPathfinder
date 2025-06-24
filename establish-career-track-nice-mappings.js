import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon connection
const neonConfig = { webSocketConstructor: ws };
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ...neonConfig 
});

/**
 * Establishes proper mappings between Career Tracks and NICE Framework Work Roles
 * This creates the TKS inheritance structure so career progression levels 
 * automatically inherit Tasks, Knowledge, and Skills from mapped Work Roles
 */
async function establishCareerTrackNiceMappings() {
  const client = await pool.connect();
  
  try {
    console.log('Starting Career Track to NICE Framework mapping process...');
    
    // Define strategic mappings between career tracks and relevant NICE work roles
    const careerTrackWorkRoleMappings = {
      // SOC Operations Career Track
      31: [
        { workRoleCode: 'PD-WRL-001', careerLevels: ['Entry-Level', 'Mid-Level'], priority: 1 }, // Defensive Cybersecurity
        { workRoleCode: 'PD-WRL-002', careerLevels: ['Mid-Level', 'Senior-Level'], priority: 1 }, // Incident Response
        { workRoleCode: 'PD-WRL-004', careerLevels: ['Senior-Level'], priority: 2 }, // Infrastructure Support
        { workRoleCode: 'PD-WRL-005', careerLevels: ['Expert-Level'], priority: 1 } // Security Investigations
      ],
      
      // Red Team Operations Career Track  
      4: [
        { workRoleCode: 'OG-WRL-001', careerLevels: ['Entry-Level', 'Mid-Level'], priority: 1 }, // Exploitation Analyst
        { workRoleCode: 'OG-WRL-002', careerLevels: ['Mid-Level', 'Senior-Level'], priority: 1 }, // Targets Systems Analyst
        { workRoleCode: 'OG-WRL-003', careerLevels: ['Senior-Level', 'Expert-Level'], priority: 1 } // Offensive Operations Specialist
      ],
      
      // Vulnerability Management Career Track
      5: [
        { workRoleCode: 'PD-WRL-006', careerLevels: ['Entry-Level', 'Mid-Level'], priority: 1 }, // Vulnerability Assessment Analyst
        { workRoleCode: 'PD-WRL-007', careerLevels: ['Mid-Level', 'Senior-Level'], priority: 1 }, // Security Compliance
        { workRoleCode: 'PD-WRL-008', careerLevels: ['Senior-Level', 'Expert-Level'], priority: 1 } // Security Architect
      ],
      
      // Digital Forensics Career Track
      6: [
        { workRoleCode: 'IN-WRL-001', careerLevels: ['Entry-Level', 'Mid-Level'], priority: 1 }, // Cyber Crime Investigator
        { workRoleCode: 'IN-WRL-002', careerLevels: ['Mid-Level', 'Senior-Level'], priority: 1 } // Digital Forensics Analyst
      ],
      
      // GRC Career Track
      8: [
        { workRoleCode: 'OG-WRL-004', careerLevels: ['Entry-Level', 'Mid-Level'], priority: 1 }, // Compliance Analyst
        { workRoleCode: 'OG-WRL-005', careerLevels: ['Mid-Level', 'Senior-Level'], priority: 1 }, // Risk Analyst
        { workRoleCode: 'OG-WRL-006', careerLevels: ['Senior-Level', 'Expert-Level'], priority: 1 } // Governance Specialist
      ]
    };
    
    // Get work roles lookup
    const workRolesResult = await client.query('SELECT id, code, name FROM work_roles');
    const workRolesMap = new Map(workRolesResult.rows.map(wr => [wr.code, wr]));
    
    // Get career levels for each track
    const careerLevelsResult = await client.query(`
      SELECT cl.id, cl.career_track_id, cl.name, ct.name as track_name
      FROM career_levels cl
      JOIN career_tracks ct ON cl.career_track_id = ct.id
      ORDER BY cl.career_track_id, cl.sort_order
    `);
    
    const careerLevelsMap = new Map();
    careerLevelsResult.rows.forEach(level => {
      const key = `${level.career_track_id}-${level.name}`;
      careerLevelsMap.set(key, level);
    });
    
    let mappingsCreated = 0;
    let tksInherited = 0;
    
    // Process each career track mapping
    for (const [trackId, workRoleMappings] of Object.entries(careerTrackWorkRoleMappings)) {
      console.log(`\nProcessing Career Track ID: ${trackId}`);
      
      for (const mapping of workRoleMappings) {
        const workRole = workRolesMap.get(mapping.workRoleCode);
        if (!workRole) {
          console.log(`  Warning: Work role ${mapping.workRoleCode} not found`);
          continue;
        }
        
        // Map work role to specified career levels
        for (const levelName of mapping.careerLevels) {
          const levelKey = `${trackId}-${levelName}`;
          const careerLevel = careerLevelsMap.get(levelKey);
          
          if (!careerLevel) {
            console.log(`  Warning: Career level ${levelName} not found for track ${trackId}`);
            continue;
          }
          
          // Create career level work role mapping
          await client.query(`
            INSERT INTO career_level_work_roles (career_level_id, work_role_id, priority, notes)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [careerLevel.id, workRole.id, mapping.priority, `Mapped from ${workRole.name}`]);
          
          mappingsCreated++;
          console.log(`  Mapped ${workRole.code} to ${levelName} (Priority: ${mapping.priority})`);
          
          // Inherit Tasks from Work Role
          const tasksResult = await client.query(`
            SELECT task_id FROM work_role_tasks WHERE work_role_id = $1
          `, [workRole.id]);
          
          for (const taskRow of tasksResult.rows) {
            await client.query(`
              INSERT INTO career_level_tasks (career_level_id, task_id, importance, source)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [careerLevel.id, taskRow.task_id, 'required', 'inherited']);
            tksInherited++;
          }
          
          // Inherit Knowledge from Work Role
          const knowledgeResult = await client.query(`
            SELECT knowledge_item_id FROM work_role_knowledge WHERE work_role_id = $1
          `, [workRole.id]);
          
          for (const knowledgeRow of knowledgeResult.rows) {
            await client.query(`
              INSERT INTO career_level_knowledge (career_level_id, knowledge_item_id, importance, source)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [careerLevel.id, knowledgeRow.knowledge_item_id, 'required', 'inherited']);
            tksInherited++;
          }
          
          // Inherit Skills from Work Role  
          const skillsResult = await client.query(`
            SELECT skill_id FROM work_role_skills WHERE work_role_id = $1
          `, [workRole.id]);
          
          for (const skillRow of skillsResult.rows) {
            await client.query(`
              INSERT INTO career_level_skills (career_level_id, skill_id, importance, source)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [careerLevel.id, skillRow.skill_id, 'required', 'inherited']);
            tksInherited++;
          }
        }
      }
    }
    
    console.log(`\n✅ Career Track to NICE Framework mapping completed!`);
    console.log(`📊 Summary:`);
    console.log(`   • Work Role Mappings Created: ${mappingsCreated}`);
    console.log(`   • TKS Items Inherited: ${tksInherited}`);
    console.log(`   • Career Tracks Now Connected to NICE Framework Hierarchy`);
    
    // Verify the mappings
    const verificationResult = await client.query(`
      SELECT 
        ct.name as career_track,
        cl.name as career_level,
        wr.code as work_role_code,
        wr.name as work_role_name,
        COUNT(DISTINCT clt.task_id) as inherited_tasks,
        COUNT(DISTINCT clk.knowledge_item_id) as inherited_knowledge,
        COUNT(DISTINCT cls.skill_id) as inherited_skills
      FROM career_tracks ct
      JOIN career_levels cl ON ct.id = cl.career_track_id
      JOIN career_level_work_roles clwr ON cl.id = clwr.career_level_id
      JOIN work_roles wr ON clwr.work_role_id = wr.id
      LEFT JOIN career_level_tasks clt ON cl.id = clt.career_level_id
      LEFT JOIN career_level_knowledge clk ON cl.id = clk.career_level_id  
      LEFT JOIN career_level_skills cls ON cl.id = cls.career_level_id
      WHERE ct.id IN (31, 4, 5, 6, 8)
      GROUP BY ct.name, cl.name, wr.code, wr.name, cl.sort_order
      ORDER BY ct.name, cl.sort_order
    `);
    
    console.log(`\n📋 Verification - Career Tracks with TKS Inheritance:`);
    verificationResult.rows.forEach(row => {
      console.log(`   ${row.career_track} → ${row.career_level} → ${row.work_role_code}`);
      console.log(`     Tasks: ${row.inherited_tasks}, Knowledge: ${row.inherited_knowledge}, Skills: ${row.inherited_skills}`);
    });
    
  } catch (error) {
    console.error('Error establishing Career Track to NICE mappings:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the mapping process
establishCareerTrackNiceMappings()
  .then(() => {
    console.log('\n🎯 Career Track TKS inheritance structure successfully established!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to establish mappings:', error);
    process.exit(1);
  });

export { establishCareerTrackNiceMappings };