"use client";

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * TryItNow — Reusable inline trigger card that appears while reading module content.
 * Pulses to grab attention. Clicking opens the strategy as a full-screen modal.
 */
interface TryItNowProps {
  strategyName: string;
  strategyDescription: string;
  icon: React.ReactNode;
  accentColor: string;
  onOpen: () => void;
}

export function TryItNow({
  strategyName,
  strategyDescription,
  icon,
  accentColor,
  onOpen,
}: TryItNowProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className="w-full mt-5 rounded-2xl p-4 border text-left transition-all group relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 50%, rgba(16,185,129,0.04) 100%)`,
        borderColor: `${accentColor}30`,
        boxShadow: `0 0 24px ${accentColor}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Pulsing glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `1.5px solid ${accentColor}40` }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      />

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
            border: `1px solid ${accentColor}40`,
          }}
        >
          {icon}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: accentColor }} />
            <span className="relative inline-flex h-3 w-3 rounded-full border border-midnight" style={{ backgroundColor: accentColor }} />
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles size={10} style={{ color: accentColor }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>
              Try It Now
            </span>
          </div>
          <h4 className="text-sm font-bold text-white">{strategyName}</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">{strategyDescription}</p>
        </div>

        {/* Arrow */}
        <div className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: accentColor }}>
          <ArrowRight size={18} />
        </div>
      </div>
    </motion.button>
  );
}
