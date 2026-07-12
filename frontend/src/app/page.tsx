'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      title: 'Real-time Unified Metrics',
      desc: 'Unify YouTube, Instagram, TikTok, LinkedIn, and Twitter in under 60 seconds. View aggregated graphs in one central command center.',
      icon: TrendingUp,
      color: 'text-brand-electric bg-brand-electric/5 border-brand-electric/15',
    },
    {
      title: 'Gemini Contextual AI',
      desc: 'Let AI analyze your actual analytics history to explain engagement spikes, write engaging post hooks, and suggest relevant hashtags.',
      icon: Sparkles,
      color: 'text-brand-violet bg-brand-violet/5 border-brand-violet/15',
    },
    {
      title: 'Content Planner',
      desc: 'Design, draft, and schedule posts across multiple accounts using a visual drag-and-drop calendar.',
      icon: Calendar,
      color: 'text-brand-emerald bg-brand-emerald/5 border-brand-emerald/15',
    },
    {
      title: 'Competitor Matrix',
      desc: 'Track and audit your competitors. Compare posting intervals, follow rates, and generate comparative AI performance audits.',
      icon: Users,
      color: 'text-brand-coral bg-brand-coral/5 border-brand-coral/15',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free Starter',
      price: 0,
      desc: 'Perfect for solo creators starting their digital channel journey.',
      features: ['Connect 1 platform profile', 'Basic 7-day analytics metrics', 'Weekly AI content ideas (3)', 'Standard calendar support'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'PulseIQ Pro',
      price: billingCycle === 'annually' ? 29 : 39,
      desc: 'For professional marketers, creators, and growing startup teams.',
      features: ['Connect unlimited platform profiles', 'Unlimited historical analytics indexing', 'Contextual Gemini AI Assistant chat', 'Competitor benchmarking dashboard', 'Export CSV/PDF analytics reports', 'Daily automated background sync'],
      cta: 'Go Pro Now',
      popular: true,
    },
    {
      name: 'Enterprise Hub',
      price: billingCycle === 'annually' ? 89 : 99,
      desc: 'For digital agencies managing broad client portfolios.',
      features: ['Everything in Pro tier', 'Dedicated Redis background queues', 'White-labeled PDF export templates', 'BullMQ custom retry priority jobs', 'API access integrations', '24/7 Priority support access'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faqItems = [
    {
      q: 'How does the Gemini AI Assistant analyze my data?',
      a: 'PulseIQ reads your database analytics (likes, shares, reach, post timing) and compiles them into a structured context window. When you prompt the assistant, it sends this metadata to Google Gemini, returning recommendations tailored directly to your accounts.',
    },
    {
      q: 'Do I need actual API keys to test the platform?',
      a: 'No! If you do not enter real OAuth tokens, the platform defaults to a simulated Developer Mode. This connects mock channels and populates 30 days of metrics so you can test all features instantly.',
    },
    {
      q: 'Can I reschedule scheduled content via drag-and-drop?',
      a: 'Yes, our visual Content Calendar supports dragging and dropping posts between days, which automatically updates the backend schedule and syncs publication times.',
    },
  ];

  return (
    <div className="bg-background-dark text-zinc-100 min-h-screen font-sans selection:bg-brand-electric/30 overflow-x-hidden relative">
      {/* Premium background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-electric/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[80vh] left-1/4 w-[600px] h-[400px] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Navigation Header */}
      <header className="border-b border-border-dark sticky top-0 bg-background-dark/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center border border-border-dark text-brand-electric shadow-glow-electric shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12h3l3-9 4 18 3-12 1 3h4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="21" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-white">
                PulseIQ
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 hover:bg-zinc-900 rounded-xl text-xs font-semibold transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl text-xs font-bold transition-all shadow-premium-light">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Massive Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-electric/10 border border-brand-electric/20 text-brand-electric text-[10px] font-bold tracking-wider uppercase rounded-full shadow-glow-electric">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Analytics Console</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white tracking-tight leading-[1.1]">
            Transform Social Data Into <span className="gradient-text-electric">Intelligent Decisions.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            PulseIQ is an operating-system-like command center that unifies your digital channels, maps metrics growth, and guides your content strategy with contextual Google Gemini AI.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 pt-4">
          <Link href="/sign-up" className="px-6 py-3 bg-brand-electric hover:bg-brand-electric/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-glow-electric">
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="px-6 py-3 bg-zinc-900/60 hover:bg-zinc-800 border border-border-dark rounded-xl text-xs font-semibold transition-colors">
            Explore Features
          </a>
        </div>

        {/* Floating Analytics Previews */}
        <div className="pt-16 max-w-5xl mx-auto animate-slide-up relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10" />
          <div className="bg-card-dark border border-border-dark rounded-2xl p-6 shadow-premium-dark text-left space-y-6">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-border-dark pb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-zinc-500 font-mono ml-2">pulseiq-workspace-v1.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-zinc-900 border border-border-dark rounded text-[9px] font-bold text-brand-electric uppercase tracking-wider">
                  Live Preview
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900/50 border border-border-dark/60 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Aggregated Audience</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">616,200</span>
                  <span className="text-[10px] text-brand-emerald font-bold">+8.4%</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-electric w-[78%]" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-border-dark/60 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Avg Engagement Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">5.5%</span>
                  <span className="text-[10px] text-brand-emerald font-bold">+0.45%</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-violet w-[62%]" />
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-border-dark/60 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Overnight Sync Status</span>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-emerald">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>BullMQ Workers Synchronized</span>
                </div>
                <p className="text-[10px] text-zinc-500">All channels fetched successfully 15m ago.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-dark/50 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-extrabold text-white">
            Built For Premium Creators & Marketers
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-medium">
            PulseIQ cuts through typical metric clutter, delivering precise graphs, predictions, and calendar utilities in an award-winning layout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-card-dark border border-border-dark rounded-2xl space-y-4 hover:border-zinc-700 transition-all duration-300 shadow-premium-dark"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-zinc-450 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-dark/50 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-display font-extrabold text-white">Sleek, Transparent Plans</h2>
          <p className="text-zinc-400 text-xs md:text-sm font-medium">Choose the tier that matches your channel growth scaling.</p>
          
          <div className="inline-flex items-center gap-1.5 p-1 bg-zinc-900 border border-border-dark rounded-xl mx-auto shrink-0">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                billingCycle === 'annually' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Annually <span className="text-brand-electric font-extrabold">(-25%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl bg-card-dark border ${
                plan.popular ? 'border-brand-electric shadow-glow-electric' : 'border-border-dark'
              } flex flex-col justify-between space-y-6 relative overflow-hidden`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 bg-brand-electric text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                  Recommended
                </span>
              )}
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{plan.name}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-bold text-white">${plan.price}</span>
                  <span className="text-xs text-zinc-500">/month</span>
                </div>
                <p className="text-xs text-zinc-400 font-semibold leading-relaxed">{plan.desc}</p>
                <div className="border-t border-border-dark/60 pt-4 space-y-2.5">
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/sign-up"
                className={`w-full py-3 text-center rounded-xl text-xs font-bold transition-all block ${
                  plan.popular
                    ? 'bg-brand-electric hover:bg-brand-electric/90 text-white shadow-glow-electric'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border border-border-dark'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Center */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-border-dark/50 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-zinc-400 text-xs md:text-sm font-medium">Everything you need to know about the PulseIQ engine.</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-card-dark/60 border border-border-dark rounded-2xl space-y-2 cursor-pointer hover:border-zinc-700 transition-all"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{item.q}</span>
                <HelpCircle className="w-4.5 h-4.5 text-zinc-500 shrink-0" />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-zinc-400 font-semibold leading-relaxed pt-2 border-t border-border-dark/40 animate-fade-in">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branded By Youssef Manssouri */}
      <footer className="border-t border-border-dark py-12 bg-background-dark relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center border border-border-dark text-brand-electric">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12h3l3-9 4 18 3-12 1 3h4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="13" cy="21" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-white">PulseIQ</span>
          </div>

          <div className="text-xs text-zinc-500 font-bold tracking-tight">
            Created By Youssef Manssouri
          </div>

          <p className="text-xs text-zinc-650 font-semibold">
            &copy; {new Date().getFullYear()} PulseIQ Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
