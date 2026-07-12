'use client';

import React, { useEffect, useState } from 'react';
import {
  useAnalyticsSummary,
  useHistoricalAnalytics,
  useTopPosts,
} from '@/hooks/useApi';
import { useStore } from '@/store/useStore';
import {
  Users,
  Eye,
  Activity,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Clock,
  Play,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Pin,
  Search,
} from 'lucide-react';
import Link from 'next/link';

// Recharts imports
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  
  // Custom workspace options
  const [focusMode, setFocusMode] = useState(false);
  const [isChartCollapsed, setIsChartCollapsed] = useState(false);
  const [pinnedWidgets, setPinnedWidgets] = useState<string[]>(['Total Followers', 'Engagement Rate']);
  
  const { dateRange, setDateRange, activePlatform } = useStore();

  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useAnalyticsSummary();

  const {
    data: chartData,
    isLoading: chartLoading,
  } = useHistoricalAnalytics(dateRange, activePlatform);

  const {
    data: topPosts,
    isLoading: postsLoading,
  } = useTopPosts(activePlatform, 3);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    refetchSummary();
  };

  const togglePin = (title: string) => {
    setPinnedWidgets(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const activePlatformLabel = activePlatform === 'ALL' ? 'All Channels' : activePlatform;

  if (summaryLoading || !mounted) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const kpis = [
    {
      title: 'Total Followers',
      value: summary?.totalFollowers || 0,
      change: summary?.followersChange || 0,
      icon: Users,
      color: 'bg-brand-electric/10 text-brand-electric',
    },
    {
      title: 'Aggregated Views',
      value: summary?.totalViews || 0,
      change: summary?.viewsChange || 0,
      icon: Eye,
      color: 'bg-brand-violet/10 text-brand-violet',
    },
    {
      title: 'Engagement Rate',
      value: `${summary?.avgEngagementRate || 0}%`,
      change: summary?.engagementChange || 0,
      icon: Activity,
      color: 'bg-brand-emerald/10 text-brand-emerald',
      isPercentageDiff: true,
    },
    {
      title: 'Estimated Reach',
      value: summary?.totalReach || 0,
      change: summary?.reachChange || 0,
      icon: Compass,
      color: 'bg-brand-coral/10 text-brand-coral',
    },
  ];

  return (
    <div className={`flex-1 overflow-y-auto p-8 font-sans transition-all duration-300 ${focusMode ? 'max-w-5xl mx-auto px-4' : 'w-full'}`}>
      
      {/* Title Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark/60 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-3xl text-zinc-950 dark:text-white">
              Command Center
            </h1>
            <span className="px-2 py-0.5 bg-brand-electric/10 text-brand-electric text-[9px] font-bold rounded uppercase tracking-wider shrink-0">
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-450 dark:text-zinc-400 font-semibold mt-1">
            Visual workspace analytics for <span className="text-brand-electric font-bold">{activePlatformLabel}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Focus Mode Toggler */}
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`p-2.5 rounded-xl border border-border-light dark:border-border-dark transition-all flex items-center gap-1.5 text-xs font-semibold ${
              focusMode
                ? 'bg-brand-electric/15 border-brand-electric/30 text-brand-electric'
                : 'bg-card-light dark:bg-card-dark text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
            title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{focusMode ? 'Normal View' : 'Focus'}</span>
          </button>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors shrink-0"
            title="Sync Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Range Selector */}
          <div className="inline-flex p-1 bg-zinc-150 dark:bg-zinc-900 border border-border-light dark:border-border-dark rounded-xl gap-1 shrink-0">
            {(['week', 'month', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  dateRange === r
                    ? 'bg-white dark:bg-zinc-800 text-brand-electric shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customizable KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change >= 0;
          const isPinned = pinnedWidgets.includes(kpi.title);
          
          return (
            <div
              key={idx}
              className={`premium-card p-6 flex flex-col justify-between min-h-[145px] relative group ${
                isPinned ? 'border-zinc-300 dark:border-zinc-850 bg-card-light/40' : ''
              }`}
            >
              {/* Pin shortcut overlay */}
              <button
                onClick={() => togglePin(kpi.title)}
                className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md text-zinc-400 ${
                  isPinned ? 'opacity-100 text-brand-electric' : ''
                }`}
                title={isPinned ? 'Unpin card' : 'Pin card to workspace'}
              >
                <Pin className="w-3 h-3" />
              </button>

              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center border border-border-light/10`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-mono tracking-tight font-extrabold text-zinc-950 dark:text-white">
                  {typeof kpi.value === 'string' ? kpi.value : formatNum(kpi.value)}
                </span>

                <div
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isPositive
                      ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20'
                      : 'bg-brand-coral/10 text-brand-coral border border-brand-coral/20'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>
                    {isPositive ? '+' : ''}
                    {kpi.change}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Historical Area Chart Panel */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-premium-light dark:shadow-premium-dark mb-8">
        <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-brand-electric" />
            <h3 className="font-display font-extrabold text-sm text-zinc-950 dark:text-white">
              Metrics Growth Curve
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChartCollapsed(!isChartCollapsed)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 transition-colors"
            >
              {isChartCollapsed ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {!isChartCollapsed && (
          <div className="h-80 w-full font-mono text-[10px]">
            {chartLoading ? (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
            ) : chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f8cff" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f8cff" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7a5cfa" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#7a5cfa" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#71717a" tickLine={false} />
                  <YAxis stroke="#71717a" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f4f4f5',
                    }}
                  />
                  <Area
                    name="Views Index"
                    type="monotone"
                    dataKey="views"
                    stroke="#4f8cff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    name="Follower Delta"
                    type="monotone"
                    dataKey="followers"
                    stroke="#7a5cfa"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFollowers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 font-semibold border border-dashed border-border-light dark:border-border-dark rounded-xl">
                <span>No analytics history index populated.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Split grid for Pinned Widgets & Top Performing Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Pinned/Active Widgets */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-premium-light dark:shadow-premium-dark">
            <h3 className="font-display font-extrabold text-sm text-zinc-950 dark:text-white border-b border-border-light dark:border-border-dark pb-4 mb-4">
              Workspace Checklist
            </h3>
            
            <div className="space-y-3 text-xs font-semibold text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-electric animate-ping" />
                <span>Command Palette binded to `Ctrl + K`</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                <span>Client offline data simulator enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                <span>Gemini API workspace configured</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark/60 text-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
                className="text-[10px] uppercase font-bold tracking-wider text-brand-electric hover:underline flex items-center gap-1.5 justify-center mx-auto"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Quick Palette Actions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Top Posts List */}
        <div className="lg:col-span-2">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-premium-light dark:shadow-premium-dark h-full">
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-brand-violet" />
                <h3 className="font-display font-extrabold text-sm text-zinc-950 dark:text-white">
                  Top High-Performance Content
                </h3>
              </div>
              <Link href="/analytics" className="text-[10px] uppercase font-bold tracking-wider text-brand-electric hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {postsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-150 dark:bg-zinc-900 animate-pulse rounded-xl" />
                ))
              ) : topPosts && topPosts.length > 0 ? (
                topPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-border-light dark:border-border-dark rounded-xl flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-300"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-450">
                        {post.platform} • {post.handle}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 max-w-[280px] sm:max-w-md truncate">
                        {post.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs font-bold">
                      <div className="text-right">
                        <span className="text-zinc-950 dark:text-zinc-50">{formatNum(post.views)}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">Views</span>
                      </div>
                      <div className="text-right">
                        <span className="text-brand-emerald">{post.engagementRate}%</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-sans">Eng.</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-500 text-xs font-medium border border-dashed border-border-light dark:border-border-dark rounded-xl">
                  No post logs connected for this channel.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
