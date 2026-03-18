from .preprocess import TextPreprocessor
from .emotions import EmotionDetector
from .sentiment import SentimentAnalyzer
from .keywords import KeywordExtractor
from .insights import InsightEngine
from .advice import AdviceGenerator
from .mood import MoodScorer

class DiaryAnalyzer:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.emotion_detector = EmotionDetector()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.keyword_extractor = KeywordExtractor()
        self.insight_engine = InsightEngine()
        self.advice_generator = AdviceGenerator()
        self.mood_scorer = MoodScorer()

    def analyze_entry(self, text):
        # 1. Preprocess the text
        clean_data = self.preprocessor.preprocess(text)
        tokens = clean_data["tokens"]
        
        # 2. Extract sentiment
        sentiment = self.sentiment_analyzer.analyze(text)
        
        # 3. Detect emotions
        emotions = self.emotion_detector.detect(tokens)
        
        # 4. Extract keywords/triggers
        keywords = self.keyword_extractor.extract(text)
        
        # 5. Generate structured insights
        insight_data = self.insight_engine.generate_insight(emotions, sentiment, keywords)
        
        # 6. Generate structured advice
        advice_data = self.advice_generator.get_advice(emotions.get("primary_emotion", "Neutral"))
        
        # 7. Calculate mood score
        mood_score = self.mood_scorer.calculate_score(emotions, sentiment)
        
        # Combine into the new advanced format
        return {
            "text": text,
            "sentiment": sentiment,
            "emotions": emotions,
            "triggers": keywords,
            "mood_score": mood_score,
            # New Empathetic Fields
            "emotional_understanding": insight_data["understanding"],
            "explanation_of_context": insight_data["context"],
            "empathetic_reflection": insight_data["reflection"],
            "supportive_suggestions": advice_data["suggestions"],
            "encouraging_closing": advice_data["closing"]
        }

    def analyze_trends(self, scores_history):
        return self.mood_scorer.analyze_trends(scores_history)
