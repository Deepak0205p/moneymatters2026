'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Timer,
  Lightbulb,
  SkipForward,
  RotateCcw,
  Trophy,
  Sparkles,
  X,
  Flame,
  Star,
  Coins,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

// ─── Types ──────────────────────────────────────────────────
interface WordScrambleProps {
  open: boolean;
  onClose: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface WordItem {
  word: string;
  hint: string;
  difficulty: Difficulty;
}

interface GameResult {
  score: number;
  wordsSolved: number;
  totalWords: number;
  bestStreak: number;
  coinsEarned: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  mode: Difficulty;
}

// ─── Word List ──────────────────────────────────────────────
const WORDS: WordItem[] = [
  // Easy (3-5 letters)
  { word: 'SIP', hint: 'Monthly investment plan', difficulty: 'easy' },
  { word: 'EMI', hint: 'Monthly loan payment', difficulty: 'easy' },
  { word: 'ATM', hint: 'Cash withdraw machine', difficulty: 'easy' },
  { word: 'FD', hint: 'Fixed deposit in bank', difficulty: 'easy' },
  { word: 'KYC', hint: 'Identity verification', difficulty: 'easy' },
  { word: 'PPF', hint: '15-year savings scheme', difficulty: 'easy' },
  { word: 'NRI', hint: 'Indian living abroad', difficulty: 'easy' },
  { word: 'PAN', hint: 'Tax identification card', difficulty: 'easy' },
  { word: 'ELSS', hint: 'Tax-saving mutual fund', difficulty: 'easy' },
  { word: 'RBI', hint: 'Central bank of India', difficulty: 'easy' },
  // Medium (6-8 letters)
  { word: 'MUTUAL', hint: '___ fund - pooled investment', difficulty: 'medium' },
  { word: 'INVEST', hint: 'Put money to grow', difficulty: 'medium' },
  { word: 'BUDGET', hint: 'Income vs expense plan', difficulty: 'medium' },
  { word: 'SAVINGS', hint: 'Money kept for future', difficulty: 'medium' },
  { word: 'CREDIT', hint: '___ score - borrowing trust', difficulty: 'medium' },
  { word: 'TAXATION', hint: 'Government revenue system', difficulty: 'medium' },
  { word: 'RETURNS', hint: 'Profit from investment', difficulty: 'medium' },
  { word: 'EQUITY', hint: 'Stock market investment', difficulty: 'medium' },
  { word: 'DEPOSIT', hint: 'Money kept in bank', difficulty: 'medium' },
  { word: 'PENSION', hint: 'Retirement income fund', difficulty: 'medium' },
  // Hard (9+ letters)
  { word: 'COMPOUNDING', hint: 'Interest on interest magic', difficulty: 'hard' },
  { word: 'DIVERSIFY', hint: 'Spread risk across assets', difficulty: 'hard' },
  { word: 'INFLATION', hint: 'Prices rising over time', difficulty: 'hard' },
  { word: 'AMORTIZATION', hint: 'Loan repayment schedule', difficulty: 'hard' },
  { word: 'DEPRECIATION', hint: 'Asset value decreases', difficulty: 'hard' },
  { word: 'CAPITALIZATION', hint: 'Market value calculation', difficulty: 'hard' },
  { word: 'REINVESTMENT', hint: 'Invest profits again', difficulty: 'hard' },
  { word: 'MORTGAGE', hint: 'Home loan with property', difficulty: 'hard' },
  { word: 'INSURANCE', hint: 'Financial protection cover', difficulty: 'hard' },
  { word: 'SPECULATION', hint: 'High-risk trading bets', difficulty: 'hard' },
];

// ─── Mode Config ────────────────────────────────────────────
const MODE_CONFIG: Record<Difficulty, { timer: number; label: string; description: string; coinsPerWord: number }> = {
  easy: { timer: 60, label: 'Easy', description: '3-5 letter words • 60s per word', coinsPerWord: 10 },
  medium: { timer: 45, label: 'Medium', description: '6-8 letter words • 45s per word', coinsPerWord: 20 },
  hard: { timer: 30, label: 'Hard', description: '9+ letter words • 30s per word', coinsPerWord: 30 },
};

const WORDS_PER_GAME = 10;

// ─── Shuffle utility ────────────────────────────────────────
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function scrambleWord(word: string): string {
  const letters = word.split('');
  let scrambled = shuffleArray(letters);
  let attempts = 0;
  while (scrambled.join('') === word && attempts < 50) {
    scrambled = shuffleArray(letters);
    attempts++;
  }
  return scrambled.join('');
}

// ─── Grade Calculation ──────────────────────────────────────
function calculateGrade(accuracy: number, avgTime: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (accuracy >= 90 && avgTime < 10) return 'S';
  if (accuracy >= 80 && avgTime < 15) return 'A';
  if (accuracy >= 60) return 'B';
  if (accuracy >= 40) return 'C';
  return 'D';
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S': return 'text-amber-400';
    case 'A': return 'text-emerald-400';
    case 'B': return 'text-sky-400';
    case 'C': return 'text-orange-400';
    default: return 'text-red-400';
  }
}

