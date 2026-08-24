"""
Voice Command Shopping Assistant - Python Web API Server
Serves static web files and provides REST API endpoints for NLP, Speech, and Catalog.
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from nlp_wit import VoiceAssistantNLP

PORT = int(os.environ.get("PORT", 8000))
nlp_engine = VoiceAssistantNLP()

class VoiceCartRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    HTTP Request Handler that serves the frontend web application
    and responds to NLP / Voice API endpoints.
    """

    def __init__(self, *args, **kwargs):
        # Serve from parent workspace directory
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        super().__init__(*args, directory=parent_dir, **kwargs)

    def do_POST(self):
        if self.path == "/api/nlp/parse":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            
            try:
                payload = json.loads(post_data)
                command_text = payload.get("text", "")
                result = nlp_engine.parse_command(command_text)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


if __name__ == "__main__":
    print(f"=======================================================")
    print(f"🎙️  Voice Command Shopping Assistant Server Started")
    print(f"🌐  Open in browser: http://localhost:{PORT}")
    print(f"=======================================================")
    with socketserver.TCPServer(("", PORT), VoiceCartRequestHandler) as httpd:
        httpd.serve_forever()
