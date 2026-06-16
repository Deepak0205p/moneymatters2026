'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, RotateCcw, Copy, Check, PartyPopper, TrendingUp, ArrowRight, Cake } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────
interface FinancialAgeCalculatorProps {
  open: boolean;
  onClose: () => void;
}

// ─── Types ──────────────────────────────────────────────────
type GameState = 'idle' | 'playing' | 'results';

interface QuizOption {
  label: string;
  text: string;
  score: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  emoji: string;
  category: string;
  options: QuizOption[];
}

interface AgeResult {
  title: string;
  emoji: string;
  ageMin: number;
  ageMax: number;
  color: string;
  description: string;
}

// ─── Questions Data ─────────────────────────────────────────
const questions: QuizQuestion[] = [
  {
    id: 'budget',
    question: 'Tumhara monthly budget bana hota hai?',
    emoji: '📝',
    category: 'Budgeting',
    options: [
      { label: 'a', text: 'Budget? Kya hota hai 😅', score: 1 },
      { label: 'b', text: 'Kabhi bana, kabhi nahi', score: 2 },
      { label: 'c', text: 'Haan, basic budget follow karta hoon', score: 3 },
      { label: 'd', text: 'Detailed budget har mahine banaata hoon', score: 4 },
    ],
  },
  {
    id: 'emergency',
    question: 'Emergency fund kitna hai?',
    emoji: '🛡️',
    category: 'Emergency Fund',
    options: [
      { label: 'a', text: 'Kya yeh hota hai?', score: 1 },
      { label: 'b', text: '1-2 mahine ka hai', score: 2 },
      { label: 'c', text: '3-5 mahine ka hai', score: 3 },
      { label: 'd', text: '6+ mahine ka hai', score: 4 },
    ],
  },
  {
    id: 'investing',
    question: 'SIP ya investment karte ho?',
    emoji: '📈',
    category: 'Investing',
    options: [
      { label: 'a', text: 'Nahi, abhi tak start nahi kiya', score: 1 },
      { label: 'b', text: 'Soch raha hoon but confused', score: 2 },
      { label: 'c', text: 'Haan, chhota amount lagata hoon', score: 3 },
      { label: 'd', text: 'Haan, regular SIP + diverse portfolio', score: 4 },
    ],
  },
  {
    id: 'credit',
    question: 'Credit card ka bill kaise pay karte ho?',
    emoji: '💳',
    category: 'Debt Management',
    options: [
      { label: 'a', text: 'Minimum amount 😬', score: 1 },
      { label: 'b', text: 'Kabhi full, kabhi partial', score: 2 },
      { label: 'c', text: 'Mostly full pay karta hoon', score: 3 },
      { label: 'd', text: 'Hamesha full amount, on time', score: 4 },
    ],
  },
  {
    id: 'insurance',
    question: 'Health insurance hai?',
    emoji: '🏥',
    category: 'Insurance',
    options: [
      { label: 'a', text: 'Nahi, zaroorat nahi feel hoti', score: 1 },
      { label: 'b', text: 'Parents ka hai, mera nahi', score: 2 },
      { label: 'c', text: 'Haan, basic plan hai', score: 3 },
      { label: 'd', text: 'Haan, comprehensive coverage hai', score: 4 },
    ],
  },
  {
    id: 'goals',
    question: 'Financial goals set karte ho?',
    emoji: '🎯',
    category: 'Financial Goals',
    options: [
      { label: 'a', text: 'Goals? Zindagi mein?', score: 1 },
      { label: 'b', text: 'Dimaag mein hain but likhe nahi', score: 2 },
      { label: 'c', text: 'Kuch goals likhe hain', score: 3 },
      { label: 'd', text: 'Detailed goals + timeline + tracking', score: 4 },
    ],
  },
  {
    id: 'tracking',
    question: 'Kharche track karte ho?',
    emoji: '🔍',
    category: 'Expense Tracking',
    options: [
      { label: 'a', text: 'Nahi, paise chala jaata hai pata nahi kahan', score: 1 },
      { label: 'b', text: 'Rough idea hai', score: 2 },
      { label: 'c', text: 'App se track karta hoon', score: 3 },
      { label: 'd', text: 'Detailed expense tracking + analysis', score: 4 },
    ],
  },
  {
    id: 'tax',
    question: 'Tax planning karte ho?',
    emoji: '🧾',
    category: 'Tax Planning',
    options: [
      { label: 'a', text: 'Tax = salary cut, kuch nahi kar sakte', score: 1 },
      { label: 'b', text: 'March mein last minute invest', score: 2 },
      { label: 'c', text: 'PPF/ELSS mein regular invest', score: 3 },
      { label: 'd', text: 'Proper tax planning with multiple instruments', score: 4 },
    ],
  },
  {
    id: 'loan',
    question: 'Loan/EMI ke bare mein kya sochte ho?',
    emoji: '🏦',
    category: 'Debt Attitude',
    options: [
      { label: 'a', text: 'EMI = free money! 🛍️', score: 1 },
      { label: 'b', text: 'Loan zaroori hai zaroorat ke liye', score: 2 },
      { label: 'c', text: 'Kam EMIs, jaldi pay off karta hoon', score: 3 },
      { label: 'd', text: 'Avoid unnecessary loans, prepay when possible', score: 4 },
    ],
  },
  {
    id: 'future',
    question: '10 saal baad financially kahan doge khudko?',
    emoji: '🔮',
    category: 'Future Planning',
    options: [
      { label: 'a', text: 'Umm...socha nahi 🤷', score: 1 },
      { label: 'b', text: 'Better salary, bas', score: 2 },
      { label: 'c', text: 'Some savings + investments', score: 3 },
      { label: 'd', text: 'Financial freedom, passive income, secure future', score: 4 },
    ],
  },
];

