import XLSX from 'xlsx';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

interface WorkRole {
  name: string;
  description: string;
  code: string;
  category: string;
  categoryCode: string;
}

interface TKSStatement {
  code: string;
  description: string;
  level: string;
  justification: string;
}

interface WorkRoleTKS {
  workRoleCode: string;
  tksCode: string;
  proficiencyLevel: string | null; // null for "All Levels"
}

const LEVEL_MAPPING = {
  'Entry-Level': 'Entry-Level',
  'Mid-Level': 'Mid-Level',
  'Senior-Level': 'Senior-Level',
  'Expert/Lead': 'Expert/Lead',
  'All Levels': null // Will be expanded to all 4 levels
};

export async function importNICEv2() {
  console.log('=== IMPORTING NICE FRAMEWORK v2.0.0 ===\n');
  
  const filePath = 'attached_assets/NICE_Framework_Components_v2_0_0_with_levels_1763069314789.xlsx';
  const workbook = XLSX.readFile(filePath);
  
  // Step 1: Extract Work Roles from main sheet
  const workRoles = extractWorkRoles(workbook);
  console.log(`✓ Extracted ${workRoles.length} work roles\n`);
  
  // Step 2: Extract TKS Statements
  const tksStatements = extractTKSStatements(workbook);
  console.log(`✓ Extracted ${tksStatements.length} TKS statements\n`);
  
  // Step 3: Extract Work Role → TKS mappings
  const workRoleTKS = extractWorkRoleTKSMappings(workbook, workRoles);
  console.log(`✓ Extracted ${workRoleTKS.length} work role TKS mappings\n`);
  
  // Step 4: Import Categories
  await importCategories();
  
  // Step 5: Import Work Roles
  await importWorkRoles(workRoles);
  
  // Step 6: Import TKS Statements
  await importTKSStatements(tksStatements);
  
  // Step 7: Map TKS to Work Roles
  await mapTKSToWorkRoles(workRoleTKS);
  
  // Step 8: Create Career Tracks from Work Roles
  await createCareerTracks();
  
  // Step 9: Create Career Levels (4 levels per track)
  await createCareerLevels();
  
  // Step 10: Map TKS to Career Levels
  await mapTKSToCareerLevels();
  
  console.log('\n✅ NICE v2.0.0 import completed successfully!');
}

function extractWorkRoles(workbook: XLSX.WorkBook): WorkRole[] {
  const sheet = workbook.Sheets['v2.0.0 Work Roles + Categories'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  
  const workRoles: WorkRole[] = [];
  let currentCategory = '';
  let currentCategoryCode = '';
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Category row detection
    if (row[0] && row[0].includes('(') && row[0].includes(')') && !row[2]) {
      const match = row[0].match(/^(.*?)\s*\((.*?)\)/);
      if (match) {
        currentCategory = match[1].trim();
        currentCategoryCode = match[2].trim();
      }
    }
    // Work role row
    else if (row[2]) {
      workRoles.push({
        name: row[0],
        description: row[1],
        code: row[2],
        category: currentCategory,
        categoryCode: currentCategoryCode
      });
    }
  }
  
  return workRoles;
}

function extractTKSStatements(workbook: XLSX.WorkBook): TKSStatement[] {
  const sheet = workbook.Sheets['v2.0.0 TKS Statements'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  
  const tksStatements: TKSStatement[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      tksStatements.push({
        code: row[0],
        level: row[1],
        description: row[2],
        justification: row[3] || ''
      });
    }
  }
  
  return tksStatements;
}

function extractWorkRoleTKSMappings(workbook: XLSX.WorkBook, workRoles: WorkRole[]): WorkRoleTKS[] {
  const mappings: WorkRoleTKS[] = [];
  
  for (const workRole of workRoles) {
    const sheet = workbook.Sheets[workRole.code];
    if (!sheet) {
      console.warn(`Warning: No sheet found for work role ${workRole.code}`);
      continue;
    }
    
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Find the header row (contains "v2.0.0 TKS ID")
    let headerRow = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'v2.0.0 TKS ID') {
        headerRow = i;
        break;
      }
    }
    
    if (headerRow === -1) continue;
    
    // Extract TKS mappings
    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        const tksCode = row[0];
        const level = row[2]; // Assigned Level column
        
        let proficiencyLevel = LEVEL_MAPPING[level as keyof typeof LEVEL_MAPPING];
        
        // Handle "All Levels" by expanding to all 4 levels
        if (level === 'All Levels') {
          ['Entry-Level', 'Mid-Level', 'Senior-Level', 'Expert/Lead'].forEach(lvl => {
            mappings.push({
              workRoleCode: workRole.code,
              tksCode: tksCode,
              proficiencyLevel: lvl
            });
          });
        } else {
          mappings.push({
            workRoleCode: workRole.code,
            tksCode: tksCode,
            proficiencyLevel: proficiencyLevel || level
          });
        }
      }
    }
  }
  
  return mappings;
}

