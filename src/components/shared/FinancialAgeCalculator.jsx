'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, PartyPopper, ArrowRight, Sparkles, Share2 } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const QUESTIONS = [
  {
    id: 'salary',
    question: 'Pehli salary ya pocket money se sabse pehle kya kiya tha?',
    emoji: '💸',
    category: 'Money Mindset',
    options: [
      { text: 'Sab kharch kar diya! Shopping 🛍️', score: 1, emoji: '💸' },
      { text: 'Thoda kharch kiya, thoda piggy bank mein daala 🐷', score: 2, emoji: '🤔' },
      { text: 'Aadha save kiya, aadha party/movies mein udaya 🎬', score: 3, emoji: '💰' },
      { text: 'Pehle savings side ki, bache hue se treats li 🎯', score: 4, emoji: '🎯' }
    ]
  },
  {
    id: 'budget',
    question: 'Kya aap har mahine ka budget banate ho?',
    emoji: '📝',
    category: 'Budgeting',
    options: [
      { text: 'Budget? Ye toh bade log karte hain 😅', score: 1, emoji: '🤷' },
      { text: 'Dimaag mein hota hai, strictly follow nahi hota 🧠', score: 2, emoji: '📅' },
      { text: 'Basic excel/app pe income aur key kharche trace karta hoon ✅', score: 3, emoji: '✅' },
      { text: 'Detailed budget plan (50-30-20 rule) har mahine solid track! 📊', score: 4, emoji: '📊' }
    ]
  },
  {
    id: 'emergency',
    question: 'Aapke paas emergency backup fund kitna hai?',
    emoji: '🛡️',
    category: 'Safety Net',
    options: [
      { text: 'Tijori khali hai boss! Dost se udhaar lena padega ❓', score: 1, emoji: '❓' },
      { text: '1-2 mahine ke basic kharche chal jayenge 🌱', score: 2, emoji: '🌱' },
      { text: '3-5 mahine ka standard locker backup hai 💪', score: 3, emoji: '💪' },
      { text: '6 mahine se zyada ka secure liquid surplus ready hai! 🛡️', score: 4, emoji: '🛡️' }
    ]
  },
  {
    id: 'sip',
    question: 'Kahin regular SIP ya mutual funds investments chal rahe hain?',
    emoji: '📈',
    category: 'Investing',
    options: [
      { text: 'Investment? Abhi toh kamana shuru kiya hai 🚫', score: 1, emoji: '🚫' },
      { text: 'FDs/Savings account mein hi pada rehta hai paisa 🏦', score: 2, emoji: '🏦' },
      { text: 'Chhote micro-investments ya crypto/stocks try kiya hai 🌱', score: 3, emoji: '🌱' },
      { text: 'Regular SIP & equity diversified portfolio mapped! 🚀', score: 4, emoji: '🚀' }
    ]
  },
  {
    id: 'credit',
    question: 'Credit card use karte ho toh bill kaise bharte ho?',
    emoji: '💳',
    category: 'Debt Management',
    options: [
      { text: 'Hamesha Minimum Due payment karta hoon, tension nahi letay 😬', score: 1, emoji: '😰' },
      { text: 'Partial bill bharta hoon jab extra salary bachti hai 🤷', score: 2, emoji: '🤷' },
      { text: 'Pura bill bharta hoon mostly on-time ✅', score: 3, emoji: '✅' },
      { text: 'Hamesha full automatic pay + 0 delay history track! 🎯', score: 4, emoji: '🎯' }
    ]
  },
  {
    id: 'insurance',
    question: 'Aapka health ya life insurance protection status kya hai?',
    emoji: '🏥',
    category: 'Insurance Protection',
    options: [
      { text: 'Insurance? Mujhe kuch nahi hone wala, full system strong! 🚫', score: 1, emoji: '🚫' },
      { text: 'Corporate ya parents wale health card pe trusted hoon 👨‍👩‍👦', score: 2, emoji: '👨‍👩‍👦' },
      { text: 'Haan, ek basic independent cover le rakha hai 📋', score: 3, emoji: '📋' },
      { text: 'Optimal personal cover (Health + Term insurance) fully secured! 🛡️', score: 4, emoji: '🛡️' }
    ]
  },
  {
    id: 'spend',
    question: 'Online sale/discount offers dekh ke kitna control rehta hai?',
    emoji: '🛍️',
    category: 'Spending Habits',
    options: [
      { text: 'No control! "ADD TO CART" aur swipe immediately! 😅', score: 1, emoji: '💸' },
      { text: 'Sochta hoon par 80% time buy kar hi leta hoon 🛍️', score: 2, emoji: '🛍' },
      { text: '24-hour rule apply karke control karne ki koshish karta hoon ⏰', score: 3, emoji: '⏰' },
      { text: 'Zaroorat evaluate karke wishlist mein daal ke wait karta hoon 📝', score: 4, emoji: '📝' }
    ]
  },
  {
    id: 'tax',
    question: 'ITR filings aur Tax-saving options ka kitna knowledge hai?',
    emoji: '📋',
    category: 'Tax Awareness',
    options: [
      { text: 'Tax toh employer kaat leta hai, mujhe kya pata 🤷', score: 1, emoji: '🤷' },
      { text: 'Bas 80C mein thoda LIC ya PPF savings pata hai 📚', score: 2, emoji: '📚' },
      { text: 'ELSS mutual funds aur NPS basic savings claim karta hoon ✅', score: 3, emoji: '✅' },
      { text: 'Proper planning se complete deductions optimize karta hoon! 📊', score: 4, emoji: '📊' }
    ]
  },
  {
    id: 'goal',
    question: 'Agle 5 saal ke liye koi dedicated money goal plan kiya hai?',
    emoji: '🎯',
    category: 'Goal Setting',
    options: [
      { text: 'Kal ki fikar kise hai, aaj chill karo! 😅', score: 1, emoji: '🤷' },
      { text: 'Dimaag mein hai ki gadi leni hai par savings mapped nahi 💭', score: 2, emoji: '💭' },
      { text: 'Approximate target set hai, thoda bachat chalu hai 📝', score: 3, emoji: '📝' },
      { text: 'SMART goals (Home, Travel, Business) with monthly budget track! 🎯', score: 4, emoji: '🎯' }
    ]
  }
];

