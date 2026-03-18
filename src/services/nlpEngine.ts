export interface AnalysisResult {
  detectedEmotions: { emotion: string; confidence: number }[];
  overallSentiment: { sentiment: string; confidence: number };
  keyEmotionalTriggers: string[];
  emotionalInsight: string; // Keep for backward compatibility or map to reflection
  supportiveAdvice: string[]; // Keep for backward compatibility or map to suggestions
  positiveReflection: string; // Keep for backward compatibility or map to closing
  moodScore: number;
  // New Empathetic Fields
  emotionalUnderstanding: string;
  explanationOfContext: string;
  empatheticReflection: string;
  supportiveSuggestions: string[];
  encouragingClosing: string;
}

const API_BASE_URL = import.meta.env.VITE_NLP_API_URL || '/api';

export async function analyzeDiaryEntryWithNLP(entry: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: entry }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze entry');
    }

    const data = await response.json();

    // Map FastAPI response to UI AnalysisResult format
    const result: AnalysisResult = {
      detectedEmotions: Object.entries(data.emotions.all_emotions).map(([emotion, count]) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        confidence: (count as number) / (data.text.split(' ').length || 1),
      })),
      overallSentiment: {
        sentiment: data.sentiment.sentiment_label,
        confidence: Math.abs(data.sentiment.compound),
      },
      keyEmotionalTriggers: data.triggers,
      emotionalInsight: data.empathetic_reflection,
      supportiveAdvice: data.supportive_suggestions,
      positiveReflection: data.encouraging_closing,
      moodScore: data.mood_score,
      // New Empathetic Fields
      emotionalUnderstanding: data.emotional_understanding,
      explanationOfContext: data.explanation_of_context,
      empatheticReflection: data.empathetic_reflection,
      supportiveSuggestions: data.supportive_suggestions,
      encouragingClosing: data.encouraging_closing,
    };

    // If no emotions were detected, ensure at least Neutral is present
    if (result.detectedEmotions.length === 0) {
        result.detectedEmotions.push({ emotion: "Neutral", confidence: 1.0 });
    }

    return result;
  } catch (error) {
    console.error("NLP Engine API error:", error);
    throw new Error("I could not reach the emotional analysis engine. Is it running?");
  }
}
