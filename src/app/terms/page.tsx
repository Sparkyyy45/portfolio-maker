'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary px-6 py-12 md:py-24 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 via-bg-primary to-bg-primary pointer-events-none" />

      <main className="max-w-2xl mx-auto w-full space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="space-y-3">
          <div className="inline-flex p-2.5 rounded-lg bg-bg-surface border border-border-primary text-text-primary shadow-2xs">
            <Sparkles size={18} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-text-tertiary">Last updated: June 2026</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert text-sm text-text-secondary leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Agreement to Terms</h2>
            <p>
              By accessing or using DevPort, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not access or use our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Description of Service</h2>
            <p>
              DevPort provides users with tools to generate, customize, and host developer portfolios. We extract content from resume PDFs, sync with public GitHub data, and serve pages at custom subpath routes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. User Conduct and Responsibilities</h2>
            <p>
              You represent that all details you input are accurate. You may not claim usernames or handles belonging to other people or organizations in bad faith. We reserve the right to reclaim or suspend any handle at our discretion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Free-Tier Usage and Caching</h2>
            <p>
              Portfolios are provided on a free hosting tier. DevPort utilizes caching engines to distribute page files globally. We make no guarantee of 100% uptime and reserve the right to rate-limit or prune cached routes to protect platform bandwidth.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">5. Disclaimer of Warranties</h2>
            <p>
              The services are provided &ldquo;as is&rdquo; without warranties of any kind. DevPort does not guarantee that the services will meet your requirements or be completely error-free.
            </p>
          </section>
        </div>
      </main>

      <footer className="text-center text-[10px] text-text-tertiary mt-20 relative z-10 border-t border-border-subtle pt-6">
        &copy; {new Date().getFullYear()} devport. Built for developers with zero cost.
      </footer>
    </div>
  );
}
