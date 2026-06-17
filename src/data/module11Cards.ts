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
| **Tax/Misc** | ₹1,000 | 4% |

**Strategy**: ₹3,000 SIP mein — ₹2,000 Nifty 50 Index Fund + ₹1,000 ELSS (tax saver). Emergency fund 6 months = ₹78,000 target. Health insurance lo (₹500-₹700/month). Term plan bhi consider karo agar parents depend hain. 80C mein ₹1.5 lakh target: ₹12,000 ELSS + ₹12,000 PPF = ₹24,000/year. Gradually increase.`,
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

Uska goal hai 1 saal mein naya Laptop lena (\`₹50,000\`).

**Priya**: Bhaiya, ₹8k mein laptop kaise aayega?

**Bhaiya**: Dekho, ₹3k needs, ₹2k fun, aur ₹3k save karo.

**Priya**: Sirf ₹3k se 1 saal mein ho jayega?

**Bhaiya**: ₹3k * 12 = ₹36k savings. Baki ₹14k freelancing ke bonus projects se target karo!

**Strategy**: 
- ₹3k SIP/month × 12 = ₹36,000
- Bonus freelance projects ₹1,200/month × 12 = ₹14,400
- Total: ₹50,400 — Laptop funded!`,
        imagePrompt: "Student Priya working on her laptop in a hostel room, saving for her dreams, warm purple tones, educational style",
        color: "#8B5CF6",
        emoji: "🎓",
        interactiveType: 'none'
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

- [ ] Apni expected first salary decide karo.
- [ ] 50/30/20 rule apply karke dekho.
- [ ] Ek 'Big Goal' (Laptop/Trip) select karo.
- [ ] Savings rate calculate karo.

**4 Complete Case Studies Summary:**

| Case | Income | Savings | Strategy |
| :--- | :--- | :--- | :--- |
| **College Student** | ₹5,000 | 6% (₹300) | Pehle emergency fund, phir SIP |
| **Working Student** | ₹15,000 | 27% (₹4,000) | EF + SIP + PPF |
| **Fresher** | ₹25,000 | 28% (₹7,000) | Diversified portfolio |
| **3-Yr Experienced** | ₹50,000 | 35% (₹17,500) | SIP + PPF + NPS + Insurance |

**Real Example: 3-Year Experienced Professional (₹50,000/month)**

| Category | Amount | % |
| :--- | :--- | :--- |
| **Needs (Family + Rent)** | ₹25,000 | 50% |
| **Wants (Travel/Shopping)** | ₹7,500 | 15% |
| **Emergency Fund (Maintain)** | ₹2,500 | 5% |
| **SIP (Diversified)** | ₹10,000 | 20% |
| **PPF + NPS** | ₹3,000 | 6% |
| **Health + Term Insurance** | ₹2,000 | 4% |

Strategy: ₹10,000 SIP split — ₹5,000 Nifty 50 Index, ₹2,500 Midcap, ₹2,500 ELSS. By 30: ₹15-20 lakh if consistent. By 40: ₹75 lakh+ = FIRE possible!`,
        imagePrompt: "Checklist of financial goals for students, modern infographic, purple and gold theme",
        color: "#8B5CF6",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "11-2",
    title: "\"What If\" Scenarios — Emergency Handling",
    emoji: "🆘",
    color: "#EF4444",
    description: "Life linear nahi hoti. 5 'what if' scenarios aur unka financial response.",
    cards: [
      {
        id: "11-2-1",
        topicId: "11-2",
        topicTitle: "What If Scenarios",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "5 Emergency Scenarios + Response",
        content: `Life linear nahi hoti. Yeh 5 "what if" scenarios aur unka financial response:

**1. Job Loss:**
- Emergency fund use karo (3-6 months survive ho jayega)
- UPI statement audit karo — subscriptions cancel karo
- Side income search karo (freelancing, tutoring)
- New job ke liye aggressively apply karo
- EMI ho toh bank se moratorium mango
- Credit card bill full pay karo minimum nahi
- Social media pe network karo — referrals se job milte hain

**2. Medical Emergency:**
- Health insurance cashless use karo
- Emergency fund se bridge karo (deductible/co-pay)
- Government hospital option explore karo (affordable)
- Mediclaim reimbursement file karo within 30 days
- Family ko inform karo — emotional + financial support
- Second opinion lo — unnecessary surgery se bacho

