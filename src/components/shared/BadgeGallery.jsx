'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { BADGES, TOTAL_BADGES, TIER_COLORS, getRarestBadges, getBadgesByCategory } from '@/lib/data/badges';

// ── Category tab definition ────────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const TABS = [{
  key: 'all',
  label: 'All',
  emoji: '✨'
}, {
  key: 'learning',
  label: 'Learning',
  emoji: '📚'
}, {
  key: 'streak',
  label: 'Streaks',
  emoji: '🔥'
}, {
  key: 'strategy',
  label: 'Strategies',
  emoji: '🎮'
}, {
  key: 'special',
  label: 'Special',
  emoji: '⭐'
}];

// ── Tier ring colour helper ────────────────────────────────────────────────
const TIER_RING = {
  bronze: 'from-[#CD7F32] to-[#8B4513]',
  silver: 'from-[#E5E7EB] to-[#9CA3AF]',
  gold: 'from-[#FBBF24] to-[#D97706]',
  diamond: 'from-[#A78BFA] to-[#7C3AED]'
};

// ── Single Badge Cell ──────────────────────────────────────────────────────
function BadgeCell({
  badge,
  earned,
  index
}) {
  const [showTip, setShowTip] = useState(false);
  const tierColor = TIER_COLORS[badge.tier];
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      scale: 0.6,
      y: 12
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    transition: {
      delay: Math.min(index * 0.025, 0.6),
      type: 'spring',
      stiffness: 260,
      damping: 20
    },
    className: "relative flex flex-col items-center text-center group",
    onMouseEnter: () => setShowTip(true),
    onMouseLeave: () => setShowTip(false),
    onFocus: () => setShowTip(true),
    onBlur: () => setShowTip(false),
    children: [earned && /*#__PURE__*/_jsx("span", {
      className: "absolute -top-1 -right-1 z-10 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
      style: {
        color: tierColor.ring,
        backgroundColor: `${tierColor.ring}1A`,
        border: `1px solid ${tierColor.ring}55`
      },
      children: tierColor.label
    }), /*#__PURE__*/_jsxs("div", {
      className: `
          relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
          ${earned ? `bg-gradient-to-br ${TIER_RING[badge.tier]} shadow-lg group-hover:shadow-2xl badge-3d-spin` : 'bg-white/[0.03] border border-white/[0.06]'}
          transition-all duration-300
        `,
      style: earned ? {
        boxShadow: `0 0 20px ${tierColor.glow}, inset 0 0 14px rgba(255,255,255,0.18)`
      } : undefined,
      children: [earned ? /*#__PURE__*/_jsx("span", {
        className: "text-2xl sm:text-3xl drop-shadow-lg select-none",
        style: {
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))'
        },
        children: badge.emoji
      }) : /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center gap-0.5",
        children: [/*#__PURE__*/_jsx(Lock, {
          className: "w-4 h-4 sm:w-5 sm:h-5 text-white/25"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[9px] text-white/25",
          children: "?"
        })]
      }), earned && /*#__PURE__*/_jsx("span", {
        className: "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        style: {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)',
          mixBlendMode: 'overlay'
        }
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: `mt-2 text-[10px] sm:text-xs font-bold leading-tight ${earned ? 'text-ink' : 'text-white/30'}`,
      children: earned ? badge.name : '???'
    }), earned && /*#__PURE__*/_jsxs("div", {
      className: "text-[9px] text-gold-soft font-semibold mt-0.5 flex items-center gap-0.5",
      children: [/*#__PURE__*/_jsx("span", {
        className: "text-gold",
        children: "\uD83E\uDE99"
      }), " +", badge.rewardCoins]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showTip && !earned && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 6,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 6,
          scale: 0.95
        },
        transition: {
          duration: 0.15
        },
        className: "absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 w-44 p-2.5 rounded-xl glass-strong shadow-xl pointer-events-none",
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-[10px] uppercase tracking-wider text-emerald-soft font-bold mb-1",
          children: "\uD83D\uDD13 Kaise khole?"
        }), /*#__PURE__*/_jsx("div", {
          className: "text-[11px] text-ink leading-snug",
          children: badge.requirement
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-1.5 flex items-center gap-1 text-[10px] text-gold-soft font-semibold",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-gold",
            children: "\uD83E\uDE99"
          }), " +", badge.rewardCoins, " coins"]
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 glass-strong border-r border-b"
        })]
      })
    })]
  });
}

// ── Main BadgeGallery Modal ────────────────────────────────────────────────

