'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  Trophy,
  Lightbulb,
  CheckCircle2,
  Lock,
  Zap,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface StoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface StoryChapter {
  id: string;
  chapterNumber: number;
  title: string;
  scene: string;
  dialogue: string;
  speaker: string;
  lesson: string;
  emoji: string;
  choice?: StoryChoice;
  xpReward: number;
}

export interface ModuleStory {
  moduleId: number;
  storyTitle: string;
  storySubtitle: string;
  characterEmoji: string;
  settingDescription: string;
  chapters: StoryChapter[];
}

export interface StoryReaderProps {
  story: ModuleStory;
  onComplete: () => void;
  onClose: () => void;
  isModuleCompleted: boolean;
  currentProgress: number;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const SPEAKER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string; tail: string }> = {
  Arjun: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    text: '#f59e0b',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    tail: '#f59e0b33',
  },
  Priya: {
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
    text: '#a855f7',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    tail: '#a855f733',
  },
  Papa: {
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    text: '#22c55e',
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    tail: '#22c55e33',
  },
  Boss: {
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    text: '#3b82f6',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tail: '#3b82f633',
  },
  Narrator: {
    bg: 'rgba(136,136,160,0.06)',
    border: 'rgba(136,136,160,0.15)',
    text: '#8888a0',
    badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    tail: '#8888a033',
  },
};

const DEFAULT_SPEAKER = {
  bg: 'rgba(136,136,160,0.06)',
  border: 'rgba(136,136,160,0.15)',
  text: '#8888a0',
  badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  tail: '#8888a033',
};

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

