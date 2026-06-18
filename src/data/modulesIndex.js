import { module1Topics } from './module1Cards';
import { module2Topics } from './module2Cards';
import { module3Topics } from './module3Cards';
import { module4Topics } from './module4Cards';
import { module5Topics } from './module5Cards';
import { module6Topics } from './module6Cards';
import { module7Topics } from './module7Cards';
import { module8Topics } from './module8Cards';
import { module9Topics } from './module9Cards';
import { module10Topics } from './module10Cards';
import { module11Topics } from './module11Cards';

export const modules = [
  {
    id: 1,
    title: "Paise Ki Basic Samajh",
    emoji: "💵",
    color: "#3B82F6",
    description: "Paisa sirf paper nahi, ek concept hai. Income, expense, saving, budget — yeh basic pillars jinke bina financial life stabilize nahi hoti.",
    topics: module1Topics
  },
  {
    id: 2,
    title: "Tax Basics for Students",
    emoji: "💸",
    color: "#10B981",
    description: "Income Tax, Form 16, ITR filing basics. Student tax write-offs, TDS rules, and Old vs New tax regimes simplified.",
    topics: module10Topics
  },
  {
    id: 3,
    title: "Saving Strategies",
    emoji: "🏦",
    color: "#8B5CF6",
    description: "Compounding ka power aur savings rate calculations. Student savings hacks, inflation ka asar aur saving barriers to break.",
    topics: module3Topics
  },
  {
    id: 4,
    title: "Emergency Fund",
    emoji: "🛡️",
    color: "#EF4444",
    description: "Aapka financial safety shield. 3/6/9 months rules, real-life savings stories, aur emergency fund deploy karne ki boundaries.",
    topics: module4Topics
  },
  {
    id: 5,
    title: "Banking Basics",
    emoji: "🏛️",
    color: "#06B6D4",
    description: "Accounts aur cards ke types, Fixed vs Recurring deposits, online banking rules, bank fees audit aur KYC safety rules.",
    topics: module6Topics
  },
  {
    id: 6,
    title: "Debt Aur Credit",
    emoji: "💳",
    color: "#F59E0B",
    description: "Good debt vs Bad debt ka farq. Credit score/CIBIL guide, student loan tips, EMI traps aur debt trap se nikalne ki strategies.",
    topics: module5Topics
  },
  {
    id: 7,
    title: "Investment Basics",
    emoji: "📈",
    color: "#EC4899",
    description: "SIP aur mutual funds complete framework. Stock market, Gold, Crypto basics, asset allocation rules, aur initial tax tips.",
    topics: module7Topics
  },
  {
    id: 8,
    title: "Financial Independence",
    emoji: "🎯",
    color: "#F59E0B",
    description: "8 levels of financial freedom. FIRE movement, passive income ideas for students, compounding magic, and key book summaries.",
    topics: module8Topics
  },
  {
    id: 9,
    title: "Insurance Basics",
    emoji: "☂️",
    color: "#3B82F6",
    description: "Risk management aur transfer concept. Health, Term life, aur vehicle insurance rules aur 10 common purchase mistakes.",
    topics: module9Topics
  },
  {
    id: 10,
    title: "Budgeting In Real Life",
    emoji: "📋",
    color: "#10B981",
    description: "Student budget template se lekar expense tracking rules aur joint family dynamics mein budget handling ki practical guide.",
    topics: module2Topics
  },
  {
    id: 11,
    title: "Real-World Scenarios",
    emoji: "🧠",
    color: "#8B5CF6",
    description: "Student finance checklist, case studies, handling unexpected events, student scams, and relationship finance red flags.",
    topics: module11Topics
  }
];

// Helper functions for dynamic multi-module retrieval
export function getModuleById(id) {
  return modules.find(m => m.id === id);
}

export function getAllCardsForModule(moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) return [];
  return mod.topics.flatMap(topic => topic.cards);
}

export function getTopicById(moduleId, topicId) {
  const mod = getModuleById(moduleId);
  if (!mod) return undefined;
  return mod.topics.find(t => t.id === topicId);
}
