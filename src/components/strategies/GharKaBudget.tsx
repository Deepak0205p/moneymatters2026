'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Home,
  UtensilsCrossed,
  Bus,
  Gamepad2,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const SALARY = 25000;

type CatKey = 'rent' | 'food' | 'transport' | 'entertainment' | 'savings';

const CAT_META: Record<
  CatKey,
  { label: string; emoji: string; icon: typeof Home; color: string; idealPct: number; max: number }
> = {
  rent: { label: 'Rent / Kiraya', emoji: '🏠', icon: Home, color: '#8B5CF6', idealPct: 30, max: 15000 },
  food: { label: 'Food / Khana', emoji: '🍔', icon: UtensilsCrossed, color: '#F59E0B', idealPct: 25, max: 10000 },
  transport: { label: 'Transport / Safar', emoji: '🚌', icon: Bus, color: '#06B6D4', idealPct: 10, max: 6000 },
  entertainment: { label: 'Fun / Manoranjan', emoji: '🎬', icon: Gamepad2, color: '#EC4899', idealPct: 10, max: 8000 },
  savings: { label: 'Savings / Bachat', emoji: '🐷', icon: PiggyBank, color: '#10B981', idealPct: 25, max: 12000 },
};

const INITIAL: Record<CatKey, number> = {
  rent: 8000,
  food: 6000,
  transport: 2500,
  entertainment: 2500,
  savings: 6000,
};

