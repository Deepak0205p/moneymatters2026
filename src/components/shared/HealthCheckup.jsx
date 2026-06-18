"use client";

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse, CheckCircle2, ArrowRight, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   Quiz questions — Hinglish, Instagram-story style
   ────────────────────────────────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const QUESTIONS = [{
  id: 'emergency',
  question: 'Emergency fund kitna hai?',
  subtitle: '3-6 mahine ka kharcha cover karta hai?',
  heroEmoji: '🛡️',
  options: [{
    text: 'Koi fund nahi',
    score: 0,
    emoji: '😰'
  }, {
    text: '1 mahine ka hai',
    score: 4,
    emoji: '😐'
  }, {
    text: '3 mahine ka hai',
    score: 8,
    emoji: '😊'
  }, {
    text: '6+ mahine ka hai',
    score: 12,
    emoji: '🤩'
  }]
}, {
  id: 'budgeting',
  question: 'Monthly budget banate ho?',
  subtitle: 'Kharcha plan karke karte ho ya random?',
  heroEmoji: '📝',
  options: [{
    text: 'Budget? Kya hota hai!',
    score: 0,
    emoji: '🙈'
  }, {
    text: 'Dimag me hai, paper pe nahi',
    score: 4,
    emoji: '🤔'
  }, {
    text: 'Haan, basic budget banata hu',
    score: 8,
    emoji: '✅'
  }, {
    text: 'Detail me track karta hu',
    score: 12,
    emoji: '📊'
  }]
}, {
  id: 'savings',
  question: 'Mahine me kitna bachate ho?',
  subtitle: 'Income ka kitna percent save hota hai?',
  heroEmoji: '💰',
  options: [{
    text: 'Kuch nahi bach paata',
    score: 0,
    emoji: '💸'
  }, {
    text: '10% se kam',
    score: 4,
    emoji: '🪙'
  }, {
    text: '10-20% bachata hu',
    score: 8,
    emoji: '🏦'
  }, {
    text: '20% se zyada!',
    score: 12,
    emoji: '🚀'
  }]
}, {
  id: 'debt',
  question: 'Credit card ka karna kaise hota hai?',
  subtitle: 'Pura bill pay karte ho ya minimum?',
  heroEmoji: '💳',
  options: [{
    text: 'Minimum pay karta hu',
    score: 0,
    emoji: '😱'
  }, {
    text: 'Kabhi full, kabhi partial',
    score: 4,
    emoji: '😬'
  }, {
    text: 'Hamesha full pay karta hu',
    score: 12,
    emoji: '💪'
  }, {
    text: 'Credit card use nahi karta',
    score: 8,
    emoji: '🚫'
  }]
}, {
  id: 'investment',
  question: 'Investment kiya hai kahin?',
  subtitle: 'SIP, FD, mutual fund, stocks?',
  heroEmoji: '📈',
  options: [{
    text: 'Nahi, abhi tak nahi',
    score: 0,
    emoji: '😴'
  }, {
    text: 'FD/Savings account me hai',
    score: 4,
    emoji: '🏦'
  }, {
    text: 'Haan, mutual fund/SIP',
    score: 12,
    emoji: '🎯'
  }, {
    text: 'Stocks + MF + PPF — mixed!',
    score: 10,
    emoji: '🌟'
  }]
}, {
  id: 'insurance',
  question: 'Insurance hai tumhara?',
  subtitle: 'Health aur life insurance dono?',
  heroEmoji: '🛡️',
  options: [{
    text: 'Koi insurance nahi',
    score: 0,
    emoji: '🚨'
  }, {
    text: 'Bas company ka hai',
    score: 4,
    emoji: '🤷'
  }, {
    text: 'Health insurance hai',
    score: 8,
    emoji: '👍'
  }, {
    text: 'Health + Life dono hai',
    score: 12,
    emoji: '✅'
  }]
}, {
  id: 'learning',
  question: 'Finance ke baare me kitna seekhte ho?',
  subtitle: 'Videos, articles, books padhte ho?',
  heroEmoji: '📚',
  options: [{
    text: 'Kabhi nahi padha',
    score: 0,
    emoji: '🙈'
  }, {
    text: 'Kabhi-kabhi YouTube dekhta',
    score: 4,
    emoji: '📺'
  }, {
    text: 'Regular content follow karta',
    score: 8,
    emoji: '📖'
  }, {
    text: 'Padhta + apply karta hu',
    score: 12,
    emoji: '🎓'
  }]
}];
const MAX_SCORE = QUESTIONS.length * 12;

