import { PortfolioContent } from '@/types/portfolio';

interface GitHubProfile {
  name: string | null;
  bio: string | null;
  blog: string | null;
  html_url: string;
  avatar_url: string;
  email: string | null;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  html_url: string;
  homepage: string | null;
  updated_at?: string;
}

export async function fetchGitHubData(username: string): Promise<Partial<PortfolioContent>> {
  try {
    const profileResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!profileResponse.ok) {
      if (profileResponse.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      throw new Error('Failed to fetch GitHub profile.');
    }
    const profile: GitHubProfile = await profileResponse.json();

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch GitHub repositories.');
    }
    const repos: GitHubRepo[] = await reposResponse.json();

    // Filter out forks and sort by stargazers
    const activeRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6); // Take top 6 starred repositories

    const getRelativeTime = (dateString: string) => {
      const now = new Date();
      const date = new Date(dateString);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) return 'Today';
      if (diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    };

    const mappedRepos = activeRepos.map((repo) => ({
      title: repo.name.replace(/[-_]/g, ' '), // Prettify name
      description: repo.description || 'No description provided.',
      tech: repo.language ? [repo.language] : [],
      github: repo.html_url,
      stars: repo.stargazers_count,
      updated_at: repo.updated_at ? getRelativeTime(repo.updated_at) : 'Updated recently',
      pinned: true,
    }));

    // Extract unique languages for a simple skills suggestion
    const languages = Array.from(
      new Set(repos.map((repo) => repo.language).filter((lang): lang is string => !!lang))
    ).slice(0, 8);

    const mappedSkills = languages.length > 0 
      ? [{ category: 'Languages', items: languages }]
      : [];

    return {
      hero: {
        name: profile.name || username,
        tagline: profile.bio || 'Software Engineer',
        bio: `Explore my open source contributions and work history. Profile synchronized from GitHub: ${profile.html_url}`,
        avatar_url: profile.avatar_url || undefined,
        socials: {
          github: username,
          linkedin: '',
          twitter: '',
          website: profile.blog || '',
          email: profile.email || '',
        },
      },
      projects: [],
      skills: mappedSkills,
      experience: [], // GitHub API doesn't provide employment history
      education: [],
      certifications: [],
      github_repos: mappedRepos,
    };
  } catch (error: any) {
    console.error('Error fetching GitHub data:', error);
    throw new Error(error.message || 'Error occurred while syncing with GitHub.');
  }
}
