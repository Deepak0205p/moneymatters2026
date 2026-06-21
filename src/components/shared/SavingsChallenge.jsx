'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Flame, CheckCircle2, Trophy, Star, 
  Zap, ChevronRight, Sparkles, Award 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const CHALLENGE_LIBRARY = [
  {
    id: 'no-swiggy',
    title: 'No Swiggy Week 🍔❌',
    emoji: '🍔❌',
    duration: 7,
    dailyGoal: 200,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 100,
    color: '#EF4444',
    description: '7 din tak Swiggy/Zomato se junk order nahi karna. Simple ghar ka khana best!'
  },
  {
    id: 'chai',
    title: 'Chai se Paisa Challenge ☕💰',
    emoji: '☕💰',
    duration: 14,
    dailyGoal: 30,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 80,
    color: '#92400E',
    description: 'Tapri ki chai ke bajaye ghar pe banao. Daily ₹30 bachat = ₹420 saved in 2 weeks!'
  },
  {
    id: '500-week',
    title: '₹500 Savings Sprint 💵',
    emoji: '💵',
    duration: 7,
    dailyGoal: 72,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 120,
    color: '#F59E0B',
    description: 'Daily ~₹72 save karo — 7 din mein ₹500! Apne pocket balance ko speed up karein.'
  },
  {
    id: 'round-up',
    title: 'Round-Up Ledger 🔄',
    emoji: '🔄',
    duration: 30,
    dailyGoal: 25,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 90,
    color: '#10B981',
    description: 'Har spend ko round up karke safe reserve register karo. Small change, big wealth!'
  },
  {
    id: 'no-impulse',
    title: 'No Impulse Spends 🛒❌',
    emoji: '🛒❌',
    duration: 7,
    dailyGoal: 150,
    difficulty: 'Hard',
    stars: 3,
    rewardCoins: 150,
    color: '#EC4899',
    description: '7 din tak strict NO on e-commerce browsing. Sirf ultimate essentials allowed!'
  }
];