**3. Pandemic/Lockdown:**
- Emergency fund + savings pe chalo
- Non-essential expenses zero karo
- Work from home opportunities dhundho
- Skill upgrade karo (free courses — Coursera, NPTEL)
- SIP pause karo temporarily (but mat redeem karo)
- Government relief schemes check karo

**4. Inflation Spike:**
- SIP continue karo — market mein dip = discount buy karne ka mauka!
- FD rates badhenge — renewed FD pe zyada milega
- Expenses adjust karo — inflation zyada hota hai khane pe
- Side income badhao — passive income inflation-proof hoti hai
- Avoid new debt — high inflation + high interest = double hit

**5. Sudden Big Expense:**
- Emergency fund se repair karo
- Insurance claim file karo (comprehensive ho toh)
- Loan against FD lo (1-2% above FD rate, instant)
- Personal loan last resort — 14-24% interest expensive
- Family se interest-free loan (formal agreement likh ke)
- EMI option avoid karo agar possible ho — total cost zyada`,
        imagePrompt: "Five emergency scenario icons with response plan, red theme, crisis management illustration",
        color: "#EF4444",
        emoji: "🆘"
      },
      {
        id: "11-2-2",
        topicId: "11-2",
        topicTitle: "What If Scenarios",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "Emergency Preparedness + Mission",
        content: `**Emergency Preparedness Checklist:**

✅ **3-6 months emergency fund** — ready
✅ **Health insurance** — cashless network hospitals identified
✅ **Term plan** (agar dependents hain) — family protected
✅ **Vehicle insurance** — comprehensive
✅ **SIP running** — wealth building continues
✅ **Side income source** — backup ready
✅ **Skills updated** — employable in crisis
✅ **Network active** — LinkedIn, professional contacts

**Crisis Action Plan Template:**

| Emergency Type | First Action | Second Action | Backup Plan |
| :--- | :--- | :--- | :--- |
| Job Loss | Emergency fund use | Side income search | Bank moratorium |
| Medical | Insurance cashless | Emergency fund bridge | Government hospital |
| Pandemic | Cut non-essential | WFH search | Government schemes |
| Inflation | Continue SIP | Adjust expenses | Side income |
| Big Expense | Emergency fund | Insurance claim | Loan against FD |

**🚨 MISSION: Emergency Plan**

- [ ] Apna emergency fund status check karo (target 3-6 months expenses)
- [ ] Health insurance active hai? Cashless network hospitals list karo
- [ ] Term plan (agar dependents hain) — premium paid?
- [ ] Vehicle insurance current hai?
- [ ] 2 side income ideas identify karo (skills based)
- [ ] "Crisis contact list" banao — family, friends, financial advisor, bank helpline
- [ ] Important documents ka backup (cloud + physical)

**Rule**: Emergency kabhi nahi aayegi — yeh soch ke mat baitho. 90% logon ki life mein kisi na kisi emergency aati hai. Prepared raho, panic nahi.`,
        imagePrompt: "Emergency preparedness checklist with shield icon, red and gold theme, crisis readiness illustration",
        color: "#EF4444",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "11-3",
    title: "Financial Checklist by Life Stage",
    emoji: "📅",
    color: "#06B6D4",
    description: "Har age pe kuch financial milestones hone chahiye. 18 se 60 tak checklist.",
    cards: [
      {
        id: "11-3-1",
        topicId: "11-3",
        topicTitle: "Life Stage Checklist",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "Age 18-35 Financial Milestones",
        content: `Har age pe kuch financial milestones hone chahiye. Yeh checklist tumhe track rakhne mein madad karegi:

**Age 18 — Financial Awareness**
- ✅ Savings account kholo (zero balance student)
- ✅ Budget banao (pocket money se)
- ✅ Financial content padho (15 min/day)
- ✅ UPI apps use karo (digital payments)

**Age 21 — First Income + Investing Start**
- ✅ SIP ₹500-1,000 start karo (Nifty 50 Index Fund)
- ✅ Emergency fund building shuru (₹500/month)
- ✅ Health insurance lo (parents ke ya individual)
- ✅ KYC complete karo (PAN, Aadhaar)

