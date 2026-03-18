class MoodScorer:
    def __init__(self):
        # Weights for different emotions (1-10 scale)
        self.emotion_weights = {
            "joy": 9,
            "trust": 8,
            "anticipation": 7,
            "surprise": 6,
            "Neutral": 5,
            "disgust": 3,
            "anger": 2,
            "fear": 2,
            "sadness": 1
        }

    def calculate_score(self, emotions, sentiment):
        primary = emotions.get("primary_emotion", "Neutral")
        sentiment_compound = sentiment.get("compound", 0) # -1 to 1
        
        # Base weight from primary emotion (scaled to 1-10)
        base_score = self.emotion_weights.get(primary, 5)
        
        # Adjust based on sentiment compound score
        # sentiment_compound * 2 gives a range of -2 to +2
        final_score = base_score + (sentiment_compound * 2)
        
        # Clamp between 1 and 10
        final_score = max(1, min(10, final_score))
        
        return round(final_score, 2)

    def analyze_trends(self, history):
        # history is a list of scores over time
        if not history:
            return "No data available for trends."
        
        avg_score = sum(history) / len(history)
        trend = "Stable"
        if len(history) > 1:
            if history[-1] > history[0]:
                trend = "Improving"
            elif history[-1] < history[0]:
                trend = "Declining"
                
        return {
            "average_mood": round(avg_score, 2),
            "trend": trend,
            "count": len(history)
        }
