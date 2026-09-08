// ==========================================
// DEMO PRODUCTS
// Replace these products with your real items.
// ==========================================
/**
 * TESSÉ - Central Product Catalog Data
 * 
 * To add/change products:
 * 1. Open this file (js/products.js)
 * 2. Add or modify an object in the PRODUCTS array below
 * 3. Place your photos in images/products/ (e.g. images/products/P001-1.jpg)
 * 
 * The website will automatically update without touching HTML or CSS!
 */

const PRODUCTS = [
  {
    id: "P001",
    name: "Classic Cotton Shirt",
    category: "clothing",
    brand: "TESSÉ",
    price: 1450,
    originalPrice: 1700,
    discount: 15,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "White",
      "Black",
      "Navy"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ],
    quantity: 12,
    availability: "In Stock",
    description: "A versatile everyday cotton shirt designed for comfort and simple style. Tailored with single-needle stitching and natural corozo nut buttons.",
    features: [
      "100% organic long-staple cotton",
      "Tailored regular fit",
      "Lightweight and breathable (140 GSM)",
      "Designed for all-day comfort"
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular Tailored",
      "Collar": "Soft Point",
      "Care": "Machine wash cold, air dry",
      "Condition": "New"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P002", "P003", "P004"]
  },
  {
    id: "P002",
    name: "Relaxed Linen Shirt",
    category: "clothing",
    brand: "TESSÉ",
    price: 1650,
    originalPrice: 1950,
    discount: 15,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15c429fbb41?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Oatmeal",
      "Muted Sage",
      "Charcoal"
    ],
    sizes: [
      "M",
      "L",
      "XL"
    ],
    quantity: 9,
    availability: "In Stock",
    description: "Woven from pre-washed European flax linen. Cut with a relaxed silhouette and camp collar for effortless warm-weather wear.",
    features: [
      "Pure European flax linen",
      "Pre-washed for instant softness",
      "Relaxed drape silhouette",
      "Natural moisture-wicking weave"
    ],
    specifications: {
      "Material": "100% European Flax Linen",
      "Fit": "Relaxed Boxy Fit",
      "Collar": "Convertible Camp Collar",
      "Care": "Gentle wash cold, hang dry",
      "Condition": "New"
    },
    featured: true,
    newArrival: false,
    relatedProducts: ["P001", "P003", "P004"]
  },
  {
    id: "P003",
    name: "Essential T-Shirt",
    category: "clothing",
    brand: "TESSÉ",
    price: 850,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Off-White",
      "Charcoal",
      "Olive"
    ],
    sizes: [
      "S",
      "M",
      "L",
      "XL"
    ],
    quantity: 24,
    availability: "In Stock",
    description: "The foundational heavyweight cotton tee. Cut from 220 GSM combed cotton that retains its crisp shape wash after wash.",
    features: [
      "220 GSM heavyweight combed cotton",
      "Ribbed crew collar that won't sag",
      "Preshrunk fabric",
      "Blind-stitched hems"
    ],
    specifications: {
      "Material": "100% Combed Heavy Cotton",
      "Fit": "Classic Straight",
      "Neckline": "Ribbed Crewneck",
      "Condition": "New"
    },
    featured: false,
    newArrival: true,
    relatedProducts: ["P001", "P002", "P004"]
  },
  {
    id: "P004",
    name: "Modern Casual Jacket",
    category: "clothing",
    brand: "Atelier Studio",
    price: 3200,
    originalPrice: 3800,
    discount: 16,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Midnight Navy",
      "Washed Black"
    ],
    sizes: [
      "M",
      "L"
    ],
    quantity: 5,
    availability: "Limited Stock",
    description: "A functional transit jacket crafted from water-resistant cotton twill with concealed metal zip closure and generous utility pockets.",
    features: [
      "Water-repellent cotton twill shell",
      "Smooth internal cupro lining",
      "Concealed two-way zip",
      "Two deep storm flap front pockets"
    ],
    specifications: {
      "Material": "80% Cotton, 20% Technical Twill",
      "Lining": "100% Cupro",
      "Fit": "Tailored Workwear Cut",
      "Condition": "New"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P001", "P005", "P008"]
  },
  {
    id: "P005",
    name: "Minimal Leather Sneakers",
    category: "shoes",
    brand: "TESSÉ",
    price: 3900,
    originalPrice: 4500,
    discount: 13,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Monochrome White",
      "Matte Black"
    ],
    sizes: [
      "40",
      "41",
      "42",
      "43",
      "44"
    ],
    quantity: 7,
    availability: "In Stock",
    description: "Stripped of branding, these low-profile sneakers pair supple full-grain calfskin leather uppers with vulcanized Margom-style rubber soles.",
    features: [
      "Full-grain calfskin leather upper",
      "Breathable vegetable-tanned leather lining",
      "Cushioned memory foam arch support insole",
      "Reinforced hand-stitched cup sole"
    ],
    specifications: {
      "Upper": "Full-Grain Italian Calfskin",
      "Sole": "Durable Vulcanized Rubber",
      "Insole": "Ergonomic Memory Foam",
      "Condition": "New in Dust Bag"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P006", "P007", "P001"]
  },
  {
    id: "P006",
    name: "Classic Casual Shoes",
    category: "shoes",
    brand: "Artisan Guild",
    price: 4400,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Chestnut Brown",
      "Deep Black"
    ],
    sizes: [
      "41",
      "42",
      "43",
      "44"
    ],
    quantity: 4,
    availability: "Limited Stock",
    description: "Classic plain-toe derby shoes handcrafted with vegetable-tanned leather and a comfortable cushioned EVA wedge sole.",
    features: [
      "Waxed pull-up full grain leather",
      "Blake-stitched construction for resoleability",
      "Soft calfskin interior",
      "Lightweight shock-absorbing wedge sole"
    ],
    specifications: {
      "Upper": "Oiled Vegetable Leather",
      "Construction": "Blake Welt Stitched",
      "Condition": "New"
    },
    featured: false,
    newArrival: false,
    relatedProducts: ["P005", "P007", "P012"]
  },
  {
    id: "P007",
    name: "Everyday Sandals",
    category: "shoes",
    brand: "TESSÉ",
    price: 1850,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Tan",
      "Black"
    ],
    sizes: [
      "40",
      "41",
      "42",
      "43"
    ],
    quantity: 10,
    availability: "In Stock",
    description: "Minimal cross-strap slide sandals designed for daily comfort. Features thick full-grain leather straps and molded anatomical cork footbeds.",
    features: [
      "Thick full-grain leather upper straps",
      "Anatomical cork-latex footbed",
      "Soft suede top lining",
      "Durable grooved rubber traction base"
    ],
    specifications: {
      "Straps": "Full-Grain Oiled Cowhide",
      "Footbed": "Natural Cork & Latex",
      "Condition": "New"
    },
    featured: false,
    newArrival: true,
    relatedProducts: ["P005", "P002", "P003"]
  },
  {
    id: "P008",
    name: "Everyday Leather Bag",
    category: "bags",
    brand: "TESSÉ",
    price: 3400,
    originalPrice: 4000,
    discount: 15,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Cognac Tan",
      "Obsidian Black"
    ],
    // Intentionally no sizes (one-size product)
    quantity: 6,
    availability: "In Stock",
    description: "An architectural tote bag made from sturdy 2.2mm vegetable-tanned cowhide. Sized to easily fit a 15-inch laptop, notebook, and daily essentials.",
    features: [
      "2.2mm thick Tuscan vegetable-tanned leather",
      "Solid cast brass hardware and studs",
      "Reinforced base panel with protective metal feet",
      "Internal hanging zipper pocket and key leash"
    ],
    specifications: {
      "Material": "100% Vegetable-Tanned Leather",
      "Hardware": "Solid Antiqued Brass",
      "Dimensions": "40cm (W) x 36cm (H) x 12cm (D)",
      "Condition": "New"
    },
    featured: true,
    newArrival: false,
    relatedProducts: ["P009", "P010", "P013"]
  },
  {
    id: "P009",
    name: "Minimal Backpack",
    category: "bags",
    brand: "TESSÉ",
    price: 2800,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Slate Grey",
      "Matte Black"
    ],
    quantity: 11,
    availability: "In Stock",
    description: "Clean aesthetic commuter backpack made of water-resistant 18oz paraffin-waxed canvas with ergonomic padded shoulder straps.",
    features: [
      "18oz paraffin waxed canvas shell",
      "Padded 16-inch laptop compartment",
      "Concealed quick-access passport pocket",
      "Ergonomic padded back panel"
    ],
    specifications: {
      "Material": "Waxed Cotton Canvas & Bridle Leather",
      "Capacity": "20 Liters",
      "Condition": "New"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P008", "P010", "P004"]
  },
  {
    id: "P010",
    name: "Crossbody Bag",
    category: "bags",
    price: 1450,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Olive Drab",
      "Charcoal"
    ],
    quantity: 15,
    availability: "In Stock",
    description: "Compact low-profile sling bag for hands-free city transit. Carries phone, keys, wallet, and passport with zero unnecessary bulk.",
    features: [
      "Weatherproof Cordura fabric",
      "Quick-release magnetic FIDLOCK buckle",
      "YKK waterproof zippers",
      "Adjustable webbing strap"
    ],
    specifications: {
      "Fabric": "500D Ballistic Cordura",
      "Dimensions": "24cm x 15cm x 6cm",
      "Condition": "New"
    },
    featured: false,
    newArrival: false,
    relatedProducts: ["P008", "P009", "P013"]
  },
  {
    id: "P011",
    name: "Classic Watch",
    category: "accessories",
    brand: "TESSÉ",
    price: 3600,
    originalPrice: 4200,
    discount: 14,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Brushed Steel",
      "Matte Black"
    ],
    quantity: 8,
    availability: "In Stock",
    description: "A 38mm bauhaus-inspired timepiece with scratch-resistant sapphire crystal glass, matte dial, and interchangeable calfskin strap.",
    features: [
      "316L surgical-grade stainless steel case",
      "Sapphire crystal with anti-reflective coating",
      "Reliable Japanese Miyota quartz movement",
      "5 ATM splash and water resistance"
    ],
    specifications: {
      "Case Diameter": "38mm",
      "Glass": "Anti-Scratch Sapphire Crystal",
      "Movement": "Japanese Miyota 2035 Quartz",
      "Strap": "20mm Vegetable-Tanned Leather",
      "Condition": "New in Presentation Box"
    },
    featured: true,
    newArrival: false,
    relatedProducts: ["P012", "P013", "P014"]
  },
  {
    id: "P012",
    name: "Leather Belt",
    category: "accessories",
    brand: "TESSÉ",
    price: 950,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Espresso Brown",
      "Classic Black"
    ],
    sizes: [
      "32",
      "34",
      "36",
      "38"
    ],
    quantity: 18,
    availability: "In Stock",
    description: "Solid 35mm wide full-grain bridle leather belt with hand-burnished edges and a brushed solid nickel buckle.",
    features: [
      "Full-grain saddle bridle leather",
      "Solid brushed brass/nickel buckle",
      "Hand-burnished waxed edges",
      "Becomes softer with every wear"
    ],
    specifications: {
      "Width": "35mm (1.37 inches)",
      "Leather": "9-10oz Vegetable Tanned Cowhide",
      "Condition": "New"
    },
    featured: false,
    newArrival: false,
    relatedProducts: ["P011", "P013", "P001"]
  },
  {
    id: "P013",
    name: "Minimal Wallet",
    category: "accessories",
    brand: "TESSÉ",
    price: 750,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Caramel Tan",
      "Matte Black"
    ],
    quantity: 25,
    availability: "In Stock",
    description: "Ultra-slim front-pocket cardholder featuring 6 precision-cut card slots and a center folded cash compartment.",
    features: [
      "Holds 8-10 cards plus folded notes",
      "Waxed German thread hand-stitched",
      "Slim 6mm profile when loaded",
      "RFID blocking protective lining"
    ],
    specifications: {
      "Material": "Full-Grain Cowhide",
      "Dimensions": "10cm x 7.5cm x 0.6cm",
      "Condition": "New"
    },
    featured: false,
    newArrival: true,
    relatedProducts: ["P011", "P012", "P008"]
  },
  {
    id: "P014",
    name: "Sunglasses",
    category: "accessories",
    price: 1650,
    originalPrice: 1950,
    discount: 15,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Tortoiseshell",
      "Matte Black"
    ],
    quantity: 12,
    availability: "In Stock",
    description: "Timeless round-square silhouette handcrafted from custom cellulose acetate. Fitted with 100% UV400 polarized mineral glass lenses.",
    features: [
      "Handcrafted bio-acetate frame",
      "Category 3 polarized lenses with anti-glare",
      "Seven-barrel stainless steel hinges",
      "Includes leather case and cleaning cloth"
    ],
    specifications: {
      "Frame": "Organic Cellulose Acetate",
      "Protection": "UV400 Polarized (100% UVA/UVB)",
      "Condition": "New in Hard Case"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P011", "P012", "P013"]
  },
  {
    id: "P015",
    name: "Ceramic Coffee Set",
    category: "home",
    brand: "Studio Hearth",
    price: 1850,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80"
    ],
    // Intentionally no colors and no sizes
    quantity: 8,
    availability: "In Stock",
    description: "A complete artisanal pour-over coffee set: includes a ribbed ceramic dripper cone, 500ml serving carafe, and two matching tasting cups.",
    features: [
      "Hand-thrown high-fire stoneware",
      "Food-safe lead-free matte glaze",
      "Compatible with standard #02 paper filters",
      "Dishwasher and microwave safe"
    ],
    specifications: {
      "Clay": "Coarse High-Fire Stoneware",
      "Carafe Capacity": "500ml",
      "Cup Capacity": "160ml each",
      "Set Includes": "1 Dripper, 1 Carafe, 2 Cups",
      "Condition": "New"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P016", "P017", "P018"]
  },
  {
    id: "P016",
    name: "Minimal Desk Lamp",
    category: "home",
    price: 2400,
    originalPrice: 2900,
    discount: 17,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Brushed Brass",
      "Matte Charcoal"
    ],
    quantity: 5,
    availability: "Limited Stock",
    description: "A balanced architectural task lamp with 360-degree swivel articulation, warm 2700K integrated LED light, and tactile rotary dimmer.",
    features: [
      "Solid machined brass and steel stem",
      "Warm flicker-free 2700K LED source",
      "Smooth rotary dimming control on base",
      "Weighted anti-tip base with felt pad"
    ],
    specifications: {
      "Height": "42cm",
      "Power": "USB-C Powered (Wall adapter included)",
      "Bulb": "Integrated 6W Warm LED (50,000 hrs)",
      "Condition": "New"
    },
    featured: false,
    newArrival: false,
    relatedProducts: ["P015", "P017", "P018"]
  },
  {
    id: "P017",
    name: "Decorative Storage Basket",
    category: "home",
    price: 1150,
    discount: 0,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
    ],
    // Intentionally no color
    sizes: [
      "Medium",
      "Large"
    ],
    quantity: 14,
    availability: "In Stock",
    description: "Handwoven by artisan cooperatives using wild-harvested natural seagrass and cotton cords. Ideal for throws, magazines, or plant pots.",
    features: [
      "100% natural wild seagrass and cotton",
      "Reinforced woven carry handles",
      "Collapsible upper half",
      "Eco-friendly and chemical free"
    ],
    specifications: {
      "Material": "Natural Dried Seagrass & Cotton",
      "Craft": "100% Handwoven",
      "Condition": "New"
    },
    featured: false,
    newArrival: true,
    relatedProducts: ["P015", "P016", "P008"]
  },
  {
    id: "P018",
    name: "Wireless Earbuds",
    category: "electronics",
    brand: "Acoustic Labs",
    price: 4800,
    originalPrice: 5500,
    discount: 13,
    currency: "ETB",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      "Matte Black",
      "Frosted White"
    ],
    // Intentionally no sizes
    quantity: 6,
    availability: "In Stock",
    description: "Precision-tuned true wireless earbuds with custom 11mm graphene drivers, active hybrid noise cancellation, and an aluminum pocket charging case.",
    features: [
      "Active Hybrid Noise Cancellation (up to 38dB)",
      "Transparency audio mode",
      "32-hour total playback with charging case",
      "IPX5 sweat and water resistance"
    ],
    specifications: {
      "Drivers": "11mm Custom Graphene Dynamic",
      "Bluetooth": "Version 5.3 Low Latency",
      "Battery": "8 hrs earbuds + 24 hrs case",
      "Case": "Anodized Aluminum with USB-C",
      "Condition": "New in Sealed Box"
    },
    featured: true,
    newArrival: true,
    relatedProducts: ["P011", "P014", "P010"]
  }
];

