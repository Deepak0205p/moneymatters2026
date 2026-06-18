"use client";

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, CheckCircle2, Trophy, Star, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   Challenge Library — relatable to Indian youth
   ────────────────────────────────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const CHALLENGE_LIBRARY = [{
  id: 'no-swiggy',
  title: 'No Swiggy Week',
  emoji: '🍔❌',
  duration: 7,
  dailyGoal: 200,
  difficulty: 'Medium',
  stars: 2,
  rewardCoins: 100,
  color: '#EF4444',
  description: '7 din tak Swiggy/Zomato se khana order nahi karna. Ghar ka khana = best!'
}, {
  id: 'chai',
  title: 'Chai se Paisa Challenge',
  emoji: '☕💰',
  duration: 14,
  dailyGoal: 30,
  difficulty: 'Easy',
  stars: 1,
  rewardCoins: 80,
  color: '#92400E',
  description: 'Tapri ki chai band, ghar pe banao. Roz ₹30 bachao = ₹420 in 14 din!'
}, {
  id: '500-week',
  title: '₹500 Bachat Week',
  emoji: '💵',
  duration: 7,
  dailyGoal: 71,
  difficulty: 'Medium',
  stars: 2,
  rewardCoins: 120,
  color: '#F59E0B',
  description: 'Roz ~₹71 bachao — 7 din mein ₹500! Matlab ek full weekend trip fund!'
}, {
  id: '52-week',
  title: '52 Week Saving Challenge',
  emoji: '📅',
  duration: 30,
  // showing 30 days at a time
  dailyGoal: 50,
  difficulty: 'Hard',
  stars: 3,
  rewardCoins: 500,
  color: '#8B5CF6',
  description: 'Hafte 1: ₹10, Hafte 2: ₹20... aise badhate jao. Total ₹13,780 in 52 weeks!'
}, {
  id: 'round-up',
  title: 'Round-Up Savings',
  emoji: '🔄',
  duration: 30,
  dailyGoal: 25,
  difficulty: 'Easy',
  stars: 1,
  rewardCoins: 90,
  color: '#10B981',
  description: 'Har kharcha ko round up karo — ₹92 ki cheez pe ₹100 do, ₹8 bachao. Magic!'
}, {
  id: 'no-impulse',
  title: 'No Impulse Buy',
  emoji: '🛒❌',
  duration: 7,
  dailyGoal: 150,
  difficulty: 'Hard',
  stars: 3,
  rewardCoins: 150,
  color: '#EC4899',
  description: '7 din — koi bhi non-essential cheez mat kharido. Sirf zaroori cheezein!'
}];

/* ──────────────────────────────────────────────────────────────
   Trophy wall — completed challenges
   ────────────────────────────────────────────────────────────── */

function TrophyWall({
  trophies
}) {
  if (trophies.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "rounded-2xl border border-white/10 glass-card p-6 text-center",
      children: [/*#__PURE__*/_jsx("div", {
        className: "text-4xl mb-2 opacity-40",
        children: "\uD83C\uDFC6"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted",
        children: "Abhi koi challenge complete nahi. Pehla trophy kamao! \uD83C\uDFAF"
      })]
    });
  }
  return /*#__PURE__*/_jsx("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
    children: /*#__PURE__*/_jsx(AnimatePresence, {
      children: trophies.map((t, i) => /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          scale: 0.5,
          rotateY: 180
        },
        animate: {
          opacity: 1,
          scale: 1,
          rotateY: 0
        },
        transition: {
          delay: i * 0.1,
          type: 'spring'
        },
        className: "relative rounded-2xl border border-gold/30 bg-gold/5 p-3 text-center",
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-3xl mb-1",
          children: t.emoji
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xs font-bold text-white truncate",
          children: t.title
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-[10px] text-gold-soft mt-0.5",
          children: ["+", t.rewardCoins, " coins"]
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[9px] text-ink-muted mt-0.5",
          children: t.date
        })]
      }, t.id))
    })
  });
}

/* ──────────────────────────────────────────────────────────────
   Active Challenge Card — flame grows with streak
   ────────────────────────────────────────────────────────────── */
