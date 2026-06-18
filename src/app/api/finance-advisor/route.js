import { NextResponse } from 'next/server';
import { validateMessage } from '@/lib/security';

const MAX_MESSAGES_PER_SESSION = 20;

const SYSTEM_PROMPT = `You are "Rupaiya Guru" — a friendly, knowledgeable financial advisor for Indian youth (ages 18-30). You speak in Hinglish (Hindi + English mix) to make financial concepts relatable and easy to understand.

## Your Personality:
- Warm, encouraging, and non-judgmental
- Use casual Hinglish like "Bhai", "Yaar", "Dekho", "Samjho", "Simple hai"
- Crack light financial jokes occasionally
- Always supportive — never make users feel dumb about money

## How You Give Advice:
- Use Indian rupee (₹) amounts and relatable examples (chai, zomato, metro, etc.)
- Break complex topics into simple steps
- Give practical, actionable advice — not theory
- Mention real Indian financial tools (UPI, SIP, PPF, NPS, mutual funds, etc.)
- Always include a "Pro Tip" at the end of detailed answers

## Topics You Cover:
- Budgeting & saving (50/30/20 rule, emergency fund, etc.)
- Investing basics (SIP, mutual funds, PPF, FD, stocks)
- Debt management (credit cards, loans, EMI)
- Tax saving (80C, 80D, etc.)
- Insurance (term plan, health insurance)
- Goal-based planning (wedding, car, house, retirement)

## Important Rules:
- NEVER give specific stock recommendations or guaranteed return promises
- ALWAYS add a disclaimer that this is educational advice, not professional financial advice
- If asked about specific stocks, redirect to mutual funds/SIP
- Keep responses concise (2-4 paragraphs max for simple questions, 4-6 for complex ones)
- Use bullet points and emojis for readability
- If user asks something non-financial, gently redirect to finance topics`;

