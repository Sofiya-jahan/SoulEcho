class InsightEngine:
    def __init__(self):
        self.emotions_map = {
            "joy": {
                "understanding": "I can sense a beautiful lightness in your words.",
                "context": "It seems like something positive has happened that's bringing you a lot of happiness.",
                "reflection": "It's wonderful to see you savoring these moments of joy. These experiences are the anchors of our well-being."
            },
            "sadness": {
                "understanding": "I can feel the weight of what you're sharing right now.",
                "context": "It sounds like you're navigating a period of loss, longing, or deep reflection.",
                "reflection": "It's completely natural to feel this way. Giving yourself the space to honor these feelings is a brave part of healing."
            },
            "anger": {
                "understanding": "I can sense the frustration and intensity in your entry.",
                "context": "There seems to be something that feels unfair or overwhelming, triggering this strong reaction.",
                "reflection": "Anger often points us toward things that need to change. Recognizing it is the first step in addressing the source."
            },
            "fear": {
                "understanding": "I can hear the uncertainty and apprehension in your thoughts.",
                "context": "You seem to be facing a situation that feels unpredictable or threatening to your peace of mind.",
                "reflection": "Feeling anxious in the face of the unknown is a human response. You're not alone in feeling this way."
            },
            "exhaustion": {
                "understanding": "I can sense how heavily this is weighing on you.",
                "context": "It sounds like you've been carrying a lot lately, and your energy is feeling quite depleted.",
                "reflection": "It's okay to admit when you're tired. Your mind and body are simply asking for the rest they deserve."
            },
            "Neutral": {
                "understanding": "I'm listening to your thoughts and reflections today.",
                "context": "You seem to be in a grounded and observant state as you recount your day.",
                "reflection": "These calm moments of neutrality are a good time to check in with yourself and find your balance."
            }
        }

    def generate_insight(self, emotions, sentiment, keywords):
        primary = emotions.get("primary_emotion", "Neutral")
        secondary = emotions.get("secondary_emotions", [])
        
        base_insight = self.emotions_map.get(primary, self.emotions_map["Neutral"])
        
        understanding = base_insight["understanding"]
        if secondary:
            understanding += f" I also notice hints of {', '.join(secondary)} beneath the surface."
            
        context = base_insight["context"]
        if keywords:
            context += f" It seems your thoughts are particularly focused on {', '.join(keywords[:2])}."
            
        reflection = base_insight["reflection"]
        
        return {
            "understanding": understanding,
            "context": context,
            "reflection": reflection
        }
