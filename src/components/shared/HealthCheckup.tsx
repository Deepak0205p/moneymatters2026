'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────
interface HealthCheckupProps {
  open: boolean;
  onClose: () => void;
}

// ─── Types ──────────────────────────────────────────────────
type GameState = 'idle' | 'playing' | 'results';

interface QuizOption {
  text: string;
  score: number;
  emoji: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

// ─── Questions Data ─────────────────────────────────────────
const healthQuestions: QuizQuestion[] = [
  {
    id: 'emergency',
    question: 'Emergency fund kitna hai?',
    subtitle: '3-6 mahine ka kharcha cover karta hai?',
    options: [
      { text: 'Koi emergency fund nahi', score: 1, emoji: '😰' },
      { text: '1 mahine ka hai', score: 2, emoji: '😐' },
      { text: '3 mahine ka hai', score: 3, emoji: '😊' },
      { text: '6+ mahine ka hai', score: 4, emoji: '🤩' },
    ],
  },
  {
    id: 'budgeting',
    question: 'Monthly budget follow karte ho?',
    subtitle: 'Kharcha plan karke karte ho ya random?',
    options: [
      { text: 'Budget? Kya hota hai!', score: 1, emoji: '🙈' },
      { text: 'Dimag me hai, paper pe nahi', score: 2, emoji: '🤔' },
      { text: 'Haan, basic budget banata hu', score: 3, emoji: '📝' },
      { text: 'Detail me track karta hu', score: 4, emoji: '✅' },
    ],
  },
  {
    id: 'savings',
    question: 'Mahine me kitna bachate ho?',
    subtitle: 'Income ka kitna percent save hota hai?',
    options: [
      { text: 'Kuch nahi bach paata', score: 1, emoji: '💸' },
      { text: '10% se kam', score: 2, emoji: '🪙' },
      { text: '10-20% bachata hu', score: 3, emoji: '💰' },
      { text: '20% se zyada!', score: 4, emoji: '🏦' },
    ],
  },
  {
    id: 'debt',
    question: 'Karza (debt) me kitne ho?',
    subtitle: 'Personal loans, credit card bills, EMI?',
    options: [
      { text: 'Bahut saara debt hai', score: 1, emoji: '😱' },
      { text: 'Kuch hai, handle kar pa raha', score: 2, emoji: '😅' },
      { text: 'Bas ek chhota loan', score: 3, emoji: '😌' },
      { text: 'Koi debt nahi!', score: 4, emoji: '🎉' },
    ],
  },
  {
    id: 'investing',
    question: 'Investment karte ho?',
    subtitle: 'SIP, FD, mutual fund, stocks?',
    options: [
      { text: 'Investment? Nahi samajhta', score: 1, emoji: '🤷' },
      { text: 'Bas FD/Saving account', score: 2, emoji: '🏧' },
      { text: 'Haan, SIP chalata hu', score: 3, emoji: '📈' },
      { text: 'Diversified portfolio hai!', score: 4, emoji: '🚀' },
    ],
  },
  {
    id: 'insurance',
    question: 'Insurance coverage hai?',
    subtitle: 'Health insurance, term plan?',
    options: [
      { text: 'Koi insurance nahi', score: 1, emoji: '⚠️' },
      { text: 'Bas health insurance', score: 2, emoji: '🏥' },
      { text: 'Health + Life dono', score: 3, emoji: '🛡️' },
      { text: 'Complete coverage + riders', score: 4, emoji: '🦸' },
    ],
  },
  {
    id: 'goals',
    question: 'Financial goals set hain?',
    subtitle: 'Short-term aur long-term plans?',
    options: [
      { text: 'Koi plan nahi, jo ho so ho', score: 1, emoji: '🌀' },
      { text: 'Kuch socha hai, likha nahi', score: 2, emoji: '💭' },
      { text: 'Haan, clear goals hain', score: 3, emoji: '🎯' },
      { text: 'Goals + timeline + tracking', score: 4, emoji: '🏆' },
    ],
  },
  {
    id: 'knowledge',
    question: 'Financial knowledge kaisi hai?',
    subtitle: 'Tax, inflation, compounding samajhte ho?',
    options: [
      { text: 'Sab confusion hai', score: 1, emoji: '😵' },
      { text: 'Basic samajhta hu', score: 2, emoji: '📚' },
      { text: 'Kaafi ache se jaanta hu', score: 3, emoji: '🧠' },
      { text: 'Expert level! Padhai karta rehta', score: 4, emoji: '🎓' },
    ],
  },
];

// ─── Category Icons ─────────────────────────────────────────
const categoryIcons: Record<string, string> = {
  emergency: '🛡️',
  budgeting: '📋',
  savings: '💰',
  debt: '🚪',
  investing: '📈',
  insurance: '🏥',
  goals: '🎯',
  knowledge: '📚',
};

// ─── Recommendations Map ────────────────────────────────────
interface Recommendation {
  icon: string;
  title: string;
  desc: string;
  strategy: number;
}

const recommendationsMap: Record<string, Recommendation> = {
  emergency: {
    icon: '🛡️',
    title: 'Emergency Fund Banao',
    desc: 'Pehle 3 mahine ka kharcha bachao, phir 6 mahine ka target rakho',
    strategy: 4,
  },
  budgeting: {
    icon: '📋',
    title: 'Budgeting Seekho',
    desc: '50/30/20 rule follow karo — needs, wants, savings',
    strategy: 5,
  },
  savings: {
    icon: '🐷',
    title: 'Bachat Badhao',
    desc: 'Income ka kam se kam 20% bachao, SIP start karo',
    strategy: 8,
  },
  debt: {
    icon: '🚪',
    title: 'Debt Se Chutkara',
    desc: 'High-interest debt pehle chukao, credit card bill time pe bharo',
    strategy: 7,
  },
  investing: {
    icon: '📈',
    title: 'Investing Shuru Karo',
    desc: 'SIP se start karo, compounding ka fayda uthao',
    strategy: 8,
  },
  insurance: {
    icon: '🏥',
    title: 'Insurance Lelo',
    desc: 'Health insurance zaroori hai, term plan bhi socho',
    strategy: 9,
  },
  goals: {
    icon: '🎯',
    title: 'Goals Set Karo',
    desc: 'Bina goal ke financial journey kahin nahi jati',
    strategy: 2,
  },
  knowledge: {
    icon: '📚',
    title: 'Seekhte Raho',
    desc: 'Rupaiya 101 ke saare modules complete karo!',
    strategy: 10,
  },
};

// ─── Score Category ─────────────────────────────────────────
function getScoreCategory(score: number): { label: string; color: string } {
  if (score <= 25) return { label: 'Critical! 🚨', color: 'text-red-400' };
  if (score <= 50) return { label: 'Needs Work 🔧', color: 'text-orange-400' };
  if (score <= 75) return { label: 'Getting Better 💪', color: 'text-amber-400' };
  return { label: 'Financial Rockstar! 🌟', color: 'text-green-400' };
}

// ─── Radar Chart Labels ─────────────────────────────────────
const radarLabels: Record<string, string> = {
  emergency: 'Emergency',
  budgeting: 'Budget',
  savings: 'Savings',
  debt: 'Debt',
  investing: 'Investing',
  insurance: 'Insurance',
  goals: 'Goals',
  knowledge: 'Knowledge',
};

// ─── Component ──────────────────────────────────────────────
export default function HealthCheckup({ open, onClose }: HealthCheckupProps) {
  const { healthCheckup, setHealthCheckup, coins } = useAppStore();

  // ── State ────────────────────────────────────────────────
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [showCoinReward, setShowCoinReward] = useState(false);
  const [direction, setDirection] = useState(1);

  const scoreAnimRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  // ── Reset on close ───────────────────────────────────────
  const resetAndClose = useCallback(() => {
    setGameState('idle');
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setDisplayScore(0);
    setFinalScore(0);
    setShowCoinReward(false);
    if (scoreAnimRef.current) {
      cancelAnimationFrame(scoreAnimRef.current);
    }
    onClose();
  }, [onClose]);

  // ── Handle open change ───────────────────────────────────
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetAndClose();
      }
    },
    [resetAndClose]
  );

  // ── Start quiz ───────────────────────────────────────────
  const startQuiz = useCallback(() => {
    setGameState('playing');
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
  }, []);

  // ── Handle answer ────────────────────────────────────────
  const handleAnswer = useCallback(
    (questionId: string, optionScore: number, optionIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIndex);

      const newAnswers = { ...answers, [questionId]: optionScore };
      setAnswers(newAnswers);

      // Auto-advance after 300ms
      setTimeout(() => {
        if (currentQ < healthQuestions.length - 1) {
          setDirection(1);
          setCurrentQ((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          // Calculate final score
          const totalScore = Object.values(newAnswers).reduce((sum, s) => sum + s, 0);
          const maxScore = healthQuestions.length * 4;
          const percentage = Math.round((totalScore / maxScore) * 100);

          const category = getScoreCategory(percentage).label;

          // Generate recommendations for lowest 3 categories
          const sortedCategories = Object.entries(newAnswers).sort(
            ([, a], [, b]) => a - b
          );
          const lowestThree = sortedCategories.slice(0, 3);
          const recommendations = lowestThree.map(
            ([id]) => recommendationsMap[id]?.title || 'Improve your finances'
          );

          const result = {
            score: percentage,
            category,
            answers: newAnswers,
            completedAt: new Date().toISOString(),
            recommendations,
          };

          setFinalScore(percentage);
          setHealthCheckup(result);
          setGameState('results');
        }
      }, 300);
    },
    [selectedOption, answers, currentQ, setHealthCheckup]
  );

  // ── Score counting animation ─────────────────────────────
  useEffect(() => {
    if (gameState !== 'results') return;

    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * finalScore);
      setDisplayScore(current);

      if (progress < 1) {
        scoreAnimRef.current = requestAnimationFrame(animate);
      } else {
        setShowCoinReward(true);
      }
    };

    scoreAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (scoreAnimRef.current) {
        cancelAnimationFrame(scoreAnimRef.current);
      }
    };
  }, [gameState, finalScore]);

  // ── Radar chart data ─────────────────────────────────────
  const radarData = healthQuestions.map((q) => ({
    subject: radarLabels[q.id],
    value: gameState === 'results' ? (answers[q.id] || 0) * 25 : 0,
    fullMark: 100,
  }));

  // ── Get recommendations for results ──────────────────────
  const topRecommendations = (() => {
    if (gameState !== 'results') return [];
    const sorted = Object.entries(answers).sort(([, a], [, b]) => a - b);
    return sorted.slice(0, 3).map(([id]) => recommendationsMap[id]);
  })();

  // ── Score category for display ───────────────────────────
  const scoreInfo = getScoreCategory(displayScore);

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={gameState === 'idle'}
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border-white/[0.06] text-[#e8e8ed] p-0"
      >
        <DialogTitle className="sr-only">Financial Health Checkup</DialogTitle>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ═══════════ IDLE SCREEN ═══════════ */}
            {gameState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center gap-6"
              >
                {/* Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    🏥 Financial Health Checkup
                  </h2>
                  <p className="text-[#a0a0b8] text-sm sm:text-base">
                    Apni financial health ka checkup karo — 8 sawaal, 2 minute!
                  </p>
                </div>

                {/* Previous result */}
                {healthCheckup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full bg-[#1a1a2e] rounded-xl p-4 border border-white/[0.06]"
                  >
                    <p className="text-[#a0a0b8] text-xs mb-1">Pichla Score</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-amber-400">
                        {healthCheckup.score}
                      </span>
                      <div className="text-left">
                        <p className={cn('text-sm font-medium', getScoreCategory(healthCheckup.score).color)}>
                          {healthCheckup.category}
                        </p>
                        <p className="text-[#a0a0b8] text-xs">
                          {new Date(healthCheckup.completedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Category icons preview */}
                <div className="flex flex-wrap justify-center gap-2">
                  {healthQuestions.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i, type: 'spring', stiffness: 200 }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#1a1a2e] border border-white/[0.06] flex items-center justify-center text-lg"
                      title={radarLabels[q.id]}
                    >
                      {categoryIcons[q.id]}
                    </motion.div>
                  ))}
                </div>

                {/* Start button */}
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Button
                    onClick={startQuiz}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 h-auto"
                  >
                    {healthCheckup ? 'Phir se Checkup Karo' : 'Shuru Karo 🚀'}
                  </Button>
                </motion.div>

                <p className="text-[#a0a0b8] text-xs">
                  Complete karo aur +20 coins paao! 🪙
                </p>
              </motion.div>
            )}

            {/* ═══════════ PLAYING SCREEN ═══════════ */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#a0a0b8]">
                      Sawaal {currentQ + 1}/{healthQuestions.length}
                    </span>
                    <span className="text-amber-400 font-medium">
                      {Math.round(((currentQ + 1) / healthQuestions.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={((currentQ + 1) / healthQuestions.length) * 100}
                    className="h-2 bg-[#1a1a2e]"
                  />
                </div>

                {/* Question */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentQ}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#e8e8ed]">
                        {healthQuestions[currentQ].question}
                      </h3>
                      <p className="text-[#a0a0b8] text-sm">
                        {healthQuestions[currentQ].subtitle}
                      </p>
                    </div>

                    {/* Options in 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {healthQuestions[currentQ].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.3 }}
                          onClick={() =>
                            handleAnswer(healthQuestions[currentQ].id, option.score, idx)
                          }
                          disabled={selectedOption !== null}
                          className={cn(
                            'relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left',
                            'bg-[#1a1a2e] border-white/[0.06] hover:border-amber-400/40 hover:scale-[1.02]',
                            'disabled:pointer-events-none',
                            selectedOption === idx
                              ? 'border-amber-400 bg-amber-400/10 scale-[1.02]'
                              : selectedOption !== null
                              ? 'opacity-50'
                              : ''
                          )}
                        >
                          <span className="text-2xl shrink-0">{option.emoji}</span>
                          <span className="text-sm font-medium text-[#e8e8ed] leading-snug">
                            {option.text}
                          </span>
                          {selectedOption === idx && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
                            >
                              <svg
                                className="w-3 h-3 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </motion.span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* ═══════════ RESULTS SCREEN ═══════════ */}
            {gameState === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >
                {/* Score display */}
                <div className="text-center space-y-2">
                  <motion.div
                    className="text-6xl sm:text-7xl font-extrabold text-amber-400"
                    layout
                  >
                    {displayScore}
                  </motion.div>
                  <p className={cn('text-lg font-semibold', scoreInfo.color)}>
                    {scoreInfo.label}
                  </p>
                  <p className="text-[#a0a0b8] text-sm">/100</p>
                </div>

                {/* Coin reward */}
                <AnimatePresence>
                  {showCoinReward && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="text-center"
                    >
                      <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 text-amber-400 text-sm font-medium">
                        🪙 +20 Coins earned!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Radar chart */}
                <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/[0.06]">
                  <h4 className="text-sm font-medium text-[#a0a0b8] mb-2 text-center">
                    Financial Health Radar
                  </h4>
                  <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid
                          stroke="rgba(255,255,255,0.06)"
                          strokeDasharray="3 3"
                        />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fill: '#a0a0b8',
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          animationDuration={1200}
                          animationEasing="ease-out"
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#e8e8ed]">
                    Tumhare Liye Recommendations 🎯
                  </h4>
                  <div className="space-y-3">
                    {topRecommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                        className="bg-[#1a1a2e] rounded-xl p-4 border border-white/[0.06] flex gap-3"
                      >
                        <span className="text-2xl shrink-0">{rec.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-[#e8e8ed]">
                            {rec.title}
                          </h5>
                          <p className="text-xs text-[#a0a0b8] mt-0.5 leading-relaxed">
                            {rec.desc}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 h-auto px-2 py-1 text-xs"
                          onClick={() => {
                            resetAndClose();
                          }}
                        >
                          Learn →
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      const shareText = `🏥 Mera Financial Health Score: ${finalScore}/100\n${getScoreCategory(finalScore).label}\n\nRupaiya 101 se apna checkup karo!`;
                      if (navigator.share) {
                        navigator.share({ text: shareText }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(shareText).catch(() => {});
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300"
                  >
                    📤 Apna Score Share Karo
                  </Button>
                  <Button
                    onClick={() => {
                      setGameState('idle');
                      setCurrentQ(0);
                      setAnswers({});
                      setSelectedOption(null);
                      setDisplayScore(0);
                      setFinalScore(0);
                      setShowCoinReward(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold"
                  >
                    🔄 Phir se Checkup
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
