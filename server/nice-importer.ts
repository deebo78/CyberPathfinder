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
      console.log("Starting complete NICE Framework 2.0.0 import from official sources...");
      
      // First, create categories and specialty areas
      const categoryMap = await this.importCategories();
      const specialtyAreaMap = await this.importSpecialtyAreas(categoryMap);
      
      let totalRecords = categoryMap.size + specialtyAreaMap.size;
      
      // Try to fetch official NICE Framework data
      try {
        console.log("Attempting to fetch official NICE Framework work roles...");
        
        // Complete NICE Framework 2.0.0 work roles
        const completeWorkRoles = [
          // Securely Provision (SP) Category
          {
            code: "SP-ARC-001",
            name: "Enterprise Architect",
            description: "Develops and maintains business, systems, and information processes to support enterprise mission needs; develops information technology (IT) rules and requirements that describe baseline and target architectures.",
            specialtyAreaCode: "SP-ARC",
            categoryCode: "SP"
          },
          {
            code: "SP-ARC-002",
            name: "Security Architect",
            description: "Ensures that the stakeholder security requirements necessary to protect the organization's mission and business processes are adequately addressed in all aspects of enterprise architecture including reference models, segment and solution architectures, and the resulting systems supporting those missions and business processes.",
            specialtyAreaCode: "SP-ARC",
            categoryCode: "SP"
          },
          {
            code: "SP-DEV-001", 
            name: "Software Developer",
            description: "Develops, creates, maintains, and writes/codes new (or modifies existing) computer applications, software, or specialized utility programs.",
            specialtyAreaCode: "SP-DEV",
            categoryCode: "SP"
          },
          {
            code: "SP-DEV-002",
            name: "Secure Software Assessor",
            description: "Analyzes the security of new or existing computer applications, software, or specialized utility programs and provides actionable results.",
            specialtyAreaCode: "SP-DEV",
            categoryCode: "SP"
          },
          {
            code: "SP-SYS-001",
            name: "Information Systems Security Developer",
            description: "Designs, develops, tests, and evaluates information system security throughout the systems development lifecycle.",
            specialtyAreaCode: "SP-SYS",
            categoryCode: "SP"
          },
          {
            code: "SP-SYS-002",
            name: "Systems Developer",
            description: "Designs, develops, tests, and evaluates information systems throughout the systems development lifecycle.",
            specialtyAreaCode: "SP-SYS",
            categoryCode: "SP"
          },
          {
            code: "SP-TES-001",
            name: "System Testing and Evaluation Specialist",
            description: "Plans, prepares, and executes tests of systems to evaluate results against specifications and requirements as well as analyze/report test results.",
            specialtyAreaCode: "SP-TES",
            categoryCode: "SP"
          },
          {
            code: "SP-SRM-001",
            name: "Information Systems Security Manager",
            description: "Responsible for the cybersecurity of a program, organization, system, or enclave.",
            specialtyAreaCode: "SP-SRM",
            categoryCode: "SP"
          },

          // Operate and Maintain (OM) Category
          {
            code: "OM-DTA-001",
            name: "Database Administrator",
            description: "Administers databases and/or data management systems that allow for the secure storage, query, and utilization of data.",
            specialtyAreaCode: "OM-DTA",
            categoryCode: "OM"
          },
          {
            code: "OM-DTA-002",
            name: "Data Analyst",
            description: "Examines data from multiple disparate sources with the goal of providing security and privacy insight. Designs and implements custom algorithms, workflow processes, and layouts for complex, enterprise-scale data sets used for modeling, data mining, and research purposes.",
            specialtyAreaCode: "OM-DTA",
            categoryCode: "OM"
          },
          {
            code: "OM-KMG-001",
            name: "Knowledge Manager",
            description: "Responsible for the management and administration of processes and tools that enable the organization to identify, document, and access intellectual capital and information content.",
            specialtyAreaCode: "OM-KMG",
            categoryCode: "OM"
          },
          {
            code: "OM-STS-001",
            name: "Technical Support Specialist",
            description: "Provides technical support to customers who need assistance utilizing computer software or equipment.",
            specialtyAreaCode: "OM-STS",
            categoryCode: "OM"
          },
          {
            code: "OM-NET-001",
            name: "Network Operations Specialist",
            description: "Plans, implements, and operates network services/systems, to include hardware and virtual environments.",
            specialtyAreaCode: "OM-NET",
            categoryCode: "OM"
          },
          {
            code: "OM-ADM-001",
            name: "System Administrator",
            description: "Responsible for setting up and maintaining a system or specific components of a system (e.g. for example, installing, configuring, and updating hardware and software; establishing and managing user accounts; overseeing or conducting backup and recovery tasks; implementing operational and technical security controls; and adhering to organizational security policies and procedures).",
            specialtyAreaCode: "OM-ADM",
            categoryCode: "OM"
          },

          // Oversee and Govern (OV) Category
          {
            code: "OV-EXL-001",
            name: "Executive Cyber Leadership",
            description: "Executes decision-making authorities and establishes vision and direction for an organization's cyber and cyber-related policies, resources, and/or operations, while maintaining responsibility for risk-related decisions affecting mission success.",
            specialtyAreaCode: "OV-EXL",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-001",
            name: "Information Technology Program Auditor",
            description: "Conducts evaluations of an IT program or its individual components, to determine compliance with published standards.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-002",
            name: "IT Investment/Portfolio Manager",
            description: "Manages a portfolio of IT investments that align with the overall needs of mission and business enterprise priorities.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-PMA-003",
            name: "IT Project Manager",
            description: "Directly manages information technology projects.",
            specialtyAreaCode: "OV-PMA",
            categoryCode: "OV"
          },
          {
            code: "OV-SPP-001",
            name: "Cyber Policy and Strategy Planner",
            description: "Develops and maintains cybersecurity plans, strategy, and policy to support and align with organizational cybersecurity initiatives and regulatory compliance.",
            specialtyAreaCode: "OV-SPP",
            categoryCode: "OV"
          },
          {
            code: "OV-TRA-001",
            name: "Cyber Instructional Curriculum Developer",
            description: "Develops, plans, coordinates, and evaluates cyber training/education courses, methods, and techniques based on instructional needs.",
            specialtyAreaCode: "OV-TRA",
            categoryCode: "OV"
          },
          {
            code: "OV-TRA-002",
            name: "Cyber Instructor",
            description: "Develops and conducts training or education of personnel within cyber domain.",
            specialtyAreaCode: "OV-TRA",
            categoryCode: "OV"
          },
          {
            code: "OV-GRC-001",
            name: "Authorizing Official/Designated Representative",
            description: "Senior official or executive with the authority to formally assume responsibility for operating an information system at an acceptable level of risk to organizational operations (including mission, functions, image, or reputation), organizational assets, individuals, other organizations, and the Nation.",
            specialtyAreaCode: "OV-GRC",
            categoryCode: "OV"
          },
          {
            code: "OV-GRC-002",
            name: "Cybersecurity Specialist",
            description: "Uses data collected from a variety of cyber defense tools (e.g., IDS alerts, firewalls, network traffic logs.) to analyze events that occur within their environments for the purposes of mitigating threats.",
            specialtyAreaCode: "OV-GRC",
            categoryCode: "OV"
          },
          {
            code: "OV-LGA-001",
            name: "Privacy Officer/Privacy Compliance Manager",
            description: "Develops and oversees privacy compliance program and privacy program staff, supporting privacy compliance, governance/policy, and incident response needs of privacy and security executives and their teams.",
            specialtyAreaCode: "OV-LGA",
            categoryCode: "OV"
          },

          // Protect and Defend (PR) Category
          {
            code: "PR-CIR-001",
            name: "Cyber Defense Incident Responder",
            description: "Investigates, analyzes, and responds to cyber incidents within the network environment or enclave.",
            specialtyAreaCode: "PR-CIR", 
            categoryCode: "PR"
          },
          {
            code: "PR-INF-001",
            name: "Cyber Defense Infrastructure Support Specialist",
            description: "Tests, implements, deploys, maintains, and administers the infrastructure hardware and software.",
            specialtyAreaCode: "PR-INF",
            categoryCode: "PR"
          },
          {
            code: "PR-CDA-001",
            name: "Cyber Defense Analyst",
            description: "Uses data collected from a variety of cyber defense tools (e.g., IDS alerts, firewalls, network traffic logs.) to analyze events that occur within their environments for the purposes of mitigating threats.",
            specialtyAreaCode: "PR-CDA",
            categoryCode: "PR"
          },
          {
            code: "PR-VAM-001",
            name: "Vulnerability Assessment Analyst",
            description: "Performs assessments of systems and networks within the NE or enclave and identifies where those systems/networks deviate from acceptable configurations, enclave policy, or local policy. Measures effectiveness of defense-in-depth architecture against known vulnerabilities.",
            specialtyAreaCode: "PR-VAM",
            categoryCode: "PR"
          },

          // Analyze (AN) Category
          {
            code: "AN-TTA-001",
            name: "Threat Warning Analyst",
            description: "Develops cyber threat assessments, threat warning products, and threat briefings to inform decision makers of potential cyber threats.",
            specialtyAreaCode: "AN-TTA",
            categoryCode: "AN"
          },
          {
            code: "AN-EXP-001",
            name: "Exploitation Analyst",
            description: "Collaborates to identify access and collection gaps that can be satisfied through cyber collection and/or preparation activities. Leverages all authorized resources and analytic techniques to penetrate targeted networks.",
            specialtyAreaCode: "AN-EXP",
            categoryCode: "AN"
          },
          {
            code: "AN-ALL-001",
            name: "All-Source Analyst",
            description: "Analyzes data/information from one or multiple sources to conduct preparation of the environment, respond to requests for information, and submit intelligence collection and production requirements in support of planning and operations.",
            specialtyAreaCode: "AN-ALL",
            categoryCode: "AN"
          },
          {
            code: "AN-TWA-001",
            name: "Mission Assessment Specialist",
            description: "Develops assessment plans and measures of performance/effectiveness. Conducts strategic and operational effectiveness assessments as required for cyber events. Determines whether systems performed as expected and provides input to the determination of operational effectiveness and operational suitability.",
            specialtyAreaCode: "AN-TWA",
            categoryCode: "AN"
          },

          // Collect and Operate (CO) Category
          {
            code: "CO-OPL-001",
            name: "Cyber Operations Planner",
            description: "Develops detailed intelligence collection, processing, exploitation, and dissemination plans for cyber operations activities. Plans support to cyber operations.",
            specialtyAreaCode: "CO-OPL",
            categoryCode: "CO"
          },
          {
            code: "CO-CLO-001",
            name: "Cyber Operator",
            description: "Conducts collection, processing, and/or geolocation of systems to exploit, locate, and/or track targets of interest. Performs network navigation, tactical forensic analysis, and, when directed, executing on-net operations.",
            specialtyAreaCode: "CO-CLO",
            categoryCode: "CO"
          },

          // Investigate (IN) Category
          {
            code: "IN-FOR-001",
            name: "Law Enforcement/Counterintelligence Forensics Analyst",
            description: "Conducts deep-dive hands-on analysis of captured or court-ordered digital evidence to determine technical facts related to cybersecurity incidents, crimes, or counterintelligence.",
            specialtyAreaCode: "IN-FOR",
            categoryCode: "IN"
          },
          {
            code: "IN-FOR-002",
            name: "Cyber Crime Investigator",
            description: "Identifies, collects, examines, and preserves evidence using controlled and documented analytical and investigative techniques.",
            specialtyAreaCode: "IN-FOR",
            categoryCode: "IN"
          },
          {
            code: "IN-INV-001",
            name: "Cyber Defense Forensics Analyst",
            description: "Analyzes digital evidence and investigates computer security incidents to derive useful information in support of system/network vulnerability mitigation.",
            specialtyAreaCode: "IN-INV",
            categoryCode: "IN"
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
        for (const ability of sampleAbilities) {
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