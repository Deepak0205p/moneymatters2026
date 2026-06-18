'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Construction, Flame, Trophy, Coins, CheckCircle2, Lock, RotateCcw, Share2, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { modules } from '@/lib/data/modules';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgressRing from '@/components/shared/ProgressRing';
import { ShareProgress } from '@/components/shared/ShareProgress';
import { AchievementDashboard } from '@/components/shared/AchievementDashboard';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function getIcon(iconName) {
  if (!iconName) return Construction;
  const Icon = LucideIcons[iconName];
  return Icon || Construction;
}

// Level calculation based on modules completed
function getLevel(completed) {
  if (completed >= 11) return {
    level: 5,
    label: 'Master',
    color: '#F59E0B'
  };
  if (completed >= 8) return {
    level: 4,
    label: 'Expert',
    color: '#10B981'
  };
  if (completed >= 5) return {
    level: 3,
    label: 'Pro',
    color: '#8B5CF6'
  };
  if (completed >= 2) return {
    level: 2,
    label: 'Learner',
    color: '#38BDF8'
  };
  return {
    level: 1,
    label: 'Beginner',
    color: '#94A3B8'
  };
}
const moduleVariants = {
  hidden: {
    opacity: 0,
    x: -8
  },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};
export function Sidebar() {
  const {
    activeModule,
    setActiveModule,
    coins,
    streak,
    resetProgress
  } = useAppStore();
  const {
    getModuleProgress,
    isModuleCompleted,
    modulesCompleted,
    completionPercentage
  } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const level = useMemo(() => getLevel(modulesCompleted), [modulesCompleted]);
  const dailyQuote = ['Paise ki samajh, sabse badi taakat', 'Chhota bhi bahut hota hai — SIP se dekho', 'Budget banao, azadi pao', 'Aaj ka paisa, kal ka asset'][Math.floor(Date.now() / 86400000) % 4];
  return /*#__PURE__*/_jsxs("aside", {
    className: "hidden md:flex flex-col w-72 h-[calc(100vh-3.5rem)] mt-14 shrink-0 glass-strong border-r border-white/[0.06]",
    role: "complementary",
    "aria-label": "Module sidebar",
    children: [/*#__PURE__*/_jsx("div", {
      className: "shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.06]",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsx(ProgressRing, {
            progress: completionPercentage,
            size: 48,
            strokeWidth: 4
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 rounded-full opacity-25 blur-md pointer-events-none",
            style: {
              background: `radial-gradient(circle, ${level.color}50, transparent 70%)`
            }
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/_jsx("h2", {
            className: "text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-0.5",
            children: "Your Journey"
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-lg font-bold text-ink",
            children: [completionPercentage, "%", ' ', /*#__PURE__*/_jsx("span", {
              className: "text-xs font-normal text-ink-muted",
              children: "complete"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 mt-1",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              style: {
                backgroundColor: `${level.color}20`,
                color: level.color,
                boxShadow: `0 0 8px ${level.color}30`
              },
              children: ["Lvl ", level.level]
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] text-ink-muted font-medium",
              children: level.label
            })]
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(ScrollArea, {
      className: "flex-1",
      children: /*#__PURE__*/_jsxs("div", {
        className: "p-3 space-y-1",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "px-3 py-2 mb-1 flex items-center justify-between",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "text-[10px] font-semibold text-ink-muted uppercase tracking-widest",
            children: "Modules"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-[9px] text-ink-muted/70 tabular-nums",
            children: [modulesCompleted, "/", modules.length]
          })]
        }), modules.map((mod, index) => {
          const Icon = getIcon(mod.icon);
          const progress = getModuleProgress(mod.id);
          const completed = isModuleCompleted(mod.id);
          const isActive = activeModule === mod.id;
          const isLocked = index > 0 && !isModuleCompleted(modules[index - 1].id) && progress === 0;
          const isCurrent = !completed && !isLocked;
          return /*#__PURE__*/_jsxs(motion.button, {
            custom: index,
            variants: moduleVariants,
            initial: "hidden",
            animate: "visible",
            onClick: () => !isLocked && setActiveModule(mod.id),
            disabled: isLocked,
            className: cn('w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all module-item-hover hover-card-scale', isActive && 'bg-emerald/10 border border-emerald/25', !isActive && 'border border-transparent', completed && !isActive && 'hover:bg-emerald/5', !completed && isCurrent && !isActive && 'hover:bg-white/[0.04]', isLocked && 'opacity-40 cursor-not-allowed hover:opacity-50'),
            whileHover: !isLocked ? {
              x: 4
            } : undefined,
            whileTap: !isLocked ? {
              scale: 0.98
            } : undefined,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25
            },
            "aria-label": `${mod.title} — ${progress}% complete${completed ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}`,
            "aria-disabled": isLocked,
            children: [/*#__PURE__*/_jsx("div", {
              className: "relative shrink-0",
              children: /*#__PURE__*/_jsxs("div", {
                className: cn('w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative', completed && 'bg-emerald/15', isCurrent && !completed && 'bg-emerald/10', !isCurrent && !completed && !isLocked && 'bg-white/[0.06]', isLocked && 'bg-white/[0.02]'),
                children: [completed ? /*#__PURE__*/_jsx(CheckCircle2, {
                  className: "w-4 h-4 text-emerald-soft"
                }) : isLocked ? /*#__PURE__*/_jsx(Lock, {
                  className: "w-3.5 h-3.5 text-ink-muted/50"
                }) : /*#__PURE__*/_jsx(Icon, {
                  className: cn('w-4 h-4', isCurrent ? 'text-emerald-soft' : 'text-ink-muted')
                }), /*#__PURE__*/_jsx("span", {
                  className: "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-midnight",
                  style: {
                    backgroundColor: isLocked ? '#475569' : mod.color
                  }
                })]
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 min-w-0",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between mb-1",
                children: [/*#__PURE__*/_jsx("span", {
                  className: cn('text-xs font-medium truncate', completed && 'text-emerald-soft', isCurrent && !completed && 'text-ink', !isCurrent && !completed && 'text-ink-muted'),
                  children: mod.title
                }), /*#__PURE__*/_jsxs("span", {
                  className: cn('text-[10px] ml-2 shrink-0 tabular-nums font-medium', completed && 'text-emerald-soft/80', isCurrent && !completed && 'text-emerald/80', !isCurrent && !completed && 'text-ink-muted/60'),
                  children: [progress, "%"]
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "h-1 rounded-full overflow-hidden bg-white/[0.06]",
                children: /*#__PURE__*/_jsx(motion.div, {
                  className: cn('h-full rounded-full', completed ? 'bg-gradient-to-r from-emerald-soft to-emerald' : 'bg-gradient-to-r from-emerald-soft via-emerald to-emerald-deep'),
                  initial: {
                    width: 0
                  },
                  animate: {
                    width: `${progress}%`
                  },
                  transition: {
                    duration: 0.6,
                    ease: 'easeOut'
                  }
                })
              }), isLocked && index > 0 && /*#__PURE__*/_jsxs("p", {
                className: "text-[9px] text-ink-muted/60 mt-1 truncate",
                children: ["Pehle ", modules[index - 1].title, " khatam karo"]
              })]
            })]
          }, mod.id);
        })]
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "shrink-0 border-t border-white/[0.06] px-4 pt-3 pb-0",
      children: [/*#__PURE__*/_jsxs(motion.button, {
        onClick: () => setShowDashboard(true),
        className: "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald/10 to-ai/5 border border-emerald/20 text-emerald-soft font-semibold text-xs hover:from-emerald/15 hover:to-ai/10 transition-all corner-accent",
        whileHover: {
          scale: 1.02
        },
        whileTap: {
          scale: 0.98
        },
        "aria-label": "Open Achievement Dashboard",
        children: [/*#__PURE__*/_jsx(LayoutDashboard, {
          size: 16
        }), "Dashboard dekho"]
      }), /*#__PURE__*/_jsx("div", {
        className: "px-0 pb-2 pt-1",
        children: /*#__PURE__*/_jsxs("p", {
          className: "text-[9px] text-ink-muted/70 italic text-center",
          children: ["\u201C", dailyQuote, "\u201D"]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "shrink-0 border-t border-white/[0.06] px-4 py-3",
      children: [/*#__PURE__*/_jsx("h3", {
        className: "text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-2",
        children: "Today's Activity"
      }), /*#__PURE__*/_jsx("div", {
        className: "flex items-center gap-2",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 mb-1.5",
            children: [/*#__PURE__*/_jsx(Flame, {
              className: "w-3 h-3 text-orange-400"
            }), /*#__PURE__*/_jsxs("span", {
              className: "streak-fire text-[10px] text-orange-400 font-semibold",
              children: [streak, " day streak"]
            }), streak > 0 && /*#__PURE__*/_jsx("span", {
              className: "badge-pulse text-[9px] bg-orange-400/20 text-orange-400 px-1 rounded-full",
              children: streak
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "h-1 rounded-full bg-white/[0.06] overflow-hidden",
            children: /*#__PURE__*/_jsx("div", {
              className: "h-full bg-gradient-to-r from-orange-400 to-gold rounded-full transition-all",
              style: {
                width: `${Math.min(streak / 7 * 100, 100)}%`
              }
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[8px] text-ink-muted/60 mt-0.5 block",
            children: streak >= 7 ? '🔥 Next: 30 day streak!' : `${7 - streak} days to 7-day badge`
          })]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "shrink-0 border-t border-white/[0.06] p-4 space-y-3",
      children: [/*#__PURE__*/_jsx("h3", {
        className: "text-[10px] font-semibold text-ink-muted uppercase tracking-widest",
        children: "Quick Stats"
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-3 gap-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "card-shine stat-card rounded-xl p-2.5 text-center group hover:bg-gold/[0.08] transition-colors",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex items-center justify-center mb-1",
            children: /*#__PURE__*/_jsx(Coins, {
              className: "w-3.5 h-3.5 text-gold-soft"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "text-sm font-bold text-gold-soft tabular-nums",
            children: coins
          }), /*#__PURE__*/_jsx("div", {
            className: "text-[9px] text-ink-muted font-medium",
            children: "XP"
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden",
            children: /*#__PURE__*/_jsx("div", {
              className: "h-full bg-gold/60 rounded-full transition-all",
              style: {
                width: `${Math.min(coins % 50 / 50 * 100, 100)}%`
              }
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "card-shine stat-card rounded-xl p-2.5 text-center group hover:bg-orange-400/[0.08] transition-colors",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex items-center justify-center mb-1",
            children: /*#__PURE__*/_jsx(Flame, {
              className: "w-3.5 h-3.5 text-orange-400"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "text-sm font-bold text-orange-400 tabular-nums",
            children: streak
          }), /*#__PURE__*/_jsx("div", {
            className: "text-[9px] text-ink-muted font-medium",
            children: "Streak"
          }), /*#__PURE__*/_jsxs("div", {
            className: "mt-1 flex justify-center gap-[2px]",
            children: [Array.from({
              length: Math.min(streak, 5)
            }).map((_, i) => /*#__PURE__*/_jsx("span", {
              className: "w-1 h-1.5 rounded-full bg-orange-400/70"
            }, i)), Array.from({
              length: Math.max(0, 5 - streak)
            }).map((_, i) => /*#__PURE__*/_jsx("span", {
              className: "w-1 h-1.5 rounded-full bg-white/[0.08]"
            }, `e-${i}`))]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "card-shine stat-card rounded-xl p-2.5 text-center group hover:bg-emerald/[0.08] transition-colors",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex items-center justify-center mb-1",
            children: /*#__PURE__*/_jsx(Trophy, {
              className: "w-3.5 h-3.5 text-emerald-soft"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "text-sm font-bold text-emerald-soft tabular-nums",
            children: modulesCompleted
          }), /*#__PURE__*/_jsx("div", {
            className: "text-[9px] text-ink-muted font-medium",
            children: "Done"
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden",
            children: /*#__PURE__*/_jsx("div", {
              className: "h-full bg-emerald/60 rounded-full transition-all",
              style: {
                width: `${modulesCompleted / 11 * 100}%`
              }
            })
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "pt-1 flex justify-center",
        children: !showResetConfirm ? /*#__PURE__*/_jsxs("button", {
          onClick: () => setShowResetConfirm(true),
          className: "flex items-center gap-1 text-[10px] text-ink-muted/60 hover:text-ink-muted transition-colors",
          "aria-label": "Reset all progress",
          children: [/*#__PURE__*/_jsx(RotateCcw, {
            className: "w-2.5 h-2.5"
          }), "Reset Progress"]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[10px] text-red-400",
            children: "Sure?"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => {
              resetProgress();
              setShowResetConfirm(false);
            },
            className: "text-[10px] text-red-400 font-semibold hover:text-red-300 transition-colors",
            "aria-label": "Confirm reset progress",
            children: "Yes, Reset"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setShowResetConfirm(false),
            className: "text-[10px] text-ink-muted hover:text-ink transition-colors",
            "aria-label": "Cancel reset",
            children: "Cancel"
          })]
        })
      }), /*#__PURE__*/_jsxs(motion.button, {
        onClick: () => setShowShare(true),
        className: "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-gold/10 to-gold-deep/10 border border-gold/20 text-gold-soft font-semibold text-xs hover:from-gold/20 hover:to-gold-deep/20 transition-all gradient-border-fade",
        whileHover: {
          scale: 1.02
        },
        whileTap: {
          scale: 0.98
        },
        "aria-label": "Share your progress",
        children: [/*#__PURE__*/_jsx(Share2, {
          size: 14
        }), "Share Progress"]
      })]
    }), /*#__PURE__*/_jsx(ShareProgress, {
      open: showShare,
      onClose: () => setShowShare(false)
    }), /*#__PURE__*/_jsx(AchievementDashboard, {
      open: showDashboard,
      onClose: () => setShowDashboard(false)
    })]
  });
}