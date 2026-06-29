'use client';

import React from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface DemoTourBannerProps {
  step: number;
  onNext?: () => void;
  nextLabel?: string;
  isLivePage?: boolean;
  username?: string;
}

export default function DemoTourBanner({ step, onNext, nextLabel, isLivePage = false, username }: DemoTourBannerProps) {
  const steps = [
    { title: 'Import Data', desc: 'Sync GitHub or paste resume' },
    { title: 'Customize Layout', desc: 'Toggle templates, themes & fonts' },
    { title: 'Explore Dashboard', desc: 'Check visitor analytics & stats' },
    { title: 'View Live Site', desc: 'See your published URL' }
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 bg-zinc-950/80 border-b border-zinc-800 backdrop-blur-md text-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans select-none shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Sparkles size={16} />
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <span>Product Tour</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-900 text-4xs font-bold uppercase tracking-widest text-indigo-300 animate-pulse">Sandbox</span>
          </div>
          <p className="text-3xs text-zinc-400 font-medium">Replicating all real dashboard & portfolio functions</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
        {steps.map((s, idx) => {
          const isDone = step > idx + 1;
          const isActive = step === idx + 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <div className={`w-6 h-px ${isDone ? 'bg-indigo-500' : 'bg-zinc-800'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-4xs font-bold transition ${
                  isDone ? 'bg-indigo-600 text-white' : isActive ? 'bg-indigo-500/25 border border-indigo-500 text-indigo-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                }`}>
                  {isDone ? <Check size={10} /> : idx + 1}
                </div>
                <span className={`text-2xs ${isActive ? 'text-zinc-100 font-extrabold' : isDone ? 'text-zinc-400' : 'text-zinc-600'}`}>{s.title}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isLivePage ? (
          <a
            href={`/login?handle=${username || ''}`}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center gap-1.5"
          >
            Claim Handle Permanently <ArrowRight size={12} />
          </a>
        ) : (
          onNext && (
            <button
              onClick={onNext}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              {nextLabel || 'Continue'} <ArrowRight size={12} />
            </button>
          )
        )}
      </div>
    </div>
  );
}
