"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  Wallet,
  RotateCcw,
  TrendingDown,
  PiggyBank,
  Trophy,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";

// ─── Time slots data ─────────────────────────────────────────
interface Choice {
  label: string;
  emoji: string;
  cost: number;
  category: "chai" | "food" | "entertainment" | "skip";
  wisdom?: string;
}

interface Slot {
  id: number;
  time: string;
  label: string;
  prompt: string;
  choices: Choice[];
}

const SLOTS: Slot[] = [
  {
    id: 1,
    time: "8 AM",
    label: "Morning Chai",
    prompt: "Rahul uth gaya, nazar neend se bhari. Chai kahan se?",
    choices: [
      { label: "Chai tapri", emoji: "☕", cost: 15, category: "chai", wisdom: "Tapri ki chai = nostalgia + sasta!" },
      { label: "Starbucks", emoji: "🥤", cost: 350, category: "chai", wisdom: "₹350 chai? Day ka 70% ud gaya bhai!" },
      { label: "Ghar ki chai", emoji: "🏠", cost: 0, category: "skip", wisdom: "Smart! Mummy haath jodti hai." },
    ],
  },
  {
    id: 2,
    time: "9 AM",
    label: "Breakfast",
    prompt: "Pet ko kuch chahiye. Nashta kya?",
    choices: [
      { label: "Mess", emoji: "🍳", cost: 40, category: "food", wisdom: "Standard nashta, sasta aur fill kar deta." },
      { label: "Swiggy", emoji: "🛵", cost: 180, category: "food", wisdom: "₹180 mein pizza + delivery + taxes." },
      { label: "Skip", emoji: "😴", cost: 0, category: "skip", wisdom: "Skip = bhukkad peechhe aayega 1 baje!" },
    ],
  },
  {
    id: 3,
    time: "1 PM",
    label: "Lunch Time",
    prompt: "Daanto ka kHEL — lunch break! Kya khayega?",
    choices: [
      { label: "Canteen", emoji: "🍱", cost: 50, category: "food", wisdom: "Thali — sabzi + dal + roti, perfect." },
      { label: "Zomato", emoji: "📱", cost: 220, category: "food", wisdom: "₹220 biryani — bhookh mit jayegi, wallet nahi." },
      { label: "Dabba", emoji: "🥡", cost: 30, category: "food", wisdom: "Ghar ka dabba = best value for money." },
    ],
  },
  {
    id: 4,
    time: "4 PM",
    label: "Snacks",
    prompt: "Shaam ki chai ke saath kuch crunchy chahiye.",
    choices: [
      { label: "Samosa", emoji: "🥟", cost: 20, category: "food", wisdom: "Tapri ke saath — classic combo." },
      { label: "Cafe", emoji: "🥐", cost: 150, category: "food", wisdom: "₹150 pastry + coffee. Fancy but expensive!" },
      { label: "Nothing", emoji: "🚫", cost: 0, category: "skip", wisdom: "Self-control = wealth build hota hai." },
    ],
  },
  {
    id: 5,
    time: "6 PM",
    label: "Evening Plan",
    prompt: "Kaam khatam. Aaram kaise?",
    choices: [
      { label: "Walk", emoji: "🚶", cost: 0, category: "skip", wisdom: "Free + health. Win-win!" },
      { label: "Movie", emoji: "🎬", cost: 300, category: "entertainment", wisdom: "₹300 ticket = ₹700 total (popcorn!)" },
      { label: "Gaming cafe", emoji: "🎮", cost: 100, category: "entertainment", wisdom: "₹100/hour BGMI — friends + fun." },
    ],
  },
  {
    id: 6,
    time: "8 PM",
    label: "Dinner",
    prompt: "Din ka last meal — khaas karna hai ya simple?",
    choices: [
      { label: "Mess", emoji: "🍛", cost: 60, category: "food", wisdom: "Reliable, sasta, pet bharta hai." },
      { label: "Restaurant", emoji: "🍽️", cost: 350, category: "food", wisdom: "₹350 dinner — khaas din bana diya!" },
      { label: "Maggi", emoji: "🍜", cost: 15, category: "food", wisdom: "2 minute meal — bhukh miti, paisa bacha." },
    ],
  },
  {
    id: 7,
    time: "10 PM",
    label: "Night Cravings",
    prompt: "Neend nahi aa rahi. Kuch chahiye?",
    choices: [
      { label: "Sleep", emoji: "😴", cost: 0, category: "skip", wisdom: "Best decision — kal ka din bhi hai!" },
      { label: "Ice cream", emoji: "🍨", cost: 120, category: "food", wisdom: "₹120 Cornetto — sweet ending." },
      { label: "Online order", emoji: "🛍️", cost: 200, category: "food", wisdom: "₹200 ke fries + coke — late night craving!" },
    ],
  },
  {
    id: 8,
    time: "11 PM",
    label: "Late Night",
    prompt: "Final decision — Rahul kya karega?",
    choices: [
      { label: "Bed", emoji: "🛏️", cost: 0, category: "skip", wisdom: "Smart — kal subah jaldi uthna hai." },
      { label: "Midnight snack", emoji: "🍕", cost: 80, category: "food", wisdom: "₹80 pizza slice — last splurge." },
    ],
  },
];

