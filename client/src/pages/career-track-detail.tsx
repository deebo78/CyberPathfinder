import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Award,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
  Shield,
  Server,
  Code,
  Eye,
  Lock,
  Scale,
  Cpu,
  Cloud,
  UserCheck,
  Settings,
  Search as SearchIcon,
  FileText,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface CareerTrack {
  id: number;
  name: string;
  description: string;
  overview: string;
}

interface CareerPosition {
  id: number;
  title: string;
  level: string;
  description: string;
  salaryRange: string;
  experienceRequired: string;
  keyResponsibilities: string[];
}

interface Certification {
  id: number;
  code: string;
  name: string;
  description: string;
  issuer: string;
  level: string;
  domain: string;
  renewalPeriod: string;
  prerequisites: string;
}

const trackIcons: { [key: string]: any } = {
  "SOC Operations": Shield,
  "Red Team Operations": Target,
  "Vulnerability Management": SearchIcon,
  "Digital Forensics": Eye,
  "GRC Risk Compliance": Scale,
  "Cybersecurity Architecture Engineering": Cpu,
  "Secure Software Development": Code,
  "Cloud and Infrastructure Security": Cloud,
  "Identity and Access Management": UserCheck,
  "OT Security": Settings,
  "Cybercrime Investigation": SearchIcon,
  "Cybersecurity Education Training": GraduationCap,
  "Executive Leadership CISO Track": Briefcase,
  "Program and Project Management": FileText,
  "Technology Research and Tool Development": Code,
  "Security Automation and Orchestration": Settings,
  "Customer Facing Security Roles": Users,
  "Threat Intelligence": Eye,
  "Privacy Policy Legal Affairs": Scale
};

