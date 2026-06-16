# MASTER PROMPT: Strategies Integration + 3D Website Overhaul

## IMPORTANT: READ THIS ENTIRE PROMPT BEFORE WRITING ANY CODE. Execute everything yourself without asking for review. Do NOT ask me to approve anything step-by-step.

---

## CONTEXT

You are working on "capital mastery" — a premium FinTech education app built with Next.js (App Router), Tailwind CSS, Framer Motion, and Zustand. The app teaches Indian youth about financial literacy in Hinglish.

The app has **11 Learning Modules** (chapters/courses). Some of these modules have **Interactive Strategies** (tools/games) attached at the END. The strategies are NOT inline — they appear as the **NEXT SWIPE/SLIDE after the module content ends**.

---

## DESIGN THEME: "Midnight Wealth + Emerald Growth"

| Token              | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Background         | `#0B1220` | Main body, modals, overlays                  |
| Card Surface       | `rgba(255,255,255,0.05)` with `backdrop-filter: blur(16px)` | All cards |
| Primary (Emerald)  | `#10B981` | Buttons, progress, positive outcomes         |
| AI Accent (Purple) | `#8B5CF6` | AI features, smart recommendations           |
| Reward (Gold)      | `#F59E0B` | Coins, badges, achievements, streaks         |
| Danger (Red)       | `#EF4444` | Debt, mistakes, wrong choices                |
| Text Primary       | `#F8FAFC` | Headings, main content                       |
| Text Secondary     | `#94A3B8` | Descriptions, labels, hints                  |

---

## PART 1: HOW STRATEGIES APPEAR (NEXT-SWIPE FLOW)

### The Flow:
```
User opens Module → Reads content (scrolls/swipes through lessons)
→ After last lesson slide, the NEXT SWIPE reveals the Strategy Card
→ User taps "Start Strategy" → Onboarding Popup (3-4 steps) appears
→ After onboarding, Strategy opens in FULL PAGE mode
→ User completes strategy → Celebration + Coins → Back to Module list
```

### Implementation Details:

**Step 1: Strategy as the Last Slide**
- Each module that has a strategy should have an extra "slide" or "section" at the very end.
- This slide should NOT look like regular content. It should feel special — a glowing, animated card that says:
  - Strategy icon (large, animated with a subtle float/pulse).
  - Strategy name in bold gradient text.
  - One-line hook (e.g., "Dekho inflation tumhare paise kaise khata hai!").
  - A big glowing CTA button: **"Shuru Karo →"**
- The card should have a `perspective` 3D tilt effect on hover/touch (CSS `transform: perspective(800px) rotateY(5deg) rotateX(3deg)`).
- A subtle particle/sparkle effect around the card to make it feel like a reward/unlock.

**Step 2: Onboarding Popup (3-4 Steps)**
When user clicks "Shuru Karo", a beautiful **multi-step onboarding modal** slides up (Framer Motion `AnimatePresence`). This popup has 3-4 swipeable steps:

```
Step 1: "Yeh Kya Hai?" (What is this?)
   → Icon + Strategy name + 1-line description of the tool.
   → Example: "Budget Khel ek Tinder-style swipe game hai jisme tum items ko Need ya Want mein sort karoge."

Step 2: "Kya Sikhoge?" (What will you learn?)
   → 3 bullet points of what the user will learn.
   → Example: "✅ Need vs Want ka fark samjhoge" / "✅ Apni spending habits jaanoge" / "✅ 50-30-20 rule apply karoge"

Step 3: "Kaise Khelna Hai?" (How to play?)
   → Simple visual instruction (e.g., "Swipe Right = Need, Swipe Left = Want").
   → A small animated demo/gif showing the gesture.

Step 4: "Ready?" (Final step)
   → "🪙 Complete karne pe +20 Gold Coins milenge!"
   → Big button: "LET'S GO! 🚀"
```

**Design of Onboarding Popup:**
- Glassmorphic modal with smooth backdrop blur.
- Dot indicators at bottom showing current step (like app onboarding).
- Swipe or tap to navigate between steps.
- Each step has a fade-in animation.
- The modal should have a subtle 3D depth — like it's floating above the page.

