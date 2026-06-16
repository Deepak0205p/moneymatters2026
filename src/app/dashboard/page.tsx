"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import {
  Coins, Trophy, Flame, ChevronRight, Award, Share2, X, TrendingUp,
  Zap, Play, BookOpen, Clock, CheckCircle2, Sparkles, Wrench, ArrowRight,
} from 'lucide-react';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import type { ModuleSection } from '@/data/types';

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ── Journey Path SVG (decorative) ────────────────────────────────────────────
function JourneyPath() {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none hidden lg:block">
      <svg width="100%" height="100%" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 100 C 400 100, 200 400, 600 400 S 800 700, 1100 700"
          stroke="#10B981"
          strokeWidth="40"
          strokeLinecap="round"
          strokeDasharray="1 80"
        />
        <path
          d="M100 100 C 400 100, 200 400, 600 400 S 800 700, 1100 700"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// ── Finance Ticker (scrolling tips) ──────────────────────────────────────────
function FinanceTicker() {
  const messages = [
    'Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨',
    'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️',
    'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳',
    'Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉',
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
          <span
            key={i}
            className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2"
          >
            <Zap size={12} fill="currentColor" /> {msg}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10" />
    </div>
  );
}

// ── Module Card ──────────────────────────────────────────────────────────────
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
  const progressPercent = isCompleted
    ? 100
    : Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100);

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
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: mod.color }}
      />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90">
                <circle cx="50%" cy="50%" r="45%" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.05" />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={mod.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progressPercent / 100 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
            )}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${
                isUnlocked ? 'shadow-lg shadow-black/20' : 'grayscale opacity-50'
              }`}
              style={{ backgroundColor: isUnlocked ? `${mod.color}20` : 'rgba(255,255,255,0.05)' }}
            >
              {isUnlocked ? mod.emoji : '🔒'}
            </div>
          </div>

          {isActive && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="px-2.5 py-1 rounded-full bg-emerald/10 border border-emerald/30 flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-soft" />
              <span className="text-[9px] font-black text-emerald-soft uppercase tracking-tighter">
                Next Mission
              </span>
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
          <span
            className="text-[9px] font-black tracking-[0.2em] uppercase opacity-40 mb-1 block"
            style={{ color: isUnlocked ? mod.color : '#fff' }}
          >
            Module {mod.id}
          </span>
          <h3
            className={`font-bold text-[16px] leading-tight mb-2 transition-colors ${
              isUnlocked ? 'text-white' : 'text-zinc-500'
            }`}
          >
            {mod.title}
          </h3>
          <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">{mod.description}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
            <span className="flex items-center gap-1">
              <BookOpen size={10} /> {cardCount} Cards
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> {cardCount * 2}m
            </span>
          </div>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isUnlocked ? 'bg-white/5 group-hover:bg-white/10' : 'bg-transparent'
            }`}
          >
            {isUnlocked ? (
              <ChevronRight
                size={14}
                className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all"
              />
            ) : (
              <X size={12} className="text-zinc-700" />
            )}
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <div className="absolute inset-0 bg-midnight/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-zinc-900/80 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <span className="text-[10px] font-bold text-zinc-400">
              Unlock Module {mod.id - 1} to proceed
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Achievement Toast ────────────────────────────────────────────────────────
function AchievementToast({ onClaim }: { onClaim: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const visited = typeof window !== 'undefined' ? localStorage.getItem('firstVisit_dashboard') : null;
    if (!visited) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-4 rounded-2xl border border-gold/30 glass-strong p-4 shadow-2xl max-w-sm"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-ai/20 flex items-center justify-center text-2xl flex-shrink-0">
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Achievement Unlocked!</p>
            <p className="text-xs text-gold-soft">&quot;First Login&quot; — +50 Coins</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onClaim();
              setShow(false);
              if (typeof window !== 'undefined') localStorage.setItem('firstVisit_dashboard', 'done');
            }}
            className="rounded-xl bg-gradient-to-r from-gold to-ai px-4 py-2 text-xs font-bold text-white flex-shrink-0 cursor-pointer"
          >
            Claim!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Module Quick-Learn Modal (simplified, no Supabase) ───────────────────────
