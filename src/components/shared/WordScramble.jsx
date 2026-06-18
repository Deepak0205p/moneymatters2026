'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Type, Timer, Lightbulb, SkipForward, RotateCcw, Trophy, X, Flame, Coins, Check, BookOpen, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

/* ============================================================
   Word Scramble — Midnight Wealth + Emerald Growth redesign
   ============================================================ */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
  banking: [{
    word: 'LOAN',
    hint: 'Bank se liya gaya paisa jo wapas chukana padta hai',
    meaning: 'Loan — bank ya kisi se liya hua paisa',
    example: 'Education loan ₹2L liya for higher studies.'
  }, {
    word: 'KYC',
    hint: 'Bank account kholte waqt yeh verification hoti hai',
    meaning: 'Know Your Customer — pehchaan ka proof',
    example: 'Aadhaar + PAN dikhao to KYC ho jaata hai.'
  }, {
    word: 'NEFT',
    hint: 'Bank se bank paisa bhejne ka system',
    meaning: 'National Electronic Funds Transfer',
    example: 'Mummy ne NEFT se ₹5000 bheje.'
  }, {
    word: 'UPI',
    hint: 'Phone scan karke instant paisa transfer',
    meaning: 'Unified Payments Interface —扫码付款',
    example: 'Chai tapri pe bhi UPI chal jata hai.'
  }, {
    word: 'FD',
    hint: 'Bank mein paisa fixed time ke liye lock kar do',
    meaning: 'Fixed Deposit — safe + guaranteed return',
    example: '₹10,000 ka FD kar diya 1 saal ke liye.'
  }, {
    word: 'ATM',
    hint: 'Cash machine jahan card daal ke paisa nikalte hain',
    meaning: 'Automated Teller Machine',
    example: 'ATM se ₹2000 nikale college ke liye.'
  }, {
    word: 'CHEQUE',
    hint: 'Paper par likha hua paisa order',
    meaning: 'Cheque — bank instruction to pay',
    example: 'School fee cheque se bhar di.'
  }, {
    word: 'ACCOUNT',
    hint: 'Bank mein tumhare paisa ka dabba',
    meaning: 'Bank Account — paisa store karne ka jagah',
    example: 'Pehla account 18 saal mein khulwa.'
  }],
  investment: [{
    word: 'SIP',
    hint: 'Har mahine fixed amount invest karte hain',
    meaning: 'Systematic Investment Plan',
    example: '₹1000/month SIP se ₹10L banta hai 15 saal mein.'
  }, {
    word: 'NAV',
    hint: 'Mutual fund ek unit ki keemat',
    meaning: 'Net Asset Value — fund ka per-unit price',
    example: 'NAV ₹100 hai to ₹1000 se 10 units milte hain.'
  }, {
    word: 'STOCK',
    hint: 'Company ka hissa jo kharid sakte ho',
    meaning: 'Stock / Share — company ki ownership ka part',
    example: 'Tata stock liya — ab tum bhi owner!'
  }, {
    word: 'BOND',
    hint: 'Govt ya company ka debt instrument',
    meaning: 'Bond — fixed interest dene ka vaada',
    example: 'Govt bond 7% return de raha hai.'
  }, {
    word: 'GOLD',
    hint: 'Lal dhaatu jisme paisa save karte hain',
    meaning: 'Gold — inflation se bachne ka safe option',
    example: 'Akshaya Tritiya pe gold ETF liya.'
  }, {
    word: 'CAGR',
    hint: 'Saal bhar ka average growth rate',
    meaning: 'Compound Annual Growth Rate',
    example: '12% CAGR matlab paisa har saal 12% badhta hai.'
  }, {
    word: 'ELSS',
    hint: 'Tax bachata hai + market return deta hai',
    meaning: 'Equity Linked Savings Scheme — tax-saving MF',
    example: '₹1.5L ELSS se ₹46k tax bachaya.'
  }, {
    word: 'NIFTY',
    hint: 'Top 50 companies ka index',
    meaning: 'Nifty 50 — NSE ka benchmark index',
    example: 'Nifty 22,000 pe aaya — market up!'
  }],
  tax: [{
    word: 'PAN',
    hint: '10 digit ka tax identity card',
    meaning: 'Permanent Account Number',
    example: 'PAN card bina tax return nahi hota.'
  }, {
    word: 'GST',
    hint: 'Cheez kharidne par lagta yeh tax',
    meaning: 'Goods and Services Tax',
    example: 'Zomato bill pe 5% GST dikhta hai.'
  }, {
    word: 'ITR',
    hint: 'Saal mein ek baar bharo yeh form',
    meaning: 'Income Tax Return',
    example: 'Salary aane ke baad ITR file karo.'
  }, {
    word: 'TDS',
    hint: 'Payment se pehle hi kaata gaya tax',
    meaning: 'Tax Deducted at Source',
    example: 'FD pe 10% TDS kaat diya bank ne.'
  }, {
    word: 'SLAB',
    hint: 'Income ke hisaab se tax rate bracket',
    meaning: 'Tax Slab — income range ka rate',
    example: '₹3L-7L slab mein 5% tax lagta hai.'
  }, {
    word: 'REFUND',
    hint: 'Zyada tax bharne par wapas paisa',
    meaning: 'Tax Refund — overpaid tax wapas',
    example: '₹3,000 ka refund aaya direct account mein.'
  }, {
    word: 'AUDIT',
    hint: 'Accounts ki official jaanch',
    meaning: 'Tax Audit — official account check',
    example: 'Crore+ business ka audit zaroori hai.'
  }, {
    word: 'RELIEF',
    hint: 'Tax se bachav ke section',
    meaning: 'Tax Relief — 87A jaise rebate',
    example: '₹12,500 ka relief mil gaya section 87A se.'
  }],
  insurance: [{
    word: 'POLICY',
    hint: 'Insurance ka official contract paper',
    meaning: 'Policy — insurance agreement document',
    example: 'Term policy ₹1cr ki liye ₹6000/year.'
  }, {
    word: 'PREMIUM',
    hint: 'Insurance ke liye har saal dene ka paisa',
    meaning: 'Premium — insurance ka periodic charge',
    example: '₹8000 annual premium health insurance ka.'
  }, {
    word: 'CLAIM',
    hint: 'Insurance se paisa maangne ka process',
    meaning: 'Claim — insurance company se paisa lena',
    example: 'Hospital bill ₹50k ka claim kiya.'
  }, {
    word: 'TERM',
    hint: 'Sabse sasta life insurance plan',
    meaning: 'Term Insurance — pure life cover',
    example: '₹1cr term cover for 30 saal.'
  }, {
    word: 'RIDER',
    hint: 'Policy ke sath extra benefit add karo',
    meaning: 'Rider — additional coverage add-on',
    example: 'Accident rider ₹500 extra mein lagaya.'
  }, {
    word: 'NOMINEE',
    hint: 'Tumhare baad paisa milne waala insaan',
    meaning: 'Nominee — claim beneficiary',
    example: 'Mummy ko nominee banaya policy mein.'
  }, {
    word: 'COVER',
    hint: 'Kitne tak ka insurance protection',
    meaning: 'Cover — insurance amount limit',
    example: '₹10L health cover sufficient hai.'
  }, {
    word: 'COPAY',
    hint: 'Tumhara hissa har claim mein',
    meaning: 'Co-pay — patient ka % share',
    example: '20% copay matlab ₹10k ka ₹2k tum denge.'
  }]
};
const TIMER_BONUS_THRESHOLD = 20; // seconds below which bonus coins awarded

