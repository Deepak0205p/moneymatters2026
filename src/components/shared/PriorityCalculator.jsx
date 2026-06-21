'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  ListOrdered, Save, Sparkles, IndianRupee, Home, 
  UtensilsCrossed, Car, Smartphone, GraduationCap, 
  Clapperboard, HeartPulse, PiggyBank, Gift, GripVertical, Check 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const PRIORITIES = [
  {
    id: 'rent',
    emoji: '🏠',
    title: 'Rent / Hostel 🏠',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    barColor: '#f43f5e',
    idealPct: 30,
    tip: 'Rent income ka 25-30% tak — isse zyada mat rakho!'
  },
  {
    id: 'food',
    emoji: '🍔',
    title: 'Food / Grocery 🍛',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    barColor: '#f59e0b',
    idealPct: 15,
    tip: 'Daily outside meals avoid karke savings optimize karein.'
  },
  {
    id: 'transport',
    emoji: '🚗',
    title: 'Transport / Commute 🚌',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    barColor: '#3b82f6',
    idealPct: 8,
    tip: 'Public transport use karne se wallet burden kam hota hai.'
  },
  {
    id: 'phone',
    emoji: '📱',
    title: 'Phone & Internet ⚡',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    barColor: '#06b6d4',
    idealPct: 3,
    tip: 'Family plans choose karke utility bills save karein.'
  },
  {
    id: 'education',
    emoji: '📚',
    title: 'Education / Skill-up 🎓',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    barColor: '#8b5cf6',
    idealPct: 12,
    tip: 'Apni skills pe invest karna is the best compound return.'
  },
  {
    id: 'entertainment',
    emoji: '🎬',
    title: 'Manoranjan / Subscriptions 🎬',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    barColor: '#ec4899',
    idealPct: 7,
    tip: 'Faltu memberships cancel karein aur free activities try karein.'
  },
  {
    id: 'health',
    emoji: '💊',
    title: 'Health & Fitness 🏥',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    barColor: '#10b981',
    idealPct: 7,
    tip: 'Daily healthy food + simple exercise reduces medical bills.'
  },
  {
    id: 'savings',
    emoji: '💰',
    title: 'Savings & SIP 🐷',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    barColor: '#22c55e',
    idealPct: 15,
    tip: 'Pehle 20% savings nikalen (Pay Yourself First rule).'
  },
  {
    id: 'gifts',
    emoji: '🎁',
    title: 'Gifts & Outings 🎁',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    barColor: '#f97316',
    idealPct: 3,
    tip: 'Festive times ke liye small monthly ledger separate lock karein.'
  }
];

const PRESET_INCOMES = [5000, 10000, 20000, 50000];

