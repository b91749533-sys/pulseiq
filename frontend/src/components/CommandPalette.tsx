'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import {
  Search,
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  Sparkles,
  Users2,
  FileSpreadsheet,
  Settings,
  Sun,
  Moon,
  Plus,
  Terminal,
} from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    const handleToggleEvent = () => setIsOpen((prev) => !prev);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleToggleEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleToggleEvent);
    };
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setSearch('');
  };

  const actions = [
    { label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => router.push('/dashboard') },
    { label: 'Open Analytics Hub', category: 'Navigation', icon: BarChart3, action: () => router.push('/analytics') },
    { label: 'Open Content Calendar', category: 'Navigation', icon: CalendarDays, action: () => router.push('/calendar') },
    { label: 'Consult AI Assistant', category: 'Navigation', icon: Sparkles, action: () => router.push('/ai') },
    { label: 'Track Competitors', category: 'Navigation', icon: Users2, action: () => router.push('/competitors') },
    { label: 'Export Reports', category: 'Navigation', icon: FileSpreadsheet, action: () => router.push('/reports') },
    { label: 'Configure Settings', category: 'Navigation', icon: Settings, action: () => router.push('/settings') },
    
    { label: 'Link Social Account', category: 'Quick Actions', icon: Plus, action: () => router.push('/settings?tab=integrations') },
    { label: 'Create Scheduled Post', category: 'Quick Actions', icon: Plus, action: () => router.push('/calendar') },
    { label: 'Toggle Appearance (Light/Dark)', category: 'Quick Actions', icon: theme === 'dark' ? Sun : Moon, action: toggleTheme },
  ];

  const filtered = actions.filter((act) =>
    act.label.toLowerCase().includes(search.toLowerCase()) ||
    act.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-6 pt-[15vh] animate-fade-in">
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-premium-dark overflow-hidden animate-scale-in"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search workspace..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-500 font-sans"
          />
          <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-450 border border-zinc-200 dark:border-zinc-700 rounded-md font-mono shrink-0">
            ESC
          </kbd>
        </div>

        {/* Action Results */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            <div>
              {/* Group actions by category */}
              {['Navigation', 'Quick Actions'].map((cat) => {
                const catActions = filtered.filter((a) => a.category === cat);
                if (catActions.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1 mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-1.5">
                      {cat}
                    </p>
                    {catActions.map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAction(act.action)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white text-zinc-750 dark:text-zinc-300 dark:hover:text-white transition-all text-xs font-semibold text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{act.label}</span>
                          </div>
                          <Terminal className="w-3.5 h-3.5 opacity-40 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs font-medium">
              No matching commands or actions found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-border-light dark:border-border-dark flex justify-between items-center text-[10px] text-zinc-455 font-medium shrink-0">
          <span>Navigate with arrows, select with Enter</span>
          <span>PulseIQ Command Center</span>
        </div>
      </div>
    </div>
  );
}
