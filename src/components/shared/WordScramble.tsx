'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Type,
  Timer,
  Lightbulb,
  SkipForward,
  RotateCcw,
  Trophy,
  X,
  Flame,
  Coins,
  Check,
  BookOpen,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

/* ============================================================
   Word Scramble — Midnight Wealth + Emerald Growth redesign
   ============================================================ */

interface WordScrambleProps {
  open: boolean;
  onClose: () => void;
}

type CategoryId = 'banking' | 'investment' | 'tax' | 'insurance';

interface WordItem {
  word: string;
  hint: string;
  meaning: string;
  example: string;
}

const CATEGORY_CONFIG: Record<
  CategoryId,
  { label: string; emoji: string; color: string; tint: string }
> = {
  banking:     { label: 'Banking Words',  emoji: '🏦', color: 'text-emerald-400', tint: 'from-emerald-500/20' },
  investment:  { label: 'Investment Terms',emoji: '📈', color: 'text-amber-400',  tint: 'from-amber-500/20' },
  tax:         { label: 'Tax Jargon',       emoji: '📋', color: 'text-rose-400',   tint: 'from-rose-500/20' },
  insurance:   { label: 'Insurance Vocab',  emoji: '🛡️', color: 'text-violet-400', tint: 'from-violet-500/20' },
};

