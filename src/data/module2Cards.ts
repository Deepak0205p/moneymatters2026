import { SwipeCard, TopicSection } from './types';

export const module2Topics: TopicSection[] = [
  {
    id: "2-1",
    title: "Budgeting In Real Life — Paisa Kahan Gaya?",
    emoji: "📋",
    color: "#10B981",
    description: "Budgeting matlab kanjoosi nahi, balki apne paison ka boss banna hai. Samjho har rupye ka address!",
    cards: [
      {
        id: "2-1-1",
        topicId: "2-1",
        topicTitle: "Budgeting In Real Life",
        cardIndex: 1,
        totalCardsInTopic: 5,
        title: "50/30/20 Rule: Magic Formula ✨",
        content: `Bhai, agar tumhe samajh nahi aa raha ki savings shuru kahan se karein, toh yeh simple rule pakad lo:

- **50% Needs**: Rent, food, bills (Jo zaroori hai).
- **30% Wants**: Netflix, outing, shopping (Jo dil chahta hai).
- **20% Savings**: SIP, emergency fund (Jo future banayega).

Calculator use karke dekho tumhari income kaise divide honi chahiye:`,
        imagePrompt: "Pie chart illustration of 50-30-20 budget rule, vibrant green and blue colors, modern 3D icons for needs, wants and savings, clean financial infographic",
        color: "#10B981",
        emoji: "📐",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'budget',
          formula: 'none',
          inputs: [
            { label: 'Monthly Income', min: 1000, max: 100000, defaultValue: 10000, step: 500, unit: '₹' }
          ]
        }
      },
      {
        id: "2-1-2",
        topicId: "2-1",
        topicTitle: "Budgeting In Real Life",
        cardIndex: 2,
        totalCardsInTopic: 5,
        title: "Myth-Buster: Budgeting 🕵️‍♂️",
        content: `Log sochte hain budget banana matlab apni 'Aish' khatam karna. Par kya yeh sach hai?`,
        imagePrompt: "Person looking through magnifying glass at coins, detective theme, mystery vibe, green and teal colors, modern flat illustration",
        color: "#10B981",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Budgeting sirf unke liye hai jo bohot kam kamate hain.",
          options: ["Sahi baat!", "Galat, sabke liye hai!"],
          correctAnswerIndex: 1,
          explanation: "Elon Musk ho ya ek student, budget sabko chahiye! Budgeting ka matlab hai apne paison ko batana ki kahan jaana hai, bajaye yeh poochne ke ki 'woh kahan gaye?'"
        }
      },
      {
        id: "2-1-3",
        topicId: "2-1",
        topicTitle: "Budgeting In Real Life",
        cardIndex: 3,
        totalCardsInTopic: 5,
        title: "Needs vs Wants: The Dilemma 🍔",
        content: `Tumhare paas ₹500 bache hain. Sunday hai. Dost bula rahe hain party ke liye, par kal phone ka recharge bhi khatam hone wala hai. 

Kya karoge?`,
        imagePrompt: "Student standing between a burger and a mobile recharge icon, decision making concept, vibrant green background, expressive character illustration",
        color: "#10B981",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Sunday party ya Phone recharge? Budget tight hai!",
          choices: [
            {
              text: "Party! Kal ka kal dekhenge.",
              isCorrect: false,
              consequence: "Trap! Kal phone recharge nahi hua toh classes aur assignments miss ho jayenge. 'Want' ne 'Need' ka gala ghot diya!"
            },
            {
              text: "Recharge pehle, party skip.",
              isCorrect: true,
              consequence: "Smart! Basic Needs (communication) pehle aati hain. Doston ko ghar bula lo, chai pe charcha kar lo — paise bhi bachenge aur maze bhi honge!"
            }
          ]
        }
      },
      {
        id: "2-1-4",
        topicId: "2-1",
        topicTitle: "Budgeting In Real Life",
        cardIndex: 4,
        totalCardsInTopic: 5,
        title: "Student Budget Templates 📋",
        content: `Har student ki life alag hoti hai. Dekho tum kis category mein fit hote ho:

| Category | Amount (₹) | Strategy |
| :--- | :--- | :--- |
| **Survival** | ₹3,000 | 70% Food/Rent, 10% Savings |
| **Comfort** | ₹10,000 | 50% Needs, 20% Skills, 30% Savings |
| **Working Student**| ₹20,000 | 40% Living, 40% Invest, 20% Fun |

**Pro Tip**: Pay yourself first! Pehle savings ka paisa side rakho, phir kharch karo.`,
        imagePrompt: "Three different budget icons - a shield for survival, a sofa for comfort, and a rocket for working student, clean comparison table, green theme",
        color: "#10B981",
        emoji: "📊"
      },
      {
        id: "2-1-5",
        topicId: "2-1",
        topicTitle: "Budgeting In Real Life",
        cardIndex: 5,
        totalCardsInTopic: 5,
        title: "🚨 MISSION: Subscription Audit",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, woh unused subscriptions tumhare bank account mein 'leak' ki tarah hain.

[ ] Play Store / App Store kholo.
[ ] 'Subscriptions' section check karo.
[ ] Jo app 1 mahine se use nahi ki, uska auto-renewal OFF karo.
[ ] Dekho kitne ₹ bache! (Average student ₹500/month bacha leta hai yahan).`,
        imagePrompt: "Magnifying glass over a list of mobile apps with 'Cancel' buttons highlighted, red and green accents, tech style illustration",
        color: "#10B981",
        emoji: "🚫"
      }
    ]
  },
  {
    id: "2-2",
    title: "Expense Tracking — Khoofiya Detective 🕵️",
    emoji: "🔍",
    color: "#059669",
    description: "\"Jo measure nahi hota, woh manage nahi hota.\" Samjho paisa kahan chhip raha hai.",
    cards: [
      {
        id: "2-2-1",
        topicId: "2-2",
        topicTitle: "Expense Tracking",
        cardIndex: 1,
        totalCardsInTopic: 3,
        title: "Chat: Tracking Ka Funda 📱",
        content: `Priya aur Bhaiya ki baatcheet se samjho kyun tracking zaroori hai.`,
        imagePrompt: "Two people chatting on smartphones, speech bubbles with currency symbols and graphs, modern clean illustration, emerald green theme",
        color: "#059669",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, mahine ke end mein balance zero ho jata hai, pata hi nahi chalta kahan gaya!**
        
Bhaiya: **Bhai, tum 'Invisible Leaks' ka shikaar ho. Woh ₹20 ki chai aur ₹50 ka auto ka hisaab rakhti ho?**
        
Priya: **Nahi... itne chhote kharche kaun likhta hai?**
        
Bhaiya: **Wahi toh! ₹50/day = ₹1,500/month. Tracking app dalo aur dekho magic!**`
      },
      {
        id: "2-2-2",
        topicId: "2-2",
        topicTitle: "Expense Tracking",
        cardIndex: 2,
        totalCardsInTopic: 3,
        title: "Tracking Methods: Choose Your Style",
        content: `Har kisi ka style alag hota hai. Tumhe kya pasand hai?

| Method | Effort | Accuracy |
| :--- | :--- | :--- |
| **Notebook** | High ✍️ | High (Manual) |
| **Apps (Walnut/IndMoney)** | Low 📱 | Very High (Auto) |
| **Excel/Sheets** | Medium 💻 | Professional |

**Advice**: Digital payments (UPI) zyada karte ho toh apps use karo, auto-track ho jayega!`,
        imagePrompt: "Comparison of notebook, mobile app, and laptop screen with spreadsheet, clean icons, organized layout, green and white colors",
        color: "#059669",
        emoji: "🛠️"
      },
      {
        id: "2-2-3",
        topicId: "2-2",
        topicTitle: "Expense Tracking",
        cardIndex: 3,
        totalCardsInTopic: 3,
        title: "🚨 MISSION: Last 3 Days",
        content: `🚨 **TODAY'S MISSION**
        
Gyaan bahut ho gaya, ab real data dekhte hain!

[ ] Apna GPay / PhonePe / Paytm history kholo.
[ ] Pichle 3 din ke saare transactions ek paper pe likho.
[ ] Total karo.
[ ] Kya koi aisa kharcha tha jo avoid ho sakta tha? (Be honest!)`,
        imagePrompt: "Smartphone screen showing payment history with a person writing notes in a diary, realistic and focused, warm green lighting",
        color: "#059669",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module2Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module2Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
