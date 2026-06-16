// ============================================================
// RUPAIYA 101 — Type Definitions
// ============================================================

// ---- Module Types ----

export interface Subtopic {
  id: string;
  title: string;
  content: string; // short HTML snippet with real Indian financial examples
  hasQuiz: boolean;
}

export interface Misconception {
  myth: string;
  truth: string;
}

export interface Module {
  id: number;
  title: string; // Hinglish title
  titleEn: string;
  icon: string;
  color: string;
  description: string; // Hinglish, 1-2 lines
  subtopics: Subtopic[];
  mistakes: string[];
  keyTakeaways: string[];
  misconceptions: Misconception[];
}

// ---- Strategy Types ----

export type StrategyPriority = 'highest' | 'high' | 'medium' | 'low';

export interface Strategy {
  id: number;
  title: string; // Hinglish
  titleEn: string;
  description: string; // Hinglish
  icon: string;
  color: string;
  priority: StrategyPriority;
  componentName: string;
}

// ---- Term / Dictionary Types ----

export type TermCategory = 'investing' | 'banking' | 'tax' | 'insurance' | 'debt' | 'saving';

export interface Term {
  id: string; // slug
  term: string; // display name
  definition: string; // 2-3 sentences in Hinglish
  example: string; // real Indian example with Rs. amounts
  category: TermCategory;
  relatedModule: number; // 1-11
  mastered: boolean; // default false
}

// ---- Expense Card Types ----

export type ExpenseAnswer = 'need' | 'want';
export type ExpenseDifficulty = 'easy' | 'medium' | 'hard';
export type ExpenseCategory = 'food' | 'tech' | 'entertainment' | 'health' | 'education' | 'transport' | 'clothing' | 'subscription' | 'self-care' | 'social' | 'home' | 'fitness';

export interface ExpenseCard {
  id: number;
  item: string;
  amount: string; // formatted like '₹79,900' or '₹2,500/mahine'
  correctAnswer: ExpenseAnswer;
  explanation: string; // Hinglish reasoning
  category: ExpenseCategory;
  difficulty: ExpenseDifficulty;
}

// ---- Scenario / Consequence Simulator Types ----

export interface PathData {
  year1: string;
  year5: string;
  year10: string;
  year20: string;
}

export interface Variable {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface Scenario {
  id: string;
  title: string; // Hinglish
  badPath: PathData;
  goodPath: PathData;
  variables: Variable[];
}

// ---- Budget Template Types ----

export type BudgetType = 'need' | 'want' | 'saving';
export type RoomArea = 'bed' | 'kitchen' | 'desk' | 'phone' | 'door' | 'window' | undefined;

export interface BudgetCategory {
  name: string;
  icon: string;
  amount: number;
  type: BudgetType;
  roomArea?: RoomArea;
}

export interface BudgetTemplate {
  id: number;
  title: string; // Hinglish
  income: number;
  description: string; // Hinglish
  categories: BudgetCategory[];
}

// ---- Mistake Types ----

export interface Mistake {
  id: string;
  title: string;
  costCalculation: string; // Hinglish with Rs. amounts
  explanation: string; // Hinglish
  solution: string; // Hinglish
  relatedModule: number;
}

export interface MistakeCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  mistakes: Mistake[];
}

// ---- Daily Choice Types ----

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ChoiceOption {
  label: string;
  cost: number;
  consequence: string; // Hinglish
  emoji: string;
}

export interface DayChoice {
  id: number;
  time: string; // e.g. "7:00 AM"
  period: TimePeriod;
  scenario: string; // Hinglish
  optionA: ChoiceOption; // cheap
  optionB: ChoiceOption; // expensive
}

// ---- Quiz Types ----

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  moduleId: number;
  question: string; // Hinglish
  options: string[]; // 4 options
  correctIndex: number; // 0-3
  explanation: string; // Hinglish
  difficulty: QuizDifficulty;
}
