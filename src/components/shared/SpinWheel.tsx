"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Gift, Lightbulb, Sparkles, Shield, Clock, IndianRupee,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────────── */
interface SpinWheelProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Wheel Segments
   ────────────────────────────────────────────────────────────── */
interface Segment {
  id: string;
  label: string;
  emoji: string;
  color: string;
  type: 'coins' | 'tip' | 'badge' | 'shield' | 'mystery' | 'wisdom' | 'unlock' | 'retry';
  coinAmount?: number;
}

const SEGMENTS: Segment[] = [
  { id: 'c50', label: '+50 Coins', emoji: '🪙', color: '#F59E0B', type: 'coins', coinAmount: 50 },
  { id: 'tip', label: 'Financial Tip', emoji: '💡', color: '#3B82F6', type: 'tip' },
  { id: 'c100', label: '+100 Coins', emoji: '💰', color: '#10B981', type: 'coins', coinAmount: 100 },
  { id: 'badge', label: 'Mystery Badge', emoji: '🎁', color: '#8B5CF6', type: 'badge' },
  { id: 'c25', label: '+25 Coins', emoji: '🪙', color: '#FCD34D', type: 'coins', coinAmount: 25 },
  { id: 'shield', label: 'Streak Shield', emoji: '🛡️', color: '#06B6D4', type: 'shield' },
  { id: 'unlock', label: 'Tool Unlock', emoji: '🔓', color: '#EC4899', type: 'unlock' },
  { id: 'retry', label: 'Better Luck!', emoji: '😅', color: '#64748B', type: 'retry' },
];

const TIPS = [
  'SIP mein consistency > timing. Regular invest karo!',
  'Emergency fund = 6 mahine ka kharcha. Pehle yeh!',
  'Credit card ka hamesha full pay karo — minimum = trap!',
  '50-30-20 rule: Needs 50%, Wants 30%, Savings 20%.',
  'Insurance zaroori hai — medical emergency = savings killer!',
  'FD se MF better — long-term mein returns zyada.',
  'Lifestyle inflation se bacho — income badhi to kharcha nahi.',
  'Tax saving ke liye PPF aur ELSS best options hain.',
];

const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

/* ──────────────────────────────────────────────────────────────
   Confetti burst
   ────────────────────────────────────────────────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({ length: 36 }, (_, i) => i);
  const colors = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.6}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Format ms countdown → "23h 45m"
   ────────────────────────────────────────────────────────────── */
function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Abhi spin kar sakte ho!';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ──────────────────────────────────────────────────────────────
   History entry
   ────────────────────────────────────────────────────────────── */
interface HistoryEntry {
  id: string;
  emoji: string;
  label: string;
  color: string;
  time: string;
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export function SpinWheel({ open, onClose }: SpinWheelProps) {
  const { lastSpinTime, totalSpins, spinWinnings, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins } = useAppStore();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick for countdown
  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [open]);

