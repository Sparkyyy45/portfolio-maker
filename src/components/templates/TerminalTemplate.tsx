'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortfolioContent } from '@/types/portfolio';
import { Terminal, Send, Check } from 'lucide-react';

interface TerminalTemplateProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function TerminalTemplate({ data, isDemo = false, onSubmitMessage }: TerminalTemplateProps) {
  const { hero, skills, projects, experience, education, certifications, leetcode } = data;

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Contact Form Mode state
  const [contactStep, setContactStep] = useState<'none' | 'name' | 'email' | 'message'>('none');
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    // Initial welcome history
    setHistory([
      {
        command: 'system_init',
        output: (
          <div className="space-y-1 text-emerald-400/90 font-mono text-xs">
            <p>=========================================================</p>
            <p>██████╗ ███████╗██╗   ██╗██████╗  ██████╗ ██████╗ ████████╗</p>
            <p>██╔══██╗██╔════╝██║   ██║██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝</p>
            <p>██║  ██║█████╗  ██║   ██║██████╔╝██║   ██║██████╔╝   ██║   </p>
            <p>██║  ██║██╔══╝  ╚██╗ ██╔╝██╔═══╝ ██║   ██║██╔══██╗   ██║   </p>
            <p>██████╔╝███████╗ ╚████╔╝ ██║     ╚██████╔╝██║  ██║   ██║   </p>
            <p>╚═════╝ ╚══════╝  ╚═══╝  ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   </p>
            <p>=========================================================</p>
            <p className="mt-2 text-zinc-300 font-bold">Welcome to {hero.name || 'User'}'s Terminal Portfolio OS v1.0.0</p>
            <p className="text-zinc-400">Type <span className="text-emerald-400 font-bold">help</span> to view available commands and explore my profile.</p>
            <p className="text-zinc-500">---------------------------------------------------------</p>
          </div>
        )
      }
    ]);
  }, [hero.name]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, contactStep]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput) return;

    setInput('');

    // Handle contact workflow
    if (contactStep !== 'none') {
      await handleContactStep(cleanInput);
      return;
    }

    const command = cleanInput.toLowerCase().split(' ')[0];
    let output: React.ReactNode = null;

    switch (command) {
      case 'help':
        output = (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-zinc-300 font-mono text-xs max-w-lg">
            <div><span className="text-emerald-400 font-bold">about</span> - Biography details</div>
            <div><span className="text-emerald-400 font-bold">skills</span> - Tech expertise categories</div>
            <div><span className="text-emerald-400 font-bold">projects</span> - Showcase of built works</div>
            <div><span className="text-emerald-400 font-bold">experience</span> - Job milestones</div>
            <div><span className="text-emerald-400 font-bold">education</span> - Degrees & schools</div>
            <div><span className="text-emerald-400 font-bold">certifications</span> - Certificates & badges</div>
            <div><span className="text-emerald-400 font-bold">socials</span> - Social profiles</div>
            <div><span className="text-emerald-400 font-bold">contact</span> - Send a message to owner</div>
            <div><span className="text-emerald-400 font-bold">clear</span> - Reset terminal output</div>
          </div>
        );
        break;

      case 'about':
      case 'bio':
        output = (
          <div className="space-y-2 text-zinc-300 font-mono text-xs max-w-2xl">
            <p className="text-sm font-bold text-emerald-400">{hero.name}</p>
            <p className="italic text-zinc-400">{hero.tagline}</p>
            <p className="leading-relaxed">{hero.bio}</p>
            {hero.location && <p><span className="text-zinc-500">Location:</span> {hero.location}</p>}
            {hero.open_to_work && <p className="text-emerald-400 font-bold">🟢 Open to professional opportunities</p>}
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-3 text-zinc-300 font-mono text-xs max-w-2xl">
            <p className="font-bold text-emerald-400">--- SKILLS & EXPERTISE ---</p>
            {skills && skills.length > 0 ? (
              skills.map((c, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-zinc-400 font-bold underline">{c.category}:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {c.items.map((item, j) => (
                      <span key={j} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No skills specified.</p>
            )}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-4 text-zinc-300 font-mono text-xs max-w-3xl">
            <p className="font-bold text-emerald-400">--- FEATURED PROJECTS ---</p>
            {projects && projects.length > 0 ? (
              projects.map((proj, i) => (
                <div key={i} className="p-3 bg-zinc-950/50 border border-zinc-850 rounded space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-emerald-400 font-bold text-sm">{proj.title}</span>
                    <div className="flex gap-2">
                      {proj.github && <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 underline">Code</a>}
                      {proj.live && <a href={proj.live.startsWith('http') ? proj.live : `https://${proj.live}`} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 underline">Live</a>}
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{proj.description}</p>
                  <p className="text-zinc-500"><span className="text-zinc-600 font-semibold">Tech:</span> {proj.tech.join(', ')}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No projects specified.</p>
            )}
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-4 text-zinc-300 font-mono text-xs max-w-3xl">
            <p className="font-bold text-emerald-400">--- PROFESSIONAL EXPERIENCE ---</p>
            {experience && experience.length > 0 ? (
              experience.map((exp, i) => (
                <div key={i} className="space-y-1 border-l-2 border-zinc-800 pl-3 ml-1">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="text-emerald-400 font-bold">{exp.role} @ {exp.company}</span>
                    <span className="text-zinc-500 font-semibold text-2xs">{exp.period}</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400 mt-1">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No work experience listed.</p>
            )}
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="space-y-3 text-zinc-300 font-mono text-xs max-w-2xl">
            <p className="font-bold text-emerald-400">--- EDUCATION CREDENTIALS ---</p>
            {education && education.length > 0 ? (
              education.map((edu, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-baseline flex-wrap">
                    <span className="text-emerald-400 font-bold">{edu.degree} in {edu.field}</span>
                    <span className="text-zinc-500 font-semibold text-2xs">{edu.period}</span>
                  </div>
                  <p className="text-zinc-400">{edu.institution}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No education credentials specified.</p>
            )}
          </div>
        );
        break;

      case 'certifications':
        output = (
          <div className="space-y-2 text-zinc-300 font-mono text-xs max-w-2xl">
            <p className="font-bold text-emerald-400">--- CERTIFICATIONS ---</p>
            {certifications && certifications.length > 0 ? (
              certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-zinc-900">
                  <div>
                    <span className="text-zinc-300 font-bold">{cert.name}</span>
                    <span className="text-zinc-500 text-2xs"> — {cert.issuer}</span>
                  </div>
                  <span className="text-zinc-500 text-2xs shrink-0">{cert.date}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No certifications specified.</p>
            )}
          </div>
        );
        break;

      case 'socials':
        output = (
          <div className="space-y-2 text-zinc-300 font-mono text-xs max-w-md">
            <p className="font-bold text-emerald-400">--- SOCIAL CONNECTIONS ---</p>
            {hero.socials && Object.keys(hero.socials).some(k => hero.socials[k as keyof typeof hero.socials]) ? (
              <div className="space-y-1">
                {hero.socials.github && <p><span className="text-zinc-500 font-bold">GitHub:</span> <a href={`https://github.com/${hero.socials.github}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">github.com/{hero.socials.github}</a></p>}
                {hero.socials.linkedin && <p><span className="text-zinc-500 font-bold">LinkedIn:</span> <a href={`https://linkedin.com/in/${hero.socials.linkedin}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">linkedin.com/in/{hero.socials.linkedin}</a></p>}
                {hero.socials.twitter && <p><span className="text-zinc-500 font-bold">Twitter:</span> <a href={`https://twitter.com/${hero.socials.twitter}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">twitter.com/{hero.socials.twitter}</a></p>}
                {hero.socials.website && <p><span className="text-zinc-500 font-bold">Website:</span> <a href={hero.socials.website.startsWith('http') ? hero.socials.website : `https://${hero.socials.website}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">{hero.socials.website}</a></p>}
                {hero.socials.email && <p><span className="text-zinc-500 font-bold">Email:</span> <a href={`mailto:${hero.socials.email}`} className="text-emerald-400 underline hover:text-emerald-300">{hero.socials.email}</a></p>}
              </div>
            ) : (
              <p className="text-zinc-500">No social networks configured.</p>
            )}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-zinc-300 font-mono text-xs space-y-1">
            <p className="text-emerald-400 font-bold">--- START CONTACT FORM WORKFLOW ---</p>
            <p className="text-zinc-400">Please enter your <span className="text-emerald-400 font-bold">Name</span> to start message routing:</p>
          </div>
        );
        setContactStep('name');
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        output = (
          <div className="text-rose-400 font-mono text-xs">
            Command not recognized: <span className="font-bold underline">{command}</span>. Type <span className="text-emerald-400 font-bold">help</span> to view available commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: cleanInput, output }]);
  };

  const handleContactStep = async (val: string) => {
    let output: React.ReactNode = null;

    if (contactStep === 'name') {
      setContactData((prev) => ({ ...prev, name: val }));
      output = (
        <div className="text-zinc-300 font-mono text-xs space-y-1">
          <p className="text-zinc-400">Hello <span className="text-emerald-400 font-bold">{val}</span>. Please enter your <span className="text-emerald-400 font-bold">Email Address</span>:</p>
        </div>
      );
      setContactStep('email');
      setHistory((prev) => [...prev, { command: val, output }]);
    } else if (contactStep === 'email') {
      if (!val.includes('@') || !val.includes('.')) {
        output = (
          <div className="text-rose-400 font-mono text-xs">
            Invalid email format. Please try again:
          </div>
        );
        setHistory((prev) => [...prev, { command: val, output }]);
        return;
      }
      setContactData((prev) => ({ ...prev, email: val }));
      output = (
        <div className="text-zinc-300 font-mono text-xs space-y-1">
          <p className="text-zinc-400">Got it. Now enter your <span className="text-emerald-400 font-bold">Message Content</span>:</p>
        </div>
      );
      setContactStep('message');
      setHistory((prev) => [...prev, { command: val, output }]);
    } else if (contactStep === 'message') {
      const fullMsg = { ...contactData, message: val };
      setContactStep('none');
      setHistory((prev) => [...prev, { command: val, output: <p className="text-zinc-500 font-mono text-xs">Sending message packet...</p> }]);

      if (isDemo) {
        output = (
          <div className="text-emerald-400 font-mono text-xs space-y-1">
            <p>✓ Demo Mode Success: Message package prepared!</p>
            <p className="text-zinc-400 mt-1">Name: {fullMsg.name}</p>
            <p className="text-zinc-400">Email: {fullMsg.email}</p>
            <p className="text-zinc-400">Message: {fullMsg.message}</p>
            <p className="text-zinc-500 text-2xs mt-2">---------------------------------------------------------</p>
          </div>
        );
        setHistory((prev) => [...prev.slice(0, -1), { command: val, output }]);
        setContactData({ name: '', email: '', message: '' });
        return;
      }

      try {
        if (onSubmitMessage) {
          await onSubmitMessage({ name: fullMsg.name, email: fullMsg.email, content: fullMsg.message });
          output = (
            <div className="text-emerald-400 font-mono text-xs space-y-1">
              <p>✓ Success! Message delivered directly to {hero.name}'s inbox.</p>
              <p className="text-zinc-500 text-2xs mt-1">---------------------------------------------------------</p>
            </div>
          );
        } else {
          throw new Error('Submit handler not configured');
        }
      } catch (err: any) {
        output = (
          <div className="text-rose-400 font-mono text-xs space-y-1">
            <p>❌ Send Failed: {err.message || 'Delivery error'}</p>
          </div>
        );
      }

      setHistory((prev) => [...prev.slice(0, -1), { command: val, output }]);
      setContactData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-4 sm:p-6 md:p-8 flex items-center justify-center font-mono selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Terminal Window Wrapper */}
      <div className="w-full max-w-4xl border border-zinc-800 rounded-xl bg-zinc-900/90 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh]">
        
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-2xs font-semibold uppercase tracking-wider">
            <Terminal size={11} className="text-emerald-400" />
            <span>sh — {hero.name || 'visitor'}@devport_os</span>
          </div>
          <div className="w-12" /> {/* spacer to balance controls */}
        </div>

        {/* Console logs */}
        <div 
          onClick={focusInput}
          className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 cursor-text"
        >
          {history.map((h, i) => (
            <div key={i} className="space-y-1.5 animate-fade-in">
              {h.command !== 'system_init' && (
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className="text-zinc-500">visitor@devport:~$</span>
                  <span className="text-zinc-200">{h.command}</span>
                </div>
              )}
              <div className="pl-2">{h.output}</div>
            </div>
          ))}

          {/* Contact Flow helper indicators */}
          {contactStep !== 'none' && (
            <div className="p-2 border border-emerald-500/20 bg-emerald-950/10 rounded text-2xs text-emerald-400/80 animate-pulse">
              [Prompt Mode Active: Type your answer below and press Enter]
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Input prompt bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-850 flex items-center gap-2 shrink-0">
          <span className="text-zinc-500 text-xs shrink-0 select-none">
            {contactStep === 'none' ? 'visitor@devport:~$' : `[contact:${contactStep}]:`}
          </span>
          <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono text-xs focus:ring-0 placeholder:text-zinc-800"
              placeholder={contactStep === 'none' ? 'type a command (e.g. help, about, skills, projects)...' : ''}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <button 
              type="submit" 
              className="text-zinc-500 hover:text-emerald-400 p-1 transition shrink-0 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
