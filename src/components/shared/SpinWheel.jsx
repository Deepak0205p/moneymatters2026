'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Clock, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const SEGMENTS = [
  {
    id: 'c50',
    label: '+50 Coins',
    emoji: '🪙',
    color: '#F59E0B',
    type: 'coins',
    coinAmount: 50
  },
  {
    id: 'tip',
    label: 'Financial Tip',
    emoji: '💡',
    color: '#3B82F6',
    type: 'tip'
  },
  {
    id: 'c100',
    label: '+100 Coins',
    emoji: '💰',
    color: '#10B981',
    type: 'coins',
    coinAmount: 100
  },
  {
    id: 'badge',
    label: 'Mystery Badge',
    emoji: '🎁',
    color: '#8B5CF6',
    type: 'badge'
  },
  {
    id: 'c25',
    label: '+25 Coins',
    emoji: '🪙',
    color: '#FCD34D',
    type: 'coins',
    coinAmount: 25
  },
  {
    id: 'shield',
    label: 'Streak Shield',
    emoji: '🛡️',
    color: '#06B6D4',
    type: 'shield'
  },
  {
    id: 'unlock',
    label: 'Tool Unlock',
    emoji: '🔓',
    color: '#EC4899',
    type: 'unlock'
  },
  {
    id: 'retry',
    label: 'Better Luck!',
    emoji: '😅',
    color: '#64748B',
    type: 'retry'
  }
];

const TIPS = [
  'SIP mein consistency > timing. Regular invest karo!',
  'Emergency fund = 6 mahine ka kharcha. Pehle yeh!',
  'Credit card ka hamesha full pay karo — minimum = trap!',
  '50-30-20 rule: Needs 50%, Wants 30%, Savings 20%.',
  'Insurance zaroori hai — medical emergency = savings killer!',
  'FD se MF better — long-term mein returns zyada.',
  'Lifestyle inflation se bacho — income badhi to kharcha nahi.',
  'Tax saving ke liye PPF aur ELSS best options hain.'
];

const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

