'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Shield, Sparkles, IndianRupee, Building2, Landmark, BarChart3, Coins, Home, Check, GitCompare, Rocket, Lock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Investment Comparison — premium visual cards
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RISK_CONFIG = {
  low: {
    label: 'Low Risk',
    color: 'text-emerald-400',
    dots: 1,
    emoji: '🟢'
  },
  medium: {
    label: 'Medium Risk',
    color: 'text-amber-400',
    dots: 2,
    emoji: '🟡'
  },
  high: {
    label: 'High Risk',
    color: 'text-rose-400',
    dots: 3,
    emoji: '🔴'
  }
};
const OPTIONS = [{
  id: 'fd',
  emoji: '🏦',
  name: 'Fixed Deposit',
  nameHi: 'FD',
  rate: 6.5,
  rateText: '6-7.5%',
  risk: 'low',
  color: '#10b981',
  bg: 'bg-emerald-400/10',
  icon: /*#__PURE__*/_jsx(Landmark, {
    className: "w-5 h-5"
  }),
  minAmount: 1000,
  lockIn: '7 din - 10 saal',
  tag: 'Students ke liye best',
  tagEmoji: '👨‍🎓',
  description: 'Bank mein safe, lekin return thoda kam. Pehla investment yahin se karo.',
  pros: 'Safe + guaranteed',
  cons: 'Inflation se return kam'
}, {
  id: 'sip',
  emoji: '📈',
  name: 'SIP / Mutual Fund',
  nameHi: 'SIP',
  rate: 12,
  rateText: '10-15%',
  risk: 'high',
  color: '#f59e0b',
  bg: 'bg-amber-400/10',
  icon: /*#__PURE__*/_jsx(BarChart3, {
    className: "w-5 h-5"
  }),
  minAmount: 500,
  lockIn: 'No lock-in (ELSS: 3 saal)',
  tag: 'Long-term growth',
  tagEmoji: '🚀',
  description: '₹500/month se start. Long-term mein sabse zyada return deta hai.',
  pros: 'High return, low start',
  cons: 'Market risk, short-term volatile'
}, {
  id: 'realestate',
  emoji: '🏠',
  name: 'Real Estate',
  nameHi: 'Property',
  rate: 8,
  rateText: '6-12%',
  risk: 'medium',
  color: '#8b5cf6',
  bg: 'bg-violet-400/10',
  icon: /*#__PURE__*/_jsx(Home, {
    className: "w-5 h-5"
  }),
  minAmount: 500000,
  lockIn: 'Long-term (5+ saal)',
  tag: 'High ticket size',
  tagEmoji: '💼',
  description: 'Bada paisa chahiye. Students ke liye abhi mushkil — baad ke liye.',
  pros: 'Tangible asset, rent income',
  cons: 'Bahut paisa chahiye, liquid nahi'
}, {
  id: 'gold',
  emoji: '🥇',
  name: 'Gold',
  nameHi: 'Sona',
  rate: 8,
  rateText: '7-10%',
  risk: 'medium',
  color: '#eab308',
  bg: 'bg-yellow-400/10',
  icon: /*#__PURE__*/_jsx(Coins, {
    className: "w-5 h-5"
  }),
  minAmount: 100,
  lockIn: 'No lock-in',
  tag: 'Inflation shield',
  tagEmoji: '🛡️',
  description: 'Festival pe gold ETF ya Sovereign Gold Bond lo — jewelry nahi!',
  pros: 'Safe haven, liquid',
  cons: 'No passive income'
}, {
  id: 'stocks',
  emoji: '💹',
  name: 'Stocks',
  nameHi: 'Shares',
  rate: 14,
  rateText: '8-18%',
  risk: 'high',
  color: '#ec4899',
  bg: 'bg-pink-400/10',
  icon: /*#__PURE__*/_jsx(TrendingUp, {
    className: "w-5 h-5"
  }),
  minAmount: 100,
  lockIn: 'No lock-in',
  tag: 'High risk, high reward',
  tagEmoji: '🎢',
  description: 'Direct company shares. Knowledge chahiye, warna paisa doob sakta hai.',
  pros: 'Highest potential return',
  cons: 'High risk, time + knowledge chahiye'
}, {
  id: 'ppf',
  emoji: '🔐',
  name: 'PPF',
  nameHi: 'PPF',
  rate: 7.1,
  rateText: '7-8%',
  risk: 'low',
  color: '#3b82f6',
  bg: 'bg-blue-400/10',
  icon: /*#__PURE__*/_jsx(Shield, {
    className: "w-5 h-5"
  }),
  minAmount: 500,
  lockIn: '15 saal',
  tag: 'Tax-free return',
  tagEmoji: '🧾',
  description: 'Govt scheme — tax-free interest. Long-term retirement ke liye best.',
  pros: 'Tax-free, safe',
  cons: '15 saal lock-in'
}, {
  id: 'nps',
  emoji: '🏛️',
  name: 'NPS',
  nameHi: 'Pension',
  rate: 10,
  rateText: '9-12%',
  risk: 'medium',
  color: '#06b6d4',
  bg: 'bg-cyan-400/10',
  icon: /*#__PURE__*/_jsx(Building2, {
    className: "w-5 h-5"
  }),
  minAmount: 500,
  lockIn: '60 saal age tak',
  tag: 'Retirement ke liye',
  tagEmoji: '👴',
  description: 'Extra tax bachat ₹50k. Retirement planning ke liye solid.',
  pros: 'Tax + retirement combo',
  cons: 'Long lock-in, withdrawal strict'
}];
const MAX_RATE = 18; // for bar scaling

