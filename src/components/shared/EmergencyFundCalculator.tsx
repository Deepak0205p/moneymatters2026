'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Minus, ChevronRight, ChevronLeft, Copy, Check,
  AlertTriangle, Wallet, PiggyBank,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { formatCurrency, formatIndianNumber } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────
interface EmergencyFundCalculatorProps {
  open: boolean;
  onClose: () => void;
}

// ─── Expense Category ───────────────────────────────────────
interface ExpenseCategory {
  key: string;
  label: string;
  labelHi: string;
  emoji: string;
  color: string;          // tailwind text color
  bg: string;             // tailwind bg color
  barColor: string;       // CSS color for bar
  defaultValue: number;
}

// ─── Constants ──────────────────────────────────────────────
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { key: 'rent',      label: 'Rent / EMI',   labelHi: 'Rent ya EMI',     emoji: '🏠', color: 'text-rose-400',    bg: 'bg-rose-400/10',    barColor: '#f43f5e', defaultValue: 15000 },
  { key: 'food',      label: 'Food',          labelHi: 'Khana',           emoji: '🍛', color: 'text-amber-400',   bg: 'bg-amber-400/10',   barColor: '#f59e0b', defaultValue: 8000 },
  { key: 'transport', label: 'Transport',     labelHi: 'Travel',          emoji: '🚗', color: 'text-blue-400',    bg: 'bg-blue-400/10',    barColor: '#3b82f6', defaultValue: 5000 },
  { key: 'emi',       label: 'Other EMI',     labelHi: 'Aur EMI',         emoji: '💳', color: 'text-purple-400',  bg: 'bg-purple-400/10',  barColor: '#a855f7', defaultValue: 5000 },
  { key: 'utilities', label: 'Utilities',     labelHi: 'Bills / Utility', emoji: '⚡', color: 'text-emerald-400', bg: 'bg-emerald-400/10', barColor: '#10b981', defaultValue: 4000 },
  { key: 'other',     label: 'Other',         labelHi: 'Aur kharcha',     emoji: '📦', color: 'text-gray-400',    bg: 'bg-gray-400/10',    barColor: '#9ca3af', defaultValue: 3000 },
];

const MONTH_OPTIONS = [3, 6, 9, 12];

const TIPS = [
  { emoji: '🛡️', text: 'Emergency fund matlab insurance hai — bina policy waala! Job chale jaaye toh 6 mahine tak rent aur kharcha chalao.' },
  { emoji: '🏦', text: 'Emergency fund ko alag account mein rakhho — savings account ya liquid fund, taki impulse spending na ho.' },
  { emoji: '📈', text: 'Kam se kam 3 mahine ka kharcha save karo — ideally 6 mahine ka. Medical emergency kisi bhi waqt aa sakta hai!' },
  { emoji: '🚫', text: 'Emergency fund se phone nahi, vacation nahi! Ye sirf real emergencies ke liye hai — job loss, medical, urgent repair.' },
  { emoji: '⏳', text: 'Agar 6 mahine ka fund lag raha hai bahut, toh chhota se shuru karo — 1 mahine ka bhi bahut value hai!' },
];

// ─── Progress Ring Component ────────────────────────────────
function AnimatedProgressRing({ progress, size = 180 }: { progress: number; size?: number }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  // Color based on progress
  const ringColor =
    clamped >= 100 ? '#22c55e' :
    clamped >= 75 ? '#84cc16' :
    clamped >= 50 ? '#f59e0b' :
    clamped >= 25 ? '#f97316' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference, opacity: 0.15 }}
          animate={{ strokeDashoffset, opacity: 0.15 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: 'blur(6px)' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold tabular-nums"
          style={{ color: ringColor, lineHeight: 1 }}
          key={Math.round(clamped)}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
        >
          {Math.round(clamped)}%
        </motion.span>
        <span className="text-[10px] text-[#8888a0] mt-1">covered</span>
      </div>
    </div>
  );
}

