'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calculator, TrendingUp, ChevronDown, ChevronUp, Sparkles, Info, IndianRupee,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { calculateSIP, formatCurrency, formatIndianNumber, yearsToDouble } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface SIPCalculatorProps {
  open: boolean;
  onClose: () => void;
}

interface YearBreakdown {
  year: number;
  invested: number;
  returns: number;
  totalValue: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function computeBreakdown(monthly: number, rate: number, years: number): YearBreakdown[] {
  const rows: YearBreakdown[] = [];
  const r = rate / 12 / 100;
  for (let y = 1; y <= years; y++) {
    const n = y * 12;
    const totalValue = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    rows.push({ year: y, invested, returns: totalValue - invested, totalValue });
  }
  return rows;
}

/* Simple SVG donut chart */
function DonutChart({ invested, returns, size = 160 }: { invested: number; returns: number; size?: number }) {
  const total = invested + returns;
  if (total === 0) return null;

  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const investedPct = invested / total;
  const returnsPct = returns / total;

  const investedLen = circumference * investedPct;
  const returnsLen = circumference * returnsPct;

  // Start from top (rotate -90deg)
  const investedOffset = 0;
  const returnsOffset = -investedLen;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={strokeWidth}
      />
      {/* Invested arc (amber/gold) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={strokeWidth}
        strokeDasharray={`${investedLen} ${circumference - investedLen}`}
        strokeDashoffset={investedOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
      />
      {/* Returns arc (emerald/green) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#22c55e"
        strokeWidth={strokeWidth}
        strokeDasharray={`${returnsLen} ${circumference - returnsLen}`}
        strokeDashoffset={returnsOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
      />
      {/* Center text */}
      <text x={size / 2} y={size / 2 - 8} textAnchor="middle" fill="#e8e8ed" fontSize="11" fontWeight="600">
        Total Value
      </text>
      <text x={size / 2} y={size / 2 + 10} textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="700">
        {formatIndianNumber(total)}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Slider styling (same pattern as SliderControl)                     */
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
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function SIPCalculator({ open, onClose }: SIPCalculatorProps) {
  // Input state
  const [monthly, setMonthly] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  // LLM tip state
  const [aiTip, setAiTip] = useState<string>('');
  const [tipLoading, setTipLoading] = useState(false);

  // Calculations (client-side, real-time)
  const totalValue = useMemo(() => calculateSIP(monthly, returnRate, years), [monthly, returnRate, years]);
  const totalInvested = useMemo(() => monthly * years * 12, [monthly, years]);
  const estimatedReturns = useMemo(() => totalValue - totalInvested, [totalValue, totalInvested]);
  const breakdown = useMemo(() => computeBreakdown(monthly, returnRate, years), [monthly, returnRate, years]);
  const doublingTime = useMemo(() => yearsToDouble(returnRate), [returnRate]);

  // Fetch personalized tip from backend
  const fetchTip = useCallback(async () => {
    if (!open) return;
    setTipLoading(true);
    setAiTip('');
    try {
      const res = await fetch('/api/sip-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyInvestment: monthly, returnRate, years, totalValue, totalInvested, estimatedReturns }),
      });
      const data = await res.json();
      if (data.tip) setAiTip(data.tip);
    } catch {
      setAiTip('');
    } finally {
      setTipLoading(false);
    }
  }, [open, monthly, returnRate, years, totalValue, totalInvested, estimatedReturns]);

  // Debounced tip fetch
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => { fetchTip(); }, 800);
    return () => clearTimeout(timer);
  }, [open, fetchTip]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setBreakdownOpen(false);
    }
  }, [open]);

  // Prevent body scroll when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const returnsPct = totalValue > 0 ? ((estimatedReturns / totalValue) * 100).toFixed(1) : '0';

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
                    <Calculator className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">SIP Calculator</h2>
                    <p className="text-[11px] text-[#8888a0] leading-tight">
                      Har mahine thoda invest karo, dikhao kitna banega!
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close SIP Calculator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* ── Sliders Section ── */}
              <div className="space-y-5">
                {/* Monthly Investment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Mahine ka investment</span>
                    <motion.span
                      key={`m-${monthly}`}
                      initial={{ scale: 1.1, color: '#f59e0b' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      ₹{monthly.toLocaleString('en-IN')}
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[monthly]}
                      min={500}
                      max={100000}
                      step={500}
                      onValueChange={(v) => setMonthly(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#f59e0b" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">₹500</span>
                    <span className="text-[10px] text-[#8888a0]/60">₹1,00,000</span>
                  </div>
                </div>

                {/* Return Rate */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Saalana return rate</span>
                    <motion.span
                      key={`r-${returnRate}`}
                      initial={{ scale: 1.1, color: '#22c55e' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      {returnRate}%
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[returnRate]}
                      min={1}
                      max={30}
                      step={0.5}
                      onValueChange={(v) => setReturnRate(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#22c55e" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">1%</span>
                    <span className="text-[10px] text-[#8888a0]/60">30%</span>
                  </div>
                </div>

                {/* Investment Period */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8888a0]">Kitne saal invest karoge</span>
                    <motion.span
                      key={`y-${years}`}
                      initial={{ scale: 1.1, color: '#a855f7' }}
                      animate={{ scale: 1, color: '#e8e8ed' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold tabular-nums"
                    >
                      {years} {years === 1 ? 'saal' : 'saal'}
                    </motion.span>
                  </div>
                  <div className="relative px-1">
                    <Slider
                      value={[years]}
                      min={1}
                      max={40}
                      step={1}
                      onValueChange={(v) => setYears(v[0])}
                      className="[&_[data-slot=slider-track]]:bg-[#1a1a2e] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full"
                    />
                    <SliderStyle color="#a855f7" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8888a0]/60">1 saal</span>
                    <span className="text-[10px] text-[#8888a0]/60">40 saal</span>
                  </div>
                </div>
              </div>

              {/* ── Results Summary ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Donut Chart */}
                  <div className="shrink-0">
                    <DonutChart invested={totalInvested} returns={estimatedReturns} size={150} />
                  </div>

                  {/* Stats */}
                  <div className="flex-1 w-full space-y-3">
                    {/* Total Investment */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-xs text-[#8888a0]">Total Investment</span>
                      </div>
                      <motion.span
                        key={`inv-${totalInvested}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold text-amber-400 tabular-nums"
                      >
                        ₹{formatCurrency(totalInvested, false)}
                      </motion.span>
                    </div>

                    {/* Estimated Returns */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                        <span className="text-xs text-[#8888a0]">Estimated Returns</span>
                      </div>
                      <motion.span
                        key={`ret-${estimatedReturns}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold text-green-400 tabular-nums"
                      >
                        ₹{formatCurrency(estimatedReturns, false)}
                      </motion.span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/[0.06]" />

                    {/* Total Value */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#8888a0] font-semibold">Total Value</span>
                      <motion.span
                        key={`tot-${totalValue}`}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        className="text-base font-extrabold text-white tabular-nums"
                      >
                        ₹{formatCurrency(totalValue, false)}
                      </motion.span>
                    </div>

                    {/* Returns % badge */}
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-[11px] text-green-400 font-medium">
                        Returns {returnsPct}% of total value
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Motivational Quick Fact ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 px-4 py-3"
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    ₹500/mahina bhi {years === 1 ? '1 saal' : `${years} saal`} mein <span className="font-bold text-amber-400">₹{formatCurrency(totalValue, false)}</span> bana sakta hai at {returnRate}% return! Compounding ki power hai ye!
                  </p>
                </div>
              </motion.div>

              {/* ── AI Personalized Tip ── */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">AI Tip</span>
                    {tipLoading ? (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                        <span className="text-[11px] text-[#8888a0]">Generating tip...</span>
                      </div>
                    ) : aiTip ? (
                      <p className="mt-1 text-xs text-[#c0c0d0] leading-relaxed">{aiTip}</p>
                    ) : (
                      <p className="mt-1 text-xs text-[#555]">Adjust sliders to get a personalized tip</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Rule of 72 ── */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">Rule of 72</span>
                </div>
                <p className="text-xs text-[#8888a0] leading-relaxed mb-3">
                  72 ka rule batata hai ki paisa kitne saal mein double hoga. Simply 72 ko return rate se divide karo!
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="rounded-lg bg-amber-400/10 border border-amber-500/15 px-3 py-2 text-center">
                    <div className="text-[10px] text-[#8888a0]">72 ÷ {returnRate}%</div>
                    <div className="text-lg font-extrabold text-amber-400">
                      {doublingTime.toFixed(1)} saal
                    </div>
                  </div>
                  <div className="text-[11px] text-[#8888a0] leading-relaxed">
                    {returnRate}% return pe aapka paisa <span className="text-amber-400 font-semibold">{doublingTime.toFixed(1)} saal</span> mein double ho jayega!
                  </div>
                </div>
              </div>

              {/* ── Year-by-Year Breakdown ── */}
              <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.05] transition-colors">
                    <span className="text-sm font-semibold text-white">Year-by-Year Breakdown</span>
                    {breakdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8888a0]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8888a0]" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 rounded-xl border border-white/[0.06] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                      <span className="text-[10px] font-semibold text-[#8888a0] uppercase tracking-wider">Saal</span>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider text-right">Invested</span>
                      <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider text-right">Returns</span>
                      <span className="text-[10px] font-semibold text-white uppercase tracking-wider text-right">Total</span>
                    </div>
                    {/* Table Rows */}
                    <div className="max-h-64 overflow-y-auto">
                      {breakdown.map((row, idx) => (
                        <motion.div
                          key={row.year}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.2 }}
                          className="grid grid-cols-4 gap-2 px-4 py-2 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                        >
                          <span className="text-xs text-[#8888a0] font-medium">{row.year}</span>
                          <span className="text-xs text-amber-400/80 tabular-nums text-right">
                            ₹{formatCurrency(row.invested, false)}
                          </span>
                          <span className="text-xs text-green-400/80 tabular-nums text-right">
                            ₹{formatCurrency(row.returns, false)}
                          </span>
                          <span className="text-xs text-white font-medium tabular-nums text-right">
                            ₹{formatCurrency(row.totalValue, false)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ── Quick presets ── */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#8888a0] uppercase tracking-wider font-semibold">Quick Presets</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '₹2K/mo · 10yr', m: 2000, r: 12, y: 10 },
                    { label: '₹5K/mo · 15yr', m: 5000, r: 12, y: 15 },
                    { label: '₹10K/mo · 20yr', m: 10000, r: 12, y: 20 },
                    { label: '₹5K/mo · 30yr', m: 5000, r: 10, y: 30 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setMonthly(preset.m); setReturnRate(preset.r); setYears(preset.y); }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/50">
              <p className="text-[10px] text-[#555] text-center">
                Mutual fund investments are subject to market risks. Ye calculator sirf estimation hai.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