/* Scramble letters — guaranteed non-trivial scramble */
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

/* ============================================================ */

export default function WordScramble({
  open,
  onClose
}) {
  const {
    addCoins,
    addBadge,
    coins
  } = useAppStore();
  const [category, setCategory] = useState('banking');
  const [pool, setPool] = useState(() => shuffle(WORDS.banking));
  const [index, setIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [usedIndices, setUsedIndices] = useState([]);
  const [status, setStatus] = useState('playing');
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

  /* Initialize first word */
  useEffect(() => {
    if (!open) return;
    resetWord();
  }, [open, index, resetWord]);

  /* Timer */
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
  const handleCategoryChange = cat => {
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
  const placeLetter = (letter, sourceIdx) => {
    if (status !== 'playing') return;
    const emptySlot = placed.findIndex(p => p === null);
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

  /* Remove letter from slot (tap to remove) */
  const removeFromSlot = slotIdx => {
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
  const handleReorder = newOrder => {
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

  /* Confetti positions for correct answer */
  const confettiPieces = useMemo(() => Array.from({
    length: 14
  }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 220,
    delay: Math.random() * 0.15
  })), [index]);
  const cat = CATEGORY_CONFIG[category];
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: v => !v && onClose(),
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg max-h-[92vh] overflow-y-auto p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay",
      children: [/*#__PURE__*/_jsx(VisuallyHidden, {
        children: /*#__PURE__*/_jsx(DialogTitle, {
          children: "Word Scramble \u2014 Financial Terms"
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: cn('relative px-5 pt-6 pb-5 bg-gradient-to-b to-transparent', cat.tint),
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-10 h-10 rounded-xl glass-card-premium grid place-items-center",
              children: /*#__PURE__*/_jsx(Type, {
                className: "w-5 h-5 text-emerald-400"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: cn('font-display text-xl font-bold heading-gradient'),
                children: "Word Scramble"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-[#94A3B8]",
                children: "Akshar jodo, term sikhlo \uD83E\uDDE9"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-card",
            children: [/*#__PURE__*/_jsx(Coins, {
              className: "w-4 h-4 text-amber-400"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-sm font-semibold text-amber-400",
              children: earnedThisSession
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between text-xs mb-1.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[#94A3B8]",
            children: "\uD83D\uDCDA Words Mastered"
          }), /*#__PURE__*/_jsxs("span", {
            className: "font-semibold text-[#F8FAFC]",
            children: [mastered.length, "/30"]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "h-1.5 rounded-full bg-white/[0.06] overflow-hidden",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: "h-full bg-gradient-to-r from-emerald-400 to-emerald-500",
            initial: {
              width: 0
            },
            animate: {
              width: `${Math.min(100, mastered.length / 30 * 100)}%`
            },
            transition: {
              type: 'spring',
              stiffness: 120,
              damping: 18
            }
          })
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "px-5 pb-3",
        children: /*#__PURE__*/_jsx("div", {
          className: "flex gap-2 overflow-x-auto pb-1 no-scrollbar",
          children: Object.keys(CATEGORY_CONFIG).map(id => {
            const c = CATEGORY_CONFIG[id];
            const active = id === category;
            return /*#__PURE__*/_jsxs("button", {
              onClick: () => handleCategoryChange(id),
              className: cn('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border', active ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'glass-card border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]'),
              children: [/*#__PURE__*/_jsx("span", {
                className: "mr-1",
                children: c.emoji
              }), c.label]
            }, id);
          })
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-5 pb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between gap-2 mb-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card",
            children: [/*#__PURE__*/_jsx(Timer, {
              className: cn('w-4 h-4', timeLeft <= 10 ? 'text-rose-400' : 'text-emerald-400')
            }), /*#__PURE__*/_jsxs("span", {
              className: cn('font-mono font-bold text-sm', timeLeft <= 10 ? 'text-rose-400' : 'text-[#F8FAFC]'),
              children: [timeLeft, "s"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card",
            children: [/*#__PURE__*/_jsx(Flame, {
              className: "w-4 h-4 text-amber-400"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-bold text-sm text-amber-400",
              children: [streak, "x"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xs text-[#94A3B8]",
              children: "Word"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-bold text-sm text-[#F8FAFC]",
              children: [index + 1, "/", pool.length]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-5",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: cn('h-full', timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 20 ? 'bg-amber-400' : 'bg-emerald-400'),
            animate: {
              width: `${timeLeft / 45 * 100}%`
            },
            transition: {
              duration: 0.4,
              ease: 'linear'
            }
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "mb-4",
          children: [/*#__PURE__*/_jsxs("button", {
            onClick: () => setHintShown(s => !s),
            className: "flex items-center gap-2 text-sm text-[#94A3B8] hover:text-amber-400 transition",
            children: [/*#__PURE__*/_jsx(Lightbulb, {
              className: cn('w-4 h-4', hintShown ? 'text-amber-400' : '')
            }), /*#__PURE__*/_jsx("span", {
              children: hintShown ? 'Hint chhupao' : 'Hint dekho'
            })]
          }), /*#__PURE__*/_jsx(AnimatePresence, {
            children: hintShown && /*#__PURE__*/_jsx(motion.div, {
              initial: {
                opacity: 0,
                height: 0
              },
              animate: {
                opacity: 1,
                height: 'auto'
              },
              exit: {
                opacity: 0,
                height: 0
              },
              className: "mt-2 p-3 rounded-xl glass-card border-amber-400/20",
              children: /*#__PURE__*/_jsxs("p", {
                className: "text-sm text-amber-200/90 leading-relaxed",
                children: ["\uD83D\uDCA1 ", currentWord.hint]
              })
            })
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex flex-wrap justify-center gap-2 mb-5",
          children: placed.map((letter, i) => /*#__PURE__*/_jsx(motion.button, {
            onClick: () => removeFromSlot(i),
            disabled: status === 'correct',
            whileHover: letter ? {
              scale: 1.06
            } : {},
            whileTap: letter ? {
              scale: 0.94
            } : {},
            animate: status === 'correct' ? {
              boxShadow: '0 0 24px rgba(245,158,11,0.6)',
              borderColor: 'rgba(245,158,11,0.7)'
            } : status === 'wrong' ? {
              x: [0, -6, 6, -4, 4, 0]
            } : {},
            transition: status === 'wrong' ? {
              duration: 0.4
            } : {
              duration: 0.3
            },
            className: cn('w-11 h-12 sm:w-12 sm:h-14 rounded-xl grid place-items-center text-xl font-bold font-display', letter ? status === 'correct' ? 'glass-card-premium text-amber-300 border-amber-400/50' : status === 'wrong' ? 'glass-card text-rose-300 border-rose-500/40' : 'glass-strong text-emerald-300 border-emerald-400/30' : 'border-2 border-dashed border-white/[0.10] text-transparent bg-white/[0.02]'),
            children: letter ?? '·'
          }, i))
        }), status !== 'correct' && /*#__PURE__*/_jsx(Reorder.Group, {
          axis: "x",
          values: scrambledLetters,
          onReorder: handleReorder,
          className: "flex flex-wrap justify-center gap-2 mb-5",
          children: scrambledLetters.map((letter, i) => {
            const isUsed = usedIndices.includes(i);
            return /*#__PURE__*/_jsx(Reorder.Item, {
              value: letter,
              whileDrag: {
                scale: 1.15,
                zIndex: 50,
                boxShadow: '0 12px 32px rgba(16,185,129,0.4)'
              },
              className: cn('w-11 h-12 sm:w-12 sm:h-14 rounded-xl grid place-items-center text-xl font-bold font-display card-3d cursor-grab active:cursor-grabbing select-none', isUsed ? 'opacity-30 pointer-events-none glass-card text-[#94A3B8]' : 'glass-card-premium text-[#F8FAFC] hover:text-emerald-300'),
              onClick: () => !isUsed && placeLetter(letter, i),
              children: letter
            }, `${letter}-${i}`);
          })
        }), /*#__PURE__*/_jsxs(AnimatePresence, {
          mode: "wait",
          children: [status === 'correct' && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 12
            },
            animate: {
              opacity: 1,
              y: 0
            },
            exit: {
              opacity: 0
            },
            className: "relative p-4 rounded-2xl glass-card-premium mb-4 overflow-hidden",
            children: [confettiPieces.map(p => /*#__PURE__*/_jsx(motion.div, {
              initial: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1
              },
              animate: {
                opacity: 0,
                y: -120,
                x: p.x,
                scale: 0.4,
                rotate: 360
              },
              transition: {
                duration: 1,
                delay: p.delay
              },
              className: "absolute top-2 left-1/2 w-2 h-2 rounded-full bg-amber-400"
            }, p.id)), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/*#__PURE__*/_jsx(Check, {
                className: "w-5 h-5 text-emerald-400"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-display text-lg font-bold text-emerald-300",
                children: "Sahi Jawab! \uD83C\uDF89"
              }), /*#__PURE__*/_jsxs("span", {
                className: "ml-auto px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold",
                children: ["+", 10 + (timeLeft > TIMER_BONUS_THRESHOLD ? 5 : 0) + (streak >= 2 ? 5 : 0), " coins"]
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-[#F8FAFC] font-semibold",
              children: currentWord.meaning
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-[#94A3B8] mt-1 italic",
              children: ["\uD83D\uDCCC ", currentWord.example]
            })]
          }, "correct"), status === 'wrong' && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 12
            },
            animate: {
              opacity: 1,
              y: 0
            },
            exit: {
              opacity: 0
            },
            className: "p-4 rounded-2xl glass-card border-rose-500/30 mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-1",
              children: [/*#__PURE__*/_jsx(X, {
                className: "w-5 h-5 text-rose-400"
              }), /*#__PURE__*/_jsx("span", {
                className: "font-display text-lg font-bold text-rose-300",
                children: timeLeft === 0 ? 'Time up! ⏰' : 'Arre, galat! 🤔'
              })]
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-[#F8FAFC]",
              children: ["Sahi jawab: ", /*#__PURE__*/_jsx("span", {
                className: "font-bold text-amber-300",
                children: currentWord.word
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-[#94A3B8] mt-1",
              children: currentWord.meaning
            })]
          }, "wrong")]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-2",
          children: [status === 'playing' && /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: resetWord,
              className: "flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center justify-center gap-1.5",
              children: [/*#__PURE__*/_jsx(RotateCcw, {
                className: "w-4 h-4"
              }), " Reset"]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: handleSkip,
              className: "flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center justify-center gap-1.5",
              children: [/*#__PURE__*/_jsx(SkipForward, {
                className: "w-4 h-4"
              }), " Skip"]
            })]
          }), (status === 'correct' || status === 'wrong') && /*#__PURE__*/_jsx("button", {
            onClick: handleNext,
            className: "flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-1.5",
            children: index + 1 >= pool.length ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Trophy, {
                className: "w-4 h-4"
              }), " Result Dekho"]
            }) : /*#__PURE__*/_jsxs(_Fragment, {
              children: ["Aage Badho ", /*#__PURE__*/_jsx(Zap, {
                className: "w-4 h-4"
              })]
            })
          })]
        })]
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        children: showResult && /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "absolute inset-0 z-20 grid place-items-center bg-[#0B1220]/95 backdrop-blur-md p-6",
          children: /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              scale: 0.85,
              y: 20
            },
            animate: {
              scale: 1,
              y: 0
            },
            transition: {
              type: 'spring',
              stiffness: 200,
              damping: 18
            },
            className: "text-center max-w-xs",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-20 h-20 mx-auto rounded-full glass-card-premium grid place-items-center mb-4",
              children: /*#__PURE__*/_jsx(Trophy, {
                className: "w-10 h-10 text-amber-400"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-2xl font-bold heading-gradient mb-1",
              children: wordsSolved >= pool.length * 0.8 ? 'Champion! 🏆' : wordsSolved >= pool.length * 0.5 ? 'Shabaash! 🔥' : 'Achhi Koshish! 💪'
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-[#94A3B8] mb-5",
              children: ["Tumne ", wordsSolved, "/", pool.length, " words solve kar liye!"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3 mb-5",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "p-3 rounded-xl glass-card",
                children: [/*#__PURE__*/_jsx(Coins, {
                  className: "w-5 h-5 mx-auto text-amber-400 mb-1"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xl font-bold text-amber-300",
                  children: earnedThisSession
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-[#94A3B8]",
                  children: "Coins Earned"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "p-3 rounded-xl glass-card",
                children: [/*#__PURE__*/_jsx(BookOpen, {
                  className: "w-5 h-5 mx-auto text-emerald-400 mb-1"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xl font-bold text-emerald-300",
                  children: mastered.length
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-[#94A3B8]",
                  children: "Mastered Words"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex gap-2",
              children: [/*#__PURE__*/_jsxs("button", {
                onClick: handleReset,
                className: "flex-1 py-3 rounded-xl btn-3d bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold",
                children: [/*#__PURE__*/_jsx(RotateCcw, {
                  className: "w-4 h-4 inline mr-1"
                }), " Phir Khelo"]
              }), /*#__PURE__*/_jsx("button", {
                onClick: onClose,
                className: "flex-1 py-3 rounded-xl glass-card text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC]",
                children: "Band Karo"
              })]
            })]
          })
        })
      })]
    })
  });
}