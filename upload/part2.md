# PART 2: Complete Website Overhaul — Professional 3D UI, Bug Fixes, AI Window Upgrade

## IMPORTANT: READ THIS ENTIRE PROMPT BEFORE WRITING ANY CODE. Execute everything yourself without asking for review. Do NOT ask me to approve anything step-by-step.

---

## CONTEXT

You are working on "Capital Mastery" — a premium FinTech education app built with Next.js (App Router), Tailwind CSS, Framer Motion, and Zustand. The current UI has multiple problems:

1. **UI looks flat, boring, and generic** — it doesn't stand out.
2. **Multiple UI bugs** — broken layouts, misaligned elements, inconsistent spacing.
3. **Multiple backend bugs** — API errors, broken state management, missing error handling.
4. **AI Chat Window on Dashboard is basic** — needs a major upgrade.
5. **No 3D depth, no modern animations, no premium feel.**

Your mission: Transform this into a **hackathon-winning, visually stunning, professional 3D website** that makes judges say "WOW" within the first 3 seconds.

---

## STEP 0: RESEARCH PHASE (DO THIS FIRST!)

Before writing any code, you MUST research and draw inspiration from these modern 3D/animated websites and libraries. Study their techniques and apply similar effects to our app:

### 🔍 Websites to Study for 3D & Animation Inspiration:

