import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const query = `
      query getUserStats($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode API responded with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('LeetCode GraphQL errors:', result.errors);
      return NextResponse.json({ error: result.errors[0]?.message || 'GraphQL error' }, { status: 400 });
    }

    const matchedUser = result.data?.matchedUser;
    if (!matchedUser) {
      return NextResponse.json({ error: `User "${username}" not found on LeetCode` }, { status: 404 });
    }

    interface Submission {
      difficulty: string;
      count: number;
    }
    const submissions = (matchedUser.submitStatsGlobal?.acSubmissionNum || []) as Submission[];
    const solved = submissions.find((s) => s.difficulty === 'All')?.count || 0;
    const easy = submissions.find((s) => s.difficulty === 'Easy')?.count || 0;
    const medium = submissions.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hard = submissions.find((s) => s.difficulty === 'Hard')?.count || 0;

    const rating = result.data?.userContestRanking?.rating 
      ? Math.round(result.data.userContestRanking.rating) 
      : undefined;
      
    const ranking = result.data?.userContestRanking?.globalRanking || undefined;

    const stats = {
      username,
      solved,
      easy,
      medium,
      hard,
      rating,
      ranking
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error: unknown) {
    console.error('LeetCode proxy error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch LeetCode data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
