'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchGitHubData } from '@/utils/github';
import { INITIAL_PORTFOLIO_CONTENT } from '@/utils/constants';
import { checkUsernameAvailable, updateProfile, savePortfolio } from '@/utils/db';
import PortfolioPreview from '@/components/PortfolioPreview';
import { PortfolioContent, ProjectData, ExperienceData, SkillCategory, EducationData, CertificationData, SectionsVisibility } from '@/types/portfolio';
import { ToastContainer, ToastItem } from '@/components/Toast';
import {
  FileText, Github, FilePlus, Sparkles, Loader2, Save, ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Sliders, Palette, RefreshCw, X, ArrowUpRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Onboarding Stage: 'method' | 'editor' | 'username'
  const [stage, setStage] = useState<'method' | 'editor' | 'username'>('method');
  const [loadingState, setLoadingState] = useState<string>(''); // empty if not loading

  // Portfolio Content State
  const [content, setContent] = useState<PortfolioContent>(INITIAL_PORTFOLIO_CONTENT);

  // Form Fields Editing
  const [activeTab, setActiveTab] = useState<'design' | 'hero' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications'>('design');

  // Preview Mode
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (message: string, variant: ToastItem['variant']) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Polishing states
  const [polishingItem, setPolishingItem] = useState<{ type: 'hero' | 'experience' | 'project'; index?: number; subIndex?: number } | null>(null);

  // Input states for parser/github
  const [gitUsername, setGitUsername] = useState('');
  const [gitError, setGitError] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeError, setResumeError] = useState('');


  // Username selection states
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Design tab handlers
  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'cyberpunk' | 'nord' | 'dracula' | 'synthwave' | 'latte') => {
    setContent((prev) => ({ ...prev, theme: selectedTheme }));
  };

  const handleTemplateChange = (selectedTemplate: 'minimal' | 'bento' | 'brutalist' | 'terminal' | 'glass' | 'deck' | 'timeline') => {
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

  // AI Content polishing handlers
  const polishBio = async () => {
    if (!content.hero.bio.trim() || content.hero.bio === 'Tell recruiters a little bit about yourself...') return;
    setPolishingItem({ type: 'hero' });
    try {
      addToast('Polishing bio summary...', 'info');
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content.hero.bio }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Polishing failed');
      }
      const data = await response.json();
      setContent((prev) => ({ ...prev, hero: { ...prev.hero, bio: data.polishedText } }));
      addToast('Bio summary polished successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to polish text.', 'error');
    } finally {
      setPolishingItem(null);
    }
  };

  const polishExperienceBullet = async (expIdx: number, bIdx: number) => {
    const bulletText = content.experience[expIdx].bullets[bIdx];
    if (!bulletText.trim() || bulletText === 'New milestone bullet point...') return;
    setPolishingItem({ type: 'experience', index: expIdx, subIndex: bIdx });
    try {
      addToast('Polishing bullet point...', 'info');
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bulletText }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Polishing failed');
      }
      const data = await response.json();
      updateExperienceBullet(expIdx, bIdx, data.polishedText);
      addToast('Milestone polished successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to polish text.', 'error');
    } finally {
      setPolishingItem(null);
    }
  };

  const polishProjectDescription = async (projIdx: number) => {
    const descText = content.projects[projIdx].description;
    if (!descText.trim() || descText === 'Describe details...') return;
    setPolishingItem({ type: 'project', index: projIdx });
    try {
      addToast('Polishing project description...', 'info');
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: descText }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Polishing failed');
      }
      const data = await response.json();
      updateProject(projIdx, 'description', data.polishedText);
      addToast('Project description polished successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to polish text.', 'error');
    } finally {
      setPolishingItem(null);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle Blank Start
  const handleStartBlank = () => {
    setContent(INITIAL_PORTFOLIO_CONTENT);
    setStage('editor');
  };



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
      });
      setStage('editor');
    } catch (err: any) {
      setGitError(err.message || 'Failed to fetch GitHub data.');
    } finally {
      setLoadingState('');
    }
  };

  // Handle Resume Text Paste
  const handleResumeTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setLoadingState('Analyzing resume with Gemini AI...');
    setResumeError('');
    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resumeText.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume via API.');
      }

      const parsedJSON: PortfolioContent = await response.json();
      setContent({
        ...INITIAL_PORTFOLIO_CONTENT,
        ...parsedJSON,
        hero: {
          ...INITIAL_PORTFOLIO_CONTENT.hero,
          ...parsedJSON.hero,
          socials: {
            ...INITIAL_PORTFOLIO_CONTENT.hero.socials,
            ...parsedJSON.hero?.socials,
          }
        },
        sections_visibility: {
          ...INITIAL_PORTFOLIO_CONTENT.sections_visibility,
          ...parsedJSON.sections_visibility,
        }
      });
      setStage('editor');
    } catch (err: any) {
      console.error(err);
      setResumeError(err.message || 'Error occurred while parsing resume.');
    } finally {
      setLoadingState('');
    }
  };

  // Form edit handlers
  const handleHeroChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        socials: {
          ...prev.hero.socials,
          [platform]: value,
        },
      },
    }));
  };

  // Projects Add/Delete/Update
  const addProject = () => {
    const newProj: ProjectData = { title: 'New Project', description: 'Describe details...', tech: ['React'] };
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const deleteProject = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx),
    }));
  };

  const updateProject = (idx: number, field: keyof ProjectData, value: any) => {
    setContent((prev) => {
      const updated = [...prev.projects];
      if (field === 'tech') {
        updated[idx] = { ...updated[idx], tech: typeof value === 'string' ? value.split(',').map(s => s.trim()) : value };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      return { ...prev, projects: updated };
    });
  };

  // Experience Add/Delete/Update
  const addExperience = () => {
    const newExp: ExperienceData = { role: 'Software Engineer', company: 'New Company', period: '2025', bullets: ['Built features...'] };
    setContent((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const deleteExperience = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  const updateExperience = (idx: number, field: keyof ExperienceData, value: any) => {
    setContent((prev) => {
      const updated = [...prev.experience];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const updateExperienceBullet = (expIdx: number, bulletIdx: number, value: string) => {
    setContent((prev) => {
      const updated = [...prev.experience];
      const bullets = [...updated[expIdx].bullets];
      bullets[bulletIdx] = value;
      updated[expIdx] = { ...updated[expIdx], bullets };
      return { ...prev, experience: updated };
    });
  };

  const addExperienceBullet = (expIdx: number) => {
    setContent((prev) => {
      const updated = [...prev.experience];
      const bullets = [...updated[expIdx].bullets, 'New milestone bullet point...'];
      updated[expIdx] = { ...updated[expIdx], bullets };
      return { ...prev, experience: updated };
    });
  };

  const deleteExperienceBullet = (expIdx: number, bulletIdx: number) => {
    setContent((prev) => {
      const updated = [...prev.experience];
      const bullets = updated[expIdx].bullets.filter((_, i) => i !== bulletIdx);
      updated[expIdx] = { ...updated[expIdx], bullets };
      return { ...prev, experience: updated };
    });
  };

  // Skills Add/Delete/Update
  const addSkillCategory = () => {
    const newCat: SkillCategory = { category: 'Tools', items: ['Git', 'Docker'] };
    setContent((prev) => ({
      ...prev,
      skills: [...prev.skills, newCat],
    }));
  };

  const deleteSkillCategory = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const updateSkillCategoryName = (idx: number, name: string) => {
    setContent((prev) => {
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], category: name };
      return { ...prev, skills: updated };
    });
  };

  const updateSkillCategoryItems = (idx: number, itemsCsv: string) => {
    setContent((prev) => {
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], items: itemsCsv.split(',').map(s => s.trim()).filter(Boolean) };
      return { ...prev, skills: updated };
    });
  };

  // Education CRUD
  const addEducation = () => {
    setContent((prev) => ({
      ...prev,
      education: [...(prev.education || []), { institution: 'University', degree: 'Bachelor of Science', field: 'Computer Science', period: '2020 – 2024' }],
    }));
  };
  const deleteEducation = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== idx),
    }));
  };
  const updateEducation = (idx: number, field: keyof EducationData, value: string) => {
    setContent((prev) => {
      const updated = [...(prev.education || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Certifications CRUD
  const addCertification = () => {
    setContent((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), { name: 'Certification', issuer: 'Issuer', date: '2025' }],
    }));
  };
  const deleteCertification = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== idx),
    }));
  };
  const updateCertification = (idx: number, field: keyof CertificationData, value: string) => {
    setContent((prev) => {
      const updated = [...(prev.certifications || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  // Username validation check
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setUsername(val);
    setUsernameError('');
    setUsernameSuccess('');

    if (val.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }

    setCheckingUsername(true);
    const available = await checkUsernameAvailable(val);
    setCheckingUsername(false);

    if (available) {
      setUsernameSuccess('Congratulations! This username is available.');
    } else {
      setUsernameError('This username is already taken.');
    }
  };

  // Final Publish Handler
  const handlePublish = async () => {
    if (!username || usernameError || !user) return;
    setLoadingState('Deploying your portfolio...');
    try {
      const profileSuccess = await updateProfile(user.id, {
        username: username,
        is_published: true,
      });

      const portfolioSuccess = await savePortfolio(user.id, content);

      if (profileSuccess && portfolioSuccess) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to update profile or portfolio data.');
      }
    } catch (err: any) {
      setUsernameError(err.message || 'Deployment error occurred.');
    } finally {
      setLoadingState('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans relative overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none" />
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {loadingState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-primary/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4"
          >
            <Loader2 size={36} className="animate-spin text-accent" />
            <p className="text-sm font-semibold text-text-secondary">{loadingState}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-border-primary bg-bg-surface px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-accent text-text-inverse">
            <Sparkles size={16} />
          </div>
          <span className="font-bold tracking-tight text-base uppercase text-text-primary">DEVPORT</span>
        </div>
        <div className="text-[11px] font-semibold text-text-secondary uppercase bg-bg-primary px-3 py-1 rounded-full border border-border-primary shadow-2xs">
          Stage {stage === 'method' ? '1/3' : stage === 'editor' ? '2/3' : '3/3'}
        </div>
      </header>

      {/* STAGE 1: INGESTION METHOD SELECTION */}
      {stage === 'method' && (
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 flex flex-col justify-center space-y-8 relative z-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">How would you like to build your profile?</h1>
            <p className="text-text-secondary max-w-lg mx-auto text-sm">
              Start with our AI-powered resume parser, import from GitHub or LinkedIn, or design yours from scratch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">

            {/* AI Resume Parser Card */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 transition flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit shadow-2xs">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">Paste Resume Text</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Paste your resume content. Gemini will extract credentials, skills, and format your timeline in seconds.
                </p>
              </div>
              <form onSubmit={handleResumeTextSubmit} className="space-y-3 pt-3 flex flex-col h-full">
                <textarea
                  required
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full h-24 px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent resize-none flex-1"
                />
                {resumeError && <p className="text-rose-500 text-2xs">{resumeError}</p>}
                <button
                  type="submit"
                  disabled={!resumeText.trim()}
                  className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer mt-auto"
                >
                  Parse Resume
                </button>
              </form>
            </div>

            {/* GitHub Import Card */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 transition flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit shadow-2xs">
                  <Github size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">Import GitHub</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Provide your username. We fetch repositories, languages, descriptions, stars, and pre-populate your projects.
                </p>
              </div>
              <form onSubmit={handleGitHubImport} className="space-y-3 pt-3">
                <input
                  type="text"
                  required
                  placeholder="github-username"
                  value={gitUsername}
                  onChange={(e) => setGitUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {gitError && <p className="text-rose-500 text-2xs">{gitError}</p>}
                <button
                  type="submit"
                  disabled={!gitUsername.trim()}
                  className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer"
                >
                  Fetch Data
                </button>
              </form>
            </div>

            {/* Blank Sheet Card */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 transition flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit shadow-2xs">
                  <FilePlus size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">Start Blank</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Design manually step-by-step. Choose a layout theme and edit templates directly via our web editor.
                </p>
              </div>
              <button
                onClick={handleStartBlank}
                className="w-full py-2 bg-bg-surface hover:bg-bg-code border border-border-primary text-text-primary font-semibold text-xs rounded-lg transition cursor-pointer mt-auto"
              >
                Create Manually
              </button>
            </div>

          </div>
        </main>
      )}

      {/* STAGE 2: INTERACTIVE SPLIT EDITOR */}
      {stage === 'editor' && (
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">

          {/* LEFT PANEL: FORM EDITOR */}
          <div className="w-full md:w-[45%] border-r border-border-primary flex flex-col overflow-y-auto bg-bg-surface/30">
            {/* Editor Navigation */}
            <div className="flex border-b border-border-primary bg-bg-surface p-2 overflow-x-auto gap-1 shrink-0">
              {(['design', 'hero', 'experience', 'projects', 'skills', 'education', 'certifications'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${activeTab === tab
                      ? 'bg-accent text-text-inverse shadow-2xs font-extrabold'
                      : 'text-text-secondary hover:bg-bg-surface'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Editor Forms */}
            <div className="p-6 flex-1 space-y-6">

              {/* DESIGN & THEMES (Layout Controls) */}
              {activeTab === 'design' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Visual Template</h3>
                    <p className="text-2xs text-text-tertiary mt-0.5">Select a layout structure for your profile.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { id: 'minimal' as const, name: 'Minimalist Document', desc: 'Airy, single-column focused on clean typography.', icon: '📜' },
                      { id: 'bento' as const, name: 'Bento Grid Dashboard', desc: 'Responsive dashboard of cards with stats and repos.', icon: '🍱' },
                      { id: 'brutalist' as const, name: 'Neo-Brutalist Pop', desc: 'Thick black borders, offset solid shadows, and high contrast.', icon: '⚡' },
                      { id: 'terminal' as const, name: 'Retro UNIX Terminal', desc: 'Interactive developer console styling with CLI commands.', icon: '💻' },
                      { id: 'glass' as const, name: 'Glassmorphism Grid', desc: 'Frosted cards over a moving radial mesh gradient background.', icon: '💎' },
                      { id: 'deck' as const, name: 'Presentation Slides', desc: 'Sleek pitch deck UI with Left/Right arrow transitions.', icon: '🎴' },
                      { id: 'timeline' as const, name: 'Career Timeline', desc: 'Narrative central vertical timeline path layout.', icon: '⏳' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTemplateChange(t.id)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none relative bg-bg-primary border-border-primary ${
                          (content?.template || 'minimal') === t.id ? 'ring-2 ring-accent border-accent bg-accent/5' : 'hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className="text-lg mb-1 block">{t.icon}</span>
                          <span className="text-xs font-bold block text-text-primary">{t.name}</span>
                          <span className="text-[10px] text-text-secondary mt-1 block leading-relaxed">{t.desc}</span>
                        </div>
                        {(content?.template || 'minimal') === t.id && (
                          <span className="absolute right-3 top-3 bg-accent text-text-inverse p-0.5 rounded-full"><Check size={11} /></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Visual Theme</h3>
                    <p className="text-2xs text-text-tertiary mt-0.5">Choose a design aesthetic for your page.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { id: 'light' as const, name: 'Light Minimalist', desc: 'Clean, clean slate design with soft zinc cards.', border: 'border-zinc-200 bg-white text-zinc-800' },
                      { id: 'dark' as const, name: 'Midnight Obsidian', desc: 'Stealthy gray-black dark theme.', border: 'border-zinc-800 bg-zinc-950 text-zinc-100' },
                      { id: 'cyberpunk' as const, name: 'Cyberpunk Green', desc: 'Retro terminal green look with dark slate background.', border: 'border-emerald-500/20 bg-zinc-950 text-emerald-400' },
                      { id: 'nord' as const, name: 'Nordic Frost', desc: 'Slate blue and grey-blue tones with pale blue accents.', border: 'border-[#4C566A]/20 bg-[#2E3440] text-[#88C0D0]' },
                      { id: 'dracula' as const, name: 'Dracula Vampire', desc: 'Deep purple-black look with hot pink accents.', border: 'border-[#44475a]/25 bg-[#282a36] text-[#ff79c6]' },
                      { id: 'synthwave' as const, name: 'Retro Synthwave', desc: 'Neon grid lines and glowing pink/blue text.', border: 'border-[#ff007f]/20 bg-[#180a2b] text-[#39ff14]' },
                      { id: 'latte' as const, name: 'Rosewood Latte', desc: 'Warm cream, sand, and cozy terracotta accents.', border: 'border-[#E6D4CB]/20 bg-[#F5EBE6] text-[#A75D5D]' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleThemeChange(t.id)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none relative ${t.border} ${
                          content.theme === t.id ? 'ring-2 ring-accent' : 'hover:scale-[1.01]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{t.name}</span>
                          <span className="text-[10px] opacity-75 mt-1 block leading-relaxed">{t.desc}</span>
                        </div>
                        {content.theme === t.id && (
                          <span className="absolute right-3 top-3 bg-accent text-text-inverse p-0.5 rounded-full"><Check size={11} /></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Typography Pairings</h3>
                    <p className="text-2xs text-text-tertiary mt-0.5">Select a font pairing for headings and paragraphs.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      { id: 'modern', name: 'Sleek Tech', desc: 'Outfit & Geist', preview: 'Aa' },
                      { id: 'serif', name: 'Elegant Serif', desc: 'Playfair Display & Inter', preview: 'Aa' },
                      { id: 'mono', name: 'Dev Console', desc: 'JetBrains Mono & Fira Code', preview: 'Aa' },
                      { id: 'editorial', name: 'Modern Agency', desc: 'Plus Jakarta Sans & Plus Jakarta Sans', preview: 'Aa' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleFontPairChange(t.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer select-none bg-bg-primary border-border-primary ${
                          (content?.font_pair || 'modern') === t.id ? 'ring-2 ring-accent border-accent bg-accent/5' : 'hover:scale-[1.01]'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold block text-text-primary leading-tight">{t.name}</span>
                          <span className="text-[10px] text-text-secondary mt-0.5 block truncate">{t.desc}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-primary flex items-center justify-center font-bold text-xs shrink-0 select-none text-text-secondary">
                          {t.preview}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Section Visibility</h3>
                    <p className="text-2xs text-text-tertiary mt-0.5">Toggle showing/hiding sections on your public page.</p>
                  </div>

                  <div className="p-4 rounded-xl border border-border-primary bg-bg-surface space-y-3">
                    {[
                      { label: 'Work Experience timeline', field: 'experience' as const },
                      { label: 'Featured projects showcase', field: 'projects' as const },
                      { label: 'GitHub Synced repositories', field: 'github_repos' as const },
                      { label: 'Skills lists', field: 'skills' as const },
                      { label: 'Education credentials', field: 'education' as const },
                      { label: 'Certifications', field: 'certifications' as const },
                      { label: 'Contact message form', field: 'contact' as const }
                    ].map((sec) => {
                      const isVisible = content.sections_visibility?.[sec.field] ?? true;
                      return (
                        <div key={sec.field} className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-secondary">{sec.label}</span>
                          <button
                            type="button"
                            onClick={() => handleSectionVisibilityToggle(sec.field)}
                            className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                              isVisible ? 'bg-accent' : 'bg-neutral-200'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                                isVisible ? 'translate-x-3.5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HERO FORM */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-2xs font-semibold text-text-secondary uppercase">Display Name</label>
                      <input
                        type="text"
                        value={content.hero.name}
                        onChange={(e) => handleHeroChange('name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-2xs font-semibold text-text-secondary uppercase">Tagline / Title</label>
                      <input
                        type="text"
                        value={content.hero.tagline}
                        onChange={(e) => handleHeroChange('tagline', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Bio Summary</label>
                        <button
                          type="button"
                          disabled={polishingItem !== null}
                          onClick={polishBio}
                          className="text-2xs text-text-secondary hover:text-accent hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Polish Bio with AI"
                        >
                          {polishingItem?.type === 'hero' ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Sparkles size={10} />
                          )}
                          <span>Polish with AI</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={content.hero.bio}
                        onChange={(e) => handleHeroChange('bio', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary resize-none"
                      />
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider pt-4">Social Handles</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-2xs font-semibold text-text-secondary uppercase">GitHub Username</label>
                      <input
                        type="text"
                        placeholder="username"
                        value={content.hero.socials?.github || ''}
                        onChange={(e) => handleSocialChange('github', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-2xs font-semibold text-text-secondary uppercase">LinkedIn Username</label>
                      <input
                        type="text"
                        placeholder="in/username"
                        value={content.hero.socials?.linkedin || ''}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-2xs font-semibold text-text-secondary uppercase">Twitter Username</label>
                      <input
                        type="text"
                        placeholder="username"
                        value={content.hero.socials?.twitter || ''}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCE FORM */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Employment History</h3>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"
                    >
                      <Plus size={11} /> Add Experience
                    </button>
                  </div>

                  {content.experience.map((exp, expIdx) => (
                    <div key={expIdx} className="p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4">
                      <button
                        onClick={() => deleteExperience(expIdx)}
                        className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Timeline / Period</label>
                        <input
                          type="text"
                          placeholder="e.g. 2024 - Present"
                          value={exp.period}
                          onChange={(e) => updateExperience(expIdx, 'period', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Key Achievements / Bullets</label>
                          <button
                            onClick={() => addExperienceBullet(expIdx)}
                            className="text-2xs text-text-secondary hover:text-text-primary hover:underline cursor-pointer"
                          >
                            + Add Bullet
                          </button>
                        </div>

                        <div className="space-y-2">
                          {exp.bullets.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => updateExperienceBullet(expIdx, bulletIdx, e.target.value)}
                                className="flex-1 px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                              <button
                                type="button"
                                disabled={polishingItem !== null}
                                onClick={() => polishExperienceBullet(expIdx, bulletIdx)}
                                className="p-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-text-secondary hover:text-accent transition cursor-pointer disabled:opacity-50"
                                title="Polish milestone with AI"
                              >
                                {polishingItem?.type === 'experience' && polishingItem.index === expIdx && polishingItem.subIndex === bulletIdx ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Sparkles size={13} />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteExperienceBullet(expIdx, bulletIdx)}
                                className="text-text-tertiary hover:text-rose-500 transition cursor-pointer p-1.5 shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PROJECTS FORM */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Portfolio Projects</h3>
                    <button
                      onClick={addProject}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"
                    >
                      <Plus size={11} /> Add Project
                    </button>
                  </div>

                  {content.projects.map((proj, projIdx) => (
                    <div key={projIdx} className="p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4">
                      <button
                        onClick={() => deleteProject(projIdx)}
                        className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(projIdx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Description</label>
                          <button
                            type="button"
                            disabled={polishingItem !== null}
                            onClick={() => polishProjectDescription(projIdx)}
                            className="text-2xs text-text-secondary hover:text-accent hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Polish Description with AI"
                          >
                            {polishingItem?.type === 'project' && polishingItem.index === projIdx ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Sparkles size={10} />
                            )}
                            <span>Polish with AI</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => updateProject(projIdx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Tech Badges (comma separated)</label>
                        <input
                          type="text"
                          value={proj.tech.join(', ')}
                          onChange={(e) => updateProject(projIdx, 'tech', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">GitHub Repo URL</label>
                          <input
                            type="text"
                            placeholder="github.com/..."
                            value={proj.github || ''}
                            onChange={(e) => updateProject(projIdx, 'github', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Live Site URL</label>
                          <input
                            type="text"
                            placeholder="myproject.com"
                            value={proj.live || ''}
                            onChange={(e) => updateProject(projIdx, 'live', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SKILLS FORM */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Skills Categories</h3>
                    <button
                      onClick={addSkillCategory}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"
                    >
                      <Plus size={11} /> Add Category
                    </button>
                  </div>

                  {content.skills.map((skillCat, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4">
                      <button
                        onClick={() => deleteSkillCategory(idx)}
                        className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Category Name</label>
                        <input
                          type="text"
                          value={skillCat.category}
                          onChange={(e) => updateSkillCategoryName(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Skills (comma separated)</label>
                        <input
                          type="text"
                          value={skillCat.items.join(', ')}
                          onChange={(e) => updateSkillCategoryItems(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EDUCATION FORM */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Education</h3>
                    <button onClick={addEducation} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"><Plus size={11} /> Add</button>
                  </div>
                  {(content.education || []).map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4">
                      <button onClick={() => deleteEducation(idx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={15} /></button>
                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Institution</label>
                        <input type="text" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Degree</label>
                          <input type="text" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Field of Study</label>
                          <input type="text" value={edu.field} onChange={(e) => updateEducation(idx, 'field', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Period</label>
                        <input type="text" value={edu.period} onChange={(e) => updateEducation(idx, 'period', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CERTIFICATIONS FORM */}
              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-primary pb-3">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Certifications</h3>
                    <button onClick={addCertification} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"><Plus size={11} /> Add</button>
                  </div>
                  {(content.certifications || []).map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4">
                      <button onClick={() => deleteCertification(idx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={15} /></button>
                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Name</label>
                        <input type="text" value={cert.name} onChange={(e) => updateCertification(idx, 'name', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Issuer</label>
                          <input type="text" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-2xs font-semibold text-text-secondary uppercase">Date</label>
                          <input type="text" value={cert.date} onChange={(e) => updateCertification(idx, 'date', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Verification URL</label>
                        <input type="text" value={cert.url || ''} onChange={(e) => updateCertification(idx, 'url', e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent" placeholder="https://" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border-primary bg-bg-surface flex justify-between gap-4">
              <button
                onClick={() => setStage('method')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border-primary text-xs hover:bg-bg-code transition font-bold cursor-pointer"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStage('username')}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-xs font-bold text-text-inverse transition cursor-pointer"
              >
                Proceed to Deploy <Save size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE PORTFOLIO PREVIEW */}
          <div className="flex-1 overflow-y-auto border-t md:border-t-0 border-border-primary flex flex-col relative bg-bg-primary min-h-[500px]">
            <div className="flex justify-between items-center px-6 py-3 border-b border-border-primary bg-bg-surface shrink-0 z-20">
              <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </div>
              
              {/* Viewport Toggles */}
              <div className="flex bg-bg-primary border border-border-primary rounded-lg p-0.5 shadow-2xs gap-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                    previewMode === 'desktop'
                      ? 'bg-accent text-text-inverse'
                      : 'text-text-secondary hover:bg-bg-surface'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                    previewMode === 'mobile'
                      ? 'bg-accent text-text-inverse'
                      : 'text-text-secondary hover:bg-bg-surface'
                  }`}
                >
                  Mobile View
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50/50 overflow-y-auto">
              {previewMode === 'mobile' ? (
                /* Interactive Scrollable Phone Device Mockup Frame */
                <div className="w-[360px] h-[640px] border-8 border-slate-900 rounded-[36px] overflow-hidden shadow-2xl relative bg-bg-primary flex flex-col shrink-0">
                  {/* Speaker and Camera notch */}
                  <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 z-[60] flex items-center justify-center">
                    <div className="w-12 h-1.5 rounded-full bg-slate-800" />
                  </div>
                  <div className="flex-1 overflow-y-auto pt-4 relative select-none" style={{ scrollbarWidth: 'none' }}>
                    <PortfolioPreview data={content} isDemo={true} />
                  </div>
                </div>
              ) : (
                /* Scaled Desktop Preview */
                <div className="w-full h-full scale-[0.98] origin-top border border-border-primary rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative">
                  <PortfolioPreview data={content} isDemo={true} />
                </div>
              )}
            </div>
          </div>

        </main>
      )}

      {/* STAGE 3: CLAIM SUBPATH ROUTE */}
      {stage === 'username' && (
        <main className="flex-1 max-w-lg mx-auto px-6 py-12 flex flex-col justify-center space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Claim your public portfolio link</h1>
            <p className="text-text-secondary text-sm">
              Choose a unique handle. Recruiters will be able to view your portfolio instantly at this address.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border-primary bg-bg-surface space-y-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Your Subpath Handle</label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-border-primary bg-bg-primary text-sm placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="absolute right-4 text-text-secondary">
                  {checkingUsername && <Loader2 size={16} className="animate-spin text-text-tertiary" />}
                </span>
              </div>
            </div>

            {/* Availability alerts */}
            {usernameSuccess && (
              <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{usernameSuccess}</span>
              </div>
            )}
            {usernameError && (
              <div className="p-3 rounded-lg border border-rose-100 bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{usernameError}</span>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setStage('editor')}
                className="px-4 py-3 rounded-lg border border-border-primary text-sm hover:bg-bg-code font-bold transition flex items-center gap-1.5 cursor-pointer bg-bg-primary text-text-primary"
              >
                <ArrowLeft size={15} /> Back
              </button>

              <button
                onClick={handlePublish}
                disabled={!username || !!usernameError || checkingUsername}
                className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-bold rounded-lg transition text-sm cursor-pointer shadow-sm"
              >
                Publish Portfolio 🚀
              </button>
            </div>
          </div>
        </main>
      )}

    </div>
  );
}
