'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Navigation, GitBranch, Eye, Layers, Home, 
  DoorOpen, TreePine, Award, BookOpen, Clock, Store, Construction
} from 'lucide-react';
import { strategies } from '@/lib/data/strategies';

const ICON_MAP = { Navigation, GitBranch, Eye, Layers, Home, DoorOpen, TreePine, Award, BookOpen, Clock, Store };

function getIcon(iconName) {
  if (!iconName) return Construction;
  return ICON_MAP[iconName] || Construction;
}

const getSlug = (strategy) => {
  if (strategy.slug) return strategy.slug;
  const nameMap = {
    'FinancialGPS': 'paise-ka-gps',
    'ConsequenceSim': 'kya-hota-agar',
    'KyaHotaAgar': 'kya-hota-agar',
    'InflationMonster': 'chhupa-hua-chor',
    'SwipeBudget': 'budget-khel',
    'RoomBudget': 'ghar-ka-budget',
    'DebtDoors': 'debt-trap-darwaza',
    'CompoundingTree': 'compounding-tree',
    'ReportCard': 'financial-health-report-card',
    'Dictionary': 'rupaiya-dictionary',
    'DailySimulator': 'ek-din-ka-kharcha',
    'MistakeMarket': 'mistake-market'
  };
  return nameMap[strategy.componentName] || strategy.title.toLowerCase().replace(/\s+/g, '-');
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 70, damping: 15 }
  }
};

export default function GamifiedPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const openStrategyViewer = (slug) => {
    router.push(`/home/gamified?strategy=${slug}`);
  };

  const getDifficulty = (priority) => {
    if (priority === 'highest' || priority === 'high') 
      return { label: 'Advanced 🔴', coins: '+100 Coins', filter: 'ADVANCED' };
    if (priority === 'medium') 
      return { label: 'Intermediate 🟡', coins: '+50 Coins', filter: 'INTERMEDIATE' };
    return { label: 'Beginner 🟢', coins: '+30 Coins', filter: 'BEGINNER' };
  };

  const filteredStrategies = strategies.filter(strategy => {
    if (activeFilter === 'ALL') return true;
    return getDifficulty(strategy.priority).filter === activeFilter;
  });

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 max-w-5xl mx-auto text-left relative"
    >
      {/* Ambient Background Glows — matching tools page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald-500/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-indigo-500/[0.06] blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-1 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}
          >
            <Brain size={20} className="text-[#0a0f1e]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">Visual Learning Strategies</h2>
            <p className="text-xs text-zinc-400">11 visual + gamified financial learning experiences</p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pb-1 relative z-10">
        {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/20 border border-transparent scale-105'
                  : 'bg-[#0F1326] border border-white/[0.07] text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </motion.div>

      {/* Strategy Cards Grid */}
      <motion.div
        layout
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredStrategies.map((strategy, i) => {
            const Icon = getIcon(strategy.icon);
            const difficulty = getDifficulty(strategy.priority);

            return (
              <motion.button
                layout
                key={strategy.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 45px rgba(0, 0, 0, 0.5), 0 0 30px ${strategy.color}15`,
                  borderColor: `${strategy.color}40`
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openStrategyViewer(getSlug(strategy))}
                className="group relative text-left rounded-3xl p-6 border border-white/[0.07] bg-gradient-to-b from-[#0F1326]/90 to-[#0B0F19]/95 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                {/* Colored ambient glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[70px] opacity-15 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500 pointer-events-none"
                  style={{ backgroundColor: strategy.color }}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top row: icon + badges */}
                  <div className="flex items-start justify-between mb-5">
                    {/* Icon Box — rounded-2xl, matches tools page */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg"
                      style={{
                        backgroundColor: `${strategy.color}15`,
                        border: `1px solid ${strategy.color}25`
                      }}
                    >
                      <Icon size={24} style={{ color: strategy.color }} />
                    </div>

                    {/* S-XX badge + Coins badge */}
                    <div className="flex gap-1.5 items-center">
                      <span
                        className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${strategy.color}15`,
                          color: strategy.color,
                          border: `1px solid ${strategy.color}25`
                        }}
                      >
                        S-{String(strategy.id).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {difficulty.coins}
                      </span>
                    </div>
                  </div>

                  {/* Title + Description */}
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-white mb-1.5 group-hover:text-emerald-400 transition-colors duration-300">
                      {strategy.title}
                    </h3>
                    <p className="text-[12px] text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed line-clamp-3 mb-4">
                      {strategy.description || strategy.titleEn}
                    </p>
                  </div>

                  {/* Footer: difficulty + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] group-hover:border-white/[0.1] transition-colors">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
                      <span>{difficulty.label}</span>
                    </div>

                    <motion.div
                      whileHover={{
                        backgroundColor: `${strategy.color}25`,
                        borderColor: `${strategy.color}40`,
                        boxShadow: `0 0 12px ${strategy.color}40`,
                        x: 2
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white group-hover:text-white transition-all flex items-center gap-1"
                    >
                      KHELO 🎮
                      <Zap size={10} className="text-amber-400" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center py-4 border-t border-white/[0.03] relative z-10">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
          Money Matters — Learning Hub
        </p>
      </motion.div>
    </motion.div>
  );
}
