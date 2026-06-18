"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, HelpCircle, Sparkles } from "lucide-react";
import { useAppStore, useHydration } from "@/lib/store/useAppStore";
import { getStrategyBySlug } from "@/lib/data/strategyRegistry";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// ── Lazy-loaded strategy components (one per slug) ──
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const strategyComponents = {
  "paise-ka-gps": /*#__PURE__*/lazy(() => import("@/components/strategies/PaiseKaGPS")),
  "budget-khel": /*#__PURE__*/lazy(() => import("@/components/strategies/BudgetKhel")),
  "ghar-ka-budget": /*#__PURE__*/lazy(() => import("@/components/strategies/GharKaBudget")),
  "mistake-market": /*#__PURE__*/lazy(() => import("@/components/strategies/MistakeMarket")),
  "kya-hota-agar": /*#__PURE__*/lazy(() => import("@/components/strategies/KyaHotaAgar")),
  "chhupa-hua-chor": /*#__PURE__*/lazy(() => import("@/components/strategies/ChhupaHuaChor")),
  "compounding-tree": /*#__PURE__*/lazy(() => import("@/components/strategies/CompoundingTree")),
  "debt-trap-darwaza": /*#__PURE__*/lazy(() => import("@/components/strategies/DebtTrapDarwaza"))
};
function StrategyLoading() {
  return /*#__PURE__*/_jsx("div", {
    className: "flex min-h-[60vh] items-center justify-center",
    children: /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center gap-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "h-10 w-10 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-xs text-ink-muted",
        children: "Strategy load ho raha hai\u2026"
      })]
    })
  });
}
function NotFoundState({
  onBack
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex min-h-[60vh] items-center justify-center px-4",
    children: /*#__PURE__*/_jsxs("div", {
      className: "glass-card rounded-2xl p-8 text-center max-w-md",
      children: [/*#__PURE__*/_jsx("div", {
        className: "text-5xl mb-4",
        children: "\uD83E\uDD37"
      }), /*#__PURE__*/_jsx("h2", {
        className: "font-display text-xl font-bold text-ink mb-2",
        children: "Strategy nahi mila"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-ink-muted mb-6",
        children: "Yeh strategy exist nahi karta. Dashboard par wapas jaake koi sahi strategy chuno."
      }), /*#__PURE__*/_jsx("button", {
        onClick: onBack,
        className: "btn-emerald rounded-xl px-5 py-2.5 text-sm font-semibold",
        children: "Dashboard par jao"
      })]
    })
  });
}

