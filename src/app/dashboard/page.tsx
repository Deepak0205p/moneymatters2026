"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import ModuleCard from '@/components/shared/ModuleCard';
import DynamicIcon from '@/components/shared/DynamicIcon';
import { modules } from '@/lib/data/modules';
import { quizQuestions } from '@/lib/data/quiz-data';
import QuizCard from '@/components/shared/QuizCard';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Coins, Trophy, Flame, ChevronRight, Award, Share2, X, TrendingUp,
  Zap, Play, BookOpen, CheckCircle2, Sparkles, Wrench, ArrowRight, Lock,
  AlertCircle, Lightbulb,
} from 'lucide-react';

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ── Finance Ticker ───────────────────────────────────────────────────────────
function FinanceTicker() {
  const messages = [
    'Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨',
    'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️',
    'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳',
    "Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉",
    'Wealth is what you don\'t see. Ameer mat dikho, ameer bano! 🕵️',
    'Pehla rule: Khud pe invest karo. Skills = Best Returns. 🎓',
  ];
  return (
    <div className="w-full bg-emerald/10 border-y border-emerald/20 py-2 overflow-hidden whitespace-nowrap relative">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 items-center"
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> {msg}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10" />
    </div>
  );
}

// ── Achievement Toast ────────────────────────────────────────────────────────
function AchievementToast({ onClaim }: { onClaim: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const visited = typeof window !== 'undefined' ? localStorage.getItem('firstVisit_dashboard') : null;
    if (!visited) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-4 rounded-2xl border border-gold/30 glass-strong p-4 shadow-2xl max-w-sm"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-ai/20 flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Achievement Unlocked!</p>
            <p className="text-xs text-gold-soft">&quot;First Login&quot; — +50 Coins</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onClaim();
              setShow(false);
              if (typeof window !== 'undefined') localStorage.setItem('firstVisit_dashboard', 'done');
            }}
            className="rounded-xl bg-gradient-to-r from-gold to-ai px-4 py-2 text-xs font-bold text-white flex-shrink-0 cursor-pointer"
          >
            Claim!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Module Detail Sheet (r2's exact structure: subtopics, takeaways, misconceptions, mistakes, quiz) ──
function ModuleSheet({
  moduleId,
  onClose,
}: {
  moduleId: number | null;
  onClose: () => void;
}) {
  const { completedModules, moduleProgress, completeModule, updateModuleProgress, addCoins, recordQuizScore } = useAppStore();
  const { getModuleProgress, isModuleCompleted } = useProgress();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const selectedModule = moduleId ? modules.find((m) => m.id === moduleId) : null;
  const moduleQuizzes = moduleId ? quizQuestions.filter((q) => q.moduleId === moduleId) : [];

  const handleQuizAnswer = (selectedIndex: number) => {
    if (!moduleId) return;
    const question = moduleQuizzes[quizIndex];
    const isCorrect = selectedIndex === question.correctIndex;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    if (quizIndex < moduleQuizzes.length - 1) {
      setQuizScore(newScore);
      setQuizIndex((prev) => prev + 1);
    } else {
      const finalScore = newScore;
      const percentage = Math.round((finalScore / moduleQuizzes.length) * 100);
      setQuizScore(finalScore);
      setQuizComplete(true);
      recordQuizScore(`module-${moduleId}`, percentage);
      addCoins(Math.floor(percentage / 10) * 5);
      updateModuleProgress(moduleId, Math.min(100, (moduleProgress[moduleId] || 0) + 25));
      if (percentage >= 60 && !completedModules.includes(moduleId)) {
        completeModule(moduleId);
        addCoins(50);
      }
    }
  };

  const handleMarkComplete = () => {
    if (!moduleId || completedModules.includes(moduleId)) return;
    updateModuleProgress(moduleId, 100);
    completeModule(moduleId);
    addCoins(50);
    onClose();
  };

  const open = moduleId !== null && !showQuiz;

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setShowQuiz(false);
          setExpandedSubtopic(null);
          onClose();
        }
      }}
    >
      <SheetContent
        className="w-[92vw] sm:w-[480px] bg-midnight-soft border-l border-white/[0.06] p-0"
        style={{ maxWidth: '480px' }}
      >
        {selectedModule && (
          <ScrollArea className="h-full">
            <SheetHeader className="p-5 pt-10 pb-3 text-left">
              <SheetDescription className="sr-only">Module details</SheetDescription>
              <div className="flex items-start gap-3.5 mb-3">
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: 52, height: 52,
                    background: `${selectedModule.color}14`,
                    border: `1.5px solid ${selectedModule.color}30`,
                  }}
                >
                  <DynamicIcon name={selectedModule.icon} size={26} style={{ color: selectedModule.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle asChild>
                    <h2 className="text-lg font-black text-ink flex items-center gap-2">
                      {selectedModule.title}
                      {isModuleCompleted(selectedModule.id) && (
                        <Badge className="bg-emerald/15 text-emerald-soft border-emerald/25 text-[9px] px-1.5 py-0">
                          <CheckCircle2 size={10} className="mr-0.5" /> Done
                        </Badge>
                      )}
                    </h2>
                  </SheetTitle>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">{selectedModule.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              {!isModuleCompleted(selectedModule.id) && (
                <div className="px-3 py-2.5 rounded-lg glass border border-white/[0.05]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-ink-muted">Progress</span>
                    <span className="text-[10px] font-bold text-emerald-soft">
                      {Math.round(getModuleProgress(selectedModule.id))}%
                    </span>
                  </div>
                  <Progress value={getModuleProgress(selectedModule.id)} className="h-1.5 bg-white/[0.06]" />
                </div>
              )}
              {isModuleCompleted(selectedModule.id) && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald/[0.08] border border-emerald/15">
                  <CheckCircle2 size={16} className="text-emerald-soft" />
                  <span className="text-xs text-emerald-soft font-semibold">Module Complete! 🎉</span>
                </div>
              )}
            </SheetHeader>

            <div className="px-5 pb-8 space-y-6">
              {/* Subtopics */}
              <div>
                <h3 className="text-xs font-black text-ink mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <BookOpen size={13} className="text-emerald-soft" /> Subtopics
                </h3>
                <div className="space-y-1.5">
                  {selectedModule.subtopics.map((sub) => (
                    <div key={sub.id} className="rounded-lg border border-white/[0.05] glass overflow-hidden">
                      <button
                        className="w-full px-3 py-2.5 text-left flex items-center gap-2 hover:bg-white/[0.04] transition-colors"
                        onClick={() => setExpandedSubtopic(expandedSubtopic === sub.id ? null : sub.id)}
                      >
                        <ChevronRight
                          size={13}
                          className="text-ink-muted shrink-0 transition-transform duration-200"
                          style={{ transform: expandedSubtopic === sub.id ? 'rotate(90deg)' : 'rotate(0)' }}
                        />
                        <span className="text-xs font-medium text-ink flex-1">{sub.title}</span>
                        {sub.hasQuiz && (
                          <Badge className="text-[7px] bg-gold/10 text-gold-soft border-gold/20 px-1.5 py-0 shrink-0">Quiz</Badge>
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedSubtopic === sub.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-3 pb-3 pt-1 text-xs text-ink-muted leading-relaxed border-t border-white/[0.03]"
                              dangerouslySetInnerHTML={{ __html: sub.content }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-xs font-black text-ink mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Zap size={13} className="text-emerald-soft" /> Key Takeaways
                </h3>
                <div className="space-y-2">
                  {selectedModule.keyTakeaways.map((takeaway, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-2.5 items-start"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-soft" />
                      <p className="text-xs text-ink-muted leading-relaxed">{takeaway}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mistakes to Avoid */}
              {selectedModule.mistakes.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-ink mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <AlertCircle size={13} className="text-red-400" /> Mistakes se Bacho
                  </h3>
                  <div className="space-y-2">
                    {selectedModule.mistakes.map((mistake, i) => (
                      <div key={i} className="flex gap-2.5 items-start rounded-lg bg-red-500/[0.06] border border-red-500/15 p-2.5">
                        <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded shrink-0 uppercase">Avoid</span>
                        <p className="text-xs text-ink-muted leading-relaxed">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Myth vs Truth */}
              {selectedModule.misconceptions.length > 0 && (
                <div>
                  <h3 className="text-xs font-black text-ink mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles size={13} className="text-ai-soft" /> Myth vs Truth
                  </h3>
                  <div className="space-y-2.5">
                    {selectedModule.misconceptions.map((m, i) => (
                      <div key={i} className="rounded-lg glass border border-white/[0.05] p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">Myth</span>
                          <p className="text-xs text-ink-muted leading-relaxed">{m.myth}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[9px] font-black text-emerald-soft bg-emerald/10 px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider">Truth</span>
                          <p className="text-xs text-ink leading-relaxed">{m.truth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz Section */}
              {moduleQuizzes.length > 0 && (
                <div>
                  {!showQuiz ? (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-soft to-emerald text-midnight font-black hover:from-emerald hover:to-emerald-deep h-11 text-sm shadow-lg shadow-emerald/20"
                      onClick={() => { setShowQuiz(true); setQuizIndex(0); setQuizScore(0); setQuizComplete(false); }}
                    >
                      <Trophy size={16} className="mr-2" /> Quiz Khelo ({moduleQuizzes.length} Sawaal)
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink">Sawaal {quizIndex + 1}/{moduleQuizzes.length}</span>
                        <Badge className="bg-gold/10 text-gold-soft border-gold/20 text-[10px]">
                          <Flame size={10} className="mr-0.5" /> {quizScore} Correct
                        </Badge>
                      </div>
                      <div className="flex gap-1.5">
                        {moduleQuizzes.map((_, i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{ background: i < quizIndex ? '#10B981' : i === quizIndex ? '#F59E0B' : 'rgba(255,255,255,0.08)' }}
                          />
                        ))}
                      </div>
                      {!quizComplete ? (
                        <QuizCard key={moduleQuizzes[quizIndex].id} question={moduleQuizzes[quizIndex]} onAnswer={handleQuizAnswer} />
                      ) : (
                        <motion.div
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="text-center py-8 rounded-xl glass border border-white/[0.06]"
                        >
                          <Trophy size={44} className="text-gold-soft mx-auto mb-3" />
                          <h3 className="text-lg font-black text-ink">Quiz Complete! 🎉</h3>
                          <p className="text-sm text-ink-muted mt-1.5">
                            Score: <span className="text-gold-soft font-bold">{quizScore}</span>/{moduleQuizzes.length}
                          </p>
                          <p className="text-xs text-ink-muted mt-1">
                            {quizScore >= moduleQuizzes.length * 0.6 ? '🎉 Module complete ho gaya! +50 coins!' : '💪 Aur practice karo — next time pakka!'}
                          </p>
                          <Button
                            className="mt-4 bg-emerald text-midnight font-bold hover:bg-emerald-deep text-xs"
                            onClick={() => { setShowQuiz(false); onClose(); }}
                            size="sm"
                          >
                            Wapas Dashboard
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mark Complete (if not completed and no quiz) */}
              {moduleQuizzes.length === 0 && !isModuleCompleted(selectedModule.id) && (
                <Button
                  className="w-full bg-gradient-to-r from-emerald-soft to-emerald text-midnight font-black hover:from-emerald hover:to-emerald-deep h-11 text-sm"
                  onClick={handleMarkComplete}
                >
                  <CheckCircle2 size={16} className="mr-2" /> Module Complete Karo (+50 coins)
                </Button>
              )}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Dashboard Background ─────────────────────────────────────────────────────
function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight">
      <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
      <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

const QUOTES = [
  'Paisa invest karo, future secure karo!',
  'Har rupee ek soldier hai — use wisely!',
  'Compounding ka jadoo samjho, aur ameer bano!',
  'Debt se bachna = financial freedom ka pehla step',
];

// ─── Main Dashboard ──────────────────────────────────────────────────────────
// Shell: capital-mastery (Navbar, FinanceTicker, hero stats, Tools CTA, AIChatBot)
// Module layout: r2's exact ModuleCard design + module detail Sheet (subtopics, takeaways, mistakes, misconceptions, quiz)
export default function Dashboard() {
  const { user, isAuthenticated, coins, streak, addCoins } = useAppStore();
  const { completionPercentage, modulesCompleted, getModuleProgress, isModuleCompleted } = useProgress();
  const hydrated = useHydration();
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  const handleClaim = useCallback(() => { addCoins(50); }, [addCoins]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
          <p className="text-ink-muted text-sm">Loading your progress...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-midnight">
      <DashboardBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="mt-20"><FinanceTicker /></div>

        {/* Hero + Tools CTA */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card-premium"
          >
            <Image src="/images/dashboard_hero.jpeg" alt="Dashboard background" fill className="object-cover opacity-[0.12] pointer-events-none" priority />
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                    Namaste, {user?.displayName?.split(' ')[0] ?? 'Champion'}!
                  </h1>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-base text-ink-muted font-medium"
                    >
                      &quot;{QUOTES[quoteIndex]}&quot;
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-gold/10 px-5 py-3 border border-gold/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="p-2 rounded-xl bg-gold/20"><Coins size={20} className="text-gold-soft" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none"><AnimatedCounter target={coins} /></p>
                      <p className="text-[10px] font-bold text-gold-soft uppercase tracking-tighter">Coins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-3 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <div className="p-2 rounded-xl bg-red-500/20"><Flame size={20} className="text-red-400" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none">{streak}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-emerald/20 glass-card-premium p-6 sm:p-8"
          >
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)', boxShadow: '0 0 20px rgba(16,185,129,0.30)' }}>
                  <Wrench size={26} className="text-midnight" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Strategies & Tools</h3>
                  <p className="text-sm text-ink-muted">12 strategies + 16 financial tools — SIP calc, expense tracker, quizzes, games aur bahut kuch!</p>
                </div>
              </div>
              <Link href="/tools">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
                >
                  Tools kholo <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Learning Modules (r2's exact ModuleCard grid + lock/unlock logic) ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Financial Journey Map</h2>
              <p className="text-sm text-ink-muted mt-1 max-w-xl">
                Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! 🚀
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-soft animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                {modulesCompleted} of {modules.length} Completed · {completionPercentage}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, index) => {
              const progress = getModuleProgress(mod.id);
              const completed = isModuleCompleted(mod.id);
              // r2's exact lock/unlock logic
              const isLocked = index > 0 && !isModuleCompleted(modules[index - 1].id) && progress === 0;
              const isCurrent = !completed && !isLocked;
              return (
                <div key={mod.id} className={cn('relative', isLocked && 'opacity-50 pointer-events-none')}>
                  {isLocked && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <Lock size={12} className="text-ink-muted" />
                    </div>
                  )}
                  {isCurrent && !completed && (
                    <div className="absolute -top-2 left-3 z-10 px-2 py-0.5 rounded-full bg-emerald text-midnight text-[8px] font-black uppercase tracking-wider">
                      Next
                    </div>
                  )}
                  <ModuleCard
                    module={mod}
                    progress={completed ? 100 : progress}
                    onClick={() => !isLocked && setOpenModuleId(mod.id)}
                  />
                  {isLocked && index > 0 && (
                    <p className="text-[9px] text-ink-muted/60 mt-1 px-1">
                      Pehle &quot;{modules[index - 1].title}&quot; khatam karo
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Mastery Progress Panel (per-module progress bars) ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card"
          >
            <Image src="/images/progress_panel.jpeg" alt="" fill className="object-cover opacity-[0.07] pointer-events-none" />
            <div className="relative z-10 p-8">
              <h2 className="text-xl font-black text-white mb-6">Mastery Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {modules.map((mod) => {
                  const progress = getModuleProgress(mod.id);
                  const isCompleted = isModuleCompleted(mod.id);
                  const progressPercent = isCompleted ? 100 : progress;
                  return (
                    <div key={mod.id} className="group">
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-white/60 font-bold uppercase tracking-wider">Module {mod.id}: {mod.title}</span>
                        <span className="text-white/40 font-black">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/[0.03]">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full relative"
                          style={{ backgroundColor: mod.color }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {[
              { label: 'Daily Challenge', icon: Zap, color: '#8B5CF6', action: () => router.push('/tools') },
              { label: 'Leaderboard', icon: Trophy, color: '#F59E0B', action: () => router.push('/tools') },
              { label: 'Refer a Friend', icon: Share2, color: '#38BDF8', action: () => { if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText('RUPAIYA101'); alert('Referral code copied: RUPAIYA101'); } },
              { label: 'Help Center', icon: BookOpen, color: '#10B981', action: () => router.push('/tools') },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white whitespace-nowrap backdrop-blur-md cursor-pointer flex-shrink-0 transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center py-12 border-t border-white/[0.03]">
            <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">Capital Mastery — Rupaiya 101</p>
            <p className="text-xs text-ink-muted mt-2">Paisa Samjho, Future Secure Karo!</p>
          </div>
        </div>
      </div>

      {/* r2 Module Detail Sheet */}
      <ModuleSheet moduleId={openModuleId} onClose={() => setOpenModuleId(null)} />

      <AchievementToast onClaim={handleClaim} />
      <AIChatBot />
    </main>
  );
}
