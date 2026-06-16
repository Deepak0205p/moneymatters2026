'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Flame, Trophy, Star, Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface HabitTrackerProps {
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Habit Definitions                                                  */
/* ------------------------------------------------------------------ */

const HABITS = [
  { id: 'budget', label: 'Budget banaya', emoji: '📋', description: 'Made a budget' },
  { id: 'track', label: 'Kharcha track kiya', emoji: '📊', description: 'Tracked expenses' },
  { id: 'save', label: 'Paise bachaye', emoji: '💰', description: 'Saved money' },
  { id: 'study', label: 'Financial padhai ki', emoji: '📖', description: 'Studied finance' },
  { id: 'sip', label: 'SIP kiya', emoji: '📈', description: 'Made SIP investment' },
  { id: 'teach', label: 'Kisi ko sikhaya', emoji: '🎓', description: 'Taught someone about finance' },
] as const;

/* ------------------------------------------------------------------ */
/*  Achievement Badges                                                 */
/* ------------------------------------------------------------------ */

const ACHIEVEMENT_BADGES = [
  { days: 3, id: 'habit-shuruat', label: 'Shuruat', emoji: '🌱', description: '3-day streak' },
  { days: 7, id: 'habit-consistent', label: 'Consistent', emoji: '🔥', description: '7-day streak' },
  { days: 14, id: 'habit-adaat', label: 'Adaat', emoji: '💎', description: '14-day streak' },
  { days: 30, id: 'habit-master', label: 'Master', emoji: '🏆', description: '30-day streak' },
] as const;

/* ------------------------------------------------------------------ */
/*  Motivational Messages                                              */
/* ------------------------------------------------------------------ */

