'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { DEBT_DOORS } from '@/lib/constants';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DoorOpen,
  CreditCard,
  Smartphone,
  Layers,
  AlertTriangle,
  HandCoins,
  ShieldAlert,
  Skull,
  LogOut,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  Snowflake,
  ArrowLeftRight,
  MessageSquare,
  TrendingUp,
  Scissors,
} from 'lucide-react';

// ─── Door Content Data ────────────────────────────────────
const DOOR_CONTENT: Record<number, {
  description: string;
  math: string;
  warning: string;
  icon: React.ElementType;
}> = {
  1: {
    description:
      'Credit card free money lagta hai... lekin 36% interest! Agar tum Rs.50,000 spend karo aur minimum payment karo, toh sirf interest mein Rs.18,000/year lagenge.',
    math: 'Rs.50,000 @ 36% = Rs.18,000/year sirf interest',
    warning: 'Minimum payment = lifetime payment!',
    icon: CreditCard,
  },
  2: {
    description:
      'EMI pe phone liya? Rs.1,00,000 ka phone 24 EMI mein — lagta hai affordable hai. Lekin hidden processing fee + interest se real cost Rs.1,20,000+ ho jayega!',
    math: 'Rs.1,00,000 phone → EMI total: Rs.1,20,000+ (20% extra!)',
    warning: 'Chhota EMI = Chhota chhota loss, bada total!',
    icon: Smartphone,
  },
  3: {
    description:
      'Ek card se doosre card pe balance transfer — lagta hai smart move hai! Lekin har naye card ka apna interest + fees hai. Debt badhta gaya...',
    math: '3 cards × Rs.30,000 = Rs.90,000 total debt spiral',
    warning: 'Cards add karne se debt kam nahi hota, zyada hota hai!',
    icon: Layers,
  },
  4: {
    description:
      'Minimum payment sirf interest cover karta hai — principal almost nahi utarta! 5 saal tak minimum pay karo, original amount utni hi rahegi.',
    math: 'Rs.50,000 minimum pay × 5 years = Rs.50,000 + Rs.90,000 interest = Rs.1,40,000!',
    warning: 'Principal utarna = sapna, minimum payment mein!',
    icon: AlertTriangle,
  },
  5: {
    description:
      'Debt se debt pay karne ka socha? Personal loan liya credit card bharnne ke liye? Yeh bhi ek trap hai — personal loan bhi 15-24% interest!',
    math: 'Personal loan Rs.3L @ 18% × 3yr = Rs.3,89,000 total repayment',
    warning: 'Debt se debt bharna = aag mein ghee daalna!',
    icon: HandCoins,
  },
  6: {
    description:
      'CIBIL score gir gaya! Late payments, high utilization, multiple inquiries — ab koi bhi loan nahi milega acchi rate pe. Ghar, gaadi — sab mushkil!',
    math: 'CIBIL 750+ → 680: Loan rate 8% se 14% jump = Lakhs extra interest',
    warning: 'CIBIL score girna = financial jail ka darwaza!',
    icon: ShieldAlert,
  },
  7: {
    description:
      'Puri debt trap mein phas gaye! Multiple loans, minimum payments, girte hue CIBIL score — lagta hai koi raasta nahi hai. LEKIN HAI! EXIT door kholo!',
    math: 'Total trap: Rs.5-10 lakh debt, 30-40% income EMI mein, zero savings',
    warning: 'Bahut late ho gaya... lekin abhi bhi waqt hai!',
    icon: Skull,
  },
};

