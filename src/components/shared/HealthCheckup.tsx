"use client";

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, HeartPulse, CheckCircle2, ArrowRight, RotateCcw, Share2, Sparkles,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useAppStore, type HealthCheckupResult } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
interface HealthCheckupProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Quiz questions — Hinglish, Instagram-story style
   ────────────────────────────────────────────────────────────── */
interface QuizOption {
  text: string;
  score: number;
  emoji: string;
}
interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  heroEmoji: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'emergency',
    question: 'Emergency fund kitna hai?',
    subtitle: '3-6 mahine ka kharcha cover karta hai?',
    heroEmoji: '🛡️',
    options: [
      { text: 'Koi fund nahi', score: 0, emoji: '😰' },
      { text: '1 mahine ka hai', score: 4, emoji: '😐' },
      { text: '3 mahine ka hai', score: 8, emoji: '😊' },
      { text: '6+ mahine ka hai', score: 12, emoji: '🤩' },
    ],
  },
  {
    id: 'budgeting',
    question: 'Monthly budget banate ho?',
    subtitle: 'Kharcha plan karke karte ho ya random?',
    heroEmoji: '📝',
    options: [
      { text: 'Budget? Kya hota hai!', score: 0, emoji: '🙈' },
      { text: 'Dimag me hai, paper pe nahi', score: 4, emoji: '🤔' },
      { text: 'Haan, basic budget banata hu', score: 8, emoji: '✅' },
      { text: 'Detail me track karta hu', score: 12, emoji: '📊' },
    ],
  },
  {
    id: 'savings',
    question: 'Mahine me kitna bachate ho?',
    subtitle: 'Income ka kitna percent save hota hai?',
    heroEmoji: '💰',
    options: [
      { text: 'Kuch nahi bach paata', score: 0, emoji: '💸' },
      { text: '10% se kam', score: 4, emoji: '🪙' },
      { text: '10-20% bachata hu', score: 8, emoji: '🏦' },
      { text: '20% se zyada!', score: 12, emoji: '🚀' },
    ],
  },
  {
    id: 'debt',
    question: 'Credit card ka karna kaise hota hai?',
    subtitle: 'Pura bill pay karte ho ya minimum?',
    heroEmoji: '💳',
    options: [
      { text: 'Minimum pay karta hu', score: 0, emoji: '😱' },
      { text: 'Kabhi full, kabhi partial', score: 4, emoji: '😬' },
      { text: 'Hamesha full pay karta hu', score: 12, emoji: '💪' },
      { text: 'Credit card use nahi karta', score: 8, emoji: '🚫' },
    ],
  },
  {
    id: 'investment',
    question: 'Investment kiya hai kahin?',
    subtitle: 'SIP, FD, mutual fund, stocks?',
    heroEmoji: '📈',
    options: [
      { text: 'Nahi, abhi tak nahi', score: 0, emoji: '😴' },
      { text: 'FD/Savings account me hai', score: 4, emoji: '🏦' },
      { text: 'Haan, mutual fund/SIP', score: 12, emoji: '🎯' },
      { text: 'Stocks + MF + PPF — mixed!', score: 10, emoji: '🌟' },
    ],
  },
  {
    id: 'insurance',
    question: 'Insurance hai tumhara?',
    subtitle: 'Health aur life insurance dono?',
    heroEmoji: '🛡️',
    options: [
      { text: 'Koi insurance nahi', score: 0, emoji: '🚨' },
      { text: 'Bas company ka hai', score: 4, emoji: '🤷' },
      { text: 'Health insurance hai', score: 8, emoji: '👍' },
      { text: 'Health + Life dono hai', score: 12, emoji: '✅' },
    ],
  },
  {
    id: 'learning',
    question: 'Finance ke baare me kitna seekhte ho?',
    subtitle: 'Videos, articles, books padhte ho?',
    heroEmoji: '📚',
    options: [
      { text: 'Kabhi nahi padha', score: 0, emoji: '🙈' },
      { text: 'Kabhi-kabhi YouTube dekhta', score: 4, emoji: '📺' },
      { text: 'Regular content follow karta', score: 8, emoji: '📖' },
      { text: 'Padhta + apply karta hu', score: 12, emoji: '🎓' },
    ],
  },
];

const MAX_SCORE = QUESTIONS.length * 12;

/* ──────────────────────────────────────────────────────────────
   Get grade based on percentage
   ────────────────────────────────────────────────────────────── */
