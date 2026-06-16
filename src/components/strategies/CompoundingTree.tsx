'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { calculateSIP, formatIndianNumber, formatCurrency, cn } from '@/lib/utils';
import SliderControl from '@/components/shared/SliderControl';
import StatCard from '@/components/shared/StatCard';
import { TreePine, TrendingUp, Coins, ArrowRight } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────
const RETURN_OPTIONS = [8, 10, 12, 15] as const;
const MILESTONES = [
  { amount: 100000, label: '1 lakh!', color: '#22c55e' },
  { amount: 500000, label: '5 lakh!', color: '#10b981' },
  { amount: 1000000, label: '10 lakh!', color: '#f59e0b' },
  { amount: 5000000, label: '50 lakh!', color: '#f97316' },
  { amount: 10000000, label: '1 CRORE!', color: '#ef4444' },
] as const;

// ─── Tree growth state based on corpus ────────────────────
type TreeState = 'seed' | 'sapling' | 'small' | 'medium' | 'huge';

function getTreeState(corpus: number): TreeState {
  if (corpus < 50000) return 'seed';
  if (corpus < 200000) return 'sapling';
  if (corpus < 1000000) return 'small';
  if (corpus < 5000000) return 'medium';
  return 'huge';
}

function getTreeScale(state: TreeState): number {
  const scales: Record<TreeState, number> = {
    seed: 0.25,
    sapling: 0.4,
    small: 0.6,
    medium: 0.8,
    huge: 1,
  };
  return scales[state];
}

// ─── Animated Number Component ─────────────────────────────
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(0, { stiffness: 80, damping: 25 });
  const display = useTransform(spring, (latest) => formatCurrency(Math.round(latest)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ─── Money Leaf Component ─────────────────────────────────
function MoneyLeaf({
  x,
  y,
  label,
  color,
  delay,
  visible,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  delay: number;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.circle
        cx={x}
        cy={y}
        r={14}
        fill={color}
        opacity={0.9}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, delay: delay + 0.5, ease: 'easeInOut' }}
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0a0a0f"
        fontSize="6"
        fontWeight="bold"
      >
        ₹
      </text>
      {/* Label tag */}
      <rect x={x - 22} y={y - 26} width="44" height="14" rx="3" fill={color} opacity="0.85" />
      <text
        x={x}
        y={y - 19}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0a0a0f"
        fontSize="6"
        fontWeight="bold"
      >
        {label}
      </text>
    </motion.g>
  );
}

