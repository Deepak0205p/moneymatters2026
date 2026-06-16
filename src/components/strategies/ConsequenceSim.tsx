'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { User, TrendingDown, TrendingUp, FastForward, IndianRupee, Calendar, Percent, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store/useAppStore';
import { calculateSIP, formatCurrency, formatIndianNumber, cn } from '@/lib/utils';
import { scenarios } from '@/lib/data/scenarios-data';
import SliderControl from '@/components/shared/SliderControl';
import StatCard from '@/components/shared/StatCard';

// ─── User Profiles ───────────────────────────────────────────
const PROFILES = [
  {
    name: 'Riya',
    age: 20,
    occupation: 'B.Com Student',
    monthlyIncome: 8000,
    monthlySavings: 0,
    color: '#ec4899',
    emoji: '👩‍🎓',
    description: 'No savings, no investing — "₹500 se kya hota hai?"',
  },
  {
    name: 'Amit',
    age: 22,
    occupation: 'Fresher Developer',
    monthlyIncome: 20000,
    monthlySavings: 2000,
    color: '#3b82f6',
    emoji: '👨‍💻',
    description: 'Some savings but inconsistent — "baad mein sochenge"',
  },
  {
    name: 'Sneha',
    age: 25,
    occupation: 'Gig Worker',
    monthlyIncome: 15000,
    monthlySavings: 1000,
    color: '#a855f7',
    emoji: '👩‍🎨',
    description: 'Irregular income, minimal savings — "budget nahi banta"',
  },
];

// ─── Fast Forward Options ─────────────────────────────────────
const FAST_FORWARD_OPTIONS = [
  { label: '1 Saal', years: 1 },
  { label: '5 Saal', years: 5 },
  { label: '10 Saal', years: 10 },
  { label: '20 Saal', years: 20 },
];

// ─── Year milestones for data generation ──────────────────────
const YEAR_MILESTONES = [1, 2, 3, 5, 10, 15, 20, 25, 30];

