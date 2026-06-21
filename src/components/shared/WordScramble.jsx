'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Type, Timer, Lightbulb, SkipForward, RotateCcw, 
  Trophy, X, Flame, Coins, Check, BookOpen, Zap 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

const CATEGORY_CONFIG = {
  banking: {
    label: 'Banking Words',
    emoji: '🏦',
    color: 'text-emerald-400',
    tint: 'from-emerald-500/20'
  },
  investment: {
    label: 'Investment Terms',
    emoji: '📈',
    color: 'text-amber-400',
    tint: 'from-amber-500/20'
  },
  tax: {
    label: 'Tax Jargon',
    emoji: '📋',
    color: 'text-rose-400',
    tint: 'from-rose-500/20'
  },
  insurance: {
    label: 'Insurance Vocab',
    emoji: '🛡️',
    color: 'text-violet-400',
    tint: 'from-violet-500/20'
  }
};

const WORDS = {
  banking: [
    { word: 'LOAN', hint: 'Bank se liya gaya paisa jo wapas chukana padta hai', meaning: 'Loan — bank ya kisi se liya hua paisa', example: 'Education loan ₹2L liya for higher studies.' },
    { word: 'KYC', hint: 'Bank account kholte waqt yeh verification hoti hai', meaning: 'Know Your Customer — pehchaan ka proof', example: 'Aadhaar + PAN dikhao to KYC ho jaata hai.' },
    { word: 'NEFT', hint: 'Bank se bank paisa bhejne ka system', meaning: 'National Electronic Funds Transfer', example: 'Mummy ne NEFT se ₹5000 bheje.' },
    { word: 'UPI', hint: 'Phone scan karke instant paisa transfer', meaning: 'Unified Payments Interface', example: 'Chai tapri pe bhi UPI chal jata hai.' },
    { word: 'FD', hint: 'Bank mein paisa fixed time ke liye lock kar do', meaning: 'Fixed Deposit — safe + guaranteed return', example: '₹10,000 ka FD kar diya 1 saal ke liye.' },
    { word: 'ATM', hint: 'Cash machine jahan card daal ke paisa nikalte hain', meaning: 'Automated Teller Machine', example: 'ATM se ₹2000 nikale college ke liye.' },
    { word: 'CHEQUE', hint: 'Paper par likha hua paisa order', meaning: 'Cheque — bank instruction to pay', example: 'School fee cheque se bhar di.' },
    { word: 'ACCOUNT', hint: 'Bank mein tumhare paisa ka dabba', meaning: 'Bank Account — paisa store karne ka jagah', example: 'Pehla account 18 saal mein khulwa.' }
  ],
  investment: [
    { word: 'SIP', hint: 'Har mahine fixed amount invest karte hain', meaning: 'Systematic Investment Plan', example: '₹1000/month SIP se ₹10L banta hai 15 saal mein.' },
    { word: 'NAV', hint: 'Mutual fund ek unit ki keemat', meaning: 'Net Asset Value — fund ka per-unit price', example: 'NAV ₹100 hai to ₹1000 se 10 units milte hain.' },
    { word: 'STOCK', hint: 'Company ka hissa jo kharid sakte ho', meaning: 'Stock / Share — company ki ownership ka part', example: 'Tata stock liya — ab tum bhi owner!' },
    { word: 'BOND', hint: 'Govt ya company ka debt instrument', meaning: 'Bond — fixed interest dene ka vaada', example: 'Govt bond 7% return de raha hai.' },
    { word: 'GOLD', hint: 'Lal dhaatu jisme paisa save karte hain', meaning: 'Gold — inflation se bachne ka safe option', example: 'Akshaya Tritiya pe gold ETF liya.' },
    { word: 'CAGR', hint: 'Saal bhar ka average growth rate', meaning: 'Compound Annual Growth Rate', example: '12% CAGR matlab paisa har saal 12% badhta hai.' },
    { word: 'ELSS', hint: 'Tax bachata hai + market return deta hai', meaning: 'Equity Linked Savings Scheme — tax-saving MF', example: '₹1.5L ELSS se ₹46k tax bachaya.' },
    { word: 'NIFTY', hint: 'Top 50 companies ka index', meaning: 'Nifty 50 — NSE ka benchmark index', example: 'Nifty 22,000 pe aaya — market up!' }
  ],
  tax: [
    { word: 'PAN', hint: '10 digit ka tax identity card', meaning: 'Permanent Account Number', example: 'PAN card bina tax return nahi hota.' },
    { word: 'GST', hint: 'Cheez kharidne par lagta yeh tax', meaning: 'Goods and Services Tax', example: 'Zomato bill pe 5% GST dikhta hai.' },
    { word: 'ITR', hint: 'Saal mein ek baar bharo yeh form', meaning: 'Income Tax Return', example: 'Salary aane ke baad ITR file karo.' },
    { word: 'TDS', hint: 'Payment se pehle hi kaata gaya tax', meaning: 'Tax Deducted at Source', example: 'FD pe 10% TDS kaat diya bank ne.' },
    { word: 'SLAB', hint: 'Income ke hisaab se tax rate bracket', meaning: 'Tax Slab — income range ka rate', example: '₹3L-7L slab mein 5% tax lagta hai.' },
    { word: 'REFUND', hint: 'Zyada tax bharne par wapas paisa', meaning: 'Tax Refund — overpaid tax wapas', example: '₹3,000 ka refund aaya direct account mein.' },
    { word: 'AUDIT', hint: 'Accounts ki official jaanch', meaning: 'Tax Audit — official account check', example: 'Crore+ business ka audit zaroori hai.' },
    { word: 'RELIEF', hint: 'Tax se bachav ke section', meaning: 'Tax Relief — 87A jaise rebate', example: '₹12,500 ka relief mil gaya section 87A se.' }
  ],
  insurance: [
    { word: 'POLICY', hint: 'Insurance ka official contract paper', meaning: 'Policy — insurance agreement document', example: 'Term policy ₹1cr ki liye ₹6000/year.' },
    { word: 'PREMIUM', hint: 'Insurance ke liye har saal dene ka paisa', meaning: 'Premium — insurance ka periodic charge', example: '₹8000 annual premium health insurance ka.' },
    { word: 'CLAIM', hint: 'Insurance se paisa maangne ka process', meaning: 'Claim — insurance company se paisa lena', example: 'Hospital bill ₹50k ka claim kiya.' },
    { word: 'TERM', hint: 'Sabse sasta life insurance plan', meaning: 'Term Insurance — pure life cover', example: '₹1cr term cover for 30 saal.' },
    { word: 'RIDER', hint: 'Policy ke sath extra benefit add karo', meaning: 'Rider — additional coverage add-on', example: 'Accident rider ₹500 extra mein lagaya.' },
    { word: 'NOMINEE', hint: 'Tumhare baad paisa milne waala insaan', meaning: 'Nominee — claim beneficiary', example: 'Mummy ko nominee banaya policy mein.' },
    { word: 'COVER', hint: 'Kitne tak ka insurance protection', meaning: 'Cover — insurance amount limit', example: '₹10L health cover sufficient hai.' },
    { word: 'COPAY', hint: 'Tumhara hissa har claim mein', meaning: 'Co-pay — patient ka % share', example: '20% copay matlab ₹10k ka ₹2k tum denge.' }
  ]
};