async function importCategories() {
  console.log('Importing categories...');
  
  const categories = [
    { code: 'OG', name: 'Oversight and Governance', description: 'Provides leadership, management, direction, and advocacy so the organization may effectively manage cybersecurity-related risks to the enterprise and conduct cybersecurity work.' },
    { code: 'DD', name: 'Design and Development', description: 'Develops and designs secure systems, applications, and tools.' },
    { code: 'IO', name: 'Implementation and Operation', description: 'Implements, operates, and maintains secure systems and tools.' },
    { code: 'PD', name: 'Protection and Defense', description: 'Protects and defends systems, networks, and data.' },
    { code: 'IN', name: 'Investigation', description: 'Investigates cybersecurity incidents and crimes.' }
  ];
  
  // Use UPSERT to insert or update categories without deleting
  for (const cat of categories) {
    await sql`
      INSERT INTO categories (code, name, description)
      VALUES (${cat.code}, ${cat.name}, ${cat.description})
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description
    `;
  }
  
  console.log(`✓ Imported ${categories.length} categories`);
}

async function importWorkRoles(workRoles: WorkRole[]) {
  console.log('\nImporting work roles...');
  
  for (const wr of workRoles) {
    // Get category ID
    const category = await sql`SELECT id FROM categories WHERE code = ${wr.categoryCode}`;
    if (category.length === 0) {
      console.warn(`Warning: Category ${wr.categoryCode} not found for work role ${wr.code}`);
      continue;
    }
    
    await sql`
      INSERT INTO work_roles (code, name, description, category_id)
      VALUES (${wr.code}, ${wr.name}, ${wr.description}, ${category[0].id})
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category_id = EXCLUDED.category_id
    `;
  }
  
  console.log(`✓ Imported ${workRoles.length} work roles`);
}

async function importTKSStatements(tksStatements: TKSStatement[]) {
  console.log('\nImporting TKS statements...');
  
  let tasks = 0, knowledge = 0, skills = 0;
  
  for (const tks of tksStatements) {
    const type = tks.code.charAt(0);
    
    if (type === 'T') {
      await sql`
        INSERT INTO tasks (code, description)
        VALUES (${tks.code}, ${tks.description})
        ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description
      `;
      tasks++;
    } else if (type === 'K') {
      await sql`
        INSERT INTO knowledge_items (code, description)
        VALUES (${tks.code}, ${tks.description})
        ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description
      `;
      knowledge++;
    } else if (type === 'S') {
      await sql`
        INSERT INTO skills (code, description)
        VALUES (${tks.code}, ${tks.description})
        ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description
      `;
      skills++;
    }
  }
  
  console.log(`✓ Imported ${tasks} tasks, ${knowledge} knowledge items, ${skills} skills`);
}

