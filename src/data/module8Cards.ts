import { SwipeCard, TopicSection } from './types';

export const module8Topics: TopicSection[] = [
  {
    id: "8-1",
    title: "Financial Independence — Asli Azaadi 🎯",
    emoji: "🎯",
    color: "#F59E0B",
    description: "Financial Independence matlab kaam karna band nahi, balki kaam karne ki MAJBOORI khatam hona. Level up karo apni life!",
    cards: [
      {
        id: "8-1-1",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "8 Levels of Freedom: Tum Kahan Ho? 🪜",
        content: `Azaadi ek din mein nahi milti. Iske 8 levels hain. Dekho tum kis seedhi pe ho:

| Level | Name | Status |
| :--- | :--- | :--- |
| **Level 0** | Broke | Paycheck to Paycheck 😫 |
| **Level 1** | Buffer | ₹1k - ₹5k emergency fund 🛡️ |
| **Level 3** | Breathing | 3-6 months expenses saved 🧘 |
| **Level 6** | FIRE | Passive income > Expenses 🚀 |

**Goal**: Level 0 se Level 6 tak ka safar hi wealth building hai!`,
        imagePrompt: "Staircase made of gold bars leading to a sun labeled 'FREEDOM', amber and gold theme, inspirational financial illustration, 3D style",
        color: "#F59E0B",
        emoji: "🪜",
        interactiveType: 'none'
      },
      {
        id: "8-1-2",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "FIRE Movement: Retire Early? 🔥",
        content: `FIRE (Financial Independence, Retire Early) ka formula simple hai: **25x Rule**.

Agar tumhara saal ka kharcha \`₹3 Lakh\` hai, toh tumhe \`₹75 Lakh\` ka corpus chahiye azaad hone ke liye.

Apna **Freedom Number** calculate karo:`,
        imagePrompt: "A person relaxing in a hammock between two palm trees made of currency symbols, amber sunset background, peaceful and rewarding atmosphere",
        color: "#F59E0B",
        emoji: "🔥",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'tax',
          formula: 'none',
          inputs: [
            { label: 'Monthly Expenses', min: 5000, max: 200000, defaultValue: 20000, step: 1000, unit: '₹' },
            { label: 'Current Savings Rate (%)', min: 5, max: 80, defaultValue: 20, step: 5, unit: '%' }
          ]
        }
      },
      {
        id: "8-1-3",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Wealth vs Richness 📱",
        content: `Priya aur Bhaiya discuss kar rahe hain 'Psychology of Money'.`,
        imagePrompt: "Two houses side by side, one with a fancy car but dark windows, one simple house with a glowing garden of coins, amber theme, conceptual art",
        color: "#F59E0B",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, mere padosi ne ₹20 lakh ki nayi car li hai. Woh toh bohot wealthy honge!**
        
Bhaiya: **Nahi Priya, car expenditure hai, wealth nahi. Wealth woh paisa hai jo dikhta nahi — jo invest hua hai.**
        
Priya: **Matlab car lena bura hai?**
        
Bhaiya: **Nahi, par show-off ke liye loan lena bura hai. Real wealth freedom kharidti hai, status nahi!**`
      },
      {
        id: "8-1-4",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Retirement 🕵️‍♂️",
        content: `Log sochte hain ki retirement sirf 60 ki umr mein hota hai.`,
        imagePrompt: "Hourglass with sand turning into gold coins, amber background, time and wealth management theme, modern flat illustration",
        color: "#F59E0B",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Retirement ek age hai (like 60), financial status nahi.",
          options: ["Haan, govt rules hain!", "Galat, jab paisa ho tab!"],
          correctAnswerIndex: 1,
          explanation: "Retirement tab hota hai jab tumhara 'Corpus' itna bada ho jaye ki uske interest se tumhari life chale. Yeh 30 saal mein bhi ho sakta hai aur 70 mein bhi. It's a Number, not an Age!"
        }
      },
      {
        id: "8-1-5",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: Asset ya Liability? 🏠",
        content: `Robert Kiyosaki (Rich Dad Poor Dad) kehte hain: *"Asset apki jeb mein paisa daalta hai, Liability apki jeb se paisa nikalti hai."*

Socho tumhare paas \`₹50,000\` bache hain. Kya karoge?`,
        imagePrompt: "A scale balancing a golden egg (asset) and a leaking bucket (liability), amber theme, decision making concept, simple icons",
        color: "#F59E0B",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Naya iPhone (Liability) ya Quality Stocks (Asset)?",
          choices: [
            {
              text: "iPhone! Status zaroori hai.",
              isCorrect: false,
              consequence: "Liability! Agle saal iski value half ho jayegi aur repair ka kharcha alag. Jeb se paisa niklega!"
            },
            {
              text: "Stocks/SIP! Paisa grow hoga.",
              isCorrect: true,
              consequence: "Asset! Yeh paisa compound hokar tumhe aur paise kama ke dega. Wealthy logo ki yahi pehli choice hoti hai."
            }
          ]
        }
      },
      {
        id: "8-1-6",
        topicId: "8-1",
        topicTitle: "Financial Independence",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Your Freedom Goal",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, bina target ke nishana nahi lagta.

[ ] Socho tumhara Monthly Dream Expense kitna hai (e.g. ₹50,000).
[ ] Use 12 se multiply karo (Annual Expense).
[ ] Use 25 se multiply karo (Your Freedom Number).
[ ] Ek paper pe bade-bade likho: **My Target = ₹X Crore**. 
[ ] Ise apne study table ke saamne chipkao!`,
        imagePrompt: "Person writing a big number on a whiteboard with a smile, sunny amber light through window, goal setting and motivation theme",
        color: "#F59E0B",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module8Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module8Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
