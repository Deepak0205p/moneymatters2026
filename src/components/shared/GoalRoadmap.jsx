'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  X, Target, IndianRupee, Zap, Shield, Trophy, Rocket,
  Mountain, Calendar, CheckCircle2, AlertTriangle, Star,
  Flame, ChevronRight, ArrowLeft, Clock, TrendingUp,
  Loader2, Sparkles, Brain, ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

// ─── Difficulty Badge ──────────────────────────────────────────
function DiffBadge({ level }) {
  const map = {
    '🌱 Starter': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    '🔥 Hustler': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
    '💎 Crusher': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    '🏆 Legend': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  };
  const d = map[level] || map['🌱 Starter'];
  return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${d.bg} border ${d.border} ${d.text}`}>{level}</span>;
}

// ─── Month Group Card ──────────────────────────────────────────
function MonthGroupCard({ group, index, totalSaved, isCompleted, isCurrent, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const progress = totalSaved >= group.cumulativeTarget ? 100 : Math.min(100, (totalSaved / group.cumulativeTarget) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer p-5 sm:p-6 rounded-3xl border transition-all duration-300 overflow-hidden ${
        isCompleted
          ? 'bg-gradient-to-br from-emerald-500/8 to-emerald-500/3 border-emerald-500/25'
          : isCurrent
            ? 'bg-gradient-to-br from-amber-500/8 to-amber-500/3 border-amber-500/25 shadow-lg shadow-amber-500/10'
            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
      }`}
    >
      {/* Glow */}
      {(isCompleted || isCurrent) && (
        <div className={`absolute -inset-px rounded-3xl blur-xl pointer-events-none ${isCompleted ? 'bg-emerald-500/8' : 'bg-amber-500/5'}`} />
      )}

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl ${
                isCompleted ? 'bg-emerald-500/15 border border-emerald-500/25'
                  : isCurrent ? 'bg-amber-500/15 border border-amber-500/25'
                    : 'bg-white/5 border border-white/10'
              }`}
            >
              {group.emoji}
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">{group.monthRange}</span>
                <DiffBadge level={group.difficulty} />
              </div>
              <h3 className={`font-extrabold text-base sm:text-lg leading-tight ${
                isCompleted ? 'text-emerald-300' : isCurrent ? 'text-amber-300' : 'text-white'
              }`}>
                {group.title}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">{group.subtitle}</p>
            </div>
          </div>

          {isCompleted ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
          ) : (
            <ChevronRight size={18} className={`mt-1 ${isCurrent ? 'text-amber-400' : 'text-zinc-600'}`} />
          )}
        </div>

        {/* Overview */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{group.overview}</p>

        {/* Target + Progress */}
        <div className="mb-3 p-3 rounded-2xl bg-black/20 border border-white/[0.04]">
          <div className="flex justify-between text-[10px] font-bold mb-1.5">
            <span className="text-zinc-500">Target: ₹{(group.targetSavings || 0).toLocaleString('en-IN')}</span>
            <span style={{ color: progress >= 100 ? '#10B981' : '#F59E0B' }}>{Math.round(progress)}% done</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              className="h-full rounded-full"
              style={{ background: isCompleted ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #F59E0B, #FBBF24)' }}
            />
          </div>
        </div>

        {/* Key habit + what to avoid */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <Flame size={11} className="text-emerald-400 shrink-0" />
            <span className="text-[10px] font-bold text-emerald-300 truncate">{group.keyHabit}</span>
          </div>
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
            <AlertTriangle size={11} className="text-red-400 shrink-0" />
            <span className="text-[10px] font-bold text-red-300/70 truncate">{group.whatToAvoid}</span>
          </div>
        </div>

        {/* Motivation */}
        <p className="mt-3 text-[10px] text-amber-400/60 italic text-center">{group.motivation}</p>

        {/* Click hint */}
        {isCurrent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center"
          >
            <span className="text-[10px] font-bold text-amber-400/80 flex items-center justify-center gap-1">
              Tap to view detailed plan <ChevronRight size={10} />
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Week Card (inside month detail) ──────────────────────────
function WeekCard({ week, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-xs font-black text-emerald-400">W{week.week}</span>
          </div>
          <h4 className="text-xs font-bold text-white">{week.title}</h4>
        </div>
        <span className="text-[9px] text-zinc-500 font-bold">₹{(week.savingsTarget || 0).toLocaleString('en-IN')}</span>
      </div>

      <div className="space-y-1.5">
        {week.actions?.map((a, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400">
            <ChevronRight size={10} className="text-emerald-400 mt-0.5 shrink-0" />
            <span>{a}</span>
          </div>
        ))}
      </div>

      {week.keyMilestone && (
        <div className="flex items-center gap-2 text-[10px]">
          <Target size={10} className="text-amber-400" />
          <span className="text-amber-300 font-bold">{week.keyMilestone}</span>
        </div>
      )}

      {week.pitfall && (
        <div className="flex items-center gap-2 text-[10px] text-red-400/60">
          <AlertTriangle size={10} />
          <span>{week.pitfall}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Daily Action Row (inside month detail) ──────────────────
function DailyRow({ action, index }) {
  const diffColors = {
    easy: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    hard: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
    extreme: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  };
  const d = diffColors[action.difficulty] || diffColors.easy;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06 }}
      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.03] transition-all"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.bg} border ${d.border}`}>
        <span className="text-[10px] font-black text-white">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-white">{action.action}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[9px] text-zinc-500">{action.savings}</span>
          {action.bestTime && <span className="text-[9px] text-zinc-600">⏰ {action.bestTime}</span>}
          {action.whyItWorks && <span className="text-[9px] text-emerald-500/50">💡 {action.whyItWorks}</span>}
        </div>
        {action.streakTip && (
          <p className="text-[9px] text-zinc-600 mt-1">🔥 Streak: {action.streakTip}</p>
        )}
        {action.ifYouSkip && (
          <p className="text-[9px] text-red-400/50 mt-0.5">⚠️ Skip: {action.ifYouSkip}</p>
        )}
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${d.bg} border ${d.border} ${d.text} flex-shrink-0`}>
        {action.difficulty}
      </span>
    </motion.div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────
function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.015]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
        <span className="flex items-center gap-2 text-xs font-bold text-white"><Icon size={14} className="text-emerald-400" />{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={14} className="text-zinc-500" /></motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function GoalRoadmap({ goal, open, onClose }) {
  const { coins, completedModules, streak } = useAppStore();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drill-down state
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [monthDetail, setMonthDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch overview
  useEffect(() => {
    if (!open || !goal) return;
    if (goal.roadmap) { setRoadmap(goal.roadmap); return; }

    const generate = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch('/api/goal-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: { name: goal.name, target: goal.target, saved: goal.saved || 0, deadline: goal.deadline, category: goal.category, emoji: goal.emoji },
            userContext: { coins, completedModules, streak }
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setRoadmap(data.roadmap);
        toast({ title: "Roadmap Ready! 🗺️" });
      } catch (err) {
        setError(err.message);
        toast({ title: "Error ⚠️", variant: "destructive" });
      } finally { setLoading(false); }
    };
    generate();
  }, [open, goal, coins, completedModules, streak]);

  // Fetch month detail
  const fetchMonthDetail = async (group) => {
    setSelectedGroup(group);
    setDetailLoading(true);
    setMonthDetail(null);
    try {
      const res = await fetch('/api/goal-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: { name: goal.name, target: goal.target, saved: goal.saved || 0 },
          userContext: { coins, completedModules, streak },
          mode: 'monthDetail',
          monthGroup: group
        })
      });
      const data = await res.json();
      setMonthDetail(data.monthDetail);
      toast({ title: `${group.title} ka plan ready! 📋` });
    } catch (err) {
      toast({ title: "Detail load nahi hua", variant: "destructive" });
    } finally { setDetailLoading(false); }
  };

  if (!open || !goal) return null;

  const totalSaved = goal.saved || 0;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
          className="relative z-10 w-full max-w-3xl bg-[#080B16] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        >
          {/* ── HEADER ── */}
          <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-[#0a0d1a] to-[#0d1020]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedGroup ? (
                  <button onClick={() => { setSelectedGroup(null); setMonthDetail(null); }} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
                    <ArrowLeft size={16} />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Rocket size={18} className="text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-2">
                    {goal.emoji} {selectedGroup ? selectedGroup.title : goal.name}
                  </h2>
                  <p className="text-[10px] text-zinc-500">{selectedGroup ? selectedGroup.monthRange : 'Month-Grouped Roadmap'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"><X size={18} /></button>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="flex-1 overflow-y-auto custom-scroll">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <Mountain className="absolute inset-0 m-auto w-7 h-7 text-emerald-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white">Month Groups Ban Rahe Hain...</p>
                  <p className="text-xs text-zinc-500">AI har month ka plan soch raha hai</p>
                  <div className="flex justify-center gap-1 mt-2">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <AlertTriangle className="w-10 h-10 text-red-400" />
                <p className="text-sm font-bold text-white">Error</p>
                <p className="text-xs text-zinc-500">{error}</p>
              </div>

            ) : roadmap && !selectedGroup ? (
              /* ═══ LEVEL 1: MONTH GROUPS OVERVIEW ═══ */
              <div className="p-4 sm:p-6 space-y-5">
                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/8 via-amber-500/5 to-purple-500/5 border border-white/[0.06] p-5 sm:p-6"
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/8 blur-[60px] pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-1">{roadmap.title}</h3>
                    {roadmap.tagline && <p className="text-sm text-amber-400/80 italic mb-2">{roadmap.tagline}</p>}
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">{roadmap.summary}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { icon: Target, label: 'Target', value: `₹${(goal.target || 0).toLocaleString('en-IN')}`, color: '#10B981' },
                        { icon: IndianRupee, label: 'Monthly', value: `₹${(roadmap.monthlySavingsRequired || 0).toLocaleString('en-IN')}`, color: '#F59E0B' },
                        { icon: Zap, label: 'Daily', value: `₹${(roadmap.dailyTarget || 0).toLocaleString('en-IN')}`, color: '#3B82F6' },
                        { icon: Calendar, label: 'Months', value: roadmap.totalMonths || 0, color: '#8B5CF6' },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-2.5 rounded-2xl bg-black/20 border border-white/[0.04]">
                          <s.icon size={12} style={{ color: s.color }} className="mx-auto mb-1" />
                          <p className="text-xs font-black text-white">{s.value}</p>
                          <p className="text-[7px] text-zinc-500 font-bold uppercase">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Month Groups Grid */}
                <div className="space-y-3">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <Mountain size={16} className="text-emerald-400" /> Month Groups
                    <span className="text-[10px] text-zinc-500 font-normal ml-auto">Tap to explore detail</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roadmap.monthGroups?.map((group, i) => {
                      const done = totalSaved >= group.cumulativeTarget;
                      const current = !done && (i === 0 || totalSaved >= roadmap.monthGroups[i - 1]?.cumulativeTarget);
                      return (
                        <MonthGroupCard
                          key={group.id}
                          group={group}
                          index={i}
                          totalSaved={totalSaved}
                          isCompleted={done}
                          isCurrent={current}
                          onClick={() => fetchMonthDetail(group)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Warnings */}
                {roadmap.warnings && (
                  <Section title="Warnings" icon={Shield}>
                    {roadmap.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-xl text-[11px] text-zinc-400">
                        <span>{w.emoji}</span>
                        <div><span className="font-bold text-red-300">{w.title}: </span>{w.detail}</div>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Pro Tips */}
                {roadmap.proTips && (
                  <Section title="Pro Tips" icon={Sparkles}>
                    {roadmap.proTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 text-[11px] text-zinc-400">
                        <Star size={10} className="text-amber-400 mt-0.5 shrink-0" /><span>{tip}</span>
                      </div>
                    ))}
                  </Section>
                )}

                {/* Motivation */}
                {roadmap.motivation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/8 to-orange-500/5 border border-amber-500/15 text-center"
                  >
                    <Trophy size={20} className="text-amber-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-300 leading-relaxed">{roadmap.motivation}</p>
                  </motion.div>
                )}
              </div>

            ) : selectedGroup ? (
              /* ═══ LEVEL 2: MONTH DETAIL ═══ */
              <div className="p-4 sm:p-6 space-y-5">
                {detailLoading ? (
                  <div className="flex flex-col items-center py-16 space-y-4">
                    <Loader2 size={28} className="text-emerald-400 animate-spin" />
                    <p className="text-xs text-zinc-500">{selectedGroup.title} ka detailed plan ban raha hai...</p>
                  </div>
                ) : monthDetail ? (
                  <>
                    {/* Group Header */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/8 to-amber-500/5 border border-white/[0.06]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{selectedGroup.emoji}</span>
                        <div>
                          <h3 className="font-extrabold text-lg text-white">{monthDetail.title}</h3>
                          <p className="text-[10px] text-zinc-500">{selectedGroup.monthRange} • Target: ₹{(selectedGroup.targetSavings || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{monthDetail.overview}</p>

                      {/* Key habit & avoid */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        {monthDetail.keyHabitToTrack && (
                          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                            <Flame size={11} className="text-emerald-400 shrink-0" />
                            <span className="text-[10px] font-bold text-emerald-300">{monthDetail.keyHabitToTrack}</span>
                          </div>
                        )}
                        {monthDetail.whatToAvoid && (
                          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10">
                            <AlertTriangle size={11} className="text-red-400 shrink-0" />
                            <span className="text-[10px] font-bold text-red-300/70">{monthDetail.whatToAvoid}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Weekly Plan */}
                    {monthDetail.weeklyPlan && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-400" /> Week-by-Week Plan
                        </h4>
                        {monthDetail.weeklyPlan.map((week, i) => (
                          <WeekCard key={i} week={week} index={i} />
                        ))}
                      </div>
                    )}

                    {/* Daily Actions */}
                    {monthDetail.dailyActions && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Zap size={14} className="text-amber-400" /> Daily Actions
                        </h4>
                        {monthDetail.dailyActions.map((action, i) => (
                          <DailyRow key={action.id || i} action={action} index={i} />
                        ))}
                      </div>
                    )}

                    {/* Monthly Milestone */}
                    {monthDetail.monthlyMilestone && (
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Trophy size={10} /> Monthly Milestone
                        </span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Target: ₹{(monthDetail.monthlyMilestone.targetSavings || 0).toLocaleString('en-IN')}</span>
                          <span className="text-amber-300 font-bold">{monthDetail.monthlyMilestone.metric}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">Reward: {monthDetail.monthlyMilestone.reward}</p>
                      </div>
                    )}

                    {/* Weekly Check-in */}
                    {monthDetail.weeklyCheckIn && (
                      <Section title="Weekly Check-In" icon={Brain}>
                        {monthDetail.weeklyCheckIn.map((q, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 p-1.5">
                            <span className="text-emerald-400 font-bold">{i + 1}.</span><span>{q}</span>
                          </div>
                        ))}
                      </Section>
                    )}

                    {/* Emergency Plan */}
                    {monthDetail.emergencyPlan && (
                      <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1">
                          <Shield size={10} /> Emergency Plan
                        </span>
                        <p className="text-[11px] text-zinc-400"><span className="font-bold text-red-300">If shortfall: </span>{monthDetail.emergencyPlan.ifShortfall}</p>
                        <p className="text-[11px] text-zinc-400"><span className="font-bold text-red-300">Backup: </span>{monthDetail.emergencyPlan.backupPlan}</p>
                      </div>
                    )}

                    {/* Motivation */}
                    {monthDetail.motivation && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-amber-500/5 border border-emerald-500/15 text-center">
                        <p className="text-xs text-zinc-300 italic">{monthDetail.motivation}</p>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* ── FOOTER ── */}
          <div className="shrink-0 px-6 py-3 border-t border-white/[0.05] bg-[#0a0d1a]">
            <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
              Gemini 3.1 Flash Lite • Month-Grouped Roadmap
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
