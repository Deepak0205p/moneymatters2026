"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Coins, Flame, Trophy, BookOpen, CheckCircle2, Lock,
  Clock, Target, Award, TrendingUp, Calendar, MapPin, Mail, Phone,
  User, Edit3, Save, X, Sparkles, Zap, Crown, Activity as ActivityIcon,
} from 'lucide-react';
import { useAppStore, useHydration, type UserProfile, type ProfileStatus } from '@/lib/store/useAppStore';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import {
  BADGES,
  PROFILE_AVATARS,
  LEVEL_NAMES,
  LEVEL_THRESHOLDS,
  getLevelInfo,
  getLevelProgress,
  ACTIVITY_EMOJI,
} from '@/lib/data/badges';
import { Navbar } from '@/components/2d/navbar';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS: { value: ProfileStatus; label: string; emoji: string }[] = [
  { value: 'school',     label: 'School Student',  emoji: '🎒' },
  { value: 'college',    label: 'College Student', emoji: '🎓' },
  { value: 'working',    label: 'Working',         emoji: '💼' },
  { value: 'freelancer', label: 'Freelancer',      emoji: '🧑‍💻' },
  { value: 'job-seeker', label: 'Job Seeker',      emoji: '🔍' },
];

function statusLabel(s?: ProfileStatus | null): string {
  return STATUS_OPTIONS.find((o) => o.value === s)?.label ?? 'Select karo';
}

