"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Zap, Award, BookOpen, Sparkles, Flame, Trophy, Heart, HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Hero } from '@/components/2d/hero';
import { Features } from '@/components/2d/features';
import { Gamification } from '@/components/2d/gamification';
import { Navbar } from '@/components/2d/navbar';
import { useRouter } from 'next/navigation';

function LightStreaks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-emerald/20 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
            top: '-30vh',
            filter: 'blur(1px)',
            transform: 'rotate(35deg)'
          }}
          animate={{
            top: ['-30vh', '130vh'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

function FloatingSymbols() {
  const symbols = useMemo(() => [
    { Icon: Coins, color: '#F59E0B', size: 24, top: '15%', left: '10%', delay: 0, dur: 12 },
    { Icon: TrendingUp, color: '#10B981', size: 32, top: '45%', left: '85%', delay: 2, dur: 14 },
    { Icon: Zap, color: '#8B5CF6', size: 28, top: '75%', left: '15%', delay: 4, dur: 10 },
    { Icon: Award, color: '#FBBF24', size: 20, top: '25%', left: '70%', delay: 1, dur: 13 },
    { Icon: BookOpen, color: '#38BDF8', size: 22, top: '60%', left: '80%', delay: 3, dur: 11 },
    { Icon: Sparkles, color: '#EC4899', size: 26, top: '85%', left: '90%', delay: 5, dur: 15 },
    { Icon: Trophy, color: '#F59E0B', size: 30, top: '10%', left: '50%', delay: 2.5, dur: 9 },
    { Icon: Flame, color: '#EF4444', size: 24, top: '40%', left: '5%', delay: 1.5, dur: 16 }
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.10]">
      {symbols.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: item.top,
            left: item.left
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: item.dur,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut'
          }}
        >
          <item.Icon
            size={item.size}
            style={{
              color: item.color,
              filter: `drop-shadow(0 0 10px ${item.color}40)`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function Background2D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight">
      <FloatingSymbols />
      <LightStreaks />
      <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
      <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Is this app completely free?",
      a: "Yes! Our goal is to spread financial literacy. All 11 modules, interactive strategy tests, simulators, and AI advice are fully free."
    },
    {
      q: "What financial topics are covered?",
      a: "We cover budgeting, saving, investing, taxation, banking, insurance, debt management, and financial independence — all in plain, easy-to-understand English."
    },
    {
      q: "What if I encounter a login or signup error?",
      a: "If Google login or the normal login/signup process encounters Firebase config errors, you can click the 'Continue as Guest (Local Demo)' button to access the full application."
    },
    {
      q: "What are Coins and Badges used for?",
      a: "They are progress trackers! You earn coins and badges for completing each module, quiz, or strategy, which increases your in-app rank and secures your learning levels."
    }
  ];

  return (
    <section className="py-16 md:py-24 relative z-10 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ai/10 border border-ai/20 text-ai-soft text-xs font-semibold uppercase tracking-wider">
          <HelpCircle size={13} />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="font-display text-2xl font-bold md:text-3xl text-ink">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="glass-card-premium rounded-2xl border-b-2 border-white/5 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-base font-semibold text-ink hover:text-emerald-soft transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-soft' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 pt-0 text-sm text-ink-muted leading-relaxed border-t border-white/5 bg-white/[0.01]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Background2D />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Gamification />
        <FAQAccordion />

        {/* CTA Banner Section */}
        <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 relative z-10">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center bg-gradient-to-tr from-midnight-soft to-midnight border border-white/10 shadow-premium border-b-8 border-emerald-500/20">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-ai/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h3 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl text-ink leading-tight">
                So, <span className="text-gradient-brand">When Are You Starting?</span>
              </h3>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                Learn new strategies, simulate compound investing, and become financially independent. Join our learning journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(16,185,129,0.30)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/home')}
                  className="btn-emerald flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-base font-bold cursor-pointer border-b-4 border-emerald-600"
                >
                  <Sparkles size={16} className="text-midnight fill-current" />
                  <span>Start Free Account</span>
                  <ArrowRight size={16} className="text-midnight" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-12 text-center border-t border-white/5 bg-midnight-deep/40 relative z-10"
        >
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0 0 14px rgba(16,185,129,0.30)' }}
              >
                <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-base font-bold font-display text-ink">
                Capital<span className="text-gradient-brand"> Mastery</span>
              </span>
            </div>
            <p className="text-xs text-ink-muted/80 flex items-center justify-center gap-1.5 leading-relaxed">
              Made with <Heart size={12} className="text-rose-400 fill-current" /> for Indian Youth · © 2026 Money Matters
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}