const WORDS: Record<CategoryId, WordItem[]> = {
  banking: [
    { word: 'LOAN',    hint: 'Bank se liya gaya paisa jo wapas chukana padta hai', meaning: 'Loan — bank ya kisi se liya hua paisa', example: 'Education loan ₹2L liya for higher studies.' },
    { word: 'KYC',     hint: 'Bank account kholte waqt yeh verification hoti hai', meaning: 'Know Your Customer — pehchaan ka proof', example: 'Aadhaar + PAN dikhao to KYC ho jaata hai.' },
    { word: 'NEFT',    hint: 'Bank se bank paisa bhejne ka system', meaning: 'National Electronic Funds Transfer', example: 'Mummy ne NEFT se ₹5000 bheje.' },
    { word: 'UPI',     hint: 'Phone scan karke instant paisa transfer', meaning: 'Unified Payments Interface —扫码付款', example: 'Chai tapri pe bhi UPI chal jata hai.' },
    { word: 'FD',      hint: 'Bank mein paisa fixed time ke liye lock kar do', meaning: 'Fixed Deposit — safe + guaranteed return', example: '₹10,000 ka FD kar diya 1 saal ke liye.' },
    { word: 'ATM',     hint: 'Cash machine jahan card daal ke paisa nikalte hain', meaning: 'Automated Teller Machine', example: 'ATM se ₹2000 nikale college ke liye.' },
    { word: 'CHEQUE',  hint: 'Paper par likha hua paisa order', meaning: 'Cheque — bank instruction to pay', example: 'School fee cheque se bhar di.' },
    { word: 'ACCOUNT', hint: 'Bank mein tumhare paisa ka dabba', meaning: 'Bank Account — paisa store karne ka jagah', example: 'Pehla account 18 saal mein khulwa.' },
  ],
  investment: [
    { word: 'SIP',     hint: 'Har mahine fixed amount invest karte hain', meaning: 'Systematic Investment Plan', example: '₹1000/month SIP se ₹10L banta hai 15 saal mein.' },
    { word: 'NAV',     hint: 'Mutual fund ek unit ki keemat', meaning: 'Net Asset Value — fund ka per-unit price', example: 'NAV ₹100 hai to ₹1000 se 10 units milte hain.' },
    { word: 'STOCK',   hint: 'Company ka hissa jo kharid sakte ho', meaning: 'Stock / Share — company ki ownership ka part', example: 'Tata stock liya — ab tum bhi owner!' },
    { word: 'BOND',    hint: 'Govt ya company ka debt instrument', meaning: 'Bond — fixed interest dene ka vaada', example: 'Govt bond 7% return de raha hai.' },
    { word: 'GOLD',    hint: 'Lal dhaatu jisme paisa save karte hain', meaning: 'Gold — inflation se bachne ka safe option', example: 'Akshaya Tritiya pe gold ETF liya.' },
    { word: 'CAGR',    hint: 'Saal bhar ka average growth rate', meaning: 'Compound Annual Growth Rate', example: '12% CAGR matlab paisa har saal 12% badhta hai.' },
    { word: 'ELSS',    hint: 'Tax bachata hai + market return deta hai', meaning: 'Equity Linked Savings Scheme — tax-saving MF', example: '₹1.5L ELSS se ₹46k tax bachaya.' },
    { word: 'NIFTY',   hint: 'Top 50 companies ka index', meaning: 'Nifty 50 — NSE ka benchmark index', example: 'Nifty 22,000 pe aaya — market up!' },
  ],
  tax: [
    { word: 'PAN',     hint: '10 digit ka tax identity card', meaning: 'Permanent Account Number', example: 'PAN card bina tax return nahi hota.' },
    { word: 'GST',     hint: 'Cheez kharidne par lagta yeh tax', meaning: 'Goods and Services Tax', example: 'Zomato bill pe 5% GST dikhta hai.' },
    { word: 'ITR',     hint: 'Saal mein ek baar bharo yeh form', meaning: 'Income Tax Return', example: 'Salary aane ke baad ITR file karo.' },
    { word: 'TDS',     hint: 'Payment se pehle hi kaata gaya tax', meaning: 'Tax Deducted at Source', example: 'FD pe 10% TDS kaat diya bank ne.' },
    { word: 'SLAB',    hint: 'Income ke hisaab se tax rate bracket', meaning: 'Tax Slab — income range ka rate', example: '₹3L-7L slab mein 5% tax lagta hai.' },
    { word: 'REFUND',  hint: 'Zyada tax bharne par wapas paisa', meaning: 'Tax Refund — overpaid tax wapas', example: '₹3,000 ka refund aaya direct account mein.' },
    { word: 'AUDIT',   hint: 'Accounts ki official jaanch', meaning: 'Tax Audit — official account check', example: 'Crore+ business ka audit zaroori hai.' },
    { word: 'RELIEF',  hint: 'Tax se bachav ke section', meaning: 'Tax Relief — 87A jaise rebate', example: '₹12,500 ka relief mil gaya section 87A se.' },
  ],
  insurance: [
    { word: 'POLICY',  hint: 'Insurance ka official contract paper', meaning: 'Policy — insurance agreement document', example: 'Term policy ₹1cr ki liye ₹6000/year.' },
    { word: 'PREMIUM', hint: 'Insurance ke liye har saal dene ka paisa', meaning: 'Premium — insurance ka periodic charge', example: '₹8000 annual premium health insurance ka.' },
    { word: 'CLAIM',   hint: 'Insurance se paisa maangne ka process', meaning: 'Claim — insurance company se paisa lena', example: 'Hospital bill ₹50k ka claim kiya.' },
    { word: 'TERM',    hint: 'Sabse sasta life insurance plan', meaning: 'Term Insurance — pure life cover', example: '₹1cr term cover for 30 saal.' },
    { word: 'RIDER',   hint: 'Policy ke sath extra benefit add karo', meaning: 'Rider — additional coverage add-on', example: 'Accident rider ₹500 extra mein lagaya.' },
    { word: 'NOMINEE', hint: 'Tumhare baad paisa milne waala insaan', meaning: 'Nominee — claim beneficiary', example: 'Mummy ko nominee banaya policy mein.' },
    { word: 'COVER',   hint: 'Kitne tak ka insurance protection', meaning: 'Cover — insurance amount limit', example: '₹10L health cover sufficient hai.' },
    { word: 'COPAY',   hint: 'Tumhara hissa har claim mein', meaning: 'Co-pay — patient ka % share', example: '20% copay matlab ₹10k ka ₹2k tum denge.' },
  ],
};

const TIMER_BONUS_THRESHOLD = 20; // seconds below which bonus coins awarded

