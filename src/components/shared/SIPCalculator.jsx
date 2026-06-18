'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Sparkles, IndianRupee, Mountain, Flag, Smartphone, Bike, Plane } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { calculateSIP, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* ============================================================
   SIP Calculator — Wealth Mountain concept
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PRESETS = [500, 1000, 2000, 5000];
const MILESTONES = [{
  value: 100000,
  label: '₹1 Lakh',
  emoji: '🎯'
}, {
  value: 500000,
  label: '₹5 Lakh',
  emoji: '🏆'
}, {
  value: 1000000,
  label: '₹10 Lakh',
  emoji: '👑'
}, {
  value: 10000000,
  label: '₹1 Crore',
  emoji: '🤯'
}];
const COMPARISONS = {
  iphone: 80000,
  enfield: 200000,
  goa: 25000
};
export function SIPCalculator({
  open,
  onClose
}) {
  const {
    addCoins
  } = useAppStore();
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const totalInvested = monthly * years * 12;
  const totalValue = calculateSIP(monthly, rate, years);
  const totalReturns = totalValue - totalInvested;

  /* Donut chart for invested vs returns */
  const investedPct = totalValue > 0 ? totalInvested / totalValue * 100 : 0;

  /* Mountain height scale (relative to ₹1Cr) */
  const mountainScale = Math.min(100, totalValue / 10000000 * 100);

  /* Next milestone */
  const nextMilestone = MILESTONES.find(m => m.value > totalValue) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find(m => m.value <= totalValue);
  const progressToNext = prevMilestone ? (totalValue - prevMilestone.value) / (nextMilestone.value - prevMilestone.value) * 100 : totalValue / nextMilestone.value * 100;

  /* Relatable comparisons */
  const iphones = Math.floor(totalValue / COMPARISONS.iphone);
  const enfields = Math.floor(totalValue / COMPARISONS.enfield);
  const goaTrips = Math.floor(totalValue / COMPARISONS.goa);

  /* FD comparison */
  const fdValue = monthly * years * 12 * (1 + 6.5 / 100 * years);
  const fdGain = fdValue - totalInvested;

  /* Milestones crossed */
  const crossedMilestones = MILESTONES.filter(m => m.value <= totalValue);
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "SIP Calculator"
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-1",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
            children: /*#__PURE__*/_jsx(Mountain, {
              className: "w-5 h-5 text-emerald-400"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-bold heading-gradient",
              children: "Wealth Mountain \u26F0\uFE0F"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8]",
              children: "SIP se apna pahad banao"
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative h-44 rounded-2xl glass-card overflow-hidden",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 opacity-40",
            children: Array.from({
              length: 12
            }).map((_, i) => /*#__PURE__*/_jsx(motion.div, {
              className: "absolute w-0.5 h-0.5 rounded-full bg-white",
              style: {
                left: `${i * 8.3 % 100}%`,
                top: `${i * 13 % 50}%`
              },
              animate: {
                opacity: [0.3, 1, 0.3]
              },
              transition: {
                duration: 2 + i % 3,
                repeat: Infinity,
                delay: i * 0.2
              }
            }, i))
          }), /*#__PURE__*/_jsxs("svg", {
            viewBox: "0 0 300 160",
            className: "absolute bottom-0 left-0 w-full h-full",
            preserveAspectRatio: "none",
            children: [/*#__PURE__*/_jsxs("defs", {
              children: [/*#__PURE__*/_jsxs("linearGradient", {
                id: "investedGrad",
                x1: "0%",
                y1: "100%",
                x2: "0%",
                y2: "0%",
                children: [/*#__PURE__*/_jsx("stop", {
                  offset: "0%",
                  stopColor: "#10b981",
                  stopOpacity: "0.9"
                }), /*#__PURE__*/_jsx("stop", {
                  offset: "100%",
                  stopColor: "#10b981",
                  stopOpacity: "0.6"
                })]
              }), /*#__PURE__*/_jsxs("linearGradient", {
                id: "returnsGrad",
                x1: "0%",
                y1: "100%",
                x2: "0%",
                y2: "0%",
                children: [/*#__PURE__*/_jsx("stop", {
                  offset: "0%",
                  stopColor: "#f59e0b",
                  stopOpacity: "0.85"
                }), /*#__PURE__*/_jsx("stop", {
                  offset: "100%",
                  stopColor: "#fbbf24",
                  stopOpacity: "0.95"
                })]
              })]
            }), /*#__PURE__*/_jsx(motion.path, {
              d: `M 0 160 L 0 ${160 - mountainScale * 0.7} Q 60 ${160 - mountainScale * 0.8} 150 ${160 - mountainScale} Q 240 ${160 - mountainScale * 0.8} 300 ${160 - mountainScale * 0.7} L 300 160 Z`,
              fill: "url(#investedGrad)",
              initial: {
                opacity: 0
              },
              animate: {
                opacity: 1
              },
              transition: {
                duration: 0.5
              }
            }), /*#__PURE__*/_jsx(motion.path, {
              d: `M 0 ${160 - mountainScale * 0.5} Q 60 ${160 - mountainScale * 0.75} 150 ${160 - mountainScale} Q 240 ${160 - mountainScale * 0.75} 300 ${160 - mountainScale * 0.5} L 300 ${160 - mountainScale * 0.55} Q 150 ${160 - mountainScale * 0.4} 0 ${160 - mountainScale * 0.55} Z`,
              fill: "url(#returnsGrad)",
              initial: {
                opacity: 0,
                y: 10
              },
              animate: {
                opacity: 1,
                y: 0
              },
              transition: {
                duration: 0.6,
                delay: 0.2
              }
            }), /*#__PURE__*/_jsxs(motion.g, {
              animate: {
                y: [0, -3, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity
              },
              children: [/*#__PURE__*/_jsx("line", {
                x1: "150",
                y1: 160 - mountainScale,
                x2: "150",
                y2: 160 - mountainScale - 18,
                stroke: "#94A3B8",
                strokeWidth: "1.5"
              }), /*#__PURE__*/_jsx("text", {
                x: "150",
                y: 160 - mountainScale - 4,
                fontSize: "14",
                textAnchor: "middle",
                children: "\uD83D\uDEA9"
              })]
            }), MILESTONES.map((m, i) => {
              const ratio = m.value / 10000000;
              const x = 30 + i * 75;
              const y = 160 - Math.min(mountainScale, ratio * 100) - 8;
              const crossed = m.value <= totalValue;
              return /*#__PURE__*/_jsxs("g", {
                children: [/*#__PURE__*/_jsx("line", {
                  x1: x,
                  y1: y,
                  x2: x,
                  y2: y + 6,
                  stroke: crossed ? '#fbbf24' : '#475569',
                  strokeWidth: "1"
                }), /*#__PURE__*/_jsx("text", {
                  x: x,
                  y: y - 1,
                  fontSize: "9",
                  textAnchor: "middle",
                  opacity: crossed ? 1 : 0.5,
                  children: crossed ? m.emoji : '⚪'
                })]
              }, m.value);
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "absolute top-2 left-2 flex flex-col gap-1",
            children: [/*#__PURE__*/_jsx("div", {
              className: "px-2 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur text-[9px] font-bold text-emerald-300",
              children: "\uD83D\uDFE2 Invested"
            }), /*#__PURE__*/_jsx("div", {
              className: "px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur text-[9px] font-bold text-amber-300",
              children: "\uD83D\uDFE1 Returns"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "absolute top-2 right-2 px-2.5 py-1 rounded-lg glass-strong",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-[#94A3B8]",
              children: "Total Value"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm font-bold text-amber-300",
              children: formatCurrency(totalValue, false)
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-4 p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/*#__PURE__*/_jsx("label", {
                className: "text-sm font-semibold text-[#F8FAFC]",
                children: "Monthly SIP"
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15",
                children: [/*#__PURE__*/_jsx(IndianRupee, {
                  className: "w-3.5 h-3.5 text-emerald-400"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-sm font-bold text-emerald-300",
                  children: monthly.toLocaleString('en-IN')
                })]
              })]
            }), /*#__PURE__*/_jsx(Slider, {
              value: [monthly],
              onValueChange: v => setMonthly(v[0]),
              min: 500,
              max: 50000,
              step: 500,
              className: "mb-2"
            }), /*#__PURE__*/_jsx("div", {
              className: "flex gap-1.5",
              children: PRESETS.map(amt => /*#__PURE__*/_jsxs("button", {
                onClick: () => setMonthly(amt),
                className: cn('flex-1 py-1.5 rounded-lg text-xs font-semibold transition border', monthly === amt ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300' : 'border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]'),
                children: ["\u20B9", amt / 1000, "k"]
              }, amt))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/*#__PURE__*/_jsx("label", {
                className: "text-sm font-semibold text-[#F8FAFC]",
                children: "Duration"
              }), /*#__PURE__*/_jsx("div", {
                className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15",
                children: /*#__PURE__*/_jsxs("span", {
                  className: "text-sm font-bold text-amber-300",
                  children: [years, " saal"]
                })
              })]
            }), /*#__PURE__*/_jsx(Slider, {
              value: [years],
              onValueChange: v => setYears(v[0]),
              min: 1,
              max: 30,
              step: 1
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between mt-1 text-[10px] text-[#94A3B8]",
              children: [/*#__PURE__*/_jsx("span", {
                children: "1 saal"
              }), /*#__PURE__*/_jsx("span", {
                children: "15 saal"
              }), /*#__PURE__*/_jsx("span", {
                children: "30 saal"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-2",
              children: [/*#__PURE__*/_jsx("label", {
                className: "text-sm font-semibold text-[#F8FAFC]",
                children: "Expected Return"
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/15",
                children: [/*#__PURE__*/_jsx(TrendingUp, {
                  className: "w-3.5 h-3.5 text-violet-400"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-sm font-bold text-violet-300",
                  children: [rate, "%"]
                })]
              })]
            }), /*#__PURE__*/_jsx(Slider, {
              value: [rate],
              onValueChange: v => setRate(v[0]),
              min: 8,
              max: 15,
              step: 0.5
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex justify-between mt-1 text-[10px] text-[#94A3B8]",
              children: [/*#__PURE__*/_jsx("span", {
                children: "8% (Safe)"
              }), /*#__PURE__*/_jsx("span", {
                children: "12% (Default)"
              }), /*#__PURE__*/_jsx("span", {
                children: "15% (Aggressive)"
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-3 gap-2",
          children: [/*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            className: "p-3 rounded-2xl glass-card text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-[#94A3B8] mb-0.5",
              children: "Invested"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-base font-bold text-emerald-300",
              children: formatCurrency(totalInvested, false)
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-[#94A3B8]",
              children: "\uD83D\uDFE2 Base"
            })]
          }), /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 0.1
            },
            className: "p-3 rounded-2xl glass-card text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-[#94A3B8] mb-0.5",
              children: "Returns"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-base font-bold text-amber-300",
              children: formatCurrency(totalReturns, false)
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-[#94A3B8]",
              children: "\uD83D\uDFE1 Peak"
            })]
          }), /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 0.2
            },
            className: "p-3 rounded-2xl glass-card-premium border-amber-400/30 text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-[#94A3B8] mb-0.5",
              children: "Total Value"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-base font-bold text-[#F8FAFC]",
              style: {
                textShadow: '0 0 12px rgba(245,158,11,0.5)'
              },
              children: formatCurrency(totalValue, false)
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-amber-300",
              children: "\uD83D\uDC8E Goal"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card flex items-center gap-4",
          children: [/*#__PURE__*/_jsxs("svg", {
            width: "90",
            height: "90",
            viewBox: "0 0 90 90",
            className: "shrink-0",
            children: [/*#__PURE__*/_jsx("circle", {
              cx: "45",
              cy: "45",
              r: "36",
              fill: "none",
              stroke: "rgba(255,255,255,0.06)",
              strokeWidth: "10"
            }), /*#__PURE__*/_jsx(motion.circle, {
              cx: "45",
              cy: "45",
              r: "36",
              fill: "none",
              stroke: "#10b981",
              strokeWidth: "10",
              strokeDasharray: `${2 * Math.PI * 36 * investedPct / 100} ${2 * Math.PI * 36}`,
              strokeLinecap: "round",
              transform: "rotate(-90 45 45)",
              initial: {
                strokeDasharray: '0 999'
              },
              animate: {
                strokeDasharray: `${2 * Math.PI * 36 * investedPct / 100} ${2 * Math.PI * 36}`
              },
              transition: {
                duration: 0.6
              }
            }), /*#__PURE__*/_jsx(motion.circle, {
              cx: "45",
              cy: "45",
              r: "36",
              fill: "none",
              stroke: "#f59e0b",
              strokeWidth: "10",
              strokeDasharray: `${2 * Math.PI * 36 * (100 - investedPct) / 100} ${2 * Math.PI * 36}`,
              strokeDashoffset: `-${2 * Math.PI * 36 * investedPct / 100}`,
              strokeLinecap: "round",
              transform: "rotate(-90 45 45)",
              initial: {
                strokeDasharray: '0 999'
              },
              animate: {
                strokeDasharray: `${2 * Math.PI * 36 * (100 - investedPct) / 100} ${2 * Math.PI * 36}`
              },
              transition: {
                duration: 0.6,
                delay: 0.2
              }
            }), /*#__PURE__*/_jsx("text", {
              x: "45",
              y: "42",
              textAnchor: "middle",
              fontSize: "8",
              fill: "#94A3B8",
              children: "Invested"
            }), /*#__PURE__*/_jsxs("text", {
              x: "45",
              y: "52",
              textAnchor: "middle",
              fontSize: "11",
              fontWeight: "bold",
              fill: "#F8FAFC",
              children: [Math.round(investedPct), "%"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1 space-y-1.5",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between text-xs",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1.5 text-[#94A3B8]",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "w-2 h-2 rounded-full bg-emerald-400"
                }), " Invested"]
              }), /*#__PURE__*/_jsxs("span", {
                className: "font-bold text-emerald-300",
                children: [Math.round(investedPct), "%"]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between text-xs",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1.5 text-[#94A3B8]",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "w-2 h-2 rounded-full bg-amber-400"
                }), " Returns"]
              }), /*#__PURE__*/_jsxs("span", {
                className: "font-bold text-amber-300",
                children: [Math.round(100 - investedPct), "%"]
              })]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-[10px] text-emerald-400 pt-1",
              children: ["\uD83D\uDCB0 Tumne ", formatCurrency(totalReturns, false), " extra kamaye!"]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-3",
            children: [/*#__PURE__*/_jsx(Flag, {
              className: "w-4 h-4 text-amber-400"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Milestone Journey"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-2",
            children: MILESTONES.map(m => {
              const crossed = m.value <= totalValue;
              return /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("div", {
                  className: cn('w-7 h-7 rounded-full grid place-items-center text-sm shrink-0', crossed ? 'bg-amber-400/20' : 'bg-white/[0.04] grayscale opacity-50'),
                  children: crossed ? m.emoji : '🔒'
                }), /*#__PURE__*/_jsx("span", {
                  className: cn('text-xs flex-1', crossed ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'),
                  children: m.label
                }), crossed ? /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-emerald-400 font-bold",
                  children: "\u2713 Crossed!"
                }) : /*#__PURE__*/_jsxs("span", {
                  className: "text-[10px] text-[#94A3B8]",
                  children: [Math.round(totalValue / m.value * 100), "% there"]
                })]
              }, m.value);
            })
          }), nextMilestone && /*#__PURE__*/_jsxs("div", {
            className: "mt-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between text-[10px] text-[#94A3B8] mb-1",
              children: [/*#__PURE__*/_jsxs("span", {
                children: ["Next: ", nextMilestone.label, " ", nextMilestone.emoji]
              }), /*#__PURE__*/_jsxs("span", {
                children: [Math.round(progressToNext), "%"]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-1.5 rounded-full bg-white/[0.06] overflow-hidden",
              children: /*#__PURE__*/_jsx(motion.div, {
                className: "h-full bg-gradient-to-r from-emerald-400 to-amber-400",
                animate: {
                  width: `${progressToNext}%`
                },
                transition: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 18
                }
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card border border-rose-500/20",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-1",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-base",
              children: "\uD83D\uDCC9"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Agar FD mein daalte"
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-[#94A3B8]",
            children: ["FD @6.5% se sirf ", /*#__PURE__*/_jsx("span", {
              className: "font-bold text-rose-300",
              children: formatCurrency(fdValue, false)
            }), " milta \u2014 matlab ", /*#__PURE__*/_jsx("span", {
              className: "font-bold text-amber-300",
              children: formatCurrency(totalReturns - fdGain, false)
            }), " kam! \uD83D\uDCC9 SIP ne ", Math.round(totalReturns / Math.max(fdGain, 1) * 100) / 100, "x zyada return diya!"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card-premium border-emerald-400/30",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-3",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-4 h-4 text-violet-400"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-violet-300",
              children: "Yeh amount kitna bada hai?"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-3 gap-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "text-center p-2 rounded-xl bg-white/[0.04]",
              children: [/*#__PURE__*/_jsx(Smartphone, {
                className: "w-5 h-5 mx-auto text-blue-400 mb-1"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-base font-bold text-[#F8FAFC]",
                children: iphones
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[9px] text-[#94A3B8]",
                children: "iPhones \uD83D\uDCF1"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-center p-2 rounded-xl bg-white/[0.04]",
              children: [/*#__PURE__*/_jsx(Bike, {
                className: "w-5 h-5 mx-auto text-emerald-400 mb-1"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-base font-bold text-[#F8FAFC]",
                children: enfields
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[9px] text-[#94A3B8]",
                children: "Enfields \uD83C\uDFCD\uFE0F"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-center p-2 rounded-xl bg-white/[0.04]",
              children: [/*#__PURE__*/_jsx(Plane, {
                className: "w-5 h-5 mx-auto text-amber-400 mb-1"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-base font-bold text-[#F8FAFC]",
                children: goaTrips
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[9px] text-[#94A3B8]",
                children: "Goa trips \u2708\uFE0F"
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("button", {
          onClick: () => {
            addCoins(5);
          },
          className: "w-full py-3 rounded-xl btn-3d bg-gradient-to-r from-emerald-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-1.5",
          children: [/*#__PURE__*/_jsx(Calculator, {
            className: "w-4 h-4"
          }), " Start SIP Today (+5 coins)"]
        })]
      })]
    })
  });
}