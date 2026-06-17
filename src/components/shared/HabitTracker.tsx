'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Calendar,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Habit Tracker — swipeable checklist, streak, heatmap
   ============================================================ */

interface HabitTrackerProps {
  open: boolean;
  onClose: () => void;
}

interface Habit {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const HABITS: Habit[] = [
  { id: 'track',      label: 'Aaj ka kharcha note kiya?',          emoji: '💰', description: 'Track all expenses today' },
  { id: 'avoid',      label: 'Unnecessary kharcha avoid kiya?',     emoji: '☕', description: 'Skipped an avoidable expense' },
  { id: 'learn',      label: 'Kuch naya financial concept padha?',  emoji: '📚', description: 'Learned something new about money' },
  { id: 'save',       label: 'Savings account mein kuch daala?',    emoji: '💵', description: 'Added money to savings' },
  { id: 'check',      label: 'UPI transactions check kiye?',        emoji: '📱', description: 'Reviewed UPI spends' },
];

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getStreakFromData(habitTracker: Record<string, string[]>, habitId: string): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker[dateStr] || []).includes(habitId);
    if (done) {
      streak++;
    } else if (i > 0) {
      // Allow today to be incomplete without breaking streak
      break;
    }
  }
  return streak;
}

function getPerfectDaysThisMonth(habitTracker: Record<string, string[]>): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month, day));
    const done = (habitTracker[dateStr] || []).length;
    if (done === HABITS.length) count++;
  }
  return count;
}

function getWeeklyHeatmap(habitTracker: Record<string, string[]>): { date: Date; intensity: number; dateStr: string }[] {
  const today = new Date();
  const result: { date: Date; intensity: number; dateStr: string }[] = [];
  // 4 weeks (28 days) — last 28 days
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker[dateStr] || []).length;
    const intensity = done === 0 ? 0 : Math.min(4, Math.ceil((done / HABITS.length) * 4));
    result.push({ date: d, intensity, dateStr });
  }
  return result;
}

const FLAME_TIERS = [
  { min: 30, emoji: '🏆', label: 'Master', color: '#f59e0b' },
  { min: 14, emoji: '💎', label: 'Adaat',  color: '#8b5cf6' },
  { min: 7,  emoji: '🔥', label: 'Streak', color: '#f97316' },
  { min: 3,  emoji: '🌱', label: 'Shuruat',color: '#10b981' },
  { min: 1,  emoji: '✨', label: 'Spark',  color: '#06b6d4' },
  { min: 0,  emoji: '💤', label: 'Start',  color: '#64748b' },
];

function getFlameTier(streak: number) {
  return FLAME_TIERS.find((t) => streak >= t.min) || FLAME_TIERS[FLAME_TIERS.length - 1];
}

