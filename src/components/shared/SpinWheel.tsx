'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  BookOpen,
  Target,
  Flame,
  Gift,
  Lightbulb,
  Sparkles,
  Shield,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

// ─── Segment Data ───────────────────────────────────────────
interface Segment {
  id: string;
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  type: 'coins' | 'tip' | 'challenge' | 'shield' | 'mystery' | 'wisdom';
  coinAmount?: number;
}

const SEGMENTS: Segment[] = [
  { id: 'coins-10', label: '10 Coins', emoji: '🪙', color: '#b45309', borderColor: '#92400e', type: 'coins', coinAmount: 10 },
  { id: 'tip', label: 'Financial Tip', emoji: '📚', color: '#1d4ed8', borderColor: '#1e40af', type: 'tip' },
  { id: 'coins-25', label: '25 Coins', emoji: '🪙', color: '#d97706', borderColor: '#b45309', type: 'coins', coinAmount: 25 },
  { id: 'challenge', label: 'Daily Challenge', emoji: '🎯', color: '#15803d', borderColor: '#166534', type: 'challenge' },
  { id: 'coins-50', label: '50 Coins', emoji: '🪙', color: '#eab308', borderColor: '#ca8a04', type: 'coins', coinAmount: 50 },
  { id: 'shield', label: 'Streak Shield', emoji: '🔥', color: '#c2410c', borderColor: '#9a3412', type: 'shield' },
  { id: 'mystery', label: 'Mystery Box', emoji: '🎁', color: '#7c3aed', borderColor: '#6d28d9', type: 'mystery' },
  { id: 'wisdom', label: 'Wisdom Quote', emoji: '💡', color: '#0d9488', borderColor: '#0f766e', type: 'wisdom' },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length; // 45 degrees

// ─── Financial Tips Pool ────────────────────────────────────
const FINANCIAL_TIPS = [
  "SIP mein consistency sabse important hai — chota amount bhi regularly invest karo!",
  "Emergency fund = 6 mahine ka kharcha — pehle yeh banao!",
  "Credit card bill hamesha full pay karo — minimum payment = debt trap!",
  "50-30-20 rule: 50% needs, 30% wants, 20% savings",
  "Insurance zaroori hai — medical emergency mein savings khatam ho sakti hain!",
  "FD se zyada return dete hai equity mutual funds — long term mein!",
  "Har mahine apne expenses track karo — surprise se bachoge!",
  "Lifestyle inflation se bacho — income badhne pe kharcha nahi badhana!",
  "Tax saving ke liye PPF aur ELSS best options hain!",
  "P2P lending aur crypto mein caution rakho — high risk hai!",
];

// ─── Daily Challenges Pool ──────────────────────────────────
const DAILY_CHALLENGES = [
  "Aaj ₹100 kam kharch karo aur savings mein daalo!",
  "Aaj koi unnecessary subscription cancel karo!",
  "Kisi bhi expense pe 24 ghante sochne ka rule follow karo!",
  "Aaj apna net worth calculate karo!",
  "Kisi family member ko ek financial tip sikhao!",
  "Aaj homemade khana banao — delivery se paise bachao!",
  "Apne saare subscriptions ka total nikalo — kahan cut kar sakte ho?",
  "Ek naya financial term aaj seekho aur use karo!",
];

// ─── Wisdom Quotes Pool ─────────────────────────────────────
const WISDOM_QUOTES = [
  { text: "Paise se paise bante hain — lekin sirf agar tum unhe kaam pe lagaao!", author: "Rupaiya Wisdom" },
  { text: "Rich banne ka shortcut nahi hota — lekin poor banne ke bahut shortcuts hain!", author: "Financial Wisdom" },
  { text: "Jo log paisa save karte hain, woh future mein freedom kharidte hain!", author: "Rupaiya Wisdom" },
  { text: "Investment mein time zaroori hai — patience returns deta hai!", author: "Financial Wisdom" },
  { text: "Har rupee ka hisaab rakhna — yeh amiron ka secret hai!", author: "Rupaiya Wisdom" },
  { text: "Abhi chota sacrifice = future mein bada comfort!", author: "Financial Wisdom" },
  { text: "Financial literacy sabse bada asset hai — koi tax nahi lagta!", author: "Rupaiya Wisdom" },
  { text: "Compound interest duniya ka 8th wonder hai — use samjho!", author: "Albert Einstein" },
];

// ─── Spin cost & cooldown ───────────────────────────────────
const SPIN_COST = 5;
const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

// ─── Confetti Component ─────────────────────────────────────
function ConfettiBurst() {
  const colors = ['#fbbf24', '#f59e0b', '#22c55e', '#a855f7', '#ef4444', '#3b82f6', '#ec4899'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1 + Math.random() * 1.5;
        const size = 4 + Math.random() * 6;
        const color = colors[i % colors.length];
        const rotation = Math.random() * 360;
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${x}%`,
              top: '40%',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
            initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{
              y: [0, -(100 + Math.random() * 150)],
              x: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 200],
              opacity: [1, 1, 0],
              rotate: [0, rotation + 360],
              scale: [1, 1.2, 0.3],
            }}
            transition={{ duration, delay, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// ─── Coin Counter Animation ─────────────────────────────────
function CoinCounterAnim({ amount }: { amount: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const steps = 20;
    const increment = amount / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= amount) {
        setDisplay(amount);
        clearInterval(interval);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 40);
    return () => clearInterval(interval);
  }, [amount]);

  return (
    <span className="text-gradient-gold text-5xl font-black number-highlight">
      {display}
    </span>
  );
}

// ─── Reward Reveal Component ────────────────────────────────
function RewardReveal({
  segment,
  onCollect,
}: {
  segment: Segment;
  onCollect: () => void;
}) {
  const [showMystery, setShowMystery] = useState(false);

  // Use useMemo for random selections to avoid setState in effect
  const tipText = useMemo(
    () => segment.type === 'tip' ? FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)] : '',
    [segment]
  );
  const challengeText = useMemo(
    () => segment.type === 'challenge' ? DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)] : '',
    [segment]
  );
  const wisdomQuote = useMemo(
    () => segment.type === 'wisdom' ? WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)] : { text: '', author: '' },
    [segment]
  );
  const mysteryAmount = useMemo(() => {
    if (segment.type !== 'mystery') return 0;
    const amounts = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
    const weights = [20, 18, 15, 12, 10, 8, 7, 5, 3, 2];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < amounts.length; i++) {
      random -= weights[i];
      if (random <= 0) return amounts[i];
    }
    return 5;
  }, [segment]);

  useEffect(() => {
    if (segment.type === 'mystery') {
      const timer = setTimeout(() => setShowMystery(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [segment.type]);

  const isBigWin = segment.type === 'coins' && (segment.coinAmount ?? 0) >= 50 || (segment.type === 'mystery' && mysteryAmount >= 50);

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-4 relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {isBigWin && <ConfettiBurst />}

      {/* Coin reward */}
      {segment.type === 'coins' && (
        <>
          <motion.div
            className="text-6xl"
            animate={{ y: [0, -12, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.8, repeat: 2, ease: 'easeInOut' }}
          >
            {segment.emoji}
          </motion.div>
          <div>
            <p className="text-sm text-[#8888a0] mb-1">Tumne jeete!</p>
            <CoinCounterAnim amount={segment.coinAmount ?? 0} />
            <p className="text-lg font-bold text-amber-400 mt-1">Coins 🪙</p>
          </div>
        </>
      )}

      {/* Financial Tip */}
      {segment.type === 'tip' && (
        <motion.div
          className="w-full max-w-xs"
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ perspective: 600 }}
        >
          <div className="glass-card-glow p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-bold text-sm">Financial Tip</span>
            </div>
            <p className="text-[#e8e8ed] text-sm leading-relaxed">{tipText}</p>
          </div>
        </motion.div>
      )}

      {/* Daily Challenge */}
      {segment.type === 'challenge' && (
        <motion.div
          className="w-full max-w-xs"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="glass-card-glow p-5 rounded-xl border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold text-sm">Aaj Ka Challenge</span>
            </div>
            <p className="text-[#e8e8ed] text-sm leading-relaxed">{challengeText}</p>
          </div>
        </motion.div>
      )}

      {/* Streak Shield */}
      {segment.type === 'shield' && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
            style={{
              background: 'radial-gradient(circle, rgba(249,115,22,0.3), rgba(249,115,22,0.1))',
              boxShadow: '0 0 30px rgba(249,115,22,0.4), 0 0 60px rgba(249,115,22,0.15)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.1)',
                '0 0 40px rgba(249,115,22,0.5), 0 0 80px rgba(249,115,22,0.2)',
                '0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.1)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-10 h-10 text-orange-400" />
          </motion.div>
          <p className="text-orange-400 font-bold text-lg">Streak Shield</p>
          <p className="text-sm text-[#8888a0] mt-1">1 din ka streak safe! 🔥</p>
        </motion.div>
      )}

      {/* Mystery Box */}
      {segment.type === 'mystery' && (
        <div className="flex flex-col items-center">
          {!showMystery ? (
            <motion.div
              className="relative"
              animate={{ rotate: [0, -3, 3, -3, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <motion.div
                className="text-7xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                🎁
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className="text-sm text-[#8888a0] mb-1">Mystery Box se mila!</p>
              <CoinCounterAnim amount={mysteryAmount} />
              <p className="text-lg font-bold text-purple-400 mt-1">Coins 🪙</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Wisdom Quote */}
      {segment.type === 'wisdom' && (
        <motion.div
          className="w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="p-5 rounded-xl relative overflow-hidden"
            style={{
              background: 'rgba(13,148,136,0.1)',
              border: '2px solid rgba(13,148,136,0.3)',
              boxShadow: '0 0 20px rgba(13,148,136,0.1)',
            }}
          >
            <div className="absolute top-3 left-3 text-2xl opacity-30">❝</div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-teal-400" />
              <span className="text-teal-400 font-bold text-sm">Rupaiya Wisdom</span>
            </div>
            <p className="text-[#e8e8ed] text-sm leading-relaxed italic mb-3">"{wisdomQuote.text}"</p>
            {wisdomQuote.author && (
              <p className="text-xs text-teal-400/70">— {wisdomQuote.author}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Collect button */}
      <motion.button
        onClick={onCollect}
        className="btn-gold px-8 py-3 rounded-xl text-base font-bold mt-2 min-w-[160px]"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Collect! ✨
      </motion.button>
    </motion.div>
  );
}

// ─── Main SpinWheel Component ───────────────────────────────
interface SpinWheelProps {
  open: boolean;
  onClose: () => void;
}

export function SpinWheel({ open, onClose }: SpinWheelProps) {
  const {
    coins,
    lastSpinTime,
    totalSpins,
    spinWinnings,
    spendCoins,
    setLastSpinTime,
    incrementTotalSpins,
    addSpinWinnings,
    addCoins,
  } = useAppStore();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningSegment, setWinningSegment] = useState<Segment | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [mysteryCoins, setMysteryCoins] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Cooldown calculation
  const now = Date.now();
  const timeSinceLastSpin = now - lastSpinTime;
  const canSpin = timeSinceLastSpin >= COOLDOWN_MS;
  const hasEnoughCoins = coins >= SPIN_COST;
  const [cooldownDisplay, setCooldownDisplay] = useState('');

  // Update cooldown timer display
  useEffect(() => {
    if (!open) return;

    const updateTimer = () => {
      const elapsed = Date.now() - lastSpinTime;
      const remaining = COOLDOWN_MS - elapsed;
      if (remaining <= 0) {
        setCooldownDisplay('');
        return;
      }
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setCooldownDisplay(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [open, lastSpinTime]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setShowReward(false);
      setWinningSegment(null);
      setSpinning(false);
    }
  }, [open]);

  const handleSpin = useCallback(() => {
    if (spinning || !canSpin || !hasEnoughCoins) return;

    // Spend coins for spin
    const spent = spendCoins(SPIN_COST);
    if (!spent) return;

    setSpinning(true);
    setShowReward(false);
    setWinningSegment(null);

    // Pick a random segment
    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segment = SEGMENTS[segmentIndex];

    // Calculate the rotation to land on the segment
    // The pointer is at the top (270 degrees from 3 o'clock)
    // Each segment is SEGMENT_ANGLE degrees
    // To land on segment i, the center of segment i should be at the top
    // Segment i center angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE/2
    // We need to rotate so that this center is at 270 degrees
    const segmentCenter = segmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    // Target rotation to align segment center with top (270 degrees / -90 degrees)
    // Since wheel rotates clockwise, we need to calculate offset
    const targetAngle = 360 - segmentCenter + 90; // +90 because pointer at top
    // Add multiple full rotations for dramatic effect
    const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = fullRotations * 360 + targetAngle;

    // Add small random offset within segment for realism
    const randomOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE * 0.6);
    const finalRotation = rotation + totalRotation + randomOffset;

    setRotation(finalRotation);

    // After spin stops, show reward
    setTimeout(() => {
      setSpinning(false);
      setWinningSegment(segment);

      // Calculate coins for mystery
      if (segment.type === 'mystery') {
        const amounts = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
        const weights = [20, 18, 15, 12, 10, 8, 7, 5, 3, 2];
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let chosen = 5;
        for (let i = 0; i < amounts.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            chosen = amounts[i];
            break;
          }
        }
        setMysteryCoins(chosen);
      }

      setShowReward(true);
      setLastSpinTime(Date.now());
      incrementTotalSpins();
    }, 4500); // Match CSS transition duration
  }, [spinning, canSpin, hasEnoughCoins, spendCoins, rotation, setLastSpinTime, incrementTotalSpins]);

  const handleCollect = useCallback(() => {
    if (!winningSegment) return;

    if (winningSegment.type === 'coins') {
      addSpinWinnings(winningSegment.coinAmount ?? 0);
    } else if (winningSegment.type === 'mystery') {
      addSpinWinnings(mysteryCoins);
    } else if (winningSegment.type === 'shield') {
      addCoins(5); // Small coin bonus with shield
    } else {
      addCoins(3); // Small coin bonus for tips/challenges/wisdom
    }

    setShowReward(false);
    setWinningSegment(null);
  }, [winningSegment, mysteryCoins, addSpinWinnings, addCoins]);

  // SVG wheel segments
  const renderWheel = () => {
    const radius = 140;
    const center = 150;

    return (
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full"
        style={{ transform: 'rotate(0deg)' }}
      >
        {/* Outer gold ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          opacity="0.5"
        />

        {/* Gold dot ticks around the wheel */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          const rad = (angle * Math.PI) / 180;
          const x = center + (radius + 8) * Math.cos(rad);
          const y = center + (radius + 8) * Math.sin(rad);
          return (
            <circle
              key={`tick-${i}`}
              cx={x}
              cy={y}
              r={1.5}
              fill="#f59e0b"
              opacity={0.6}
            />
          );
        })}

        {/* Segments */}
        {SEGMENTS.map((segment, i) => {
          const startAngle = i * SEGMENT_ANGLE;
          const endAngle = (i + 1) * SEGMENT_ANGLE;
          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;

          const x1 = center + radius * Math.cos(startRad);
          const y1 = center + radius * Math.sin(startRad);
          const x2 = center + radius * Math.cos(endRad);
          const y2 = center + radius * Math.sin(endRad);

          const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

          const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          // Text positioning
          const textAngle = startAngle + SEGMENT_ANGLE / 2;
          const textRad = ((textAngle - 90) * Math.PI) / 180;
          const textRadius = radius * 0.65;
          const tx = center + textRadius * Math.cos(textRad);
          const ty = center + textRadius * Math.sin(textRad);

          // Emoji positioning (slightly further out)
          const emojiRadius = radius * 0.45;
          const ex = center + emojiRadius * Math.cos(textRad);
          const ey = center + emojiRadius * Math.sin(textRad);

          return (
            <g key={segment.id}>
              <path
                d={pathData}
                fill={segment.color}
                stroke={segment.borderColor}
                strokeWidth="1.5"
                style={{
                  filter: winningSegment?.id === segment.id && showReward
                    ? 'brightness(1.4)'
                    : i % 2 === 0
                    ? 'brightness(1)'
                    : 'brightness(0.85)',
                }}
              />
              {/* Emoji */}
              <text
                x={ex}
                y={ey}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="22"
                style={{ userSelect: 'none' }}
              >
                {segment.emoji}
              </text>
              {/* Label text */}
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="bold"
                fill="white"
                style={{
                  userSelect: 'none',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}
                transform={`rotate(${textAngle}, ${tx}, ${ty})`}
              >
                {segment.label}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle
          cx={center}
          cy={center}
          r="28"
          fill="#1a1a2e"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />
        <circle
          cx={center}
          cy={center}
          r="24"
          fill="url(#hubGradient)"
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          fontWeight="900"
          fill="#0a0a0f"
        >
          ₹
        </text>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="hubGradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>
      </svg>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="bg-[#0a0a0f] border-white/[0.08] sm:max-w-md p-0 overflow-hidden"
        showCloseButton={!spinning}
      >
        <DialogTitle className="sr-only">Spin Wheel - Fortune Ka Daur</DialogTitle>

        <div className="glass-card-glow p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-gradient-gold">Fortune Ka Daur</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
              disabled={spinning}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mb-4 text-xs">
            <div className="stat-card flex-1 py-2 px-3">
              <p className="text-[#8888a0]">Total Spins</p>
              <p className="text-amber-400 font-bold text-sm">{totalSpins}</p>
            </div>
            <div className="stat-card flex-1 py-2 px-3">
              <p className="text-[#8888a0]">Won from Spins</p>
              <p className="text-amber-400 font-bold text-sm">🪙 {spinWinnings}</p>
            </div>
            <div className="stat-card flex-1 py-2 px-3">
              <p className="text-[#8888a0]">Balance</p>
              <p className="text-amber-400 font-bold text-sm">🪙 {coins}</p>
            </div>
          </div>

          {/* Wheel container */}
          <div className="relative flex items-center justify-center mb-4">
            {/* Pointer / Arrow at top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
              style={{ marginTop: '-2px' }}
            >
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '18px solid #f59e0b',
                  filter: 'drop-shadow(0 2px 4px rgba(245,158,11,0.5))',
                }}
              />
            </div>

            {/* Spinning wheel */}
            <div
              ref={wheelRef}
              className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                  : 'none',
              }}
            >
              {renderWheel()}
            </div>

            {/* Glow effect when won */}
            {showReward && winningSegment && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `0 0 40px ${winningSegment.color}40, 0 0 80px ${winningSegment.color}20`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* Spin button */}
          <div className="flex flex-col items-center gap-3">
            {!showReward ? (
              <>
                <motion.button
                  onClick={handleSpin}
                  disabled={spinning || !canSpin || !hasEnoughCoins}
                  className={`
                    relative px-8 py-3 rounded-xl text-base font-bold transition-all
                    ${spinning
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : canSpin && hasEnoughCoins
                      ? 'btn-gold cursor-pointer'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  whileHover={canSpin && hasEnoughCoins && !spinning ? { scale: 1.05 } : {}}
                  whileTap={canSpin && hasEnoughCoins && !spinning ? { scale: 0.95 } : {}}
                >
                  {spinning ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                      Ghumm raha hai...
                    </span>
                  ) : canSpin && hasEnoughCoins ? (
                    <span className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Ghumao! (₹{SPIN_COST})
                    </span>
                  ) : null}
                </motion.button>

                {/* Status messages */}
                {!hasEnoughCoins && canSpin && (
                  <motion.p
                    className="text-sm text-red-400/80"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Pehle thode coins kamaao! 💪
                  </motion.p>
                )}
                {!canSpin && cooldownDisplay && (
                  <motion.p
                    className="text-sm text-[#8888a0]"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Agle spin mein <span className="text-amber-400 font-mono font-bold">{cooldownDisplay}</span> bache hain
                  </motion.p>
                )}
                {canSpin && hasEnoughCoins && !spinning && (
                  <p className="text-xs text-[#8888a0]">
                    Spin ka kharch: 🪙 {SPIN_COST} coins
                  </p>
                )}
              </>
            ) : (
              <AnimatePresence mode="wait">
                {winningSegment && (
                  <RewardReveal
                    key={winningSegment.id}
                    segment={winningSegment}
                    onCollect={handleCollect}
                  />
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Cooldown bar */}
          {!canSpin && !showReward && (
            <div className="mt-4">
              <div className="journey-progress-track">
                <div
                  className="journey-progress-fill"
                  style={{ width: `${Math.min(100, (timeSinceLastSpin / COOLDOWN_MS) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-[#8888a0] text-center mt-1">
                Cooldown progress
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
