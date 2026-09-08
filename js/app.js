/**
 * =====================================================================
 * TESSÉ - Main Application Bootstrapper & UI Renderer
 * =====================================================================
 * Handles:
 * - Dynamic store configuration synchronization (name, tagline, announcements)
 * - Category cards rendering
 * - Featured products & New Arrivals rendering
 * - Main catalog grid rendering
 * - Product card component generation
 * - Global mobile navigation and modal event listeners
 * - Deep linking with URL hash (#product-P001)
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

/**
 * Initialize all subsystems of the static shopping catalog
 */
function initApp() {
  syncStoreConfigWithDOM();
  renderCategoriesOverview();
  renderFeaturedSection();
  renderNewArrivalsSection();
  
  if (typeof initFilterControls === "function") {
    initFilterControls();
  }
  
  if (typeof initSearchEvents === "function") {
    initSearchEvents();
  }

  if (typeof updateOrderDrawerUI === "function") {
    updateOrderDrawerUI();
  }

  if (typeof initContactSection === "function") {
    initContactSection();
  }

  bindGlobalEventListeners();
  handleUrlHashRouting();

  // Initial catalog render
  if (typeof applyAllFiltersAndRender === "function") {
    applyAllFiltersAndRender();
  }
}

/**
 * Synchronize brand identity, tagline, announcement, and hero from STORE_CONFIG into DOM
 */
