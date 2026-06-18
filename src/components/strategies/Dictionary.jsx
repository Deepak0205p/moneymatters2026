'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { termsDictionary } from '@/lib/data/terms-dictionary';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, X, CheckCircle2, BookOpen, TrendingUp, Landmark, Receipt, Shield, AlertCircle, PiggyBank, GraduationCap } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─── Category config ───────────────────────────────────────
const categoryConfig = {
  investing: {
    label: 'Investing',
    color: '#22c55e',
    icon: TrendingUp
  },
  banking: {
    label: 'Banking',
    color: '#3b82f6',
    icon: Landmark
  },
  tax: {
    label: 'Tax',
    color: '#f59e0b',
    icon: Receipt
  },
  insurance: {
    label: 'Insurance',
    color: '#8b5cf6',
    icon: Shield
  },
  debt: {
    label: 'Debt',
    color: '#ef4444',
    icon: AlertCircle
  },
  saving: {
    label: 'Saving',
    color: '#06b6d4',
    icon: PiggyBank
  }
};
const allCategories = ['investing', 'banking', 'tax', 'insurance', 'debt', 'saving'];
export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState(null);
  const {
    masteredTerms,
    toggleTermMastered,
    setActiveModule
  } = useAppStore();

  // ─── Filter terms ────────────────────────────────────
  const filteredTerms = useMemo(() => {
    let terms = termsDictionary;
    if (activeCategory !== 'all') {
      terms = terms.filter(t => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      terms = terms.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.example.toLowerCase().includes(q));
    }
    return terms;
  }, [activeCategory, searchQuery]);

  // ─── Mastered count ──────────────────────────────────
  const masteredCount = masteredTerms.length;
  const totalTerms = termsDictionary.length;

  // ─── Expanded term data ──────────────────────────────
  const expandedData = expandedTerm ? termsDictionary.find(t => t.id === expandedTerm) : null;
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 gap-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl sm:text-2xl font-bold text-gradient-gold mb-1",
        children: "Rupaiya Dictionary \uD83D\uDCD6"
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-sm text-[#a0a0b8] font-medium",
        children: ["Financial terms Hinglish mein samjho \u2014 ", masteredCount, "/", totalTerms, " mastered!"]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-2 mx-auto w-48 h-2 bg-white/5 rounded-full overflow-hidden",
        children: /*#__PURE__*/_jsx(motion.div, {
          className: "h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#22c55e]",
          initial: {
            width: 0
          },
          animate: {
            width: `${masteredCount / totalTerms * 100}%`
          },
          transition: {
            duration: 0.8,
            ease: 'easeOut'
          }
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col sm:flex-row items-center gap-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative flex-1 w-full",
        children: [/*#__PURE__*/_jsx(Search, {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8]"
        }), /*#__PURE__*/_jsx(Input, {
          placeholder: "Term ya definition search karo...",
          value: searchQuery,
          onChange: e => setSearchQuery(e.target.value),
          className: "pl-9 bg-[#12121a] border-white/10 text-white placeholder:text-[#a0a0b8]/60 focus:border-amber-500/50 h-11 text-sm"
        }), searchQuery && /*#__PURE__*/_jsx("button", {
          onClick: () => setSearchQuery(''),
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] hover:text-white transition-colors",
          children: /*#__PURE__*/_jsx(X, {
            size: 14
          })
        })]
      }), /*#__PURE__*/_jsxs(Badge, {
        variant: "outline",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30 shrink-0",
        children: [/*#__PURE__*/_jsx(GraduationCap, {
          size: 12,
          className: "mr-1"
        }), masteredCount, "/", totalTerms]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex items-center gap-0.5 overflow-x-auto pb-1",
      children: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
        const hasTerms = termsDictionary.some(t => t.term.charAt(0).toUpperCase() === letter);
        return /*#__PURE__*/_jsx("button", {
          onClick: () => hasTerms ? setSearchQuery(letter) : undefined,
          className: `w-6 h-6 flex items-center justify-center rounded text-[9px] font-bold shrink-0 transition-all ${hasTerms ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer' : 'text-[#a0a0b8]/30 cursor-default'}`,
          children: letter
        }, letter);
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-wrap gap-2",
      children: [/*#__PURE__*/_jsxs(Button, {
        size: "sm",
        variant: activeCategory === 'all' ? 'default' : 'outline',
        className: cn('h-7 text-xs', activeCategory === 'all' ? 'bg-amber-500 text-black font-bold hover:bg-amber-600' : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors'),
        onClick: () => setActiveCategory('all'),
        children: ["All (", termsDictionary.length, ")"]
      }), allCategories.map(cat => {
        const config = categoryConfig[cat];
        const count = termsDictionary.filter(t => t.category === cat).length;
        return /*#__PURE__*/_jsxs(Button, {
          size: "sm",
          variant: activeCategory === cat ? 'default' : 'outline',
          className: cn('h-7 text-xs', activeCategory === cat ? 'font-bold hover:opacity-90' : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors'),
          style: activeCategory === cat ? {
            backgroundColor: config.color,
            color: '#000'
          } : undefined,
          onClick: () => setActiveCategory(cat),
          children: [config.label, " (", count, ")"]
        }, cat);
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "glow-line w-full"
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-wrap gap-2 justify-center",
      children: [/*#__PURE__*/_jsx(AnimatePresence, {
        children: filteredTerms.map(term => {
          const config = categoryConfig[term.category];
          const isMastered = masteredTerms.includes(term.id);
          const isExpanded = expandedTerm === term.id;
          return /*#__PURE__*/_jsx(motion.button, {
            layout: true,
            onClick: () => setExpandedTerm(isExpanded ? null : term.id),
            className: "relative cursor-pointer",
            initial: {
              opacity: 0,
              scale: 0.8
            },
            animate: {
              opacity: 1,
              scale: 1
            },
            exit: {
              opacity: 0,
              scale: 0.8
            },
            whileHover: {
              scale: 1.05
            },
            whileTap: {
              scale: 0.95
            },
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 25
            },
            children: /*#__PURE__*/_jsx("div", {
              className: cn('rounded-xl px-3 py-2 border transition-all', isMastered && 'ring-1'),
              style: {
                backgroundColor: isExpanded ? `${config.color}20` : `${config.color}10`,
                borderColor: isExpanded ? `${config.color}50` : `${config.color}25`,
                boxShadow: isMastered ? `0 0 8px ${config.color}30` : 'none'
              },
              children: /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5",
                children: [isMastered && /*#__PURE__*/_jsx(CheckCircle2, {
                  size: 12,
                  style: {
                    color: config.color
                  }
                }), !isMastered && /*#__PURE__*/_jsx(motion.div, {
                  className: "w-2 h-2 rounded-full",
                  style: {
                    backgroundColor: config.color
                  },
                  animate: {
                    opacity: [0.4, 1, 0.4]
                  },
                  transition: {
                    repeat: Infinity,
                    duration: 2
                  }
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-xs font-semibold text-[#e8e8ed] whitespace-nowrap",
                  children: term.term
                })]
              })
            })
          }, term.id);
        })
      }), filteredTerms.length === 0 && /*#__PURE__*/_jsxs("div", {
        className: "text-center py-8 text-[#a0a0b8] font-medium",
        children: [/*#__PURE__*/_jsx(BookOpen, {
          className: "w-8 h-8 mx-auto mb-2 opacity-40"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm",
          children: "Koi term nahi mila \u2014 search change karo!"
        })]
      })]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: expandedData && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25
        },
        children: /*#__PURE__*/_jsx(Card, {
          className: "term-card border-0",
          style: {
            backgroundColor: '#12121a',
            border: `1px solid ${categoryConfig[expandedData.category].color}30`
          },
          children: /*#__PURE__*/_jsxs(CardContent, {
            className: "p-5",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between mb-3",
              children: [/*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx(Badge, {
                  variant: "outline",
                  className: "text-[10px] mb-1",
                  style: {
                    color: categoryConfig[expandedData.category].color,
                    borderColor: `${categoryConfig[expandedData.category].color}40`
                  },
                  children: categoryConfig[expandedData.category].label
                }), /*#__PURE__*/_jsx("h3", {
                  className: "text-lg font-bold text-white",
                  children: expandedData.term
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => setExpandedTerm(null),
                className: "text-[#a0a0b8] hover:text-white p-1 transition-colors",
                children: /*#__PURE__*/_jsx(X, {
                  size: 18
                })
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "mb-3",
              children: [/*#__PURE__*/_jsx("h4", {
                className: "text-xs font-semibold text-amber-400 mb-1",
                children: "Definition"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-[#e8e8ed] leading-relaxed",
                children: expandedData.definition
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "mb-4 bg-[#1a1a2e] rounded-lg p-3",
              children: [/*#__PURE__*/_jsx("h4", {
                className: "text-xs font-semibold text-emerald-400 mb-1",
                children: "Indian Example \uD83C\uDDEE\uD83C\uDDF3"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-[#e8e8ed] leading-relaxed",
                children: expandedData.example
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsxs(Button, {
                onClick: () => toggleTermMastered(expandedData.id),
                className: cn('flex-1 font-semibold', masteredTerms.includes(expandedData.id) ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-black'),
                children: [/*#__PURE__*/_jsx(CheckCircle2, {
                  size: 14,
                  className: "mr-1"
                }), masteredTerms.includes(expandedData.id) ? 'Mastered ✓' : 'Mark as Mastered']
              }), /*#__PURE__*/_jsxs(Button, {
                variant: "outline",
                className: "border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors",
                onClick: () => {
                  setActiveModule(expandedData.relatedModule);
                  setExpandedTerm(null);
                },
                children: [/*#__PURE__*/_jsx(BookOpen, {
                  size: 14,
                  className: "mr-1"
                }), "Module ", expandedData.relatedModule]
              })]
            })]
          })
        })
      })
    })]
  });
}