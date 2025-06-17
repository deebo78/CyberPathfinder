import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Building2, 
  Users, 
  Shield, 
  Target, 
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Globe,
  Briefcase
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: TrendingUp,
      title: "Career Mapping",
      description: "Discover your ideal cybersecurity career path based on your experience, education, and interests.",
      link: "/career-mapping",
      color: "bg-blue-500",
      users: "Job Seekers & Students"
    },
    {
      icon: Building2,
      title: "Map Vacancy",
      description: "Analyze job postings and map them to NICE Framework work roles to find qualified candidates.",
      link: "/map-vacancy",
      color: "bg-green-500",
      users: "Hiring Managers & Organizations"
    },
    {
      icon: BookOpen,
      title: "Career Tracks Explorer",
      description: "Browse all 19 cybersecurity career tracks with detailed progression pathways and requirements.",
      link: "/career-tracks",
      color: "bg-purple-500",
      users: "Everyone"
    }
  ];

  const stats = [
    { label: "Career Tracks", value: "19", description: "Authentic cybersecurity pathways" },
    { label: "Work Roles", value: "41", description: "NICE Framework positions" },
    { label: "Knowledge Items", value: "631", description: "Professional competencies" },
    { label: "Skills", value: "538", description: "Technical abilities" },
    { label: "Tasks", value: "942", description: "Job responsibilities" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              CyberPathfinder
            </h1>
          </div>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
            Navigate the NICE Cybersecurity Workforce Framework with intelligent career mapping 
            and organizational talent matching powered by authentic framework data.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              NICE Framework 2.0.0
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              AI-Powered Matching
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              750K+ Open Positions
            </Badge>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    For {feature.users}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center flex flex-col flex-grow">
                  <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                  <Link href={feature.link}>
                    <Button className="w-full group-hover:bg-gray-900 transition-colors">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Comprehensive Framework Coverage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="font-semibold text-gray-900">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Job Seekers</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Personalized Career Guidance</h3>
                  <p className="text-gray-600">Get AI-powered recommendations based on your background and interests</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Clear Progression Paths</h3>
                  <p className="text-gray-600">See exactly what skills and experience you need for your target role</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Industry-Aligned Skills</h3>
                  <p className="text-gray-600">Focus on competencies that employers actually need</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">For Organizations</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Job Posting Analysis</h3>
                  <p className="text-gray-600">Ensure your requirements match realistic career levels</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Framework-Aligned Hiring</h3>
                  <p className="text-gray-600">Map positions to standard industry work roles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Qualified Candidate Matching</h3>
                  <p className="text-gray-600">Find candidates with the right skills and experience level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Navigate Your Cybersecurity Future?</h2>
          <p className="text-xl opacity-90">
            Whether you're seeking your next career move or looking to hire top talent, 
            start with the industry-standard NICE Framework.
          </p>
        </div>
      </div>
    </div>
  );
}