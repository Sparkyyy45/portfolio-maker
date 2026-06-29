'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Loader2, Sparkles, Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, signIn, signUp, loading, signInWithOAuth } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSubmitLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;
        router.push('/onboarding');
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError('');
    setSubmitLoading(true);
    try {
      const { error: oAuthError } = await signInWithOAuth(provider);
      if (oAuthError) throw oAuthError;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || `${provider} sign in failed. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 via-bg-primary to-bg-primary pointer-events-none" />

      <div className="max-w-md w-full space-y-6 p-8 rounded-xl border border-border-primary bg-bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative z-10">

        {/* Title / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-lg bg-bg-primary border border-border-primary text-text-primary mb-2 shadow-sm">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-text-secondary">
            {isSignUp ? 'Build your premium portfolio in minutes' : 'Manage your developer portal & stats'}
          </p>
        </div>





        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-[11px] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="text-2xs font-semibold text-text-secondary uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-tertiary">
                  <Mail size={15} />
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-primary bg-bg-primary text-sm placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-text-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password-field" className="text-2xs font-semibold text-text-secondary uppercase">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-tertiary">
                  <Lock size={15} />
                </span>
                <input
                  id="password-field"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-primary bg-bg-primary text-sm placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-text-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-lg bg-accent hover:bg-accent-hover text-text-inverse font-semibold transition disabled:opacity-50 text-sm cursor-pointer"
          >
            {submitLoading ? (
              <Loader2 size={16} className="animate-spin text-text-inverse" />
            ) : (
              <>
                {isSignUp ? 'Get Started' : 'Sign In'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
