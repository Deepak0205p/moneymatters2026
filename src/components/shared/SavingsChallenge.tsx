"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Flame, CheckCircle2, Trophy, Star, Zap, RotateCcw, ChevronRight, Sparkles, Plus,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
interface SavingsChallengeProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Challenge Library — relatable to Indian youth
   ────────────────────────────────────────────────────────────── */
interface ChallengeTemplate {
  id: string;
  title: string;
  emoji: string;
  duration: number; // days
  dailyGoal: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  stars: number;
  rewardCoins: number;
  color: string;
  description: string;
}

const CHALLENGE_LIBRARY: ChallengeTemplate[] = [
  {
    id: 'no-swiggy',
    title: 'No Swiggy Week',
    emoji: '🍔❌',
    duration: 7,
    dailyGoal: 200,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 100,
    color: '#EF4444',
    description: '7 din tak Swiggy/Zomato se khana order nahi karna. Ghar ka khana = best!',
  },
  {
    id: 'chai',
    title: 'Chai se Paisa Challenge',
    emoji: '☕💰',
    duration: 14,
    dailyGoal: 30,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 80,
    color: '#92400E',
    description: 'Tapri ki chai band, ghar pe banao. Roz ₹30 bachao = ₹420 in 14 din!',
  },
  {
    id: '500-week',
    title: '₹500 Bachat Week',
    emoji: '💵',
    duration: 7,
    dailyGoal: 71,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 120,
    color: '#F59E0B',
    description: 'Roz ~₹71 bachao — 7 din mein ₹500! Matlab ek full weekend trip fund!',
  },
  {
    id: '52-week',
    title: '52 Week Saving Challenge',
    emoji: '📅',
    duration: 30, // showing 30 days at a time
    dailyGoal: 50,
    difficulty: 'Hard',
    stars: 3,
    rewardCoins: 500,
    color: '#8B5CF6',
    description: 'Hafte 1: ₹10, Hafte 2: ₹20... aise badhate jao. Total ₹13,780 in 52 weeks!',
  },
  {
    id: 'round-up',
    title: 'Round-Up Savings',
    emoji: '🔄',
    duration: 30,
    dailyGoal: 25,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 90,
    color: '#10B981',
    description: 'Har kharcha ko round up karo — ₹92 ki cheez pe ₹100 do, ₹8 bachao. Magic!',
  },
  {
    id: 'no-impulse',
    title: 'No Impulse Buy',
    emoji: '🛒❌',
    duration: 7,
    dailyGoal: 150,
    difficulty: 'Hard',
    stars: 3,
    rewardCoins: 150,
    color: '#EC4899',
    description: '7 din — koi bhi non-essential cheez mat kharido. Sirf zaroori cheezein!',
  },
];

/* ──────────────────────────────────────────────────────────────
   Trophy wall — completed challenges
   ────────────────────────────────────────────────────────────── */
interface Trophy {
  id: string;
  title: string;
  emoji: string;
  date: string;
  rewardCoins: number;
}

