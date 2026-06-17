"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';

interface StrategyCompleteProps {
  isOpen: boolean;
  onBack: () => void;
  strategyName: string;
  rewardCoins: number;
  accentColor: string;
}

const CONFETTI_COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#34D399', '#A78BFA', '#FBBF24', '#EF4444', '#38BDF8'];

/**
 * StrategyComplete — a celebration overlay shown when a strategy is
 * completed. Confetti rains from the top, a glassmorphic card scales
 * in with a 3D badge spin, and a gold-glow coin reward is shown.
 * Auto-dismisses after 5 seconds OR on button click.
 */
export function StrategyComplete({
  isOpen,
  onBack,
  strategyName,
  rewardCoins,
  accentColor,
}: StrategyCompleteProps) {
  // Auto-dismiss after 5s. Cleanup on unmount / close / dep change.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onBack();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onBack]);

  // Stable confetti field — regenerated only when the overlay opens
  const confetti = useMemo(() => {
    if (!isOpen) return [];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 1.2}s`,
      duration: `${1.6 + Math.random() * 1.2}s`,
      size: 6 + Math.round(Math.random() * 8),
      rotate: `${Math.round(Math.random() * 360)}deg`,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    }));
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Strategy complete celebration"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-midnight/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Confetti layer */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="confetti-piece"
                style={{
                  left: c.left,
                  top: '-20px',
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  borderRadius: c.shape,
                  transform: `rotate(${c.rotate})`,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  boxShadow: `0 0 6px ${c.color}66`,
                }}
              />
            ))}
          </div>

          {/* Center card with 3D perspective */}
          <div className="relative perspective-3d w-full max-w-md">
            {/* Outer accent glow */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-3xl blur-3xl opacity-50 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${accentColor}, transparent 70%)`,
              }}
            />

            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotateY: -25, y: 30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="relative rounded-3xl glass-card-premium overflow-hidden p-7 sm:p-8 text-center"
              style={{
                transformStyle: 'preserve-3d',
                borderColor: `${accentColor}44`,
                boxShadow: `0 0 0 1px ${accentColor}22, 0 0 50px ${accentColor}22, 0 30px 70px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Accent top strip */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />

              {/* 3D spinning trophy badge */}
              <motion.div
                initial={{ scale: 0, rotateY: 0 }}
                animate={{ scale: 1, rotateY: 360 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                className="badge-3d-spin mx-auto mb-4 flex items-center justify-center rounded-full"
                style={{
                  width: 84,
                  height: 84,
                  background: `radial-gradient(circle, ${accentColor}33, transparent 70%)`,
                  boxShadow: `inset 0 0 24px ${accentColor}33, 0 0 30px ${accentColor}40`,
                }}
              >
                <Trophy
                  className="size-10"
                  style={{ color: accentColor, filter: `drop-shadow(0 0 8px ${accentColor})` }}
                />
              </motion.div>

              {/* Heading */}
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gradient-emerald mb-1">
                🎉 Strategy Complete!
              </h2>

              {/* Strategy name */}
              <p className="text-ink-muted text-sm mb-5">{strategyName}</p>

              {/* Coin reward badge */}
              {rewardCoins > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.4 }}
                  className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display font-extrabold text-lg"
                  style={{
                    color: '#FBBF24',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    boxShadow: '0 0 24px rgba(245, 158, 11, 0.35), inset 0 0 16px rgba(245, 158, 11, 0.1)',
                  }}
                >
                  <span className="coin-spin-3d inline-block">🪙</span>
                  +{rewardCoins} coins
                </motion.div>
              )}

              {/* Subtext */}
              <p className="text-ink-muted text-xs mb-6 max-w-xs mx-auto">
                Badhiya! Aapne yeh strategy complete kar li. Ab apne learning journey pe wapas chalein.
              </p>

              {/* Back button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBack}
                className="btn-3d group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-display font-bold text-base text-midnight w-full justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  boxShadow: '0 4px 0 #0a8f6a, 0 12px 30px rgba(16,185,129,0.3), 0 0 24px rgba(16,185,129,0.25)',
                }}
              >
                <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                Back to Module
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StrategyComplete;
