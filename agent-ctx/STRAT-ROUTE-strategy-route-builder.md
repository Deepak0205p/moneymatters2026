# STRAT-ROUTE — Strategy Route Builder

**Task ID:** STRAT-ROUTE
**Agent:** Strategy Route Builder
**Scope:** Dynamic `/strategy/[slug]` route + strategy registry update (slug, hook, onboardingSteps).

## What was delivered

### 1. Updated `src/lib/data/strategyRegistry.ts`
- New `OnboardingStep` interface: `{ title: string; icon: string; content: string }`.
- Extended `StrategyDef` with three new fields:
  - `slug` — URL slug for `/strategy/[slug]`.
  - `hook` — one-line Hinglish hook text.
  - `onboardingSteps` — 4-step intro sequence.
- All 8 strategies updated with the EXACT slug + hook + moduleId mapping from the spec.
- Each `onboardingSteps` array follows the strict 4-step pattern:
  1. "Yeh Kya Hai?" — what the strategy is (1 sentence).
  2. "Kya Sikhoge?" — 3 `✅` bullet points (newline-separated for `whitespace-pre-line`).
  3. "Kaise Khelna Hai?" — brief instruction.
  4. "Ready?" — coin reward mention + "LET'S GO!".
- New helper: `getStrategyBySlug(slug)` for the route.
- Existing `getStrategiesForModule` and `getStrategyById` preserved → no breaking changes for `SwipeCardViewer` / `StrategyRenderer`.

### 2. Created `src/app/strategy/[slug]/page.tsx`
- `"use client"` dynamic route.
- Reads `slug` from `useParams()` (handles both `string` and `string[]` shapes).
- Looks up strategy via `getStrategyBySlug(slug)`.
- **Auth guard:** `useHydration()` → if `!isAuthenticated`, `useEffect` calls `router.replace('/auth')`. Matches the existing `/dashboard/module/[id]` pattern.
- **Hydration loading:** full-screen emerald spinner on `bg-midnight`.
- **Fixed top bar** (h-14 ≈ 56px, `glass-strong`, `border-b border-white/10`, z-40):
  - Left → back arrow button (`ArrowLeft`, `aria-label`) → `router.push('/dashboard')`.
  - Center → strategy icon emoji (sm+) + name (`font-display`, truncate, bold).
  - Right → gold coin counter (`Coins` icon + `coins` from store, gold border ring, `tabular-nums`) + Help button (circle, `HelpCircle`, `ai-soft` accent → opens `HelpDialog`).
- **Main content:** `page-3d-enter` class, `max-w-5xl`, `pt-20` (clears fixed top bar).
- **Hook banner** above strategy: `glass-card` with accent-tinted border, strategy icon tile, "Hook" label + hook text, reward coin badge (hidden on mobile).
- **Lazy-loaded strategy component** via `strategyComponents[slug]` map (all 8 slugs mapped), wrapped in `<Suspense>` with `StrategyLoading` spinner fallback, inside `perspective-3d` wrapper.
- `AnimatePresence` (mode="wait") for fade in/out between strategies.
- **HelpDialog** (shadcn `Dialog`): header (icon + name + hook), maps `onboardingSteps` → animated `glass-card` tiles (Step N label, emoji, title, `whitespace-pre-line` content), gold reward footer. `max-h-60vh` with `custom-scroll`.
- **NotFoundState** fallback for unknown slugs (🤷 emoji + "Dashboard par jao" button).
- Ambient backdrop: two blurred radial blobs (accent-tinted top-left, ai-tinted bottom-right).

## Verification
- `bun run lint`: **zero errors, zero warnings** ✅
- Dev server log clean (Ready in 602ms).
- No breaking changes to existing `StrategyRenderer` / `SwipeCardViewer` (only additive fields + new helper).

## Downstream wiring
To link strategy cards/buttons to the new route:
```ts
import { useRouter } from 'next/navigation';
// ...
router.push(`/strategy/${strategy.slug}`);
```

## Files touched
- Modified: `src/lib/data/strategyRegistry.ts`
- Created: `src/app/strategy/[slug]/page.tsx`
