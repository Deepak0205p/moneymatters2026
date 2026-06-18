"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/useAppStore";
import { Store, X, AlertTriangle, ShieldCheck, Flame, Trophy, CheckCircle2, HandHeart } from "lucide-react";

// ─── Stalls data (7 stalls) ──────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const STALLS = [{
  id: "emi-trap",
  name: "EMI Trap Ki Dukaan",
  emoji: "🏪",
  accent: "#EF4444",
  mistake: "Phone, TV, bike — sab kuch EMI pe lena. Mahine ka 60% income EMI mein nikal jaata hai. Khareedte waqt sasta lagta hai par 24 mahine tak chukana padta hai, interest ke saath.",
  stat: "Average Indian 6-8 EMIs chala raha hai — salary ka 50%+ fixed!",
  tips: ["EMI tabhi lo jab item zaroorat ho aur afford kar sako bina savings compromise kiye", "20-30-30 rule — 20% savings, 30% needs, 30% wants, 20% EMI max", "Pre-EMI: 3-6 mahine ka EMI emergency fund mein rakho hamesha"],
  pledgeText: "Main 50%+ salary EMI pe nahi lagaunga!"
}, {
  id: "lifestyle-inflation",
  name: "Lifestyle Inflation Lane",
  emoji: "🛍️",
  accent: "#F59E0B",
  mistake: "Salary badhi to kharcha bhi double. Naya phone, expensive clothes, Zomato daily. Income 2x hua par savings percentage same reh gayi — real wealth kabhi nahi banti.",
  stat: "Salaried Indians ka 70% lifestyle inflation se zyada save nahi karte!",
  tips: ["Salary badhne pe kharcha kam badhao — savings % badhao", "50% of every increment seedha investment mein daalo", "Recurring costs (subscriptions, EMI) har 6 mahine review karo"],
  pledgeText: "Salary badhne pe savings % bhi badhaunga!"
}, {
  id: "no-emergency",
  name: "No Emergency Fund Corner",
  emoji: "🚨",
  accent: "#10B981",
  mistake: "Bina emergency fund ke jeena — medical emergency, job loss, ya accident aaya to credit card pe ud jaata ho. Phir debt se nikalna mushkil. Pehla step yahi hai financial freedom ka.",
  stat: "73% Indians ke paas 1 mahine ka bhi emergency fund nahi hai!",
  tips: ["3-6 mahine ka kharcha emergency fund banao (liquid fund ya savings)", "Is fund ko kabhi touch mat karo except real emergency", "Medical + accident insurance alag rakho — ye fund sirf income loss ke liye"],
  pledgeText: "3-6 mahine ka emergency fund zaroor banaunga!"
}, {
  id: "min-payment",
  name: "Credit Card Min Payment Shop",
  emoji: "💳",
  accent: "#8B5CF6",
  mistake: "Credit card bill ka sirf 'minimum due' pay karna — 36-45% interest lagta hai baaki pe. 1 lakh ka bill 5 saal mein 2.5 lakh ho jaata hai. Sabse mehnga loan hai ye!",
  stat: "Credit card interest 36-45% hai — sabse mehnga form of debt!",
  tips: ["Hamesha full bill pay karo — never just minimum due", "Credit card ko 30% utilization se neeche rakho (CIBIL ke liye)", "Auto-pay setup karo full amount pe — bhoolne ka risk nahi"],
  pledgeText: "Hamesha credit card ka full payment karunga!"
}, {
  id: "impulse-buy",
  name: "Impulse Buying Bazaar",
  emoji: "🎪",
  accent: "#EC4899",
  mistake: "Sale, discount, flash deal — dekhte hi khareed lena. Amazon/Flipkart notifications pe react karna. 80% impulse purchases use hi nahi hote — seedha dustbin ya OLX.",
  stat: "Indians 30-40% online purchases impulse mein karte hain!",
  tips: ["24-hour rule — koi bhi non-essential khareedne se pehle ek raat socho", "Shopping apps ke notifications band karo", "Wishlist banao — 7 din baad bhi chahiye to khareedo"],
  pledgeText: "Impulse khareedne se pehle 24 ghanta sochunga!"
}, {
  id: "no-insurance",
  name: "No Insurance Thela",
  emoji: "🛒",
  accent: "#3B82F6",
  mistake: "Insurance waste samajhna — jab tak zaroorat nahi padi tab tak. Bina term/health insurance ke ek medical emergency poori savings kha jaata hai. Family bachat ki kainchi bina kaate jaati hai.",
  stat: "Sirf 20% Indians ke paas adequate life insurance hai!",
  tips: ["Term plan 30s mein le lo — premium half of what you'd pay in 40s", "Health insurance minimum ₹10L cover (family floater)", "Annual premium = 2-5% of income is fine for full protection"],
  pledgeText: "Term + Health insurance zaroor lera!"
}, {
  id: "yolo-spending",
  name: "YOLO Spending Zone",
  emoji: "🎰",
  accent: "#06B6D4",
  mistake: "'You Only Live Once' bol ke har weekend splurge. Friday party, Saturday brunch, Sunday shopping. Aaj ka paisa aaj uda do — kal ka kal dekhenge. Retirement planning to bhool hi jao.",
  stat: "60% millennials ka retirement plan = zero!",
  tips: ["50/30/20 rule — 50% needs, 30% wants, 20% savings/investing", "Har month SIP auto-debit setup — pehle invest, baad mein kharch", "Retirement target: 25x annual expense by 60 (FIRE rule)"],
  pledgeText: "Har mahine 20% income invest karna commit karta!"
}];
export default function MistakeMarket() {
  const [activeStall, setActiveStall] = useState(null);
  const [pledged, setPledged] = useState(new Set());
  const [visited, setVisited] = useState(new Set());
  const [showExpertBadge, setShowExpertBadge] = useState(false);
  const {
    addCoins,
    coins
  } = useAppStore();
  const activeStallData = useMemo(() => STALLS.find(s => s.id === activeStall) || null, [activeStall]);
  const visitedCount = visited.size;
  const allVisited = visitedCount === STALLS.length;
  const handleStallClick = id => {
    setActiveStall(id);
    if (!visited.has(id)) {
      const newVisited = new Set(visited).add(id);
      setVisited(newVisited);
      // After visiting all stalls
      if (newVisited.size === STALLS.length && !showExpertBadge) {
        setShowExpertBadge(true);
        addCoins(50);
      }
    }
  };
  const handlePledge = id => {
    if (pledged.has(id)) return;
    setPledged(prev => new Set(prev).add(id));
    addCoins(10);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "relative flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-5 py-6 gap-5",
    children: [/*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: -10
      },
      animate: {
        opacity: 1,
        y: 0
      },
      className: "text-center",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-2",
        children: [/*#__PURE__*/_jsx(Store, {
          size: 14,
          className: "text-red-400"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[11px] font-semibold text-zinc-300 tracking-wide uppercase",
          children: "Strategy 11 \xB7 Galtiyon Ka Bazaar"
        })]
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-2xl sm:text-3xl font-bold font-display text-gradient-gold mb-1",
        children: "Mistake Market \uD83C\uDFEA"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-zinc-400 font-medium",
        children: "Galtiyon ka bazaar ghoomo \u2014 har stall ek financial mistake hai. Seekho aur bache!"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Flame, {
            size: 16,
            className: "text-amber-400"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-sm font-bold text-zinc-200",
            children: "Stalls Visited"
          })]
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-sm font-bold text-emerald-400 number-highlight",
          children: [visitedCount, " / ", STALLS.length]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "h-2.5 w-full bg-white/5 rounded-full overflow-hidden",
        children: /*#__PURE__*/_jsx(motion.div, {
          className: "h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500",
          initial: {
            width: 0
          },
          animate: {
            width: `${visitedCount / STALLS.length * 100}%`
          },
          transition: {
            duration: 0.5
          }
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mt-2",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-[11px] text-zinc-500",
          children: ["Pledges: ", /*#__PURE__*/_jsx("span", {
            className: "text-purple-400 font-bold",
            children: pledged.size
          }), " · ", "Coins: ", /*#__PURE__*/_jsx("span", {
            className: "text-amber-400 font-bold",
            children: coins
          })]
        }), allVisited && /*#__PURE__*/_jsx("span", {
          className: "text-[11px] font-bold text-emerald-400",
          children: "Market Expert badge unlocked! \uD83C\uDFC6"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4",
      children: STALLS.map((stall, idx) => {
        const isVisited = visited.has(stall.id);
        const isPledged = pledged.has(stall.id);
        const isActive = activeStall === stall.id;
        return /*#__PURE__*/_jsxs(motion.button, {
          onClick: () => handleStallClick(stall.id),
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: idx * 0.06
          },
          whileHover: {
            scale: 1.03,
            y: -3
          },
          whileTap: {
            scale: 0.97
          },
          className: "relative text-left rounded-2xl p-4 sm:p-5 glass-card hover-card-scale overflow-hidden",
          style: {
            borderColor: isVisited ? `${stall.accent}60` : "rgba(255,255,255,0.10)",
            boxShadow: isVisited ? `0 0 24px ${stall.accent}30, 0 0 0 1px ${stall.accent}40` : "none"
          },
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute top-0 left-0 right-0 h-1",
            style: {
              background: `linear-gradient(90deg, ${stall.accent}, ${stall.accent}00)`
            }
          }), isVisited && /*#__PURE__*/_jsx("div", {
            className: "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center",
            style: {
              backgroundColor: `${stall.accent}30`,
              border: `1px solid ${stall.accent}`
            },
            children: /*#__PURE__*/_jsx(CheckCircle2, {
              size: 14,
              style: {
                color: stall.accent
              }
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "text-4xl mb-2",
            children: stall.emoji
          }), /*#__PURE__*/_jsx("h3", {
            className: "text-sm sm:text-base font-bold font-display mb-1 pr-6",
            style: {
              color: stall.accent
            },
            children: stall.name
          }), /*#__PURE__*/_jsx("p", {
            className: "text-xs text-zinc-400 line-clamp-2",
            children: "Tap to see the mistake & how to avoid it \u2192"
          }), isPledged && /*#__PURE__*/_jsxs("div", {
            className: "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30",
            children: [/*#__PURE__*/_jsx(HandHeart, {
              size: 10
            }), " Pledged"]
          })]
        }, stall.id);
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: activeStallData && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        exit: {
          opacity: 0
        },
        onClick: () => setActiveStall(null),
        className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm",
        children: /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            scale: 0.9,
            y: 30,
            opacity: 0
          },
          animate: {
            scale: 1,
            y: 0,
            opacity: 1
          },
          exit: {
            scale: 0.9,
            y: 30,
            opacity: 0
          },
          transition: {
            type: "spring",
            stiffness: 280,
            damping: 24
          },
          onClick: e => e.stopPropagation(),
          className: "glass-card-premium rounded-2xl p-5 sm:p-6 max-w-lg w-full max-h-[88vh] overflow-y-auto custom-scroll",
          style: {
            borderColor: `${activeStallData.accent}50`
          },
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => setActiveStall(null),
            className: "absolute top-3 right-3 text-zinc-400 hover:text-white transition p-1.5",
            "aria-label": "Close",
            children: /*#__PURE__*/_jsx(X, {
              size: 20
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3 mb-4 pr-8",
            children: [/*#__PURE__*/_jsx("div", {
              className: "text-4xl rounded-2xl w-16 h-16 flex items-center justify-center shrink-0",
              style: {
                backgroundColor: `${activeStallData.accent}18`,
                border: `1px solid ${activeStallData.accent}40`
              },
              children: activeStallData.emoji
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("span", {
                className: "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1",
                style: {
                  backgroundColor: `${activeStallData.accent}22`,
                  color: activeStallData.accent
                },
                children: "Stall"
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-lg sm:text-xl font-bold font-display leading-tight",
                style: {
                  color: activeStallData.accent
                },
                children: activeStallData.name
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5 mb-1.5",
              children: [/*#__PURE__*/_jsx(AlertTriangle, {
                size: 14,
                className: "text-red-400"
              }), /*#__PURE__*/_jsx("h4", {
                className: "text-xs font-bold text-red-400 uppercase tracking-wider",
                children: "Galti Kya Hai?"
              })]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-zinc-200 leading-relaxed pl-5",
              children: activeStallData.mistake
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl p-3.5 mb-4 flex items-start gap-3",
            style: {
              backgroundColor: `${activeStallData.accent}12`,
              border: `1px solid ${activeStallData.accent}30`
            },
            children: [/*#__PURE__*/_jsx(Flame, {
              size: 18,
              className: "shrink-0 mt-0.5",
              style: {
                color: activeStallData.accent
              }
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] font-bold uppercase tracking-wider mb-0.5 text-zinc-400",
                children: "Scary Stat \uD83D\uDCCA"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-white font-semibold leading-snug",
                children: activeStallData.stat
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "mb-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5 mb-2",
              children: [/*#__PURE__*/_jsx(ShieldCheck, {
                size: 14,
                className: "text-emerald-400"
              }), /*#__PURE__*/_jsx("h4", {
                className: "text-xs font-bold text-emerald-400 uppercase tracking-wider",
                children: "Kaise Bacho?"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "space-y-2 pl-5",
              children: activeStallData.tips.map((tip, i) => /*#__PURE__*/_jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: i * 0.1
                },
                className: "flex items-start gap-2 text-sm text-zinc-200",
                children: [/*#__PURE__*/_jsx(CheckCircle2, {
                  size: 14,
                  className: "shrink-0 mt-0.5 text-emerald-400"
                }), /*#__PURE__*/_jsx("span", {
                  className: "leading-relaxed",
                  children: tip
                })]
              }, i))
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => handlePledge(activeStallData.id),
            disabled: pledged.has(activeStallData.id),
            className: `w-full rounded-xl px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${pledged.has(activeStallData.id) ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 cursor-default" : "btn-gold"}`,
            children: pledged.has(activeStallData.id) ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(CheckCircle2, {
                size: 16
              }), " Pledged! +10 coins"]
            }) : /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(HandHeart, {
                size: 16
              }), " Main Nahi Karunga (Pledge)"]
            })
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-center text-[11px] text-zinc-500 mt-2 italic",
            children: ["\u201C", activeStallData.pledgeText, "\u201D"]
          })]
        })
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showExpertBadge && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          scale: 0.8,
          y: 30
        },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0
        },
        exit: {
          opacity: 0,
          scale: 0.8
        },
        className: "glass-card-premium rounded-2xl p-6 text-center glow-gold",
        children: [/*#__PURE__*/_jsx(Trophy, {
          className: "w-12 h-12 mx-auto mb-2 text-amber-400"
        }), /*#__PURE__*/_jsx("h3", {
          className: "text-xl font-bold font-display text-gradient-gold mb-1",
          children: "Market Expert! \uD83C\uDFC6"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-zinc-300",
          children: ["Tumne saare 7 galtiyon ke stalls visit kar liye. Ab tum smart investor ho!", " ", /*#__PURE__*/_jsx("span", {
            className: "text-emerald-400 font-bold",
            children: "+50 coins"
          }), " reward mila."]
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setShowExpertBadge(false),
          className: "mt-3 text-xs text-zinc-400 hover:text-white transition",
          children: "Continue exploring \u2192"
        })]
      })
    })]
  });
}