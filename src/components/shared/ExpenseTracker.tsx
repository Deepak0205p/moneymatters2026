"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import {
  X, Plus, Trash2, IndianRupee, TrendingDown, Wallet, Calendar, AlertTriangle,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppStore, type ExpenseEntry } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
interface ExpenseTrackerProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Category meta — fun emoji bubbles
   ────────────────────────────────────────────────────────────── */
interface CategoryMeta {
  key: string;
  label: string;
  emoji: string;
  color: string;
}

const CATEGORIES: CategoryMeta[] = [
  { key: 'food', label: 'Food', emoji: '🍔', color: '#F59E0B' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#A855F7' },
  { key: 'education', label: 'Education', emoji: '📚', color: '#10B981' },
  { key: 'shopping', label: 'Shopping', emoji: '👕', color: '#EC4899' },
  { key: 'chai', label: 'Chai/Snacks', emoji: '☕', color: '#92400E' },
  { key: 'bills', label: 'Bills', emoji: '📱', color: '#EF4444' },
  { key: 'health', label: 'Health', emoji: '💊', color: '#06B6D4' },
];

const getCat = (key: string): CategoryMeta => CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function generateId(): string {
  return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatDateLabel(dateStr: string): string {
  if (dateStr === todayStr()) return 'Aaj';
  if (dateStr === new Date(Date.now() - 86400000).toISOString().split('T')[0]) return 'Kal';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ──────────────────────────────────────────────────────────────
   Need/Want toggle
   ────────────────────────────────────────────────────────────── */
function NeedWantToggle({ value, onChange }: { value: 'need' | 'want'; onChange: (v: 'need' | 'want') => void }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-1 flex">
      <button
        onClick={() => onChange('need')}
        className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
          value === 'need' ? 'bg-emerald text-midnight' : 'text-ink-muted hover:text-white'
        }`}
      >
        😇 Zaroorat
      </button>
      <button
        onClick={() => onChange('want')}
        className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
          value === 'want' ? 'bg-gold text-midnight' : 'text-ink-muted hover:text-white'
        }`}
      >
        😎 Shauq
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Add Expense Modal
   ────────────────────────────────────────────────────────────── */
function AddExpenseModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: ExpenseEntry) => void;
}) {
  const [category, setCategory] = useState<string>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'need' | 'want'>('want');

  const reset = () => {
    setCategory('food');
    setAmount('');
    setDescription('');
    setType('want');
  };

  const handleSubmit = () => {
    const n = parseInt(amount, 10);
    if (!n || n <= 0) return;
    onAdd({
      id: generateId(),
      amount: n,
      category,
      description: description.trim() || getCat(category).label,
      date: todayStr(),
      createdAt: Date.now(),
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-md p-0 overflow-hidden">
        <div className="p-5 border-b border-white/10 glass-card-premium">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
          >
            <X size={16} />
          </button>
          <DialogTitle className="font-display text-xl font-extrabold text-white">
            Naya Kharcha Add Karo 🧾
          </DialogTitle>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Category bubbles */}
          <div>
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">Category Choose Karo</p>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <motion.button
                  key={c.key}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(c.key)}
                  className={`relative rounded-xl p-3 flex flex-col items-center gap-1 border transition-all ${
                    category === c.key ? 'border-white/30' : 'border-white/10 bg-white/[0.03]'
                  }`}
                  style={category === c.key ? { backgroundColor: `${c.color}25`, boxShadow: `0 0 0 2px ${c.color}80` } : {}}
                >
                  <div className="text-2xl">{c.emoji}</div>
                  <span className="text-[9px] font-bold text-white">{c.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">Amount</p>
            <div className="relative">
              <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-soft" />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="pl-12 pr-4 py-4 bg-white/5 border-white/10 text-white font-display text-3xl font-extrabold h-14"
              />
            </div>
            {/* Quick amount presets */}
            <div className="flex gap-2 mt-2">
              {[50, 100, 200, 500].map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="flex-1 rounded-lg py-1.5 text-xs font-bold text-ink-muted bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">Kya kharch kiya? (Optional)</p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jaise: Swiggy, Petrol, Movie ticket"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Need/Want toggle */}
          <div>
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">Zaroorat thi ya Shauq tha? 🤔</p>
            <NeedWantToggle value={type} onChange={setType} />
          </div>
        </div>

        <div className="p-5 border-t border-white/10 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm font-bold text-ink-muted bg-white/5 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || parseInt(amount, 10) <= 0}
            className="flex-1 btn-3d rounded-xl py-3 text-sm font-bold text-midnight disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
          >
            Add Karo! ✅
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────────────────────────────────────────────
   Today's Spending Summary Card with animated ring
   ────────────────────────────────────────────────────────────── */
function TodaySummary({ todaySpent, budget }: { todaySpent: number; budget: number }) {
  const pct = budget > 0 ? Math.min(100, (todaySpent / budget) * 100) : 0;
  const isOver = budget > 0 && todaySpent > budget;
  const color = isOver ? '#EF4444' : pct > 80 ? '#F59E0B' : '#10B981';
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 glass-card-glow p-5 spotlight-card">
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ backgroundColor: color }} />
      <div className="relative flex items-center gap-4">
        {/* Spending ring */}
        <div className="relative flex-shrink-0">
          <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
            <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="46" cy="46" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c - (pct / 100) * c }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-base font-extrabold text-white">{formatINR(todaySpent)}</span>
            <span className="text-[9px] font-bold text-ink-muted uppercase">aaj</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Aaj ka Kharcha</p>
          <p className="font-display text-lg font-extrabold text-white">
            {formatINR(todaySpent)} <span className="text-xs text-ink-muted font-normal">/ {budget > 0 ? formatINR(budget) : '∞'}</span>
          </p>
          <div className="mt-2 flex items-center gap-2">
            {isOver ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-bold text-red-400">
                <AlertTriangle size={10} /> Budget Over!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald/15 border border-emerald/30 text-[10px] font-bold text-emerald-soft">
                Budget ke andar 👍
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Weekly Bar Chart
   ────────────────────────────────────────────────────────────── */
function WeeklyChart({ expenses }: { expenses: ExpenseEntry[] }) {
  const days = useMemo(() => {
    const result: { label: string; total: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const total = expenses.filter((e) => e.date === dateStr).reduce((a, b) => a + b.amount, 0);
      result.push({
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        total,
        isToday: i === 0,
      });
    }
    return result;
  }, [expenses]);

  const maxVal = Math.max(...days.map((d) => d.total), 100);

  return (
    <div className="rounded-2xl border border-white/10 glass-card p-4">
      <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
        <Calendar size={12} className="text-emerald-soft" /> Last 7 Days
      </p>
      <div className="flex items-end justify-between gap-2 h-32">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full">
            <div className="flex-1 w-full flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.total / maxVal) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                className="w-full rounded-t-lg relative"
                style={{
                  background: d.isToday
                    ? 'linear-gradient(180deg, #34D399, #10B981)'
                    : 'linear-gradient(180deg, rgba(16,185,129,0.4), rgba(16,185,129,0.15))',
                  minHeight: d.total > 0 ? '8px' : '2px',
                }}
              >
                {d.total > 0 && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white whitespace-nowrap">
                    {d.total >= 1000 ? `${(d.total / 1000).toFixed(1)}k` : d.total}
                  </span>
                )}
              </motion.div>
            </div>
            <span className={`text-[10px] font-bold ${d.isToday ? 'text-emerald-soft' : 'text-ink-muted'}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Category-wise horizontal bars
   ────────────────────────────────────────────────────────────── */
function CategoryBreakdown({ expenses }: { expenses: ExpenseEntry[] }) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    const arr = Array.from(map.entries())
      .map(([key, total]) => ({ meta: getCat(key), total }))
      .sort((a, b) => b.total - a.total);
    return arr;
  }, [expenses]);

  const maxVal = Math.max(...data.map((d) => d.total), 1);

  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 glass-card p-4">
      <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
        <TrendingDown size={12} className="text-gold-soft" /> Category Breakdown
      </p>
      <div className="space-y-2.5">
        {data.map((d, i) => (
          <div key={d.meta.key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{d.meta.emoji}</span> {d.meta.label}
              </span>
              <span className="font-bold text-ink-muted">{formatINR(d.total)}</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.total / maxVal) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${d.meta.color}, ${d.meta.color}80)` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Expense Item — swipe left to delete
   ────────────────────────────────────────────────────────────── */
function ExpenseItem({
  expense, onDelete,
}: {
  expense: ExpenseEntry;
  onDelete: (id: string) => void;
}) {
  const meta = getCat(expense.category);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -80) {
      onDelete(expense.id);
    }
  };

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: -120, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}30` }}
      >
        {meta.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{expense.description}</p>
        <p className="text-[10px] text-ink-muted">{formatDateLabel(expense.date)}</p>
      </div>
      <span className="font-display font-extrabold text-white">{formatINR(expense.amount)}</span>
      <button
        onClick={() => onDelete(expense.id)}
        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-ink-muted hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="Delete"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function ExpenseTracker({ open, onClose }: ExpenseTrackerProps) {
  const { expenses, addExpense, deleteExpense, monthlyBudget, setMonthlyBudget } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBudgetInput(monthlyBudget > 0 ? String(monthlyBudget) : '');
  }, [monthlyBudget, open]);

  const todayExpenses = useMemo(() => expenses.filter((e) => e.date === todayStr()), [expenses]);
  const todaySpent = todayExpenses.reduce((a, b) => a + b.amount, 0);
  const dailyBudget = monthlyBudget > 0 ? Math.round(monthlyBudget / 30) : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, ExpenseEntry[]>();
    expenses.slice(0, 50).forEach((e) => {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  const saveBudget = () => {
    const n = parseInt(budgetInput, 10);
    setMonthlyBudget(n > 0 ? n : 0);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-white/10 glass-card-premium">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <Wallet size={20} className="text-midnight" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Expense Tracker 🧾</h2>
              <p className="text-xs text-ink-muted mt-0.5">Kharcha track karo, bachat karo! Swipe left to delete ⬅️</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto space-y-4">
          {/* Today Summary */}
          <TodaySummary todaySpent={todaySpent} budget={dailyBudget} />

          {/* Budget setter */}
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 flex items-center gap-2">
            <Wallet size={14} className="text-ink-muted flex-shrink-0" />
            <Input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={saveBudget}
              placeholder="Monthly budget set karo (₹)"
              className="bg-transparent border-0 text-white text-sm h-8 focus-visible:ring-0"
            />
            <span className="text-[10px] text-ink-muted font-bold whitespace-nowrap">
              {dailyBudget > 0 ? `≈ ₹${dailyBudget}/din` : ''}
            </span>
          </div>

          {/* Weekly chart */}
          <WeeklyChart expenses={expenses} />

          {/* Category breakdown */}
          {expenses.length > 0 && <CategoryBreakdown expenses={expenses} />}

          {/* Recent expenses */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar size={12} className="text-emerald-soft" /> Recent Kharcha
            </p>
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 opacity-40">🧾</div>
                <p className="text-sm text-ink-muted">Abhi koi kharcha nahi. Naya add karo! 👇</p>
              </div>
            ) : (
              <div className="space-y-2">
                {grouped.map(([date, items]) => (
                  <div key={date}>
                    <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1.5 mt-3">
                      {formatDateLabel(date)} · {formatINR(items.reduce((a, b) => a + b.amount, 0))}
                    </p>
                    <div className="space-y-1.5">
                      <AnimatePresence>
                        {items.map((e) => (
                          <ExpenseItem key={e.id} expense={e} onDelete={deleteExpense} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddOpen(true)}
          className="btn-3d absolute bottom-5 right-5 rounded-2xl px-5 py-3 font-bold text-sm text-midnight flex items-center gap-2 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
        >
          <Plus size={18} /> Add
        </motion.button>

        <AddExpenseModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addExpense} />
      </DialogContent>
    </Dialog>
  );
}
