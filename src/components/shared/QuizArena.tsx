'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Zap, Clock, Shield, Timer, Flame, Trophy, Share2,
  RotateCcw, ChevronRight, CheckCircle2, XCircle, Star,
  BookOpen, Skull, Gauge, ArrowRight, Copy, Check,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { quizQuestions } from '@/lib/data/quiz-data';
import { modules } from '@/lib/data/modules';
import type { QuizQuestion } from '@/lib/types';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type QuizMode = 'quickfire' | 'mastery' | 'survival' | 'speedrun';

interface QuizModeInfo {
  id: QuizMode;
  title: string;
  titleEn: string;
  description: string;
  icon: typeof Zap;
  color: string;
  bgGradient: string;
  timerSeconds: number;
  questionCount: string;
}

interface AnswerRecord {
  questionId: string;
  correct: boolean;
  timeTaken: number;
  pointsEarned: number;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const QUIZ_MODES: QuizModeInfo[] = [
  {
    id: 'quickfire',
    title: 'Quick Fire',
    titleEn: 'Timed Challenge',
    description: '10 random sawaal, 15 second har sawaal — tezi dikhao!',
    icon: Zap,
    color: '#f59e0b',
    bgGradient: 'from-amber-500/20 via-amber-400/10 to-orange-500/20',
    timerSeconds: 15,
    questionCount: '10',
  },
  {
    id: 'mastery',
    title: 'Module Mastery',
    titleEn: 'Deep Learning',
    description: 'Ek module ke saare sawaal — koi timer nahi, apni speed pe seekho!',
    icon: BookOpen,
    color: '#22c55e',
    bgGradient: 'from-green-500/20 via-emerald-400/10 to-green-500/20',
    timerSeconds: 0,
    questionCount: '4',
  },
  {
    id: 'survival',
    title: 'Survival Mode',
    titleEn: 'Last Man Standing',
    description: 'Ek galat jawaab aur game over — kitne sawaal tak bachoge?',
    icon: Skull,
    color: '#ef4444',
    bgGradient: 'from-red-500/20 via-red-400/10 to-orange-500/20',
    timerSeconds: 20,
    questionCount: '∞',
  },
  {
    id: 'speedrun',
    title: 'Speed Run',
    titleEn: 'Race the Clock',
    description: 'Saare 44 sawaal jaldi se jaldi solve karo — time pe race!',
    icon: Gauge,
    color: '#a855f7',
    bgGradient: 'from-purple-500/20 via-purple-400/10 to-fuchsia-500/20',
    timerSeconds: 0,
    questionCount: '44',
  },
];

const STREAK_MULTIPLIERS = [
  { min: 0, multiplier: 1, label: '1x' },
  { min: 2, multiplier: 2, label: '2x' },
  { min: 3, multiplier: 3, label: '3x' },
  { min: 5, multiplier: 5, label: '5x' },
];

const CONFETTI_MILESTONES = [5, 10, 15, 20, 25, 30, 35, 40];

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/25' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
};

function getMultiplier(streak: number): { multiplier: number; label: string } {
  let result = STREAK_MULTIPLIERS[0];
  for (const m of STREAK_MULTIPLIERS) {
    if (streak >= m.min) result = m;
  }
  return result;
}

