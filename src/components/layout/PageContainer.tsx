'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  strategyId: number;
}

export function PageContainer({ children, strategyId }: PageContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={strategyId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden mt-14 page-transition"
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl mx-auto particle-bg aurora-bg particles-field">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
