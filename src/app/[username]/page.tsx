import { fetchPortfolioByUsername } from '@/utils/db';
import PortfolioPreview from '@/components/PortfolioPreview';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Keep the page static but allow on-demand revalidation
export const dynamic = 'force-static';
export const revalidate = false;

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UsernamePortfolioPage({ params }: PageProps) {
  const { username } = await params;
  
  const data = await fetchPortfolioByUsername(username);
  
  if (!data) {
    notFound();
  }

  const profileId = data.profile.id;
  const content = data.content;

  // Server Action for contact form — emails directly to owner
  async function handleMessageSubmitAction(msg: { name: string; email: string; content: string }) {
    'use server';
    const ownerEmail = data!.profile.email;
    if (!ownerEmail) {
      // Fallback: still save to DB if no email on profile
      const { submitVisitorMessage } = await import('@/utils/db');
      await submitVisitorMessage(profileId, msg.name, msg.email, msg.content);
      return;
    }
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
      <PortfolioPreview 
        data={content} 
        onSubmitMessage={handleMessageSubmitAction} 
      />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await fetchPortfolioByUsername(username);
  
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