// ─── Step Indicator ─────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isCompleted = stepNum < current;
        return (
          <div key={stepNum} className="flex items-center gap-2">
            <motion.div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${isActive ? 'bg-amber-400 text-[#0a0a0f] shadow-lg shadow-amber-400/30' :
                  isCompleted ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40' :
                  'bg-white/[0.05] text-[#6666a0] border border-white/[0.08]'}
              `}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
            </motion.div>
            {i < total - 1 && (
              <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-amber-400/60' : 'bg-white/[0.08]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Motivational Message ───────────────────────────────────
function getMotivationalMessage(pct: number): { text: string; emoji: string; color: string } {
  if (pct >= 100) return { text: 'Emergency fund ready! 🎉', emoji: '🛡️', color: 'text-green-400' };
  if (pct >= 75)  return { text: 'Bas thoda aur!', emoji: '💪', color: 'text-lime-400' };
  if (pct >= 50)  return { text: 'Almost there!', emoji: '🔥', color: 'text-amber-400' };
  if (pct >= 25)  return { text: 'Accha ja raha hai!', emoji: '👍', color: 'text-orange-400' };
  return { text: 'Shuru karo!', emoji: '🚀', color: 'text-rose-400' };
}

// ─── Main Component ─────────────────────────────────────────
export default function EmergencyFundCalculator({ open, onClose }: EmergencyFundCalculatorProps) {
  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Monthly expenses
  const [expenses, setExpenses] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    EXPENSE_CATEGORIES.forEach((c) => { init[c.key] = c.defaultValue; });
    return init;
  });

  // Step 2: Coverage months
  const [months, setMonths] = useState(6);

  // Step 3: Already saved
  const [alreadySaved, setAlreadySaved] = useState(0);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Computed
  const totalMonthly = useMemo(() =>
    Object.values(expenses).reduce((sum, v) => sum + v, 0), [expenses]);

  const emergencyGoal = useMemo(() => totalMonthly * months, [totalMonthly, months]);

  const progressPct = useMemo(() =>
    emergencyGoal > 0 ? Math.min(100, (alreadySaved / emergencyGoal) * 100) : 0,
    [alreadySaved, emergencyGoal]);

  const remaining = useMemo(() =>
    Math.max(0, emergencyGoal - alreadySaved), [emergencyGoal, alreadySaved]);

  const motivation = useMemo(() => getMotivationalMessage(progressPct), [progressPct]);

  // Adjust a single expense
  const adjustExpense = useCallback((key: string, delta: number) => {
    setExpenses((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  }, []);

  const setExpense = useCallback((key: string, value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setExpenses((prev) => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  }, []);

  // Copy result
  const handleCopy = useCallback(async () => {
    const text = [
      `🛡️ Emergency Fund Calculator - RUPAIYA 101`,
      ``,
      `📊 Monthly Expenses: ₹${totalMonthly.toLocaleString('en-IN')}`,
      `📅 Coverage: ${months} months`,
      `🎯 Emergency Fund Goal: ₹${emergencyGoal.toLocaleString('en-IN')}`,
      `💰 Already Saved: ₹${alreadySaved.toLocaleString('en-IN')}`,
      `📈 Progress: ${Math.round(progressPct)}%`,
      `${motivation.emoji} ${motivation.text}`,
      `💡 ${remaining > 0 ? `Aur ₹${remaining.toLocaleString('en-IN')} bachana hai!` : 'Target complete!'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  }, [totalMonthly, months, emergencyGoal, alreadySaved, progressPct, motivation, remaining]);

  // Reset on close - handled via onOpenChange
  const resetForm = useCallback(() => {
    setStep(1);
    const init: Record<string, number> = {};
    EXPENSE_CATEGORIES.forEach((c) => { init[c.key] = c.defaultValue; });
    setExpenses(init);
    setMonths(6);
    setAlreadySaved(0);
    setCopied(false);
  }, []);

  const handleDialogChange = useCallback((v: boolean) => {
    if (!v) {
      resetForm();
      onClose();
    }
  }, [resetForm, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f0f1a] border border-white/[0.08] text-[#e8e8ed] premium-dialog-overlay"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Emergency Fund Calculator</DialogTitle>
        </VisuallyHidden>

        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Shield className="w-5 h-5 text-amber-400" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-white">Emergency Fund Calculator</h2>
              <p className="text-xs text-[#8888a0] leading-tight">
                Bima hai bina policy waala — kitna chahiye calculate karo!
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <StepIndicator current={step} total={3} />
        </div>

        {/* ── Content ── */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* ━━━ STEP 1: Monthly Expenses ━━━ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Monthly Expenses</span>
                </div>
                <p className="text-xs text-[#8888a0]">Har mahine ka kharcha batao — kitna lagta hai?</p>

                {/* Expense Inputs */}
                <div className="space-y-3">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat.emoji}</span>
                          <div>
                            <span className={`text-xs font-semibold ${cat.color}`}>{cat.label}</span>
                            <span className="text-[10px] text-[#6666a0] ml-1.5">{cat.labelHi}</span>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-white tabular-nums">
                          ₹{(expenses[cat.key] || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adjustExpense(cat.key, -1000)}
                          className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                          aria-label={`Decrease ${cat.label}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={(expenses[cat.key] || 0).toLocaleString('en-IN')}
                          onChange={(e) => setExpense(cat.key, e.target.value)}
                          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-center text-sm font-medium text-white tabular-nums focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-all"
                          aria-label={`${cat.label} amount`}
                        />
                        <button
                          onClick={() => adjustExpense(cat.key, 1000)}
                          className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                          aria-label={`Increase ${cat.label}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total Monthly */}
                <div className="rounded-xl bg-amber-400/10 border border-amber-500/15 p-4 text-center">
                  <span className="text-xs text-amber-400/80 block mb-1">Total Monthly Expenses</span>
                  <motion.span
                    key={totalMonthly}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-extrabold text-amber-400 tabular-nums"
                  >
                    ₹{totalMonthly.toLocaleString('en-IN')}
                  </motion.span>
                </div>

                {/* Next button */}
                <button
                  onClick={() => setStep(2)}
                  disabled={totalMonthly === 0}
                  className="w-full py-3 rounded-xl bg-amber-400 text-[#0a0a0f] font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Aage badho <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ━━━ STEP 2: Coverage Months ━━━ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Kitne mahine ka fund chahiye?</span>
                </div>
                <p className="text-xs text-[#8888a0]">Experts recommend 6 months — but tu decide kar!</p>

                {/* Month Selector Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {MONTH_OPTIONS.map((m) => {
                    const isSelected = months === m;
                    const goalForMonth = totalMonthly * m;
                    return (
                      <motion.button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`
                          relative rounded-xl border p-4 text-left transition-all duration-200
                          ${isSelected
                            ? 'bg-amber-400/10 border-amber-400/40 shadow-lg shadow-amber-400/10'
                            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'}
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="monthHighlight"
                            className="absolute inset-0 rounded-xl border-2 border-amber-400/30"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <div className="text-2xl mb-1">
                          {m === 3 ? '🌱' : m === 6 ? '🌿' : m === 9 ? '🌳' : '🏔️'}
                        </div>
                        <div className={`text-lg font-extrabold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                          {m} Months
                        </div>
                        <div className="text-xs text-[#8888a0] mt-0.5">
                          {m === 3 ? 'Basic safety' : m === 6 ? 'Recommended' : m === 9 ? 'Strong cover' : 'Full shield'}
                        </div>
                        <div className={`text-xs font-semibold mt-2 ${isSelected ? 'text-amber-400' : 'text-[#6666a0]'}`}>
                          ₹{goalForMonth.toLocaleString('en-IN')}
                        </div>
                        {m === 6 && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full">
                            BEST
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Emergency Goal Display */}
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400/80 font-semibold">Your Emergency Fund Goal</span>
                  </div>
                  <motion.span
                    key={emergencyGoal}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-extrabold text-white tabular-nums"
                  >
                    ₹{emergencyGoal.toLocaleString('en-IN')}
                  </motion.span>
                  <div className="text-[10px] text-[#8888a0] mt-1">
                    {months} × ₹{totalMonthly.toLocaleString('en-IN')} monthly
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#8888a0] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Pichla
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-amber-400 text-[#0a0a0f] font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
                  >
                    Aage badho <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ━━━ STEP 3: Already Saved + Results ━━━ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Already Saved Input */}
                <div className="rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <PiggyBank className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Kitna already save hai?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAlreadySaved((prev) => Math.max(0, prev - 5000))}
                      className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Decrease saved amount"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={alreadySaved.toLocaleString('en-IN')}
                      onChange={(e) => {
                        const num = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                        setAlreadySaved(isNaN(num) ? 0 : num);
                      }}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-center text-lg font-bold text-white tabular-nums focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition-all"
                      aria-label="Already saved amount"
                    />
                    <button
                      onClick={() => setAlreadySaved((prev) => prev + 5000)}
                      className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Increase saved amount"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Ring + Motivational Message */}
                <div className="rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5">
                  <div className="flex flex-col items-center gap-4">
                    <AnimatedProgressRing progress={progressPct} size={180} />

                    {/* Motivational Message */}
                    <motion.div
                      key={motivation.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <span className={`text-lg font-bold ${motivation.color}`}>
                        {motivation.text}
                      </span>
                    </motion.div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 w-full">
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                        <div className="text-[10px] text-[#8888a0] mb-1">Goal</div>
                        <div className="text-sm font-bold text-amber-400 tabular-nums">
                          ₹{formatIndianNumber(emergencyGoal)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                        <div className="text-[10px] text-[#8888a0] mb-1">Saved</div>
                        <div className="text-sm font-bold text-emerald-400 tabular-nums">
                          ₹{formatIndianNumber(alreadySaved)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                        <div className="text-[10px] text-[#8888a0] mb-1">Remaining</div>
                        <div className="text-sm font-bold text-rose-400 tabular-nums">
                          ₹{formatIndianNumber(remaining)}
                        </div>
                      </div>
                    </div>

                    {/* Remaining message */}
                    {remaining > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#8888a0] text-center"
                      >
                        Aur <span className="text-amber-400 font-semibold">₹{remaining.toLocaleString('en-IN')}</span> bachana hai — tu kar sakta hai! 💪
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Expense Breakdown Chart */}
                <div className="rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Expense Breakdown</span>
                    <span className="text-[10px] text-[#8888a0] ml-auto">₹{totalMonthly.toLocaleString('en-IN')}/mo</span>
                  </div>

                  <div className="space-y-3">
                    {EXPENSE_CATEGORIES.map((cat) => {
                      const val = expenses[cat.key] || 0;
                      const pct = totalMonthly > 0 ? (val / totalMonthly) * 100 : 0;
                      return (
                        <div key={cat.key}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{cat.emoji}</span>
                              <span className="text-xs text-[#c0c0d0] font-medium">{cat.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${cat.color} tabular-nums`}>
                                ₹{val.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-[#6666a0] tabular-nums w-9 text-right">
                                {Math.round(pct)}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cat.barColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips Section */}
                <div className="rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Emergency Fund Tips</span>
                  </div>
                  <div className="space-y-2.5">
                    {TIPS.map((tip, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                        className="flex items-start gap-2.5"
                      >
                        <span className="text-sm shrink-0 mt-0.5">{tip.emoji}</span>
                        <p className="text-xs text-[#c0c0d0] leading-relaxed">{tip.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#8888a0] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Pichla
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-amber-400/20 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Share Result
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
