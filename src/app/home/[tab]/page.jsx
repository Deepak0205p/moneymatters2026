"use client";

import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { IndianRupee } from 'lucide-react';

// Lucide Icons
import {
  LayoutDashboard,
  Film,
  MessageSquare,
  Wrench,
  User,
  LogOut,
  Moon,
  Sun,
  Coins,
  Trophy,
  Flame,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Send,
  MoreHorizontal,
  ChevronLeft,
  X,
  Menu,

  UserCheck,
  Shield,
  Calendar,
  HeartPulse,
  Receipt,
  PiggyBank,
  CircleDot,
  Brain,
  Globe,
  PlusSquare,
  Plus,
  Compass,
  Filter,
  ArrowDownUp
} from 'lucide-react';

import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import { getStrategyBySlug } from '@/lib/data/strategyRegistry';
import { strategies } from '@/lib/data/strategies';
import { BADGES, PROFILE_AVATARS, getLevelInfo, getLevelProgress, ACTIVITY_EMOJI } from '@/lib/data/badges';

// Lazy load dialogs/widgets
const LazyGoalTracker = lazy(() => import('@/components/shared/GoalTracker'));
const LazyExpenseTracker = lazy(() => import('@/components/shared/ExpenseTracker'));
const LazySavingsChallenge = lazy(() => import('@/components/shared/SavingsChallenge'));
const LazyQuizArena = lazy(() => import('@/components/shared/QuizArena'));
const LazySpinWheel = lazy(() => import('@/components/shared/SpinWheel'));
const LazyMemoryMatch = lazy(() => import('@/components/shared/MemoryMatch'));
const LazyWordScramble = lazy(() => import('@/components/shared/WordScramble'));
const LazyFinancialNewsWidget = lazy(() => import('@/components/shared/FinancialNewsWidget'));
const LazyPriorityCalculator = lazy(() => import('@/components/shared/PriorityCalculator'));
const LazyInvestmentComparison = lazy(() => import('@/components/shared/InvestmentComparison'));
const LazyEmergencyFundCalculator = lazy(() => import('@/components/shared/EmergencyFundCalculator'));
const LazyHabitTracker = lazy(() => import('@/components/shared/HabitTracker'));
const LazyFinancialAgeCalculator = lazy(() => import('@/components/shared/FinancialAgeCalculator'));
const LazySIPCalculator = lazy(() => import('@/components/shared/SIPCalculator'));
const LazyBadgeGallery = lazy(() => import('@/components/shared/BadgeGallery'));
const LazyAchievementDashboard = lazy(() => import('@/components/shared/AchievementDashboard'));
const LazyShareProgress = lazy(() => import('@/components/shared/ShareProgress'));
const LazyHealthCheckup = lazy(() => import('@/components/shared/HealthCheckup'));

// ── Lazy-loaded strategy components for Strategy Viewer ──
const StrategyComponents = {
  "paise-ka-gps": lazy(() => import("@/components/strategies/PaiseKaGPS")),
  "budget-khel": lazy(() => import("@/components/strategies/BudgetKhel")),
  "ghar-ka-budget": lazy(() => import("@/components/strategies/GharKaBudget")),
  "mistake-market": lazy(() => import("@/components/strategies/MistakeMarket")),
  "kya-hota-agar": lazy(() => import("@/components/strategies/KyaHotaAgar")),
  "chhupa-hua-chor": lazy(() => import("@/components/strategies/ChhupaHuaChor")),
  "compounding-tree": lazy(() => import("@/components/strategies/CompoundingTree")),
  "debt-trap-darwaza": lazy(() => import("@/components/strategies/DebtTrapDarwaza"))
};

const QUOTES = [
  'Paisa invest karo, future secure karo! 🚀',
  'Har rupee ek soldier hai — use wisely! ⚔️',
  'Compounding ka jadoo samjho, aur ameer bano! ✨',
  'Debt se bachna = financial freedom ka pehla step 🛡️',
  'Bachat karo, auto-debit shuru karo! 🐷'
];

const QUICK_QUESTIONS = [
  'SIP kaise shuru karein? 📈',
  'Emergency fund kitna hona chahiye? 🛡️',
  'Credit card trap se kaise bachein? 💳',
  'Needs aur Wants mein kya difference hai? 🧾',
  'Inflation hamare paise ko kaise khata hai? 🥷'
];

// Helper level calculation
function getLevelLabel(lvl) {
  if (lvl >= 10) return { label: 'Grand Master 👑', color: '#F59E0B' };
  if (lvl >= 7) return { label: 'Expert Advisor 🎓', color: '#8B5CF6' };
  if (lvl >= 4) return { label: 'Smart Investor 💼', color: '#10B981' };
  return { label: 'Rookie Learner 🌱', color: '#94A3B8' };
}

