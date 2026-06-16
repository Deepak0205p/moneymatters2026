'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Footprints, MapPin, Sword, Crown, Award, Flame, Zap, PiggyBank, Target, DoorOpen, Bird } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

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

interface BadgeGalleryProps {
  open: boolean;
  onClose: () => void;
}

export function BadgeGallery({ open, onClose }: BadgeGalleryProps) {
  const { badges } = useAppStore();
  const earnedCount = badges.length;
  const totalBadges = BADGES.length;

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

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-x-4 top-[6vh] bottom-[6vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Badge Gallery</h2>
                    <p className="text-[10px] text-[#8888a0]">Achievements unlock karo seekhte time!</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close badge gallery"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs font-semibold text-amber-400 shrink-0">
                  {earnedCount}/{totalBadges}
                </span>
              </div>
            </div>

            {/* Badge grid */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BADGES.map((badge, index) => {
                  const earned = badges.includes(badge.id);
                  const { Icon, color } = badge;

                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className={`
                        relative p-4 rounded-xl border text-center transition-all cursor-default
                        ${earned
                          ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]'
                          : 'bg-white/[0.01] border-white/[0.03] opacity-40'
                        }
                      `}
                    >
                      {/* Glow for earned */}
                      {earned && (
                        <div
                          className="absolute inset-0 rounded-xl opacity-10"
                          style={{ boxShadow: `0 0 20px ${color}, 0 0 40px ${color}40` }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`
                          w-10 h-10 mx-auto mb-2.5 rounded-xl flex items-center justify-center
                          ${earned ? '' : 'bg-white/[0.04]'}
                        `}
                        style={earned ? { backgroundColor: `${color}15` } : {}}
                      >
                        {earned ? (
                          <Icon className="w-5 h-5" style={{ color }} />
                        ) : (
                          <Lock className="w-4 h-4 text-[#555]" />
                        )}
                      </div>

                      {/* Name */}
                      <div className={`text-xs font-semibold mb-0.5 ${earned ? 'text-white' : 'text-[#555]'}`}>
                        {earned ? badge.name : '???'}
                      </div>

                      {/* Description */}
                      <div className="text-[10px] text-[#8888a0] leading-tight">
                        {earned ? badge.description : 'Keep learning to unlock!'}
                      </div>

                      {/* Earned indicator */}
                      {earned && (
                        <div
                          className="absolute top-2 right-2 w-2 h-2 rounded-full"
                          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Empty state message */}
              {earnedCount === 0 && (
                <div className="mt-6 text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Trophy className="w-8 h-8 text-[#555] mx-auto mb-2" />
                  <p className="text-sm text-[#8888a0]">
                    Koi badge nahi mila abhi. Modules complete karo aur badges unlock karo!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
