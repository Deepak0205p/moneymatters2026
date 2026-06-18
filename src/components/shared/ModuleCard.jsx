'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import DynamicIcon from './DynamicIcon';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ModuleCard — premium glassmorphism module card.
 * Midnight Wealth + Emerald Growth design system.
 */
export default function ModuleCard({
  module,
  onClick,
  progress = 0
}) {
  const isCompleted = progress >= 100;
  return /*#__PURE__*/_jsx(motion.div, {
    whileHover: {
      y: -4
    },
    whileTap: {
      scale: 0.98
    },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    },
    className: "cursor-pointer",
    onClick: onClick,
    children: /*#__PURE__*/_jsxs(Card, {
      className: cn('relative overflow-hidden border-0 glass-card card-shine transition-colors', 'hover:border-emerald/25'),
      children: [/*#__PURE__*/_jsx("div", {
        className: "h-1 w-full",
        style: {
          background: `linear-gradient(90deg, ${module.color}, ${module.color}88)`
        }
      }), /*#__PURE__*/_jsxs(CardContent, {
        className: "p-4 pt-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex size-11 shrink-0 items-center justify-center rounded-lg",
            style: {
              backgroundColor: `${module.color}18`,
              boxShadow: `0 0 14px ${module.color}20`
            },
            children: /*#__PURE__*/_jsx(DynamicIcon, {
              name: module.icon,
              size: 22,
              style: {
                color: module.color
              }
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "min-w-0 flex-1",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "truncate text-sm font-semibold text-ink",
                children: module.title
              }), isCompleted && /*#__PURE__*/_jsxs(Badge, {
                className: "shrink-0 bg-emerald/20 text-emerald-soft border-emerald/30 hover:bg-emerald/30 text-[10px] px-1.5 py-0",
                children: [/*#__PURE__*/_jsx(CheckCircle2, {
                  size: 10,
                  className: "mr-0.5"
                }), "Done"]
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-0.5 line-clamp-2 text-xs text-ink-muted",
              children: module.description
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-3 space-y-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between text-[10px]",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-ink-muted",
              children: "Progress"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-medium text-emerald-soft",
              children: [Math.round(progress), "%"]
            })]
          }), /*#__PURE__*/_jsx(Progress, {
            value: progress,
            className: "h-1.5 bg-white/[0.06]"
          })]
        })]
      }), isCompleted && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          scale: 0,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 30
        },
        className: "absolute right-3 top-3",
        children: /*#__PURE__*/_jsx("div", {
          className: "flex size-7 items-center justify-center rounded-full bg-emerald/20",
          children: /*#__PURE__*/_jsx(CheckCircle2, {
            size: 16,
            className: "text-emerald-soft"
          })
        })
      })]
    })
  });
}