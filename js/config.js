/**
 * =====================================================================
 * TESSÉ - Central Store & Contact Configuration
 * =====================================================================
 * The seller can edit ALL brand, pricing, contact, and shop details
 * from this single configuration file without editing any HTML files.
 */

const STORE_CONFIG = {
  // Brand Identity
  storeName: "FANA Commerce",
  tagline: "Simple. Modern. Yours.",
  currency: "ETB",
  
  // Display & UI Preferences
  shortDescription: "Quality products for everyday life, from fashion and beauty to furniture and commercial spaces.",
  currencyPosition: "after", // "before" (ETB 1,450) or "after" (1,450 ETB)
  
  // Header Announcement & Hero
  announcement: "Free Addis Ababa delivery on orders above 2,500 ETB. Free nationwide delivery on orders above 5,000 ETB.",
  heroHeading: "Simple. Modern. Yours.",
  heroSubheading: "Discover carefully selected products made for everyday life. Thoughtfully crafted apparel, durable leather goods, office supplies, and refined everyday objects.",
  heroCtaText: "Shop Now",
  heroCtaLink: "#catalog",
  heroSecondaryCtaText: "Explore Categories",
  heroSecondaryCtaLink: "#categories-section"
};

const CONTACT_INFO = {
  // Primary Telephone for direct voice calls
  phone: "+251953956311",
  phoneDisplay: "+251 953 956 311",
  
  // Telegram username (without @ symbol for direct URL, with @ for display)
  telegram: "fanacommerce01",
  telegramDisplay: "@fanacommerce01",
  
  // Email address for orders and inquiries
  email: "fanacommerce01@gmail.com",
  
  // SMS phone number
  sms: "+251953956311",
  
  // Physical Shop & Studio Location
  physicalShop: {
    name: "FANA Commerce",
    address: "Everywhere",
    openingHours: "24 hours",
    landmark: "Coming Soon",
    mapUrl: "#",
    pickupNotice: "Coming Soon"
  },
  
  // Social Links
  socials: {
    instagram: "https://instagram.com/tesse.store",
    telegram: "https://t.me/fanacommerce01"
  }
};

/**
 * Utility: Format monetary prices based on store configuration
 * @param {number} amount 
 * @param {string} [customCurrency] 
 * @returns {string} e.g. "1,450 ETB"
 */
function formatPrice(amount, customCurrency) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return "0 " + (customCurrency || STORE_CONFIG.currency);
  }
  const formattedNumber = amount.toLocaleString('en-US', {
    maximumFractionDigits: 0
  });
  const cur = customCurrency || STORE_CONFIG.currency;
  if (STORE_CONFIG.currencyPosition === "before") {
    return `${cur} ${formattedNumber}`;
  }
  return `${formattedNumber} ${cur}`;
}

/**
 * Utility: Calculate final price and discount amount
 * @param {number} originalPrice 
 * @param {number} discountPercent 
 * @returns {{finalPrice: number, hasDiscount: boolean, savings: number, discountPercent: number}}
 */
function calculatePricing(originalPrice, discountPercent = 0) {
  const discount = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  if (discount <= 0) {
    return {
      finalPrice: originalPrice,
      hasDiscount: false,
      savings: 0,
      discountPercent: 0
    };
  }
  const finalPrice = Math.round(originalPrice * (1 - discount / 100));
  const savings = originalPrice - finalPrice;
  return {
    finalPrice,
    hasDiscount: true,
    savings,
    discountPercent: discount
  };
}

/**
 * HTML escaper helper to prevent XSS in dynamic rendering
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Professional SVG Placeholder generator for missing or loading product images.
 * Adheres strictly to the requirement: uses product category, name, and color.
 * No external dependencies, no broken image icons.
 * @param {object} product 
 * @param {number} [imageIndex=0]
 * @returns {string} Data URI (SVG)
 */