export default function HabitTracker({ open, onClose }: HabitTrackerProps) {
  const { habitTracker, toggleHabit, addCoins, badges, addBadge } = useAppStore();
  const [perfectDayAwarded, setPerfectDayAwarded] = useState(false);

  const today = formatDate(new Date());
  const todayDone = habitTracker[today] || [];

  const allHabitsDone = todayDone.length === HABITS.length;

  useEffect(() => {
    if (allHabitsDone && !perfectDayAwarded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPerfectDayAwarded(true);
      addCoins(10);
      if (!badges.includes('perfect-day')) addBadge('perfect-day');
      toast({ title: 'Perfect Day! +10 coins 🌟' });
    } else if (!allHabitsDone) {
      setPerfectDayAwarded(false);
    }
  }, [allHabitsDone, perfectDayAwarded, addCoins, addBadge, badges]);

  /* Calculate best streak across all habits */
  const bestStreak = useMemo(() => {
    return Math.max(...HABITS.map((h) => getStreakFromData(habitTracker, h.id)), 0);
  }, [habitTracker]);

  const streakTier = getFlameTier(bestStreak);

  const weeklyHeatmap = useMemo(() => getWeeklyHeatmap(habitTracker), [habitTracker]);
  const perfectDays = useMemo(() => getPerfectDaysThisMonth(habitTracker), [habitTracker]);

  const completionRate = Math.round((todayDone.length / HABITS.length) * 100);

  const handleToggle = (habitId: string) => {
    toggleHabit(today, habitId);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Habit Tracker</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-violet-500/10 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold heading-gradient">Habit Tracker</h2>
                <p className="text-xs text-[#94A3B8]">Roz ki adatein banao 🔥</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#94A3B8]">Today</p>
              <p className="text-xs font-bold text-[#F8FAFC]">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
          </div>

          {/* Streak + Perfect Days stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl glass-card-premium border-amber-400/30 flex items-center gap-3">
              <motion.div
                key={streakTier.emoji}
                initial={{ scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="text-4xl"
                style={{ filter: `drop-shadow(0 0 12px ${streakTier.color})` }}
              >
                {streakTier.emoji}
              </motion.div>
              <div>
                <p className="text-2xl font-bold font-display" style={{ color: streakTier.color }}>
                  {bestStreak}
                </p>
                <p className="text-[10px] text-[#94A3B8]">din streak · {streakTier.label}</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl glass-card flex items-center gap-3">
              <div className="text-3xl">🌟</div>
              <div>
                <p className="text-2xl font-bold text-amber-300">{perfectDays}</p>
                <p className="text-[10px] text-[#94A3B8]">perfect days this month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Today's progress */}
          <div className="p-4 rounded-2xl glass-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#F8FAFC]">Aaj Ki Progress</span>
              <span className="text-sm font-bold text-emerald-300">{todayDone.length}/{HABITS.length}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', allHabitsDone ? 'bg-amber-400' : 'bg-emerald-400')}
                animate={{ width: `${completionRate}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1.5">
              {allHabitsDone ? '🎉 All done! Perfect day!' : `${HABITS.length - todayDone.length} aur baaki hain`}
            </p>
          </div>

          {/* Swipeable habit cards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Today's Habits</h3>
              <span className="text-[10px] text-[#94A3B8]">Tap right side to mark done →</span>
            </div>
            <div className="space-y-2">
              {HABITS.map((habit) => {
                const done = todayDone.includes(habit.id);
                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileTap={{ scale: 0.98 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 60 && !done) handleToggle(habit.id);
                      else if (info.offset.x < -60 && done) handleToggle(habit.id);
                    }}
                    className={cn(
                      'relative p-3 rounded-2xl border overflow-hidden cursor-grab active:cursor-grabbing',
                      done
                        ? 'glass-card-premium border-emerald-400/30'
                        : 'glass-card border-white/[0.06]',
                    )}
                  >
                    {/* Drag indicator */}
                    <div className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 transition-opacity',
                      done ? 'opacity-100' : 'opacity-40',
                    )}>
                      <div className="flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pr-6">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] grid place-items-center text-xl shrink-0">
                        {habit.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-semibold', done ? 'text-emerald-300' : 'text-[#F8FAFC]')}>
                          {habit.label}
                        </p>
                        <p className="text-[10px] text-[#94A3B8]">{habit.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(habit.id)}
                        className={cn(
                          'w-9 h-9 rounded-xl grid place-items-center shrink-0 transition',
                          done
                            ? 'bg-emerald-500 text-white'
                            : 'glass-card text-[#94A3B8] hover:text-emerald-300',
                        )}
                      >
                        <Check className={cn('w-5 h-5', done && 'scale-110')} />
                      </button>
                    </div>

                    {/* Done overlay sweep */}
                    <AnimatePresence>
                      {done && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '0%' }}
                          exit={{ x: '-100%' }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Perfect Day celebration */}
          <AnimatePresence>
            {allHabitsDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-2xl glass-card-premium border-amber-400/40 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                  className="text-4xl mb-1 inline-block"
                >
                  🌟
                </motion.div>
                <p className="font-display text-lg font-bold text-amber-300">Perfect Day!</p>
                <p className="text-xs text-[#94A3B8]">+10 coins mil gaye! Kal bhi aise hi rakho 💪</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly Heatmap */}
          <div className="p-4 rounded-2xl glass-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Weekly Heatmap 📅</h3>
              <span className="text-[10px] text-[#94A3B8]">Last 4 weeks</span>
            </div>
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {WEEK_DAYS.map((d, i) => (
                <div key={i} className="text-[9px] text-center text-[#94A3B8]">{d}</div>
              ))}
            </div>
            {/* 4 weeks × 7 days */}
            <div className="grid grid-cols-7 gap-1">
              {weeklyHeatmap.map((day, i) => {
                const bgColor = day.intensity === 0 ? 'bg-white/[0.04]'
                              : day.intensity === 1 ? 'bg-emerald-500/30'
                              : day.intensity === 2 ? 'bg-emerald-500/55'
                              : day.intensity === 3 ? 'bg-emerald-500/80'
                              : 'bg-emerald-400';
                const isToday = day.dateStr === today;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    whileHover={{ scale: 1.15 }}
                    title={`${day.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${day.intensity === 0 ? 'no activity' : `${day.intensity}/4 intensity`}`}
                    className={cn(
                      'aspect-square rounded-md grid place-items-center text-[8px] font-bold transition relative',
                      bgColor,
                      isToday && 'ring-2 ring-amber-400',
                      day.intensity >= 3 ? 'text-white' : 'text-[#94A3B8]',
                    )}
                  >
                    {day.date.getDate()}
                  </motion.div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-between mt-3 text-[9px] text-[#94A3B8]">
              <span>Less</span>
              <div className="flex gap-0.5">
                <div className="w-2 h-2 rounded-sm bg-white/[0.04]" />
                <div className="w-2 h-2 rounded-sm bg-emerald-500/30" />
                <div className="w-2 h-2 rounded-sm bg-emerald-500/55" />
                <div className="w-2 h-2 rounded-sm bg-emerald-500/80" />
                <div className="w-2 h-2 rounded-sm bg-emerald-400" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Motivational AI tip */}
          <div className="p-4 rounded-2xl glass-card-premium border border-violet-500/30 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 grid place-items-center shrink-0">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-violet-300 mb-0.5">Reminder 🤖</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {!allHabitsDone
                  ? `Aaj ka checklist abhi tak incomplete hai! ⏰ Sirf ${HABITS.length - todayDone.length} aur baaki.`
                  : bestStreak >= 7
                  ? '7+ din streak! Tum next level pe ho. Kal bhi mat todo! 💪'
                  : 'Perfect day! Aise hi roz karte raho — 7 din mein badge unlock! 🏆'}
              </p>
            </div>
          </div>

          {/* Badge section */}
          <div className="p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Achievements</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'habit-shuruat', days: 3,  emoji: '🌱', label: 'Shuruat' },
                { id: 'habit-consistent', days: 7, emoji: '🔥', label: 'Streak' },
                { id: 'habit-adaat', days: 14, emoji: '💎', label: 'Adaat' },
                { id: 'habit-master', days: 30, emoji: '🏆', label: 'Master' },
              ].map((b) => {
                const earned = badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={cn(
                      'aspect-square rounded-xl grid place-items-center p-1 border',
                      earned ? 'glass-card-premium border-amber-400/30' : 'border-white/[0.04] opacity-40',
                    )}
                  >
                    <div className={cn('text-2xl mb-0.5', !earned && 'grayscale')}>{earned ? b.emoji : '🔒'}</div>
                    <p className="text-[8px] text-center text-[#94A3B8]">{b.label}</p>
                    <p className="text-[8px] text-amber-300/70">{b.days}d</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
