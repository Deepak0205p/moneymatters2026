'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Coins, Navigation, GitBranch, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PRIORITY_STRATEGIES = [{
  id: 2,
  title: 'Paise Ka GPS',
  subtitle: 'Financial Health Navigator',
  icon: Navigation,
  color: '#3b82f6',
  description: 'Tumhara financial health kaisa hai? Quick checkup karo!'
}, {
  id: 3,
  title: 'Kya Hota Agar',
  subtitle: 'Consequence Simulator',
  icon: GitBranch,
  color: '#8B5CF6',
  description: 'Agar main aisa karta toh kya hota? Explore karo consequences!'
}, {
  id: 5,
  title: 'Budget Khel',
  subtitle: 'Swipe-Card Game',
  icon: Layers,
  color: '#F59E0B',
  description: 'Tinder-style swipe game — Need ya Want categorize karo!'
}];

// Decorative floating particles (client-only to avoid hydration mismatch)
function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(() => {
    const colors = ['#10B981', '#8B5CF6', '#F59E0B'];
    return Array.from({
      length: 14
    }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 10,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 4,
      color: colors[i % colors.length]
    }));
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none"
  });
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none",
    children: particles.map(p => /*#__PURE__*/_jsx(motion.div, {
      className: "absolute rounded-full",
      style: {
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
        boxShadow: `0 0 ${p.size}px ${p.color}66`
      },
      animate: {
        y: [0, -24, 0],
        opacity: [0.15, 0.5, 0.15],
        scale: [0.8, 1.1, 0.8]
      },
      transition: {
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }, p.id))
  });
}
export function WelcomeOnboarding() {
  const {
    userName,
    setUserName,
    addCoins,
    addBadge,
    setActiveStrategy,
    badges
  } = useAppStore();
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [direction, setDirection] = useState(0);

  // If userName is set, don't show onboarding
  if (userName) return null;
  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    if (nameInput.trim()) setUserName(nameInput.trim());
    addCoins(10);
    if (!badges.includes('first-login')) addBadge('first-login');
    if (selectedStrategy) setActiveStrategy(selectedStrategy);
  };
  const handleSkip = () => {
    setUserName('Dost');
    addCoins(10);
    if (!badges.includes('first-login')) addBadge('first-login');
  };
  const canProceed = () => {
    if (step === 1) return nameInput.trim().length >= 2;
    if (step === 2) return selectedStrategy !== null;
    return true;
  };
  const slideVariants = {
    enter: direction => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: direction => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };
  const goNext = () => {
    setDirection(1);
    setStep(prev => Math.min(prev + 1, 2));
  };
  const goBack = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 0));
  };
  return /*#__PURE__*/_jsxs(motion.div, {
    className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    transition: {
      duration: 0.3
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-midnight/85 backdrop-blur-md premium-dialog-overlay"
    }), /*#__PURE__*/_jsx(FloatingParticles, {}), /*#__PURE__*/_jsxs(motion.div, {
      className: "relative w-full max-w-lg rounded-2xl overflow-hidden glass-card-premium",
      initial: {
        scale: 0.9,
        y: 20
      },
      animate: {
        scale: 1,
        y: 0
      },
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      },
      children: [/*#__PURE__*/_jsx("div", {
        className: "h-1 w-full bg-gradient-to-r from-transparent via-emerald to-ai"
      }), /*#__PURE__*/_jsx("div", {
        className: "p-6 sm:p-8 relative overflow-hidden",
        style: {
          minHeight: '380px'
        },
        children: /*#__PURE__*/_jsxs(AnimatePresence, {
          mode: "wait",
          custom: direction,
          children: [step === 0 && /*#__PURE__*/_jsxs(motion.div, {
            custom: direction,
            variants: slideVariants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30
            },
            className: "flex flex-col items-center text-center",
            children: [/*#__PURE__*/_jsx(motion.div, {
              animate: {
                rotate: [0, 10, -10, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              },
              children: /*#__PURE__*/_jsx(Sparkles, {
                className: "w-12 h-12 text-emerald-soft mb-4",
                style: {
                  filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.4))'
                }
              })
            }), /*#__PURE__*/_jsx("h1", {
              className: "text-4xl sm:text-5xl font-black mb-2",
              children: /*#__PURE__*/_jsx("span", {
                className: "text-gradient-brand",
                children: "Money Matters"
              })
            }), /*#__PURE__*/_jsx("p", {
              className: "text-lg text-emerald-soft/80 font-medium mb-6",
              children: "Hinglish mein seekho, finance ko samjho"
            }), /*#__PURE__*/_jsx("div", {
              className: "glass-card rounded-xl p-4 mb-6 max-w-sm",
              children: /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted leading-relaxed",
                children: "India ke youth ke liye financial literacy app! Interactive games, quizzes, aur real-life examples se sikho paise ko manage karna. Chalo shuru karte hain!"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 text-gold-soft text-sm font-medium",
              children: [/*#__PURE__*/_jsx(Coins, {
                className: "w-4 h-4"
              }), /*#__PURE__*/_jsx("span", {
                children: "Sign up bonus: 10 coins!"
              })]
            })]
          }, "step-0"), step === 1 && /*#__PURE__*/_jsxs(motion.div, {
            custom: direction,
            variants: slideVariants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30
            },
            className: "flex flex-col items-center text-center",
            children: [/*#__PURE__*/_jsx(motion.div, {
              initial: {
                scale: 0
              },
              animate: {
                scale: 1
              },
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 20,
                delay: 0.1
              },
              className: "w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center mb-6",
              style: {
                boxShadow: '0 0 20px rgba(16,185,129,0.20)'
              },
              children: /*#__PURE__*/_jsx("span", {
                className: "text-3xl",
                children: "\uD83D\uDC4B"
              })
            }), /*#__PURE__*/_jsx("h2", {
              className: "text-2xl sm:text-3xl font-bold text-ink mb-2",
              children: "Tumhara naam kya hai?"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted mb-8",
              children: "Hum tumhe personalize karenge!"
            }), /*#__PURE__*/_jsx("input", {
              type: "text",
              value: nameInput,
              onChange: e => setNameInput(e.target.value),
              placeholder: "Apna naam likho...",
              autoFocus: true,
              maxLength: 30,
              className: "w-full max-w-sm px-4 py-3 rounded-xl text-lg text-center font-medium bg-white/[0.05] border-2 border-white/[0.08] focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20 text-ink placeholder-ink-muted/50 transition-all",
              onKeyDown: e => {
                if (e.key === 'Enter' && canProceed()) goNext();
              }
            }), nameInput.trim().length > 0 && nameInput.trim().length < 2 && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-red-400 mt-2",
              children: "Kam se kam 2 characters likho"
            })]
          }, "step-1"), step === 2 && /*#__PURE__*/_jsxs(motion.div, {
            custom: direction,
            variants: slideVariants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30
            },
            className: "flex flex-col items-center text-center",
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-2xl sm:text-3xl font-bold text-ink mb-2",
              children: "Pehla step choose karo!"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted mb-6",
              children: "Kahan se shuru karna hai? Ek chuno!"
            }), /*#__PURE__*/_jsx("div", {
              className: "w-full space-y-3 max-w-sm",
              children: PRIORITY_STRATEGIES.map((strategy, index) => {
                const Icon = strategy.icon;
                const isSelected = selectedStrategy === strategy.id;
                return /*#__PURE__*/_jsxs(motion.button, {
                  onClick: () => setSelectedStrategy(strategy.id),
                  className: `glass-card w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-emerald bg-emerald/10' : 'border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]'}`,
                  initial: {
                    opacity: 0,
                    x: -20
                  },
                  animate: {
                    opacity: 1,
                    x: 0
                  },
                  transition: {
                    delay: index * 0.1
                  },
                  whileHover: {
                    scale: 1.02
                  },
                  whileTap: {
                    scale: 0.98
                  },
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    style: {
                      backgroundColor: `${strategy.color}20`,
                      boxShadow: `0 0 12px ${strategy.color}20`
                    },
                    children: /*#__PURE__*/_jsx(Icon, {
                      className: "w-5 h-5",
                      style: {
                        color: strategy.color
                      }
                    })
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: "font-semibold text-sm text-ink truncate",
                      children: strategy.title
                    }), /*#__PURE__*/_jsx("div", {
                      className: "text-xs text-ink-muted truncate",
                      children: strategy.description
                    })]
                  }), isSelected && /*#__PURE__*/_jsx(motion.div, {
                    initial: {
                      scale: 0
                    },
                    animate: {
                      scale: 1
                    },
                    className: "w-5 h-5 rounded-full bg-emerald flex items-center justify-center shrink-0",
                    children: /*#__PURE__*/_jsx("svg", {
                      className: "w-3 h-3 text-midnight",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: 3,
                      children: /*#__PURE__*/_jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M5 13l4 4L19 7"
                      })
                    })
                  })]
                }, strategy.id);
              })
            })]
          }, "step-2")]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-6 sm:px-8 pb-6 sm:pb-8",
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-center gap-2 mb-5",
          children: [0, 1, 2].map(s => /*#__PURE__*/_jsx("div", {
            className: `h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-emerald' : s < step ? 'w-4 bg-emerald/50' : 'w-4 bg-white/[0.1]'}`
          }, s))
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between gap-3",
          children: [step > 0 ? /*#__PURE__*/_jsx("button", {
            onClick: goBack,
            className: "text-sm text-ink-muted hover:text-ink transition-colors px-3 py-2",
            children: "\u2190 Peeche"
          }) : /*#__PURE__*/_jsx("button", {
            onClick: handleSkip,
            className: "text-sm text-ink-muted hover:text-ink transition-colors px-3 py-2",
            children: "Skip"
          }), step < 2 ? /*#__PURE__*/_jsxs(motion.button, {
            onClick: goNext,
            disabled: !canProceed(),
            className: "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-gold",
            whileHover: canProceed() ? {
              scale: 1.05
            } : {},
            whileTap: canProceed() ? {
              scale: 0.95
            } : {},
            children: ["Aage badho", /*#__PURE__*/_jsx(ArrowRight, {
              className: "w-4 h-4"
            })]
          }) : /*#__PURE__*/_jsxs(motion.button, {
            onClick: handleComplete,
            disabled: !canProceed(),
            className: "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed btn-gold",
            whileHover: canProceed() ? {
              scale: 1.05
            } : {},
            whileTap: canProceed() ? {
              scale: 0.95
            } : {},
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-4 h-4"
            }), "Shuru Karein!"]
          })]
        })]
      })]
    })]
  });
}