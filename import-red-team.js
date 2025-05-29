import { db } from './server/db.ts';
import { careerTracks, careerTrackCategories, careerLevels, careerPositions, categories } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

const redTeamData = [
  {
    "Career Level": "Mid-Level",
    "Work Role Title": "Red Team Operator (Associate) / Penetration Tester / Exp",
    "Notes": "Conducts penetration tests and participates in red team engagements under supervision. Focuses on executing defined tactics, techniques, and procedures (TTPs) and documenting findings."
  },
  {
    "Career Level": "Senior-Level", 
    "Work Role Title": "Red Team Operator / Exploitation Analyst",
    "Notes": "Leads complex penetration tests and red team engagements. Develops custom exploits, advanced TTPs, and innovative attack methodologies. Mentors junior operators."
  },
  {
    "Career Level": "Expert-Level",
    "Work Role Title": "Red Team Lead / Offensive Cyber Operations Lead", 
    "Notes": "Plans, scopes, and directs full-scope red team engagements and advanced adversary simulations. Manages the red team's capabilities, methodologies, and reporting. Provides technical leadership."
  },
  {
    "Career Level": "Executive-Level",
    "Work Role Title": "Director of Offensive Security / Head of Red Team Operations",
    "Notes": "Establishes the vision, strategy, and budget for the organization's offensive security program. Ensures alignment with enterprise risk and communicates program value to executive leadership."
  }
];

async function importRedTeamOperations() {
  try {
    console.log('Starting Red Team Operations Career Track import...');
    
    // Get Protection & Defense category
    const [protectionDefenseCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, 'PROTECTION and DEFENSE'));
    
    if (!protectionDefenseCategory) {
      throw new Error('Protection & Defense category not found');
    }
    
    // Create Red Team Operations career track
    const [redTeamTrack] = await db
      .insert(careerTracks)
      .values({
        name: 'Red Team Operations',
        description: 'Offensive security career pathway focusing on adversary simulation, penetration testing, and red team engagements',
        overview: 'Specialized progression for offensive security professionals from associate-level operators to executive leadership'
      })
      .returning();
    
    console.log(`✓ Created career track: ${redTeamTrack.name}`);
    
    // Link to Protection & Defense category
    await db.insert(careerTrackCategories).values({
      careerTrackId: redTeamTrack.id,
      categoryId: protectionDefenseCategory.id
    });
    
    console.log('✓ Linked to Protection & Defense category');
    
    // Process each career level and position
    const levelNames = [...new Set(redTeamData.map(item => item["Career Level"]))];
    
    for (let i = 0; i < levelNames.length; i++) {
      const levelName = levelNames[i];
      
      // Create career level with appropriate sort order (starting from 2 since Mid-Level is the entry point)
      const sortOrder = levelName === 'Mid-Level' ? 2 : 
                       levelName === 'Senior-Level' ? 3 :
                       levelName === 'Expert-Level' ? 4 : 5;
      
      const [careerLevel] = await db
        .insert(careerLevels)
        .values({
          careerTrackId: redTeamTrack.id,
          name: levelName,
          sortOrder: sortOrder,
          description: `${levelName} positions in Red Team Operations`
        })
        .returning();
      
      console.log(`✓ Created career level: ${levelName}`);
      
      // Add positions for this level
      const levelPositions = redTeamData.filter(item => item["Career Level"] === levelName);
      
      for (const position of levelPositions) {
        await db.insert(careerPositions).values({
          careerLevelId: careerLevel.id,
          jobTitle: position["Work Role Title"],
          niceWorkRoleId: null, // Red team roles are typically custom positions
          description: position.Notes,
          notes: 'Offensive security specialization - custom position title'
        });
        
        console.log(`  ✓ Added position: ${position["Work Role Title"]}`);
      }
    }
    
    console.log('\nRed Team Operations Career Track import completed successfully!');
    
    // Summary
    const levelCount = await db.select().from(careerLevels).where(eq(careerLevels.careerTrackId, redTeamTrack.id));
    const positionCount = await db
      .select()
      .from(careerPositions)
      .innerJoin(careerLevels, eq(careerPositions.careerLevelId, careerLevels.id))
      .where(eq(careerLevels.careerTrackId, redTeamTrack.id));
    
    console.log(`\nSummary:`);
    console.log(`- Career Track: ${redTeamTrack.name}`);
    console.log(`- Career Levels: ${levelCount.length}`);
    console.log(`- Career Positions: ${positionCount.length}`);
    
  } catch (error) {
    console.error('Error importing Red Team Operations career track:', error);
  }
}

await importRedTeamOperations();