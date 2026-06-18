'use client';

import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Sparkles } from 'lucide-react';
import { TIER_COLORS } from '@/lib/data/badges';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ── Confetti pieces ────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#34D399', '#FBBF24', '#A78BFA'];
const CONFETTI_COUNT = 36;
function ConfettiLayer() {
  const pieces = useMemo(() => Array.from({
    length: CONFETTI_COUNT
  }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.4,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    rotate: Math.random() * 360,
    shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'rect'
  })), []);
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 pointer-events-none overflow-hidden",
    children: pieces.map(p => /*#__PURE__*/_jsx("div", {
      className: "confetti-piece",
      style: {
        left: `${p.left}%`,
        top: '-20px',
        width: p.shape === 'rect' ? p.size * 0.4 : p.size,
        height: p.shape === 'rect' ? p.size * 1.4 : p.size,
        backgroundColor: p.color,
        borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '0',
        transform: `rotate(${p.rotate}deg)`,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`
      }
    }, p.id))
  });
}

// ── Golden particle burst ──────────────────────────────────────────────────
function ParticleBurst() {
  const particles = useMemo(() => Array.from({
    length: 18
  }, (_, i) => {
    const angle = i / 18 * Math.PI * 2;
    const distance = 80 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: Math.random() * 0.2,
      size: 4 + Math.random() * 6
    };
  }), []);
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 flex items-center justify-center pointer-events-none",
    children: particles.map(p => /*#__PURE__*/_jsx(motion.span, {
      className: "absolute rounded-full",
      style: {
        width: p.size,
        height: p.size,
        background: 'radial-gradient(circle, #FBBF24 0%, #F59E0B 60%, transparent 100%)',
        boxShadow: '0 0 12px rgba(245, 158, 11, 0.7)'
      },
      initial: {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0
      },
      animate: {
        x: p.x,
        y: p.y,
        scale: [0, 1.2, 0.6],
        opacity: [0, 1, 0]
      },
      transition: {
        duration: 1.2,
        delay: 0.5 + p.delay,
        ease: 'easeOut'
      }
    }, p.id))
  });
}

// ── Main component ─────────────────────────────────────────────────────────
export function BadgeEarnAnimation({
  badge,
  onClose
}) {
  const autoTimer = useRef(null);
  useEffect(() => {
    if (!badge) return;
    autoTimer.current = setTimeout(() => {
      onClose();
    }, 5000);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [badge, onClose]);
  const handleShare = async () => {
    if (!badge) return;
    const text = `Mujhe naya badge mila: ${badge.name} ${badge.emoji} — Money Matters app pe! Tum bhi seekho: ${badge.description}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Money Matters Badge',
          text
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* user cancelled — no-op */
    }
  };
  const tierColor = badge ? TIER_COLORS[badge.tier] : null;
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: badge && tierColor && /*#__PURE__*/_jsxs(motion.div, {
      className: "fixed inset-0 z-[120] flex items-center justify-center p-4",
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
        duration: 0.25
      },
      children: [/*#__PURE__*/_jsx(motion.div, {
        className: "absolute inset-0 bg-black/80 backdrop-blur-md",
        onClick: onClose
      }), /*#__PURE__*/_jsx(ConfettiLayer, {}), /*#__PURE__*/_jsxs(motion.div, {
        className: "relative w-full max-w-sm glass-card-premium rounded-3xl overflow-hidden shadow-2xl shadow-black/60",
        initial: {
          y: -300,
          opacity: 0,
          rotateY: 0,
          scale: 0.6
        },
        animate: {
          y: 0,
          opacity: 1,
          rotateY: [0, 360],
          scale: 1
        },
        transition: {
          y: {
            type: 'spring',
            stiffness: 240,
            damping: 22
          },
          opacity: {
            duration: 0.3
          },
          rotateY: {
            duration: 0.9,
            ease: 'easeInOut',
            delay: 0.2
          },
          scale: {
            type: 'spring',
            stiffness: 200,
            damping: 18
          }
        },
        style: {
          transformStyle: 'preserve-3d',
          perspective: 1000
        },
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-32 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none",
          style: {
            background: tierColor.glow
          }
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          className: "absolute top-3 right-3 z-10 p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors",
          "aria-label": "Close badge animation",
          children: /*#__PURE__*/_jsx(Check, {
            className: "w-4 h-4"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "relative pt-7 pb-2 text-center",
          children: /*#__PURE__*/_jsxs("span", {
            className: "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
            style: {
              color: tierColor.ring,
              backgroundColor: `${tierColor.ring}1A`,
              border: `1px solid ${tierColor.ring}55`
            },
            children: [tierColor.label, " Badge"]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative h-40 flex items-center justify-center",
          children: [/*#__PURE__*/_jsx(ParticleBurst, {}), /*#__PURE__*/_jsx(motion.div, {
            className: "relative w-32 h-32 rounded-full flex items-center justify-center",
            style: {
              background: `radial-gradient(circle at 30% 30%, ${tierColor.ring}cc, ${tierColor.ring}66 60%, ${tierColor.ring}33 100%)`,
              boxShadow: `0 0 40px ${tierColor.glow}, inset 0 0 20px rgba(255,255,255,0.2)`
            },
            initial: {
              scale: 0,
              rotate: -180
            },
            animate: {
              scale: 1,
              rotate: 0
            },
            transition: {
              delay: 0.6,
              type: 'spring',
              stiffness: 200,
              damping: 14
            },
            children: /*#__PURE__*/_jsx(motion.span, {
              className: "text-6xl select-none",
              style: {
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
              },
              animate: {
                y: [0, -6, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              children: badge.emoji
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative px-6 pb-6 text-center",
          children: [/*#__PURE__*/_jsxs(motion.div, {
            className: "flex items-center justify-center gap-1.5 mb-1",
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
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-4 h-4 text-gold"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] font-bold uppercase tracking-widest text-gold-soft",
              children: "Nayi Badge Mili!"
            }), /*#__PURE__*/_jsx(Sparkles, {
              className: "w-4 h-4 text-gold"
            })]
          }), /*#__PURE__*/_jsx(motion.h2, {
            className: "font-display text-2xl font-extrabold text-ink heading-gradient mb-1",
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 1.0
            },
            children: badge.name
          }), /*#__PURE__*/_jsx(motion.p, {
            className: "text-sm text-ink-muted leading-snug mb-4",
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 1.15
            },
            children: badge.description
          }), /*#__PURE__*/_jsxs(motion.div, {
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
            style: {
              background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.08))',
              border: '1px solid rgba(245,158,11,0.3)'
            },
            initial: {
              opacity: 0,
              scale: 0.8
            },
            animate: {
              opacity: 1,
              scale: 1
            },
            transition: {
              delay: 1.3,
              type: 'spring',
              stiffness: 280,
              damping: 18
            },
            children: [/*#__PURE__*/_jsx(motion.span, {
              className: "text-xl",
              animate: {
                rotateY: [0, 180, 360]
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              children: "\uD83E\uDE99"
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-base font-extrabold text-gold-soft tabular-nums",
              children: ["+", badge.rewardCoins]
            }), /*#__PURE__*/_jsx("span", {
              className: "text-xs font-semibold text-gold-soft/80",
              children: "Coins"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex gap-2.5",
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: handleShare,
              className: "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-ink hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5",
              children: [/*#__PURE__*/_jsx(Share2, {
                className: "w-3.5 h-3.5"
              }), "Share"]
            }), /*#__PURE__*/_jsx("button", {
              onClick: onClose,
              className: "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold btn-3d",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                color: '#0B1220'
              },
              children: "OK"
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-3 text-[10px] text-ink-muted/60",
            children: "5 second mein auto-close ho jaayega"
          })]
        })]
      })]
    })
  });
}