'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Github, FileText, Sparkles, Plus, ArrowRight, Check, Loader2, 
  BarChart2, MessageSquare, Palette, User, Globe
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
  
  // Input fields
  const [gitUsername, setGitUsername] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loadingState, setLoadingState] = useState('');
  const [gitError, setGitError] = useState('');
  const [resumeError, setResumeError] = useState('');

  // Customize Screen Tab
  const [editorTab, setEditorTab] = useState<'design' | 'profile'>('design');

  // Dashboard Stats & Messages
  const [stats] = useState({ views: 284, clicks: 47, emails: 12 });
  const [mockMessages] = useState([
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
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans relative overflow-hidden selection:bg-accent/30">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none" />
      
      {/* Loading Overlay */}
      {loadingState && (
        <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="animate-spin text-accent" />
          <p className="text-sm font-semibold text-text-secondary">{loadingState}</p>
        </div>
      )}

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
      <div className="pt-20 flex-1 flex flex-col relative z-10">
        
        {/* STEP 1: IMPORT DATA */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto px-6 py-12 w-full flex-1 flex flex-col justify-center">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <div className="w-fit text-[11px] font-semibold text-text-secondary uppercase bg-bg-primary px-3 py-1 rounded-full border border-border-primary shadow-2xs mx-auto">
                Stage 1 of 4
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                How should we build your profile?
              </h1>
              <p className="text-sm text-text-secondary max-w-lg mx-auto">
                Instantly generate a premium developer website by connecting your GitHub or pasting a resume.
              </p>
            </div>

            {/* Import Tabs Container */}
            <div className="bg-bg-surface border border-border-primary rounded-2xl overflow-hidden shadow-md max-w-xl mx-auto w-full">
              <div className="flex border-b border-border-primary p-1.5 bg-bg-primary/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('github')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'github' ? 'bg-bg-surface text-text-primary shadow-sm border border-border-primary/50' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Github size={15} /> Connect GitHub
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resume')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'resume' ? 'bg-bg-surface text-text-primary shadow-sm border border-border-primary/50' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <FileText size={15} /> AI Resume Parser
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('blank')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'blank' ? 'bg-bg-surface text-text-primary shadow-sm border border-border-primary/50' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Plus size={15} /> Start Blank
                </button>
              </div>

              <div className="p-6">
                {/* GitHub Option */}
                {activeTab === 'github' && (
                  <form onSubmit={handleGitHubImport} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">GitHub Username</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. torvalds"
                        value={gitUsername}
                        onChange={(e) => setGitUsername(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                        disabled={!!loadingState}
                      />
                      <p className="text-[10px] text-text-tertiary">We will load your avatar, repository list, and contact links instantly.</p>
                    </div>

                    {gitError && <p className="text-rose-500 text-2xs font-semibold">{gitError}</p>}

                    <button
                      type="submit"
                      disabled={!gitUsername.trim() || !!loadingState}
                      className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Sync GitHub Details <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* AI Resume Option */}
                {activeTab === 'resume' && (
                  <form onSubmit={handleResumeTextSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Paste Resume Content (Text)</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Paste your resume content or work experience profile text here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="w-full h-28 px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent resize-none font-medium"
                        disabled={!!loadingState}
                      />
                    </div>

                    {resumeError && <p className="text-rose-500 text-2xs font-semibold">{resumeError}</p>}

                    <button
                      type="submit"
                      disabled={!resumeText.trim() || !!loadingState}
                      className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Parse with Gemini AI <Sparkles size={14} />
                    </button>
                  </form>
                )}

                {/* Blank Option */}
                {activeTab === 'blank' && (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-text-secondary font-medium">Create a profile from scratch using our visual customization controls.</p>
                    <button
                      type="button"
                      onClick={handleStartBlank}
                      className="px-5 py-2 bg-accent hover:bg-accent-hover text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
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
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] border-t border-border-primary relative z-10">
            {/* Editor Sidebar */}
            <div className="w-full lg:w-96 bg-bg-surface border-r border-border-primary flex flex-col shrink-0">
              {/* Tab Selector */}
              <div className="flex border-b border-border-primary p-1.5 bg-bg-primary/30">
                <button
                  onClick={() => setEditorTab('design')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorTab === 'design' ? 'bg-bg-surface text-text-primary shadow-xs border border-border-primary/50' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Palette size={14} /> Design Styles
                </button>
                <button
                  onClick={() => setEditorTab('profile')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorTab === 'profile' ? 'bg-bg-surface text-text-primary shadow-xs border border-border-primary/50' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <User size={14} /> Profile Text
                </button>
              </div>

              {/* Sidebar Content Scroll */}
              <div className="p-5 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-9rem)]">
                {editorTab === 'design' ? (
                  <>
                    {/* Templates Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Layout Template</label>
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
                            className={`p-2.5 rounded-lg border text-left text-2xs font-semibold cursor-pointer transition ${
                              content.template === t.id 
                                ? 'bg-accent/5 border-accent text-accent font-bold' 
                                : 'bg-bg-primary/50 border-border-primary text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Themes Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Color Themes</label>
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
                            className={`p-2.5 rounded-lg border text-left text-2xs font-semibold cursor-pointer transition ${
                              content.theme === th.id 
                                ? 'bg-accent/5 border-accent text-accent font-bold' 
                                : 'bg-bg-primary/50 border-border-primary text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                            }`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Pair selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Typography Fonts</label>
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
                            className={`p-2.5 rounded-lg border text-left text-2xs font-semibold cursor-pointer transition ${
                              content.font_pair === fp.id 
                                ? 'bg-accent/5 border-accent text-accent font-bold' 
                                : 'bg-bg-primary/50 border-border-primary text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                            }`}
                          >
                            {fp.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sections Visibility */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Show/Hide Sections</label>
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
                              className="w-full flex items-center justify-between p-2 rounded-lg border border-border-primary bg-bg-primary/30 text-2xs font-semibold cursor-pointer hover:bg-bg-surface transition"
                            >
                              <span className={isVisible ? 'text-text-primary' : 'text-text-tertiary line-through'}>{sec.label}</span>
                              <div className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                                isVisible ? 'bg-accent border-accent text-text-inverse' : 'border-border-primary text-transparent'
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
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Display Name</label>
                        <input
                          type="text"
                          value={content.hero.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Subtitle / Role Title</label>
                        <input
                          type="text"
                          value={content.hero.tagline}
                          onChange={(e) => handleProfileChange('tagline', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Profile Bio</label>
                        <textarea
                          rows={4}
                          value={content.hero.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sandbox Live Frame Render */}
            <div className="flex-1 bg-bg-primary/30 overflow-y-auto p-4 sm:p-8 flex items-start justify-center max-h-[calc(100vh-4rem)]">
              <div className="w-full max-w-4xl bg-bg-surface border border-border-primary rounded-xl overflow-hidden shadow-sm relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-accent/20 z-10" />
                <div className="p-3 bg-bg-surface border-b border-border-primary flex items-center justify-between text-3xs font-bold text-text-tertiary select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <span className="w-2 h-2 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono">Preview Mode</span>
                  </div>
                  <span className="font-mono">devport.me/demo/{username}</span>
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
          <div className="max-w-6xl mx-auto px-6 py-12 w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="w-fit text-[11px] font-semibold text-text-secondary uppercase bg-bg-primary px-3 py-1 rounded-full border border-border-primary shadow-2xs">
                  Stage 3 of 4
                </div>
                <h1 className="text-2xl font-black">Your Sandbox Admin Dashboard</h1>
                <p className="text-xs text-text-secondary font-medium">Replicating views, outbound recruiter clicks, and message telemetry.</p>
              </div>
            </div>

            {/* Grid Layout Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Details Panel */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Analytics summary */}
                <div className="bg-bg-surface border border-border-primary rounded-xl p-5 shadow-xs">
                  <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <BarChart2 size={15} className="text-accent" /> Dynamic Analytics (Last 30 Days)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-bg-primary p-4 rounded-lg border border-border-primary text-center space-y-1">
                      <div className="text-lg font-black text-text-primary">{stats.views}</div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Page Views</div>
                    </div>
                    <div className="bg-bg-primary p-4 rounded-lg border border-border-primary text-center space-y-1">
                      <div className="text-lg font-black text-accent">{stats.clicks}</div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Recruiter Clicks</div>
                    </div>
                    <div className="bg-bg-primary p-4 rounded-lg border border-border-primary text-center space-y-1">
                      <div className="text-lg font-black text-accent">{stats.emails}</div>
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Emails Sent</div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Messages */}
                <div className="bg-bg-surface border border-border-primary rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2"><MessageSquare size={15} className="text-accent" /> Messages Inbound</span>
                    <span className="px-2 py-0.5 rounded bg-bg-primary border border-border-primary text-[10px] font-bold text-text-secondary">{mockMessages.length} total</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {mockMessages.map((msg) => (
                      <div key={msg.id} className="bg-bg-primary border border-border-primary p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-text-tertiary">
                          <span>{msg.visitor_name} &lt;{msg.visitor_email}&gt;</span>
                          <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium leading-relaxed">{msg.message_content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Settings Panel */}
              <div className="space-y-6">
                
                {/* Claim handle banner */}
                <div className="bg-bg-surface border border-accent/30 bg-gradient-to-br from-accent/5 to-bg-surface p-5 rounded-xl space-y-4 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full filter blur-xl" />
                  <div className="space-y-1.5 relative">
                    <h3 className="text-xs font-black text-accent flex items-center gap-1.5 uppercase tracking-wide">
                      <Globe size={14} /> Ready to Publish?
                    </h3>
                    <p className="text-2xs text-text-secondary font-medium leading-relaxed">
                      Launch your portfolio to our global Content Delivery Network. You can view, share, and track recruiter clicks live.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Claim Subpath Handle</label>
                    <div className="flex items-center bg-bg-primary border border-border-primary rounded-lg p-2.5 focus-within:border-accent transition">
                      <span className="text-text-tertiary text-xs font-bold pr-1 select-none">devport.me/</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        className="bg-transparent border-none outline-none flex-1 text-xs text-text-primary font-bold placeholder-text-tertiary"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(4)}
                    className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Publish Sandbox Portfolio <ArrowRight size={12} />
                  </button>
                </div>

                {/* Simulated Features Guide */}
                <div className="bg-bg-surface border border-border-primary rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wide flex items-center gap-1.5">
                    💡 Did you know?
                  </h3>
                  <div className="space-y-3 text-[11px] text-text-secondary font-medium">
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
          <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-bg-surface border border-border-primary rounded-xl p-8 space-y-6 shadow-md relative overflow-hidden text-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-purple-600" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/5 border border-accent/20 rounded-xl flex items-center justify-center mx-auto text-accent relative">
                  <Loader2 size={24} className="animate-spin text-accent" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-text-primary">Deploying Portfolio</h2>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Building on edge nodes...</p>
                </div>
              </div>

              {/* Status checklist */}
              <div className="bg-bg-primary rounded-xl p-4 border border-border-primary text-left font-mono space-y-1.5 max-h-48 overflow-y-auto">
                {deploySteps.slice(0, deployStep + 1).map((s, idx) => {
                  const isActive = idx === deployStep;
                  return (
                    <div 
                      key={idx} 
                      className={`text-[10px] flex items-center gap-2 transition duration-200 ${
                        isActive ? 'text-accent font-bold' : 'text-text-tertiary'
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

              <div className="text-[10px] text-text-tertiary leading-relaxed">
                SSL certificates are provisioned automatically. Redirecting to your live URL on completion.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