// ════════════════════════════════════════════════════════════════════════════
// OLD STYLE DASHBOARD COMPONENT PORTING
// ════════════════════════════════════════════════════════════════════════════
const QUICK_TOOLS = [{
  id: 'goals',
  label: 'Goals',
  emoji: '🎯',
  color: '#10B981'
}, {
  id: 'expense',
  label: 'Kharcha',
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

function AnimatedCounter({
  target
}) {
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

function FinanceTicker() {
  const messages = ['Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨', 'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️', 'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳', "Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉", 'Wealth is what you don\'t see. Ameer mat dikho, ameer bano! 🕵️'];
  return (
    <div className="w-full bg-emerald/10 border-y border-emerald/20 py-2 overflow-hidden whitespace-nowrap relative">
      <motion.div
        animate={{
          x: [0, -2000]
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="flex gap-12 items-center"
      >
        {[...messages, ...messages].map((msg, i) => (
          <span
            key={i}
            className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2"
          >
            <Zap size={12} fill="currentColor" /> {msg}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#090D1A] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#090D1A] to-transparent z-10" />
    </div>
  );
}

function HealthScoreGauge({
  score
}) {
  const radius = 70;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - score / 100 * circumference;
  const grade = score >= 75 ? 'Fit 💪' : score >= 50 ? 'Average 🤔' : 'In the ICU 🏥';
  const gradeColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id="gaugeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
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
          initial={{
            strokeDashoffset: circumference
          }}
          animate={{
            strokeDashoffset: offset
          }}
          transition={{
            duration: 1.4,
            ease: 'easeOut'
          }}
        />
        {[0, 25, 50, 75, 100].map(t => {
          const angle = Math.PI - t / 100 * Math.PI;
          let x1, y1, x2, y2;
          if (t === 0) {
            x1 = 100 - radius - 5;
            y1 = 110;
            x2 = 100 - radius + 5;
            y2 = 110;
          } else if (t === 100) {
            x1 = 100 + radius - 5;
            y1 = 110;
            x2 = 100 + radius + 5;
            y2 = 110;
          } else {
            x1 = 100 + Math.cos(angle) * (radius - 5);
            y1 = 110 - Math.sin(angle) * (radius - 5);
            x2 = 100 + Math.cos(angle) * (radius + 5);
            y2 = 110 - Math.sin(angle) * (radius + 5);
          }
          return (
            <line
              key={t}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="absolute top-[50px] flex flex-col items-center">
        <motion.span
          initial={{
            scale: 0.5,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            delay: 0.6,
            type: 'spring'
          }}
          className="font-display text-4xl font-extrabold text-white leading-none"
          style={{
            textShadow: `0 0 24px ${gradeColor}80`
          }}
        >
          {score}
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

function StatCard({
  emoji,
  label,
  value,
  accent,
  sub,
  children,
  delay
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay,
        duration: 0.5
      }}
      whileHover={{
        y: -4
      }}
      className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border border-white/[0.06]"
    >
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-60"
        style={{
          backgroundColor: accent
        }}
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
            <p
              className="text-[10px] font-bold mt-1.5"
              style={{
                color: accent
              }}
            >
              {sub}
            </p>
          )}
        </div>
        <div
          className="text-3xl sm:text-4xl"
          style={{
            filter: `drop-shadow(0 0 8px ${accent}80)`
          }}
        >
          {emoji}
        </div>
      </div>
      {children && (
        <div className="relative mt-3">
          {children}
        </div>
      )}
    </motion.div>
  );
}

function MiniRing({
  percent,
  color
}) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      className="-rotate-90"
    >
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
      />
      <motion.circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{
          strokeDashoffset: c
        }}
        animate={{
          strokeDashoffset: c - percent / 100 * c
        }}
        transition={{
          duration: 1,
          delay: 0.5
        }}
      />
    </svg>
  );
}

function ModuleCard({
  mod,
  index,
  isUnlocked,
  isActive,
  onClick
}) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const {
    moduleProgress,
    completedModules
  } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.floor((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1) * 100);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
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
            style={{
              backgroundColor: mod.color
            }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-36 h-36 rounded-full blur-[70px] opacity-5 group-hover:opacity-20 transition-all duration-500"
            style={{
              backgroundColor: mod.color
            }}
          />
        </div>
      )}
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeOpacity="0.04"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  fill="none"
                  stroke={mod.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 4px ${mod.color}50)`
                  }}
                  initial={{
                    pathLength: 0
                  }}
                  animate={{
                    pathLength: progressPercent / 100
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.2
                  }}
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
            {!isUnlocked && (
              <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                <Lock size={10} className="text-zinc-500" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Locked</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 mt-2">
          <span
            className="text-[9px] font-black tracking-[0.25em] uppercase mb-1.5 block"
            style={{
              color: isUnlocked ? mod.color : '#64748B'
            }}
          >
            Module {mod.id}
          </span>
          <h3
            className={`font-display font-extrabold text-lg leading-snug mb-2 transition-colors duration-300 ${
              isUnlocked ? 'text-white group-hover:text-emerald-soft' : 'text-zinc-600'
            }`}
          >
            {mod.title}
          </h3>
          <p
            className={`text-[12px] leading-relaxed line-clamp-3 transition-colors duration-300 ${
              isUnlocked ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-600'
            }`}
          >
            {mod.description}
          </p>
        </div>
        <div
          className={`mt-5 pt-4 border-t flex items-center justify-between transition-colors duration-300 ${
            isUnlocked ? 'border-white/[0.06] group-hover:border-white/[0.1]' : 'border-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-3.5 text-[11px] font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <BookOpen size={11} className="text-zinc-500" /> {cardCount} Cards
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <Clock size={11} className="text-zinc-500" /> {cardCount * 2} min
            </span>
          </div>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isUnlocked ? 'bg-white/5 border border-white/10 group-hover:bg-white/10' : ''
            }`}
          >
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

function buildActivityFeed(state) {
  const items = [];

  // Module completions
  Object.entries(state.moduleCompletionDates || {}).forEach(([modId, date]) => {
    const mod = modules.find(m => m.id === Number(modId));
    if (mod) items.push({
      id: `mod-${modId}`,
      icon: mod.emoji,
      text: `Module ${modId} complete kiya — "${mod.title}"`,
      time: date,
      color: mod.color
    });
  });
  if (state.healthCheckup?.completedAt) {
    items.push({
      id: 'health',
      icon: '🩺',
      text: `Financial checkup kiya — Score: ${state.healthCheckup.score}/100`,
      time: state.healthCheckup.completedAt,
      color: '#EC4899'
    });
  }
  state.goals.slice(-2).reverse().forEach(g => {
    items.push({
      id: `goal-${g.id}`,
      icon: g.emoji,
      text: `Naya goal set kiya — "${g.name}"`,
      time: g.createdAt,
      color: '#10B981'
    });
  });
  if (state.totalSpins > 0) {
    items.push({
      id: 'spin',
      icon: '🎡',
      text: `${state.totalSpins} baar spin kiya, ${state.spinWinnings} coins jeete`,
      time: new Date().toISOString().split('T')[0],
      color: '#F59E0B'
    });
  }
  if (state.savingsChallenge?.isActive) {
    items.push({
      id: 'savings-challenge',
      icon: '🔥',
      text: `Bachat challenge Day ${state.savingsChallenge.days.filter(d => d.saved).length}/${state.savingsChallenge.days.length} pe chal raha hai`,
      time: state.savingsChallenge.startDate,
      color: '#EF4444'
    });
  }
  return items.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
}

function RecentActivity() {
  const state = useAppStore();
  const items = useMemo(() => buildActivityFeed(state), [state]);
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2 opacity-40">📬</div>
        <p className="text-sm text-zinc-500">Abhi koi activity nahi. Tools try karo aur yahan dikhao! 🚀</p>
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 hover:bg-white/[0.06] transition-colors"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              backgroundColor: `${item.color}20`,
              border: `1px solid ${item.color}30`
            }}
          >
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{item.text}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{item.time}</p>
          </div>
          <ChevronRight size={14} className="text-zinc-500 flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const hydrated = useHydration();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Zustand Store variables
  const {
    user,
    isAuthenticated,
    coins,
    streak,
    completedModules,
    moduleProgress,
    badges,
    earnedBadges,
    xp,
    level,
    activityLog,
    quizScores,
    masteredTerms,
    financialAge,
    savingsChallenge,
    setUser,
    addCoins,
    addXP,
    logActivity
  } = useAppStore();

  // App Layout State
  const params = useParams();
  const activeTab = params?.tab || 'dashboard';
  const setActiveTab = (tab) => {
    router.push(`/home/${tab}`);
  };
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Tools dialog and strategy state
  const [openTool, setOpenTool] = useState(null);
  const [activeStrategySlug, setActiveStrategySlug] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Reels State (Populated from backend data with default YouTube Shorts)
  const [reels, setReels] = useState([
    {
      id: 1,
      title: "SIP Ka Jadoo! 🪄",
      videoId: "t9uC2BvYcDs",
      description: "Dekho compounding kaise ₹1,000 ko ₹10 Lakhs bana sakti hai!",
      views: "1.2M",
      likes: 124000,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        { id: 1, user: "Amit", text: "Bhai sach mein! SIP shuru krna best decision tha. 🔥" },
        { id: 2, user: "Priya", text: "Mere ₹500/month compounding se ₹3 Lakhs ban gaye!" }
      ]
    },
    {
      id: 2,
      title: "Inflation: The Silent Thief 🥷",
      videoId: "HDUqfVqL00M",
      description: "Locker mein rakha cash har saal apni value kho raha hai! Invest karo.",
      views: "840K",
      likes: 76000,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        { id: 1, user: "Rohan", text: "Inflation real chor hai, hum save krte reh gaye." }
      ]
    },
    {
      id: 3,
      title: "Emergency Fund: 3-6-9 Rule 🛡️",
      videoId: "n7d0lC8P38c",
      description: "Apni job stability ke hisab se emergency fund maintain karo.",
      views: "950K",
      likes: 92000,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        { id: 1, user: "Sneha", text: "CS student ke liye 3 mahina check check!" }
      ]
    },
    {
      id: 4,
      title: "Credit Card Debt Trap 💳",
      videoId: "zN9W1_P_X20",
      description: "Minimum Due pay krna trap hai! Hamesha FULL pay karo.",
      views: "1.1M",
      likes: 115000,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        { id: 1, user: "Karan", text: "Maine 3 saal debt trap mein guzaare, minimum due = disaster." }
      ]
    },
    {
      id: 5,
      title: "Active vs Passive Income 💸",
      videoId: "wJ0Q_Q5q7t8",
      description: "Time bech kar kamana vs paise se paisa banana.",
      views: "640K",
      likes: 45200,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        { id: 1, user: "Divya", text: "SIP is passive income magic! ✨" }
      ]
    }
  ]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Fetch YouTube Reel state
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [isFetchingYt, setIsFetchingYt] = useState(false);
  const [ytError, setYtError] = useState(null);

  // History state
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySort, setHistorySort] = useState('newest');

  const filteredAndGroupedHistory = useMemo(() => {
    const filtered = activityLog.filter(act => 
      (historyFilter === 'all' || act.type === historyFilter) && 
      act.description !== 'Theme toggle clicked'
    );
    const sorted = [...filtered].sort((a, b) => historySort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    
    return sorted.reduce((acc, act) => {
      const dateObj = new Date(act.timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      if (dateObj.toDateString() === today.toDateString()) dateKey = 'Today';
      else if (dateObj.toDateString() === yesterday.toDateString()) dateKey = 'Yesterday';

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(act);
      return acc;
    }, {});
  }, [activityLog, historyFilter, historySort]);

  // Reels interactive calculators state
  const [sipAmount, setSipAmount] = useState(2000);
  const [sipYears, setSipYears] = useState(15);
  const [inflationYears, setInflationYears] = useState(5);
  const [emergencyExpenses, setEmergencyExpenses] = useState(15000);
  const [emergencyJob, setEmergencyJob] = useState('stable'); // stable (3x), business (6x), freelance (9x)
  const [ccBill, setCcBill] = useState(20000);
  const [ccPaymentMode, setCcPaymentMode] = useState('min'); // min vs full
  const [passiveCapital, setPassiveCapital] = useState(10000);

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! Main hoon Paisa Buddy 🦊 - aapka personal AI financial advisor. Aaj aap kya seekhna chahenge? Niche diye gaye topics pe click karein ya apna sawaal likhein!',
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  // Auth/Hydration guards
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, router]);

  // Set active tab from query param if provided
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['dashboard', 'reels', 'chatbot', 'gamified', 'tools', 'profile', 'bookmarks', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Set current reel index based on URL search query "?id=..." or "?reelId=..."
  useEffect(() => {
    const reelIdParam = searchParams?.get('id') || searchParams?.get('reelId');
    if (reelIdParam && reels.length > 0) {
      const index = reels.findIndex(r => 
        String(r.id) === String(reelIdParam) || 
        String(r.videoId) === String(reelIdParam)
      );
      if (index !== -1 && index !== currentReelIndex) {
        setTimeout(() => setCurrentReelIndex(index), 0);
      }
    }
  }, [searchParams, reels, currentReelIndex]);

  // Log Reel Views
  useEffect(() => {
    if (activeTab === 'reels' && reels.length > 0 && reels[currentReelIndex]) {
      // Check if this reel view was already logged recently to avoid spam
      const recentLog = activityLog.find(a => 
        a.type === 'module_section' && 
        a.description === `Watched Reel: ${reels[currentReelIndex].title}` &&
        (Date.now() - a.timestamp) < 60000 // within 1 min
      );
      if (!recentLog) {
        logActivity('module_section', `Watched Reel: ${reels[currentReelIndex].title}`, 0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReelIndex, activeTab]);

  // Quote rotation
  useEffect(() => {
    const qInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(qInterval);
  }, []);

  // Keydown ArrowUp/ArrowDown handler for changing reels like IG web
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'reels' || reels.length <= 1) return;
      if (e.key === 'ArrowDown') {
        nextReel();
      } else if (e.key === 'ArrowUp') {
        prevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, reels.length, currentReelIndex]);

  const lastScrollTime = useRef(0);
  const handleWheel = (e) => {
    if (reels.length <= 1) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 800) return; // 800ms throttle

    if (e.deltaY > 30) {
      nextReel();
      lastScrollTime.current = now;
    } else if (e.deltaY < -30) {
      prevReel();
      lastScrollTime.current = now;
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);


  const userGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Subah ki shubhkamnayein';
    if (hours < 17) return 'Namaste';
    return 'Shubh Sandhya';
  };

  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round((completedCards / totalCards) * 100)) : 0;

  const healthScore = Math.min(100, Math.round(
    (completedModules.length / modules.length) * 45 +
    (overallProgress / 100) * 30 +
    (coins / 1000) * 15 +
    (streak / 30) * 10
  ));

  // Reels Handlers
  const handleReelLike = (index) => {
    const newReels = [...reels];
    const isLiking = !newReels[index].hasLiked;
    newReels[index].hasLiked = isLiking;
    newReels[index].likes = isLiking ? newReels[index].likes + 1 : newReels[index].likes - 1;
    setReels(newReels);

    if (isLiking) {
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
      addXP(5);
      logActivity('general', `Reel liked: ${newReels[index].title}`, 0);
    }
  };

  const handleReelBookmark = (index) => {
    const newReels = [...reels];
    newReels[index].hasBookmarked = !newReels[index].hasBookmarked;
    setReels(newReels);
    addXP(5);
    logActivity('general', `${newReels[index].hasBookmarked ? 'Bookmarked' : 'Unbookmarked'} reel: ${newReels[index].title}`, 0);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newReels = [...reels];
    const newComment = {
      id: Date.now(),
      user: user?.displayName?.split(' ')[0] || "You",
      text: commentInput.trim()
    };
    newReels[currentReelIndex].comments.push(newComment);
    setReels(newReels);
    setCommentInput('');
    addXP(10);
    addCoins(2);
    logActivity('general', `Comment added on reel: ${newReels[currentReelIndex].title}`, 2);
  };

  function nextReel() {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setShowComments(false);
    }
  }

  function prevReel() {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setShowComments(false);
    }
  }

  const handleAddYoutubeReel = async (e) => {
    e.preventDefault();
    if (!youtubeUrlInput.trim()) return;

    setIsFetchingYt(true);
    setYtError(null);

    try {
      const response = await fetch('/api/reels/fetch-yt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrlInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video details');
      }

      // Add the new reel to the list
      const newReel = {
        id: Date.now(),
        title: data.title,
        videoId: data.videoId,
        description: data.description || `Watch this financial reel from ${data.author || 'YouTube'}.`,
        views: "100+",
        likes: 10,
        hasLiked: false,
        hasBookmarked: false,
        comments: []
      };

      setReels(prev => [newReel, ...prev]);
      setCurrentReelIndex(0);
      setYoutubeUrlInput('');
      addXP(20);
      logActivity('general', `Added new YouTube Reel: ${data.title}`, 10);
    } catch (err) {
      console.error(err);
      setYtError(err.message || 'Something went wrong. Please check the URL.');
    } finally {
      setIsFetchingYt(false);
    }
  };

  // AI Chat Bot Handlers
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      role: 'user',
      content: text.trim(),
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const recent = chatMessages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('/api/finance-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: { coins, completedModules, streak, masteredTerms, userName: user?.displayName, recentMessages: recent }
        })
      });

      const data = await response.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: Date.now() }]);
      } else {
        throw new Error();
      }
    } catch {
      // Offline fallback generator
      const reply = getHinglishFallbackReply(text.trim());
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);
      }, 1200);
    } finally {
      setIsTyping(false);
      addXP(5);
    }
  };

  const getHinglishFallbackReply = (text) => {
    const query = text.toLowerCase();
    if (query.includes('sip') || query.includes('invest')) {
      return "Suno bhai! SIP (Systematic Investment Plan) compounding ka sabse badhiya shortcut hai. Aap har mahine ₹500 ya ₹1000 se start kar sakte ho. Isse 'Rupee Cost Averaging' milti hai - jab market gire tab zyada units, jab badhe tab kam! Aapko start krna chahiye equity index funds se. Kaisa laga advice? 📈";
    }
    if (query.includes('budget') || query.includes('kharcha')) {
      return "Budget banana mushkil nahi hai boss! Ek simple rule follow karo: 50/30/20 Rule. 50% income Needs pe (rent, bill, groceries), 30% Wants pe (outside food, movies, shopping), aur 20% direct Savings & Investing mein. Auto-debit shuru kar do taaki saving automatic ho jaye. 🧾";
    }
    if (query.includes('emergency') || query.includes('fund') || query.includes('survival')) {
      return "Emergency fund ka standard rule hai: 3-6-9 Rule. Stable job walo ke liye 3 mahine ka expense, business/EMI walo ke liye 6 mahine ka, aur freelancers/irregular earnings walo ke liye 9 mahine ka expense liquid account mein backup hona chahiye! Taaki mobile broke ho ya job loss ho, udhaar na lena pade. 🛡️";
    }
    if (query.includes('credit') || query.includes('card') || query.includes('trap')) {
      return "Credit card ek do-dhaari talwar hai. Agar full payment karoge time pe, toh reward points aur credit score badhega. Lekin agar sirf 'Minimum Due' pay karoge toh 36-48% yearly interest lagta hai! Bank isi se kamaate hain. Is trap se bachein. 💳";
    }
    if (query.includes('inflation') || query.includes('mehangai')) {
      return "Inflation (mehangai) ek silent chor hai! Agar inflation 6% hai, toh aaj ka ₹100 agle saal sirf ₹94 ki cheezein khareed payega. Iska matlab safe savings account (jo 3% interest deta hai) mein rakhne se aapka paisa ghis raha hai! Aapko inflation ko beat krne ke liye mutual funds/stocks mein invest krna hoga. 🥷";
    }
    return `Aapne pucha: "${text}". Ye sach mein ek solid financial sawaal hai. Money Matters app ke learning modules ko padhein, aur visual strategy simulators ko use karein (jaise 'Paise ka GPS' ya 'Debt Doors') jo Tools menu mein hain, isse aapko deep practical understanding milegi! Kuch aur poochna hai Paisa Buddy se? 🦊`;
  };

  // Calculations derived
  const sipResult = useMemo(() => {
    const rate = 0.12 / 12;
    const months = sipYears * 12;
    const invested = sipAmount * months;
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + sipAmount) * (1 + rate);
    }
    return {
      invested,
      wealth: Math.round(total),
      gain: Math.max(0, Math.round(total - invested))
    };
  }, [sipAmount, sipYears]);

  const inflationResult = useMemo(() => {
    const rate = 0.06;
    const original = 10000;
    const value = Math.round(original / Math.pow(1 + rate, inflationYears));
    return {
      loss: original - value,
      value
    };
  }, [inflationYears]);

  const emergencyResult = useMemo(() => {
    const multiplier = emergencyJob === 'stable' ? 3 : emergencyJob === 'business' ? 6 : 9;
    return emergencyExpenses * multiplier;
  }, [emergencyExpenses, emergencyJob]);

  const ccResult = useMemo(() => {
    const interestRate = 0.035; // 3.5% monthly
    const minPercent = 0.05; // 5%
    let balance = ccBill;
    let months = 0;
    let totalPaid = 0;

    if (ccPaymentMode === 'full') {
      return { months: 1, totalPaid: ccBill, interest: 0 };
    }

    while (balance > 100 && months < 300) {
      const minPayment = Math.max(balance * minPercent, 500);
      const interest = balance * interestRate;
      totalPaid += minPayment;
      balance = balance + interest - minPayment;
      months++;
    }

    return {
      months,
      totalPaid: Math.round(totalPaid),
      interest: Math.round(Math.max(0, totalPaid - ccBill))
    };
  }, [ccBill, ccPaymentMode]);

  // Sidebar components links
  const sideLinks = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'reels', label: 'Reels', Icon: Film },
    { id: 'chatbot', label: 'AI Chat Bot', Icon: MessageSquare },
    { id: 'gamified', label: 'Gamified Concept', Icon: Trophy },
    { id: 'tools', label: 'Learning Tools', Icon: Wrench },
    { id: 'history', label: 'Learning History', Icon: Clock },
    { id: 'profile', label: 'Profile', Icon: User }
  ];
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090D1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading Money Matters...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#070913] text-zinc-100 overflow-x-hidden font-sans">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Responsive layout container */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* ── DESKTOP SIDEBAR (Instagram Style) ── */}
        <aside 
          onMouseEnter={() => setIsSidebarHovered(true)} 
          onMouseLeave={() => { setIsSidebarHovered(false); setShowMoreMenu(false); }}
          className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-[#090D1A]/90 backdrop-blur-xl border-r border-white/[0.05] p-5 z-40 transition-all duration-300 ease-in-out ${
            isSidebarHovered ? 'w-64 lg:w-72 shadow-2xl border-white/[0.08]' : 'w-20'
          }`}
        >
          {/* Logo & Brand Name */}
          <Link href="/home" className={`flex items-center mb-8 px-2 group transition-all ${isSidebarHovered ? 'gap-3' : 'justify-center px-0'}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            {isSidebarHovered && (
              <span className="text-xl font-bold font-display tracking-tight text-white whitespace-nowrap animate-fade-in">
                Money<span className="text-emerald-400"> Matters</span>
              </span>
            )}
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center space-y-2">
            {sideLinks.map(link => {
              const Icon = link.Icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setShowMoreMenu(false); }}
                  className={`w-full flex items-center rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                    isSidebarHovered ? 'justify-start gap-4 px-4 py-3' : 'justify-center p-3'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-indigo-500/5 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                  title={!isSidebarHovered ? link.label : undefined}
                >
                  <Icon size={20} className={`shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  {isSidebarHovered && <span className="truncate whitespace-nowrap">{link.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom "More" Button & Popover */}
          <div className="relative mt-auto">
            <AnimatePresence>
              {showMoreMenu && isSidebarHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-12 left-0 w-full bg-[#0D1326] border border-white/[0.08] rounded-2xl p-2.5 shadow-2xl z-50 space-y-1"
                >
                  {/* Theme Toggle option */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors">
                    <span className="text-xs font-semibold">Theme</span>
                    <button
                      className="flex items-center gap-1.5 p-1 rounded-md bg-white/5 border border-white/10"
                    >
                      <Moon size={14} className="text-emerald-400" />
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Dark</span>
                    </button>
                  </div>

                  {/* Bookmarks view link */}
                  <button
                    onClick={() => { setActiveTab('bookmarks'); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                  >
                    <Bookmark size={15} />
                    Bookmarks
                  </button>

                 </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`w-full flex items-center rounded-xl text-left text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] transition-all duration-200 ${
                isSidebarHovered ? 'justify-start gap-4 px-4 py-3' : 'justify-center p-3'
              }`}
              title={!isSidebarHovered ? "More" : undefined}
            >
              <Menu size={20} className="shrink-0" />
              {isSidebarHovered && <span>More</span>}
            </button>
          </div>
        </aside>

        {/* ── MOBILE TOP HEADER ── */}
        <header className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#090D1A]/95 backdrop-blur-xl border-b border-white/[0.05] px-4 flex items-center justify-between z-40">
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-base font-bold font-display tracking-tight text-white">
              Money<span className="text-emerald-400"> Matters</span>
            </span>
          </Link>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-2">
            {/* Coins */}
            <div className="flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-1">
              <Coins size={12} className="text-amber-400" />
              <span className="font-bold text-amber-400 text-xs">{coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1">
              <Flame size={12} className="text-orange-400" />
              <span className="font-bold text-orange-400 text-xs">{streak}d</span>
            </div>

            </div>
        </header>

        {/* ── MOBILE BOTTOM NAVIGATION ── */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#090D1A]/95 backdrop-blur-xl border-t border-white/[0.05] grid grid-cols-7 items-center justify-center z-40">
          {sideLinks.map(link => {
            const Icon = link.Icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setShowMoreMenu(false); }}
                className="flex flex-col items-center justify-center h-full text-zinc-400 relative"
              >
                <Icon size={20} className={isActive ? 'text-emerald-400 scale-110' : 'text-zinc-400 hover:text-zinc-200'} />
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── MAIN CONTENT AREA ── */}
        <div className={`flex-1 flex flex-col min-w-0 pb-16 md:pb-0 transition-all duration-300 ease-in-out ${
          isSidebarHovered ? 'md:ml-64 lg:ml-72' : 'md:ml-20'
        }`}>
          
          {/* Desktop Top Header Bar */}
          <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-white/[0.05] bg-[#090D1A]/50 backdrop-blur-md sticky top-0 z-30">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">
                {activeTab === 'dashboard' ? 'Home' : activeTab}
              </h2>
            </div>

            {/* Top Bar Controls */}
            <div className="flex items-center gap-4">
              {/* Coins Tracker */}
              <div className="flex items-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 border-b-2 shadow-sm shadow-amber-400/5">
                <span className="font-extrabold text-amber-400 text-sm leading-none mr-0.5">₹</span>
                <span className="font-bold text-amber-400 text-sm tabular-nums">{coins}</span>
              </div>

              {/* Streak Tracker */}
              <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 border-b-2 shadow-sm shadow-orange-500/5">
                <Flame size={14} className="text-orange-400" />
                <span className="font-bold text-orange-400 text-xs">
                  {streak} Days
                </span>
              </div>

              {/* User Greeting/Avatar */}
              <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
                <span className="text-xs font-semibold text-zinc-300">
                  {user?.displayName?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm"
                >
                  🦊
                </button>
              </div>
            </div>
          </header>

          {/* Running marquee tips under top header (Dashboard tab only) */}
          {activeTab === 'dashboard' && (
            <div className="w-full bg-emerald-500/5 border-y border-emerald-500/10 py-1.5 overflow-hidden whitespace-nowrap relative z-20 mt-16 md:mt-0">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="flex gap-16 items-center"
              >
                {[...QUOTES, ...QUOTES].map((q, i) => (
                  <span key={i} className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={11} fill="currentColor" /> {q}
                  </span>
                ))}
              </motion.div>
            </div>
          )}

          {/* Main scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 mt-16 md:mt-0">
            <AnimatePresence mode="wait">
              
              {/* ══════════════════════════════════════════════════════════════
                  TAB: DASHBOARD
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6 max-w-6xl mx-auto"
                >
                  {/* Hero Greeting Panel */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 glass-card-premium p-6 sm:p-8">
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-emerald/10 blur-3xl pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-soft uppercase tracking-widest mb-2">
                          {userGreeting()} 👋
                        </p>
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-2">
                          Kya haal hai, {user?.displayName?.split(' ')[0] ?? 'Champion'}! 🔥
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
                        <div
                          className="coin-spin-3d w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_4px_10px_rgba(245,158,11,0.4),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-amber-400/30"
                          style={{
                            transformStyle: 'preserve-3d',
                            filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))'
                          }}
                        >
                          <IndianRupee
                            size={20}
                            className="text-white font-extrabold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
                            style={{
                              transform: 'translateZ(4px)'
                            }}
                          />
                        </div>
                      }
                      label="Total Coins"
                      value={<AnimatedCounter target={coins} />}
                      accent="#F59E0B"
                      sub={coins >= 500 ? 'Big saver energy 💰' : 'Aur kamao! 🚀'}
                    />
                    <StatCard
                      delay={0.12}
                      emoji={
                        <motion.span
                          animate={{ scale: [1, 1.15, 1], y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          🔥
                        </motion.span>
                      }
                      label="Streak"
                      value={`${streak} din`}
                      accent="#EF4444"
                      sub={streak > 0 ? 'Lagatar jaari rakho! 💪' : 'Aaj shuru karo!'}
                    />
                    <StatCard
                      delay={0.19}
                      emoji={
                        <motion.span
                          animate={{ rotate: [0, -5, 5, 0], y: [0, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          📚
                        </motion.span>
                      }
                      label="Modules"
                      value={`${completedModules.length}/${modules.length}`}
                      accent="#10B981"
                      sub={`${overallProgress}% overall`}
                    />
                    <StatCard
                      delay={0.26}
                      emoji={
                        <motion.span
                          animate={{ scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          🏆
                        </motion.span>
                      }
                      label="Badges"
                      value={badges.length}
                      accent="#8B5CF6"
                      sub={badges.length > 0 ? 'Trophy case bharte ja! ⭐' : 'Pehla badge kamao!'}
                    />
                  </div>

                  {/* Continue Learning Spot */}
                  {(() => {
                    const activeModuleIndex = modules.findIndex(m => !completedModules.includes(m.id));
                    const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
                    const activeCardCount = activeModule ? getAllCardsForModule(activeModule.id).length : 0;
                    const activeProgress = activeModule ? Math.round((moduleProgress[activeModule.id] || 0) / Math.max(activeCardCount - 1, 1) * 100) : 0;

                    if (!activeModule) return null;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative overflow-hidden rounded-2xl border border-emerald/20 glass-card-glow p-5 sm:p-6 spotlight-card"
                      >
                        <div
                          className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-30"
                          style={{
                            backgroundColor: activeModule.color
                          }}
                        />
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
                            <p className="text-[10px] font-black text-emerald-soft uppercase tracking-widest mb-1">
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
                                  style={{
                                    background: `linear-gradient(90deg, ${activeModule.color}, #34D399)`
                                  }}
                                />
                              </div>
                              <span className="text-xs font-bold text-white">
                                {activeProgress}%
                              </span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => router.push(`/dashboard/module/${activeModule.id}`)}
                            className="btn-3d rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap flex items-center gap-2 cursor-pointer"
                            style={{
                              background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)'
                            }}
                          >
                            Aage Badho <ArrowRight size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* Quick Access */}
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
                              setOpenTool(tool.id);
                            } else {
                              setActiveTab('tools');
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

                  {/* Learning Journey Map */}
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                      <div>
                        <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
                          Financial Journey Map 🗺️
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                          Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! 🚀
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
                        const activeModuleIndex = modules.findIndex(m => !completedModules.includes(m.id));
                        const isActive = i === activeModuleIndex;
                        return (
                          <ModuleCard
                            key={mod.id}
                            mod={mod}
                            index={i}
                            isUnlocked={isUnlocked}
                            isActive={isActive}
                            onClick={() => router.push(`/dashboard/module/${mod.id}`)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: LEARNING HISTORY
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                        <Clock className="text-emerald-400" size={24} /> Learning History
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">Aapne ab tak jo bhi seekha aur earn kiya hai, sab yahan hai!</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Filter Dropdown */}
                      <div className="relative group">
                        <select 
                          value={historyFilter}
                          onChange={(e) => setHistoryFilter(e.target.value)}
                          className="appearance-none bg-[#0F1326] border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 font-medium focus:outline-none focus:border-emerald-500/50 cursor-pointer pr-10"
                        >
                          <option value="all">All Activities</option>
                          <option value="module_section">Modules & Reels</option>
                          <option value="strategy">Tools & Strategies</option>
                          <option value="general">General</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>

                      {/* Sort Dropdown */}
                      <div className="relative group">
                        <select 
                          value={historySort}
                          onChange={(e) => setHistorySort(e.target.value)}
                          className="appearance-none bg-[#0F1326] border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 font-medium focus:outline-none focus:border-emerald-500/50 cursor-pointer pr-10"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                        <ArrowDownUp size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                      
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 shrink-0">
                        <span className="text-xs font-bold text-emerald-400">Total: {activityLog.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0F1326] border border-white/[0.05] p-6 rounded-3xl shadow-xl">
                    {Object.keys(filteredAndGroupedHistory).length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                          <Clock size={28} className="text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-bold text-zinc-300">Koi history nahi hai abhi</p>
                          <p className="text-xs text-zinc-500 max-w-xs mx-auto">Modules complete karein aur calculators use karein apni history build karne ke liye! 🚀</p>
                        </div>
                        <button 
                          onClick={() => { setHistoryFilter('all'); setHistorySort('newest'); setActiveTab('dashboard'); }}
                          className="btn-emerald px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Start Learning Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(filteredAndGroupedHistory).map(([date, acts]) => (
                          <div key={date} className="space-y-3">
                            {/* Date Header */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{date}</span>
                              <div className="h-px flex-1 bg-white/[0.05]" />
                            </div>
                            
                            {/* Activities */}
                            <div className="space-y-2">
                              {acts.map(act => (
                                <div key={act.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/[0.04] hover:border-emerald-500/20 group">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors text-xl">
                                    {ACTIVITY_EMOJI[act.type] || '✨'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-200 leading-snug">{act.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-zinc-500">
                                        {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                      <span className="text-[10px] font-medium text-emerald-500/70 capitalize">
                                        {act.type.replace('_', ' ')}
                                      </span>
                                    </div>
                                  </div>
                                  {act.coins > 0 && (
                                    <div className="flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 shrink-0">
                                      <span className="text-xs font-black text-amber-400">+{act.coins}</span>
                                      <Coins size={10} className="text-amber-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: REELS (Financial Reels)
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'reels' && (
                <motion.div
                  key="reels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-4xl mx-auto h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]"
                >
                  {/* Smartphone Mockup Frame */}
                  <div 
                    onWheel={handleWheel}
                    className="relative w-full max-w-[340px] aspect-[9/16] bg-[#0c0f1d] border-4 border-zinc-800 rounded-[36px] shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
                  >
                    
                    {/* Notch overlay */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-30 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
                      <div className="w-10 h-1 bg-black/40 rounded-full" />
                    </div>

                    {/* Reels Content Slider */}
                    <div className="relative flex-1 bg-gradient-to-b from-[#131627] to-[#0A0C16] flex flex-col justify-between p-4 overflow-hidden pt-7">
                      
                      {/* Reel Top Bar Overlay */}
                      <div className="flex items-center justify-between text-zinc-400 z-20">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Reels</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                          </button>
                        </div>
                      </div>

                      {reels.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 z-20">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <PlusSquare size={24} className="animate-pulse" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">No Reels Yet</h4>
                            <p className="text-[10px] text-zinc-500 max-w-[200px] leading-relaxed">
                              Right side waale form mein YouTube URL daal kar apni financial learning reel generate karo!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* YouTube Video Player Background */}
                          {reels[currentReelIndex]?.videoId && (
                            <YoutubeReelPlayer
                              videoId={reels[currentReelIndex].videoId}
                              isMuted={isMuted}
                              autoScroll={autoScroll}
                              onVideoEnd={nextReel}
                            />
                          )}

                      {/* Interactive UI inside the Reel (The dynamic calculator widgets) */}
                      <div className="flex-1 flex flex-col justify-center py-4 z-20 relative">
                        <AnimatePresence mode="wait">
                          {!reels[currentReelIndex]?.videoId ? (
                            <motion.div
                              key={currentReelIndex}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -30 }}
                              transition={{ duration: 0.3 }}
                              className="w-full text-center space-y-4"
                            >
                              <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.3))' }}>
                                {currentReelIndex === 0 && '🪄'}
                                {currentReelIndex === 1 && '🥷'}
                                {currentReelIndex === 2 && '🛡️'}
                                {currentReelIndex === 3 && '💳'}
                                {currentReelIndex === 4 && '💸'}
                              </span>
                              <h3 className="text-base font-extrabold text-white leading-tight">{reels[currentReelIndex].title}</h3>

                            {/* REEL 1: SIP CALCULATOR WIDGET */}
                            {currentReelIndex === 0 && (
                              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-3.5 text-left">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>SIP AMOUNT:</span>
                                    <span className="text-emerald-400 font-black">₹{sipAmount.toLocaleString('en-IN')}/m</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="500"
                                    value={sipAmount}
                                    onChange={(e) => setSipAmount(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>DURATION:</span>
                                    <span className="text-emerald-400 font-black">{sipYears} Years</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="5"
                                    max="25"
                                    step="1"
                                    value={sipYears}
                                    onChange={(e) => setSipYears(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                  />
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-1">
                                  <p className="text-[9px] text-zinc-500 font-semibold uppercase">Total Invested: ₹{sipResult.invested.toLocaleString('en-IN')}</p>
                                  <p className="text-xs font-extrabold text-white">Est. Value (12%): <span className="text-emerald-400">₹{sipResult.wealth.toLocaleString('en-IN')}</span></p>
                                </div>
                                
                                {/* Compounding Tree growth */}
                                <div className="flex justify-center pt-1.5">
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="text-center font-bold text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"
                                    style={{ paddingBottom: '3px' }}
                                  >
                                    🌳 Compounding Tree Growing!
                                  </motion.div>
                                </div>
                              </div>
                            )}

                            {/* REEL 2: INFLATION MONSTER WIDGET */}
                            {currentReelIndex === 1 && (
                              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-3.5 text-left">
                                <p className="text-[11px] text-zinc-300">₹10,000 in locker loses purchasing power at 6% inflation.</p>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>YEARS IN LOCKER:</span>
                                    <span className="text-red-400 font-black">{inflationYears} Years</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={inflationYears}
                                    onChange={(e) => setInflationYears(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                                  />
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-1.5">
                                  <p className="text-xs font-extrabold text-white">Value left: <span className="text-red-400">₹{inflationResult.value.toLocaleString('en-IN')}</span></p>
                                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Loss: -₹{inflationResult.loss.toLocaleString('en-IN')} 🥷</p>
                                </div>
                              </div>
                            )}

                            {/* REEL 3: EMERGENCY FUND WIDGET */}
                            {currentReelIndex === 2 && (
                              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-3 text-left">
                                <div className="grid grid-cols-3 gap-1">
                                  {['stable', 'business', 'freelance'].map(job => (
                                    <button
                                      key={job}
                                      onClick={() => setEmergencyJob(job)}
                                      className={`px-1.5 py-1 text-[9px] font-black rounded-lg border uppercase transition-all ${
                                        emergencyJob === job
                                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                          : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'
                                      }`}
                                    >
                                      {job === 'stable' ? 'Job 💼' : job === 'business' ? 'EMI 🧾' : 'Freelance 💻'}
                                    </button>
                                  ))}
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>MONTHLY EXPENSES:</span>
                                    <span className="text-emerald-400 font-black">₹{emergencyExpenses.toLocaleString('en-IN')}</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="5000"
                                    max="50000"
                                    step="2500"
                                    value={emergencyExpenses}
                                    onChange={(e) => setEmergencyExpenses(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                  />
                                </div>

                                <div className="pt-2 border-t border-white/5">
                                  <p className="text-[9px] text-zinc-500 font-bold uppercase">{emergencyJob === 'stable' ? '3 Months' : emergencyJob === 'business' ? '6 Months' : '9 Months'} Expenses Required</p>
                                  <p className="text-sm font-extrabold text-white">Emergency Fund: <span className="text-emerald-400">₹{emergencyResult.toLocaleString('en-IN')}</span></p>
                                </div>
                              </div>
                            )}

                            {/* REEL 4: CC DEBT TRAP WIDGET */}
                            {currentReelIndex === 3 && (
                              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-3 text-left">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>CREDIT CARD BILL:</span>
                                    <span className="text-red-400 font-black">₹{ccBill.toLocaleString('en-IN')}</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="5000"
                                    max="50000"
                                    step="5000"
                                    value={ccBill}
                                    onChange={(e) => setCcBill(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <button
                                    onClick={() => setCcPaymentMode('min')}
                                    className={`px-2 py-1.5 text-[9px] font-black rounded-lg border uppercase transition-all ${
                                      ccPaymentMode === 'min'
                                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                        : 'bg-white/5 border-transparent text-zinc-400'
                                    }`}
                                  >
                                    Minimum Due (5%)
                                  </button>
                                  <button
                                    onClick={() => setCcPaymentMode('full')}
                                    className={`px-2 py-1.5 text-[9px] font-black rounded-lg border uppercase transition-all ${
                                      ccPaymentMode === 'full'
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                        : 'bg-white/5 border-transparent text-zinc-400'
                                    }`}
                                  >
                                    Full Payment
                                  </button>
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-1">
                                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Time to pay: {ccResult.months} Months</p>
                                  <p className="text-xs font-extrabold text-white">Total paid: <span className={ccPaymentMode === 'min' ? "text-red-400" : "text-emerald-400"}>₹{ccResult.totalPaid.toLocaleString('en-IN')}</span></p>
                                  {ccPaymentMode === 'min' && (
                                    <p className="text-[9px] text-red-400 font-semibold">Interest paid: +₹{ccResult.interest.toLocaleString('en-IN')}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* REEL 5: ACTIVE VS PASSIVE INCOME */}
                            {currentReelIndex === 4 && (
                              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5 space-y-3.5 text-left">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] text-zinc-400 font-bold block flex justify-between">
                                    <span>PASSIVE ASSET SIP:</span>
                                    <span className="text-emerald-400 font-black">₹{passiveCapital.toLocaleString('en-IN')}/m</span>
                                  </label>
                                  <input
                                    type="range"
                                    min="1000"
                                    max="20000"
                                    step="1000"
                                    value={passiveCapital}
                                    onChange={(e) => setPassiveCapital(Number(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                  />
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 font-medium">Active (Job/Gig):</span>
                                    <span className="text-zinc-200 font-bold">100% time bound</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 font-medium">Passive (returns):</span>
                                    <span className="text-emerald-400 font-bold">₹{(passiveCapital * 0.1).toFixed(0)}/month est.</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <p className="text-xs text-zinc-400 leading-snug px-2">{reels[currentReelIndex].description}</p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>

                      {/* Heart Popup Animation */}
                      <AnimatePresence>
                        {showHeartPop && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.3, 0.9, 1.1, 1], opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none z-30"
                          >
                            <Heart size={80} fill="#EF4444" className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Reel Left-Bottom metadata & Action bar */}
                      <div className="flex justify-between items-end z-20">
                        {/* Title & Caption */}
                        <div className="flex-1 min-w-0 pr-4 text-left">
                          <h4 className="text-sm font-extrabold text-white leading-tight flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            <Sparkles size={14} className="text-amber-400 shrink-0" />
                            <span className="truncate">{reels[currentReelIndex].title}</span>
                          </h4>
                          {reels[currentReelIndex]?.videoId && (
                            <p className="text-[11px] text-zinc-300 mt-1.5 leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                              {reels[currentReelIndex].description}
                            </p>
                          )}
                          <p className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase mt-1 flex items-center gap-1 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            <MusicIcon className="w-2.5 h-2.5" /> Original Audio · Money Matters
                          </p>
                        </div>

                        {/* Right side Interactions overlay column */}
                        <div className="flex flex-col items-center gap-4 text-white">
                          
                          {/* Like Button */}
                          <button
                            onClick={() => handleReelLike(currentReelIndex)}
                            className="flex flex-col items-center group"
                          >
                            <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90">
                              <Heart
                                size={16}
                                fill={reels[currentReelIndex].hasLiked ? "#EF4444" : "none"}
                                className={reels[currentReelIndex].hasLiked ? "text-red-500 animate-pulse" : "text-white"}
                              />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-zinc-400">
                              {(reels[currentReelIndex].likes / 1000).toFixed(0)}k
                            </span>
                          </button>

                          {/* Comment Button */}
                          <button
                            onClick={() => setShowComments(true)}
                            className="flex flex-col items-center group"
                          >
                            <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90">
                              <MessageSquare size={16} className="text-white" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-zinc-400">
                              {reels[currentReelIndex].comments.length}
                            </span>
                          </button>

                          {/* Bookmark Button */}
                          <button
                            onClick={() => handleReelBookmark(currentReelIndex)}
                            className="flex flex-col items-center group"
                          >
                            <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90">
                              <Bookmark
                                size={16}
                                fill={reels[currentReelIndex].hasBookmarked ? "#F59E0B" : "none"}
                                className={reels[currentReelIndex].hasBookmarked ? "text-amber-400" : "text-white"}
                              />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-zinc-400">Save</span>
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/home/reels?id=${reels[currentReelIndex].videoId || reels[currentReelIndex].id}`;
                              navigator.clipboard.writeText(shareUrl);
                              logActivity('general', 'Reel link copied', 0);
                            }}
                            className="flex flex-col items-center group"
                          >
                            <div className="h-9 w-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90">
                              <Share2 size={16} className="text-white" />
                            </div>
                            <span className="text-[9px] font-bold mt-1 text-zinc-400">Share</span>
                          </button>
                        </div>
                      </div>

                      {/* Comments Slide-out Drawer inside the phone mockup */}
                      <AnimatePresence>
                        {showComments && (
                          <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="absolute inset-x-0 bottom-0 h-[70%] bg-[#0B0E1E] border-t border-white/[0.08] rounded-t-2xl z-30 flex flex-col p-4"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-white/[0.05] mb-2.5">
                              <span className="text-xs font-black uppercase text-zinc-400">Comments</span>
                              <button onClick={() => setShowComments(false)} className="p-1 rounded-lg text-zinc-400 hover:bg-white/5">
                                <X size={14} />
                              </button>
                            </div>

                            {/* Comment scroll stream */}
                            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-2 max-h-40">
                              {reels[currentReelIndex].comments.map(c => (
                                <div key={c.id} className="text-left text-xs bg-white/[0.01] border border-white/[0.03] p-2 rounded-xl">
                                  <span className="font-extrabold text-emerald-400 block mb-0.5">{c.user}</span>
                                  <p className="text-zinc-200 leading-snug">{c.text}</p>
                                </div>
                              ))}
                            </div>

                            {/* Add comment form */}
                            <form onSubmit={handleAddComment} className="flex gap-1.5 border-t border-white/[0.05] pt-2.5 bg-[#0B0E1E]">
                              <input
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/40"
                              />
                              <button type="submit" className="p-2 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 transition-colors">
                                <Send size={12} />
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>

                  {/* Desktop Controls (Next / Prev Reel buttons + details) */}
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <div className="hidden lg:block space-y-2 text-left">
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <Film size={20} className="text-emerald-400" /> Capital Reels
                      </h3>
                      <p className="text-zinc-400 text-xs max-w-xs">
                        Apne desktop pe vertical scrolling financial learning reels chalao. Sliders se numbers badlo aur compounded growth live dekho!
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4 lg:mt-0">
                      <button
                        onClick={prevReel}
                        disabled={reels.length <= 1 || currentReelIndex === 0}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F1326] border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous Reel"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex items-center justify-center bg-[#0F1326] border border-white/[0.06] px-5 py-2.5 rounded-2xl">
                        <span className="text-sm font-black text-white">{reels.length === 0 ? 0 : currentReelIndex + 1} / {reels.length}</span>
                      </div>

                      <button
                        onClick={nextReel}
                        disabled={reels.length <= 1 || currentReelIndex === reels.length - 1}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F1326] border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        aria-label="Next Reel"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Auto Scroll Toggle */}
                    <button
                      onClick={() => setAutoScroll(!autoScroll)}
                      type="button"
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                        autoScroll
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      <span>Auto Scroll to Next</span>
                      <span className="font-black uppercase text-[10px]">
                        {autoScroll ? 'ON 🟢' : 'OFF 🔴'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: AI CHAT BOT ("Paisa Buddy")
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'chatbot' && (
                <motion.div
                  key="chatbot"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col lg:flex-row gap-5 max-w-5xl mx-auto h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)]"
                >
                  {/* Left Side Info Panel (desktop only) */}
                  <div className="hidden lg:flex flex-col w-72 bg-[#0F1326] border border-white/[0.05] p-5 rounded-3xl justify-between shrink-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Sparkles size={20} className="text-[#0a0a0f]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-gradient-gold leading-none">Paisa Buddy</h4>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Online Now
                          </span>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Aapka personal AI financial advisor. Hinglish mein sawaal pucho aur dynamic investment, budgeting, ya debt tips pao!
                      </p>

                      <div className="h-px bg-white/5" />

                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Learning Tips</span>
                        <div className="text-[11px] text-zinc-400 leading-snug bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.03]">
                          Active learning se coins earn karein. Har dynamic chat pe +5 XP milta hai!
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setChatMessages([{ role: 'assistant', content: 'Namaste! Paisa Buddy reset ho gaya. Poocho apna sawaal!', timestamp: Date.now() }])}
                      className="flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/15 transition-colors"
                    >
                      Clear Chat History
                    </button>
                  </div>

                  {/* Main Chat Conversation Container */}
                  <div className="flex-1 bg-[#0F1326] border border-white/[0.05] rounded-3xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-3.5 border-b border-white/[0.05] bg-[#0A0C16] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center lg:hidden">
                          <Sparkles size={16} className="text-[#0a0a0f]" />
                        </div>
                        <h3 className="text-sm font-extrabold text-white">Chat Room: Paisa Buddy</h3>
                      </div>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[60vh] lg:max-h-none">
                      {chatMessages.map((msg, index) => {
                        const isAI = msg.role === 'assistant';
                        return (
                          <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed text-left border ${
                              isAI
                                ? 'bg-white/[0.02] border-white/[0.06] text-zinc-200 rounded-tl-none'
                                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 rounded-tr-none shadow-md shadow-emerald-500/[0.02]'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block mt-1.5 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick prompt chips */}
                    <div className="px-5 pb-2">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {QUICK_QUESTIONS.map(q => (
                          <button
                            key={q}
                            onClick={() => handleSendMessage(q)}
                            className="shrink-0 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-zinc-300 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Input form */}
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                      className="p-4 border-t border-white/[0.05] bg-[#0A0C16]/50 flex gap-2.5 items-center"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Apna financial sawaal Hinglish mein likhein..."
                        disabled={isTyping}
                        className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500/40 disabled:opacity-50 transition-colors text-white"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isTyping}
                        className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: GAMIFIED CONCEPTS
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'gamified' && (
                <motion.div
                  key="gamified"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 max-w-5xl mx-auto text-left"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Game selectors */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Spin the Wheel card */}
                      <div className="bg-[#0F1326] border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-56">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-red-400 uppercase">Daily Reward</span>
                          <h3 className="text-xl font-extrabold text-white mt-1">Spin the Wheel of Fortune</h3>
                          <p className="text-zinc-400 text-xs mt-1 max-w-sm">
                            Apni kismat aazmao aur har 24 ghante mein free gold coins jeeto. Coins ko tools unlock karne ke liye use karo!
                          </p>
                        </div>
                        <button
                          onClick={() => setOpenTool('spin')}
                          className="self-start px-5 py-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer uppercase flex items-center gap-1.5"
                        >
                          Spin Karo 🎡
                        </button>
                      </div>

                      {/* Memory Match Card */}
                      <div className="bg-[#0F1326] border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-56">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">Minigame</span>
                          <h3 className="text-xl font-extrabold text-white mt-1">Finance Terms Memory Match</h3>
                          <p className="text-zinc-400 text-xs mt-1 max-w-sm">
                            SIP, Inflation, Debt trap, Dividend aur PPF jaise concepts ko match karein aur memory power badhayein. Earn +80 XP on win!
                          </p>
                        </div>
                        <button
                          onClick={() => setOpenTool('memory')}
                          className="self-start px-5 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer uppercase flex items-center gap-1.5"
                        >
                          Play Match Game 🃏
                        </button>
                      </div>
                    </div>

                    {/* Weekly savings challenge tracker widget */}
                    <div className="bg-[#0F1326] border border-white/[0.05] p-5 rounded-3xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">Saving Challenge</span>
                        <h3 className="text-base font-extrabold text-white leading-tight">30-Day Bachat Challenge</h3>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Har din thoda bacha ke continuous streak complete karo. 7d, 14d, aur 30d streaks pe special badges gallery unlock karein!
                        </p>
                        
                        {/* Interactive summary */}
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 text-center space-y-2">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Saved This Challenge</p>
                          <span className="text-2xl font-black text-amber-400">
                            ₹{savingsChallenge?.totalSaved ?? 0}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setOpenTool('savings')}
                        className="w-full py-3 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors uppercase mt-6 flex items-center justify-center gap-1.5"
                      >
                        Bachat Challenge 🐷
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: LEARNING TOOLS
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 max-w-5xl mx-auto text-left"
                >
                  {/* Strategy section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <Brain className="text-emerald-400" size={20} /> Visual Learning Strategies
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">11 gamified simulators for practical finance concepts</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {strategies.map((strategy, idx) => {
                        return (
                          <div
                            key={strategy.id}
                            className="bg-[#0F1326] border border-white/[0.05] rounded-2xl p-5 hover:border-emerald-500/20 transition-all flex flex-col justify-between h-48 group hover:-translate-y-1"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl" style={{ filter: `drop-shadow(0 4px 10px ${strategy.color}30)` }}>
                                  {strategy.icon === 'Navigation' && '🗺️'}
                                  {strategy.icon === 'GitBranch' && '🛤️'}
                                  {strategy.icon === 'Eye' && '👁️'}
                                  {strategy.icon === 'Layers' && '🥞'}
                                  {strategy.icon === 'Home' && '🏠'}
                                  {strategy.icon === 'DoorOpen' && '🚪'}
                                  {strategy.icon === 'TreePine' && '🌲'}
                                  {strategy.icon === 'Award' && '🏆'}
                                  {strategy.icon === 'BookOpen' && '📖'}
                                  {strategy.icon === 'Clock' && '⏰'}
                                  {strategy.icon === 'Store' && '🏪'}
                                </span>
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                  +100 XP
                                </span>
                              </div>
                              <h4 className="text-sm font-extrabold text-white leading-tight group-hover:text-emerald-400 transition-colors">{strategy.title}</h4>
                              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">{strategy.description || strategy.titleEn}</p>
                            </div>

                            <button
                              onClick={() => setActiveStrategySlug(strategy.slug)}
                              className="mt-4 self-start px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-transparent text-[10px] font-bold text-zinc-300 transition-all flex items-center gap-1 uppercase"
                            >
                              KHELO 🎮
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Calculators section */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <Wrench className="text-indigo-400" size={20} /> Financial Calculators & Utilities
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">Tools to audit and evaluate your personal funds</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[
                        { id: 'sip', label: 'SIP Calculator', desc: 'Compounding value calculate karo', color: '#10B981', icon: CalculatorIcon },
                        { id: 'emergency', label: 'Emergency Fund', desc: 'Locker backup analyze karo', color: '#38BDF8', icon: Shield },
                        { id: 'age', label: 'Financial Age', desc: 'Apna financial maturity score dekho', color: '#F59E0B', icon: UserCheck },
                        { id: 'priority', label: 'Priority Calculator', desc: 'Needs vs Wants priority set karo', color: '#8B5CF6', icon: Sliders },
                        { id: 'expense', label: 'Expense Auditor', desc: 'Monthly expenses list down karo', color: '#EF4444', icon: Receipt },
                        { id: 'goals', label: 'Goal Tracker', desc: 'Asset goal sets and values tracking', color: '#10B981', icon: Target },
                        { id: 'news', label: 'Market News Feed', desc: 'Important market insights padho', color: '#EC4899', icon: Globe }
                      ].map(t => {
                        const Icon = t.icon;
                        return (
                          <div
                            key={t.id}
                            className="bg-[#0F1326] border border-white/[0.05] rounded-2xl p-4.5 hover:border-white/15 transition-all flex flex-col justify-between text-center group"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform" style={{ color: t.color }}>
                                <Icon size={20} />
                              </div>
                              <h4 className="text-xs font-extrabold text-white leading-tight truncate w-full">{t.label}</h4>
                              <p className="text-[10px] text-zinc-500 leading-snug line-clamp-2 mt-1 min-h-[2rem]">{t.desc}</p>
                            </div>
                            <button
                              onClick={() => setOpenTool(t.id)}
                              className="w-full mt-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black text-zinc-300 transition-colors uppercase"
                            >
                              Open Tool ⚙️
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: PROFILE
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 max-w-4xl mx-auto text-left"
                >
                  {/* Avatar & Experience Panel */}
                  <div className="bg-[#0F1326] border border-white/[0.05] p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-[80px]" />
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-indigo-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-4xl shadow-lg">
                          🦊
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full border border-black uppercase tracking-wider">
                          Lvl {level}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                          {user?.displayName ?? 'Capital Master'}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {getLevelLabel(level).label} · Status: {user?.status ? user.status.toUpperCase() : 'STUDENT'}
                        </p>
                        
                        {/* XP Progress bar */}
                        <div className="pt-2 max-w-md">
                          <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
                            <span>Experience Progress</span>
                            <span>{xp} / {(level * 300)} XP</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full" style={{ width: `${Math.min((xp / (level * 300)) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                      {[
                        { label: 'Gold Coins', value: coins, accent: '#F59E0B' },
                        { label: 'Streak Days', value: `${streak}d`, accent: '#EF4444' },
                        { label: 'Modules Done', value: `${completedModules.length}/11`, accent: '#10B981' },
                        { label: 'Badges Unlocked', value: `${badges.length + earnedBadges.length}`, accent: '#8B5CF6' }
                      ].map(pill => (
                        <div key={pill.label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3.5 text-center">
                          <span className="text-lg font-black text-white block" style={{ color: pill.accent }}>{pill.value}</span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">{pill.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Badge Gallery */}
                  <div className="bg-[#0F1326] border border-white/[0.05] p-5 rounded-3xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                      <Trophy size={14} /> Badges Gallery
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 text-center">
                      {BADGES.map(badge => {
                        const isUnlocked = badges.includes(badge.id) || earnedBadges.includes(badge.id);
                        return (
                          <div
                            key={badge.id}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center ${
                              isUnlocked
                                ? 'bg-white/[0.03] border-white/[0.06]'
                                : 'bg-white/[0.01] border-transparent opacity-30 grayscale'
                            }`}
                            title={badge.description}
                          >
                            <span className="text-2xl">{badge.emoji}</span>
                            <span className="text-[9px] font-bold text-zinc-300 mt-1 block truncate w-full">{badge.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB: BOOKMARKS
                  ══════════════════════════════════════════════════════════════ */}
              {activeTab === 'bookmarks' && (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 max-w-4xl mx-auto text-left"
                >
                  <div>
                    <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Bookmark className="text-amber-400" size={20} fill="#F59E0B" /> Bookmarked Content
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">Saved financial reels and terms for quick revision</p>
                  </div>

                  {reels.filter(r => r.hasBookmarked).length === 0 ? (
                    <div className="bg-[#0F1326] border border-white/[0.05] p-8 rounded-3xl text-center">
                      <p className="text-sm text-zinc-500">Koi bookmark nahi mila. Reels tab mein bookmarks icon check karo!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {reels.filter(r => r.hasBookmarked).map(r => (
                        <div key={r.id} className="bg-[#0F1326] border border-white/[0.05] p-5 rounded-2xl flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Reel Bookmark</span>
                            <h4 className="text-sm font-extrabold text-white mt-1 leading-tight">{r.title}</h4>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{r.description}</p>
                          </div>
                          <button
                            onClick={() => { setActiveTab('reels'); setCurrentReelIndex(reels.findIndex(rl => rl.id === r.id)); }}
                            className="self-start mt-4 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase transition-all"
                          >
                            Open Reel 🎬
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ── ACTIVE TOOL CONTAINER (MODAL / DIALOG) ── */}
      <AnimatePresence>
        {openTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D1224] border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative p-5 sm:p-7 custom-scroll text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setOpenTool(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all z-50 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <Suspense fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              }>
                {openTool === 'goals' && <LazyGoalTracker open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'expense' && <LazyExpenseTracker open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'savings' && <LazySavingsChallenge open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'quiz' && <LazyQuizArena open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'spin' && <LazySpinWheel open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'memory' && <LazyMemoryMatch open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'word' && <LazyWordScramble open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'news' && <LazyFinancialNewsWidget open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'priority' && <LazyPriorityCalculator open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'invest' && <LazyInvestmentComparison open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'emergency' && <LazyEmergencyFundCalculator open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'habit' && <LazyHabitTracker open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'age' && <LazyFinancialAgeCalculator open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'sip' && <LazySIPCalculator open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'badges' && <LazyBadgeGallery open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'achievement' && <LazyAchievementDashboard open={true} onClose={() => setOpenTool(null)} />}
                {openTool === 'health' && <LazyHealthCheckup open={true} onClose={() => setOpenTool(null)} />}
              </Suspense>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── STRATEGY SIMULATOR FULL-SCREEN VIEWER ── */}
      <AnimatePresence>
        {activeStrategySlug && (
          <div className="fixed inset-0 z-[120] bg-[#070913] flex flex-col">
            
            {/* Header control */}
            <div className="shrink-0 bg-[#0C0F1E] border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStrategySlug(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Tools
                </button>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Strategy: {activeStrategySlug}</span>
              </div>
              <button
                onClick={() => setActiveStrategySlug(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close Viewer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Strategy viewport */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-6xl mx-auto w-full">
              <Suspense fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              }>
                {(() => {
                  const Comp = StrategyComponents[activeStrategySlug];
                  return Comp ? <Comp /> : <p className="text-zinc-400">Loading strategy component...</p>;
                })()}
              </Suspense>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ── Simple inline utility icon components for safety ──

function MusicIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function CalculatorIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function YoutubeReelPlayer({ videoId, isMuted, autoScroll, onVideoEnd }) {
  const containerId = `yt-player-${videoId}`;
  const playerRef = useRef(null);

  useEffect(() => {
    let player;

    const initPlayer = () => {
      player = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: isMuted ? 1 : 0,
          controls: 0,
          loop: autoScroll ? 0 : 1,
          playlist: autoScroll ? undefined : videoId,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (autoScroll) {
                onVideoEnd();
              }
            }
          }
        }
      });
      playerRef.current = player;
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = initPlayer;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        const checkLoaded = setInterval(() => {
          if (window.YT && window.YT.Player) {
            initPlayer();
            clearInterval(checkLoaded);
          }
        }, 100);
      }
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, [videoId, autoScroll, onVideoEnd]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none rounded-[32px]">
      <div id={containerId} className="absolute top-1/2 left-1/2 w-[300%] h-[100%] -translate-x-1/2 -translate-y-1/2 aspect-[9/16] pointer-events-none scale-[1.35]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10 pointer-events-none" />
    </div>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
