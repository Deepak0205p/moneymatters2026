'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Lock, ChevronRight, X, Sparkles, Lightbulb,
  User, BookOpen, Zap, Trophy, MapPin, Flame, Star, Play,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { modules } from '@/lib/data/modules';
import DynamicIcon from '@/components/shared/DynamicIcon';
import QuizCard from '@/components/shared/QuizCard';
import { DailyTipBanner } from '@/components/shared/DailyTipBanner';
import { quizQuestions } from '@/lib/data/quiz-data';
import { COLORS } from '@/lib/constants';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { StoryReader } from '@/components/shared/StoryReader';
import { moduleStories } from '@/lib/data/story-data';

// ─── Fun Facts (Hinglish Financial Trivia) ────────────────────────────────
const funFacts = [
  { id: 1, emoji: '🏦', text: 'India mein sirf 27% youth ka bank account hai!', position: 0 },
  { id: 2, emoji: '📈', text: 'SIP ₹500/mahine se ₹17 lakh ban sakte hain 20 saal mein!', position: 2 },
  { id: 3, emoji: '💳', text: 'Credit card ka minimum payment = debt trap ki shuruwat!', position: 4 },
  { id: 4, emoji: '🛡️', text: 'Emergency fund = 6 mahine ka kharcha safe rakhna!', position: 6 },
  { id: 5, emoji: '🧮', text: 'Rule of 72: 72 ÷ return rate = paisa double hone ke saal!', position: 8 },
];

// ─── Station Layout (zigzag S-curve positions) ────────────────────────────
// top% and left% within the path container. Module 1 at top, 11 at bottom.
const stationPositions = [
  { top: 4, left: 20 },    // 1  - left
  { top: 13, left: 78 },   // 2  - right
  { top: 22, left: 20 },   // 3  - left
  { top: 31, left: 78 },   // 4  - right
  { top: 40, left: 20 },   // 5  - left
  { top: 49, left: 78 },   // 6  - right
  { top: 58, left: 20 },   // 7  - left
  { top: 67, left: 78 },   // 8  - right
  { top: 76, left: 20 },   // 9  - left
  { top: 85, left: 78 },   // 10 - right
  { top: 94, left: 48 },   // 11 - center
];

// Fun fact positions (between station pairs, at the curve midpoint)
const factPositions = [
  { top: 8.5, left: 55 },   // between 1-2
  { top: 26.5, left: 45 },  // between 3-4
  { top: 44.5, left: 55 },  // between 5-6
  { top: 62.5, left: 45 },  // between 7-8
  { top: 80.5, left: 55 },  // between 9-10
];

