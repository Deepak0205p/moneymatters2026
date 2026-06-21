"use client";

import { useState, Suspense, lazy, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { strategies } from '@/lib/data/strategies';
import { ArrowLeft, X, Sparkles, Wrench, Brain, Calculator, TrendingUp, Target, Trophy, Zap, Brain as BrainIcon, Type, Newspaper, ListOrdered, UserCheck, Shield, Calendar, HeartPulse, Receipt, PiggyBank, CircleDot, Coins, BookOpen, Navigation, GitBranch, Eye, Layers, Home, DoorOpen, TreePine, Award, Clock, Store, Construction } from 'lucide-react';


const ICON_MAP = { Navigation, GitBranch, Eye, Layers, Home, DoorOpen, TreePine, Award, BookOpen, Clock, Store };

// ── Strategy components (lazy) ───────────────────────────────────────────────
// Note: "Zindagi Ka Safar" (LifePathMap) has been removed per user request.
const StrategyComponents = {
  2: /*#__PURE__*/lazy(() => import('@/components/strategies/FinancialGPS')),
  3: /*#__PURE__*/lazy(() => import('@/components/strategies/ConsequenceSim')),
  4: /*#__PURE__*/lazy(() => import('@/components/strategies/InflationMonster')),
  5: /*#__PURE__*/lazy(() => import('@/components/strategies/SwipeBudget')),
  6: /*#__PURE__*/lazy(() => import('@/components/strategies/RoomBudget')),
  7: /*#__PURE__*/lazy(() => import('@/components/strategies/DebtDoors')),
  8: /*#__PURE__*/lazy(() => import('@/components/strategies/CompoundingTree')),
  9: /*#__PURE__*/lazy(() => import('@/components/strategies/ReportCard')),
  10: /*#__PURE__*/lazy(() => import('@/components/strategies/Dictionary')),
  11: /*#__PURE__*/lazy(() => import('@/components/strategies/DailySimulator')),
  12: /*#__PURE__*/lazy(() => import('@/components/strategies/MistakeMarket'))
};

// ── Tools registry (lazy-loaded) ─────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const TOOLS = [{
  id: 'achievement',
  Icon: Trophy,
  label: 'Achievement Dashboard',
  description: 'Apni achievements aur milestones dekho',
  color: '#F59E0B',
  loader: () => import('@/components/shared/AchievementDashboard').then(m => m.AchievementDashboard || m.default)
}, {
  id: 'goals',
  Icon: Target,
  label: 'Goal Tracker',
  description: 'Financial goals set karo aur track karo',
  color: '#10B981',
  loader: () => import('@/components/shared/GoalTracker').then(m => m.GoalTracker || m.default)
}, {
  id: 'health',
  Icon: HeartPulse,
  label: 'Health Checkup',
  description: 'Financial health ka quick checkup',
  color: '#F43F5E',
  loader: () => import('@/components/shared/HealthCheckup').then(m => m.default || m.HealthCheckup)
}, {
  id: 'expense',
  Icon: Receipt,
  label: 'Expense Tracker',
  description: 'Monthly kharcha track karo',
  color: '#10B981',
  loader: () => import('@/components/shared/ExpenseTracker').then(m => m.default || m.ExpenseTracker)
}, {
  id: 'savings',
  Icon: PiggyBank,
  label: 'Savings Challenge',
  description: 'Bachat challenge accept karo',
  color: '#F59E0B',
  loader: () => import('@/components/shared/SavingsChallenge').then(m => m.default || m.SavingsChallenge)
}, {
  id: 'quiz',
  Icon: Zap,
  label: 'Quiz Arena',
  description: 'Finance quiz khelo aur seekho',
  color: '#F59E0B',
  loader: () => import('@/components/shared/QuizArena').then(m => m.QuizArena || m.default)
}, {
  id: 'spin',
  Icon: CircleDot,
  label: 'Spin Wheel',
  description: 'Daily spin se coins jeeto',
  color: '#F59E0B',
  loader: () => import('@/components/shared/SpinWheel').then(m => m.SpinWheel || m.default)
}, {
  id: 'memory',
  Icon: BrainIcon,
  label: 'Memory Match',
  description: 'Finance terms memory game',
  color: '#8B5CF6',
  loader: () => import('@/components/shared/MemoryMatch').then(m => m.default || m.MemoryMatch)
}, {
  id: 'word',
  Icon: Type,
  label: 'Word Scramble',
  description: 'Finance terms unscramble karo',
  color: '#8B5CF6',
  loader: () => import('@/components/shared/WordScramble').then(m => m.default || m.WordScramble)
}, {
  id: 'news',
  Icon: Newspaper,
  label: 'Financial News',
  description: 'Latest finance news padho',
  color: '#10B981',
  loader: () => import('@/components/shared/FinancialNewsWidget').then(m => m.default || m.FinancialNewsWidget)
}, {
  id: 'priority',
  Icon: ListOrdered,
  label: 'Priority Calculator',
  description: 'Kharcha priority set karo',
  color: '#F59E0B',
  loader: () => import('@/components/shared/PriorityCalculator').then(m => m.default || m.PriorityCalculator)
}, {
  id: 'invest',
  Icon: TrendingUp,
  label: 'Investment Comparison',
  description: 'FD/PPF/MF/Gold compare karo',
  color: '#10B981',
  loader: () => import('@/components/shared/InvestmentComparison').then(m => m.default || m.InvestmentComparison)
}, {
  id: 'emergency',
  Icon: Shield,
  label: 'Emergency Fund',
  description: 'Emergency fund calculator',
  color: '#38BDF8',
  loader: () => import('@/components/shared/EmergencyFundCalculator').then(m => m.default || m.EmergencyFundCalculator)
}, {
  id: 'habit',
  Icon: Calendar,
  label: 'Habit Tracker',
  description: 'Daily financial habits track karo',
  color: '#8B5CF6',
  loader: () => import('@/components/shared/HabitTracker').then(m => m.default || m.HabitTracker)
}, {
  id: 'age',
  Icon: UserCheck,
  label: 'Financial Age',
  description: 'Apna financial age calculate karo',
  color: '#F59E0B',
  loader: () => import('@/components/shared/FinancialAgeCalculator').then(m => m.default || m.FinancialAgeCalculator)
}, {
  id: 'sip',
  Icon: Calculator,
  label: 'SIP Calculator',
  description: 'SIP returns calculate karo',
  color: '#10B981',
  loader: () => import('@/components/shared/SIPCalculator').then(m => m.SIPCalculator || m.default)
}, {
  id: 'badges',
  Icon: Trophy,
  label: 'Badge Gallery',
  description: 'Apne badges dekho',
  color: '#F59E0B',
  loader: () => import('@/components/shared/BadgeGallery').then(m => m.BadgeGallery || m.default)
}];
function getIcon(iconName) {
  if (!iconName) return Construction;
  return ICON_MAP[iconName] || Construction;
}
function StrategyLoading() {
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-center justify-center min-h-[40vh]",
    children: /*#__PURE__*/_jsx("div", {
      className: "w-10 h-10 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin"
    })
  });
}