**Age 25 — Stable Income + Tax Planning**
- ✅ 6 months emergency fund complete
- ✅ PPF account kholo (₹500-2,000/month)
- ✅ ITR file karo (har saal)
- ✅ Term plan consider karo (agar parents depend hain)
- ✅ Health insurance individual (₹5-10L cover)

**Age 30 — Wealth Building**
- ✅ ₹10,000+ SIP monthly
- ✅ Diversified portfolio (equity + debt + gold)
- ✅ Phase health + life insurance active
- ✅ Tax optimization (80C, 80D, 80CCD)
- ✅ NPS start karo (extra ₹50K deduction)
- ✅ Marriage/family planning financially

**Age 35 — Asset Accumulation**
- ✅ Home planning (if applicable)
- ✅ Retirement corpus check (target ₹25-50 lakh)
- ✅ Kids education fund start
- ✅ Portfolio rebalance (debt allocation increase)
- ✅ Term plan top-up (responsibilities badhi)
- ✅ Critical illness rider add`,
        imagePrompt: "Timeline from age 18 to 35 with financial milestones, cyan theme, life progression illustration",
        color: "#06B6D4",
        emoji: "📅"
      },
      {
        id: "11-3-2",
        topicId: "11-3",
        topicTitle: "Life Stage Checklist",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "Age 40-60 + Mission",
        content: `**Age 40 — FIRE Evaluation**
- ✅ Corpus check — 25x expenses?
- ✅ Side income = expenses?
- ✅ Semi-retirement possible?
- ✅ Debt-free (home loan ya toh clear ya manageable)
- ✅ Kids higher education fund ready
- ✅ Estate planning start (will, nominations)

**Age 50 — Pre-Retirement**
- ✅ Corpus 80% target reached?
- ✅ Debt free?
- ✅ Health insurance top-up (senior citizen plan)
- ✅ Passive income stable?
- ✅ Retirement date target
- ✅ Will created and registered

**Age 60 — Retirement**
- ✅ 4% withdrawal rule se income
- ✅ Corpus preservation
- ✅ Estate planning complete
- ✅ Medical top-up
- ✅ Senior citizen schemes (SCSS, PMVVY)
- ✅ Passive income + pension (NPS/EPF/PF)

**🚨 MISSION: Life Stage Audit**

- [ ] Apni current age identify karo
- [ ] Apne stage ke milestones checklist download karo
- [ ] Kitne milestones achieve kiye, kitne pending?
- [ ] 1 saal ke targets set karo (next stage ke liye)
- [ ] Annual review system banao (har January)

**Quick Audit Template:**

| Milestone | Target Age | My Status | Action Needed |
| :--- | :--- | :--- | :--- |
| Savings account | 18 | ✅ Done | — |
| First SIP | 21 | ✅ Done | — |
| Emergency fund (3-6 months) | 25 | 🔄 In progress | ₹X more needed |
| PPF account | 25 | ❌ Not started | Open this month |
| Term plan | 25-30 | ❌ Not started | Buy this year |
| Health insurance | 21 | ✅ Done | — |
| ITR filing | 22+ | ✅ Done | File every year |

**Rule**: Age-wise milestones miss mat karo. 25 pe emergency fund nahi = 30 pe struggle. 30 pe SIP start nahi = 60 pe struggle. Time waits for no one!`,
        imagePrompt: "Life stage timeline from 40 to 60 with retirement planning, cyan and gold theme, financial freedom illustration",
        color: "#06B6D4",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "11-4",
    title: "Indian Middle Class Financial Reality",
    emoji: "📊",
    color: "#F59E0B",
    description: "Indian middle class ke financial challenges aur opportunities. Reality check + positive approach.",
    cards: [
      {
        id: "11-4-1",
        topicId: "11-4",
        topicTitle: "Middle Class Reality",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "Indian Middle Class — Stats + Reality",
        content: `**Indian Middle Class Financial Reality — Stats:**

- 90% Indians ki monthly income ₹25,000 se kam hai
- Average household debt ₹5 lakh hai aur badh raha hai
- Household debt-to-GDP ratio 41-42% tak pahunch gaya hai (2015 mein 26% tha)
- Credit card usage 50% badh gaya hai 2022 se
- Average middle class family ka 35-50% income EMIs mein jaata hai
- Savings rate giri hai — 23% (2012) se 18% (2025)

