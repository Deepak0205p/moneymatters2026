'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

// ─── 35 Hinglish Financial Tips ──────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DAILY_TIPS = [{
  emoji: '💰',
  text: '₹500 mahine ka SIP 20 saal mein ₹17 lakh bana sakta hai!'
}, {
  emoji: '🎯',
  text: 'Emergency fund = 6 mahine ka kharcha. Pehle yahi banao!'
}, {
  emoji: '📊',
  text: 'Rule of 72: 72 ÷ return rate = paisa double hone ke saal'
}, {
  emoji: '🚫',
  text: 'Credit card ka minimum payment kabhi mat karo — debt trap hai!'
}, {
  emoji: '🏦',
  text: 'PPF mein invest karo — tax-free returns + government guarantee!'
}, {
  emoji: '💡',
  text: '50/30/20 Rule: 50% needs, 30% wants, 20% savings'
}, {
  emoji: '📈',
  text: 'SIP mein time matter karta hai, timing nahi. Start early!'
}, {
  emoji: '🛡️',
  text: 'Insurance zaroori hai — life aur health dono!'
}, {
  emoji: '🧮',
  text: 'Einstein ne kaha: Compound interest duniya ka 8th wonder hai!'
}, {
  emoji: '💸',
  text: 'Pehle apne aapko pay karo — income ka 20% save karo pehle'
}, {
  emoji: '🔥',
  text: 'Inflation aapke paisa ka asli chor hai — invest karo, sirf save mat karo!'
}, {
  emoji: '📱',
  text: 'Digital gold bhi gold hai — ₹10 se shuru karo Sovereign Gold Bond!'
}, {
  emoji: '🎓',
  text: 'Student loan le rahe ho? EMI start hone se pehle part-time job dhundo!'
}, {
  emoji: '🏠',
  text: 'Ghar lena hai? 20% down payment apne paas rakhna zaroori hai!'
}, {
  emoji: '💳',
  text: 'Credit card ka bill full amount pay karo — grace period mein koi interest nahi!'
}, {
  emoji: '🎰',
  text: 'Lottery aur gambling se ameer nahi bante — 99% log paise gawaate hain!'
}, {
  emoji: '📉',
  text: 'Market girne pe panic mat karo — SIP continue rakhne mein hi samajhdari hai!'
}, {
  emoji: '🤝',
  text: 'Kisi ko bhi guarantee wala return ka lalkaara toh mat jana — fraud ho sakta hai!'
}, {
  emoji: '📚',
  text: 'Financial literacy aapko lifetime protect karegi — seekhte raho!'
}, {
  emoji: '⏰',
  text: '25 saal ki umar mein ₹5000/month SIP = 60 saal mein ₹3.5 Crore!'
}, {
  emoji: '🏦',
  text: 'Savings account mein paisa sota hai — mutual fund mein paisa kaam karta hai!'
}, {
  emoji: '🎯',
  text: 'Har mahine budget banao — bina plan ke paisa udta jaata hai!'
}, {
  emoji: '💡',
  text: 'Mutual fund sahi hai lebi KYC zaroori hai — PAN card se shuru karo!'
}, {
  emoji: '🚨',
  text: 'EMI ka total cost dekho, sirf monthly amount nahi — bahut zyada lagta hai!'
}, {
  emoji: '🌟',
  text: 'Side income banao — ek source pe depend mat raho!'
}, {
  emoji: '📋',
  text: 'Tax saving ke liye Section 80C use karo — ELSS + PPF best combo hai!'
}, {
  emoji: '💪',
  text: 'Chhota savings bhi bada impact karta hai — consistency is key!'
}, {
  emoji: '🔄',
  text: 'Har saal apna portfolio review karo — rebalancing zaroori hai!'
}, {
  emoji: '💰',
  text: 'Lifestyle inflation se bacho — salary badhne pe savings bhi badhao!'
}, {
  emoji: '🧠',
  text: 'Buy now pay later = future ka paisa aaj kharch karna — savdhani se!'
}, {
  emoji: '📊',
  text: 'Nifty 50 index fund = simplest aur effective investment beginner ke liye!'
}, {
  emoji: '🎁',
  text: 'Employer ka PF match free money hai — poora lelo, mat chhodo!'
}, {
  emoji: '🔑',
  text: 'Financial freedom = passive income > expenses — yahi ultimate goal hai!'
}, {
  emoji: '🌍',
  text: 'Diversification mat bhoolo — saare ande ek tokri mein mat rakhna!'
}];