// ── Strategy Viewer (full-screen overlay) ────────────────────────────────────
function StrategyViewer({
  strategyId,
  onClose
}) {
  const Strategy = StrategyComponents[strategyId];
  const strategy = strategies.find(s => s.id === strategyId);
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    className: "fixed inset-0 z-[70] bg-midnight flex flex-col",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "shrink-0 glass-strong border-b border-white/[0.06] px-4 py-3 flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3 min-w-0",
        children: [/*#__PURE__*/_jsxs("button", {
          onClick: onClose,
          className: "flex items-center gap-1 text-sm text-ink-muted hover:text-emerald-soft transition-colors px-3 py-2 rounded-lg",
          "aria-label": "Back to tools",
          children: [/*#__PURE__*/_jsx(ArrowLeft, {
            size: 16
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden sm:inline",
            children: "Tools"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "h-5 w-px bg-white/10"
        }), /*#__PURE__*/_jsx("div", {
          className: "flex items-center gap-2 min-w-0",
          children: strategy && /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("span", {
              className: "w-2 h-2 rounded-full shrink-0",
              style: {
                backgroundColor: strategy.color
              }
            }), /*#__PURE__*/_jsx("h2", {
              className: "text-sm font-bold text-white truncate",
              children: strategy.title
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-[10px] text-ink-muted hidden sm:inline truncate",
              children: ["\u2014 ", strategy.titleEn]
            })]
          })
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: onClose,
        className: "p-2 rounded-lg text-ink-muted hover:text-white hover:bg-white/10 transition-all",
        "aria-label": "Close",
        children: /*#__PURE__*/_jsx(X, {
          size: 18
        })
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex-1 overflow-y-auto custom-scroll ambient-glow bg-texture-dots",
      children: /*#__PURE__*/_jsx("div", {
        className: "p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto",
        children: /*#__PURE__*/_jsx(Suspense, {
          fallback: /*#__PURE__*/_jsx(StrategyLoading, {}),
          children: Strategy ? /*#__PURE__*/_jsx(Strategy, {}) : /*#__PURE__*/_jsx("div", {
            className: "text-ink-muted",
            children: "Strategy not found."
          })
        })
      })
    })]
  });
}

