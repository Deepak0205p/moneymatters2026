"use client";

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * TryItNow — Reusable inline trigger card that appears while reading module content.
 * Pulses to grab attention. Clicking opens the strategy as a full-screen modal.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TryItNow({
  strategyName,
  strategyDescription,
  icon,
  accentColor,
  onOpen
}) {
  return /*#__PURE__*/_jsxs(motion.button, {
    initial: {
      opacity: 0,
      y: 12
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      delay: 0.2,
      duration: 0.4
    },
    whileHover: {
      scale: 1.01
    },
    whileTap: {
      scale: 0.99
    },
    onClick: onOpen,
    className: "w-full mt-5 rounded-2xl p-4 border text-left transition-all group relative overflow-hidden",
    style: {
      background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 50%, rgba(16,185,129,0.04) 100%)`,
      borderColor: `${accentColor}30`,
      boxShadow: `0 0 24px ${accentColor}10, inset 0 1px 0 rgba(255,255,255,0.04)`
    },
    children: [/*#__PURE__*/_jsx(motion.div, {
      className: "absolute inset-0 rounded-2xl pointer-events-none",
      style: {
        border: `1.5px solid ${accentColor}40`
      },
      animate: {
        opacity: [0.3, 0.8, 0.3]
      },
      transition: {
        repeat: Infinity,
        duration: 2.5,
        ease: 'easeInOut'
      }
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative flex items-center gap-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative",
        style: {
          background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
          border: `1px solid ${accentColor}40`
        },
        children: [icon, /*#__PURE__*/_jsxs("span", {
          className: "absolute -top-1 -right-1 flex h-3 w-3",
          children: [/*#__PURE__*/_jsx("span", {
            className: "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
            style: {
              backgroundColor: accentColor
            }
          }), /*#__PURE__*/_jsx("span", {
            className: "relative inline-flex h-3 w-3 rounded-full border border-midnight",
            style: {
              backgroundColor: accentColor
            }
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex-1 min-w-0",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1.5 mb-0.5",
          children: [/*#__PURE__*/_jsx(Sparkles, {
            size: 10,
            style: {
              color: accentColor
            }
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[9px] font-black uppercase tracking-widest",
            style: {
              color: accentColor
            },
            children: "Try It Now"
          })]
        }), /*#__PURE__*/_jsx("h4", {
          className: "text-sm font-bold text-white",
          children: strategyName
        }), /*#__PURE__*/_jsx("p", {
          className: "text-[11px] text-zinc-400 mt-0.5",
          children: strategyDescription
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "shrink-0 transition-transform group-hover:translate-x-1",
        style: {
          color: accentColor
        },
        children: /*#__PURE__*/_jsx(ArrowRight, {
          size: 18
        })
      })]
    })]
  });
}