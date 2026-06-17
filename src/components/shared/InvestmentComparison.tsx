'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  Sparkles,
  IndianRupee,
  Building2,
  Landmark,
  BarChart3,
  Coins,
  Home,
  Check,
  GitCompare,
  Rocket,
  Lock,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Investment Comparison — premium visual cards
   ============================================================ */

interface InvestmentComparisonProps {
  open: boolean;
  onClose: () => void;
}

type RiskLevel = 'low' | 'medium' | 'high';

interface InvestmentOption {
  id: string;
  emoji: string;
  name: string;
  nameHi: string;
  rate: number;
  rateText: string;
  risk: RiskLevel;
  color: string;
  bg: string;
  icon: React.ReactNode;
  minAmount: number;
  lockIn: string;
  tag: string;
  tagEmoji: string;
  description: string;
  pros: string;
  cons: string;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; dots: number; emoji: string }> = {
  low:    { label: 'Low Risk',    color: 'text-emerald-400', dots: 1, emoji: '🟢' },
  medium: { label: 'Medium Risk', color: 'text-amber-400',   dots: 2, emoji: '🟡' },
  high:   { label: 'High Risk',   color: 'text-rose-400',    dots: 3, emoji: '🔴' },
};

const OPTIONS: InvestmentOption[] = [
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
    icon: <Landmark className="w-5 h-5" />,
    minAmount: 1000,
    lockIn: '7 din - 10 saal',
    tag: 'Students ke liye best',
    tagEmoji: '👨‍🎓',
    description: 'Bank mein safe, lekin return thoda kam. Pehla investment yahin se karo.',
    pros: 'Safe + guaranteed',
    cons: 'Inflation se return kam',
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
    icon: <BarChart3 className="w-5 h-5" />,
    minAmount: 500,
    lockIn: 'No lock-in (ELSS: 3 saal)',
    tag: 'Long-term growth',
    tagEmoji: '🚀',
    description: '₹500/month se start. Long-term mein sabse zyada return deta hai.',
    pros: 'High return, low start',
    cons: 'Market risk, short-term volatile',
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
    icon: <Home className="w-5 h-5" />,
    minAmount: 500000,
    lockIn: 'Long-term (5+ saal)',
    tag: 'High ticket size',
    tagEmoji: '💼',
    description: 'Bada paisa chahiye. Students ke liye abhi mushkil — baad ke liye.',
    pros: 'Tangible asset, rent income',
    cons: 'Bahut paisa chahiye, liquid nahi',
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
    icon: <Coins className="w-5 h-5" />,
    minAmount: 100,
    lockIn: 'No lock-in',
    tag: 'Inflation shield',
    tagEmoji: '🛡️',
    description: 'Festival pe gold ETF ya Sovereign Gold Bond lo — jewelry nahi!',
    pros: 'Safe haven, liquid',
    cons: 'No passive income',
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
    icon: <TrendingUp className="w-5 h-5" />,
    minAmount: 100,
    lockIn: 'No lock-in',
    tag: 'High risk, high reward',
    tagEmoji: '🎢',
    description: 'Direct company shares. Knowledge chahiye, warna paisa doob sakta hai.',
    pros: 'Highest potential return',
    cons: 'High risk, time + knowledge chahiye',
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
    icon: <Shield className="w-5 h-5" />,
    minAmount: 500,
    lockIn: '15 saal',
    tag: 'Tax-free return',
    tagEmoji: '🧾',
    description: 'Govt scheme — tax-free interest. Long-term retirement ke liye best.',
    pros: 'Tax-free, safe',
    cons: '15 saal lock-in',
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
    icon: <Building2 className="w-5 h-5" />,
    minAmount: 500,
    lockIn: '60 saal age tak',
    tag: 'Retirement ke liye',
    tagEmoji: '👴',
    description: 'Extra tax bachat ₹50k. Retirement planning ke liye solid.',
    pros: 'Tax + retirement combo',
    cons: 'Long lock-in, withdrawal strict',
  },
];

const MAX_RATE = 18; // for bar scaling

