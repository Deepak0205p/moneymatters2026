'use client';

import { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Heart, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PageContainer } from '@/components/layout/PageContainer';
import { WelcomeOnboarding } from '@/components/shared/WelcomeOnboarding';
import { FinanceAdvisor } from '@/components/shared/FinanceAdvisor';
import ThemeToggle from '@/components/shared/ThemeToggle';
import KeyboardShortcutsDialog from '@/components/shared/KeyboardShortcutsDialog';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { strategies } from '@/lib/data/strategies';

// Lazy load strategy components for better performance
const LifePathMap = lazy(() => import('@/components/strategies/LifePathMap'));
const FinancialGPS = lazy(() => import('@/components/strategies/FinancialGPS'));
const ConsequenceSim = lazy(() => import('@/components/strategies/ConsequenceSim'));
const InflationMonster = lazy(() => import('@/components/strategies/InflationMonster'));
const SwipeBudget = lazy(() => import('@/components/strategies/SwipeBudget'));
const RoomBudget = lazy(() => import('@/components/strategies/RoomBudget'));
const DebtDoors = lazy(() => import('@/components/strategies/DebtDoors'));
const CompoundingTree = lazy(() => import('@/components/strategies/CompoundingTree'));
const ReportCard = lazy(() => import('@/components/strategies/ReportCard'));
const Dictionary = lazy(() => import('@/components/strategies/Dictionary'));
const DailySimulator = lazy(() => import('@/components/strategies/DailySimulator'));
const MistakeMarket = lazy(() => import('@/components/strategies/MistakeMarket'));

function StrategyLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#a0a0b8] text-sm font-medium">Loading strategy...</p>
      </div>
    </div>
  );
}

function renderStrategy(activeStrategy: number) {
  const StrategyComponent = ({ id, children }: { id: number; children: React.ReactNode }) => (
    <PageContainer strategyId={id}>{children}</PageContainer>
  );

  switch (activeStrategy) {
    case 1:
      return (
        <StrategyComponent id={1}>
          <Suspense fallback={<StrategyLoading />}>
            <LifePathMap />
          </Suspense>
        </StrategyComponent>
      );
    case 2:
      return (
        <StrategyComponent id={2}>
          <Suspense fallback={<StrategyLoading />}>
            <FinancialGPS />
          </Suspense>
        </StrategyComponent>
      );
    case 3:
      return (
        <StrategyComponent id={3}>
          <Suspense fallback={<StrategyLoading />}>
            <ConsequenceSim />
          </Suspense>
        </StrategyComponent>
      );
    case 4:
      return (
        <StrategyComponent id={4}>
          <Suspense fallback={<StrategyLoading />}>
            <InflationMonster />
          </Suspense>
        </StrategyComponent>
      );
    case 5:
      return (
        <StrategyComponent id={5}>
          <Suspense fallback={<StrategyLoading />}>
            <SwipeBudget />
          </Suspense>
        </StrategyComponent>
      );
    case 6:
      return (
        <StrategyComponent id={6}>
          <Suspense fallback={<StrategyLoading />}>
            <RoomBudget />
          </Suspense>
        </StrategyComponent>
      );
    case 7:
      return (
        <StrategyComponent id={7}>
          <Suspense fallback={<StrategyLoading />}>
            <DebtDoors />
          </Suspense>
        </StrategyComponent>
      );
    case 8:
      return (
        <StrategyComponent id={8}>
          <Suspense fallback={<StrategyLoading />}>
            <CompoundingTree />
          </Suspense>
        </StrategyComponent>
      );
    case 9:
      return (
        <StrategyComponent id={9}>
          <Suspense fallback={<StrategyLoading />}>
            <ReportCard />
          </Suspense>
        </StrategyComponent>
      );
    case 10:
      return (
        <StrategyComponent id={10}>
          <Suspense fallback={<StrategyLoading />}>
            <Dictionary />
          </Suspense>
        </StrategyComponent>
      );
    case 11:
      return (
        <StrategyComponent id={11}>
          <Suspense fallback={<StrategyLoading />}>
            <DailySimulator />
          </Suspense>
        </StrategyComponent>
      );
    case 12:
      return (
        <StrategyComponent id={12}>
          <Suspense fallback={<StrategyLoading />}>
            <MistakeMarket />
          </Suspense>
        </StrategyComponent>
      );
    default:
      return (
        <StrategyComponent id={1}>
          <Suspense fallback={<StrategyLoading />}>
            <LifePathMap />
          </Suspense>
        </StrategyComponent>
      );
  }
}

