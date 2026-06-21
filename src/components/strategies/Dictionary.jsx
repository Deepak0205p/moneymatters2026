'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { termsDictionary } from '@/lib/data/terms-dictionary';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Search, X, CheckCircle2, BookOpen, TrendingUp, Landmark,
  Receipt, Shield, AlertCircle, PiggyBank, GraduationCap,
  Star, Zap, Lightbulb, DollarSign
} from 'lucide-react';

// ─── Category config ────────────────────────────────────────────────────────
const categoryConfig = {
  basics: {
    label: 'Basics',
    color: '#06b6d4',
    icon: Lightbulb,
    emoji: '📚',
  },
  important: {
    label: 'Important',
    color: '#f59e0b',
    icon: Star,
    emoji: '⭐',
  },
  investing: {
    label: 'Investing',
    color: '#22c55e',
    icon: TrendingUp,
    emoji: '📈',
  },
  banking: {
    label: 'Banking',
    color: '#3b82f6',
    icon: Landmark,
    emoji: '🏦',
  },
  tax: {
    label: 'Tax',
    color: '#f59e0b',
    icon: Receipt,
    emoji: '🧾',
  },
  insurance: {
    label: 'Insurance',
    color: '#8b5cf6',
    icon: Shield,
    emoji: '🛡️',
  },
  debt: {
    label: 'Debt',
    color: '#ef4444',
    icon: AlertCircle,
    emoji: '⚠️',
  },
  saving: {
    label: 'Saving',
    color: '#10b981',
    icon: PiggyBank,
    emoji: '🐷',
  },
};

const allCategories = ['basics', 'important', 'investing', 'banking', 'tax', 'insurance', 'debt', 'saving'];

