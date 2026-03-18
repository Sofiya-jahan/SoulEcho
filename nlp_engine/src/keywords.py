from rake_nltk import Rake
import nltk

class KeywordExtractor:
    def __init__(self):
        try:
            nltk.data.find('corpora/stopwords')
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('stopwords')
            nltk.download('punkt')
        self.rake = Rake()

    def extract(self, text):
        self.rake.extract_keywords_from_text(text)
        # Get ranked keywords with scores
        keywords = self.rake.get_ranked_phrases_with_scores()[:5]
        # Just return the phrases
        return [f"{k[1]}" for k in keywords]
