"use client";

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Target, TrendingUp, PartyPopper, IndianRupee } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props & Types
   ────────────────────────────────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* ──────────────────────────────────────────────────────────────
   Goal Templates — relatable for Indian youth
   ────────────────────────────────────────────────────────────── */
const TEMPLATES = [{
  id: 'bike',
  label: 'Pehli Bike 🏍️',
  emoji: '🏍️',
  target: 80000,
  color: '#EF4444',
  hint: 'Roz ₹140 bachao toh 6 mahine mein done! ☕ = 3 chai skip'
}, {
  id: 'phone',
  label: 'New Phone 📱',
  emoji: '📱',
  target: 25000,
  color: '#8B5CF6',
  hint: 'Roz ₹70 bachao toh 1 saal mein naya phone! 🎉'
}, {
  id: 'trip',
  label: 'Trip with Friends ✈️',
  emoji: '✈️',
  target: 15000,
  color: '#10B981',
  hint: 'Roz ₹50 bachao toh 10 mahine mein Goa trip ready! 🏖️'
}, {
  id: 'emergency',
  label: 'Emergency Fund 🛡️',
  emoji: '🛡️',
  target: 30000,
  color: '#F59E0B',
  hint: '3 mahine ka kharcha cover karo. Roz ₹100 = 10 mahine!'
}, {
  id: 'laptop',
  label: 'Naya Laptop 💻',
  emoji: '💻',
  target: 55000,
  color: '#06B6D4',
  hint: 'Freelance karo, ₹5000/mahine bachao — 11 mahine mein ho jayega!'
}, {
  id: 'custom',
  label: 'Custom Goal ✏️',
  emoji: '🎯',
  target: 5000,
  color: '#EC4899',
  hint: 'Apna goal banao — chhota ya bada, bas shuru karo!'
}];

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function generateId() {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}
function getProgress(saved, target) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round(saved / target * 100));
}
function daysRemaining(deadline) {
  if (!deadline) return 0;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((d.getTime() - today.getTime()) / 86400000));
}
function dailySuggestion(saved, target, deadline) {
  const remaining = Math.max(0, target - saved);
  const days = daysRemaining(deadline);
  if (remaining <= 0 || days <= 0) return 0;
  return Math.ceil(remaining / days);
}
function motivationalQuote(pct) {
  if (pct >= 100) return 'GOAL COMPLETE! Tumne kar dikhaya! 🎉🏆';
  if (pct >= 75) return 'Almost there! Bas thoda aur! 🏁';
  if (pct >= 50) return 'Aadha rasta cross kar liya! 🔥';
  if (pct >= 25) return 'Progress dekh ke motivation aata hai! 💪';
  return 'Shuruwaat sabse mushkil hoti hai, par zaroori! 🌱';
}

/* ──────────────────────────────────────────────────────────────
   Circular Progress Ring — emerald fill
   ────────────────────────────────────────────────────────────── */
function CircularProgress({
  percent,
  size = 96,
  color = '#10B981'
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return /*#__PURE__*/_jsxs("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    className: "-rotate-90",
    children: [/*#__PURE__*/_jsx("defs", {
      children: /*#__PURE__*/_jsxs("linearGradient", {
        id: `ring-${color.slice(1)}`,
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "100%",
        children: [/*#__PURE__*/_jsx("stop", {
          offset: "0%",
          stopColor: color
        }), /*#__PURE__*/_jsx("stop", {
          offset: "100%",
          stopColor: "#34D399"
        })]
      })
    }), /*#__PURE__*/_jsx("circle", {
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: "rgba(255,255,255,0.08)",
      strokeWidth: stroke
    }), /*#__PURE__*/_jsx(motion.circle, {
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: `url(#ring-${color.slice(1)})`,
      strokeWidth: stroke,
      strokeLinecap: "round",
      strokeDasharray: c,
      initial: {
        strokeDashoffset: c
      },
      animate: {
        strokeDashoffset: c - percent / 100 * c
      },
      transition: {
        duration: 1.2,
        ease: 'easeOut'
      },
      style: {
        filter: `drop-shadow(0 0 6px ${color}80)`
      }
    })]
  });
}

