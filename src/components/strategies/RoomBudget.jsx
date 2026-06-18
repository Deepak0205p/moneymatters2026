'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { budgetTemplates } from '@/lib/data/budget-templates';
import { formatCurrency } from '@/lib/utils';
import { BUDGET_RULE } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SliderControl from '@/components/shared/SliderControl';
import { Home, PiggyBank, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ─── Room area config ──────────────────────────────────────
const roomAreaConfig = {
  bed: {
    label: 'Bed (Rent)',
    emoji: '🛏️',
    color: '#3b82f6',
    position: 'top-left'
  },
  kitchen: {
    label: 'Kitchen (Food)',
    emoji: '🍳',
    color: '#f97316',
    position: 'top-right'
  },
  desk: {
    label: 'Desk (Study)',
    emoji: '📚',
    color: '#8b5cf6',
    position: 'mid-left'
  },
  phone: {
    label: 'Phone (Recharge)',
    emoji: '📱',
    color: '#06b6d4',
    position: 'mid-right'
  },
  door: {
    label: 'Door (Transport)',
    emoji: '🚪',
    color: '#22c55e',
    position: 'bottom-left'
  },
  window: {
    label: 'Window (Savings)',
    emoji: '🪟',
    color: '#f59e0b',
    position: 'bottom-right'
  }
};

// ─── Room style by income ──────────────────────────────────
function getRoomStyle(income) {
  if (income <= 3000) return {
    label: 'Basic Shared Room',
    icon: '🏠',
    bg: 'from-gray-900 to-gray-800'
  };
  if (income <= 5000) return {
    label: 'Simple PG Room',
    icon: '🏡',
    bg: 'from-gray-800 to-slate-800'
  };
  if (income <= 15000) return {
    label: 'Decent PG Room',
    icon: '🏘️',
    bg: 'from-slate-800 to-zinc-800'
  };
  if (income <= 20000) return {
    label: 'Nice 1RK Flat',
    icon: '🏗️',
    bg: 'from-zinc-800 to-neutral-800'
  };
  return {
    label: 'Comfortable Apartment',
    icon: '🏢',
    bg: 'from-neutral-800 to-stone-800'
  };
}
export default function RoomBudget() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [categories, setCategories] = useState(budgetTemplates[0].categories.map(c => ({
    ...c
  })));
  const [expandedArea, setExpandedArea] = useState(undefined);
  const template = budgetTemplates.find(t => t.id === selectedTemplateId) || budgetTemplates[0];
  const roomStyle = getRoomStyle(template.income);

  // ─── Budget calculations ─────────────────────────────
  const totals = useMemo(() => {
    const needs = categories.filter(c => c.type === 'need').reduce((s, c) => s + c.amount, 0);
    const wants = categories.filter(c => c.type === 'want').reduce((s, c) => s + c.amount, 0);
    const savings = categories.filter(c => c.type === 'saving').reduce((s, c) => s + c.amount, 0);
    const total = needs + wants + savings;
    return {
      needs,
      wants,
      savings,
      total
    };
  }, [categories]);
  const percentages = useMemo(() => {
    const inc = template.income || 1;
    return {
      needs: Math.round(totals.needs / inc * 100),
      wants: Math.round(totals.wants / inc * 100),
      savings: Math.round(totals.savings / inc * 100)
    };
  }, [totals, template.income]);
  const budgetHealth = useMemo(() => {
    const needDiff = Math.abs(percentages.needs - BUDGET_RULE.needs);
    const wantDiff = Math.abs(percentages.wants - BUDGET_RULE.wants);
    const saveDiff = Math.abs(percentages.savings - BUDGET_RULE.savings);
    const avgDiff = (needDiff + wantDiff + saveDiff) / 3;
    if (avgDiff <= 5) return {
      level: 'excellent',
      color: '#22c55e',
      label: 'Excellent! 50/30/20 rule follow ho rahi hai! 🎉'
    };
    if (avgDiff <= 15) return {
      level: 'good',
      color: '#f59e0b',
      label: 'Accha hai! Thoda adjust karo toh perfect ho jayega 💪'
    };
    return {
      level: 'poor',
      color: '#ef4444',
      label: 'Budget fix karo! 50/30/20 rule se bahut door ho ⚠️'
    };
  }, [percentages]);

  // ─── Handle template change ──────────────────────────
  const handleTemplateChange = id => {
    setSelectedTemplateId(id);
    const t = budgetTemplates.find(bt => bt.id === id);
    if (t) setCategories(t.categories.map(c => ({
      ...c
    })));
    setExpandedArea(undefined);
  };

  // ─── Handle category amount change ───────────────────
  const handleAmountChange = (area, newAmount) => {
    setCategories(prev => prev.map(c => c.roomArea === area ? {
      ...c,
      amount: newAmount
    } : c));
  };

  // ─── Group categories by room area ───────────────────
  const areaCategories = useMemo(() => {
    const groups = {};
    categories.forEach(c => {
      const area = c.roomArea || 'other';
      if (!groups[area]) groups[area] = [];
      groups[area].push(c);
    });
    return groups;
  }, [categories]);
  const totalForArea = area => (areaCategories[area] || []).reduce((s, c) => s + c.amount, 0);
  return /*#__PURE__*/_jsxs("div", {
    className: "dots-pattern flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 gap-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-xl sm:text-2xl font-bold text-gradient-gold mb-1",
        children: "Ghar Ka Budget \uD83C\uDFE0"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-[#a0a0b8] mb-3 font-medium",
        children: "Apne kamre mein budget dekho \u2014 har cheez ka hisaab!"
      }), /*#__PURE__*/_jsx("div", {
        className: "flex flex-wrap items-center justify-center gap-2",
        children: budgetTemplates.map(t => /*#__PURE__*/_jsxs(Button, {
          size: "sm",
          variant: selectedTemplateId === t.id ? 'default' : 'outline',
          className: selectedTemplateId === t.id ? 'bg-amber-500 text-black font-bold hover:bg-amber-600' : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors',
          onClick: () => handleTemplateChange(t.id),
          children: ["Rs.", t.income.toLocaleString('en-IN'), "/mo"]
        }, t.id))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col lg:flex-row gap-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "flex-1",
        children: /*#__PURE__*/_jsx(Card, {
          className: "border-0 bg-[#12121a] overflow-hidden",
          style: {
            border: '1px solid rgba(255,255,255,0.06)'
          },
          children: /*#__PURE__*/_jsxs(CardContent, {
            className: "p-4",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 mb-3",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-lg",
                children: roomStyle.icon
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm font-semibold text-white",
                children: roomStyle.label
              }), /*#__PURE__*/_jsxs(Badge, {
                variant: "outline",
                className: "text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30 ml-auto",
                children: [formatCurrency(template.income), "/mahine"]
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3",
              children: Object.entries(roomAreaConfig).map(([area, config]) => {
                const isExpanded = expandedArea === area;
                const areaTotal = totalForArea(area);
                const isZero = areaTotal === 0;
                return /*#__PURE__*/_jsx(motion.div, {
                  layout: true,
                  onClick: () => setExpandedArea(isExpanded ? undefined : area),
                  className: "cursor-pointer",
                  whileHover: {
                    scale: 1.03
                  },
                  whileTap: {
                    scale: 0.97
                  },
                  children: /*#__PURE__*/_jsxs("div", {
                    className: "room-glow relative rounded-xl p-3 border transition-all",
                    style: {
                      backgroundColor: isExpanded ? `${config.color}15` : '#1a1a2e',
                      borderColor: isExpanded ? `${config.color}50` : 'rgba(255,255,255,0.06)'
                    },
                    children: [/*#__PURE__*/_jsxs("div", {
                      className: "flex items-center gap-2 mb-1",
                      children: [/*#__PURE__*/_jsx("span", {
                        className: "text-xl",
                        children: config.emoji
                      }), /*#__PURE__*/_jsx("span", {
                        className: "text-xs font-medium text-[#e8e8ed] truncate",
                        children: config.label
                      })]
                    }), /*#__PURE__*/_jsx(motion.div, {
                      animate: {
                        opacity: isZero ? 0.3 : 1
                      },
                      className: "text-lg font-bold",
                      style: {
                        color: config.color
                      },
                      children: formatCurrency(areaTotal)
                    }), isZero && area === 'window' && /*#__PURE__*/_jsx(motion.div, {
                      initial: {
                        scale: 0
                      },
                      animate: {
                        scale: 1
                      },
                      className: "absolute top-1 right-1",
                      children: /*#__PURE__*/_jsx(PiggyBank, {
                        size: 14,
                        className: "text-amber-400"
                      })
                    }), /*#__PURE__*/_jsx(ChevronRight, {
                      size: 12,
                      className: "absolute bottom-2 right-2 text-[#a0a0b8] transition-colors",
                      style: {
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                      }
                    })]
                  })
                }, area);
              })
            }), /*#__PURE__*/_jsx(AnimatePresence, {
              children: expandedArea && areaCategories[expandedArea] && /*#__PURE__*/_jsx(motion.div, {
                initial: {
                  height: 0,
                  opacity: 0
                },
                animate: {
                  height: 'auto',
                  opacity: 1
                },
                exit: {
                  height: 0,
                  opacity: 0
                },
                className: "overflow-hidden mt-3",
                children: /*#__PURE__*/_jsxs("div", {
                  className: "bg-[#1a1a2e] rounded-xl p-4 space-y-4 border border-white/5",
                  children: [/*#__PURE__*/_jsxs("h4", {
                    className: "text-sm font-semibold text-white flex items-center gap-2",
                    children: [roomAreaConfig[expandedArea]?.emoji, ' ', roomAreaConfig[expandedArea]?.label, " \u2014 Budget Adjust"]
                  }), areaCategories[expandedArea].map(cat => /*#__PURE__*/_jsx(SliderControl, {
                    label: cat.name,
                    value: cat.amount,
                    min: 0,
                    max: template.income,
                    step: 100,
                    onChange: val => handleAmountChange(expandedArea, val),
                    prefix: "Rs.",
                    color: roomAreaConfig[expandedArea]?.color || '#f59e0b'
                  }, cat.name))]
                })
              })
            })]
          })
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "w-full lg:w-72",
        children: /*#__PURE__*/_jsx(Card, {
          className: "corner-accent border-0 bg-[#12121a]",
          style: {
            border: '1px solid rgba(255,255,255,0.06)'
          },
          children: /*#__PURE__*/_jsxs(CardContent, {
            className: "p-4 space-y-3",
            children: [/*#__PURE__*/_jsxs("h4", {
              className: "text-sm font-semibold text-white flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Home, {
                size: 16,
                className: "text-amber-400"
              }), " Budget Summary"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "bg-amber-500/10 rounded-lg p-3 text-center",
              children: [/*#__PURE__*/_jsx("div", {
                className: "text-[10px] text-amber-400/80",
                children: "Monthly Income"
              }), /*#__PURE__*/_jsx("div", {
                className: "text-xl font-bold text-amber-400",
                children: formatCurrency(template.income)
              })]
            }), [{
              label: 'Needs (Zaroorat)',
              value: totals.needs,
              pct: percentages.needs,
              ideal: BUDGET_RULE.needs,
              color: '#3b82f6'
            }, {
              label: 'Wants (Chaahat)',
              value: totals.wants,
              pct: percentages.wants,
              ideal: BUDGET_RULE.wants,
              color: '#f97316'
            }, {
              label: 'Savings (Bachat)',
              value: totals.savings,
              pct: percentages.savings,
              ideal: BUDGET_RULE.savings,
              color: '#22c55e'
            }].map(row => /*#__PURE__*/_jsxs("div", {
              className: "space-y-1",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between text-xs",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-[#a0a0b8] font-medium",
                  children: row.label
                }), /*#__PURE__*/_jsxs("span", {
                  className: "font-semibold",
                  style: {
                    color: row.color
                  },
                  children: [formatCurrency(row.value), " (", row.pct, "%)"]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "relative h-2 rounded-full bg-[#1a1a2e]",
                children: [/*#__PURE__*/_jsx(motion.div, {
                  className: "absolute left-0 top-0 h-full rounded-full",
                  style: {
                    backgroundColor: row.color
                  },
                  animate: {
                    width: `${Math.min(100, row.pct)}%`
                  },
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 20
                  }
                }), /*#__PURE__*/_jsx("div", {
                  className: "absolute top-0 h-full w-0.5 bg-white/40",
                  style: {
                    left: `${row.ideal}%`
                  }
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-[10px] text-[#a0a0b8]/60 text-right font-medium",
                children: ["Ideal: ", row.ideal, "%"]
              })]
            }, row.label)), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between text-xs border-t border-white/5 pt-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-[#a0a0b8] font-medium",
                children: "Total Allocated"
              }), /*#__PURE__*/_jsxs("span", {
                className: "font-bold text-white",
                children: [formatCurrency(totals.total), " / ", formatCurrency(template.income)]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-lg p-3 text-center",
              style: {
                backgroundColor: `${budgetHealth.color}15`,
                border: `1px solid ${budgetHealth.color}30`
              },
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-center gap-1.5 mb-1",
                children: [budgetHealth.level === 'excellent' && /*#__PURE__*/_jsx(CheckCircle2, {
                  size: 14,
                  style: {
                    color: budgetHealth.color
                  }
                }), budgetHealth.level === 'good' && /*#__PURE__*/_jsx(AlertTriangle, {
                  size: 14,
                  style: {
                    color: budgetHealth.color
                  }
                }), budgetHealth.level === 'poor' && /*#__PURE__*/_jsx(XCircle, {
                  size: 14,
                  style: {
                    color: budgetHealth.color
                  }
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-xs font-semibold",
                  style: {
                    color: budgetHealth.color
                  },
                  children: budgetHealth.level === 'excellent' ? '🟢 Healthy' : budgetHealth.level === 'good' ? '🟡 Fair' : '🔴 Unhealthy'
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-[#a0a0b8] font-medium",
                children: budgetHealth.label
              })]
            })]
          })
        })
      })]
    })]
  });
}