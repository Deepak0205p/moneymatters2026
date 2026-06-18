'use client';

import { motion } from 'framer-motion';
import DynamicIcon from './DynamicIcon';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function EmptyState({
  title,
  description,
  icon
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center justify-center py-16 px-4",
    children: [/*#__PURE__*/_jsx(motion.div, {
      animate: {
        y: [0, -8, 0]
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      },
      className: "flex size-20 items-center justify-center rounded-2xl bg-[#1a1a2e] mb-6",
      style: {
        border: '1px solid rgba(255,255,255,0.06)'
      },
      children: /*#__PURE__*/_jsx(DynamicIcon, {
        name: icon || 'Construction',
        size: 36,
        className: "text-[#8888a0]",
        fallback: "construction"
      })
    }), /*#__PURE__*/_jsx("h3", {
      className: "text-lg font-semibold text-[#e8e8ed] mb-2 text-center",
      children: title
    }), description && /*#__PURE__*/_jsx(motion.p, {
      initial: {
        opacity: 0,
        y: 5
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 0.2
      },
      className: "text-sm text-[#8888a0] text-center max-w-xs leading-relaxed",
      children: description
    }), /*#__PURE__*/_jsx("div", {
      className: "flex items-center gap-1.5 mt-6",
      children: [0, 1, 2].map(i => /*#__PURE__*/_jsx(motion.div, {
        animate: {
          opacity: [0.3, 0.8, 0.3]
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: 'easeInOut'
        },
        className: "size-1.5 rounded-full bg-[#f59e0b]/40"
      }, i))
    })]
  });
}