function getGradeEmoji(grade: string): string {
  switch (grade) {
    case 'S': return '👑';
    case 'A': return '🌟';
    case 'B': return '👍';
    case 'C': return '🤔';
    default: return '😅';
  }
}

// ─── Particle Effect Component ──────────────────────────────
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%`, top: '50%' }}
      initial={{ opacity: 1, scale: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [0, 1.5, 0.5],
        y: [0, -80 - Math.random() * 60],
        x: [(Math.random() - 0.5) * 100],
      }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function WordScramble({ open, onClose }: WordScrambleProps) {
  const { addCoins, spendCoins, coins, wordScrambleHighScore, setWordScrambleHighScore } = useAppStore();

  // Game state
  const [gamePhase, setGamePhase] = useState<'menu' | 'playing' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<(string | null)[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameWords, setGameWords] = useState<WordItem[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const wordTimesRef = useRef<number[]>([]);

  // Use refs for mutable game state that callbacks need
  const gamePhaseRef = useRef(gamePhase);
  const currentWordIndexRef = useRef(currentWordIndex);
  const gameWordsRef = useRef(gameWords);
  const streakRef = useRef(streak);
  const bestStreakRef = useRef(bestStreak);
  const difficultyRef = useRef(difficulty);
  const scoreRef = useRef(score);
  const usedIndicesRef = useRef(usedIndices);
  const selectedLettersRef = useRef(selectedLetters);
  const scrambledLettersRef = useRef(scrambledLetters);
  const showCorrectRef = useRef(showCorrect);
  const hintUsedRef = useRef(hintUsed);

  // Sync refs
  useEffect(() => { gamePhaseRef.current = gamePhase; }, [gamePhase]);
  useEffect(() => { currentWordIndexRef.current = currentWordIndex; }, [currentWordIndex]);
  useEffect(() => { gameWordsRef.current = gameWords; }, [gameWords]);
  useEffect(() => { streakRef.current = streak; }, [streak]);
  useEffect(() => { bestStreakRef.current = bestStreak; }, [bestStreak]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { usedIndicesRef.current = usedIndices; }, [usedIndices]);
  useEffect(() => { selectedLettersRef.current = selectedLetters; }, [selectedLetters]);
  useEffect(() => { scrambledLettersRef.current = scrambledLetters; }, [scrambledLetters]);
  useEffect(() => { showCorrectRef.current = showCorrect; }, [showCorrect]);
  useEffect(() => { hintUsedRef.current = hintUsed; }, [hintUsed]);

  // Get current word
  const currentWord = useMemo(() => gameWords[currentWordIndex], [gameWords, currentWordIndex]);

  // End game function
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGamePhase('result');
  }, []);

  // Move to next word
  const moveToNextWord = useCallback(() => {
    const idx = currentWordIndexRef.current;
    const words = gameWordsRef.current;

    if (idx >= words.length - 1) {
      endGame();
      return;
    }

    const nextIndex = idx + 1;
    const nextWord = words[nextIndex];
    if (nextWord) {
      setCurrentWordIndex(nextIndex);
      setScrambledLetters(scrambleWord(nextWord.word).split(''));
      setSelectedLetters(Array(nextWord.word.length).fill(null));
      setUsedIndices(new Set());
      setTimeLeft(MODE_CONFIG[nextWord.difficulty].timer);
      setHintUsed(false);
      setShowCorrect(false);
      setShowWrong(false);
      startTimeRef.current = Date.now();
    }
  }, [endGame]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStreak(0);
    setTimeout(() => {
      moveToNextWord();
    }, 1000);
  }, [moveToNextWord]);

  // Timer logic
  useEffect(() => {
    if (gamePhase !== 'playing' || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, currentWordIndex, handleTimeUp]);

  // Handle correct word
  const handleCorrectWord = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    wordTimesRef.current.push(timeTaken);

    setShowCorrect(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);

    const currentStreak = streakRef.current;
    const newStreak = currentStreak + 1;
    setStreak(newStreak);
    if (newStreak > bestStreakRef.current) setBestStreak(newStreak);

    // Calculate coins
    const currentDiff = difficultyRef.current;
    const modeConfig = MODE_CONFIG[currentDiff];
    let coinsEarned = modeConfig.coinsPerWord;

    // Streak bonus
    if (newStreak >= 5) coinsEarned *= 3;
    else if (newStreak >= 3) coinsEarned *= 2;

    // Time bonus: solved in under half the time
    if (timeTaken < modeConfig.timer / 2) coinsEarned += 5;

    setScore((prev) => prev + coinsEarned);
    setWordsSolved((prev) => prev + 1);
    addCoins(coinsEarned);

    // Move to next word after delay
    setTimeout(() => {
      moveToNextWord();
    }, 1200);
  }, [addCoins, moveToNextWord]);

  // Handle wrong word
  const handleWrongWord = useCallback((currentSelected: (string | null)[]) => {
    setShowWrong(true);
    setTimeout(() => {
      setShowWrong(false);
      setSelectedLetters(Array(currentSelected.length).fill(null));
      setUsedIndices(new Set());
    }, 600);
  }, []);

  // Handle letter click from scrambled pool
  const handleLetterClick = useCallback((index: number) => {
    const currentUsedIndices = usedIndicesRef.current;
    const currentScrambled = scrambledLettersRef.current;
    const currentSelected = selectedLettersRef.current;
    const isCorrectShowing = showCorrectRef.current;

    if (currentUsedIndices.has(index) || isCorrectShowing) return;

    const newUsedIndices = new Set(currentUsedIndices);
    newUsedIndices.add(index);

    const letter = currentScrambled[index];
    if (!letter) return;

    const newSelected = [...currentSelected];
    const emptySlot = newSelected.findIndex((s) => s === null);
    if (emptySlot === -1) return;

    newSelected[emptySlot] = letter;
    setUsedIndices(newUsedIndices);
    setSelectedLetters(newSelected);

    // Check if word is complete
    const currentWordObj = gameWordsRef.current[currentWordIndexRef.current];
    if (!currentWordObj) return;

    const isComplete = newSelected.every((s) => s !== null);
    if (isComplete) {
      const playerWord = newSelected.join('');
      if (playerWord === currentWordObj.word) {
        handleCorrectWord();
      } else {
        handleWrongWord(newSelected);
      }
    }
  }, [handleCorrectWord, handleWrongWord]);

  // Handle clicking a placed letter to remove it
  const handlePlacedLetterClick = useCallback((slotIndex: number) => {
    if (showCorrectRef.current) return;

    const currentSelected = selectedLettersRef.current;
    const letter = currentSelected[slotIndex];
    if (letter === null) return;

    const newSelected = [...currentSelected];
    newSelected[slotIndex] = null;

    // Rebuild usedIndices from remaining selected letters
    const currentScrambled = scrambledLettersRef.current;
    const rebuiltUsed = new Set<number>();

    for (const sel of newSelected) {
      if (sel !== null) {
        const idx = currentScrambled.findIndex(
          (l, i) => l === sel && !rebuiltUsed.has(i)
        );
        if (idx !== -1) rebuiltUsed.add(idx);
      }
    }

    setSelectedLetters(newSelected);
    setUsedIndices(rebuiltUsed);
  }, []);

  // Hint
  const handleHint = useCallback(() => {
    const isHintUsed = hintUsedRef.current;
    const currentWordObj = gameWordsRef.current[currentWordIndexRef.current];

    if (isHintUsed || !currentWordObj) return;
    if (coins < 5) return;

    spendCoins(5);
    setHintUsed(true);

    const firstLetter = currentWordObj.word[0];
    const currentSelected = selectedLettersRef.current;
    const newSelected = [...currentSelected];

    if (newSelected[0] === null) {
      newSelected[0] = firstLetter;
      const currentScrambled = scrambledLettersRef.current;
      const currentUsed = usedIndicesRef.current;
      const scrambledIdx = currentScrambled.findIndex(
        (l, idx) => l === firstLetter && !currentUsed.has(idx)
      );
      if (scrambledIdx !== -1) {
        const newUsedIndices = new Set(currentUsed);
        newUsedIndices.add(scrambledIdx);
        setUsedIndices(newUsedIndices);
      }
    }

    setSelectedLetters(newSelected);
  }, [coins, spendCoins]);

  // Skip
  const handleSkip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStreak(0);
    moveToNextWord();
  }, [moveToNextWord]);

  // Start game
  const startGame = useCallback((mode: Difficulty) => {
    setDifficulty(mode);
    const filteredWords = WORDS.filter((w) => w.difficulty === mode);
    const selected = shuffleArray(filteredWords).slice(0, WORDS_PER_GAME);
    setGameWords(selected);
    setCurrentWordIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWordsSolved(0);
    wordTimesRef.current = [];

    const firstWord = selected[0];
    if (firstWord) {
      setScrambledLetters(scrambleWord(firstWord.word).split(''));
      setSelectedLetters(Array(firstWord.word.length).fill(null));
      setUsedIndices(new Set());
      setTimeLeft(MODE_CONFIG[mode].timer);
      setHintUsed(false);
      setShowCorrect(false);
      setShowWrong(false);
      startTimeRef.current = Date.now();
    }

    setGamePhase('playing');
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGamePhase('menu');
    setCurrentWordIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWordsSolved(0);
    setHintUsed(false);
    setShowCorrect(false);
    setShowWrong(false);
    setShowConfetti(false);
    setGameWords([]);
  }, []);

  // Compute game result
  const gameResult = useMemo((): GameResult | null => {
    if (gamePhase !== 'result') return null;

    const avgTime = wordTimesRef.current.length > 0
      ? wordTimesRef.current.reduce((a, b) => a + b, 0) / wordTimesRef.current.length
      : MODE_CONFIG[difficulty].timer;

    const accuracy = gameWords.length > 0 ? (wordsSolved / gameWords.length) * 100 : 0;
    const grade = calculateGrade(accuracy, avgTime);

    return {
      score,
      wordsSolved,
      totalWords: gameWords.length,
      bestStreak,
      coinsEarned: score,
      grade,
      mode: difficulty,
    };
  }, [gamePhase, score, wordsSolved, gameWords.length, bestStreak, difficulty]);

  // Update high score when game ends
  useEffect(() => {
    if (gamePhase === 'result' && score > 0) {
      setWordScrambleHighScore(difficulty, score);
    }
  }, [gamePhase, score, difficulty, setWordScrambleHighScore]);

  // Timer bar color
  const timerConfig = MODE_CONFIG[difficulty];
  const timerProgress = timeLeft / timerConfig.timer;
  const timerColor = useMemo(() => {
    if (timerProgress > 0.5) return 'from-amber-400 to-amber-500';
    if (timerProgress > 0.25) return 'from-orange-400 to-orange-500';
    return 'from-red-500 to-red-600';
  }, [timerProgress]);

  // Confetti colors
  const confettiColors = ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

  // ─── Render: Menu ─────────────────────────────────────────
  if (gamePhase === 'menu') {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
        <DialogContent className="bg-[#0a0a0f] border-white/[0.06] text-[#e8e8ed] max-w-lg p-0 overflow-hidden">
          <DialogTitle className="sr-only">Word Scramble Game</DialogTitle>

          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Type className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-amber-400">Word Scramble</h2>
                  <p className="text-xs text-[#8888a0]">Financial terms ko unscramble karo! 🔤</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Difficulty selection */}
          <div className="p-6 space-y-3">
            {(Object.entries(MODE_CONFIG) as [Difficulty, typeof MODE_CONFIG.easy][]).map(([mode, config]) => {
              const highScore = wordScrambleHighScore[mode] || 0;
              const wordCount = WORDS.filter((w) => w.difficulty === mode).length;

              return (
                <motion.button
                  key={mode}
                  onClick={() => startGame(mode)}
                  className="w-full p-4 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-amber-500/30 hover:bg-amber-400/[0.04] transition-all text-left group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{config.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#8888a0]">
                          {wordCount} words
                        </span>
                      </div>
                      <p className="text-xs text-[#8888a0] mt-1">{config.description}</p>
                      <p className="text-xs text-[#8888a0] mt-0.5">🪙 {config.coinsPerWord} coins per word</p>
                    </div>
                    <div className="text-right">
                      {highScore > 0 && (
                        <div className="flex items-center gap-1 text-amber-400">
                          <Trophy className="w-3 h-3" />
                          <span className="text-xs font-bold">{highScore}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-[#8888a0]">Best</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* How to play */}
            <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-sm font-semibold text-amber-400 mb-2">📖 Kaise khelein?</h3>
              <ul className="space-y-1.5 text-xs text-[#8888a0]">
                <li>• Scrambled letters ko correct order mein click karo</li>
                <li>• Galat letter click karke hata sakte ho</li>
                <li>• Hint se pehla letter pata chalega (5 coins)</li>
                <li>• Skip kar sakte ho bina coins ke</li>
                <li>• 3+ streak = 2x coins, 5+ streak = 3x coins! 🔥</li>
                <li>• Aadhe time se pehle solve = +5 bonus coins ⚡</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Render: Result ───────────────────────────────────────
  if (gamePhase === 'result' && gameResult) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { resetGame(); onClose(); } }}>
        <DialogContent className="bg-[#0a0a0f] border-white/[0.06] text-[#e8e8ed] max-w-lg p-0 overflow-hidden">
          <DialogTitle className="sr-only">Word Scramble Results</DialogTitle>

          {/* Header with grade */}
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 px-6 py-6 border-b border-white/[0.06] text-center relative overflow-hidden">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <div className={`text-6xl font-black ${getGradeColor(gameResult.grade)}`}>
                {gameResult.grade}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl mt-2"
            >
              {getGradeEmoji(gameResult.grade)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-[#8888a0] mt-2">
                {gameResult.grade === 'S' ? 'Shaandaar performance!' :
                 gameResult.grade === 'A' ? 'Bahut badhiya!' :
                 gameResult.grade === 'B' ? 'Accha kaam kiya!' :
                 gameResult.grade === 'C' ? 'Aur practice karo!' :
                 'Koshish acchi thi!'}
              </p>
            </motion.div>

            {/* Decorative particles for S grade */}
            {gameResult.grade === 'S' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
                    style={{ left: `${10 + Math.random() * 80}%`, top: `${20 + Math.random() * 60}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 1.5, delay: 0.8 + i * 0.1, repeat: Infinity, repeatDelay: 2 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-4 rounded-xl bg-amber-400/[0.06] border border-amber-500/10"
            >
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-[#8888a0]">Total Coins Earned</span>
              </div>
              <motion.span
                className="text-2xl font-black text-amber-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
              >
                {gameResult.coinsEarned}
              </motion.span>
            </motion.div>

            {/* Other stats */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              >
                <p className="text-xs text-[#8888a0]">Words Solved</p>
                <p className="text-xl font-bold text-[#e8e8ed] mt-1">
                  {gameResult.wordsSolved}/{gameResult.totalWords}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
              >
                <p className="text-xs text-[#8888a0]">Best Streak</p>
                <p className="text-xl font-bold text-[#e8e8ed] mt-1">
                  🔥 {gameResult.bestStreak}
                </p>
              </motion.div>
            </div>

            {/* High score badge */}
            {wordScrambleHighScore[difficulty] === gameResult.score && gameResult.score > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-amber-400/10 border border-amber-500/20"
              >
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">New High Score! 🎉</span>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={resetGame}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#8888a0] hover:text-[#e8e8ed] hover:bg-white/[0.06] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Menu</span>
              </motion.button>
              <motion.button
                onClick={() => startGame(difficulty)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">Play Again</span>
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Render: Playing ──────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { resetGame(); onClose(); } }}>
      <DialogContent className="bg-[#0a0a0f] border-white/[0.06] text-[#e8e8ed] max-w-lg p-0 overflow-hidden">
        <DialogTitle className="sr-only">Word Scramble - Playing</DialogTitle>

        {/* Timer bar */}
        <div className="h-1.5 bg-white/[0.04]">
          <motion.div
            className={`h-full bg-gradient-to-r ${timerColor} rounded-r-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${timerProgress * 100}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
          />
        </div>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-[#8888a0]">
              {MODE_CONFIG[difficulty].label} • {currentWordIndex + 1}/{gameWords.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak */}
            <motion.div
              key={`streak-${streak}`}
              initial={{ scale: 1 }}
              animate={streak >= 3 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1"
            >
              <Flame className={`w-4 h-4 ${streak >= 3 ? 'text-orange-400' : streak >= 1 ? 'text-amber-400' : 'text-[#8888a0]'}`} />
              <span className={`text-xs font-bold ${streak >= 3 ? 'text-orange-400' : 'text-[#8888a0]'}`}>
                {streak}
              </span>
              {streak >= 3 && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-bold text-orange-400"
                >
                  {streak >= 5 ? '3x' : '2x'}
                </motion.span>
              )}
            </motion.div>

            {/* Score */}
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">{score}</span>
            </div>

            {/* Close */}
            <button
              onClick={() => { resetGame(); onClose(); }}
              className="p-1.5 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game area */}
        <div className="p-5 space-y-5">
          {/* Timer display */}
          <div className="flex items-center justify-center gap-2">
            <Timer className={`w-4 h-4 ${timerProgress > 0.5 ? 'text-amber-400' : timerProgress > 0.25 ? 'text-orange-400' : 'text-red-400'}`} />
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-lg font-bold tabular-nums ${timerProgress > 0.5 ? 'text-amber-400' : timerProgress > 0.25 ? 'text-orange-400' : 'text-red-400'}`}
            >
              {timeLeft}s
            </motion.span>
          </div>

          {/* Hint text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-xs text-[#8888a0] bg-white/[0.03] px-3 py-1.5 rounded-full">
              💡 Hint: {currentWord?.hint}
            </span>
          </motion.div>

          {/* Answer slots */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {selectedLetters.map((letter, idx) => (
              <motion.button
                key={`slot-${idx}`}
                onClick={() => handlePlacedLetterClick(idx)}
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold transition-all
                  ${letter !== null
                    ? showCorrect
                      ? 'border-emerald-400/50 bg-emerald-400/20 text-emerald-400'
                      : showWrong
                        ? 'border-red-400/50 bg-red-400/20 text-red-400'
                        : 'bg-amber-400/20 border border-amber-500/30 text-amber-400 cursor-pointer hover:bg-amber-400/30'
                    : 'bg-white/[0.03] border border-white/[0.08] text-transparent'
                  }
                `}
                whileHover={letter !== null && !showCorrect ? { scale: 1.05 } : {}}
                whileTap={letter !== null && !showCorrect ? { scale: 0.92 } : {}}
                layout
              >
                {letter || '_'}
              </motion.button>
            ))}
          </div>

          {/* Scrambled letter tiles */}
          <div className="relative">
            {/* Confetti */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(20)].map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={i * 0.03}
                    x={20 + Math.random() * 60}
                    color={confettiColors[i % confettiColors.length]}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {scrambledLetters.map((letter, idx) => {
                const isUsed = usedIndices.has(idx);

                return (
                  <motion.button
                    key={`letter-${idx}`}
                    onClick={() => handleLetterClick(idx)}
                    disabled={isUsed || showCorrect}
                    className={`w-11 h-13 sm:w-13 sm:h-15 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all shadow-lg
                      ${isUsed
                        ? 'bg-white/[0.02] border border-white/[0.04] text-white/20 cursor-not-allowed scale-90'
                        : 'bg-white/[0.06] border border-white/[0.1] text-[#e8e8ed] cursor-pointer hover:bg-amber-400/20 hover:border-amber-500/30 hover:text-amber-400'
                      }
                    `}
                    whileHover={!isUsed ? { scale: 1.08, y: -2 } : {}}
                    whileTap={!isUsed ? { scale: 0.88 } : {}}
                    initial={{ opacity: 0, y: 20, rotate: -10 }}
                    animate={{
                      opacity: isUsed ? 0.3 : 1,
                      y: 0,
                      rotate: 0,
                      scale: isUsed ? 0.85 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: idx * 0.03 }}
                  >
                    {letter}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <motion.button
              onClick={handleHint}
              disabled={hintUsed || coins < 5}
              className={`flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium transition-all
                ${hintUsed || coins < 5
                  ? 'bg-white/[0.02] border border-white/[0.04] text-white/20 cursor-not-allowed'
                  : 'bg-white/[0.04] border border-white/[0.08] text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/10'
                }
              `}
              whileHover={!hintUsed && coins >= 5 ? { scale: 1.03 } : {}}
              whileTap={!hintUsed && coins >= 5 ? { scale: 0.95 } : {}}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint (5🪙)</span>
            </motion.button>

            <motion.button
              onClick={handleSkip}
              className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-[#8888a0] hover:text-[#e8e8ed] hover:bg-white/[0.06] transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </motion.button>
          </div>

          {/* Correct/Wrong feedback */}
          <AnimatePresence>
            {showCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">Sahi jawaab! 🎉</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showWrong && (
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-400/10 border border-red-500/20">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-400">Galat! Try again 😅</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