function getMotivationalMessage(completionRate: number): { text: string; emoji: string } {
  if (completionRate >= 90) return { text: 'Waah! Tu toh financial rockstar hai! 🎸', emoji: '🌟' };
  if (completionRate >= 70) return { text: 'Bahut accha ja raha hai! Keep it up! 💪', emoji: '🔥' };
  if (completionRate >= 50) return { text: 'Aadha raasta cross kar liya! Thoda aur mehnat! 🏃', emoji: '⚡' };
  if (completionRate >= 30) return { text: 'Shuruat toh ho gayi, ab consistency laa! 🎯', emoji: '🌱' };
  if (completionRate > 0) return { text: 'Chhote kadam bhi kadam hain! Aage badh! 👣', emoji: '💫' };
  return { text: 'Aaj se shuru kar, kal se nahi! 🚀', emoji: '🎯' };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

function getDateLabel(date: Date): string {
  return date.getDate().toString();
}

function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

function isFuture(dateStr: string): boolean {
  return dateStr > formatDate(new Date());
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HabitTracker({ open, onClose }: HabitTrackerProps) {
  const { habitTracker, toggleHabit, badges, addBadge, addCoins } = useAppStore();
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // ─── Last 7 days ──────────────────────────────────────────────
  const last7Days = useMemo(() => {
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      days.push(new Date(Date.now() - i * 86400000));
    }
    return days;
  }, []);

  // ─── Streak Calculation ───────────────────────────────────────
  const streakInfo = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = formatDate(new Date());

    // Count backwards from today to find current streak
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(new Date(Date.now() - i * 86400000));
      const completedHabits = habitTracker[dateStr] || [];
      // A day "counts" if at least one habit was completed
      if (completedHabits.length > 0) {
        if (i === currentStreak) {
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        // Only break current streak if we're past the current streak count
        if (i === currentStreak) break;
        tempStreak = 0;
      }
    }

    // Also scan forward from oldest data to find longest streak
    const allDates = Object.keys(habitTracker).sort();
    if (allDates.length > 0) {
      tempStreak = 0;
      const earliest = new Date(allDates[0]);
      const latest = new Date(today);
      for (let d = new Date(earliest); d <= latest; d.setDate(d.getDate() + 1)) {
        const ds = formatDate(d);
        if ((habitTracker[ds] || []).length > 0) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    }

    return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
  }, [habitTracker]);

  // ─── Completion Rate ──────────────────────────────────────────
  const completionRate = useMemo(() => {
    const today = formatDate(new Date());
    // Calculate over last 30 days
    let totalPossible = 0;
    let totalCompleted = 0;
    for (let i = 0; i < 30; i++) {
      const dateStr = formatDate(new Date(Date.now() - i * 86400000));
      if (dateStr > today) continue; // skip future
      totalPossible += HABITS.length;
      totalCompleted += (habitTracker[dateStr] || []).length;
    }
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  }, [habitTracker]);

  // ─── Month Calendar Data ──────────────────────────────────────
  const monthCalendarData = useMemo(() => {
    const { year, month } = viewMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = firstDay.getDay(); // 0=Sun

    const cells: { date: string; day: number; inMonth: boolean }[] = [];

    // Fill in blank days before month starts
    for (let i = 0; i < startDow; i++) {
      cells.push({ date: '', day: 0, inMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date: formatDate(date), day: d, inMonth: true });
    }

    return cells;
  }, [viewMonth]);

  // ─── Today's habits ───────────────────────────────────────────
  const todayStr = formatDate(new Date());
  const todayHabits = habitTracker[todayStr] || [];

  // ─── Toggle handler ───────────────────────────────────────────
  const handleToggleHabit = useCallback((dateStr: string, habitId: string) => {
    toggleHabit(dateStr, habitId);

    // Check for streak badges after toggling
    // We need to compute the new streak based on the toggle
    // Since toggleHabit already updated the store, we check badges here
    setTimeout(() => {
      const state = useAppStore.getState();
      const ht = state.habitTracker;
      const today = formatDate(new Date());

      // Calculate current streak
      let currentStreak = 0;
      for (let i = 0; i < 365; i++) {
        const ds = formatDate(new Date(Date.now() - i * 86400000));
        if ((ht[ds] || []).length > 0) {
          if (i === currentStreak) currentStreak++;
          else break;
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      const allDates = Object.keys(ht).sort();
      if (allDates.length > 0) {
        const earliest = new Date(allDates[0]);
        const latest = new Date(today);
        for (let d = new Date(earliest); d <= latest; d.setDate(d.getDate() + 1)) {
          const ds = formatDate(d);
          if ((ht[ds] || []).length > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
      }

      const effectiveStreak = Math.max(currentStreak, longestStreak);

      // Award badges
      const newBadges = [...state.badges];
      let earned = false;

      for (const badge of ACHIEVEMENT_BADGES) {
        if (effectiveStreak >= badge.days && !newBadges.includes(badge.id)) {
          newBadges.push(badge.id);
          earned = true;
        }
      }

      if (earned) {
        useAppStore.setState({ badges: newBadges, coins: state.coins + 5 });
      }
    }, 50);
  }, [toggleHabit]);

  // ─── Month navigation ─────────────────────────────────────────
  const goToPrevMonth = useCallback(() => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  // ─── Motivational message ─────────────────────────────────────
  const motivation = getMotivationalMessage(completionRate);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f0f1a] border border-white/[0.08] text-[#e8e8ed] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Habit Tracker</DialogTitle>
        </VisuallyHidden>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-6">
          {/* ── Header ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Financial Habit Tracker
              </h2>
            </div>
            <p className="text-sm text-white/50">
              Roz ki aadat banao, financial freedom pao!
            </p>
          </motion.div>

          {/* ── Today's Check-in ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                Aaj ka Check-in
              </h3>
              <span className="text-xs text-white/40">
                {todayHabits.length}/{HABITS.length} done
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HABITS.map((habit) => {
                const isDone = todayHabits.includes(habit.id);
                return (
                  <motion.button
                    key={habit.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleHabit(todayStr, habit.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 text-left',
                      isDone
                        ? 'bg-green-500/[0.12] border-green-400/30 text-green-300'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/70 hover:bg-white/[0.05] hover:border-white/[0.12]'
                    )}
                  >
                    <span className="text-lg emoji-pulse">{habit.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{habit.label}</span>
                    {isDone && <Check className="w-3.5 h-3.5 ml-auto text-green-400 flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Streak Stats ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
              <div className="text-2xl font-bold text-orange-400">{streakInfo.current}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Current Streak</div>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <div className="text-2xl font-bold text-amber-400">{streakInfo.longest}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Longest Streak</div>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <div className="text-2xl font-bold text-purple-400">{completionRate}%</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Completion Rate</div>
            </div>
          </motion.div>

          {/* ── Motivational Message ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-amber-400/[0.06] border border-amber-400/[0.12] rounded-xl p-3 text-center"
          >
            <span className="text-lg mr-2">{motivation.emoji}</span>
            <span className="text-sm text-amber-300/90">{motivation.text}</span>
          </motion.div>

          {/* ── 7-Day Calendar View ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
              7-Day Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] text-white/30 w-32 pb-2"></th>
                    {last7Days.map((day) => {
                      const ds = formatDate(day);
                      const today = isToday(ds);
                      return (
                        <th key={ds} className="text-center pb-2 min-w-[40px]">
                          <div className={cn(
                            'text-[10px] uppercase tracking-wider',
                            today ? 'text-amber-400' : 'text-white/40'
                          )}>
                            {getDayLabel(day)}
                          </div>
                          <div className={cn(
                            'text-xs font-semibold',
                            today ? 'text-amber-400' : 'text-white/50'
                          )}>
                            {getDateLabel(day)}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {HABITS.map((habit) => (
                    <tr key={habit.id}>
                      <td className="py-1.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{habit.emoji}</span>
                          <span className="text-[11px] text-white/60 truncate max-w-[80px]">{habit.label}</span>
                        </div>
                      </td>
                      {last7Days.map((day) => {
                        const ds = formatDate(day);
                        const completed = (habitTracker[ds] || []).includes(habit.id);
                        const today = isToday(ds);
                        return (
                          <td key={ds} className="text-center py-1.5">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => handleToggleHabit(ds, habit.id)}
                              className={cn(
                                'w-7 h-7 rounded-md mx-auto flex items-center justify-center transition-all duration-200',
                                completed
                                  ? 'bg-green-400/20 border border-green-400/40'
                                  : today
                                    ? 'bg-white/[0.04] border border-amber-400/20 hover:bg-white/[0.08]'
                                    : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]'
                              )}
                            >
                              {completed && <Check className="w-3.5 h-3.5 text-green-400" />}
                            </motion.button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── 30-Day Streak Calendar ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                30-Day Streak Calendar
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrevMonth}
                  className="w-6 h-6 rounded-md bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xs text-white/50 min-w-[90px] text-center">
                  {new Date(viewMonth.year, viewMonth.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="w-6 h-6 rounded-md bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-[9px] text-white/25 text-center uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthCalendarData.map((cell, idx) => {
                if (!cell.inMonth) {
                  return <div key={`empty-${idx}`} className="w-3 h-3" />;
                }
                const completedCount = (habitTracker[cell.date] || []).length;
                const isTodayCell = isToday(cell.date);
                const isFutureCell = isFuture(cell.date);
                const intensity = Math.min(completedCount / HABITS.length, 1);

                return (
                  <motion.div
                    key={cell.date}
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      'w-3 h-3 rounded-[3px] transition-all duration-200 cursor-default',
                      isFutureCell
                        ? 'bg-white/[0.02]'
                        : intensity >= 1
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                          : intensity >= 0.66
                            ? 'bg-amber-400/70'
                            : intensity >= 0.33
                              ? 'bg-amber-400/40'
                              : intensity > 0
                                ? 'bg-amber-400/15'
                                : 'bg-white/[0.04]',
                      isTodayCell && 'ring-1 ring-amber-400/60'
                    )}
                    title={`${cell.date}: ${completedCount}/${HABITS.length} habits`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[9px] text-white/25">Less</span>
              <div className="w-3 h-3 rounded-[3px] bg-white/[0.04]" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-400/15" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-400/40" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-400/70" />
              <div className="w-3 h-3 rounded-[3px] bg-amber-400" />
              <span className="text-[9px] text-white/25">More</span>
            </div>
          </motion.div>

          {/* ── Achievement Badges ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
              Achievement Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACHIEVEMENT_BADGES.map((badge) => {
                const isEarned = badges.includes(badge.id);
                const isClose = streakInfo.current >= badge.days - 2 && streakInfo.current < badge.days;
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.03 }}
                    className={cn(
                      'relative p-3 rounded-xl border text-center transition-all duration-300',
                      isEarned
                        ? 'bg-amber-400/[0.08] border-amber-400/30 card-shine'
                        : isClose
                          ? 'bg-amber-400/[0.04] border-amber-400/15'
                          : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                    )}
                  >
                    <div className={cn(
                      'text-2xl mb-1',
                      isEarned ? 'emoji-pulse' : 'grayscale'
                    )}>
                      {badge.emoji}
                    </div>
                    <div className={cn(
                      'text-xs font-bold',
                      isEarned ? 'text-amber-400' : 'text-white/30'
                    )}>
                      {badge.label}
                    </div>
                    <div className="text-[9px] text-white/30 mt-0.5">
                      {badge.days}-day streak
                    </div>
                    {isEarned && (
                      <div className="absolute -top-1 -right-1">
                        <Check className="w-3.5 h-3.5 text-green-400 bg-[#0f0f1a] rounded-full" />
                      </div>
                    )}
                    {isClose && !isEarned && (
                      <div className="text-[8px] text-amber-400/60 mt-1 animate-pulse">
                        Almost there!
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ─── Habit Detail Legend ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-[10px] text-white/20 pb-2"
          >
            Tap on any habit to check/uncheck • Consistency is the key to financial freedom! 🔑
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