// ─── Growing Tree SVG Component ────────────────────────────
function GrowingTree({ corpus, label }: { corpus: number; label: string }) {
  const state = getTreeState(corpus);
  const scale = getTreeScale(state);
  const viewW = 200;
  const viewH = 280;
  const baseY = viewH - 20;

  // Trunk dimensions based on state
  const trunkWidth: Record<TreeState, number> = { seed: 0, sapling: 6, small: 10, medium: 16, huge: 24 };
  const trunkHeight: Record<TreeState, number> = { seed: 0, sapling: 50, small: 90, medium: 130, huge: 160 };

  // Branch configurations
  const branchCount: Record<TreeState, number> = { seed: 0, sapling: 0, small: 2, medium: 5, huge: 8 };
  const leafCount: Record<TreeState, number> = { seed: 0, sapling: 3, small: 10, medium: 22, huge: 40 };

  // Generate leaves
  const leaves = useMemo(() => {
    if (state === 'seed') return [];
    const topY = baseY - trunkHeight[state] - 20;
    const canopyCenter = topY - 15;
    const canopyRadius: Record<TreeState, number> = { seed: 0, sapling: 20, small: 35, medium: 50, huge: 65 };

    return Array.from({ length: leafCount[state] }, (_, i) => {
      const angle = (i / leafCount[state]) * Math.PI * 2 + (i * 0.3);
      const r = canopyRadius[state] * (0.3 + Math.random() * 0.7);
      const cx = viewW / 2 + Math.cos(angle) * r;
      const cy = canopyCenter + Math.sin(angle) * r * 0.6;
      return { x: cx, y: cy, id: i };
    });
  }, [state, corpus]);

  // Milestone money leaves
  const moneyLeaves = useMemo(() => {
    return MILESTONES.filter((m) => corpus >= m.amount).map((m, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 6;
      const cx = viewW / 2 + Math.cos(angle) * 50;
      const cy = baseY - trunkHeight[state] - 30 + Math.sin(angle) * 25;
      return { ...m, x: cx, y: cy, delay: i * 0.2 };
    });
  }, [corpus, state]);

  // Branch paths
  const branches = useMemo(() => {
    const count = branchCount[state];
    if (count === 0) return [];
    const topY = baseY - trunkHeight[state];
    return Array.from({ length: count }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const startFrac = 0.4 + (i / count) * 0.5;
      const startX = viewW / 2 + side * trunkWidth[state] * 0.3;
      const startY = baseY - trunkHeight[state] * startFrac;
      const endX = viewW / 2 + side * (30 + Math.random() * 30);
      const endY = startY - 20 - Math.random() * 30;
      const cpX = startX + side * 15;
      const cpY = (startY + endY) / 2;
      return { d: `M${startX},${startY} Q${cpX},${cpY} ${endX},${endY}`, id: i };
    });
  }, [state, corpus]);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full max-w-[220px] sm:max-w-[260px]"
        style={{ filter: 'drop-shadow(0 4px 20px rgba(34,197,94,0.15))' }}
      >
        {/* Ground */}
        <ellipse cx={viewW / 2} cy={baseY + 5} rx={60 * scale + 30} ry={8} fill="#1a1a2e" />

        {/* Seed state */}
        {state === 'seed' && (
          <motion.ellipse
            cx={viewW / 2}
            cy={baseY - 5}
            rx={10}
            ry={7}
            fill="#92400e"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          />
        )}

        {/* Trunk */}
        {state !== 'seed' && (
          <motion.rect
            x={viewW / 2 - trunkWidth[state] / 2}
            y={baseY - trunkHeight[state]}
            width={trunkWidth[state]}
            height={trunkHeight[state]}
            rx={trunkWidth[state] / 3}
            fill="#92400e"
            initial={{ height: 0, y: baseY }}
            animate={{ height: trunkHeight[state], y: baseY - trunkHeight[state] }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        )}

        {/* Trunk highlight */}
        {state !== 'seed' && (
          <motion.rect
            x={viewW / 2 - trunkWidth[state] / 2 + 2}
            y={baseY - trunkHeight[state] + 5}
            width={trunkWidth[state] * 0.3}
            height={trunkHeight[state] - 10}
            rx={2}
            fill="#a16207"
            opacity={0.4}
            initial={{ height: 0 }}
            animate={{ height: trunkHeight[state] - 10 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          />
        )}

        {/* Branches */}
        {branches.map((branch) => (
          <motion.path
            key={branch.id}
            d={branch.d}
            stroke="#92400e"
            strokeWidth={state === 'medium' ? 5 : state === 'huge' ? 7 : 3}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        ))}

        {/* Green leaves */}
        {leaves.map((leaf) => (
          <motion.circle
            key={leaf.id}
            cx={leaf.x}
            cy={leaf.y}
            r={state === 'huge' ? 8 : state === 'medium' ? 6 : 5}
            fill="#22c55e"
            opacity={0.85}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.3 + leaf.id * 0.02,
            }}
          />
        ))}

        {/* Canopy overlay glow for huge tree */}
        {state === 'huge' && (
          <motion.circle
            cx={viewW / 2}
            cy={baseY - trunkHeight[state] - 35}
            r={55}
            fill="url(#treeGlow)"
            opacity={0.3}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}

        {/* Money leaves (milestones) */}
        {moneyLeaves.map((ml) => (
          <MoneyLeaf
            key={ml.label}
            x={ml.x}
            y={ml.y}
            label={ml.label}
            color={ml.color}
            delay={ml.delay}
            visible={true}
          />
        ))}

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Label below tree */}
      <div className="text-center mt-2">
        <span className="text-xs text-[#a0a0b8] font-medium">{label}</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function CompoundingTree() {
  const [monthlyAmount, setMonthlyAmount] = useState(2000);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setYears] = useState(20);
  const [showComparison, setShowComparison] = useState(true);

  // ─── Calculations ─────────────────────────────────────
  const corpus = useMemo(
    () => calculateSIP(monthlyAmount, returnRate, years),
    [monthlyAmount, returnRate, years]
  );

  const investedAmount = monthlyAmount * years * 12;
  const compoundingGain = corpus - investedAmount;

  // Comparison: Age 20 vs Age 30 (10 year difference)
  const comparisonYears20 = useMemo(
    () => calculateSIP(monthlyAmount, returnRate, years),
    [monthlyAmount, returnRate, years]
  );
  const comparisonYears30 = useMemo(
    () => calculateSIP(monthlyAmount, returnRate, Math.max(1, years - 10)),
    [monthlyAmount, returnRate, years]
  );
  const delayLoss = comparisonYears20 - comparisonYears30;

  // ─── Milestone achievement text ──────────────────────
  const milestoneText = useMemo(() => {
    const reached = MILESTONES.filter((m) => corpus >= m.amount);
    if (reached.length === 0) return 'Abhi tree ug raha hai... SIP continue karo!';
    const latest = reached[reached.length - 1];
    return `🎉 ${latest.label} milestone achieve hua!`;
  }, [corpus]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-4 select-none dots-pattern">
      {/* ── Header ────────────────────────────────────── */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <TreePine className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-gradient-animated">
            Power of Compounding 🌳
          </h2>
        </div>
        <p className="text-sm text-[#a0a0b8] font-medium">
          Jaldi start karo — tree bada hoga, corpus bhi bada hoga!
        </p>
      </div>

      {/* ── Controls ──────────────────────────────────── */}
      <div className="w-full bg-[#12121a] border border-white/[0.06] rounded-xl p-4 mb-5 space-y-4">
        {/* Monthly Amount Slider */}
        <SliderControl
          label="Monthly SIP Amount"
          value={monthlyAmount}
          min={100}
          max={10000}
          step={100}
          onChange={setMonthlyAmount}
          prefix="Rs."
          color="#22c55e"
        />

        {/* Return Rate Selector */}
        <div>
          <span className="text-sm text-[#a0a0b8] block mb-2 font-medium">Expected Return Rate</span>
          <div className="flex gap-2">
            {RETURN_OPTIONS.map((rate) => (
              <button
                key={rate}
                onClick={() => setReturnRate(rate)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-bold transition-all border',
                  returnRate === rate
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 text-[#a0a0b8] hover:border-white/20 hover:bg-white/[0.04] transition-colors'
                )}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Years Slider */}
        <SliderControl
          label="Investment Period"
          value={years}
          min={1}
          max={40}
          step={1}
          onChange={setYears}
          suffix=" saal"
          color="#f59e0b"
        />

        {/* Comparison Toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={cn(
            'w-full py-2 rounded-lg text-sm font-medium transition-all border',
            showComparison
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-[#a0a0b8] hover:bg-amber-400/5 transition-colors'
          )}
        >
          {showComparison ? '✅ Comparison Mode ON' : '📊 Turn on Comparison Mode'}
        </button>
      </div>

      {/* ── Trees Area ────────────────────────────────── */}
      {showComparison ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
          {/* Age 20 tree */}
          <div className="card-dark rounded-xl p-3 glow-soft relative overflow-hidden corner-accent">
            {/* Falling coin particles */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute pointer-events-none text-xs"
                style={{
                  left: `${20 + i * 30}%`,
                  animation: `fallingCoin ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
              >
                💰
              </div>
            ))}
            <GrowingTree corpus={comparisonYears20} label="Age 20 se start" />
            <div className="text-center mt-2">
              <AnimatedNumber
                value={Math.round(comparisonYears20)}
                className="text-lg sm:text-xl font-black text-amber-400 text-glow-gold"
              />
            </div>
          </div>

          {/* Age 30 tree */}
          <div className="card-dark rounded-xl p-3 glass-card-premium">
            <GrowingTree corpus={comparisonYears30} label="Age 30 se start" />
            <div className="text-center mt-2">
              <AnimatedNumber
                value={Math.round(comparisonYears30)}
                className="text-lg sm:text-xl font-black text-[#a0a0b8] number-highlight"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full card-dark rounded-xl p-4 mb-4 glow-soft relative overflow-hidden corner-accent">
          {/* Falling coin particles */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute pointer-events-none text-xs"
              style={{
                left: `${15 + i * 22}%`,
                animation: `fallingCoin ${2.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              💰
            </div>
          ))}
          <GrowingTree corpus={corpus} label={`Rs.${monthlyAmount.toLocaleString('en-IN')}/month × ${years} years @ ${returnRate}%`} />
          <div className="text-center mt-3">
            <AnimatedNumber
              value={Math.round(corpus)}
              className="text-2xl sm:text-3xl font-black text-amber-400 text-glow-gold"
            />
          </div>
        </div>
      )}

      {/* ── Comparison Loss Banner ────────────────────── */}
      {showComparison && (
        <motion.div
          className="w-full bg-red-950/30 border border-red-500/20 rounded-xl p-3 mb-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={delayLoss}
        >
          <p className="text-sm text-red-400 font-bold">
            Sirf 10 saal delay = <span className="text-red-300">{formatCurrency(Math.round(delayLoss))}</span> ka loss!
          </p>
          <p className="text-[10px] text-[#a0a0b8] mt-1 font-medium">
            Compounding ka asli magic — jaldi start, zyada fayda
          </p>
        </motion.div>
      )}

      {/* ── Milestone Text ────────────────────────────── */}
      <motion.div
        className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4 text-center"
        key={milestoneText}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-amber-200 font-medium">{milestoneText}</p>
        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          {MILESTONES.map((m) => {
            const reached = corpus >= m.amount;
            return (
              <span
                key={m.label}
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full border font-medium',
                  reached
                    ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/5 text-[#a0a0b8]/50'
                )}
              >
                {m.label}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stats Cards ───────────────────────────────── */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          label="Final Corpus"
          value={Math.round(corpus)}
          prefix="Rs."
          color="#f59e0b"
          icon="TrendingUp"
          className="glass-card-premium"
        />
        <StatCard
          label="Total Invested"
          value={investedAmount}
          prefix="Rs."
          color="#3b82f6"
          icon="Coins"
          className="glass-card-premium"
        />
        <StatCard
          label="Compounding Gain"
          value={Math.round(compoundingGain)}
          prefix="Rs."
          color="#22c55e"
          icon="TreePine"
          className="glass-card-premium"
        />
      </div>

      {/* ── Formula Explanation ───────────────────────── */}
      <div className="w-full mt-4 bg-[#1a1a2e] border border-white/[0.06] rounded-xl p-4">
        <p className="text-xs text-[#a0a0b8] text-center font-medium">
          📐 SIP Formula: FV = P × [(1+r)<sup>n</sup> - 1] / r × (1+r)
        </p>
        <p className="text-[10px] text-[#a0a0b8]/60 text-center mt-1 font-medium">
          P = monthly amount • r = monthly return rate • n = total months
        </p>
        <p className="text-[10px] text-emerald-400/70 text-center mt-2">
          💡 Compounding ka asli secret: profits pe profits grow karte hain — jitna lamba time, utna bada tree!
        </p>
      </div>
    </div>
  );
}
