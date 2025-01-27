"use client";

export async function chat(input: string | { message: string; imageData?: string }) {
  try {
    let message = typeof input === 'string' ? input : input.message;
    let imageData = typeof input === 'string' ? undefined : input.imageData;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, imageData }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat response');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.content;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
}
