"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------
// 1. Barter vs Money (Module 1 - Card 1)
// ----------------------------------------------------------------------
export function BarterAnimation({ color }) {
  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.05]">
      {/* Background glow */}
      <motion.div 
        className="absolute w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Left side: Book */}
      <motion.div 
        className="absolute left-1/4 text-4xl"
        initial={{ y: 0 }}
        animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        📖
      </motion.div>

      {/* Right side: Tea */}
      <motion.div 
        className="absolute right-1/4 text-4xl"
        initial={{ y: 0 }}
        animate={{ y: [5, -5, 5], rotate: [2, -2, 2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ☕
      </motion.div>

      {/* Center: Exchange failing (X) then turning into Money */}
      <motion.div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 0, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          className="text-red-500 font-bold text-2xl"
        >
          ❌
        </motion.div>
        <motion.div
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">💵</span>
        </motion.div>
      </motion.div>

      {/* Arrows */}
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
        <motion.path 
          d="M 35% 50% L 65% 50%" 
          stroke={color} 
          strokeWidth="2" 
          strokeDasharray="5,5" 
          fill="none"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. UPI Network (Module 1 - Card 3)
// ----------------------------------------------------------------------
export function UPINetworkAnimation({ color }) {
  const nodes = Array.from({ length: 6 }).map((_, i) => ({
    x: 50 + 35 * Math.cos((i * Math.PI) / 3),
    y: 50 + 35 * Math.sin((i * Math.PI) / 3),
  }));

  return (
    <div className="relative w-full h-48 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {nodes.map((node, i) => (
          <motion.line
            key={`line-${i}`}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={`pulse-${i}`}
            cx={node.x}
            cy={node.y}
            r="2"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill={color} className="opacity-20" />
        <circle cx="50" cy="50" r="4" fill={color} />
      </svg>
      <div className="absolute text-2xl drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">₹</div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. Shrinking Note (Module 1 - Card 5 - Inflation)
// ----------------------------------------------------------------------
export function ShrinkingNoteAnimation({ color }) {
  return (
    <div className="relative w-full h-48 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ 
            width: [160, 100, 70], 
            height: [80, 50, 35],
            opacity: [1, 0.7, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-emerald-600 rounded-md border-2 border-emerald-400 flex items-center justify-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 border-2 border-white/20 m-1 rounded-sm border-dashed" />
          <span className="text-white font-bold tracking-widest text-lg drop-shadow-md">₹100</span>
        </motion.div>
        
        <div className="flex gap-8 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <motion.span animate={{ opacity: [1, 0, 0] }} transition={{ duration: 4, repeat: Infinity }}>Today</motion.span>
          <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }}>5 Years</motion.span>
          <motion.span animate={{ opacity: [0, 0, 1] }} transition={{ duration: 4, repeat: Infinity }}>10 Years</motion.span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Budget Pie Split (Module 2 - Card 1 - 50/30/20)
// ----------------------------------------------------------------------
export function BudgetPieAnimation({ color }) {
  return (
    <div className="relative w-full h-56 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      <svg width="140" height="140" viewBox="0 0 100 100" className="transform -rotate-90">
        {/* Needs: 50% */}
        <motion.circle
          cx="50" cy="50" r="40"
          fill="none" stroke="#10B981" strokeWidth="20"
          strokeDasharray="125 125" /* 50% of 2*pi*r (r=40, circum=251.2) */
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: [251.2, 0, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Wants: 30% */}
        <motion.circle
          cx="50" cy="50" r="40"
          fill="none" stroke="#F59E0B" strokeWidth="20"
          strokeDasharray="75.36 175.84"
          strokeDashoffset="-125.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />
        {/* Savings: 20% */}
        <motion.circle
          cx="50" cy="50" r="40"
          fill="none" stroke="#8B5CF6" strokeWidth="20"
          strokeDasharray="50.24 200.96"
          strokeDashoffset="-200.96"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col pt-1">
        <motion.span 
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="text-2xl"
        >
          💰
        </motion.span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Needs vs Wants Scale (Module 2 - Card 3)
// ----------------------------------------------------------------------
export function NeedsWantsScaleAnimation({ color }) {
  return (
    <div className="relative w-full h-48 flex flex-col items-center justify-end pb-8 rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      {/* Stand */}
      <div className="w-1.5 h-20 bg-zinc-600 rounded-t-md relative z-10" />
      <div className="w-16 h-2 bg-zinc-600 rounded-md absolute bottom-8 z-10" />
      
      {/* Beam */}
      <motion.div 
        className="w-48 h-1.5 bg-zinc-500 rounded-full absolute bottom-28 origin-bottom"
        animate={{ rotate: [-10, 5, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Left hanging line (Needs) */}
        <div className="absolute -left-0.5 top-0 w-0.5 h-12 bg-zinc-500/50" />
        {/* Right hanging line (Wants) */}
        <div className="absolute -right-0.5 top-0 w-0.5 h-12 bg-zinc-500/50" />
      </motion.div>

      {/* Left pan: Needs (Heavy) */}
      <motion.div 
        className="absolute bottom-16 left-1/4 -ml-4 flex flex-col items-center"
        animate={{ y: [-15, 10, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-3xl mb-1">🏠</span>
        <div className="w-12 h-2 rounded-full bg-emerald-500" />
      </motion.div>

      {/* Right pan: Wants (Light) */}
      <motion.div 
        className="absolute bottom-16 right-1/4 -mr-4 flex flex-col items-center"
        animate={{ y: [15, -10, 15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-3xl mb-1">🎮</span>
        <div className="w-12 h-2 rounded-full bg-red-500" />
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. Buffer Tank (Module 2 - Card 6.1)
// ----------------------------------------------------------------------
export function BufferTankAnimation({ color }) {
  return (
    <div className="relative w-full h-56 flex flex-col items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      
      {/* Faucet (Income) */}
      <div className="absolute top-4 w-6 h-6 border-l-4 border-t-4 border-zinc-400 rounded-tl-lg" />
      
      {/* Water Drops */}
      <motion.div 
        className="absolute top-10 w-3 h-3 bg-blue-400 rounded-full"
        animate={{ y: [0, 80], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
      />
      <motion.div 
        className="absolute top-10 w-2 h-2 bg-blue-300 rounded-full"
        animate={{ y: [0, 80], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn", delay: 0.5 }}
      />

      {/* Tank container */}
      <div className="w-32 h-32 border-4 border-zinc-600 rounded-b-xl rounded-t-sm relative overflow-hidden mt-8 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        {/* Buffer liquid level */}
        <motion.div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 to-amber-400"
          animate={{ height: ['20%', '80%', '20%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Surface wave */}
          <motion.div 
            className="w-[200%] h-4 bg-amber-300/30 rounded-full absolute -top-2 -left-1/2"
            animate={{ x: ['0%', '20%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Drain pipe (Expenses) */}
      <div className="w-2 h-8 bg-zinc-600 absolute bottom-0" />
      <motion.div 
        className="absolute bottom-0 w-1 h-1 bg-amber-400 rounded-full"
        animate={{ y: [0, 20], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Export Registry
// ----------------------------------------------------------------------
export function InteractiveSVGViewer({ type, color = "#3B82F6" }) {
  switch (type) {
    case 'barter_system':
      return <BarterAnimation color={color} />;
    case 'upi_network':
      return <UPINetworkAnimation color={color} />;
    case 'inflation_shrinking':
      return <ShrinkingNoteAnimation color={color} />;
    case 'budget_pie':
      return <BudgetPieAnimation color={color} />;
    case 'needs_wants_scale':
      return <NeedsWantsScaleAnimation color={color} />;
    case 'buffer_tank':
      return <BufferTankAnimation color={color} />;
    default:
      return null;
  }
}
