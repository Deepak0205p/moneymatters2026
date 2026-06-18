"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

/**
 * StrategyModal — Full-screen modal wrapper for interactive strategies.
 * Opens with a slide-up animation. Includes close button and reward system.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function StrategyModal({
  isOpen,
  onClose,
  title,
  accentColor,
  rewardCoins,
  children
}) {
  const {
    addCoins
  } = useAppStore();
  const handleClose = () => {
    // Award coins on close (strategy "completion")
    if (rewardCoins > 0) {
      addCoins(rewardCoins);
    }
    onClose();
  };
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: isOpen && /*#__PURE__*/_jsxs(motion.div, {
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
        duration: 0.3
      },
      className: "fixed inset-0 z-[85] flex items-end sm:items-center justify-center",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-midnight/85 backdrop-blur-md",
        onClick: handleClose,
        "aria-hidden": "true"
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          y: '100%',
          opacity: 0.5
        },
        animate: {
          y: 0,
          opacity: 1
        },
        exit: {
          y: '100%',
          opacity: 0.5
        },
        transition: {
          type: 'spring',
          stiffness: 280,
          damping: 30
        },
        className: "relative w-full sm:max-w-2xl h-[92vh] sm:h-[88vh] rounded-t-3xl sm:rounded-3xl overflow-hidden glass-strong border-t sm:border border-white/10 shadow-premium flex flex-col",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute top-0 left-0 right-0 h-1",
          style: {
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
          }
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2.5",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-2 h-2 rounded-full",
              style: {
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`
              }
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display font-bold text-ink text-sm",
              children: title
            }), rewardCoins > 0 && /*#__PURE__*/_jsxs("span", {
              className: "text-[10px] font-semibold text-gold-soft bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5",
              children: ["+", rewardCoins, " \uD83E\uDE99"]
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleClose,
            className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-ink-muted hover:text-ink transition-colors active:scale-90 cursor-pointer",
            "aria-label": "Close strategy",
            children: /*#__PURE__*/_jsx(X, {
              size: 16
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 overflow-y-auto custom-scroll",
          children: children
        })]
      })]
    })
  });
}