/**
 * Get all products
 * @returns {Array}
 */
function getAllProducts() {
  return PRODUCTS;
}

/**
 * Get single product by ID (case-insensitive)
 * @param {string} id 
 * @returns {object|null}
 */
function getProductById(id) {
  if (!id) return null;
  const cleanId = id.toString().toUpperCase().trim();
  return PRODUCTS.find(p => p.id.toUpperCase() === cleanId) || null;
}

/**
 * Get featured products for homepage spotlight
 * @returns {Array}
 */
function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.featured === true);
}

/**
 * Get new arrival products
 * @returns {Array}
 */
function getNewArrivals() {
  return PRODUCTS.filter(p => p.newArrival === true);
}

/**
 * Get related products for a given product ID
 * @param {string} productId 
 * @returns {Array}
 */
function getRelatedProducts(productId) {
  const current = getProductById(productId);
  if (!current) return [];
  
  if (Array.isArray(current.relatedProducts) && current.relatedProducts.length > 0) {
    const matched = current.relatedProducts
      .map(id => getProductById(id))
      .filter(Boolean);
    if (matched.length > 0) return matched;
  }
  
  // Fallback: match by same category, excluding self
  return PRODUCTS
    .filter(p => p.id !== current.id && (p.category || "").toLowerCase() === (current.category || "").toLowerCase())
    .slice(0, 3);
}

/**
 * Get popular products (sorted by discount or featured)
 * @returns {Array}
 */
function getPopularProducts() {
  return [...PRODUCTS]
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 4);
}
