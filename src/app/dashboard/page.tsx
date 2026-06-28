'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import {
  fetchProfile, fetchPortfolio, updateProfile, savePortfolio, checkUsernameAvailable
} from '@/utils/db';
import { PortfolioContent, ProjectData, ExperienceData, SkillCategory, EducationData, CertificationData, Profile, LeetCodeStats, GitHubRepoData, SectionsVisibility } from '@/types/portfolio';
import PortfolioPreview from '@/components/PortfolioPreview';
import { ToastContainer, ToastItem } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { extractTextFromPdf } from '@/utils/pdf';
import { fetchGitHubData } from '@/utils/github';
import { parseLinkedInExport } from '@/utils/linkedin';
import { fetchLeetCodeData } from '@/utils/leetcode';
import {
  Sparkles, Loader2, Save, LogOut, Settings, Edit, Plus, Trash2, Globe, Eye, EyeOff,
  Copy, Check, ChevronLeft, ChevronRight, LayoutDashboard, User, Github, Linkedin,
  FileText, Activity, ArrowUpRight, CheckCircle2, AlertCircle, X, ExternalLink, Terminal,
  Sliders, ShieldAlert, Palette
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<PortfolioContent | null>(null);

  const [activeDashboardTab, setActiveDashboardTab] = useState<'overview' | 'edit' | 'settings'>('overview');
  const [activeEditTab, setActiveEditTab] = useState<'hero' | 'experience' | 'projects' | 'skills' | 'leetcode' | 'education' | 'certifications' | 'design'>('hero');
  const [projectSubTab, setProjectSubTab] = useState<'custom' | 'github'>('custom');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [polishingItem, setPolishingItem] = useState<{ type: 'experience' | 'project'; index: number; subIndex?: number } | null>(null);

  const [usernameInput, setUsernameInput] = useState('');
  const [isPublishedInput, setIsPublishedInput] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Source updates modal states
  const [updateModalSource, setUpdateModalSource] = useState<'github' | 'linkedin' | 'resume' | 'leetcode' | null>(null);
  const [modalGitUsername, setModalGitUsername] = useState('');
  const [modalLinkedinUrl, setModalLinkedinUrl] = useState('');
  const [modalLinkedinZip, setModalLinkedinZip] = useState<File | null>(null);
  const [modalPdfFile, setModalPdfFile] = useState<File | null>(null);
  const [modalLeetcodeUsername, setModalLeetcodeUsername] = useState('');
  const [syncingSource, setSyncingSource] = useState(false);
  const [modalError, setModalError] = useState('');

  // Toast system
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = useCallback((message: string, variant: ToastItem['variant']) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Copy URL state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    const loadAllData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const prof = await fetchProfile(user.id);
        setProfile(prof);
        if (prof) {
          setUsernameInput(prof.username || '');
          setIsPublishedInput(prof.is_published);
          if (!prof.username) { router.push('/onboarding'); return; }
        }
        const portContent = await fetchPortfolio(user.id);
        if (portContent) {
          portContent.education = portContent.education || [];
          portContent.certifications = portContent.certifications || [];
          portContent.github_repos = portContent.github_repos || [];
          portContent.theme = portContent.theme || 'light';
          portContent.sections_visibility = portContent.sections_visibility || {
            experience: true, projects: true, github_repos: true, skills: true,
            leetcode: true, education: true, certifications: true, contact: true
          };
        }
        setContent(portContent);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    if (user) loadAllData();
  }, [user, router]);

  // Hero changes
  const handleHeroChange = (field: string, value: any) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, hero: { ...prev.hero, [field]: value } }) : null);
  };
  const handleSocialChange = (platform: string, value: string) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, hero: { ...prev.hero, socials: { ...prev.hero.socials, [platform]: value } } }) : null);
  };

  // Design/Theme changes
  const handleThemeChange = (selectedTheme: 'light' | 'cyberpunk') => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, theme: selectedTheme }) : null);
  };

  const handleTemplateChange = (selectedTemplate: 'minimal' | 'bento' | 'brutalist' | 'terminal') => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, template: selectedTemplate }) : null);
  };

  const handleSectionVisibilityToggle = (section: keyof SectionsVisibility) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
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

  // Projects CRUD
  const addProject = () => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, projects: [...prev.projects, { title: 'New Project', description: 'Describe details...', tech: ['React'], live: '', github: '' }] }) : null);
  };
  const deleteProject = (idx: number) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }) : null);
  };
  const updateProject = (idx: number, field: keyof ProjectData, value: any) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.projects];
      if (field === 'tech') {
        updated[idx] = { ...updated[idx], tech: typeof value === 'string' ? value.split(',').map(s => s.trim()) : value };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      return { ...prev, projects: updated };
    });
  };

  // GitHub Repos CRUD & Toggles
  const toggleRepoPin = (idx: number) => {
    if (!content || !content.github_repos) return;
    setContent((prev) => {
      if (!prev || !prev.github_repos) return null;
      const updated = [...prev.github_repos];
      updated[idx] = { ...updated[idx], pinned: !updated[idx].pinned };
      return { ...prev, github_repos: updated };
    });
  };

  // Experience CRUD
  const addExperience = () => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, experience: [...prev.experience, { role: 'Software Engineer', company: 'New Company', period: '2025', bullets: ['Built features...'] }] }) : null);
  };
  const deleteExperience = (idx: number) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }) : null);
  };
  const updateExperience = (idx: number, field: keyof ExperienceData, value: any) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.experience];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, experience: updated };
    });
  };
  const updateExperienceBullet = (expIdx: number, bulletIdx: number, value: string) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.experience];
      const bullets = [...updated[expIdx].bullets];
      bullets[bulletIdx] = value;
      updated[expIdx] = { ...updated[expIdx], bullets };
      return { ...prev, experience: updated };
    });
  };
  const addExperienceBullet = (expIdx: number) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.experience];
      updated[expIdx] = { ...updated[expIdx], bullets: [...updated[expIdx].bullets, 'New bullet point...'] };
      return { ...prev, experience: updated };
    });
  };
  const deleteExperienceBullet = (expIdx: number, bulletIdx: number) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.experience];
      updated[expIdx] = { ...updated[expIdx], bullets: updated[expIdx].bullets.filter((_, i) => i !== bulletIdx) };
      return { ...prev, experience: updated };
    });
  };

  const polishExperienceBullet = async (expIdx: number, bIdx: number) => {
    if (!content) return;
    const bulletText = content.experience[expIdx].bullets[bIdx];
    if (!bulletText.trim() || bulletText === 'New bullet point...') return;

    setPolishingItem({ type: 'experience', index: expIdx, subIndex: bIdx });
    try {
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
      addToast('Bullet point polished by AI!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to polish text.', 'error');
    } finally {
      setPolishingItem(null);
    }
  };

  const polishProjectDescription = async (projIdx: number) => {
    if (!content) return;
    const descText = content.projects[projIdx].description;
    if (!descText.trim() || descText === 'Describe details...') return;

    setPolishingItem({ type: 'project', index: projIdx });
    try {
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
      addToast('Project description polished by AI!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to polish text.', 'error');
    } finally {
      setPolishingItem(null);
    }
  };

  // Skills CRUD
  const addSkillCategory = () => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, skills: [...prev.skills, { category: 'Tools', items: ['Git'] }] }) : null);
  };
  const deleteSkillCategory = (idx: number) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }) : null);
  };
  const updateSkillCategoryName = (idx: number, name: string) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], category: name };
      return { ...prev, skills: updated };
    });
  };
  const updateSkillCategoryItems = (idx: number, itemsCsv: string) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.skills];
      updated[idx] = { ...updated[idx], items: itemsCsv.split(',').map(s => s.trim()).filter(Boolean) };
      return { ...prev, skills: updated };
    });
  };

  // Education CRUD
  const addEducation = () => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, education: [...prev.education, { institution: 'University', degree: 'Bachelor of Science', field: 'Computer Science', period: '2020 – 2024' }] }) : null);
  };
  const deleteEducation = (idx: number) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }) : null);
  };
  const updateEducation = (idx: number, field: keyof EducationData, value: string) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.education];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Certifications CRUD
  const addCertification = () => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, certifications: [...prev.certifications, { name: 'Certification', issuer: 'Issuer', date: '2025' }] }) : null);
  };
  const deleteCertification = (idx: number) => {
    if (!content) return;
    setContent((prev) => prev ? ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }) : null);
  };
  const updateCertification = (idx: number, field: keyof CertificationData, value: string) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const updated = [...prev.certifications];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  // LeetCode changes
  const handleLeetcodeChange = (field: keyof LeetCodeStats, value: any) => {
    if (!content) return;
    setContent((prev) => {
      if (!prev) return null;
      const leetcode = prev.leetcode || { username: '', solved: 0, easy: 0, medium: 0, hard: 0 };
      let cleanVal = value;
      if (['solved', 'easy', 'medium', 'hard', 'rating', 'ranking'].includes(field)) {
        cleanVal = parseInt(value) || 0;
      }
      return {
        ...prev,
        leetcode: {
          ...leetcode,
          [field]: cleanVal
        }
      };
    });
  };

  // Save handler
  const handleSave = async (silent = false) => {
    if (!user || !content || !profile) return;
    
    // Check username availability if changed
    if (usernameInput && usernameInput !== profile.username) {
      setSaving(true);
      try {
        const available = await checkUsernameAvailable(usernameInput);
        if (!available) {
          setUsernameError('This handle is already taken by another developer.');
          setActiveDashboardTab('settings'); // Navigate to settings tab to highlight error
          addToast('Handle is already taken!', 'error');
          setSaving(false);
          return;
        }
      } catch (err) {
        console.error('Username availability check failed:', err);
      }
    }

    setSaving(true);
    try {
      if (!supabase) {
        await savePortfolio(user.id, content);
        await updateProfile(user.id, { username: usernameInput, is_published: isPublishedInput });
        setProfile((prev) => prev ? ({ ...prev, username: usernameInput, is_published: isPublishedInput }) : null);
      } else {
        const session = (await supabase.auth.getSession()).data.session;
        const token = session?.access_token;
        const response = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ username: usernameInput, isPublished: isPublishedInput, content }),
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to publish changes.');
        }
        setProfile((prev) => prev ? ({ ...prev, username: usernameInput, is_published: isPublishedInput }) : null);
      }
      if (!silent) {
        addToast('Changes saved successfully!', 'success');
      }
    } catch (err: any) {
      if (!silent) {
        addToast(err.message || 'Failed to save changes.', 'error');
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => { await signOut(); router.push('/login'); };

  const handleCopyUrl = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${profile?.username}` : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('Portfolio URL copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  // Health score calculation
  const calculateHealth = () => {
    if (!content) return { score: 0, sourcesCount: 0, suggestions: [] };
    let score = 20; // base score
    let sourcesCount = 0;
    const suggestions: string[] = [];

    if (content.hero.name && content.hero.name !== 'Your Name') score += 15;
    if (content.hero.tagline && content.hero.tagline !== 'Your Professional Tagline') score += 15;
    if (content.hero.bio) score += 10;
    else suggestions.push('Write a bio summary in Hero tab.');

    if (content.hero.socials?.github) { score += 10; sourcesCount++; }
    else { suggestions.push('Sync your GitHub username.'); }

    if (content.hero.socials?.linkedin) { score += 10; sourcesCount++; }
    else { suggestions.push('Import your LinkedIn profile.'); }

    if (content.leetcode?.username) { score += 10; sourcesCount++; }
    else { suggestions.push('Connect your LeetCode username.'); }

    if (content.experience && content.experience.length > 0) score += 10;
    else suggestions.push('Add experience milestones to timeline.');

    score = Math.min(100, score);
    return { score, sourcesCount, suggestions };
  };

  // Connected Sources actions handlers
  const handleModalGitSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalGitUsername.trim() || !content) return;
    setSyncingSource(true);
    setModalError('');
    try {
      const data = await fetchGitHubData(modalGitUsername.trim());
      const updatedContent = {
        ...content,
        hero: {
          ...content.hero,
          socials: {
            ...content.hero.socials,
            github: modalGitUsername.trim(),
          }
        },
        github_repos: data.github_repos || [],
        skills: [...(content.skills || []), ...(data.skills || [])].filter((s, i, self) =>
          self.findIndex(t => t.category === s.category) === i
        )
      };
      setContent(updatedContent);
      await savePortfolio(user!.id, updatedContent);
      addToast(`Successfully synced with GitHub @${modalGitUsername.trim()}!`, 'success');
      setUpdateModalSource(null);
    } catch (err: any) {
      setModalError(err.message || 'Sync failed.');
    } finally {
      setSyncingSource(false);
    }
  };

  const handleModalLinkedinUrlSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalLinkedinUrl.trim() || !content) return;
    setSyncingSource(true);
    setModalError('');
    try {
      const res = await fetch('/api/linkedin-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: modalLinkedinUrl.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to parse LinkedIn URL.');
      }
      const data = await res.json();
      const updatedContent = { ...content, ...data };
      setContent(updatedContent);
      await savePortfolio(user!.id, updatedContent);
      addToast('LinkedIn URL details synced successfully!', 'success');
      setUpdateModalSource(null);
    } catch (err: any) {
      setModalError(err.message || 'Sync failed.');
    } finally {
      setSyncingSource(false);
    }
  };

  const handleModalLinkedinZipSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalLinkedinZip || !content) return;
    setSyncingSource(true);
    setModalError('');
    try {
      const data = await parseLinkedInExport(modalLinkedinZip);
      const updatedContent = { ...content, ...data };
      setContent(updatedContent);
      await savePortfolio(user!.id, updatedContent);
      addToast('Parsed and merged LinkedIn ZIP data export!', 'success');
      setUpdateModalSource(null);
    } catch (err: any) {
      setModalError(err.message || 'Failed to parse ZIP.');
    } finally {
      setSyncingSource(false);
    }
  };

  const handleModalResumeSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPdfFile || !content) return;
    setSyncingSource(true);
    setModalError('');
    try {
      const text = await extractTextFromPdf(modalPdfFile);
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed parsing resume.');
      }
      const data = await res.json();
      const updatedContent = { ...content, ...data };
      setContent(updatedContent);
      await savePortfolio(user!.id, updatedContent);
      addToast('Resume PDF parsed and imported successfully!', 'success');
      setUpdateModalSource(null);
    } catch (err: any) {
      setModalError(err.message || 'Resume parsing failed.');
    } finally {
      setSyncingSource(false);
    }
  };

  const handleModalLeetcodeSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalLeetcodeUsername.trim() || !content) return;
    setSyncingSource(true);
    setModalError('');
    try {
      const data = await fetchLeetCodeData(modalLeetcodeUsername.trim());
      const updatedContent = {
        ...content,
        leetcode: data
      };
      setContent(updatedContent);
      await savePortfolio(user!.id, updatedContent);
      addToast(`LeetCode username @${modalLeetcodeUsername.trim()} connected successfully!`, 'success');
      setUpdateModalSource(null);
    } catch (err: any) {
      setModalError(err.message || 'Sync failed.');
    } finally {
      setSyncingSource(false);
    }
  };

  // Shared input classes
  const inputCls = "w-full px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent text-text-primary placeholder:text-text-tertiary";
  const inputSmCls = "w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent text-text-primary placeholder:text-text-tertiary";
  const labelCls = "text-2xs font-semibold text-text-secondary uppercase tracking-wider";
  const sectionHeaderCls = "text-xs font-bold text-text-secondary uppercase tracking-wider";
  const addBtnCls = "flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer";
  const cardCls = "p-4 rounded-xl border border-border-primary bg-bg-primary relative space-y-4 shadow-2xs";

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <div className="w-64 space-y-3">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="h-3 skeleton rounded w-full" />
          <div className="h-3 skeleton rounded w-5/6" />
          <div className="h-8 skeleton rounded w-1/2 mt-4" />
        </div>
      </div>
    );
  }

  const livePortfolioUrl = typeof window !== 'undefined' ? `${window.location.origin}/${profile?.username}` : `/${profile?.username}`;

  const { score: healthScore, sourcesCount, suggestions: healthSuggestions } = calculateHealth();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col md:flex-row font-sans overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* SIDEBAR */}
      <aside
        className={`relative border-b md:border-b-0 md:border-r border-border-primary bg-bg-surface flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'md:w-60 p-5' : 'md:w-14 p-2'
        }`}
      >
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="hidden md:flex absolute -right-3 top-6 z-10 w-6 h-6 rounded-full border border-border-primary bg-bg-surface shadow-sm items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-primary transition cursor-pointer"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        <div className="space-y-6 overflow-hidden">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <div className="p-1 rounded bg-accent text-text-inverse shrink-0"><Sparkles size={14} /></div>
            {sidebarOpen && <span className="font-bold tracking-tight text-sm uppercase whitespace-nowrap">DEVPORT</span>}
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {([
              { key: 'overview' as const, icon: <LayoutDashboard size={14} />, label: 'Overview' },
              { key: 'edit' as const, icon: <Edit size={14} />, label: 'Edit Portfolio' },
              { key: 'settings' as const, icon: <Settings size={14} />, label: 'Settings' },
            ]).map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveDashboardTab(key)}
                title={!sidebarOpen ? label : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
                  sidebarOpen ? 'w-full' : 'justify-center w-full'
                } ${
                  activeDashboardTab === key
                    ? 'bg-accent text-text-inverse shadow-2xs'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                }`}
              >
                {icon}
                {sidebarOpen && <span>{label}</span>}
              </button>
            ))}
          </nav>

          {profile?.username && sidebarOpen && (
            <button
              onClick={handleCopyUrl}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent transition cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span className="truncate">{window.location.host}/{profile.username}</span>
            </button>
          )}
          {profile?.username && !sidebarOpen && (
            <button
              onClick={handleCopyUrl}
              title="Copy portfolio URL"
              className="flex items-center justify-center w-full p-2 rounded-lg border border-border-primary bg-bg-primary text-text-secondary hover:text-text-primary hover:border-accent transition cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-border-primary hidden md:block">
          {sidebarOpen && (
            <div className="text-2xs text-text-tertiary mb-3 truncate leading-relaxed">{user?.email}</div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Log Out' : undefined}
            className={`flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-rose-600 transition cursor-pointer ${
              !sidebarOpen ? 'justify-center w-full' : ''
            }`}
          >
            <LogOut size={14} />
            {sidebarOpen && 'Log Out'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <ErrorBoundary>
          {/* WORKSPACE AREA */}
          <div
          className="w-full md:w-1/2 border-r border-border-primary flex flex-col overflow-y-auto h-full bg-bg-primary"
        >

          {/* OVERVIEW DASHBOARD VIEW */}
          {activeDashboardTab === 'overview' && (
            <div className="p-6 space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-border-primary">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight animate-fade-in">Workspace Overview</h1>
                  <a
                    href={livePortfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary hover:text-accent hover:underline flex items-center gap-1 mt-1"
                  >
                    devport.com/{profile?.username} <ExternalLink size={10} />
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveDashboardTab('edit')}
                    className="px-3.5 py-1.5 rounded-lg border border-border-primary text-xs font-bold bg-bg-surface hover:bg-bg-code transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Edit size={13} /> Edit Portfolio
                  </button>
                  <a
                    href={livePortfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-accent text-text-inverse hover:bg-accent-hover text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs animate-pulse-subtle"
                  >
                    View Live <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Grid: Health & Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Portfolio Health */}
                <div className="p-5 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-between space-y-4 shadow-3xs">
                  <div className="space-y-1">
                    <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider">Portfolio Health</h3>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" className="stroke-border-primary fill-none" strokeWidth="4" />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="stroke-accent fill-none"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 - (healthScore / 100) * (2 * Math.PI * 24)}
                          />
                        </svg>
                        <span className="absolute text-xs font-bold">{healthScore}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-extrabold">{healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs attention'}</h4>
                        <p className="text-2xs text-text-secondary mt-0.5">{sourcesCount} sources connected</p>
                      </div>
                    </div>
                  </div>

                  {healthSuggestions.length > 0 && (
                    <div className="space-y-1.5 border-t border-border-primary pt-3">
                      {healthSuggestions.slice(0, 2).map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => { setActiveDashboardTab('edit'); setActiveEditTab('hero'); }}
                          className="w-full text-left text-2xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          ↗ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Analytics */}
                <div className="p-5 rounded-xl border border-border-primary bg-bg-surface flex flex-col justify-between space-y-4 shadow-3xs">
                  <div className="space-y-1">
                    <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider">Analytics (30 days)</h3>
                    
                    <div className="grid grid-cols-3 gap-2 pt-3">
                      <div className="text-center">
                        <div className="text-lg font-black">284</div>
                        <div className="text-[10px] font-bold text-text-secondary uppercase">Total views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black">47</div>
                        <div className="text-[10px] font-bold text-text-secondary uppercase">Recruiter Click</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black">12</div>
                        <div className="text-[10px] font-bold text-text-secondary uppercase">Emails sent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Sources */}
              <div className="p-5 rounded-xl border border-border-primary bg-bg-surface space-y-4 shadow-3xs">
                <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider">Connected Sources</h3>

                <div className="space-y-3">
                  {[
                    {
                      name: 'GitHub Repositories',
                      desc: content?.hero.socials?.github ? `@${content.hero.socials.github} · repos loaded` : 'Not synced',
                      connected: !!content?.hero.socials?.github,
                      type: 'github' as const
                    },
                    {
                      name: 'LinkedIn Milestones',
                      desc: content?.hero.socials?.linkedin ? `@${content.hero.socials.linkedin} · imported` : 'Not synced',
                      connected: !!content?.hero.socials?.linkedin,
                      type: 'linkedin' as const
                    },
                    {
                      name: 'LeetCode Competitive stats',
                      connected: !!content?.leetcode?.username,
                      desc: content?.leetcode?.username ? `@${content.leetcode.username} · ${content.leetcode.solved} solved` : 'Not synced',
                      type: 'leetcode' as const
                    },
                    {
                      name: 'Resume PDF',
                      desc: content?.experience && content.experience.length > 0 ? 'Milestones extracted via AI' : 'Not parsed',
                      connected: !!content?.experience && content.experience.length > 0,
                      type: 'resume' as const
                    }
                  ].map((source, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-border-primary bg-bg-primary">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${source.connected ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                        <div>
                          <h4 className="text-xs font-bold">{source.name}</h4>
                          <p className="text-[10px] text-text-secondary mt-0.5">{source.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUpdateModalSource(source.type)}
                        className="px-2.5 py-1 rounded bg-bg-surface hover:bg-bg-code border border-border-primary text-[10px] font-bold text-text-secondary hover:text-text-primary transition cursor-pointer"
                      >
                        Sync
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Activity */}
              <div className="p-5 rounded-xl border border-border-primary bg-bg-surface space-y-3 shadow-3xs">
                <h3 className="text-2xs font-extrabold text-text-tertiary uppercase tracking-wider flex items-center gap-1">
                  <Activity size={12} /> Sync Log Activity
                </h3>
                
                <div className="space-y-3 pt-1 text-[11px] leading-relaxed text-text-secondary">
                  {content?.hero.socials?.github && (
                    <div className="flex gap-2">
                      <span className="text-text-tertiary font-medium w-16 shrink-0">14 min ago</span>
                      <p>GitHub sync completed successfully. GitHub Repos list updated.</p>
                    </div>
                  )}
                  {content?.leetcode?.username && (
                    <div className="flex gap-2">
                      <span className="text-text-tertiary font-medium w-16 shrink-0">6 hr ago</span>
                      <p>LeetCode daily sync completed · Solved {content.leetcode.solved} problems parsed.</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-text-tertiary font-medium w-16 shrink-0">Just now</span>
                    <p>Portfolio status saved to persistent JSON store.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* EDIT TAB */}
          {activeDashboardTab === 'edit' && content && (
            <div className="flex flex-col h-full">
              {/* Main edit workspace tabs */}
              <div className="flex border-b border-border-primary bg-bg-surface p-1.5 overflow-x-auto gap-0.5 shrink-0">
                {([
                  { tab: 'hero' as const, label: 'Hero' },
                  { tab: 'experience' as const, label: 'Experience' },
                  { tab: 'projects' as const, label: 'Projects' },
                  { tab: 'skills' as const, label: 'Skills' },
                  { tab: 'leetcode' as const, label: 'LeetCode' },
                  { tab: 'education' as const, label: 'Education' },
                  { tab: 'certifications' as const, label: 'Certs' },
                  { tab: 'design' as const, label: 'Design & Theme' },
                ]).map(({ tab, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveEditTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      activeEditTab === tab ? 'bg-accent text-text-inverse shadow-2xs' : 'text-text-secondary hover:bg-bg-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5 flex-1 space-y-5 overflow-y-auto">

                {/* HERO */}
                {activeEditTab === 'hero' && (
                  <div className="space-y-4">
                    <div className="border-b border-border-primary pb-2">
                      <h3 className={sectionHeaderCls}>About &amp; Intro</h3>
                      <p className="text-2xs text-text-tertiary mt-0.5">Define your main presentation section.</p>
                    </div>
                    {[
                      { label: 'Display Name', value: content.hero.name, field: 'name' },
                      { label: 'Tagline / Professional Title', value: content.hero.tagline, field: 'tagline' },
                    ].map(({ label, value, field }) => (
                      <div key={field} className="space-y-1">
                        <label className={labelCls}>{label}</label>
                        <input type="text" value={value} onChange={(e) => handleHeroChange(field, e.target.value)} className={inputCls} />
                      </div>
                    ))}
                    
                    <div className="space-y-1">
                      <label className={labelCls}>Profile Avatar Image URL</label>
                      <input
                        type="text"
                        value={content.hero.avatar_url || ''}
                        placeholder="https://example.com/avatar.jpg"
                        onChange={(e) => handleHeroChange('avatar_url', e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={labelCls}>Bio Summary</label>
                      <textarea rows={3} value={content.hero.bio} onChange={(e) => handleHeroChange('bio', e.target.value)} className={`${inputCls} resize-none`} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className={labelCls}>Location</label>
                        <input
                          type="text"
                          value={content.hero.location || ''}
                          placeholder="San Francisco, CA"
                          onChange={(e) => handleHeroChange('location', e.target.value)}
                          className={inputSmCls}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Availability Status</label>
                        <div className="flex items-center gap-2 h-[34px]">
                          <input
                            type="checkbox"
                            checked={!!content.hero.open_to_work}
                            id="open-to-work-check"
                            onChange={(e) => handleHeroChange('open_to_work', e.target.checked)}
                            className="w-4 h-4 rounded text-accent border-border-primary"
                          />
                          <label htmlFor="open-to-work-check" className="text-xs font-bold text-text-secondary">Open to work</label>
                        </div>
                      </div>
                    </div>

                    <h3 className={`${sectionHeaderCls} pt-3`}>Contact Handles</h3>
                    {[
                      { label: 'GitHub Username', platform: 'github', value: content.hero.socials?.github },
                      { label: 'LinkedIn Username', platform: 'linkedin', value: content.hero.socials?.linkedin },
                      { label: 'Twitter Username', platform: 'twitter', value: content.hero.socials?.twitter },
                      { label: 'Website URL', platform: 'website', value: content.hero.socials?.website },
                      { label: 'Email Address', platform: 'email', value: content.hero.socials?.email },
                    ].map(({ label, platform, value }) => (
                      <div key={platform} className="space-y-1">
                        <label className={labelCls}>{label}</label>
                        <input type="text" value={value || ''} onChange={(e) => handleSocialChange(platform, e.target.value)} className={inputCls} />
                      </div>
                    ))}
                  </div>
                )}

                {/* EXPERIENCE */}
                {activeEditTab === 'experience' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-border-primary pb-2">
                      <div>
                        <h3 className={sectionHeaderCls}>Employment History</h3>
                        <p className="text-2xs text-text-tertiary mt-0.5">List your relevant work milestones.</p>
                      </div>
                      <button onClick={addExperience} className={addBtnCls}><Plus size={11} /> Add</button>
                    </div>
                    {content.experience.map((exp, expIdx) => (
                      <div key={expIdx} className={cardCls}>
                        <button onClick={() => deleteExperience(expIdx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={14} /></button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><label className={labelCls}>Company</label><input type="text" value={exp.company} onChange={(e) => updateExperience(expIdx, 'company', e.target.value)} className={inputSmCls} /></div>
                          <div className="space-y-1"><label className={labelCls}>Role</label><input type="text" value={exp.role} onChange={(e) => updateExperience(expIdx, 'role', e.target.value)} className={inputSmCls} /></div>
                        </div>
                        <div className="space-y-1"><label className={labelCls}>Period</label><input type="text" value={exp.period} onChange={(e) => updateExperience(expIdx, 'period', e.target.value)} className={inputSmCls} /></div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className={labelCls}>Bullet Points</label>
                            <button onClick={() => addExperienceBullet(expIdx)} className="text-2xs text-text-secondary hover:text-text-primary hover:underline cursor-pointer">+ Add Bullet</button>
                          </div>
                           {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-1.5 items-center">
                              <input type="text" value={bullet} onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)} className={`flex-1 ${inputSmCls}`} />
                              <button
                                onClick={() => polishExperienceBullet(expIdx, bIdx)}
                                disabled={polishingItem?.type === 'experience' && polishingItem.index === expIdx && polishingItem.subIndex === bIdx}
                                className="p-1.5 rounded-lg border border-border-primary hover:bg-bg-primary text-text-secondary hover:text-accent disabled:opacity-50 transition cursor-pointer flex items-center justify-center shrink-0"
                                title="Polish with AI"
                              >
                                {polishingItem?.type === 'experience' && polishingItem.index === expIdx && polishingItem.subIndex === bIdx ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Sparkles size={12} />
                                )}
                              </button>
                              <button onClick={() => deleteExperienceBullet(expIdx, bIdx)} className="text-text-tertiary hover:text-rose-500 transition cursor-pointer shrink-0"><Trash2 size={13} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PROJECTS WITH SEPARATE CUSTOM / GITHUB TABS */}
                {activeEditTab === 'projects' && (
                  <div className="space-y-5">
                    {/* Projects subtab header */}
                    <div className="flex justify-between items-center border-b border-border-primary pb-2.5">
                      <div>
                        <h3 className={sectionHeaderCls}>Project Showcase</h3>
                        <p className="text-2xs text-text-tertiary mt-0.5">Manage custom works or sync open source code.</p>
                      </div>

                      <div className="flex bg-bg-surface p-1 rounded-lg border border-border-primary gap-0.5">
                        <button
                          onClick={() => setProjectSubTab('custom')}
                          className={`px-3 py-1 rounded text-2xs font-bold transition ${
                            projectSubTab === 'custom' ? 'bg-accent text-text-inverse' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Featured
                        </button>
                        <button
                          onClick={() => setProjectSubTab('github')}
                          className={`px-3 py-1 rounded text-2xs font-bold transition ${
                            projectSubTab === 'github' ? 'bg-accent text-text-inverse' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          GitHub Sync
                        </button>
                      </div>
                    </div>

                    {/* CUSTOM FEATURED PROJECTS LIST */}
                    {projectSubTab === 'custom' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-2xs font-bold text-text-secondary uppercase">Featured (Manually Added)</h4>
                          <button onClick={addProject} className={addBtnCls}><Plus size={11} /> Add Project</button>
                        </div>
                        {content.projects.map((proj, projIdx) => (
                          <div key={projIdx} className={cardCls}>
                            <button onClick={() => deleteProject(projIdx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={14} /></button>
                            <div className="space-y-1"><label className={labelCls}>Project Title</label><input type="text" value={proj.title} onChange={(e) => updateProject(projIdx, 'title', e.target.value)} className={inputSmCls} /></div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className={labelCls}>Description</label>
                                <button
                                  type="button"
                                  onClick={() => polishProjectDescription(projIdx)}
                                  disabled={polishingItem?.type === 'project' && polishingItem.index === projIdx}
                                  className="text-2xs font-semibold text-text-secondary hover:text-accent hover:underline flex items-center gap-1 disabled:opacity-50 transition cursor-pointer select-none"
                                >
                                  {polishingItem?.type === 'project' && polishingItem.index === projIdx ? (
                                    <><Loader2 size={10} className="animate-spin" /> Polishing...</>
                                  ) : (
                                    <><Sparkles size={10} /> Polish with AI</>
                                  )}
                                </button>
                              </div>
                              <textarea rows={2} value={proj.description} onChange={(e) => updateProject(projIdx, 'description', e.target.value)} className={`${inputSmCls} resize-none`} />
                            </div>
                            <div className="space-y-1"><label className={labelCls}>Tech tags (comma separated)</label><input type="text" value={proj.tech.join(', ')} onChange={(e) => updateProject(projIdx, 'tech', e.target.value)} className={inputSmCls} /></div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><label className={labelCls}>GitHub Repo Link</label><input type="text" value={proj.github || ''} onChange={(e) => updateProject(projIdx, 'github', e.target.value)} className={inputSmCls} placeholder="owner/repo" /></div>
                              <div className="space-y-1"><label className={labelCls}>Live Preview URL</label><input type="text" value={proj.live || ''} onChange={(e) => updateProject(projIdx, 'live', e.target.value)} className={inputSmCls} placeholder="https://..." /></div>
                            </div>
                          </div>
                        ))}
                        {content.projects.length === 0 && (
                          <div className="text-center py-8 border border-dashed border-border-primary rounded-xl text-text-secondary text-xs">
                            No featured projects added yet. Click Add Project to start.
                          </div>
                        )}
                      </div>
                    )}

                    {/* SYNCED GITHUB REPOSITORIES LIST */}
                    {projectSubTab === 'github' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <h4 className="text-2xs font-bold text-text-secondary uppercase">Synced Repos (GitHub Source)</h4>
                          <button
                            onClick={() => setUpdateModalSource('github')}
                            className="flex items-center gap-1.5 px-3 py-1 rounded bg-bg-surface hover:bg-bg-code border border-border-primary text-2xs font-bold transition cursor-pointer"
                          >
                            <Sliders size={11} /> Re-sync GitHub
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(content.github_repos || []).map((repo, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-border-primary bg-bg-primary flex justify-between items-center shadow-3xs">
                              <div className="space-y-1 max-w-[70%]">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs truncate">{repo.title}</span>
                                  {repo.stars !== undefined && repo.stars > 0 && (
                                    <span className="text-[10px] text-text-tertiary">★ {repo.stars}</span>
                                  )}
                                </div>
                                <p className="text-[11px] text-text-secondary truncate">{repo.description}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!repo.pinned}
                                    onChange={() => toggleRepoPin(idx)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4.5 bg-border-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-border-primary after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse peer-checked:after:border-transparent" />
                                </label>
                                <span className="text-[10px] font-bold text-text-secondary w-9">{repo.pinned ? 'Pinned' : 'Hidden'}</span>
                              </div>
                            </div>
                          ))}

                          {(!content.github_repos || content.github_repos.length === 0) && (
                            <div className="text-center py-10 border border-dashed border-border-primary rounded-xl text-text-secondary space-y-3">
                              <p className="text-xs">No repositories synced yet. Connect your GitHub handle.</p>
                              <button
                                onClick={() => setUpdateModalSource('github')}
                                className="px-3.5 py-1.5 rounded-lg bg-accent text-text-inverse text-xs font-bold hover:bg-accent-hover transition cursor-pointer"
                              >
                                Connect GitHub
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SKILLS */}
                {activeEditTab === 'skills' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-border-primary pb-2">
                      <div>
                        <h3 className={sectionHeaderCls}>Skills Categories</h3>
                        <p className="text-2xs text-text-tertiary mt-0.5">List your core technical expertise stack.</p>
                      </div>
                      <button onClick={addSkillCategory} className={addBtnCls}><Plus size={11} /> Add Category</button>
                    </div>
                    {content.skills.map((skillCat, idx) => (
                      <div key={idx} className={cardCls}>
                        <button onClick={() => deleteSkillCategory(idx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={14} /></button>
                        <div className="space-y-1"><label className={labelCls}>Category</label><input type="text" value={skillCat.category} onChange={(e) => updateSkillCategoryName(idx, e.target.value)} className={inputSmCls} /></div>
                        <div className="space-y-1"><label className={labelCls}>Skills (comma separated)</label><input type="text" value={skillCat.items.join(', ')} onChange={(e) => updateSkillCategoryItems(idx, e.target.value)} className={inputSmCls} /></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* LEETCODE */}
                {activeEditTab === 'leetcode' && (
                  <div className="space-y-5">
                    <div className="border-b border-border-primary pb-2">
                      <h3 className={sectionHeaderCls}>LeetCode integration</h3>
                      <p className="text-2xs text-text-tertiary mt-0.5">Sync solved stats to display under competitive programming.</p>
                    </div>

                    <div className={cardCls}>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className={labelCls}>LeetCode Username</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={content.leetcode?.username || ''}
                              placeholder="LeetCode username"
                              onChange={(e) => handleLeetcodeChange('username', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-border-primary bg-bg-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                const username = content.leetcode?.username;
                                if (!username) return;
                                try {
                                  addToast('Fetching stats from LeetCode...', 'info');
                                  const stats = await fetchLeetCodeData(username);
                                  setContent(prev => prev ? ({ ...prev, leetcode: stats }) : null);
                                  addToast('Synced successfully!', 'success');
                                } catch (e) {
                                  addToast('Sync failed, using defaults.', 'error');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-accent text-text-inverse hover:bg-accent-hover font-bold text-xs transition cursor-pointer"
                            >
                              Sync
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1">
                            <label className={labelCls}>Problems Solved</label>
                            <input
                              type="number"
                              value={content.leetcode?.solved || 0}
                              onChange={(e) => handleLeetcodeChange('solved', e.target.value)}
                              className={inputSmCls}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className={labelCls}>Contest Rating</label>
                            <input
                              type="number"
                              value={content.leetcode?.rating || 0}
                              onChange={(e) => handleLeetcodeChange('rating', e.target.value)}
                              className={inputSmCls}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-primary/50">
                          <div className="space-y-1">
                            <label className={labelCls}>Easy Solved</label>
                            <input
                              type="number"
                              value={content.leetcode?.easy || 0}
                              onChange={(e) => handleLeetcodeChange('easy', e.target.value)}
                              className={inputSmCls}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className={labelCls}>Medium Solved</label>
                            <input
                              type="number"
                              value={content.leetcode?.medium || 0}
                              onChange={(e) => handleLeetcodeChange('medium', e.target.value)}
                              className={inputSmCls}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className={labelCls}>Hard Solved</label>
                            <input
                              type="number"
                              value={content.leetcode?.hard || 0}
                              onChange={(e) => handleLeetcodeChange('hard', e.target.value)}
                              className={inputSmCls}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* EDUCATION */}
                {activeEditTab === 'education' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-border-primary pb-2">
                      <div>
                        <h3 className={sectionHeaderCls}>Education</h3>
                        <p className="text-2xs text-text-tertiary mt-0.5">Add university or academic degrees.</p>
                      </div>
                      <button onClick={addEducation} className={addBtnCls}><Plus size={11} /> Add</button>
                    </div>
                    {content.education.map((edu, idx) => (
                      <div key={idx} className={cardCls}>
                        <button onClick={() => deleteEducation(idx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={14} /></button>
                        <div className="space-y-1"><label className={labelCls}>Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} className={inputSmCls} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><label className={labelCls}>Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className={inputSmCls} /></div>
                          <div className="space-y-1"><label className={labelCls}>Field of Study</label><input type="text" value={edu.field} onChange={(e) => updateEducation(idx, 'field', e.target.value)} className={inputSmCls} /></div>
                        </div>
                        <div className="space-y-1"><label className={labelCls}>Period</label><input type="text" value={edu.period} onChange={(e) => updateEducation(idx, 'period', e.target.value)} className={inputSmCls} /></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CERTIFICATIONS */}
                {activeEditTab === 'certifications' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-border-primary pb-2">
                      <div>
                        <h3 className={sectionHeaderCls}>Certifications</h3>
                        <p className="text-2xs text-text-tertiary mt-0.5">List professional certificates and verify URLs.</p>
                      </div>
                      <button onClick={addCertification} className={addBtnCls}><Plus size={11} /> Add</button>
                    </div>
                    {content.certifications.map((cert, idx) => (
                      <div key={idx} className={cardCls}>
                        <button onClick={() => deleteCertification(idx)} className="absolute right-3 top-3 text-text-tertiary hover:text-rose-500 transition cursor-pointer"><Trash2 size={14} /></button>
                        <div className="space-y-1"><label className={labelCls}>Name</label><input type="text" value={cert.name} onChange={(e) => updateCertification(idx, 'name', e.target.value)} className={inputSmCls} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><label className={labelCls}>Issuer</label><input type="text" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} className={inputSmCls} /></div>
                          <div className="space-y-1"><label className={labelCls}>Date</label><input type="text" value={cert.date} onChange={(e) => updateCertification(idx, 'date', e.target.value)} className={inputSmCls} /></div>
                        </div>
                        <div className="space-y-1"><label className={labelCls}>Verification URL</label><input type="text" value={cert.url || ''} onChange={(e) => updateCertification(idx, 'url', e.target.value)} className={inputSmCls} placeholder="https://" /></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DESIGN & THEMES (Layout Controls) */}
                {activeEditTab === 'design' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-b border-border-primary pb-2">
                      <h3 className={sectionHeaderCls}>Visual Template</h3>
                      <p className="text-2xs text-text-tertiary mt-0.5">Select a layout structure for your profile.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { id: 'minimal' as const, name: 'Minimalist Document', desc: 'Airy, single-column focused on clean typography.', icon: '📜' },
                        { id: 'bento' as const, name: 'Bento Grid Dashboard', desc: 'Responsive dashboard of cards with stats and repos.', icon: '🍱' },
                        { id: 'brutalist' as const, name: 'Neo-Brutalist Pop', desc: 'Thick black borders, offset solid shadows, and high contrast.', icon: '⚡' },
                        { id: 'terminal' as const, name: 'Retro UNIX Terminal', desc: 'Interactive developer console styling with CLI commands.', icon: '💻' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleTemplateChange(t.id)}
                          className={`p-4 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none relative bg-bg-surface border-border-primary ${
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

                    <div className="border-b border-border-primary pb-2">
                      <h3 className={sectionHeaderCls}>Visual Theme</h3>
                      <p className="text-2xs text-text-tertiary mt-0.5">Choose a design aesthetic for your page.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'light' as const, name: 'Light Minimalist', desc: 'Clean, clean slate design with soft zinc cards.', border: 'border-zinc-200 bg-white text-zinc-800' },
                        { id: 'cyberpunk' as const, name: 'Cyberpunk Green', desc: 'Retro terminal green look with dark slate background.', border: 'border-emerald-500/20 bg-zinc-950 text-emerald-400' }
                      ].map((t) => (
                        <button
                          key={t.id}
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

                    <div className="border-b border-border-primary pb-2 pt-3">
                      <h3 className={sectionHeaderCls}>Section Visibility</h3>
                      <p className="text-2xs text-text-tertiary mt-0.5">Toggle showing/hiding sections on your public page.</p>
                    </div>

                    <div className="p-4 rounded-xl border border-border-primary bg-bg-surface space-y-3">
                      {[
                        { label: 'Work Experience timeline', field: 'experience' as const },
                        { label: 'Featured projects showcase', field: 'projects' as const },
                        { label: 'GitHub Synced repositories', field: 'github_repos' as const },
                        { label: 'Expertise & Skills list', field: 'skills' as const },
                        { label: 'LeetCode solved progress', field: 'leetcode' as const },
                        { label: 'Education credentials', field: 'education' as const },
                        { label: 'Certifications listings', field: 'certifications' as const },
                        { label: 'Contact message form', field: 'contact' as const }
                      ].map((item, idx) => {
                        const isChecked = content.sections_visibility ? (content.sections_visibility[item.field] !== false) : true;
                        return (
                          <div key={idx} className="flex justify-between items-center py-2.5 border-b border-border-primary/40 last:border-b-0">
                            <span className="text-xs font-semibold text-text-secondary">{item.label}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSectionVisibilityToggle(item.field)}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4.5 bg-border-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-border-primary after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse peer-checked:after:border-transparent" />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Save Bar */}
              <div className="p-3 border-t border-border-primary bg-bg-surface shrink-0 flex items-center justify-between">
                <button
                  onClick={() => setActiveDashboardTab('overview')}
                  className="px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-xs font-bold hover:bg-bg-code transition cursor-pointer"
                >
                  Workspace Dashboard
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-xs font-bold text-text-inverse transition cursor-pointer shadow-2xs"
                >
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Save size={13} /> Save Changes</>}
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeDashboardTab === 'settings' && profile && (
            <div className="p-5 space-y-5">
              <div className="border-b border-border-primary pb-3">
                <h2 className="text-lg font-bold tracking-tight">Portal Settings</h2>
                <p className="text-xs text-text-secondary mt-0.5">Manage your subpath handle and visibility.</p>
              </div>

              <div className="p-4 rounded-xl border border-border-primary bg-bg-surface space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold flex items-center gap-2"><Globe size={14} className="text-text-secondary" /> Public Visibility</h3>
                <p className="text-xs text-text-secondary leading-relaxed">When private, visitors see a 404 page.</p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary border border-border-primary">
                  <span className="text-xs font-bold flex items-center gap-2">
                    {isPublishedInput ? <><Eye size={14} className="text-emerald-600" /> Live &amp; Public</> : <><EyeOff size={14} className="text-text-tertiary" /> Private</>}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isPublishedInput} onChange={(e) => setIsPublishedInput(e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-border-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-border-primary after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse peer-checked:after:border-transparent" />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border-primary bg-bg-surface space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold flex items-center gap-2"><Settings size={14} className="text-text-secondary" /> Edit Handle</h3>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-2xs text-text-tertiary font-extrabold select-none">
                    {typeof window !== 'undefined' ? window.location.host : 'devport.com'}/
                  </span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => { setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setUsernameError(''); }}
                    className="w-full pl-[9.5rem] pr-3 py-2 rounded-lg border border-border-primary bg-bg-primary text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                {usernameError && <p className="text-rose-600 text-2xs">{usernameError}</p>}
              </div>

              <button onClick={() => handleSave(false)} disabled={saving} className="w-full py-2.5 bg-accent hover:bg-accent-hover text-text-inverse font-bold text-xs rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save Settings'}
              </button>

              <button onClick={handleLogout} className="w-full py-2.5 border border-border-primary text-text-secondary hover:text-rose-600 text-xs font-bold rounded-lg transition md:hidden cursor-pointer bg-bg-primary">
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div
          className="overflow-y-auto hidden md:flex md:w-1/2 flex-col relative bg-bg-surface/30 p-5 shrink-0"
        >
          <div className="flex justify-between items-center mb-3 shrink-0 gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live Preview
              </span>
              <div className="flex items-center gap-1 border border-border-primary rounded-lg p-0.5 bg-bg-surface">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition select-none cursor-pointer ${previewMode === 'desktop' ? 'bg-accent text-text-inverse' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition select-none cursor-pointer ${previewMode === 'mobile' ? 'bg-accent text-text-inverse' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {profile?.username && profile?.is_published && (
              <a href={livePortfolioUrl} target="_blank" rel="noopener noreferrer" className="text-2xs font-bold text-text-secondary hover:text-accent flex items-center gap-1 underline transition shrink-0">
                View Live ({profile.username}) <Eye size={11} />
              </a>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <div className={`transition-all duration-300 ${
              previewMode === 'mobile' 
                ? 'w-[375px] h-[667px] border-8 border-zinc-800 rounded-[2rem] shadow-2xl relative overflow-hidden shrink-0' 
                : 'w-full h-full border border-border-primary rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden'
            } bg-bg-primary`}>
              {content ? <PortfolioPreview data={content} isDemo={true} /> : (
                <div className="absolute inset-0 flex items-center justify-center"><Loader2 size={18} className="animate-spin text-text-tertiary" /></div>
              )}
            </div>
          </div>
        </div>

      {/* UPDATE MODALS POPUPS */}
      {updateModalSource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-primary bg-bg-surface p-5 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => { setUpdateModalSource(null); setModalError(''); }}
              className="absolute right-4 top-4 text-text-tertiary hover:text-text-primary transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-extrabold flex items-center gap-1.5 capitalize border-b border-border-primary pb-2.5">
              {updateModalSource === 'github' && <><Github size={16} /> Update GitHub Source</>}
              {updateModalSource === 'linkedin' && <><Linkedin size={16} /> Update LinkedIn Source</>}
              {updateModalSource === 'resume' && <><FileText size={16} /> Update Resume Source</>}
              {updateModalSource === 'leetcode' && <><Terminal size={16} /> Update LeetCode Source</>}
            </h3>

            {modalError && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-100 text-rose-700 text-2xs flex items-center gap-1.5">
                <AlertCircle size={12} /> {modalError}
              </div>
            )}

            {/* GITHUB UPDATE FORM */}
            {updateModalSource === 'github' && (
              <form onSubmit={handleModalGitSync} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-2xs font-semibold text-text-secondary uppercase">GitHub Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    value={modalGitUsername}
                    onChange={(e) => setModalGitUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={syncingSource || !modalGitUsername.trim()}
                  className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse disabled:opacity-50 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {syncingSource ? <><Loader2 size={12} className="animate-spin" /> Syncing...</> : 'Sync Repositories'}
                </button>
              </form>
            )}

            {/* LINKEDIN UPDATE FORM */}
            {updateModalSource === 'linkedin' && (
              <div className="space-y-4">
                <form onSubmit={handleModalLinkedinUrlSync} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-2xs font-semibold text-text-secondary uppercase font-bold">Sync via Profile URL</label>
                    <input
                      type="text"
                      required
                      placeholder="linkedin.com/in/username"
                      value={modalLinkedinUrl}
                      onChange={(e) => setModalLinkedinUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={syncingSource || !modalLinkedinUrl.trim()}
                    className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse disabled:opacity-50 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {syncingSource ? <><Loader2 size={12} className="animate-spin" /> Syncing URL...</> : 'Sync via URL'}
                  </button>
                </form>

                <div className="text-[10px] font-bold text-text-tertiary text-center uppercase tracking-wider">or upload data export</div>

                <form onSubmit={handleModalLinkedinZipSync} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-2xs font-semibold text-text-secondary uppercase">ZIP Export File</label>
                    <input
                      type="file"
                      accept=".zip"
                      required
                      onChange={(e) => setModalLinkedinZip(e.target.files?.[0] || null)}
                      className="block w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border-primary file:text-xs file:font-semibold file:bg-bg-primary file:text-text-primary hover:file:bg-bg-surface cursor-pointer"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={syncingSource || !modalLinkedinZip}
                    className="w-full py-2 bg-bg-surface hover:bg-bg-code border border-border-primary text-text-primary disabled:opacity-50 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {syncingSource ? <><Loader2 size={12} className="animate-spin" /> Parsing ZIP...</> : 'Parse ZIP Export'}
                  </button>
                </form>
              </div>
            )}

            {/* LEETCODE UPDATE FORM */}
            {updateModalSource === 'leetcode' && (
              <form onSubmit={handleModalLeetcodeSync} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-2xs font-semibold text-text-secondary uppercase font-bold">LeetCode Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter LeetCode username"
                    value={modalLeetcodeUsername}
                    onChange={(e) => setModalLeetcodeUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={syncingSource || !modalLeetcodeUsername.trim()}
                  className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse disabled:opacity-50 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {syncingSource ? <><Loader2 size={12} className="animate-spin" /> Connecting...</> : 'Sync LeetCode Stats'}
                </button>
              </form>
            )}

            {/* RESUME UPDATE FORM */}
            {updateModalSource === 'resume' && (
              <form onSubmit={handleModalResumeSync} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-2xs font-semibold text-text-secondary uppercase">Upload Resume PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setModalPdfFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border-primary file:text-xs file:font-semibold file:bg-bg-primary file:text-text-primary hover:file:bg-bg-surface cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={syncingSource || !modalPdfFile}
                  className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse disabled:opacity-50 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {syncingSource ? <><Loader2 size={12} className="animate-spin" /> Extracting PDF...</> : 'Parse Resume PDF'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