// ─── SVG Road Path Builder ────────────────────────────────────────────────
function buildRoadPath(positions: { top: number; left: number }[]): string {
  if (positions.length < 2) return '';
  const p0 = positions[0];
  let d = `M ${p0.left} ${p0.top}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    const midTop = (prev.top + curr.top) / 2;
    d += ` C ${prev.left} ${midTop}, ${curr.left} ${midTop}, ${curr.left} ${curr.top}`;
  }
  return d;
}

// ─── Village SVG Illustration ─────────────────────────────────────────────
function VillageIllustration() {
  return (
    <svg viewBox="0 0 800 140" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
      {/* Sky glow */}
      <defs>
        <radialGradient id="villageSun" cx="70%" cy="30%" r="35%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="140" fill="url(#villageSun)" />

      {/* Sun */}
      <circle cx="560" cy="35" r="22" fill="#f59e0b" opacity="0.25" />
      <circle cx="560" cy="35" r="14" fill="#f59e0b" opacity="0.45" />

      {/* Distant hills */}
      <ellipse cx="200" cy="140" rx="320" ry="55" fill="#1a3a1a" opacity="0.25" />
      <ellipse cx="600" cy="140" rx="260" ry="45" fill="#1a3a1a" opacity="0.18" />

      {/* Hut 1 */}
      <polygon points="90,115 115,80 140,115" fill="#6b3f1f" opacity="0.45" />
      <rect x="100" y="115" width="28" height="22" fill="#4e2c12" opacity="0.45" />
      <rect x="108" y="122" width="8" height="10" fill="#f59e0b" opacity="0.15" />

      {/* Hut 2 */}
      <polygon points="230,120 255,88 280,120" fill="#6b3f1f" opacity="0.35" />
      <rect x="240" y="120" width="26" height="18" fill="#4e2c12" opacity="0.35" />
      <rect x="248" y="126" width="7" height="8" fill="#f59e0b" opacity="0.12" />

      {/* Tree 1 */}
      <circle cx="175" cy="100" r="16" fill="#2d5a2d" opacity="0.35" />
      <rect x="173" y="116" width="4" height="18" fill="#3a2a1a" opacity="0.35" />

      {/* Tree 2 */}
      <circle cx="440" cy="105" r="13" fill="#2d5a2d" opacity="0.25" />
      <rect x="438" y="118" width="4" height="14" fill="#3a2a1a" opacity="0.25" />

      {/* Tree 3 */}
      <circle cx="680" cy="108" r="11" fill="#2d5a2d" opacity="0.2" />
      <rect x="678" y="119" width="3" height="12" fill="#3a2a1a" opacity="0.2" />

      {/* Well */}
      <circle cx="340" cy="128" r="8" fill="none" stroke="#5c4a3a" strokeWidth="2" opacity="0.25" />
      <line x1="332" y1="120" x2="348" y2="120" stroke="#5c4a3a" strokeWidth="2" opacity="0.25" />

      {/* Field rows */}
      <line x1="0" y1="138" x2="800" y2="138" stroke="#2a4a2a" strokeWidth="0.8" opacity="0.15" />
      <line x1="0" y1="132" x2="800" y2="132" stroke="#2a4a2a" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

// ─── City Skyline SVG Illustration ────────────────────────────────────────
function CitySkyline() {
  return (
    <svg viewBox="0 0 800 180" className="w-full h-full" preserveAspectRatio="xMidYMin slice">
      {/* Night sky glow */}
      <defs>
        <radialGradient id="cityGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="180" fill="url(#cityGlow)" />

      {/* Building 1 - short */}
      <rect x="40" y="90" width="42" height="90" fill="#141e36" opacity="0.6" />
      <rect x="48" y="100" width="8" height="7" fill="#f59e0b" opacity="0.18" />
      <rect x="64" y="108" width="8" height="7" fill="#3b82f6" opacity="0.15" />
      <rect x="48" y="125" width="8" height="7" fill="#22c55e" opacity="0.12" />

      {/* Building 2 - medium */}
      <rect x="100" y="55" width="52" height="125" fill="#141e36" opacity="0.55" />
      <rect x="108" y="65" width="9" height="7" fill="#f59e0b" opacity="0.22" />
      <rect x="125" y="75" width="9" height="7" fill="#a855f7" opacity="0.15" />
      <rect x="108" y="90" width="9" height="7" fill="#3b82f6" opacity="0.18" />
      <rect x="140" y="60" width="9" height="7" fill="#f59e0b" opacity="0.15" />
      <rect x="125" y="105" width="9" height="7" fill="#22c55e" opacity="0.12" />

      {/* Building 3 */}
      <rect x="190" y="75" width="38" height="105" fill="#141e36" opacity="0.5" />
      <rect x="198" y="85" width="7" height="7" fill="#f59e0b" opacity="0.18" />
      <rect x="212" y="95" width="7" height="7" fill="#3b82f6" opacity="0.14" />

      {/* Building 4 - tallest */}
      <rect x="260" y="25" width="65" height="155" fill="#141e36" opacity="0.65" />
      <rect x="268" y="35" width="10" height="7" fill="#f59e0b" opacity="0.28" />
      <rect x="290" y="42" width="10" height="7" fill="#3b82f6" opacity="0.22" />
      <rect x="310" y="30" width="10" height="7" fill="#f59e0b" opacity="0.18" />
      <rect x="268" y="60" width="10" height="7" fill="#22c55e" opacity="0.15" />
      <rect x="290" y="70" width="10" height="7" fill="#f59e0b" opacity="0.2" />
      <rect x="310" y="55" width="10" height="7" fill="#a855f7" opacity="0.15" />
      {/* Antenna */}
      <line x1="292" y1="25" x2="292" y2="8" stroke="#3a3a5a" strokeWidth="2" opacity="0.4" />
      <circle cx="292" cy="6" r="3" fill="#ef4444" opacity="0.5" />

      {/* Building 5 */}
      <rect x="360" y="65" width="48" height="115" fill="#141e36" opacity="0.52" />
      <rect x="368" y="75" width="8" height="7" fill="#f59e0b" opacity="0.2" />
      <rect x="388" y="85" width="8" height="7" fill="#3b82f6" opacity="0.16" />
      <rect x="368" y="100" width="8" height="7" fill="#f59e0b" opacity="0.14" />

      {/* Building 6 */}
      <rect x="440" y="35" width="58" height="145" fill="#141e36" opacity="0.6" />
      <rect x="448" y="45" width="10" height="7" fill="#f59e0b" opacity="0.25" />
      <rect x="470" y="52" width="10" height="7" fill="#3b82f6" opacity="0.2" />
      <rect x="485" y="40" width="10" height="7" fill="#f59e0b" opacity="0.16" />
      <rect x="448" y="68" width="10" height="7" fill="#22c55e" opacity="0.14" />
      <rect x="470" y="78" width="10" height="7" fill="#f59e0b" opacity="0.2" />

      {/* Building 7 */}
      <rect x="530" y="80" width="42" height="100" fill="#141e36" opacity="0.48" />
      <rect x="538" y="90" width="8" height="7" fill="#f59e0b" opacity="0.16" />
      <rect x="554" y="100" width="8" height="7" fill="#a855f7" opacity="0.14" />

      {/* Building 8 */}
      <rect x="600" y="50" width="55" height="130" fill="#141e36" opacity="0.55" />
      <rect x="608" y="60" width="9" height="7" fill="#f59e0b" opacity="0.22" />
      <rect x="628" y="68" width="9" height="7" fill="#3b82f6" opacity="0.18" />
      <rect x="640" y="55" width="9" height="7" fill="#f59e0b" opacity="0.15" />
      <rect x="608" y="82" width="9" height="7" fill="#22c55e" opacity="0.12" />

      {/* Building 9 */}
      <rect x="690" y="70" width="45" height="110" fill="#141e36" opacity="0.5" />
      <rect x="698" y="80" width="8" height="7" fill="#f59e0b" opacity="0.18" />
      <rect x="714" y="90" width="8" height="7" fill="#3b82f6" opacity="0.14" />

      {/* Stars */}
      <circle cx="80" cy="15" r="1.2" fill="#f59e0b" opacity="0.45" />
      <circle cx="220" cy="10" r="1" fill="#f59e0b" opacity="0.35" />
      <circle cx="380" cy="18" r="1.4" fill="#3b82f6" opacity="0.35" />
      <circle cx="520" cy="8" r="1" fill="#f59e0b" opacity="0.4" />
      <circle cx="660" cy="14" r="1.2" fill="#f59e0b" opacity="0.35" />
      <circle cx="760" cy="22" r="0.8" fill="#a855f7" opacity="0.3" />
      <circle cx="150" cy="22" r="0.9" fill="#22c55e" opacity="0.25" />
      <circle cx="470" cy="5" r="1.1" fill="#f59e0b" opacity="0.3" />
    </svg>
  );
}

// ─── Progressive Buildings (between stations, getting taller) ─────────────
function ProgressiveBuildings({ stationIndex }: { stationIndex: number }) {
  // Buildings get taller as station index increases (village → city)
  const height = 20 + stationIndex * 8;
  const width = 16 + stationIndex * 2;
  const opacity = 0.08 + stationIndex * 0.03;
  const windows = Math.min(stationIndex, 4);

  return (
    <svg
      viewBox={`0 0 40 ${height + 10}`}
      className="absolute pointer-events-none"
      style={{
        width: width,
        height: height + 10,
        opacity: opacity,
      }}
    >
      <rect x="5" y="10" width={width - 10} height={height} fill="#1a2a4a" rx="1" />
      {Array.from({ length: windows }).map((_, i) => (
        <rect
          key={i}
          x={8 + (i % 2) * (width / 2 - 4)}
          y={14 + Math.floor(i / 2) * 8}
          width="4"
          height="3"
          fill="#f59e0b"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function LifePathMap() {
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [activeFact, setActiveFact] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showStoryReader, setShowStoryReader] = useState(false);

  const {
    completedModules,
    moduleProgress,
    completeModule,
    updateModuleProgress,
    addCoins,
    recordQuizScore,
    coins,
  } = useAppStore();
  const { isModuleCompleted, getModuleProgress } = useProgress();

  // Current module = first non-completed
  const currentModuleId = useMemo(() => {
    for (let i = 1; i <= 11; i++) {
      if (!completedModules.includes(i)) return i;
    }
    return 11;
  }, [completedModules]);

  const selectedModule = selectedModuleId ? modules.find((m) => m.id === selectedModuleId) : null;
  const moduleQuizzes = selectedModuleId ? quizQuestions.filter((q) => q.moduleId === selectedModuleId) : [];
  const moduleStory = selectedModuleId ? moduleStories.find((s) => s.moduleId === selectedModuleId) : null;

  // Build SVG road path
  const roadPath = useMemo(() => buildRoadPath(stationPositions), []);

  // Overall progress
  const overallProgress = useMemo(() => {
    const completed = completedModules.length;
    return Math.round((completed / 11) * 100);
  }, [completedModules]);

  const getStationStatus = (moduleId: number): 'completed' | 'current' | 'locked' => {
    if (completedModules.includes(moduleId)) return 'completed';
    if (moduleId === currentModuleId) return 'current';
    return 'locked';
  };

  const canAccessModule = (moduleId: number): boolean => {
    return moduleId <= currentModuleId || completedModules.includes(moduleId);
  };

  const handleStationClick = (moduleId: number) => {
    if (!canAccessModule(moduleId)) return;
    setSelectedModuleId(moduleId);
    setShowQuiz(false);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizComplete(false);
    setExpandedSubtopic(null);
    // Directly open story reader when clicking a station
    setShowStoryReader(true);
  };

  const handleStoryComplete = useCallback(() => {
    if (!selectedModuleId) return;
    updateModuleProgress(selectedModuleId, Math.min(100, (moduleProgress[selectedModuleId] || 0) + 50));
    addCoins(25);
  }, [selectedModuleId, updateModuleProgress, moduleProgress, addCoins]);

  const handleStoryClose = useCallback(() => {
    setShowStoryReader(false);
    // After closing story, the Sheet will re-show since selectedModuleId is still set
  }, []);

  const handleQuizAnswer = (selectedIndex: number) => {
    if (!selectedModuleId) return;
    const question = moduleQuizzes[quizIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    const newScore = isCorrect ? quizScore + 1 : quizScore;

    if (quizIndex < moduleQuizzes.length - 1) {
      setQuizScore(newScore);
      setQuizIndex((prev) => prev + 1);
    } else {
      // Quiz complete
      const finalScore = newScore;
      const percentage = Math.round((finalScore / moduleQuizzes.length) * 100);
      setQuizScore(finalScore);
      setQuizComplete(true);
      recordQuizScore(`module-${selectedModuleId}`, percentage);
      addCoins(Math.floor(percentage / 10) * 5);
      updateModuleProgress(selectedModuleId, Math.min(100, (moduleProgress[selectedModuleId] || 0) + 25));
      if (percentage >= 60) {
        completeModule(selectedModuleId);
      }
    }
  };

  return (
    <div className="dots-pattern relative min-h-screen bg-[#0a0a0f] overflow-x-hidden -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8">
      {/* ─── Subtle Grid Background ─── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ─── Background Gradient (village → city) ─── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(139,90,43,0.06) 0%, rgba(10,10,15,0) 12%, rgba(10,10,15,0) 88%, rgba(59,130,246,0.06) 100%)',
        }}
      />

      {/* ─── Header ─── */}
      <div className="strategy-header-gradient relative z-20 sticky top-0 bg-[#0a0a0f]/97 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/25 to-[#d97706]/15 border border-[#f59e0b]/30 animate-breath-glow">
              <MapPin size={18} className="text-[#f59e0b]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gradient-gold tracking-wide">Zindagi Ka Safar</h1>
              <p className="text-[11px] text-[#a0a0b8] font-medium">Gaon se Shehar tak — Financial Journey</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Coins */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 hover:bg-[#f59e0b]/15 transition-colors cursor-default">
              <Star size={12} className="text-[#f59e0b]" />
              <span className="text-[11px] font-bold text-[#f59e0b] number-highlight">{coins}</span>
            </div>
            {/* Overall progress */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-[#1a1a2e] rounded-full overflow-hidden border border-white/[0.04]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] progress-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#a0a0b8] number-highlight">{overallProgress}%</span>
            </div>
          </div>
        </div>
        {/* Journey progress indicator bar */}
        <div className="journey-progress-track">
          <motion.div
            className="journey-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ─── Daily Tip Banner ─── */}
      <DailyTipBanner />

      {/* ─── Path Container ─── */}
      <div className="relative max-w-2xl mx-auto particle-bg" style={{ minHeight: '3400px' }}>
        {/* ─── Village Illustration (Top) ─── */}
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none overflow-hidden z-[1]">
          <VillageIllustration />
          {/* Village label */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8b5a2b]/10 border border-[#8b5a2b]/20">
              <span className="text-xs">🏘️</span>
              <span className="text-[9px] font-semibold text-[#c9956b] tracking-wide uppercase">Gaon — Shuruwat</span>
            </div>
          </div>
        </div>

        {/* ─── SVG Winding Road ─── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="roadGlow">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Road glow (wide, blurry) */}
          <path d={roadPath} fill="none" stroke="#f59e0b" strokeWidth="1.8" opacity="0.08" filter="url(#roadGlow)" />

          {/* Road body (main stroke) */}
          <path d={roadPath} fill="none" stroke="url(#roadGradient)" strokeWidth="0.7" opacity="0.5" strokeLinecap="round" />

          {/* Road edge - left */}
          <path d={roadPath} fill="none" stroke="#f59e0b" strokeWidth="0.12" opacity="0.25" strokeDasharray="0.4 0.8" />

          {/* Road center dashes */}
          <path d={roadPath} fill="none" stroke="#fbbf24" strokeWidth="0.12" opacity="0.35" strokeDasharray="0.3 0.7" />

          {/* Milestone dots along the path */}
          {stationPositions.map((pos, i) => (
            <circle
              key={`mile-${i}`}
              cx={pos.left}
              cy={pos.top}
              r="0.25"
              fill="#f59e0b"
              opacity="0.2"
            />
          ))}
        </svg>

        {/* ─── Progressive Building Silhouettes ─── */}
        {stationPositions.map((pos, i) => {
          if (i < 2 || i > 9) return null; // Only middle stations get buildings
          return (
            <div
              key={`building-${i}`}
              className="absolute pointer-events-none z-[1]"
              style={{
                top: `${pos.top}%`,
                left: i % 2 === 0 ? '3%' : 'auto',
                right: i % 2 === 0 ? 'auto' : '3%',
                transform: 'translateY(-50%)',
              }}
            >
              <ProgressiveBuildings stationIndex={i} />
            </div>
          );
        })}

        {/* ─── Station Nodes ─── */}
        {modules.map((module, index) => {
          const pos = stationPositions[index];
          const status = getStationStatus(module.id);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          const progress = getModuleProgress(module.id);

          return (
            <motion.div
              key={module.id}
              className="absolute z-10"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 280, damping: 22 }}
            >
              {/* Pulsing glow ring for current station */}
              {isCurrent && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 96,
                      height: 96,
                      top: -20,
                      left: -20,
                      border: `2px solid ${module.color}`,
                    }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 80,
                      height: 80,
                      top: -12,
                      left: -12,
                      border: `1.5px solid ${module.color}`,
                    }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  />
                </>
              )}

              {/* Completed glow */}
              {isCompleted && (
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 88,
                    height: 88,
                    top: -16,
                    left: -16,
                    background: `radial-gradient(circle, ${module.color}15 0%, transparent 70%)`,
                  }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* User avatar at current station */}
              {isCurrent && (
                <motion.div
                  className="absolute z-20"
                  style={{ top: -34, left: '50%', transform: 'translateX(-50%)' }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="flex items-center justify-center rounded-full shadow-lg"
                    style={{
                      width: 28,
                      height: 28,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      boxShadow: '0 0 16px rgba(245,158,11,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <User size={14} className="text-black" strokeWidth={2.5} />
                  </div>
                </motion.div>
              )}

              {/* Station circle button */}
              <motion.button
                className={`
                  relative flex items-center justify-center rounded-full min-w-[44px] min-h-[44px]
                  ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  width: 56,
                  height: 56,
                  background: isCompleted
                    ? `linear-gradient(135deg, ${module.color}30, ${module.color}10)`
                    : isCurrent
                    ? `linear-gradient(135deg, ${module.color}40, ${module.color}18)`
                    : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isCompleted ? module.color : isCurrent ? module.color : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isCompleted
                    ? `0 0 28px ${module.color}35, 0 0 56px ${module.color}15, inset 0 0 12px ${module.color}08`
                    : isCurrent
                    ? `0 0 36px ${module.color}45, 0 0 72px ${module.color}20, inset 0 0 12px ${module.color}10`
                    : isLocked
                    ? '0 0 4px rgba(255,255,255,0.02)'
                    : 'none',
                  opacity: isLocked ? 0.35 : 1,
                }}
                whileHover={!isLocked ? { scale: 1.15, boxShadow: `0 0 32px ${module.color}40` } : {}}
                whileTap={!isLocked ? { scale: 0.92 } : {}}
                onClick={() => handleStationClick(module.id)}
              >
                {/* Module number badge */}
                <div
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[9px] font-black"
                  style={{
                    width: 20,
                    height: 20,
                    background: isCompleted
                      ? module.color
                      : isCurrent
                      ? module.color
                      : '#2a2a3a',
                    color: isCompleted || isCurrent ? '#000' : '#666',
                    boxShadow: isCompleted || isCurrent ? `0 0 8px ${module.color}50` : 'none',
                  }}
                >
                  {module.id}
                </div>

                {/* Icon */}
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle2 size={24} style={{ color: module.color }} strokeWidth={2} />
                  </motion.div>
                ) : isLocked ? (
                  <Lock size={18} className="text-gray-600" />
                ) : (
                  <DynamicIcon name={module.icon} size={22} style={{ color: module.color }} />
                )}
              </motion.button>

              {/* Floating emoji decoration near station */}
              {isCurrent && (
                <motion.div
                  className="absolute z-30 pointer-events-none"
                  style={{ top: -16, left: 36 }}
                  animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-lg drop-shadow-lg">✨</span>
                </motion.div>
              )}
              {isCompleted && (
                <motion.div
                  className="absolute z-30 pointer-events-none"
                  style={{ top: -12, left: 34 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                >
                  <span className="text-sm">🌟</span>
                </motion.div>
              )}

              {/* Station label */}
              <div
                className="absolute top-full mt-2 text-center w-24 sm:w-32"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              >
                <p
                  className="text-[9px] sm:text-xs font-bold leading-tight"
                  style={{ color: isCompleted ? module.color : isCurrent ? '#f59e0b' : '#555' }}
                >
                  {module.title}
                </p>
                {isCompleted && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] text-emerald-400 mt-0.5 font-semibold"
                  >
                    ✓ Complete
                  </motion.p>
                )}
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] text-[#f59e0b] mt-0.5 font-medium"
                  >
                    Yahan se shuru karo →
                  </motion.p>
                )}
                {isLocked && (
                  <p className="text-[8px] text-gray-600 mt-0.5">Pehle pehle karo ↑</p>
                )}
                {/* Mini progress bar */}
                {!isLocked && !isCompleted && progress > 0 && (
                  <div className="mt-1 mx-auto w-16 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: module.color }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* ─── Fun Fact Pit Stops ─── */}
        {funFacts.map((fact, index) => {
          const pos = factPositions[index];
          return (
            <motion.div
              key={fact.id}
              className="absolute z-10 cursor-pointer"
              style={{
                top: `${pos.top}%`,
                left: `${pos.left}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, type: 'spring', stiffness: 300 }}
              onClick={() => setActiveFact(activeFact === fact.id ? null : fact.id)}
            >
              {/* Pit stop circle */}
              <motion.div
                className="flex items-center justify-center rounded-full min-w-[44px] min-h-[44px]"
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(245,158,11,0.06)',
                  border: '1.5px dashed rgba(245,158,11,0.3)',
                }}
                whileHover={{ scale: 1.15, borderColor: 'rgba(245,158,11,0.6)' }}
                animate={{ rotate: [0, 360] }}
                transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
              >
                <span className="text-base select-none">{fact.emoji}</span>
              </motion.div>

              {/* Fact label */}
              <p className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[7px] text-[#8888a0] font-semibold tracking-wider uppercase whitespace-nowrap">
                Pit Stop
              </p>

              {/* Fun fact tooltip */}
              <AnimatePresence>
                {activeFact === fact.id && (
                  <motion.div
                    className="absolute z-50"
                    style={{
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: 20,
                      width: 240,
                    }}
                    initial={{ opacity: 0, y: -8, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="rounded-xl bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] p-3.5 shadow-2xl backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Lightbulb size={11} className="text-[#f59e0b]" />
                        <span className="text-[8px] font-black text-[#f59e0b] tracking-widest uppercase">
                          Fun Fact
                        </span>
                      </div>
                      <p className="text-[11px] text-[#e8e8ed] leading-relaxed">{fact.text}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* ─── City Skyline (Bottom) ─── */}
        <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none overflow-hidden z-[1]">
          <CitySkyline />
          {/* City label */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20">
              <span className="text-xs">🏙️</span>
              <span className="text-[9px] font-semibold text-[#6ea8fe] tracking-wide uppercase">
                Shehar — Destination
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Module Detail Sheet ─── */}
      <Sheet open={selectedModuleId !== null && !showStoryReader} onOpenChange={(open) => { if (!open) { setSelectedModuleId(null); setShowStoryReader(false); } }}>
        <SheetContent
          className="w-[92vw] sm:w-[480px] bg-[#0f0f18] border-l border-[rgba(255,255,255,0.06)] p-0"
          style={{ maxWidth: '480px' }}
        >
          {selectedModule && (
            <ScrollArea className="h-full">
              <div className="slide-up-reveal p-5 pt-10 pb-8">
                {/* Module Header */}
                <div className="flex items-start gap-3.5 mb-5">
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      background: `${selectedModule.color}14`,
                      border: `1.5px solid ${selectedModule.color}30`,
                    }}
                  >
                    <DynamicIcon name={selectedModule.icon} size={26} style={{ color: selectedModule.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-[#e8e8ed]">{selectedModule.title}</h2>
                      {completedModules.includes(selectedModule.id) && (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[9px] px-1.5 py-0">
                          <CheckCircle2 size={10} className="mr-0.5" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#8888a0] mt-1 leading-relaxed">{selectedModule.description}</p>
                  </div>
                </div>

                {/* Progress bar */}
                {!completedModules.includes(selectedModule.id) && (
                  <div className="mb-5 px-3 py-2.5 rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-[#8888a0]">Progress</span>
                      <span className="text-[10px] font-bold text-[#f59e0b]">
                        {Math.round(getModuleProgress(selectedModule.id))}%
                      </span>
                    </div>
                    <Progress value={getModuleProgress(selectedModule.id)} className="h-1.5 bg-[#1a1a2e]" />
                  </div>
                )}

                {/* Completed banner */}
                {completedModules.includes(selectedModule.id) && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">Module Complete! 🎉</span>
                  </motion.div>
                )}

                {/* ─── Story Mode Launch Card ─── */}
                {moduleStory && canAccessModule(selectedModule.id) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-5"
                  >
                    <button
                      onClick={() => setShowStoryReader(true)}
                      className="w-full rounded-xl p-4 text-left transition-all duration-300 border border-amber-500/25 hover:border-amber-500/50 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 50%, rgba(168,85,247,0.05) 100%)',
                        boxShadow: '0 0 30px rgba(245,158,11,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Story icon */}
                        <div className="relative shrink-0">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(168,85,247,0.15) 100%)',
                              border: '1.5px solid rgba(245,158,11,0.3)',
                            }}
                          >
                            <span className="text-2xl">{moduleStory.characterEmoji}</span>
                          </div>
                          {/* Play badge */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 10px rgba(245,158,11,0.4)' }}>
                            <Play size={10} className="text-[#0a0a0f] ml-0.5" fill="#0a0a0f" />
                          </div>
                        </div>
                        {/* Story info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-400/70">Story Mode</span>
                            <span className="text-amber-400/40">•</span>
                            <span className="text-[8px] font-medium text-[#8888a0]">{moduleStory.chapters.length} chapters</span>
                          </div>
                          <h4
                            className="text-sm font-bold truncate"
                            style={{
                              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {moduleStory.storyTitle}
                          </h4>
                          <p className="text-[10px] text-[#8888a0] truncate mt-0.5">{moduleStory.storySubtitle}</p>
                        </div>
                        {/* Arrow */}
                        <div className="shrink-0 text-amber-400/40 group-hover:text-amber-400 transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )}

                {/* ─── Subtopics ─── */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-[#e8e8ed] mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <BookOpen size={13} className="text-[#f59e0b]" />
                    Subtopics
                  </h3>
                  <div className="space-y-1.5">
                    {selectedModule.subtopics.map((sub) => (
                      <div
                        key={sub.id}
                        className="rounded-lg border border-[rgba(255,255,255,0.05)] bg-[#12121a] overflow-hidden"
                      >
                        <button
                          className="w-full px-3 py-2.5 text-left flex items-center gap-2 hover:bg-[#1a1a2e] transition-colors"
                          onClick={() => setExpandedSubtopic(expandedSubtopic === sub.id ? null : sub.id)}
                        >
                          <ChevronRight
                            size={13}
                            className="text-[#8888a0] shrink-0 transition-transform duration-200"
                            style={{ transform: expandedSubtopic === sub.id ? 'rotate(90deg)' : 'rotate(0)' }}
                          />
                          <span className="text-xs font-medium text-[#e8e8ed] flex-1">{sub.title}</span>
                          {sub.hasQuiz && (
                            <Badge className="text-[7px] bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 px-1.5 py-0 shrink-0">
                              Quiz
                            </Badge>
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedSubtopic === sub.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-3 pb-3 pt-1 text-xs text-[#aaaabc] leading-relaxed border-t border-[rgba(255,255,255,0.03)]"
                                dangerouslySetInnerHTML={{ __html: sub.content }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── Key Takeaways ─── */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-[#e8e8ed] mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Zap size={13} className="text-[#f59e0b]" />
                    Key Takeaways
                  </h3>
                  <div className="space-y-2">
                    {selectedModule.keyTakeaways.map((takeaway, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-2.5 items-start"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                        <p className="text-xs text-[#c0c0d0] leading-relaxed">{takeaway}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ─── Misconceptions ─── */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-[#e8e8ed] mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles size={13} className="text-[#f59e0b]" />
                    Myth vs Truth
                  </h3>
                  <div className="space-y-2.5">
                    {selectedModule.misconceptions.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-[#12121a] border border-[rgba(255,255,255,0.05)] p-3"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">
                            Myth
                          </span>
                          <p className="text-xs text-[#8888a0] leading-relaxed">{m.myth}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">
                            Truth
                          </span>
                          <p className="text-xs text-[#c0c0d0] leading-relaxed">{m.truth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── Quiz Section ─── */}
                {moduleQuizzes.length > 0 && canAccessModule(selectedModule.id) && (
                  <div className="mb-6">
                    {!showQuiz ? (
                      <Button
                        className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-black hover:from-[#fbbf24] hover:to-[#f59e0b] h-11 text-sm shadow-lg shadow-[#f59e0b]/20"
                        onClick={() => {
                          setShowQuiz(true);
                          setQuizIndex(0);
                          setQuizScore(0);
                          setQuizComplete(false);
                        }}
                      >
                        <Trophy size={16} className="mr-2" />
                        Quiz Khelo ({moduleQuizzes.length} Sawaal)
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#e8e8ed]">
                            Sawaal {quizIndex + 1}/{moduleQuizzes.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 text-[10px]">
                              <Flame size={10} className="mr-0.5" />
                              {quizScore} Correct
                            </Badge>
                          </div>
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-1.5">
                          {moduleQuizzes.map((_, i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all"
                              style={{
                                background:
                                  i < quizIndex
                                    ? '#22c55e'
                                    : i === quizIndex
                                    ? '#f59e0b'
                                    : '#1a1a2e',
                              }}
                            />
                          ))}
                        </div>

                        {!quizComplete ? (
                          <QuizCard
                            key={moduleQuizzes[quizIndex].id}
                            question={moduleQuizzes[quizIndex]}
                            onAnswer={handleQuizAnswer}
                          />
                        ) : (
                          <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="text-center py-8 rounded-xl bg-[#12121a] border border-[rgba(255,255,255,0.06)]"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
                            >
                              <Trophy size={44} className="text-[#f59e0b] mx-auto mb-3" />
                            </motion.div>
                            <h3 className="text-lg font-black text-[#e8e8ed]">Quiz Complete! 🎉</h3>
                            <p className="text-sm text-[#8888a0] mt-1.5">
                              Score: <span className="text-[#f59e0b] font-bold">{quizScore}</span>/{moduleQuizzes.length}
                            </p>
                            <p className="text-xs text-[#8888a0] mt-1">
                              {quizScore >= moduleQuizzes.length * 0.6
                                ? '🎉 Module complete ho gaya! +50 coins!'
                                : '💪 Aur practice karo — next time pakka!'}
                            </p>
                            <Button
                              className="mt-4 bg-[#f59e0b] text-black font-bold hover:bg-[#fbbf24] text-xs"
                              onClick={() => setShowQuiz(false)}
                              size="sm"
                            >
                              Wapas Module Dekho
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Story Reader Overlay ─── */}
      <AnimatePresence>
        {showStoryReader && moduleStory && (
          <StoryReader
            story={moduleStory}
            onComplete={handleStoryComplete}
            onClose={handleStoryClose}
            isModuleCompleted={completedModules.includes(selectedModuleId || 0)}
            currentProgress={selectedModuleId ? getModuleProgress(selectedModuleId) : 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
