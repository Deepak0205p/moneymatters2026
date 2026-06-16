"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Navigation, RotateCcw, Trophy, AlertTriangle, Flag, MapPin, Car } from 'lucide-react';

type Path = 'left' | 'right';

interface Question {
  id: number;
  q: string;
  emoji: string;
  options: { label: string; sub: string; value: Path; emoji: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    q: 'Tumhara monthly income ka kitna % bachate ho?',
    emoji: '💰',
    options: [
      { label: '0-10%', sub: 'Bilkul nahi bachata', value: 'left', emoji: '💸' },
      { label: '20%+', sub: 'Smart saver hoon', value: 'right', emoji: '🎯' },
    ],
  },
  {
    id: 2,
    q: 'Credit card ka bill kab bharte ho?',
    emoji: '💳',
    options: [
      { label: 'Minimum due', sub: 'Baaki rollover ho jaata', value: 'left', emoji: '😰' },
      { label: 'Full payment', sub: 'Time pe poora, no interest', value: 'right', emoji: '😎' },
    ],
  },
  {
    id: 3,
    q: 'Emergency fund kya hai tumhare paas?',
    emoji: '🛟',
    options: [
      { label: 'Kya hai ye?', sub: 'Pata hi nahi', value: 'left', emoji: '🤷' },
      { label: '3-6 months ka', sub: 'Sab kharcha saved', value: 'right', emoji: '✅' },
    ],
  },
  {
    id: 4,
    q: 'Paise invest karte ho kaise?',
    emoji: '📈',
    options: [
      { label: 'Savings a/c hi', sub: 'Wo bhi kaafi hai', value: 'left', emoji: '😴' },
      { label: 'SIP / Mutual funds', sub: 'Wealth grow karta hai', value: 'right', emoji: '🌱' },
    ],
  },
  {
    id: 5,
    q: 'iPhone jaisi badi cheez kaise kharidte ho?',
    emoji: '📱',
    options: [
      { label: 'EMI pe chalega', sub: 'No tension, monthly pay', value: 'left', emoji: '📱' },
      { label: 'Pehle save, phir kharido', sub: 'Cash payment always', value: 'right', emoji: '💵' },
    ],
  },
  {
    id: 6,
    q: 'Monthly budget banate ho kya?',
    emoji: '📊',
    options: [
      { label: 'Budget kya hota hai?', sub: 'Jo aaye wo udao', value: 'left', emoji: '🎲' },
      { label: 'Haan, categories me', sub: 'Needs/Wants/Savings', value: 'right', emoji: '📋' },
    ],
  },
  {
    id: 7,
    q: 'Tumhare kitne active loans hain?',
    emoji: '🏦',
    options: [
      { label: 'Multiple loans', sub: 'Personal + CC + EMI', value: 'left', emoji: '⛓️' },
      { label: 'Bilkul debt-free', sub: 'Ya sirf home loan', value: 'right', emoji: '🕊️' },
    ],
  },
];

