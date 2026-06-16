import { SwipeCard, TopicSection } from './types';

export const module5Topics: TopicSection[] = [
  {
    id: "5-1",
    title: "Debt Aur Credit — Udhaar Ka Khel 💳",
    emoji: "💳",
    color: "#F59E0B",
    description: "Udhaar lena art hai aur science bhi. Samjho kab udhaar tumhe aage le jayega aur kab trap mein phasayega!",
    cards: [
      {
        id: "5-1-1",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Good Debt vs Bad Debt: Farq Samjho 🧐",
        content: `Har udhaar bura nahi hota. Kuch udhaar tumhe ameer banate hain!

| Type | Example | Result |
| :--- | :--- | :--- |
| **Good Debt** 🚀 | Education Loan, Business | Asset / Income build hoti hai |
| **Bad Debt** 📉 | iPhone on EMI, Party Loan | Value khatam, sirf interest bacha |

**Rule**: Agar loan se 'Asset' ban raha hai toh Good, agar sirf 'Shauk' poora ho raha hai toh Bad!`,
        imagePrompt: "Split screen illustration, left side a rocket taking off with 'Education' label, right side a person trapped in a net with 'Shopping' label, amber and white colors",
        color: "#F59E0B",
        emoji: "🧐",
        interactiveType: 'none'
      },
      {
        id: "5-1-2",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "EMI Trap: Asli Keemat Kya Hai? 📱",
        content: `\`₹50,000\` ka laptop EMI pe le rahe ho? "No-Cost EMI" sunne mein accha lagta hai, par hidden charges ka kya?

Processing fees + GST + Interest... Slide karke dekho total extra kitna pay karoge:`,
        imagePrompt: "Laptop with a price tag that grows bigger as a slider moves, amber background, 3D finance icons, clean infographic style",
        color: "#F59E0B",
        emoji: "💸",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'emi',
          formula: 'none',
          inputs: [
            { label: 'Product Price', min: 10000, max: 200000, defaultValue: 50000, step: 5000, unit: '₹' },
            { label: 'Interest Rate (%)', min: 0, max: 24, defaultValue: 14, step: 1, unit: '%' },
            { label: 'Tenure (Months)', min: 3, max: 36, defaultValue: 12, step: 3, unit: 'M' }
          ]
        }
      },
      {
        id: "5-1-3",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Credit Card Ka Jadoo 🪄",
        content: `Priya aur Bhaiya discuss kar rahe hain pehla Credit Card.`,
        imagePrompt: "Credit card glowing like a magic wand, sparkles around it, amber and gold theme, modern flat illustration",
        color: "#F59E0B",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, bank wale free mein credit card de rahe hain! Le lun?**
        
Bhaiya: **Card free hai, par uski 'Aadat' mehengi pad sakti hai. Bill full pay kar paogi?**
        
Priya: **Minimum payment kar dungi na, ₹500 hi toh hai!**
        
Bhaiya: **Wahi toh trap hai! Minimum pay kiya toh baki pe 40% interest lagega. Card tabhi lo jab discipline ho!**`
      },
      {
        id: "5-1-4",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: CIBIL Score 📊",
        content: `Log sochte hain ki loan nahi liya toh CIBIL score 'Best' hoga.`,
        imagePrompt: "Speedometer showing credit score from 300 to 900, needle in the green zone, amber and green accents, professional financial graphic",
        color: "#F59E0B",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Maine kabhi loan nahi liya, mera CIBIL score 900 hoga!",
          options: ["Sahi hai, no udhaar is best!", "Galat, score hi nahi hoga!"],
          correctAnswerIndex: 1,
          explanation: "Agar kabhi loan ya credit card use nahi kiya, toh CIBIL ko pata hi nahi ki tum kaise borrower ho. Score 'NH' (No History) dikhayega. Score build karne ke liye chota udhaar lena aur time pe lautana zaroori hai!"
        }
      },
      {
        id: "5-1-5",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: Friend's Request 🤝",
        content: `Tumhare best friend ko naya phone chahiye, par uska CIBIL kharab hai. Woh bol raha hai: *"Bhai, apne naam pe EMI karwa de, paise main de dunga!"*

Kya karoge?`,
        imagePrompt: "Two friends talking, one holding a phone, a contract document between them with warning signs, amber and red tones, expressive character illustration",
        color: "#F59E0B",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Dost ke liye apne naam pe EMI? Risk ya Dosti?",
          choices: [
            {
              text: "Haan, dosti pehle aati hai!",
              isCorrect: false,
              consequence: "Risk! Agar dost ne ek bhi EMI miss ki, toh CIBIL tumhara kharab hoga. Loan record mein tumhara naam hai, uska nahi. Rishta aur Paisa dono khatre mein!"
            },
            {
              text: "Nahi, saaf mana kar do.",
              isCorrect: true,
              consequence: "Smart! Finance mein boundary zaroori hai. Use samjhao ki credit score kitna imp hai aur use khud build karne mein help karo (like secured card)."
            }
          ]
        }
      },
      {
        id: "5-1-6",
        topicId: "5-1",
        topicTitle: "Debt Aur Credit",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Check Your Score",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, apna credit health check karne ka time aa gaya hai.

[ ] OneScore ya Paisabazaar app download karo.
[ ] Apna Free CIBIL/Experian score check karo.
[ ] Dekho koi purana 'Error' toh nahi hai history mein.
[ ] Agar score nahi hai, toh 'Secured Credit Card' (against FD) ke baare mein socho.`,
        imagePrompt: "Person looking happy at their smartphone screen showing a high credit score, green checkmarks, amber and gold theme, victory vibe",
        color: "#F59E0B",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module5Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module5Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
