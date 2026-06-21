'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { IndianRupee, Zap, Lock, BookOpen, Clock, ChevronRight, CheckCircle2, ArrowRight, Target, Rocket, TrendingUp } from 'lucide-react';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';

const QUOTES = [
  'Invest your money, secure your future! 🚀',
  'Every rupee is a soldier — deploy it wisely! ⚔️',
  'Understand the magic of compounding and grow wealthy! ✨',
  'Avoiding debt = the first step to financial freedom 🛡️',
  'Save consistently, set up auto-debits! 🐷'
];

const QUICK_TOOLS = [{
  id: 'goals',
  label: 'Goals',
  emoji: '🎯',
  color: '#10B981'
}, {
  id: 'expense',
  label: 'Expenses',
  emoji: '🧾',
  color: '#F59E0B'
}, {
  id: 'quiz',
  label: 'Quiz',
  emoji: '🧠',
  color: '#8B5CF6'
}, {
  id: 'spin',
  label: 'Spin',
  emoji: '🎡',
  color: '#EF4444'
}, {
  id: 'memory',
  label: 'Memory',
  emoji: '🃏',
  color: '#06B6D4'
}, {
  id: 'health',
  label: 'Checkup',
  emoji: '🩺',
  color: '#EC4899'
}];

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1100;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString('en-IN')}</span>;
}

