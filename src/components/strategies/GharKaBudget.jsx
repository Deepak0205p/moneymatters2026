'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Home, UtensilsCrossed, Bus, Gamepad2, PiggyBank, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SALARY = 25000;
const CAT_META = {
  rent: {
    label: 'Rent / Kiraya',
    emoji: '🏠',
    icon: Home,
    color: '#8B5CF6',
    idealPct: 30,
    max: 15000
  },
  food: {
    label: 'Food / Khana',
    emoji: '🍔',
    icon: UtensilsCrossed,
    color: '#F59E0B',
    idealPct: 25,
    max: 10000
  },
  transport: {
    label: 'Transport / Safar',
    emoji: '🚌',
    icon: Bus,
    color: '#06B6D4',
    idealPct: 10,
    max: 6000
  },
  entertainment: {
    label: 'Fun / Manoranjan',
    emoji: '🎬',
    icon: Gamepad2,
    color: '#EC4899',
    idealPct: 10,
    max: 8000
  },
  savings: {
    label: 'Savings / Bachat',
    emoji: '🐷',
    icon: PiggyBank,
    color: '#10B981',
    idealPct: 25,
    max: 12000
  }
};
const INITIAL = {
  rent: 8000,
  food: 6000,
  transport: 2500,
  entertainment: 2500,
  savings: 6000
};
export default function GharKaBudget() {
  const addCoins = useAppStore(s => s.addCoins);
  const [budget, setBudget] = useState(INITIAL);
  const [rewarded, setRewarded] = useState(false);
  const total = useMemo(() => Object.values(budget).reduce((a, b) => a + b, 0), [budget]);
  const remaining = SALARY - total;
  const savingsPct = budget.savings / SALARY * 100;

  // Budget health score (0-100)
  const health = useMemo(() => {
    let score = 100;
    Object.keys(CAT_META).forEach(k => {
      const ideal = CAT_META[k].idealPct / 100 * SALARY;
      const diff = Math.abs(budget[k] - ideal) / ideal;
      score -= Math.min(diff * 25, 20);
    });
    if (total > SALARY) score -= 40;
    if (savingsPct < 20) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [budget, total, savingsPct]);
  const healthColor = health >= 75 ? '#10B981' : health >= 45 ? '#F59E0B' : '#EF4444';
  const healthLabel = health >= 75 ? 'Bilkul Perfect!' : health >= 45 ? 'Thoda Sudhar' : 'Khataranak!';

  // Tip generation
  const tips = useMemo(() => {
    const t = [];
    if (budget.rent > SALARY * 0.35) t.push('🏢 Rent bahut zyada hai. PG ya sharing try karo.');
    if (budget.food > SALARY * 0.3) t.push('🍔 Bahar ka khana kam karo. Meal prep se 40% bachat.');
    if (budget.entertainment > SALARY * 0.15) t.push('🎬 Fun budget thoda kam. Free activities explore karo.');
    if (budget.transport > SALARY * 0.15) t.push('🚌 Metro/PUC pass lo. Daily auto se mehenga padta hai.');
    if (savingsPct < 20) t.push('🐷 Bhai, future ke liye kuch toh bachao! 20% minimum target.');
    if (t.length === 0) t.push('✨ MAST! Tumhara budget perfectly balanced hai!');
    return t;
  }, [budget, savingsPct]);

  // Reward once when healthy
  const computeHealth = b => {
    let score = 100;
    Object.keys(CAT_META).forEach(k => {
      const ideal = CAT_META[k].idealPct / 100 * SALARY;
      const diff = Math.abs(b[k] - ideal) / ideal;
      score -= Math.min(diff * 25, 20);
    });
    const tot = Object.values(b).reduce((a, b2) => a + b2, 0);
    if (tot > SALARY) score -= 40;
    if (b.savings / SALARY * 100 < 20) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score)));
  };
  const updateCat = (k, v) => {
    const next = {
      ...budget,
      [k]: v
    };
    setBudget(next);
    const newHealth = computeHealth(next);
    if (newHealth >= 75 && !rewarded) {
      setRewarded(true);
      addCoins(15);
    } else if (newHealth < 60 && rewarded) {
      setRewarded(false);
    }
  };

  // Room visual cues
  const rentPct = budget.rent / SALARY;
  const fridgeEmpty = budget.food < SALARY * 0.15;
  const hasTV = budget.entertainment >= SALARY * 0.08;
  const hasGaming = budget.entertainment >= SALARY * 0.12;
  const piggyGlow = savingsPct >= 20;
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "font-display text-3xl md:text-4xl font-bold text-gradient-emerald",
        children: "Ghar Ka Budget \uD83C\uDFE0"
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-zinc-400 mt-2",
        children: ["Salary ", /*#__PURE__*/_jsxs("span", {
          className: "text-amber-400 font-bold",
          children: ["\u20B9", SALARY.toLocaleString('en-IN')]
        }), " ko 5 hisso mein baanto. Smart allocation = happy life!"]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid lg:grid-cols-3 gap-5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "lg:col-span-2 glass-card rounded-2xl p-5",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-3",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-display text-lg font-semibold text-white",
            children: "Tumhara Kamra"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-xs text-zinc-400",
            children: "Budget hisaab se badalta hai"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-500",
          style: {
            borderColor: piggyGlow ? 'rgba(16,185,129,0.4)' : 'rgba(148,163,184,0.25)',
            background: 'linear-gradient(180deg, rgba(16,185,129,0.06), rgba(11,18,32,0.6))',
            height: `${200 + rentPct * 220}px`
          },
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute top-3 left-3 w-16 h-16 rounded-lg border-2 border-cyan-400/40 bg-cyan-400/5 flex items-center justify-center text-2xl",
            children: "\uD83E\uDE9F"
          }), /*#__PURE__*/_jsx(motion.div, {
            animate: {
              scale: 0.8 + rentPct * 0.6
            },
            className: "absolute bottom-3 left-3 text-4xl",
            children: "\uD83D\uDECF\uFE0F"
          }), /*#__PURE__*/_jsx(motion.div, {
            animate: {
              opacity: fridgeEmpty ? 0.4 : 1
            },
            className: "absolute top-3 right-3 text-4xl",
            children: fridgeEmpty ? '🧊' : '🧺'
          }), /*#__PURE__*/_jsx(AnimatePresence, {
            children: hasTV && /*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0,
                rotate: -20
              },
              animate: {
                scale: 1,
                rotate: 0
              },
              exit: {
                scale: 0
              },
              className: "absolute bottom-3 right-3 text-4xl",
              children: "\uD83D\uDCFA"
            })
          }), /*#__PURE__*/_jsx(AnimatePresence, {
            children: hasGaming && /*#__PURE__*/_jsx(motion.div, {
              initial: {
                y: -20,
                opacity: 0
              },
              animate: {
                y: 0,
                opacity: 1
              },
              exit: {
                opacity: 0,
                y: -20
              },
              className: "absolute bottom-3 right-16 text-3xl",
              children: "\uD83C\uDFAE"
            })
          }), /*#__PURE__*/_jsx(motion.div, {
            animate: {
              scale: piggyGlow ? [1, 1.15, 1] : 1,
              filter: piggyGlow ? 'drop-shadow(0 0 14px #10B981)' : 'none'
            },
            transition: {
              repeat: piggyGlow ? Infinity : 0,
              duration: 2
            },
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl",
            children: "\uD83D\uDC37"
          }), !piggyGlow && /*#__PURE__*/_jsx("div", {
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-10 text-xs text-red-400 font-semibold",
            children: "Piggy so raha hai \uD83D\uDE34"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "mt-4 space-y-1.5",
          children: tips.map((t, i) => /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: -10
            },
            animate: {
              opacity: 1,
              x: 0
            },
            className: "text-sm text-zinc-300 flex items-start gap-2",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-4 h-4 text-amber-400 mt-0.5 shrink-0"
            }), /*#__PURE__*/_jsx("span", {
              children: t
            })]
          }, i))
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "glass-card rounded-2xl p-5 flex flex-col",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "font-display text-lg font-semibold text-white mb-3",
          children: "Budget Health"
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative w-32 h-32 mx-auto",
          children: [/*#__PURE__*/_jsxs("svg", {
            viewBox: "0 0 120 120",
            className: "w-full h-full -rotate-90",
            children: [/*#__PURE__*/_jsx("circle", {
              cx: "60",
              cy: "60",
              r: "50",
              fill: "none",
              stroke: "rgba(255,255,255,0.08)",
              strokeWidth: "10"
            }), /*#__PURE__*/_jsx(motion.circle, {
              cx: "60",
              cy: "60",
              r: "50",
              fill: "none",
              stroke: healthColor,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: 314,
              animate: {
                strokeDashoffset: 314 - 314 * health / 100
              },
              transition: {
                type: 'spring',
                stiffness: 60
              },
              style: {
                filter: `drop-shadow(0 0 8px ${healthColor})`
              }
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "absolute inset-0 flex flex-col items-center justify-center",
            children: [/*#__PURE__*/_jsx(motion.span, {
              initial: {
                scale: 0.6,
                opacity: 0
              },
              animate: {
                scale: 1,
                opacity: 1
              },
              className: "font-display text-3xl font-bold",
              style: {
                color: healthColor
              },
              children: health
            }, health), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-zinc-400",
              children: "/ 100"
            })]
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-center mt-3 font-semibold",
          style: {
            color: healthColor
          },
          children: healthLabel
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-4 space-y-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex justify-between text-xs text-zinc-400",
            children: [/*#__PURE__*/_jsx("span", {
              children: "Kharcha"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-white",
              children: ["\u20B9", total.toLocaleString('en-IN')]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex justify-between text-xs text-zinc-400",
            children: [/*#__PURE__*/_jsx("span", {
              children: "Bacha"
            }), /*#__PURE__*/_jsxs("span", {
              className: remaining >= 0 ? 'text-emerald-400' : 'text-red-400',
              children: ["\u20B9", remaining.toLocaleString('en-IN')]
            })]
          }), /*#__PURE__*/_jsx(AnimatePresence, {
            children: remaining < 0 && /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                opacity: 0,
                height: 0
              },
              animate: {
                opacity: 1,
                height: 'auto'
              },
              exit: {
                opacity: 0,
                height: 0
              },
              className: "mt-2 p-2 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(AlertTriangle, {
                className: "w-4 h-4"
              }), "Salary se zyada kharcha! \u20B9", Math.abs(remaining).toLocaleString('en-IN'), " kam karo."]
            })
          }), savingsPct < 20 && remaining >= 0 && /*#__PURE__*/_jsxs("div", {
            className: "mt-2 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(AlertTriangle, {
              className: "w-4 h-4"
            }), "Bhai, future ke liye kuch toh bachao! 20% target karo."]
          }), savingsPct >= 20 && remaining >= 0 && /*#__PURE__*/_jsxs("div", {
            className: "mt-2 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(CheckCircle2, {
              className: "w-4 h-4"
            }), "Sahi ja raho ho! Savings ", savingsPct.toFixed(0), "% \uD83D\uDC4F"]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-4",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "font-display text-lg font-semibold text-white",
          children: "Paisa Baanto"
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-sm",
          children: ["Total:", ' ', /*#__PURE__*/_jsxs("span", {
            className: `font-bold number-highlight ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`,
            children: ["\u20B9", total.toLocaleString('en-IN'), " / \u20B9", SALARY.toLocaleString('en-IN')]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "grid md:grid-cols-2 gap-4",
        children: Object.keys(CAT_META).map(k => {
          const meta = CAT_META[k];
          const Icon = meta.icon;
          const pct = (budget[k] / SALARY * 100).toFixed(0);
          return /*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-xl",
                  children: meta.emoji
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-sm font-medium text-white",
                  children: meta.label
                })]
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm font-bold",
                style: {
                  color: meta.color
                },
                children: ["\u20B9", budget[k].toLocaleString('en-IN'), /*#__PURE__*/_jsxs("span", {
                  className: "text-zinc-500 text-xs ml-1",
                  children: ["(", pct, "%)"]
                })]
              })]
            }), /*#__PURE__*/_jsx("input", {
              type: "range",
              min: 0,
              max: meta.max,
              step: 500,
              value: budget[k],
              onChange: e => updateCat(k, Number(e.target.value)),
              className: "w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500",
              style: {
                background: `linear-gradient(90deg, ${meta.color} 0%, ${meta.color} ${budget[k] / meta.max * 100}%, rgba(255,255,255,0.1) ${budget[k] / meta.max * 100}%)`
              }
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-[10px] text-zinc-500 mt-1",
              children: [/*#__PURE__*/_jsxs("span", {
                children: ["Ideal: ", meta.idealPct, "%"]
              }), /*#__PURE__*/_jsx(Icon, {
                className: "w-3 h-3"
              })]
            })]
          }, k);
        })
      })]
    })]
  });
}