import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { monthlyInvestment, returnRate, years, totalValue, totalInvested, estimatedReturns } = body;

    // Validate inputs
    if (!monthlyInvestment || !returnRate || !years) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use z-ai-web-dev-sdk LLM to generate a personalized Hinglish financial tip
    let tip = '';

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const response = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a friendly financial advisor for Indian youth who speaks in Hinglish (Hindi + English mix). Give short, motivational, and practical financial tips. Keep tips under 2 sentences. Use Indian rupee amounts and relatable examples. Be encouraging and use casual Hinglish tone.`,
          },
          {
            role: 'user',
            content: `A young Indian is doing a SIP of ₹${Number(monthlyInvestment).toLocaleString('en-IN')} per month at ${returnRate}% annual return for ${years} years. Their total investment would be ₹${Number(totalInvested).toLocaleString('en-IN')} and estimated total value is ₹${Number(totalValue).toLocaleString('en-IN')} (returns: ₹${Number(estimatedReturns).toLocaleString('en-IN')}). Give a short, personalized Hinglish financial tip or insight about this SIP plan. Make it motivational!`,
          },
        ],
        stream: false,
      });

      // Extract the tip from the response
      if (response?.choices?.[0]?.message?.content) {
        tip = response.choices[0].message.content.trim();
      } else if (typeof response === 'string') {
        tip = response.trim();
      } else if (response?.content) {
        tip = response.content.trim();
      }
    } catch (llmError) {
      console.error('LLM tip generation failed:', llmError);
      // Fallback tip
      tip = getFallbackTip(monthlyInvestment, returnRate, years, totalValue, estimatedReturns);
    }

    // If LLM didn't return a tip, use fallback
    if (!tip) {
      tip = getFallbackTip(monthlyInvestment, returnRate, years, totalValue, estimatedReturns);
    }

    // Also return the calculation data for reference
    return NextResponse.json({
      tip,
      calculation: {
        monthlyInvestment,
        returnRate,
        years,
        totalInvested,
        estimatedReturns,
        totalValue,
      },
    });
  } catch (error) {
    console.error('SIP calculation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getFallbackTip(
  monthly: number,
  rate: number,
  yrs: number,
  total: number,
  returns: number
): string {
  const tips = [
    `₹${Number(monthly).toLocaleString('en-IN')} har mahine invest karke aap ₹${Number(total).toLocaleString('en-IN')} bana sakte ho! Bas consistency rakho, compounding sab kuch karega! 💪`,
    `SIP mein sabse important hai discipline! Market upar ya neeche, aapka ₹${Number(monthly).toLocaleString('en-IN')} har mahine jaata rahe — ye hi wealth banane ka raaz hai!`,
    `${yrs} saal mein aapke ₹${Number(monthly * yrs * 12).toLocaleString('en-IN')} se ₹${Number(returns).toLocaleString('en-IN')} sirf returns mein! Ye hai compounding ki asli taakat! 🚀`,
    `Agar aap sirf 5 saal aur invest karte, toh amount aur bhi double ho jata! Zyada time = zyada compounding magic! ✨`,
    `₹${Number(monthly).toLocaleString('en-IN')} mahine ka matlab sirf ₹${Math.round(monthly / 30)}/din — ek chai se kam! Aur ye chhota investment itna bada fund bana deta hai! ☕`,
  ];

  // Pick a deterministic tip based on inputs
  const idx = (monthly + rate + yrs) % tips.length;
  return tips[idx];
}
