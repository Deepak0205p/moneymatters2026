'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { strategies } from '@/lib/data/strategies';
import { Coins, Map, GitBranch, Layers, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

const PRIORITY_STRATEGIES = [
  { id: 1, title: 'Zindagi Ka Safar', subtitle: 'Life Path Map', icon: Map, color: '#22c55e', description: 'Tumhari zindagi ka financial map — school se retirement tak!' },
  { id: 3, title: 'Kya Hota Agar', subtitle: 'Consequence Simulator', icon: GitBranch, color: '#a855f7', description: 'Agar main aisa karta toh kya hota? Explore karo consequences!' },
  { id: 5, title: 'Budget Khel', subtitle: 'Swipe-Card Game', icon: Layers, color: '#f59e0b', description: 'Tinder-style swipe game — Need ya Want categorize karo!' },
];

// Decorative gold coin particles (client-only to avoid hydration mismatch)
function GoldCoins() {
  const [mounted, setMounted] = useState(false);
  const coins = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 16,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
    })), []
  );

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute rounded-full"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: coin.size,
            height: coin.size,
            background: 'radial-gradient(circle, #fbbf24 0%, #d97706 70%, transparent 100%)',
            boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.4, 0.15],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function WelcomeOnboarding() {
  const { userName, setUserName, addCoins, addBadge, setActiveStrategy, badges } = useAppStore();
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [direction, setDirection] = useState(0);

  // If userName is set, don't show onboarding
  if (userName) return null;

  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);

    // Save name
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }

    // Add welcome coins
    addCoins(10);

    // Add first-login badge if not already earned
    if (!badges.includes('first-login')) {
      addBadge('first-login');
    }

    // Set selected strategy
    if (selectedStrategy) {
      setActiveStrategy(selectedStrategy);
    }
  };

  const handleSkip = () => {
    setUserName('Dost');
    addCoins(10);
    if (!badges.includes('first-login')) {
      addBadge('first-login');
    }
  };

  const canProceed = () => {
    if (step === 1) return nameInput.trim().length >= 2;
    if (step === 2) return selectedStrategy !== null;
    return true;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const goNext = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Decorative coins */}
      <GoldCoins />

      {/* Main Card */}
      <motion.div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#12121a', border: '1px solid rgba(245, 158, 11, 0.2)' }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Top gold accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="p-6 sm:p-8 relative overflow-hidden" style={{ minHeight: '380px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 0: Welcome */}
            {step === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-12 h-12 text-amber-400 mb-4" />
                </motion.div>

                <h1 className="animate-bounce-in text-4xl sm:text-5xl font-black mb-2">
                  <span className="text-neon-gold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    RUPAIYA 101
                  </span>
                </h1>

                <p className="text-lg text-amber-200/80 font-medium mb-6">
                  Hinglish mein seekho, finance ko samjho
                </p>

                <div className="glass-card-glow bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] mb-6 max-w-sm">
                  <p className="text-sm text-[#8888a0] leading-relaxed">
                    India ke youth ke liye financial literacy app! Interactive games, quizzes,
                    aur real-life examples se sikho paise ko manage karna. Chalo shuru karte hain!
                  </p>
                </div>

                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <Coins className="w-4 h-4" />
                  <span>Sign up bonus: 10 coins!</span>
                </div>
              </motion.div>
            )}

            {/* Step 1: Name Input */}
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center mb-6"
                >
                  <span className="text-3xl">👋</span>
                </motion.div>

                <h2 className="text-neon-gold text-2xl sm:text-3xl font-bold text-[#e8e8ed] mb-2">
                  Tumhara naam kya hai?
                </h2>

                <p className="text-sm text-[#8888a0] mb-8">
                  Hum tumhe personalize karenge!
                </p>

                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Apna naam likho..."
                  autoFocus
                  maxLength={30}
                  className="w-full max-w-sm px-4 py-3 rounded-xl text-lg text-center font-medium bg-white/[0.05] border-2 border-white/[0.08] focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-[#e8e8ed] placeholder-[#8888a0]/50 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canProceed()) goNext();
                  }}
                />

                {nameInput.trim().length > 0 && nameInput.trim().length < 2 && (
                  <p className="text-xs text-red-400 mt-2">Kam se kam 2 characters likho</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Choose Strategy */}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col items-center text-center"
              >
                <h2 className="text-neon-gold text-2xl sm:text-3xl font-bold text-[#e8e8ed] mb-2">
                  Pehla step choose karo!
                </h2>
                <p className="text-sm text-[#8888a0] mb-6">
                  Kahan se shuru karna hai? Ek chuno!
                </p>

                <div className="w-full space-y-3 max-w-sm">
                  {PRIORITY_STRATEGIES.map((strategy, index) => {
                    const Icon = strategy.icon;
                    const isSelected = selectedStrategy === strategy.id;

                    return (
                      <motion.button
                        key={strategy.id}
                        onClick={() => setSelectedStrategy(strategy.id)}
                        className={`glass-card-glow w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10'
                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1]'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${strategy.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: strategy.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-[#e8e8ed] truncate">
                            {strategy.title}
                          </div>
                          <div className="text-xs text-[#8888a0] truncate">
                            {strategy.description}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0"
                          >
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-amber-400' : s < step ? 'w-4 bg-amber-400/50' : 'w-4 bg-white/[0.1]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Back / Skip */}
            {step > 0 ? (
              <button
                onClick={goBack}
                className="text-sm text-[#8888a0] hover:text-[#e8e8ed] transition-colors px-3 py-2"
              >
                ← Peeche
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-sm text-[#8888a0] hover:text-[#e8e8ed] transition-colors px-3 py-2"
              >
                Skip
              </button>
            )}

            {/* Next / Submit */}
            {step < 2 ? (
              <motion.button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canProceed() ? '#f59e0b' : '#f59e0b40',
                  color: '#0a0a0f',
                }}
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.95 } : {}}
              >
                Aage badho
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canProceed() ? '#f59e0b' : '#f59e0b40',
                  color: '#0a0a0f',
                }}
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.95 } : {}}
              >
                <Sparkles className="w-4 h-4" />
                Shuru Karein!
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
