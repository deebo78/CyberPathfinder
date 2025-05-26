import { storage } from "./storage";
import { 
  type InsertCategory, 
  type InsertSpecialtyArea, 
  type InsertWorkRole,
  type InsertTask,
  type InsertKnowledgeItem,
  type InsertSkill,
  type InsertAbility
} from "@shared/schema";

// NICE Framework official data sources
const NICE_FRAMEWORK_BASE_URL = "https://niccs.cisa.gov/sites/default/files/documents/csv";

interface NiceWorkRole {
  "Work Role ID": string;
  "Work Role": string;
  "Work Role Description": string;
  "Specialty Area": string;
  "Category": string;
  "OPM Code": string;
}

interface NiceTask {
  "Task ID": string;
  "Task Description": string;
}

interface NiceKnowledge {
  "Knowledge ID": string;
  "Knowledge Description": string;
}

interface NiceSkill {
  "Skill ID": string;
  "Skill Description": string;
}

interface NiceAbility {
  "Ability ID": string;
  "Ability Description": string;
}

export class NiceFrameworkImporter {
  public async importFromJsonFile(jsonData: any): Promise<void> {
    try {
      console.log("Starting NICE Framework import from JSON file...");
      
      // First, create categories and specialty areas from the existing hardcoded data
      const categoryMap = await this.importCategories();
      const specialtyAreaMap = await this.importSpecialtyAreas(categoryMap);
      
      // Now import the actual framework data from the JSON
      let recordsImported = categoryMap.size + specialtyAreaMap.size;
      
      // Import work roles if present
      if (jsonData.workRoles && Array.isArray(jsonData.workRoles)) {
        for (const role of jsonData.workRoles) {
          try {
            const specialtyAreaId = specialtyAreaMap.get(role.specialtyAreaCode) || null;
            const categoryId = categoryMap.get(role.categoryCode) || null;
            
            await storage.createWorkRole({
              code: role.code || role.id,
              name: role.name || role.title,
              description: role.description || role.summary || "",
              specialtyAreaId,
              categoryId
            });
            recordsImported++;
          } catch (error) {
            console.error(`Error importing work role ${role.code}:`, error);
          }
        }
      }
      
      // Import tasks if present
      if (jsonData.tasks && Array.isArray(jsonData.tasks)) {
        for (const task of jsonData.tasks) {
          try {
            await storage.createTask({
              code: task.code || task.id,
              description: task.description || task.text || ""
            });
            recordsImported++;
          } catch (error) {
            console.error(`Error importing task ${task.code}:`, error);
          }
        }
      }
      
      // Import knowledge items if present
      if (jsonData.knowledge && Array.isArray(jsonData.knowledge)) {
        for (const knowledge of jsonData.knowledge) {
          try {
            await storage.createKnowledgeItem({
              code: knowledge.code || knowledge.id,
              description: knowledge.description || knowledge.text || ""
            });
            recordsImported++;
          } catch (error) {
            console.error(`Error importing knowledge item ${knowledge.code}:`, error);
          }
        }
      }
      
      // Import skills if present
      if (jsonData.skills && Array.isArray(jsonData.skills)) {
        for (const skill of jsonData.skills) {
          try {
            await storage.createSkill({
              code: skill.code || skill.id,
              description: skill.description || skill.text || ""
            });
            recordsImported++;
          } catch (error) {
            console.error(`Error importing skill ${skill.code}:`, error);
          }
        }
      }
      
      // Import abilities if present
      if (jsonData.abilities && Array.isArray(jsonData.abilities)) {
        for (const ability of jsonData.abilities) {
          try {
            await storage.createAbility({
              code: ability.code || ability.id,
              description: ability.description || ability.text || ""
            });
            recordsImported++;
          } catch (error) {
            console.error(`Error importing ability ${ability.code}:`, error);
          }
        }
      }
      
      // Record the successful import
      await storage.createImportHistory({
        filename: "NICE_Framework_JSON_Upload",
        importType: "complete",
        recordsImported,
        status: "completed",
        metadata: { 
          source: "JSON file upload",
          categories: categoryMap.size,
          specialtyAreas: specialtyAreaMap.size,
          workRoles: jsonData.workRoles?.length || 0,
          tasks: jsonData.tasks?.length || 0,
          knowledge: jsonData.knowledge?.length || 0,
          skills: jsonData.skills?.length || 0,
          abilities: jsonData.abilities?.length || 0,
          importedAt: new Date().toISOString()
        }
      });
      
      console.log(`NICE Framework import completed! Imported ${recordsImported} records.`);
      
    } catch (error) {
      console.error("Error during NICE Framework import:", error);
      
      await storage.createImportHistory({
        filename: "NICE_Framework_JSON_Upload",
        importType: "complete",
        recordsImported: 0,
        status: "failed",
        metadata: { 
          error: error instanceof Error ? error.message : "Unknown error",
          failedAt: new Date().toISOString()
        }
      });
      
      throw error;
    }
  }