export default function InvestmentComparison({ open, onClose }: InvestmentComparisonProps) {
  const { addCoins } = useAppStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) {
        toast({ title: 'Max 3 select kar sakte ho 🎯' });
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedOptions = useMemo(
    () => OPTIONS.filter((o) => selected.includes(o.id)),
    [selected],
  );

  const handleCompare = () => {
    if (selected.length < 2) {
      toast({ title: 'Kam se kam 2 select karo 🔍' });
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Investment Comparison</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold heading-gradient">Kahan Lagayein Paisa?</h2>
                <p className="text-xs text-[#94A3B8]">Compare karo, phir invest karo 💸</p>
              </div>
            </div>
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Clear ({selected.length})
              </button>
            )}
          </div>

          {/* Instruction */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl glass-card">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-xs text-[#94A3B8]">2-3 options tap karke compare karo (max 3)</p>
          </div>
        </div>

        {/* Investment cards grid */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((opt, idx) => {
              const isSelected = selected.includes(opt.id);
              const risk = RISK_CONFIG[opt.risk];
              return (
                <motion.button
                  key={opt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSelection(opt.id)}
                  className={cn(
                    'relative p-3 rounded-2xl text-left transition-all border card-3d',
                    isSelected
                      ? 'glass-card-premium border-emerald-400/40'
                      : 'glass-card border-white/[0.06] hover:border-white/[0.12]',
                  )}
                >
                  {/* Selection check */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 grid place-items-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Emoji + Name */}
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <h3 className="font-display text-sm font-bold text-[#F8FAFC] leading-tight">{opt.nameHi}</h3>
                  <p className="text-[10px] text-[#94A3B8] mb-2">{opt.name}</p>

                  {/* Returns bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#94A3B8]">Returns</span>
                      <span className={cn('font-bold', risk.color)}>{opt.rateText}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: opt.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(opt.rate / MAX_RATE) * 100}%` }}
                        transition={{ delay: 0.2 + idx * 0.05, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Risk dots */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[10px] text-[#94A3B8]">Risk:</span>
                    {[1, 2, 3].map((dot) => (
                      <span
                        key={dot}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          dot <= risk.dots ? (opt.risk === 'low' ? 'bg-emerald-400' : opt.risk === 'medium' ? 'bg-amber-400' : 'bg-rose-400') : 'bg-white/[0.10]',
                        )}
                      />
                    ))}
                  </div>

                  {/* Quick info */}
                  <div className="space-y-0.5 text-[10px] text-[#94A3B8]">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-2.5 h-2.5" /> {opt.minAmount >= 100000 ? `${opt.minAmount / 100000}L` : opt.minAmount >= 1000 ? `${opt.minAmount / 1000}k` : opt.minAmount} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> {opt.lockIn}
                    </div>
                  </div>

                  {/* Best for tag */}
                  <div className="mt-2 px-1.5 py-1 rounded-md bg-white/[0.04] text-[10px] text-violet-300 font-semibold text-center">
                    {opt.tagEmoji} {opt.tag}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Compare button */}
        <div className="px-5 pb-4">
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition',
              selected.length >= 2
                ? 'btn-3d bg-emerald-500 hover:bg-emerald-400 text-white'
                : 'glass-card text-[#94A3B8] cursor-not-allowed',
            )}
          >
            <GitCompare className="w-4 h-4" />
            Compare Now {selected.length > 0 && `(${selected.length})`}
          </button>
        </div>

        {/* AI suggestion */}
        <div className="px-5 pb-4">
          <div className="p-4 rounded-2xl glass-card-premium border border-violet-500/30 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 grid place-items-center shrink-0">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-violet-300 mb-0.5">AI Suggestion 🤖</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{aiSuggestion}</p>
            </div>
          </div>
        </div>

        {/* Start Investing CTA */}
        <div className="px-5 pb-6">
          <button
            onClick={() => {
              addCoins(5);
              toast({ title: 'External link khulta hai! +5 coins 🎉' });
            }}
            className="w-full py-3 rounded-xl btn-3d bg-gradient-to-r from-emerald-500 to-amber-500 text-white text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Rocket className="w-4 h-4" /> Start Investing
          </button>
          <p className="text-[10px] text-center text-[#94A3B8] mt-2">
            Groww / Zerodha pe account kholo (18+)
          </p>
        </div>

        {/* Comparison Modal */}
        <AnimatePresence>
          {comparisonMode && selectedOptions.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComparisonMode(false)}
              className="absolute inset-0 z-30 grid place-items-center bg-[#0B1220]/95 backdrop-blur-md p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.92, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full my-auto p-5 rounded-3xl glass-card-premium relative"
              >
                <button
                  onClick={() => setComparisonMode(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-display text-xl font-bold heading-gradient mb-1">Side-by-Side Comparison</h3>
                <p className="text-xs text-[#94A3B8] mb-4">{selectedOptions.length} options compare ho rahe hain</p>

                {/* Header row */}
                <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `120px repeat(${selectedOptions.length}, 1fr)` }}>
                  <div></div>
                  {selectedOptions.map((opt) => (
                    <div key={opt.id} className="text-center">
                      <div className="text-2xl mb-0.5">{opt.emoji}</div>
                      <p className="text-xs font-bold text-[#F8FAFC]">{opt.nameHi}</p>
                    </div>
                  ))}
                </div>

                {/* Comparison rows */}
                {[
                  { label: 'Returns', getVal: (o: InvestmentOption) => o.rateText, getColor: (o: InvestmentOption) => RISK_CONFIG[o.risk].color },
                  { label: 'Risk',     getVal: (o: InvestmentOption) => `${RISK_CONFIG[o.risk].emoji} ${RISK_CONFIG[o.risk].label.split(' ')[0]}`, getColor: () => '#F8FAFC' },
                  { label: 'Min Amt',  getVal: (o: InvestmentOption) => `₹${o.minAmount >= 100000 ? `${o.minAmount / 100000}L` : o.minAmount >= 1000 ? `${o.minAmount / 1000}k` : o.minAmount}`, getColor: () => '#94A3B8' },
                  { label: 'Lock-in',  getVal: (o: InvestmentOption) => o.lockIn, getColor: () => '#94A3B8' },
                  { label: 'Best For', getVal: (o: InvestmentOption) => `${o.tagEmoji} ${o.tag}`, getColor: () => '#8B5CF6' },
                  { label: 'Pros',     getVal: (o: InvestmentOption) => o.pros, getColor: () => '#10B981' },
                  { label: 'Cons',     getVal: (o: InvestmentOption) => o.cons, getColor: () => '#EF4444' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 py-2 border-t border-white/[0.06] items-center"
                    style={{ gridTemplateColumns: `120px repeat(${selectedOptions.length}, 1fr)` }}
                  >
                    <div className="text-[10px] text-[#94A3B8] font-semibold">{row.label}</div>
                    {selectedOptions.map((opt) => (
                      <div key={opt.id} className="text-[10px] text-center" style={{ color: row.getColor(opt) }}>
                        {row.getVal(opt)}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Best pick */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                  <p className="text-xs text-emerald-300 font-bold mb-0.5">🏆 Best Pick for Students</p>
                  <p className="text-xs text-[#94A3B8]">
                    {selectedOptions.find(o => o.id === 'sip') ? 'SIP/Mutual Fund' : selectedOptions[0].nameHi} — low ticket size + long-term compound growth.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
