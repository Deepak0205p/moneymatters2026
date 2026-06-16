# Task 3 - SIP Calculator Component

## Agent: Main Developer
## Task: Create a SIP Calculator tool component for RUPAIYA 101

### Work Completed:

1. **Created `/src/components/shared/SIPCalculator.tsx`** (~300 lines)
   - Full-featured modal/dialog component with dark theme + gold/amber accents
   - Three slider controls: Monthly Investment (₹500-₹1,00,000), Return Rate (1-30%), Years (1-40)
   - Custom SVG donut chart showing invested vs returns split
   - Real-time calculation using existing `calculateSIP` and `formatCurrency` from `@/lib/utils`
   - Results summary: Total Investment, Estimated Returns, Total Value with animated numbers
   - Motivational Hinglish quick fact section
   - AI personalized tip section (fetches from `/api/sip-calculate` endpoint)
   - Rule of 72 quick calculator section
   - Year-by-year breakdown table (collapsible using shadcn Collapsible)
   - Quick presets buttons (₹2K/mo·10yr, ₹5K/mo·15yr, etc.)
   - Indian number formatting (en-IN locale)
   - Responsive design (works on mobile and desktop)
   - Framer Motion animations throughout
   - Proper body scroll lock when dialog open

2. **Created `/src/app/api/sip-calculate/route.ts`**
   - POST endpoint accepting monthlyInvestment, returnRate, years, totalValue, totalInvested, estimatedReturns
   - Uses z-ai-web-dev-sdk LLM to generate personalized Hinglish financial tip
   - System prompt instructs LLM to be a friendly Hinglish financial advisor
   - Fallback tip generation if LLM fails (5 deterministic Hinglish tips)
   - Returns calculation data + AI tip in response

3. **Updated `/src/components/layout/Navbar.tsx`**
   - Added Calculator icon import from lucide-react
   - Added SIPCalculator component import
   - Added `useSIPCalculatorOpen` state hook
   - Added Calculator button between CoinCounter and Trophy button in the navbar
   - Tooltip shows "SIP Calculator" on hover
   - Button opens SIPCalculator dialog on click
   - SIPCalculator rendered alongside BadgeGallery dialog

### Technical Details:
- All new/modified files pass ESLint with zero errors
- Dev server compiles successfully with no errors
- Uses existing utility functions from `@/lib/utils` (calculateSIP, formatCurrency, formatIndianNumber, yearsToDouble)
- Uses shadcn/ui components: Slider, Collapsible, CollapsibleTrigger, CollapsibleContent
- z-ai-web-dev-sdk used ONLY in the API route (backend), not in client-side code
- Follows existing code patterns (BadgeGallery dialog pattern, SliderControl styling)
- 'use client' directive on SIPCalculator component