function TrophyWall({ trophies }: { trophies: Trophy[] }) {
  if (trophies.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 glass-card p-6 text-center">
        <div className="text-4xl mb-2 opacity-40">🏆</div>
        <p className="text-sm text-ink-muted">Abhi koi challenge complete nahi. Pehla trophy kamao! 🎯</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <AnimatePresence>
        {trophies.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className="relative rounded-2xl border border-gold/30 bg-gold/5 p-3 text-center"
          >
            <div className="text-3xl mb-1">{t.emoji}</div>
            <p className="text-xs font-bold text-white truncate">{t.title}</p>
            <p className="text-[10px] text-gold-soft mt-0.5">+{t.rewardCoins} coins</p>
            <p className="text-[9px] text-ink-muted mt-0.5">{t.date}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Active Challenge Card — flame grows with streak
   ────────────────────────────────────────────────────────────── */
function ActiveChallengeCard({
  template, onComplete,
}: {
  template: ChallengeTemplate;
  onComplete: (t: Trophy) => void;
}) {
  const { savingsChallenge, markSavingsDay, addCoins } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const todayDone = savingsChallenge.days.find((d) => d.date === today)?.saved;

  const completedDays = savingsChallenge.days.filter((d) => d.saved).length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < savingsChallenge.days.length; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const day = savingsChallenge.days.find((dd) => dd.date === ds);
      if (day?.saved) streak++;
      else break;
    }
    return streak;
  }, [savingsChallenge.days]);

  const pct = Math.min(100, Math.round((completedDays / template.duration) * 100));
  const flameSize = 36 + Math.min(28, currentStreak * 4);

  const handleCheckIn = useCallback(() => {
    if (todayDone) return;
    markSavingsDay(savingsChallenge.days.find((d) => d.date === today)?.day ?? 1, template.dailyGoal);
    addCoins(5);
    if (completedDays + 1 >= template.duration) {
      onComplete({
        id: `${template.id}-${Date.now()}`,
        title: template.title,
        emoji: template.emoji,
        date: today,
        rewardCoins: template.rewardCoins,
      });
      addCoins(template.rewardCoins);
    }
  }, [todayDone, markSavingsDay, savingsChallenge.days, today, template, completedDays, addCoins, onComplete]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald/30 glass-card-glow p-5">
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: template.color }} />
      <div className="relative">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl flex-shrink-0"
          >
            {template.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald/15 border border-emerald/30 text-[9px] font-bold text-emerald-soft uppercase">Active</span>
              <span className="text-[10px] font-bold text-ink-muted">{template.difficulty}</span>
            </div>
            <h3 className="font-display text-lg font-extrabold text-white">{template.title}</h3>
            <p className="text-[11px] text-ink-muted mt-1">{template.description}</p>
          </div>
        </div>

        {/* Day counter + flame */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Day Progress</p>
            <p className="font-display text-3xl font-extrabold text-white">
              Day {completedDays}<span className="text-base text-ink-muted">/{template.duration}</span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ scale: [1, 1.1 + currentStreak * 0.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: `${flameSize}px`, lineHeight: 1, filter: `drop-shadow(0 0 12px rgba(239,68,68,${0.4 + currentStreak * 0.05}))` }}
            >
              🔥
            </motion.div>
            <p className="text-[10px] font-bold text-red-400 mt-1">{currentStreak}x Streak</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${template.color}, #34D399)` }}
          />
        </div>

        {/* Daily check-in button */}
        <motion.button
          whileHover={{ scale: todayDone ? 1 : 1.02 }}
          whileTap={{ scale: todayDone ? 1 : 0.98 }}
          onClick={handleCheckIn}
          disabled={!!todayDone}
          className={`mt-4 w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 ${
            todayDone
              ? 'bg-emerald/15 text-emerald-soft border border-emerald/30 cursor-not-allowed'
              : 'btn-3d text-midnight'
          }`}
          style={!todayDone ? { background: 'linear-gradient(135deg, #34D399, #10B981)' } : {}}
        >
          {todayDone ? (
            <><CheckCircle2 size={16} /> Aaj Control Kiya! ✅</>
          ) : (
            <><Flame size={16} /> Aaj Control Kiya? +5 Coins ✅</>
          )}
        </motion.button>

        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-ink-muted">Total Saved: <span className="font-bold text-emerald-soft">₹{savingsChallenge.totalSaved}</span></span>
          <span className="text-gold-soft font-bold">Reward: +{template.rewardCoins} coins 🪙</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Library Card
   ────────────────────────────────────────────────────────────── */
function LibraryCard({
  template, isActive, onStart,
}: {
  template: ChallengeTemplate;
  isActive: boolean;
  onStart: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative flex-shrink-0 w-64 rounded-2xl border border-white/10 glass-card p-4 overflow-hidden"
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-30" style={{ backgroundColor: template.color }} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="text-4xl">{template.emoji}</div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={10}
                  className={s <= template.stars ? 'text-gold-soft' : 'text-white/15'}
                  fill={s <= template.stars ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-ink-muted">{template.difficulty}</span>
          </div>
        </div>

        <h4 className="font-display text-sm font-bold text-white mt-2">{template.title}</h4>
        <p className="text-[10px] text-ink-muted mt-1 leading-relaxed line-clamp-2">{template.description}</p>

        <div className="mt-3 flex items-center gap-3 text-[10px] text-ink-muted">
          <span className="flex items-center gap-1"><Zap size={10} className="text-emerald-soft" /> {template.duration} din</span>
          <span className="flex items-center gap-1"><Trophy size={10} className="text-gold-soft" /> {template.rewardCoins} coins</span>
        </div>

        <button
          onClick={onStart}
          disabled={isActive}
          className={`mt-3 w-full rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            isActive
              ? 'bg-white/5 text-ink-muted cursor-not-allowed'
              : 'bg-emerald/15 border border-emerald/30 text-emerald-soft hover:bg-emerald/25'
          }`}
        >
          {isActive ? 'Already Active' : <>Start Karo <ChevronRight size={12} /></>}
        </button>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function SavingsChallenge({ open, onClose }: SavingsChallengeProps) {
  const { savingsChallenge, startSavingsChallenge, resetSavingsChallenge } = useAppStore();
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);

  // Derive active template directly from store state — no effect needed
  const activeTemplate = savingsChallenge.isActive
    ? (selectedTemplate ?? CHALLENGE_LIBRARY[0])
    : null;

  const handleStart = useCallback((template: ChallengeTemplate) => {
    startSavingsChallenge(template.dailyGoal);
    setSelectedTemplate(template);
  }, [startSavingsChallenge]);

  const handleComplete = useCallback((trophy: Trophy) => {
    setTrophies((prev) => [...prev, trophy]);
    // Reset the challenge in store so the UI returns to library view
    resetSavingsChallenge();
  }, [resetSavingsChallenge]);

  // Dummy leaderboard rank
  const rank = 42;
  const totalChallengers = 500;

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
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
              <Flame size={20} className="text-midnight" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Bachat Ki Challenge 🔥</h2>
              <p className="text-xs text-ink-muted mt-0.5">Roz control karo, streak banao, coins jeeto!</p>
            </div>
          </div>

          {/* Leaderboard strip */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-2xl">🏅</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Tumhari Rank</p>
              <p className="font-display text-lg font-extrabold text-white">
                #{rank} <span className="text-xs text-ink-muted font-normal">of {totalChallengers} challengers</span>
              </p>
            </div>
            <span className="text-[10px] font-bold text-gold-soft">Top 10% mein! 🎯</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto space-y-4">
          {/* Active challenge OR call to action */}
          {activeTemplate && savingsChallenge.isActive ? (
            <ActiveChallengeCard
              template={activeTemplate}
              onComplete={handleComplete}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl border border-emerald/20 glass-card-glow p-6 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-3"
              >
                🎯
              </motion.div>
              <h3 className="font-display text-xl font-extrabold heading-gradient mb-2">
                Challenge Accept Karo!
              </h3>
              <p className="text-sm text-ink-muted max-w-sm mx-auto mb-4">
                Neeche se koi challenge choose karo aur apni bachat journey shuru karo! Pehla step sabse zaroori hai 💪
              </p>
            </motion.div>
          )}

          {/* Challenge Library — horizontal scroll */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles size={12} className="text-ai" /> Challenge Library
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
              {CHALLENGE_LIBRARY.map((t) => (
                <LibraryCard
                  key={t.id}
                  template={t}
                  isActive={savingsChallenge.isActive && activeTemplate?.id === t.id}
                  onStart={() => handleStart(t)}
                />
              ))}
            </div>
          </div>

          {/* Trophy Wall */}
          <div>
            <p className="text-xs font-bold text-gold-soft uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy size={12} /> Trophy Wall
            </p>
            <TrophyWall trophies={trophies} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
