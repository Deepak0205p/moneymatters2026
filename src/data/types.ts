export type InteractiveType = 'quiz' | 'calculator' | 'choice_sim' | 'myth_buster' | 'none';

export interface InteractiveQuiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface InteractiveCalculator {
  calcType: 'budget' | 'compounding' | 'emi' | 'tax' | 'inflation' | 'rule72';
  inputs: { label: string; min: number; max: number; defaultValue: number; step: number; unit?: string }[];
  formula: string; // identified keyword
}

export interface InteractiveChoice {
  scenario: string;
  choices: { text: string; consequence: string; isCorrect: boolean }[];
}

export interface SwipeCard {
  id: string;
  topicId: string;
  topicTitle: string;
  cardIndex: number;
  totalCardsInTopic: number;
  title: string;
  content: string;
  imagePrompt: string;
  image?: string;
  color: string;
  emoji: string;
  interactiveType?: InteractiveType;
  quizData?: InteractiveQuiz;
  calcData?: InteractiveCalculator;
  choiceData?: InteractiveChoice;
}

export interface TopicSection {
  id: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  cards: SwipeCard[];
}

export interface ModuleSection {
  id: number;
  title: string;
  emoji: string;
  color: string;
  description: string;
  topics: TopicSection[];
}