// Get today's tip index based on date
function getDailyTipIndex() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % DAILY_TIPS.length;
}
const AUTO_ROTATE_INTERVAL = 30000; // 30 seconds

export function DailyTipBanner() {
  const {
    dismissedTipDate,
    setDismissedTipDate
  } = useAppStore();
  const [tipIndex, setTipIndex] = useState(getDailyTipIndex());
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [locallyDismissed, setLocallyDismissed] = useState(false);
  const timerRef = useRef(null);

  // Check if today's tip was already dismissed (from persisted store)
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isDismissedFromStore = dismissedTipDate === today;
  const isDismissed = isDismissedFromStore || locallyDismissed;

  // Auto-rotate tips
  useEffect(() => {
    if (isPaused || isHovered || isDismissed) return;
    timerRef.current = setInterval(() => {
      setTipIndex(prev => (prev + 1) % DAILY_TIPS.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isHovered, isDismissed]);
  const handleDismiss = useCallback(() => {
    setLocallyDismissed(true);
    setDismissedTipDate(today);
  }, [setDismissedTipDate, today]);
  const handleNextTip = useCallback(() => {
    setTipIndex(prev => (prev + 1) % DAILY_TIPS.length);
  }, []);
  const currentTip = DAILY_TIPS[tipIndex];
  if (isDismissed) return null;
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: !locallyDismissed && /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: -20,
        height: 0
      },
      animate: {
        opacity: 1,
        y: 0,
        height: 'auto'
      },
      exit: {
        opacity: 0,
        y: -20,
        height: 0
      },
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30
      },
      className: "relative overflow-hidden",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-gradient-to-r from-[#f59e0b]/10 via-[#fbbf24]/8 to-[#d97706]/10"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]/30"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 overflow-hidden pointer-events-none",
        children: [...Array(6)].map((_, i) => /*#__PURE__*/_jsx(motion.div, {
          className: "absolute w-1 h-1 rounded-full bg-[#fbbf24]",
          style: {
            left: `${15 + i * 15}%`,
            top: '50%'
          },
          animate: {
            y: [0, -8, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          },
          transition: {
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut'
          }
        }, i))
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative px-4 py-2.5 flex items-center gap-3 max-w-4xl mx-auto",
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "shrink-0 w-7 h-7 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/20 flex items-center justify-center",
          animate: {
            rotate: [0, -8, 8, -8, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          },
          children: /*#__PURE__*/_jsx(Lightbulb, {
            size: 13,
            className: "text-[#fbbf24]"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 min-w-0",
          children: /*#__PURE__*/_jsx(AnimatePresence, {
            mode: "wait",
            children: /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                opacity: 0,
                x: 20
              },
              animate: {
                opacity: 1,
                x: 0
              },
              exit: {
                opacity: 0,
                x: -20
              },
              transition: {
                duration: 0.3
              },
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm",
                children: currentTip.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs sm:text-sm text-[#e8e8ed] leading-relaxed",
                children: currentTip.text
              })]
            }, tipIndex)
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(motion.button, {
            onClick: handleNextTip,
            className: "p-1.5 rounded-lg text-[#8888a0] hover:text-[#fbbf24] hover:bg-[#f59e0b]/10 transition-colors",
            whileHover: {
              scale: 1.1,
              rotate: 180
            },
            whileTap: {
              scale: 0.9
            },
            "aria-label": "Next tip",
            onMouseEnter: () => setIsPaused(true),
            onMouseLeave: () => setIsPaused(false),
            children: /*#__PURE__*/_jsx(RefreshCw, {
              size: 13
            })
          }), /*#__PURE__*/_jsx(motion.button, {
            onClick: handleDismiss,
            className: "p-1.5 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors",
            whileHover: {
              scale: 1.1
            },
            whileTap: {
              scale: 0.9
            },
            "aria-label": "Dismiss tip",
            children: /*#__PURE__*/_jsx(X, {
              size: 13
            })
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"
      })]
    })
  });
}