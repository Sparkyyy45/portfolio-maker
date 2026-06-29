'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Github, 
  FileText, 
  Globe, 
  Inbox, 
  Database, 
  Shield, 
  Cpu, 
  RefreshCw, 
  Code,
  Zap,
  Server,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

type ScriptLine = {
  text: string;
  delay: number;
  type: 'input' | 'output' | 'success' | 'blank';
};

const terminalScript: ScriptLine[] = [
  { text: "$ npx devport init", delay: 500, type: "input" },
  { text: "", delay: 100, type: "blank" },
  { text: "? Enter your GitHub username: suyashyadav1709", delay: 600, type: "input" },
  { text: "  Checking public repository logs...", delay: 200, type: "output" },
  { text: "  ✓ 18 repositories resolved (calculated main languages & stars)", delay: 300, type: "success" },
  { text: "", delay: 100, type: "blank" },
  { text: "? Path to resume PDF: ~/downloads/resume.pdf", delay: 700, type: "input" },
  { text: "  Extracting PDF character blocks offline (pdfjs-dist)...", delay: 200, type: "output" },
  { text: "  ✓ Normalizing milestones using Gemini Flash API guidelines...", delay: 400, type: "success" },
  { text: "  ✓ Saved details to Postgres JSONB document...", delay: 150, type: "success" },
  { text: "", delay: 100, type: "blank" },
  { text: "  ✓ Compiled static components & deployed to Vercel Edge...", delay: 250, type: "success" },
  { text: "  Done. Live portfolio served at: devport.com/suyashyadav", delay: 300, type: "output" },
];

