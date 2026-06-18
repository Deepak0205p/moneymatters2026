"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Play, ChevronRight, Coins, TrendingUp, Zap, Award, BookOpen, Sparkles, Flame, Trophy, Heart } from 'lucide-react';
import { Hero } from '@/components/2d/hero';
import { Features } from '@/components/2d/features';
import { Gamification } from '@/components/2d/gamification';
import { Navbar } from '@/components/2d/navbar';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function LightStreaks() {
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none",
    children: [...Array(3)].map((_, i) => /*#__PURE__*/_jsx(motion.div, {
      className: "absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-emerald/20 to-transparent",
      style: {
        left: `${20 + i * 30}%`,
        top: '-30vh',
        filter: 'blur(1px)',
        transform: 'rotate(35deg)'
      },
      animate: {
        top: ['-30vh', '130vh'],
        opacity: [0, 1, 0]
      },
      transition: {
        duration: 7 + i * 2,
        repeat: Infinity,
        delay: i * 3,
        ease: 'linear'
      }
    }, i))
  });
}
function FloatingSymbols() {
  const symbols = useMemo(() => [{
    Icon: Coins,
    color: '#F59E0B',
    size: 24,
    top: '15%',
    left: '10%',
    delay: 0
  }, {
    Icon: TrendingUp,
    color: '#10B981',
    size: 32,
    top: '45%',
    left: '85%',
    delay: 2
  }, {
    Icon: Zap,
    color: '#8B5CF6',
    size: 28,
    top: '75%',
    left: '15%',
    delay: 4
  }, {
    Icon: Award,
    color: '#FBBF24',
    size: 20,
    top: '25%',
    left: '70%',
    delay: 1
  }, {
    Icon: BookOpen,
    color: '#38BDF8',
    size: 22,
    top: '60%',
    left: '80%',
    delay: 3
  }, {
    Icon: Sparkles,
    color: '#EC4899',
    size: 26,
    top: '85%',
    left: '90%',
    delay: 5
  }, {
    Icon: Trophy,
    color: '#F59E0B',
    size: 30,
    top: '10%',
    left: '50%',
    delay: 2.5
  }, {
    Icon: Flame,
    color: '#EF4444',
    size: 24,
    top: '40%',
    left: '5%',
    delay: 1.5
  }], []);
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none opacity-[0.10]",
    children: symbols.map((item, i) => /*#__PURE__*/_jsx(motion.div, {
      className: "absolute",
      style: {
        top: item.top,
        left: item.left
      },
      animate: {
        y: [0, -40, 0],
        x: [0, 10, -10, 0],
        rotate: [0, 20, -20, 0],
        scale: [1, 1.2, 1]
      },
      transition: {
        duration: 8 + Math.random() * 8,
        repeat: Infinity,
        delay: item.delay,
        ease: 'easeInOut'
      },
      children: /*#__PURE__*/_jsx(item.Icon, {
        size: item.size,
        style: {
          color: item.color,
          filter: `drop-shadow(0 0 10px ${item.color}40)`
        }
      })
    }, i))
  });
}
function Background2D() {
  return /*#__PURE__*/_jsxs("div", {
    className: "fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight",
    children: [/*#__PURE__*/_jsx(FloatingSymbols, {}), /*#__PURE__*/_jsx(LightStreaks, {}), /*#__PURE__*/_jsx("div", {
      className: "absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 opacity-[0.02]",
      style: {
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }
    })]
  });
}
function OnboardingOverlay({
  onDismiss
}) {
  return /*#__PURE__*/_jsx(motion.div, {
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
      duration: 0.5
    },
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-midnight/90 backdrop-blur-md p-4",
    children: /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        scale: 0.92,
        opacity: 0,
        y: 20
      },
      animate: {
        scale: 1,
        opacity: 1,
        y: 0
      },
      exit: {
        scale: 0.92,
        opacity: 0,
        y: 20
      },
      transition: {
        duration: 0.5,
        delay: 0.15,
        ease: [0.16, 1, 0.3, 1]
      },
      className: "glass-card-premium mx-auto max-w-lg p-8 text-center sm:p-12 rounded-3xl",
      children: [/*#__PURE__*/_jsx(motion.div, {
        initial: {
          scale: 0,
          rotate: -10
        },
        animate: {
          scale: 1,
          rotate: 0
        },
        transition: {
          duration: 0.6,
          delay: 0.3,
          type: 'spring',
          stiffness: 200
        },
        className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl",
        style: {
          background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
          boxShadow: '0 0 32px rgba(16,185,129,0.40)'
        },
        children: /*#__PURE__*/_jsx(Play, {
          size: 36,
          className: "ml-1 text-midnight fill-current"
        })
      }), /*#__PURE__*/_jsxs("h2", {
        className: "font-display text-3xl font-extrabold mb-3 sm:text-4xl",
        children: ["Welcome to", ' ', /*#__PURE__*/_jsx("span", {
          className: "text-gradient-brand",
          children: "Money Matters"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "mb-8 text-ink-muted leading-relaxed",
        children: "Paisa samjho, future secure karo! Financial literacy seekho in style."
      }), /*#__PURE__*/_jsx("div", {
        className: "mb-8 grid grid-cols-2 gap-3",
        children: [{
          label: '11 Modules',
          color: '#10B981'
        }, {
          label: '11 Strategies',
          color: '#8B5CF6'
        }, {
          label: 'Hinglish',
          color: '#FBBF24'
        }, {
          label: 'Gamified',
          color: '#F59E0B'
        }].map(item => /*#__PURE__*/_jsx("div", {
          className: "rounded-xl bg-white/5 border border-white/8 p-3",
          children: /*#__PURE__*/_jsx("p", {
            className: "text-xs font-semibold",
            style: {
              color: item.color
            },
            children: item.label
          })
        }, item.label))
      }), /*#__PURE__*/_jsxs(motion.button, {
        whileHover: {
          scale: 1.03,
          boxShadow: '0 16px 40px rgba(16,185,129,0.40)'
        },
        whileTap: {
          scale: 0.97
        },
        onClick: onDismiss,
        className: "btn-emerald w-full cursor-pointer justify-center flex items-center gap-2 rounded-xl py-3.5 text-base font-semibold",
        children: [/*#__PURE__*/_jsx("span", {
          children: "Shuru Karo!"
        }), /*#__PURE__*/_jsx(ChevronRight, {
          size: 20
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "mt-4 text-xs text-ink-muted/60",
        children: "By continuing, you agree to our Terms of Service"
      })]
    })
  });
}
export default function HomePage() {
  const {
    hasCompletedOnboarding,
    setHasCompletedOnboarding
  } = useAppStore();
  const hydrated = useHydration();
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (hydrated && !hasCompletedOnboarding) {
      const t = setTimeout(() => setShowOnboarding(true), 0);
      return () => clearTimeout(t);
    }
  }, [hydrated, hasCompletedOnboarding]);
  const handleDismiss = useCallback(() => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);
  return /*#__PURE__*/_jsxs("main", {
    className: "relative min-h-screen w-full overflow-hidden",
    children: [/*#__PURE__*/_jsx(Background2D, {}), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showOnboarding && /*#__PURE__*/_jsx(OnboardingOverlay, {
        onDismiss: handleDismiss
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10",
      children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsx(Hero, {}), /*#__PURE__*/_jsx(Features, {}), /*#__PURE__*/_jsx(Gamification, {}), /*#__PURE__*/_jsx(motion.footer, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        transition: {
          duration: 0.6,
          delay: 1.2
        },
        className: "py-12 text-center border-t border-white/5",
        children: /*#__PURE__*/_jsxs("div", {
          className: "max-w-4xl mx-auto px-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-center gap-2.5 mb-4",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-8 h-8 rounded-xl flex items-center justify-center",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                boxShadow: '0 0 14px rgba(16,185,129,0.30)'
              },
              children: /*#__PURE__*/_jsx(Coins, {
                size: 16,
                className: "text-midnight",
                strokeWidth: 2.5
              })
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-base font-bold font-display",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-emerald-soft",
                children: "Capital"
              }), ' ', /*#__PURE__*/_jsx("span", {
                className: "text-gradient-brand",
                children: "Mastery"
              })]
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-ink-muted/80 flex items-center justify-center gap-1.5",
            children: ["Made with ", /*#__PURE__*/_jsx(Heart, {
              size: 12,
              className: "text-rose-400 fill-current"
            }), " for Indian Youth \xB7 \xA9 2026 Money Matters"]
          })]
        })
      })]
    })]
  });
}