export default function SavingsChallenge({ open, onClose }) {
  const { 
    savingsChallenge, 
    startSavingsChallenge, 
    markSavingsDay, 
    resetSavingsChallenge, 
    addCoins 
  } = useAppStore();

  const [trophies, setTrophies] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(CHALLENGE_LIBRARY[0]);

  const activeTemplate = useMemo(() => {
    if (!savingsChallenge.isActive) return null;
    // Match current state or fallback
    return CHALLENGE_LIBRARY.find(c => c.dailyGoal === savingsChallenge.dailyGoal) || selectedTemplate;
  }, [savingsChallenge.isActive, savingsChallenge.dailyGoal, selectedTemplate]);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayDone = useMemo(() => {
    return savingsChallenge.days.find(d => d.date === today)?.saved;
  }, [savingsChallenge.days, today]);

  const completedDays = useMemo(() => {
    return savingsChallenge.days.filter(d => d.saved).length;
  }, [savingsChallenge.days]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < savingsChallenge.days.length; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const day = savingsChallenge.days.find(dd => dd.date === ds);
      if (day?.saved) streak++;
      else break;
    }
    return streak;
  }, [savingsChallenge.days]);

  const progressPct = useMemo(() => {
    if (!activeTemplate) return 0;
    return Math.min(100, Math.round((completedDays / activeTemplate.duration) * 100));
  }, [completedDays, activeTemplate]);

  const handleStart = (template) => {
    setSelectedTemplate(template);
    startSavingsChallenge(template.dailyGoal);
    toast({
      title: `${template.title} Accepted! 🏁`,
      description: `Target: Daily ₹${template.dailyGoal} save karein for ${template.duration} days.`
    });
  };

  const handleCheckIn = () => {
    if (todayDone || !activeTemplate) return;

    const dayNum = savingsChallenge.days.find(d => d.date === today)?.day || 1;
    markSavingsDay(dayNum, activeTemplate.dailyGoal);
    addCoins(10);

    toast({
      title: "Daily Check-in Complete! +10 Coins 💰",
      description: "Consistency points added to your streak tracker."
    });

    // Check if challenge is fully complete
    if (completedDays + 1 >= activeTemplate.duration) {
      const newTrophy = {
        id: `${activeTemplate.id}-${Date.now()}`,
        title: activeTemplate.title,
        emoji: activeTemplate.emoji,
        date: today,
        rewardCoins: activeTemplate.rewardCoins
      };
      setTrophies(prev => [newTrophy, ...prev]);
      addCoins(activeTemplate.rewardCoins);
      resetSavingsChallenge();

      toast({
        title: `Challenge Smashed! +${activeTemplate.rewardCoins} Coins 🏆✨`,
        description: "Perfect savings challenge completion badge earned!"
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

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
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Bachat Challenge 🐷</h2>
              <p className="text-[10px] text-zinc-400">Micro Savings Habit & Streak Tracker</p>
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
          
          {/* Active Challenge Overview or Empty State */}
          {savingsChallenge.isActive && activeTemplate ? (
            <div className="bg-[#0B0E19] border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden space-y-4">
              <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-500/10 blur-[40px] pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <span className="text-5xl">{activeTemplate.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase">
                      Active Sprint
                    </span>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">{activeTemplate.difficulty}</span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{activeTemplate.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">{activeTemplate.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-zinc-500">Day {completedDays} / {activeTemplate.duration} completed</span>
                  <span className="text-emerald-400">{progressPct}% Done</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Daily Check-in Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleCheckIn}
                  disabled={!!todayDone}
                  className={`w-full sm:flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    todayDone 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed' 
                      : 'bg-emerald-500 text-[#070913] hover:bg-emerald-400'
                  }`}
                >
                  {todayDone ? <CheckCircle2 size={14} /> : <Flame size={14} />}
                  {todayDone ? 'Today checked-in ✓' : 'Aaj Target Save Kiya! (+10 Coins)'}
                </button>
                {savingsChallenge.isActive && (
                  <button 
                    onClick={resetSavingsChallenge}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl border border-red-500/15 text-red-400 hover:bg-red-500/10 text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Give Up
                  </button>
                )}
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 font-bold pt-2 border-t border-white/[0.03]">
                <span>Total Challenge Savings: ₹{savingsChallenge.totalSaved}</span>
                <span>Final Reward: +{activeTemplate.rewardCoins} Coins</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-5 text-center py-10 space-y-4">
              <span className="text-5xl animate-pulse block">🎯</span>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">Accept a Savings Challenge!</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Apne money discipline ko challenge karein. Neeche list se preset accept karein aur daily verification streak log shuru karein.
                </p>
              </div>
            </div>
          )}

          {/* Challenge library grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-amber-400" /> Active Challenge Library
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHALLENGE_LIBRARY.map(t => {
                const isActive = savingsChallenge.isActive && activeTemplate?.id === t.id;
                return (
                  <div key={t.id} className="p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04] flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-[30px] opacity-10" style={{ backgroundColor: t.color }} />
                    
                    <div className="flex items-start justify-between">
                      <span className="text-3xl bg-white/5 p-1 rounded-xl">{t.emoji}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={9} 
                            className={i < t.stars ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 mt-2">
                      <span className="text-[10px] font-black text-white block">{t.title}</span>
                      <span className="text-[9px] text-zinc-500 block leading-tight line-clamp-2">{t.description}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.03]">
                      <span className="text-[9px] text-zinc-400 font-bold">
                        ⏱️ {t.duration} Days · +{t.rewardCoins} Coins
                      </span>
                      <button
                        onClick={() => handleStart(t)}
                        disabled={savingsChallenge.isActive}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                          isActive 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : savingsChallenge.isActive 
                              ? 'bg-white/5 border-transparent text-zinc-600 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-emerald-500 hover:text-black hover:border-transparent'
                        }`}
                      >
                        {isActive ? 'Active' : 'Start'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trophy Wall */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Trophy size={13} className="text-amber-400" /> Completed Achievements Wall
            </h4>

            {trophies.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs bg-[#05070F] border border-white/[0.03] rounded-3xl">
                🏆 Abhi tak koi challenge complete nahi hua. Accept now and win trophy shields!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trophies.map(tr => (
                  <div key={tr.id} className="p-3.5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/20 text-center space-y-1.5">
                    <span className="text-3xl block">{tr.emoji}</span>
                    <span className="text-[10px] font-black text-white block truncate">{tr.title}</span>
                    <span className="text-[9px] text-amber-400 font-black block">+{tr.rewardCoins} Coins Won</span>
                    <span className="text-[8px] text-zinc-500 font-bold block">{tr.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Bachat Challenge — streaks reset on skipped check-ins
          </p>
        </div>
      </motion.div>
    </div>
  );
}