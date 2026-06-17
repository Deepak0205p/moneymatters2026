# PART 5: POST-BUILD AUTOMATED REVIEW — Multiple Cron Jobs for QA

## IMPORTANT: This prompt is to be used ONLY AFTER you have completed ALL tasks from:

## - `part1.md`
## - `part2.md`
## - `part3.md`
## - `part4.md`

## DO NOT run this until the full build is done. This is the FINAL QUALITY ASSURANCE phase.

---

## CONTEXT

You have now built the entire "Capital Mastery" app with all features. Now you MUST switch to **REVIEWER MODE** — your only job now is to **find bugs, fix them, rebuild, and repeat** until the app is perfect.

You will run **5 separate review cycles (cron jobs)**. Each cycle focuses on a specific area. After ALL cycles are complete, run one FINAL overall review.

**Rules:**
1. For each cron job: Run `npm run build`, test the specific area, fix ALL bugs found, rebuild again.
2. Do NOT skip any check. Be thorough.
3. After fixing a bug, ALWAYS rebuild to confirm the fix didn't break something else.
4. Keep a running count: "Cron X: Found Y bugs, Fixed Y bugs."
5. Move to the next cron job ONLY when the current one has ZERO remaining bugs.

---

## CRON JOB 1: UI & 3D VISUAL REVIEW 🎨

**Focus:** Visual appearance, 3D effects, animations, responsiveness, theme consistency.

### Run these checks:

**1.1 Theme Consistency:**
- [ ] Every page uses `#0B1220` background — no white, no grey, no other dark color.
- [ ] All cards use glassmorphism: `rgba(255,255,255,0.05)` + `backdrop-filter: blur(16px)`.
- [ ] All primary buttons use Emerald `#10B981`.
- [ ] AI elements use Purple `#8B5CF6`.
- [ ] Reward elements (coins, badges) use Gold `#F59E0B`.
- [ ] Text colors: Primary `#F8FAFC`, Secondary `#94A3B8`. No random colors.
- [ ] No white flashes on page load or theme switch.
- [ ] No unstyled/default browser elements visible.

**1.2 3D Effects:**
- [ ] All cards have 3D tilt-on-hover effect (perspective + rotateX/Y).
- [ ] 3D depth shadows shift based on tilt direction.
- [ ] Buttons have 3D push effect (shadow + translateY on click).
- [ ] Sidebar active items have depth pop-out.
- [ ] Page transitions have 3D slide/fade animations.
- [ ] No 3D effects causing layout overflow or scrollbar issues.

**1.3 Animations:**
- [ ] All Framer Motion animations work without jank.
- [ ] `AnimatePresence` wraps all conditionally rendered components.
- [ ] No layout shifts (CLS) during animations.
- [ ] Loading skeletons appear instead of blank screens.
- [ ] Confetti/celebration animations fire at correct moments.
- [ ] Badge earning animation plays correctly.
- [ ] Coin count animation (count-up) works.
- [ ] Strategy onboarding popup slides work (3-4 steps, dots, swipe).

**1.4 Responsiveness:**
- [ ] Test at 375px (iPhone SE) — nothing overflows or breaks.
- [ ] Test at 390px (iPhone 14) — everything looks clean.
- [ ] Test at 768px (iPad) — proper 2-column layouts.
- [ ] Test at 1440px (Desktop) — max-width centered, no stretching.
- [ ] Bottom navigation appears on mobile only.
- [ ] Sidebar visible on desktop only.
- [ ] All modals/slide-overs are properly sized on mobile.
- [ ] Text is readable — no truncation, no overflow.
- [ ] Touch targets are minimum 44px on mobile.

**After fixing all UI bugs:** Run `npm run build` and confirm ZERO errors.

---

## CRON JOB 2: BACKEND, LOGIC & DATA REVIEW ⚙️

**Focus:** State management, API routes, data flow, calculations, persistence.

### Run these checks:

**2.1 Zustand Stores:**
- [ ] All stores have proper TypeScript types (no `any` abuse).
- [ ] `persist` middleware is enabled for: user progress, coins, streaks, badges, profile data.
- [ ] Hydration is handled properly (no SSR mismatch errors).
- [ ] No stale state — data updates reflect immediately in UI.
- [ ] Store actions have try-catch error handling.
- [ ] All initial states have sensible defaults.

**2.2 API Routes (`/api/*`):**
- [ ] All API routes have try-catch blocks.
- [ ] All return consistent JSON format: `{ success, data?, error? }`.
- [ ] Proper HTTP status codes (200, 400, 404, 500).
- [ ] Input validation on all endpoints.
- [ ] No hardcoded secrets — use environment variables.
- [ ] CORS is not blocking requests.

