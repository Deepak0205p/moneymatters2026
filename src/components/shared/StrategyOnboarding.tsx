"use client";

import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useState, useCallback, type ReactNode } from 'react';
import { X, ArrowRight, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  title: string;
  icon: string;
  content: ReactNode;
}

interface StrategyOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  steps: OnboardingStep[];
  accentColor: string;
  strategyName: string;
  rewardCoins: number;
}

/**
 * StrategyOnboarding — a multi-step swipeable onboarding popup that
 * slides up when the user clicks "Shuru Karo". Step content can be
 * rich (text, bullets, etc.). Navigation via tap buttons OR swipe.
 */
export function StrategyOnboarding({
  isOpen,
  onClose,
  onStart,
  steps,
  accentColor,
  strategyName,
  rewardCoins,
}: StrategyOnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = steps.length;
  const isLast = current === total - 1;

  const goNext = useCallback(() => {
    if (isLast) return;
    setDirection(1);
    setCurrent((c) => Math.min(c + 1, total - 1));
  }, [isLast, total]);

  const goPrev = useCallback(() => {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => Math.max(c - 1, 0));
  }, [current]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeThreshold = 60;
    const swipeVel = 400;
    if (offset.x < -swipeThreshold || velocity.x < -swipeVel) {
      goNext();
    } else if (offset.x > swipeThreshold || velocity.x > swipeVel) {
      goPrev();
    }
  };

  const handleStart = () => {
    onStart();
    setCurrent(0);
    setDirection(0);
  };

  const handleClose = () => {
    setCurrent(0);
    setDirection(0);
    onClose();
  };

  const step = steps[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${strategyName} onboarding`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-midnight/85 backdrop-blur-md"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal panel — slides up + 3D depth */}
          <motion.div
            initial={{ y: '100%', opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="relative w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden glass-strong border-t sm:border flex flex-col"
            style={{
              borderColor: `${accentColor}33`,
              boxShadow: `0 -10px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}18, 0 0 60px ${accentColor}14`,
            }}
          >
            {/* Accent glow strip at top */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />

            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                />
                <h3 className="font-display font-bold text-ink text-sm truncate">{strategyName}</h3>
                {rewardCoins > 0 && (
                  <span className="shrink-0 text-[10px] font-semibold text-gold-soft bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5">
                    +{rewardCoins} 🪙
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="shrink-0 rounded-lg p-1.5 text-ink-muted hover:text-ink hover:bg-white/5 transition-colors"
                aria-label="Close onboarding"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Step counter */}
            <div className="shrink-0 px-5 pt-3 flex items-center justify-between text-[11px] text-ink-muted">
              <span className="font-medium">
                Step {current + 1} / {total}
              </span>
              <button
                onClick={handleClose}
                className="font-medium hover:text-ink transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Step body — swipeable */}
            <div className="flex-1 min-h-0 overflow-hidden px-5 py-4 perspective-3d">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                className="flex flex-col items-center text-center select-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Large emoji icon */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-center rounded-3xl mb-4 mt-1"
                  style={{
                    width: 88,
                    height: 88,
                    fontSize: 52,
                    background: `radial-gradient(circle, ${accentColor}22, transparent 70%)`,
                    boxShadow: `inset 0 0 20px ${accentColor}1a`,
                  }}
                >
                  <span style={{ filter: `drop-shadow(0 0 10px ${accentColor}66)` }}>
                    {step.icon}
                  </span>
                </motion.div>

                <h4 className="font-display font-bold text-xl text-ink mb-3">{step.title}</h4>

                <div className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-md mb-2 text-left w-full">
                  {step.content}
                </div>
              </motion.div>
            </div>

            {/* Step indicator dots */}
            <div className="shrink-0 flex items-center justify-center gap-1.5 px-5 pb-3">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Go to step ${i + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-6' : 'w-1.5 bg-white/20 hover:bg-white/40',
                  )}
                  style={
                    i === current
                      ? { backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }
                      : undefined
                  }
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="shrink-0 px-5 pb-5 pt-1 flex items-center gap-3">
              {current > 0 && (
                <button
                  onClick={goPrev}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-muted hover:text-ink border border-white/10 hover:border-white/20 transition-colors"
                >
                  Piche
                </button>
              )}

              <div className="flex-1" />

              {!isLast ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goNext}
                  className="btn-3d inline-flex items-center gap-2 rounded-xl px-6 py-3 font-display font-bold text-sm text-midnight"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    boxShadow: '0 4px 0 #0a8f6a, 0 8px 20px rgba(16,185,129,0.3)',
                  }}
                >
                  Aage badho
                  <ArrowRight className="size-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  className="btn-3d group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-display font-extrabold text-base text-midnight"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    boxShadow: `0 4px 0 ${accentColor}aa, 0 12px 30px ${accentColor}40, 0 0 24px ${accentColor}55`,
                  }}
                >
                  <Rocket className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  LET&apos;S GO!
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StrategyOnboarding;
