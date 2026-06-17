"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import { ContextTutorChat } from '@/components/shared/ContextTutorChat';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import {
  Coins, Trophy, Flame, ChevronRight, Zap, BookOpen, Target, Brain,
  Wrench, ArrowRight, Lock, CheckCircle2, Sparkles, Clock,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════
const QUOTES = [
  'Paisa invest karo, future secure karo! 🚀',
  'Har rupee ek soldier hai — use wisely! 🪖',
  'Compounding ka jadoo samjho, aur ameer bano! ✨',
  'Debt se bachna = financial freedom ka pehla step 🛡️',
];

const QUICK_TOOLS = [
  { id: 'goals', label: 'Goals', emoji: '🎯', color: '#10B981' },
  { id: 'expense', label: 'Kharcha', emoji: '🧾', color: '#F59E0B' },
  { id: 'quiz', label: 'Quiz', emoji: '🧠', color: '#8B5CF6' },
  { id: 'spin', label: 'Spin', emoji: '🎡', color: '#EF4444' },
  { id: 'memory', label: 'Memory', emoji: '🃏', color: '#06B6D4' },
  { id: 'health', label: 'Checkup', emoji: '🩺', color: '#EC4899' },
] as const;

// ════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ════════════════════════════════════════════════════════════════════════════
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1100;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString('en-IN')}</span>;
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
// FINANCIAL HEALTH SCORE GAUGE — speedometer-style emerald gauge
// ════════════════════════════════════════════════════════════════════════════
function HealthScoreGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (score / 100) * circumference;

  const grade = score >= 75 ? 'Fit 💪' : score >= 50 ? 'Average 🤔' : 'ICU mein hai 🏥';
  const gradeColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background arc */}
        <path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((t) => {
          const angle = Math.PI - (t / 100) * Math.PI;
          const x1 = 100 + Math.cos(angle) * (radius + 12);
          const y1 = 110 - Math.sin(angle) * (radius + 12);
          const x2 = 100 + Math.cos(angle) * (radius + 6);
          const y2 = 110 - Math.sin(angle) * (radius + 6);
          return (
            <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          );
        })}
      </svg>
      <div className="absolute top-6 flex flex-col items-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="font-display text-4xl font-extrabold text-white"
          style={{ textShadow: `0 0 24px ${gradeColor}80` }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">/ 100</span>
      </div>
      <div className="mt-1 px-3 py-1 rounded-full" style={{ backgroundColor: `${gradeColor}20`, border: `1px solid ${gradeColor}40` }}>
        <span className="text-xs font-bold" style={{ color: gradeColor }}>{grade}</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STAT CARD — 2x2 grid component
// ════════════════════════════════════════════════════════════════════════════
function StatCard({
  emoji, label, value, accent, sub, children, delay,
}: {
  emoji: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
  sub?: string;
  children?: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="card-3d glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group"
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60" style={{ backgroundColor: accent }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest mb-1">{label}</p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-none">{value}</p>
          {sub && <p className="text-[10px] font-bold mt-1.5" style={{ color: accent }}>{sub}</p>}
        </div>
        <div className="text-3xl sm:text-4xl" style={{ filter: `drop-shadow(0 0 8px ${accent}80)` }}>{emoji}</div>
      </div>
      {children && <div className="relative mt-3">{children}</div>}
    </motion.div>
  );
}

// Mini circular progress ring for module stat card
function MiniRing({ percent, color }: { percent: number; color: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
      <motion.circle
        cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (percent / 100) * c }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE CARD — for module grid
// ════════════════════════════════════════════════════════════════════════════
function ModuleCard({
  mod, index, isUnlocked, isActive, onClick,
}: {
  mod: typeof modules[number];
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
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -5 : 0 }}
      className={`relative group cursor-pointer rounded-2xl p-5 border border-white/[0.06] overflow-hidden transition-all duration-500 glass-card card-3d ${isUnlocked ? 'unlocked' : 'locked'}`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: mod.color }} />
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-3">
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
          {isActive && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="px-2 py-1 rounded-full bg-emerald/10 border border-emerald/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-soft" />
              <span className="text-[9px] font-black text-emerald-soft uppercase">Next</span>
            </motion.div>
          )}
          {isCompleted && (
            <div className="px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-soft" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Done</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase mb-1 block" style={{ color: isUnlocked ? mod.color : '#94A3B8' }}>Module {mod.id}</span>
          <h3 className={`font-bold text-base leading-tight mb-1.5 ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>{mod.title}</h3>
          <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">{mod.description}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
            <span className="flex items-center gap-1"><BookOpen size={10} /> {cardCount} Cards</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {cardCount * 2}m</span>
          </div>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-white/5 group-hover:bg-white/10' : 'bg-transparent'}`}>
            {isUnlocked ? <ChevronRight size={14} className="text-zinc-400 group-hover:text-white transition-all" /> : <Lock size={12} className="text-zinc-700" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RECENT ACTIVITY FEED
// ════════════════════════════════════════════════════════════════════════════
function buildActivityFeed(state: ReturnType<typeof useAppStore.getState>) {
  const items: { id: string; icon: string; text: string; time: string; color: string }[] = [];

  // Module completions
  Object.entries(state.moduleCompletionDates || {}).forEach(([modId, date]) => {
    const mod = modules.find((m) => m.id === Number(modId));
    if (mod) items.push({
      id: `mod-${modId}`,
      icon: mod.emoji,
      text: `Module ${modId} complete kiya — "${mod.title}"`,
      time: date,
      color: mod.color,
    });
  });

  // Health checkup
  if (state.healthCheckup?.completedAt) {
    items.push({
      id: 'health',
      icon: '🩺',
      text: `Financial checkup kiya — Score: ${state.healthCheckup.score}/100`,
      time: state.healthCheckup.completedAt,
      color: '#EC4899',
    });
  }

  // Recent goals
  state.goals.slice(-2).reverse().forEach((g) => {
    items.push({
      id: `goal-${g.id}`,
      icon: g.emoji,
      text: `Naya goal set kiya — "${g.name}"`,
      time: g.createdAt,
      color: '#10B981',
    });
  });

  // Spin wheel wins
  if (state.totalSpins > 0) {
    items.push({
      id: 'spin',
      icon: '🎡',
      text: `${state.totalSpins} baar spin kiya, ${state.spinWinnings} coins jeete`,
      time: new Date().toISOString().split('T')[0],
      color: '#F59E0B',
    });
  }

  // Savings challenge
  if (state.savingsChallenge?.isActive) {
    items.push({
      id: 'savings-challenge',
      icon: '🔥',
      text: `Bachat challenge Day ${state.savingsChallenge.days.filter((d) => d.saved).length}/${state.savingsChallenge.days.length} pe chal raha hai`,
      time: state.savingsChallenge.startDate,
      color: '#EF4444',
    });
  }

  // Sort by date desc, take 5
  return items.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
}

function RecentActivity() {
  const state = useAppStore();
  const items = useMemo(() => buildActivityFeed(state), [state]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2 opacity-40">📭</div>
        <p className="text-sm text-ink-muted">Abhi koi activity nahi. Tools try karo aur yahan dikhao! 🚀</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 hover:bg-white/[0.06] transition-colors"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{item.text}</p>
            <p className="text-[10px] text-ink-muted mt-0.5">{item.time}</p>
          </div>
          <ChevronRight size={14} className="text-ink-muted/50 flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user, isAuthenticated, coins, streak, completedModules, badges, addCoins, healthCheckup, moduleProgress } = useAppStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const activeModuleIndex = modules.findIndex((m) => !completedModules.includes(m.id));
  const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round((completedCards / totalCards) * 100)) : 0;

  // Financial Health Score = weighted aggregate
  const healthScore = useMemo(() => {
    const moduleScore = (completedModules.length / modules.length) * 40;
    const progressScore = (overallProgress / 100) * 30;
    const checkupScore = healthCheckup ? (healthCheckup.score / 100) * 20 : 5;
    const coinScore = Math.min(10, coins / 50);
    return Math.min(100, Math.round(moduleScore + progressScore + checkupScore + coinScore));
  }, [completedModules.length, overallProgress, healthCheckup, coins]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length), 4500);
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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Subah ki shubhkamnayein';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const activeCardCount = activeModule ? getAllCardsForModule(activeModule.id).length : 0;
  const activeProgress = activeModule ? Math.round(((moduleProgress[activeModule.id] || 0) / Math.max(activeCardCount - 1, 1)) * 100) : 0;

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

        {/* ═══ HERO ═══ */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 glass-card-premium p-6 sm:p-8"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-emerald/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-soft uppercase tracking-widest mb-2">{greeting} 👋</p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-2">
                  Kya haal hai, {user?.displayName?.split(' ')[0] ?? 'Champion'}! 🔥
                </h1>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-sm text-ink-muted font-medium"
                  >
                    &quot;{QUOTES[quoteIndex]}&quot;
                  </motion.p>
                </AnimatePresence>
              </div>
              {/* Health Score Gauge */}
              <div className="glass-card rounded-2xl p-4 flex-shrink-0">
                <HealthScoreGauge score={healthScore} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══ 2x2 STAT CARDS ═══ */}
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              delay={0.05}
              emoji={<span className="coin-spin-3d inline-block">🪙</span>}
              label="Total Coins"
              value={<AnimatedCounter target={coins} />}
              accent="#F59E0B"
              sub={coins >= 500 ? 'Big saver energy 💰' : 'Aur kamao! 🚀'}
            />
            <StatCard
              delay={0.12}
              emoji={<span>🔥</span>}
              label="Streak"
              value={`${streak} din`}
              accent="#EF4444"
              sub={streak > 0 ? 'Lagatar jaari rakho! 💪' : 'Aaj shuru karo!'}
            />
            <StatCard
              delay={0.19}
              emoji={<span>📚</span>}
              label="Modules"
              value={`${completedModules.length}/${modules.length}`}
              accent="#10B981"
              sub={`${overallProgress}% overall`}
            >
              <div className="absolute bottom-3 right-3">
                <MiniRing percent={overallProgress} color="#10B981" />
              </div>
            </StatCard>
            <StatCard
              delay={0.26}
              emoji={<span>🏆</span>}
              label="Badges"
              value={badges.length}
              accent="#8B5CF6"
              sub={badges.length > 0 ? 'Trophy case bharte ja! ⭐' : 'Pehla badge kamao!'}
            />
          </div>
        </div>

        {/* ═══ CONTINUE LEARNING CTA ═══ */}
        {activeModule && (
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-emerald/20 glass-card-glow p-5 sm:p-6 spotlight-card"
            >
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: activeModule.color }} />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: `${activeModule.color}25`, border: `1px solid ${activeModule.color}40` }}
                >
                  {activeModule.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-emerald-soft uppercase tracking-widest mb-1">Continue Learning</p>
                  <h3 className="font-display text-lg font-bold text-white mb-1 truncate">{activeModule.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden max-w-xs">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${activeProgress}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${activeModule.color}, #34D399)` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white">{activeProgress}%</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push(`/dashboard/module/${activeModule.id}`)}
                  className="btn-3d rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
                >
                  Aage Badho <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══ QUICK ACCESS GRID ═══ */}
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Zap size={18} className="text-gold-soft" /> Quick Access
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {QUICK_TOOLS.map((tool, i) => (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/tools')}
                  className="card-3d glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${tool.color}20`, border: `1px solid ${tool.color}30` }}
                  >
                    {tool.emoji}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-white">{tool.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ MODULE GRID ═══ */}
        <div className="mx-auto max-w-6xl px-4 pt-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">Financial Journey Map 🗺️</h2>
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

        {/* ═══ RECENT ACTIVITY FEED ═══ */}
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 glass-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-ai" /> Recent Activity
              </h2>
              <Link href="/tools" className="text-xs font-bold text-emerald-soft hover:underline flex items-center gap-1">
                All tools <ChevronRight size={12} />
              </Link>
            </div>
            <RecentActivity />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/[0.03]">
          <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">Capital Mastery — Rupaiya 101</p>
          <p className="text-xs text-ink-muted mt-2">Paisa Samjho, Future Secure Karo! 💚</p>
        </div>
      </div>

      <AIChatBot />
      <ContextTutorChat />
    </main>
  );
}
