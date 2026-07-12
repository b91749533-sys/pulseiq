'use client';

import React, { useEffect, useState } from 'react';
import {
  useCompetitorComparison,
  useCompetitors,
  useAddCompetitor,
  useRemoveCompetitor,
} from '@/hooks/useApi';
import { useStore } from '@/store/useStore';
import {
  Users2,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  Award,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function CompetitorsPage() {
  const [mounted, setMounted] = useState(false);
  const { activePlatform } = useStore();
  const [newHandle, setNewHandle] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');

  const targetPlatform = activePlatform === 'ALL' ? 'YOUTUBE' : activePlatform;

  const { data: compList, isLoading: listLoading } = useCompetitors();
  const { data: compareData, isLoading: compareLoading } = useCompetitorComparison(targetPlatform);
  const { mutateAsync: addCompetitor, isPending: addPending } = useAddCompetitor();
  const { mutateAsync: removeCompetitor } = useRemoveCompetitor();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;

    try {
      await addCompetitor({
        platform: targetPlatform,
        handle: newHandle,
        displayName: newDisplayName || undefined,
      });
      setNewHandle('');
      setNewDisplayName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeCompetitor(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (listLoading || compareLoading || !mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const benchmarks = compareData?.benchmarks || [];
  const aiSummary = compareData?.aiSummary || '';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Competitor Matrix
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Benchmark your growth and engagement against leading creators on <span className="text-blue-500 font-semibold">{targetPlatform}</span>.
          </p>
        </div>
      </div>

      {/* Add Competitor Panel */}
      <div className="premium-card p-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-border-light dark:border-border-dark pb-3 mb-4">
          Track New Competitor Profile
        </h3>

        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">Handle / Username</label>
            <input
              type="text"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              required
              placeholder="e.g. @tech_reviewer"
              className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-455">Display Name (Optional)</label>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="e.g. Tech Review Hub"
              className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <button
            type="submit"
            disabled={addPending}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-glow-blue flex items-center gap-1.5 transition-all shrink-0 h-10"
          >
            {addPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Track Profile</span>
          </button>
        </form>
      </div>

      {/* AI Comparison Digest */}
      {aiSummary && (
        <div className="p-5 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex gap-4 items-start">
          <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400">AI Competitor Benchmark Summary</h4>
            <p className="text-xs text-zinc-650 dark:text-zinc-450 leading-relaxed font-medium">
              {aiSummary}
            </p>
          </div>
        </div>
      )}

      {/* Benchmark Graph */}
      {benchmarks.length > 0 && (
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Audience Benchmark Comparison</h3>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarks}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatNum(val)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0f',
                    borderColor: '#1e1e24',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fafafa',
                  }}
                />
                <Legend iconSize={8} iconType="circle" />
                <Bar dataKey="followers" name="Followers" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="postsCount" name="Monthly Posts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Grid of Tracked Competitors */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Tracked Competitor Profiles ({compList?.length || 0})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compList?.map((comp: any) => (
            <div key={comp.id} className="premium-card p-5 flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-600 dark:text-zinc-300">
                    {comp.displayName ? comp.displayName[0].toUpperCase() : '@'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{comp.displayName || comp.handle}</h4>
                    <p className="text-[10px] text-zinc-450 font-semibold">{comp.handle} • {comp.platform}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(comp.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  title="Remove Competitor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border-light dark:border-border-dark pt-3 text-center">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Followers</p>
                  <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">{formatNum(comp.followers)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Engagement</p>
                  <p className="text-xs font-extrabold text-emerald-500">{comp.engagementRate}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Growth</p>
                  <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">+{comp.weeklyGrowthRate}%</p>
                </div>
              </div>
            </div>
          ))}
          {compList?.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-medium border border-dashed border-border-light dark:border-border-dark rounded-2xl">
              No competitors added yet. Use the form above to track competitor accounts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