export default function PriorityCalculator({ open, onClose }) {
  const { addCoins } = useAppStore();
  const [income, setIncome] = useState(20000);
  const [items, setItems] = useState(PRIORITIES);
  const [saved, setSaved] = useState(false);

  // Derive allocation values based on Drag position (higher position = higher weight/priority)
  const allocations = useMemo(() => {
    const totalItems = items.length;
    const ranked = items.map((item, idx) => {
      // Top gets highest score weight
      const weight = Math.max(2, 20 - idx * 2);
      return { ...item, rank: idx + 1, weight };
    });
    const totalWeight = ranked.reduce((s, r) => s + r.weight, 0);

    return ranked.map(r => {
      const pct = Math.round((r.weight / totalWeight) * 100);
      const amount = Math.round((r.weight / totalWeight) * income);
      return { ...r, pct, amount };
    });
  }, [items, income]);

  const totalAllocated = useMemo(() => {
    return allocations.reduce((s, a) => s + a.amount, 0);
  }, [allocations]);

  const remaining = useMemo(() => income - totalAllocated, [income, totalAllocated]);

  // AI suggestions engine based on custom priorities
  const aiSuggestion = useMemo(() => {
    const savings = allocations.find(a => a.id === 'savings');
    const entertainment = allocations.find(a => a.id === 'entertainment');
    const rent = allocations.find(a => a.id === 'rent');

    if (!savings || !entertainment || !rent) return null;

    if (savings.pct < 10) {
      return {
        type: 'danger',
        title: 'Savings priority bahut low hai! 🚨',
        msg: `Aap savings pe sirf ${savings.pct}% budget rakh rahe ho. Isse top 3 priorities mein drag karein!`
      };
    }
    if (entertainment.pct > 15) {
      return {
        type: 'warning',
        title: 'Manoranjan expense limits ke bahar hai 🎬',
        msg: `Fun activities pe ${entertainment.pct}% budget is a bit high. Isko thoda niche push karein.`
      };
    }
    if (rent.pct > 35) {
      return {
        type: 'warning',
        title: 'Rent allocation heavy hai 🏠',
        msg: `Rent budget check karo (${rent.pct}%). Shared hostel ya PG consideration beneficial hoga.`
      };
    }
    return {
      type: 'success',
      title: 'Perfect Balanced Budget! 🎯',
      msg: 'Priority list balance lag rahi hai! Savings top order mein hai. Aise hi continue karein.'
    };
  }, [allocations]);

  const handleSave = () => {
    setSaved(true);
    addCoins(15);
    toast({
      title: "Priorities saved successfully! +15 Coins 🎉",
      description: "Smart prioritizer has updated your user record."
    });
  };

  const handleShare = () => {
    const topItems = items.slice(0, 3).map((it, i) => `${i + 1}. ${it.emoji} ${it.title.split(' ')[0]}`);
    const text = `Meri top financial priorities:\n${topItems.join('\n')}\nCheck your status on Money Matters app! ⚖️`;
    navigator.clipboard.writeText(text);
    toast({ title: "Result details copied! Share now 📋" });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Card wrapper */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop header */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ListOrdered size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Zaroorat vs Khwahish ⚖️</h2>
              <p className="text-[10px] text-zinc-400">Needs vs Wants Prioritizer & Budget Planner</p>
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
          {/* Income setup card */}
          <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-4.5 space-y-3">
            <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">
              Enter Monthly Income / Pocket Money
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input 
                type="number"
                value={income}
                onChange={(e) => {
                  setIncome(Math.max(1000, Number(e.target.value)));
                  setSaved(false);
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#05070F] border border-white/5 text-base font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div className="flex gap-2">
              {PRESET_INCOMES.map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    setIncome(preset);
                    setSaved(false);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                    income === preset 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  ₹{preset >= 1000 ? `${preset/1000}K` : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Reorder Group */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              Drag Items to Set Priority Order (Top = Highest priority)
            </h3>
            
            <Reorder.Group axis="y" values={items} onReorder={(next) => { setItems(next); setSaved(false); }} className="space-y-2.5">
              {allocations.map((item, idx) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item}
                  className={`flex items-center gap-3 p-3 rounded-2xl bg-[#0B0E19] border border-white/[0.04] cursor-grab active:grabbing select-none ${
                    item.id === 'savings' ? 'border-emerald-500/20 bg-emerald-500/[0.02]' : ''
                  }`}
                >
                  <GripVertical size={16} className="text-zinc-500 shrink-0 cursor-grab active:grabbing" />
                  
                  {/* Category icon */}
                  <span className="text-lg bg-white/5 p-1 rounded-lg shrink-0">
                    {item.emoji}
                  </span>

                  {/* Info block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white truncate">{item.title}</span>
                      <span className="text-[9px] font-bold text-zinc-500">Rank #{idx + 1}</span>
                    </div>
                    {/* Progress Bar inside */}
                    <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ backgroundColor: item.barColor, width: `${item.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Numerical split */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-400 block">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-zinc-500 block">{item.pct}% of total</span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Allocation strip bar */}
          <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-4.5 space-y-2.5">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Live Budget Allocation Strip</h4>
            <div className="flex h-3 rounded-full overflow-hidden bg-white/5 gap-0.5">
              {allocations.map(a => (
                <div 
                  key={a.id}
                  className="h-full relative group transition-all"
                  style={{ 
                    backgroundColor: a.barColor, 
                    width: `${a.pct}%` 
                  }}
                  title={`${a.title}: ${a.pct}%`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
              <span>Allocated: ₹{totalAllocated.toLocaleString('en-IN')}</span>
              <span className={remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {remaining >= 0 ? `Unallocated: ₹${remaining}` : `Deficit: ₹${Math.abs(remaining)}`}
              </span>
            </div>
          </div>

          {/* Ideal budget reference (50/30/20) */}
          <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-4.5 space-y-3">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Ideal Allocation Benchmark (50/30/20 Rule)</h4>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Needs (Rent, Food, Commute)</span>
                  <span className="font-black text-white">50% = ₹{(income * 0.5).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/2" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Wants (Outings, Subscriptions)</span>
                  <span className="font-black text-white">30% = ₹{(income * 0.3).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[30%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Savings + Emergency Locker</span>
                  <span className="font-black text-white">20% = ₹{(income * 0.2).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/5" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Card */}
          {aiSuggestion && (
            <div className={`p-4 rounded-3xl border flex items-start gap-3 transition-all ${
              aiSuggestion.type === 'danger' 
                ? 'bg-rose-500/5 border-rose-500/15' 
                : aiSuggestion.type === 'warning' 
                  ? 'bg-amber-500/5 border-amber-500/15' 
                  : 'bg-emerald-500/5 border-emerald-500/15'
            }`}>
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white">{aiSuggestion.title}</h5>
                <p className="text-[10px] text-zinc-400 leading-relaxed mt-0.5">{aiSuggestion.msg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-5 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/[0.05]"
          >
            Close
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-2xl border border-white/[0.06] text-xs font-extrabold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Share List
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-[#070913] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              {saved ? <Check size={14} /> : <Save size={14} />} {saved ? 'Priorities Saved' : 'Save Priorities'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}