const TIMER_BONUS_THRESHOLD = 20;

function scramble(word) {
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

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function WordScramble({ open, onClose }) {
  const {
    addCoins,
    addBadge
  } = useAppStore();

  const [category, setCategory] = useState('banking');
  const [pool, setPool] = useState(() => shuffle(WORDS.banking));
  const [index, setIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [usedIndices, setUsedIndices] = useState([]);
  const [status, setStatus] = useState('playing'); // 'playing', 'correct', 'wrong'
  const [timeLeft, setTimeLeft] = useState(45);
  const [hintShown, setHintShown] = useState(false);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedThisSession, setEarnedThisSession] = useState(0);
  const [mastered, setMastered] = useState([]);
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

  useEffect(() => {
    if (!open) return;
    resetWord();
  }, [open, index, resetWord]);

  useEffect(() => {
    if (!open || status !== 'playing' || showResult) return;
    const t = setInterval(() => {
      setTimeLeft(s => {
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

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPool(shuffle(WORDS[cat]));
    setIndex(0);
    setWordsSolved(0);
    setStreak(0);
    setEarnedThisSession(0);
    setMastered([]);
    setShowResult(false);
  };

  const placeLetter = (letter, sourceIdx) => {
    if (status !== 'playing') return;
    const emptySlot = placed.findIndex(p => p === null);
    if (emptySlot === -1) return;
    const newPlaced = [...placed];
    newPlaced[emptySlot] = letter;
    setPlaced(newPlaced);
    setUsedIndices([...usedIndices, sourceIdx]);

    if (!newPlaced.includes(null)) {
      const guess = newPlaced.join('');
      if (guess === currentWord.word) {
        setStatus('correct');
        const bonus = timeLeft > TIMER_BONUS_THRESHOLD ? 5 : 0;
        const earned = 10 + bonus + (streak >= 2 ? 5 : 0);
        setEarnedThisSession(e => e + earned);
        setWordsSolved(w => w + 1);
        setStreak(s => s + 1);
        setMastered(m => m.includes(currentWord.word) ? m : [...m, currentWord.word]);
        addCoins(earned);
      } else {
        setStatus('wrong');
        setStreak(0);
      }
    }
  };

  const removeFromSlot = (slotIdx) => {
    if (status !== 'playing') return;
    const letter = placed[slotIdx];
    if (!letter) return;

    let sourceIdx = -1;
    const nextUsedIndices = [...usedIndices];
    for (let i = nextUsedIndices.length - 1; i >= 0; i--) {
      if (scrambledLetters[nextUsedIndices[i]] === letter) {
        sourceIdx = nextUsedIndices[i];
        nextUsedIndices.splice(i, 1);
        break;
      }
    }

    if (sourceIdx === -1) return;
    const newPlaced = [...placed];
    newPlaced[slotIdx] = null;
    setPlaced(newPlaced);
    setUsedIndices(nextUsedIndices);
  };

  const handleReorder = (newOrder) => {
    if (status !== 'playing') return;
    setScrambledLetters(newOrder);
  };

  const handleNext = () => {
    if (index + 1 >= pool.length) {
      if (wordsSolved >= 5) {
        try {
          addBadge('word-master');
        } catch (e) {}
      }
      setShowResult(true);
      return;
    }
    setIndex(i => i + 1);
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

  const confettiPieces = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 220,
      delay: Math.random() * 0.15
    }));
  }, [index]);

  const catDetails = CATEGORY_CONFIG[category];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none`} />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Type size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Shabda Sangram 🔠</h2>
              <p className="text-[10px] text-zinc-400">Scrambled letters ko organize karein</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scroll">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {Object.keys(CATEGORY_CONFIG).map(id => {
              const c = CATEGORY_CONFIG[id];
              const active = id === category;
              return (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    active 
                      ? 'bg-emerald-500/20 border-emerald-500/35 text-emerald-400' 
                      : 'bg-white/5 border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="mr-1">{c.emoji}</span> {c.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <Timer size={14} className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
              <span className={`text-xs font-black tabular-nums ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <Flame size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-black text-amber-400">{streak}x Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Word</span>
              <span className="text-xs font-black text-white">{index + 1} / {pool.length}</span>
            </div>
          </div>

          {/* Time Progress bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${(timeLeft / 45) * 100}%` }}
            />
          </div>

          {/* Hints Section */}
          <div className="space-y-2">
            <button
              onClick={() => setHintShown(s => !s)}
              className="flex items-center gap-2 text-xs font-black text-zinc-500 hover:text-amber-400 transition-all focus:outline-none uppercase tracking-wider"
            >
              <Lightbulb size={14} className={hintShown ? 'text-amber-400' : ''} />
              <span>{hintShown ? 'Hide Hint 💡' : 'Show Hint 💡'}</span>
            </button>
            <AnimatePresence>
              {hintShown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-[#0B0E19] border border-white/[0.04]"
                >
                  <p className="text-xs text-amber-200/90 leading-relaxed font-semibold italic">
                    💡 {currentWord.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Placed slots */}
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {placed.map((letter, i) => (
              <motion.button
                key={i}
                onClick={() => removeFromSlot(i)}
                disabled={status === 'correct'}
                whileHover={letter ? { scale: 1.05 } : {}}
                whileTap={letter ? { scale: 0.95 } : {}}
                animate={
                  status === 'correct' 
                    ? { scale: [1, 1.05, 1], borderColor: '#10B981', background: 'rgba(16,185,129,0.1)' } 
                    : status === 'wrong' 
                      ? { x: [0, -6, 6, -4, 4, 0], borderColor: '#EF4444' } 
                      : {}
                }
                transition={{ duration: 0.4 }}
                className={`w-11 h-13 rounded-2xl border-2 flex items-center justify-center text-xl font-black focus:outline-none cursor-pointer ${
                  letter
                    ? status === 'correct'
                      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                      : status === 'wrong'
                        ? 'text-red-400 border-red-500/40 bg-red-500/10'
                        : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5'
                    : 'border-dashed border-white/10 bg-white/[0.02] text-transparent'
                }`}
              >
                {letter ?? ''}
              </motion.button>
            ))}
          </div>

          {/* Available letters to choose from */}
          {status !== 'correct' && (
            <Reorder.Group
              axis="x"
              values={scrambledLetters}
              onReorder={handleReorder}
              className="flex flex-wrap justify-center gap-2 py-2"
            >
              {scrambledLetters.map((letter, i) => {
                const isUsed = usedIndices.includes(i);
                return (
                  <Reorder.Item
                    key={`${letter}-${i}`}
                    value={letter}
                    whileDrag={{ scale: 1.15 }}
                    className={`w-11 h-13 rounded-2xl flex items-center justify-center text-xl font-black select-none cursor-grab active:cursor-grabbing border ${
                      isUsed 
                        ? 'opacity-20 pointer-events-none bg-white/5 border-transparent text-zinc-600' 
                        : 'bg-[#0B0E19] border-white/[0.08] text-white hover:border-indigo-500/40'
                    }`}
                    onClick={() => !isUsed && placeLetter(letter, i)}
                  >
                    {letter}
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}

          {/* Success banner */}
          <AnimatePresence mode="wait">
            {status === 'correct' && (
              <motion.div
                key="correct"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 overflow-hidden"
              >
                {confettiPieces.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, y: 0, x: 0 }}
                    animate={{ opacity: 0, y: -100, x: p.x }}
                    transition={{ duration: 1, delay: p.delay }}
                    className="absolute top-2 left-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                  />
                ))}
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Check size={14} /> Sahi Jawab! ✓
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    +{10 + (timeLeft > TIMER_BONUS_THRESHOLD ? 5 : 0) + (streak >= 2 ? 5 : 0)} Coins
                  </span>
                </div>
                <h4 className="text-sm font-black text-white">{currentWord.meaning}</h4>
                <p className="text-[11px] text-zinc-400 italic">📌 {currentWord.example}</p>
              </motion.div>
            )}

            {status === 'wrong' && (
              <motion.div
                key="wrong"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 space-y-1.5"
              >
                <span className="text-xs font-black text-red-400 uppercase tracking-widest block">
                  {timeLeft === 0 ? 'TIME OUT! ⏰' : 'Incorrect Guess! ✗'}
                </span>
                <p className="text-xs text-zinc-300 font-bold leading-normal">
                  Sahi Word tha: <span className="font-black text-white text-sm tracking-wider">{currentWord.word}</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">{currentWord.meaning}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="flex gap-3">
            {status === 'playing' ? (
              <>
                <button
                  onClick={resetWord}
                  className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <SkipForward size={14} /> Skip
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 focus:outline-none"
              >
                {index + 1 >= pool.length ? 'Show Results summary' : 'Next Word'} <Zap size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Results Screen Portal */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-[#090D1A] flex flex-col justify-center items-center p-6 text-center"
            >
              <div className="max-w-sm space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-2xl">
                  <Trophy size={36} className="text-amber-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">
                    {wordsSolved >= pool.length * 0.8 ? 'Shabda Champion! 🏆' : wordsSolved >= pool.length * 0.5 ? 'Gyan Sangeet! 🔥' : 'Nice Attempt! 💪'}
                  </h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    Solved {wordsSolved} out of {pool.length} Words
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <Coins size={18} className="text-amber-400 mx-auto mb-1" />
                    <span className="text-lg font-black text-white block">{earnedThisSession}</span>
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Coins Earned</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <BookOpen size={18} className="text-emerald-400 mx-auto mb-1" />
                    <span className="text-lg font-black text-white block">{mastered.length}</span>
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">Words Mastered</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3.5 rounded-2xl border border-white/10 hover:bg-white/5 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <RotateCcw size={14} /> Replay
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-all focus:outline-none"
                  >
                    Close Game
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Shabda Sangram — spell correct acronyms to solidify terminology retention
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { WordScramble };