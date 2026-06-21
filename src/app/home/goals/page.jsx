'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Target, Plus, Trash2, TrendingUp, Calendar, IndianRupee, 
  Sparkles, Trophy, Award, Rocket, ChevronRight, ArrowLeft,
  CheckCircle2, Clock, Zap
} from 'lucide-react';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const GOAL_TEMPLATES = [
  { id: 'bike', label: 'Pehli Bike 🏍️', emoji: '🏍️', target: 120000, color: '#EF4444', hint: 'Daily ₹150 bachao. 3 cup chai skip karo!' },
  { id: 'phone', label: 'New Phone 📱', emoji: '📱', target: 30000, color: '#8B5CF6', hint: 'Daily ₹80 bachao. 1 saal mein naya phone ready!' },
  { id: 'trip', label: 'Goa Trip ✈️', emoji: '✈️', target: 20000, color: '#10B981', hint: 'Daily ₹60 bachao. 10 mahine mein fun trip ready!' },
  { id: 'emergency', label: 'Emergency Fund 🛡️', emoji: '🛡️', target: 50000, color: '#F59E0B', hint: '3 months survival secure. Daily ₹140 savings target.' },
  { id: 'laptop', label: 'Work Laptop 💻', emoji: '💻', target: 60000, color: '#06B6D4', hint: 'Daily ₹180 savings or small freelance side income.' },
  { id: 'custom', label: 'Custom Goal ✏️', emoji: '🎯', target: 10000, color: '#EC4899', hint: 'Apna customized financial target set karein.' }
];

function daysRemaining(deadline) {
  if (!deadline) return 180;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return 180;
  const today = new Date();
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  return Math.max(1, Math.ceil((d.getTime() - today.getTime()) / 86400000));
}

