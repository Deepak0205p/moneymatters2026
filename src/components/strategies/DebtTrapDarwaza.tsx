'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Lock, DoorOpen, Skull, Lightbulb, Trophy, X, ShieldCheck } from 'lucide-react';

type Door = {
  id: number;
  title: string;
  emoji: string;
  danger: 1 | 2 | 3;
  scenario: string;
  math: string;
  tip: string;
};

const DOORS: Door[] = [
  {
    id: 1,
    title: 'EMI Ka Chakkar',
    emoji: '📱',
    danger: 2,
    scenario: '₹80,000 ka phone, 12 mahine ka EMI lagaya. Laga hi nahi ₹10,000 extraInterest bhar rahe ho!',
    math: '₹80,000 phone → Total paid: ₹90,000 (12% interest)',
    tip: 'Phone full payment mein lo, ya 6 mahine se kam EMI. Lumba tenure = zyada interest.',
  },
  {
    id: 2,
    title: 'Credit Card Ka Jaal',
    emoji: '💳',
    danger: 3,
    scenario: 'Minimum due bhar rahe ho? Asli amount 36-45% interest pe grow karta hai. Death spiral!',
    math: '₹50,000 due → Min pay 5% = ₹2,500/mo. Clear karne mein 8+ saal, total ₹1,10,000+.',
    tip: 'Hamesha FULL amount pay karo. Credit card = free 50-day loan SIRF full pay karoge toh.',
  },
  {
    id: 3,
    title: 'Buy Now Pay Later',
    emoji: '🛒',
    danger: 2,
    scenario: 'BNPL apps "0% interest" dikhati hain, par late fee aur convenience charge chhupa hoti hai.',
    math: '₹5,000 item → Late fee ₹500 + ₹200 charge = 14% extra in 1 month.',
    tip: 'BNPL sirf tab use karo jab sure ho 30 din mein pay karne ka. Otherwise avoid.',
  },
  {
    id: 4,
    title: 'Personal Loan Trap',
    emoji: '🏦',
    danger: 3,
    scenario: 'Personal loan 18-24% interest. Festival ke liye loan = 5 saal tak dukh.',
    math: '₹2,00,000 loan @ 22% × 5 yr = Total payback ₹3,32,000.',
    tip: 'Personal loan sirf emergency mein. Vacation/wedding ke liye kabhi nahi.',
  },
  {
    id: 5,
    title: '0% EMI Illusion',
    emoji: '🎭',
    danger: 2,
    scenario: '"0% interest" EMI mein actually product price already 10-15% badha hua hota hai.',
    math: '₹40,000 AC cash = ₹34,000. EMI mein ₹40,000 + processing ₹1,500 = hidden 18%.',
    tip: 'Cash discount compare karo EMI price se. Sahi saving dikhegi.',
  },
  {
    id: 6,
    title: 'Lifestyle EMI',
    emoji: '🏠',
    danger: 1,
    scenario: 'Furniture, appliances, wedding sab EMI pe. Income sab EMI mein nikal jaata hai.',
    math: '3 EMIs × ₹5,000 = ₹15,000/mo. 40% salary chali gayi, savings zero.',
    tip: 'Total EMI kabhi 30% income se zyada mat rakhna. 20% safe zone.',
  },
  {
    id: 7,
    title: 'Payday Loan',
    emoji: '💸',
    danger: 3,
    scenario: '7-day payday loan 1-2% per DAY interest. Annual = 365-730%. Sabse khatarnak!',
    math: '₹10,000 × 1.5% × 30 days = ₹4,500/month interest. Year mein ₹54,000.',
    tip: 'Payday loans are TRAP. Better gold loan ya family se help lo.',
  },
];

