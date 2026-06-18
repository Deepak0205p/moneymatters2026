"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Clock } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   Wheel Segments
   ────────────────────────────────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SEGMENTS = [{
  id: 'c50',
  label: '+50 Coins',
  emoji: '🪙',
  color: '#F59E0B',
  type: 'coins',
  coinAmount: 50
}, {
  id: 'tip',
  label: 'Financial Tip',
  emoji: '💡',
  color: '#3B82F6',
  type: 'tip'
}, {
  id: 'c100',
  label: '+100 Coins',
  emoji: '💰',
  color: '#10B981',
  type: 'coins',
  coinAmount: 100
}, {
  id: 'badge',
  label: 'Mystery Badge',
  emoji: '🎁',
  color: '#8B5CF6',
  type: 'badge'
}, {
  id: 'c25',
  label: '+25 Coins',
  emoji: '🪙',
  color: '#FCD34D',
  type: 'coins',
  coinAmount: 25
}, {
  id: 'shield',
  label: 'Streak Shield',
  emoji: '🛡️',
  color: '#06B6D4',
  type: 'shield'
}, {
  id: 'unlock',
  label: 'Tool Unlock',
  emoji: '🔓',
  color: '#EC4899',
  type: 'unlock'
}, {
  id: 'retry',
  label: 'Better Luck!',
  emoji: '😅',
  color: '#64748B',
  type: 'retry'
}];
const TIPS = ['SIP mein consistency > timing. Regular invest karo!', 'Emergency fund = 6 mahine ka kharcha. Pehle yeh!', 'Credit card ka hamesha full pay karo — minimum = trap!', '50-30-20 rule: Needs 50%, Wants 30%, Savings 20%.', 'Insurance zaroori hai — medical emergency = savings killer!', 'FD se MF better — long-term mein returns zyada.', 'Lifestyle inflation se bacho — income badhi to kharcha nahi.', 'Tax saving ke liye PPF aur ELSS best options hain.'];
const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

