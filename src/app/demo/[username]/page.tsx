'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PortfolioPreview from '@/components/PortfolioPreview';
import { INITIAL_PORTFOLIO_CONTENT } from '@/utils/constants';
import { PortfolioContent } from '@/types/portfolio';
import DemoTourBanner from '@/components/DemoTourBanner';

export default function DemoProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = (params?.username as string) || 'demo_dev';

  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`demo-portfolio-${username}`);
      if (saved) {
        try {
          setContent(JSON.parse(saved));
        } catch (e) {
          setContent(INITIAL_PORTFOLIO_CONTENT);
        }
      } else {
        // Fallback to initial content with updated name
        setContent({
          ...INITIAL_PORTFOLIO_CONTENT,
          hero: {
            ...INITIAL_PORTFOLIO_CONTENT.hero,
            name: username.charAt(0).toUpperCase() + username.slice(1)
          }
        });
      }
    }
  }, [username]);

  // Mock message submit
  const handleMessageSubmit = async (msg: { name: string; email: string; content: string }) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 z-50 bg-zinc-900 border border-zinc-800 text-white px-5 py-3 rounded-xl shadow-2xl text-2xs font-bold flex items-center gap-2 animate-bounce';
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> Message submitted in Demo Mode!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (!mounted || !content) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading preview...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative">
      {/* GUIDE BAR FIXED AT TOP FOR STEP 4 */}
      <DemoTourBanner 
        step={4}
        isLivePage={true}
        username={username}
      />
      
      {/* PORTFOLIO CONTENT */}
      <div className="pt-16">
        <PortfolioPreview data={content} isDemo={true} onSubmitMessage={handleMessageSubmit} />
      </div>
    </div>
  );
}
