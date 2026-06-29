'use client';

import React, { useState } from 'react';
import { PortfolioContent } from '@/types/portfolio';
import BentoTemplate from './templates/BentoTemplate';
import BrutalistTemplate from './templates/BrutalistTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TerminalTemplate from './templates/TerminalTemplate';
import GlassTemplate from './templates/GlassTemplate';
import DeckTemplate from './templates/DeckTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
import RecruiterCard from './RecruiterCard';
import { ShieldAlert } from 'lucide-react';

interface PortfolioPreviewProps {
  data: PortfolioContent;
  isDemo?: boolean;
  viewsCount?: number;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function PortfolioPreview({ data, isDemo = false, viewsCount = 0, onSubmitMessage }: PortfolioPreviewProps) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const template = data.template || 'minimal';

  const renderTemplate = () => {
    switch (template) {
      case 'bento':
        return <BentoTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'brutalist':
        return <BrutalistTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'terminal':
        return <TerminalTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'glass':
        return <GlassTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'deck':
        return <DeckTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'timeline':
        return <TimelineTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
      case 'minimal':
      default:
        return <MinimalTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
    }
  };

  const fontPairClass = (() => {
    switch (data.font_pair) {
      case 'serif':
        return 'font-pair-elegant-serif';
      case 'mono':
        return 'font-pair-dev-mono';
      case 'editorial':
        return 'font-pair-editorial';
      case 'modern':
      case 'modern-tech':
      default:
        return 'font-pair-modern-tech';
    }
  })();

  return (
    <div className={`relative w-full h-full ${fontPairClass}`}>
      {renderTemplate()}

      {/* Floating Recruiter Mode Toggle Button */}
      {!isRecruiterMode && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsRecruiterMode(true)}
            className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-full shadow-xl font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer"
          >
            <ShieldAlert size={14} className="text-amber-500 animate-pulse" />
            Recruiter Mode
          </button>
        </div>
      )}

      {/* Recruiter Card Modal Overlay */}
      {isRecruiterMode && (
        <RecruiterCard
          data={data}
          viewsCount={viewsCount}
          onClose={() => setIsRecruiterMode(false)}
          onSubmitMessage={onSubmitMessage}
        />
      )}
    </div>
  );
}
