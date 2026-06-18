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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LifePathMap = /*#__PURE__*/lazy(() => import('@/components/strategies/LifePathMap'));
const FinancialGPS = /*#__PURE__*/lazy(() => import('@/components/strategies/FinancialGPS'));
const ConsequenceSim = /*#__PURE__*/lazy(() => import('@/components/strategies/ConsequenceSim'));
const InflationMonster = /*#__PURE__*/lazy(() => import('@/components/strategies/InflationMonster'));
const SwipeBudget = /*#__PURE__*/lazy(() => import('@/components/strategies/SwipeBudget'));
const RoomBudget = /*#__PURE__*/lazy(() => import('@/components/strategies/RoomBudget'));
const DebtDoors = /*#__PURE__*/lazy(() => import('@/components/strategies/DebtDoors'));
const CompoundingTree = /*#__PURE__*/lazy(() => import('@/components/strategies/CompoundingTree'));
const ReportCard = /*#__PURE__*/lazy(() => import('@/components/strategies/ReportCard'));
const Dictionary = /*#__PURE__*/lazy(() => import('@/components/strategies/Dictionary'));
const DailySimulator = /*#__PURE__*/lazy(() => import('@/components/strategies/DailySimulator'));
const MistakeMarket = /*#__PURE__*/lazy(() => import('@/components/strategies/MistakeMarket'));
const STRATEGY_COMPONENTS = {
  1: LifePathMap,
  2: FinancialGPS,
  3: ConsequenceSim,
  4: InflationMonster,
  5: SwipeBudget,
  6: RoomBudget,
  7: DebtDoors,
  8: CompoundingTree,
  9: ReportCard,
  10: Dictionary,
  11: DailySimulator,
  12: MistakeMarket
};
function StrategyLoading() {
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-center justify-center min-h-[60vh]",
    children: /*#__PURE__*/_jsxs("div", {
      className: "text-center",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-12 h-12 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin mx-auto mb-4"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-ink-muted text-sm font-medium",
        children: "Loading strategy..."
      })]
    })
  });
}
function renderStrategy(activeStrategy) {
  const StrategyComponent = STRATEGY_COMPONENTS[activeStrategy] ?? LifePathMap;
  return /*#__PURE__*/_jsx(PageContainer, {
    strategyId: activeStrategy,
    children: /*#__PURE__*/_jsx(Suspense, {
      fallback: /*#__PURE__*/_jsx(StrategyLoading, {}),
      children: /*#__PURE__*/_jsx(StrategyComponent, {})
    })
  });
}
const FOOTER_FEATURES = ['12 Strategies', 'Story Mode', 'Quiz Arena', 'Memory Match', 'SIP Calculator', 'Health Checkup', 'Expense Tracker', 'Savings Challenge', 'AI Advisor', 'Word Scramble', 'Financial News', 'Priority Calculator', 'Financial Age', 'Invest Compare', 'Emergency Fund', 'Habit Tracker'];

// App Footer — sticky to bottom, premium glassmorphism
function AppFooter() {
  return /*#__PURE__*/_jsxs("footer", {
    className: "app-footer relative py-8 px-4 md:ml-72 mt-auto",
    role: "contentinfo",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-gradient-to-t from-emerald/[0.03] to-transparent pointer-events-none"
    }), /*#__PURE__*/_jsxs("div", {
      className: "max-w-4xl mx-auto relative",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex flex-col md:flex-row items-center justify-between gap-4 mb-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2.5",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-8 h-8 rounded-xl flex items-center justify-center",
            style: {
              background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
              boxShadow: '0 0 14px rgba(16,185,129,0.30)'
            },
            children: /*#__PURE__*/_jsx(IndianRupee, {
              className: "w-4 h-4 text-midnight",
              strokeWidth: 2.5
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "text-base font-bold text-emerald-soft",
            children: "Money Matters"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-4 text-[10px] text-ink-muted",
          children: [/*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-3 h-3 text-emerald/60"
            }), "Financial Literacy for Everyone"]
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden md:inline",
            children: "\u2022"
          }), /*#__PURE__*/_jsxs("span", {
            className: "hidden md:flex items-center gap-1",
            children: ["Made with ", /*#__PURE__*/_jsx(Heart, {
              className: "w-3 h-3 text-rose-400"
            }), " for Indian Youth"]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex flex-wrap items-center justify-center gap-2 mb-5",
        children: FOOTER_FEATURES.map(feature => /*#__PURE__*/_jsx("span", {
          className: "tag-hover px-2.5 py-1 rounded-full text-[9px] font-medium bg-white/[0.04] border border-white/[0.06] text-ink-muted",
          children: feature
        }, feature))
      }), /*#__PURE__*/_jsx("div", {
        className: "divider-animated mb-4"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between text-[9px] text-ink-muted/70",
        children: [/*#__PURE__*/_jsxs("span", {
          children: ["\xA9 ", new Date().getFullYear(), " Money Matters \u2014 Seekho, Bachao, Badhao"]
        }), /*#__PURE__*/_jsx("span", {
          className: "hidden md:inline",
          children: "Paise ki samajh, sabse badi taakat"
        })]
      })]
    })]
  });
}

