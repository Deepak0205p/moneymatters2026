"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { X, ArrowRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * StrategyOnboarding — a multi-step swipeable onboarding popup that
 * slides up when the user clicks "Shuru Karo". Step content can be
 * rich (text, bullets, etc.). Navigation via tap buttons OR swipe.
 */
export function StrategyOnboarding({
  isOpen,
  onClose,
  onStart,
  steps,
  accentColor,
  strategyName,
  rewardCoins
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = steps.length;
  const isLast = current === total - 1;
  const goNext = useCallback(() => {
    if (isLast) return;
    setDirection(1);
    setCurrent(c => Math.min(c + 1, total - 1));
  }, [isLast, total]);
  const goPrev = useCallback(() => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent(c => Math.max(c - 1, 0));
  }, [current]);
  const handleDragEnd = (_, info) => {
    const {
      offset,
      velocity
    } = info;
    const swipeThreshold = 60;
    const swipeVel = 400;
    if (offset.x < -swipeThreshold || velocity.x < -swipeVel) {
      goNext();
    } else if (offset.x > swipeThreshold || velocity.x > swipeVel) {
      goPrev();
    }
  };
  const handleStart = () => {
    onStart();
    setCurrent(0);
    setDirection(0);
  };
  const handleClose = () => {
    setCurrent(0);
    setDirection(0);
    onClose();
  };
  const step = steps[current];
  const variants = {
    enter: dir => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: dir => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0
    })
  };
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: isOpen && step && /*#__PURE__*/_jsxs(motion.div, {
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
      className: "fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${strategyName} onboarding`,
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-midnight/85 backdrop-blur-md",
        onClick: handleClose,
        "aria-hidden": "true"
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          y: '100%',
          opacity: 0.4
        },
        animate: {
          y: 0,
          opacity: 1
        },
        exit: {
          y: '100%',
          opacity: 0.4
        },
        transition: {
          type: 'spring',
          stiffness: 280,
          damping: 30
        },
        className: "relative w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden glass-strong border-t sm:border flex flex-col",
        style: {
          borderColor: `${accentColor}33`,
          boxShadow: `0 -10px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}18, 0 0 60px ${accentColor}14`
        },
        children: [/*#__PURE__*/_jsx("div", {
          "aria-hidden": true,
          className: "absolute top-0 left-0 right-0 h-1",
          style: {
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          }
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2.5 min-w-0",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-2 h-2 rounded-full shrink-0",
              style: {
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`
              }
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display font-bold text-ink text-sm truncate",
              children: strategyName
            }), rewardCoins > 0 && /*#__PURE__*/_jsxs("span", {
              className: "shrink-0 text-[10px] font-semibold text-gold-soft bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5",
              children: ["+", rewardCoins, " \uD83E\uDE99"]
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleClose,
            className: "shrink-0 rounded-lg p-1.5 text-ink-muted hover:text-ink hover:bg-white/5 transition-colors",
            "aria-label": "Close onboarding",
            children: /*#__PURE__*/_jsx(X, {
              className: "size-4"
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 px-5 pt-3 flex items-center justify-between text-[11px] text-ink-muted",
          children: [/*#__PURE__*/_jsxs("span", {
            className: "font-medium",
            children: ["Step ", current + 1, " / ", total]
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleClose,
            className: "font-medium hover:text-ink transition-colors",
            children: "Skip"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 min-h-0 overflow-hidden px-5 py-4 perspective-3d",
          children: /*#__PURE__*/_jsxs(motion.div, {
            custom: direction,
            variants: variants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              type: 'spring',
              stiffness: 320,
              damping: 30
            },
            drag: "x",
            dragConstraints: {
              left: 0,
              right: 0
            },
            dragElastic: 0.6,
            onDragEnd: handleDragEnd,
            className: "flex flex-col items-center text-center select-none",
            style: {
              transformStyle: 'preserve-3d'
            },
            children: [/*#__PURE__*/_jsx(motion.div, {
              animate: {
                y: [0, -4, 0]
              },
              transition: {
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              className: "flex items-center justify-center rounded-3xl mb-4 mt-1",
              style: {
                width: 88,
                height: 88,
                fontSize: 52,
                background: `radial-gradient(circle, ${accentColor}22, transparent 70%)`,
                boxShadow: `inset 0 0 20px ${accentColor}1a`
              },
              children: /*#__PURE__*/_jsx("span", {
                style: {
                  filter: `drop-shadow(0 0 10px ${accentColor}66)`
                },
                children: step.icon
              })
            }), /*#__PURE__*/_jsx("h4", {
              className: "font-display font-bold text-xl text-ink mb-3",
              children: step.title
            }), /*#__PURE__*/_jsx("div", {
              className: "text-sm sm:text-base text-ink-muted leading-relaxed max-w-md mb-2 text-left w-full",
              children: step.content
            })]
          }, current)
        }), /*#__PURE__*/_jsx("div", {
          className: "shrink-0 flex items-center justify-center gap-1.5 px-5 pb-3",
          children: steps.map((_, i) => /*#__PURE__*/_jsx("button", {
            onClick: () => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            },
            "aria-label": `Go to step ${i + 1}`,
            className: cn('h-1.5 rounded-full transition-all duration-300', i === current ? 'w-6' : 'w-1.5 bg-white/20 hover:bg-white/40'),
            style: i === current ? {
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`
            } : undefined
          }, i))
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 px-5 pb-5 pt-1 flex items-center gap-3",
          children: [current > 0 && /*#__PURE__*/_jsx("button", {
            onClick: goPrev,
            className: "rounded-xl px-4 py-3 text-sm font-semibold text-ink-muted hover:text-ink border border-white/10 hover:border-white/20 transition-colors",
            children: "Piche"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex-1"
          }), !isLast ? /*#__PURE__*/_jsxs(motion.button, {
            whileHover: {
              scale: 1.02
            },
            whileTap: {
              scale: 0.98
            },
            onClick: goNext,
            className: "btn-3d inline-flex items-center gap-2 rounded-xl px-6 py-3 font-display font-bold text-sm text-midnight",
            style: {
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 0 #0a8f6a, 0 8px 20px rgba(16,185,129,0.3)'
            },
            children: ["Aage badho", /*#__PURE__*/_jsx(ArrowRight, {
              className: "size-4"
            })]
          }) : /*#__PURE__*/_jsxs(motion.button, {
            whileHover: {
              scale: 1.04
            },
            whileTap: {
              scale: 0.97
            },
            onClick: handleStart,
            className: "btn-3d group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-display font-extrabold text-base text-midnight",
            style: {
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 4px 0 ${accentColor}aa, 0 12px 30px ${accentColor}40, 0 0 24px ${accentColor}55`
            },
            children: [/*#__PURE__*/_jsx(Rocket, {
              className: "size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            }), "LET'S GO!"]
          })]
        })]
      })]
    })
  });
}
export default StrategyOnboarding;