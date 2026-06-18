'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { TrendingUp, Coins, Award, Calendar, Percent } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const fmtINR = n => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
};
const STAGES = [{
  maxYear: 2,
  emoji: '🌰',
  label: 'Beej (Seed)',
  color: '#A16207'
}, {
  maxYear: 5,
  emoji: '🌱',
  label: 'Paudha (Sapling)',
  color: '#65A30D'
}, {
  maxYear: 12,
  emoji: '🌿',
  label: 'Jawan Paudha',
  color: '#16A34A'
}, {
  maxYear: 22,
  emoji: '🌳',
  label: 'Bada Ped (Full Tree)',
  color: '#15803D'
}, {
  maxYear: 99,
  emoji: '✨',
  label: 'Sunehra Ped (Golden)',
  color: '#F59E0B'
}];
const MILESTONES = [{
  val: 100000,
  label: '₹1 Lakh',
  emoji: '🥉'
}, {
  val: 500000,
  label: '₹5 Lakh',
  emoji: '🥈'
}, {
  val: 1000000,
  label: '₹10 Lakh',
  emoji: '🥇'
}, {
  val: 10000000,
  label: '₹1 Crore',
  emoji: '💎'
}];
export default function CompoundingTree() {
  const addCoins = useAppStore(s => s.addCoins);
  const addBadge = useAppStore(s => s.addBadge);
  const [sip, setSip] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [hitMilestones, setHitMilestones] = useState([]);
  const [planted, setPlanted] = useState(false);

  // FV = P × [((1+r/12)^(n*12) - 1) / (r/12)] × (1+r/12)
  const {
    invested,
    future,
    gain,
    multiplier
  } = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const inv = sip * 12 * years;
    const fv = r === 0 ? sip * n : sip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return {
      invested: inv,
      future: fv,
      gain: fv - inv,
      multiplier: inv > 0 ? fv / inv : 0
    };
  }, [sip, years, rate]);

  // Rule of 72
  const doubleYears = useMemo(() => rate > 0 ? 72 / rate : 0, [rate]);
  const stage = useMemo(() => STAGES.find(s => years <= s.maxYear) || STAGES[STAGES.length - 1], [years]);
  const stageIdx = STAGES.indexOf(stage);
  const isGolden = stageIdx === 4;

  // Milestone tracking + rewards
  useEffect(() => {
    if (!planted) return;
    MILESTONES.forEach(m => {
      if (future >= m.val && !hitMilestones.includes(m.val)) {
        setHitMilestones(prev => [...prev, m.val]);
        addCoins(20);
        if (m.val === 10000000) addBadge('crorepati-dream');
      }
    });
  }, [future, planted, hitMilestones, addCoins, addBadge]);

  // Tree leaf count grows with years
  const leafCount = Math.min(50, 5 + Math.floor(years * 1.6));
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-5",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "font-display text-3xl md:text-4xl font-bold text-gradient-emerald",
        children: "Compounding Ka Jadoo \uD83C\uDF33"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-zinc-400 mt-2 text-sm",
        children: "Beej bojo (SIP), ped ugao (wealth). Time + compounding = Sunehra future."
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative rounded-2xl glass-card overflow-hidden",
      style: {
        minHeight: '320px',
        background: 'linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(16,185,129,0.04) 50%, rgba(11,18,32,0.7) 100%)'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        className: "absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-xl",
          children: stage.emoji
        }), /*#__PURE__*/_jsx("span", {
          className: "text-xs font-semibold",
          style: {
            color: stage.color
          },
          children: stage.label
        })]
      }), years >= 20 && /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 pointer-events-none overflow-hidden",
        children: Array.from({
          length: 12
        }).map((_, i) => /*#__PURE__*/_jsx(motion.div, {
          initial: {
            y: -20,
            x: `${10 + i * 7}%`,
            opacity: 0,
            rotate: 0
          },
          animate: {
            y: 320,
            opacity: [0, 1, 0],
            rotate: 360
          },
          transition: {
            duration: 4 + i % 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeIn'
          },
          className: "absolute text-lg",
          children: isGolden ? '🍂' : '🍃'
        }, i))
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 flex items-end justify-center pb-4",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            scale: 0.8,
            opacity: 0.5
          },
          animate: {
            scale: 1,
            opacity: 1
          },
          transition: {
            type: 'spring',
            stiffness: 80
          },
          className: "relative",
          style: {
            width: `${120 + years * 8}px`,
            height: `${140 + years * 8}px`
          },
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute left-1/2 -translate-x-1/2 bottom-0 rounded-t-md",
            style: {
              width: `${10 + years * 0.6}px`,
              height: `${60 + years * 4}px`,
              background: 'linear-gradient(180deg, #92400E, #78350F)',
              boxShadow: '0 0 12px rgba(0,0,0,0.4)'
            }
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 flex items-start justify-center",
            children: /*#__PURE__*/_jsxs("div", {
              className: "relative",
              style: {
                width: '100%',
                height: '70%'
              },
              children: [Array.from({
                length: leafCount
              }).map((_, i) => {
                const angle = i / leafCount * Math.PI * 2;
                const radius = 30 + i % 3 * 18;
                const cx = 50 + Math.cos(angle) * radius * 0.8;
                const cy = 40 + Math.sin(angle) * radius * 0.6;
                return /*#__PURE__*/_jsx(motion.div, {
                  initial: {
                    scale: 0
                  },
                  animate: {
                    scale: 1
                  },
                  transition: {
                    delay: i * 0.02
                  },
                  className: "absolute rounded-full",
                  style: {
                    left: `${cx}%`,
                    top: `${cy}%`,
                    width: `${18 + i % 4 * 4}px`,
                    height: `${18 + i % 4 * 4}px`,
                    background: isGolden ? `radial-gradient(circle, #FCD34D, #F59E0B)` : `radial-gradient(circle, #34D399, #059669)`,
                    boxShadow: isGolden ? '0 0 8px rgba(245,158,11,0.5)' : '0 0 6px rgba(16,185,129,0.3)'
                  }
                }, i);
              }), isGolden && /*#__PURE__*/_jsx(motion.div, {
                animate: {
                  rotate: 360,
                  scale: [1, 1.2, 1]
                },
                transition: {
                  rotate: {
                    duration: 8,
                    repeat: Infinity
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity
                  }
                },
                className: "absolute top-0 left-1/2 -translate-x-1/2 text-2xl",
                children: "\u2B50"
              })]
            })
          })]
        }, stageIdx)
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/40 border border-amber-500/30",
        children: /*#__PURE__*/_jsxs("span", {
          className: "text-xs text-amber-300 font-bold",
          children: [multiplier.toFixed(1), "x growth"]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-3 gap-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "glass rounded-xl p-3 text-center",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[10px] uppercase tracking-wide text-zinc-400 mb-1",
          children: "Tum Lagaye"
        }), /*#__PURE__*/_jsx("p", {
          className: "font-display text-lg font-bold text-white",
          children: fmtINR(invested)
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "glass rounded-xl p-3 text-center border border-amber-500/30",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[10px] uppercase tracking-wide text-amber-400 mb-1",
          children: "Milega"
        }), /*#__PURE__*/_jsx("p", {
          className: "font-display text-lg font-bold text-gradient-gold",
          children: fmtINR(future)
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "glass rounded-xl p-3 text-center border border-emerald-500/30",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-[10px] uppercase tracking-wide text-emerald-400 mb-1",
          children: "Fayda"
        }), /*#__PURE__*/_jsx("p", {
          className: "font-display text-lg font-bold text-emerald-400",
          children: fmtINR(gain)
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-5 space-y-4",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-2",
          children: [/*#__PURE__*/_jsxs("label", {
            className: "text-sm text-zinc-300 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Coins, {
              className: "w-4 h-4 text-amber-400"
            }), " Monthly SIP"]
          }), /*#__PURE__*/_jsxs("span", {
            className: "font-display text-amber-400 font-bold",
            children: ["\u20B9", sip.toLocaleString('en-IN')]
          })]
        }), /*#__PURE__*/_jsx("input", {
          type: "range",
          min: 500,
          max: 50000,
          step: 500,
          value: sip,
          onChange: e => {
            setSip(Number(e.target.value));
            setPlanted(true);
          },
          className: "w-full h-2 rounded-full appearance-none cursor-pointer",
          style: {
            background: `linear-gradient(90deg, #F59E0B 0%, #F59E0B ${sip / 50000 * 100}%, rgba(255,255,255,0.1) ${sip / 50000 * 100}%)`
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-2",
          children: [/*#__PURE__*/_jsxs("label", {
            className: "text-sm text-zinc-300 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Calendar, {
              className: "w-4 h-4 text-emerald-400"
            }), " Time Period"]
          }), /*#__PURE__*/_jsxs("span", {
            className: "font-display text-emerald-400 font-bold",
            children: [years, " Years"]
          })]
        }), /*#__PURE__*/_jsx("input", {
          type: "range",
          min: 1,
          max: 30,
          step: 1,
          value: years,
          onChange: e => setYears(Number(e.target.value)),
          className: "w-full h-2 rounded-full appearance-none cursor-pointer",
          style: {
            background: `linear-gradient(90deg, #10B981 0%, #10B981 ${years / 30 * 100}%, rgba(255,255,255,0.1) ${years / 30 * 100}%)`
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-2",
          children: [/*#__PURE__*/_jsxs("label", {
            className: "text-sm text-zinc-300 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Percent, {
              className: "w-4 h-4 text-purple-400"
            }), " Expected Return"]
          }), /*#__PURE__*/_jsxs("span", {
            className: "font-display text-purple-400 font-bold",
            children: [rate, "%"]
          })]
        }), /*#__PURE__*/_jsx("input", {
          type: "range",
          min: 8,
          max: 15,
          step: 0.5,
          value: rate,
          onChange: e => setRate(Number(e.target.value)),
          className: "w-full h-2 rounded-full appearance-none cursor-pointer",
          style: {
            background: `linear-gradient(90deg, #8B5CF6 0%, #8B5CF6 ${(rate - 8) / 7 * 100}%, rgba(255,255,255,0.1) ${(rate - 8) / 7 * 100}%)`
          }
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-4 flex items-center gap-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0",
        children: /*#__PURE__*/_jsx(TrendingUp, {
          className: "w-6 h-6 text-purple-400"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-xs uppercase tracking-wide text-zinc-400",
          children: "Rule of 72"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-white",
          children: [rate, "% pe paisa ", /*#__PURE__*/_jsxs("span", {
            className: "text-purple-300 font-bold",
            children: [doubleYears.toFixed(1), " saal"]
          }), " mein double hota hai."]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "text-right",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-xs text-zinc-400",
          children: "Doubles in"
        }), /*#__PURE__*/_jsxs("p", {
          className: "font-display text-2xl font-bold text-purple-300",
          children: [doubleYears.toFixed(0), /*#__PURE__*/_jsx("span", {
            className: "text-xs",
            children: "yr"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 mb-2",
        children: [/*#__PURE__*/_jsx(Award, {
          className: "w-4 h-4 text-amber-400"
        }), /*#__PURE__*/_jsx("h3", {
          className: "font-display text-sm font-semibold text-white",
          children: "Milestones"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-4 gap-2",
        children: MILESTONES.map(m => {
          const hit = future >= m.val;
          return /*#__PURE__*/_jsxs(motion.div, {
            animate: hit ? {
              scale: [1, 1.1, 1]
            } : {
              scale: 1
            },
            transition: {
              duration: 0.4
            },
            className: `rounded-xl p-3 text-center border transition-all ${hit ? 'bg-amber-500/15 border-amber-500/40 glow-gold' : 'glass border-white/10 opacity-50'}`,
            children: [/*#__PURE__*/_jsx("div", {
              className: `text-2xl mb-1 ${hit ? '' : 'grayscale'}`,
              children: m.emoji
            }), /*#__PURE__*/_jsx("p", {
              className: `text-xs font-bold ${hit ? 'text-amber-300' : 'text-zinc-500'}`,
              children: m.label
            })]
          }, m.val);
        })
      })]
    }), /*#__PURE__*/_jsx("p", {
      className: "text-center text-[11px] text-zinc-500 italic",
      children: "Formula: FV = P \xD7 [((1+r/12)^(n\xD712) \u2212 1) / (r/12)] \xD7 (1+r/12)"
    })]
  });
}