export const module10Topics = [
  {
    id: "10-1",
    title: "Tax Basics — Sarkar Ka Chanda 💸",
    emoji: "💸",
    color: "#10B981",
    description: "Tax boring ho sakta hai, par use samajhna apke hazaron rupaye bacha sakta hai. Samjho Tax ka asli game!",
    cards: [
      {
        id: "10-1-1",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 1,
        totalCardsInTopic: 6,
        title: "Old vs New Regime: Kaunsa Best? 🏛️",
        content: `Sarkar ne do raste diye hain tax bharne ke. Tumhe kaunsa suit karega?

| Feature | Old Regime | New Regime |
| :--- | :--- | :--- |
| **Tax Rates** | High 📈 | Low 📉 |
| **Deductions** | 80C, HRA, etc ✅ | No Deductions ❌ |
| **87A Rebate** | Up to ₹5 Lakh | Up to ₹7 Lakh |
| **Standard Deduction** | ₹50,000 | ₹50,000 |

**Income Tax Slabs Comparison:**

| Income Range | Old Regime | New Regime |
| :--- | :--- | :--- |
| ₹0 - ₹2,50,000 | 0% | 0% |
| ₹2,50,001 - ₹3,00,000 | 5% | 0% |
| ₹3,00,001 - ₹5,00,000 | 5% | 5% |
| ₹5,00,001 - ₹7,00,000 | 20% | 10% |
| ₹7,00,001 - ₹10,00,000 | 20% | 15% |
| ₹10,00,001 - ₹12,00,000 | 30% | 20% |
| ₹12,00,001 - ₹15,00,000 | 30% | 25% |
| Above ₹15,00,000 | 30% | 30% |

**Important**: ₹5 lakh tak income pe Section 87A rebate se tax zero ho jata hai (new regime mein ₹7 lakh tak). Student ki salary ₹25,000/month = ₹3 lakh/year = effectively zero tax. Lekin ITR file zaroor karo!

**Rule**: Agar tum SIP (ELSS) ya PPF mein invest karte ho, toh **Old Regime** usually better hai!`,
        imagePrompt: "Two roads diverging with signs 'Old Regime' and 'New Regime', green landscape, professional financial infographic style",
        color: "#10B981",
        emoji: "📊",
        interactiveType: 'none'
      },
      {
        id: "10-1-2",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 2,
        totalCardsInTopic: 6,
        title: "Tax Calculator: Kitna Katega? 🧮",
        content: `Bhai, agar tumhari saal ki income \`₹7 Lakh\` se kam hai (New Regime), toh tumhara tax **ZERO** hai!

Chalo dekhte hain tumhari expected salary pe kitna tax banega:`,
        imagePrompt: "Calculator with a happy emoji on screen, green background, Rupee symbols floating around, modern 3D illustration",
        color: "#10B981",
        emoji: "🧮",
        interactiveType: 'calculator',
        calcData: {
          calcType: 'tax',
          formula: 'none',
          inputs: [
            { label: 'Annual Income', min: 200000, max: 2000000, defaultValue: 600000, step: 50000, unit: '₹' }
          ]
        }
      },
      {
        id: "10-1-3",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 3,
        totalCardsInTopic: 6,
        title: "Chat: ITR Kyun Bharein? 📱",
        content: `Priya aur Bhaiya discuss kar rahe hain ITR (Income Tax Return) filing.

**Priya**: Bhaiya, meri income toh ₹3 lakh hi hai, tax zero hai. Phir bhi ITR bharun?

**Bhaiya**: Bilkul! ITR sirf tax ke liye nahi, 'Income Proof' ke liye hai. Loan ya Visa chahiye ho toh bank ITR hi maangta hai.

**Priya**: Oh! Aur agar bank ne TDS kaat liya toh?

**Bhaiya**: ITR bharo aur woh TDS wapas lo! Refund seedha tumhare account mein aayega.

**4 Reasons to File ITR Even with Zero Tax:**

1. **Tax refund claim karne ke liye** — agar TDS cut hua hai aur income taxable nahi, toh refund milega. ₹2,00,00 TDS = ₹2,000 refund.

2. **Loan approval ke liye** — bank ITR dekhti hai. Home loan, car loan, personal loan — ITR = income proof.

3. **Visa ke liye** — foreign travel mein ITR proof chahiye. US, UK, Schengen — sab ITR maangte hain.

4. **Financial record ke liye** — official income history. Future mein business start karna ho toh ITR useful.`,
        imagePrompt: "Two people looking at a laptop screen with a government seal, green and gold theme, official yet friendly atmosphere",
        color: "#10B981",
        emoji: "💬",
        interactiveType: 'none'
      },
      {
        id: "10-1-4",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 4,
        totalCardsInTopic: 6,
        title: "Myth-Buster: Tax Savings 🕵️‍♂️",
        content: `Log sochte hain ki tax bachaana sirf 'Rich' logon ka kaam hai.

**Myth**: Students ko tax planning ki koi zaroorat nahi hoti.
**Sach**: Tax planning ek habit hai. Agar tum abhi se Section 80C (SIP/PPF) aur 80E (Education Loan Interest) samajh lo, toh job lagte hi pehle din se hazaron bacha paoge!`,
        imagePrompt: "Person hiding coins behind a shield labeled '80C', green background, conceptual financial illustration",
        color: "#10B981",
        emoji: "🕵️‍♂️",
        interactiveType: 'myth_buster',
        quizData: {
          question: "MYTH: Students ko tax planning ki koi zaroorat nahi hoti.",
          options: ["Sahi hai, salary aane do pehle!", "Galat, abhi se seekho!"],
          correctAnswerIndex: 1,
          explanation: "Tax planning ek habit hai. Agar tum abhi se Section 80C (SIP/PPF) aur 80E (Education Loan Interest) samajh lo, toh job lagte hi pehle din se hazaron bacha paoge!"
        }
      },
      {
        id: "10-1-5",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 5,
        totalCardsInTopic: 6,
        title: "Dilemma: Deduction ya Low Rate? 🤔",
        content: `Tumhari job lag gayi hai, salary \`₹8 Lakh\` hai. Tumhare paas do options hain. Kya chunoge?`,
        imagePrompt: "Person weighing a small piggy bank vs a percentage symbol, green and white colors, decision making concept",
        color: "#10B981",
        emoji: "🤔",
        interactiveType: 'choice_sim',
        choiceData: {
          scenario: "Salary ₹8 Lakh. Kaunsa rasta loge?",
          choices: [
            {
              text: "New Regime (Low rate, no investment)",
              isCorrect: true,
              consequence: "Simple! Tax kam lagega aur investment ki tension nahi. Par wealth build nahi hogi."
            },
            {
              text: "Old Regime (Invest ₹1.5L in ELSS)",
              isCorrect: true,
              consequence: "Smart! Tax toh utna hi lagega, par tumne ₹1.5 Lakh ki savings bhi kar li jo long term mein grow hogi. Double win!"
            }
          ]
        }
      },
      {
        id: "10-1-6",
        topicId: "10-1",
        topicTitle: "Tax Basics",
        cardIndex: 6,
        totalCardsInTopic: 6,
        title: "🚨 MISSION: PAN Check",
        content: `🚨 **TODAY'S MISSION**

Bhai, Tax ki duniya mein entry ke liye 'PAN Card' must hai.

- [ ] Check karo ki kya tumhare paas asli PAN Card hai?
- [ ] Agar nahi hai, toh NSDL website pe jaakar apply karo (approx ₹100 lagte hain).
- [ ] Agar hai, toh dekho ki kya woh Aadhaar se linked hai?
- [ ] 'Income Tax Portal' pe register karke login karke dekho.

**Quick Action Items:**
- PAN card apply: NSDL/UTIITSL website
- Aadhaar-PAN link: incometax.gov.in pe
- Income Tax Portal registration
- Form 26AS check (TDS details)
- AIS (Annual Information Statement) check`,
        imagePrompt: "Close up of a PAN card with a magnifying glass over the name, green checkmark icon, professional and secure vibe",
        color: "#10B981",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "10-2",
    title: "Important Tax Sections — 80C, 80CCD, 80TTA, 80GG, 80E",
    emoji: "📋",
    color: "#06B6D4",
    description: "Tax savings ke liye government ne kuch sections diye — students ke liye relevant sab sections with examples.",
    cards: [
      {
        id: "10-2-1",
        topicId: "10-2",
        topicTitle: "Tax Sections",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "5 Important Tax Sections with Examples",
        content: `**Tax Savings Ke Liye 5 Important Sections for Students:**

**Section 80C** — Investment pe ₹1.5 lakh tak tax deduction
- ELSS (SIP), PPF, FD (5-year), NSC, insurance premium — sab isme aate hain
- Example: ₹3 lakh taxable income, ₹1.5 lakh ELSS invest = taxable income ₹1.5 lakh = zero tax! (Old regime mein)

**Section 80CCD** — NPS mein additional ₹50,000 deduction
- Agar long-term retirement planning kar rahe ho, NPS + 80CCD = extra tax save
- Total 80C + 80CCD = ₹2 lakh deduction

**Section 80TTA** — Savings account interest pe ₹10,000 tak deduction
- FD interest pe senior citizens ke liye ₹50,000 (80TTB)
- Student ke liye savings interest chhota lekin useful deduction
- Example: Savings account mein ₹15,000 interest aaya. 80TTA se ₹10,000 exempt. Taxable interest = ₹5,000 only

**Section 80GG** — Rent pe rahte ho aur HRA nahi milta? ₹60,000/year tak deduction
- PG/Hostel rent bhi cover hota hai
- Form 10BA fill karna padta hai
- Example: ₹5,000/month rent = ₹60,000/year. 80GG se ₹60,000 deduction. Taxable income kam

**Section 80E** — Education loan ke interest pe deduction — koi limit nahi!
- 8 saal tak claim kar sakte hain
- Jab EMI start ho, interest portion ka deduction lo
- Example: ₹8 lakh education loan at 9%. First year interest = ₹72,000. 80E se full ₹72,000 deductible. Taxable income directly ₹72,000 kam

**Total Potential Deductions Summary:**

| Section | Maximum Deduction | What Qualifies |
| :--- | :--- | :--- |
| 80C | ₹1,50,000 | ELSS, PPF, FD, NSC, Insurance |
| 80CCD | ₹50,000 | NPS (extra) |
| 80TTA | ₹10,000 | Savings account interest |
| 80GG | ₹6,000 | Rent (if no HRA) |
| 80E | No limit | Education loan interest |
| 80D | ₹25,000 | Health insurance premium |
| **Total** | **₹2,95,000+** | Multiple sections combined |`,
        imagePrompt: "Five tax sections illustrated as icons with money-saving theme, cyan and gold theme, financial infographic",
        color: "#06B6D4",
        emoji: "📋"
      },
      {
        id: "10-2-2",
        topicId: "10-2",
        topicTitle: "Tax Sections",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "Calculator Example + Mission",
        content: `**Calculator Example with ₹6 Lakh Salary:**

**Old Regime:**
- ₹6,00,000 - ₹50,000 (standard deduction) - ₹1,50,000 (80C ELSS) - ₹25,000 (80D health insurance) = ₹3,75,000 taxable
- Tax = ₹6,250
- 87A rebate = ₹6,250
- **Final Tax = ZERO!**

**New Regime:**
- ₹6,00,000 - ₹50,000 = ₹5,50,000 taxable
- Tax = ₹22,500
- 87A rebate (up to ₹7L) = ₹22,500
- **Final Tax = ZERO!**

Dono mein zero tax. Lekin agar 80C mein ₹1.5 lakh invest kiya → Old regime mein habit bani + wealth create. New regime mein no investment = no wealth.

**Decision Flowchart:**

\`\`\`
Kya 80C mein invest kar rahe ho?
    ↓ YES → Old Regime (deductions + lower taxable income)
    ↓ NO → Kya income ₹7L se kam hai?
              ↓ YES → New Regime (lower rates, no deductions needed)
              ↓ NO → Calculate both, jo kam tax de wo lo
\`\`\`

Calculator: incometax.gov.in pe free calculator available. Dono compare karo.

**🚨 MISSION: Tax Section Plan**

- [ ] Apni current situation analyze karo — kya 80C, 80D, 80E applicable hai?
- [ ] Agar education loan hai → 80E claim karo (full interest)
- [ ] Agar rent pe rehte ho → 80GG claim karo (₹60,000)
- [ ] Health insurance premium → 80D claim karo (₹25,000)
- [ ] SIP/PPF investment → 80C claim karo (₹1,50,000)
- [ ] Savings interest → 80TTA claim karo (₹10,000)
- [ ] Old vs New regime — calculate both, choose better

**Pro Tip**: Tax planning April se shuru karo, March mein nahi. SIP se monthly tax planning karo, ek saath ₹1.5 lakh daalne ki tension nahi.`,
        imagePrompt: "Tax calculation flowchart with both regimes compared, cyan theme, financial decision illustration",
        color: "#06B6D4",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "10-3",
    title: "Form 16 + ITR Filing — Complete Process",
    emoji: "📝",
    color: "#8B5CF6",
    description: "Form 16 kya hai, kaise padhein. ITR filing 7-step process. ITR-1 vs ITR-2 vs ITR-3.",
    cards: [
      {
        id: "10-3-1",
        topicId: "10-3",
        topicTitle: "Form 16 + ITR",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "Form 16 Kaise Padhein",
        content: `**Form 16 Kya Hai?**
Form 16 woh document hai jo aapka employer deta hai jo batata hai ki saal bhar mein aapki kitni salary thi, kitna TDS cut hua, aur kitna tax aapne pay kiya. Yeh ITR file karne ke liye zaroori hai.

**Form 16 Ke 2 Parts:**
- **Part A**: Employer ki details aur TDS info. TAN number, PAN, total TDS deposited.
- **Part B**: Salary breakdown, deductions, aur tax calculation. Basic, HRA, LTA, deductions (80C, 80D), taxable income, tax payable.

**Kaise Padhein:**

1. **Gross salary check karo** — yeh aapki total income
2. **Exemptions dekho** — HRA, LTA, standard deduction (₹50,000)
3. **Deductions verify karo** — 80C, 80D, 80E jo aapne claim kiye
4. **Taxable income = Gross - Exemptions - Deductions**
5. **Tax calculated** = final tax liability
6. **TDS** = tax already paid. Agar TDS > tax liability = refund. Agar TDS < tax = tax payable.

Job lagne ke baad April-June mein employer se Form 16 mango — yeh aapka right hai. Form 16 padhna seekho — usme likha hai ki sarkar ne aapka paisa kahan lagaya aur kitne deductions claim kiye.

**ITR-1 vs ITR-2 vs ITR-3:**

| Form | For Whom | Income Sources |
| :--- | :--- | :--- |
| **ITR-1 (Sahaj)** | Most students/freshers | Salary + one house property + other sources (interest) |
| **ITR-2** | Capital gains earners | SIP, stocks, multiple house property |
| **ITR-3** | Business/profession | Freelancers, business owners |
| **ITR-4 (Sugam)** | Presumptive income | Freelancers with 44ADA |`,
        imagePrompt: "Form 16 document with sections highlighted, purple theme, official document illustration",
        color: "#8B5CF6",
        emoji: "📝"
      },
      {
        id: "10-3-2",
        topicId: "10-3",
        topicTitle: "Form 16 + ITR",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "ITR Filing 7 Steps + Mission",
        content: `**ITR Filing Process — 7 Steps:**

**Step 1**: Go to incometax.gov.in (official website)
**Step 2**: Register with PAN (already registered hoga agar pehle kiya hai)
**Step 3**: Select ITR-1 (for salary income) ya ITR-2 (for capital gains)
**Step 4**: Fill income details from Form 16
**Step 5**: Claim deductions under 80C, 80D, 80E etc.
**Step 6**: Verify tax calculation — payable ya refund
**Step 7**: Verify with Aadhaar OTP ya digital signature. Submit!

**Free hai — kisi CA ki zaroorat nahi simple salary walo ko.** Time: 15-30 minutes.

**Deadline**: July 31 of every year (for previous financial year). Late filing = ₹1,000-₹5,000 penalty.

**Common ITR Mistakes:**
1. Wrong ITR form select karna
2. TDS mismatch — Form 16 vs Form 26AS
3. Deductions overclaim karna — fake 80C receipts
4. Bank interest declare nahi karna — AI se pakde jaoge
5. Verify nahi karna — ITR file hua hi nahi!

**🚨 MISSION: ITR Filing Practice**

- [ ] Income Tax Portal pe register karo (incometax.gov.in)
- [ ] PAN link Aadhaar se (mandatory)
- [ ] Form 26AS download karo (TDS details)
- [ ] AIS (Annual Information Statement) check karo
- [ ] ITR-1 form download karo aur practice se bharo
- [ ] Last date July 31 calendar mein mark karo
- [ ] Auto-debit set karo tax payment ke liye (agar tax payable)

**For Students:**
- Income ₹2.5L (old) / ₹3L (new) se kam = zero tax
- Phir bhi ITR file karo (refund + loan/visa proof)
- Freelance income? → ITR-3 ya ITR-4 (44ADA)
- SIP returns? → ITR-2 (capital gains)

**Rule**: ITR filing 15 minute ka kaam hai. Online free. CA ki zaroorat nahi simple cases mein. Lekin freelancer/business owner ho toh CA consult karo.`,
        imagePrompt: "ITR filing process on laptop with government portal, purple theme, official process illustration",
        color: "#8B5CF6",
        emoji: "🎯"
      }
    ]
  },
  {
    id: "10-4",
    title: "Student-Specific Tax Situations + TDS",
    emoji: "🎓",
    color: "#F59E0B",
    description: "FD interest, SIP returns, freelance income, stipend tax. TDS kya hai, kaise check karein.",
    cards: [
      {
        id: "10-4-1",
        topicId: "10-4",
        topicTitle: "Student Tax Situations",
        cardIndex: 1,
        totalCardsInTopic: 2,
        title: "5 Student-Specific Tax Situations",
        content: `**5 Student-Specific Tax Situations:**

**1. FD Interest Tax**:
- FD pe jo interest milta hai, uspe TDS 10% cut hota hai (₹40,000/year se zyada hone pe)
- Agar total income taxable nahi hai, toh Form 15G submit karo — TDS nahi katega
- Example: ₹50,000 FD interest. Bank ₹5,000 TDS cut kar degi. Form 15G submit kiya → TDS zero. Refund bhi nahi chahiye.

**2. SIP Returns Tax**:
- Equity fund 1 saal se zyada hold pe Long Term Capital Gain (LTCG) ₹1.25 lakh tak tax-free. Usse zyada pe 12.5% tax.
- Debt fund pe aapki slab rate pe tax. Short-term (3 years) = slab rate. Long-term = 20% with indexation.
- Example: ₹2 lakh LTCG equity. ₹1.25 lakh exempt. ₹75,000 pe 12.5% = ₹9,375 tax.

**3. Freelance Income Tax**:
- Freelance income bhi taxable hai! ₹2.5L+ pe tax
- 44ADA ke under 50% presumptive deduction available hai
- Matlab ₹6 lakh income declare karo, 50% = ₹3 lakh automatic deduction. Taxable = ₹3 lakh. No receipts needed!
- Example: Freelance income ₹8 lakh. 44ADA: 50% deduction = ₹4 lakh. Taxable = ₹4 lakh. Tax = ₹7,500 (new regime).

**4. Stipend Tax**:
- Stipend taxable hai (salary ke under)
- Scholarship tax-free hai (Section 10(16))
- PhD stipend = taxable (if it's employment)
- Government scholarship = tax-free
- Verify karo: Stipend = services ke badle? Taxable. Scholarship = merit/need based? Tax-free.

**5. Crypto Tax (if applicable)**:
- 30% tax on gains + 1% TDS
- No set-off against other income
- Example: ₹1 lakh crypto profit. Tax = ₹30,000. Plus 1% TDS on transaction.`,
        imagePrompt: "Five student tax situations illustrated with icons, amber theme, financial education infographic",
        color: "#F59E0B",
        emoji: "🎓"
      },
      {
        id: "10-4-2",
        topicId: "10-4",
        topicTitle: "Student Tax Situations",
        cardIndex: 2,
        totalCardsInTopic: 2,
        title: "TDS Detail + Tax-Saving Investments + Mission",
        content: `**TDS (Tax Deducted at Source) Kya Hai?**

TDS ka matlab hai — paisa aane se pehle hi tax cut ho jata hai. Jaise FD interest ₹50,000 hai, toh bank ₹5,000 TDS cut kar degi, aapko ₹45,000 milega. Yeh advance tax hai — sarkar ko paise baad mein nahi, abhi chahiye.

**TDS Check Karne Ke Liye:**
- **Form 26AS**: incometax.gov.in pe — yeh sab TDS details dikhata hai. Har quarter update hota hai.
- **AIS (Annual Information Statement)**: Naya system — detailed income breakdown. Banks, employers, mutual funds sab report karte hain.

Agar zyada TDS cut hua hai, toh ITR file karo aur refund lo! Refund 3-6 months mein bank account mein aata hai.

**Common TDS Scenarios:**
- FD interest: 10% TDS above ₹40,000
- Freelance: Client 10% TDS cut karta hai above ₹30,000/transaction
- Rent: Tenant 5% TDS above ₹50,000/month

**Tax-Saving Investments Comparison:**

| Investment | 80C Limit | Lock-in | Return | Risk | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ELSS** | ₹1.5L | 3 years | 12-15% | Medium | Best returns, tax saving |
| **PPF** | ₹1.5L | 15 years | 7.1% (guaranteed) | Zero | Long-term safe savings, EEE |
| **NPS** | ₹1.5L + ₹50K extra | Till 60 | 9-12% | Low-Medium | Retirement planning + extra ₹50K |
| **5-Year Tax FD** | ₹1.5L | 5 years | 6.5-7.5% | Zero | Conservative |
| **NSC** | ₹1.5L | 5 years | 7.7% | Zero | Safe, compounded annually |
| **Sukanya Samriddhi** | ₹1.5L | 21 years | 8.2% | Zero | Girl child (under 10), highest small saving rate |

**Recommendation for Students:**
1. **ELSS** ₹500-₹1,000/month — 3-year lock-in, best returns, tax saving. Start karo.
2. **PPF** ₹500/year minimum — 15-year lock-in, long-term base. Open karo, minimum daalo.
3. **NPS** optional — Job pe ho toh employer contribution free money.
4. **5-year FD** — Conservative, safe. Lekin returns kam, inflation barely beat.

---

**🚨 MISSION: Tax-Saving Investment Plan**

- [ ] Apna 80C limit calculate karo (₹1.5L)
- [ ] ELSS SIP start karo (₹1,000-₹2,000/month)
- [ ] PPF account kholo (₹500/year minimum)
- [ ] Health insurance premium — 80D claim (₹25,000)
- [ ] Education loan interest — 80E claim (full)
- [ ] Form 15G submit karo (agar income taxable nahi)
- [ ] ITR file karo har saal (July 31 deadline)

**KEY TAKEAWAYS (Module 10):**
- ✅ ₹2.5L (old)/₹3L (new) se kam income = zero tax — most students ko tax nahi dena. Lekin ITR file karo
- ✅ ITR file karo even with zero tax — refund, loan approval, visa ke liye zaroori. 15 minute online
- ✅ Section 80C se ₹1.5L tak tax save — ELSS best hai students ke liye (3yr lock-in, 12-15% returns)
- ✅ TDS check karo Form 26AS mein — zyada cut hua toh refund lo. Form 15G se TDS roko
- ✅ 80E se education loan interest ka full deduction lo — koi limit nahi. 8 saal tak claim karo

**COMMON MISCONCEPTIONS (Module 10):**

⚠️ "Student ko tax से koi lena dena nahi" → Galat! Freelance income, stipend, FD interest sab taxable hai
⚠️ "ITR filing complicated hai" → Nahi! ITR-1 online 15 minute mein fill ho jata hai, free hai
⚠️ "New regime hamesha better hai" → Nahi! Agar 80C/80D/80E deductions claim kar rahe ho toh old regime better
⚠️ "Tax planning sirf ameer logo ke liye hai" → Galat! ₹5,000 ki ELSS se ₹750 tax save ho sakta hai
⚠️ "Form 16 mil gaya toh kaam khatam" → Nahi! Form 16 verify karo, ITR file karo, refund claim karo

**Aage Ka Safar**: Tax basics clear ho gaya! Ab aapko pata hai ki income pe kaise tax lagta hai, kaise save karna hai, aur ITR kaise file karni hai. Lekin sabse important baaki hai — REAL WORLD mein yeh sab kaise apply hota hai? Module 11 mein complete financial plans, life stage checklists, scam awareness, aur "what if" scenarios cover karenge! 🎯`,
        imagePrompt: "Module 10 complete with tax-saving investments comparison, amber and gold theme, financial education celebration",
        color: "#F59E0B",
        emoji: "🏆"
      }
    ]
  }
];

export function getAllCards() {
  return module10Topics.flatMap(topic => topic.cards);
}

export function getTotalCardCount() {
  return getAllCards().length;
}

export function getTopicById(id) {
  return module10Topics.find(t => t.id === id);
}

export function getCardsByTopic(topicId) {
  const topic = getTopicById(topicId);
  return topic ? topic.cards : [];
}
