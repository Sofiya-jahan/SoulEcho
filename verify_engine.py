from nlp_engine.src.analyzer import DiaryAnalyzer

def test_analyzer():
    analyzer = DiaryAnalyzer()
    
    # Test Entry 1: Positive/Joy
    entry1 = "I had such a wonderful day! I finally finished my project and I feel so happy and proud."
    result1 = analyzer.analyze_entry(entry1)
    print("\n--- Test Entry 1 ---")
    print(f"Text: {result1['text']}")
    print(f"Sentiment: {result1['sentiment']['sentiment_label']} (Score: {result1['sentiment']['compound']})")
    print(f"Primary Emotion: {result1['emotions']['primary_emotion']}")
    print(f"Triggers: {result1['triggers']}")
    print(f"Mood Score: {result1['mood_score']}")
    print(f"Insight: {result1['insight']}")
    print(f"Advice: {result1['advice']}")

    # Test Entry 2: Negative/Sadness
    entry2 = "I'm feeling quite sad today. I miss my family and everything feels a bit overwhelming."
    result2 = analyzer.analyze_entry(entry2)
    print("\n--- Test Entry 2 ---")
    print(f"Text: {result2['text']}")
    print(f"Sentiment: {result2['sentiment']['sentiment_label']} (Score: {result2['sentiment']['compound']})")
    print(f"Primary Emotion: {result2['emotions']['primary_emotion']}")
    print(f"Triggers: {result2['triggers']}")
    print(f"Mood Score: {result2['mood_score']}")
    print(f"Insight: {result2['insight']}")
    print(f"Advice: {result2['advice']}")

if __name__ == "__main__":
    test_analyzer()
