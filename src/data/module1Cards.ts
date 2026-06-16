import { SwipeCard, TopicSection } from './types';

export const module1Topics: TopicSection[] = [
  {
    id: "1-1",
    title: "Money Kya Hai — Real Meaning Beyond Notes aur Coins",
    emoji: "💵",
    color: "#3B82F6",
    description: "Paisa sirf paper ya metal nahi — yeh ek concept hai, ek medium hai jiske through value exchange hoti hai.",
    cards: [
      {
        id: "1-1-1",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Barter Dilemma: Kya Exchange Karoge?",
        content: `Socho, agar paisa na hota toh kya hota? Agar tumhe ek chai chahiye aur tumhare paas sirf ek kitab hai...

Kya tum chaiwale ko kitab dekar chai le paoge? 

**Problem**: "Double Coincidence of Wants" — Matlab tumhe woh milna chahiye jo doosre ke paas hai, AUR doosre ko woh chahiye jo tumhare paas hai. 

Mushkil hai na? Isi problem ko solve karne ke liye **Money** bana!`,
        imagePrompt: "Ancient barter system in Indian village, people exchanging goods like grain for clothes, warm earthy tones, educational illustration style",
        color: "#3B82F6",
        emoji: "🔄",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Tumhe chai chahiye, par tumhare paas sirf ek purani Engineering Book hai. Chaiwala kya bolega?",
          choices: [
            {
              text: "Kitab de do, chai le lo!",
              isCorrect: false,
              consequence: "Chaiwala bola: 'Bhai, main chai bechta hoon, exams nahi deta! Mujhe chawal chahiye, kitab nahi.'"
            },
            {
              text: "Book bech kar paisa lao!",
              isCorrect: true,
              consequence: "Bilkul! Paisa 'Medium of Exchange' hai. Yeh sab accept karte hain, chahe unhe kitab chahiye ho ya nahi."
            }
          ]
        }
      },
      {
        id: "1-1-2",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Paisa Aaya Kahan Se?",
        content: `Priya aur Bhaiya ki baatcheet se samjho paise ka safar. Barter se lekar Bitcoin tak, sab kuch badal gaya par maqsad wahi hai — **Value Exchange**.`,
        imagePrompt: "Evolution of money timeline from barter to gold coins to paper currency, Indian historical context, educational infographic style, warm golden tones",
        color: "#3B82F6",
        emoji: "📜",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, yeh notes ki value kyun hai? Yeh toh sirf paper hain na?**
        
Bhaiya: **Sahi pakde ho! Inhe 'Fiat Currency' kehte hain. Inki value isliye hai kyunki Govt ne promise kiya hai.**
        
Priya: **Matlab pehle gold coins hote the tabhi asli value thi?**
        
Bhaiya: **Pehle Gold tha, phir paper jo gold se back hota tha. Aaj sirf 'Trust' aur 'Legal Tender' pe duniya chalti hai!**`
      },
      {
        id: "1-1-3",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "UPI Revolution — India Ka Power!",
        content: `India ne duniya ko dikha diya ki digital money kya hota hai. UPI sirf ek app nahi, ek **Financial Revolution** hai. 

Slide karke dekho India mein UPI ka power:`,
        imagePrompt: "Digital payment revolution in India, UPI QR code scanning on smartphone, modern fintech illustration, vibrant blue and green gradient, tech style",
        color: "#3B82F6",
        emoji: "📱",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'compounding',
          formula: 'none',
          inputs: [
            { label: 'Yearly Transactions (Billions)', min: 1, max: 200, defaultValue: 131, step: 1, unit: 'B' }
          ],
        }
      },
      {
        id: "1-1-4",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Money Ke 5 Main Functions",
        content: `Paisa sirf kharch karne ke liye nahi hota. Iske 5 super-powers hain:

| Function | Kya hota hai? | Example 💡 |
| :--- | :--- | :--- |
| **Medium of Exchange** | Cheezein kharidne ke liye | Chai ke liye ₹20 dena ☕ |
| **Unit of Account** | Value measure karne ke liye | Phone ₹15,000 ka hai 📱 |
| **Store of Value** | Save karne ke liye | Bank mein ₹5k rakhna 🏦 |
| **Deferred Payment** | Udhaar/EMI ke liye | ₹1k ki monthly EMI 💸 |
| **Transfer Value** | Kahin bhi bhejne ke liye | GPay to Friend 📲 |`,
        imagePrompt: "Five functions of money illustrated as icons, medium of exchange, unit of account, store of value, deferred payment, transfer of value, clean modern infographic, blue theme",
        color: "#3B82F6",
        emoji: "⚡"
      },
      {
        id: "1-1-5",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Inflation: Chupta Hua Chor 📉",
        content: `Aaj ke \`₹100\` ki value 5 saal baad \`₹100\` nahi rahegi. Isse kehte hain **Inflation** (Mehangai).

Calculater use karke dekho ki mehangai tumhare paise ko kaise khati hai:`,
        imagePrompt: "Purchasing power comparison concept, Indian rupee notes shrinking over time, inflation visualization, warm orange and red warning tones, educational illustration",
        color: "#3B82F6",
        emoji: "📉",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'inflation',
          formula: 'none',
          inputs: [
            { label: 'Current Amount', min: 100, max: 100000, defaultValue: 1000, step: 100, unit: '₹' },
            { label: 'Inflation Rate (%)', min: 1, max: 15, defaultValue: 6, step: 0.5, unit: '%' },
            { label: 'Years', min: 1, max: 30, defaultValue: 10, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "1-1-6",
        topicId: "1-1",
        topicTitle: "Money Kya Hai",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: Wallet Audit",
        content: `🚨 **TODAY'S MISSION**
        
Bhai, gyaan toh le liya, ab action ki baari hai!

[ ] Apne UPI apps (GPay/PhonePe) kholo.
[ ] Last 5 transactions check karo.
[ ] Dekho ki kitna 'Need' tha aur kitna 'Want'.
[ ] Ek notebook ya app mein aaj ka kharcha likho.`,
        imagePrompt: "Young Indian student Rahul calculating expenses on paper in a small city room, realistic slice of life illustration, warm domestic lighting, emotional storytelling style",
        color: "#3B82F6",
        emoji: "🧑"
      }
    ]
  },
  {
    id: "1-2",
    title: "Income Kya Hai — Har Rupye Ka Source",
    emoji: "💰",
    color: "#10B981",
    description: "Income ka simple matlab hai — tumhare paas aane wala paisa. Jo bhi source se paisa aata hai, woh income hai.",
    cards: [
      {
        id: "1-2-1",
        topicId: "1-2",
        topicTitle: "Income Kya Hai",
        cardIndex: 1,
        totalCardsInTopic: 5,
        title: "Active vs Passive Income",
        content: `**Active Income**: Kaam karo toh paisa aayega. (Job, Tuition)
**Passive Income**: Ek baar mehnat, baar baar paisa. (YouTube, SIP, Rent)

Dono ka farq samjho is Chat Sim mein:`,
        imagePrompt: "Split comparison of active vs passive income, left side person working hard at desk, right side person relaxing while money flows in, modern illustration, green and gold tones",
        color: "#10B981",
        emoji: "⚡",
        interactiveType: 'none',
        content: `Student: **Bhaiya, main part-time job karun ya YouTube?**
        
Bhaiya: **Active income (job) turant paisa degi, par Passive (YouTube) long term wealth degi.**
        
Student: **Toh dono kar sakte hain?**
        
Bhaiya: **Best strategy! Active se bills bharo, Passive build karke financial freedom paao.**`
      },
      {
        id: "1-2-2",
        topicId: "1-2",
        topicTitle: "Income Kya Hai",
        cardIndex: 2,
        totalCardsInTopic: 5,
        title: "Myth-Buster: Side Hustle 🤑",
        content: `Log bolte hain student life mein sirf padhai karni chahiye... Par kya yeh sach hai?`,
        imagePrompt: "Indian student working multiple gigs - laptop freelancing, tutoring, food delivery, diverse income sources, modern illustration style, green money theme",
        color: "#10B981",
        emoji: "📋",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Students ko sirf padhai karni chahiye, paise kamana distraction hai.",
          options: ["Sahi baat hai!", "Galat, skill milti hai!"],
          correctAnswerIndex: 1,
          explanation: "Aaj ki duniya mein financial independence jaldi shuru karna ek 'Life Skill' hai. Freelancing ya part-time job se tum real world problems solve karna seekhte ho."
        }
      },
      {
        id: "1-2-3",
        topicId: "1-2",
        topicTitle: "Income Kya Hai",
        cardIndex: 3,
        totalCardsInTopic: 5,
        title: "15 Real Income Sources for Students",
        content: `Paisa kamane ke bahut tareeqe hain yaar:

| Source | Approx Income | Type |
| :--- | :--- | :--- |
| **Freelance Design** | ₹5,000 - ₹20,000 | Active |
| **Tuitions** | ₹2,000 - ₹8,000 | Active |
| **SIP Returns** | ₹500 - Unlimited | Passive |
| **Scholarship** | ₹1,000 - ₹25,000 | Stable |
| **Affiliate Marketing** | ₹500 - ₹10,000 | Passive |`,
        imagePrompt: "Multiple income streams flowing into a student's wallet, coins and notes from different sources, fresh green color scheme, modern flat illustration",
        color: "#10B981",
        emoji: "💵"
      },
      {
        id: "1-2-4",
        topicId: "1-2",
        topicTitle: "Income Kya Hai",
        cardIndex: 4,
        totalCardsInTopic: 5,
        title: "🚨 MISSION: Income Hunt",
        content: `🚨 **TODAY'S MISSION**
        
Apne skills ki list banao aur dekho tum kahan se \`₹1,000\` extra kama sakte ho.

[ ] Canv / Design tools seekho.
[ ] Upwork ya Fiverr pe profile dekho.
[ ] Apne neighborhood mein tuition ki demand check karo.
[ ] Purani books ya gadgets becho (OLX/Cashify).`,
        imagePrompt: "Student juggling three income streams - stable job, freelance laptop, passive investment growing, balanced lifestyle, modern illustration, vibrant green and gold",
        color: "#10B981",
        emoji: "🎯"
      }
    ]
  }
];

// Get all cards in flat array
export function getAllCards(): SwipeCard[] {
  return module1Topics.flatMap(topic => topic.cards);
}

// Get total card count
export function getTotalCardCount(): number {
  return getAllCards().length;
}

// Get topic by id
export function getTopicById(id: string): TopicSection | undefined {
  return module1Topics.find(t => t.id === id);
}

// Get cards by topic
export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
