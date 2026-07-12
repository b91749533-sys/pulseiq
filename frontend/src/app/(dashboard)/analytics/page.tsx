'use client';

import React, { useEffect, useState } from 'react';
import {
  useHistoricalAnalytics,
  useDemographics,
  useTopPosts,
} from '@/hooks/useApi';
import { useStore } from '@/store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Globe,
  Smartphone,
  Navigation,
  ThumbsUp,
  Share2,
  MessageSquare,
  Hash,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { dateRange, activePlatform } = useStore();

  const { data: chartData, isLoading: chartLoading } = useHistoricalAnalytics(dateRange, activePlatform);
  const { data: demo, isLoading: demoLoading } = useDemographics();
  const { data: topPosts, isLoading: postsLoading } = useTopPosts(activePlatform, 6);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (chartLoading || demoLoading || postsLoading || !mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b', '#71717a'];

  // Compute aggregated values
  const totalLikes = chartData?.reduce((sum: number, d: any) => sum + d.likes, 0) || 0;
  const totalComments = chartData?.reduce((sum: number, d: any) => sum + d.comments, 0) || 0;
  const totalShares = chartData?.reduce((sum: number, d: any) => sum + d.shares, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-55">
          Granular Analytics
        </h1>
        <p className="text-sm text-zinc-400 font-medium">
          Detailed platform audience composition and engagement analysis.
        </p>
      </div>

      {/* Engagement Micro metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Likes</p>
            <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{formatNum(totalLikes)}</h4>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Comments</p>
            <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{formatNum(totalComments)}</h4>
          </div>
        </div>
        <div className="premium-card p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Total Shares</p>
            <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{formatNum(totalShares)}</h4>
          </div>
        </div>
      </div>

      {/* Demographics row: Countries Bar & Devices Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Geographic Distribution</h3>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demo?.countries || []} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0f',
                    borderColor: '#1e1e24',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fafafa',
                  }}
                />
                <Bar dataKey="value" name="Audience (%)" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={12}>
                  {(demo?.countries || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Splits */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-4">
            <Smartphone className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Device Profile</h3>
          </div>
          <div className="h-64 w-full pt-4 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demo?.devices || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {(demo?.devices || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0f',
                    borderColor: '#1e1e24',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fafafa',
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Top Hashtags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Channels */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-4">
            <Navigation className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Referral Traffic Channels</h3>
          </div>
          <div className="space-y-4 pt-4">
            {(demo?.trafficSources || []).map((source: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-300">{source.name}</span>
                  <span className="text-zinc-500">{source.value}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hashtags & Topics */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-4">
            <Hash className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Recommended Hashtags</h3>
          </div>
          <div className="pt-2 grid grid-cols-2 gap-3">
            {[
              { tag: '#nextjs15', reach: '45.2K views', trend: '+12.4%' },
              { tag: '#nestjs', reach: '32.1K views', trend: '+8.1%' },
              { tag: '#solofounder', reach: '28.9K views', trend: '+15.2%' },
              { tag: '#softwareengineering', reach: '52.0K views', trend: '-2.4%' },
              { tag: '#agenticai', reach: '78.4K views', trend: '+45.8%' },
              { tag: '#saasbuilder', reach: '19.5K views', trend: '+10.2%' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-border-light dark:border-border-dark rounded-xl flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-blue-500">{item.tag}</span>
                <div className="flex justify-between items-center mt-2 text-[10px] font-semibold text-zinc-400">
                  <span>{item.reach}</span>
                  <span className={item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
