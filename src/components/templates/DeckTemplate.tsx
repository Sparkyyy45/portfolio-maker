'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { PortfolioContent } from '@/types/portfolio';
import {
  Github, Linkedin, Twitter, ExternalLink, Calendar, Briefcase, Mail, Send,
  Award, GraduationCap, ShieldCheck, Globe, ArrowUpRight, Code2, User,
  Share2, MapPin, Flame, Check, Copy, ChevronLeft, ChevronRight, Terminal, BookOpen
} from 'lucide-react';

interface PortfolioPreviewProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function DeckTemplate({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
  const {
    hero, skills, projects, experience, education, certifications, leetcode,
    github_repos, theme = 'dark', sections_visibility
  } = data;

  const [currentSlide, setCurrentSlide] = useState(0);
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

  const isLightMode = theme === 'light' || theme === 'latte';
  const textTitle = isLightMode 
    ? (theme === 'latte' ? 'text-[#3C2A21]' : 'text-zinc-900') 
    : (theme === 'nord' ? 'text-[#E5E9F0]' : theme === 'dracula' ? 'text-[#f8f8f2]' : 'text-white');

  const textMuted = isLightMode 
    ? (theme === 'latte' ? 'text-[#8B7365]' : 'text-zinc-650') 
    : (theme === 'nord' ? 'text-[#969fac]' : theme === 'dracula' ? 'text-[#a4a9c6]' : theme === 'synthwave' ? 'text-[#b89eff]' : 'text-zinc-400');

  // Generate slides array based on visibility
  const slides: { title: string; render: () => React.ReactNode }[] = [];

  // 1. Home / Intro Slide
  slides.push({
    title: 'Intro',
    render: () => (
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 sm:py-10">
        {hero.avatar_url ? (
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shadow-lg shrink-0">
            <Image
              src={hero.avatar_url}
              alt={hero.name}
              fill
              className="rounded-full object-cover border-4 border-current/10"
              sizes="(max-width: 640px) 112px, 144px"
            />
          </div>
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full font-black flex items-center justify-center text-3xl select-none shrink-0 bg-current/10">
            {getInitials(hero.name)}
          </div>
        )}
        <div className="space-y-2.5 max-w-xl">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none break-words ${textTitle}`}>
            {hero.name || 'Your Name'}
          </h1>
          <p className="text-sm sm:text-base font-extrabold text-accent uppercase tracking-wider">
            {hero.tagline || 'Software Engineer'}
          </p>
          {hero.bio && (
            <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto ${textMuted}`}>
              {hero.bio}
            </p>
          )}
        </div>
        {hero.location && (
          <div className={`flex items-center gap-1 text-2xs font-semibold ${textMuted}`}>
            <MapPin size={12} className="shrink-0" />
            <span>{hero.location}</span>
          </div>
        )}
      </div>
    )
  });

  // 2. Projects Slide
  if (showProjects) {
    slides.push({
      title: 'Projects',
      render: () => (
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 border-b border-current/10 pb-2">
            <Code2 size={16} className="text-accent" />
            <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitle}`}>Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-current/10 bg-current/[0.03] hover:bg-current/[0.06] transition flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-xs font-bold leading-tight break-words ${textTitle}`}>{proj.title}</h3>
                    <div className="flex gap-1 shrink-0">
                      {proj.github && (
                        <a
                          href={proj.github.startsWith('http') ? proj.github : `https://github.com/${proj.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-current/60 hover:text-current transition"
                        >
                          <Github size={12} />
                        </a>
                      )}
                      {proj.live && (
                        <a
                          href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-current/60 hover:text-current transition"
                        >
                          <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className={`text-[11px] leading-relaxed break-words ${textMuted}`}>{proj.description}</p>
                </div>
                {proj.tech && proj.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-current/10">
                    {proj.tech.map((t, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-current/[0.05] text-current/80 border border-current/10">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    });
  }

  // 3. Experience Slide
  if (showExperience) {
    slides.push({
      title: 'Experience',
      render: () => (
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 border-b border-current/10 pb-2">
            <Briefcase size={16} className="text-accent" />
            <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitle}`}>Work Experience</h2>
          </div>
          <div className="space-y-5 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin relative border-l border-current/10 pl-4 ml-2">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 relative">
                <span className="absolute -left-[22.5px] top-1 w-3 h-3 rounded-full border border-current/20 bg-accent" />
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className={`text-xs font-black ${textTitle}`}>{exp.role}</h3>
                  <span className={`text-[10px] font-bold ${textMuted}`}>{exp.period}</span>
                </div>
                <p className="text-[11px] font-bold text-accent">{exp.company}</p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className={`text-[11px] leading-relaxed flex gap-2 ${textMuted}`}>
                        <span className="text-accent select-none">•</span>
                        <span className="min-w-0">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    });
  }

  // 4. Skills Slide
  if (showSkills || showEducation || showCertifications) {
    slides.push({
      title: 'Skills & Info',
      render: () => (
        <div className="space-y-4 py-4 overflow-y-auto max-h-[55vh] pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {showSkills && (
              <div className="space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-wider border-b border-current/10 pb-1 ${textTitle}`}>Technical Skills</h3>
                <div className="space-y-3">
                  {skills.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted}`}>{cat.category}</span>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((item, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-current/[0.05] text-current/80 border border-current/10">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-5">
              {showEducation && (
                <div className="space-y-3">
                  <h3 className={`text-xs font-black uppercase tracking-wider border-b border-current/10 pb-1 ${textTitle}`}>Education</h3>
                  <div className="space-y-3">
                    {education.map((edu, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <h4 className={`text-2xs font-extrabold ${textTitle}`}>{edu.institution}</h4>
                        <p className={`text-[10px] font-semibold ${textMuted}`}>{edu.degree} in {edu.field}</p>
                        <p className={`text-[9px] ${textMuted}`}>{edu.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {showCertifications && (
                <div className="space-y-3">
                  <h3 className={`text-xs font-black uppercase tracking-wider border-b border-current/10 pb-1 ${textTitle}`}>Certifications</h3>
                  <div className="space-y-2.5">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="space-y-0.5 text-2xs">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className={`font-bold ${textTitle}`}>{cert.name}</h4>
                          {cert.url && (
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="p-0.5 text-current/60 hover:text-current">
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <p className={`text-[10px] ${textMuted}`}>{cert.issuer} • {cert.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    });
  }

  // 5. Competitive Stats / Github Slide (Only if present)
  if ((leetcode && leetcode.username) || (github_repos && github_repos.length > 0)) {
    slides.push({
      title: 'Activity',
      render: () => (
        <div className="space-y-4 py-4 overflow-y-auto max-h-[55vh] pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {leetcode && leetcode.username && (
              <div className="p-4.5 rounded-xl border border-current/10 bg-current/[0.03] space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-wider border-b border-current/10 pb-1 flex items-center gap-1 ${textTitle}`}>
                  <Flame size={13} className="text-orange-500" /> Coding Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-2xs font-semibold">
                    <span className={textMuted}>LeetCode Username:</span>
                    <span className={`font-bold ${textTitle}`}>{leetcode.username}</span>
                  </div>
                  <div className="flex justify-between items-center text-2xs font-semibold">
                    <span className={textMuted}>Solved Problems:</span>
                    <span className={`font-bold ${textTitle}`}>{leetcode.solved}</span>
                  </div>
                  {leetcode.rating && (
                    <div className="flex justify-between items-center text-2xs font-semibold">
                      <span className={textMuted}>Contest Rating:</span>
                      <span className={`font-bold ${textTitle}`}>{leetcode.rating}</span>
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
                          <span className={`w-10 ${textMuted}`}>{item.label}</span>
                          <div className="flex-1 h-1 bg-current/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                          </div>
                          <span className={`font-bold ${textTitle}`}>{item.count || 0}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {github_repos && github_repos.length > 0 && (
              <div className="space-y-4">
                <h3 className={`text-xs font-black uppercase tracking-wider border-b border-current/10 pb-1 ${textTitle}`}>GitHub Repos</h3>
                <div className="space-y-2">
                  {github_repos.slice(0, 3).map((repo, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-current/10 bg-current/[0.03] text-2xs">
                      <div className="flex justify-between items-center">
                        <span className={`font-bold truncate max-w-[80%] ${textTitle}`}>{repo.title}</span>
                        {repo.stars !== undefined && <span className={`${textMuted} font-bold text-[10px]`}>★ {repo.stars}</span>}
                      </div>
                      <p className={`text-[10px] mt-1 truncate ${textMuted}`}>{repo.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    });
  }

  // 6. Contact Slide
  if (showContact) {
    slides.push({
      title: 'Contact',
      render: () => (
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 border-b border-current/10 pb-2">
            <Mail size={16} className="text-accent" />
            <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitle}`}>Send a Message</h2>
          </div>
          <form onSubmit={handleMessageSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-wider ${textMuted}`}>Your Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent bg-current/[0.03] border border-current/10 ${textTitle}`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-wider ${textMuted}`}>Your Email</label>
                <input
                  type="email"
                  required
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent bg-current/[0.03] border border-current/10 ${textTitle}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-[9px] font-black uppercase tracking-wider ${textMuted}`}>Message</label>
              <textarea
                required
                rows={3}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent bg-current/[0.03] border border-current/10 ${textTitle}`}
              />
            </div>

            {error && <p className="text-2xs font-bold text-rose-400">{error}</p>}
            {success && <p className="text-2xs font-bold text-emerald-400">Message sent successfully!</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto px-6 py-2 bg-accent hover:opacity-90 disabled:opacity-50 text-black font-bold text-xs rounded-xl transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {sending ? 'Sending...' : <><Send size={12} /> Send Message</>}
            </button>
          </form>
        </div>
      )
    });
  }

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'DP';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  // Theme palettes selection
  const themeStyles = {
    light: {
      wrapper: "bg-[#F4F4F5] text-zinc-800",
      card: "bg-white border border-zinc-200/80 shadow-xs",
      btnAccent: "bg-zinc-900 hover:bg-zinc-800 text-white",
      inactiveBtn: "bg-zinc-200 hover:bg-zinc-300 text-zinc-700",
      accent: "text-zinc-900",
      textTitle: "text-zinc-900",
      textMuted: "text-zinc-600",
    },
    dark: {
      wrapper: "bg-zinc-950 text-zinc-200",
      card: "bg-zinc-900/60 border border-zinc-850 shadow-2xl",
      btnAccent: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950",
      inactiveBtn: "bg-zinc-900 hover:bg-zinc-850 text-zinc-400",
      accent: "text-emerald-400",
      textTitle: "text-white",
      textMuted: "text-zinc-400",
    },
    cyberpunk: {
      wrapper: "bg-zinc-950 text-zinc-50",
      card: "bg-zinc-900/80 border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
      btnAccent: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black",
      inactiveBtn: "bg-zinc-900 border border-zinc-800 text-emerald-500/70 hover:text-emerald-400",
      accent: "text-emerald-400",
      textTitle: "text-white",
      textMuted: "text-zinc-400",
    },
    nord: {
      wrapper: "bg-[#2E3440] text-[#D8DEE9]",
      card: "bg-[#3B4252] border border-[#4C566A] shadow-lg",
      btnAccent: "bg-[#88C0D0] hover:bg-[#8FBCBB] text-[#2E3440]",
      inactiveBtn: "bg-[#434C5E] text-[#E5E9F0] hover:bg-[#4C566A]",
      accent: "text-[#88C0D0]",
      textTitle: "text-[#E5E9F0]",
      textMuted: "text-[#969fac]",
    },
    dracula: {
      wrapper: "bg-[#282a36] text-[#f8f8f2]",
      card: "bg-[#1d1f27]/90 border border-[#44475a] shadow-xl",
      btnAccent: "bg-[#ff79c6] hover:bg-[#ff92df] text-[#282a36]",
      inactiveBtn: "bg-[#343746] text-[#f8f8f2] hover:bg-[#44475a]",
      accent: "text-[#ff79c6]",
      textTitle: "text-[#f8f8f2]",
      textMuted: "text-[#a4a9c6]",
    },
    synthwave: {
      wrapper: "bg-[#180a2b] text-[#f0e6ff]",
      card: "bg-[#24113a]/90 border-2 border-[#ff007f]/30 shadow-[0_0_25px_rgba(255,0,127,0.08)]",
      btnAccent: "bg-[#39ff14] hover:bg-[#5aff38] text-[#180a2b] font-extrabold",
      inactiveBtn: "bg-[#2d1b4c] text-[#ff007f] hover:bg-[#3d2766]",
      accent: "text-[#ff007f]",
      textTitle: "text-white",
      textMuted: "text-[#b89eff]",
    },
    latte: {
      wrapper: "bg-[#F5EBE6] text-[#5C4033]",
      card: "bg-[#FCF9F7] border border-[#E6D4CB] shadow-xs",
      btnAccent: "bg-[#A75D5D] hover:bg-[#C17A7A] text-[#FCF9F7]",
      inactiveBtn: "bg-[#EAD8CD] text-[#5C4033] hover:bg-[#DFCABF]",
      accent: "text-[#A75D5D]",
      textTitle: "text-[#3C2A21]",
      textMuted: "text-[#8B7365]",
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.dark;

  return (
    <div className={`w-full min-h-screen py-10 px-4 sm:px-6 md:py-16 transition-all duration-500 flex items-center justify-center ${currentTheme.wrapper}`}>
      
      {/* Slide Deck Container Card */}
      <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col h-[700px] max-h-full justify-between relative ${currentTheme.card}`}>
        
        {/* Style tag containing localized theme overrides */}
        <style jsx global>{`
          .text-accent { color: ${currentTheme.accent.includes('text') ? '' : currentTheme.accent} !important; }
          .bg-accent { background-color: ${theme === 'latte' ? '#A75D5D' : theme === 'dracula' ? '#ff79c6' : theme === 'nord' ? '#88C0D0' : theme === 'synthwave' ? '#39ff14' : theme === 'cyberpunk' ? '#10b981' : theme === 'light' ? '#18181b' : '#10b981'} !important; }
        `}</style>

        {/* Slide Progress Indicator Bar */}
        <div className="w-full flex items-center gap-1 shrink-0 mb-4 sm:mb-6">
          {slides.map((slide, sIdx) => (
            <button
              key={sIdx}
              onClick={() => setCurrentSlide(sIdx)}
              className={`h-1.5 rounded-full flex-1 transition duration-300 cursor-pointer ${
                sIdx === currentSlide ? "bg-accent" : "bg-current/10"
              }`}
            />
          ))}
        </div>

        {/* Slide Window Content */}
        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
          <div className="animate-fade-in duration-300 min-w-0">
            {slides[currentSlide] ? slides[currentSlide].render() : null}
          </div>
        </div>

        {/* Slide Control Footer */}
        <div className="flex justify-between items-center shrink-0 pt-4 mt-6 border-t border-current/10">
          <button
            onClick={handleShareClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-2xs font-bold transition select-none cursor-pointer border-current/10 hover:bg-current/5`}
          >
            {copiedShare ? <Check size={11} className="text-emerald-500" /> : <Share2 size={11} />}
            <span>Share</span>
          </button>

          <div className="flex gap-2">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              className={`p-2 rounded-xl transition cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none ${currentTheme.inactiveBtn}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-2xs font-bold text-zinc-550 select-none flex items-center px-1">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              className={`p-2 rounded-xl transition cursor-pointer select-none disabled:opacity-30 disabled:pointer-events-none ${currentTheme.btnAccent}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
