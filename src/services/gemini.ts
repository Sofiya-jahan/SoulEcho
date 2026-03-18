/// <reference types="vite/client" />

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface AnalysisResult {
  detectedEmotions: { emotion: string; confidence: number }[];
  overallSentiment: { sentiment: string; confidence: number };
  keyEmotionalTriggers: string[];
  emotionalInsight: string;
  supportiveAdvice: string[];
  positiveReflection: string;
}

export async function analyzeDiaryEntry(entry: string): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
Analyze the following diary entry and provide a structured emotional analysis.

Diary Entry:
"${entry}"

Please return ONLY a valid JSON object matching this exact schema, with no markdown formatting or other text:
{
  "detectedEmotions": [{ "emotion": "string", "confidence": number (between 0 and 1) }],
  "overallSentiment": { "sentiment": "string (Positive/Neutral/Negative)", "confidence": number (between 0 and 1) },
  "keyEmotionalTriggers": ["string"],
  "emotionalInsight": "string (Short emotional explanation)",
  "supportiveAdvice": ["string", "string", "string", "string"],
  "positiveReflection": "string (A short, uplifting concluding thought)"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean text to handle possible markdown block wrappers
    const cleanedText = text.replace(/^```json?\\?/, '').replace(/```$/, '').trim();
    
    const parsedResult = JSON.parse(cleanedText) as AnalysisResult;

    return parsedResult;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("I encountered an issue while reflecting on your entry. Please try again.");
  }
}
