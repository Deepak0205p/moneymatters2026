'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Timer,
  MousePointerClick,
  RotateCcw,
  Trophy,
  Sparkles,
  X,
  Flame,
  Star,
  Medal,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { termsDictionary } from '@/lib/data/terms-dictionary';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

// ─── Types ──────────────────────────────────────────────────
interface MemoryMatchProps {
  open: boolean;
  onClose: () => void;
}

interface GameCard {
  id: string;
  pairId: string;
  type: 'term' | 'definition';
  content: string;
  shortContent: string;
  flipped: boolean;
  matched: boolean;
}

type GameMode = 'easy' | 'medium' | 'hard';

interface GameResult {
  time: number;
  moves: number;
  accuracy: number;
  coinsEarned: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  mode: GameMode;
}

// ─── Mode Config ────────────────────────────────────────────
const MODE_CONFIG: Record<GameMode, { pairs: number; label: string; description: string; coins: number }> = {
  easy: { pairs: 6, label: 'Easy', description: '6 pairs — Basic terms jaise SIP, EMI, FD', coins: 5 },
  medium: { pairs: 8, label: 'Medium', description: '8 pairs — Mutual fund, Inflation jaise terms', coins: 10 },
  hard: { pairs: 10, label: 'Hard', description: '10 pairs — Pura range ke financial terms!', coins: 15 },
};

// ─── Combo Multipliers ──────────────────────────────────────
const COMBO_MULTIPLIERS = [1, 1, 2, 3, 5];

// ─── Term Selection for Modes ───────────────────────────────
const EASY_TERM_IDS = ['sip', 'emi', 'fd', 'rd', 'cibil-score', 'credit-card'];
const MEDIUM_TERM_IDS = [...EASY_TERM_IDS, 'mutual-fund', 'inflation'];
const HARD_TERM_IDS = [...MEDIUM_TERM_IDS, 'compound-interest', 'ppf'];

function getTermsForMode(mode: GameMode) {
  const ids = mode === 'easy' ? EASY_TERM_IDS : mode === 'medium' ? MEDIUM_TERM_IDS : HARD_TERM_IDS;
  return ids
    .map((id) => termsDictionary.find((t) => t.id === id))
    .filter(Boolean) as typeof termsDictionary;
}

// ─── Truncate text for card display ────────────────────────
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

// ─── Shuffle utility ────────────────────────────────────────
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Create game cards from terms ───────────────────────────
function createCards(mode: GameMode): GameCard[] {
  const terms = getTermsForMode(mode);
  const cards: GameCard[] = [];

  terms.forEach((term) => {
    cards.push({
      id: `term-${term.id}`,
      pairId: term.id,
      type: 'term',
      content: term.term,
      shortContent: truncate(term.term, 22),
      flipped: false,
      matched: false,
    });
    cards.push({
      id: `def-${term.id}`,
      pairId: term.id,
      type: 'definition',
      content: term.definition,
      shortContent: truncate(term.definition, 50),
      flipped: false,
      matched: false,
    });
  });

  return shuffle(cards);
}

// ─── Calculate grade ────────────────────────────────────────
function calculateGrade(accuracy: number, timeSeconds: number, mode: GameMode): 'S' | 'A' | 'B' | 'C' | 'D' {
  const timeThreshold = mode === 'easy' ? 60 : mode === 'medium' ? 90 : 120;
  if (accuracy >= 90 && timeSeconds <= timeThreshold) return 'S';
  if (accuracy >= 80) return 'A';
  if (accuracy >= 65) return 'B';
  if (accuracy >= 50) return 'C';
  return 'D';
}

