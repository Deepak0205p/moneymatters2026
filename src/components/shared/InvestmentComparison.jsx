'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Shield, Sparkles, IndianRupee, Building2, 
  Landmark, BarChart3, Coins, Home, Check, GitCompare, 
  Rocket, Lock, X 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const RISK_CONFIG = {
  low: {
    label: 'Low Risk',
    color: 'text-emerald-400',
    dots: 1,
    emoji: '🟢'
  },
  medium: {
    label: 'Medium Risk',
    color: 'text-amber-400',
    dots: 2,
    emoji: '🟡'
  },
  high: {
    label: 'High Risk',
    color: 'text-rose-400',
    dots: 3,
    emoji: '🔴'
  }
};

const OPTIONS = [
  {
    id: 'fd',
    emoji: '🏦',
    name: 'Fixed Deposit',
    nameHi: 'FD',
    rate: 6.5,
    rateText: '6-7.5%',
    risk: 'low',
    color: '#10b981',
    bg: 'bg-emerald-400/10',
    minAmount: 1000,
    lockIn: '7 din - 10 saal',
    tag: 'Students ke liye best',
    tagEmoji: '👨‍🎓',
    description: 'Bank mein safe, lekin return thoda kam. Pehla investment yahin se karo.',
    pros: 'Safe & guaranteed',
    cons: 'Inflation se return kam'
  },
  {
    id: 'sip',
    emoji: '📈',
    name: 'SIP / Mutual Fund',
    nameHi: 'SIP',
    rate: 12,
    rateText: '10-15%',
    risk: 'high',
    color: '#f59e0b',
    bg: 'bg-amber-400/10',
    minAmount: 500,
    lockIn: 'No lock-in (ELSS: 3 saal)',
    tag: 'Long-term growth',
    tagEmoji: '🚀',
    description: '₹500/month se start. Long-term mein sabse zyada return deta hai.',
    pros: 'High return, low start',
    cons: 'Market risk, volatile short-term'
  },
  {
    id: 'realestate',
    emoji: '🏠',
    name: 'Real Estate',
    nameHi: 'Property',
    rate: 8,
    rateText: '6-12%',
    risk: 'medium',
    color: '#8b5cf6',
    bg: 'bg-violet-400/10',
    minAmount: 500000,
    lockIn: 'Long-term (5+ saal)',
    tag: 'High ticket size',
    tagEmoji: '💼',
    description: 'Bada paisa chahiye. Students ke liye abhi mushkil — baad ke liye.',
    pros: 'Tangible asset, rent income',
    cons: 'Bahut paisa chahiye, low liquidity'
  },
  {
    id: 'gold',
    emoji: '🥇',
    name: 'Gold',
    nameHi: 'Sona',
    rate: 8,
    rateText: '7-10%',
    risk: 'medium',
    color: '#eab308',
    bg: 'bg-yellow-400/10',
    minAmount: 100,
    lockIn: 'No lock-in',
    tag: 'Inflation shield',
    tagEmoji: '🛡️',
    description: 'Festival pe gold ETF ya Sovereign Gold Bond lo — jewelry nahi!',
    pros: 'Safe haven, liquid',
    cons: 'No passive interest income'
  },
  {
    id: 'stocks',
    emoji: '💹',
    name: 'Stocks',
    nameHi: 'Shares',
    rate: 14,
    rateText: '8-18%',
    risk: 'high',
    color: '#ec4899',
    bg: 'bg-pink-400/10',
    minAmount: 100,
    lockIn: 'No lock-in',
    tag: 'High risk, high reward',
    tagEmoji: '🎢',
    description: 'Direct company shares. Knowledge chahiye, warna paisa doob sakta hai.',
    pros: 'Highest return potential',
    cons: 'High risk, needs expertise'
  },
  {
    id: 'ppf',
    emoji: '🔐',
    name: 'PPF',
    nameHi: 'PPF',
    rate: 7.1,
    rateText: '7-8%',
    risk: 'low',
    color: '#3b82f6',
    bg: 'bg-blue-400/10',
    minAmount: 500,
    lockIn: '15 saal',
    tag: 'Tax-free return',
    tagEmoji: '🧾',
    description: 'Govt scheme — tax-free interest. Long-term retirement ke liye best.',
    pros: 'Tax-free & 100% safe',
    cons: '15 years lock-in period'
  },
  {
    id: 'nps',
    emoji: '🏛️',
    name: 'NPS',
    nameHi: 'Pension',
    rate: 10,
    rateText: '9-12%',
    risk: 'medium',
    color: '#06b6d4',
    bg: 'bg-cyan-400/10',
    minAmount: 500,
    lockIn: '60 saal age tak',
    tag: 'Retirement planning',
    tagEmoji: '👴',
    description: 'Extra tax bachat ₹50k. Retirement planning ke liye solid.',
    pros: 'Tax saving & pension combo',
    cons: 'Long lock-in, strict withdrawals'
  }
];

