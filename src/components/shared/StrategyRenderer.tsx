"use client";

import { lazy, Suspense } from 'react';
import { StrategyModal } from '@/components/shared/StrategyModal';
import type { StrategyDef } from '@/lib/data/strategyRegistry';

// Lazy-load all strategy components
const strategyComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'paise-ka-gps': lazy(() => import('@/components/strategies/PaiseKaGPS')),
  'kya-hota-agar': lazy(() => import('@/components/strategies/KyaHotaAgar')),
  'chhupa-hua-chor': lazy(() => import('@/components/strategies/ChhupaHuaChor')),
  'budget-khel': lazy(() => import('@/components/strategies/BudgetKhel')),
  'ghar-ka-budget': lazy(() => import('@/components/strategies/GharKaBudget')),
  'debt-trap-darwaza': lazy(() => import('@/components/strategies/DebtTrapDarwaza')),
  'compounding-tree': lazy(() => import('@/components/strategies/CompoundingTree')),
  'report-card': lazy(() => import('@/components/strategies/ReportCard')),
  'rupaiya-dictionary': lazy(() => import('@/components/strategies/RupaiyaDictionary')),
  'ek-din-ka-kharcha': lazy(() => import('@/components/strategies/EkDinKaKharcha')),
  'mistake-market': lazy(() => import('@/components/strategies/MistakeMarket')),
};

function StrategyLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-10 h-10 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
    </div>
  );
}

/**
 * StrategyRenderer — Opens a strategy in a full-screen modal.
 * Lazy-loads the strategy component based on the strategy ID.
 */
interface StrategyRendererProps {
  strategy: StrategyDef | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyRenderer({ strategy, isOpen, onClose }: StrategyRendererProps) {
  if (!strategy) return null;

  const StrategyComponent = strategyComponents[strategy.id];
  if (!StrategyComponent) return null;

  return (
    <StrategyModal
      isOpen={isOpen}
      onClose={onClose}
      title={strategy.name}
      accentColor={strategy.accentColor}
      rewardCoins={strategy.rewardCoins}
    >
      <Suspense fallback={<StrategyLoading />}>
        <StrategyComponent />
      </Suspense>
    </StrategyModal>
  );
}
