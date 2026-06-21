"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store/useAppStore";
import { Search, X, CheckCircle2, Sparkles, Coins, BookOpen, Trophy } from "lucide-react";

// ─── Term data (hardcoded, 28 terms) ──────�import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { bubbleDictionaryTerms as TERMS } from "@/lib/data/bubble-dictionary-terms";
  seedhiBaat: "Har saal SIP amount 10% badhana (salary badhne ke saath). Same time pe corpus 40-60% zyada banta hai.",
  realLife: "₹10K SIP 20 saal @ 12% = ₹99L. Same 10% step-up = ₹1.7 crore! Sirf ₹1K extra first year, salary ke saath grow karta hai.",
  quiz: {
    q: "Step-up SIP mein amount kya hota hai?",
    options: ["Fixed rehta", "Har saal badhta", "Kam hota"],
    answer: 1
  }
}];

// ─── Category config ──────────────────────────────────────────
const categoryConfig = {
  Basic: {
    color: "#3B82F6",
    ring: "ring-blue-500/40",
    label: "Basic",
    glow: "rgba(59,130,246,0.4)"
  },
  Intermediate: {
    color: "#8B5CF6",
    ring: "ring-purple-500/40",
    label: "Intermediate",
    glow: "rgba(139,92,246,0.4)"
  },
  Advanced: {
    color: "#F59E0B",
    ring: "ring-amber-500/40",
    label: "Advanced",
    glow: "rgba(245,158,11,0.4)"
  }
};
export default function RupaiyaDictionary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [explored, setExplored] = useState(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = useRef(null);
  const {
    addCoins,
    coins
  } = useAppStore();
  const filteredTerms = useMemo(() => {
    let terms = TERMS;
    if (activeCategory !== "all") {
      terms = terms.filter(t => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      terms = terms.filter(t => t.term.toLowerCase().includes(q) || t.seedhiBaat.toLowerCase().includes(q) || t.realLife.toLowerCase().includes(q));
    }
    return terms;
  }, [activeCategory, searchQuery]);
  const expandedData = expandedTerm ? TERMS.find(t => t.id === expandedTerm) || null : null;
  const explorePercent = Math.round(explored.size / TERMS.length * 100);

  // Handle opening a term — mark explored, reset quiz, maybe show summary
  const handleOpenTerm = id => {
    if (expandedTerm === id) {
      setExpandedTerm(null);
      return;
    }
    setExpandedTerm(id);
    setQuizAnswer(null);
    if (!explored.has(id)) {
      const newExplored = new Set(explored).add(id);
      setExplored(newExplored);
      // Trigger completion summary directly if this was the last one
      if (newExplored.size === TERMS.length && !showSummary) {
        setShowSummary(true);
        addCoins(50);
      }
    }
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
        children: [/*#__PURE__*/_jsx(Sparkles, {
          size: 14,
          className: "text-amber-400"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[11px] font-semibold text-zinc-300 tracking-wide uppercase",
          children: "Strategy 9 \xB7 Bubble Dictionary"
        })]
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-2xl sm:text-3xl font-bold font-display text-gradient-emerald mb-1",
        children: "Rupaiya Dictionary \uD83E\uDEE7"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-zinc-400 font-medium",
        children: "Financial terms Hinglish mein \u2014 bubble click karke seedhi baat padho!"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex-1 w-full",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-1.5",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-xs font-semibold text-zinc-300",
            children: "Explored Terms"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-xs font-bold text-emerald-400 number-highlight",
            children: [explored.size, " / ", TERMS.length]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "h-2.5 w-full bg-white/5 rounded-full overflow-hidden",
          children: /*#__PURE__*/_jsx(motion.div, {
            className: "h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400",
            initial: {
              width: 0
            },
            animate: {
              width: `${explorePercent}%`
            },
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30",
        children: [/*#__PURE__*/_jsx(Coins, {
          size: 16,
          className: "text-amber-400"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-sm font-bold text-amber-400",
          children: coins
        }), /*#__PURE__*/_jsx("span", {
          className: "text-[10px] text-amber-300/70",
          children: "coins"
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative",
      children: [/*#__PURE__*/_jsx(Search, {
        size: 16,
        className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
      }), /*#__PURE__*/_jsx("input", {
        type: "text",
        placeholder: "Term search karo \u2014 'SIP', 'inflation', 'tax'...",
        value: searchQuery,
        onChange: e => setSearchQuery(e.target.value),
        className: "w-full pl-10 pr-10 py-3 rounded-xl glass text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
      }), searchQuery && /*#__PURE__*/_jsx("button", {
        onClick: () => setSearchQuery(""),
        className: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition",
        "aria-label": "Clear search",
        children: /*#__PURE__*/_jsx(X, {
          size: 16
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-wrap gap-2 justify-center",
      children: [/*#__PURE__*/_jsx(FilterChip, {
        active: activeCategory === "all",
        color: "#10B981",
        label: "All",
        count: TERMS.length,
        onClick: () => setActiveCategory("all")
      }), Object.keys(categoryConfig).map(cat => /*#__PURE__*/_jsx(FilterChip, {
        active: activeCategory === cat,
        color: categoryConfig[cat].color,
        label: categoryConfig[cat].label,
        count: TERMS.filter(t => t.category === cat).length,
        onClick: () => setActiveCategory(cat)
      }, cat))]
    }), /*#__PURE__*/_jsxs("div", {
      className: "min-h-[280px] sm:min-h-[340px] flex flex-wrap gap-3 justify-center items-start py-2",
      children: [/*#__PURE__*/_jsx(AnimatePresence, {
        children: filteredTerms.map((term, idx) => {
          const cfg = categoryConfig[term.category];
          const isExplored = explored.has(term.id);
          const isExpanded = expandedTerm === term.id;
          // Different sizes per category
          const sizeClass = term.category === "Advanced" ? "text-base px-5 py-3" : term.category === "Intermediate" ? "text-sm px-4 py-2.5" : "text-xs px-3 py-2";
          return /*#__PURE__*/_jsxs(motion.button, {
            layout: true,
            onClick: () => handleOpenTerm(term.id),
            className: `relative cursor-pointer rounded-full font-semibold ${sizeClass} glass-card hover-card-scale ${isExplored ? "ring-1 " + cfg.ring : ""}`,
            style: {
              color: "#F8FAFC",
              borderColor: isExpanded ? cfg.color : `${cfg.color}40`,
              boxShadow: isExpanded ? `0 0 24px ${cfg.glow}, 0 0 0 1px ${cfg.color}` : isExplored ? `0 0 12px ${cfg.glow}` : "none"
            },
            initial: {
              opacity: 0,
              scale: 0.4,
              y: 20
            },
            animate: {
              opacity: 1,
              scale: 1,
              y: [0, -8, 0]
            },
            exit: {
              opacity: 0,
              scale: 0.4
            },
            transition: {
              opacity: {
                duration: 0.3
              },
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 20
              },
              y: {
                repeat: Infinity,
                duration: 3 + idx % 4 * 0.6,
                ease: "easeInOut",
                delay: idx * 0.08
              }
            },
            whileHover: {
              scale: 1.12
            },
            whileTap: {
              scale: 0.92
            },
            children: [/*#__PURE__*/_jsx("span", {
              className: "mr-1.5",
              children: term.emoji
            }), /*#__PURE__*/_jsx("span", {
              className: "text-white",
              children: term.term
            }), isExplored && /*#__PURE__*/_jsx(CheckCircle2, {
              size: 12,
              className: "inline-block ml-1.5 -mt-0.5",
              style: {
                color: cfg.color
              }
            })]
          }, term.id);
        })
      }), filteredTerms.length === 0 && /*#__PURE__*/_jsxs("div", {
        className: "text-center py-12 text-zinc-500 font-medium",
        children: [/*#__PURE__*/_jsx(BookOpen, {
          className: "w-10 h-10 mx-auto mb-2 opacity-40"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm",
          children: "Koi term nahi mila \u2014 search ya filter change karo!"
        })]
      })]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: expandedData && /*#__PURE__*/_jsx(motion.div, {
        ref: summaryRef,
        initial: {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        transition: {
          type: "spring",
          stiffness: 280,
          damping: 25
        },
        children: /*#__PURE__*/_jsx(TermDetailCard, {
          term: expandedData,
          quizAnswer: quizAnswer,
          setQuizAnswer: setQuizAnswer,
          onClose: () => setExpandedTerm(null)
        })
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showSummary && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          scale: 0.95
        },
        className: "glass-card-premium rounded-2xl p-5 text-center glow-gold",
        children: [/*#__PURE__*/_jsx(Trophy, {
          className: "w-10 h-10 mx-auto mb-2 text-amber-400"
        }), /*#__PURE__*/_jsx("h3", {
          className: "text-lg font-bold font-display text-gradient-gold mb-1",
          children: "Dictionary Master! \uD83C\uDF89"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-sm text-zinc-300",
          children: ["Tumne saare ", TERMS.length, " financial terms explore kar liye.", " ", /*#__PURE__*/_jsx("span", {
            className: "text-emerald-400 font-bold",
            children: "+50 coins"
          }), " reward mila!"]
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setShowSummary(false),
          className: "mt-3 text-xs text-zinc-400 hover:text-white transition",
          children: "Close"
        })]
      })
    })]
  });
}

// ─── Filter Chip sub-component ──────────────────────────────
function FilterChip({
  active,
  color,
  label,
  count,
  onClick
}) {
  return /*#__PURE__*/_jsxs("button", {
    onClick: onClick,
    className: "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
    style: {
      backgroundColor: active ? `${color}22` : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
      color: active ? color : "#94A3B8"
    },
    children: [label, " ", /*#__PURE__*/_jsxs("span", {
      className: "opacity-70",
      children: ["(", count, ")"]
    })]
  });
}

// ─── Term Detail Card ───────────────────────────────────────
function TermDetailCard({
  term,
  quizAnswer,
  setQuizAnswer,
  onClose
}) {
  const cfg = categoryConfig[term.category];
  const isCorrect = quizAnswer === term.quiz.answer;
  return /*#__PURE__*/_jsxs("div", {
    className: "glass-card-premium rounded-2xl p-5 sm:p-6 relative",
    style: {
      borderColor: `${cfg.color}40`
    },
    children: [/*#__PURE__*/_jsx("button", {
      onClick: onClose,
      className: "absolute top-4 right-4 text-zinc-400 hover:text-white transition",
      "aria-label": "Close",
      children: /*#__PURE__*/_jsx(X, {
        size: 20
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-start gap-4 mb-4 pr-8",
      children: [/*#__PURE__*/_jsx("div", {
        className: "text-3xl sm:text-4xl rounded-2xl w-14 h-14 flex items-center justify-center shrink-0",
        style: {
          backgroundColor: `${cfg.color}18`,
          border: `1px solid ${cfg.color}40`
        },
        children: term.emoji
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("span", {
          className: "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1",
          style: {
            backgroundColor: `${cfg.color}22`,
            color: cfg.color
          },
          children: cfg.label
        }), /*#__PURE__*/_jsx("h3", {
          className: "text-2xl sm:text-3xl font-bold font-display text-white",
          children: term.term
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "mb-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1.5 mb-1.5",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-base",
          children: "\uD83D\uDCA1"
        }), /*#__PURE__*/_jsx("h4", {
          className: "text-xs font-bold text-emerald-400 uppercase tracking-wider",
          children: "Seedhi Baat"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-zinc-200 leading-relaxed pl-6",
        children: term.seedhiBaat
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "rounded-xl p-3.5 mb-4",
      style: {
        backgroundColor: `${cfg.color}10`
      },
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1.5 mb-1.5",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-base",
          children: "\uD83C\uDDEE\uD83C\uDDF3"
        }), /*#__PURE__*/_jsx("h4", {
          className: "text-xs font-bold uppercase tracking-wider",
          style: {
            color: cfg.color
          },
          children: "Real Life Mein"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-zinc-200 leading-relaxed pl-6",
        children: term.realLife
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "rounded-xl bg-black/30 border border-white/5 p-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1.5 mb-3",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-base",
          children: "\uD83C\uDFAF"
        }), /*#__PURE__*/_jsx("h4", {
          className: "text-xs font-bold text-amber-400 uppercase tracking-wider",
          children: "Quick Quiz"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-white font-medium mb-3",
        children: term.quiz.q
      }), /*#__PURE__*/_jsx("div", {
        className: "grid gap-2",
        children: term.quiz.options.map((opt, i) => {
          const isSelected = quizAnswer === i;
          const showResult = quizAnswer !== null;
          const optionIsCorrect = i === term.quiz.answer;
          return /*#__PURE__*/_jsxs("button", {
            disabled: showResult,
            onClick: () => setQuizAnswer(i),
            className: `text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all border ${showResult ? optionIsCorrect ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300" : isSelected ? "bg-red-500/15 border-red-500/50 text-red-300" : "bg-white/[0.02] border-white/5 text-zinc-400" : "bg-white/[0.03] border-white/8 text-zinc-200 hover:border-emerald-500/40 hover:bg-emerald-500/5 cursor-pointer"}`,
            children: [/*#__PURE__*/_jsxs("span", {
              className: "font-bold mr-2 opacity-70",
              children: [String.fromCharCode(65 + i), "."]
            }), opt, showResult && optionIsCorrect && /*#__PURE__*/_jsx(CheckCircle2, {
              size: 14,
              className: "inline-block ml-2 text-emerald-400"
            })]
          }, i);
        })
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        children: quizAnswer !== null && /*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0,
            height: 0
          },
          animate: {
            opacity: 1,
            height: "auto"
          },
          exit: {
            opacity: 0,
            height: 0
          },
          className: "overflow-hidden",
          children: /*#__PURE__*/_jsxs("div", {
            className: `mt-3 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 ${isCorrect ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`,
            children: [isCorrect ? "✅" : "❌", isCorrect ? "Bilkul sahi! Tu samajh gaya ye term." : `Oops! Sahi answer: ${term.quiz.options[term.quiz.answer]}`]
          })
        })
      })]
    })]
  });
}