  private parseCsv(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }

  private async importCategories(): Promise<Map<string, number>> {
    console.log("Importing NICE Framework Categories...");
    
    // NICE Framework has 7 main categories
    const categories = [
      { code: "SP", name: "Securely Provision", description: "Conceptualizes, designs, procures, and/or builds secure information technology (IT) systems, with responsibility for aspects of system and/or network development." },
      { code: "OM", name: "Operate and Maintain", description: "Provides the support, administration, and maintenance necessary to ensure effective and efficient information technology (IT) system performance and security." },
      { code: "OV", name: "Oversee and Govern", description: "Provides leadership, management, direction, or development and advocacy so the organization may effectively conduct cybersecurity work." },
      { code: "PR", name: "Protect and Defend", description: "Identifies, analyzes, and mitigates threats to internal information technology (IT) systems and/or networks." },
      { code: "AN", name: "Analyze", description: "Performs highly-specialized review and evaluation of incoming cybersecurity information to determine its usefulness for intelligence." },
      { code: "CO", name: "Collect and Operate", description: "Provides specialized denial and deception operations and collection of cybersecurity information that may be used to develop intelligence." },
      { code: "IN", name: "Investigate", description: "Investigates cybersecurity events or crimes related to information technology (IT) systems, networks, and digital evidence." }
    ];

    const categoryMap = new Map<string, number>();
    
    for (const category of categories) {
      try {
        const created = await storage.createCategory(category);
        categoryMap.set(category.code, created.id);
        console.log(`Created category: ${category.code} - ${category.name}`);
      } catch (error) {
        console.error(`Error creating category ${category.code}:`, error);
      }
    }

    return categoryMap;
  }

