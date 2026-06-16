import { SwipeCard, TopicSection } from './types';

export const module7Topics: TopicSection[] = [
  {
    id: "7-1",
    title: "Investment Basics — Paise Se Paisa Banao 📈",
    emoji: "📈",
    color: "#EC4899",
    description: "Saving se tum ameer nahi banoge, investing se banoge. Samjho inflation ko beat karne ka formula!",
    cards: [
      {
        id: "7-1-1",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "SIP: Wealth Building Machine 🚀",
        content: `SIP (Systematic Investment Plan) matlab har mahine chota amount automatically invest karna. 

Iski sabse badi power hai **Consistency**. Market up ho ya down, tumhari 'Machine' chalti rehni chahiye.

Slide karke dekho \`₹1,000\` ki SIP 15-20 saal mein kya kama sakti hai:`,
        imagePrompt: "Money tree growing from a small pot, golden leaves, pink and purple background, magical financial growth concept, 3D style",
        color: "#EC4899",
        emoji: "🚀",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'compounding',
          formula: 'none',
          inputs: [
            { label: 'Monthly SIP', min: 500, max: 20000, defaultValue: 2000, step: 500, unit: '₹' },
            { label: 'Expected Return (%)', min: 10, max: 20, defaultValue: 12, step: 0.5, unit: '%' },
            { label: 'Tenure (Years)', min: 5, max: 30, defaultValue: 15, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "7-1-2",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Risk-Return Matrix: Kahan Invest Karein? 📊",
        content: `Har jagah alag risk aur alag reward hota hai. Apni choice choose karo:

| Asset | Risk | Return (Avg) | Time |
| :--- | :--- | :--- | :--- |
| **FD/RD** | Zero 🛡️ | 6.5 - 7% | Short Term |
| **Mutual Funds**| Medium 📈 | 12 - 15% | Long Term (5yr+) |
| **Individual Stocks**| High ⚠️ | 15 - 25% | Skill Required |
| **Crypto** | Ultra High 🎲| -90 to +500% | High Risk Capital |

**Advice**: Beginners ke liye **Index Mutual Funds** best hain. Kam risk, market return!`,
        imagePrompt: "Four icons representing safety, growth, high risk, and speculation, clean comparison grid, pink and white colors",
        color: "#EC4899",
        emoji: "📊",
        interactiveType: 'none'
      },
      {
        id: "7-1-3",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: Stocks vs Mutual Funds 📱",
        content: `Priya aur Bhaiya discuss kar rahe hain market entry strategy.`,
        imagePrompt: "Two people looking at a stock market graph on a large screen, speech bubbles with icons, pink and gold tones, modern flat illustration",
        color: "#EC4899",
        emoji: "💬",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, main direkt Tata ya Reliance ke shares kharid lun?**
        
Bhaiya: **Kharid toh sakti ho, par kya tumne unka balance sheet check kiya? Research kiya?**
        
Priya: **Nahi... itna time kahan hai?**
        
Bhaiya: **Toh Mutual Fund lo! Wahan expert fund manager tumhare liye research karta hai. Tum chill karo, woh paisa grow karenge.**`
      },
      {
        id: "7-1-4",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Market Timing 🕵️‍♂️",
        content: `Log wait karte hain ki "Jab market niche jayega tab invest karunga."`,
        imagePrompt: "Person with a telescope looking at a fluctuating red and green line, pink background, conceptual financial illustration",
        color: "#EC4899",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Market timing sabse important hai. Sahi waqt ka wait karna chahiye.",
          options: ["Haan, saste mein lenge", "Galat, Time in Market > Timing"],
          correctAnswerIndex: 1,
          explanation: "Market ko koi predict nahi kar sakta! Sahi strategy hai 'SIP'. Jab market niche hai toh zyada units milenge, jab upar hai toh value badhegi. 'Time in market' hi wealth banata hai!"
        }
      },
      {
        id: "7-1-5",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: Crypto FOMO 🎲",
        content: `Tumhara ek dost WhatsApp pe screenshot bhejta hai: *"Bhai, maine ₹5k ke ₹50k bana liye is meme coin mein! Tu bhi daal de."*

Kya karoge?`,
        imagePrompt: "Person looking at a glowing rocket icon on phone while standing near a stable bank vault, pink and red tones, decision making concept",
        color: "#EC4899",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "10x returns in 2 days? Luck ya Investment?",
          choices: [
            {
              text: "Chalo ₹5k daal dete hain!",
              isCorrect: false,
              consequence: "Risk! Crypto volatile hai. Agar woh zero ho gaya toh? Isse 'Speculation' kehte hain, 'Investing' nahi. Sirf utna hi daalo jo 100% loss afford kar sako."
            },
            {
              text: "Main apne Index Fund mein hi rahunga.",
              isCorrect: true,
              consequence: "Smart! FOMO (Fear Of Missing Out) se bacho. Wealth 'Get Rich Quick' schemes se nahi, slow and steady compounding se banti hai."
            }
          ]
        }
      },
      {
        id: "7-1-6",
        topicId: "7-1",
        topicTitle: "Investment Basics",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Start Your KYC",
        content: `🚨 **TODAY'S MISSION**
        
Investing shuru karne ke liye 'KYC' (Know Your Customer) pehla step hai.

[ ] Groww, Zerodha, ya IndMoney app download karo.
[ ] Aadhaar aur PAN card ready rakho.
[ ] KYC process shuru karo (usually 10 min lagte hain).
[ ] Pehli \`₹100\` ki SIP test ke liye set up karo.`,
        imagePrompt: "Digital document with a green checkmark, smartphone with investment app logo, pink and gold theme, achievement vibe",
        color: "#EC4899",
        emoji: "🎯"
      }
    ]
  }
];

export function getAllCards(): SwipeCard[] {
  return module7Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount(): number {
  return getAllCards().length;
}

export function getTopicById(id: string): TopicSection | undefined {
  return module7Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
