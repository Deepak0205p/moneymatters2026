"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Coins, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';

export function Hero() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient-brand">Paisa Samjho,</span>
              <br />
              <span className="text-white">Future Secure Karo!</span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-ink-muted sm:text-lg md:text-xl">
              Indian youth (16-25) ke liye financial literacy ka naya interactive approach.
              Compounding ka power samjho, debt traps se bacho, aur paisa ko game banado!
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16,185,129,0.40)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartLearning}
                className="btn-primary cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                  color: '#0B1220',
                }}
              >
                <Play size={20} />
                Start Learning
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary cursor-pointer"
                style={{ color: '#34D399', borderColor: '#10B981' }}
              >
                <ChevronRight size={20} />
                How it Works
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-6 text-sm text-ink-muted"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ai/20">
                  <Coins size={16} className="text-ai-soft" />
                </div>
                <span>Earn Coins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/20">
                  <Trophy size={16} className="text-emerald-soft" />
                </div>
                <span>Unlock Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
                  <Play size={16} className="text-gold-soft" />
                </div>
                <span>Real-world Insights</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative flex justify-center"
          >
            <div className="glass-card-premium relative w-full max-w-md overflow-hidden p-6 sm:p-8">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-ai/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                      boxShadow: '0 0 16px rgba(16,185,129,0.35)',
                    }}
                  >
                    <Coins size={20} className="text-midnight" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Finance Advisor</p>
                    <p className="text-xs text-ink-muted">Aapka personal guide</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src="/images/mascot.jpeg"
                    alt="Capital Mastery AI Finance Advisor Mascot"
                    width={500}
                    height={400}
                    className="w-full object-cover"
                    priority
                  />
                </div>

                <div className="mt-4 rounded-lg bg-white/5 p-3">
                  <p className="text-sm text-ink-muted">
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
