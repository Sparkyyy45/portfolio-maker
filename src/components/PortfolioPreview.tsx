import React from 'react';
import { PortfolioContent } from '@/types/portfolio';
import BentoTemplate from './templates/BentoTemplate';
import BrutalistTemplate from './templates/BrutalistTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TerminalTemplate from './templates/TerminalTemplate';
import GlassTemplate from './templates/GlassTemplate';
import DeckTemplate from './templates/DeckTemplate';
import TimelineTemplate from './templates/TimelineTemplate';

interface PortfolioPreviewProps {
  data: PortfolioContent;
  isDemo?: boolean;
  onSubmitMessage?: (msg: { name: string; email: string; content: string }) => Promise<void>;
}

export default function PortfolioPreview({ data, isDemo = false, onSubmitMessage }: PortfolioPreviewProps) {
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
    </div>
  );
}