export default function Home() {
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    let active = true;

    setLines([]);
    setDone(false);

    const run = async () => {
      while (current < terminalScript.length && active) {
        await new Promise((r) => setTimeout(r, terminalScript[current].delay));
        if (!active) break;
        const line = terminalScript[current];
        setLines((prev) => [...prev, line]);
        current++;
      }
      if (active) setDone(true);
    };

    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col justify-between relative selection:bg-neutral-900/5 selection:text-text-primary">
      
      {/* Radial Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 via-bg-primary to-bg-primary pointer-events-none" />

      {/* Header */}
      <header className="max-w-[1120px] mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-accent text-text-inverse">
            <Sparkles size={16} />
          </div>
          <span className="font-bold tracking-tight text-base uppercase text-text-primary">
            DEVPORT
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-[13px] font-semibold text-text-inverse transition active:translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1120px] mx-auto w-full px-6 py-16 md:py-24 space-y-32 relative z-10 flex-1 flex flex-col">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium text-text-secondary bg-bg-surface border border-border-primary rounded-full shadow-sm hover:shadow-md transition">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Free &amp; Hosted Instantly
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-gradient mx-auto max-w-4xl">
            Your developer portfolio,<br className="hidden md:block" /> built by AI in 60 seconds
          </h1>

          <p className="text-[17px] md:text-[19px] leading-[1.6] text-text-secondary max-w-2xl mx-auto">
            Upload your resume PDF or link your GitHub username. We parse your history, fetch repository stats, and deploy a premium, recruiter-ready profile at a custom link.
          </p>

          {/* Claim Handle Bar */}
          <div className="max-w-md mx-auto w-full p-1.5 rounded-xl border border-border-primary bg-bg-primary shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2 hover:border-text-tertiary transition duration-300">
            <span className="text-sm text-text-tertiary font-medium pl-3 select-none">
              devport.com/
            </span>
            <input
              type="text"
              placeholder="username"
              disabled
              className="bg-transparent text-sm font-semibold text-text-primary w-full focus:outline-none placeholder-text-tertiary opacity-60"
            />
            <Link
              href="/login"
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-[14px] font-semibold text-text-inverse transition active:translate-y-0.5 shrink-0 cursor-pointer"
            >
              Claim Handle
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Secondary Hero Actions */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/suyash"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-primary bg-bg-surface hover:bg-bg-code text-xs font-semibold text-text-secondary hover:text-text-primary transition shadow-2xs cursor-pointer select-none"
            >
              View Demo Profile <Globe size={13} />
            </Link>
            <a
              href="#live-examples"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-primary bg-bg-surface hover:bg-bg-code text-xs font-semibold text-text-secondary hover:text-text-primary transition shadow-2xs cursor-pointer select-none"
            >
              See Example Portfolios
            </a>
          </div>
        </section>

        {/* Terminal Demo Section */}
        <section className="pb-8">
          <motion.div 
            className="max-w-[760px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <div className="rounded-xl overflow-hidden border border-border-primary shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
              {/* Terminal header */}
              <div className="bg-[#F4F4F5] px-4 py-3 flex items-center border-b border-border-primary">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4E4E7]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4E4E7]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E4E4E7]" />
                </div>
                <span className="flex-1 text-center text-[12px] font-mono text-text-secondary -ml-10">
                  Terminal Mockup
                </span>
              </div>

              {/* Terminal body */}
              <div className="bg-bg-terminal p-6 font-mono text-[13px] leading-[1.8] min-h-[350px] text-left">
                {lines.map((line, i) => {
                  if (line.type === "blank")
                    return <div key={i} className="h-[20px]" />;

                  if (line.type === "input")
                    return (
                      <div key={i} className="text-text-inverse">
                        {line.text}
                      </div>
                    );

                  if (line.type === "success")
                    return (
                      <div key={i} className="text-emerald-400">
                        {line.text}
                      </div>
                    );

                  return (
                    <div key={i} className="text-zinc-500">
                      {line.text}
                    </div>
                  );
                })}

                {!done && (
                  <span className="inline-block w-[6px] h-[14px] bg-zinc-500 animate-pulse align-middle ml-1" />
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* See What It Builds (Social Proof & Live Examples) */}
        <section id="live-examples" className="space-y-12 border-t border-border-primary pt-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-bold text-accent bg-accent/5 border border-accent/10 rounded-full uppercase tracking-wider">
              ✨ Beautiful Developer Showcases
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary leading-tight">
              See what you can build in 60 seconds
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              No layouts to design, no code to write. Choose from one of our beautiful presets tailored for developers.
            </p>
          </div>

          {/* User Count & Testimonials Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-center items-center text-center space-y-1 shadow-2xs">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">1,840+</span>
              <span className="text-2xs font-bold text-text-secondary uppercase tracking-wide">Developer Portfolios Built</span>
            </div>
            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-center items-center text-center space-y-1 shadow-2xs">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">50ms</span>
              <span className="text-2xs font-bold text-text-secondary uppercase tracking-wide">Edge Response Speed</span>
            </div>
            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-center items-center text-center space-y-1 shadow-2xs">
              <span className="text-3xl font-extrabold text-text-primary tracking-tight">100%</span>
              <span className="text-2xs font-bold text-text-secondary uppercase tracking-wide">Free Hosting Forever</span>
            </div>
          </div>

          {/* Example Portfolios Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Suyash Yadav",
                role: "Senior Staff Engineer",
                template: "Bento Grid Dashboard",
                theme: "Midnight Obsidian",
                tags: ["Bento Layout", "Dark Mode", "Interactive Charts"],
                link: "/suyash",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                quote: "The Bento Grid layout grouped my side projects and GitHub stars in a way that regular resume templates never could."
              },
              {
                name: "Alex Rivera",
                role: "Systems Developer",
                template: "Retro UNIX Terminal",
                theme: "Cyberpunk Green",
                tags: ["UNIX Console", "CLI Inputs", "Contact Form"],
                link: "/login",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                quote: "Recruiters literally mentioned my command-line terminal landing page during my interview. Absolute game changer."
              },
              {
                name: "Elena Rostova",
                role: "Frontend Designer",
                template: "Glassmorphism Grid",
                theme: "Synthwave Pink",
                tags: ["Frosted Glass", "Moving Blobs", "Rich Gradients"],
                link: "/login",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                quote: "The Synthwave Glassmorphism theme is gorgeous. It feels extremely premium and sets me apart from generic templates."
              }
            ].map((example, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-between space-y-6 hover:shadow-lg hover:border-text-secondary/20 transition duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={example.avatar} alt={example.name} className="w-10 h-10 rounded-full object-cover border border-border-primary shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-tight">{example.name}</h4>
                      <p className="text-3xs text-text-secondary">{example.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary italic leading-relaxed">
                    &ldquo;{example.quote}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {example.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="px-2 py-0.5 rounded bg-bg-primary border border-border-primary text-3xs font-semibold text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border-primary flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-text-tertiary uppercase font-bold block">Layout Theme</span>
                    <span className="text-2xs font-extrabold text-text-primary">{example.template}</span>
                  </div>
                  <Link
                    href={example.link}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bg-primary hover:bg-bg-code border border-border-primary text-2xs font-bold text-text-secondary hover:text-text-primary transition"
                  >
                    View Live <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Stage Showcase Section */}
        <section className="space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Ingestion to deployment in three simple stages
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              We engineered a frictionless path that takes raw milestones and builds highly polished static web components.
            </p>
          </div>

          <div className="space-y-24">
            
            {/* Step 1: PDF Parser */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-5">
                <div className="px-2.5 py-1 rounded bg-bg-surface border border-border-primary text-text-secondary font-bold text-xs w-fit">
                  Step 01
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                  Client-side character extraction &amp; AI normalization
                </h3>
                <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                  <p>
                    Drop your resume PDF. Rather than sending heavy files to an API which causes high memory usage and latency, your browser extracts character blocks offline using <code className="bg-bg-code text-text-primary px-1.5 py-0.5 rounded text-xs border border-border-primary">pdfjs-dist</code>.
                  </p>
                  <p>
                    We package this clean text and prompt Google's Gemini Flash model with strict JSON guidelines. It outputs dates, employment histories, and skills lists.
                  </p>
                </div>
              </div>

              {/* PDF Parser Visual Mockup */}
              <div className="p-5 rounded-xl border border-border-primary bg-bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-border-primary/80 transition duration-300">
                <div className="flex items-center justify-between border-b border-border-primary pb-3 mb-4 text-xs font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} className="text-text-secondary" />
                    EXTRACTED_RESUME.JSON
                  </span>
                  <span className="px-2 py-0.5 rounded bg-bg-code text-text-secondary border border-border-primary font-bold text-[10px]">
                    GEMINI FLASH
                  </span>
                </div>
                <pre className="text-2xs font-mono text-text-secondary leading-normal overflow-x-auto">
{`{
  "name": "Jane Doe",
  "role": "Full-Stack Software Engineer",
  "skills": ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
  "experience": [
    {
      "company": "ScaleTech Inc.",
      "role": "Senior Engineer",
      "period": "2023 - Present",
      "bullets": [
        "Led migration of central routing pipeline to edge CDNs",
        "Optimized client-side rendering speeds by 40%"
      ]
    }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Step 2: GitHub Ingestion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              
              {/* GitHub Ingestion Visual Mockup (First on Desktop) */}
              <div className="p-5 rounded-xl border border-border-primary bg-bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-border-primary/80 transition duration-300 order-2 md:order-1">
                <div className="flex items-center justify-between border-b border-border-primary pb-3 mb-4 text-xs font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <Github size={14} className="text-text-secondary" />
                    GITHUB REPOS RESOLVED
                  </span>
                  <span className="px-2 py-0.5 rounded bg-bg-code text-text-secondary border border-border-primary font-bold text-[10px]">
                    API PAYLOAD
                  </span>
                </div>
                <pre className="text-2xs font-mono text-text-secondary leading-normal overflow-x-auto">
{`[
  {
    "name": "nextjs-edge-cache",
    "stars": 42,
    "language": "TypeScript",
    "description": "On-demand cache purging utility"
  },
  {
    "name": "rust-db-pool",
    "stars": 85,
    "language": "Rust",
    "description": "Lightweight async connection pooler"
  }
]`}
                </pre>
              </div>

              <div className="space-y-5 order-1 md:order-2">
                <div className="px-2.5 py-1 rounded bg-bg-surface border border-border-primary text-text-secondary font-bold text-xs w-fit">
                  Step 02
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                  Frictionless GitHub Sync
                </h3>
                <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                  <p>
                    No OAuth login required. Simply enter your username, and we query public repository logs, calculating the main languages and active star counts.
                  </p>
                  <p>
                    We filter out fork archives and populate your featured project bento grids automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Edge Caching */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-5">
                <div className="px-2.5 py-1 rounded bg-bg-surface border border-border-primary text-text-secondary font-bold text-xs w-fit">
                  Step 03
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                  Vercel edge caching &amp; instant revalidation
                </h3>
                <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                  <p>
                    Normally, dynamic database routing introduces query latency. DevPort compiles your profile page into static components cached at Edge nodes.
                  </p>
                  <p>
                    When you save edits in your dashboard, we invoke <code className="bg-bg-code text-text-primary px-1.5 py-0.5 rounded text-xs border border-border-primary">revalidatePath</code>. The old cache is purged instantly, serving updated content in under 50ms worldwide.
                  </p>
                </div>
              </div>

              {/* CDN metrics visual mockup */}
              <div className="p-5 rounded-xl border border-border-primary bg-bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-border-primary/80 transition duration-300">
                <div className="flex items-center justify-between border-b border-border-primary pb-3 mb-4 text-xs font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <Server size={14} className="text-text-secondary" />
                    CDN ROUTING METRICS
                  </span>
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                    Edge active
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs text-text-secondary">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary uppercase text-[10px]">Edge Location</span>
                    <span className="font-semibold text-text-primary">LHR-1 (London)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary uppercase text-[10px]">Cache Status</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]">
                      HIT (Edge Cached)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary uppercase text-[10px]">Purge Trigger</span>
                    <span className="text-text-primary font-semibold text-[11px]">revalidatePath(&apos;/[username]&apos;)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary uppercase text-[10px]">Response Latency</span>
                    <span className="font-bold text-emerald-750 text-[13px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">18ms</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Technical Specs Stack Bento Grid */}
        <section className="space-y-12 border-t border-border-primary pt-20">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-tight">
              A high performance, modern architecture stack
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              We combined lightweight database routers, secure authorization frameworks, and edge invalidations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Supabase JSONB Records */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <Database size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">Supabase JSONB Records</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                We store details inside a Postgres JSONB document. This allows flexible portfolios with varying project and skill configurations without altering sql table setups.
              </p>
            </div>

            {/* PostgreSQL RLS Policies */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <Shield size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">PostgreSQL RLS Policies</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                Row-Level Security guarantees that only the authenticated user account holds write permission to their handle. Public guests are restricted to read-only queries on published routes.
              </p>
            </div>

            {/* Client-Side Storage Fallback */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <Cpu size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">Client-Side Storage Fallback</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                If credentials are omitted, the application automatically pivots to LocalStorage mode, allowing full functionality tests completely client-side.
              </p>
            </div>

            {/* Built-in visitor mailbox */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <Inbox size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">Built-in visitor mailbox</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                Portfolios include active message forms that store recruiter submissions directly inside database mailboxes, keeping correspondence organized.
              </p>
            </div>

            {/* Edge Cached Subdomains */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <RefreshCw size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">Edge Cached Subdomains</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                Subpaths (<code className="bg-bg-code text-text-primary px-1.5 py-0.5 rounded text-xs border border-border-primary">/[username]</code>) use dynamic routes compiled statically on request (<code className="bg-bg-code text-text-primary px-1.5 py-0.5 rounded text-xs border border-border-primary">force-static</code>), resolving queries at local edge hubs rather than database servers.
              </p>
            </div>

            {/* Zero cost hosting */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 space-y-4 group">
              <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit group-hover:bg-accent group-hover:text-text-inverse transition duration-350">
                <Code size={18} />
              </div>
              <h4 className="text-base font-bold text-text-primary">Zero cost hosting</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed font-normal">
                By utilizing Next.js, Vercel edge routes, and Supabase free-tier database limits, your portfolio runs at absolute zero cost indefinitely.
              </p>
            </div>

          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-12 border-t border-border-primary pt-20">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-normal">
              Everything you need to know about DevPort and zero-cost edge hosting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface/50 space-y-2">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Zap size={14} className="text-text-secondary" />
                How is hosting completely free?
              </h4>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-normal">
                We design sites around statically compiled pages. By rendering profiles statically, page delivery runs completely on Vercel&apos;s Edge CDN limits (which offer 100GB bandwidth free per month), bypassing expensive database query tiers.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface/50 space-y-2">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Shield size={14} className="text-text-secondary" />
                Are my resume details safe?
              </h4>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-normal">
                Yes. PDF processing happens completely in-browser. Your files are not stored on any backend disk storage. We extract the raw characters and stream them directly to the Gemini AI parser model API over HTTPS.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface/50 space-y-2">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <RefreshCw size={14} className="text-text-secondary" />
                Will my old URL stop working if I change it?
              </h4>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-normal">
                Yes. When you update your subpath handle in the dashboard, the old route is immediately updated and freed up for others to claim. Visits to the old link will automatically receive a clean 404 page.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-primary bg-bg-surface/50 space-y-2">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Inbox size={14} className="text-text-secondary" />
                How does the recruiter inbox work?
              </h4>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-normal">
                DevPort portfolios embed a contact message block. Submissions are stored inside a dedicated messaging table indexed by user accounts. You can inspect recruiter names, emails, and message text inside your panel.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Call to Action Card */}
        <section className="p-8 md:p-14 rounded-2xl border border-border-primary bg-bg-surface text-center space-y-8 relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Ready to deploy your dev portfolio?
            </h2>
            <p className="text-xs md:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed font-normal">
              Start from scratch or claim your custom subpath route in seconds. Zero setup required.
            </p>
          </div>

          <div className="inline-flex relative z-10">
            <Link 
              href="/login" 
              className="flex items-center gap-1.5 px-5 py-3 rounded-lg bg-accent hover:bg-accent-hover text-text-inverse font-semibold text-sm shadow-sm transition active:translate-y-0.5 cursor-pointer"
            >
              Get Started Free 
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-[1120px] mx-auto w-full px-6 py-10 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary relative z-10 font-medium">
        <div>
          &copy; {new Date().getFullYear()} devport. Built for developers with zero cost.
        </div>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-text-secondary transition">Terms</Link>
          <Link href="/privacy" className="hover:text-text-secondary transition">Privacy</Link>
          <a 
            href="https://github.com/Sparkyyy45/portfolio-maker" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-text-secondary transition flex items-center gap-1"
          >
            GitHub <Github size={12} />
          </a>
        </div>
      </footer>

    </div>
  );
}