function getGrade(pct: number) {
  if (pct >= 75) return { label: 'Fit', emoji: '💪', color: '#10B981', tip: 'Tum financial ninja ho! Keep it up!' };
  if (pct >= 50) return { label: 'Average', emoji: '🤔', color: '#F59E0B', tip: 'Theek ho, par sudhar zaroori hai!' };
  return { label: 'ICU mein hai', emoji: '🏥', color: '#EF4444', tip: 'Tension mat lo, abhi shuru karo!' };
}

function getRecommendations(answers: Record<string, number>): string[] {
  const tips: string[] = [];
  if ((answers.emergency ?? 0) < 8) tips.push('🛡️ Pehle emergency fund banao — 3 mahine ka kharcha band karo.');
  if ((answers.budgeting ?? 0) < 8) tips.push('📝 Har mahine budget banao — 50-30-20 rule follow karo.');
  if ((answers.savings ?? 0) < 8) tips.push('💰 Income ka kam se kam 20% bachao — automate karo!');
  if ((answers.debt ?? 0) < 8) tips.push('💳 Credit card ka hamesha full pay karo — minimum = trap!');
  if ((answers.investment ?? 0) < 8) tips.push('📈 SIP start karo — ₹500/month se bhi compounding ka jadoo chalega!');
  if ((answers.insurance ?? 0) < 8) tips.push('🏥 Health insurance zaroori hai — medical emergency savings kha jaata hai!');
  if ((answers.learning ?? 0) < 8) tips.push('📚 Financial literacy badhao — har hafte 1 video/article padho!');
  if (tips.length === 0) tips.push('🌟 Tum already on track ho! Naye goals set karo aur grow karo!');
  return tips.slice(0, 3);
}

/* ──────────────────────────────────────────────────────────────
   Progress dots — Instagram story style
   ────────────────────────────────────────────────────────────── */
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: i < current ? '100%' : i === current ? '100%' : '0%' }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald to-ai"
          />
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Speedometer-style health meter reveal
   ────────────────────────────────────────────────────────────── */
