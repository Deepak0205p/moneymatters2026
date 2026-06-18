"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import { ChevronRight, Zap, BookOpen, ArrowRight, Lock, CheckCircle2, Sparkles, Clock, IndianRupee } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const QUOTES = ['Paisa invest karo, future secure karo! 🚀', 'Har rupee ek soldier hai — use wisely! ⚔️', 'Compounding ka jadoo samjho, aur ameer bano! ✨', 'Debt se bachna = financial freedom ka pehla step 🛡️'];
const QUICK_TOOLS = [{
  id: 'goals',
  label: 'Goals',
  emoji: '🎯',
  color: '#10B981'
}, {
  id: 'expense',
  label: 'Kharcha',
  emoji: '🧾',
  color: '#F59E0B'
}, {
  id: 'quiz',
  label: 'Quiz',
  emoji: '🧠',
  color: '#8B5CF6'
}, {
  id: 'spin',
  label: 'Spin',
  emoji: '🎡',
  color: '#EF4444'
}, {
  id: 'memory',
  label: 'Memory',
  emoji: '🃏',
  color: '#06B6D4'
}, {
  id: 'health',
  label: 'Checkup',
  emoji: '🩺',
  color: '#EC4899'
}];

// ════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ════════════════════════════════════════════════════════════════════════════
function AnimatedCounter({
  target
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1100;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return /*#__PURE__*/_jsx("span", {
    children: count.toLocaleString('en-IN')
  });
}

// ════════════════════════════════════════════════════════════════════════════
// FINANCE TICKER
// ════════════════════════════════════════════════════════════════════════════
function FinanceTicker() {
  const messages = ['Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨', 'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️', 'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳', "Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉", 'Wealth is what you don\'t see. Ameer mat dikho, ameer bano! 🕵️'];
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full bg-emerald/10 border-y border-emerald/20 py-2 overflow-hidden whitespace-nowrap relative",
    children: [/*#__PURE__*/_jsx(motion.div, {
      animate: {
        x: [0, -2000]
      },
      transition: {
        duration: 40,
        repeat: Infinity,
        ease: 'linear'
      },
      className: "flex gap-12 items-center",
      children: [...messages, ...messages].map((msg, i) => /*#__PURE__*/_jsxs("span", {
        className: "text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Zap, {
          size: 12,
          fill: "currentColor"
        }), " ", msg]
      }, i))
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10"
    })]
  });
}

