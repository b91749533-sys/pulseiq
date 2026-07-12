'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const [name, setName] = useState('Youssef Manssouri');
  const [email, setEmail] = useState('youssef.manssouri@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate user creation
    setTimeout(() => {
      localStorage.setItem('pulseiq_token', 'simulated_user_jwt');
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 relative font-sans">
      {/* Premium ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-violet/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />

      <div className="w-full max-w-md p-8 bg-card-dark/80 border border-border-dark rounded-2xl shadow-premium-dark backdrop-blur-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex w-11 h-11 rounded-xl bg-brand-primary items-center justify-center mx-auto border border-border-dark text-brand-electric shadow-glow-electric">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h3l3-9 4 18 3-12 1 3h4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="13" cy="21" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">Create your account</h2>
          <p className="text-zinc-500 text-xs font-semibold">Join PulseIQ today to analyze your channels instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-electric/30 focus:border-brand-electric transition-all"
              placeholder="Youssef Manssouri"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-electric/30 focus:border-brand-electric transition-all"
              placeholder="youssef.manssouri@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-electric/30 focus:border-brand-electric transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-electric hover:bg-brand-electric/90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-glow-electric disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-zinc-500 text-xs font-semibold">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-brand-electric hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Brand Credit */}
        <div className="text-center text-[10px] text-zinc-650 font-bold pt-2 border-t border-border-dark/40">
          Created By Youssef Manssouri
        </div>
      </div>
    </div>
  );
}
