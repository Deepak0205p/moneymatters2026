'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Trash2, IndianRupee, TrendingDown, Wallet, PieChart as PieChartIcon,
  Calendar, AlertTriangle, Sparkles, ChevronDown, ChevronUp, Pencil, Check,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ExpenseTrackerProps {
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const EXPENSE_CATEGORIES = [
  { key: 'khana', label: 'Khana', emoji: '🍕', color: '#f59e0b' },
  { key: 'travel', label: 'Travel', emoji: '🚗', color: '#3b82f6' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#a855f7' },
  { key: 'bills', label: 'Bills/EMI', emoji: '📱', color: '#ef4444' },
  { key: 'shopping', label: 'Shopping', emoji: '🛒', color: '#22c55e' },
  { key: 'health', label: 'Health', emoji: '💊', color: '#ec4899' },
  { key: 'education', label: 'Education', emoji: '📚', color: '#06b6d4' },
  { key: 'savings', label: 'Savings', emoji: '💡', color: '#fbbf24' },
  { key: 'others', label: 'Others', emoji: '📦', color: '#6b7280' },
] as const;

type CategoryKey = (typeof EXPENSE_CATEGORIES)[number]['key'];

const getCategoryMeta = (key: string) =>
  EXPENSE_CATEGORIES.find((c) => c.key === key) ?? EXPENSE_CATEGORIES[8];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function formatDateLabel(dateStr: string): string {
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Aaj';
  if (dateStr === yesterday) return 'Kal';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

/* Group expenses by date, sorted newest first */
function groupByDate(expenses: { id: string; amount: number; category: string; description: string; date: string; createdAt: number }[]) {
  const map = new Map<string, typeof expenses>();
  for (const e of expenses) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  const sorted = [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  return sorted.map(([date, items]) => ({
    date,
    label: formatDateLabel(date),
    items: items.sort((a, b) => b.createdAt - a.createdAt),
    total: items.reduce((s, i) => s + i.amount, 0),
  }));
}

/* Custom Tooltip for PieChart */
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string; percent: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-[#e8e8ed]">{d.name}</p>
      <p className="text-amber-400">{formatINR(d.value)}</p>
      <p className="text-[#a0a0b8]">{d.payload.percent.toFixed(1)}%</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ExpenseTracker({ open, onClose }: ExpenseTrackerProps) {
  /* ---- store ---- */
  const expenses = useAppStore((s) => s.expenses);
  const monthlyBudget = useAppStore((s) => s.monthlyBudget);
  const addExpense = useAppStore((s) => s.addExpense);
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const setMonthlyBudget = useAppStore((s) => s.setMonthlyBudget);
  const coins = useAppStore((s) => s.coins);
  const addCoins = useAppStore((s) => s.addCoins);

  /* ---- form state ---- */
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | ''>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayStr());
  const [showForm, setShowForm] = useState(false);

  /* ---- budget edit ---- */
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  /* ---- collapsed sections ---- */
  const [listExpanded, setListExpanded] = useState(true);

  /* ---- derived ---- */
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(currentMonth)),
    [expenses, currentMonth],
  );

  const totalSpent = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses],
  );

  const budgetRemaining = useMemo(
    () => monthlyBudget - totalSpent,
    [monthlyBudget, totalSpent],
  );

  const dailyAverage = useMemo(() => {
    const daysInMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getDate();
    const today = new Date().getDate();
    return totalSpent / Math.max(today, 1);
  }, [totalSpent]);

  const budgetPct = useMemo(
    () => (monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0),
    [totalSpent, monthlyBudget],
  );

  const budgetBarColor = useMemo(() => {
    if (budgetPct >= 100) return 'bg-red-500';
    if (budgetPct >= 80) return 'bg-amber-500';
    return 'bg-green-400';
  }, [budgetPct]);

  const showBachatAlert = monthlyBudget > 0 && budgetPct >= 80;

  /* Pie chart data */
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of monthExpenses) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    const total = [...map.values()].reduce((s, v) => s + v, 0);
    return [...map.entries()]
      .map(([key, value]) => ({
        name: getCategoryMeta(key).label,
        key,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
        fill: getCategoryMeta(key).color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  /* Grouped expense list */
  const grouped = useMemo(() => groupByDate(expenses), [expenses]);

  /* ---- handlers ---- */
  const resetForm = useCallback(() => {
    setAmount('');
    setSelectedCategory('');
    setDescription('');
    setDate(todayStr());
  }, []);

  const handleAdd = useCallback(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !selectedCategory) return;
    addExpense({
      id: generateId(),
      amount: amt,
      category: selectedCategory,
      description: description.trim() || getCategoryMeta(selectedCategory).label,
      date,
      createdAt: Date.now(),
    });
    // reward coins for tracking
    addCoins(2);
    resetForm();
    setShowForm(false);
  }, [amount, selectedCategory, description, date, addExpense, addCoins, resetForm]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteExpense(id);
    },
    [deleteExpense],
  );

  const handleBudgetSave = useCallback(() => {
    const val = parseFloat(budgetInput);
    if (val > 0) setMonthlyBudget(val);
    setEditingBudget(false);
    setBudgetInput('');
  }, [budgetInput, setMonthlyBudget]);

  const startBudgetEdit = useCallback(() => {
    setBudgetInput(monthlyBudget > 0 ? String(monthlyBudget) : '');
    setEditingBudget(true);
  }, [monthlyBudget]);

  /* ---- animation variants ---- */
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.35, ease: 'easeOut' },
    }),
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  /* ---- render ---- */
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 z-50 flex flex-col w-full max-w-full h-full translate-x-0 translate-y-0 top-0 left-0 rounded-none border-0 bg-[#0a0a0f] p-0 overflow-hidden sm:max-w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-5 pt-5 pb-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Wallet className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#e8e8ed]">Expense Tracker</h2>
              <p className="text-xs text-[#a0a0b8]">Apna kharcha track karo 💸</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-[#1a1a2e] text-[#a0a0b8] transition-colors hover:text-[#e8e8ed]"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="wait">
            {/* ---- Add Expense Form (collapsible) ---- */}
            <motion.div
              key="add-form-section"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-5"
            >
              <button
                onClick={() => setShowForm((p) => !p)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#1a1a2e] px-4 py-3 text-left transition-colors hover:border-amber-500/30"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-[#e8e8ed]">
                    Naya Kharcha Add Karo
                  </span>
                </div>
                {showForm ? (
                  <ChevronUp className="h-4 w-4 text-[#a0a0b8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#a0a0b8]" />
                )}
              </button>

              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#1a1a2e] p-4 space-y-4">
                      {/* Amount */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[#a0a0b8]">
                          Kitne ka kharcha?
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-amber-400">
                            ₹
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-14 border-white/[0.08] bg-[#0a0a0f] pl-9 text-2xl font-bold text-[#e8e8ed] placeholder:text-[#3a3a4e] focus:border-amber-500/50 focus:ring-amber-500/20"
                          />
                        </div>
                      </div>

                      {/* Category Grid */}
                      <div>
                        <label className="mb-2 block text-xs font-medium text-[#a0a0b8]">
                          Category choose karo
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {EXPENSE_CATEGORIES.map((cat) => (
                            <motion.button
                              key={cat.key}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedCategory(cat.key)}
                              className={cn(
                                'flex flex-col items-center gap-1 rounded-xl border px-2 py-3 transition-all',
                                selectedCategory === cat.key
                                  ? 'border-amber-500/50 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                                  : 'border-white/[0.06] bg-[#0a0a0f] hover:border-white/10',
                              )}
                            >
                              <span className="text-lg">{cat.emoji}</span>
                              <span
                                className={cn(
                                  'text-[11px] font-medium',
                                  selectedCategory === cat.key
                                    ? 'text-amber-300'
                                    : 'text-[#a0a0b8]',
                                )}
                              >
                                {cat.label}
                              </span>
                              {selectedCategory === cat.key && (
                                <span
                                  className="h-1 w-4 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[#a0a0b8]">
                          Description <span className="text-[#5a5a6e]">(optional)</span>
                        </label>
                        <Input
                          placeholder="Kis liye kharcha kiya?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="h-10 border-white/[0.08] bg-[#0a0a0f] text-sm text-[#e8e8ed] placeholder:text-[#3a3a4e] focus:border-amber-500/50 focus:ring-amber-500/20"
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-[#a0a0b8]">
                          Date
                        </label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="h-10 border-white/[0.08] bg-[#0a0a0f] text-sm text-[#e8e8ed] focus:border-amber-500/50 focus:ring-amber-500/20 [color-scheme:dark]"
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        onClick={handleAdd}
                        disabled={!amount || parseFloat(amount) <= 0 || !selectedCategory}
                        className="w-full h-12 text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0a0a0f] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-amber-500/20"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Karo +
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ---- Budget Overview ---- */}
            <motion.div
              key="budget-section"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mb-5"
            >
              <div className="rounded-xl border border-white/[0.06] bg-[#1a1a2e] p-4 space-y-4">
                {/* Budget Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-[#e8e8ed]">
                      Monthly Budget
                    </span>
                  </div>
                  {editingBudget ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-amber-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleBudgetSave();
                          }}
                          className="h-8 w-28 border-white/[0.08] bg-[#0a0a0f] pl-6 text-xs text-[#e8e8ed]"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={handleBudgetSave}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400 transition-colors hover:bg-green-500/30"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startBudgetEdit}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-xs text-[#a0a0b8] transition-colors hover:border-amber-500/30 hover:text-amber-400"
                    >
                      <Pencil className="h-3 w-3" />
                      {monthlyBudget > 0 ? formatINR(monthlyBudget) : 'Set Karo'}
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {monthlyBudget > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#a0a0b8]">
                        {formatINR(totalSpent)} kharcha kiya
                      </span>
                      <span
                        className={cn(
                          'font-medium',
                          budgetPct >= 100
                            ? 'text-red-400'
                            : budgetPct >= 80
                            ? 'text-amber-400'
                            : 'text-green-400',
                        )}
                      >
                        {budgetPct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${budgetPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', budgetBarColor)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#a0a0b8]">
                      <span>₹0</span>
                      <span>{formatINR(monthlyBudget)}</span>
                    </div>
                  </div>
                )}

                {/* Bachat Alert */}
                <AnimatePresence>
                  {showBachatAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2"
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-xs font-medium text-amber-300">
                        Bachat Alert! Budget ka {budgetPct.toFixed(0)}% use ho chuka hai!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/[0.06] bg-[#0a0a0f] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-[#a0a0b8]">
                      Total Spent
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#e8e8ed]">
                      {formatINR(totalSpent)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-[#0a0a0f] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-[#a0a0b8]">
                      Bachat
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-sm font-bold',
                        budgetRemaining >= 0 ? 'text-green-400' : 'text-red-400',
                      )}
                    >
                      {monthlyBudget > 0
                        ? formatINR(Math.abs(budgetRemaining))
                        : '—'}
                    </p>
                    {budgetRemaining < 0 && monthlyBudget > 0 && (
                      <p className="text-[9px] text-red-400">Over budget!</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-[#0a0a0f] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-[#a0a0b8]">
                      Daily Avg
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#e8e8ed]">
                      {formatINR(Math.round(dailyAverage))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ---- Visual Breakdown ---- */}
            {monthExpenses.length > 0 && (
              <motion.div
                key="chart-section"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="mb-5"
              >
                <div className="rounded-xl border border-white/[0.06] bg-[#1a1a2e] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-[#e8e8ed]">
                      Kharcha Breakdown
                    </span>
                  </div>

                  {/* Pie Chart */}
                  <div className="relative mx-auto h-52 w-52 sm:h-60 sm:w-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {pieData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase tracking-wider text-[#a0a0b8]">
                        Total
                      </span>
                      <span className="text-lg font-bold text-[#e8e8ed]">
                        {formatINR(totalSpent)}
                      </span>
                      <span className="text-[10px] text-[#a0a0b8]">is mahine</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-4 space-y-1.5">
                    {pieData.map((d) => {
                      const meta = getCategoryMeta(d.key);
                      return (
                        <div
                          key={d.key}
                          className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.03]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: d.fill }}
                            />
                            <span className="text-sm">
                              {meta.emoji}
                            </span>
                            <span className="text-xs font-medium text-[#e8e8ed]">
                              {d.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-[#e8e8ed]">
                              {formatINR(d.value)}
                            </span>
                            <span className="w-10 text-right text-[11px] text-[#a0a0b8]">
                              {d.percent.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---- Expense List ---- */}
            <motion.div
              key="list-section"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mb-5"
            >
              <button
                onClick={() => setListExpanded((p) => !p)}
                className="mb-3 flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-[#e8e8ed]">
                    Kharche ki List
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#a0a0b8]">
                    {expenses.length}
                  </span>
                </div>
                {listExpanded ? (
                  <ChevronUp className="h-4 w-4 text-[#a0a0b8]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#a0a0b8]" />
                )}
              </button>

              <AnimatePresence>
                {listExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {expenses.length === 0 ? (
                      /* ---- Empty State ---- */
                      <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#1a1a2e] py-10 text-center">
                        <span className="text-5xl">🐷</span>
                        <h3 className="mt-4 text-lg font-bold text-[#e8e8ed]">
                          Koi kharcha nahi? Wah!
                        </h3>
                        <p className="mt-1.5 max-w-xs text-sm text-[#a0a0b8]">
                          Jo expense track karta hai, woh bachat mein aage hai.
                          Apne kharche log karo aur smart bano!
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Har expense add pe 2 coins milte hain!</span>
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/10">
                        {grouped.map((group) => (
                          <div key={group.date}>
                            {/* Date Header */}
                            <div className="mb-2 flex items-center justify-between px-1">
                              <span className="text-xs font-semibold text-[#a0a0b8]">
                                {group.emoji ?? ''} {group.label}
                              </span>
                              <span className="text-xs font-bold text-amber-400">
                                {formatINR(group.total)}
                              </span>
                            </div>

                            {/* Items */}
                            <div className="space-y-1.5">
                              {group.items.map((item) => {
                                const cat = getCategoryMeta(item.category);
                                return (
                                  <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 12 }}
                                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#1a1a2e] px-3 py-2.5 transition-colors hover:border-white/10"
                                  >
                                    {/* Emoji */}
                                    <div
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
                                      style={{ backgroundColor: cat.color + '20' }}
                                    >
                                      {cat.emoji}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                      <p className="truncate text-sm font-medium text-[#e8e8ed]">
                                        {item.description}
                                      </p>
                                      <p className="text-[11px] text-[#a0a0b8]">
                                        {cat.label}
                                      </p>
                                    </div>

                                    {/* Amount */}
                                    <span className="shrink-0 text-sm font-bold text-[#e8e8ed]">
                                      {formatINR(item.amount)}
                                    </span>

                                    {/* Delete */}
                                    <button
                                      onClick={() => handleDelete(item.id)}
                                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#a0a0b8] opacity-0 transition-all hover:bg-red-500/15 hover:text-red-400 group-hover:opacity-100"
                                      aria-label="Delete expense"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ---- Footer note ---- */}
            <motion.div
              key="footer"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex items-center justify-center gap-2 pb-2 pt-2 text-[11px] text-[#5a5a6e]"
            >
              <IndianRupee className="h-3 w-3" />
              <span>RUPAIYA 101 — Smart kharcha, smart bachat</span>
              <Sparkles className="h-3 w-3 text-amber-500/50" />
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
