'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, PartyPopper, ArrowRight, Sparkles, Share2 } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Financial Age Calculator — viral quiz + dramatic reveal
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const QUESTIONS = [{
  id: 'salary',
  question: 'Pehli salary/pocket money se kya kiya tha?',
  emoji: '💸',
  category: 'Money Mindset',
  options: [{
    label: 'a',
    text: 'Sab kuch kharch kar diya 🛍️',
    score: 1,
    emoji: '💸'
  }, {
    label: 'b',
    text: 'Thoda kharch, thoda bachaya',
    score: 2,
    emoji: '🤔'
  }, {
    label: 'c',
    text: 'Aadha save kiya, aadha kharch',
    score: 3,
    emoji: '💰'
  }, {
    label: 'd',
    text: 'Pehle savings, baaki kharch',
    score: 4,
    emoji: '🎯'
  }]
}, {
  id: 'budget',
  question: 'Monthly budget bana hota hai?',
  emoji: '📝',
  category: 'Budgeting',
  options: [{
    label: 'a',
    text: 'Budget? Kya hota hai 😅',
    score: 1,
    emoji: '🤷'
  }, {
    label: 'b',
    text: 'Kabhi bana, kabhi nahi',
    score: 2,
    emoji: '📅'
  }, {
    label: 'c',
    text: 'Basic budget follow karta hoon',
    score: 3,
    emoji: '✅'
  }, {
    label: 'd',
    text: 'Detailed budget har mahine',
    score: 4,
    emoji: '📊'
  }]
}, {
  id: 'emergency',
  question: 'Emergency fund kitna hai?',
  emoji: '🛡️',
  category: 'Safety Net',
  options: [{
    label: 'a',
    text: 'Kya yeh hota hai? 🤔',
    score: 1,
    emoji: '❓'
  }, {
    label: 'b',
    text: '1-2 mahine ka hai',
    score: 2,
    emoji: '🌱'
  }, {
    label: 'c',
    text: '3-5 mahine ka hai',
    score: 3,
    emoji: '💪'
  }, {
    label: 'd',
    text: '6+ mahine ka hai',
    score: 4,
    emoji: '🛡️'
  }]
}, {
  id: 'sip',
  question: 'SIP ya investment karte ho?',
  emoji: '📈',
  category: 'Investing',
  options: [{
    label: 'a',
    text: 'Nahi, abhi tak start nahi',
    score: 1,
    emoji: '🚫'
  }, {
    label: 'b',
    text: 'Soch raha hoon but confused',
    score: 2,
    emoji: '🤔'
  }, {
    label: 'c',
    text: 'Haan, chhota amount lagata',
    score: 3,
    emoji: '🌱'
  }, {
    label: 'd',
    text: 'Regular SIP + portfolio',
    score: 4,
    emoji: '🚀'
  }]
}, {
  id: 'credit',
  question: 'Credit card ka bill kaise pay karte ho?',
  emoji: '💳',
  category: 'Debt Management',
  options: [{
    label: 'a',
    text: 'Minimum amount 😬',
    score: 1,
    emoji: '😰'
  }, {
    label: 'b',
    text: 'Kabhi full, kabhi partial',
    score: 2,
    emoji: '🤷'
  }, {
    label: 'c',
    text: 'Mostly full pay karta hoon',
    score: 3,
    emoji: '✅'
  }, {
    label: 'd',
    text: 'Hamesha full + on time',
    score: 4,
    emoji: '🎯'
  }]
}, {
  id: 'insurance',
  question: 'Health insurance hai?',
  emoji: '🏥',
  category: 'Insurance',
  options: [{
    label: 'a',
    text: 'Nahi, zaroorat nahi hai',
    score: 1,
    emoji: '🚫'
  }, {
    label: 'b',
    text: 'Parents ke saath hai',
    score: 2,
    emoji: '👨‍👩‍👦'
  }, {
    label: 'c',
    text: 'Haan, basic plan hai',
    score: 3,
    emoji: '📋'
  }, {
    label: 'd',
    text: 'Adequate cover + riders',
    score: 4,
    emoji: '🛡️'
  }]
}, {
  id: 'spend',
  question: 'Impulse shopping pe control hai?',
  emoji: '🛍️',
  category: 'Spending Habits',
  options: [{
    label: 'a',
    text: 'Sale dikha — sab le liya 😅',
    score: 1,
    emoji: '💸'
  }, {
    label: 'b',
    text: 'Kabhi control, kabhi nahi',
    score: 2,
    emoji: '🤔'
  }, {
    label: 'c',
    text: '24-hour rule follow karta',
    score: 3,
    emoji: '⏰'
  }, {
    label: 'd',
    text: 'Wishlist bana ke wait karta',
    score: 4,
    emoji: '📝'
  }]
}, {
  id: 'tax',
  question: 'Tax saving ke baare mein pata hai?',
  emoji: '📋',
  category: 'Tax Awareness',
  options: [{
    label: 'a',
    text: 'Kuch nahi pata 🤷',
    score: 1,
    emoji: '❓'
  }, {
    label: 'b',
    text: 'Bas 80C suna hai',
    score: 2,
    emoji: '📚'
  }, {
    label: 'c',
    text: 'Haan, ELSS + PPF use karta',
    score: 3,
    emoji: '✅'
  }, {
    label: 'd',
    text: 'Multiple sections + ITR file',
    score: 4,
    emoji: '📊'
  }]
}, {
  id: 'goal',
  question: '5 saal ka financial goal hai?',
  emoji: '🎯',
  category: 'Goal Setting',
  options: [{
    label: 'a',
    text: 'Goal kya hota hai 😅',
    score: 1,
    emoji: '🤷'
  }, {
    label: 'b',
    text: 'Soch rakha hai dimaag mein',
    score: 2,
    emoji: '💭'
  }, {
    label: 'c',
    text: 'Haan, approximate target hai',
    score: 3,
    emoji: '📝'
  }, {
    label: 'd',
    text: 'SMART goal + tracking',
    score: 4,
    emoji: '🎯'
  }]
}];
function getAgeResult(score) {
  // Score range: 9 (min, all 1s) to 36 (max, all 4s)
  // Map to age: 12 to 60
  const age = Math.round(12 + (score - 9) / (36 - 9) * 48);
  if (score >= 30) {
    return {
      age,
      result: {
        emoji: '🧠',
        label: 'Financial Guru',
        color: '#10b981',
        description: 'Bhai, tum apni umar se zyada samajhdar ho! 🧠💪',
        tips: ['Apne knowledge ko share karo — dost ko sikhao!', 'Portfolio diversify karo — international stocks add karo.', 'Estate planning shuru karo — will + nomination.']
      }
    };
  }
  if (score >= 22) {
    return {
      age,
      result: {
        emoji: '🎯',
        label: 'On Track',
        color: '#f59e0b',
        description: 'Ekdum on track ho! 🎯 Thoda aur push do.',
        tips: ['Emergency fund ko 6 months tak pahunchao.', 'SIP amount har saal 10% badhao.', 'Term insurance le lo if dependents hain.']
      }
    };
  }
  if (score >= 14) {
    return {
      age,
      result: {
        emoji: '📚',
        label: 'Learning Phase',
        color: '#8b5cf6',
        description: 'Arre yaar, abhi seekhna baaki hai! 📚 Par tension mat lo, hum hain na!',
        tips: ['Pehle 1 month ka emergency fund banao.', '₹500/month SIP se start karo.', 'Budget app use karna shuru karo.']
      }
    };
  }
  return {
    age,
    result: {
      emoji: '🌱',
      label: 'Just Started',
      color: '#ef4444',
      description: 'Abhi financial education zero par hai. Par har expert beginner tha! 🌱',
      tips: ['Pehle income aur kharcha likhna shuru karo.', '3 din ka kharcha bhi emergency fund banao.', 'Money Matters ke modules padho — bilkul basic se.']
      }
      };
      }
