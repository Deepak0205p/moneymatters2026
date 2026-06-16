'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';

// Subscribe to hydration state without using setState in an effect
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06]" />
    );
  }

  const isDark = theme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#8888a0] hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </motion.div>

      {/* Subtle glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-amber-400/0"
        whileHover={{ borderColor: 'rgba(245,158,11,0.2)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
