'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import DynamicIcon from './DynamicIcon';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * StatCard — premium glassmorphism stat card with animated counter.
 * Uses the Midnight Wealth + Emerald Growth palette.
 */
export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  color = '#10B981',
  icon,
  className
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, v => Math.round(v));
  const displayRef = useRef(null);
  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.5,
      ease: 'easeOut'
    });
    const unsubscribe = rounded.on('change', v => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${v.toLocaleString('en-IN')}${suffix}`;
      }
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, prefix, suffix, motionVal, rounded]);
  return /*#__PURE__*/_jsx(Card, {
    className: `border-0 glass-card overflow-hidden card-shine ${className || ''}`.trim(),
    children: /*#__PURE__*/_jsxs(CardContent, {
      className: "p-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-start justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex-1 min-w-0",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-xs text-ink-muted mb-1 truncate",
            children: label
          }), /*#__PURE__*/_jsx("p", {
            className: "text-2xl font-bold text-ink tabular-nums truncate",
            children: /*#__PURE__*/_jsxs("span", {
              ref: displayRef,
              children: [prefix, 0 .toLocaleString('en-IN'), suffix]
            })
          })]
        }), icon && /*#__PURE__*/_jsx("div", {
          className: "flex size-10 shrink-0 items-center justify-center rounded-lg",
          style: {
            backgroundColor: `${color}18`,
            boxShadow: `0 0 12px ${color}20`
          },
          children: /*#__PURE__*/_jsx(DynamicIcon, {
            name: icon,
            size: 20,
            style: {
              color
            }
          })
        })]
      }), /*#__PURE__*/_jsx(motion.div, {
        className: "mt-3 h-0.5 rounded-full",
        style: {
          background: `linear-gradient(90deg, ${color}, transparent)`
        },
        initial: {
          width: '0%'
        },
        animate: {
          width: '60%'
        },
        transition: {
          duration: 1,
          delay: 0.5,
          ease: 'easeOut'
        }
      })]
    })
  });
}