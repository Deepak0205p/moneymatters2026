# Task 6: ConsequenceSim.tsx — Strategy 3: "Kya Hota Agar" Consequence Simulator

## Summary
Created `/home/z/my-project/src/components/strategies/ConsequenceSim.tsx` — a 622-line interactive consequence simulator component. This is the "KILLER FEATURE" that demonstrates the dramatic financial impact of investing vs. not investing over time.

## What was built

### Core Features
1. **Profile Selector** — 3 preset user profiles (Riya 20, Amit 22, Sneha 25) with different income levels, colors, and descriptions
2. **Dual Timeline AreaChart** — Red (bad path: "Agar aise hi chala") vs Green (good path: "Agar smart bane") using Recharts AreaChart with gradient fills
3. **Fast Forward Buttons** — 1 Saal, 5 Saal, 10 Saal, 20 Saal with gold active state
4. **Difference Cards** — Shows "5 saal mein farak", "10 saal mein farak", "20 saal mein farak" with real-time calculations
5. **Key Stats Row** — Using shared StatCard component: Total Invested, Final Corpus, Compounding Gain, Your Age Then
6. **Scenario Story Cards** — Split screen showing narrative text from scenarios-data.ts for both paths
7. **Variable Sliders** — Monthly SIP (₹100-₹10,000), Start Age (18-35), Expected Return (8%-15%) — all using shared SliderControl
8. **AHA Moment Banner** — Dynamic text showing the shocking difference with calculated values
9. **SIP Formula Explanation** — Shows the formula with current values

### Technical Details
- Uses `calculateSIP` from `@/lib/utils` for accurate SIP future value calculations
- Formula: P × [(1+r)^n - 1] / r × (1+r)
- Chart data generated at year milestones: 1, 2, 3, 5, 10, 15, 20, 25, 30
- Bad path calculated with inflation erosion (6%) and debt accumulation modeling
- Custom Recharts tooltip with Indian number formatting and difference display
- Framer Motion animations for profile switching, fast forward transitions, and card reveals
- Coin reward (+2) when using fast forward buttons

### Dependencies Used
- recharts (AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer)
- framer-motion (motion, AnimatePresence)
- lucide-react (User, TrendingDown, TrendingUp, FastForward, IndianRupee, Calendar, Percent)
- Shared components: SliderControl, StatCard
- Utils: calculateSIP, formatCurrency, formatIndianNumber, cn
- Store: useAppStore (addCoins)
- Data: scenarios from scenarios-data.ts

### Lint Status
✅ Passes cleanly with no errors