function generateProductPlaceholder(product, imageIndex = 0) {
  const category = (product && product.category) ? String(product.category).toUpperCase() : "GENERAL";
  const name = (product && product.name) ? product.name : "Product";
  const code = (product && product.id) ? product.id : "ITEM";
  
  const categoryThemes = {
    clothing: { bg: "#F4F3EF", text: "#1A1A1A", border: "#E2E0D8", icon: "shirt" },
    shoes: { bg: "#F1F2F4", text: "#1A1A1A", border: "#DCE0E5", icon: "footwear" },
    bags: { bg: "#F7F5F0", text: "#1A1A1A", border: "#E8E4DA", icon: "bag" },
    accessories: { bg: "#F3F3F3", text: "#1A1A1A", border: "#E2E2E2", icon: "watch" },
    home: { bg: "#F6F4F1", text: "#1A1A1A", border: "#E8E3DC", icon: "home" },
    electronics: { bg: "#EFF1F3", text: "#1A1A1A", border: "#DCE1E7", icon: "device" },
    beauty: { bg: "#F5F2EF", text: "#1A1A1A", border: "#E8E0DA", icon: "box" },
    other: { bg: "#F5F5F5", text: "#1A1A1A", border: "#E6E6E6", icon: "box" }
  };
  
  const key = (product && product.category) ? String(product.category).toLowerCase() : "other";
  const theme = categoryThemes[key] || { bg: "#F5F5F5", text: "#1A1A1A", border: "#E5E5E5", icon: "box" };
  
  const colors = (product && (product.colors || product.color)) || [];
  const firstColor = colors.length > 0 ? colors[0] : "";
  const safeName = escapeHtml(name);
  const viewTag = imageIndex > 0 ? `VIEW 0${imageIndex + 1}` : "STUDIO ARCHIVE";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%">
    <defs>
      <pattern id="grid-${code}-${imageIndex}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.border}" stroke-width="0.75" stroke-opacity="0.6"/>
      </pattern>
    </defs>
    <rect width="600" height="750" fill="${theme.bg}"/>
    <rect width="600" height="750" fill="url(#grid-${code}-${imageIndex})"/>
    
    <!-- Outer delicate framing -->
    <rect x="24" y="24" width="552" height="702" fill="none" stroke="${theme.border}" stroke-width="1.2"/>
    
    <!-- Header meta -->
    <text x="44" y="56" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" letter-spacing="3" fill="#777777">${STORE_CONFIG.storeName} // COLLECTION</text>
    <text x="556" y="56" text-anchor="end" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#777777">${viewTag}</text>
    
    <!-- Central visual silhouette frame -->
    <circle cx="300" cy="330" r="135" fill="#FFFFFF" fill-opacity="0.9" stroke="${theme.border}" stroke-width="1.5"/>
    
    <!-- Abstract architectural silhouette representation -->
    <g transform="translate(300, 330)" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      ${getCategoryIconSvgPath(theme.icon)}
    </g>
    
    <!-- Primary Title & Typography -->
    <text x="300" y="525" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="4" fill="#666666">${category}</text>
    <text x="300" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="400" fill="${theme.text}">${truncateText(safeName, 26)}</text>
    
    <!-- Spec tags footer -->
    <line x1="160" y1="590" x2="440" y2="590" stroke="${theme.border}" stroke-width="1"/>
    <text x="300" y="618" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="12" font-weight="500" letter-spacing="1.5" fill="#777777">${code}${firstColor ? "  •  " + firstColor.toUpperCase() : ""}</text>
    
    <!-- Bottom corner stamps -->
    <text x="44" y="700" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="10" letter-spacing="1.5" fill="#999999">AUTHENTIC SPEC</text>
    <text x="556" y="700" text-anchor="end" font-family="system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="10" letter-spacing="1.5" fill="#999999">INDEPENDENT ATELIER</text>
  </svg>`;

  const encoded = encodeURIComponent(svg).replace(/'/g, "%27");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Global fallback handler for product images
 */
function handleProductImgError(img, productId, imageIndex = 0) {
  if (!img) return;
  img.onerror = null;
  const product = (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) 
    ? PRODUCTS.find(p => p.id === productId) 
    : null;
  img.src = generateProductPlaceholder(product || { id: productId }, Number(imageIndex) || 0);
}
window.handleProductImgError = handleProductImgError;

/**
 * Global fallback handler for category images
 */
function handleCategoryImgError(img, catId) {
  if (!img) return;
  img.onerror = null;
  const cat = (typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES)) 
    ? CATEGORIES.find(c => c.id === catId) 
    : null;
  img.src = typeof generateCategoryPlaceholder === "function"
    ? generateCategoryPlaceholder(cat || { id: catId, name: catId })
    : "";
}
window.handleCategoryImgError = handleCategoryImgError;

/**
 * Category SVG icon path helper
 */
function getCategoryIconSvgPath(iconType) {
  switch (iconType) {
    case 'shirt':
      return `<path d="M-40 -40 L-20 -50 L0 -35 L20 -50 L40 -40 L50 -10 L35 0 L35 50 L-35 50 L-35 0 L-50 -10 Z"/>
              <line x1="0" y1="-35" x2="0" y2="50"/>
              <circle cx="0" cy="-5" r="2" fill="#111111"/>
              <circle cx="0" cy="15" r="2" fill="#111111"/>
              <circle cx="0" cy="35" r="2" fill="#111111"/>`;
    case 'footwear':
      return `<path d="M-45 25 C-45 5 -20 -15 10 -15 C25 -15 45 0 50 15 L50 30 L-45 30 Z"/>
              <path d="M-30 25 L-25 -5 L-5 -5"/>
              <line x1="-45" y1="20" x2="50" y2="20"/>`;
    case 'bag':
      return `<rect x="-35" y="-15" width="70" height="55" rx="3"/>
              <path d="M-18 -15 C-18 -38 18 -38 18 -15"/>
              <line x1="-35" y1="5" x2="35" y2="5"/>`;
    case 'watch':
      return `<circle cx="0" cy="0" r="28"/>
              <line x1="0" y1="-28" x2="0" y2="-45"/>
              <line x1="0" y1="28" x2="0" y2="45"/>
              <polyline points="0,-15 0,0 12,5"/>
              <rect x="-14" y="-48" width="28" height="6" rx="2"/>
              <rect x="-14" y="42" width="28" height="6" rx="2"/>`;
    case 'device':
      return `<rect x="-35" y="-35" width="70" height="70" rx="10"/>
              <circle cx="0" cy="0" r="18"/>
              <line x1="0" y1="-18" x2="0" y2="18"/>
              <line x1="-18" y1="0" x2="18" y2="0"/>`;
    case 'home':
      return `<path d="M-25 40 L-20 -10 L-10 -30 L10 -30 L20 -10 L25 40 Z"/>
              <ellipse cx="0" cy="-30" rx="10" ry="3"/>
              <line x1="-15" y1="10" x2="15" y2="10"/>`;
    default:
      return `<rect x="-30" y="-30" width="60" height="60" rx="4"/>
              <line x1="-30" y1="0" x2="30" y2="0"/>
              <line x1="0" y1="-30" x2="0" y2="30"/>`;
  }
}

/**
 * Text truncator helper
 */
function truncateText(text, maxLen) {
  if (!text) return "";
  return text.length > maxLen ? text.substring(0, maxLen - 1) + "…" : text;
}
