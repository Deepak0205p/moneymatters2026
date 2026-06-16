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
import {
  Search,
  X,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Landmark,
  Receipt,
  Shield,
  AlertCircle,
  PiggyBank,
  GraduationCap,
} from 'lucide-react';
import type { TermCategory } from '@/lib/types';

// ─── Category config ───────────────────────────────────────
const categoryConfig: Record<TermCategory, { label: string; color: string; icon: typeof TrendingUp }> = {
  investing: { label: 'Investing', color: '#22c55e', icon: TrendingUp },
  banking: { label: 'Banking', color: '#3b82f6', icon: Landmark },
  tax: { label: 'Tax', color: '#f59e0b', icon: Receipt },
  insurance: { label: 'Insurance', color: '#8b5cf6', icon: Shield },
  debt: { label: 'Debt', color: '#ef4444', icon: AlertCircle },
  saving: { label: 'Saving', color: '#06b6d4', icon: PiggyBank },
};

const allCategories: TermCategory[] = ['investing', 'banking', 'tax', 'insurance', 'debt', 'saving'];

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<TermCategory | 'all'>('all');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const { masteredTerms, toggleTermMastered, setActiveModule } = useAppStore();

  // ─── Filter terms ────────────────────────────────────
  const filteredTerms = useMemo(() => {
    let terms = termsDictionary;

    if (activeCategory !== 'all') {
      terms = terms.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.example.toLowerCase().includes(q)
      );
    }

    return terms;
  }, [activeCategory, searchQuery]);

  // ─── Mastered count ──────────────────────────────────
  const masteredCount = masteredTerms.length;
  const totalTerms = termsDictionary.length;

  // ─── Expanded term data ──────────────────────────────
  const expandedData = expandedTerm
    ? termsDictionary.find((t) => t.id === expandedTerm)
    : null;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 gap-4">
      {/* ── Header ────────────────────────────────────── */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gradient-gold mb-1">
          Rupaiya Dictionary 📖
        </h2>
        <p className="text-sm text-[#a0a0b8] font-medium">
          Financial terms Hinglish mein samjho — {masteredCount}/{totalTerms} mastered!
        </p>
        {/* Mastery progress bar */}
        <div className="mt-2 mx-auto w-48 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] to-[#22c55e]"
            initial={{ width: 0 }}
            animate={{ width: `${(masteredCount / totalTerms) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Search + Progress ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8]" />
          <Input
            placeholder="Term ya definition search karo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#12121a] border-white/10 text-white placeholder:text-[#a0a0b8]/60 focus:border-amber-500/50 h-11 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b8] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 shrink-0">
          <GraduationCap size={12} className="mr-1" />
          {masteredCount}/{totalTerms}
        </Badge>
      </div>

      {/* ── Alphabetical Index Strip ──────────────────────── */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
          const hasTerms = termsDictionary.some(t => t.term.charAt(0).toUpperCase() === letter);
          return (
            <button
              key={letter}
              onClick={() => hasTerms ? setSearchQuery(letter) : undefined}
              className={`w-6 h-6 flex items-center justify-center rounded text-[9px] font-bold shrink-0 transition-all ${
                hasTerms
                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer'
                  : 'text-[#a0a0b8]/30 cursor-default'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* ── Category Filter Tabs ──────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          className={cn(
            'h-7 text-xs',
            activeCategory === 'all'
              ? 'bg-amber-500 text-black font-bold hover:bg-amber-600'
              : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors'
          )}
          onClick={() => setActiveCategory('all')}
        >
          All ({termsDictionary.length})
        </Button>
        {allCategories.map((cat) => {
          const config = categoryConfig[cat];
          const count = termsDictionary.filter((t) => t.category === cat).length;
          return (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={cn(
                'h-7 text-xs',
                activeCategory === cat
                  ? 'font-bold hover:opacity-90'
                  : 'bg-transparent border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors'
              )}
              style={
                activeCategory === cat
                  ? { backgroundColor: config.color, color: '#000' }
                  : undefined
              }
              onClick={() => setActiveCategory(cat)}
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      {/* ── Glow Line Separator ──────────────────────── */}
      <div className="glow-line w-full" />

      {/* ── Bubble Grid ───────────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {filteredTerms.map((term) => {
            const config = categoryConfig[term.category];
            const isMastered = masteredTerms.includes(term.id);
            const isExpanded = expandedTerm === term.id;

            return (
              <motion.button
                key={term.id}
                layout
                onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                className="relative cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  className={cn(
                    'rounded-xl px-3 py-2 border transition-all',
                    isMastered && 'ring-1'
                  )}
                  style={{
                    backgroundColor: isExpanded ? `${config.color}20` : `${config.color}10`,
                    borderColor: isExpanded ? `${config.color}50` : `${config.color}25`,
                    boxShadow: isMastered ? `0 0 8px ${config.color}30` : 'none',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {/* Mastered checkmark */}
                    {isMastered && (
                      <CheckCircle2 size={12} style={{ color: config.color }} />
                    )}

                    {/* Pulse for unexplored */}
                    {!isMastered && (
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}

                    <span className="text-xs font-semibold text-[#e8e8ed] whitespace-nowrap">
                      {term.term}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filteredTerms.length === 0 && (
          <div className="text-center py-8 text-[#a0a0b8] font-medium">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Koi term nahi mila — search change karo!</p>
          </div>
        )}
      </div>

      {/* ── Expanded Term Card ────────────────────────── */}
      <AnimatePresence>
        {expandedData && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Card
              className="term-card border-0"
              style={{
                backgroundColor: '#12121a',
                border: `1px solid ${categoryConfig[expandedData.category].color}30`,
              }}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge
                      variant="outline"
                      className="text-[10px] mb-1"
                      style={{
                        color: categoryConfig[expandedData.category].color,
                        borderColor: `${categoryConfig[expandedData.category].color}40`,
                      }}
                    >
                      {categoryConfig[expandedData.category].label}
                    </Badge>
                    <h3 className="text-lg font-bold text-white">{expandedData.term}</h3>
                  </div>
                  <button
                    onClick={() => setExpandedTerm(null)}
                    className="text-[#a0a0b8] hover:text-white p-1 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Definition */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-amber-400 mb-1">Definition</h4>
                  <p className="text-sm text-[#e8e8ed] leading-relaxed">{expandedData.definition}</p>
                </div>

                {/* Example */}
                <div className="mb-4 bg-[#1a1a2e] rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-emerald-400 mb-1">Indian Example 🇮🇳</h4>
                  <p className="text-sm text-[#e8e8ed] leading-relaxed">{expandedData.example}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleTermMastered(expandedData.id)}
                    className={cn(
                      'flex-1 font-semibold',
                      masteredTerms.includes(expandedData.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-black'
                    )}
                  >
                    <CheckCircle2 size={14} className="mr-1" />
                    {masteredTerms.includes(expandedData.id) ? 'Mastered ✓' : 'Mark as Mastered'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/10 text-[#a0a0b8] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors"
                    onClick={() => {
                      setActiveModule(expandedData.relatedModule);
                      setExpandedTerm(null);
                    }}
                  >
                    <BookOpen size={14} className="mr-1" />
                    Module {expandedData.relatedModule}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
