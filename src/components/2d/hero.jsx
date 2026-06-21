"use client";

import { motion } from 'framer-motion';
import { Play, Coins, Trophy, ArrowRight, Star, Sparkles, Brain, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/home');
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Decorative radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-ai-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald/10 border border-emerald/20 text-emerald-soft text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles size={13} className="text-emerald-soft animate-pulse" />
              <span>Free Financial Learning for Gen-Z</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-ink"
            >
              Master Your Money, <br />
              <span className="text-gradient-brand">Secure Your Future!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto lg:mx-0 max-w-xl text-base text-ink-muted sm:text-lg md:text-xl leading-relaxed"
            >
              The most premium approach to financial literacy for young Indians. Understand the magic of compounding, avoid debt traps, and make money management a fun game!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(16,185,129,0.40)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartLearning}
                className="btn-emerald flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold cursor-pointer border-b-4 border-emerald-600 hover:translate-y-[-2px] transition-all"
              >
                <Play size={18} className="fill-current text-midnight" />
                <span>Start Learning Now</span>
                <ArrowRight size={18} className="text-midnight" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/home/tools')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-ink hover:bg-white/10 transition-colors cursor-pointer border-b-2 hover:translate-y-[-2px]"
              >
                <span>Explore Tools</span>
                <ArrowUpRight size={18} className="text-ink-muted" />
              </motion.button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 pt-6 border-t border-white/5"
            >
              {[
                { icon: Coins, label: 'Earn Coins', color: 'text-gold-soft', bg: 'bg-gold/10' },
                { icon: Trophy, label: 'Unlock Badges', color: 'text-emerald-soft', bg: 'bg-emerald/10' },
                { icon: Brain, label: 'AI Advisor 24/7', color: 'text-ai-soft', bg: 'bg-ai/10' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start space-y-1.5">
                  <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-ink-muted">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Preview Dashboard column */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center w-full"
          >
            {/* Background elements */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald/20 to-ai/20 rounded-[32px] blur-xl opacity-80 pointer-events-none" />

            {/* Mock Dashboard container */}
            <div className="glass-card-premium relative w-full max-w-sm rounded-[28px] p-6 border-b-8 border-emerald-500/20 shadow-premium overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-ai/10 rounded-full blur-2xl" />

              {/* Dashboard Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald to-emerald-soft flex items-center justify-center text-midnight font-bold text-base shadow-glow-emerald">
                    R
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink">Rahul Sharma</h4>
                    <span className="text-[10px] text-emerald-soft font-semibold flex items-center gap-1">
                      <Star size={8} className="fill-current text-emerald-soft" />
                      Investing Prodigy
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-ink-muted uppercase tracking-wider font-semibold">Level</span>
                  <span className="text-sm font-extrabold text-gradient-brand">4</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/5 border border-white/8 rounded-2xl p-3 border-b-4 border-white/10 text-center flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-gold-soft mb-0.5">
                    <Coins size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="text-xs font-bold uppercase">Coins</span>
                  </div>
                  <span className="text-lg font-black text-gold-soft tabular-nums">450</span>
                </div>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-3 border-b-4 border-white/10 text-center flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-orange-400 mb-0.5">
                    <Trophy size={14} />
                    <span className="text-xs font-bold uppercase">Streak</span>
                  </div>
                  <span className="text-lg font-black text-orange-400">12 days</span>
                </div>
              </div>

              {/* Active Strategy Card */}
              <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald/10 text-emerald-soft px-2.5 py-0.5 rounded-full font-semibold border border-emerald/15">
                    Module #3 Active
                  </span>
                  <span className="text-[10px] text-ink-muted">75% Done</span>
                </div>
                <h5 className="text-sm font-bold text-ink">The Power of Compounding 🚀</h5>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald h-full rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              {/* AI Mascot Bubble */}
              <div className="bg-ai/10 border border-ai/20 rounded-2xl p-3.5 relative flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-ai/25 flex items-center justify-center flex-shrink-0 text-xs">
                  🤖
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ai-soft flex items-center gap-1">
                    AI Advisor
                  </span>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    "Allocate savings before spending your monthly income. Smart compounding is the key to building real wealth!"
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}