**Lekin Acchi Khabar Yeh Hai:**
- India mein FIRE possible hai (adjusted approach se)
- Expenses kam hain compared to West
- Digital infrastructure (UPI, apps) financial access easy bana diya
- SIP ₹100 se start ho sakti hai
- Young age mein compound ka full benefit milta hai

**Challenges Hain, Impossible Nahi:**
Discipline aur awareness se middle class trap se nikal sakte hain.

**5 Ways to Break Middle Class Trap:**

1. **Start Early** — Compounding ka full benefit. 20 pe start = 30 pe 10x better
2. **Multiple Income Streams** — Job + side hustle + investments. 1 source = risk
3. **Disciplined Saving** — 20-30% savings rate maintain
4. **Smart Investing** — Equity SIP for long-term wealth, not just FD
5. **Avoid Lifestyle Inflation** — Salary badhi toh expenses proportionally mat badhao

**Middle Class Trap Examples:**

⚠️ **Trap 1**: "Shaadi ke liye ₹10 lakh loan" — 5 saal EMI burden
✅ **Solution**: Plan 5 years ahead, save ₹15,000/month SIP

⚠️ **Trap 2**: "₹30 lakh car on EMI for status" — ₹50,000/month EMI
✅ **Solution**: ₹5 lakh car + ₹25 lakh SIP = real wealth

⚠️ **Trap 3**: "Big house with ₹40 lakh loan" — 20 years EMI trap
✅ **Solution**: Start with small house, upgrade later when affordable

⚠️ **Trap 4**: "Gold jewellery for investment" — making charges 25% loss
✅ **Solution**: SGB (Sovereign Gold Bond) — govt backed + 2.5% interest

⚠️ **Trap 5**: "Education loan for Tier-3 college" — bad ROI
✅ **Solution**: ROI check karo, government college ya scholarship opt karo`,
        imagePrompt: "Indian middle class financial reality infographic with stats and solutions, amber theme, motivational financial illustration",
        color: "#F59E0B",
        emoji: "📊"
      },
      {
        id: "11-4-2",
        topicId: "11-4",
        topicTitle: "Middle Class Reality",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "Break The Trap + Mission",
        content: `**How to Break Middle Class Trap — 5-Step Plan:**

**Step 1: Awareness**
- Apni current financial situation honestly assess karo
- Income, expenses, savings, debt, investments list karo
- Weak areas identify karo

**Step 2: Education**
- Financial literacy seekho (this app, books, podcasts)
- 15 min/day financial content padho
- Real examples se seekho (Rich Dad Poor Dad, Psychology of Money)

**Step 3: Action — Start Small**
- ₹500/month SIP shuru karo
- ₹500/month emergency fund mein daalo
- Budget banao aur follow karo
- Insurance lo (health + term)

**Step 4: Scale Up**
- Income badhao (skills, side hustle, promotions)
- Savings rate gradually increase (20% → 30% → 50%)
- Multiple income streams build karo
- Long-term wealth building (SIP, PPF, NPS)

