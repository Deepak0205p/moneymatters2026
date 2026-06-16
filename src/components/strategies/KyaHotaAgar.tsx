"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { TrendingDown, TrendingUp, Frown, Smile, Calendar, Sparkles, GraduationCap, Briefcase, Rocket } from 'lucide-react';

interface Scenario {
  id: string;
  label: string;
  income: number;
  emoji: string;
  icon: typeof GraduationCap;
  desc: string;
}

const SCENARIOS: Scenario[] = [
  { id: 'student', label: 'Student', income: 15000, emoji: '🎓', icon: GraduationCap, desc: 'Pocket money + part-time' },
  { id: 'pro', label: 'Working Pro', income: 35000, emoji: '💼', icon: Briefcase, desc: 'First job, fresh start' },
  { id: 'freelancer', label: 'Freelancer', income: 50000, emoji: '🚀', icon: Rocket, desc: 'Gig economy earner' },
];

const SIP_RATE = 0.12; // 12% annual return
const OVERSPEND_RATE = 0.05; // 5% lifestyle overspend per year

function calcCareless(income: number, years: number) {
  // Spends 105% of income per year → debt accumulates with 18% interest
  let debt = 0;
  for (let i = 0; i < years; i++) {
    debt = (debt + income * 12 * OVERSPEND_RATE) * 1.18;
  }
  return { savings: 0, debt, total: -debt };
}

function calcSmart(income: number, years: number) {
  // Save 20% in SIP, 12% annual compounding (monthly)
  const monthlySIP = income * 0.20;
  const months = years * 12;
  const r = SIP_RATE / 12;
  const fv = monthlySIP * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthlySIP * 12 * years;
  return { invested, returns: fv - invested, total: fv };
}

// Smooth count-up hook
function useCountUp(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (end - start) * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevRef.current = end;
    };
  }, [target, duration]);

  return value;
}

function formatINR(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  return `${sign}₹${Math.round(abs)}`;
}

export default function KyaHotaAgar() {
  const { addCoins } = useAppStore();
  const [scenarioId, setScenarioId] = useState('pro');
  const [year, setYear] = useState(10);

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === scenarioId)!, [scenarioId]);
  const careless = useMemo(() => calcCareless(scenario.income, year), [scenario.income, year]);
  const smart = useMemo(() => calcSmart(scenario.income, year), [scenario.income, year]);

  const carelessTotal = useCountUp(careless.total);
  const smartTotal = useCountUp(smart.total);
  const smartReturns = useCountUp(smart.returns);

  const diff = smart.total - careless.total;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="text-ai" size={26} />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-brand">Kya Hota Agar...</h2>
        </div>
        <p className="text-sm text-ink-muted font-medium">Consequence Simulator — Aaj ke faisle ka 20 saal baad ka asar!</p>
      </div>

      {/* Scenario chooser */}
      <div className="flex flex-wrap gap-2 justify-center">
        {SCENARIOS.map((s) => {
          const Icon = s.icon;
          const active = s.id === scenarioId;
          return (
            <motion.button
              key={s.id}
              onClick={() => { setScenarioId(s.id); addCoins(2); }}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                active
                  ? 'bg-emerald/15 border-emerald/40 text-emerald glow-green'
                  : 'glass border-white/10 text-ink-muted hover:border-emerald/30 hover:text-ink'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={16} /> {s.label} · {formatINR(s.income)}/mo
            </motion.button>
          );
        })}
      </div>

      {/* Split panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Careless path — LEFT */}
        <motion.div
          className="rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
            border: '1px solid rgba(239,68,68,0.30)',
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-3xl"
                animate={{ y: [0, -3, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                😟
              </motion.span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold">Path A</p>
                <h3 className="font-display font-bold text-red-400 text-lg leading-none">Agar aise hi chala</h3>
              </div>
            </div>
            <TrendingDown className="text-red-500" size={22} />
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            Kharcha income se 5% zyada, credit card pe 18% interest, savings = ZERO. 💸
          </p>

          <div className="space-y-3 pt-1">
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-ink-muted font-medium">Total Savings</span>
              <span className="font-display font-bold text-red-400 text-xl">₹0</span>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-ink-muted font-medium">Debt (CC @18%)</span>
              <span className="font-display font-bold text-red-500 text-xl">{formatINR(careless.debt)}</span>
            </div>
            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)' }}
            >
              <span className="text-xs font-bold text-red-300">Net Worth</span>
              <span className="font-display font-bold text-red-400 text-2xl tabular-nums">
                {formatINR(carelessTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Frown className="text-red-400" size={16} />
            <p className="text-[11px] text-red-300/80 italic">
              {year} saal me tum andar hi andar doobte jaoge!
            </p>
          </div>
        </motion.div>

        {/* Smart path — RIGHT */}
        <motion.div
          className="rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden glow-green"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
            border: '1px solid rgba(16,185,129,0.35)',
          }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-3xl"
                animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                😎
              </motion.span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-emerald font-bold">Path B</p>
                <h3 className="font-display font-bold text-emerald text-lg leading-none">Agar smart bane</h3>
              </div>
            </div>
            <TrendingUp className="text-emerald" size={22} />
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            20% income SIP me invest, 12% annual return. Compounding ka jaadu! 🌱
          </p>

          <div className="space-y-3 pt-1">
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-ink-muted font-medium">Total Invested</span>
              <span className="font-display font-bold text-ink text-xl">{formatINR(smart.invested)}</span>
            </div>
            <div className="glass rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-ink-muted font-medium">Returns Earned</span>
              <span className="font-display font-bold text-emerald text-xl">{formatINR(smartReturns)}</span>
            </div>
            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}
            >
              <span className="text-xs font-bold text-emerald">Net Worth</span>
              <span className="text-gradient-emerald font-display font-bold text-2xl tabular-nums">
                {formatINR(smartTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Smile className="text-emerald" size={16} />
            <p className="text-[11px] text-emerald/80 italic">
              {year} saal me tum financial freedom ke kareeb pahunchoge!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Difference banner */}
      <motion.div
        className="glass-card-premium rounded-2xl p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        key={`diff-${diff}`}
      >
        <p className="text-xs text-ink-muted font-medium">Dono paths ka farq (Net Worth gap)</p>
        <p className="text-3xl font-display font-bold text-gradient-gold mt-1">
          + {formatINR(diff)}
        </p>
        <p className="text-[11px] text-ink-muted mt-1">
          Yeh extra wealth sirf 20% SIP ki vajah se! 🎯
        </p>
      </motion.div>

      {/* Year slider */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-ai" size={18} />
            <span className="text-sm font-semibold text-ink">Time Travel</span>
          </div>
          <span className="text-2xl font-display font-bold text-gradient-brand tabular-nums">
            Year {year}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={20}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full accent-emerald cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-ink-muted font-medium">
          <span>Year 1 (Aaj)</span>
          <span>Year 10</span>
          <span>Year 20 (Future)</span>
        </div>
      </div>

      {/* Tip */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <p className="text-xs text-ink-muted leading-relaxed">
          <span className="text-emerald font-semibold">Pro Tip:</span> SIP shuru karne ka best time 5 saal pehle tha,
          dusra best time aaj hai! Chahe ₹500 se shuru karo, bas consistent raho. Compounding ka jaadu dheere dheere dikhega.
        </p>
      </div>
    </div>
  );
}
