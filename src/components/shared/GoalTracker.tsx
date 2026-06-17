"use client";

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Trash2, Target, TrendingUp, Sparkles, PartyPopper, Zap, IndianRupee,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useAppStore, type Goal } from '@/lib/store/useAppStore';

/* ──────────────────────────────────────────────────────────────
   Props & Types
   ────────────────────────────────────────────────────────────── */
interface GoalTrackerProps {
  open: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────────────────────────────
   Goal Templates — relatable for Indian youth
   ────────────────────────────────────────────────────────────── */
const TEMPLATES = [
  { id: 'bike', label: 'Pehli Bike 🏍️', emoji: '🏍️', target: 80000, color: '#EF4444', hint: 'Roz ₹140 bachao toh 6 mahine mein done! ☕ = 3 chai skip' },
  { id: 'phone', label: 'New Phone 📱', emoji: '📱', target: 25000, color: '#8B5CF6', hint: 'Roz ₹70 bachao toh 1 saal mein naya phone! 🎉' },
  { id: 'trip', label: 'Trip with Friends ✈️', emoji: '✈️', target: 15000, color: '#10B981', hint: 'Roz ₹50 bachao toh 10 mahine mein Goa trip ready! 🏖️' },
  { id: 'emergency', label: 'Emergency Fund 🛡️', emoji: '🛡️', target: 30000, color: '#F59E0B', hint: '3 mahine ka kharcha cover karo. Roz ₹100 = 10 mahine!' },
  { id: 'laptop', label: 'Naya Laptop 💻', emoji: '💻', target: 55000, color: '#06B6D4', hint: 'Freelance karo, ₹5000/mahine bachao — 11 mahine mein ho jayega!' },
  { id: 'custom', label: 'Custom Goal ✏️', emoji: '🎯', target: 5000, color: '#EC4899', hint: 'Apna goal banao — chhota ya bada, bas shuru karo!' },
] as const;

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function generateId(): string {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function getProgress(saved: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((saved / target) * 100));
}

function daysRemaining(deadline: string): number {
  if (!deadline) return 0;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((d.getTime() - today.getTime()) / 86400000));
}

function dailySuggestion(saved: number, target: number, deadline: string): number {
  const remaining = Math.max(0, target - saved);
  const days = daysRemaining(deadline);
  if (remaining <= 0 || days <= 0) return 0;
  return Math.ceil(remaining / days);
}

function motivationalQuote(pct: number): string {
  if (pct >= 100) return 'GOAL COMPLETE! Tumne kar dikhaya! 🎉🏆';
  if (pct >= 75) return 'Almost there! Bas thoda aur! 🏁';
  if (pct >= 50) return 'Aadha rasta cross kar liya! 🔥';
  if (pct >= 25) return 'Progress dekh ke motivation aata hai! 💪';
  return 'Shuruwaat sabse mushkil hoti hai, par zaroori! 🌱';
}

/* ──────────────────────────────────────────────────────────────
   Circular Progress Ring — emerald fill
   ────────────────────────────────────────────────────────────── */
