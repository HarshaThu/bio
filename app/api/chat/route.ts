import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GLAMA_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GLAMA_API_KEY environment variable");
}

const openai = new OpenAI({
  baseURL: 'https://glama.ai/api/gateway/openai/v1',
  apiKey: apiKey,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, imageData } = body;

    const messages = [
      {
        role: 'user' as const,
        content: imageData ? [
          { type: 'text' as const, text: message },
          {
            type: 'image_url' as const,
            image_url: {
              url: imageData
            }
          }
        ] : message
      }
    ];

    const completion = await openai.chat.completions.create({
      messages,
      model: 'gemini-2.0-flash-exp',
      max_tokens: 1000,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content || ''
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
