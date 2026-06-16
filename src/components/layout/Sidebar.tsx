'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  Construction,
  Flame,
  Trophy,
  Coins,
  CheckCircle2,
  Lock,
  RotateCcw,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { modules } from '@/lib/data/modules';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import ProgressRing from '@/components/shared/ProgressRing';
import { ShareProgress } from '@/components/shared/ShareProgress';
import { LayoutDashboard } from 'lucide-react';
import { AchievementDashboard } from '@/components/shared/AchievementDashboard';
import { cn } from '@/lib/utils';

// Dynamically get a Lucide icon by name string
function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Construction;
  const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
  return Icon || Construction;
}

// Level calculation based on modules completed
function getLevel(completed: number): { level: number; label: string; color: string } {
  if (completed >= 11) return { level: 5, label: 'Master', color: '#f59e0b' };
  if (completed >= 8) return { level: 4, label: 'Expert', color: '#22c55e' };
  if (completed >= 5) return { level: 3, label: 'Pro', color: '#3b82f6' };
  if (completed >= 2) return { level: 2, label: 'Learner', color: '#a855f7' };
  return { level: 1, label: 'Beginner', color: '#8888a0' };
}

// Animation variants
const moduleVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
};

export function Sidebar() {
  const { activeModule, setActiveModule, coins, streak, resetProgress } = useAppStore();
  const { getModuleProgress, isModuleCompleted, modulesCompleted, completionPercentage } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Memoized level
  const level = useMemo(() => getLevel(modulesCompleted), [modulesCompleted]);

  return (
    <aside
      className="hidden md:flex flex-col w-72 bg-[#1a1a2e] border-r border-white/[0.06] h-[calc(100vh-3.5rem)] mt-14 shrink-0"
      role="complementary"
      aria-label="Module sidebar"
    >
      {/* Sticky header with overall progress */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.06] bg-gradient-to-b from-[#1e1e36] to-[#1a1a2e]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ProgressRing progress={completionPercentage} size={48} strokeWidth={4} />
            {/* Subtle glow behind ring */}
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-md"
              style={{ background: `radial-gradient(circle, ${level.color}40, transparent 70%)` }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[11px] font-semibold text-[#a0a0b8] uppercase tracking-wider mb-0.5">
              Your Journey
            </h2>
            <p className="text-lg font-bold text-white">
              {completionPercentage}%{' '}
              <span className="text-xs font-normal text-[#a0a0b8]">complete</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-breath-glow"
                style={{
                  backgroundColor: `${level.color}25`,
                  color: level.color,
                  boxShadow: `0 0 8px ${level.color}20`,
                }}
              >
                Lvl {level.level}
              </span>
              <span className="text-[10px] text-[#a0a0b8] font-medium">{level.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 mb-1 flex items-center justify-between">
            <h3 className="text-[10px] font-semibold text-[#a0a0b8] uppercase tracking-widest">
              Modules
            </h3>
            <span className="text-[9px] text-[#6666a0] tabular-nums">
              {modulesCompleted}/{modules.length}
            </span>
          </div>

          {modules.map((mod, index) => {
            const Icon = getIcon(mod.icon);
            const progress = getModuleProgress(mod.id);
            const completed = isModuleCompleted(mod.id);
            const isActive = activeModule === mod.id;

            // Determine module state
            const isLocked =
              index > 0 && !isModuleCompleted(modules[index - 1].id) && progress === 0;
            const isCurrent = !completed && !isLocked;

            return (
              <motion.button
                key={mod.id}
                custom={index}
                variants={moduleVariants}
                initial="hidden"
                animate="visible"
                onClick={() => !isLocked && setActiveModule(mod.id)}
                disabled={isLocked}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group module-item-hover hover-card-scale',
                  isActive && 'bg-amber-400/10 border border-amber-500/20',
                  isActive && isCurrent && 'animate-border-pulse',
                  !isActive && 'border border-transparent',
                  completed && 'hover:bg-green-500/5',
                  !completed && isCurrent && !isActive && 'hover:bg-amber-400/5',
                  isLocked && 'opacity-40 cursor-not-allowed hover:opacity-50'
                )}
                whileHover={!isLocked ? { x: 4 } : undefined}
                whileTap={!isLocked ? { scale: 0.98 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-label={`${mod.title} — ${progress}% complete${completed ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}`}
                aria-disabled={isLocked}
              >
                {/* Module color dot + Icon */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative',
                      completed && 'bg-green-500/15',
                      isCurrent && !completed && 'bg-amber-400/15',
                      !isCurrent && !completed && !isLocked && 'bg-white/[0.06]',
                      isLocked && 'bg-white/[0.02]'
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-[#555]" />
                    ) : (
                      <Icon
                        className={cn(
                          'w-4 h-4',
                          isCurrent ? 'text-amber-400' : 'text-[#a0a0b8]'
                        )}
                      />
                    )}
                    {/* Module color dot */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#1a1a2e]"
                      style={{ backgroundColor: isLocked ? '#444' : mod.color }}
                    />
                  </div>
                </div>

                {/* Title + Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        'text-xs font-medium truncate',
                        completed && 'text-green-400',
                        isCurrent && !completed && 'text-amber-300',
                        !isCurrent && !completed && 'text-[#a0a0b8]'
                      )}
                    >
                      {mod.title}
                    </span>
                    <span className={cn(
                      'text-[10px] ml-2 shrink-0 tabular-nums font-medium',
                      completed && 'text-green-400/80',
                      isCurrent && !completed && 'text-amber-400/80',
                      !isCurrent && !completed && 'text-[#6666a0]'
                    )}>
                      {progress}%
                    </span>
                  </div>
                  <div className={cn('h-1 rounded-full overflow-hidden bg-white/[0.06] progress-glow-bar', completed || 'progress-gold')}>
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        completed
                          ? 'bg-green-400'
                          : 'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706]'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  {/* Locked hint */}
                  {isLocked && index > 0 && (
                    <p className="text-[9px] text-[#5555a0] mt-1 truncate">
                      Pehle {modules[index - 1].title} khatam karo
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Dashboard Button */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 pt-3 pb-0 bg-[#16162a]">
        <motion.button
          onClick={() => setShowDashboard(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/15 text-amber-400 font-semibold text-xs hover:from-amber-400/15 hover:to-amber-500/10 transition-all corner-accent"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Open Achievement Dashboard"
        >
          <LayoutDashboard size={16} />
          Dashboard dekho
        </motion.button>

        {/* Motivational Quote */}
        <div className="px-0 pb-2 pt-1">
          <p className="text-[9px] text-[#5555a0] italic text-center">
            \"{['Paise ki samajh, sabse badi taakat', 'Chhota bhi bahut hota hai — SIP se dekho', 'Budget banao, azadi pao', 'Aaj ka paisa, kal ka asset'][Math.floor(Date.now() / 86400000) % 4]}\"
          </p>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3 bg-[#16162a]">
        <h3 className="text-[10px] font-semibold text-[#a0a0b8] uppercase tracking-widest mb-2">
          Today's Activity
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="streak-fire text-[10px] text-orange-400 font-semibold">{streak} day streak</span>
              {streak > 0 && <span className="badge-pulse text-[9px] bg-orange-400/20 text-orange-400 px-1 rounded-full">{streak}</span>}
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min(streak / 7 * 100, 100)}%` }}
              />
            </div>
            <span className="text-[8px] text-[#6666a0] mt-0.5 block">
              {streak >= 7 ? '🔥 Next: 30 day streak!' : `${7 - streak} days to 7-day badge`}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="shrink-0 border-t border-white/[0.06] p-4 space-y-3 bg-gradient-to-b from-[#16162a] to-[#131325]">
        <h3 className="text-[10px] font-semibold text-[#a0a0b8] uppercase tracking-widest">
          Quick Stats
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {/* XP / Coins */}
          <div className="card-shine bg-white/[0.04] rounded-xl p-2.5 text-center group hover:bg-amber-400/[0.08] transition-colors border border-white/[0.03] hover:border-amber-400/10">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-sm font-bold text-amber-400 tabular-nums">{coins}</div>
            <div className="text-[9px] text-[#a0a0b8] font-medium">XP</div>
            {/* Mini progress for next 50-coin milestone */}
            <div className="mt-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-amber-400/60 rounded-full transition-all"
                style={{ width: `${Math.min((coins % 50) / 50 * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="card-shine bg-white/[0.04] rounded-xl p-2.5 text-center group hover:bg-orange-400/[0.08] transition-colors border border-white/[0.03] hover:border-orange-400/10">
            <div className="flex items-center justify-center mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-sm font-bold text-orange-400 tabular-nums">{streak}</div>
            <div className="text-[9px] text-[#a0a0b8] font-medium">Streak</div>
            {/* Mini flame indicator */}
            <div className="mt-1 flex justify-center gap-[2px]">
              {Array.from({ length: Math.min(streak, 5) }).map((_, i) => (
                <span key={i} className="w-1 h-1.5 rounded-full bg-orange-400/70" />
              ))}
              {Array.from({ length: Math.max(0, 5 - streak) }).map((_, i) => (
                <span key={`e-${i}`} className="w-1 h-1.5 rounded-full bg-white/[0.08]" />
              ))}
            </div>
          </div>

          {/* Modules Done */}
          <div className="card-shine bg-white/[0.04] rounded-xl p-2.5 text-center group hover:bg-green-400/[0.08] transition-colors border border-white/[0.03] hover:border-green-400/10">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div className="text-sm font-bold text-green-400 tabular-nums">{modulesCompleted}</div>
            <div className="text-[9px] text-[#a0a0b8] font-medium">Done</div>
            {/* Mini progress bar */}
            <div className="mt-1 h-0.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-green-400/60 rounded-full transition-all"
                style={{ width: `${(modulesCompleted / 11) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reset progress link */}
        <div className="pt-1 flex justify-center">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 text-[10px] text-[#555] hover:text-[#888] transition-colors"
              aria-label="Reset all progress"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset Progress
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-400">Sure?</span>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="text-[10px] text-red-400 font-semibold hover:text-red-300 transition-colors"
                aria-label="Confirm reset progress"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-[10px] text-[#8888a0] hover:text-white transition-colors"
                aria-label="Cancel reset"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Share Progress Button */}
        <motion.button
          onClick={() => setShowShare(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/10 border border-[#f59e0b]/20 text-amber-400 font-semibold text-xs hover:from-[#f59e0b]/20 hover:to-[#d97706]/20 transition-all gradient-border-fade"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Share your progress"
        >
          <Share2 size={14} />
          Share Progress
        </motion.button>
      </div>

      {/* Share Dialog */}
      <ShareProgress open={showShare} onClose={() => setShowShare(false)} />

      {/* Achievement Dashboard */}
      <AchievementDashboard open={showDashboard} onClose={() => setShowDashboard(false)} />
    </aside>
  );
}
