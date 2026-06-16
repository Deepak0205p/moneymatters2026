'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Share2, ExternalLink, Newspaper, AlertCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface FinancialNewsWidgetProps {
  open: boolean;
  onClose: () => void;
}

interface TipItem {
  tip: string;
  category: string;
  emoji: string;
}

interface NewsItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
}

interface ApiResponse {
  news: NewsItem[];
  tips: TipItem[];
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */
const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  savings: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', label: 'Bachat' },
  investment: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', label: 'Investment' },
  budget: { color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30', label: 'Budget' },
  debt: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', label: 'Debt' },
  tax: { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30', label: 'Tax' },
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  savings: 'border-l-emerald-400',
  investment: 'border-l-amber-400',
  budget: 'border-l-sky-400',
  debt: 'border-l-red-400',
  tax: 'border-l-purple-400',
};

/* ------------------------------------------------------------------ */
/*  Skeleton component                                                 */
/* ------------------------------------------------------------------ */
function TipSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 border-l-4 border-l-white/10">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 rounded bg-white/[0.06]" />
          <div className="h-4 w-full rounded bg-white/[0.06]" />
          <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-white/[0.06] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger animation variants                                         */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function FinancialNewsWidget({ open, onClose }: FinancialNewsWidgetProps) {
  const [tips, setTips] = useState<TipItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && lastUpdated && Date.now() - lastUpdated < CACHE_DURATION && tips.length > 0) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/financial-news');
      if (!res.ok) throw new Error('Failed to fetch');

      const data: ApiResponse = await res.json();
      setTips(data.tips || []);
      setNews(data.news || []);
      setLastUpdated(data.timestamp || Date.now());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastUpdated, tips.length, CACHE_DURATION]);

  // Fetch on open
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  // Prevent body scroll when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const handleShare = async (tipText: string) => {
    const shareText = `${tipText}\n\n— RUPAIYA 101 🪙 Financial Literacy App`;
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied! 📋',
        description: 'Tip clipboard mein copy ho gaya!',
      });
    } catch {
      toast({
        title: 'Copy nahi hua',
        description: 'Clipboard access nahi mil paya',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Abhi abhi';
    if (mins < 60) return `${mins} min pehle`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ghante pehle`;
    return `${Math.floor(hrs / 24)} din pehle`;
  };

  const getFaviconUrl = (host: string) => {
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-x-3 top-[4vh] bottom-[4vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">📰 Financial Insights</h2>
                    <p className="text-[11px] text-[#8888a0] leading-tight">
                      Hinglish tips aur latest financial news
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Last updated indicator */}
                  {lastUpdated && !loading && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#6666a0]">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(lastUpdated)}</span>
                    </div>
                  )}
                  {/* Refresh button */}
                  <button
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors disabled:opacity-50"
                    aria-label="Refresh news"
                  >
                    <RefreshCw className={`w-4 h-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
                  </button>
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 strategy-scroll">
              {/* Error State */}
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-red-400/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-7 h-7 text-red-400" />
                  </div>
                  <p className="text-sm text-[#a0a0b8] mb-1">Arre yaar, news load nahi ho paya!</p>
                  <p className="text-xs text-[#6666a0] mb-4">Internet check karo aur phir try karo</p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
                  >
                    Dobara try karo
                  </button>
                </motion.div>
              )}

              {/* Loading State - Skeletons */}
              {loading && !error && (
                <div className="space-y-6">
                  <div>
                    <div className="h-4 w-28 rounded bg-white/[0.06] mb-3 animate-pulse" />
                    <div className="space-y-2.5">
                      <TipSkeleton />
                      <TipSkeleton />
                      <TipSkeleton />
                      <TipSkeleton />
                      <TipSkeleton />
                    </div>
                  </div>
                  <div>
                    <div className="h-4 w-24 rounded bg-white/[0.06] mb-3 animate-pulse" />
                    <div className="space-y-2.5">
                      <NewsSkeleton />
                      <NewsSkeleton />
                      <NewsSkeleton />
                    </div>
                  </div>
                </div>
              )}

              {/* Loaded State - Tips + News */}
              {!loading && !error && tips.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* ── Tips Section ── */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#a0a0b8] mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-amber-400/10 flex items-center justify-center text-[10px]">💡</span>
                      Smart Tips — Hinglish Mein
                    </h3>
                    <div className="space-y-2.5">
                      {tips.map((tip, idx) => {
                        const cfg = CATEGORY_CONFIG[tip.category] || CATEGORY_CONFIG.savings;
                        const borderClass = CATEGORY_BORDER_COLORS[tip.category] || 'border-l-white/10';

                        return (
                          <motion.div
                            key={`tip-${idx}`}
                            variants={itemVariants}
                            className={`group rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] border-l-4 ${borderClass} p-4 hover:bg-white/[0.05] transition-colors`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Emoji */}
                              <span className="text-xl leading-none shrink-0 mt-0.5">{tip.emoji}</span>
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Category badge */}
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color} ${cfg.bg} border ${cfg.border} mb-1.5`}>
                                  {cfg.label}
                                </span>
                                {/* Tip text */}
                                <p className="text-sm text-[#e8e8ed] leading-relaxed">{tip.tip}</p>
                              </div>
                              {/* Share button */}
                              <button
                                onClick={() => handleShare(tip.tip)}
                                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#6666a0] hover:text-amber-400 hover:bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                aria-label="Share tip"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── News Section ── */}
                  {news.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-[#a0a0b8] mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-400/10 flex items-center justify-center text-[10px]">🌐</span>
                        Latest Financial News
                      </h3>
                      <div className="space-y-2">
                        {news.map((item, idx) => (
                          <motion.a
                            key={`news-${idx}`}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group block rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-3 hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              {/* Source favicon */}
                              <div className="w-6 h-6 rounded shrink-0 overflow-hidden bg-white/[0.06] flex items-center justify-center mt-0.5">
                                {item.host_name ? (
                                  <img
                                    src={getFaviconUrl(item.host_name)}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="w-4 h-4"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <ExternalLink className="w-3 h-3 text-[#6666a0]" />
                                )}
                              </div>
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#e8e8ed] font-medium leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                                  {item.name}
                                </p>
                                {item.snippet && (
                                  <p className="text-[11px] text-[#6666a0] mt-1 line-clamp-1">
                                    {item.snippet}
                                  </p>
                                )}
                              </div>
                              {/* External link icon */}
                              <ExternalLink className="w-3.5 h-3.5 text-[#5555a0] group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No news state (only tips) */}
                  {news.length === 0 && tips.length > 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-[#6666a0]">
                        News abhi available nahi hai — tips enjoy karo! 🎯
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Empty state (no data at all after load) */}
              {!loading && !error && tips.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-[#a0a0b8]">Koi data nahi mila</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-3 px-4 py-2 rounded-xl text-sm font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
                  >
                    Dobara try karo
                  </button>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-5 py-2.5 border-t border-white/[0.06] bg-[#0a0a0f]/60">
              <p className="text-[9px] text-[#5555a0] text-center">
                ⚠️ Ye educational content hai — professional advice ki jagah nahi. News sources external hain.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
