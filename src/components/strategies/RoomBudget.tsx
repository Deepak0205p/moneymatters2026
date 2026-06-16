'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { budgetTemplates } from '@/lib/data/budget-templates';
import { useAppStore } from '@/lib/store/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { BUDGET_RULE } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SliderControl from '@/components/shared/SliderControl';
import DynamicIcon from '@/components/shared/DynamicIcon';
import { Home, PiggyBank, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import type { BudgetCategory, RoomArea } from '@/lib/types';

// ─── Room area config ──────────────────────────────────────
const roomAreaConfig: Record<string, { label: string; emoji: string; color: string; position: string }> = {
  bed: { label: 'Bed (Rent)', emoji: '🛏️', color: '#3b82f6', position: 'top-left' },
  kitchen: { label: 'Kitchen (Food)', emoji: '🍳', color: '#f97316', position: 'top-right' },
  desk: { label: 'Desk (Study)', emoji: '📚', color: '#8b5cf6', position: 'mid-left' },
  phone: { label: 'Phone (Recharge)', emoji: '📱', color: '#06b6d4', position: 'mid-right' },
  door: { label: 'Door (Transport)', emoji: '🚪', color: '#22c55e', position: 'bottom-left' },
  window: { label: 'Window (Savings)', emoji: '🪟', color: '#f59e0b', position: 'bottom-right' },
};

// ─── Room style by income ──────────────────────────────────
function getRoomStyle(income: number) {
  if (income <= 3000) return { label: 'Basic Shared Room', icon: '🏠', bg: 'from-gray-900 to-gray-800' };
  if (income <= 5000) return { label: 'Simple PG Room', icon: '🏡', bg: 'from-gray-800 to-slate-800' };
  if (income <= 15000) return { label: 'Decent PG Room', icon: '🏘️', bg: 'from-slate-800 to-zinc-800' };
  if (income <= 20000) return { label: 'Nice 1RK Flat', icon: '🏗️', bg: 'from-zinc-800 to-neutral-800' };
  return { label: 'Comfortable Apartment', icon: '🏢', bg: 'from-neutral-800 to-stone-800' };
}

export default function RoomBudget() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [categories, setCategories] = useState<BudgetCategory[]>(
    budgetTemplates[0].categories.map((c) => ({ ...c }))
  );
  const [expandedArea, setExpandedArea] = useState<RoomArea>(undefined);

  const template = budgetTemplates.find((t) => t.id === selectedTemplateId) || budgetTemplates[0];
  const roomStyle = getRoomStyle(template.income);

  // ─── Budget calculations ─────────────────────────────
  const totals = useMemo(() => {
    const needs = categories.filter((c) => c.type === 'need').reduce((s, c) => s + c.amount, 0);
    const wants = categories.filter((c) => c.type === 'want').reduce((s, c) => s + c.amount, 0);
    const savings = categories.filter((c) => c.type === 'saving').reduce((s, c) => s + c.amount, 0);
    const total = needs + wants + savings;
    return { needs, wants, savings, total };
  }, [categories]);

  const percentages = useMemo(() => {
    const inc = template.income || 1;
    return {
      needs: Math.round((totals.needs / inc) * 100),
      wants: Math.round((totals.wants / inc) * 100),
      savings: Math.round((totals.savings / inc) * 100),
    };
  }, [totals, template.income]);

  const budgetHealth = useMemo(() => {
    const needDiff = Math.abs(percentages.needs - BUDGET_RULE.needs);
    const wantDiff = Math.abs(percentages.wants - BUDGET_RULE.wants);
    const saveDiff = Math.abs(percentages.savings - BUDGET_RULE.savings);
    const avgDiff = (needDiff + wantDiff + saveDiff) / 3;
    if (avgDiff <= 5) return { level: 'excellent', color: '#22c55e', label: 'Excellent! 50/30/20 rule follow ho rahi hai! 🎉' };
    if (avgDiff <= 15) return { level: 'good', color: '#f59e0b', label: 'Accha hai! Thoda adjust karo toh perfect ho jayega 💪' };
    return { level: 'poor', color: '#ef4444', label: 'Budget fix karo! 50/30/20 rule se bahut door ho ⚠️' };
  }, [percentages]);

  // ─── Handle template change ──────────────────────────
  const handleTemplateChange = (id: number) => {
    setSelectedTemplateId(id);
    const t = budgetTemplates.find((bt) => bt.id === id);
    if (t) setCategories(t.categories.map((c) => ({ ...c })));
    setExpandedArea(undefined);
  };

  // ─── Handle category amount change ───────────────────
  const handleAmountChange = (area: RoomArea, newAmount: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.roomArea === area ? { ...c, amount: newAmount } : c))
    );
  };

  // ─── Group categories by room area ───────────────────
  const areaCategories = useMemo(() => {
    const groups: Record<string, BudgetCategory[]> = {};
    categories.forEach((c) => {
      const area = c.roomArea || 'other';
      if (!groups[area]) groups[area] = [];
      groups[area].push(c);
    });
    return groups;
  }, [categories]);

  const totalForArea = (area: string) =>
    (areaCategories[area] || []).reduce((s, c) => s + c.amount, 0);

  return (
    <div className="dots-pattern flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 gap-4">
      {/* ── Header + Income Selector ────────────────────── */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gradient-gold mb-1">
          Ghar Ka Budget 🏠
        </h2>
        <p className="text-sm text-[#a0a0b8] mb-3 font-medium">
          Apne kamre mein budget dekho — har cheez ka hisaab!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {budgetTemplates.map((t) => (
            <Button
              key={t.id}
              size="sm"
              variant={selectedTemplateId === t.id ? 'default' : 'outline'}
              className={
                selectedTemplateId === t.id
                  ? 'bg-amber-500 text-black font-bold hover:bg-amber-600'
                  : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors'
              }
              onClick={() => handleTemplateChange(t.id)}
            >
              Rs.{t.income.toLocaleString('en-IN')}/mo
            </Button>
          ))}
        </div>
      </div>

      {/* ── Main Content: Room + Summary ───────────────── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ── Room Visualization ───────────────────────── */}
        <div className="flex-1">
          <Card className="border-0 bg-[#12121a] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <CardContent className="p-4">
              {/* Room style label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{roomStyle.icon}</span>
                <span className="text-sm font-semibold text-white">{roomStyle.label}</span>
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30 ml-auto">
                  {formatCurrency(template.income)}/mahine
                </Badge>
              </div>

              {/* Room grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {Object.entries(roomAreaConfig).map(([area, config]) => {
                  const isExpanded = expandedArea === area;
                  const areaTotal = totalForArea(area);
                  const isZero = areaTotal === 0;

                  return (
                    <motion.div
                      key={area}
                      layout
                      onClick={() => setExpandedArea(isExpanded ? undefined : (area as RoomArea))}
                      className="cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div
                        className="room-glow relative rounded-xl p-3 border transition-all"
                        style={{
                          backgroundColor: isExpanded ? `${config.color}15` : '#1a1a2e',
                          borderColor: isExpanded ? `${config.color}50` : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{config.emoji}</span>
                          <span className="text-xs font-medium text-[#e8e8ed] truncate">
                            {config.label}
                          </span>
                        </div>

                        <motion.div
                          animate={{ opacity: isZero ? 0.3 : 1 }}
                          className="text-lg font-bold"
                          style={{ color: config.color }}
                        >
                          {formatCurrency(areaTotal)}
                        </motion.div>

                        {/* Piggy bank appears when entertainment/savings goes to 0 */}
                        {isZero && area === 'window' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1"
                          >
                            <PiggyBank size={14} className="text-amber-400" />
                          </motion.div>
                        )}

                        <ChevronRight
                          size={12}
                          className="absolute bottom-2 right-2 text-[#a0a0b8] transition-colors"
                          style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Expanded area sliders ────────────────── */}
              <AnimatePresence>
                {expandedArea && areaCategories[expandedArea] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="bg-[#1a1a2e] rounded-xl p-4 space-y-4 border border-white/5">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        {roomAreaConfig[expandedArea]?.emoji}{' '}
                        {roomAreaConfig[expandedArea]?.label} — Budget Adjust
                      </h4>
                      {areaCategories[expandedArea].map((cat) => (
                        <SliderControl
                          key={cat.name}
                          label={cat.name}
                          value={cat.amount}
                          min={0}
                          max={template.income}
                          step={100}
                          onChange={(val) => handleAmountChange(expandedArea as RoomArea, val)}
                          prefix="Rs."
                          color={roomAreaConfig[expandedArea]?.color || '#f59e0b'}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* ── Budget Summary ───────────────────────────── */}
        <div className="w-full lg:w-72">
          <Card className="corner-accent border-0 bg-[#12121a]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Home size={16} className="text-amber-400" /> Budget Summary
              </h4>

              {/* Total income */}
              <div className="bg-amber-500/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-amber-400/80">Monthly Income</div>
                <div className="text-xl font-bold text-amber-400">{formatCurrency(template.income)}</div>
              </div>

              {/* Breakdown rows */}
              {[
                { label: 'Needs (Zaroorat)', value: totals.needs, pct: percentages.needs, ideal: BUDGET_RULE.needs, color: '#3b82f6' },
                { label: 'Wants (Chaahat)', value: totals.wants, pct: percentages.wants, ideal: BUDGET_RULE.wants, color: '#f97316' },
                { label: 'Savings (Bachat)', value: totals.savings, pct: percentages.savings, ideal: BUDGET_RULE.savings, color: '#22c55e' },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a0a0b8] font-medium">{row.label}</span>
                    <span className="font-semibold" style={{ color: row.color }}>
                      {formatCurrency(row.value)} ({row.pct}%)
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[#1a1a2e]">
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      animate={{ width: `${Math.min(100, row.pct)}%` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                    {/* Ideal marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-white/40"
                      style={{ left: `${row.ideal}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#a0a0b8]/60 text-right font-medium">
                    Ideal: {row.ideal}%
                  </div>
                </div>
              ))}

              {/* Total allocated */}
              <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
                <span className="text-[#a0a0b8] font-medium">Total Allocated</span>
                <span className="font-bold text-white">
                  {formatCurrency(totals.total)} / {formatCurrency(template.income)}
                </span>
              </div>

              {/* Budget health indicator */}
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: `${budgetHealth.color}15`, border: `1px solid ${budgetHealth.color}30` }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {budgetHealth.level === 'excellent' && <CheckCircle2 size={14} style={{ color: budgetHealth.color }} />}
                  {budgetHealth.level === 'good' && <AlertTriangle size={14} style={{ color: budgetHealth.color }} />}
                  {budgetHealth.level === 'poor' && <XCircle size={14} style={{ color: budgetHealth.color }} />}
                  <span className="text-xs font-semibold" style={{ color: budgetHealth.color }}>
                    {budgetHealth.level === 'excellent' ? '🟢 Healthy' : budgetHealth.level === 'good' ? '🟡 Fair' : '🔴 Unhealthy'}
                  </span>
                </div>
                <p className="text-[10px] text-[#a0a0b8] font-medium">{budgetHealth.label}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
