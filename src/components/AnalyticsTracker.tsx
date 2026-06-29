'use client';

import { useEffect } from 'react';

interface AnalyticsTrackerProps {
  portfolioId: string;
  isDemo?: boolean;
}

export default function AnalyticsTracker({ portfolioId, isDemo = false }: AnalyticsTrackerProps) {
  useEffect(() => {
    if (isDemo || typeof window === 'undefined') return;

    // 1. Record Page View
    const recordView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ portfolioId, eventType: 'view' }),
        });
      } catch (err) {
        console.error('Failed to record page view:', err);
      }
    };

    recordView();

    // 2. Track Outbound Links / Recruiter Clicks
    const handleOutboundClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      const text = anchor.innerText?.toLowerCase() || '';

      // Check if it's an outbound link or a resume link/button
      const isOutbound = href.startsWith('http') && !href.includes(window.location.host);
      const isMailTo = href.startsWith('mailto:');
      const isResume = text.includes('resume') || href.includes('resume') || href.includes('drive.google.com') || href.includes('pdf');

      if (isOutbound || isMailTo || isResume) {
        try {
          await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ portfolioId, eventType: 'recruiter_click' }),
          });
        } catch (err) {
          console.error('Failed to record recruiter click:', err);
        }
      }
    };

    document.addEventListener('click', handleOutboundClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleOutboundClick, { capture: true });
    };
  }, [portfolioId, isDemo]);

  return null;
}