export default function GharKaBudget() {
  const addCoins = useAppStore((s) => s.addCoins);
  const [budget, setBudget] = useState<Record<CatKey, number>>(INITIAL);
  const [rewarded, setRewarded] = useState(false);

  const total = useMemo(() => Object.values(budget).reduce((a, b) => a + b, 0), [budget]);
  const remaining = SALARY - total;
  const savingsPct = (budget.savings / SALARY) * 100;

  // Budget health score (0-100)
  const health = useMemo(() => {
    let score = 100;
    (Object.keys(CAT_META) as CatKey[]).forEach((k) => {
      const ideal = (CAT_META[k].idealPct / 100) * SALARY;
      const diff = Math.abs(budget[k] - ideal) / ideal;
      score -= Math.min(diff * 25, 20);
    });
    if (total > SALARY) score -= 40;
    if (savingsPct < 20) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [budget, total, savingsPct]);

  const healthColor = health >= 75 ? '#10B981' : health >= 45 ? '#F59E0B' : '#EF4444';
  const healthLabel = health >= 75 ? 'Bilkul Perfect!' : health >= 45 ? 'Thoda Sudhar' : 'Khataranak!';

  // Tip generation
  const tips = useMemo(() => {
    const t: string[] = [];
    if (budget.rent > SALARY * 0.35) t.push('🏢 Rent bahut zyada hai. PG ya sharing try karo.');
    if (budget.food > SALARY * 0.3) t.push('🍔 Bahar ka khana kam karo. Meal prep se 40% bachat.');
    if (budget.entertainment > SALARY * 0.15) t.push('🎬 Fun budget thoda kam. Free activities explore karo.');
    if (budget.transport > SALARY * 0.15) t.push('🚌 Metro/PUC pass lo. Daily auto se mehenga padta hai.');
    if (savingsPct < 20) t.push('🐷 Bhai, future ke liye kuch toh bachao! 20% minimum target.');
    if (t.length === 0) t.push('✨ MAST! Tumhara budget perfectly balanced hai!');
    return t;
  }, [budget, savingsPct]);

  // Reward once when healthy
  const computeHealth = (b: Record<CatKey, number>) => {
    let score = 100;
    (Object.keys(CAT_META) as CatKey[]).forEach((k) => {
      const ideal = (CAT_META[k].idealPct / 100) * SALARY;
      const diff = Math.abs(b[k] - ideal) / ideal;
      score -= Math.min(diff * 25, 20);
    });
    const tot = Object.values(b).reduce((a, b2) => a + b2, 0);
    if (tot > SALARY) score -= 40;
    if ((b.savings / SALARY) * 100 < 20) score -= 15;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const updateCat = (k: CatKey, v: number) => {
    const next = { ...budget, [k]: v };
    setBudget(next);
    const newHealth = computeHealth(next);
    if (newHealth >= 75 && !rewarded) {
      setRewarded(true);
      addCoins(15);
    } else if (newHealth < 60 && rewarded) {
      setRewarded(false);
    }
  };

  // Room visual cues
  const rentPct = budget.rent / SALARY;
  const fridgeEmpty = budget.food < SALARY * 0.15;
  const hasTV = budget.entertainment >= SALARY * 0.08;
  const hasGaming = budget.entertainment >= SALARY * 0.12;
  const piggyGlow = savingsPct >= 20;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-emerald">
          Ghar Ka Budget 🏠
        </h2>
        <p className="text-zinc-400 mt-2">
          Salary <span className="text-amber-400 font-bold">₹{SALARY.toLocaleString('en-IN')}</span> ko 5 hisso mein baanto. Smart allocation = happy life!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ROOM SIMULATOR */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold text-white">Tumhara Kamra</h3>
            <span className="text-xs text-zinc-400">Budget hisaab se badalta hai</span>
          </div>
          <div
            className="relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-500"
            style={{
              borderColor: piggyGlow ? 'rgba(16,185,129,0.4)' : 'rgba(148,163,184,0.25)',
              background:
                'linear-gradient(180deg, rgba(16,185,129,0.06), rgba(11,18,32,0.6))',
              height: `${200 + rentPct * 220}px`,
            }}
          >
            {/* Window */}
            <div className="absolute top-3 left-3 w-16 h-16 rounded-lg border-2 border-cyan-400/40 bg-cyan-400/5 flex items-center justify-center text-2xl">
              🪟
            </div>
            {/* Bed */}
            <motion.div
              animate={{ scale: 0.8 + rentPct * 0.6 }}
              className="absolute bottom-3 left-3 text-4xl"
            >
              🛏️
            </motion.div>
            {/* Fridge */}
            <motion.div
              animate={{ opacity: fridgeEmpty ? 0.4 : 1 }}
              className="absolute top-3 right-3 text-4xl"
            >
              {fridgeEmpty ? '🧊' : '🧺'}
            </motion.div>
            {/* TV */}
            <AnimatePresence>
              {hasTV && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute bottom-3 right-3 text-4xl"
                >
                  📺
                </motion.div>
              )}
            </AnimatePresence>
            {/* Gaming */}
            <AnimatePresence>
              {hasGaming && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-3 right-16 text-3xl"
                >
                  🎮
                </motion.div>
              )}
            </AnimatePresence>
            {/* Piggy Bank */}
            <motion.div
              animate={{
                scale: piggyGlow ? [1, 1.15, 1] : 1,
                filter: piggyGlow ? 'drop-shadow(0 0 14px #10B981)' : 'none',
              }}
              transition={{ repeat: piggyGlow ? Infinity : 0, duration: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
            >
              🐷
            </motion.div>
            {!piggyGlow && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-10 text-xs text-red-400 font-semibold">
                Piggy so raha hai 😴
              </div>
            )}
          </div>

          {/* Tip ticker */}
          <div className="mt-4 space-y-1.5">
            {tips.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-zinc-300 flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>{t}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* HEALTH METER */}
        <div className="glass-card rounded-2xl p-5 flex flex-col">
          <h3 className="font-display text-lg font-semibold text-white mb-3">Budget Health</h3>
          <div className="relative w-32 h-32 mx-auto">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={healthColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={314}
                animate={{ strokeDashoffset: 314 - (314 * health) / 100 }}
                transition={{ type: 'spring', stiffness: 60 }}
                style={{ filter: `drop-shadow(0 0 8px ${healthColor})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={health}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl font-bold"
                style={{ color: healthColor }}
              >
                {health}
              </motion.span>
              <span className="text-[10px] text-zinc-400">/ 100</span>
            </div>
          </div>
          <p className="text-center mt-3 font-semibold" style={{ color: healthColor }}>
            {healthLabel}
          </p>

          {/* Salary split */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Kharcha</span>
              <span className="text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Bacha</span>
              <span className={remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                ₹{remaining.toLocaleString('en-IN')}
              </span>
            </div>
            <AnimatePresence>
              {remaining < 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-2 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Salary se zyada kharcha! ₹{Math.abs(remaining).toLocaleString('en-IN')} kam karo.
                </motion.div>
              )}
            </AnimatePresence>
            {savingsPct < 20 && remaining >= 0 && (
              <div className="mt-2 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Bhai, future ke liye kuch toh bachao! 20% target karo.
              </div>
            )}
            {savingsPct >= 20 && remaining >= 0 && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Sahi ja raho ho! Savings {savingsPct.toFixed(0)}% 👏
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SLIDERS */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-white">Paisa Baanto</h3>
          <div className="text-sm">
            Total:{' '}
            <span
              className={`font-bold number-highlight ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              ₹{total.toLocaleString('en-IN')} / ₹{SALARY.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.keys(CAT_META) as CatKey[]).map((k) => {
            const meta = CAT_META[k];
            const Icon = meta.icon;
            const pct = ((budget[k] / SALARY) * 100).toFixed(0);
            return (
              <div key={k} className="glass rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-sm font-medium text-white">{meta.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: meta.color }}>
                    ₹{budget[k].toLocaleString('en-IN')}
                    <span className="text-zinc-500 text-xs ml-1">({pct}%)</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={meta.max}
                  step={500}
                  value={budget[k]}
                  onChange={(e) => updateCat(k, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  style={{
                    background: `linear-gradient(90deg, ${meta.color} 0%, ${meta.color} ${
                      (budget[k] / meta.max) * 100
                    }%, rgba(255,255,255,0.1) ${(budget[k] / meta.max) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>Ideal: {meta.idealPct}%</span>
                  <Icon className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
