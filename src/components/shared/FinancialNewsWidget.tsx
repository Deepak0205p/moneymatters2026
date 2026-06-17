'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bookmark,
  Share2,
  Sparkles,
  ChevronUp,
  Flame,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/* ============================================================
   Financial News Widget — Instagram Reels style
   ============================================================ */

interface FinancialNewsWidgetProps {
  open: boolean;
  onClose: () => void;
}

type CategoryId = 'all' | 'markets' | 'tips' | 'banking' | 'tax';

interface NewsCard {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  category: Exclude<CategoryId, 'all'>;
  emoji: string;
  cta?: string;
}

const CATEGORY_CONFIG: Record<Exclude<CategoryId, 'all'>, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  markets: { label: 'Markets',  emoji: '📈', color: 'text-emerald-400', bg: 'bg-emerald-400/15', border: 'border-emerald-400/30' },
  tips:    { label: 'Tips',     emoji: '💡', color: 'text-amber-400',   bg: 'bg-amber-400/15',   border: 'border-amber-400/30' },
  banking: { label: 'Banking',  emoji: '🏦', color: 'text-violet-400',  bg: 'bg-violet-400/15',  border: 'border-violet-400/30' },
  tax:     { label: 'Tax',      emoji: '📋', color: 'text-rose-400',    bg: 'bg-rose-400/15',    border: 'border-rose-400/30' },
};

const NEWS_DATA: NewsCard[] = [
  {
    id: 'n1',
    headline: 'SIP ₹1000/month se ₹50L banta hai! 🤯',
    summary: '12% return se 20 saal mein ₹1000 monthly SIP ₹49.95L banta hai. Start karna hi sabse badi baat hai.',
    source: 'Groww Insights',
    timestamp: '2 ghante pehle',
    category: 'markets',
    emoji: '📈',
    cta: 'SIP Calculator kholo',
  },
  {
    id: 'n2',
    headline: 'Aaj se paisa bachane ke 5 asaan tarike 💡',
    summary: 'Round-up savings, no-Swiggy day, 24-hour rule, cash-only weekend, aur budget app — har student kar sakta hai.',
    source: 'Rupaiya 101 Tips',
    timestamp: 'Aaj subah',
    category: 'tips',
    emoji: '💡',
  },
  {
    id: 'n3',
    headline: 'UPI transactions cross 14 billion mark 🚀',
    summary: 'India ne record tod diya! October mein 14.96 billion UPI transactions hue. Digital India full speed mein.',
    source: 'NPCI Report',
    timestamp: '4 ghante pehle',
    category: 'banking',
    emoji: '🏦',
  },
  {
    id: 'n4',
    headline: 'Section 80C: ₹46,350 bachao tax mein! 📋',
    summary: 'PPF, ELSS, LIC — ₹1.5L tak ka deduction. Student income kam hai to ELSS best rahega long-term growth ke liye.',
    source: 'Income Tax Dept',
    timestamp: 'Kal',
    category: 'tax',
    emoji: '📋',
    cta: 'Tax tips padho',
  },
  {
    id: 'n5',
    headline: 'Nifty 50 crosses 24,000 — Bulls in control! 🐂',
    summary: 'Market 6-month high pe hai. SIP investors ko mil rahe solid returns. Volatility hai par long-term story strong hai.',
    source: 'MoneyControl',
    timestamp: '3 ghante pehle',
    category: 'markets',
    emoji: '📈',
  },
  {
    id: 'n6',
    headline: 'FD rates badh gayi! 7.5% tak mil raha 💰',
    summary: 'Small finance banks aur kuch PSU banks 7-7.5% de rahe FD pe. Senior citizens ko 8% tak mil raha hai.',
    source: 'BankBazaar',
    timestamp: 'Aaj dopahar',
    category: 'banking',
    emoji: '🏦',
  },
  {
    id: 'n7',
    headline: 'Emergency fund nahi hai? 80% Indians same hain 🚨',
    summary: 'RBI report ke according sirf 20% Indians ke paas 3 mahine ka emergency fund hai. Tu start kar — ₹1000/month se.',
    source: 'RBI Financial Literacy',
    timestamp: '2 din pehle',
    category: 'tips',
    emoji: '💡',
    cta: 'Emergency Fund Calculator',
  },
  {
    id: 'n8',
    headline: 'New tax regime mein standard deduction badha 📋',
    summary: '₹75,000 ka standard deduction ab naye regime mein bhi. Salaried employees ko ₹17,500 ka extra tax bachat.',
    source: 'Budget 2024',
    timestamp: '5 din pehle',
    category: 'tax',
    emoji: '📋',
  },
  {
    id: 'n9',
    headline: 'Mutual Fund KYC update last chance! ⏰',
    summary: '1 July se KYC na kiya to MF transactions ruk sakte hain. PAN + Aadhaar link karwa lo abhi.',
    source: 'AMFI Notice',
    timestamp: '6 ghante pehle',
    category: 'banking',
    emoji: '🏦',
  },
  {
    id: 'n10',
    headline: 'Gold prices 10% up this quarter! 🥇',
    summary: 'Festive season + global tension se gold ₹73,000 per 10g cross kar gaya. Sovereign Gold Bond best option hai.',
    source: 'MCX Bulletin',
    timestamp: 'Kal',
    category: 'markets',
    emoji: '📈',
  },
  {
    id: 'n11',
    headline: 'Student credit card: 0% EMI 90 days! 💳',
    summary: 'Select banks student credit card laa rahe ₹10k limit ke saath. Pehli card ke liye best — par bill time pe bharna!',
    source: 'Student Finance Hub',
    timestamp: '3 din pehle',
    category: 'banking',
    emoji: '🏦',
  },
  {
    id: 'n12',
    headline: '₹500 SIP vs ₹500 Zomato — 5 saal baad kya? 🍔',
    summary: '₹500 monthly Zomato = ₹30,000 gone. ₹500 monthly SIP @12% = ₹40,859. Choice tera hai!',
    source: 'Rupaiya 101',
    timestamp: '4 din pehle',
    category: 'tips',
    emoji: '💡',
  },
];

