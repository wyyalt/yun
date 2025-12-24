
import { GoogleGenAI, Type } from "@google/genai";

export const generateFestivePrizes = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate 6 creative and festive Christmas-themed raffle prizes. Return only a JSON array of names.',
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    return JSON.parse(response.text) as string[];
  } catch (e) {
    console.error("Failed to parse prize suggestions", e);
    return [];
  }
};
