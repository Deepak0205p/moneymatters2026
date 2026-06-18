'use client';

import { motion } from 'framer-motion';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ProgressRing — circular SVG progress with brand emerald gradient + glow.
 */
export default function ProgressRing({
  progress,
  size = 80,
  color = '#10B981',
  strokeWidth = 6
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - clampedProgress / 100 * circumference;
  const gradientId = `progress-ring-${color.replace('#', '')}`;
  return /*#__PURE__*/_jsxs("div", {
    className: "relative inline-flex items-center justify-center",
    style: {
      width: size,
      height: size
    },
    children: [/*#__PURE__*/_jsxs("svg", {
      width: size,
      height: size,
      className: "-rotate-90",
      children: [/*#__PURE__*/_jsx("defs", {
        children: /*#__PURE__*/_jsxs("linearGradient", {
          id: gradientId,
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "100%",
          children: [/*#__PURE__*/_jsx("stop", {
            offset: "0%",
            stopColor: "#34D399"
          }), /*#__PURE__*/_jsx("stop", {
            offset: "100%",
            stopColor: color
          })]
        })
      }), /*#__PURE__*/_jsx("circle", {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: "none",
        stroke: "rgba(148, 163, 184, 0.10)",
        strokeWidth: strokeWidth
      }), /*#__PURE__*/_jsx(motion.circle, {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: "none",
        stroke: `url(#${gradientId})`,
        strokeWidth: strokeWidth,
        strokeLinecap: "round",
        strokeDasharray: circumference,
        initial: {
          strokeDashoffset: circumference
        },
        animate: {
          strokeDashoffset
        },
        transition: {
          duration: 1,
          ease: 'easeOut'
        },
        style: {
          filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.35))'
        }
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "absolute inset-0 flex flex-col items-center justify-center",
      children: [/*#__PURE__*/_jsx(motion.span, {
        className: "text-lg font-bold text-ink tabular-nums",
        style: {
          lineHeight: 1
        },
        initial: {
          scale: 0.8,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          duration: 0.3
        },
        children: Math.round(clampedProgress)
      }, Math.round(clampedProgress)), /*#__PURE__*/_jsx("span", {
        className: "text-[8px] text-ink-muted",
        children: "%"
      })]
    })]
  });
}