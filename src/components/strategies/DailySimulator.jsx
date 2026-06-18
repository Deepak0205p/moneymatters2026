'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyChoices } from '@/lib/data/daily-choices';
import { useAppStore } from '@/lib/store/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wallet, RotateCcw, Sun, Clock, Moon, Sunrise, AlertTriangle, PiggyBank, ChevronRight } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─── Period config ─────────────────────────────────────────
const periodConfig = {
  morning: {
    icon: Sunrise,
    label: 'Morning',
    color: '#f59e0b'
  },
  afternoon: {
    icon: Sun,
    label: 'Afternoon',
    color: '#f97316'
  },
  evening: {
    icon: Clock,
    label: 'Evening',
    color: '#8b5cf6'
  },
  night: {
    icon: Moon,
    label: 'Night',
    color: '#6366f1'
  }
};

// ─── Default monthly income for daily budget ───────────────
const DEFAULT_MONTHLY_INCOME = 20000;
const DAILY_BUDGET = Math.round(DEFAULT_MONTHLY_INCOME / 30);
export default function DailySimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [walletBalance, setWalletBalance] = useState(DAILY_BUDGET);
  const [choices, setChoices] = useState([]);
  const [showConsequence, setShowConsequence] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const {
    addCoins,
    setDailySimDay,
    dailySimDay
  } = useAppStore();
  const totalSpent = choices.reduce((s, c) => s + c.cost, 0);
  const currentChoice = dailyChoices[currentStep];
  const isOverspent = walletBalance < 0;

  // ─── Timeline progress ───────────────────────────────
  const timelinePeriods = ['morning', 'afternoon', 'evening', 'night'];
  const currentPeriod = currentChoice?.period || 'morning';

  // ─── Handle choice ───────────────────────────────────
  const handleChoice = useCallback(option => {
    if (!currentChoice || showConsequence) return;
    const data = option === 'A' ? currentChoice.optionA : currentChoice.optionB;
    const newBalance = walletBalance - data.cost;
    setLastChoice({
      option,
      data
    });
    setWalletBalance(newBalance);
    setChoices(prev => [...prev, {
      choiceId: currentChoice.id,
      option,
      cost: data.cost
    }]);
    setShowConsequence(true);
  }, [currentChoice, walletBalance, showConsequence]);

  // ─── Next step ───────────────────────────────────────
  const handleNext = useCallback(() => {
    if (currentStep + 1 >= dailyChoices.length) {
      setIsComplete(true);
      setDailySimDay(dailySimDay + 1);
      if (walletBalance > 0) addCoins(10);
      return;
    }
    setCurrentStep(prev => prev + 1);
    setShowConsequence(false);
    setLastChoice(null);
  }, [currentStep, walletBalance, setDailySimDay, dailySimDay, addCoins]);

  // ─── Reset ───────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setWalletBalance(DAILY_BUDGET);
    setChoices([]);
    setShowConsequence(false);
    setLastChoice(null);
    setIsComplete(false);
  }, []);

  // ─── Savings tip ─────────────────────────────────────
  const savingsTip = useMemo(() => {
    const monthlyExtra = Math.abs(DAILY_BUDGET - totalSpent) * 30;
    if (totalSpent <= DAILY_BUDGET) {
      return `Agar roz itna bachao toh mahine mein ${formatCurrency(monthlyExtra)} bachenge — yeh SIP mein daalo toh 10 saal mein ${formatCurrency(Math.round(monthlyExtra * 230))}+!`;
    }
    return `Roz itna zyada kharcha karoge toh mahine mein ${formatCurrency(monthlyExtra)} deficit! Credit card pe daaloge toh 36% interest lagega!`;
  }, [totalSpent]);

  // ─── Completion screen ───────────────────────────────
  if (isComplete) {
    const savedAmount = DAILY_BUDGET - totalSpent;
    const isPositive = savedAmount >= 0;
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center w-full max-w-lg mx-auto px-4 py-6 text-center",
      children: [/*#__PURE__*/_jsx(motion.div, {
        initial: {
          scale: 0
        },
        animate: {
          scale: 1
        },
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 15
        },
        children: isPositive ? /*#__PURE__*/_jsx(PiggyBank, {
          className: "w-16 h-16 text-emerald-400 mx-auto mb-3"
        }) : /*#__PURE__*/_jsx(AlertTriangle, {
          className: "w-16 h-16 text-red-400 mx-auto mb-3"
        })
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-bold text-white mb-2",
        children: isPositive ? 'Din Bachat Mein! 🎉' : 'Budget Over! 😱'
      }), /*#__PURE__*/_jsx("div", {
        className: "w-full glass-card-premium bg-[#12121a] rounded-xl p-5 mb-4 border border-white/5",
        children: /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-4 text-center",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-[10px] text-[#a0a0b8] font-medium",
              children: "Daily Budget"
            }), /*#__PURE__*/_jsx("div", {
              className: "text-lg font-bold text-amber-400",
              children: formatCurrency(DAILY_BUDGET)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-[10px] text-[#a0a0b8] font-medium",
              children: "Total Spent"
            }), /*#__PURE__*/_jsx("div", {
              className: "text-lg font-bold text-red-400",
              children: formatCurrency(totalSpent)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-[10px] text-[#a0a0b8] font-medium",
              children: "Saved / Over"
            }), /*#__PURE__*/_jsxs("div", {
              className: `text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`,
              children: [isPositive ? '+' : '', formatCurrency(savedAmount)]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-[10px] text-[#a0a0b8] font-medium",
              children: "Smart Choices"
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-lg font-bold text-emerald-400",
              children: [choices.filter(c => c.option === 'A').length, "/", choices.length]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 10
        },
        animate: {
          opacity: 1,
          y: 0
        },
        className: "w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4",
        children: /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-amber-200 font-medium",
          children: ["\uD83D\uDCA1 ", savingsTip]
        })
      }), /*#__PURE__*/_jsxs(Button, {
        onClick: handleReset,
        className: "bg-amber-500 hover:bg-amber-600 text-black font-semibold",
        children: [/*#__PURE__*/_jsx(RotateCcw, {
          className: "w-4 h-4 mr-2"
        }), "Phir Se Khelo"]
      })]
    });
  }

  // ─── Period icon ─────────────────────────────────────
  const PeriodIcon = periodConfig[currentPeriod]?.icon || Sun;
  const periodColor = periodConfig[currentPeriod]?.color || '#f59e0b';
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center w-full max-w-lg mx-auto px-3 sm:px-4 py-4 gap-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "strategy-header-gradient text-center rounded-xl py-2",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl sm:text-2xl font-bold text-gradient-gold mb-1",
        children: "Ek Din Ka Kharcha \uD83D\uDCB8"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-[#a0a0b8] font-medium",
        children: "Ek din ka budget \u2014 smart choices banao!"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: `w-full card-dark rounded-xl p-3 ${currentPeriod === 'night' ? 'nighttime-gradient' : 'daytime-gradient'}`,
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(motion.div, {
            animate: {
              rotateY: walletBalance > DAILY_BUDGET * 0.5 ? [0, 360] : 0
            },
            transition: {
              duration: 0.6,
              ease: 'easeInOut'
            },
            children: /*#__PURE__*/_jsx(Wallet, {
              size: 18,
              className: isOverspent ? 'text-red-400' : 'text-amber-400'
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "text-sm text-[#a0a0b8] font-medium",
            children: "Wallet Balance"
          })]
        }), /*#__PURE__*/_jsx(motion.span, {
          initial: {
            scale: 1.2,
            color: isOverspent ? '#ef4444' : '#f59e0b'
          },
          animate: {
            scale: 1,
            color: isOverspent ? '#ef4444' : '#f59e0b'
          },
          className: "text-lg font-bold",
          children: formatCurrency(Math.max(0, walletBalance))
        }, walletBalance)]
      }), /*#__PURE__*/_jsx(Progress, {
        value: Math.max(0, walletBalance / DAILY_BUDGET * 100),
        className: "h-2"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mt-1",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-[10px] text-[#a0a0b8] font-medium",
          children: ["Daily Budget: ", formatCurrency(DAILY_BUDGET)]
        }), isOverspent && /*#__PURE__*/_jsxs(motion.span, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          className: "text-[10px] text-red-400 font-semibold flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(AlertTriangle, {
            size: 10
          }), " Overspent by ", formatCurrency(Math.abs(walletBalance))]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 mb-2",
        children: [/*#__PURE__*/_jsx(PeriodIcon, {
          size: 16,
          style: {
            color: periodColor
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "time-indicator"
        }), /*#__PURE__*/_jsxs(Badge, {
          variant: "outline",
          className: "text-[10px]",
          style: {
            color: periodColor,
            borderColor: `${periodColor}40`
          },
          children: [currentChoice.time, " \u2014 ", periodConfig[currentPeriod]?.label]
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-white font-medium mb-3",
        children: currentChoice.scenario
      }), !showConsequence ? /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
        children: [/*#__PURE__*/_jsx(motion.div, {
          whileHover: {
            scale: 1.03
          },
          whileTap: {
            scale: 0.97
          },
          children: /*#__PURE__*/_jsx(Card, {
            className: "cursor-pointer border-0 bg-emerald-950/30 hover:bg-emerald-950/50 transition-colors",
            style: {
              border: '1px solid rgba(34,197,94,0.2)'
            },
            onClick: () => handleChoice('A'),
            children: /*#__PURE__*/_jsxs(CardContent, {
              className: "p-4 text-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-2xl",
                children: currentChoice.optionA.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs font-semibold text-emerald-400 mt-1",
                children: "Smart Choice"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm font-bold text-white mt-1",
                children: currentChoice.optionA.label
              })]
            })
          })
        }), /*#__PURE__*/_jsx(motion.div, {
          whileHover: {
            scale: 1.03
          },
          whileTap: {
            scale: 0.97
          },
          children: /*#__PURE__*/_jsx(Card, {
            className: "cursor-pointer border-0 bg-red-950/30 hover:bg-red-950/50 transition-colors",
            style: {
              border: '1px solid rgba(239,68,68,0.2)'
            },
            onClick: () => handleChoice('B'),
            children: /*#__PURE__*/_jsxs(CardContent, {
              className: "p-4 text-center",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-2xl",
                children: currentChoice.optionB.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs font-semibold text-red-400 mt-1",
                children: "Expensive"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm font-bold text-white mt-1",
                children: currentChoice.optionB.label
              })]
            })
          })
        })]
      }) :
      /*#__PURE__*/
      /* ── Consequence ────────────────────────────── */
      _jsx(AnimatePresence, {
        mode: "wait",
        children: /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          exit: {
            opacity: 0,
            y: -20
          },
          children: /*#__PURE__*/_jsx(Card, {
            className: "border-0",
            style: {
              backgroundColor: lastChoice?.option === 'A' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${lastChoice?.option === 'A' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
            },
            children: /*#__PURE__*/_jsxs(CardContent, {
              className: "p-4",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "text-center mb-3",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-3xl",
                  children: lastChoice?.data.emoji
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-sm font-bold text-white mt-1",
                  children: [lastChoice?.data.label, " \u2014 ", formatCurrency(lastChoice?.data.cost || 0)]
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-[#e8e8ed] text-center mb-3",
                children: lastChoice?.data.consequence
              }), /*#__PURE__*/_jsxs(Button, {
                onClick: handleNext,
                className: "w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold",
                children: [currentStep + 1 >= dailyChoices.length ? 'Din Ka Summary →' : 'Agle Decision →', /*#__PURE__*/_jsx(ChevronRight, {
                  size: 14,
                  className: "ml-1"
                })]
              })]
            })
          })
        }, currentStep)
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full bg-[#12121a] border border-white/10 rounded-xl p-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-2",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-[10px] text-[#a0a0b8] font-medium",
          children: "Day Progress"
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-[10px] text-amber-400",
          children: [currentStep + 1, "/", dailyChoices.length, " decisions"]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex items-center gap-1 mb-2",
        children: timelinePeriods.map(p => {
          const Icon = periodConfig[p].icon;
          const isActive = p === currentPeriod;
          const isPast = timelinePeriods.indexOf(p) < timelinePeriods.indexOf(currentPeriod);
          return /*#__PURE__*/_jsxs("div", {
            className: "flex-1 flex flex-col items-center",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-7 h-7 rounded-full flex items-center justify-center mb-0.5",
              style: {
                backgroundColor: isActive || isPast ? `${periodConfig[p].color}30` : '#1a1a2e',
                border: isActive ? `1px solid ${periodConfig[p].color}` : '1px solid rgba(255,255,255,0.06)'
              },
              children: /*#__PURE__*/_jsx(Icon, {
                size: 12,
                style: {
                  color: isActive || isPast ? periodConfig[p].color : '#8888a0'
                }
              })
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[8px]",
              style: {
                color: isActive ? periodConfig[p].color : '#8888a0'
              },
              children: periodConfig[p].label
            })]
          }, p);
        })
      }), /*#__PURE__*/_jsx(Progress, {
        value: (currentStep + 1) / dailyChoices.length * 100,
        className: "h-2"
      })]
    }), /*#__PURE__*/_jsxs("button", {
      onClick: handleReset,
      className: "text-xs text-[#a0a0b8]/60 hover:text-[#a0a0b8] flex items-center gap-1 transition-colors",
      children: [/*#__PURE__*/_jsx(RotateCcw, {
        size: 12
      }), " Shuru se karo"]
    })]
  });
}