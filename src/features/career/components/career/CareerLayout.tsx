import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  User,
  Briefcase,
  FileText,
  Settings,
  Share2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { ProjectShowcase } from "./ProjectShowcase";
import { ResumeBuilder } from "./ResumeBuilder";
import { JobBoard } from "./JobBoard";

const mockProfile = {
  name: "Alex Chen",
  title: "Full Stack Developer",
  avatar:
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
  bio: "Passionate about creating elegant solutions to complex problems. 5+ years building scalable applications with modern technologies.",
  email: "alex.chen@example.com",
  location: "San Francisco, CA",
  portfolioUrl: "alexchen.dev",
  github: "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  completionScore: 92,
  stats: {
    projects: 8,
    applications: 12,
    interviews: 3,
  },
};

export function CareerLayout() {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    CareerHub
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Professional Development
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border/50 hover:border-border"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in">
            {/* Profile Card */}
            <Card className="glass-effect card-hover overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-600 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/80 to-primary-600/80 backdrop-blur-sm"></div>
              </div>
              <CardHeader className="text-center pb-4 -mt-10 relative z-10">
                <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-background shadow-xl">
                  <AvatarImage
                    src={mockProfile.avatar}
                    alt={mockProfile.name}
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary-100 to-primary-200 text-primary-800">
                    {mockProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold">
                  {mockProfile.name}
                </CardTitle>
                <p className="text-muted-foreground font-medium">
                  {mockProfile.title}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-primary-50 text-primary-700 border-primary-200"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro Member
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                  {mockProfile.bio}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm group">
                    <Mail className="w-4 h-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {mockProfile.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group">
                    <MapPin className="w-4 h-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {mockProfile.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group">
                    <Globe className="w-4 h-4 text-muted-foreground/70 group-hover:text-primary transition-colors" />
                    <a
                      href={`https://${mockProfile.portfolioUrl}`}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {mockProfile.portfolioUrl}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 rounded-full p-0 hover:bg-primary-50 dark:hover:bg-primary-950"
                    asChild
                  >
                    <a
                      href={mockProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 rounded-full p-0 hover:bg-primary-50 dark:hover:bg-primary-950"
                    asChild
                  >
                    <a
                      href={mockProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="glass-effect card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Career Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {mockProfile.stats.projects}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Projects
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {mockProfile.stats.applications}
                    </div>
                    <div className="text-xs text-muted-foreground">Applied</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {mockProfile.stats.interviews}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Interviews
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="glass-effect card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-semibold text-primary">
                      {mockProfile.completionScore}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${mockProfile.completionScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Resume</span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      Complete
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Projects</span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      8 added
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Skills</span>
                    <Badge
                      variant="outline"
                      className="text-xs border-orange-200 text-orange-700"
                    >
                      Add more
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 font-medium hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 font-medium hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-3" />
                  View Public Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-10 font-medium hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 animate-slide-up">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="grid w-full grid-cols-3 glass-effect p-1.5 h-14 rounded-2xl">
                <TabsTrigger
                  value="projects"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-xl transition-all duration-200"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline font-semibold">
                    Projects
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="resume"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-xl transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline font-semibold">Resume</span>
                </TabsTrigger>
                <TabsTrigger
                  value="jobs"
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-xl transition-all duration-200"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline font-semibold">Jobs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="projects"
                className="space-y-6 mt-8 animate-fade-in"
              >
                <ProjectShowcase />
              </TabsContent>

              <TabsContent
                value="resume"
                className="space-y-6 mt-8 animate-fade-in"
              >
                <ResumeBuilder />
              </TabsContent>

              <TabsContent
                value="jobs"
                className="space-y-6 mt-8 animate-fade-in"
              >
                <JobBoard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
