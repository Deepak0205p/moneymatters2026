# Task fix-1/feat-1 — Favicon & CSS Polish

## Summary
Three changes made to improve the RUPAIYA 101 app's visual polish:

### 1. Created `/public/favicon.svg`
- Gold rupee symbol (₹) on dark background (#0a0a0f) with rounded corners

### 2. Updated `src/app/layout.tsx`
- Changed `icons.icon` from `/favicon.ico` to `/favicon.svg`

### 3. Enhanced `src/app/globals.css`
Appended the following new utility classes (all existing styles preserved):
- `.strategy-header` — section header with gold gradient underline
- `.badge-earned` + `@keyframes badgePop` — earned badge pop animation
- `.glass-card` — frosted glass card effect
- `@keyframes slideUp` + `.animate-slide-up` — content reveal animation
- `.stagger-children` — staggered child reveal (12 items)
- `@keyframes pulseRing` + `.animate-pulse-ring` — active station pulse
- `@keyframes coinBounce` + `.animate-coin-bounce` — coin bounce effect
- `.progress-glow` — progress bar gold glow
- `.text-shadow-gold` — heading text shadow
- `.noise-overlay::before` — subtle noise texture
- `.module-item-hover` — sidebar module with gold left-bar hover
- `.rupaiya-tooltip` — custom tooltip style
- `.term-mastered` — green checkmark for mastered terms

## Lint
Passed with no errors.
