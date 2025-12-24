
import { GoogleGenAI, Type } from "@google/genai";

export const generateFestivePrizes = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: '生成6个有创意的圣诞抽奖奖品（中文名称）。仅返回一个字符串数组的 JSON。',
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
