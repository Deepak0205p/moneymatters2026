'use client';

import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = '',
  suffix = '',
  color = '#f59e0b',
}: SliderControlProps) {
  const displayValue = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;

  return (
    <div className="w-full space-y-3">
      {/* Label and current value */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8888a0]">{label}</span>
        <motion.span
          key={value}
          initial={{ scale: 1.1, color: color }}
          animate={{ scale: 1, color: '#e8e8ed' }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold tabular-nums text-[#e8e8ed]"
        >
          {displayValue}
        </motion.span>
      </div>

      {/* Slider */}
      <div className="relative px-1">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(vals) => onChange(vals[0])}
          className={cn(
            '[&_[data-slot=slider-track]]:bg-[#1a1a2e]',
            '[&_[data-slot=slider-track]]:h-2',
            '[&_[data-slot=slider-track]]:rounded-full',
          )}
          style={{
            // @ts-expect-error CSS custom properties for slider color
            '--slider-color': color,
          }}
        />

        {/* Custom gold track overlay using CSS variable approach */}
        <style>{`
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
        `}</style>
      </div>

      {/* Min and max labels */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#8888a0]/60">
          {prefix}{min.toLocaleString('en-IN')}{suffix}
        </span>
        <span className="text-[10px] text-[#8888a0]/60">
          {prefix}{max.toLocaleString('en-IN')}{suffix}
        </span>
      </div>
    </div>
  );
}
