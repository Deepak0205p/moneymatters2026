# Task P1-TOOLS-9-16 — Premium FinTech Tools Redesign (Midnight Wealth + Emerald Growth)

**Agent:** Code Agent (Tools 9-16 rewrite)
**Task ID:** P1-TOOLS-9-16
**Date:** Capital Mastery redesign pass

## Spec Recap
8 tools in `/home/z/my-project/src/components/shared/` rewritten end-to-end with the Midnight Wealth + Emerald Growth theme (#0B1220 base, #10B981 primary, #8B5CF6 AI, #F59E0B reward, #EF4444 danger). Mobile-first, Hinglish content, Framer Motion animations, glassmorphism, store-integrated, same `{ open, onClose }` props & same export names preserved.

## Files Rewritten (8 total)

### 1. WordScramble.tsx (Tool 9) — 605 lines
- Default export `WordScramble` preserved
- 4 categories: Banking / Investment / Tax / Insurance (8 words each = 32 total, tracked as X/30 mastered)
- Drag-reorder scrambled letter tiles via `Reorder.Group` + tap-to-place slots
- Tap-to-remove from slots
- Hinglish hint system (tappable, collapsible)
- 45s timer with color-coded bar (emerald → amber → red) + bonus coins for fast solve
- Streak multiplier (2x+ = +5 coins), confetti burst on correct, red shake on wrong
- Meaning + Hinglish example revealed on correct
- Result modal with coins earned + words mastered stats
- Auto-awards `word-master` badge after 5+ solved

### 2. FinancialNewsWidget.tsx (Tool 10) — 412 lines
- Default export `FinancialNewsWidget` preserved
- Instagram-Reels-style vertical scroll-snap cards (h-480px)
- 12 Hinglish news cards across 4 categories (Markets / Tips / Banking / Tax) with emojis + sources
- AI-curated "Tumhare Liye" horizontal chip row (4 picks)
- Horizontal category filter chips (All / Markets / Tips / Banking / Tax)
- Bookmark toggle + native Share API (with clipboard fallback)
- Full-screen detail modal on card tap
- Animated swipe-up hint on first card

### 3. PriorityCalculator.tsx (Tool 11) — 372 lines
- Default export `PriorityCalculator` preserved
- Income input with ₹5 presets (₹3k/5k/10k/15k/25k)
- 9 drag-reorder priority cards (Rent, Food, Transport, Phone, Education, Entertainment, Health, Savings, Gifts) via `Reorder.Group`
- Live allocation bar chart updates as user reorders (color-coded per category)
- Live "Allocated / Remaining" summary
- Side-by-side Ideal Budget (50/30/20 rule) comparison
- AI suggestion with danger/warning/success states (Hinglish, dynamic based on savings/entertainment/rent %)
- Save Priorities button (+15 coins) + Share button

### 4. InvestmentComparison.tsx (Tool 12) — 380 lines
- Default export `InvestmentComparison` preserved
- 7 investment options (FD, SIP, Real Estate, Gold, Stocks, PPF, NPS) as visual cards
- Each card: emoji, name, animated returns bar (scaled to 18%), risk dots (1-3 colored), min amount, lock-in, "Best for" tag
- Multi-select (max 3) with checkmark indicator
- Compare Now opens split-screen modal: Returns / Risk / Min Amt / Lock-in / Best For / Pros / Cons rows
- AI suggestion block (purple accent) with dynamic copy based on selection
- "Start Investing" CTA (+5 coins)
- Trophy "Best Pick for Students" callout in comparison modal

### 5. EmergencyFundCalculator.tsx (Tool 13) — 358 lines
- Default export `EmergencyFundCalculator` preserved
- Animated Protection Shield SVG that fills based on currentSavings/target ratio
- 4 tiers: Broken (red, with cracks) / Half (amber) / Strong (emerald) / Full golden (glowing)
- Inputs: 6 expense rows (+/- ₹500 buttons + direct input), job type (Student/Employed/Freelancer = 3/6/9 months cover), dependents (0-4 = +₹10k each), current savings
- Live target calculation + monthly saving plan (target/12) + months to reach
- 80% Indians stat banner (amber)
- AI tip adapts per tier
- Auto-awards `emergency-shielded` badge + 25 coins when 75%+ protected

### 6. HabitTracker.tsx (Tool 14) — 332 lines
- Default export `HabitTracker` preserved
- 5 daily habit cards (track expenses, avoid unnecessary, learn concept, save money, check UPI)
- Swipe-to-mark-done via Framer Motion drag (60px threshold left/right)
- Tap-to-toggle also supported (44px touch target)
- Streak counter with growing flame tier (🌱 Spark → 🔥 Streak → 💎 Adaat → 🏆 Master)
- 28-day GitHub-style weekly heatmap (5 intensity levels, emerald scale, today highlighted gold)
- Perfect Day celebration card (+10 coins + `perfect-day` badge auto-awarded)
- 4 achievement badges grid (Shuruat/Consistent/Adaat/Master)
- AI reminder adapts based on completion + streak
- Today's progress bar + completion rate

### 7. FinancialAgeCalculator.tsx (Tool 15) — 432 lines
- Default export `FinancialAgeCalculator` preserved
- 4 game states: intro → playing → reveal → result
- 9 fun Hinglish questions (salary, budget, emergency, SIP, credit, insurance, spending, tax, goal)
- Instagram-story progress dots (one per question, fills as you answer)
- Big tappable glass-card options with emoji + arrow
- Dramatic reveal: blur → focus → spinning crystal ball → bouncing dots → age appears with confetti burst (16 colored pieces)
- Age mapped 12-60 based on score 9-36
- 4 result tiers (Just Started/Learning Phase/On Track/Financial Guru) with emoji + color + description + 3 personalized tips
- Score breakdown bar
- Share Result button (native Share API + clipboard fallback)
- Retake button + "+20 coins, retake after 30 days" prompt
- Auto-awards `financial-age` badge

### 8. SIPCalculator.tsx (Tool 16) — 422 lines
- Named export `SIPCalculator` preserved (matches tools/page.tsx import)
- Visual "Wealth Mountain" SVG with layered emerald base (invested) + gold peak (returns) + flag on top
- 4 milestone flags on mountain (₹1L/5L/10L/1Cr) — turn from gray ⚪ to earned emoji when crossed
- Twinkling stars background animation
- 3 sliders: Monthly SIP (₹500-50k step 500, 4 presets ₹500/1k/2k/5k), Duration (1-30 yrs), Return (8-15%)
- 3-stat result row: Invested / Returns / Total Value (with gold glow on total)
- Donut chart (invested vs returns %) with center label
- Milestone journey list (locked/crossed with % progress)
- Next-milestone progress bar (emerald-to-gold gradient)
- FD comparison callout (rose border) showing how much less FD would earn
- "Yeh amount kitna bada hai?" relatable comparisons: iPhones / Royal Enfields / Goa trips
- Start SIP CTA (+5 coins)

## Cross-cutting changes
- Added `.no-scrollbar` CSS utility to globals.css (used by horizontal chip rows in WordScramble + FinancialNewsWidget)
- All 8 components use Dialog with `bg-[#0B1220]` (theme bg), `text-[#F8FAFC]` (theme text-ink), `border-white/[0.08]`
- All 8 components use `glass-card`, `glass-card-premium`, `card-3d`, `btn-3d`, `heading-gradient`, `font-display` CSS utilities from globals.css
- All 8 components use `useAppStore` for coins/badges/habit tracking integration
- All 8 components use Framer Motion: `motion.div`, `motion.button`, `AnimatePresence`, `Reorder`, drag gestures, spring transitions
- Hinglish content throughout (UPI, Swiggy, Zomato, IPL, chai tapri, hostel references)
- Mobile-first: 44px touch targets, max-w-lg, max-h-[92vh] with overflow-y-auto, responsive grid (grid-cols-2 on mobile)

## Quality Gates
- `bun run lint` → **0 errors, 0 warnings** ✅
- Dev server compiles cleanly, `GET /tools` → HTTP 200, 85KB HTML rendered ✅
- All 8 export names verified unchanged (7 default + 1 named for SIP) ✅
- All 8 props patterns preserved: `{ open: boolean, onClose: () => void }` ✅
- All 8 files use `"use client";` directive ✅
- All 8 files import `useAppStore` from `@/lib/store/useAppStore` ✅
- Zero new npm packages added ✅
- All TypeScript types properly defined and used ✅

Work record: /home/z/my-project/agent-ctx/P1-TOOLS-9-16-code-agent.md
