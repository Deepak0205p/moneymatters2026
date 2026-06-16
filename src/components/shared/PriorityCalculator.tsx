'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ListOrdered, Home, Target, PiggyBank, ChevronDown, ChevronUp,
  Check, Lock, Sparkles, IndianRupee, Shield, CreditCard, TrendingUp,
  Umbrella, BookOpen, Landmark, Flame,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/lib/store/useAppStore';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PriorityCalculatorProps {
  open: boolean;
  onClose: () => void;
}

interface PriorityItem {
  id: number;
  title: string;
  titleEn: string;
  emoji: string;
  tip: string;
  minIncome: number;
  icon: React.ReactNode;
}

interface AdvisorTip {
  tip: string;
  priority: 'high' | 'medium' | 'low';
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const PRIORITIES: PriorityItem[] = [
  {
    id: 1,
    title: 'Emergency Fund',
    titleEn: '6 mahine ka kharcha',
    emoji: '🛡️',
    tip: 'Pehle 6 mahine ka kharcha save karo — job chale jaaye toh tension nahi!',
    minIncome: 5000,
    icon: <Umbrella className="w-4 h-4" />,
  },
  {
    id: 2,
    title: 'Health Insurance',
    titleEn: 'Hospital bill se bachao',
    emoji: '🏥',
    tip: 'Health insurance zaroori hai — ek hospital bill puri savings kha sakta hai!',
    minIncome: 8000,
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 3,
    title: 'High-Interest Debt Payoff',
    titleEn: 'Mehnga debt chukao',
    emoji: '💳',
    tip: 'Credit card ka debt sabse mehnga hota hai — pehle ye chukao!',
    minIncome: 10000,
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: 4,
    title: 'SIP/Mutual Fund Start',
    titleEn: 'Investing shuru karo',
    emoji: '📈',
    tip: 'SIP se ₹500 se bhi shuru ho sakta hai — late mat karo, compounding kaam karega!',
    minIncome: 12000,
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 5,
    title: 'Term Insurance',
    titleEn: 'Family ki suraksha',
    emoji: '🧬',
    tip: 'Term insurance sasta aur zaroori hai — family ki financial suraksha ke liye!',
    minIncome: 15000,
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 6,
    title: 'PPF/Tax Saving',
    titleEn: 'Tax bachao, wealth banao',
    emoji: '🏛️',
    tip: 'PPF mein invest karo — tax bachega aur 15 saal mein achha fund ban jayega!',
    minIncome: 25000,
    icon: <Landmark className="w-4 h-4" />,
  },
  {
    id: 7,
    title: 'Skill Development',
    titleEn: 'Income badhao',
    emoji: '📚',
    tip: 'Course karo, skill badhao — income badhegi toh sab aaram se hoga!',
    minIncome: 30000,
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 8,
    title: 'Lifestyle Upgrades',
    titleEn: 'Ab maze karo',
    emoji: '🎉',
    tip: 'Sab ho gaya toh ab thoda lifestyle upgrade karo — par budget mein raho!',
    minIncome: 50000,
    icon: <Flame className="w-4 h-4" />,
  },
];

const INCOME_PRESETS = [
  { label: '₹10K', value: 10000 },
  { label: '₹25K', value: 25000 },
  { label: '₹50K', value: 50000 },
  { label: '₹1L', value: 100000 },
];

function getIncomeBadge(income: number): { label: string; color: string; glow: string } {
  if (income < 15000) return { label: 'Shuruwaat Karnewala 🌱', color: 'text-green-400', glow: 'shadow-green-400/30' };
  if (income < 30000) return { label: 'Badhta Hua Climber 🧗', color: 'text-blue-400', glow: 'shadow-blue-400/30' };
  if (income < 75000) return { label: 'Smart Saver 💡', color: 'text-amber-400', glow: 'shadow-amber-400/30' };
  if (income < 150000) return { label: 'Wealth Builder 🏗️', color: 'text-orange-400', glow: 'shadow-orange-400/30' };
  return { label: 'Finance Star ⭐', color: 'text-yellow-400', glow: 'shadow-yellow-400/30' };
}

const FALLBACK_TIPS: AdvisorTip[] = [
  { tip: 'Pehle emergency fund banao — 6 mahine ka kharcha save karo', priority: 'high' },
  { tip: 'Health insurance zaroori hai — hospital bill maar sakti hai', priority: 'high' },
  { tip: 'SIP se shuru karo — ₹500 se bhi shuru ho sakta hai', priority: 'medium' },
  { tip: 'Credit card ka bill hamesha full pay karo', priority: 'medium' },
];

/* ------------------------------------------------------------------ */
/*  Slider styling                                                     */
/* ------------------------------------------------------------------ */
function SliderStyle() {
  return (
    <style>{`
      .priority-slider [data-slot="slider-range"] {
        background: linear-gradient(90deg, #f59e0bcc, #f59e0b) !important;
        border-radius: 9999px;
      }
      .priority-slider [data-slot="slider-thumb"] {
        border-color: #f59e0b !important;
        background: #0a0a0f !important;
        box-shadow: 0 0 8px #f59e0b44 !important;
        width: 20px !important;
        height: 20px !important;
      }
      .priority-slider [data-slot="slider-thumb"]:hover {
        box-shadow: 0 0 14px #f59e0b66 !important;
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Rupee Counter                                             */
/* ------------------------------------------------------------------ */
function AnimatedRupeeCounter({ value }: { value: number }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.9, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex items-center justify-center gap-1"
    >
      <IndianRupee className="w-7 h-7 text-amber-400" />
      <span className="text-3xl font-extrabold text-white tabular-nums">
        {value.toLocaleString('en-IN')}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Allocation Bar                                                     */
/* ------------------------------------------------------------------ */
function AllocationBar({
  income,
  activeSection,
  setActiveSection,
}: {
  income: number;
  activeSection: string | null;
  setActiveSection: (s: string | null) => void;
}) {
  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const savings = Math.round(income * 0.2);

  const sections = [
    { key: 'needs', label: '🏠 Needs', percent: 50, amount: needs, color: '#f59e0b', detail: 'Rent, food, utilities, EMI' },
    { key: 'wants', label: '🎯 Wants', percent: 30, amount: wants, color: '#a855f7', detail: 'Entertainment, shopping, dining' },
    { key: 'savings', label: '💰 Savings', percent: 20, amount: savings, color: '#22c55e', detail: 'Emergency fund, investments, SIP' },
  ];

  return (
    <div className="space-y-3">
      {/* Stacked Bar */}
      <div className="flex h-12 rounded-xl overflow-hidden border border-white/[0.06] shadow-lg">
        {sections.map((s) => (
          <motion.button
            key={s.key}
            onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}
            className="relative flex items-center justify-center overflow-hidden transition-opacity"
            style={{
              width: `${s.percent}%`,
              backgroundColor: `${s.color}22`,
            }}
            whileHover={{ opacity: 0.9 }}
            initial={{ width: '0%' }}
            animate={{ width: `${s.percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: `${s.color}30` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              origin="left"
            />
            <span className="relative z-10 text-[10px] sm:text-xs font-bold text-white whitespace-nowrap drop-shadow-md">
              {s.label} ₹{s.amount.toLocaleString('en-IN')}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {sections
              .filter((s) => s.key === activeSection)
              .map((s) => (
                <div
                  key={s.key}
                  className="rounded-xl border border-white/[0.06] p-4"
                  style={{ backgroundColor: `${s.color}08` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-sm font-bold text-white">{s.label}</span>
                    <span className="ml-auto text-lg font-extrabold tabular-nums" style={{ color: s.color }}>
                      ₹{s.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-[#8888a0] leading-relaxed">{s.detail}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[11px] text-[#8888a0]">{s.percent}% of income</span>
                    <span className="text-[11px]" style={{ color: s.color }}>
                      • ₹{s.amount.toLocaleString('en-IN')}/mahina
                    </span>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(activeSection === s.key ? null : s.key)}
            className="flex items-center gap-1.5 text-[10px] text-[#8888a0] hover:text-white transition-colors"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            {s.label} ({s.percent}%)
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Priority Ranking Item                                              */
/* ------------------------------------------------------------------ */
function PriorityRankItem({
  item,
  income,
  index,
}: {
  item: PriorityItem;
  income: number;
  index: number;
}) {
  const isAffordable = income >= item.minIncome;
  const progressPct = isAffordable
    ? Math.min(100, Math.round((income / item.minIncome) * 33))
    : Math.round((income / item.minIncome) * 100);

  const priorityColor = index < 3 ? '#ef4444' : index < 5 ? '#f59e0b' : '#22c55e';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group"
    >
      {/* Left color bar */}
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: priorityColor }}
      />

      {/* Rank number */}
      <div className="shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-xs font-bold text-[#8888a0] group-hover:text-amber-400 transition-colors">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">{item.title}</span>
          <span className="text-[10px] text-[#8888a0]">({item.titleEn})</span>
        </div>

        {/* Progress bar */}
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: isAffordable ? '#22c55e' : '#ef4444' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPct, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 }}
            />
          </div>
          {isAffordable ? (
            <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-400" />
            </div>
          ) : (
            <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center">
              <Lock className="w-3 h-3 text-red-400" />
            </div>
          )}
        </div>

        {/* Tip */}
        <p className="mt-1.5 text-[11px] text-[#8888a0] leading-relaxed">{item.emoji} {item.tip}</p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function PriorityCalculator({ open, onClose }: PriorityCalculatorProps) {
  const { priorityCalculatorIncome, setPriorityCalculatorIncome } = useAppStore();
  const [income, setIncome] = useState(priorityCalculatorIncome || 25000);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [prioritiesOpen, setPrioritiesOpen] = useState(true);
  const [advisorTips, setAdvisorTips] = useState<AdvisorTip[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [expandedTips, setExpandedTips] = useState(true);

  // Sync with store
  useEffect(() => {
    if (open && priorityCalculatorIncome > 0) {
      setIncome(priorityCalculatorIncome);
    }
  }, [open, priorityCalculatorIncome]);

  // Save to store on change
  useEffect(() => {
    if (open) {
      setPriorityCalculatorIncome(income);
    }
  }, [income, open, setPriorityCalculatorIncome]);

  // Badge
  const badge = useMemo(() => getIncomeBadge(income), [income]);

  // Allocation
  const needs = useMemo(() => Math.round(income * 0.5), [income]);
  const wants = useMemo(() => Math.round(income * 0.3), [income]);
  const savings = useMemo(() => Math.round(income * 0.2), [income]);

  // Fetch advisor tips
  const fetchAdvisorTips = useCallback(async () => {
    if (!open || income === 0) return;
    setTipsLoading(true);
    try {
      const res = await fetch('/api/priority-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, expenses: needs + wants, savings }),
      });
      const data = await res.json();
      if (data.tips && Array.isArray(data.tips) && data.tips.length > 0) {
        setAdvisorTips(data.tips);
      } else {
        setAdvisorTips(FALLBACK_TIPS);
      }
    } catch {
      setAdvisorTips(FALLBACK_TIPS);
    } finally {
      setTipsLoading(false);
    }
  }, [open, income, needs, wants, savings]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => { fetchAdvisorTips(); }, 600);
    return () => clearTimeout(timer);
  }, [open, fetchAdvisorTips]);

  // Prevent body scroll when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setActiveSection(null);
      setPrioritiesOpen(true);
      setExpandedTips(true);
    }
  }, [open]);

  const priorityColorMap: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e',
  };

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
            className="fixed inset-x-3 top-[4vh] bottom-[4vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                    <ListOrdered className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Priority Calculator</h2>
                    <p className="text-[11px] text-[#8888a0] leading-tight">
                      Paise ka sahi order samjho — 50/30/20 rule!
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Priority Calculator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* ── Income Input Section ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Monthly Income</span>
                </div>

                {/* Animated Counter */}
                <div className="flex items-center justify-center mb-4">
                  <AnimatedRupeeCounter value={income} />
                </div>

                {/* Income Badge */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    key={badge.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-bold ${badge.color} shadow-lg ${badge.glow}`}
                  >
                    {badge.label}
                  </motion.div>
                </div>

                {/* Slider */}
                <div className="priority-slider relative px-1 mb-3">
                  <Slider
                    value={[income]}
                    min={5000}
                    max={500000}
                    step={1000}
                    onValueChange={(v) => setIncome(v[0])}
                    className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2.5 [&_[data-slot=slider-track]]:rounded-full"
                  />
                  <SliderStyle />
                </div>

                {/* Min/Max labels */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-[#8888a0]/60">₹5,000</span>
                  <span className="text-[10px] text-[#8888a0]/60">₹5,00,000</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-center gap-2">
                  {INCOME_PRESETS.map((preset) => (
                    <motion.button
                      key={preset.value}
                      onClick={() => setIncome(preset.value)}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        income === preset.value
                          ? 'bg-amber-400/15 border-amber-500/30 text-amber-400'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {preset.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── Priority Allocation Visualization ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-white">50/30/20 Rule</span>
                  <span className="text-[10px] text-[#8888a0]">— Paise ka sahi batwara</span>
                </div>

                <AllocationBar
                  income={income}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />

                {/* Three stat cards */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="rounded-lg bg-amber-400/5 border border-amber-400/10 p-3 text-center">
                    <Home className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <div className="text-[10px] text-[#8888a0]">Needs</div>
                    <div className="text-sm font-bold text-amber-400 tabular-nums">₹{needs.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-[#8888a0]/60">50%</div>
                  </div>
                  <div className="rounded-lg bg-purple-400/5 border border-purple-400/10 p-3 text-center">
                    <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-[10px] text-[#8888a0]">Wants</div>
                    <div className="text-sm font-bold text-purple-400 tabular-nums">₹{wants.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-[#8888a0]/60">30%</div>
                  </div>
                  <div className="rounded-lg bg-green-400/5 border border-green-400/10 p-3 text-center">
                    <PiggyBank className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-[10px] text-[#8888a0]">Savings</div>
                    <div className="text-sm font-bold text-green-400 tabular-nums">₹{savings.toLocaleString('en-IN')}</div>
                    <div className="text-[9px] text-[#8888a0]/60">20%</div>
                  </div>
                </div>
              </div>

              {/* ── Priority Ranking ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setPrioritiesOpen(!prioritiesOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Financial Priority Order</span>
                    <span className="text-[10px] text-[#8888a0]">(8 priorities)</span>
                  </div>
                  {prioritiesOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8888a0]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8888a0]" />
                  )}
                </button>

                <AnimatePresence>
                  {prioritiesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
                        {PRIORITIES.map((item, idx) => (
                          <PriorityRankItem
                            key={item.id}
                            item={item}
                            income={income}
                            index={idx}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Smart Recommendations (LLM-powered) ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setExpandedTips(!expandedTips)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Smart Recommendations</span>
                    <span className="text-[10px] text-amber-400/60">AI-powered</span>
                  </div>
                  {expandedTips ? (
                    <ChevronUp className="w-4 h-4 text-[#8888a0]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8888a0]" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedTips && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {tipsLoading ? (
                          <div className="flex items-center justify-center gap-3 py-6">
                            <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                            <span className="text-xs text-[#8888a0]">Personalized tips generate ho rahe hain...</span>
                          </div>
                        ) : (
                          advisorTips.map((tip, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.25 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                            >
                              {/* Left color bar */}
                              <div
                                className="w-1 self-stretch rounded-full shrink-0"
                                style={{ backgroundColor: priorityColorMap[tip.priority] || '#8888a0' }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                    style={{
                                      color: priorityColorMap[tip.priority],
                                      backgroundColor: `${priorityColorMap[tip.priority]}15`,
                                    }}
                                  >
                                    {tip.priority}
                                  </span>
                                </div>
                                <p className="text-xs text-[#c0c0d0] leading-relaxed">{tip.tip}</p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Income Level Badge Showcase ── */}
              <div className="rounded-xl bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-amber-500/5 border border-amber-500/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-400">Your Level</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { threshold: 0, label: '🌱 Shuruwaat', color: income < 15000 ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-[#555] bg-white/[0.02] border-white/[0.04]' },
                    { threshold: 15000, label: '🧗 Climber', color: income >= 15000 && income < 30000 ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-[#555] bg-white/[0.02] border-white/[0.04]' },
                    { threshold: 30000, label: '💡 Smart Saver', color: income >= 30000 && income < 75000 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-[#555] bg-white/[0.02] border-white/[0.04]' },
                    { threshold: 75000, label: '🏗️ Wealth Builder', color: income >= 75000 && income < 150000 ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' : 'text-[#555] bg-white/[0.02] border-white/[0.04]' },
                    { threshold: 150000, label: '⭐ Finance Star', color: income >= 150000 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-[#555] bg-white/[0.02] border-white/[0.04]' },
                  ].map((level) => (
                    <span
                      key={level.threshold}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all ${level.color}`}
                    >
                      {level.label}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/50">
              <p className="text-[10px] text-[#555] text-center">
                50/30/20 rule ek guideline hai — apni situation ke hisaab se adjust karo!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
