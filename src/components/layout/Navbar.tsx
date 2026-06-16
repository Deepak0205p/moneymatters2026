'use client';

import { useState, useMemo, useEffect, useRef, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Trophy,
  IndianRupee,
  Calculator,
  BarChart3,
  Target,
  CircleDot,
  Zap,
  PiggyBank,
  HeartPulse,
  Receipt,
  Brain,
  Newspaper,
  Type,
  ListOrdered,
  UserCheck,
  TrendingUp,
  Shield,
  Calendar,
  Construction,
  type LucideIcon,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { strategies } from '@/lib/data/strategies';
import CoinCounter from '@/components/shared/CoinCounter';
import ProgressRing from '@/components/shared/ProgressRing';
import { BadgeGallery } from '@/components/shared/BadgeGallery';
import { SIPCalculator } from '@/components/shared/SIPCalculator';
import { AchievementDashboard } from '@/components/shared/AchievementDashboard';
import { GoalTracker } from '@/components/shared/GoalTracker';
import { SpinWheel } from '@/components/shared/SpinWheel';
import { QuizArena } from '@/components/shared/QuizArena';
import SavingsChallenge from '@/components/shared/SavingsChallenge';
import ExpenseTracker from '@/components/shared/ExpenseTracker';
import HealthCheckup from '@/components/shared/HealthCheckup';
import MemoryMatch from '@/components/shared/MemoryMatch';
import WordScramble from '@/components/shared/WordScramble';
import FinancialNewsWidget from '@/components/shared/FinancialNewsWidget';
import PriorityCalculator from '@/components/shared/PriorityCalculator';
import FinancialAgeCalculator from '@/components/shared/FinancialAgeCalculator';
import InvestmentComparison from '@/components/shared/InvestmentComparison';
import EmergencyFundCalculator from '@/components/shared/EmergencyFundCalculator';
import HabitTracker from '@/components/shared/HabitTracker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Construction;
  const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
  return Icon || Construction;
}

function getAbbreviatedTitle(title: string): string {
  const abbreviations: Record<string, string> = {
    'Zindagi Ka Safar': 'Safar',
    'Paise Ka GPS': 'GPS',
    'Kya Hota Agar': 'Kya Hota',
    'Chhupa Hua Chor': 'Chor',
    'Budget Khel': 'Budget',
    'Ghar Ka Budget': 'Ghar Budget',
    'Debt Trap Ka Darwaza': 'Debt Trap',
    'Power of Compounding': 'Compound',
    'Financial Health Report Card': 'Report Card',
    'Rupaiya Dictionary': 'Dictionary',
    'Ek Din Ka Kharcha': 'Ek Din',
    'Mistake Market': 'Mistakes',
  };
  return abbreviations[title] || title;
}

// ────────────────────────────────────────────────────────────────────
// Tool registry — single source of truth for navbar tool buttons.
// Eliminates ~370 lines of repetitive per-button boilerplate.
// ────────────────────────────────────────────────────────────────────
interface ToolDef {
  id: string;
  Icon: LucideIcon;
  label: string;
  tooltip: string;
  /** Tailwind text color utility for hover */
  hover: string;
  /** Tailwind bg color utility for hover */
  hoverBg: string;
  Component: ComponentType<{ open: boolean; onClose: () => void }>;
}

