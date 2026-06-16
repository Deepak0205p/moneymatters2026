'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, TrendingUp, Shield, AlertTriangle, ShieldAlert, Sparkles,
  IndianRupee, Building2, Landmark, BarChart3, Coins, Home,
  ChevronRight, Trophy, ArrowRight, Info,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatIndianNumber } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface InvestmentComparisonProps {
  open: boolean;
  onClose: () => void;
}

type RiskLevel = 'low' | 'medium' | 'high';

interface InvestmentOption {
  id: string;
  name: string;
  nameHi: string;
  rate: number;
  risk: RiskLevel;
  color: string;
  icon: React.ReactNode;
  description: string;
  tag: string;
  lockIn?: number;
  entryCost?: string;
}

interface RiskQuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: { text: string; score: number; emoji: string }[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    id: 'fd',
    name: 'Fixed Deposit',
    nameHi: 'FD',
    rate: 6.5,
    risk: 'low',
    color: '#10b981',
    icon: <Landmark className="w-4 h-4" />,
    description: 'Bank mein safe, lekin return kam. Best for short term — 1-5 saal.',
    tag: 'Safe & Steady',
    lockIn: undefined,
    entryCost: undefined,
  },
  {
    id: 'ppf',
    name: 'PPF',
    nameHi: 'PPF',
    rate: 7.1,
    risk: 'low',
    color: '#3b82f6',
    icon: <Shield className="w-4 h-4" />,
    description: 'Government scheme, tax-free return! 15 saal lock-in, lekin solid choice for retirement.',
    tag: 'Tax-Free',
    lockIn: 15,
    entryCost: undefined,
  },
  {
    id: 'mutualFund',
    name: 'Mutual Fund',
    nameHi: 'Mutual Fund',
    rate: 12,
    risk: 'high',
    color: '#f59e0b',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'Market ke saath chalegi — risk hai lekin long term mein sabse zyada return. SIP se invest karo!',
    tag: 'High Growth',
    lockIn: undefined,
    entryCost: undefined,
  },
  {
    id: 'gold',
    name: 'Gold',
    nameHi: 'Gold',
    rate: 8,
    risk: 'medium',
    color: '#eab308',
    icon: <Coins className="w-4 h-4" />,
    description: 'Safe haven! Inflation se bachne ke liye accha. Jewelry se zyada gold ETF/sovereign gold bond socho.',
    tag: 'Inflation Shield',
    lockIn: undefined,
    entryCost: undefined,
  },
  {
    id: 'realEstate',
    name: 'Real Estate',
    nameHi: 'Property',
    rate: 10,
    risk: 'medium',
    color: '#f43f5e',
    icon: <Home className="w-4 h-4" />,
    description: 'Property mein invest — lamba game hai, lekin solid asset. Downpayment aur EMI calculate karke hi karo!',
    tag: 'Solid Asset',
    lockIn: undefined,
    entryCost: 'High (Lakhs)',
  },
];

