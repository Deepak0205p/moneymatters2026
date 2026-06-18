"use client";

import { lazy, Suspense } from 'react';
import { StrategyModal } from '@/components/shared/StrategyModal';
import { jsx as _jsx } from "react/jsx-runtime";
// Lazy-load the 8 active strategy components
// (Report Card, Rupaiya Dictionary, Ek Din Ka Kharcha are NOT embedded in modules)
const strategyComponents = {
  'paise-ka-gps': /*#__PURE__*/lazy(() => import('@/components/strategies/PaiseKaGPS')),
  'budget-khel': /*#__PURE__*/lazy(() => import('@/components/strategies/BudgetKhel')),
  'ghar-ka-budget': /*#__PURE__*/lazy(() => import('@/components/strategies/GharKaBudget')),
  'mistake-market': /*#__PURE__*/lazy(() => import('@/components/strategies/MistakeMarket')),
  'kya-hota-agar': /*#__PURE__*/lazy(() => import('@/components/strategies/KyaHotaAgar')),
  'chhupa-hua-chor': /*#__PURE__*/lazy(() => import('@/components/strategies/ChhupaHuaChor')),
  'compounding-tree': /*#__PURE__*/lazy(() => import('@/components/strategies/CompoundingTree')),
  'debt-trap-darwaza': /*#__PURE__*/lazy(() => import('@/components/strategies/DebtTrapDarwaza'))
};
function StrategyLoading() {
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-center justify-center min-h-[40vh]",
    children: /*#__PURE__*/_jsx("div", {
      className: "w-10 h-10 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin"
    })
  });
}

/**
 * StrategyRenderer — Opens a strategy in a full-screen modal.
 * Lazy-loads the strategy component based on the strategy ID.
 */

export function StrategyRenderer({
  strategy,
  isOpen,
  onClose
}) {
  if (!strategy) return null;
  const StrategyComponent = strategyComponents[strategy.id];
  if (!StrategyComponent) return null;
  return /*#__PURE__*/_jsx(StrategyModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: strategy.name,
    accentColor: strategy.accentColor,
    rewardCoins: strategy.rewardCoins,
    children: /*#__PURE__*/_jsx(Suspense, {
      fallback: /*#__PURE__*/_jsx(StrategyLoading, {}),
      children: /*#__PURE__*/_jsx(StrategyComponent, {})
    })
  });
}