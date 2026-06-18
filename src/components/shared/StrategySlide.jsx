"use client";

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SPARKLE_COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#34D399', '#A78BFA', '#FBBF24'];

/**
 * StrategySlide — the special "last slide" card shown at the end of
 * module content in the SwipeCardViewer. A glowing, floating, animated
 * invitation to start an interactive strategy.
 */
export function StrategySlide({
  strategyName,
  hook,
  icon,
  accentColor,
  rewardCoins,
  onStart,
  className
}) {
  // Stable random sparkle field — recomputed only when accentColor changes
  const sparkles = useMemo(() => Array.from({
    length: 6
  }).map((_, i) => ({
    id: i,
    top: `${10 + Math.random() * 80}%`,
    left: `${5 + Math.random() * 90}%`,
    color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    delay: `${Math.random() * 2.5}s`,
    size: 4 + Math.round(Math.random() * 4)
  })), [accentColor]);
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 24
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 22
    },
    className: cn('relative w-full perspective-3d', className),
    children: [/*#__PURE__*/_jsx("div", {
      "aria-hidden": true,
      className: "absolute -inset-2 rounded-3xl blur-2xl opacity-40 pointer-events-none",
      style: {
        background: `radial-gradient(circle at 50% 40%, ${accentColor}, transparent 70%)`
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "strategy-slide-3d relative w-full rounded-3xl glass-card-premium overflow-hidden p-6 sm:p-8",
      style: {
        borderColor: `${accentColor}55`,
        boxShadow: `0 0 0 1px ${accentColor}22, 0 0 40px ${accentColor}22, 0 24px 60px rgba(0,0,0,0.45)`
      },
      children: [/*#__PURE__*/_jsx("div", {
        "aria-hidden": true,
        className: "absolute top-0 left-0 right-0 h-1",
        style: {
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
        }
      }), sparkles.map(s => /*#__PURE__*/_jsx("span", {
        className: "sparkle-particle",
        style: {
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size,
          backgroundColor: s.color,
          boxShadow: `0 0 8px ${s.color}`,
          animationDelay: s.delay
        }
      }, s.id)), rewardCoins > 0 && /*#__PURE__*/_jsxs("div", {
        className: "absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        style: {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          color: '#FBBF24',
          boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)'
        },
        children: [/*#__PURE__*/_jsx("span", {
          className: "coin-spin-3d inline-block",
          children: "\uD83E\uDE99"
        }), "+", rewardCoins]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative z-10 flex flex-col items-center text-center pt-2",
        children: [/*#__PURE__*/_jsx(motion.div, {
          animate: {
            scale: [1, 1.08, 1]
          },
          transition: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          className: "flex items-center justify-center rounded-3xl mb-4",
          style: {
            width: 96,
            height: 96,
            fontSize: 56,
            background: `radial-gradient(circle, ${accentColor}22, transparent 70%)`,
            boxShadow: `inset 0 0 24px ${accentColor}22`
          },
          children: /*#__PURE__*/_jsx("span", {
            style: {
              filter: `drop-shadow(0 0 12px ${accentColor}88)`
            },
            children: icon
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-3",
          style: {
            color: accentColor,
            backgroundColor: `${accentColor}14`,
            border: `1px solid ${accentColor}33`
          },
          children: [/*#__PURE__*/_jsx(Sparkles, {
            className: "size-3"
          }), "Interactive Strategy"]
        }), /*#__PURE__*/_jsx("h3", {
          className: "font-display font-extrabold text-2xl sm:text-3xl leading-tight mb-2",
          style: {
            background: `linear-gradient(135deg, #F8FAFC, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          },
          children: strategyName
        }), /*#__PURE__*/_jsx("p", {
          className: "text-ink-muted text-sm sm:text-base max-w-md mb-6",
          children: hook
        }), /*#__PURE__*/_jsxs(motion.button, {
          whileHover: {
            scale: 1.03
          },
          whileTap: {
            scale: 0.97
          },
          onClick: onStart,
          className: "btn-3d group inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-display font-bold text-base text-midnight",
          style: {
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 4px 0 ${accentColor}aa, 0 12px 30px ${accentColor}40, 0 0 24px ${accentColor}55`
          },
          "aria-label": `Shuru karo ${strategyName}`,
          children: ["Shuru Karo", /*#__PURE__*/_jsx(ArrowRight, {
            className: "size-5 transition-transform group-hover:translate-x-1"
          })]
        })]
      })]
    })]
  });
}
export default StrategySlide;