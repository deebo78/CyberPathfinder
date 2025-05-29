import { db } from './server/db.ts';
import { careerTracks, careerTrackCategories, careerLevels, careerPositions, categories, workRoles } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

const socOperationsData = [
  {
    "Career Level": "Entry-Level",
    "Title": "Cyber Defense Analyst",
    "NICE Work Role Code": "PD-WRL-001",
    "Notes": "Monitors, analyzes, and responds to cyber threats in real-time."
  },
  {
    "Career Level": "Mid-Level",
    "Title": "Threat Intelligence Analyst",
    "NICE Work Role Code": "PD-WRL-004",
    "Notes": "Develops threat intelligence to inform defensive actions."
  },
  {
    "Career Level": "Senior-Level",
    "Title": "SOC Manager",
    "NICE Work Role Code": "OV-WRL-002",
    "Notes": "Oversees SOC team operations, escalations, and KPIs."
  },
  {
    "Career Level": "Expert-Level",
    "Title": "Director of Security Operations",
    "NICE Work Role Code": "OV-WRL-004",
    "Notes": "Leads organizational security operations strategy."
  },
  {
    "Career Level": "Executive-Level",
    "Title": "Chief Information Security Officer (CISO)",
    "NICE Work Role Code": "OV-WRL-001",
    "Notes": "Executive leadership role with overall security oversight."
  }
];

async function importSOCOperations() {
  try {
    console.log('Starting SOC Operations Career Track import...');
    
    // Get Protection & Defense category
    const [protectionDefenseCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, 'PROTECTION and DEFENSE'));
    
    if (!protectionDefenseCategory) {
      throw new Error('Protection & Defense category not found');
    }
    
    // Create SOC Operations career track
    const [socTrack] = await db
      .insert(careerTracks)
      .values({
        name: 'SOC Operations',
        description: 'Security Operations Center career pathway focusing on real-time threat monitoring, analysis, and response',
        overview: 'Comprehensive career progression from entry-level analyst to executive security leadership roles'
      })
      .returning();
    
    console.log(`✓ Created career track: ${socTrack.name}`);
    
    // Link to Protection & Defense category
    await db.insert(careerTrackCategories).values({
      careerTrackId: socTrack.id,
      categoryId: protectionDefenseCategory.id
    });
    
    console.log('✓ Linked to Protection & Defense category');
    
    // Get all work roles for mapping
    const allWorkRoles = await db.select().from(workRoles);
    
    // Process each career level and position
    const levelNames = [...new Set(socOperationsData.map(item => item["Career Level"]))];
    
    for (let i = 0; i < levelNames.length; i++) {
      const levelName = levelNames[i];
      
      // Create career level
      const [careerLevel] = await db
        .insert(careerLevels)
        .values({
          careerTrackId: socTrack.id,
          name: levelName,
          sortOrder: i + 1,
          description: `${levelName} positions in SOC Operations`
        })
        .returning();
      
      console.log(`✓ Created career level: ${levelName}`);
      
      // Add positions for this level
      const levelPositions = socOperationsData.filter(item => item["Career Level"] === levelName);
      
      for (const position of levelPositions) {
        // Find matching NICE work role
        const niceWorkRole = allWorkRoles.find(wr => wr.code === position["NICE Work Role Code"]);
        
        await db.insert(careerPositions).values({
          careerLevelId: careerLevel.id,
          jobTitle: position.Title,
          niceWorkRoleId: niceWorkRole?.id || null,
          description: position.Notes,
          notes: niceWorkRole ? `Maps to NICE work role: ${niceWorkRole.name}` : 'Custom position title'
        });
        
        console.log(`  ✓ Added position: ${position.Title} ${niceWorkRole ? `(${niceWorkRole.code})` : '(custom)'}`);
      }
    }
    
    console.log('\nSOC Operations Career Track import completed successfully!');
    
    // Summary
    const levelCount = await db.select().from(careerLevels).where(eq(careerLevels.careerTrackId, socTrack.id));
    const positionCount = await db
      .select()
      .from(careerPositions)
      .innerJoin(careerLevels, eq(careerPositions.careerLevelId, careerLevels.id))
      .where(eq(careerLevels.careerTrackId, socTrack.id));
    
    console.log(`\nSummary:`);
    console.log(`- Career Track: ${socTrack.name}`);
    console.log(`- Career Levels: ${levelCount.length}`);
    console.log(`- Career Positions: ${positionCount.length}`);
    
  } catch (error) {
    console.error('Error importing SOC Operations career track:', error);
  }
}

await importSOCOperations();