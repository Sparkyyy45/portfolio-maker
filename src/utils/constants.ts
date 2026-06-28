import { PortfolioContent } from '@/types/portfolio';

export const INITIAL_PORTFOLIO_CONTENT: PortfolioContent = {
  hero: {
    name: 'Your Name',
    tagline: 'Your Professional Tagline',
    bio: 'Tell recruiters a little bit about yourself, your core focus, and your passion.',
    location: 'San Francisco, CA',
    open_to_work: true,
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
      email: '',
    },
  },
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'TypeScript'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Tailwind CSS'],
    },
  ],
  projects: [
    {
      title: 'First Project',
      description: 'A brief description of a great project you built, explaining the problem solved and core impact.',
      tech: ['React', 'Tailwind CSS'],
      github: '',
      live: '',
      stars: 0,
      updated_at: 'Updated recently',
    },
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'Awesome Company',
      period: '2025 - Present',
      bullets: [
        'Collaborated with a cross-functional team to build high-quality products.',
        'Optimized core features resulting in a 20% increase in performance.',
      ],
    },
  ],
  education: [],
  certifications: [],
  github_repos: [],
  theme: 'light',
  template: 'minimal',
  accent_color: 'zinc',
  font_pair: 'modern-tech',
  sections_visibility: {
    experience: true,
    projects: true,
    github_repos: true,
    skills: true,
    leetcode: true,
    education: true,
    certifications: true,
    contact: true,
  },
};
