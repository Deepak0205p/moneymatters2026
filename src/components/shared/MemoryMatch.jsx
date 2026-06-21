'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Timer, RotateCcw, Trophy, Sparkles, Star, IndianRupee } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

const ALL_PAIRS = [
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
  { id: 'lumpsum', term: 'Lumpsum', definition: 'One-Time Investment', emoji: '🎯', color: '#14B8A6' }
];

const MODE_CONFIG = {
  easy: {
    pairs: 3,
    cols: 'grid-cols-3',
    label: 'Easy',
    description: '3 pairs · 6 cards',
    coins: 10,
    emoji: '🌱'
  },
  medium: {
    pairs: 6,
    cols: 'grid-cols-4',
    label: 'Medium',
    description: '6 pairs · 12 cards',
    coins: 20,
    emoji: '🔥'
  },
  hard: {
    pairs: 8,
    cols: 'grid-cols-4',
    label: 'Hard',
    description: '8 pairs · 16 cards',
    coins: 35,
    emoji: '💀'
  }
};

function GameCard({ card, onClick, isFlipped, isMatched }) {
  return (
    <motion.button
      layout
      whileHover={!isFlipped && !isMatched ? { scale: 1.04, y: -3 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden focus:outline-none cursor-pointer"
      style={{ perspective: '1000px' }}
      animate={isMatched ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Card Back (Flipped down) */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <span className="font-black text-2xl text-zinc-600">₹</span>
        </div>

        {/* Card Front (Revealed) */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-2.5 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: isMatched 
              ? `linear-gradient(135deg, ${card.color}25, ${card.color}10)` 
              : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
            border: `1px solid ${isMatched ? card.color : 'rgba(255,255,255,0.15)'}`,
            boxShadow: isMatched ? `0 0 20px ${card.color}40` : 'none'
          }}
        >
          <span className="text-2xl mb-1.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{card.emoji}</span>
          {card.type === 'term' ? (
            <p className="text-xs font-black text-white uppercase tracking-wider leading-tight">
              {card.content}
            </p>
          ) : (
            <p className="text-[9px] font-bold text-zinc-300 leading-tight">
              {card.content}
            </p>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}

export default function MemoryMatch({ open, onClose }) {
  const {
    addCoins,
    setMemoryMatchBestTime,
    memoryMatchBestTimes
  } = useAppStore();

  const [stage, setStage] = useState('setup'); // 'setup', 'playing', 'results'
  const [mode, setMode] = useState('medium');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [coinToast, setCoinToast] = useState(null);
  const timerRef = useRef(null);

  const config = MODE_CONFIG[mode];

  // Shuffle and build game
  const startGame = useCallback((gameMode) => {
    const cfg = MODE_CONFIG[gameMode];
    const pairs = [...ALL_PAIRS].sort(() => Math.random() - 0.5).slice(0, cfg.pairs);
    const newCards = [];

    pairs.forEach(p => {
      newCards.push({
        id: `${p.id}-term`,
        pairId: p.id,
        type: 'term',
        content: p.term,
        emoji: p.emoji,
        color: p.color
      });
      newCards.push({
        id: `${p.id}-def`,
        pairId: p.id,
        type: 'definition',
        content: p.definition,
        emoji: p.emoji,
        color: p.color
      });
    });

    // Fisher-Yates
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

  // Timer Effect
  useEffect(() => {
    if (stage !== 'playing') return;
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Flip state match checker
  useEffect(() => {
    if (flipped.length !== 2) return;
    const [idA, idB] = flipped;
    const cardA = cards.find(c => c.id === idA);
    const cardB = cards.find(c => c.id === idB);
    if (!cardA || !cardB) return;

    setMoves(m => m + 1);

    if (cardA.pairId === cardB.pairId) {
      // Correct Match
      const newMatched = new Set(matched);
      newMatched.add(idA);
      newMatched.add(idB);
      setMatched(newMatched);
      setFlipped([]);
      addCoins(5);

      setCoinToast({ amount: 5, id: Date.now() });
      setTimeout(() => setCoinToast(null), 1500);

      // Win Condition Check
      if (newMatched.size === cards.length) {
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          const finalTime = time;
          if (typeof setMemoryMatchBestTime === 'function') {
            setMemoryMatchBestTime(mode, finalTime);
          }
          addCoins(MODE_CONFIG[mode].coins);
          setStage('results');
        }, 800);
      }
    } else {
      // Not a match, flip back
      const delayTimer = setTimeout(() => {
        setFlipped([]);
      }, 1000);
      return () => clearTimeout(delayTimer);
    }
  }, [flipped, cards, matched, time, mode, addCoins, setMemoryMatchBestTime]);

  const handleCardClick = useCallback((cardId) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.has(cardId)) return;
    setFlipped(prev => [...prev, cardId]);
  }, [flipped, matched]);

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

  const bestTime = memoryMatchBestTimes?.[mode];
  const min = Math.floor(time / 60);
  const sec = time % 60;
  const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  const efficiency = useMemo(() => {
    if (cards.length === 0) return 0;
    const perfectMoves = cards.length / 2;
    return Math.round((perfectMoves / Math.max(moves, perfectMoves)) * 100);
  }, [cards, moves]);

  const grade = efficiency >= 90 ? 'S' : efficiency >= 75 ? 'A' : efficiency >= 60 ? 'B' : efficiency >= 45 ? 'C' : 'D';
  const gradeColor = efficiency >= 75 ? '#10B981' : efficiency >= 60 ? '#F59E0B' : '#EF4444';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleClose} />

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
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
              <Brain size={20} className="text-[#8B5CF6]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Dimag ki Kasrat 🧩</h2>
              <p className="text-[10px] text-zinc-400">Match financial abbreviations & descriptions</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          <AnimatePresence>
            {coinToast && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-2 flex items-center gap-2 shadow-lg backdrop-blur-sm"
              >
                <span className="text-xs">🪙</span>
                <span className="text-xs font-black text-amber-400">+{coinToast.amount} Coins!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {stage === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-5xl animate-pulse block">🧩</span>
                  <h3 className="text-xl font-black text-white">Difficulty Chunin!</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Acroynms aur term pairs ko match karein. Kam se kam moves mein puzzle solve karke top rewards jeetein.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto py-2">
                  {Object.keys(MODE_CONFIG).map((m) => {
                    const cfg = MODE_CONFIG[m];
                    const countStars = m === 'easy' ? 1 : m === 'medium' ? 2 : 3;

                    return (
                      <motion.button
                        key={m}
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startGame(m)}
                        className="p-5 rounded-3xl bg-[#0B0E19] border border-white/[0.04] flex flex-col items-center justify-between group relative overflow-hidden"
                      >
                        <div 
                          className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-all pointer-events-none" 
                          style={{ backgroundColor: cfg.coins >= 30 ? '#EF4444' : cfg.coins >= 20 ? '#F59E0B' : '#10B981' }} 
                        />
                        <span className="text-3xl bg-white/5 p-2 rounded-2xl block mb-2">{cfg.emoji}</span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{cfg.label}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{cfg.description}</p>
                        
                        <div className="flex gap-0.5 mt-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={9} 
                              className={i < countStars ? 'text-amber-400 fill-amber-400' : 'text-zinc-800'} 
                            />
                          ))}
                        </div>

                        <div className="text-[10px] font-black text-amber-400 uppercase mt-4">
                          +{cfg.coins} Coins Reward
                        </div>

                        {memoryMatchBestTimes?.[m] && (
                          <div className="text-[8px] text-zinc-500 font-bold uppercase mt-1">
                            Best: {memoryMatchBestTimes[m]}s
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {stage === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Stats row */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <Timer size={14} className="text-emerald-400" />
                      <span className="text-xs font-black text-white tabular-nums">{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Moves</span>
                      <span className="text-xs font-black text-white">{moves}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStage('setup')}
                    className="text-xs font-black text-zinc-500 hover:text-white uppercase tracking-wider flex items-center gap-1 focus:outline-none"
                  >
                    <RotateCcw size={12} /> Restart Game
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${(matched.size / cards.length) * 100}%` }}
                  />
                </div>

                {/* Cards grid */}
                <div className={`grid ${config.cols} gap-3`}>
                  {cards.map(card => (
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

            {stage === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-2xl relative">
                    <Trophy size={36} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Grid Cleared! 🎉</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      {config.label} Memory Challenge Completed
                    </p>
                  </div>
                </div>

                {/* Grade display */}
                <div className="max-w-xs mx-auto p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04] space-y-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">EFFICIENCY GRADE</span>
                  <span className="text-5xl font-black block mt-1" style={{ color: gradeColor }}>
                    {grade}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase block pt-2">
                    moves ratio efficiency: {efficiency}%
                  </span>
                </div>

                {/* Score Stats */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">Total Time</span>
                    <span className="text-sm font-black text-white block">{timeStr}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">Total Moves</span>
                    <span className="text-sm font-black text-white block">{moves}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">Coins Won</span>
                    <span className="text-sm font-black text-amber-400 block">
                      +{config.coins + (cards.length / 2) * 5} 🪙
                    </span>
                  </div>
                </div>

                {bestTime && time <= bestTime && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                      Personal Best Record Break!
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                  <button
                    onClick={() => startGame(mode)}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl border border-white/10 hover:bg-white/5 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <RotateCcw size={14} /> Replay Mode
                  </button>
                  <button
                    onClick={() => setStage('setup')}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 focus:outline-none"
                  >
                    Change Grid <Brain size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Memory Match — matching terms helps retain critical financial definitions
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { MemoryMatch };