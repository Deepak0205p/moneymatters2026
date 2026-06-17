'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  BADGES,
  TOTAL_BADGES,
  TIER_COLORS,
  CATEGORY_META,
  getRarestBadges,
  getBadgesByCategory,
  type BadgeCategory,
  type BadgeData,
  type BadgeTier,
} from '@/lib/data/badges';

// ── Category tab definition ────────────────────────────────────────────────
type TabKey = 'all' | BadgeCategory;
const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'all',       label: 'All',         emoji: '✨' },
  { key: 'learning',  label: 'Learning',    emoji: '📚' },
  { key: 'streak',    label: 'Streaks',     emoji: '🔥' },
  { key: 'strategy',  label: 'Strategies',  emoji: '🎮' },
  { key: 'special',   label: 'Special',     emoji: '⭐' },
];

// ── Tier ring colour helper ────────────────────────────────────────────────
const TIER_RING: Record<BadgeTier, string> = {
  bronze:  'from-[#CD7F32] to-[#8B4513]',
  silver:  'from-[#E5E7EB] to-[#9CA3AF]',
  gold:    'from-[#FBBF24] to-[#D97706]',
  diamond: 'from-[#A78BFA] to-[#7C3AED]',
};

// ── Single Badge Cell ──────────────────────────────────────────────────────
function BadgeCell({
  badge,
  earned,
  index,
}: {
  badge: BadgeData;
  earned: boolean;
  index: number;
}) {
  const [showTip, setShowTip] = useState(false);
  const tierColor = TIER_COLORS[badge.tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.6), type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex flex-col items-center text-center group"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
    >
      {/* Tier dot top-right */}
      {earned && (
        <span
          className="absolute -top-1 -right-1 z-10 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{
            color: tierColor.ring,
            backgroundColor: `${tierColor.ring}1A`,
            border: `1px solid ${tierColor.ring}55`,
          }}
        >
          {tierColor.label}
        </span>
      )}

      {/* Badge circle */}
      <div
        className={`
          relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
          ${earned
            ? `bg-gradient-to-br ${TIER_RING[badge.tier]} shadow-lg group-hover:shadow-2xl badge-3d-spin`
            : 'bg-white/[0.03] border border-white/[0.06]'}
          transition-all duration-300
        `}
        style={earned ? {
          boxShadow: `0 0 20px ${tierColor.glow}, inset 0 0 14px rgba(255,255,255,0.18)`,
        } : undefined}
      >
        {earned ? (
          <span
            className="text-2xl sm:text-3xl drop-shadow-lg select-none"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))' }}
          >
            {badge.emoji}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white/25" />
            <span className="text-[9px] text-white/25">?</span>
          </div>
        )}

        {/* Shine overlay on hover (earned only) */}
        {earned && (
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 100%)',
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>

      {/* Name */}
      <div className={`mt-2 text-[10px] sm:text-xs font-bold leading-tight ${earned ? 'text-ink' : 'text-white/30'}`}>
        {earned ? badge.name : '???'}
      </div>

      {/* Reward coins (earned only) */}
      {earned && (
        <div className="text-[9px] text-gold-soft font-semibold mt-0.5 flex items-center gap-0.5">
          <span className="text-gold">🪙</span> +{badge.rewardCoins}
        </div>
      )}

      {/* Tooltip on hover (unearned only) */}
      <AnimatePresence>
        {showTip && !earned && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 w-44 p-2.5 rounded-xl glass-strong shadow-xl pointer-events-none"
          >
            <div className="text-[10px] uppercase tracking-wider text-emerald-soft font-bold mb-1">
              🔓 Kaise khole?
            </div>
            <div className="text-[11px] text-ink leading-snug">{badge.requirement}</div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gold-soft font-semibold">
              <span className="text-gold">🪙</span> +{badge.rewardCoins} coins
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 glass-strong border-r border-b" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main BadgeGallery Modal ────────────────────────────────────────────────
interface BadgeGalleryProps {
  open: boolean;
  onClose: () => void;
}

export function BadgeGallery({ open, onClose }: BadgeGalleryProps) {
  const { badges, earnedBadges } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  // Merge both arrays for backward compat
  const earnedSet = useMemo(
    () => new Set<string>([...badges, ...earnedBadges]),
    [badges, earnedBadges]
  );
  const earnedCount = BADGES.filter((b) => earnedSet.has(b.id)).length;
  const progressPercent = Math.round((earnedCount / TOTAL_BADGES) * 100);

  // Rarest badges (always shown at top — highlights ones still un-earned)
  const rarestBadges = useMemo(() => getRarestBadges().slice(0, 5), []);

  // Filtered badges per active tab
  const visibleBadges = useMemo(() => {
    const list = getBadgesByCategory(activeTab);
    // sort: earned first (by tier diamond→bronze), then unearned
    return list.sort((a, b) => {
      const ae = earnedSet.has(a.id) ? 0 : 1;
      const be = earnedSet.has(b.id) ? 0 : 1;
      if (ae !== be) return ae - be;
      const tierOrder: BadgeTier[] = ['diamond', 'gold', 'silver', 'bronze'];
      return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
  }, [activeTab, earnedSet]);

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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-x-2 top-[4vh] bottom-[4vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl glass-card-premium rounded-3xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center shadow-glow-gold">
                    <Trophy className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-display text-ink heading-gradient inline-block">
                      Badge Trophy Wall
                    </h2>
                    <p className="text-[10px] text-ink-muted">Achievements unlock karo seekhte time!</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
                  aria-label="Close badge gallery"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-ink-muted">
                      {earnedCount}/{TOTAL_BADGES} Badges Earned 🏆
                    </span>
                    <span className="text-[11px] font-bold text-gold-soft">{progressPercent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #34D399, #F59E0B, #A78BFA)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ type: 'spring', stiffness: 280, damping: 25, delay: 0.15 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5 scrollbar-none">
              {/* Rarest Badges section */}
              <section>
                <div className="flex items-center gap-2 mb-2.5">
                  <Crown className="w-3.5 h-3.5 text-gold" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Rarest Badges
                  </h3>
                  <span className="text-[10px] text-gold-soft font-semibold">
                    (sirf kuch % logon ne paaya)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 p-3 rounded-2xl glass-card border border-gold/15">
                  {rarestBadges.map((badge, i) => {
                    const earned = earnedSet.has(badge.id);
                    return <BadgeCell key={badge.id} badge={badge} earned={earned} index={i} />;
                  })}
                </div>
              </section>

              {/* Category tabs */}
              <section>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    const count =
                      tab.key === 'all'
                        ? TOTAL_BADGES
                        : BADGES.filter((b) => b.category === tab.key).length;
                    const earnedInTab =
                      tab.key === 'all'
                        ? earnedCount
                        : BADGES.filter((b) => b.category === tab.key && earnedSet.has(b.id)).length;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                          flex items-center gap-1.5
                          ${isActive
                            ? 'bg-emerald/15 text-emerald-soft border border-emerald/30 shadow-glow-emerald'
                            : 'text-ink-muted hover:text-ink hover:bg-white/5 border border-white/[0.06]'}
                        `}
                      >
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                        <span className={`text-[10px] ${isActive ? 'text-emerald-soft/80' : 'text-ink-muted/70'}`}>
                          {earnedInTab}/{count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Badge grid: 3 per row mobile, 5 per row desktop */}
              <section>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 pb-2"
                  >
                    {visibleBadges.map((badge, i) => (
                      <BadgeCell
                        key={badge.id}
                        badge={badge}
                        earned={earnedSet.has(badge.id)}
                        index={i}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </section>

              {/* Empty hint if zero earned */}
              {earnedCount === 0 && (
                <div className="text-center p-5 rounded-2xl glass-card border border-white/[0.05]">
                  <Sparkles className="w-7 h-7 text-gold/60 mx-auto mb-2" />
                  <p className="text-sm text-ink-muted">
                    Abhi koi badge nahi mila. Modules complete karo, streaks banao, strategies khelo — badges apne aap aayenge!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 sm:px-6 py-3 border-t border-white/[0.06] bg-midnight/40">
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>
                  <span className="text-emerald-soft font-semibold">{earnedCount}</span> earned ·{' '}
                  <span className="text-gold-soft font-semibold">{TOTAL_BADGES - earnedCount}</span> baaki
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg bg-emerald/15 hover:bg-emerald/25 text-emerald-soft font-semibold transition-colors btn-3d"
                >
                  Band karo
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
