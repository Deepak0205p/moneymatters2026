import { SwipeCard, TopicSection } from './types';

export const module10Topics: TopicSection[] = [
  {
    id: "10-1",
    title: "Tax Basics — Sarkar Ka Chanda 💸",
    emoji: "💸",
    color: "#10B981",
    description: "Tax boring ho sakta hai, par use samajhna apke hazaron rupaye bacha sakta hai. Samjho Tax ka asli game!",
    cards: [
      {
        id: "10-1-1",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Old vs New Regime: Kaunsa Best? 🏛️",
        content: `Sarkar ne do raste diye hain tax bharne ke. Tumhe kaunsa suit karega?

| Feature | Old Regime | New Regime |
| :--- | :--- | :--- |
| **Tax Rates** | High 📈 | Low 📉 |
| **Deductions** | 80C, HRA, etc ✅ | No Deductions ❌ |
| **87A Rebate** | Up to ₹5 Lakh | Up to ₹7 Lakh |

**Rule**: Agar tum SIP (ELSS) ya PPF mein invest karte ho, toh **Old Regime** usually better hai!`,
        imagePrompt: "Two roads diverging with signs 'Old Regime' and 'New Regime', green landscape, professional financial infographic style",
        color: "#10B981",
        emoji: "📊",
        interactiveType: 'none'
      },
      {
        id: "10-1-2",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Tax Calculator: Kitna Katega? 🧮",
        content: `Bhai, agar tumhari saal ki income \`₹7 Lakh\` se kam hai (New Regime), toh tumhara tax **ZERO** hai!

Chalo dekhte hain tumhari expected salary pe kitna tax banega:`,
        imagePrompt: "Calculator with a happy emoji on screen, green background, Rupee symbols floating around, modern 3D illustration",
        color: "#10B981",
        emoji: "🧮",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'tax',
          formula: 'none',
          inputs: [
            { label: 'Annual Income', min: 200000, max: 2000000, defaultValue: 600000, step: 50000, unit: '₹' }
          ]
        }
      },
      {
        id: "10-1-3",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: ITR Kyun Bharein? 📱",
        content: `Priya aur Bhaiya discuss kar rahe hain ITR (Income Tax Return) filing.`,
        imagePrompt: "Two people looking at a laptop screen with a government seal, green and gold theme, official yet friendly atmosphere",
        color: "#10B981",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, meri income toh ₹3 lakh hi hai, tax zero hai. Phir bhi ITR bharun?**
        
Bhaiya: **Bilkul! ITR sirf tax ke liye nahi, 'Income Proof' ke liye hai. Loan ya Visa chahiye ho toh bank ITR hi maangta hai.**
        
Priya: **Oh! Aur agar bank ne TDS kaat liya toh?**
        
Bhaiya: **ITR bharo aur woh TDS wapas lo! Refund seedha tumhare account mein aayega.**`
      },
      {
        id: "10-1-4",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Tax Savings 🕵️‍♂️",
        content: `Log sochte hain ki tax bachaana sirf 'Rich' logon ka kaam hai.`,
        imagePrompt: "Person hiding coins behind a shield labeled '80C', green background, conceptual financial illustration",
        color: "#10B981",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Students ko tax planning ki koi zaroorat nahi hoti.",
          options: ["Sahi hai, salary aane do pehle!", "Galat, abhi se seekho!"],
          correctAnswerIndex: 1,
          explanation: "Tax planning ek habit hai. Agar tum abhi se Section 80C (SIP/PPF) aur 80E (Education Loan Interest) samajh lo, toh job lagte hi pehle din se hazaron bacha paoge!"
        }
      },
      {
        id: "10-1-5",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: Deduction ya Low Rate? 🤔",
        content: `Tumhari job lag gayi hai, salary \`₹8 Lakh\` hai. Tumhare paas do options hain. Kya chunoge?`,
        imagePrompt: "Person weighing a small piggy bank vs a percentage symbol, green and white colors, decision making concept",
        color: "#10B981",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Salary ₹8 Lakh. Kaunsa rasta loge?",
          choices: [
            {
              text: "New Regime (Low rate, no investment)",
              isCorrect: true,
              consequence: "Simple! Tax kam lagega aur investment ki tension nahi. Par wealth build nahi hogi."
            },
            {
              text: "Old Regime (Invest ₹1.5L in ELSS)",
              isCorrect: true,
              consequence: "Smart! Tax toh utna hi lagega, par tumne ₹1.5 Lakh ki savings bhi kar li jo long term mein grow hogi. Double win!"
            }
          ]
        }
      },
      {
        id: "10-1-6",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: PAN Check",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, Tax ki duniya mein entry ke liye 'PAN Card' must hai.

[ ] Check karo ki kya tumhare paas asli PAN Card hai?
[ ] Agar nahi hai, toh NSDL website pe jaakar apply karo (approx ₹100 lagte hain).
[ ] Agar hai, toh dekho ki kya woh Aadhaar se linked hai?
[ ] 'Income Tax Portal' pe register karke login karke dekho.`,
        imagePrompt: "Close up of a PAN card with a magnifying glass over the name, green checkmark icon, professional and secure vibe",
        color: "#10B981",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module10Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module10Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