| Website | What to Learn |
|---------|---------------|
| [linear.app](https://linear.app) | Clean glassmorphism, smooth page transitions, dark theme perfection |
| [stripe.com](https://stripe.com) | 3D gradient meshes, floating card animations, premium feel |
| [vercel.com](https://vercel.com) | Dark theme, glow effects, subtle parallax, grid backgrounds |
| [raycast.com](https://raycast.com) | Command palette UI, glassmorphic overlays, keyboard shortcut badges |
| [clerk.com](https://clerk.com) | Auth UI design, card depth, gradient borders |
| [aceternity.com/components](https://ui.aceternity.com) | 3D card effects, spotlight hover, meteors, sparkles, lamp effects |
| [magicui.design](https://magicui.design) | Animated borders, shimmer buttons, number tickers, orbit animations |
| [hover.dev](https://www.hover.dev) | Hover animations, 3D card tilts, magnetic buttons |
| [animata.design](https://animata.design) | Micro-interactions, text animations, staggered reveals |
| [lurn.com](https://www.lurne.com) | EdTech dark theme, gamification UI, progress visualization |

### 🔍 Animation Libraries to Use:

| Library | Purpose |
|---------|---------|
| `framer-motion` | Page transitions, layout animations, gesture handling, AnimatePresence |
| CSS `perspective` + `transform3d` | 3D card tilts, depth layers, parallax |
| CSS `@property` + `conic-gradient` | Animated gradient borders |
| `canvas-confetti` | Celebration confetti effects |
| CSS `backdrop-filter: blur()` | Glassmorphism everywhere |
| CSS `mix-blend-mode` | Glow effects, light blending |

### 🔍 Specific Effects to Implement (Search for these):

1. **Aceternity UI "3D Card Effect"** — Cards that tilt toward mouse cursor with depth layers inside.
2. **Stripe-style Gradient Mesh** — Animated aurora/gradient blob backgrounds.
3. **Linear-style Page Transitions** — Smooth crossfade with subtle Y-translation.
4. **Spotlight Hover Effect** — A radial light that follows cursor on cards.
5. **Magnetic Button Effect** — Buttons that slightly pull toward cursor on hover.
6. **Text Gradient Animation** — Gradient that slowly shifts across heading text.
7. **Staggered Grid Reveal** — Cards appear one-by-one with delay on page load.
8. **Parallax Scroll Layers** — Background elements move slower than foreground.
9. **Glow Pulse on Active Elements** — Soft emerald/gold pulse on interactive items.
10. **3D Flip Transitions** — Cards/modals flip in 3D when opening/closing.

---

## STEP 1: GLOBAL 3D WEBSITE OVERHAUL

### 1.1 Background System
Replace the flat `#0B1220` background with a living, breathing background:

```css
/* Base background with subtle gradient */
body {
  background: #0B1220;
  background-image: 
    radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 50%);
}

/* Animated grid overlay */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridShift 20s linear infinite;
}

@keyframes gridShift {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}
```

### 1.2 Universal 3D Card System
EVERY card in the entire app must use this 3D card system:

```tsx
// Create: /src/components/ui/Card3D.tsx
// A wrapper component that adds 3D tilt-on-hover to any card

// On mouse move: calculate rotateX and rotateY based on cursor position relative to card center
// On mouse enter: add spotlight radial gradient at cursor position
// On mouse leave: smoothly reset to flat (0,0,0) with spring animation

// CSS Properties:
// transform-style: preserve-3d
// perspective: 1000px
// transition: transform 0.1s ease-out
// Will-change: transform (for GPU acceleration)
```

- Light reflection: A subtle white radial gradient follows the cursor inside the card.
- Shadow: Card shadow shifts opposite to tilt direction.
- Depth layers: Elements inside the card at different `translateZ` values (heading at Z=20, icon at Z=40, button at Z=30).

### 1.3 Navigation & Sidebar 3D Upgrade

**Sidebar:**
- Add depth: sidebar slightly raised (`translateZ(5px)`) from the main content.
- Active item: Glowing left border (emerald) + item pops out (`translateZ(10px)`) + background spotlight.
- Hover: Items slightly scale up (1.02) with a glass highlight sweep across.
- Icons: Subtle 3D rotation on hover (`rotateY(15deg)`).
- Section headers: Small caps with tracking, muted text, thin divider line.
- Collapse animation: Sidebar items stagger-animate when collapsing/expanding.

**Top Bar / Header:**
- Glassmorphic strip: `background: rgba(11,18,32,0.8); backdrop-filter: blur(20px);`
- Sticky with blur: As user scrolls, header gets more opaque.
- Coin counter: Animated 3D coin icon that spins when coins are added.
- User avatar: Ring around it that glows based on streak (no streak = grey, 3 days = amber, 7+ days = emerald).
- Notification bell: Subtle wobble animation when there are unread notifications.

### 1.4 Page Transitions
Every page/route change should have a smooth 3D transition:

```tsx
// Using Framer Motion AnimatePresence + motion.div

// Enter: 
initial={{ opacity: 0, y: 20, rotateX: -2 }}
animate={{ opacity: 1, y: 0, rotateX: 0 }}
transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}

// Exit:
exit={{ opacity: 0, y: -10, scale: 0.98 }}
transition={{ duration: 0.2 }}
```

### 1.5 Typography System
```css
/* Headings: Bold, large, with subtle text shadow */
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: 0 0 30px rgba(16, 185, 129, 0.1);
}

/* Important headings: Animated gradient text */
.heading-gradient {
  background: linear-gradient(135deg, #10B981, #8B5CF6, #F59E0B, #10B981);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 1.6 Button System
All buttons must be upgraded:

**Primary Button (Emerald):**
- 3D depth: `box-shadow: 0 4px 0 #0a8f6a, 0 8px 20px rgba(0,0,0,0.3);`
- Hover: Lifts up 2px, shadow expands, subtle glow.
- Active: Pushes down, shadow shrinks.
- Loading state: Shimmer effect across the button + spinner.

**Ghost Button:**
- Transparent with emerald border.
- Hover: Background fills with `rgba(16,185,129,0.1)` + border glows.
- Magnetic pull: Button slightly moves toward cursor on hover.

**Danger Button:**
- Same 3D depth but with red (`#EF4444`) shadows and glow.

### 1.7 Scrollbar & Selection
```css
/* Custom scrollbar — sleek */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { 
  background: linear-gradient(180deg, #10B981, #8B5CF6); 
  border-radius: 10px; 
}

/* Text selection */
::selection { 
  background: rgba(16, 185, 129, 0.3); 
  color: #F8FAFC; 
}
```

### 1.8 Loading States
- **Skeleton screens** everywhere (not spinners). Glassmorphic skeleton cards with shimmer animation.
- **Page loading:** A thin emerald progress bar at the very top of the page (like YouTube/GitHub).
- **Button loading:** Shimmer sweep effect across the button surface.
- **Data loading:** Skeleton cards with staggered shimmer (card 1 shimmers, then card 2, then card 3...).

### 1.9 Toast / Notification System
- Glassmorphic toast at top-right (or bottom-center on mobile).
- Types: Success (emerald glow), Error (red glow), Info (purple glow), Reward (gold glow + coin icon).
- Slide-in animation from right + auto-dismiss after 3s.
- Reward toasts: "+20 Coins 🪙" with a mini coin rain particle effect.

### 1.10 Empty States
Every screen that can be empty should have a beautiful empty state:
- A large, subtle illustration or emoji.
- Hinglish message: "Abhi kuch nahi hai yahan! 😅 Chalo shuru karte hain?"
- CTA button to start the relevant action.

---

## STEP 2: AI CHAT WINDOW OVERHAUL

The AI Chat Window on the Dashboard is the crown jewel of the app. It must look PREMIUM.

### 2.1 Chat Window Design

**Container:**
- Full glassmorphic panel: `background: rgba(11,18,32,0.9); backdrop-filter: blur(24px); border: 1px solid rgba(139,92,246,0.2);`
- Animated gradient border (conic-gradient rotating around the window using `@property`).
- Header: "🤖 Capital Mastery AI" with a breathing purple dot (online indicator).
- Resizable and draggable (or slide-over from right side).

**Messages:**
- AI messages: Purple-tinted glassmorphic bubble (`rgba(139,92,246,0.1)` bg) + AI avatar icon.
- User messages: Emerald-tinted bubble (`rgba(16,185,129,0.1)` bg) aligned right.
- Message appear animation: Slide up + fade in (staggered if multiple).
- AI typing indicator: 3 animated dots with wave effect (not boring "...").

**Input Area:**
- Large glassmorphic input field at bottom.
- Placeholder: "Kuch bhi poocho financial ke baare mein... 💬"
- Send button: Purple glowing circle with arrow icon.
- Suggested questions above input as tappable chips:
  - "SIP kya hota hai?" / "Tax kaise bachayein?" / "Credit score kya hai?"
- Voice input button (microphone icon) — even if not functional, show it for demo.

**Smart Features:**
- Context awareness badge: When user is in a module, show "📚 Module 3 context active" tag at top.
- Quick actions: Below AI response, show action buttons like "📊 Calculator kholo" / "📖 Aur padho" / "🔄 Phir se samjhao".
- Code/number formatting: Financial numbers should be properly formatted (₹1,00,000 not 100000).
- Markdown rendering: AI responses should render bold, lists, and highlights properly.

### 2.2 Chat Window Animations
- **Open:** Slides in from right (desktop) or bottom (mobile) with spring physics.
- **Close:** Slides out with deceleration.
- **Message appear:** Each message bubble scales from 0.95 to 1 + fades in.
- **AI thinking:** Pulsing purple glow around the chat window border while AI is "thinking".
- **New message indicator:** If chat is minimized, show a bouncing purple badge with unread count.

### 2.3 AI Window Trigger
- A floating AI button (FAB) in bottom-right corner.
- Purple glassmorphic circle with "🤖" or brain icon.
- Breathing glow animation (subtle pulse).
- On hover: Expands slightly + tooltip "AI se poocho!"
- Minimized state: Shows last message preview as a one-liner above the FAB.

---

## STEP 3: FIX ALL UI BUGS

Go through EVERY page and component in the project and fix:

### 3.1 Layout Bugs
- [ ] Check all pages for overflow issues (horizontal scroll on mobile = BIG problem).
- [ ] Fix any elements that overflow their containers.
- [ ] Ensure consistent padding/margin across all pages (use 16px/24px/32px system).
- [ ] Fix any z-index stacking issues (modals behind content, tooltips cut off, etc.).
- [ ] Ensure all glassmorphic cards have proper borders and don't blend into background.

### 3.2 Responsive Bugs
- [ ] Test every page at 375px width (iPhone SE) — nothing should break.
- [ ] Test at 768px (iPad) — proper 2-column layouts where needed.
- [ ] Test at 1440px (desktop) — max-width containers, centered content.
- [ ] Sidebar: Should collapse to hamburger menu on mobile.
- [ ] Bottom nav: Should appear on mobile, hidden on desktop.
- [ ] Charts/graphs: Must resize properly on small screens.
- [ ] Text: No text should be cut off or overflow on any screen size.

### 3.3 Component Bugs
- [ ] All buttons must have hover, active, focus, and disabled states.
- [ ] All inputs must have proper focus rings (emerald outline).
- [ ] All modals must have backdrop blur + close on outside click + Escape key.
- [ ] All loading states must show skeletons, not blank screens.
- [ ] All error states must show user-friendly Hinglish messages, not raw errors.
- [ ] Dark theme consistency: No white flashes, no unstyled elements.

### 3.4 Animation Bugs
- [ ] Remove any janky/stuttering animations (likely caused by animating `width`/`height` instead of `transform`).
- [ ] Ensure all animations use `transform` and `opacity` only (GPU-accelerated properties).
- [ ] Add `will-change: transform` to frequently animated elements.
- [ ] Ensure `AnimatePresence` is wrapping all conditionally rendered animated components.
- [ ] No layout shifts (CLS) when content loads — use fixed dimensions or skeleton placeholders.

---

## STEP 4: FIX ALL BACKEND BUGS

Go through the entire backend/API layer and fix:

### 4.1 State Management (Zustand)
- [ ] Ensure all Zustand stores have proper TypeScript types.
- [ ] Add error handling in every store action.
- [ ] Persist critical data (progress, coins, streaks) using `persist` middleware with localStorage.
- [ ] Ensure no stale state issues — add proper hydration handling for SSR.
- [ ] Clean up any unused state variables.

### 4.2 API Routes
- [ ] All `/api/*` routes must have try-catch error handling.
- [ ] Return proper HTTP status codes (200, 400, 404, 500).
- [ ] All responses must follow consistent JSON format: `{ success: boolean, data?: any, error?: string }`.
- [ ] Add input validation for all API endpoints.
- [ ] Fix any CORS issues.
- [ ] Ensure environment variables are properly accessed (not hardcoded).

### 4.3 Database (Prisma)
- [ ] Check all Prisma queries for potential errors (missing records, null fields).
- [ ] Add proper error handling around all `prisma.*.findUnique()`, `.create()`, `.update()` calls.
- [ ] Ensure database schema matches the app's data requirements.
- [ ] Add seed data for demo/hackathon purposes.

### 4.4 Authentication
- [ ] If auth exists, ensure proper session handling.
- [ ] Protected routes should redirect to login, not show blank screens.
- [ ] User data should persist across sessions.
- [ ] Handle expired tokens gracefully.

### 4.5 General
- [ ] Fix all TypeScript errors and warnings. Remove all `// @ts-ignore` and `// @ts-nocheck`.
- [ ] Fix all ESLint errors and warnings.
- [ ] Remove all `console.log` statements from production code.
- [ ] Ensure proper error boundaries so the app never shows a white screen of death.
- [ ] Add `try-catch` in all async functions.

---

## STEP 5: MICRO-INTERACTIONS & POLISH

These small details separate a "good" app from a "WOW" app:

### 5.1 Hover Effects
- Every interactive element must respond to hover within 100ms.
- Cards: Lift + glow + spotlight.
- Buttons: Scale up (1.02) + shadow expand.
- List items: Background highlight slides in from left.
- Icons: Subtle 3D rotation.
- Links: Color transition + underline animation.

### 5.2 Click/Tap Feedback
- Buttons: Quick scale down (0.97) then back to 1 on click.
- Cards: Slight push-down (translateZ decrease) on click.
- Toggle/checkbox: Satisfying spring animation.
- Navigation items: Instant highlight with smooth transition.

### 5.3 Scroll Animations
- Elements should animate in as user scrolls (staggered fade-up).
- Use Framer Motion `useInView` hook for scroll-triggered animations.
- Dashboard stat cards: Count-up number animation when they scroll into view.
- Module cards: Staggered slide-in from bottom.

### 5.4 Celebration Moments
These moments MUST have over-the-top celebrations:
- Completing a module → Full-screen confetti + "🎉 Module Complete!" banner.
- Earning a badge → 3D badge flip reveal + golden particle burst.
- Reaching a coin milestone → Coin rain animation + "🪙 500 Coins!" popup.
- Daily login streak → Flame animation intensifies with streak count.
- Finishing all modules → Epic celebration with fireworks + "🏆 Master!" title.

### 5.5 Sound Design (Optional but Impressive)
If possible, add subtle UI sounds (toggle-able in settings):
- Button click: Soft "pop".
- Coin earned: Cash register "cha-ching".
- Correct answer: Satisfying "ding".
- Wrong answer: Soft "boop".
- Achievement: Triumphant short jingle.

---

## STEP 6: PERFORMANCE OPTIMIZATION

A premium-looking app that's slow is worse than an ugly fast app:

### 6.1 Code
- [ ] Lazy load all tool/strategy components with `dynamic()` or `React.lazy()`.
- [ ] Implement code splitting per route.
- [ ] Optimize images: Use `next/image` with proper `width`/`height` and `priority` for above-fold.
- [ ] Memoize expensive calculations with `useMemo`.
- [ ] Debounce slider inputs and search fields.
- [ ] Use `React.memo` for components that re-render unnecessarily.

### 6.2 CSS
- [ ] Purge unused CSS classes.
- [ ] Minimize use of `backdrop-filter` on too many overlapping elements (performance heavy).
- [ ] Use CSS `contain: layout paint` on complex card components.
- [ ] Ensure animations use `transform` and `opacity` only.

### 6.3 Loading
- [ ] First Contentful Paint (FCP) under 1.5 seconds.
- [ ] Preload critical fonts (Inter/Poppins).
- [ ] Use skeleton screens so perceived performance is fast.

---

## EXECUTION COMMAND

Bina reviewer ke tum hi saara kaam karo:

1. **Pehle research karo** — upar diye gaye websites (linear.app, stripe.com, aceternity.com, magicui.design, etc.) ko study karo aur unse modern 3D techniques seekho.
2. **Global styles overhaul karo** — `globals.css` aur `tailwind.config.ts` ko completely rewrite karo with 3D system, gradient backgrounds, custom animations.
3. **Har component fix karo** — saare UI bugs dhundho aur fix karo, responsive issues solve karo.
4. **Backend bugs fix karo** — API routes, Zustand stores, Prisma queries — sab mein error handling lagao.
5. **AI Chat Window premium banao** — glassmorphic design, animated borders, smart features.
6. **3D effects lagao** — Card3D component banao, page transitions lagao, parallax implement karo.
7. **Micro-interactions add karo** — hover effects, click feedback, scroll animations, celebrations.
8. **Performance optimize karo** — lazy loading, code splitting, image optimization.

Mujhe sirf final working, glitch-free, hackathon-winning, professionally polished 3D website chahiye. Step-by-step review mat maango — seedha sab execute karo aur final product do.