const TOOLS: ToolDef[] = [
  { id: 'dashboard', Icon: BarChart3, label: 'Dashboard', tooltip: 'Dashboard', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: AchievementDashboard },
  { id: 'goals', Icon: Target, label: 'Goals', tooltip: 'Goals', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: GoalTracker },
  { id: 'health', Icon: HeartPulse, label: 'Health', tooltip: 'Health Checkup 🏥', hover: 'hover:text-rose-400', hoverBg: 'hover:bg-rose-400/10', Component: HealthCheckup },
  { id: 'expense', Icon: Receipt, label: 'Expense', tooltip: 'Kharcha Tracker 📝', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: ExpenseTracker },
  { id: 'savings', Icon: PiggyBank, label: 'Savings', tooltip: 'Bachat Challenge 💰', hover: 'hover:text-gold-soft', hoverBg: 'hover:bg-gold/10', Component: SavingsChallenge },
  { id: 'quiz', Icon: Zap, label: 'Quiz', tooltip: 'Quiz Arena ⚡', hover: 'hover:text-gold-soft', hoverBg: 'hover:bg-gold/10', Component: QuizArena },
  { id: 'spin', Icon: CircleDot, label: 'Spin', tooltip: 'Spin Wheel 🎰', hover: 'hover:text-gold-soft', hoverBg: 'hover:bg-gold/10', Component: SpinWheel },
  { id: 'memory', Icon: Brain, label: 'Memory', tooltip: 'Memory Match 🧠', hover: 'hover:text-ai-soft', hoverBg: 'hover:bg-ai/10', Component: MemoryMatch },
  { id: 'word', Icon: Type, label: 'Word', tooltip: 'Word Scramble 🔤', hover: 'hover:text-ai-soft', hoverBg: 'hover:bg-ai/10', Component: WordScramble },
  { id: 'news', Icon: Newspaper, label: 'News', tooltip: 'Financial News 📰', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: FinancialNewsWidget },
  { id: 'priority', Icon: ListOrdered, label: 'Priority', tooltip: 'Priority Calculator 📊', hover: 'hover:text-gold-soft', hoverBg: 'hover:bg-gold/10', Component: PriorityCalculator },
  { id: 'invest', Icon: TrendingUp, label: 'Invest', tooltip: 'Invest Compare 📈', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: InvestmentComparison },
  { id: 'emergency', Icon: Shield, label: 'Emergency', tooltip: 'Emergency Fund 🛡️', hover: 'hover:text-cyan-400', hoverBg: 'hover:bg-cyan-400/10', Component: EmergencyFundCalculator },
  { id: 'habit', Icon: Calendar, label: 'Habit', tooltip: 'Habit Tracker 📅', hover: 'hover:text-ai-soft', hoverBg: 'hover:bg-ai/10', Component: HabitTracker },
  { id: 'age', Icon: UserCheck, label: 'Fin Age', tooltip: 'Financial Age 🎂', hover: 'hover:text-gold-soft', hoverBg: 'hover:bg-gold/10', Component: FinancialAgeCalculator },
  { id: 'sip', Icon: Calculator, label: 'SIP', tooltip: 'SIP Calculator', hover: 'hover:text-emerald-soft', hoverBg: 'hover:bg-emerald/10', Component: SIPCalculator },
];

// Trophy/badge button is special (has a count badge) so handle separately.
// ────────────────────────────────────────────────────────────────────

