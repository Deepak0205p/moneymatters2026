import { SwipeCard, TopicSection } from './types';

export const module9Topics: TopicSection[] = [
  {
    id: "9-1",
    title: "Insurance Basics — Apka Risk Shield 🛡️",
    emoji: "🛡️",
    color: "#3B82F6",
    description: "Insurance boring nahi, life-saving tool hai. Samjho kaise chota premium apko bade bills se bacha sakta hai!",
    cards: [
      {
        id: "9-1-1",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Dilemma: Bill ya Premium? 🏥",
        content: `Socho ek medical emergency aati hai aur hospital ka bill \`₹2 Lakh\` banta hai. 

Tumhare paas do raste hain. Tum kaunsa chunoge?`,
        imagePrompt: "Person standing between a giant hospital bill and a small shield labeled 'Insurance', blue theme, intense decision making atmosphere, modern illustration",
        color: "#3B82F6",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Dengue ho gaya, hospital bill ₹2 Lakh! Kya taiyari hai?",
          choices: [
            {
              text: "Apni saari savings de dunga.",
              isCorrect: false,
              consequence: "Dukh! Tumhari 3 saal ki mehnat (savings) 3 din mein zero ho gayi. Ab Zero se shuru karna padega."
            },
            {
              text: "Insurance company bill bharegi!",
              isCorrect: true,
              consequence: "Smart! Tumne saal ka ₹6k premium diya tha, aur company ne ₹2 Lakh ka bill bhar diya. Tumhari savings bilkul safe hain!"
            }
          ]
        }
      },
      {
        id: "9-1-2",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Term vs Endowment: Asli Sach 💡",
        content: `Life Insurance do tarah ki hoti hai. Ek jo apko 'Dara' ke bechi jati hai, aur ek jo asli 'Protection' deti hai.

| Feature | Term Insurance | Endowment (LIC/Mix) |
| :--- | :--- | :--- |
| **Cover** | ₹1 Crore 🚀 | ₹5 - ₹10 Lakh 📉 |
| **Premium** | ₹500 - ₹800/m | ₹3,000 - ₹5,000/m |
| **Maturity** | Zero (Pure Safety) | Chota amount (5-6%) |

**Rule**: Insurance ko investment ke saath mix mat karo. Term Plan + SIP = Best Combo!`,
        imagePrompt: "Two scales, one heavily weighted with a large shield, the other with a small bag of coins, clear comparison, blue and white colors",
        color: "#3B82F6",
        emoji: "📊",
        interactiveType: 'none'
      },
      {
        id: "9-1-3",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Health Insurance Ka Funda 📱",
        content: `Priya aur Bhaiya discuss kar rahe hain kyun 'Young' age mein insurance lena chahiye.`,
        imagePrompt: "Two people chatting, one looks healthy and active, the other holding an insurance card, blue and gold theme, modern flat style",
        color: "#3B82F6",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, main abhi 21 ki hoon, ekdum fit! Mujhe insurance ki kya zaroorat?**
        
Bhaiya: **Priya, accident ya viral infections age dekh ke nahi aate. Plus, abhi premium sasta milega!**
        
Priya: **Sasta matlab kitna?**
        
Bhaiya: **Abhi logi toh ₹5,000/year, 35 pe logi toh wahi ₹15,000 ka hoga. Jaldi lena matlab paisa aur tension dono ki bachat!**`
      },
      {
        id: "9-1-4",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Waste of Money? 🕵️‍♂️",
        content: `Log sochte hain ki agar claim nahi kiya toh insurance ka premium 'Waste' ho gaya.`,
        imagePrompt: "Person throwing a small coin into a fire, but the fire is actually a protective dome over a house, blue background, conceptual art",
        color: "#3B82F6",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Maine 5 saal se premium bhara, kuch nahi hua. Mere paise waste ho gaye!",
          options: ["Haan, wapas milne chahiye!", "Galat, peace of mind mila!"],
          correctAnswerIndex: 1,
          explanation: "Insurance ek 'Service' hai, investment nahi. Tumne 5 saal 'Peace of Mind' kharida ki agar kuch hua toh tum barbaad nahi hoge. Jaise car ki seatbelt — kya tum chaho ge ki accident ho taaki seatbelt ka 'Use' ho jaye? Nahi na!"
        }
      },
      {
        id: "9-1-5",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Term Insurance Calculator 🧮",
        content: `Dekho kaise ek 'Pure Term Plan' apko aur apki family ko secure karta hai bina apka budget bigade.

Slide karke dekho \`₹1 Crore\` ka cover kitne mein milega:`,
        imagePrompt: "Shield with a giant '1 Crore' written on it, person standing confidently behind it, blue and silver theme, heroic finance concept",
        color: "#3B82F6",
        emoji: "🧮",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'emi',
          formula: 'none',
          inputs: [
            { label: 'Target Cover (Lakhs)', min: 10, max: 200, defaultValue: 50, step: 10, unit: 'L' },
            { label: 'Your Age', min: 18, max: 40, defaultValue: 22, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "9-1-6",
        topicId: "9-1",
        topicTitle: "Insurance Basics",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Policy Audit",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, apne ghar walon ko financial shock se bachao!

[ ] Apne parents se pucho ki kya apka 'Health Insurance' hai?
[ ] Agar hai, toh dekho ki kya usme apka naam (dependent) included hai?
[ ] Check karo ki total 'Sum Insured' kitna hai (Minimum ₹5 Lakh recommended).
[ ] Agar insurance nahi hai, toh aaj hi PolicyBazaar pe options check karo.`,
        imagePrompt: "Person checking a paper document with parents in the background, warm and responsible atmosphere, blue accents, realistic style",
        color: "#3B82F6",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module9Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module9Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
