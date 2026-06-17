"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Skull, TrendingDown, Info, Coins, Clock, Percent } from 'lucide-react';

function useCountUp(target: number, duration = 400) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (end - start) * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevRef.current = end;
    };
  }, [target, duration]);

  return value;
}

function formatINR(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${Math.round(abs)}`;
}

export default function ChhupaHuaChor() {
  const { addCoins } = useAppStore();
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);

  const realValue = useMemo(
    () => amount / Math.pow(1 + rate / 100, years),
    [amount, years, rate]
  );
  const lostPct = ((amount - realValue) / amount) * 100;
  const showWarning = years >= 20 && lostPct >= 50;

  const animatedReal = useCountUp(realValue);
  const animatedLostPct = useCountUp(lostPct);

  // Chor emoji grows with years (1x → 2.5x)
  const chorScale = 1 + (years / 30) * 1.5;
  // Money pile shrinks with lost value
  const moneyScale = Math.max(0.35, realValue / amount);
  // Background red intensity grows with years
  const redIntensity = Math.min(years / 30, 1);

  // Money pile coins count
  const coinCount = Math.max(1, Math.round((realValue / amount) * 10));

  return (
    <div
      className="w-full space-y-6 rounded-2xl p-5 sm:p-6 transition-colors duration-700"
      style={{
        background: `linear-gradient(135deg, rgba(239,68,68,${0.04 + redIntensity * 0.22}), rgba(11,18,32,${0.6 - redIntensity * 0.2}))`,
        border: `1px solid rgba(239,68,68,${0.15 + redIntensity * 0.30})`,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Skull className="text-red-400" size={26} />
          <h2 className="text-2xl md:text-3xl font-display font-bold" style={{ color: '#F87171' }}>
            Chhupa Hua Chor
          </h2>
        </div>
        <p className="text-sm text-ink-muted font-medium">
          Inflation Monster — Tumhare paise ko kaun churata hai? 👹
        </p>
      </div>

      {/* Warning flash */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="rounded-xl p-3 text-center font-bold text-sm"
            style={{
              background: 'rgba(239,68,68,0.20)',
              border: '1px solid rgba(239,68,68,0.50)',
              color: '#FCA5A5',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [1, 0.55, 1], scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ opacity: { duration: 1, repeat: Infinity }, scale: { duration: 0.3 } }}
          >
            🚨 DANGER! Inflation ne tumhare paise ka {Math.round(animatedLostPct)}% kha liya!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualization */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden min-h-[220px] flex items-center justify-around">
        {/* Chor (grows with years) */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ scale: chorScale, rotate: [0, -4, 4, 0] }}
            transition={{ scale: { duration: 0.6 }, rotate: { duration: 3, repeat: Infinity } }}
            className="text-7xl sm:text-8xl drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            {years >= 20 ? '👹' : '🥷'}
          </motion.div>
          <p className="text-[11px] uppercase tracking-wider text-red-400 font-bold">Inflation Chor</p>
          <p className="text-[10px] text-ink-muted">Barhta ja raha hai...</p>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-2xl"
        >
          🍴
        </motion.div>

        {/* Money pile (shrinks with years) */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ scale: moneyScale }}
            transition={{ duration: 0.6 }}
            className="text-6xl sm:text-7xl drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            💰
          </motion.div>
          <div className="flex flex-wrap gap-0.5 justify-center max-w-[120px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: i < coinCount ? 1 : 0.15,
                  scale: i < coinCount ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
                className="text-xs"
              >
                🪙
              </motion.span>
            ))}
          </div>
          <p className="text-[11px] uppercase tracking-wider text-gold font-bold">Tumhara Paisa</p>
          <p className="text-[10px] text-ink-muted">Sikudta ja raha hai...</p>
        </div>
      </div>

      {/* Big result number */}
      <motion.div
        className="glass-card-premium rounded-2xl p-5 text-center space-y-1"
        key={`${amount}-${years}-${rate}`}
      >
        <p className="text-xs text-ink-muted font-medium">
          Tumhara <span className="text-gold font-bold">{formatINR(amount)}</span> aaj ki kimat me
        </p>
        <p className="text-3xl sm:text-4xl font-display font-bold tabular-nums" style={{ color: '#F87171' }}>
          {formatINR(animatedReal)}
        </p>
        <p className="text-sm text-ink-muted">
          ke barabar feel hoga <span className="text-ink font-semibold">{years} saal</span> baad
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30">
          <TrendingDown size={14} className="text-red-400" />
          <span className="text-xs font-bold text-red-300">Kho gaya: {Math.round(animatedLostPct)}%</span>
        </div>
      </motion.div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Amount */}
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="text-gold" size={16} />
            <span className="text-xs font-semibold text-ink">Amount</span>
          </div>
          <p className="text-lg font-display font-bold text-gold tabular-nums">{formatINR(amount)}</p>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-gold cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-muted">
            <span>₹10K</span><span>₹10L</span>
          </div>
        </div>

        {/* Years */}
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="text-ai" size={16} />
            <span className="text-xs font-semibold text-ink">Years</span>
          </div>
          <p className="text-lg font-display font-bold text-ai tabular-nums">{years} yrs</p>
          <input
            type="range"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-ai cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-muted">
            <span>1</span><span>15</span><span>30</span>
          </div>
        </div>

        {/* Rate */}
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Percent className="text-emerald" size={16} />
            <span className="text-xs font-semibold text-ink">Inflation Rate</span>
          </div>
          <p className="text-lg font-display font-bold text-emerald tabular-nums">{rate}%</p>
          <input
            type="range"
            min={4}
            max={10}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-emerald cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-ink-muted">
            <span>4%</span><span>7%</span><span>10%</span>
          </div>
        </div>
      </div>

      {/* Educational tooltip */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <Info className="text-ai shrink-0 mt-0.5" size={18} />
        <div className="space-y-1">
          <p className="text-xs text-ink font-semibold">
            📚 Inflation kya karta hai?
          </p>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Aaj ₹100 se jo cheezein mil sakti hain, wohi cheezein <span className="text-red-400 font-semibold">10 saal</span> baad
            ₹179 me milti hain (6% inflation pe). Isi liye paise ko sirf save nahi, <span className="text-emerald font-semibold">invest</span> karna
            zaroori hai — taaki returns inflation ko hara sake. <span className="text-gold">SIP, Mutual Funds, Equity</span> = inflation-beating options! 🛡️
          </p>
          <p className="text-[10px] text-ink-muted italic pt-1">
            Formula: Real Value = Amount ÷ (1 + Rate/100)<sup>Years</sup>
          </p>
        </div>
      </div>

      {/* Reward button */}
      <motion.button
        onClick={() => addCoins(10)}
        className="btn-emerald w-full py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        🛡️ Inflation Beat Karne ka Seekha! +10 Coins
      </motion.button>
    </div>
  );
}