/* ──────────────────────────────────────────────────────────────
   Get grade based on percentage
   ────────────────────────────────────────────────────────────── */
function getGrade(pct) {
  if (pct >= 75) return {
    label: 'Fit',
    emoji: '💪',
    color: '#10B981',
    tip: 'Tum financial ninja ho! Keep it up!'
  };
  if (pct >= 50) return {
    label: 'Average',
    emoji: '🤔',
    color: '#F59E0B',
    tip: 'Theek ho, par sudhar zaroori hai!'
  };
  return {
    label: 'ICU mein hai',
    emoji: '🏥',
    color: '#EF4444',
    tip: 'Tension mat lo, abhi shuru karo!'
  };
}
function getRecommendations(answers) {
  const tips = [];
  if ((answers.emergency ?? 0) < 8) tips.push('🛡️ Pehle emergency fund banao — 3 mahine ka kharcha band karo.');
  if ((answers.budgeting ?? 0) < 8) tips.push('📝 Har mahine budget banao — 50-30-20 rule follow karo.');
  if ((answers.savings ?? 0) < 8) tips.push('💰 Income ka kam se kam 20% bachao — automate karo!');
  if ((answers.debt ?? 0) < 8) tips.push('💳 Credit card ka hamesha full pay karo — minimum = trap!');
  if ((answers.investment ?? 0) < 8) tips.push('📈 SIP start karo — ₹500/month se bhi compounding ka jadoo chalega!');
  if ((answers.insurance ?? 0) < 8) tips.push('🏥 Health insurance zaroori hai — medical emergency savings kha jaata hai!');
  if ((answers.learning ?? 0) < 8) tips.push('📚 Financial literacy badhao — har hafte 1 video/article padho!');
  if (tips.length === 0) tips.push('🌟 Tum already on track ho! Naye goals set karo aur grow karo!');
  return tips.slice(0, 3);
}

/* ──────────────────────────────────────────────────────────────
   Progress dots — Instagram story style
   ────────────────────────────────────────────────────────────── */
function ProgressDots({
  current,
  total
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex gap-1.5",
    children: Array.from({
      length: total
    }, (_, i) => /*#__PURE__*/_jsx("div", {
      className: "flex-1 h-1 rounded-full bg-white/10 overflow-hidden",
      children: /*#__PURE__*/_jsx(motion.div, {
        initial: {
          width: 0
        },
        animate: {
          width: i < current ? '100%' : i === current ? '100%' : '0%'
        },
        transition: {
          duration: 0.4
        },
        className: "h-full rounded-full bg-gradient-to-r from-emerald to-ai"
      })
    }, i))
  });
}

/* ──────────────────────────────────────────────────────────────
   Speedometer-style health meter reveal
   ────────────────────────────────────────────────────────────── */
