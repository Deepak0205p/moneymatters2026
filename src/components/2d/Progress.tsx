'use client';

import { motion } from 'framer-motion';

/**
 * ProgressArc — circular SVG progress indicator with brand gradient.
 * A 2D alternative to ProgressRing for strategy visuals.
 */
interface ProgressArcProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  variant?: 'emerald' | 'gold' | 'purple';
  showGlow?: boolean;
}

const VARIANTS = {
  emerald: { from: '#34D399', to: '#047857', glow: 'rgba(16,185,129,0.40)' },
  gold: { from: '#FBBF24', to: '#D97706', glow: 'rgba(245,158,11,0.40)' },
  purple: { from: '#A78BFA', to: '#6D28D9', glow: 'rgba(139,92,246,0.40)' },
};

export function ProgressArc({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  variant = 'emerald',
  showGlow = true,
}: ProgressArcProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const colors = VARIANTS[variant];
  const gradientId = `progress-arc-${variant}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
        />
      )}
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.10)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold text-ink tabular-nums">{label}</span>}
        {sublabel && <span className="text-[10px] text-ink-muted uppercase tracking-wider">{sublabel}</span>}
      </div>
    </div>
  );
}

/**
 * BarMeter — horizontal animated bar with brand gradient.
 */
interface BarMeterProps {
  value: number; // 0-100
  label?: string;
  valueLabel?: string;
  variant?: 'emerald' | 'gold' | 'purple' | 'red';
  height?: number;
  showGlow?: boolean;
}

const BAR_VARIANTS = {
  emerald: 'from-emerald-soft via-emerald to-emerald-deep',
  gold: 'from-gold-soft via-gold to-gold-deep',
  purple: 'from-ai-soft via-ai to-ai-deep',
  red: 'from-red-400 via-red-500 to-red-600',
};

export function BarMeter({
  value,
  label,
  valueLabel,
  variant = 'emerald',
  height = 8,
  showGlow = true,
}: BarMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {(label || valueLabel) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-ink-muted">{label}</span>}
          {valueLabel && <span className="text-xs font-bold text-ink tabular-nums">{valueLabel}</span>}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-white/[0.06]"
        style={{ height }}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${BAR_VARIANTS[variant]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={showGlow ? { boxShadow: '0 0 12px rgba(16,185,129,0.30)' } : undefined}
        />
      </div>
    </div>
  );
}

/**
 * StatRing — small circular stat badge for dashboards.
 */
export function StatRing({
  value,
  max,
  size = 56,
  variant = 'emerald',
  icon: Icon,
}: {
  value: number;
  max: number;
  size?: number;
  variant?: 'emerald' | 'gold' | 'purple';
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(pct, 100) / 100) * circumference;
  const colors = VARIANTS[variant];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.10)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.from}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {Icon ? <Icon className="w-4 h-4 text-ink-muted" /> : <span className="text-xs font-bold text-ink tabular-nums">{value}</span>}
      </div>
    </div>
  );
}