export default function CareerTrackDetail() {
  const [match, params] = useRoute("/career-tracks/:id");
  const trackId = params?.id ? parseInt(params.id) : null;

  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: [`/api/career-tracks/${trackId}`],
    enabled: !!trackId,
  });

  const { data: certifications } = useQuery({
    queryKey: ["/api/certifications"],
  });

  const getRelevantCertifications = (trackName: string, level: string) => {
    if (!certifications) return [];
    
    const certs = certifications as Certification[];
    
    // Define certification mapping for career tracks
    const trackCertMap: { [key: string]: { [key: string]: string[] } } = {
      "SOC Operations": {
        "Foundation": ["COMP-SEC+", "COMP-NET+", "MS-SC-900", "GIAC-GSEC"],
        "Associate": ["COMP-CYSA+", "ISC2-SSCP", "MS-SC-200"],
        "Professional": ["ISC2-CISSP", "GIAC-GCIH", "GIAC-GCFA"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "Red Team Operations": {
        "Associate": ["COMP-PENTEST+", "EC-CEH"],
        "Professional": ["EC-ECSA", "GIAC-GPEN", "EC-CHFI"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "Vulnerability Management": {
        "Foundation": ["COMP-SEC+", "COMP-NET+"],
        "Associate": ["COMP-CYSA+", "COMP-PENTEST+"],
        "Professional": ["ISC2-CISSP", "GIAC-GPEN"],
        "Expert": ["COMP-CASP+"]
      },
      "Digital Forensics": {
        "Associate": ["COMP-SEC+", "GIAC-GSEC"],
        "Professional": ["EC-CHFI", "GIAC-GCFA", "GIAC-GCIH"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      },
      "GRC Risk Compliance": {
        "Foundation": ["COMP-SEC+", "ISF-CISMP"],
        "Professional": ["ISACA-CISA", "ISACA-CISM", "ISACA-CRISC", "ISC2-CISSP"],
        "Expert": ["GIAC-GSLC"]
      },
      "Cloud and Infrastructure Security": {
        "Foundation": ["CSA-CCSK", "MS-SC-900"],
        "Associate": ["COMP-SEC+", "MS-SC-300"],
        "Professional": ["ISC2-CCSP", "AWS-SEC-SPEC", "CISCO-CCNP-SEC"],
        "Expert": ["COMP-CASP+", "ISC2-CISSP-ISSAP"]
      },
      "Identity and Access Management": {
        "Foundation": ["MS-SC-900"],
        "Associate": ["MS-SC-300", "COMP-SEC+"],
        "Professional": ["ISC2-CISSP", "ISC2-CCSP"],
        "Expert": ["COMP-CASP+"]
      }
    };

    const trackCerts = trackCertMap[trackName];
    if (!trackCerts) {
      // Default certifications for tracks not specifically mapped
      const defaultByLevel: { [key: string]: string[] } = {
        "Foundation": ["COMP-SEC+", "COMP-NET+", "MS-SC-900"],
        "Associate": ["COMP-CYSA+", "ISC2-SSCP", "GIAC-GSEC"],
        "Professional": ["ISC2-CISSP", "GIAC-GCIH", "ISACA-CISM"],
        "Expert": ["COMP-CASP+", "GIAC-GSLC"]
      };
      const relevantCodes = defaultByLevel[level] || [];
      return certs.filter(cert => relevantCodes.includes(cert.code));
    }

    const relevantCodes = trackCerts[level] || [];
    return certs.filter(cert => relevantCodes.includes(cert.code));
  };

  const getTrackIcon = (trackName: string) => {
    const IconComponent = trackIcons[trackName] || Shield;
    return IconComponent;
  };

  const getTrackColor = (trackName: string) => {
    const colors = [
      "bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500", 
      "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-pink-500",
      "bg-cyan-500", "bg-amber-500", "bg-lime-500", "bg-violet-500",
      "bg-rose-500", "bg-emerald-500", "bg-sky-500", "bg-yellow-500",
      "bg-fuchsia-500", "bg-slate-500", "bg-zinc-500"
    ];
    return colors[trackName.length % colors.length];
  };

  if (!match || trackLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career track details...</p>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Career Track Not Found</h1>
          <p className="text-gray-600 mb-6">The requested career track could not be found.</p>
          <Link href="/career-tracks">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career Tracks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const trackData = track as CareerTrack & { careerLevels?: any[] };
  const Icon = getTrackIcon(trackData.name);
  const colorClass = getTrackColor(trackData.name);

  // Get job titles for each level of this track
  const getJobTitlesForTrackAndLevel = (trackId: number, levelIndex: number) => {
    const jobTitlesMap: { [key: number]: string[][] } = {
      37: [
        ["Cloud Security Support Technician", "IT Support Specialist"],
        ["Cloud Security Analyst", "Infrastructure Security Analyst"],
        ["Cloud Security Engineer", "Infrastructure Security Engineer"],
        ["Cloud Security Architect", "Senior Cloud Security Engineer"],
        ["Chief Cloud Security Officer", "Director of Infrastructure Security"]
      ],
      22: [
        ["Digital Evidence Technician"],
        ["Cybercrime Investigator"],
        ["Forensic Analyst Lead"],
        ["Cybercrime Operations Manager"],
        ["Director of Cybercrime & Digital Investigations"]
      ],
      35: [
        ["Security Engineer"],
        ["Systems Security Analyst"],
        ["Cybersecurity Architect"],
        ["Lead Security Architect"],
        ["Chief Security Architect", "Director of Enterprise Security"]
      ],
      2: [
        ["Threat Intelligence Analyst"],
        ["Senior Threat Intelligence Analyst"],
        ["Threat Intelligence Manager"],
        ["Director of Threat Intelligence"]
      ],
      31: [
        ["SOC Analyst"],
        ["Security Analyst", "Senior SOC Analyst"],
        ["SOC Manager"],
        ["Director of Security Operations"]
      ],
      4: [
        [],
        ["Penetration Tester"],
        ["Red Team Operator", "Senior Red Team Lead"],
        ["Red Team Manager"],
        ["Director of Offensive Security"]
      ],
      5: [
        ["Vulnerability Analyst"],
        ["Security Assessment Specialist"],
        ["Senior Vulnerability Manager"],
        ["Director of Vulnerability Management"]
      ],
      6: [
        ["Digital Forensics Technician"],
        ["Digital Forensics Analyst"],
        ["Senior Forensics Investigator"],
        ["Forensics Manager"],
        ["Director of Digital Forensics"]
      ],
      8: [
        ["GRC Analyst"],
        ["Compliance Specialist"],
        ["Risk Manager"],
        ["Senior GRC Manager"],
        ["Chief Risk Officer"]
      ],
      30: [
        ["Identity Analyst"],
        ["IAM Specialist"],
        ["Senior Identity Architect"],
        ["IAM Manager"],
        ["Director of Identity & Access Management"]
      ],
      41: [
        ["OT Security Specialist"],
        ["Industrial Control Systems Analyst"],
        ["Senior OT Security Engineer"],
        ["OT Security Manager"]
      ],
      48: [
        ["Security Educator"],
        ["Training Specialist"],
        ["Senior Training Manager"],
        ["Director of Security Training"]
      ],
      42: [
        [],
        [],
        ["CISO", "Deputy CISO"],
        ["Chief Security Officer"],
        ["VP of Cybersecurity"]
      ],
      38: [
        ["Security Project Manager"],
        ["Program Manager"],
        ["Senior Program Manager"],
        ["Director of Security Programs"]
      ],
      43: [
        ["Security Researcher"],
        ["Security Tool Developer"],
        ["Senior Research Engineer"],
        ["Director of Security Research"]
      ],
      39: [
        ["Security Automation Engineer"],
        ["DevSecOps Engineer"],
        ["Senior Automation Architect"],
        ["Director of Security Engineering"]
      ],
      44: [
        ["Security Consultant"],
        ["Customer Success Manager"],
        ["Senior Solutions Architect"],
        ["Director of Customer Security"]
      ],
      45: [
        ["Privacy Analyst"],
        ["Compliance Officer"],
        ["Privacy Manager"],
        ["Chief Privacy Officer"]
      ],
      14: [
        ["DevSecOps Engineer"],
        ["Application Security Engineer"],
        ["Senior AppSec Architect"],
        ["Director of Application Security"]
      ]
    };
    
    const trackTitles = jobTitlesMap[trackId];
    if (!trackTitles || levelIndex >= trackTitles.length) {
      return [];
    }
    return trackTitles[levelIndex];
  };

  // Career levels for progression display
  const careerLevels = [
    { level: "Entry-Level", experience: "0-2 years", description: "Starting positions requiring basic cybersecurity knowledge" },
    { level: "Mid-Level", experience: "2-5 years", description: "Intermediate roles with specialized responsibilities" },
    { level: "Senior-Level", experience: "5-8 years", description: "Advanced positions with leadership and mentoring duties" },
    { level: "Expert-Level", experience: "8+ years", description: "Subject matter expert roles with strategic influence" },
    { level: "Executive-Level", experience: "10+ years", description: "Leadership positions setting organizational direction" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/career-tracks">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career Tracks
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 ${colorClass} rounded-lg flex items-center justify-center`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trackData.name}</h1>
              <p className="text-gray-600 mt-1">NICE Framework Career Track</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                {trackData.description}
              </p>
              {trackData.overview && (
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {trackData.overview}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Career Progression */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Career Progression Path</span>
            </CardTitle>
            <CardDescription>
              Typical progression levels within this career track
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {careerLevels.map((level, index) => {
                const jobTitles = getJobTitlesForTrackAndLevel(trackData.id, index);
                return (
                  <div key={level.level} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{level.level}</h3>
                        <Badge variant="outline" className="text-xs">
                          {level.experience}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                      
                      {/* Display authentic job titles for this level */}
                      {jobTitles.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">Typical Job Titles:</p>
                          <div className="flex flex-wrap gap-1">
                            {jobTitles.map((title, titleIndex) => (
                              <Badge key={titleIndex} variant="secondary" className="text-xs">
                                {title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Certification Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Recommended Certifications</span>
            </CardTitle>
            <CardDescription>
              Professional certifications relevant to this career track at different experience levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Foundation", "Associate", "Professional", "Expert"].map((level) => {
                const relevantCerts = getRelevantCertifications(trackData.name, level);
                
                return (
                  <div key={level} className="space-y-3">
                    <h4 className="font-medium text-gray-900 border-b pb-2">{level} Level</h4>
                    <div className="space-y-2">
                      {relevantCerts.length > 0 ? (
                        relevantCerts.map((cert) => (
                          <div key={cert.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="font-medium text-sm text-gray-900 mb-1">{cert.name}</div>
                            <div className="text-xs text-gray-600 mb-2">{cert.issuer}</div>
                            <Badge variant="outline" className="text-xs">
                              {cert.code}
                            </Badge>
                            <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>Renewal: {cert.renewalPeriod}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">General cybersecurity certifications recommended</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Next Steps</span>
            </CardTitle>
            <CardDescription>
              Actions you can take to advance in this career track
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Get Personalized Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Use our AI-powered career mapping tool to get specific recommendations based on your background and goals.
                </p>
                <Link href="/career-mapping">
                  <Button className="w-full">
                    Analyze My Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Explore Framework Details</h4>
                <p className="text-sm text-gray-600">
                  Browse the complete NICE Framework to understand work roles, tasks, and skills in detail.
                </p>
                <Link href="/relationships">
                  <Button variant="outline" className="w-full">
                    Explore Framework
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}