'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield size={18} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-text-tertiary">Last updated: June 2026</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert text-sm text-text-secondary leading-relaxed space-y-6">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Data Collection and Processing</h2>
            <p>
              Your privacy is of extreme importance to us. When you upload a resume PDF, character extraction is performed offline, locally inside your browser. The raw text blocks are transmitted securely over HTTPS to the Gemini API for parsing and never stored permanently on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Public Information</h2>
            <p>
              By customizing and publishing your portfolio page, you consent to serve your display name, resume timeline, and project details publicly at your claimed subpath handle.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Database Storage</h2>
            <p>
              Your published profiles are cached at Vercel Edge nodes and stored in our database records (which run on Supabase Postgres). Auth profiles use secure password hashing standard conventions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Visitor Mailbox Submissions</h2>
            <p>
              Recruiter messages sent through your portfolio form are stored in our Postgres database and emailed directly to your registered profile email. We do not inspect or share this correspondence with third parties.
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
