'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  Sparkles,
  Users2,
  FileSpreadsheet,
  BellRing,
  Settings as SettingsIcon,
  Sun,
  Moon,
  LogOut,
  Flame,
  User as UserIcon,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Content Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'AI Assistant', href: '/ai', icon: Sparkles },
  { label: 'Competitors', href: '/competitors', icon: Users2 },
  { label: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    user,
    theme,
    toggleTheme,
    activePlatform,
    setActivePlatform,
    unreadCount,
    setIsAuthenticated,
  } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('pulseiq_token');
    setIsAuthenticated(false);
    router.push('/');
  };

  const platforms = [
    { label: 'All', value: 'ALL', color: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' },
    { label: 'YouTube', value: 'YOUTUBE', color: 'bg-red-500/10 text-red-500 border border-red-500/30' },
    { label: 'Instagram', value: 'INSTAGRAM', color: 'bg-pink-500/10 text-pink-500 border border-pink-500/30' },
    { label: 'TikTok', value: 'TIKTOK', color: 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30' },
    { label: 'LinkedIn', value: 'LINKEDIN', color: 'bg-blue-500/10 text-blue-500 border border-blue-500/30' },
    { label: 'Twitter', value: 'TWITTER', color: 'bg-sky-500/10 text-sky-500 border border-sky-500/30' },
  ];

  return (
    <aside className="w-60 m-4 mr-0 rounded-2xl border border-border-light dark:border-border-dark bg-card-light/95 dark:bg-card-dark/85 backdrop-blur-xl flex flex-col h-[calc(100vh-2rem)] shrink-0 shadow-premium-light dark:shadow-premium-dark transition-all">
      {/* Brand Logo */}
      <div className="p-5 border-b border-border-light dark:border-border-dark flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center border border-border-light dark:border-border-dark text-brand-electric shadow-glow-electric shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12h3l3-9 4 18 3-12 1 3h4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="13" cy="21" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 className="font-display font-extrabold text-sm tracking-tight text-zinc-950 dark:text-white">
            PulseIQ
          </h1>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block">
            Social OS
          </span>
        </div>
      </div>

      {/* Connected Channel Filter Selector */}
      <div className="px-4 py-4 border-b border-border-light dark:border-border-dark">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 block px-2">
          Global Channel filter
        </label>
        <div className="grid grid-cols-3 gap-1">
          {platforms.map((plat) => {
            const isActive = activePlatform === plat.value;
            return (
              <button
                key={plat.value}
                onClick={() => setActivePlatform(plat.value)}
                className={`py-1 text-[11px] font-medium rounded-md text-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-900/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {plat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile & Actions */}
      <div className="p-4 border-t border-border-light dark:border-border-dark space-y-3">
        {/* User profile details */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-premium-dark">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'YM'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-zinc-900 dark:text-zinc-100">
              {user?.name || 'Youssef Manssouri'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {user?.email || 'youssef@example.com'}
            </p>
          </div>
        </div>

        {/* Action button row */}
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors border border-border-light/40 dark:border-border-dark/40"
            title="Toggle Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/10 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-colors border border-border-light/40 dark:border-border-dark/40"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Credit */}
        <div className="text-center text-[10px] text-zinc-400/80 font-medium py-1">
          By Youssef Manssouri
        </div>
      </div>
    </aside>
  );
}
