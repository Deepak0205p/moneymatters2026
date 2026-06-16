/**
 * Strategy Registry — Maps interactive strategies to learning modules.
 * Each strategy is embedded inside a specific module and triggered via "Try It Now".
 */

export interface StrategyDef {
  id: string;
  name: string;
  description: string;
  iconName: string; // emoji for the TryItNow trigger
  accentColor: string;
  rewardCoins: number;
  moduleId: number; // which module this strategy belongs to
  /** Card index (0-based) after which the TryItNow trigger appears. -1 = last card. */
  triggerAfterCard: number;
}

export const STRATEGY_REGISTRY: StrategyDef[] = [
  // Module 1 (Paise Ki Basic Samajh / Foundation)
  {
    id: 'rupaiya-dictionary',
    name: 'Rupaiya Dictionary',
    description: 'Finance terms floating bubbles mein tap karke seekho!',
    iconName: '📚',
    accentColor: '#3B82F6',
    rewardCoins: 10,
    moduleId: 1,
    triggerAfterCard: 2,
  },
  // Module 3 (Saving Strategies)
  {
    id: 'kya-hota-agar',
    name: 'Kya Hota Agar...',
    description: 'Saving vs spending ka 10-year impact dekho!',
    iconName: '🤔',
    accentColor: '#A855F7',
    rewardCoins: 25,
    moduleId: 3,
    triggerAfterCard: 1,
  },
  {
    id: 'chhupa-hua-chor',
    name: 'Chhupa Hua Chor',
    description: 'Inflation tumhare paise ko kaise khaata hai!',
    iconName: '👀',
    accentColor: '#EF4444',
    rewardCoins: 15,
    moduleId: 3,
    triggerAfterCard: 3,
  },
  {
    id: 'compounding-tree',
    name: 'Power of Compounding',
    description: 'SIP se tree ugaao aur wealth dekho!',
    iconName: '🌳',
    accentColor: '#10B981',
    rewardCoins: 25,
    moduleId: 3,
    triggerAfterCard: 5,
  },
  // Module 6 (Debt Aur Credit)
  {
    id: 'debt-trap-darwaza',
    name: 'Debt Trap Ka Darwaza',
    description: '7 debt traps ke darwaze kholo aur bache!',
    iconName: '🚪',
    accentColor: '#EF4444',
    rewardCoins: 30,
    moduleId: 6,
    triggerAfterCard: 2,
  },
  // Module 10 (Budgeting In Real Life)
  {
    id: 'paise-ka-gps',
    name: 'Paise Ka GPS',
    description: 'Financial health checkup — GPS style!',
    iconName: '🧭',
    accentColor: '#10B981',
    rewardCoins: 20,
    moduleId: 10,
    triggerAfterCard: 1,
  },
  {
    id: 'budget-khel',
    name: 'Budget Khel',
    description: 'Tinder-style swipe — Need ya Want?',
    iconName: '💳',
    accentColor: '#F59E0B',
    rewardCoins: 20,
    moduleId: 10,
    triggerAfterCard: 3,
  },
  {
    id: 'ghar-ka-budget',
    name: 'Ghar Ka Budget',
    description: 'Room visual mein budget allocate karo!',
    iconName: '🏠',
    accentColor: '#06B6D4',
    rewardCoins: 20,
    moduleId: 10,
    triggerAfterCard: 5,
  },
  {
    id: 'ek-din-ka-kharcha',
    name: 'Ek Din Ka Kharcha',
    description: 'Rahul ke din ka kharcha survive karo!',
    iconName: '☀️',
    accentColor: '#F59E0B',
    rewardCoins: 20,
    moduleId: 10,
    triggerAfterCard: 7,
  },
  {
    id: 'mistake-market',
    name: 'Mistake Market',
    description: '7 financial mistakes ke stalls visit karo!',
    iconName: '🎪',
    accentColor: '#EF4444',
    rewardCoins: 20,
    moduleId: 10,
    triggerAfterCard: 9,
  },
  {
    id: 'report-card',
    name: 'Financial Report Card',
    description: 'Apna financial report card dekho!',
    iconName: '📝',
    accentColor: '#10B981',
    rewardCoins: 15,
    moduleId: 10,
    triggerAfterCard: -1, // last card
  },
];

/** Get all strategies for a specific module */
export function getStrategiesForModule(moduleId: number): StrategyDef[] {
  return STRATEGY_REGISTRY.filter((s) => s.moduleId === moduleId);
}

/** Get a strategy by ID */
export function getStrategyById(id: string): StrategyDef | undefined {
  return STRATEGY_REGISTRY.find((s) => s.id === id);
}