/* ──────────────────────────────────────────────────────────────
   Confetti burst
   ────────────────────────────────────────────────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({
    length: 36
  }, (_, i) => i);
  const colors = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none z-50",
    children: pieces.map(i => /*#__PURE__*/_jsx("div", {
      className: "confetti-piece",
      style: {
        left: `${Math.random() * 100}%`,
        top: '-20px',
        backgroundColor: colors[i % colors.length],
        animationDelay: `${Math.random() * 0.6}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }
    }, i))
  });
}

/* ──────────────────────────────────────────────────────────────
   Format ms countdown → "23h 45m"
   ────────────────────────────────────────────────────────────── */
function formatCountdown(ms) {
  if (ms <= 0) return 'Abhi spin kar sakte ho!';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor(totalSec % 3600 / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ──────────────────────────────────────────────────────────────
   History entry
   ────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export function SpinWheel({
  open,
  onClose
}) {
  const {
    lastSpinTime,
    totalSpins,
    spinWinnings,
    setLastSpinTime,
    incrementTotalSpins,
    addSpinWinnings,
    addBadge,
    addCoins
  } = useAppStore();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [history, setHistory] = useState([]);
  const tickRef = useRef(null);

  // Tick for countdown
  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [open]);
  const cooldownLeft = Math.max(0, DAILY_COOLDOWN - (now - lastSpinTime));
  const canSpin = cooldownLeft === 0 && !spinning;
  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);

    // Pick random segment
    const winIdx = Math.floor(Math.random() * SEG_COUNT);
    const winningSegment = SEGMENTS[winIdx];

    // Calculate target rotation
    // We want the winning segment to land at the top pointer (12 o'clock position)
    // Each segment spans SEG_ANGLE degrees. Segment i center is at i*SEG_ANGLE + SEG_ANGLE/2.
    // We rotate the wheel so that the winning segment's center is at the top (under the pointer).
    // After full rotations, add offset.
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const targetAngle = 360 - (winIdx * SEG_ANGLE + SEG_ANGLE / 2);
    const newRotation = rotation + fullSpins * 360 + (targetAngle - rotation % 360);
    setRotation(newRotation);

    // After spin animation completes (~4.5s)
    setTimeout(() => {
      setSpinning(false);
      setResult(winningSegment);
      setLastSpinTime(Date.now());
      incrementTotalSpins();

      // Apply reward
      if (winningSegment.type === 'coins' && winningSegment.coinAmount) {
        addSpinWinnings(winningSegment.coinAmount);
      } else if (winningSegment.type === 'badge') {
        addBadge(`mystery-badge-${Date.now()}`);
        addCoins(20); // small coin reward
      } else if (winningSegment.type === 'shield') {
        addBadge('streak-shield');
        addCoins(20);
      }

      // Add to history
      const entry = {
        id: `spin-${Date.now()}`,
        emoji: winningSegment.emoji,
        label: winningSegment.label,
        color: winningSegment.color,
        time: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setHistory(h => [entry, ...h].slice(0, 8));

      // Show confetti for winning segments
      if (winningSegment.type !== 'retry') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4500);
  }, [canSpin, spinning, rotation, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins]);
  const handleClaim = useCallback(() => {
    setResult(null);
  }, []);
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: o => !o && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "bg-midnight border-white/10 max-w-md p-0 overflow-hidden",
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
            children: /*#__PURE__*/_jsx(Gift, {
              size: 20,
              className: "text-midnight"
            })
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              className: "font-display text-xl font-extrabold text-white",
              children: "Fortune Ka Daur \uD83C\uDFA1"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted mt-0.5",
              children: "Roz ek free spin \u2014 coins, badges aur surprises!"
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "p-5 max-h-[72vh] overflow-y-auto",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative w-full aspect-square max-w-xs mx-auto mb-4",
          children: [showConfetti && /*#__PURE__*/_jsx(ConfettiBurst, {}), /*#__PURE__*/_jsx("div", {
            className: "absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-gold drop-shadow-lg"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 rounded-full border-4 border-gold/30 shadow-[0_0_60px_rgba(245,158,11,0.2)]"
          }), /*#__PURE__*/_jsx(motion.div, {
            className: "absolute inset-2 rounded-full overflow-hidden",
            style: {
              background: '#0B1220',
              transformOrigin: 'center',
              rotateY: '0deg'
            },
            animate: {
              rotate: rotation
            },
            transition: {
              duration: 4.5,
              ease: [0.17, 0.67, 0.16, 0.99]
            },
            children: /*#__PURE__*/_jsxs("svg", {
              viewBox: "0 0 200 200",
              className: "w-full h-full",
              children: [SEGMENTS.map((seg, i) => {
                const startAngle = i * SEG_ANGLE - 90;
                const endAngle = (i + 1) * SEG_ANGLE - 90;
                const startRad = startAngle * Math.PI / 180;
                const endRad = endAngle * Math.PI / 180;
                const x1 = 100 + 100 * Math.cos(startRad);
                const y1 = 100 + 100 * Math.sin(startRad);
                const x2 = 100 + 100 * Math.cos(endRad);
                const y2 = 100 + 100 * Math.sin(endRad);
                const path = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
                // Label position
                const midAngle = (startAngle + endAngle) / 2;
                const midRad = midAngle * Math.PI / 180;
                const lx = 100 + 60 * Math.cos(midRad);
                const ly = 100 + 60 * Math.sin(midRad);
                return /*#__PURE__*/_jsxs("g", {
                  children: [/*#__PURE__*/_jsx("path", {
                    d: path,
                    fill: seg.color,
                    stroke: "#0B1220",
                    strokeWidth: "1",
                    opacity: 0.85
                  }), /*#__PURE__*/_jsx("text", {
                    x: lx,
                    y: ly - 4,
                    fill: "white",
                    fontSize: "14",
                    fontWeight: "bold",
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    children: seg.emoji
                  }), /*#__PURE__*/_jsx("text", {
                    x: lx,
                    y: ly + 10,
                    fill: "white",
                    fontSize: "6",
                    fontWeight: "bold",
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    children: seg.label
                  })]
                }, seg.id);
              }), /*#__PURE__*/_jsx("circle", {
                cx: "100",
                cy: "100",
                r: "14",
                fill: "#0B1220",
                stroke: "#F59E0B",
                strokeWidth: "2"
              }), /*#__PURE__*/_jsx("text", {
                x: "100",
                y: "100",
                fill: "#F59E0B",
                fontSize: "14",
                fontWeight: "bold",
                textAnchor: "middle",
                dominantBaseline: "middle",
                children: "\u20B9"
              })]
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-midnight border-2 border-gold flex items-center justify-center text-gold-soft text-xl font-bold shadow-lg pointer-events-none",
            children: "\u20B9"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-center",
          children: canSpin ? /*#__PURE__*/_jsx(motion.button, {
            whileHover: {
              scale: 1.04
            },
            whileTap: {
              scale: 0.96
            },
            onClick: handleSpin,
            disabled: spinning,
            className: "btn-3d rounded-2xl px-10 py-4 font-display text-lg font-extrabold text-midnight inline-flex items-center gap-2 shadow-2xl",
            style: {
              background: spinning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FCD34D, #F59E0B 60%, #D97706)',
              animation: spinning ? 'none' : 'pulse 2s infinite'
            },
            children: spinning ? 'Spinner Chal Raha Hai... 🌀' : 'SPIN! 🎡'
          }) : spinning ? /*#__PURE__*/_jsx("div", {
            className: "rounded-2xl px-8 py-4 bg-white/5 border border-white/10 inline-block",
            children: /*#__PURE__*/_jsx("p", {
              className: "text-sm font-bold text-white",
              children: "Spinner Chal Raha Hai... \uD83C\uDF00"
            })
          }) : /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              scale: 0.95
            },
            animate: {
              scale: 1
            },
            className: "rounded-2xl px-6 py-4 bg-white/5 border border-gold/30 inline-flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Clock, {
              size: 16,
              className: "text-gold-soft"
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-left",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs font-bold text-gold-soft",
                children: "Kal Phir Aana! \u23F0"
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[10px] text-ink-muted",
                children: ["Next spin in ", formatCountdown(cooldownLeft)]
              })]
            })]
          })
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          children: result && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              scale: 0.5,
              y: 20
            },
            animate: {
              opacity: 1,
              scale: 1,
              y: 0
            },
            exit: {
              opacity: 0,
              scale: 0.5
            },
            className: "mt-4 relative rounded-2xl border-2 p-5 text-center overflow-hidden",
            style: {
              borderColor: `${result.color}60`,
              background: `${result.color}15`
            },
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                rotate: 0
              },
              animate: {
                rotate: [0, -10, 10, -10, 0]
              },
              transition: {
                duration: 0.6
              },
              className: "text-5xl mb-2",
              children: result.emoji
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-bold text-ink-muted uppercase tracking-widest",
              children: "Tumhe mila"
            }), /*#__PURE__*/_jsxs("p", {
              className: "font-display text-xl font-extrabold text-white mb-1",
              children: [result.label, "!"]
            }), result.type === 'coins' && result.coinAmount && /*#__PURE__*/_jsxs("p", {
              className: "text-sm font-bold",
              style: {
                color: result.color
              },
              children: ["+", result.coinAmount, " Coins \uD83C\uDF89"]
            }), result.type === 'tip' && /*#__PURE__*/_jsx("div", {
              className: "mt-2 rounded-lg bg-white/5 border border-white/10 p-2",
              children: /*#__PURE__*/_jsx("p", {
                className: "text-[11px] text-white/90",
                children: TIPS[Math.floor(Math.random() * TIPS.length)]
              })
            }), result.type === 'badge' && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ai font-bold",
              children: "Naya badge unlocked! \uD83C\uDF81"
            }), result.type === 'shield' && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-cyan-400 font-bold",
              children: "Streak shield active! \uD83D\uDEE1\uFE0F"
            }), result.type === 'unlock' && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-pink-400 font-bold",
              children: "Premium tool unlocked! \uD83D\uDD13"
            }), result.type === 'retry' && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-ink-muted font-bold",
              children: "Koi baat nahi, kal phir try karo! \uD83D\uDE05"
            }), /*#__PURE__*/_jsx("button", {
              onClick: handleClaim,
              className: "btn-3d mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-midnight",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981)'
              },
              children: "Claim Karo! \u2705"
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-3 gap-2 mt-5",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-extrabold text-white",
              children: totalSpins
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-ink-muted uppercase",
              children: "Total Spins"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-extrabold text-gold-soft",
              children: spinWinnings
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-ink-muted uppercase",
              children: "Coins Won"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center",
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-display text-lg font-extrabold text-emerald-soft",
              children: cooldownLeft === 0 ? '✅' : '⏳'
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[9px] text-ink-muted uppercase",
              children: "Status"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-5",
          children: [/*#__PURE__*/_jsxs("p", {
            className: "text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              size: 12,
              className: "text-ai"
            }), " Spin History"]
          }), history.length === 0 ? /*#__PURE__*/_jsx("p", {
            className: "text-xs text-ink-muted text-center py-4",
            children: "Abhi tak koi spin nahi. Pehla spin karo! \uD83C\uDFA1"
          }) : /*#__PURE__*/_jsx("div", {
            className: "space-y-1.5 max-h-40 overflow-y-auto",
            children: history.map(h => /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                opacity: 0,
                x: -10
              },
              animate: {
                opacity: 1,
                x: 0
              },
              className: "flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-2",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-8 h-8 rounded-lg flex items-center justify-center text-lg",
                style: {
                  backgroundColor: `${h.color}20`,
                  border: `1px solid ${h.color}30`
                },
                children: h.emoji
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex-1 min-w-0",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-xs font-bold text-white truncate",
                  children: h.label
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-ink-muted",
                  children: h.time
                })]
              })]
            }, h.id))
          })]
        })]
      })]
    })
  });
}