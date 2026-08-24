/**
 * Voice Command Shopping Assistant - Natural Language Processing (NLP) Engine
 * Understands flexible user phrases, extracts intents, entities (items, quantities,
 * units, price filters, dietary tags), and supports multiple languages.
 */

const NLPEngine = {
  // Number word translation dictionary across languages
  NUMBER_WORDS: {
    // English
    "a": 1, "an": 1, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "dozen": 12, "half a dozen": 6, "half dozen": 6,
    "couple of": 2, "few": 3,
    // Spanish
    "un": 1, "una": 1, "uno": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
    "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10, "docena": 12,
    // French
    "un": 1, "une": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5,
    "six": 6, "sept": 7, "huit": 8, "neuf": 9, "dix": 10, "douzaine": 12,
    // German
    "eins": 1, "eine": 1, "ein": 1, "zwei": 2, "drei": 3, "vier": 4, "fünf": 5,
    "sechs": 6, "sieben": 7, "acht": 8, "neun": 9, "zehn": 10, "dutzend": 12,
    // Hindi (Transliterated & Phonetic)
    "ek": 1, "do": 2, "teen": 3, "char": 4, "paanch": 5,
    "che": 6, "saat": 7, "aath": 8, "nau": 9, "das": 10, "darjan": 12
  },

  // Units dictionary
  UNIT_ALIASES: {
    "bottle": ["bottle", "bottles", "botella", "botellas", "bouteille", "bouteilles", "flasche", "flaschen"],
    "gallon": ["gallon", "gallons", "galón", "galones"],
    "liter": ["liter", "liters", "litre", "litres", "litro", "litros", "l"],
    "pack": ["pack", "packs", "package", "packages", "paquete", "paquetes", "paquet", "packung"],
    "bag": ["bag", "bags", "bolsa", "bolsas", "sac", "sacs", "beutel", "tüte"],
    "box": ["box", "boxes", "caja", "cajas", "boîte", "boîtes", "karton"],
    "can": ["can", "cans", "lata", "latas", "boîte de conserve", "dose", "dosen"],
    "jar": ["jar", "jars", "frasco", "frascos", "bocal", "glas"],
    "loaf": ["loaf", "loaves", "hogaza", "pain", "laib"],
    "dozen": ["dozen", "dozens", "docena", "docenas", "douzaine", "dutzend", "darjan"],
    "lb": ["lb", "lbs", "pound", "pounds", "libra", "libras", "livre"],
    "kg": ["kg", "kgs", "kilo", "kilos", "kilogram", "kilograms", "kilo"],
    "g": ["g", "gram", "grams", "gramo", "gramos", "gramme", "grammes"],
    "oz": ["oz", "ounce", "ounces", "onza", "onzas"],
    "tub": ["tub", "tubs", "tina", "pot"],
    "bunch": ["bunch", "bunches", "manojo", "botte", "strauß"]
  },

  // Stop words to remove when extracting item names
  STOP_WORDS: [
    "i", "need", "want", "to", "buy", "get", "add", "put", "please", "can", "you",
    "the", "a", "an", "some", "my", "our", "list", "cart", "shopping", "basket",
    "on", "in", "into", "for", "me", "from", "of",
    // Spanish
    "por", "favor", "quiero", "necesito", "comprar", "agregar", "añadir", "poner",
    "en", "mi", "lista", "el", "la", "los", "las", "un", "una", "unos", "unas", "de",
    // French
    "s'il", "vous", "plaît", "svp", "je", "veux", "voudrais", "acheter", "ajouter",
    "mettre", "dans", "ma", "liste", "le", "la", "les", "du", "de", "des",
    // German
    "bitte", "ich", "brauche", "möchte", "kaufen", "hinzufügen", "in", "meine",
    "meinen", "meinem", "einkaufsliste", "liste", "den", "die", "das", "ein", "eine",
    // Hindi
    "kripya", "mujhe", "chahiye", "khareedna", "hai", "daal", "do", "add", "karo", "meri", "list", "mein"
  ],

  // Process any raw input text and return structured intent and entities
  parse(rawText, activeLang = "en-US") {
    if (!rawText || typeof rawText !== "string") {
      return { intent: "UNKNOWN", raw: "", confidence: 0 };
    }

    const text = rawText.trim();
    const lower = text.toLowerCase();

    // 1. Detect Intent
    const intent = this.detectIntent(lower);

    // 2. Extract Price Ceiling ("under $5", "less than 10 dollars", "under 5 bucks")
    const priceConstraint = this.extractPrice(lower);

    // 3. Extract Quantity & Unit
    const { quantity, unit, cleanedAfterQty } = this.extractQuantityAndUnit(lower);

    // 4. Extract Dietary / Special Tags
    const tags = this.extractTags(lower);

    // 5. Extract Target Item
    const targetItem = this.extractItemName(cleanedAfterQty || lower, intent);

    // 6. Match with catalog for auto-categorization and rich metadata
    let matchedProduct = null;
    if (targetItem) {
      matchedProduct = (typeof CatalogService !== "undefined") ? CatalogService.findBestMatch(targetItem) : null;
    }

    // 7. Determine Category
    let category = "Pantry";
    if (matchedProduct) {
      category = matchedProduct.category;
    } else if (targetItem) {
      category = this.inferCategory(targetItem);
    }

    return {
      intent,
      raw: text,
      item: targetItem || (matchedProduct ? matchedProduct.name : ""),
      matchedProduct,
      quantity: quantity || 1,
      unit: unit || (matchedProduct ? matchedProduct.unit : "item"),
      category,
      priceConstraint,
      tags,
      confidence: matchedProduct ? 0.95 : (targetItem ? 0.85 : 0.6)
    };
  },

  detectIntent(text) {
    // Check for clear intent patterns

    // Substitute Intent
    if (
      /substitute|alternative|replace|instead of|swap|sustituir|sustituto|alternativa|remplacer|reemplazo|ersatz|wechseln|badle/.test(text)
    ) {
      return "FIND_SUBSTITUTE";
    }

    // Search Intent
    if (
      /^(find|search|look for|show me|where is|buscar|cherche|trouver|suche|finde|dhundo|dekhao)/.test(text) ||
      /under \$\d+|under \d+ dollars|below \$\d+|less than \$\d+|under \d+ bucks|de menos de|moins de|unter \d+ euro|se kam/.test(text)
    ) {
      return "SEARCH_CATALOG";
    }

    // Recommendation Intent
    if (
      /recommend|suggest|suggestions|what should i buy|what's in season|seasonal|running low|what do i need|sugerencias|recomiéndame|empfehlung|kya khareedu/.test(text)
    ) {
      return "GET_RECOMMENDATIONS";
    }

    // Clear List Intent
    if (
      /^(clear (all|list|cart|shopping list)|delete (all|everything)|empty (list|cart)|borrar todo|vaciar lista|alles löschen|sab hata do)/.test(text)
    ) {
      return "CLEAR_LIST";
    }

    // Remove / Delete Item Intent
    if (
      /^(remove|delete|drop|take off|get rid of|eliminar|quitar|borrar|supprimer|retirer|entferne|lösche|hata do|nikal do)/.test(text) ||
      /from (my )?(list|cart)$/.test(text) && /remove|delete|take/.test(text)
    ) {
      return "REMOVE_ITEM";
    }

    // Update Quantity Intent
    if (
      /^(change|update|set|make|increase|decrease|cambiar|modifier|ändern|badlo)/.test(text) ||
      /to \d+|to a dozen|to couple of/.test(text)
    ) {
      return "UPDATE_QUANTITY";
    }

    // Check / Done Intent
    if (
      /^(check off|check|mark|done|cross out|taché|marcar|marquer|abhaken|done karo)/.test(text)
    ) {
      return "CHECK_ITEM";
    }

    // Voice-Only Mode Toggle Intent
    if (
      /voice( |-)only|hands(-| )free|fullscreen voice|exit voice|start voice mode|modo voz/.test(text)
    ) {
      return "VOICE_MODE";
    }

    // Export / Share Intent
    if (
      /export|share|send (to )?whatsapp|print list|compartir|partager|teilen|bhejo/.test(text)
    ) {
      return "EXPORT_LIST";
    }

    // Add Item Intent (Default high-frequency intent)
    if (
      /^(add|i need|i want|buy|get|put|need|want|pick up|order|bring|agrega|añade|comprar|poner|ajouter|mets|achete|füge|kauf|chahiye|lao)/.test(text) ||
      text.length > 0
    ) {
      return "ADD_ITEM";
    }

    return "UNKNOWN";
  },

  extractPrice(text) {
    // Extracts price patterns like: "under $5", "less than $10.50", "under 5 dollars", "below 7 bucks", "under 4 euros"
    const priceRegex = /(?:under|below|less than|max|menos de|moins de|unter|kam)\s*(?:\$|€|£)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks|usd|euros|€|\$|rupees|rs)?/i;
    const match = text.match(priceRegex);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  },

  extractQuantityAndUnit(text) {
    let quantity = 1;
    let unit = null;
    let workingText = text;

    // Remove price patterns first so numbers in prices don't get confused for quantities
    workingText = workingText.replace(/(?:under|below|less than|menos de|unter)\s*(?:\$|€)?\s*\d+(\.\d+)?/gi, "");

    // 1. Check for number digits (e.g., "2 bottles", "0.5 lb", "3")
    const digitMatch = workingText.match(/\b(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\b/);
    if (digitMatch) {
      const numVal = parseFloat(digitMatch[1]);
      const possibleUnit = (digitMatch[2] || "").toLowerCase();

      // Check if possibleUnit is a recognized unit
      const normalizedUnit = this.matchUnit(possibleUnit);
      if (normalizedUnit) {
        quantity = numVal;
        unit = normalizedUnit;
        workingText = workingText.replace(digitMatch[0], "");
        return { quantity, unit, cleanedAfterQty: workingText };
      } else if (!isNaN(numVal) && numVal > 0) {
        quantity = numVal;
        // Strip just the number from working text
        workingText = workingText.replace(new RegExp(`\\b${digitMatch[1]}\\b`), "");
      }
    }

    // 2. Check for word numbers (e.g., "two gallons", "half a dozen", "three bags", "cinco")
    for (const [word, val] of Object.entries(this.NUMBER_WORDS)) {
      const wordRegex = new RegExp(`\\b${word}\\b`, "i");
      if (wordRegex.test(workingText)) {
        quantity = val;
        workingText = workingText.replace(wordRegex, "");
        break;
      }
    }

    // 3. Check for standalone unit words remaining in workingText
    for (const [canonicalUnit, aliases] of Object.entries(this.UNIT_ALIASES)) {
      for (const alias of aliases) {
        const uRegex = new RegExp(`\\b${alias}\\b`, "i");
        if (uRegex.test(workingText)) {
          unit = canonicalUnit;
          workingText = workingText.replace(uRegex, "");
          break;
        }
      }
      if (unit) break;
    }

    return { quantity, unit, cleanedAfterQty: workingText };
  },

  matchUnit(word) {
    if (!word) return null;
    for (const [canonicalUnit, aliases] of Object.entries(this.UNIT_ALIASES)) {
      if (aliases.includes(word.toLowerCase())) {
        return canonicalUnit;
      }
    }
    return null;
  },

  extractTags(text) {
    const knownTags = ["organic", "gluten-free", "gluten free", "vegan", "dairy-free", "dairy free", "keto", "low carb", "sugar free", "sugar-free", "non-gmo", "fresh", "frozen"];
    const foundTags = [];

    for (const t of knownTags) {
      if (text.includes(t)) {
        foundTags.push(t.replace(/\s+/g, "-"));
      }
    }
    return foundTags;
  },

  extractItemName(text, intent) {
    let clean = text.toLowerCase();

    // Remove intent trigger verbs and common command prefixes
    clean = clean.replace(/^(add|i need|i want to buy|i want|buy|get|put|order|bring|please add|can you add)\s+/i, "");
    clean = clean.replace(/^(remove|delete|drop|take off|get rid of)\s+/i, "");
    clean = clean.replace(/^(find me|find|search for|search|look for|show me)\s+/i, "");
    clean = clean.replace(/^(substitute for|alternative to|replace|swap)\s+/i, "");
    clean = clean.replace(/^(change|update|set|make)\s+/i, "");
    clean = clean.replace(/^(agrega|añade|comprar|quitar|eliminar|buscar|trouver|ajouter|supprimer|füge|entferne)\s+/i, "");

    // Remove trailing location targets
    clean = clean.replace(/\s+(to|in|into|from|on)\s+(my\s+)?(list|cart|shopping list|basket)$/i, "");
    clean = clean.replace(/\s+from\s+my\s+list$/i, "");
    clean = clean.replace(/\s+to\s+my\s+cart$/i, "");
    clean = clean.replace(/\s+ke\s+andar$/i, "");
    clean = clean.replace(/\s+add\s+karo$/i, "");
    clean = clean.replace(/\s+hata\s+do$/i, "");

    // Remove price constraints
    clean = clean.replace(/(?:under|below|less than|menos de|unter|kam)\s*(?:\$|€|£)?\s*\d+(\.\d+)?\s*(?:dollars|bucks|usd|euros|€|\$)?/gi, "");

    // Remove remaining stop words
    const tokens = clean.split(/\s+/).filter(tok => {
      const t = tok.trim();
      return t.length > 0 && !this.STOP_WORDS.includes(t);
    });

    const result = tokens.join(" ").trim();
    return result.length > 0 ? this.capitalize(result) : "";
  },

  inferCategory(itemName) {
    const item = itemName.toLowerCase();

    if (/apple|banana|orange|berry|avocado|spinach|carrot|onion|garlic|potato|lemon|tomato|broccoli|grape|lettuce|cucumber|fruit|vegetable|produce/.test(item)) {
      return "Fresh Produce";
    }
    if (/milk|cheese|butter|egg|yogurt|cream|tofu|dairy|cheddar|parmesan|sour cream/.test(item)) {
      return "Dairy & Eggs";
    }
    if (/bread|bagel|croissant|tortilla|pita|naan|muffin|bun|sourdough|baguette|bakery|roll|pastry/.test(item)) {
      return "Bakery";
    }
    if (/oil|olive oil|rice|quinoa|oat|pasta|spaghetti|sauce|bean|peanut butter|almond butter|honey|syrup|broth|flour|sugar|canned|pantry/.test(item)) {
      return "Pantry";
    }
    if (/water|coffee|tea|juice|kombucha|cider|soda|sparkling|drink|beverage|latte/.test(item)) {
      return "Beverages";
    }
    if (/nut|almond|chip|chocolate|popcorn|hummus|date|bar|pretzel|seed|cracker|snack|cookie|candy/.test(item)) {
      return "Snacks";
    }
    if (/frozen|pizza|ice cream|patty|salmon|shrimp|fish|meat|beef|chicken|waffle|pea|edamame/.test(item)) {
      return "Frozen";
    }
    if (/soap|toothpaste|paper towel|detergent|spray|cleaner|trash bag|bag|shampoo|sponge|household/.test(item)) {
      return "Household";
    }

    return "Pantry";
  },

  capitalize(str) {
    return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
};

// Export for Node/CommonJS if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NLPEngine };
}
