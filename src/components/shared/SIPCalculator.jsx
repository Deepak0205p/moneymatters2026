'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, TrendingUp, Sparkles, IndianRupee, Mountain, 
  Flag, Smartphone, Bike, Plane, ArrowRight, ShieldAlert, Award 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { calculateSIP, formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const PRESETS = [1000, 2000, 5000, 10000];

const MILESTONES = [
  { value: 100000, label: '₹1 Lakh', emoji: '🎯' },
  { value: 500000, label: '₹5 Lakh', emoji: '🏆' },
  { value: 1000000, label: '₹10 Lakh', emoji: '👑' },
  { value: 10000000, label: '₹1 Crore', emoji: '🤯' }
];

const COMPARISONS = {
  iphone: 80000,
  enfield: 200000,
  goa: 25000
};

export default function SIPCalculator({ open, onClose }) {
  const { addCoins } = useAppStore();
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const totalInvested = useMemo(() => monthly * years * 12, [monthly, years]);
  const totalValue = useMemo(() => calculateSIP(monthly, rate, years), [monthly, rate, years]);
  const totalReturns = useMemo(() => Math.max(0, totalValue - totalInvested), [totalValue, totalInvested]);

  const investedPct = useMemo(() => totalValue > 0 ? (totalInvested / totalValue) * 100 : 100, [totalInvested, totalValue]);
  const returnsPct = useMemo(() => 100 - investedPct, [investedPct]);

  // Mountain Height scale relative to ₹1Cr
  const mountainScale = useMemo(() => Math.min(100, (totalValue / 10000000) * 100), [totalValue]);

  // Next Milestone calculation
  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m.value > totalValue) || MILESTONES[MILESTONES.length - 1];
  }, [totalValue]);

  const prevMilestone = useMemo(() => {
    return [...MILESTONES].reverse().find(m => m.value <= totalValue) || null;
  }, [totalValue]);

  const progressToNext = useMemo(() => {
    if (!prevMilestone) {
      return Math.min(100, (totalValue / nextMilestone.value) * 100);
    }
    const range = nextMilestone.value - prevMilestone.value;
    const progress = totalValue - prevMilestone.value;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }, [totalValue, prevMilestone, nextMilestone]);

  // Real-world comparisons
  const iphones = useMemo(() => Math.floor(totalValue / COMPARISONS.iphone), [totalValue]);
  const enfields = useMemo(() => Math.floor(totalValue / COMPARISONS.enfield), [totalValue]);
  const goaTrips = useMemo(() => Math.floor(totalValue / COMPARISONS.goa), [totalValue]);

  // Fixed Deposit comparison
  const fdValue = useMemo(() => {
    // 6.5% interest compounding annually for FD equivalent
    let principal = 0;
    const r = 0.065;
    for (let i = 0; i < years * 12; i++) {
      principal += monthly;
      if (i % 12 === 11) {
        principal = principal * (1 + r);
      }
    }
    return principal;
  }, [monthly, years]);

  const fdReturns = useMemo(() => Math.max(0, fdValue - totalInvested), [fdValue, totalInvested]);

  const handleClaimBonus = () => {
    addCoins(10);
    toast({
      title: "SIP Calculator explored! +10 Coins 💰",
      description: "Compounding power ko samajhne ke liye badhai!"
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-4xl bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Mountain size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Compounding Khazana 💰</h2>
              <p className="text-[10px] text-zinc-400">Wealth Mountain & SIP Growth Calculator</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* Main Visualization & Metric summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SVG Mountain Visual Representation (Col 7) */}
            <div className="lg:col-span-7 bg-[#05070F] border border-white/[0.03] rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-3 left-3 flex gap-2 z-15">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  🟢 Invested: {Math.round(investedPct)}%
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  🟡 Returns: {Math.round(returnsPct)}%
                </span>
              </div>

              {/* Live Mountain SVG Rendering */}
              <div className="w-full h-44 relative mt-4">
                <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                  {/* Background stars */}
                  <g opacity="0.3">
                    <circle cx="40" cy="30" r="1" fill="#fff" />
                    <circle cx="120" cy="50" r="0.8" fill="#fff" />
                    <circle cx="280" cy="20" r="1.2" fill="#fff" />
                    <circle cx="340" cy="45" r="1" fill="#fff" />
                  </g>
                  {/* Base mountain (Invested Base) */}
                  <path 
                    d={`M 0 160 Q 100 ${160 - mountainScale * 0.4} 200 ${160 - mountainScale * 0.7} Q 300 ${160 - mountainScale * 0.4} 400 160 Z`} 
                    fill="rgba(16, 185, 129, 0.25)" 
                    stroke="#10B981" 
                    strokeWidth="1.5" 
                  />
                  {/* Growth Peak mountain (Returns) */}
                  <path 
                    d={`M 0 160 Q 100 ${160 - mountainScale * 0.75} 200 ${160 - mountainScale} Q 300 ${160 - mountainScale * 0.75} 400 160 Z`} 
                    fill="rgba(245, 158, 11, 0.25)" 
                    stroke="#F59E0B" 
                    strokeWidth="1.5" 
                  />
                  {/* Flag on peak */}
                  <g transform={`translate(195, ${160 - mountainScale - 18})`}>
                    <line x1="5" y1="0" x2="5" y2="18" stroke="#ffffff" strokeWidth="1.5" />
                    <polygon points="5,0 20,4 5,8" fill="#EF4444" />
                  </g>
                </svg>
              </div>

              <div className="flex justify-between items-end border-t border-white/[0.04] pt-4 mt-2">
                <div>
                  <span className="text-[10px] text-zinc-400">Wealth Goal Value</span>
                  <p className="text-xl font-black text-amber-400 leading-tight">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400">Total Invested</span>
                  <p className="text-sm font-bold text-emerald-400 leading-tight">
                    {formatCurrency(totalInvested)}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Circular Split (Col 5) */}
            <div className="lg:col-span-5 bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">SIP Split Overview</h4>
                <div className="flex items-center gap-4 py-4">
                  {/* Circular Pie Chart */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                      <circle 
                        cx="18" cy="18" r="15.91" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="4" 
                        strokeDasharray={`${investedPct} ${100 - investedPct}`} 
                      />
                      <circle 
                        cx="18" cy="18" r="15.91" 
                        fill="none" 
                        stroke="#F59E0B" 
                        strokeWidth="4" 
                        strokeDasharray={`${returnsPct} ${100 - returnsPct}`} 
                        strokeDashoffset={`-${investedPct}`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-[8px] text-zinc-400 uppercase">Growth</span>
                      <span className="text-xs font-black text-white">{Math.round(returnsPct)}%</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Invested Base
                      </span>
                      <span className="font-extrabold text-white">{formatCurrency(totalInvested)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Returns Earned
                      </span>
                      <span className="font-extrabold text-amber-400">{formatCurrency(totalReturns)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Indicator */}
              <div className="border-t border-white/[0.04] pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Flag size={12} className="text-amber-400" /> Next Target: {nextMilestone.label}
                  </span>
                  <span className="font-black text-white">{Math.round(progressToNext)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sliders Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Monthly SIP Input */}
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">Monthly Contribution</span>
                <span className="text-xs font-black text-emerald-400 flex items-center">
                  <IndianRupee size={10} /> {monthly.toLocaleString('en-IN')}
                </span>
              </div>
              <input 
                type="range"
                min={500}
                max={50000}
                step={500}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex gap-1.5 pt-1.5">
                {PRESETS.map(preset => (
                  <button 
                    key={preset}
                    onClick={() => setMonthly(preset)}
                    className={`flex-1 py-1 rounded-lg text-[9px] font-black tracking-wider transition-all border ${
                      monthly === preset 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-white/5 border-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    ₹{preset/1000}K
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">Investment Duration</span>
                <span className="text-xs font-black text-amber-400">{years} Years</span>
              </div>
              <input 
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Expected Returns Rate */}
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">Expected Annual Returns</span>
                <span className="text-xs font-black text-violet-400">{rate}%</span>
              </div>
              <input 
                type="range"
                min={5}
                max={20}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-violet-400"
              />
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>8% (Safe FD)</span>
                <span>12% (Average MF)</span>
                <span>15% (Aggressive stocks)</span>
              </div>
            </div>
          </div>

          {/* Relatable Metrics comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* FD Comparison Box */}
            <div className="bg-red-500/5 border border-red-500/15 rounded-3xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="text-red-400" size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-red-300 uppercase tracking-wide">FD (Fixed Deposit) Comparison</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Agar aap isi amount ko regular FD mein rakhte (@6.5%), toh total return value sirf <strong className="text-zinc-200">{formatCurrency(fdValue)}</strong> hota. 
                  SIP se aapko <strong className="text-amber-400">{formatCurrency(totalReturns - fdReturns)}</strong> extra returns mil rahe hain due to Compounding Power!
                </p>
              </div>
            </div>

            {/* Equivalent Lifestyle Assets */}
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={13} className="text-violet-400 animate-spin" /> Wealth Comparison
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-2.5 text-center">
                  <Smartphone className="mx-auto text-blue-400 mb-1" size={18} />
                  <span className="text-sm font-black text-white">{iphones}</span>
                  <p className="text-[9px] text-zinc-500 mt-0.5">iPhones 📱</p>
                </div>
                <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-2.5 text-center">
                  <Bike className="mx-auto text-emerald-400 mb-1" size={18} />
                  <span className="text-sm font-black text-white">{enfields}</span>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Enfield Bikes 🏍️</p>
                </div>
                <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-2.5 text-center">
                  <Plane className="mx-auto text-amber-400 mb-1" size={18} />
                  <span className="text-sm font-black text-white">{goaTrips}</span>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Goa Trips ✈️</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-5 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/[0.05]"
          >
            Close
          </button>
          <button 
            onClick={handleClaimBonus} 
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 text-[#070913] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <Award size={14} /> Start SIP & Claim +10 Coins
          </button>
        </div>
      </motion.div>
    </div>
  );
}