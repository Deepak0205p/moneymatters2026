'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Target, Plus, Trash2, Coins, TrendingUp, Clock, Calendar,
  ChevronDown, ChevronUp, Sparkles, AlertTriangle, CheckCircle2,
  PartyPopper, Zap, IndianRupee, Filter, ArrowUpDown, Rocket,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAppStore, type Goal } from '@/lib/store/useAppStore';
import { formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { value: 'emergency', label: 'Emergency Fund', emoji: '🛡️', color: '#ef4444' },
  { value: 'gadget', label: 'Gadget', emoji: '📱', color: '#8b5cf6' },
  { value: 'travel', label: 'Travel', emoji: '✈️', color: '#3b82f6' },
  { value: 'education', label: 'Education', emoji: '📚', color: '#22c55e' },
  { value: 'investment', label: 'Investment', emoji: '📈', color: '#f59e0b' },
  { value: 'other', label: 'Other', emoji: '🎯', color: '#ec4899' },
];

const GOAL_TEMPLATES = [
  { name: 'Emergency Fund - 6 mahine ka kharcha', target: 180000, category: 'emergency', emoji: '🛡️' },
  { name: 'Naya Phone', target: 25000, category: 'gadget', emoji: '📱' },
  { name: 'Goa Trip', target: 40000, category: 'travel', emoji: '✈️' },
  { name: 'SIP Start', target: 50000, category: 'investment', emoji: '📈' },
  { name: 'Diwali Shopping', target: 15000, category: 'other', emoji: '🪔' },
];

const MOTIVATIONAL_QUOTES = [
  { min: 0, max: 25, quotes: [
    'Shuruwaat sabse mushkil hoti hai, lekin sabse zaroori bhi! 💪',
    'Chhota padhav badi udaan ka pehla kadam hai! 🐥',
    'Har bada goal chhoti savings se hi poora hota hai! 🌱',
  ]},
  { min: 25, max: 50, quotes: [
    'Aadha rasta cross kar liya! Ab rukna mana hai! 🏃',
    'Progress dekh ke motivation aata hai — aage badho! 🔥',
    'Paisa ek-ek rupee se banta hai, tum sahi track pe ho! 💰',
  ]},
  { min: 50, max: 75, quotes: [
    'More than halfway there! Ab turnaround nahi rukna! 🚀',
    'Bahuut kareeb aa gaye ho, thoda aur mehnat karo! ⚡',
    'Goal dikh raha hai, bus thoda aur push karo! 🎯',
  ]},
  { min: 75, max: 100, quotes: [
    'Almost there! Bus thoda sa aur! 🏁',
    'Finish line dikh rahi hai! Full speed ahead! 🏎️',
    'Zindagi mein aisi momentum nahi aati, make it count! 🌟',
  ]},
  { min: 100, max: 101, quotes: [
    'GOAL COMPLETE! Tumne kar dikhaya! 🎉🏆',
    'Mission accomplished! Ab celebrate karo! 🥳🎊',
    'King/Queen of savings! Kamaal kar diya! 👑',
  ]},
];

type SortOption = 'deadline' | 'progress' | 'amount';
type FilterOption = 'all' | string;

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */
function generateId(): string {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getProgress(saved: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((saved / target) * 100));
}

