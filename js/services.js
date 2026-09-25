/**
 * =====================================================================
 * FANA COMMERCE — Central Services Catalog Data
 * =====================================================================
 * Manages creative and commercial services offered alongside physical products:
 * 1. Personal Advertisement
 * 2. Graphic Design
 * 3. Digital Commercial Services
 *
 * Each service includes:
 * - Unique service code (e.g. FAS-001)
 * - Category, name, short and detailed descriptions
 * - Multiple portfolio images for visual gallery and zoom
 * - Clear deliverables and turnaround specs
 * - Demo pricing badge with transparency note
 * =====================================================================
 */

const SERVICE_CATEGORIES = [
  {
    id: "personal-ad",
    name: "Personal Advertisement",
    icon: "megaphone",
    description: "Tailored personal promotion, announcement flyers, personal portfolio cards, and individual social campaigns."
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    icon: "palette",
    description: "High-impact visual identity, custom logo creation, typography systems, packaging, and commercial brand collateral."
  },
  {
    id: "digital-commercial",
    name: "Digital Commercial Services",
    icon: "globe",
    description: "Full-funnel digital advertisement packages, social commerce campaigns, and digital storefront optimization."
  }
];

const SERVICES = [
  {
    id: "FAS-001",
    name: "Personal Brand & Advertisement Package",
    category: "Personal Advertisement",
    categoryId: "personal-ad",
    price: 3500,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Final quote tailored to deliverable volume",
    badge: "Popular Service",
    shortDescription: "Custom announcement and personal advertising assets tailored for individuals, freelancers, and personal brands.",
    description: "A comprehensive personal advertising package designed to elevate your personal brand. Includes curated promotional flyers, personal showcase banner graphics, custom bio/profile cards, and high-resolution printable cards for personal events or business launches.",
    deliverables: [
      "3 Custom Personal Promo Flyers (1080x1350 portrait)",
      "High-Resolution Print PDF (CMYK vector format)",
      "Social Media Story & Banner Pack (Instagram/Telegram)",
      "Personal Bio & Contact Card graphic",
      "3 Revision rounds included",
      "Fast 48-Hour delivery"
    ],
    specifications: {
      "Turnaround": "48 – 72 Hours",
      "Deliverable Formats": "PNG, JPEG, Vector PDF, SVG",
      "Resolution": "300 DPI Print-Ready & Optimized RGB",
      "Revisions": "3 Complimentary Rounds",
      "Scope": "Digital & Physical Print Ready"
    },
    images: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "FAS-002",
    name: "Event & Personal Milestone Promotion",
    category: "Personal Advertisement",
    categoryId: "personal-ad",
    price: 2800,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Custom packages available upon inquiry",
    badge: "Milestone Special",
    shortDescription: "Polished advertising posters and digital announcements for weddings, graduations, exhibitions, and milestones.",
    description: "Celebrate and broadcast your special milestone with bespoke advertising designs. Crafted with minimal elegance and timeless typography, this package provides digital invitations, social media teaser posters, and large-format printed milestone banners.",
    deliverables: [
      "Master Event Poster & Banner (Digital & Print)",
      "Interactive Digital Invitation Card (PDF & Mobile JPG)",
      "Countdown & Announcement Social Posts (5 variants)",
      "Telegram & WhatsApp Broadcast Graphics",
      "2 Revision rounds included"
    ],
    specifications: {
      "Turnaround": "48 Hours",
      "Deliverable Formats": "PDF Print-Ready, JPG, PNG",
      "Sizes": "A3 / A4 / Square / 9:16 Vertical",
      "Revisions": "2 Rounds"
    },
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "FAS-003",
    name: "Custom Brand Identity & Logo Design",
    category: "Graphic Design",
    categoryId: "graphic-design",
    price: 6500,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Comprehensive brand system",
    badge: "Core Design",
    shortDescription: "Distinctive logo creation, typography system, color palette, and complete brand identity guide.",
    description: "Give your business or personal endeavor a lasting, memorable visual presence. We develop timeless primary and secondary logo marks, custom curated typography pairings, a coherent color system, and brand usage guidelines that ensure consistency across all mediums.",
    deliverables: [
      "Primary & Secondary Vector Logo Marks",
      "Monogram / Icon / Favicon Variations",
      "Brand Color Palette (HEX, RGB, CMYK codes)",
      "Typography Hierarchy & Font Pairings",
      "Brand Style Sheet & Guidelines (PDF Guide)",
      "Full Commercial Copyright & Source Vector Files (SVG, AI, EPS)"
    ],
    specifications: {
      "Turnaround": "5 – 7 Business Days",
      "Deliverable Formats": "AI, SVG, EPS, PDF, High-Res PNG",
      "Source Files": "Included (100% Vector)",
      "Revisions": "4 Iteration Rounds"
    },
    images: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "FAS-004",
    name: "Packaging, Labels & Print Collateral",
    category: "Graphic Design",
    categoryId: "graphic-design",
    price: 4800,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Print-ready dieline specifications",
    badge: "Artisan Standard",
    shortDescription: "Print-ready box packaging, garment hang tags, product labels, and branded shopping bag layouts.",
    description: "Elevate your physical products with artisan-grade packaging and print design. Tailored specifically for retail boutiques, apparel makers, and independent producers who demand meticulous dielines, foil-stamp options, and tactile elegance.",
    deliverables: [
      "Custom Packaging Box / Sleeve Dieline Layout",
      "Product Label & Bottle / Jar Wraparound Design",
      "Garment Hang Tag & Care Label Artwork",
      "Branded Shopping Bag & Tissue Paper Pattern",
      "Pre-flight Print Verification with Printer Specs"
    ],
    specifications: {
      "Turnaround": "4 – 5 Business Days",
      "Deliverable Formats": "CMYK Vector PDF, AI, High-Res Proofs",
      "Dieline Precision": "1:1 Scale Print Ready with Bleed",
      "Revisions": "3 Rounds"
    },
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "FAS-005",
    name: "Social Media Commercial Campaign Kit",
    category: "Digital Commercial Services",
    categoryId: "digital-commercial",
    price: 5200,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Monthly & per-campaign pricing available",
    badge: "Commerce Boost",
    shortDescription: "A turnkey digital campaign suite of 12 commercial post graphics, product showcases, and promo reels/stories.",
    description: "Engineered to convert scrollers into buyers on Telegram, Instagram, and Facebook. This digital commercial kit includes 12 cohesive ad layouts highlighting bestsellers, discounts, testimonials, and studio craft stories with unified typography.",
    deliverables: [
      "12 Commercial Social Media Graphics (Square 1:1 & Portrait 4:5)",
      "6 Animated Story / Reel Slide Templates (9:16)",
      "3 Promotional Banner Headers (Telegram Channel & Facebook)",
      "Compelling Copywriting Headlines & Call-to-Action suggestions",
      "Editable Template Files (Figma / PSD on request)"
    ],
    specifications: {
      "Turnaround": "3 – 4 Business Days",
      "Deliverable Formats": "PNG, MP4/GIF animations, WebP",
      "Aspect Ratios": "1:1, 4:5, 9:16, Banner",
      "Revisions": "3 Rounds"
    },
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "FAS-006",
    name: "Digital Catalog & Storefront Setup",
    category: "Digital Commercial Services",
    categoryId: "digital-commercial",
    price: 7800,
    currency: "ETB",
    isDemoPrice: true,
    pricingNote: "Demo price • Custom development quotes on request",
    badge: "Turnkey Digital",
    shortDescription: "End-to-end digital product showcase setup with Telegram bot configuration and responsive web deployment.",
    description: "Launch your own seamless modern commercial presence. We configure and deploy an ultra-fast, zero-database static product catalog and matching Telegram commerce bot, complete with your custom branding, product images, categories, and direct order workflows.",
    deliverables: [
      "Custom Branded Responsive Web Catalog Setup",
      "Interactive Telegram Bot Deployment & Channel Setup",
      "Product Catalog Initial Import & Configuration",
      "Direct Contact Dispatch Integration (Telegram, Phone, SMS, Email)",
      "Free Deployment on Fast CDN (GitHub Pages / Netlify / Vercel)",
      "Complete Handover & 14-Day Post-Launch Support"
    ],
    specifications: {
      "Turnaround": "5 – 7 Business Days",
      "Stack": "Clean Vanilla HTML5/CSS3/JS + Node.js Telegram Bot",
      "Hosting": "Free High-Speed CDN Deployment",
      "Revisions": "Unlimited during setup",
      "Support": "14 Days Included"
    },
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80"
    ]
  }
];

