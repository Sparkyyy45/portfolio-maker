'use client';

import React, { useState } from 'react';
import { PortfolioContent } from '@/types/portfolio';
import { Briefcase, Mail, Phone, Calendar, Copy, Check, X, FileText, Send } from 'lucide-react';

interface RecruiterPanelProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function RecruiterPanel({ data, isDemo = false, onSubmitMessage }: RecruiterPanelProps) {
  const { hero, projects, experience, leetcode, education } = data;

  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      alert('Demo Mode: Message contact prepared!');
      return;
    }
    if (!name || !email || !msg) {
      setError('Please fill all fields');
      return;
    }
    setSending(true);
    setError('');
    try {
      if (onSubmitMessage) {
        await onSubmitMessage({ name, email, content: msg });
        setSent(true);
        setName('');
        setEmail('');
        setMsg('');
      } else {
        throw new Error('Message submission not configured');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const totalExperienceYears = experience ? experience.length : 0;
  const projectCount = projects ? projects.length : 0;
  const latestEducation = education && education.length > 0 ? education[0].institution : null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 font-sans select-none print:hidden flex flex-col items-end">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full shadow-2xl border border-zinc-800 transition active:scale-95 cursor-pointer text-xs font-bold uppercase tracking-wider"
        >
          <Briefcase size={13} className="text-emerald-400" />
          <span>Recruiter Mode</span>
        </button>
      ) : (
        <div className="w-full sm:w-[320px] max-w-md bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-200 text-zinc-100">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Recruiter Panel
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-zinc-500 hover:text-white transition cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg text-2xs space-y-1.5 text-zinc-400">
            <div className="flex justify-between">
              <span>Work Milestones:</span>
              <span className="text-zinc-200 font-bold">{totalExperienceYears} roles listed</span>
            </div>
            <div className="flex justify-between">
              <span>Total Projects:</span>
              <span className="text-zinc-200 font-bold">{projectCount} featured</span>
            </div>
            {leetcode && leetcode.username && (
              <div className="flex justify-between">
                <span>LeetCode Solved:</span>
                <span className="text-zinc-200 font-bold">{leetcode.solved} problems</span>
              </div>
            )}
            {latestEducation && (
              <div className="flex justify-between">
                <span>Education:</span>
                <span className="text-zinc-200 font-bold truncate max-w-[150px]">{latestEducation}</span>
              </div>
            )}
          </div>

          {/* Fast Contact Options */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Quick Copy Links</h4>
            
            {hero.socials.email && (
              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-900 border border-zinc-850/50 text-xs">
                <span className="truncate text-zinc-300 font-medium max-w-[200px]" title={hero.socials.email}>{hero.socials.email}</span>
                <button
                  onClick={() => copyToClipboard(hero.socials.email || '', 'email')}
                  className="text-zinc-500 hover:text-emerald-400 transition cursor-pointer"
                >
                  {copiedField === 'email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            )}

            {hero.socials.linkedin && (
              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-900 border border-zinc-850/50 text-xs">
                <span className="truncate text-zinc-300 font-medium">linkedin.com/in/{hero.socials.linkedin}</span>
                <button
                  onClick={() => copyToClipboard(`https://linkedin.com/in/${hero.socials.linkedin}`, 'linkedin')}
                  className="text-zinc-500 hover:text-emerald-400 transition cursor-pointer"
                >
                  {copiedField === 'linkedin' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            )}
          </div>

          {/* Print / Export Button */}
          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-extrabold text-xs transition active:scale-98 flex items-center justify-center gap-1.5 shadow-md cursor-pointer uppercase tracking-wider"
          >
            <FileText size={13} />
            <span>Print PDF Resume</span>
          </button>

          {/* Contact Owner Form */}
          <div className="border-t border-zinc-850 pt-3 space-y-2">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Leave a Quick Note</h4>
            
            {sent ? (
              <p className="text-2xs text-emerald-400 font-bold text-center py-1">✓ Your note was sent directly to {hero.name}!</p>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-2">
                {error && <p className="text-[10px] text-rose-500 font-bold">{error}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-2xs text-zinc-200 outline-none focus:border-zinc-700"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-2xs text-zinc-200 outline-none focus:border-zinc-700"
                  />
                </div>
                <textarea
                  placeholder="Message..."
                  value={msg}
                  rows={2}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-2xs text-zinc-200 outline-none focus:border-zinc-700 resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg font-bold text-2xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send size={10} />
                  <span>{sending ? 'Sending...' : 'Transmit'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
