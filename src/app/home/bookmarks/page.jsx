'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  BookmarkX,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  Calendar,
  BookOpen,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Tag,
  ChevronDown,
  Grid3X3,
  List,
  Trash2,
  Eye,
} from 'lucide-react';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import { RichContent, InteractiveQuizViewer, InteractiveCalculatorViewer, InteractiveChoiceViewer } from '@/components/shared/CardContent';

/* ─────────────────────────────────────────
   BUILD FULL CARD INDEX (all modules × all cards)
───────────────────────────────────────── */
const FULL_CARD_INDEX = (() => {
  const map = {};
  for (const mod of modules) {
    const cards = getAllCardsForModule(mod.id);
    for (const card of cards) {
      map[card.id] = { card, module: mod };
    }
  }
  return map;
})();

/* ─────────────────────────────────────────
   localStorage helpers with timestamp tracking
───────────────────────────────────────── */
const STORAGE_KEY = 'bookmarked_cards';
const META_KEY = 'bookmarked_cards_meta'; // { [cardId]: { savedAt: ISO, order: number } }

function getRawBookmarks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function getMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch { return {}; }
}
function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

/** Enrich bookmark IDs with metadata + card info */
function buildBookmarkItems(ids) {
  const meta = getMeta();
  const now = Date.now();
  // backfill meta for any cards that don't have it yet
  let changed = false;
  const filled = { ...meta };
  ids.forEach((id, idx) => {
    if (!filled[id]) { filled[id] = { savedAt: new Date(now - idx * 1000).toISOString(), order: idx }; changed = true; }
  });
  if (changed) saveMeta(filled);

  return ids
    .map((id) => {
      const entry = FULL_CARD_INDEX[id];
      if (!entry) return null;
      return {
        id,
        card: entry.card,
        module: entry.module,
        savedAt: filled[id]?.savedAt || new Date().toISOString(),
        order: filled[id]?.order ?? 0,
      };
    })
    .filter(Boolean);
}

