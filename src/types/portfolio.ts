export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
}

export interface LeetCodeStats {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  rating?: number;
  ranking?: number;
}

export interface HeroData {
  name: string;
  tagline: string;
  bio: string;
  avatar_url?: string;
  location?: string;
  open_to_work?: boolean;
  socials: SocialLinks;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  stars?: number;
  updated_at?: string;
}

export interface ExperienceData {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  field: string;
  period: string;
}

export interface CertificationData {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface GitHubRepoData {
  title: string;
  description: string;
  tech: string[];
  github: string;
  stars?: number;
  updated_at?: string;
  pinned?: boolean;
}

export interface SectionsVisibility {
  experience?: boolean;
  projects?: boolean;
  github_repos?: boolean;
  skills?: boolean;
  leetcode?: boolean;
  education?: boolean;
  certifications?: boolean;
  contact?: boolean;
}

export interface PortfolioContent {
  hero: HeroData;
  skills: SkillCategory[];
  projects: ProjectData[];
  experience: ExperienceData[];
  education: EducationData[];
  certifications: CertificationData[];
  leetcode?: LeetCodeStats;
  github_repos?: GitHubRepoData[];
  theme?: 'light' | 'cyberpunk';
  sections_visibility?: SectionsVisibility;
}

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Portfolio {
  id: string;
  theme_id: string;
  content: PortfolioContent;
  updated_at: string;
}