function HealthMeter({ score }: { score: number }) {
  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const grade = getGrade(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible">
        <defs>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="meterGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background arc */}
        <path
          d={`M 30 130 A ${radius} ${radius} 0 0 1 210 130`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Color zone ticks */}
        {[0, 25, 50, 75, 100].map((t) => {
          const angle = Math.PI - (t / 100) * Math.PI;
          const x = 120 + Math.cos(angle) * (radius + 16);
          const y = 130 - Math.sin(angle) * (radius + 16);
          return <text key={t} x={x} y={y} fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{t}</text>;
        })}
        {/* Score arc */}
        <motion.path
          d={`M 30 130 A ${radius} ${radius} 0 0 1 210 130`}
          fill="none"
          stroke="url(#meterGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          filter="url(#meterGlow)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        />
        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (score / 100) * 180 }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
          style={{ transformOrigin: '120px 130px' }}
        >
          <line x1="120" y1="130" x2="120" y2="60" stroke={grade.color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="130" r="8" fill={grade.color} />
        </motion.g>
      </svg>
      <div className="absolute top-12 flex flex-col items-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="font-display text-5xl font-extrabold"
          style={{ color: grade.color, textShadow: `0 0 30px ${grade.color}80` }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export default function HealthCheckup({ open, onClose }: HealthCheckupProps) {
  const { healthCheckup, setHealthCheckup } = useAppStore();
  const [step, setStep] = useState<'intro' | 'quiz' | 'results'>(
    healthCheckup ? 'results' : 'intro'
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const totalScore = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const pct = Math.round((totalScore / MAX_SCORE) * 100);
  const grade = getGrade(pct);

  const handleSelect = useCallback((qIndex: number, optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const q = QUESTIONS[qIndex];
    const newAnswers = { ...answers, [q.id]: q.options[optIndex].score };
    setAnswers(newAnswers);
    setTimeout(() => {
      setSelected(null);
      if (qIndex + 1 < QUESTIONS.length) {
        setCurrentQ(qIndex + 1);
      } else {
        const finalScore = Math.round((Object.values(newAnswers).reduce((a, b) => a + b, 0) / MAX_SCORE) * 100);
        const result: HealthCheckupResult = {
          score: finalScore,
          category: getGrade(finalScore).label,
          answers: newAnswers,
          completedAt: new Date().toISOString().split('T')[0],
          recommendations: getRecommendations(newAnswers),
        };
        setHealthCheckup(result);
        setStep('results');
      }
    }, 350);
  }, [selected, answers, setHealthCheckup]);

  const reset = () => {
    setStep('intro');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-white/10 glass-card-premium">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)', boxShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
              <HeartPulse size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Financial Checkup 🩺</h2>
              <p className="text-xs text-ink-muted mt-0.5">Apni financial health ka quick checkup! 2 min me ho jayega</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="text-7xl mb-4"
                >
                  🩺
                </motion.div>
                <h3 className="font-display text-2xl font-extrabold heading-gradient mb-2">
                  Financial Checkup Time!
                </h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto mb-6">
                  {QUESTIONS.length} simple sawaal — honestly jawab do aur apni financial health ka score pao! 😎
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6 max-w-md mx-auto">
                  <div className="rounded-xl bg-emerald/5 border border-emerald/20 p-3">
                    <div className="text-2xl mb-1">💪</div>
                    <p className="text-[10px] font-bold text-emerald-soft">Fit</p>
                  </div>
                  <div className="rounded-xl bg-gold/5 border border-gold/20 p-3">
                    <div className="text-2xl mb-1">🤔</div>
                    <p className="text-[10px] font-bold text-gold-soft">Average</p>
                  </div>
                  <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-3">
                    <div className="text-2xl mb-1">🏥</div>
                    <p className="text-[10px] font-bold text-red-400">ICU</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep('quiz')}
                  className="btn-3d rounded-2xl px-8 py-3.5 font-bold text-midnight inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
                >
                  Shuru Karein <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {/* QUIZ */}
            {step === 'quiz' && (
              <motion.div
                key={`quiz-${currentQ}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <ProgressDots current={currentQ} total={QUESTIONS.length} />
                <div className="text-center mt-6 mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="text-7xl mb-3"
                  >
                    {QUESTIONS[currentQ].heroEmoji}
                  </motion.div>
                  <p className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest mb-1">
                    Sawaal {currentQ + 1} of {QUESTIONS.length}
                  </p>
                  <h3 className="font-display text-xl font-extrabold text-white mb-1">
                    {QUESTIONS[currentQ].question}
                  </h3>
                  <p className="text-xs text-ink-muted">{QUESTIONS[currentQ].subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUESTIONS[currentQ].options.map((opt, i) => {
                    const isSelected = selected === i;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelect(currentQ, i)}
                        className={`relative card-3d rounded-2xl p-4 text-left border transition-all overflow-hidden ${
                          isSelected
                            ? 'border-emerald bg-emerald/15'
                            : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle2 size={18} className="text-emerald-soft" />
                          </motion.div>
                        )}
                        <div className="text-3xl mb-2">{opt.emoji}</div>
                        <p className="text-sm font-bold text-white leading-tight">{opt.text}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* RESULTS */}
            {step === 'results' && healthCheckup && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                  style={{ backgroundColor: `${grade.color}20`, border: `1px solid ${grade.color}40` }}
                >
                  <Sparkles size={14} style={{ color: grade.color }} />
                  <span className="text-xs font-bold" style={{ color: grade.color }}>
                    Tumhara Result Ready Hai!
                  </span>
                </motion.div>

                <HealthMeter score={healthCheckup.score} />

                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: 'spring' }}
                  className="mt-2"
                >
                  <h3 className="font-display text-3xl font-extrabold" style={{ color: grade.color }}>
                    {grade.label} {grade.emoji}
                  </h3>
                  <p className="text-sm text-ink-muted mt-1">{grade.tip}</p>
                </motion.div>

                {/* Recommendations */}
                <div className="text-left mt-6 space-y-2">
                  <p className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={12} className="text-ai" /> Tumhare Liye Tips
                  </p>
                  {healthCheckup.recommendations.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.1 }}
                      className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-sm text-white/90"
                    >
                      {tip}
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-xl py-3 text-sm font-bold text-white bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} /> Phir Se Try Karo
                  </button>
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({
                          title: 'Capital Mastery — Financial Health',
                          text: `Meri Financial Health: ${healthCheckup.score}/100 (${grade.label} ${grade.emoji})! Tum bhi check karo!`,
                        }).catch(() => {});
                      }
                    }}
                    className="flex-1 btn-3d rounded-xl py-3 text-sm font-bold text-midnight flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
                  >
                    <Share2 size={14} /> Share Score
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
