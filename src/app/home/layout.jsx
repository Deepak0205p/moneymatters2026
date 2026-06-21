'use client';

import { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
// Lucide Icons
import {
  LayoutDashboard,
  Film,
  MessageSquare,
  Wrench,
  User,
  Moon,
  Coins,
  Flame,
  Menu,
  X,
  Bookmark,
  ChevronRight,
  Trophy,
  Clock,
  ArrowLeft
} from "lucide-react";

import { strategies } from '@/lib/data/strategies';
import { LanguageSelector } from '@/components/LanguageSelector';

// Lazy load dialogs/widgets
const LazyGoalTracker = lazy(() => import('@/components/shared/GoalTracker'));
const LazyExpenseTracker = lazy(() => import('@/components/shared/ExpenseTracker'));
const LazySavingsChallenge = lazy(() => import('@/components/shared/SavingsChallenge'));
const LazyQuizArena = lazy(() => import('@/components/shared/QuizArena'));
const LazySpinWheel = lazy(() => import('@/components/shared/SpinWheel'));
const LazyMemoryMatch = lazy(() => import('@/components/shared/MemoryMatch'));
const LazyWordScramble = lazy(() => import('@/components/shared/WordScramble'));
const LazyFinancialNewsWidget = lazy(() => import('@/components/shared/FinancialNewsWidget'));
const LazyPriorityCalculator = lazy(() => import('@/components/shared/PriorityCalculator'));
const LazyInvestmentComparison = lazy(() => import('@/components/shared/InvestmentComparison'));
const LazyEmergencyFundCalculator = lazy(() => import('@/components/shared/EmergencyFundCalculator'));
const LazyHabitTracker = lazy(() => import('@/components/shared/HabitTracker'));
const LazyFinancialAgeCalculator = lazy(() => import('@/components/shared/FinancialAgeCalculator'));
const LazySIPCalculator = lazy(() => import('@/components/shared/SIPCalculator'));
const LazyBadgeGallery = lazy(() => import('@/components/shared/BadgeGallery'));
const LazyAchievementDashboard = lazy(() => import('@/components/shared/AchievementDashboard'));
const LazyHealthCheckup = lazy(() => import('@/components/shared/HealthCheckup'));

// Strategy simulators
const StrategyComponents = {
  "paise-ka-gps": lazy(() => import("@/components/strategies/PaiseKaGPS")),
  "budget-khel": lazy(() => import("@/components/strategies/BudgetKhel")),
  "ghar-ka-budget": lazy(() => import("@/components/strategies/GharKaBudget")),
  "mistake-market": lazy(() => import("@/components/strategies/MistakeMarket")),
  "kya-hota-agar": lazy(() => import("@/components/strategies/KyaHotaAgar")),
  "chhupa-hua-chor": lazy(() => import("@/components/strategies/ChhupaHuaChor")),
  "compounding-tree": lazy(() => import("@/components/strategies/CompoundingTree")),
  "debt-trap-darwaza": lazy(() => import("@/components/strategies/DebtTrapDarwaza")),
  "financial-health-report-card": lazy(() => import("@/components/strategies/ReportCard")),
  "rupaiya-dictionary": lazy(() => import("@/components/strategies/Dictionary")),
  "ek-din-ka-kharcha": lazy(() => import("@/components/strategies/DailySimulator"))
};

export default function HomeLayout({ children }) {
  const hydrated = useHydration();
  const router = useRouter();
  const pathname = usePathname();

  // Zustand Store
  const {
    user,
    isAuthenticated,
    coins,
    streak,
    logout,
    logActivity,
    loadFromCloud
  } = useAppStore();

  // Tab path calculation
  const activeTab = pathname.split('/').pop() || 'dashboard';

  // Navigation states
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const sideLinks = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, path: '/home/dashboard' },
    { id: 'reel', label: 'Reels', Icon: Film, path: '/home/reel' },
    { id: 'chatbot', label: 'AI Chat Bot', Icon: MessageSquare, path: '/home/chatbot' },
    { id: 'gamified', label: 'Gamified Concept', Icon: Trophy, path: '/home/gamified' },
    { id: 'tools', label: 'Learning Tools', Icon: Wrench, path: '/home/tools' },
    { id: 'history', label: 'Learning History', Icon: Clock, path: '/home/history' },
    { id: 'profile', label: 'Profile', Icon: User, path: '/home/profile' }
  ];

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (hydrated && isAuthenticated && user?.uid) {
      loadFromCloud();
    }
  }, [hydrated, isAuthenticated, user?.uid]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090D1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading Money Matters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070913] text-zinc-100 overflow-x-hidden font-sans">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => { setIsSidebarHovered(false); setShowMoreMenu(false); }}
          className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-[#090D1A]/90 backdrop-blur-xl border-r border-white/[0.05] p-5 z-40 transition-all duration-300 ease-in-out ${
            isSidebarHovered ? 'w-64 lg:w-72 shadow-2xl border-white/[0.08]' : 'w-20'
          }`}
        >
          <Link href="/home/dashboard" className={`flex items-center mb-8 px-2 group transition-all ${isSidebarHovered ? 'gap-3' : 'justify-center px-0'}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            {isSidebarHovered && (
              <span className="text-xl font-bold font-display tracking-tight text-white whitespace-nowrap">
                Money<span className="text-emerald-400"> Matters</span>
              </span>
            )}
          </Link>

          <nav className="flex-1 flex flex-col justify-center space-y-2">
            {sideLinks.map(link => {
              const Icon = link.Icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { router.push(link.path); setShowMoreMenu(false); }}
                  className={`w-full flex items-center rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                    isSidebarHovered ? 'justify-start gap-4 px-4 py-3' : 'justify-center p-3'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-indigo-500/5 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                  title={!isSidebarHovered ? link.label : undefined}
                >
                  <Icon size={20} className={`shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  {isSidebarHovered && <span className="truncate whitespace-nowrap">{link.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="relative mt-auto">
            <AnimatePresence>
              {showMoreMenu && isSidebarHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-12 left-0 w-full bg-[#0D1326] border border-white/[0.08] rounded-2xl p-2.5 shadow-2xl z-50 space-y-1"
                >
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <span className="text-xs font-semibold">Theme</span>
                    <button
                      className="flex items-center gap-1.5 p-1 rounded-md bg-white/5 border border-white/10"
                    >
                      <Moon size={14} className="text-emerald-400" />
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Dark</span>
                    </button>
                  </div>

                  <button
                    onClick={() => { router.push('/home/bookmarks'); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                  >
                    <Bookmark size={15} />
                    Bookmarks
                  </button>

                  <div className="h-px bg-white/5 my-1" />

                  <button
                    onClick={async () => { await signOut(auth); logout(); router.replace('/'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    Log Out
                  </button>
                 </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full flex items-center rounded-xl text-left text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-all duration-200 ${
                isSidebarHovered ? 'justify-start gap-4 px-4 py-3' : 'justify-center p-3'
              }`}
              title={!isSidebarHovered ? "More" : undefined}
            >
              <Menu size={20} className="shrink-0" />
              {isSidebarHovered && <span>More</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE TOP HEADER */}
        <header className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#090D1A]/95 backdrop-blur-xl border-b border-white/[0.05] px-4 flex items-center justify-between z-40">
          <Link href="/home/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-base font-bold font-display tracking-tight text-white">
              Money<span className="text-emerald-400"> Matters</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-1">
              <Coins size={12} className="text-amber-400" />
              <span className="font-bold text-amber-400 text-xs">{coins}</span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1">
              <Flame size={12} className="text-orange-400" />
              <span className="font-bold text-orange-400 text-xs">{streak}d</span>
            </div>

            <LanguageSelector variant="compact" />
          </div>
        </header>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#090D1A]/95 backdrop-blur-xl border-t border-white/[0.05] grid grid-cols-7 items-center justify-center z-40">
          {sideLinks.map(link => {
            const Icon = link.Icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { router.push(link.path); setShowMoreMenu(false); }}
                className="flex flex-col items-center justify-center h-full text-zinc-400 relative"
              >
                <Icon size={20} className={isActive ? 'text-emerald-400 scale-110' : 'text-zinc-400 hover:text-zinc-200'} />
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className={`flex-1 flex flex-col min-w-0 pb-16 md:pb-0 transition-all duration-300 ease-in-out ${
          isSidebarHovered ? 'md:ml-64 lg:ml-72' : 'md:ml-20'
        }`}>
          {/* Desktop Top Header Bar */}
          <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-white/[0.05] bg-[#090D1A]/50 backdrop-blur-md sticky top-0 z-30">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
                {activeTab === 'dashboard' ? 'Home' : activeTab}
              </h2>
            </div>

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 border-b-2 shadow-sm shadow-amber-400/5">
                <span className="font-extrabold text-amber-400 text-sm leading-none mr-0.5">₹</span>
                <span className="font-bold text-amber-400 text-sm tabular-nums">{coins}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 border-b-2 shadow-sm shadow-orange-500/5">
                <Flame size={14} className="text-orange-400" />
                <span className="font-bold text-orange-400 text-xs">{streak} Days</span>
              </div>

              <LanguageSelector variant="compact" />

              <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
                <span className="text-xs font-semibold text-zinc-300">
                  {user?.displayName?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={() => router.push('/home/profile')}
                  className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm"
                >
                  🦊
                </button>
              </div>
            </div>
          </header>

          {/* Children Viewport */}
          <div className={`flex-1 mt-16 md:mt-0 ${activeTab === 'chatbot' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto px-4 py-6 md:p-8'}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Dialog Manager for modals/simulators */}
      <Suspense fallback={null}>
        <DialogManager />
      </Suspense>
    </div>
  );
}

function DialogManager() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { logActivity } = useAppStore();

  const openTool = searchParams.get('tool');
  const activeStrategySlug = searchParams.get('strategy');

  const lastLoggedTool = useRef(null);
  const lastLoggedStrategy = useRef(null);

  useEffect(() => {
    if (openTool && lastLoggedTool.current !== openTool) {
      let toolName = openTool;
      let logType = 'strategy';
      if (openTool === 'spin') { toolName = 'Gamified Concept: Spin the Wheel'; logType = 'module_section'; }
      else if (openTool === 'memory') { toolName = 'Gamified Concept: Memory Match'; logType = 'module_section'; }
      else if (openTool === 'quiz') { toolName = 'Gamified Concept: Quiz Arena'; logType = 'module_section'; }
      else toolName = `${openTool} tool`;

      logActivity(logType, `Used ${toolName}`, 0);
      lastLoggedTool.current = openTool;
    }
  }, [openTool, logActivity]);

  useEffect(() => {
    if (activeStrategySlug && lastLoggedStrategy.current !== activeStrategySlug) {
      logActivity('strategy', `Started strategy simulator: ${activeStrategySlug}`, 0);
      lastLoggedStrategy.current = activeStrategySlug;
    }
  }, [activeStrategySlug, logActivity]);

  const closeTool = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tool');
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeStrategy = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('strategy');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* ACTIVE TOOL DIALOGS */}
      <AnimatePresence>
        {openTool && (
          <Suspense fallback={
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          }>
            {openTool === 'goals' && <LazyGoalTracker open={true} onClose={closeTool} />}
            {openTool === 'expense' && <LazyExpenseTracker open={true} onClose={closeTool} />}
            {openTool === 'savings' && <LazySavingsChallenge open={true} onClose={closeTool} />}
            {openTool === 'quiz' && <LazyQuizArena open={true} onClose={closeTool} />}
            {openTool === 'spin' && <LazySpinWheel open={true} onClose={closeTool} />}
            {openTool === 'memory' && <LazyMemoryMatch open={true} onClose={closeTool} />}
            {openTool === 'word' && <LazyWordScramble open={true} onClose={closeTool} />}
            {openTool === 'news' && <LazyFinancialNewsWidget open={true} onClose={closeTool} />}
            {openTool === 'priority' && <LazyPriorityCalculator open={true} onClose={closeTool} />}
            {openTool === 'invest' && <LazyInvestmentComparison open={true} onClose={closeTool} />}
            {openTool === 'emergency' && <LazyEmergencyFundCalculator open={true} onClose={closeTool} />}
            {openTool === 'habit' && <LazyHabitTracker open={true} onClose={closeTool} />}
            {openTool === 'age' && <LazyFinancialAgeCalculator open={true} onClose={closeTool} />}
            {openTool === 'sip' && <LazySIPCalculator open={true} onClose={closeTool} />}
            {openTool === 'badges' && <LazyBadgeGallery open={true} onClose={closeTool} />}
            {openTool === 'achievement' && <LazyAchievementDashboard open={true} onClose={closeTool} />}
            {openTool === 'health' && <LazyHealthCheckup open={true} onClose={closeTool} />}
          </Suspense>
        )}
      </AnimatePresence>

      {/* STRATEGY SIMULATOR VIEWER */}
      <AnimatePresence>
        {activeStrategySlug && (
          <div className="fixed inset-0 z-[120] bg-[#070913] flex flex-col">
            <div className="shrink-0 bg-[#0C0F1E] border-b border-white/[0.06] px-5 py-3 flex items-center gap-3">
              <button
                onClick={closeStrategy}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Back"
              >
                <ArrowLeft size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
                <Suspense fallback={
                  <div className="flex h-40 items-center justify-center">
                    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  </div>
                }>
                  {(() => {
                    const Comp = StrategyComponents[activeStrategySlug];
                    return Comp ? <Comp /> : <p className="text-zinc-400">Loading strategy component...</p>;
                  })()}
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
