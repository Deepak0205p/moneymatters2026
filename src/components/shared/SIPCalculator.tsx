'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Sparkles,
  IndianRupee,
  Mountain,
  Flag,
  Smartphone,
  Bike,
  Plane,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { calculateSIP, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

/* ============================================================
   SIP Calculator — Wealth Mountain concept
   ============================================================ */

interface SIPCalculatorProps {
  open: boolean;
  onClose: () => void;
}

const PRESETS = [500, 1000, 2000, 5000];

const MILESTONES = [
  { value: 100000,   label: '₹1 Lakh',   emoji: '🎯' },
  { value: 500000,   label: '₹5 Lakh',   emoji: '🏆' },
  { value: 1000000,  label: '₹10 Lakh',  emoji: '👑' },
  { value: 10000000, label: '₹1 Crore',  emoji: '🤯' },
];

const COMPARISONS = {
  iphone: 80000,
  enfield: 200000,
  goa: 25000,
};

export function SIPCalculator({ open, onClose }: SIPCalculatorProps) {
  const { addCoins } = useAppStore();
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const totalInvested = monthly * years * 12;
  const totalValue = calculateSIP(monthly, rate, years);
  const totalReturns = totalValue - totalInvested;

  /* Donut chart for invested vs returns */
  const investedPct = totalValue > 0 ? (totalInvested / totalValue) * 100 : 0;

  /* Mountain height scale (relative to ₹1Cr) */
  const mountainScale = Math.min(100, (totalValue / 10000000) * 100);

  /* Next milestone */
  const nextMilestone = MILESTONES.find((m) => m.value > totalValue) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find((m) => m.value <= totalValue);
  const progressToNext = prevMilestone
    ? ((totalValue - prevMilestone.value) / (nextMilestone.value - prevMilestone.value)) * 100
    : (totalValue / nextMilestone.value) * 100;

  /* Relatable comparisons */
  const iphones = Math.floor(totalValue / COMPARISONS.iphone);
  const enfields = Math.floor(totalValue / COMPARISONS.enfield);
  const goaTrips = Math.floor(totalValue / COMPARISONS.goa);

  /* FD comparison */
  const fdValue = monthly * years * 12 * (1 + (6.5 / 100) * years);
  const fdGain = fdValue - totalInvested;

  /* Milestones crossed */
  const crossedMilestones = MILESTONES.filter((m) => m.value <= totalValue);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>SIP Calculator</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
              <Mountain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold heading-gradient">Wealth Mountain ⛰️</h2>
              <p className="text-xs text-[#94A3B8]">SIP se apna pahad banao</p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Visual Wealth Mountain */}
          <div className="relative h-44 rounded-2xl glass-card overflow-hidden">
            {/* Stars background */}
            <div className="absolute inset-0 opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-white"
                  style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 13) % 50}%` }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>

            {/* Mountain SVG */}
            <svg viewBox="0 0 300 160" className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="investedGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%"  stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="returnsGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%"  stopColor="#f59e0b" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Mountain base — invested (emerald) */}
              <motion.path
                d={`M 0 160 L 0 ${160 - mountainScale * 0.7} Q 60 ${160 - mountainScale * 0.8} 150 ${160 - mountainScale} Q 240 ${160 - mountainScale * 0.8} 300 ${160 - mountainScale * 0.7} L 300 160 Z`}
                fill="url(#investedGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Mountain peak — returns (gold), overlapping top portion */}
              <motion.path
                d={`M 0 ${160 - mountainScale * 0.5} Q 60 ${160 - mountainScale * 0.75} 150 ${160 - mountainScale} Q 240 ${160 - mountainScale * 0.75} 300 ${160 - mountainScale * 0.5} L 300 ${160 - mountainScale * 0.55} Q 150 ${160 - mountainScale * 0.4} 0 ${160 - mountainScale * 0.55} Z`}
                fill="url(#returnsGrad)"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />

              {/* Peak flag */}
              <motion.g
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <line x1="150" y1={160 - mountainScale} x2="150" y2={160 - mountainScale - 18} stroke="#94A3B8" strokeWidth="1.5" />
                <text x="150" y={160 - mountainScale - 4} fontSize="14" textAnchor="middle">🚩</text>
              </motion.g>

              {/* Milestone flags */}
              {MILESTONES.map((m, i) => {
                const ratio = m.value / 10000000;
                const x = 30 + i * 75;
                const y = 160 - Math.min(mountainScale, ratio * 100) - 8;
                const crossed = m.value <= totalValue;
                return (
                  <g key={m.value}>
                    <line x1={x} y1={y} x2={x} y2={y + 6} stroke={crossed ? '#fbbf24' : '#475569'} strokeWidth="1" />
                    <text x={x} y={y - 1} fontSize="9" textAnchor="middle" opacity={crossed ? 1 : 0.5}>
                      {crossed ? m.emoji : '⚪'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Top-left labels */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur text-[9px] font-bold text-emerald-300">
                🟢 Invested
              </div>
              <div className="px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur text-[9px] font-bold text-amber-300">
                🟡 Returns
              </div>
            </div>

            {/* Top-right total value */}
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg glass-strong">
              <p className="text-[9px] text-[#94A3B8]">Total Value</p>
              <p className="text-sm font-bold text-amber-300">{formatCurrency(totalValue, false)}</p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 p-4 rounded-2xl glass-card">
            {/* Monthly SIP */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#F8FAFC]">Monthly SIP</label>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">{monthly.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <Slider
                value={[monthly]}
                onValueChange={(v) => setMonthly(v[0])}
                min={500}
                max={50000}
                step={500}
                className="mb-2"
              />
              <div className="flex gap-1.5">
                {PRESETS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setMonthly(amt)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-semibold transition border',
                      monthly === amt
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                        : 'border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]',
                    )}
                  >
                    ₹{amt / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#F8FAFC]">Duration</label>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15">
                  <span className="text-sm font-bold text-amber-300">{years} saal</span>
                </div>
              </div>
              <Slider
                value={[years]}
                onValueChange={(v) => setYears(v[0])}
                min={1}
                max={30}
                step={1}
              />
              <div className="flex justify-between mt-1 text-[10px] text-[#94A3B8]">
                <span>1 saal</span><span>15 saal</span><span>30 saal</span>
              </div>
            </div>

            {/* Return rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#F8FAFC]">Expected Return</label>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/15">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-sm font-bold text-violet-300">{rate}%</span>
                </div>
              </div>
              <Slider
                value={[rate]}
                onValueChange={(v) => setRate(v[0])}
                min={8}
                max={15}
                step={0.5}
              />
              <div className="flex justify-between mt-1 text-[10px] text-[#94A3B8]">
                <span>8% (Safe)</span><span>12% (Default)</span><span>15% (Aggressive)</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-3 gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl glass-card text-center"
            >
              <p className="text-[10px] text-[#94A3B8] mb-0.5">Invested</p>
              <p className="text-base font-bold text-emerald-300">{formatCurrency(totalInvested, false)}</p>
              <p className="text-[9px] text-[#94A3B8]">🟢 Base</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 rounded-2xl glass-card text-center"
            >
              <p className="text-[10px] text-[#94A3B8] mb-0.5">Returns</p>
              <p className="text-base font-bold text-amber-300">{formatCurrency(totalReturns, false)}</p>
              <p className="text-[9px] text-[#94A3B8]">🟡 Peak</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 rounded-2xl glass-card-premium border-amber-400/30 text-center"
            >
              <p className="text-[10px] text-[#94A3B8] mb-0.5">Total Value</p>
              <p className="text-base font-bold text-[#F8FAFC]" style={{ textShadow: '0 0 12px rgba(245,158,11,0.5)' }}>
                {formatCurrency(totalValue, false)}
              </p>
              <p className="text-[9px] text-amber-300">💎 Goal</p>
            </motion.div>
          </div>

          {/* Donut chart */}
          <div className="p-4 rounded-2xl glass-card flex items-center gap-4">
            <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
              <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <motion.circle
                cx="45" cy="45" r="36" fill="none" stroke="#10b981" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 36 * investedPct / 100} ${2 * Math.PI * 36}`}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
                initial={{ strokeDasharray: '0 999' }}
                animate={{ strokeDasharray: `${2 * Math.PI * 36 * investedPct / 100} ${2 * Math.PI * 36}` }}
                transition={{ duration: 0.6 }}
              />
              <motion.circle
                cx="45" cy="45" r="36" fill="none" stroke="#f59e0b" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 36 * (100 - investedPct) / 100} ${2 * Math.PI * 36}`}
                strokeDashoffset={`-${2 * Math.PI * 36 * investedPct / 100}`}
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
                initial={{ strokeDasharray: '0 999' }}
                animate={{ strokeDasharray: `${2 * Math.PI * 36 * (100 - investedPct) / 100} ${2 * Math.PI * 36}` }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <text x="45" y="42" textAnchor="middle" fontSize="8" fill="#94A3B8">Invested</text>
              <text x="45" y="52" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F8FAFC">{Math.round(investedPct)}%</text>
            </svg>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Invested
                </span>
                <span className="font-bold text-emerald-300">{Math.round(investedPct)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Returns
                </span>
                <span className="font-bold text-amber-300">{Math.round(100 - investedPct)}%</span>
              </div>
              <p className="text-[10px] text-emerald-400 pt-1">
                💰 Tumne {formatCurrency(totalReturns, false)} extra kamaye!
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-4 rounded-2xl glass-card">
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Milestone Journey</h3>
            </div>
            <div className="space-y-2">
              {MILESTONES.map((m) => {
                const crossed = m.value <= totalValue;
                return (
                  <div key={m.value} className="flex items-center gap-2">
                    <div className={cn(
                      'w-7 h-7 rounded-full grid place-items-center text-sm shrink-0',
                      crossed ? 'bg-amber-400/20' : 'bg-white/[0.04] grayscale opacity-50',
                    )}>
                      {crossed ? m.emoji : '🔒'}
                    </div>
                    <span className={cn('text-xs flex-1', crossed ? 'text-[#F8FAFC]' : 'text-[#94A3B8]')}>{m.label}</span>
                    {crossed ? (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Crossed!</span>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">{Math.round((totalValue / m.value) * 100)}% there</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Progress bar to next milestone */}
            {nextMilestone && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mb-1">
                  <span>Next: {nextMilestone.label} {nextMilestone.emoji}</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-amber-400"
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* FD comparison */}
          <div className="p-4 rounded-2xl glass-card border border-rose-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">📉</span>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Agar FD mein daalte</h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              FD @6.5% se sirf <span className="font-bold text-rose-300">{formatCurrency(fdValue, false)}</span> milta —
              matlab <span className="font-bold text-amber-300">{formatCurrency(totalReturns - fdGain, false)}</span> kam!
              📉 SIP ne {Math.round((totalReturns / Math.max(fdGain, 1)) * 100) / 100}x zyada return diya!
            </p>
          </div>

          {/* Relatable comparison */}
          <div className="p-4 rounded-2xl glass-card-premium border-emerald-400/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-violet-300">Yeh amount kitna bada hai?</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-xl bg-white/[0.04]">
                <Smartphone className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <p className="text-base font-bold text-[#F8FAFC]">{iphones}</p>
                <p className="text-[9px] text-[#94A3B8]">iPhones 📱</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/[0.04]">
                <Bike className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                <p className="text-base font-bold text-[#F8FAFC]">{enfields}</p>
                <p className="text-[9px] text-[#94A3B8]">Enfields 🏍️</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white/[0.04]">
                <Plane className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <p className="text-base font-bold text-[#F8FAFC]">{goaTrips}</p>
                <p className="text-[9px] text-[#94A3B8]">Goa trips ✈️</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => { addCoins(5); }}
            className="w-full py-3 rounded-xl btn-3d bg-gradient-to-r from-emerald-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Calculator className="w-4 h-4" /> Start SIP Today (+5 coins)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