function getDaysRemaining(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getTimeColor(deadline: string): string {
  const days = getDaysRemaining(deadline);
  if (days < 0) return '#ef4444'; // Overdue - red
  if (days <= 30) return '#f59e0b'; // Urgent - amber
  if (days <= 90) return '#eab308'; // Warning - yellow
  return '#22c55e'; // Plenty of time - green
}

function getTimeLabel(deadline: string): string {
  const days = getDaysRemaining(deadline);
  if (days < 0) return `${Math.abs(days)} din late!`;
  if (days === 0) return 'Aaj deadline hai!';
  if (days === 1) return '1 din bacha hai';
  if (days <= 7) return `${days} din bacha hai`;
  if (days <= 30) return `${Math.ceil(days / 7)} hafta bacha hai`;
  if (days <= 365) return `${Math.ceil(days / 30)} mahina bacha hai`;
  return `${Math.ceil(days / 365)} saal bacha hai`;
}

function getMotivationalQuote(progress: number): string {
  const bracket = MOTIVATIONAL_QUOTES.find(b => progress >= b.min && progress < b.max)
    || MOTIVATIONAL_QUOTES[MOTIVATIONAL_QUOTES.length - 1];
  return bracket.quotes[Math.floor(Math.random() * bracket.quotes.length)];
}

function getMonthlyProjection(saved: number, target: number, deadline: string): string {
  const remaining = target - saved;
  if (remaining <= 0) return 'Goal already poora ho gaya! 🎉';
  const days = getDaysRemaining(deadline);
  if (days <= 0) return 'Deadline guzar chuki hai! Ab bhi save karo!';
  const months = Math.max(1, Math.ceil(days / 30));
  const monthly = Math.ceil(remaining / months);
  const deadlineDate = new Date(deadline);
  const dateStr = deadlineDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  return `Agar tum ₹${monthly.toLocaleString('en-IN')}/mahina save karte ho, toh ${dateStr} tak goal poora hoga!`;
}

function getCategoryInfo(categoryValue: string) {
  return CATEGORIES.find(c => c.value === categoryValue) || CATEGORIES[5];
}

/* ------------------------------------------------------------------ */
/*  Progress Ring SVG Component                                        */
/* ------------------------------------------------------------------ */
function GoalProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  color = '#f59e0b',
  showMilestones = false,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showMilestones?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const milestones = showMilestones ? [25, 50, 75, 100] : [];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        {/* Milestone marks */}
        {milestones.map((m) => {
          const angle = (m / 100) * 360;
          const rad = (angle * Math.PI) / 180;
          const mx = size / 2 + radius * Math.cos(rad);
          const my = size / 2 + radius * Math.sin(rad);
          const achieved = clampedProgress >= m;
          return (
            <circle
              key={m}
              cx={mx}
              cy={my}
              r={3.5}
              fill={achieved ? '#22c55e' : 'rgba(255,255,255,0.1)'}
              className="rotate-90"
              style={{ transformOrigin: `${mx}px ${my}px` }}
            />
          );
        })}
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`goalGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#goalGrad-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-lg font-extrabold text-white"
          style={{ lineHeight: 1 }}
          key={Math.round(clampedProgress)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(clampedProgress)}%
        </motion.span>
        {clampedProgress >= 100 && (
          <span className="text-[10px] text-green-400 font-semibold mt-0.5">COMPLETE! 🎉</span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti Component                                                 */
/* ------------------------------------------------------------------ */
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#fbbf24', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7'];
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 300,
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Goal Form                                                   */
/* ------------------------------------------------------------------ */
function CreateGoalForm({ onGoalCreated }: { onGoalCreated: () => void }) {
  const { addGoal } = useAppStore();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('other');
  const [emoji, setEmoji] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !target || Number(target) <= 0) return;
    const newGoal: Goal = {
      id: generateId(),
      name: name.trim(),
      target: Number(target),
      saved: Number(saved) || 0,
      deadline: deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category,
      emoji: emoji || getCategoryInfo(category).emoji,
      createdAt: new Date().toISOString(),
    };
    addGoal(newGoal);
    onGoalCreated();
  };

  const applyTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
    setName(template.name);
    setTarget(String(template.target));
    setCategory(template.category);
    setEmoji(template.emoji);
    setShowTemplates(false);
  };

  return (
    <div className="space-y-4">
      {/* Template buttons */}
      <div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span className="font-semibold">Quick Templates</span>
          {showTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-2">
                {GOAL_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#c0c0d0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5 transition-all"
                  >
                    <span>{template.emoji}</span>
                    <span>{template.name}</span>
                    <span className="text-[#8888a0]">₹{(template.target / 1000).toFixed(0)}K</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Goal name */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8888a0] font-medium">Goal ka naam</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Goa Trip, Naya Laptop..."
          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#555] h-10 text-sm"
        />
      </div>

      {/* Target + Saved amount row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-[#8888a0] font-medium">Target Amount (₹)</label>
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="50000"
            min={1}
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#555] h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#8888a0] font-medium">Already Saved (₹)</label>
          <Input
            type="number"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            placeholder="0"
            min={0}
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#555] h-10 text-sm"
          />
        </div>
      </div>

      {/* Deadline + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-[#8888a0] font-medium">Deadline</label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-white/[0.04] border-white/[0.08] text-white h-10 text-sm [color-scheme:dark]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#8888a0] font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white h-10 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-white focus:bg-white/[0.06] focus:text-white">
                  <span className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Optional emoji */}
      <div className="space-y-1.5">
        <label className="text-xs text-[#8888a0] font-medium">Custom Emoji (optional)</label>
        <Input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder={getCategoryInfo(category).emoji}
          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#555] h-10 text-sm w-24"
          maxLength={2}
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!name.trim() || !target || Number(target) <= 0}
        className="w-full btn-gold text-sm font-bold h-10"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Goal Banao!
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Goal Card Component                                                */
/* ------------------------------------------------------------------ */
function GoalCard({
  goal,
  onAddSavings,
  onDelete,
}: {
  goal: Goal;
  onAddSavings: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const progress = getProgress(goal.saved, goal.target);
  const catInfo = getCategoryInfo(goal.category);
  const timeColor = getTimeColor(goal.deadline);
  const isComplete = progress >= 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`card-dark overflow-hidden ${isComplete ? 'glow-green' : ''}`}
    >
      {/* Main card content */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        aria-expanded={expanded}
        aria-label={`${goal.name} — ${progress}% complete`}
      >
        {/* Progress ring */}
        <div className="shrink-0">
          <GoalProgressRing progress={progress} size={72} strokeWidth={6} color={catInfo.color} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{goal.emoji || catInfo.emoji}</span>
            <h3 className="text-sm font-bold text-white truncate">{goal.name}</h3>
          </div>

          {/* Amount progress bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-amber-400 font-semibold">
                ₹{goal.saved.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-[#8888a0]">
                ₹{goal.target.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className="text-[9px] font-medium px-1.5 py-0 h-5"
              style={{ backgroundColor: `${catInfo.color}20`, color: catInfo.color, borderColor: `${catInfo.color}30` }}
            >
              {catInfo.label}
            </Badge>
            <span
              className="text-[10px] font-medium flex items-center gap-1"
              style={{ color: timeColor }}
            >
              <Clock className="w-3 h-3" />
              {getTimeLabel(goal.deadline)}
            </span>
          </div>
        </div>

        {/* Expand/collapse chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#8888a0] shrink-0 mt-1"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-white/[0.06] pt-4">
              {/* Large progress ring with milestones */}
              <div className="flex items-center justify-center">
                <GoalProgressRing
                  progress={progress}
                  size={140}
                  strokeWidth={10}
                  color={catInfo.color}
                  showMilestones
                />
              </div>

              {/* Milestone markers */}
              <div className="flex items-center justify-between px-4">
                {[25, 50, 75, 100].map((m) => {
                  const achieved = progress >= m;
                  return (
                    <div key={m} className="flex flex-col items-center gap-1">
                      <motion.div
                        initial={achieved ? { scale: 0 } : {}}
                        animate={achieved ? { scale: 1 } : {}}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        {achieved ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/[0.1]" />
                        )}
                      </motion.div>
                      <span className={`text-[9px] font-medium ${achieved ? 'text-green-400' : 'text-[#555]'}`}>
                        {m}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Time remaining detail */}
              <div
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ backgroundColor: `${timeColor}10`, border: `1px solid ${timeColor}20` }}
              >
                <Clock className="w-5 h-5 shrink-0" style={{ color: timeColor }} />
                <div>
                  <div className="text-xs font-semibold text-white">{getTimeLabel(goal.deadline)}</div>
                  <div className="text-[10px] text-[#8888a0]">
                    Deadline: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Monthly projection */}
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    {getMonthlyProjection(goal.saved, goal.target, goal.deadline)}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {!isComplete && (
                  <Button
                    onClick={(e) => { e.stopPropagation(); onAddSavings(goal); }}
                    className="flex-1 btn-gold text-xs font-bold h-9"
                  >
                    <Coins className="w-3.5 h-3.5 mr-1.5" />
                    Savings Jodo (+5 🪙)
                  </Button>
                )}
                <Button
                  onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
                  variant="ghost"
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 h-9 px-3"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Savings Dialog                                                 */
/* ------------------------------------------------------------------ */
function AddSavingsDialog({
  open,
  goal,
  onClose,
}: {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
}) {
  const { updateGoalSaved, addCoins, addBadge } = useAppStore();
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!goal || !amount || Number(amount) <= 0) return;
    const addAmount = Number(amount);
    const wasComplete = goal.saved >= goal.target;
    const willBeComplete = goal.saved + addAmount >= goal.target;

    updateGoalSaved(goal.id, addAmount);

    // Award 5 coins for adding savings
    addCoins(5);

    // Award 25 coins and badge if goal just completed
    if (!wasComplete && willBeComplete) {
      addCoins(25);
      addBadge('goal-complete');
    }

    setAmount('');
    onClose();
  };

  if (!goal) return null;

  const remaining = goal.target - goal.saved;
  const progress = getProgress(goal.saved, goal.target);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#12121a] border-white/[0.08] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-gradient-gold text-base">
            {goal.emoji} Savings Jodo
          </DialogTitle>
          <DialogDescription className="text-[#8888a0] text-xs">
            {goal.name} mein savings add karo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Current status */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8888a0]">Current Progress</span>
              <span className="text-xs text-amber-400 font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 progress-gold" />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-amber-400">₹{goal.saved.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-[#8888a0]">₹{goal.target.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#8888a0] font-medium">Kitne ₹ add karna hai?</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min={1}
              max={remaining > 0 ? remaining : undefined}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-[#555] h-10 text-sm"
            />
            {remaining > 0 && (
              <p className="text-[10px] text-[#8888a0]">
                ₹{remaining.toLocaleString('en-IN')} aur chahiye goal poora karne ke liye
              </p>
            )}
          </div>

          {/* Quick amount buttons */}
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 2000, 5000].map((qAmt) => (
              <button
                key={qAmt}
                onClick={() => setAmount(String(qAmt))}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#8888a0] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-400/5 transition-all"
              >
                ₹{qAmt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Reward info */}
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-2.5 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[10px] text-amber-200/80">
              Savings add karne pe 5 coins milenge! Goal complete hone pe 25 coins + badge! 🎉
            </span>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!amount || Number(amount) <= 0}
            className="w-full btn-gold text-sm font-bold h-10"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            ₹{amount ? Number(amount).toLocaleString('en-IN') : '0'} Jodo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation                                                */
/* ------------------------------------------------------------------ */
function DeleteConfirmDialog({
  open,
  goalName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  goalName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#12121a] border-white/[0.08] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-400 text-base">Delete Goal?</DialogTitle>
          <DialogDescription className="text-[#8888a0] text-xs">
            Kya tum &quot;{goalName}&quot; goal delete karna chahte ho? Ye wapas nahi aayega!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-sm font-bold h-9"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete Karo
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 text-[#8888a0] hover:text-white hover:bg-white/[0.06] text-sm h-9"
          >
            Ruko, Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Main GoalTracker Component                                         */
/* ------------------------------------------------------------------ */
interface GoalTrackerProps {
  open: boolean;
  onClose: () => void;
}

export function GoalTracker({ open, onClose }: GoalTrackerProps) {
  const { goals, deleteGoal } = useAppStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [addSavingsGoal, setAddSavingsGoal] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevCompleteRef = useRef<Set<string>>(new Set());

  // Prevent body scroll when dialog open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Track goal completions for confetti — use setTimeout to avoid cascading renders
  useEffect(() => {
    if (!open) return;
    const currentComplete = new Set(goals.filter(g => g.saved >= g.target).map(g => g.id));
    // Check if any goal just completed (wasn't complete before but is now)
    const newlyComplete = [...currentComplete].filter(id => !prevCompleteRef.current.has(id));
    if (newlyComplete.length > 0 && prevCompleteRef.current.size > 0) {
      const t1 = setTimeout(() => setShowConfetti(true), 0);
      const t2 = setTimeout(() => setShowConfetti(false), 4000);
      prevCompleteRef.current = currentComplete;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevCompleteRef.current = currentComplete;
  }, [goals, open]);

  // Computed stats
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    const completedGoals = goals.filter(g => g.saved >= g.target).length;
    return { totalGoals, totalSaved, totalTarget, overallProgress, completedGoals };
  }, [goals]);

  // Filter and sort
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filter
    if (filterBy !== 'all') {
      result = result.filter(g => g.category === filterBy);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'progress':
          return getProgress(b.saved, b.target) - getProgress(a.saved, a.target);
        case 'amount':
          return b.target - a.target;
        default:
          return 0;
      }
    });

    return result;
  }, [goals, sortBy, filterBy]);

  // Motivational quote based on overall progress
  const motivationalQuote = useMemo(() => {
    return getMotivationalQuote(stats.overallProgress);
  }, [stats.overallProgress]);

  const handleDeleteGoal = useCallback((id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setDeleteTarget({ id, name: goal.name });
    }
  }, [goals]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteGoal(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteGoal]);

  const handleCreateGoal = useCallback(() => {
    setShowCreateForm(false);
  }, []);

  return (
    <>
      <Confetti active={showConfetti} />

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
              className="fixed inset-x-3 top-[3vh] bottom-[3vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            >
              {/* ── Header ── */}
              <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Goal Tracker</h2>
                      <p className="text-[11px] text-[#8888a0] leading-tight">
                        Apne financial goals set karo aur track karo!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close Goal Tracker"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Content ── */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Goals', value: String(stats.totalGoals), icon: Target, color: '#f59e0b' },
                    { label: 'Total Saved', value: `₹${formatCurrency(stats.totalSaved, false)}`, icon: IndianRupee, color: '#22c55e' },
                    { label: 'Total Target', value: `₹${formatCurrency(stats.totalTarget, false)}`, icon: Rocket, color: '#8b5cf6' },
                    { label: 'Overall Progress', value: `${stats.overallProgress}%`, icon: TrendingUp, color: '#ec4899' },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      className="stat-card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.color }} />
                      <div className="text-sm font-extrabold text-white">{stat.value}</div>
                      <div className="text-[9px] text-[#8888a0] mt-0.5">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* ── Motivational Quote ── */}
                <motion.div
                  className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 px-4 py-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/90 leading-relaxed">{motivationalQuote}</p>
                  </div>
                </motion.div>

                {/* ── Create Goal Section ── */}
                <div>
                  <AnimatePresence mode="wait">
                    {!showCreateForm ? (
                      <motion.button
                        key="add-btn"
                        onClick={() => setShowCreateForm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-amber-500/20 text-amber-400 hover:border-amber-500/40 hover:bg-amber-400/5 transition-all"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-sm font-bold">Naya Goal Banao</span>
                      </motion.button>
                    ) : (
                      <motion.div
                        key="create-form"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="card-dark p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-white">Naya Goal</h3>
                          <button
                            onClick={() => setShowCreateForm(false)}
                            className="p-1.5 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <CreateGoalForm onGoalCreated={handleCreateGoal} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Filter & Sort Bar ── */}
                {goals.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#8888a0]" />
                      <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
                        <SelectTrigger className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-white w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
                          <SelectItem value="all" className="text-white focus:bg-white/[0.06] focus:text-white">All Categories</SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value} className="text-white focus:bg-white/[0.06] focus:text-white">
                              {cat.emoji} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#8888a0]" />
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <SelectTrigger className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-white w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-white/[0.08]">
                          <SelectItem value="deadline" className="text-white focus:bg-white/[0.06] focus:text-white">Deadline</SelectItem>
                          <SelectItem value="progress" className="text-white focus:bg-white/[0.06] focus:text-white">Progress</SelectItem>
                          <SelectItem value="amount" className="text-white focus:bg-white/[0.06] focus:text-white">Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {stats.completedGoals > 0 && (
                      <Badge className="text-[9px] bg-green-500/15 text-green-400 border-green-500/20 px-1.5 h-5">
                        {stats.completedGoals} Complete ✓
                      </Badge>
                    )}
                  </div>
                )}

                {/* ── Goal Cards Grid ── */}
                {filteredGoals.length > 0 ? (
                  <motion.div
                    className="grid gap-3 sm:grid-cols-2"
                    layout
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredGoals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onAddSavings={setAddSavingsGoal}
                          onDelete={handleDeleteGoal}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : goals.length > 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-[#8888a0] mx-auto mb-2" />
                    <p className="text-sm text-[#8888a0]">Is category mein koi goal nahi hai</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-amber-400/50" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Koi Goal Nahi Hai</h3>
                    <p className="text-xs text-[#8888a0] mb-4 max-w-xs mx-auto">
                      Apna pehla financial goal banao aur savings track karna shuru karo! Goals set karne se motivation aata hai.
                    </p>
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="btn-gold text-xs font-bold h-9"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Pehla Goal Banao
                    </Button>
                  </div>
                )}
              </div>

              {/* ── Footer ── */}
              <div className="shrink-0 px-5 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/50">
                <p className="text-[10px] text-[#555] text-center">
                  Goals save hote rehte hain — kahi bhi access karo! Savings add karne pe 5 coins milte hain. 🪙
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Savings Dialog */}
      <AddSavingsDialog
        open={!!addSavingsGoal}
        goal={addSavingsGoal}
        onClose={() => setAddSavingsGoal(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        goalName={deleteTarget?.name || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
