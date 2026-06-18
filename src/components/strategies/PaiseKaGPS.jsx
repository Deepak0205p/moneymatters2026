"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Navigation, RotateCcw, Trophy, AlertTriangle, Flag, MapPin, Car } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const QUESTIONS = [{
  id: 1,
  q: 'Tumhara monthly income ka kitna % bachate ho?',
  emoji: '💰',
  options: [{
    label: '0-10%',
    sub: 'Bilkul nahi bachata',
    value: 'left',
    emoji: '💸'
  }, {
    label: '20%+',
    sub: 'Smart saver hoon',
    value: 'right',
    emoji: '🎯'
  }]
}, {
  id: 2,
  q: 'Credit card ka bill kab bharte ho?',
  emoji: '💳',
  options: [{
    label: 'Minimum due',
    sub: 'Baaki rollover ho jaata',
    value: 'left',
    emoji: '😰'
  }, {
    label: 'Full payment',
    sub: 'Time pe poora, no interest',
    value: 'right',
    emoji: '😎'
  }]
}, {
  id: 3,
  q: 'Emergency fund kya hai tumhare paas?',
  emoji: '🛟',
  options: [{
    label: 'Kya hai ye?',
    sub: 'Pata hi nahi',
    value: 'left',
    emoji: '🤷'
  }, {
    label: '3-6 months ka',
    sub: 'Sab kharcha saved',
    value: 'right',
    emoji: '✅'
  }]
}, {
  id: 4,
  q: 'Paise invest karte ho kaise?',
  emoji: '📈',
  options: [{
    label: 'Savings a/c hi',
    sub: 'Wo bhi kaafi hai',
    value: 'left',
    emoji: '😴'
  }, {
    label: 'SIP / Mutual funds',
    sub: 'Wealth grow karta hai',
    value: 'right',
    emoji: '🌱'
  }]
}, {
  id: 5,
  q: 'iPhone jaisi badi cheez kaise kharidte ho?',
  emoji: '📱',
  options: [{
    label: 'EMI pe chalega',
    sub: 'No tension, monthly pay',
    value: 'left',
    emoji: '📱'
  }, {
    label: 'Pehle save, phir kharido',
    sub: 'Cash payment always',
    value: 'right',
    emoji: '💵'
  }]
}, {
  id: 6,
  q: 'Monthly budget banate ho kya?',
  emoji: '📊',
  options: [{
    label: 'Budget kya hota hai?',
    sub: 'Jo aaye wo udao',
    value: 'left',
    emoji: '🎲'
  }, {
    label: 'Haan, categories me',
    sub: 'Needs/Wants/Savings',
    value: 'right',
    emoji: '📋'
  }]
}, {
  id: 7,
  q: 'Tumhare kitne active loans hain?',
  emoji: '🏦',
  options: [{
    label: 'Multiple loans',
    sub: 'Personal + CC + EMI',
    value: 'left',
    emoji: '⛓️'
  }, {
    label: 'Bilkul debt-free',
    sub: 'Ya sirf home loan',
    value: 'right',
    emoji: '🕊️'
  }]
}];
export default function PaiseKaGPS() {
  const {
    addCoins,
    userName
  } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('quiz');
  const rightCount = useMemo(() => answers.filter(a => a === 'right').length, [answers]);
  const score = Math.round(rightCount / QUESTIONS.length * 100);
  const chosenPath = score >= 50 ? 'right' : 'left';
  const eta = Math.max(3, Math.round(40 - score / 100 * 35));
  const handleAnswer = value => {
    const next = [...answers, value];
    setAnswers(next);
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('result');
      addCoins(25);
    }
  };
  const reset = () => {
    setAnswers([]);
    setCurrentQ(0);
    setPhase('quiz');
  };
  const progress = phase === 'result' ? 100 : Math.round(currentQ / QUESTIONS.length * 100);
  const carPos = useMemo(() => {
    const startX = 40,
      startY = 100,
      forkX = 220,
      forkY = 100;
    const rightEndX = 380,
      rightEndY = 40;
    const leftEndX = 380,
      leftEndY = 160;
    if (progress < 70) {
      const t = progress / 70;
      return {
        x: startX + (forkX - startX) * t,
        y: startY
      };
    }
    const t = (progress - 70) / 30;
    const endX = chosenPath === 'right' ? rightEndX : leftEndX;
    const endY = chosenPath === 'right' ? rightEndY : leftEndY;
    return {
      x: forkX + (endX - forkX) * t,
      y: forkY + (endY - forkY) * t
    };
  }, [progress, chosenPath]);
  const carColor = phase === 'result' ? chosenPath === 'right' ? '#10B981' : '#EF4444' : '#F59E0B';
  const q = QUESTIONS[currentQ];
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center space-y-2",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-center gap-2",
        children: [/*#__PURE__*/_jsx(Navigation, {
          className: "text-emerald",
          size: 28
        }), /*#__PURE__*/_jsx("h2", {
          className: "text-2xl md:text-3xl font-display font-bold text-gradient-emerald",
          children: "Paise Ka GPS"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted font-medium",
        children: "Financial Health Navigator \u2014 7 sawaal, sahi rasta khud chuno!"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-4 sm:p-6",
      children: [/*#__PURE__*/_jsxs("svg", {
        viewBox: "0 0 420 200",
        className: "w-full h-auto",
        children: [/*#__PURE__*/_jsxs("defs", {
          children: [/*#__PURE__*/_jsxs("linearGradient", {
            id: "pgps-main",
            x1: "0",
            y1: "0",
            x2: "1",
            y2: "0",
            children: [/*#__PURE__*/_jsx("stop", {
              offset: "0%",
              stopColor: "#1F2937"
            }), /*#__PURE__*/_jsx("stop", {
              offset: "100%",
              stopColor: "#374151"
            })]
          }), /*#__PURE__*/_jsxs("linearGradient", {
            id: "pgps-right",
            x1: "0",
            y1: "0",
            x2: "1",
            y2: "0",
            children: [/*#__PURE__*/_jsx("stop", {
              offset: "0%",
              stopColor: "#374151"
            }), /*#__PURE__*/_jsx("stop", {
              offset: "100%",
              stopColor: "#10B981"
            })]
          }), /*#__PURE__*/_jsxs("linearGradient", {
            id: "pgps-left",
            x1: "0",
            y1: "0",
            x2: "1",
            y2: "0",
            children: [/*#__PURE__*/_jsx("stop", {
              offset: "0%",
              stopColor: "#374151"
            }), /*#__PURE__*/_jsx("stop", {
              offset: "100%",
              stopColor: "#EF4444"
            })]
          })]
        }), /*#__PURE__*/_jsx("rect", {
          x: "20",
          y: "92",
          width: "200",
          height: "16",
          rx: "8",
          fill: "url(#pgps-main)",
          stroke: "rgba(255,255,255,0.10)"
        }), Array.from({
          length: 8
        }).map((_, i) => /*#__PURE__*/_jsx("rect", {
          x: 40 + i * 22,
          y: "98",
          width: "10",
          height: "4",
          rx: "2",
          fill: "rgba(255,255,255,0.28)"
        }, `d-${i}`)), /*#__PURE__*/_jsx("path", {
          d: "M 220 100 Q 290 100 290 60 T 380 40",
          stroke: "url(#pgps-right)",
          strokeWidth: "16",
          fill: "none",
          strokeLinecap: "round"
        }), /*#__PURE__*/_jsx("path", {
          d: "M 220 100 Q 290 100 290 140 T 380 160",
          stroke: "url(#pgps-left)",
          strokeWidth: "16",
          fill: "none",
          strokeLinecap: "round"
        }), /*#__PURE__*/_jsxs("g", {
          transform: "translate(40, 100)",
          children: [/*#__PURE__*/_jsx("circle", {
            r: "7",
            fill: "#94A3B8",
            stroke: "#F8FAFC",
            strokeWidth: "1.5"
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "24",
            fontSize: "9",
            fill: "#94A3B8",
            fontWeight: "bold",
            children: "START"
          })]
        }), /*#__PURE__*/_jsxs("g", {
          transform: "translate(380, 40)",
          children: [/*#__PURE__*/_jsx("circle", {
            r: "26",
            fill: "#10B981",
            opacity: phase === 'result' && chosenPath === 'right' ? '0.30' : '0.12'
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "6",
            fontSize: "22",
            children: "\uD83C\uDFD9\uFE0F"
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "28",
            fontSize: "8",
            fill: "#10B981",
            fontWeight: "bold",
            children: "FREEDOM CITY"
          })]
        }), /*#__PURE__*/_jsxs("g", {
          transform: "translate(380, 160)",
          children: [/*#__PURE__*/_jsx("circle", {
            r: "26",
            fill: "#EF4444",
            opacity: phase === 'result' && chosenPath === 'left' ? '0.30' : '0.12'
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "6",
            fontSize: "22",
            children: "\uD83C\uDFDA\uFE0F"
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "28",
            fontSize: "8",
            fill: "#EF4444",
            fontWeight: "bold",
            children: "DEBT TRAP NAGAR"
          })]
        }), /*#__PURE__*/_jsxs(motion.g, {
          animate: {
            x: carPos.x,
            y: carPos.y
          },
          transition: {
            type: 'spring',
            stiffness: 60,
            damping: 18
          },
          initial: {
            x: 40,
            y: 100
          },
          children: [/*#__PURE__*/_jsx("circle", {
            r: "16",
            fill: carColor,
            opacity: "0.25"
          }), /*#__PURE__*/_jsx("circle", {
            r: "11",
            fill: carColor,
            stroke: "#F8FAFC",
            strokeWidth: "1.5"
          }), /*#__PURE__*/_jsx("text", {
            textAnchor: "middle",
            y: "4",
            fontSize: "13",
            children: "\uD83D\uDE97"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-xs text-ink-muted font-medium whitespace-nowrap",
          children: ["Sawaal ", Math.min(currentQ + 1, QUESTIONS.length), "/", QUESTIONS.length]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 h-2 rounded-full bg-white/5 overflow-hidden",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: "h-full rounded-full bg-emerald-gradient",
            initial: {
              width: 0
            },
            animate: {
              width: `${progress}%`
            },
            transition: {
              type: 'spring',
              stiffness: 80,
              damping: 20
            }
          })
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-xs text-emerald font-semibold tabular-nums",
          children: [progress, "%"]
        })]
      })]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      mode: "wait",
      children: phase === 'quiz' ? /*#__PURE__*/_jsxs(motion.div, {
        className: "glass-card rounded-2xl p-5 sm:p-6 space-y-4",
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
        transition: {
          duration: 0.35
        },
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start gap-3",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-3xl shrink-0",
            children: q.emoji
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("span", {
              className: "text-[10px] uppercase tracking-wider text-emerald font-bold",
              children: ["Question ", currentQ + 1]
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-lg sm:text-xl font-display font-bold text-ink leading-tight",
              children: q.q
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
          children: q.options.map((opt, idx) => {
            const isRight = opt.value === 'right';
            return /*#__PURE__*/_jsxs(motion.button, {
              onClick: () => handleAnswer(opt.value),
              className: "group text-left p-4 rounded-2xl border transition-all hover:scale-[1.02]",
              style: {
                background: isRight ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                borderColor: isRight ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'
              },
              whileHover: {
                y: -3
              },
              whileTap: {
                scale: 0.98
              },
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3 mb-1",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-2xl",
                  children: opt.emoji
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-display font-bold text-lg",
                  style: {
                    color: isRight ? '#34D399' : '#F87171'
                  },
                  children: opt.label
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted font-medium",
                children: opt.sub
              })]
            }, idx);
          })
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[11px] text-center text-ink-muted/70 italic",
          children: "\uD83D\uDCA1 Sahi jawab chuno \u2014 tumhara car sahi shehar ki taraf chalega!"
        })]
      }, `q-${currentQ}`) : /*#__PURE__*/_jsxs(motion.div, {
        className: "rounded-2xl p-6 sm:p-8 text-center space-y-4",
        style: {
          background: chosenPath === 'right' ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))' : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
          border: `1px solid ${chosenPath === 'right' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`
        },
        initial: {
          opacity: 0,
          scale: 0.92
        },
        animate: {
          opacity: 1,
          scale: 1
        },
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 14
        },
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "text-6xl mb-2 inline-block",
          animate: {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.15, 1]
          },
          transition: {
            duration: 0.7,
            delay: 0.2
          },
          children: chosenPath === 'right' ? '🏆' : '⚠️'
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-center gap-2",
          children: [chosenPath === 'right' ? /*#__PURE__*/_jsx(Trophy, {
            className: "text-emerald",
            size: 22
          }) : /*#__PURE__*/_jsx(AlertTriangle, {
            className: "text-red-500",
            size: 22
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-2xl sm:text-3xl font-display font-bold",
            children: chosenPath === 'right' ? /*#__PURE__*/_jsx("span", {
              className: "text-gradient-emerald",
              children: "Financial Freedom City!"
            }) : /*#__PURE__*/_jsx("span", {
              style: {
                color: '#F87171'
              },
              children: "Debt Trap Nagar!"
            })
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-ink-muted font-medium max-w-md mx-auto",
          children: chosenPath === 'right' ? `Badhaai ho ${userName || 'dost'}! Tumhara car sahi raste pe hai. Score dekho — aur strong bano!` : `Chinta mat karo ${userName || 'dost'}, abhi sudhar sakta hai. Pehla step yehi hai — apne paise ka GPS check karna!`
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-3 max-w-md mx-auto pt-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] uppercase tracking-wider text-ink-muted font-bold",
              children: "Score"
            }), /*#__PURE__*/_jsxs("p", {
              className: `text-2xl font-display font-bold ${chosenPath === 'right' ? 'text-emerald' : 'text-red-500'}`,
              children: [score, "/100"]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-[10px] text-ink-muted",
              children: ["Sahi jawab: ", rightCount, "/", QUESTIONS.length]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] uppercase tracking-wider text-ink-muted font-bold",
              children: "ETA to Freedom"
            }), /*#__PURE__*/_jsxs("p", {
              className: `text-2xl font-display font-bold ${chosenPath === 'right' ? 'text-emerald' : 'text-gold'}`,
              children: [eta, " yrs"]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-ink-muted",
              children: "Agar abhi se smart bane"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-center gap-3 pt-3",
          children: [/*#__PURE__*/_jsx(Flag, {
            className: "text-gold",
            size: 18
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-ink font-medium",
            children: chosenPath === 'right' ? 'Aur SIP badhao to 5 saal kam lagenge! 🚀' : 'Pehla kaam: credit card debt zero karo, phir SIP shuru karo. 💪'
          })]
        }), /*#__PURE__*/_jsxs(motion.button, {
          onClick: reset,
          className: "btn-emerald inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold",
          whileHover: {
            scale: 1.04
          },
          whileTap: {
            scale: 0.97
          },
          children: [/*#__PURE__*/_jsx(RotateCcw, {
            size: 16
          }), " Dobara Khelo"]
        })]
      }, "result")
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-wrap items-center justify-center gap-4 text-[11px] text-ink-muted",
      children: [/*#__PURE__*/_jsxs("span", {
        className: "flex items-center gap-1",
        children: [/*#__PURE__*/_jsx(Car, {
          className: "text-gold",
          size: 14
        }), " Tumhara Car"]
      }), /*#__PURE__*/_jsxs("span", {
        className: "flex items-center gap-1",
        children: [/*#__PURE__*/_jsx(MapPin, {
          className: "text-emerald",
          size: 14
        }), " Freedom City"]
      }), /*#__PURE__*/_jsxs("span", {
        className: "flex items-center gap-1",
        children: [/*#__PURE__*/_jsx(AlertTriangle, {
          className: "text-red-500",
          size: 14
        }), " Debt Trap Nagar"]
      })]
    })]
  });
}