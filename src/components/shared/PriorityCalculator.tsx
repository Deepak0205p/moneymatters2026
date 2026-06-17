'use client';

import { useState, useMemo } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  ListOrdered,
  Save,
  Sparkles,
  IndianRupee,
  Home,
  UtensilsCrossed,
  Car,
  Smartphone,
  GraduationCap,
  Clapperboard,
  HeartPulse,
  PiggyBank,
  Gift,
  GripVertical,
  Check,
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
import { formatCurrency } from '@/lib/utils';

/* ============================================================
   Priority Calculator — drag to reorder, live bar chart
   ============================================================ */

interface PriorityCalculatorProps {
  open: boolean;
  onClose: () => void;
}

interface PriorityItem {
  id: string;
  emoji: string;
  title: string;
  titleEn: string;
  color: string;
  bg: string;
  barColor: string;
  idealPct: number;
  defaultPct: number;
  tip: string;
  icon: React.ReactNode;
}

const PRIORITIES: PriorityItem[] = [
  { id: 'rent',         emoji: '🏠', title: 'Rent / Hostel',  titleEn: 'Rent ya hostel fees',     color: 'text-rose-400',    bg: 'bg-rose-400/10',    barColor: '#f43f5e', idealPct: 30, defaultPct: 30, tip: 'Rent income ka 25-30% tak — zyada nahi!', icon: <Home className="w-4 h-4" /> },
  { id: 'food',         emoji: '🍔', title: 'Food',           titleEn: 'Khana',                    color: 'text-amber-400',   bg: 'bg-amber-400/10',   barColor: '#f59e0b', idealPct: 15, defaultPct: 20, tip: 'Mess / cooking se 50% bachat ho sakti hai.', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'transport',    emoji: '🚗', title: 'Transport',      titleEn: 'Travel / Bus / Metro',     color: 'text-blue-400',    bg: 'bg-blue-400/10',    barColor: '#3b82f6', idealPct: 8,  defaultPct: 12, tip: 'Public transport = 70% saving vs cab.', icon: <Car className="w-4 h-4" /> },
  { id: 'phone',        emoji: '📱', title: 'Phone Recharge', titleEn: 'Phone + Internet',         color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    barColor: '#06b6d4', idealPct: 3,  defaultPct: 6,  tip: 'Family plan se 30% bachat.', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'education',    emoji: '📚', title: 'Education',      titleEn: 'Books / Course / Coaching',color: 'text-violet-400',  bg: 'bg-violet-400/10',  barColor: '#8b5cf6', idealPct: 12, defaultPct: 10, tip: 'Skill courses = best investment. Skilligo pe check karo.', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'entertainment',emoji: '🎬', title: 'Entertainment',  titleEn: 'Movies / Netflix / Outing',color: 'text-pink-400',    bg: 'bg-pink-400/10',    barColor: '#ec4899', idealPct: 7,  defaultPct: 12, tip: 'Family plan se 30% bachat. Free events try karo.', icon: <Clapperboard className="w-4 h-4" /> },
  { id: 'health',       emoji: '💊', title: 'Health',         titleEn: 'Medical + Fitness',        color: 'text-emerald-400', bg: 'bg-emerald-400/10', barColor: '#10b981', idealPct: 7,  defaultPct: 5,  tip: 'Insurance + ₹500 gym = long-term saving.', icon: <HeartPulse className="w-4 h-4" /> },
  { id: 'savings',      emoji: '💰', title: 'Savings',        titleEn: 'Investments + Emergency',  color: 'text-emerald-400', bg: 'bg-emerald-400/10', barColor: '#22c55e', idealPct: 15, defaultPct: 5,  tip: 'Pehle 20% save karo, baaki kharch karo.', icon: <PiggyBank className="w-4 h-4" /> },
  { id: 'gifts',        emoji: '🎁', title: 'Gifts',          titleEn: 'Gifts / Donations',        color: 'text-orange-400',  bg: 'bg-orange-400/10',  barColor: '#f97316', idealPct: 3,  defaultPct: 0,  tip: 'Occasional rakho, monthly budget impact na kare.', icon: <Gift className="w-4 h-4" /> },
];

const PRESET_INCOMES = [3000, 5000, 10000, 15000, 25000];

