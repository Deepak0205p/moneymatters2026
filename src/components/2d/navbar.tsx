"use client";

import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { Coins, Trophy, User, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const { coins, streak, isAuthenticated, user, logout } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <div className="glass-strong rounded-2xl p-3 sm:p-4 shadow-premium">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                boxShadow: '0 0 16px rgba(16,185,129,0.35)',
              }}
            >
              <Coins size={18} className="text-midnight" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-ink">
              Capital<span className="text-gradient-brand"> Mastery</span>
            </span>
          </Link>

          {/* Desktop stats + auth */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Coins pill */}
            <div className="flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-3.5 py-1.5">
              <Coins size={14} className="text-gold-soft" />
              <span className="font-bold text-gold-soft text-sm tabular-nums">{coins}</span>
            </div>

            {/* Streak pill */}
            <div className="flex items-center gap-2 rounded-full bg-orange-400/10 border border-orange-400/20 px-3.5 py-1.5">
              <Trophy size={14} className="text-orange-300" />
              <span className="font-semibold text-orange-300 text-xs">{streak} day</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="text-sm text-ink-muted hover:text-ink transition-colors font-medium"
                >
                  Hey, {user?.displayName?.split(' ')[0] || 'User'}
                </Link>
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/15 border border-emerald/25 cursor-pointer transition-colors hover:bg-emerald/20"
                    title="My Profile"
                  >
                    <User size={16} className="text-emerald-soft" />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => logout()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/25 cursor-pointer transition-colors hover:bg-red-500/20"
                  title="Logout"
                >
                  <LogIn size={16} className="text-red-400" />
                </motion.button>
              </div>
            ) : (
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-emerald flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer"
                >
                  <User size={15} />
                  Login
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer md:hidden flex items-center justify-center w-9 h-9 rounded-xl glass text-ink-muted hover:text-ink transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-strong rounded-2xl mt-2 p-4 space-y-3 shadow-premium">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl bg-gold/10 border border-gold/20 p-3">
                  <div className="flex items-center gap-2">
                    <Coins size={15} className="text-gold-soft" />
                    <span className="font-bold text-gold-soft text-sm">{coins}</span>
                  </div>
                  <span className="text-[10px] text-gold-soft/70 uppercase font-semibold">Coins</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-orange-400/10 border border-orange-400/20 p-3">
                  <div className="flex items-center gap-2">
                    <Trophy size={15} className="text-orange-300" />
                    <span className="font-bold text-orange-300 text-sm">{streak}</span>
                  </div>
                  <span className="text-[10px] text-orange-300/70 uppercase font-semibold">Streak</span>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <div className="flex items-center gap-3 rounded-xl bg-emerald/10 border border-emerald/20 p-3 cursor-pointer hover:bg-emerald/15 transition-colors">
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
                      <span className="text-[10px] text-emerald-soft/60 uppercase font-semibold">View</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 font-semibold text-sm cursor-pointer hover:bg-red-500/15 transition-colors"
                  >
                    <LogIn size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-center gap-2 rounded-xl btn-emerald p-3 cursor-pointer">
                    <User size={16} />
                    <span className="font-semibold text-sm">Login / Signup</span>
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