// ─── Exit Strategies ───────────────────────────────────────
const EXIT_STRATEGIES = [
  {
    id: 1,
    title: 'Avalanche Method',
    description: 'Sabse zyada interest wale debt ko pehle bharo. Math ke hisaab se sabse kam total interest pay karoge.',
    icon: Snowflake,
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Snowball Method',
    description: 'Sabse chhota debt ko pehle bharo. Quick wins se motivation milega — psychological advantage!',
    icon: Layers,
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: 'Balance Transfer',
    description: 'High interest card ka balance low interest card pe transfer karo. Processing fee check karo pehle!',
    icon: ArrowLeftRight,
    color: '#06b6d4',
  },
  {
    id: 4,
    title: 'Bank se Negotiate',
    description: 'Bank ko call karo — interest rate reduce karne ke liye bol. Many people don\'t know ye possible hai!',
    icon: MessageSquare,
    color: '#10b981',
  },
  {
    id: 5,
    title: 'Income Badhao',
    description: 'Side hustle, freelance, part-time job — extra income seedha debt repayment mein daalo.',
    icon: TrendingUp,
    color: '#f59e0b',
  },
  {
    id: 6,
    title: 'Kharcha Kaato',
    description: 'Subscriptions cancel, eating out band, unnecessary expenses zero — har bachat debt bharti hai.',
    icon: Scissors,
    color: '#ef4444',
  },
];

