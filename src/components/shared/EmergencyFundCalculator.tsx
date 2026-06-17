'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Sparkles,
  Plus,
  Minus,
  IndianRupee,
  AlertTriangle,
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

/* ============================================================
   Emergency Fund Calculator — Protection Shield concept
   ============================================================ */

interface EmergencyFundCalculatorProps {
  open: boolean;
  onClose: () => void;
}

interface ExpenseRow {
  key: string;
  label: string;
  emoji: string;
  defaultValue: number;
  color: string;
}

const EXPENSE_ROWS: ExpenseRow[] = [
  { key: 'rent',      label: 'Rent / Hostel',   emoji: '🏠', defaultValue: 8000,  color: '#f43f5e' },
  { key: 'food',      label: 'Khana',            emoji: '🍛', defaultValue: 5000,  color: '#f59e0b' },
  { key: 'transport', label: 'Travel',           emoji: '🚗', defaultValue: 2000,  color: '#3b82f6' },
  { key: 'utilities', label: 'Bills (Phone/Net)',emoji: '⚡', defaultValue: 1000,  color: '#10b981' },
  { key: 'emi',       label: 'EMI / Loan',       emoji: '💳', defaultValue: 0,     color: '#a855f7' },
  { key: 'other',     label: 'Aur Kharcha',      emoji: '📦', defaultValue: 1500,  color: '#94a3b8' },
];

type JobType = 'student' | 'employed' | 'freelancer';

const JOB_CONFIG: Record<JobType, { label: string; emoji: string; months: number; color: string }> = {
  student:     { label: 'Student',     emoji: '🎓', months: 3,  color: 'text-violet-400' },
  employed:    { label: 'Employed',    emoji: '💼', months: 6,  color: 'text-emerald-400' },
  freelancer:  { label: 'Freelancer',  emoji: '💻', months: 9,  color: 'text-amber-400' },
};

const DEPENDENT_OPTIONS = [0, 1, 2, 3, 4];