// ─── Age Mapping ────────────────────────────────────────────
function getAgeResult(score: number): AgeResult {
  if (score <= 15) {
    return {
      title: 'Financial Bachcha',
      emoji: '👶',
      ageMin: 5,
      ageMax: 12,
      color: '#f87171',
      description: "You're just starting your financial journey! Koi baat nahi, sab se shuru hoti hai. RUPAIYA 101 se seekhna shuru karo!",
    };
  }
  if (score <= 22) {
    return {
      title: 'Financial Teenager',
      emoji: '🧑‍🎓',
      ageMin: 13,
      ageMax: 19,
      color: '#fb923c',
      description: 'Learning but still making mistakes! Sahi direction mein ja rahe ho, thoda aur effort lagao!',
    };
  }
  if (score <= 29) {
    return {
      title: 'Financial Young Adult',
      emoji: '🧑‍💼',
      ageMin: 20,
      ageMax: 29,
      color: '#a3e635',
      description: "Getting the hang of it! Aap sahi track pe ho, aur improvement areas pe kaam karo to aur aage badhoge!",
    };
  }
  if (score <= 35) {
    return {
      title: 'Financial Adult',
      emoji: '💼',
      ageMin: 30,
      ageMax: 45,
      color: '#22d3ee',
      description: "You know what you're doing! Great financial discipline! Thoda aur polish karo aur guru ban jaoge!",
    };
  }
  return {
    title: 'Financial Guru',
    emoji: '🧙‍♂️',
    ageMin: 45,
    ageMax: 60,
    color: '#fbbf24',
    description: 'Master of money! Aap financial guru ho! Dusron ko bhi seekhao aur apna knowledge share karo!',
  };
}

function calculateFinancialAge(score: number): number {
  const result = getAgeResult(score);
  // Interpolate within the age range based on score position within the bucket
  const ranges = [
    { min: 10, max: 15, ageMin: 5, ageMax: 12 },
    { min: 16, max: 22, ageMin: 13, ageMax: 19 },
    { min: 23, max: 29, ageMin: 20, ageMax: 29 },
    { min: 30, max: 35, ageMin: 30, ageMax: 45 },
    { min: 36, max: 40, ageMin: 45, ageMax: 60 },
  ];
  const range = ranges.find(r => score >= r.min && score <= r.max);
  if (!range) return result.ageMin;
  const fraction = (score - range.min) / (range.max - range.min);
  return Math.round(range.ageMin + fraction * (range.ageMax - range.ageMin));
}