**Step 5: Stay Disciplined**
- Annual review system
- Lifestyle inflation control
- Avoid impulse purchases (48-hour rule)
- Stay invested (don't panic in market crash)

**🚨 MISSION: Middle Class Trap Break**

- [ ] Apni current financial situation list karo (income, expenses, savings, debt)
- [ ] "Trap" identify karo — kahan zyada spend kar rahe ho?
- [ ] 1 financial goal set karo (e.g., ₹1 lakh emergency fund in 12 months)
- [ ] SIP start karo (₹500-₹2,000/month)
- [ ] Side income idea explore karo
- [ ] Annual review date set karo (har January 1st)

**Reality Check**:
- ₹5,000/month SIP at 12% for 25 years = **₹95 lakh**
- ₹10,000/month SIP at 12% for 25 years = **₹1.9 crore**
- ₹15,000/month SIP at 12% for 25 years = **₹2.85 crore**

Yeh numbers middle class trap se nikal ke ameer banne ke math hain. Possible hai — sirf discipline chahiye!

**Rule**: "Yeh India hai, yahan aisa hi hota hai" — nahi! Discipline + awareness = escape possible. Apna journey apna hai, comparison mat karo.`,
        imagePrompt: "Person breaking free from middle class trap with growth chart, amber and gold theme, financial freedom illustration",
        color: "#F59E0B",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "11-5",
    title: "Financial Red Flags in Relationships",
    emoji: "❤️",
    color: "#EC4899",
    description: "Paise ki baat relationship mein important hai. 6 red flags dhyan se dekho.",
    cards: [
      {
        id: "11-5-1",
        topicId: "11-5",
        topicTitle: "Relationship Red Flags",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "6 Financial Red Flags in Relationships",
        content: `Paise ki baat relationship mein important hai, lekin bahut kam couples ispe baat karte hain. Yeh red flags dhyan se dekho:

**1. Refusal to Discuss Money**
Partner paiso ki baat karna avoid kare — financial transparency healthy relationship ka part hai. Shaadi se pehle financial compatibility check karo.

**2. Opposite Money Philosophies**
Ek save kare, dusra excess kare — bina compromise ke yeh conflict create karta hai. Pre-marriage financial discussion must.

**3. Secret Spending**
Bade purchases chhupake — yeh breach of trust hai, financial bhi emotional bhi. Joint account + personal account = balance.

**4. Unequal Contribution**
Ek partner sab bear kare bina agreement ke — resentment build hota hai. Clear split: 50-50 ya income proportional.

**5. Debt Disclosure Nahi Karna**
Marriage se pehle credit score, outstanding debts, financial commitments share karo. Hidden debt shared burden ban jata hai. CIBIL check ek dusre ka!

**6. Financial Control/Abuse**
Partner har expense approve kare, salary le le, "allowance" de — yeh abuse hai. Financial independence = non-negotiable.

**Pre-Marriage Financial Discussion Questions:**

1. Apni monthly income aur expenses share karo
2. Outstanding loans aur credit card debt disclose karo
3. Savings aur investments discuss karo
4. CIBIL score check karo ek dusre ka
5. Future financial goals set karo (house, kids, retirement)
6. "Joint account ya separate?" decide karo
7. Family responsibilities (parents support) discuss karo
8. Insurance coverage review karo
9. Investment strategy align karo
10. Emergency fund plan banao

**Healthy Financial Relationship Signs:**

✅ Open communication about money
✅ Shared financial goals
✅ Joint + personal accounts (balance)
✅ Equal contribution (income proportional)
✅ No financial secrets
✅ Mutual respect for spending decisions
✅ Regular financial date nights (monthly budget review)
✅ Support each other's financial independence`,
        imagePrompt: "Couple discussing finances with hearts and warning signs, pink theme, relationship finance illustration",
        color: "#EC4899",
        emoji: "❤️"
      },
      {
        id: "11-5-2",
        topicId: "11-5",
        topicTitle: "Relationship Red Flags",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "Financial Compatibility Test + Mission",
        content: `**Financial Compatibility Test (For Couples):**

**Before Marriage, Discuss These 10 Topics:**

1. **Income & Career Goals**: Apni income aur 5-year career plan share karo
2. **Debt**: Outstanding loans, credit card debt, EMI commitments
3. **Savings Rate**: Kitna % income save karte ho? Target kya hai?
4. **Investment Style**: Conservative/Moderate/Aggressive?
5. **Family Responsibilities**: Parents support karna hai? Kitna?
6. **Big Purchases**: House, car, wedding — kab aur kitna?
7. **Children Planning**: Kids kab? Education fund kaise?
8. **Insurance**: Health + life insurance coverage
9. **Retirement Plan**: FIRE target? Early retirement?
10. **Money Habits**: Impulse buyer ya planner? Kanjoos ya generous?

**Score Each Topic 1-5 (1 = Big Issue, 5 = Aligned):**

- 40-50: Great financial compatibility ✅
- 30-39: Workable, but discuss gaps 🔄
- 20-29: Major issues, counseling needed ⚠️
- Below 20: Serious reconsideration ❌

**🚨 MISSION: Financial Discussion**

**For Couples (married/in relationship):**
- [ ] Monthly "financial date night" schedule karo
- [ ] Budget review together karo
- [ ] Joint goals set karo (house, vacation, retirement)
- [ ] CIBIL scores share karo (transparency)
- [ ] Insurance coverage review karo

**For Singles:**
- [ ] Apni financial values clear karo (saver/spender, risk tolerance)
- [ ] Future partner ke financial criteria list banao
- [ ] Pre-marriage financial discussion plan karo
- [ ] Financial independence pehle seekho (then share life)

**Rule**: Financial incompatibility #1 reason for relationship stress. Pre-marriage CIBIL check = practical. Transparent communication = strong foundation.

**Pro Tip**: Joint account for shared expenses (rent, groceries, utilities) + personal accounts for individual spending = best balance. Both partners contribute proportionally to joint account.`,
        imagePrompt: "Couple doing financial planning together with hearts and checkmarks, pink and gold theme, healthy relationship finance illustration",
        color: "#EC4899",
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

Tum join karte ho aur woh bolte hain — *"Pehle ₹2,000 deposit karein security ke liye."*

**India mein digital fraud rapidly badh raha hai — FY 2024-25 mein ₹4,245 crore ka fraud hua 24 lakh incidents mein (67% increase YoY).** Students especially vulnerable hain kyunki woh digital savvy hain lekin financially inexperienced.

**10 Common Scams Targeting Students:**

| # | Scam Type | How It Works | Warning Sign |
| :--- | :--- | :--- | :--- |
| 1 | UPI Collect Request | Fraudster payment request bhejta hai, victim approve kar deta hai | Unknown payment requests — hamesha verify karo |
| 2 | Part-Time Job Scam | WhatsApp pe "₹5,000/day from home" — pehle deposit, phir fraud | Job ke liye paise dena = scam |
| 3 | Phishing Links | Fake bank SMS/email — credentials churaate hain | URL misspelling, https lock missing |
| 4 | KYC Verification Call | Bank/RBI officer banke OTP maangte hain | Banks NEVER OTP maangte calls pe |
| 5 | QR Code Scam | "Scan QR to receive money" — actually paisa jaata hai | QR scan = PAYING, not receiving |
| 6 | Screen Sharing Apps | AnyDesk/TeamViewer install karake phone control | No bank needs remote access |
| 7 | Fake Internship | Registration fee for guaranteed placement | Real companies don't charge for internships |
| 8 | Parcel/Customs Scam | "Parcel with drugs held, pay fine via UPI" | Customs never demands UPI payment |
| 9 | Investment Tip Groups | WhatsApp groups promising 200-500% returns | Guaranteed high returns = scam |
| 10 | Scholarship Refund | "Your scholarship ready, pay ₹500 processing" | Real scholarships don't need processing fees |`,
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
        content: `OlX pe tumne cycle bechi. Buyer bolta hai — *"Bhai, main QR bhej raha hoon, scan karo paise receive karne ke liye."*

**Myth**: QR Code scan karne se bank account mein paise aate hain.
**Sach**: Bhai, QR scan karne se hamesha paise JAATE hain. Paise receive karne ke liye kabhi QR scan ya PIN daalne ki zaroorat nahi hoti!

**QR Code Scam Reality:**
- Fraudster bhejta hai QR code
- Tum scan karte ho, PIN daalte ho
- Paise tumhare account se jaate hain (receive nahi hote)
- "Scan to receive" = 100% SCAM

**Fraud Report Karna:**
- **Cybercrime helpline: 1930**
- **Website: cybercrime.gov.in**
- Bank ko turant call karo — freeze account
- 3 din ke andar report karo = maximum protection

**5 Safety Rules That Prevent 90% of Frauds:**

1. **OTP share nahi karna** — kisi ko bhi, kisi bhi haal mein
2. **QR scan to receive money = scam**. QR scan = you pay
3. **Unknown UPI requests reject karo** immediately
4. **Koi bhi app install karne ko bole remote access ke liye** = scam
5. **"Guaranteed high returns"** = 100% scam. No exceptions

**Red Flags for Investment Scams:**

⚠️ "Guaranteed 20% return" — koi guarantee nahi stock market mein
⚠️ "Limited time offer" — urgency create karke pressure
⚠️ "Refer and earn" — pyramid scheme
⚠️ "Send ₹10K, get ₹20K back" — Ponzi scheme
⚠️ "WhatsApp/Telegram investment group" — fake tips
⚠️ "SEBI registered" claim — verify on SEBI website`,
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
        content: `🚨 **TODAY'S MISSION — Cyber Security Checklist**

In 5 rules ko kabhi mat bhulna:

- [ ] OTP kisi se share nahi karna (Not even Bank).
- [ ] QR scan = You pay. Receive ke liye QR nahi chahiye.
- [ ] Unknown links pe click mat karo.
- [ ] 'AnyDesk' ya 'TeamViewer' kisi stranger ke kehne pe download mat karo.
- [ ] 1930 — Yeh Cyber Crime helpline number save kar lo.

**Additional Safety Measures:**

- [ ] Phone pe screen lock lagao (PIN/pattern/fingerprint)
- [ ] Banking app use ke baad logout karo
- [ ] Strong password (12+ characters, mix of all)
- [ ] 2-factor authentication on (SMS OTP + app notification)
- [ ] UPI PIN 3 months mein change karo
- [ ] SIM swap alert: Network suddenly gayab = call customer care
- [ ] Bank ka official number save karo (card pe likha)
- [ ] Cyber crime helpline 1930 save karo
- [ ] cybercrime.gov.in bookmark karo

**What to Do If Scammed:**

1. **Immediately**: Bank ko call karo — account freeze
2. **Within 3 days**: 1930 helpline pe report karo
3. **Online**: cybercrime.gov.in pe complaint file karo
4. **Police**: Local cyber crime cell mein FIR file karo
5. **Evidence**: Screenshots, transaction IDs, chat history save karo

**Recovery Chance**: 
- 3 days ke andar report = highest recovery chance
- 3-7 days = medium chance
- 7+ days = low chance

**Rule**: Scam hone ke baad sharm mat karo. Report karo. Yeh sabke saath ho sakta hai. Awareness se prevention possible hai.`,
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
    description: "Paisa sirf math nahi, psychology hai. Morgan Housel ke 5 lessons jo har student ko samajhne chahiye.",
    cards: [
      {
        id: "11-7-1",
        topicId: "11-7",
        topicTitle: "Psychology of Money",
        cardIndex: 1,
        totalCardsInTopic: 3,
        title: "Wealth Is What You Don't See 🕵️‍♂️",
        content: `Flashy car, iPhone, branded kapde — yeh 'Expenditure' hai, 'Wealth' nahi.

Real wealth woh hai jo tumne invest kiya aur kharcha nahi.

**Morgan Housel ki book "The Psychology of Money" ke 5 sabse important lessons:**

**Lesson 1: No One's Crazy**
Paise ka logic nahi, psychology hai. Log financially galat decisions lete hain kyunki unka emotional experience alag hota hai. Jo aapke liye bewakoofi lagta hai, dusre ke liye perfectly logical ho sakta hai — kyunki unki life story alag hai. Isliye kisi ki financial choice judge mat karo, samjho.

**Indian context**: Papa FD kyun karte hain? Kyunki unhone 1992 Harshad Mehta scam dekha hai. Unke liye safety = survival.

**Lesson 2: Wealth Is What You Don't See**
Wealth woh hai jo dikhta NAHI. Car, phone, clothes — yeh expenditure hai, wealth nahi. Real wealth = jo paisa aapne invest kiya aur nahi kharcha. Flashy lifestyle wale log ameer dikhte hain, lekin actually broke ho sakte hain. Simple living wale actually wealthy ho sakte hain.

**Indian context**: Neighbour ka ₹30 lakh car = ₹35 lakh loan. Tumhara ₹5 lakh car + ₹25 lakh SIP = real wealth. Instagram pe sab rich dikhte hain — reality: EMI pe hain.

**Priya**: Bhaiya, mera dost nayi car laya, woh toh wealthy hoga na?

**Bhaiya**: Shayad woh ameer 'dikh' raha hai, par \`₹15k\` EMI bhar raha hai. Wealthy woh hai jisne chupchap \`₹15k\` SIP mein daale.

**Priya**: Matlab ameer dikhne aur ameer hone mein farq hai?

**Bhaiya**: Zameen-aasmaan ka! Wealthy bano, ameer mat dikho.`,
        imagePrompt: "Side by side comparison of a person with expensive stuff but debt vs a simple person with massive investments, green and gold theme",
        color: "#10B981",
        emoji: "🕵️‍♂️",
        interactiveType: 'none'
      },
      {
        id: "11-7-2",
        topicId: "11-7",
        topicTitle: "Psychology of Money",
        cardIndex: 2,
        totalCardsInTopic: 3,
        title: "Time vs Money ⏳",
        content: `**Lesson 3: Time Is the Most Powerful Force**

Sabse powerful financial force time hai, aur compounding isi ka result hai. \`₹1,000\`/mahine at 12% for 40 years = \`₹1.18 crore\` — sirf \`₹4.8 lakh\` invest kiya, baaki \`₹1.13 crore\` COMPOUNDING ne kamaya. Late start = compounding ka benefit lost.

**Warren Buffett ki 90% wealth 65 saal ki umr ke BAAD aayi** — compounding ka power.

**Indian context**: 20 pe SIP shuru karo, 60 pe crorepati. 40 pe shuru karo, 60 pe lakhpati.

Compounding ka sabse bada factor 'Amount' nahi, 'Time' hai.

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
        title: "🚨 FINAL MISSION: Graduation! 🎓",
        content: `**Lesson 4: Money Buys Freedom**

Paisa aane se zyada important hai — bachne ka RAUM hai. Emergency fund = hospital jaane ki azaadi, toxic boss chhodne ki azaadi, bad job se nikalne ki azaadi.

₹3 lakh emergency fund = 6 months ki FREEDOM. Yeh wealth nahi, freedom hai.

**Indian context**: Job chhodke startup try karna? Emergency fund chahiye. Parents ke pressure mein shaadi nahi karni? Financial independence chahiye. Paisa = choices.

**Lesson 5: Plan for Survival, Not Just Success**

Survival ka matlab hai — har financial plan mein "what if things go wrong" incorporate karo. Optimist bano lekin realistic bano. Emergency fund rakhna, insurance lena, diversification karna — yeh sab survival strategies hain.

"Hope for the best, plan for the worst" — yeh niti aapko debt trap se bachayegi.

**Indian context**: 2008 recession, 2020 pandemic, 2024 layoffs — jinke paas emergency fund + insurance + diversified income tha, woh survive kiye. Bina = disaster.

---

🚨 **FINAL MISSION — GRADUATION!**

Badhai ho! Tumne Rupaiya 101 complete kar liya hai.

- [ ] Module 1 to 11 ki main seekh ek notebook mein likho.
- [ ] Aaj hi pehla SIP (\`₹100\` bhi chalega) start karo.
- [ ] Yeh app apne 3 doston ke saath share karo.
- [ ] Future plan: FIRE (Financial Independence) ka target set karo.

---

**KEY TAKEAWAYS (Module 11):**
- ✅ 4 case studies dikhate hain — ₹5,000 se ₹50,000 tak, har level pe financial plan possible hai
- ✅ Emergency scenarios ka response ready rakhna — job loss, medical, pandemic ke liye plan B hona chahiye
- ✅ Age 18 se 60 tak ki checklist follow karo — har decade ka apna financial priority hai
- ✅ 10 common scams se bacho — OTP share nahi karna, QR scan se paisa nahi milta, high returns = scam
- ✅ Psychology of Money ka core: Paisa freedom khareedta hai, stuff nahi. Wealth woh hai jo dikhta nahi

**COMMON MISCONCEPTIONS (Module 11):**

⚠️ "Mera income kam hai, planning kya karna" → Galat! ₹5,000 pe bhi budget + saving plan banao
⚠️ "Scams sirf uneducated logon ke saath hote hain" → Galat! UPI fraud, phishing — educated log zyada target
⚠️ "Financial planning sirf bade logon ke liye hai" → Galat! Jaldi start = compounding ka maximum benefit
⚠️ "Partner se paise ki baat karne se relationship kharab hota hai" → Galat! Transparency trust badhati hai
⚠️ "Emergency kabhi nahi aayegi" → Galat! 90% logon ki life mein kisi na kisi emergency aati hai

**AAGE KA SAFAR**:
Pura course complete ho gaya! 11 modules — paise ki basic samajh se lekar real-world scenarios tak. Ab action lo: Module 1 se ek cheez aaj implement karo — budget banao, saving shuru karo, SIP start karo, insurance lo.

**Knowledge without action = zero value.** Shuru karo — aaj, abhi! 🚀

Badhai ho! 🏆 Tum ab financial literate ho. Ab responsibility tumhari hai — apni financial future build karo, apne doston ko educate karo, aur financial freedom ka safar shuru karo!

**Rupaiya 101 — Complete!** 🎓`,
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
