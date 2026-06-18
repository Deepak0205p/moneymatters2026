"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Flame, Trophy, RotateCcw, ChevronRight, CheckCircle2, XCircle, Share2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';
import { quizQuestions } from '@/lib/data/quiz-data';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   Categories as hexagonal tiles
   ────────────────────────────────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CATEGORIES = [{
  id: 'banking',
  label: 'Banking',
  emoji: '🏦',
  color: '#10B981',
  moduleIds: [3]
}, {
  id: 'tax',
  label: 'Tax',
  emoji: '📋',
  color: '#F59E0B',
  moduleIds: [10]
}, {
  id: 'investment',
  label: 'Investment',
  emoji: '📈',
  color: '#8B5CF6',
  moduleIds: [7]
}, {
  id: 'budgeting',
  label: 'Budgeting',
  emoji: '💰',
  color: '#EC4899',
  moduleIds: [1, 2]
}, {
  id: 'insurance',
  label: 'Insurance',
  emoji: '🛡️',
  color: '#06B6D4',
  moduleIds: [9]
}, {
  id: 'random',
  label: 'Random Mix',
  emoji: '🎲',
  color: '#EF4444',
  moduleIds: []
}];
const QUESTION_TIME = 15;

/* ──────────────────────────────────────────────────────────────
   Hexagonal tile
   ────────────────────────────────────────────────────────────── */
function HexTile({
  category,
  onClick
}) {
  return /*#__PURE__*/_jsx(motion.button, {
    whileHover: {
      scale: 1.06,
      y: -4
    },
    whileTap: {
      scale: 0.95
    },
    onClick: onClick,
    className: "relative group",
    children: /*#__PURE__*/_jsxs("div", {
      className: "relative w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center",
      style: {
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: `linear-gradient(135deg, ${category.color}40, ${category.color}10)`,
        border: `1px solid ${category.color}40`
      },
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity",
        style: {
          background: `radial-gradient(circle at center, ${category.color}, transparent 70%)`
        }
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex flex-col items-center gap-1",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-3xl",
          children: category.emoji
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[10px] font-bold text-white",
          children: category.label
        })]
      })]
    })
  });
}

/* ──────────────────────────────────────────────────────────────
   Toast for correct/wrong
   ────────────────────────────────────────────────────────────── */