**Step 3: Full Page Strategy View**
After the onboarding popup, the strategy opens as a **FULL PAGE** (not a modal, not a bottom sheet — a complete dedicated page/route). The URL should change (e.g., `/strategy/budget-khel`).

- The full page has ALL the interactive options and features of the strategy.
- A top bar with: Back arrow, Strategy name, Gold coin counter, and a Help (?) button.
- The strategy should use the ENTIRE viewport — immersive experience.
- On completion: Confetti animation + "🎉 Strategy Complete!" card + Gold coins awarded.
- A "Back to Module" button after completion.

---

## PART 2: STRATEGY-TO-MODULE MAPPING

Only these 8 strategies exist. Only these modules have strategies attached:

| #  | Strategy Name                  | Goes After Module         | One-Line Hook                            |
|----|-------------------------------|---------------------------|------------------------------------------|
| 1  | Paise Ka GPS                  | Module 2 (Practical)      | "Dekho tumhari financial car kidhar jaa rahi hai!" |
| 2  | Budget Khel (Swipe Game)      | Module 2 (Practical)      | "Swipe karke batao — Need hai ya Want?" |
| 3  | Ghar Ka Budget (Room Visual)  | Module 2 (Practical)      | "Budget badlo, kamra badlega!" |
| 4  | Mistake Market                | Module 2 (Practical)      | "Bazaar mein chalo, galtiyan pehchano!" |
| 5  | Kya Hota Agar (Consequence)   | Module 3 (Smart Saving)   | "10 saal baad tumhari zindagi kaisi dikhegi?" |
| 6  | Chhupa Hua Chor (Inflation)   | Module 3 (Smart Saving)   | "Dekho inflation tumhare paise kaise khata hai!" |
| 7  | Power of Compounding (Tree)   | Module 3 (Smart Saving)   | "Ek beej lagao, paiso ka ped ugao!" |
| 8  | Debt Trap Ka Darwaza          | Module 5 (Debt & Credit)  | "7 darwaze kholo, karze ka sach jaano!" |

**NOTE:** Module 2 has 4 strategies. They should appear as 4 sequential "bonus slides" after the module content ends. User swipes through them one by one. Module 3 has 3 strategies. Module 5 has 1 strategy. Other modules (1, 4, 6-11) have NO strategies — they end normally.

---

## PART 3: DETAILED BUILD SPECS FOR EACH STRATEGY

Build each strategy as a **full-page React component** inside `/src/components/strategies/`. Each one gets its own route under `/strategy/[slug]`.

---

### STRATEGY 1: Paise Ka GPS (Financial Health Navigator)
**File:** `/src/components/strategies/PaiseKaGPS.tsx`
**Route:** `/strategy/paise-ka-gps`

**CONCEPT:** A visual GPS-style road/path. User answers 5-7 quick financial health questions. Based on answers, an animated car/marker moves on a forking road.
- **RIGHT path** → "Financial Freedom City" (green glow, celebration).
- **LEFT path** → "Debt Trap Nagar" (red glow, warning signs).

**FULL PAGE UI:**
- Top: Progress bar showing question X of Y.
- Center: Large SVG road that forks. Animated car/dot moves based on answers.
- Bottom: Question card with 2 glassmorphic option buttons (A/B).
- Each answer triggers car movement animation + road color change.
- Final screen: GPS-style result — "ETA to Financial Freedom: X years" with a score gauge.
- Use Emerald Green for right path, Red for wrong path.
- Add 3D perspective to the road (`transform: perspective(600px) rotateX(15deg)`).

**FEATURES:**
- 5-7 hardcoded MCQ financial health questions in Hinglish.
- Animated path traversal (Framer Motion).
- Final shareable score card.
- +20 gold coins on completion.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Paise Ka GPS tumhari financial health check karta hai — jaise Google Maps tumhe rasta dikhata hai!"
- Step 2: "✅ Apni financial health jaanoge / ✅ Sahi aur galat raaste ka fark dikhega / ✅ Personalized score milega"
- Step 3: "Har sawaal mein 2 options honge. Jo sahi lage wo choose karo. Car apne aap chalegi!"
- Step 4: "🪙 +20 Gold Coins milenge! Ready?"

---

### STRATEGY 2: Budget Khel (Tinder-Style Swipe Game)
**File:** `/src/components/strategies/BudgetKhel.tsx`
**Route:** `/strategy/budget-khel`