export default function EmergencyFundCalculator({ open, onClose }: EmergencyFundCalculatorProps) {
  const { addCoins, addBadge } = useAppStore();
  const [expenses, setExpenses] = useState<Record<string, number>>(
    Object.fromEntries(EXPENSE_ROWS.map((r) => [r.key, r.defaultValue])),
  );
  const [job, setJob] = useState<JobType>('student');
  const [dependents, setDependents] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [targetReached, setTargetReached] = useState(false);

  const monthlyExpense = useMemo(
    () => Object.values(expenses).reduce((s, v) => s + v, 0),
    [expenses],
  );

  /* Target: monthlyExpense × job months + dependents buffer (₹10k per dependent) */
  const target = useMemo(() => {
    const base = monthlyExpense * JOB_CONFIG[job].months;
    const dependentBuffer = dependents * 10000;
    return base + dependentBuffer;
  }, [monthlyExpense, job, dependents]);

  /* Recommended monthly saving plan: target ÷ 12 months */
  const monthlySavingPlan = useMemo(() => Math.ceil(target / 12), [target]);
  const monthsToReach = useMemo(
    () => (monthlySavingPlan > 0 ? Math.ceil((target - currentSavings) / monthlySavingPlan) : 0),
    [target, currentSavings, monthlySavingPlan],
  );

  /* Protection % */
  const protectionPct = target > 0 ? Math.min(100, (currentSavings / target) * 100) : 0;

  /* Shield tier */
  const tier = useMemo(() => {
    if (protectionPct >= 75) return { key: 'full',     label: 'Fully Protected!',       emoji: '🛡️✨', color: '#f59e0b', desc: 'Tum super ho! Abhi sab safe hai.',          ring: 'rgba(245,158,11,0.6)' };
    if (protectionPct >= 50) return { key: 'strong',   label: 'Strong Shield',          emoji: '🛡️',   color: '#10b981', desc: 'Ache ho! Almost there 💪',                   ring: 'rgba(16,185,129,0.5)' };
    if (protectionPct >= 25) return { key: 'half',     label: 'Half Shield',            emoji: '⚠️',   color: '#f59e0b', desc: 'Thoda safe ho, par abhi aur chahiye.',       ring: 'rgba(245,158,11,0.4)' };
    return                      { key: 'broken',  label: 'Broken Shield',          emoji: '🚨',   color: '#ef4444', desc: 'Bahut khatre mein ho! Shuru karo abhi.',     ring: 'rgba(239,68,68,0.4)' };
  }, [protectionPct]);

  useEffect(() => {
    if (protectionPct >= 75 && !targetReached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetReached(true);
      addBadge('emergency-shielded');
      addCoins(25);
      toast({ title: 'Shield fully protected! +25 coins 🛡️✨' });
    }
  }, [protectionPct, targetReached, addBadge, addCoins]);

  const updateExpense = (key: string, delta: number) => {
    setExpenses((prev) => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  const setExpenseValue = (key: string, value: number) => {
    setExpenses((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Emergency Fund Calculator</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold heading-gradient">Protection Shield 🛡️</h2>
              <p className="text-xs text-[#94A3B8]">Apna emergency fund banao</p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Animated Shield */}
          <div className="grid place-items-center py-4 relative">
            <motion.div
              key={tier.key}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="relative"
            >
              {/* Glow ring */}
              <motion.div
                animate={{ boxShadow: `0 0 60px ${tier.ring}, 0 0 100px ${tier.ring}` }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 rounded-full"
              />
              <svg width="180" height="200" viewBox="0 0 180 200" className="relative">
                {/* Shield outline */}
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"  stopColor={tier.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={tier.color} stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="shieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"  stopColor={tier.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={tier.color} stopOpacity="0.5" />
                  </linearGradient>
                </defs>

                {/* Shield body */}
                <path
                  d="M90 15 L160 40 L160 110 Q160 160 90 185 Q20 160 20 110 L20 40 Z"
                  fill="url(#shieldGrad)"
                  stroke={tier.color}
                  strokeWidth="3"
                  opacity="0.4"
                />
                {/* Filled portion (bottom up based on protectionPct) */}
                <motion.path
                  d="M90 15 L160 40 L160 110 Q160 160 90 185 Q20 160 20 110 L20 40 Z"
                  fill="url(#shieldFill)"
                  opacity="0.7"
                  style={{ clipPath: `inset(${100 - protectionPct}% 0% 0% 0%)` }}
                  animate={{ clipPath: `inset(${100 - protectionPct}% 0% 0% 0%)` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                {/* Cracks for broken shield */}
                {tier.key === 'broken' && (
                  <>
                    <path d="M90 60 L80 90 L100 120 L85 150" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M60 80 L75 100 L65 130" stroke="#ef4444" strokeWidth="1.2" fill="none" opacity="0.5" />
                  </>
                )}
                {/* Center icon */}
                <text x="90" y="105" fontSize="48" textAnchor="middle" className="font-display" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>
                  {tier.key === 'broken' ? '🚨' : tier.key === 'full' ? '✨' : '🛡️'}
                </text>
                {/* Percentage */}
                <text x="90" y="145" fontSize="20" textAnchor="middle" fontWeight="bold" fill="#F8FAFC" className="font-display">
                  {Math.round(protectionPct)}%
                </text>
              </svg>
            </motion.div>

            {/* Tier label */}
            <div className="text-center mt-2">
              <motion.p
                key={tier.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-lg font-bold"
                style={{ color: tier.color }}
              >
                {tier.label}
              </motion.p>
              <p className="text-xs text-[#94A3B8]">{tier.desc}</p>
            </div>
          </div>

          {/* Stat banner */}
          <div className="p-3 rounded-2xl glass-card border-amber-400/20 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200/90">
              <span className="font-bold">80% Indians ke paas emergency fund nahi hai.</span> Tum unn 20% mein aao! 💪
            </p>
          </div>

          {/* Inputs */}
          <div className="p-4 rounded-2xl glass-card space-y-3">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Monthly Expenses 📝</h3>
            {EXPENSE_ROWS.map((row) => (
              <div key={row.key} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] grid place-items-center text-base shrink-0">
                  {row.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#94A3B8]">{row.label}</p>
                </div>
                <button
                  onClick={() => updateExpense(row.key, -500)}
                  className="w-7 h-7 rounded-lg glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="relative w-20">
                  <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-400" />
                  <input
                    type="number"
                    value={expenses[row.key]}
                    onChange={(e) => setExpenseValue(row.key, parseInt(e.target.value || '0', 10))}
                    className="w-full pl-5 pr-1 py-1.5 rounded-lg glass-strong text-xs font-bold text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-emerald-400/40"
                  />
                </div>
                <button
                  onClick={() => updateExpense(row.key, 500)}
                  className="w-7 h-7 rounded-lg glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs text-[#94A3B8]">Total Monthly</span>
              <span className="text-sm font-bold text-emerald-300">₹{monthlyExpense.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Job type */}
          <div className="p-4 rounded-2xl glass-card space-y-2">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Job Type 💼</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(JOB_CONFIG) as JobType[]).map((jt) => {
                const c = JOB_CONFIG[jt];
                const active = job === jt;
                return (
                  <button
                    key={jt}
                    onClick={() => setJob(jt)}
                    className={cn(
                      'p-2 rounded-xl text-center transition border',
                      active
                        ? 'bg-emerald-500/15 border-emerald-400/40'
                        : 'border-white/[0.06] hover:border-white/[0.12]',
                    )}
                  >
                    <div className="text-xl mb-0.5">{c.emoji}</div>
                    <p className={cn('text-xs font-semibold', active ? 'text-emerald-300' : 'text-[#94A3B8]')}>{c.label}</p>
                    <p className="text-[10px] text-[#94A3B8]">{c.months} months cover</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dependents */}
          <div className="p-4 rounded-2xl glass-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Dependents 👨‍👩‍👧</h3>
              <span className="text-xs text-[#94A3B8]">Parivaar jo tum pe depend karta hai</span>
            </div>
            <div className="flex gap-2">
              {DEPENDENT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setDependents(n)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm font-bold transition border',
                    dependents === n
                      ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                      : 'border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Current savings */}
          <div className="p-4 rounded-2xl glass-card">
            <label className="text-xs text-[#94A3B8] mb-2 block">Current Savings (emergency fund)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-strong text-base font-bold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
              </div>
              <div className="flex gap-1">
                {[1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCurrentSavings((s) => s + amt)}
                    className="px-2 py-1.5 rounded-lg glass-card text-[10px] font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    +{amt / 1000}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target & Plan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl glass-card-premium border-emerald-400/30">
              <p className="text-xs text-[#94A3B8] mb-1">🎯 Target Amount</p>
              <p className="text-xl font-bold text-emerald-300">₹{target.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-[#94A3B8] mt-1">
                {JOB_CONFIG[job].months} months × ₹{monthlyExpense.toLocaleString('en-IN')}
                {dependents > 0 && ` + ${dependents}×₹10k`}
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-card-premium border-amber-400/30">
              <p className="text-xs text-[#94A3B8] mb-1">📅 Monthly Plan</p>
              <p className="text-xl font-bold text-amber-300">₹{monthlySavingPlan.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-[#94A3B8] mt-1">
                {monthsToReach > 0 ? `${monthsToReach} months mein goal!` : 'Goal done! 🎉'}
              </p>
            </div>
          </div>

          {/* AI tip */}
          <div className="p-4 rounded-2xl glass-card-premium border border-violet-500/30 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 grid place-items-center shrink-0">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-violet-300 mb-0.5">Smart Tip 🤖</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {tier.key === 'broken' && 'Chhota target rakho — pehle 1 month ka kharcha bhi bahut value hai. ₹500/week se start karo.'}
                {tier.key === 'half' && 'Acche trajectory pe ho! Auto-debit laga do — salary aate hi emergency fund mein transfer ho jaye.'}
                {tier.key === 'strong' && 'Mast! Sirf thoda aur — liquid fund ya savings account mein rakhna, FD nahi (lock-in problem).'}
                {tier.key === 'full' && 'Shield fully charged! Ab next goal pe dhyaan do — SIP ya investments. Yeh fund intact rakhna.'}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => { addCoins(10); toast({ title: 'Plan saved! +10 coins 🎉' }); }}
            className="w-full py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save My Plan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
