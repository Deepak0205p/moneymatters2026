import { NextResponse } from 'next/server';

const FALLBACK_TIPS = [
  { tip: 'Pehle emergency fund banao — 6 mahine ka kharcha save karo', priority: 'high' },
  { tip: 'Health insurance zaroori hai — hospital bill maar sakti hai', priority: 'high' },
  { tip: 'SIP se shuru karo — ₹500 se bhi shuru ho sakta hai', priority: 'medium' },
  { tip: 'Credit card ka bill hamesha full pay karo', priority: 'medium' },
];

export async function POST(request: Request) {
  try {
    const { income, expenses, savings } = await request.json();

    if (!income || income <= 0) {
      return NextResponse.json({ tips: FALLBACK_TIPS });
    }

    let tips: Array<{ tip: string; priority: string }> = [];

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const prompt = `You are a financial advisor for Indian youth. Based on monthly income of ₹${income}, expenses ₹${expenses || 'unknown'}, and savings ₹${savings || 'unknown'}, give 4 short personalized tips in Hinglish (Hindi+English mix). Each tip should be 1-2 lines. Format as JSON array with fields: tip, priority (high/medium/low). Return ONLY the JSON array, no markdown.`;

      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor for Indian youth who speaks Hinglish. Always respond with valid JSON only. No markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
      });

      let responseText = '';
      if (response?.choices?.[0]?.message?.content) {
        responseText = response.choices[0].message.content.trim();
      } else if (typeof response === 'string') {
        responseText = response.trim();
      } else if (response?.content) {
        responseText = response.content.trim();
      }

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        tips = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // LLM failed, use fallback
    }

    // Validate tips structure
    if (!Array.isArray(tips) || tips.length === 0) {
      tips = FALLBACK_TIPS;
    }

    // Ensure each tip has the right structure
    tips = tips.map((t: { tip?: string; priority?: string }) => ({
      tip: t.tip || 'Financial discipline rakho — yahi sabse bada secret hai!',
      priority: ['high', 'medium', 'low'].includes(t.priority || '') ? t.priority : 'medium',
    }));

    return NextResponse.json({ tips });
  } catch {
    return NextResponse.json({
      tips: FALLBACK_TIPS,
    });
  }
}
