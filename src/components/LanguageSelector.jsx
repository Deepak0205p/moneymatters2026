"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, INDIAN_LANGUAGES } from './LanguageProvider';

export function LanguageSelector({ variant = 'default' }) {
  const { selectedLang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = INDIAN_LANGUAGES.find(l => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-semibold text-zinc-300"
          aria-label="Select language"
        >
          <Globe size={13} />
          <span className="max-w-[60px] truncate">{currentLang.nativeName}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 max-h-[320px] overflow-y-auto bg-[#0D1326] border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl z-[200] custom-scroll"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-all ${
                    selectedLang === lang.code
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="flex-1 truncate">{lang.nativeName}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">{lang.code}</span>
                  {selectedLang === lang.code && <Check size={12} className="text-emerald-400 shrink-0" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        aria-label="Select language"
      >
        <Globe size={16} className="text-zinc-300" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 max-h-[360px] overflow-y-auto bg-[#0D1326] border border-white/[0.08] rounded-2xl p-2 shadow-2xl z-[200] custom-scroll"
          >
            <div className="px-2 py-1.5 mb-1">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Language</p>
            </div>
            {INDIAN_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  selectedLang === lang.code
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className="flex-1">
                  <span className="text-xs font-semibold block">{lang.nativeName}</span>
                  <span className="text-[10px] text-zinc-500 block">{lang.name}</span>
                </span>
                {selectedLang === lang.code && <Check size={14} className="text-emerald-400 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
