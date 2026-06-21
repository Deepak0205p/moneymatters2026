'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse, CheckCircle2, ArrowRight, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

const QUESTIONS = [
  {
    id: 'emergency',
    question: 'Emergency fund kitna hai?',
    subtitle: '3-6 mahine ka kharcha cover karta hai?',
    heroEmoji: '🛡️',
    options: [
      { text: 'Koi fund nahi', score: 0, emoji: '😰' },
      { text: '1 mahine ka hai', score: 4, emoji: '😐' },
      { text: '3 mahine ka hai', score: 8, emoji: '😊' },
      { text: '6+ mahine ka hai', score: 12, emoji: '🤩' }
    ]
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
      { text: 'Detail me track karta hu', score: 12, emoji: '📊' }
    ]
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
      { text: '20% se zyada!', score: 12, emoji: '🚀' }
    ]
  },
  {
    id: 'debt',
    question: 'Credit card ka bill pay kaise karte ho?',
    subtitle: 'Pura bill pay karte ho ya minimum?',
    heroEmoji: '💳',
    options: [
      { text: 'Minimum pay karta hu', score: 0, emoji: '😱' },
      { text: 'Kabhi full, kabhi partial', score: 4, emoji: '😬' },
      { text: 'Hamesha full pay karta hu', score: 12, emoji: '💪' },
      { text: 'Credit card use nahi karta', score: 8, emoji: '🚫' }
    ]
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
      { text: 'Stocks + MF + PPF — mixed!', score: 10, emoji: '🌟' }
    ]
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
      { text: 'Health + Life dono hai', score: 12, emoji: '✅' }
    ]
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
      { text: 'Padhta + apply karta hu', score: 12, emoji: '🎓' }
    ]
  }
];

const MAX_SCORE = QUESTIONS.length * 12;

function getGrade(pct) {
  if (pct >= 75) return { label: 'Fit', emoji: '💪', color: '#10B981', tip: 'Tum financial ninja ho! Keep it up!' };
  if (pct >= 50) return { label: 'Average', emoji: '🤔', color: '#F59E0B', tip: 'Theek ho, par sudhar zaroori hai!' };
  return { label: 'ICU mein hai', emoji: '🏥', color: '#EF4444', tip: 'Tension mat lo, abhi shuru karo!' };
}

function getRecommendations(answers) {
  const tips = [];
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

function ProgressDots({ current, total }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: i < current ? '100%' : i === current ? '100%' : '0%' }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
          />
        </div>
      ))}
    </div>
  );
}