async function mapTKSToWorkRoles(mappings: WorkRoleTKS[]) {
  console.log('\nMapping TKS to work roles...');
  
  // Get all work role IDs and codes
  const workRoles = await sql`SELECT id, code FROM work_roles`;
  const workRoleMap = new Map(workRoles.map(wr => [wr.code, wr.id]));
  
  // Get all TKS IDs and codes
  const tasks = await sql`SELECT id, code FROM tasks`;
  const knowledge = await sql`SELECT id, code FROM knowledge_items`;
  const skills = await sql`SELECT id, code FROM skills`;
  
  const taskMap = new Map(tasks.map(t => [t.code, t.id]));
  const knowledgeMap = new Map(knowledge.map(k => [k.code, k.id]));
  const skillMap = new Map(skills.map(s => [s.code, s.id]));
  
  // Clear existing mappings
  const workRoleIds = Array.from(workRoleMap.values());
  if (workRoleIds.length > 0) {
    await sql`DELETE FROM work_role_tasks WHERE work_role_id = ANY(${workRoleIds})`;
    await sql`DELETE FROM work_role_knowledge WHERE work_role_id = ANY(${workRoleIds})`;
    await sql`DELETE FROM work_role_skills WHERE work_role_id = ANY(${workRoleIds})`;
  }
  
  // Prepare batch inserts
  const taskInserts: any[] = [];
  const knowledgeInserts: any[] = [];
  const skillInserts: any[] = [];
  
  for (const mapping of mappings) {
    const workRoleId = workRoleMap.get(mapping.workRoleCode);
    if (!workRoleId) continue;
    
    const type = mapping.tksCode.charAt(0);
    
    if (type === 'T') {
      const taskId = taskMap.get(mapping.tksCode);
      if (taskId) {
        taskInserts.push({
          work_role_id: workRoleId,
          task_id: taskId,
          proficiency_level: mapping.proficiencyLevel
        });
      }
    } else if (type === 'K') {
      const knowledgeId = knowledgeMap.get(mapping.tksCode);
      if (knowledgeId) {
        knowledgeInserts.push({
          work_role_id: workRoleId,
          knowledge_item_id: knowledgeId,
          proficiency_level: mapping.proficiencyLevel
        });
      }
    } else if (type === 'S') {
      const skillId = skillMap.get(mapping.tksCode);
      if (skillId) {
        skillInserts.push({
          work_role_id: workRoleId,
          skill_id: skillId,
          proficiency_level: mapping.proficiencyLevel
        });
      }
    }
  }
  
  // Insert in smaller batches to avoid query size limits
  console.log(`Inserting ${taskInserts.length} task mappings...`);
  for (const insert of taskInserts) {
    await sql`
      INSERT INTO work_role_tasks (work_role_id, task_id, proficiency_level)
      VALUES (${insert.work_role_id}, ${insert.task_id}, ${insert.proficiency_level})
    `;
  }
  
  console.log(`Inserting ${knowledgeInserts.length} knowledge mappings...`);
  for (const insert of knowledgeInserts) {
    await sql`
      INSERT INTO work_role_knowledge (work_role_id, knowledge_item_id, proficiency_level)
      VALUES (${insert.work_role_id}, ${insert.knowledge_item_id}, ${insert.proficiency_level})
    `;
  }
  
  console.log(`Inserting ${skillInserts.length} skill mappings...`);
  for (const insert of skillInserts) {
    await sql`
      INSERT INTO work_role_skills (work_role_id, skill_id, proficiency_level)
      VALUES (${insert.work_role_id}, ${insert.skill_id}, ${insert.proficiency_level})
    `;
  }
  
  console.log(`✓ Created ${taskInserts.length} task mappings, ${knowledgeInserts.length} knowledge mappings, ${skillInserts.length} skill mappings`);
}

async function createCareerTracks() {
  console.log('\nCreating career tracks from work roles...');
  
  const workRoles = await sql`SELECT id, code, name, description FROM work_roles ORDER BY code`;
  
  // Don't delete existing career tracks - just insert new ones with UPSERT
  for (const wr of workRoles) {
    await sql`
      INSERT INTO career_tracks (name, description, overview)
      VALUES (${wr.name}, ${wr.description}, ${`NICE Framework Work Role: ${wr.code}`})
      ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        overview = EXCLUDED.overview
    `;
  }
  
  console.log(`✓ Created ${workRoles.length} career tracks`);
}