/* Scramble letters — guaranteed non-trivial scramble */
function scramble(word: string): string[] {
  const letters = word.split('');
  if (letters.length <= 1) return letters;
  let attempts = 0;
  let scrambled = [...letters];
  do {
    scrambled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  } while (scrambled.join('') === word && attempts < 10);
  return scrambled;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ============================================================ */

export default function WordScramble({ open, onClose }: WordScrambleProps) {
  const { addCoins, addBadge, coins } = useAppStore();

  const [category, setCategory] = useState<CategoryId>('banking');
  const [pool, setPool] = useState<WordItem[]>(() => shuffle(WORDS.banking));
  const [index, setIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [placed, setPlaced] = useState<(string | null)[]>([]);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [timeLeft, setTimeLeft] = useState(45);
  const [hintShown, setHintShown] = useState(false);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedThisSession, setEarnedThisSession] = useState(0);
  const [mastered, setMastered] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const currentWord = pool[index];

  const resetWord = useCallback(() => {
    if (!pool[index]) return;
    setScrambledLetters(scramble(pool[index].word));
    setPlaced(Array(pool[index].word.length).fill(null));
    setUsedIndices([]);
    setStatus('playing');
    setTimeLeft(45);
    setHintShown(false);
  }, [pool, index]);

  const handleTimeout = useCallback(() => {
    setStatus('wrong');
    setStreak(0);
  }, []);

  /* Initialize first word */
  useEffect(() => {
    if (!open) return;
    resetWord();
  }, [open, index, resetWord]);

  /* Timer */
  useEffect(() => {
    if (!open || status !== 'playing' || showResult) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          handleTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, status, index, showResult, handleTimeout]);

  const handleCategoryChange = (cat: CategoryId) => {
    setCategory(cat);
    setPool(shuffle(WORDS[cat]));
    setIndex(0);
    setWordsSolved(0);
    setStreak(0);
    setEarnedThisSession(0);
    setMastered([]);
    setShowResult(false);
  };

  /* Letter tap → place in next empty slot */
  const placeLetter = (letter: string, sourceIdx: number) => {
    if (status !== 'playing') return;
    const emptySlot = placed.findIndex((p) => p === null);
    if (emptySlot === -1) return;
    const newPlaced = [...placed];
    newPlaced[emptySlot] = letter;
    setPlaced(newPlaced);
    setUsedIndices([...usedIndices, sourceIdx]);

    // If all slots filled, check answer
    if (!newPlaced.includes(null)) {
      const guess = newPlaced.join('');
      if (guess === currentWord.word) {
        setStatus('correct');
        const bonus = timeLeft > TIMER_BONUS_THRESHOLD ? 5 : 0;
        const earned = 10 + bonus + (streak >= 2 ? 5 : 0);
        setEarnedThisSession((e) => e + earned);
        setWordsSolved((w) => w + 1);
        setStreak((s) => s + 1);
        setMastered((m) => (m.includes(currentWord.word) ? m : [...m, currentWord.word]));
        addCoins(earned);
      } else {
        setStatus('wrong');
        setStreak(0);
      }
    }
  };

  /* Remove letter from slot (tap to remove) */
  const removeFromSlot = (slotIdx: number) => {
    if (status !== 'playing') return;
    const letter = placed[slotIdx];
    if (!letter) return;
    // find source index in scrambledLetters (the last added used index that matches this letter)
    let sourceIdx = -1;
    for (let i = usedIndices.length - 1; i >= 0; i--) {
      if (scrambledLetters[usedIndices[i]] === letter) {
        sourceIdx = usedIndices[i];
        usedIndices.splice(i, 1);
        break;
      }
    }
    if (sourceIdx === -1) return;
    const newPlaced = [...placed];
    newPlaced[slotIdx] = null;
    setPlaced(newPlaced);
  };

  /* Drag-reorder the scrambled letter tiles using Reorder */
  const handleReorder = (newOrder: string[]) => {
    if (status !== 'playing') return;
    setScrambledLetters(newOrder);
  };

  const handleNext = () => {
    if (index + 1 >= pool.length) {
      // Award badge if perfect
      if (wordsSolved >= 5 && !useAppStore.getState().badges.includes('word-master')) {
        addBadge('word-master');
      }
      setShowResult(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const handleSkip = () => {
    setStreak(0);
    handleNext();
  };

  const handleReset = () => {
    setPool(shuffle(WORDS[category]));
    setIndex(0);
    setWordsSolved(0);
    setStreak(0);
    setEarnedThisSession(0);
    setMastered([]);
    setShowResult(false);
  };

  /* Confetti positions for correct answer */
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 220,
        delay: Math.random() * 0.15,
      })),
    [index],
  );

  const cat = CATEGORY_CONFIG[category];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Word Scramble — Financial Terms</DialogTitle>
        </VisuallyHidden>

        {/* Header band */}
        <div className={cn('relative px-5 pt-6 pb-5 bg-gradient-to-b to-transparent', cat.tint)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
                <Type className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className={cn('font-display text-xl font-bold heading-gradient')}>Word Scramble</h2>
                <p className="text-xs text-[#94A3B8]">Akshar jodo, term sikhlo 🧩</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-card">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">{earnedThisSession}</span>
            </div>
          </div>

          {/* Progress: "X/30 words mastered" */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#94A3B8]">📚 Words Mastered</span>
            <span className="font-semibold text-[#F8FAFC]">
              {mastered.length}/30
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (mastered.length / 30) * 100)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(Object.keys(CATEGORY_CONFIG) as CategoryId[]).map((id) => {
              const c = CATEGORY_CONFIG[id];
              const active = id === category;
              return (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                    active
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'glass-card border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]'
                  )}
                >
                  <span className="mr-1">{c.emoji}</span>{c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-6">
          {/* Status bar — Timer + Streak + Word counter */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card">
              <Timer className={cn('w-4 h-4', timeLeft <= 10 ? 'text-rose-400' : 'text-emerald-400')} />
              <span className={cn('font-mono font-bold text-sm', timeLeft <= 10 ? 'text-rose-400' : 'text-[#F8FAFC]')}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-amber-400">{streak}x</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card">
              <span className="text-xs text-[#94A3B8]">Word</span>
              <span className="font-bold text-sm text-[#F8FAFC]">{index + 1}/{pool.length}</span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-5">
            <motion.div
              className={cn(
                'h-full',
                timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 20 ? 'bg-amber-400' : 'bg-emerald-400'
              )}
              animate={{ width: `${(timeLeft / 45) * 100}%` }}
              transition={{ duration: 0.4, ease: 'linear' }}
            />
          </div>

          {/* Hint */}
          <div className="mb-4">
            <button
              onClick={() => setHintShown((s) => !s)}
              className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-amber-400 transition"
            >
              <Lightbulb className={cn('w-4 h-4', hintShown ? 'text-amber-400' : '')} />
              <span>{hintShown ? 'Hint chhupao' : 'Hint dekho'}</span>
            </button>
            <AnimatePresence>
              {hintShown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 rounded-xl glass-card border-amber-400/20"
                >
                  <p className="text-sm text-amber-200/90 leading-relaxed">💡 {currentWord.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slot row */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {placed.map((letter, i) => (
              <motion.button
                key={i}
                onClick={() => removeFromSlot(i)}
                disabled={status === 'correct'}
                whileHover={letter ? { scale: 1.06 } : {}}
                whileTap={letter ? { scale: 0.94 } : {}}
                animate={
                  status === 'correct'
                    ? { boxShadow: '0 0 24px rgba(245,158,11,0.6)', borderColor: 'rgba(245,158,11,0.7)' }
                    : status === 'wrong'
                    ? { x: [0, -6, 6, -4, 4, 0] }
                    : {}
                }
                transition={status === 'wrong' ? { duration: 0.4 } : { duration: 0.3 }}
                className={cn(
                  'w-11 h-12 sm:w-12 sm:h-14 rounded-xl grid place-items-center text-xl font-bold font-display',
                  letter
                    ? status === 'correct'
                      ? 'glass-card-premium text-amber-300 border-amber-400/50'
                      : status === 'wrong'
                      ? 'glass-card text-rose-300 border-rose-500/40'
                      : 'glass-strong text-emerald-300 border-emerald-400/30'
                    : 'border-2 border-dashed border-white/[0.10] text-transparent bg-white/[0.02]'
                )}
              >
                {letter ?? '·'}
              </motion.button>
            ))}
          </div>

          {/* Scrambled tiles (draggable) */}
          {status !== 'correct' && (
            <Reorder.Group
              axis="x"
              values={scrambledLetters}
              onReorder={handleReorder}
              className="flex flex-wrap justify-center gap-2 mb-5"
            >
              {scrambledLetters.map((letter, i) => {
                const isUsed = usedIndices.includes(i);
                return (
                  <Reorder.Item
                    key={`${letter}-${i}`}
                    value={letter}
                    whileDrag={{ scale: 1.15, zIndex: 50, boxShadow: '0 12px 32px rgba(16,185,129,0.4)' }}
                    className={cn(
                      'w-11 h-12 sm:w-12 sm:h-14 rounded-xl grid place-items-center text-xl font-bold font-display card-3d cursor-grab active:cursor-grabbing select-none',
                      isUsed
                        ? 'opacity-30 pointer-events-none glass-card text-[#94A3B8]'
                        : 'glass-card-premium text-[#F8FAFC] hover:text-emerald-300'
                    )}
                    onClick={() => !isUsed && placeLetter(letter, i)}
                  >
                    {letter}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}

          {/* Result + meaning panel */}
          <AnimatePresence mode="wait">
            {status === 'correct' && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative p-4 rounded-2xl glass-card-premium mb-4 overflow-hidden"
              >
                {/* Confetti */}
                {confettiPieces.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -120, x: p.x, scale: 0.4, rotate: 360 }}
                    transition={{ duration: 1, delay: p.delay }}
                    className="absolute top-2 left-1/2 w-2 h-2 rounded-full bg-amber-400"
                  />
                ))}
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="font-display text-lg font-bold text-emerald-300">Sahi Jawab! 🎉</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold">
                    +{10 + (timeLeft > TIMER_BONUS_THRESHOLD ? 5 : 0) + (streak >= 2 ? 5 : 0)} coins
                  </span>
                </div>
                <p className="text-sm text-[#F8FAFC] font-semibold">{currentWord.meaning}</p>
                <p className="text-xs text-[#94A3B8] mt-1 italic">📌 {currentWord.example}</p>
              </motion.div>
            )}

            {status === 'wrong' && (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl glass-card border-rose-500/30 mb-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <X className="w-5 h-5 text-rose-400" />
                  <span className="font-display text-lg font-bold text-rose-300">
                    {timeLeft === 0 ? 'Time up! ⏰' : 'Arre, galat! 🤔'}
                  </span>
                </div>
                <p className="text-sm text-[#F8FAFC]">Sahi jawab: <span className="font-bold text-amber-300">{currentWord.word}</span></p>
                <p className="text-xs text-[#94A3B8] mt-1">{currentWord.meaning}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-2">
            {status === 'playing' && (
              <>
                <button
                  onClick={resetWord}
                  className="flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center justify-center gap-1.5"
                >
                  <SkipForward className="w-4 h-4" /> Skip
                </button>
              </>
            )}
            {(status === 'correct' || status === 'wrong') && (
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5"
              >
                {index + 1 >= pool.length ? (
                  <><Trophy className="w-4 h-4" /> Result Dekho</>
                ) : (
                  <>Aage Badho <Zap className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Result modal section */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 grid place-items-center bg-[#0B1220]/95 backdrop-blur-md p-6"
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="text-center max-w-xs"
              >
                <div className="w-20 h-20 mx-auto rounded-full glass-card-premium grid place-items-center mb-4">
                  <Trophy className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="font-display text-2xl font-bold heading-gradient mb-1">
                  {wordsSolved >= pool.length * 0.8 ? 'Champion! 🏆' : wordsSolved >= pool.length * 0.5 ? 'Shabaash! 🔥' : 'Achhi Koshish! 💪'}
                </h3>
                <p className="text-sm text-[#94A3B8] mb-5">
                  Tumne {wordsSolved}/{pool.length} words solve kar liye!
                </p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl glass-card">
                    <Coins className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <p className="text-xl font-bold text-amber-300">{earnedThisSession}</p>
                    <p className="text-xs text-[#94A3B8]">Coins Earned</p>
                  </div>
                  <div className="p-3 rounded-xl glass-card">
                    <BookOpen className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                    <p className="text-xl font-bold text-emerald-300">{mastered.length}</p>
                    <p className="text-xs text-[#94A3B8]">Mastered Words</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-1" /> Phir Khelo
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Band Karo
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
