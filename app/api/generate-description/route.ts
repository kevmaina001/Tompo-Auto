import { NextResponse } from "next/server";

export const runtime = "edge";

interface Body {
  title?: string;
  brand?: string;
  category?: string;
  oemNumber?: string;
  compatibleModels?: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, brand, category, oemNumber, compatibleModels } = body;

  if (!title || !title.trim()) {
    return NextResponse.json(
      { error: "Product title is required" },
      { status: 400 }
    );
  }

  const prompt = `You are writing a product description for Tompo's Auto Spare Parts shop in Kenya. Write a concise, customer-friendly description for the following auto part. Use 2-3 short paragraphs (around 60-100 words total). Be factual, highlight key benefits, fitment, and quality. Do not invent specifications you don't know. Do not use markdown, headings, bullet points, or emojis. Plain prose only.

Product details:
- Title: ${title}
${brand ? `- Brand: ${brand}` : ""}
${category ? `- Category: ${category}` : ""}
${oemNumber ? `- OEM Number: ${oemNumber}` : ""}
${compatibleModels ? `- Compatible Models: ${compatibleModels}` : ""}

Write only the description text. No preamble, no labels, no quotation marks.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned no content. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ description: text.trim() });
  } catch (err) {
    console.error("Generate description failed:", err);
    return NextResponse.json(
      { error: "Failed to reach AI service" },
      { status: 502 }
    );
  }
}
