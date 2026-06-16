"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import { ContextTutorChat } from '@/components/shared/ContextTutorChat';
import { modules, getModuleById, getAllCardsForModule } from '@/data/modulesIndex';
import type { ModuleSection } from '@/data/types';
import {
  Coins, Trophy, Flame, ChevronRight, Share2, X, Zap, Play, BookOpen,
  Clock, CheckCircle2, Sparkles, Wrench, ArrowRight, ArrowLeft, ArrowUp,
  Bookmark, FileText, Send, Trash2, Lock,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ════════════════════════════════════════════════════════════════════════════
const QUOTES = [
  'Paisa invest karo, future secure karo!',
  'Har rupee ek soldier hai — use wisely!',
  'Compounding ka jadoo samjho, aur ameer bano!',
  'Debt se bachna = financial freedom ka pehla step',
];

// ════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ════════════════════════════════════════════════════════════════════════════
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ════════════════════════════════════════════════════════════════════════════
// FINANCE TICKER
// ════════════════════════════════════════════════════════════════════════════
function FinanceTicker() {
  const messages = [
    'Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨',
    'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️',
    'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳',
    "Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉",
    'Wealth is what you don\'t see. Ameer mat dikho, ameer bano! 🕵️',
    'Pehla rule: Khud pe invest karo. Skills = Best Returns. 🎓',
  ];
  return (
    <div className="w-full bg-emerald/10 border-y border-emerald/20 py-2 overflow-hidden whitespace-nowrap relative">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 items-center"
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> {msg}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE CARD (dashboard grid — capital-mastery design)
// ════════════════════════════════════════════════════════════════════════════
function ModuleCard({
  mod,
  index,
  isUnlocked,
  isActive,
  onClick,
}: {
  mod: ModuleSection;
  index: number;
  isUnlocked: boolean;
  isActive?: boolean;
  onClick: () => void;
}) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const { moduleProgress, completedModules } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -5 : 0 }}
      className="relative group cursor-pointer rounded-[2rem] p-6 border border-white/[0.06] overflow-hidden transition-all duration-500 glass-card"
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Holographic Shine */}
      {isUnlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      )}

      {/* Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: mod.color }} />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Emoji Box with Progress Ring */}
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90">
                <circle cx="50%" cy="50%" r="45%" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.05" />
                <motion.circle cx="50%" cy="50%" r="45%" fill="none" stroke={mod.color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progressPercent / 100 }} transition={{ duration: 1.5, delay: 0.5 }} />
              </svg>
            )}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${isUnlocked ? 'shadow-lg shadow-black/20' : 'grayscale opacity-50'}`}
              style={{ backgroundColor: isUnlocked ? `${mod.color}20` : 'rgba(255,255,255,0.05)' }}
            >
              {isUnlocked ? mod.emoji : <Lock size={16} className="text-zinc-600" />}
            </div>
          </div>

          {/* Active / Completed Tags */}
          {isActive && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="px-2.5 py-1 rounded-full bg-emerald/10 border border-emerald/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-soft" />
              <span className="text-[9px] font-black text-emerald-soft uppercase tracking-tighter">Next Mission</span>
            </motion.div>
          )}
          {isCompleted && (
            <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-emerald-soft" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Mastered</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-70 mb-1 block" style={{ color: isUnlocked ? mod.color : '#94A3B8' }}>Module {mod.id}</span>
          <h3 className={`font-bold text-[16px] leading-tight mb-2 transition-colors ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>{mod.title}</h3>
          <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">{mod.description}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
            <span className="flex items-center gap-1"><BookOpen size={10} /> {cardCount} Cards</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {cardCount * 2}m</span>
          </div>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-white/5 group-hover:bg-white/10' : 'bg-transparent'}`}>
            {isUnlocked ? <ChevronRight size={14} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" /> : <X size={12} className="text-zinc-700" />}
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <div className="absolute inset-0 bg-midnight/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
          <div className="glass-strong px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <span className="text-[10px] font-bold text-zinc-400">Unlock Module {mod.id - 1} to proceed</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT TOAST
// ════════════════════════════════════════════════════════════════════════════
function AchievementToast({ onClaim }: { onClaim: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const visited = typeof window !== 'undefined' ? localStorage.getItem('firstVisit_dashboard') : null;
    if (!visited) { const timer = setTimeout(() => setShow(true), 2000); return () => clearTimeout(timer); }
  }, []);
  useEffect(() => {
    if (show) { const timer = setTimeout(() => setShow(false), 6000); return () => clearTimeout(timer); }
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="fixed bottom-6 left-6 z-40 flex items-center gap-4 rounded-2xl border border-gold/30 glass-strong p-4 shadow-2xl max-w-sm">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-ai/20 flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Achievement Unlocked!</p>
            <p className="text-xs text-gold-soft">&quot;First Login&quot; — +50 Coins</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onClaim(); setShow(false); if (typeof window !== 'undefined') localStorage.setItem('firstVisit_dashboard', 'done'); }}
            className="rounded-xl bg-gradient-to-r from-gold to-ai px-4 py-2 text-xs font-bold text-white flex-shrink-0 cursor-pointer"
          >
            Claim!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user, isAuthenticated, coins, streak, addCoins, completedModules, completeModule } = useAppStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const activeModuleIndex = modules.findIndex((m) => !completedModules.includes(m.id));

  const handleClaim = useCallback(() => { addCoins(50); }, [addCoins]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
          <p className="text-ink-muted text-sm">Loading your progress...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-midnight">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="mt-20"><FinanceTicker /></div>

        {/* Hero + Tools CTA */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card-premium">
            <Image src="/images/dashboard_hero.jpeg" alt="Dashboard background" fill className="object-cover opacity-[0.12] pointer-events-none" priority />
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Namaste, {user?.displayName?.split(' ')[0] ?? 'Champion'}!</h1>
                  <AnimatePresence mode="wait">
                    <motion.p key={quoteIndex} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="text-base text-ink-muted font-medium">&quot;{QUOTES[quoteIndex]}&quot;</motion.p>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-gold/10 px-5 py-3 border border-gold/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="p-2 rounded-xl bg-gold/20"><Coins size={20} className="text-gold-soft" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none"><AnimatedCounter target={coins} /></p>
                      <p className="text-[10px] font-bold text-gold-soft uppercase tracking-tighter">Coins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-3 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <div className="p-2 rounded-xl bg-red-500/20"><Flame size={20} className="text-red-400" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none">{streak}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative overflow-hidden rounded-3xl border border-emerald/20 glass-card-premium p-6 sm:p-8">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)', boxShadow: '0 0 20px rgba(16,185,129,0.30)' }}>
                  <Wrench size={26} className="text-midnight" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Interactive Strategies & Tools</h3>
                  <p className="text-sm text-ink-muted">11 strategies + 16 financial tools — SIP calc, expense tracker, quizzes, games aur bahut kuch!</p>
                </div>
              </div>
              <Link href="/tools">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}>
                  Tools kholo <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Module Grid (capital-mastery design) ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Financial Journey Map</h2>
              <p className="text-sm text-ink-muted mt-1 max-w-xl">Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! 🚀</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-soft animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{completedModules.length} of {modules.length} Completed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const isUnlocked = i === 0 || completedModules.includes(modules[i - 1].id);
              const isActive = i === activeModuleIndex;
              return <ModuleCard key={mod.id} mod={mod} index={i} isUnlocked={isUnlocked} isActive={isActive} onClick={() => router.push(`/dashboard/module/${mod.id}`)} />;
            })}
          </div>
        </div>

        {/* ─── Mastery Progress Panel ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card">
            <Image src="/images/progress_panel.jpeg" alt="" fill className="object-cover opacity-[0.07] pointer-events-none" />
            <div className="relative z-10 p-8">
              <h2 className="font-display text-xl font-extrabold text-white mb-6">Mastery Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {modules.map((mod) => {
                  const cardCount = getAllCardsForModule(mod.id).length;
                  const savedPercent = mod.id ? (useAppStore.getState().moduleProgress[mod.id] || 0) : 0;
                  const isCompleted = completedModules.includes(mod.id);
                  const progressPercent = isCompleted ? 100 : savedPercent;
                  return (
                    <div key={mod.id} className="group">
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-white/60 font-bold uppercase tracking-wider">Module {mod.id}: {mod.title}</span>
                        <span className="text-white/40 font-black">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/[0.03]">
                        <motion.div initial={{ width: '0%' }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full relative" style={{ backgroundColor: mod.color }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {[
              { label: 'Daily Challenge', icon: Zap, color: '#8B5CF6', action: () => router.push('/tools') },
              { label: 'Leaderboard', icon: Trophy, color: '#F59E0B', action: () => router.push('/tools') },
              { label: 'Refer a Friend', icon: Share2, color: '#38BDF8', action: () => { if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText('RUPAIYA101'); alert('Referral code copied: RUPAIYA101'); } },
              { label: 'Help Center', icon: BookOpen, color: '#10B981', action: () => router.push('/tools') },
            ].map((item) => (
              <motion.button key={item.label} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={item.action} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white whitespace-nowrap backdrop-blur-md cursor-pointer flex-shrink-0 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${item.color}20` }}><item.icon size={18} style={{ color: item.color }} /></div>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center py-12 border-t border-white/[0.03]">
            <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">Capital Mastery — Rupaiya 101</p>
            <p className="text-xs text-ink-muted mt-2">Paisa Samjho, Future Secure Karo!</p>
          </div>
        </div>
      </div>

      <AchievementToast onClaim={handleClaim} />
      <AIChatBot />
    </main>
  );
}
