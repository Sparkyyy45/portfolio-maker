'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { PortfolioContent } from '@/types/portfolio';
import {
  Github, Linkedin, Twitter, ExternalLink, Calendar, Briefcase, Mail, Send,
  Award, GraduationCap, ShieldCheck, Globe, ArrowUpRight, Code2, User,
  Share2, MapPin, Flame, Check, Copy, Info, Terminal, ChevronRight, BookOpen
} from 'lucide-react';

interface PortfolioPreviewProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function GlassTemplate({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
  const {
    hero, skills, projects, experience, education, certifications, leetcode,
    github_repos, theme = 'dark', sections_visibility
  } = data;

  const [copiedShare, setCopiedShare] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      alert('This is a preview. Message feature is active on the live link!');
      return;
    }
    if (!visitorName || !visitorEmail || !messageContent) {
      setError('Please fill in all fields.');
      return;
    }
    setSending(true);
    setError('');
    try {
      if (onSubmitMessage) {
        await onSubmitMessage({ name: visitorName, email: visitorEmail, content: messageContent });
        setSuccess(true);
        setVisitorName('');
        setVisitorEmail('');
        setMessageContent('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleShareClick = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Section Visibilities Checks
  const showExperience = (sections_visibility?.experience ?? true) && experience && experience.length > 0;
  const showProjects = (sections_visibility?.projects ?? true) && projects && projects.length > 0;
  const showSkills = (sections_visibility?.skills ?? true) && skills && skills.length > 0;
  const showEducation = (sections_visibility?.education ?? true) && education && education.length > 0;
  const showCertifications = (sections_visibility?.certifications ?? true) && certifications && certifications.length > 0;
  const showContact = (sections_visibility?.contact ?? true);

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'DP';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  // Glass theme styling presets (adapt overlay colors depending on light vs dark selector)
  const themeStyles = {
    light: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100/40 via-indigo-50/50 to-white text-slate-800",
      glassCard: "bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:bg-white/50 transition duration-300",
      glassCardInner: "bg-white/40 hover:bg-white/60 border border-white/50 shadow-[0_4px_20px_0_rgba(31,38,135,0.03)]",
      textTitle: "text-slate-900",
      textMuted: "text-slate-650",
      pill: "bg-indigo-500/10 text-indigo-700 border border-indigo-500/20",
      accentText: "text-indigo-600",
      accentBg: "bg-indigo-600",
      input: "bg-white/30 border border-slate-200 focus:border-indigo-500 text-slate-900",
      button: "bg-indigo-600 hover:bg-indigo-500 text-white",
      isLight: true,
      blob1: "bg-sky-300",
      blob2: "bg-indigo-300",
      blob3: "bg-amber-200",
    },
    dark: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black text-zinc-200",
      glassCard: "bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-zinc-900/40 transition duration-300",
      glassCardInner: "bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)]",
      textTitle: "text-white",
      textMuted: "text-zinc-400",
      pill: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      accentText: "text-emerald-450",
      accentBg: "bg-emerald-500",
      input: "bg-zinc-950/40 border border-zinc-800 focus:border-emerald-500 text-zinc-200",
      button: "bg-emerald-600 hover:bg-emerald-550 text-zinc-950 font-bold",
      isLight: false,
      blob1: "bg-indigo-900/60",
      blob2: "bg-purple-900/45",
      blob3: "bg-zinc-800/40",
    },
    cyberpunk: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/30 via-zinc-950 to-slate-950 text-emerald-400",
      glassCard: "bg-zinc-900/40 backdrop-blur-md border-2 border-emerald-500/25 shadow-[0_8px_32px_0_rgba(16,185,129,0.05)] hover:bg-zinc-900/50 transition duration-300",
      glassCardInner: "bg-emerald-500/[0.03] hover:bg-emerald-500/[0.07] border border-emerald-500/20 shadow-[0_4px_20px_0_rgba(16,185,129,0.02)]",
      textTitle: "text-white",
      textMuted: "text-emerald-500/80",
      pill: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
      accentText: "text-emerald-455",
      accentBg: "bg-emerald-500",
      input: "bg-zinc-950/60 border border-emerald-900/50 focus:border-emerald-500 text-emerald-300",
      button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black",
      isLight: false,
      blob1: "bg-emerald-900/50",
      blob2: "bg-teal-900/40",
      blob3: "bg-zinc-800/50",
    },
    nord: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2E3440] via-[#3B4252] to-[#434C5E] text-[#D8DEE9]",
      glassCard: "bg-[#2E3440]/30 backdrop-blur-md border border-[#4C566A]/50 shadow-lg hover:bg-[#2E3440]/40 transition duration-300",
      glassCardInner: "bg-[#D8DEE9]/[0.03] hover:bg-[#D8DEE9]/[0.07] border border-white/10 shadow-md",
      textTitle: "text-[#E5E9F0]",
      textMuted: "text-[#969fac]",
      pill: "bg-[#88C0D0]/10 text-[#88C0D0] border border-[#88C0D0]/20",
      accentText: "text-[#88C0D0]",
      accentBg: "bg-[#88C0D0]",
      input: "bg-[#2E3440]/60 border border-[#4C566A] focus:border-[#88C0D0] text-[#E5E9F0]",
      button: "bg-[#88C0D0] hover:bg-[#8FBCBB] text-[#2E3440] font-bold",
      isLight: false,
      blob1: "bg-[#88C0D0]/30",
      blob2: "bg-[#8FBCBB]/20",
      blob3: "bg-[#4C566A]/40",
    },
    dracula: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1f27] via-[#282a36] to-purple-950/20 text-[#f8f8f2]",
      glassCard: "bg-[#282a36]/30 backdrop-blur-md border border-[#44475a]/50 shadow-xl hover:bg-[#282a36]/40 transition duration-300",
      glassCardInner: "bg-[#f8f8f2]/[0.03] hover:bg-[#f8f8f2]/[0.07] border border-[#ff79c6]/20 shadow-lg",
      textTitle: "text-[#f8f8f2]",
      textMuted: "text-[#a4a9c6]",
      pill: "bg-[#ff79c6]/10 text-[#ff79c6] border border-[#ff79c6]/20",
      accentText: "text-[#ff79c6]",
      accentBg: "bg-[#ff79c6]",
      input: "bg-[#1d1f27]/60 border border-[#44475a] focus:border-[#ff79c6] text-[#f8f8f2]",
      button: "bg-[#ff79c6] hover:bg-[#ff92df] text-[#282a36] font-bold",
      isLight: false,
      blob1: "bg-[#bd93f9]/30",
      blob2: "bg-[#ff79c6]/20",
      blob3: "bg-[#6272a4]/20",
    },
    synthwave: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#180a2b] via-[#24113a] to-[#0f051d] text-[#f0e6ff]",
      glassCard: "bg-[#24113a]/30 backdrop-blur-md border border-[#ff007f]/30 shadow-[0_8px_32px_rgba(255,0,127,0.1)] hover:bg-[#24113a]/40 transition duration-300",
      glassCardInner: "bg-[#ff007f]/[0.03] hover:bg-[#ff007f]/[0.07] border border-[#ff007f]/20 shadow-[0_4px_20px_rgba(255,0,127,0.05)]",
      textTitle: "text-white",
      textMuted: "text-[#b89eff]",
      pill: "bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20",
      accentText: "text-[#ff007f]",
      accentBg: "bg-[#39ff14]",
      input: "bg-[#180a2b]/60 border border-[#ff007f]/30 focus:border-[#39ff14] text-white",
      button: "bg-[#39ff14] hover:bg-[#5aff38] text-[#180a2b] font-extrabold",
      isLight: false,
      blob1: "bg-[#ff007f]/30",
      blob2: "bg-[#39ff14]/15",
      blob3: "bg-[#8a2be2]/30",
    },
    latte: {
      bgMesh: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FCF9F7] via-[#F5EBE6] to-[#E6D4CB]/40 text-[#5C4033]",
      glassCard: "bg-[#FCF9F7]/40 backdrop-blur-md border border-[#E6D4CB] shadow-xs hover:bg-[#FCF9F7]/50 transition duration-300",
      glassCardInner: "bg-[#FCF9F7]/45 hover:bg-[#FCF9F7]/65 border border-[#E6D4CB] shadow-[0_4px_15px_rgba(92,64,51,0.02)]",
      textTitle: "text-[#3C2A21]",
      textMuted: "text-[#8B7365]",
      pill: "bg-[#A75D5D]/10 text-[#A75D5D] border border-[#A75D5D]/20",
      accentText: "text-[#A75D5D]",
      accentBg: "bg-[#A75D5D]",
      input: "bg-[#FCF9F7]/60 border border-[#E6D4CB] focus:border-[#A75D5D] text-[#5C4033]",
      button: "bg-[#A75D5D] hover:bg-[#C17A7A] text-[#FCF9F7] font-bold",
      isLight: true,
      blob1: "bg-[#A75D5D]/20",
      blob2: "bg-[#DFCABF]/60",
      blob3: "bg-[#E6D4CB]/40",
    }
  };

  const style = themeStyles[theme] || themeStyles.dark;
  const isLightMode = style.isLight;
  const bgMeshClass = style.bgMesh;
  const glassCardClass = style.glassCard;
  const glassCardInnerClass = style.glassCardInner;
  const textMutedClass = style.textMuted;
  const textTitleClass = style.textTitle;
  const pillClass = style.pill;

  return (
    <div className={`w-full min-h-screen py-10 px-4 sm:px-6 md:py-16 transition-all duration-500 relative overflow-hidden ${bgMeshClass}`}>
      {/* Drifting background glass blobs for frosting dispersion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40 animate-blob ${style.blob1}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-35 animate-blob animation-delay-2000 ${style.blob2}`} />
        <div className={`absolute top-[40%] right-[20%] w-[40%] h-[40%] rounded-full blur-[130px] opacity-25 animate-blob animation-delay-4000 ${style.blob3}`} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Top Header Bar */}
        <div className={`flex justify-between items-center p-3 rounded-2xl ${glassCardClass}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-2xs font-extrabold uppercase tracking-widest">{hero.name || 'PORTFOLIO'}</span>
          </div>
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-current/15 text-current/80 hover:bg-current/5 text-2xs font-bold transition select-none cursor-pointer"
          >
            {copiedShare ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            <span>Share</span>
          </button>
        </div>

        {/* Hero Section */}
        <header className={`p-6 sm:p-8 rounded-3xl ${glassCardClass} flex flex-col md:flex-row gap-6 items-center md:items-start`}>
          {hero.avatar_url ? (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <Image
                src={hero.avatar_url}
                alt={hero.name}
                fill
                className="rounded-2xl object-cover border border-white/20"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
          ) : (
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl font-black flex items-center justify-center text-2xl select-none shrink-0 ${
              isLightMode ? "bg-slate-200 text-slate-800" : "bg-white/10 text-white border border-white/25"
            }`}>
              {getInitials(hero.name)}
            </div>
          )}

          <div className="space-y-3 text-center md:text-left min-w-0 flex-1">
            <div className="space-y-1">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight break-words ${textTitleClass}`}>
                {hero.name || 'Your Name'}
              </h1>
              <p className={`text-xs sm:text-sm font-semibold tracking-wide ${isLightMode ? "text-indigo-600" : "text-indigo-400"}`}>
                {hero.tagline || 'Software Engineer'}
              </p>
            </div>
            
            {hero.bio && (
              <p className={`text-xs sm:text-[13px] leading-relaxed break-words max-w-2xl ${textMutedClass}`}>
                {hero.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              {hero.location && (
                <div className={`flex items-center gap-1 text-2xs font-semibold ${textMutedClass}`}>
                  <MapPin size={12} className="shrink-0" />
                  <span>{hero.location}</span>
                </div>
              )}
              {hero.open_to_work && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to work
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main sections column (col-span-2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* PROJECTS */}
            {showProjects && (
              <section className={`p-6 sm:p-8 rounded-3xl space-y-5 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Code2 size={16} className={style.accentText} />
                  <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitleClass}`}>Featured Projects</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className={`p-4.5 rounded-2xl flex flex-col justify-between ${glassCardInnerClass} transition duration-350`}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className={`text-xs font-bold leading-tight break-words ${textTitleClass}`}>{proj.title}</h3>
                          <div className="flex gap-1 shrink-0">
                            {proj.github && (
                              <a
                                href={proj.github.startsWith('http') ? proj.github : `https://github.com/${proj.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded transition text-current/60 hover:${style.accentText} hover:scale-105`}
                              >
                                <Github size={12} />
                              </a>
                            )}
                            {proj.live && (
                              <a
                                href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded transition text-current/60 hover:${style.accentText} hover:scale-105`}
                              >
                                <ArrowUpRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className={`text-[11px] leading-relaxed break-words ${textMutedClass}`}>{proj.description}</p>
                      </div>

                      {proj.tech && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-white/5">
                          {proj.tech.map((t, tIdx) => (
                            <span key={tIdx} className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${pillClass}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EXPERIENCE */}
            {showExperience && (
              <section className={`p-6 sm:p-8 rounded-3xl space-y-6 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Briefcase size={16} className={style.accentText} />
                  <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitleClass}`}>Experience</h2>
                </div>

                <div className="space-y-6 relative border-l border-white/10 pl-4 ml-2.5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5 relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[22.5px] top-1 w-3 h-3 rounded-full border border-white/20 ${style.accentBg}`} />

                      <div className="flex flex-wrap justify-between items-baseline gap-2">
                        <h3 className={`text-xs font-extrabold ${textTitleClass}`}>{exp.role}</h3>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${textMutedClass}`}>
                          <Calendar size={11} /> {exp.period}
                        </span>
                      </div>
                      <p className={`text-[11px] font-bold ${style.accentText}`}>{exp.company}</p>
                      
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1 pt-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className={`text-[11px] leading-relaxed flex gap-2 ${textMutedClass}`}>
                              <span className={`select-none ${style.accentText}`}>•</span>
                              <span className="min-w-0">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right sidebar column (col-span-1) */}
          <div className="space-y-6">
            
            {/* SKILLS */}
            {showSkills && (
              <section className={`p-6 rounded-3xl space-y-4 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <User size={15} className={style.accentText} />
                  <h2 className={`text-xs font-black uppercase tracking-wider ${textTitleClass}`}>Skills</h2>
                </div>

                <div className="space-y-3.5">
                  {skills.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>{cat.category}</span>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((item, sIdx) => (
                          <span key={sIdx} className={`px-2 py-0.5 rounded text-[10px] font-bold ${pillClass}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LEETCODE */}
            {leetcode && leetcode.username && (
              <section className={`p-6 rounded-3xl space-y-4 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Flame size={15} className="text-orange-400" />
                  <h2 className={`text-xs font-black uppercase tracking-wider ${textTitleClass}`}>Coding Stats</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-2xs font-semibold">
                    <span className={textMutedClass}>Solved:</span>
                    <span className={`font-bold ${textTitleClass}`}>{leetcode.solved}</span>
                  </div>
                  {leetcode.rating && (
                    <div className="flex justify-between items-center text-2xs font-semibold">
                      <span className={textMutedClass}>Contest Rating:</span>
                      <span className={`font-bold ${textTitleClass}`}>{leetcode.rating}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    {[
                      { label: 'Easy', count: leetcode.easy, color: 'bg-emerald-500' },
                      { label: 'Medium', count: leetcode.medium, color: 'bg-amber-500' },
                      { label: 'Hard', count: leetcode.hard, color: 'bg-rose-500' }
                    ].map((item, i) => {
                      const total = (leetcode.easy || 0) + (leetcode.medium || 0) + (leetcode.hard || 0);
                      const percent = total > 0 ? ((item.count || 0) / total) * 100 : 0;
                      return (
                        <div key={i} className="flex items-center justify-between gap-2 text-[10px] font-semibold">
                          <span className={`w-10 ${textMutedClass}`}>{item.label}</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                          </div>
                          <span className={`font-bold ${textTitleClass}`}>{item.count || 0}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {showEducation && (
              <section className={`p-6 rounded-3xl space-y-4 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <GraduationCap size={15} className={style.accentText} />
                  <h2 className={`text-xs font-black uppercase tracking-wider ${textTitleClass}`}>Education</h2>
                </div>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <h3 className={`text-2xs font-bold ${textTitleClass}`}>{edu.institution}</h3>
                      <p className={`text-[10px] font-semibold ${style.accentText}`}>
                        {edu.degree} in {edu.field}
                      </p>
                      <p className={`text-[9px] font-medium ${textMutedClass}`}>{edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {showCertifications && (
              <section className={`p-6 rounded-3xl space-y-4 ${glassCardClass}`}>
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <Award size={15} className={style.accentText} />
                  <h2 className={`text-xs font-black uppercase tracking-wider ${textTitleClass}`}>Certifications</h2>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className={`text-2xs font-bold break-words ${textTitleClass}`}>{cert.name}</h3>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-0.5 shrink-0 hover:scale-105 transition ${style.accentText}`}
                          >
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      <p className={`text-[10px] ${textMutedClass}`}>{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

        {/* CONTACT FORM */}
        {showContact && (
          <section className={`p-6 sm:p-8 rounded-3xl space-y-5 ${glassCardClass}`}>
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Mail size={16} className={style.accentText} />
              <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitleClass}`}>Send a Message</h2>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${style.input}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${style.input}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${style.input}`}
                />
              </div>

              {error && <p className="text-2xs font-bold text-rose-455">{error}</p>}
              {success && <p className="text-2xs font-bold text-emerald-400">Message sent successfully!</p>}

              <button
                type="submit"
                disabled={sending}
                className={`w-full sm:w-auto px-6 py-2 disabled:bg-slate-700 font-bold text-xs rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${style.button}`}
              >
                {sending ? 'Sending...' : <><Send size={12} /> Send Message</>}
              </button>
            </form>
          </section>
        )}

      </div>
    </div>
  );
}