function ActiveChallengeCard({
  template,
  onComplete
}) {
  const {
    savingsChallenge,
    markSavingsDay,
    addCoins
  } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const todayDone = savingsChallenge.days.find(d => d.date === today)?.saved;
  const completedDays = savingsChallenge.days.filter(d => d.saved).length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < savingsChallenge.days.length; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const day = savingsChallenge.days.find(dd => dd.date === ds);
      if (day?.saved) streak++;else break;
    }
    return streak;
  }, [savingsChallenge.days]);
  const pct = Math.min(100, Math.round(completedDays / template.duration * 100));
  const flameSize = 36 + Math.min(28, currentStreak * 4);
  const handleCheckIn = useCallback(() => {
    if (todayDone) return;
    markSavingsDay(savingsChallenge.days.find(d => d.date === today)?.day ?? 1, template.dailyGoal);
    addCoins(5);
    if (completedDays + 1 >= template.duration) {
      onComplete({
        id: `${template.id}-${Date.now()}`,
        title: template.title,
        emoji: template.emoji,
        date: today,
        rewardCoins: template.rewardCoins
      });
      addCoins(template.rewardCoins);
    }
  }, [todayDone, markSavingsDay, savingsChallenge.days, today, template, completedDays, addCoins, onComplete]);
  return /*#__PURE__*/_jsxs("div", {
    className: "relative overflow-hidden rounded-2xl border border-emerald/30 glass-card-glow p-5",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30",
      style: {
        backgroundColor: template.color
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start gap-4",
        children: [/*#__PURE__*/_jsx(motion.div, {
          animate: {
            scale: [1, 1.05, 1]
          },
          transition: {
            duration: 2,
            repeat: Infinity
          },
          className: "text-5xl flex-shrink-0",
          children: template.emoji
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-1",
            children: [/*#__PURE__*/_jsx("span", {
              className: "px-2 py-0.5 rounded-full bg-emerald/15 border border-emerald/30 text-[9px] font-bold text-emerald-soft uppercase",
              children: "Active"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] font-bold text-ink-muted",
              children: template.difficulty
            })]
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-display text-lg font-extrabold text-white",
            children: template.title
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[11px] text-ink-muted mt-1",
            children: template.description
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 flex items-center justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
            children: "Day Progress"
          }), /*#__PURE__*/_jsxs("p", {
            className: "font-display text-3xl font-extrabold text-white",
            children: ["Day ", completedDays, /*#__PURE__*/_jsxs("span", {
              className: "text-base text-ink-muted",
              children: ["/", template.duration]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-center",
          children: [/*#__PURE__*/_jsx(motion.div, {
            animate: {
              scale: [1, 1.1 + currentStreak * 0.02, 1]
            },
            transition: {
              duration: 1.5,
              repeat: Infinity
            },
            style: {
              fontSize: `${flameSize}px`,
              lineHeight: 1,
              filter: `drop-shadow(0 0 12px rgba(239,68,68,${0.4 + currentStreak * 0.05}))`
            },
            children: "\uD83D\uDD25"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-[10px] font-bold text-red-400 mt-1",
            children: [currentStreak, "x Streak"]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-3 h-2 rounded-full bg-white/5 overflow-hidden",
        children: /*#__PURE__*/_jsx(motion.div, {
          initial: {
            width: 0
          },
          animate: {
            width: `${pct}%`
          },
          transition: {
            duration: 1
          },
          className: "h-full rounded-full",
          style: {
            background: `linear-gradient(90deg, ${template.color}, #34D399)`
          }
        })
      }), /*#__PURE__*/_jsx(motion.button, {
        whileHover: {
          scale: todayDone ? 1 : 1.02
        },
        whileTap: {
          scale: todayDone ? 1 : 0.98
        },
        onClick: handleCheckIn,
        disabled: !!todayDone,
        className: `mt-4 w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 ${todayDone ? 'bg-emerald/15 text-emerald-soft border border-emerald/30 cursor-not-allowed' : 'btn-3d text-midnight'}`,
        style: !todayDone ? {
          background: 'linear-gradient(135deg, #34D399, #10B981)'
        } : {},
        children: todayDone ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(CheckCircle2, {
            size: 16
          }), " Aaj Control Kiya! \u2705"]
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(Flame, {
            size: 16
          }), " Aaj Control Kiya? +5 Coins \u2705"]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-3 flex items-center justify-between text-[11px]",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-ink-muted",
          children: ["Total Saved: ", /*#__PURE__*/_jsxs("span", {
            className: "font-bold text-emerald-soft",
            children: ["\u20B9", savingsChallenge.totalSaved]
          })]
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-gold-soft font-bold",
          children: ["Reward: +", template.rewardCoins, " coins \uD83E\uDE99"]
        })]
      })]
    })]
  });
}

/* ──────────────────────────────────────────────────────────────
   Library Card
   ────────────────────────────────────────────────────────────── */