export default function GoalsPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const { goals, addGoal, updateGoalSaved, deleteGoal, addCoins, isAuthenticated } = useAppStore();
  
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [quickSaveAmount, setQuickSaveAmount] = useState({});

  const activeGoals = useMemo(() => goals.filter(g => g.saved < g.target), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.saved >= g.target), [goals]);
  const totalSaved = useMemo(() => goals.reduce((acc, g) => acc + g.saved, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((acc, g) => acc + g.target, 0), [goals]);
  const totalProgress = useMemo(() => {
    if (totalTarget <= 0) return 0;
    return Math.round((totalSaved / totalTarget) * 100);
  }, [totalSaved, totalTarget]);

  const handleSelectTemplate = (t) => {
    setSelectedTemplate(t);
    setName(t.label.replace(/^[^ ]+ /, ''));
    setTarget(String(t.target));
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setDeadline(d.toISOString().split('T')[0]);
  };

  const handleAddGoal = () => {
    if (!selectedTemplate) return;
    const finalTarget = parseInt(target, 10) || selectedTemplate.target;
    
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || selectedTemplate.label.split(' ')[1] || 'My Goal',
      target: finalTarget,
      saved: 0,
      deadline: deadline || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category: selectedTemplate.color,
      emoji: selectedTemplate.emoji,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addGoal(newGoal);
    addCoins(10);
    
    // Reset form
    setSelectedTemplate(null);
    setName('');
    setTarget('');
    setDeadline('');
    setAddOpen(false);

    toast({
      title: "Goal created! +10 Coins 🎯",
      description: "Ab apna roadmap dekho aur save shuru karo!"
    });

    // Navigate to roadmap page
    setTimeout(() => router.push(`/home/goals/${newGoal.id}/roadmap`), 500);
  };

  const handleAddSavings = (goalId, goalSaved, goalTarget) => {
    const amtStr = quickSaveAmount[goalId] || '';
    const amt = parseInt(amtStr, 10);
    if (!amt || amt <= 0) return;

    const newSaved = goalSaved + amt;
    updateGoalSaved(goalId, amt);
    setQuickSaveAmount(prev => ({ ...prev, [goalId]: '' }));

    if (newSaved >= goalTarget) {
      addCoins(50);
      toast({
        title: "Goal Completed! +50 Coins 🏆✨",
        description: "Incredible savings commitment!"
      });
    } else {
      addCoins(5);
      toast({
        title: `Saved ₹${amt.toLocaleString('en-IN')}! +5 Coins 💰`,
        description: "Consistency leads to success."
      });
    }
  };

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090D1A]">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-3">
            <Target className="text-emerald-400" size={28} />
            Your Goals
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Financial goals set karo aur AI-powered roadmap se achieve karo
          </p>
        </div>
        <button
          onClick={() => setAddOpen(!addOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-xs font-black uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <Plus size={16} />
          Naya Goal
        </button>
      </div>



      {/* Add Goal Form */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-white/[0.06] rounded-3xl overflow-hidden bg-[#0B0E19]"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                Choose Goal Preset
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOAL_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTemplate(t)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTemplate?.id === t.id 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-[#05070F] border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                    style={selectedTemplate?.id === t.id ? { borderColor: t.color } : {}}
                  >
                    <span className="text-3xl block">{t.emoji}</span>
                    <span className="text-xs font-extrabold text-white block mt-2">{t.label}</span>
                    <span className="text-[10px] text-zinc-500 font-black block mt-1">₹{t.target.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2"
                >
                  <Sparkles size={14} className="shrink-0 mt-0.5" />
                  <span>{selectedTemplate.hint}</span>
                </motion.div>
              )}

              {selectedTemplate && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Goal Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My Dream Bike"
                      className="w-full px-4 py-3 rounded-xl bg-[#05070F] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Target Fund (₹)</label>
                      <input 
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full px-4 py-3 rounded-xl bg-[#05070F] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Target Date</label>
                      <input 
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#05070F] border border-white/5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddGoal}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                  >
                    <Rocket size={16} />
                    Create Goal & View Roadmap
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 && !addOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-[#0B0E19] border border-white/[0.04] rounded-3xl space-y-4"
        >
          <div className="text-6xl">🎯</div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">Koi goals set nahi hain!</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Apna pehla financial goal set karo aur AI-powered roadmap se achieve karo. 
              "Naya Goal" button pe click karo!
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-sm font-black uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Pehla Goal Set Karo
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" /> Active Goals ({activeGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((g, i) => {
                  const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                  const remaining = Math.max(0, g.target - g.saved);
                  const days = daysRemaining(g.deadline);
                  const dailyRate = Math.ceil(remaining / days);

                  return (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-3xl bg-[#0B0E19] border border-white/[0.06] hover:border-white/[0.1] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                            style={{ backgroundColor: `${g.category}15`, border: `1px solid ${g.category}25` }}
                          >
                            {g.emoji}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-white">{g.name}</h4>
                            <span className="text-[10px] text-zinc-500 font-bold">
                              Target: ₹{g.target.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/home/goals/${g.id}/roadmap`)}
                            className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                            title="View Roadmap"
                          >
                            <Rocket size={14} />
                          </button>
                          <button
                            onClick={() => deleteGoal(g.id)}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                          <span className="text-zinc-500">Saved: ₹{g.saved.toLocaleString('en-IN')}</span>
                          <span style={{ color: g.category }}>{pct}% complete</span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: g.category }}
                          />
                        </div>
                      </div>

                      {/* Quick Save */}
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="number"
                          placeholder="Add money (₹)"
                          value={quickSaveAmount[g.id] || ''}
                          onChange={(e) => setQuickSaveAmount(prev => ({ ...prev, [g.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#05070F] border border-white/5 text-[11px] font-bold text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddSavings(g.id, g.saved, g.target)}
                          className="px-4 py-2 rounded-xl text-[10px] font-black text-[#070913] cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: g.category }}
                        >
                          Deposit
                        </button>
                      </div>

                      {/* Daily rate */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Zap size={10} />
                          Roz ₹{dailyRate} bachao toh {days} din mein done!
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <Calendar size={10} />
                          {days} days left
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" /> Completed Dreams ({completedGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
                          {g.emoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{g.name}</h4>
                          <span className="text-[10px] text-emerald-400 font-bold">100% Achieved!</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/home/goals/${g.id}/roadmap`)}
                          className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                          title="View Roadmap"
                        >
                          <Award size={14} />
                        </button>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-3">
                      <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Completed!</span>
                      <span>₹{g.target.toLocaleString('en-IN')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}