function ModuleQuickView({ mod, onClose, onComplete }: { mod: ModuleSection; onClose: () => void; onComplete: () => void }) {
  const allCards = getAllCardsForModule(mod.id);
  const [index, setIndex] = useState(0);
  const card = allCards[index];
  const isLast = index === allCards.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card-premium rounded-3xl max-w-lg w-full p-8 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: `${mod.color}20` }} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-ink-muted hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${mod.color}20` }}>
              {mod.emoji}
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: mod.color }}>
                Module {mod.id} · Card {index + 1}/{allCards.length}
              </p>
              <h3 className="text-xl font-bold text-white">{mod.title}</h3>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 mb-6">
            {allCards.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all"
                style={{ backgroundColor: i <= index ? mod.color : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>

          <div className="min-h-[160px]">
            <h4 className="text-lg font-bold text-white mb-3">{card.title}</h4>
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{card.content}</p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="text-sm text-ink-muted hover:text-white disabled:opacity-30 transition-colors px-3 py-2"
            >
              ← Pehla
            </button>
            {isLast ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-sm text-midnight"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
              >
                <CheckCircle2 size={16} />
                Complete (+50 coins)
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIndex((i) => i + 1)}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-sm text-midnight"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
              >
                Aage <ChevronRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Dashboard Background ─────────────────────────────────────────────────────
function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight">
      <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
      <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

const QUOTES = [
  'Paisa invest karo, future secure karo!',
  'Har rupee ek soldier hai — use wisely!',
  'Compounding ka jadoo samjho, aur ameer bano!',
  'Debt se bachna = financial freedom ka pehla step',
];

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isAuthenticated, coins, streak, addCoins, completedModules, completeModule, moduleProgress } = useAppStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const activeModuleIndex = modules.findIndex((m) => !completedModules.includes(m.id));

  const handleCompleteModule = useCallback(
    (id: number) => {
      setOpenModuleId(null);
      if (!completedModules.includes(id)) {
        completeModule(id);
        addCoins(100);
      }
    },
    [completedModules, completeModule, addCoins]
  );

  // Auth guard
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/auth');
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = useCallback(() => {
    addCoins(50);
  }, [addCoins]);

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

  const openModule = openModuleId ? modules.find((m) => m.id === openModuleId) : null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DashboardBackground />

      <div className="relative z-10">
        <Navbar />
        <div className="mt-20">
          <FinanceTicker />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12 space-y-12">
          {/* ─── Hero Section ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card-premium"
          >
            <Image
              src="/images/dashboard_hero.jpeg"
              alt="Dashboard background"
              fill
              className="object-cover opacity-[0.12] pointer-events-none"
              priority
            />
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                    Namaste, {user?.displayName?.split(' ')[0] ?? 'Champion'}!
                  </h1>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-base text-ink-muted font-medium"
                    >
                      &quot;{QUOTES[quoteIndex]}&quot;
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-gold/10 px-5 py-3 border border-gold/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="p-2 rounded-xl bg-gold/20">
                      <Coins size={20} className="text-gold-soft" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white leading-none">
                        <AnimatedCounter target={coins} />
                      </p>
                      <p className="text-[10px] font-bold text-gold-soft uppercase tracking-tighter">Coins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-3 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <div className="p-2 rounded-xl bg-red-500/20">
                      <Flame size={20} className="text-red-400" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white leading-none">{streak}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Tools CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-emerald/20 glass-card-premium p-6 sm:p-8"
          >
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                    boxShadow: '0 0 20px rgba(16,185,129,0.30)',
                  }}
                >
                  <Wrench size={26} className="text-midnight" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Strategies & Tools</h3>
                  <p className="text-sm text-ink-muted">
                    12 strategies + 16 financial tools — SIP calc, expense tracker, quizzes, games aur bahut kuch!
                  </p>
                </div>
              </div>
              <Link href="/tools">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
                >
                  Tools kholo <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* ─── Module Grid ─── */}
          <div id="modules" className="space-y-6 relative">
            <JourneyPath />
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Financial Journey Map</h2>
                <p className="text-sm text-ink-muted mt-1 max-w-xl">
                  Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! 🚀
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-soft animate-pulse" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  {completedModules.length} of {modules.length} Completed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {modules.map((mod, i) => {
                const isUnlocked = i === 0 || completedModules.includes(modules[i - 1].id);
                const isActive = i === activeModuleIndex;
                return (
                  <ModuleCard
                    key={mod.id}
                    mod={mod}
                    index={i}
                    isUnlocked={isUnlocked}
                    isActive={isActive}
                    onClick={() => setOpenModuleId(mod.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* ─── Progress Panel ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card"
          >
            <Image src="/images/progress_panel.jpeg" alt="" fill className="object-cover opacity-[0.07] pointer-events-none" />
            <div className="relative z-10 p-8">
              <h2 className="text-xl font-black text-white mb-6">Mastery Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {modules.map((mod) => {
                  const cardsCount = getAllCardsForModule(mod.id).length;
                  const savedIndex = moduleProgress[mod.id] || 0;
                  const isCompleted = completedModules.includes(mod.id);
                  const progressPercent = isCompleted
                    ? 100
                    : Math.floor((savedIndex / Math.max(cardsCount - 1, 1)) * 100);
                  return (
                    <div key={mod.id} className="group">
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-white/60 font-bold uppercase tracking-wider">
                          Module {mod.id}: {mod.title}
                        </span>
                        <span className="text-white/40 font-black">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/[0.03]">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full relative"
                          style={{ backgroundColor: mod.color }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ─── Quick Actions ─── */}
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {[
              { label: 'Daily Challenge', icon: Zap, color: '#8B5CF6', action: () => router.push('/tools') },
              { label: 'Leaderboard', icon: Trophy, color: '#F59E0B', action: () => router.push('/tools') },
              { label: 'Refer a Friend', icon: Share2, color: '#38BDF8', action: () => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText('RUPAIYA101'); } alert('Referral code copied: RUPAIYA101'); } },
              { label: 'Help Center', icon: BookOpen, color: '#10B981', action: () => router.push('/tools') },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white whitespace-nowrap backdrop-blur-md cursor-pointer flex-shrink-0 transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* ─── Footer ─── */}
          <div className="text-center py-12 border-t border-white/[0.03]">
            <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">
              Capital Mastery — Rupaiya 101
            </p>
            <p className="text-xs text-ink-muted mt-2">Paisa Samjho, Future Secure Karo!</p>
          </div>
        </div>
      </div>

      {/* Module Quick View Modal */}
      <AnimatePresence>
        {openModule && (
          <ModuleQuickView
            mod={openModule}
            onClose={() => setOpenModuleId(null)}
            onComplete={() => handleCompleteModule(openModule.id)}
          />
        )}
      </AnimatePresence>

      <AchievementToast onClaim={handleClaim} />
      <AIChatBot />
    </main>
  );
}
