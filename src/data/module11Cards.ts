import { SwipeCard, TopicSection } from './types';

export const module11Topics: TopicSection[] = [
  {
    id: "11-1",
    title: "Real World: Case Studies 📋",
    emoji: "📋",
    color: "#8B5CF6",
    description: "Theory toh seekh li, ab dekho real life mein log kaise plan karte hain.",
    cards: [
      {
        id: "11-1-1",
        topicId: "11-1",
        topicTitle: "Real World: Case Studies",
        cardIndex: 1,
        totalCardsInTopic: 3,
        title: "Fresher Ka First Budget 💸",
        content: `Miliye **Aman** se, jiski pehli job lag gayi hai at \`₹25,000/month\`. 

Woh confused hai ki kahan se shuru kare. Bhaiya ne usse yeh plan diya:

| Category | Amount | % |
| :--- | :--- | :--- |
| **Needs (Rent/Food)** | ₹13,000 | 52% |
| **Wants (Fun/Shopping)** | ₹5,000 | 20% |
| **Savings (EF + SIP)** | ₹6,000 | 24% |
| **Tax/Misc** | ₹1,000 | 4% |`,
        imagePrompt: "Young Indian professional Aman looking at his first salary slip, excited but confused, modern apartment background, vibrant purple theme",
        color: "#8B5CF6",
        emoji: "💼",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'budget',
          formula: 'none',
          inputs: [
            { label: 'Monthly Salary', min: 10000, max: 100000, defaultValue: 25000, step: 5000, unit: '₹' }
          ]
        }
      },
      {
        id: "11-1-2",
        topicId: "11-1",
        topicTitle: "Real World: Case Studies",
        cardIndex: 2,
        totalCardsInTopic: 3,
        title: "Student Side-Hustle Plan 🎓",
        content: `**Priya** college student hai, pocket money + freelancing se \`₹8,000\` kamati hai.

Uska goal hai 1 saal mein naya Laptop lena (\`₹50,000\`).`,
        imagePrompt: "Student Priya working on her laptop in a hostel room, saving for her dreams, warm purple tones, educational style",
        color: "#8B5CF6",
        emoji: "🎓",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, ₹8k mein laptop kaise aayega?**
        
Bhaiya: **Dekho, ₹3k needs, ₹2k fun, aur ₹3k save karo.**
        
Priya: **Sirf ₹3k se 1 saal mein ho jayega?**
        
Bhaiya: **₹3k * 12 = ₹36k savings. Baki ₹14k freelancing ke bonus projects se target karo!**`
      },
      {
        id: "11-1-3",
        topicId: "11-1",
        topicTitle: "Real World: Case Studies",
        cardIndex: 3,
        totalCardsInTopic: 3,
        title: "🚨 MISSION: My First Plan",
        content: `🚨 **TODAY'S MISSION**
        
Aman ya Priya ki tarah apna ek hypothetical plan banao.

[ ] Apni expected first salary decide karo.
[ ] 50/30/20 rule apply karke dekho.
[ ] Ek 'Big Goal' (Laptop/Trip) select karo.
[ ] Savings rate calculate karo.`,
        imagePrompt: "Checklist of financial goals for students, modern infographic, purple and gold theme",
        color: "#8B5CF6",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "11-6",
    title: "Scams Se Bacho! ⚠️",
    emoji: "⚠️",
    color: "#F43F5E",
    description: "India mein digital fraud bahut badh raha hai. Savdhan rahein!",
    cards: [
      {
        id: "11-6-1",
        topicId: "11-6",
        topicTitle: "Scams Se Bacho!",
        cardIndex: 1,
        totalCardsInTopic: 3,
        title: "Escape The Telegram Scam 🛑",
        content: `Tumhe ek WhatsApp message aata hai: *"Ghar baithe ₹5,000 kamayein! Bas YouTube videos like karein."*

Tum join karte ho aur woh bolte hain — *"Pehle ₹2,000 deposit karein security ke liye."*`,
        imagePrompt: "Smartphone screen showing a suspicious Telegram chat, scam warning, dark red and neon alert colors",
        color: "#F43F5E",
        emoji: "🛑",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Woh bol rahe hain ki ₹2,000 do aur ₹4,000 wapas lo 1 ghante mein. Kya karoge?",
          choices: [
            {
              text: "Try karte hain, chhota amount hai.",
              isCorrect: false,
              consequence: "Trap! Woh ₹2k lekar tumhe block kar denge. Isse 'Task Scam' kehte hain."
            },
            {
              text: "Block and Report immediately!",
              isCorrect: true,
              consequence: "Smart! Koi bhi asli job shuru karne ke liye 'Security Deposit' nahi mangti."
            }
          ]
        }
      },
      {
        id: "11-6-2",
        topicId: "11-6",
        topicTitle: "Scams Se Bacho!",
        cardIndex: 2,
        totalCardsInTopic: 3,
        title: "UPI QR Code Scam 📲",
        content: `OlX pe tumne cycle bechi. Buyer bolta hai — *"Bhai, main QR bhej raha hoon, scan karo paise receive karne ke liye."*`,
        imagePrompt: "Person scanning a QR code on phone, caution sign overlay, red and yellow warning tones",
        color: "#F43F5E",
        emoji: "📲",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: QR Code scan karne se bank account mein paise aate hain.",
          options: ["Sahi hai", "Bilkul Galat!"],
          correctAnswerIndex: 1,
          explanation: "Bhai, QR scan karne se hamesha paise JAATE hain. Paise receive karne ke liye kabhi QR scan ya PIN daalne ki zaroorat nahi hoti!"
        }
      },
      {
        id: "11-6-3",
        topicId: "11-6",
        topicTitle: "Scams Se Bacho!",
        cardIndex: 3,
        totalCardsInTopic: 3,
        title: "Cyber Security Checklist 🛡️",
        content: `🚨 **TODAY'S MISSION**
        
In 5 rules ko kabhi mat bhulna:

[ ] OTP kisi se share nahi karna (Not even Bank).
[ ] QR scan = You pay. Receive ke liye QR nahi chahiye.
[ ] Unknown links pe click mat karo.
[ ] 'AnyDesk' ya 'TeamViewer' kisi stranger ke kehne pe download mat karo.
[ ] 1930 — Yeh Cyber Crime helpline number save kar lo.`,
        imagePrompt: "Shield icon with cyber security rules, digital safety infographic, red and silver tones",
        color: "#F43F5E",
        emoji: "🛡️"
      }
    ]
  },
  {
    id: "11-7",
    title: "Psychology of Money 🧠",
    emoji: "🧠",
    color: "#10B981",
    description: "Paisa sirf math nahi, psychology hai.",
    cards: [
      {
        id: "11-7-1",
        topicId: "11-7",
        topicTitle: "Psychology of Money",
        cardIndex: 1,
        totalCardsInTopic: 3,
        title: "Wealth Is What You Don't See 🕵️‍♂️",
        content: `Flashy car, iPhone, branded kapde — yeh 'Expenditure' hai, 'Wealth' nahi.

Real wealth woh hai jo tumne invest kiya aur kharcha nahi.`,
        imagePrompt: "Side by side comparison of a person with expensive stuff but debt vs a simple person with massive investments, green and gold theme",
        color: "#10B981",
        emoji: "🕵️‍♂️",
        interactiveType: 'none',
        content: `Priya: **Bhaiya, mera dost nayi car laya, woh toh wealthy hoga na?**
        
Bhaiya: **Shayad woh ameer 'dikh' raha hai, par \`₹15k\` EMI bhar raha hai. Wealthy woh hai jisne chupchap \`₹15k\` SIP mein daale.**
        
Priya: **Matlab ameer dikhne aur ameer hone mein farq hai?**
        
Bhaiya: **Zameen-aasmaan ka! Wealthy bano, ameer mat dikho.**`
      },
      {
        id: "11-7-2",
        topicId: "11-7",
        topicTitle: "Psychology of Money",
        cardIndex: 2,
        totalCardsInTopic: 3,
        title: "Time vs Money ⏳",
        content: `Compounding ka sabse bada factor 'Amount' nahi, 'Time' hai.

Calculater pe check karo ki 10 saal pehle start karne se kitna farq padta hai:`,
        imagePrompt: "Timeglass with money flowing through it, compounding visualization, green and gold tones",
        color: "#10B981",
        emoji: "⏳",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'compounding',
          formula: 'sip',
          inputs: [
            { label: 'Monthly SIP', min: 500, max: 20000, defaultValue: 2000, step: 500, unit: '₹' },
            { label: 'Interest Rate (%)', min: 1, max: 20, defaultValue: 12, step: 1, unit: '%' },
            { label: 'Years', min: 1, max: 40, defaultValue: 20, step: 1, unit: 'Y' }
          ]
        }
      },
      {
        id: "11-7-3",
        topicId: "11-7",
        topicTitle: "Psychology of Money",
        cardIndex: 3,
        totalCardsInTopic: 3,
        title: "🚨 MISSION: Graduation! 🎓",
        content: `🚨 **FINAL MISSION**
        
Badhai ho! Tumne Rupaiya 101 complete kar liya hai. 

[ ] Module 1 to 11 ki main seekh ek notebook mein likho.
[ ] Aaj hi pehla SIP (\`₹100\` bhi chalega) start karo.
[ ] Yeh app apne 3 doston ke saath share karo.
[ ] Future plan: FIRE (Financial Independence) ka target set karo.`,
        imagePrompt: "Student throwing graduation cap, celebratory atmosphere, financial freedom reached, vibrant green and gold theme",
        color: "#10B981",
        emoji: "🏆"
      }
    ]
  }
];

// Get all cards in flat array
export function getAllCards(): SwipeCard[] {
  return module11Topics.flatMap(topic => topic.cards);
}

// Get total card count
export function getTotalCardCount(): number {
  return getAllCards().length;
}

// Get topic by id
export function getTopicById(id: string): TopicSection | undefined {
  return module11Topics.find(t => t.id === id);
}

// Get cards by topic
export function getCardsByTopic(topicId: string): SwipeCard[] {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