// Helper Functions
function getServiceCategories() {
  return SERVICE_CATEGORIES;
}

function getAllServices() {
  return SERVICES;
}

function getServiceById(id) {
  if (!id) return null;
  const cleanId = String(id).toUpperCase().trim();
  return SERVICES.find(s => s.id.toUpperCase() === cleanId) || null;
}

function getServicesByCategory(categoryIdOrName) {
  if (!categoryIdOrName || categoryIdOrName === "all" || categoryIdOrName === "All Services") {
    return SERVICES;
  }
  const clean = categoryIdOrName.toLowerCase().trim();
  return SERVICES.filter(s =>
    (s.categoryId && s.categoryId.toLowerCase() === clean) ||
    (s.category && s.category.toLowerCase() === clean)
  );
}

function searchServices(query) {
  if (!query || !query.trim()) return SERVICES;
  const q = query.toLowerCase().trim();
  return SERVICES.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    (s.category && s.category.toLowerCase().includes(q)) ||
    (s.description && s.description.toLowerCase().includes(q)) ||
    (s.shortDescription && s.shortDescription.toLowerCase().includes(q))
  );
}

// Generate fallback SVG placeholder for services when offline or broken
function generateServicePlaceholder(service, imageIndex = 0) {
  const title = (service && service.name) ? service.name : "FANA Service";
  const code = (service && service.id) ? service.id : "FAS";
  const cat = (service && service.category) ? service.category : "Creative Service";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="srvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1e24" />
        <stop offset="100%" stop-color="#0f0f12" />
      </linearGradient>
    </defs>
    <rect width="900" height="900" fill="url(#srvGrad)"/>
    <circle cx="450" cy="400" r="160" fill="none" stroke="#2a2a34" stroke-width="2"/>
    <text x="450" y="370" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">FANA SERVICES</text>
    <text x="450" y="420" font-family="'Plus Jakarta Sans', sans-serif" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle">${code}</text>
    <text x="450" y="465" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" fill="#71717a" text-anchor="middle">${cat.toUpperCase()}</text>
    <rect x="250" y="580" width="400" height="1" fill="#2a2a34"/>
    <text x="450" y="620" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="600" fill="#e4e4e7" text-anchor="middle">${title}</text>
    <text x="450" y="660" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="500" fill="#a1a1aa" text-anchor="middle">Portfolio Image ${imageIndex + 1} &bull; FANA Atelier &amp; Goods</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Universal Module Definition (UMD) export for Node.js / Telegram bot
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SERVICE_CATEGORIES,
    SERVICES,
    getServiceCategories,
    getAllServices,
    getServiceById,
    getServicesByCategory,
    searchServices,
    generateServicePlaceholder
  };
}
