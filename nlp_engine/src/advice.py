class AdviceGenerator:
    def __init__(self):
        self.advice_map = {
            "joy": {
                "suggestions": [
                    "Take a moment to fully savor this feeling and perhaps write down one thing you're most grateful for.",
                    "Consider sharing this positive energy with a friend or loved one.",
                    "Reflect on what led to this joy so you can nurture similar experiences in the future."
                ],
                "closing": "Remember to hold onto this feeling—it's a beautiful reflection of your journey."
            },
            "sadness": {
                "suggestions": [
                    "Be exceptionally gentle with yourself today. It's okay to slow down.",
                    "Consider reaching out to someone you trust, even just to say hello.",
                    "Engage in a small act of self-care, like a warm drink or a short walk."
                ],
                "closing": "Tough days don't define your path. You're doing the best you can, and that is enough."
            },
            "anger": {
                "suggestions": [
                    "Try using a physical outlet like exercise or even just deep, intentional breathing.",
                    "Write down your frustrations in a 'raw' draft and then set it aside to gain distance.",
                    "Is there a small, constructive step you can take to address the source of this feeling?"
                ],
                "closing": "Your feelings are valid. Take the time you need to find your center again."
            },
            "fear": {
                "suggestions": [
                    "Focus on the things you can control right now, however small they may be.",
                    "Try a grounding exercise: name five things you can see and four things you can touch.",
                    "Remember that anxiety is often a protective response; thank your mind for trying to help, but remind it that you are safe."
                ],
                "closing": "One step at a time. You have the strength to navigate this uncertainty."
            },
            "exhaustion": {
                "suggestions": [
                    "Prioritize rest above all else today. The world can wait for a moment.",
                    "Boundaries are a form of self-love. It's okay to say no to extra demands.",
                    "Try to do one thing that truly recharges you, however brief it may be."
                ],
                "closing": "You've been carrying a lot. Give yourself permission to simply be."
            },
            "Neutral": {
                "suggestions": [
                    "This calm state is a great time for some light planning or starting a new book.",
                    "Reflect on how your body feels during this peaceful interval.",
                    "Maybe use this time to set a gentle intention for the rest of your week."
                ],
                "closing": "Balance is a gift. Enjoy this steady moment in your day."
            }
        }

    def get_advice(self, primary_emotion):
        advice_data = self.advice_map.get(primary_emotion, self.advice_map["Neutral"])
        return advice_data
