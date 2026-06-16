'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { dailyChoices } from '@/lib/data/daily-choices';
import { useAppStore } from '@/lib/store/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Wallet,
  RotateCcw,
  Sun,
  Clock,
  Moon,
  Sunrise,
  AlertTriangle,
  TrendingDown,
  PiggyBank,
  ChevronRight,
} from 'lucide-react';
import type { TimePeriod, ChoiceOption } from '@/lib/types';

// ─── Period config ─────────────────────────────────────────
const periodConfig: Record<TimePeriod, { icon: typeof Sun; label: string; color: string }> = {
  morning: { icon: Sunrise, label: 'Morning', color: '#f59e0b' },
  afternoon: { icon: Sun, label: 'Afternoon', color: '#f97316' },
  evening: { icon: Clock, label: 'Evening', color: '#8b5cf6' },
  night: { icon: Moon, label: 'Night', color: '#6366f1' },
};

// ─── Default monthly income for daily budget ───────────────
const DEFAULT_MONTHLY_INCOME = 20000;
const DAILY_BUDGET = Math.round(DEFAULT_MONTHLY_INCOME / 30);

export default function DailySimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [walletBalance, setWalletBalance] = useState(DAILY_BUDGET);
  const [choices, setChoices] = useState<{ choiceId: number; option: 'A' | 'B'; cost: number }[]>([]);
  const [showConsequence, setShowConsequence] = useState(false);
  const [lastChoice, setLastChoice] = useState<{ option: 'A' | 'B'; data: ChoiceOption } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { addCoins, setDailySimDay, dailySimDay } = useAppStore();

  const totalSpent = choices.reduce((s, c) => s + c.cost, 0);
  const currentChoice = dailyChoices[currentStep];
  const isOverspent = walletBalance < 0;

  // ─── Timeline progress ───────────────────────────────
  const timelinePeriods: TimePeriod[] = ['morning', 'afternoon', 'evening', 'night'];
  const currentPeriod = currentChoice?.period || 'morning';

  // ─── Handle choice ───────────────────────────────────
  const handleChoice = useCallback(
    (option: 'A' | 'B') => {
      if (!currentChoice || showConsequence) return;

      const data = option === 'A' ? currentChoice.optionA : currentChoice.optionB;
      const newBalance = walletBalance - data.cost;

      setLastChoice({ option, data });
      setWalletBalance(newBalance);
      setChoices((prev) => [...prev, { choiceId: currentChoice.id, option, cost: data.cost }]);
      setShowConsequence(true);
    },
    [currentChoice, walletBalance, showConsequence]
  );

  // ─── Next step ───────────────────────────────────────
  const handleNext = useCallback(() => {
    if (currentStep + 1 >= dailyChoices.length) {
      setIsComplete(true);
      setDailySimDay(dailySimDay + 1);
      if (walletBalance > 0) addCoins(10);
      return;
    }
    setCurrentStep((prev) => prev + 1);
    setShowConsequence(false);
    setLastChoice(null);
  }, [currentStep, walletBalance, setDailySimDay, dailySimDay, addCoins]);

  // ─── Reset ───────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setWalletBalance(DAILY_BUDGET);
    setChoices([]);
    setShowConsequence(false);
    setLastChoice(null);
    setIsComplete(false);
  }, []);

  // ─── Savings tip ─────────────────────────────────────
  const savingsTip = useMemo(() => {
    const monthlyExtra = Math.abs(DAILY_BUDGET - totalSpent) * 30;
    if (totalSpent <= DAILY_BUDGET) {
      return `Agar roz itna bachao toh mahine mein ${formatCurrency(monthlyExtra)} bachenge — yeh SIP mein daalo toh 10 saal mein ${formatCurrency(Math.round(monthlyExtra * 230))}+!`;
    }
    return `Roz itna zyada kharcha karoge toh mahine mein ${formatCurrency(monthlyExtra)} deficit! Credit card pe daaloge toh 36% interest lagega!`;
  }, [totalSpent]);

  // ─── Completion screen ───────────────────────────────
  if (isComplete) {
    const savedAmount = DAILY_BUDGET - totalSpent;
    const isPositive = savedAmount >= 0;

    return (
      <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4 py-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          {isPositive ? (
            <PiggyBank className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
          ) : (
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-3" />
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isPositive ? 'Din Bachat Mein! 🎉' : 'Budget Over! 😱'}
        </h2>

        <div className="w-full glass-card-premium bg-[#12121a] rounded-xl p-5 mb-4 border border-white/5">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-[10px] text-[#a0a0b8] font-medium">Daily Budget</div>
              <div className="text-lg font-bold text-amber-400">{formatCurrency(DAILY_BUDGET)}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#a0a0b8] font-medium">Total Spent</div>
              <div className="text-lg font-bold text-red-400">{formatCurrency(totalSpent)}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#a0a0b8] font-medium">Saved / Over</div>
              <div className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{formatCurrency(savedAmount)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#a0a0b8] font-medium">Smart Choices</div>
              <div className="text-lg font-bold text-emerald-400">
                {choices.filter((c) => c.option === 'A').length}/{choices.length}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4"
        >
          <p className="text-sm text-amber-200 font-medium">💡 {savingsTip}</p>
        </motion.div>

        <Button onClick={handleReset} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
          <RotateCcw className="w-4 h-4 mr-2" />
          Phir Se Khelo
        </Button>
      </div>
    );
  }

  // ─── Period icon ─────────────────────────────────────
  const PeriodIcon = periodConfig[currentPeriod]?.icon || Sun;
  const periodColor = periodConfig[currentPeriod]?.color || '#f59e0b';

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-3 sm:px-4 py-4 gap-4">
      {/* ── Header ────────────────────────────────────── */}
      <div className="strategy-header-gradient text-center rounded-xl py-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gradient-gold mb-1">Ek Din Ka Kharcha 💸</h2>
        <p className="text-sm text-[#a0a0b8] font-medium">Ek din ka budget — smart choices banao!</p>
      </div>

      {/* ── Wallet Balance Bar ────────────────────────── */}
      <div className={`w-full card-dark rounded-xl p-3 ${currentPeriod === 'night' ? 'nighttime-gradient' : 'daytime-gradient'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotateY: walletBalance > DAILY_BUDGET * 0.5 ? [0, 360] : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Wallet size={18} className={isOverspent ? 'text-red-400' : 'text-amber-400'} />
            </motion.div>
            <span className="text-sm text-[#a0a0b8] font-medium">Wallet Balance</span>
          </div>
          <motion.span
            key={walletBalance}
            initial={{ scale: 1.2, color: isOverspent ? '#ef4444' : '#f59e0b' }}
            animate={{ scale: 1, color: isOverspent ? '#ef4444' : '#f59e0b' }}
            className="text-lg font-bold"
          >
            {formatCurrency(Math.max(0, walletBalance))}
          </motion.span>
        </div>
        <Progress
          value={Math.max(0, (walletBalance / DAILY_BUDGET) * 100)}
          className="h-2"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-[#a0a0b8] font-medium">Daily Budget: {formatCurrency(DAILY_BUDGET)}</span>
          {isOverspent && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-red-400 font-semibold flex items-center gap-1"
            >
              <AlertTriangle size={10} /> Overspent by {formatCurrency(Math.abs(walletBalance))}
            </motion.span>
          )}
        </div>
      </div>

      {/* ── Current Scenario ──────────────────────────── */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <PeriodIcon size={16} style={{ color: periodColor }} />
          <div className="time-indicator" />
          <Badge variant="outline" className="text-[10px]" style={{ color: periodColor, borderColor: `${periodColor}40` }}>
            {currentChoice.time} — {periodConfig[currentPeriod]?.label}
          </Badge>
        </div>

        <p className="text-sm text-white font-medium mb-3">{currentChoice.scenario}</p>

        {/* ── Choice Cards ────────────────────────────── */}
        {!showConsequence ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option A (Cheap) */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card
                className="cursor-pointer border-0 bg-emerald-950/30 hover:bg-emerald-950/50 transition-colors"
                style={{ border: '1px solid rgba(34,197,94,0.2)' }}
                onClick={() => handleChoice('A')}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-2xl">{currentChoice.optionA.emoji}</span>
                  <p className="text-xs font-semibold text-emerald-400 mt-1">Smart Choice</p>
                  <p className="text-sm font-bold text-white mt-1">{currentChoice.optionA.label}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Option B (Expensive) */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card
                className="cursor-pointer border-0 bg-red-950/30 hover:bg-red-950/50 transition-colors"
                style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                onClick={() => handleChoice('B')}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-2xl">{currentChoice.optionB.emoji}</span>
                  <p className="text-xs font-semibold text-red-400 mt-1">Expensive</p>
                  <p className="text-sm font-bold text-white mt-1">{currentChoice.optionB.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* ── Consequence ────────────────────────────── */
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card
                className="border-0"
                style={{
                  backgroundColor: lastChoice?.option === 'A' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${lastChoice?.option === 'A' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <span className="text-3xl">{lastChoice?.data.emoji}</span>
                    <p className="text-sm font-bold text-white mt-1">
                      {lastChoice?.data.label} — {formatCurrency(lastChoice?.data.cost || 0)}
                    </p>
                  </div>
                  <p className="text-sm text-[#e8e8ed] text-center mb-3">
                    {lastChoice?.data.consequence}
                  </p>
                  <Button
                    onClick={handleNext}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  >
                    {currentStep + 1 >= dailyChoices.length ? 'Din Ka Summary →' : 'Agle Decision →'}
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Timeline Progress ─────────────────────────── */}
      <div className="w-full bg-[#12121a] border border-white/10 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#a0a0b8] font-medium">Day Progress</span>
          <span className="text-[10px] text-amber-400">{currentStep + 1}/{dailyChoices.length} decisions</span>
        </div>

        {/* Period markers */}
        <div className="flex items-center gap-1 mb-2">
          {timelinePeriods.map((p) => {
            const Icon = periodConfig[p].icon;
            const isActive = p === currentPeriod;
            const isPast = timelinePeriods.indexOf(p) < timelinePeriods.indexOf(currentPeriod);
            return (
              <div key={p} className="flex-1 flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mb-0.5"
                  style={{
                    backgroundColor: isActive || isPast ? `${periodConfig[p].color}30` : '#1a1a2e',
                    border: isActive ? `1px solid ${periodConfig[p].color}` : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Icon size={12} style={{ color: isActive || isPast ? periodConfig[p].color : '#8888a0' }} />
                </div>
                <span className="text-[8px]" style={{ color: isActive ? periodConfig[p].color : '#8888a0' }}>
                  {periodConfig[p].label}
                </span>
              </div>
            );
          })}
        </div>

        <Progress value={((currentStep + 1) / dailyChoices.length) * 100} className="h-2" />
      </div>

      {/* ── Reset ─────────────────────────────────────── */}
      <button
        onClick={handleReset}
        className="text-xs text-[#a0a0b8]/60 hover:text-[#a0a0b8] flex items-center gap-1 transition-colors"
      >
        <RotateCcw size={12} /> Shuru se karo
      </button>
    </div>
  );
}