const STARTING_BALANCE = 500;
const CATEGORY_LABELS: Record<Choice["category"], { label: string; color: string; emoji: string }> = {
  chai: { label: "Chai / Drinks", color: "#F59E0B", emoji: "☕" },
  food: { label: "Food", color: "#10B981", emoji: "🍴" },
  entertainment: { label: "Entertainment", color: "#8B5CF6", emoji: "🎉" },
  skip: { label: "Skipped (Saved)", color: "#3B82F6", emoji: "✨" },
};

export default function EkDinKaKharcha() {
  const [currentSlot, setCurrentSlot] = useState(0);
  const [choices, setChoices] = useState<(Choice | null)[]>(
    Array(SLOTS.length).fill(null)
  );
  const [gameOver, setGameOver] = useState<"broke" | "win" | null>(null);

  const { addCoins, coins } = useAppStore();

  const balance = useMemo(() => {
    const spent = choices.reduce(
      (sum, c) => (c ? sum + c.cost : 0),
      0
    );
    return STARTING_BALANCE - spent;
  }, [choices]);

  const totalSpent = STARTING_BALANCE - balance;
  const totalSaved = balance;

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    choices.forEach((c) => {
      if (c) {
        breakdown[c.category] = (breakdown[c.category] || 0) + c.cost;
      }
    });
    return breakdown;
  }, [choices]);

  const handleChoice = (choice: Choice) => {
    if (gameOver) return;
    const newBalance = balance - choice.cost;
    const newChoices = [...choices];
    newChoices[currentSlot] = choice;
    setChoices(newChoices);

    if (newBalance < 0) {
      setGameOver("broke");
      return;
    }

    if (currentSlot === SLOTS.length - 1) {
      setGameOver("win");
      if (newBalance >= 200) addCoins(30);
      else if (newBalance >= 100) addCoins(20);
      else addCoins(10);
    } else {
      setTimeout(() => setCurrentSlot((s) => s + 1), 350);
    }
  };

  const reset = () => {
    setChoices(Array(SLOTS.length).fill(null));
    setCurrentSlot(0);
    setGameOver(null);
  };

  const slot = SLOTS[currentSlot];
  const progressPercent = ((currentSlot + (gameOver ? 1 : 0)) / SLOTS.length) * 100;

  return (
    <div className="relative flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-5 py-6 gap-5">
      {/* ── Header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-2">
          <Clock size={14} className="text-purple-400" />
          <span className="text-[11px] font-semibold text-zinc-300 tracking-wide uppercase">
            Strategy 10 · Daily Simulator
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-gradient-emerald mb-1">
          Ek Din Ka Kharcha 🛒
        </h2>
        <p className="text-sm text-zinc-400 font-medium">
          Rahul ke din ka paisa manage karo — ₹500 mein poora din chalao!
        </p>
      </motion.div>

      {/* ── Wallet + Progress ────────────────────────── */}
      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Wallet size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                Rahul ki Wallet
              </p>
              <motion.p
                key={balance}
                initial={{ scale: 1.2, color: "#10B981" }}
                animate={{ scale: 1, color: balance < 50 ? "#EF4444" : "#F59E0B" }}
                className="text-xl font-bold number-highlight"
              >
                ₹{Math.max(0, balance)}
              </motion.p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Total Spent
            </p>
            <p className="text-lg font-bold text-red-400">₹{totalSpent}</p>
          </div>
        </div>

        {/* Day progress timeline */}
        <div className="flex items-center gap-1.5 mb-2">
          {SLOTS.map((s, i) => {
            const done = i < currentSlot || gameOver;
            const active = i === currentSlot && !gameOver;
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-full transition-all ${
                    done
                      ? "bg-emerald-500"
                      : active
                      ? "bg-emerald-500/50 animate-pulse"
                      : "bg-white/8"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold ${
                    done ? "text-emerald-400" : active ? "text-emerald-300" : "text-zinc-600"
                  }`}
                >
                  {s.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Game Over Screen ─────────────────────────── */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card-premium rounded-2xl p-6 text-center"
          >
            {gameOver === "broke" ? (
              <>
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                <h3 className="text-xl font-bold font-display text-red-400 mb-1">
                  Game Over — Rahul broke ho gaya! 😅
                </h3>
                <p className="text-sm text-zinc-300">
                  Slot {currentSlot + 1} pe paise khatam! Budget planning zaroori hai bhai.
                </p>
              </>
            ) : (
              <>
                <Trophy className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                <h3 className="text-xl font-bold font-display text-gradient-gold mb-1">
                  Smart Spender! 🎉
                </h3>
                <p className="text-sm text-zinc-300">
                  Rahul ne <span className="text-emerald-400 font-bold">₹{totalSaved}</span> bacha liye!
                  <span className="text-amber-400 font-bold"> +{totalSaved >= 200 ? 30 : totalSaved >= 100 ? 20 : 10} coins</span> reward!
                </p>
              </>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
              <div className="glass rounded-xl p-3">
                <TrendingDown size={16} className="mx-auto text-red-400 mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Spent</p>
                <p className="text-lg font-bold text-red-400">₹{totalSpent}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <PiggyBank size={16} className="mx-auto text-emerald-400 mb-1" />
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Saved</p>
                <p className="text-lg font-bold text-emerald-400">₹{totalSaved}</p>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="text-left mb-4">
              <p className="text-xs font-bold text-zinc-400 uppercase mb-2">
                Spending Breakdown
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scroll pr-1">
                {Object.entries(categoryBreakdown).map(([cat, amt]) => {
                  const cfg = CATEGORY_LABELS[cat as Choice["category"]];
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between text-xs px-3 py-2 rounded-lg glass"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{cfg.emoji}</span>
                        <span className="text-zinc-300 font-medium">{cfg.label}</span>
                      </span>
                      <span className="font-bold" style={{ color: cfg.color }}>
                        ₹{amt}
                      </span>
                    </div>
                  );
                })}
                {Object.keys(categoryBreakdown).length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-2">
                    Kuch kharch nahi kiya! Chal try again.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={reset}
              className="btn-emerald rounded-xl px-5 py-2.5 text-sm font-bold inline-flex items-center gap-2"
            >
              <RotateCcw size={14} /> Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Current Slot ─────────────────────────────── */}
      {!gameOver && slot && (
        <AnimatePresence mode="wait">
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-5 sm:p-6"
          >
            {/* Slot header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  Slot {currentSlot + 1} / {SLOTS.length}
                </span>
                <span className="text-xs text-zinc-500 font-medium">{slot.time}</span>
              </div>
              <span className="text-xs text-zinc-500">
                Balance: <span className="font-bold text-amber-400">₹{balance}</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-1">
              {slot.label}
            </h3>
            <p className="text-sm text-zinc-400 mb-4">{slot.prompt}</p>

            {/* Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slot.choices.map((choice, idx) => {
                const canAfford = balance >= choice.cost;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleChoice(choice)}
                    disabled={!canAfford}
                    whileHover={canAfford ? { scale: 1.04, y: -2 } : {}}
                    whileTap={canAfford ? { scale: 0.96 } : {}}
                    className={`relative text-left rounded-xl p-4 border transition-all ${
                      canAfford
                        ? "glass-card hover-card-scale cursor-pointer border-white/10 hover:border-emerald-500/40"
                        : "opacity-40 cursor-not-allowed border-red-500/20 bg-red-950/10"
                    }`}
                  >
                    <div className="text-3xl mb-2">{choice.emoji}</div>
                    <p className="text-sm font-bold text-white mb-1">
                      {choice.label}
                    </p>
                    <p
                      className={`text-base font-bold ${
                        choice.cost === 0 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {choice.cost === 0 ? "FREE ₹0" : `₹${choice.cost}`}
                    </p>
                    {!canAfford && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded">
                        Out of budget
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Wisdom preview of last choice */}
            {currentSlot > 0 && choices[currentSlot - 1]?.wisdom && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-300"
              >
                💡 {choices[currentSlot - 1]?.wisdom}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Footer Helper ────────────────────────────── */}
      {!gameOver && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <ChevronRight size={12} />
          <span>Apni budget smartly manage karo — har choice count karti hai!</span>
        </div>
      )}
    </div>
  );
}
