import { NextResponse } from 'next/server';

const FALLBACK_TIPS = [
  { tip: 'SIP kabhi mat ruko, time market se zyada important hai!', category: 'investment', emoji: '📈' },
  { tip: 'Emergency fund = 6 mahine ka kharcha, pehle yeh banao', category: 'savings', emoji: '🛡️' },
  { tip: 'Credit card ka bill full pay karo, minimum nahi!', category: 'debt', emoji: '💳' },
  { tip: '80C ke under PPF aur ELSS se tax bachao', category: 'tax', emoji: '🧾' },
  { tip: 'Budget banao aur kharche track karo har mahine', category: 'budget', emoji: '📊' },
];

const FALLBACK_NEWS = [
  { title: 'SIP investments in India cross ₹25,000 crore monthly', source: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets' },
  { title: 'RBI keeps repo rate unchanged at 6.5%', source: 'Moneycontrol', url: 'https://www.moneycontrol.com' },
  { title: 'New tax regime becomes default for salaried employees', source: 'Livemint', url: 'https://www.livemint.com' },
  { title: 'Gold prices hit all-time high amid global uncertainty', source: 'Business Standard', url: 'https://www.business-standard.com' },
  { title: 'Mutual fund AUM reaches record ₹60 lakh crore', source: 'CNBC TV18', url: 'https://www.cnbctv18.com' },
];

async function callLLMForTips() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Give me 5 short financial tips for Indian youth in Hinglish. Each tip should be one sentence, practical, and relatable. Categories: investment, savings, debt, tax, budget. Return as JSON array: [{"tip":"...","category":"...","emoji":"..."}]. Only JSON, no markdown.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  const tips = await callLLMForTips() ?? FALLBACK_TIPS;

  const response = NextResponse.json({
    news: FALLBACK_NEWS,
    tips,
    timestamp: Date.now(),
  });

  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');

  return response;
}
