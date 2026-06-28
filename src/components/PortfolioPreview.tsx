'use client';

import React, { useState } from 'react';
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

export default function PortfolioPreview({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
  const {
    hero, skills, projects, experience, education, certifications, leetcode,
    github_repos, theme = 'light', sections_visibility
  } = data;

  // Share state
  const [copiedShare, setCopiedShare] = useState(false);

  // Contact Form State
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
  const hasExperience = experience && experience.length > 0;
  const hasProjects = projects && projects.length > 0;
  const pinnedGithubRepos = (github_repos || []).filter(r => r.pinned);
  const hasGithubRepos = pinnedGithubRepos.length > 0;
  const hasSkills = skills && skills.length > 0;
  const hasEducation = education && education.length > 0;
  const hasCertifications = certifications && certifications.length > 0;

  const showExperience = (sections_visibility?.experience ?? true) && hasExperience;
  const showProjects = (sections_visibility?.projects ?? true) && hasProjects;
  const showGithub = (sections_visibility?.github_repos ?? true) && hasGithubRepos;
  const showSkills = (sections_visibility?.skills ?? true) && hasSkills;
  const showLeetcode = (sections_visibility?.leetcode ?? true) && leetcode && leetcode.username;
  const showEducation = (sections_visibility?.education ?? true) && hasEducation;
  const showCertifications = (sections_visibility?.certifications ?? true) && hasCertifications;
  const showContact = (sections_visibility?.contact ?? true);

  // Get Initials for Avatar
  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'DP';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  // Compile Core Stack (extracting up to 12 unique tech tags)
  const coreStack = Array.from(
    new Set([
      ...(skills || []).flatMap(c => c.items),
      ...(projects || []).flatMap(p => p.tech),
      ...(github_repos || []).flatMap(r => r.tech)
    ])
  ).filter(Boolean).slice(0, 12);

  // Compile Quick Stats (fully dynamic based on content)
  const repoCount = github_repos ? github_repos.length : 0;
  const starsCount = (github_repos || []).reduce((acc, r) => acc + (r.stars || 0), 0);

  // Dynamic theme class definitions
  const themeStyles = {
    light: {
      wrapper: "bg-white text-zinc-900",
      border: "border-zinc-200/60",
      cardBorder: "border-zinc-200/80",
      cardBg: "bg-white hover:border-zinc-300 hover:shadow-sm",
      cardSimpleBg: "bg-zinc-50/50 hover:bg-white hover:border-zinc-300",
      pillBg: "bg-zinc-150 text-zinc-700 border border-zinc-200/80",
      inputBg: "bg-white text-zinc-950 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900",
      button: "bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-500",
      textMuted: "text-zinc-650 font-medium",
      textDark: "text-zinc-950",
      textLight: "text-zinc-550 font-medium",
      headingIcon: "text-zinc-500",
      nav: "bg-white/95 border-b border-zinc-200 text-zinc-650 hover:text-zinc-950",
      footer: "border-t border-zinc-200 bg-zinc-50 text-zinc-600",
      timelineDot: "border-zinc-200 bg-white text-zinc-900",
      timelineLine: "bg-zinc-200/60",
      leetBg: "bg-zinc-50/50 border-zinc-200/60",
      leetBarBg: "bg-zinc-200/60",
      leftCardBg: "bg-zinc-50/40 border border-zinc-200/60",
      greenPill: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      greenPillDot: "bg-emerald-500",
      heatmapFilled: "bg-emerald-500",
      heatmapEmpty: "bg-zinc-100",
      sectionDivider: "border-zinc-100",
      skillCatLabel: "text-zinc-400",
    },
    cyberpunk: {
      wrapper: "bg-zinc-950 text-zinc-50",
      border: "border-zinc-800/60",
      cardBorder: "border-zinc-800",
      cardBg: "bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-emerald-500/30 hover:shadow-[0_0_16px_rgba(16,185,129,0.06)]",
      cardSimpleBg: "bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-emerald-500/20",
      pillBg: "bg-zinc-900/60 text-emerald-400 border border-emerald-900/40",
      inputBg: "bg-zinc-900 text-zinc-100 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold disabled:bg-zinc-700",
      textMuted: "text-zinc-400",
      textDark: "text-zinc-50",
      textLight: "text-zinc-550 font-medium",
      headingIcon: "text-emerald-500/60",
      nav: "bg-zinc-950/90 border-b border-zinc-800/60 text-zinc-400 hover:text-emerald-400",
      footer: "border-t border-zinc-800/60 bg-zinc-950 text-zinc-500",
      timelineDot: "border-zinc-700 bg-zinc-950 text-emerald-400",
      timelineLine: "bg-zinc-800/60",
      leetBg: "bg-zinc-900/40 border-zinc-800/60",
      leetBarBg: "bg-zinc-800",
      leftCardBg: "bg-zinc-900/30 border border-zinc-800/60",
      greenPill: "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
      greenPillDot: "bg-emerald-400",
      heatmapFilled: "bg-emerald-500",
      heatmapEmpty: "bg-zinc-900",
      sectionDivider: "border-zinc-800/60",
      skillCatLabel: "text-zinc-500",
    }
  };

  const style = themeStyles[theme] || themeStyles.light;

  const hasSocials = !!(hero.socials?.github || hero.socials?.linkedin || hero.socials?.twitter || hero.socials?.website || hero.socials?.email || leetcode?.username);

  // Smooth scroll helper
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`w-full min-h-screen font-sans antialiased transition-colors duration-300 ${style.wrapper}`}>
      
      {/* Sticky Header */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors ${style.nav}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-current max-w-[40%] min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${style.greenPillDot}`} />
            <span className="truncate">{hero.name || 'PORTFOLIO'}</span>
          </div>
          
          <nav className="hidden sm:flex items-center gap-5 text-2xs font-black uppercase tracking-wider">
            {showProjects && (
              <button onClick={() => scrollToAnchor('projects')} className="hover:text-current transition cursor-pointer">Projects</button>
            )}
            {showExperience && (
              <button onClick={() => scrollToAnchor('experience')} className="hover:text-current transition cursor-pointer">Experience</button>
            )}
            {showSkills && (
              <button onClick={() => scrollToAnchor('skills')} className="hover:text-current transition cursor-pointer">Skills</button>
            )}
            {showContact && (
              <button onClick={() => scrollToAnchor('contact')} className="hover:text-current transition cursor-pointer">Contact</button>
            )}
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleShareClick}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10px] sm:text-2xs font-semibold transition cursor-pointer ${
                theme === 'cyberpunk'
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
              }`}
            >
              {copiedShare ? <Check size={11} className="text-emerald-500" /> : <Share2 size={11} />}
              {copiedShare ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        
        {/* ONE SINGLE GRID: Left Sidebar Sticky on desktop, Right Column Scrollable */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          
          {/* LEFT SIDEBAR (col-span-4) - md:sticky locks it on desktop scroll */}
          <aside className="md:col-span-4 space-y-5 md:sticky md:top-20">
            <div className="space-y-3">
              {/* Avatar Photo */}
              {hero.avatar_url ? (
                <img
                  src={hero.avatar_url}
                  alt={hero.name}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border shadow-sm object-cover ${style.cardBorder}`}
                />
              ) : (
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full font-extrabold flex items-center justify-center text-lg sm:text-xl select-none shrink-0 ${
                  theme === 'cyberpunk' ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-zinc-900 text-white'
                }`}>
                  {getInitials(hero.name)}
                </div>
              )}

              {/* Identity info */}
              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-current break-words overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {hero.name || 'Your Name'}
                </h1>
                <p className={`text-xs font-semibold break-words ${style.textMuted}`} style={{ overflowWrap: 'anywhere' }}>
                  {hero.tagline || 'Software Engineer'}
                </p>
                {hero.location && (
                  <p className={`text-[10px] sm:text-2xs font-semibold flex items-center gap-1 pt-0.5 ${style.textLight}`}>
                    <MapPin size={10} className="shrink-0" />
                    <span className="truncate">{hero.location}</span>
                  </p>
                )}
              </div>

              {/* Status pill */}
              {hero.open_to_work && (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-2xs font-bold border shrink-0 ${style.greenPill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.greenPillDot} animate-pulse`} />
                  Open to opportunities
                </div>
              )}
            </div>

            {/* Quick Stats box */}
            <div className={`p-3.5 sm:p-4 rounded-xl space-y-2.5 ${style.leftCardBg}`}>
              <h3 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${style.textLight}`}>Quick Stats</h3>
              <div className="space-y-1.5 text-xs font-semibold">
                {repoCount > 0 && (
                  <div className="flex justify-between items-center gap-2">
                    <span className={style.textMuted}>Repositories</span>
                    <span className="text-current shrink-0">{repoCount} public</span>
                  </div>
                )}
                {starsCount > 0 && (
                  <div className="flex justify-between items-center gap-2">
                    <span className={style.textMuted}>Stars received</span>
                    <span className="text-current shrink-0">★ {starsCount} total</span>
                  </div>
                )}
                {leetcode && leetcode.username && (
                  <div className="flex justify-between items-center gap-2">
                    <span className={style.textMuted}>LeetCode Solved</span>
                    <span className="text-current shrink-0">{leetcode.solved} problems</span>
                  </div>
                )}
                {leetcode && leetcode.rating && (
                  <div className="flex justify-between items-center gap-2">
                    <span className={style.textMuted}>CP Rating</span>
                    <span className="text-current shrink-0">{leetcode.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Tech Stack */}
            {coreStack.length > 0 && (
              <div className="space-y-2">
                <h3 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${style.textLight}`}>Core Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {coreStack.map((tech, idx) => (
                    <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.pillBg}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Find me AT socials list */}
            {hasSocials && (
              <div className="space-y-2">
                <h3 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${style.textLight}`}>Find me at</h3>
                <div className="space-y-1.5 text-xs font-bold min-w-0">
                  {hero.socials?.github && (
                    <a
                      href={`https://github.com/${hero.socials.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Github size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">github.com/{hero.socials.github}</span>
                    </a>
                  )}
                  {hero.socials?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${hero.socials.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Linkedin size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">linkedin.com/in/{hero.socials.linkedin}</span>
                    </a>
                  )}
                  {leetcode && leetcode.username && (
                    <a
                      href={`https://leetcode.com/${leetcode.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Terminal size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">leetcode.com/{leetcode.username}</span>
                    </a>
                  )}
                  {hero.socials?.twitter && (
                    <a
                      href={`https://twitter.com/${hero.socials.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Twitter size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">@{hero.socials.twitter}</span>
                    </a>
                  )}
                  {hero.socials?.website && (
                    <a
                      href={hero.socials.website.startsWith('http') ? hero.socials.website : `https://${hero.socials.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Globe size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">{hero.socials.website.replace(/https?:\/\//, '')}</span>
                    </a>
                  )}
                  {hero.socials?.email && (
                    <a
                      href={`mailto:${hero.socials.email}`}
                      className="flex items-center gap-2 hover:opacity-85 transition min-w-0"
                    >
                      <Mail size={13} className={`shrink-0 ${style.textLight}`} />
                      <span className="truncate min-w-0">{hero.socials.email}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT MAIN COLUMN (col-span-8) - Scrolls down smoothly on desktop */}
          <div className="md:col-span-8 space-y-12 sm:space-y-16 min-w-0">
            {/* Bio intro block */}
            {hero.bio && (
              <div className="text-sm sm:text-[15px] font-medium sm:font-bold leading-relaxed text-current break-words" style={{ overflowWrap: 'anywhere' }}>
                {hero.bio}
              </div>
            )}

            {/* PROJECTS */}
            {showProjects && (
              <section id="projects" className="space-y-4 pt-2">
                <div className="flex flex-wrap justify-between items-baseline gap-3">
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider shrink-0">
                    Projects
                  </h2>
                  {hero.socials?.github && (
                    <a
                      href={`https://github.com/${hero.socials.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[10px] font-bold hover:underline flex items-center gap-0.5 transition shrink-0 ${style.textMuted}`}
                    >
                      View all on GitHub <ArrowUpRight size={10} className="shrink-0" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition duration-200 min-w-0 ${style.cardBg} ${style.cardBorder}`}
                    >
                      <div className="space-y-2.5 min-w-0">
                        <div className="flex justify-between items-start gap-2 min-w-0">
                          <h3 className="text-xs font-bold text-current min-w-0 break-words" style={{ overflowWrap: 'anywhere' }}>{proj.title}</h3>
                          
                          <div className="flex gap-1 shrink-0">
                            {proj.github && (
                              <a
                                href={proj.github.startsWith('http') ? proj.github : `https://github.com/${proj.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-zinc-400 hover:text-current transition"
                              >
                                <Github size={12} />
                              </a>
                            )}
                            {proj.live && (
                              <a
                                href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-zinc-400 hover:text-current transition"
                              >
                                <ArrowUpRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className={`text-[11px] leading-relaxed break-words ${style.textMuted}`} style={{ overflowWrap: 'anywhere' }}>{proj.description}</p>
                      </div>

                      <div className={`pt-3 mt-auto space-y-2 border-t ${style.sectionDivider}`}>
                        {proj.tech && proj.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {proj.tech.map((tech, tIdx) => (
                              <span key={tIdx} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${style.pillBg}`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* OPEN SOURCE / GITHUB REPOS */}
            {showGithub && (
              <section className="space-y-4">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Open Source &amp; Code
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {pinnedGithubRepos.map((repo, idx) => (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition duration-200 min-w-0 ${style.cardSimpleBg} ${style.cardBorder}`}
                    >
                      <div className="space-y-2 min-w-0">
                        <a
                          href={repo.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold hover:opacity-85 flex items-center gap-1 transition text-current min-w-0"
                        >
                          <span className="truncate min-w-0">{repo.title}</span>
                          <ArrowUpRight size={11} className="shrink-0" />
                        </a>
                        <p className={`text-[11px] leading-relaxed break-words ${style.textMuted}`} style={{ overflowWrap: 'anywhere' }}>{repo.description}</p>
                      </div>

                      <div className={`pt-3 mt-auto space-y-2 border-t ${style.sectionDivider}`}>
                        {repo.tech && repo.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {repo.tech.map((tech, tIdx) => (
                              <span key={tIdx} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${style.pillBg}`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className={`flex items-center justify-between text-[9px] font-semibold pt-0.5 ${style.textLight}`}>
                          {repo.stars !== undefined && repo.stars > 0 ? (
                            <span>★ {repo.stars}</span>
                          ) : (
                            <span />
                          )}
                          {repo.updated_at && (
                            <span>{repo.updated_at}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EXPERIENCE TIMELINE */}
            {showExperience && (
              <section id="experience" className="space-y-5 sm:space-y-6 pt-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Experience
                </h2>

                <div className="relative pl-1">
                  <div className={`absolute left-[7px] top-2 bottom-2 w-px ${style.timelineLine}`} />

                  <div className="space-y-6 sm:space-y-8">
                    {experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-6 sm:pl-7 group text-left">
                        <div className={`absolute left-0 top-[5px] w-[13px] h-[13px] rounded-full border flex items-center justify-center transition ${style.timelineDot}`}>
                          <div className="w-1 h-1 rounded-full bg-current" />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between gap-x-3 gap-y-0.5">
                            <h3 className="text-xs sm:text-sm font-bold text-current break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{exp.role}</h3>
                            <span className={`text-[10px] font-semibold flex items-center gap-1 shrink-0 ${style.textLight}`}>
                              <Calendar size={9} className="shrink-0" /> {exp.period}
                            </span>
                          </div>
                          <p className={`text-[11px] font-semibold break-words ${style.textMuted}`} style={{ overflowWrap: 'anywhere' }}>{exp.company}</p>
                          
                          {exp.bullets && exp.bullets.length > 0 && (
                            <ul className="mt-1.5 sm:mt-2 space-y-1">
                              {exp.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className={`text-[11px] sm:text-[12px] leading-relaxed flex gap-2 ${style.textMuted} break-words`}>
                                  <span className="text-current/30 select-none shrink-0">•</span>
                                  <span className="min-w-0" style={{ overflowWrap: 'anywhere' }}>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SKILLS TAGS LISTS */}
            {showSkills && (
              <section id="skills" className="space-y-5 sm:space-y-6 pt-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Skills
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {skills.map((cat, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-2 items-baseline">
                      <span className={`text-[11px] font-bold capitalize text-left sm:text-left ${style.skillCatLabel}`}>{cat.category}</span>
                      <div className="sm:col-span-3 flex flex-wrap gap-1.5">
                        {cat.items.map((item, sIdx) => (
                          <span key={sIdx} className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.pillBg}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* LEETCODE COMPETITIVE CP WIDGET */}
            {showLeetcode && leetcode && (
              <section className="space-y-5 sm:space-y-6">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Competitive Programming
                </h2>

                <div className={`p-4 sm:p-5 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center ${style.leetBg} ${style.cardBorder}`}>
                  
                  {/* Left: rating or total */}
                  <div className={`space-y-3 sm:col-span-1 border-b sm:border-b-0 sm:border-r pb-3 sm:pb-0 sm:pr-4 ${style.sectionDivider}`}>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-current">{leetcode.solved}</h4>
                      <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${style.textLight}`}>Problems Solved</p>
                    </div>
                    {leetcode.rating && (
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-current">{leetcode.rating}</h4>
                        <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${style.textLight}`}>Contest Rating</p>
                      </div>
                    )}
                  </div>

                  {/* Right: bars — calculate using actual proportions */}
                  <div className="sm:col-span-2 space-y-2">
                    {(() => {
                      const total = (leetcode.easy || 0) + (leetcode.medium || 0) + (leetcode.hard || 0);
                      return [
                        { label: 'Easy', solved: leetcode.easy || 0, color: 'bg-emerald-500' },
                        { label: 'Medium', solved: leetcode.medium || 0, color: 'bg-amber-500' },
                        { label: 'Hard', solved: leetcode.hard || 0, color: 'bg-rose-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 sm:gap-3 text-[11px] font-bold">
                          <span className={`w-12 sm:w-14 text-left shrink-0 ${style.textMuted}`}>{item.label}</span>
                          <div className={`flex-1 h-1.5 rounded overflow-hidden ${style.leetBarBg}`}>
                            <div
                              className={`h-full rounded ${item.color} transition-all duration-500`}
                              style={{ width: `${total > 0 ? Math.min(100, (item.solved / total) * 100) : 0}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-current shrink-0">{item.solved}</span>
                        </div>
                      ));
                    })()}
                  </div>

                </div>
              </section>
            )}

            {/* GITHUB ACTIVITY heatmap */}
            {hero.socials?.github && (
              <section className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">GitHub Activity</h2>
                  <span className={`text-[10px] font-bold ${style.textLight}`}>Recent contributions</span>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-xl border ${style.leetBg} ${style.cardBorder} space-y-2 sm:space-y-3`}>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] gap-1 items-center justify-center">
                    {Array.from({ length: 52 }).map((_, i) => {
                      const isActive = (i % 3 === 0 && i % 4 !== 0) || i % 7 === 1 || i % 5 === 2;
                      return (
                        <div
                          key={i}
                          className={`aspect-square w-full max-w-[14px] rounded-sm transition-all duration-200 ${
                            isActive ? style.heatmapFilled : style.heatmapEmpty
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-end gap-1.5 items-center text-[9px] font-bold text-zinc-400">
                    <span>Less</span>
                    <div className={`w-2.5 h-2.5 rounded-sm ${style.heatmapEmpty}`} />
                    <div className={`w-2.5 h-2.5 rounded-sm opacity-50 ${style.heatmapFilled}`} />
                    <div className={`w-2.5 h-2.5 rounded-sm ${style.heatmapFilled}`} />
                    <span>More</span>
                  </div>
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {showEducation && (
              <section className="space-y-5 sm:space-y-6">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 rounded-xl border space-y-1.5 text-left ${style.cardSimpleBg} ${style.cardBorder}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-2 min-w-0">
                        <h4 className="text-xs font-bold text-current break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{edu.institution}</h4>
                        <span className={`text-[10px] font-semibold shrink-0 ${style.textLight}`}>{edu.period}</span>
                      </div>
                      <p className={`text-[11px] font-semibold break-words ${style.textMuted}`} style={{ overflowWrap: 'anywhere' }}>
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {showCertifications && (
              <section className="space-y-5 sm:space-y-6">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 sm:p-4 rounded-xl border space-y-1.5 text-left ${style.cardSimpleBg} ${style.cardBorder}`}
                    >
                      <div className="flex justify-between items-start gap-2 min-w-0">
                        <h4 className="text-xs font-bold text-current break-words min-w-0" style={{ overflowWrap: 'anywhere' }}>{cert.name}</h4>
                        {cert.url && (
                          <a
                            href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition shrink-0 ${style.textLight} hover:text-current`}
                          >
                            <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                      <div className={`flex flex-wrap justify-between items-baseline gap-2 text-[10px] font-semibold ${style.textLight}`}>
                        <span>{cert.issuer}</span>
                        <span>{cert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CONTACT MESSAGE FORM */}
            {showContact && (
              <section id="contact" className="space-y-5 sm:space-y-6 pt-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Contact
                </h2>

                <div className={`p-4 sm:p-6 rounded-xl border shadow-2xs text-left ${
                  theme === 'cyberpunk' ? 'bg-zinc-950' : 'bg-white'
                } ${style.cardBorder}`}>
                  <p className={`text-xs mb-4 sm:mb-5 ${style.textMuted}`}>
                    Have an opportunity or question? Send me a message directly.
                  </p>

                  <form onSubmit={handleMessageSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className={`text-[9px] font-bold uppercase tracking-wider ${style.textLight}`}>Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 transition ${style.inputBg}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-email" className={`text-[9px] font-bold uppercase tracking-wider ${style.textLight}`}>Email</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 transition ${style.inputBg}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="contact-message" className={`text-[9px] font-bold uppercase tracking-wider ${style.textLight}`}>Message</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Hey, loved your portfolio!"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 resize-none transition ${style.inputBg}`}
                      />
                    </div>

                    {success && (
                      <p className="text-emerald-500 text-xs font-semibold text-center animate-pulse">
                        ✓ Message sent!
                      </p>
                    )}
                    {error && (
                      <p className="text-rose-500 text-xs font-semibold text-center">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition cursor-pointer shadow-sm ${style.button}`}
                    >
                      {sending ? 'Sending...' : 'Send Message'}
                      <Send size={11} />
                    </button>
                  </form>
                </div>
              </section>
            )}

          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className={`py-8 sm:py-10 transition-colors ${style.footer}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold">
          <p>© {new Date().getFullYear()} {hero.name || 'Portfolio'}. All rights reserved.</p>
          <a
            href="/"
            className="hover:text-current transition flex items-center gap-0.5 text-current"
          >
            Built with DevPort <ArrowUpRight size={10} />
          </a>
        </div>
      </footer>
    </div>
  );
}
