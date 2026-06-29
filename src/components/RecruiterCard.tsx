'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioContent } from '@/types/portfolio';
import { ExternalLink, X, Mail } from 'lucide-react';

interface RecruiterCardProps {
  data: PortfolioContent;
  viewsCount?: number;
  onClose: () => void;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function RecruiterCard({ data, viewsCount = 0, onClose, onSubmitMessage }: RecruiterCardProps) {
  const { hero, skills = [], projects = [], experience = [], github_repos = [] } = data;
  const name = hero?.name || 'Developer';
  
  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  // Contact form states
  const [showContactForm, setShowContactForm] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim() || !messageContent.trim() || !onSubmitMessage) return;
    setIsSending(true);
    setError('');
    try {
      await onSubmitMessage({
        name: visitorName.trim(),
        email: visitorEmail.trim(),
        content: messageContent.trim()
      });
      setSuccess(true);
      setVisitorName('');
      setVisitorEmail('');
      setMessageContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  // Calculate dynamic metrics
  const totalProjects = projects.length + github_repos.length;
  
  const totalStars = 
    (github_repos || []).reduce((acc, repo) => acc + (repo.stars || 0), 0) + 
    (projects || []).reduce((acc, p) => acc + (p.stars || 0), 0);

  const totalExperience = experience.length;

  // Flatten top 4 skills
  const topSkills = skills.flatMap(s => s.items).slice(0, 4);
  const skillPercentages = [92, 85, 78, 70]; // Visual representation for skills progress bars

  // Featured projects (up to 2)
  const featuredProjects = projects.slice(0, 2);

  // Mock GitHub activity heights (realistic bar chart heights)
  const mockActivity = [20, 10, 35, 60, 15, 45, 55, 30, 80, 100, 95, 100];
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Centered Phone Frame Card */}
      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 font-sans text-zinc-100 flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {/* Top Header Address Bar */}
        <div className="bg-zinc-900 border-b border-zinc-800 py-3 px-4 text-center text-2xs text-zinc-500 font-medium tracking-wide">
          devport.app/{name.toLowerCase().replace(/\s+/g, '-')}
        </div>

        {/* Card Body (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] scrollbar-thin">
          
          {showContactForm ? (
            success ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400 flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Message Sent!</h3>
                  <p className="text-3xs text-zinc-400">Your message has been delivered directly to {name}.</p>
                </div>
                <button 
                  onClick={() => { setSuccess(false); setShowContactForm(false); }}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-100 font-semibold text-xs rounded-xl hover:bg-zinc-800 transition cursor-pointer"
                >
                  Back to Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                <div className="space-y-1.5 text-center">
                  <h3 className="text-sm font-bold text-white">Message {name}</h3>
                  <p className="text-4xs text-zinc-500">Send a quick inquiry directly to their email.</p>
                </div>
                
                {error && (
                  <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/60 text-rose-400 text-4xs text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-4xs font-bold text-zinc-500 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 transition"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-4xs font-bold text-zinc-500 uppercase">Your Email</label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 transition"
                    placeholder="jane@company.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-4xs font-bold text-zinc-500 uppercase">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-500 transition resize-none"
                    placeholder="Hi! I saw your portfolio and wanted to discuss opportunities..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 py-2 border border-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl hover:bg-zinc-900 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 py-2 bg-zinc-100 text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition cursor-pointer"
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )
          ) : (
            <>
              {/* Avatar and Name */}
              <div className="flex flex-col items-center text-center space-y-3">
                {hero.avatar_url ? (
                  <img 
                    src={hero.avatar_url} 
                    className="w-20 h-20 rounded-full border border-zinc-800 object-cover shadow-md" 
                    alt={name} 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-md">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="space-y-1">
                  <h1 className="text-xl font-bold tracking-tight">{name}</h1>
                  <p className="text-xs text-zinc-400 font-medium">{hero.tagline}</p>
                  {hero.location && (
                    <p className="text-3xs text-zinc-500">{hero.location}</p>
                  )}
                </div>

                {/* Availability Pill */}
                {hero.availability_date && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 text-3xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {hero.availability_date}
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-900 py-4 text-center">
                <div>
                  <div className="text-lg font-black text-white">{totalProjects}</div>
                  <div className="text-3xs text-zinc-500 uppercase font-bold tracking-wider">Projects</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">{totalStars}</div>
                  <div className="text-3xs text-zinc-500 uppercase font-bold tracking-wider">GitHub Stars</div>
                </div>
                <div>
                  <div className="text-lg font-black text-white">{totalExperience}</div>
                  <div className="text-3xs text-zinc-500 uppercase font-bold tracking-wider">Experience</div>
                </div>
              </div>

              {/* Skills Section */}
              {topSkills.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-3xs font-extrabold text-zinc-500 uppercase tracking-wider">Skills</h3>
                  <div className="space-y-2.5">
                    {topSkills.map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between gap-4">
                        <span className="text-2xs text-zinc-300 font-semibold w-16 truncate">{skill}</span>
                        <div className="flex-1 bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-zinc-200 h-full rounded-full transition-all duration-500"
                            style={{ width: `${skillPercentages[index] || 70}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-3xs font-extrabold text-zinc-500 uppercase tracking-wider">Featured Projects</h3>
                  <div className="space-y-3">
                    {featuredProjects.map((project) => (
                      <div key={project.title} className="p-3 bg-zinc-900/60 border border-zinc-900 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{project.title}</h4>
                          {project.live && (
                            <a 
                              href={project.live} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-zinc-500 hover:text-zinc-300 transition"
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <p className="text-3xs text-zinc-400 leading-relaxed line-clamp-2">{project.description}</p>
                        {project.tech && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.tech.slice(0, 3).map((t) => (
                              <span key={t} className="text-4xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Timeline */}
              {experience.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-3xs font-extrabold text-zinc-500 uppercase tracking-wider">Experience</h3>
                  <div className="relative border-l border-zinc-900 pl-4 ml-2 space-y-4">
                    {experience.slice(0, 3).map((exp, idx) => (
                      <div key={idx} className="relative space-y-1">
                        {/* Circle Bullet Connector */}
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-200 border border-zinc-950" />
                        
                        <h4 className="text-2xs font-bold text-white leading-none">
                          {exp.role} <span className="text-zinc-500 font-normal">at</span> {exp.company}
                        </h4>
                        <p className="text-3xs text-zinc-500">
                          {exp.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub Activity Chart */}
              <div className="space-y-3">
                <h3 className="text-3xs font-extrabold text-zinc-500 uppercase tracking-wider">GitHub Activity</h3>
                <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl space-y-2">
                  <div className="flex items-end justify-between h-12 pt-2 px-1">
                    {mockActivity.map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-1.5 rounded-t-sm transition-all duration-700 ${
                            height > 75 ? 'bg-white' : 'bg-zinc-700'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase tracking-wider px-1">
                    {months.map((m, i) => (
                      <span key={i} className="w-1.5 text-center">{m[0]}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Mail size={12} />
                  Contact {name.split(' ')[0]} →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Views Info */}
        <div className="bg-zinc-900/50 border-t border-zinc-900 py-3 text-center text-4xs text-zinc-500 font-medium">
          👁 Viewed {viewsCount || 43} times this month
        </div>
      </div>
    </div>
  );
}