const MAX_RATE = 18;

export default function InvestmentComparison({ open, onClose }) {
  const { addCoins } = useAppStore();
  const [selected, setSelected] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const toggleSelection = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id);
      if (prev.length >= 3) {
        toast({
          title: 'Max 3 items select karein! 🎯',
          description: 'Ek baar mein maximum 3 investments hi compare ho sakti hain.'
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedOptions = useMemo(() => {
    return OPTIONS.filter(o => selected.includes(o.id));
  }, [selected]);

  const handleCompare = () => {
    if (selected.length < 2) {
      toast({
        title: 'Choose at least 2! 🔍',
        description: 'Comparison ke liye minimum do schemes select karein.'
      });
      return;
    }
    setComparisonMode(true);
  };

  const aiSuggestion = useMemo(() => {
    if (selected.length === 0) {
      return 'Upar se 2-3 options select karo, fir "Compare" dabao — full breakdown mil jayega! 👇';
    }
    if (selected.includes('sip') && selected.includes('ppf')) {
      return 'SIP + PPF combo best hai — growth + tax saving + safety! 🚀 Tumhari age mein yeh perfect rahega.';
    }
    if (selected.includes('fd')) {
      return 'FD safe hai par inflation haraata. SIP bhi add karo for long-term growth.';
    }
    if (selected.includes('stocks') && selected.length === 1) {
      return 'Stocks alone risky hai. SIP + Stocks ka 70-30 mix better rahega. Knowledge zaroori!';
    }
    if (selected.includes('gold')) {
      return 'Gold 10-15% portfolio mein rakho. Pure gold investment mat banao.';
    }
    return 'Bilkul sahi direction mein ho! "Start Investing" dabao aur Groww/Zerodha pe account kholo.';
  }, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Bada Faisla 🔍</h2>
              <p className="text-[10px] text-zinc-400">Compare assets and pick the best strategy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selected.length > 0 && (
              <button 
                onClick={() => setSelected([])}
                className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all"
              >
                Clear ({selected.length})
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* Instructions banner */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <Sparkles size={14} className="text-purple-400 shrink-0" />
            <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
              Khel shuru karein! Kisi bhi 2 ya 3 schemes ko tap karein aur side-by-side comparison matrix check karein.
            </p>
          </div>

          {/* Grid list of options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {OPTIONS.map((opt, idx) => {
              const isSelected = selected.includes(opt.id);
              const risk = RISK_CONFIG[opt.risk];
              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection(opt.id)}
                  className={`relative p-4 rounded-3xl text-left transition-all border flex flex-col justify-between h-56 cursor-pointer focus:outline-none ${
                    isSelected 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                      : 'bg-[#0B0E19] border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                      <Check size={12} className="text-black" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-3xl bg-white/5 p-2 rounded-2xl block w-fit">{opt.emoji}</span>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider leading-none mt-1">{opt.nameHi}</h3>
                      <span className="text-[9px] text-zinc-500 font-bold block mt-0.5">{opt.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                    {/* Return Scale */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                        <span>Returns</span>
                        <span className={`font-black ${risk.color}`}>{opt.rateText}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(opt.rate / MAX_RATE) * 100}%`,
                            backgroundColor: opt.color 
                          }}
                        />
                      </div>
                    </div>

                    {/* Risk DOTS */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-zinc-500 font-bold">Risk:</span>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < risk.dots 
                              ? opt.risk === 'low' 
                                ? 'bg-emerald-500' 
                                : opt.risk === 'medium' 
                                  ? 'bg-amber-500' 
                                  : 'bg-red-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Mini Details */}
                    <div className="flex flex-col gap-0.5 text-[8.5px] text-zinc-500 font-semibold">
                      <div className="flex items-center gap-1">
                        <IndianRupee size={10} className="text-zinc-500 shrink-0" />
                        <span>Min: ₹{opt.minAmount >= 100000 ? `${opt.minAmount / 100000}L` : opt.minAmount >= 1000 ? `${opt.minAmount / 1000}k` : opt.minAmount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock size={10} className="text-zinc-500 shrink-0" />
                        <span className="truncate">{opt.lockIn}</span>
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded bg-white/5 text-purple-400 text-[8px] font-black uppercase text-center w-full truncate">
                      {opt.tagEmoji} {opt.tag}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Action compare button */}
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selected.length >= 2 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/15' 
                : 'bg-white/5 border border-white/5 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <GitCompare size={14} /> Compare Selected Options {selected.length > 0 && `(${selected.length})`}
          </button>

          {/* AI Suggestion box */}
          <div className="p-4 rounded-3xl bg-purple-500/[0.03] border border-purple-500/20 flex gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-[40px] pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">AI GUIDANCE SUGGESTION</span>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold mt-1">
                {aiSuggestion}
              </p>
            </div>
          </div>

          {/* Call to action investment */}
          <div className="pt-2 border-t border-white/[0.04] space-y-3">
            <button
              onClick={() => {
                addCoins(5);
                toast({
                  title: 'Navigating to Groww/Zerodha... 🚀',
                  description: 'Kamyabi ki aur badhein. +5 Coins added!'
                });
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-all cursor-pointer"
            >
              <Rocket size={14} /> Start Real Investment Account
            </button>
            <p className="text-[9px] text-center text-zinc-500 font-bold uppercase tracking-wider">
              Note: Direct stocks / MF accounts require PAN & Aadhaar details (For 18+ age only)
            </p>
          </div>
        </div>

        {/* Comparison Sheet Overlay (Inner portal portal) */}
        <AnimatePresence>
          {comparisonMode && selectedOptions.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComparisonMode(false)}
              className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-6 flex flex-col justify-center overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md mx-auto p-6 rounded-3xl bg-[#090D1A] border border-white/[0.08] space-y-5 relative overflow-hidden"
              >
                <button
                  onClick={() => setComparisonMode(false)}
                  className="absolute top-4 right-4 p-1 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all focus:outline-none"
                >
                  <X size={16} />
                </button>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">Side-by-Side Matrix</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    Comparing {selectedOptions.length} Schemes Side by Side
                  </p>
                </div>

                {/* Table Header */}
                <div 
                  className="grid gap-2 text-center pb-2 border-b border-white/[0.04]"
                  style={{ gridTemplateColumns: `80px repeat(${selectedOptions.length}, 1fr)` }}
                >
                  <div />
                  {selectedOptions.map(opt => (
                    <div key={opt.id} className="space-y-1">
                      <span className="text-xl block">{opt.emoji}</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-wider block">{opt.nameHi}</span>
                    </div>
                  ))}
                </div>

                {/* Table Rows */}
                {[
                  {
                    label: 'Returns',
                    getVal: o => o.rateText,
                    getColor: o => RISK_CONFIG[o.risk].color
                  },
                  {
                    label: 'Risk level',
                    getVal: o => `${RISK_CONFIG[o.risk].emoji} ${RISK_CONFIG[o.risk].label.split(' ')[0]}`,
                    getColor: () => '#F8FAFC'
                  },
                  {
                    label: 'Min Capital',
                    getVal: o => `₹${o.minAmount >= 100000 ? `${o.minAmount / 100000}L` : o.minAmount >= 1000 ? `${o.minAmount / 1000}k` : o.minAmount}`,
                    getColor: () => '#a1a1aa'
                  },
                  {
                    label: 'Lock-in',
                    getVal: o => o.lockIn,
                    getColor: () => '#a1a1aa'
                  },
                  {
                    label: 'Target Group',
                    getVal: o => o.tag,
                    getColor: () => '#8B5CF6'
                  },
                  {
                    label: 'Pros Benefit',
                    getVal: o => o.pros,
                    getColor: () => '#10B981'
                  },
                  {
                    label: 'Cons Limitation',
                    getVal: o => o.cons,
                    getColor: () => '#EF4444'
                  }
                ].map(row => (
                  <div 
                    key={row.label}
                    className="grid gap-2 py-2 border-b border-white/[0.03] items-center text-left"
                    style={{ gridTemplateColumns: `80px repeat(${selectedOptions.length}, 1fr)` }}
                  >
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">{row.label}</span>
                    {selectedOptions.map(opt => (
                      <span 
                        key={opt.id} 
                        className="text-[10px] text-center font-bold"
                        style={{ color: row.getColor(opt) }}
                      >
                        {row.getVal(opt)}
                      </span>
                    ))}
                  </div>
                ))}

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">STUDENT RECOMMENDATION</span>
                  <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed">
                    If you are starting out, prefer <strong className="text-white">SIP/Mutual Funds</strong>. It enables investing with small amounts without heavy locking periods.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Bada Faisla — rates are approximate based on past decade performance averages
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { InvestmentComparison };