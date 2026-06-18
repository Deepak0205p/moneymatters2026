"use client";

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Card3D — a reusable wrapper that gives any child a mouse-tracking
 * 3D tilt effect. On mouse move, the card tilts based on the cursor
 * position relative to the card center (rotateX / rotateY). On mouse
 * leave, it springs back to flat. Uses perspective(800px) and
 * transform-style: preserve-3d.
 */
export function Card3D({
  children,
  className,
  glowColor,
  intensity = 8,
  disabled = false
}) {
  const ref = useRef(null);

  // Raw mouse position (0 → 1 across the card)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // Spring-smoothed position so the card eases back on leave
  const sx = useSpring(px, {
    stiffness: 180,
    damping: 18,
    mass: 0.4
  });
  const sy = useSpring(py, {
    stiffness: 180,
    damping: 18,
    mass: 0.4
  });

  // Map [0,1] → [-intensity, +intensity]
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);

  // Subtle lift + glow position that tracks the cursor
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);
  // Cursor-following radial glow background (only rendered when glowColor set)
  const glareBackground = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, ${glowColor ?? '#10B981'}26, transparent 55%)`);
  const handleMouseMove = e => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(Math.min(Math.max(x, 0), 1));
    py.set(Math.min(Math.max(y, 0), 1));
  };
  const handleMouseLeave = () => {
    if (disabled) return;
    px.set(0.5);
    py.set(0.5);
  };
  return /*#__PURE__*/_jsxs(motion.div, {
    ref: ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      transformStyle: 'preserve-3d',
      perspective: 800,
      rotateX: disabled ? 0 : rotateX,
      rotateY: disabled ? 0 : rotateY
    },
    className: cn('relative transition-shadow duration-300 will-change-transform', className),
    children: [children, !disabled && glowColor && /*#__PURE__*/_jsx(motion.div, {
      "aria-hidden": true,
      className: "pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen",
      style: {
        background: glareBackground
      }
    })]
  });
}
export default Card3D;