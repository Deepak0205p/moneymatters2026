import { SwipeCard, TopicSection } from './types';

export const module3Topics: TopicSection[] = [
  {
    id: "3-1",
    title: "Saving Strategies — Paisa Bachane Ki Ninja Technique 🥷",
    emoji: "🏦",
    color: "#8B5CF6",
    description: "Saving boring nahi, ek super-power hai. Dekho kaise chhote amounts bade wealth mein badalte hain!",
    cards: [
      {
        id: "3-1-1",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Compounding: Duniya Ka 8th Ajooba 🚀",
        content: `Albert Einstein ne kaha tha compounding duniya ka 8th ajooba hai. Kyun?

Kyunki yahan paisa sirf badhta nahi, **multiply** hota hai! 

SIP (Systematic Investment Plan) shuru karke dekho tumhare \`₹500\` mahine ki value 20 saal baad kya hogi:`,
        imagePrompt: "Rocket ship made of coins taking off, stars in the background, neon purple and blue colors, futuristic financial illustration, compounding magic theme",
        color: "#8B5CF6",
        emoji: "🚀",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'compounding',
          formula: 'none',
          inputs: [
            { label: 'Monthly SIP', min: 500, max: 20000, defaultValue: 1000, step: 500, unit: '₹' },
            { label: 'Expected Return (%)', min: 8, max: 18, defaultValue: 12, step: 0.5, unit: '%' },
            { label: 'Time Period (Years)', min: 1, max: 40, defaultValue: 15, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "3-1-2",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Chat: Jaldi Shuru Karne Ka Fayda ⏳",
        content: `Priya aur Bhaiya ki baatcheet se samjho 'Time' ki value.`,
        imagePrompt: "Two people sitting on a giant hourglass filled with coins instead of sand, purple and gold tones, modern flat illustration, conceptual art",
        color: "#8B5CF6",
        emoji: "⏳",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, abhi toh main sirf 20 ki hoon. Job lagegi tab save karungi na?**
        
Bhaiya: **Arrey pagli! 20 pe start karne ka jo maza hai woh 30 pe nahi. 10 saal ka gap matlab crore ka nuksan!**
        
Priya: **Kya? 10 saal mein crore ka farq?**
        
Bhaiya: **Haan! Compounding ko 'Time' chahiye hota hai. Jitna lamba samay, utna bada paisa. ₹1,000/month 20 pe start kiya toh 60 tak ₹1.2 Cr ban sakta hai!**`
      },
      {
        id: "3-1-3",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Savings 🏦",
        content: `Bahut log sochte hain ki saving sirf tabhi ho sakti hai jab income bohot zyada ho.`,
        imagePrompt: "Person trying to catch floating currency notes, purple background, surreal financial illustration, modern graphic style",
        color: "#8B5CF6",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: ₹500 bachane se kuch nahi hoga, wait karo jab tak ₹10,000 na bacha sako.",
          options: ["Sahi hai, ₹500 chillar hai", "Galat, habit zaroori hai!"],
          correctAnswerIndex: 1,
          explanation: "Saving ek muscle ki tarah hai. Agar tum ₹500 manage nahi kar sakte, toh ₹50,000 bhi nahi kar paoge. Start small, but START!"
        }
      },
      {
        id: "3-1-4",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Inflation: Chupta Hua Chor 📉",
        content: `Tumne ₹1,000 cupboard mein chhupa diye. 10 saal baad nikale. Kya woh abhi bhi ₹1,000 hain?

Technicaly haan, par unki **aukad** (purchasing power) kam ho gayi hai.

| Year | Purchasing Power of ₹1,000 |
| :--- | :--- |
| **Today** | ₹1,000 (Poori Value) 💰 |
| **5 Years** | ₹747 (Ghis gaya) 📉 |
| **10 Years** | ₹558 (Adha reh gaya) 💸 |

**Conclusion**: Paisa sirf bachao mat, use grow bhi karo (Invest)!`,
        imagePrompt: "Ice cube shaped like a rupee symbol melting into a puddle, warm background, conceptual illustration of inflation, purple accents",
        color: "#8B5CF6",
        emoji: "📉"
      },
      {
        id: "3-1-5",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Choose Your Style: Saving Hacks 🛠️",
        content: `Har kisi ka saving style alag hota hai. Tumhe kaunsa suit karega?`,
        imagePrompt: "Three different piggy banks - one digital, one glass, one traditional clay, diverse saving methods illustrated, purple and teal theme",
        color: "#8B5CF6",
        emoji: "🛠️",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Tumhe agle phone ke liye ₹20,000 bachane hain. Strategy kya hogi?",
          choices: [
            {
              text: "Envelope Method (Cash side rakho)",
              isCorrect: true,
              consequence: "Old school but gold! Cash dikhta hai toh kharch karne mein darr lagta hai. Disciplined!"
            },
            {
              text: "Auto-Debit (Directly save from bank)",
              isCorrect: true,
              consequence: "Best for lazy legends! Paisa account mein aane se pehle hi save ho gaya. Zero effort, Max result!"
            }
          ]
        }
      },
      {
        id: "3-1-6",
        topicId: "3-1",
        topicTitle: "Saving Strategies",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: No-Spend Day",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, aaj ek 'No-Spend Day' challenge lete hain. 

[ ] Aaj ₹0 kharch karne ka try karo (apart from already paid mess/rent).
[ ] Koi bahar ka khana nahi, koi shopping nahi, koi auto nahi.
[ ] Shaam ko dekho kitna bacha aur kaisa feel hua.
[ ] Agar successful rahe toh +50 Coins!`,
        imagePrompt: "Calendar with a big green checkmark on today's date, '₹0' written boldly, minimal and clean illustration, purple and green colors",
        color: "#8B5CF6",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module3Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module3Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