export function Navbar() {
  const { activeStrategy, setActiveStrategy, coins, badges } = useAppStore();
  const { completionPercentage } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [badgeGalleryOpen, setBadgeGalleryOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const activeStrategyData = useMemo(
    () => strategies.find((s) => s.id === activeStrategy),
    [activeStrategy]
  );

  const badgeCount = useMemo(() => badges.length, [badges]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [mobileMenuOpen]);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as CustomEvent<string>;
      if (detail === 'open-dashboard') setOpenTool('dashboard');
      if (detail === 'open-goal-tracker') setOpenTool('goals');
      if (detail === 'close-dialog') {
        setOpenTool(null);
        setBadgeGalleryOpen(false);
      }
    };
    window.addEventListener('rupaiya-shortcut', handler);
    return () => window.removeEventListener('rupaiya-shortcut', handler);
  }, []);

  const closeTool = () => setOpenTool(null);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.06]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center h-14 px-3 sm:px-4 gap-2 sm:gap-3">
          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 -ml-1 text-ink-muted hover:text-emerald-soft transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                  boxShadow: '0 0 16px rgba(16,185,129,0.35), 0 4px 12px rgba(0,0,0,0.30)',
                }}
                whileHover={{
                  boxShadow: '0 0 24px rgba(16,185,129,0.55), 0 6px 16px rgba(0,0,0,0.35)',
                }}
                transition={{ duration: 0.3 }}
              >
                <IndianRupee className="w-4 h-4 text-midnight" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-lg font-extrabold tracking-tight select-none hidden sm:block">
                <span className="text-emerald-soft">RUPAIYA</span>{' '}
                <span className="text-gradient-brand">101</span>
              </h1>
            </motion.div>
          </div>

          {/* Center: Strategy tabs (desktop) */}
          <div
            ref={tabContainerRef}
            className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto mx-3 scrollbar-none tab-scroll-mask py-1"
            role="tablist"
            aria-label="Strategy tabs"
          >
            <TooltipProvider delayDuration={300}>
              {strategies.map((strategy) => {
                const Icon = getIcon(strategy.icon);
                const isActive = activeStrategy === strategy.id;
                const shortTitle = getAbbreviatedTitle(strategy.title);

                return (
                  <Tooltip key={strategy.id}>
                    <TooltipTrigger asChild>
                      <button
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`${strategy.title} — ${strategy.titleEn}`}
                        onClick={() => setActiveStrategy(strategy.id)}
                        className={`
                          relative flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                          ${isActive
                            ? 'text-emerald-soft bg-emerald/10'
                            : 'text-ink-muted hover:text-ink hover:bg-white/[0.04]'
                          }
                        `}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: strategy.color, opacity: isActive ? 1 : 0.5 }}
                        />
                        <Icon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: isActive ? strategy.color : undefined }}
                        />
                        <span className="hidden lg:inline">{shortTitle}</span>
                        <span className="lg:hidden">{strategy.id}</span>

                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, transparent, #10B981, #34D399, #10B981, transparent)',
                              boxShadow: '0 0 8px rgba(16,185,129,0.55), 0 0 16px rgba(16,185,129,0.25)',
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="glass-strong text-ink border border-white/[0.08] shadow-xl"
                    >
                      <p className="font-semibold text-emerald-soft">{strategy.title}</p>
                      <p className="text-[10px] text-ink-muted">{strategy.titleEn}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Right: Coin counter + Tools + Badge + Progress ring */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
            {/* Coin counter */}
            <motion.div
              className="relative"
              key={`coins-${coins}`}
              initial={coins > 0 ? { scale: 1 } : {}}
              animate={coins > 0 ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <CoinCounter amount={coins} showLabel={false} />
            </motion.div>

            {/* Tool buttons — data-driven */}
            <TooltipProvider delayDuration={300}>
              <div className="hidden lg:flex items-center gap-0.5">
                {TOOLS.map(({ id, Icon, tooltip, hover, hoverBg }) => (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => setOpenTool(id)}
                        className={`magnetic-hover flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted ${hover} ${hoverBg} transition-colors`}
                        aria-label={tooltip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="glass-strong text-ink border border-white/[0.08] shadow-xl"
                    >
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Mobile: compact tool grid trigger (opens a sheet-like popover via mobileMenuOpen enhancement) */}
              {/* On mobile the tools are reachable via the mobile menu below */}
            </TooltipProvider>

            {/* Badge / Trophy button — always visible */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setBadgeGalleryOpen(true)}
                    className="magnetic-hover relative flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-gold-soft hover:bg-gold/10 transition-colors"
                    aria-label={`View badges — ${badgeCount} earned`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trophy className="w-4 h-4" />
                    {badgeCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-[9px] font-bold text-midnight flex items-center justify-center">
                        {badgeCount}
                      </span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="glass-strong text-ink border border-white/[0.08] shadow-xl"
                >
                  <p>Badges ({badgeCount})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Progress ring */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default ml-0.5">
                    <ProgressRing progress={completionPercentage} size={34} strokeWidth={3} />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="glass-strong text-ink border border-white/[0.08] shadow-xl"
                >
                  <p>Progress: {completionPercentage}% complete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>

      {/* ── Tool Dialogs — rendered from the registry ── */}
      <BadgeGallery open={badgeGalleryOpen} onClose={() => setBadgeGalleryOpen(false)} />
      {TOOLS.map(({ id, Component }) => (
        <Component key={id} open={openTool === id} onClose={closeTool} />
      ))}

      {/* ── Mobile menu dropdown (strategies + tools) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
              className="fixed top-14 left-2 right-2 z-50 rounded-2xl overflow-hidden glass-strong border border-white/[0.10] shadow-2xl md:hidden"
            >
              {/* Emerald gradient header */}
              <div className="bg-gradient-to-r from-emerald/15 via-emerald/10 to-ai/10 px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-soft" />
                  <span className="text-sm font-bold text-emerald-soft">Choose Strategy</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Strategy grid */}
              <div className="max-h-[60vh] overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scroll">
                {strategies.map((strategy, index) => {
                  const Icon = getIcon(strategy.icon);
                  const isActive = activeStrategy === strategy.id;
                  return (
                    <motion.button
                      key={strategy.id}
                      onClick={() => {
                        setActiveStrategy(strategy.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center gap-2.5 p-3 min-h-[44px] rounded-xl text-left transition-all
                        ${isActive
                          ? 'bg-emerald/10 border border-emerald/25 text-emerald-soft'
                          : 'bg-white/[0.03] border border-white/[0.05] text-ink-muted hover:bg-white/[0.06] hover:text-ink'
                        }
                      `}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      aria-label={`${strategy.title} — ${strategy.titleEn}`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative"
                        style={{ backgroundColor: `${strategy.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: strategy.color }} />
                        <span
                          className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full border border-midnight"
                          style={{ backgroundColor: strategy.color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{strategy.title}</div>
                        <div className="text-[10px] text-ink-muted truncate">{strategy.titleEn}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Tools grid for mobile */}
              <div className="border-t border-white/[0.06] px-3 pt-2 pb-3">
                <p className="px-1 pb-2 text-[10px] font-semibold text-ink-muted uppercase tracking-widest">
                  Tools
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {TOOLS.map(({ id, Icon, label, hover, hoverBg }, index) => (
                    <motion.button
                      key={id}
                      onClick={() => {
                        setOpenTool(id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-ink-muted ${hover} ${hoverBg} transition-colors min-h-[56px]`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.18 }}
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px] font-medium leading-tight text-center">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
