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

  const prompt = `You are an SEO copywriter for Tompo's Auto Spare Parts, an auto parts shop based in Nairobi, Kenya (Kiriye House, Kirinyaga Road) serving customers across Kenya. Write an SEO-optimised product description for the auto part below.

Requirements:
- Length: 160-220 words (at least 150 words). Do not write less.
- Structure: 3 to 4 short paragraphs of plain prose. No markdown, no headings, no bullet points, no emojis, no quotation marks.
- First paragraph: include the full product title naturally in the first sentence. Describe what the part is and the role it plays in the vehicle.
- Second paragraph: highlight key benefits, build quality, durability, and what makes it a reliable choice. If a brand or OEM number is provided, weave them in naturally.
- Third paragraph: cover fitment and compatibility. If compatible models are provided, mention them explicitly. If none are provided, refer generally to compatible vehicles without inventing specific models.
- Final sentence: a soft local trust signal mentioning Tompo's Auto Spare Parts, Nairobi, or Kenya, and fast delivery / genuine parts. Vary the wording each time so it does not sound templated.
- SEO: naturally include the product title, brand, category, and (if given) OEM number and compatible model names. Use semantic variations (e.g. "replacement part", "spare part", "auto part") and Kenyan context ("Kenyan roads", "Nairobi", "across Kenya") where it reads naturally. Do not keyword-stuff.
- Tone: factual, confident, customer-friendly. Never invent specific specs, sizes, materials, warranties, or model years that are not provided.

Product details:
- Title: ${title}
${brand ? `- Brand: ${brand}` : ""}
${category ? `- Category: ${category}` : ""}
${oemNumber ? `- OEM Number: ${oemNumber}` : ""}
${compatibleModels ? `- Compatible Models: ${compatibleModels}` : ""}

Output only the description text. No preamble, no labels, no quotation marks, no closing remarks.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            thinkingConfig: {
              thinkingBudget: 0,
            },
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
    const candidate = data?.candidates?.[0];
    const text: string | undefined = candidate?.content?.parts?.[0]?.text;
    const finishReason: string | undefined = candidate?.finishReason;

    if (!text) {
      console.error("Gemini returned no text. finishReason:", finishReason, "raw:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json(
        { error: "AI returned no content. Please try again." },
        { status: 502 }
      );
    }

    if (finishReason && finishReason !== "STOP") {
      console.warn("Gemini finishReason:", finishReason, "— output may be truncated");
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
