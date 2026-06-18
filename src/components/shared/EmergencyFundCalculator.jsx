'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Plus, Minus, IndianRupee, AlertTriangle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Emergency Fund Calculator — Protection Shield concept
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const EXPENSE_ROWS = [{
  key: 'rent',
  label: 'Rent / Hostel',
  emoji: '🏠',
  defaultValue: 8000,
  color: '#f43f5e'
}, {
  key: 'food',
  label: 'Khana',
  emoji: '🍛',
  defaultValue: 5000,
  color: '#f59e0b'
}, {
  key: 'transport',
  label: 'Travel',
  emoji: '🚗',
  defaultValue: 2000,
  color: '#3b82f6'
}, {
  key: 'utilities',
  label: 'Bills (Phone/Net)',
  emoji: '⚡',
  defaultValue: 1000,
  color: '#10b981'
}, {
  key: 'emi',
  label: 'EMI / Loan',
  emoji: '💳',
  defaultValue: 0,
  color: '#a855f7'
}, {
  key: 'other',
  label: 'Aur Kharcha',
  emoji: '📦',
  defaultValue: 1500,
  color: '#94a3b8'
}];
const JOB_CONFIG = {
  student: {
    label: 'Student',
    emoji: '🎓',
    months: 3,
    color: 'text-violet-400'
  },
  employed: {
    label: 'Employed',
    emoji: '💼',
    months: 6,
    color: 'text-emerald-400'
  },
  freelancer: {
    label: 'Freelancer',
    emoji: '💻',
    months: 9,
    color: 'text-amber-400'
  }
};
const DEPENDENT_OPTIONS = [0, 1, 2, 3, 4];
export default function EmergencyFundCalculator({
  open,
  onClose
}) {
  const {
    addCoins,
    addBadge
  } = useAppStore();
  const [expenses, setExpenses] = useState(Object.fromEntries(EXPENSE_ROWS.map(r => [r.key, r.defaultValue])));
  const [job, setJob] = useState('student');
  const [dependents, setDependents] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [targetReached, setTargetReached] = useState(false);
  const monthlyExpense = useMemo(() => Object.values(expenses).reduce((s, v) => s + v, 0), [expenses]);

  /* Target: monthlyExpense × job months + dependents buffer (₹10k per dependent) */
  const target = useMemo(() => {
    const base = monthlyExpense * JOB_CONFIG[job].months;
    const dependentBuffer = dependents * 10000;
    return base + dependentBuffer;
  }, [monthlyExpense, job, dependents]);

  /* Recommended monthly saving plan: target ÷ 12 months */
  const monthlySavingPlan = useMemo(() => Math.ceil(target / 12), [target]);
  const monthsToReach = useMemo(() => monthlySavingPlan > 0 ? Math.ceil((target - currentSavings) / monthlySavingPlan) : 0, [target, currentSavings, monthlySavingPlan]);

  /* Protection % */
  const protectionPct = target > 0 ? Math.min(100, currentSavings / target * 100) : 0;

  /* Shield tier */
  const tier = useMemo(() => {
    if (protectionPct >= 75) return {
      key: 'full',
      label: 'Fully Protected!',
      emoji: '🛡️✨',
      color: '#f59e0b',
      desc: 'Tum super ho! Abhi sab safe hai.',
      ring: 'rgba(245,158,11,0.6)'
    };
    if (protectionPct >= 50) return {
      key: 'strong',
      label: 'Strong Shield',
      emoji: '🛡️',
      color: '#10b981',
      desc: 'Ache ho! Almost there 💪',
      ring: 'rgba(16,185,129,0.5)'
    };
    if (protectionPct >= 25) return {
      key: 'half',
      label: 'Half Shield',
      emoji: '⚠️',
      color: '#f59e0b',
      desc: 'Thoda safe ho, par abhi aur chahiye.',
      ring: 'rgba(245,158,11,0.4)'
    };
    return {
      key: 'broken',
      label: 'Broken Shield',
      emoji: '🚨',
      color: '#ef4444',
      desc: 'Bahut khatre mein ho! Shuru karo abhi.',
      ring: 'rgba(239,68,68,0.4)'
    };
  }, [protectionPct]);
  useEffect(() => {
    if (protectionPct >= 75 && !targetReached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetReached(true);
      addBadge('emergency-shielded');
      addCoins(25);
      toast({
        title: 'Shield fully protected! +25 coins 🛡️✨'
      });
    }
  }, [protectionPct, targetReached, addBadge, addCoins]);
  const updateExpense = (key, delta) => {
    setExpenses(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };
  const setExpenseValue = (key, value) => {
    setExpenses(prev => ({
      ...prev,
      [key]: Math.max(0, value)
    }));
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Emergency Fund Calculator"
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-1",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
            children: /*#__PURE__*/_jsx(Shield, {
              className: "w-5 h-5 text-emerald-400"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-bold heading-gradient",
              children: "Protection Shield \uD83D\uDEE1\uFE0F"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8]",
              children: "Apna emergency fund banao"
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid place-items-center py-4 relative",
          children: [/*#__PURE__*/_jsxs(motion.div, {
            initial: {
              scale: 0.85
            },
            animate: {
              scale: 1
            },
            transition: {
              type: 'spring',
              stiffness: 200,
              damping: 18
            },
            className: "relative",
            children: [/*#__PURE__*/_jsx(motion.div, {
              animate: {
                boxShadow: `0 0 60px ${tier.ring}, 0 0 100px ${tier.ring}`
              },
              transition: {
                duration: 0.6
              },
              className: "absolute inset-0 rounded-full"
            }), /*#__PURE__*/_jsxs("svg", {
              width: "180",
              height: "200",
              viewBox: "0 0 180 200",
              className: "relative",
              children: [/*#__PURE__*/_jsxs("defs", {
                children: [/*#__PURE__*/_jsxs("linearGradient", {
                  id: "shieldGrad",
                  x1: "0%",
                  y1: "0%",
                  x2: "0%",
                  y2: "100%",
                  children: [/*#__PURE__*/_jsx("stop", {
                    offset: "0%",
                    stopColor: tier.color,
                    stopOpacity: "0.4"
                  }), /*#__PURE__*/_jsx("stop", {
                    offset: "100%",
                    stopColor: tier.color,
                    stopOpacity: "0.1"
                  })]
                }), /*#__PURE__*/_jsxs("linearGradient", {
                  id: "shieldFill",
                  x1: "0%",
                  y1: "0%",
                  x2: "0%",
                  y2: "100%",
                  children: [/*#__PURE__*/_jsx("stop", {
                    offset: "0%",
                    stopColor: tier.color,
                    stopOpacity: "0.9"
                  }), /*#__PURE__*/_jsx("stop", {
                    offset: "100%",
                    stopColor: tier.color,
                    stopOpacity: "0.5"
                  })]
                })]
              }), /*#__PURE__*/_jsx("path", {
                d: "M90 15 L160 40 L160 110 Q160 160 90 185 Q20 160 20 110 L20 40 Z",
                fill: "url(#shieldGrad)",
                stroke: tier.color,
                strokeWidth: "3",
                opacity: "0.4"
              }), /*#__PURE__*/_jsx(motion.path, {
                d: "M90 15 L160 40 L160 110 Q160 160 90 185 Q20 160 20 110 L20 40 Z",
                fill: "url(#shieldFill)",
                opacity: "0.7",
                style: {
                  clipPath: `inset(${100 - protectionPct}% 0% 0% 0%)`
                },
                animate: {
                  clipPath: `inset(${100 - protectionPct}% 0% 0% 0%)`
                },
                transition: {
                  duration: 0.8,
                  ease: 'easeOut'
                }
              }), tier.key === 'broken' && /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx("path", {
                  d: "M90 60 L80 90 L100 120 L85 150",
                  stroke: "#ef4444",
                  strokeWidth: "1.5",
                  fill: "none",
                  opacity: "0.6"
                }), /*#__PURE__*/_jsx("path", {
                  d: "M60 80 L75 100 L65 130",
                  stroke: "#ef4444",
                  strokeWidth: "1.2",
                  fill: "none",
                  opacity: "0.5"
                })]
              }), /*#__PURE__*/_jsx("text", {
                x: "90",
                y: "105",
                fontSize: "48",
                textAnchor: "middle",
                className: "font-display",
                style: {
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
                },
                children: tier.key === 'broken' ? '🚨' : tier.key === 'full' ? '✨' : '🛡️'
              }), /*#__PURE__*/_jsxs("text", {
                x: "90",
                y: "145",
                fontSize: "20",
                textAnchor: "middle",
                fontWeight: "bold",
                fill: "#F8FAFC",
                className: "font-display",
                children: [Math.round(protectionPct), "%"]
              })]
            })]
          }, tier.key), /*#__PURE__*/_jsxs("div", {
            className: "text-center mt-2",
            children: [/*#__PURE__*/_jsx(motion.p, {
              initial: {
                opacity: 0,
                y: 5
              },
              animate: {
                opacity: 1,
                y: 0
              },
              className: "font-display text-lg font-bold",
              style: {
                color: tier.color
              },
              children: tier.label
            }, tier.label), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8]",
              children: tier.desc
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-3 rounded-2xl glass-card border-amber-400/20 flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(AlertTriangle, {
            className: "w-5 h-5 text-amber-400 shrink-0"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-amber-200/90",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-bold",
              children: "80% Indians ke paas emergency fund nahi hai."
            }), " Tum unn 20% mein aao! \uD83D\uDCAA"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card space-y-3",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-semibold text-[#F8FAFC]",
            children: "Monthly Expenses \uD83D\uDCDD"
          }), EXPENSE_ROWS.map(row => /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-8 h-8 rounded-lg bg-white/[0.04] grid place-items-center text-base shrink-0",
              children: row.emoji
            }), /*#__PURE__*/_jsx("div", {
              className: "flex-1 min-w-0",
              children: /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#94A3B8]",
                children: row.label
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => updateExpense(row.key, -500),
              className: "w-7 h-7 rounded-lg glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]",
              children: /*#__PURE__*/_jsx(Minus, {
                className: "w-3.5 h-3.5"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "relative w-20",
              children: [/*#__PURE__*/_jsx(IndianRupee, {
                className: "absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-400"
              }), /*#__PURE__*/_jsx("input", {
                type: "number",
                value: expenses[row.key],
                onChange: e => setExpenseValue(row.key, parseInt(e.target.value || '0', 10)),
                className: "w-full pl-5 pr-1 py-1.5 rounded-lg glass-strong text-xs font-bold text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-emerald-400/40"
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => updateExpense(row.key, 500),
              className: "w-7 h-7 rounded-lg glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]",
              children: /*#__PURE__*/_jsx(Plus, {
                className: "w-3.5 h-3.5"
              })
            })]
          }, row.key)), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between pt-2 border-t border-white/[0.06]",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-[#94A3B8]",
              children: "Total Monthly"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-sm font-bold text-emerald-300",
              children: ["\u20B9", monthlyExpense.toLocaleString('en-IN')]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card space-y-2",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-semibold text-[#F8FAFC]",
            children: "Job Type \uD83D\uDCBC"
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-3 gap-2",
            children: Object.keys(JOB_CONFIG).map(jt => {
              const c = JOB_CONFIG[jt];
              const active = job === jt;
              return /*#__PURE__*/_jsxs("button", {
                onClick: () => setJob(jt),
                className: cn('p-2 rounded-xl text-center transition border', active ? 'bg-emerald-500/15 border-emerald-400/40' : 'border-white/[0.06] hover:border-white/[0.12]'),
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-xl mb-0.5",
                  children: c.emoji
                }), /*#__PURE__*/_jsx("p", {
                  className: cn('text-xs font-semibold', active ? 'text-emerald-300' : 'text-[#94A3B8]'),
                  children: c.label
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-[10px] text-[#94A3B8]",
                  children: [c.months, " months cover"]
                })]
              }, jt);
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Dependents \uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-xs text-[#94A3B8]",
              children: "Parivaar jo tum pe depend karta hai"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex gap-2",
            children: DEPENDENT_OPTIONS.map(n => /*#__PURE__*/_jsx("button", {
              onClick: () => setDependents(n),
              className: cn('flex-1 py-2 rounded-lg text-sm font-bold transition border', dependents === n ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300' : 'border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]'),
              children: n
            }, n))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs text-[#94A3B8] mb-2 block",
            children: "Current Savings (emergency fund)"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "relative flex-1",
              children: [/*#__PURE__*/_jsx(IndianRupee, {
                className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400"
              }), /*#__PURE__*/_jsx("input", {
                type: "number",
                value: currentSavings,
                onChange: e => setCurrentSavings(Math.max(0, parseInt(e.target.value || '0', 10))),
                className: "w-full pl-9 pr-3 py-2.5 rounded-xl glass-strong text-base font-bold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "flex gap-1",
              children: [1000, 5000, 10000].map(amt => /*#__PURE__*/_jsxs("button", {
                onClick: () => setCurrentSavings(s => s + amt),
                className: "px-2 py-1.5 rounded-lg glass-card text-[10px] font-semibold text-[#94A3B8] hover:text-[#F8FAFC]",
                children: ["+", amt / 1000, "k"]
              }, amt))
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "p-4 rounded-2xl glass-card-premium border-emerald-400/30",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] mb-1",
              children: "\uD83C\uDFAF Target Amount"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xl font-bold text-emerald-300",
              children: ["\u20B9", target.toLocaleString('en-IN')]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-[10px] text-[#94A3B8] mt-1",
              children: [JOB_CONFIG[job].months, " months \xD7 \u20B9", monthlyExpense.toLocaleString('en-IN'), dependents > 0 && ` + ${dependents}×₹10k`]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-4 rounded-2xl glass-card-premium border-amber-400/30",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] mb-1",
              children: "\uD83D\uDCC5 Monthly Plan"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xl font-bold text-amber-300",
              children: ["\u20B9", monthlySavingPlan.toLocaleString('en-IN')]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-[#94A3B8] mt-1",
              children: monthsToReach > 0 ? `${monthsToReach} months mein goal!` : 'Goal done! 🎉'
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card-premium border border-violet-500/30 flex items-start gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-9 h-9 rounded-xl bg-violet-500/15 grid place-items-center shrink-0",
            children: /*#__PURE__*/_jsx(Sparkles, {
              className: "w-5 h-5 text-violet-400"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-sm font-bold text-violet-300 mb-0.5",
              children: "Smart Tip \uD83E\uDD16"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-[#94A3B8] leading-relaxed",
              children: [tier.key === 'broken' && 'Chhota target rakho — pehle 1 month ka kharcha bhi bahut value hai. ₹500/week se start karo.', tier.key === 'half' && 'Acche trajectory pe ho! Auto-debit laga do — salary aate hi emergency fund mein transfer ho jaye.', tier.key === 'strong' && 'Mast! Sirf thoda aur — liquid fund ya savings account mein rakhna, FD nahi (lock-in problem).', tier.key === 'full' && 'Shield fully charged! Ab next goal pe dhyaan do — SIP ya investments. Yeh fund intact rakhna.']
            })]
          })]
        }), /*#__PURE__*/_jsxs("button", {
          onClick: () => {
            addCoins(10);
            toast({
              title: 'Plan saved! +10 coins 🎉'
            });
          },
          className: "w-full py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5",
          children: [/*#__PURE__*/_jsx(Check, {
            className: "w-4 h-4"
          }), " Save My Plan"]
        })]
      })]
    })
  });
}