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
      className={`border-0 glass-card overflow-hidden card-shine ${className || ''}`.trim()}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted mb-1 truncate">{label}</p>
            <p className="text-2xl font-bold text-ink tabular-nums truncate">
              <span ref={displayRef}>
                {prefix}{(0).toLocaleString('en-IN')}{suffix}
              </span>
            </p>
          </div>

          {icon && (
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}18`, boxShadow: `0 0 12px ${color}20` }}
            >
              <DynamicIcon name={icon} size={20} style={{ color }} />
            </div>
          )}
        </div>

        <motion.div
          className="mt-3 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          initial={{ width: '0%' }}
          animate={{ width: '60%' }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </CardContent>
    </Card>
  );
}
