# Task: P2-CSS — Premium 3D CSS Overhaul for "Capital Mastery"

- **Agent**: CSS Specialist (Z.ai Code)
- **Task ID**: P2-CSS
- **Target file**: `src/app/globals.css` (appended, existing content preserved)
- **Stack**: Next.js 16 · Tailwind CSS 4 · Framer Motion

## Scope

Global 3D CSS overhaul — append 11 premium effect blocks to the existing
`globals.css` without removing any prior content. Avoid duplicate keyframe
names (suffix `-v2` if collision). Zero lint errors.

## Pre-flight analysis

- Read `worklog.md`, `globals.css` (1215 lines), and `tailwind.config.ts`.
- Audited existing keyframes: `accordion-down/up, aurora-drift, particles-float,
  divider-sweep, badge-pulse, breathing, emoji-pulse, streak-fire,
  slide-up-reveal, page-fade-in, sound-wave, trophy-glow, shimmer, float,
  pulse-glow, float-bob, pulse-ring, sparkle-spin, drift-up, rotate-slow,
  float-3d, coin-spin-3d, page-3d-enter, strategy-float-3d, sparkle-rise,
  badge-3d-spin, confetti-fall`.
- Audited existing utility classes for collisions — none of the 11 target
  class names existed.
- Existing `::selection` and `::-webkit-scrollbar` rules were present; the new
  blocks intentionally override them with upgraded gradient versions (last-wins
  in CSS) per task spec.

## Keyframe collision check (all NEW — no `-v2` needed)

| New keyframe        | Status |
|---------------------|--------|
| `gridShift`         | unique ✓ |
| `gradientShift`     | unique ✓ |
| `skeleton-shimmer`  | unique ✓ (existing `shimmer` is different name) |
| `stagger-reveal`    | unique ✓ (existing `slide-up-reveal` is different) |
| `coin-fall`         | unique ✓ (existing `confetti-fall` is different) |
| `level-up-burst`    | unique ✓ |

## Deliverables appended to `globals.css`

1. **Animated gradient background system** — `body` radial wash (emerald /
   violet / gold) + `.bg-grid-pattern` animated grid with `gridShift` 20s loop.
2. **Animated gradient heading text** — `.heading-gradient` four-stop animated
   gradient (emerald → violet → gold → emerald), `gradientShift` 8s ease.
3. **Skeleton shimmer** — `.skeleton-card` 1.5s shimmer with `skeleton-shimmer`.
4. **Magnetic button** — `.btn-magnetic` premium cubic-bezier transform transition.
5. **Spotlight hover** — `.spotlight-card` + `::before` radial glow following
   `--mouse-x/--mouse-y` CSS vars, fades in on hover.
6. **Page loading bar** — `.page-loading-bar` fixed top, emerald→violet
   gradient, z-index 9999, width-transition.
7. **Staggered grid reveal** — `.stagger-item` fade+rise with `stagger-reveal`
   0.5s `cubic-bezier(0.16, 1, 0.3, 1) forwards`.
8. **Glassmorphic scrollbar upgrade** — `::-webkit-scrollbar` 6px, transparent
   track, emerald→violet gradient thumb + hover state.
9. **Text selection** — `::selection` emerald 30% tint, white text.
10. **Coin rain** — `.coin-rain` fixed overlay z-9998 + `.coin-rain-piece`
    with `coin-fall` 2s linear (translateY 100vh + 360° spin).
11. **Level-up burst** — `.level-up-burst` 0.8s celebration pop with
    `level-up-burst` keyframes (scale + rotate + opacity).

## Quality gates

- `bun run lint` → **0 errors, 0 warnings** ✅
- Existing 1215 lines preserved verbatim (appended starting line 1217).
- All 6 new keyframe names verified unique against existing set.
- All 11 new utility class names verified unique against existing set.
- Tailwind config (`tailwind.config.ts`) untouched — no changes required.

## Notes for downstream agents

- The `body` background override upgrades the previous flat color to the
  multi-radial wash. If any route relied on a pure solid `#0B1220` body bg
  (e.g., for screenshots), it now has subtle ambient color — visually richer.
- The scrollbar is now slightly thinner (6px vs prior 7px) and uses a gradient
  thumb. Custom scroll utilities (`.custom-scroll`, `.scrollbar-none`,
  `.scrollbar-hide`, `.story-reader-scroll`) remain intact and still win where
  applied.
- `.spotlight-card` requires JS to set `--mouse-x` / `--mouse-y` (0–100% values
  derived from cursor position relative to card). Without JS it gracefully
  centers the spotlight at 50%/50%.
- `.btn-magnetic` only declares the transition; the magnetic transform itself
  should be applied via Framer Motion or a mouse-move handler updating
  `transform: translate(...)`.
- `.stagger-item` animates `forwards`, so the final state is visible even if
  the animation is interrupted.
