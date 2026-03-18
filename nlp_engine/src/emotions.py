class EmotionDetector:
    def __init__(self):
        # Expanded NRC-like lexicon
        self.lexicon = {
            "happy": "joy", "great": "joy", "excellent": "joy", "wonderful": "joy", "joy": "joy", "love": "joy", "gratitude": "joy",
            "sad": "sadness", "depressed": "sadness", "unhappy": "sadness", "lonely": "sadness", "miss": "sadness", "grief": "sadness",
            "angry": "anger", "mad": "anger", "frustrated": "anger", "furious": "anger", "irritated": "anger",
            "afraid": "fear", "scared": "fear", "terrified": "fear", "anxious": "fear", "worry": "fear", "panic": "fear",
            "surprised": "surprise", "shocked": "surprise", "wow": "surprise", "amazed": "surprise",
            "disgust": "disgust", "gross": "disgust", "revolted": "disgust", "contempt": "disgust",
            "trust": "trust", "friend": "trust", "family": "trust", "support": "trust", "safe": "trust",
            "hope": "anticipation", "looking forward": "anticipation", "eager": "anticipation", "excited": "anticipation",
            "tired": "exhaustion", "exhausted": "exhaustion", "drained": "exhaustion", "sleepy": "exhaustion"
        }

    def detect(self, tokens):
        detected_emotions = {}
        
        for token in tokens:
            if token in self.lexicon:
                emotion = self.lexicon[token]
                detected_emotions[emotion] = detected_emotions.get(emotion, 0) + 1
        
        if not detected_emotions:
            return {"primary_emotion": "Neutral", "secondary_emotions": [], "all_emotions": {}}
        
        # Sort emotions by frequency
        sorted_emotions = sorted(detected_emotions.items(), key=lambda x: x[1], reverse=True)
        
        primary = sorted_emotions[0][0]
        secondary = [e[0] for e in sorted_emotions[1:3]] # Up to 2 secondary
        
        return {
            "primary_emotion": primary,
            "secondary_emotions": secondary,
            "all_emotions": detected_emotions,
            "intensity": sum(detected_emotions.values()) / len(tokens) if tokens else 0
        }
