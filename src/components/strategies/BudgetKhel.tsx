"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { RotateCcw, Trophy, Heart, Lightbulb, Check, ArrowRight } from 'lucide-react';

type Choice = 'need' | 'want';

interface ExpenseCard {
  id: number;
  name: string;
  amount: number;
  emoji: string;
  systemChoice: Choice; // what financial experts say
  note?: string;
}

const CARDS: ExpenseCard[] = [
  { id: 1, name: 'Monthly Rent', amount: 8000, emoji: '🏠', systemChoice: 'need' },
  { id: 2, name: 'Groceries / Sabzi', amount: 3000, emoji: '🥬', systemChoice: 'need' },
  { id: 3, name: 'Electricity Bill', amount: 1200, emoji: '⚡', systemChoice: 'need' },
  { id: 4, name: 'Netflix Subscription', amount: 649, emoji: '📺', systemChoice: 'want' },
  { id: 5, name: 'Gym Membership', amount: 1500, emoji: '💪', systemChoice: 'want' },
  { id: 6, name: 'Chai Tapri (₹30/day)', amount: 900, emoji: '☕', systemChoice: 'want', note: '₹30 × 30 din' },
  { id: 7, name: 'iPhone EMI', amount: 3000, emoji: '📱', systemChoice: 'want', note: 'Ya cash kharido?' },
  { id: 8, name: 'Mobile Recharge', amount: 299, emoji: '📲', systemChoice: 'need' },
  { id: 9, name: 'Swiggy/Zomato', amount: 2500, emoji: '🛵', systemChoice: 'want', note: 'Khana banao to free!' },
  { id: 10, name: 'Petrol / Travel', amount: 2000, emoji: '⛽', systemChoice: 'need' },
  { id: 11, name: 'Movie Tickets', amount: 500, emoji: '🎬', systemChoice: 'want' },
  { id: 12, name: 'Doctor Visit', amount: 800, emoji: '🏥', systemChoice: 'need' },
  { id: 13, name: 'Branded Clothes', amount: 2000, emoji: '👕', systemChoice: 'want', note: 'Local bhi chal jayega' },
  { id: 14, name: 'EMI for Old Loan', amount: 2500, emoji: '📃', systemChoice: 'need', note: 'Pehle khatam karo' },
  { id: 15, name: 'Friend Birthday Party', amount: 1000, emoji: '🎂', systemChoice: 'want' },
  { id: 16, name: 'Books / Online Course', amount: 700, emoji: '📚', systemChoice: 'need', note: 'Investment in self' },
  { id: 17, name: 'Smokes / Cold Drink', amount: 1200, emoji: '🚬', systemChoice: 'want', note: 'Health + paisa dono waste' },
  { id: 18, name: 'Internet Bill', amount: 800, emoji: '🌐', systemChoice: 'need' },
];

function formatINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function BudgetKhel() {
  const { addCoins } = useAppStore();
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [phase, setPhase] = useState<'play' | 'summary'>('play');
  const [exitDir, setExitDir] = useState<Choice | null>(null);

  const makeChoice = (choice: Choice) => {
    if (exitDir) return;
    setExitDir(choice);
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    setTimeout(() => {
      if (index + 1 < CARDS.length) {
        setIndex(index + 1);
      } else {
        setPhase('summary');
        addCoins(30);
      }
      setExitDir(null);
    }, 350);
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x > 100) makeChoice('need');
    else if (info.offset.x < -100) makeChoice('want');
  };

  const card = CARDS[index];
  const progress = Math.round((index / CARDS.length) * 100);

  // Summary stats
  const userNeeds = choices.filter((c) => c === 'need').length;
  const userWants = choices.filter((c) => c === 'want').length;
  const needPct = Math.round((userNeeds / CARDS.length) * 100);
  const wantPct = Math.round((userWants / CARDS.length) * 100);
  // Money split
  const totalNeeds = choices.reduce((sum, c, i) => (c === 'need' ? sum + CARDS[i].amount : sum), 0);
  const totalWants = choices.reduce((sum, c, i) => (c === 'want' ? sum + CARDS[i].amount : sum), 0);
  const totalAmt = totalNeeds + totalWants || 1;
  const needMoneyPct = Math.round((totalNeeds / totalAmt) * 100);
  const wantMoneyPct = 100 - needMoneyPct;

  // 50-30-20 rule: 50% needs, 30% wants, 20% savings
  const needDeviation = Math.abs(needMoneyPct - 50);
  const wantDeviation = Math.abs(wantMoneyPct - 30);
  const budgetScore = Math.max(0, 100 - (needDeviation + wantDeviation) * 1.5);

  const reset = () => {
    setChoices([]);
    setIndex(0);
    setPhase('play');
    setExitDir(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="text-gold" size={26} />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">Budget Khel</h2>
        </div>
        <p className="text-sm text-ink-muted font-medium">
          Tinder-style swipe game — Har kharcha NEED hai ya WANT? 👉👈
        </p>
      </div>

      {phase === 'play' ? (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted whitespace-nowrap">{index + 1}/{CARDS.length}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-gold-gradient"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Hint legend */}
          <div className="flex justify-between text-[11px] font-medium">
            <span className="flex items-center gap-1 text-gold">
              <ArrowRight className="rotate-180" size={14} /> Swipe Left = WANT 💡
            </span>
            <span className="flex items-center gap-1 text-emerald">
              Swipe Right = NEED ✓ <ArrowRight size={14} />
            </span>
          </div>

          {/* Swipe card stack */}
          <div className="relative h-[340px] sm:h-[360px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={card.id}
                className="absolute w-full max-w-sm"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  x: exitDir === 'need' ? 350 : exitDir === 'want' ? -350 : 0,
                  opacity: 0,
                  rotate: exitDir === 'need' ? 25 : exitDir === 'want' ? -25 : 0,
                  transition: { duration: 0.35 },
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <div
                  className="glass-card-premium rounded-3xl p-7 sm:p-8 text-center relative overflow-hidden"
                  style={{
                    boxShadow:
                      exitDir === 'need'
                        ? '0 0 50px rgba(16,185,129,0.5)'
                        : exitDir === 'want'
                        ? '0 0 50px rgba(245,158,11,0.5)'
                        : '0 12px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Swipe flash overlays */}
                  <AnimatePresence>
                    {exitDir === 'need' && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-emerald/20 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-4xl font-display font-bold text-emerald">NEED ✓</div>
                      </motion.div>
                    )}
                    {exitDir === 'want' && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gold/20 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-4xl font-display font-bold text-gold">WANT 💡</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="text-7xl mb-3 inline-block"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {card.emoji}
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-ink leading-tight mb-1">
                    {card.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold mb-2">
                    {formatINR(card.amount)}
                  </p>
                  {card.note && (
                    <p className="text-[11px] text-ink-muted italic mb-2">{card.note}</p>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">
                      Swipe karo 👉
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tap buttons (mobile-friendly fallback) */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <motion.button
              onClick={() => makeChoice('want')}
              className="py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 border"
              style={{ background: 'rgba(245,158,11,0.10)', borderColor: 'rgba(245,158,11,0.35)', color: '#FBBF24' }}
              whileTap={{ scale: 0.95 }}
            >
              <Lightbulb size={16} /> WANT
            </motion.button>
            <motion.button
              onClick={() => makeChoice('need')}
              className="py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 border"
              style={{ background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.35)', color: '#34D399' }}
              whileTap={{ scale: 0.95 }}
            >
              <Check size={16} /> NEED
            </motion.button>
          </div>
        </>
      ) : (
        /* ─── Summary screen ─── */
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-2 inline-block"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7 }}
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-display font-bold text-gradient-gold">Khel Khatam!</h3>
            <p className="text-sm text-ink-muted mt-1">Tumhara budget score: <span className="text-emerald font-bold">{Math.round(budgetScore)}/100</span></p>
          </div>

          {/* Pie chart visual */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-center text-xs uppercase tracking-wider text-ink-muted font-bold">Tumhara Money Split</p>

            <div className="flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center relative"
                style={{
                  background: `conic-gradient(#10B981 0% ${needMoneyPct}%, #F59E0B ${needMoneyPct}% 100%)`,
                  boxShadow: '0 0 40px rgba(0,0,0,0.3)',
                }}
              >
                <div className="w-24 h-24 rounded-full bg-midnight flex flex-col items-center justify-center" style={{ background: '#0B1220' }}>
                  <span className="text-lg font-display font-bold text-ink">{CARDS.length}</span>
                  <span className="text-[9px] text-ink-muted uppercase">Cards</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Heart className="text-emerald" size={14} />
                  <span className="text-[10px] uppercase tracking-wider text-emerald font-bold">Needs</span>
                </div>
                <p className="text-xl font-display font-bold text-emerald">{userNeeds}</p>
                <p className="text-xs text-ink-muted">{needMoneyPct}% money</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Lightbulb className="text-gold" size={14} />
                  <span className="text-[10px] uppercase tracking-wider text-gold font-bold">Wants</span>
                </div>
                <p className="text-xl font-display font-bold text-gold">{userWants}</p>
                <p className="text-xs text-ink-muted">{wantMoneyPct}% money</p>
              </div>
            </div>
          </div>

          {/* 50-30-20 rule comparison */}
          <div className="glass-card-premium rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h4 className="text-sm font-display font-bold text-ink">50-30-20 Rule Benchmark</h4>
            </div>
            <p className="text-[11px] text-ink-muted">
              Ideal split: <span className="text-emerald font-semibold">50% Needs</span>, <span className="text-gold font-semibold">30% Wants</span>, <span className="text-ai font-semibold">20% Savings</span>
            </p>

            {/* Benchmark bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-ink-muted mb-1">
                  <span>Needs (Tum: {needMoneyPct}%)</span>
                  <span>Ideal: 50%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden relative">
                  <div className="absolute h-full bg-emerald" style={{ width: `${needMoneyPct}%` }} />
                  <div className="absolute h-full w-0.5 bg-ink opacity-50" style={{ left: '50%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-ink-muted mb-1">
                  <span>Wants (Tum: {wantMoneyPct}%)</span>
                  <span>Ideal: 30%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden relative">
                  <div className="absolute h-full bg-gold" style={{ width: `${wantMoneyPct}%` }} />
                  <div className="absolute h-full w-0.5 bg-ink opacity-50" style={{ left: '30%' }} />
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 text-[11px] font-medium"
              style={{
                background: budgetScore >= 75 ? 'rgba(16,185,129,0.10)' : budgetScore >= 50 ? 'rgba(245,158,11,0.10)' : 'rgba(239,68,68,0.10)',
                border: `1px solid ${budgetScore >= 75 ? 'rgba(16,185,129,0.30)' : budgetScore >= 50 ? 'rgba(245,158,11,0.30)' : 'rgba(239,68,68,0.30)'}`,
                color: budgetScore >= 75 ? '#34D399' : budgetScore >= 50 ? '#FBBF24' : '#F87171',
              }}
            >
              {budgetScore >= 75
                ? '🏆 Perfect! Tum budget master ho. 20% savings bhi banao to aur bhi mast!'
                : budgetScore >= 50
                ? '👍 Theek hai par improve kar sakte ho. Wants thoda kam karo, savings badhao.'
                : '⚠️ Alert! Wants zyada hain. Needs pe focus karo, savings zaroori hai.'}
            </div>
          </div>

          {/* Play again */}
          <motion.button
            onClick={reset}
            className="btn-emerald w-full py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={16} /> Dobara Khelo
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
