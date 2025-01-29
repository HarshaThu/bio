import { NextResponse } from 'next/server';
import { ChatAgent } from '@/lib/agents/chat-agent';

const apiKey = process.env.NEXT_PUBLIC_GLAMA_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GLAMA_API_KEY environment variable");
}

// Initialize the chat agent
const chatAgent = new ChatAgent(apiKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, imageData } = body;

    const response = await chatAgent.chat(message, imageData);

    return NextResponse.json({
      content: response.content,
      suggestedProducts: response.suggestedProducts
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