**CONCEPT:** Tinder-style swipe card game. Expense items appear as cards. Swipe RIGHT = "NEED", LEFT = "WANT".

**FULL PAGE UI:**
- Center: Large 3D card stack (with depth/shadow — cards behind are slightly smaller and offset, giving a 3D deck feel).
- Each card: Item name, ₹ amount, emoji/icon, glassmorphic background.
- Swipe Right = Green flash + "NEED ✓" stamp.
- Swipe Left = Gold flash + "WANT 💡" stamp.
- Use `framer-motion` drag with spring physics + rotation on drag.
- Cards should have a 3D flip on swipe (rotateY).
- After all cards: Beautiful animated pie chart (Needs vs Wants vs Savings) with 50-30-20 benchmark.

**FEATURES:**
- 15-20 pre-built expense items in Hinglish.
- Smooth drag/swipe with 3D rotation.
- Summary pie chart + 50-30-20 comparison.
- "Play Again" button.
- +20 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Budget Khel ek Tinder-style game hai — items ko Need ya Want mein sort karo!"
- Step 2: "✅ Need vs Want ka fark samjhoge / ✅ 50-30-20 rule apply karoge / ✅ Apni spending habits jaanoge"
- Step 3: "👉 Right Swipe = Need (Zaroorat) / 👈 Left Swipe = Want (Shauq)"
- Step 4: "🪙 +20 Gold Coins milenge! Ready?"

---

### STRATEGY 3: Ghar Ka Budget (Visual Room Simulator)
**File:** `/src/components/strategies/GharKaBudget.tsx`
**Route:** `/strategy/ghar-ka-budget`

**CONCEPT:** A visual room that changes based on budget allocation. User gets ₹25,000 and allocates across categories. Room items appear/disappear based on allocation.

**FULL PAGE UI:**
- Top half: A stylized isometric/3D-perspective room (`transform: perspective(800px) rotateX(10deg) rotateY(-10deg)`).
- Room items (TV, bed, fridge, AC, piggy bank) appear/disappear/change size based on budget sliders.
- Bottom half: Category sliders (Rent, Food, Transport, Entertainment, Savings) with ₹ amounts.
- Side: "Budget Health" meter — Green = balanced, Yellow = risky, Red = overspending.
- If savings < 20%: Warning popup — "Bhai, future ke liye kuch toh bachao!"
- Items should animate in/out with 3D scale transitions.

**FEATURES:**
- Interactive sliders for 5-6 categories.
- Real-time visual room updates with 3D item animations.
- Budget health score.
- Contextual tips when over-allocating.
- +20 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Ghar Ka Budget mein tum apna kamra sajaaoge — budget ke hisaab se!"
- Step 2: "✅ Budget banana sikhoge / ✅ Priorities set karna samjhoge / ✅ Visual feedback milega"
- Step 3: "Sliders ko drag karke categories mein paisa baanto. Kamra apne aap badlega!"
- Step 4: "🪙 +20 Gold Coins milenge! Ready?"

---

### STRATEGY 4: Mistake Market (Virtual Marketplace)
**File:** `/src/components/strategies/MistakeMarket.tsx`
**Route:** `/strategy/mistake-market`

**CONCEPT:** A virtual bazaar with stalls. Each stall = a common financial mistake. User explores stalls and takes pledges.

**FULL PAGE UI:**
- A horizontally scrolling 3D marketplace (use CSS perspective + translateZ for depth).
- 7 stalls with 3D-tilted signboards:
  - "EMI Trap Ki Dukaan" 🏪
  - "Lifestyle Inflation Lane" 🛍️
  - "No Emergency Fund Corner" 🚨
  - "Credit Card Min Payment Shop" 💳
  - "Impulse Buying Bazaar" 🎪
  - "No Insurance Thela" 🛒
  - "YOLO Spending Zone" 🎰
- Click stall → 3D flip animation → reveals:
  - Mistake explained in Hinglish.
  - Scary stat (e.g., "73% Indians don't have emergency fund").
  - "Kaise Bacho" tips.
  - "Main Nahi Karunga" pledge button (glows green when pledged).
- Progress: "X/7 stalls visited" bar at top.
- After all 7: "Market Expert" badge with 3D badge spin animation.

