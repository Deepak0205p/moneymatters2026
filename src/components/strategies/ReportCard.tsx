'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Share2, GraduationCap, Star, Award, TrendingUp, Lightbulb } from 'lucide-react';

type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

const gradeMeta: Record<Grade, { color: string; bg: string; pct: string }> = {
  'A+': { color: '#10B981', bg: 'bg-emerald-500/15 border-emerald-500/40', pct: '90-100%' },
  A: { color: '#34D399', bg: 'bg-green-500/15 border-green-500/40', pct: '80-89%' },
  B: { color: '#FACC15', bg: 'bg-yellow-500/15 border-yellow-500/40', pct: '70-79%' },
  C: { color: '#FB923C', bg: 'bg-orange-500/15 border-orange-500/40', pct: '60-69%' },
  D: { color: '#F87171', bg: 'bg-red-500/15 border-red-500/40', pct: '50-59%' },
  F: { color: '#EF4444', bg: 'bg-red-600/20 border-red-600/50', pct: '<50%' },
};

function scoreToGrade(s: number): Grade {
  if (s >= 90) return 'A+';
  if (s >= 80) return 'A';
  if (s >= 70) return 'B';
  if (s >= 60) return 'C';
  if (s >= 50) return 'D';
  return 'F';
}

export default function ReportCard() {
  const { userName, completedModules, moduleProgress, quizScores, streak, coins, addCoins } = useAppStore();
  const [stampShown, setStampShown] = useState(false);
  const [shared, setShared] = useState(false);

  const student = userName?.trim() || 'Student';

  // Subject scoring (0-100)
  const subjects = useMemo(() => {
    const modulesDone = completedModules.length;
    const modProgressAvg =
      Object.keys(moduleProgress).length > 0
        ? Object.values(moduleProgress).reduce((a, b) => a + b, 0) / Object.keys(moduleProgress).length
        : 0;
    const quizAvg =
      Object.keys(quizScores).length > 0
        ? Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length
        : 0;

    const saving = Math.min(100, (modulesDone / 11) * 100);
    const budget = Math.round(quizAvg);
    const debt = Math.min(100, Math.round(modProgressAvg));
    const investment = Math.min(100, Math.round((coins / 500) * 100));
    const discipline = Math.min(100, streak * 10);

    return [
      { name: 'Saving Habits', emoji: '🐷', score: Math.round(saving), tip: 'Modules complete karo — har module ₹50 deta hai!' },
      { name: 'Budget Planning', emoji: '📊', score: budget, tip: 'Quiz attempts karo, score improve hoga.' },
      { name: 'Debt Awareness', emoji: '💀', score: debt, tip: 'Debt modules ko 100% complete karo.' },
      { name: 'Investment Knowledge', emoji: '📈', score: investment, tip: 'Coins kamao — activities complete karke.' },
      { name: 'Financial Discipline', emoji: '🔥', score: discipline, tip: 'Daily login — streak badhao!' },
    ];
  }, [completedModules, moduleProgress, quizScores, coins, streak]);

  const avgScore = Math.round(subjects.reduce((a, s) => a + s.score, 0) / subjects.length);
  const avgGrade = scoreToGrade(avgScore);

  const stamp = avgScore >= 75 ? 'DISTINCTION' : avgScore >= 50 ? 'PASS' : 'NEEDS WORK';

  const remark = useMemo(() => {
    if (avgScore >= 90) return '🌟 Outstanding! Tum true Financial Vidhyarthi ho. Aise hi chalte raho!';
    if (avgScore >= 75) return '👏 Bahut achha! Thoda aur practice aur tum top pe ho.';
    if (avgScore >= 60) return '👍 Theek chal raha hai. Modules aur quizzes par dhyaan do.';
    if (avgScore >= 50) return '💪 Mehnat kar rahe ho. Daily streak maintain karo, farak dikhega!';
    return '📚 Abhi shuruwat hai. Ek-ek module complete karo, score khud badhega!';
  }, [avgScore]);

  const lowScorers = subjects.filter((s) => s.score < 60);

  // Trigger stamp animation on mount
  useEffect(() => {
    const t = setTimeout(() => setStampShown(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleShare = () => {
    setShared(true);
    addCoins(5);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-5">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-emerald">
          Financial Health Report Card 📜
        </h2>
        <p className="text-zinc-400 mt-1 text-sm">Tumhari financial journey ka school report card</p>
      </div>

      {/* REPORT CARD BODY */}
      <div
        className="relative glass-card rounded-2xl p-6 md:p-8"
        style={{ border: '2px solid rgba(245,158,11,0.25)' }}
      >
        {/* Decorative corners */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((p) => (
          <div key={p} className={`absolute ${p} w-6 h-6 border-amber-500/40`} style={{
            borderTop: p.includes('top') ? '2px solid' : 'none',
            borderBottom: p.includes('bottom') ? '2px solid' : 'none',
            borderLeft: p.includes('left') ? '2px solid' : 'none',
            borderRight: p.includes('right') ? '2px solid' : 'none',
            borderRadius: p.includes('left') && p.includes('top') ? '8px 0 0 0' :
                          p.includes('right') && p.includes('top') ? '0 8px 0 0' :
                          p.includes('left') && p.includes('bottom') ? '0 0 0 8px' :
                          '0 0 8px 0',
          }} />
        ))}

        {/* SCHOOL HEADER */}
        <div className="text-center border-b-2 border-amber-500/30 pb-4 mb-5 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/40 mb-2">
            <GraduationCap className="w-9 h-9 text-amber-400" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-gradient-gold">
            RUPAIYA 101
          </h3>
          <p className="text-sm text-zinc-300 tracking-wide">Financial Vidyalaya</p>
          <p className="text-xs text-zinc-500 italic mt-1">"Padho, Bachao, Badho" — Est. 2024</p>

          {/* STAMP */}
          <AnimatePresence>
            {stampShown && (
              <motion.div
                initial={{ scale: 3, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="absolute top-0 right-0 md:top-2 md:right-2 px-4 py-2 rounded-lg border-4"
                style={{
                  borderColor: stamp === 'DISTINCTION' ? '#10B981' : stamp === 'PASS' ? '#F59E0B' : '#EF4444',
                  color: stamp === 'DISTINCTION' ? '#10B981' : stamp === 'PASS' ? '#F59E0B' : '#EF4444',
                  background: 'rgba(0,0,0,0.3)',
                  textShadow: '0 0 8px currentColor',
                }}
              >
                <p className="font-display font-black text-lg md:text-xl tracking-wider">{stamp}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STUDENT INFO */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
          <div className="glass rounded-lg p-2.5">
            <span className="text-zinc-500 text-xs">Student Name:</span>
            <p className="text-white font-semibold">{student}</p>
          </div>
          <div className="glass rounded-lg p-2.5">
            <span className="text-zinc-500 text-xs">Academic Year:</span>
            <p className="text-white font-semibold">2024-25</p>
          </div>
          <div className="glass rounded-lg p-2.5">
            <span className="text-zinc-500 text-xs">Coins Earned:</span>
            <p className="text-amber-400 font-semibold">{coins} 🪙</p>
          </div>
          <div className="glass rounded-lg p-2.5">
            <span className="text-zinc-500 text-xs">Streak:</span>
            <p className="text-emerald-400 font-semibold">{streak} days 🔥</p>
          </div>
        </div>

        {/* SUBJECTS TABLE */}
        <div className="rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-500/15 text-amber-300">
                <th className="text-left p-2.5 font-display font-semibold">Subject</th>
                <th className="text-center p-2.5 font-display font-semibold">Score</th>
                <th className="text-center p-2.5 font-display font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => {
                const g = scoreToGrade(s.score);
                const meta = gradeMeta[g];
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-t border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{s.emoji}</span>
                        <span className="text-white font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center text-zinc-300">{s.score}/100</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border font-display font-bold ${meta.bg}`} style={{ color: meta.color }}>
                        {g}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-amber-500/30 bg-amber-500/5">
                <td className="p-2.5 font-display font-bold text-amber-300">Overall Average</td>
                <td className="p-2.5 text-center font-bold text-white">{avgScore}/100</td>
                <td className="p-2.5 text-center">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border font-display font-bold text-lg" style={{ color: gradeMeta[avgGrade].color, borderColor: `${gradeMeta[avgGrade].color}40`, background: `${gradeMeta[avgGrade].color}15` }}>
                    {avgGrade}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Grade scale legend */}
        <div className="flex flex-wrap gap-1.5 mt-3 text-[10px]">
          {(Object.keys(gradeMeta) as Grade[]).map((g) => (
            <span key={g} className="px-2 py-0.5 rounded border" style={{ color: gradeMeta[g].color, borderColor: `${gradeMeta[g].color}40` }}>
              {g} = {gradeMeta[g].pct}
            </span>
          ))}
        </div>

        {/* PRINCIPAL'S REMARK */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <p className="text-xs uppercase tracking-wide text-amber-400 font-semibold">Principal's Remark</p>
          </div>
          <p className="text-sm text-white italic">"{remark}"</p>
          <p className="text-xs text-zinc-400 mt-2 text-right">— Principal, RUPAIYA 101</p>
        </div>

        {/* IMPROVEMENT TIPS */}
        {lowScorers.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold">Improvement Tips</p>
            </div>
            <div className="space-y-1.5">
              {lowScorers.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-xs text-zinc-300 flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]"
                >
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <span className="font-semibold text-white">{s.name}:</span> {s.tip}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENT BANNER */}
        {stamp === 'DISTINCTION' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center"
          >
            <Award className="w-6 h-6 text-emerald-400 inline-block mb-1" />
            <p className="text-sm text-emerald-300 font-semibold">
              🎉 Distinction Holder! Tum top 10% students mein ho!
            </p>
          </motion.div>
        )}
      </div>

      {/* SHARE BUTTON */}
      <div className="text-center mt-5">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleShare}
          className="btn-emerald inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm"
        >
          <Share2 className="w-4 h-4" />
          {shared ? 'Copied!' : 'Share Report Card'}
        </motion.button>
        <p className="text-[11px] text-zinc-500 mt-2">
          Share karne par +5 coins milte hain 🪙
        </p>
      </div>
    </div>
  );
}