export function BadgeGallery({
  open,
  onClose
}) {
  const {
    badges,
    earnedBadges
  } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');

  // Merge both arrays for backward compat
  const earnedSet = useMemo(() => new Set([...badges, ...earnedBadges]), [badges, earnedBadges]);
  const earnedCount = BADGES.filter(b => earnedSet.has(b.id)).length;
  const progressPercent = Math.round(earnedCount / TOTAL_BADGES * 100);

  // Rarest badges (always shown at top — highlights ones still un-earned)
  const rarestBadges = useMemo(() => getRarestBadges().slice(0, 5), []);

  // Filtered badges per active tab
  const visibleBadges = useMemo(() => {
    const list = getBadgesByCategory(activeTab);
    // sort: earned first (by tier diamond→bronze), then unearned
    return list.sort((a, b) => {
      const ae = earnedSet.has(a.id) ? 0 : 1;
      const be = earnedSet.has(b.id) ? 0 : 1;
      if (ae !== be) return ae - be;
      const tierOrder = ['diamond', 'gold', 'silver', 'bronze'];
      return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
  }, [activeTab, earnedSet]);
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: open && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        exit: {
          opacity: 0
        },
        transition: {
          duration: 0.2
        },
        className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-md",
        onClick: onClose
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 40,
          scale: 0.97
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 40,
          scale: 0.97
        },
        transition: {
          type: 'spring',
          stiffness: 380,
          damping: 32
        },
        className: "fixed inset-x-2 top-[4vh] bottom-[4vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl glass-card-premium rounded-3xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "shrink-0 px-5 sm:px-6 py-4 border-b border-white/[0.06]",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2.5",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center shadow-glow-gold",
                children: /*#__PURE__*/_jsx(Trophy, {
                  className: "w-4 h-4 text-gold"
                })
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h2", {
                  className: "text-base font-bold font-display text-ink heading-gradient inline-block",
                  children: "Badge Trophy Wall"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-ink-muted",
                  children: "Achievements unlock karo seekhte time!"
                })]
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: onClose,
              className: "p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors",
              "aria-label": "Close badge gallery",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex items-center gap-3",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex-1",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between mb-1.5",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "text-[11px] font-semibold text-ink-muted",
                  children: [earnedCount, "/", TOTAL_BADGES, " Badges Earned \uD83C\uDFC6"]
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-[11px] font-bold text-gold-soft",
                  children: [progressPercent, "%"]
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "h-2.5 rounded-full bg-white/[0.05] overflow-hidden",
                children: /*#__PURE__*/_jsx(motion.div, {
                  className: "h-full rounded-full",
                  style: {
                    background: 'linear-gradient(90deg, #34D399, #F59E0B, #A78BFA)'
                  },
                  initial: {
                    width: 0
                  },
                  animate: {
                    width: `${progressPercent}%`
                  },
                  transition: {
                    type: 'spring',
                    stiffness: 280,
                    damping: 25,
                    delay: 0.15
                  }
                })
              })]
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5 scrollbar-none",
          children: [/*#__PURE__*/_jsxs("section", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-2.5",
              children: [/*#__PURE__*/_jsx(Crown, {
                className: "w-3.5 h-3.5 text-gold"
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-xs font-bold uppercase tracking-wider text-ink-muted",
                children: "Rarest Badges"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[10px] text-gold-soft font-semibold",
                children: "(sirf kuch % logon ne paaya)"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-5 gap-2 p-3 rounded-2xl glass-card border border-gold/15",
              children: rarestBadges.map((badge, i) => {
                const earned = earnedSet.has(badge.id);
                return /*#__PURE__*/_jsx(BadgeCell, {
                  badge: badge,
                  earned: earned,
                  index: i
                }, badge.id);
              })
            })]
          }), /*#__PURE__*/_jsx("section", {
            children: /*#__PURE__*/_jsx("div", {
              className: "flex items-center gap-1.5 flex-wrap",
              children: TABS.map(tab => {
                const isActive = activeTab === tab.key;
                const count = tab.key === 'all' ? TOTAL_BADGES : BADGES.filter(b => b.category === tab.key).length;
                const earnedInTab = tab.key === 'all' ? earnedCount : BADGES.filter(b => b.category === tab.key && earnedSet.has(b.id)).length;
                return /*#__PURE__*/_jsxs("button", {
                  onClick: () => setActiveTab(tab.key),
                  className: `
                          px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                          flex items-center gap-1.5
                          ${isActive ? 'bg-emerald/15 text-emerald-soft border border-emerald/30 shadow-glow-emerald' : 'text-ink-muted hover:text-ink hover:bg-white/5 border border-white/[0.06]'}
                        `,
                  children: [/*#__PURE__*/_jsx("span", {
                    children: tab.emoji
                  }), /*#__PURE__*/_jsx("span", {
                    children: tab.label
                  }), /*#__PURE__*/_jsxs("span", {
                    className: `text-[10px] ${isActive ? 'text-emerald-soft/80' : 'text-ink-muted/70'}`,
                    children: [earnedInTab, "/", count]
                  })]
                }, tab.key);
              })
            })
          }), /*#__PURE__*/_jsx("section", {
            children: /*#__PURE__*/_jsx(AnimatePresence, {
              mode: "wait",
              children: /*#__PURE__*/_jsx(motion.div, {
                initial: {
                  opacity: 0,
                  y: 8
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                exit: {
                  opacity: 0,
                  y: -8
                },
                transition: {
                  duration: 0.2
                },
                className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 pb-2",
                children: visibleBadges.map((badge, i) => /*#__PURE__*/_jsx(BadgeCell, {
                  badge: badge,
                  earned: earnedSet.has(badge.id),
                  index: i
                }, badge.id))
              }, activeTab)
            })
          }), earnedCount === 0 && /*#__PURE__*/_jsxs("div", {
            className: "text-center p-5 rounded-2xl glass-card border border-white/[0.05]",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-7 h-7 text-gold/60 mx-auto mb-2"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted",
              children: "Abhi koi badge nahi mila. Modules complete karo, streaks banao, strategies khelo \u2014 badges apne aap aayenge!"
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "shrink-0 px-5 sm:px-6 py-3 border-t border-white/[0.06] bg-midnight/40",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between text-[11px] text-ink-muted",
            children: [/*#__PURE__*/_jsxs("span", {
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-emerald-soft font-semibold",
                children: earnedCount
              }), " earned \xB7", ' ', /*#__PURE__*/_jsx("span", {
                className: "text-gold-soft font-semibold",
                children: TOTAL_BADGES - earnedCount
              }), " baaki"]
            }), /*#__PURE__*/_jsx("button", {
              onClick: onClose,
              className: "px-4 py-1.5 rounded-lg bg-emerald/15 hover:bg-emerald/25 text-emerald-soft font-semibold transition-colors btn-3d",
              children: "Band karo"
            })]
          })
        })]
      })]
    })
  });
}