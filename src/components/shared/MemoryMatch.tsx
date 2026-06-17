"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Brain, Timer, RotateCcw, Trophy, Sparkles, Star, IndianRupee,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
interface MemoryMatchProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Term-definition pairs (financial literacy)
   ────────────────────────────────────────────────────────────── */
interface TermPair {
  id: string;
  term: string;
  definition: string;
  emoji: string;
  color: string;
}

const ALL_PAIRS: TermPair[] = [
  { id: 'sip', term: 'SIP', definition: 'Monthly Investment', emoji: '📈', color: '#10B981' },
  { id: 'emi', term: 'EMI', definition: 'Equal Monthly Installment', emoji: '💳', color: '#EF4444' },
  { id: 'nav', term: 'NAV', definition: 'Fund Price per Unit', emoji: '💎', color: '#8B5CF6' },
  { id: 'fd', term: 'FD', definition: 'Fixed Deposit', emoji: '🏦', color: '#F59E0B' },
  { id: 'cagr', term: 'CAGR', definition: 'Annual Growth Rate', emoji: '📊', color: '#06B6D4' },
  { id: 'ppf', term: 'PPF', definition: '15-Year Saving Scheme', emoji: '🏛️', color: '#EC4899' },
  { id: 'nps', term: 'NPS', definition: 'Pension Scheme', emoji: '👵', color: '#A855F7' },
  { id: 'elss', term: 'ELSS', definition: 'Tax-Saving Mutual Fund', emoji: '🧾', color: '#34D399' },
  { id: 'demat', term: 'Demat', definition: 'Shares Account', emoji: '📄', color: '#3B82F6' },
  { id: 'inflation', term: 'Inflation', definition: 'Price Rise Rate', emoji: '🔥', color: '#F97316' },
  { id: 'roi', term: 'ROI', definition: 'Return on Investment', emoji: '💰', color: '#FCD34D' },
  { id: 'sip-vs-lump', term: 'Lumpsum', definition: 'One-Time Investment', emoji: '🎯', color: '#14B8A6' },
];

/* ──────────────────────────────────────────────────────────────
   Difficulty config
   ────────────────────────────────────────────────────────────── */
type GameMode = 'easy' | 'medium' | 'hard';

const MODE_CONFIG: Record<GameMode, { pairs: number; cols: string; label: string; description: string; coins: number; emoji: string }> = {
  easy: { pairs: 3, cols: 'grid-cols-3', label: 'Easy', description: '3 pairs · 6 cards', coins: 10, emoji: '🌱' },
  medium: { pairs: 6, cols: 'grid-cols-4', label: 'Medium', description: '6 pairs · 12 cards', coins: 20, emoji: '🔥' },
  hard: { pairs: 8, cols: 'grid-cols-4', label: 'Hard', description: '8 pairs · 16 cards', coins: 35, emoji: '💀' },
};

/* ──────────────────────────────────────────────────────────────
   Game Card type
   ────────────────────────────────────────────────────────────── */
interface GameCard {
  id: string;
  pairId: string;
  type: 'term' | 'definition';
  content: string;
  emoji: string;
  color: string;
  flipped: boolean;
  matched: boolean;
}

/* ──────────────────────────────────────────────────────────────
   Card component — 3D flip
   ────────────────────────────────────────────────────────────── */
