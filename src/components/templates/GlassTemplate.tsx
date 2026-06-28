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
  const isLightMode = theme === 'light' || theme === 'latte';
  const bgMeshClass = isLightMode
    ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-sky-50 to-indigo-50 text-slate-800"
    : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-purple-950 text-slate-200";

  const glassCardClass = isLightMode
    ? "bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:bg-white/50 transition duration-300"
    : "bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:bg-white/10 transition duration-300";

  const textMutedClass = isLightMode ? "text-slate-650" : "text-slate-400";
  const textTitleClass = isLightMode ? "text-slate-900" : "text-white";
  const pillClass = isLightMode
    ? "bg-sky-500/10 text-sky-700 border border-sky-500/20"
    : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20";

  return (
    <div className={`w-full min-h-screen py-10 px-4 sm:px-6 md:py-16 transition-all duration-500 ${bgMeshClass}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className={`flex justify-between items-center p-3 rounded-2xl ${glassCardClass}`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-2xs font-extrabold uppercase tracking-widest">{hero.name || 'PORTFOLIO'}</span>
          </div>
          <button
            onClick={handleShareClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-2xs font-bold transition select-none cursor-pointer ${
              isLightMode ? "border-slate-300 text-slate-700 hover:bg-slate-100/50" : "border-slate-800 text-slate-300 hover:bg-slate-800/40"
            }`}
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
                  <Code2 size={16} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
                  <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitleClass}`}>Featured Projects</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className={`p-4.5 rounded-2xl flex flex-col justify-between ${
                      isLightMode ? "bg-white/30 border border-white/40 hover:bg-white/50" : "bg-white/5 border border-white/10 hover:bg-white/10"
                    } transition duration-350`}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className={`text-xs font-bold leading-tight break-words ${textTitleClass}`}>{proj.title}</h3>
                          <div className="flex gap-1 shrink-0">
                            {proj.github && (
                              <a
                                href={proj.github.startsWith('http') ? proj.github : `https://github.com/${proj.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded transition ${isLightMode ? "text-slate-650 hover:text-indigo-600" : "text-slate-400 hover:text-white"}`}
                              >
                                <Github size={12} />
                              </a>
                            )}
                            {proj.live && (
                              <a
                                href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1 rounded transition ${isLightMode ? "text-slate-650 hover:text-indigo-600" : "text-slate-400 hover:text-white"}`}
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
                  <Briefcase size={16} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
                  <h2 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${textTitleClass}`}>Experience</h2>
                </div>

                <div className="space-y-6 relative border-l border-white/10 pl-4 ml-2.5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1.5 relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[22.5px] top-1 w-3 h-3 rounded-full border border-white/20 ${
                        isLightMode ? "bg-indigo-600" : "bg-indigo-400"
                      }`} />

                      <div className="flex flex-wrap justify-between items-baseline gap-2">
                        <h3 className={`text-xs font-extrabold ${textTitleClass}`}>{exp.role}</h3>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${textMutedClass}`}>
                          <Calendar size={11} /> {exp.period}
                        </span>
                      </div>
                      <p className={`text-[11px] font-bold ${isLightMode ? "text-indigo-600" : "text-indigo-400"}`}>{exp.company}</p>
                      
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-1 pt-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className={`text-[11px] leading-relaxed flex gap-2 ${textMutedClass}`}>
                              <span className="text-indigo-400 select-none">•</span>
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
                  <User size={15} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
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
                  <GraduationCap size={15} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
                  <h2 className={`text-xs font-black uppercase tracking-wider ${textTitleClass}`}>Education</h2>
                </div>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <h3 className={`text-2xs font-bold ${textTitleClass}`}>{edu.institution}</h3>
                      <p className={`text-[10px] font-semibold ${isLightMode ? "text-indigo-650" : "text-indigo-300"}`}>
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
                  <Award size={15} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
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
                            className="p-0.5 text-indigo-400 hover:text-white shrink-0"
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
              <Mail size={16} className={isLightMode ? "text-indigo-600" : "text-indigo-400"} />
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
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLightMode ? "bg-white/40 border border-slate-350 text-slate-900" : "bg-white/5 border border-white/15 text-white"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Your Email</label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLightMode ? "bg-white/40 border border-slate-350 text-slate-900" : "bg-white/5 border border-white/15 text-white"
                    }`}
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
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isLightMode ? "bg-white/40 border border-slate-355 text-slate-900" : "bg-white/5 border border-white/15 text-white"
                  }`}
                />
              </div>

              {error && <p className="text-2xs font-bold text-rose-450">{error}</p>}
              {success && <p className="text-2xs font-bold text-emerald-400">Message sent successfully!</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
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
