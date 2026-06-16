import { SwipeCard, TopicSection } from './types';

export const module4Topics: TopicSection[] = [
  {
    id: "4-1",
    title: "Emergency Fund — Apka Financial Safety Net 🛡️",
    emoji: "🛡️",
    color: "#EF4444",
    description: "Life unpredictable hai, par apka bank balance nahi hona chahiye. Samjho emergency fund ka power!",
    cards: [
      {
        id: "4-1-1",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Dilemma: Emergency Hai Ya Nahi? 🚨",
        content: `Har kharcha 'Emergency' nahi hota, bhai! 

Socho tumhare paas \`₹20,000\` ka emergency fund hai. Achanak yeh situation aati hai... Tum kya karoge?`,
        imagePrompt: "Person looking confused at a broken laptop and a 'Flash Sale' ad on phone, red emergency theme, modern flat illustration, intense atmosphere",
        color: "#EF4444",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "iPhone 16 pe 50% discount mil raha hai, sirf aaj ke liye! Kya emergency fund use karoge?",
          choices: [
            {
              text: "Haan! Aisa mauka baar baar nahi aata.",
              isCorrect: false,
              consequence: "Khatra! Sale emergency nahi hoti. Agar kal asli medical emergency aa gayi toh kya karoge? Fund zero, stress hero!"
            },
            {
              text: "Nahi, fund ko hath nahi lagaunga.",
              isCorrect: true,
              consequence: "Sahi pakde ho! Emergency matlab: Hospital bill, Job loss, ya Urgent repair. Sale ke liye alag se 'Want' budget banao."
            }
          ]
        }
      },
      {
        id: "4-1-2",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "3/6/9 Month Rule: Kitna Chahiye? 💰",
        content: `Sawaal hai: Kitna paisa kafi hai? 

- **3 Months**: Safe (for students).
- **6 Months**: Strong (for freshers).
- **9 Months**: Super Safe (for freelancers).

Apne monthly kharche dalo aur dekho apka **Shield Amount** kitna hona chahiye:`,
        imagePrompt: "Shield made of gold coins protecting a small house, red and silver accents, heroic financial illustration, clean layout",
        color: "#EF4444",
        emoji: "🛡️",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'budget',
          formula: 'none',
          inputs: [
            { label: 'Monthly Expenses', min: 2000, max: 50000, defaultValue: 10000, step: 500, unit: '₹' }
          ]
        }
      },
      {
        id: "4-1-3",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Fund Kahan Rakhein? 🏦",
        content: `Priya aur Bhaiya discuss kar rahe hain fund ki 'Location'.`,
        imagePrompt: "Mobile banking app icon next to a physical safe, digital and physical security theme, red and white colors, modern flat style",
        color: "#EF4444",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, emergency fund ko Equity Mutual Fund mein daal dun? 15% return milega!**
        
Bhaiya: **Bilkul nahi! Agar market crash ho gaya aur tabhi paise chahiye hue toh?**
        
Priya: **Oh, toh kahan rakhun?**
        
Bhaiya: **Aisi jagah jahan se 2 minute mein nikle. Savings Account ya Liquid Fund. Safety > Returns.**`
      },
      {
        id: "4-1-4",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Emergency Fund 🕵️‍♂️",
        content: `Kuch log sochte hain ki insurance hai toh fund ki kya zaroorat?`,
        imagePrompt: "Person juggling multiple balls labeled Insurance, Cash, and Credit, focus and balance theme, red background, modern illustration",
        color: "#EF4444",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Mere paas Health Insurance hai, toh mujhe emergency fund ki zaroorat nahi.",
          options: ["Sahi hai, insurance sab cover karega", "Galat, cash phir bhi chahiye"],
          correctAnswerIndex: 1,
          explanation: "Insurance hospital bill bharta hai, par ambulance, chote kharche, aur hospital ke bahar ke medicines ke liye CASH chahiye hota hai. Dono zaroori hain!"
        }
      },
      {
        id: "4-1-5",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Emergency Fund vs Savings Account",
        content: `Dono mein farq samjho, varna hamesha confuse rahoge:

| Feature | Savings Account | Emergency Fund |
| :--- | :--- | :--- |
| **Purpose** | Daily kharche / Goals | SIRF unexpected crisis 🛡️ |
| **Accessibility** | UPI / Debit Card 💳 | Alag account (No UPI) 🔒 |
| **Withdrawal** | Kabhi bhi (Pizza 🍕) | Sirf 'Asli' Problem mein |

**Rule**: Emergency fund ko 'Invisible' rakho taaki use karne ka lalach na ho.`,
        imagePrompt: "Two piggy banks side by side, one with a pizza icon and one with a first aid kit icon, clear comparison, red and blue colors",
        color: "#EF4444",
        emoji: "📊"
      },
      {
        id: "4-1-6",
        topicId: "4-1",
        topicTitle: "Emergency Fund",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: The Separate Bucket",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, emergency fund ko apne main account se alag karo.

[ ] Ek naya zero-balance account kholo (Kotak 811, Jupiter, etc).
[ ] Is account ka UPI link mat karo (ya delete kar do).
[ ] Isme \`₹500\` transfer karke shuruat karo.
[ ] Is account ka naam rakho: **Safety Shield**.`,
        imagePrompt: "Person holding a digital shield with a tick mark, mobile screen showing a success message, red and green accents, victory theme",
        color: "#EF4444",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module4Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module4Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
