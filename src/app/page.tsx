"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Play, ChevronRight, Coins, TrendingUp, Zap, Award, BookOpen, Sparkles, Flame, Trophy } from 'lucide-react';
import { Hero } from '@/components/2d/hero';
import { Features } from '@/components/2d/features';
import { Gamification } from '@/components/2d/gamification';
import { Navbar } from '@/components/2d/navbar';

function LightStreaks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-emerald/20 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
            top: '-30vh',
            filter: 'blur(1px)',
            transform: 'rotate(35deg)',
          }}
          animate={{ top: ['-30vh', '130vh'], opacity: [0, 1, 0] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, delay: i * 3, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

function FloatingSymbols() {
  const symbols = useMemo(
    () => [
      { Icon: Coins, color: '#F59E0B', size: 24, top: '15%', left: '10%', delay: 0 },
      { Icon: TrendingUp, color: '#10B981', size: 32, top: '45%', left: '85%', delay: 2 },
      { Icon: Zap, color: '#8B5CF6', size: 28, top: '75%', left: '15%', delay: 4 },
      { Icon: Award, color: '#FBBF24', size: 20, top: '25%', left: '70%', delay: 1 },
      { Icon: BookOpen, color: '#38BDF8', size: 22, top: '60%', left: '80%', delay: 3 },
      { Icon: Sparkles, color: '#EC4899', size: 26, top: '85%', left: '90%', delay: 5 },
      { Icon: Trophy, color: '#F59E0B', size: 30, top: '10%', left: '50%', delay: 2.5 },
      { Icon: Flame, color: '#EF4444', size: 24, top: '40%', left: '5%', delay: 1.5 },
    ],
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.1]">
      {symbols.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -40, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          <item.Icon
            size={item.size}
            style={{ color: item.color, filter: `drop-shadow(0 0 10px ${item.color}40)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function Background2D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight">
      <FloatingSymbols />
      <LightStreaks />
      {/* Emerald glow top-left */}
      <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
      {/* Purple glow bottom-right */}
      <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

function OnboardingOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card-premium mx-4 max-w-lg p-8 text-center sm:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
            boxShadow: '0 0 32px rgba(16,185,129,0.40)',
          }}
        >
          <Play size={40} className="ml-1 text-midnight" />
        </motion.div>

        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Welcome to{' '}
          <span className="text-gradient-brand">Capital Mastery</span>
        </h2>

        <p className="mb-8 text-ink-muted">
          Paisa samjho, future secure karo! Financial literacy seekho in style.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-3">
          {[
            { label: '11 Modules', color: '#10B981' },
            { label: '11 Strategies', color: '#8B5CF6' },
            { label: 'Hinglish', color: '#FBBF24' },
            { label: 'Gamified', color: '#F59E0B' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/5 p-3">
              <p className="text-xs font-semibold" style={{ color: item.color }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16,185,129,0.40)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          className="btn-primary w-full cursor-pointer justify-center"
          style={{
            background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
            color: '#0B1220',
          }}
        >
          <span>Shuru Karo!</span>
          <ChevronRight size={20} />
        </motion.button>

        <p className="mt-4 text-xs text-ink-muted/60">By continuing, you agree to our Terms of Service</p>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useAppStore();
  const hydrated = useHydration();

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (hydrated && !hasCompletedOnboarding) {
      const t = setTimeout(() => setShowOnboarding(true), 0);
      return () => clearTimeout(t);
    }
  }, [hydrated, hasCompletedOnboarding]);

  const handleDismiss = useCallback(() => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Background2D />

      <AnimatePresence>
        {showOnboarding && <OnboardingOverlay onDismiss={handleDismiss} />}
      </AnimatePresence>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Gamification />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="py-12 text-center"
        >
          <p className="text-sm text-ink-muted/60">
            © 2026 Capital Mastery. Made with care for Indian youth financial literacy.
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