export default function InvestmentComparison({
  open,
  onClose
}) {
  const {
    addCoins
  } = useAppStore();
  const [selected, setSelected] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const toggleSelection = id => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 3) {
        toast({
          title: 'Max 3 select kar sakte ho 🎯'
        });
        return prev;
      }
      return [...prev, id];
    });
  };
  const selectedOptions = useMemo(() => OPTIONS.filter(o => selected.includes(o.id)), [selected]);
  const handleCompare = () => {
    if (selected.length < 2) {
      toast({
        title: 'Kam se kam 2 select karo 🔍'
      });
      return;
    }
    setComparisonMode(true);
  };
  const aiSuggestion = useMemo(() => {
    if (selected.length === 0) {
      return 'Upar se 2-3 options select karo, fir "Compare" dabao — full breakdown mil jayega! 👇';
    }
    if (selected.includes('sip') && selected.includes('ppf')) {
      return 'SIP + PPF combo best hai — growth + tax saving + safety! 🚀 Tumhari age mein yeh perfect rahega.';
    }
    if (selected.includes('fd')) {
      return 'FD safe hai par inflation haraata. SIP bhi add karo for long-term growth.';
    }
    if (selected.includes('stocks') && selected.length === 1) {
      return 'Stocks alone risky hai. SIP + Stocks ka 70-30 mix better rahega. Knowledge zaroori!';
    }
    if (selected.includes('gold')) {
      return 'Gold 10-15% portfolio mein rakho. Pure gold investment mat banao.';
    }
    return 'Bilkul sahi direction mein ho! "Start Investing" dabao aur Groww/Zerodha pe account kholo.';
  }, [selected]);
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Investment Comparison"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
              children: /*#__PURE__*/_jsx(TrendingUp, {
                className: "w-5 h-5 text-emerald-400"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-display text-xl font-bold heading-gradient",
                children: "Kahan Lagayein Paisa?"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#94A3B8]",
                children: "Compare karo, phir invest karo \uD83D\uDCB8"
              })]
            })]
          }), selected.length > 0 && /*#__PURE__*/_jsxs("button", {
            onClick: () => setSelected([]),
            className: "text-xs text-[#94A3B8] hover:text-[#F8FAFC]",
            children: ["Clear (", selected.length, ")"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 p-2.5 rounded-xl glass-card",
          children: [/*#__PURE__*/_jsx(Sparkles, {
            className: "w-4 h-4 text-violet-400 shrink-0"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-[#94A3B8]",
            children: "2-3 options tap karke compare karo (max 3)"
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "px-5 pb-4",
        children: /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-2 gap-3",
          children: OPTIONS.map((opt, idx) => {
            const isSelected = selected.includes(opt.id);
            const risk = RISK_CONFIG[opt.risk];
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
                delay: idx * 0.05
              },
              whileHover: {
                scale: 1.02
              },
              whileTap: {
                scale: 0.98
              },
              onClick: () => toggleSelection(opt.id),
              className: cn('relative p-3 rounded-2xl text-left transition-all border card-3d', isSelected ? 'glass-card-premium border-emerald-400/40' : 'glass-card border-white/[0.06] hover:border-white/[0.12]'),
              children: [isSelected && /*#__PURE__*/_jsx("div", {
                className: "absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 grid place-items-center",
                children: /*#__PURE__*/_jsx(Check, {
                  className: "w-3 h-3 text-white"
                })
              }), /*#__PURE__*/_jsx("div", {
                className: "text-2xl mb-1",
                children: opt.emoji
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display text-sm font-bold text-[#F8FAFC] leading-tight",
                children: opt.nameHi
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-[#94A3B8] mb-2",
                children: opt.name
              }), /*#__PURE__*/_jsxs("div", {
                className: "mb-2",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between text-[10px] mb-1",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-[#94A3B8]",
                    children: "Returns"
                  }), /*#__PURE__*/_jsx("span", {
                    className: cn('font-bold', risk.color),
                    children: opt.rateText
                  })]
                }), /*#__PURE__*/_jsx("div", {
                  className: "h-1.5 rounded-full bg-white/[0.06] overflow-hidden",
                  children: /*#__PURE__*/_jsx(motion.div, {
                    className: "h-full rounded-full",
                    style: {
                      background: opt.color
                    },
                    initial: {
                      width: 0
                    },
                    animate: {
                      width: `${opt.rate / MAX_RATE * 100}%`
                    },
                    transition: {
                      delay: 0.2 + idx * 0.05,
                      duration: 0.6,
                      ease: 'easeOut'
                    }
                  })
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1 mb-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-[#94A3B8]",
                  children: "Risk:"
                }), [1, 2, 3].map(dot => /*#__PURE__*/_jsx("span", {
                  className: cn('w-1.5 h-1.5 rounded-full', dot <= risk.dots ? opt.risk === 'low' ? 'bg-emerald-400' : opt.risk === 'medium' ? 'bg-amber-400' : 'bg-rose-400' : 'bg-white/[0.10]')
                }, dot))]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-0.5 text-[10px] text-[#94A3B8]",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(IndianRupee, {
                    className: "w-2.5 h-2.5"
                  }), " ", opt.minAmount >= 100000 ? `${opt.minAmount / 100000}L` : opt.minAmount >= 1000 ? `${opt.minAmount / 1000}k` : opt.minAmount, " min"]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Lock, {
                    className: "w-2.5 h-2.5"
                  }), " ", opt.lockIn]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "mt-2 px-1.5 py-1 rounded-md bg-white/[0.04] text-[10px] text-violet-300 font-semibold text-center",
                children: [opt.tagEmoji, " ", opt.tag]
              })]
            }, opt.id);
          })
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "px-5 pb-4",
        children: /*#__PURE__*/_jsxs("button", {
          onClick: handleCompare,
          disabled: selected.length < 2,
          className: cn('w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition', selected.length >= 2 ? 'btn-3d bg-emerald-500 hover:bg-emerald-400 text-white' : 'glass-card text-[#94A3B8] cursor-not-allowed'),
          children: [/*#__PURE__*/_jsx(GitCompare, {
            className: "w-4 h-4"
          }), "Compare Now ", selected.length > 0 && `(${selected.length})`]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "px-5 pb-4",
        children: /*#__PURE__*/_jsxs("div", {
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
              children: "AI Suggestion \uD83E\uDD16"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] leading-relaxed",
              children: aiSuggestion
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6",
        children: [/*#__PURE__*/_jsxs("button", {
          onClick: () => {
            addCoins(5);
            toast({
              title: 'External link khulta hai! +5 coins 🎉'
            });
          },
          className: "w-full py-3 rounded-xl btn-3d bg-gradient-to-r from-emerald-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-1.5",
          children: [/*#__PURE__*/_jsx(Rocket, {
            className: "w-4 h-4"
          }), " Start Investing"]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[10px] text-center text-[#94A3B8] mt-2",
          children: "Groww / Zerodha pe account kholo (18+)"
        })]
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        children: comparisonMode && selectedOptions.length >= 2 && /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          onClick: () => setComparisonMode(false),
          className: "absolute inset-0 z-30 grid place-items-center bg-[#0B1220]/95 backdrop-blur-md p-4 overflow-y-auto",
          children: /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              scale: 0.92,
              y: 30
            },
            animate: {
              scale: 1,
              y: 0
            },
            exit: {
              scale: 0.92,
              opacity: 0
            },
            onClick: e => e.stopPropagation(),
            className: "max-w-md w-full my-auto p-5 rounded-3xl glass-card-premium relative",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setComparisonMode(false),
              className: "absolute top-4 right-4 w-8 h-8 rounded-full glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-xl font-bold heading-gradient mb-1",
              children: "Side-by-Side Comparison"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-[#94A3B8] mb-4",
              children: [selectedOptions.length, " options compare ho rahe hain"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid gap-2 mb-3",
              style: {
                gridTemplateColumns: `120px repeat(${selectedOptions.length}, 1fr)`
              },
              children: [/*#__PURE__*/_jsx("div", {}), selectedOptions.map(opt => /*#__PURE__*/_jsxs("div", {
                className: "text-center",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-2xl mb-0.5",
                  children: opt.emoji
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs font-bold text-[#F8FAFC]",
                  children: opt.nameHi
                })]
              }, opt.id))]
            }), [{
              label: 'Returns',
              getVal: o => o.rateText,
              getColor: o => RISK_CONFIG[o.risk].color
            }, {
              label: 'Risk',
              getVal: o => `${RISK_CONFIG[o.risk].emoji} ${RISK_CONFIG[o.risk].label.split(' ')[0]}`,
              getColor: () => '#F8FAFC'
            }, {
              label: 'Min Amt',
              getVal: o => `₹${o.minAmount >= 100000 ? `${o.minAmount / 100000}L` : o.minAmount >= 1000 ? `${o.minAmount / 1000}k` : o.minAmount}`,
              getColor: () => '#94A3B8'
            }, {
              label: 'Lock-in',
              getVal: o => o.lockIn,
              getColor: () => '#94A3B8'
            }, {
              label: 'Best For',
              getVal: o => `${o.tagEmoji} ${o.tag}`,
              getColor: () => '#8B5CF6'
            }, {
              label: 'Pros',
              getVal: o => o.pros,
              getColor: () => '#10B981'
            }, {
              label: 'Cons',
              getVal: o => o.cons,
              getColor: () => '#EF4444'
            }].map(row => /*#__PURE__*/_jsxs("div", {
              className: "grid gap-2 py-2 border-t border-white/[0.06] items-center",
              style: {
                gridTemplateColumns: `120px repeat(${selectedOptions.length}, 1fr)`
              },
              children: [/*#__PURE__*/_jsx("div", {
                className: "text-[10px] text-[#94A3B8] font-semibold",
                children: row.label
              }), selectedOptions.map(opt => /*#__PURE__*/_jsx("div", {
                className: "text-[10px] text-center",
                style: {
                  color: row.getColor(opt)
                },
                children: row.getVal(opt)
              }, opt.id))]
            }, row.label)), /*#__PURE__*/_jsxs("div", {
              className: "mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs text-emerald-300 font-bold mb-0.5",
                children: "\uD83C\uDFC6 Best Pick for Students"
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-xs text-[#94A3B8]",
                children: [selectedOptions.find(o => o.id === 'sip') ? 'SIP/Mutual Fund' : selectedOptions[0].nameHi, " \u2014 low ticket size + long-term compound growth."]
              })]
            })]
          })
        })
      })]
    })
  });
}