**2.3 Calculations:**
- [ ] SIP Calculator formula is correct: `FV = P × [((1+r)^n - 1) / r] × (1+r)`.
- [ ] Inflation calculator: Purchasing power = Amount / (1 + rate)^years.
- [ ] Compound interest calculations are accurate.
- [ ] Budget percentages add up to 100%.
- [ ] Emergency fund targets are calculated correctly.
- [ ] Coin awards match the amounts specified in prompts.
- [ ] XP calculations match the leveling system.

**2.4 Data Persistence:**
- [ ] User profile data persists across page refresh.
- [ ] Module progress persists across sessions.
- [ ] Coins and badges persist.
- [ ] Streaks persist and reset correctly at midnight.
- [ ] Strategy completion status persists.
- [ ] Expense tracker data persists.
- [ ] Goal tracker data persists.

**2.5 Navigation & Routing:**
- [ ] All routes are properly defined in the app router.
- [ ] Dynamic routes `/strategy/[slug]` resolve correctly for all 8 strategies.
- [ ] Back button works correctly from every page.
- [ ] No dead links or broken routes.
- [ ] Protected routes redirect properly (if auth exists).

**After fixing all backend bugs:** Run `npm run build` and confirm ZERO errors.

---

## CRON JOB 3: FEATURES & TOOLS WORKING REVIEW 🛠️

**Focus:** Every tool/feature actually WORKS end-to-end, not just renders.

### Run these checks:

**3.1 Learning Modules:**
- [ ] ALL 11 modules have ALL their sub-sections populated with content from `Rupaiya_101_Complete_Guide.md`.
- [ ] No empty modules, no "Lorem ipsum", no placeholder text.
- [ ] Module completion tracking works — percentage updates on section completion.
- [ ] "Next" and "Previous" navigation between sub-sections works.
- [ ] Strategy slides appear at end of Modules 2, 3, and 5 only.

**3.2 The 8 Mapped Strategies (Full Flow Test):**
For EACH of these strategies, test the COMPLETE flow:

| Strategy | Full Flow Test |
|----------|---------------|
| Paise Ka GPS | Questions load → Answers move car → Score shown → Coins awarded |
| Budget Khel | Cards load → Swipe works → Pie chart shown → Coins awarded |
| Ghar Ka Budget | Sliders work → Room updates → Health meter works → Coins awarded |
| Mistake Market | Stalls render → Click opens modal → Pledge button works → Badge earned |
| Kya Hota Agar | Scenarios selectable → Slider updates both panels → Numbers animate → Coins awarded |
| Chhupa Hua Chor | Amount input works → Year slider → Monster grows → Money shrinks → Coins awarded |
| Compounding Tree | SIP slider → Tree grows → Milestones fire → Leaf particles → Coins awarded |
| Debt Trap Darwaza | 7 doors render → Click opens door animation → Content shows → Badge earned |

**3.3 The 3 Standalone Strategies:**
- [ ] Report Card: Generates grades from user progress → Stamp animation → Share button works.
- [ ] Dictionary: Bubbles float → Tap expands → Quiz works → Search works.
- [ ] Ek Din Ka Kharcha: Timeline progresses → Choices work → Wallet updates → End summary shows.

**3.4 The 16 Tools (from Part 1):**
- [ ] Dashboard: Stats load, greeting shows, quick access works.
- [ ] Goals: Add/edit/delete goals, progress ring updates.
- [ ] Financial Checkup: Quiz flow works, result screen shows.
- [ ] Expense Tracker: Add expense works, charts update.
- [ ] Bachat Ki Challenge: Challenge cards render, check-in works, streak counts.
- [ ] Quiz Arena: Categories load, quiz flow works, scoring works.
- [ ] Fortune Ka Daur: Wheel spins, prize awarded, daily limit enforced.
- [ ] Memory Match: Cards flip, matches detected, timer works.
- [ ] Word Scramble: Letters draggable, correct word detected, hint works.
- [ ] Financial Insights: Cards load, swipe works, bookmark works.
- [ ] Priority Calculator: Drag to reorder works, budget bar updates.
- [ ] Investment Comparison: Cards render, comparison mode works.
- [ ] Emergency Fund: Calculator works, shield fills, motivational text shows.
- [ ] Habit Tracker: Habits checkable, streak tracks, heatmap renders.
- [ ] Financial Age: Quiz works, reveal animation plays, shareable card generates.
- [ ] SIP Calculator: Sliders work, mountain grows, milestones fire.

**3.5 Badges System:**
- [ ] Badges are awarded at correct trigger points.
- [ ] Earning animation plays.
- [ ] Badge wall displays all earned badges.
- [ ] Unearned badges show requirements.
- [ ] Coins are awarded with badges.

**3.6 User Profile:**
- [ ] Form saves and persists.
- [ ] Avatar selection works.
- [ ] Level and XP display correctly.
- [ ] Progress timeline renders.
- [ ] Activity feed shows recent actions.

