"""
Voice Command Shopping Assistant - Python Backend Engine
Wit.ai Natural Language Processing & Google Text-to-Speech (gTTS) Integration
"""

import os
import re
import tempfile
from gtts import gTTS
try:
    from playsound import playsound
except ImportError:
    playsound = None

try:
    from wit import Wit
except ImportError:
    Wit = None


class VoiceAssistantNLP:
    """
    NLP Intent Classifier & Entity Extractor with Wit.ai and regex fallback.
    """

    def __init__(self, wit_access_token=None):
        self.access_token = wit_access_token or os.environ.get("WIT_ACCESS_TOKEN", "DEMO_TOKEN")
        self.client = Wit(self.access_token) if (Wit and self.access_token != "DEMO_TOKEN") else None

    def parse_command(self, text: str) -> dict:
        """
        Parses text through Wit.ai if available, otherwise falls back to local NLP heuristics.
        """
        if not text or not text.strip():
            return {"intent": "UNKNOWN", "entities": {}, "raw": ""}

        text_clean = text.strip()

        # 1. Wit.ai API call if configured
        if self.client:
            try:
                resp = self.client.message(text_clean)
                intents = resp.get("intents", [])
                intent_name = intents[0]["name"] if intents else "ADD_ITEM"
                return {
                    "intent": intent_name,
                    "entities": resp.get("entities", {}),
                    "raw": text_clean,
                    "confidence": intents[0]["confidence"] if intents else 0.8
                }
            except Exception as e:
                print(f"[NLP Warning] Wit.ai API call failed: {e}. Using local NLP fallback.")

        # 2. Local Python NLP Rule-Based Parser
        return self._local_nlp_fallback(text_clean)

    def _local_nlp_fallback(self, text: str) -> dict:
        lower = text.lower()
        
        # Intent Detection
        intent = "ADD_ITEM"
        if re.search(r"\b(substitute|alternative|replace|instead of)\b", lower):
            intent = "FIND_SUBSTITUTE"
        elif re.search(r"^(find|search|look for|show me)\b", lower) or re.search(r"under \$\d+", lower):
            intent = "SEARCH_CATALOG"
        elif re.search(r"\b(recommend|suggest|what should i buy|in season)\b", lower):
            intent = "GET_RECOMMENDATIONS"
        elif re.search(r"\b(remove|delete|drop|take off)\b", lower):
            intent = "REMOVE_ITEM"
        elif re.search(r"^(change|update|set|make)\b", lower):
            intent = "UPDATE_QUANTITY"
        elif re.search(r"\b(clear all|empty list|clear cart)\b", lower):
            intent = "CLEAR_LIST"

        # Price ceiling
        price_match = re.search(r"under\s*\$?(\d+(?:\.\d{1,2})?)", lower)
        max_price = float(price_match.group(1)) if price_match else None

        # Quantity
        qty_match = re.search(r"\b(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\b", lower)
        qty = float(qty_match.group(1)) if qty_match else 1.0

        return {
            "intent": intent,
            "raw": text,
            "quantity": qty,
            "max_price": max_price,
            "confidence": 0.9
        }


class VoiceSynthesizer:
    """
    gTTS (Google Text-To-Speech) and playsound synthesizer for Python.
    """

    @staticmethod
    def speak(text: str, lang="en", play_audio=False) -> str:
        """
        Converts text to speech and returns the audio filepath.
        """
        try:
            tts = gTTS(text=text, lang=lang, slow=False)
            temp_file = os.path.join(tempfile.gettempdir(), f"voice_cart_{os.getpid()}.mp3")
            tts.save(temp_file)
            
            if play_audio and playsound:
                playsound(temp_file)
                
            return temp_file
        except Exception as e:
            print(f"[TTS Error] {e}")
            return ""


if __name__ == "__main__":
    nlp = VoiceAssistantNLP()
    samples = [
        "Add 2 gallons of organic whole milk to my cart",
        "Find toothpaste under $5",
        "What can I substitute for almond milk?",
        "Remove avocados from my list"
    ]

    print("=== Testing Voice Assistant Python NLP Engine ===")
    for s in samples:
        result = nlp.parse_command(s)
        print(f"Input: '{s}' -> Parsed Intent: {result['intent']}")