**FEATURES:**
- 7 stalls with unique styling.
- 3D stall flip/reveal animation.
- Pledge system (Zustand).
- "Market Expert" badge + 20 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Mistake Market ek virtual bazaar hai jahan har dukaan ek financial galti dikhati hai!"
- Step 2: "✅ 7 common money mistakes jaanoge / ✅ Real stats dekhoge / ✅ Pledge loge ki ye galti nahi karoge"
- Step 3: "Stalls pe click karo, padho, aur 'Main Nahi Karunga' pledge lo!"
- Step 4: "🪙 +20 Gold Coins milenge! Ready?"

---

### STRATEGY 5: Kya Hota Agar (Consequence Simulator)
**File:** `/src/components/strategies/KyaHotaAgar.tsx`
**Route:** `/strategy/kya-hota-agar`

**CONCEPT:** Split-screen "What If" simulator. Left = "Agar aise hi chala", Right = "Agar smart bane". A TIME SLIDER (Year 1 → Year 20) updates both sides simultaneously.

**FULL PAGE UI:**
- Split screen (50/50 desktop, stacked mobile).
- Left panel: Red-tinted 3D glassmorphic card — declining savings, growing debt, sad indicators.
- Right panel: Green-tinted 3D glassmorphic card — growing wealth, assets, happy indicators.
- Both panels have animated counters (count-up/down effect).
- Bottom: Horizontal year slider (1 → 20) with smooth drag.
- Both panels update simultaneously as slider moves — numbers, graphs, and emoji indicators change.
- Panels should have subtle 3D perspective tilt (`rotateY(±3deg)`).
- 3 scenario choices at top: Student, Working Professional, Freelancer.

**FEATURES:**
- 3 pre-built scenarios.
- Real-time dual calculation as slider moves.
- Animated counters + visual graphs.
- "Share Your Future" button.
- +25 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Kya Hota Agar tumhe dikhata hai — agar smart saving karo vs nahi karo toh 10-20 saal mein kya hoga!"
- Step 2: "✅ Apne future ka comparison dekhoge / ✅ Smart decisions ka impact samjhoge / ✅ 3 scenarios try kar sakte ho"
- Step 3: "Slider ko drag karo (Year 1 se Year 20). Dono sides apne aap update hongi!"
- Step 4: "🪙 +25 Gold Coins milenge! Ready?"

---

### STRATEGY 6: Chhupa Hua Chor (Inflation Monster)
**File:** `/src/components/strategies/ChhupaHuaChor.tsx`
**Route:** `/strategy/chhupa-hua-chor`

**CONCEPT:** An animated "thief/monster" that eats money over time. User enters amount, drags year slider, watches purchasing power shrink.

**FULL PAGE UI:**
- Center: Large animated 3D money stack (stacked ₹ coins/notes with translateZ depth).
- Left: A shadowy "Chor" monster figure that GROWS bigger with each year (scale animation).
- As years increase, coins disappear one by one from the stack with a "chomp" animation.
- Bottom: Year slider (1 → 30 years).
- Top: Input field for custom amount (default ₹1,00,000).
- Inflation rate slider (default 6%, range 4-10%).
- Display: "Your ₹1,00,000 will feel like ₹{X} in {Y} years" — animated number.
- Background gets progressively darker/redder as years increase.
- At 20+ years: Red warning flash — "Inflation ne 70% kha liya! 😱"
- The monster should have a 3D wobble/breathing animation.

**FEATURES:**
- Custom amount input.
- Adjustable inflation rate.
- Animated shrinking money + growing monster.
- Educational tooltips in Hinglish.
- +15 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Chhupa Hua Chor tumhe dikhata hai ki inflation kaise chup-chap tumhare paise ki value kha jaata hai!"
- Step 2: "✅ Inflation ka real impact dekhoge / ✅ Apni purchasing power samjhoge / ✅ Future planning ka importance jaanoge"
- Step 3: "Amount daalo, slider ghisao, aur dekho chor kaise tumhare paise kha raha hai!"
- Step 4: "🪙 +15 Gold Coins milenge! Ready?"

---

### STRATEGY 7: Power of Compounding (Growing Tree)
**File:** `/src/components/strategies/CompoundingTree.tsx`
**Route:** `/strategy/compounding-tree`

