/**
 * Voice Command Shopping Assistant - Smart Suggestions Engine
 * Features:
 * 1. Replenishment Prediction (History-based "Running Low" alerts)
 * 2. Dynamic Seasonal & Deals Recommendations
 * 3. Dietary & Smart Substitute Recommendations
 * 4. Complementary Pairing Suggestions ("Frequently Bought Together")
 */

const SuggestionsEngine = {
  // Frequently Bought Together pairings
  COMPLEMENTARY_PAIRS: {
    "pasta": ["Organic Marinara Pasta Sauce", "Parmigiano Reggiano Wedge", "Fresh Garlic Bulbs"],
    "spaghetti": ["Organic Marinara Pasta Sauce", "Parmigiano Reggiano Wedge"],
    "coffee": ["Oat Milk (Barista Blend)", "Natural Unbleached Coffee Filters", "Organic Whole Milk"],
    "bread": ["Creamy Peanut Butter", "Salted Sweet Cream Butter", "Organic Extra Virgin Olive Oil"],
    "avocados": ["Vine-Ripened Roma Tomatoes", "Fresh Lemon", "Yellow Onions"],
    "tortilla chips": ["Greek Olive Hummus Dip", "Organic Hass Avocados"],
    "burger": ["Brioche Burger Buns", "Sharp Cheddar Cheese Block"],
    "tea": ["Raw Organic Honey", "Fresh Lemon"],
    "pancake": ["Pure Maple Syrup (Grade A)", "Fresh Strawberries"]
  },

  // Replenishment cadence in days for common grocery staples
  STAPLE_CADENCE: {
    "Organic Whole Milk": 6,
    "Almond Milk (Unsweetened)": 8,
    "Oat Milk (Barista Blend)": 8,
    "Pasture-Raised Large Brown Eggs": 7,
    "Artisan Sourdough Loaf": 5,
    "100% Whole Wheat Bread": 6,
    "Fresh Cavendish Bananas": 4,
    "Organic Baby Spinach": 5,
    "Whole Bean Medium Roast Coffee": 14,
    "Salted Sweet Cream Butter": 18,
    "Purified Bottled Water": 10
  },

  // 1. History-Based Replenishment Predictions
  getReplenishmentSuggestions(shoppingHistory = [], currentList = []) {
    const currentItemNames = currentList.map(item => item.name.toLowerCase());
    const recommendations = [];
    const now = Date.now();

    // Default mock history if none exists yet for instant rich demonstration
    const effectiveHistory = shoppingHistory.length > 0 ? shoppingHistory : [
      { name: "Organic Whole Milk", lastPurchased: now - 7 * 86400000, frequencyDays: 6 },
      { name: "Artisan Sourdough Loaf", lastPurchased: now - 6 * 86400000, frequencyDays: 5 },
      { name: "Pasture-Raised Large Brown Eggs", lastPurchased: now - 8 * 86400000, frequencyDays: 7 },
      { name: "Fresh Cavendish Bananas", lastPurchased: now - 5 * 86400000, frequencyDays: 4 },
      { name: "Whole Bean Medium Roast Coffee", lastPurchased: now - 15 * 86400000, frequencyDays: 14 }
    ];

    effectiveHistory.forEach(record => {
      const daysSince = Math.floor((now - (record.lastPurchased || now)) / 86400000);
      const cadence = record.frequencyDays || this.STAPLE_CADENCE[record.name] || 7;
      const isOverdue = daysSince >= cadence;

      // Only recommend if not already in the active shopping list
      if (isOverdue && !currentItemNames.includes(record.name.toLowerCase())) {
        const catalogItem = CatalogService.findBestMatch(record.name);
        recommendations.push({
          type: "replenishment",
          title: `Running Low: ${record.name}`,
          reason: `Last bought ${daysSince} days ago (usually every ${cadence} days)`,
          urgency: daysSince > cadence + 2 ? "high" : "medium",
          product: catalogItem || {
            name: record.name,
            price: 3.99,
            category: "Pantry",
            image: "📦",
            unit: "item"
          }
        });
      }
    });

    return recommendations;
  },

  // 2. Seasonal & Deals Recommendations
  getSeasonalRecommendations(currentSeason = null) {
    // Determine season from month if not provided
    const season = currentSeason || this.getCurrentSeason();
    const seasonalItems = CatalogService.search({ season });

    return seasonalItems.slice(0, 6).map(item => ({
      type: "seasonal",
      title: `${item.name}`,
      reason: `Peak ${this.capitalize(season)} Freshness • Special Seasonal Price`,
      badge: `${season.toUpperCase()} PICK`,
      product: item
    }));
  },

  // 3. Smart Substitutes Engine
  getSubstituteSuggestions(itemName) {
    if (!itemName) return [];
    const substitutes = CatalogService.findSubstitutes(itemName);

    return substitutes.map(sub => ({
      type: "substitute",
      originalItem: itemName,
      title: sub.name,
      reason: `Top alternative to "${itemName}" • Rating ${sub.rating || 4.7}★`,
      product: sub
    }));
  },

  // 4. Complementary Pairings ("Frequently Bought Together")
  getComplementarySuggestions(currentList = []) {
    const suggestions = [];
    const currentNames = currentList.map(i => i.name.toLowerCase());

    for (const item of currentList) {
      const lower = item.name.toLowerCase();

      for (const [key, companions] of Object.entries(this.COMPLEMENTARY_PAIRS)) {
        if (lower.includes(key)) {
          companions.forEach(companionName => {
            if (!currentNames.includes(companionName.toLowerCase())) {
              const matched = CatalogService.findBestMatch(companionName);
              if (matched && !suggestions.some(s => s.product.name === matched.name)) {
                suggestions.push({
                  type: "pairing",
                  title: `Pairs well with ${item.name}`,
                  reason: `Frequently bought together with ${item.name}`,
                  product: matched
                });
              }
            }
          });
        }
      }
    }

    return suggestions.slice(0, 4);
  },

  // Helper to determine current season based on calendar month
  getCurrentSeason() {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "autumn";
    return "winter";
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// Export for Node/CommonJS if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SuggestionsEngine };
}
