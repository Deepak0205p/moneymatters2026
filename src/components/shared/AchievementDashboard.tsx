'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  Star,
  Flame,
  Trophy,
  Coins,
  CheckCircle2,
  Lock,
  BookOpen,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Zap,
  Footprints,
  MapPin,
  Sword,
  Crown,
  DoorOpen,
  Bird,
  PiggyBank,
  Construction,
  Milestone,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { strategies } from '@/lib/data/strategies';
import { modules } from '@/lib/data/modules';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgressRing from '@/components/shared/ProgressRing';

// ── Badge data (same as BadgeGallery) ──
const BADGES = [
  { id: 'first-login', name: 'Pehla Kadam', description: 'App pe aapka swagat hai!', Icon: Footprints, color: '#f59e0b' },
  { id: 'three-modules', name: 'Teertha Yatri', description: '3 modules complete kiye!', Icon: MapPin, color: '#22c55e' },
  { id: 'six-modules', name: 'Arthi Yoddha', description: '6 modules complete kiye!', Icon: Sword, color: '#3b82f6' },
  { id: 'all-modules', name: 'Finance Guru', description: 'Saare 11 modules complete!', Icon: Crown, color: '#f59e0b' },
  { id: 'perfect-quiz', name: 'Quiz Master', description: 'Kisi quiz mein 100% score!', Icon: Award, color: '#a855f7' },
  { id: 'streak-3', name: 'Consistent', description: '3 din streak!', Icon: Flame, color: '#ef4444' },
  { id: 'streak-7', name: 'Aag Lagi!', description: '7 din streak!', Icon: Zap, color: '#f97316' },
  { id: 'coins-100', name: 'Savings Start', description: '100 coins kamaye!', Icon: PiggyBank, color: '#14b8a6' },
  { id: 'coins-500', name: 'Coin Collector', description: '500 coins kamaye!', Icon: Trophy, color: '#f59e0b' },
  { id: 'swipe-master', name: 'Budget Pro', description: 'Budget Khel mein 80%+ accuracy!', Icon: Target, color: '#22c55e' },
  { id: 'debt-escape', name: 'Debt Se Azad', description: 'Debt Trap ke saare doors open kiye!', Icon: DoorOpen, color: '#6366f1' },
  { id: 'early-bird', name: 'Early Bird', description: 'Age 20 se invest start kiya!', Icon: Bird, color: '#06b6d4' },
];

// ── Helpers ──
function getIcon(iconName?: string): LucideIcon {
  if (!iconName) return Construction;
  const Icon = (LucideIcons as Record<string, LucideIcon>)[iconName];
  return Icon || Construction;
}

function getLevel(completed: number): { level: number; label: string; color: string } {
  if (completed >= 11) return { level: 5, label: 'Master', color: '#f59e0b' };
  if (completed >= 8) return { level: 4, label: 'Expert', color: '#22c55e' };
  if (completed >= 5) return { level: 3, label: 'Pro', color: '#3b82f6' };
  if (completed >= 2) return { level: 2, label: 'Learner', color: '#a855f7' };
  return { level: 1, label: 'Beginner', color: '#8888a0' };
}

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: 'A+', color: '#22c55e' };
  if (score >= 80) return { grade: 'A', color: '#4ade80' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b' };
  if (score >= 60) return { grade: 'C', color: '#f97316' };
  return { grade: 'D', color: '#ef4444' };
}

function getMotivationalMessage(completed: number, score: number): string {
  if (completed === 0) return 'Safar shuru karo — har bada safar ek kadam se start hota hai! 💪';
  if (completed <= 3) return 'Acchi shuruaat! Thoda aur mehnat karo toh financial samajh mazeed strong hogi! 🔥';
  if (completed <= 6) return 'Aadhe raste pe ho — wapas mat mudna, aage badhte raho! 🚀';
  if (completed <= 9) return 'Bahut strong progress! Ab toh finish line dikh rahi hai! 🏆';
  if (completed <= 10) return 'Bas ek aur module — tum almost Finance Guru ho! 🎯';
  return 'Tum ek sahi Finance Guru ho! Ab knowledge share karo aur doosron ko seekhao! 👑';
}

