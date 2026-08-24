# 🛒 Voice Command Shopping Assistant

> An intelligent, voice-activated grocery shopping assistant and list manager powered by Natural Language Processing (NLP), smart replenishment prediction, seasonal recommendations, substitute intelligence, and real-time audio visualization.

![UI Theme](https://img.shields.io/badge/Theme-Obsidian%20Glassmorphism-10b981)
![Speech API](https://img.shields.io/badge/Voice-Web%20Speech%20API-06b6d4)
![NLP](https://img.shields.io/badge/NLP-Multilingual%20Parser-8b5cf6)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000)
![Persistence](https://img.shields.io/badge/Storage-LocalStorage-f59e0b)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌟 Key Features

### 1. 🎙️ Multilingual Voice Input & NLP Engine
- **Flexible Natural Language Processing**: Understands varied human phrasing (e.g., *"I want to buy 3 gala apples"*, *"Add 2 bottles of olive oil to my cart"*, *"Put almond milk in my list"*).
- **Entity Extraction**: Automatically extracts item names, numeric quantities (digits and written words like "half a dozen"), measurement units (`gallons`, `bottles`, `lbs`, `kg`, `packs`), price filters (`"under $5"`), and dietary tags (`organic`, `gluten-free`, `vegan`, `keto`).
- **Multilingual Support**: Real-time voice command recognition and parsing for:
  - 🇺🇸 **English** (`en-US`)
  - 🇪🇸 **Spanish** (`es-ES`): *"Agrega 2 litros de leche"*, *"Eliminar manzanas"*
  - 🇫🇷 **French** (`fr-FR`): *"Ajouter 3 bananes"*, *"Supprimer le lait"*
  - 🇩🇪 **German** (`de-DE`): *"Füge 2 Flaschen Wasser hinzu"*, *"Suche Äpfel unter 3 Euro"*
  - 🇮🇳 **Hindi** (`hi-IN`): *"2 kilo seb add karo"*, *"doodh hata do list se"*
- **Audio Waveform Visualizer**: Live HTML5 Canvas audio spectrum reactive visualizer powered by Web Audio API.
- **Natural Voice Spoken Feedback**: Text-to-Speech (TTS) auditory confirmations with customizable rate and voice toggle.

---

### 2. 💡 Smart Suggestions Engine
- **Replenishment Prediction ("Running Low")**: Predicts household staple exhaustion based on purchase history cadence and days elapsed (e.g., *"It looks like you're running low on bread or eggs"*).
- **Seasonal Recommendations & Deals**: Curated picks matching current seasonal freshness (Spring, Summer, Autumn, Winter) with discount alerts.
- **Smart Substitutes & Swaps**: 1-click alternative suggestions when an item is out of stock or for dietary requirements (e.g., Almond Milk / Oat Milk for Dairy Milk; Gluten-Free Bread; Vegan Eggs).
- **Frequently Bought Together**: Recipe & basket pairings (e.g., recommending Marinara Sauce and Parmesan when Pasta is added).

---

### 3. 📋 Intelligent Shopping List Management
- **Automatic Smart Categorization**: Organizes items into 8 aisles (*Fresh Produce, Dairy & Eggs, Bakery, Pantry & Grains, Beverages, Snacks, Frozen, Household*).
- **Quantity & Unit Steppers**: Easy + / - controls and custom unit management.
- **Real-Time Cost & Budget Meter**: Live subtotal tracking with visual progress indicator against monthly spending targets.
- **Check-off & Strikethrough**: Mark items as completed while shopping.
- **Persistent Storage**: Retains active list, historical purchase cadence, and settings across browser sessions via `localStorage`.

---

### 4. 🔍 Voice-Activated Search & Catalog
- **100+ Realistic Grocery Items**: Filter by name, dietary preferences (`organic`, `gluten-free`, `vegan`, `keto`), category, or price range.
- **Voice-Powered Filtering**: Say *"Find toothpaste under $5"* or *"Show snacks below 4 dollars"* to filter instantly.

---

### 5. 🧑‍🍳 Hands-Free "Voice-Only HUD" Mode
- Fullscreen ambient HUD with high-contrast typography and pulsing visualizer designed for kitchen or mobile hands-free use.

---

### 6. 📤 Export & Share
- **One-Click WhatsApp Sharing**: Formatted grocery checklist ready to send to family members.
- **Printable Receipt**: Clean printable view.
- **Clipboard & JSON Export**: Instant copy for note apps.

---

## 🚀 Quick Start & Deployment Guide

### Option 1: 1-Click Deployment to Vercel (Production Cloud)
This repository is configured with `vercel.json` and Vercel Python Serverless API functions:
1. Log into [Vercel](https://vercel.com) and click **"Add New" $\rightarrow$ "Project"**.
2. Select your GitHub repository: `itsme-Unnat/Voice_Command_Shopping_Assistant`.
3. Click **Deploy**. Vercel will automatically configure both the static web client and serverless `/api` endpoints!

### Option 2: Direct In-Browser Launch (Zero Setup)
Simply open `index.html` in Google Chrome, Microsoft Edge, Brave, or any modern web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

### Option 3: Run with Python Local Server
```bash
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Option 4: Run with Python Backend Reference
```bash
cd backend
python app.py
# Server starts on http://localhost:8000 with REST API endpoints
```

---

## 🗣️ Voice Command Reference & Cheat Sheet

| Intent | Sample Voice Commands | Result |
| :--- | :--- | :--- |
| **Add Item** | *"Add 2 bottles of olive oil"*<br>*"I need 3 organic avocados"*<br>*"Buy 1 gallon whole milk"* | Adds item with quantity, unit & auto-category |
| **Remove Item** | *"Remove avocados from my list"*<br>*"Delete bread"* | Removes matching item from cart |
| **Update Quantity** | *"Change apples to 6"*<br>*"Set milk to 2 gallons"* | Updates existing item quantity |
| **Voice Search** | *"Find toothpaste under $5"*<br>*"Show organic snacks"* | Filters catalog by query & price ceiling |
| **Substitute** | *"What can I substitute for almond milk?"*<br>*"Find alternative to butter"* | Opens smart substitute comparison modal |
| **Suggestions** | *"What should I buy?"*<br>*"Show seasonal picks"* | Displays replenishment & seasonal picks |
| **Check Item** | *"Mark bread as done"*<br>*"Check off eggs"* | Toggles completion checkmark |
| **Clear List** | *"Clear shopping list"*<br>*"Empty cart"* | Clears list |
| **Hands-Free Mode** | *"Start hands free mode"* | Opens fullscreen Voice-Only HUD |
| **Multilingual** | *"Agrega 2 litros de leche"* (ES)<br>*"2 kilo seb add karo"* (HI) | Parses in specified language |

---

## 🏗️ Project Architecture

```
Voice_Command_Shopping_Assistant/
├── index.html                 # Main Single Page Application UI
├── vercel.json                # Vercel Serverless Routing Configuration
├── requirements.txt           # Vercel Cloud Python Dependencies
├── api/                       # Vercel Serverless Functions
│   └── index.py               # Serverless Python API Handler
├── css/
│   └── styles.css             # Glassmorphic Dark Design System & Animations
├── js/
│   ├── app.js                 # UI Controller & Event Orchestration
│   ├── speech.js              # Web Speech API (Recognition + Synthesis) & Canvas Visualizer
│   ├── nlp.js                 # Multilingual Natural Language Parser & Entity Extractor
│   ├── catalog.js             # 100+ Mock Grocery Product Catalog & Search Service
│   ├── suggestions.js         # Replenishment, Seasonal & Substitute Recommendation Engine
│   └── store.js               # Reactive State Store & LocalStorage Persistence
├── backend/                   # Standalone Python / Django Reference Implementation
│   ├── requirements.txt       # Dependencies (django, gTTs, playsound, wit, gunicorn)
│   ├── app.py                 # Standalone API server & static host
│   └── nlp_wit.py             # Wit.ai NLP & gTTS Speech engine module
├── README.md                  # Comprehensive Documentation
└── SUBMISSION_WRITEUP.md      # 200-word Assessment Evaluation Write-up
```

---

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Modules), Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Grid & Flexbox).
- **Speech Technologies**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Web Audio API (`AudioContext`, `AnalyserNode`).
- **Serverless & Cloud**: Vercel Python Runtime (`BaseHTTPRequestHandler`), `vercel.json` rewrites.
- **Data Persistence**: HTML5 `localStorage`.
- **Backend Reference**: Python 3, Django / HTTP Server, Wit.ai, Google Text-to-Speech (`gTTS`).

---

## 📄 License
This project is licensed under the MIT License.