async function createCareerLevels() {
  console.log('\nCreating career levels...');
  
  const careerTracks = await sql`SELECT id, name FROM career_tracks ORDER BY id`;
  const levels = [
    { name: 'Entry-Level', sort: 1, experience: '0-2 years', description: 'Entry-level professionals learning core cybersecurity fundamentals' },
    { name: 'Mid-Level', sort: 2, experience: '3-5 years', description: 'Mid-level professionals with established technical skills' },
    { name: 'Senior-Level', sort: 3, experience: '6-10 years', description: 'Senior professionals with deep expertise and leadership capabilities' },
    { name: 'Expert/Lead', sort: 4, experience: '10+ years', description: 'Expert-level professionals and technical leaders' }
  ];
  
  let count = 0;
  for (const track of careerTracks) {
    for (const level of levels) {
      // Check if this career level already exists
      const existing = await sql`
        SELECT id FROM career_levels 
        WHERE career_track_id = ${track.id} AND name = ${level.name}
      `;
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO career_levels (career_track_id, name, experience_range, description, sort_order)
          VALUES (${track.id}, ${level.name}, ${level.experience}, ${level.description}, ${level.sort})
        `;
        count++;
      }
    }
  }
  
  console.log(`✓ Created ${count} new career levels (4 per track)`);
}

async function mapTKSToCareerLevels() {
  console.log('\nMapping TKS to career levels...');
  
  const careerTracks = await sql`SELECT id, name FROM career_tracks ORDER BY id`;
  const taskInserts: any[] = [];
  const knowledgeInserts: any[] = [];
  const skillInserts: any[] = [];
  
  for (const track of careerTracks) {
    // Find corresponding work role (skip if this is a legacy track without a work role)
    const workRole = await sql`SELECT id FROM work_roles WHERE name = ${track.name}`;
    if (workRole.length === 0) continue;
    
    const workRoleId = workRole[0].id;
    
    // Get career levels for this track
    const levels = await sql`SELECT id, name FROM career_levels WHERE career_track_id = ${track.id}`;
    
    // Clear existing mappings for these career levels
    if (levels.length > 0) {
      const levelIds = levels.map(l => l.id);
      await sql`DELETE FROM career_level_tasks WHERE career_level_id = ANY(${levelIds}) AND source = 'inherited'`;
      await sql`DELETE FROM career_level_knowledge WHERE career_level_id = ANY(${levelIds}) AND source = 'inherited'`;
      await sql`DELETE FROM career_level_skills WHERE career_level_id = ANY(${levelIds}) AND source = 'inherited'`;
    }
    
    for (const level of levels) {
      // Get tasks for this level
      const tasks = await sql`
        SELECT task_id FROM work_role_tasks 
        WHERE work_role_id = ${workRoleId} 
        AND (proficiency_level = ${level.name} OR proficiency_level IS NULL)
      `;
      
      for (const task of tasks) {
        taskInserts.push({
          career_level_id: level.id,
          task_id: task.task_id,
          importance: 'required',
          source: 'inherited'
        });
      }
      
      // Get knowledge for this level
      const knowledge = await sql`
        SELECT knowledge_item_id FROM work_role_knowledge 
        WHERE work_role_id = ${workRoleId} 
        AND (proficiency_level = ${level.name} OR proficiency_level IS NULL)
      `;
      
      for (const k of knowledge) {
        knowledgeInserts.push({
          career_level_id: level.id,
          knowledge_item_id: k.knowledge_item_id,
          importance: 'required',
          source: 'inherited'
        });
      }
      
      // Get skills for this level
      const skills = await sql`
        SELECT skill_id FROM work_role_skills 
        WHERE work_role_id = ${workRoleId} 
        AND (proficiency_level = ${level.name} OR proficiency_level IS NULL)
      `;
      
      for (const s of skills) {
        skillInserts.push({
          career_level_id: level.id,
          skill_id: s.skill_id,
          importance: 'required',
          source: 'inherited'
        });
      }
    }
  }
  
  // Insert career level mappings
  console.log(`Inserting ${taskInserts.length} task mappings for career levels...`);
  for (const insert of taskInserts) {
    await sql`
      INSERT INTO career_level_tasks (career_level_id, task_id, importance, source)
      VALUES (${insert.career_level_id}, ${insert.task_id}, ${insert.importance}, ${insert.source})
    `;
  }
  
  console.log(`Inserting ${knowledgeInserts.length} knowledge mappings for career levels...`);
  for (const insert of knowledgeInserts) {
    await sql`
      INSERT INTO career_level_knowledge (career_level_id, knowledge_item_id, importance, source)
      VALUES (${insert.career_level_id}, ${insert.knowledge_item_id}, ${insert.importance}, ${insert.source})
    `;
  }
  
  console.log(`Inserting ${skillInserts.length} skill mappings for career levels...`);
  for (const insert of skillInserts) {
    await sql`
      INSERT INTO career_level_skills (career_level_id, skill_id, importance, source)
      VALUES (${insert.career_level_id}, ${insert.skill_id}, ${insert.importance}, ${insert.source})
    `;
  }
  
  console.log(`✓ Created ${taskInserts.length} task mappings, ${knowledgeInserts.length} knowledge mappings, ${skillInserts.length} skill mappings`);
}

// Run the import
importNICEv2()
  .then(() => {
    console.log('\n✅ Import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