function HealthMeter({
  score
}) {
  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - score / 100 * circumference;
  const grade = getGrade(score);
  return /*#__PURE__*/_jsxs("div", {
    className: "relative flex flex-col items-center justify-center",
    children: [/*#__PURE__*/_jsxs("svg", {
      width: "240",
      height: "140",
      viewBox: "0 0 240 140",
      className: "overflow-visible",
      children: [/*#__PURE__*/_jsxs("defs", {
        children: [/*#__PURE__*/_jsxs("linearGradient", {
          id: "meterGrad",
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "0%",
          children: [/*#__PURE__*/_jsx("stop", {
            offset: "0%",
            stopColor: "#EF4444"
          }), /*#__PURE__*/_jsx("stop", {
            offset: "50%",
            stopColor: "#F59E0B"
          }), /*#__PURE__*/_jsx("stop", {
            offset: "100%",
            stopColor: "#10B981"
          })]
        }), /*#__PURE__*/_jsxs("filter", {
          id: "meterGlow",
          children: [/*#__PURE__*/_jsx("feGaussianBlur", {
            stdDeviation: "4",
            result: "blur"
          }), /*#__PURE__*/_jsxs("feMerge", {
            children: [/*#__PURE__*/_jsx("feMergeNode", {
              in: "blur"
            }), /*#__PURE__*/_jsx("feMergeNode", {
              in: "SourceGraphic"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("path", {
        d: `M 30 130 A ${radius} ${radius} 0 0 1 210 130`,
        fill: "none",
        stroke: "rgba(255,255,255,0.08)",
        strokeWidth: "16",
        strokeLinecap: "round"
      }), [0, 25, 50, 75, 100].map(t => {
        const angle = Math.PI - t / 100 * Math.PI;
        const x = 120 + Math.cos(angle) * (radius + 16);
        const y = 130 - Math.sin(angle) * (radius + 16);
        return /*#__PURE__*/_jsx("text", {
          x: x,
          y: y,
          fill: "rgba(255,255,255,0.4)",
          fontSize: "10",
          fontWeight: "700",
          textAnchor: "middle",
          dominantBaseline: "middle",
          children: t
        }, t);
      }), /*#__PURE__*/_jsx(motion.path, {
        d: `M 30 130 A ${radius} ${radius} 0 0 1 210 130`,
        fill: "none",
        stroke: "url(#meterGrad)",
        strokeWidth: "16",
        strokeLinecap: "round",
        filter: "url(#meterGlow)",
        strokeDasharray: circumference,
        initial: {
          strokeDashoffset: circumference
        },
        animate: {
          strokeDashoffset: offset
        },
        transition: {
          duration: 1.8,
          ease: 'easeOut',
          delay: 0.3
        }
      }), /*#__PURE__*/_jsxs(motion.g, {
        initial: {
          rotate: -90
        },
        animate: {
          rotate: -90 + score / 100 * 180
        },
        transition: {
          duration: 1.8,
          ease: 'easeOut',
          delay: 0.3
        },
        style: {
          transformOrigin: '120px 130px'
        },
        children: [/*#__PURE__*/_jsx("line", {
          x1: "120",
          y1: "130",
          x2: "120",
          y2: "60",
          stroke: grade.color,
          strokeWidth: "3",
          strokeLinecap: "round"
        }), /*#__PURE__*/_jsx("circle", {
          cx: "120",
          cy: "130",
          r: "8",
          fill: grade.color
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "absolute top-12 flex flex-col items-center",
      children: [/*#__PURE__*/_jsx(motion.span, {
        initial: {
          scale: 0
        },
        animate: {
          scale: 1
        },
        transition: {
          delay: 1.2,
          type: 'spring'
        },
        className: "font-display text-5xl font-extrabold",
        style: {
          color: grade.color,
          textShadow: `0 0 30px ${grade.color}80`
        },
        children: score
      }), /*#__PURE__*/_jsx("span", {
        className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
        children: "/ 100"
      })]
    })]
  });
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function HealthCheckup({
  open,
  onClose
}) {
  const {
    healthCheckup,
    setHealthCheckup
  } = useAppStore();
  const [step, setStep] = useState(healthCheckup ? 'results' : 'intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const totalScore = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const pct = Math.round(totalScore / MAX_SCORE * 100);
  const grade = getGrade(pct);
  const handleSelect = useCallback((qIndex, optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const q = QUESTIONS[qIndex];
    const newAnswers = {
      ...answers,
      [q.id]: q.options[optIndex].score
    };
    setAnswers(newAnswers);
    setTimeout(() => {
      setSelected(null);
      if (qIndex + 1 < QUESTIONS.length) {
        setCurrentQ(qIndex + 1);
      } else {
        const finalScore = Math.round(Object.values(newAnswers).reduce((a, b) => a + b, 0) / MAX_SCORE * 100);
        const result = {
          score: finalScore,
          category: getGrade(finalScore).label,
          answers: newAnswers,
          completedAt: new Date().toISOString().split('T')[0],
          recommendations: getRecommendations(newAnswers)
        };
        setHealthCheckup(result);
        setStep('results');
      }
    }, 350);
  }, [selected, answers, setHealthCheckup]);
  const reset = () => {
    setStep('intro');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  };
  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: o => !o && handleClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative p-5 border-b border-white/10 glass-card-premium",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: handleClose,
          className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted",
          "aria-label": "Close",
          children: /*#__PURE__*/_jsx(X, {
            size: 16
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-11 h-11 rounded-2xl flex items-center justify-center",
            style: {
              background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
              boxShadow: '0 0 20px rgba(236,72,153,0.3)'
            },
            children: /*#__PURE__*/_jsx(HeartPulse, {
              size: 20,
              className: "text-white"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-extrabold text-white",
              children: "Financial Checkup \uD83E\uDE7A"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: "Apni financial health ka quick checkup! 2 min me ho jayega"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "p-5 sm:p-6 max-h-[70vh] overflow-y-auto",
        children: /*#__PURE__*/_jsxs(AnimatePresence, {
          mode: "wait",
          children: [step === 'intro' && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: 20
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -20
            },
            className: "text-center py-6",
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0.5
              },
              animate: {
                scale: 1
              },
              transition: {
                type: 'spring'
              },
              className: "text-7xl mb-4",
              children: "\uD83E\uDE7A"
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-2xl font-extrabold heading-gradient mb-2",
              children: "Financial Checkup Time!"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-ink-muted max-w-md mx-auto mb-6",
              children: [QUESTIONS.length, " simple sawaal \u2014 honestly jawab do aur apni financial health ka score pao! \uD83D\uDE0E"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-3 gap-2 mb-6 max-w-md mx-auto",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-emerald/5 border border-emerald/20 p-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-2xl mb-1",
                  children: "\uD83D\uDCAA"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] font-bold text-emerald-soft",
                  children: "Fit"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-gold/5 border border-gold/20 p-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-2xl mb-1",
                  children: "\uD83E\uDD14"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] font-bold text-gold-soft",
                  children: "Average"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-red-500/5 border border-red-500/20 p-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-2xl mb-1",
                  children: "\uD83C\uDFE5"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] font-bold text-red-400",
                  children: "ICU"
                })]
              })]
            }), /*#__PURE__*/_jsxs(motion.button, {
              whileHover: {
                scale: 1.04
              },
              whileTap: {
                scale: 0.96
              },
              onClick: () => setStep('quiz'),
              className: "btn-3d rounded-2xl px-8 py-3.5 font-bold text-midnight inline-flex items-center gap-2",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
              },
              children: ["Shuru Karein ", /*#__PURE__*/_jsx(ArrowRight, {
                size: 18
              })]
            })]
          }, "intro"), step === 'quiz' && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              x: 30
            },
            animate: {
              opacity: 1,
              x: 0
            },
            exit: {
              opacity: 0,
              x: -30
            },
            children: [/*#__PURE__*/_jsx(ProgressDots, {
              current: currentQ,
              total: QUESTIONS.length
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-center mt-6 mb-5",
              children: [/*#__PURE__*/_jsx(motion.div, {
                initial: {
                  scale: 0
                },
                animate: {
                  scale: 1
                },
                transition: {
                  type: 'spring',
                  delay: 0.1
                },
                className: "text-7xl mb-3",
                children: QUESTIONS[currentQ].heroEmoji
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[10px] font-bold text-emerald-soft uppercase tracking-widest mb-1",
                children: ["Sawaal ", currentQ + 1, " of ", QUESTIONS.length]
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-extrabold text-white mb-1",
                children: QUESTIONS[currentQ].question
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: QUESTIONS[currentQ].subtitle
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
              children: QUESTIONS[currentQ].options.map((opt, i) => {
                const isSelected = selected === i;
                return /*#__PURE__*/_jsxs(motion.button, {
                  whileHover: {
                    y: -3,
                    scale: 1.02
                  },
                  whileTap: {
                    scale: 0.97
                  },
                  onClick: () => handleSelect(currentQ, i),
                  className: `relative card-3d rounded-2xl p-4 text-left border transition-all overflow-hidden ${isSelected ? 'border-emerald bg-emerald/15' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}`,
                  children: [isSelected && /*#__PURE__*/_jsx(motion.div, {
                    initial: {
                      scale: 0
                    },
                    animate: {
                      scale: 1
                    },
                    className: "absolute top-3 right-3",
                    children: /*#__PURE__*/_jsx(CheckCircle2, {
                      size: 18,
                      className: "text-emerald-soft"
                    })
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-3xl mb-2",
                    children: opt.emoji
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-sm font-bold text-white leading-tight",
                    children: opt.text
                  })]
                }, i);
              })
            })]
          }, `quiz-${currentQ}`), step === 'results' && healthCheckup && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              scale: 0.95
            },
            animate: {
              opacity: 1,
              scale: 1
            },
            className: "text-center py-2",
            children: [/*#__PURE__*/_jsxs(motion.div, {
              initial: {
                y: -20,
                opacity: 0
              },
              animate: {
                y: 0,
                opacity: 1
              },
              className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4",
              style: {
                backgroundColor: `${grade.color}20`,
                border: `1px solid ${grade.color}40`
              },
              children: [/*#__PURE__*/_jsx(Sparkles, {
                size: 14,
                style: {
                  color: grade.color
                }
              }), /*#__PURE__*/_jsx("span", {
                className: "text-xs font-bold",
                style: {
                  color: grade.color
                },
                children: "Tumhara Result Ready Hai!"
              })]
            }), /*#__PURE__*/_jsx(HealthMeter, {
              score: healthCheckup.score
            }), /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                scale: 0.5
              },
              animate: {
                scale: 1
              },
              transition: {
                delay: 1.4,
                type: 'spring'
              },
              className: "mt-2",
              children: [/*#__PURE__*/_jsxs("h3", {
                className: "font-display text-3xl font-extrabold",
                style: {
                  color: grade.color
                },
                children: [grade.label, " ", grade.emoji]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted mt-1",
                children: grade.tip
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-left mt-6 space-y-2",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(Sparkles, {
                  size: 12,
                  className: "text-ai"
                }), " Tumhare Liye Tips"]
              }), healthCheckup.recommendations.map((tip, i) => /*#__PURE__*/_jsx(motion.div, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: 1.6 + i * 0.1
                },
                className: "rounded-xl bg-white/[0.04] border border-white/10 p-3 text-sm text-white/90",
                children: tip
              }, i))]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex flex-col sm:flex-row gap-2 mt-6",
              children: [/*#__PURE__*/_jsxs("button", {
                onClick: reset,
                className: "flex-1 rounded-xl py-3 text-sm font-bold text-white bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2",
                children: [/*#__PURE__*/_jsx(RotateCcw, {
                  size: 14
                }), " Phir Se Try Karo"]
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: 'Money Matters — Financial Health',
                      text: `Meri Financial Health: ${healthCheckup.score}/100 (${grade.label} ${grade.emoji})! Tum bhi check karo!`
                    }).catch(() => {});
                  }
                },
                className: "flex-1 btn-3d rounded-xl py-3 text-sm font-bold text-midnight flex items-center justify-center gap-2",
                style: {
                  background: 'linear-gradient(135deg, #34D399, #10B981)'
                },
                children: [/*#__PURE__*/_jsx(Share2, {
                  size: 14
                }), " Share Score"]
              })]
            })]
          }, "results")]
        })
      })]
    })
  });
}