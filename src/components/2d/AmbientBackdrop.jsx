'use client';

import { motion } from 'framer-motion';

/**
 * AmbientBackdrop — a premium animated backdrop with floating orbs.
 * Uses the Midnight Wealth + Emerald Growth palette.
 * Drop behind any section for instant depth.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AmbientBackdrop({
  variant = 'emerald',
  className = ''
}) {
  if (variant === 'subtle') {
    return /*#__PURE__*/_jsx("div", {
      className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-texture-dots opacity-40"
      })
    });
  }
  if (variant === 'aurora') {
    return /*#__PURE__*/_jsxs("div", {
      className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
      "aria-hidden": "true",
      children: [/*#__PURE__*/_jsx(motion.div, {
        className: "absolute -top-1/4 -left-1/4 w-[60rem] h-[60rem] rounded-full opacity-20 blur-3xl",
        style: {
          background: 'radial-gradient(circle, #10B981, transparent 60%)'
        },
        animate: {
          x: [0, 40, 0],
          y: [0, 20, 0]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }), /*#__PURE__*/_jsx(motion.div, {
        className: "absolute -bottom-1/4 -right-1/4 w-[50rem] h-[50rem] rounded-full opacity-15 blur-3xl",
        style: {
          background: 'radial-gradient(circle, #8B5CF6, transparent 60%)'
        },
        animate: {
          x: [0, -30, 0],
          y: [0, -15, 0]
        },
        transition: {
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })]
    });
  }

  // default: emerald
  return /*#__PURE__*/_jsxs("div", {
    className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
    "aria-hidden": "true",
    children: [/*#__PURE__*/_jsx(motion.div, {
      className: "absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full opacity-10 blur-3xl",
      style: {
        background: 'radial-gradient(circle, #10B981, transparent 70%)'
      },
      animate: {
        scale: [1, 1.08, 1],
        opacity: [0.08, 0.14, 0.08]
      },
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }), /*#__PURE__*/_jsx(motion.div, {
      className: "absolute bottom-0 left-0 w-[32rem] h-[32rem] rounded-full opacity-08 blur-3xl",
      style: {
        background: 'radial-gradient(circle, #8B5CF6, transparent 70%)'
      },
      animate: {
        scale: [1, 1.12, 1],
        opacity: [0.06, 0.12, 0.06]
      },
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })]
  });
}

/**
 * GridLines — subtle SVG grid pattern for technical/strategy backgrounds.
 */
export function GridLines({
  className = '',
  opacity = 0.4
}) {
  return /*#__PURE__*/_jsxs("svg", {
    className: `pointer-events-none absolute inset-0 w-full h-full ${className}`,
    "aria-hidden": "true",
    style: {
      opacity
    },
    children: [/*#__PURE__*/_jsx("defs", {
      children: /*#__PURE__*/_jsx("pattern", {
        id: "grid-pattern",
        width: "32",
        height: "32",
        patternUnits: "userSpaceOnUse",
        children: /*#__PURE__*/_jsx("path", {
          d: "M 32 0 L 0 0 0 32",
          fill: "none",
          stroke: "rgba(148, 163, 184, 0.08)",
          strokeWidth: "1"
        })
      })
    }), /*#__PURE__*/_jsx("rect", {
      width: "100%",
      height: "100%",
      fill: "url(#grid-pattern)"
    })]
  });
}

/**
 * GlowOrb — a single decorative glowing orb. Place anywhere for ambiance.
 */
export function GlowOrb({
  size = 200,
  color = '#10B981',
  opacity = 0.15,
  className = '',
  animate = true
}) {
  return /*#__PURE__*/_jsx(motion.div, {
    className: `pointer-events-none absolute rounded-full blur-3xl ${className}`,
    style: {
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      opacity
    },
    animate: animate ? {
      scale: [1, 1.1, 1],
      opacity: [opacity, opacity * 1.4, opacity]
    } : undefined,
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    },
    "aria-hidden": "true"
  });
}

/**
 * Particles — lightweight CSS-only floating particles. No canvas overhead.
 */
export function Particles({
  count = 12,
  className = ''
}) {
  const particles = Array.from({
    length: count
  }, (_, i) => {
    const colors = ['#10B981', '#8B5CF6', '#F59E0B'];
    const color = colors[i % colors.length];
    const left = (i * 8.3 + 5) % 100;
    const top = (i * 13.7 + 10) % 100;
    const size = 1 + i % 3;
    const delay = i % 6 * 0.8;
    const duration = 10 + i % 5 * 2;
    return /*#__PURE__*/_jsx(motion.span, {
      className: "absolute rounded-full",
      style: {
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.4,
        boxShadow: `0 0 ${size * 3}px ${color}`
      },
      animate: {
        y: [0, -16, 0],
        opacity: [0.2, 0.6, 0.2]
      },
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      },
      "aria-hidden": "true"
    }, i);
  });
  return /*#__PURE__*/_jsx("div", {
    className: `pointer-events-none absolute inset-0 overflow-hidden ${className}`,
    "aria-hidden": "true",
    children: particles
  });
}