function getAgeResult(score) {
  // Score mapping: 9 (min) to 36 (max). Real Age mapped from 12 to 60.
  const age = Math.round(12 + ((score - 9) / 27) * 48);
  
  if (score >= 30) {
    return {
      age,
      label: 'Financial Guru 🧙‍♂️',
      color: '#10B981',
      description: 'Waah yaar! Aap financial terms aur planning mein mature ho. Apni umar se bohot aage badh chuke ho!',
      tips: [
        'Apne portfolio ko global indices or smart equity assets mein diversify karo.',
        'Estate planning, nominees, aur basic will documentation organize karo.',
        'Dosto ko bhi bachat aur investment ke concepts share karo!'
      ]
    };
  }
  if (score >= 22) {
    return {
      age,
      label: 'Money Smart 🎯',
      color: '#06B6D4',
      description: 'Sahi direction mein ho! Thode aur minor fixes se aap fully mature money ninja ban sakte ho.',
      tips: [
        'Emergency surplus ko 6 mahine ke backup level tak expand karo.',
        'Har saal income hike ke sath SIP amount 10% step-up karo.',
        'Check karo absolute life term cover status.'
      ]
    };
  }
  if (score >= 14) {
    return {
      age,
      label: 'Financial Teenager 📚',
      color: '#F59E0B',
      description: 'Abhi learning stage chal rahi hai. Basic bachat hai, par deep investments aur discipline abhi build karna hai.',
      tips: [
        'Har mahine salary aate hi pehle ₹1,000 auto-invest set kar do.',
        'Emergency fund ko safe bank liquid account mein log karna shuru karo.',
        'Credit limit use 30% se kam rakho to protect CIBIL.'
      ]
    };
  }
  return {
    age,
    label: 'Financial Kid 👶',
    color: '#EF4444',
    description: 'Abhi financial literacy level starting point pe hai. Par ghabrao nahi, seekhne ki koi umar nahi hoti!',
    tips: [
      'Daily spends track karne ke liye diary or tracker use karo.',
      'Dost se udhaar lene ke bajaye short-term savings buffer lock karo.',
      'Money Matters ke basic modules ko regular refer karo.'
    ]
  };
}

