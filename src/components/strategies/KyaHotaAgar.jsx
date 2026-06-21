"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { TrendingDown, TrendingUp, Frown, Smile, Calendar, Sparkles, GraduationCap, Briefcase, Rocket } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SCENARIOS = [{
  id: 'student',
  label: 'Student',
  income: 15000,
  emoji: '🎓',
  icon: GraduationCap,
  desc: 'Pocket money + part-time'
}, {
  id: 'pro',
  label: 'Working Pro',
  income: 35000,
  emoji: '💼',
  icon: Briefcase,
  desc: 'First job, fresh start'
}, {
  id: 'freelancer',
  label: 'Freelancer',
  income: 50000,
  emoji: '🚀',
  icon: Rocket,
  desc: 'Gig economy earner'
}];
const SIP_RATE = 0.12; // 12% annual return
const OVERSPEND_RATE = 0.05; // 5% lifestyle overspend per year

function calcCareless(income, years) {
  // Spends 105% of income per year → debt accumulates with 18% interest
  let debt = 0;
  for (let i = 0; i < years; i++) {
    debt = (debt + income * 12 * OVERSPEND_RATE) * 1.18;
  }
  return {
    savings: 0,
    debt,
    total: -debt
  };
}
function calcSmart(income, years) {
  // Save 20% in SIP, 12% annual compounding (monthly)
  const monthlySIP = income * 0.20;
  const months = years * 12;
  const r = SIP_RATE / 12;
  const fv = monthlySIP * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthlySIP * 12 * years;
  return {
    invested,
    returns: fv - invested,
    total: fv
  };
}