export default function PriorityCalculator({ open, onClose }: PriorityCalculatorProps) {
  const { addCoins } = useAppStore();
  const [income, setIncome] = useState(10000);
  const [items, setItems] = useState<PriorityItem[]>(PRIORITIES);
  const [saved, setSaved] = useState(false);

  /* Calculate allocation % based on position in list (higher position = more weight) */
  const allocations = useMemo(() => {
    // Position weight: top priority gets ideal%, others scale by their `defaultPct` normalized
    // Simpler: use the order rank with diminishing weight via formula
    const ranked = items.map((item, idx) => ({
      ...item,
      rank: idx + 1, // 1-based
      weight: Math.max(2, 20 - idx * 2), // top item gets 20, last gets 4
    }));
    const totalWeight = ranked.reduce((s, r) => s + r.weight, 0);
    return ranked.map((r) => ({
      ...r,
      pct: Math.round((r.weight / totalWeight) * 100),
      amount: Math.round((r.weight / totalWeight) * income),
    }));
  }, [items, income]);

  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = income - totalAllocated;

  /* AI suggestion based on allocation vs ideal */
  const aiSuggestion = useMemo(() => {
    const savings = allocations.find((a) => a.id === 'savings');
    const entertainment = allocations.find((a) => a.id === 'entertainment');
    const rent = allocations.find((a) => a.id === 'rent');
    if (!savings || !entertainment || !rent) return null;

    if (savings.pct < 10) {
      return {
        type: 'danger' as const,
        title: 'Savings bahut kam hai 🚨',
        msg: `Bhai, savings pe sirf ${savings.pct}% chala raha hai. Kam se kam 15-20% rakho. Entertainment thoda kam karke savings badhao!`,
      };
    }
    if (entertainment.pct > 15) {
      return {
        type: 'warning' as const,
        title: 'Entertainment zyada ho gaya 🤔',
        msg: `Movies/outing pe ${entertainment.pct}% — paisa ud raha hai. 7-8% ideal hai. Ek "No Swiggy Week" try karo!`,
      };
    }
    if (rent.pct > 35) {
      return {
        type: 'warning' as const,
        title: 'Rent ka hissa zyada hai 🏠',
        msg: `Rent ${rent.pct}% le raha hai income ka. Sharing flat ya PG shift karo — 10% bachat ho sakti hai.`,
      };
    }
    if (savings.pct >= 15 && entertainment.pct <= 8) {
      return {
        type: 'success' as const,
        title: 'Perfect Budget! 🎯',
        msg: `Bhai, tum apne paise sambhalna jaante ho! Savings ${savings.pct}% — shabaash! Aise hi chalte raho 🔥`,
      };
    }
    return {
      type: 'success' as const,
      title: 'Balance achha hai 💪',
      msg: 'Priority order bilkul theek lag raha hai. Savings ko top 3 mein rakhna try karo.',
    };
  }, [allocations]);

  const handleIncomeChange = (val: number) => {
    setIncome(Math.max(500, Math.min(200000, val)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    addCoins(15);
    toast({ title: 'Priorities save ho gayi! +15 coins 🎉' });
  };

  const handleShare = async () => {
    const lines = items.slice(0, 5).map((it, i) => `${i + 1}. ${it.emoji} ${it.title}`);
    const text = `Meri Financial Priorities:\n\n${lines.join('\n')}\n\nMade with Rupaiya 101 💸`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'My Financial Priorities', text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      toast({ title: 'Copy kar liya! 📋' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Priority Calculator</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
              <ListOrdered className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold heading-gradient">Priority Calculator</h2>
              <p className="text-xs text-[#94A3B8]">Drag karke priority set karo 🎯</p>
            </div>
          </div>

          {/* Income input */}
          <div className="p-4 rounded-2xl glass-card">
            <label className="text-xs text-[#94A3B8] mb-1.5 block">Monthly Income / Pocket Money</label>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="number"
                  value={income}
                  onChange={(e) => handleIncomeChange(parseInt(e.target.value || '0', 10))}
                  className="w-full pl-10 pr-3 py-3 rounded-xl glass-strong text-lg font-bold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESET_INCOMES.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setIncome(amt); setSaved(false); }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition border',
                    income === amt
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'glass-card border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]',
                  )}
                >
                  ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Draggable priority list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Priorities (drag to reorder)</h3>
              <span className="text-xs text-[#94A3B8]">{items.length} items</span>
            </div>
            <Reorder.Group axis="y" values={items} onReorder={(newItems) => { setItems(newItems); setSaved(false); }} className="space-y-2">
              {allocations.map((item, idx) => (
                <Reorder.Item
                  key={item.id}
                  value={items[idx]}
                  whileDrag={{ scale: 1.03, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', zIndex: 50 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-2xl glass-card cursor-grab active:cursor-grabbing border',
                    item.id === 'savings' ? 'border-emerald-400/30' : 'border-white/[0.06]',
                  )}
                >
                  <GripVertical className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <div className={cn('w-9 h-9 rounded-xl grid place-items-center text-lg shrink-0', item.bg)}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#F8FAFC] truncate">{item.title}</span>
                      <span className="text-[10px] text-[#94A3B8]">#{idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.barColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#F8FAFC]">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-300">{formatCurrency(item.amount, false)}</p>
                    <p className="text-[10px] text-[#94A3B8]">₹/mo</p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Live summary bar chart */}
          <div className="p-4 rounded-2xl glass-card">
            <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Live Allocation 📊</h3>
            <div className="flex h-10 rounded-lg overflow-hidden gap-0.5">
              {allocations.map((a) => (
                <motion.div
                  key={a.id}
                  className="relative group"
                  initial={{ width: 0 }}
                  animate={{ width: `${a.pct}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  style={{ background: a.barColor }}
                >
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-black/70">
                    {a.pct > 5 ? a.emoji : ''}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-[#94A3B8]">
                Allocated: <span className="font-bold text-[#F8FAFC]">{formatCurrency(totalAllocated, false)}</span>
              </span>
              <span className={remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {remaining >= 0 ? 'Bacha: ' : 'Over: '}<span className="font-bold">{formatCurrency(Math.abs(remaining), false)}</span>
              </span>
            </div>
          </div>

          {/* Ideal comparison */}
          <div className="p-4 rounded-2xl glass-card">
            <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Ideal Budget (50/30/20 rule) 📐</h3>
            <div className="space-y-2">
              {[
                { label: 'Needs (Rent, Food, Transport)', pct: 50, color: 'bg-emerald-500', idealAmount: income * 0.5 },
                { label: 'Wants (Entertainment, Outing)', pct: 30, color: 'bg-amber-500',   idealAmount: income * 0.3 },
                { label: 'Savings + Investment',           pct: 20, color: 'bg-violet-500',  idealAmount: income * 0.2 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">{row.label}</span>
                    <span className="font-semibold text-[#F8FAFC]">{row.pct}% = ₹{Math.round(row.idealAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={cn('h-full rounded-full', row.color)} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI suggestion */}
          {aiSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-4 rounded-2xl glass-card-premium border flex items-start gap-3',
                aiSuggestion.type === 'danger' ? 'border-rose-500/30' :
                aiSuggestion.type === 'warning' ? 'border-amber-400/30' : 'border-emerald-400/30',
              )}
            >
              <div className={cn(
                'w-9 h-9 rounded-xl grid place-items-center shrink-0',
                aiSuggestion.type === 'danger' ? 'bg-rose-500/15' :
                aiSuggestion.type === 'warning' ? 'bg-amber-400/15' : 'bg-emerald-500/15',
              )}>
                <Sparkles className={cn(
                  'w-5 h-5',
                  aiSuggestion.type === 'danger' ? 'text-rose-400' :
                  aiSuggestion.type === 'warning' ? 'text-amber-400' : 'text-emerald-400',
                )} />
              </div>
              <div className="flex-1">
                <p className={cn(
                  'text-sm font-bold mb-0.5',
                  aiSuggestion.type === 'danger' ? 'text-rose-300' :
                  aiSuggestion.type === 'warning' ? 'text-amber-300' : 'text-emerald-300',
                )}>
                  {aiSuggestion.title}
                </p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{aiSuggestion.msg}</p>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5"
            >
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Priorities</>}
            </button>
            <button
              onClick={handleShare}
              className="py-3 px-4 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition"
            >
              Share
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
