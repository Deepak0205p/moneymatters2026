'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { calculateInflation, calculateCompound, formatCurrency } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Shield, TrendingDown, TrendingUp, Scale } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const INFLATION_RATE = 6; // 6% average Indian inflation
const INVESTMENT_RETURN = 12; // 12% average equity return

// ─── Animated Number Component ─────────────────────────────
function AnimatedNumber({
  value,
  className
}) {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30
  });
  const display = useTransform(spring, latest => formatCurrency(Math.round(latest)));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return /*#__PURE__*/_jsx(motion.span, {
    className: className,
    children: display
  });
}

// ─── Coin Stack Component ──────────────────────────────────
function CoinStack({
  count,
  maxCount,
  color,
  side
}) {
  const visibleCoins = Math.max(1, Math.round(count / maxCount * 8));
  const coinColor = color === 'red' ? 'bg-gradient-to-t from-red-700 to-red-500 border-red-400/40' : 'bg-gradient-to-t from-emerald-700 to-emerald-500 border-emerald-400/40';
  const shadowColor = color === 'red' ? 'shadow-red-500/20' : 'shadow-emerald-500/20';
  return /*#__PURE__*/_jsx("div", {
    className: `flex flex-col-reverse items-center gap-[2px] ${side === 'left' ? 'mr-4' : 'ml-4'}`,
    children: Array.from({
      length: 8
    }).map((_, i) => /*#__PURE__*/_jsx(motion.div, {
      className: `w-10 h-[6px] rounded-[2px] border shadow-sm ${shadowColor} ${i < visibleCoins ? coinColor : 'bg-gray-800/30 border-gray-700/20'}`,
      animate: {
        scaleY: i < visibleCoins ? 1 : 0.3,
        opacity: i < visibleCoins ? 1 : 0.15
      },
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: i * 0.03
      }
    }, i))
  });
}

