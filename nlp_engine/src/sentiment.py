from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text):
        scores = self.analyzer.polarity_scores(text)
        # scores contains: negative, neutral, positive, compound
        return {
            "compound": scores['compound'],
            "pos": scores['pos'],
            "neu": scores['neu'],
            "neg": scores['neg'],
            "sentiment_label": self._get_label(scores['compound'])
        }

    def _get_label(self, compound):
        if compound >= 0.05:
            return "Positive"
        elif compound <= -0.05:
            return "Negative"
        else:
            return "Neutral"
