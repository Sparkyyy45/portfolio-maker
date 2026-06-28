'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PortfolioContent } from '@/types/portfolio';
import {
  Github, Linkedin, Twitter, ExternalLink, Calendar, Briefcase, Mail, Send,
  Award, GraduationCap, MapPin, Check, Share2, ArrowUpRight
} from 'lucide-react';

interface PortfolioPreviewProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function BrutalistTemplate({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
  const {
    hero, skills, projects, experience, education, certifications, leetcode,
    github_repos, theme = 'light', sections_visibility
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

  const isDark = theme === 'cyberpunk';
  
  // Neo-brutalist theme palettes
  const bgClass = isDark ? 'bg-[#0E0E10] text-zinc-100' : 'bg-[#FFFBEB] text-zinc-900';
  const borderClass = isDark ? 'border-emerald-500' : 'border-zinc-950';
  const shadowClass = isDark ? 'shadow-[4px_4px_0px_#10B981]' : 'shadow-[5px_5px_0px_#000000]';
  const accentCard = isDark ? 'bg-zinc-900/60' : 'bg-white';
  const tagColors = [
    isDark ? 'bg-[#064E3B] text-emerald-300' : 'bg-cyan-200 text-zinc-900',
    isDark ? 'bg-[#5B21B6] text-purple-200' : 'bg-purple-200 text-zinc-900',
    isDark ? 'bg-[#991B1B] text-rose-200' : 'bg-rose-200 text-zinc-900',
    isDark ? 'bg-[#92400E] text-amber-200' : 'bg-amber-200 text-zinc-900',
    isDark ? 'bg-[#1E3A8A] text-blue-200' : 'bg-emerald-200 text-zinc-900',
  ];

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'DP';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`w-full min-h-screen font-sans py-12 px-4 sm:px-6 md:py-20 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Share Button (Brutalist style) */}
        <div className="flex justify-end">
          <button
            onClick={handleShareClick}
            className={`flex items-center gap-1.5 px-4 py-2 border-3 font-bold select-none active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer ${
              isDark 
                ? 'border-emerald-500 bg-zinc-900 text-emerald-400 shadow-[2px_2px_0px_#10B981] active:shadow-[1px_1px_0px_#10B981]' 
                : 'border-zinc-950 bg-amber-300 text-zinc-950 shadow-[3px_3px_0px_#000000] active:shadow-[1px_1px_0px_#000000]'
            }`}
          >
            {copiedShare ? <Check size={14} className="stroke-[3]" /> : <Share2 size={14} className="stroke-[3]" />}
            <span className="uppercase text-xs tracking-wider">{copiedShare ? 'Copied' : 'Share Portfolio'}</span>
          </button>
        </div>

        {/* Hero Card */}
        <header className={`p-6 sm:p-8 border-4 ${borderClass} ${accentCard} ${shadowClass} relative overflow-hidden`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border-2 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-lime-300 text-zinc-950'}`}>
                {hero.open_to_work ? '🟢 Open to Work' : '🔴 Focus Mode'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none">
                {hero.name}
              </h1>
              <p className={`text-sm sm:text-base font-bold italic tracking-wide ${isDark ? 'text-emerald-400' : 'text-zinc-700'}`}>
                {hero.tagline}
              </p>
              {hero.location && (
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <MapPin size={14} className="stroke-[2.5]" />
                  <span>{hero.location}</span>
                </div>
              )}
            </div>

            {hero.avatar_url ? (
              <div className={`relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 border-4 ${borderClass} ${isDark ? 'shadow-[3px_3px_0px_#10B981]' : 'shadow-[3px_3px_0px_#000000]'}`}>
                <Image
                  src={hero.avatar_url}
                  alt={hero.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            ) : (
              <div className={`w-24 h-24 sm:w-28 sm:h-28 font-black flex items-center justify-center text-3xl select-none shrink-0 border-4 ${borderClass} ${
                isDark ? 'bg-emerald-500 text-zinc-950 shadow-[3px_3px_0px_#10B981]' : 'bg-lime-400 text-zinc-950 shadow-[3px_3px_0px_#000000]'
              }`}>
                {getInitials(hero.name)}
              </div>
            )}
          </div>

          <div className={`mt-6 pt-6 border-t-3 ${borderClass}`}>
            <p className="text-sm leading-relaxed font-semibold">
              {hero.bio}
            </p>
          </div>

          {/* Social connections */}
          <div className="flex flex-wrap gap-3 mt-6 pt-2">
            {hero.socials?.github && (
              <a href={`https://github.com/${hero.socials.github}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-xs font-extrabold uppercase hover:-translate-y-0.5 active:translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-950'}`}>
                <Github size={13} className="stroke-[2.5]" /> <span>GitHub</span>
              </a>
            )}
            {hero.socials?.linkedin && (
              <a href={`https://linkedin.com/in/${hero.socials.linkedin}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-xs font-extrabold uppercase hover:-translate-y-0.5 active:translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-950'}`}>
                <Linkedin size={13} className="stroke-[2.5]" /> <span>LinkedIn</span>
              </a>
            )}
            {hero.socials?.twitter && (
              <a href={`https://twitter.com/${hero.socials.twitter}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-xs font-extrabold uppercase hover:-translate-y-0.5 active:translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-950'}`}>
                <Twitter size={13} className="stroke-[2.5]" /> <span>Twitter</span>
              </a>
            )}
            {hero.socials?.email && (
              <a href={`mailto:${hero.socials.email}`} className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-xs font-extrabold uppercase hover:-translate-y-0.5 active:translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-950'}`}>
                <Mail size={13} className="stroke-[2.5]" /> <span>Email</span>
              </a>
            )}
          </div>
        </header>

        {/* Experience Section */}
        {showExperience && (
          <section className="space-y-6">
            <h2 className={`inline-block text-sm font-black uppercase tracking-wider px-3 py-1 border-3 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-purple-300'}`}>Work Milestones</h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className={`p-5 border-3 ${borderClass} ${accentCard} ${shadowClass} relative flex flex-col md:flex-row md:justify-between gap-4`}>
                  <div className="space-y-2">
                    <h3 className="text-base font-black uppercase">{exp.role}</h3>
                    <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-zinc-600'}`}>{exp.company}</p>
                    <ul className="list-disc pl-4 space-y-1.5 text-xs font-semibold leading-relaxed text-zinc-500 mt-3 max-w-xl">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <span className={`text-xs font-black uppercase shrink-0 py-1 px-2 border-2 ${borderClass} max-h-fit ${isDark ? 'bg-zinc-900 text-emerald-400' : 'bg-zinc-100'}`}>{exp.period}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {showProjects && (
          <section className="space-y-6">
            <h2 className={`inline-block text-sm font-black uppercase tracking-wider px-3 py-1 border-3 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-cyan-300'}`}>Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div key={idx} className={`p-5 border-3 flex flex-col justify-between h-full ${borderClass} ${accentCard} ${shadowClass}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-black uppercase tracking-tight">{proj.title}</h3>
                      <div className="flex gap-2">
                        {proj.github && (
                          <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer" className={`p-1.5 border-2 hover:-translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-200' : 'bg-white text-zinc-950'}`}>
                            <Github size={13} className="stroke-[2.5]" />
                          </a>
                        )}
                        {proj.live && (
                          <a href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`} target="_blank" rel="noreferrer" className={`p-1.5 border-2 hover:-translate-y-0.5 transition ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-200' : 'bg-white text-zinc-950'}`}>
                            <ArrowUpRight size={13} className="stroke-[2.5]" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed font-semibold text-zinc-500 line-clamp-3">{proj.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {proj.tech.map((t, tIdx) => (
                      <span key={tIdx} className={`px-2.5 py-0.5 border-2 text-[10px] font-black uppercase ${borderClass} ${tagColors[tIdx % tagColors.length]}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {showSkills && (
          <section className="space-y-6">
            <h2 className={`inline-block text-sm font-black uppercase tracking-wider px-3 py-1 border-3 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-300'}`}>Skills & Tech</h2>
            <div className="space-y-4">
              {skills.map((c, idx) => (
                <div key={idx} className={`p-5 border-3 ${borderClass} ${accentCard} ${shadowClass} space-y-3`}>
                  <span className="text-xs font-black uppercase tracking-wider underline decoration-2">{c.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {c.items.map((item, itemIdx) => (
                      <span key={itemIdx} className={`px-2.5 py-1 border-2 text-xs font-bold ${borderClass} ${
                        isDark ? 'bg-zinc-950 text-emerald-400' : 'bg-amber-100 text-zinc-950'
                      }`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {showEducation && (
          <section className="space-y-6">
            <h2 className={`inline-block text-sm font-black uppercase tracking-wider px-3 py-1 border-3 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-lime-300'}`}>Education</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className={`p-5 border-3 ${borderClass} ${accentCard} ${shadowClass} flex justify-between items-baseline flex-wrap gap-3`}>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase">{edu.degree} in {edu.field}</h3>
                    <p className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{edu.institution}</p>
                  </div>
                  <span className={`text-xs font-black uppercase py-0.5 px-2 border-2 ${borderClass} ${isDark ? 'bg-zinc-900 text-zinc-300' : 'bg-zinc-150'}`}>{edu.period}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {showCertifications && (
          <section className="space-y-6">
            <h2 className={`inline-block text-sm font-black uppercase tracking-wider px-3 py-1 border-3 ${borderClass} ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-300'}`}>Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className={`p-4 border-2 flex justify-between items-center ${borderClass} ${accentCard}`}>
                  <div>
                    <h3 className="text-xs font-black uppercase">{cert.name}</h3>
                    <p className="text-[10px] font-semibold text-zinc-500">{cert.issuer}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-dashed ${borderClass}`}>{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        {showContact && (
          <section className={`p-6 sm:p-8 border-4 ${borderClass} ${accentCard} ${shadowClass} space-y-6`}>
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-tight">Send a Dispatch</h2>
              <p className="text-xs font-semibold text-zinc-500">Contact form active. Type in details below:</p>
            </div>

            {success ? (
              <div className={`p-4 border-3 text-xs text-center font-black uppercase tracking-wider ${isDark ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' : 'border-zinc-950 bg-green-200 text-zinc-950'}`}>
                ✓ Packet Transmitted Successfully!
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 border-2 border-rose-500 bg-rose-50 text-rose-800 text-2xs text-center font-bold">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className={`w-full p-3 rounded-none border-2 font-bold uppercase text-xs outline-none focus:bg-zinc-50 ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-950 text-zinc-800 placeholder:text-zinc-400'
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className={`w-full p-3 rounded-none border-2 font-bold uppercase text-xs outline-none focus:bg-zinc-50 ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-950 text-zinc-800 placeholder:text-zinc-400'
                    }`}
                  />
                </div>
                <textarea
                  placeholder="WRITE YOUR MESSAGE..."
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={`w-full p-3 rounded-none border-2 font-bold uppercase text-xs outline-none focus:bg-zinc-50 ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-950 text-zinc-800 placeholder:text-zinc-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-3 border-3 font-black uppercase text-xs select-none active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition ${
                    isDark 
                      ? 'border-emerald-500 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[2px_2px_0px_#047857]' 
                      : 'border-zinc-950 bg-lime-300 text-zinc-950 hover:bg-lime-200 shadow-[3px_3px_0px_#000000] active:shadow-[1px_1px_0px_#000000]'
                  }`}
                >
                  <span>{sending ? 'Transmitting...' : 'Send Message Packet'}</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className={`text-center font-bold text-[10px] uppercase pt-8 border-t-3 border-zinc-950/20 text-zinc-500`}>
          <p>© {new Date().getFullYear()} {hero.name} | DEVPORT SYSTEM OS</p>
        </footer>
      </div>
    </div>
  );
}
