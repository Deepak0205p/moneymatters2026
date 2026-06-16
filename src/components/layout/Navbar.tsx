'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, IndianRupee, Calculator, BarChart3, Target, CircleDot, Zap, PiggyBank, HeartPulse, Receipt, Brain, Newspaper, Type, ListOrdered, UserCheck, TrendingUp, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Construction } from 'lucide-react';
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
import { Shield, Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Dynamically get a Lucide icon by name string
function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Construction;
  const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
  return Icon || Construction;
}

// Abbreviated titles for tabs
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

// Badge gallery dialog state
function useBadgeGalleryOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// SIP calculator dialog state
function useSIPCalculatorOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Achievement dashboard dialog state
function useAchievementDashboardOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Goal tracker dialog state
function useGoalTrackerOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Spin wheel dialog state
function useSpinWheelOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Quiz Arena dialog state
function useQuizArenaOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Savings Challenge dialog state
function useSavingsChallengeOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Expense Tracker dialog state
function useExpenseTrackerOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Health Checkup dialog state
function useHealthCheckupOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Memory Match dialog state
function useMemoryMatchOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Financial News dialog state
function useFinancialNewsOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Word Scramble dialog state
function useWordScrambleOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Priority Calculator dialog state
function usePriorityCalculatorOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Investment Comparison dialog state
function useInvestmentComparisonOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Emergency Fund Calculator dialog state
function useEmergencyFundOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Habit Tracker dialog state
function useHabitTrackerOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

// Financial Age Calculator dialog state
function useFinancialAgeCalculatorOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen } as const;
}

