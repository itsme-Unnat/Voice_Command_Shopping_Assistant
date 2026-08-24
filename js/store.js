/**
 * Voice Command Shopping Assistant - Reactive State Store
 * Manages shopping list items, auto-categorization, purchase history,
 * user preferences, budget calculations, and export formatting.
 */

class ShoppingStore {
  constructor() {
    this.STORAGE_KEY_LIST = "vcs_shopping_list_v1";
    this.STORAGE_KEY_HISTORY = "vcs_shopping_history_v1";
    this.STORAGE_KEY_SETTINGS = "vcs_settings_v1";

    this.listeners = [];

    // Initial state loaded from LocalStorage or defaults
    this.items = this.load(this.STORAGE_KEY_LIST, this.getDefaultItems());
    this.history = this.load(this.STORAGE_KEY_HISTORY, this.getDefaultHistory());
    this.settings = this.load(this.STORAGE_KEY_SETTINGS, {
      language: "en-US",
      voiceFeedback: true,
      voiceSpeed: 1.0,
      theme: "dark",
      currency: "$",
      budgetLimit: 50.00
    });
  }

  // Subscribe to state updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify(eventType, payload) {
    this.save();
    this.listeners.forEach(fn => fn(eventType, payload, this.getState()));
  }

  getState() {
    return {
      items: this.items,
      history: this.history,
      settings: this.settings,
      stats: this.getStats(),
      categorizedItems: this.getCategorizedItems()
    };
  }

  // Add Item to Shopping List
  addItem({ name, quantity = 1, unit = "item", category = null, price = null, image = null, tags = [] }) {
    if (!name || !name.trim()) return null;
    const cleanName = name.trim();

    // Check if item already exists in list to increment quantity
    const existingIndex = this.items.findIndex(
      i => i.name.toLowerCase() === cleanName.toLowerCase()
    );

    let updatedItem = null;

    if (existingIndex >= 0) {
      // Increment existing quantity
      this.items[existingIndex].quantity = (parseFloat(this.items[existingIndex].quantity) || 1) + (parseFloat(quantity) || 1);
      if (unit && unit !== "item") {
        this.items[existingIndex].unit = unit;
      }
      updatedItem = this.items[existingIndex];
      this.notify("ITEM_UPDATED", updatedItem);
    } else {
      // Create new item
      const catalogMatch = (typeof CatalogService !== "undefined") ? CatalogService.findBestMatch(cleanName) : null;
      const finalCategory = category || (catalogMatch ? catalogMatch.category : "Pantry");
      const finalPrice = price || (catalogMatch ? catalogMatch.price : 2.99);
      const finalImage = image || (catalogMatch ? catalogMatch.image : "🛒");
      const finalUnit = unit || (catalogMatch ? catalogMatch.unit : "item");

      const newItem = {
        id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        name: catalogMatch ? catalogMatch.name : cleanName,
        quantity: parseFloat(quantity) || 1,
        unit: finalUnit,
        category: finalCategory,
        price: parseFloat(finalPrice),
        image: finalImage,
        tags: tags.length > 0 ? tags : (catalogMatch ? catalogMatch.tags : []),
        completed: false,
        addedAt: Date.now()
      };

      this.items.unshift(newItem);
      updatedItem = newItem;
      this.notify("ITEM_ADDED", newItem);
    }

    return updatedItem;
  }

  // Remove Item from Shopping List
  removeItem(nameOrId) {
    if (!nameOrId) return null;
    const term = nameOrId.trim().toLowerCase();

    const initialLength = this.items.length;
    let removedItem = null;

    const index = this.items.findIndex(i => i.id === term || i.name.toLowerCase().includes(term));
    if (index >= 0) {
      removedItem = this.items[index];
      this.items.splice(index, 1);
      this.notify("ITEM_REMOVED", removedItem);
      return removedItem;
    }

    return null;
  }

  // Update item quantity
  updateQuantity(nameOrId, newQuantity, newUnit = null) {
    const term = (nameOrId || "").trim().toLowerCase();
    const item = this.items.find(i => i.id === term || i.name.toLowerCase().includes(term));

    if (item) {
      const q = parseFloat(newQuantity);
      if (q <= 0) {
        return this.removeItem(item.id);
      }
      item.quantity = q;
      if (newUnit) item.unit = newUnit;
      this.notify("ITEM_UPDATED", item);
      return item;
    }
    return null;
  }

  // Toggle item completed state
  toggleComplete(id) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.completed = !item.completed;
      if (item.completed) {
        this.recordPurchase(item.name);
      }
      this.notify("ITEM_TOGGLED", item);
      return item;
    }
    return null;
  }

  // Clear completed or all items
  clear(all = false) {
    if (all) {
      this.items = [];
    } else {
      this.items = this.items.filter(i => !i.completed);
    }
    this.notify("LIST_CLEARED", { all });
  }

  // Record item purchase into history for smart replenishment
  recordPurchase(itemName) {
    const existing = this.history.find(h => h.name.toLowerCase() === itemName.toLowerCase());
    if (existing) {
      existing.lastPurchased = Date.now();
      existing.purchaseCount = (existing.purchaseCount || 1) + 1;
    } else {
      this.history.push({
        name: itemName,
        lastPurchased: Date.now(),
        purchaseCount: 1,
        frequencyDays: 7
      });
    }
    this.save();
  }

  // Get items grouped by category
  getCategorizedItems() {
    const groups = {};
    this.items.forEach(item => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }

  // Compute stats: total cost, item count, completed count, estimated savings
  getStats() {
    let totalEstimatedCost = 0;
    let totalItems = 0;
    let completedItems = 0;

    this.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 1;
      const price = parseFloat(item.price) || 0;
      totalEstimatedCost += qty * price;
      totalItems += 1;
      if (item.completed) completedItems += 1;
    });

    const budgetRemaining = Math.max(0, (this.settings.budgetLimit || 50) - totalEstimatedCost);

    return {
      totalEstimatedCost: totalEstimatedCost.toFixed(2),
      totalItems,
      completedItems,
      remainingItems: totalItems - completedItems,
      budgetLimit: (this.settings.budgetLimit || 50).toFixed(2),
      budgetRemaining: budgetRemaining.toFixed(2),
      isOverBudget: totalEstimatedCost > (this.settings.budgetLimit || 50)
    };
  }

  // Update app settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.notify("SETTINGS_UPDATED", this.settings);
  }

  // Export List formatters
  exportToText() {
    const stats = this.getStats();
    let text = `🛒 VOICE SHOPPING LIST (${new Date().toLocaleDateString()})\n`;
    text += `Total Estimated: $${stats.totalEstimatedCost} (${stats.totalItems} items)\n\n`;

    const groups = this.getCategorizedItems();
    for (const [category, items] of Object.entries(groups)) {
      text += `📂 ${category.toUpperCase()}:\n`;
      items.forEach(item => {
        const check = item.completed ? "✅" : "⬜";
        text += `  ${check} ${item.quantity} ${item.unit} ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      text += "\n";
    }

    return text;
  }

  exportToWhatsAppUrl() {
    const text = this.exportToText();
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  // LocalStorage Persistence
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY_LIST, JSON.stringify(this.items));
      localStorage.setItem(this.STORAGE_KEY_HISTORY, JSON.stringify(this.history));
      localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // Default starter data
  getDefaultItems() {
    return [
      {
        id: "item-01",
        name: "Organic Whole Milk",
        quantity: 1,
        unit: "gallon",
        category: "Dairy & Eggs",
        price: 4.29,
        image: "🥛",
        tags: ["organic", "dairy"],
        completed: false,
        addedAt: Date.now() - 3600000
      },
      {
        id: "item-02",
        name: "Organic Hass Avocados",
        quantity: 2,
        unit: "pack of 4",
        category: "Fresh Produce",
        price: 4.99,
        image: "🥑",
        tags: ["organic", "produce"],
        completed: false,
        addedAt: Date.now() - 7200000
      },
      {
        id: "item-03",
        name: "Artisan Sourdough Loaf",
        quantity: 1,
        unit: "loaf",
        category: "Bakery",
        price: 4.49,
        image: "🍞",
        tags: ["bakery"],
        completed: true,
        addedAt: Date.now() - 86400000
      }
    ];
  }

  getDefaultHistory() {
    const now = Date.now();
    return [
      { name: "Organic Whole Milk", lastPurchased: now - 8 * 86400000, frequencyDays: 6, purchaseCount: 12 },
      { name: "Artisan Sourdough Loaf", lastPurchased: now - 7 * 86400000, frequencyDays: 5, purchaseCount: 8 },
      { name: "Pasture-Raised Large Brown Eggs", lastPurchased: now - 9 * 86400000, frequencyDays: 7, purchaseCount: 15 },
      { name: "Fresh Cavendish Bananas", lastPurchased: now - 5 * 86400000, frequencyDays: 4, purchaseCount: 20 },
      { name: "Whole Bean Medium Roast Coffee", lastPurchased: now - 16 * 86400000, frequencyDays: 14, purchaseCount: 5 }
    ];
  }
}

// Global store instance
const store = new ShoppingStore();

// Export for Node/CommonJS if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ShoppingStore, store };
}