export default function FinancialAgeCalculator({ open, onClose }) {
  const { addCoins, addBadge } = useAppStore();
  const [gameState, setGameState] = useState('intro'); // intro | playing | reveal | result
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [revealedAge, setRevealedAge] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset state on close
      setGameState('intro');
      setCurrentIdx(0);
      setAnswers([]);
      setRevealedAge(null);
    }
  }, [open]);

  const totalScore = useMemo(() => answers.reduce((s, v) => s + v, 0), [answers]);
  const result = useMemo(() => getAgeResult(totalScore), [totalScore]);

  const handleAnswer = useCallback((score) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameState('reveal');
      const finalScore = nextAnswers.reduce((a, b) => a + b, 0);
      const finalResult = getAgeResult(finalScore);

      setTimeout(() => {
        setRevealedAge(finalResult.age);
        setGameState('result');
        addCoins(20);
        addBadge('financial-age');
      }, 2500);
    }
  }, [answers, currentIdx, addCoins, addBadge]);

  const handleRestart = () => {
    setGameState('intro');
    setCurrentIdx(0);
    setAnswers([]);
    setRevealedAge(null);
  };

  const handleShare = () => {
    const text = `Mera Financial Age: ${revealedAge} saal hai! 🎂\nCategory: ${result.label}\n\nApna Ameer Meter status check karo Money Matters app par! 📈`;
    if (navigator.share) {
      navigator.share({ title: 'Ameer Meter Result', text }).catch(() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Result copied to clipboard! 📋" });
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Result copied to clipboard! 📋" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />

        {/* Top Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Sparkles size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Ameer Meter 📈</h2>
              <p className="text-[10px] text-zinc-400">Financial Maturity Age Calculator</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
          <AnimatePresence mode="wait">
            
            {/* INTRO SCREEN */}
            {gameState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6 py-4"
              >
                <div className="text-6xl animate-bounce">🎂</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">Aapki Asli Financial Age Kya Hai?</h3>
                  <p className="text-xs text-zinc-400 px-6 leading-relaxed">
                    9 simple spending aur money management questions ka sach-sach jawab dein aur pata karein ki aapka money mindset kitna mature hai.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-3">
                    <span className="text-xl block">⏱️</span>
                    <span className="text-[10px] text-zinc-400 font-bold block mt-1">2 mins only</span>
                  </div>
                  <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-3">
                    <span className="text-xl block">💎</span>
                    <span className="text-[10px] text-zinc-400 font-bold block mt-1">+20 Coins</span>
                  </div>
                  <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-3">
                    <span className="text-xl block">💡</span>
                    <span className="text-[10px] text-zinc-400 font-bold block mt-1">Custom tips</span>
                  </div>
                </div>

                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-violet-500/10 cursor-pointer"
                >
                  Start Ameer Meter Test <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* QUESTIONS SCREEN */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 py-2"
              >
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest shrink-0">
                    Q: {currentIdx + 1}/{QUESTIONS.length}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 transition-all duration-300"
                      style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Category label */}
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-black uppercase tracking-wider">
                    {QUESTIONS[currentIdx].category}
                  </span>
                </div>

                <h3 className="text-base font-black text-white text-center leading-snug px-2">
                  {QUESTIONS[currentIdx].question}
                </h3>

                {/* Options list */}
                <div className="space-y-2.5">
                  {QUESTIONS[currentIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.score)}
                      className="w-full p-4 rounded-2xl bg-[#0B0E19] border border-white/[0.04] hover:border-violet-500/30 text-left flex items-start gap-3.5 transition-all group cursor-pointer"
                    >
                      <span className="text-lg bg-white/5 p-1 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                        {opt.emoji}
                      </span>
                      <span className="text-xs font-semibold text-zinc-300 group-hover:text-white leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REVEAL ANIMATION SCREEN */}
            {gameState === 'reveal' && (
              <motion.div
                key="reveal"
                className="text-center py-16 space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-7xl"
                >
                  🔮
                </motion.div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-violet-400 uppercase tracking-widest animate-pulse">
                    Analyzing Answers...
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Calculations run ho rahi hain aapke money mind map pe.
                  </p>
                </div>
              </motion.div>
            )}

            {/* RESULTS SCREEN */}
            {gameState === 'result' && (
              <motion.div
                key="result"
                className="space-y-6 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Visual Age Circle */}
                <div className="text-center space-y-2 relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-violet-500/20 bg-violet-500/5 mx-auto flex flex-col items-center justify-center relative">
                    <span className="text-xs text-zinc-400">Financial Age</span>
                    <span className="text-5xl font-black" style={{ color: result.color }}>
                      {revealedAge}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase">Years Old</span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: `${result.color}15`, color: result.color, border: `1px solid ${result.color}25` }}
                  >
                    {result.label}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed px-4">
                    {result.description}
                  </p>
                </div>

                {/* Score bar */}
                <div className="bg-[#05070F] border border-white/[0.03] rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                    <span>Maturity Score</span>
                    <span>{totalScore} / 36</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ backgroundColor: result.color, width: `${(totalScore / 36) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Personalized suggestions */}
                <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-violet-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={13} /> Doctor's Money Prescription
                  </h4>
                  <div className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="text-emerald-500 font-extrabold mt-0.5">✓</span>
                        <span className="leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 size={13} /> {copied ? 'Copied Link!' : 'Share Status'}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="px-5 py-3 rounded-2xl border border-white/[0.06] text-xs font-extrabold text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw size={12} /> Retake Test
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Ameer Meter — +20 Coins Awarded upon completion
          </p>
        </div>
      </motion.div>
    </div>
  );
}