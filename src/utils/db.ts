import { supabase } from './supabase';
import { PortfolioContent, Profile } from '@/types/portfolio';
import { cache } from 'react';

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();
  
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error) {
    console.error('Error checking username:', error);
    return false;
  }

  return !data;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }
  return true;
}

export async function fetchPortfolio(userId: string): Promise<PortfolioContent | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('portfolios')
    .select('content')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }

  return data ? (data.content as PortfolioContent) : null;
}

export async function savePortfolio(userId: string, content: PortfolioContent): Promise<boolean> {
  if (!supabase) return false;

  // Use upsert to insert or update the portfolio record
  const { error } = await supabase
    .from('portfolios')
    .upsert({
      id: userId,
      content: content as any,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving portfolio:', error);
    return false;
  }
  return true;
}

export const fetchPortfolioByUsername = cache(async (username: string): Promise<{ profile: Profile; content: PortfolioContent } | null> => {
  const cleanUsername = username.trim().toLowerCase();

  if (!supabase) return null;

  // Get active profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .eq('is_published', true)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  // Get portfolio content
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('content')
    .eq('id', profile.id)
    .maybeSingle();

  if (portfolioError || !portfolio) {
    return null;
  }

  return {
    profile,
    content: portfolio.content as PortfolioContent,
  };
});

export async function submitVisitorMessage(portfolioId: string, visitorName: string, visitorEmail: string, content: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('messages')
    .insert({
      portfolio_id: portfolioId,
      visitor_name: visitorName,
      visitor_email: visitorEmail,
      message_content: content,
    });

  if (error) {
    console.error('Error inserting message:', error);
    return false;
  }
  return true;
}

export interface VisitorMessage {
  id: string;
  visitor_name: string;
  visitor_email: string;
  message_content: string;
  created_at: string;
}

export async function fetchVisitorMessages(userId: string): Promise<VisitorMessage[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('id, visitor_name, visitor_email, message_content, created_at')
    .eq('portfolio_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
}