/* ──────────────────────────────────────────────────────────────
   Confetti burst
   ────────────────────────────────────────────────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({
    length: 30
  }, (_, i) => i);
  const colors = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none",
    children: pieces.map(i => /*#__PURE__*/_jsx("div", {
      className: "confetti-piece",
      style: {
        left: `${Math.random() * 100}%`,
        top: '-20px',
        backgroundColor: colors[i % colors.length],
        animationDelay: `${Math.random() * 0.5}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }
    }, i))
  });
}

/* ──────────────────────────────────────────────────────────────
   Goal Card
   ────────────────────────────────────────────────────────────── */
function GoalCard({
  goal,
  onAdd,
  onDelete
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const pct = getProgress(goal.saved, goal.target);
  const remaining = Math.max(0, goal.target - goal.saved);
  const daily = dailySuggestion(goal.saved, goal.target, goal.deadline);
  const isComplete = pct >= 100;
  const handleAdd = useCallback(() => {
    const n = parseInt(amount, 10);
    if (!n || n <= 0) return;
    onAdd(goal.id, n);
    setAmount('');
    setShowAdd(false);
  }, [amount, goal.id, onAdd]);
  return /*#__PURE__*/_jsxs(motion.div, {
    layout: true,
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
      scale: 0.9
    },
    className: "relative card-3d glass-card rounded-2xl p-5 overflow-hidden",
    children: [isComplete && /*#__PURE__*/_jsx(ConfettiBurst, {}), /*#__PURE__*/_jsx("div", {
      className: "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30",
      style: {
        backgroundColor: goal.category
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative flex items-start gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative flex-shrink-0",
        children: [/*#__PURE__*/_jsx(CircularProgress, {
          percent: pct,
          size: 96,
          color: goal.category
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 flex items-center justify-center",
          children: /*#__PURE__*/_jsx("span", {
            className: "text-3xl",
            children: goal.emoji
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 min-w-0",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between gap-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "min-w-0",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-display text-base font-bold text-white truncate",
              children: goal.name
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: ["Target: ", /*#__PURE__*/_jsx("span", {
                className: "font-bold text-white",
                children: formatINR(goal.target)
              })]
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => onDelete(goal.id),
            className: "text-ink-muted hover:text-red-400 transition-colors p-1",
            "aria-label": "Delete goal",
            children: /*#__PURE__*/_jsx(Trash2, {
              size: 14
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-2 flex items-baseline gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-display text-2xl font-extrabold",
            style: {
              color: goal.category
            },
            children: formatINR(goal.saved)
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-xs text-ink-muted",
            children: ["/ ", formatINR(goal.target), " \xB7 ", pct, "%"]
          })]
        }), !isComplete ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-xs text-ink-muted mt-1",
            children: [formatINR(remaining), " baaki hai"]
          }), daily > 0 && /*#__PURE__*/_jsxs("p", {
            className: "text-[11px] text-emerald-soft mt-1 font-semibold",
            children: ["\uD83D\uDCA1 Roz \u20B9", daily, " bachao toh ", daysRemaining(goal.deadline), " din mein done!"]
          })]
        }) : /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            scale: 0.5
          },
          animate: {
            scale: 1
          },
          className: "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30",
          children: [/*#__PURE__*/_jsx(PartyPopper, {
            size: 12,
            className: "text-gold-soft"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[11px] font-bold text-gold-soft",
            children: "Goal Achieved! \uD83C\uDF89"
          })]
        })]
      })]
    }), !isComplete && /*#__PURE__*/_jsx("div", {
      className: "relative mt-4",
      children: /*#__PURE__*/_jsx(AnimatePresence, {
        children: showAdd ? /*#__PURE__*/_jsxs(motion.div, {
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
          className: "flex gap-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "relative flex-1",
            children: [/*#__PURE__*/_jsx(IndianRupee, {
              size: 14,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            }), /*#__PURE__*/_jsx(Input, {
              type: "number",
              value: amount,
              onChange: e => setAmount(e.target.value),
              placeholder: "Amount",
              className: "pl-8 bg-white/5 border-white/10 text-white",
              autoFocus: true
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleAdd,
            className: "btn-3d rounded-xl px-4 py-2 text-xs font-bold text-midnight",
            style: {
              background: 'linear-gradient(135deg, #34D399, #10B981)'
            },
            children: "Add"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setShowAdd(false),
            className: "rounded-xl px-3 py-2 text-xs font-bold text-ink-muted bg-white/5 hover:bg-white/10",
            children: /*#__PURE__*/_jsx(X, {
              size: 14
            })
          })]
        }) : /*#__PURE__*/_jsxs(motion.button, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          onClick: () => setShowAdd(true),
          className: "w-full rounded-xl py-2.5 text-xs font-bold text-emerald-soft bg-emerald/10 border border-emerald/20 hover:bg-emerald/20 transition-colors flex items-center justify-center gap-2",
          children: [/*#__PURE__*/_jsx(Plus, {
            size: 14
          }), " Savings Add Karein"]
        })
      })
    })]
  });
}

/* ──────────────────────────────────────────────────────────────
   Add Goal Modal
   ────────────────────────────────────────────────────────────── */
function AddGoalModal({
  open,
  onClose,
  onAdd
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const reset = () => {
    setSelectedTemplate(null);
    setName('');
    setTarget('');
    setDeadline('');
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleSubmit = () => {
    if (!selectedTemplate) return;
    const finalName = name.trim() || selectedTemplate.label.replace(/^[^ ]+ /, '');
    const finalTarget = parseInt(target, 10) || selectedTemplate.target;
    onAdd({
      id: generateId(),
      name: finalName,
      target: finalTarget,
      saved: 0,
      deadline: deadline || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category: selectedTemplate.color,
      emoji: selectedTemplate.emoji,
      createdAt: new Date().toISOString().split('T')[0]
    });
    reset();
    onClose();
  };
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: o => !o && handleClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "bg-midnight border-white/10 max-w-md",
      children: [/*#__PURE__*/_jsx(DialogTitle, {
        className: "font-display text-xl font-extrabold text-white",
        children: "Naya Goal Banao \uD83C\uDFAF"
      }), /*#__PURE__*/_jsx(DialogDescription, {
        className: "text-ink-muted",
        children: "Pre-built templates ya apna custom goal choose karo!"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-2 gap-2 mt-2",
        children: TEMPLATES.map(t => /*#__PURE__*/_jsxs(motion.button, {
          whileHover: {
            y: -2
          },
          whileTap: {
            scale: 0.97
          },
          onClick: () => {
            setSelectedTemplate(t);
            if (!name) setName(t.label.replace(/^[^ ]+ /, ''));
            if (!target) setTarget(String(t.target));
          },
          className: `relative text-left rounded-xl p-3 border transition-all ${selectedTemplate?.id === t.id ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`,
          style: selectedTemplate?.id === t.id ? {
            boxShadow: `0 0 0 2px ${t.color}80`
          } : {},
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-2xl mb-1",
            children: t.emoji
          }), /*#__PURE__*/_jsx("div", {
            className: "text-xs font-bold text-white",
            children: t.label
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-[10px] text-ink-muted mt-0.5",
            children: ["~", formatINR(t.target)]
          })]
        }, t.id))
      }), selectedTemplate && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 5
        },
        animate: {
          opacity: 1,
          y: 0
        },
        className: "rounded-xl p-3 bg-emerald/5 border border-emerald/20",
        children: /*#__PURE__*/_jsxs("p", {
          className: "text-[11px] text-emerald-soft font-semibold",
          children: ["\uD83D\uDCA1 ", selectedTemplate.hint]
        })
      }), selectedTemplate && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        className: "space-y-3",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-[11px] font-bold text-ink-muted uppercase tracking-wider",
            children: "Goal Ka Naam"
          }), /*#__PURE__*/_jsx(Input, {
            value: name,
            onChange: e => setName(e.target.value),
            placeholder: "Jaise: Goa Trip",
            className: "mt-1 bg-white/5 border-white/10 text-white"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-2",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-[11px] font-bold text-ink-muted uppercase tracking-wider",
              children: "Target \u20B9"
            }), /*#__PURE__*/_jsx(Input, {
              type: "number",
              value: target,
              onChange: e => setTarget(e.target.value),
              placeholder: "15000",
              className: "mt-1 bg-white/5 border-white/10 text-white"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("label", {
              className: "text-[11px] font-bold text-ink-muted uppercase tracking-wider",
              children: "Deadline"
            }), /*#__PURE__*/_jsx(Input, {
              type: "date",
              value: deadline,
              onChange: e => setDeadline(e.target.value),
              className: "mt-1 bg-white/5 border-white/10 text-white"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex gap-2 pt-2",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: handleClose,
          className: "flex-1 rounded-xl py-2.5 text-sm font-bold text-ink-muted bg-white/5 hover:bg-white/10",
          children: "Cancel"
        }), /*#__PURE__*/_jsx("button", {
          onClick: handleSubmit,
          disabled: !selectedTemplate,
          className: "flex-1 btn-3d rounded-xl py-2.5 text-sm font-bold text-midnight disabled:opacity-40 disabled:cursor-not-allowed",
          style: {
            background: 'linear-gradient(135deg, #34D399, #10B981)'
          },
          children: "Goal Set Karo! \uD83D\uDE80"
        })]
      })]
    })
  });
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export function GoalTracker({
  open,
  onClose
}) {
  const {
    goals,
    addGoal,
    updateGoalSaved,
    deleteGoal
  } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const activeGoals = useMemo(() => goals.filter(g => g.saved < g.target), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.saved >= g.target), [goals]);
  const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: o => !o && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative p-5 sm:p-6 border-b border-white/10 glass-card-premium",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald/15 blur-3xl pointer-events-none"
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted",
          "aria-label": "Close",
          children: /*#__PURE__*/_jsx(X, {
            size: 16
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "w-12 h-12 rounded-2xl flex items-center justify-center",
            style: {
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)'
            },
            children: /*#__PURE__*/_jsx(Target, {
              size: 22,
              className: "text-midnight"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-extrabold text-white",
              children: "Goal Tracker \uD83C\uDFAF"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: "Sapne reality banao \u2014 ek goal at a time! \uD83D\uDC9A"
            })]
          })]
        }), goals.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "relative mt-4 flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
              children: "Total Saved"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-extrabold text-emerald-soft",
              children: formatINR(totalSaved)
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "w-px h-8 bg-white/10"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
              children: "Total Target"
            }), /*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-extrabold text-white",
              children: formatINR(totalTarget)
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "w-px h-8 bg-white/10"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
              children: "Progress"
            }), /*#__PURE__*/_jsxs("p", {
              className: "font-display text-lg font-extrabold text-gold-soft",
              children: [totalTarget > 0 ? Math.round(totalSaved / totalTarget * 100) : 0, "%"]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "p-5 sm:p-6 max-h-[65vh] overflow-y-auto",
        children: goals.length === 0 ? /*#__PURE__*/_jsxs("div", {
          className: "text-center py-12",
          children: [/*#__PURE__*/_jsx(motion.div, {
            initial: {
              scale: 0.5,
              opacity: 0
            },
            animate: {
              scale: 1,
              opacity: 1
            },
            className: "text-6xl mb-3",
            children: "\uD83C\uDFAF"
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-display text-lg font-bold text-white mb-1",
            children: "Koi goal nahi hai!"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-ink-muted mb-4",
            children: "Apna pehla financial goal set karo aur achievement ka maza lo! \uD83D\uDE80"
          })]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "space-y-3",
          children: [activeGoals.length > 0 && /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-xs font-bold text-ink-muted uppercase tracking-widest flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(TrendingUp, {
                size: 12,
                className: "text-emerald-soft"
              }), " Active Goals (", activeGoals.length, ")"]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
              children: /*#__PURE__*/_jsx(AnimatePresence, {
                children: activeGoals.map(g => /*#__PURE__*/_jsx(GoalCard, {
                  goal: g,
                  onAdd: updateGoalSaved,
                  onDelete: deleteGoal
                }, g.id))
              })
            })]
          }), completedGoals.length > 0 && /*#__PURE__*/_jsxs("div", {
            className: "pt-4",
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-xs font-bold text-gold-soft uppercase tracking-widest flex items-center gap-2 mb-3",
              children: [/*#__PURE__*/_jsx(PartyPopper, {
                size: 12
              }), " Achieved Goals (", completedGoals.length, ")"]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
              children: /*#__PURE__*/_jsx(AnimatePresence, {
                children: completedGoals.map(g => /*#__PURE__*/_jsx(GoalCard, {
                  goal: g,
                  onAdd: updateGoalSaved,
                  onDelete: deleteGoal
                }, g.id))
              })
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs(motion.button, {
        whileHover: {
          scale: 1.05
        },
        whileTap: {
          scale: 0.95
        },
        onClick: () => setAddOpen(true),
        className: "btn-3d absolute bottom-5 right-5 rounded-2xl px-5 py-3 font-bold text-sm text-midnight flex items-center gap-2 shadow-2xl",
        style: {
          background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
        },
        children: [/*#__PURE__*/_jsx(Plus, {
          size: 18
        }), " Naya Goal"]
      }), /*#__PURE__*/_jsx(AddGoalModal, {
        open: addOpen,
        onClose: () => setAddOpen(false),
        onAdd: addGoal
      })]
    })
  });
}