// ── Animated counter hook ──
function useAnimatedCounter(target: number, duration = 1000, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

// ── Confetti particle component ──
function ConfettiParticles({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    color: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '120vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

// ── Mini progress ring for strategy cards ──
function MiniProgressRing({ progress, size = 36, color = '#f59e0b', strokeWidth = 3 }: {
  progress: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

// ── Section wrapper with stagger animation ──
function DashboardSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`glass-surface p-5 rounded-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Section title ──
function SectionTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-[10px] text-[#8888a0]">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Financial Journey SVG Timeline ──
interface FinancialJourneySVGProps {
  modules: typeof import('@/lib/data/modules').modules;
  completedModules: number[];
  moduleProgress: Record<number, number>;
  moduleCompletionDates: Record<number, string>;
}

function FinancialJourneySVG({ modules: mods, completedModules: completed, moduleProgress: progress, moduleCompletionDates: dates }: FinancialJourneySVGProps) {
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const nodeSpacing = 56;
  const totalHeight = mods.length * nodeSpacing;
  const nodeRadius = 8;
  const lineX = 24;
  const cardStartX = 52;

  return (
    <div ref={containerRef} className="max-h-[480px] overflow-y-auto custom-scrollbar">
      <svg
        width="100%"
        viewBox={`0 0 320 ${totalHeight + 16}`}
        className="w-full"
        style={{ minWidth: 280 }}
      >
        <defs>
          <linearGradient id="timeline-gradient-completed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="timeline-gradient-incomplete" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#555" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#555" stopOpacity="0.15" />
          </linearGradient>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-amber">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {mods.map((mod, index) => {
          const y = 8 + index * nodeSpacing + nodeRadius;
          const isCompleted = completed.includes(mod.id);
          const modProgress = progress[mod.id] || 0;
          const isCurrent = !isCompleted && modProgress > 0;
          const nextY = index < mods.length - 1 ? 8 + (index + 1) * nodeSpacing + nodeRadius : null;

          const lineAnimated = animated ? 1 : 0;

          return (
            <g key={mod.id}>
              {/* Connecting line to next node */}
              {nextY !== null && (
                <motion.line
                  x1={lineX}
                  y1={y + nodeRadius}
                  x2={lineX}
                  y2={nextY - nodeRadius}
                  stroke={isCompleted ? 'url(#timeline-gradient-completed)' : 'url(#timeline-gradient-incomplete)'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: lineAnimated, opacity: lineAnimated }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: 'easeOut' }}
                />
              )}

              {/* Node circle - background glow for completed */}
              {isCompleted && (
                <motion.circle
                  cx={lineX}
                  cy={y}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={1}
                  opacity={0.2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
                />
              )}

              {/* Pulse ring for current module */}
              {isCurrent && (
                <motion.circle
                  cx={lineX}
                  cy={y}
                  r={nodeRadius + 6}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 + index * 0.06 }}
                />
              )}

              {/* Main node circle */}
              <motion.circle
                cx={lineX}
                cy={y}
                r={nodeRadius}
                fill={isCompleted ? '#22c55e' : isCurrent ? '#f59e0b' : '#333'}
                stroke={isCompleted ? '#22c55e' : isCurrent ? '#f59e0b' : '#555'}
                strokeWidth={isCompleted || isCurrent ? 2 : 1}
                filter={isCompleted ? 'url(#glow-green)' : isCurrent ? 'url(#glow-amber)' : undefined}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.15 + index * 0.06,
                }}
              />

              {/* Check icon inside completed node */}
              {isCompleted && (
                <motion.path
                  d={`M${lineX - 3.5} ${y} L${lineX - 1} ${y + 3} L${lineX + 4} ${y - 3}`}
                  fill="none"
                  stroke="white"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.3 }}
                />
              )}

              {/* Module number for incomplete */}
              {!isCompleted && !isCurrent && (
                <motion.text
                  x={lineX}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#888"
                  fontSize={8}
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.3 + index * 0.06 }}
                >
                  {mod.id}
                </motion.text>
              )}

              {/* Module title card */}
              <motion.g
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
              >
                <rect
                  x={cardStartX}
                  y={y - 14}
                  width={248}
                  height={28}
                  rx={8}
                  fill={isCompleted ? 'rgba(34,197,94,0.06)' : isCurrent ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)'}
                  stroke={isCompleted ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'}
                  strokeWidth={1}
                />
                <text
                  x={cardStartX + 10}
                  y={y + 1}
                  fill={isCompleted ? '#4ade80' : isCurrent ? '#fbbf24' : '#8888a0'}
                  fontSize={10}
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  {mod.title}
                </text>

                {/* Date or status on the right */}
                {isCompleted && dates[mod.id] && (
                  <text
                    x={cardStartX + 238}
                    y={y + 1}
                    textAnchor="end"
                    fill="#22c55e"
                    fontSize={8}
                    fontFamily="system-ui"
                    opacity={0.7}
                  >
                    {new Date(dates[mod.id]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </text>
                )}
                {isCurrent && (
                  <text
                    x={cardStartX + 238}
                    y={y + 1}
                    textAnchor="end"
                    fill="#f59e0b"
                    fontSize={8}
                    fontFamily="system-ui"
                    opacity={0.7}
                  >
                    {modProgress}%
                  </text>
                )}
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Progress Forecast Component ──
function ProgressForecast({ modulesCompleted, moduleCompletionDates }: {
  modulesCompleted: number;
  moduleCompletionDates: Record<number, string>;
}) {
  const forecast = useMemo(() => {
    if (modulesCompleted === 0) {
      return 'Jab pehla module complete karoge, tab pace calculate ho payegi! Shuru karo! 🚀';
    }
    if (modulesCompleted >= 11) {
      return 'Tumne saare modules complete kar liye! 🎉 Ab guru ho — doosron ko seekhao!';
    }

    // Calculate pace from completion dates
    const dates = Object.values(moduleCompletionDates).sort();
    if (dates.length < 2) {
      const remaining = 11 - modulesCompleted;
      return `Pehla module done! Agar roz ek module karte ho toh ~${remaining} din mein complete hoga. Lagte raho! 💪`;
    }

    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const daysDiff = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
    const modulesInPeriod = dates.length;
    const daysPerModule = daysDiff / modulesInPeriod;
    const remaining = 11 - modulesCompleted;
    const estimatedDaysLeft = Math.ceil(remaining * daysPerModule);

    const estimatedDate = new Date(Date.now() + estimatedDaysLeft * 24 * 60 * 60 * 1000);
    const formattedDate = estimatedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return `Tumhari current pace se, saare modules ${formattedDate} tak complete ho jayenge! (${estimatedDaysLeft} din lagenge) 📅`;
  }, [modulesCompleted, moduleCompletionDates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.0, duration: 0.4 }}
      className="mt-5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="text-xs font-bold text-white">Progress Forecast</span>
      </div>
      <p className="text-[11px] text-[#8888a0] leading-relaxed">{forecast}</p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN ACHIEVEMENT DASHBOARD
// ═══════════════════════════════════════════

interface AchievementDashboardProps {
  open: boolean;
  onClose: () => void;
}

export function AchievementDashboard({ open, onClose }: AchievementDashboardProps) {
  const {
    completedModules,
    moduleProgress,
    moduleCompletionDates,
    quizScores,
    coins,
    streak,
    badges,
    userName,
    masteredTerms,
    swipeScore,
    swipeTotal,
    debtDoorLevel,
    setActiveStrategy,
  } = useAppStore();

  const { modulesCompleted, completionPercentage, getModuleProgress, isModuleCompleted, getQuizAverage } = useProgress();
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Computed values ──
  const level = useMemo(() => getLevel(modulesCompleted), [modulesCompleted]);
  const displayName = userName || 'Seekho';

  const quizScoreValues = useMemo(() => Object.values(quizScores), [quizScores]);
  const quizAttempts = quizScoreValues.length;
  const avgQuizScore = getQuizAverage();
  const bestQuizScore = quizScoreValues.length > 0 ? Math.max(...quizScoreValues) : 0;

  // ── Financial Literacy Score calculation ──
  const flScore = useMemo(() => {
    const moduleBase = Math.min(completedModules.length * 5, 55);
    const quizBonus = Math.min(avgQuizScore / 10, 10);
    const termsBonus = Math.min(masteredTerms.length * 0.5, 15);
    const activityBonus = Math.min(streak * 2 + coins / 50, 20);
    return Math.min(Math.round(moduleBase + quizBonus + termsBonus + activityBonus), 100);
  }, [completedModules.length, avgQuizScore, masteredTerms.length, streak, coins]);

  const gradeInfo = useMemo(() => getGrade(flScore), [flScore]);

  // ── Animated counters ──
  const animatedFLScore = useAnimatedCounter(flScore, 1200, 600);
  const animatedCoins = useAnimatedCounter(coins, 800, 200);
  const animatedStreak = useAnimatedCounter(streak, 600, 300);
  const animatedModules = useAnimatedCounter(modulesCompleted, 800, 100);

  // ── Trigger confetti when score is high ──
  useEffect(() => {
    if (open && flScore >= 70) {
      const t = setTimeout(() => setShowConfetti(true), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowConfetti(false), 0);
      return () => clearTimeout(t);
    }
  }, [open, flScore]);

  // ── Days active estimation ──
  const daysActive = useMemo(() => {
    const uniqueDays = new Set<string>();
    // Simple heuristic: streak + completed modules give an idea
    return Math.max(streak, completedModules.length) + Math.floor(coins / 30);
  }, [streak, completedModules.length, coins]);

  // ── Estimated time to complete ──
  const estimatedTimeLeft = useMemo(() => {
    const remaining = 11 - completedModules.length;
    if (remaining === 0) return 'Complete ho gaya! 🎉';
    if (remaining <= 3) return `Bas ~${remaining * 2} ghante aur!`;
    if (remaining <= 6) return `Lagbhag ~${remaining * 2} ghante lagenge`;
    return `Lagbhag ~${Math.ceil(remaining * 1.5)} din lagenge`;
  }, [completedModules.length]);

  // ── Quiz chart data ──
  const quizChartData = useMemo(() => {
    return quizScoreValues.map((score, i) => ({
      name: `Q${i + 1}`,
      score,
    }));
  }, [quizScoreValues]);

  // ── Next steps ──
  const nextSteps = useMemo(() => {
    const steps: { label: string; action: string; strategyId: number; color: string }[] = [];
    
    // Find first incomplete module
    const incompleteModule = modules.find(m => !isModuleCompleted(m.id));
    if (incompleteModule) {
      // Find which strategy covers this module best
      const relatedStrategy = strategies.find(s => {
        // Simple mapping based on module topics
        if (incompleteModule.id <= 3 && s.id === 1) return true;
        if (incompleteModule.id === 4 && s.id === 4) return true;
        if (incompleteModule.id === 5 && s.id === 5) return true;
        if (incompleteModule.id === 6 && s.id === 6) return true;
        if (incompleteModule.id === 7 && s.id === 7) return true;
        if (incompleteModule.id === 8 && s.id === 8) return true;
        if (incompleteModule.id === 9 && s.id === 9) return true;
        if (incompleteModule.id === 10 && s.id === 10) return true;
        if (incompleteModule.id === 11 && s.id === 11) return true;
        return false;
      }) || strategies[0];
      
      steps.push({
        label: `Module complete karo: ${incompleteModule.title}`,
        action: 'Abhi seekho →',
        strategyId: relatedStrategy.id,
        color: incompleteModule.color,
      });
    }

    // Suggest quiz if quiz attempts are low
    if (quizAttempts < 3) {
      steps.push({
        label: 'Quiz attempt karo — score badhao!',
        action: 'Quiz khelo →',
        strategyId: 1,
        color: '#a855f7',
      });
    }

    // Suggest dictionary if terms mastered are low
    if (masteredTerms.length < 10) {
      steps.push({
        label: 'Financial terms seekho — Dictionary explore karo!',
        action: 'Dictionary kholo →',
        strategyId: 10,
        color: '#6366f1',
      });
    }

    // Suggest budget game
    if (swipeTotal < 20) {
      steps.push({
        label: 'Budget Khel khelo — financial awareness badhao!',
        action: 'Khel shuru →',
        strategyId: 5,
        color: '#f59e0b',
      });
    }

    return steps.slice(0, 3);
  }, [isModuleCompleted, quizAttempts, masteredTerms.length, swipeTotal]);

  // ── Handle strategy navigation ──
  const handleNavigate = useCallback((strategyId: number) => {
    setActiveStrategy(strategyId);
    onClose();
  }, [setActiveStrategy, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Full-screen Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 z-50 bg-[#0a0a0f]/98 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Confetti overlay */}
            <ConfettiParticles active={showConfetti} />

            {/* Header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Tumhara Dashboard</h2>
                  <p className="text-[10px] text-[#8888a0]">Poora progress ek nazar mein</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <ScrollArea className="flex-1">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-4xl mx-auto">

                {/* ═══════════════════════════════
                    A. HERO SECTION
                ═══════════════════════════════ */}
                <DashboardSection delay={0} className="relative overflow-hidden">
                  <div className="particle-bg" />
                  <div className="relative z-[1] flex flex-col sm:flex-row items-center gap-4">
                    {/* Avatar / Level badge */}
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
                        style={{
                          background: `linear-gradient(135deg, ${level.color}30, ${level.color}10)`,
                          border: `2px solid ${level.color}40`,
                        }}
                      >
                        <span style={{ color: level.color }}>{level.level}</span>
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${level.color}20`,
                          color: level.color,
                          border: `1px solid ${level.color}30`,
                        }}
                      >
                        {level.label}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
                        Namaste, <span className="text-gradient-gold">{displayName}</span>! 🙏
                      </h2>
                      <p className="text-sm text-[#8888a0] mb-3">
                        {getMotivationalMessage(modulesCompleted, flScore)}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-sm font-bold text-amber-400 tabular-nums">{animatedCoins} XP</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-400/10 border border-orange-400/20">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-sm font-bold text-orange-400 tabular-nums">{animatedStreak} Streak</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20">
                          <Calendar className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-sm font-bold text-green-400 tabular-nums">{daysActive} Din</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    B. PROGRESS OVERVIEW
                ═══════════════════════════════ */}
                <DashboardSection delay={0.1}>
                  <SectionTitle icon={TrendingUp} title="Progress Overview" subtitle="Kitna aage badhe ho" />
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Large progress ring */}
                    <div className="relative">
                      <ProgressRing progress={completionPercentage} size={120} strokeWidth={8} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white tabular-nums">{animatedModules}</span>
                        <span className="text-[10px] text-[#8888a0]">/ 11 modules</span>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full sm:w-auto">
                      <div className="stat-card">
                        <div className="text-xs text-[#8888a0] mb-1">Overall Progress</div>
                        <div className="text-xl font-black text-white tabular-nums">{completionPercentage}%</div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706]"
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                          />
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="text-xs text-[#8888a0] mb-1">Terms Mastered</div>
                        <div className="text-xl font-black text-[#6366f1] tabular-nums">{masteredTerms.length}</div>
                        <div className="text-[10px] text-[#8888a0] mt-1">Financial terms seekhe</div>
                      </div>
                      <div className="stat-card">
                        <div className="text-xs text-[#8888a0] mb-1">Quiz Average</div>
                        <div className="text-xl font-black text-[#a855f7] tabular-nums">{avgQuizScore}%</div>
                        <div className="text-[10px] text-[#8888a0] mt-1">{quizAttempts} attempts</div>
                      </div>
                      <div className="stat-card">
                        <div className="text-xs text-[#8888a0] mb-1">Time Left</div>
                        <div className="text-sm font-bold text-green-400">{estimatedTimeLeft}</div>
                      </div>
                    </div>
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    C. STRATEGY MASTERY
                ═══════════════════════════════ */}
                <DashboardSection delay={0.2}>
                  <SectionTitle icon={Star} title="Strategy Mastery" subtitle="12 strategies ka progress" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {strategies.map((strategy, index) => {
                      const Icon = getIcon(strategy.icon);
                      // Calculate strategy progress based on related module
                      const relatedModules = strategy.id <= 9 ? [strategy.id] : [strategy.id];
                      const strategyProgress = relatedModules.reduce((sum, modId) => sum + (moduleProgress[modId] || 0), 0) / relatedModules.length;
                      
                      return (
                        <motion.div
                          key={strategy.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
                          className="relative p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                          onClick={() => handleNavigate(strategy.id)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <MiniProgressRing progress={strategyProgress} size={36} color={strategy.color} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Icon className="w-3.5 h-3.5" style={{ color: strategy.color }} />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] font-semibold text-white truncate">{strategy.title}</div>
                              <div className="text-[9px] text-[#8888a0]">{Math.round(strategyProgress)}%</div>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: strategy.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${strategyProgress}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 + index * 0.04 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    D. MODULE PROGRESS TIMELINE
                ═══════════════════════════════ */}
                <DashboardSection delay={0.3}>
                  <SectionTitle icon={BookOpen} title="Module Progress" subtitle="11 modules ki journey" />
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-white/[0.06]" />

                    <div className="space-y-1">
                      {modules.map((mod, index) => {
                        const Icon = getIcon(mod.icon);
                        const completed = isModuleCompleted(mod.id);
                        const progress = getModuleProgress(mod.id);
                        const isCurrent = !completed && progress > 0;

                        return (
                          <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                            className="flex items-center gap-3 py-2 group"
                          >
                            {/* Timeline dot */}
                            <div className="relative z-10 shrink-0">
                              <div
                                className={`
                                  w-9 h-9 rounded-xl flex items-center justify-center border transition-colors
                                  ${completed
                                    ? 'bg-green-500/15 border-green-500/30'
                                    : isCurrent
                                    ? 'bg-amber-400/15 border-amber-400/30'
                                    : 'bg-white/[0.03] border-white/[0.06]'
                                  }
                                `}
                              >
                                {completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-400' : 'text-[#555]'}`} />
                                )}
                              </div>
                            </div>

                            {/* Module info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-xs font-semibold truncate ${
                                    completed ? 'text-green-400' : isCurrent ? 'text-amber-400' : 'text-[#8888a0]'
                                  }`}
                                >
                                  {mod.title}
                                </span>
                                <span className="text-[9px] text-[#555] shrink-0">#{mod.id}</span>
                                {completed && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 font-semibold shrink-0">
                                    Done ✓
                                  </span>
                                )}
                              </div>
                              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    completed
                                      ? 'bg-green-400'
                                      : 'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706]'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 + index * 0.04 }}
                                />
                              </div>
                            </div>

                            {/* Progress percentage */}
                            <span className="text-[10px] text-[#8888a0] tabular-nums shrink-0 w-8 text-right">
                              {progress}%
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    E. QUIZ PERFORMANCE
                ═══════════════════════════════ */}
                <DashboardSection delay={0.4}>
                  <SectionTitle icon={Target} title="Quiz Performance" subtitle="Kitna sahi jawab dete ho" />
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="stat-card">
                      <div className="text-[10px] text-[#8888a0] mb-1">Average Score</div>
                      <div className="text-xl font-black text-[#a855f7] tabular-nums">{avgQuizScore}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="text-[10px] text-[#8888a0] mb-1">Best Score</div>
                      <div className="text-xl font-black text-green-400 tabular-nums">{bestQuizScore}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="text-[10px] text-[#8888a0] mb-1">Total Attempts</div>
                      <div className="text-xl font-black text-amber-400 tabular-nums">{quizAttempts}</div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  {quizChartData.length > 0 ? (
                    <div className="h-32 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quizChartData} barCategoryGap={4}>
                          <XAxis
                            dataKey="name"
                            tick={{ fill: '#8888a0', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fill: '#8888a0', fontSize: 9 }}
                            axisLine={false}
                            tickLine={false}
                            width={28}
                          />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={28}>
                            {quizChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.score >= 80 ? '#22c55e' : entry.score >= 50 ? '#f59e0b' : '#ef4444'}
                                fillOpacity={0.8}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-[#8888a0] text-sm">
                      <Target className="w-8 h-8 mx-auto mb-2 text-[#555]" />
                      Koi quiz attempt nahi kiya abhi. Modules mein quiz karo!
                    </div>
                  )}
                </DashboardSection>

                {/* ═══════════════════════════════
                    F. FINANCIAL LITERACY SCORE
                ═══════════════════════════════ */}
                <DashboardSection delay={0.5} className="relative overflow-hidden">
                  <div className="particle-bg" />
                  <div className="relative z-[1]">
                    <SectionTitle icon={Award} title="Financial Literacy Score" subtitle="Tumhara overall financial samajh ka score" />

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Score ring */}
                      <div className="relative">
                        <svg width={140} height={140} className="-rotate-90">
                          <circle
                            cx={70} cy={70} r={58}
                            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10}
                          />
                          <motion.circle
                            cx={70} cy={70} r={58}
                            fill="none"
                            stroke={gradeInfo.color}
                            strokeWidth={10}
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 58}
                            initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 58 - (flScore / 100) * 2 * Math.PI * 58 }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            className="text-4xl font-black tabular-nums"
                            style={{ color: gradeInfo.color }}
                            key={animatedFLScore}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
                          >
                            {animatedFLScore}
                          </motion.span>
                          <span className="text-[10px] text-[#8888a0]">/ 100</span>
                        </div>
                      </div>

                      {/* Grade + breakdown */}
                      <div className="flex-1 w-full">
                        {/* Grade badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="text-3xl font-black px-4 py-2 rounded-xl"
                            style={{
                              color: gradeInfo.color,
                              background: `${gradeInfo.color}15`,
                              border: `2px solid ${gradeInfo.color}30`,
                            }}
                          >
                            {gradeInfo.grade}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">
                              {flScore >= 90 ? 'Outstanding!' : flScore >= 80 ? 'Excellent!' : flScore >= 70 ? 'Accha ja raha hai!' : flScore >= 60 ? 'Theek hai, aur mehnat karo' : 'Bohot seekhna baaki hai!'}
                            </div>
                            <div className="text-[10px] text-[#8888a0]">Financial Literacy Grade</div>
                          </div>
                        </div>

                        {/* Score breakdown */}
                        <div className="space-y-2">
                          {[
                            { label: 'Modules Complete', value: Math.min(completedModules.length * 5, 55), max: 55, color: '#22c55e' },
                            { label: 'Quiz Bonus', value: Math.round(Math.min(avgQuizScore / 10, 10)), max: 10, color: '#a855f7' },
                            { label: 'Terms Mastered', value: Math.round(Math.min(masteredTerms.length * 0.5, 15)), max: 15, color: '#6366f1' },
                            { label: 'Activity Bonus', value: Math.round(Math.min(streak * 2 + coins / 50, 20)), max: 20, color: '#f59e0b' },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                              <span className="text-[10px] text-[#8888a0] w-24 shrink-0">{item.label}</span>
                              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: item.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold tabular-nums w-10 text-right" style={{ color: item.color }}>
                                {item.value}/{item.max}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    G. BADGE SHOWCASE
                ═══════════════════════════════ */}
                <DashboardSection delay={0.6}>
                  <SectionTitle icon={Trophy} title="Badge Showcase" subtitle={`${badges.length} / ${BADGES.length} badges earned`} />
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(badges.length / BADGES.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.7 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-amber-400 shrink-0 tabular-nums">
                      {badges.length}/{BADGES.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {BADGES.map((badge, index) => {
                      const earned = badges.includes(badge.id);
                      const { Icon, color } = badge;

                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.03, duration: 0.25 }}
                          className={`
                            relative p-2.5 rounded-xl border text-center transition-all cursor-default
                            ${earned
                              ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'
                              : 'bg-white/[0.01] border-white/[0.03] opacity-35'
                            }
                          `}
                        >
                          {earned && (
                            <div
                              className="absolute inset-0 rounded-xl opacity-10"
                              style={{ boxShadow: `0 0 20px ${color}, 0 0 40px ${color}40` }}
                            />
                          )}
                          <div
                            className={`w-8 h-8 mx-auto mb-1.5 rounded-lg flex items-center justify-center ${earned ? '' : 'bg-white/[0.04]'}`}
                            style={earned ? { backgroundColor: `${color}15` } : {}}
                          >
                            {earned ? (
                              <Icon className="w-4 h-4" style={{ color }} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-[#555]" />
                            )}
                          </div>
                          <div className={`text-[9px] font-semibold truncate ${earned ? 'text-white' : 'text-[#555]'}`}>
                            {earned ? badge.name : '???'}
                          </div>
                          {earned && (
                            <div
                              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    H. STREAK CALENDAR
                ═══════════════════════════════ */}
                <DashboardSection delay={0.7}>
                  <SectionTitle icon={Flame} title="Streak Calendar" subtitle="7 din ka streak record" />
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const isActive = i < streak;
                      const isToday = i === Math.min(streak - 1, 6) && streak > 0;
                      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.06, type: 'spring', stiffness: 300 }}
                          className={`flex flex-col items-center gap-1.5 ${
                            isToday ? 'scale-110' : ''
                          }`}
                        >
                          <span className="text-[9px] text-[#8888a0]">{dayNames[i]}</span>
                          <div
                            className={`
                              w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all
                              ${isActive
                                ? isToday
                                  ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/10 border-orange-400/40 shadow-lg shadow-orange-400/10'
                                  : 'bg-orange-400/10 border-orange-400/20'
                                : 'bg-white/[0.02] border-white/[0.06]'
                              }
                            `}
                          >
                            {isActive ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.9 + i * 0.06 }}
                              >
                                <Flame className={`w-5 h-5 ${isToday ? 'text-orange-400' : 'text-orange-400/70'}`} />
                              </motion.div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
                            )}
                          </div>
                          {isToday && (
                            <span className="text-[8px] font-bold text-orange-400">TODAY</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  {streak >= 7 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-3 text-center text-xs text-amber-400 font-semibold"
                    >
                      🔥 7 din ka streak! Aag lagi hai! 🔥
                    </motion.div>
                  )}
                </DashboardSection>

                {/* ═══════════════════════════════
                    I. NEXT STEPS - "Aage kya karein"
                ═══════════════════════════════ */}
                <DashboardSection delay={0.8}>
                  <SectionTitle icon={ArrowRight} title="Aage Kya Karein?" subtitle="Abhi kya focus karna chahiye" />
                  <div className="space-y-2.5">
                    {nextSteps.length > 0 ? nextSteps.map((step, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                        onClick={() => handleNavigate(step.strategyId)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] transition-all group text-left"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${step.color}15` }}
                        >
                          <ArrowRight className="w-4 h-4" style={{ color: step.color }} />
                        </div>
                        <span className="text-xs font-medium text-[#e8e8ed] flex-1">{step.label}</span>
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 group-hover:opacity-100 opacity-70 transition-opacity"
                          style={{ backgroundColor: `${step.color}10`, color: step.color }}
                        >
                          {step.action}
                        </span>
                      </motion.button>
                    )) : (
                      <div className="text-center py-4 text-sm text-[#8888a0]">
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                        Tumne sab kuch complete kar liya! Ab knowledge share karo! 🏆
                      </div>
                    )}
                  </div>
                </DashboardSection>

                {/* ═══════════════════════════════
                    J. FINANCIAL JOURNEY TIMELINE
                ═══════════════════════════════ */}
                <DashboardSection delay={0.9} className="relative overflow-hidden">
                  <SectionTitle icon={Clock} title="Financial Journey Timeline" subtitle="Tumhari financial journey ka safar" />

                  {/* Achievement Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {/* Total Coins Earned */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 border-l-2 border-l-amber-400/60"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="text-[10px] text-[#8888a0]">Coins Earned</span>
                      </div>
                      <div className="text-xl font-black text-amber-400 tabular-nums">{animatedCoins}</div>
                      <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-amber-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((coins / 600) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
                        />
                      </div>
                    </motion.div>

                    {/* Modules Completed */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.4 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 border-l-2 border-l-green-400/60"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-green-400/10 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <span className="text-[10px] text-[#8888a0]">Modules Done</span>
                      </div>
                      <div className="text-xl font-black text-green-400 tabular-nums">{animatedModules}<span className="text-sm text-[#8888a0] font-normal">/11</span></div>
                      <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-green-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
                        />
                      </div>
                    </motion.div>

                    {/* Current Streak */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 border-l-2 border-l-orange-400/60"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-400/10 flex items-center justify-center">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <span className="text-[10px] text-[#8888a0]">Current Streak</span>
                      </div>
                      <div className="text-xl font-black text-orange-400 tabular-nums">{animatedStreak} <span className="text-sm text-[#8888a0] font-normal">din</span></div>
                      <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-orange-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((streak / 7) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.3 }}
                        />
                      </div>
                    </motion.div>

                    {/* Badges Earned */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.4 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 border-l-2 border-l-purple-400/60"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center">
                          <Trophy className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-[10px] text-[#8888a0]">Badges Earned</span>
                      </div>
                      <div className="text-xl font-black text-purple-400 tabular-nums">{badges.length}<span className="text-sm text-[#8888a0] font-normal">/{BADGES.length}</span></div>
                      <div className="mt-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-purple-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${(badges.length / BADGES.length) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.4 }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* SVG Timeline Visualization */}
                  <div className="relative">
                    <FinancialJourneySVG
                      modules={modules}
                      completedModules={completedModules}
                      moduleProgress={moduleProgress}
                      moduleCompletionDates={moduleCompletionDates}
                    />
                  </div>

                  {/* Milestone Cards */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-3">Milestones</h4>
                    {[
                      { threshold: 1, title: 'Financial Beginner', emoji: '🌱', description: 'Pehla module complete kiya — safar shuru ho gaya!' },
                      { threshold: 3, title: 'Smart Learner', emoji: '📚', description: '3 modules done — ab tum serious ho!' },
                      { threshold: 5, title: 'Money Master', emoji: '💰', description: '5 modules complete — paisa samajhne lage ho!' },
                      { threshold: 8, title: 'Finance Expert', emoji: '🏆', description: '8 modules done — expert level pe ho!' },
                      { threshold: 11, title: 'Rupaiya Guru', emoji: '👑', description: 'Saare 11 modules — tum ab Guru ho!' },
                    ].map((milestone, index) => {
                      const achieved = modulesCompleted >= milestone.threshold;
                      // Find the date when this milestone was reached
                      const milestoneDate = achieved
                        ? moduleCompletionDates[milestone.threshold]
                          ? new Date(moduleCompletionDates[milestone.threshold]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Achieved!'
                        : null;

                      return (
                        <motion.div
                          key={milestone.threshold}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5 + index * 0.08, duration: 0.3 }}
                          className={`
                            bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 transition-all
                            ${achieved ? 'border-l-2 border-l-green-400/60' : 'opacity-40'}
                          `}
                        >
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                            ${achieved ? 'bg-green-400/10' : 'bg-white/[0.04]'}
                          `}>
                            {achieved ? milestone.emoji : <Lock className="w-4 h-4 text-[#555]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${achieved ? 'text-white' : 'text-[#555]'}`}>
                                {milestone.title}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.04] text-[#8888a0] shrink-0">
                                {milestone.threshold} module{milestone.threshold > 1 ? 's' : ''}
                              </span>
                            </div>
                            <p className={`text-[10px] mt-0.5 ${achieved ? 'text-[#8888a0]' : 'text-[#444]'}`}>
                              {achieved ? milestone.description : 'Not yet achieved'}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            {achieved ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-green-400/70" />
                                <span className="text-[10px] text-green-400/80 font-medium tabular-nums">{milestoneDate}</span>
                              </div>
                            ) : (
                              <Lock className="w-4 h-4 text-[#333]" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress Forecast */}
                  <ProgressForecast
                    modulesCompleted={modulesCompleted}
                    moduleCompletionDates={moduleCompletionDates}
                  />
                </DashboardSection>

                {/* Bottom spacer */}
                <div className="h-4" />
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
