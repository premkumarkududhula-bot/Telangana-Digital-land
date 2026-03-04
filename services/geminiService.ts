
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Obfuscated remote key source (Google Drive CSV export link)
const _SRC_P1 = "https://docs.google.com/spreadsheets/d/1mBj2yA7_QV385Nj2Lqkxb";
const _SRC_P2 = "v7rDz0qw5TEVNefAhZxuqE/export?format=csv";

export async function getLandInsight(slotId: number, price: number, owner: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, exciting one-sentence investment insight for Digital Land Plot #${slotId}. Current price is ₹${price} and owned by ${owner}.`,
      config: { temperature: 0.7 },
    });
    return response.text || "A prime digital asset with high appreciation potential.";
  } catch (error) {
    return "This plot is rapidly gaining value in the digital ecosystem.";
  }
}

/**
 * Securely verifies the administrative password using remote fetch and extraction.
 * Algorithm: Fetches string (e.g. 'AB9966XYZ'), strips first 2 and last 3 characters.
 */
export async function verifyAdminPassword(input: string): Promise<boolean> {
  try {
    const response = await fetch(_SRC_P1 + _SRC_P2);
    if (!response.ok) return false;
    
    const rawText = await response.text();
    // Clean text from CSV formatting/newlines
    const cleanText = rawText.replace(/[\r\n",]+/g, '').trim();
    
    if (cleanText.length <= 5) return false;

    // Stripping first 2 ('AB') and last 3 ('XYZ')
    const actualPassword = cleanText.substring(2, cleanText.length - 3);
    
    return input.trim() === actualPassword;
  } catch (error) {
    console.error("Auth sync error", error);
    return false;
  }
}