function removeBookmark(id) {
  const ids = getRawBookmarks().filter((b) => b !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  const meta = getMeta();
  delete meta[id];
  saveMeta(meta);
}

/* ─────────────────────────────────────────
   FULL-SCREEN CARD VIEWER MODAL
───────────────────────────────────────── */
function CardDetailModal({ items, startId, onClose }) {
  const startIdx = items.findIndex((i) => i.id === startId);
  const [idx, setIdx] = useState(startIdx < 0 ? 0 : startIdx);
  const item = items[idx];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setIdx((p) => Math.min(p + 1, items.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setIdx((p) => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items.length, onClose]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(4,6,12,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[88vh] overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0D1827 0%, #070D18 100%)' }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full shrink-0" style={{ background: item.module.color }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl">{item.module.emoji}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest truncate" style={{ color: item.module.color }}>
                {item.module.title}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Saved {new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-all shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Card content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {/* Title */}
              <h2 className="font-display text-xl font-extrabold text-white leading-tight">{item.card.title}</h2>

              {/* Topic */}
              {item.card.topicTitle && (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border" style={{ borderColor: `${item.module.color}30`, color: item.module.color, background: `${item.module.color}12` }}>
                  <Tag className="size-3" />
                  {item.card.topicTitle}
                </div>
              )}

              {/* Content */}
              <div className="w-full">
                {item.card.type === 'quiz' ? (
                  <InteractiveQuizViewer data={item.card.content} color={item.module.color} />
                ) : item.card.type === 'calculator' ? (
                  <InteractiveCalculatorViewer data={item.card.content} color={item.module.color} />
                ) : item.card.type === 'choice' ? (
                  <InteractiveChoiceViewer data={item.card.content} color={item.module.color} />
                ) : item.card.content && typeof item.card.content === 'string' ? (
                  <RichContent content={item.card.content} color={item.module.color} />
                ) : null}
              </div>

              {/* Bullets / key points */}
              {item.card.bullets && item.card.bullets.length > 0 && (
                <div className="space-y-2">
                  {item.card.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="size-1.5 rounded-full mt-2.5 shrink-0" style={{ background: item.module.color }} />
                      {b}
                    </div>
                  ))}
                </div>
              )}

              {/* Example */}
              {item.card.example && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Example</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.card.example}</p>
                </div>
              )}

              {/* Tip */}
              {item.card.tip && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">💡 Pro Tip</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.card.tip}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation footer */}
        <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between shrink-0 bg-black/20">
          <button
            disabled={idx === 0}
            onClick={() => setIdx((p) => p - 1)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-[11px] text-zinc-600">{idx + 1} / {items.length}</span>
          <button
            disabled={idx === items.length - 1}
            onClick={() => setIdx((p) => p + 1)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/[0.07] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   BOOKMARK CARD (grid tile)
───────────────────────────────────────── */
function BookmarkCard({ item, onOpen, onRemove, view }) {
  const dateStr = new Date(item.savedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  if (view === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10, scale: 0.96 }}
        whileHover={{ x: 3 }}
        className="group flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl px-4 py-3.5 transition-all cursor-pointer"
        onClick={() => onOpen(item.id)}
      >
        {/* Module color stripe */}
        <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: item.module.color }} />

        <span className="text-xl shrink-0">{item.module.emoji}</span>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest truncate mb-0.5" style={{ color: item.module.color }}>
            {item.module.title}
          </p>
          <p className="text-sm font-semibold text-white truncate">{item.card.title}</p>
          {item.card.topicTitle && (
            <p className="text-[11px] text-zinc-600 truncate mt-0.5">{item.card.topicTitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-zinc-600 flex items-center gap-1">
            <Calendar className="size-2.5" />{dateStr}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(item.id); }}
              className="p-1.5 rounded-lg bg-white/[0.05] text-zinc-400 hover:text-white transition-all"
            >
              <Eye className="size-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <BookmarkX className="size-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-[#0C1420] hover:bg-[#0F1A2E] border border-white/[0.07] hover:border-white/[0.13] rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all overflow-hidden"
      onClick={() => onOpen(item.id)}
    >
      {/* Top color accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: item.module.color }} />
      {/* Glow */}
      <div className="absolute -top-8 -right-8 size-20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" style={{ background: item.module.color }} />

      {/* Module badge */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{item.module.emoji}</span>
        <span
          className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border"
          style={{ color: item.module.color, borderColor: `${item.module.color}30`, background: `${item.module.color}12` }}
        >
          {item.module.title}
        </span>
      </div>

      {/* Card title */}
      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{item.card.title}</h3>

      {/* Topic */}
      {item.card.topicTitle && (
        <p className="text-[11px] text-zinc-500 flex items-center gap-1 truncate">
          <Tag className="size-2.5 shrink-0" /> {item.card.topicTitle}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] mt-auto">
        <span className="text-[10px] text-zinc-600 flex items-center gap-1">
          <Calendar className="size-2.5" />{dateStr}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onOpen(item.id); }}
            className="p-1.5 rounded-lg bg-white/[0.05] text-zinc-400 hover:text-white transition-all"
          >
            <Eye className="size-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <BookmarkX className="size-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN BOOKMARKS PAGE
═══════════════════════════════════════════ */
export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Filters & sort
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc | date_asc | module | title
  const [filterModule, setFilterModule] = useState('all');
  const [view, setView] = useState('grid'); // grid | list
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modal
  const [openCardId, setOpenCardId] = useState(null);

  /* load from localStorage */
  const reload = useCallback(() => {
    const ids = getRawBookmarks();
    setItems(buildBookmarkItems(ids));
    setLoaded(true);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  /* remove a bookmark */
  const handleRemove = useCallback((id) => {
    removeBookmark(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /* clear all */
  const handleClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(META_KEY);
    setItems([]);
  };

  /* derived: unique modules in saved items */
  const presentModuleIds = useMemo(() => [...new Set(items.map((i) => i.module.id))], [items]);

  /* filtered + sorted items */
  const displayed = useMemo(() => {
    let result = [...items];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.card.title?.toLowerCase().includes(q) ||
          i.card.topicTitle?.toLowerCase().includes(q) ||
          i.module.title?.toLowerCase().includes(q) ||
          i.card.content?.toLowerCase().includes(q),
      );
    }

    // filter by module
    if (filterModule !== 'all') {
      result = result.filter((i) => String(i.module.id) === filterModule);
    }

    // sort
    switch (sortBy) {
      case 'date_asc':  result.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt)); break;
      case 'date_desc': result.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)); break;
      case 'module':    result.sort((a, b) => a.module.title.localeCompare(b.module.title)); break;
      case 'title':     result.sort((a, b) => a.card.title.localeCompare(b.card.title)); break;
    }

    return result;
  }, [items, search, sortBy, filterModule]);

  /* loading */
  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/25 flex items-center justify-center">
              <Bookmark className="size-4 text-amber-400" fill="#F59E0B" />
            </div>
            <h1 className="font-display text-xl font-extrabold text-white tracking-tight">My Bookmarks</h1>
          </div>
          <p className="text-xs text-zinc-500 ml-12">
            {items.length === 0 ? 'No saved cards yet' : `${items.length} card${items.length !== 1 ? 's' : ''} saved across ${presentModuleIds.length} module${presentModuleIds.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {items.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-all"
          >
            <Trash2 className="size-3.5" />
            Clear All
          </motion.button>
        )}
      </div>

      {items.length === 0 ? (
        /* ── EMPTY STATE ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/[0.05] rounded-3xl"
        >
          <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <Bookmark className="size-7 text-amber-400" />
          </div>
          <h2 className="font-display text-lg font-bold text-white mb-2">No bookmarks yet</h2>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            While reading any module, tap the <Bookmark className="inline size-3.5 text-amber-400" fill="#F59E0B" /> bookmark icon on any card to save it here for quick revision.
          </p>
        </motion.div>
      ) : (
        <>
          {/* ── CONTROLS BAR ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500/40 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Module filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((p) => !p)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-zinc-300 hover:bg-white/[0.06] transition-all"
              >
                <Filter className="size-3.5 text-zinc-400" />
                {filterModule === 'all' ? 'All Modules' : modules.find((m) => String(m.id) === filterModule)?.title.split(' ')[0]}
                <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 z-50 bg-[#0C1420] border border-white/[0.08] rounded-2xl shadow-2xl p-2 space-y-0.5"
                  >
                    {[{ id: 'all', title: 'All Modules', emoji: '📚' }, ...modules.filter((m) => presentModuleIds.includes(m.id))].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setFilterModule(String(m.id)); setShowFilterMenu(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${
                          filterModule === String(m.id)
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span className="truncate font-medium">{m.title}</span>
                        {m.id !== 'all' && (
                          <span className="ml-auto text-[10px] text-zinc-600">
                            {items.filter((i) => i.module.id === m.id).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/40 transition-all cursor-pointer"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="module">By module</option>
              <option value="title">A → Z</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center gap-0 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Grid3X3 className="size-3.5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-emerald-500/15 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>

          {/* ── RESULTS COUNT ── */}
          {(search || filterModule !== 'all') && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                Showing <span className="text-white font-semibold">{displayed.length}</span> of {items.length} bookmarks
              </p>
              <button
                onClick={() => { setSearch(''); setFilterModule('all'); }}
                className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <X className="size-3" /> Clear filters
              </button>
            </div>
          )}

          {/* ── MODULE GROUPS (when not filtered) ── */}
          {filterModule === 'all' && !search && sortBy === 'module' ? (
            <div className="space-y-6">
              {presentModuleIds.map((modId) => {
                const mod = modules.find((m) => m.id === modId);
                const modItems = displayed.filter((i) => i.module.id === modId);
                if (!modItems.length) return null;
                return (
                  <div key={modId} className="space-y-3">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.04]">
                      <span className="text-lg">{mod.emoji}</span>
                      <span className="text-sm font-bold text-white">{mod.title}</span>
                      <span className="text-xs text-zinc-600 ml-1">({modItems.length})</span>
                      <div className="flex-1 h-px ml-2" style={{ background: `${mod.color}20` }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <AnimatePresence mode="popLayout">
                        {modItems.map((item) => (
                          <BookmarkCard key={item.id} item={item} view="grid" onOpen={setOpenCardId} onRemove={handleRemove} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center bg-white/[0.02] border border-white/[0.05] rounded-3xl">
              <Search className="size-8 text-zinc-700 mb-3" />
              <p className="text-sm font-semibold text-zinc-400">No results found</p>
              <p className="text-xs text-zinc-600 mt-1">Try different keywords or clear your filters</p>
            </div>
          ) : (
            /* ── FLAT GRID / LIST ── */
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'flex flex-col gap-2'}>
              <AnimatePresence mode="popLayout">
                {displayed.map((item) => (
                  <BookmarkCard key={item.id} item={item} view={view} onOpen={setOpenCardId} onRemove={handleRemove} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ── STATS FOOTER ── */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-white/[0.04]">
            {[
              { icon: Bookmark, label: 'Total Saved', value: items.length, color: 'text-amber-400' },
              { icon: Layers, label: 'Modules', value: presentModuleIds.length, color: 'text-emerald-400' },
              { icon: Clock, label: 'Last Saved', value: items.length > 0 ? new Date(Math.max(...items.map((i) => new Date(i.savedAt)))).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-', color: 'text-violet-400' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-xl px-3.5 py-2">
                <stat.icon className={`size-3.5 ${stat.color}`} />
                <span className="text-xs text-zinc-500">{stat.label}:</span>
                <span className={`text-xs font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── CARD DETAIL MODAL ── */}
      <AnimatePresence>
        {openCardId && (
          <CardDetailModal
            items={displayed.length > 0 ? displayed : items}
            startId={openCardId}
            onClose={() => setOpenCardId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