export default function PaiseKaGPS() {
  const { addCoins, userName } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Path[]>([]);
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');

  const rightCount = useMemo(() => answers.filter((a) => a === 'right').length, [answers]);
  const score = Math.round((rightCount / QUESTIONS.length) * 100);
  const chosenPath: Path = score >= 50 ? 'right' : 'left';
  const eta = Math.max(3, Math.round(40 - (score / 100) * 35));

  const handleAnswer = (value: Path) => {
    const next = [...answers, value];
    setAnswers(next);
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('result');
      addCoins(25);
    }
  };

  const reset = () => {
    setAnswers([]);
    setCurrentQ(0);
    setPhase('quiz');
  };

  const progress = phase === 'result' ? 100 : Math.round((currentQ / QUESTIONS.length) * 100);

  const carPos = useMemo(() => {
    const startX = 40, startY = 100, forkX = 220, forkY = 100;
    const rightEndX = 380, rightEndY = 40;
    const leftEndX = 380, leftEndY = 160;
    if (progress < 70) {
      const t = progress / 70;
      return { x: startX + (forkX - startX) * t, y: startY };
    }
    const t = (progress - 70) / 30;
    const endX = chosenPath === 'right' ? rightEndX : leftEndX;
    const endY = chosenPath === 'right' ? rightEndY : leftEndY;
    return { x: forkX + (endX - forkX) * t, y: forkY + (endY - forkY) * t };
  }, [progress, chosenPath]);

  const carColor = phase === 'result' ? (chosenPath === 'right' ? '#10B981' : '#EF4444') : '#F59E0B';
  const q = QUESTIONS[currentQ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Navigation className="text-emerald" size={28} />
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-emerald">Paise Ka GPS</h2>
        </div>
        <p className="text-sm text-ink-muted font-medium">
          Financial Health Navigator — 7 sawaal, sahi rasta khud chuno!
        </p>
      </div>

      {/* Road SVG */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <svg viewBox="0 0 420 200" className="w-full h-auto">
          <defs>
            <linearGradient id="pgps-main" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            <linearGradient id="pgps-right" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="pgps-left" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Main road */}
          <rect x="20" y="92" width="200" height="16" rx="8" fill="url(#pgps-main)" stroke="rgba(255,255,255,0.10)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={`d-${i}`} x={40 + i * 22} y="98" width="10" height="4" rx="2" fill="rgba(255,255,255,0.28)" />
          ))}

          {/* Right branch — Freedom City */}
          <path d="M 220 100 Q 290 100 290 60 T 380 40" stroke="url(#pgps-right)" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* Left branch — Debt Trap Nagar */}
          <path d="M 220 100 Q 290 100 290 140 T 380 160" stroke="url(#pgps-left)" strokeWidth="16" fill="none" strokeLinecap="round" />

          {/* Start marker */}
          <g transform="translate(40, 100)">
            <circle r="7" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="1.5" />
            <text textAnchor="middle" y="24" fontSize="9" fill="#94A3B8" fontWeight="bold">START</text>
          </g>

          {/* Freedom City */}
          <g transform="translate(380, 40)">
            <circle r="26" fill="#10B981" opacity={phase === 'result' && chosenPath === 'right' ? '0.30' : '0.12'} />
            <text textAnchor="middle" y="6" fontSize="22">🏙️</text>
            <text textAnchor="middle" y="28" fontSize="8" fill="#10B981" fontWeight="bold">FREEDOM CITY</text>
          </g>

          {/* Debt Trap Nagar */}
          <g transform="translate(380, 160)">
            <circle r="26" fill="#EF4444" opacity={phase === 'result' && chosenPath === 'left' ? '0.30' : '0.12'} />
            <text textAnchor="middle" y="6" fontSize="22">🏚️</text>
            <text textAnchor="middle" y="28" fontSize="8" fill="#EF4444" fontWeight="bold">DEBT TRAP NAGAR</text>
          </g>

          {/* Car dot */}
          <motion.g
            animate={{ x: carPos.x, y: carPos.y }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            initial={{ x: 40, y: 100 }}
          >
            <circle r="16" fill={carColor} opacity="0.25" />
            <circle r="11" fill={carColor} stroke="#F8FAFC" strokeWidth="1.5" />
            <text textAnchor="middle" y="4" fontSize="13">🚗</text>
          </motion.g>
        </svg>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-ink-muted font-medium whitespace-nowrap">
            Sawaal {Math.min(currentQ + 1, QUESTIONS.length)}/{QUESTIONS.length}
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            />
          </div>
          <span className="text-xs text-emerald font-semibold tabular-nums">{progress}%</span>
        </div>
      </div>

      {/* Quiz / Result */}
      <AnimatePresence mode="wait">
        {phase === 'quiz' ? (
          <motion.div
            key={`q-${currentQ}`}
            className="glass-card rounded-2xl p-5 sm:p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0">{q.emoji}</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald font-bold">Question {currentQ + 1}</span>
                <h3 className="text-lg sm:text-xl font-display font-bold text-ink leading-tight">{q.q}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, idx) => {
                const isRight = opt.value === 'right';
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(opt.value)}
                    className="group text-left p-4 rounded-2xl border transition-all hover:scale-[1.02]"
                    style={{
                      background: isRight ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                      borderColor: isRight ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)',
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span
                        className="font-display font-bold text-lg"
                        style={{ color: isRight ? '#34D399' : '#F87171' }}
                      >
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted font-medium">{opt.sub}</p>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-[11px] text-center text-ink-muted/70 italic">
              💡 Sahi jawab chuno — tumhara car sahi shehar ki taraf chalega!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="rounded-2xl p-6 sm:p-8 text-center space-y-4"
            style={{
              background: chosenPath === 'right'
                ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
              border: `1px solid ${chosenPath === 'right' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14 }}
          >
            <motion.div
              className="text-6xl mb-2 inline-block"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {chosenPath === 'right' ? '🏆' : '⚠️'}
            </motion.div>

            <div className="flex items-center justify-center gap-2">
              {chosenPath === 'right' ? (
                <Trophy className="text-emerald" size={22} />
              ) : (
                <AlertTriangle className="text-red-500" size={22} />
              )}
              <h3 className="text-2xl sm:text-3xl font-display font-bold">
                {chosenPath === 'right' ? (
                  <span className="text-gradient-emerald">Financial Freedom City!</span>
                ) : (
                  <span style={{ color: '#F87171' }}>Debt Trap Nagar!</span>
                )}
              </h3>
            </div>

            <p className="text-sm text-ink-muted font-medium max-w-md mx-auto">
              {chosenPath === 'right'
                ? `Badhaai ho ${userName || 'dost'}! Tumhara car sahi raste pe hai. Score dekho — aur strong bano!`
                : `Chinta mat karo ${userName || 'dost'}, abhi sudhar sakta hai. Pehla step yehi hai — apne paise ka GPS check karna!`}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <div className="glass rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">Score</p>
                <p className={`text-2xl font-display font-bold ${chosenPath === 'right' ? 'text-emerald' : 'text-red-500'}`}>
                  {score}/100
                </p>
                <p className="text-[10px] text-ink-muted">Sahi jawab: {rightCount}/{QUESTIONS.length}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted font-bold">ETA to Freedom</p>
                <p className={`text-2xl font-display font-bold ${chosenPath === 'right' ? 'text-emerald' : 'text-gold'}`}>
                  {eta} yrs
                </p>
                <p className="text-[10px] text-ink-muted">Agar abhi se smart bane</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <Flag className="text-gold" size={18} />
              <p className="text-sm text-ink font-medium">
                {chosenPath === 'right'
                  ? 'Aur SIP badhao to 5 saal kam lagenge! 🚀'
                  : 'Pehla kaam: credit card debt zero karo, phir SIP shuru karo. 💪'}
              </p>
            </div>

            <motion.button
              onClick={reset}
              className="btn-emerald inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={16} /> Dobara Khelo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom journey legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1"><Car className="text-gold" size={14} /> Tumhara Car</span>
        <span className="flex items-center gap-1"><MapPin className="text-emerald" size={14} /> Freedom City</span>
        <span className="flex items-center gap-1"><AlertTriangle className="text-red-500" size={14} /> Debt Trap Nagar</span>
      </div>
    </div>
  );
}
