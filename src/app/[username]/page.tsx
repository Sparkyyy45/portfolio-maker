import { fetchPortfolioByUsername } from '@/utils/db';
import PortfolioPreview from '@/components/PortfolioPreview';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Keep the page static but allow on-demand revalidation
export const dynamic = 'force-static';
export const revalidate = false;

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UsernamePortfolioPage({ params }: PageProps) {
  const { username } = await params;
  
  let data = await fetchPortfolioByUsername(username);
  
  if (!data && username.toLowerCase() === 'suyash23') {
    data = {
      profile: {
        id: 'demo-user-uuid',
        username: 'suyash23',
        email: 'suyashyadav1709@gmail.com',
        is_published: true,
        created_at: new Date().toISOString()
      },
      content: {
        template: 'bento',
        theme: 'dark',
        font_pair: 'modern',
        sections_visibility: {
          experience: true,
          projects: true,
          github_repos: true,
          skills: true,
          education: true,
          certifications: true,
          contact: true
        },
        hero: {
          name: 'Suyash Yadav',
          tagline: 'Senior Staff Engineer & Open Source Builder',
          bio: 'Passionate software engineer specializing in scalable cloud infrastructures, high-performance edge APIs, and modern UI engineering. Obsessed with caching, build tools, and developer experience.',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          socials: {
            github: 'suyashyadav1709',
            linkedin: 'suyashyadav',
            twitter: 'suyash_yadav'
          }
        },
        skills: [
          { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'] },
          { category: 'Backend', items: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'GraphQL'] },
          { category: 'Infrastructure', items: ['Docker', 'AWS', 'Vercel Edge', 'GitHub Actions', 'Terraform'] }
        ],
        experience: [
          {
            company: 'NextScale Technologies',
            role: 'Principal Architect',
            period: '2023 - Present',
            bullets: [
              'Led transition to edge rendering, decreasing home page load latency by 85%',
              'Designed distributed caching policies serving 2M+ daily requests worldwide',
              'Created local developer CLI tooling reducing onboarding setup from days to seconds'
            ]
          },
          {
            company: 'CodeFlow Studios',
            role: 'Senior Software Engineer',
            period: '2020 - 2023',
            bullets: [
              'Scaled developer portals handling complex repository analysis and resume extractions',
              'Integrated multi-provider OAuth, payment routing engines, and custom domain sync workflows'
            ]
          }
        ],
        projects: [
          {
            title: 'TurboEdge Cache Purger',
            description: 'A lightning-fast caching tool designed for sub-50ms edge revalidation of static components.',
            live: 'https://github.com/Sparkyyy45/portfolio-maker',
            tech: ['Next.js', 'Go', 'Redis']
          },
          {
            title: 'Gemini Resume Ingester',
            description: 'Offline character extraction library that automatically builds structured JSON datasets.',
            live: 'https://github.com/Sparkyyy45/portfolio-maker',
            tech: ['TypeScript', 'Gemini']
          }
        ],
        education: [
          {
            institution: 'Stanford University',
            degree: 'M.S. Computer Science',
            field: 'Computer Science',
            period: '2018 - 2020'
          }
        ],
        certifications: [
          {
            name: 'AWS Solutions Architect Professional',
            issuer: 'Amazon Web Services',
            date: '2024',
            url: 'https://aws.amazon.com/'
          }
        ]
      }
    };
  }
  
  if (!data) {
    notFound();
  }

  const profileId = data.profile.id;
  const content = data.content;
  
  // Fetch views count for the recruiter card dynamically
  const isDemo = username.toLowerCase() === 'suyash23';
  let viewsCount = 43; // default fallback matching screenshot
  if (!isDemo) {
    const { fetchPortfolioStats } = await import('@/utils/db');
    const stats = await fetchPortfolioStats(profileId);
    viewsCount = stats.views;
  }

  // Server Action for contact form — emails directly to owner
  async function handleMessageSubmitAction(msg: { name: string; email: string; content: string }) {
    'use server';
    const ownerEmail = data!.profile.email;
    
    // Always submit and save the visitor message to the database first
    const { submitVisitorMessage } = await import('@/utils/db');
    await submitVisitorMessage(profileId, msg.name, msg.email, msg.content);

    if (!ownerEmail) return;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerEmail,
        visitorName: msg.name,
        visitorEmail: msg.email,
        message: msg.content,
        portfolioName: content.hero.name,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Message delivery failed. Please try again.');
    }
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: content.hero.name,
    description: content.hero.tagline,
    url: `https://devport.com/${username}`,
    jobTitle: content.hero.tagline,
    ...(content.hero.avatar_url && { image: content.hero.avatar_url }),
    ...(content.hero.socials?.github && {
      sameAs: [
        `https://github.com/${content.hero.socials.github}`,
        ...(content.hero.socials.linkedin ? [`https://linkedin.com/in/${content.hero.socials.linkedin}`] : []),
        ...(content.hero.socials.twitter ? [`https://twitter.com/${content.hero.socials.twitter}`] : []),
      ],
    }),
    knowsAbout: content.skills?.flatMap(s => s.items) || [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ErrorBoundary fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
          <p>Sorry, this portfolio could not be loaded.</p>
        </div>
      }>
        <AnalyticsTracker portfolioId={profileId} isDemo={isDemo} />
        <PortfolioPreview 
          data={content} 
          viewsCount={viewsCount}
          onSubmitMessage={handleMessageSubmitAction} 
        />
      </ErrorBoundary>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  let data = await fetchPortfolioByUsername(username);
  
  if (!data && username.toLowerCase() === 'suyash23') {
    data = {
      profile: { id: 'demo', username: 'suyash23', email: '', is_published: true, created_at: '' },
      content: {
        template: 'bento',
        theme: 'dark',
        font_pair: 'modern',
        hero: {
          name: 'Suyash Yadav',
          tagline: 'Senior Staff Engineer & Open Source Builder',
          bio: 'Passionate software engineer specializing in scalable cloud infrastructures, high-performance edge APIs, and modern UI engineering.',
          socials: {}
        },
        skills: [],
        experience: [],
        projects: [],
        education: [],
        certifications: []
      }
    };
  }
  
  if (!data) return {};

  const { hero } = data.content;
  const title = `${hero.name} — ${hero.tagline || 'Developer Portfolio'}`;
  const description = hero.bio || `${hero.name}'s developer portfolio, built with DevPort.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      ...(hero.avatar_url && { images: [{ url: hero.avatar_url, width: 200, height: 200, alt: hero.name }] }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      ...(hero.avatar_url && { images: [hero.avatar_url] }),
    },
    authors: [{ name: hero.name }],
  };
}
