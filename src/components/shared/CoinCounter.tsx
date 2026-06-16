'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoinCounterProps {
  amount: number;
  showLabel?: boolean;
}

export default function CoinCounter({ amount, showLabel = true }: CoinCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isBouncing, setIsBouncing] = useState(false);
  const prevAmount = useRef(amount);

  // Animate the number counting up when amount changes
  useEffect(() => {
    const startValue = prevAmount.current;
    const endValue = amount;
    const diff = endValue - startValue;

    if (diff === 0) return;

    const duration = 800; // ms
    const startTime = Date.now();

    // Trigger coin bounce via setTimeout to avoid synchronous setState in effect
    const bounceStartTimer = setTimeout(() => setIsBouncing(true), 0);
    const bounceEndTimer = setTimeout(() => setIsBouncing(false), 600);

    function animateFrame() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayAmount(Math.round(startValue + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        prevAmount.current = endValue;
      }
    }

    requestAnimationFrame(animateFrame);
    return () => {
      clearTimeout(bounceStartTimer);
      clearTimeout(bounceEndTimer);
    };
  }, [amount]);

  const formattedAmount = displayAmount.toLocaleString('en-IN');

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={isBouncing ? {
          scale: [1, 1.3, 0.9, 1.1, 1],
          rotate: [0, -15, 15, -5, 0],
        } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Coins size={20} className="text-gold-soft" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.35))' }} />
      </motion.div>

      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayAmount}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'text-lg font-bold tabular-nums text-gradient-gold'
            )}
          >
            {formattedAmount}
          </motion.span>
        </AnimatePresence>
        {showLabel && (
          <span className="text-[10px] text-ink-muted -mt-1">coins</span>
        )}
      </div>
    </div>
  );
}
