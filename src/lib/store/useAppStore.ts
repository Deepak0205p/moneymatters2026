import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  category: string;
  emoji: string;
  createdAt: string;
}

export interface SavingsDay {
  day: number;
  saved: boolean;
  amount: number;
  date: string;
}

export interface SavingsChallenge {
  isActive: boolean;
  startDate: string;
  dailyGoal: number;
  days: SavingsDay[];
  totalSaved: number;
  longestStreak: number;
}

export interface ExpenseEntry {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: number;
}

export interface HealthCheckupResult {
  score: number;
  category: string;
  answers: Record<string, number>;
  completedAt: string;
  recommendations: string[];
}

interface AppState {
  // Navigation
  activeStrategy: number;
  activeModule: number | null;

  // Progress
  completedModules: number[];
  moduleProgress: Record<number, number>;
  quizScores: Record<string, number>;

  // Gamification
  coins: number;
  streak: number;
  lastLoginDate: string;
  badges: string[];
  userName: string;

  // Strategy-specific state
  swipeScore: number;
  swipeTotal: number;
  debtDoorLevel: number;
  dailySimDay: number;
  masteredTerms: string[];
  dismissedTipDate: string;

  // Finance Advisor chat state
  advisorMessages: AdvisorMessage[];
  advisorSessionCount: number;

  // Goals
  goals: Goal[];

  // Spin Wheel
  lastSpinTime: number;
  totalSpins: number;
  spinWinnings: number;

  // Quiz Arena
  quizArenaHighScores: Record<string, number>;
  quizArenaBestStreak: number;

  // Savings Challenge
  savingsChallenge: SavingsChallenge;

  // Expense Tracker
  expenses: ExpenseEntry[];
  monthlyBudget: number;

  // Health Checkup
  healthCheckup: HealthCheckupResult | null;

  // Memory Match
  memoryMatchBestTimes: Record<string, number>;

  // Word Scramble
  wordScrambleHighScore: Record<string, number>;

  // Module Completion Dates
  moduleCompletionDates: Record<number, string>;

  // Priority Calculator
  priorityCalculatorIncome: number;

  // Financial Age
  financialAge: number;
  financialAgeLastTaken: string;

  // Habit Tracker
  habitTracker: Record<string, string[]>;

