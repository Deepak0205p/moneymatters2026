"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coins, Trophy, Award, Flame, Star, Zap } from 'lucide-react';

export function Gamification() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Gamification se seekho,
            <br />
            <span className="text-gradient-gold">Coins kamao, Badges unlock karo!</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass-card col-span-1 p-6 md:col-span-2 md:p-8 lg:col-span-1"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20">
                <Coins size={28} className="text-gold-soft" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Earn Coins</h3>
                <p className="text-sm text-ink-muted">Modules complete karne pe</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/images/rupee_coin.jpeg"
                alt="Rupee coin gamification"
                width={400}
                height={200}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-2">
              {[
                { label: 'Module Complete', coins: '+50' },
                { label: 'Quiz Score 90%+', coins: '+100' },
                { label: 'Daily Streak 7 din', coins: '+200' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-sm text-ink-muted">{item.label}</span>
                  <span className="text-sm font-bold text-gold-soft">{item.coins}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ai/20">
                <Award size={28} className="text-ai-soft" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mastery Badges</h3>
                <p className="text-sm text-ink-muted">Achievements ko collect karo</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/images/badges.jpeg"
                alt="Achievement badges"
                width={400}
                height={200}
                className="w-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: Star, label: 'Bronze', color: '#F59E0B' },
                { icon: Trophy, label: 'Silver', color: '#C0C0C0' },
                { icon: Zap, label: 'Gold', color: '#FBBF24' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 rounded-lg bg-white/5 p-3"
                >
                  <badge.icon size={24} style={{ color: badge.color }} />
                  <span className="text-xs text-ink-muted">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400/20">
                <Flame size={28} className="text-orange-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                <p className="text-sm text-ink-muted">Consistency se bada rewards</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { days: '3 din', reward: '50 bonus coins', icon: '🔥' },
                { days: '7 din', reward: '200 bonus coins', icon: '⚡' },
                { days: '30 din', reward: 'Exclusive Badge', icon: '👑' },
              ].map((streak) => (
                <div key={streak.days} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <span className="text-2xl">{streak.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{streak.days} streak</p>
                    <p className="text-xs text-ink-muted">{streak.reward}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald/10 to-ai/10 p-3">
              <p className="text-xs text-ink-muted">
                <span className="font-bold text-emerald-soft">Pro Tip:</span> Auto-debit setup karo
                savings ke liye aur daily module complete karo — dono saath mein!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
