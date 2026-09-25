/**
 * =====================================================================
 * TESSÉ - Dynamic Categories System
 * =====================================================================
 * The seller can easily add, edit, or remove categories by modifying
 * this array. The entire UI (navigation, filter pills, home sections)
 * automatically recognizes and renders all categories.
 */

const CATEGORIES = [
  {
    id: "all",
    name: "All Items",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    description: "Full archive of apparel, everyday essentials, and mindful living objects.",
    icon: "grid"
  },
  {
    id: "clothing",
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    description: "Structured cotton tops, relaxed linen shirts, and modern casual outerwear.",
    icon: "shirt"
  },
  {
    id: "shoes",
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    description: "Understated full-grain leather sneakers, classic casual derbies, and daily sandals.",
    icon: "footwear"
  },
  {
    id: "bags",
    name: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    description: "Heavyweight canvas daily totes, commuter backpacks, and leather crossbodies.",
    icon: "bag"
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Minimalist stainless timepieces, cardholders, leather belts, and sunglasses.",
    icon: "watch"
  },
  {
    id: "home",
    name: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    description: "Ceramic pour-over sets, minimal desk lamps, and handwoven baskets.",
    icon: "home"
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Studio-grade wireless acoustic earbuds and ambient portable lighting.",
    icon: "device"
  },
  {
    id: "beauty",
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Natural botanical skin oils, solid botanical fragrances, and organic grooming.",
    icon: "box"
  },
  {
    id: "other",
    name: "Other",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    description: "Limited-edition artisan objects and studio workshop exclusives.",
    icon: "box"
  }
];

/**
 * Find category by ID (case-insensitive)
 * @param {string} id 
 * @returns {object|null}
 */
function getCategoryById(id) {
  if (!id) return null;
  const cleanId = id.toString().toLowerCase().trim();
  return CATEGORIES.find(c => c.id.toLowerCase() === cleanId) || null;
}

/**
 * Get product count for a specific category ID
 * @param {string} categoryId 
 * @returns {number}
 */
function getCategoryProductCount(categoryId) {
  if (!categoryId || categoryId === "all") {
    return PRODUCTS.length;
  }
  const cleanId = categoryId.toLowerCase();
  return PRODUCTS.filter(p => {
    const cat = (p.category || "").toLowerCase();
    return cat === cleanId;
  }).length;
}