  const cooldownLeft = Math.max(0, DAILY_COOLDOWN - (now - lastSpinTime));
  const canSpin = cooldownLeft === 0 && !spinning;

  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);

    // Pick random segment
    const winIdx = Math.floor(Math.random() * SEG_COUNT);
    const winningSegment = SEGMENTS[winIdx];

    // Calculate target rotation
    // We want the winning segment to land at the top pointer (12 o'clock position)
    // Each segment spans SEG_ANGLE degrees. Segment i center is at i*SEG_ANGLE + SEG_ANGLE/2.
    // We rotate the wheel so that the winning segment's center is at the top (under the pointer).
    // After full rotations, add offset.
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const targetAngle = 360 - (winIdx * SEG_ANGLE + SEG_ANGLE / 2);
    const newRotation = rotation + fullSpins * 360 + (targetAngle - (rotation % 360));

    setRotation(newRotation);

    // After spin animation completes (~4.5s)
    setTimeout(() => {
      setSpinning(false);
      setResult(winningSegment);
      setLastSpinTime(Date.now());
      incrementTotalSpins();

      // Apply reward
      if (winningSegment.type === 'coins' && winningSegment.coinAmount) {
        addSpinWinnings(winningSegment.coinAmount);
      } else if (winningSegment.type === 'badge') {
        addBadge(`mystery-badge-${Date.now()}`);
        addCoins(20); // small coin reward
      } else if (winningSegment.type === 'shield') {
        addBadge('streak-shield');
        addCoins(20);
      }

      // Add to history
      const entry: HistoryEntry = {
        id: `spin-${Date.now()}`,
        emoji: winningSegment.emoji,
        label: winningSegment.label,
        color: winningSegment.color,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((h) => [entry, ...h].slice(0, 8));

      // Show confetti for winning segments
      if (winningSegment.type !== 'retry') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4500);
  }, [canSpin, spinning, rotation, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins]);

  const handleClaim = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-5 border-b border-white/10 glass-card-premium">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
              <Gift size={20} className="text-midnight" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Fortune Ka Daur 🎡</h2>
              <p className="text-xs text-ink-muted mt-0.5">Roz ek free spin — coins, badges aur surprises!</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto">
          {/* Wheel container */}
          <div className="relative w-full aspect-square max-w-xs mx-auto mb-4">
            {showConfetti && <ConfettiBurst />}

            {/* Pointer at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-gold drop-shadow-lg" />

            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gold/30 shadow-[0_0_60px_rgba(245,158,11,0.2)]" />

            {/* Spinning wheel */}
            <motion.div
              className="absolute inset-2 rounded-full overflow-hidden"
              style={{
                background: '#0B1220',
                transformOrigin: 'center',
                rotateY: '0deg',
              }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4.5, ease: [0.17, 0.67, 0.16, 0.99] }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {SEGMENTS.map((seg, i) => {
                  const startAngle = i * SEG_ANGLE - 90;
                  const endAngle = (i + 1) * SEG_ANGLE - 90;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 100 + 100 * Math.cos(startRad);
                  const y1 = 100 + 100 * Math.sin(startRad);
                  const x2 = 100 + 100 * Math.cos(endRad);
                  const y2 = 100 + 100 * Math.sin(endRad);
                  const path = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
                  // Label position
                  const midAngle = (startAngle + endAngle) / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const lx = 100 + 60 * Math.cos(midRad);
                  const ly = 100 + 60 * Math.sin(midRad);
                  return (
                    <g key={seg.id}>
                      <path d={path} fill={seg.color} stroke="#0B1220" strokeWidth="1" opacity={0.85} />
                      <text x={lx} y={ly - 4} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{seg.emoji}</text>
                      <text x={lx} y={ly + 10} fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{seg.label}</text>
                    </g>
                  );
                })}
                {/* Center hub */}
                <circle cx="100" cy="100" r="14" fill="#0B1220" stroke="#F59E0B" strokeWidth="2" />
                <text x="100" y="100" fill="#F59E0B" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">₹</text>
              </svg>
            </motion.div>

            {/* Center overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-midnight border-2 border-gold flex items-center justify-center text-gold-soft text-xl font-bold shadow-lg pointer-events-none">
              ₹
            </div>
          </div>

          {/* Spin button OR countdown */}
          <div className="text-center">
            {canSpin ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSpin}
                disabled={spinning}
                className="btn-3d rounded-2xl px-10 py-4 font-display text-lg font-extrabold text-midnight inline-flex items-center gap-2 shadow-2xl"
                style={{
                  background: spinning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FCD34D, #F59E0B 60%, #D97706)',
                  animation: spinning ? 'none' : 'pulse 2s infinite',
                }}
              >
                {spinning ? 'Spinner Chal Raha Hai... 🌀' : 'SPIN! 🎡'}
              </motion.button>
            ) : spinning ? (
              <div className="rounded-2xl px-8 py-4 bg-white/5 border border-white/10 inline-block">
                <p className="text-sm font-bold text-white">Spinner Chal Raha Hai... 🌀</p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="rounded-2xl px-6 py-4 bg-white/5 border border-gold/30 inline-flex items-center gap-2"
              >
                <Clock size={16} className="text-gold-soft" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gold-soft">Kal Phir Aana! ⏰</p>
                  <p className="text-[10px] text-ink-muted">Next spin in {formatCountdown(cooldownLeft)}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Result reveal */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mt-4 relative rounded-2xl border-2 p-5 text-center overflow-hidden"
                style={{ borderColor: `${result.color}60`, background: `${result.color}15` }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl mb-2"
                >
                  {result.emoji}
                </motion.div>
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Tumhe mila</p>
                <p className="font-display text-xl font-extrabold text-white mb-1">{result.label}!</p>
                {result.type === 'coins' && result.coinAmount && (
                  <p className="text-sm font-bold" style={{ color: result.color }}>+{result.coinAmount} Coins 🎉</p>
                )}
                {result.type === 'tip' && (
                  <div className="mt-2 rounded-lg bg-white/5 border border-white/10 p-2">
                    <p className="text-[11px] text-white/90">{TIPS[Math.floor(Math.random() * TIPS.length)]}</p>
                  </div>
                )}
                {result.type === 'badge' && <p className="text-xs text-ai font-bold">Naya badge unlocked! 🎁</p>}
                {result.type === 'shield' && <p className="text-xs text-cyan-400 font-bold">Streak shield active! 🛡️</p>}
                {result.type === 'unlock' && <p className="text-xs text-pink-400 font-bold">Premium tool unlocked! 🔓</p>}
                {result.type === 'retry' && <p className="text-xs text-ink-muted font-bold">Koi baat nahi, kal phir try karo! 😅</p>}

                <button
                  onClick={handleClaim}
                  className="btn-3d mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-midnight"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
                >
                  Claim Karo! ✅
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center">
              <p className="font-display text-lg font-extrabold text-white">{totalSpins}</p>
              <p className="text-[9px] text-ink-muted uppercase">Total Spins</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center">
              <p className="font-display text-lg font-extrabold text-gold-soft">{spinWinnings}</p>
              <p className="text-[9px] text-ink-muted uppercase">Coins Won</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-center">
              <p className="font-display text-lg font-extrabold text-emerald-soft">{cooldownLeft === 0 ? '✅' : '⏳'}</p>
              <p className="text-[9px] text-ink-muted uppercase">Status</p>
            </div>
          </div>

          {/* History log */}
          <div className="mt-5">
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles size={12} className="text-ai" /> Spin History
            </p>
            {history.length === 0 ? (
              <p className="text-xs text-ink-muted text-center py-4">Abhi tak koi spin nahi. Pehla spin karo! 🎡</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {history.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] p-2"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${h.color}20`, border: `1px solid ${h.color}30` }}>
                      {h.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{h.label}</p>
                      <p className="text-[10px] text-ink-muted">{h.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
