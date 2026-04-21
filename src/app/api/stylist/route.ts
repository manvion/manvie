import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { occasion, style, budget } = body;

    // To prevent crash during local dev if dummy key is used
    if (process.env.OPENAI_API_KEY === 'sk-dummy-key' || !process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        explanation: "For this occasion, we have curated a look that balances avant-garde aesthetics with quintessential Manvié elegance. (Dummy Output)",
        items: [
          { name: "Manvié Atelier Silk Dress", type: "Main", price: "$1,850" },
          { name: "Manvié Signature Coat", type: "Outerwear", price: "$2,400" },
          { name: "Manvié Leather Handbag", type: "Accessory", price: "$3,200" }
        ]
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a luxury fashion stylist for the Paris house MANVIÉ. Return your recommendations strictly in JSON format matching this schema: { \"explanation\": \"...\", \"items\": [ { \"name\": \"...\", \"type\": \"...\", \"price\": \"...\" } ] }" },
        { role: "user", content: `Suggest an outfit for ${occasion} with ${style} style under ${budget}. Return ONLY JSON.` }
      ],
    });
    
    // Parse the JSON output from OpenAI
    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);

  } catch (error) {
    console.error("AI Stylist Error:", error);
    return NextResponse.json({ error: "Failed to generate styling." }, { status: 500 });
  }
}
