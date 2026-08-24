"""
Voice Command Shopping Assistant - Vercel Serverless Function API
Entrypoint for Vercel Serverless Python Runtime.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import re

# Optional Wit.ai integration
WIT_ACCESS_TOKEN = os.environ.get("WIT_ACCESS_TOKEN")
wit_client = None
if WIT_ACCESS_TOKEN:
    try:
        from wit import Wit
        wit_client = Wit(WIT_ACCESS_TOKEN)
    except Exception as e:
        print(f"[Vercel Serverless Warning] Could not init Wit: {e}")


def parse_intent_and_entities(text: str) -> dict:
    """
    Parses voice text into intents, entities, quantity, and price constraints.
    """
    if not text or not text.strip():
        return {"intent": "UNKNOWN", "raw": "", "confidence": 0}

    text_clean = text.strip()
    lower = text_clean.lower()

    # 1. Wit.ai Cloud NLP if token configured
    if wit_client:
        try:
            resp = wit_client.message(text_clean)
            intents = resp.get("intents", [])
            intent_name = intents[0]["name"] if intents else "ADD_ITEM"
            return {
                "intent": intent_name,
                "entities": resp.get("entities", {}),
                "raw": text_clean,
                "confidence": intents[0]["confidence"] if intents else 0.85
            }
        except Exception as err:
            print(f"[Wit.ai Error] {err}")

    # 2. Local Multilingual Rule-Based Parser
    intent = "ADD_ITEM"
    if re.search(r"\b(substitute|alternative|replace|instead of|swap|sustituir|remplacer|ersatz)\b", lower):
        intent = "FIND_SUBSTITUTE"
    elif re.search(r"^(find|search|look for|show me|buscar|cherche|suche|dhundo)\b", lower) or re.search(r"under \$\d+|under \d+ dollars|below \$\d+", lower):
        intent = "SEARCH_CATALOG"
    elif re.search(r"\b(recommend|suggest|what should i buy|in season|seasonal|running low|sugerencias)\b", lower):
        intent = "GET_RECOMMENDATIONS"
    elif re.search(r"\b(clear (all|list|cart)|empty (list|cart)|borrar todo|vaciar lista|alles löschen)\b", lower):
        intent = "CLEAR_LIST"
    elif re.search(r"\b(remove|delete|drop|take off|eliminar|quitar|supprimer|entferne|hata do)\b", lower):
        intent = "REMOVE_ITEM"
    elif re.search(r"^(change|update|set|make|cambiar|modifier|ändern|badlo)\b", lower):
        intent = "UPDATE_QUANTITY"
    elif re.search(r"^(check off|mark|done|cross out|taché|marcar|done karo)\b", lower):
        intent = "CHECK_ITEM"
    elif re.search(r"\b(export|share|whatsapp|print list|compartir)\b", lower):
        intent = "EXPORT_LIST"

    # Price Constraint
    price_match = re.search(r"(?:under|below|less than|menos de|unter)\s*(?:\$|€|£)?\s*(\d+(?:\.\d{1,2})?)", lower)
    max_price = float(price_match.group(1)) if price_match else None

    # Quantity & Unit
    qty_match = re.search(r"\b(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\b", lower)
    quantity = float(qty_match.group(1)) if qty_match else 1.0
    unit = (qty_match.group(2) or "item") if qty_match else "item"

    # Target Item Name Extraction
    clean_item = re.sub(r"^(add|i need|i want to buy|buy|get|put|remove|delete|find|search for|agrega|comprar|quitar)\s+", "", text_clean, flags=re.IGNORECASE)
    clean_item = re.sub(r"\s+(to|in|from|on)\s+(my\s+)?(list|cart|shopping list|basket)$", "", clean_item, flags=re.IGNORECASE)
    clean_item = re.sub(r"(?:under|below|less than)\s*\$?\d+(\.\d+)?", "", clean_item, flags=re.IGNORECASE).strip()

    return {
        "intent": intent,
        "raw": text_clean,
        "item": clean_item,
        "quantity": quantity,
        "unit": unit,
        "maxPrice": max_price,
        "confidence": 0.95
    }


class handler(BaseHTTPRequestHandler):
    """
    Standard Vercel Serverless Function Handler
    """

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        
        response = {
            "status": "healthy",
            "service": "Voice Command Shopping Assistant Serverless API",
            "runtime": "Vercel Python Serverless Function",
            "version": "2.0.0"
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

        try:
            body = json.loads(post_data) if post_data.strip() else {}
            command_text = body.get("text", "")

            result = parse_intent_and_entities(command_text)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))

        except Exception as err:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(err)}).encode("utf-8"))
