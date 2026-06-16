'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MILESTONES } from '@/lib/constants';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAppStore } from '@/lib/store/useAppStore';
import { getFinancialHealthScore } from '@/lib/utils';
import ProgressRing from '@/components/shared/ProgressRing';
import StatCard from '@/components/shared/StatCard';
import { MapPin, Car, Navigation, Trophy, AlertTriangle, Flag, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Road SVG Dimensions ────────────────────────────────
const ROAD_WIDTH = 900;
const ROAD_HEIGHT = 160;
const ROAD_Y = 60;
const CAR_Y_OFFSET = -18;

// ─── Milestone tooltip ──────────────────────────────────
interface MilestoneTooltipProps {
  milestone: typeof MILESTONES[number];
  x: number;
  visible: boolean;
}

function MilestoneTooltip({ milestone, x, visible }: MilestoneTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{ left: x, top: -70 }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="bg-[#1a1a2e] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 shadow-xl min-w-[200px] max-w-[260px]">
            <p className="text-sm font-semibold text-[#f59e0b] mb-1">{milestone.label}</p>
            <p className="text-xs text-[#a0a0b8] leading-relaxed font-medium">{milestone.description}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <div className="h-1 flex-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#f59e0b]"
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] text-[#a0a0b8] font-medium">{milestone.percentage}%</span>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="flex justify-center -mt-px">
            <div className="w-3 h-3 rotate-45 bg-[#1a1a2e] border-b border-r border-[rgba(255,255,255,0.12)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Direction Label ────────────────────────────────────
function getDirection(percentage: number): { label: string; emoji: string; color: string } {
  if (percentage === 0) return { label: 'Abhi shuru nahi kiya!', emoji: '🧭', color: '#ef4444' };
  if (percentage < 25) return { label: 'Debt Trap se niklo!', emoji: '⚠️', color: '#ef4444' };
  if (percentage < 50) return { label: 'Sahi raste pe ho!', emoji: '🚶', color: '#f59e0b' };
  if (percentage < 75) return { label: 'Accha progress ho raha!', emoji: '🏃', color: '#f59e0b' };
  if (percentage < 100) return { label: 'Freedom qareeb hai!', emoji: '🚀', color: '#22c55e' };
  return { label: 'Financial Freedom mila! 🎉', emoji: '🏆', color: '#22c55e' };
}

// ─── Main Component ─────────────────────────────────────
export default function FinancialGPS() {
  const { completionPercentage, modulesCompleted, getQuizAverage } = useProgress();
  const { completedModules, quizScores } = useAppStore();
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  const healthScore = useMemo(
    () => getFinancialHealthScore(completedModules, quizScores),
    [completedModules, quizScores]
  );
  const direction = getDirection(completionPercentage);

  // Car position on the road
  const carX = useMemo(() => {
    const padding = 40;
    const travelWidth = ROAD_WIDTH - padding * 2;
    return padding + (completionPercentage / 100) * travelWidth;
  }, [completionPercentage]);

  // Milestone positions
  const milestonePositions = useMemo(() => {
    const padding = 40;
    const travelWidth = ROAD_WIDTH - padding * 2;
    return MILESTONES.map((m) => ({
      ...m,
      x: padding + (m.percentage / 100) * travelWidth,
    }));
  }, []);

  const handleMilestoneClick = (id: number) => {
    setActiveMilestone((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-6">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navigation className="text-[#f59e0b]" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold text-gradient-gold">Paise Ka GPS</h2>
        </motion.div>
        <motion.p
          className="text-sm text-[#a0a0b8] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Tumhara financial health kahan hai? Road map dekho aur samjho!
        </motion.p>
      </div>

      {/* ─── SVG Road ───────────────────────────────────── */}
      <motion.div
        className="w-full overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="min-w-0 sm:min-w-[700px] relative" style={{ maxWidth: ROAD_WIDTH, margin: '0 auto' }}>
          <svg
            viewBox={`0 0 ${ROAD_WIDTH} ${ROAD_HEIGHT + 40}`}
            className="w-full h-auto max-w-full"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }}
          >
            {/* ── Zone backgrounds ──────────────────────── */}
            {/* Red zone (left) */}
            <rect x="0" y="0" width={ROAD_WIDTH * 0.3} height={ROAD_HEIGHT + 40} fill="url(#redZone)" opacity="0.15" rx="8" />
            {/* Green zone (right) */}
            <rect x={ROAD_WIDTH * 0.7} y="0" width={ROAD_WIDTH * 0.3} height={ROAD_HEIGHT + 40} fill="url(#greenZone)" opacity="0.15" rx="8" />

            {/* ── Road surface ─────────────────────────── */}
            <rect
              x="20"
              y={ROAD_Y}
              width={ROAD_WIDTH - 40}
              height={50}
              rx="25"
              fill="url(#roadGradient)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* ── Road dashes (center line) ────────────── */}
            {Array.from({ length: 22 }).map((_, i) => (
              <rect
                key={`dash-${i}`}
                x={50 + i * 38}
                y={ROAD_Y + 23}
                width={20}
                height={4}
                rx="2"
                fill="rgba(255,255,255,0.3)"
              />
            ))}

            {/* ── Zone Labels ──────────────────────────── */}
            {/* Debt Trap (left) */}
            <g transform={`translate(70, ${ROAD_Y + 25})`}>
              <AlertTriangle size={14} fill="#ef4444" color="#ef4444" />
            </g>
            <text
              x="95"
              y={ROAD_Y + 30}
              className="text-[11px] font-bold"
              fill="#ef4444"
              style={{ fontFamily: 'system-ui' }}
            >
              DEBT TRAP
            </text>

            {/* Financial Freedom (right) */}
            <g transform={`translate(${ROAD_WIDTH - 170}, ${ROAD_Y + 25})`}>
              <Flag size={14} fill="#22c55e" color="#22c55e" />
            </g>
            <text
              x={ROAD_WIDTH - 150}
              y={ROAD_Y + 30}
              className="text-[11px] font-bold"
              fill="#22c55e"
              style={{ fontFamily: 'system-ui' }}
            >
              FINANCIAL FREEDOM
            </text>

            {/* ── Milestones ──────────────────────────── */}
            {milestonePositions.map((m) => {
              const isReached = completionPercentage >= m.percentage;
              return (
                <g
                  key={m.id}
                  className="cursor-pointer"
                  onClick={() => handleMilestoneClick(m.id)}
                >
                  {/* Milestone marker */}
                  <circle
                    cx={m.x}
                    cy={ROAD_Y + 50}
                    r={isReached ? 8 : 6}
                    fill={isReached ? '#f59e0b' : '#2a2a3e'}
                    stroke={isReached ? '#f59e0b' : '#444460'}
                    strokeWidth="2"
                  />
                  {isReached && (
                    <text
                      x={m.x}
                      y={ROAD_Y + 53}
                      textAnchor="middle"
                      fill="#0a0a0f"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  )}
                  {/* Road sign marker above milestone */}
                  {isReached && (
                    <g transform={`translate(${m.x}, ${ROAD_Y - 15})`}>
                      <rect x="-12" y="-12" width="24" height="14" rx="2" fill="#f59e0b" opacity="0.8" />
                      <text x="0" y="-3" textAnchor="middle" fill="#0a0a0f" fontSize="6" fontWeight="bold">
                        {m.percentage}%
                      </text>
                      {/* Sign post */}
                      <line x1="0" y1="2" x2="0" y2="10" stroke="#f59e0b" strokeWidth="1.5" />
                    </g>
                  )}
                  {/* Milestone label */}
                  <text
                    x={m.x}
                    y={ROAD_Y + 72}
                    textAnchor="middle"
                    className="text-[9px]"
                    fill={isReached ? '#e8e8ed' : '#666680'}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    {m.label.length > 18 ? m.label.slice(0, 18) + '…' : m.label}
                  </text>
                  {/* Percentage label */}
                  <text
                    x={m.x}
                    y={ROAD_Y + 84}
                    textAnchor="middle"
                    className="text-[8px]"
                    fill={isReached ? '#f59e0b' : '#555570'}
                    style={{ fontFamily: 'system-ui' }}
                  >
                    {m.percentage}%
                  </text>
                </g>
              );
            })}

            {/* ── Car ──────────────────────────────────── */}
            <motion.g
              animate={{ x: carX, y: ROAD_Y + CAR_Y_OFFSET }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              initial={{ x: 40, y: ROAD_Y + CAR_Y_OFFSET }}
            >
              {/* Car shadow */}
              <ellipse cx="0" cy="14" rx="16" ry="4" fill="rgba(0,0,0,0.3)" />
              {/* Car body */}
              <rect x="-18" y="-2" width="36" height="14" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              {/* Car roof */}
              <rect x="-10" y="-10" width="20" height="10" rx="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
              {/* Windshield */}
              <rect x="-7" y="-8" width="14" height="6" rx="2" fill="rgba(59,130,246,0.5)" />
              {/* Wheels */}
              <circle cx="-10" cy="12" r="4" fill="#1a1a2e" stroke="#444460" strokeWidth="1" />
              <circle cx="10" cy="12" r="4" fill="#1a1a2e" stroke="#444460" strokeWidth="1" />
              {/* Headlight */}
              <circle cx="17" cy="4" r="2" fill="#fef3c7" opacity="0.9" />
              {/* Tail light */}
              <circle cx="-17" cy="4" r="1.5" fill="#ef4444" opacity="0.8" />
            </motion.g>

            {/* ── Gradient Definitions ─────────────────── */}
            <defs>
              <linearGradient id="roadGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="20%" stopColor="#991b1b" />
                <stop offset="40%" stopColor="#78350f" />
                <stop offset="60%" stopColor="#365314" />
                <stop offset="80%" stopColor="#166534" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
              <linearGradient id="redZone" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="greenZone" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>

          {/* ── Milestone Tooltips (HTML overlay) ─────── */}
          {milestonePositions.map((m) => (
            <MilestoneTooltip
              key={`tooltip-${m.id}`}
              milestone={m}
              x={m.x}
              visible={activeMilestone === m.id}
            />
          ))}
        </div>
      </motion.div>

      {/* ─── Progress + Health Score Row ──────────────── */}
      <div className="w-full glow-line mb-4" />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ProgressRing
            progress={healthScore}
            size={100}
            color={healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#f59e0b' : '#ef4444'}
          />
          <span className="text-xs text-[#a0a0b8] font-medium">Health Score</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ProgressRing
            progress={completionPercentage}
            size={100}
            color="#f59e0b"
          />
          <span className="text-xs text-[#a0a0b8] font-medium">Journey Progress</span>
        </motion.div>
      </div>

      {/* ─── Stats Grid ────────────────────────────────── */}
      <div className="w-full glow-line mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Distance to Freedom"
          value={100 - completionPercentage}
          suffix="%"
          color="#22c55e"
          icon="Flag"
          className="glass-card-premium"
        />
        <StatCard
          label="Current Direction"
          value={0}
          prefix={direction.emoji + ' '}
          suffix=""
          color={direction.color}
          icon="Compass"
          className="glass-card-premium"
        />
        <StatCard
          label="Modules Done"
          value={modulesCompleted}
          suffix="/11"
          color="#f59e0b"
          icon="BookOpen"
          className="glass-card-premium"
        />
      </div>

      {/* ─── Direction Status Card ─────────────────────── */}
      <div className="w-full glow-line mb-4" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card
          className="border-0 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${direction.color}12, ${direction.color}06)`,
            border: `1px solid ${direction.color}25`,
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                  completionPercentage >= 75 ? 'weather-sunny' : completionPercentage >= 50 ? 'weather-cloudy' : completionPercentage >= 25 ? 'weather-rainy' : 'weather-stormy'
                }`}
                style={{ backgroundColor: `${direction.color}20` }}
              >
                <Car size={24} style={{ color: direction.color }} />
                <div className="breathing-dot ml-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#e8e8ed]">{direction.label}</p>
                <p className="text-xs text-[#a0a0b8] mt-0.5 font-medium">
                  {completionPercentage === 0
                    ? 'Pehla module complete karo aur journey shuru karo!'
                    : completionPercentage < 50
                    ? 'Aur modules complete karo aur GPS update hoga!'
                    : completionPercentage < 100
                    ? 'Bahut accha! Freedom qareeb aa raha hai!'
                    : 'Mubarak ho! Tumne financial freedom achieve ki!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Milestones List ───────────────────────────── */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-[#e8e8ed] flex items-center gap-2">
          <MapPin size={18} className="text-[#f59e0b]" />
          Roadmap Milestones
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {MILESTONES.map((milestone, index) => {
            const isReached = completionPercentage >= milestone.percentage;
            const isNext =
              !isReached &&
              (index === 0 || completionPercentage >= MILESTONES[index - 1].percentage);

            return (
              <motion.div
                key={milestone.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                style={{
                  backgroundColor: isReached
                    ? 'rgba(245, 158, 11, 0.08)'
                    : isNext
                    ? 'rgba(245, 158, 11, 0.04)'
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isReached ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}`,
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.08 }}
              >
                {/* Status icon */}
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isReached
                      ? 'rgba(245,158,11,0.2)'
                      : isNext
                      ? 'rgba(245,158,11,0.1)'
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  {isReached ? (
                    <Trophy size={14} className="text-[#f59e0b]" />
                  ) : isNext ? (
                    <ChevronRight size={14} className="text-[#f59e0b]" />
                  ) : (
                    <MapPin size={14} className="text-[#555570]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-medium truncate ${
                        isReached ? 'text-[#e8e8ed]' : isNext ? 'text-[#bbbbcc]' : 'text-[#666680]'
                      }`}
                    >
                      {milestone.label}
                    </p>
                    {isReached && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] shrink-0">
                        Done
                      </span>
                    )}
                    {isNext && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#fbbf24] shrink-0">
                        Next
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a0a0b8] truncate font-medium">{milestone.description}</p>
                </div>

                {/* Percentage */}
                <span className="text-xs text-[#a0a0b8] shrink-0 tabular-nums font-medium">
                  {milestone.percentage}%
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