const RISK_QUIZ: RiskQuizQuestion[] = [
  {
    id: 'risk_tolerance',
    question: 'Agar tumhara investment 20% gir jaaye toh?',
    subtitle: 'Market mein utaar chadhaav hota rehta hai',
    options: [
      { text: 'Panic! Nikal jaata hoon!', score: 1, emoji: '😰' },
      { text: 'Thoda tense hote, lekin hold karte', score: 2, emoji: '😐' },
      { text: 'Aur zyada invest kar deta — sale hai!', score: 3, emoji: '🚀' },
    ],
  },
  {
    id: 'time_horizon',
    question: 'Paisa kab chahiye tumhe?',
    subtitle: 'Investment ka time horizon important hai',
    options: [
      { text: '1-3 saal mein — jaldi chahiye', score: 1, emoji: '⏰' },
      { text: '5-10 saal theek hai', score: 2, emoji: '📅' },
      { text: '10+ saal — long term game', score: 3, emoji: '🎯' },
    ],
  },
  {
    id: 'knowledge',
    question: 'Investment ke baare mein kitna jaante ho?',
    subtitle: 'Knowledge se confidence aata hai',
    options: [
      { text: 'Kuch nahi pata — abhi seekh raha hoon', score: 1, emoji: '📖' },
      { text: 'Basic samajh hai — FD, PPF jaanta hoon', score: 2, emoji: '💡' },
      { text: 'Market follow karta hoon — MF, Stocks samajhte', score: 3, emoji: '🧠' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function calculateCompoundWithSIP(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const n = 12;
  const r = annualRate / 100 / n;
  const t = years;
  const nt = n * t;

  if (r === 0) {
    return principal + monthlyContribution * nt;
  }

  // Compound interest on principal: P(1 + r/n)^(nt)
  const principalGrowth = principal * Math.pow(1 + r, nt);

  // Future value of SIP: PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
  const sipGrowth = monthlyContribution * ((Math.pow(1 + r, nt) - 1) / r);

  return principalGrowth + sipGrowth;
}

function getTotalInvested(principal: number, monthlyContribution: number, years: number): number {
  return principal + monthlyContribution * years * 12;
}

function getRiskIcon(risk: RiskLevel) {
  switch (risk) {
    case 'low': return <Shield className="w-3.5 h-3.5" />;
    case 'medium': return <AlertTriangle className="w-3.5 h-3.5" />;
    case 'high': return <ShieldAlert className="w-3.5 h-3.5" />;
  }
}

function getRiskColor(risk: RiskLevel) {
  switch (risk) {
    case 'low': return { bg: 'bg-emerald-400/15', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'medium': return { bg: 'bg-amber-400/15', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'high': return { bg: 'bg-rose-400/15', text: 'text-rose-400', border: 'border-rose-500/20' };
  }
}

function getRiskLabel(risk: RiskLevel) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Medium Risk';
    case 'high': return 'High Risk';
  }
}

/* ------------------------------------------------------------------ */
/*  Slider styling                                                     */
/* ------------------------------------------------------------------ */
function SliderStyle({ color }: { color: string }) {
  return (
    <style>{`
      [data-slot="slider-range"] {
        background: linear-gradient(90deg, ${color}cc, ${color}) !important;
        border-radius: 9999px;
      }
      [data-slot="slider-thumb"] {
        border-color: ${color} !important;
        background: #0a0a0f !important;
        box-shadow: 0 0 8px ${color}44 !important;
        width: 18px !important;
        height: 18px !important;
      }
      [data-slot="slider-thumb"]:hover {
        box-shadow: 0 0 14px ${color}66 !important;
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  Risk Meter Component                                               */
/* ------------------------------------------------------------------ */
function RiskMeter({ risk }: { risk: RiskLevel }) {
  const colors = getRiskColor(risk);
  const fillCount = risk === 'low' ? 1 : risk === 'medium' ? 2 : 3;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
      {getRiskIcon(risk)}
      <span className={`text-[10px] font-semibold ${colors.text}`}>{getRiskLabel(risk)}</span>
      <div className="flex items-center gap-0.5 ml-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i <= fillCount ? colors.text.replace('text-', 'bg-') : 'bg-white/10'
            }`}
            style={i <= fillCount ? { backgroundColor: risk === 'low' ? '#10b981' : risk === 'medium' ? '#f59e0b' : '#f43f5e' } : {}}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Growth Chart (SVG Line Chart)                                      */
/* ------------------------------------------------------------------ */
function GrowthChart({
  results,
  years,
}: {
  results: { id: string; name: string; color: string; values: number[] }[];
  years: number;
}) {
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Find max value across all results
  const maxVal = Math.max(...results.flatMap((r) => r.values), 1);

  // Year ticks
  const yearTicks = [];
  const step = years <= 5 ? 1 : years <= 15 ? 3 : 5;
  for (let y = 0; y <= years; y += step) {
    yearTicks.push(y);
  }
  if (!yearTicks.includes(years)) yearTicks.push(years);

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (maxVal / yTicks) * i);

  function toX(year: number) {
    return padding.left + (year / years) * chartW;
  }
  function toY(val: number) {
    return padding.top + chartH - (val / maxVal) * chartH;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Grid lines */}
      {yTickValues.map((val, i) => (
        <line
          key={`grid-${i}`}
          x1={padding.left}
          y1={toY(val)}
          x2={width - padding.right}
          y2={toY(val)}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      ))}

      {/* Y-axis labels */}
      {yTickValues.map((val, i) => (
        <text
          key={`ylabel-${i}`}
          x={padding.left - 8}
          y={toY(val) + 4}
          textAnchor="end"
          fill="#555580"
          fontSize="9"
        >
          {val >= 10000000 ? `${(val / 10000000).toFixed(1)}Cr` : val >= 100000 ? `${(val / 100000).toFixed(0)}L` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val.toFixed(0)}
        </text>
      ))}

      {/* X-axis labels */}
      {yearTicks.map((yr) => (
        <text
          key={`xlabel-${yr}`}
          x={toX(yr)}
          y={height - 8}
          textAnchor="middle"
          fill="#555580"
          fontSize="9"
        >
          {yr}yr
        </text>
      ))}

      {/* Lines for each investment */}
      {results.map((result) => {
        const points = result.values.map((val, idx) => {
          const year = idx === 0 ? 0 : (idx / (result.values.length - 1)) * years;
          return `${toX(year)},${toY(val)}`;
        }).join(' ');

        // Area fill
        const areaPoints = [
          `${toX(0)},${toY(0)}`,
          ...result.values.map((val, idx) => {
            const year = idx === 0 ? 0 : (idx / (result.values.length - 1)) * years;
            return `${toX(year)},${toY(val)}`;
          }),
          `${toX(years)},${toY(0)}`,
        ].join(' ');

        return (
          <g key={result.id}>
            {/* Area */}
            <polygon
              points={areaPoints}
              fill={result.color}
              fillOpacity={0.05}
            />
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={result.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* End dot */}
            {result.values.length > 0 && (
              <circle
                cx={toX(years)}
                cy={toY(result.values[result.values.length - 1])}
                r={3}
                fill={result.color}
                stroke="#0a0a0f"
                strokeWidth={1.5}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Horizontal Bar Chart                                               */
/* ------------------------------------------------------------------ */
function HorizontalBarChart({
  results,
}: {
  results: { id: string; name: string; color: string; value: number; rank: number }[];
}) {
  const maxVal = Math.max(...results.map((r) => r.value), 1);

  return (
    <div className="space-y-3">
      {results.map((result, idx) => {
        const pct = (result.value / maxVal) * 100;
        return (
          <div key={result.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: `${result.color}20`, color: result.color }}
                >
                  #{result.rank}
                </span>
                <span className="text-xs font-semibold text-[#e8e8ed] truncate">{result.name}</span>
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: result.color }}>
                ₹{formatIndianNumber(result.value)}
              </span>
            </div>
            <div className="h-7 rounded-lg bg-white/[0.03] border border-white/[0.04] overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full rounded-lg relative"
                style={{
                  background: `linear-gradient(90deg, ${result.color}30, ${result.color}60)`,
                  borderRight: `2px solid ${result.color}`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-30"
                  style={{ background: `linear-gradient(180deg, ${result.color}40, transparent)` }}
                />
              </motion.div>
              {/* Value inside bar */}
              {pct > 25 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="absolute inset-y-0 left-3 flex items-center"
                >
                  <span className="text-[9px] font-semibold text-white/70">
                    ₹{result.value.toLocaleString('en-IN')}
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function InvestmentComparison({ open, onClose }: InvestmentComparisonProps) {
  // Input state
  const [principal, setPrincipal] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [years, setYears] = useState(10);

  // Active tab
  const [activeTab, setActiveTab] = useState<'chart' | 'bars' | 'quiz'>('chart');

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  // Calculations
  const results = useMemo(() => {
    return INVESTMENT_OPTIONS.map((option) => {
      // For PPF, if years < 15, we still calculate but note lock-in
      const effectiveYears = years;
      const finalValue = calculateCompoundWithSIP(
        principal,
        monthlyContribution,
        option.rate,
        effectiveYears
      );
      const totalInvested = getTotalInvested(principal, monthlyContribution, effectiveYears);
      const gains = finalValue - totalInvested;

      return {
        ...option,
        finalValue,
        totalInvested,
        gains,
        gainPct: totalInvested > 0 ? (gains / totalInvested) * 100 : 0,
      };
    });
  }, [principal, monthlyContribution, years]);

  // Chart data - yearly growth for each option
  const chartData = useMemo(() => {
    return INVESTMENT_OPTIONS.map((option) => {
      const values: number[] = [principal]; // Start with principal
      for (let y = 1; y <= years; y++) {
        const val = calculateCompoundWithSIP(principal, monthlyContribution, option.rate, y);
        values.push(val);
      }
      return {
        id: option.id,
        name: option.nameHi,
        color: option.color,
        values,
      };
    });
  }, [principal, monthlyContribution, years]);

  // Ranked results
  const rankedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => b.finalValue - a.finalValue);
    return sorted.map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [results]);

  // Bar chart data
  const barData = useMemo(() => {
    return rankedResults.map((r) => ({
      id: r.id,
      name: r.nameHi,
      color: r.color,
      value: r.finalValue,
      rank: r.rank,
    }));
  }, [rankedResults]);

  // Quiz recommendation
  const recommendation = useMemo(() => {
    if (!quizDone) return null;
    const totalScore = quizAnswers.reduce((a, b) => a + b, 0);

    if (totalScore <= 4) {
      // Conservative
      return {
        riskProfile: 'Conservative',
        riskHi: 'Safe Player',
        emoji: '🛡️',
        color: '#10b981',
        option: results.find((r) => r.id === 'ppf')!,
        reason: 'Tum safe khelna chahte ho — PPF best hai tumhare liye! Tax-free return aur government guarantee.',
      };
    } else if (totalScore <= 7) {
      // Moderate
      return {
        riskProfile: 'Moderate',
        riskHi: 'Balanced Player',
        emoji: '⚖️',
        color: '#eab308',
        option: results.find((r) => r.id === 'gold')!,
        reason: 'Tum risk le sakte ho lekin controlled — Gold ETF ya Sovereign Gold Bond accha choice hai!',
      };
    } else {
      // Aggressive
      return {
        riskProfile: 'Aggressive',
        riskHi: 'Risk Taker',
        emoji: '🚀',
        color: '#f59e0b',
        option: results.find((r) => r.id === 'mutualFund')!,
        reason: 'Tum long term ke liye risk le sakte ho — Equity Mutual Fund SIP se best return milega!',
      };
    }
  }, [quizDone, quizAnswers, results]);

  // Reset quiz
  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizDone(false);
  };

  // Handle quiz answer
  const handleQuizAnswer = (score: number) => {
    const newAnswers = [...quizAnswers, score];
    setQuizAnswers(newAnswers);
    if (quizStep < RISK_QUIZ.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizDone(true);
    }
  };

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const totalInvested = getTotalInvested(principal, monthlyContribution, years);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-x-3 top-[3vh] bottom-[3vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Investment Comparison</h2>
                    <p className="text-[11px] text-[#8888a0] leading-tight">
                      5 options compare karo — best investment dhundho!
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Investment Comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* ── Input Controls ── */}
              <div className="space-y-5">
                {/* Initial Investment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Shuru ka investment</span>
                    <motion.span
                      key={`p-${principal}`}
                      initial={{ scale: 1.1, color: '#10b981' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      ₹{principal.toLocaleString('en-IN')}
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[principal]}
                      min={1000}
                      max={1000000}
                      step={1000}
                      onValueChange={(v) => setPrincipal(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#10b981" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">₹1,000</span>
                    <span className="text-[10px] text-[#8888a0]/60">₹10,00,000</span>
                  </div>
                </div>

                {/* Monthly Contribution */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Mahine ka investment (SIP)</span>
                    <motion.span
                      key={`m-${monthlyContribution}`}
                      initial={{ scale: 1.1, color: '#3b82f6' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      ₹{monthlyContribution.toLocaleString('en-IN')}
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[monthlyContribution]}
                      min={500}
                      max={100000}
                      step={500}
                      onValueChange={(v) => setMonthlyContribution(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#3b82f6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">₹500</span>
                    <span className="text-[10px] text-[#8888a0]/60">₹1,00,000</span>
                  </div>
                </div>

                {/* Investment Period */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Kitne saal invest karoge</span>
                    <motion.span
                      key={`y-${years}`}
                      initial={{ scale: 1.1, color: '#f59e0b' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      {years} saal
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[years]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(v) => setYears(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#f59e0b" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">1 saal</span>
                    <span className="text-[10px] text-[#8888a0]/60">30 saal</span>
                  </div>
                </div>
              </div>

              {/* ── Total Invested Summary ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-[#8888a0]">Total Invested</span>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ₹{formatCurrency(totalInvested, false)}
                  </span>
                </div>
                <p className="text-[10px] text-[#555] mt-1.5">
                  ₹{principal.toLocaleString('en-IN')} shuru + ₹{monthlyContribution.toLocaleString('en-IN')}/mahina × {years * 12} mahine
                </p>
              </motion.div>

              {/* ── Quick Presets ── */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#8888a0] uppercase tracking-wider font-semibold">Quick Presets</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '₹10K + ₹2K/mo · 5yr', p: 10000, m: 2000, y: 5 },
                    { label: '₹50K + ₹5K/mo · 10yr', p: 50000, m: 5000, y: 10 },
                    { label: '₹1L + ₹10K/mo · 15yr', p: 100000, m: 10000, y: 15 },
                    { label: '₹2L + ₹15K/mo · 20yr', p: 200000, m: 15000, y: 20 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setPrincipal(preset.p); setMonthlyContribution(preset.m); setYears(preset.y); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tab Navigation ── */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {[
                  { id: 'chart' as const, label: 'Growth Chart', icon: <TrendingUp className="w-3.5 h-3.5" /> },
                  { id: 'bars' as const, label: 'Final Amounts', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                  { id: 'quiz' as const, label: 'Best Option Quiz', icon: <Sparkles className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${activeTab === tab.id
                        ? 'bg-amber-400/15 text-amber-400 border border-amber-500/20'
                        : 'text-[#8888a0] hover:text-[#e8e8ed] hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Tab Content ── */}
              <AnimatePresence mode="wait">
                {activeTab === 'chart' && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Chart */}
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-white">Growth Over Time</span>
                        <span className="text-[10px] text-[#8888a0]">{years} saal ka safar</span>
                      </div>
                      <GrowthChart results={chartData} years={years} />
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-2">
                      {INVESTMENT_OPTIONS.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                          <span className="text-[10px] text-[#8888a0]">{opt.nameHi} ({opt.rate}%)</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'bars' && (
                  <motion.div
                    key="bars"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Bar Chart */}
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-white">Final Amounts — Rank-wise</span>
                        <span className="text-[10px] text-[#8888a0]">₹{formatCurrency(totalInvested, false)} invested</span>
                      </div>
                      <HorizontalBarChart results={barData} />
                    </div>

                    {/* Investment Cards */}
                    <div className="space-y-3">
                      {rankedResults.map((result, idx) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.25 }}
                          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {/* Rank & Icon */}
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${result.color}15` }}
                              >
                                {result.icon}
                              </div>
                              <span
                                className="text-[9px] font-bold"
                                style={{ color: result.color }}
                              >
                                #{result.rank}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-bold text-white">{result.name}</span>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                                  style={{ backgroundColor: `${result.color}15`, color: result.color }}
                                >
                                  {result.tag}
                                </span>
                                <RiskMeter risk={result.risk} />
                              </div>

                              {/* Description */}
                              <p className="text-[11px] text-[#8888a0] leading-relaxed mb-2.5">
                                {result.description}
                              </p>

                              {/* Stats */}
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <span className="text-[9px] text-[#555] uppercase tracking-wider">Final Value</span>
                                  <div className="text-sm font-bold tabular-nums" style={{ color: result.color }}>
                                    ₹{formatCurrency(result.finalValue, false)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[9px] text-[#555] uppercase tracking-wider">Profit</span>
                                  <div className="text-sm font-bold text-emerald-400 tabular-nums">
                                    +₹{formatCurrency(result.gains, false)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[9px] text-[#555] uppercase tracking-wider">Return %</span>
                                  <div className="text-sm font-bold text-amber-400 tabular-nums">
                                    +{result.gainPct.toFixed(1)}%
                                  </div>
                                </div>
                              </div>

                              {/* Lock-in warning for PPF */}
                              {result.lockIn && years < result.lockIn && (
                                <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-500/15">
                                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="text-[10px] text-amber-300">
                                    PPF mein {result.lockIn} saal ka lock-in hai — {years} saal mein withdraw nahi kar sakte fully
                                  </span>
                                </div>
                              )}

                              {/* High entry cost warning for Real Estate */}
                              {result.entryCost && (
                                <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-400/10 border border-rose-500/15">
                                  <Info className="w-3 h-3 text-rose-400 shrink-0" />
                                  <span className="text-[10px] text-rose-300">
                                    Real Estate mein entry cost bahut zyada hai — practical mein itna compounding nahi milta
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Quiz Header */}
                    <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-400">Tumhare liye best option dhundho!</p>
                          <p className="text-[10px] text-amber-200/70">3 quick questions — risk appetite check karo</p>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Progress */}
                    {!quizDone && (
                      <div className="flex items-center gap-2">
                        {RISK_QUIZ.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              idx < quizStep ? 'bg-amber-400' : idx === quizStep ? 'bg-amber-400/50' : 'bg-white/[0.06]'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-[#8888a0] tabular-nums shrink-0">
                          {quizStep + 1}/{RISK_QUIZ.length}
                        </span>
                      </div>
                    )}

                    {/* Quiz Questions / Result */}
                    <AnimatePresence mode="wait">
                      {!quizDone ? (
                        <motion.div
                          key={`q-${quizStep}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3"
                        >
                          {/* Question */}
                          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                            <h3 className="text-sm font-bold text-white mb-1">
                              {RISK_QUIZ[quizStep].question}
                            </h3>
                            <p className="text-[11px] text-[#8888a0]">
                              {RISK_QUIZ[quizStep].subtitle}
                            </p>
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            {RISK_QUIZ[quizStep].options.map((option, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => handleQuizAnswer(option.score)}
                                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <span className="text-xl shrink-0">{option.emoji}</span>
                                <span className="text-sm text-[#e8e8ed] group-hover:text-white flex-1">{option.text}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#555] group-hover:text-amber-400 transition-colors shrink-0" />
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                          className="space-y-4"
                        >
                          {/* Result Card */}
                          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-center">
                            <div className="text-4xl mb-2">{recommendation!.emoji}</div>
                            <div className="mb-1">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: `${recommendation!.color}20`, color: recommendation!.color }}
                              >
                                {recommendation!.riskProfile}
                              </span>
                            </div>
                            <p className="text-lg font-extrabold text-white mt-2">
                              Tumhare liye best option:
                            </p>
                            <p
                              className="text-2xl font-extrabold mt-1"
                              style={{ color: recommendation!.color }}
                            >
                              {recommendation!.option.name}
                            </p>
                            <p className="text-sm text-[#8888a0] mt-1">
                              {recommendation!.riskHi}
                            </p>
                          </div>

                          {/* Recommendation Detail */}
                          <div
                            className="rounded-xl border p-4"
                            style={{
                              backgroundColor: `${recommendation!.color}08`,
                              borderColor: `${recommendation!.color}20`,
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${recommendation!.color}20` }}
                              >
                                <Trophy className="w-4 h-4" style={{ color: recommendation!.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span
                                  className="text-[10px] font-semibold uppercase tracking-wider"
                                  style={{ color: recommendation!.color }}
                                >
                                  Tumhare liye best option
                                </span>
                                <p className="text-xs text-[#c0c0d0] leading-relaxed mt-1.5">
                                  {recommendation!.reason}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Quick comparison for recommended */}
                          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-[9px] text-[#555] uppercase tracking-wider">Invested</span>
                                <div className="text-sm font-bold text-white tabular-nums">
                                  ₹{formatCurrency(recommendation!.option.totalInvested, false)}
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] text-[#555] uppercase tracking-wider">Final Value</span>
                                <div className="text-sm font-bold tabular-nums" style={{ color: recommendation!.color }}>
                                  ₹{formatCurrency(recommendation!.option.finalValue, false)}
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] text-[#555] uppercase tracking-wider">Profit</span>
                                <div className="text-sm font-bold text-emerald-400 tabular-nums">
                                  +₹{formatCurrency(recommendation!.option.gains, false)}
                                </div>
                              </div>
                              <div>
                                <span className="text-[9px] text-[#555] uppercase tracking-wider">Return</span>
                                <div className="text-sm font-bold text-amber-400 tabular-nums">
                                  +{recommendation!.option.gainPct.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Retake */}
                          <button
                            onClick={resetQuiz}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5 transition-all"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            Phir se quiz karo
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Investment Overview Cards (always visible) ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">5 Investment Options</span>
                  <span className="text-[10px] text-[#8888a0]">Rate & Risk compare karo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INVESTMENT_OPTIONS.map((option) => {
                    const result = results.find((r) => r.id === option.id)!;
                    return (
                      <motion.div
                        key={option.id}
                        className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 hover:bg-white/[0.05] transition-colors group cursor-default"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${option.color}15` }}
                          >
                            {option.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">{option.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-semibold" style={{ color: option.color }}>
                                {option.rate}% CAGR
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Risk meter */}
                        <RiskMeter risk={option.risk} />

                        {/* Final value */}
                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.04]">
                          <span className="text-[9px] text-[#555] uppercase tracking-wider">Final Value</span>
                          <div className="text-sm font-extrabold tabular-nums" style={{ color: option.color }}>
                            ₹{formatIndianNumber(result.finalValue)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ── Pro Tip ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 px-4 py-3"
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-bold text-amber-400">Pro Tip:</span> Sab ek mein mat daalo! Diversification karo — FD + PPF for safety, Mutual Fund for growth, Gold for hedge. Ye hai smart investor ka secret! 🎯
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/50">
              <p className="text-[10px] text-[#555] text-center">
                Ye estimation hai — actual returns vary hosakti hai. PPF 15yr lock-in hai. Mutual Funds market risk ke subject hai.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