function getGrade(accuracy: number): { grade: string; color: string; glow: string } {
  if (accuracy >= 95) return { grade: 'S', color: '#f59e0b', glow: '0 0 30px rgba(245,158,11,0.5)' };
  if (accuracy >= 80) return { grade: 'A', color: '#22c55e', glow: '0 0 20px rgba(34,197,94,0.4)' };
  if (accuracy >= 60) return { grade: 'B', color: '#3b82f6', glow: '0 0 15px rgba(59,130,246,0.3)' };
  if (accuracy >= 40) return { grade: 'C', color: '#f97316', glow: '0 0 10px rgba(249,115,22,0.3)' };
  return { grade: 'D', color: '#ef4444', glow: '0 0 10px rgba(239,68,68,0.3)' };
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ================================================================== */
/*  Confetti Component                                                 */
/* ================================================================== */

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: ['#f59e0b', '#fbbf24', '#22c55e', '#ef4444', '#a855f7', '#3b82f6'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
    duration: 0.8 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '40%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -150 - Math.random() * 200, opacity: 0, scale: 0.3, x: (Math.random() - 0.5) * 150 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Timer Bar Component                                                */
/* ================================================================== */

function TimerBar({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const pct = maxTime > 0 ? (timeLeft / maxTime) * 100 : 100;
  const isUrgent = pct < 25;

  return (
    <div className="w-full h-2 rounded-full bg-[#1a1a2e] overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${isUrgent ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500'}`}
        initial={{ width: '100%' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{
          boxShadow: isUrgent
            ? '0 0 10px rgba(239,68,68,0.5)'
            : '0 0 10px rgba(245,158,11,0.4)',
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Streak Flame Component                                             */
/* ================================================================== */

function StreakFlame({ streak }: { streak: number }) {
  const { label } = getMultiplier(streak);
  const flameSize = Math.min(20 + streak * 2, 40);

  return (
    <motion.div
      key={`streak-${streak}`}
      className="flex items-center gap-1.5"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
      >
        <Flame
          width={flameSize}
          height={flameSize}
          className={streak >= 5 ? 'text-amber-400' : streak >= 3 ? 'text-orange-400' : 'text-orange-500/70'}
          style={{
            filter: streak >= 5
              ? 'drop-shadow(0 0 8px rgba(245,158,11,0.6))'
              : streak >= 3
                ? 'drop-shadow(0 0 5px rgba(249,115,22,0.4))'
                : 'none',
          }}
        />
      </motion.div>
      <div className="flex flex-col items-start leading-none">
        <span className="text-xs text-[#8888a0]">Streak</span>
        <motion.span
          key={`mult-${label}`}
          initial={{ scale: 1.5, color: '#f59e0b' }}
          animate={{ scale: 1, color: streak >= 5 ? '#f59e0b' : '#e8e8ed' }}
          className="text-sm font-extrabold number-highlight"
        >
          {streak} · {label}
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Results Screen                                                     */
/* ================================================================== */

function ResultsScreen({
  mode,
  answers,
  totalPoints,
  bestStreak,
  timeTaken,
  onPlayAgain,
  onContinue,
}: {
  mode: QuizMode;
  answers: AnswerRecord[];
  totalPoints: number;
  bestStreak: number;
  timeTaken: number;
  onPlayAgain: () => void;
  onContinue: () => void;
}) {
  const { addCoins, setQuizArenaHighScore, setQuizArenaBestStreak, addBadge, quizArenaHighScores } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [animCoins, setAnimCoins] = useState(0);
  const constCompleted = useMemo(() => answers, [answers]);

  const correctCount = constCompleted.filter((a) => a.correct).length;
  const totalCount = constCompleted.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const grade = getGrade(accuracy);
  const coinReward = Math.floor(totalPoints / 5);
  const isHighScore = totalPoints > (quizArenaHighScores[mode] || 0);

  // Coin counting animation
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(coinReward / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, coinReward);
      setAnimCoins(current);
      if (current >= coinReward) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [coinReward]);

  // Award coins, badges, and update high scores on mount
  useEffect(() => {
    addCoins(coinReward);
    setQuizArenaHighScore(mode, totalPoints);
    setQuizArenaBestStreak(bestStreak);
    if (mode === 'quickfire' && accuracy >= 90 && !useAppStore.getState().badges.includes('quiz-ace')) {
      addBadge('quiz-ace');
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const shareText = `🎯 RUPAIYA 101 Quiz Arena!\n\n🔥 Mode: ${QUIZ_MODES.find((m) => m.id === mode)?.title}\n⭐ Score: ${totalPoints} points\n✅ Accuracy: ${accuracy}% (${correctCount}/${totalCount})\n🔥 Best Streak: ${bestStreak}\n⏱️ Time: ${formatTime(timeTaken)}\n🎓 Grade: ${grade.grade}\n\nBhi tu financial literacy test le! 🇮🇳💰`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center px-4 py-6 space-y-6 text-center"
    >
      {/* Confetti on good grade */}
      <ConfettiBurst active={accuracy >= 80} />

      {/* Grade Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="relative"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center border-4"
          style={{
            borderColor: grade.color,
            boxShadow: grade.glow,
            background: `radial-gradient(circle, ${grade.color}20, transparent)`,
          }}
        >
          <span
            className="text-5xl font-black"
            style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}60` }}
          >
            {grade.grade}
          </span>
        </div>
        {isHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -top-2 -right-2 bg-amber-500 rounded-full px-2 py-0.5 text-[9px] font-bold text-[#0a0a0f]"
          >
            NEW BEST!
          </motion.div>
        )}
      </motion.div>

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-white">
          {accuracy >= 80 ? ' Wah! Kamaal kar diya! 🔥' : accuracy >= 50 ? ' Accha gaya! Aur practice karo! 💪' : ' Koshish acchi thi! Phir se try karo! 🙌'}
        </h3>
        <p className="text-sm text-[#8888a0] mt-1">
          {QUIZ_MODES.find((m) => m.id === mode)?.title} complete!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {[
          { label: 'Total Points', value: totalPoints.toString(), icon: Trophy, color: '#f59e0b' },
          { label: 'Accuracy', value: `${accuracy}%`, icon: CheckCircle2, color: accuracy >= 60 ? '#22c55e' : '#ef4444' },
          { label: 'Best Streak', value: bestStreak.toString(), icon: Flame, color: '#f97316' },
          { label: 'Time Taken', value: formatTime(timeTaken), icon: Clock, color: '#a855f7' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card-glow p-3 flex items-center gap-2.5"
          >
            <stat.icon className="w-4 h-4 shrink-0" style={{ color: stat.color }} />
            <div className="text-left">
              <div className="text-[10px] text-[#8888a0]">{stat.label}</div>
              <div className="text-sm font-bold text-white number-highlight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Correct/Wrong breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-4 text-sm"
      >
        <span className="flex items-center gap-1.5 text-green-400">
          <CheckCircle2 className="w-4 h-4" /> {correctCount} Sahi
        </span>
        <span className="flex items-center gap-1.5 text-red-400">
          <XCircle className="w-4 h-4" /> {totalCount - correctCount} Galat
        </span>
      </motion.div>

      {/* Coin reward */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-500/20 px-6 py-4"
      >
        <div className="text-xs text-[#8888a0] mb-1">Coin Reward</div>
        <div className="text-3xl font-black text-amber-400 number-highlight">
          +{animCoins} 🪙
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <motion.button
          onClick={onPlayAgain}
          className="btn-gold flex items-center justify-center gap-2 w-full py-3 text-sm rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Phir se khelo
        </motion.button>

        <motion.button
          onClick={onContinue}
          className="btn-ghost-gold flex items-center justify-center gap-2 w-full py-3 text-sm rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Aage badho
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs text-[#8888a0] hover:text-amber-400 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Score share karo'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main QuizArena Component                                           */
/* ================================================================== */

interface QuizArenaProps {
  open: boolean;
  onClose: () => void;
}

type Phase = 'mode-select' | 'module-select' | 'playing' | 'result';

export function QuizArena({ open, onClose }: QuizArenaProps) {
  const { quizArenaHighScores, quizArenaBestStreak } = useAppStore();

  // Phase management
  const [phase, setPhase] = useState<Phase>('mode-select');
  const [selectedMode, setSelectedMode] = useState<QuizMode>('quickfire');
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);

  // Game state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [survivalEnded, setSurvivalEnded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Current question
  const currentQuestion = questions[currentIndex] || null;

  // Mode info
  const modeInfo = QUIZ_MODES.find((m) => m.id === selectedMode)!;

  // Helper: reset all game state
  function resetGameState() {
    setQuestions([]);
    setCurrentIndex(0);
    setStreak(0);
    setBestStreak(0);
    setTotalPoints(0);
    setAnswers([]);
    setTimeLeft(0);
    setStartTime(0);
    setQuestionStartTime(0);
    setTotalTime(0);
    setIsAnswered(false);
    setSelectedOption(null);
    setShowConfetti(false);
    setSurvivalEnded(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  // Advance to next question (defined early so handleTimeUp can reference it)
  const advanceQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;

    // Check if quiz is complete
    if (selectedMode === 'quickfire' && nextIndex >= 10) {
      setTotalTime((Date.now() - startTime) / 1000);
      setPhase('result');
      return;
    }
    if (selectedMode === 'mastery' && nextIndex >= questions.length) {
      setTotalTime((Date.now() - startTime) / 1000);
      setPhase('result');
      return;
    }
    if (selectedMode === 'speedrun' && nextIndex >= questions.length) {
      setTotalTime((Date.now() - startTime) / 1000);
      setPhase('result');
      return;
    }
    if (selectedMode === 'survival') {
      if (survivalEnded) return;
      if (nextIndex >= questions.length) {
        setQuestions((prev) => [...prev, ...shuffleArray(quizQuestions)]);
      }
    }

    setCurrentIndex(nextIndex);
    setIsAnswered(false);
    setSelectedOption(null);
    setTimeLeft(modeInfo.timerSeconds);
    setQuestionStartTime(Date.now());
  }, [currentIndex, selectedMode, questions.length, startTime, survivalEnded, modeInfo.timerSeconds]);

  // Handle time running out
  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1);

    const record: AnswerRecord = {
      questionId: currentQuestion?.id || '',
      correct: false,
      timeTaken: modeInfo.timerSeconds,
      pointsEarned: 0,
    };

    setStreak(0);
    setAnswers((prev) => [...prev, record]);

    // Survival mode: game over on wrong
    if (selectedMode === 'survival') {
      setSurvivalEnded(true);
      setTimeout(() => setPhase('result'), 2500);
      return;
    }

    // Show correct answer for 3 seconds, then move on
    setTimeout(() => {
      advanceQuestion();
    }, 3000);
  }, [isAnswered, currentQuestion, modeInfo.timerSeconds, selectedMode, advanceQuestion]);

  // Timer logic
  useEffect(() => {
    if (phase !== 'playing' || isAnswered || !currentQuestion) return;
    if (modeInfo.timerSeconds === 0) return; // No timer mode

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex, isAnswered, handleTimeUp, currentQuestion, modeInfo.timerSeconds]);

  // Total time tracker for speed run
  useEffect(() => {
    if (phase === 'playing' && modeInfo.timerSeconds === 0) {
      const interval = setInterval(() => {
        setTotalTime((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase, startTime, modeInfo.timerSeconds]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setPhase('mode-select');
      resetGameState();
    }
  }, [open]);

  function startQuiz(mode: QuizMode, moduleId?: number) {
    resetGameState();
    setSelectedMode(mode);
    let qs: QuizQuestion[] = [];

    switch (mode) {
      case 'quickfire': {
        qs = shuffleArray(quizQuestions).slice(0, 10);
        break;
      }
      case 'mastery': {
        qs = quizQuestions.filter((q) => q.moduleId === (moduleId ?? 1));
        break;
      }
      case 'survival': {
        qs = shuffleArray(quizQuestions);
        break;
      }
      case 'speedrun': {
        qs = shuffleArray(quizQuestions);
        break;
      }
    }

    setQuestions(qs);
    setCurrentIndex(0);
    setTimeLeft(QUIZ_MODES.find((m) => m.id === mode)!.timerSeconds);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setPhase('playing');
  }

  function handleAnswer(optionIndex: number) {
    if (isAnswered || !currentQuestion) return;
    setIsAnswered(true);
    setSelectedOption(optionIndex);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const { multiplier } = getMultiplier(streak);

    // Points calculation
    let points = 0;
    if (isCorrect) {
      points = 10; // base
      if (modeInfo.timerSeconds > 0 && timeTaken < modeInfo.timerSeconds * 0.5) {
        points += 5; // speed bonus
      }
      points *= multiplier;
    }

    const newStreak = isCorrect ? streak + 1 : 0;
    const newBestStreak = Math.max(bestStreak, newStreak);
    setStreak(newStreak);
    setBestStreak(newBestStreak);
    setTotalPoints((prev) => prev + points);

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      correct: isCorrect,
      timeTaken,
      pointsEarned: points,
    };
    setAnswers((prev) => [...prev, record]);

    // Confetti on milestones
    if (isCorrect && CONFETTI_MILESTONES.includes(newStreak)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    }

    // Survival mode: game over on wrong
    if (selectedMode === 'survival' && !isCorrect) {
      setSurvivalEnded(true);
      setTimeout(() => setPhase('result'), 2500);
      return;
    }

    // Show correct/wrong feedback, then advance
    const delay = isCorrect ? 1200 : 3000;
    setTimeout(() => {
      advanceQuestion();
    }, delay);
  }

  // Progress calculation
  const progressPct = useMemo(() => {
    if (selectedMode === 'survival') return 0; // No end
    const total = selectedMode === 'quickfire' ? 10 : selectedMode === 'speedrun' ? questions.length : questions.length;
    return total > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / total) * 100 : 0;
  }, [selectedMode, currentIndex, isAnswered, questions.length]);

  // ====== RENDER ======

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-x-3 top-[3vh] bottom-[3vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-[#0a0a0f] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="shrink-0 px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/15 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Quiz Arena</h2>
                    <p className="text-[10px] text-[#8888a0]">Apni financial knowledge test karo!</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Quiz Arena"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ====== MODE SELECT ====== */}
                {phase === 'mode-select' && (
                  <motion.div
                    key="mode-select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 space-y-4"
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-gradient-gold">Mode Chuno!</h3>
                      <p className="text-xs text-[#8888a0]">Har mode ka apna mazaa hai</p>
                    </div>

                    {QUIZ_MODES.map((mode, idx) => {
                      const Icon = mode.icon;
                      const highScore = quizArenaHighScores[mode.id] || 0;

                      return (
                        <motion.button
                          key={mode.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          onClick={() => {
                            if (mode.id === 'mastery') {
                              setSelectedMode(mode.id);
                              setPhase('module-select');
                            } else {
                              startQuiz(mode.id);
                            }
                          }}
                          className={`w-full glass-card-glow p-4 text-left hover:border-amber-500/25 transition-all group`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${mode.color}15` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: mode.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                                  {mode.title}
                                </h4>
                                <div className="flex items-center gap-1.5">
                                  {mode.timerSeconds > 0 && (
                                    <Timer className="w-3 h-3 text-[#8888a0]" />
                                  )}
                                  <span className="text-[10px] text-[#8888a0]">{mode.questionCount} sawaal</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-[#8888a0] mt-0.5 leading-relaxed">
                                {mode.description}
                              </p>
                              {highScore > 0 && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  <Trophy className="w-3 h-3 text-amber-400" />
                                  <span className="text-[10px] text-amber-400 font-medium">Best: {highScore} pts</span>
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8888a0] group-hover:text-amber-400 transition-colors shrink-0 mt-1" />
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* All-time best streak */}
                    {quizArenaBestStreak > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center pt-2"
                      >
                        <span className="text-[10px] text-[#8888a0]">
                          🔥 All-time Best Streak: <span className="text-amber-400 font-bold">{quizArenaBestStreak}</span>
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ====== MODULE SELECT ====== */}
                {phase === 'module-select' && (
                  <motion.div
                    key="module-select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => setPhase('mode-select')}
                        className="p-1.5 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        ←
                      </button>
                      <h3 className="text-base font-bold text-white">Module Chuno</h3>
                    </div>
                    <p className="text-xs text-[#8888a0] -mt-1 ml-9">Kis module pe mastery test karni hai?</p>

                    <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                      {modules.map((mod, idx) => {
                        const questionCount = quizQuestions.filter((q) => q.moduleId === mod.id).length;
                        return (
                          <motion.button
                            key={mod.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            onClick={() => startQuiz('mastery', mod.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              selectedModuleId === mod.id
                                ? 'bg-amber-400/10 border-amber-500/20'
                                : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.08]'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${mod.color}15` }}
                            >
                              <span className="text-xs font-bold" style={{ color: mod.color }}>{mod.id}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-xs font-semibold text-white truncate">{mod.title}</div>
                              <div className="text-[10px] text-[#8888a0]">{mod.titleEn}</div>
                            </div>
                            <span className="text-[10px] text-[#8888a0]">{questionCount} Q</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ====== PLAYING ====== */}
                {phase === 'playing' && currentQuestion && (
                  <motion.div
                    key={`playing-${currentIndex}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 space-y-4 relative"
                  >
                    <ConfettiBurst active={showConfetti} />

                    {/* Top bar: Progress + Streak + Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#8888a0]">
                            {selectedMode === 'survival'
                              ? `Sawaal ${currentIndex + 1}`
                              : `${currentIndex + (isAnswered ? 1 : 0) + 1}/${selectedMode === 'quickfire' ? 10 : questions.length}`}
                          </span>
                          {/* Difficulty badge */}
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${DIFFICULTY_CONFIG[currentQuestion.difficulty].bg} ${DIFFICULTY_CONFIG[currentQuestion.difficulty].text} ${DIFFICULTY_CONFIG[currentQuestion.difficulty].border} border`}>
                            {DIFFICULTY_CONFIG[currentQuestion.difficulty].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {streak > 0 && <StreakFlame streak={streak} />}
                          <div className="text-right">
                            <span className="text-[10px] text-[#8888a0] block">Score</span>
                            <span className="text-sm font-bold text-amber-400 number-highlight">{totalPoints}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {selectedMode !== 'survival' && (
                        <div className="w-full h-1.5 rounded-full bg-[#1a1a2e] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.4 }}
                            style={{ boxShadow: '0 0 8px rgba(245,158,11,0.3)' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Timer */}
                    {modeInfo.timerSeconds > 0 && !isAnswered && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span className={`text-xs font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-amber-400'}`}>
                              {timeLeft}s
                            </span>
                          </div>
                        </div>
                        <TimerBar timeLeft={timeLeft} maxTime={modeInfo.timerSeconds} />
                      </div>
                    )}

                    {/* Speed Run: Total time display */}
                    {selectedMode === 'speedrun' && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span className="text-xs font-bold text-purple-400 number-highlight">
                          {totalTime.toFixed(1)}s
                        </span>
                      </div>
                    )}

                    {/* Question Card */}
                    <motion.div
                      className="glass-card-glow p-5 relative overflow-hidden"
                      style={{ perspective: '1000px' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`q-${currentQuestion.id}`}
                          initial={{ rotateY: 90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                          {/* Module tag */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-[#8888a0]">
                              Module {currentQuestion.moduleId}
                            </span>
                          </div>

                          {/* Question text */}
                          <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                            {currentQuestion.question}
                          </h3>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    {/* Answer Options */}
                    <div className="space-y-2.5">
                      {currentQuestion.options.map((option, idx) => {
                        const isCorrect = idx === currentQuestion.correctIndex;
                        const isSelected = selectedOption === idx;
                        let optionStyle = 'bg-[#1a1a2e] border-white/[0.06] hover:border-amber-500/25 hover:bg-[#1e1e30]';
                        let iconEl: React.ReactNode = null;

                        if (isAnswered) {
                          if (isCorrect) {
                            optionStyle = 'bg-green-500/10 border-green-500/30';
                            iconEl = <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />;
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-red-500/10 border-red-500/30';
                            iconEl = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
                          } else {
                            optionStyle = 'bg-[#1a1a2e]/50 border-white/[0.04] opacity-50';
                          }
                        }

                        return (
                          <motion.button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={isAnswered}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${optionStyle} ${!isAnswered ? 'hover:-translate-y-0.5 active:translate-y-0' : ''}`}
                            whileHover={!isAnswered ? { scale: 1.01 } : {}}
                            whileTap={!isAnswered ? { scale: 0.99 } : {}}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isAnswered && isCorrect
                                ? 'bg-green-500/20 text-green-400'
                                : isAnswered && isSelected && !isCorrect
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-white/[0.06] text-[#8888a0]'
                            }`}>
                              {isAnswered && isCorrect ? '✓' : isAnswered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + idx)}
                            </span>
                            <span className={`text-xs sm:text-sm flex-1 ${
                              isAnswered && isCorrect
                                ? 'text-green-300'
                                : isAnswered && isSelected && !isCorrect
                                  ? 'text-red-300'
                                  : 'text-[#c0c0d0]'
                            }`}>
                              {option}
                            </span>
                            {iconEl}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explanation (after answering) */}
                    <AnimatePresence>
                      {isAnswered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`rounded-xl p-4 border ${
                            selectedOption === currentQuestion.correctIndex
                              ? 'bg-green-500/5 border-green-500/15'
                              : 'bg-amber-500/5 border-amber-500/15'
                          }`}>
                            <div className="flex items-start gap-2.5">
                              {selectedOption === currentQuestion.correctIndex ? (
                                <Star className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                                  selectedOption === currentQuestion.correctIndex ? 'text-green-400' : 'text-amber-400'
                                }`}>
                                  {selectedOption === currentQuestion.correctIndex ? 'Sahi jawaab! 🎉' : 'Sahi jawaab yeh hai:'}
                                </span>
                                <p className="text-[11px] text-[#c0c0d0] leading-relaxed mt-1">
                                  {currentQuestion.explanation}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Points earned */}
                          {answers.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mt-2 flex items-center justify-center gap-2"
                            >
                              {answers[answers.length - 1].pointsEarned > 0 ? (
                                <span className="text-xs font-bold text-amber-400 number-highlight">
                                  +{answers[answers.length - 1].pointsEarned} pts
                                  {getMultiplier(streak).multiplier > 1 && (
                                    <span className="text-[10px] text-[#8888a0] ml-1">
                                      ({getMultiplier(streak).label} combo)
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-red-400">Streak reset! 😢</span>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Survival: Game Over overlay */}
                    {survivalEnded && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Skull className="w-16 h-16 text-red-500" style={{ filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5))' }} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-red-400 mt-4">Game Over!</h3>
                        <p className="text-sm text-[#8888a0] mt-1">
                          {answers.filter((a) => a.correct).length} sawaal tak bache
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ====== RESULTS ====== */}
                {phase === 'result' && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ResultsScreen
                      mode={selectedMode}
                      answers={answers}
                      totalPoints={totalPoints}
                      bestStreak={bestStreak}
                      timeTaken={totalTime || (Date.now() - startTime) / 1000}
                      onPlayAgain={() => startQuiz(selectedMode, selectedModuleId)}
                      onContinue={() => {
                        setPhase('mode-select');
                        resetGameState();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