function HealthScoreGauge({ score }) {
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const grade = score >= 75 ? 'Fit 💪' : score >= 50 ? 'Average 🤔' : 'In the ICU 🏥';
  const gradeColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 20 110 A ${radius} ${radius} 0 0 1 180 110`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute top-[50px] flex flex-col items-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="font-display text-4xl font-extrabold text-white leading-none"
          style={{ textShadow: `0 0 24px ${gradeColor}80` }}
        >
          <AnimatedCounter target={score} />
        </motion.span>
      </div>
      <div
        className="-mt-1 px-5 py-2 rounded-full border text-xs font-bold"
        style={{
          backgroundColor: `${gradeColor}12`,
          borderColor: `${gradeColor}25`,
          color: gradeColor
        }}
      >
        {grade}
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, accent, sub, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-white/[0.06]"
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: accent }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-none">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] font-bold mt-1.5" style={{ color: accent }}>
              {sub}
            </p>
          )}
        </div>
        <div className="text-3xl sm:text-4xl" style={{ filter: `drop-shadow(0 0 8px ${accent}80)` }}>
          {emoji}
        </div>
      </div>
      {children && <div className="relative mt-3">{children}</div>}
    </motion.div>
  );
}

function ModuleCard({ mod, index, isUnlocked, onClick }) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const { moduleProgress, completedModules } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.min(100, Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isUnlocked ? {
        y: -6,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px ${mod.color}12`,
        borderColor: `${mod.color}40`
      } : undefined}
      className={`relative group cursor-pointer rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between h-full bg-gradient-to-b ${
        isUnlocked
          ? 'from-zinc-900/90 to-zinc-950/95 border-white/[0.07] hover:border-t-white/15'
          : 'from-zinc-950/40 to-zinc-900/20 border-white/[0.03] grayscale opacity-45'
      } overflow-hidden`}
      onClick={isUnlocked ? onClick : undefined}
    >
      {isUnlocked && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[70px] opacity-15 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500"
            style={{ backgroundColor: mod.color }}
          />
        </div>
      )}
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90">
                <circle cx="50%" cy="50%" r="44%" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.04" />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  fill="none"
                  stroke={mod.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${mod.color}50)` }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progressPercent / 100 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </svg>
            )}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative z-10 ${
                isUnlocked
                  ? 'bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-white/20'
                  : 'bg-white/[0.02] border border-transparent'
              }`}
            >
              {isUnlocked ? mod.emoji : <Lock size={16} className="text-zinc-700" />}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 size={10} className="text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Done</span>
              </div>
            )}
            {isUnlocked && !isCompleted && progressPercent > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider">{progressPercent}%</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 mt-2">
          <span className="text-[9px] font-black tracking-[0.25em] uppercase mb-1.5 block" style={{ color: isUnlocked ? mod.color : '#64748B' }}>
            Module {mod.id}
          </span>
          <h3 className={`font-display font-extrabold text-lg leading-snug mb-2 transition-colors duration-300 ${isUnlocked ? 'text-white group-hover:text-emerald-soft' : 'text-zinc-600'}`}>
            {mod.title}
          </h3>
          <p className={`text-[12px] leading-relaxed line-clamp-3 transition-colors duration-300 ${isUnlocked ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-600'}`}>
            {mod.description}
          </p>
        </div>
        <div className={`mt-5 pt-4 border-t flex items-center justify-between transition-colors duration-300 ${isUnlocked ? 'border-white/[0.06] group-hover:border-white/[0.1]' : 'border-white/[0.02]'}`}>
          <div className="flex items-center gap-3.5 text-[11px] font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <BookOpen size={11} className="text-zinc-500" /> {cardCount} Cards
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <Clock size={11} className="text-zinc-500" /> {cardCount * 2} min
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-white/5 border border-white/10 group-hover:bg-white/10' : ''}`}>
            {isUnlocked ? (
              <ChevronRight size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
            ) : (
              <Lock size={14} className="text-zinc-800" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Goals Section Component ──────────────────────────────────────
function GoalsSection({ router }) {
  const { goals, goalTarget, goalSaved } = useAppStore();
  
  const activeGoals = goals.filter(g => g.saved < g.target).slice(0, 3);
  const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const progress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Target size={18} className="text-emerald-400" /> Your Goals
        </h2>
        <button
          onClick={() => router.push('/home/goals')}
          className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 text-center"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-sm font-bold text-white mb-1">Apna Pehla Goal Set Karo!</h3>
            <p className="text-xs text-zinc-400 mb-4">Financial goals banake AI roadmap se achieve karo</p>
            <button
              onClick={() => router.push('/home/goals')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#070913] text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
            >
              <Rocket size={14} />
              Create Goal
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Overall Progress */}
          {goals.length > 1 && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Total Progress</span>
                <span className="text-xs font-bold text-emerald-400">{progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-zinc-500">₹{totalSaved.toLocaleString('en-IN')} saved</span>
                <span className="text-[10px] text-zinc-500">₹{totalTarget.toLocaleString('en-IN')} target</span>
              </div>
            </div>
          )}

          {/* Active Goals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeGoals.map((goal, i) => {
              const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => router.push('/home/goals')}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${goal.category}20`, border: `1px solid ${goal.category}30` }}
                    >
                      {goal.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{goal.name}</h4>
                      <span className="text-[10px] text-zinc-500">₹{goal.target.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: goal.category }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500">₹{goal.saved.toLocaleString('en-IN')} saved</span>
                      <span className="text-[9px] font-bold" style={{ color: goal.category }}>{pct}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View Roadmap Button */}
          {activeGoals.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/home/goals')}
              className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/15 transition-colors"
            >
              <TrendingUp size={14} />
              View AI Roadmap for Your Goals
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    coins,
    streak,
    completedModules,
    moduleProgress,
    badges,
    xp,
    level
  } = useAppStore();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);


  useEffect(() => {
    const qInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(qInterval);
  }, []);

  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round((completedCards / totalCards) * 100)) : 0;

  const healthScore = Math.min(100, Math.round(
    (completedModules.length / modules.length) * 45 +
    (overallProgress / 100) * 30 +
    (coins / 1000) * 15 +
    (streak / 30) * 10
  ));

  const openToolDialog = (toolId) => {
    router.push(`/home/dashboard?tool=${toolId}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left">
      {/* Ticker marquee */}
      <div className="w-full bg-emerald-500/5 border border-emerald-500/10 py-2.5 overflow-hidden whitespace-nowrap rounded-2xl mb-4">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 items-center"
        >
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <span key={i} className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Zap size={11} fill="currentColor" /> {q}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Greeting Panel */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 glass-card-premium p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              Welcome Back 👋
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-2">
              How are you, {user?.displayName?.split(' ')[0] ?? 'Champion'}! 🔥
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuoteIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm text-zinc-400 font-medium"
              >
                "{QUOTES[currentQuoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="glass-card rounded-2xl p-4 flex-shrink-0">
            <HealthScoreGauge score={healthScore} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          delay={0.05}
          emoji={
            <div className="coin-spin-3d w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_4px_10px_rgba(245,158,11,0.4)] border border-amber-400/30">
              <IndianRupee size={20} className="text-white font-extrabold" />
            </div>
          }
          label="Total Coins"
          value={<AnimatedCounter target={coins} />}
          accent="#F59E0B"
          sub={coins >= 500 ? 'Big saver energy 💰' : 'Keep earning! 🚀'}
        />
        <StatCard
          delay={0.12}
          emoji={<span>🔥</span>}
          label="Streak"
          value={`${streak} days`}
          accent="#EF4444"
          sub={streak > 0 ? 'Keep the streak going! 💪' : 'Start today!'}
        />
        <StatCard
          delay={0.19}
          emoji={<span>📚</span>}
          label="Modules"
          value={`${completedModules.length}/${modules.length}`}
          accent="#10B981"
          sub={`${overallProgress}% overall`}
        />
        <StatCard
          delay={0.26}
          emoji={<span>🏆</span>}
          label="Badges"
          value={badges.length}
          accent="#8B5CF6"
          sub={badges.length > 0 ? 'Keep filling your trophy case! ⭐' : 'Earn your first badge!'}
        />
      </div>

      {/* Continue Learning Spot */}
      {(() => {
        const activeModuleIndex = modules.findIndex(m => !completedModules.includes(m.id));
        const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
        const activeCardCount = activeModule ? getAllCardsForModule(activeModule.id).length : 0;
        const activeProgress = activeModule ? Math.min(100, Math.round(((moduleProgress[activeModule.id] || 0) / Math.max(activeCardCount - 1, 1)) * 100)) : 0;

        if (!activeModule) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/20 glass-card-glow p-5 sm:p-6"
          >
            <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: activeModule.color }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
                style={{
                  backgroundColor: `${activeModule.color}25`,
                  border: `1px solid ${activeModule.color}40`
                }}
              >
                {activeModule.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                  Continue Learning
                </p>
                <h3 className="font-display text-lg font-bold text-white mb-1 truncate">
                  {activeModule.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden max-w-xs">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeProgress}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${activeModule.color}, #34D399)` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">{activeProgress}%</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/dashboard/module/${activeModule.id}`)}
                className="btn-3d rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap flex items-center gap-2 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
              >
                Keep Going <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        );
      })()}

      {/* Quick Access Tools */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Zap size={18} className="text-amber-400" /> Quick Access
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {QUICK_TOOLS.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.04 }}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (['goals', 'expense', 'savings', 'quiz', 'spin'].includes(tool.id)) {
                  openToolDialog(tool.id);
                } else {
                  router.push('/home/tools');
                }
              }}
              className="card-3d glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 group cursor-pointer border border-white/[0.06] w-full"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${tool.color}20`,
                  border: `1px solid ${tool.color}30`
                }}
              >
                {tool.emoji}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white">
                {tool.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Your Goals Section */}
      <GoalsSection router={router} />


      {/* Financial Journey Map */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Financial Journey Map 🗺️
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Learn step-by-step personal finance. Complete each module and unlock the next level! 🚀
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
              {completedModules.length} of {modules.length} Completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => {
            const isUnlocked = i === 0 || completedModules.includes(modules[i - 1]?.id);
            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                index={i}
                isUnlocked={isUnlocked}
                onClick={() => router.push(`/dashboard/module/${mod.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