// Smooth count-up hook
function useCountUp(target, duration = 450) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);
  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) return;
    const startTime = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (end - start) * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevRef.current = end;
    };
  }, [target, duration]);
  return value;
}
function formatINR(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs)}`;
}
export default function KyaHotaAgar() {
  const {
    addCoins
  } = useAppStore();
  const [scenarioId, setScenarioId] = useState('pro');
  const [year, setYear] = useState(10);
  const scenario = useMemo(() => SCENARIOS.find(s => s.id === scenarioId), [scenarioId]);
  const careless = useMemo(() => calcCareless(scenario.income, year), [scenario.income, year]);
  const smart = useMemo(() => calcSmart(scenario.income, year), [scenario.income, year]);
  const carelessTotal = useCountUp(careless.total);
  const smartTotal = useCountUp(smart.total);
  const smartReturns = useCountUp(smart.returns);
  const diff = smart.total - careless.total;

  const chartPoints = useMemo(() => {
    const points = [];
    for (let y = 1; y <= 20; y++) {
      const sVal = calcSmart(scenario.income, y).total;
      const cVal = calcCareless(scenario.income, y).total;
      points.push({ year: y, smart: sVal, careless: cVal });
    }
    return points;
  }, [scenario.income]);

  const { maxVal, minVal } = useMemo(() => {
    let max = 0;
    let min = 0;
    chartPoints.forEach(p => {
      if (p.smart > max) max = p.smart;
      if (p.careless < min) min = p.careless;
    });
    return { maxVal: max * 1.05, minVal: min * 1.05 };
  }, [chartPoints]);

  const width = 500;
  const height = 180;
  const padding = 20;

  const getX = (yearValue) => {
    return padding + ((yearValue - 1) / 19) * (width - 2 * padding);
  };

  const getY = (val) => {
    const range = maxVal - minVal;
    if (range === 0) return height / 2;
    return height - padding - ((val - minVal) / range) * (height - 2 * padding);
  };

  return /*#__PURE__*/_jsxs("div", {
    className: "w-full space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center space-y-2",
      children: [/*#__PURE__*/_jsx("div", {
        className: "flex items-center justify-center gap-2",
        children: /*#__PURE__*/_jsx("h2", {
          className: "text-2xl md:text-3xl font-display font-bold text-gradient-brand",
          children: "Kya Hota Agar..."
        })
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted font-medium",
        children: "Consequence Simulator \u2014 Aaj ke faisle ka 20 saal baad ka asar!"
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex flex-wrap gap-2 justify-center",
      children: SCENARIOS.map(s => {
        const Icon = s.icon;
        const active = s.id === scenarioId;
        return /*#__PURE__*/_jsxs(motion.button, {
          onClick: () => {
            setScenarioId(s.id);
            addCoins(2);
          },
          className: `px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${active ? 'bg-emerald/15 border-emerald/40 text-emerald glow-green' : 'glass border-white/10 text-ink-muted hover:border-emerald/30 hover:text-ink'}`,
          whileHover: {
            y: -2
          },
          whileTap: {
            scale: 0.97
          },
          children: [/*#__PURE__*/_jsx(Icon, {
            size: 16
          }), " ", s.label, " \xB7 ", formatINR(s.income), "/mo"]
        }, s.id);
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
      children: [/*#__PURE__*/_jsxs(motion.div, {
        className: "rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden",
        style: {
          background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
          border: '1px solid rgba(239,68,68,0.30)'
        },
        initial: {
          opacity: 0,
          x: -30
        },
        animate: {
          opacity: 1,
          x: 0
        },
        transition: {
          duration: 0.4
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(motion.span, {
              className: "text-3xl",
              animate: {
                y: [0, -3, 0],
                rotate: [0, -5, 5, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity
              },
              children: "\uD83D\uDE1F"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] uppercase tracking-wider text-red-400 font-bold",
                children: "Path A"
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display font-bold text-red-400 text-lg leading-none",
                children: "Agar aise hi chala"
              })]
            })]
          }), /*#__PURE__*/_jsx(TrendingDown, {
            className: "text-red-500",
            size: 22
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-ink-muted leading-relaxed",
          children: "Kharcha income se 5% zyada, credit card pe 18% interest, savings = ZERO. \uD83D\uDCB8"
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-3 pt-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 flex items-center justify-between",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-ink-muted font-medium",
              children: "Total Savings"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-red-400 text-xl",
              children: "\u20B90"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 flex items-center justify-between",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-ink-muted font-medium",
              children: "Debt (CC @18%)"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-red-500 text-xl",
              children: formatINR(careless.debt)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl p-3 flex items-center justify-between",
            style: {
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.35)'
            },
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs font-bold text-red-300",
              children: "Net Worth"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-red-400 text-2xl tabular-nums",
              children: formatINR(carelessTotal)
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 pt-1",
          children: [/*#__PURE__*/_jsx(Frown, {
            className: "text-red-400",
            size: 16
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-[11px] text-red-300/80 italic",
            children: [year, " saal me tum andar hi andar doobte jaoge!"]
          })]
        })]
      }), /*#__PURE__*/_jsxs(motion.div, {
        className: "rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden glow-green",
        style: {
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
          border: '1px solid rgba(16,185,129,0.35)'
        },
        initial: {
          opacity: 0,
          x: 30
        },
        animate: {
          opacity: 1,
          x: 0
        },
        transition: {
          duration: 0.4
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(motion.span, {
              className: "text-3xl",
              animate: {
                y: [0, -6, 0],
                rotate: [0, 5, -5, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity
              },
              children: "\uD83D\uDE0E"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] uppercase tracking-wider text-emerald font-bold",
                children: "Path B"
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display font-bold text-emerald text-lg leading-none",
                children: "Agar smart bane"
              })]
            })]
          }), /*#__PURE__*/_jsx(TrendingUp, {
            className: "text-emerald",
            size: 22
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-ink-muted leading-relaxed",
          children: "20% income SIP me invest, 12% annual return. Compounding ka jaadu! \uD83C\uDF31"
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-3 pt-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 flex items-center justify-between",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-ink-muted font-medium",
              children: "Total Invested"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-ink text-xl",
              children: formatINR(smart.invested)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 flex items-center justify-between",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-ink-muted font-medium",
              children: "Returns Earned"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-emerald text-xl",
              children: formatINR(smartReturns)
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl p-3 flex items-center justify-between",
            style: {
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.35)'
            },
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs font-bold text-emerald",
              children: "Net Worth"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-gradient-emerald font-display font-bold text-2xl tabular-nums",
              children: formatINR(smartTotal)
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 pt-1",
          children: [/*#__PURE__*/_jsx(Smile, {
            className: "text-emerald",
            size: 16
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-[11px] text-emerald/80 italic",
            children: [year, " saal me tum financial freedom ke kareeb pahunchoge!"]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-5 space-y-4 border border-white/[0.06] bg-gradient-to-b from-[#0F1326]/60 to-[#0B0F19]/80 overflow-hidden relative",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h4", {
            className: "text-xs uppercase tracking-wider text-zinc-400 font-bold",
            children: "20-Year Growth Comparison Graph"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[11px] text-zinc-500 mt-0.5",
            children: "Green = Smart SIP path, Red = Careless Debt path"
          })]
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
          children: "COMPARE VISUALS"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative h-44 w-full bg-black/40 rounded-xl border border-white/[0.04] p-1 flex items-center justify-center overflow-hidden",
        children: [/*#__PURE__*/_jsxs("svg", {
          className: "w-full h-full",
          viewBox: `0 0 ${width} ${height}`,
          preserveAspectRatio: "none",
          children: [/*#__PURE__*/_jsxs("defs", {
            children: [/*#__PURE__*/_jsxs("linearGradient", {
              id: "smartGlow",
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
              children: [/*#__PURE__*/_jsx("stop", {
                offset: "0%",
                stopColor: "#10B981",
                stopOpacity: "0.2"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "100%",
                stopColor: "#10B981",
                stopOpacity: "0.0"
              })]
            }), /*#__PURE__*/_jsxs("linearGradient", {
              id: "carelessGlow",
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
              children: [/*#__PURE__*/_jsx("stop", {
                offset: "0%",
                stopColor: "#EF4444",
                stopOpacity: "0.0"
              }), /*#__PURE__*/_jsx("stop", {
                offset: "100%",
                stopColor: "#EF4444",
                stopOpacity: "0.15"
              })]
            })]
          }), /*#__PURE__*/_jsx("line", {
            x1: padding,
            y1: getY(0),
            x2: width - padding,
            y2: getY(0),
            stroke: "rgba(255,255,255,0.15)",
            strokeWidth: "1",
            strokeDasharray: "4 4"
          }), /*#__PURE__*/_jsx("path", {
            d: `M ${getX(1)} ${getY(0)} ${chartPoints.map(p => `L ${getX(p.year)} ${getY(p.smart)}`).join(' ')} L ${getX(20)} ${getY(0)} Z`,
            fill: "url(#smartGlow)"
          }), /*#__PURE__*/_jsx("path", {
            d: `M ${getX(1)} ${getY(0)} ${chartPoints.map(p => `L ${getX(p.year)} ${getY(p.careless)}`).join(' ')} L ${getX(20)} ${getY(0)} Z`,
            fill: "url(#carelessGlow)"
          }), /*#__PURE__*/_jsx("path", {
            d: chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.smart)}`).join(' '),
            fill: "none",
            stroke: "#10B981",
            strokeWidth: "2.5",
            strokeLinecap: "round"
          }), /*#__PURE__*/_jsx("path", {
            d: chartPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.year)} ${getY(p.careless)}`).join(' '),
            fill: "none",
            stroke: "#EF4444",
            strokeWidth: "2",
            strokeLinecap: "round"
          }), /*#__PURE__*/_jsx("line", {
            x1: getX(year),
            y1: padding,
            x2: getX(year),
            y2: height - padding,
            stroke: "rgba(255,255,255,0.3)",
            strokeWidth: "1.5",
            strokeDasharray: "2 2"
          }), /*#__PURE__*/_jsx("circle", {
            cx: getX(year),
            cy: getY(calcSmart(scenario.income, year).total),
            r: "5",
            fill: "#10B981",
            stroke: "#fff",
            strokeWidth: "1.5"
          }), /*#__PURE__*/_jsx("circle", {
            cx: getX(year),
            cy: getY(calcCareless(scenario.income, year).total),
            r: "5",
            fill: "#EF4444",
            stroke: "#fff",
            strokeWidth: "1.5"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg transition-all duration-200",
          style: {
            left: `${Math.min(90, Math.max(10, (getX(year) / width) * 100))}%`,
            top: `${Math.min(90, Math.max(5, (getY(calcSmart(scenario.income, year).total) / height) * 100 - 15))}%`,
            transform: 'translateX(-50%)'
          },
          children: formatINR(calcSmart(scenario.income, year).total)
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg transition-all duration-200",
          style: {
            left: `${Math.min(90, Math.max(10, (getX(year) / width) * 100))}%`,
            top: `${Math.min(90, Math.max(10, (getY(calcCareless(scenario.income, year).total) / height) * 100 + 15))}%`,
            transform: 'translateX(-50%)'
          },
          children: formatINR(calcCareless(scenario.income, year).total)
        })]
      })]
    }), /*#__PURE__*/_jsxs(motion.div, {
      className: "glass-card-premium rounded-2xl p-4 text-center",
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
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-xs text-ink-muted font-medium",
        children: "Dono paths ka farq (Net Worth gap)"
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-3xl font-display font-bold text-gradient-gold mt-1",
        children: ["+ ", formatINR(diff)]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-[11px] text-ink-muted mt-1",
        children: "Yeh extra wealth sirf 20% SIP ki vajah se! \uD83C\uDFAF"
      })]
    }, `diff-${diff}`), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-5 space-y-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Calendar, {
            className: "text-ai",
            size: 18
          }), /*#__PURE__*/_jsx("span", {
            className: "text-sm font-semibold text-ink",
            children: "Time Travel"
          })]
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-2xl font-display font-bold text-gradient-brand tabular-nums",
          children: ["Year ", year]
        })]
      }), /*#__PURE__*/_jsx("input", {
        type: "range",
        min: 1,
        max: 20,
        value: year,
        onChange: e => setYear(Number(e.target.value)),
        className: "w-full accent-emerald cursor-pointer"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex justify-between text-[10px] text-ink-muted font-medium",
        children: [/*#__PURE__*/_jsx("span", {
          children: "Year 1 (Aaj)"
        }), /*#__PURE__*/_jsx("span", {
          children: "Year 10"
        }), /*#__PURE__*/_jsx("span", {
          children: "Year 20 (Future)"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass rounded-xl p-4 flex items-start gap-3",
      children: [/*#__PURE__*/_jsx("span", {
        className: "text-2xl shrink-0",
        children: "\uD83D\uDCA1"
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-xs text-ink-muted leading-relaxed",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-emerald font-semibold",
          children: "Pro Tip:"
        }), " SIP shuru karne ka best time 5 saal pehle tha, dusra best time aaj hai! Chahe \u20B9500 se shuru karo, bas consistent raho. Compounding ka jaadu dheere dheere dikhega."]
      })]
    })]
  });
}