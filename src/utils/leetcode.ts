import { LeetCodeStats } from '@/types/portfolio';

export async function fetchLeetCodeData(username: string): Promise<LeetCodeStats> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('LeetCode username cannot be empty.');
  }

  try {
    const response = await fetch(`/api/leetcode?username=${cleanUsername}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to fetch stats for LeetCode user "${cleanUsername}".`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error('Error fetching LeetCode data via proxy:', error);
    const message = error instanceof Error ? error.message : 'Error occurred while syncing with LeetCode.';
    throw new Error(message);
  }
}