// ─── Chor (Bandit) SVG Character ───────────────────────────
function ChorCharacter({
  years
}) {
  const eatScale = 0.8 + years / 20 * 0.6; // grows with years (eats more)

  return /*#__PURE__*/_jsxs(motion.svg, {
    viewBox: "0 0 120 140",
    className: "w-28 h-32 sm:w-32 sm:h-36",
    animate: {
      scale: eatScale
    },
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20
    },
    children: [/*#__PURE__*/_jsx("rect", {
      x: "35",
      y: "70",
      width: "50",
      height: "50",
      rx: "8",
      fill: "#1a1a2e",
      stroke: "#ef4444",
      strokeWidth: "2"
    }), /*#__PURE__*/_jsx("line", {
      x1: "45",
      y1: "80",
      x2: "75",
      y2: "110",
      stroke: "#ef4444",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("line", {
      x1: "75",
      y1: "80",
      x2: "45",
      y2: "110",
      stroke: "#ef4444",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "60",
      cy: "40",
      r: "25",
      fill: "#1a1a2e",
      stroke: "#ef4444",
      strokeWidth: "2"
    }), /*#__PURE__*/_jsx("rect", {
      x: "35",
      y: "30",
      width: "50",
      height: "16",
      rx: "4",
      fill: "#ef4444",
      opacity: "0.9"
    }), /*#__PURE__*/_jsx("ellipse", {
      cx: "47",
      cy: "38",
      rx: "6",
      ry: "5",
      fill: "#0a0a15"
    }), /*#__PURE__*/_jsx("ellipse", {
      cx: "73",
      cy: "38",
      rx: "6",
      ry: "5",
      fill: "#0a0a15"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "49",
      cy: "36",
      r: "1.5",
      fill: "#fca5a5"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "75",
      cy: "36",
      r: "1.5",
      fill: "#fca5a5"
    }), /*#__PURE__*/_jsx("path", {
      d: "M 50 50 Q 60 56 70 50",
      fill: "none",
      stroke: "#fca5a5",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsxs(motion.g, {
      animate: {
        rotate: years > 10 ? [0, 10, 0] : 0
      },
      transition: {
        repeat: Infinity,
        duration: 1.5
      },
      children: [/*#__PURE__*/_jsx("line", {
        x1: "35",
        y1: "80",
        x2: "15",
        y2: "95",
        stroke: "#ef4444",
        strokeWidth: "3",
        strokeLinecap: "round"
      }), /*#__PURE__*/_jsx("line", {
        x1: "85",
        y1: "80",
        x2: "105",
        y2: "95",
        stroke: "#ef4444",
        strokeWidth: "3",
        strokeLinecap: "round"
      })]
    }), /*#__PURE__*/_jsx("line", {
      x1: "48",
      y1: "120",
      x2: "40",
      y2: "138",
      stroke: "#ef4444",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("line", {
      x1: "72",
      y1: "120",
      x2: "80",
      y2: "138",
      stroke: "#ef4444",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsxs(motion.g, {
      animate: {
        y: [0, -3, 0]
      },
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      },
      children: [/*#__PURE__*/_jsx("circle", {
        cx: "95",
        cy: "85",
        r: "10",
        fill: "#f59e0b",
        opacity: "0.8"
      }), /*#__PURE__*/_jsx("text", {
        x: "95",
        y: "89",
        textAnchor: "middle",
        fill: "#0a0a15",
        fontSize: "10",
        fontWeight: "bold",
        children: "\u20B9"
      })]
    })]
  });
}

// ─── Hero (Shield) SVG Character ───────────────────────────
function HeroCharacter({
  years
}) {
  const heroScale = 0.8 + years / 20 * 0.5;
  return /*#__PURE__*/_jsxs(motion.svg, {
    viewBox: "0 0 120 140",
    className: "w-28 h-32 sm:w-32 sm:h-36",
    animate: {
      scale: heroScale
    },
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20
    },
    children: [/*#__PURE__*/_jsx("rect", {
      x: "35",
      y: "70",
      width: "50",
      height: "50",
      rx: "8",
      fill: "#1a1a2e",
      stroke: "#10b981",
      strokeWidth: "2"
    }), /*#__PURE__*/_jsx("polyline", {
      points: "48,90 56,100 76,82",
      fill: "none",
      stroke: "#10b981",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "60",
      cy: "40",
      r: "25",
      fill: "#1a1a2e",
      stroke: "#10b981",
      strokeWidth: "2"
    }), /*#__PURE__*/_jsx("polygon", {
      points: "38,28 60,15 82,28",
      fill: "#10b981",
      opacity: "0.8"
    }), /*#__PURE__*/_jsx("rect", {
      x: "44",
      y: "33",
      width: "8",
      height: "6",
      rx: "2",
      fill: "#10b981"
    }), /*#__PURE__*/_jsx("rect", {
      x: "68",
      y: "33",
      width: "8",
      height: "6",
      rx: "2",
      fill: "#10b981"
    }), /*#__PURE__*/_jsx("path", {
      d: "M 48 52 Q 60 60 72 52",
      fill: "none",
      stroke: "#6ee7b7",
      strokeWidth: "2",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("line", {
      x1: "35",
      y1: "80",
      x2: "12",
      y2: "75",
      stroke: "#10b981",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("line", {
      x1: "85",
      y1: "80",
      x2: "108",
      y2: "75",
      stroke: "#10b981",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsxs(motion.g, {
      animate: {
        scale: [1, 1.1, 1]
      },
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      },
      children: [/*#__PURE__*/_jsx("path", {
        d: "M100,62 L108,66 L108,78 Q108,86 100,90 Q92,86 92,78 L92,66 Z",
        fill: "#10b981",
        opacity: "0.7",
        stroke: "#6ee7b7",
        strokeWidth: "1"
      }), /*#__PURE__*/_jsx("text", {
        x: "100",
        y: "80",
        textAnchor: "middle",
        fill: "#0a0a15",
        fontSize: "9",
        fontWeight: "bold",
        children: "\u20B9"
      })]
    }), /*#__PURE__*/_jsx("line", {
      x1: "48",
      y1: "120",
      x2: "40",
      y2: "138",
      stroke: "#10b981",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsx("line", {
      x1: "72",
      y1: "120",
      x2: "80",
      y2: "138",
      stroke: "#10b981",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/_jsxs(motion.g, {
      animate: {
        opacity: [0.3, 1, 0.3],
        y: [2, -2, 2]
      },
      transition: {
        repeat: Infinity,
        duration: 1.5
      },
      children: [/*#__PURE__*/_jsx("polyline", {
        points: "20,100 20,85 14,91",
        fill: "none",
        stroke: "#10b981",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/_jsx("polyline", {
        points: "20,85 26,91",
        fill: "none",
        stroke: "#10b981",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })]
    })]
  });
}

// ─── Main Component ────────────────────────────────────────
export default function InflationMonster() {
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(5);
  const [inputValue, setInputValue] = useState('1000');

  // ─── Calculations ─────────────────────────────────────
  const realValue = useMemo(() => calculateInflation(amount, INFLATION_RATE, years), [amount, years]);
  const investedValue = useMemo(() => calculateCompound(amount, INVESTMENT_RETURN, years), [amount, years]);
  const chorAte = amount - realValue;
  const heroGained = investedValue - amount;
  const difference = investedValue - realValue;

  // ─── Handle amount input ──────────────────────────────
  const handleAmountChange = val => {
    setInputValue(val);
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0 && num <= 10000000) {
      setAmount(num);
    }
  };
  const handleAmountBlur = () => {
    setInputValue(amount.toString());
  };

  // ─── Insight text ─────────────────────────────────────
  const insightText = useMemo(() => {
    if (years <= 3) return `${years} saal mein inflation ne dhire dhire paisa khana shuru kiya!`;
    if (years <= 7) return `${years} saal mein inflation ne kaafi paisa kha liya! Invest karna zaroori hai.`;
    if (years <= 12) return `${years} saal mein inflation ne aadha se zyada value kha li! Bina invest ke paise sarr rahe hain!`;
    if (years <= 17) return `${years} saal mein inflation ne tauba tauba kiya! Sirf ${Math.round(realValue)} bacha hai ${amount} mein se!`;
    return `${years} saal mein inflation ne aadha paisa kha liya! ${formatCurrency(amount)} sirf ${formatCurrency(Math.round(realValue))} reh gaya! Investing ne ${formatCurrency(Math.round(investedValue))} bana diya!`;
  }, [years, realValue, investedValue, amount]);
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center w-full max-w-xl mx-auto px-3 sm:px-4 py-4 select-none aurora-bg",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center mb-6",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl sm:text-2xl font-bold text-gradient-gold mb-1",
        children: "Chhupa Hua Chor \uD83E\uDDB9"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-[#a0a0b8] font-medium",
        children: "Inflation chor hai, investing hero hai \u2014 dekho kaise!"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full bg-[#12121a] border border-white/10 rounded-xl p-4 mb-4",
      children: [/*#__PURE__*/_jsx("label", {
        className: "text-xs text-[#a0a0b8] mb-1 block font-medium",
        children: "Amount (\u20B9)"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-amber-400 font-bold text-lg",
          children: "\u20B9"
        }), /*#__PURE__*/_jsx(Input, {
          type: "text",
          value: inputValue,
          onChange: e => handleAmountChange(e.target.value),
          onBlur: handleAmountBlur,
          className: "bg-transparent border-white/10 text-white text-lg font-semibold h-10 focus:border-amber-500/50",
          placeholder: "1,000"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex gap-2 mt-3",
        children: [1000, 5000, 10000, 50000, 100000].map(val => /*#__PURE__*/_jsx("button", {
          onClick: () => {
            setAmount(val);
            setInputValue(val.toString());
          },
          className: `text-xs px-2 py-1 rounded-md border transition-all ${amount === val ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-[#a0a0b8] hover:border-white/20 hover:bg-white/[0.04] transition-colors'}`,
          children: val >= 1000 ? `${val / 1000}K` : val
        }, val))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-2",
        children: [/*#__PURE__*/_jsx("label", {
          className: "text-xs text-[#a0a0b8] font-medium",
          children: "Years ahead"
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-amber-400 font-bold text-lg",
          children: [years, " saal"]
        })]
      }), /*#__PURE__*/_jsx(Slider, {
        value: [years],
        onValueChange: ([val]) => setYears(val),
        min: 1,
        max: 20,
        step: 1,
        className: "w-full"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex justify-between text-xs text-[#a0a0b8]/60 mt-1",
        children: [/*#__PURE__*/_jsx("span", {
          children: "1"
        }), /*#__PURE__*/_jsx("span", {
          children: "5"
        }), /*#__PURE__*/_jsx("span", {
          children: "10"
        }), /*#__PURE__*/_jsx("span", {
          children: "15"
        }), /*#__PURE__*/_jsx("span", {
          children: "20"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full flex items-start justify-center gap-2 sm:gap-4 mb-6 relative",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 flex items-center justify-center pointer-events-none gap-[2px]",
        children: Array.from({
          length: 20
        }).map((_, i) => /*#__PURE__*/_jsx("div", {
          className: "sound-wave-bar w-[2px] bg-amber-500/10 rounded-full",
          style: {
            height: `${8 + Math.abs(Math.sin(i * 0.5)) * 20}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${1 + i % 3 * 0.3}s`
          }
        }, i))
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 flex flex-col items-center relative z-10 glass-card-premium rounded-xl p-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "text-center mb-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-red-400 font-bold text-sm",
            children: "CHOR \uD83D\uDC80"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-[10px] text-[#a0a0b8]",
            children: ["Inflation @", INFLATION_RATE, "%"]
          })]
        }), /*#__PURE__*/_jsx(ChorCharacter, {
          years: years
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-end mt-3",
          children: [/*#__PURE__*/_jsx(CoinStack, {
            count: realValue,
            maxCount: amount,
            color: "red",
            side: "left"
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-xs text-[#a0a0b8] mb-1 font-medium",
              children: "Real value"
            }), /*#__PURE__*/_jsx(AnimatedNumber, {
              value: Math.round(realValue),
              className: "text-lg font-bold text-red-400"
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-center gap-1 mt-1",
              children: [/*#__PURE__*/_jsx(TrendingDown, {
                className: "w-3 h-3 text-red-400"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-[10px] text-red-400",
                children: ["-", Math.round(chorAte / amount * 100), "% kha liya"]
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center justify-center pt-20",
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center",
          animate: {
            scale: [1, 1.15, 1]
          },
          transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          },
          children: /*#__PURE__*/_jsx(Scale, {
            className: "w-5 h-5 text-amber-400"
          })
        }), /*#__PURE__*/_jsx("span", {
          className: "text-amber-400 font-bold text-xs mt-1",
          children: "VS"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 flex flex-col items-center glass-card-premium rounded-xl p-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "text-center mb-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-emerald-400 font-bold text-sm",
            children: "HERO \uD83D\uDEE1\uFE0F"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-[10px] text-[#a0a0b8]",
            children: ["Investing @", INVESTMENT_RETURN, "%"]
          })]
        }), /*#__PURE__*/_jsx(HeroCharacter, {
          years: years
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-end mt-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-xs text-[#a0a0b8] mb-1 font-medium",
              children: "Invested value"
            }), /*#__PURE__*/_jsx(AnimatedNumber, {
              value: Math.round(investedValue),
              className: "text-lg font-bold text-emerald-400"
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-center gap-1 mt-1",
              children: [/*#__PURE__*/_jsx(TrendingUp, {
                className: "w-3 h-3 text-emerald-400"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-[10px] text-emerald-400",
                children: ["+", Math.round(heroGained / amount * 100), "% badha diya"]
              })]
            })]
          }), /*#__PURE__*/_jsx(CoinStack, {
            count: investedValue,
            maxCount: investedValue,
            color: "green",
            side: "right"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full glow-line mb-4"
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full card-dark rounded-xl p-4 mb-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "text-center text-xs text-[#a0a0b8] mb-3 font-medium",
        children: [formatCurrency(amount), " ka ", years, " saal baad kya banta hai?"]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative w-full h-8 rounded-full overflow-hidden bg-gray-800 mb-3",
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "absolute left-0 top-0 h-full bg-gradient-to-r from-red-700 to-red-500 rounded-l-full",
          animate: {
            width: `${Math.max(5, realValue / investedValue * 100)}%`
          },
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20
          }
        }), /*#__PURE__*/_jsx(motion.div, {
          className: "absolute right-0 top-0 h-full bg-gradient-to-l from-emerald-700 to-emerald-500 rounded-r-full",
          animate: {
            width: `${Math.max(5, 100 - realValue / investedValue * 100)}%`
          },
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between text-sm",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-3 h-3 rounded-sm bg-red-500"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-red-400 font-semibold",
            children: formatCurrency(Math.round(realValue))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-emerald-400 font-semibold",
            children: formatCurrency(Math.round(investedValue))
          }), /*#__PURE__*/_jsx("div", {
            className: "w-3 h-3 rounded-sm bg-emerald-500"
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full glow-line mb-4"
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full grid grid-cols-3 gap-3 mb-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "bg-red-950/30 border border-red-500/20 rounded-lg p-3 text-center glass-card-premium",
        children: [/*#__PURE__*/_jsx(Shield, {
          className: "w-4 h-4 text-red-400 mx-auto mb-1"
        }), /*#__PURE__*/_jsx("div", {
          className: "text-[10px] text-[#a0a0b8] font-medium",
          children: "Chor ne khaya"
        }), /*#__PURE__*/_jsx(AnimatedNumber, {
          value: Math.round(chorAte),
          className: "text-sm font-bold text-red-400"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-amber-950/30 border border-amber-500/20 rounded-lg p-3 text-center",
        children: [/*#__PURE__*/_jsx(Scale, {
          className: "w-4 h-4 text-amber-400 mx-auto mb-1"
        }), /*#__PURE__*/_jsx("div", {
          className: "text-[10px] text-[#a0a0b8] font-medium",
          children: "Farak"
        }), /*#__PURE__*/_jsx(AnimatedNumber, {
          value: Math.round(difference),
          className: "text-sm font-bold text-amber-400"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-3 text-center",
        children: [/*#__PURE__*/_jsx(TrendingUp, {
          className: "w-4 h-4 text-emerald-400 mx-auto mb-1"
        }), /*#__PURE__*/_jsx("div", {
          className: "text-[10px] text-[#a0a0b8] font-medium",
          children: "Hero ne banaya"
        }), /*#__PURE__*/_jsx(AnimatedNumber, {
          value: Math.round(heroGained),
          className: "text-sm font-bold text-emerald-400"
        })]
      })]
    }), /*#__PURE__*/_jsxs(motion.div, {
      className: "w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center",
      initial: {
        opacity: 0,
        y: 10
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.3
      },
      children: [/*#__PURE__*/_jsxs("p", {
        className: "text-sm text-amber-200 font-medium",
        children: ["\uD83D\uDCA1 ", insightText]
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-[10px] text-[#a0a0b8] mt-2",
        children: ["Inflation: ", INFLATION_RATE, "%/year \u2022 Investment return: ", INVESTMENT_RETURN, "%/year (equity avg)"]
      })]
    }, years)]
  });
}