**CONCEPT:** User "plants a seed" (enters SIP amount). A tree grows on screen over time. More investment = bigger tree with golden "money leaves".

**FULL PAGE UI:**
- Center: A large animated SVG/CSS 3D tree that grows through 5 stages:
  - Seed → Sapling → Young Tree → Full Tree → Golden Tree (with money leaves).
- Tree should have 3D depth (trunk with translateZ, leaves at different Z depths).
- Golden particle leaves fall gently at higher years (20+).
- Below tree: Two animated counters side by side:
  - "You Invested: ₹X" (emerald text).
  - "You Got: ₹Y" (gold text, larger font).
  - Difference highlighted: "₹Z ka bonus! 🎉"
- Inputs: Monthly SIP amount slider (₹500 - ₹50,000), Time period slider (1-30 years), Return rate (default 12%, range 8-15%).
- Milestone celebrations at ₹1L, ₹5L, ₹10L, ₹1Cr (confetti + banner).
- "Rule of 72" indicator showing when money doubles.

**FEATURES:**
- Real compound interest formula: `FV = P × [((1+r)^n - 1) / r] × (1+r)`.
- 5-stage animated tree growth.
- Falling golden leaf particles.
- Milestone celebrations.
- +25 gold coins.

**ONBOARDING POPUP CONTENT:**
- Step 1: "Power of Compounding mein tum ek magic ped ugaaoge — jitna invest karoge, utna bada ped hoga!"
- Step 2: "✅ Compound interest ka jadoo dekhoge / ✅ SIP ka power samjhoge / ✅ Rule of 72 sikhoge"
- Step 3: "SIP amount aur years set karo. Ped apne aap badhega aur golden patte aayenge!"
- Step 4: "🪙 +25 Gold Coins milenge! Ready?"

---

### STRATEGY 8: Debt Trap Ka Darwaza (7 Doors of Debt)
**File:** `/src/components/strategies/DebtTrapDarwaza.tsx`
**Route:** `/strategy/debt-trap-darwaza`

**CONCEPT:** Horror/suspense themed. 7 doors in a dark corridor. Each door = a debt trap. Open door → reveals the trap with scary numbers.

**FULL PAGE UI:**
- Ultra-dark background (`#050a15`) with fog/mist particle effect.
- 7 doors in a 3D corridor perspective (doors get smaller towards the back, creating depth).
- Each door has a mysterious glowing label and danger level (skull icons).
- Door categories:
  1. "Credit Card Ka Jaal" (Minimum payment trap)
  2. "EMI Ka Chakkar" (Easy EMI = overspending)
  3. "Buy Now Pay Later" (BNPL addiction)
  4. "Personal Loan for Vacation" (Lifestyle loan)
  5. "Gold Loan Spiral" (Loan on loan)
  6. "Guarantee Dena" (Co-signing trap)
  7. "Payday Lending" (High interest short loans)
- Click door → 3D door-opening animation (rotateY from 0 to -90deg, revealing content behind).
- Light spills out from behind the door.
- Inside: Scenario + math (e.g., "₹50,000 loan at 36% = You pay ₹1,20,000") + "Kaise Bacho" escape tip.
- After all 7 doors: "Debt Trap Survivor" badge with 3D badge spin + celebration.

**FEATURES:**
- 7 debt trap scenarios with real Indian calculations.
- 3D door-opening animation.
- Danger level indicators.
- "Debt Trap Survivor" badge + 30 gold coins.
- Summary: "7 Rules to Never Fall in Debt Trap".

**ONBOARDING POPUP CONTENT:**
- Step 1: "Debt Trap Ka Darwaza ek horror experience hai — 7 darwaazon ke peeche chupe hain karz ke jaal!"
- Step 2: "✅ 7 common debt traps jaanoge / ✅ Real numbers dekhoge kitna extra dena padta hai / ✅ Bachne ke tarike sikhoge"
- Step 3: "Darwaaze pe click karo, andar ka sach dekho, aur escape plan jaano!"
- Step 4: "🪙 +30 Gold Coins milenge! Ready? 😈"

---

## PART 4: 3D WEBSITE OVERHAUL

