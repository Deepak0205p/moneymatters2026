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

  // Auth guard (soft — allow viewing but suggest login)
  if (hydrated && !isAuthenticated) {
    return /*#__PURE__*/_jsx("main", {
      className: "relative min-h-screen bg-midnight flex items-center justify-center p-4",
      children: /*#__PURE__*/_jsxs("div", {
        className: "glass-card-premium rounded-3xl p-8 max-w-md text-center",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
          style: {
            background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
          },
          children: /*#__PURE__*/_jsx(Wrench, {
            size: 28,
            className: "text-midnight"
          })
        }), /*#__PURE__*/_jsx("h1", {
          className: "text-2xl font-bold text-white mb-2",
          children: "Tools kholne ke liye login karo"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-ink-muted mb-6",
          children: "Apni progress save karne aur coins earn karne ke liye pehle login karo."
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-3 justify-center",
          children: [/*#__PURE__*/_jsx(Link, {
            href: "/auth",
            className: "rounded-xl px-5 py-3 font-bold text-sm text-midnight",
            style: {
              background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
            },
            children: "Login / Signup"
          }), /*#__PURE__*/_jsx(Link, {
            href: "/",
            className: "rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-sm text-white hover:bg-white/10 transition-colors",
            children: "Home"
          })]
        })]
      })
    });
  }
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
            children: "11 interactive strategies + 16 financial tools \u2014 SIP calculator, expense tracker, quizzes, games, AI advisor aur bahut kuch. Sab kuch Hinglish mein!"
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
            href: "/dashboard",
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
                children: "Interactive Strategies"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: "11 visual + gamified financial learning experiences"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            children: strategies.map((strategy, i) => {
              const Icon = getIcon(strategy.icon);
              return /*#__PURE__*/_jsxs(motion.button, {
                initial: {
                  opacity: 0,
                  y: 20
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: i * 0.04
                },
                whileHover: {
                  y: -4,
                  scale: 1.02
                },
                whileTap: {
                  scale: 0.98
                },
                onClick: () => setActiveStrategy(strategy.id),
                className: "group relative text-left rounded-3xl p-5 border border-white/[0.06] glass-card card-shine overflow-hidden",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500",
                  style: {
                    backgroundColor: strategy.color
                  }
                }), /*#__PURE__*/_jsxs("div", {
                  className: "relative z-10",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-start justify-between mb-4",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: "w-12 h-12 rounded-2xl flex items-center justify-center",
                      style: {
                        backgroundColor: `${strategy.color}20`,
                        boxShadow: `0 0 14px ${strategy.color}20`
                      },
                      children: /*#__PURE__*/_jsx(Icon, {
                        size: 22,
                        style: {
                          color: strategy.color
                        }
                      })
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-[9px] font-black px-2 py-0.5 rounded-full",
                      style: {
                        backgroundColor: `${strategy.color}20`,
                        color: strategy.color
                      },
                      children: String(strategy.id).padStart(2, '0')
                    })]
                  }), /*#__PURE__*/_jsx("h3", {
                    className: "font-bold text-white mb-1 group-hover:text-emerald-soft transition-colors",
                    children: strategy.title
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[11px] text-ink-muted line-clamp-2 mb-3",
                    children: strategy.titleEn
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between pt-3 border-t border-white/[0.04]",
                    children: [/*#__PURE__*/_jsxs("span", {
                      className: "text-[9px] font-bold uppercase tracking-wider",
                      style: {
                        color: strategy.color
                      },
                      children: [strategy.priority, " priority"]
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-[10px] text-ink-muted group-hover:text-emerald-soft transition-colors flex items-center gap-1",
                      children: ["Kholo ", /*#__PURE__*/_jsx(Zap, {
                        size: 10
                      })]
                    })]
                  })]
                })]
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
                children: "Financial Tools"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: "Calculators, trackers, games aur more"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
            children: TOOLS.map((tool, i) => {
              const Icon = tool.Icon;
              return /*#__PURE__*/_jsxs(motion.button, {
                initial: {
                  opacity: 0,
                  y: 20
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: i * 0.03
                },
                whileHover: {
                  y: -4,
                  scale: 1.03
                },
                whileTap: {
                  scale: 0.97
                },
                onClick: () => setOpenTool(tool.id),
                className: "group relative text-left rounded-2xl p-4 border border-white/[0.06] glass-card card-shine overflow-hidden",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500",
                  style: {
                    backgroundColor: tool.color
                  }
                }), /*#__PURE__*/_jsxs("div", {
                  className: "relative z-10 flex flex-col items-center text-center",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "w-11 h-11 rounded-xl flex items-center justify-center mb-3",
                    style: {
                      backgroundColor: `${tool.color}20`,
                      boxShadow: `0 0 14px ${tool.color}20`
                    },
                    children: /*#__PURE__*/_jsx(Icon, {
                      size: 20,
                      style: {
                        color: tool.color
                      }
                    })
                  }), /*#__PURE__*/_jsx("h3", {
                    className: "text-xs font-bold text-white mb-1 line-clamp-1",
                    children: tool.label
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[10px] text-ink-muted line-clamp-2 leading-tight",
                    children: tool.description
                  })]
                })]
              }, tool.id);
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-center py-8 border-t border-white/[0.03]",
          children: /*#__PURE__*/_jsx("p", {
            className: "text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]",
            children: "Money Matters \u2014 Tools Hub"
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