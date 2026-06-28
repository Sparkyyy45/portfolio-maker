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

export default function TimelineTemplate({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
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

  // Theme palettes selection
  const themeStyles = {
    light: {
      wrapper: "bg-[#FAFAF9] text-zinc-800",
      card: "bg-white border border-zinc-200 shadow-xs hover:border-zinc-350 transition duration-200",
      pill: "bg-zinc-100 text-zinc-700 border border-zinc-200",
      accentText: "text-zinc-900",
      timelineLine: "border-zinc-200",
      timelineDot: "bg-zinc-900 border-white text-white",
      inputBg: "bg-white text-zinc-950 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900",
      button: "bg-zinc-900 hover:bg-zinc-850 text-white",
    },
    dark: {
      wrapper: "bg-zinc-950 text-zinc-200",
      card: "bg-zinc-900/40 border border-zinc-850 shadow-2xl hover:border-emerald-500/20 transition duration-200",
      pill: "bg-zinc-900 text-zinc-300 border border-zinc-800",
      accentText: "text-emerald-400",
      timelineLine: "border-zinc-800",
      timelineDot: "bg-emerald-500 border-zinc-950 text-zinc-950",
      inputBg: "bg-zinc-900 text-zinc-100 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold",
    },
    cyberpunk: {
      wrapper: "bg-zinc-950 text-zinc-50",
      card: "bg-zinc-900/60 border-2 border-emerald-500/25 hover:border-emerald-500/40 transition duration-200",
      pill: "bg-zinc-900/60 text-emerald-400 border border-emerald-900/40",
      accentText: "text-emerald-400",
      timelineLine: "border-emerald-500/20",
      timelineDot: "bg-emerald-500 border-zinc-950 text-zinc-950",
      inputBg: "bg-zinc-900 text-zinc-100 border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold",
    },
    nord: {
      wrapper: "bg-[#2E3440] text-[#D8DEE9]",
      card: "bg-[#3B4252] border border-[#4C566A] hover:border-[#88C0D0]/40 transition duration-200",
      pill: "bg-[#434C5E] text-[#E5E9F0] border border-[#4C566A]",
      accentText: "text-[#88C0D0]",
      timelineLine: "border-[#4C566A]",
      timelineDot: "bg-[#88C0D0] border-[#2E3440] text-[#2E3440]",
      inputBg: "bg-[#3B4252] text-[#D8DEE9] border-[#4C566A] focus:border-[#88C0D0]",
      button: "bg-[#88C0D0] hover:bg-[#8FBCBB] text-[#2E3440]",
    },
    dracula: {
      wrapper: "bg-[#282a36] text-[#f8f8f2]",
      card: "bg-[#1d1f27] border border-[#44475a] hover:border-[#ff79c6]/40 transition duration-200",
      pill: "bg-[#282a36] text-[#f8f8f2] border border-[#44475a]",
      accentText: "text-[#ff79c6]",
      timelineLine: "border-[#44475a]",
      timelineDot: "bg-[#ff79c6] border-[#282a36] text-[#282a36]",
      inputBg: "bg-[#1d1f27] text-[#f8f8f2] border-[#44475a] focus:border-[#ff79c6]",
      button: "bg-[#ff79c6] hover:bg-[#ff92df] text-[#282a36]",
    },
    synthwave: {
      wrapper: "bg-[#180a2b] text-[#f0e6ff]",
      card: "bg-[#24113a] border-2 border-[#ff007f]/20 hover:border-[#ff007f]/45 transition duration-200",
      pill: "bg-[#2d1b4c] text-[#ff007f] border border-[#ff007f]/30",
      accentText: "text-[#ff007f]",
      timelineLine: "border-[#ff007f]/25",
      timelineDot: "bg-[#39ff14] border-[#180a2b] text-[#180a2b]",
      inputBg: "bg-[#24113a] text-[#f0e6ff] border-[#ff007f]/30 focus:border-[#39ff14]",
      button: "bg-[#39ff14] hover:bg-[#5aff38] text-[#180a2b] font-bold",
    },
    latte: {
      wrapper: "bg-[#F5EBE6] text-[#5C4033]",
      card: "bg-[#FCF9F7] border border-[#E6D4CB] hover:border-[#A75D5D]/40 transition duration-200",
      pill: "bg-[#FCF9F7] text-[#5C4033] border border-[#E6D4CB]",
      accentText: "text-[#A75D5D]",
      timelineLine: "border-[#E6D4CB]",
      timelineDot: "bg-[#A75D5D] border-[#FCF9F7] text-[#FCF9F7]",
      inputBg: "bg-[#FCF9F7] text-[#5C4033] border-[#E6D4CB] focus:border-[#A75D5D]",
      button: "bg-[#A75D5D] hover:bg-[#C17A7A] text-[#FCF9F7]",
    }
  };

  const style = themeStyles[theme] || themeStyles.dark;

  // Compile timeline timeline nodes (Roles + Education + Pinned Repos) sorted by time if possible, or chronologically arranged
  const timelineNodes: { type: 'exp' | 'edu' | 'proj'; date: string; title: string; subtitle: string; content?: string[] | string }[] = [];

  if (showExperience) {
    experience.forEach((exp) => {
      timelineNodes.push({
        type: 'exp',
        date: exp.period,
        title: exp.role,
        subtitle: exp.company,
        content: exp.bullets
      });
    });
  }

  if (showEducation) {
    education.forEach((edu) => {
      timelineNodes.push({
        type: 'edu',
        date: edu.period,
        title: `${edu.degree} in ${edu.field}`,
        subtitle: edu.institution
      });
    });
  }

  return (
    <div className={`w-full min-h-screen py-12 px-4 sm:px-6 md:py-20 transition-all duration-500 ${style.wrapper}`}>
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header Options */}
        <div className="flex justify-between items-center border-b border-current/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-2xs font-extrabold uppercase tracking-widest">{hero.name || 'PORTFOLIO'}</span>
          </div>
          <button
            onClick={handleShareClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-2xs font-bold transition select-none cursor-pointer border-current/10 hover:bg-current/5`}
          >
            {copiedShare ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            <span>Share</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className={`p-6 sm:p-8 rounded-3xl ${style.card} flex flex-col sm:flex-row gap-6 items-center sm:items-start`}>
          {hero.avatar_url ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
              <Image
                src={hero.avatar_url}
                alt={hero.name}
                fill
                className="rounded-2xl object-cover border border-current/10"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl font-black flex items-center justify-center text-xl select-none shrink-0 bg-current/10">
              {getInitials(hero.name)}
            </div>
          )}

          <div className="space-y-2.5 text-center sm:text-left min-w-0 flex-1">
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-current leading-tight break-words">
                {hero.name || 'Your Name'}
              </h1>
              <p className={`text-xs sm:text-sm font-semibold tracking-wide ${style.accentText}`}>
                {hero.tagline || 'Software Engineer'}
              </p>
            </div>
            
            {hero.bio && (
              <p className="text-xs sm:text-[13px] leading-relaxed text-current/80 break-words">
                {hero.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              {hero.location && (
                <div className="flex items-center gap-1 text-2xs font-semibold text-current/60">
                  <MapPin size={11} className="shrink-0" />
                  <span>{hero.location}</span>
                </div>
              )}
              {hero.open_to_work && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open to work
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SKILLS CHIPS SECTION */}
        {showSkills && (
          <div className={`p-6 rounded-3xl ${style.card} space-y-4`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-current">Skills Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {skills.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-current/60">{cat.category}</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((item, sIdx) => (
                      <span key={sIdx} className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.pill}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE PATHWAY */}
        {(timelineNodes.length > 0 || showProjects) && (
          <div className="space-y-6">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-current">Career Timeline & Work</h2>
            
            <div className={`relative pl-6 sm:pl-8 border-l-2 border-dashed ${style.timelineLine} ml-3 sm:ml-4 space-y-8`}>
              
              {/* Timeline nodes loop */}
              {timelineNodes.map((node, nIdx) => (
                <div key={nIdx} className="relative space-y-1.5">
                  
                  {/* Timeline dot */}
                  <span className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${style.timelineDot}`}>
                    {node.type === 'exp' ? 'W' : 'E'}
                  </span>

                  <div className={`p-5 rounded-2xl ${style.card} space-y-2`}>
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <span className="text-[10px] font-bold text-current/60 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={11} /> {node.date}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${style.pill}`}>
                        {node.type === 'exp' ? 'Job Role' : 'Education'}
                      </span>
                    </div>

                    <h3 className="text-xs font-black text-current">{node.title}</h3>
                    <p className={`text-2xs font-extrabold ${style.accentText}`}>{node.subtitle}</p>

                    {node.content && Array.isArray(node.content) && (
                      <ul className="space-y-1 pt-2 border-t border-current/10 mt-2">
                        {node.content.map((b, bIdx) => (
                          <li key={bIdx} className="text-[11px] leading-relaxed text-current/80 flex gap-2">
                            <span className={`${style.accentText} select-none`}>•</span>
                            <span className="min-w-0">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}

              {/* PROJECTS AS A TIMELINE MILESTONE */}
              {showProjects && (
                <div className="relative space-y-3">
                  <span className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold ${style.timelineDot}`}>
                    P
                  </span>                  <div className={`p-5 rounded-2xl ${style.card} space-y-4`}>
                    <div className="flex justify-between items-center border-b border-current/10 pb-2">
                      <h3 className="text-xs font-black text-current">Launched Projects</h3>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${style.pill}`}>Creations</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {projects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-current/[0.03] border border-current/10 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-bold text-current text-xs break-all">{proj.title}</span>
                              <div className="flex gap-1 shrink-0">
                                {proj.github && (
                                  <a href={proj.github.startsWith('http') ? proj.github : `https://github.com/${proj.github}`} target="_blank" rel="noopener noreferrer" className="text-current/60 hover:text-current transition">
                                    <Github size={11} />
                                  </a>
                                )}
                                {proj.live && (
                                  <a href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`} target="_blank" rel="noopener noreferrer" className="text-current/60 hover:text-current transition">
                                    <ArrowUpRight size={11} />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-[10px] text-current/80 leading-relaxed break-words">{proj.description}</p>
                          </div>
                          {proj.tech && proj.tech.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5 pt-1.5 border-t border-current/10">
                              {proj.tech.map((t, tIdx) => (
                                <span key={tIdx} className={`px-1 py-0.5 rounded text-[8px] font-bold ${style.pill}`}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* LEETCODE STATS CARD */}
        {leetcode && leetcode.username && (
          <div className={`p-6 rounded-3xl ${style.card} space-y-4`}>
            <h3 className="text-xs font-black uppercase tracking-wider text-current">Coding Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-current/60">LeetCode Username</span>
                <p className="text-xs font-bold text-current">{leetcode.username}</p>
                {leetcode.rating && (
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-current/60">Contest Rating</span>
                    <p className={`text-base font-black ${style.accentText}`}>{leetcode.rating}</p>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2">
                {[
                  { label: 'Easy', count: leetcode.easy, color: 'bg-emerald-500' },
                  { label: 'Medium', count: leetcode.medium, color: 'bg-amber-500' },
                  { label: 'Hard', count: leetcode.hard, color: 'bg-rose-500' }
                ].map((item, i) => {
                  const total = (leetcode.easy || 0) + (leetcode.medium || 0) + (leetcode.hard || 0);
                  const percent = total > 0 ? ((item.count || 0) / total) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center justify-between gap-2 text-[10px] font-semibold">
                      <span className="w-12 text-current/60">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-current/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                      </div>
                      <span className="w-8 text-right text-current font-bold">{item.count || 0}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT BOX */}
        {showContact && (
          <section className={`p-6 sm:p-8 rounded-3xl ${style.card} space-y-5`}>
            <div className="flex items-center gap-2 border-b border-current/10 pb-2">
              <Mail size={16} className={style.accentText} />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-current">Send a Message</h2>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-current/60">Your Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${style.inputBg}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-current/60">Your Email</label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${style.inputBg}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-current/60">Message</label>
                <textarea
                  required
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${style.inputBg}`}
                />
              </div>

              {error && <p className="text-2xs font-bold text-rose-400">{error}</p>}
              {success && <p className="text-2xs font-bold text-emerald-400">Message sent successfully!</p>}

              <button
                type="submit"
                disabled={sending}
                className={`w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold shadow-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${style.button}`}
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
