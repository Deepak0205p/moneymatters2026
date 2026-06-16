# MASTER PROMPT: Build & Integrate 11 Interactive Strategies into Learning Modules

## IMPORTANT: READ THIS ENTIRE PROMPT BEFORE WRITING ANY CODE. Execute everything yourself without asking for review.

---

## CONTEXT

You are working on "RUPAIYA 101" — a premium FinTech education app built with Next.js (App Router), Tailwind CSS, Framer Motion, and Zustand. The app teaches Indian youth about financial literacy in Hinglish.

The app has **11 Learning Modules** (chapters/courses) and **11 Interactive Strategies** (tools/games). The strategies are NOT separate features — they are **embedded INSIDE specific learning modules** as interactive activities that users encounter WHILE reading/learning. Think of them as "boss fights" or "practice labs" that appear mid-chapter.

---

## DESIGN THEME: "Midnight Wealth + Emerald Growth"

Apply these colors strictly across ALL strategy components:

| Token              | Hex       | Usage                                      |
|--------------------|-----------|---------------------------------------------|
| Background         | `#0B1220` | Main body, modals, overlays                  |
| Card Surface       | `rgba(255,255,255,0.05)` with `backdrop-filter: blur(16px)` | All cards, panels |
| Primary (Emerald)  | `#10B981` | Buttons, progress, positive outcomes         |
| AI Accent (Purple) | `#8B5CF6` | AI features, smart recommendations           |
| Reward (Gold)      | `#F59E0B` | Coins, badges, achievements, streaks         |
| Danger (Red)       | `#EF4444` | Debt, mistakes, wrong choices                |
| Text Primary       | `#F8FAFC` | Headings, main content                       |
| Text Secondary     | `#94A3B8` | Descriptions, labels, hints                  |

Typography: Use `Inter` or `Poppins`. All cards must have glassmorphism styling with smooth `rounded-2xl` corners.

---

## THE 11 LEARNING MODULES (Chapters)

These are the learning paths/chapters users go through sequentially:

```
Module 1:  Foundation (Paise ki Basic Samajh)
Module 2:  Practical (Budgeting in Real Life)
Module 3:  Smart Saving (Saving Strategies)
Module 4:  Emergency Fund (Protection Shield)
Module 5:  Debt aur Credit (Danger Zone)
Module 6:  Banking Basics
Module 7:  Investment Basics
Module 8:  Financial Independence
Module 9:  Insurance Basics
Module 10: Tax Basics for Students
Module 11: Real World Financial Scenarios
```

---

## THE 11 INTERACTIVE STRATEGIES & WHERE THEY GO

Each strategy is embedded inside a specific module. When the user is reading that module's content and reaches a certain point, a glowing "Try It Now" card appears — clicking it opens the interactive strategy as a bottom-sheet, modal, or inline expansion (NOT a separate page).

### STRATEGY-TO-MODULE MAPPING:

| #  | Strategy Name                  | Goes Inside Module        | Appears When User Reads About...        |
|----|-------------------------------|---------------------------|-----------------------------------------|
| 1  | Paise Ka GPS                  | Module 2 (Practical)      | Financial health assessment              |
| 2  | Kya Hota Agar (Consequence)   | Module 3 (Smart Saving)   | Impact of saving vs spending             |
| 3  | Chhupa Hua Chor (Inflation)   | Module 3 (Smart Saving)   | Inflation eating money over time         |
| 4  | Budget Khel (Swipe Game)      | Module 2 (Practical)      | Needs vs Wants categorization            |
| 5  | Ghar Ka Budget (Room Visual)  | Module 2 (Practical)      | Making a household budget                |
| 6  | Debt Trap Ka Darwaza          | Module 5 (Debt & Credit)  | Understanding debt traps                 |
| 7  | Power of Compounding (Tree)   | Module 3 (Smart Saving)   | Compound interest explanation            |
| 8  | Financial Report Card         | Module 2 (Practical)      | After completing budgeting exercises     |
| 9  | Rupaiya Dictionary            | Module 1 (Foundation)     | When finance jargon is introduced        |
| 10 | Ek Din Ka Kharcha (Daily)     | Module 2 (Practical)      | Daily spending habits                    |
| 11 | Mistake Market                | Module 2 (Practical)      | Common financial mistakes                |

