# Task 1-b: RUPAIYA 101 Data Files

## Agent: Data Creator
## Status: COMPLETED

## Summary
Created all 9 data files + 1 types file for the RUPAIYA 101 financial literacy app. All content is in Hinglish with real Indian financial examples and Rs. amounts.

## Files Created

### `/home/z/my-project/src/lib/types/index.ts`
- Complete type definitions for all data structures
- Types: Module, Strategy, Term, ExpenseCard, Scenario, BudgetTemplate, MistakeCategory, DayChoice, QuizQuestion + sub-types

### `/home/z/my-project/src/lib/data/modules.ts`
- 11 learning modules with full Hinglish content
- Each module: id, title, titleEn, icon, color, description, subtopics (3-5 with HTML content), mistakes (2-3), keyTakeaways (5), misconceptions (2-3 with myth/truth)
- Topics: Foundation, Budgeting, Saving, Emergency Fund, Debt, Banking, Investment, Financial Independence, Insurance, Tax, Real-World Scenarios

### `/home/z/my-project/src/lib/data/strategies.ts`
- 12 interactive strategies with priorities and component names
- Priorities: highest (2), high (3), medium (4), low (3)
- Component names mapped for frontend rendering

### `/home/z/my-project/src/lib/data/terms-dictionary.ts`
- 40+ financial terms across 6 categories: investing, banking, tax, insurance, debt, saving
- Each term: id (slug), term, definition (Hinglish), example (with Rs. amounts), category, relatedModule, mastered
- Includes: SIP, CIBIL Score, EMI, FD, RD, PPF, ELSS, Mutual Fund, NPS, Demat, CAGR, Inflation, etc.

### `/home/z/my-project/src/lib/data/expense-cards.ts`
- 30 expense scenarios for Tinder-style swipe game
- Mix: 10 easy, 10 medium, 10 hard
- Categories: food, tech, entertainment, health, education, transport, clothing, subscription, self-care, social, home, fitness

### `/home/z/my-project/src/lib/data/scenarios-data.ts`
- 5 what-if consequence scenarios with adjustable variables
- Scenarios: SIP vs no savings, credit card payment, emergency fund, early investing, aggressive saving
- Each: badPath (year1/5/10/20) + goodPath + variables (sliders)

### `/home/z/my-project/src/lib/data/budget-templates.ts`
- 5 budget templates for income levels: ₹3K, ₹5K, ₹10K, ₹20K, ₹35K
- Each template has categories with: name, icon, amount, type (need/want/saving), roomArea

### `/home/z/my-project/src/lib/data/mistakes-data.ts`
- 5 mistake categories with 3-4 mistakes each (17 total mistakes)
- Categories: EMI Trap, Credit Card Candy, Subscription Sinkhole, Lifestyle Inflation, No Insurance Trap
- Each mistake: id, title, costCalculation, explanation, solution, relatedModule

### `/home/z/my-project/src/lib/data/daily-choices.ts`
- 10 daily spending choices across 4 time periods (morning, afternoon, evening, night)
- Each choice: scenario + optionA (cheap) + optionB (expensive) with costs and consequences

### `/home/z/my-project/src/lib/data/quiz-data.ts`
- 44 quiz questions (4 per module × 11 modules)
- Each question: id, moduleId, question (Hinglish), 4 options, correctIndex, explanation (Hinglish), difficulty
- Mix of easy, medium, hard difficulty levels

## Verification
- `bun run lint` passed with zero errors
- All files properly import types from `@/lib/types`
- All content in Hinglish with Rs. format amounts