  private async importSpecialtyAreas(categoryMap: Map<string, number>): Promise<Map<string, number>> {
    console.log("Importing NICE Framework Specialty Areas...");
    
    // NICE Framework specialty areas mapped to categories
    const specialtyAreas = [
      // Securely Provision (SP)
      { code: "SP-ARC", name: "Technology Architecture", description: "Develops system concepts and works on the capabilities phases of the systems development life cycle.", categoryCode: "SP" },
      { code: "SP-DEV", name: "Systems Development", description: "Works on the development phases of the systems development life cycle.", categoryCode: "SP" },
      { code: "SP-SYS", name: "Systems Architecture", description: "Develops system concepts and works on the capabilities phases of the systems development life cycle.", categoryCode: "SP" },
      { code: "SP-TES", name: "Test and Evaluation", description: "Develops and conducts tests of systems to evaluate compliance with specifications and requirements.", categoryCode: "SP" },
      { code: "SP-SRM", name: "Systems Requirements Planning", description: "Consults with customers to evaluate functional requirements and translate functional requirements into technical solutions.", categoryCode: "SP" },
      
      // Operate and Maintain (OM)
      { code: "OM-DTA", name: "Data Administration", description: "Develops and administers databases and/or data management systems.", categoryCode: "OM" },
      { code: "OM-KMG", name: "Knowledge Management", description: "Manages and administers processes and tools that enable the organization to identify, document, and access intellectual capital and information content.", categoryCode: "OM" },
      { code: "OM-STS", name: "Customer Service and Technical Support", description: "Addresses problems; installs, configures, troubleshoots, and provides maintenance and training in response to customer requirements or inquiries.", categoryCode: "OM" },
      { code: "OM-NET", name: "Network Services", description: "Installs, configures, tests, operates, maintains, and manages networks and their firewalls.", categoryCode: "OM" },
      { code: "OM-ADM", name: "Systems Administration", description: "Installs, configures, troubleshoots, and maintains server configurations and server applications.", categoryCode: "OM" },
      
      // Oversee and Govern (OV)
      { code: "OV-EXL", name: "Executive Cyber Leadership", description: "Executes decision-making authorities and establishes vision and direction for an organization's cyber and cyber-related policies, resources, and/or operations.", categoryCode: "OV" },
      { code: "OV-PMA", name: "Program/Project Management and Acquisition", description: "Applies knowledge of data communications hardware and software, human factors, and database design to plan, conduct, and coordinate the development and implementation of information technology architecture for the enterprise.", categoryCode: "OV" },
      { code: "OV-SPP", name: "Strategic Planning and Policy", description: "Develops policies, plans, procedures, requirements, and standards related to cybersecurity.", categoryCode: "OV" },
      { code: "OV-TRA", name: "Training, Education, and Awareness", description: "Conducts training of personnel within the enterprise.", categoryCode: "OV" },
      { code: "OV-GRC", name: "Cybersecurity Management", description: "Oversees the cybersecurity program of an information system in or outside the network environment.", categoryCode: "OV" },
      { code: "OV-LGA", name: "Legal Advice and Advocacy", description: "Provides legally sound advice and recommendations to leadership and staff on a variety of relevant topics within the pertinent subject domain.", categoryCode: "OV" },
      
      // Protect and Defend (PR)
      { code: "PR-CIR", name: "Cyber Defense Incident Response", description: "Investigates, analyzes, and responds to cyber incidents within the network environment or enclave.", categoryCode: "PR" },
      { code: "PR-INF", name: "Cyber Defense Infrastructure Support", description: "Tests, implements, deploys, maintains, and administers the infrastructure hardware and software.", categoryCode: "PR" },
      { code: "PR-CDA", name: "Cyber Defense Analysis", description: "Uses data collected from a variety of cyber defense tools to analyze events that occur within their environments for the purposes of mitigating threats.", categoryCode: "PR" },
      { code: "PR-VAM", name: "Vulnerability Assessment and Management", description: "Conducts assessments of threats and vulnerabilities, determines deviations from acceptable configurations.", categoryCode: "PR" },
      
      // Analyze (AN)
      { code: "AN-TTA", name: "Threat Analysis", description: "Develops cyber threat assessments for use by customers.", categoryCode: "AN" },
      { code: "AN-EXP", name: "Exploitation Analysis", description: "Analyzes collected information to identify vulnerabilities and potential for exploitation.", categoryCode: "AN" },
      { code: "AN-ALL", name: "All-Source Analysis", description: "Analyzes data/information from one or multiple sources to conduct preparation of the environment, respond to requests for information, and submit intelligence collection and production requirements.", categoryCode: "AN" },
      { code: "AN-TWA", name: "Targets", description: "Applies current knowledge of one or more regions, countries, non-state entities, and/or technologies.", categoryCode: "AN" },
      
      // Collect and Operate (CO)
      { code: "CO-OPL", name: "Cyber Operational Planning", description: "Performs in-depth joint targeting and cyber planning process.", categoryCode: "CO" },
      { code: "CO-CLO", name: "Cyber Operations", description: "Performs activities to gather evidence on criminal or foreign intelligence entities in order to mitigate possible or real-time threats.", categoryCode: "CO" },
      
      // Investigate (IN)
      { code: "IN-FOR", name: "Digital Forensics", description: "Collects, processes, preserves, analyzes, and presents computer-related evidence in support of network vulnerability, mitigation, and/or criminal, fraud, counterintelligence or law enforcement investigations.", categoryCode: "IN" },
      { code: "IN-INV", name: "Cyber Investigation", description: "Applies tactics, techniques, and procedures for a full range of investigative tools and processes.", categoryCode: "IN" }
    ];

    const specialtyAreaMap = new Map<string, number>();
    
    for (const area of specialtyAreas) {
      try {
        const categoryId = categoryMap.get(area.categoryCode);
        if (categoryId) {
          const created = await storage.createSpecialtyArea({
            code: area.code,
            name: area.name,
            description: area.description,
            categoryId: categoryId
          });
          specialtyAreaMap.set(area.code, created.id);
          console.log(`Created specialty area: ${area.code} - ${area.name}`);
        }
      } catch (error) {
        console.error(`Error creating specialty area ${area.code}:`, error);
      }
    }

    return specialtyAreaMap;
  }

  public async importCompleteFramework(): Promise<void> {
    try {
      console.log("Starting NICE Framework 2.0.0 import...");
      
      // First, create categories and specialty areas
      const categoryMap = await this.importCategories();
      const specialtyAreaMap = await this.importSpecialtyAreas(categoryMap);
      
      console.log("Framework structure imported successfully!");
      console.log(`Categories: ${categoryMap.size}`);
      console.log(`Specialty Areas: ${specialtyAreaMap.size}`);
      
      // Record the import in history
      await storage.createImportHistory({
        filename: "NICE_Framework_2.0.0_Official",
        importType: "complete",
        recordsImported: categoryMap.size + specialtyAreaMap.size,
        status: "completed",
        metadata: { 
          source: "Official NICE Framework 2.0.0",
          categories: categoryMap.size,
          specialtyAreas: specialtyAreaMap.size,
          importedAt: new Date().toISOString()
        }
      });
      
      console.log("NICE Framework import completed successfully!");
      
    } catch (error) {
      console.error("Error during NICE Framework import:", error);
      
      // Record the failed import
      await storage.createImportHistory({
        filename: "NICE_Framework_2.0.0_Official",
        importType: "complete",
        recordsImported: 0,
        status: "failed",
        metadata: { 
          error: error instanceof Error ? error.message : "Unknown error",
          failedAt: new Date().toISOString()
        }
      });
      
      throw error;
    }
  }
}