---

## DETAILED BUILD INSTRUCTIONS FOR EACH STRATEGY

Build each strategy as a **self-contained React component** inside `/src/components/strategies/`. Each component receives the module context as props and can be triggered via a "Try It Now" button.

---

### STRATEGY 1: Paise Ka GPS (Financial Health Navigator)
**File:** `/src/components/strategies/PaiseKaGPS.tsx`

**CONCEPT:** A visual GPS-style road/path. The user answers 5-7 quick financial health questions. Based on answers, an animated car/marker moves on the road. 
- **RIGHT path** leads to "Financial Freedom City" (green glow, celebration).
- **LEFT path** leads to "Debt Trap Nagar" (red glow, warning signs).

**UI DETAILS:**
- Draw an SVG road that forks into two directions.
- Animated car/dot moves based on answers.
- Each question is a simple A/B choice card (glassmorphic).
- After all answers: show a score with GPS-style "ETA to Financial Freedom: X years".
- Use Emerald Green (`#10B981`) for the right path glow and Red (`#EF4444`) for the wrong path.

**FEATURES:**
- 5-7 hardcoded multiple-choice financial health questions in Hinglish.
- Animated path traversal using Framer Motion.
- Final score card with shareable result.
- Award 20 gold coins on completion.

---

### STRATEGY 2: Kya Hota Agar... (Consequence Simulator)
**File:** `/src/components/strategies/KyaHotaAgar.tsx`

**CONCEPT:** A split-screen "What If" simulator. User gets a scenario (e.g., "You earn ₹30,000/month"). Left side shows "Agar aise hi chala" (no saving, spending freely). Right side shows "Agar smart bane" (saving 20%, investing in SIP). A TIME SLIDER at the bottom lets user drag from Year 1 to Year 10+ and see both outcomes change in real-time.

**UI DETAILS:**
- Split the screen vertically (50/50 on desktop, stacked on mobile).
- Left panel: Red-tinted glassmorphic card showing declining savings, increasing debt.
- Right panel: Green-tinted glassmorphic card showing growing wealth, assets.
- Bottom: A horizontal time slider (Year 1 → Year 20) that updates both panels simultaneously.
- Numbers should animate (count-up effect) as the slider moves.
- Show visual indicators: sad emoji vs happy emoji, declining graph vs growing graph.

**FEATURES:**
- 3 pre-built scenarios user can choose from (Student, Working Professional, Freelancer).
- Real-time calculation as slider moves.
- "Share Your Future" button to screenshot the comparison.
- Award 25 gold coins on exploring all scenarios.

---

### STRATEGY 3: Chhupa Hua Chor (Inflation Monster)
**File:** `/src/components/strategies/ChhupaHuaChor.tsx`

**CONCEPT:** An animated "thief" character (can be a shadowy figure or a monster icon) that visually eats/steals money over time. User enters an amount (e.g., ₹1,00,000). A slider shows years (1-30). As user drags the slider, the monster grows bigger and the money pile shrinks — showing real purchasing power loss.

**UI DETAILS:**
- Center: A large animated money stack (use stacked ₹ icons or a coin pile illustration).
- Left side: A shadowy "Chor" figure that grows in size with each year.
- Bottom: Year slider (1 → 30 years).
- Display: "Your ₹1,00,000 will feel like ₹X in Y years" with animated number.
- The background should get progressively darker/redder as years increase (representing danger).
- At year 20+, show a warning flash: "Inflation ne 70% kha liya!"

**FEATURES:**
- User can input custom amount.
- Inflation rate adjustable (default 6%, slider 4-10%).
- Animated shrinking coin pile.
- Educational tooltip: "Yeh hai Inflation — Chhupa hua chor jo tumhare paise ki value kha jaata hai."
- Award 15 gold coins.

---

### STRATEGY 4: Budget Khel (Tinder-Style Swipe Game)
**File:** `/src/components/strategies/BudgetKhel.tsx`

