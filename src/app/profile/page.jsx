"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Coins, Flame, Trophy, BookOpen, CheckCircle2, Lock, Clock, Target, Award, TrendingUp, Calendar, MapPin, Mail, Phone, User, Edit3, Save, X, Sparkles, Zap, Crown, Activity as ActivityIcon } from 'lucide-react';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import { BADGES, PROFILE_AVATARS, getLevelInfo, getLevelProgress, ACTIVITY_EMOJI } from '@/lib/data/badges';
import { Navbar } from '@/components/2d/navbar';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Helpers ────────────────────────────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const STATUS_OPTIONS = [{
  value: 'school',
  label: 'School Student',
  emoji: '🎒'
}, {
  value: 'college',
  label: 'College Student',
  emoji: '🎓'
}, {
  value: 'working',
  label: 'Working',
  emoji: '💼'
}, {
  value: 'freelancer',
  label: 'Freelancer',
  emoji: '🧑‍💻'
}, {
  value: 'job-seeker',
  label: 'Job Seeker',
  emoji: '🔍'
}];
function statusLabel(s) {
  return STATUS_OPTIONS.find(o => o.value === s)?.label ?? 'Select status';
}
function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hours ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} days ago`;
  return new Date(ts).toLocaleDateString('en-IN');
}
function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birth.getDate()) age--;
  return age >= 0 ? age : null;
}

// ── Profile Stat Pill ──────────────────────────────────────────────────────
function StatPill({
  icon,
  label,
  value,
  accent
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "card-3d glass-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center relative overflow-hidden",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-25",
      style: {
        backgroundColor: accent
      }
    }), /*#__PURE__*/_jsx("div", {
      className: "relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5",
      style: {
        backgroundColor: `${accent}1A`,
        color: accent
      },
      children: icon
    }), /*#__PURE__*/_jsx("div", {
      className: "relative font-display text-lg sm:text-xl font-extrabold text-ink tabular-nums leading-none",
      children: value
    }), /*#__PURE__*/_jsx("div", {
      className: "relative text-[10px] sm:text-[11px] text-ink-muted font-semibold uppercase tracking-wider mt-1",
      children: label
    })]
  });
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const hydrated = useHydration();
  const {
    user,
    isAuthenticated,
    coins,
    streak,
    completedModules,
    moduleProgress,
    badges,
    earnedBadges,
    xp,
    level,
    activityLog,
    quizScores,
    masteredTerms,
    financialAge,
    savingsChallenge,
    setUser,
    addBadge
  } = useAppStore();

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
    status: '',
    monthlyIncome: 0,
    city: '',
    avatarEmoji: 'av1'
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
        avatarEmoji: user.avatarEmoji ?? 'av1'
      });
    }
  }, [editing, user]);

  // Don't render until hydrated (avoids SSR mismatch on localStorage reads)
  if (!hydrated || !isAuthenticated || !user) {
    return /*#__PURE__*/_jsx("main", {
      className: "min-h-screen bg-midnight flex items-center justify-center",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex flex-col items-center gap-4",
        children: [/*#__PURE__*/_jsx("div", {
          className: "w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-ink-muted text-sm",
          children: "Loading profile..."
        })]
      })
    });
  }

  // ── Derived stats ────────────────────────────────────────────────────────
  const earnedSet = new Set([...badges, ...earnedBadges]);
  const earnedBadgeCount = BADGES.filter(b => earnedSet.has(b.id)).length;
  const levelInfo = getLevelInfo(xp);
  const levelProg = getLevelProgress(xp);
  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round(completedCards / totalCards * 100)) : 0;
  const quizzesPassed = Object.values(quizScores).filter(s => s >= 60).length;
  const totalQuizzesAttempted = Object.keys(quizScores).length;
  const longestStreak = Math.max(streak, savingsChallenge?.longestStreak ?? 0);
  const totalStudyMinutes = completedCards * 2; // ~2 min per card
  const totalStudyHours = Math.floor(totalStudyMinutes / 60);
  const totalStudyMins = totalStudyMinutes % 60;

  // Dummy rank — calculated from XP relative to a notional learner base
  const learnerBase = 2500;
  const rank = Math.max(1, learnerBase - Math.floor(xp / 5) - earnedBadgeCount * 7 - completedModules.length * 15);
  const financialAgeDisplay = financialAge > 0 ? financialAge : calcAge(user.dateOfBirth) ?? '—';
  const joinedDate = user.joinedAt ? new Date(user.joinedAt) : null;
  const daysSinceJoined = joinedDate ? Math.max(0, Math.floor((Date.now() - joinedDate.getTime()) / 86400000)) : 0;

  // Estimated completion (assume 4 cards/day pace)
  const remainingCards = Math.max(0, totalCards - completedCards);
  const estDaysLeft = remainingCards > 0 ? Math.ceil(remainingCards / 4) : 0;

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = () => {
    const updated = {
      ...user,
      displayName: form.displayName.trim() || user.displayName || 'Capital Master',
      email: form.email.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      age: calcAge(form.dateOfBirth),
      status: form.status || null,
      monthlyIncome: form.monthlyIncome || null,
      city: form.city.trim() || null,
      avatarEmoji: form.avatarEmoji
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
  const avatarEmojiObj = PROFILE_AVATARS.find(a => a.id === (user.avatarEmoji ?? 'av1'));
  const avatarEmoji = avatarEmojiObj?.emoji ?? '🦊';
  return /*#__PURE__*/_jsxs("main", {
    className: "relative min-h-screen bg-midnight overflow-x-hidden",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "fixed inset-0 pointer-events-none z-0 overflow-hidden",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10",
      children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsxs("div", {
        className: "mx-auto max-w-6xl px-4 pt-24 pb-12",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mb-6",
          children: [/*#__PURE__*/_jsxs(Link, {
            href: "/home",
            className: "flex items-center gap-2 text-sm text-ink-muted hover:text-emerald-soft transition-colors",
            children: [/*#__PURE__*/_jsx(ArrowLeft, {
              className: "w-4 h-4"
            }), " Dashboard"]
          }), savedFlash && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: -6
            },
            animate: {
              opacity: 1,
              y: 0
            },
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald/15 border border-emerald/30 text-emerald-soft text-xs font-semibold",
            children: [/*#__PURE__*/_jsx(CheckCircle2, {
              className: "w-3.5 h-3.5"
            }), " Profile saved!"]
          })]
        }), /*#__PURE__*/_jsx(motion.h1, {
          initial: {
            opacity: 0,
            y: 12
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "font-display text-3xl sm:text-4xl font-extrabold heading-gradient mb-1",
          children: "My Profile"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-sm text-ink-muted mb-6",
          children: "View your journey, update your profile, and celebrate your achievements \uD83D\uDE80"
        }), /*#__PURE__*/_jsxs(motion.section, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.05
          },
          className: "card-3d glass-card-premium rounded-3xl p-5 sm:p-7 mb-6 relative overflow-hidden",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl pointer-events-none"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-emerald/10 blur-3xl pointer-events-none"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative flex flex-col lg:flex-row items-center lg:items-start gap-5 lg:gap-7",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "relative shrink-0",
              children: [/*#__PURE__*/_jsx("div", {
                className: "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl sm:text-6xl shadow-glow-gold",
                style: {
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.18))',
                  border: '3px solid rgba(245,158,11,0.55)'
                },
                children: /*#__PURE__*/_jsx(motion.span, {
                  animate: {
                    y: [0, -3, 0]
                  },
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  },
                  children: avatarEmoji
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-midnight border border-emerald/40 text-[10px] font-bold text-emerald-soft shadow-lg whitespace-nowrap",
                children: ["Lvl ", level]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 text-center lg:text-left",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center lg:justify-start",
                children: [/*#__PURE__*/_jsx("h2", {
                  className: "font-display text-2xl sm:text-3xl font-extrabold text-ink",
                  children: user.displayName ?? 'Capital Master'
                }), /*#__PURE__*/_jsxs("span", {
                  className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald/12 border border-emerald/25 text-[11px] font-bold text-emerald-soft",
                  children: [/*#__PURE__*/_jsx(ActivityIcon, {
                    className: "w-3 h-3"
                  }), "Financial Age: ", financialAgeDisplay]
                })]
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-sm text-ink-muted mt-1.5",
                children: [statusLabel(user.status), " ", user.city ? `· ${user.city}` : '', joinedDate ? ` · Joined ${joinedDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}` : '']
              }), /*#__PURE__*/_jsxs("div", {
                className: "mt-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between mb-1.5",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "flex items-center gap-1.5",
                    children: /*#__PURE__*/_jsxs("span", {
                      className: "text-sm font-bold text-ink",
                      children: ["Level ", level, ": ", levelInfo.name, " ", levelInfo.emoji]
                    })
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-[11px] text-ink-muted tabular-nums",
                    children: [xp.toLocaleString('en-IN'), " XP", levelProg.toNext > 0 && /*#__PURE__*/_jsxs("span", {
                      className: "text-gold-soft",
                      children: [" \xB7 ", levelProg.toNext.toLocaleString('en-IN'), " XP to next"]
                    })]
                  })]
                }), /*#__PURE__*/_jsx("div", {
                  className: "h-2.5 rounded-full bg-white/[0.05] overflow-hidden",
                  children: /*#__PURE__*/_jsx(motion.div, {
                    className: "h-full rounded-full",
                    style: {
                      background: 'linear-gradient(90deg, #34D399, #8B5CF6, #F59E0B)'
                    },
                    initial: {
                      width: 0
                    },
                    animate: {
                      width: `${levelProg.percent}%`
                    },
                    transition: {
                      duration: 1,
                      ease: 'easeOut'
                    }
                  })
                })]
              })]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: () => setEditing(true),
              className: "shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ink-muted hover:text-ink hover:bg-white/10 transition-colors text-sm font-semibold",
              children: [/*#__PURE__*/_jsx(Edit3, {
                className: "w-3.5 h-3.5"
              }), " Edit"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6",
            children: [/*#__PURE__*/_jsx(StatPill, {
              icon: /*#__PURE__*/_jsx(Coins, {
                className: "w-5 h-5"
              }),
              label: "Coins",
              value: coins.toLocaleString('en-IN'),
              accent: "#F59E0B"
            }), /*#__PURE__*/_jsx(StatPill, {
              icon: /*#__PURE__*/_jsx(Flame, {
                className: "w-5 h-5"
              }),
              label: "Streak",
              value: `${streak}d`,
              accent: "#EF4444"
            }), /*#__PURE__*/_jsx(StatPill, {
              icon: /*#__PURE__*/_jsx(BookOpen, {
                className: "w-5 h-5"
              }),
              label: "Modules Done",
              value: `${completedModules.length}/11`,
              accent: "#10B981"
            }), /*#__PURE__*/_jsx(StatPill, {
              icon: /*#__PURE__*/_jsx(Trophy, {
                className: "w-5 h-5"
              }),
              label: "Badges Earned",
              value: `${earnedBadgeCount}/${BADGES.length}`,
              accent: "#8B5CF6"
            })]
          })]
        }), /*#__PURE__*/_jsxs(motion.section, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.1
          },
          className: "card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-4 flex-wrap gap-2",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("h3", {
                className: "font-display text-lg font-bold text-ink flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(TrendingUp, {
                  className: "w-4 h-4 text-emerald-soft"
                }), "Learning Progress"]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-ink-muted mt-0.5",
                children: "Status of all 11 modules — where you are and where you're going"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "text-right",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "text-2xl font-extrabold text-ink tabular-nums leading-none",
                children: [overallProgress, "%"]
              }), /*#__PURE__*/_jsx("div", {
                className: "text-[10px] text-ink-muted uppercase tracking-wider font-semibold",
                children: "Journey Complete 🚀"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "h-2 rounded-full bg-white/[0.05] overflow-hidden mb-4",
            children: /*#__PURE__*/_jsx(motion.div, {
              className: "h-full rounded-full",
              style: {
                background: 'linear-gradient(90deg, #10B981, #34D399)'
              },
              initial: {
                width: 0
              },
              animate: {
                width: `${overallProgress}%`
              },
              transition: {
                duration: 1.2,
                ease: 'easeOut'
              }
            })
          }), estDaysLeft > 0 && /*#__PURE__*/_jsxs("p", {
            className: "text-[11px] text-gold-soft font-semibold mb-4",
            children: ["\u23F3 At this pace, you'll be an expert in ~", estDaysLeft, " days!"]
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-2.5",
            children: modules.map((mod, i) => {
              const cardCount = getAllCardsForModule(mod.id).length;
              const isCompleted = completedModules.includes(mod.id);
              const progress = isCompleted ? 100 : Math.min(99, Math.floor((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1) * 100));
              const isLocked = false;
              const statusColor = isCompleted ? '#10B981' : isLocked ? '#64748B' : '#F59E0B';
              const statusEmoji = isCompleted ? '🟢' : isLocked ? '🔒' : '🟡';
              const statusLabel = isCompleted ? 'Complete' : isLocked ? 'Locked' : 'In Progress';
              return /*#__PURE__*/_jsxs(motion.div, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: 0.1 + i * 0.03
                },
                className: `relative rounded-xl p-3 border flex items-center gap-3 ${isLocked ? 'bg-white/[0.02] border-white/[0.04] opacity-60' : 'bg-white/[0.04] border-white/[0.08]'}`,
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
                  style: {
                    backgroundColor: isLocked ? 'rgba(148,163,184,0.08)' : `${mod.color}20`
                  },
                  children: isLocked ? /*#__PURE__*/_jsx(Lock, {
                    className: "w-4 h-4 text-zinc-600"
                  }) : mod.emoji
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between gap-2 mb-1",
                    children: [/*#__PURE__*/_jsxs("span", {
                      className: "text-sm font-bold text-ink truncate",
                      children: [/*#__PURE__*/_jsxs("span", {
                        className: "text-[10px] text-ink-muted mr-1.5",
                        children: ["M", mod.id]
                      }), mod.title]
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                      style: {
                        color: statusColor
                      },
                      children: [statusEmoji, " ", statusLabel]
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: "flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden",
                      children: /*#__PURE__*/_jsx(motion.div, {
                        className: "h-full rounded-full",
                        style: {
                          backgroundColor: statusColor
                        },
                        initial: {
                          width: 0
                        },
                        animate: {
                          width: `${progress}%`
                        },
                        transition: {
                          duration: 0.8,
                          delay: 0.2 + i * 0.03
                        }
                      })
                    }), /*#__PURE__*/_jsxs("span", {
                      className: "text-[10px] text-ink-muted font-semibold tabular-nums shrink-0",
                      children: [progress, "%"]
                    })]
                  })]
                })]
              }, mod.id);
            })
          })]
        }), /*#__PURE__*/_jsxs(motion.section, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.15
          },
          className: "card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "font-display text-lg font-bold text-ink flex items-center gap-2 mb-4",
            children: [/*#__PURE__*/_jsx(Award, {
              className: "w-4 h-4 text-gold"
            }), "Achievement Stats"]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Clock, {
                  className: "w-3 h-3"
                }), " Study Time"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [totalStudyHours > 0 ? `${totalStudyHours}h ` : '', totalStudyMins, "m"]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Target, {
                  className: "w-3 h-3"
                }), " Quizzes"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [quizzesPassed, "/", totalQuizzesAttempted, /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: "passed"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Zap, {
                  className: "w-3 h-3"
                }), " Strategies"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [earnedBadgeCount > 0 ? Math.min(8, earnedBadgeCount) : 0, /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: "done"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Flame, {
                  className: "w-3 h-3"
                }), " Longest Streak"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [longestStreak, /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: "days"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Coins, {
                  className: "w-3 h-3"
                }), " Total Coins"]
              }), /*#__PURE__*/_jsx("div", {
                className: "font-display text-xl font-extrabold text-ink tabular-nums",
                children: coins.toLocaleString('en-IN')
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Crown, {
                  className: "w-3 h-3"
                }), " Rank"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: ["#", rank.toLocaleString('en-IN'), /*#__PURE__*/_jsxs("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: ["/ ", learnerBase.toLocaleString('en-IN'), " \uD83C\uDFC5"]
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "mt-3 grid grid-cols-2 gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(BookOpen, {
                  className: "w-3 h-3"
                }), " Terms Explored"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [masteredTerms.length, /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: "/ 40+"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink-muted font-bold mb-1",
                children: [/*#__PURE__*/_jsx(Calendar, {
                  className: "w-3 h-3"
                }), " Joined"]
              }), /*#__PURE__*/_jsxs("div", {
                className: "font-display text-xl font-extrabold text-ink",
                children: [daysSinceJoined, /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] text-ink-muted font-semibold ml-1",
                  children: "days ago"
                })]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs(motion.section, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: 0.2
          },
          className: "card-3d glass-card rounded-2xl p-5 sm:p-6 mb-6",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between mb-4",
            children: [/*#__PURE__*/_jsxs("h3", {
              className: "font-display text-lg font-bold text-ink flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(ActivityIcon, {
                className: "w-4 h-4 text-ai-soft"
              }), "Activity History"]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-[11px] text-ink-muted",
              children: ["Last ", activityLog.length || 0, " activities"]
            })]
          }), activityLog.length === 0 ? /*#__PURE__*/_jsxs("div", {
            className: "text-center py-8",
            children: [/*#__PURE__*/_jsx(Sparkles, {
              className: "w-8 h-8 text-ink-muted/50 mx-auto mb-2"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted",
              children: "No activity yet. Read a module, take a quiz, or complete a strategy \u2014 it will show up here!"
            })]
          }) : /*#__PURE__*/_jsx("div", {
            className: "max-h-96 overflow-y-auto pr-1 -mr-1 scrollbar-none",
            children: /*#__PURE__*/_jsxs("ol", {
              className: "relative space-y-2.5",
              children: [/*#__PURE__*/_jsx("div", {
                className: "absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald/30 via-ai/20 to-transparent pointer-events-none"
              }), activityLog.map((entry, idx) => {
                const emoji = ACTIVITY_EMOJI[entry.type] ?? '✨';
                return /*#__PURE__*/_jsxs(motion.li, {
                  initial: {
                    opacity: 0,
                    x: -8
                  },
                  animate: {
                    opacity: 1,
                    x: 0
                  },
                  transition: {
                    delay: Math.min(idx * 0.02, 0.4)
                  },
                  className: "relative flex items-start gap-3 pl-0",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 bg-midnight border-2",
                    style: {
                      borderColor: entry.coins > 0 ? 'rgba(245,158,11,0.4)' : 'rgba(139,92,246,0.3)',
                      backgroundColor: entry.coins > 0 ? 'rgba(245,158,11,0.08)' : 'rgba(139,92,246,0.06)'
                    },
                    children: emoji
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "flex-1 min-w-0 pt-1",
                    children: [/*#__PURE__*/_jsxs("div", {
                      className: "flex items-start justify-between gap-2",
                      children: [/*#__PURE__*/_jsx("p", {
                        className: "text-sm text-ink leading-snug break-words",
                        children: entry.description
                      }), entry.coins !== 0 && /*#__PURE__*/_jsxs("span", {
                        className: `text-xs font-bold tabular-nums whitespace-nowrap shrink-0 ${entry.coins > 0 ? 'text-gold-soft' : 'text-red-400'}`,
                        children: [entry.coins > 0 ? '+' : '', entry.coins, " \uD83E\uDE99"]
                      })]
                    }), /*#__PURE__*/_jsx("div", {
                      className: "text-[10px] text-ink-muted mt-0.5",
                      children: relativeTime(entry.timestamp)
                    })]
                  })]
                }, entry.id);
              })]
            })
          })]
        })]
      })]
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: editing && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          className: "fixed inset-0 z-[110] bg-black/70 backdrop-blur-md",
          onClick: () => setEditing(false)
        }), /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            x: '100%'
          },
          animate: {
            x: 0
          },
          exit: {
            x: '100%'
          },
          transition: {
            type: 'spring',
            stiffness: 380,
            damping: 36
          },
          className: "fixed inset-y-0 right-0 z-[111] w-full max-w-md glass-strong border-l border-white/10 shadow-2xl shadow-black/60 flex flex-col",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "shrink-0 px-5 py-4 border-b border-white/[0.06] flex items-center justify-between",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-display text-lg font-bold text-ink",
              children: "Edit Profile"
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setEditing(false),
              className: "p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors",
              "aria-label": "Close",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-none",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx(Label, {
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-2 block",
                children: "Avatar Chuno"
              }), /*#__PURE__*/_jsx("div", {
                className: "grid grid-cols-5 gap-2",
                children: PROFILE_AVATARS.map(av => /*#__PURE__*/_jsx("button", {
                  onClick: () => setForm(f => ({
                    ...f,
                    avatarEmoji: av.id
                  })),
                  className: `aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${form.avatarEmoji === av.id ? 'bg-emerald/15 border-2 border-emerald/50 scale-105 shadow-glow-emerald' : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]'}`,
                  "aria-label": av.label,
                  children: av.emoji
                }, av.id))
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                htmlFor: "pf-name",
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(User, {
                  className: "w-3 h-3"
                }), " Full Name"]
              }), /*#__PURE__*/_jsx(Input, {
                id: "pf-name",
                value: form.displayName,
                onChange: e => setForm(f => ({
                  ...f,
                  displayName: e.target.value
                })),
                placeholder: "Aapka naam",
                className: "bg-white/[0.04] border-white/10 text-ink"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                htmlFor: "pf-email",
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Mail, {
                  className: "w-3 h-3"
                }), " Email"]
              }), /*#__PURE__*/_jsx(Input, {
                id: "pf-email",
                type: "email",
                value: form.email,
                onChange: e => setForm(f => ({
                  ...f,
                  email: e.target.value
                })),
                placeholder: "aap@example.com",
                className: "bg-white/[0.04] border-white/10 text-ink"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                htmlFor: "pf-phone",
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Phone, {
                  className: "w-3 h-3"
                }), " Phone (optional)"]
              }), /*#__PURE__*/_jsx(Input, {
                id: "pf-phone",
                type: "tel",
                value: form.phoneNumber,
                onChange: e => setForm(f => ({
                  ...f,
                  phoneNumber: e.target.value
                })),
                placeholder: "+91 98765 43210",
                className: "bg-white/[0.04] border-white/10 text-ink"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                htmlFor: "pf-dob",
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Calendar, {
                  className: "w-3 h-3"
                }), " Date of Birth"]
              }), /*#__PURE__*/_jsx(Input, {
                id: "pf-dob",
                type: "date",
                value: form.dateOfBirth,
                onChange: e => setForm(f => ({
                  ...f,
                  dateOfBirth: e.target.value
                })),
                className: "bg-white/[0.04] border-white/10 text-ink"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Award, {
                  className: "w-3 h-3"
                }), " Current Status"]
              }), /*#__PURE__*/_jsxs(Select, {
                value: form.status || undefined,
                onValueChange: v => setForm(f => ({
                  ...f,
                  status: v
                })),
                children: [/*#__PURE__*/_jsx(SelectTrigger, {
                  className: "bg-white/[0.04] border-white/10 text-ink w-full",
                  children: /*#__PURE__*/_jsx(SelectValue, {
                    placeholder: "Select karo"
                  })
                }), /*#__PURE__*/_jsx(SelectContent, {
                  children: STATUS_OPTIONS.map(opt => /*#__PURE__*/_jsxs(SelectItem, {
                    value: opt.value,
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "mr-2",
                      children: opt.emoji
                    }), " ", opt.label]
                  }, opt.value))
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between mb-1.5",
                children: [/*#__PURE__*/_jsxs(Label, {
                  className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold flex items-center gap-1",
                  children: [/*#__PURE__*/_jsx(Coins, {
                    className: "w-3 h-3"
                  }), " Monthly Income / Pocket Money"]
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-sm font-bold text-gold-soft tabular-nums",
                  children: formatINR(form.monthlyIncome)
                })]
              }), /*#__PURE__*/_jsx(Slider, {
                min: 0,
                max: 50000,
                step: 500,
                value: [form.monthlyIncome],
                onValueChange: v => setForm(f => ({
                  ...f,
                  monthlyIncome: v[0]
                })),
                className: "py-2"
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between text-[10px] text-ink-muted mt-0.5",
                children: [/*#__PURE__*/_jsx("span", {
                  children: "\u20B90"
                }), /*#__PURE__*/_jsx("span", {
                  children: "\u20B950,000"
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs(Label, {
                htmlFor: "pf-city",
                className: "text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-1.5 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(MapPin, {
                  className: "w-3 h-3"
                }), " City (optional)"]
              }), /*#__PURE__*/_jsx(Input, {
                id: "pf-city",
                value: form.city,
                onChange: e => setForm(f => ({
                  ...f,
                  city: e.target.value
                })),
                placeholder: "Mumbai, Delhi, Bengaluru...",
                className: "bg-white/[0.04] border-white/10 text-ink"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "shrink-0 px-5 py-4 border-t border-white/[0.06] flex gap-2.5 bg-midnight/40",
            children: [/*#__PURE__*/_jsx("button", {
              onClick: () => setEditing(false),
              className: "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-ink-muted hover:bg-white/10 transition-colors",
              children: "Cancel"
            }), /*#__PURE__*/_jsxs("button", {
              onClick: handleSave,
              className: "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold btn-3d flex items-center justify-center gap-1.5",
              style: {
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                color: '#0B1220'
              },
              children: [/*#__PURE__*/_jsx(Save, {
                className: "w-3.5 h-3.5"
              }), " Save"]
            })]
          })]
        })]
      })
    })]
  });
}