  // Actions
  setActiveStrategy: (id: number) => void;
  setActiveModule: (id: number | null) => void;
  completeModule: (id: number) => void;
  updateModuleProgress: (id: number, progress: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  incrementStreak: () => void;
  addBadge: (badgeId: string) => void;
  recordQuizScore: (quizId: string, score: number) => void;
  setUserName: (name: string) => void;
  setSwipeScore: (score: number, total: number) => void;
  setDebtDoorLevel: (level: number) => void;
  setDailySimDay: (day: number) => void;
  toggleTermMastered: (termId: string) => void;
  setDismissedTipDate: (date: string) => void;
  addAdvisorMessage: (message: AdvisorMessage) => void;
  clearAdvisorMessages: () => void;
  addGoal: (goal: Goal) => void;
  updateGoalSaved: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  setLastSpinTime: (time: number) => void;
  incrementTotalSpins: () => void;
  addSpinWinnings: (amount: number) => void;
  setQuizArenaHighScore: (mode: string, score: number) => void;
  setQuizArenaBestStreak: (streak: number) => void;
  // Savings Challenge
  startSavingsChallenge: (dailyGoal: number) => void;
  markSavingsDay: (day: number, amount: number) => void;
  resetSavingsChallenge: () => void;
  // Expense Tracker
  addExpense: (entry: ExpenseEntry) => void;
  deleteExpense: (id: string) => void;
  setMonthlyBudget: (budget: number) => void;
  // Health Checkup
  setHealthCheckup: (result: HealthCheckupResult) => void;
  // Memory Match
  setMemoryMatchBestTime: (mode: string, time: number) => void;
  // Word Scramble
  setWordScrambleHighScore: (mode: string, score: number) => void;
  // Priority Calculator
  setPriorityCalculatorIncome: (income: number) => void;
  // Financial Age
  setFinancialAge: (age: number) => void;
  // Habit Tracker
  toggleHabit: (date: string, habitId: string) => void;
  resetProgress: () => void;
}

const initialState = {
  activeStrategy: 1,
  activeModule: null as number | null,
  completedModules: [] as number[],
  moduleProgress: {} as Record<number, number>,
  quizScores: {} as Record<string, number>,
  coins: 0,
  streak: 0,
  lastLoginDate: '',
  badges: [] as string[],
  userName: '',
  swipeScore: 0,
  swipeTotal: 0,
  debtDoorLevel: 0,
  dailySimDay: 0,
  masteredTerms: [] as string[],
  dismissedTipDate: '',
  advisorMessages: [] as AdvisorMessage[],
  advisorSessionCount: 0,
  goals: [] as Goal[],
  lastSpinTime: 0,
  totalSpins: 0,
  spinWinnings: 0,
  quizArenaHighScores: {} as Record<string, number>,
  quizArenaBestStreak: 0,
  savingsChallenge: {
    isActive: false,
    startDate: '',
    dailyGoal: 0,
    days: [],
    totalSaved: 0,
    longestStreak: 0,
  } as SavingsChallenge,
  expenses: [] as ExpenseEntry[],
  monthlyBudget: 0,
  healthCheckup: null as HealthCheckupResult | null,
  memoryMatchBestTimes: {} as Record<string, number>,
  wordScrambleHighScore: {} as Record<string, number>,
  moduleCompletionDates: {} as Record<number, string>,
  priorityCalculatorIncome: 0,
  financialAge: 0,
  financialAgeLastTaken: '',
  habitTracker: {} as Record<string, string[]>,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveStrategy: (id) => set({ activeStrategy: id }),
      setActiveModule: (id) => set({ activeModule: id }),

      completeModule: (id) =>
        set((state) => {
          const alreadyCompleted = state.completedModules.includes(id);
          const newCompletedModules = alreadyCompleted
            ? state.completedModules
            : [...state.completedModules, id];
          const newModuleCompletionDates = alreadyCompleted
            ? state.moduleCompletionDates
            : { ...state.moduleCompletionDates, [id]: new Date().toISOString().split('T')[0] };
          const newBadges = [...state.badges];
          if (!alreadyCompleted) {
            const count = newCompletedModules.length;
            if (count === 1 && !newBadges.includes('first-module')) newBadges.push('first-module');
            if (count >= 3 && !newBadges.includes('three-modules')) newBadges.push('three-modules');
            if (count >= 6 && !newBadges.includes('six-modules')) newBadges.push('six-modules');
            if (count >= 11 && !newBadges.includes('all-modules')) newBadges.push('all-modules');
          }
          const newCoins = alreadyCompleted ? state.coins : state.coins + 50;
          const updatedBadges = [...newBadges];
          if (newCoins >= 100 && !updatedBadges.includes('coins-100')) updatedBadges.push('coins-100');
          if (newCoins >= 500 && !updatedBadges.includes('coins-500')) updatedBadges.push('coins-500');
          return {
            completedModules: newCompletedModules,
            moduleProgress: { ...state.moduleProgress, [id]: 100 },
            moduleCompletionDates: newModuleCompletionDates,
            coins: newCoins,
            badges: updatedBadges,
          };
        }),

      updateModuleProgress: (id, progress) =>
        set((state) => ({
          moduleProgress: {
            ...state.moduleProgress,
            [id]: Math.min(100, Math.max(state.moduleProgress[id] || 0, progress)),
          },
        })),

      addCoins: (amount) =>
        set((state) => {
          const newCoins = state.coins + amount;
          const newBadges = [...state.badges];
          if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
          if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
          return { coins: newCoins, badges: newBadges };
        }),

      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },

      incrementStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastLoginDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = state.lastLoginDate === yesterday ? state.streak + 1 : 1;
        const newBadges = [...state.badges];
        if (newStreak >= 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');
        if (newStreak >= 7 && !newBadges.includes('streak-7')) newBadges.push('streak-7');
        const newCoins = state.coins + (newStreak * 5);
        if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
        if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
        set({ streak: newStreak, lastLoginDate: today, coins: newCoins, badges: newBadges });
      },

      addBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.includes(badgeId) ? state.badges : [...state.badges, badgeId],
        })),

      recordQuizScore: (quizId, score) =>
        set((state) => {
          const newBadges = [...state.badges];
          if (score === 100 && !newBadges.includes('perfect-quiz')) newBadges.push('perfect-quiz');
          const newCoins = state.coins + Math.floor(score / 10);
          if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
          if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
          return {
            quizScores: { ...state.quizScores, [quizId]: score },
            coins: newCoins,
            badges: newBadges,
          };
        }),

      setUserName: (name) => set({ userName: name }),

      setSwipeScore: (score, total) => set({ swipeScore: score, swipeTotal: total }),

      setDebtDoorLevel: (level) => set({ debtDoorLevel: level }),

      setDailySimDay: (day) => set({ dailySimDay: day }),

      toggleTermMastered: (termId) =>
        set((state) => ({
          masteredTerms: state.masteredTerms.includes(termId)
            ? state.masteredTerms.filter((t) => t !== termId)
            : [...state.masteredTerms, termId],
        })),

      setDismissedTipDate: (date) => set({ dismissedTipDate: date }),

      addAdvisorMessage: (message) =>
        set((state) => ({
          advisorMessages: [...state.advisorMessages, message],
          advisorSessionCount:
            message.role === 'user'
              ? state.advisorSessionCount + 1
              : state.advisorSessionCount,
        })),

      clearAdvisorMessages: () => set({ advisorMessages: [], advisorSessionCount: 0 }),

      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),

      updateGoalSaved: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== id) return g;
            const newSaved = Math.min(g.target, g.saved + amount);
            return { ...g, saved: newSaved };
          }),
        })),

      deleteGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      setLastSpinTime: (time) => set({ lastSpinTime: time }),

      incrementTotalSpins: () => set((state) => ({ totalSpins: state.totalSpins + 1 })),

      addSpinWinnings: (amount) => set((state) => {
        const newSpinWinnings = state.spinWinnings + amount;
        const newCoins = state.coins + amount;
        const newBadges = [...state.badges];
        if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
        if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
        return { spinWinnings: newSpinWinnings, coins: newCoins, badges: newBadges };
      }),

      setQuizArenaHighScore: (mode, score) =>
        set((state) => ({
          quizArenaHighScores: {
            ...state.quizArenaHighScores,
            [mode]: Math.max(state.quizArenaHighScores[mode] || 0, score),
          },
        })),

      setQuizArenaBestStreak: (streak) =>
        set((state) => ({
          quizArenaBestStreak: Math.max(state.quizArenaBestStreak, streak),
        })),

      startSavingsChallenge: (dailyGoal) =>
        set(() => {
          const today = new Date().toISOString().split('T')[0];
          const days: SavingsDay[] = Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            saved: false,
            amount: 0,
            date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          }));
          return {
            savingsChallenge: {
              isActive: true,
              startDate: today,
              dailyGoal,
              days,
              totalSaved: 0,
              longestStreak: 0,
            },
          };
        }),

      markSavingsDay: (day, amount) =>
        set((state) => {
          const days = state.savingsChallenge.days.map((d) =>
            d.day === day ? { ...d, saved: true, amount } : d
          );
          const totalSaved = days.reduce((acc, d) => acc + d.amount, 0);
          let longestStreak = 0;
          let currentStreak = 0;
          days.forEach((d) => {
            if (d.saved) {
              currentStreak++;
              longestStreak = Math.max(longestStreak, currentStreak);
            } else {
              currentStreak = 0;
            }
          });
          const newBadges = [...state.badges];
          if (longestStreak >= 7 && !newBadges.includes('savings-streak-7')) newBadges.push('savings-streak-7');
          if (longestStreak >= 14 && !newBadges.includes('savings-streak-14')) newBadges.push('savings-streak-14');
          if (longestStreak >= 30 && !newBadges.includes('savings-streak-30')) newBadges.push('savings-streak-30');
          const newCoins = state.coins + 5;
          return { savingsChallenge: { ...state.savingsChallenge, days, totalSaved, longestStreak }, badges: newBadges, coins: newCoins };
        }),

      resetSavingsChallenge: () =>
        set(() => ({
          savingsChallenge: {
            isActive: false,
            startDate: '',
            dailyGoal: 0,
            days: [],
            totalSaved: 0,
            longestStreak: 0,
          },
        })),

      addExpense: (entry) =>
        set((state) => ({ expenses: [entry, ...state.expenses] })),

      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

      setHealthCheckup: (result) =>
        set((state) => {
          const newBadges = [...state.badges];
          if (result.score >= 80 && !newBadges.includes('health-guru')) newBadges.push('health-guru');
          if (result.score >= 60 && !newBadges.includes('health-aware')) newBadges.push('health-aware');
          const newCoins = state.coins + 20;
          if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
          if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
          return { healthCheckup: result, badges: newBadges, coins: newCoins };
        }),

      setMemoryMatchBestTime: (mode, time) =>
        set((state) => ({
          memoryMatchBestTimes: {
            ...state.memoryMatchBestTimes,
            [mode]: Math.min(state.memoryMatchBestTimes[mode] ?? Infinity, time),
          },
        })),

      setWordScrambleHighScore: (mode, score) =>
        set((state) => ({
          wordScrambleHighScore: {
            ...state.wordScrambleHighScore,
            [mode]: Math.max(state.wordScrambleHighScore[mode] || 0, score),
          },
        })),

      setPriorityCalculatorIncome: (income) => set({ priorityCalculatorIncome: income }),

      setFinancialAge: (age) => set({
        financialAge: age,
        financialAgeLastTaken: new Date().toISOString().split('T')[0],
      }),

      toggleHabit: (date, habitId) =>
        set((state) => {
          const currentHabits = state.habitTracker[date] || [];
          const isRemoving = currentHabits.includes(habitId);
          const newHabits = isRemoving
            ? currentHabits.filter((id) => id !== habitId)
            : [...currentHabits, habitId];
          const newHabitTracker = { ...state.habitTracker, [date]: newHabits };
          // If removing or not all 6 habits done for today, just update
          if (isRemoving || newHabits.length < 6) {
            return { habitTracker: newHabitTracker };
          }
          // All 6 habits completed for this date - bonus coins
          const newCoins = state.coins + 10;
          const newBadges = [...state.badges];
          if (newCoins >= 100 && !newBadges.includes('coins-100')) newBadges.push('coins-100');
          if (newCoins >= 500 && !newBadges.includes('coins-500')) newBadges.push('coins-500');
          return { habitTracker: newHabitTracker, coins: newCoins, badges: newBadges };
        }),

      resetProgress: () => set(initialState),
    }),
    {
      name: 'rupaiya-101-storage',
    }
  )
);
