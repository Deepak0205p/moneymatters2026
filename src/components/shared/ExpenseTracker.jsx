'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, IndianRupee, TrendingDown, 
  Wallet, Calendar, AlertTriangle, CheckCircle, Sparkles 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const CATEGORIES = [
  { key: 'food', label: 'Food 🍔', emoji: '🍔', color: '#F59E0B' },
  { key: 'transport', label: 'Transport 🚗', emoji: '🚗', color: '#3B82F6' },
  { key: 'entertainment', label: 'Entertainment 🎬', emoji: '🎬', color: '#A855F7' },
  { key: 'education', label: 'Education 📚', emoji: '📚', color: '#10B981' },
  { key: 'shopping', label: 'Shopping 👕', emoji: '👕', color: '#EC4899' },
  { key: 'chai', label: 'Snacks / Chai ☕', emoji: '☕', color: '#92400E' },
  { key: 'bills', label: 'Utility Bills 📱', emoji: '📱', color: '#EF4444' },
  { key: 'health', label: 'Medical / Gym 💊', emoji: '💊', color: '#06B6D4' }
];

const getCat = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[0];
const todayStr = () => new Date().toISOString().split('T')[0];

export default function ExpenseTracker({ open, onClose }) {
  const { expenses, addExpense, deleteExpense, monthlyBudget, setMonthlyBudget, addCoins } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // Form states for adding expense
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('want'); // need | want

  useEffect(() => {
    setBudgetInput(monthlyBudget > 0 ? String(monthlyBudget) : '');
  }, [monthlyBudget, open]);

  const todayExpenses = useMemo(() => {
    return expenses.filter(e => e.date === todayStr());
  }, [expenses]);

  const todaySpent = useMemo(() => {
    return todayExpenses.reduce((a, b) => a + b.amount, 0);
  }, [todayExpenses]);

  const dailyBudget = useMemo(() => {
    return monthlyBudget > 0 ? Math.round(monthlyBudget / 30) : 0;
  }, [monthlyBudget]);

  const grouped = useMemo(() => {
    const map = new Map();
    expenses.slice(0, 50).forEach(e => {
      const arr = map.get(e.date) || [];
      arr.push(e);
      map.set(e.date, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  const saveBudget = () => {
    const n = parseInt(budgetInput, 10);
    setMonthlyBudget(n > 0 ? n : 0);
  };

  const handleAddExpense = () => {
    const amtNum = parseInt(amount, 10);
    if (!amtNum || amtNum <= 0) return;

    addExpense({
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount: amtNum,
      category,
      description: description.trim() || getCat(category).label.split(' ')[0],
      date: todayStr(),
      type, // need vs want
      createdAt: Date.now()
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setCategory('food');
    setType('want');
    setAddOpen(false);

    addCoins(2);
    toast({
      title: "Expense added! +2 Coins 💸",
      description: "Smart monitoring keeps budget healthy."
    });
  };

  const totalMonthlySpent = useMemo(() => {
    return expenses.reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  // Last 7 days chart compilation
  const chartDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const sum = expenses
        .filter(e => e.date === dateStr)
        .reduce((a, b) => a + b.amount, 0);
      days.push({
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        total: sum,
        isToday: i === 0
      });
    }
    return days;
  }, [expenses]);

  const maxChartVal = useMemo(() => {
    return Math.max(...chartDays.map(d => d.total), 500);
  }, [chartDays]);

  const breakdownData = useMemo(() => {
    const map = new Map();
    expenses.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });
    return Array.from(map.entries())
      .map(([key, total]) => ({ meta: getCat(key), total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

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
        className="relative z-10 w-full max-w-2xl bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop header */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Wallet size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Kharcha Spy 🕵️‍♂️</h2>
              <p className="text-[10px] text-zinc-400">Smart Expense Tracker & Budget Auditor</p>
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
          
          {/* Daily limit gauge card */}
          <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="text-emerald-400" size={24} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">Today's Spends</span>
                <p className="text-xl font-black text-white">
                  ₹{todaySpent.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-zinc-500 font-bold">
                    / {dailyBudget > 0 ? `₹${dailyBudget.toLocaleString('en-IN')}` : 'No Daily Limit'}
                  </span>
                </p>
              </div>
            </div>

            {/* Alert status or budget tracking indicator */}
            {dailyBudget > 0 && (
              <div className="shrink-0">
                {todaySpent > dailyBudget ? (
                  <span className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> Limit Crossed!
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle size={12} /> Safe Zone
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick set monthly limit */}
          <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-4 flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 ml-2">Monthly Budget:</span>
            <input 
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={saveBudget}
              placeholder="Set limit (e.g. 15000)"
              className="bg-transparent border-none text-white text-xs font-black placeholder:text-zinc-600 focus:outline-none flex-1 py-1"
            />
            {dailyBudget > 0 && (
              <span className="text-[10px] text-zinc-500 font-black tracking-wider uppercase bg-white/5 px-2.5 py-1 rounded">
                ≈ ₹{dailyBudget}/day limit
              </span>
            )}
          </div>

          {/* Last 7 Days Visual Chart */}
          <div className="bg-[#05070F] border border-white/[0.03] rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-400" /> Spends over last 7 days
            </h3>
            <div className="flex items-end justify-between gap-3 h-28 pt-4">
              {chartDays.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                  <div className="flex-1 w-full flex items-end">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        day.isToday 
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/10' 
                          : 'bg-white/10 hover:bg-white/15'
                      }`}
                      style={{ 
                        height: `${Math.max(4, (day.total / maxChartVal) * 100)}%` 
                      }}
                      title={`₹${day.total}`}
                    />
                  </div>
                  <span className={`text-[9px] font-black ${day.isToday ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add expense toggler & form */}
          <div className="border border-white/[0.04] rounded-3xl overflow-hidden bg-[#0B0E19]">
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="w-full p-4 flex items-center justify-between text-xs font-black uppercase text-white bg-[#0F1326] border-b border-white/[0.03]"
            >
              <span>➕ Add New Expense</span>
              <span>{addOpen ? 'Hide Form' : 'Show Form'}</span>
            </button>

            {addOpen && (
              <div className="p-5 space-y-4">
                {/* Categories Cloud */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Choose Category</span>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.key}
                        onClick={() => setCategory(c.key)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          category === c.key 
                            ? 'bg-white/10 border-white/20' 
                            : 'bg-[#05070F] border-transparent text-zinc-500 hover:text-white'
                        }`}
                        style={category === c.key ? { borderColor: c.color } : {}}
                      >
                        <span className="text-xl block">{c.emoji}</span>
                        <span className="text-[8px] font-black block mt-0.5">{c.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Amount (₹)</span>
                    <div className="relative">
                      <IndianRupee size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#05070F] border border-white/5 text-xs font-black text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Note (Optional)</span>
                    <input 
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Uber ride, dinner"
                      className="w-full px-3 py-2 rounded-xl bg-[#05070F] border border-white/5 text-xs font-black text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                {/* Need vs Want toggle */}
                <div className="flex items-center justify-between bg-[#05070F] p-3 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-zinc-400">Expense priority category:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setType('need')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                        type === 'need' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      😇 Zaroorat
                    </button>
                    <button 
                      onClick={() => setType('want')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                        type === 'want' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      😎 Shauq
                    </button>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={handleAddExpense}
                  disabled={!amount || parseInt(amount, 10) <= 0}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-xs font-black uppercase tracking-wider disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Confirm Expense Spends
                </button>
              </div>
            )}
          </div>

          {/* Breakdown bars */}
          {breakdownData.length > 0 && (
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Breakdown By Category</h4>
              <div className="space-y-3">
                {breakdownData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-white">{item.meta.label}</span>
                      <span className="text-zinc-400">₹{item.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: item.meta.color, 
                          width: `${(item.total / totalMonthlySpent) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent list */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              Recent Spends Log (Swipe left or click trash to delete)
            </h4>

            {expenses.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs bg-[#0B0E19] border border-white/[0.04] rounded-3xl">
                🤷‍♂️ Koi expenses logs available nahi hai. Add custom items now.
              </div>
            ) : (
              <div className="space-y-3">
                {grouped.map(([date, items]) => (
                  <div key={date} className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">
                      {date} · Total: ₹{items.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
                    </span>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {items.map(e => {
                          const meta = getCat(e.category);
                          return (
                            <motion.div
                              key={e.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              className="p-3.5 rounded-2xl bg-[#0B0E19] border border-white/[0.04] flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl bg-white/5 p-1 rounded-lg">{meta.emoji}</span>
                                <div>
                                  <span className="text-xs font-extrabold text-white block">{e.description}</span>
                                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    e.type === 'need' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    {e.type === 'need' ? 'Zaroorat' : 'Shauq'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white">
                                  ₹{e.amount.toLocaleString('en-IN')}
                                </span>
                                <button
                                  onClick={() => deleteExpense(e.id)}
                                  className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-5 py-3 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/[0.05]"
          >
            Close
          </button>
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Kharcha Spy — track limits wisely
          </p>
        </div>
      </motion.div>
    </div>
  );
}