'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PageContainer — the scrollable canvas that hosts each strategy.
 * Premium glassmorphism shell over the midnight backdrop.
 */
export function PageContainer({
  children,
  strategyId
}) {
  return /*#__PURE__*/_jsx(AnimatePresence, {
    mode: "wait",
    children: /*#__PURE__*/_jsx(motion.div, {
      initial: {
        opacity: 0,
        y: 12
      },
      animate: {
        opacity: 1,
        y: 0
      },
      exit: {
        opacity: 0,
        y: -12
      },
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1]
      },
      className: "flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden mt-14 page-transition strategy-scroll",
      children: /*#__PURE__*/_jsxs("div", {
        className: "relative p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto",
        children: [/*#__PURE__*/_jsx("div", {
          className: "pointer-events-none absolute inset-0 aurora-bg rounded-3xl"
        }), /*#__PURE__*/_jsx("div", {
          className: "pointer-events-none absolute inset-0 bg-texture-dots opacity-60 rounded-3xl"
        }), /*#__PURE__*/_jsx("div", {
          className: "relative",
          children: children
        })]
      })
    }, strategyId)
  });
}