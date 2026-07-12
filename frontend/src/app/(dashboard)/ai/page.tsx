'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useConversations,
  useCreateConversation,
  useMessages,
  useSendMessage,
} from '@/hooks/useApi';
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Bot,
  User as UserIcon,
  Loader2,
  HelpCircle,
  Lightbulb,
  TrendingDown,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AiAssistantPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');

  const { data: conversations, isLoading: convsLoading } = useConversations();
  const { mutateAsync: createConversation, isPending: createPending } = useCreateConversation();
  const { data: messages, isLoading: msgsLoading } = useMessages(activeConvId);
  const { mutateAsync: sendMessage, isPending: sendPending } = useSendMessage();

  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateNewChat = async () => {
    try {
      const newConv = await createConversation('New Conversation');
      if (newConv) {
        setActiveConvId(newConv.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || !activeConvId) return;

    setInput('');
    try {
      await sendMessage({ conversationId: activeConvId, content: textToSend });
    } catch (err) {
      console.error(err);
    }
  };

  const samplePrompts = [
    { label: 'Suggest post hooks', text: 'Generate 3 high-affinity hooks for a LinkedIn post about developer tools.' },
    { label: 'Analyze reach spike', text: 'Explain why my LinkedIn reach increased by 18% this month.' },
    { label: 'Viral hashtag bundle', text: 'Recommend viral hashtags for a YouTube short on backend development.' },
  ];

  const isLoading = convsLoading || createPending;

  return (
    <div className="flex-1 overflow-hidden p-8 flex flex-col h-full font-sans">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-border-light dark:border-border-dark/60 mb-6 shrink-0 flex justify-between items-center">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-zinc-950 dark:text-white">
            Intelligent Workspace
          </h1>
          <p className="text-xs text-zinc-450 dark:text-zinc-400 font-semibold mt-1">
            Consult Gemini AI on audience behavior and post drafts using actual channel metrics.
          </p>
        </div>
      </div>

      {/* Main Workspace Split Pane */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Pane 1: Conversations List Sidebar */}
        <div className="w-56 border border-border-light dark:border-border-dark bg-card-light/40 dark:bg-card-dark/40 rounded-2xl flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">AI Conversations</span>
            <button
              onClick={handleCreateNewChat}
              className="p-1.5 bg-brand-electric hover:bg-brand-electric/90 text-white rounded-lg transition-all shadow-glow-electric"
              title="New Chat"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map((c: any) => {
                const isActive = activeConvId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      isActive
                        ? 'bg-brand-electric/15 text-brand-electric border border-brand-electric/25'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-[10px] text-center text-zinc-500 py-8 font-semibold">No active sessions.</p>
            )}
          </div>
        </div>

        {/* Pane 2: Message Stream Area (Middle) */}
        <div className="flex-1 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-2xl flex flex-col overflow-hidden shadow-premium-light dark:shadow-premium-dark">
          {/* Active Header */}
          <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2 shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-brand-electric" />
            <span className="text-xs font-bold text-zinc-950 dark:text-white">Active Gemini Consult</span>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {msgsLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-brand-electric animate-spin" />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((m: any) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-4 p-4 rounded-xl border ${
                      isAssistant
                        ? 'bg-zinc-50/50 dark:bg-zinc-900/40 border-border-light dark:border-border-dark'
                        : 'bg-brand-electric/5 border-brand-electric/15'
                    }`}
                  >
                    <div className="shrink-0">
                      {isAssistant ? (
                        <div className="w-8 h-8 rounded-lg bg-brand-violet/15 text-brand-violet border border-brand-violet/25 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-brand-electric/10 text-brand-electric border border-brand-electric/25 flex items-center justify-center">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {isAssistant ? 'Gemini AI Advisor' : 'You (Youssef)'}
                      </p>
                      <div className="text-xs font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
                <div className="w-10 h-10 rounded-2xl bg-brand-electric/10 text-brand-electric flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-display font-extrabold text-sm text-zinc-950 dark:text-white">Workspace Analytics Assistant</h4>
                <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                  Ask questions regarding hook writing, retention rates, or comparative analytics. Select a suggested prompt below to begin.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts footer */}
          {!messages?.length && (
            <div className="px-6 py-2 flex flex-wrap gap-2 shrink-0">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, p.text)}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 border border-border-light dark:border-border-dark rounded-xl text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Form input bar */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-border-light dark:border-border-dark shrink-0 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/20"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!activeConvId || sendPending}
              placeholder="Ask AI strategist..."
              className="flex-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-electric/30 transition-all font-sans placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={!activeConvId || !input.trim() || sendPending}
              className="p-3 bg-brand-electric hover:bg-brand-electric/90 text-white rounded-xl transition-all shadow-glow-electric disabled:opacity-40 shrink-0"
            >
              {sendPending ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            </button>
          </form>
        </div>

        {/* Pane 3: Context Insights & Actions Sidebar (Right) */}
        <div className="w-64 space-y-6 shrink-0 overflow-y-auto hidden lg:block">
          {/* Live Context Card */}
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-5 shadow-premium-light dark:shadow-premium-dark space-y-4">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-brand-amber animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">PulseIQ Live Insights</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-brand-coral/5 border border-brand-coral/15 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-brand-coral uppercase tracking-wider">Reach Drop Alert</span>
                <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                  Views on YouTube Tutorials dropped by 12% due to shorter retention values.
                </p>
              </div>

              <div className="p-3 bg-brand-emerald/5 border border-brand-emerald/15 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-brand-emerald uppercase tracking-wider">Best Posting Time</span>
                <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                  Your optimal posting window starts in 45m for YouTube Shorts.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl p-5 shadow-premium-light dark:shadow-premium-dark space-y-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Recommended Actions</span>
            
            <div className="space-y-2">
              <button
                onClick={() => handleSend(undefined, "Suggest a 5-bullet summary for an Instagram post describing my latest YouTube video reach.")}
                className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-border-light dark:border-border-dark rounded-xl flex items-center justify-between transition-colors group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-zinc-950 dark:text-white">Draft Promo Copy</span>
                  <p className="text-[9px] text-zinc-500">Cross-promote YouTube stats</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-electric transition-colors" />
              </button>

              <button
                onClick={() => handleSend(undefined, "Generate 3 Twitter hook formulations explaining the performance growth of our linked accounts.")}
                className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-border-light dark:border-border-dark rounded-xl flex items-center justify-between transition-colors group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-zinc-950 dark:text-white">Write Growth Tweet</span>
                  <p className="text-[9px] text-zinc-500">Build high-affinity hooks</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-electric transition-colors" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
