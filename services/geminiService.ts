import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize safety check wrapper
const getAiClient = () => {
  if (!API_KEY) {
    console.warn("Gemini API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateRoyalMessage = async (
  sender: 'King' | 'Queen', 
  recipient: 'King' | 'Queen'
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return `Dearest ${recipient}, my love for you is vast, but the royal scribes (API Key) are currently on break.`;
  }

  try {
    const prompt = `
      Write a very short, witty, and extremely royal 2-sentence love note from a ${sender} to a ${recipient}.
      It should be encouraging regarding their daily duties or ruling the kingdom. 
      Use archaic but accessible royal language. 
      Mention things like decrees, dragons, gold, or the castle.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating royal message:", error);
    return `My Dearest ${recipient}, the carrier pigeon seems to have lost its way, but know that you rule my heart.`;
  }
};