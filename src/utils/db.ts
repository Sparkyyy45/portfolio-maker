import { supabase } from './supabase';
import { PortfolioContent, Profile } from '@/types/portfolio';

// LocalStorage Mock Helpers
const LOCAL_PROFILE_KEY = 'devport_mock_profile';
const LOCAL_PORTFOLIO_KEY = 'devport_mock_portfolio';
const LOCAL_MESSAGES_KEY = 'devport_mock_messages';

const getMockProfile = (): Profile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(LOCAL_PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

const saveMockProfile = (profile: Profile) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
};

const getMockPortfolioContent = (): PortfolioContent | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(LOCAL_PORTFOLIO_KEY);
  return data ? JSON.parse(data) : null;
};

const saveMockPortfolioContent = (content: PortfolioContent) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_PORTFOLIO_KEY, JSON.stringify(content));
};

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();
  
  if (!supabase) {
    // Mock check
    const mockProfile = getMockProfile();
    if (mockProfile && mockProfile.username === cleanUsername) {
      return true;
    }
    // Simulate availability
    return cleanUsername !== 'admin' && cleanUsername !== 'login' && cleanUsername !== 'dashboard';
  }

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
  if (!supabase) {
    const mockProfile = getMockProfile();
    if (mockProfile && mockProfile.id === userId) return mockProfile;
    // Return a default mock profile if logged in
    const defaultMock: Profile = {
      id: userId,
      email: 'mock@devport.com',
      username: null,
      is_published: false,
      created_at: new Date().toISOString(),
    };
    saveMockProfile(defaultMock);
    return defaultMock;
  }

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
  if (!supabase) {
    const mockProfile = getMockProfile() || {
      id: userId,
      email: 'mock@devport.com',
      username: null,
      is_published: false,
      created_at: new Date().toISOString(),
    };
    const updated = { ...mockProfile, ...updates };
    saveMockProfile(updated);
    return true;
  }

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
  if (!supabase) {
    return getMockPortfolioContent();
  }

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
  if (!supabase) {
    saveMockPortfolioContent(content);
    return true;
  }

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

export async function fetchPortfolioByUsername(username: string): Promise<{ profile: Profile; content: PortfolioContent } | null> {
  const cleanUsername = username.trim().toLowerCase();

  if (!supabase) {
    // Local storage mock resolver
    const mockProfile = getMockProfile();
    const mockContent = getMockPortfolioContent();
    if (mockProfile && mockProfile.username === cleanUsername && mockProfile.is_published && mockContent) {
      return { profile: mockProfile, content: mockContent };
    }
    return null;
  }

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
}

export async function submitVisitorMessage(portfolioId: string, visitorName: string, visitorEmail: string, content: string): Promise<boolean> {
  if (!supabase) {
    if (typeof window !== 'undefined') {
      const messages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      messages.push({
        id: Math.random().toString(),
        portfolio_id: portfolioId,
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        message_content: content,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
    }
    return true;
  }

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
  if (!supabase) {
    if (typeof window !== 'undefined') {
      const messages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      return messages
        .filter((msg: any) => msg.portfolio_id === userId)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return [];
  }

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