function CircularProgress({ percent, size = 96, color = '#10B981' }: { percent: number; size?: number; color?: string }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <defs>
        <linearGradient id={`ring-${color.slice(1)}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={`url(#ring-${color.slice(1)})`} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (percent / 100) * c }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Confetti burst
   ────────────────────────────────────────────────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Goal Card
   ────────────────────────────────────────────────────────────── */
function GoalCard({
  goal, onAdd, onDelete,
}: {
  goal: Goal;
  onAdd: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const pct = getProgress(goal.saved, goal.target);
  const remaining = Math.max(0, goal.target - goal.saved);
  const daily = dailySuggestion(goal.saved, goal.target, goal.deadline);
  const isComplete = pct >= 100;

  const handleAdd = useCallback(() => {
    const n = parseInt(amount, 10);
    if (!n || n <= 0) return;
    onAdd(goal.id, n);
    setAmount('');
    setShowAdd(false);
  }, [amount, goal.id, onAdd]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative card-3d glass-card rounded-2xl p-5 overflow-hidden"
    >
      {isComplete && <ConfettiBurst />}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ backgroundColor: goal.category }} />

      <div className="relative flex items-start gap-4">
        {/* Progress ring with emoji in center */}
        <div className="relative flex-shrink-0">
          <CircularProgress percent={pct} size={96} color={goal.category} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">{goal.emoji}</span>
          </div>
        </div>

        {/* Goal info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-white truncate">{goal.name}</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Target: <span className="font-bold text-white">{formatINR(goal.target)}</span>
              </p>
            </div>
            <button
              onClick={() => onDelete(goal.id)}
              className="text-ink-muted hover:text-red-400 transition-colors p-1"
              aria-label="Delete goal"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold" style={{ color: goal.category }}>
              {formatINR(goal.saved)}
            </span>
            <span className="text-xs text-ink-muted">
              / {formatINR(goal.target)} · {pct}%
            </span>
          </div>

          {!isComplete ? (
            <>
              <p className="text-xs text-ink-muted mt-1">
                {formatINR(remaining)} baaki hai
              </p>
              {daily > 0 && (
                <p className="text-[11px] text-emerald-soft mt-1 font-semibold">
                  💡 Roz ₹{daily} bachao toh {daysRemaining(goal.deadline)} din mein done!
                </p>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30"
            >
              <PartyPopper size={12} className="text-gold-soft" />
              <span className="text-[11px] font-bold text-gold-soft">Goal Achieved! 🎉</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add savings row */}
      {!isComplete && (
        <div className="relative mt-4">
          <AnimatePresence>
            {showAdd ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="pl-8 bg-white/5 border-white/10 text-white"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleAdd}
                  className="btn-3d rounded-xl px-4 py-2 text-xs font-bold text-midnight"
                  style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-ink-muted bg-white/5 hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAdd(true)}
                className="w-full rounded-xl py-2.5 text-xs font-bold text-emerald-soft bg-emerald/10 border border-emerald/20 hover:bg-emerald/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Savings Add Karein
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Add Goal Modal
   ────────────────────────────────────────────────────────────── */
function AddGoalModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (goal: Goal) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[number] | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const reset = () => {
    setSelectedTemplate(null);
    setName('');
    setTarget('');
    setDeadline('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedTemplate) return;
    const finalName = name.trim() || selectedTemplate.label.replace(/^[^ ]+ /, '');
    const finalTarget = parseInt(target, 10) || selectedTemplate.target;
    onAdd({
      id: generateId(),
      name: finalName,
      target: finalTarget,
      saved: 0,
      deadline: deadline || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category: selectedTemplate.color,
      emoji: selectedTemplate.emoji,
      createdAt: new Date().toISOString().split('T')[0],
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-md">
        <DialogTitle className="font-display text-xl font-extrabold text-white">
          Naya Goal Banao 🎯
        </DialogTitle>
        <DialogDescription className="text-ink-muted">
          Pre-built templates ya apna custom goal choose karo!
        </DialogDescription>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TEMPLATES.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSelectedTemplate(t);
                if (!name) setName(t.label.replace(/^[^ ]+ /, ''));
                if (!target) setTarget(String(t.target));
              }}
              className={`relative text-left rounded-xl p-3 border transition-all ${
                selectedTemplate?.id === t.id
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
              style={selectedTemplate?.id === t.id ? { boxShadow: `0 0 0 2px ${t.color}80` } : {}}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className="text-xs font-bold text-white">{t.label}</div>
              <div className="text-[10px] text-ink-muted mt-0.5">~{formatINR(t.target)}</div>
            </motion.button>
          ))}
        </div>

        {/* Selected template hint */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-3 bg-emerald/5 border border-emerald/20"
          >
            <p className="text-[11px] text-emerald-soft font-semibold">💡 {selectedTemplate.hint}</p>
          </motion.div>
        )}

        {/* Custom fields */}
        {selectedTemplate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Goal Ka Naam</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jaise: Goa Trip"
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Target ₹</label>
                <Input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="15000"
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Deadline</label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-ink-muted bg-white/5 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTemplate}
            className="flex-1 btn-3d rounded-xl py-2.5 text-sm font-bold text-midnight disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}
          >
            Goal Set Karo! 🚀
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────────────────────── */
export function GoalTracker({ open, onClose }: GoalTrackerProps) {
  const { goals, addGoal, updateGoalSaved, deleteGoal } = useAppStore();
  const [addOpen, setAddOpen] = useState(false);

  const activeGoals = useMemo(() => goals.filter((g) => g.saved < g.target), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.saved >= g.target), [goals]);

  const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-midnight border-white/10 max-w-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-white/10 glass-card-premium">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald/15 blur-3xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-muted"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <Target size={22} className="text-midnight" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-white">Goal Tracker 🎯</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Sapne reality banao — ek goal at a time! 💚
              </p>
            </div>
          </div>

          {/* Summary strip */}
          {goals.length > 0 && (
            <div className="relative mt-4 flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Total Saved</p>
                <p className="font-display text-lg font-extrabold text-emerald-soft">{formatINR(totalSaved)}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Total Target</p>
                <p className="font-display text-lg font-extrabold text-white">{formatINR(totalTarget)}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Progress</p>
                <p className="font-display text-lg font-extrabold text-gold-soft">
                  {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Body — scrollable */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl mb-3"
              >
                🎯
              </motion.div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Koi goal nahi hai!</h3>
              <p className="text-sm text-ink-muted mb-4">Apna pehla financial goal set karo aur achievement ka maza lo! 🚀</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Active Goals */}
              {activeGoals.length > 0 && (
                <>
                  <p className="text-xs font-bold text-ink-muted uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} className="text-emerald-soft" /> Active Goals ({activeGoals.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {activeGoals.map((g) => (
                        <GoalCard key={g.id} goal={g} onAdd={updateGoalSaved} onDelete={deleteGoal} />
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* Completed Goals */}
              {completedGoals.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs font-bold text-gold-soft uppercase tracking-widest flex items-center gap-2 mb-3">
                    <PartyPopper size={12} /> Achieved Goals ({completedGoals.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {completedGoals.map((g) => (
                        <GoalCard key={g.id} goal={g} onAdd={updateGoalSaved} onDelete={deleteGoal} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAB-style Add button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddOpen(true)}
          className="btn-3d absolute bottom-5 right-5 rounded-2xl px-5 py-3 font-bold text-sm text-midnight flex items-center gap-2 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
        >
          <Plus size={18} /> Naya Goal
        </motion.button>

        <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addGoal} />
      </DialogContent>
    </Dialog>
  );
}
