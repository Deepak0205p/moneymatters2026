'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  CreditCard, Smartphone, Layers, AlertTriangle, HandCoins,
  ShieldAlert, Skull, LogOut, RotateCcw, Snowflake, ArrowLeftRight,
  MessageSquare, TrendingUp, Scissors, ChevronRight, Lock, Unlock,
  ArrowDown, Zap, Target, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────
const TRAP_STEPS = [
  {
    id: 1,
    icon: CreditCard,
    title: 'Credit Card Liya',
    subtitle: 'Free money lagta hai…',
    color: '#fbbf24',
    bgGlow: '#fbbf2420',
    realCost: 'Rs.50,000 @ 36% = Rs.18,000/year sirf interest',
    trap: 'Minimum payment = lifetime payment!',
    story: 'Tum ek credit card lete ho socha free mein shopping kar lo, baad mein bharo. Lagta hai smart move hai!',
    math: { label: 'Annual Interest', value: '36%', danger: 'HIGH' },
    tip: '💡 Credit card use karo — sirf usse jitna cash zyada hai utna!',
  },
  {
    id: 2,
    icon: Smartphone,
    title: 'EMI Pe Phone Liya',
    subtitle: 'Chhota EMI, bada loss',
    color: '#f97316',
    bgGlow: '#f9731620',
    realCost: 'Rs.1,00,000 phone → EMI total Rs.1,20,000+ (20% extra!)',
    trap: 'Chhota EMI = Chhota chhota loss, bada total!',
    story: 'Latest phone EMI pe liya. Rs.4,000/month lagta hai zyada nahi. Lekin 24 month baad total Rs.20,000 extra paid!',
    math: { label: 'Hidden Extra Cost', value: '20%+', danger: 'MEDIUM' },
    tip: '💡 Phone ke liye 3-6 month save karo, phir cash mein kharido.',
  },
  {
    id: 3,
    icon: Layers,
    title: 'Aur Cards Add Kiye',
    subtitle: 'Debt badhta gaya',
    color: '#ef4444',
    bgGlow: '#ef444420',
    realCost: '3 cards × Rs.30,000 = Rs.90,000 total debt spiral',
    trap: 'Cards add karne se debt kam nahi hota, zyada hota hai!',
    story: 'Pehle card ka bill nahi bhar paye toh doosra card liya. Doosre se teesre pe transfer kiya. Ab 3 cards hain!',
    math: { label: 'Debt Multiplier', value: '3x', danger: 'HIGH' },
    tip: '💡 Ek bhi card ka bill time pe nahi bhara toh naya mat lo!',
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: 'Minimum Payment Trap',
    subtitle: 'Principal nahi utarta',
    color: '#dc2626',
    bgGlow: '#dc262620',
    realCost: 'Rs.50,000 minimum pay × 5 years = Rs.1,40,000 total!',
    trap: 'Principal utarna = sapna, minimum payment mein!',
    story: 'Sirf minimum due pay karte ho. Lagta hai safe ho. Lekin 5 saal baad original amount wahi hai — interest tera paisa kha raha hai!',
    math: { label: 'Extra Paid in 5yr', value: 'Rs.90,000', danger: 'CRITICAL' },
    tip: '💡 Hamesha minimum se zyada bharo — ideally full amount.',
  },
  {
    id: 5,
    icon: HandCoins,
    title: 'Personal Loan Liya',
    subtitle: 'Debt se debt pay karna',
    color: '#b91c1c',
    bgGlow: '#b91c1c20',
    realCost: 'Rs.3L @ 18% × 3yr = Rs.3,89,000 total repayment',
    trap: 'Debt se debt bharna = aag mein ghee daalna!',
    story: 'Credit card band karne ke liye personal loan liya. "Interest kam hai" socha. Lekin ab ek aur debt hai!',
    math: { label: 'Total Repayment', value: 'Rs.3.89L', danger: 'CRITICAL' },
    tip: '💡 Personal loan tabhi lo jab rate genuinely kam ho aur plan ho.',
  },
  {
    id: 6,
    icon: ShieldAlert,
    title: 'CIBIL Score Gira',
    subtitle: 'Ab loan nahi milega',
    color: '#991b1b',
    bgGlow: '#991b1b20',
    realCost: 'CIBIL 750→680: Loan rate 8% se 14% = Lakhs extra interest',
    trap: 'CIBIL score girna = financial jail ka darwaza!',
    story: 'Late payments, high utilization, multiple hard inquiries — CIBIL 750 se 680 aa gaya. Ab koi bank acchi rate nahi deta!',
    math: { label: 'Rate Penalty', value: '+6% pa', danger: 'CRITICAL' },
    tip: '💡 CIBIL score check karte raho — Credit Karma, CIBIL app se free mein.',
  },
  {
    id: 7,
    icon: Skull,
    title: 'Full Debt Trap!',
    subtitle: 'Bahut late ho gaya…',
    color: '#7f1d1d',
    bgGlow: '#7f1d1d30',
    realCost: 'Total trap: Rs.5-10 lakh debt, 30-40% income EMI mein, zero savings',
    trap: 'Bahut late ho gaya... lekin abhi bhi waqt hai — EXIT dekho!',
    story: 'Multiple loans, zero savings, girta CIBIL, stress. Lagta hai koi raasta nahi. LEKIN HAI! Debt se bahar nikla ja sakta hai!',
    math: { label: 'Income in EMI', value: '40%+', danger: 'EXTREME' },
    tip: '💡 Pehla step: Sabhi debts list karo. Clarity se solution milta hai.',
  },
];

