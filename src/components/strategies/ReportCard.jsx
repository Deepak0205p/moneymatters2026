'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Share2, GraduationCap, Star, Award, Lightbulb } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const gradeMeta = {
  'A+': {
    color: '#10B981',
    bg: 'bg-emerald-500/15 border-emerald-500/40',
    pct: '90-100%'
  },
  A: {
    color: '#34D399',
    bg: 'bg-green-500/15 border-green-500/40',
    pct: '80-89%'
  },
  B: {
    color: '#FACC15',
    bg: 'bg-yellow-500/15 border-yellow-500/40',
    pct: '70-79%'
  },
  C: {
    color: '#FB923C',
    bg: 'bg-orange-500/15 border-orange-500/40',
    pct: '60-69%'
  },
  D: {
    color: '#F87171',
    bg: 'bg-red-500/15 border-red-500/40',
    pct: '50-59%'
  },
  F: {
    color: '#EF4444',
    bg: 'bg-red-600/20 border-red-600/50',
    pct: '<50%'
  }
};
function scoreToGrade(s) {
  if (s >= 90) return 'A+';
  if (s >= 80) return 'A';
  if (s >= 70) return 'B';
  if (s >= 60) return 'C';
  if (s >= 50) return 'D';
  return 'F';
}
export default function ReportCard() {
  const {
    userName,
    completedModules,
    moduleProgress,
    quizScores,
    streak,
    coins,
    addCoins
  } = useAppStore();
  const [stampShown, setStampShown] = useState(false);
  const [shared, setShared] = useState(false);
  const student = userName?.trim() || 'Student';

  // Subject scoring (0-100)
  const subjects = useMemo(() => {
    const modulesDone = completedModules.length;
    const modProgressAvg = Object.keys(moduleProgress).length > 0 ? Object.values(moduleProgress).reduce((a, b) => a + b, 0) / Object.keys(moduleProgress).length : 0;
    const quizAvg = Object.keys(quizScores).length > 0 ? Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length : 0;
    const saving = Math.min(100, modulesDone / 11 * 100);
    const budget = Math.round(quizAvg);
    const debt = Math.min(100, Math.round(modProgressAvg));
    const investment = Math.min(100, Math.round(coins / 500 * 100));
    const discipline = Math.min(100, streak * 10);
    return [{
      name: 'Saving Habits',
      emoji: '🐷',
      score: Math.round(saving),
      tip: 'Modules complete karo — har module ₹50 deta hai!'
    }, {
      name: 'Budget Planning',
      emoji: '📊',
      score: budget,
      tip: 'Quiz attempts karo, score improve hoga.'
    }, {
      name: 'Debt Awareness',
      emoji: '💀',
      score: debt,
      tip: 'Debt modules ko 100% complete karo.'
    }, {
      name: 'Investment Knowledge',
      emoji: '📈',
      score: investment,
      tip: 'Coins kamao — activities complete karke.'
    }, {
      name: 'Financial Discipline',
      emoji: '🔥',
      score: discipline,
      tip: 'Daily login — streak badhao!'
    }];
  }, [completedModules, moduleProgress, quizScores, coins, streak]);
  const avgScore = Math.round(subjects.reduce((a, s) => a + s.score, 0) / subjects.length);
  const avgGrade = scoreToGrade(avgScore);
  const stamp = avgScore >= 75 ? 'DISTINCTION' : avgScore >= 50 ? 'PASS' : 'NEEDS WORK';
  const remark = useMemo(() => {
    if (avgScore >= 90) return '🌟 Outstanding! Tum true Financial Vidhyarthi ho. Aise hi chalte raho!';
    if (avgScore >= 75) return '👏 Bahut achha! Thoda aur practice aur tum top pe ho.';
    if (avgScore >= 60) return '👍 Theek chal raha hai. Modules aur quizzes par dhyaan do.';
    if (avgScore >= 50) return '💪 Mehnat kar rahe ho. Daily streak maintain karo, farak dikhega!';
    return '📚 Abhi shuruwat hai. Ek-ek module complete karo, score khud badhega!';
  }, [avgScore]);
  const lowScorers = subjects.filter(s => s.score < 60);

  // Trigger stamp animation on mount
  useEffect(() => {
    const t = setTimeout(() => setStampShown(true), 600);
    return () => clearTimeout(t);
  }, []);
  const handleShare = () => {
    setShared(true);
    addCoins(5);
    setTimeout(() => setShared(false), 2000);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "max-w-3xl mx-auto",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center mb-5",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "font-display text-3xl md:text-4xl font-bold text-gradient-emerald",
        children: "Financial Health Report Card \uD83D\uDCDC"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-zinc-400 mt-1 text-sm",
        children: "Tumhari financial journey ka school report card"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative glass-card rounded-2xl p-6 md:p-8",
      style: {
        border: '2px solid rgba(245,158,11,0.25)'
      },
      children: [['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map(p => /*#__PURE__*/_jsx("div", {
        className: `absolute ${p} w-6 h-6 border-amber-500/40`,
        style: {
          borderTop: p.includes('top') ? '2px solid' : 'none',
          borderBottom: p.includes('bottom') ? '2px solid' : 'none',
          borderLeft: p.includes('left') ? '2px solid' : 'none',
          borderRight: p.includes('right') ? '2px solid' : 'none',
          borderRadius: p.includes('left') && p.includes('top') ? '8px 0 0 0' : p.includes('right') && p.includes('top') ? '0 8px 0 0' : p.includes('left') && p.includes('bottom') ? '0 0 0 8px' : '0 0 8px 0'
        }
      }, p)), /*#__PURE__*/_jsxs("div", {
        className: "text-center border-b-2 border-amber-500/30 pb-4 mb-5 relative",
        children: [/*#__PURE__*/_jsx("div", {
          className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/40 mb-2",
          children: /*#__PURE__*/_jsx(GraduationCap, {
            className: "w-9 h-9 text-amber-400"
          })
        }), /*#__PURE__*/_jsx("h3", {
          className: "font-display text-2xl md:text-3xl font-bold text-gradient-gold",
          children: "Money Matters"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-zinc-300 tracking-wide",
          children: "Financial Vidyalaya"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-zinc-500 italic mt-1",
          children: "\"Padho, Bachao, Badho\" \u2014 Est. 2024"
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          children: stampShown && /*#__PURE__*/_jsx(motion.div, {
            initial: {
              scale: 3,
              rotate: -45,
              opacity: 0
            },
            animate: {
              scale: 1,
              rotate: -12,
              opacity: 1
            },
            transition: {
              type: 'spring',
              stiffness: 200,
              damping: 12
            },
            className: "absolute top-0 right-0 md:top-2 md:right-2 px-4 py-2 rounded-lg border-4",
            style: {
              borderColor: stamp === 'DISTINCTION' ? '#10B981' : stamp === 'PASS' ? '#F59E0B' : '#EF4444',
              color: stamp === 'DISTINCTION' ? '#10B981' : stamp === 'PASS' ? '#F59E0B' : '#EF4444',
              background: 'rgba(0,0,0,0.3)',
              textShadow: '0 0 8px currentColor'
            },
            children: /*#__PURE__*/_jsx("p", {
              className: "font-display font-black text-lg md:text-xl tracking-wider",
              children: stamp
            })
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-2 gap-3 mb-5 text-sm",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "glass rounded-lg p-2.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-zinc-500 text-xs",
            children: "Student Name:"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-white font-semibold",
            children: student
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "glass rounded-lg p-2.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-zinc-500 text-xs",
            children: "Academic Year:"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-white font-semibold",
            children: "2024-25"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "glass rounded-lg p-2.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-zinc-500 text-xs",
            children: "Coins Earned:"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-amber-400 font-semibold",
            children: [coins, " \uD83E\uDE99"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "glass rounded-lg p-2.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-zinc-500 text-xs",
            children: "Streak:"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-emerald-400 font-semibold",
            children: [streak, " days \uD83D\uDD25"]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "rounded-xl overflow-hidden border border-white/10",
        children: /*#__PURE__*/_jsxs("table", {
          className: "w-full text-sm",
          children: [/*#__PURE__*/_jsx("thead", {
            children: /*#__PURE__*/_jsxs("tr", {
              className: "bg-amber-500/15 text-amber-300",
              children: [/*#__PURE__*/_jsx("th", {
                className: "text-left p-2.5 font-display font-semibold",
                children: "Subject"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-center p-2.5 font-display font-semibold",
                children: "Score"
              }), /*#__PURE__*/_jsx("th", {
                className: "text-center p-2.5 font-display font-semibold",
                children: "Grade"
              })]
            })
          }), /*#__PURE__*/_jsx("tbody", {
            children: subjects.map((s, i) => {
              const g = scoreToGrade(s.score);
              const meta = gradeMeta[g];
              return /*#__PURE__*/_jsxs(motion.tr, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: i * 0.1
                },
                className: "border-t border-white/5 hover:bg-white/[0.02]",
                children: [/*#__PURE__*/_jsx("td", {
                  className: "p-2.5",
                  children: /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "text-lg",
                      children: s.emoji
                    }), /*#__PURE__*/_jsx("span", {
                      className: "text-white font-medium",
                      children: s.name
                    })]
                  })
                }), /*#__PURE__*/_jsxs("td", {
                  className: "p-2.5 text-center text-zinc-300",
                  children: [s.score, "/100"]
                }), /*#__PURE__*/_jsx("td", {
                  className: "p-2.5 text-center",
                  children: /*#__PURE__*/_jsx("span", {
                    className: `inline-flex items-center justify-center w-9 h-9 rounded-lg border font-display font-bold ${meta.bg}`,
                    style: {
                      color: meta.color
                    },
                    children: g
                  })
                })]
              }, i);
            })
          }), /*#__PURE__*/_jsx("tfoot", {
            children: /*#__PURE__*/_jsxs("tr", {
              className: "border-t-2 border-amber-500/30 bg-amber-500/5",
              children: [/*#__PURE__*/_jsx("td", {
                className: "p-2.5 font-display font-bold text-amber-300",
                children: "Overall Average"
              }), /*#__PURE__*/_jsxs("td", {
                className: "p-2.5 text-center font-bold text-white",
                children: [avgScore, "/100"]
              }), /*#__PURE__*/_jsx("td", {
                className: "p-2.5 text-center",
                children: /*#__PURE__*/_jsx("span", {
                  className: "inline-flex items-center justify-center w-9 h-9 rounded-lg border font-display font-bold text-lg",
                  style: {
                    color: gradeMeta[avgGrade].color,
                    borderColor: `${gradeMeta[avgGrade].color}40`,
                    background: `${gradeMeta[avgGrade].color}15`
                  },
                  children: avgGrade
                })
              })]
            })
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "flex flex-wrap gap-1.5 mt-3 text-[10px]",
        children: Object.keys(gradeMeta).map(g => /*#__PURE__*/_jsxs("span", {
          className: "px-2 py-0.5 rounded border",
          style: {
            color: gradeMeta[g].color,
            borderColor: `${gradeMeta[g].color}40`
          },
          children: [g, " = ", gradeMeta[g].pct]
        }, g))
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-5 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-1",
          children: [/*#__PURE__*/_jsx(Star, {
            className: "w-4 h-4 text-amber-400"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs uppercase tracking-wide text-amber-400 font-semibold",
            children: "Principal's Remark"
          })]
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-white italic",
          children: ["\"", remark, "\""]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs text-zinc-400 mt-2 text-right",
          children: "\u2014 Principal, Money Matters"
        })]
      }), lowScorers.length > 0 && /*#__PURE__*/_jsxs("div", {
        className: "mt-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-2",
          children: [/*#__PURE__*/_jsx(Lightbulb, {
            className: "w-4 h-4 text-emerald-400"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs uppercase tracking-wide text-emerald-400 font-semibold",
            children: "Improvement Tips"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "space-y-1.5",
          children: lowScorers.map((s, i) => /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 5
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 0.3 + i * 0.1
            },
            className: "text-xs text-zinc-300 flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-base",
              children: s.emoji
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("span", {
                className: "font-semibold text-white",
                children: [s.name, ":"]
              }), " ", s.tip]
            })]
          }, i))
        })]
      }), stamp === 'DISTINCTION' && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          scale: 0
        },
        animate: {
          scale: 1
        },
        className: "mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center",
        children: [/*#__PURE__*/_jsx(Award, {
          className: "w-6 h-6 text-emerald-400 inline-block mb-1"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-emerald-300 font-semibold",
          children: "\uD83C\uDF89 Distinction Holder! Tum top 10% students mein ho!"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "text-center mt-5",
      children: [/*#__PURE__*/_jsxs(motion.button, {
        whileHover: {
          scale: 1.04
        },
        whileTap: {
          scale: 0.96
        },
        onClick: handleShare,
        className: "btn-emerald inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm",
        children: [/*#__PURE__*/_jsx(Share2, {
          className: "w-4 h-4"
        }), shared ? 'Copied!' : 'Share Report Card']
      }), /*#__PURE__*/_jsx("p", {
        className: "text-[11px] text-zinc-500 mt-2",
        children: "Share karne par +5 coins milte hain \uD83E\uDE99"
      })]
    })]
  });
}