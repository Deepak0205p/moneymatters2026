"use client";

import { useState, Suspense, lazy, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import { strategies } from '@/lib/data/strategies';
import {
  ArrowLeft, X, Sparkles, Wrench, Brain, Calculator, TrendingUp, Target,
  Trophy, Zap, Brain as BrainIcon, Type, Newspaper, ListOrdered, UserCheck,
  Shield, Calendar, HeartPulse, Receipt, PiggyBank, CircleDot, Coins, BookOpen,
  type LucideIcon,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Construction } from 'lucide-react';

// ── Strategy components (lazy) ───────────────────────────────────────────────
// Note: "Zindagi Ka Safar" (LifePathMap) has been removed per user request.
const StrategyComponents: Record<number, React.LazyExoticComponent<React.ComponentType>> = {
  2: lazy(() => import('@/components/strategies/FinancialGPS')),
  3: lazy(() => import('@/components/strategies/ConsequenceSim')),
  4: lazy(() => import('@/components/strategies/InflationMonster')),
  5: lazy(() => import('@/components/strategies/SwipeBudget')),
  6: lazy(() => import('@/components/strategies/RoomBudget')),
  7: lazy(() => import('@/components/strategies/DebtDoors')),
  8: lazy(() => import('@/components/strategies/CompoundingTree')),
  9: lazy(() => import('@/components/strategies/ReportCard')),
  10: lazy(() => import('@/components/strategies/Dictionary')),
  11: lazy(() => import('@/components/strategies/DailySimulator')),
  12: lazy(() => import('@/components/strategies/MistakeMarket')),
};

// ── Tools registry ───────────────────────────────────────────────────────────
import { AchievementDashboard } from '@/components/shared/AchievementDashboard';
import { GoalTracker } from '@/components/shared/GoalTracker';
import HealthCheckup from '@/components/shared/HealthCheckup';
import ExpenseTracker from '@/components/shared/ExpenseTracker';
import SavingsChallenge from '@/components/shared/SavingsChallenge';
import { QuizArena } from '@/components/shared/QuizArena';
import { SpinWheel } from '@/components/shared/SpinWheel';
import MemoryMatch from '@/components/shared/MemoryMatch';
import WordScramble from '@/components/shared/WordScramble';
import FinancialNewsWidget from '@/components/shared/FinancialNewsWidget';
import PriorityCalculator from '@/components/shared/PriorityCalculator';
import InvestmentComparison from '@/components/shared/InvestmentComparison';
import EmergencyFundCalculator from '@/components/shared/EmergencyFundCalculator';
import HabitTracker from '@/components/shared/HabitTracker';
import FinancialAgeCalculator from '@/components/shared/FinancialAgeCalculator';
import { SIPCalculator } from '@/components/shared/SIPCalculator';
import { BadgeGallery } from '@/components/shared/BadgeGallery';

interface ToolDef {
  id: string;
  Icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  Component: React.ComponentType<{ open: boolean; onClose: () => void }>;
}

const TOOLS: ToolDef[] = [
  { id: 'achievement', Icon: Trophy, label: 'Achievement Dashboard', description: 'Apni achievements aur milestones dekho', color: '#F59E0B', Component: AchievementDashboard },
  { id: 'goals', Icon: Target, label: 'Goal Tracker', description: 'Financial goals set karo aur track karo', color: '#10B981', Component: GoalTracker },
  { id: 'health', Icon: HeartPulse, label: 'Health Checkup', description: 'Financial health ka quick checkup', color: '#F43F5E', Component: HealthCheckup },
  { id: 'expense', Icon: Receipt, label: 'Expense Tracker', description: 'Monthly kharcha track karo', color: '#10B981', Component: ExpenseTracker },
  { id: 'savings', Icon: PiggyBank, label: 'Savings Challenge', description: 'Bachat challenge accept karo', color: '#F59E0B', Component: SavingsChallenge },
  { id: 'quiz', Icon: Zap, label: 'Quiz Arena', description: 'Finance quiz khelo aur seekho', color: '#F59E0B', Component: QuizArena },
  { id: 'spin', Icon: CircleDot, label: 'Spin Wheel', description: 'Daily spin se coins jeeto', color: '#F59E0B', Component: SpinWheel },
  { id: 'memory', Icon: BrainIcon, label: 'Memory Match', description: 'Finance terms memory game', color: '#8B5CF6', Component: MemoryMatch },
  { id: 'word', Icon: Type, label: 'Word Scramble', description: 'Finance terms unscramble karo', color: '#8B5CF6', Component: WordScramble },
  { id: 'news', Icon: Newspaper, label: 'Financial News', description: 'Latest finance news padho', color: '#10B981', Component: FinancialNewsWidget },
  { id: 'priority', Icon: ListOrdered, label: 'Priority Calculator', description: 'Kharcha priority set karo', color: '#F59E0B', Component: PriorityCalculator },
  { id: 'invest', Icon: TrendingUp, label: 'Investment Comparison', description: 'FD/PPF/MF/Gold compare karo', color: '#10B981', Component: InvestmentComparison },
  { id: 'emergency', Icon: Shield, label: 'Emergency Fund', description: 'Emergency fund calculator', color: '#38BDF8', Component: EmergencyFundCalculator },
  { id: 'habit', Icon: Calendar, label: 'Habit Tracker', description: 'Daily financial habits track karo', color: '#8B5CF6', Component: HabitTracker },
  { id: 'age', Icon: UserCheck, label: 'Financial Age', description: 'Apna financial age calculate karo', color: '#F59E0B', Component: FinancialAgeCalculator },
  { id: 'sip', Icon: Calculator, label: 'SIP Calculator', description: 'SIP returns calculate karo', color: '#10B981', Component: SIPCalculator },
  { id: 'badges', Icon: Trophy, label: 'Badge Gallery', description: 'Apne badges dekho', color: '#F59E0B', Component: BadgeGallery },
];

function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Construction;
  const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
  return Icon || Construction;
}

function StrategyLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
    </div>
  );
}

// ── Strategy Viewer (full-screen overlay) ────────────────────────────────────
function StrategyViewer({ strategyId, onClose }: { strategyId: number; onClose: () => void }) {
  const Strategy = StrategyComponents[strategyId];
  const strategy = strategies.find((s) => s.id === strategyId);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-midnight flex flex-col"
    >
      {/* Top bar */}
      <div className="shrink-0 glass-strong border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-ink-muted hover:text-emerald-soft transition-colors px-3 py-2 rounded-lg"
            aria-label="Back to tools"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Tools</span>
          </button>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2 min-w-0">
            {strategy && (
              <>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: strategy.color }}
                />
                <h2 className="text-sm font-bold text-white truncate">{strategy.title}</h2>
                <span className="text-[10px] text-ink-muted hidden sm:inline truncate">
                  — {strategy.titleEn}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-ink-muted hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      {/* Strategy content */}
      <div className="flex-1 overflow-y-auto custom-scroll ambient-glow bg-texture-dots">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          <Suspense fallback={<StrategyLoading />}>
            {Strategy ? <Strategy /> : <div className="text-ink-muted">Strategy not found.</div>}
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}

// ── Tools Page ───────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const { isAuthenticated, coins, badges } = useAppStore();
  const [activeStrategy, setActiveStrategy] = useState<number | null>(null);
  const [openTool, setOpenTool] = useState<string | null>(null);

  const toolCount = useMemo(() => TOOLS.length + strategies.length, []);
  const openToolDef = TOOLS.find((t) => t.id === openTool);

  // Auth guard (soft — allow viewing but suggest login)
  if (hydrated && !isAuthenticated) {
    return (
      <main className="relative min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="glass-card-premium rounded-3xl p-8 max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
          >
            <Wrench size={28} className="text-midnight" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tools kholne ke liye login karo</h1>
          <p className="text-sm text-ink-muted mb-6">
            Apni progress save karne aur coins earn karne ke liye pehle login karo.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/auth"
              className="rounded-xl px-5 py-3 font-bold text-sm text-midnight"
              style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
            >
              Login / Signup
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-sm text-white hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-midnight">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald/10 border border-emerald/20 px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-emerald-soft" />
              <span className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest">
                {toolCount} Interactive Resources
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-gradient-brand">Strategies & Tools</span>
            </h1>
            <p className="text-ink-muted max-w-2xl mx-auto">
              11 interactive strategies + 16 financial tools — SIP calculator, expense tracker, quizzes,
              games, AI advisor aur bahut kuch. Sab kuch Hinglish mein!
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-2">
              <Coins size={15} className="text-gold-soft" />
              <span className="text-sm font-bold text-ink tabular-nums">{coins}</span>
              <span className="text-[10px] font-semibold text-gold-soft/70 uppercase tracking-wider">Coins</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald/10 border border-emerald/20 px-4 py-2">
              <Trophy size={15} className="text-emerald-soft" />
              <span className="text-sm font-bold text-ink tabular-nums">{badges.length}</span>
              <span className="text-[10px] font-semibold text-emerald-soft/70 uppercase tracking-wider">Badges</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-white/10 hover:border-emerald/20 transition-colors"
            >
              <BookOpen size={15} className="text-emerald-soft" />
              Dashboard
            </Link>
          </motion.div>

          {/* ── Strategies Section ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
              >
                <Brain size={20} className="text-midnight" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Interactive Strategies</h2>
                <p className="text-xs text-ink-muted">11 visual + gamified financial learning experiences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategies.map((strategy, i) => {
                const Icon = getIcon(strategy.icon);
                return (
                  <motion.button
                    key={strategy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveStrategy(strategy.id)}
                    className="group relative text-left rounded-3xl p-5 border border-white/[0.06] glass-card card-shine overflow-hidden"
                  >
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundColor: strategy.color }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${strategy.color}20`, boxShadow: `0 0 14px ${strategy.color}20` }}
                        >
                          <Icon size={22} style={{ color: strategy.color }} />
                        </div>
                        <span
                          className="text-[9px] font-black px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${strategy.color}20`, color: strategy.color }}
                        >
                          {String(strategy.id).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="font-bold text-white mb-1 group-hover:text-emerald-soft transition-colors">
                        {strategy.title}
                      </h3>
                      <p className="text-[11px] text-ink-muted line-clamp-2 mb-3">{strategy.titleEn}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: strategy.color }}
                        >
                          {strategy.priority} priority
                        </span>
                        <span className="text-[10px] text-ink-muted group-hover:text-emerald-soft transition-colors flex items-center gap-1">
                          Kholo <Zap size={10} />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* ── Tools Section ─── */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #A78BFA, #8B5CF6 60%, #6D28D9)' }}
              >
                <Wrench size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Financial Tools</h2>
                <p className="text-xs text-ink-muted">Calculators, trackers, games aur more</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {TOOLS.map((tool, i) => {
                const Icon = tool.Icon;
                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpenTool(tool.id)}
                    className="group relative text-left rounded-2xl p-4 border border-white/[0.06] glass-card card-shine overflow-hidden"
                  >
                    <div
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundColor: tool.color }}
                    />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${tool.color}20`, boxShadow: `0 0 14px ${tool.color}20` }}
                      >
                        <Icon size={20} style={{ color: tool.color }} />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1 line-clamp-1">{tool.label}</h3>
                      <p className="text-[10px] text-ink-muted line-clamp-2 leading-tight">
                        {tool.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8 border-t border-white/[0.03]">
            <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">
              Capital Mastery — Tools Hub
            </p>
          </div>
        </div>
      </div>

      {/* Strategy viewer overlay */}
      <AnimatePresence>
        {activeStrategy !== null && (
          <StrategyViewer strategyId={activeStrategy} onClose={() => setActiveStrategy(null)} />
        )}
      </AnimatePresence>

      {/* Tool dialogs */}
      {openToolDef && (
        <openToolDef.Component open={true} onClose={() => setOpenTool(null)} />
      )}

      <AIChatBot />
    </main>
  );
}
