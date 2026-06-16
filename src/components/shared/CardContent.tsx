"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Zap } from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════
// RAINBOW COLORS
// ════════════════════════════════════════════════════════════════════════
const RAINBOW_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3',
  '#10AC84', '#5F27CD', '#EE5A24', '#6C5CE7', '#FDA7DF',
  '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F0E68C',
  '#FF6348', '#7BED9F', '#70A1FF', '#FFA502', '#FF6B81',
  '#2ED573', '#1E90FF', '#FF4757', '#ECCC68', '#A4B0BE',
];

// ════════════════════════════════════════════════════════════════════════
// RICH CONTENT PARSER
// ════════════════════════════════════════════════════════════════════════
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

export function RichContent({ content, color }: { content: string; color: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  let i = 0;
  let blockKey = 0;

  const toggleCheck = (id: string) => setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  while (i < lines.length) {
    const line = lines[i];

    if (line.includes(': *') || (line.includes('**') && line.includes(':'))) {
      const match = line.match(/^([\w ]+): (.*)$/);
      if (match) {
        const name = match[1];
        const text = match[2];
        const isBhaiya = name.toLowerCase().includes('bhai') || name.toLowerCase().includes('mentor');
        blocks.push(
          <motion.div key={blockKey++} initial={{ opacity: 0, x: isBhaiya ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col mb-4 ${isBhaiya ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] font-bold text-zinc-500 mb-1 px-2 uppercase tracking-wider">{name}</span>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isBhaiya ? 'rounded-tr-none' : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none'}`} style={isBhaiya ? { backgroundColor: `${color}ee`, color: '#000' } : {}}>
              {parseInline(text, isBhaiya ? '#000' : color)}
            </div>
          </motion.div>
        );
        i++; continue;
      }
    }

    if (line.includes('🚨') && (line.includes('MISSION') || line.includes('ALERT'))) {
      const missionTitle = line.trim();
      i++;
      const missionLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('🚨')) { missionLines.push(lines[i].trim()); i++; }
      blocks.push(
        <motion.div key={blockKey++} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="my-6 p-5 rounded-2xl border-2 border-dashed relative overflow-hidden bg-white/[0.02]" style={{ borderColor: `${color}40` }}>
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
    if (line.match(/^[A-Z][A-Z0-9 ()]{5,}$/) && !line.includes('₹')) { blocks.push(<p key={blockKey++} className="text-[10px] font-extrabold tracking-[0.15em] uppercase mt-4 mb-1" style={{ color }}>{line}</p>); i++; continue; }
    if (line.trim().match(/^[-•*✅❌]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-•*✅❌]\s/)) { items.push(lines[i].trim().replace(/^[-•*✅❌]\s/, '')); i++; }
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
    if (line.trim().match(/^\d+[.)] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+[.)] /)) { items.push(lines[i].trim().replace(/^\d+[.)] /, '')); i++; }
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
    if (line.includes('↓') || line.includes('→') || line.includes('←') || line.includes('↑')) { blocks.push(<p key={blockKey++} className="text-zinc-400 text-[12px] leading-relaxed font-mono pl-2 my-0.5">{parseInline(line, color)}</p>); i++; continue; }
    blocks.push(<p key={blockKey++} className="text-zinc-300 text-[13.5px] leading-[1.85] font-normal">{parseInline(line, color)}</p>);
    i++;
  }

  return <div className="space-y-1">{blocks}</div>;
}