// ── Lazy Tool Wrapper ────────────────────────────────────────────────────────
function LazyToolDialog({ toolId, onClose }) {
  const [Component, setComponent] = useState(null);
  const tool = TOOLS.find(t => t.id === toolId);

  useEffect(() => {
    if (!tool) return;
    let cancelled = false;
    tool.loader().then(mod => {
      if (!cancelled) setComponent(() => mod);
    });
    return () => { cancelled = true; };
  }, [tool]);

  if (!tool) return null;
  if (!Component) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight/80 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
      </div>
    );
  }
  return <Component open={true} onClose={onClose} />;
}

const toolGamerInfo = (id) => {
  const infoMap = {
    achievement: { cat: 'Showcase 🏆', xp: '+20 XP' },
    goals: { cat: 'Tracker 🎯', xp: '+50 XP' },
    health: { cat: 'Checkup 🩺', xp: '+80 XP' },
    expense: { cat: 'Tracker 🧾', xp: '+40 XP' },
    savings: { cat: 'Challenge 🐷', xp: '+100 XP' },
    quiz: { cat: 'Battle 🧠', xp: '+150 XP' },
    spin: { cat: 'Daily Luck 🎡', xp: '+10 XP' },
    memory: { cat: 'Minigame 🃏', xp: '+80 XP' },
    word: { cat: 'Minigame 🔠', xp: '+80 XP' },
    news: { cat: 'Feed 📰', xp: '+10 XP' },
    priority: { cat: 'Calculator 🔢', xp: '+30 XP' },
    invest: { cat: 'Comparison 📈', xp: '+40 XP' },
    emergency: { cat: 'Calculator 🛡️', xp: '+40 XP' },
    habit: { cat: 'Habits 📅', xp: '+60 XP' },
    age: { cat: 'Calculator 🩺', xp: '+50 XP' },
    sip: { cat: 'Calculator 🧮', xp: '+30 XP' },
    badges: { cat: 'Gallery 🥇', xp: '+10 XP' }
  };
  return infoMap[id] || { cat: 'Utility ⚙️', xp: '+20 XP' };
};