function HealthMeter({ score }) {
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
        </defs>

        <path
          d={`M 30 130 A ${radius} ${radius} 0 0 1 210 130`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {[0, 25, 50, 75, 100].map(t => {
          const angle = Math.PI - (t / 100) * Math.PI;
          const x = 120 + Math.cos(angle) * (radius + 16);
          const y = 130 - Math.sin(angle) * (radius + 16);
          return (
            <text
              key={t}
              x={x}
              y={y}
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              fontWeight="black"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {t}
            </text>
          );
        })}

        <motion.path
          d={`M 30 130 A ${radius} ${radius} 0 0 1 210 130`}
          fill="none"
          stroke="url(#meterGrad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        />

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

      <div className="absolute top-[90px] flex flex-col items-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="font-display text-5xl font-black"
          style={{
            color: grade.color,
            textShadow: `0 0 25px ${grade.color}50`
          }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">/ 100 SCORE</span>
      </div>
    </div>
  );
}

export default function HealthCheckup({ open, onClose }) {
  const {
    healthCheckup,
    setHealthCheckup
  } = useAppStore();

  const [step, setStep] = useState(healthCheckup ? 'results' : 'intro'); // 'intro', 'quiz', 'results'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  }, [answers]);

  const pctScore = Math.round((totalScore / MAX_SCORE) * 100);
  const grade = getGrade(pctScore);

  const handleSelect = useCallback((qIndex, optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);
    
    const q = QUESTIONS[qIndex];
    const newAnswers = {
      ...answers,
      [q.id]: q.options[optIndex].score
    };
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelected(null);
      if (qIndex + 1 < QUESTIONS.length) {
        setCurrentQ(qIndex + 1);
      } else {
        const finalScore = Math.round((Object.values(newAnswers).reduce((a, b) => a + b, 0) / MAX_SCORE) * 100);
        const result = {
          score: finalScore,
          category: getGrade(finalScore).label,
          answers: newAnswers,
          completedAt: new Date().toISOString().split('T')[0],
          recommendations: getRecommendations(newAnswers)
        };
        try {
          if (typeof setHealthCheckup === 'function') {
            setHealthCheckup(result);
          }
        } catch (e) {
          console.error(e);
        }
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

  const finalCheckupReport = healthCheckup || { score: pctScore, recommendations: getRecommendations(answers) };
  const finalGrade = getGrade(finalCheckupReport.score);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-pink-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <HeartPulse size={20} className="text-pink-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Paisa Doctor 🏥</h2>
              <p className="text-[10px] text-zinc-400">Scan and diagnose your financial wellness status</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-6 space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-6xl block">🏥</span>
                  <h3 className="text-xl font-black text-white">Diagnose Your Money Health!</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    7 simple hinge-language questions ke details complete karein aur dynamic fitness score checks aur AI suggestions haasil karein!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto py-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                    <span className="text-2xl block">💪</span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase block mt-1">FIT</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
                    <span className="text-2xl block">🤔</span>
                    <span className="text-[9px] font-black text-amber-400 uppercase block mt-1">AVERAGE</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                    <span className="text-2xl block">🚑</span>
                    <span className="text-[9px] font-black text-red-400 uppercase block mt-1">ICU</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('quiz')}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  Start Checkup <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === 'quiz' && (
              <motion.div
                key={`quiz-${currentQ}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <ProgressDots current={currentQ} total={QUESTIONS.length} />

                <div className="text-center py-4 space-y-3">
                  <span className="text-6xl block animate-bounce">{QUESTIONS[currentQ].heroEmoji}</span>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                      QUESTION {currentQ + 1} OF {QUESTIONS.length}
                    </span>
                    <h3 className="text-base font-black text-white">{QUESTIONS[currentQ].question}</h3>
                    <p className="text-xs text-zinc-400 italic">"{QUESTIONS[currentQ].subtitle}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {QUESTIONS[currentQ].options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(currentQ, idx)}
                        className={`p-4 rounded-3xl text-left border-2 flex flex-col justify-between h-28 relative overflow-hidden transition-all focus:outline-none cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : 'bg-[#0B0E19] border-white/[0.04] text-white hover:border-indigo-500/30'
                        }`}
                      >
                        <span className="text-3xl block">{opt.emoji}</span>
                        <span className="text-xs font-black uppercase tracking-wide truncate">{opt.text}</span>
                        
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'results' && finalCheckupReport && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] shadow-md">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">Diagnostic Report Generated</span>
                </div>

                <HealthMeter score={finalCheckupReport.score} />

                <div className="space-y-1">
                  <h3 className="text-2xl font-black" style={{ color: finalGrade.color }}>
                    {finalGrade.label} {finalGrade.emoji}
                  </h3>
                  <p className="text-xs text-zinc-400 font-semibold">{finalGrade.tip}</p>
                </div>

                <div className="text-left space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <HeartPulse size={14} className="text-pink-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Doctor's Recommendations</h4>
                  </div>

                  <div className="space-y-2.5">
                    {finalCheckupReport.recommendations?.map((tip, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs font-semibold text-zinc-300 leading-normal"
                      >
                        {tip}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={reset}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl border border-white/10 hover:bg-white/5 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <RotateCcw size={14} /> Redo Checkup
                  </button>
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({
                          title: 'Paisa Doctor Report Card',
                          text: `Meri Financial Wellness Health Score: ${finalCheckupReport.score}/100 (${finalGrade.label} ${finalGrade.emoji})! Tum bhi quick checkup karo!`
                        }).catch(() => {});
                      }
                    }}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg focus:outline-none"
                  >
                    <Share2 size={14} /> Share Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Paisa Doctor — report results are strictly for learning and guidance purposes
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { HealthCheckup };