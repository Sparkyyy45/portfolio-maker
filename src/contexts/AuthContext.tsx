'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isMock: boolean;
}

export interface MockUser {
  id: string;
  email: string;
  isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'devport_mock_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const client = supabase;

  useEffect(() => {
    if (!client) {
      // Mock auth initialization from LocalStorage
      setIsMock(true);
      const savedUser = localStorage.getItem(LOCAL_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    // Supabase auth subscription
    const getSession = async () => {
      const { data: { session } } = await client.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  const signIn = async (email: string, password: string) => {
    if (!client) {
      // Mock Sign In
      const mockUserObj: MockUser = {
        id: 'mock-user-uuid-1234567890',
        email: email,
        isMock: true,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUserObj));
      setUser(mockUserObj);
      return { error: null };
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!client) {
      // Mock Sign Up
      const mockUserObj: MockUser = {
        id: 'mock-user-uuid-1234567890',
        email: email,
        isMock: true,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUserObj));
      setUser(mockUserObj);
      return { error: null };
    }

    const { data, error } = await client.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (!client) {
      // Mock Sign Out
      localStorage.removeItem(LOCAL_USER_KEY);
      // Clean mock profile details too
      localStorage.removeItem('devport_mock_profile');
      localStorage.removeItem('devport_mock_portfolio');
      localStorage.removeItem('devport_mock_messages');
      setUser(null);
      return { error: null };
    }

    const { error } = await client.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