function GameCard({
  card, onClick, isFlipped, isMatched,
}: {
  card: GameCard;
  onClick: () => void;
  isFlipped: boolean;
  isMatched: boolean;
}) {
  return (
    <motion.button
      layout
      whileHover={!isFlipped && !isMatched ? { scale: 1.04, y: -3 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden"
      style={{ perspective: '1000px' }}
      // When matched becomes true, play the pulse keyframes once
      animate={isMatched ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Card back — glassmorphic with ₹ */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(139,92,246,0.05))',
            border: `1px solid ${isMatched ? card.color : 'rgba(255,255,255,0.12)'}`,
            boxShadow: isMatched ? `0 0 20px ${card.color}50` : '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <span className="font-display text-3xl font-extrabold text-white/30">₹</span>
        </div>

        {/* Card front — term or definition */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-2 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: isMatched
              ? `linear-gradient(135deg, ${card.color}25, ${card.color}10)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            border: `1px solid ${isMatched ? card.color : 'rgba(255,255,255,0.15)'}`,
            boxShadow: isMatched ? `0 0 24px ${card.color}60` : 'none',
          }}
        >
          <div className="text-xl mb-1">{card.emoji}</div>
          {card.type === 'term' ? (
            <p className="font-display text-xs font-extrabold text-white leading-tight">{card.content}</p>
          ) : (
            <p className="text-[9px] font-bold text-white/85 leading-tight">{card.content}</p>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function MemoryMatch({ open, onClose }: MemoryMatchProps) {
  const { addCoins, setMemoryMatchBestTime, memoryMatchBestTimes } = useAppStore();
  const [stage, setStage] = useState<'setup' | 'playing' | 'results'>('setup');
  const [mode, setMode] = useState<GameMode>('medium');
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [coinToast, setCoinToast] = useState<{ amount: number; id: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = MODE_CONFIG[mode];

  // ── Shuffle and create cards ──
  const startGame = useCallback((gameMode: GameMode) => {
    const cfg = MODE_CONFIG[gameMode];
    const pairs = ALL_PAIRS.slice(0, cfg.pairs);
    const newCards: GameCard[] = [];
    pairs.forEach((p) => {
      newCards.push({
        id: `${p.id}-term`,
        pairId: p.id,
        type: 'term',
        content: p.term,
        emoji: p.emoji,
        color: p.color,
        flipped: false,
        matched: false,
      });
      newCards.push({
        id: `${p.id}-def`,
        pairId: p.id,
        type: 'definition',
        content: p.definition,
        emoji: p.emoji,
        color: p.color,
        flipped: false,
        matched: false,
      });
    });
    // Fisher-Yates shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    setMode(gameMode);
    setCards(newCards);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setTime(0);
    setStage('playing');
  }, []);

  // ── Timer ──
  useEffect(() => {
    if (stage !== 'playing') return;
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  // ── Check match when 2 cards flipped ──
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);
    if (!cardA || !cardB) return;

    setMoves((m) => m + 1);

    if (cardA.pairId === cardB.pairId) {
      // Match!
      const newMatched = new Set(matched);
      newMatched.add(a);
      newMatched.add(b);
      setMatched(newMatched);
      setFlipped([]);
      addCoins(5);
      setCoinToast({ amount: 5, id: Date.now() });
      setTimeout(() => setCoinToast(null), 1500);

      // Check win
      if (newMatched.size === cards.length) {
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          const finalTime = time + 1;
          setMemoryMatchBestTime(mode, finalTime);
          addCoins(MODE_CONFIG[mode].coins);
          setStage('results');
        }, 600);
      }
    } else {
      // No match — flip back after delay
      const t = setTimeout(() => setFlipped([]), 1000);
      return () => clearTimeout(t);
    }
  }, [flipped, cards, matched, time, mode, addCoins, setMemoryMatchBestTime]);

  // ── Handle card click ──
  const handleCardClick = useCallback((cardId: string) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.has(cardId)) return;
    setFlipped((prev) => [...prev, cardId]);
  }, [flipped, matched]);

  // ── Reset on close ──
  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
    setTimeout(() => {
      setStage('setup');
      setCards([]);
      setFlipped([]);
      setMatched(new Set());
      setMoves(0);
      setTime(0);
    }, 300);
  };

  const bestTime = memoryMatchBestTimes[mode];
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Efficiency score for results
  const efficiency = useMemo(() => {
    if (cards.length === 0) return 0;
    const perfect = cards.length / 2;
    return Math.round((perfect / Math.max(moves, perfect)) * 100);
  }, [cards.length, moves]);

  const grade = efficiency >= 90 ? 'S' : efficiency >= 75 ? 'A' : efficiency >= 60 ? 'B' : efficiency >= 40 ? 'C' : 'D';
  const gradeColor = efficiency >= 75 ? '#10B981' : efficiency >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-white/10 glass-card-premium">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Memory Match 🃏</h2>
              <p className="text-xs text-ink-muted mt-0.5">Term ↔ Definition match karo, brain sharpen karo!</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto relative">
          {/* +5 coins toast */}
          <AnimatePresence>
            {coinToast && (
              <motion.div
                key={coinToast.id}
                initial={{ opacity: 0, y: -20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.5 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] rounded-full bg-gold/20 border border-gold/50 px-4 py-2 flex items-center gap-2"
                style={{ boxShadow: '0 0 24px rgba(245,158,11,0.4)' }}
              >
                <span className="coin-spin-3d">🪙</span>
                <span className="font-bold text-sm text-gold-soft">+{coinToast.amount} coins!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* SETUP */}
            {stage === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-3"
                >
                  🃏
                </motion.div>
                <h3 className="font-display text-2xl font-extrabold heading-gradient mb-2">
                  Difficulty Choose Karo
                </h3>
                <p className="text-sm text-ink-muted mb-6 max-w-sm mx-auto">
                  Financial terms ko unki definitions se match karo. Kam moves = zyada coins! 🧠
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
                  {(Object.keys(MODE_CONFIG) as GameMode[]).map((m) => {
                    const cfg = MODE_CONFIG[m];
                    return (
                      <motion.button
                        key={m}
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startGame(m)}
                        className="relative card-3d rounded-2xl border border-white/10 glass-card p-4 overflow-hidden group"
                      >
                        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: cfg.coins >= 30 ? '#EF4444' : cfg.coins >= 20 ? '#F59E0B' : '#10B981' }} />
                        <div className="text-3xl mb-2">{cfg.emoji}</div>
                        <h4 className="font-display text-base font-bold text-white">{cfg.label}</h4>
                        <p className="text-[10px] text-ink-muted mb-2">{cfg.description}</p>
                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={s <= (cfg.coins >= 30 ? 3 : cfg.coins >= 20 ? 2 : 1) ? 'text-gold-soft' : 'text-white/15'}
                              fill={s <= (cfg.coins >= 30 ? 3 : cfg.coins >= 20 ? 2 : 1) ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-gold-soft font-bold mt-2">+{cfg.coins} coins</p>
                        {memoryMatchBestTimes[m] && (
                          <p className="text-[9px] text-ink-muted mt-1">Best: {memoryMatchBestTimes[m]}s</p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* PLAYING */}
            {stage === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Stats bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <Timer size={14} className="text-emerald-soft" />
                      <span className="text-sm font-bold text-white tabular-nums">{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <span className="text-xs font-bold text-ink-muted">Moves</span>
                      <span className="text-sm font-bold text-white">{moves}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStage('setup')}
                    className="text-xs font-bold text-ink-muted hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Restart
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-4">
                  <motion.div
                    animate={{ width: `${(matched.size / cards.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald to-ai"
                  />
                </div>

                {/* Cards grid */}
                <div className={`grid ${config.cols} gap-2 sm:gap-3`}>
                  {cards.map((card) => (
                    <GameCard
                      key={card.id}
                      card={card}
                      onClick={() => handleCardClick(card.id)}
                      isFlipped={flipped.includes(card.id)}
                      isMatched={matched.has(card.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {stage === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                {/* Confetti */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][i % 4],
                        animationDelay: `${Math.random() * 0.6}s`,
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                  style={{ background: `linear-gradient(135deg, ${gradeColor}, ${gradeColor}80)`, boxShadow: `0 0 40px ${gradeColor}80` }}
                >
                  <Trophy size={36} className="text-midnight" />
                </motion.div>

                <h3 className="font-display text-2xl font-extrabold heading-gradient mb-1">Sab Match Kar Diya! 🎉</h3>
                <p className="text-sm text-ink-muted mb-4">{config.label} mode complete!</p>

                {/* Grade */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
                  style={{ background: `${gradeColor}25`, border: `2px solid ${gradeColor}` }}
                >
                  <span className="font-display text-4xl font-extrabold" style={{ color: gradeColor }}>{grade}</span>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 max-w-sm mx-auto">
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                    <Timer size={14} className="text-emerald-soft mx-auto mb-1" />
                    <p className="font-display text-lg font-extrabold text-white">{timeStr}</p>
                    <p className="text-[9px] text-ink-muted uppercase">Time</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                    <Sparkles size={14} className="text-ai mx-auto mb-1" />
                    <p className="font-display text-lg font-extrabold text-white">{moves}</p>
                    <p className="text-[9px] text-ink-muted uppercase">Moves</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                    <IndianRupee size={14} className="text-gold-soft mx-auto mb-1" />
                    <p className="font-display text-lg font-extrabold text-gold-soft">+{config.coins + (cards.length / 2) * 5}</p>
                    <p className="text-[9px] text-ink-muted uppercase">Coins</p>
                  </div>
                </div>

                {bestTime && time < bestTime && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-gold/15 border border-gold/30"
                  >
                    <Star size={12} className="text-gold-soft" fill="currentColor" />
                    <span className="text-xs font-bold text-gold-soft">New Best Time!</span>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button
                    onClick={() => startGame(mode)}
                    className="flex-1 rounded-xl py-3 text-sm font-bold text-white bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} /> Phir Khelo
                  </button>
                  <button
                    onClick={() => setStage('setup')}
                    className="flex-1 btn-3d rounded-xl py-3 text-sm font-bold text-midnight flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
                  >
                    Difficulty Badlo <Brain size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
