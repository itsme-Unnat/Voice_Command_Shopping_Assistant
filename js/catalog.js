/**
 * Voice Command Shopping Assistant - Product Catalog Database
 * Rich dataset of 100+ grocery items across 8 categories with pricing,
 * nutritional/dietary tags, seasonality, stock levels, and substitute mappings.
 */

const PRODUCT_CATALOG = [
  // --- FRESH PRODUCE (15 items) ---
  {
    id: "prod-001",
    name: "Organic Gala Apples",
    category: "Fresh Produce",
    price: 3.49,
    unit: "lb",
    brand: "Earth's Best",
    tags: ["organic", "fruit", "vegan", "gluten-free", "healthy"],
    inStock: true,
    season: ["autumn", "winter", "all-year"],
    rating: 4.8,
    image: "🍎",
    substitutes: ["Honeycrisp Apples", "Granny Smith Apples", "Organic Pears"]
  },
  {
    id: "prod-002",
    name: "Fresh Cavendish Bananas",
    category: "Fresh Produce",
    price: 0.69,
    unit: "lb",
    brand: "Dole",
    tags: ["fruit", "potassium", "vegan", "gluten-free", "healthy"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🍌",
    substitutes: ["Organic Plantains", "Organic Gala Apples"]
  },
  {
    id: "prod-003",
    name: "Organic Hass Avocados",
    category: "Fresh Produce",
    price: 4.99,
    unit: "pack of 4",
    brand: "Calavo",
    tags: ["organic", "keto", "healthy fats", "vegan", "gluten-free"],
    inStock: true,
    season: ["spring", "summer"],
    rating: 4.7,
    image: "🥑",
    substitutes: ["Guacamole Dip", "Organic Olive Oil"]
  },
  {
    id: "prod-004",
    name: "Organic Baby Spinach",
    category: "Fresh Produce",
    price: 2.99,
    unit: "16 oz tub",
    brand: "Organic Girl",
    tags: ["organic", "greens", "iron", "vegan", "gluten-free"],
    inStock: true,
    season: ["spring", "autumn"],
    rating: 4.6,
    image: "🥬",
    substitutes: ["Kale Greens", "Mixed Salad Greens", "Arugula"]
  },
  {
    id: "prod-005",
    name: "Fresh Strawberries",
    category: "Fresh Produce",
    price: 3.99,
    unit: "1 lb clamshell",
    brand: "Driscoll's",
    tags: ["berries", "fruit", "sweet", "vegan", "gluten-free", "antioxidant"],
    inStock: true,
    season: ["spring", "summer"],
    rating: 4.8,
    image: "🍓",
    substitutes: ["Organic Blueberries", "Raspberries", "Blackberries"]
  },
  {
    id: "prod-006",
    name: "Organic Blueberries",
    category: "Fresh Produce",
    price: 4.49,
    unit: "pint",
    brand: "Driscoll's",
    tags: ["organic", "berries", "fruit", "superfood", "antioxidant"],
    inStock: true,
    season: ["summer"],
    rating: 4.9,
    image: "🫐",
    substitutes: ["Fresh Strawberries", "Raspberries", "Frozen Berry Mix"]
  },
  {
    id: "prod-007",
    name: "Valencia Oranges",
    category: "Fresh Produce",
    price: 4.29,
    unit: "3 lb bag",
    brand: "Sunkist",
    tags: ["citrus", "vitamin-c", "fruit", "vegan"],
    inStock: true,
    season: ["winter", "spring"],
    rating: 4.5,
    image: "🍊",
    substitutes: ["Clementines", "Grapefruit", "Lemons"]
  },
  {
    id: "prod-008",
    name: "Seedless Watermelon",
    category: "Fresh Produce",
    price: 5.99,
    unit: "each",
    brand: "Fresh Farm",
    tags: ["hydrating", "fruit", "summer", "sweet", "vegan"],
    inStock: true,
    season: ["summer"],
    rating: 4.7,
    image: "🍉",
    substitutes: ["Cantaloupe", "Honeydew Melon", "Pineapple"]
  },
  {
    id: "prod-009",
    name: "Organic Broccoli Crowns",
    category: "Fresh Produce",
    price: 2.49,
    unit: "lb",
    brand: "Earthbound Farm",
    tags: ["organic", "vegetable", "green", "keto", "vegan"],
    inStock: true,
    season: ["autumn", "winter"],
    rating: 4.6,
    image: "🥦",
    substitutes: ["Cauliflower", "Brussels Sprouts", "Asparagus"]
  },
  {
    id: "prod-010",
    name: "Vine-Ripened Roma Tomatoes",
    category: "Fresh Produce",
    price: 1.99,
    unit: "lb",
    brand: "NatureSweet",
    tags: ["vegetable", "cooking", "salad", "vegan", "gluten-free"],
    inStock: true,
    season: ["summer", "autumn"],
    rating: 4.4,
    image: "🍅",
    substitutes: ["Cherry Tomatoes", "Canned Diced Tomatoes", "Heirloom Tomatoes"]
  },
  {
    id: "prod-011",
    name: "Organic Whole Carrots",
    category: "Fresh Produce",
    price: 1.79,
    unit: "2 lb bag",
    brand: "Grimmway Farms",
    tags: ["organic", "root", "vegetable", "beta-carotene"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥕",
    substitutes: ["Baby Carrots", "Sweet Potatoes", "Parsnips"]
  },
  {
    id: "prod-012",
    name: "Yellow Onions",
    category: "Fresh Produce",
    price: 2.29,
    unit: "3 lb bag",
    brand: "Farm Fresh",
    tags: ["staple", "aromatic", "cooking", "vegan"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🧅",
    substitutes: ["Red Onions", "Shallots", "White Onions", "Leeks"]
  },
  {
    id: "prod-013",
    name: "Fresh Garlic Bulbs",
    category: "Fresh Produce",
    price: 1.49,
    unit: "pack of 3",
    brand: "Christopher Ranch",
    tags: ["staple", "aromatic", "cooking", "vegan", "immunity"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🧄",
    substitutes: ["Garlic Powder", "Minced Garlic in Jar", "Shallots"]
  },
  {
    id: "prod-014",
    name: "Russet Potatoes",
    category: "Fresh Produce",
    price: 3.99,
    unit: "5 lb bag",
    brand: "Idaho Potato",
    tags: ["staple", "starchy", "baking", "vegan", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🥔",
    substitutes: ["Yukon Gold Potatoes", "Sweet Potatoes", "Red Potatoes"]
  },
  {
    id: "prod-015",
    name: "Fresh Lemon",
    category: "Fresh Produce",
    price: 0.79,
    unit: "each",
    brand: "Sunkist",
    tags: ["citrus", "flavoring", "vitamin-c", "vegan"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🍋",
    substitutes: ["Limes", "Bottled Lemon Juice", "Apple Cider Vinegar"]
  },

  // --- DAIRY & PLANT-BASED ALTERNATIVES (15 items) ---
  {
    id: "prod-016",
    name: "Organic Whole Milk",
    category: "Dairy & Eggs",
    price: 4.29,
    unit: "1 gallon",
    brand: "Horizon Organic",
    tags: ["organic", "dairy", "calcium", "refrigerated"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥛",
    substitutes: ["Almond Milk (Unsweetened)", "Oat Milk (Barista Blend)", "Organic 2% Milk", "Soy Milk"]
  },
  {
    id: "prod-017",
    name: "Almond Milk (Unsweetened)",
    category: "Dairy & Eggs",
    price: 3.79,
    unit: "64 fl oz",
    brand: "Silk",
    tags: ["dairy-free", "plant-based", "vegan", "low-calorie", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥛",
    substitutes: ["Oat Milk (Barista Blend)", "Organic Whole Milk", "Soy Milk", "Cashew Milk"]
  },
  {
    id: "prod-018",
    name: "Oat Milk (Barista Blend)",
    category: "Dairy & Eggs",
    price: 4.49,
    unit: "64 fl oz",
    brand: "Oatly",
    tags: ["dairy-free", "plant-based", "vegan", "creamy", "coffee"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🥛",
    substitutes: ["Almond Milk (Unsweetened)", "Organic Whole Milk", "Coconut Milk"]
  },
  {
    id: "prod-019",
    name: "Pasture-Raised Large Brown Eggs",
    category: "Dairy & Eggs",
    price: 4.99,
    unit: "1 dozen",
    brand: "Vital Farms",
    tags: ["protein", "breakfast", "pasture-raised", "keto", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🥚",
    substitutes: ["Organic Free-Range Eggs", "Plant-Based Liquid Egg", "Egg Whites"]
  },
  {
    id: "prod-020",
    name: "Plant-Based Liquid Egg",
    category: "Dairy & Eggs",
    price: 4.79,
    unit: "16 fl oz bottle",
    brand: "JUST Egg",
    tags: ["vegan", "plant-based", "cholesterol-free", "dairy-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🍳",
    substitutes: ["Pasture-Raised Large Brown Eggs", "Organic Firm Tofu"]
  },
  {
    id: "prod-021",
    name: "Salted Sweet Cream Butter",
    category: "Dairy & Eggs",
    price: 3.89,
    unit: "1 lb (4 sticks)",
    brand: "Land O'Lakes",
    tags: ["dairy", "baking", "cooking", "staple"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🧈",
    substitutes: ["Plant Butter (Avocado Oil)", "Kerrygold Irish Butter", "Organic Extra Virgin Olive Oil"]
  },
  {
    id: "prod-022",
    name: "Plant Butter (Avocado Oil)",
    category: "Dairy & Eggs",
    price: 4.19,
    unit: "1 lb",
    brand: "Country Crock",
    tags: ["dairy-free", "vegan", "plant-based", "baking"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🧈",
    substitutes: ["Salted Sweet Cream Butter", "Coconut Oil", "Organic Extra Virgin Olive Oil"]
  },
  {
    id: "prod-023",
    name: "Greek Yogurt Plain Non-Fat",
    category: "Dairy & Eggs",
    price: 5.49,
    unit: "32 oz tub",
    brand: "FAGE Total 0%",
    tags: ["high-protein", "probiotic", "gluten-free", "breakfast"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥣",
    substitutes: ["Almond Milk Yogurt (Vanilla)", "Chobani Greek Yogurt", "Cottage Cheese"]
  },
  {
    id: "prod-024",
    name: "Almond Milk Yogurt (Vanilla)",
    category: "Dairy & Eggs",
    price: 4.99,
    unit: "24 oz tub",
    brand: "Kite Hill",
    tags: ["dairy-free", "vegan", "plant-based", "soy-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🥣",
    substitutes: ["Greek Yogurt Plain Non-Fat", "Oat Milk Yogurt"]
  },
  {
    id: "prod-025",
    name: "Sharp Cheddar Cheese Block",
    category: "Dairy & Eggs",
    price: 3.49,
    unit: "8 oz block",
    brand: "Cabot",
    tags: ["dairy", "cheese", "keto", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🧀",
    substitutes: ["Dairy-Free Cheddar Slices", "Mozzarella Cheese Ball", "Gouda Cheese"]
  },
  {
    id: "prod-026",
    name: "Dairy-Free Cheddar Slices",
    category: "Dairy & Eggs",
    price: 4.49,
    unit: "7.8 oz pack",
    brand: "Violife",
    tags: ["dairy-free", "vegan", "plant-based", "meltable"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🧀",
    substitutes: ["Sharp Cheddar Cheese Block", "Chao Slices"]
  },
  {
    id: "prod-027",
    name: "Fresh Heavy Whipping Cream",
    category: "Dairy & Eggs",
    price: 2.99,
    unit: "1 pint",
    brand: "Darigold",
    tags: ["dairy", "baking", "rich", "keto"],
    inStock: true,
    season: ["winter", "all-year"],
    rating: 4.7,
    image: "🥛",
    substitutes: ["Coconut Cream Canned", "Half & Half", "Plant-Based Creamer"]
  },
  {
    id: "prod-028",
    name: "Organic Firm Tofu",
    category: "Dairy & Eggs",
    price: 2.29,
    unit: "14 oz pack",
    brand: "House Foods",
    tags: ["vegan", "plant-based", "protein", "organic", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🧊",
    substitutes: ["Tempeh", "Plant-Based Liquid Egg", "Edamame"]
  },
  {
    id: "prod-029",
    name: "Parmigiano Reggiano Wedge",
    category: "Dairy & Eggs",
    price: 6.99,
    unit: "7 oz wedge",
    brand: "Zanetti",
    tags: ["italian", "gourmet", "cheese", "aged"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🧀",
    substitutes: ["Pecorino Romano", "Nutritional Yeast Flakes", "Grated Parmesan"]
  },
  {
    id: "prod-030",
    name: "Sour Cream Original",
    category: "Dairy & Eggs",
    price: 2.19,
    unit: "16 oz tub",
    brand: "Daisy",
    tags: ["dairy", "dips", "pure", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥣",
    substitutes: ["Greek Yogurt Plain Non-Fat", "Vegan Sour Cream (Forager)"]
  },

  // --- BAKERY & BREAD (12 items) ---
  {
    id: "prod-031",
    name: "Artisan Sourdough Loaf",
    category: "Bakery",
    price: 4.49,
    unit: "24 oz loaf",
    brand: "La Brea Bakery",
    tags: ["bakery", "artisan", "fermented", "crusty"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🍞",
    substitutes: ["Gluten-Free Whole Grain Bread", "100% Whole Wheat Bread", "French Baguette"]
  },
  {
    id: "prod-032",
    name: "Gluten-Free Whole Grain Bread",
    category: "Bakery",
    price: 5.99,
    unit: "18 oz loaf",
    brand: "Canyon Bakehouse",
    tags: ["gluten-free", "allergen-friendly", "whole grain", "dairy-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🍞",
    substitutes: ["Artisan Sourdough Loaf", "Gluten-Free Bagels", "Corn Tortillas"]
  },
  {
    id: "prod-033",
    name: "100% Whole Wheat Bread",
    category: "Bakery",
    price: 3.29,
    unit: "20 oz loaf",
    brand: "Dave's Killer Bread",
    tags: ["organic", "whole grain", "fiber", "protein"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🍞",
    substitutes: ["Artisan Sourdough Loaf", "Gluten-Free Whole Grain Bread", "Multigrain Bread"]
  },
  {
    id: "prod-034",
    name: "Brioche Burger Buns",
    category: "Bakery",
    price: 3.79,
    unit: "4 pack",
    brand: "St Pierre",
    tags: ["bakery", "sweet", "buttery", "summer", "bbq"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.8,
    image: "🍔",
    substitutes: ["Whole Wheat Buns", "Gluten-Free Buns", "Potato Rolls"]
  },
  {
    id: "prod-035",
    name: "Plain New York Style Bagels",
    category: "Bakery",
    price: 3.49,
    unit: "6 pack",
    brand: "Thomas'",
    tags: ["breakfast", "chewy", "toasting"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🥯",
    substitutes: ["Everything Bagels", "Gluten-Free Bagels", "English Muffins"]
  },
  {
    id: "prod-036",
    name: "All-Butter Croissants",
    category: "Bakery",
    price: 4.99,
    unit: "4 count box",
    brand: "Fresh Bakery",
    tags: ["flaky", "butter", "french", "breakfast"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥐",
    substitutes: ["Danish Pastries", "Brioche Loaf"]
  },
  {
    id: "prod-037",
    name: "Flour Tortillas (Fajita Size)",
    category: "Bakery",
    price: 2.49,
    unit: "10 count pack",
    brand: "Mission",
    tags: ["mexican", "wraps", "tacos"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🫓",
    substitutes: ["Corn Tortillas (Yellow)", "Gluten-Free Almond Flour Tortillas"]
  },
  {
    id: "prod-038",
    name: "Corn Tortillas (Yellow)",
    category: "Bakery",
    price: 1.99,
    unit: "24 count pack",
    brand: "Guerrero",
    tags: ["gluten-free", "mexican", "corn", "tacos"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🫓",
    substitutes: ["Flour Tortillas (Fajita Size)", "Gluten-Free Almond Flour Tortillas"]
  },
  {
    id: "prod-039",
    name: "Pita Pocket Bread",
    category: "Bakery",
    price: 2.79,
    unit: "6 count pack",
    brand: "Joseph's",
    tags: ["mediterranean", "wraps", "pockets"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🫓",
    substitutes: ["Naan Bread Flatbread", "Flour Tortillas"]
  },
  {
    id: "prod-040",
    name: "Garlic Naan Flatbread",
    category: "Bakery",
    price: 3.99,
    unit: "4 count pack",
    brand: "Stonefire",
    tags: ["indian", "tandoori", "garlic", "fluffy"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🫓",
    substitutes: ["Pita Pocket Bread", "Roti Flatbread"]
  },
  {
    id: "prod-041",
    name: "Blueberry Crumb Muffins",
    category: "Bakery",
    price: 4.29,
    unit: "4 pack",
    brand: "Bakery Fresh",
    tags: ["sweet", "breakfast", "berries"],
    inStock: true,
    season: ["spring", "summer"],
    rating: 4.6,
    image: "🧁",
    substitutes: ["Chocolate Chip Muffins", "Banana Nut Loaf"]
  },
  {
    id: "prod-042",
    name: "Crispy French Baguette",
    category: "Bakery",
    price: 2.19,
    unit: "each",
    brand: "In-Store Bakery",
    tags: ["french", "crusty", "dinner"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🥖",
    substitutes: ["Artisan Sourdough Loaf", "Ciabatta Rolls"]
  },

  // --- PANTRY & GRAINS (15 items) ---
  {
    id: "prod-043",
    name: "Organic Extra Virgin Olive Oil",
    category: "Pantry",
    price: 9.99,
    unit: "750 ml bottle",
    brand: "California Olive Ranch",
    tags: ["organic", "oil", "heart-healthy", "keto", "cooking"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🫒",
    substitutes: ["Avocado Oil Spray", "Organic Coconut Oil", "Canola Oil"]
  },
  {
    id: "prod-044",
    name: "Pure Avocado Oil",
    category: "Pantry",
    price: 8.99,
    unit: "500 ml bottle",
    brand: "Chosen Foods",
    tags: ["high-smoke-point", "keto", "healthy-fats", "cooking"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥑",
    substitutes: ["Organic Extra Virgin Olive Oil", "Grapeseed Oil"]
  },
  {
    id: "prod-045",
    name: "Organic Jasmine Rice",
    category: "Pantry",
    price: 6.49,
    unit: "5 lb bag",
    brand: "Lundberg",
    tags: ["organic", "grains", "aromatic", "gluten-free", "staple"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🍚",
    substitutes: ["Organic Quinoa Tri-Color", "Brown Basmati Rice", "Cauliflower Rice"]
  },
  {
    id: "prod-046",
    name: "Organic Quinoa Tri-Color",
    category: "Pantry",
    price: 5.29,
    unit: "2 lb pouch",
    brand: "Ancient Harvest",
    tags: ["organic", "superfood", "complete-protein", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🌾",
    substitutes: ["Organic Jasmine Rice", "Couscous", "Farro"]
  },
  {
    id: "prod-047",
    name: "Organic Rolled Oats",
    category: "Pantry",
    price: 3.99,
    unit: "32 oz canister",
    brand: "Bob's Red Mill",
    tags: ["organic", "whole-grain", "fiber", "breakfast", "heart-healthy"],
    inStock: true,
    season: ["all-year", "autumn", "winter"],
    rating: 4.9,
    image: "🥣",
    substitutes: ["Steel Cut Oats", "Gluten-Free Quick Oats", "Chia Seeds"]
  },
  {
    id: "prod-048",
    name: "Barilla Spaghetti Pasta",
    category: "Pantry",
    price: 1.89,
    unit: "16 oz box",
    brand: "Barilla",
    tags: ["italian", "pasta", "dinner", "staple"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🍝",
    substitutes: ["Gluten-Free Penne Rigate", "Chickpea Pasta Rotini", "Whole Wheat Spaghetti"]
  },
  {
    id: "prod-049",
    name: "Gluten-Free Penne Rigate",
    category: "Pantry",
    price: 3.49,
    unit: "12 oz box",
    brand: "Banza",
    tags: ["gluten-free", "chickpea", "high-protein", "vegan"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🍝",
    substitutes: ["Barilla Spaghetti Pasta", "Gluten-Free Fusilli"]
  },
  {
    id: "prod-050",
    name: "Organic Marinara Pasta Sauce",
    category: "Pantry",
    price: 6.99,
    unit: "24 oz jar",
    brand: "Rao's Homemade",
    tags: ["gourmet", "keto-friendly", "no-sugar-added", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🥫",
    substitutes: ["Newman's Own Tomato Basil Sauce", "Canned San Marzano Tomatoes"]
  },
  {
    id: "prod-051",
    name: "Organic Black Beans Canned",
    category: "Pantry",
    price: 1.29,
    unit: "15 oz can",
    brand: "Eden Organic",
    tags: ["organic", "protein", "fiber", "vegan", "canned"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥫",
    substitutes: ["Organic Garbanzo Beans (Chickpeas)", "Pinto Beans", "Kidney Beans"]
  },
  {
    id: "prod-052",
    name: "Organic Garbanzo Beans (Chickpeas)",
    category: "Pantry",
    price: 1.39,
    unit: "15 oz can",
    brand: "Simple Truth",
    tags: ["organic", "protein", "hummus", "vegan", "gluten-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥫",
    substitutes: ["Organic Black Beans Canned", "Cannellini Beans"]
  },
  {
    id: "prod-053",
    name: "Creamy Peanut Butter",
    category: "Pantry",
    price: 3.29,
    unit: "16 oz jar",
    brand: "Jif",
    tags: ["protein", "spread", "classic", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥜",
    substitutes: ["Organic Almond Butter", "Sunflower Seed Butter (Nut-Free)", "Organic Crunchy Peanut Butter"]
  },
  {
    id: "prod-054",
    name: "Organic Almond Butter",
    category: "Pantry",
    price: 7.99,
    unit: "16 oz jar",
    brand: "Justin's",
    tags: ["organic", "paleo", "keto", "gluten-free", "healthy-fats"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥜",
    substitutes: ["Creamy Peanut Butter", "Sunflower Seed Butter (Nut-Free)", "Cashew Butter"]
  },
  {
    id: "prod-055",
    name: "Raw Organic Honey",
    category: "Pantry",
    price: 7.49,
    unit: "16 oz bottle",
    brand: "Nature Nate's",
    tags: ["organic", "natural-sweetener", "antioxidant", "raw"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🍯",
    substitutes: ["Pure Maple Syrup (Grade A)", "Organic Agave Nectar", "Date Syrup"]
  },
  {
    id: "prod-056",
    name: "Pure Maple Syrup (Grade A)",
    category: "Pantry",
    price: 8.99,
    unit: "12 fl oz bottle",
    brand: "Coombs Family Farms",
    tags: ["organic", "vegan", "pancakes", "natural"],
    inStock: true,
    season: ["autumn", "winter"],
    rating: 4.9,
    image: "🍁",
    substitutes: ["Raw Organic Honey", "Organic Agave Nectar"]
  },
  {
    id: "prod-057",
    name: "Organic Chicken Bone Broth",
    category: "Pantry",
    price: 4.99,
    unit: "32 oz carton",
    brand: "Kettle & Fire",
    tags: ["collagen", "keto", "high-protein", "comfort", "soup"],
    inStock: true,
    season: ["autumn", "winter"],
    rating: 4.8,
    image: "🍲",
    substitutes: ["Organic Vegetable Broth", "Beef Bone Broth"]
  },

  // --- BEVERAGES & COFFEE (12 items) ---
  {
    id: "prod-058",
    name: "Sparkling Mineral Water (Lime)",
    category: "Beverages",
    price: 4.99,
    unit: "8 pack cans",
    brand: "LaCroix",
    tags: ["zero-calorie", "sparkling", "refreshing", "sugar-free"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.6,
    image: "🥤",
    substitutes: ["San Pellegrino Sparkling Water", "Spindrift Lemon Sparkling Water", "Purified Bottled Water"]
  },
  {
    id: "prod-059",
    name: "Purified Bottled Water",
    category: "Beverages",
    price: 3.99,
    unit: "24 pack bottles",
    brand: "Aquafina",
    tags: ["hydration", "zero-calorie", "essential"],
    inStock: true,
    season: ["all-year", "summer"],
    rating: 4.5,
    image: "💧",
    substitutes: ["Smartwater Electrolyte", "Sparkling Mineral Water (Lime)"]
  },
  {
    id: "prod-060",
    name: "Organic Cold Brew Coffee Concentrate",
    category: "Beverages",
    price: 7.99,
    unit: "32 oz bottle",
    brand: "Chameleon",
    tags: ["organic", "caffeine", "coffee", "smooth"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.9,
    image: "☕",
    substitutes: ["Whole Bean Medium Roast Coffee", "Matcha Green Tea Powder", "Iced Espresso"]
  },
  {
    id: "prod-061",
    name: "Whole Bean Medium Roast Coffee",
    category: "Beverages",
    price: 11.99,
    unit: "12 oz bag",
    brand: "Stumptown",
    tags: ["artisan", "coffee", "caffeine", "morning"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "☕",
    substitutes: ["Ground French Roast Coffee", "Organic Cold Brew Coffee Concentrate", "Decaf Blend"]
  },
  {
    id: "prod-062",
    name: "Organic Green Tea with Jasmine",
    category: "Beverages",
    price: 3.99,
    unit: "20 tea bags",
    brand: "Yogi",
    tags: ["organic", "tea", "antioxidant", "calming"],
    inStock: true,
    season: ["all-year", "winter"],
    rating: 4.8,
    image: "🍵",
    substitutes: ["Chamomile Herbal Tea", "Matcha Green Tea Powder", "Earl Grey Black Tea"]
  },
  {
    id: "prod-063",
    name: "100% Pure Florida Orange Juice",
    category: "Beverages",
    price: 4.29,
    unit: "52 fl oz bottle",
    brand: "Simply Orange",
    tags: ["pulp-free", "vitamin-c", "breakfast"],
    inStock: true,
    season: ["all-year", "winter"],
    rating: 4.8,
    image: "🍊",
    substitutes: ["Fresh Pressed Apple Cider", "Grapefruit Juice", "Valencia Oranges"]
  },
  {
    id: "prod-064",
    name: "Organic Kombucha (Ginger Lemon)",
    category: "Beverages",
    price: 3.49,
    unit: "16 fl oz bottle",
    brand: "GT's Living Foods",
    tags: ["organic", "probiotic", "fermented", "gut-health", "vegan"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🧃",
    substitutes: ["Apple Cider Vinegar Tonic", "Kefir Probiotic Drink", "Sparkling Water"]
  },
  {
    id: "prod-065",
    name: "Electrolyte Coconut Water",
    category: "Beverages",
    price: 2.79,
    unit: "16.9 fl oz",
    brand: "Vita Coco",
    tags: ["hydration", "potassium", "natural", "summer"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.7,
    image: "🥥",
    substitutes: ["Sparkling Mineral Water", "Sports Electrolyte Drink"]
  },
  {
    id: "prod-066",
    name: "Spiced Apple Cider",
    category: "Beverages",
    price: 4.99,
    unit: "64 fl oz jug",
    brand: "Musselman's",
    tags: ["seasonal", "autumn", "cinnamon", "comfort"],
    inStock: true,
    season: ["autumn", "winter"],
    rating: 4.9,
    image: "🍎",
    substitutes: ["100% Pure Florida Orange Juice", "Hot Spiced Tea"]
  },
  {
    id: "prod-067",
    name: "Oat Milk Vanilla Latte (Ready to Drink)",
    category: "Beverages",
    price: 3.49,
    unit: "9 fl oz can",
    brand: "La Colombe",
    tags: ["dairy-free", "cold-coffee", "grab-and-go"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "☕",
    substitutes: ["Organic Cold Brew Coffee Concentrate", "Iced Almond Latte"]
  },
  {
    id: "prod-068",
    name: "Chamomile Herbal Tea (Caffeine-Free)",
    category: "Beverages",
    price: 3.79,
    unit: "20 bags",
    brand: "Traditional Medicinals",
    tags: ["sleep", "relaxation", "herbal", "organic"],
    inStock: true,
    season: ["all-year", "winter"],
    rating: 4.8,
    image: "🫖",
    substitutes: ["Peppermint Herbal Tea", "Lavender Sleep Tea"]
  },
  {
    id: "prod-069",
    name: "Ginger Ale Soda (Real Ginger)",
    category: "Beverages",
    price: 4.49,
    unit: "6 pack glass bottles",
    brand: "Reed's",
    tags: ["craft-soda", "nausea-relief", "refreshing"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🥤",
    substitutes: ["Sparkling Mineral Water (Lime)", "Club Soda"]
  },

  // --- SNACKS & NUTS (12 items) ---
  {
    id: "prod-070",
    name: "Organic Roasted Almonds (Sea Salt)",
    category: "Snacks",
    price: 6.99,
    unit: "16 oz bag",
    brand: "Blue Diamond",
    tags: ["organic", "keto", "healthy-fats", "gluten-free", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🥜",
    substitutes: ["Raw Walnuts Halves", "Roasted Cashews", "Pumpkin Seeds"]
  },
  {
    id: "prod-071",
    name: "Organic Blue Corn Tortilla Chips",
    category: "Snacks",
    price: 3.49,
    unit: "12 oz bag",
    brand: "Late July",
    tags: ["organic", "non-gmo", "gluten-free", "snack", "party"],
    inStock: true,
    season: ["all-year", "summer"],
    rating: 4.7,
    image: "🥨",
    substitutes: ["Classic Sea Salt Potato Chips", "Pita Chips Sea Salt", "Popcorn"]
  },
  {
    id: "prod-072",
    name: "Dark Chocolate 72% Cacao Bar",
    category: "Snacks",
    price: 2.99,
    unit: "3.5 oz bar",
    brand: "Ghirardelli",
    tags: ["antioxidant", "dark-chocolate", "dessert", "gluten-free"],
    inStock: true,
    season: ["all-year", "winter"],
    rating: 4.9,
    image: "🍫",
    substitutes: ["Milk Chocolate Bar", "Almond Dark Chocolate Bar", "Cacao Nibs"]
  },
  {
    id: "prod-073",
    name: "Organic White Cheddar Popcorn",
    category: "Snacks",
    price: 3.29,
    unit: "6.5 oz bag",
    brand: "SkinnyPop",
    tags: ["gluten-free", "low-calorie", "snack", "movie-night"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🍿",
    substitutes: ["Sea Salt Popcorn", "Rice Cakes", "Pretzel Crisps"]
  },
  {
    id: "prod-074",
    name: "Greek Olive Hummus Dip",
    category: "Snacks",
    price: 3.99,
    unit: "10 oz tub",
    brand: "Sabra",
    tags: ["plant-based", "protein", "dip", "gluten-free", "vegan"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🧆",
    substitutes: ["Classic Garlic Hummus", "Fresh Guacamole", "Tzatziki Dip"]
  },
  {
    id: "prod-075",
    name: "Organic Medjool Dates",
    category: "Snacks",
    price: 6.49,
    unit: "1 lb tub",
    brand: "Natural Delights",
    tags: ["organic", "natural-energy", "fiber", "sweet", "superfood"],
    inStock: true,
    season: ["all-year", "autumn"],
    rating: 4.9,
    image: "🌴",
    substitutes: ["Dried Figs", "Organic Raisins", "Prunes"]
  },
  {
    id: "prod-076",
    name: "Protein Energy Bars (Variety Pack)",
    category: "Snacks",
    price: 9.99,
    unit: "6 pack box",
    brand: "RXBAR",
    tags: ["high-protein", "clean-label", "gluten-free", "workout"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🍫",
    substitutes: ["Kind Almond Bars", "Clif Bars", "Granola Bars"]
  },
  {
    id: "prod-077",
    name: "Pretzel Crisps Original",
    category: "Snacks",
    price: 3.19,
    unit: "7.2 oz bag",
    brand: "Snack Factory",
    tags: ["crunchy", "dips", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🥨",
    substitutes: ["Pita Crackers", "Gluten-Free Pretzel Sticks"]
  },
  {
    id: "prod-078",
    name: "Raw Pumpkin Seeds (Pepitas)",
    category: "Snacks",
    price: 4.99,
    unit: "12 oz bag",
    brand: "NOW Real Food",
    tags: ["zinc", "magnesium", "keto", "organic", "superfood"],
    inStock: true,
    season: ["autumn", "all-year"],
    rating: 4.8,
    image: "🎃",
    substitutes: ["Chia Seeds", "Sunflower Seeds", "Hemp Hearts"]
  },
  {
    id: "prod-079",
    name: "Organic Rice Crackers (Gluten-Free)",
    category: "Snacks",
    price: 2.89,
    unit: "3.5 oz box",
    brand: "Sesmark",
    tags: ["gluten-free", "light", "crispy", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🍘",
    substitutes: ["Water Crackers", "Pretzel Crisps"]
  },
  {
    id: "prod-080",
    name: "Dried Mango Slices (No Sugar Added)",
    category: "Snacks",
    price: 5.49,
    unit: "8 oz pouch",
    brand: "Peeled Snacks",
    tags: ["sweet", "tropical", "fruit-snack", "vegan"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.9,
    image: "🥭",
    substitutes: ["Dried Cranberries", "Freeze-Dried Strawberries"]
  },
  {
    id: "prod-081",
    name: "Kettle Cooked Jalapeno Chips",
    category: "Snacks",
    price: 3.49,
    unit: "8.5 oz bag",
    brand: "Kettle Brand",
    tags: ["spicy", "crunchy", "snack"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🥔",
    substitutes: ["Barbecue Potato Chips", "Organic Blue Corn Tortilla Chips"]
  },

  // --- FROZEN FOODS (10 items) ---
  {
    id: "prod-082",
    name: "Organic Frozen Triple Berry Blend",
    category: "Frozen",
    price: 8.99,
    unit: "3 lb bag",
    brand: "Woodstock",
    tags: ["organic", "smoothies", "berries", "antioxidant", "frozen"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🫐",
    substitutes: ["Fresh Strawberries", "Frozen Mango Chunks", "Frozen Acai Puree"]
  },
  {
    id: "prod-083",
    name: "Plant-Based Burger Patties",
    category: "Frozen",
    price: 5.99,
    unit: "2 count (8 oz)",
    brand: "Beyond Meat",
    tags: ["vegan", "plant-based", "protein", "grilling", "frozen"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.7,
    image: "🍔",
    substitutes: ["Grass-Fed Ground Beef", "Impossible Burger Patties", "Black Bean Veggie Burgers"]
  },
  {
    id: "prod-084",
    name: "Grass-Fed Beef Burger Patties",
    category: "Frozen",
    price: 8.49,
    unit: "4 count (1 lb)",
    brand: "Organic Prairie",
    tags: ["protein", "keto", "dinner", "bbq"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.8,
    image: "🥩",
    substitutes: ["Plant-Based Burger Patties", "Ground Turkey 93/7"]
  },
  {
    id: "prod-085",
    name: "Wild Caught Alaskan Salmon Fillets",
    category: "Frozen",
    price: 12.99,
    unit: "16 oz bag (4 fillets)",
    brand: "Orca Bay",
    tags: ["omega-3", "seafood", "keto", "protein", "healthy"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🐟",
    substitutes: ["Wild Caught Pacific Cod", "Raw Jumbo Shrimp", "Canned Wild Pink Salmon"]
  },
  {
    id: "prod-086",
    name: "Organic Frozen Sweet Green Peas",
    category: "Frozen",
    price: 1.99,
    unit: "16 oz bag",
    brand: "Cascadian Farm",
    tags: ["organic", "vegetables", "quick-meal", "fiber"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🟢",
    substitutes: ["Organic Frozen Cut Green Beans", "Frozen Sweet Corn"]
  },
  {
    id: "prod-087",
    name: "Cauliflower Crust Cheese Pizza",
    category: "Frozen",
    price: 7.99,
    unit: "12 inch pizza",
    brand: "CAULIPOWER",
    tags: ["gluten-free", "low-carb", "easy-dinner", "pizza"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🍕",
    substitutes: ["Thin Crust Pepperoni Pizza", "Vegan Gluten-Free Pizza (Amy's)"]
  },
  {
    id: "prod-088",
    name: "Dairy-Free Coconut Vanilla Ice Cream",
    category: "Frozen",
    price: 5.49,
    unit: "1 pint",
    brand: "So Delicious",
    tags: ["dairy-free", "vegan", "dessert", "sweet"],
    inStock: true,
    season: ["summer", "all-year"],
    rating: 4.8,
    image: "🍨",
    substitutes: ["Oat Milk Chocolate Fudge Ice Cream", "Vanilla Bean Gelato", "Frozen Fruit Bars"]
  },
  {
    id: "prod-089",
    name: "Organic Riced Cauliflower",
    category: "Frozen",
    price: 2.79,
    unit: "12 oz steamer bag",
    brand: "Green Giant",
    tags: ["keto", "low-carb", "organic", "vegetable"],
    inStock: true,
    season: ["all-year"],
    rating: 4.5,
    image: "🥦",
    substitutes: ["Organic Jasmine Rice", "Zucchini Spirals"]
  },
  {
    id: "prod-090",
    name: "Frozen Belgian Waffles",
    category: "Frozen",
    price: 3.49,
    unit: "6 count box",
    brand: "Nature's Path Organic",
    tags: ["breakfast", "organic", "toasting", "sweet"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🧇",
    substitutes: ["Gluten-Free Waffles", "Pancake Mix"]
  },
  {
    id: "prod-091",
    name: "Organic Edamame in Pods",
    category: "Frozen",
    price: 2.69,
    unit: "16 oz bag",
    brand: "Seapoint Farms",
    tags: ["protein", "snack", "organic", "plant-based"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🫛",
    substitutes: ["Organic Firm Tofu", "Green Peas"]
  },

  // --- HOUSEHOLD & PERSONAL CARE (10 items) ---
  {
    id: "prod-092",
    name: "Plant-Based Liquid Dish Soap (Lemon)",
    category: "Household",
    price: 3.99,
    unit: "25 fl oz bottle",
    brand: "Seventh Generation",
    tags: ["eco-friendly", "clean", "cruelty-free", "biodegradable"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "🧼",
    substitutes: ["Dawn Ultra Dish Soap", "Meyer's Clean Day Dish Soap"]
  },
  {
    id: "prod-093",
    name: "Natural Whitening Fluoride-Free Toothpaste",
    category: "Household",
    price: 4.49,
    unit: "4.7 oz tube",
    brand: "Tom's of Maine",
    tags: ["natural", "fluoride-free", "dental", "mint"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🪥",
    substitutes: ["Crest 3D White Toothpaste", "Colgate Total Clean Mint", "Hello Activated Charcoal Toothpaste"]
  },
  {
    id: "prod-094",
    name: "Colgate Total Clean Mint Toothpaste",
    category: "Household",
    price: 3.49,
    unit: "4.8 oz tube",
    brand: "Colgate",
    tags: ["dental", "fluoride", "fresh", "budget"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🪥",
    substitutes: ["Natural Whitening Fluoride-Free Toothpaste", "Sensodyne Pronamel"]
  },
  {
    id: "prod-095",
    name: "100% Recycled Paper Towels",
    category: "Household",
    price: 8.99,
    unit: "6 big rolls",
    brand: "Seventh Generation",
    tags: ["recycled", "eco-friendly", "cleaning", "essential"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🧻",
    substitutes: ["Bounty Select-A-Size", "Bamboo Reusable Paper Towels"]
  },
  {
    id: "prod-096",
    name: "Free & Clear Concentrated Laundry Detergent",
    category: "Household",
    price: 11.99,
    unit: "90 fl oz (60 loads)",
    brand: "All Free Clear",
    tags: ["hypoallergenic", "scent-free", "sensitive-skin", "cleaning"],
    inStock: true,
    season: ["all-year"],
    rating: 4.9,
    image: "🧺",
    substitutes: ["Tide Pods Free & Gentle", "Seventh Generation Laundry Liquid"]
  },
  {
    id: "prod-097",
    name: "Lavender Scented All-Purpose Cleaning Spray",
    category: "Household",
    price: 4.29,
    unit: "32 fl oz bottle",
    brand: "Mrs. Meyer's",
    tags: ["plant-derived", "aromatherapy", "cleaning", "surface"],
    inStock: true,
    season: ["all-year", "spring"],
    rating: 4.8,
    image: "🧴",
    substitutes: ["Method All-Purpose Cleaner", "Clorox Disinfecting Spray"]
  },
  {
    id: "prod-098",
    name: "Organic Shea Butter Hand Soap",
    category: "Household",
    price: 3.49,
    unit: "12 fl oz pump",
    brand: "Everyone Soap",
    tags: ["moisturizing", "essential-oils", "cruelty-free"],
    inStock: true,
    season: ["all-year"],
    rating: 4.7,
    image: "🧴",
    substitutes: ["Softsoap Aloe Liquid Hand Soap", "Method Gel Hand Soap"]
  },
  {
    id: "prod-099",
    name: "Compostable Heavy Duty Trash Bags",
    category: "Household",
    price: 7.99,
    unit: "25 count (13 gallon)",
    brand: "UNNI",
    tags: ["compostable", "eco-friendly", "plant-starch"],
    inStock: true,
    season: ["all-year"],
    rating: 4.6,
    image: "🗑️",
    substitutes: ["Glad ForceFlex Drawstring Bags", "Hefty Ultra Strong"]
  },
  {
    id: "prod-100",
    name: "Natural Unbleached Coffee Filters",
    category: "Household",
    price: 2.49,
    unit: "100 count cone (#4)",
    brand: "If You Care",
    tags: ["unbleached", "compostable", "coffee", "essential"],
    inStock: true,
    season: ["all-year"],
    rating: 4.8,
    image: "☕",
    substitutes: ["Melitta Coffee Filters", "Reusable Stainless Steel Filter"]
  }
];

// Service functions for searching and querying the product database
const CatalogService = {
  getAll() {
    return PRODUCT_CATALOG;
  },

  getById(id) {
    return PRODUCT_CATALOG.find(p => p.id === id);
  },

  getCategories() {
    return [...new Set(PRODUCT_CATALOG.map(p => p.category))];
  },

  search({ query = "", category = "", maxPrice = null, minPrice = null, tags = [], season = null }) {
    const q = (query || "").trim().toLowerCase();

    return PRODUCT_CATALOG.filter(item => {
      // Category filter
      if (category && category !== "All" && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      // Price filter
      if (maxPrice !== null && maxPrice > 0 && item.price > maxPrice) {
        return false;
      }
      if (minPrice !== null && minPrice > 0 && item.price < minPrice) {
        return false;
      }

      // Season filter
      if (season && !item.season.includes(season.toLowerCase()) && !item.season.includes("all-year")) {
        return false;
      }

      // Tags filter
      if (tags && tags.length > 0) {
        const matchesTag = tags.some(t => item.tags.some(it => it.toLowerCase().includes(t.toLowerCase())));
        if (!matchesTag) return false;
      }

      // Query text match (name, brand, category, tags)
      if (q) {
        const inName = item.name.toLowerCase().includes(q);
        const inBrand = item.brand.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        const inTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!inName && !inBrand && !inCat && !inTags) {
          return false;
        }
      }

      return true;
    });
  },

  findSubstitutes(productName) {
    const p = this.findBestMatch(productName);
    if (!p) {
      const broad = this.search({ query: productName });
      if (broad.length > 0 && broad[0].substitutes) {
        return broad[0].substitutes.map(s => this.findBestMatch(s) || { name: s, price: 3.99, image: "✨", inStock: true });
      }
      return [];
    }

    return (p.substitutes || []).map(subName => {
      const match = this.findBestMatch(subName);
      if (match) return match;
      return {
        id: "sub-" + Math.random().toString(36).substr(2, 5),
        name: subName,
        price: (p.price * (0.9 + Math.random() * 0.2)).toFixed(2),
        unit: p.unit,
        brand: "Alternative Choice",
        rating: 4.6,
        image: "✨",
        inStock: true
      };
    });
  },

  findBestMatch(query) {
    if (!query) return null;
    const clean = query.trim().toLowerCase();

    // Exact match
    const exact = PRODUCT_CATALOG.find(p => p.name.toLowerCase() === clean);
    if (exact) return exact;

    // Word includes
    const words = clean.split(/\s+/).filter(w => w.length > 2);
    let bestMatch = null;
    let highestScore = 0;

    for (const item of PRODUCT_CATALOG) {
      const itemName = item.name.toLowerCase();
      let score = 0;

      for (const w of words) {
        if (itemName.includes(w)) score += 3;
        if (item.tags.some(t => t.includes(w))) score += 1.5;
        if (item.brand.toLowerCase().includes(w)) score += 2;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    return highestScore >= 3 ? bestMatch : null;
  }
};

// Export for Node/CommonJS if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCT_CATALOG, CatalogService };
}