/* AI-curated "Tumhare Liye" picks */
const FOR_YOU_IDS = ['n1', 'n7', 'n12', 'n2'];

export default function FinancialNewsWidget({ open, onClose }: FinancialNewsWidgetProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'all') return NEWS_DATA;
    return NEWS_DATA.filter((n) => n.category === activeCategory);
  }, [activeCategory]);

  const forYouCards = useMemo(
    () => NEWS_DATA.filter((n) => FOR_YOU_IDS.includes(n.id)),
    [],
  );

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
    toast({
      title: bookmarks.includes(id) ? 'Bookmark hata diya' : 'Bookmark kar liya 🔖',
    });
  }, [bookmarks]);

  const handleShare = useCallback((card: NewsCard) => {
    const text = `${card.headline}\n\n${card.summary}\n\nvia Rupaiya 101 💸`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: card.headline, text }).catch(() => {
        navigator.clipboard?.writeText(text);
        toast({ title: 'Copy kar liya! 📋' });
      });
    } else {
      navigator.clipboard?.writeText(text);
      toast({ title: 'Copy kar liya! 📋' });
    }
  }, []);

  const goToCard = (id: string) => setActiveId(id);

  /* Active card detail view */
  const activeCard = activeId ? NEWS_DATA.find((n) => n.id === activeId) : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-hidden p-0 border-white/[0.08] bg-[#0B1220] text-[#F8FAFC] premium-dialog-overlay">
        <VisuallyHidden>
          <DialogTitle>Financial Insights & News</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="relative px-5 pt-6 pb-3 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl glass-card-premium grid place-items-center">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold heading-gradient">Financial Insights</h2>
                <p className="text-xs text-[#94A3B8]">Swipe up for next reel ⬆️</p>
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-full glass-card text-xs text-[#94A3B8]">
              {NEWS_DATA.length} reels
            </div>
          </div>
        </div>

        {/* AI "Tumhare Liye" section */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-300">Tumhare Liye (AI-curated)</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {forYouCards.map((card) => {
              const c = CATEGORY_CONFIG[card.category];
              return (
                <button
                  key={card.id}
                  onClick={() => goToCard(card.id)}
                  className={cn(
                    'min-w-[140px] max-w-[160px] p-3 rounded-2xl glass-card-premium text-left hover:scale-[1.03] transition border',
                    c.border,
                  )}
                >
                  <div className="text-2xl mb-1.5">{card.emoji}</div>
                  <p className="text-xs font-semibold text-[#F8FAFC] line-clamp-2 mb-1">{card.headline}</p>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', c.bg, c.color)}>
                    {c.emoji} {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category chips */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {([
              { id: 'all', label: 'All', emoji: '✨' },
              { id: 'markets', ...CATEGORY_CONFIG.markets },
              { id: 'tips', ...CATEGORY_CONFIG.tips },
              { id: 'banking', ...CATEGORY_CONFIG.banking },
              { id: 'tax', ...CATEGORY_CONFIG.tax },
            ] as const).map((c) => {
              const active = c.id === activeCategory;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                    active
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'glass-card border-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC]',
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reels feed (vertical scroll-snap) */}
        <div className="h-[480px] overflow-y-auto snap-y snap-mandatory no-scrollbar px-5 pb-6 space-y-3">
          {filteredNews.map((card, idx) => {
            const c = CATEGORY_CONFIG[card.category];
            const bookmarked = bookmarks.includes(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4 }}
                className="snap-start relative rounded-2xl overflow-hidden glass-card-premium p-5"
              >
                {/* Gradient accent */}
                <div className={cn('absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 bg-gradient-to-br', c.bg.replace('/15', '/40'))} />

                {/* Top row */}
                <div className="flex items-center justify-between mb-3 relative">
                  <span className={cn('text-[10px] px-2 py-1 rounded-full font-semibold border', c.bg, c.color, c.border)}>
                    {c.emoji} {c.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {card.timestamp}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-display text-lg font-bold text-[#F8FAFC] leading-snug mb-2 relative">
                  {card.headline}
                </h3>

                {/* Emoji + summary */}
                <div className="flex items-start gap-3 mb-4 relative">
                  <div className="text-3xl shrink-0">{card.emoji}</div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{card.summary}</p>
                </div>

                {/* Source + CTA */}
                <div className="flex items-center justify-between mb-3 relative">
                  <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> {card.source}
                  </span>
                  {card.cta && (
                    <button
                      onClick={() => goToCard(card.id)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {card.cta} →
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => toggleBookmark(card.id)}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5',
                      bookmarked
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'glass-card text-[#94A3B8] hover:text-[#F8FAFC]',
                    )}
                  >
                    <Bookmark className={cn('w-3.5 h-3.5', bookmarked && 'fill-current')} />
                    {bookmarked ? 'Saved' : 'Bookmark'}
                  </button>
                  <button
                    onClick={() => handleShare(card)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold glass-card text-[#94A3B8] hover:text-[#F8FAFC] transition flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>

                {/* Swipe hint — only on first card */}
                {idx === 0 && (
                  <motion.div
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="absolute -bottom-1 right-4 text-emerald-400"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {filteredNews.length === 0 && (
            <div className="grid place-items-center h-40 text-sm text-[#94A3B8]">
              Koi reel nahi mila is category mein 🤷
            </div>
          )}
        </div>

        {/* Active card detail modal */}
        <AnimatePresence>
          {activeCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
              className="absolute inset-0 z-30 grid place-items-center bg-[#0B1220]/95 backdrop-blur-md p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'max-w-sm w-full p-6 rounded-3xl glass-card-premium relative',
                  CATEGORY_CONFIG[activeCard.category].border,
                )}
              >
                <button
                  onClick={() => setActiveId(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card grid place-items-center text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-5xl mb-3">{activeCard.emoji}</div>
                <span className={cn('text-[10px] px-2 py-1 rounded-full font-semibold', CATEGORY_CONFIG[activeCard.category].bg, CATEGORY_CONFIG[activeCard.category].color)}>
                  {CATEGORY_CONFIG[activeCard.category].emoji} {CATEGORY_CONFIG[activeCard.category].label}
                </span>
                <h3 className="font-display text-xl font-bold text-[#F8FAFC] leading-snug mt-3 mb-2">
                  {activeCard.headline}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{activeCard.summary}</p>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-4">
                  <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {activeCard.source}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeCard.timestamp}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(activeCard.id)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5',
                      bookmarks.includes(activeCard.id) ? 'bg-amber-400/15 text-amber-300' : 'glass-card text-[#94A3B8]',
                    )}
                  >
                    <Bookmark className={cn('w-3.5 h-3.5', bookmarks.includes(activeCard.id) && 'fill-current')} />
                    {bookmarks.includes(activeCard.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleShare(activeCard)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold btn-3d bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
