import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // 1. Try fetching from the jogruber API
    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
      if (response.ok) {
        const data = await response.json();
        if (data.contributions) {
          interface Contribution {
            date: string;
            count: number;
            level: number;
          }
          data.contributions.sort((a: Contribution, b: Contribution) => a.date.localeCompare(b.date));
        }
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        });
      } else if (response.status === 404) {
        return NextResponse.json({ error: `User "${username}" not found on GitHub` }, { status: 404 });
      }
    } catch (apiErr) {
      console.warn('jogruber API failed, attempting HTML scraping fallback:', apiErr);
    }

    // 2. Fallback: Scrape the public contributions page directly from GitHub
    const htmlResponse = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!htmlResponse.ok) {
      if (htmlResponse.status === 404) {
        return NextResponse.json({ error: `User "${username}" not found on GitHub` }, { status: 404 });
      }
      throw new Error(`GitHub responded with status ${htmlResponse.status}`);
    }

    const html = await htmlResponse.text();
    // Match data-date and data-level attributes in elements
    const combinedRegex = /(?:data-date="([^"]+)"[^>]*data-level="([^"]+)"|data-level="([^"]+)"[^>]*data-date="([^"]+)")/g;
    const matches = [...html.matchAll(combinedRegex)];

    if (matches.length === 0) {
      throw new Error('Failed to parse contribution cells from GitHub HTML');
    }

    const contributions = matches.map(m => {
      const date = m[1] || m[4];
      const level = parseInt(m[2] || m[3], 10);
      // Rough estimation of count if scraped
      const count = level > 0 ? level * 2 : 0;
      return { date, count, level };
    });

    // Sort chronologically
    contributions.sort((a, b) => a.date.localeCompare(b.date));

    // Aggregate totals by year
    const total: Record<string, number> = {};
    contributions.forEach(c => {
      const year = c.date.substring(0, 4);
      total[year] = (total[year] || 0) + c.count;
    });

    return NextResponse.json({
      total,
      contributions
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error: unknown) {
    console.error('GitHub contributions API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch GitHub contributions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
