'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Module } from '@/lib/types';
import DynamicIcon from './DynamicIcon';

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  progress?: number;
}

/**
 * ModuleCard — premium glassmorphism module card.
 * Midnight Wealth + Emerald Growth design system.
 */
export default function ModuleCard({ module, onClick, progress = 0 }: ModuleCardProps) {
  const isCompleted = progress >= 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-0 glass-card card-shine transition-colors',
          'hover:border-emerald/25'
        )}
      >
        {/* Colored top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${module.color}, ${module.color}88)` }}
        />

        <CardContent className="p-4 pt-4">
          <div className="flex items-start gap-3">
            {/* Icon container */}
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${module.color}18`, boxShadow: `0 0 14px ${module.color}20` }}
            >
              <DynamicIcon name={module.icon} size={22} style={{ color: module.color }} />
            </div>

            {/* Text content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-ink">{module.title}</h3>
                {isCompleted && (
                  <Badge className="shrink-0 bg-emerald/20 text-emerald-soft border-emerald/30 hover:bg-emerald/30 text-[10px] px-1.5 py-0">
                    <CheckCircle2 size={10} className="mr-0.5" />
                    Done
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{module.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-ink-muted">Progress</span>
              <span className="font-medium text-emerald-soft">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/[0.06]" />
          </div>
        </CardContent>

        {/* Completed overlay checkmark */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-3 top-3"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald/20">
              <CheckCircle2 size={16} className="text-emerald-soft" />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
