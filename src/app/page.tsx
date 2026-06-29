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
  ChevronUp,
  Zap,
  Palette
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

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [handle, setHandle] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans overflow-x-hidden selection:bg-accent/20">
      
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center -z-10">
        <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-warm-light/40 blur-[100px] opacity-50"></div>
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-accent-light/40 blur-[120px] opacity-40"></div>
      </div>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="font-fraunces font-bold text-xl tracking-tight text-text-primary flex items-center gap-2 group cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center shadow-md shadow-accent/20 group-hover:scale-105 transition-transform">
            <Sparkles size={14} />
          </div>
          DevPort
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary bg-white/50 px-6 py-2.5 rounded-full border border-border-primary/50 shadow-sm backdrop-blur-md">
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</a>
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-text-primary transition-colors">Wall of Love</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-text-primary hidden sm:block px-4 py-2">
            Log in
          </Link>
          <Link href="/login" className="flex items-center gap-2 bg-text-primary text-bg-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-text-secondary transition-colors shadow-lg shadow-text-primary/10 hover:shadow-xl hover:shadow-text-primary/20 hover:-translate-y-0.5 active:translate-y-0">
            Start for free <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-24 px-6 text-center max-w-5xl mx-auto relative">
        <motion.div variants={STAGGER} initial="hidden" animate="show" className="relative z-10 flex flex-col items-center">
          
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-xs font-semibold mb-8 border border-border-primary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Join 500+ developers shipping portfolios faster
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="font-fraunces text-[3.5rem] md:text-[5.5rem] font-bold text-text-primary leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
            Your developer portfolio, <br className="hidden md:block" />
            <span className="text-text-tertiary italic font-medium">built while you sleep.</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            You're a developer, not a web designer. Stop fighting with CSS layouts and custom domains. Import your GitHub or resume, pick a premium theme, and launch a recruiter-magnet site in 60 seconds.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
            <Link href="/login" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-accent-hover transition-all shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
              Build your portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-text-primary border border-border-primary px-8 py-4 rounded-full text-base font-semibold hover:bg-bg-surface transition-colors shadow-sm">
              View how it works (Demo)
            </Link>
          </motion.div>

        </motion.div>
      </section>



      {/* PROBLEM / SOLUTION CONTRAST */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER}
          className="text-center mb-16"
        >
          <motion.h2 variants={FADE_UP} className="font-fraunces text-3xl md:text-5xl font-bold mb-4">
            Building a portfolio is a chore.
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-text-secondary text-lg max-w-2xl mx-auto">
            You've got code to write and interviews to prep for. You shouldn't be fighting with margins and flexbox just to show off your work.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-bg-surface p-8 md:p-10 rounded-[2rem] border border-border-primary"
          >
            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-6">The Old Way</div>
            <h3 className="font-fraunces font-bold text-2xl mb-4">Wasted Weekends</h3>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span> Buy a bloated template and spend hours ripping out code you don't need.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span> Code from scratch and struggle to make it look professional.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span> Manually update HTML every time you finish a new project or internship.
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-accent-light p-8 md:p-10 rounded-[2rem] border border-accent-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
              <Sparkles size={160} />
            </div>
            <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-6 relative z-10">The DevPort Way</div>
            <h3 className="font-fraunces font-bold text-2xl mb-4 text-accent relative z-10">Shipped in Seconds</h3>
            <ul className="space-y-4 text-text-secondary relative z-10">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span> Type in your GitHub username or upload a PDF resume.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span> Select a premium, designer-crafted theme that actually looks good.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">✓</span> Hit publish. Your live link is instantly ready to share.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 border-y border-border-primary bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-fraunces text-3xl md:text-5xl font-bold mb-4">
              How the magic works
            </h2>
          </div>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-[28px] md:before:ml-[50%] before:-translate-x-px md:before:translate-x-0 before:w-0.5 before:bg-border-primary before:z-0">
            
            {[
              { 
                step: 1, 
                tag: "Step 1", 
                tagColor: "bg-accent-light text-accent",
                title: "Import your context", 
                desc: "Don't type out your bio again. Give us your GitHub or upload your resume, and our parser pulls your best work instantly.",
                visual: (
                  <div className="bg-bg-surface p-5 rounded-xl border border-border-primary shadow-sm text-sm font-mono text-text-secondary">
                    <span className="text-accent">❯</span> Analyzing github.com/suyash<br/>
                    <span className="text-accent">❯</span> Found 18 public repositories<br/>
                    <span className="text-emerald-500">✔</span> Extracted top languages & stats
                  </div>
                )
              },
              { 
                step: 2, 
                tag: "Step 2", 
                tagColor: "bg-warm-light text-warm",
                title: "Pick a premium theme", 
                desc: "Choose from our curated collection of themes. Whether you want minimal typography or dark mode glassmorphism, it's one click away.",
                visual: (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border-2 border-accent p-2 shadow-sm">
                      <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                      <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-2 opacity-50 hover:opacity-100 transition-opacity">
                      <div className="w-full h-16 bg-gray-800 rounded mb-2"></div>
                      <div className="w-2/3 h-2 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                )
              },
              { 
                step: 3, 
                tag: "Step 3", 
                tagColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
                title: "Claim your dev link", 
                desc: "Publish your site and instantly get a clean devport.com/yourname link to put on your resume and LinkedIn.",
                visual: (
                  <div className="bg-white p-5 rounded-xl border border-border-primary shadow-sm flex items-center justify-center gap-2 font-medium text-lg">
                    <LinkIcon size={20} className="text-text-tertiary"/> devport.com/<span className="text-accent">suyash</span>
                  </div>
                )
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group"
              >
                <div className={`w-full md:w-5/12 ${i % 2 === 0 ? 'md:text-right order-2 md:order-1' : 'order-2 md:order-3'}`}>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${item.tagColor}`}>{item.tag}</span>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">{item.desc}</p>
                </div>
                
                <div className={`w-14 h-14 rounded-full bg-white border-4 border-border-primary flex items-center justify-center font-fraunces font-bold text-xl text-text-tertiary group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-300 ${i % 2 === 0 ? 'order-1 md:order-2' : 'order-1 md:order-2'} shrink-0 relative z-10 shadow-sm ml-0 md:ml-0`}>
                  {item.step}
                </div>
                
                <div className={`w-full md:w-5/12 ${i % 2 === 0 ? 'order-3 md:order-3' : 'order-3 md:order-1'}`}>
                  {item.visual}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - BENTO BOX GRID */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={STAGGER}
          className="text-center mb-16"
        >
          <motion.h2 variants={FADE_UP} className="font-fraunces text-3xl md:text-5xl font-bold mb-4">Everything you need.</motion.h2>
          <motion.p variants={FADE_UP} className="text-text-secondary text-lg max-w-2xl mx-auto">
            We cut out the complex dashboard bloat. Just the absolute essentials to make you look like a top-tier engineer.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          {/* Large Card 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-bg-surface p-8 rounded-3xl border border-border-primary hover:border-accent/40 transition-colors flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Layout size={200} />
            </div>
            <div className="relative z-10 mb-20 md:mb-32">
              <div className="w-12 h-12 bg-white rounded-xl border border-border-primary flex items-center justify-center mb-6 shadow-sm">
                <Palette size={24} className="text-accent"/>
              </div>
              <h3 className="font-fraunces font-bold text-3xl mb-3">Designer-Crafted Themes</h3>
              <p className="text-text-secondary text-lg max-w-md">Stop browsing Awwwards feeling inadequate. Our themes are built by product designers, guaranteeing you look incredibly polished.</p>
            </div>
          </motion.div>

          {/* Square Card 1 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-bg-surface p-8 rounded-3xl border border-border-primary hover:border-accent/40 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-xl border border-border-primary flex items-center justify-center mb-6 shadow-sm">
              <Zap size={24} className="text-accent"/>
            </div>
            <h3 className="font-bold text-xl mb-3">60-Second Setup</h3>
            <p className="text-text-secondary">No coding, no dragging and dropping. Connect your data and you're done.</p>
          </motion.div>

          {/* Square Card 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-bg-surface p-8 rounded-3xl border border-border-primary hover:border-accent/40 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-xl border border-border-primary flex items-center justify-center mb-6 shadow-sm">
              <Globe size={24} className="text-accent"/>
            </div>
            <h3 className="font-bold text-xl mb-3">Global Edge Hosting</h3>
            <p className="text-text-secondary">Your site is deployed on Vercel's edge network. Always fast, always up.</p>
          </motion.div>

          {/* Large Card 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 bg-text-primary text-bg-primary p-8 rounded-3xl border border-text-secondary hover:border-text-tertiary transition-colors flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 group-hover:translate-x-0 transition-transform duration-700">
              <Sparkles size={250} />
            </div>
            <div className="relative z-10 mb-8 md:mb-12">
              <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                <Share2 size={24} className="text-white"/>
              </div>
              <h3 className="font-fraunces font-bold text-3xl mb-3">Auto-Syncing Resumes</h3>
              <p className="text-text-tertiary text-lg max-w-md">Our intelligence engine parses your uploaded PDFs or reads your GitHub to keep your portfolio automatically updated with your latest wins.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS - MASONRY / STAGGERED */}
      <section id="testimonials" className="py-24 px-6 bg-white border-y border-border-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-fraunces text-3xl md:text-5xl font-bold mb-4">Loved by engineers</h2>
            <p className="text-text-secondary text-lg">Don't just take our word for it.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="bg-bg-surface p-8 rounded-3xl border border-border-primary shadow-sm"
            >
              <div className="flex text-warm mb-6">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary text-lg mb-8 leading-relaxed font-medium">
                "I spent a week trying to build a portfolio with Three.js. It looked cool but performed terribly on mobile. <span className="bg-warm-light px-1">DevPort gave me a beautiful site in 2 minutes.</span>"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">AK</div>
                <div>
                  <div className="text-text-primary font-bold">Arjun K.</div>
                  <div className="text-text-tertiary text-sm">Frontend Engineer</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-bg-surface p-8 rounded-3xl border border-border-primary shadow-sm md:mt-12"
            >
              <div className="flex text-warm mb-6">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary text-lg mb-8 leading-relaxed font-medium">
                "The PDF parser is literal magic. I uploaded the resume I used for placements, and <span className="bg-emerald-100 px-1">it extracted all my internships and projects perfectly</span>. Easiest setup ever."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">SM</div>
                <div>
                  <div className="text-text-primary font-bold">Sneha M.</div>
                  <div className="text-text-tertiary text-sm">New Grad SWE</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-bg-surface p-8 rounded-3xl border border-border-primary shadow-sm md:mt-4"
            >
              <div className="flex text-warm mb-6">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={16} className="fill-current"/>)}
              </div>
              <p className="text-text-primary text-lg mb-8 leading-relaxed font-medium">
                "I don't have time to maintain a custom website. <span className="bg-accent-light text-accent-hover px-1">DevPort auto-syncs with my GitHub</span> so my latest repos are always there. It's set-and-forget."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">RP</div>
                <div>
                  <div className="text-text-primary font-bold">Rohit P.</div>
                  <div className="text-text-tertiary text-sm">Full Stack Developer</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="font-fraunces text-3xl md:text-5xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="border border-border-primary rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 text-left font-bold text-lg flex items-center justify-between focus:outline-none"
              >
                {item.q}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-bg-surface text-text-primary' : 'bg-transparent text-text-tertiary'}`}>
                  {openFaq === index ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </div>
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 text-text-secondary text-lg leading-relaxed pt-2">
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
        <div className="max-w-5xl mx-auto bg-text-primary text-bg-primary rounded-[3rem] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Background for CTA */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50"></div>
          
          <h2 className="font-fraunces text-4xl md:text-6xl font-bold mb-6 relative z-10 tracking-tight">
            Claim your link before <br className="hidden md:block"/> someone else does.
          </h2>
          <p className="text-text-tertiary text-xl mb-12 max-w-2xl mx-auto relative z-10">
            Join the developers building beautiful, fast portfolios without touching a single line of CSS.
          </p>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/login?handle=${handle}`;
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto relative z-10"
          >
            <div className="relative w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary font-medium select-none pointer-events-none">devport.com/</span>
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="yourname" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-36 pr-6 text-white placeholder-white/40 focus:outline-none focus:border-accent focus:bg-white/15 transition-all text-lg font-medium"
                required
              />
            </div>
            <button type="submit" className="w-full sm:w-auto shrink-0 bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full font-bold text-lg transition-colors shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Claim <ArrowRight size={18} className="inline ml-1 -mt-0.5"/>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border-primary py-16 px-6 text-center text-text-tertiary">
        <div className="flex items-center justify-center gap-2 mb-4 text-text-primary font-bold font-fraunces text-xl">
          <div className="w-6 h-6 rounded bg-text-primary text-white flex items-center justify-center">
            <Sparkles size={12} />
          </div>
          DevPort
        </div>
        <p className="mb-8 font-medium">Portfolios for everyone.</p>
        <div className="flex items-center justify-center gap-8 text-sm font-semibold">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-text-primary transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
