import React from 'react';
import { PortfolioContent } from '@/types/portfolio';
import BentoTemplate from './templates/BentoTemplate';
import BrutalistTemplate from './templates/BrutalistTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TerminalTemplate from './templates/TerminalTemplate';
import RecruiterPanel from './RecruiterPanel';

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
      case 'minimal':
      default:
        return <MinimalTemplate data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />;
    }
  };

  return (
    <div className="relative w-full h-full">
      {renderTemplate()}
      <RecruiterPanel data={data} isDemo={isDemo} onSubmitMessage={onSubmitMessage} />
    </div>
  );
}