export default function DebtTrapDarwaza() {
  const addCoins = useAppStore((s) => s.addCoins);
  const addBadge = useAppStore((s) => s.addBadge);
  const [opened, setOpened] = useState<number[]>([]);
  const [active, setActive] = useState<Door | null>(null);

  const allDone = opened.length === DOORS.length;

  const openDoor = (d: Door) => {
    setActive(d);
    if (!opened.includes(d.id)) {
      const next = [...opened, d.id];
      setOpened(next);
      addCoins(10);
      if (next.length === DOORS.length) {
        addBadge('debt-trap-survivor');
        addCoins(50);
      }
    }
  };

  const skullColor = (d: number) => (d === 3 ? 'text-red-400' : d === 2 ? 'text-amber-400' : 'text-yellow-300');

  return (
    <div className="space-y-6" style={{ background: 'radial-gradient(ellipse at top, #0a0f1c, #050a15)' }}>
      <div className="text-center pt-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold"
          style={{ background: 'linear-gradient(90deg, #EF4444, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Debt Trap Ka Darwaza 💀
        </motion.h2>
        <p className="text-zinc-500 mt-2 text-sm">
          7 darwaze — har ek ek debt trap. Kholo, samjho, aur bacho.
        </p>
      </div>

      {/* Progress */}
      <div className="glass-strong rounded-xl p-3 flex items-center justify-between max-w-md mx-auto">
        <span className="text-sm text-zinc-300">Doors Survived</span>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-amber-400">
            {opened.length}
          </span>
          <span className="text-zinc-500">/ 7</span>
        </div>
      </div>

      {/* DOORS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {DOORS.map((d, i) => {
          const isOpen = opened.includes(d.id);
          return (
            <motion.button
              key={d.id}
              onClick={() => openDoor(d)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${
                isOpen
                  ? 'border-emerald-500/40 glow-green'
                  : 'border-red-500/30 hover:border-red-500/60'
              }`}
              style={{
                background: isOpen
                  ? 'linear-gradient(160deg, rgba(16,185,129,0.10), rgba(11,18,32,0.9))'
                  : 'linear-gradient(160deg, rgba(239,68,68,0.06), rgba(5,10,21,0.95))',
              }}
            >
              {/* Door number plate */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-xs font-bold text-amber-400">
                {d.id}
              </div>

              {/* Skulls */}
              <div className="absolute top-2 right-2 flex gap-0.5">
                {[1, 2, 3].map((s) => (
                  <Skull
                    key={s}
                    className={`w-3 h-3 ${s <= d.danger ? skullColor(d.danger) : 'text-zinc-700'}`}
                  />
                ))}
              </div>

              {/* Door visual */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <motion.div
                  animate={isOpen ? { rotateY: 0, scale: 0.9 } : { rotateY: 0 }}
                  className="text-5xl mb-2"
                  style={{ filter: isOpen ? 'grayscale(0)' : 'grayscale(0.4)' }}
                >
                  {d.emoji}
                </motion.div>
                <div className="text-center">
                  <p className="font-display text-sm font-semibold text-white leading-tight">
                    {d.title}
                  </p>
                </div>
                {isOpen ? (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                    <DoorOpen className="w-3 h-3" /> Khola
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500">
                    <Lock className="w-3 h-3" /> Band
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* COMPLETION BADGE */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-premium rounded-2xl p-6 max-w-2xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="inline-flex"
            >
              <Trophy className="w-14 h-14 text-amber-400" />
            </motion.div>
            <h3 className="font-display text-2xl font-bold text-gradient-gold mt-2">
              Debt Trap Survivor! 🏆
            </h3>
            <p className="text-zinc-300 text-sm mt-1">
              Tumne 7 darwaze khole — ab tum debt trap se safe ho!
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-left">
              {[
                '💰 EMI total 30% salary se kam rakho',
                '💳 Credit card hamesha FULL pay karo',
                '🚫 Personal loan sirf emergency mein',
                '🔍 "0% EMI" mein hidden charge check karo',
                '📅 Payday loans kabhi mat lo',
                '🎯 Savings pehle, kharcha baad mein',
                '📊 Har month debt review karo',
              ].map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xs text-zinc-300 bg-black/30 rounded-lg p-2 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  {r}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOOR CONTENT MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, rotateY: -25, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card-premium rounded-2xl p-6 max-w-md w-full relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{active.emoji}</div>
                <h3 className="font-display text-2xl font-bold text-white">{active.title}</h3>
                <div className="flex justify-center gap-1 mt-1">
                  {[1, 2, 3].map((s) => (
                    <Skull
                      key={s}
                      className={`w-4 h-4 ${s <= active.danger ? skullColor(active.danger) : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-xs uppercase tracking-wide text-red-400 mb-1">Trap</p>
                  <p className="text-sm text-zinc-200">{active.scenario}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs uppercase tracking-wide text-amber-400 mb-1">Math</p>
                  <p className="text-sm font-mono text-amber-200">{active.math}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-xs uppercase tracking-wide text-emerald-400">Kaise Bacho</p>
                  </div>
                  <p className="text-sm text-zinc-200">{active.tip}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
