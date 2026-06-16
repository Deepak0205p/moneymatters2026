import { NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Fallback tips in case SDK calls fail                               */
/* ------------------------------------------------------------------ */
const FALLBACK_TIPS = [
  { tip: 'SIP kabhi mat ruko, time market se zyada important hai!', category: 'investment', emoji: '📈' },
  { tip: 'Emergency fund = 6 mahine ka kharcha, pehle yeh banao', category: 'savings', emoji: '🛡️' },
  { tip: 'Credit card ka bill full pay karo, minimum nahi!', category: 'debt', emoji: '💳' },
  { tip: '80C ke under PPF aur ELSS se tax bachao', category: 'tax', emoji: '🧾' },
  { tip: 'Budget banao aur kharche track karo har mahine', category: 'budget', emoji: '📊' },
];

interface NewsItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
}

interface TipItem {
  tip: string;
  category: string;
  emoji: string;
}

export async function GET() {
  let news: NewsItem[] = [];
  let tips: TipItem[] = [];

  /* ---- Web search for Indian financial news ---- */
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const searchResults = await zai.functions.invoke('web_search', {
      query: 'latest Indian financial literacy news tips for young adults 2025',
      num: 6,
    });

    if (Array.isArray(searchResults)) {
      news = searchResults.map((item: Record<string, string>) => ({
        url: item.url || '',
        name: item.name || '',
        snippet: item.snippet || '',
        host_name: item.host_name || '',
      }));
    }
  } catch (err) {
    console.error('Web search failed:', err);
  }

  /* ---- LLM-generated Hinglish tips ---- */
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You generate short financial tips in Hinglish (Hindi+English mix) for Indian youth aged 18-30. Each tip should be 1-2 lines, practical, and motivational. You MUST respond with ONLY a valid JSON array — no markdown, no code fences, no extra text. Each element must have: tip (string), category (one of: savings, investment, budget, debt, tax), emoji (string). Return exactly 5 tips.',
        },
        {
          role: 'user',
          content:
            'Generate 5 short financial tips in Hinglish for Indian youth. Each tip should be 1-2 lines. Format as JSON array with fields: tip, category (savings/investment/budget/debt/tax), emoji. Return ONLY the JSON array, no markdown.',
        },
      ],
      thinking: { type: 'disabled' },
    });

    let raw = '';
    if (response?.choices?.[0]?.message?.content) {
      raw = response.choices[0].message.content.trim();
    } else if (typeof response === 'string') {
      raw = response.trim();
    } else if (response?.content) {
      raw = response.content.trim();
    }

    // Strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      tips = parsed.map((t: Record<string, string>) => ({
        tip: t.tip || '',
        category: t.category || 'savings',
        emoji: t.emoji || '💰',
      }));
    }
  } catch (err) {
    console.error('LLM tips generation failed:', err);
  }

  // Apply fallbacks
  if (tips.length === 0) {
    tips = FALLBACK_TIPS;
  }

  return NextResponse.json({ news, tips, timestamp: Date.now() });
}
