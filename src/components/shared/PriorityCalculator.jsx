'use client';

import { useState, useMemo } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ListOrdered, Save, Sparkles, IndianRupee, Home, UtensilsCrossed, Car, Smartphone, GraduationCap, Clapperboard, HeartPulse, PiggyBank, Gift, GripVertical, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

/* ============================================================
   Priority Calculator — drag to reorder, live bar chart
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const PRIORITIES = [{
  id: 'rent',
  emoji: '🏠',
  title: 'Rent / Hostel',
  titleEn: 'Rent ya hostel fees',
  color: 'text-rose-400',
  bg: 'bg-rose-400/10',
  barColor: '#f43f5e',
  idealPct: 30,
  defaultPct: 30,
  tip: 'Rent income ka 25-30% tak — zyada nahi!',
  icon: /*#__PURE__*/_jsx(Home, {
    className: "w-4 h-4"
  })
}, {
  id: 'food',
  emoji: '🍔',
  title: 'Food',
  titleEn: 'Khana',
  color: 'text-amber-400',
  bg: 'bg-amber-400/10',
  barColor: '#f59e0b',
  idealPct: 15,
  defaultPct: 20,
  tip: 'Mess / cooking se 50% bachat ho sakti hai.',
  icon: /*#__PURE__*/_jsx(UtensilsCrossed, {
    className: "w-4 h-4"
  })
}, {
  id: 'transport',
  emoji: '🚗',
  title: 'Transport',
  titleEn: 'Travel / Bus / Metro',
  color: 'text-blue-400',
  bg: 'bg-blue-400/10',
  barColor: '#3b82f6',
  idealPct: 8,
  defaultPct: 12,
  tip: 'Public transport = 70% saving vs cab.',
  icon: /*#__PURE__*/_jsx(Car, {
    className: "w-4 h-4"
  })
}, {
  id: 'phone',
  emoji: '📱',
  title: 'Phone Recharge',
  titleEn: 'Phone + Internet',
  color: 'text-cyan-400',
  bg: 'bg-cyan-400/10',
  barColor: '#06b6d4',
  idealPct: 3,
  defaultPct: 6,
  tip: 'Family plan se 30% bachat.',
  icon: /*#__PURE__*/_jsx(Smartphone, {
    className: "w-4 h-4"
  })
}, {
  id: 'education',
  emoji: '📚',
  title: 'Education',
  titleEn: 'Books / Course / Coaching',
  color: 'text-violet-400',
  bg: 'bg-violet-400/10',
  barColor: '#8b5cf6',
  idealPct: 12,
  defaultPct: 10,
  tip: 'Skill courses = best investment. Skilligo pe check karo.',
  icon: /*#__PURE__*/_jsx(GraduationCap, {
    className: "w-4 h-4"
  })
}, {
  id: 'entertainment',
  emoji: '🎬',
  title: 'Entertainment',
  titleEn: 'Movies / Netflix / Outing',
  color: 'text-pink-400',
  bg: 'bg-pink-400/10',
  barColor: '#ec4899',
  idealPct: 7,
  defaultPct: 12,
  tip: 'Family plan se 30% bachat. Free events try karo.',
  icon: /*#__PURE__*/_jsx(Clapperboard, {
    className: "w-4 h-4"
  })
}, {
  id: 'health',
  emoji: '💊',
  title: 'Health',
  titleEn: 'Medical + Fitness',
  color: 'text-emerald-400',
  bg: 'bg-emerald-400/10',
  barColor: '#10b981',
  idealPct: 7,
  defaultPct: 5,
  tip: 'Insurance + ₹500 gym = long-term saving.',
  icon: /*#__PURE__*/_jsx(HeartPulse, {
    className: "w-4 h-4"
  })
}, {
  id: 'savings',
  emoji: '💰',
  title: 'Savings',
  titleEn: 'Investments + Emergency',
  color: 'text-emerald-400',
  bg: 'bg-emerald-400/10',
  barColor: '#22c55e',
  idealPct: 15,
  defaultPct: 5,
  tip: 'Pehle 20% save karo, baaki kharch karo.',
  icon: /*#__PURE__*/_jsx(PiggyBank, {
    className: "w-4 h-4"
  })
}, {
  id: 'gifts',
  emoji: '🎁',
  title: 'Gifts',
  titleEn: 'Gifts / Donations',
  color: 'text-orange-400',
  bg: 'bg-orange-400/10',
  barColor: '#f97316',
  idealPct: 3,
  defaultPct: 0,
  tip: 'Occasional rakho, monthly budget impact na kare.',
  icon: /*#__PURE__*/_jsx(Gift, {
    className: "w-4 h-4"
  })
}];
const PRESET_INCOMES = [3000, 5000, 10000, 15000, 25000];
export default function PriorityCalculator({
  open,
  onClose
}) {
  const {
    addCoins
  } = useAppStore();
  const [income, setIncome] = useState(10000);
  const [items, setItems] = useState(PRIORITIES);
  const [saved, setSaved] = useState(false);

  /* Calculate allocation % based on position in list (higher position = more weight) */
  const allocations = useMemo(() => {
    // Position weight: top priority gets ideal%, others scale by their `defaultPct` normalized
    // Simpler: use the order rank with diminishing weight via formula
    const ranked = items.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      // 1-based
      weight: Math.max(2, 20 - idx * 2) // top item gets 20, last gets 4
    }));
    const totalWeight = ranked.reduce((s, r) => s + r.weight, 0);
    return ranked.map(r => ({
      ...r,
      pct: Math.round(r.weight / totalWeight * 100),
      amount: Math.round(r.weight / totalWeight * income)
    }));
  }, [items, income]);
  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = income - totalAllocated;

  /* AI suggestion based on allocation vs ideal */
  const aiSuggestion = useMemo(() => {
    const savings = allocations.find(a => a.id === 'savings');
    const entertainment = allocations.find(a => a.id === 'entertainment');
    const rent = allocations.find(a => a.id === 'rent');
    if (!savings || !entertainment || !rent) return null;
    if (savings.pct < 10) {
      return {
        type: 'danger',
        title: 'Savings bahut kam hai 🚨',
        msg: `Bhai, savings pe sirf ${savings.pct}% chala raha hai. Kam se kam 15-20% rakho. Entertainment thoda kam karke savings badhao!`
      };
    }
    if (entertainment.pct > 15) {
      return {
        type: 'warning',
        title: 'Entertainment zyada ho gaya 🤔',
        msg: `Movies/outing pe ${entertainment.pct}% — paisa ud raha hai. 7-8% ideal hai. Ek "No Swiggy Week" try karo!`
      };
    }
    if (rent.pct > 35) {
      return {
        type: 'warning',
        title: 'Rent ka hissa zyada hai 🏠',
        msg: `Rent ${rent.pct}% le raha hai income ka. Sharing flat ya PG shift karo — 10% bachat ho sakti hai.`
      };
    }
    if (savings.pct >= 15 && entertainment.pct <= 8) {
      return {
        type: 'success',
        title: 'Perfect Budget! 🎯',
        msg: `Bhai, tum apne paise sambhalna jaante ho! Savings ${savings.pct}% — shabaash! Aise hi chalte raho 🔥`
      };
    }
    return {
      type: 'success',
      title: 'Balance achha hai 💪',
      msg: 'Priority order bilkul theek lag raha hai. Savings ko top 3 mein rakhna try karo.'
    };
  }, [allocations]);
  const handleIncomeChange = val => {
    setIncome(Math.max(500, Math.min(200000, val)));
    setSaved(false);
  };
  const handleSave = () => {
    setSaved(true);
    addCoins(15);
    toast({
      title: 'Priorities save ho gayi! +15 coins 🎉'
    });
  };
  const handleShare = async () => {
    const lines = items.slice(0, 5).map((it, i) => `${i + 1}. ${it.emoji} ${it.title}`);
    const text = `Meri Financial Priorities:\n\n${lines.join('\n')}\n\nMade with Money Matters 💸`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'My Financial Priorities',
        text
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      toast({
        title: 'Copy kar liya! 📋'
      });
    }
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Priority Calculator"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative px-5 pt-6 pb-4 bg-gradient-to-b from-amber-500/10 to-transparent",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
            children: /*#__PURE__*/_jsx(ListOrdered, {
              className: "w-5 h-5 text-amber-400"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-bold heading-gradient",
              children: "Priority Calculator"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8]",
              children: "Drag karke priority set karo \uD83C\uDFAF"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs text-[#94A3B8] mb-1.5 block",
            children: "Monthly Income / Pocket Money"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex items-center gap-2 mb-3",
            children: /*#__PURE__*/_jsxs("div", {
              className: "relative flex-1",
              children: [/*#__PURE__*/_jsx(IndianRupee, {
                className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400"
              }), /*#__PURE__*/_jsx("input", {
                type: "number",
                value: income,
                onChange: e => handleIncomeChange(parseInt(e.target.value || '0', 10)),
                className: "w-full pl-10 pr-3 py-3 rounded-xl glass-strong text-lg font-bold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              })]
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "flex gap-2 flex-wrap",
            children: PRESET_INCOMES.map(amt => /*#__PURE__*/_jsxs("button", {
              onClick: () => {
                setIncome(amt);
                setSaved(false);
              },
              className: cn('px-3 py-1.5 rounded-full text-xs font-semibold transition border', income === amt ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'glass-card border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]'),
              children: ["\u20B9", amt >= 1000 ? `${amt / 1000}k` : amt]
            }, amt))
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Priorities (drag to reorder)"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xs text-[#94A3B8]",
              children: [items.length, " items"]
            })]
          }), /*#__PURE__*/_jsx(Reorder.Group, {
            axis: "y",
            values: items,
            onReorder: newItems => {
              setItems(newItems);
              setSaved(false);
            },
            className: "space-y-2",
            children: allocations.map((item, idx) => /*#__PURE__*/_jsxs(Reorder.Item, {
              value: items[idx],
              whileDrag: {
                scale: 1.03,
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                zIndex: 50
              },
              className: cn('flex items-center gap-3 p-3 rounded-2xl glass-card cursor-grab active:cursor-grabbing border', item.id === 'savings' ? 'border-emerald-400/30' : 'border-white/[0.06]'),
              children: [/*#__PURE__*/_jsx(GripVertical, {
                className: "w-4 h-4 text-[#94A3B8] shrink-0"
              }), /*#__PURE__*/_jsx("div", {
                className: cn('w-9 h-9 rounded-xl grid place-items-center text-lg shrink-0', item.bg),
                children: item.emoji
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "font-semibold text-sm text-[#F8FAFC] truncate",
                    children: item.title
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-[10px] text-[#94A3B8]",
                    children: ["#", idx + 1]
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2 mt-1",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden",
                    children: /*#__PURE__*/_jsx(motion.div, {
                      className: "h-full rounded-full",
                      style: {
                        background: item.barColor
                      },
                      initial: {
                        width: 0
                      },
                      animate: {
                        width: `${item.pct}%`
                      },
                      transition: {
                        type: 'spring',
                        stiffness: 120,
                        damping: 18
                      }
                    })
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-xs font-bold text-[#F8FAFC]",
                    children: [item.pct, "%"]
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-right shrink-0",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-sm font-bold text-emerald-300",
                  children: formatCurrency(item.amount, false)
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-[#94A3B8]",
                  children: "\u20B9/mo"
                })]
              })]
            }, item.id))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-semibold text-[#F8FAFC] mb-3",
            children: "Live Allocation \uD83D\uDCCA"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex h-10 rounded-lg overflow-hidden gap-0.5",
            children: allocations.map(a => /*#__PURE__*/_jsx(motion.div, {
              className: "relative group",
              initial: {
                width: 0
              },
              animate: {
                width: `${a.pct}%`
              },
              transition: {
                type: 'spring',
                stiffness: 120,
                damping: 18
              },
              style: {
                background: a.barColor
              },
              children: /*#__PURE__*/_jsx("span", {
                className: "absolute inset-0 grid place-items-center text-[10px] font-bold text-black/70",
                children: a.pct > 5 ? a.emoji : ''
              })
            }, a.id))
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mt-3 text-xs",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "text-[#94A3B8]",
              children: ["Allocated: ", /*#__PURE__*/_jsx("span", {
                className: "font-bold text-[#F8FAFC]",
                children: formatCurrency(totalAllocated, false)
              })]
            }), /*#__PURE__*/_jsxs("span", {
              className: remaining >= 0 ? 'text-emerald-400' : 'text-rose-400',
              children: [remaining >= 0 ? 'Bacha: ' : 'Over: ', /*#__PURE__*/_jsx("span", {
                className: "font-bold",
                children: formatCurrency(Math.abs(remaining), false)
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-sm font-semibold text-[#F8FAFC] mb-3",
            children: "Ideal Budget (50/30/20 rule) \uD83D\uDCD0"
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-2",
            children: [{
              label: 'Needs (Rent, Food, Transport)',
              pct: 50,
              color: 'bg-emerald-500',
              idealAmount: income * 0.5
            }, {
              label: 'Wants (Entertainment, Outing)',
              pct: 30,
              color: 'bg-amber-500',
              idealAmount: income * 0.3
            }, {
              label: 'Savings + Investment',
              pct: 20,
              color: 'bg-violet-500',
              idealAmount: income * 0.2
            }].map(row => /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between text-xs mb-1",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[#94A3B8]",
                  children: row.label
                }), /*#__PURE__*/_jsxs("span", {
                  className: "font-semibold text-[#F8FAFC]",
                  children: [row.pct, "% = \u20B9", Math.round(row.idealAmount).toLocaleString('en-IN')]
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "h-2 rounded-full bg-white/[0.06] overflow-hidden",
                children: /*#__PURE__*/_jsx("div", {
                  className: cn('h-full rounded-full', row.color),
                  style: {
                    width: `${row.pct}%`
                  }
                })
              })]
            }, row.label))
          })]
        }), aiSuggestion && /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 10
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: cn('p-4 rounded-2xl glass-card-premium border flex items-start gap-3', aiSuggestion.type === 'danger' ? 'border-rose-500/30' : aiSuggestion.type === 'warning' ? 'border-amber-400/30' : 'border-emerald-400/30'),
          children: [/*#__PURE__*/_jsx("div", {
            className: cn('w-9 h-9 rounded-xl grid place-items-center shrink-0', aiSuggestion.type === 'danger' ? 'bg-rose-500/15' : aiSuggestion.type === 'warning' ? 'bg-amber-400/15' : 'bg-emerald-500/15'),
            children: /*#__PURE__*/_jsx(Sparkles, {
              className: cn('w-5 h-5', aiSuggestion.type === 'danger' ? 'text-rose-400' : aiSuggestion.type === 'warning' ? 'text-amber-400' : 'text-emerald-400')
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: cn('text-sm font-bold mb-0.5', aiSuggestion.type === 'danger' ? 'text-rose-300' : aiSuggestion.type === 'warning' ? 'text-amber-300' : 'text-emerald-300'),
              children: aiSuggestion.title
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] leading-relaxed",
              children: aiSuggestion.msg
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-2",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: handleSave,
            className: "flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5",
            children: saved ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Check, {
                className: "w-4 h-4"
              }), " Saved!"]
            }) : /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Save, {
                className: "w-4 h-4"
              }), " Save Priorities"]
            })
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleShare,
            className: "py-3 px-4 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition",
            children: "Share"
          })]
        })]
      })]
    })
  });
}