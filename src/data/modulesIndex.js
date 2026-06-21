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
    title: "Understanding Money Basics",
    emoji: "💵",
    color: "#3B82F6",
    description: "Money is more than just paper — it's a concept. Income, expense, saving, budget — these are the foundational pillars without which your financial life cannot be stable.",
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
    description: "The power of compounding and savings rate calculations. Student savings hacks, the impact of inflation, and how to break savings barriers.",
    topics: module3Topics
  },
  {
    id: 4,
    title: "Emergency Fund",
    emoji: "🛡️",
    color: "#EF4444",
    description: "Your financial safety shield. 3/6/9 months rules, real-life savings stories, and the boundaries for deploying your emergency fund.",
    topics: module4Topics
  },
  {
    id: 5,
    title: "Banking Basics",
    emoji: "🏛️",
    color: "#06B6D4",
    description: "Types of accounts and cards, Fixed vs Recurring deposits, online banking rules, bank fee audits, and KYC safety rules.",
    topics: module6Topics
  },
  {
    id: 6,
    title: "Debt & Credit",
    emoji: "💳",
    color: "#F59E0B",
    description: "The difference between good debt and bad debt. Credit score/CIBIL guide, student loan tips, EMI traps, and strategies to escape the debt trap.",
    topics: module5Topics
  },
  {
    id: 7,
    title: "Investment Basics",
    emoji: "📈",
    color: "#EC4899",
    description: "Complete SIP and mutual funds framework. Stock market, Gold, Crypto basics, asset allocation rules, and initial tax tips.",
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
    description: "Risk management and transfer concepts. Health, Term life, and vehicle insurance rules and the 10 most common purchase mistakes.",
    topics: module9Topics
  },
  {
    id: 10,
    title: "Budgeting In Real Life",
    emoji: "📋",
    color: "#10B981",
    description: "From student budget templates to expense tracking rules and practical guide to budget handling in a joint family.",
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