// ─── Confetti Component ─────────────────────────────────────
function ConfettiOverlay() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      color: ['#fbbf24', '#f59e0b', '#d97706', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'][i % 7],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.size > 7 ? '2px' : '50%',
            rotate: p.rotation,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

// ─── Grade Badge Component ──────────────────────────────────
function GradeBadge({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    S: 'from-amber-300 to-yellow-500 text-amber-950',
    A: 'from-emerald-400 to-green-500 text-emerald-950',
    B: 'from-blue-400 to-cyan-500 text-blue-950',
    C: 'from-orange-400 to-amber-500 text-orange-950',
    D: 'from-gray-400 to-slate-500 text-gray-950',
  };
  const glowMap: Record<string, string> = {
    S: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
    A: 'shadow-[0_0_20px_rgba(52,211,153,0.4)]',
    B: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
    C: 'shadow-[0_0_10px_rgba(251,146,60,0.3)]',
    D: 'shadow-[0_0_8px_rgba(148,163,184,0.2)]',
  };

  return (
    <motion.div
      className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorMap[grade] || colorMap.D} flex items-center justify-center ${glowMap[grade] || ''}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
    >
      <span className="text-4xl font-black">{grade}</span>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function MemoryMatch({ open, onClose }: MemoryMatchProps) {
  // Game state
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchFlash, setMatchFlash] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addCoins, memoryMatchBestTimes, setMemoryMatchBestTime } = useAppStore();

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Initialize game
  const startGame = useCallback((mode: GameMode) => {
    const newCards = createCards(mode);
    setGameMode(mode);
    setCards(newCards);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setTotalCoinsEarned(0);
    setTimer(0);
    setIsPlaying(true);
    setIsComplete(false);
    setResult(null);
    setShowConfetti(false);
    setMatchFlash(null);
    setIsChecking(false);
    startTimer();
  }, [startTimer]);

  // Reset to menu
  const resetToMenu = useCallback(() => {
    stopTimer();
    setGameMode(null);
    setCards([]);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setTotalCoinsEarned(0);
    setTimer(0);
    setIsPlaying(false);
    setIsComplete(false);
    setResult(null);
    setShowConfetti(false);
    setMatchFlash(null);
    setIsChecking(false);
  }, [stopTimer]);

  // Handle card flip
  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.length >= 2) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    );

    // If two cards flipped, check for match
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match found!
        const newCombo = combo + 1;
        setCombo(newCombo);
        const multiplier = COMBO_MULTIPLIERS[Math.min(newCombo, COMBO_MULTIPLIERS.length - 1)];
        const coinsForMatch = multiplier;
        setTotalCoinsEarned((prev) => prev + coinsForMatch);
        setMatchFlash(first.pairId);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === first.pairId ? { ...c, matched: true } : c
            )
          );
          setFlippedIds([]);
          setMatchFlash(null);
          setIsChecking(false);
          const newMatchCount = matches + 1;
          setMatches(newMatchCount);
          const totalPairs = gameMode ? MODE_CONFIG[gameMode].pairs : 0;
          if (newMatchCount === totalPairs) {
            // Game complete — compute result inline
            stopTimer();
            setIsPlaying(false);
            setIsComplete(true);
            const newMoves = moves + 1;
            const accuracy = Math.round((totalPairs / newMoves) * 100);
            const clampedAccuracy = Math.min(100, accuracy);
            const grade = calculateGrade(clampedAccuracy, timer, gameMode);
            const baseCoins = MODE_CONFIG[gameMode].coins;
            const totalCoins = totalCoinsEarned + coinsForMatch + baseCoins;
            setResult({
              time: timer,
              moves: newMoves,
              accuracy: clampedAccuracy,
              coinsEarned: totalCoins,
              grade,
              mode: gameMode,
            });
            addCoins(totalCoins);
            const currentBest = memoryMatchBestTimes[gameMode] ?? Infinity;
            if (timer < currentBest) {
              setMemoryMatchBestTime(gameMode, timer);
            }
            if (gameMode === 'hard') {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }
          }
        }, 600);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  }, [cards, flippedIds, combo, gameMode, stopTimer, isChecking, matches, moves, timer, totalCoinsEarned, addCoins, memoryMatchBestTimes, setMemoryMatchBestTime]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Close handler
  const handleClose = useCallback(() => {
    stopTimer();
    resetToMenu();
    onClose();
  }, [stopTimer, resetToMenu, onClose]);

  // Grid columns based on mode
  const gridCols = gameMode === 'easy' ? 'grid-cols-3 sm:grid-cols-4' : gameMode === 'medium' ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5';

  // ─── Mode Selection Screen ───────────────────────────────
  const renderModeSelection = () => (
    <div className="flex flex-col items-center gap-6 py-4">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#0a0a0f]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gradient-gold">Memory Match</h2>
          <p className="text-xs text-[#8888a0]">Financial Terms ko Match karo!</p>
        </div>
      </motion.div>

      <motion.p
        className="text-sm text-[#8888a0] text-center max-w-md px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Card flip karo aur financial term ko uski Hinglish definition ke saath match karo!
        Consecutive matches se combo multiplier badhta hai — zyada coins kamao! 🪙
      </motion.p>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {(Object.entries(MODE_CONFIG) as [GameMode, typeof MODE_CONFIG.easy][]).map(
          ([mode, config], index) => {
            const bestTime = memoryMatchBestTimes[mode];
            return (
              <motion.button
                key={mode}
                onClick={() => startGame(mode)}
                className="glass-card-glow p-4 text-left hover:border-amber-400/30 transition-all group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold text-lg">{config.label}</span>
                      <span className="text-[10px] text-[#8888a0] bg-white/5 px-2 py-0.5 rounded-full">
                        {config.pairs} pairs
                      </span>
                    </div>
                    <p className="text-xs text-[#8888a0] mt-1">{config.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-amber-400 text-sm font-bold flex items-center gap-1">
                      🪙 +{config.coins}
                    </span>
                    {bestTime !== undefined && bestTime < Infinity && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        Best: {formatTime(bestTime)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          }
        )}
      </div>

      {/* How to Play */}
      <motion.div
        className="card-dark p-4 w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-bold text-amber-400 mb-2">Kaise Khelein? 🤔</h3>
        <ul className="text-xs text-[#8888a0] space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">1.</span>
            <span>2 cards flip karo — ek term aur ek definition</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">2.</span>
            <span>Agar term aur definition match kiye = pair complete! ✨</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">3.</span>
            <span>Consecutive matches = combo multiplier (1x → 2x → 3x → 5x) 🔥</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">4.</span>
            <span>Kam moves aur fast time = better grade (S grade best!) 🏆</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );

  // ─── Game Board ──────────────────────────────────────────
  const renderGameBoard = () => {
    const totalPairs = gameMode ? MODE_CONFIG[gameMode].pairs : 0;
    const progressPercent = totalPairs > 0 ? Math.round((matches / totalPairs) * 100) : 0;
    const multiplier = COMBO_MULTIPLIERS[Math.min(combo, COMBO_MULTIPLIERS.length - 1)];

    return (
      <div className="flex flex-col gap-3">
        {/* Top Stats Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="stat-card !p-2 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-mono font-bold text-[#e8e8ed]">{formatTime(timer)}</span>
            </div>
            {/* Moves */}
            <div className="stat-card !p-2 flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-[#e8e8ed]">{moves}</span>
            </div>
            {/* Combo */}
            {combo > 0 && (
              <motion.div
                key={`combo-${combo}`}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="stat-card !p-2 flex items-center gap-1.5 border-amber-400/30"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">{multiplier}x</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Coins earned this game */}
            <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
              <span>🪙</span>
              <span>{totalCoinsEarned}</span>
            </div>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Card Grid */}
        <div className={`grid ${gridCols} gap-2`}>
          <AnimatePresence mode="popLayout">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="perspective-500"
                style={{ perspective: '500px' }}
              >
                <motion.div
                  className="relative w-full cursor-pointer"
                  style={{
                    aspectRatio: card.type === 'term' ? '3/4' : '4/5',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    rotateY: card.flipped || card.matched ? 180 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                  whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                >
                  {/* Front (unflipped) */}
                  <div
                    className={`absolute inset-0 rounded-xl backface-hidden flex items-center justify-center border transition-all duration-300 ${
                      card.matched
                        ? 'bg-amber-500/10 border-amber-400/30'
                        : 'bg-[#1a1a2e] border-white/[0.08] hover:border-amber-400/20'
                    }`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {card.matched ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] text-amber-400 font-bold">Matched!</span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Brain className="w-5 h-5 text-[#8888a0]" />
                        <span className="text-[8px] text-[#8888a0]">
                          {card.type === 'term' ? 'Term' : 'Def'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Back (flipped) */}
                  <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center p-2 border transition-all duration-300 ${
                      card.matched
                        ? 'bg-amber-500/10 border-amber-400/30'
                        : matchFlash === card.pairId
                        ? 'bg-amber-500/15 border-amber-400/40'
                        : 'bg-[#12121a] border-amber-400/15'
                    }`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex flex-col items-center justify-center text-center h-full">
                      {card.type === 'term' ? (
                        <span className="text-xs sm:text-sm font-bold text-amber-400 leading-tight">
                          {card.shortContent}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-[#c8c8d4] leading-snug line-clamp-4">
                          {card.shortContent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gold glow effect on match */}
                  {matchFlash === card.pairId && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      initial={{ boxShadow: '0 0 0px rgba(245,158,11,0)' }}
                      animate={{ boxShadow: '0 0 30px rgba(245,158,11,0.5), 0 0 60px rgba(245,158,11,0.2)' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between text-xs text-[#8888a0]">
          <span>{matches}/{totalPairs} pairs matched</span>
          <span className="flex items-center gap-1">
            <Medal className="w-3 h-3" />
            {gameMode && MODE_CONFIG[gameMode].label} Mode
          </span>
        </div>
      </div>
    );
  };

  // ─── Results Screen ──────────────────────────────────────
  const renderResults = () => {
    if (!result) return null;

    const modeConfig = MODE_CONFIG[result.mode];
    const isNewBest = memoryMatchBestTimes[result.mode] === result.time;

    return (
      <div className="flex flex-col items-center gap-5 py-4 relative">
        {showConfetti && <ConfettiOverlay />}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-extrabold text-gradient-gold">Game Complete! 🎉</h2>
          <p className="text-sm text-[#8888a0] mt-1">
            {modeConfig.label} Mode khatam — {result.grade === 'S' ? 'Perfect performance!' : result.grade === 'A' ? 'Bahut achha!' : result.grade === 'B' ? 'Achha hai!' : 'Aur practice karo!'}
          </p>
        </motion.div>

        {/* Grade Badge */}
        <GradeBadge grade={result.grade} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Timer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#e8e8ed]">{formatTime(result.time)}</p>
            <p className="text-[10px] text-[#8888a0]">Total Time</p>
            {isNewBest && (
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5 block">★ New Best!</span>
            )}
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MousePointerClick className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#e8e8ed]">{result.moves}</p>
            <p className="text-[10px] text-[#8888a0]">Total Moves</p>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-[#e8e8ed]">{result.accuracy}%</p>
            <p className="text-[10px] text-[#8888a0]">Accuracy</p>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-400">🪙 {result.coinsEarned}</p>
            <p className="text-[10px] text-[#8888a0]">Coins Earned</p>
          </motion.div>
        </div>

        {/* Grade Legend */}
        <motion.div
          className="card-dark p-3 w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[10px] text-[#8888a0] text-center">
            <span className="text-amber-400 font-bold">S</span> = 90%+ accuracy + fast time &nbsp;|&nbsp;
            <span className="text-emerald-400 font-bold">A</span> = 80%+ &nbsp;|&nbsp;
            <span className="text-blue-400 font-bold">B</span> = 65%+ &nbsp;|&nbsp;
            <span className="text-orange-400 font-bold">C</span> = 50%+ &nbsp;|&nbsp;
            <span className="text-gray-400 font-bold">D</span> = Below 50%
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => gameMode && startGame(gameMode)}
            className="btn-gold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Phir Khelo!
          </button>
          <button
            onClick={resetToMenu}
            className="btn-ghost-gold flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Mode Change
          </button>
        </motion.div>
      </div>
    );
  };

  // ─── Main Render ─────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent
        className="bg-[#0a0a0f] border-white/[0.08] text-[#e8e8ed] max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          Memory Match — Financial Term Card Game
        </DialogTitle>

        <AnimatePresence mode="wait">
          {!gameMode && !isComplete && (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button in top right */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderModeSelection()}
            </motion.div>
          )}

          {gameMode && isPlaying && !isComplete && (
            <motion.div
              key="game-board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderGameBoard()}
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderResults()}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
