"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Features() {
  return /*#__PURE__*/_jsx("section", {
    className: "py-16 md:py-24",
    children: /*#__PURE__*/_jsxs("div", {
      className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      children: [/*#__PURE__*/_jsxs(motion.div, {
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
        children: [/*#__PURE__*/_jsxs("h2", {
          className: "font-display text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl",
          children: ["Jab Indian Youth Bole,", /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("span", {
            className: "text-gradient-emerald",
            children: "\"Paisa samjho, future secure karo!\""
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "mx-auto mt-4 max-w-2xl text-ink-muted text-base md:text-lg",
          children: "16-25 age group ke liye specially designed interactive financial learning"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2",
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
          className: "glass-card card-shine group relative overflow-hidden rounded-3xl p-6 sm:col-span-2 sm:p-8 lg:row-span-2",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-16 -right-16 h-32 w-32 rounded-full bg-emerald/10 blur-3xl"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative",
            children: [/*#__PURE__*/_jsx("div", {
              className: "mb-4 inline-flex rounded-xl bg-emerald/15 p-3",
              children: /*#__PURE__*/_jsx(GraduationCap, {
                size: 26,
                className: "text-emerald-soft"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-2xl font-bold text-ink mb-3",
              children: "College Students"
            }), /*#__PURE__*/_jsx("p", {
              className: "mb-6 max-w-md text-ink-muted leading-relaxed",
              children: "Exam ke saath savings ka basic seekho. Budget templates, expense tracking, aur smart money habits \u2014 sab kuch ek jagah."
            }), /*#__PURE__*/_jsx("div", {
              className: "overflow-hidden rounded-2xl border border-white/10",
              children: /*#__PURE__*/_jsx(Image, {
                src: "/images/genz_banner.jpeg",
                alt: "College students learning financial literacy",
                width: 600,
                height: 300,
                className: "w-full object-cover transition-transform duration-700 group-hover:scale-105"
              })
            })]
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
          className: "glass-card card-shine group relative overflow-hidden rounded-3xl p-6 sm:p-8",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-ai/10 blur-3xl"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative",
            children: [/*#__PURE__*/_jsx("div", {
              className: "mb-4 inline-flex rounded-xl bg-ai/15 p-3",
              children: /*#__PURE__*/_jsx(Briefcase, {
                size: 26,
                className: "text-ai-soft"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-xl font-bold text-ink mb-3",
              children: "First Job Earners"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted leading-relaxed",
              children: "Budgeting aur investing ka practical guide. Pehli salary se wealth building shuru karo."
            })]
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
          className: "glass-card card-shine group relative overflow-hidden rounded-3xl p-6 sm:p-8",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-gold/10 blur-3xl"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative",
            children: [/*#__PURE__*/_jsx("div", {
              className: "mb-4 inline-flex rounded-xl bg-gold/15 p-3",
              children: /*#__PURE__*/_jsx(Users, {
                size: 26,
                className: "text-gold-soft"
              })
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-xl font-bold text-ink mb-3",
              children: "Teenagers"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-sm text-ink-muted leading-relaxed",
              children: "Pocket money se business tak. Saving habits, gamified badges, aur fun learning."
            })]
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
            delay: 0.5
          },
          whileHover: {
            y: -5
          },
          className: "glass-card card-shine group relative overflow-hidden rounded-3xl p-6 sm:col-span-2 sm:p-8",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-12 -left-12 h-24 w-24 rounded-full bg-emerald/10 blur-3xl"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative flex flex-col gap-6 sm:flex-row sm:items-center",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex-1",
              children: [/*#__PURE__*/_jsx("div", {
                className: "mb-4 inline-flex rounded-xl bg-emerald/15 p-3",
                children: /*#__PURE__*/_jsx(TrendingUp, {
                  size: 26,
                  className: "text-emerald-soft"
                })
              }), /*#__PURE__*/_jsx("h3", {
                className: "font-display text-xl font-bold text-ink mb-3",
                children: "Why Money Matters?"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm text-ink-muted leading-relaxed",
                children: "Hinglish mein seekho, interactive experiences se samjho, gamification se practice karo. Finance boring nahi \u2014 yeh game hai!"
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "flex gap-3",
              children: ['Compounding Tree', 'Debt Doors', 'Asset Biryani'].map(item => /*#__PURE__*/_jsx("div", {
                className: "whitespace-nowrap rounded-xl bg-white/5 border border-white/8 px-3.5 py-2 text-xs font-medium text-ink-muted",
                children: item
              }, item))
            })]
          })]
        })]
      })]
    })
  });
}