export function Navbar() {
  const { activeStrategy, setActiveStrategy, coins, badges } = useAppStore();
  const { completionPercentage } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open: badgeGalleryOpen, setOpen: setBadgeGalleryOpen } = useBadgeGalleryOpen();
  const { open: sipCalculatorOpen, setOpen: setSIPCalculatorOpen } = useSIPCalculatorOpen();
  const { open: achievementDashboardOpen, setOpen: setAchievementDashboardOpen } = useAchievementDashboardOpen();
  const { open: goalTrackerOpen, setOpen: setGoalTrackerOpen } = useGoalTrackerOpen();
  const { open: spinWheelOpen, setOpen: setSpinWheelOpen } = useSpinWheelOpen();
  const { open: quizArenaOpen, setOpen: setQuizArenaOpen } = useQuizArenaOpen();
  const { open: savingsChallengeOpen, setOpen: setSavingsChallengeOpen } = useSavingsChallengeOpen();
  const { open: expenseTrackerOpen, setOpen: setExpenseTrackerOpen } = useExpenseTrackerOpen();
  const { open: healthCheckupOpen, setOpen: setHealthCheckupOpen } = useHealthCheckupOpen();
  const { open: memoryMatchOpen, setOpen: setMemoryMatchOpen } = useMemoryMatchOpen();
  const { open: wordScrambleOpen, setOpen: setWordScrambleOpen } = useWordScrambleOpen();
  const { open: financialNewsOpen, setOpen: setFinancialNewsOpen } = useFinancialNewsOpen();
  const { open: priorityCalculatorOpen, setOpen: setPriorityCalculatorOpen } = usePriorityCalculatorOpen();
  const { open: financialAgeOpen, setOpen: setFinancialAgeOpen } = useFinancialAgeCalculatorOpen();
  const { open: investmentComparisonOpen, setOpen: setInvestmentComparisonOpen } = useInvestmentComparisonOpen();
  const { open: emergencyFundOpen, setOpen: setEmergencyFundOpen } = useEmergencyFundOpen();
  const { open: habitTrackerOpen, setOpen: setHabitTrackerOpen } = useHabitTrackerOpen();
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Memoized computed values
  const activeStrategyData = useMemo(
    () => strategies.find((s) => s.id === activeStrategy),
    [activeStrategy]
  );

  const badgeCount = useMemo(() => badges.length, [badges]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [mobileMenuOpen]);

  // Listen for custom shortcut events from keyboard shortcuts hook
  useEffect(() => {
    const handler = (e: Event) => {
      const { detail } = e as CustomEvent<string>;
      if (detail === 'open-dashboard') setAchievementDashboardOpen(true);
      if (detail === 'open-goal-tracker') setGoalTrackerOpen(true);
      if (detail === 'close-dialog') {
        setAchievementDashboardOpen(false);
        setGoalTrackerOpen(false);
        setSIPCalculatorOpen(false);
        setSpinWheelOpen(false);
        setQuizArenaOpen(false);
        setSavingsChallengeOpen(false);
        setExpenseTrackerOpen(false);
        setHealthCheckupOpen(false);
        setMemoryMatchOpen(false);
        setWordScrambleOpen(false);
        setBadgeGalleryOpen(false);
        setFinancialNewsOpen(false);
        setPriorityCalculatorOpen(false);
        setFinancialAgeOpen(false);
        setInvestmentComparisonOpen(false);
        setEmergencyFundOpen(false);
        setHabitTrackerOpen(false);
      }
    };
    window.addEventListener('rupaiya-shortcut', handler);
    return () => window.removeEventListener('rupaiya-shortcut', handler);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/[0.06]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-11 h-11 -ml-2 text-[#8888a0] hover:text-amber-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo with ₹ favicon */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg"
                whileHover={{
                  boxShadow: '0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.2)',
                }}
                transition={{ duration: 0.3 }}
              >
                <IndianRupee className="w-4 h-4 text-[#0a0a0f]" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-lg font-extrabold tracking-tight select-none">
                <span className="text-amber-400">RUPAIYA</span>{' '}
                <span className="text-gradient-gold">101</span>
              </h1>
            </motion.div>
          </div>

          {/* Center: Strategy tabs (desktop) */}
          <div
            ref={tabContainerRef}
            className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto mx-4 scrollbar-none tab-scroll-mask py-1"
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
                          relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                          ${isActive
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-[#8888a0] hover:text-[#e8e8ed] hover:bg-white/[0.04]'
                          }
                        `}
                      >
                        {/* Colored dot indicator */}
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

                        {/* Glowing gold bottom border for active tab */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)',
                              boxShadow: '0 0 8px rgba(245,158,11,0.6), 0 0 16px rgba(245,158,11,0.3)',
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08] shadow-xl"
                    >
                      <p className="font-semibold text-amber-400">{strategy.title}</p>
                      <p className="text-[10px] text-[#8888a0]">{strategy.titleEn}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Right: Coin counter + Badge + Progress ring */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
            {/* Coin counter with bounce */}
            <motion.div
              className="relative"
              key={`coins-${coins}`}
              initial={coins > 0 ? { scale: 1 } : {}}
              animate={coins > 0 ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <CoinCounter amount={coins} showLabel={false} />
            </motion.div>

            {/* Dashboard button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setAchievementDashboardOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Achievement Dashboard"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Goals / Target button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setGoalTrackerOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Goal Tracker"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Target className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Goals</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Health Checkup button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setHealthCheckupOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                    aria-label="Health Checkup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HeartPulse className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Health Checkup 🏥</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Expense Tracker button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setExpenseTrackerOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                    aria-label="Expense Tracker"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Receipt className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Kharcha Tracker 📝</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Savings Challenge button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setSavingsChallengeOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Savings Challenge"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PiggyBank className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Bachat Challenge 💰</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Quiz Arena button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setQuizArenaOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Quiz Arena"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Quiz Arena ⚡</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Spin Wheel button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setSpinWheelOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Spin Wheel"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CircleDot className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Spin Wheel 🎰</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Memory Match button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setMemoryMatchOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Memory Match"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Brain className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Memory Match 🧠</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Word Scramble button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setWordScrambleOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Word Scramble"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Type className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Word Scramble 🔤</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Financial News button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setFinancialNewsOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Financial News"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Newspaper className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Financial News 📰</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Priority Calculator button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setPriorityCalculatorOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Priority Calculator"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ListOrdered className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Priority Calculator 📊</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Investment Comparison button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setInvestmentComparisonOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                    aria-label="Investment Comparison"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Invest Compare 📈</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Emergency Fund Calculator button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setEmergencyFundOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                    aria-label="Emergency Fund Calculator"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shield className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Emergency Fund 🛡️</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Habit Tracker button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setHabitTrackerOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-violet-400 hover:bg-violet-400/10 transition-colors"
                    aria-label="Habit Tracker"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Habit Tracker 📅</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Financial Age button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setFinancialAgeOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="Financial Age"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserCheck className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Financial Age 🎂</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Calculator / SIP button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setSIPCalculatorOpen(true)}
                    className="magnetic-hover flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label="SIP Calculator"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calculator className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>SIP Calculator</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Badge / Trophy button */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setBadgeGalleryOpen(true)}
                    className="magnetic-hover relative flex items-center justify-center w-10 h-10 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    aria-label={`View badges — ${badgeCount} earned`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trophy className="w-4 h-4" />
                    {badgeCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-[#0a0a0f] flex items-center justify-center">
                        {badgeCount}
                      </span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Badges ({badgeCount})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Progress ring with hover label */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-default">
                    <ProgressRing progress={completionPercentage} size={36} strokeWidth={3} />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#1a1a2e] text-[#e8e8ed] border border-white/[0.08]"
                >
                  <p>Progress: {completionPercentage}% complete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>

      {/* Badge Gallery Dialog */}
      <AnimatePresence>
        {badgeGalleryOpen && (
          <BadgeGallery open={badgeGalleryOpen} onClose={() => setBadgeGalleryOpen(false)} />
        )}
      </AnimatePresence>

      {/* SIP Calculator Dialog */}
      <SIPCalculator open={sipCalculatorOpen} onClose={() => setSIPCalculatorOpen(false)} />

      {/* Achievement Dashboard Dialog */}
      <AchievementDashboard open={achievementDashboardOpen} onClose={() => setAchievementDashboardOpen(false)} />

      {/* Goal Tracker Dialog */}
      <GoalTracker open={goalTrackerOpen} onClose={() => setGoalTrackerOpen(false)} />

      {/* Spin Wheel Dialog */}
      <SpinWheel open={spinWheelOpen} onClose={() => setSpinWheelOpen(false)} />

      {/* Quiz Arena Dialog */}
      <QuizArena open={quizArenaOpen} onClose={() => setQuizArenaOpen(false)} />

      {/* Savings Challenge Dialog */}
      <SavingsChallenge open={savingsChallengeOpen} onClose={() => setSavingsChallengeOpen(false)} />

      {/* Expense Tracker Dialog */}
      <ExpenseTracker open={expenseTrackerOpen} onClose={() => setExpenseTrackerOpen(false)} />

      {/* Health Checkup Dialog */}
      <HealthCheckup open={healthCheckupOpen} onClose={() => setHealthCheckupOpen(false)} />

      {/* Memory Match Dialog */}
      <MemoryMatch open={memoryMatchOpen} onClose={() => setMemoryMatchOpen(false)} />

      {/* Word Scramble Dialog */}
      <WordScramble open={wordScrambleOpen} onClose={() => setWordScrambleOpen(false)} />

      {/* Financial News Widget Dialog */}
      <FinancialNewsWidget open={financialNewsOpen} onClose={() => setFinancialNewsOpen(false)} />

      {/* Priority Calculator Dialog */}
      <PriorityCalculator open={priorityCalculatorOpen} onClose={() => setPriorityCalculatorOpen(false)} />

      {/* Financial Age Calculator Dialog */}
      <FinancialAgeCalculator open={financialAgeOpen} onClose={() => setFinancialAgeOpen(false)} />

      {/* Investment Comparison Dialog */}
      <InvestmentComparison open={investmentComparisonOpen} onClose={() => setInvestmentComparisonOpen(false)} />

      {/* Emergency Fund Calculator Dialog */}
      <EmergencyFundCalculator open={emergencyFundOpen} onClose={() => setEmergencyFundOpen(false)} />

      {/* Habit Tracker Dialog */}
      <HabitTracker open={habitTrackerOpen} onClose={() => setHabitTrackerOpen(false)} />

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
              className="fixed top-14 left-2 right-2 z-50 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl md:hidden"
            >
              {/* Gold gradient header */}
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">Choose Strategy</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Strategy grid */}
              <div className="bg-[#12121a]/98 backdrop-blur-md max-h-[70vh] overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          ? 'bg-amber-400/10 border border-amber-500/20 text-amber-400'
                          : 'bg-white/[0.02] border border-white/[0.04] text-[#8888a0] hover:bg-white/[0.05] hover:text-[#e8e8ed]'
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
                        {/* Color dot indicator */}
                        <span
                          className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full border border-[#12121a]"
                          style={{ backgroundColor: strategy.color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{strategy.title}</div>
                        <div className="text-[10px] text-[#8888a0] truncate">{strategy.titleEn}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