const EXIT_STRATEGIES = [
  {
    id: 1, icon: Snowflake, color: '#3b82f6',
    title: 'Avalanche Method',
    desc: 'Sabse zyada interest wale debt ko pehle bharo.',
    detail: 'Mathematically sahi — total interest kam se kam lagta hai.',
    badge: 'Best for Math',
  },
  {
    id: 2, icon: Layers, color: '#8b5cf6',
    title: 'Snowball Method',
    desc: 'Sabse chhota debt pehle bharo.',
    detail: 'Quick wins se motivation milta hai — psychology ka game!',
    badge: 'Best for Motivation',
  },
  {
    id: 3, icon: ArrowLeftRight, color: '#06b6d4',
    title: 'Balance Transfer',
    desc: 'High interest card ka balance low rate pe transfer karo.',
    detail: 'Processing fee pehle check karo. 0% intro offers dekho.',
    badge: 'Best for CC Debt',
  },
  {
    id: 4, icon: MessageSquare, color: '#10b981',
    title: 'Bank Negotiate Karo',
    desc: 'Bank ko call karo — interest reduce karne ke liye bol.',
    detail: '70% log kabhi negotiate nahi karte. Ye possible hai!',
    badge: 'Most Ignored',
  },
  {
    id: 5, icon: TrendingUp, color: '#f59e0b',
    title: 'Income Badhao',
    desc: 'Side hustle / freelance income seedha debt mein daalo.',
    detail: 'Extra Rs.5,000/month bhi 1 saal mein Rs.60,000 debt clear!',
    badge: 'High Impact',
  },
  {
    id: 6, icon: Scissors, color: '#ef4444',
    title: 'Kharcha Kaato',
    desc: 'Subscriptions cancel, eating out band, zero waste.',
    detail: 'Average Indian wastes Rs.3,000-8,000/month on avoidable spends.',
    badge: 'Immediate Action',
  },
];

const DANGER_COLORS = {
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626',
  EXTREME: '#7f1d1d',
};