Apply a premium 3D look to the ENTIRE website (not just strategies). This should make the app feel like a modern, funded startup product.

### Global 3D Effects to Apply:

**1. 3D Card Tilt (All Cards Everywhere):**
```css
/* Apply to ALL cards across the website */
.card-3d {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
}
.card-3d:hover {
  transform: perspective(800px) rotateX(2deg) rotateY(3deg) translateZ(10px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(16, 185, 129, 0.1);
}
```

**2. 3D Depth Layers:**
- Use `translateZ()` to create depth layers across the page.
- Background elements at `translateZ(-50px)` (parallax effect).
- Main content at `translateZ(0)`.
- Interactive elements at `translateZ(20px)` on hover.
- Floating action buttons at `translateZ(40px)`.

**3. 3D Buttons:**
```css
.btn-3d {
  transform: perspective(500px) translateZ(0);
  transition: all 0.2s ease;
  box-shadow: 0 4px 0 #0a8f6a, 0 8px 20px rgba(0,0,0,0.3);
}
.btn-3d:hover {
  transform: perspective(500px) translateZ(5px) translateY(-2px);
  box-shadow: 0 6px 0 #0a8f6a, 0 12px 30px rgba(0,0,0,0.4);
}
.btn-3d:active {
  transform: perspective(500px) translateZ(0) translateY(2px);
  box-shadow: 0 2px 0 #0a8f6a, 0 4px 10px rgba(0,0,0,0.3);
}
```

**4. Parallax Scrolling:**
- Apply subtle parallax to background decorative elements (grid, particles, gradients).
- Main content scrolls normally while background elements scroll at 0.5x speed.
- Use `transform: translate3d(0, calc(var(--scroll) * 0.5), 0)` with a scroll listener.

**5. 3D Sidebar:**
- Sidebar should feel like it has depth — use a subtle `translateZ(10px)` on active items.
- Active sidebar item has a glowing left border + slight 3D pop-out effect.
- Sidebar icons rotate subtly in 3D on hover (`rotateY(15deg)`).

**6. 3D Page Transitions:**
- When navigating between pages/modules, use 3D page flip or slide transitions.
- New page slides in from the right with a slight `rotateY(-5deg)` that settles to `0deg`.
- Old page slides out to the left with `rotateY(5deg)` + fade.

**7. Floating Elements:**
- Dashboard stat cards should gently float (translateY animation + subtle rotateX wobble).
- Gold coin counter in header should have a 3D coin spin animation.
- Achievement badges should have a 3D flip reveal when earned.

**8. 3D Module Cards:**
- Module cards on the learning path should have stacked depth (each card slightly offset in Z).
- On hover: Card lifts up (`translateZ(30px)`) with shadow expanding.
- Locked modules: Appear slightly pushed back (`translateZ(-10px)`) with reduced opacity and blur.

---

## PART 5: FOLDER STRUCTURE

```
src/
├── app/
│   ├── strategy/
│   │   └── [slug]/
│   │       └── page.tsx          ← Dynamic route for each strategy
│   └── ...
├── components/
│   ├── strategies/
│   │   ├── PaiseKaGPS.tsx
│   │   ├── BudgetKhel.tsx
│   │   ├── GharKaBudget.tsx
│   │   ├── MistakeMarket.tsx
│   │   ├── KyaHotaAgar.tsx
│   │   ├── ChhupaHuaChor.tsx
│   │   ├── CompoundingTree.tsx
│   │   └── DebtTrapDarwaza.tsx
│   ├── shared/
│   │   ├── StrategySlide.tsx     ← The "next swipe" card at end of module
│   │   ├── StrategyOnboarding.tsx ← The 3-4 step popup component
│   │   └── StrategyComplete.tsx   ← Completion celebration component
│   └── ui/
│       └── Card3D.tsx            ← Reusable 3D card wrapper
```

---

## EXECUTION COMMAND

Bina reviewer ke tum hi saara code likhke do. Har strategy ka full-page component banao, uska data/content Hinglish mein likho, saari animations Framer Motion + CSS 3D transforms se lagao, onboarding popups banao, aur puri website ko 3D premium look do. Mujhe sirf fully working, glitch-free, hackathon-winning code chahiye. Step-by-step review mat maango — seedha execute karo aur final product do.
