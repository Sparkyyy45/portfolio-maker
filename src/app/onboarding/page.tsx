'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { extractTextFromPdf } from '@/utils/pdf';
import { fetchGitHubData } from '@/utils/github';
import { parseLinkedInExport } from '@/utils/linkedin';
import { INITIAL_PORTFOLIO_CONTENT } from '@/utils/constants';
import { checkUsernameAvailable, updateProfile, savePortfolio } from '@/utils/db';
import PortfolioPreview from '@/components/PortfolioPreview';
import { PortfolioContent, ProjectData, ExperienceData, SkillCategory, EducationData, CertificationData } from '@/types/portfolio';
import {
  FileText, Github, FilePlus, Sparkles, Loader2, Save, ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle, Linkedin
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
  const [activeTab, setActiveTab] = useState<'hero' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications'>('hero');

  // Input states for parser/github
  const [gitUsername, setGitUsername] = useState('');
  const [gitError, setGitError] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState('');

  // LinkedIn states
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  const [linkedinZipFile, setLinkedinZipFile] = useState<File | null>(null);

  // Username selection states
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

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

  // Handle LinkedIn URL Import
  const handleLinkedInUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl.trim()) return;
    setLoadingState('Importing from LinkedIn...');
    setLinkedinError('');
    try {
      const response = await fetch('/api/linkedin-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkedinUrl.trim() }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to import from LinkedIn.');
      }
      const data = await response.json();
      setContent({ ...INITIAL_PORTFOLIO_CONTENT, ...data });
      setStage('editor');
    } catch (err: any) {
      setLinkedinError(err.message || 'LinkedIn import failed.');
    } finally {
      setLoadingState('');
    }
  };

  // Handle LinkedIn ZIP Import
  const handleLinkedInZipImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinZipFile) return;
    setLoadingState('Parsing LinkedIn data export...');
    setLinkedinError('');
    try {
      const data = await parseLinkedInExport(linkedinZipFile);
      setContent({ ...INITIAL_PORTFOLIO_CONTENT, ...data });
      setStage('editor');
    } catch (err: any) {
      setLinkedinError(err.message || 'Failed to parse LinkedIn export.');
    } finally {
      setLoadingState('');
    }
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

  // Handle Resume Upload & Parse
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;
    setLoadingState('Reading PDF resume...');
    setPdfError('');
    try {
      const extractedText = await extractTextFromPdf(pdfFile);
      setLoadingState('Analyzing resume with Gemini AI...');

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse resume via API.');
      }

      const parsedJSON: PortfolioContent = await response.json();
      setContent(parsedJSON);
      setStage('editor');
    } catch (err: any) {
      console.error(err);
      setPdfError(err.message || 'Error occurred while parsing resume.');
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">

            {/* AI Resume Upload Card */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 transition flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit shadow-2xs">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">AI Resume Parser</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Upload your PDF resume. Gemini will parse layout texts, extract credentials, and format your timeline in seconds.
                </p>
              </div>
              <form onSubmit={handleResumeUpload} className="space-y-3 pt-3">
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border-primary file:text-xs file:font-semibold file:bg-bg-primary file:text-text-primary hover:file:bg-bg-surface cursor-pointer"
                />
                {pdfError && <p className="text-rose-500 text-2xs">{pdfError}</p>}
                <button
                  type="submit"
                  disabled={!pdfFile}
                  className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer"
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

            {/* LinkedIn Import Card */}
            <div className="p-6 rounded-xl border border-border-primary bg-bg-surface hover:bg-bg-primary hover:border-text-secondary/20 transition flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-secondary w-fit shadow-2xs">
                  <Linkedin size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">Import LinkedIn</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Paste your LinkedIn profile URL for instant import, or upload your data export ZIP for complete details.
                </p>
              </div>
              <div className="space-y-3 pt-3">
                <form onSubmit={handleLinkedInUrlImport} className="space-y-2">
                  <input
                    type="text"
                    placeholder="linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={!linkedinUrl.trim()}
                    className="w-full py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Import via URL
                  </button>
                </form>
                <div className="text-[10px] font-bold text-text-tertiary text-center uppercase">or upload data export</div>
                <form onSubmit={handleLinkedInZipImport}>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setLinkedinZipFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border-primary file:text-xs file:font-semibold file:bg-bg-primary file:text-text-primary hover:file:bg-bg-surface cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={!linkedinZipFile}
                    className="w-full mt-2 py-2 bg-bg-surface hover:bg-bg-code border border-border-primary text-text-primary font-semibold text-xs rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    Parse ZIP Export
                  </button>
                </form>
                {linkedinError && <p className="text-rose-500 text-2xs">{linkedinError}</p>}
              </div>
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
            <div className="flex border-b border-border-primary bg-bg-surface p-2 overflow-x-auto gap-1">
              {(['hero', 'experience', 'projects', 'skills', 'education', 'certifications'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${activeTab === tab
                      ? 'bg-accent text-text-inverse shadow-2xs'
                      : 'text-text-secondary hover:bg-bg-surface'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Editor Forms */}
            <div className="p-6 flex-1 space-y-6">

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
                      <label className="text-2xs font-semibold text-text-secondary uppercase">Bio Summary</label>
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
                                onClick={() => deleteExperienceBullet(expIdx, bulletIdx)}
                                className="text-text-tertiary hover:text-rose-500 transition cursor-pointer"
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
                        <label className="text-2xs font-semibold text-text-secondary uppercase">Description</label>
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
          <div className="flex-1 overflow-y-auto border-t md:border-t-0 border-border-primary flex flex-col relative bg-bg-primary">
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Preview
            </div>

            <div className="flex-1 scale-[0.95] origin-top border border-border-primary rounded-xl overflow-hidden mt-12 mb-6 mx-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative">
              <PortfolioPreview data={content} isDemo={true} />
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
