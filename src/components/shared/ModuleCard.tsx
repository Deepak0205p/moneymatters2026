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

export default function ModuleCard({ module, onClick, progress = 0 }: ModuleCardProps) {
  const isCompleted = progress >= 100;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-0 bg-[#12121a] transition-colors',
          'hover:border-[#f59e0b]/30'
        )}
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
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
              style={{ backgroundColor: `${module.color}18` }}
            >
              <DynamicIcon
                name={module.icon}
                size={22}
                style={{ color: module.color }}
              />
            </div>

            {/* Text content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-[#e8e8ed]">
                  {module.title}
                </h3>
                {isCompleted && (
                  <Badge className="shrink-0 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 text-[10px] px-1.5 py-0">
                    <CheckCircle2 size={10} className="mr-0.5" />
                    Done
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-[#8888a0]">
                {module.description}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#8888a0]">Progress</span>
              <span className="font-medium text-[#f59e0b]">{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-1.5 bg-[#1a1a2e]"
            />
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
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
