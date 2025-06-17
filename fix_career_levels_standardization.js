import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixCareerLevelsStandardization() {
  console.log('🔧 Fixing career levels standardization...');
  
  try {
    // First, identify all tracks with mixed legacy and standard levels
    const problemTracks = await pool.query(`
      SELECT 
        ct.id as track_id,
        ct.name as track_name,
        COUNT(cl.id) as level_count
      FROM career_tracks ct
      LEFT JOIN career_levels cl ON ct.id = cl.career_track_id
      GROUP BY ct.id, ct.name
      HAVING COUNT(cl.id) > 5
      ORDER BY level_count DESC
    `);

    console.log(`\n📊 Found ${problemTracks.rows.length} tracks with more than 5 levels:`);
    problemTracks.rows.forEach(track => {
      console.log(`   - ${track.track_name}: ${track.level_count} levels`);
    });

    // Get detailed breakdown for each problem track
    for (const track of problemTracks.rows) {
      console.log(`\n🔍 Analyzing track: ${track.track_name} (ID: ${track.track_id})`);
      
      const levels = await pool.query(`
        SELECT id, name, sort_order
        FROM career_levels
        WHERE career_track_id = $1
        ORDER BY sort_order
      `, [track.track_id]);

      console.log('   Current levels:');
      levels.rows.forEach(level => {
        const isStandard = ['Entry-Level', 'Mid-Level', 'Senior-Level', 'Expert-Level', 'Executive-Level'].includes(level.name);
        console.log(`     ${level.id}: ${level.name} (${isStandard ? 'STANDARD' : 'LEGACY'})`);
      });
    }

    // Remove all legacy job-specific levels, keeping only the 5 standard levels
    console.log('\n🗑️  Removing legacy job-specific levels...');
    
    const deleteResult = await pool.query(`
      DELETE FROM career_levels 
      WHERE name NOT IN ('Entry-Level', 'Mid-Level', 'Senior-Level', 'Expert-Level', 'Executive-Level')
    `);

    console.log(`✅ Removed ${deleteResult.rowCount} legacy job-specific levels`);

    // Also clean up any certification mappings that might reference deleted levels
    console.log('\n🧹 Cleaning up orphaned certification mappings...');
    
    const cleanupResult = await pool.query(`
      DELETE FROM career_level_certifications 
      WHERE career_level_id NOT IN (SELECT id FROM career_levels)
    `);

    console.log(`✅ Cleaned up ${cleanupResult.rowCount} orphaned certification mappings`);

    // Verify the fix
    console.log('\n✅ Verifying standardization...');
    
    const verifyResult = await pool.query(`
      SELECT 
        ct.id as track_id,
        ct.name as track_name,
        COUNT(cl.id) as level_count
      FROM career_tracks ct
      LEFT JOIN career_levels cl ON ct.id = cl.career_track_id
      GROUP BY ct.id, ct.name
      HAVING COUNT(cl.id) != 5
      ORDER BY level_count DESC
    `);

    if (verifyResult.rows.length === 0) {
      console.log('🎉 SUCCESS: All tracks now have exactly 5 standardized levels!');
    } else {
      console.log('⚠️  WARNING: Some tracks still have non-standard level counts:');
      verifyResult.rows.forEach(track => {
        console.log(`   - ${track.track_name}: ${track.level_count} levels`);
      });
    }

    // Final summary
    const finalCount = await pool.query(`
      SELECT COUNT(*) as total_levels FROM career_levels
    `);

    const tracksCount = await pool.query(`
      SELECT COUNT(*) as total_tracks FROM career_tracks
    `);

    console.log('\n📈 FINAL SUMMARY:');
    console.log(`   Total tracks: ${tracksCount.rows[0].total_tracks}`);
    console.log(`   Total levels: ${finalCount.rows[0].total_levels}`);
    console.log(`   Expected levels: ${tracksCount.rows[0].total_tracks * 5}`);
    console.log(`   Status: ${finalCount.rows[0].total_levels == tracksCount.rows[0].total_tracks * 5 ? 'PERFECT' : 'NEEDS ATTENTION'}`);

  } catch (error) {
    console.error('❌ Error fixing career levels:', error);
  } finally {
    await pool.end();
  }
}

fixCareerLevelsStandardization();