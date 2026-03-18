import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK data
def download_nltk_resources():
    try:
        nltk.data.find('tokenizers/punkt')
        nltk.data.find('corpora/stopwords')
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        nltk.download('omw-1.4')
        nltk.download('punkt_tab')

class TextPreprocessor:
    def __init__(self):
        download_nltk_resources()
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def preprocess(self, text):
        # 1. Lowercase conversion
        text = text.lower()
        
        # 2. Punctuation removal
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # 3. Tokenization
        tokens = word_tokenize(text)
        
        # 4. Stopword removal
        filtered_tokens = [w for w in tokens if not w in self.stop_words]
        
        # 5. Lemmatization
        lemmatized_tokens = [self.lemmatizer.lemmatize(w) for w in filtered_tokens]
        
        return {
            "tokens": tokens,
            "filtered_tokens": filtered_tokens,
            "lemmatized_tokens": lemmatized_tokens,
            "cleaned_text": " ".join(lemmatized_tokens)
        }