// ── Tools Page ───────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const {
    isAuthenticated,
    coins,
    badges
  } = useAppStore();
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [openTool, setOpenTool] = useState(null);
  const toolCount = useMemo(() => TOOLS.length + strategies.length, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/');
  }, [hydrated, isAuthenticated, router]);

  const translatedStrategies = strategies;
  const translatedStrategiesTitle = 'Interactive Strategies';
  const translatedStrategiesSub = '11 visual + gamified financial learning experiences';
  const translatedToolsTitle = 'Financial Tools';
  const translatedToolsSub = 'Calculators, trackers, games aur more';

  // Auth guard removed since user is always authenticated
  return /*#__PURE__*/_jsxs("main", {
    className: "relative min-h-screen w-full overflow-hidden bg-midnight",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "fixed inset-0 pointer-events-none z-0",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10",
      children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsxs("div", {
        className: "mx-auto max-w-6xl px-4 pt-24 pb-12 space-y-12",
        children: [/*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "text-center",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "inline-flex items-center gap-2 rounded-full bg-emerald/10 border border-emerald/20 px-4 py-1.5 mb-4",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              size: 14,
              className: "text-emerald-soft"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-[10px] font-bold text-emerald-soft uppercase tracking-widest",
              children: [toolCount, " Interactive Resources"]
            })]
          }), /*#__PURE__*/_jsx("h1", {
            className: "font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-3",
            children: /*#__PURE__*/_jsx("span", {
              className: "text-gradient-brand",
              children: "Strategies & Tools"
            })
          }), /*#__PURE__*/_jsx("p", {
            className: "text-ink-muted max-w-2xl mx-auto",
            children: translatedHeroSub || "11 interactive strategies + 16 financial tools — SIP calculator, expense tracker, quizzes, games, AI advisor aur bahut kuch. Sab kuch Hinglish mein!"
          })]
        }), /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.1
          },
          className: "flex flex-wrap items-center justify-center gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-2",
            children: [/*#__PURE__*/_jsx(Coins, {
              size: 15,
              className: "text-gold-soft"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-bold text-ink tabular-nums",
              children: coins
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] font-semibold text-gold-soft/70 uppercase tracking-wider",
              children: "Coins"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 rounded-xl bg-emerald/10 border border-emerald/20 px-4 py-2",
            children: [/*#__PURE__*/_jsx(Trophy, {
              size: 15,
              className: "text-emerald-soft"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-bold text-ink tabular-nums",
              children: badges.length
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] font-semibold text-emerald-soft/70 uppercase tracking-wider",
              children: "Badges"
            })]
          }), /*#__PURE__*/_jsxs(Link, {
            href: "/home",
            className: "flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-white/10 hover:border-emerald/20 transition-colors",
            children: [/*#__PURE__*/_jsx(BookOpen, {
              size: 15,
              className: "text-emerald-soft"
            }), "Dashboard"]
          })]
        }), /*#__PURE__*/_jsxs("section", {
          className: "space-y-5",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 rounded-xl flex items-center justify-center",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
              },
              children: /*#__PURE__*/_jsx(Brain, {
                size: 20,
                className: "text-midnight"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-display text-xl font-bold text-ink",
                children: translatedStrategiesTitle
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: translatedStrategiesSub
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
            children: translatedStrategies.map((strategy, i) => {
              const Icon = getIcon(strategy.icon);
              const difficulty = strategy.priority === 'highest' || strategy.priority === 'high' 
                ? { label: 'Advanced 🔴', xp: '+100 XP' }
                : strategy.priority === 'medium'
                ? { label: 'Intermediate 🟡', xp: '+50 XP' }
                : { label: 'Beginner 🟢', xp: '+30 XP' };
              return /*#__PURE__*/_jsxs(motion.button, {
                initial: {
                  opacity: 0,
                  y: 30
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: i * 0.05,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                },
                whileHover: {
                  y: -6,
                  boxShadow: `0 20px 45px rgba(0, 0, 0, 0.5), 0 0 30px ${strategy.color}15`,
                  borderColor: `${strategy.color}40`
                },
                whileTap: {
                  scale: 0.98
                },
                onClick: () => setActiveStrategy(strategy.id),
                className: "group relative text-left rounded-3xl p-6 border border-white/[0.07] bg-gradient-to-b from-midnight-soft/90 to-midnight-deep/95 overflow-hidden transition-all duration-300 cursor-pointer",
                children: [
                  /*#__PURE__*/_jsx("div", {
                    className: "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[70px] opacity-15 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500",
                    style: {
                      backgroundColor: strategy.color
                    }
                  }),
                  /*#__PURE__*/_jsxs("div", {
                    className: "relative z-10 flex flex-col h-full justify-between",
                    children: [
                      /*#__PURE__*/_jsxs("div", {
                        className: "flex items-start justify-between mb-5",
                        children: [
                          /*#__PURE__*/_jsx("div", {
                            className: "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg",
                            style: {
                              backgroundColor: `${strategy.color}15`,
                              border: `1px solid ${strategy.color}25`
                            },
                            children: /*#__PURE__*/_jsx(Icon, {
                              size: 24,
                              style: {
                                color: strategy.color
                              }
                            })
                          }),
                          /*#__PURE__*/_jsxs("div", {
                            className: "flex gap-1.5 items-center",
                            children: [
                              /*#__PURE__*/_jsx("span", {
                                className: "text-[9px] font-black px-2 py-0.5 rounded-full",
                                style: {
                                  backgroundColor: `${strategy.color}15`,
                                  color: strategy.color,
                                  border: `1px solid ${strategy.color}25`
                                },
                                children: `S-${String(strategy.id).padStart(2, '0')}`
                              }),
                              /*#__PURE__*/_jsx("span", {
                                className: "text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-soft border border-emerald-500/20",
                                children: difficulty.xp
                              })
                            ]
                          })
                        ]
                      }),
                      /*#__PURE__*/_jsxs("div", {
                        children: [
                          /*#__PURE__*/_jsx("h3", {
                            className: "font-display text-lg font-extrabold text-white mb-1.5 group-hover:text-emerald-soft transition-colors duration-300",
                            children: strategy.title
                          }),
                          /*#__PURE__*/_jsx("p", {
                            className: "text-[12px] text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed line-clamp-3 mb-4",
                            children: strategy.description || strategy.titleEn
                          })
                        ]
                      }),
                      /*#__PURE__*/_jsxs("div", {
                        className: "flex items-center justify-between pt-4 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors",
                        children: [
                          /*#__PURE__*/_jsxs("div", {
                            className: "flex items-center gap-1 text-[10px] font-semibold text-zinc-500",
                            children: [
                              /*#__PURE__*/_jsx("span", {
                                children: difficulty.label
                              })
                            ]
                          }),
                          /*#__PURE__*/_jsxs(motion.div, {
                            whileHover: {
                              backgroundColor: `${strategy.color}25`,
                              borderColor: `${strategy.color}40`,
                              boxShadow: `0 0 12px ${strategy.color}40`,
                              x: 2
                            },
                            className: "px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white group-hover:text-white transition-all flex items-center gap-1",
                            children: [
                              "KHELO 🎮",
                              /*#__PURE__*/_jsx(Zap, {
                                size: 10,
                                className: "text-amber-400"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              }, strategy.id);
            })
          })]
        }), /*#__PURE__*/_jsxs("section", {
          className: "space-y-5",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 rounded-xl flex items-center justify-center",
              style: {
                background: 'linear-gradient(135deg, #A78BFA, #8B5CF6 60%, #6D28D9)'
              },
              children: /*#__PURE__*/_jsx(Wrench, {
                size: 20,
                className: "text-white"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-display text-xl font-bold text-ink",
                children: translatedToolsTitle
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: translatedToolsSub
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
            children: TOOLS.map((tool, i) => {
              const Icon = tool.Icon;
              const gamer = toolGamerInfo(tool.id);
              return /*#__PURE__*/_jsxs(motion.button, {
                initial: {
                  opacity: 0,
                  y: 30
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: i * 0.04,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                },
                whileHover: {
                  y: -6,
                  boxShadow: `0 15px 30px rgba(0, 0, 0, 0.45), 0 0 20px ${tool.color}15`,
                  borderColor: `${tool.color}45`
                },
                whileTap: {
                  scale: 0.97
                },
                onClick: () => setOpenTool(tool.id),
                className: "group relative text-left rounded-3xl p-5 border border-white/[0.07] bg-gradient-to-b from-midnight-soft/90 to-midnight-deep/95 overflow-hidden transition-all duration-300 cursor-pointer",
                children: [
                  /*#__PURE__*/_jsx("div", {
                    className: "absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500",
                    style: {
                      backgroundColor: tool.color
                    }
                  }),
                  /*#__PURE__*/_jsxs("div", {
                    className: "relative z-10 flex flex-col h-full justify-between items-center text-center",
                    children: [
                      /*#__PURE__*/_jsxs("div", {
                        className: "w-full flex items-center justify-between mb-4",
                        children: [
                          /*#__PURE__*/_jsx("span", {
                            className: "text-[8px] font-black tracking-wider text-zinc-500 group-hover:text-zinc-400 truncate max-w-[60%]",
                            children: gamer.cat
                          }),
                          /*#__PURE__*/_jsx("span", {
                            className: "text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-soft border border-emerald-500/20",
                            children: gamer.xp
                          })
                        ]
                      }),
                      /*#__PURE__*/_jsx("div", {
                        className: "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110 shadow-md",
                        style: {
                          backgroundColor: `${tool.color}15`,
                          border: `1px solid ${tool.color}25`
                        },
                        children: /*#__PURE__*/_jsx(Icon, {
                          size: 22,
                          style: {
                            color: tool.color
                          }
                        })
                      }),
                      /*#__PURE__*/_jsxs("div", {
                        className: "w-full",
                        children: [
                          /*#__PURE__*/_jsx("h3", {
                            className: "text-sm font-extrabold text-white mb-1 group-hover:text-emerald-soft transition-colors duration-300 line-clamp-1",
                            children: tool.label
                          }),
                          /*#__PURE__*/_jsx("p", {
                            className: "text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed line-clamp-2 min-h-[2.2rem]",
                            children: tool.description
                          })
                        ]
                      }),
                      /*#__PURE__*/_jsx(motion.div, {
                        whileHover: {
                          backgroundColor: `${tool.color}25`,
                          borderColor: `${tool.color}40`,
                          boxShadow: `0 0 10px ${tool.color}30`
                        },
                        className: "mt-3 w-full py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-400 group-hover:text-white transition-all flex items-center justify-center gap-1",
                        children: "OPEN ⚙️"
                      })
                    ]
                  })
                ]
              }, tool.id);
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-center py-8 border-t border-white/[0.03]",
          children: /*#__PURE__*/_jsx("p", {
            className: "text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]",
            children: "Money Matters — Tools Hub"
          })
        })]
      })]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: activeStrategy !== null && /*#__PURE__*/_jsx(StrategyViewer, {
        strategyId: activeStrategy,
        onClose: () => setActiveStrategy(null)
      })
    }), openTool && /*#__PURE__*/_jsx(LazyToolDialog, {
      toolId: openTool,
      onClose: () => setOpenTool(null)
    })]
  });
}