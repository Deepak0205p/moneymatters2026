"use client";

import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { Coins, Trophy, User, Menu, X, LogIn, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const { coins, streak, isAuthenticated, user, logout } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <div className="glass-card-premium p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #34D399, #10B981 60%, #047857)',
                boxShadow: '0 0 16px rgba(16,185,129,0.35)',
              }}
            >
              <Coins size={20} className="text-midnight" />
            </div>
            <span className="text-xl font-bold text-white">Capital Mastery</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2">
              <Coins size={16} className="text-gold-soft" />
              <span className="font-semibold text-gold-soft">{coins}</span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-orange-400/20 px-4 py-2">
              <Trophy size={16} className="text-orange-300" />
              <span className="font-semibold text-orange-300">{streak} day streak</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-ink-muted hover:text-white transition-colors"
                >
                  Hey, {user?.displayName?.split(' ')[0] || 'User'}
                </Link>
                <Link href="/dashboard/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/20 cursor-pointer"
                    title="Profile"
                  >
                    <User size={20} className="text-emerald-soft" />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    logout();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 cursor-pointer"
                  title="Logout"
                >
                  <LogIn size={20} className="text-red-400" />
                </motion.button>
              </div>
            ) : (
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ai/20 cursor-pointer"
                  title="Login / Signup"
                >
                  <User size={20} className="text-ai-soft" />
                </motion.button>
              </Link>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer md:hidden"
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="glass-card-premium mt-2 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-gold/20 p-3">
                  <div className="flex items-center gap-2">
                    <Coins size={16} className="text-gold-soft" />
                    <span className="font-semibold text-gold-soft">{coins} Coins</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-orange-400/20 p-3">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-orange-300" />
                    <span className="font-semibold text-orange-300">{streak} day streak</span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center gap-2 rounded-lg bg-emerald/20 p-3 cursor-pointer">
                        <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-emerald/20">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User size={16} className="text-emerald-soft" />
                          )}
                        </div>
                        <span className="font-semibold text-emerald-soft">
                          Hey, {user?.displayName?.split(' ')[0] || 'User'}
                        </span>
                        <Settings size={14} className="ml-auto text-emerald/60" />
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-500/20 p-3 text-red-400 font-semibold cursor-pointer"
                    >
                      <LogIn size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-ai/20 p-3 text-ai-soft font-semibold cursor-pointer">
                      <User size={16} />
                      Login / Signup
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
