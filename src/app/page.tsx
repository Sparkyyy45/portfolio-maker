'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Layout,
  Globe,
  Share2,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: "Is it really free?",
    a: "Yes. Building and hosting your portfolio is 100% free forever. We'll introduce premium templates and custom domains later, but the core product remains free."
  },
  {
    q: "How does it know what to put on my portfolio?",
    a: "We analyze your public GitHub repositories, calculate your top languages, fetch your stars, and pull your bio. If you upload a PDF resume, our AI extracts your work experience and education to build a complete profile."
  },
  {
    q: "Can I use my own domain?",
    a: "Custom domains (like yourname.com) are coming next month. For now, you get a clean, professional devport.com/yourname link."
  },
  {
    q: "What if I don't have a lot of GitHub activity?",
    a: "That's exactly why we built the PDF import. Even if your GitHub is quiet, we can build a stunning portfolio using just your resume."
  },
  {
    q: "Can I edit the portfolio after it's generated?",
    a: "Absolutely. DevPort gives you a clean dashboard where you can edit copy, change themes, hide projects, and update your resume anytime."
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [handle, setHandle] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-border-primary/50">
        <div className="font-fraunces font-bold text-xl tracking-tight text-text-primary flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center">
            <Sparkles size={14} />
          </div>
          DevPort
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</a>
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="flex items-center gap-2 bg-text-primary text-bg-primary px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            Claim your link <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-warm-light text-warm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-warm/20">
          ✨ Free forever · No credit card required
        </div>
        
        <h1 className="font-fraunces text-5xl md:text-7xl font-bold text-text-primary leading-[1.1] mb-6 tracking-tight">
          Your portfolio, <br className="hidden md:block" />
          <span className="text-text-tertiary">built while you sleep.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop tweaking CSS and fighting with hosting. Connect your GitHub or upload your resume, and get a premium, recruiter-ready developer portfolio in 60 seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
            Build my portfolio free <ArrowRight size={16} />
          </Link>
          <Link href="/suyash23" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-bg-surface text-text-primary border border-border-primary px-8 py-3.5 rounded-full text-base font-medium hover:bg-bg-code transition-colors">
            See an example
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary font-medium">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Auto-syncs with GitHub</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> AI Resume Parsing</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Zero maintenance</span>
        </div>
      </header>

      {/* PRODUCT PREVIEW */}
      <section className="px-6 max-w-5xl mx-auto mb-32">
        <div className="bg-bg-primary rounded-2xl border border-border-primary shadow-2xl overflow-hidden">
          {/* Browser Chrome */}
          <div className="bg-bg-surface border-b border-border-primary px-4 py-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="bg-bg-primary text-text-secondary text-xs px-4 py-1.5 rounded flex-1 text-center font-mono border border-border-primary max-w-md mx-auto">
              devport.com/priyasharma
            </div>
          </div>
          
          {/* Mock Portfolio Content */}
          <div className="p-8 md:p-12 bg-white flex flex-col md:flex-row gap-12 items-start text-left">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Priya Sharma</h2>
              <p className="text-gray-500 text-lg mb-6">Full Stack Developer · React & Node.js</p>
              <p className="text-gray-600 leading-relaxed mb-8 max-w-lg">
                Building scalable web applications and intuitive user interfaces. Previously interned at Amazon. Passionate about open source and web accessibility.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900">E-Commerce Dashboard</h3>
                  <p className="text-sm text-gray-500 mt-1">Next.js · Tailwind · Prisma</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900">Real-time Chat App</h3>
                  <p className="text-sm text-gray-500 mt-1">React · Socket.io · Express</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-64 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">TypeScript</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">React</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">Node.js</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-border-primary bg-bg-surface py-12 px-6 text-center">
        <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-8">Trusted by students and fresh grads at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center max-w-4xl mx-auto opacity-60 grayscale font-fraunces font-bold text-xl md:text-2xl text-text-primary">
          <span>IIT Delhi</span>
          <span>BITS Pilani</span>
          <span>NIT Trichy</span>
          <span>VIT Vellore</span>
          <span>IIIT Hyderabad</span>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-center mb-16">
          Building a portfolio takes weeks you don't have.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-bg-surface p-8 rounded-2xl border border-border-primary">
            <h3 className="font-semibold text-lg mb-2">The Template Trap</h3>
            <p className="text-text-secondary leading-relaxed">You buy a React template, but it's full of complex code. You spend 3 days just trying to figure out how to change the primary color and update the projects list.</p>
          </div>
          <div className="bg-bg-surface p-8 rounded-2xl border border-border-primary">
            <h3 className="font-semibold text-lg mb-2">The Design Struggle</h3>
            <p className="text-text-secondary leading-relaxed">You try to code it from scratch. You spend 4 hours tweaking margins and drop shadows, and it still doesn't look as good as the ones on Awwwards.</p>
          </div>
          <div className="bg-bg-surface p-8 rounded-2xl border border-border-primary">
            <h3 className="font-semibold text-lg mb-2">The Update Chore</h3>
            <p className="text-text-secondary leading-relaxed">You finally build it, but then you finish a new project. You have to open VS Code, write the HTML, compress the image, and push to Vercel just to add one item.</p>
          </div>
          <div className="bg-accent-light p-8 rounded-2xl border border-accent-border">
            <h3 className="font-semibold text-lg mb-2 text-accent">The DevPort Solution</h3>
            <p className="text-text-secondary leading-relaxed">You give us your GitHub username or upload your PDF resume. We generate a stunning, deployed portfolio in 60 seconds. You never touch HTML again.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-bg-primary border-t border-border-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-center mb-16">
            From zero to deployed in 3 steps.
          </h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[28px] md:before:ml-[50%] before:-translate-x-px md:before:translate-x-0 before:w-0.5 before:bg-border-primary before:z-0">
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
              <div className="w-full md:w-5/12 md:text-right order-2 md:order-1">
                <span className="inline-block px-3 py-1 bg-accent-light text-accent text-xs font-bold rounded-full mb-3">Step 1</span>
                <h3 className="text-xl font-bold mb-2">Import your data</h3>
                <p className="text-text-secondary">Enter your GitHub username or upload your latest PDF resume. Our AI extracts your experience, skills, and top projects automatically.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white border-4 border-border-primary flex items-center justify-center font-fraunces font-bold text-xl text-text-tertiary group-hover:border-accent group-hover:text-accent transition-colors order-1 md:order-2 shrink-0 relative z-10 shadow-sm ml-0 md:ml-0">
                1
              </div>
              <div className="w-full md:w-5/12 order-3">
                <div className="bg-bg-surface p-4 rounded-xl border border-border-primary text-sm font-mono text-text-secondary">
                  &gt; Extracting PDF text...<br/>
                  &gt; Identifying work history...<br/>
                  &gt; Found 3 projects on GitHub
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
              <div className="w-full md:w-5/12 md:text-right order-2 md:order-1 md:invisible">
                {/* Spacer for layout */}
              </div>
              <div className="w-14 h-14 rounded-full bg-white border-4 border-border-primary flex items-center justify-center font-fraunces font-bold text-xl text-text-tertiary group-hover:border-accent group-hover:text-accent transition-colors order-1 md:order-2 shrink-0 relative z-10 shadow-sm ml-0 md:ml-0">
                2
              </div>
              <div className="w-full md:w-5/12 order-3 md:-ml-0">
                <span className="inline-block px-3 py-1 bg-warm-light text-warm text-xs font-bold rounded-full mb-3">Step 2</span>
                <h3 className="text-xl font-bold mb-2">Pick a premium theme</h3>
                <p className="text-text-secondary">Choose from our curated list of designer-crafted themes. From minimal typography to dark mode glassmorphism, they all look incredible.</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
              <div className="w-full md:w-5/12 md:text-right order-2 md:order-1">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold rounded-full mb-3">Step 3</span>
                <h3 className="text-xl font-bold mb-2">Claim your link</h3>
                <p className="text-text-secondary">Hit publish and instantly get a professional devport.com/yourname link to put on your resume and share with recruiters.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white border-4 border-border-primary flex items-center justify-center font-fraunces font-bold text-xl text-text-tertiary group-hover:border-accent group-hover:text-accent transition-colors order-1 md:order-2 shrink-0 relative z-10 shadow-sm ml-0 md:ml-0">
                3
              </div>
              <div className="w-full md:w-5/12 order-3">
                <div className="bg-bg-surface p-4 rounded-xl border border-border-primary flex items-center justify-center gap-2 font-medium">
                  <LinkIcon size={16} className="text-text-tertiary"/> devport.com/suyash
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold mb-4">Everything you need. Nothing you don't.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">We cut out the bloat so you can focus on what matters: looking good and getting hired.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Clock size={24} className="text-accent"/>, title: "60-Second Setup", desc: "No coding required. Just import, pick a theme, and publish." },
            { icon: <Layout size={24} className="text-accent"/>, title: "Premium Themes", desc: "Designed by professionals. Ensure you stand out from the crowd." },
            { icon: <Globe size={24} className="text-accent"/>, title: "Free Global Hosting", desc: "Your site is hosted on our edge network, blazing fast and always online." },
            { icon: <Share2 size={24} className="text-accent"/>, title: "Auto-Sync GitHub", desc: "Connect your account once, and your top repos update automatically." },
            { icon: <Sparkles size={24} className="text-accent"/>, title: "AI Resume Parser", desc: "Upload your PDF and our AI turns it into structured portfolio data." },
            { icon: <LinkIcon size={24} className="text-accent"/>, title: "Custom Links", desc: "Get a clean, memorable devport.com/name handle instantly." },
          ].map((feat, i) => (
            <div key={i} className="bg-bg-surface p-6 rounded-2xl border border-border-primary hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl border border-border-primary flex items-center justify-center text-2xl mb-4 shadow-sm">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-bg-surface border-y border-border-primary">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-center mb-16">Loved by developers</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-border-primary shadow-sm">
              <div className="flex text-warm mb-4">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary mb-6 leading-relaxed">"I spent a week trying to build a portfolio with Three.js. It looked cool but performed terribly. DevPort gave me a clean, recruiter-friendly site in exactly 2 minutes."</p>
              <div className="font-medium text-sm">
                <div className="text-text-primary">Arjun K.</div>
                <div className="text-text-secondary">Frontend Engineer</div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-border-primary shadow-sm relative md:-top-4">
              <div className="flex text-warm mb-4">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary mb-6 leading-relaxed">"The AI resume parser is literal magic. I uploaded the PDF I used for placements, and it extracted all my internships and projects perfectly. Easiest setup ever."</p>
              <div className="font-medium text-sm">
                <div className="text-text-primary">Sneha M.</div>
                <div className="text-text-secondary">New Grad SWE</div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-border-primary shadow-sm">
              <div className="flex text-warm mb-4">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary mb-6 leading-relaxed">"I don't have time to maintain a custom website. DevPort auto-syncs with my GitHub so my latest repos are always there. It's set-and-forget."</p>
              <div className="font-medium text-sm">
                <div className="text-text-primary">Rohit P.</div>
                <div className="text-text-secondary">Full Stack Developer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="font-fraunces text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="border border-border-primary rounded-xl overflow-hidden bg-bg-primary transition-all duration-200">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left font-semibold flex items-center justify-between focus:outline-none hover:bg-bg-surface transition-colors"
              >
                {item.q}
                {openFaq === index ? <ChevronUp size={20} className="text-text-tertiary shrink-0"/> : <ChevronDown size={20} className="text-text-tertiary shrink-0"/>}
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-text-secondary leading-relaxed border-t border-border-subtle pt-3">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-text-primary text-bg-primary rounded-[2rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Sparkles size={120} />
          </div>
          <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-6 relative z-10">Claim your link before someone else does.</h2>
          <p className="text-text-tertiary text-lg mb-10 max-w-xl mx-auto relative z-10">Join thousands of developers building beautiful portfolios without writing a single line of code.</p>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/login?handle=${handle}`;
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto relative z-10"
          >
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary font-medium select-none pointer-events-none">devport.com/</span>
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="username" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-3.5 pl-32 pr-6 text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full sm:w-auto shrink-0 bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-full font-bold transition-colors">
              Claim <ArrowRight size={16} className="inline ml-1"/>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border-primary py-12 px-6 text-center text-text-tertiary">
        <div className="flex items-center justify-center gap-2 mb-4 text-text-primary font-bold font-fraunces">
          <Sparkles size={16} className="text-accent" /> DevPort
        </div>
        <p className="mb-6">Portfolios for everyone.</p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
