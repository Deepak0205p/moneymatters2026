"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { getModuleById, getAllCardsForModule } from '@/data/modulesIndex';
import { ContextTutorChat } from '@/components/shared/ContextTutorChat';
import { StrategySlide } from '@/components/shared/StrategySlide';
import { StrategyOnboarding } from '@/components/shared/StrategyOnboarding';
import { getStrategiesForModule, type StrategyDef } from '@/lib/data/strategyRegistry';
import {
  X, Zap, Play, BookOpen, CheckCircle2, Sparkles, ArrowUp,
  Bookmark, FileText, Send, Trash2,
} from 'lucide-react';
import {
  RichContent, RainbowProgress,
  InteractiveQuizViewer, InteractiveCalculatorViewer, InteractiveChoiceViewer,
} from './CardContent';

/**
 * SwipeCardViewer — Full-page module learning experience.
 * Renders as a dedicated page (not an overlay). Navigation via keyboard,
 * mouse wheel, and touch swipe. Includes AI Tutor, notes, bookmarks.
 */
export function SwipeCardViewer({
  moduleId,
  onClose,
  onComplete,
}: {
  moduleId: number;
  onClose: () => void;
  onComplete: (id: number) => void;
}) {
  const allCards = getAllCardsForModule(moduleId);
  const activeModule = getModuleById(moduleId);
  const { moduleProgress, updateModuleProgress, setModuleContext } = useAppStore();
  const savedPercent = moduleProgress[moduleId] || 0;
  const initialIndex = Math.round((savedPercent / 100) * Math.max(allCards.length - 1, 0));
  const [currentIndex, setCurrentIndex] = useState<number>(Math.min(initialIndex, allCards.length - 1));
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const scrollAccumulator = useRef(0);

  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [onboardingStrategy, setOnboardingStrategy] = useState<StrategyDef | null>(null);
  const router = useRouter();

  // Get strategies embedded in this module (appear as bonus slides after last content card)
  const moduleStrategies = getStrategiesForModule(moduleId);

  const isLast = currentIndex === allCards.length - 1;
  const currentCard = allCards[currentIndex];

  useEffect(() => {
    const percentage = Math.floor((currentIndex / Math.max(allCards.length - 1, 1)) * 100);
    updateModuleProgress(moduleId, percentage);
  }, [currentIndex, moduleId, allCards.length, updateModuleProgress]);

  useEffect(() => {
    if (!activeModule || !currentCard) return;
    setModuleContext({
      moduleId: activeModule.id,
      moduleTitle: activeModule.title,
      moduleDescription: activeModule.description,
      cardTitle: currentCard.title,
      cardTopic: currentCard.topicTitle,
      cardContent: currentCard.content,
    });
  }, [activeModule, currentCard, setModuleContext]);

  useEffect(() => {
    if (!currentCard?.id) return;
    const cardId = currentCard.id;
    const raf = requestAnimationFrame(() => {
      const savedNotes = localStorage.getItem(`notes_${cardId}`);
      if (savedNotes) { try { setNotes(JSON.parse(savedNotes)); } catch { setNotes([]); } } else setNotes([]);
      const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
      setBookmarked(bookmarks.includes(cardId));
    });
    return () => cancelAnimationFrame(raf);
  }, [currentCard?.id]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, newNote.trim()];
    setNotes(updated);
    setNewNote('');
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };

  const deleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };

  const toggleBookmark = () => {
    if (!currentCard?.id) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
    let updated;
    if (bookmarks.includes(currentCard.id)) {
      updated = bookmarks.filter((id: string) => id !== currentCard.id);
      setBookmarked(false);
    } else {
      updated = [...bookmarks, currentCard.id];
      setBookmarked(true);
    }
    localStorage.setItem('bookmarked_cards', JSON.stringify(updated));
  };

  const handleNext = useCallback(() => {
    if (currentIndex < allCards.length - 1) setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, allCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentIndex]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let lastScrollTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollingDown = e.deltaY > 0;
      const now = Date.now();
      if (isScrollingDown) {
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;
        if (isAtBottom) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current > 300 && now - lastScrollTime > 800) { lastScrollTime = now; scrollAccumulator.current = 0; handleNext(); }
        } else scrollAccumulator.current = 0;
      } else {
        const isAtTop = scrollTop <= 8;
        if (isAtTop) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current < -300 && now - lastScrollTime > 800) { lastScrollTime = now; scrollAccumulator.current = 0; handlePrev(); }
        } else scrollAccumulator.current = 0;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (diffY > 120 && scrollTop + clientHeight >= scrollHeight - 10) handleNext();
    else if (diffY < -120 && scrollTop <= 10) handlePrev();
  };

  if (!currentCard || !activeModule) return null;

  return (
    <main className="min-h-screen w-full overflow-hidden bg-midnight relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060608]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ backgroundColor: currentCard.color }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ backgroundColor: currentCard.color }}
        />
      </div>

      {/* Phone frame on desktop, full screen on mobile */}
      <div className="relative z-10 w-full h-screen sm:max-w-[480px] sm:mx-auto sm:h-[94vh] sm:mt-[3vh] sm:rounded-3xl sm:border sm:border-white/[0.06] sm:overflow-hidden sm:shadow-2xl sm:shadow-black/50 flex flex-col bg-[#0F0F13]">
        {/* Top Bar */}
        <div className="relative z-30 flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0 bg-[#0F0F13]">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer" aria-label="Close">
            <X size={14} />
          </button>
          <div className="text-center truncate px-2 max-w-[60%]">
            <p className="text-white/60 text-[11px] font-medium truncate">{currentCard.topicTitle}</p>
            <p className="text-[9px] font-extrabold tracking-widest uppercase truncate" style={{ color: activeModule.color }}>{activeModule.title}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { useAppStore.getState().openTutorChat(); }}
              className="w-8 h-8 rounded-full bg-ai/20 border border-ai/50 flex items-center justify-center hover:bg-ai/30 text-ai-soft transition-colors active:scale-90 cursor-pointer"
              title="Ask AI Tutor about this card"
              aria-label="Ask AI Tutor"
            >
              <Sparkles size={14} />
            </button>
            <button
              onClick={toggleBookmark}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors active:scale-90 cursor-pointer ${bookmarked ? 'bg-gold/20 border-gold/50 text-gold-soft' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`}
              aria-label="Bookmark"
            >
              <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
            </button>
            <button onClick={() => setShowNotes(true)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer relative" aria-label="Notes">
              <FileText size={14} />
              {notes.length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-black">{notes.length}</span>}
            </button>
          </div>
        </div>

        {/* Cards Area */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="absolute inset-0 flex flex-col bg-[#0F0F13] select-none overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              initial={{ y: 200, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -200, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              <RainbowProgress currentIndex={currentIndex} totalCount={allCards.length} />

              {/* Scrollable Card Content */}
              <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Banner */}
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg flex flex-col justify-end p-6 bg-[#18181C]" style={{ height: '32%', minHeight: '180px' }}>
                  <motion.div
                    className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: currentCard.color }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  />
                  <div className="relative z-10 w-fit mt-auto">
                    <span className="text-3xl mb-2 block">{currentCard.emoji}</span>
                    <motion.h3
                      className="font-extrabold text-[17px] sm:text-[19px] tracking-tight leading-snug text-zinc-100"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {currentCard.title}
                    </motion.h3>
                    <p className="text-[11px] mt-1 font-medium" style={{ color: currentCard.color }}>{currentCard.topicTitle}</p>
                  </div>
                </div>

                {/* Rich Content */}
                <motion.div className="pt-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                  <RichContent content={currentCard.content} color={currentCard.color} />
                </motion.div>

                {/* Interactive Payloads */}
                {currentCard.interactiveType === 'quiz' && currentCard.quizData && <InteractiveQuizViewer data={currentCard.quizData} color={currentCard.color} />}
                {currentCard.interactiveType === 'myth_buster' && currentCard.quizData && <InteractiveQuizViewer data={currentCard.quizData} color={currentCard.color} />}
                {currentCard.interactiveType === 'calculator' && currentCard.calcData && <InteractiveCalculatorViewer data={currentCard.calcData} color={currentCard.color} />}
                {currentCard.interactiveType === 'choice_sim' && currentCard.choiceData && <InteractiveChoiceViewer data={currentCard.choiceData} color={currentCard.color} />}

                {/* ── Strategy Slides (appear after the LAST content card) ── */}
                {isLast && moduleStrategies.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500 text-center">
                      🎮 Bonus Strategies — Try It Now!
                    </p>
                    {moduleStrategies.map((strategy) => (
                      <StrategySlide
                        key={strategy.id}
                        strategyName={strategy.name}
                        hook={strategy.hook || strategy.description}
                        icon={strategy.iconName}
                        accentColor={strategy.accentColor}
                        rewardCoins={strategy.rewardCoins}
                        onStart={() => setOnboardingStrategy(strategy)}
                      />
                    ))}
                  </div>
                )}

                {/* Module Complete */}
                {isLast && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="rounded-2xl p-5 border overflow-hidden relative mt-2 bg-emerald-950/20 border-emerald-500/20"
                  >
                    <div className="absolute -inset-4 blur-xl opacity-10 bg-emerald-500" />
                    <div className="relative flex items-center gap-2 mb-2">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}>
                        <Sparkles size={18} className="text-emerald-400" />
                      </motion.div>
                      <span className="font-bold text-sm text-emerald-400">Module Complete!</span>
                      <span className="text-xl">🏆</span>
                    </div>
                    <p className="relative text-zinc-400 text-sm">Badhai ho! {activeModule.title} complete! Aage badhein aur naya seekhein!</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onComplete(moduleId)}
                      className="relative mt-4 w-full py-3 rounded-xl font-bold text-sm text-midnight flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)', boxShadow: '0 8px 24px rgba(16,185,129,0.30)' }}
                    >
                      <CheckCircle2 size={16} />
                      Module Complete Karo (+100 coins)
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Mobile swipe hint */}
              {!isLast && (
                <div className="absolute bottom-5 left-0 right-0 z-30 pointer-events-none flex flex-col items-center gap-0.5 sm:hidden">
                  <motion.div className="flex flex-col items-center gap-0.5" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowUp size={14} className="text-white/35" />
                    <span className="text-white/35 text-[10px] font-medium tracking-wider uppercase">Swipe up to read next</span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Notes Overlay */}
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-x-0 bottom-0 top-1/4 z-50 rounded-t-3xl bg-[#18181C] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F0F13]">
                  <h3 className="font-bold text-white flex items-center gap-2"><FileText size={16} className="text-gold-soft" /> Notes ({notes.length})</h3>
                  <button onClick={() => setShowNotes(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60" aria-label="Close notes"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center text-white/40 mt-10 text-sm">No notes yet. Add one below!</div>
                  ) : (
                    notes.map((n, i) => (
                      <div key={i} className="group relative bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 pr-10">
                        {n}
                        <button onClick={() => deleteNote(i)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" aria-label="Delete note"><Trash2 size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-[#0F0F13] border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a note line..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-colors"
                    />
                    <button onClick={addNote} disabled={!newNote.trim()} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gold text-black rounded-xl disabled:opacity-50 disabled:bg-white/20 disabled:text-white/40" aria-label="Add note">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Context-Aware AI Tutor */}
      <ContextTutorChat />

      {/* Strategy Onboarding Popup (opens when user clicks "Shuru Karo") */}
      <StrategyOnboarding
        isOpen={onboardingStrategy !== null}
        onClose={() => setOnboardingStrategy(null)}
        onStart={() => {
          if (onboardingStrategy) {
            router.push(`/strategy/${onboardingStrategy.slug}`);
          }
        }}
        steps={onboardingStrategy?.onboardingSteps?.map((s) => ({
          title: s.title,
          icon: s.icon,
          content: <p className="whitespace-pre-line text-sm text-ink-muted leading-relaxed">{s.content}</p>,
        })) || []}
        accentColor={onboardingStrategy?.accentColor || '#10B981'}
        strategyName={onboardingStrategy?.name || ''}
        rewardCoins={onboardingStrategy?.rewardCoins || 0}
      />
    </main>
  );
}
