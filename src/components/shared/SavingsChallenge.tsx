'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Flame, Check, Trophy, Coins, TrendingUp, Calendar,
  Sparkles, RotateCcw, IndianRupee, Zap, Award, Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SavingsChallengeProps {
  open: boolean;
  onClose: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PRESET_GOALS = [
  { amount: 50, label: 'Chhota Kadam', sublabel: '₹50/din', accent: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', emoji: '🌱' },
  { amount: 100, label: 'Mehnat Ka Fal', sublabel: '₹100/din', accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', emoji: '💪' },
  { amount: 200, label: 'Bada Sapna', sublabel: '₹200/din', accent: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', emoji: '🚀' },
];

const MILESTONE_DAYS = [7, 14, 21, 30];

const CONFETTI_COLORS = ['#f59e0b', '#4ade80', '#fb923c', '#f87171', '#a78bfa', '#38bdf8', '#fbbf24'];

const BADGE_MAP: Record<number, string> = {
  7: 'savings-streak-7',
  14: 'savings-streak-14',
  30: 'savings-streak-30',
};

const BADGE_LABELS: Record<string, string> = {
  'savings-streak-7': '🏅 7 Din Ka Streak',
  'savings-streak-14': '🥈 14 Din Ka Streak',
  'savings-streak-30': '🏆 30 Din Champion',
};

/* ------------------------------------------------------------------ */
/*  Confetti Component                                                 */
/* ------------------------------------------------------------------ */

function ConfettiBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!active) {
      const clearTimer = setTimeout(() => setParticles([]), 0);
      return () => clearTimeout(clearTimer);
    }

    const newParticles: ConfettiParticle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -20,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }));
    const setTimer = setTimeout(() => setParticles(newParticles), 0);

    const endTimer = setTimeout(() => setParticles([]), 3000);
    return () => {
      clearTimeout(setTimer);
      clearTimeout(endTimer);
    };
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, y: 0, rotate: p.rotation, scale: 1 }}
          animate={{
            opacity: 0,
            y: 600,
            rotate: p.rotation + 720,
            scale: 0.5,
          }}
          transition={{
            duration: 2.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Ring Component                                            */
/* ------------------------------------------------------------------ */

function ChallengeProgressRing({ progress, size = 140 }: { progress: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ lineHeight: 1, color: '#e8e8ed' }}
          key={Math.round(clampedProgress)}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        >
          {Math.round(clampedProgress)}%
        </motion.span>
        <span className="text-[10px] mt-1" style={{ color: '#8888a0' }}>Complete</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Day Cell Component                                                 */
/* ------------------------------------------------------------------ */

function DayCell({
  day,
  saved,
  amount,
  isToday,
  isFuture,
  isMilestone,
  dailyGoal,
  onTap,
  index,
}: {
  day: number;
  saved: boolean;
  amount: number;
  isToday: boolean;
  isFuture: boolean;
  isMilestone: boolean;
  dailyGoal: number;
  onTap: () => void;
  index: number;
}) {
  return (
    <motion.button
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl aspect-square transition-all duration-200',
        'w-full text-xs font-medium',
        saved && 'border border-green-400/30',
        isToday && !saved && 'border-2 border-amber-400/60',
        isFuture && !isToday && 'opacity-30',
        !saved && !isToday && !isFuture && 'opacity-50',
        isMilestone && !saved && 'border border-amber-500/20',
      )}
      style={{
        backgroundColor: saved ? 'rgba(74,222,128,0.1)' : '#1a1a2e',
        cursor: isToday && !saved ? 'pointer' : 'default',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.3, type: 'spring', stiffness: 200 }}
      whileTap={isToday && !saved ? { scale: 0.9 } : undefined}
      onClick={isToday && !saved ? onTap : undefined}
      disabled={!isToday || saved}
    >
      {/* Milestone star indicator */}
      {isMilestone && !saved && (
        <div className="absolute -top-0.5 -right-0.5">
          <Star className="w-2.5 h-2.5 text-amber-500/50" fill="currentColor" />
        </div>
      )}

      {/* Day number */}
      <span
        className={cn(
          'text-[10px] sm:text-xs',
          saved ? 'text-green-400' : isToday ? 'text-amber-400' : 'text-[#8888a0]',
        )}
      >
        {day}
      </span>

      {/* Saved indicator */}
      {saved && (
        <motion.div
          className="flex items-center justify-center mt-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
        </motion.div>
      )}

      {/* Amount for saved days */}
      {saved && amount > 0 && (
        <span className="text-[7px] sm:text-[8px] text-green-400/70 mt-0.5 leading-none">
          ₹{amount}
        </span>
      )}

      {/* Pulsing today indicator */}
      {isToday && !saved && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-amber-400/40"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main SavingsChallenge Component                                    */
/* ------------------------------------------------------------------ */

export default function SavingsChallenge({ open, onClose }: SavingsChallengeProps) {
  const {
    savingsChallenge,
    startSavingsChallenge,
    markSavingsDay,
    resetSavingsChallenge,
    addCoins,
    badges,
  } = useAppStore();

  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [markDayAmount, setMarkDayAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const { isActive, days, dailyGoal, totalSaved, longestStreak, startDate } = savingsChallenge;

  /* ---- Derived state ---- */
  const savedDaysCount = useMemo(() => days.filter((d) => d.saved).length, [days]);
  const progressPercent = useMemo(() => Math.round((savedDaysCount / 30) * 100), [savedDaysCount]);

  const currentDay = useMemo(() => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
    return Math.max(1, Math.min(30, diff));
  }, [startDate]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i].saved) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [days]);

  const isCompleted = savedDaysCount === 30;

  const todayDay = useMemo(() => days.find((d) => d.day === currentDay), [days, currentDay]);

  /* ---- Check milestones on mark ---- */
  const prevSavedCountRef = useRef(savedDaysCount);
  useEffect(() => {
    if (savedDaysCount > prevSavedCountRef.current) {
      if (MILESTONE_DAYS.includes(savedDaysCount)) {
        const startTimer = setTimeout(() => setShowConfetti(true), 0);
        const endTimer = setTimeout(() => setShowConfetti(false), 3500);
        return () => {
          clearTimeout(startTimer);
          clearTimeout(endTimer);
        };
      }
    }
    prevSavedCountRef.current = savedDaysCount;
  }, [savedDaysCount]);

  /* ---- Completion confetti ---- */
  useEffect(() => {
    if (isCompleted) {
      const startTimer = setTimeout(() => setShowConfetti(true), 0);
      const endTimer = setTimeout(() => setShowConfetti(false), 5000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isCompleted]);

  /* ---- Handlers ---- */
  const handleStartChallenge = useCallback(() => {
    const goal = selectedGoal || parseInt(customAmount);
    if (!goal || goal <= 0) return;
    startSavingsChallenge(goal);
    setSelectedGoal(null);
    setCustomAmount('');
  }, [selectedGoal, customAmount, startSavingsChallenge]);

  const handleMarkDay = useCallback(() => {
    const amount = parseInt(markDayAmount) || dailyGoal;
    if (amount <= 0) return;
    markSavingsDay(currentDay, amount);
    addCoins(5);
    setShowAmountInput(false);
    setMarkDayAmount('');
  }, [markDayAmount, dailyGoal, currentDay, markSavingsDay, addCoins]);

  const handleAbandon = useCallback(() => {
    resetSavingsChallenge();
    setConfirmAbandon(false);
    setSelectedGoal(null);
    setCustomAmount('');
  }, [resetSavingsChallenge]);

  const handleNewChallenge = useCallback(() => {
    resetSavingsChallenge();
    setSelectedGoal(null);
    setCustomAmount('');
  }, [resetSavingsChallenge]);

  /* ---- Focus amount input when shown ---- */
  useEffect(() => {
    if (showAmountInput && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [showAmountInput]);

  /* ---- Earned badges for this challenge ---- */
  const earnedBadges = useMemo(() => {
    return Object.entries(BADGE_LABELS)
      .filter(([key]) => badges.includes(key))
      .map(([key, label]) => ({ key, label }));
  }, [badges]);

  /* ---- Render: Setup Screen ---- */
  const renderSetup = () => (
    <motion.div
      className="flex flex-col items-center px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <motion.div
        className="text-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            💰 Bachat Ki Challenge
          </span>
        </h2>
        <p className="text-sm" style={{ color: '#a0a0b8' }}>
          30 din, roz thoda bachao, bada fund banao!
        </p>
      </motion.div>

      {/* Preset Goal Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 mb-6">
        {PRESET_GOALS.map((goal, i) => (
          <motion.button
            key={goal.amount}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
              'hover:scale-[1.02] active:scale-[0.98]',
            )}
            style={{
              backgroundColor: selectedGoal === goal.amount ? goal.bg : '#1a1a2e',
              borderColor: selectedGoal === goal.amount ? goal.accent : 'rgba(255,255,255,0.06)',
              boxShadow: selectedGoal === goal.amount ? `0 0 20px ${goal.border}` : 'none',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            whileHover={{ boxShadow: `0 0 24px ${goal.border}` }}
            onClick={() => {
              setSelectedGoal(goal.amount);
              setCustomAmount('');
            }}
          >
            <span className="text-2xl">{goal.emoji}</span>
            <span className="text-lg font-bold" style={{ color: goal.accent }}>
              {goal.sublabel}
            </span>
            <span className="text-xs font-medium" style={{ color: '#a0a0b8' }}>
              {goal.label}
            </span>
            {selectedGoal === goal.amount && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: goal.accent }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Check className="w-3 h-3 text-black" strokeWidth={3} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <motion.div
        className="w-full mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs mb-2 font-medium" style={{ color: '#8888a0' }}>
          Ya apna amount daalo:
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">₹</span>
          <Input
            type="number"
            placeholder="Custom amount / din"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedGoal(null);
            }}
            className="pl-7 h-11 text-sm font-medium border-white/[0.06] bg-[#1a1a2e] text-[#e8e8ed] placeholder:text-[#8888a0] focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
          />
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          className={cn(
            'w-full h-12 text-base font-bold rounded-xl transition-all duration-300',
            'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
            'hover:from-amber-400 hover:to-yellow-400',
            'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
            'active:scale-[0.98]',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
          disabled={!selectedGoal && !customAmount}
          onClick={handleStartChallenge}
        >
          <Zap className="w-5 h-5 mr-2" />
          Shuru Karo!
        </Button>
      </motion.div>

      {/* Potential savings hint */}
      {(selectedGoal || customAmount) && (
        <motion.p
          className="mt-3 text-xs text-center"
          style={{ color: '#8888a0' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          30 din mein total: <span className="text-amber-400 font-bold">₹{((selectedGoal || parseInt(customAmount) || 0) * 30).toLocaleString('en-IN')}</span> bachaoge!
        </motion.p>
      )}
    </motion.div>
  );

  /* ---- Render: Tracker Screen ---- */
  const renderTracker = () => (
    <motion.div
      className="flex flex-col items-center px-4 py-4 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with day count and streak */}
      <div className="flex items-center justify-between w-full mb-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Flame
            className="w-5 h-5 text-amber-400"
            strokeWidth={2.5}
          />
          <motion.span
            className="text-lg font-bold"
            style={{ color: '#e8e8ed' }}
            animate={currentStreak > 0 ? {
              scale: [1, 1.15, 1],
            } : {}}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            Day {currentDay}/30
          </motion.span>
        </motion.div>
        {currentStreak > 0 && (
          <motion.div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              🔥
            </motion.div>
            <span className="text-xs font-bold text-amber-400">{currentStreak} streak</span>
          </motion.div>
        )}
      </div>

      {/* Progress Ring */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
      >
        <ChallengeProgressRing progress={progressPercent} size={140} />
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="w-full grid grid-cols-3 gap-2 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        {[
          { label: 'Total Saved', value: `₹${totalSaved.toLocaleString('en-IN')}`, icon: Coins, color: '#4ade80' },
          { label: 'Current Streak', value: `${currentStreak} din`, icon: Flame, color: '#f59e0b' },
          { label: 'Longest Streak', value: `${longestStreak} din`, icon: TrendingUp, color: '#fb923c' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-1 p-3 rounded-xl"
            style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            <span className="text-sm font-bold" style={{ color: '#e8e8ed' }}>{stat.value}</span>
            <span className="text-[10px]" style={{ color: '#8888a0' }}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily goal reminder */}
      <motion.div
        className="w-full flex items-center justify-between p-3 rounded-xl mb-4"
        style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs" style={{ color: '#a0a0b8' }}>Roz ka goal</span>
        </div>
        <span className="text-sm font-bold text-amber-400">₹{dailyGoal}/din</span>
      </motion.div>

      {/* 30-Day Grid Calendar */}
      <div className="w-full mb-4">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {days.map((dayData, i) => (
            <DayCell
              key={dayData.day}
              day={dayData.day}
              saved={dayData.saved}
              amount={dayData.amount}
              isToday={dayData.day === currentDay}
              isFuture={dayData.day > currentDay}
              isMilestone={MILESTONE_DAYS.includes(dayData.day)}
              dailyGoal={dailyGoal}
              onTap={() => {
                setMarkDayAmount(String(dailyGoal));
                setShowAmountInput(true);
              }}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Mark Today Button */}
      {todayDay && !todayDay.saved && (
        <motion.div
          className="w-full mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            className={cn(
              'w-full h-11 text-sm font-bold rounded-xl',
              'bg-gradient-to-r from-green-500 to-emerald-500 text-black',
              'hover:from-green-400 hover:to-emerald-400',
              'hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]',
              'active:scale-[0.98]',
            )}
            onClick={() => {
              setMarkDayAmount(String(dailyGoal));
              setShowAmountInput(true);
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Aaj Ki Bachat Mark Karo — ₹{dailyGoal}
          </Button>
        </motion.div>
      )}

      {/* Amount Input Dialog */}
      <AnimatePresence>
        {showAmountInput && (
          <motion.div
            className="w-full p-4 rounded-2xl mb-3"
            style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(245,158,11,0.2)' }}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium mb-3" style={{ color: '#e8e8ed' }}>
              Kitne ₹ bachaaye aaj?
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 font-bold">₹</span>
              <Input
                ref={amountInputRef}
                type="number"
                value={markDayAmount}
                onChange={(e) => setMarkDayAmount(e.target.value)}
                className="h-10 text-sm font-bold border-white/[0.06] bg-[#0a0a0f] text-[#e8e8ed] focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMarkDay();
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 h-9 text-xs font-bold rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-400 hover:to-emerald-400"
                onClick={handleMarkDay}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Mark Karo
              </Button>
              <Button
                variant="ghost"
                className="h-9 text-xs rounded-lg text-[#8888a0] hover:text-[#e8e8ed] hover:bg-white/5"
                onClick={() => {
                  setShowAmountInput(false);
                  setMarkDayAmount('');
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone progress info */}
      <div className="w-full flex items-center gap-2 mb-4">
        {MILESTONE_DAYS.map((milestone) => {
          const reached = savedDaysCount >= milestone;
          return (
            <div
              key={milestone}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all duration-300',
              )}
              style={{
                backgroundColor: reached ? '#f59e0b' : '#1a1a2e',
                boxShadow: reached ? '0 0 6px rgba(245,158,11,0.3)' : 'none',
              }}
            />
          );
        })}
      </div>
      <div className="w-full flex justify-between mb-5 px-0.5">
        {MILESTONE_DAYS.map((milestone) => (
          <span key={milestone} className="text-[9px]" style={{ color: savedDaysCount >= milestone ? '#f59e0b' : '#8888a0' }}>
            Day {milestone}
          </span>
        ))}
      </div>

      {/* Abandon Button */}
      {!confirmAbandon ? (
        <motion.button
          className="text-xs font-medium px-4 py-2 rounded-lg transition-colors duration-200"
          style={{ color: '#f87171', backgroundColor: 'rgba(248,113,113,0.06)' }}
          whileHover={{ backgroundColor: 'rgba(248,113,113,0.12)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setConfirmAbandon(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Challenge Chhod Do
        </motion.button>
      ) : (
        <motion.div
          className="flex items-center gap-2 p-3 rounded-xl w-full"
          style={{ backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xs flex-1" style={{ color: '#f87171' }}>
            Pakka chhodna hai? Sara progress chale jayega!
          </p>
          <Button
            className="h-7 text-[10px] font-bold rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
            onClick={handleAbandon}
          >
            Haan, Chhod Do
          </Button>
          <Button
            variant="ghost"
            className="h-7 text-[10px] rounded-md text-[#8888a0] hover:text-[#e8e8ed]"
            onClick={() => setConfirmAbandon(false)}
          >
            Nahi
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  /* ---- Render: Completion Screen ---- */
  const renderCompletion = () => (
    <motion.div
      className="flex flex-col items-center px-4 py-6 sm:px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
    >
      {/* Trophy with animation */}
      <motion.div
        className="relative mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,146,60,0.1))',
            border: '2px solid rgba(245,158,11,0.3)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(245,158,11,0.2)',
              '0 0 40px rgba(245,158,11,0.4)',
              '0 0 20px rgba(245,158,11,0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Trophy className="w-10 h-10 text-amber-400" />
        </motion.div>
        {/* Sparkles around trophy */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -left-1"
          animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-center mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
          Tumne Kiya! 🎉
        </span>
      </motion.h2>
      <motion.p
        className="text-sm text-center mb-6"
        style={{ color: '#a0a0b8' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        30 din complete! Kamaal kar diya!
      </motion.p>

      {/* Final Stats */}
      <motion.div
        className="w-full grid grid-cols-2 gap-3 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="flex flex-col items-center gap-2 p-4 rounded-2xl"
          style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(74,222,128,0.15)' }}
        >
          <Coins className="w-6 h-6 text-green-400" />
          <span className="text-xl font-bold" style={{ color: '#e8e8ed' }}>
            ₹{totalSaved.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px]" style={{ color: '#8888a0' }}>Total Saved</span>
        </div>
        <div
          className="flex flex-col items-center gap-2 p-4 rounded-2xl"
          style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(245,158,11,0.15)' }}
        >
          <Flame className="w-6 h-6 text-amber-400" />
          <span className="text-xl font-bold" style={{ color: '#e8e8ed' }}>
            {longestStreak} din
          </span>
          <span className="text-[10px]" style={{ color: '#8888a0' }}>Best Streak</span>
        </div>
      </motion.div>

      {/* Badge Earned */}
      {earnedBadges.length > 0 && (
        <motion.div
          className="w-full mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="flex flex-col items-center gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(245,158,11,0.12)' }}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">Badge Earned!</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {earnedBadges.map((badge) => (
                <span
                  key={badge.key}
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b',
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Motivational message */}
      <motion.div
        className="w-full p-3 rounded-xl mb-5 text-center"
        style={{ backgroundColor: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.12)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs" style={{ color: '#4ade80' }}>
          💡 Agar yeh ₹{totalSaved.toLocaleString('en-IN')} har mahine invest karte ho toh saal mein{' '}
          <span className="font-bold">₹{Math.round(totalSaved * 12 * 1.12).toLocaleString('en-IN')}</span> tak ban sakta hai (12% return se)!
        </p>
      </motion.div>

      {/* New Challenge Button */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          className={cn(
            'w-full h-12 text-base font-bold rounded-xl',
            'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
            'hover:from-amber-400 hover:to-yellow-400',
            'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
            'active:scale-[0.98]',
          )}
          onClick={handleNewChallenge}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Nayi Challenge Shuru Karo
        </Button>
      </motion.div>
    </motion.div>
  );

  /* ---- Main Render ---- */
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md w-[calc(100%-1.5rem)] sm:w-full max-h-[92vh] overflow-y-auto rounded-2xl border-white/[0.06] p-0"
        style={{ backgroundColor: '#0a0a0f' }}
        showCloseButton={false}
      >
        {/* Custom close button */}
        <motion.button
          className="absolute top-3 right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8888a0' }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#e8e8ed' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Confetti overlay */}
        <ConfettiBurst active={showConfetti} />

        {/* Header bar */}
        <div
          className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3"
          style={{
            backgroundColor: 'rgba(10,10,15,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
            >
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-sm font-bold" style={{ color: '#e8e8ed' }}>
              Savings Challenge
            </span>
          </div>
        </div>

        {/* Screen Content */}
        <AnimatePresence mode="wait">
          {!isActive && !isCompleted && <div key="setup">{renderSetup()}</div>}
          {isActive && !isCompleted && <div key="tracker">{renderTracker()}</div>}
          {isCompleted && <div key="completion">{renderCompletion()}</div>}
        </AnimatePresence>

        {/* Hidden Dialog accessibility elements */}
        <DialogHeader className="sr-only">
          <DialogTitle>Savings Challenge</DialogTitle>
          <DialogDescription>30-day savings challenge tracker</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