function LibraryCard({
  template,
  isActive,
  onStart
}) {
  return /*#__PURE__*/_jsxs(motion.div, {
    whileHover: {
      y: -4
    },
    className: "relative flex-shrink-0 w-64 rounded-2xl border border-white/10 glass-card p-4 overflow-hidden",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-30",
      style: {
        backgroundColor: template.color
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-4xl",
          children: template.emoji
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-end gap-1",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex gap-0.5",
            children: [1, 2, 3].map(s => /*#__PURE__*/_jsx(Star, {
              size: 10,
              className: s <= template.stars ? 'text-gold-soft' : 'text-white/15',
              fill: s <= template.stars ? 'currentColor' : 'none'
            }, s))
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[9px] font-bold text-ink-muted",
            children: template.difficulty
          })]
        })]
      }), /*#__PURE__*/_jsx("h4", {
        className: "font-display text-sm font-bold text-white mt-2",
        children: template.title
      }), /*#__PURE__*/_jsx("p", {
        className: "text-[10px] text-ink-muted mt-1 leading-relaxed line-clamp-2",
        children: template.description
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-3 flex items-center gap-3 text-[10px] text-ink-muted",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(Zap, {
            size: 10,
            className: "text-emerald-soft"
          }), " ", template.duration, " din"]
        }), /*#__PURE__*/_jsxs("span", {
          className: "flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(Trophy, {
            size: 10,
            className: "text-gold-soft"
          }), " ", template.rewardCoins, " coins"]
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: onStart,
        disabled: isActive,
        className: `mt-3 w-full rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1 transition-all ${isActive ? 'bg-white/5 text-ink-muted cursor-not-allowed' : 'bg-emerald/15 border border-emerald/30 text-emerald-soft hover:bg-emerald/25'}`,
        children: isActive ? 'Already Active' : /*#__PURE__*/_jsxs(_Fragment, {
          children: ["Start Karo ", /*#__PURE__*/_jsx(ChevronRight, {
            size: 12
          })]
        })
      })]
    })]
  });
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function SavingsChallenge({
  open,
  onClose
}) {
  const {
    savingsChallenge,
    startSavingsChallenge,
    resetSavingsChallenge
  } = useAppStore();
  const [trophies, setTrophies] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Derive active template directly from store state — no effect needed
  const activeTemplate = savingsChallenge.isActive ? selectedTemplate ?? CHALLENGE_LIBRARY[0] : null;
  const handleStart = useCallback(template => {
    startSavingsChallenge(template.dailyGoal);
    setSelectedTemplate(template);
  }, [startSavingsChallenge]);
  const handleComplete = useCallback(trophy => {
    setTrophies(prev => [...prev, trophy]);
    // Reset the challenge in store so the UI returns to library view
    resetSavingsChallenge();
  }, [resetSavingsChallenge]);

  // Dummy leaderboard rank
  const rank = 42;
  const totalChallengers = 500;
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: o => !o && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative p-5 border-b border-white/10 glass-card-premium",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: onClose,
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
            children: /*#__PURE__*/_jsx(Flame, {
              size: 20,
              className: "text-midnight"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-extrabold text-white",
              children: "Bachat Ki Challenge \uD83D\uDD25"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: "Roz control karo, streak banao, coins jeeto!"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-4 flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-2xl",
            children: "\uD83C\uDFC5"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
              children: "Tumhari Rank"
            }), /*#__PURE__*/_jsxs("p", {
              className: "font-display text-lg font-extrabold text-white",
              children: ["#", rank, " ", /*#__PURE__*/_jsxs("span", {
                className: "text-xs text-ink-muted font-normal",
                children: ["of ", totalChallengers, " challengers"]
              })]
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[10px] font-bold text-gold-soft",
            children: "Top 10% mein! \uD83C\uDFAF"
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 max-h-[72vh] overflow-y-auto space-y-4",
        children: [activeTemplate && savingsChallenge.isActive ? /*#__PURE__*/_jsx(ActiveChallengeCard, {
          template: activeTemplate,
          onComplete: handleComplete
        }) : /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 10
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "relative overflow-hidden rounded-2xl border border-emerald/20 glass-card-glow p-6 text-center",
          children: [/*#__PURE__*/_jsx(motion.div, {
            animate: {
              y: [0, -6, 0]
            },
            transition: {
              duration: 3,
              repeat: Infinity
            },
            className: "text-6xl mb-3",
            children: "\uD83C\uDFAF"
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-display text-xl font-extrabold heading-gradient mb-2",
            children: "Challenge Accept Karo!"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-ink-muted max-w-sm mx-auto mb-4",
            children: "Neeche se koi challenge choose karo aur apni bachat journey shuru karo! Pehla step sabse zaroori hai \uD83D\uDCAA"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              size: 12,
              className: "text-ai"
            }), " Challenge Library"]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1",
            children: CHALLENGE_LIBRARY.map(t => /*#__PURE__*/_jsx(LibraryCard, {
              template: t,
              isActive: savingsChallenge.isActive && activeTemplate?.id === t.id,
              onStart: () => handleStart(t)
            }, t.id))
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-xs font-bold text-gold-soft uppercase tracking-widest mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Trophy, {
              size: 12
            }), " Trophy Wall"]
          }), /*#__PURE__*/_jsx(TrophyWall, {
            trophies: trophies
          })]
        })]
      })]
    })
  });
}