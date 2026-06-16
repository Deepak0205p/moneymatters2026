"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            Jab Indian Youth Bole,
            <br />
            <span className="text-gradient-emerald">&quot;Paisa samjho, future secure karo!&quot;</span>
          </h2>
          <p className="mx-auto max-w-2xl text-ink-muted">
            16-25 age group ke liye specially designed interactive financial learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden p-6 sm:col-span-2 sm:p-8 lg:row-span-2"
          >
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-full bg-emerald/20 p-3">
                <GraduationCap size={28} className="text-emerald-soft" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">College Students</h3>
              <p className="mb-6 max-w-md text-ink-muted">
                Exam ke saath savings ka basic seekho. Budget templates, expense tracking,
                aur smart money habits — sab kuch ek jagah.
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/genz_banner.jpeg"
                  alt="College students learning financial literacy"
                  width={600}
                  height={300}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-ai/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-full bg-ai/20 p-3">
                <Briefcase size={28} className="text-ai-soft" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">First Job Earners</h3>
              <p className="text-sm text-ink-muted">
                Budgeting aur investing ka practical guide. Pehli salary se wealth building shuru karo.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-full bg-gold/20 p-3">
                <Users size={28} className="text-gold-soft" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Teenagers</h3>
              <p className="text-sm text-ink-muted">
                Pocket money se business tak. Saving habits, gamified badges, aur fun learning.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="glass-card group relative overflow-hidden p-6 sm:col-span-2 sm:p-8"
          >
            <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-4 inline-flex rounded-full bg-emerald/20 p-3">
                  <TrendingUp size={28} className="text-emerald-soft" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">Why Capital Mastery?</h3>
                <p className="text-sm text-ink-muted">
                  Hinglish mein seekho, interactive experiences se samjho, gamification se practice karo.
                  Finance boring nahi — yeh game hai!
                </p>
              </div>
              <div className="flex gap-4">
                {['Compounding Tree', 'Debt Doors', 'Asset Biryani'].map((item) => (
                  <div
                    key={item}
                    className="whitespace-nowrap rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-ink-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