function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'abhi';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min pehle`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ghante pehle`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} din pehle`;
  return new Date(ts).toLocaleDateString('en-IN');
}

function calcAge(dob?: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

// ── Profile Stat Pill ──────────────────────────────────────────────────────
function StatPill({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="card-3d glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center relative overflow-hidden"
    >
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-25"
        style={{ backgroundColor: accent }}
      />
      <div
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        {icon}
      </div>
      <div className="relative font-display text-lg sm:text-xl font-extrabold text-ink tabular-nums leading-none">
        {value}
      </div>
      <div className="relative text-[10px] sm:text-[11px] text-ink-muted font-semibold uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const hydrated = useHydration();
  const {
    user, isAuthenticated, coins, streak, completedModules, moduleProgress,
    badges, earnedBadges, xp, level, activityLog, quizScores, masteredTerms,
    financialAge, savingsChallenge, setUser, addBadge,
  } = useAppStore();

  // Auth guard — redirect to /auth if not logged in
  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/auth');
  }, [hydrated, isAuthenticated, router]);

  // ── Edit form state ──────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    status: '' as ProfileStatus | '',
    monthlyIncome: 0,
    city: '',
    avatarEmoji: 'av1',
  });
  const [savedFlash, setSavedFlash] = useState(false);

  // Sync form state from user whenever editing opens
  useEffect(() => {
    if (editing && user) {
      setForm({
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        dateOfBirth: user.dateOfBirth ?? '',
        status: user.status ?? '',
        monthlyIncome: user.monthlyIncome ?? 0,
        city: user.city ?? '',
        avatarEmoji: user.avatarEmoji ?? 'av1',
      });
    }
  }, [editing, user]);

  // Don't render until hydrated (avoids SSR mismatch on localStorage reads)
  if (!hydrated || !isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
          <p className="text-ink-muted text-sm">Profile load ho raha hai...</p>
        </div>
      </main>
    );
  }

  // ── Derived stats ────────────────────────────────────────────────────────
  const earnedSet = new Set<string>([...badges, ...earnedBadges]);
  const earnedBadgeCount = BADGES.filter((b) => earnedSet.has(b.id)).length;
  const levelInfo = getLevelInfo(xp);
  const levelProg = getLevelProgress(xp);

  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round((completedCards / totalCards) * 100)) : 0;

  const quizzesPassed = Object.values(quizScores).filter((s) => s >= 60).length;
  const totalQuizzesAttempted = Object.keys(quizScores).length;
  const longestStreak = Math.max(streak, savingsChallenge?.longestStreak ?? 0);
  const totalStudyMinutes = completedCards * 2; // ~2 min per card
  const totalStudyHours = Math.floor(totalStudyMinutes / 60);
  const totalStudyMins = totalStudyMinutes % 60;

  // Dummy rank — calculated from XP relative to a notional learner base
  const learnerBase = 2500;
  const rank = Math.max(1, learnerBase - Math.floor(xp / 5) - (earnedBadgeCount * 7) - (completedModules.length * 15));

  const financialAgeDisplay = financialAge > 0 ? financialAge : (calcAge(user.dateOfBirth) ?? '—');
  const joinedDate = user.joinedAt ? new Date(user.joinedAt) : null;
  const daysSinceJoined = joinedDate
    ? Math.max(0, Math.floor((Date.now() - joinedDate.getTime()) / 86400000))
    : 0;

  // Estimated completion (assume 4 cards/day pace)
  const remainingCards = Math.max(0, totalCards - completedCards);
  const estDaysLeft = remainingCards > 0 ? Math.ceil(remainingCards / 4) : 0;

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      displayName: form.displayName.trim() || user.displayName || 'Capital Master',
      email: form.email.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      age: calcAge(form.dateOfBirth),
      status: form.status || null,
      monthlyIncome: form.monthlyIncome || null,
      city: form.city.trim() || null,
      avatarEmoji: form.avatarEmoji,
    };
    setUser(updated);
    // First-time profile completion bonus
    if (!earnedSet.has('first-blood') && !user.displayName) {
      addBadge('first-blood');
    }
    setEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  // ── Avatar emoji ─────────────────────────────────────────────────────────
  const avatarEmojiObj = PROFILE_AVATARS.find((a) => a.id === (user.avatarEmoji ?? 'av1'));
  const avatarEmoji = avatarEmojiObj?.emoji ?? '🦊';

  return (
    <main className="relative min-h-screen bg-midnight overflow-x-hidden">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Page content */}
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-12">
          {/* Back link + Title */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-emerald-soft transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            {savedFlash && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald/15 border border-emerald/30 text-emerald-soft text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile save ho gayi!
              </motion.div>
            )}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-1"
          >
            Mera Profile
          </motion.h1>
          <p className="text-sm text-ink-muted mb-6">
            Apni journey dekho, profile update karo, aur achievements celebrate karo 🚀
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              PROFILE CARD (hero)
              ═══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-3d glass-card-premium rounded-3xl p-5 sm:p-7 mb-6 relative overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-emerald/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-5 lg:gap-7">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl sm:text-6xl shadow-glow-gold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.18))',
                    border: '3px solid rgba(245,158,11,0.55)',
                  }}
                >
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {avatarEmoji}
                  </motion.span>
                </div>
                {/* Level badge below avatar */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-midnight border border-emerald/40 text-[10px] font-bold text-emerald-soft shadow-lg whitespace-nowrap">
                  Lvl {level}
                </div>
              </div>

              {/* Identity + Financial Age */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center lg:justify-start">
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                    {user.displayName ?? 'Capital Master'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald/12 border border-emerald/25 text-[11px] font-bold text-emerald-soft">
                    <ActivityIcon className="w-3 h-3" />
                    Financial Age: {financialAgeDisplay}
                  </span>
                </div>
                <p className="text-sm text-ink-muted mt-1.5">
                  {statusLabel(user.status)} {user.city ? `· ${user.city}` : ''}
                  {joinedDate ? ` · Joined ${joinedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                </p>

                {/* Level progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-ink">
                        Level {level}: {levelInfo.name} {levelInfo.emoji}
                      </span>
                    </div>
                    <span className="text-[11px] text-ink-muted tabular-nums">
                      {xp.toLocaleString('en-IN')} XP
                      {levelProg.toNext > 0 && (
                        <span className="text-gold-soft"> · {levelProg.toNext.toLocaleString('en-IN')} XP to next</span>
                      )}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #34D399, #8B5CF6, #F59E0B)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProg.percent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditing(true)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink-muted hover:text-ink hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            {/* Stats row */}
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <StatPill
                icon={<Coins className="w-5 h-5" />}
                label="Coins"
                value={coins.toLocaleString('en-IN')}
                accent="#F59E0B"
              />
              <StatPill
                icon={<Flame className="w-5 h-5" />}
                label="Streak"
                value={`${streak}d`}
                accent="#EF4444"
              />
              <StatPill
                icon={<BookOpen className="w-5 h-5" />}
                label="Modules Done"
                value={`${completedModules.length}/11`}
                accent="#10B981"
              />
              <StatPill
                icon={<Trophy className="w-5 h-5" />}
                label="Badges Earned"
                value={`${earnedBadgeCount}/${BADGES.length}`}
                accent="#8B5CF6"
              />
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════════
              LEARNING PROGRESS TIMELINE
              ═══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-soft" />
                  Learning Progress
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Saare 11 modules ka status — kahan ho aur kahan jaana hai
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-ink tabular-nums leading-none">
                  {overallProgress}%
                </div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">
                  Journey Complete 🚀
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #10B981, #34D399)' }}
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            {estDaysLeft > 0 && (
              <p className="text-[11px] text-gold-soft font-semibold mb-4">
                ⏳ Aise chalte rahe toh ~{estDaysLeft} din mein expert ban jaoge!
              </p>
            )}

            {/* Module timeline (vertical on mobile, grid on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {modules.map((mod, i) => {
                const cardCount = getAllCardsForModule(mod.id).length;
                const isCompleted = completedModules.includes(mod.id);
                const progress = isCompleted ? 100 : Math.min(99, Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100));
                const isLocked = !isCompleted && i > 0 && !completedModules.includes(modules[i - 1].id) && progress === 0;
                const statusColor = isCompleted ? '#10B981' : isLocked ? '#64748B' : '#F59E0B';
                const statusEmoji = isCompleted ? '🟢' : isLocked ? '🔒' : '🟡';
                const statusLabel = isCompleted ? 'Complete' : isLocked ? 'Locked' : 'In Progress';
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.03 }}
                    className={`relative rounded-xl p-3 border flex items-center gap-3 ${
                      isLocked
                        ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                        : 'bg-white/[0.04] border-white/[0.08]'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: isLocked ? 'rgba(148,163,184,0.08)' : `${mod.color}20` }}
                    >
                      {isLocked ? <Lock className="w-4 h-4 text-zinc-600" /> : mod.emoji}
                    </div>
                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-bold text-ink truncate">
                          <span className="text-[10px] text-ink-muted mr-1.5">M{mod.id}</span>
                          {mod.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: statusColor }}>
                          {statusEmoji} {statusLabel}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: statusColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.03 }}
                          />
                        </div>
                        <span className="text-[10px] text-ink-muted font-semibold tabular-nums shrink-0">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════════
              ACHIEVEMENT STATS GRID
              ═══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6"
          >
            <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-gold" />
              Achievement Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Clock className="w-3 h-3" /> Study Time
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {totalStudyHours > 0 ? `${totalStudyHours}h ` : ''}{totalStudyMins}m
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Target className="w-3 h-3" /> Quizzes
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {quizzesPassed}/{totalQuizzesAttempted}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">passed</span>
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Zap className="w-3 h-3" /> Strategies
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {earnedBadgeCount > 0 ? Math.min(8, earnedBadgeCount) : 0}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">done</span>
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Flame className="w-3 h-3" /> Longest Streak
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {longestStreak}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">days</span>
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Coins className="w-3 h-3" /> Total Coins
                </div>
                <div className="font-display text-xl font-extrabold text-ink tabular-nums">
                  {coins.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Crown className="w-3 h-3" /> Rank
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  #{rank.toLocaleString('en-IN')}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">/ {learnerBase.toLocaleString('en-IN')} 🏅</span>
                </div>
              </div>
            </div>

            {/* Terms explored + Days since joined */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <BookOpen className="w-3 h-3" /> Terms Explored
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {masteredTerms.length}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">/ 40+</span>
                </div>
              </div>
              <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1">
                  <Calendar className="w-3 h-3" /> Joined
                </div>
                <div className="font-display text-xl font-extrabold text-ink">
                  {daysSinceJoined}
                  <span className="text-[10px] text-ink-muted font-semibold ml-1">days ago</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════════════
              ACTIVITY HISTORY FEED
              ═══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-ai-soft" />
                Activity History
              </h3>
              <span className="text-[11px] text-ink-muted">Last {activityLog.length || 0} activities</span>
            </div>

            {activityLog.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-ink-muted/50 mx-auto mb-2" />
                <p className="text-sm text-ink-muted">
                  Abhi koi activity nahi. Module padho, quiz khelo, ya strategy complete karo — yahan dikhega!
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1 -mr-1 scrollbar-none">
                <ol className="relative space-y-2.5">
                  {/* Timeline vertical line */}
                  <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald/30 via-ai/20 to-transparent pointer-events-none" />
                  {activityLog.map((entry, idx) => {
                    const emoji = ACTIVITY_EMOJI[entry.type] ?? '✨';
                    return (
                      <motion.li
                        key={entry.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                        className="relative flex items-start gap-3 pl-0"
                      >
                        {/* Node */}
                        <div
                          className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 bg-midnight border-2"
                          style={{
                            borderColor: entry.coins > 0 ? 'rgba(245,158,11,0.4)' : 'rgba(139,92,246,0.3)',
                            backgroundColor: entry.coins > 0 ? 'rgba(245,158,11,0.08)' : 'rgba(139,92,246,0.06)',
                          }}
                        >
                          {emoji}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-ink leading-snug break-words">
                              {entry.description}
                            </p>
                            {entry.coins !== 0 && (
                              <span
                                className={`text-xs font-bold tabular-nums whitespace-nowrap shrink-0 ${
                                  entry.coins > 0 ? 'text-gold-soft' : 'text-red-400'
                                }`}
                              >
                                {entry.coins > 0 ? '+' : ''}{entry.coins} 🪙
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-ink-muted mt-0.5">
                            {relativeTime(entry.timestamp)}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            )}
          </motion.section>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EDIT PROFILE SLIDE-OVER
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md"
              onClick={() => setEditing(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-[111] w-full max-w-md glass-strong border-l border-white/10 shadow-2xl shadow-black/60 flex flex-col"
            >
              {/* Header */}
              <div className="shrink-0 px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-ink">Edit Profile</h3>
                <button
                  onClick={() => setEditing(false)}
                  className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body (scrollable) */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-none">
                {/* Avatar picker */}
                <div>
                  <Label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-2 block">
                    Avatar Chuno
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {PROFILE_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => setForm((f) => ({ ...f, avatarEmoji: av.id }))}
                        className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                          form.avatarEmoji === av.id
                            ? 'bg-emerald/15 border-2 border-emerald/50 scale-105 shadow-glow-emerald'
                            : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]'
                        }`}
                        aria-label={av.label}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="pf-name" className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> Full Name
                  </Label>
                  <Input
                    id="pf-name"
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    placeholder="Aapka naam"
                    className="bg-white/[0.04] border-white/10 text-ink"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="pf-email" className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </Label>
                  <Input
                    id="pf-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="aap@example.com"
                    className="bg-white/[0.04] border-white/10 text-ink"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="pf-phone" className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone (optional)
                  </Label>
                  <Input
                    id="pf-phone"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="bg-white/[0.04] border-white/10 text-ink"
                  />
                </div>

                {/* DOB */}
                <div>
                  <Label htmlFor="pf-dob" className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </Label>
                  <Input
                    id="pf-dob"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                    className="bg-white/[0.04] border-white/10 text-ink"
                  />
                </div>

                {/* Status dropdown */}
                <div>
                  <Label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Current Status
                  </Label>
                  <Select
                    value={form.status || undefined}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProfileStatus }))}
                  >
                    <SelectTrigger className="bg-white/[0.04] border-white/10 text-ink w-full">
                      <SelectValue placeholder="Select karo" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="mr-2">{opt.emoji}</span> {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Income slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" /> Monthly Income / Pocket Money
                    </Label>
                    <span className="text-sm font-bold text-gold-soft tabular-nums">
                      {formatINR(form.monthlyIncome)}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={[form.monthlyIncome]}
                    onValueChange={(v) => setForm((f) => ({ ...f, monthlyIncome: v[0] }))}
                    className="py-2"
                  />
                  <div className="flex items-center justify-between text-[10px] text-ink-muted mt-0.5">
                    <span>₹0</span>
                    <span>₹50,000</span>
                  </div>
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="pf-city" className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> City (optional)
                  </Label>
                  <Input
                    id="pf-city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Mumbai, Delhi, Bengaluru..."
                    className="bg-white/[0.04] border-white/10 text-ink"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 py-4 border-t border-white/[0.06] flex gap-2.5 bg-midnight/40">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-ink-muted hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold btn-3d flex items-center justify-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                    color: '#0B1220',
                  }}
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