// ─── Single Door Component ─────────────────────────────────
function Door({
  doorData,
  index,
  isOpen,
  isRevealed,
  onClick,
}: {
  doorData: (typeof DEBT_DOORS)[number];
  index: number;
  isOpen: boolean;
  isRevealed: boolean;
  onClick: () => void;
}) {
  const content = DOOR_CONTENT[doorData.id];
  const IconComp = content?.icon || DoorOpen;
  const darkness = index / 7;

  return (
    <div className="flex-shrink-0 w-full sm:w-[260px] sm:max-w-[300px]">
      {/* Door Frame */}
      <div
        className="relative rounded-xl overflow-hidden border-2"
        style={{
          borderColor: isOpen ? doorData.color : 'rgba(255,255,255,0.08)',
          perspective: '800px',
          height: 'min(380px, 70vh)',
          background: `linear-gradient(180deg, rgba(${Math.round(26 - darkness * 20)},${Math.round(26 - darkness * 20)},${Math.round(46 - darkness * 30)},1) 0%, rgba(${Math.round(15 + darkness * 40)},${Math.round(10 + darkness * 5)},${Math.round(10 + darkness * 5)},1) 100%)`,
        }}
      >
        {/* Door panel - 3D open animation */}
        <div
          className="absolute inset-0 z-10 transition-transform duration-700 ease-in-out"
          style={{
            transformOrigin: 'left center',
            transform: isOpen ? 'rotateY(-85deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front of door */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 rounded-xl"
            style={{
              backfaceVisibility: 'hidden',
              background: `linear-gradient(180deg, #1a1a2e 0%, ${doorData.color}33 100%)`,
              border: `1px solid ${doorData.color}44`,
            }}
          >
            {/* Door number */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-sm font-black"
              style={{ backgroundColor: `${doorData.color}30`, color: doorData.color }}
            >
              {doorData.id}
            </div>

            <IconComp size={32} style={{ color: doorData.color }} className="mb-3" />

            <h3 className="text-base font-bold text-white text-center mb-1">
              {doorData.title}
            </h3>
            <p className="text-xs text-[#a0a0b8] text-center mb-4 font-medium">
              {doorData.subtitle}
            </p>

            {!isOpen && (
              <Button
                onClick={onClick}
                size="sm"
                className="text-xs font-semibold border ripple-effect"
                style={{
                  backgroundColor: `${doorData.color}20`,
                  color: doorData.color,
                  borderColor: `${doorData.color}44`,
                }}
              >
                <DoorOpen className="w-3 h-3 mr-1" />
                Kholo!
              </Button>
            )}
          </div>

          {/* Back of door */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#0a0a0f',
              border: `1px solid ${doorData.color}22`,
            }}
          >
            <span className="text-[#a0a0b8] text-xs">...</span>
          </div>
        </div>

        {/* Content behind the door */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 p-4 flex flex-col z-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Door title */}
              <div className="mb-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mb-1"
                  style={{ backgroundColor: `${doorData.color}30`, color: doorData.color }}
                >
                  Door {doorData.id}/7
                </span>
                <h4 className="text-sm font-bold text-white">{doorData.title}</h4>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed mb-3 flex-1">
                {content?.description}
              </p>

              {/* Math box */}
              <div
                className="rounded-lg p-2 mb-2"
                style={{ backgroundColor: `${doorData.color}10`, border: `1px solid ${doorData.color}22` }}
              >
                <p className="text-[10px] text-[#a0a0b8] mb-0.5 font-medium">Calculation:</p>
                <p className="text-xs font-bold" style={{ color: doorData.color }}>
                  {content?.math}
                </p>
              </div>

              {/* Warning */}
              <div className="bg-red-950/40 border border-red-500/20 rounded-lg p-2">
                <p className="text-xs text-red-400 font-bold">
                  ⚠️ {content?.warning}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label below */}
      <div className="text-center mt-2">
        <span className="text-[10px] text-[#a0a0b8] font-medium">
          {doorData.title}
        </span>
      </div>
    </div>
  );
}

// ─── Exit Section Component ────────────────────────────────
function ExitSection({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* EXIT Header */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 mb-3 glow-green"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <LogOut className="w-9 h-9 text-emerald-400" />
        </motion.div>
        <motion.h2
          className="text-2xl font-black text-emerald-400 mb-1 text-glow-gold"
          style={{ textShadow: '0 0 20px rgba(34,197,94,0.4)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          EXIT — Rasta Hai! 🚪
        </motion.h2>
        <p className="text-sm text-[#a0a0b8] font-medium">
          Debt trap mein phas gaye? Ye 6 strategies use karo!
        </p>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {EXIT_STRATEGIES.map((strategy, i) => {
          const Icon = strategy.icon;
          return (
            <motion.div
              key={strategy.id}
              className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 hover-card-scale"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${strategy.color}18` }}
                >
                  <Icon size={18} style={{ color: strategy.color }} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1">
                    {strategy.id}. {strategy.title}
                  </h4>
                  <p className="text-[11px] text-[#a0a0b8] leading-relaxed font-medium">
                    {strategy.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational footer */}
      <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 text-center mb-4">
        <p className="text-sm text-emerald-300 font-medium">
          💡 Yaad rakho: Debt trap se bahar aana possible hai! Pehla step lo — sabse chhota debt bharna shuru karo.
        </p>
      </div>

      {/* Reset button */}
      <Button
        onClick={onReset}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Phir Se Dekho
      </Button>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function DebtDoors() {
  const { debtDoorLevel, setDebtDoorLevel } = useAppStore();
  const [openDoors, setOpenDoors] = useState<Set<number>>(
    () => new Set(Array.from({ length: debtDoorLevel }, (_, i) => i + 1))
  );
  const [showExit, setShowExit] = useState(debtDoorLevel >= 7);

  // Current darkness level based on opened doors
  const darknessLevel = openDoors.size / 7;

  // Handle door click
  const handleDoorClick = (doorId: number) => {
    const newOpenDoors = new Set(openDoors);
    newOpenDoors.add(doorId);
    setOpenDoors(newOpenDoors);
    setDebtDoorLevel(doorId);

    // Show exit after last door
    if (doorId === 7) {
      setTimeout(() => setShowExit(true), 1200);
    }
  };

  // Reset
  const handleReset = () => {
    setOpenDoors(new Set());
    setDebtDoorLevel(0);
    setShowExit(false);
  };

  // ─── Exit screen ────────────────────────────────────
  if (showExit) {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-6 select-none">
        <ExitSection onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-4 select-none">
      {/* ── Header ────────────────────────────────────── */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <DoorOpen className="w-6 h-6 text-red-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-gradient-gold">
            Debt Trap Ka Darwaza 🚪
          </h2>
        </div>
        <p className="text-sm text-[#a0a0b8] font-medium">
          Har darwaza ek naya trap hai — kholke dekho kya hota hai!
        </p>
      </div>

      {/* ── Progress Indicator ────────────────────────── */}
      <div className="w-full bg-[#12121a] border border-white/[0.06] rounded-xl p-3 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#a0a0b8] font-medium">Doors Opened</span>
          <span className="text-xs font-bold text-amber-400">
            {openDoors.size}/7
          </span>
        </div>
        <div className="flex gap-1.5">
          {DEBT_DOORS.map((door) => (
            <div
              key={door.id}
              className={cn(
                'h-2 flex-1 rounded-full transition-all duration-500',
                openDoors.has(door.id)
                  ? 'opacity-100'
                  : 'bg-white/10'
              )}
              style={{
                backgroundColor: openDoors.has(door.id) ? door.color : undefined,
              }}
            />
          ))}
        </div>
        {openDoors.size > 0 && openDoors.size < 7 && (
          <motion.p
            className="text-[10px] text-[#a0a0b8] mt-2 text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {openDoors.size < 3
              ? 'Abhi toh shuruat hai... aur doors kholo'
              : openDoors.size < 5
              ? 'Trap gehra ho raha hai! ⚠️'
              : 'Bahut late ho gaya... last door kholo! 😱'}
          </motion.p>
        )}
      </div>

      {/* ── Dark Corridor with Doors ──────────────────── */}
      <div
        className="w-full relative overflow-hidden rounded-xl mb-5 transition-all duration-700 particle-bg"
        style={{
          background: `linear-gradient(180deg,
            rgba(10,10,15,1) 0%,
            rgba(${Math.round(30 - darknessLevel * 30)},${Math.round(10 - darknessLevel * 5)},${Math.round(10 - darknessLevel * 5)},1) 100%)`,
        }}
      >
        {/* Darkness overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, rgba(127,29,29,${darknessLevel * 0.3}) 100%)`,
          }}
        />

        {/* 3D Corridor perspective */}
        <div
          className="relative py-6 px-2 sm:px-4 overflow-x-auto"
          style={{
            perspective: '1200px',
          }}
        >
          {/* Corridor walls visual */}
          <div className="flex gap-4 pb-4 justify-center flex-wrap">
            {DEBT_DOORS.map((door, index) => (
              <motion.div
                key={door.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                style={{
                  transform: `translateZ(${index * -8}px) scale(${1 - index * 0.02})`,
                }}
              >
                <Door
                  doorData={door}
                  index={index}
                  isOpen={openDoors.has(door.id)}
                  isRevealed={openDoors.has(door.id)}
                  onClick={() => handleDoorClick(door.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Corridor floor line */}
        <div
          className="h-px mx-8 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${DEBT_DOORS[openDoors.size]?.color || '255,255,255'},0.4), transparent)`,
          }}
        />
      </div>

      {/* ── Warning Banner ────────────────────────────── */}
      {openDoors.size > 0 && (
        <motion.div
          className="w-full rounded-xl p-3 mb-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={openDoors.size}
          style={{
            backgroundColor: `${DEBT_DOORS[Math.min(openDoors.size, 7) - 1].color}10`,
            border: `1px solid ${DEBT_DOORS[Math.min(openDoors.size, 7) - 1].color}22`,
          }}
        >
          <p
            className="text-sm font-bold"
            style={{ color: DEBT_DOORS[Math.min(openDoors.size, 7) - 1].color }}
          >
            {openDoors.size === 1 && '💳 Pehla step liya — dhyan rakhna!'}
            {openDoors.size === 2 && '📱 EMI trap mein ja rahe ho...'}
            {openDoors.size === 3 && '🔀 Multiple cards = multiple problems'}
            {openDoors.size === 4 && '⚠️ Minimum payment mein principal nahi utarta!'}
            {openDoors.size === 5 && '💸 Debt se debt bharna = aag mein ghee!'}
            {openDoors.size === 6 && '📉 CIBIL gir gaya — ab loan mushkil!'}
            {openDoors.size === 7 && '😱 TRAP! Lekin EXIT door kholo — rasta hai!'}
          </p>
        </motion.div>
      )}

      {/* ── Bottom Insight ────────────────────────────── */}
      <div className="w-full bg-[#1a1a2e] border border-white/[0.06] rounded-xl p-4 text-center corner-accent">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-bold">Key Insight</span>
        </div>
        <p className="text-xs text-[#a0a0b8] leading-relaxed font-medium">
          Debt trap ek step-by-step process hai — har door ek galat decision hai.
          Agar pehli door pe hi rok lo, toh trap mein nahi phansoge!
        </p>
        <p className="text-[10px] text-[#a0a0b8]/60 mt-2 font-medium">
          Saare 7 doors kholne ke baad EXIT milega — 6 strategies to get out of debt!
        </p>
      </div>
    </div>
  );
}