/** Onboarding / Help dialog showing the 4-step intro for the strategy. */
function HelpDialog({
  strategy,
  open,
  onOpenChange
}) {
  return /*#__PURE__*/_jsx(Dialog, {
    open: open,
    onOpenChange: onOpenChange,
    children: /*#__PURE__*/_jsxs(DialogContent, {
      className: "max-w-lg bg-midnight-soft border-white/10 text-ink",
      children: [/*#__PURE__*/_jsx(DialogHeader, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: "flex h-11 w-11 items-center justify-center rounded-xl text-2xl",
            style: {
              background: `${strategy.accentColor}22`,
              border: `1px solid ${strategy.accentColor}44`
            },
            children: strategy.iconName
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(DialogTitle, {
              className: "font-display text-lg font-bold text-ink",
              children: strategy.name
            }), /*#__PURE__*/_jsx(DialogDescription, {
              className: "text-xs text-ink-muted",
              children: strategy.hook
            })]
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-3 mt-2 max-h-[60vh] overflow-y-auto custom-scroll pr-1",
        children: strategy.onboardingSteps.map((step, idx) => /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 8
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            delay: idx * 0.06
          },
          className: "glass-card rounded-xl p-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2.5 mb-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-xl",
              children: step.icon
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-[10px] font-bold uppercase tracking-wider text-ink-muted",
              children: ["Step ", idx + 1]
            }), /*#__PURE__*/_jsx("h3", {
              className: "font-display text-sm font-bold text-ink",
              children: step.title
            })]
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-ink-muted leading-relaxed whitespace-pre-line pl-7",
            children: step.content
          })]
        }, idx))
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-3",
        children: [/*#__PURE__*/_jsx(Coins, {
          size: 16,
          className: "text-gold"
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-xs font-semibold text-gold",
          children: ["Reward: ", strategy.rewardCoins, " gold coins"]
        })]
      })]
    })
  });
}
export default function StrategyPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params?.slug;
  const slug = typeof slugParam === "string" ? slugParam : Array.isArray(slugParam) ? slugParam[0] : "";
  const hydrated = useHydration();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const coins = useAppStore(s => s.coins);
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
    return /*#__PURE__*/_jsx("div", {
      className: "flex min-h-screen items-center justify-center bg-midnight",
      children: /*#__PURE__*/_jsx("div", {
        className: "h-12 w-12 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin"
      })
    });
  }
  if (!isAuthenticated) {
    return null;
  }
  const handleBack = () => router.push("/dashboard");
  const StrategyComponent = strategy ? strategyComponents[strategy.slug] : null;
  return /*#__PURE__*/_jsxs("main", {
    className: "relative min-h-screen w-full bg-midnight text-ink",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "pointer-events-none fixed inset-0 z-0",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute -top-[20%] -left-[20%] h-[70%] w-[70%] rounded-full blur-[140px]",
        style: {
          background: strategy ? `${strategy.accentColor}14` : "rgba(16,185,129,0.08)"
        }
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute -bottom-[20%] -right-[20%] h-[70%] w-[70%] rounded-full bg-ai/[0.08] blur-[140px]"
      })]
    }), /*#__PURE__*/_jsx("header", {
      className: "glass-strong fixed inset-x-0 top-0 z-40 h-14 border-b border-white/10",
      children: /*#__PURE__*/_jsxs("div", {
        className: "mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-3 sm:px-5",
        children: [/*#__PURE__*/_jsx("button", {
          onClick: handleBack,
          "aria-label": "Dashboard par wapas jao",
          className: "group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-muted transition-all hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald-soft active:scale-95",
          children: /*#__PURE__*/_jsx(ArrowLeft, {
            size: 18
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex min-w-0 flex-1 items-center justify-center gap-2",
          children: strategy && /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsx("span", {
              className: "hidden text-lg sm:inline",
              children: strategy.iconName
            }), /*#__PURE__*/_jsx("h1", {
              className: "font-display truncate text-base font-bold text-ink sm:text-lg",
              children: strategy.name
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex shrink-0 items-center gap-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1.5",
            title: "Tumhare gold coins",
            children: [/*#__PURE__*/_jsx(Coins, {
              size: 15,
              className: "text-gold"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display text-sm font-bold text-gold tabular-nums",
              children: coins
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setHelpOpen(true),
            disabled: !strategy,
            "aria-label": "Strategy help aur onboarding dekho",
            className: "flex h-9 w-9 items-center justify-center rounded-full border border-ai/30 bg-ai/10 text-ai-soft transition-all hover:border-ai/50 hover:bg-ai/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
            children: /*#__PURE__*/_jsx(HelpCircle, {
              size: 16
            })
          })]
        })]
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "page-3d-enter relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-20 sm:px-6",
      children: /*#__PURE__*/_jsx(AnimatePresence, {
        mode: "wait",
        children: strategy && StrategyComponent ? /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.25
          },
          children: [/*#__PURE__*/_jsxs("div", {
            className: "glass-card mb-5 flex items-center gap-3 rounded-2xl p-4",
            style: {
              borderColor: `${strategy.accentColor}33`
            },
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl",
              style: {
                background: `${strategy.accentColor}22`,
                border: `1px solid ${strategy.accentColor}44`
              },
              children: strategy.iconName
            }), /*#__PURE__*/_jsxs("div", {
              className: "min-w-0",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] font-bold uppercase tracking-wider text-ink-muted",
                children: "Hook"
              }), /*#__PURE__*/_jsx("p", {
                className: "font-display text-sm font-semibold text-ink sm:text-base",
                children: strategy.hook
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "ml-auto hidden items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 sm:flex",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                size: 13,
                className: "text-gold"
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-xs font-semibold text-gold",
                children: [strategy.rewardCoins, " coins"]
              })]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "perspective-3d",
            children: /*#__PURE__*/_jsx(Suspense, {
              fallback: /*#__PURE__*/_jsx(StrategyLoading, {}),
              children: /*#__PURE__*/_jsx(StrategyComponent, {})
            })
          })]
        }, strategy.slug) : /*#__PURE__*/_jsx(NotFoundState, {
          onBack: handleBack
        })
      })
    }), strategy && /*#__PURE__*/_jsx(HelpDialog, {
      strategy: strategy,
      open: helpOpen,
      onOpenChange: setHelpOpen
    })]
  });
}