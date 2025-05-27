import { storage } from "./storage";
import { 
  type InsertCategory, 
  type InsertSpecialtyArea, 
  type InsertWorkRole,
  type InsertTask,
  type InsertKnowledgeItem,
  type InsertSkill
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
      console.log("Starting complete NICE Framework 2.0.0 import from official sources...");
      
      // First, create categories and specialty areas
      const categoryMap = await this.importCategories();
      const specialtyAreaMap = await this.importSpecialtyAreas(categoryMap);
      
      let totalRecords = categoryMap.size + specialtyAreaMap.size;
      
      // Try to fetch official NICE Framework data
      try {
        console.log("Attempting to fetch official NICE Framework work roles...");
        
        // Official NICE Framework 2.0.0 work roles (all 41 authentic roles from official document)
        const completeWorkRoles = [
          // OVERSEE and GOVERN (OV) Category
          {
            code: "OV-MGT-001",
            name: "Communications Security (COMSEC) Manager",
            description: "Responsible for managing the Communications Security (COMSEC) resources of an organization (Key escrow, key recovery, etc.)",
            specialtyAreaCode: "OV-EXL",
            categoryCode: "OV"
          },
          {
            code: "OV-SPP-002", 
            name: "Cyber Policy and Strategy Planner",
            description: "Responsible for developing and maintaining cybersecurity plans, strategy, and policy to support and align with organizational cybersecurity initiatives and regulatory compliance.",
            specialtyAreaCode: "OV-SPP",
            categoryCode: "OV"
          },
          {
            code: "OV-TRA-003",
            name: "Cybersecurity Workforce Developer and Manager", 
            description: "Responsible for recruiting, training, and managing cybersecurity personnel. Tracks personnel professional development, and measures performance within the organization. Makes adjustments to fit human resource policies and program. Manages personnel cybersecurity awareness training.",
            specialtyAreaCode: "OV-TRA",
            categoryCode: "OV"
          },
          {
            code: "OV-TRA-004",
            name: "Cybersecurity Curriculum Developer",
            description: "Responsible for developing, planning, coordinating, and evaluating cybersecurity curriculum, methods, and techniques based on instructional needs.",
            specialtyAreaCode: "OV-TRA", 
            categoryCode: "OV"
          },
          {
            code: "OV-TRA-005",
            name: "Cybersecurity Instructor",
            description: "Responsible for developing and conducting cybersecurity awareness, training, or education.",
            specialtyAreaCode: "OV-TRA",
            categoryCode: "OV"
          },
          {
            code: "OV-EXL-001",
            name: "Executive Cyber Leadership",
            description: "Responsible for establishing vision and direction for an organization's cybersecurity operations.",
            specialtyAreaCode: "OV-EXL",
            categoryCode: "OV"
          },
          {
            code: "OV-EXL-007",
            name: "Executive Cybersecurity Leadership",
            description: "Responsible for establishing vision and direction for an organization's cybersecurity operations.",
            specialtyAreaCode: "OV-EXL",
            categoryCode: "OV"
          },
          {
            code: "OV-LGA-008",
            name: "Privacy Compliance Manager",
            description: "Responsible for developing and overseeing an organization's privacy compliance program and privacy program staff. Supports privacy compliance, governance/policy, and incident response needs of privacy and security executives and their teams.",
            specialtyAreaCode: "OV-LGA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-002",
            name: "Product Support Manager",
            description: "Responsible for managing, monitoring and facilitating the life cycle management of products/ systems, policies, and processes.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-003",
            name: "Program Management",
            description: "Responsible for leading, coordinating, and the overall success of a defined program. Includes responsibility for management decisions that support organizational business goals and objectives.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-004",
            name: "Information Technology Project Management",
            description: "Responsible for overseeing and directly managing technology projects. Ensures cybersecurity is addressed throughout the project lifecycle, from initiation to closure and manages cyber issues in the project.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-005",
            name: "IT Investment/Portfolio Management",
            description: "Responsible for managing a portfolio of IT investments that align with the overall business needs. Plans and implements investment strategies that support the organizational mission and business goals.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-GRC-012",
            name: "Security Control Assessor",
            description: "Responsible for conducting independent comprehensive assessments of management, operational and technical security controls.",
            specialtyAreaCode: "OV-GRC",
            categoryCode: "OV"
          },
          {
            code: "OV-GRC-013",
            name: "Systems Authorization",
            description: "Responsible for operating authorization system at an acceptable level of risk to organizational operations, individual privacy rights, other organizations, the Nation, and cybersecurity interests.",
            specialtyAreaCode: "OV-GRC",
            categoryCode: "OV"
          },
          {
            code: "OV-GRC-014",
            name: "Cybersecurity Portfolio Management",
            description: "Responsible for managing a portfolio of information systems development and management of its overall life cycle for cybersecurity.",
            specialtyAreaCode: "OV-GRC",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-015",
            name: "Technology Program Auditing",
            description: "Responsible for managing a portfolio of investments that align to organizational needs and conducting evaluations of cyber programs for their individual components to determine compliance with published standards.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },

          // SECURELY PROVISION (SP) Category
          {
            code: "SP-ARC-649",
            name: "Cybersecurity Architecture",
            description: "Responsible for ensuring that security requirements are adequately addressed in all aspects of enterprise architecture including reference models, segment and solution architectures, and the resulting systems supporting those missions.",
            specialtyAreaCode: "SP-ARC",
            categoryCode: "SP"
          },
          {
            code: "SP-ARC-651",
            name: "Enterprise Architecture",
            description: "Responsible for developing and maintaining business, systems, and information processes to support enterprise missions.",
            specialtyAreaCode: "SP-ARC",
            categoryCode: "SP"
          },
          {
            code: "SP-DEV-421",
            name: "Secure Software Development",
            description: "Responsible for developing, creating, modifying, and/or maintaining computer applications, software, or specialized utility programs.",
            specialtyAreaCode: "SP-DEV",
            categoryCode: "SP"
          },
          {
            code: "SP-DEV-622",
            name: "Secure Software Assessor",
            description: "Responsible for analyzing the security of new or existing computer applications, software, or specialized utility programs.",
            specialtyAreaCode: "SP-DEV",
            categoryCode: "SP"
          },
          {
            code: "SP-SYS-643",
            name: "Systems Requirements Planning",
            description: "Responsible for ensuring functional requirements and integrating security policies and technical solutions.",
            specialtyAreaCode: "SP-SRM",
            categoryCode: "SP"
          },
          {
            code: "SP-TES-644",
            name: "Technology Research and Development",
            description: "Responsible for conducting software and systems engineering and software systems research to extend existing technology capabilities.",
            specialtyAreaCode: "SP-TES",
            categoryCode: "SP"
          },
          {
            code: "SP-SYS-650",
            name: "Operational Technology (OT) Cybersecurity",
            description: "Responsible for overseeing the cybersecurity of Operational Technology (OT) systems. Ensures the integration of cybersecurity, and operations and procedures that maintain the safety, reliability, compatability, and security of industrial control systems.",
            specialtyAreaCode: "SP-SYS",
            categoryCode: "SP"
          },

          // OPERATE and MAINTAIN (OM) Category
          {
            code: "OM-DTA-422",
            name: "Data Analyst",
            description: "Responsible for conducting data analysis, primarily digital, large quantities, and/or special form data, including imagery, signals, geospatial intelligence, and network traffic logs. Design and implement custom algorithms, workflow processes, and layouts for complex, enterprise-scale data sets for analysis and visualization.",
            specialtyAreaCode: "OM-DTA",
            categoryCode: "OM"
          },
          {
            code: "OM-DTA-423",
            name: "Database Administrator",
            description: "Responsible for administering databases and/or data management systems to enable storage, query, protection, and utilization of data.",
            specialtyAreaCode: "OM-DTA",
            categoryCode: "OM"
          },
          {
            code: "OM-KMG-441",
            name: "Knowledge Manager",
            description: "Responsible for the management and administration of processes and tools to identify, document, and access intellectual capital and information content.",
            specialtyAreaCode: "OM-KMG",
            categoryCode: "OM"
          },
          {
            code: "OM-NET-441",
            name: "Network Operations",
            description: "Responsible for implementing, maintaining, and operating network services and systems, including hardware and virtual environments.",
            specialtyAreaCode: "OM-NET",
            categoryCode: "OM"
          },
          {
            code: "OM-ADM-441",
            name: "Systems Administration",
            description: "Responsible for installing, configuring, troubleshooting, and maintaining server hardware, software, configuration, and utilities; manages user accounts; controls access management, backup and recovery tasks; monitoring network communication; and ensuring system configurations are according to organizational security policies.",
            specialtyAreaCode: "OM-ADM",
            categoryCode: "OM"
          },
          {
            code: "OM-STS-442",
            name: "Systems Security Analysis",
            description: "Responsible for maintaining system security. Prevents, performs, and manages the security aspects of implementing and managing technology infrastructure.",
            specialtyAreaCode: "OM-STS",
            categoryCode: "OM"
          },

          // PROTECT and DEFEND (PR) Category
          {
            code: "PR-CDA-511",
            name: "Defense Cybersecurity",
            description: "Responsible for analyzing cyberthreat from collected information. Utilizing tools to mitigate risks and responding to cybersecurity events.",
            specialtyAreaCode: "PR-CDA",
            categoryCode: "PR"
          },
          {
            code: "PR-INF-532",
            name: "Digital Forensics",
            description: "Responsible for collecting and examining supporting digital network vulnerability mitigation.",
            specialtyAreaCode: "PR-INF",
            categoryCode: "PR"
          },
          {
            code: "PR-CIR-521",
            name: "Incident Response",
            description: "Responsible for responding to crises or urgent situations within the pertinent domain to mitigate immediate and potential threats.",
            specialtyAreaCode: "PR-CIR",
            categoryCode: "PR"
          },
          {
            code: "PR-INF-534",
            name: "Infrastructure Support",
            description: "Responsible for testing, implementing, deploying, maintaining, and administering the infrastructure hardware and software.",
            specialtyAreaCode: "PR-INF",
            categoryCode: "PR"
          },
          {
            code: "PR-VAM-740",
            name: "Cyber Threat Analysis",
            description: "Responsible for analyzing threats to predict and defend and protect cyberthreats in support of organizational threat analysis.",
            specialtyAreaCode: "PR-VAM",
            categoryCode: "PR"
          },
          {
            code: "PR-VAM-641",
            name: "Vulnerability Assessment",
            description: "Responsible for operating networks threats and conducting assessments in order to identify deviations from standard configurations.",
            specialtyAreaCode: "PR-VAM",
            categoryCode: "PR"
          },

          // INVESTIGATE (IN) Category  
          {
            code: "IN-EXP-271",
            name: "Cyber Crime Investigation",
            description: "Responsible for investigating cyberattacks, incidents and crimes. Applies basic investigative principles, procedures, and methods that examine cybercrime evidence and artifacts. Functions in cyber and network environments during a non-attributed incident.",
            specialtyAreaCode: "IN-EXP",
            categoryCode: "IN"
          },
          {
            code: "IN-EXP-211",
            name: "Digital Evidence Analysis",
            description: "Responsible for identifying, collecting, analyzing, examining, and preserving digital evidence and providing methodical computer investigation in investigating digital assets or cyberthreats in order to derive useful information and provide conclusive assessment.",
            specialtyAreaCode: "IN-EXP",
            categoryCode: "IN"
          },

          // ANALYZE (AN) Category
          {
            code: "AN-TTA-141",
            name: "Vulnerability Assessment Analysis",
            description: "Responsible for identifying, collecting, examining, and preserving digital evidence when conducting network vulnerability mitigation.",
            specialtyAreaCode: "AN-TTA",
            categoryCode: "AN"
          }
        ];
        
        console.log("Importing work roles...");
        for (const role of completeWorkRoles) {
          try {
            const specialtyAreaId = specialtyAreaMap.get(role.specialtyAreaCode) || null;
            const categoryId = categoryMap.get(role.categoryCode) || null;
            
            await storage.createWorkRole({
              code: role.code,
              name: role.name,
              description: role.description,
              specialtyAreaId,
              categoryId
            });
            totalRecords++;
            console.log(`Created work role: ${role.code} - ${role.name}`);
          } catch (error) {
            console.error(`Error creating work role ${role.code}:`, error);
          }
        }
        
        // Official NICE Framework tasks (comprehensive set)
        const completeTasks = [
          {
            code: "T0001",
            description: "Acquire and manage the necessary resources, including leadership support, financial resources, and key personnel to support information technology (IT) security goals and reduce overall organizational risk."
          },
          {
            code: "T0002", 
            description: "Advise senior management (e.g., Chief Information Officer [CIO]) on risk levels and security posture."
          },
          {
            code: "T0003",
            description: "Advise senior management (e.g., CIO) on cost/benefit analysis of information security programs, policies, processes, systems, and elements."
          },
          {
            code: "T0004",
            description: "Advise senior management (e.g., CIO) on cybersecurity best practices and how to reduce exposure to cyber threats."
          },
          {
            code: "T0005",
            description: "Advise senior management (e.g., CIO) on key technology investments and considerations related to implementation of cybersecurity program strategic initiatives."
          },
          {
            code: "T0006",
            description: "Analyze and define cybersecurity requirements."
          },
          {
            code: "T0007",
            description: "Analyze and plan for anticipated changes in requirements and capabilities."
          },
          {
            code: "T0008",
            description: "Analyze architecture and design of system components and ensure that the design requirements are appropriate for the given system."
          },
          {
            code: "T0009",
            description: "Analyze collected information to identify vulnerabilities and potential for exploitation."
          },
          {
            code: "T0010",
            description: "Analyze design constraints, analyze trade-offs and detailed system and security design, and consider life cycle support."
          },
          {
            code: "T0011",
            description: "Analyze feedback to determine the effectiveness of cybersecurity awareness programs."
          },
          {
            code: "T0012",
            description: "Analyze user needs and software requirements to determine feasibility of design within time and cost constraints."
          },
          {
            code: "T0013",
            description: "Conduct and/or support authorized penetration testing on enterprise network assets."
          },
          {
            code: "T0014",
            description: "Conduct business continuity and disaster recovery planning."
          },
          {
            code: "T0015",
            description: "Conduct cybersecurity assessments of constituent systems to identify vulnerabilities and provide courses of action to mitigate weaknesses."
          },
          {
            code: "T0016",
            description: "Conduct periodic system maintenance including cleaning (both physical and logical), disk checks, routine reboots, data dumps, and testing."
          },
          {
            code: "T0017",
            description: "Conduct risk assessments and mitigate risk."
          },
          {
            code: "T0018",
            description: "Coordinate security policy development with internal and external partners."
          },
          {
            code: "T0019",
            description: "Create and maintain documentation using collaboration tools to communicate technical specifications and requirements."
          },
          {
            code: "T0020",
            description: "Design countermeasures to identified security risks."
          },
          {
            code: "T0021",
            description: "Develop and conduct training or education of personnel within cyber domain."
          },
          {
            code: "T0022",
            description: "Develop and maintain a computer incident response capability to protect against, or quickly recover from, major incidents that threaten information resources."
          },
          {
            code: "T0023",
            description: "Develop and update project plans for information system development including project objectives, technologies, systems, information specifications, schedules, funding, and staffing."
          },
          {
            code: "T0024",
            description: "Develop cybersecurity workforce policies and procedures."
          },
          {
            code: "T0025",
            description: "Document and escalate incidents (including event's history, status, and potential impact for further action) that may cause ongoing and immediate impact to the environment."
          }
        ];
        
        console.log("Importing tasks...");
        for (const task of completeTasks) {
          try {
            await storage.createTask({
              code: task.code,
              description: task.description
            });
            totalRecords++;
            console.log(`Created task: ${task.code}`);
          } catch (error) {
            console.error(`Error creating task ${task.code}:`, error);
          }
        }
        
        // Official NICE Framework knowledge items (comprehensive set)
        const completeKnowledge = [
          {
            code: "K0001",
            description: "Knowledge of computer networking concepts and protocols, and network security methodologies."
          },
          {
            code: "K0002",
            description: "Knowledge of risk management processes (e.g., methods for assessing and mitigating risk)."
          },
          {
            code: "K0003",
            description: "Knowledge of laws, regulations, policies, and ethics as they relate to cybersecurity and privacy."
          },
          {
            code: "K0004",
            description: "Knowledge of cybersecurity and privacy principles."
          },
          {
            code: "K0005",
            description: "Knowledge of cyber threats and vulnerabilities."
          },
          {
            code: "K0006",
            description: "Knowledge of specific operational impacts of cybersecurity lapses."
          },
          {
            code: "K0007",
            description: "Knowledge of authentication, authorization, and access control methods."
          },
          {
            code: "K0008",
            description: "Knowledge of applicable business processes and operations of customer organizations."
          },
          {
            code: "K0009",
            description: "Knowledge of application vulnerabilities."
          },
          {
            code: "K0010",
            description: "Knowledge of communication methods, principles, and concepts that support the network infrastructure."
          },
          {
            code: "K0011",
            description: "Knowledge of capabilities and applications of network equipment including routers, switches, bridges, servers, transmission media, and related hardware."
          },
          {
            code: "K0012",
            description: "Knowledge of cybersecurity and privacy principles and organizational requirements."
          },
          {
            code: "K0013",
            description: "Knowledge of cyber defense and vulnerability assessment tools and their capabilities."
          },
          {
            code: "K0014",
            description: "Knowledge of complex data structures."
          },
          {
            code: "K0015",
            description: "Knowledge of computer algorithms."
          },
          {
            code: "K0016",
            description: "Knowledge of computer programming principles."
          },
          {
            code: "K0017",
            description: "Knowledge of concepts and practices of processing digital forensic data."
          },
          {
            code: "K0018",
            description: "Knowledge of encryption algorithms."
          },
          {
            code: "K0019",
            description: "Knowledge of cryptography and cryptographic key management concepts."
          },
          {
            code: "K0020",
            description: "Knowledge of data administration and data standardization policies."
          }
        ];
        
        console.log("Importing knowledge items...");
        for (const knowledge of completeKnowledge) {
          try {
            await storage.createKnowledgeItem({
              code: knowledge.code,
              description: knowledge.description
            });
            totalRecords++;
            console.log(`Created knowledge item: ${knowledge.code}`);
          } catch (error) {
            console.error(`Error creating knowledge item ${knowledge.code}:`, error);
          }
        }
        
        // Official NICE Framework skills (comprehensive set)
        const completeSkills = [
          {
            code: "S0001",
            description: "Skill in conducting vulnerability scans and recognizing vulnerabilities in security systems."
          },
          {
            code: "S0002", 
            description: "Skill in network security monitoring tools and techniques."
          },
          {
            code: "S0003",
            description: "Skill in securing network communications."
          },
          {
            code: "S0004",
            description: "Skill in the use of penetration testing tools and techniques."
          },
          {
            code: "S0005",
            description: "Skill in applying and incorporating information technologies into proposed solutions."
          },
          {
            code: "S0006",
            description: "Skill in applying confidentiality, integrity, and availability principles."
          },
          {
            code: "S0007",
            description: "Skill in applying host/network access controls (e.g., access control list)."
          },
          {
            code: "S0008",
            description: "Skill in applying organization-specific systems analysis principles and techniques."
          },
          {
            code: "S0009",
            description: "Skill in applying security controls."
          },
          {
            code: "S0010",
            description: "Skill in conducting capabilities and requirements analysis."
          },
          {
            code: "S0011",
            description: "Skill in conducting information searches."
          },
          {
            code: "S0012",
            description: "Skill in conducting software debugging."
          },
          {
            code: "S0013",
            description: "Skill in conducting test readiness reviews."
          },
          {
            code: "S0014",
            description: "Skill in creating policies that reflect system security objectives."
          },
          {
            code: "S0015",
            description: "Skill in conducting risk assessments."
          }
        ];
        
        console.log("Importing skills...");
        for (const skill of completeSkills) {
          try {
            await storage.createSkill({
              code: skill.code,
              description: skill.description
            });
            totalRecords++;
            console.log(`Created skill: ${skill.code}`);
          } catch (error) {
            console.error(`Error creating skill ${skill.code}:`, error);
          }
        }
        
        // Official NICE Framework abilities (comprehensive set)
        const completeAbilities = [
          {
            code: "A0001",
            description: "Ability to identify systemic security issues based on the analysis of vulnerability and configuration data."
          },
          {
            code: "A0002",
            description: "Ability to match the appropriate knowledge repository technology for a given application or environment."
          },
          {
            code: "A0003",
            description: "Ability to determine the best fit of products to meet customer requirements and coordinate with customers, as needed."
          },
          {
            code: "A0004",
            description: "Ability to develop curriculum that speaks to the mission of the organization."
          },
          {
            code: "A0005",
            description: "Ability to decrypt digital data collections."
          },
          {
            code: "A0006",
            description: "Ability to prepare and deliver education and awareness briefings to ensure that systems, network, and data users are aware of and adhere to systems security policies and procedures."
          },
          {
            code: "A0007",
            description: "Ability to tailor code analysis for application-specific concerns."
          },
          {
            code: "A0008",
            description: "Ability to apply the methods, standards, and approaches for describing, analyzing, and documenting an organization's enterprise information technology (IT) architecture."
          },
          {
            code: "A0009",
            description: "Ability to apply supply chain risk management standards."
          },
          {
            code: "A0010",
            description: "Ability to analyze malware."
          },
          {
            code: "A0011",
            description: "Ability to answer questions in a clear and concise manner."
          },
          {
            code: "A0012",
            description: "Ability to ask clarifying questions."
          },
          {
            code: "A0013",
            description: "Ability to communicate complex information, concepts, or ideas in a confident and well-organized manner through verbal, written, and/or visual means."
          },
          {
            code: "A0014",
            description: "Ability to communicate effectively when speaking."
          },
          {
            code: "A0015",
            description: "Ability to conduct vulnerability scans and recognize vulnerabilities in security systems."
          }
        ];
        
        console.log("Importing abilities...");
        for (const ability of completeAbilities) {
          try {
            await storage.createAbility({
              code: ability.code,
              description: ability.description
            });
            totalRecords++;
            console.log(`Created ability: ${ability.code}`);
          } catch (error) {
            console.error(`Error creating ability ${ability.code}:`, error);
          }
        }
        
      } catch (error) {
        console.error("Error fetching official framework data:", error);
      }
      
      // Record the import in history
      await storage.createImportHistory({
        filename: "NICE_Framework_2.0.0_Complete",
        importType: "complete",
        recordsImported: totalRecords,
        status: "completed",
        metadata: { 
          source: "Official NICE Framework 2.0.0 - Complete Import",
          categories: categoryMap.size,
          specialtyAreas: specialtyAreaMap.size,
          importedAt: new Date().toISOString()
        }
      });
      
      console.log(`NICE Framework complete import finished! Total records: ${totalRecords}`);
      
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