// ─── Confetti Particle ──────────────────────────────────────
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 2;
  const randomSize = 4 + Math.random() * 6;

  return (
    <motion.div
      className="absolute top-0 rounded-sm"
      style={{
        left: `${randomX}%`,
        width: randomSize,
        height: randomSize,
        backgroundColor: color,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: 400,
        opacity: [1, 1, 0],
        rotate: [0, 360, 720],
        x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

// ─── Progress Ring Component ────────────────────────────────
function AgeProgressRing({ age, maxAge = 60 }: { age: number; maxAge?: number }) {
  const percentage = Math.min((age / maxAge) * 100, 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const result = getAgeResult(
    age <= 12 ? 10 : age <= 19 ? 16 : age <= 29 ? 23 : age <= 45 ? 30 : 36
  );

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={result.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 8px ${result.color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold"
          style={{ color: result.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
        >
          {age}
        </motion.span>
        <span className="text-[10px] text-[#8888a0] font-medium">YEARS</span>
      </div>
    </div>
  );
}

// ─── Animated Counter ───────────────────────────────────────
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count}</span>;
}

// ─── Main Component ─────────────────────────────────────────
export default function FinancialAgeCalculator({ open, onClose }: FinancialAgeCalculatorProps) {
  const { addCoins, setFinancialAge, financialAge } = useAppStore();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animatedAge, setAnimatedAge] = useState(0);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  }, [answers]);

  const financialAgeResult = useMemo(() => {
    return calculateFinancialAge(totalScore);
  }, [totalScore]);

  const ageResult = useMemo(() => {
    return getAgeResult(totalScore);
  }, [totalScore]);

  // Improvement areas based on weakest answers
  const improvementAreas = useMemo(() => {
    const weakAreas = questions
      .map((q) => ({
        category: q.category,
        emoji: q.emoji,
        score: answers[q.id] || 0,
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
    return weakAreas;
  }, [answers]);

  // Reset quiz state
  const resetQuiz = useCallback(() => {
    setGameState('idle');
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
    setShowConfetti(false);
    setCopied(false);
    setAnimatedAge(0);
  }, []);

  // Handle option selection
  const handleSelectOption = useCallback((score: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(score);
  }, [selectedOption]);

  // Go to next question
  const goNext = useCallback(() => {
    if (selectedOption === null) return;

    const questionId = questions[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Quiz complete
      const finalAnswers = { ...answers, [questionId]: selectedOption };
      const finalScore = Object.values(finalAnswers).reduce((sum, s) => sum + s, 0);
      const finalAge = calculateFinancialAge(finalScore);

      // Animate age counter
      let start = 0;
      const startTime = performance.now();
      const animateAge = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / 1500, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedAge(Math.round(eased * finalAge));
        if (progress < 1) {
          requestAnimationFrame(animateAge);
        }
      };
      requestAnimationFrame(animateAge);

      setGameState('results');
      setShowConfetti(true);
      addCoins(15);
      setFinancialAge(finalAge);

      // Hide confetti after some time
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [selectedOption, currentQuestion, answers, addCoins, setFinancialAge]);

  // Share text
  const shareText = useMemo(() => {
    return `🎒 Mera Financial Age hai ${financialAgeResult}! Tumhara kitna hai? RUPAIYA 101 se check karo!`;
  }, [financialAgeResult]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  // Close handler
  const handleClose = useCallback(() => {
    onClose();
    // Delay reset so animation plays
    setTimeout(resetQuiz, 300);
  }, [onClose, resetQuiz]);

  // Start quiz
  const startQuiz = useCallback(() => {
    setGameState('playing');
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption(null);
  }, []);

  const confettiColors = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#c084fc', '#fb923c', '#f472b6'];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="bg-[#0f0f1a] border-white/[0.06] text-[#e8e8ed] max-w-lg w-[calc(100%-2rem)] p-0 overflow-hidden"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Financial Age Calculator</DialogTitle>

        <div className="relative">
          {/* ─── IDLE STATE ──────────────────────────────────── */}
          {gameState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 pt-8"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Cake className="w-8 h-8 text-amber-400" />
                </motion.div>
                <h2 className="text-xl font-extrabold mb-1">
                  <span className="text-amber-400">Financial Age</span> Calculator
                </h2>
                <p className="text-sm text-[#8888a0]">
                  Tumhari financial aadatein bataati hain tumhara <span className="text-amber-400">asli financial age</span>!
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-2.5 mb-6">
                {[
                  { emoji: '📝', text: '10 quick questions about money habits' },
                  { emoji: '🎯', text: 'Har question ka apna score hai' },
                  { emoji: '🎂', text: 'Jaano apna Financial Age — real age se alag!' },
                  { emoji: '🪙', text: 'Complete karo aur 15 coins kamaao!' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm text-[#c0c0d0]">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Previous result */}
              {financialAge > 0 && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-400/10 border border-amber-500/20 text-center">
                  <span className="text-xs text-amber-400/80">Previous Financial Age: </span>
                  <span className="text-sm font-bold text-amber-400">{financialAge} years</span>
                </div>
              )}

              {/* Start button */}
              <motion.button
                onClick={startQuiz}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a0f] font-bold text-base flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCheck className="w-5 h-5" />
                Shuru Karo!
              </motion.button>
            </motion.div>
          )}

          {/* ─── PLAYING STATE ───────────────────────────────── */}
          {gameState === 'playing' && (
            <div className="p-6 pt-8">
              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#8888a0]">
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                  <span className="text-xs font-medium text-amber-400">
                    Score: {Object.values(answers).reduce((s, v) => s + v, 0)}/{(currentQuestion + (selectedOption ? 1 : 0)) * 4}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${((currentQuestion + (selectedOption ? 1 : 0)) / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 mb-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{questions[currentQuestion].emoji}</span>
                    <span className="text-[10px] font-medium text-[#8888a0] uppercase tracking-wider">
                      {questions[currentQuestion].category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#e8e8ed] leading-relaxed">
                    {questions[currentQuestion].question}
                  </h3>
                </motion.div>
              </AnimatePresence>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2.5"
                  >
                    {questions[currentQuestion].options.map((option, idx) => {
                      const isSelected = selectedOption === option.score;
                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleSelectOption(option.score)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3',
                            isSelected
                              ? 'border-amber-500/60 bg-amber-400/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                              : selectedOption !== null
                              ? 'border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed'
                              : 'border-white/[0.06] bg-white/[0.03] hover:border-amber-500/30 hover:bg-white/[0.05] cursor-pointer'
                          )}
                          whileTap={selectedOption === null ? { scale: 0.97 } : {}}
                          disabled={selectedOption !== null}
                        >
                          <span
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border transition-colors',
                              isSelected
                                ? 'bg-amber-400 text-[#0a0a0f] border-amber-400'
                                : 'bg-white/[0.05] text-[#8888a0] border-white/[0.08]'
                            )}
                          >
                            {option.label.toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              'text-sm',
                              isSelected ? 'text-amber-200 font-medium' : 'text-[#c0c0d0]'
                            )}
                          >
                            {option.text}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next button */}
              <motion.button
                onClick={goNext}
                disabled={selectedOption === null}
                className={cn(
                  'w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a0f] hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-white/[0.05] text-[#555580] cursor-not-allowed'
                )}
                whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
                whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Aage Badho
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Result Dekho
                    <PartyPopper className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* ─── RESULTS STATE ───────────────────────────────── */}
          {gameState === 'results' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 pt-8 relative overflow-hidden"
            >
              {/* Confetti */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <ConfettiParticle
                      key={i}
                      delay={i * 0.05}
                      color={confettiColors[i % confettiColors.length]}
                    />
                  ))}
                </div>
              )}

              {/* Glow background */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ backgroundColor: ageResult.color }}
              />

              {/* Badge */}
              <motion.div
                className="text-center mb-4 relative z-10"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4"
                  style={{
                    borderColor: `${ageResult.color}40`,
                    backgroundColor: `${ageResult.color}10`,
                    boxShadow: `0 0 20px ${ageResult.color}20`,
                  }}
                >
                  <span className="text-xl">{ageResult.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: ageResult.color }}>
                    {ageResult.title}
                  </span>
                </div>
              </motion.div>

              {/* Progress ring with age */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                <AgeProgressRing age={animatedAge} />
              </motion.div>

              {/* Age label */}
              <motion.div
                className="text-center mt-2 mb-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-[#8888a0]">Tumhara Financial Age</p>
                <p className="text-2xl font-extrabold" style={{ color: ageResult.color }}>
                  <AnimatedCounter target={financialAgeResult} /> Years
                </p>
              </motion.div>

              {/* Score */}
              <motion.div
                className="text-center mb-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-center">
                    <p className="text-[10px] text-[#8888a0] uppercase tracking-wider">Score</p>
                    <p className="text-lg font-bold text-amber-400">{totalScore}/40</p>
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="text-center">
                    <p className="text-[10px] text-[#8888a0] uppercase tracking-wider">Level</p>
                    <p className="text-lg font-bold" style={{ color: ageResult.color }}>
                      {ageResult.emoji}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-sm text-center text-[#a0a0b8] mb-4 relative z-10 px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {ageResult.description}
              </motion.p>

              {/* Improvement Areas */}
              <motion.div
                className="mb-5 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h4 className="text-xs font-bold text-[#8888a0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Top 3 Improvement Areas
                </h4>
                <div className="space-y-1.5">
                  {improvementAreas.map((area, i) => (
                    <div
                      key={area.category}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{area.emoji}</span>
                        <span className="text-xs font-medium text-[#c0c0d0]">{area.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(area.score / 4) * 100}%`,
                              backgroundColor: area.score <= 1 ? '#f87171' : area.score <= 2 ? '#fb923c' : '#fbbf24',
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-[#8888a0]">{area.score}/4</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Coin reward indicator */}
              <motion.div
                className="mb-4 text-center relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-500/20 text-sm font-bold text-amber-400">
                  🪙 +15 Coins Earned!
                </span>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="space-y-2.5 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                {/* Share button */}
                <motion.button
                  onClick={handleCopy}
                  className="w-full py-3 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-400/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Share your Financial Age
                    </>
                  )}
                </motion.button>

                {/* Retake quiz */}
                <motion.button
                  onClick={resetQuiz}
                  className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#c0c0d0] font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/[0.07] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Quiz
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