**CONCEPT:** A Tinder-style swipe card game. User sees expense items one-by-one as cards (e.g., "Monthly Rent ₹8,000", "Netflix Subscription ₹649", "Gym Membership ₹1,500"). User swipes RIGHT for "NEED" and LEFT for "WANT". At the end, show a pie chart of their Needs vs Wants breakdown.

**UI DETAILS:**
- Full-width card stack in the center (like Tinder/Bumble cards).
- Each card shows: Item name, amount, and a relevant emoji/icon.
- Swipe Right = Green flash + "NEED ✓" label.
- Swipe Left = Gold/Amber flash + "WANT 💡" label.
- Use `framer-motion` drag gestures for smooth swipe.
- After all cards: Show a beautiful pie chart (Needs vs Wants vs Savings) with the 50-30-20 rule benchmark comparison.

**FEATURES:**
- 15-20 pre-built expense items in Hinglish.
- Drag/swipe animations with spring physics.
- Summary screen with pie chart and 50-30-20 comparison.
- "Play Again" button to retry.
- Award 20 gold coins.

---

### STRATEGY 5: Ghar Ka Budget (Visual Room Simulator)
**File:** `/src/components/strategies/GharKaBudget.tsx`

**CONCEPT:** An isometric/visual room that changes based on the user's budget allocation. User gets ₹25,000 salary and must allocate it across categories (Rent, Food, Transport, Entertainment, Savings). As they adjust sliders, the ROOM VISUALLY CHANGES:
- High rent = bigger room with nice furniture.
- Low food budget = empty fridge icon.
- High entertainment = TV, gaming console appear.
- Good savings = a safe/piggy bank glows in the corner.