function syncStoreConfigWithDOM() {
  // Brand name in logos
  const brandNames = document.querySelectorAll(".brand-store-name, #header-brand-logo, #footer-brand-logo");
  brandNames.forEach(el => {
    el.textContent = STORE_CONFIG.storeName;
  });

  // Taglines
  const taglines = document.querySelectorAll(".brand-tagline, #header-brand-tagline, #hero-tagline");
  taglines.forEach(el => {
    el.textContent = STORE_CONFIG.tagline;
  });

  // Announcement bar
  const announcementEl = document.getElementById("header-announcement-text");
  if (announcementEl && STORE_CONFIG.announcement) {
    announcementEl.textContent = STORE_CONFIG.announcement;
  }

  // Hero section content
  const heroHeading = document.getElementById("hero-heading");
  if (heroHeading && STORE_CONFIG.heroHeading) {
    heroHeading.textContent = STORE_CONFIG.heroHeading;
  }

  const heroSubheading = document.getElementById("hero-subheading");
  if (heroSubheading && STORE_CONFIG.heroSubheading) {
    heroSubheading.textContent = STORE_CONFIG.heroSubheading;
  }

  const heroCta = document.getElementById("hero-cta-btn");
  if (heroCta && STORE_CONFIG.heroCtaText) {
    heroCta.textContent = STORE_CONFIG.heroCtaText;
    if (STORE_CONFIG.heroCtaLink) heroCta.setAttribute("href", STORE_CONFIG.heroCtaLink);
  }

  const heroSecCta = document.getElementById("hero-secondary-cta-btn");
  if (heroSecCta && STORE_CONFIG.heroSecondaryCtaText) {
    heroSecCta.textContent = STORE_CONFIG.heroSecondaryCtaText;
    if (STORE_CONFIG.heroSecondaryCtaLink) heroSecCta.setAttribute("href", STORE_CONFIG.heroSecondaryCtaLink);
  }

  // Dynamic current year in footer copyright
  const yearEl = document.getElementById("footer-current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Generate standard HTML string for a single Product Card
 * @param {object} product 
 * @returns {string}
 */
function createProductCardHtml(product) {
  if (!product) return "";

  const pricing = calculatePricing(product.price, product.discount);
  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [generateProductPlaceholder(product, 0)];

  const mainImage = images[0];
  const secondImage = images.length > 1 ? images[1] : null;
  const placeholder = generateProductPlaceholder(product, 0);

  // Stock status pill
  let stockBadge = "";
  if (typeof product.quantity === "number" && product.quantity <= 0) {
    stockBadge = `<span class="badge-stock badge-sold-out">Sold Out</span>`;
  } else if ((product.availability || "").toLowerCase().includes("limited") || (product.quantity && product.quantity <= 5)) {
    stockBadge = `<span class="badge-stock badge-low-stock">Limited</span>`;
  }

  // Discount badge
  const discountBadge = pricing.hasDiscount 
    ? `<span class="badge-discount">-${pricing.discountPercent}%</span>` 
    : "";

  // Color options hint
  const colors = product.colors || product.color || [];
  let colorCountBadge = "";
  if (Array.isArray(colors) && colors.length > 1) {
    colorCountBadge = `<span class="card-color-count">${colors.length} colors</span>`;
  }

  return `
    <article class="product-card" id="card-${product.id}">
      <div class="product-card-media" onclick="openProductDetailModal('${product.id}')">
        <!-- Badges container -->
        <div class="card-badges">
          ${discountBadge}
          ${stockBadge}
        </div>

        <!-- Product Image with graceful SVG fallback -->
        <img class="card-img-primary" 
             src="${mainImage}" 
             alt="${escapeHtml(product.name)}" 
             loading="lazy" 
             referrerpolicy="no-referrer" 
             onerror="handleProductImgError(this, '${product.id}', 0)">

        ${secondImage ? `
          <img class="card-img-hover" 
               src="${secondImage}" 
               alt="${escapeHtml(product.name)} view 2" 
               loading="lazy" 
               referrerpolicy="no-referrer" 
               onerror="this.style.display='none'">
        ` : ""}

        <!-- Hover Action Overlay -->
        <div class="card-hover-actions" onclick="event.stopPropagation()">
          <button type="button" 
                  class="btn-card-action btn-quick-view" 
                  onclick="openProductDetailModal('${product.id}')"
                  aria-label="Quick view of ${escapeHtml(product.name)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Quick View</span>
          </button>
          
          <button type="button" 
                  class="btn-card-action btn-card-order" 
                  onclick="handleCardOrderClick('${product.id}')"
                  aria-label="Add ${escapeHtml(product.name)} to order">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Order</span>
          </button>
        </div>
      </div>

      <div class="product-card-body">
        <div class="card-category-row">
          <span class="card-category">${escapeHtml(product.category)}</span>
          ${colorCountBadge}
        </div>

        <h3 class="card-title">
          <a href="#product-${product.id}" onclick="event.preventDefault(); openProductDetailModal('${product.id}')">
            ${escapeHtml(product.name)}
          </a>
        </h3>

        ${product.brand ? `<span class="card-brand">${escapeHtml(product.brand)}</span>` : ""}

        <div class="card-pricing-row">
          <span class="card-price-current">${formatPrice(pricing.finalPrice)}</span>
          ${pricing.hasDiscount ? `
            <span class="card-price-original">${formatPrice(product.price)}</span>
          ` : ""}
        </div>
      </div>
    </article>
  `;
}

/**
 * Handle direct "Order" click from card:
 * If item requires size or color choice, open details view so user picks.
 * Otherwise, adds directly to order.
 * @param {string} productId 
 */
function handleCardOrderClick(productId) {
  const p = getProductById(productId);
  if (!p) return;

  const hasSizes = Array.isArray(p.sizes) && p.sizes.length > 0;
  const colors = p.colors || p.color || [];
  const hasMultipleColors = Array.isArray(colors) && colors.length > 1;

  if (hasSizes || hasMultipleColors) {
    openProductDetailModal(productId);
    showToastNotification("Please select your preferred options.");
  } else {
    addItemToOrder({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      discount: p.discount || 0,
      currency: p.currency || STORE_CONFIG.currency,
      image: (p.images && p.images[0]) || "",
      color: colors.length > 0 ? colors[0] : null,
      size: null,
      quantity: 1
    });
    showToastNotification(`Added "${p.name}" to your order list.`);
  }
}

/**
 * Render Category Cards Section on Homepage
 */
function renderCategoriesOverview() {
  const container = document.getElementById("categories-overview-grid") || document.getElementById("categories-grid");
  if (!container) return;

  // Render all real categories except 'all'
  const displayCats = CATEGORIES.filter(c => c.id !== "all");

  let html = "";
  displayCats.forEach(cat => {
    const count = getCategoryProductCount(cat.id);
    const catPlaceholder = generateCategoryPlaceholder(cat);

    html += `
      <div class="category-card" onclick="selectCategoryFromCard('${cat.id}')">
        <div class="category-card-media">
          <img src="${cat.image}" 
               alt="${escapeHtml(cat.name)}" 
               loading="lazy" 
               referrerpolicy="no-referrer" 
               onerror="handleCategoryImgError(this, '${cat.id}')">
          <div class="category-card-overlay"></div>
        </div>
        <div class="category-card-content">
          <span class="category-card-count">${count} items</span>
          <h3 class="category-card-title">${escapeHtml(cat.name)}</h3>
          <p class="category-card-desc">${escapeHtml(cat.description || '')}</p>
          <span class="category-card-link">Explore Collection &rarr;</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Helper to generate an SVG placeholder for category cards
 * @param {object} cat 
 * @returns {string}
 */
function generateCategoryPlaceholder(cat) {
  const name = (cat && cat.name ? cat.name : "Collection").toUpperCase();
  const icon = (cat && cat.icon) ? cat.icon : "grid";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 620" width="100%" height="100%">
    <rect width="500" height="620" fill="#222222"/>
    <circle cx="250" cy="270" r="110" fill="#2d2d2d"/>
    <g transform="translate(250, 270)" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
      ${getCategoryIconSvgPath(icon)}
    </g>
    <text x="250" y="440" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="#aaaaaa">COLLECTION</text>
    <text x="250" y="480" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="400" fill="#ffffff">${escapeHtml(name)}</text>
  </svg>`;
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Action when customer clicks a category card
 * @param {string} catId 
 */
function selectCategoryFromCard(catId) {
  if (typeof setCategoryFilter === "function") {
    setCategoryFilter(catId);
  }
  const catalogEl = document.getElementById("catalog");
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Render Featured Products spotlight section
 */
function renderFeaturedSection() {
  const container = document.getElementById("featured-products-grid");
  if (!container) return;

  const featured = getFeaturedProducts().slice(0, 4);
  if (featured.length === 0) {
    const fallback = PRODUCTS.slice(0, 4);
    container.innerHTML = fallback.map(p => createProductCardHtml(p)).join("");
    return;
  }

  container.innerHTML = featured.map(p => createProductCardHtml(p)).join("");
}

/**
 * Render New Arrivals section
 */
function renderNewArrivalsSection() {
  const container = document.getElementById("new-arrivals-products-grid") || document.getElementById("new-arrivals-grid");
  if (!container) return;

  const newItems = getNewArrivals().slice(0, 4);
  if (newItems.length === 0) {
    const fallback = PRODUCTS.slice(4, 8);
    container.innerHTML = fallback.map(p => createProductCardHtml(p)).join("");
    return;
  }

  container.innerHTML = newItems.map(p => createProductCardHtml(p)).join("");
}

/**
 * Render catalog products grid
 * @param {Array} products 
 */
function renderCatalogGrid(products) {
  const container = document.getElementById("catalog-products-grid");
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = products.map(p => createProductCardHtml(p)).join("");
}

/**
 * Handle URL hash changes for deep linking (e.g. #product-P001)
 */
function handleUrlHashRouting() {
  const hash = window.location.hash;
  if (hash.startsWith("#product-")) {
    const pId = hash.replace("#product-", "").trim();
    if (pId) {
      setTimeout(() => {
        openProductDetailModal(pId);
      }, 100);
    }
  }

  window.addEventListener("hashchange", () => {
    const newHash = window.location.hash;
    if (newHash.startsWith("#product-")) {
      const pId = newHash.replace("#product-", "").trim();
      if (pId && (!activeDetailProduct || activeDetailProduct.id !== pId)) {
        openProductDetailModal(pId);
      }
    } else if (activeDetailProduct) {
      closeProductDetailModal();
    }
  });
}

/**
 * Bind global interface interactions:
 * - Mobile navigation menu toggle
 * - Order drawer toggle buttons
 * - Modal background dismissals
 * - Escape key dismissal
 */
function bindGlobalEventListeners() {
  // Mobile Nav Toggle
  const mobileToggleBtn = document.getElementById("mobile-menu-toggle") || document.getElementById("btn-mobile-nav-toggle");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileCloseBtn = document.getElementById("mobile-nav-close") || document.getElementById("btn-mobile-nav-close");

  function toggleMobileNav() {
    const isOpen = mobileNavDrawer && !mobileNavDrawer.classList.contains("is-open");
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.toggle("is-open", isOpen);
      mobileNavDrawer.setAttribute("aria-hidden", String(!isOpen));
    }
    if (mobileNavOverlay) mobileNavOverlay.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("drawer-open", isOpen);
    if (mobileToggleBtn) mobileToggleBtn.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove("is-open");
      mobileNavDrawer.setAttribute("aria-hidden", "true");
    }
    if (mobileNavOverlay) mobileNavOverlay.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    if (mobileToggleBtn) mobileToggleBtn.setAttribute("aria-expanded", "false");
  }

  // Expose globally for inline onclick handlers
  window.closeMobileNav = closeMobileNav;
  window.toggleMobileNav = toggleMobileNav;

  if (mobileToggleBtn) {
    mobileToggleBtn.setAttribute("aria-expanded", "false");
    mobileToggleBtn.addEventListener("click", toggleMobileNav);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", closeMobileNav);
  }

  // Close mobile nav when clicking any nav link
  const navLinks = document.querySelectorAll(".mobile-nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  // Keep the desktop navigation underline aligned with the visible section.
  const desktopNavLinks = document.querySelectorAll(".desktop-nav .nav-link");
  const navigationSections = Array.from(desktopNavLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActiveNavLink = () => {
    const marker = window.scrollY + 120;
    let activeSection = navigationSections[0];

    navigationSections.forEach(section => {
      if (section.offsetTop <= marker && section.offsetTop >= activeSection.offsetTop) {
        activeSection = section;
      }
    });

    desktopNavLinks.forEach(link => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeSection.id}`);
    });
  };

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Order Drawer Triggers (Header Bag button, Mobile menu item, Floating pill, and any .trigger-order-drawer element)
  const openCartBtns = document.querySelectorAll(
    ".trigger-order-drawer, #btn-open-bag, .header-bag-btn, .btn-open-cart, #btn-header-cart, #btn-mobile-cart, .mobile-nav-order-btn, #floating-order-btn"
  );
  openCartBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileNav();
      if (typeof openOrderDrawer === "function") {
        openOrderDrawer();
      }
    });
  });

  const closeCartBtn = document.getElementById("order-drawer-close") || document.getElementById("btn-close-order-drawer");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      if (typeof closeOrderDrawer === "function") closeOrderDrawer();
    });
  }

  const cartOverlay = document.getElementById("order-drawer-overlay");
  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      if (typeof closeOrderDrawer === "function") closeOrderDrawer();
    });
  }

  const clearOrderBtn = document.getElementById("btn-clear-order-list") || document.getElementById("btn-clear-order-drawer");
  if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", () => {
      if (typeof clearOrderList === "function") clearOrderList();
    });
  }

  const checkoutDrawerBtn = document.getElementById("btn-order-drawer-checkout") || document.getElementById("btn-drawer-checkout");
  if (checkoutDrawerBtn) {
    checkoutDrawerBtn.addEventListener("click", () => {
      if (typeof openOrderDispatchModal === "function") openOrderDispatchModal();
    });
  }

  // Product Detail Modal Dismiss - supports both direct button ID and fallback class
  const modalCloseBtn = document.getElementById("product-detail-close") || document.getElementById("btn-close-product-detail");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeProductDetailModal();
    });
  }

  const modalOverlay = document.getElementById("product-detail-modal") || document.getElementById("product-detail-modal-overlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      // Dismiss only if customer clicks outside modal-container
      if (e.target === modalOverlay) {
        closeProductDetailModal();
      }
    });
  }

  // Order Dispatch Modal Dismiss
  const dispatchCloseBtn = document.getElementById("order-modal-close") || document.getElementById("btn-close-order-dispatch");
  if (dispatchCloseBtn) {
    dispatchCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeOrderDispatchModal();
    });
  }

  const dispatchOverlay = document.getElementById("order-action-modal") || document.getElementById("order-dispatch-modal-overlay");
  if (dispatchOverlay) {
    dispatchOverlay.addEventListener("click", (e) => {
      if (e.target === dispatchOverlay) {
        closeOrderDispatchModal();
      }
    });
  }

  // Global Escape Key Handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductDetailModal();
      closeOrderDispatchModal();
      closeOrderDrawer();
      closeMobileNav();
    }
  });
}
