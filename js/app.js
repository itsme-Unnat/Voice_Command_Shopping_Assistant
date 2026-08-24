/**
 * Voice Command Shopping Assistant - Main App Controller
 * Orchestrates Speech Recognition, NLP Parsing, State Management,
 * Smart Suggestions, Search Catalog, Voice HUD, and Interactive UI.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const micBtn = document.getElementById("mic-btn");
  const micIcon = document.getElementById("mic-icon");
  const micStatus = document.getElementById("mic-status");
  const liveTranscriptText = document.getElementById("live-transcript-text");
  const voiceVisualizer = document.getElementById("audio-visualizer");
  const voiceAssistantOrb = document.getElementById("voice-assistant-orb");

  const shoppingListContainer = document.getElementById("shopping-list-container");
  const emptyListState = document.getElementById("empty-list-state");
  const totalCostEl = document.getElementById("total-cost");
  const totalItemsCountEl = document.getElementById("total-items-count");
  const budgetProgressEl = document.getElementById("budget-progress-bar");
  const budgetRemainingEl = document.getElementById("budget-remaining");

  const catalogGrid = document.getElementById("catalog-grid");
  const catalogSearchInput = document.getElementById("catalog-search-input");
  const catalogCategoryFilter = document.getElementById("catalog-category-filter");
  const maxPriceSlider = document.getElementById("max-price-slider");
  const maxPriceValue = document.getElementById("max-price-value");

  const replenishmentList = document.getElementById("replenishment-list");
  const seasonalList = document.getElementById("seasonal-list");
  const complementaryList = document.getElementById("complementary-list");

  const manualCommandInput = document.getElementById("manual-command-input");
  const manualSubmitBtn = document.getElementById("manual-submit-btn");

  const voiceHud = document.getElementById("voice-hud");
  const voiceHudTranscript = document.getElementById("voice-hud-transcript");
  const voiceHudResponse = document.getElementById("voice-hud-response");
  const voiceHudCloseBtn = document.getElementById("voice-hud-close");
  const toggleVoiceModeBtn = document.getElementById("toggle-voice-mode");

  const exportModal = document.getElementById("export-modal");
  const exportBtn = document.getElementById("export-btn");
  const exportCloseBtn = document.getElementById("export-modal-close");
  const exportPreviewText = document.getElementById("export-preview-text");
  const exportCopyBtn = document.getElementById("export-copy-btn");
  const exportWhatsappBtn = document.getElementById("export-whatsapp-btn");
  const exportPrintBtn = document.getElementById("export-print-btn");

  const substituteModal = document.getElementById("substitute-modal");
  const substituteModalClose = document.getElementById("substitute-modal-close");
  const substituteOriginalItemName = document.getElementById("substitute-original-item");
  const substituteResultsGrid = document.getElementById("substitute-results-grid");

  const languageSelector = document.getElementById("language-selector");
  const voiceFeedbackToggle = document.getElementById("voice-feedback-toggle");
  const toastContainer = document.getElementById("toast-container");

  // Initialize Speech Engine
  const speechEngine = new SpeechEngine({
    onInterim: (text) => {
      liveTranscriptText.textContent = `"${text}..."`;
      liveTranscriptText.classList.add("recording");
      if (voiceHudTranscript) {
        voiceHudTranscript.textContent = `"${text}..."`;
      }
    },
    onResult: (text) => {
      liveTranscriptText.textContent = `"${text}"`;
      liveTranscriptText.classList.remove("recording");
      if (voiceHudTranscript) {
        voiceHudTranscript.textContent = `"${text}"`;
      }
      handleVoiceCommand(text);
    },
    onStateChange: ({ status, isListening, isSpeaking }) => {
      updateVoiceUIState(status, isListening, isSpeaking);
    },
    onError: (err) => {
      showToast(`Microphone error: ${err}`, "warning");
      micStatus.textContent = "Mic Idle (Click to Talk)";
      micBtn.classList.remove("active");
    }
  });

  // Bind Canvas Visualizer
  if (voiceVisualizer) {
    speechEngine.bindVisualizer(voiceVisualizer);
  }

  // --- VOICE COMMAND DISPATCHER ---
  function handleVoiceCommand(rawText) {
    if (!rawText || !rawText.trim()) return;

    // 1. NLP Extraction
    const parsed = NLPEngine.parse(rawText, store.settings.language);
    console.log("NLP Result:", parsed);

    let feedbackMessage = "";

    // 2. Dispatch Action based on Intent
    switch (parsed.intent) {
      case "ADD_ITEM": {
        const added = store.addItem({
          name: parsed.item || rawText,
          quantity: parsed.quantity,
          unit: parsed.unit,
          category: parsed.category,
          tags: parsed.tags
        });

        if (added) {
          feedbackMessage = `Added ${added.quantity} ${added.unit} of ${added.name} to your list.`;
          showToast(feedbackMessage, "success", added.image || "🛒");
        } else {
          feedbackMessage = `Couldn't add that item. Please try again.`;
          showToast(feedbackMessage, "error");
        }
        break;
      }

      case "REMOVE_ITEM": {
        const removed = store.removeItem(parsed.item);
        if (removed) {
          feedbackMessage = `Removed ${removed.name} from your list.`;
          showToast(feedbackMessage, "info", "🗑️");
        } else {
          feedbackMessage = `Couldn't find "${parsed.item}" in your shopping list.`;
          showToast(feedbackMessage, "warning");
        }
        break;
      }

      case "UPDATE_QUANTITY": {
        const updated = store.updateQuantity(parsed.item, parsed.quantity, parsed.unit);
        if (updated) {
          feedbackMessage = `Updated ${updated.name} to ${updated.quantity} ${updated.unit}.`;
          showToast(feedbackMessage, "success", "✏️");
        } else {
          feedbackMessage = `Could not find ${parsed.item} to update.`;
          showToast(feedbackMessage, "warning");
        }
        break;
      }

      case "SEARCH_CATALOG": {
        if (catalogSearchInput) {
          catalogSearchInput.value = parsed.item || "";
        }
        if (parsed.priceConstraint && maxPriceSlider) {
          maxPriceSlider.value = parsed.priceConstraint;
          maxPriceValue.textContent = `$${parsed.priceConstraint}`;
        }
        renderCatalog();

        // Switch tab to catalog view if on mobile/desktop
        const catalogTab = document.querySelector('[data-tab="catalog"]');
        if (catalogTab) catalogTab.click();

        const results = CatalogService.search({
          query: parsed.item,
          maxPrice: parsed.priceConstraint,
          tags: parsed.tags
        });

        feedbackMessage = `Found ${results.length} items matching "${parsed.item || 'your filter'}".`;
        showToast(feedbackMessage, "info", "🔍");
        break;
      }

      case "FIND_SUBSTITUTE": {
        const itemName = parsed.item || "Organic Whole Milk";
        openSubstituteModal(itemName);
        feedbackMessage = `Here are healthy substitutes for ${itemName}.`;
        showToast(feedbackMessage, "info", "✨");
        break;
      }

      case "GET_RECOMMENDATIONS": {
        const recommendations = SuggestionsEngine.getReplenishmentSuggestions(store.history, store.items);
        const seasonal = SuggestionsEngine.getSeasonalRecommendations();
        feedbackMessage = `You are running low on ${recommendations.slice(0, 2).map(r => r.product.name).join(' and ') || 'staples'}. Season picks include ${seasonal[0]?.product.name || 'fresh berries'}.`;
        showToast("Smart suggestions updated", "info", "💡");

        const suggestionsTab = document.querySelector('[data-tab="suggestions"]');
        if (suggestionsTab) suggestionsTab.click();
        break;
      }

      case "CHECK_ITEM": {
        const match = store.items.find(i => i.name.toLowerCase().includes(parsed.item.toLowerCase()));
        if (match) {
          store.toggleComplete(match.id);
          feedbackMessage = `Marked ${match.name} as ${match.completed ? 'completed' : 'pending'}.`;
          showToast(feedbackMessage, "success", "✅");
        } else {
          feedbackMessage = `Item ${parsed.item} is not in your list.`;
          showToast(feedbackMessage, "warning");
        }
        break;
      }

      case "CLEAR_LIST": {
        store.clear(true);
        feedbackMessage = "Shopping list cleared.";
        showToast(feedbackMessage, "info", "🧹");
        break;
      }

      case "VOICE_MODE": {
        toggleVoiceOnlyHUD(true);
        feedbackMessage = "Switched to hands-free voice mode.";
        showToast(feedbackMessage, "info", "🎙️");
        break;
      }

      case "EXPORT_LIST": {
        openExportModal();
        feedbackMessage = "Here is your shopping list export.";
        showToast(feedbackMessage, "info", "📤");
        break;
      }

      default: {
        // Fallback: Default to adding as an item if a noun was spoken
        if (parsed.item && parsed.item.length > 1) {
          const added = store.addItem({
            name: parsed.item,
            quantity: parsed.quantity,
            unit: parsed.unit,
            category: parsed.category
          });
          feedbackMessage = `Added ${added.quantity} ${added.unit} of ${added.name}.`;
          showToast(feedbackMessage, "success", added.image || "🛒");
        } else {
          feedbackMessage = `I heard "${rawText}". Try saying "Add 2 apples" or "Find organic tea".`;
          showToast(feedbackMessage, "info");
        }
      }
    }

    // 3. Audio Voice Feedback (Text-to-Speech)
    if (store.settings.voiceFeedback && feedbackMessage) {
      speechEngine.speak(feedbackMessage, {
        rate: store.settings.voiceSpeed || 1.0
      });
      if (voiceHudResponse) {
        voiceHudResponse.textContent = feedbackMessage;
      }
    }
  }

  // Update Voice Status UI
  function updateVoiceUIState(status, isListening, isSpeaking) {
    if (status === "listening" || isListening) {
      micBtn.classList.add("active");
      micIcon.innerHTML = `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>`;
      micStatus.textContent = "Listening... Speak now";
      if (voiceAssistantOrb) voiceAssistantOrb.classList.add("active");
    } else if (isSpeaking) {
      micStatus.textContent = "Assistant speaking...";
      if (voiceAssistantOrb) voiceAssistantOrb.classList.add("speaking");
    } else {
      micBtn.classList.remove("active");
      micStatus.textContent = "Voice Assistant Idle (Click to Speak)";
      if (voiceAssistantOrb) {
        voiceAssistantOrb.classList.remove("active");
        voiceAssistantOrb.classList.remove("speaking");
      }
    }
  }

  // --- RENDER SHOPPING LIST ---
  function renderShoppingList() {
    const state = store.getState();
    const { items, stats, categorizedItems } = state;

    // Update Stats Header
    if (totalCostEl) totalCostEl.textContent = `$${stats.totalEstimatedCost}`;
    if (totalItemsCountEl) totalItemsCountEl.textContent = `${stats.totalItems} items (${stats.completedItems} checked)`;
    if (budgetRemainingEl) {
      budgetRemainingEl.textContent = `$${stats.budgetRemaining} left of $${stats.budgetLimit}`;
      budgetRemainingEl.className = stats.isOverBudget ? "text-danger" : "text-success";
    }

    if (budgetProgressEl) {
      const percentage = Math.min(100, (parseFloat(stats.totalEstimatedCost) / parseFloat(stats.budgetLimit)) * 100);
      budgetProgressEl.style.width = `${percentage}%`;
      budgetProgressEl.className = `progress-bar ${percentage > 90 ? 'bg-danger' : percentage > 70 ? 'bg-warning' : 'bg-primary'}`;
    }

    // Toggle Empty State
    if (!items || items.length === 0) {
      emptyListState.classList.remove("hidden");
      shoppingListContainer.innerHTML = "";
      return;
    } else {
      emptyListState.classList.add("hidden");
    }

    shoppingListContainer.innerHTML = "";

    // Render by Category Groups
    for (const [category, groupItems] of Object.entries(categorizedItems)) {
      const categoryCard = document.createElement("div");
      categoryCard.className = "category-group-card";

      const categoryHeader = document.createElement("div");
      categoryHeader.className = "category-header";
      categoryHeader.innerHTML = `
        <div class="cat-title">
          <span class="cat-badge">${getCategoryIcon(category)}</span>
          <h3>${category}</h3>
          <span class="cat-count">(${groupItems.length})</span>
        </div>
        <span class="cat-subtotal">$${groupItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
      `;
      categoryCard.appendChild(categoryHeader);

      const itemsList = document.createElement("div");
      itemsList.className = "category-items-list";

      groupItems.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = `shopping-item-row ${item.completed ? 'completed' : ''}`;
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <label class="item-checkbox-label">
            <input type="checkbox" ${item.completed ? 'checked' : ''} class="item-checkbox" data-id="${item.id}">
            <span class="custom-checkbox"></span>
          </label>

          <span class="item-emoji">${item.image || '🛒'}</span>

          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-meta">
              <span class="item-price-unit">$${item.price.toFixed(2)} / ${item.unit}</span>
              ${item.tags && item.tags.length ? `<span class="item-tag">${item.tags[0]}</span>` : ''}
            </div>
          </div>

          <div class="item-actions">
            <div class="qty-control-group">
              <button class="qty-btn minus-btn" data-id="${item.id}" title="Decrease quantity">−</button>
              <span class="qty-value">${item.quantity} <small>${item.unit}</small></span>
              <button class="qty-btn plus-btn" data-id="${item.id}" title="Increase quantity">+</button>
            </div>

            <span class="item-total-price">$${(item.price * item.quantity).toFixed(2)}</span>

            <button class="substitute-trigger-btn" data-name="${item.name}" title="Find substitutes">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
            </button>

            <button class="item-delete-btn" data-id="${item.id}" title="Delete item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `;

        itemsList.appendChild(itemRow);
      });

      categoryCard.appendChild(itemsList);
      shoppingListContainer.appendChild(categoryCard);
    }

    // Attach Event Listeners to dynamic elements
    attachListEventListeners();
  }

  function attachListEventListeners() {
    // Checkboxes
    document.querySelectorAll(".item-checkbox").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const id = e.target.dataset.id;
        store.toggleComplete(id);
      });
    });

    // Plus buttons
    document.querySelectorAll(".plus-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const item = store.items.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity + 1);
      });
    });

    // Minus buttons
    document.querySelectorAll(".minus-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const item = store.items.find(i => i.id === id);
        if (item) store.updateQuantity(id, item.quantity - 1);
      });
    });

    // Delete buttons
    document.querySelectorAll(".item-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        store.removeItem(id);
      });
    });

    // Substitute trigger buttons
    document.querySelectorAll(".substitute-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const name = btn.dataset.name;
        openSubstituteModal(name);
      });
    });
  }

  // --- RENDER SMART SUGGESTIONS ---
  function renderSuggestions() {
    // 1. Replenishment Suggestions ("Running Low")
    if (replenishmentList) {
      const replenishments = SuggestionsEngine.getReplenishmentSuggestions(store.history, store.items);
      replenishmentList.innerHTML = "";

      if (replenishments.length === 0) {
        replenishmentList.innerHTML = `<div class="empty-suggestions">All your frequent staples are stocked up! 🎉</div>`;
      } else {
        replenishments.forEach(sug => {
          const card = document.createElement("div");
          card.className = "suggestion-card replenishment-card";
          card.innerHTML = `
            <div class="sug-badge ${sug.urgency}">RUNNING LOW</div>
            <div class="sug-header">
              <span class="sug-emoji">${sug.product.image || '📦'}</span>
              <div>
                <h4 class="sug-title">${sug.product.name}</h4>
                <p class="sug-reason">${sug.reason}</p>
              </div>
            </div>
            <div class="sug-footer">
              <span class="sug-price">$${parseFloat(sug.product.price || 3.99).toFixed(2)}</span>
              <button class="sug-add-btn" data-name="${sug.product.name}">+ Add to List</button>
            </div>
          `;
          replenishmentList.appendChild(card);
        });
      }
    }

    // 2. Seasonal Recommendations
    if (seasonalList) {
      const seasonal = SuggestionsEngine.getSeasonalRecommendations();
      seasonalList.innerHTML = "";
      seasonal.forEach(item => {
        const card = document.createElement("div");
        card.className = "suggestion-card seasonal-card";
        card.innerHTML = `
          <div class="sug-badge seasonal">${item.badge}</div>
          <div class="sug-header">
            <span class="sug-emoji">${item.product.image}</span>
            <div>
              <h4 class="sug-title">${item.product.name}</h4>
              <p class="sug-reason">${item.reason}</p>
            </div>
          </div>
          <div class="sug-footer">
            <span class="sug-price">$${item.product.price.toFixed(2)} / ${item.product.unit}</span>
            <button class="sug-add-btn" data-name="${item.product.name}">+ Add</button>
          </div>
        `;
        seasonalList.appendChild(card);
      });
    }

    // 3. Complementary Suggestions ("Frequently Bought Together")
    if (complementaryList) {
      const pairings = SuggestionsEngine.getComplementarySuggestions(store.items);
      complementaryList.innerHTML = "";
      if (pairings.length === 0) {
        complementaryList.innerHTML = `<div class="empty-suggestions">Add more items to see recipe & pairing suggestions! 🍳</div>`;
      } else {
        pairings.forEach(pair => {
          const card = document.createElement("div");
          card.className = "suggestion-card pairing-card";
          card.innerHTML = `
            <div class="sug-badge pairing">PAIRING PICK</div>
            <div class="sug-header">
              <span class="sug-emoji">${pair.product.image}</span>
              <div>
                <h4 class="sug-title">${pair.product.name}</h4>
                <p class="sug-reason">${pair.reason}</p>
              </div>
            </div>
            <div class="sug-footer">
              <span class="sug-price">$${pair.product.price.toFixed(2)}</span>
              <button class="sug-add-btn" data-name="${pair.product.name}">+ Add</button>
            </div>
          `;
          complementaryList.appendChild(card);
        });
      }
    }

    // Attach listeners to recommendation add buttons
    document.querySelectorAll(".sug-add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        store.addItem({ name, quantity: 1 });
        showToast(`Added ${name} to list`, "success", "✨");
      });
    });
  }

  // --- RENDER CATALOG & VOICE SEARCH ---
  function renderCatalog() {
    if (!catalogGrid) return;

    const query = catalogSearchInput ? catalogSearchInput.value : "";
    const category = catalogCategoryFilter ? catalogCategoryFilter.value : "";
    const maxPrice = maxPriceSlider ? parseFloat(maxPriceSlider.value) : null;

    const results = CatalogService.search({
      query,
      category,
      maxPrice: maxPrice < 20 ? maxPrice : null
    });

    catalogGrid.innerHTML = "";

    if (results.length === 0) {
      catalogGrid.innerHTML = `<div class="empty-catalog-results">No items found matching your filters. Try searching for "apples", "milk", or adjusting price.</div>`;
      return;
    }

    results.forEach(product => {
      const card = document.createElement("div");
      card.className = "catalog-card";
      card.innerHTML = `
        <div class="catalog-card-header">
          <span class="catalog-emoji">${product.image}</span>
          <span class="catalog-rating">★ ${product.rating}</span>
        </div>
        <div class="catalog-card-body">
          <span class="catalog-category-tag">${product.category}</span>
          <h4 class="catalog-product-name">${product.name}</h4>
          <span class="catalog-brand">${product.brand}</span>
          <div class="catalog-tags">
            ${product.tags.slice(0, 2).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
        </div>
        <div class="catalog-card-footer">
          <div class="catalog-price-info">
            <span class="catalog-price">$${product.price.toFixed(2)}</span>
            <span class="catalog-unit">/ ${product.unit}</span>
          </div>
          <button class="catalog-add-btn" data-id="${product.id}">+ Add</button>
        </div>
      `;
      catalogGrid.appendChild(card);
    });

    // Attach Add buttons
    document.querySelectorAll(".catalog-add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const prod = CatalogService.getById(btn.dataset.id);
        if (prod) {
          store.addItem({
            name: prod.name,
            quantity: 1,
            unit: prod.unit,
            price: prod.price,
            category: prod.category,
            image: prod.image,
            tags: prod.tags
          });
          showToast(`Added ${prod.name} to shopping list!`, "success", prod.image);
        }
      });
    });
  }

  // --- SUBSTITUTE MODAL ---
  function openSubstituteModal(productName) {
    if (!substituteModal) return;
    substituteOriginalItemName.textContent = productName;
    substituteResultsGrid.innerHTML = "";

    const substitutes = SuggestionsEngine.getSubstituteSuggestions(productName);

    if (substitutes.length === 0) {
      substituteResultsGrid.innerHTML = `<p class="text-muted">No direct substitutes found for "${productName}". Try common alternatives like Oat Milk, Tofu, or Gluten-Free Bread.</p>`;
    } else {
      substitutes.forEach(sub => {
        const card = document.createElement("div");
        card.className = "substitute-card";
        card.innerHTML = `
          <div class="sub-emoji">${sub.product.image || '✨'}</div>
          <div class="sub-details">
            <h4 class="sub-name">${sub.product.name}</h4>
            <p class="sub-reason">${sub.reason}</p>
            <div class="sub-meta">
              <span class="sub-price">$${parseFloat(sub.product.price).toFixed(2)}</span>
              ${sub.product.brand ? `<span class="sub-brand">${sub.product.brand}</span>` : ''}
            </div>
          </div>
          <button class="sub-swap-btn" data-swap="${sub.product.name}" data-orig="${productName}">Swap / Add</button>
        `;
        substituteResultsGrid.appendChild(card);
      });
    }

    substituteModal.classList.remove("hidden");

    // Swap buttons
    document.querySelectorAll(".sub-swap-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const swapName = btn.dataset.swap;
        const origName = btn.dataset.orig;

        // Optionally remove old item and add new
        store.removeItem(origName);
        store.addItem({ name: swapName, quantity: 1 });
        showToast(`Replaced "${origName}" with "${swapName}"`, "success", "✨");
        substituteModal.classList.add("hidden");
      });
    });
  }

  // --- EXPORT MODAL ---
  function openExportModal() {
    if (!exportModal) return;
    exportPreviewText.value = store.exportToText();
    exportModal.classList.remove("hidden");
  }

  // --- VOICE ONLY HUD ---
  function toggleVoiceOnlyHUD(show) {
    if (!voiceHud) return;
    if (show) {
      voiceHud.classList.remove("hidden");
      if (!speechEngine.isListening) {
        speechEngine.start();
      }
    } else {
      voiceHud.classList.add("hidden");
    }
  }

  // --- TOAST SYSTEM ---
  function showToast(message, type = "info", icon = "") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-card toast-${type} animate-slide-in`;

    const iconMap = {
      success: "✅",
      info: "ℹ️",
      warning: "⚠️",
      error: "❌"
    };

    const finalIcon = icon || iconMap[type] || "✨";

    toast.innerHTML = `
      <span class="toast-icon">${finalIcon}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Helper Category Icon
  function getCategoryIcon(cat) {
    const icons = {
      "Fresh Produce": "🥬",
      "Dairy & Eggs": "🥛",
      "Bakery": "🍞",
      "Pantry": "🥫",
      "Beverages": "🥤",
      "Snacks": "🍿",
      "Frozen": "❄️",
      "Household": "🧼"
    };
    return icons[cat] || "🛒";
  }

  // --- EVENT LISTENERS INITIALIZATION ---

  // Microphone toggle button
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      speechEngine.toggle();
    });
  }

  // Hands-free Voice Mode Button
  if (toggleVoiceModeBtn) {
    toggleVoiceModeBtn.addEventListener("click", () => {
      toggleVoiceOnlyHUD(true);
    });
  }

  if (voiceHudCloseBtn) {
    voiceHudCloseBtn.addEventListener("click", () => {
      toggleVoiceOnlyHUD(false);
    });
  }

  // Manual Command Submit
  if (manualSubmitBtn && manualCommandInput) {
    const triggerManual = () => {
      const cmd = manualCommandInput.value.trim();
      if (cmd) {
        speechEngine.simulateVoiceCommand(cmd);
        manualCommandInput.value = "";
      }
    };
    manualSubmitBtn.addEventListener("click", triggerManual);
    manualCommandInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") triggerManual();
    });
  }

  // Interactive Quick Test Chips (Voice Simulator)
  document.querySelectorAll(".test-command-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.dataset.command || chip.textContent.trim();
      speechEngine.simulateVoiceCommand(text);
    });
  });

  // Tab Navigation (Shopping List / Catalog / Smart Suggestions)
  document.querySelectorAll(".nav-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab-btn").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content-panel").forEach(p => p.classList.add("hidden"));

      tab.classList.add("active");
      const targetId = tab.dataset.tab;
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) targetPanel.classList.remove("hidden");
    });
  });

  // Catalog Filters
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener("input", () => renderCatalog());
  }
  if (catalogCategoryFilter) {
    catalogCategoryFilter.addEventListener("change", () => renderCatalog());
  }
  if (maxPriceSlider && maxPriceValue) {
    maxPriceSlider.addEventListener("input", () => {
      const val = maxPriceSlider.value;
      maxPriceValue.textContent = val >= 20 ? "Any Price" : `$${val}`;
      renderCatalog();
    });
  }

  // Clear Completed / Clear All buttons
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      store.clear(false);
      showToast("Cleared completed items", "info");
    });
  }

  const clearAllBtn = document.getElementById("clear-all-btn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your entire shopping list?")) {
        store.clear(true);
        showToast("Shopping list cleared", "info");
      }
    });
  }

  // Export Modal Triggers
  if (exportBtn) exportBtn.addEventListener("click", openExportModal);
  if (exportCloseBtn) exportCloseBtn.addEventListener("click", () => exportModal.classList.add("hidden"));
  if (exportCopyBtn) {
    exportCopyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(exportPreviewText.value);
      showToast("Shopping list copied to clipboard!", "success", "📋");
    });
  }
  if (exportWhatsappBtn) {
    exportWhatsappBtn.addEventListener("click", () => {
      window.open(store.exportToWhatsAppUrl(), "_blank");
    });
  }
  if (exportPrintBtn) {
    exportPrintBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Substitute Modal Close
  if (substituteModalClose) {
    substituteModalClose.addEventListener("click", () => substituteModal.classList.add("hidden"));
  }

  // Language Selector
  if (languageSelector) {
    languageSelector.value = store.settings.language || "en-US";
    languageSelector.addEventListener("change", (e) => {
      const lang = e.target.value;
      store.updateSettings({ language: lang });
      speechEngine.setLanguage(lang);
      showToast(`Language set to ${e.target.options[e.target.selectedIndex].text}`, "info", "🌐");
    });
  }

  // Voice Feedback Toggle
  if (voiceFeedbackToggle) {
    voiceFeedbackToggle.checked = store.settings.voiceFeedback;
    voiceFeedbackToggle.addEventListener("change", (e) => {
      store.updateSettings({ voiceFeedback: e.target.checked });
      showToast(`Voice feedback ${e.target.checked ? 'enabled' : 'muted'}`, "info", "🔊");
    });
  }

  // Subscribe Store updates to re-render
  store.subscribe((event, payload, state) => {
    renderShoppingList();
    renderSuggestions();
  });

  // Initial Renders
  renderShoppingList();
  renderSuggestions();
  renderCatalog();
});
