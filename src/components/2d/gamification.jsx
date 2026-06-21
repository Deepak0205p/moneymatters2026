"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coins, Trophy, Award, Flame, Star, Zap } from 'lucide-react';

export function Gamification() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold-soft text-xs font-semibold uppercase tracking-wider"
          >
            <Trophy size={12} />
            <span>Gamification & Incentives</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-extrabold tracking-tight md:text-4xl text-ink"
          >
            Rewards for Consistency! <br />
            <span className="text-gradient-gold">Earn Coins and Unlock Badges</span>
          </motion.h2>
          <p className="mx-auto max-w-2xl text-ink-muted text-sm sm:text-base">
            Make your learning journey exciting instead of boring. Earn coins and level up with every module, checkup, and challenge!
          </p>
        </div>

        {/* Gamified Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          
          {/* Card 1: Coins */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-gold-500/10 flex flex-col justify-between shadow-premium overflow-hidden group"
          >
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold-soft">
                  <Coins size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Earn Coins</h3>
                  <p className="text-xs text-ink-muted">In-app currency for complete modules</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 mb-4 bg-midnight-deep relative">
                <Image
                  src="/images/rupee_coin.jpeg"
                  alt="Rupee coin gamification representation"
                  width={400}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Module Completion', coins: '+50 Coins' },
                  { label: 'Perfect Quiz Score', coins: '+100 Coins' },
                  { label: 'Weekly Streak Check', coins: '+200 Coins' }
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs">
                    <span className="text-ink-muted">{item.label}</span>
                    <span className="font-bold text-gold-soft tabular-nums">{item.coins}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Badges */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-emerald-500/10 flex flex-col justify-between shadow-premium overflow-hidden group"
          >
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/15 text-emerald-soft">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Mastery Badges</h3>
                  <p className="text-xs text-ink-muted">Achieve financial milestones</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 mb-4 bg-midnight-deep relative">
                <Image
                  src="/images/badges.jpeg"
                  alt="Achievement badges representation"
                  width={400}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Star, label: 'Bronze', color: '#F59E0B' },
                  { icon: Trophy, label: 'Silver', color: '#C0C0C0' },
                  { icon: Zap, label: 'Gold', color: '#FBBF24' }
                ].map(badge => (
                  <div key={badge.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 border border-white/5 p-2.5 text-center">
                    <badge.icon size={18} style={{ color: badge.color }} />
                    <span className="text-[10px] text-ink-muted font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Daily Streak */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-orange-500/10 flex flex-col justify-between shadow-premium overflow-hidden group"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300">
                  <Flame size={24} className="animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Daily Streak</h3>
                  <p className="text-xs text-ink-muted">Practice consistency daily</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { days: '3 day streak', reward: '50 bonus coins', icon: '🔥' },
                  { days: '7 day streak', reward: '200 bonus coins', icon: '⚡' },
                  { days: '30 day streak', reward: 'Exclusive Badge', icon: '👑' }
                ].map(streak => (
                  <div key={streak.days} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
                    <span className="text-xl flex-shrink-0">{streak.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-ink">{streak.days}</p>
                      <p className="text-[10px] text-ink-muted">{streak.reward}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-gradient-to-r from-emerald/10 to-ai/10 border border-emerald/15 p-3.5 mt-2">
                <p className="text-[10px] text-ink-muted leading-relaxed">
                   <strong className="text-emerald-soft">Pro Tip:</strong> Updating your daily strategy target will keep your streak alive and boost your learning momentum.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}