const FALLBACK_RESPONSES = {
  sip: `SIP shuru karna bahut simple hai! 🚀\n\n**Steps:**\n1. **KYC complete karo** — Aadhaar + PAN se ek baar karwa lo\n2. **App choose karo** — Groww, Zerodha (Coin), Paytm Money — sab free hai\n3. **Fund select karo** — Beginner? Nifty 50 Index Fund se start karo (₹500 se bhi shuru hota hai!)\n4. **Auto-debit set karo** — mahine ki fixed date pe paisa automatically invest ho jayega\n\n**Pro Tip:** SIP ki sabse badi taakat hai consistency! Market upar ya neeche, har mahine invest karte raho — rupee cost averaging ka magic khud dekhega! 💪\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`,

  emergency: `Emergency fund aapka financial safety net hai! 🛡️\n\n**Kitna chahiye?**\n- **Minimum:** 3 mahine ka kharcha\n- **Ideal:** 6 mahine ka kharcha\n- **Self-employed/Freelancer:** 9-12 mahine ka kharcha\n\n**Kaise calculate karein:**\nRent + EMI + Bills + Grocery + Insurance = Monthly kharcha × 6\n\n**Kahan rakhein:**\n- Savings Account (instant access)\n- FD (thoda better interest)\n- Liquid Mutual Fund (best balance of returns + access)\n\n**Pro Tip:** Pehle emergency fund banao, phir invest karo! Bina safety net ke investing risky hai. 🎯\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`,

  creditcard: `Credit card ek double-edged sword hai! ⚔️\n\n**Fayde (Agar smartly use karo):**\n- Credit score build hota hai (future loans ke liye zaroori)\n- Cashback & rewards milte hain\n- 45-50 days interest-free credit\n\n**Nuksaan (Agar irresponsible ho):**\n- 36-40% interest rate! 🤯\n- Minimum payment = debt trap\n- Overspending ka temptation\n\n**Golden Rules:**\n1. Hamesha FULL payment karo — never minimum\n2. Expense ka 30% se zyada credit limit mat use karo\n3. Auto-debit ON rakho payment ke liye\n\n**Pro Tip:** Agar tum monthly budget se zyada spend kar rahe ho, credit card band karo aur debit card use karo! 🛑\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`,

  investment: `Pehla investment — sabse important step! 🎯\n\n**Beginner ke liye order of priority:**\n\n1️⃣ **Emergency Fund** (pehle ye banao!)\n2️⃣ **Term Insurance** (agar dependents hain)\n3️⃣ **Health Insurance** (medical emergency se bachao)\n4️⃣ **PPF / EPF** (tax saving + guaranteed returns)\n5️⃣ **Index Fund SIP** (Nifty 50 — ₹500 se start!)\n\n**Pro Tip:** "Perfect" plan ka wait mat karo — aaj hi shuru karo, bahut kam se! 🚀\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`,

  budget: `Budget banana aasan hai — follow the 50/30/20 rule! 📊\n\n**50/30/20 Rule:**\n- **50% Needs:** Rent, EMI, bills, grocery, insurance\n- **30% Wants:** Dining out, shopping, entertainment\n- **20% Savings:** Emergency fund, SIP, investments\n\n**Pro Tip:** Budget restriction nahi hai — freedom hai! 💪\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`
};

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('sip') || lower.includes('invest') || lower.includes('mutual fund')) {
    return FALLBACK_RESPONSES.sip;
  }
  if (lower.includes('emergency') || lower.includes('safety') || lower.includes('backup')) {
    return FALLBACK_RESPONSES.emergency;
  }
  if (lower.includes('credit card') || lower.includes('emi')) {
    return FALLBACK_RESPONSES.creditcard;
  }
  if (lower.includes('pehla') || lower.includes('start') || lower.includes('shuru') || lower.includes('kahan')) {
    return FALLBACK_RESPONSES.investment;
  }
  if (lower.includes('budget') || lower.includes('kharcha') || lower.includes('save') || lower.includes('bachat')) {
    return FALLBACK_RESPONSES.budget;
  }
  return `Bahut achha sawaal hai! 🤔\n\nFinancial literacy seekhna ek journey hai, aur main tumhari help karunga. Chalo step by step samjhte hain — tum kya specifically jaanna chahte ho? Budgeting, investing, tax saving, ya kuch aur?\n\nMoney Matters ke modules bhi check karo — ek ek karke sab cover karenge! 💪\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`;
}

async function callLLM(messages, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    const validation = validateMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const sessionCount = context?.sessionCount || 0;
    if (sessionCount >= MAX_MESSAGES_PER_SESSION) {
      return NextResponse.json({
        reply: `Arre bhai, bahut baat kar li! 😅 Session limit ho gayi hai (${MAX_MESSAGES_PER_SESSION} messages). Thoda break lo, digest karo jo seekha, aur baad mein wapas aao! 💡\n\n⚠️ Ye educational advice hai, professional consultation ki jagah nahi.`,
        rateLimited: true,
      });
    }

    let contextStr = '';
    if (context) {
      const parts = [];
      if (context.userName) parts.push(`User ka naam: ${context.userName}`);
      if (context.coins !== undefined) parts.push(`Coins earned: ${context.coins}`);
      if (context.completedModules?.length) parts.push(`Modules completed: ${context.completedModules.length}/11`);
      if (context.streak) parts.push(`Current streak: ${context.streak} days`);
      if (context.masteredTerms?.length) parts.push(`Terms mastered: ${context.masteredTerms.length}`);
      if (parts.length > 0) {
        contextStr = `\n\n## User Context:\n${parts.join('\n')}`;
      }
    }

    const llmReply = await callLLM(
      [{ role: 'user', content: validation.sanitized }],
      SYSTEM_PROMPT + contextStr
    );

    if (llmReply) {
      return NextResponse.json({ reply: llmReply });
    }

    return NextResponse.json({ reply: getFallbackResponse(validation.sanitized) });
  } catch (error) {
    console.error('Finance Advisor API error:', error);
    return NextResponse.json(
      { error: 'Arre yaar, kuch technical problem aa gayi! 🙏 Thoda der baad try karo.' },
      { status: 500 }
    );
  }
}
