'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  strategyId: number;
}

/**
 * PageContainer — the scrollable canvas that hosts each strategy.
 * Premium glassmorphism shell over the midnight backdrop.
 */
export function PageContainer({ children, strategyId }: PageContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={strategyId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden mt-14 page-transition strategy-scroll"
      >
        <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* Ambient backdrop layers */}
          <div className="pointer-events-none absolute inset-0 aurora-bg rounded-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-texture-dots opacity-60 rounded-3xl" />
          {/* Content sits above ambient layers */}
          <div className="relative">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