**After fixing all feature bugs:** Run `npm run build` and confirm ZERO errors.

---

## CRON JOB 4: AI INTEGRATION REVIEW 🤖

**Focus:** AI chatbot works correctly with context awareness across ALL pages.

### Run these checks:

**4.1 AI Chat Component:**
- [ ] AI FAB button (🤖) appears on EVERY page.
- [ ] Chat slide-over opens/closes smoothly (spring animation).
- [ ] Glassmorphic design with animated purple gradient border.
- [ ] Message bubbles render correctly (AI = purple, User = emerald).
- [ ] Typing indicator animation works.
- [ ] Suggested question chips appear and are tappable.
- [ ] Input field works, send button works.

**4.2 Context Awareness:**
- [ ] Opening AI from Dashboard → Greeting: "Kya haal hai, {Name}!"
- [ ] Opening AI from any Strategy → Greeting includes strategy name.
- [ ] Opening AI from any Tool → Greeting includes tool name.
- [ ] Opening AI from any Module → Greeting includes module name.
- [ ] Context badge shows correctly: "📚 Module 3 context active"

**4.3 AI Responses:**
- [ ] AI responds in Hinglish (not English-only).
- [ ] Responses are contextually relevant (not generic).
- [ ] Quick action buttons appear below responses.
- [ ] If no API key: Hardcoded smart responses work as fallback.
- [ ] No crashes or blank responses.

**4.4 AI API Route:**
- [ ] `/api/chat` route exists and responds.
- [ ] Accepts `{ message, context }` payload.
- [ ] Returns `{ reply, suggestions }` format.
- [ ] Error handling works — shows friendly error in chat, not crash.

**After fixing all AI bugs:** Run `npm run build` and confirm ZERO errors.

---

## CRON JOB 5: OVERALL FINAL SWEEP 🔍

**Focus:** Everything together — one final comprehensive pass.

### Run these checks:

**5.1 TypeScript & Build:**
```bash
npm run build
```
- [ ] ZERO TypeScript errors.
- [ ] ZERO "Module not found" errors.
- [ ] ZERO "Cannot find name" errors.
- [ ] All `// @ts-ignore` and `// @ts-nocheck` are REMOVED and actual fixes applied.
- [ ] All ESLint warnings addressed.

**5.2 Console Errors:**
```bash
npm run dev
```
- [ ] Open browser DevTools → Console tab.
- [ ] ZERO console errors on any page.
- [ ] ZERO "hydration mismatch" warnings.
- [ ] ZERO "missing key" warnings in lists.
- [ ] Remove all `console.log` statements from production code.

**5.3 Performance:**
- [ ] Pages load within 2 seconds.
- [ ] No unnecessary re-renders.
- [ ] Heavy components are lazy-loaded.
- [ ] Images use `next/image` with proper sizing.
- [ ] Fonts are preloaded.

**5.4 Cross-Feature Integration:**
- [ ] Completing a module → Awards coins → Awards badge → Updates profile → Updates learning path → Shows in activity feed.
- [ ] Completing a strategy → Awards coins → Awards badge → Strategy shows as "completed" in module → AI context updates.
- [ ] Adding an expense → Reflects in dashboard stats → AI can reference it.
- [ ] Earning enough XP → Level up animation fires → New level reflected in profile.
- [ ] Streak system → Daily login detection → Streak badge awarded at milestones → Fire animation intensifies.

**5.5 Final User Flow Test:**
Walk through the ENTIRE app as a new user:
1. Land on intro page → Click "Start" → Dashboard loads.
2. Fill profile → See level 1 assignment.
3. Open Learning Path → See game map → Module 1 unlocked.
4. Enter Module 1 → Read content → Complete all sub-sections.
5. Get "Pehli Seedi" badge → Coins awarded.
6. Module 2 unlocks → Enter → Read content → Strategy slides appear at end.
7. Open a strategy → Onboarding popup → Play strategy → Complete → Coins + badge.
8. Open AI chat from strategy → Get contextual help.
9. Go to Tools → Try Expense Tracker, Quiz Arena, SIP Calculator.
10. Check Profile → See progress, badges, activity feed, level.
11. Check Badge Wall → See earned and unearned badges.
12. Verify everything works on mobile (375px viewport).

---

## AFTER ALL 5 CRON JOBS ARE COMPLETE:

Run one FINAL build:
```bash
npm run build && npm run dev
```

Open every page one more time. If ZERO bugs remain → The app is **PRODUCTION READY** and **HACKATHON READY**.

Report back with:
- Total bugs found across all cron jobs.
- Total bugs fixed.
- Current build status (PASS/FAIL).
- Any remaining known issues (should be ZERO).

**Yeh sab hone ke baad hi mujhe batana — "App ready hai, bhai!" 🚀🏆**
