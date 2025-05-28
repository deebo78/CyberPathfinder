import XLSX from 'xlsx';
import { db } from './server/db.js';
import { careerTracks, careerTrackCategories, categories } from './shared/schema.js';
import { eq } from 'drizzle-orm';

const careerTracksData = [
  { "Career Track Name": "SOC Operations", "Related NICE Categories": "Protection & Defense" },
  { "Career Track Name": "Threat Intelligence", "Related NICE Categories": "Protection & Defense, Investigation" },
  { "Career Track Name": "Incident Response", "Related NICE Categories": "Protection & Defense" },
  { "Career Track Name": "Red Team Operations", "Related NICE Categories": "Protection & Defense" },
  { "Career Track Name": "Vulnerability Management", "Related NICE Categories": "Protection & Defense" },
  { "Career Track Name": "Digital Forensics", "Related NICE Categories": "Investigation" },
  { "Career Track Name": "Security Operations Management", "Related NICE Categories": "Protection & Defense" },
  { "Career Track Name": "GRC (Governance, Risk, Compliance)", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Cybersecurity Awareness & Training", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Cyber Policy & Legal Strategy", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Privacy & Data Protection", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Risk Analysis & Management", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Cybersecurity Architecture", "Related NICE Categories": "Design & Development, Oversight" },
  { "Career Track Name": "Secure Software Development", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "DevSecOps", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Cloud Security", "Related NICE Categories": "Implementation & Operation" },
  { "Career Track Name": "Network & Systems Administration", "Related NICE Categories": "Implementation & Operation" },
  { "Career Track Name": "Security Engineering", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Identity & Access Management (IAM)", "Related NICE Categories": "Implementation & Operation" },
  { "Career Track Name": "Database & Storage Security", "Related NICE Categories": "Implementation & Operation" },
  { "Career Track Name": "Operational Technology (OT) Security", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Cybercrime Investigation", "Related NICE Categories": "Investigation" },
  { "Career Track Name": "Cybersecurity Education", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Program & Project Management", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Executive Leadership (CISO Path)", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Technology Research & Innovation", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Security Tool Development", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Security Automation & Orchestration", "Related NICE Categories": "Design & Development" },
  { "Career Track Name": "Security Compliance Auditing", "Related NICE Categories": "Oversight & Governance" },
  { "Career Track Name": "Customer-Facing Security Roles", "Related NICE Categories": "Oversight & Governance" }
];

// Category name mapping to match database
const categoryMapping = {
  "Protection & Defense": "PROTECTION and DEFENSE",
  "Investigation": "INVESTIGATION",
  "Design & Development": "DESIGN and DEVELOPMENT", 
  "Implementation & Operation": "IMPLEMENTATION and OPERATION",
  "Oversight & Governance": "OVERSIGHT and GOVERNANCE",
  "Oversight": "OVERSIGHT and GOVERNANCE"
};

async function importCareerTracks() {
  try {
    console.log('Starting Career Tracks import...');
    
    // Get existing categories from database
    const existingCategories = await db.select().from(categories);
    console.log('Found categories:', existingCategories.map(c => c.name));
    
    for (const track of careerTracksData) {
      console.log(`\nProcessing: ${track["Career Track Name"]}`);
      
      // Insert career track
      const [insertedTrack] = await db
        .insert(careerTracks)
        .values({
          name: track["Career Track Name"],
          description: `Career pathway for ${track["Career Track Name"]} professionals`
        })
        .returning();
      
      console.log(`✓ Created career track: ${insertedTrack.name}`);
      
      // Parse and map categories
      const categoryNames = track["Related NICE Categories"]
        .split(',')
        .map(name => name.trim())
        .map(name => categoryMapping[name] || name);
      
      for (const categoryName of categoryNames) {
        const category = existingCategories.find(c => c.name === categoryName);
        if (category) {
          await db.insert(careerTrackCategories).values({
            careerTrackId: insertedTrack.id,
            categoryId: category.id
          });
          console.log(`  ✓ Linked to category: ${category.name}`);
        } else {
          console.log(`  ⚠ Category not found: ${categoryName}`);
        }
      }
    }
    
    console.log('\n🎉 Career Tracks import completed successfully!');
    
    // Summary
    const trackCount = await db.select().from(careerTracks);
    const linkCount = await db.select().from(careerTrackCategories);
    console.log(`\nSummary:`);
    console.log(`- Career Tracks: ${trackCount.length}`);
    console.log(`- Category Links: ${linkCount.length}`);
    
  } catch (error) {
    console.error('Error importing career tracks:', error);
  }
}

await importCareerTracks();