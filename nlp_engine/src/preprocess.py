import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download necessary NLTK data
def download_nltk_resources():
    import os
    # For serverless environments like Vercel, we might need a writable directory
    nltk_data_path = os.path.join('/tmp', 'nltk_data') if os.access('/tmp', os.W_OK) else None
    if nltk_data_path:
        if nltk_data_path not in nltk.data.path:
            nltk.data.path.append(nltk_data_path)
            if not os.path.exists(nltk_data_path):
                os.makedirs(nltk_data_path)

    resources = ['tokenizers/punkt', 'corpora/stopwords', 'corpora/wordnet', 'corpora/omw-1.4', 'tokenizers/punkt_tab']
    
    for resource in resources:
        try:
            nltk.data.find(resource)
        except LookupError:
            nltk.download(resource.split('/')[-1] if '/' in resource else resource, download_dir=nltk_data_path)

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
