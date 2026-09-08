/**
 * =====================================================================
 * TESSÉ - Dynamic Product Detail View & Image Gallery
 * =====================================================================
 * Handles:
 * - Product modal display with URL hash synchronization (#product-P001)
 * - Interactive multi-image gallery with real-time crosshair zooming (scale 2.2x)
 * - Touch & mouse crosshair zoom tracking
 * - Color and Size selection with active state and validation
 * - Dynamic availability and pricing computation
 * - Compact, descriptive specifications and feature highlights
 * - Direct Add-to-Order and Instant Order Now / Contact Seller
 * - Related products ("You May Also Like")
 */

let activeDetailProduct = null;
let currentGalleryImageIndex = 0;
let currentDetailQuantity = 1;
let currentDetailSelectedColor = null;
let currentDetailSelectedSize = null;

/**
 * Open the Product Detail Modal for a specific product ID
 * @param {string} productId 
 */
function openProductDetailModal(productId) {
  const product = getProductById(productId);
  if (!product) {
    showToastNotification("Product could not be found.");
    return;
  }

  activeDetailProduct = product;
  currentGalleryImageIndex = 0;
  currentDetailQuantity = 1;
  
  // Set default color if colors exist
  const colors = product.colors || product.color || [];
  currentDetailSelectedColor = (Array.isArray(colors) && colors.length > 0) ? colors[0] : null;

  // Set default size if sizes exist
  currentDetailSelectedSize = (Array.isArray(product.sizes) && product.sizes.length > 0) ? product.sizes[0] : null;

  renderProductDetailContent(product);

  const modal = document.getElementById("product-detail-modal");
  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  // Ensure close button handler is attached
  const closeBtn = document.getElementById("product-detail-close") || document.getElementById("btn-close-product-detail");
  if (closeBtn) {
    closeBtn.onclick = closeProductDetailModal;
  }

  // Initialize interactive crosshair zoom
  setupGalleryZoom();

  // Update URL hash without jumping page
  try {
    history.replaceState(null, "", `#product-${product.id}`);
  } catch (e) {
    // Ignore iframe navigation error
  }
}

/**
 * Close the Product Detail Modal
 */
