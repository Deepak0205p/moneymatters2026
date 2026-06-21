'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Check, ChevronRight, Sparkles, X, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const HABITS = [
  {
    id: 'track',
    label: 'Aaj ka kharcha note kiya?',
    emoji: '💰',
    description: 'Track all expenses today'
  },
  {
    id: 'avoid',
    label: 'Unnecessary kharcha avoid kiya?',
    emoji: '☕',
    description: 'Skipped an avoidable expense'
  },
  {
    id: 'learn',
    label: 'Kuch naya financial concept padha?',
    emoji: '📚',
    description: 'Learned something new about money'
  },
  {
    id: 'save',
    label: 'Savings account mein kuch daala?',
    emoji: '💵',
    description: 'Added money to savings'
  },
  {
    id: 'check',
    label: 'UPI transactions check kiye?',
    emoji: '📱',
    description: 'Reviewed UPI spends'
  }
];

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function getStreakFromData(habitTracker, habitId) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker?.[dateStr] || []).includes(habitId);
    if (done) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function getPerfectDaysThisMonth(habitTracker) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month, day));
    const done = (habitTracker?.[dateStr] || []).length;
    if (done === HABITS.length) count++;
  }
  return count;
}

function getWeeklyHeatmap(habitTracker) {
  const today = new Date();
  const result = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    const done = (habitTracker?.[dateStr] || []).length;
    const intensity = done === 0 ? 0 : Math.min(4, Math.ceil((done / HABITS.length) * 4));
    result.push({
      date: d,
      intensity,
      dateStr
    });
  }
  return result;
}

const FLAME_TIERS = [
  { min: 30, emoji: '🏆', label: 'Master', color: '#F59E0B' },
  { min: 14, emoji: '💎', label: 'Adaat', color: '#8B5CF6' },
  { min: 7, emoji: '🔥', label: 'Streak', color: '#F97316' },
  { min: 3, emoji: '🌱', label: 'Shuruat', color: '#10B981' },
  { min: 1, emoji: '✨', label: 'Spark', color: '#06B6D4' },
  { min: 0, emoji: '💤', label: 'Start', color: '#64748B' }
];

function getFlameTier(streak) {
  return FLAME_TIERS.find(t => streak >= t.min) || FLAME_TIERS[FLAME_TIERS.length - 1];
}

