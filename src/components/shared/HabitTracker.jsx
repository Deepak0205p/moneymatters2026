'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Habit Tracker — swipeable checklist, streak, heatmap
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const HABITS = [{
  id: 'track',
  label: 'Aaj ka kharcha note kiya?',
  emoji: '💰',
  description: 'Track all expenses today'
}, {
  id: 'avoid',
  label: 'Unnecessary kharcha avoid kiya?',
  emoji: '☕',
  description: 'Skipped an avoidable expense'
}, {
  id: 'learn',
  label: 'Kuch naya financial concept padha?',
  emoji: '📚',
  description: 'Learned something new about money'
}, {
  id: 'save',
  label: 'Savings account mein kuch daala?',
  emoji: '💵',
  description: 'Added money to savings'
}, {
  id: 'check',
  label: 'UPI transactions check kiye?',
  emoji: '📱',
  description: 'Reviewed UPI spends'
}];
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
function formatDate(d) {
  return d.toISOString().split('T')[0];
}
function getStreakFromData(habitTracker, habitId) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker[dateStr] || []).includes(habitId);
    if (done) {
      streak++;
    } else if (i > 0) {
      // Allow today to be incomplete without breaking streak
      break;
    }
  }
  return streak;
}
function getPerfectDaysThisMonth(habitTracker) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month, day));
    const done = (habitTracker[dateStr] || []).length;
    if (done === HABITS.length) count++;
  }
  return count;
}
function getWeeklyHeatmap(habitTracker) {
  const today = new Date();
  const result = [];
  // 4 weeks (28 days) — last 28 days
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker[dateStr] || []).length;
    const intensity = done === 0 ? 0 : Math.min(4, Math.ceil(done / HABITS.length * 4));
    result.push({
      date: d,
      intensity,
      dateStr
    });
  }
  return result;
}
const FLAME_TIERS = [{
  min: 30,
  emoji: '🏆',
  label: 'Master',
  color: '#f59e0b'
}, {
  min: 14,
  emoji: '💎',
  label: 'Adaat',
  color: '#8b5cf6'
}, {
  min: 7,
  emoji: '🔥',
  label: 'Streak',
  color: '#f97316'
}, {
  min: 3,
  emoji: '🌱',
  label: 'Shuruat',
  color: '#10b981'
}, {
  min: 1,
  emoji: '✨',
  label: 'Spark',
  color: '#06b6d4'
}, {
  min: 0,
  emoji: '💤',
  label: 'Start',
  color: '#64748b'
}];
function getFlameTier(streak) {
  return FLAME_TIERS.find(t => streak >= t.min) || FLAME_TIERS[FLAME_TIERS.length - 1];
}
export default function HabitTracker({
  open,
  onClose
}) {
  const {
    habitTracker,
    toggleHabit,
    addCoins,
    badges,
    addBadge
  } = useAppStore();
  const [perfectDayAwarded, setPerfectDayAwarded] = useState(false);
  const today = formatDate(new Date());
  const todayDone = habitTracker[today] || [];
  const allHabitsDone = todayDone.length === HABITS.length;
  useEffect(() => {
    if (allHabitsDone && !perfectDayAwarded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPerfectDayAwarded(true);
      addCoins(10);
      if (!badges.includes('perfect-day')) addBadge('perfect-day');
      toast({
        title: 'Perfect Day! +10 coins 🌟'
      });
    } else if (!allHabitsDone) {
      setPerfectDayAwarded(false);
    }
  }, [allHabitsDone, perfectDayAwarded, addCoins, addBadge, badges]);

  /* Calculate best streak across all habits */
  const bestStreak = useMemo(() => {
    return Math.max(...HABITS.map(h => getStreakFromData(habitTracker, h.id)), 0);
  }, [habitTracker]);
  const streakTier = getFlameTier(bestStreak);
  const weeklyHeatmap = useMemo(() => getWeeklyHeatmap(habitTracker), [habitTracker]);
  const perfectDays = useMemo(() => getPerfectDaysThisMonth(habitTracker), [habitTracker]);
  const completionRate = Math.round(todayDone.length / HABITS.length * 100);
  const handleToggle = habitId => {
    toggleHabit(today, habitId);
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Habit Tracker"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative px-5 pt-6 pb-4 bg-gradient-to-b from-violet-500/10 to-transparent",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
              children: /*#__PURE__*/_jsx(Calendar, {
                className: "w-5 h-5 text-violet-400"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "font-display text-xl font-bold heading-gradient",
                children: "Habit Tracker"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#94A3B8]",
                children: "Roz ki adatein banao \uD83D\uDD25"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-right",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] text-[#94A3B8]",
              children: "Today"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs font-bold text-[#F8FAFC]",
              children: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "p-3 rounded-2xl glass-card-premium border-amber-400/30 flex items-center gap-3",
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0.6,
                rotate: -10
              },
              animate: {
                scale: 1,
                rotate: 0
              },
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 14
              },
              className: "text-4xl",
              style: {
                filter: `drop-shadow(0 0 12px ${streakTier.color})`
              },
              children: streakTier.emoji
            }, streakTier.emoji), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-2xl font-bold font-display",
                style: {
                  color: streakTier.color
                },
                children: bestStreak
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[10px] text-[#94A3B8]",
                children: ["din streak \xB7 ", streakTier.label]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-3 rounded-2xl glass-card flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-3xl",
              children: "\uD83C\uDF1F"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-2xl font-bold text-amber-300",
                children: perfectDays
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-[#94A3B8]",
                children: "perfect days this month"
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Aaj Ki Progress"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-sm font-bold text-emerald-300",
              children: [todayDone.length, "/", HABITS.length]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "h-2 rounded-full bg-white/[0.06] overflow-hidden",
            children: /*#__PURE__*/_jsx(motion.div, {
              className: cn('h-full rounded-full', allHabitsDone ? 'bg-amber-400' : 'bg-emerald-400'),
              animate: {
                width: `${completionRate}%`
              },
              transition: {
                type: 'spring',
                stiffness: 120,
                damping: 18
              }
            })
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[10px] text-[#94A3B8] mt-1.5",
            children: allHabitsDone ? '🎉 All done! Perfect day!' : `${HABITS.length - todayDone.length} aur baaki hain`
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-2",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Today's Habits"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-[#94A3B8]",
              children: "Tap right side to mark done \u2192"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-2",
            children: HABITS.map(habit => {
              const done = todayDone.includes(habit.id);
              return /*#__PURE__*/_jsxs(motion.div, {
                layout: true,
                initial: {
                  opacity: 0,
                  x: -20
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                whileTap: {
                  scale: 0.98
                },
                drag: "x",
                dragConstraints: {
                  left: 0,
                  right: 0
                },
                dragElastic: 0.15,
                onDragEnd: (_, info) => {
                  if (info.offset.x > 60 && !done) handleToggle(habit.id);else if (info.offset.x < -60 && done) handleToggle(habit.id);
                },
                className: cn('relative p-3 rounded-2xl border overflow-hidden cursor-grab active:cursor-grabbing', done ? 'glass-card-premium border-emerald-400/30' : 'glass-card border-white/[0.06]'),
                children: [/*#__PURE__*/_jsx("div", {
                  className: cn('absolute right-2 top-1/2 -translate-y-1/2 transition-opacity', done ? 'opacity-100' : 'opacity-40'),
                  children: /*#__PURE__*/_jsx("div", {
                    className: "flex items-center gap-1",
                    children: /*#__PURE__*/_jsx(ChevronRight, {
                      className: "w-4 h-4 text-emerald-400"
                    })
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-3 pr-6",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "w-10 h-10 rounded-xl bg-white/[0.04] grid place-items-center text-xl shrink-0",
                    children: habit.emoji
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/*#__PURE__*/_jsx("p", {
                      className: cn('text-sm font-semibold', done ? 'text-emerald-300' : 'text-[#F8FAFC]'),
                      children: habit.label
                    }), /*#__PURE__*/_jsx("p", {
                      className: "text-[10px] text-[#94A3B8]",
                      children: habit.description
                    })]
                  }), /*#__PURE__*/_jsx("button", {
                    onClick: () => handleToggle(habit.id),
                    className: cn('w-9 h-9 rounded-xl grid place-items-center shrink-0 transition', done ? 'bg-emerald-500 text-white' : 'glass-card text-[#94A3B8] hover:text-emerald-300'),
                    children: /*#__PURE__*/_jsx(Check, {
                      className: cn('w-5 h-5', done && 'scale-110')
                    })
                  })]
                }), /*#__PURE__*/_jsx(AnimatePresence, {
                  children: done && /*#__PURE__*/_jsx(motion.div, {
                    initial: {
                      x: '-100%'
                    },
                    animate: {
                      x: '0%'
                    },
                    exit: {
                      x: '-100%'
                    },
                    transition: {
                      duration: 0.4
                    },
                    className: "absolute inset-0 bg-emerald-500/5 pointer-events-none"
                  })
                })]
              }, habit.id);
            })
          })]
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          children: allHabitsDone && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              scale: 0.9
            },
            animate: {
              opacity: 1,
              scale: 1
            },
            exit: {
              opacity: 0,
              scale: 0.9
            },
            className: "p-4 rounded-2xl glass-card-premium border-amber-400/40 text-center",
            children: [/*#__PURE__*/_jsx(motion.div, {
              animate: {
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1]
              },
              transition: {
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 1.5
              },
              className: "text-4xl mb-1 inline-block",
              children: "\uD83C\uDF1F"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-bold text-amber-300",
              children: "Perfect Day!"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8]",
              children: "+10 coins mil gaye! Kal bhi aise hi rakho \uD83D\uDCAA"
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-3",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Weekly Heatmap \uD83D\uDCC5"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-[#94A3B8]",
              children: "Last 4 weeks"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-7 gap-1 mb-1.5",
            children: WEEK_DAYS.map((d, i) => /*#__PURE__*/_jsx("div", {
              className: "text-[9px] text-center text-[#94A3B8]",
              children: d
            }, i))
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-7 gap-1",
            children: weeklyHeatmap.map((day, i) => {
              const bgColor = day.intensity === 0 ? 'bg-white/[0.04]' : day.intensity === 1 ? 'bg-emerald-500/30' : day.intensity === 2 ? 'bg-emerald-500/55' : day.intensity === 3 ? 'bg-emerald-500/80' : 'bg-emerald-400';
              const isToday = day.dateStr === today;
              return /*#__PURE__*/_jsx(motion.div, {
                initial: {
                  scale: 0.6,
                  opacity: 0
                },
                animate: {
                  scale: 1,
                  opacity: 1
                },
                transition: {
                  delay: i * 0.015
                },
                whileHover: {
                  scale: 1.15
                },
                title: `${day.date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })} · ${day.intensity === 0 ? 'no activity' : `${day.intensity}/4 intensity`}`,
                className: cn('aspect-square rounded-md grid place-items-center text-[8px] font-bold transition relative', bgColor, isToday && 'ring-2 ring-amber-400', day.intensity >= 3 ? 'text-white' : 'text-[#94A3B8]'),
                children: day.date.getDate()
              }, i);
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mt-3 text-[9px] text-[#94A3B8]",
            children: [/*#__PURE__*/_jsx("span", {
              children: "Less"
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex gap-0.5",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-sm bg-white/[0.04]"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-sm bg-emerald-500/30"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-sm bg-emerald-500/55"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-sm bg-emerald-500/80"
              }), /*#__PURE__*/_jsx("div", {
                className: "w-2 h-2 rounded-sm bg-emerald-400"
              })]
            }), /*#__PURE__*/_jsx("span", {
              children: "More"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card-premium border border-violet-500/30 flex items-start gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-9 h-9 rounded-xl bg-violet-500/15 grid place-items-center shrink-0",
            children: /*#__PURE__*/_jsx(Sparkles, {
              className: "w-5 h-5 text-violet-400"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-sm font-bold text-violet-300 mb-0.5",
              children: "Reminder \uD83E\uDD16"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] leading-relaxed",
              children: !allHabitsDone ? `Aaj ka checklist abhi tak incomplete hai! ⏰ Sirf ${HABITS.length - todayDone.length} aur baaki.` : bestStreak >= 7 ? '7+ din streak! Tum next level pe ho. Kal bhi mat todo! 💪' : 'Perfect day! Aise hi roz karte raho — 7 din mein badge unlock! 🏆'
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "p-4 rounded-2xl glass-card",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [/*#__PURE__*/_jsx(Trophy, {
              className: "w-4 h-4 text-amber-400"
            }), /*#__PURE__*/_jsx("h3", {
              className: "text-sm font-semibold text-[#F8FAFC]",
              children: "Achievements"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-4 gap-2",
            children: [{
              id: 'habit-shuruat',
              days: 3,
              emoji: '🌱',
              label: 'Shuruat'
            }, {
              id: 'habit-consistent',
              days: 7,
              emoji: '🔥',
              label: 'Streak'
            }, {
              id: 'habit-adaat',
              days: 14,
              emoji: '💎',
              label: 'Adaat'
            }, {
              id: 'habit-master',
              days: 30,
              emoji: '🏆',
              label: 'Master'
            }].map(b => {
              const earned = badges.includes(b.id);
              return /*#__PURE__*/_jsxs("div", {
                className: cn('aspect-square rounded-xl grid place-items-center p-1 border', earned ? 'glass-card-premium border-amber-400/30' : 'border-white/[0.04] opacity-40'),
                children: [/*#__PURE__*/_jsx("div", {
                  className: cn('text-2xl mb-0.5', !earned && 'grayscale'),
                  children: earned ? b.emoji : '🔒'
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[8px] text-center text-[#94A3B8]",
                  children: b.label
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-[8px] text-amber-300/70",
                  children: [b.days, "d"]
                })]
              }, b.id);
            })
          })]
        })]
      })]
    })
  });
}