// ════════════════════════════════════════════════════════════════════════
// RAINBOW PROGRESS BAR
// ════════════════════════════════════════════════════════════════════════
export function RainbowProgress({ currentIndex, totalCount }: { currentIndex: number; totalCount: number }) {
  return (
    <div className="flex items-center gap-[2px] px-4 pt-3 pb-1 flex-shrink-0">
      {Array.from({ length: totalCount }).map((_, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const color = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
        return (
          <div key={i} className="h-[3px] rounded-full flex-1 transition-all duration-300" style={{ backgroundColor: isCompleted ? color : 'rgba(255,255,255,0.08)', opacity: isCurrent ? 1 : isCompleted ? 0.7 : 0.15, boxShadow: isCurrent ? `0 0 6px ${color}60` : 'none' }} />
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// INTERACTIVE VIEWERS
// ════════════════════════════════════════════════════════════════════════
export function InteractiveQuizViewer({ data, color }: { data: any; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const handleSelect = (index: number) => { if (selected !== null) return; setSelected(index); setShowExplanation(true); };
  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
      <h4 className="text-[15px] font-bold text-zinc-100">{data.question}</h4>
      <div className="space-y-2">
        {data.options.map((option: string, i: number) => {
          const isCorrect = i === data.correctAnswerIndex;
          const isSelected = selected === i;
          let bgColor = 'bg-white/5'; let borderColor = 'border-white/10';
          if (selected !== null) { if (isCorrect) { bgColor = 'bg-emerald-500/20'; borderColor = 'border-emerald-500/50'; } else if (isSelected) { bgColor = 'bg-red-500/20'; borderColor = 'border-red-500/50'; } }
          return (
            <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(i)} className={`w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${bgColor} ${borderColor} ${selected === null ? 'hover:bg-white/10' : ''}`}>
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
            <p className="text-[13px] text-zinc-400 leading-relaxed italic"><span className="font-bold not-italic" style={{ color }}>Bhai, simple hai:</span> {data.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InteractiveCalculatorViewer({ data, color }: { data: any; color: string }) {
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
      if (data.formula === 'sip') { const mr = r / 12; const m = t * 12; return Math.round(p * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr)); }
      return Math.round(p * Math.pow(1 + r, t));
    }
    if (calcType === 'inflation') { const p = values['Current Amount'] || 0; const r = (values['Inflation Rate (%)'] || 0) / 100; const t = values['Years'] || 0; return Math.round(p / Math.pow(1 + r, t)); }
    if (calcType === 'rule72') { const r = values['Interest Rate (%)'] || 1; return parseFloat((72 / r).toFixed(1)); }
    if (calcType === 'emi') { const p = values['Loan Amount'] || 0; const r = (values['Interest Rate (%)'] || 0) / 1200; const n = values['Months'] || 1; return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)); }
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
              <span className="text-sm font-bold text-white">{input.unit === '₹' ? '₹' : ''}{values[input.label].toLocaleString()}{input.unit !== '₹' ? ` ${input.unit || ''}` : ''}</span>
            </div>
            <input type="range" min={input.min} max={input.max} step={input.step} value={values[input.label]} onChange={(e) => setValues((prev) => ({ ...prev, [input.label]: parseFloat(e.target.value) }))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ accentColor: color }} />
          </div>
        ))}
      </div>
      <div className="pt-5 border-t border-white/10 text-center">
        <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase mb-1 text-zinc-500">Result</p>
        <motion.div key={result} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-black text-white">{data.calcType === 'rule72' ? '' : '₹'}{result.toLocaleString()}{data.calcType === 'rule72' ? ' Years' : ''}</motion.div>
        <p className="text-[11px] text-zinc-400 mt-2">{data.calcType === 'compounding' ? 'Total Wealth Created 🚀' : data.calcType === 'inflation' ? 'Purchasing Power left 📉' : data.calcType === 'rule72' ? 'Time to double your money ⏳' : data.calcType === 'emi' ? 'Monthly EMI amount 💸' : 'Calculated Value'}</p>
      </div>
    </div>
  );
}

export function InteractiveChoiceViewer({ data }: { data: any; color: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
      <h4 className="text-[15px] font-bold text-zinc-100 italic">&quot; {data.scenario} &quot;</h4>
      <div className="grid grid-cols-1 gap-3">
        {data.choices.map((choice: any, i: number) => (
          <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => setSelected(i)} className={`p-4 rounded-xl border text-left transition-all ${selected === i ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
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
