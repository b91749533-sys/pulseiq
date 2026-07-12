'use client';

import React, { useState } from 'react';
import {
  useSettings,
  useSocialAccounts,
  useConnectSocial,
  useDisconnectSocial,
} from '@/hooks/useApi';
import { useStore } from '@/store/useStore';
import {
  User as UserIcon,
  Link as LinkIcon,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  Tv,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'billing'>('profile');
  const { user } = useStore();

  // Settings
  const { data: settingsData, updateSettings } = useSettings();
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Integrations
  const { data: accounts, isLoading: accountsLoading } = useSocialAccounts();
  const { mutateAsync: connectAccount, isPending: connectPending } = useConnectSocial();
  const { mutateAsync: disconnectAccount } = useDisconnectSocial();

  // Connect Input Form
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [platformInput, setPlatformInput] = useState('YOUTUBE');
  const [handleInput, setHandleInput] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        emailNotifications: emailNotif,
        weeklyDigest: weeklyDigest,
      });
      alert('Settings updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    try {
      await connectAccount({
        platform: platformInput,
        handle: handleInput.startsWith('@') ? handleInput : `@${handleInput}`,
      });
      setHandleInput('');
      setIsConnectOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this channel? Historical metrics will be archived.')) return;
    try {
      await disconnectAccount(id);
    } catch (err) {
      console.error(err);
    }
  };

  const channelsList = [
    { label: 'YouTube', value: 'YOUTUBE', color: 'border-red-500/20 text-red-500 hover:bg-red-500/5' },
    { label: 'Instagram', value: 'INSTAGRAM', color: 'border-pink-500/20 text-pink-500 hover:bg-pink-500/5' },
    { label: 'TikTok', value: 'TIKTOK', color: 'border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/5' },
    { label: 'LinkedIn', value: 'LINKEDIN', color: 'border-blue-500/20 text-blue-500 hover:bg-blue-500/5' },
    { label: 'Twitter (X)', value: 'TWITTER', color: 'border-sky-500/20 text-sky-500 hover:bg-sky-500/5' },
  ];

  return (
    <div className="space-y-8 relative">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Account Settings
        </h1>
        <p className="text-sm text-zinc-400 font-medium">
          Manage user profiles, integrations, security settings, and subscriptions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-light dark:border-border-dark gap-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'profile'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          Profile & Preferences
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'integrations'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          API Integrations
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'billing'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-zinc-455 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          Stripe Billing
        </button>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="premium-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-border-light dark:border-border-dark pb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-500" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Display Name</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{user?.name || 'Youssef Manssouri'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Email Address</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{user?.email || 'youssef.manssouri@example.com'}</p>
              </div>
            </div>

            <hr className="border-border-light dark:border-border-dark" />

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Notification Preferences</h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-border-light dark:border-border-dark bg-transparent rounded"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Email Notifications</p>
                    <p className="text-[10px] text-zinc-400">Receive alerts regarding metric updates and anomalies.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-border-light dark:border-border-dark bg-transparent rounded"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-zinc-900 dark:text-zinc-50">Weekly Growth Digest</p>
                    <p className="text-[10px] text-zinc-400">Receive weekly comparative performance report bundles.</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-glow-blue transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="premium-card p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Connected Social Channels</h3>
                <p className="text-[10px] text-zinc-400 mt-1">Connect or link external platforms for automatic syncing.</p>
              </div>
              <button
                onClick={() => setIsConnectOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Link Channel</span>
              </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accountsLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                </div>
              ) : accounts && accounts.length > 0 ? (
                accounts.map((acc: any) => (
                  <div
                    key={acc.id}
                    className="premium-card p-5 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                        {acc.platform.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                          {acc.displayName || acc.handle}
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-semibold">{acc.handle}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDisconnect(acc.id)}
                      className="p-1.5 text-zinc-455 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-medium border border-dashed border-border-light dark:border-border-dark rounded-2xl">
                  No accounts linked yet. Use the Link button above to connect platforms.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="premium-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-border-light dark:border-border-dark pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>Current Subscription Plan</span>
            </h3>

            <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-2xl flex justify-between items-center">
              <div>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] uppercase font-bold rounded shadow-glow-blue">
                  {user?.subscription?.plan || 'PRO'}
                </span>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 mt-2">
                  InsightFlow Professional Plan
                </h4>
                <p className="text-[10px] text-zinc-400 font-semibold mt-1">
                  Active since Jul 12, 2026. Next billing date: Aug 12, 2026.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">$29</span>
                <span className="text-zinc-500 text-xs font-semibold">/ month</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all">
                Update billing details
              </button>
              <button className="px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-zinc-550 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Cancel plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {isConnectOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-md bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-6 space-y-6">
            <div className="text-center space-y-2 border-b border-border-light dark:border-border-dark pb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Link Social Profile</h3>
              <p className="text-[10px] text-zinc-400 font-semibold">
                OAuth is handled automatically. Fallback simulation mode active.
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Select Network</label>
                <select
                  value={platformInput}
                  onChange={(e) => setPlatformInput(e.target.value)}
                  className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
                >
                  {channelsList.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Channel Handle</label>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  required
                  placeholder="e.g. @youssef_manssouri"
                  className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark justify-end">
                <button
                  type="button"
                  onClick={() => setIsConnectOpen(false)}
                  className="px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connectPending}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow-blue transition-all"
                >
                  {connectPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Connect Profile</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