export default function FinancialAgeCalculator({
  open,
  onClose
}) {
  const {
    addCoins,
    addBadge
  } = useAppStore();
  const [gameState, setGameState] = useState('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [revealedAge, setRevealedAge] = useState(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!open) {
      // Reset on close
      setTimeout(() => {
        setGameState('intro');
        setCurrentIdx(0);
        setAnswers([]);
        setRevealedAge(null);
      }, 200);
    }
  }, [open]);
  const totalScore = useMemo(() => answers.reduce((s, v) => s + v, 0), [answers]);
  const result = useMemo(() => getAgeResult(totalScore), [totalScore]);
  const handleAnswer = useCallback(score => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(i => i + 1);
    } else {
      // Show reveal animation
      setGameState('reveal');
      const finalScore = newAnswers.reduce((s, v) => s + v, 0);
      const finalResult = getAgeResult(finalScore);
      setTimeout(() => {
        setRevealedAge(finalResult.age);
        setGameState('result');
        addCoins(20);
        if (!useAppStore.getState().badges.includes('financial-age')) {
          addBadge('financial-age');
        }
      }, 2800);
    }
  }, [answers, currentIdx, addCoins, addBadge]);
  const handleRestart = () => {
    setGameState('intro');
    setCurrentIdx(0);
    setAnswers([]);
    setRevealedAge(null);
  };
  const handleShare = async () => {
    const text = `Mera Financial Age: ${revealedAge} saal! 🎂\n\n${result.result.label} - ${result.result.description}\n\nTumhara bhi pata karo — Money Matters 💸`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Mera Financial Age',
        text
      }).catch(() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        toast({
          title: 'Copy kar liya! 📋'
        });
      });
    } else {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({
        title: 'Copy kar liya! 📋'
      });
    }
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-md max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Financial Age Calculator"
        })
      }), /*#__PURE__*/_jsxs(AnimatePresence, {
        mode: "wait",
        children: [gameState === 'intro' && /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "p-6 text-center",
          children: [/*#__PURE__*/_jsx(motion.div, {
            animate: {
              y: [0, -8, 0]
            },
            transition: {
              duration: 2.5,
              repeat: Infinity
            },
            className: "text-7xl mb-3",
            children: "\uD83C\uDF82"
          }), /*#__PURE__*/_jsx("h2", {
            className: "font-display text-2xl font-bold heading-gradient mb-1",
            children: "Tumhari Financial Age?"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-[#94A3B8] mb-5",
            children: ["9 fun questions ka jawab do \u2014 reveal hoga tumhari ", /*#__PURE__*/_jsx("span", {
              className: "text-amber-300 font-semibold",
              children: "Financial Age"
            }), "!"]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-3 gap-2 mb-6",
            children: [{
              emoji: '⏱️',
              label: '2 min'
            }, {
              emoji: '🎁',
              label: '+20 coins'
            }, {
              emoji: '📊',
              label: 'Personal tips'
            }].map(s => /*#__PURE__*/_jsxs("div", {
              className: "p-2 rounded-xl glass-card",
              children: [/*#__PURE__*/_jsx("div", {
                className: "text-2xl mb-0.5",
                children: s.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-[#94A3B8]",
                children: s.label
              })]
            }, s.label))
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => setGameState('playing'),
            className: "w-full py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5",
            children: [/*#__PURE__*/_jsx(PartyPopper, {
              className: "w-4 h-4"
            }), " Start Quiz"]
          })]
        }, "intro"), gameState === 'playing' && /*#__PURE__*/_jsxs(motion.div, {
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
          transition: {
            duration: 0.3
          },
          className: "p-5",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex gap-1 mb-4",
            children: QUESTIONS.map((_, i) => /*#__PURE__*/_jsxs("div", {
              className: cn('flex-1 h-1.5 rounded-full overflow-hidden', i <= currentIdx ? 'bg-white/[0.10]' : 'bg-white/[0.04]'),
              children: [i < currentIdx && /*#__PURE__*/_jsx("div", {
                className: "h-full bg-emerald-400 w-full"
              }), i === currentIdx && /*#__PURE__*/_jsx(motion.div, {
                className: "h-full bg-emerald-400",
                initial: {
                  width: '0%'
                },
                animate: {
                  width: '100%'
                },
                transition: {
                  duration: 0.5
                }
              })]
            }, i))
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-center mb-4",
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0.5
              },
              animate: {
                scale: 1
              },
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 14
              },
              className: "text-5xl mb-2",
              children: QUESTIONS[currentIdx].emoji
            }), /*#__PURE__*/_jsx("span", {
              className: "inline-block px-2.5 py-0.5 rounded-full glass-card text-[10px] text-violet-300 font-semibold",
              children: QUESTIONS[currentIdx].category
            })]
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-display text-lg font-bold text-[#F8FAFC] text-center mb-5 leading-snug",
            children: QUESTIONS[currentIdx].question
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-2",
            children: QUESTIONS[currentIdx].options.map((opt, i) => /*#__PURE__*/_jsxs(motion.button, {
              initial: {
                opacity: 0,
                y: 10
              },
              animate: {
                opacity: 1,
                y: 0
              },
              transition: {
                delay: i * 0.05
              },
              whileHover: {
                scale: 1.02,
                x: 4
              },
              whileTap: {
                scale: 0.98
              },
              onClick: () => handleAnswer(opt.score),
              className: "w-full p-3 rounded-2xl glass-card border border-white/[0.06] hover:border-emerald-400/30 transition flex items-center gap-3 text-left",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-9 h-9 rounded-xl bg-white/[0.04] grid place-items-center text-lg shrink-0",
                children: opt.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-[#F8FAFC] flex-1",
                children: opt.text
              }), /*#__PURE__*/_jsx(ArrowRight, {
                className: "w-4 h-4 text-[#94A3B8]"
              })]
            }, opt.label))
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => handleAnswer(1),
            className: "w-full mt-4 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition",
            children: "Skip question \u2192"
          })]
        }, `q-${currentIdx}`), gameState === 'reveal' && /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "p-6 grid place-items-center min-h-[400px]",
          children: /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx(motion.div, {
              animate: {
                rotate: 360,
                scale: [1, 1.2, 1]
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              className: "text-7xl mb-4",
              children: "\uD83D\uDD2E"
            }), /*#__PURE__*/_jsx(motion.p, {
              animate: {
                opacity: [0.4, 1, 0.4]
              },
              transition: {
                duration: 1.2,
                repeat: Infinity
              },
              className: "font-display text-xl text-violet-300 mb-2",
              children: "Calculating..."
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-[#94A3B8]",
              children: "Tumhari financial habits analyze ho rahi hain \uD83E\uDDE0"
            }), /*#__PURE__*/_jsx("div", {
              className: "mt-4 flex justify-center gap-1",
              children: [0, 1, 2].map(i => /*#__PURE__*/_jsx(motion.div, {
                animate: {
                  y: [0, -8, 0]
                },
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15
                },
                className: "w-2 h-2 rounded-full bg-violet-400"
              }, i))
            })]
          })
        }, "reveal"), gameState === 'result' && /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "p-5",
          children: [/*#__PURE__*/_jsxs(motion.div, {
            initial: {
              scale: 0.3,
              opacity: 0,
              filter: 'blur(20px)'
            },
            animate: {
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)'
            },
            transition: {
              type: 'spring',
              stiffness: 100,
              damping: 14,
              delay: 0.1
            },
            className: "text-center mb-5 relative",
            children: [Array.from({
              length: 16
            }).map((_, i) => /*#__PURE__*/_jsx(motion.div, {
              initial: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1
              },
              animate: {
                opacity: 0,
                y: -150,
                x: (Math.random() - 0.5) * 200,
                scale: 0.3,
                rotate: 360
              },
              transition: {
                duration: 1.4,
                delay: 0.2 + i * 0.04
              },
              className: "absolute top-0 left-1/2 w-2 h-2 rounded",
              style: {
                background: ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i % 4]
              }
            }, i)), /*#__PURE__*/_jsx(motion.div, {
              animate: {
                y: [0, -6, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity
              },
              className: "text-6xl mb-2 inline-block",
              children: result.result.emoji
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-[#94A3B8] mb-1",
              children: "Tumhari Financial Age"
            }), /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                scale: 0.6
              },
              animate: {
                scale: 1
              },
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 12,
                delay: 0.3
              },
              className: "relative inline-block",
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-display text-6xl font-bold",
                style: {
                  color: result.result.color,
                  textShadow: `0 0 30px ${result.result.color}80`
                },
                children: revealedAge
              }), /*#__PURE__*/_jsx("span", {
                className: "absolute -right-8 top-2 text-2xl",
                children: "\uD83C\uDF82"
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-[#94A3B8] mt-1",
              children: "saal"
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
              delay: 0.5
            },
            className: "text-center mb-4",
            children: [/*#__PURE__*/_jsx("span", {
              className: "inline-block px-3 py-1 rounded-full text-xs font-bold mb-2",
              style: {
                background: `${result.result.color}25`,
                color: result.result.color
              },
              children: result.result.label
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-[#F8FAFC]",
              children: result.result.description
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
              delay: 0.7
            },
            className: "p-3 rounded-2xl glass-card mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-1",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-xs text-[#94A3B8]",
                children: "Total Score"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm font-bold text-[#F8FAFC]",
                children: [totalScore, "/", QUESTIONS.length * 4]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "h-1.5 rounded-full bg-white/[0.06] overflow-hidden",
              children: /*#__PURE__*/_jsx(motion.div, {
                className: "h-full rounded-full",
                style: {
                  background: result.result.color
                },
                initial: {
                  width: 0
                },
                animate: {
                  width: `${totalScore / (QUESTIONS.length * 4) * 100}%`
                },
                transition: {
                  duration: 1,
                  delay: 0.8
                }
              })
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
              delay: 0.9
            },
            className: "p-4 rounded-2xl glass-card-premium border-violet-500/30 mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                className: "w-4 h-4 text-violet-400"
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-sm font-semibold text-violet-300",
                children: "Personalized Tips \uD83C\uDFAF"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "space-y-1.5",
              children: result.result.tips.map((tip, i) => /*#__PURE__*/_jsxs("div", {
                className: "flex items-start gap-2 text-xs text-[#94A3B8]",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-emerald-400 mt-0.5",
                  children: "\u2713"
                }), /*#__PURE__*/_jsx("span", {
                  children: tip
                })]
              }, i))
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
              delay: 1
            },
            className: "flex gap-2",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: handleShare,
              className: "flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5",
              children: copied ? /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Check, {
                  className: "w-4 h-4"
                }), " Copied!"]
              }) : /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Share2, {
                  className: "w-4 h-4"
                }), " Share Result"]
              })
            }), /*#__PURE__*/_jsxs("button", {
              onClick: handleRestart,
              className: "py-3 px-4 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(RotateCcw, {
                className: "w-4 h-4"
              }), " Retake"]
            })]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[10px] text-center text-[#94A3B8] mt-3",
            children: "+20 coins earned! 30 din baad retake karo \uD83D\uDCC5"
          })]
        }, "result")]
      })]
    })
  });
}