// App Footer
function AppFooter() {
  return (
    <footer className="app-footer relative py-8 px-4 md:ml-72" role="contentinfo">
      {/* Ambient glow behind footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        {/* Top section with logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
              <IndianRupee className="w-4 h-4 text-[#0a0a0f]" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold">
              <span className="text-amber-400">RUPAIYA</span>{' '}
              <span className="text-gradient-gold">101</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-[#6666a0]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400/50" />
              Financial Literacy for Everyone
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-400" /> for Indian Youth
            </span>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {['12 Strategies', 'Story Mode', 'Quiz Arena', 'Memory Match', 'SIP Calculator', 'Health Checkup', 'Expense Tracker', 'Savings Challenge', 'AI Advisor', 'Word Scramble', 'Financial News', 'Priority Calculator', 'Financial Age', 'Invest Compare', 'Emergency Fund', 'Habit Tracker'].map((feature) => (
            <span
              key={feature}
              className="tag-hover px-2.5 py-1 rounded-full text-[9px] font-medium bg-white/[0.03] border border-white/[0.05] text-[#a0a0b8]"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Animated divider */}
        <div className="divider-animated mb-4" />
        <div className="flex items-center justify-between text-[9px] text-[#5555a0]">
          <span>© {new Date().getFullYear()} Rupaiya 101 — Seekho, Bachao, Badhao</span>
          <span className="hidden md:inline">Paise ki samajh, sabse badi taakat</span>
        </div>
      </div>
    </footer>
  );
}

// Mobile bottom navigation bar
function MobileBottomNav() {
  const { activeStrategy, setActiveStrategy } = useAppStore();

  // Show 5 key strategies in bottom nav
  const bottomNavItems = [
    strategies[0],  // LifePathMap
    strategies[2],  // ConsequenceSim
    strategies[4],  // SwipeBudget
    strategies[7],  // CompoundingTree
    strategies[8],  // ReportCard
  ];

  const navEmojis: Record<number, string> = {
    1: '🗺️',
    3: '🤔',
    5: '💳',
    8: '🌳',
    9: '📝',
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#12121a]/95 backdrop-blur-md border-t border-white/[0.06] safe-area-bottom"
      role="navigation"
      aria-label="Mobile bottom navigation"
      style={{ boxShadow: '0 -1px 12px rgba(245,158,11,0.06)' }}
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="flex items-center justify-around h-14 px-1">
        {bottomNavItems.map((strategy) => {
          const isActive = activeStrategy === strategy.id;
          return (
            <motion.button
              key={strategy.id}
              onClick={() => setActiveStrategy(strategy.id)}
              className={`
                mobile-nav-item
                flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg min-w-[48px] min-h-[44px] transition-colors
                ${isActive ? 'active text-amber-400 mobile-nav-active-line' : 'text-[#8888a0]'}
              `}
              whileTap={{ scale: 0.9 }}
              aria-label={strategy.title}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="text-sm leading-none"
                style={{
                  filter: isActive ? `drop-shadow(0 0 4px ${strategy.color})` : 'none',
                }}
              >
                {navEmojis[strategy.id] || strategy.title.charAt(0)}
              </span>
              <span className="text-[9px] font-semibold leading-tight truncate max-w-[56px]">
                {strategy.title.split(' ').slice(0, 2).join(' ')}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default function Home() {
  const { activeStrategy, incrementStreak, setActiveStrategy } = useAppStore();
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  // Check daily streak on mount
  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  // Keyboard shortcut callbacks
  const handleSwitchStrategy = useCallback((strategyNumber: number) => {
    setActiveStrategy(strategyNumber);
  }, [setActiveStrategy]);

  const handleOpenShortcutsHelp = useCallback(() => {
    setKeyboardShortcutsOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setKeyboardShortcutsOpen(false);
  }, []);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onSwitchStrategy: handleSwitchStrategy,
    onOpenShortcutsHelp: handleOpenShortcutsHelp,
    onCloseDialog: handleCloseDialog,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-[#e8e8ed] overflow-x-hidden">
      <WelcomeOnboarding />
      <Navbar />
      {/* Theme Toggle — fixed top-right below navbar */}
      <div className="fixed top-[62px] right-3 z-40">
        <ThemeToggle />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-16 md:pb-0 ambient-glow bg-texture-dots">
          {renderStrategy(activeStrategy)}
        </main>
      </div>
      <AppFooter />
      <MobileBottomNav />
      <FinanceAdvisor />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={keyboardShortcutsOpen}
        onClose={() => setKeyboardShortcutsOpen(false)}
      />
    </div>
  );
}
