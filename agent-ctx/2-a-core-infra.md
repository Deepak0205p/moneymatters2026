# Task 2-a: RUPAIYA 101 - Utility Functions, Store, and Hooks

## Summary
Created all 5 required files for the RUPAIYA 101 financial literacy app's core infrastructure layer.

## Files Created/Modified

### 1. `/home/z/my-project/src/lib/utils.ts` (Modified)
- Preserved existing `cn()` function (clsx + tailwind-merge)
- Added 9 new financial utility functions:
  - `formatCurrency` - Indian currency formatting with Rs. symbol
  - `calculateSIP` - SIP future value calculation
  - `calculateInflation` - Inflation-adjusted value
  - `calculateEMI` - EMI calculation
  - `calculateCompound` - Compound interest
  - `yearsToDouble` - Rule of 72
  - `getGrade` - Grade from percentage
  - `formatIndianNumber` - lakh/crore formatting
  - `calculateDailySavingHabit` - Daily saving habit projection
  - `getFinancialHealthScore` - Health score from module progress

### 2. `/home/z/my-project/src/lib/store/useAppStore.ts` (Created)
- Zustand store with `persist` middleware (localStorage key: `rupaiya-101-storage`)
- State: navigation, progress tracking, gamification (coins, streaks, badges), strategy-specific state
- Actions: strategy/module navigation, module completion with coin rewards, coin management, streak tracking, badge awards, quiz scoring, term mastery

### 3. `/home/z/my-project/src/lib/hooks/useProgress.ts` (Created)
- Derives progress metrics from the Zustand store
- Provides: totalProgress, modulesCompleted, completionPercentage, getModuleProgress, isModuleCompleted, getQuizAverage

### 4. `/home/z/my-project/src/lib/hooks/useCoins.ts` (Created)
- Coin management hook wrapping Zustand store
- Provides: coins, addCoins, spendCoins, earnQuizReward, earnModuleReward, earnStreakReward

### 5. `/home/z/my-project/src/lib/hooks/useLocalStorage.ts` (Created)
- Generic localStorage hook with SSR safety
- Uses lazy useState initializer instead of useEffect to avoid lint error
- Returns [value, setter] tuple with JSON serialization

## Lint Status
All files pass `bun run lint` with no errors.

## Notes
- Fixed `useLocalStorage.ts` to use `useState` lazy initializer instead of `useEffect` + `setState` to comply with `react-hooks/set-state-in-effect` ESLint rule
- Directories created: `src/lib/store/`, `src/lib/hooks/`