function ConfettiBurst() {
  const pieces = Array.from({ length: 36 }, (_, i) => i);
  const colors = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map(i => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.6}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Abhi spin kar sakte ho!';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function SpinWheel({ open, onClose }) {
  const {
    lastSpinTime,
    totalSpins,
    spinWinnings,
    setLastSpinTime,
    incrementTotalSpins,
    addSpinWinnings,
    addBadge,
    addCoins
  } = useAppStore();

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [history, setHistory] = useState([]);
  const [tipMessage, setTipMessage] = useState('');
  const tickRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [open]);

  const cooldownLeft = Math.max(0, DAILY_COOLDOWN - (now - (lastSpinTime || 0)));
  const canSpin = cooldownLeft === 0 && !spinning;

  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);

    const winIdx = Math.floor(Math.random() * SEG_COUNT);
    const winningSegment = SEGMENTS[winIdx];

    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = 360 - (winIdx * SEG_ANGLE + SEG_ANGLE / 2);
    const newRotation = rotation + fullSpins * 360 + (targetAngle - (rotation % 360));
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(winningSegment);
      setLastSpinTime(Date.now());
      incrementTotalSpins();

      if (winningSegment.type === 'coins' && winningSegment.coinAmount) {
        addSpinWinnings(winningSegment.coinAmount);
        addCoins(winningSegment.coinAmount);
      } else if (winningSegment.type === 'badge') {
        addBadge(`mystery-badge-${Date.now()}`);
        addCoins(20);
      } else if (winningSegment.type === 'shield') {
        addBadge('streak-shield');
        addCoins(20);
      } else if (winningSegment.type === 'tip') {
        setTipMessage(TIPS[Math.floor(Math.random() * TIPS.length)]);
      }

      const entry = {
        id: `spin-${Date.now()}`,
        emoji: winningSegment.emoji,
        label: winningSegment.label,
        color: winningSegment.color,
        time: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setHistory(h => [entry, ...h].slice(0, 8));

      if (winningSegment.type !== 'retry') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4500);
  }, [canSpin, spinning, rotation, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins]);

  const handleClaim = useCallback(() => {
    setResult(null);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-md bg-[#090D1A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Gift size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Kismat Chakra 🎡</h2>
              <p className="text-[10px] text-zinc-400">Roz ek free spin — win coins and badges!</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* Wheel Frame */}
          <div className="relative w-full aspect-square max-w-[260px] mx-auto mb-4 flex items-center justify-center">
            {showConfetti && <ConfettiBurst />}

            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" />

            {/* Rotating Wheel Container */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)] flex items-center justify-center">
              <motion.div
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  transformOrigin: 'center'
                }}
                animate={{
                  rotate: rotation
                }}
                transition={{
                  duration: 4.5,
                  ease: [0.17, 0.67, 0.16, 0.99]
                }}
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
                    
                    const midAngle = (startAngle + endAngle) / 2;
                    const midRad = (midAngle * Math.PI) / 180;
                    const lx = 100 + 62 * Math.cos(midRad);
                    const ly = 100 + 62 * Math.sin(midRad);

                    return (
                      <g key={seg.id}>
                        <path
                          d={path}
                          fill={seg.color}
                          stroke="#090D1A"
                          strokeWidth="1.5"
                          opacity={0.9}
                        />
                        <text
                          x={lx}
                          y={ly - 4}
                          fill="white"
                          fontSize="12"
                          fontWeight="black"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {seg.emoji}
                        </text>
                        <text
                          x={lx}
                          y={ly + 8}
                          fill="white"
                          fontSize="5.5"
                          fontWeight="black"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="100" cy="100" r="15" fill="#090D1A" stroke="#F59E0B" strokeWidth="2.5" />
                </svg>
              </motion.div>
            </div>

            {/* Absolute Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#090D1A] border-2 border-amber-400 flex items-center justify-center text-amber-400 text-lg font-black shadow-lg pointer-events-none">
              ₹
            </div>
          </div>

          {/* Action Spin Area */}
          <div className="text-center">
            {canSpin ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpin}
                disabled={spinning}
                className="px-10 py-4 font-black text-sm uppercase tracking-wider text-black rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
              >
                SPIN! 🎡
              </motion.button>
            ) : spinning ? (
              <div className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-2xl inline-block text-xs font-black uppercase tracking-wider text-zinc-400">
                Spining Wheel... 🌀
              </div>
            ) : (
              <div className="px-6 py-4 bg-white/5 border border-amber-500/20 rounded-2xl inline-flex items-center gap-3 text-left">
                <Clock size={16} className="text-amber-400" />
                <div>
                  <p className="text-xs font-black text-amber-400 uppercase tracking-wider">Next Spin Ready Kal!</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                    Spin in: {formatCountdown(cooldownLeft)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Spin Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="p-5 rounded-3xl border-2 text-center space-y-3 relative overflow-hidden"
                style={{
                  borderColor: `${result.color}30`,
                  background: `${result.color}10`
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-15" style={{ backgroundColor: result.color }} />
                
                <span className="text-5xl block animate-bounce">{result.emoji}</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">CONGRATULATIONS</span>
                <h3 className="text-base font-black text-white">{result.label} Won!</h3>

                {result.type === 'coins' && result.coinAmount && (
                  <p className="text-xs font-black text-emerald-400">+ {result.coinAmount} Coins added to balance!</p>
                )}
                {result.type === 'tip' && (
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-zinc-300 leading-relaxed font-semibold italic text-left">
                    🧠 {tipMessage || TIPS[0]}
                  </div>
                )}
                {result.type === 'badge' && (
                  <p className="text-xs font-black text-purple-400">Naya badge added to Sammaan Gallery! 🏆</p>
                )}
                {result.type === 'shield' && (
                  <p className="text-xs font-black text-cyan-400">Streak Shield active! Daily checklist skipped shield 🛡️</p>
                )}
                {result.type === 'retry' && (
                  <p className="text-xs font-black text-zinc-500">Koi baat nahi, consistency is the key! 💪</p>
                )}

                <button
                  onClick={handleClaim}
                  className="w-full py-3 rounded-xl text-black text-xs font-black uppercase tracking-wider transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${result.color}, #ffffff)`
                  }}
                >
                  Claim Prize ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mini Stats Panel */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-0.5">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">Total Spins</span>
              <span className="text-sm font-black text-white">{totalSpins}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center space-y-0.5">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">Spin Winnings</span>
              <span className="text-sm font-black text-amber-400">{spinWinnings} 🪙</span>
            </div>
          </div>

          {/* History log */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" /> Spin History
            </h4>

            {history.length === 0 ? (
              <p className="text-[11px] text-zinc-600 text-center py-4 bg-white/[0.01] border border-dashed border-white/[0.03] rounded-2xl">
                Spin now to fill spin logs history!
              </p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scroll">
                {history.map((h) => (
                  <div 
                    key={h.id} 
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] justify-between text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 border"
                        style={{
                          backgroundColor: `${h.color}15`,
                          borderColor: `${h.color}30`
                        }}
                      >
                        {h.emoji}
                      </span>
                      <span className="text-xs font-black text-white truncate">{h.label}</span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-bold shrink-0">{h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-[#0C1021]/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
            Kismat Chakra — spins are restricted to 1 spin per user account daily
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { SpinWheel };