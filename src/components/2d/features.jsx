"use client";

import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, TrendingUp, ShieldCheck, Sparkles, Award } from 'lucide-react';

export function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald-soft text-xs font-semibold uppercase tracking-wider"
          >
            <Award size={12} />
            <span>Interactive Learning Modes</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-ink"
          >
            Custom Paths for Everyone, <br />
            <span className="text-gradient-emerald">Learn at Your Own Pace and Style!</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-ink-muted text-sm sm:text-base md:text-lg"
          >
            Financial literacy designed for Gen-Z, College Students, and First-Job Earners.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          {/* Card 1: College Students */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-emerald-500/10 flex flex-col justify-between relative overflow-hidden group shadow-premium"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald/5 rounded-full blur-2xl group-hover:bg-emerald/10 transition-colors" />
            <div className="space-y-4">
              <div className="inline-flex rounded-2xl bg-emerald/15 p-3.5 text-emerald-soft group-hover:scale-105 transition-transform duration-300">
                <GraduationCap size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">College Students</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Simple setup for pocket money and savings. Learn budget templates, micro-investing basics, and smart expense tracking without the stress.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-emerald-soft font-semibold">
              <span>Savings & Micro-budgeting</span>
              <Sparkles size={14} className="animate-pulse" />
            </div>
          </motion.div>

          {/* Card 2: First Job Earners */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-purple-500/10 flex flex-col justify-between relative overflow-hidden group shadow-premium"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-ai/5 rounded-full blur-2xl group-hover:bg-ai/10 transition-colors" />
            <div className="space-y-4">
              <div className="inline-flex rounded-2xl bg-ai/15 p-3.5 text-ai-soft group-hover:scale-105 transition-transform duration-300">
                <Briefcase size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">First Job Earners</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Start building wealth from your very first salary. SIP setups, emergency funds, tax options, and long-term investing rules explained simply.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-ai-soft font-semibold">
              <span>SIP, Investing & Taxes</span>
              <TrendingUp size={14} />
            </div>
          </motion.div>

          {/* Card 3: Teenagers */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card-premium rounded-[24px] p-6 border-b-4 border-gold-500/10 flex flex-col justify-between relative overflow-hidden group shadow-premium"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
            <div className="space-y-4">
              <div className="inline-flex rounded-2xl bg-gold/15 p-3.5 text-gold-soft group-hover:scale-105 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">Teenagers & School</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Learn how money works from the basics. Understand assets vs. liabilities, use safe financial simulators, and earn badges through interactive quizzes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gold-soft font-semibold">
              <span>Financial Simulator & Badges</span>
              <ShieldCheck size={14} />
            </div>
          </motion.div>

        </motion.div>

        {/* Why Us / Interactive games showreel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 glass-card-premium rounded-[28px] p-8 border-b-4 border-emerald-500/10 shadow-premium"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold text-emerald-soft uppercase tracking-wide">Why Capital Mastery?</span>
              <h3 className="font-display text-2xl font-bold text-ink">Interactive Strategies & Simulations</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                We don't just teach theory. We teach through interactive tools. Run live scenarios using Compounding Tree, Debt Doors, and Asset Allocation simulators to test your financial muscle!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Compounding Tree', 'Debt Doors Simulator', 'Asset Allocation Biryani'].map(item => (
                  <span key={item} className="text-xs bg-white/5 border border-white/8 text-ink-muted px-3.5 py-1.5 rounded-xl font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="relative p-6 bg-emerald/5 border border-emerald/10 rounded-2xl w-full text-center">
                <h4 className="text-sm font-bold text-ink mb-1">Interactive modules</h4>
                <p className="text-xs text-ink-muted mb-4">11 Modules ready with quizzes</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(11)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i < 5 ? 'bg-emerald shadow-glow-emerald' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-soft font-semibold mt-3 block">Level UP with each complete module!</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}