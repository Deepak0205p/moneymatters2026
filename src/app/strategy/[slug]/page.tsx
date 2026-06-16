"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, HelpCircle, Sparkles } from "lucide-react";
import { useAppStore, useHydration } from "@/lib/store/useAppStore";
import { getStrategyBySlug, type StrategyDef } from "@/lib/data/strategyRegistry";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ── Lazy-loaded strategy components (one per slug) ──
const strategyComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  "paise-ka-gps": lazy(() => import("@/components/strategies/PaiseKaGPS")),
  "budget-khel": lazy(() => import("@/components/strategies/BudgetKhel")),
  "ghar-ka-budget": lazy(() => import("@/components/strategies/GharKaBudget")),
  "mistake-market": lazy(() => import("@/components/strategies/MistakeMarket")),
  "kya-hota-agar": lazy(() => import("@/components/strategies/KyaHotaAgar")),
  "chhupa-hua-chor": lazy(() => import("@/components/strategies/ChhupaHuaChor")),
  "compounding-tree": lazy(() => import("@/components/strategies/CompoundingTree")),
  "debt-trap-darwaza": lazy(() => import("@/components/strategies/DebtTrapDarwaza")),
};

function StrategyLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
        <p className="text-xs text-ink-muted">Strategy load ho raha hai…</p>
      </div>
    </div>
  );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card rounded-2xl p-8 text-center max-w-md">
        <div className="text-5xl mb-4">🤷</div>
        <h2 className="font-display text-xl font-bold text-ink mb-2">
          Strategy nahi mila
        </h2>
        <p className="text-sm text-ink-muted mb-6">
          Yeh strategy exist nahi karta. Dashboard par wapas jaake koi sahi
          strategy chuno.
        </p>
        <button
          onClick={onBack}
          className="btn-emerald rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Dashboard par jao
        </button>
      </div>
    </div>
  );
}

/** Onboarding / Help dialog showing the 4-step intro for the strategy. */
function HelpDialog({
  strategy,
  open,
  onOpenChange,
}: {
  strategy: StrategyDef;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-midnight-soft border-white/10 text-ink">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
              style={{
                background: `${strategy.accentColor}22`,
                border: `1px solid ${strategy.accentColor}44`,
              }}
            >
              {strategy.iconName}
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold text-ink">
                {strategy.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-ink-muted">
                {strategy.hook}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto custom-scroll pr-1">
          {strategy.onboardingSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xl">{step.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Step {idx + 1}
                </span>
                <h3 className="font-display text-sm font-bold text-ink">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line pl-7">
                {step.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-3">
          <Coins size={16} className="text-gold" />
          <span className="text-xs font-semibold text-gold">
            Reward: {strategy.rewardCoins} gold coins
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StrategyPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug;
  const slug =
    typeof slugParam === "string"
      ? slugParam
      : Array.isArray(slugParam)
        ? slugParam[0]
        : "";
  const hydrated = useHydration();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const coins = useAppStore((s) => s.coins);

  const [helpOpen, setHelpOpen] = useState(false);

  const strategy = slug ? getStrategyBySlug(slug) : undefined;

  // Auth guard — redirect to /auth if not authenticated (after hydration)
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [hydrated, isAuthenticated, router]);

  // Hydration loading state
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="h-12 w-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleBack = () => router.push("/dashboard");

  const StrategyComponent = strategy ? strategyComponents[strategy.slug] : null;

  return (
    <main className="relative min-h-screen w-full bg-midnight text-ink">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-[20%] -left-[20%] h-[70%] w-[70%] rounded-full blur-[140px]"
          style={{
            background: strategy
              ? `${strategy.accentColor}14`
              : "rgba(16,185,129,0.08)",
          }}
        />
        <div className="absolute -bottom-[20%] -right-[20%] h-[70%] w-[70%] rounded-full bg-ai/[0.08] blur-[140px]" />
      </div>

      {/* ── Fixed top bar (~56px) ── */}
      <header className="glass-strong fixed inset-x-0 top-0 z-40 h-14 border-b border-white/10">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-3 sm:px-5">
          {/* Left: back arrow */}
          <button
            onClick={handleBack}
            aria-label="Dashboard par wapas jao"
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-muted transition-all hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald-soft active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Center: strategy name */}
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            {strategy && (
              <>
                <span className="hidden text-lg sm:inline">{strategy.iconName}</span>
                <h1 className="font-display truncate text-base font-bold text-ink sm:text-lg">
                  {strategy.name}
                </h1>
              </>
            )}
          </div>

          {/* Right: coin counter + help */}
          <div className="flex shrink-0 items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1.5"
              title="Tumhare gold coins"
            >
              <Coins size={15} className="text-gold" />
              <span className="font-display text-sm font-bold text-gold tabular-nums">
                {coins}
              </span>
            </div>
            <button
              onClick={() => setHelpOpen(true)}
              disabled={!strategy}
              aria-label="Strategy help aur onboarding dekho"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ai/30 bg-ai/10 text-ai-soft transition-all hover:border-ai/50 hover:bg-ai/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Strategy content (scrollable, below fixed top bar) ── */}
      <div className="page-3d-enter relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-20 sm:px-6">
        <AnimatePresence mode="wait">
          {strategy && StrategyComponent ? (
            <motion.div
              key={strategy.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Hook banner */}
              <div
                className="glass-card mb-5 flex items-center gap-3 rounded-2xl p-4"
                style={{ borderColor: `${strategy.accentColor}33` }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: `${strategy.accentColor}22`,
                    border: `1px solid ${strategy.accentColor}44`,
                  }}
                >
                  {strategy.iconName}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Hook
                  </p>
                  <p className="font-display text-sm font-semibold text-ink sm:text-base">
                    {strategy.hook}
                  </p>
                </div>
                <div className="ml-auto hidden items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 sm:flex">
                  <Sparkles size={13} className="text-gold" />
                  <span className="text-xs font-semibold text-gold">
                    {strategy.rewardCoins} coins
                  </span>
                </div>
              </div>

              {/* Strategy component */}
              <div className="perspective-3d">
                <Suspense fallback={<StrategyLoading />}>
                  <StrategyComponent />
                </Suspense>
              </div>
            </motion.div>
          ) : (
            <NotFoundState onBack={handleBack} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Help / Onboarding dialog ── */}
      {strategy && (
        <HelpDialog
          strategy={strategy}
          open={helpOpen}
          onOpenChange={setHelpOpen}
        />
      )}
    </main>
  );
}
