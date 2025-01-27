"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

// In Next.js, we need to expose env variables to the client by prefixing them with NEXT_PUBLIC_
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GOOGLE_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

export async function chat(input: string | { message: string; imageData?: string }) {
  try {
    let message = typeof input === 'string' ? input : input.message;
    let imageData = typeof input === 'string' ? undefined : input.imageData;

    if (imageData) {
      // Use the base64 data directly, just remove the data URL prefix
      const base64Data = imageData.split(',')[1];
      
      // Create the content parts array
      const parts = [
        message,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ];

      const result = await model.generateContent(parts);
      const response = await result.response;
      return response.text();
    } else {
      const result = await model.generateContent(message);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
}
