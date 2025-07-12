export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  profession: string;
  bio: string;
  skills: string[];
  interests: string[];
  verified: boolean;
  location: string;
  timezone: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  joinedAt: string;
  completedProjects: number;
  rating: number;
  certificates: Certificate[];
  availability: "full-time" | "part-time" | "weekends" | "flexible";
  hourlyRate?: number;
  preferredRoles: string[];
  languages: string[];
  achievements: Achievement[];
}

export interface Certificate {
  id: string;
  projectId: string;
  projectTitle: string;
  role: string;
  issueDate: string;
  skills: string[];
  verificationUrl: string;
  badgeUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}