// ─── SVG Animated Flowchart ───────────────────────────────────────────────────
function DebtFlowchart({ unlockedCount }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const nodePositions = [
    { cx: 160, cy: 40 },   // 1
    { cx: 260, cy: 110 },  // 2
    { cx: 140, cy: 185 },  // 3
    { cx: 270, cy: 260 },  // 4
    { cx: 130, cy: 335 },  // 5
    { cx: 260, cy: 410 },  // 6
    { cx: 160, cy: 490 },  // 7 — skull
  ];

  const paths = [
    `M160,40 Q200,70 260,110`,
    `M260,110 Q190,145 140,185`,
    `M140,185 Q200,220 270,260`,
    `M270,260 Q190,295 130,335`,
    `M130,335 Q200,370 260,410`,
    `M260,410 Q200,450 160,490`,
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 420 540"
        className="w-full max-w-sm mx-auto"
        style={{ minHeight: 320 }}
      >
        <defs>
          {TRAP_STEPS.map((s) => (
            <radialGradient key={s.id} id={`glow-${s.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.2)" />
          </marker>
        </defs>

        {/* Connection paths */}
        {paths.map((d, i) => {
          const unlocked = unlockedCount > i;
          const step = TRAP_STEPS[i];
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              strokeWidth="2"
              stroke={unlocked ? step.color : 'rgba(255,255,255,0.08)'}
              strokeDasharray="6 4"
              markerEnd="url(#arrow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? {
                pathLength: unlocked ? 1 : 0,
                opacity: unlocked ? 0.8 : 0.15,
              } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            />
          );
        })}

        {/* Nodes */}
        {TRAP_STEPS.map((step, i) => {
          const pos = nodePositions[i];
          const unlocked = unlockedCount > i;
          const isLast = i === 6;
          const r = isLast ? 28 : 22;

          return (
            <g key={step.id}>
              {/* Glow halo */}
              {unlocked && (
                <motion.circle
                  cx={pos.cx} cy={pos.cy} r={r + 14}
                  fill={`url(#glow-${step.id})`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              )}
              {/* Circle */}
              <motion.circle
                cx={pos.cx} cy={pos.cy} r={r}
                fill={unlocked ? `${step.color}22` : 'rgba(20,20,35,0.8)'}
                stroke={unlocked ? step.color : 'rgba(255,255,255,0.08)'}
                strokeWidth={unlocked ? 2 : 1}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1, type: 'spring', stiffness: 200 }}
              />
              {/* Number */}
              <motion.text
                x={pos.cx} y={pos.cy + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isLast ? 13 : 11}
                fontWeight="900"
                fill={unlocked ? step.color : 'rgba(255,255,255,0.2)'}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
              >
                {isLast ? '💀' : step.id}
              </motion.text>

              {/* Label beside node */}
              <motion.text
                x={i % 2 === 0 ? pos.cx - r - 8 : pos.cx + r + 8}
                y={pos.cy}
                textAnchor={i % 2 === 0 ? 'end' : 'start'}
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="700"
                fill={unlocked ? step.color : 'rgba(255,255,255,0.2)'}
                initial={{ opacity: 0, x: i % 2 === 0 ? 10 : -10 }}
                animate={inView ? { opacity: unlocked ? 1 : 0.3, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.15 }}
              >
                {step.title}
              </motion.text>
            </g>
          );
        })}

        {/* Spiral text at bottom */}
        {unlockedCount === 7 && (
          <motion.text
            x="210" y="530"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill="#22c55e"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            EXIT DOOR ↓ NEECHE DEKHO
          </motion.text>
        )}
      </svg>
    </div>
  );
}

