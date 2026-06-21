'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { BADGES, TOTAL_BADGES, TIER_COLORS, getRarestBadges, getBadgesByCategory } from '@/lib/data/badges';

const TABS = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'learning', label: 'Learning', emoji: '📚' },
  { key: 'streak', label: 'Streaks', emoji: '🔥' },
  { key: 'strategy', label: 'Strategies', emoji: '🎮' },
  { key: 'special', label: 'Special', emoji: '⭐' }
];

const TIER_RING = {
  bronze: 'from-[#CD7F32] to-[#8B4513]',
  silver: 'from-[#E5E7EB] to-[#9CA3AF]',
  gold: 'from-[#FBBF24] to-[#D97706]',
  diamond: 'from-[#A78BFA] to-[#7C3AED]'
};

function BadgeCell({ badge, earned, index }) {
  const [showTip, setShowTip] = useState(false);
  const tierColor = TIER_COLORS[badge.tier] || { ring: '#9CA3AF', glow: 'rgba(255,255,255,0.1)', label: 'Bronze' };

  return (
    <div
      className="relative flex flex-col items-center text-center group"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
    >
      {earned && (
        <span 
          className="absolute -top-1 -right-1 z-10 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{
            color: tierColor.ring,
            backgroundColor: `${tierColor.ring}10`,
            borderColor: `${tierColor.ring}40`,
            borderWidth: '1px'
          }}
        >
          {tierColor.label}
        </span>
      )}

      {/* Circle Ring */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          earned 
            ? `bg-gradient-to-br ${TIER_RING[badge.tier]} shadow-lg` 
            : 'bg-white/[0.03] border border-white/[0.06]'
        }`}
        style={earned ? {
          boxShadow: `0 0 20px ${tierColor.glow}, inset 0 0 14px rgba(255,255,255,0.15)`
        } : undefined}
      >
        {earned ? (
          <span 
            className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] select-none animate-pulse"
          >
            {badge.emoji}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
            <span className="text-[9px] text-zinc-700 font-bold font-mono">?</span>
          </div>
        )}

        {earned && (
          <span 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </div>

      <div className={`mt-2 text-[10px] sm:text-xs font-black uppercase tracking-wide leading-tight ${earned ? 'text-white' : 'text-zinc-600'}`}>
        {earned ? badge.name : 'Locked'}
      </div>

      {earned && (
        <div className="text-[9px] text-amber-400 font-black mt-0.5 flex items-center gap-0.5">
          <span>🪙</span> +{badge.rewardCoins}
        </div>
      )}

      {/* Hover requirement tip */}
      <AnimatePresence>
        {showTip && !earned && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 w-44 p-3 rounded-2xl bg-[#090D1A] border border-white/[0.08] shadow-2xl pointer-events-none text-left"
          >
            <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-black mb-1">
              🔑 REQUIREMENT
            </div>
            <p className="text-[10px] text-zinc-300 font-semibold leading-relaxed">
              {badge.requirement}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-amber-400 font-black uppercase">
              <span>🪙</span> +{badge.rewardCoins} Coins
            </div>
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#090D1A] border-r border-b border-white/[0.08]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BadgeGallery({ open, onClose }) {
  const {
    badges,
    earnedBadges
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('all');

  const earnedSet = useMemo(() => {
    return new Set([...(badges || []), ...(earnedBadges || [])]);
  }, [badges, earnedBadges]);

  const earnedCount = useMemo(() => {
    return BADGES.filter(b => earnedSet.has(b.id)).length;
  }, [earnedSet]);

  const progressPercent = Math.round((earnedCount / TOTAL_BADGES) * 100);

  const rarestBadges = useMemo(() => {
    return getRarestBadges().slice(0, 5);
  }, []);

  const visibleBadges = useMemo(() => {
    const list = getBadgesByCategory(activeTab);
    return list.sort((a, b) => {
      const ae = earnedSet.has(a.id) ? 0 : 1;
      const be = earnedSet.has(b.id) ? 0 : 1;
      if (ae !== be) return ae - be;
      const tierOrder = ['diamond', 'gold', 'silver', 'bronze'];
      return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
  }, [activeTab, earnedSet]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

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
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Sammaan Gallery 🏆</h2>
              <p className="text-[10px] text-zinc-400">Unlock shields and medals as you build wealth</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          
          {/* Progress bar card */}
          <div className="p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04] space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-zinc-400">{earnedCount} of {TOTAL_BADGES} Badges Earned</span>
              <span className="text-amber-400">{progressPercent}% Done</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Rarest badges highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-amber-400" />
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Rarest Achievements</h3>
            </div>
            <div className="grid grid-cols-5 gap-3 p-4 rounded-3xl bg-[#0B0E19] border border-white/[0.04]">
              {rarestBadges.map((badge, idx) => (
                <BadgeCell key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} index={idx} />
              ))}
            </div>
          </div>

          {/* Tab selectors */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              const countInTab = tab.key === 'all' ? TOTAL_BADGES : BADGES.filter(b => b.category === tab.key).length;
              const earnedInTab = tab.key === 'all' ? earnedCount : BADGES.filter(b => b.category === tab.key && earnedSet.has(b.id)).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? 'bg-emerald-500/20 border-emerald-500/35 text-emerald-400 shadow-md shadow-emerald-500/5' 
                      : 'bg-white/5 border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[9px] font-bold ${active ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    ({earnedInTab}/{countInTab})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Badges Grid */}
          <div className="relative pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
              >
                {visibleBadges.map((badge, idx) => (
                  <BadgeCell key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>

            {earnedCount === 0 && (
              <div className="p-8 rounded-3xl bg-[#0B0E19] border border-dashed border-white/10 text-center space-y-2">
                <Sparkles size={24} className="text-zinc-600 mx-auto animate-pulse" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">No Badges Found</h4>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Earn shields by completing learning tasks, keeping expense streaks, or testing calculators!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between text-xs font-black uppercase text-zinc-500">
          <span>{earnedCount} Medals Unlocked</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 focus:outline-none"
          >
            Band Karo ✓
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export { BadgeGallery };