function QuizToast({
  toast
}) {
  return /*#__PURE__*/_jsx(motion.div, {
    initial: {
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    className: `fixed top-4 left-1/2 -translate-x-1/2 z-[60] rounded-2xl px-5 py-3 border-2 ${toast.type === 'correct' ? 'bg-emerald/15 border-emerald/50 text-emerald-soft' : 'bg-red-500/15 border-red-500/50 text-red-300'}`,
    style: {
      boxShadow: toast.type === 'correct' ? '0 0 24px rgba(16,185,129,0.3)' : '0 0 24px rgba(239,68,68,0.3)'
    },
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-2",
      children: [toast.type === 'correct' ? /*#__PURE__*/_jsx(CheckCircle2, {
        size: 18
      }) : /*#__PURE__*/_jsx(XCircle, {
        size: 18
      }), /*#__PURE__*/_jsx("span", {
        className: "font-bold text-sm",
        children: toast.message
      }), toast.coins && /*#__PURE__*/_jsxs("span", {
        className: "text-xs font-bold",
        children: ["+", toast.coins, " \uD83E\uDE99"]
      })]
    })
  });
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export function QuizArena({
  open,
  onClose
}) {
  const {
    addCoins,
    recordQuizScore,
    setQuizArenaBestStreak,
    quizArenaBestStreak,
    setQuizArenaHighScore
  } = useAppStore();
  const [stage, setStage] = useState('categories');
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const currentQ = questions[qIndex];
  const isLastQ = qIndex >= questions.length - 1;

  // ── Start quiz for a category ──
  const startQuiz = useCallback(cat => {
    let pool;
    if (cat.id === 'random') {
      pool = [...quizQuestions].sort(() => Math.random() - 0.5);
    } else {
      pool = quizQuestions.filter(q => cat.moduleIds.includes(q.moduleId));
      if (pool.length < 5) pool = [...pool, ...quizQuestions.filter(q => !cat.moduleIds.includes(q.moduleId))].slice(0, 10);
    }
    const picked = pool.slice(0, 10).sort(() => Math.random() - 0.5);
    setCategory(cat);
    setQuestions(picked);
    setQIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTimeLeft(QUESTION_TIME);
    setStage('playing');
  }, []);

  // ── Handle answer ──
  const handleAnswer = useCallback(optIdx => {
    if (selected !== null || showExplanation) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(optIdx);
    setShowExplanation(true);
    const correct = optIdx === currentQ.correctIndex;
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo(b => Math.max(b, newCombo));
      const bonus = Math.min(5, Math.floor(newCombo / 2));
      const coins = 10 + bonus * 2;
      setScore(s => s + coins);
      addCoins(coins);
      setToast({
        type: 'correct',
        message: newCombo > 1 ? `${newCombo}x Streak! 🔥` : 'Sahi Jawab!',
        coins
      });
    } else {
      setCombo(0);
      setToast({
        type: 'wrong',
        message: optIdx === -1 ? '⏰ Time up!' : 'Galat Jawab!'
      });
    }
    setTimeout(() => setToast(null), 1500);
  }, [selected, showExplanation, currentQ, combo, addCoins]);

  // ── Timer logic — resets when question or stage changes ──
  // Use a ref to always have the latest answer handler without re-running the effect
  const handleAnswerRef = useRef(handleAnswer);
  handleAnswerRef.current = handleAnswer;
  useEffect(() => {
    if (stage !== 'playing' || showExplanation) return;
    setTimeLeft(QUESTION_TIME);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          // Defer to next tick to avoid setState-in-render
          setTimeout(() => handleAnswerRef.current(-1), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, qIndex, showExplanation]);

  // ── Next question ──
  const handleNext = useCallback(() => {
    if (isLastQ) {
      // Save high score
      if (category) {
        setQuizArenaHighScore(category.id, score);
        recordQuizScore(`arena-${category.id}`, score);
        setQuizArenaBestStreak(bestCombo);
      }
      setStage('results');
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(QUESTION_TIME);
    }
  }, [isLastQ, category, score, bestCombo, setQuizArenaHighScore, recordQuizScore, setQuizArenaBestStreak]);

  // ── Reset on close ──
  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
    setTimeout(() => {
      setStage('categories');
      setCategory(null);
      setQuestions([]);
      setQIndex(0);
      setSelected(null);
      setShowExplanation(false);
      setScore(0);
      setCombo(0);
      setBestCombo(0);
    }, 300);
  };
  const pct = questions.length > 0 ? Math.round(score / (questions.length * 15) * 100) : 0;
  const highScore = category ? useAppStore.getState().quizArenaHighScores[category.id] || 0 : 0;
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
          children: /*#__PURE__*/_jsx(X, {
            size: 16
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-11 h-11 rounded-2xl flex items-center justify-center",
            style: {
              background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
              boxShadow: '0 0 20px rgba(245,158,11,0.3)'
            },
            children: /*#__PURE__*/_jsx(Zap, {
              size: 20,
              className: "text-midnight"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-extrabold text-white",
              children: "Quiz Arena \uD83E\uDDE0"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: "Apni financial knowledge test karo aur coins jeeto!"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "p-5 max-h-[72vh] overflow-y-auto",
        children: /*#__PURE__*/_jsxs(AnimatePresence, {
          mode: "wait",
          children: [stage === 'categories' && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0
            },
            animate: {
              opacity: 1
            },
            exit: {
              opacity: 0
            },
            children: [/*#__PURE__*/_jsxs("div", {
              className: "text-center mb-6",
              children: [/*#__PURE__*/_jsx(motion.div, {
                initial: {
                  scale: 0.5
                },
                animate: {
                  scale: 1
                },
                className: "text-5xl mb-2",
                children: "\uD83E\uDDE0"
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-extrabold heading-gradient mb-1",
                children: "Category Choose Karo"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted",
                children: "10 sawaal, har sawaal pe 15 second. Combo banao aur bonus pao!"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-3 gap-4 justify-items-center max-w-md mx-auto",
              children: CATEGORIES.map((cat, i) => /*#__PURE__*/_jsx(motion.div, {
                initial: {
                  opacity: 0,
                  y: 20
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: i * 0.06
                },
                children: /*#__PURE__*/_jsx(HexTile, {
                  category: cat,
                  onClick: () => startQuiz(cat)
                })
              }, cat.id))
            }), quizArenaBestStreak > 0 && /*#__PURE__*/_jsx("div", {
              className: "mt-6 text-center",
              children: /*#__PURE__*/_jsxs("div", {
                className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30",
                children: [/*#__PURE__*/_jsx(Flame, {
                  size: 14,
                  className: "text-gold-soft"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-xs font-bold text-gold-soft",
                  children: ["Best Combo Streak: ", quizArenaBestStreak, "x"]
                })]
              })
            })]
          }, "categories"), stage === 'playing' && currentQ && /*#__PURE__*/_jsxs(motion.div, {
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
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [/*#__PURE__*/_jsx(Clock, {
                size: 14,
                className: "text-gold-soft"
              }), /*#__PURE__*/_jsx("div", {
                className: "flex-1 h-2 rounded-full bg-white/5 overflow-hidden",
                children: /*#__PURE__*/_jsx(motion.div, {
                  animate: {
                    width: `${timeLeft / QUESTION_TIME * 100}%`
                  },
                  transition: {
                    duration: 0.5,
                    ease: 'linear'
                  },
                  className: "h-full rounded-full",
                  style: {
                    background: timeLeft > 7 ? 'linear-gradient(90deg, #F59E0B, #FCD34D)' : timeLeft > 3 ? '#F59E0B' : '#EF4444'
                  }
                })
              }), /*#__PURE__*/_jsxs("span", {
                className: `text-xs font-bold ${timeLeft > 3 ? 'text-gold-soft' : 'text-red-400'}`,
                children: [timeLeft, "s"]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between mb-3",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
                children: ["Q ", qIndex + 1, " / ", questions.length]
              }), /*#__PURE__*/_jsx(AnimatePresence, {
                children: combo > 1 && /*#__PURE__*/_jsxs(motion.div, {
                  initial: {
                    scale: 0
                  },
                  animate: {
                    scale: 1
                  },
                  exit: {
                    scale: 0
                  },
                  className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30",
                  children: [/*#__PURE__*/_jsx(Flame, {
                    size: 12,
                    className: "text-red-400"
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-xs font-bold text-red-300",
                    children: [combo, "x Streak! \uD83D\uDD25"]
                  })]
                })
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "rounded-2xl border border-white/10 glass-card p-5 mb-4",
              children: /*#__PURE__*/_jsx("p", {
                className: "font-display text-base sm:text-lg font-bold text-white leading-relaxed",
                children: currentQ.question
              })
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
              children: currentQ.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === currentQ.correctIndex;
                const showResult = showExplanation;
                return /*#__PURE__*/_jsx(motion.button, {
                  whileHover: !showResult ? {
                    scale: 1.02,
                    y: -2
                  } : {},
                  whileTap: !showResult ? {
                    scale: 0.97
                  } : {},
                  animate: showResult && isCorrect ? {
                    scale: [1, 1.05, 1]
                  } : showResult && isSelected && !isCorrect ? {
                    x: [0, -8, 8, -8, 0]
                  } : {},
                  transition: {
                    duration: 0.4
                  },
                  onClick: () => handleAnswer(i),
                  disabled: showResult,
                  className: `relative rounded-2xl p-4 text-left border-2 transition-all ${showResult && isCorrect ? 'border-emerald bg-emerald/15' : showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500/15' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}`,
                  children: /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: `w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${showResult && isCorrect ? 'bg-emerald text-midnight' : showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-white/5 text-ink-muted'}`,
                      children: showResult && isCorrect ? /*#__PURE__*/_jsx(CheckCircle2, {
                        size: 16
                      }) : showResult && isSelected && !isCorrect ? /*#__PURE__*/_jsx(XCircle, {
                        size: 16
                      }) : ['A', 'B', 'C', 'D'][i]
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-sm font-bold text-white",
                      children: opt
                    })]
                  })
                }, i);
              })
            }), /*#__PURE__*/_jsx(AnimatePresence, {
              children: showExplanation && /*#__PURE__*/_jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  height: 0
                },
                animate: {
                  opacity: 1,
                  height: 'auto'
                },
                exit: {
                  opacity: 0,
                  height: 0
                },
                className: "mt-4 rounded-xl border border-ai/30 bg-ai/5 p-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-start gap-2",
                  children: [/*#__PURE__*/_jsx(Sparkles, {
                    size: 14,
                    className: "text-ai mt-0.5 flex-shrink-0"
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("p", {
                      className: "text-[10px] font-bold text-ai uppercase tracking-widest mb-1",
                      children: "Explanation"
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-xs text-white/90 leading-relaxed",
                      children: currentQ.explanation
                    })]
                  })]
                }), /*#__PURE__*/_jsxs("button", {
                  onClick: handleNext,
                  className: "btn-3d mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-midnight flex items-center justify-center gap-2",
                  style: {
                    background: 'linear-gradient(135deg, #34D399, #10B981)'
                  },
                  children: [isLastQ ? 'Result Dekho 🎉' : 'Agl Sawaal', " ", /*#__PURE__*/_jsx(ChevronRight, {
                    size: 14
                  })]
                })]
              })
            })]
          }, `playing-${qIndex}`), stage === 'results' && category && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              scale: 0.95
            },
            animate: {
              opacity: 1,
              scale: 1
            },
            className: "text-center py-4",
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0,
                rotate: -180
              },
              animate: {
                scale: 1,
                rotate: 0
              },
              transition: {
                type: 'spring',
                delay: 0.2
              },
              className: "inline-flex items-center justify-center w-20 h-20 rounded-full mb-4",
              style: {
                background: `linear-gradient(135deg, ${category.color}, #34D399)`,
                boxShadow: `0 0 40px ${category.color}60`
              },
              children: /*#__PURE__*/_jsx(Trophy, {
                size: 36,
                className: "text-midnight"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-2xl font-extrabold heading-gradient mb-1",
              children: "Quiz Complete! \uD83C\uDF89"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-ink-muted mb-4",
              children: [category.emoji, " ", category.label, " mastery done!"]
            }), /*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0
              },
              animate: {
                scale: 1
              },
              transition: {
                delay: 0.5,
                type: 'spring'
              },
              className: "font-display text-6xl font-extrabold text-white mb-1",
              style: {
                textShadow: `0 0 40px ${category.color}80`
              },
              children: score
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted uppercase tracking-widest",
              children: "Total Points"
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-3 gap-2 mt-6 max-w-sm mx-auto",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-white/[0.04] border border-white/10 p-3",
                children: [/*#__PURE__*/_jsx(Trophy, {
                  size: 14,
                  className: "text-gold-soft mx-auto mb-1"
                }), /*#__PURE__*/_jsxs("p", {
                  className: "font-display text-lg font-extrabold text-white",
                  children: [pct, "%"]
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[9px] text-ink-muted uppercase",
                  children: "Accuracy"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-white/[0.04] border border-white/10 p-3",
                children: [/*#__PURE__*/_jsx(Flame, {
                  size: 14,
                  className: "text-red-400 mx-auto mb-1"
                }), /*#__PURE__*/_jsxs("p", {
                  className: "font-display text-lg font-extrabold text-white",
                  children: [bestCombo, "x"]
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[9px] text-ink-muted uppercase",
                  children: "Best Combo"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "rounded-xl bg-white/[0.04] border border-white/10 p-3",
                children: [/*#__PURE__*/_jsx(Sparkles, {
                  size: 14,
                  className: "text-ai mx-auto mb-1"
                }), /*#__PURE__*/_jsx("p", {
                  className: "font-display text-lg font-extrabold text-white",
                  children: highScore
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[9px] text-ink-muted uppercase",
                  children: "High Score"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex flex-col sm:flex-row gap-2 mt-6",
              children: [/*#__PURE__*/_jsxs("button", {
                onClick: () => setStage('categories'),
                className: "flex-1 rounded-xl py-3 text-sm font-bold text-white bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2",
                children: [/*#__PURE__*/_jsx(RotateCcw, {
                  size: 14
                }), " Phir Khelo"]
              }), /*#__PURE__*/_jsxs("button", {
                onClick: () => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({
                      title: 'Money Matters — Quiz Arena',
                      text: `Mera score: ${score} points (${pct}% accuracy, ${bestCombo}x best combo)! Tum bhi try karo!`
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
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        children: toast && /*#__PURE__*/_jsx(QuizToast, {
          toast: toast
        })
      })]
    })
  });
}