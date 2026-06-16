# Task 3 - Shared Components Agent

## Task
Create ALL shared components in `/home/z/my-project/src/components/shared/` for the RUPAIYA 101 financial literacy app.

## Files Created

### 1. `DynamicIcon.tsx` (Bonus utility component)
- Resolves Lucide icon by name string dynamically
- Avoids `react-hooks/static-components` lint rule issues
- Used by ModuleCard, StatCard, EmptyState
- Supports `fallback` prop for missing icons

### 2. `ModuleCard.tsx`
- Card for displaying a module in any strategy
- Props: module (Module), onClick, progress (0-100)
- Features:
  - Dynamic Lucide icon from `module.icon` string via DynamicIcon
  - Colored top accent bar using `module.color`
  - Progress bar with gold color
  - Completion badge with green checkmark overlay (animated with Framer Motion spring)
  - Card-lift hover effect: translateY -4px + gold glow shadow
  - shadcn/ui Card as base with dark theme (#12121a)

### 3. `ProgressRing.tsx`
- Circular SVG progress indicator
- Props: progress (0-100), size (default 80), color (default #f59e0b), strokeWidth (default 6)
- Features:
  - Background circle: #1a1a2e
  - Progress circle: colored with stroke-dasharray animation
  - Framer Motion `initial`/`animate` for smooth transitions
  - Center shows percentage number with subtle scale animation
  - Clamped progress value (0-100)

### 4. `CoinCounter.tsx`
- Displays coin balance with animated gold coins
- Props: amount (number), showLabel (boolean, default true)
- Features:
  - Animated counting up effect using requestAnimationFrame + ease-out cubic
  - Coin icon (Coins from lucide-react) bounces when amount changes
  - Bounce animation: scale [1, 1.3, 0.9, 1.1, 1] + rotate
  - Number formatted with Indian locale (toLocaleString('en-IN'))
  - Gold text color (#f59e0b)
  - AnimatePresence for smooth number transitions

### 5. `QuizCard.tsx`
- Multiple choice quiz card
- Props: question (QuizQuestion), onAnswer (callback with selectedIndex), showResult
- Features:
  - 4 option buttons with A/B/C/D letter badges
  - Click shows correct/incorrect with color feedback
  - Correct: emerald green border/bg + CheckCircle2 icon
  - Incorrect: red border/bg + XCircle icon + correct answer highlighted
  - Auto-advances after 2.5 seconds via onAnswer callback
  - Explanation shown after 400ms delay with Hinglish content
  - Difficulty badge (easy=green, medium=gold, hard=red)
  - Module ID badge
  - Hinglish feedback: "Sahi jawab! 🎉" / "Galat jawab!"
  - shadcn/ui Card base, Framer Motion for all animations

### 6. `StatCard.tsx`
- Animated stat display with number counting up
- Props: label, value, prefix, suffix, color (#f59e0b default), icon
- Features:
  - Number animates from 0 to value on mount using Framer Motion `animate()`
  - Direct DOM update via ref for performance (avoids re-renders)
  - Indian locale number formatting
  - Optional icon via DynamicIcon with colored background
  - Subtle animated bottom accent line
  - Dark card background (#12121a)

### 7. `SliderControl.tsx`
- Custom range slider with labels
- Props: label, value, min, max, step, onChange, prefix, suffix, color
- Features:
  - Built on shadcn/ui Slider component
  - Current value displayed prominently with color flash on change
  - Min/max labels on sides
  - Custom gold thumb and track via injected CSS
  - Thumb glow effect (box-shadow with color)
  - Framer Motion for smooth value change animation

### 8. `EmptyState.tsx`
- Placeholder for unfinished features
- Props: title, description, icon
- Features:
  - Centered layout with floating icon animation (y: [0, -8, 0], infinite)
  - Icon from DynamicIcon with Construction fallback
  - Subtle entrance animation for description
  - Pulsing dots decoration at bottom
  - Dark themed with muted colors (#8888a0)

## Lint Status
All shared components pass ESLint (`npx eslint src/components/shared/` - 0 errors, 0 warnings).

## Technical Decisions
- Created `DynamicIcon.tsx` utility component to avoid `react-hooks/static-components` lint errors when dynamically resolving Lucide icons by name string
- Used `useMemo` for icon lookups (though DynamicIcon approach made this unnecessary)
- Avoided synchronous `setState` in `useEffect` by using `setTimeout` for bounces and inline callbacks for quiz logic
- Used direct DOM manipulation via refs for StatCard counter animation to avoid re-render overhead
- Simplified ProgressRing to use Framer Motion `initial`/`animate` directly instead of complex motion values