export default function HabitTracker({ open, onClose }) {
  const {
    habitTracker,
    toggleHabit,
    addCoins,
    badges,
    addBadge
  } = useAppStore();

  const [perfectDayAwarded, setPerfectDayAwarded] = useState(false);
  const todayStr = formatDate(new Date());
  const todayDone = habitTracker?.[todayStr] || [];
  const allHabitsDone = todayDone.length === HABITS.length;

  useEffect(() => {
    if (allHabitsDone && !perfectDayAwarded) {
      setPerfectDayAwarded(true);
      addCoins(10);
      try {
        if (!badges?.includes('perfect-day')) {
          addBadge('perfect-day');
        }
      } catch (e) {}
      toast({
        title: 'Perfect Day! +10 Coins 🌟',
        description: 'Aaj ke saare financial habits complete! Keep it up.'
      });
    } else if (!allHabitsDone) {
      setPerfectDayAwarded(false);
    }
  }, [allHabitsDone, perfectDayAwarded, addCoins, addBadge, badges]);

  const bestStreak = useMemo(() => {
    return Math.max(...HABITS.map(h => getStreakFromData(habitTracker || {}, h.id)), 0);
  }, [habitTracker]);

  const streakTier = getFlameTier(bestStreak);
  const weeklyHeatmap = useMemo(() => getWeeklyHeatmap(habitTracker || {}), [habitTracker]);
  const perfectDays = useMemo(() => getPerfectDaysThisMonth(habitTracker || {}), [habitTracker]);
  const completionRate = Math.round((todayDone.length / HABITS.length) * 100);

  const handleToggle = (habitId) => {
    toggleHabit(todayStr, habitId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Calendar size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Aadat Tracker 📅</h2>
              <p className="text-[10px] text-zinc-400">Track and reinforce micro financial habits</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          
          {/* Streak details & summaries */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3 relative overflow-hidden">
              <span className="text-4xl filter drop-shadow-lg">{streakTier.emoji}</span>
              <div>
                <span className="text-xl font-black text-white block leading-none">{bestStreak} Days</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">Streak · {streakTier.label}</span>
              </div>
            </div>
            <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-lg">🌟</span>
              <div>
                <span className="text-xl font-black text-white block leading-none">{perfectDays}</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">Perfect Days</span>
              </div>
            </div>
          </div>

          {/* Today's progress card */}
          <div className="p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-zinc-400">Progress Today</span>
              <span className="text-emerald-400">{todayDone.length} / {HABITS.length} completed</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r ${
                  allHabitsDone ? 'from-amber-400 to-amber-500' : 'from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase">
              {allHabitsDone ? '🎉 Double Bonus Earned for a Perfect Day!' : `${HABITS.length - todayDone.length} more steps left to secure streak!`}
            </p>
          </div>

          {/* Swipe checklist details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Daily Checklist</h3>
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Swipe right to mark complete</span>
            </div>

            <div className="space-y-3">
              {HABITS.map(h => {
                const done = todayDone.includes(h.id);
                return (
                  <motion.div
                    key={h.id}
                    layout
                    whileTap={{ scale: 0.98 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 60 && !done) handleToggle(h.id);
                      else if (info.offset.x < -60 && done) handleToggle(h.id);
                    }}
                    className={`relative p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-grab active:cursor-grabbing ${
                      done 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5' 
                        : 'bg-[#0B0E19] border-white/[0.04] text-white hover:border-white/[0.08]'
                    }`}
                  >
                    {done && (
                      <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none rounded-2xl" />
                    )}

                    <div className="flex items-center gap-3 pr-8 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-lg shrink-0">
                        {h.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-black uppercase tracking-wide truncate ${done ? 'text-emerald-400' : 'text-white'}`}>{h.label}</p>
                        <p className="text-[9px] text-zinc-500 font-bold truncate mt-0.5">{h.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(h.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all focus:outline-none cursor-pointer border ${
                        done 
                          ? 'bg-emerald-500 border-transparent text-black' 
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-emerald-400'
                      }`}
                    >
                      <Check size={16} />
                    </button>

                    {/* Drag indicator arrow */}
                    {!done && (
                      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none">
                        <ChevronRight size={14} className="animate-pulse" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Heatmap calendar grid */}
          <div className="p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Weekly Heatmap 📅</h4>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">GitHub Style Contributions</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day, idx) => (
                <span key={idx} className="text-[9px] font-black text-zinc-600 text-center uppercase">{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weeklyHeatmap.map((day, idx) => {
                const isToday = day.dateStr === todayStr;
                const fillStyle = 
                  day.intensity === 0 
                    ? 'bg-white/[0.02] border-white/[0.04]' 
                    : day.intensity === 1 
                      ? 'bg-emerald-500/20 border-emerald-500/10' 
                      : day.intensity === 2 
                        ? 'bg-emerald-500/40 border-emerald-500/20' 
                        : day.intensity === 3 
                          ? 'bg-emerald-500/70 border-emerald-500/30' 
                          : 'bg-emerald-500 border-emerald-400/50';

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.01 }}
                    whileHover={{ scale: 1.15 }}
                    title={`${day.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}: Completed ${day.intensity}`}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[9px] font-black border transition-all ${fillStyle} ${
                      isToday ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#090D1A]' : ''
                    } ${day.intensity >= 3 ? 'text-black' : 'text-zinc-500'}`}
                  >
                    {day.date.getDate()}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[9px] text-zinc-600 font-black uppercase pt-1 border-t border-white/[0.03]">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.02] border border-white/[0.04]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* AI Tips & Suggestions */}
          <div className="p-4 rounded-3xl bg-purple-500/[0.03] border border-purple-500/15 flex gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-[40px] pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">AI ADVICE REMINDER</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold mt-1">
                {!allHabitsDone 
                  ? `Aaj ka checklist abhi tak incomplete hai! ⏰ Sirf ${HABITS.length - todayDone.length} aur baaki.` 
                  : bestStreak >= 7 
                    ? '7+ din streak! Tum next level pe ho. Kal bhi mat todo! 💪' 
                    : 'Perfect day! Aise hi roz karte raho — 7 din mein streak badge unlock! 🏆'}
              </p>
            </div>
          </div>

          {/* Achievements Gallery */}
          <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.04] space-y-3">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" />
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Unlocks & Badges</h3>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[
                { id: 'habit-shuruat', days: 3, emoji: '🌱', label: 'Shuruat' },
                { id: 'habit-consistent', days: 7, emoji: '🔥', label: 'Streak' },
                { id: 'habit-adaat', days: 14, emoji: '💎', label: 'Adaat' },
                { id: 'habit-master', days: 30, emoji: '🏆', label: 'Master' }
              ].map(b => {
                const earned = badges?.includes(b.id);
                return (
                  <div 
                    key={b.id} 
                    className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between items-center ${
                      earned 
                        ? 'bg-amber-500/5 border-amber-500/30' 
                        : 'bg-white/[0.01] border-white/[0.03] opacity-40'
                    }`}
                  >
                    <span className={`text-2xl block ${!earned ? 'grayscale filter' : ''}`}>{earned ? b.emoji : '🔒'}</span>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-wide block mt-1">{b.label}</span>
                    <span className="text-[9px] font-black text-amber-400 mt-0.5">{b.days}d Goal</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Aadat Tracker — daily verification resets at 12:00 AM local time
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { HabitTracker };