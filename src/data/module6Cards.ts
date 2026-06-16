import { SwipeCard, TopicSection } from './types';

export const module6Topics: TopicSection[] = [
  {
    id: "6-1",
    title: "Banking Basics — Apka Paisa, Apka Bank 🏦",
    emoji: "🏦",
    color: "#06B6D4",
    description: "Bank account sirf paise rakhne ki jagah nahi, apka financial hub hai. Samjho FD, RD aur account ke raaz!",
    cards: [
      {
        id: "6-1-1",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Account Types: Kiske Liye Kya? 🏛️",
        content: `Har account ka alag maqsad hota hai. Students ke liye best kaunsa hai?

| Account Type | Interest | Best For |
| :--- | :--- | :--- |
| **Savings** | 3-4% 💰 | Daily use, UPI |
| **Student (Zero Bal)**| 3-4% ✨ | No minimum balance tension |
| **Current** | 0% 🏦 | Business, High Transactions |

**Pro Tip**: Hamesha 'Zero-Balance' student account khulwao taaki minimum balance ki penalty na lage!`,
        imagePrompt: "Three different bank building icons representing different account types, cyan and white theme, clean modern illustration, financial hub concept",
        color: "#06B6D4",
        emoji: "🏦",
        interactiveType: 'none'
      },
      {
        id: "6-1-2",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "FD vs RD: Guaranteed Return 📈",
        content: `Safe khelna pasand hai? Bank apko 'Guaranteed' return deta hai:

- **FD (Fixed Deposit)**: Ek saath bada amount (lump sum) rakho.
- **RD (Recurring Deposit)**: Har mahine thoda-thoda save karo.

RD calculator use karke dekho \`₹1,000\` mahine se kitna banega:`,
        imagePrompt: "Clock with coins piling up inside it, cyan and silver colors, stable growth concept, modern 3D illustration",
        color: "#06B6D4",
        emoji: "📈",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'compounding',
          formula: 'none',
          inputs: [
            { label: 'Monthly Deposit (RD)', min: 100, max: 10000, defaultValue: 1000, step: 100, unit: '₹' },
            { label: 'Interest Rate (%)', min: 4, max: 9, defaultValue: 7, step: 0.1, unit: '%' },
            { label: 'Tenure (Years)', min: 1, max: 10, defaultValue: 3, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "6-1-3",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Hidden Charges Se Bacho 🕵️",
        content: `Priya aur Bhaiya discuss kar rahe hain bank ke 'Chupe Kharche'.`,
        imagePrompt: "Person looking at a bank statement with a magnifying glass, hidden fee icons like ghosts, cyan and grey colors, mystery theme",
        color: "#06B6D4",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, mere account se ₹177 kat gaye! Maine toh kuch kharidha hi nahi.**
        
Bhaiya: **Yeh 'Debit Card Annual Fee' ya 'SMS Charges' honge. Bank free nahi hota!**
        
Priya: **Toh kya karun?**
        
Bhaiya: **E-statement switch karo, digital cards use karo, aur faltu ke SMS alerts off karwao. Salana ₹500-₹1,000 bach jayenge!**`
      },
      {
        id: "6-1-4",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Savings Interest 🕵️‍♂️",
        content: `Log sochte hain ki savings account mein paisa rakhna 'Investing' hai.`,
        imagePrompt: "Money sitting idle in a bank vault, cobwebs around it, cyan background, conceptual illustration of stagnant wealth",
        color: "#06B6D4",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Savings account mein 3% interest mil raha hai, matlab mera paisa grow ho raha hai.",
          options: ["Haan, badh toh raha hai!", "Galat, Inflation use kha raha hai!"],
          correctAnswerIndex: 1,
          explanation: "Agar inflation 6% hai aur bank sirf 3% de raha hai, toh real mein apke paise ki value har saal 3% kam ho rahi hai. Savings account sirf 'Liquidity' ke liye hai, wealth building ke liye nahi!"
        }
      },
      {
        id: "6-1-5",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: The 'KYC' Call 📞",
        content: `Tumhe ek call aata hai: *"Sir, apka bank account block hone wala hai. KYC update karne ke liye apna OTP batayein."*

Kya karoge?`,
        imagePrompt: "Person holding a phone, a shadowy figure on the other side with a fishing rod, cyan and red warning tones, scam alert concept",
        color: "#06B6D4",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "OTP maangne wala banker? Asli ya Fake?",
          choices: [
            {
              text: "Urgently OTP bata do.",
              isCorrect: false,
              consequence: "Khatra! Account khali! Bank kabhi bhi phone pe OTP nahi maangta. Yeh ek 'Vishing' (Voice Phishing) scam hai."
            },
            {
              text: "Phone kato aur branch jao.",
              isCorrect: true,
              consequence: "Smart! Hamesha official app ya bank branch jaakar hi KYC update karo. Safe banking, happy life!"
            }
          ]
        }
      },
      {
        id: "6-1-6",
        topicId: "6-1",
        topicTitle: "Banking Basics",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Check Your Charges",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, apne bank ko ₹1 bhi faltu mat do!

[ ] Apni bank app kholo aur last 3 months ka statement dekho.
[ ] 'Charges' ya 'Fee' search karo.
[ ] Dekho kitna SMS fee ya card fee kata hai.
[ ] Agar charges zyada hain, toh customer care ko call karke 'Zero Balance' ya 'Digital Account' mein convert karne ko bolo.`,
        imagePrompt: "Person checking a digital document on a tablet, green checkmarks, cyan theme, organized and focused atmosphere",
        color: "#06B6D4",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module6Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module6Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
