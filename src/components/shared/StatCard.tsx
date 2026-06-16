'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import DynamicIcon from './DynamicIcon';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  icon?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  color = '#f59e0b',
  icon,
  className,
}: StatCardProps) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.5,
      ease: 'easeOut',
    });

    // Subscribe to transform updates to manually update DOM
    const unsubscribe = rounded.on('change', (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${v.toLocaleString('en-IN')}${suffix}`;
      }
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, prefix, suffix, motionVal, rounded]);

  return (
    <Card
      className={`border-0 bg-[#12121a] overflow-hidden ${className || ''}`.trim()}
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Label */}
            <p className="text-xs text-[#8888a0] mb-1 truncate">{label}</p>

            {/* Animated value */}
            <p className="text-2xl font-bold text-[#e8e8ed] tabular-nums truncate">
              <span ref={displayRef}>
                {prefix}{(0).toLocaleString('en-IN')}{suffix}
              </span>
            </p>
          </div>

          {/* Optional icon */}
          {icon && (
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}18` }}
            >
              <DynamicIcon
                name={icon}
                size={20}
                style={{ color }}
              />
            </div>
          )}
        </div>

        {/* Subtle bottom accent line */}
        <motion.div
          className="mt-3 h-0.5 rounded-full"
          style={{ backgroundColor: `${color}30` }}
          initial={{ width: '0%' }}
          animate={{ width: '60%' }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </CardContent>
    </Card>
  );
}
