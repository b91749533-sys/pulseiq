'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import { useProfile, useNotifications } from '@/hooks/useApi';
import { useStore } from '@/store/useStore';
import { Bell, Loader2, Sparkles, Search } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { isLoading, error } = useProfile();
  
  // Prefetch notifications
  useNotifications();

  useEffect(() => {
    // If not authenticated and not loading, redirect to sign-in
    if (!isLoading && error) {
      router.push('/sign-in');
    }
  }, [isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-electric to-brand-violet flex items-center justify-center animate-spin">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-sm text-zinc-550 font-medium animate-pulse">Initializing PulseIQ...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Ribbon */}
        <header className="h-16 border-b border-border-light dark:border-border-dark px-8 flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-border-light dark:border-border-dark rounded-xl text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 font-semibold shadow-sm transition-all"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Search command center...</span>
              <kbd className="ml-6 px-1.5 py-0.5 bg-zinc-250 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-[9px] font-mono shrink-0">Ctrl K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick AI Notification Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-semibold rounded-full shadow-glow-violet animate-pulse-slow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PulseIQ AI Engine Active</span>
            </div>
            
            {/* Notifications Alert Center */}
            <button 
              onClick={() => router.push('/settings')} 
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-coral animate-ping" />
            </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
