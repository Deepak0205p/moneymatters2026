'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = '',
  suffix = '',
  color = '#f59e0b'
}) {
  const displayValue = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full space-y-3",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/_jsx("span", {
        className: "text-sm text-[#8888a0]",
        children: label
      }), /*#__PURE__*/_jsx(motion.span, {
        initial: {
          scale: 1.1,
          color: color
        },
        animate: {
          scale: 1,
          color: '#e8e8ed'
        },
        transition: {
          duration: 0.3
        },
        className: "text-sm font-bold tabular-nums text-[#e8e8ed]",
        children: displayValue
      }, value)]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative px-1",
      children: [/*#__PURE__*/_jsx(Slider, {
        value: [value],
        min: min,
        max: max,
        step: step,
        onValueChange: vals => onChange(vals[0]),
        className: cn('[&_[data-slot=slider-track]]:bg-[#1a1a2e]', '[&_[data-slot=slider-track]]:h-2', '[&_[data-slot=slider-track]]:rounded-full'),
        style: {
          // @ts-expect-error CSS custom properties for slider color
          '--slider-color': color
        }
      }), /*#__PURE__*/_jsx("style", {
        children: `
          [data-slot="slider-range"] {
            background: linear-gradient(90deg, ${color}cc, ${color}) !important;
            border-radius: 9999px;
          }
          [data-slot="slider-thumb"] {
            border-color: ${color} !important;
            background: #0a0a0f !important;
            box-shadow: 0 0 8px ${color}44 !important;
            width: 18px !important;
            height: 18px !important;
          }
          [data-slot="slider-thumb"]:hover {
            box-shadow: 0 0 14px ${color}66 !important;
          }
        `
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs("span", {
        className: "text-[10px] text-[#8888a0]/60",
        children: [prefix, min.toLocaleString('en-IN'), suffix]
      }), /*#__PURE__*/_jsxs("span", {
        className: "text-[10px] text-[#8888a0]/60",
        children: [prefix, max.toLocaleString('en-IN'), suffix]
      })]
    })]
  });
}