// ─── Danger Badge ─────────────────────────────────────────────────────────────
function DangerBadge({ level }) {
  const colors = { MEDIUM: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626', EXTREME: '#7f1d1d' };
  const c = colors[level] || '#ef4444';
  return (
    <span
      className="text-[8px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase"
      style={{ color: c, borderColor: `${c}60`, backgroundColor: `${c}15` }}
    >
      {level}
    </span>
  );
}

// ─── Debt Progress Bar ────────────────────────────────────────────────────────
function DebtMeter({ count }) {
  const pct = (count / 7) * 100;
  const color = count <= 2 ? '#fbbf24' : count <= 4 ? '#ef4444' : '#7f1d1d';
  const label = count === 0 ? 'Shuruat karo' : count <= 2 ? 'Thoda aware ho...' : count <= 4 ? 'Trap gehra ho raha hai ⚠️' : count <= 6 ? 'Bahut mushkil! 😱' : 'FULL DEBT TRAP 💀';

  return (
    <div className="w-full rounded-2xl border border-white/[0.07] bg-[#0d0f1f] p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black text-white uppercase tracking-wider">Debt Spiral Meter</span>
        <span className="text-xs font-black tabular-nums" style={{ color }}>{count}/7 Doors</span>
      </div>
      <div className="relative h-3 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, #fbbf24, ${color})` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Pulse at tip */}
        {count > 0 && count < 7 && (
          <motion.div
            className="absolute top-0 bottom-0 w-3 rounded-full"
            style={{ left: `calc(${pct}% - 6px)`, backgroundColor: color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      <motion.p
        key={count}
        className="text-[10px] mt-2 font-bold text-center"
        style={{ color }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {label}
      </motion.p>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isUnlocked, isActive, onUnlock }) {
  const Icon = step.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
        isUnlocked ? 'border-opacity-40' : 'border-white/[0.06]'
      }`}
      style={{
        borderColor: isUnlocked ? `${step.color}50` : undefined,
        background: isUnlocked
          ? `linear-gradient(135deg, ${step.color}08 0%, #0a0c1a 100%)`
          : 'linear-gradient(135deg, #0d0f1f 0%, #0a0c1a 100%)',
        boxShadow: isActive ? `0 0 40px ${step.color}25, inset 0 0 30px ${step.color}05` : 'none',
      }}
    >
      {/* Ambient glow blob */}
      {isUnlocked && (
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] opacity-30 pointer-events-none"
          style={{ backgroundColor: step.color }}
        />
      )}

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon box */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                backgroundColor: isUnlocked ? `${step.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isUnlocked ? step.color + '35' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {isUnlocked
                ? <Icon size={22} style={{ color: step.color }} />
                : <Lock size={16} className="text-zinc-600" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                  style={{
                    color: isUnlocked ? step.color : '#555',
                    backgroundColor: isUnlocked ? `${step.color}15` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isUnlocked ? step.color + '25' : 'transparent'}`,
                  }}
                >
                  DOOR {step.id}/7
                </span>
                {isUnlocked && <DangerBadge level={step.math.danger} />}
              </div>
              <h3 className={`text-sm font-extrabold transition-colors duration-300 ${isUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                {step.title}
              </h3>
              <p className={`text-[10px] ${isUnlocked ? 'text-zinc-400' : 'text-zinc-700'}`}>
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Unlock button or checkmark */}
          {!isUnlocked ? (
            <motion.button
              onClick={onUnlock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
              style={{
                backgroundColor: `${step.color}18`,
                color: step.color,
                border: `1px solid ${step.color}35`,
              }}
            >
              <Unlock size={10} />
              Kholo
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${step.color}20`, border: `1px solid ${step.color}40` }}
            >
              <CheckCircle2 size={14} style={{ color: step.color }} />
            </motion.div>
          )}
        </div>

        {/* Revealed content */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              {/* Story */}
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                {step.story}
              </p>

              {/* Math chip + Stat */}
              <div className="flex gap-2 mb-3">
                <div
                  className="flex-1 rounded-xl p-3"
                  style={{ backgroundColor: `${step.color}10`, border: `1px solid ${step.color}20` }}
                >
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Real Cost</p>
                  <p className="text-xs font-black" style={{ color: step.color }}>{step.realCost}</p>
                </div>
                <div
                  className="flex flex-col items-center justify-center px-4 rounded-xl"
                  style={{ backgroundColor: `${DANGER_COLORS[step.math.danger]}10`, border: `1px solid ${DANGER_COLORS[step.math.danger]}20` }}
                >
                  <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">{step.math.label}</p>
                  <p className="text-base font-black" style={{ color: DANGER_COLORS[step.math.danger] }}>{step.math.value}</p>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-xl p-3 bg-red-950/30 border border-red-500/20 mb-3">
                <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-300 font-semibold leading-snug">
                  {step.trap}
                </p>
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2 rounded-xl p-3 bg-emerald-950/20 border border-emerald-500/15">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-300 font-medium leading-snug">
                  {step.tip}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Exit Section ─────────────────────────────────────────────────────────────
function ExitSection({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-[#0a1a12] to-[#0a0c1a] p-8 mb-8 text-center">
        {/* Animated SVG background rings */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
          {[60, 100, 140, 180].map((r, i) => (
            <motion.circle
              key={i} cx="200" cy="100" r={r}
              fill="none" stroke="#22c55e" strokeWidth="1"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </svg>

        <motion.div
          className="relative z-10"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <LogOut size={36} className="text-emerald-400" />
          </div>
        </motion.div>
        <h2
          className="text-3xl font-black text-emerald-400 mb-2 relative z-10"
          style={{ textShadow: '0 0 30px rgba(34,197,94,0.5)' }}
        >
          EXIT Door Mila! 🚪
        </h2>
        <p className="text-sm text-zinc-400 relative z-10">
          Debt trap se bahar nikalna possible hai — ye 6 proven strategies hain
        </p>
      </div>

      {/* Strategy grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {EXIT_STRATEGIES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0f1120] to-[#0a0c1a] p-5 overflow-hidden group hover:border-opacity-40 transition-all duration-300"
              style={{ '--c': s.color }}
            >
              <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-[30px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: s.color }}
              />
              <div className="flex items-start gap-3 relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-extrabold text-white">{s.title}</h4>
                    <span
                      className="text-[7px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ color: s.color, backgroundColor: `${s.color}18`, border: `1px solid ${s.color}25` }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-1">{s.desc}</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Golden Rule */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 mb-6 text-center"
      >
        <p className="text-sm font-bold text-amber-300 mb-1">
          💡 Golden Rule of Debt Freedom
        </p>
        <p className="text-xs text-zinc-400">
          Pehla step: Sabhi debts ek list mein likho — amount, interest rate, minimum payment.<br />
          <strong className="text-white">Clarity se hi solution milta hai.</strong>
        </p>
      </motion.div>

      {/* Reset */}
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#0a0c1a',
        }}
      >
        <RotateCcw size={15} className="inline mr-2" />
        Phir Se Dekho — Doors Reset
      </motion.button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DebtDoors() {
  const { debtDoorLevel, setDebtDoorLevel } = useAppStore();
  const [unlockedIds, setUnlockedIds] = useState(() =>
    new Set(Array.from({ length: debtDoorLevel }, (_, i) => i + 1))
  );
  const [showExit, setShowExit] = useState(debtDoorLevel >= 7);
  const [activeView, setActiveView] = useState('journey'); // 'journey' | 'flowchart'

  const unlockedCount = unlockedIds.size;

  const handleUnlock = (id) => {
    const next = new Set(unlockedIds);
    next.add(id);
    setUnlockedIds(next);
    setDebtDoorLevel(id);
    if (id === 7) {
      setTimeout(() => setShowExit(true), 900);
    }
  };

  const handleReset = () => {
    setUnlockedIds(new Set());
    setDebtDoorLevel(0);
    setShowExit(false);
  };

  if (showExit) {
    return (
      <div className="w-full max-w-2xl mx-auto px-2 py-6">
        <ExitSection onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-2"
        >
          <AlertCircle size={12} className="text-red-400" />
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Debt Awareness Simulator</span>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Debt Trap Ka Darwaza{' '}
          <span className="text-red-400">🚪</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Har darwaza ek naya debt trap hai — ek ek kholke samjho kaise log phaste hain, phir EXIT nikalte hain!
        </p>
      </div>

      {/* ── View Toggle ── */}
      <div className="flex gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] w-fit mx-auto">
        {[
          { key: 'journey', label: '📖 Journey Mode' },
          { key: 'flowchart', label: '🗺️ Flowchart' },
        ].map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 ${
              activeView === v.key
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ── Debt Meter ── */}
      <DebtMeter count={unlockedCount} />

      <AnimatePresence mode="wait">
        {activeView === 'journey' ? (
          <motion.div
            key="journey"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Instruction */}
            {unlockedCount === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center gap-2 text-zinc-500 text-xs">
                  <Zap size={12} className="text-amber-400" />
                  Pehla darwaza kholke shuruat karo
                  <ArrowDown size={12} className="animate-bounce text-amber-400" />
                </div>
              </motion.div>
            )}

            {/* Step Cards */}
            {TRAP_STEPS.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                isUnlocked={unlockedIds.has(step.id)}
                isActive={unlockedCount === step.id - 1}
                onUnlock={() => handleUnlock(step.id)}
              />
            ))}

            {/* Completion prompt */}
            {unlockedCount === 7 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <p className="text-sm font-black text-emerald-400 mb-3">
                  Saare 7 doors dekh liye! 🎉
                </p>
                <motion.button
                  onClick={() => setShowExit(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#0a0c1a' }}
                >
                  <LogOut size={14} className="inline mr-2" />
                  EXIT Strategies Dekho
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="flowchart"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Flowchart Legend */}
            <div className="flex flex-wrap gap-3 justify-center mb-2">
              {[
                { color: '#fbbf24', label: 'Shuruat (Warning)' },
                { color: '#ef4444', label: 'Danger Zone' },
                { color: '#7f1d1d', label: 'Critical Trap' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] text-zinc-500 font-semibold">{l.label}</span>
                </div>
              ))}
            </div>

            {/* SVG Flowchart */}
            <div className="rounded-3xl border border-white/[0.07] bg-[#0a0c1a] p-4">
              <DebtFlowchart unlockedCount={unlockedCount} />
            </div>

            {/* Concept Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              {TRAP_STEPS.map((step) => {
                const unlocked = unlockedIds.has(step.id);
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className="rounded-xl p-3 border transition-all duration-300"
                    style={{
                      borderColor: unlocked ? `${step.color}35` : 'rgba(255,255,255,0.05)',
                      backgroundColor: unlocked ? `${step.color}08` : '#0d0f1f',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {unlocked
                        ? <Icon size={13} style={{ color: step.color }} />
                        : <Lock size={11} className="text-zinc-700" />
                      }
                      <span className={`text-[9px] font-black ${unlocked ? 'text-white' : 'text-zinc-700'}`}>
                        {step.title}
                      </span>
                    </div>
                    {unlocked && (
                      <p className="text-[9px] text-zinc-500 leading-tight">{step.subtitle}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unlock from Journey hint */}
            {unlockedCount < 7 && (
              <p className="text-center text-[10px] text-zinc-600 font-semibold">
                Journey Mode mein doors kholo → flowchart unlock hoga
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}