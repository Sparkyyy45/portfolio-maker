'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Github, FileText, Sparkles, Plus, ArrowRight, Check, Loader2, 
  Eye, RefreshCw, BarChart2, MessageSquare, Terminal, Layout, Palette, 
  Smile, User, Globe, ShieldAlert
} from 'lucide-react';
import DemoTourBanner from '@/components/DemoTourBanner';
import PortfolioPreview from '@/components/PortfolioPreview';
import { fetchGitHubData } from '@/utils/github';
import { INITIAL_PORTFOLIO_CONTENT } from '@/utils/constants';
import { PortfolioContent, SectionsVisibility } from '@/types/portfolio';

export default function DemoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'github' | 'resume' | 'blank'>('github');
  
  // Custom Portfolio State
  const [content, setContent] = useState<PortfolioContent>(INITIAL_PORTFOLIO_CONTENT);
  const [username, setUsername] = useState('johndoe');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  
  // Input fields
  const [gitUsername, setGitUsername] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [gitError, setGitError] = useState('');
  const [resumeError, setResumeError] = useState('');

  // Customize Screen Tab
  const [editorTab, setEditorTab] = useState<'design' | 'profile'>('design');

  // Dashboard Stats & Messages
  const [stats, setStats] = useState({ views: 284, clicks: 47, emails: 12 });
  const [mockMessages, setMockMessages] = useState([
    {
      id: '1',
      visitor_name: 'Sarah Jenkins (Stripe)',
      visitor_email: 'sarah.j@stripe.com',
      message_content: 'Hey! Loved your open-source projects on GitHub. We are looking for a Senior React Engineer. Let\'s schedule a call!',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
    },
    {
      id: '2',
      visitor_name: 'David Chen (Vercel)',
      visitor_email: 'd.chen@vercel.com',
      message_content: 'Impressive page performance! I saw your Terminal template. Are you open to freelance contracts starting next month?',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString() // 26 hours ago
    }
  ]);

  // Deployment Steps animation state
  const [deployStep, setDeployStep] = useState(0);
  const deploySteps = [
    'Verifying username availability...',
    'Compiling Tailwind layout configurations...',
    'Generating responsive static site files...',
    'Optimizing profile & project asset payloads...',
    'Uploading static bundle to Vercel edge servers...',
    'Provisioning custom SSL certificates...',
    'Portfolio live at devport.me/demo/'
  ];

  // Auto scroll preview when templates change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [step]);

  // Handle GitHub Sync
  const handleGitHubImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUsername.trim()) return;
    setLoadingState('Syncing with GitHub...');
    setGitError('');
    try {
      const data = await fetchGitHubData(gitUsername.trim());
      setContent({
        ...INITIAL_PORTFOLIO_CONTENT,
        ...data,
        hero: {
          ...INITIAL_PORTFOLIO_CONTENT.hero,
          ...data.hero,
          socials: {
            ...INITIAL_PORTFOLIO_CONTENT.hero.socials,
            ...data.hero?.socials,
            github: gitUsername.trim()
          }
        }
      });
      setUsername(gitUsername.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''));
      setStep(2);
    } catch (err: any) {
      setGitError(err.message || 'Failed to fetch GitHub data.');
    } finally {
      setLoadingState('');
    }
  };

  // Handle Resume Text Parser
  const handleResumeTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setLoadingState('Analyzing resume with Gemini AI...');
    setResumeError('');
    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resumeText }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Parsing failed');
      }
      const data = await response.json();
      setContent({
        ...INITIAL_PORTFOLIO_CONTENT,
        ...data,
      });
      setStep(2);
    } catch (err: any) {
      setResumeError(err.message || 'Failed to parse resume text. Try starting blank.');
    } finally {
      setLoadingState('');
    }
  };

  // Handle Start Blank
  const handleStartBlank = () => {
    setContent(INITIAL_PORTFOLIO_CONTENT);
    setStep(2);
  };

  // Simulate deployment sequence
  useEffect(() => {
    if (step !== 4) return;
    setDeployStep(0);
    const interval = setInterval(() => {
      setDeployStep((prev) => {
        if (prev < deploySteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Redirect on complete
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(`demo-portfolio-${username}`, JSON.stringify(content));
              router.push(`/demo/${username}`);
            }
          }, 1500);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [step, username, content, router]);

  // Design/Theme changes
  const handleThemeChange = (selectedTheme: any) => {
    setContent((prev) => ({ ...prev, theme: selectedTheme }));
  };

  const handleTemplateChange = (selectedTemplate: any) => {
    setContent((prev) => ({ ...prev, template: selectedTemplate }));
  };

  const handleFontPairChange = (selectedFontPair: string) => {
    setContent((prev) => ({ ...prev, font_pair: selectedFontPair }));
  };

  const handleSectionVisibilityToggle = (section: keyof SectionsVisibility) => {
    setContent((prev) => {
      const visibility = prev.sections_visibility || {
        experience: true, projects: true, github_repos: true, skills: true,
        leetcode: true, education: true, certifications: true, contact: true
      };
      return {
        ...prev,
        sections_visibility: {
          ...visibility,
          [section]: !visibility[section]
        }
      };
    });
  };

  // Profile text change
  const handleProfileChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-600/30">
      {/* GUIDE BAR */}
      <DemoTourBanner 
        step={step} 
        onNext={() => {
          if (step === 2) setStep(3);
          else if (step === 3) setStep(4);
        }}
        nextLabel={step === 2 ? 'Go to Dashboard ➔' : step === 3 ? 'Deploy Live Site 🚀' : undefined}
      />

      {/* RENDER STEP SCREENS */}
      <div className="pt-20">
        
        {/* STEP 1: IMPORT DATA */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="px-3 py-1 text-4xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/50 border border-indigo-900 rounded-full">
                Step 1 of 4
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                How should we build your profile?
              </h1>
              <p className="text-sm text-zinc-400">
                Instantly generate a premium developer website by connecting your GitHub or pasting a resume.
              </p>
            </div>

            {/* Import Tabs Container */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="flex border-b border-zinc-800 p-2 bg-zinc-950/40">
                <button
                  onClick={() => setActiveTab('github')}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'github' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Github size={16} /> Connect GitHub
                </button>
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'resume' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText size={16} /> AI Resume Parser
                </button>
                <button
                  onClick={() => setActiveTab('blank')}
                  className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'blank' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Plus size={16} /> Start Blank
                </button>
              </div>

              <div className="p-8">
                {/* GitHub Option */}
                {activeTab === 'github' && (
                  <form onSubmit={handleGitHubImport} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-400 tracking-wider">GitHub Username</label>
                      <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-3 focus-within:border-indigo-500 transition">
                        <Github size={18} className="text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. torvalds"
                          value={gitUsername}
                          onChange={(e) => setGitUsername(e.target.value)}
                          className="bg-transparent border-none outline-none flex-1 text-sm text-zinc-100 placeholder-zinc-600 font-medium"
                          disabled={!!loadingState}
                        />
                      </div>
                      <p className="text-3xs text-zinc-500">We will load your avatar, repository list, and contact links instantly.</p>
                    </div>

                    {gitError && <div className="p-3.5 rounded-xl border border-red-950/50 bg-red-950/20 text-red-400 text-2xs font-semibold">{gitError}</div>}

                    <button
                      type="submit"
                      disabled={!gitUsername.trim() || !!loadingState}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/10 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingState ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {loadingState}
                        </>
                      ) : (
                        <>
                          Sync GitHub Details <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* AI Resume Option */}
                {activeTab === 'resume' && (
                  <form onSubmit={handleResumeTextSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-400 tracking-wider">Paste Resume Content (Text)</label>
                      <textarea
                        rows={8}
                        placeholder="Paste your resume contents or work experience profile text here. Our Gemini AI pipeline will parse and categorize it instantly..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 outline-none resize-none font-medium"
                        disabled={!!loadingState}
                      />
                    </div>

                    {resumeError && <div className="p-3.5 rounded-xl border border-red-950/50 bg-red-950/20 text-red-400 text-2xs font-semibold">{resumeError}</div>}

                    <button
                      type="submit"
                      disabled={!resumeText.trim() || !!loadingState}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/10 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingState ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> {loadingState}
                        </>
                      ) : (
                        <>
                          Parse with Gemini AI <Sparkles size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Blank Option */}
                {activeTab === 'blank' && (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-xs text-zinc-400 font-medium">Create a profile from scratch using our visual customization controls.</p>
                    <button
                      onClick={handleStartBlank}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/10 transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                    >
                      Start Blank Portfolio <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMIZE LAYOUT */}
        {step === 2 && (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] border-t border-zinc-800">
            {/* Editor Sidebar */}
            <div className="w-full lg:w-96 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0">
              {/* Tab Selector */}
              <div className="flex border-b border-zinc-800 p-2">
                <button
                  onClick={() => setEditorTab('design')}
                  className={`flex-1 py-2 px-3 rounded-lg text-2xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorTab === 'design' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Palette size={14} /> Design Styles
                </button>
                <button
                  onClick={() => setEditorTab('profile')}
                  className={`flex-1 py-2 px-3 rounded-lg text-2xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorTab === 'profile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <User size={14} /> Profile Text
                </button>
              </div>

              {/* Sidebar Content Scroll */}
              <div className="p-5 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
                {editorTab === 'design' ? (
                  <>
                    {/* Templates Selector */}
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Layout Template</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'minimal', label: 'Minimalist' },
                          { id: 'bento', label: 'Bento Grid' },
                          { id: 'brutalist', label: 'Neo-Brutalist' },
                          { id: 'terminal', label: 'CLI Terminal' },
                          { id: 'glass', label: 'Glassmorphism' },
                          { id: 'deck', label: 'Slide Deck' },
                          { id: 'timeline', label: 'Timeline View' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleTemplateChange(t.id)}
                            className={`p-3 rounded-xl border text-left text-2xs font-bold cursor-pointer transition ${
                              content.template === t.id 
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Themes Selector */}
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Color Themes</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'light', label: 'Classic Light' },
                          { id: 'dark', label: 'Dark Mode' },
                          { id: 'dracula', label: 'Dracula' },
                          { id: 'nord', label: 'Nord Ice' },
                          { id: 'cyberpunk', label: 'Cyberpunk' },
                          { id: 'synthwave', label: 'Synthwave' },
                          { id: 'latte', label: 'Caffè Latte' }
                        ].map((th) => (
                          <button
                            key={th.id}
                            onClick={() => handleThemeChange(th.id)}
                            className={`p-3 rounded-xl border text-left text-2xs font-bold cursor-pointer transition ${
                              content.theme === th.id 
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                            }`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Pair selector */}
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Typography Fonts</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'modern', label: 'Inter / Sans' },
                          { id: 'serif', label: 'Editorial Serif' },
                          { id: 'mono', label: 'Fira Code / Mono' },
                          { id: 'editorial', label: 'Outfit Serif' }
                        ].map((fp) => (
                          <button
                            key={fp.id}
                            onClick={() => handleFontPairChange(fp.id)}
                            className={`p-3 rounded-xl border text-left text-2xs font-bold cursor-pointer transition ${
                              content.font_pair === fp.id 
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                            }`}
                          >
                            {fp.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sections Visibility */}
                    <div className="space-y-2">
                      <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Show/Hide Sections</label>
                      <div className="space-y-1.5">
                        {[
                          { id: 'experience', label: 'Work Experience' },
                          { id: 'projects', label: 'Featured Projects' },
                          { id: 'github_repos', label: 'GitHub Repositories' },
                          { id: 'skills', label: 'Technical Skills' },
                          { id: 'leetcode', label: 'LeetCode Statistics' },
                          { id: 'education', label: 'Education' }
                        ].map((sec) => {
                          const isVisible = (content.sections_visibility as any)?.[sec.id] !== false;
                          return (
                            <button
                              key={sec.id}
                              onClick={() => handleSectionVisibilityToggle(sec.id as any)}
                              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-2xs font-semibold cursor-pointer hover:bg-zinc-900 transition"
                            >
                              <span className={isVisible ? 'text-zinc-200' : 'text-zinc-500 line-through'}>{sec.label}</span>
                              <div className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                                isVisible ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-zinc-700 text-transparent'
                              }`}>
                                <Check size={10} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Profile details */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Display Name</label>
                        <input
                          type="text"
                          value={content.hero.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-3 text-xs font-semibold outline-none focus:border-indigo-500 text-zinc-100"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Subtitle / Role Title</label>
                        <input
                          type="text"
                          value={content.hero.tagline}
                          onChange={(e) => handleProfileChange('tagline', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-3 text-xs font-semibold outline-none focus:border-indigo-500 text-zinc-100"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Profile Bio</label>
                        <textarea
                          rows={4}
                          value={content.hero.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-3 text-xs font-semibold outline-none focus:border-indigo-500 text-zinc-100 resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sandbox Live Frame Render */}
            <div className="flex-1 bg-zinc-900/30 overflow-y-auto p-4 sm:p-8 flex items-start justify-center max-h-[calc(100vh-5rem)]">
              <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500/20 z-10" />
                <div className="p-3 bg-zinc-950/80 border-b border-zinc-850 flex items-center justify-between text-3xs font-bold text-zinc-500 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-zinc-600">Preview Mode</span>
                  </div>
                  <span className="font-mono text-zinc-600">devport.me/demo/{username}</span>
                </div>
                <div className="relative">
                  <PortfolioPreview data={content} isDemo={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EXPLORE DASHBOARD */}
        {step === 3 && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 text-4xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/50 border border-indigo-900 rounded-full">
                  Step 3 of 4
                </span>
                <h1 className="text-2xl font-black">Your Sandbox Admin Dashboard</h1>
                <p className="text-xs text-zinc-400 font-medium">Replicating views, outbound recruiter clicks, and message telemetry.</p>
              </div>
            </div>

            {/* Grid Layout Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Details Panel */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Analytics summary */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                    <BarChart2 size={16} className="text-indigo-400" /> Dynamic Analytics (Last 30 Days)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-center space-y-1">
                      <div className="text-2xl font-black text-white">{stats.views}</div>
                      <div className="text-4xs font-extrabold text-zinc-500 uppercase tracking-widest">Page Views</div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-center space-y-1">
                      <div className="text-2xl font-black text-emerald-400">{stats.clicks}</div>
                      <div className="text-4xs font-extrabold text-zinc-500 uppercase tracking-widest">Recruiter Clicks</div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-center space-y-1">
                      <div className="text-2xl font-black text-indigo-400">{stats.emails}</div>
                      <div className="text-4xs font-extrabold text-zinc-500 uppercase tracking-widest">Emails Sent</div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Messages */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span className="flex items-center gap-2"><MessageSquare size={16} className="text-indigo-400" /> Messages Inbound</span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-3xs text-zinc-400">{mockMessages.length} total</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-3xs font-extrabold uppercase text-zinc-500">
                          <span>{msg.visitor_name} &lt;{msg.visitor_email}&gt;</span>
                          <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-2xs text-zinc-300 font-medium leading-relaxed">{msg.message_content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Settings Panel */}
              <div className="space-y-6">
                
                {/* Claim handle banner */}
                <div className="bg-zinc-900 border border-indigo-900/60 bg-gradient-to-br from-indigo-950/20 to-zinc-900 p-6 rounded-2xl space-y-4 shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl" />
                  <div className="space-y-1.5 relative">
                    <h3 className="text-xs font-black text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <Globe size={14} /> Ready to Publish?
                    </h3>
                    <p className="text-2xs text-zinc-300 font-medium leading-relaxed">
                      Launch your portfolio to our global Content Delivery Network. You can view, share, and track recruiter clicks live.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-3xs font-extrabold uppercase text-zinc-500 tracking-wider">Claim Subpath Handle</label>
                    <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-xl p-3 focus-within:border-indigo-500 transition">
                      <span className="text-zinc-600 text-xs font-bold pr-1 select-none">devport.me/</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        className="bg-transparent border-none outline-none flex-1 text-xs text-zinc-100 font-bold placeholder-zinc-700"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(4)}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Publish Sandbox Portfolio <ArrowRight size={12} />
                  </button>
                </div>

                {/* Simulated Features Guide */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wide flex items-center gap-1.5">
                    💡 Did you know?
                  </h3>
                  <div className="space-y-3 text-3xs text-zinc-400 font-medium">
                    <p className="leading-relaxed">
                      ✨ **Outbound Tracking:** If a recruiter clicks on your Email link, GitHub button, or resume download on your live site, the clicks are instantly recorded and piped to your dashboard.
                    </p>
                    <p className="leading-relaxed">
                      ⚡ **Ultra-Fast SSR:** DevPort profiles are generated using server-side rendering, guaranteeing near-zero load times and perfect SEO ratings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SIMULATED DEPLOYMENT OVERLAY */}
        {step === 4 && (
          <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-850 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
              
              <div className="space-y-4">
                <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 relative">
                  <Loader2 size={24} className="animate-spin text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-zinc-100">Deploying Portfolio</h2>
                  <p className="text-3xs text-indigo-400 font-bold uppercase tracking-wider">Building on edge nodes...</p>
                </div>
              </div>

              {/* Status checklist */}
              <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-850/80 text-left font-mono space-y-2 max-h-56 overflow-hidden">
                {deploySteps.slice(0, deployStep + 1).map((s, idx) => {
                  const isActive = idx === deployStep;
                  return (
                    <div 
                      key={idx} 
                      className={`text-3xs flex items-center gap-2 transition duration-300 ${
                        isActive ? 'text-indigo-400 font-bold' : 'text-zinc-500'
                      }`}
                    >
                      {isActive ? (
                        <Loader2 size={12} className="animate-spin shrink-0" />
                      ) : (
                        <Check size={12} className="text-emerald-500 shrink-0" />
                      )}
                      <span>{s}</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-4xs text-zinc-500 leading-relaxed">
                SSL certificates are provisioned automatically. Redirecting to your live URL on completion.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