// ════════════════════════════════════════════════════════════════════════════
// FINANCIAL HEALTH SCORE GAUGE — speedometer-style emerald gauge
// ════════════════════════════════════════════════════════════════════════════
function HealthScoreGauge({
  score
}) {
  const radius = 70;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - score / 100 * circumference;
  const grade = score >= 75 ? 'Fit 💪' : score >= 50 ? 'Average 🤔' : 'ICU mein hai 🏥';
  const gradeColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return /*#__PURE__*/_jsxs("div", {
    className: "relative flex flex-col items-center justify-center",
    children: [/*#__PURE__*/_jsxs("svg", {
      width: "200",
      height: "120",
      viewBox: "0 0 200 120",
      className: "overflow-visible",
      children: [/*#__PURE__*/_jsxs("defs", {
        children: [/*#__PURE__*/_jsxs("linearGradient", {
          id: "gaugeGradient",
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%",
          children: [/*#__PURE__*/_jsx("stop", {
            offset: "0%",
            stopColor: "#EF4444"
          }), /*#__PURE__*/_jsx("stop", {
            offset: "50%",
            stopColor: "#F59E0B"
          }), /*#__PURE__*/_jsx("stop", {
            offset: "100%",
            stopColor: "#10B981"
          })]
        }), /*#__PURE__*/_jsxs("filter", {
          id: "gaugeGlow",
          children: [/*#__PURE__*/_jsx("feGaussianBlur", {
            stdDeviation: "3",
            result: "blur"
          }), /*#__PURE__*/_jsxs("feMerge", {
            children: [/*#__PURE__*/_jsx("feMergeNode", {
              in: "blur"
            }), /*#__PURE__*/_jsx("feMergeNode", {
              in: "SourceGraphic"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("path", {
        d: `M 20 110 A ${radius} ${radius} 0 0 1 180 110`,
        fill: "none",
        stroke: "rgba(255,255,255,0.08)",
        strokeWidth: "14",
        strokeLinecap: "round"
      }), /*#__PURE__*/_jsx(motion.path, {
        d: `M 20 110 A ${radius} ${radius} 0 0 1 180 110`,
        fill: "none",
        stroke: "url(#gaugeGradient)",
        strokeWidth: "14",
        strokeLinecap: "round",
        filter: "url(#gaugeGlow)",
        strokeDasharray: circumference,
        initial: {
          strokeDashoffset: circumference
        },
        animate: {
          strokeDashoffset: offset
        },
        transition: {
          duration: 1.4,
          ease: 'easeOut'
        }
      }), [0, 25, 50, 75, 100].map(t => {
        const angle = Math.PI - t / 100 * Math.PI;
        const x1 = 100 + Math.cos(angle) * (radius + 12);
        const y1 = 110 - Math.sin(angle) * (radius + 12);
        const x2 = 100 + Math.cos(angle) * (radius + 6);
        const y2 = 110 - Math.sin(angle) * (radius + 6);
        return /*#__PURE__*/_jsx("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: "rgba(255,255,255,0.25)",
          strokeWidth: "2"
        }, t);
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "absolute top-6 flex flex-col items-center",
      children: [/*#__PURE__*/_jsx(motion.span, {
        initial: {
          scale: 0.5,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          delay: 0.6,
          type: 'spring'
        },
        className: "font-display text-4xl font-extrabold text-white",
        style: {
          textShadow: `0 0 24px ${gradeColor}80`
        },
        children: score
      }), /*#__PURE__*/_jsx("span", {
        className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
        children: "/ 100"
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "mt-1 px-3 py-1 rounded-full",
      style: {
        backgroundColor: `${gradeColor}20`,
        border: `1px solid ${gradeColor}40`
      },
      children: /*#__PURE__*/_jsx("span", {
        className: "text-xs font-bold",
        style: {
          color: gradeColor
        },
        children: grade
      })
    })]
  });
}

// ════════════════════════════════════════════════════════════════════════════
// STAT CARD — 2x2 grid component
// ════════════════════════════════════════════════════════════════════════════
function StatCard({
  emoji,
  label,
  value,
  accent,
  sub,
  children,
  delay
}) {
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      delay,
      duration: 0.5
    },
    whileHover: {
      y: -4
    },
    className: "card-3d glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60",
      style: {
        backgroundColor: accent
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative flex items-start justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[10px] font-black text-ink-muted uppercase tracking-widest mb-1",
          children: label
        }), /*#__PURE__*/_jsx("p", {
          className: "font-display text-2xl sm:text-3xl font-extrabold text-white leading-none",
          children: value
        }), sub && /*#__PURE__*/_jsx("p", {
          className: "text-[10px] font-bold mt-1.5",
          style: {
            color: accent
          },
          children: sub
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "text-3xl sm:text-4xl",
        style: {
          filter: `drop-shadow(0 0 8px ${accent}80)`
        },
        children: emoji
      })]
    }), children && /*#__PURE__*/_jsx("div", {
      className: "relative mt-3",
      children: children
    })]
  });
}

// Mini circular progress ring for module stat card
function MiniRing({
  percent,
  color
}) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return /*#__PURE__*/_jsxs("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 44 44",
    className: "-rotate-90",
    children: [/*#__PURE__*/_jsx("circle", {
      cx: "22",
      cy: "22",
      r: r,
      fill: "none",
      stroke: "rgba(255,255,255,0.1)",
      strokeWidth: "4"
    }), /*#__PURE__*/_jsx(motion.circle, {
      cx: "22",
      cy: "22",
      r: r,
      fill: "none",
      stroke: color,
      strokeWidth: "4",
      strokeLinecap: "round",
      strokeDasharray: c,
      initial: {
        strokeDashoffset: c
      },
      animate: {
        strokeDashoffset: c - percent / 100 * c
      },
      transition: {
        duration: 1,
        delay: 0.5
      }
    })]
  });
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE CARD — for module grid
// ════════════════════════════════════════════════════════════════════════════
function ModuleCard({
  mod,
  index,
  isUnlocked,
  isActive,
  onClick
}) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const {
    moduleProgress,
    completedModules
  } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.floor((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1) * 100);
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      delay: index * 0.04
    },
    whileHover: {
      scale: isUnlocked ? 1.02 : 1,
      y: isUnlocked ? -5 : 0
    },
    className: `relative group cursor-pointer rounded-2xl p-5 border border-white/[0.06] overflow-hidden transition-all duration-500 glass-card card-3d ${isUnlocked ? 'unlocked' : 'locked'}`,
    onClick: isUnlocked ? onClick : undefined,
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500",
      style: {
        backgroundColor: mod.color
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col h-full relative z-10",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between mb-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [isUnlocked && /*#__PURE__*/_jsxs("svg", {
            className: "absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90",
            children: [/*#__PURE__*/_jsx("circle", {
              cx: "50%",
              cy: "50%",
              r: "45%",
              fill: "none",
              stroke: "white",
              strokeWidth: "1.5",
              strokeOpacity: "0.05"
            }), /*#__PURE__*/_jsx(motion.circle, {
              cx: "50%",
              cy: "50%",
              r: "45%",
              fill: "none",
              stroke: mod.color,
              strokeWidth: "2",
              strokeLinecap: "round",
              initial: {
                pathLength: 0
              },
              animate: {
                pathLength: progressPercent / 100
              },
              transition: {
                duration: 1.5,
                delay: 0.5
              }
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: `w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${isUnlocked ? 'shadow-lg shadow-black/20' : 'grayscale opacity-50'}`,
            style: {
              backgroundColor: isUnlocked ? `${mod.color}20` : 'rgba(255,255,255,0.05)'
            },
            children: isUnlocked ? mod.emoji : /*#__PURE__*/_jsx(Lock, {
              size: 16,
              className: "text-zinc-600"
            })
          })]
        }), isActive && /*#__PURE__*/_jsxs(motion.div, {
          animate: {
            opacity: [0.5, 1, 0.5]
          },
          transition: {
            repeat: Infinity,
            duration: 2
          },
          className: "px-2 py-1 rounded-full bg-emerald/10 border border-emerald/30 flex items-center gap-1.5",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-1.5 h-1.5 rounded-full bg-emerald-soft"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[9px] font-black text-emerald-soft uppercase",
            children: "Next"
          })]
        }), isCompleted && /*#__PURE__*/_jsxs("div", {
          className: "px-2 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(CheckCircle2, {
            size: 10,
            className: "text-emerald-soft"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[9px] font-bold text-zinc-400 uppercase",
            children: "Done"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-[9px] font-black tracking-[0.2em] uppercase mb-1 block",
          style: {
            color: isUnlocked ? mod.color : '#94A3B8'
          },
          children: ["Module ", mod.id]
        }), /*#__PURE__*/_jsx("h3", {
          className: `font-bold text-base leading-tight mb-1.5 ${isUnlocked ? 'text-white' : 'text-zinc-500'}`,
          children: mod.title
        }), /*#__PURE__*/_jsx("p", {
          className: "text-zinc-500 text-[11px] line-clamp-2 leading-relaxed",
          children: mod.description
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3 text-[10px] font-medium text-zinc-500",
          children: [/*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(BookOpen, {
              size: 10
            }), " ", cardCount, " Cards"]
          }), /*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-1",
            children: [/*#__PURE__*/_jsx(Clock, {
              size: 10
            }), " ", cardCount * 2, "m"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: `w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-white/5 group-hover:bg-white/10' : 'bg-transparent'}`,
          children: isUnlocked ? /*#__PURE__*/_jsx(ChevronRight, {
            size: 14,
            className: "text-zinc-400 group-hover:text-white transition-all"
          }) : /*#__PURE__*/_jsx(Lock, {
            size: 12,
            className: "text-zinc-700"
          })
        })]
      })]
    })]
  });
}

