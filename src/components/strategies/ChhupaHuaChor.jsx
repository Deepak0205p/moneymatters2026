'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { Skull, TrendingDown, Info, Coins, Clock, Percent, Shield, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

const ITEMS = [
  { id: 'chai', name: 'Tapri Chai ☕', basePrice: 10, unit: 'Cups' },
  { id: 'petrol', name: 'Petrol ⛽', basePrice: 100, unit: 'Litres' },
  { id: 'iphone', name: 'Smartphone 📱', basePrice: 25000, unit: 'Phones' },
  { id: 'rent', name: 'Monthly Rent 🏠', basePrice: 10000, unit: 'Months' },
  { id: 'fees', name: 'College Fees 🎓', basePrice: 200000, unit: 'Semesters' }
];

function useCountUp(target, duration = 400) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);
  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) return;
    const startTime = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (end - start) * eased;
      setValue(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      prevRef.current = end;
    };
  }, [target, duration]);
  return value;
}

function formatINR(n) {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${Math.round(abs)}`;
}

export default function ChhupaHuaChor() {
  const { addCoins } = useAppStore();
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const [selectedItemId, setSelectedItemId] = useState('petrol');
  const [investmentMode, setInvestmentMode] = useState('CASH'); // CASH or INVEST

  const selectedItem = useMemo(() => ITEMS.find(i => i.id === selectedItemId), [selectedItemId]);

  // Real value after inflation
  const realValue = useMemo(() => amount / Math.pow(1 + rate / 100, years), [amount, years, rate]);
  
  // Value if invested at 12% returns
  const investedValue = useMemo(() => amount * Math.pow(1 + 0.12, years), [amount, years]);
  const investedRealValue = useMemo(() => investedValue / Math.pow(1 + rate / 100, years), [investedValue, years, rate]);

  const lostPct = ((amount - realValue) / amount) * 100;
  
  // Future Price of selected item due to inflation
  const itemFuturePrice = useMemo(() => selectedItem.basePrice * Math.pow(1 + rate / 100, years), [selectedItem, rate, years]);

  // Quantities buyable today vs future
  const qtyToday = useMemo(() => amount / selectedItem.basePrice, [amount, selectedItem]);
  const qtyFutureCash = useMemo(() => amount / itemFuturePrice, [amount, itemFuturePrice]);
  const qtyFutureInvest = useMemo(() => investedValue / itemFuturePrice, [investedValue, itemFuturePrice]);

  const animatedRealValue = useCountUp(realValue);
  const animatedLostPct = useCountUp(lostPct);
  const animatedInvestedRealValue = useCountUp(investedRealValue);
  
  // Graph calculations for 30 years
  const graphPoints = useMemo(() => {
    const pts = [];
    for (let y = 0; y <= 30; y++) {
      const cashVal = amount / Math.pow(1 + rate / 100, y);
      const invReal = (amount * Math.pow(1 + 0.12, y)) / Math.pow(1 + rate / 100, y);
      pts.push({ year: y, cash: cashVal, invest: invReal });
    }
    return pts;
  }, [amount, rate]);

  const maxGraphVal = useMemo(() => {
    return Math.max(...graphPoints.map(p => Math.max(p.cash, p.invest))) * 1.05;
  }, [graphPoints]);

  const gWidth = 500;
  const gHeight = 150;
  const gPad = 15;

  const getGX = (y) => gPad + (y / 30) * (gWidth - 2 * gPad);
  const getGY = (val) => gHeight - gPad - (val / maxGraphVal) * (gHeight - 2 * gPad);

  // Robber distance decreases (closer to money) as years increase
  const robberTranslateX = (years / 30) * 110; // 0 to 110px

  return (
    <div 
      className="w-full space-y-6 rounded-[32px] p-6 sm:p-8 border border-white/[0.08] text-left relative overflow-hidden transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, rgba(239, 68, 68, ${0.03 + (years/30) * 0.1}), rgba(15, 19, 38, 0.95))`
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black text-red-400 flex items-center justify-center gap-2">
          <Skull className="animate-bounce text-red-500" size={28} /> Chhupa Hua Chor (Inflation)
        </h2>
        <p className="text-xs text-zinc-400">Silent money killer simulator. Dekho kaise inflation tumhari savings ko kha jata hai!</p>
      </div>

      {/* Warning Box */}
      <AnimatePresence>
        {lostPct >= 40 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3"
          >
            <AlertTriangle className="shrink-0 text-red-500" size={20} />
            <div>
              <p className="uppercase tracking-wider">Inflation Alert!</p>
              <p className="text-zinc-300 font-medium mt-0.5">
                Inflation ne aapke cash ki buying power ko <span className="text-red-400 font-black">{Math.round(animatedLostPct)}%</span> se khatam kar diya hai!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The robbery simulator (Interactive Canvas) */}
      <div className="bg-[#0B0E19] border border-white/[0.04] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden min-h-[180px]">
        {/* Left Side: Inflation Robber */}
        <div className="flex flex-col items-center gap-2 relative">
          <motion.div 
            animate={{ 
              x: robberTranslateX,
              y: [0, -3, 0] 
            }}
            transition={{
              x: { type: 'spring', stiffness: 50 },
              y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="text-7xl relative z-10"
          >
            {years >= 20 ? '👹' : '🥷'}
          </motion.div>
          <span className="text-[10px] font-black uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            Chor (Inflation)
          </span>
        </div>

        {/* Center: Theft Vector representation */}
        <div className="flex-1 w-full flex items-center justify-center pointer-events-none relative min-h-[40px]">
          <div className="w-full h-0.5 bg-dashed border-t border-dashed border-white/10" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute text-xl"
          >
            💸
          </motion.div>
        </div>

        {/* Right Side: Money Stack */}
        <div className="flex flex-col items-center gap-2">
          <motion.div 
            animate={{ 
              scale: Math.max(0.4, realValue / amount),
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              scale: { type: 'spring', stiffness: 60 },
              rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="text-6xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            💰
          </motion.div>
          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Aapki Savings
          </span>
        </div>
      </div>

      {/* Numerical Impact Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash in Almirah View */}
        <div 
          onClick={() => setInvestmentMode('CASH')}
          className={`rounded-3xl p-5 border transition-all cursor-pointer ${
            investmentMode === 'CASH' 
              ? 'bg-red-500/5 border-red-500/40 shadow-lg shadow-red-500/5' 
              : 'bg-[#0F1326]/50 border-white/[0.04] opacity-60 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black tracking-wider text-red-400 uppercase">Option A: Cash in Almirah (Safe?)</span>
            <div className={`w-3.5 h-3.5 rounded-full border border-red-500/30 flex items-center justify-center`}>
              {investmentMode === 'CASH' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            </div>
          </div>
          <p className="text-xs text-zinc-400">Paisa tijori mein band hai, na koi interest mila na tax laga.</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Nominal Value:</span>
              <span className="font-extrabold text-white">{formatINR(amount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Real Purchasing Power:</span>
              <span className="font-extrabold text-red-400">{formatINR(animatedRealValue)}</span>
            </div>
          </div>
        </div>

        {/* Invested in SIP View */}
        <div 
          onClick={() => setInvestmentMode('INVEST')}
          className={`rounded-3xl p-5 border transition-all cursor-pointer ${
            investmentMode === 'INVEST' 
              ? 'bg-emerald-500/5 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
              : 'bg-[#0F1326]/50 border-white/[0.04] opacity-60 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">Option B: Invested in Mutual Fund (12%)</span>
            <div className={`w-3.5 h-3.5 rounded-full border border-emerald-500/30 flex items-center justify-center`}>
              {investmentMode === 'INVEST' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </div>
          </div>
          <p className="text-xs text-zinc-400">Paisa compounding growth ke sath grow kiya at 12% per year.</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Grown Value (Future):</span>
              <span className="font-extrabold text-white">{formatINR(investedValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Real Purchasing Power:</span>
              <span className="font-extrabold text-emerald-400">{formatINR(animatedInvestedRealValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Items Simulator (Buying Power visualization) */}
      <div className="bg-[#0F1326] border border-white/[0.06] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Practical Buying Power Simulator</h4>
            <p className="text-[11px] text-zinc-500">Select an item below to see how many units you can buy with your funds</p>
          </div>
          <select 
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="bg-[#0B0E19] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer hover:border-white/20"
          >
            {ITEMS.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Today's Buy Capacity */}
          <div className="bg-black/25 rounded-2xl p-4 border border-white/[0.03]">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Today</span>
            <p className="text-lg font-black text-white mt-1">
              {qtyToday.toFixed(0)} <span className="text-xs font-normal text-zinc-400">{selectedItem.unit}</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Price: {formatINR(selectedItem.basePrice)} per unit</p>
          </div>

          {/* Future Buy Capacity */}
          <div className="bg-black/25 rounded-2xl p-4 border border-white/[0.03] relative">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
              {years} Years Later ({investmentMode === 'CASH' ? 'Cash Option' : 'Investment Option'})
            </span>
            <p className={`text-lg font-black mt-1 ${investmentMode === 'CASH' ? 'text-red-400' : 'text-emerald-400'}`}>
              {(investmentMode === 'CASH' ? qtyFutureCash : qtyFutureInvest).toFixed(0)}{' '}
              <span className="text-xs font-normal text-zinc-400">{selectedItem.unit}</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Price: {formatINR(itemFuturePrice)} per unit</p>

            {investmentMode === 'CASH' ? (
              <div className="absolute right-3 top-3 text-[10px] font-black px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded">
                -{Math.round((1 - qtyFutureCash/qtyToday)*100)}% Capacity
              </div>
            ) : (
              <div className="absolute right-3 top-3 text-[10px] font-black px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                +{Math.round((qtyFutureInvest/qtyToday - 1)*100)}% Capacity
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Graph for visual representation */}
      <div className="bg-[#0F1326] border border-white/[0.06] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Inflation Decay vs Investment Growth Curve</h4>
            <p className="text-[11px] text-zinc-500">Visualizing 30 years timeline. Green = Invested Real value, Red = Cash Real value</p>
          </div>
        </div>

        <div className="relative h-40 w-full bg-black/40 rounded-xl border border-white/[0.04] p-1 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox={`0 0 ${gWidth} ${gHeight}`} preserveAspectRatio="none">
            {/* Grid Line */}
            <line x1={gPad} y1={getGY(amount)} x2={gWidth-gPad} y2={getGY(amount)} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            
            {/* Cash Line (Decay) */}
            <path 
              d={graphPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getGX(p.year)} ${getGY(p.cash)}`).join(' ')}
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Invest Line (Real Growth) */}
            <path 
              d={graphPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getGX(p.year)} ${getGY(p.invest)}`).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Current Year Marker */}
            <line 
              x1={getGX(years)} 
              y1={gPad} 
              x2={getGX(years)} 
              y2={gHeight - gPad} 
              stroke="rgba(255,255,255,0.25)" 
              strokeWidth="1.5" 
              strokeDasharray="2 2" 
            />

            {/* Dots */}
            <circle cx={getGX(years)} cy={getGY(realValue)} r="4" fill="#EF4444" stroke="#fff" strokeWidth="1" />
            <circle cx={getGX(years)} cy={getGY(investedRealValue)} r="4" fill="#10B981" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Sliders Controllers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Amount Slider */}
        <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Amount</span>
            <span className="text-xs font-bold text-amber-400">{formatINR(amount)}</span>
          </div>
          <input 
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Years Slider */}
        <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Time Travel</span>
            <span className="text-xs font-bold text-red-400">{years} Years</span>
          </div>
          <input 
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-red-400"
          />
        </div>

        {/* Inflation Rate Slider */}
        <div className="bg-[#0B0E19] border border-white/[0.04] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Inflation Rate</span>
            <span className="text-xs font-bold text-emerald-400">{rate}%</span>
          </div>
          <input 
            type="range"
            min={4}
            max={12}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      </div>

      {/* Info & Action Beat Button */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4 flex items-start gap-3 border border-white/[0.05]">
          <Info className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <p className="text-xs text-white font-extrabold">💡 Chor Ko Harane Ki Strategy:</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Inflation se bachane ka ek hi tarika hai: aise assets me invest karna jo inflation rate (6%) se zyada returns de sakein.
              Agar aap cash ko almirah me rakhenge, toh uski purchasing power khatam ho jayegi. But regular investment (Equity, Mutual Funds) compounding ke zariye aapke wealth ko inflation se aage badha deti hai.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => addCoins(15)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Shield size={16} /> Inflation Beat Karna Seekha! +15 Coins
        </motion.button>
      </div>
    </div>
  );
}