**UI DETAILS:**
- Top section: A stylized room illustration (can be CSS/SVG based, doesn't need to be 3D).
- Bottom section: Category sliders with ₹ amounts (drag to allocate).
- Room items appear/disappear/change based on allocation.
- A "Budget Health" meter on the side (Green = balanced, Red = overspending).
- If savings < 20%, show a warning: "Bhai, future ke liye kuch toh bachao!"

**FEATURES:**
- Interactive sliders for 5-6 budget categories.
- Visual room that updates in real-time.
- Budget health score.
- Tips appear when user over-allocates to one category.
- Award 20 gold coins.

---

### STRATEGY 6: Debt Trap Ka Darwaza (7 Doors of Debt)
**File:** `/src/components/strategies/DebtTrapDarwaza.tsx`

**CONCEPT:** A horror/suspense themed interactive story. User sees 7 doors. Each door represents a debt trap scenario (Credit Card Minimum Payment, Personal Loan for Vacation, Buy Now Pay Later addiction, etc.). User clicks a door → it opens with a creepy animation → reveals the trap inside with numbers showing how much extra they'd pay.

**UI DETAILS:**
- Dark, moody UI (even darker than the regular theme — use `#050a15` background).
- 7 doors arranged in a grid or corridor perspective.
- Each door has a mysterious label (e.g., "EMI Ka Chakkar", "Credit Card Ka Jaal").
- Door opening animation: door swings open, light spills out, reveals content.
- Inside each door: Show the scenario, the math (e.g., "₹50,000 loan at 36% = You pay ₹1,20,000"), and a "Kaise Bacho" (How to Escape) tip.
- After opening all 7 doors: Show a "Debt Trap Survivor" badge.

**FEATURES:**
- 7 pre-built debt trap scenarios with real calculations.
- Spooky door-opening animation (Framer Motion).
- Each door has a danger level indicator (skulls or warning icons).
- Final "Debt Trap Survivor" badge + 30 gold coins.
- A summary of "7 Rules to Never Fall in Debt Trap".

---

### STRATEGY 7: Power of Compounding (Growing Tree)
**File:** `/src/components/strategies/CompoundingTree.tsx`

**CONCEPT:** User "plants a seed" (enters monthly SIP amount). Over time (slider: 1-30 years), a tree grows on screen. The tree starts as a tiny sapling and grows into a massive tree with golden "money leaves". Each leaf shows the compounded amount. Birds and butterflies appear at higher amounts.

**UI DETAILS:**
- Center: An animated SVG/CSS tree that grows taller and wider.
- Leaves appear and multiply as years increase (use green → gold gradient leaves).
- Below tree: Show "You invested: ₹X" vs "You got: ₹Y" with the difference highlighted in gold.
- A gentle particle effect of falling golden leaves at year 20+.
- Input: Monthly SIP amount (₹500 - ₹50,000 slider).
- Input: Time period (1-30 years slider).
- Expected return rate: 12% default (adjustable 8-15%).

**FEATURES:**
- Real compound interest calculation: `FV = P × [((1+r)^n - 1) / r] × (1+r)`.
- Animated tree growth stages (5 stages: Seed → Sapling → Young Tree → Full Tree → Golden Tree).
- Milestone celebrations at ₹1 Lakh, ₹5 Lakh, ₹10 Lakh, ₹1 Crore.
- "Money Doubled" indicator showing Rule of 72.
- Award 25 gold coins.

---

### STRATEGY 8: Financial Health Report Card
**File:** `/src/components/strategies/ReportCard.tsx`

**CONCEPT:** An actual Indian-school-style report card (like the marksheet we all got in school). After completing a module's activities, the user gets grades (A+, A, B, C, D, F) in different "subjects" like Saving, Budgeting, Debt Awareness, etc. Complete with a "Principal's Remark" and a stamp.

**UI DETAILS:**
- Design it exactly like an Indian school report card (bordered table, school header, student info).
- Header: "RUPAIYA 101 — Financial Vidyalaya" with a crest/logo.
- Student Name: User's name.
- Subjects column: Saving Habits, Budget Planning, Debt Awareness, Investment Knowledge, etc.
- Marks column: Calculated from quiz scores and tool usage.
- Grade column: A+, A, B, C, D, F with color coding.
- Bottom: "Principal's Remark" — an AI-generated encouraging or stern one-liner based on performance.
- A red/gold stamp animation ("PASS" or "DISTINCTION") that slams onto the card.

**FEATURES:**
- Auto-calculated from user's progress data (Zustand store).
- Shareable as image (html2canvas or similar).
- Stamp animation on reveal.
- Improvement tips for low-scoring areas.
- Award 15 gold coins.

---

### STRATEGY 9: Rupaiya Dictionary (Floating Bubbles)
**File:** `/src/components/strategies/RupaiyaDictionary.tsx`

**CONCEPT:** Financial terms floating as colorful bubbles on screen. User taps/clicks a bubble → it expands to show the term, its simple Hinglish meaning, a real-life example, and a mini 1-question quiz. User can also search for terms.

**UI DETAILS:**
- Background: Floating animated bubbles of different sizes (use Framer Motion for gentle bobbing).
- Each bubble has a financial term written on it (e.g., "SIP", "EMI", "Inflation", "Mutual Fund").
- Click a bubble → it smoothly expands into a glassmorphic card showing:
  - Term name (large, bold).
  - "Seedhi Baat" (Simple meaning in Hinglish).
  - "Real Life Mein" (A relatable example).
  - A 1-question mini quiz to test understanding.
- A search bar at the top to filter terms.
- Categories: Basic, Intermediate, Advanced (color-coded bubbles).

**FEATURES:**
- 30-40 pre-built financial terms with Hinglish explanations.
- Animated floating bubbles.
- Search and filter functionality.
- Mini quiz per term (1 MCQ).
- User can bookmark terms.
- Award 10 gold coins for every 5 terms explored.

---

### STRATEGY 10: Ek Din Ka Kharcha (Daily Spending Simulator)
**File:** `/src/components/strategies/EkDinKaKharcha.tsx`

**CONCEPT:** A day-in-the-life simulator. User plays as a fictional college student named "Rahul" who has ₹500 for the day. Throughout the day (Morning → Afternoon → Evening → Night), choices appear. Each choice has a cost. User must survive the day without going broke.

**UI DETAILS:**
- A timeline/progress bar at top showing time of day (8 AM → 11 PM).
- Each time slot presents 2-3 options as cards:
  - Morning: "Chai from tapri ₹15" vs "Starbucks ₹350"
  - Lunch: "Mess ₹60" vs "Swiggy ₹250"
  - Evening: "Walk in park ₹0" vs "Movie ₹400"
  - etc.
- A wallet indicator showing remaining balance (shrinks with each spend).
- If user runs out of money before night: "Game Over — Rahul is broke! 😅"
- If user survives: "Smart spender! Rahul saved ₹X today! 🎉"

**FEATURES:**
- 8-10 time slots with 2-3 choices each.
- Running wallet balance with animated decrease.
- End-of-day summary: Total spent, total saved, spending category breakdown.
- Comparison: "Average Indian student spends ₹X, you spent ₹Y".
- Replayable with different choices.
- Award 20 gold coins for surviving the day with savings.

---

### STRATEGY 11: Mistake Market (Virtual Marketplace)
**File:** `/src/components/strategies/MistakeMarket.tsx`

**CONCEPT:** A virtual bazaar/market with different "stalls". Each stall represents a common financial mistake. User walks through the market (horizontal scroll or grid) and clicks on stalls to learn about each mistake, see real data/stats, and take a pledge to avoid it.

**UI DETAILS:**
- A horizontal scrolling marketplace with stall illustrations.
- Each stall has a quirky name and icon:
  - "EMI Trap Ki Dukaan" 🏪
  - "Lifestyle Inflation Lane" 🛍️
  - "No Emergency Fund Corner" 🚨
  - "Credit Card Minimum Payment Shop" 💳
  - "Impulse Buying Bazaar" 🎪
  - "No Insurance Thela" 🛒
  - "YOLO Spending Zone" 🎰
- Click a stall → opens a modal with:
  - The mistake explained in Hinglish.
  - A scary stat (e.g., "73% Indians don't have emergency fund").
  - "Kaise Bacho" (How to avoid) tips.
  - A "Main Nahi Karunga" (I won't do this) pledge button.
- Progress tracker: "You've visited X/7 stalls"

**FEATURES:**
- 7 financial mistake stalls.
- Each stall has unique styling and icon.
- Pledge system (stored in Zustand).
- After visiting all stalls: "Market Expert" badge.
- Award 20 gold coins.

---

## HOW TO INTEGRATE STRATEGIES INTO MODULES

### The "Try It Now" Trigger Component
Create a reusable component `/src/components/shared/TryItNow.tsx`:

```tsx
// This card appears inline while user is reading module content
// It glows and pulses to grab attention

interface TryItNowProps {
  strategyName: string;
  strategyDescription: string;
  icon: React.ReactNode;
  accentColor: string; // hex color for the glow
  onOpen: () => void;
}
```

**Design:** A glassmorphic card with a pulsing border glow, the strategy icon, name, a one-line hook (e.g., "Dekho inflation tumhare paise kaise khata hai!"), and a big "Shuru Karo →" button.

### Opening Strategy
When user clicks "Shuru Karo", the strategy component opens as a **full-screen modal with a slide-up animation** (Framer Motion). It has a close button (X) at top-right and a back-to-reading button.

### Completion & Rewards
When user completes a strategy:
1. Award gold coins (amount specified per strategy above).
2. Show a celebration animation (confetti burst).
3. Mark the strategy as "completed" in Zustand store.
4. When user closes the modal, show a small toast: "Strategy complete! +X coins 🪙"

---

## FOLDER STRUCTURE

```
src/
├── components/
│   ├── strategies/
│   │   ├── PaiseKaGPS.tsx
│   │   ├── KyaHotaAgar.tsx
│   │   ├── ChhupaHuaChor.tsx
│   │   ├── BudgetKhel.tsx
│   │   ├── GharKaBudget.tsx
│   │   ├── DebtTrapDarwaza.tsx
│   │   ├── CompoundingTree.tsx
│   │   ├── ReportCard.tsx
│   │   ├── RupaiyaDictionary.tsx
│   │   ├── EkDinKaKharcha.tsx
│   │   └── MistakeMarket.tsx
│   ├── shared/
│   │   └── TryItNow.tsx
```

---

## EXECUTION COMMAND

Bina reviewer ke tum hi saara code likhke do. Har strategy ka component banao, uska data/content Hinglish mein likho, animations Framer Motion se lagao, aur "Try It Now" trigger cards ko sahi modules mein embed kar do. Mujhe sirf fully working, premium, glitch-free code chahiye. Step-by-step review mat maango — seedha execute karo.