// ════════════════════════════════════════════════════════════════════════════
// RECENT ACTIVITY FEED
// ════════════════════════════════════════════════════════════════════════════
function buildActivityFeed(state) {
  const items = [];

  // Module completions
  Object.entries(state.moduleCompletionDates || {}).forEach(([modId, date]) => {
    const mod = modules.find(m => m.id === Number(modId));
    if (mod) items.push({
      id: `mod-${modId}`,
      icon: mod.emoji,
      text: `Module ${modId} complete kiya — "${mod.title}"`,
      time: date,
      color: mod.color
    });
  });

  // Health checkup
  if (state.healthCheckup?.completedAt) {
    items.push({
      id: 'health',
      icon: '🩺',
      text: `Financial checkup kiya — Score: ${state.healthCheckup.score}/100`,
      time: state.healthCheckup.completedAt,
      color: '#EC4899'
    });
  }

  // Recent goals
  state.goals.slice(-2).reverse().forEach(g => {
    items.push({
      id: `goal-${g.id}`,
      icon: g.emoji,
      text: `Naya goal set kiya — "${g.name}"`,
      time: g.createdAt,
      color: '#10B981'
    });
  });

  // Spin wheel wins
  if (state.totalSpins > 0) {
    items.push({
      id: 'spin',
      icon: '🎡',
      text: `${state.totalSpins} baar spin kiya, ${state.spinWinnings} coins jeete`,
      time: new Date().toISOString().split('T')[0],
      color: '#F59E0B'
    });
  }

  // Savings challenge
  if (state.savingsChallenge?.isActive) {
    items.push({
      id: 'savings-challenge',
      icon: '🔥',
      text: `Bachat challenge Day ${state.savingsChallenge.days.filter(d => d.saved).length}/${state.savingsChallenge.days.length} pe chal raha hai`,
      time: state.savingsChallenge.startDate,
      color: '#EF4444'
    });
  }

  // Sort by date desc, take 5
  return items.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
}
function RecentActivity() {
  const state = useAppStore();
  const items = useMemo(() => buildActivityFeed(state), [state]);
  if (items.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "text-center py-8",
      children: [/*#__PURE__*/_jsx("div", {
        className: "text-4xl mb-2 opacity-40",
        children: "\uD83D\uDCED"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted",
        children: "Abhi koi activity nahi. Tools try karo aur yahan dikhao! \uD83D\uDE80"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-2 max-h-80 overflow-y-auto pr-1",
    children: items.map((item, i) => /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        x: -10
      },
      animate: {
        opacity: 1,
        x: 0
      },
      transition: {
        delay: i * 0.06
      },
      className: "flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 hover:bg-white/[0.06] transition-colors",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0",
        style: {
          backgroundColor: `${item.color}20`,
          border: `1px solid ${item.color}30`
        },
        children: item.icon
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 min-w-0",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-xs font-semibold text-white truncate",
          children: item.text
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[10px] text-ink-muted mt-0.5",
          children: item.time
        })]
      }), /*#__PURE__*/_jsx(ChevronRight, {
        size: 14,
        className: "text-ink-muted/50 flex-shrink-0"
      })]
    }, item.id))
  });
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const {
    user,
    isAuthenticated,
    coins,
    streak,
    completedModules,
    badges,
    addCoins,
    healthCheckup,
    moduleProgress
  } = useAppStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const activeModuleIndex = modules.findIndex(m => !completedModules.includes(m.id));
  const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round(completedCards / totalCards * 100)) : 0;

  // Financial Health Score = weighted aggregate
  const healthScore = useMemo(() => {
    const moduleScore = completedModules.length / modules.length * 40;
    const progressScore = overallProgress / 100 * 30;
    const checkupScore = healthCheckup ? healthCheckup.score / 100 * 20 : 5;
    const coinScore = Math.min(10, coins / 50);
    return Math.min(100, Math.round(moduleScore + progressScore + checkupScore + coinScore));
  }, [completedModules.length, overallProgress, healthCheckup, coins]);
  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth');
  }, [hydrated, isAuthenticated, router]);
  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex(prev => (prev + 1) % QUOTES.length), 4500);
    return () => clearInterval(interval);
  }, []);
  if (!hydrated) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex min-h-screen items-center justify-center bg-midnight",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center gap-4",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-ink-muted text-sm",
          children: "Loading your progress..."
        })]
      })
    });
  }
  if (!isAuthenticated) return null;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Subah ki shubhkamnayein';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();
  const activeCardCount = activeModule ? getAllCardsForModule(activeModule.id).length : 0;
  const activeProgress = activeModule ? Math.round((moduleProgress[activeModule.id] || 0) / Math.max(activeCardCount - 1, 1) * 100) : 0;
  return /*#__PURE__*/_jsxs("main", {
    className: "relative min-h-screen w-full overflow-hidden bg-midnight",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "fixed inset-0 pointer-events-none z-0 overflow-hidden",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10",
      children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsx("div", {
        className: "mt-20",
        children: /*#__PURE__*/_jsx(FinanceTicker, {})
      }), /*#__PURE__*/_jsx("div", {
        className: "mx-auto max-w-6xl px-4 pt-8 pb-4",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "relative overflow-hidden rounded-[2rem] border border-white/10 glass-card-premium p-6 sm:p-8",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-20 -right-20 w-60 h-60 rounded-full bg-emerald/10 blur-3xl pointer-events-none"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex-1",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-xs font-bold text-emerald-soft uppercase tracking-widest mb-2",
                children: [greeting, " \uD83D\uDC4B"]
              }), /*#__PURE__*/_jsxs("h1", {
                className: "font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-2",
                children: ["Kya haal hai, ", user?.displayName?.split(' ')[0] ?? 'Champion', "! \uD83D\uDD25"]
              }), /*#__PURE__*/_jsx(AnimatePresence, {
                mode: "wait",
                children: /*#__PURE__*/_jsxs(motion.p, {
                  initial: {
                    opacity: 0,
                    x: -10
                  },
                  animate: {
                    opacity: 1,
                    x: 0
                  },
                  exit: {
                    opacity: 0,
                    x: 10
                  },
                  className: "text-sm text-ink-muted font-medium",
                  children: ["\"", QUOTES[quoteIndex], "\""]
                }, quoteIndex)
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "glass-card rounded-2xl p-4 flex-shrink-0",
              children: /*#__PURE__*/_jsx(HealthScoreGauge, {
                score: healthScore
              })
            })]
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "mx-auto max-w-6xl px-4 pb-4",
        children: /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
          children: [/*#__PURE__*/_jsx(StatCard, {
            delay: 0.05,
            emoji: /*#__PURE__*/_jsx("div", {
              className: "coin-spin-3d w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_4px_10px_rgba(245,158,11,0.4),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-amber-400/30",
              style: {
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))'
              },
              children: /*#__PURE__*/_jsx(IndianRupee, {
                size: 20,
                className: "text-white font-extrabold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]",
                style: {
                  transform: 'translateZ(4px)'
                }
              })
            }),
            label: "Total Coins",
            value: /*#__PURE__*/_jsx(AnimatedCounter, {
              target: coins
            }),
            accent: "#F59E0B",
            sub: coins >= 500 ? 'Big saver energy 💰' : 'Aur kamao! 🚀'
          }), /*#__PURE__*/_jsx(StatCard, {
            delay: 0.12,
            emoji: /*#__PURE__*/_jsx("span", {
              children: "\uD83D\uDD25"
            }),
            label: "Streak",
            value: `${streak} din`,
            accent: "#EF4444",
            sub: streak > 0 ? 'Lagatar jaari rakho! 💪' : 'Aaj shuru karo!'
          }), /*#__PURE__*/_jsx(StatCard, {
            delay: 0.19,
            emoji: /*#__PURE__*/_jsx("span", {
              children: "\uD83D\uDCDA"
            }),
            label: "Modules",
            value: `${completedModules.length}/${modules.length}`,
            accent: "#10B981",
            sub: `${overallProgress}% overall`
          }), /*#__PURE__*/_jsx(StatCard, {
            delay: 0.26,
            emoji: /*#__PURE__*/_jsx("span", {
              children: "\uD83C\uDFC6"
            }),
            label: "Badges",
            value: badges.length,
            accent: "#8B5CF6",
            sub: badges.length > 0 ? 'Trophy case bharte ja! ⭐' : 'Pehla badge kamao!'
          })]
        })
      }), activeModule && /*#__PURE__*/_jsx("div", {
        className: "mx-auto max-w-6xl px-4 pb-4",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.3
          },
          className: "relative overflow-hidden rounded-2xl border border-emerald/20 glass-card-glow p-5 sm:p-6 spotlight-card",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-30",
            style: {
              backgroundColor: activeModule.color
            }
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative flex flex-col sm:flex-row items-start sm:items-center gap-4",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg",
              style: {
                backgroundColor: `${activeModule.color}25`,
                border: `1px solid ${activeModule.color}40`
              },
              children: activeModule.emoji
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] font-black text-emerald-soft uppercase tracking-widest mb-1",
                children: "Continue Learning"
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display text-lg font-bold text-white mb-1 truncate",
                children: activeModule.title
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "flex-1 h-2 rounded-full bg-white/5 overflow-hidden max-w-xs",
                  children: /*#__PURE__*/_jsx(motion.div, {
                    initial: {
                      width: 0
                    },
                    animate: {
                      width: `${activeProgress}%`
                    },
                    transition: {
                      duration: 1,
                      delay: 0.4
                    },
                    className: "h-full rounded-full",
                    style: {
                      background: `linear-gradient(90deg, ${activeModule.color}, #34D399)`
                    }
                  })
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-xs font-bold text-white",
                  children: [activeProgress, "%"]
                })]
              })]
            }), /*#__PURE__*/_jsxs(motion.button, {
              whileHover: {
                scale: 1.04
              },
              whileTap: {
                scale: 0.96
              },
              onClick: () => router.push(`/dashboard/module/${activeModule.id}`),
              className: "btn-3d rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap flex items-center gap-2",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
              },
              children: ["Aage Badho ", /*#__PURE__*/_jsx(ArrowRight, {
                size: 16
              })]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "mx-auto max-w-6xl px-4 pb-4",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.35
          },
          children: [/*#__PURE__*/_jsxs("h2", {
            className: "font-display text-lg font-bold text-white mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Zap, {
              size: 18,
              className: "text-gold-soft"
            }), " Quick Access"]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3",
            children: QUICK_TOOLS.map((tool, i) => /*#__PURE__*/_jsxs(motion.button, {
              initial: {
                opacity: 0,
                scale: 0.8
              },
              animate: {
                opacity: 1,
                scale: 1
              },
              transition: {
                delay: 0.4 + i * 0.04
              },
              whileHover: {
                y: -4,
                scale: 1.05
              },
              whileTap: {
                scale: 0.95
              },
              onClick: () => router.push('/tools'),
              className: "card-3d glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 group",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110",
                style: {
                  backgroundColor: `${tool.color}20`,
                  border: `1px solid ${tool.color}30`
                },
                children: tool.emoji
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[11px] sm:text-xs font-bold text-white",
                children: tool.label
              })]
            }, tool.id))
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "mx-auto max-w-6xl px-4 pt-4 pb-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-2xl font-extrabold text-white tracking-tight",
              children: "Financial Journey Map \uD83D\uDDFA\uFE0F"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted mt-1 max-w-xl",
              children: "Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! \uD83D\uDE80"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-2 h-2 rounded-full bg-emerald-soft animate-pulse"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-[10px] font-bold text-white/60 uppercase tracking-widest",
              children: [completedModules.length, " of ", modules.length, " Completed"]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          children: modules.map((mod, i) => {
            const isUnlocked = i === 0 || completedModules.includes(modules[i - 1].id);
            const isActive = i === activeModuleIndex;
            return /*#__PURE__*/_jsx(ModuleCard, {
              mod: mod,
              index: i,
              isUnlocked: isUnlocked,
              isActive: isActive,
              onClick: () => router.push(`/dashboard/module/${mod.id}`)
            }, mod.id);
          })
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mx-auto max-w-6xl px-4 pt-6 pb-12",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.4
          },
          className: "rounded-2xl border border-white/10 glass-card p-5 sm:p-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-4",
            children: [/*#__PURE__*/_jsxs("h2", {
              className: "font-display text-lg font-bold text-white flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                size: 18,
                className: "text-ai"
              }), " Recent Activity"]
            }), /*#__PURE__*/_jsxs(Link, {
              href: "/tools",
              className: "text-xs font-bold text-emerald-soft hover:underline flex items-center gap-1",
              children: ["All tools ", /*#__PURE__*/_jsx(ChevronRight, {
                size: 12
              })]
            })]
          }), /*#__PURE__*/_jsx(RecentActivity, {})]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "text-center py-8 border-t border-white/[0.03]",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]",
          children: "Money Matters"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-ink-muted mt-2",
          children: "Paisa Samjho, Future Secure Karo! \uD83D\uDC9A"
        })]
      })]
    })]
  });
}