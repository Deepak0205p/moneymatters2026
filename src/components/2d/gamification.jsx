"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coins, Trophy, Award, Flame, Star, Zap } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Gamification() {
  return /*#__PURE__*/_jsx("section", {
    className: "py-16 md:py-24",
    children: /*#__PURE__*/_jsxs("div", {
      className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      children: [/*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          duration: 0.6
        },
        className: "mb-12 text-center",
        children: /*#__PURE__*/_jsxs("h2", {
          className: "font-display text-3xl font-extrabold tracking-tight md:text-4xl",
          children: ["Gamification se seekho,", /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("span", {
            className: "text-gradient-gold",
            children: "Coins kamao, Badges unlock karo!"
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
        children: [/*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 30
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            duration: 0.6,
            delay: 0.2
          },
          whileHover: {
            y: -5
          },
          className: "glass-card card-shine col-span-1 rounded-3xl p-6 md:col-span-2 md:p-8 lg:col-span-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "mb-6 flex items-center gap-4",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15",
              children: /*#__PURE__*/_jsx(Coins, {
                size: 26,
                className: "text-gold-soft"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-bold text-ink",
                children: "Earn Coins"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted",
                children: "Modules complete karne pe"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "overflow-hidden rounded-2xl border border-white/10",
            children: /*#__PURE__*/_jsx(Image, {
              src: "/images/rupee_coin.jpeg",
              alt: "Rupee coin gamification",
              width: 400,
              height: 200,
              className: "w-full object-cover"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-4 space-y-2",
            children: [{
              label: 'Module Complete',
              coins: '+50'
            }, {
              label: 'Quiz Score 90%+',
              coins: '+100'
            }, {
              label: 'Daily Streak 7 din',
              coins: '+200'
            }].map(item => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-3.5 py-2.5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm text-ink-muted",
                children: item.label
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm font-bold text-gold-soft tabular-nums",
                children: item.coins
              })]
            }, item.label))
          })]
        }), /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 30
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            duration: 0.6,
            delay: 0.3
          },
          whileHover: {
            y: -5
          },
          className: "glass-card card-shine rounded-3xl p-6 md:p-8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "mb-6 flex items-center gap-4",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-ai/15",
              children: /*#__PURE__*/_jsx(Award, {
                size: 26,
                className: "text-ai-soft"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-bold text-ink",
                children: "Mastery Badges"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted",
                children: "Achievements collect karo"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "overflow-hidden rounded-2xl border border-white/10",
            children: /*#__PURE__*/_jsx(Image, {
              src: "/images/badges.jpeg",
              alt: "Achievement badges",
              width: 400,
              height: 200,
              className: "w-full object-cover"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-4 grid grid-cols-3 gap-3",
            children: [{
              icon: Star,
              label: 'Bronze',
              color: '#F59E0B'
            }, {
              icon: Trophy,
              label: 'Silver',
              color: '#C0C0C0'
            }, {
              icon: Zap,
              label: 'Gold',
              color: '#FBBF24'
            }].map(badge => /*#__PURE__*/_jsxs("div", {
              className: "flex flex-col items-center gap-2 rounded-xl bg-white/5 border border-white/5 p-3",
              children: [/*#__PURE__*/_jsx(badge.icon, {
                size: 22,
                style: {
                  color: badge.color
                }
              }), /*#__PURE__*/_jsx("span", {
                className: "text-xs text-ink-muted",
                children: badge.label
              })]
            }, badge.label))
          })]
        }), /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 30
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            duration: 0.6,
            delay: 0.4
          },
          whileHover: {
            y: -5
          },
          className: "glass-card card-shine rounded-3xl p-6 md:p-8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "mb-6 flex items-center gap-4",
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/15",
              children: /*#__PURE__*/_jsx(Flame, {
                size: 26,
                className: "text-orange-300"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-bold text-ink",
                children: "Daily Streak"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted",
                children: "Consistency se bada rewards"
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "space-y-3",
            children: [{
              days: '3 din',
              reward: '50 bonus coins',
              icon: '🔥'
            }, {
              days: '7 din',
              reward: '200 bonus coins',
              icon: '⚡'
            }, {
              days: '30 din',
              reward: 'Exclusive Badge',
              icon: '👑'
            }].map(streak => /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-2xl",
                children: streak.icon
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex-1",
                children: [/*#__PURE__*/_jsxs("p", {
                  className: "text-sm font-semibold text-ink",
                  children: [streak.days, " streak"]
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-ink-muted",
                  children: streak.reward
                })]
              })]
            }, streak.days))
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-4 rounded-xl bg-gradient-to-r from-emerald/10 to-ai/10 border border-emerald/15 p-3.5",
            children: /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-ink-muted leading-relaxed",
              children: [/*#__PURE__*/_jsx("span", {
                className: "font-bold text-emerald-soft",
                children: "Pro Tip:"
              }), " Auto-debit setup karo savings ke liye aur daily module complete karo \u2014 dono saath mein!"]
            })
          })]
        })]
      })]
    })
  });
}