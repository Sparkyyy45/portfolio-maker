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

export default function MinimalTemplate({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
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

  // Style mapping based on theme
  const isDark = theme === 'cyberpunk';
  const bgClass = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#FAFAF9] text-zinc-850';
  const cardClass = isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-xs';
  const textMuted = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const textTitle = isDark ? 'text-white font-semibold' : 'text-zinc-900 font-bold';
  const borderClass = isDark ? 'border-zinc-850' : 'border-zinc-200/60';
  const accentText = isDark ? 'text-emerald-400' : 'text-zinc-900';
  const badgeClass = isDark ? 'bg-zinc-900 text-zinc-200 border-zinc-850' : 'bg-zinc-100 text-zinc-800 border-zinc-200/50';

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'DP';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`w-full min-h-screen font-sans py-12 px-4 sm:px-6 md:py-20 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-3xl mx-auto space-y-16">
        
        {/* Header Options (Share, print etc) */}
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={handleShareClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-2xs font-medium cursor-pointer transition select-none ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700' : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
            }`}
          >
            {copiedShare ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
            <span>{copiedShare ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Hero Section */}
        <header className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${accentText}`}>
                {hero.name}
              </h1>
              <p className={`text-base font-medium ${textMuted}`}>
                {hero.tagline}
              </p>
              {hero.location && (
                <div className={`flex items-center gap-1 text-xs ${textMuted}`}>
                  <MapPin size={13} className="shrink-0" />
                  <span>{hero.location}</span>
                </div>
              )}
            </div>

            {hero.avatar_url ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full overflow-hidden border border-zinc-200 shadow-xs">
                <Image
                  src={hero.avatar_url}
                  alt={hero.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full font-black flex items-center justify-center text-xl select-none shrink-0 ${
                isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/30' : 'bg-zinc-900 text-white'
              }`}>
                {getInitials(hero.name)}
              </div>
            )}
          </div>

          <div className="pt-2">
            <p className={`text-sm leading-relaxed max-w-2xl ${textMuted}`}>
              {hero.bio}
            </p>
          </div>

          {/* Socials & Info */}
          <div className="flex flex-wrap gap-4 pt-2 border-b pb-6 border-zinc-200/50">
            {hero.socials?.github && (
              <a href={`https://github.com/${hero.socials.github}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1 text-xs hover:underline ${textMuted}`}>
                <Github size={13} /> <span>GitHub</span>
              </a>
            )}
            {hero.socials?.linkedin && (
              <a href={`https://linkedin.com/in/${hero.socials.linkedin}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1 text-xs hover:underline ${textMuted}`}>
                <Linkedin size={13} /> <span>LinkedIn</span>
              </a>
            )}
            {hero.socials?.twitter && (
              <a href={`https://twitter.com/${hero.socials.twitter}`} target="_blank" rel="noreferrer" className={`flex items-center gap-1 text-xs hover:underline ${textMuted}`}>
                <Twitter size={13} /> <span>Twitter</span>
              </a>
            )}
            {hero.socials?.email && (
              <a href={`mailto:${hero.socials.email}`} className={`flex items-center gap-1 text-xs hover:underline ${textMuted}`}>
                <Mail size={13} /> <span>Email</span>
              </a>
            )}
          </div>
        </header>

        {/* Experience Section */}
        {showExperience && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="group relative flex flex-col md:flex-row md:justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className={`text-sm ${textTitle}`}>{exp.role}</h3>
                    <p className={`text-xs font-medium ${textMuted}`}>{exp.company}</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs leading-relaxed text-zinc-500 mt-2 max-w-xl">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                  <span className={`text-xs font-medium shrink-0 md:text-right ${textMuted}`}>{exp.period}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {showProjects && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between h-full ${cardClass}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm ${textTitle}`}>{proj.title}</h3>
                      <div className="flex gap-2">
                        {proj.github && (
                          <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer" className={`hover:text-emerald-500 ${textMuted}`}>
                            <Github size={14} />
                          </a>
                        )}
                        {proj.live && (
                          <a href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`} target="_blank" rel="noreferrer" className={`hover:text-emerald-500 ${textMuted}`}>
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-3 ${textMuted}`}>{proj.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {proj.tech.map((t, tIdx) => (
                      <span key={tIdx} className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${badgeClass}`}>
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
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Skills</h2>
            <div className="space-y-4">
              {skills.map((c, idx) => (
                <div key={idx} className="space-y-2">
                  <span className={`text-xs font-semibold ${textMuted}`}>{c.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {c.items.map((item, itemIdx) => (
                      <span key={itemIdx} className={`px-2.5 py-1 rounded border text-xs font-medium ${badgeClass}`}>
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
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Education</h2>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline flex-wrap gap-2">
                  <div className="space-y-0.5">
                    <h3 className={`text-sm ${textTitle}`}>{edu.degree} in {edu.field}</h3>
                    <p className={`text-xs ${textMuted}`}>{edu.institution}</p>
                  </div>
                  <span className={`text-xs font-medium ${textMuted}`}>{edu.period}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {showCertifications && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Certifications</h2>
            <div className="space-y-3">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-dashed border-zinc-200/50">
                  <div>
                    <h3 className={`text-xs ${textTitle}`}>{cert.name}</h3>
                    <p className={`text-[10px] ${textMuted}`}>{cert.issuer}</p>
                  </div>
                  <span className={`text-xs ${textMuted}`}>{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        {showContact && (
          <section className="space-y-6 border-t pt-8 border-zinc-200/50">
            <div className="space-y-1">
              <h2 className={`text-xs font-bold uppercase tracking-widest ${accentText}`}>Get in touch</h2>
              <p className={`text-xs ${textMuted}`}>Send a direct message. I will respond to your email shortly.</p>
            </div>

            {success ? (
              <div className={`p-4 rounded-xl border text-xs text-center font-medium ${isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-zinc-100 border-zinc-200 text-zinc-800'}`}>
                Message sent successfully! Thank you.
              </div>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-2xs text-center font-medium">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className={`w-full p-3 rounded-lg border text-xs font-medium outline-none focus:border-zinc-500 ${
                      isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className={`w-full p-3 rounded-lg border text-xs font-medium outline-none focus:border-zinc-500 ${
                      isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
                    }`}
                  />
                </div>
                <textarea
                  placeholder="Your Message..."
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className={`w-full p-3 rounded-lg border text-xs font-medium outline-none focus:border-zinc-500 ${
                    isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-150 placeholder:text-zinc-500' : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold select-none cursor-pointer transition active:translate-y-0.5 ${
                    isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-850 text-white'
                  }`}
                >
                  <Send size={12} />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className={`text-center text-[10px] pt-8 border-t border-zinc-250/20 ${textMuted}`}>
          <p>© {new Date().getFullYear()} {hero.name}. Built with DevPort.</p>
        </footer>
      </div>
    </div>
  );
}