/** Floating XP reward animation */
function XPReward({ amount, show }: { amount: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute -top-2 right-4 pointer-events-none z-50"
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -70, scale: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 font-bold text-sm">+{amount} XP</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Celebration particles for completion screen */
function CelebrationParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 8,
    color: ['#f59e0b', '#a855f7', '#22c55e', '#3b82f6', '#ef4444', '#f97316'][Math.floor(Math.random() * 6)],
    drift: (Math.random() - 0.5) * 60,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: '40%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, y: 0, x: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, -120, -250],
            x: [0, p.drift * 0.5, p.drift],
            scale: [0, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/** Progress dots with lock/check/pulse states */
function ProgressDots({
  total,
  current,
  readChapters,
}: {
  total: number;
  current: number;
  readChapters: Set<number>;
}) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }, (_, i) => {
        const isRead = readChapters.has(i);
        const isCurrent = i === current;
        return (
          <div key={i} className="relative">
            {isCurrent && (
              <motion.div
                className="absolute inset-0 rounded-full bg-amber-400/30"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <div
              className={`
                relative w-2.5 h-2.5 rounded-full transition-colors duration-300
                ${isCurrent ? 'bg-amber-400' : isRead ? 'bg-amber-400/60' : 'bg-white/10'}
              `}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Speech bubble component */
function DialogueBubble({ dialogue, speaker }: { dialogue: string; speaker: string }) {
  const speakerStyle = SPEAKER_COLORS[speaker] || DEFAULT_SPEAKER;

  const speakerEmojis: Record<string, string> = {
    Arjun: '👦',
    Priya: '👩',
    Papa: '👨‍🦳',
    Boss: '💼',
    Narrator: '📖',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
      className="relative mt-5 story-dialogue-animate"
    >
      {/* Speaker badge */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-base">{speakerEmojis[speaker] || '💬'}</span>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${speakerStyle.badge}`}
        >
          {speaker}
        </span>
      </div>

      {/* Bubble */}
      <div
        className="relative rounded-2xl rounded-tl-sm px-5 py-4"
        style={{
          backgroundColor: speakerStyle.bg,
          borderColor: speakerStyle.border,
          borderWidth: 1,
        }}
      >
        {/* Speech tail */}
        <div
          className="absolute -top-2 left-4 w-4 h-4 rotate-45"
          style={{
            backgroundColor: speakerStyle.bg,
            borderLeft: `1px solid ${speakerStyle.border}`,
            borderTop: `1px solid ${speakerStyle.border}`,
          }}
        />

        <p className="text-[15px] leading-relaxed" style={{ color: '#e8e8ed' }}>
          &ldquo;{dialogue}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

/** Lesson highlight card */
function LessonCard({ lesson }: { lesson: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-5 relative"
    >
      <div
        className="relative rounded-xl px-5 py-4 border story-lesson-card"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)',
          borderColor: 'rgba(245,158,11,0.2)',
          boxShadow: '0 0 20px rgba(245,158,11,0.05)',
        }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 mb-1 block">
              Lesson
            </span>
            <p className="text-[14px] font-semibold leading-relaxed text-[#e8e8ed]">{lesson}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Interactive choice card */
function ChoiceCard({
  choice,
  onAnswer,
  answered,
}: {
  choice: StoryChoice;
  onAnswer: (isCorrect: boolean) => void;
  answered: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCorrect, setSelectedCorrect] = useState<boolean | null>(null);

  const handleSelect = (option: StoryChoice) => {
    if (answered) return;
    setSelectedId(option.id);
    setSelectedCorrect(option.isCorrect);
    setShowFeedback(true);
    onAnswer(option.isCorrect);
  };

  const isSelected = (id: string) => selectedId === id;
  const getOptionStyle = (option: StoryChoice) => {
    if (!answered && !isSelected(option.id)) {
      return 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]';
    }
    if (isSelected(option.id) && option.isCorrect) {
      return 'bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]';
    }
    if (isSelected(option.id) && !option.isCorrect) {
      return 'bg-red-500/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]';
    }
    if (answered && option.isCorrect) {
      return 'bg-green-500/5 border-green-500/20';
    }
    return 'bg-white/[0.02] border-white/[0.04] opacity-60';
  };

  const getTextStyle = (option: StoryChoice) => {
    if (isSelected(option.id) && option.isCorrect) return 'text-green-400';
    if (isSelected(option.id) && !option.isCorrect) return 'text-red-400';
    if (answered && option.isCorrect) return 'text-green-400/60';
    return 'text-[#a0a0b8]';
  };

  // Create the two options: the correct one + the incorrect one
  const options: StoryChoice[] = [choice, { ...choice, id: choice.id + '_alt', text: choice.text === choice.text ? getAlternateOption(choice) : choice.text, isCorrect: !choice.isCorrect, feedback: '' }];

  // Reorder: shuffle based on id hash so correct isn't always first
  const orderedOptions = choice.id.length % 2 === 0 ? [options[1], options[0]] : [options[0], options[1]];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mt-5"
    >
      <p className="text-xs font-semibold text-[#a0a0b8] uppercase tracking-wider mb-3">
        Tumhara faisla kya hai?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {orderedOptions.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + idx * 0.15 }}
            whileTap={answered ? undefined : { scale: 0.97 }}
            onClick={() => handleSelect(option)}
            disabled={answered}
            className={`
              relative rounded-xl px-4 py-3.5 text-left border transition-all duration-300
              min-h-[56px]
              ${getOptionStyle(option)}
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border
                  ${isSelected(option.id) && option.isCorrect ? 'border-green-500/50 text-green-400 bg-green-500/10' : ''}
                  ${isSelected(option.id) && !option.isCorrect ? 'border-red-500/50 text-red-400 bg-red-500/10' : ''}
                  ${!isSelected(option.id) ? 'border-white/10 text-[#8888a0] bg-white/[0.03]' : ''}
                `}
              >
                {isSelected(option.id) && option.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isSelected(option.id) && !option.isCorrect ? (
                  <X className="w-4 h-4" />
                ) : (
                  String.fromCharCode(65 + idx)
                )}
              </div>
              <span className={`text-sm font-medium ${getTextStyle(option)}`}>
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && selectedId && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-lg px-4 py-3 border ${
                selectedCorrect
                  ? 'bg-green-500/5 border-green-500/20 text-green-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-300'
              }`}
            >
              <p className="text-sm font-medium">
                {selectedCorrect
                  ? 'Sahi jawab! 🎯 ' + (choice.isCorrect ? choice.feedback : 'Bilkul sahi faisla — smart move!')
                  : choice.feedback}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Generate alternate (wrong) option for a choice */
function getAlternateOption(choice: StoryChoice): string {
  const altMap: Record<string, string> = {
    'iPhone khareedo!': 'Pehle FD karo, baaki baad mein',
    'Pehle FD karo, baaki baad mein': 'iPhone khareedo!',
    'Credit card se luxury buy karo': 'Budget banao aur limit set karo',
    'Budget banao aur limit set karo': 'Credit card se luxury buy karo',
    'Full amount withdraw karo': 'EMI plan banao aur regular pay karo',
    'EMI plan banao aur regular pay karo': 'Full amount withdraw karo',
    'Savings account mein rakhho': 'SIP start karo aur compound benefit lo',
    'SIP start karo aur compound benefit lo': 'Savings account mein rakhho',
    'EMI continue rakho': 'Prepay karke interest bachao',
    'Prepay karke interest bachao': 'EMI continue rakho',
    'Abhi invest karo!': 'Pehle emergency fund banao',
    'Pehle emergency fund banao': 'Abhi invest karo!',
    'Insurance lena bekar hai': 'Term plan zaroori hai — protection first',
    'Term plan zaroori hai — protection first': 'Insurance lena bekar hai',
    'Savings hi kaafi hai': 'Inflation se bachne ke liye invest karo',
    'Inflation se bachne ke liye invest karo': 'Savings hi kaafi hai',
    'Full salary spend kar do — life mein pehli baar hai! 🛍️': 'Pehle 50-30-20 rule lagao, phir spend karo 💰',
    'Pehle 50-30-20 rule lagao, phir spend karo 💰': 'Full salary spend kar do — life mein pehli baar hai! 🛍️',
  };
  // If we have a direct mapping, use it
  if (altMap[choice.text]) return altMap[choice.text];
  // Otherwise, generate a sensible opposite based on isCorrect
  if (choice.isCorrect) {
    return 'Yeh risk bhara hai, soch samajh ke karo ⚠️';
  }
  return 'Sahi lagta hai, par aur socho 🤔';
}

/** Scene card with emoji and narrative */
function SceneCard({ scene, emoji }: { scene: string; emoji: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Emoji with bounce */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 15,
          delay: 0.1,
        }}
        className="mb-4"
      >
        <span className="text-5xl sm:text-6xl block drop-shadow-lg story-emoji-animate">{emoji}</span>
      </motion.div>

      {/* Scene description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="text-[15px] italic leading-relaxed text-[#a0a0b8] max-w-md mx-auto"
      >
        {scene}
      </motion.p>
    </motion.div>
  );
}

/** Story completion screen */
function CompletionScreen({
  story,
  totalXP,
  onQuizPlay,
  onClose,
}: {
  story: ModuleStory;
  totalXP: number;
  onQuizPlay: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 overflow-hidden"
    >
      <CelebrationParticles />

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.2,
        }}
        className="relative z-10 mb-6"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center story-trophy-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)',
            border: '2px solid rgba(245,158,11,0.3)',
            boxShadow: '0 0 40px rgba(245,158,11,0.15)',
          }}
        >
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>
      </motion.div>

      {/* Module complete badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Badge
          className="text-xs font-bold px-4 py-1.5 mb-4 border-amber-500/30 bg-amber-500/15 text-amber-400"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          MODULE COMPLETE!
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-center mb-2"
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {story.storyTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-[#8888a0] text-sm mb-8 text-center"
      >
        {story.storySubtitle}
      </motion.p>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2 mb-8 px-6 py-3 rounded-2xl"
        style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <Zap className="w-5 h-5 text-amber-400" />
        <span className="text-amber-400 font-bold text-lg">{totalXP} XP</span>
        <span className="text-[#8888a0] text-sm">kamaye</span>
      </motion.div>

      {/* Lessons summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm mb-8"
      >
        <p className="text-xs font-semibold text-[#8888a0] uppercase tracking-wider mb-3 text-center">
          Lessons learned
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {story.chapters.map((ch, idx) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.08 }}
              className="flex items-start gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[#a0a0b8] leading-snug">{ch.lesson}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Button
          onClick={onQuizPlay}
          className="flex-1 h-12 text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Quiz Khelo
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 h-12 text-sm font-semibold rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-[#a0a0b8] gap-2"
        >
          Wapas Jao
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function StoryReader({
  story,
  onComplete,
  onClose,
  isModuleCompleted,
  currentProgress,
}: StoryReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readChapters, setReadChapters] = useState<Set<number>>(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showXP, setShowXP] = useState(false);
  const [choiceAnswered, setChoiceAnswered] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chapter = story.chapters[currentChapter];
  const totalChapters = story.chapters.length;
  const progressPercent = (readChapters.size / totalChapters) * 100;

  // Mark chapter as read on view
  useEffect(() => {
    if (!readChapters.has(currentChapter)) {
      const timeout = setTimeout(() => {
        setReadChapters((prev) => new Set([...prev, currentChapter]));
        setTotalXP((prev) => prev + chapter.xpReward);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentChapter, chapter.xpReward, readChapters]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentChapter]);

  // Check if all chapters are read
  useEffect(() => {
    if (readChapters.size === totalChapters && !isComplete) {
      const timeout = setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [readChapters.size, totalChapters, isComplete, onComplete]);

  const handleChoiceAnswer = useCallback(
    (chapterId: string, isCorrect: boolean) => {
      setChoiceAnswered((prev) => ({ ...prev, [chapterId]: true }));
    },
    []
  );

  const canProceed = useCallback(
    (chapterIdx: number) => {
      const ch = story.chapters[chapterIdx];
      if (!ch?.choice) return true;
      return !!choiceAnswered[ch.id];
    },
    [story.chapters, choiceAnswered]
  );

  const goNext = useCallback(() => {
    if (currentChapter < totalChapters - 1 && canProceed(currentChapter)) {
      setDirection(1);
      setCurrentChapter((prev) => prev + 1);
    }
  }, [currentChapter, totalChapters, canProceed]);

  const goPrev = useCallback(() => {
    if (currentChapter > 0) {
      setDirection(-1);
      setCurrentChapter((prev) => prev - 1);
    }
  }, [currentChapter]);

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  // If complete, show completion screen
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-[#8888a0] hover:text-white hover:bg-white/[0.05] rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <CompletionScreen
            story={story}
            totalXP={totalXP}
            onQuizPlay={onClose}
            onClose={onClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col">
      {/* ===== Header ===== */}
      <div
        className="shrink-0 border-b border-white/[0.06] px-4 pt-3 pb-3"
        style={{
          background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-lg mx-auto">
          {/* Top row: close + XP */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 pr-3">
              <h2
                className="text-lg sm:text-xl font-bold truncate"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {story.storyTitle}
              </h2>
              <p className="text-[11px] text-[#8888a0] truncate mt-0.5">
                {story.storySubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* XP counter */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold text-sm">{totalXP}</span>
                <span className="text-amber-400/60 text-[10px]">XP</span>
              </div>
              {/* Close */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-[#8888a0] hover:text-white hover:bg-white/[0.05] rounded-full h-9 w-9"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <Progress
              value={progressPercent}
              className="h-1.5 flex-1 bg-white/[0.06]"
            />
            <span className="text-[10px] text-[#8888a0] font-medium shrink-0">
              {readChapters.size}/{totalChapters}
            </span>
          </div>

          {/* Chapter dots */}
          <div className="mt-2">
            <ProgressDots
              total={totalChapters}
              current={currentChapter}
              readChapters={readChapters}
            />
          </div>
        </div>
      </div>

      {/* ===== Chapter Content ===== */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto story-reader-scroll"
      >
        <div className="max-w-lg mx-auto px-4 py-6 relative">
          {/* Chapter title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5"
          >
            <BookOpen className="w-4 h-4 text-amber-400/60" />
            <span className="text-xs font-medium text-[#8888a0]">
              Chapter {chapter.chapterNumber} of {totalChapters}
            </span>
          </motion.div>

          {/* Animated chapter content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentChapter}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.25 },
              }}
              className="relative"
            >
              {/* Glass morphism card */}
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: 'bg-white/[0.03]',
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Chapter title */}
                <h3 className="text-base sm:text-lg font-bold text-[#e8e8ed] mb-1">
                  {chapter.title}
                </h3>

                {/* XP reward indicator */}
                <div className="flex items-center gap-1.5 mb-5">
                  <Zap className="w-3 h-3 text-amber-400/50" />
                  <span className="text-[10px] text-amber-400/50 font-medium">
                    +{chapter.xpReward} XP
                  </span>
                </div>

                {/* Scene */}
                <SceneCard scene={chapter.scene} emoji={chapter.emoji} />

                {/* Dialogue */}
                <DialogueBubble dialogue={chapter.dialogue} speaker={chapter.speaker} />

                {/* Lesson */}
                <LessonCard lesson={chapter.lesson} />

                {/* Choice */}
                {chapter.choice && (
                  <ChoiceCard
                    choice={chapter.choice}
                    onAnswer={(isCorrect) => handleChoiceAnswer(chapter.id, isCorrect)}
                    answered={!!choiceAnswered[chapter.id]}
                  />
                )}

                {/* XP reward animation anchor */}
                <div className="relative">
                  <XPReward amount={chapter.xpReward} show={showXP} />
                </div>
              </div>

              {/* Chapter index badge */}
              <div className="flex items-center justify-center mt-4 gap-2">
                {story.chapters.map((_, idx) => {
                  const isRead = readChapters.has(idx);
                  const isCurrent = idx === currentChapter;
                  return (
                    <motion.div
                      key={idx}
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full border text-xs font-semibold
                        transition-colors duration-300
                        ${
                          isCurrent
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                            : isRead
                            ? 'border-green-500/20 bg-green-500/5 text-green-400/60'
                            : 'border-white/[0.06] bg-white/[0.02] text-[#6666a0]'
                        }
                      `}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isRead && !isCurrent ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : !isRead && !isCurrent ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        idx + 1
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      <div
        className="shrink-0 border-t border-white/[0.06] px-4 py-3"
        style={{
          background: 'linear-gradient(0deg, rgba(245,158,11,0.03) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Previous */}
          <Button
            onClick={goPrev}
            disabled={currentChapter === 0}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#a0a0b8] gap-1.5 font-semibold text-sm disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sm:inline">Peeche Jao</span>
          </Button>

          {/* Next */}
          <Button
            onClick={goNext}
            disabled={currentChapter === totalChapters - 1 || !canProceed(currentChapter)}
            className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] gap-1.5 font-bold text-sm disabled:opacity-40 disabled:bg-amber-500/50"
          >
            <span className="sm:inline">Aage Badho</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Choice lock hint */}
        {chapter.choice && !canProceed(currentChapter) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[10px] text-amber-400/50 mt-2"
          >
            Pehle apna jawab do, phir aage badho!
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default StoryReader;