// Mobile bottom navigation bar
function MobileBottomNav() {
  const {
    activeStrategy,
    setActiveStrategy
  } = useAppStore();
  const bottomNavItems = [strategies[0],
  // LifePathMap
  strategies[2],
  // ConsequenceSim
  strategies[4],
  // SwipeBudget
  strategies[7],
  // CompoundingTree
  strategies[8] // ReportCard
  ];
  const navEmojis = {
    1: '🗺️',
    3: '🤔',
    5: '💳',
    8: '🌳',
    9: '📝'
  };
  return /*#__PURE__*/_jsxs("nav", {
    className: "md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/[0.06] safe-area-bottom",
    role: "navigation",
    "aria-label": "Mobile bottom navigation",
    style: {
      boxShadow: '0 -1px 12px rgba(16,185,129,0.06)'
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent"
    }), /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-around h-14 px-1",
      children: bottomNavItems.map(strategy => {
        const isActive = activeStrategy === strategy.id;
        return /*#__PURE__*/_jsxs(motion.button, {
          onClick: () => setActiveStrategy(strategy.id),
          className: `
                mobile-nav-item
                flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg min-w-[48px] min-h-[44px] transition-colors
                ${isActive ? 'active text-emerald-soft mobile-nav-active-line' : 'text-ink-muted'}
              `,
          whileTap: {
            scale: 0.9
          },
          "aria-label": strategy.title,
          "aria-current": isActive ? 'page' : undefined,
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-sm leading-none",
            style: {
              filter: isActive ? `drop-shadow(0 0 4px ${strategy.color})` : 'none'
            },
            children: navEmojis[strategy.id] || strategy.title.charAt(0)
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[9px] font-semibold leading-tight truncate max-w-[56px]",
            children: strategy.title.split(' ').slice(0, 2).join(' ')
          })]
        }, strategy.id);
      })
    })]
  });
}
export default function Home() {
  const {
    activeStrategy,
    incrementStreak,
    setActiveStrategy
  } = useAppStore();
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);
  const handleSwitchStrategy = useCallback(strategyNumber => {
    setActiveStrategy(strategyNumber);
  }, [setActiveStrategy]);
  const handleOpenShortcutsHelp = useCallback(() => {
    setKeyboardShortcutsOpen(true);
  }, []);
  const handleCloseDialog = useCallback(() => {
    setKeyboardShortcutsOpen(false);
  }, []);
  useKeyboardShortcuts({
    onSwitchStrategy: handleSwitchStrategy,
    onOpenShortcutsHelp: handleOpenShortcutsHelp,
    onCloseDialog: handleCloseDialog
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen flex flex-col bg-midnight text-ink overflow-x-hidden",
    children: [/*#__PURE__*/_jsx(WelcomeOnboarding, {}), /*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsx("div", {
      className: "fixed top-[60px] right-3 z-40",
      children: /*#__PURE__*/_jsx(ThemeToggle, {})
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-1",
      children: [/*#__PURE__*/_jsx(Sidebar, {}), /*#__PURE__*/_jsx("main", {
        className: "flex-1 pb-16 md:pb-0 ambient-glow bg-texture-dots",
        children: renderStrategy(activeStrategy)
      })]
    }), /*#__PURE__*/_jsx(AppFooter, {}), /*#__PURE__*/_jsx(MobileBottomNav, {}), /*#__PURE__*/_jsx(FinanceAdvisor, {}), /*#__PURE__*/_jsx(KeyboardShortcutsDialog, {
      open: keyboardShortcutsOpen,
      onClose: () => setKeyboardShortcutsOpen(false)
    })]
  });
}