// ─── Term Popup Modal ────────────────────────────────────────────────────────
function TermModal({ term, onClose, onToggleMastered, isMastered }) {
  const config = categoryConfig[term.category];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal card */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden border"
          style={{
            backgroundColor: '#0d0f1f',
            borderColor: `${config.color}30`,
            boxShadow: `0 0 80px ${config.color}15, 0 25px 60px rgba(0,0,0,0.7)`,
          }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow top */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ backgroundColor: config.color }}
          />

          {/* Header */}
          <div
            className="relative px-6 pt-6 pb-4"
            style={{ background: `linear-gradient(135deg, ${config.color}12 0%, transparent 100%)` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${config.color}18`, border: `1px solid ${config.color}35` }}
                >
                  <Icon size={20} style={{ color: config.color }} />
                </div>
                <div>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: config.color, backgroundColor: `${config.color}15`, border: `1px solid ${config.color}25` }}
                  >
                    {config.emoji} {config.label}
                  </span>
                  <h3 className="text-base font-black text-white mt-1 leading-tight">{term.term}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 space-y-4">
            {/* Definition */}
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: `${config.color}08`, border: `1px solid ${config.color}18` }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: config.color }}>
                📖 Definition
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed">{term.definition}</p>
            </div>

            {/* Example */}
            <div className="rounded-2xl p-4 bg-[#0a1220] border border-emerald-500/15">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                🇮🇳 Indian Example
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">{term.example}</p>
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 pt-1">
              <motion.button
                onClick={() => onToggleMastered(term.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                style={
                  isMastered
                    ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#0a0c1a' }
                    : { backgroundColor: `${config.color}18`, color: config.color, border: `1px solid ${config.color}30` }
                }
              >
                <CheckCircle2 size={13} />
                {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-zinc-400 border border-white/[0.07] hover:text-white hover:bg-white/5 transition-all"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dictionary Component ────────────────────────────────────────────────
export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const { masteredTerms, toggleTermMastered } = useAppStore();

  // Filter terms
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

  const masteredCount = masteredTerms.length;
  const totalTerms = termsDictionary.length;
  const selectedTermData = selectedTerm ? termsDictionary.find((t) => t.id === selectedTerm) : null;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 gap-5">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Rupaiya Dictionary <span className="text-amber-400">📖</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Financial terms Hinglish mein samjho — {masteredCount}/{totalTerms} mastered!
        </p>
        {/* Progress bar */}
        <div className="mx-auto w-52 h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #22c55e)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(masteredCount / totalTerms) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Term ya definition search karo…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 shrink-0">
          <GraduationCap size={13} className="text-amber-400" />
          <span className="text-xs font-black text-amber-400">{masteredCount}/{totalTerms}</span>
        </div>
      </div>

      {/* ── A-Z Letter Filter ── */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((letter) => {
          const isAll = letter === 'ALL';
          const hasTerms = isAll || termsDictionary.some((t) => t.term.charAt(0).toUpperCase() === letter);
          const isActive = isAll ? searchQuery === '' && activeCategory === 'all' : false;
          return (
            <button
              key={letter}
              onClick={() => {
                if (isAll) {
                  setSearchQuery('');
                  setActiveCategory('all');
                } else if (hasTerms) {
                  setSearchQuery(letter);
                  setActiveCategory('all');
                }
              }}
              className={`min-w-[22px] h-6 flex items-center justify-center rounded text-[8px] font-black shrink-0 transition-all ${
                hasTerms
                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer'
                  : 'text-zinc-700 cursor-default'
              } ${isAll ? 'px-2 text-[7px]' : ''}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {/* All */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
            activeCategory === 'all'
              ? 'bg-white/10 text-white border-white/20'
              : 'bg-transparent border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
          }`}
        >
          All ({termsDictionary.length})
        </button>

        {allCategories.map((cat) => {
          const cfg = categoryConfig[cat];
          const count = termsDictionary.filter((t) => t.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border"
              style={
                isActive
                  ? { backgroundColor: `${cfg.color}25`, color: cfg.color, borderColor: `${cfg.color}50` }
                  : { backgroundColor: 'transparent', color: '#52525b', borderColor: 'rgba(255,255,255,0.06)' }
              }
            >
              {cfg.emoji} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-white/[0.05]" />

      {/* ── Terms Chip Cloud ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {filteredTerms.map((term, i) => {
            const config = categoryConfig[term.category];
            const isMastered = masteredTerms.includes(term.id);

            return (
              <motion.button
                key={term.id}
                layout
                onClick={() => setSelectedTerm(term.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.01 }}
                className="relative rounded-xl px-3 py-2 border transition-all cursor-pointer"
                style={{
                  backgroundColor: isMastered ? `${config.color}18` : `${config.color}0d`,
                  borderColor: isMastered ? `${config.color}50` : `${config.color}25`,
                  boxShadow: isMastered ? `0 0 10px ${config.color}25` : 'none',
                }}
              >
                <div className="flex items-center gap-1.5">
                  {isMastered ? (
                    <CheckCircle2 size={11} style={{ color: config.color }} />
                  ) : (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                    />
                  )}
                  <span className="text-xs font-semibold text-zinc-200 whitespace-nowrap">{term.term}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12 w-full text-zinc-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Koi term nahi mila — search change karo!</p>
          </div>
        )}
      </div>

      {/* ── Stats Footer ── */}
      <div className="mt-2 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Terms', value: totalTerms, color: '#3b82f6' },
          { label: 'Mastered', value: masteredCount, color: '#22c55e' },
          { label: 'Remaining', value: totalTerms - masteredCount, color: '#f59e0b' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3 text-center border border-white/[0.06] bg-white/[0.02]"
          >
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Term Popup Modal ── */}
      {selectedTermData && (
        <TermModal
          term={selectedTermData}
          onClose={() => setSelectedTerm(null)}
          onToggleMastered={(id) => toggleTermMastered(id)}
          isMastered={masteredTerms.includes(selectedTermData.id)}
        />
      )}
    </div>
  );
}