"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Coins, Trophy, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';

export function Hero() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  const handleStartLearning = () => {
    router.push(isAuthenticated ? '/dashboard' : '/auth');
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                FinTech + AI Education MVP
              </span>
            </motion.div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient-brand">Paisa Samjho,</span>
              <br />
              <span className="text-ink">Future Secure Karo!</span>
            </h1>

            <p className="mt-6 max-w-lg text-base text-ink-muted sm:text-lg md:text-xl leading-relaxed">
              Indian youth (16-25) ke liye financial literacy ka naya interactive approach.
              Compounding ka power samjho, debt traps se bacho, aur paisa ko game banado!
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(16,185,129,0.40)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartLearning}
                className="btn-emerald flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base cursor-pointer"
              >
                <Play size={18} className="fill-current" />
                Start Learning
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/tools')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-semibold text-ink hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} className="text-emerald-soft" />
                Explore Tools
              </motion.button>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-ink-muted"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ai/15">
                  <Coins size={15} className="text-ai-soft" />
                </div>
                <span>Earn Coins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15">
                  <Trophy size={15} className="text-emerald-soft" />
                </div>
                <span>Unlock Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15">
                  <Play size={15} className="text-gold-soft" />
                </div>
                <span>Real-world Insights</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: AI Advisor card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div className="glass-card-premium relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-ai/10 blur-3xl" />

              <div className="relative">
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                      boxShadow: '0 0 16px rgba(16,185,129,0.35)',
                    }}
                  >
                    <Coins size={20} className="text-midnight" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">AI Finance Advisor</p>
                    <p className="text-xs text-ink-muted">Aapka personal guide</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 rounded-full bg-ai/10 border border-ai/20 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-ai-soft animate-pulse" />
                    <span className="text-[10px] font-semibold text-ai-soft">AI</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src="/images/mascot.jpeg"
                    alt="Capital Mastery AI Finance Advisor Mascot"
                    width={500}
                    height={400}
                    className="w-full object-cover"
                    priority
                  />
                </div>

                <div className="mt-4 rounded-xl bg-white/5 border border-white/5 p-3.5">
                  <p className="text-sm text-ink-muted leading-relaxed">
                    <span className="font-bold text-emerald-soft">Mascot:</span>{' '}
                    &quot;Bhai, aaj se investing shuru karo. Chhote steps se bada wealth banega!&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
