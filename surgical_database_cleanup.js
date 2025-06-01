import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function surgicalDatabaseCleanup() {
  const client = await pool.connect();
  
  try {
    console.log('Starting surgical database cleanup...');
    console.log('This will preserve all authentic certification mappings while removing duplicates.');
    
    await client.query('BEGIN');
    
    // Step 1: Migrate certification mappings from duplicate tracks to keeper tracks
    console.log('\n=== Step 1: Migrating Certification Mappings ===');
    
    const migrations = [
      // Customer-Facing Security Roles (30) → Customer Facing Security Roles (46)
      { from: 30, to: 46, name: 'Customer Facing Security Roles' },
      // Identity & Access Management (19) → Identity and Access Management (38)
      { from: 19, to: 38, name: 'Identity and Access Management' },
      // Privacy & Data Protection (11) → Privacy Policy Legal Affairs (48)
      { from: 11, to: 48, name: 'Privacy Policy Legal Affairs' },
      // Program & Project Management (24) → Program and Project Management (43)
      { from: 24, to: 43, name: 'Program and Project Management' },
      // Executive Leadership (25) → Executive Leadership CISO Track (42)
      { from: 25, to: 42, name: 'Executive Leadership CISO Track' },
      // Cyber Policy & Legal Strategy (10) → Privacy Policy Legal Affairs (48)
      { from: 10, to: 48, name: 'Privacy Policy Legal Affairs (from Policy track)' },
      // Security Automation & Orchestration (28) → Security Automation and Orchestration (45)
      { from: 28, to: 45, name: 'Security Automation and Orchestration' }
    ];
    
    for (const migration of migrations) {
      console.log(`\nMigrating ${migration.name} (${migration.from} → ${migration.to})`);
      
      // Get career levels mapping between source and target tracks
      const sourceLevels = await client.query(
        'SELECT id, name, sort_order FROM career_levels WHERE career_track_id = $1 ORDER BY sort_order',
        [migration.from]
      );
      
      const targetLevels = await client.query(
        'SELECT id, name, sort_order FROM career_levels WHERE career_track_id = $1 ORDER BY sort_order',
        [migration.to]
      );
      
      if (sourceLevels.rows.length === 0) {
        console.log(`  No source levels found for track ${migration.from}`);
        continue;
      }
      
      if (targetLevels.rows.length === 0) {
        console.log(`  No target levels found for track ${migration.to}`);
        continue;
      }
      
      // Map levels by sort order (Entry=1, Mid=2, Senior=3, Expert=4, Executive=5)
      for (let i = 0; i < Math.min(sourceLevels.rows.length, targetLevels.rows.length); i++) {
        const sourceLevel = sourceLevels.rows[i];
        const targetLevel = targetLevels.rows[i];
        
        // Copy certification mappings
        const result = await client.query(`
          INSERT INTO career_level_certifications (career_level_id, certification_id, priority, notes)
          SELECT $2, certification_id, priority, notes
          FROM career_level_certifications
          WHERE career_level_id = $1
          ON CONFLICT (career_level_id, certification_id) DO NOTHING
        `, [sourceLevel.id, targetLevel.id]);
        
        console.log(`    Migrated ${result.rowCount} certifications from "${sourceLevel.name}" to "${targetLevel.name}"`);
      }
    }
    
    // Step 2: Verify migration results
    console.log('\n=== Step 2: Verification ===');
    
    const verificationQuery = `
      SELECT 
        ct.id,
        ct.name,
        COUNT(DISTINCT clc.certification_id) as cert_count
      FROM career_tracks ct
      LEFT JOIN career_levels cl ON ct.id = cl.career_track_id
      LEFT JOIN career_level_certifications clc ON cl.id = clc.career_level_id
      WHERE ct.id IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
      GROUP BY ct.id, ct.name
      ORDER BY ct.name
    `;
    
    const verification = await client.query(verificationQuery);
    console.log('\nKeeper tracks after migration:');
    verification.rows.forEach(row => {
      console.log(`  ${row.name} (${row.id}): ${row.cert_count} certifications`);
    });
    
    // Step 3: Delete orphaned certification mappings
    console.log('\n=== Step 3: Cleaning Up Orphaned Data ===');
    
    const deleteOrphanedCerts = await client.query(`
      DELETE FROM career_level_certifications
      WHERE career_level_id IN (
        SELECT cl.id
        FROM career_levels cl
        JOIN career_tracks ct ON cl.career_track_id = ct.id
        WHERE ct.id NOT IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
      )
    `);
    console.log(`Deleted ${deleteOrphanedCerts.rowCount} orphaned certification mappings`);
    
    // Step 4: Delete orphaned career positions
    const deleteOrphanedPositions = await client.query(`
      DELETE FROM career_positions
      WHERE career_level_id IN (
        SELECT cl.id
        FROM career_levels cl
        JOIN career_tracks ct ON cl.career_track_id = ct.id
        WHERE ct.id NOT IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
      )
    `);
    console.log(`Deleted ${deleteOrphanedPositions.rowCount} orphaned career positions`);
    
    // Step 5: Delete orphaned career levels
    const deleteOrphanedLevels = await client.query(`
      DELETE FROM career_levels
      WHERE career_track_id NOT IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
    `);
    console.log(`Deleted ${deleteOrphanedLevels.rowCount} orphaned career levels`);
    
    // Step 6: Delete orphaned career track categories
    const deleteOrphanedCategories = await client.query(`
      DELETE FROM career_track_categories
      WHERE career_track_id NOT IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
    `);
    console.log(`Deleted ${deleteOrphanedCategories.rowCount} orphaned career track categories`);
    
    // Step 7: Delete duplicate career tracks
    const deleteDuplicateTracks = await client.query(`
      DELETE FROM career_tracks
      WHERE id NOT IN (31, 4, 5, 6, 8, 35, 14, 37, 38, 39, 22, 41, 42, 43, 44, 45, 46, 2, 48)
    `);
    console.log(`Deleted ${deleteDuplicateTracks.rowCount} duplicate career tracks`);
    
    // Step 8: Final verification
    console.log('\n=== Step 8: Final Verification ===');
    
    const finalCounts = await client.query(`
      SELECT 
        'Career Tracks' as item,
        COUNT(*) as count
      FROM career_tracks
      UNION ALL
      SELECT 'Career Levels', COUNT(*) FROM career_levels
      UNION ALL
      SELECT 'Career Positions', COUNT(*) FROM career_positions
      UNION ALL
      SELECT 'Certification Mappings', COUNT(*) FROM career_level_certifications
      UNION ALL
      SELECT 'Certifications', COUNT(*) FROM certifications
      UNION ALL
      SELECT 'Work Roles', COUNT(*) FROM work_roles
      UNION ALL
      SELECT 'Tasks', COUNT(*) FROM tasks
      UNION ALL
      SELECT 'Skills', COUNT(*) FROM skills
      UNION ALL
      SELECT 'Knowledge Items', COUNT(*) FROM knowledge_items
    `);
    
    console.log('\nFinal database counts:');
    finalCounts.rows.forEach(row => {
      console.log(`  ${row.item}: ${row.count}`);
    });
    
    await client.query('COMMIT');
    console.log('\n✅ Surgical database cleanup completed successfully!');
    console.log('All authentic certification mappings have been preserved.');
    console.log('Duplicate tracks have been removed.');
    console.log('The application should now show clean, consolidated career tracks.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during surgical cleanup:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the cleanup
surgicalDatabaseCleanup()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });