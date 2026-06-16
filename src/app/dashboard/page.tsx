"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { Navbar } from '@/components/2d/navbar';
import { AIChatBot } from '@/components/2d/AIChatBot';
import { modules, getModuleById, getAllCardsForModule } from '@/data/modulesIndex';
import type { ModuleSection } from '@/data/types';
import {
  Coins, Trophy, Flame, ChevronRight, Share2, X, Zap, Play, BookOpen,
  Clock, CheckCircle2, Sparkles, Wrench, ArrowRight, ArrowLeft, ArrowUp,
  Bookmark, FileText, Send, Trash2, Lock,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ════════════════════════════════════════════════════════════════════════════
const RAINBOW_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3',
  '#10AC84', '#5F27CD', '#EE5A24', '#6C5CE7', '#FDA7DF',
  '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F0E68C',
  '#FF6348', '#7BED9F', '#70A1FF', '#FFA502', '#FF6B81',
  '#2ED573', '#1E90FF', '#FF4757', '#ECCC68', '#A4B0BE',
];

const QUOTES = [
  'Paisa invest karo, future secure karo!',
  'Har rupee ek soldier hai — use wisely!',
  'Compounding ka jadoo samjho, aur ameer bano!',
  'Debt se bachna = financial freedom ka pehla step',
];

// ════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ════════════════════════════════════════════════════════════════════════════
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ════════════════════════════════════════════════════════════════════════════
// FINANCE TICKER
// ════════════════════════════════════════════════════════════════════════════
function FinanceTicker() {
  const messages = [
    'Bhai, SIP miss mat karna! Compounding ka jadoo wahin se shuru hota hai. ✨',
    'Emergency Fund = Financial Insurance. Pehle ise build karo! 🛡️',
    'Credit Card ka minimum payment trap hai! Hamesha full pay karo. 💳',
    "Inflation ek silent chor hai. Apne paise ko invest karo, sirf save nahi! 📉",
    'Wealth is what you don\'t see. Ameer mat dikho, ameer bano! 🕵️',
    'Pehla rule: Khud pe invest karo. Skills = Best Returns. 🎓',
  ];
  return (
    <div className="w-full bg-emerald/10 border-y border-emerald/20 py-2 overflow-hidden whitespace-nowrap relative">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex gap-12 items-center"
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-[10px] font-bold text-emerald-soft uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} fill="currentColor" /> {msg}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-midnight to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-midnight to-transparent z-10" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RICH CONTENT PARSER (markdown-like → React)
// ════════════════════════════════════════════════════════════════════════════
function parseInline(text: string, color: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|(₹[\d,./+\-% ]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={key++} className="text-white font-bold">{m[1]}</strong>);
    else if (m[2]) parts.push(<em key={key++} className="text-zinc-200 italic">{m[2]}</em>);
    else if (m[3]) parts.push(<code key={key++} className="bg-white/10 text-emerald-300 px-1 py-0.5 rounded text-[12px] font-mono">{m[3]}</code>);
    else if (m[4]) parts.push(<span key={key++} className="font-bold" style={{ color }}>{m[4]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function RichContent({ content, color }: { content: string; color: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  let i = 0;
  let blockKey = 0;

  const toggleCheck = (id: string) => setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  while (i < lines.length) {
    const line = lines[i];

    // WhatsApp Chat Simulator
    if (line.includes(': *') || (line.includes('**') && line.includes(':'))) {
      const match = line.match(/^([\w ]+): (.*)$/);
      if (match) {
        const name = match[1];
        const text = match[2];
        const isBhaiya = name.toLowerCase().includes('bhai') || name.toLowerCase().includes('mentor');
        blocks.push(
          <motion.div
            key={blockKey++}
            initial={{ opacity: 0, x: isBhaiya ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col mb-4 ${isBhaiya ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] font-bold text-zinc-500 mb-1 px-2 uppercase tracking-wider">{name}</span>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                isBhaiya ? 'rounded-tr-none' : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none'
              }`}
              style={isBhaiya ? { backgroundColor: `${color}ee`, color: '#000' } : {}}
            >
              {parseInline(text, isBhaiya ? '#000' : color)}
            </div>
          </motion.div>
        );
        i++; continue;
      }
    }

    // Mission Alert
    if (line.includes('🚨') && (line.includes('MISSION') || line.includes('ALERT'))) {
      const missionTitle = line.trim();
      i++;
      const missionLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('🚨')) {
        missionLines.push(lines[i].trim());
        i++;
      }
      blocks.push(
        <motion.div
          key={blockKey++}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="my-6 p-5 rounded-2xl border-2 border-dashed relative overflow-hidden bg-white/[0.02]"
          style={{ borderColor: `${color}40` }}
        >
          <div className="absolute top-0 right-0 p-2 opacity-10"><Zap size={40} style={{ color }} /></div>
          <h4 className="text-sm font-black tracking-tighter uppercase mb-3 flex items-center gap-2" style={{ color }}>{missionTitle}</h4>
          <div className="space-y-3">
            {missionLines.map((mLine, mi) => {
              const isCheckbox = mLine.startsWith('[ ]') || mLine.startsWith('[]');
              const cleanLine = mLine.replace(/^\[\s?\]\s?/, '');
              const id = `mission-${blockKey}-${mi}`;
              if (isCheckbox) {
                return (
                  <div key={mi} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleCheck(id)}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${checkedItems[id] ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {checkedItems[id] && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-[13px] leading-snug transition-all ${checkedItems[id] ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{parseInline(cleanLine, color)}</span>
                  </div>
                );
              }
              return <p key={mi} className="text-[13px] text-zinc-300 leading-relaxed">{parseInline(mLine, color)}</p>;
            })}
          </div>
        </motion.div>
      );
      continue;
    }

    // Table
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('|') || lines[i].trim() === '')) {
        if (lines[i].trim().startsWith('|')) tableLines.push(lines[i]);
        i++;
      }
      const rowLines = tableLines.filter((l) => !l.match(/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)*\|?$/));
      if (rowLines.length > 0) {
        const rows = rowLines.map((l) => l.split('|').slice(1, -1).map((cell) => cell.trim()));
        const isHeader = rowLines.length > 1 && tableLines[1]?.match(/^\|\s*[-:]+/);
        blocks.push(
          <div key={blockKey++} className="overflow-x-auto rounded-xl border border-white/10 mt-3 mb-2">
            <table className="w-full text-[12px] border-collapse">
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri === 0 && isHeader ? 'border-b border-white/15' : ri % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                    {row.map((cell, ci) =>
                      ri === 0 && isHeader ? (
                        <th key={ci} className="px-3 py-2 text-left font-semibold text-zinc-200" style={{ color: ci === 0 ? color : undefined }}>{parseInline(cell, color)}</th>
                      ) : (
                        <td key={ci} className={`px-3 py-2 text-zinc-300 ${ci === 0 ? 'font-medium' : ''}`}>{parseInline(cell, color)}</td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    // Section header
    if (line.match(/^[A-Z][A-Z0-9 ()]{5,}$/) && !line.includes('₹')) {
      blocks.push(<p key={blockKey++} className="text-[10px] font-extrabold tracking-[0.15em] uppercase mt-4 mb-1" style={{ color }}>{line}</p>);
      i++; continue;
    }

    // Bullet list
    if (line.trim().match(/^[-•*✅❌]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-•*✅❌]\s/)) {
        items.push(lines[i].trim().replace(/^[-•*✅❌]\s/, ''));
        i++;
      }
      blocks.push(
        <ul key={blockKey++} className="space-y-1.5 mt-2 mb-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-zinc-300 text-[13px] leading-relaxed">
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span>{parseInline(item, color)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.trim().match(/^\d+[.)] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+[.)] /)) {
        items.push(lines[i].trim().replace(/^\d+[.)] /, ''));
        i++;
      }
      blocks.push(
        <ol key={blockKey++} className="space-y-2 mt-2 mb-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2.5 text-zinc-300 text-[13px] leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>{idx + 1}</span>
              <span className="pt-0.5">{parseInline(item, color)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Arrow line
    if (line.includes('↓') || line.includes('→') || line.includes('←') || line.includes('↑')) {
      blocks.push(<p key={blockKey++} className="text-zinc-400 text-[12px] leading-relaxed font-mono pl-2 my-0.5">{parseInline(line, color)}</p>);
      i++; continue;
    }

    blocks.push(<p key={blockKey++} className="text-zinc-300 text-[13.5px] leading-[1.85] font-normal">{parseInline(line, color)}</p>);
    i++;
  }

  return <div className="space-y-1">{blocks}</div>;
}

// ════════════════════════════════════════════════════════════════════════════
// RAINBOW PROGRESS BAR
// ════════════════════════════════════════════════════════════════════════════
function RainbowProgress({ currentIndex, totalCount }: { currentIndex: number; totalCount: number }) {
  return (
    <div className="flex items-center gap-[2px] px-4 pt-3 pb-1 flex-shrink-0">
      {Array.from({ length: totalCount }).map((_, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const color = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
        return (
          <div
            key={i}
            className="h-[3px] rounded-full flex-1 transition-all duration-300"
            style={{
              backgroundColor: isCompleted ? color : 'rgba(255,255,255,0.08)',
              opacity: isCurrent ? 1 : isCompleted ? 0.7 : 0.15,
              boxShadow: isCurrent ? `0 0 6px ${color}60` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INTERACTIVE CARD VIEWERS
// ════════════════════════════════════════════════════════════════════════════
function InteractiveQuizViewer({ data, color }: { data: any; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
      <h4 className="text-[15px] font-bold text-zinc-100">{data.question}</h4>
      <div className="space-y-2">
        {data.options.map((option: string, i: number) => {
          const isCorrect = i === data.correctAnswerIndex;
          const isSelected = selected === i;
          let bgColor = 'bg-white/5';
          let borderColor = 'border-white/10';
          if (selected !== null) {
            if (isCorrect) { bgColor = 'bg-emerald-500/20'; borderColor = 'border-emerald-500/50'; }
            else if (isSelected) { bgColor = 'bg-red-500/20'; borderColor = 'border-red-500/50'; }
          }
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              className={`w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${bgColor} ${borderColor} ${selected === null ? 'hover:bg-white/10' : ''}`}
            >
              <span className={isSelected || (selected !== null && isCorrect) ? 'text-white font-medium' : 'text-zinc-300'}>{option}</span>
              {selected !== null && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
              {selected !== null && isSelected && !isCorrect && <X size={16} className="text-red-400" />}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {showExplanation && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 border-t border-white/10">
            <p className="text-[13px] text-zinc-400 leading-relaxed italic">
              <span className="font-bold not-italic" style={{ color }}>Bhai, simple hai:</span> {data.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveCalculatorViewer({ data, color }: { data: any; color: string }) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    data.inputs.forEach((input: any) => { initial[input.label] = input.defaultValue; });
    return initial;
  });

  const calculateResult = () => {
    const { calcType } = data;
    if (calcType === 'compounding') {
      const p = values['Principal'] || values['Monthly SIP'] || 0;
      const r = (values['Interest Rate (%)'] || 0) / 100;
      const t = values['Years'] || 0;
      if (data.formula === 'sip') {
        const monthlyRate = r / 12;
        const months = t * 12;
        const amount = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        return Math.round(amount);
      }
      const amount = p * Math.pow(1 + r, t);
      return Math.round(amount);
    }
    if (calcType === 'inflation') {
      const p = values['Current Amount'] || 0;
      const r = (values['Inflation Rate (%)'] || 0) / 100;
      const t = values['Years'] || 0;
      return Math.round(p / Math.pow(1 + r, t));
    }
    if (calcType === 'rule72') {
      const r = values['Interest Rate (%)'] || 1;
      return parseFloat((72 / r).toFixed(1));
    }
    if (calcType === 'emi') {
      const p = values['Loan Amount'] || 0;
      const r = (values['Interest Rate (%)'] || 0) / 1200;
      const n = values['Months'] || 1;
      return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }
    return 0;
  };

  const result = calculateResult();

  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
      <div className="space-y-5">
        {data.inputs.map((input: any, i: number) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{input.label}</label>
              <span className="text-sm font-bold text-white">
                {input.unit === '₹' ? '₹' : ''}{values[input.label].toLocaleString()}{input.unit !== '₹' ? ` ${input.unit || ''}` : ''}
              </span>
            </div>
            <input
              type="range"
              min={input.min}
              max={input.max}
              step={input.step}
              value={values[input.label]}
              onChange={(e) => setValues((prev) => ({ ...prev, [input.label]: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: color }}
            />
          </div>
        ))}
      </div>
      <div className="pt-5 border-t border-white/10 text-center">
        <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase mb-1 text-zinc-500">Result</p>
        <motion.div key={result} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-black text-white">
          {data.calcType === 'rule72' ? '' : '₹'}{result.toLocaleString()}{data.calcType === 'rule72' ? ' Years' : ''}
        </motion.div>
        <p className="text-[11px] text-zinc-400 mt-2">
          {data.calcType === 'compounding' ? 'Total Wealth Created 🚀' :
           data.calcType === 'inflation' ? 'Purchasing Power left 📉' :
           data.calcType === 'rule72' ? 'Time to double your money ⏳' :
           data.calcType === 'emi' ? 'Monthly EMI amount 💸' : 'Calculated Value'}
        </p>
      </div>
    </div>
  );
}

function InteractiveChoiceViewer({ data }: { data: any; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
      <h4 className="text-[15px] font-bold text-zinc-100 italic">&quot; {data.scenario} &quot;</h4>
      <div className="grid grid-cols-1 gap-3">
        {data.choices.map((choice: any, i: number) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(i)}
            className={`p-4 rounded-xl border text-left transition-all ${selected === i ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <div className="text-sm font-bold text-white mb-1">{choice.text}</div>
            <AnimatePresence>
              {selected === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[12px] text-zinc-400 leading-relaxed mt-2 pt-2 border-t border-white/5">
                  <span className={`font-bold ${choice.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>{choice.isCorrect ? 'Sahi Choice! ✅' : 'Khatra! ❌'}</span>
                  <p className="mt-1">{choice.consequence}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SWIPE CARD VIEWER (full-screen learning cards)
// ════════════════════════════════════════════════════════════════════════════
function SwipeCardViewer({
  moduleId,
  onClose,
  onComplete,
}: {
  moduleId: number;
  onClose: () => void;
  onComplete: (id: number) => void;
}) {
  const allCards = getAllCardsForModule(moduleId);
  const activeModule = getModuleById(moduleId);
  const { moduleProgress, updateModuleProgress } = useAppStore();
  // Convert stored percentage back to card index
  const savedPercent = moduleProgress[moduleId] || 0;
  const initialIndex = Math.round((savedPercent / 100) * Math.max(allCards.length - 1, 0));
  const [currentIndex, setCurrentIndex] = useState<number>(Math.min(initialIndex, allCards.length - 1));
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const scrollAccumulator = useRef(0);

  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  const isLast = currentIndex === allCards.length - 1;
  const currentCard = allCards[currentIndex];

  // Save progress as percentage whenever index changes
  useEffect(() => {
    const percentage = Math.floor((currentIndex / Math.max(allCards.length - 1, 1)) * 100);
    updateModuleProgress(moduleId, percentage);
  }, [currentIndex, moduleId, allCards.length, updateModuleProgress]);

  useEffect(() => {
    if (!currentCard?.id) return;
    const cardId = currentCard.id;
    const raf = requestAnimationFrame(() => {
      const savedNotes = localStorage.getItem(`notes_${cardId}`);
      if (savedNotes) {
        try { setNotes(JSON.parse(savedNotes)); } catch { setNotes([]); }
      } else {
        setNotes([]);
      }
      const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
      setBookmarked(bookmarks.includes(cardId));
    });
    return () => cancelAnimationFrame(raf);
  }, [currentCard?.id]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, newNote.trim()];
    setNotes(updated);
    setNewNote('');
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };

  const deleteNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    if (currentCard?.id) localStorage.setItem(`notes_${currentCard.id}`, JSON.stringify(updated));
  };

  const toggleBookmark = () => {
    if (!currentCard?.id) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_cards') || '[]');
    let updated;
    if (bookmarks.includes(currentCard.id)) {
      updated = bookmarks.filter((id: string) => id !== currentCard.id);
      setBookmarked(false);
    } else {
      updated = [...bookmarks, currentCard.id];
      setBookmarked(true);
    }
    localStorage.setItem('bookmarked_cards', JSON.stringify(updated));
  };

  const handleNext = useCallback(() => {
    if (currentIndex < allCards.length - 1) setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, allCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentIndex]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let lastScrollTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollingDown = e.deltaY > 0;
      const now = Date.now();
      if (isScrollingDown) {
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;
        if (isAtBottom) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current > 300 && now - lastScrollTime > 800) { lastScrollTime = now; scrollAccumulator.current = 0; handleNext(); }
        } else scrollAccumulator.current = 0;
      } else {
        const isAtTop = scrollTop <= 8;
        if (isAtTop) {
          e.preventDefault();
          scrollAccumulator.current += e.deltaY;
          if (scrollAccumulator.current < -300 && now - lastScrollTime > 800) { lastScrollTime = now; scrollAccumulator.current = 0; handlePrev(); }
        } else scrollAccumulator.current = 0;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const el = contentRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (diffY > 120 && scrollTop + clientHeight >= scrollHeight - 10) handleNext();
    else if (diffY < -120 && scrollTop <= 10) handlePrev();
  };

  if (!currentCard || !activeModule) return null;
  const isFirst = currentIndex === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060608]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ backgroundColor: currentCard.color }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px]"
          style={{ backgroundColor: currentCard.color }}
        />
      </div>

      {/* Desktop floating nav arrows */}
      <div className="hidden sm:block">
        {!isFirst && (
          <button
            onClick={handlePrev}
            className="absolute left-[calc(50%-270px)] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95 z-40"
            aria-label="Previous card"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {!isLast ? (
          <button
            onClick={handleNext}
            className="absolute right-[calc(50%-270px)] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95 z-40"
            style={{ borderColor: `${currentCard.color}40`, boxShadow: `0 4px 20px ${currentCard.color}20` }}
            aria-label="Next card"
          >
            <ArrowRight size={20} style={{ color: currentCard.color }} />
          </button>
        ) : (
          <button
            onClick={() => onComplete(moduleId)}
            className="absolute right-[calc(50%-270px)] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95 z-40"
            aria-label="Complete module"
          >
            <CheckCircle2 size={18} />
          </button>
        )}
      </div>

      {/* Phone frame on desktop, full screen on mobile */}
      <div className="w-full h-full sm:w-[420px] sm:h-[92vh] sm:rounded-3xl sm:border sm:border-white/[0.06] sm:overflow-hidden sm:shadow-2xl sm:shadow-black/50 flex flex-col relative bg-[#0F0F13]">
        {/* Top Bar */}
        <div className="relative z-30 flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0 bg-[#0F0F13]">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer" aria-label="Close">
            <X size={14} />
          </button>
          <div className="text-center truncate px-2 max-w-[60%]">
            <p className="text-white/60 text-[11px] font-medium truncate">{currentCard.topicTitle}</p>
            <p className="text-[9px] font-extrabold tracking-widest uppercase truncate" style={{ color: activeModule.color }}>{activeModule.title}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { useAppStore.getState().openAIChat(`I am reading the card titled "${currentCard.title}" in the topic "${currentCard.topicTitle}".\nThe content is:\n"${currentCard.content}"\nCan you explain this to me or help me understand it better?`); }}
              className="w-8 h-8 rounded-full bg-ai/20 border border-ai/50 flex items-center justify-center hover:bg-ai/30 text-ai-soft transition-colors active:scale-90 cursor-pointer"
              title="Ask AI about this card"
            >
              <Sparkles size={14} />
            </button>
            <button
              onClick={toggleBookmark}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors active:scale-90 cursor-pointer ${bookmarked ? 'bg-gold/20 border-gold/50 text-gold-soft' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'}`}
              aria-label="Bookmark"
            >
              <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
            </button>
            <button onClick={() => setShowNotes(true)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 transition-colors active:scale-90 cursor-pointer relative" aria-label="Notes">
              <FileText size={14} />
              {notes.length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-black">{notes.length}</span>}
            </button>
          </div>
        </div>

        {/* Cards Area */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="absolute inset-0 flex flex-col bg-[#0F0F13] select-none overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              initial={{ y: 200, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -200, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              <RainbowProgress currentIndex={currentIndex} totalCount={allCards.length} />

              {/* Scrollable Card Content */}
              <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pt-4 pb-12 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Banner */}
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-lg flex flex-col justify-end p-6 bg-[#18181C]" style={{ height: '32%', minHeight: '180px' }}>
                  <motion.div
                    className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: currentCard.color }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  />
                  <div className="relative z-10 w-fit mt-auto">
                    <span className="text-3xl mb-2 block">{currentCard.emoji}</span>
                    <motion.h3
                      className="font-extrabold text-[17px] sm:text-[19px] tracking-tight leading-snug text-zinc-100"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {currentCard.title}
                    </motion.h3>
                    <p className="text-[11px] mt-1 font-medium" style={{ color: currentCard.color }}>{currentCard.topicTitle}</p>
                  </div>
                </div>

                {/* Rich Content */}
                <motion.div className="pt-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                  <RichContent content={currentCard.content} color={currentCard.color} />
                </motion.div>

                {/* Interactive Payloads */}
                {currentCard.interactiveType === 'quiz' && currentCard.quizData && <InteractiveQuizViewer data={currentCard.quizData} color={currentCard.color} />}
                {currentCard.interactiveType === 'myth_buster' && currentCard.quizData && <InteractiveQuizViewer data={currentCard.quizData} color={currentCard.color} />}
                {currentCard.interactiveType === 'calculator' && currentCard.calcData && <InteractiveCalculatorViewer data={currentCard.calcData} color={currentCard.color} />}
                {currentCard.interactiveType === 'choice_sim' && currentCard.choiceData && <InteractiveChoiceViewer data={currentCard.choiceData} color={currentCard.color} />}

                {/* Module Complete */}
                {isLast && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="rounded-2xl p-5 border overflow-hidden relative mt-2 bg-emerald-950/20 border-emerald-500/20"
                  >
                    <div className="absolute -inset-4 blur-xl opacity-10 bg-emerald-500" />
                    <div className="relative flex items-center gap-2 mb-2">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}>
                        <Sparkles size={18} className="text-emerald-400" />
                      </motion.div>
                      <span className="font-bold text-sm text-emerald-400">Module Complete!</span>
                      <span className="text-xl">🏆</span>
                    </div>
                    <p className="relative text-zinc-400 text-sm">Badhai ho! {activeModule.title} complete! Aage badhein aur naya seekhein!</p>
                  </motion.div>
                )}
              </div>

              {/* Mobile swipe hint */}
              {!isLast && (
                <div className="absolute bottom-5 left-0 right-0 z-30 pointer-events-none flex flex-col items-center gap-0.5 sm:hidden">
                  <motion.div className="flex flex-col items-center gap-0.5" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowUp size={14} className="text-white/35" />
                    <span className="text-white/35 text-[10px] font-medium tracking-wider uppercase">Swipe up to read next</span>
                  </motion.div>
                </div>
              )}

              {/* Mobile bottom nav buttons */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-5 pb-6 pt-4 bg-gradient-to-t from-[#0F0F13] to-transparent sm:hidden">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrev} disabled={isFirst} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-30 cursor-pointer">
                  <ArrowLeft size={16} /> Prev
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={isLast ? () => onComplete(moduleId) : handleNext}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${activeModule.color}, ${activeModule.color}CC)` }}
                >
                  {isLast ? <><CheckCircle2 size={16} /> Done!</> : <>Next <ArrowRight size={16} /></>}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Notes Overlay */}
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-x-0 bottom-0 top-1/4 z-50 rounded-t-3xl bg-[#18181C] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0F0F13]">
                  <h3 className="font-bold text-white flex items-center gap-2"><FileText size={16} className="text-gold-soft" /> Notes ({notes.length})</h3>
                  <button onClick={() => setShowNotes(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60" aria-label="Close notes"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center text-white/40 mt-10 text-sm">No notes yet. Add one below!</div>
                  ) : (
                    notes.map((n, i) => (
                      <div key={i} className="group relative bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white/80 pr-10">
                        {n}
                        <button onClick={() => deleteNote(i)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" aria-label="Delete note"><Trash2 size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-[#0F0F13] border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a note line..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-gold/50 focus:bg-white/10 transition-colors"
                    />
                    <button onClick={addNote} disabled={!newNote.trim()} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gold text-black rounded-xl disabled:opacity-50 disabled:bg-white/20 disabled:text-white/40" aria-label="Add note">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE CARD (dashboard grid — capital-mastery design)
// ════════════════════════════════════════════════════════════════════════════
function ModuleCard({
  mod,
  index,
  isUnlocked,
  isActive,
  onClick,
}: {
  mod: ModuleSection;
  index: number;
  isUnlocked: boolean;
  isActive?: boolean;
  onClick: () => void;
}) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const { moduleProgress, completedModules } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -5 : 0 }}
      className="relative group cursor-pointer rounded-[2rem] p-6 border border-white/[0.06] overflow-hidden transition-all duration-500 glass-card"
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Holographic Shine */}
      {isUnlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      )}

      {/* Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500" style={{ backgroundColor: mod.color }} />

      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Emoji Box with Progress Ring */}
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90">
                <circle cx="50%" cy="50%" r="45%" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.05" />
                <motion.circle cx="50%" cy="50%" r="45%" fill="none" stroke={mod.color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progressPercent / 100 }} transition={{ duration: 1.5, delay: 0.5 }} />
              </svg>
            )}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${isUnlocked ? 'shadow-lg shadow-black/20' : 'grayscale opacity-50'}`}
              style={{ backgroundColor: isUnlocked ? `${mod.color}20` : 'rgba(255,255,255,0.05)' }}
            >
              {isUnlocked ? mod.emoji : <Lock size={16} className="text-zinc-600" />}
            </div>
          </div>

          {/* Active / Completed Tags */}
          {isActive && (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="px-2.5 py-1 rounded-full bg-emerald/10 border border-emerald/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-soft" />
              <span className="text-[9px] font-black text-emerald-soft uppercase tracking-tighter">Next Mission</span>
            </motion.div>
          )}
          {isCompleted && (
            <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <CheckCircle2 size={10} className="text-emerald-soft" />
              <span className="text-[9px] font-bold text-zinc-400 uppercase">Mastered</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-70 mb-1 block" style={{ color: isUnlocked ? mod.color : '#94A3B8' }}>Module {mod.id}</span>
          <h3 className={`font-bold text-[16px] leading-tight mb-2 transition-colors ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>{mod.title}</h3>
          <p className="text-zinc-500 text-[11px] line-clamp-2 leading-relaxed">{mod.description}</p>
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
            <span className="flex items-center gap-1"><BookOpen size={10} /> {cardCount} Cards</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {cardCount * 2}m</span>
          </div>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-white/5 group-hover:bg-white/10' : 'bg-transparent'}`}>
            {isUnlocked ? <ChevronRight size={14} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" /> : <X size={12} className="text-zinc-700" />}
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <div className="absolute inset-0 bg-midnight/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
          <div className="glass-strong px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <span className="text-[10px] font-bold text-zinc-400">Unlock Module {mod.id - 1} to proceed</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT TOAST
// ════════════════════════════════════════════════════════════════════════════
function AchievementToast({ onClaim }: { onClaim: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const visited = typeof window !== 'undefined' ? localStorage.getItem('firstVisit_dashboard') : null;
    if (!visited) { const timer = setTimeout(() => setShow(true), 2000); return () => clearTimeout(timer); }
  }, []);
  useEffect(() => {
    if (show) { const timer = setTimeout(() => setShow(false), 6000); return () => clearTimeout(timer); }
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="fixed bottom-6 left-6 z-40 flex items-center gap-4 rounded-2xl border border-gold/30 glass-strong p-4 shadow-2xl max-w-sm">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-ai/20 flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Achievement Unlocked!</p>
            <p className="text-xs text-gold-soft">&quot;First Login&quot; — +50 Coins</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onClaim(); setShow(false); if (typeof window !== 'undefined') localStorage.setItem('firstVisit_dashboard', 'done'); }}
            className="rounded-xl bg-gradient-to-r from-gold to-ai px-4 py-2 text-xs font-bold text-white flex-shrink-0 cursor-pointer"
          >
            Claim!
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user, isAuthenticated, coins, streak, addCoins, completedModules, completeModule } = useAppStore();
  const hydrated = useHydration();
  const router = useRouter();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  const activeModuleIndex = modules.findIndex((m) => !completedModules.includes(m.id));

  const handleCompleteModule = useCallback((id: number) => {
    setOpenModuleId(null);
    if (!completedModules.includes(id)) {
      completeModule(id);
      addCoins(100);
    }
  }, [completedModules, completeModule, addCoins]);

  const handleClaim = useCallback(() => { addCoins(50); }, [addCoins]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex((prev) => (prev + 1) % QUOTES.length), 4000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
          <p className="text-ink-muted text-sm">Loading your progress...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-midnight">
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-emerald/[0.06] blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-ai/[0.06] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="mt-20"><FinanceTicker /></div>

        {/* Hero + Tools CTA */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card-premium">
            <Image src="/images/dashboard_hero.jpeg" alt="Dashboard background" fill className="object-cover opacity-[0.12] pointer-events-none" priority />
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Namaste, {user?.displayName?.split(' ')[0] ?? 'Champion'}!</h1>
                  <AnimatePresence mode="wait">
                    <motion.p key={quoteIndex} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="text-base text-ink-muted font-medium">&quot;{QUOTES[quoteIndex]}&quot;</motion.p>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-gold/10 px-5 py-3 border border-gold/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="p-2 rounded-xl bg-gold/20"><Coins size={20} className="text-gold-soft" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none"><AnimatedCounter target={coins} /></p>
                      <p className="text-[10px] font-bold text-gold-soft uppercase tracking-tighter">Coins</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 px-5 py-3 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <div className="p-2 rounded-xl bg-red-500/20"><Flame size={20} className="text-red-400" /></div>
                    <div>
                      <p className="text-lg font-black text-white leading-none">{streak}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tools CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative overflow-hidden rounded-3xl border border-emerald/20 glass-card-premium p-6 sm:p-8">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)', boxShadow: '0 0 20px rgba(16,185,129,0.30)' }}>
                  <Wrench size={26} className="text-midnight" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Interactive Strategies & Tools</h3>
                  <p className="text-sm text-ink-muted">11 strategies + 16 financial tools — SIP calc, expense tracker, quizzes, games aur bahut kuch!</p>
                </div>
              </div>
              <Link href="/tools">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm text-midnight whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)' }}>
                  Tools kholo <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Module Grid (capital-mastery design) ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Financial Journey Map</h2>
              <p className="text-sm text-ink-muted mt-1 max-w-xl">Step-by-step personal finance seekho. Har module complete karo aur naya level unlock karo! 🚀</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-soft animate-pulse" />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{completedModules.length} of {modules.length} Completed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const isUnlocked = i === 0 || completedModules.includes(modules[i - 1].id);
              const isActive = i === activeModuleIndex;
              return <ModuleCard key={mod.id} mod={mod} index={i} isUnlocked={isUnlocked} isActive={isActive} onClick={() => setOpenModuleId(mod.id)} />;
            })}
          </div>
        </div>

        {/* ─── Mastery Progress Panel ─── */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-12 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 glass-card">
            <Image src="/images/progress_panel.jpeg" alt="" fill className="object-cover opacity-[0.07] pointer-events-none" />
            <div className="relative z-10 p-8">
              <h2 className="text-xl font-black text-white mb-6">Mastery Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {modules.map((mod) => {
                  const cardCount = getAllCardsForModule(mod.id).length;
                  const savedPercent = mod.id ? (useAppStore.getState().moduleProgress[mod.id] || 0) : 0;
                  const isCompleted = completedModules.includes(mod.id);
                  const progressPercent = isCompleted ? 100 : savedPercent;
                  return (
                    <div key={mod.id} className="group">
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-white/60 font-bold uppercase tracking-wider">Module {mod.id}: {mod.title}</span>
                        <span className="text-white/40 font-black">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/[0.03]">
                        <motion.div initial={{ width: '0%' }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full relative" style={{ backgroundColor: mod.color }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide">
            {[
              { label: 'Daily Challenge', icon: Zap, color: '#8B5CF6', action: () => router.push('/tools') },
              { label: 'Leaderboard', icon: Trophy, color: '#F59E0B', action: () => router.push('/tools') },
              { label: 'Refer a Friend', icon: Share2, color: '#38BDF8', action: () => { if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText('RUPAIYA101'); alert('Referral code copied: RUPAIYA101'); } },
              { label: 'Help Center', icon: BookOpen, color: '#10B981', action: () => router.push('/tools') },
            ].map((item) => (
              <motion.button key={item.label} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={item.action} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black text-white whitespace-nowrap backdrop-blur-md cursor-pointer flex-shrink-0 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${item.color}20` }}><item.icon size={18} style={{ color: item.color }} /></div>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center py-12 border-t border-white/[0.03]">
            <p className="text-[10px] font-black text-ink-muted/60 uppercase tracking-[0.4em]">Capital Mastery — Rupaiya 101</p>
            <p className="text-xs text-ink-muted mt-2">Paisa Samjho, Future Secure Karo!</p>
          </div>
        </div>
      </div>

      {/* SwipeCardViewer (full-screen learning cards) */}
      <AnimatePresence>
        {openModuleId && <SwipeCardViewer moduleId={openModuleId} onClose={() => setOpenModuleId(null)} onComplete={handleCompleteModule} />}
      </AnimatePresence>

      <AchievementToast onClaim={handleClaim} />
      <AIChatBot />
    </main>
  );
}
