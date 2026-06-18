"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { RotateCcw, Trophy, Heart, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const CARDS = [{
  id: 1,
  name: 'Monthly Rent',
  amount: 8000,
  emoji: '🏠',
  systemChoice: 'need'
}, {
  id: 2,
  name: 'Groceries / Sabzi',
  amount: 3000,
  emoji: '🥬',
  systemChoice: 'need'
}, {
  id: 3,
  name: 'Electricity Bill',
  amount: 1200,
  emoji: '⚡',
  systemChoice: 'need'
}, {
  id: 4,
  name: 'Netflix Subscription',
  amount: 649,
  emoji: '📺',
  systemChoice: 'want'
}, {
  id: 5,
  name: 'Gym Membership',
  amount: 1500,
  emoji: '💪',
  systemChoice: 'want'
}, {
  id: 6,
  name: 'Chai Tapri (₹30/day)',
  amount: 900,
  emoji: '☕',
  systemChoice: 'want',
  note: '₹30 × 30 din'
}, {
  id: 7,
  name: 'iPhone EMI',
  amount: 3000,
  emoji: '📱',
  systemChoice: 'want',
  note: 'Ya cash kharido?'
}, {
  id: 8,
  name: 'Mobile Recharge',
  amount: 299,
  emoji: '📲',
  systemChoice: 'need'
}, {
  id: 9,
  name: 'Swiggy/Zomato',
  amount: 2500,
  emoji: '🛵',
  systemChoice: 'want',
  note: 'Khana banao to free!'
}, {
  id: 10,
  name: 'Petrol / Travel',
  amount: 2000,
  emoji: '⛽',
  systemChoice: 'need'
}, {
  id: 11,
  name: 'Movie Tickets',
  amount: 500,
  emoji: '🎬',
  systemChoice: 'want'
}, {
  id: 12,
  name: 'Doctor Visit',
  amount: 800,
  emoji: '🏥',
  systemChoice: 'need'
}, {
  id: 13,
  name: 'Branded Clothes',
  amount: 2000,
  emoji: '👕',
  systemChoice: 'want',
  note: 'Local bhi chal jayega'
}, {
  id: 14,
  name: 'EMI for Old Loan',
  amount: 2500,
  emoji: '📃',
  systemChoice: 'need',
  note: 'Pehle khatam karo'
}, {
  id: 15,
  name: 'Friend Birthday Party',
  amount: 1000,
  emoji: '🎂',
  systemChoice: 'want'
}, {
  id: 16,
  name: 'Books / Online Course',
  amount: 700,
  emoji: '📚',
  systemChoice: 'need',
  note: 'Investment in self'
}, {
  id: 17,
  name: 'Smokes / Cold Drink',
  amount: 1200,
  emoji: '🚬',
  systemChoice: 'want',
  note: 'Health + paisa dono waste'
}, {
  id: 18,
  name: 'Internet Bill',
  amount: 800,
  emoji: '🌐',
  systemChoice: 'need'
}];
function formatINR(n) {
  return `₹${n.toLocaleString('en-IN')}`;
}
export default function BudgetKhel() {
  const {
    addCoins
  } = useAppStore();
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [phase, setPhase] = useState('play');
  const [exitDir, setExitDir] = useState(null);
  const makeChoice = choice => {
    if (exitDir) return;
    setExitDir(choice);
    const newChoices = [...choices, choice];
    setChoices(newChoices);
    setTimeout(() => {
      if (index + 1 < CARDS.length) {
        setIndex(index + 1);
      } else {
        setPhase('summary');
        addCoins(30);
      }
      setExitDir(null);
    }, 350);
  };
  const handleDragEnd = (_e, info) => {
    if (info.offset.x > 100) makeChoice('need');else if (info.offset.x < -100) makeChoice('want');
  };
  const card = CARDS[index];
  const progress = Math.round(index / CARDS.length * 100);

  // Summary stats
  const userNeeds = choices.filter(c => c === 'need').length;
  const userWants = choices.filter(c => c === 'want').length;
  const needPct = Math.round(userNeeds / CARDS.length * 100);
  const wantPct = Math.round(userWants / CARDS.length * 100);
  // Money split
  const totalNeeds = choices.reduce((sum, c, i) => c === 'need' ? sum + CARDS[i].amount : sum, 0);
  const totalWants = choices.reduce((sum, c, i) => c === 'want' ? sum + CARDS[i].amount : sum, 0);
  const totalAmt = totalNeeds + totalWants || 1;
  const needMoneyPct = Math.round(totalNeeds / totalAmt * 100);
  const wantMoneyPct = 100 - needMoneyPct;

  // 50-30-20 rule: 50% needs, 30% wants, 20% savings
  const needDeviation = Math.abs(needMoneyPct - 50);
  const wantDeviation = Math.abs(wantMoneyPct - 30);
  const budgetScore = Math.max(0, 100 - (needDeviation + wantDeviation) * 1.5);
  const reset = () => {
    setChoices([]);
    setIndex(0);
    setPhase('play');
    setExitDir(null);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full space-y-6",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center space-y-2",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-center gap-2",
        children: [/*#__PURE__*/_jsx(Trophy, {
          className: "text-gold",
          size: 26
        }), /*#__PURE__*/_jsx("h2", {
          className: "text-2xl md:text-3xl font-display font-bold text-gradient-gold",
          children: "Budget Khel"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted font-medium",
        children: "Tinder-style swipe game \u2014 Har kharcha NEED hai ya WANT? \uD83D\uDC49\uD83D\uDC48"
      })]
    }), phase === 'play' ? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-xs text-ink-muted whitespace-nowrap",
          children: [index + 1, "/", CARDS.length]
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: "h-full bg-gold-gradient",
            animate: {
              width: `${progress}%`
            },
            transition: {
              duration: 0.3
            }
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex justify-between text-[11px] font-medium",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "flex items-center gap-1 text-gold",
          children: [/*#__PURE__*/_jsx(ArrowRight, {
            className: "rotate-180",
            size: 14
          }), " Swipe Left = WANT \uD83D\uDCA1"]
        }), /*#__PURE__*/_jsxs("span", {
          className: "flex items-center gap-1 text-emerald",
          children: ["Swipe Right = NEED \u2713 ", /*#__PURE__*/_jsx(ArrowRight, {
            size: 14
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "relative h-[340px] sm:h-[360px] flex items-center justify-center",
        children: /*#__PURE__*/_jsx(AnimatePresence, {
          mode: "popLayout",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: "absolute w-full max-w-sm",
            drag: "x",
            dragConstraints: {
              left: 0,
              right: 0
            },
            dragElastic: 0.7,
            onDragEnd: handleDragEnd,
            initial: {
              scale: 0.85,
              opacity: 0,
              y: 30
            },
            animate: {
              scale: 1,
              opacity: 1,
              y: 0
            },
            exit: {
              x: exitDir === 'need' ? 350 : exitDir === 'want' ? -350 : 0,
              opacity: 0,
              rotate: exitDir === 'need' ? 25 : exitDir === 'want' ? -25 : 0,
              transition: {
                duration: 0.35
              }
            },
            transition: {
              type: 'spring',
              stiffness: 280,
              damping: 22
            },
            children: /*#__PURE__*/_jsxs("div", {
              className: "glass-card-premium rounded-3xl p-7 sm:p-8 text-center relative overflow-hidden",
              style: {
                boxShadow: exitDir === 'need' ? '0 0 50px rgba(16,185,129,0.5)' : exitDir === 'want' ? '0 0 50px rgba(245,158,11,0.5)' : '0 12px 40px rgba(0,0,0,0.4)'
              },
              children: [/*#__PURE__*/_jsxs(AnimatePresence, {
                children: [exitDir === 'need' && /*#__PURE__*/_jsx(motion.div, {
                  className: "absolute inset-0 flex items-center justify-center bg-emerald/20 z-20",
                  initial: {
                    opacity: 0
                  },
                  animate: {
                    opacity: 1
                  },
                  exit: {
                    opacity: 0
                  },
                  children: /*#__PURE__*/_jsx("div", {
                    className: "text-4xl font-display font-bold text-emerald",
                    children: "NEED \u2713"
                  })
                }), exitDir === 'want' && /*#__PURE__*/_jsx(motion.div, {
                  className: "absolute inset-0 flex items-center justify-center bg-gold/20 z-20",
                  initial: {
                    opacity: 0
                  },
                  animate: {
                    opacity: 1
                  },
                  exit: {
                    opacity: 0
                  },
                  children: /*#__PURE__*/_jsx("div", {
                    className: "text-4xl font-display font-bold text-gold",
                    children: "WANT \uD83D\uDCA1"
                  })
                })]
              }), /*#__PURE__*/_jsx(motion.div, {
                className: "text-7xl mb-3 inline-block",
                animate: {
                  y: [0, -4, 0]
                },
                transition: {
                  duration: 2,
                  repeat: Infinity
                },
                children: card.emoji
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-xl sm:text-2xl font-display font-bold text-ink leading-tight mb-1",
                children: card.name
              }), /*#__PURE__*/_jsx("p", {
                className: "text-2xl sm:text-3xl font-display font-bold text-gradient-gold mb-2",
                children: formatINR(card.amount)
              }), card.note && /*#__PURE__*/_jsx("p", {
                className: "text-[11px] text-ink-muted italic mb-2",
                children: card.note
              }), /*#__PURE__*/_jsx("div", {
                className: "flex items-center justify-center gap-2 pt-2",
                children: /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] uppercase tracking-wider text-ink-muted font-bold",
                  children: "Swipe karo \uD83D\uDC49"
                })
              })]
            })
          }, card.id)
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-2 gap-3 max-w-sm mx-auto",
        children: [/*#__PURE__*/_jsxs(motion.button, {
          onClick: () => makeChoice('want'),
          className: "py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 border",
          style: {
            background: 'rgba(245,158,11,0.10)',
            borderColor: 'rgba(245,158,11,0.35)',
            color: '#FBBF24'
          },
          whileTap: {
            scale: 0.95
          },
          children: [/*#__PURE__*/_jsx(Lightbulb, {
            size: 16
          }), " WANT"]
        }), /*#__PURE__*/_jsxs(motion.button, {
          onClick: () => makeChoice('need'),
          className: "py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 border",
          style: {
            background: 'rgba(16,185,129,0.10)',
            borderColor: 'rgba(16,185,129,0.35)',
            color: '#34D399'
          },
          whileTap: {
            scale: 0.95
          },
          children: [/*#__PURE__*/_jsx(Check, {
            size: 16
          }), " NEED"]
        })]
      })]
    }) :
    /*#__PURE__*/
    /* ─── Summary screen ─── */
    _jsxs(motion.div, {
      className: "space-y-5",
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        duration: 0.4
      },
      children: [/*#__PURE__*/_jsxs("div", {
        className: "text-center",
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "text-6xl mb-2 inline-block",
          animate: {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.15, 1]
          },
          transition: {
            duration: 0.7
          },
          children: "\uD83C\uDF89"
        }), /*#__PURE__*/_jsx("h3", {
          className: "text-2xl font-display font-bold text-gradient-gold",
          children: "Khel Khatam!"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-ink-muted mt-1",
          children: ["Tumhara budget score: ", /*#__PURE__*/_jsxs("span", {
            className: "text-emerald font-bold",
            children: [Math.round(budgetScore), "/100"]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "glass-card rounded-2xl p-5 sm:p-6 space-y-4",
        children: [/*#__PURE__*/_jsx("p", {
          className: "text-center text-xs uppercase tracking-wider text-ink-muted font-bold",
          children: "Tumhara Money Split"
        }), /*#__PURE__*/_jsx("div", {
          className: "flex items-center justify-center",
          children: /*#__PURE__*/_jsx("div", {
            className: "w-40 h-40 rounded-full flex items-center justify-center relative",
            style: {
              background: `conic-gradient(#10B981 0% ${needMoneyPct}%, #F59E0B ${needMoneyPct}% 100%)`,
              boxShadow: '0 0 40px rgba(0,0,0,0.3)'
            },
            children: /*#__PURE__*/_jsxs("div", {
              className: "w-24 h-24 rounded-full bg-midnight flex flex-col items-center justify-center",
              style: {
                background: '#0B1220'
              },
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-lg font-display font-bold text-ink",
                children: CARDS.length
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[9px] text-ink-muted uppercase",
                children: "Cards"
              })]
            })
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 gap-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 text-center",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-center gap-1.5 mb-1",
              children: [/*#__PURE__*/_jsx(Heart, {
                className: "text-emerald",
                size: 14
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[10px] uppercase tracking-wider text-emerald font-bold",
                children: "Needs"
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xl font-display font-bold text-emerald",
              children: userNeeds
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-ink-muted",
              children: [needMoneyPct, "% money"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "glass rounded-xl p-3 text-center",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-center gap-1.5 mb-1",
              children: [/*#__PURE__*/_jsx(Lightbulb, {
                className: "text-gold",
                size: 14
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[10px] uppercase tracking-wider text-gold font-bold",
                children: "Wants"
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xl font-display font-bold text-gold",
              children: userWants
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-ink-muted",
              children: [wantMoneyPct, "% money"]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "glass-card-premium rounded-2xl p-5 space-y-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-xl",
            children: "\uD83C\uDFAF"
          }), /*#__PURE__*/_jsx("h4", {
            className: "text-sm font-display font-bold text-ink",
            children: "50-30-20 Rule Benchmark"
          })]
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-[11px] text-ink-muted",
          children: ["Ideal split: ", /*#__PURE__*/_jsx("span", {
            className: "text-emerald font-semibold",
            children: "50% Needs"
          }), ", ", /*#__PURE__*/_jsx("span", {
            className: "text-gold font-semibold",
            children: "30% Wants"
          }), ", ", /*#__PURE__*/_jsx("span", {
            className: "text-ai font-semibold",
            children: "20% Savings"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-[10px] text-ink-muted mb-1",
              children: [/*#__PURE__*/_jsxs("span", {
                children: ["Needs (Tum: ", needMoneyPct, "%)"]
              }), /*#__PURE__*/_jsx("span", {
                children: "Ideal: 50%"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "h-2 rounded-full bg-white/5 overflow-hidden relative",
              children: [/*#__PURE__*/_jsx("div", {
                className: "absolute h-full bg-emerald",
                style: {
                  width: `${needMoneyPct}%`
                }
              }), /*#__PURE__*/_jsx("div", {
                className: "absolute h-full w-0.5 bg-ink opacity-50",
                style: {
                  left: '50%'
                }
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex justify-between text-[10px] text-ink-muted mb-1",
              children: [/*#__PURE__*/_jsxs("span", {
                children: ["Wants (Tum: ", wantMoneyPct, "%)"]
              }), /*#__PURE__*/_jsx("span", {
                children: "Ideal: 30%"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "h-2 rounded-full bg-white/5 overflow-hidden relative",
              children: [/*#__PURE__*/_jsx("div", {
                className: "absolute h-full bg-gold",
                style: {
                  width: `${wantMoneyPct}%`
                }
              }), /*#__PURE__*/_jsx("div", {
                className: "absolute h-full w-0.5 bg-ink opacity-50",
                style: {
                  left: '30%'
                }
              })]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "rounded-xl p-3 text-[11px] font-medium",
          style: {
            background: budgetScore >= 75 ? 'rgba(16,185,129,0.10)' : budgetScore >= 50 ? 'rgba(245,158,11,0.10)' : 'rgba(239,68,68,0.10)',
            border: `1px solid ${budgetScore >= 75 ? 'rgba(16,185,129,0.30)' : budgetScore >= 50 ? 'rgba(245,158,11,0.30)' : 'rgba(239,68,68,0.30)'}`,
            color: budgetScore >= 75 ? '#34D399' : budgetScore >= 50 ? '#FBBF24' : '#F87171'
          },
          children: budgetScore >= 75 ? '🏆 Perfect! Tum budget master ho. 20% savings bhi banao to aur bhi mast!' : budgetScore >= 50 ? '👍 Theek hai par improve kar sakte ho. Wants thoda kam karo, savings badhao.' : '⚠️ Alert! Wants zyada hain. Needs pe focus karo, savings zaroori hai.'
        })]
      }), /*#__PURE__*/_jsxs(motion.button, {
        onClick: reset,
        className: "btn-emerald w-full py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2",
        whileHover: {
          scale: 1.02
        },
        whileTap: {
          scale: 0.98
        },
        children: [/*#__PURE__*/_jsx(RotateCcw, {
          size: 16
        }), " Dobara Khelo"]
      })]
    })]
  });
}