// ─── Inflation rate assumption ────────────────────────────────
const INFLATION_RATE = 6;

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a2e] px-4 py-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-[#a0a0b8]">Year {label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#a0a0b8]">{entry.name}:</span>
          <span className="font-bold number-highlight" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 border-t border-white/10 pt-2 text-xs text-green-400">
          Farak: {formatCurrency(Math.abs(payload[1].value - payload[0].value))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ConsequenceSim() {
  const { addCoins } = useAppStore();

  // Active profile index
  const [activeProfile, setActiveProfile] = useState(0);
  const profile = PROFILES[activeProfile];

  // Slider states
  const [monthlySIP, setMonthlySIP] = useState(500);
  const [startAge, setStartAge] = useState(profile.age);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Fast forward state
  const [fastForward, setFastForward] = useState(20);

  // Generate chart data based on current settings
  const chartData = useMemo(() => {
    const data: { year: number; badPath: number; goodPath: number }[] = [];

    for (const year of YEAR_MILESTONES) {
      if (year > fastForward) break;

      // Good path: SIP accumulation with compounding
      const sipCorpus = calculateSIP(monthlySIP, expectedReturn, year);

      // Bad path: Money lost to inflation + spending
      // Assume the same monthly amount is spent instead of invested
      // Inflation eats away at whatever little they save, plus debt accumulation
      const totalSpent = monthlySIP * 12 * year; // Same money, just spent
      const inflationErosion = totalSpent / Math.pow(1 + INFLATION_RATE / 100, year);
      // Small negative value representing debt/financial stress
      const badNetWorth = Math.max(
        -monthlySIP * 12 * year * 0.05 * year,
        -(profile.monthlyIncome * 0.3 * year * 0.1)
      );

      data.push({
        year,
        badPath: Math.round(badNetWorth),
        goodPath: Math.round(sipCorpus),
      });
    }

    return data;
  }, [monthlySIP, expectedReturn, fastForward, profile.monthlyIncome]);

  // Calculate difference at key milestones
  const differences = useMemo(() => {
    const diffs: { years: number; amount: number }[] = [];
    for (const milestone of [5, 10, 20]) {
      if (milestone <= fastForward) {
        const goodValue = calculateSIP(monthlySIP, expectedReturn, milestone);
        const invested = monthlySIP * 12 * milestone;
        const gainFromCompounding = goodValue - invested;
        // The "difference" is the full good path value (since bad path = 0 savings)
        diffs.push({ years: milestone, amount: Math.round(goodValue) });
      }
    }
    return diffs;
  }, [monthlySIP, expectedReturn, fastForward]);

  // Key stats
  const totalInvested = monthlySIP * 12 * fastForward;
  const finalCorpus = calculateSIP(monthlySIP, expectedReturn, fastForward);
  const compoundingGain = finalCorpus - totalInvested;
  const endAge = startAge + fastForward;

  // Handle profile change
  const handleProfileChange = (idx: number) => {
    setActiveProfile(idx);
    setStartAge(PROFILES[idx].age);
  };

  // Handle fast forward with coin reward
  const handleFastForward = (years: number) => {
    setFastForward(years);
    addCoins(2);
  };

  // Get scenario text for the current fast forward year
  const getScenarioText = () => {
    const scenario = scenarios[0]; // SIP vs No Savings scenario
    if (!scenario) return { bad: '', good: '' };

    let badText = '';
    let goodText = '';

    if (fastForward <= 1) {
      badText = scenario.badPath.year1;
      goodText = scenario.goodPath.year1;
    } else if (fastForward <= 5) {
      badText = scenario.badPath.year5;
      goodText = scenario.goodPath.year5;
    } else if (fastForward <= 10) {
      badText = scenario.badPath.year10;
      goodText = scenario.goodPath.year10;
    } else {
      badText = scenario.badPath.year20;
      goodText = scenario.goodPath.year20;
    }

    return { bad: badText, good: goodText };
  };

  const scenarioText = getScenarioText();

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-extrabold text-gradient-gold">
          Kya Hota Agar... 🤔
        </h2>
        <p className="mt-1 text-sm text-[#a0a0b8] font-medium">
          Consequence Simulator — Duniya ke do raste, tumhara faisla
        </p>
      </motion.div>

      {/* ── Profile Selector ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-2">
        {PROFILES.map((p, idx) => (
          <motion.button
            key={p.name}
            onClick={() => handleProfileChange(idx)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'flex-shrink-0 rounded-xl px-4 py-3 text-left transition-all min-h-[44px]',
              activeProfile === idx
                ? 'ring-2 shadow-lg'
                : 'bg-[#12121a] ring-1 ring-white/5 hover:ring-white/10'
            )}
            style={{
              borderColor: activeProfile === idx ? p.color : 'transparent',
              ...(activeProfile === idx ? { backgroundColor: `${p.color}15`, ringColor: p.color } : {}),
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{p.emoji}</span>
              <div>
                <p className="text-sm font-bold text-[#e8e8ed]">
                  {p.name}, {p.age}
                </p>
                <p className="text-[10px] text-[#a0a0b8] font-medium">{p.occupation}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Active Profile Card ───────────────────────────── */}
      <motion.div
        key={activeProfile}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="overflow-hidden border-0"
          style={{
            background: `linear-gradient(135deg, ${profile.color}12 0%, #12121a 60%)`,
            border: `1px solid ${profile.color}25`,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                  style={{ backgroundColor: `${profile.color}20` }}
                >
                  {profile.emoji}
                </div>
                <div>
                  <p className="font-bold text-[#e8e8ed]">
                    Tum ho {profile.name}, {profile.age}, {profile.occupation}
                  </p>
                  <p className="text-xs text-[#a0a0b8] font-medium">
                    {formatCurrency(profile.monthlyIncome)}/month income
                    {profile.monthlySavings > 0
                      ? `, ${formatCurrency(profile.monthlySavings)} savings`
                      : ', no savings'}
                  </p>
                </div>
              </div>
              <div
                className="rounded-lg px-3 py-1.5 text-xs font-bold"
                style={{ backgroundColor: `${profile.color}20`, color: profile.color }}
              >
                Age {endAge}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Split Screen Timeline Labels ──────────────────── */}
      <div className="consequence-split grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-premium rounded-xl bg-red-950/40 p-4 ring-1 ring-red-500/25 relative overflow-hidden"
        >
          {/* Red danger stripes subtle bg */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(135deg, transparent, transparent 10px, #ef4444 10px, #ef4444 11px)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              </div>
              <span className="text-sm font-bold text-red-400">Agar aise hi chala</span>
            </div>
            <p className="mt-1 text-[10px] text-red-400/70">
              Same habits — no investing, no planning
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-premium rounded-xl bg-green-950/40 p-4 ring-1 ring-green-500/25 relative overflow-hidden"
        >
          {/* Green subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              </div>
              <span className="text-sm font-bold text-green-400">Agar smart bane</span>
            </div>
            <p className="mt-1 text-[10px] text-green-400/70">
              Rupaiya 101 follow — SIP + discipline
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Fast Forward Buttons ──────────────────────────── */}
      <div className="flex gap-2">
        {FAST_FORWARD_OPTIONS.map((opt) => (
          <motion.button
            key={opt.years}
            onClick={() => handleFastForward(opt.years)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all',
              fastForward === opt.years
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : 'bg-[#1a1a2e] text-[#a0a0b8] ring-1 ring-white/5 hover:text-[#e8e8ed] hover:ring-white/10 hover:bg-white/[0.04] transition-colors'
            )}
          >
            <FastForward className="h-3.5 w-3.5" />
            {opt.label}
          </motion.button>
        ))}
      </div>

      {/* ── Dual Timeline Chart ───────────────────────────── */}
      <motion.div
        layout
        className="rounded-xl bg-[#12121a] p-4 ring-1 ring-white/5"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium text-[#a0a0b8]">
            Net Worth Over Time
          </p>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-full bg-red-500" />
              <span className="text-[10px] text-red-400">Aise hi chala</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-full bg-green-500" />
              <span className="text-[10px] text-green-400">Smart bane</span>
            </div>
          </div>
        </div>

        <div className="h-56 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="badGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="year"
                tick={{ fill: '#8888a0', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
                label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#8888a0', fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: '#8888a0', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
                tickFormatter={(v: number) => {
                  if (Math.abs(v) >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
                  if (Math.abs(v) >= 100000) return `${(v / 100000).toFixed(1)}L`;
                  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}K`;
                  return v.toString();
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="badPath"
                name="Aise hi chala"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#badGradient)"
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="goodPath"
                name="Smart bane"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#goodGradient)"
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── The Big Numbers — Difference Cards ────────────── */}
      <div className="space-y-3">
        <p className="text-center text-xs font-medium text-[#a0a0b8]">
          🤯 Kitna farak padta hai
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {differences.map((diff) => (
              <motion.div
                key={diff.years}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-500/15 to-green-500/5 ring-1 ring-green-500/20 glow-green">
                  <CardContent className="p-5 text-center">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-green-400/70">
                      {diff.years} saal mein farak
                    </p>
                    <motion.p
                      key={diff.amount}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="mt-1 text-2xl sm:text-3xl font-black text-green-400 text-glow-gold number-highlight"
                      style={{ textShadow: '0 0 20px rgba(34,197,94,0.3)' }}
                    >
                      {formatCurrency(diff.amount)}
                    </motion.p>
                    <p className="mt-1 text-[10px] text-green-400/50">
                      vs Rs.0 (no savings)
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Key Stats Row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Invested"
          value={totalInvested}
          prefix="₹"
          color="#f59e0b"
          icon="Wallet"
        />
        <StatCard
          label="Final Corpus"
          value={Math.round(finalCorpus)}
          prefix="₹"
          color="#22c55e"
          icon="TrendingUp"
        />
        <StatCard
          label="Compounding Gain"
          value={Math.round(compoundingGain)}
          prefix="₹"
          color="#a855f7"
          icon="Sparkles"
        />
        <StatCard
          label="Your Age Then"
          value={endAge}
          suffix=" yrs"
          color={profile.color}
          icon="User"
        />
      </div>

      {/* ── Scenario Story Cards ──────────────────────────── */}
      <div className="glow-line w-full my-1" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <motion.div
          key={`bad-${fastForward}`}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl bg-red-950/40 p-4 ring-1 ring-red-500/20 relative overflow-hidden"
        >
          {/* Caution stripes */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]" style={{ background: 'repeating-linear-gradient(135deg, transparent, transparent 4px, #ef4444 4px, #ef4444 5px)' }} />
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              </div>
              <span className="text-xs font-bold text-red-400">
                Agar aise hi chala ({fastForward} saal baad)
              </span>
            </div>
            <p className="text-xs leading-relaxed text-red-300/70">{scenarioText.bad}</p>
          </div>
        </motion.div>

        <motion.div
          key={`good-${fastForward}`}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl bg-green-950/40 p-4 ring-1 ring-green-500/20 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              </div>
              <span className="text-xs font-bold text-green-400">
                Agar smart bane ({fastForward} saal baad)
              </span>
            </div>
            <p className="text-xs leading-relaxed text-green-300/70">{scenarioText.good}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Variable Sliders ──────────────────────────────── */}
      <div className="space-y-5 rounded-xl bg-[#12121a] p-4 ring-1 ring-white/5">
        <p className="text-center text-xs font-medium text-[#a0a0b8]">
          🎛️ Apni settings badlo — live result dekho
        </p>

        <SliderControl
          label="Monthly SIP Amount"
          value={monthlySIP}
          min={100}
          max={10000}
          step={100}
          onChange={setMonthlySIP}
          prefix="₹"
          color="#22c55e"
        />

        <SliderControl
          label="Start Age"
          value={startAge}
          min={18}
          max={35}
          step={1}
          onChange={setStartAge}
          suffix=" yrs"
          color="#f59e0b"
        />

        <SliderControl
          label="Expected Annual Return"
          value={expectedReturn}
          min={8}
          max={15}
          step={1}
          onChange={setExpectedReturn}
          suffix="%"
          color="#a855f7"
        />
      </div>

      {/* ── AHA Moment Banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 ring-1 ring-amber-500/15"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-xl">
            💡
          </div>
          <div>
            <p className="text-sm font-bold text-amber-400">AHA Moment!</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-300/70">
              Sirf <span className="font-bold text-amber-400">₹{monthlySIP.toLocaleString('en-IN')}/month</span> SIP
              karke {fastForward} saal mein{' '}
              <span className="font-bold text-green-400">
                {formatCurrency(Math.round(finalCorpus))}
              </span>{' '}
              ban jaate hain @{expectedReturn}% return! Aur aise hi chala toh —{' '}
              <span className="font-bold text-red-400">Rs.0</span>. Yeh hai compounding ka asli jaadu —
              <span className="text-amber-400"> shuru karne ka waqt abhi hai!</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── SIP Formula Explanation ───────────────────────── */}
      <div className="rounded-xl bg-[#0a0a0f] p-4 ring-1 ring-white/5">
        <p className="text-xs font-medium text-[#a0a0b8]">📖 SIP Formula</p>
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#a0a0b8]/70">
          FV = P × [(1+r)<sup>n</sup> - 1] / r × (1+r)
        </p>
        <p className="mt-2 text-[10px] text-[#a0a0b8]/60">
          P = ₹{monthlySIP.toLocaleString('en-IN')}/month, r = {expectedReturn}%/12 = {(expectedReturn / 12 / 100).toFixed(4)}, n = {fastForward}×12 = {fastForward * 12} months
        </p>
        <p className="mt-1 text-[10px] text-[#a0a0b8]/60">
          Result: {formatCurrency(Math.round(finalCorpus))} (Invested: {formatCurrency(totalInvested)}, Compounding Gain: {formatCurrency(Math.round(compoundingGain))})
        </p>
      </div>
    </div>
  );
}
