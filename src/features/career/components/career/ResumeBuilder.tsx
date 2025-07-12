import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  Edit3,
  Plus,
  Eye,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Folder,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock resume data
const mockResume = {
  personal: {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexchen.dev",
    summary:
      "Passionate full-stack developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, and cloud architecture.",
  },
  experience: [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "Present",
      description:
        "Led development of customer-facing web applications serving 100k+ users. Improved performance by 40% through React optimization and implemented modern CI/CD practices.",
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2020-03",
      endDate: "2021-12",
      description:
        "Built and maintained microservices architecture using Node.js and Docker. Developed responsive React applications with Redux for state management.",
    },
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-08",
      endDate: "2020-05",
      gpa: "3.8",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "CI/CD",
    "Agile",
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description:
        "Full-stack web application with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      url: "https://github.com/alexchen/ecommerce",
    },
  ],
};

export function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Award },
    { id: "projects", label: "Projects", icon: Folder },
  ];

  const handleExport = () => {
    toast({
      title: "Resume exported",
      description: "Your resume has been downloaded as a PDF.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText("https://careerhub.com/resume/alexchen");
    toast({
      title: "Link copied",
      description: "Resume link copied to clipboard.",
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your resume has been updated successfully.",
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (previewMode) {
    return (
      <div className="space-y-8">
        {/* Preview Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Resume Preview
            </h1>
            <p className="text-muted-foreground font-light">
              Professional resume layout
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(false)}
              className="rounded-full"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleExport} className="rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="max-w-4xl mx-auto bg-background shadow-lg rounded-lg border overflow-hidden">
          <div className="p-12 space-y-8">
            {/* Header */}
            <div className="text-center border-b border-border pb-8">
              <h1 className="text-4xl font-semibold text-foreground mb-3">
                {mockResume.personal.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <span>{mockResume.personal.email}</span>
                <span>{mockResume.personal.phone}</span>
                <span>{mockResume.personal.location}</span>
                <span>{mockResume.personal.website}</span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Professional Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {mockResume.personal.summary}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Experience
              </h2>
              <div className="space-y-6">
                {mockResume.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-foreground text-lg">
                          {exp.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {exp.company} • {exp.location}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate === "Present"
                          ? "Present"
                          : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Education
              </h2>
              <div className="space-y-4">
                {mockResume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {edu.degree}
                        </h3>
                        <p className="text-muted-foreground">
                          {edu.school} • {edu.location}
                        </p>
                        {edu.gpa && (
                          <p className="text-muted-foreground text-sm">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {mockResume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-muted text-foreground rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Projects
              </h2>
              <div className="space-y-6">
                {mockResume.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-medium text-foreground mb-2">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Resume Builder
          </h1>
          <p className="text-muted-foreground font-light">
            Create and customize your professional resume
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            className="rounded-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="rounded-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleExport} className="rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">
                Resume Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors rounded-lg mx-2 ${
                        activeSection === section.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <Card className="border-0 shadow-sm bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-medium">
                {sections.find((s) => s.id === activeSection)?.label}
              </CardTitle>
              <div className="flex gap-2">
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    className="rounded-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-full"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeSection === "personal" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Full Name
                      </label>
                      <Input
                        defaultValue={mockResume.personal.name}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <Input
                        defaultValue={mockResume.personal.email}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Phone
                      </label>
                      <Input
                        defaultValue={mockResume.personal.phone}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Location
                      </label>
                      <Input
                        defaultValue={mockResume.personal.location}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Professional Summary
                    </label>
                    <Textarea
                      defaultValue={mockResume.personal.summary}
                      disabled={!isEditing}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {activeSection === "experience" && (
                <div className="space-y-6">
                  {mockResume.experience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="space-y-4 p-6 border border-border rounded-lg bg-background/50"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">Experience {index + 1}</h3>
                        {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Job Title
                          </label>
                          <Input
                            defaultValue={exp.title}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Company
                          </label>
                          <Input
                            defaultValue={exp.company}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Start Date
                          </label>
                          <Input
                            type="month"
                            defaultValue={exp.startDate}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            End Date
                          </label>
                          <Input
                            defaultValue={exp.endDate}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Description
                        </label>
                        <Textarea
                          defaultValue={exp.description}
                          disabled={!isEditing}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" className="w-full rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "skills" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {mockResume.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-sm font-normal px-3 py-1"
                      >
                        {skill}
                        {isEditing && (
                          <span className="ml-2 cursor-pointer hover:text-destructive">
                            ×
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input placeholder="Add a skill..." className="flex-1" />
                      <Button className="rounded-full">Add</Button>
                    </div>
                  )}
                </div>
              )}

              {/* Add other sections similarly */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
