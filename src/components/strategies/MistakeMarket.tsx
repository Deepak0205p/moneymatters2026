'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { mistakeCategories } from '@/lib/data/mistakes-data';
import { useAppStore } from '@/lib/store/useAppStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DynamicIcon from '@/components/shared/DynamicIcon';
import {
  Store,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  TrendingDown,
  ShoppingCart,
} from 'lucide-react';
import type { MistakeCategory, Mistake } from '@/lib/types';

// ─── Animated cost counter ─────────────────────────────────
function AnimatedCost({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(0, { stiffness: 80, damping: 25 });
  const display = useTransform(spring, (latest) => {
    return `Rs.${Math.round(latest).toLocaleString('en-IN')}+`;
  });

  // Trigger animation when value changes
  useMemo(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ─── Extract numeric cost from costCalculation string ──────
function extractCost(costCalc: string): number {
  const matches = costCalc.match(/[\d,]+/g);
  if (!matches) return 0;
  // Find the largest number that looks like a total cost
  const nums = matches.map((m) => parseInt(m.replace(/,/g, ''), 10)).filter((n) => !isNaN(n));
  return nums.length > 0 ? Math.max(...nums) : 0;
}

export default function MistakeMarket() {
  const [expandedStall, setExpandedStall] = useState<string | null>(null);
  const [expandedMistake, setExpandedMistake] = useState<string | null>(null);

  const { setActiveModule } = useAppStore();

  // ─── Total cost counter ──────────────────────────────
  const totalCost = useMemo(() => {
    return mistakeCategories.reduce((sum, cat) => {
      return sum + cat.mistakes.reduce((s, m) => s + extractCost(m.costCalculation), 0);
    }, 0);
  }, []);

  // ─── Category total ──────────────────────────────────
  const getCategoryTotal = (cat: MistakeCategory) =>
    cat.mistakes.reduce((s, m) => s + extractCost(m.costCalculation), 0);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 gap-4">
      {/* ── Header + Total Cost Counter ───────────────── */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gradient-gold mb-1">
          Mistake Market 🏪
        </h2>
        <p className="text-sm text-[#a0a0b8] mb-3 font-medium">
          Galtiyon ka bazaar — dekho kitna paisa doobta hai!
        </p>

        {/* Total cost counter */}
        <motion.div
          className="sticky top-14 z-10 inline-flex items-center gap-2 bg-[#12121a]/95 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 sm:px-5 py-2.5"
          animate={{ boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.2)', '0 0 0px rgba(239,68,68,0)'] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Flame size={18} className="text-red-400" />
          <span className="text-xs text-red-400/80">Total Cost of Mistakes:</span>
          <AnimatedCost value={totalCost} className="text-xl font-black text-red-400" />
        </motion.div>
      </div>

      {/* ── Stall Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mistakeCategories.map((category) => {
          const isExpanded = expandedStall === category.id;
          const catTotal = getCategoryTotal(category);

          return (
            <motion.div
              key={category.id}
              layout
              className={isExpanded ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
              <motion.div
                whileHover={{ scale: isExpanded ? 1 : 1.03 }}
                whileTap={{ scale: isExpanded ? 1 : 0.97 }}
                className="cursor-pointer"
                onClick={() => setExpandedStall(isExpanded ? null : category.id)}
              >
                <Card
                  className="mistake-shop-card border-0 overflow-hidden"
                  style={{
                    backgroundColor: '#12121a',
                    border: `1px solid ${isExpanded ? `${category.color}40` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <CardContent className="p-4">
                    {/* Stall header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${category.color}18` }}
                      >
                        <DynamicIcon name={category.icon} size={22} style={{ color: category.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white truncate">{category.title}</h3>
                          <Badge
                            variant="outline"
                            className="text-[9px] shrink-0"
                            style={{ color: category.color, borderColor: `${category.color}40` }}
                          >
                            {category.mistakes.length} mistakes
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <TrendingDown size={12} className="text-red-400" />
                          <span className="text-xs font-bold text-red-400">
                            <span className="price-tag-crossed">Rs.{(catTotal * 1.5).toLocaleString('en-IN')}</span>{' '}
                            Rs.{catTotal.toLocaleString('en-IN')}+ real cost!
                          </span>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp size={16} className="text-[#a0a0b8] shrink-0 transition-colors" />
                      ) : (
                        <ChevronDown size={16} className="text-[#a0a0b8] shrink-0 transition-colors" />
                      )}
                    </div>

                    {/* Stall glow bar */}
                    <div
                      className="h-0.5 w-full mt-3 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${category.color}, ${category.color}00)` }}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* ── Expanded mistakes list ────────────────── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mt-2 corner-accent">
                      {category.mistakes.map((mistake) => {
                        const isMistakeExpanded = expandedMistake === mistake.id;
                        return (
                          <motion.div
                            key={mistake.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          >
                            <Card
                              className="card-depth-2 border-0 cursor-pointer"
                              style={{
                                backgroundColor: '#1a1a2e',
                                border: `1px solid ${isMistakeExpanded ? `${category.color}30` : 'rgba(255,255,255,0.04)'}`,
                              }}
                              onClick={() => setExpandedMistake(isMistakeExpanded ? null : mistake.id)}
                            >
                              <CardContent className="p-3">
                                {/* Mistake header */}
                                <div className="flex items-start gap-2">
                                  <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-white">{mistake.title}</h4>
                                    <p className="text-[10px] text-red-400 font-bold mt-0.5">
                                      {mistake.costCalculation.substring(0, 60)}...
                                    </p>
                                  </div>
                                  {isMistakeExpanded ? (
                                    <ChevronUp size={12} className="text-[#a0a0b8] shrink-0 transition-colors" />
                                  ) : (
                                    <ChevronDown size={12} className="text-[#a0a0b8] shrink-0 transition-colors" />
                                  )}
                                </div>

                                {/* Expanded content */}
                                <AnimatePresence>
                                  {isMistakeExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-3 space-y-2 pl-6">
                                        {/* Cost calculation */}
                                        <div className="bg-red-950/30 rounded-lg p-2.5">
                                          <p className="text-[10px] font-semibold text-red-400 mb-0.5">
                                            💸 Cost Calculation
                                          </p>
                                          <p className="text-xs text-[#e8e8ed] leading-relaxed">
                                            {mistake.costCalculation}
                                          </p>
                                        </div>

                                        {/* Explanation */}
                                        <div>
                                          <p className="text-[10px] font-semibold text-amber-400 mb-0.5">
                                            🧠 Samjho Kyun
                                          </p>
                                          <p className="text-xs text-[#a0a0b8] leading-relaxed font-medium">
                                            {mistake.explanation}
                                          </p>
                                        </div>

                                        {/* Solution */}
                                        <div className="bg-emerald-950/20 rounded-lg p-2.5">
                                          <p className="text-[10px] font-semibold text-emerald-400 mb-0.5">
                                            ✅ Solution
                                          </p>
                                          <p className="text-xs text-[#e8e8ed] leading-relaxed">
                                            {mistake.solution}
                                          </p>
                                        </div>

                                        {/* Link to module */}
                                        <Button
                                          size="sm"
                                          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs h-7 mt-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveModule(mistake.relatedModule);
                                          }}
                                        >
                                          <ExternalLink size={10} className="mr-1" />
                                          Module {mistake.relatedModule} mein padho
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