function closeProductDetailModal() {
  const modal = document.getElementById("product-detail-modal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  activeDetailProduct = null;
  // Clear hash safely
  try {
    if (window.location.hash.startsWith("#product-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  } catch (err) {
    if (window.location.hash.startsWith("#product-")) {
      window.location.hash = "";
    }
  }
}
window.closeProductDetailModal = closeProductDetailModal;

/**
 * Interactive crosshair zoom setup
 * Allows the crosshair cursor to magnify the item with fluid coordinate panning
 */
function setupGalleryZoom() {
  const container = document.getElementById("gallery-zoom-container");
  const img = document.getElementById("detail-main-image");
  const zoomBadge = document.getElementById("gallery-zoom-badge");
  if (!container || !img) return;

  function handleZoomMove(clientX, clientY) {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Relative percentage coordinates within the gallery container
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    img.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
    img.style.transform = "scale(2.2)";
    container.classList.add("is-zoomed");

    if (zoomBadge) {
      zoomBadge.classList.add("is-zooming");
      zoomBadge.innerHTML = `
        <span class="zoom-active-dot"></span>
        <span>2.2× Magnified</span>
      `;
    }
  }

  function resetZoom() {
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
    container.classList.remove("is-zoomed");

    if (zoomBadge) {
      zoomBadge.classList.remove("is-zooming");
      zoomBadge.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <span>Hover crosshair to zoom</span>
      `;
    }
  }

  container.onmouseenter = (e) => {
    handleZoomMove(e.clientX, e.clientY);
  };

  container.onmousemove = (e) => {
    handleZoomMove(e.clientX, e.clientY);
  };

  container.onmouseleave = () => {
    resetZoom();
  };

  // Support mobile/touch dragging
  container.ontouchstart = (e) => {
    if (e.touches && e.touches[0]) {
      handleZoomMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  container.ontouchmove = (e) => {
    if (e.touches && e.touches[0]) {
      e.preventDefault();
      handleZoomMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  container.ontouchend = () => {
    resetZoom();
  };

  container.ontouchcancel = () => {
    resetZoom();
  };
}

/**
 * Render all product details, images, options, specs, and related items into modal
 * @param {object} product 
 */
function renderProductDetailContent(product) {
  const container = document.getElementById("product-detail-modal-body") || document.getElementById("product-detail-content");
  if (!container) return;

  const pricing = calculatePricing(product.price, product.discount);
  const images = (Array.isArray(product.images) && product.images.length > 0) 
    ? product.images 
    : [generateProductPlaceholder(product, 0)];

  // Availability styling
  let availabilityClass = "stock-in";
  let availabilityText = product.availability || "In Stock • Studio Ready";
  let isOutOfStock = false;

  if (typeof product.quantity === "number" && product.quantity <= 0) {
    availabilityClass = "stock-out";
    availabilityText = "Out of Stock";
    isOutOfStock = true;
  } else if ((product.availability || "").toLowerCase().includes("out")) {
    availabilityClass = "stock-out";
    availabilityText = "Out of Stock";
    isOutOfStock = true;
  } else if ((product.availability || "").toLowerCase().includes("limited") || (product.quantity && product.quantity <= 5)) {
    availabilityClass = "stock-low";
    availabilityText = `Limited Edition (${product.quantity || 'Few'} remaining)`;
  }

  // Color Selector HTML
  const colors = product.colors || product.color || [];
  let colorSelectorHtml = "";
  if (Array.isArray(colors) && colors.length > 0) {
    let colorBtns = colors.map(c => {
      const isSelected = c === currentDetailSelectedColor;
      return `
        <button type="button" 
                class="option-pill-btn ${isSelected ? 'is-selected' : ''}" 
                onclick="selectDetailColor('${escapeHtml(c)}')">
          ${escapeHtml(c)}
        </button>
      `;
    }).join("");

    colorSelectorHtml = `
      <div class="product-option-group">
        <div class="option-label-row">
          <label class="option-label">Color Option</label>
          <span class="option-selected-label" id="detail-selected-color-label">${escapeHtml(currentDetailSelectedColor || colors[0])}</span>
        </div>
        <div class="option-pill-group">
          ${colorBtns}
        </div>
      </div>
    `;
  }

  // Size Selector HTML
  let sizeSelectorHtml = "";
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    let sizeBtns = product.sizes.map(s => {
      const isSelected = s === currentDetailSelectedSize;
      return `
        <button type="button" 
                class="option-pill-btn ${isSelected ? 'is-selected' : ''}" 
                onclick="selectDetailSize('${escapeHtml(s)}')">
          ${escapeHtml(s)}
        </button>
      `;
    }).join("");

    sizeSelectorHtml = `
      <div class="product-option-group">
        <div class="option-label-row">
          <label class="option-label">Select Size / Fit</label>
          <span class="option-selected-label" id="detail-selected-size-label">${escapeHtml(currentDetailSelectedSize || product.sizes[0])}</span>
        </div>
        <div class="option-pill-group">
          ${sizeBtns}
        </div>
      </div>
    `;
  }

  // Gallery Thumbnails HTML
  let thumbnailsHtml = "";
  if (images.length > 1) {
    const thumbs = images.map((imgSrc, idx) => {
      const isActive = idx === currentGalleryImageIndex;
      return `
        <button type="button" 
                class="gallery-thumb-btn ${isActive ? 'is-active' : ''}" 
                onclick="setGalleryActiveImage(${idx})"
                aria-label="View photo ${idx + 1}">
          <img src="${imgSrc}" 
               alt="Thumbnail ${idx + 1}" 
               loading="lazy" 
               referrerpolicy="no-referrer" 
               onerror="handleProductImgError(this, '${product.id}', ${idx})">
        </button>
      `;
    }).join("");

    thumbnailsHtml = `<div class="gallery-thumbnails">${thumbs}</div>`;
  }

  // Features Highlights HTML
  let featuresHtml = "";
  if (Array.isArray(product.features) && product.features.length > 0) {
    featuresHtml = `
      <div class="detail-features-block">
        <div class="detail-features-title">Design Highlights</div>
        <div class="detail-features-chips">
          ${product.features.map(f => `
            <div class="feature-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${escapeHtml(f)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Specifications Table HTML
  let specsHtml = "";
  if (product.specifications && Object.keys(product.specifications).length > 0) {
    const specRows = Object.entries(product.specifications).map(([key, val]) => `
      <div class="specs-row">
        <span class="specs-term">${escapeHtml(key)}</span>
        <span class="specs-desc">${escapeHtml(val)}</span>
      </div>
    `).join("");

    specsHtml = `
      <div class="detail-specs-section">
        <h3 class="detail-section-title">Product Specifications</h3>
        <div class="specs-grid">
          ${specRows}
        </div>
      </div>
    `;
  }

  // Related Products HTML
  const relatedList = getRelatedProducts(product.id);
  let relatedHtml = "";
  if (relatedList.length > 0) {
    const relatedCards = relatedList.map(item => {
      const pPricing = calculatePricing(item.price, item.discount);
      const thumb = (item.images && item.images[0]) || generateProductPlaceholder(item, 0);
      return `
        <div class="related-card" onclick="openProductDetailModal('${item.id}')">
          <div class="related-card-img">
            <img src="${thumb}" alt="${escapeHtml(item.name)}" referrerpolicy="no-referrer" onerror="handleProductImgError(this, '${item.id}', 0)">
          </div>
          <div class="related-card-info">
            <span class="related-card-cat">${escapeHtml(item.category)}</span>
            <h4 class="related-card-title">${escapeHtml(item.name)}</h4>
            <span class="related-card-price">${formatPrice(pPricing.finalPrice)}</span>
          </div>
        </div>
      `;
    }).join("");

    relatedHtml = `
      <div class="detail-related-section">
        <h3 class="detail-section-title">You May Also Like</h3>
        <div class="related-products-grid">
          ${relatedCards}
        </div>
      </div>
    `;
  }

  // Complete Detail View Markup - Simple, Compact & Fully Descriptive
  container.innerHTML = `
    <div class="product-detail-layout detail-layout-grid">
      <!-- LEFT: INTERACTIVE IMAGE GALLERY WITH REAL-TIME ZOOM -->
      <div class="detail-gallery-column">
        <div class="gallery-stage" id="gallery-zoom-container">
          <img id="detail-main-image" 
               class="gallery-main-img" 
               src="${images[0]}" 
               alt="${escapeHtml(product.name)}" 
               referrerpolicy="no-referrer" 
               onerror="handleProductImgError(this, '${product.id}', 0)">
          
          ${images.length > 1 ? `
            <button type="button" class="gallery-nav-btn gallery-prev-btn" onclick="stepGalleryImage(-1)" aria-label="Previous image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="gallery-nav-btn gallery-next-btn" onclick="stepGalleryImage(1)" aria-label="Next image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ` : ""}

          <div class="gallery-zoom-badge" id="gallery-zoom-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <span>Hover crosshair to zoom</span>
          </div>

          <div class="gallery-counter" id="gallery-counter">1 / ${images.length}</div>
        </div>

        ${thumbnailsHtml}

        <!-- Studio Highlights Card -->
        <div class="detail-perks-card">
          <div class="perk-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Free Studio Pickup in Addis Ababa</span>
          </div>
          <div class="perk-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Express Direct Delivery Arranged</span>
          </div>
          <div class="perk-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Pay on Pickup or Delivery (Telebirr/CBE/Cash)</span>
          </div>
        </div>
      </div>

      <!-- RIGHT: PRODUCT INFORMATION & ORDER ACTIONS -->
      <div class="detail-info-column">
        <div class="detail-header-meta">
          <span class="detail-category-crumb">${escapeHtml((product.category || "").toUpperCase())}</span>
          <span class="detail-code-badge">CODE: ${escapeHtml(product.id)}</span>
          ${product.brand ? `<span class="detail-brand-badge">${escapeHtml(product.brand)}</span>` : ""}
        </div>

        <h1 class="detail-product-title">${escapeHtml(product.name)}</h1>

        <!-- Price & Stock Row -->
        <div class="detail-price-card">
          <div class="detail-price-row">
            <span class="detail-current-price">${formatPrice(pricing.finalPrice)}</span>
            ${pricing.hasDiscount ? `
              <span class="detail-original-price">${formatPrice(product.price)}</span>
              <span class="detail-discount-tag">Save ${pricing.discountPercent}%</span>
            ` : ""}
          </div>
          <div class="detail-stock-indicator ${availabilityClass}">
            <span class="stock-dot"></span>
            <span>${availabilityText}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="detail-short-desc">
          <p>${escapeHtml(product.description)}</p>
        </div>

        <!-- Feature Highlights -->
        ${featuresHtml}

        <hr class="detail-divider">

        <!-- Selectors (Color & Size) -->
        ${colorSelectorHtml}
        ${sizeSelectorHtml}

        <!-- Quantity Selector & Total Line -->
        <div class="detail-order-builder">
          <div class="product-option-group">
            <label class="option-label">Quantity</label>
            <div class="detail-qty-control">
              <div class="detail-qty-stepper">
                <button type="button" onclick="stepDetailQuantity(-1)" aria-label="Decrease quantity">−</button>
                <span id="detail-qty-display">${currentDetailQuantity}</span>
                <button type="button" onclick="stepDetailQuantity(1)" aria-label="Increase quantity">+</button>
              </div>
              <span class="detail-item-subtotal" id="detail-item-subtotal-display">
                Total: ${formatPrice(pricing.finalPrice * currentDetailQuantity)}
              </span>
            </div>
            ${isOutOfStock ? `<div class="detail-sold-out-note">Product is currently out of stock</div>` : ""}
          </div>

          <!-- Primary & Secondary Order Actions -->
          <div class="detail-action-buttons">
            <button type="button" 
                    class="btn-detail-order-primary" 
                    onclick="triggerDirectProductOrder()" 
                    ${isOutOfStock ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              <span>Instant Order / Contact Seller</span>
            </button>

            <button type="button" 
                    class="btn-detail-order-secondary" 
                    onclick="triggerAddToOrderList()" 
                    ${isOutOfStock ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Add to Order List</span>
            </button>
          </div>
        </div>

        <!-- Direct Contact Quick-Links Banner -->
        <div class="detail-contact-notice">
          <div class="contact-notice-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <div class="contact-notice-text">
            <span>Direct Studio Line: </span>
            <a href="tel:${CONTACT_INFO.phone}">${CONTACT_INFO.phoneDisplay}</a>
            <span class="sep">•</span>
            <a href="https://t.me/${CONTACT_INFO.telegram}" target="_blank" rel="noopener">Telegram (${CONTACT_INFO.telegramDisplay})</a>
          </div>
        </div>
      </div>
    </div>

    <!-- LOWER SECTIONS: SPECIFICATIONS & RELATED PRODUCTS -->
    <div class="detail-extended-info">
      ${specsHtml}
      ${relatedHtml}
    </div>
  `;

  // Re-attach interactive zoom
  setupGalleryZoom();
}

/**
 * Handle gallery image index change
 * @param {number} index 
 */
function setGalleryActiveImage(index) {
  if (!activeDetailProduct) return;
  const images = (Array.isArray(activeDetailProduct.images) && activeDetailProduct.images.length > 0)
    ? activeDetailProduct.images
    : [generateProductPlaceholder(activeDetailProduct, 0)];

  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;

  currentGalleryImageIndex = index;
  const mainImg = document.getElementById("detail-main-image");
  if (mainImg) {
    mainImg.src = images[currentGalleryImageIndex];
    mainImg.style.transform = "scale(1)";
    mainImg.style.transformOrigin = "center center";
    mainImg.onerror = () => {
      mainImg.onerror = null;
      mainImg.src = generateProductPlaceholder(activeDetailProduct, currentGalleryImageIndex);
    };
  }

  // Update counter
  const counter = document.getElementById("gallery-counter");
  if (counter) {
    counter.textContent = `${currentGalleryImageIndex + 1} / ${images.length}`;
  }

  // Update thumbnail active styles
  const thumbBtns = document.querySelectorAll(".gallery-thumb-btn");
  thumbBtns.forEach((btn, idx) => {
    if (idx === currentGalleryImageIndex) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });

  // Re-bind zoom
  setupGalleryZoom();
}

/**
 * Step image gallery forward or backward
 * @param {number} delta 
 */
function stepGalleryImage(delta) {
  setGalleryActiveImage(currentGalleryImageIndex + delta);
}

/**
 * Select active color
 * @param {string} color 
 */
function selectDetailColor(color) {
  currentDetailSelectedColor = color;
  const label = document.getElementById("detail-selected-color-label");
  if (label) label.textContent = color;

  const buttons = document.querySelectorAll(".product-option-group .option-pill-group .option-pill-btn");
  buttons.forEach(btn => {
    if (btn.textContent.trim() === color) {
      btn.classList.add("is-selected");
    } else if (activeDetailProduct && (activeDetailProduct.colors || activeDetailProduct.color || []).includes(btn.textContent.trim())) {
      btn.classList.remove("is-selected");
    }
  });
}

/**
 * Select active size
 * @param {string} size 
 */
function selectDetailSize(size) {
  currentDetailSelectedSize = size;
  const label = document.getElementById("detail-selected-size-label");
  if (label) label.textContent = size;

  const buttons = document.querySelectorAll(".product-option-group .option-pill-group .option-pill-btn");
  buttons.forEach(btn => {
    if (btn.textContent.trim() === size) {
      btn.classList.add("is-selected");
    } else if (activeDetailProduct && (activeDetailProduct.sizes || []).includes(btn.textContent.trim())) {
      btn.classList.remove("is-selected");
    }
  });
}

/**
 * Increase or decrease quantity in detail view
 * @param {number} delta 
 */
function stepDetailQuantity(delta) {
  const newQty = currentDetailQuantity + delta;
  if (newQty >= 1) {
    currentDetailQuantity = newQty;
    const display = document.getElementById("detail-qty-display");
    if (display) display.textContent = currentDetailQuantity;

    // Update subtotal display
    if (activeDetailProduct) {
      const pricing = calculatePricing(activeDetailProduct.price, activeDetailProduct.discount);
      const subtotalDisplay = document.getElementById("detail-item-subtotal-display");
      if (subtotalDisplay) {
        subtotalDisplay.textContent = `Total: ${formatPrice(pricing.finalPrice * currentDetailQuantity)}`;
      }
    }
  }
}

/**
 * Validate selection before order: checks if size or color selection is required
 * @returns {boolean}
 */
function validateDetailSelections() {
  if (!activeDetailProduct) return false;

  // If product has sizes and none selected
  if (Array.isArray(activeDetailProduct.sizes) && activeDetailProduct.sizes.length > 0) {
    if (!currentDetailSelectedSize) {
      showToastNotification("Please select a size first.");
      return false;
    }
  }

  // If product has colors and none selected
  const colors = activeDetailProduct.colors || activeDetailProduct.color || [];
  if (Array.isArray(colors) && colors.length > 0) {
    if (!currentDetailSelectedColor) {
      showToastNotification("Please select a color first.");
      return false;
    }
  }

  return true;
}

/**
 * Add active detail product to persistent order list
 */
function triggerAddToOrderList() {
  if (!validateDetailSelections()) return;

  addItemToOrder({
    id: activeDetailProduct.id,
    name: activeDetailProduct.name,
    category: activeDetailProduct.category,
    price: activeDetailProduct.price,
    discount: activeDetailProduct.discount || 0,
    currency: activeDetailProduct.currency || STORE_CONFIG.currency,
    image: (activeDetailProduct.images && activeDetailProduct.images[0]) || "",
    color: currentDetailSelectedColor,
    size: currentDetailSelectedSize,
    quantity: currentDetailQuantity
  });

  showToastNotification(`Added "${activeDetailProduct.name}" to your order list.`);
}

/**
 * Direct Instant Order / Contact Seller for this single product
 */
function triggerDirectProductOrder() {
  if (!validateDetailSelections()) return;

  const pricing = calculatePricing(activeDetailProduct.price, activeDetailProduct.discount);
  const singleItem = {
    id: activeDetailProduct.id,
    name: activeDetailProduct.name,
    image: (activeDetailProduct.images && activeDetailProduct.images[0]) || "",
    color: currentDetailSelectedColor,
    size: currentDetailSelectedSize,
    quantity: currentDetailQuantity,
    price: pricing.finalPrice,
    currency: activeDetailProduct.currency || STORE_CONFIG.currency
  };

  openOrderDispatchModal([singleItem]);
}

// Ensure close button and backdrop click are bound immediately once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("product-detail-modal");
  const closeBtn = document.getElementById("product-detail-close") || document.getElementById("btn-close-product-detail");
  
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeProductDetailModal();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeProductDetailModal();
      }
    });
  }
});
