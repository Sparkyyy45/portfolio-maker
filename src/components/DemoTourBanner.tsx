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
    <div className="fixed top-0 inset-x-0 z-50 px-4 py-2.5 bg-bg-surface/90 border-b border-border-primary backdrop-blur-md text-text-primary flex items-center justify-between gap-2 font-sans select-none shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-accent text-text-inverse flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
          <Sparkles size={13} />
        </div>
        <div className="leading-tight">
          <div className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
            <span>Tour</span>
            <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[8px] font-bold uppercase tracking-widest text-accent animate-pulse">Sandbox</span>
          </div>
          <p className="text-[9px] text-text-secondary font-medium hidden sm:block">Replicating all dashboard & portfolio functions</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
        {steps.map((s, idx) => {
          const isDone = step > idx + 1;
          const isActive = step === idx + 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <div className={`w-5 h-px ${isDone ? 'bg-accent' : 'bg-border-primary'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition ${
                  isDone ? 'bg-accent text-text-inverse' : isActive ? 'bg-accent/10 border border-accent text-accent' : 'bg-bg-primary border border-border-primary text-text-tertiary'
                }`}>
                  {isDone ? <Check size={8} /> : idx + 1}
                </div>
                <span className={`text-[10px] ${isActive ? 'text-text-primary font-extrabold' : isDone ? 'text-text-secondary' : 'text-text-tertiary'}`}>{s.title}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isLivePage ? (
          <a
            href={`/login?handle=${username || ''}`}
            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-text-inverse font-bold text-[10px] rounded-lg shadow-lg shadow-accent/20 transition flex items-center gap-1"
          >
            Claim Handle <ArrowRight size={10} />
          </a>
        ) : (
          onNext && (
            <button
              onClick={onNext}
              className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-text-inverse font-bold text-[10px] rounded-lg shadow-md shadow-accent/10 transition flex items-center gap-1 cursor-pointer"
            >
              {nextLabel ? nextLabel.replace(' ➔', '').replace(' 🚀', '') : 'Continue'} <ArrowRight size={10} />
            </button>
          )
        )}
      </div>
    </div>
  );
}
