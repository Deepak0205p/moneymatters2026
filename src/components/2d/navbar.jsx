"use client";

import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Coins, Trophy, User, Menu, X, LogIn, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'hinglish', label: 'Hinglish', native: 'Hinglish', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'bho', label: 'Bhojpuri', native: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', label: 'Assamese', native: 'असमीया', flag: '🇮🇳' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳' },
  { code: 'ks', label: 'Kashmiri', native: 'कॉशुर', flag: '🇮🇳' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली', flag: '🇮🇳' },
  { code: 'sd', label: 'Sindhi', native: 'सिन्धी', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu', native: 'اردो', flag: '🇮🇳' },
  { code: 'doi', label: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी', flag: '🇮🇳' },
  { code: 'mni', label: 'Manipuri', native: 'मৈতैलोন্', flag: '🇮🇳' },
];

export function Navbar() {
  const { t } = useTranslation();
  const {
    coins,
    streak,
    isAuthenticated,
    user,
    logout,
    language,
    setLanguage
  } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Close lang dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    }
    if (isLangOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isLangOpen]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <div className="glass-strong rounded-2xl p-3 sm:p-4 shadow-premium border-b-4 border-emerald-500/10">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group btn-magnetic">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105 coin-spin-3d"
              style={{
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                boxShadow: '0 0 16px rgba(16,185,129,0.35)'
              }}
            >
              <Coins size={18} className="text-midnight" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-ink">
              Money
              <span className="text-gradient-brand"> Matters</span>
            </span>
          </Link>

          {/* Desktop Right Nav Controls */}
          <div className="hidden items-center gap-3 md:flex">
            
            {/* Coins indicator (Tactile 3D feel) */}
            <div className="flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-3.5 py-1.5 border-b-2">
              <Coins size={14} className="text-gold-soft" />
              <span className="font-bold text-gold-soft text-sm tabular-nums">{coins}</span>
            </div>

            {/* Streak indicator */}
            <div className="flex items-center gap-2 rounded-full bg-orange-400/10 border border-orange-400/20 px-3.5 py-1.5 border-b-2">
              <Trophy size={14} className="text-orange-300" />
              <span className="font-semibold text-orange-300 text-xs">
                {streak} {t('common.days')}
              </span>
            </div>

            {/* Language Selector Dropdown (Tactile border-b) */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink hover:bg-white/10 hover:border-emerald/20 transition-all cursor-pointer border-b-2"
              >
                <Globe size={13} className="text-emerald-soft" />
                <span className="hidden sm:inline">{currentLang.native}</span>
                {currentLang.native.length > 8 && (
                  <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
                )}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto rounded-2xl glass-strong border border-white/10 shadow-2xl shadow-black/40 py-2 custom-scroll"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.06]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                        Language Chuno
                      </p>
                    </div>
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                          language === lang.code ? 'bg-emerald/10 text-emerald-soft' : 'text-ink hover:bg-white/[0.04] hover:text-ink'
                        }`}
                      >
                        <span className="text-base shrink-0">{lang.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${language === lang.code ? 'text-emerald-soft' : 'text-ink'}`}>
                            {lang.label}
                          </p>
                          <p className="text-[10px] text-ink-muted truncate">{lang.native}</p>
                        </div>
                        {language === lang.code && (
                          <div className="w-2 h-2 rounded-full bg-emerald shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="text-sm text-ink-muted hover:text-ink transition-colors font-medium btn-magnetic"
                >
                  {t('nav.welcome').replace('{name}', user?.displayName?.split(' ')[0] || 'User')}
                </Link>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/15 border border-emerald/25 cursor-pointer transition-colors hover:bg-emerald/20 border-b-2"
                    title={t('nav.profile')}
                  >
                    <User size={16} className="text-emerald-soft" />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => logout()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/25 cursor-pointer transition-colors hover:bg-red-500/20 border-b-2"
                  title={t('nav.logout')}
                >
                  <LogIn size={16} className="text-red-400" />
                </motion.button>
              </div>
            ) : (
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-emerald btn-3d flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer"
                >
                  <User size={15} />
                  {t('nav.login')}
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer md:hidden flex items-center justify-center w-9 h-9 rounded-xl glass text-ink-muted hover:text-ink transition-colors border-b-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-strong rounded-2xl mt-2 p-4 space-y-3 shadow-premium border-b-4 border-emerald-500/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl bg-gold/10 border border-gold/20 p-3 border-b-2">
                  <div className="flex items-center gap-2">
                    <Coins size={15} className="text-gold-soft" />
                    <span className="font-bold text-gold-soft text-sm">{coins}</span>
                  </div>
                  <span className="text-[10px] text-gold-soft/70 uppercase font-semibold">
                    {t('common.coins')}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-orange-400/10 border border-orange-400/20 p-3 border-b-2">
                  <div className="flex items-center gap-2">
                    <Trophy size={15} className="text-orange-300" />
                    <span className="font-bold text-orange-300 text-sm">{streak}</span>
                  </div>
                  <span className="text-[10px] text-orange-300/70 uppercase font-semibold">
                    {t('common.streak')}
                  </span>
                </div>
              </div>

              {/* Language Selection inside Mobile Menu */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 border-b-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={14} className="text-emerald-soft" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Language
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.slice(0, 8).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        language === lang.code
                          ? 'bg-emerald/20 text-emerald-soft border border-emerald/30 border-b-2'
                          : 'bg-white/5 text-ink-muted border border-white/[0.06] hover:bg-white/10'
                      }`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Mobile Controls */}
              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="block">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald/10 border border-emerald/20 p-3 cursor-pointer hover:bg-emerald/15 transition-colors border-b-2">
                      <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-emerald/20">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User size={15} className="text-emerald-soft" />
                        )}
                      </div>
                      <span className="font-semibold text-emerald-soft text-sm flex-1">
                        {user?.displayName?.split(' ')[0] || 'My Profile'}
                      </span>
                      <span className="text-[10px] text-emerald-soft/60 uppercase font-semibold">
                        View
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 font-semibold text-sm cursor-pointer hover:bg-red-500/15 transition-colors border-b-2"
                  >
                    <LogIn size={15} />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-center gap-2 rounded-xl btn-emerald btn-3d p-3 cursor-pointer">
                    <User size={16} />
                    <span className="font-semibold text-sm">{t('nav.login')}</span>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
