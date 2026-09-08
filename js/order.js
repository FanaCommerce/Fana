/**
 * =====================================================================
 * TESSÉ - Order List Management & Seller Contact Dispatch System
 * =====================================================================
 * Handles:
 * - Persistent order list in browser localStorage (no database needed)
 * - Slide-out order list drawer with item management (qty stepper, remove, clear)
 * - Dynamic ETB subtotal and piece counter calculations
 * - Auto-formatting order inquiry messages for Telegram, Phone, Email, & SMS
 * - Compact & descriptive Order Dispatch / Checkout Modal with item breakdown
 * - Dynamic message personalization (Name & Delivery location)
 * - One-click clipboard copying with toast confirmation
 */

const ORDER_STORAGE_KEY = "tesse_order_list_v1";
let currentDispatchItems = [];

/**
 * Retrieve current order items array from localStorage
 * @returns {Array}
 */
function getOrderList() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read order list from localStorage:", err);
    return [];
  }
}

/**
 * Persist order items array into localStorage and update UI
 * @param {Array} list 
 */
function saveOrderList(list) {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Could not save order list to localStorage:", err);
  }
  updateOrderDrawerUI();
}

/**
 * Add an item to the order list.
 * Matches existing item by ID + Color + Size to increment quantity.
 * @param {object} item 
 */
function addItemToOrder(item) {
  const list = getOrderList();
  const existingIdx = list.findIndex(i => 
    i.id === item.id &&
    (i.color || "") === (item.color || "") &&
    (i.size || "") === (item.size || "")
  );

  if (existingIdx > -1) {
    list[existingIdx].quantity = (list[existingIdx].quantity || 1) + (item.quantity || 1);
  } else {
    list.push({
      id: item.id,
      name: item.name,
      category: item.category || "general",
      price: item.price,
      discount: item.discount || 0,
      currency: item.currency || STORE_CONFIG.currency,
      image: item.image || "",
      color: item.color || null,
      size: item.size || null,
      quantity: item.quantity || 1
    });
  }

  saveOrderList(list);

  // Close product detail modal if open so the drawer takes primary focus smoothly
  if (typeof closeProductDetailModal === "function") {
    closeProductDetailModal();
  }

  // Open order drawer and focus list
  openOrderDrawer();
}

/**
 * Update quantity of an existing item in order list
 * @param {number} index 
 * @param {number} newQty 
 */
function updateItemQuantity(index, newQty) {
  const list = getOrderList();
  if (index >= 0 && index < list.length) {
    if (newQty <= 0) {
      list.splice(index, 1);
      showToastNotification("Item removed from your order list.");
    } else {
      list[index].quantity = newQty;
    }
    saveOrderList(list);
  }
}

/**
 * Remove an item completely from the order list
 * @param {number} index 
 */
function removeItemFromOrder(index) {
  const list = getOrderList();
  if (index >= 0 && index < list.length) {
    const removedName = list[index].name;
    list.splice(index, 1);
    saveOrderList(list);
    showToastNotification(`Removed "${removedName}" from order.`);
  }
}

/**
 * Clear all items in the order list
 */
function clearOrderList() {
  const list = getOrderList();
  if (list.length === 0) return;

  if (confirm("Are you sure you want to clear your order list?")) {
    saveOrderList([]);
    showToastNotification("Order list cleared.");
  }
}

/**
 * Calculate total price of order list in ETB
 * @returns {number}
 */
function getOrderTotal() {
  const list = getOrderList();
  return list.reduce((sum, item) => {
    const pricing = calculatePricing(item.price, item.discount);
    return sum + (pricing.finalPrice * (item.quantity || 1));
  }, 0);
}

/**
 * Calculate total number of pieces in order
 * @returns {number}
 */
function getOrderCount() {
  const list = getOrderList();
  return list.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

/**
 * Re-render Order Drawer UI and update header badge counts across all views
 */
function updateOrderDrawerUI() {
  const list = getOrderList();
  const totalCount = getOrderCount();
  const grandTotal = getOrderTotal();

  // 1. Synchronize all badge elements across header, mobile menu, and floating buttons
  const badgeEls = document.querySelectorAll(
    "#header-order-count, .order-badge-count, .cart-count-badge, #order-count-badge, #drawer-order-count, #mobile-order-count, #floating-order-count, .header-order-count"
  );

  badgeEls.forEach(badge => {
    badge.textContent = totalCount;
    if (badge.id === "drawer-order-count" || badge.id === "order-drawer-count") {
      badge.textContent = totalCount;
    } else {
      if (totalCount > 0) {
        badge.classList.add("has-items");
        badge.classList.remove("is-empty");
        // Pop animation reflow trigger
        badge.classList.remove("badge-bump");
        void badge.offsetWidth;
        badge.classList.add("badge-bump");
      } else {
        badge.classList.remove("has-items");
        badge.classList.add("is-empty");
      }
    }
  });

  // 2. Synchronize Header Bag Button Active state
  const headerBagBtn = document.getElementById("btn-open-bag") || document.querySelector(".header-bag-btn");
  if (headerBagBtn) {
    if (totalCount > 0) {
      headerBagBtn.classList.add("has-items");
    } else {
      headerBagBtn.classList.remove("has-items");
    }
  }

  // 3. Synchronize Floating Order Pill
  const floatingBtn = document.getElementById("floating-order-btn");
  if (floatingBtn) {
    if (totalCount > 0) {
      floatingBtn.classList.add("is-visible");
    } else {
      floatingBtn.classList.remove("is-visible");
    }
  }

  // 4. Update Drawer Title Count
  const drawerCountEl = document.getElementById("drawer-order-count") || document.getElementById("order-drawer-count");
  if (drawerCountEl) {
    drawerCountEl.textContent = totalCount;
  }

  // 5. Update Estimated Total in Drawer
  const subtotalEl = document.getElementById("order-drawer-total-price") || document.getElementById("order-drawer-subtotal");
  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(grandTotal);
  }

  // 6. Populate Items List or Empty State
  const itemsContainer = document.getElementById("order-drawer-items-list") || document.getElementById("order-drawer-items");
  const footerEl = document.querySelector(".order-drawer-footer") || document.getElementById("order-drawer-footer");

  if (!itemsContainer) return;

  if (list.length === 0) {
    if (footerEl) footerEl.style.display = "none";
    itemsContainer.innerHTML = `
      <div class="order-drawer-empty">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <h4>Your Order List is Empty</h4>
        <p>Explore our bespoke collection and tap &ldquo;Order&rdquo; or &ldquo;Add to Order List&rdquo; on items you wish to purchase.</p>
        <button type="button" class="btn-primary" style="margin-top: 18px; padding: 10px 22px; width: auto; display: inline-flex;" onclick="closeOrderDrawer(); const c = document.getElementById('catalog'); if(c) c.scrollIntoView({behavior:'smooth'});">
          Browse Collection
        </button>
      </div>
    `;
    return;
  }

  if (footerEl) footerEl.style.display = "block";

  // Render items in drawer
  let itemsHtml = "";
  list.forEach((item, idx) => {
    const pricing = calculatePricing(item.price, item.discount);
    const lineTotal = pricing.finalPrice * item.quantity;
    const placeholder = generateProductPlaceholder(item, 0);

    const variantNotes = [];
    if (item.size) variantNotes.push(`Size: ${item.size}`);
    if (item.color) variantNotes.push(`Color: ${item.color}`);
    const variantStr = variantNotes.join("  •  ");

    itemsHtml += `
      <div class="order-item-row">
        <div class="order-item-thumb">
          <img src="${item.image || placeholder}" 
               alt="${escapeHtml(item.name)}" 
               onerror="handleProductImgError(this, '${item.id}', 0)">
        </div>
        <div class="order-item-content">
          <div class="order-item-header">
            <h4 class="order-item-title">${escapeHtml(item.name)}</h4>
            <button type="button" 
                    class="btn-order-remove" 
                    onclick="removeItemFromOrder(${idx})" 
                    aria-label="Remove item"
                    title="Remove item">
              &times;
            </button>
          </div>
          <div class="order-item-meta">
            <span class="order-item-code">${escapeHtml(item.id)}</span>
            ${variantStr ? `<span class="order-item-variant">${escapeHtml(variantStr)}</span>` : ""}
          </div>
          <div class="order-item-bottom">
            <div class="order-item-stepper">
              <button type="button" onclick="updateItemQuantity(${idx}, ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="updateItemQuantity(${idx}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
            </div>
            <div class="order-item-price-block">
              <span class="order-item-unit-price">${formatPrice(pricing.finalPrice)}</span>
              <strong class="order-item-line-total">${formatPrice(lineTotal)}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  itemsContainer.innerHTML = itemsHtml;
}

/**
 * Open the Slide-Out Order List Drawer
 */
function openOrderDrawer() {
  updateOrderDrawerUI();
  const drawer = document.getElementById("order-drawer");
  const overlay = document.getElementById("order-drawer-overlay");

  if (drawer) drawer.classList.add("is-open");
  if (overlay) overlay.classList.add("is-open");
  document.body.classList.add("drawer-open");
}

/**
 * Close the Slide-Out Order List Drawer
 */
function closeOrderDrawer() {
  const drawer = document.getElementById("order-drawer");
  const overlay = document.getElementById("order-drawer-overlay");

  if (drawer) drawer.classList.remove("is-open");
  if (overlay) overlay.classList.remove("is-open");
  document.body.classList.remove("drawer-open");
}

/**
 * Formats a clean, readable text message for seller dispatch.
 * Strictly adheres to format required by prompt.
 * @param {Array} items 
 * @param {string} [customerName]
 * @param {string} [customerLocation]
 * @returns {string}
 */
function generateOrderMessage(items, customerName = "", customerLocation = "") {
  if (!items || items.length === 0) return "";

  const nameTrimmed = (customerName || "").trim();
  const locTrimmed = (customerLocation || "").trim();

  // Single Item Format
  if (items.length === 1) {
    const it = items[0];
    const unitPrice = it.price || it.finalPrice;
    const qty = it.quantity || 1;
    const lineTotal = unitPrice * qty;

    const lines = [
      `Hello, I would like to order the following from ${STORE_CONFIG.storeName}:`,
      "",
      `Product: ${it.name}`,
      `Product Code: ${it.id}`
    ];
    if (it.size) lines.push(`Size: ${it.size}`);
    if (it.color) lines.push(`Color: ${it.color}`);
    lines.push(`Quantity: ${qty}`);
    lines.push(`Total Price: ${formatPrice(lineTotal)}`);
    
    if (nameTrimmed) {
      lines.push(`Customer: ${nameTrimmed}`);
    }
    if (locTrimmed) {
      lines.push(`Delivery / Pickup Preference: ${locTrimmed}`);
    }

    lines.push("");
    lines.push("Please let me know how to proceed with payment and delivery.");
    lines.push("Thank you.");
    return lines.join("\n");
  }

  // Multi-Item Format
  let grandTotal = 0;
  let totalPieces = 0;

  const itemBlocks = items.map((it, idx) => {
    const qty = it.quantity || 1;
    const unitPrice = it.price || it.finalPrice;
    const lineTotal = unitPrice * qty;
    grandTotal += lineTotal;
    totalPieces += qty;

    const optParts = [];
    if (it.size) optParts.push(`Size: ${it.size}`);
    if (it.color) optParts.push(`Color: ${it.color}`);
    const optStr = optParts.length > 0 ? `   ${optParts.join(" | ")}\n` : "";

    return `${idx + 1}. ${it.name} (Code: ${it.id})\n${optStr}   Qty: ${qty}  •  Price: ${formatPrice(lineTotal)}`;
  });

  const headerLines = [
    `Hello, I would like to order the following items from ${STORE_CONFIG.storeName}:`,
    ""
  ];

  if (nameTrimmed) {
    headerLines.push(`Customer Name: ${nameTrimmed}`);
  }
  if (locTrimmed) {
    headerLines.push(`Preferred Pickup / Delivery: ${locTrimmed}`);
  }
  if (nameTrimmed || locTrimmed) {
    headerLines.push("");
  }

  return [
    ...headerLines,
    ...itemBlocks,
    "",
    "--------------------------------",
    `Total Items: ${totalPieces} piece(s)`,
    `Estimated Order Total: ${formatPrice(grandTotal)}`,
    "--------------------------------",
    "",
    "Please confirm item availability and arrange delivery/pickup details.",
    "Thank you!"
  ].join("\n");
}

/**
 * Open the Order Dispatch Modal showing item breakdown and channel triggers
 * @param {Array} [customItems] 
 */
function openOrderDispatchModal(customItems) {
  const items = customItems || getOrderList();
  if (!items || items.length === 0) {
    showToastNotification("Your order list is empty.");
    return;
  }

  currentDispatchItems = items;

  const modalContainer = document.querySelector("#order-action-modal .order-modal-container");
  if (modalContainer) modalContainer.classList.remove("inquiry-mode");

  const modalBadge = document.querySelector("#order-action-modal .order-modal-badge span:last-child");
  const modalTitle = document.getElementById("order-modal-title");
  const modalDescription = document.querySelector("#order-action-modal .order-modal-desc");
  const copyButtonText = document.querySelector("#btn-copy-order-text span");
  if (modalBadge) modalBadge.textContent = "DIRECT ARTISAN CHECKOUT";
  if (modalTitle) modalTitle.textContent = "Complete Your Order Inquiry";
  if (modalDescription) {
    modalDescription.textContent = "No online card required. Review your items below and connect directly with our Addis Ababa studio to confirm availability and arrangement.";
  }
  if (copyButtonText) copyButtonText.textContent = "Copy Full Order Text to Clipboard";

  // Close drawer if open
  closeOrderDrawer();

  // Render modal item breakdown
  renderDispatchModalItems(items);

  // Setup input listeners for dynamic personalization
  const nameInput = document.getElementById("order-customer-name");
  const locInput = document.getElementById("order-customer-location");

  const handleInputChange = () => {
    refreshDispatchMessage();
  };

  if (nameInput) {
    nameInput.removeEventListener("input", handleInputChange);
    nameInput.addEventListener("input", handleInputChange);
  }
  if (locInput) {
    locInput.removeEventListener("input", handleInputChange);
    locInput.addEventListener("input", handleInputChange);
  }

  refreshDispatchMessage();

  const modal = document.getElementById("order-dispatch-modal") || document.getElementById("order-action-modal");
  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
}

/**
 * Render items in checkout/dispatch modal
 * @param {Array} items 
 */
function renderDispatchModalItems(items) {
  const container = document.getElementById("order-modal-items-list");
  const countEl = document.getElementById("order-modal-items-count");
  const totalEl = document.getElementById("order-modal-total-display");

  let total = 0;
  let count = 0;

  if (container) {
    container.innerHTML = items.map(it => {
      const unitPrice = it.price || it.finalPrice;
      const qty = it.quantity || 1;
      const lineTotal = unitPrice * qty;
      total += lineTotal;
      count += qty;

      const placeholder = generateProductPlaceholder(it, 0);
      const variantBadges = [];
      if (it.size) variantBadges.push(`<span class="summary-pill">Size: ${escapeHtml(it.size)}</span>`);
      if (it.color) variantBadges.push(`<span class="summary-pill">Color: ${escapeHtml(it.color)}</span>`);

      return `
        <div class="order-summary-row">
          <div class="summary-thumb">
            <img src="${it.image || placeholder}" alt="${escapeHtml(it.name)}" onerror="handleProductImgError(this, '${it.id}', 0)">
          </div>
          <div class="summary-info">
            <div class="summary-row-top">
              <strong class="summary-name">${escapeHtml(it.name)}</strong>
              <span class="summary-line-price">${formatPrice(lineTotal)}</span>
            </div>
            <div class="summary-meta-line">
              <span class="summary-code">CODE: ${escapeHtml(it.id)}</span>
              <span class="summary-qty">Qty: ${qty}</span>
              ${variantBadges.join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
  } else {
    items.forEach(it => {
      const unitPrice = it.price || it.finalPrice;
      const qty = it.quantity || 1;
      total += unitPrice * qty;
      count += qty;
    });
  }

  if (countEl) {
    countEl.textContent = `${count} item${count === 1 ? '' : 's'}`;
  }
  if (totalEl) {
    totalEl.textContent = formatPrice(total);
  }
}

/**
 * Refresh compiled order message and channel buttons
 */
function refreshDispatchMessage() {
  const nameInput = document.getElementById("order-customer-name");
  const locInput = document.getElementById("order-customer-location");
  const custName = nameInput ? nameInput.value : "";
  const custLoc = locInput ? locInput.value : "";

  const formattedMsg = generateOrderMessage(currentDispatchItems, custName, custLoc);

  const msgDisplay = document.getElementById("dispatch-message-preview") || document.getElementById("order-message-preview");
  if (msgDisplay) {
    msgDisplay.value = formattedMsg;
  }

  bindDispatchButtons(formattedMsg);
}

/**
 * Close the Order Dispatch Modal
 */
function closeOrderDispatchModal() {
  const modal = document.getElementById("order-dispatch-modal") || document.getElementById("order-action-modal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
}

/**
 * Bind action buttons inside dispatch modal
 * @param {string} rawMsg 
 */
function bindDispatchButtons(rawMsg) {
  const encoded = encodeURIComponent(rawMsg);

  // Telegram
  const tgBtn = document.getElementById("btn-dispatch-telegram");
  if (tgBtn) {
    tgBtn.onclick = () => {
      window.open(`https://t.me/${CONTACT_INFO.telegram}?text=${encoded}`, "_blank");
    };
  }

  // Phone Call
  const phoneBtn = document.getElementById("btn-dispatch-phone");
  if (phoneBtn) {
    phoneBtn.onclick = () => {
      window.location.href = `tel:${CONTACT_INFO.phone}`;
    };
  }

  // Email
  const emailBtn = document.getElementById("btn-dispatch-email");
  if (emailBtn) {
    emailBtn.onclick = () => {
      const subject = encodeURIComponent(`Order Inquiry - ${STORE_CONFIG.storeName}`);
      window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${encoded}`;
    };
  }

  // SMS
  const smsBtn = document.getElementById("btn-dispatch-sms");
  if (smsBtn) {
    smsBtn.onclick = () => {
      window.location.href = `sms:${CONTACT_INFO.sms}?body=${encoded}`;
    };
  }

  // Copy to Clipboard
  const copyBtn = document.getElementById("btn-dispatch-copy") || document.getElementById("btn-copy-order-text");
  if (copyBtn) {
    copyBtn.onclick = () => {
      copyOrderMessageToClipboard(rawMsg);
    };
  }
}

/**
 * Copy order message text directly to clipboard
 * @param {string} text 
 */
function copyOrderMessageToClipboard(text) {
  const copyBtn = document.getElementById("btn-dispatch-copy") || document.getElementById("btn-copy-order-text");

  const showSuccess = () => {
    showToastNotification("Order message copied to clipboard!");
    if (copyBtn) {
      const origHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Copied to Clipboard!</span>
      `;
      copyBtn.classList.add("btn-copied-success");
      setTimeout(() => {
        copyBtn.innerHTML = origHtml;
        copyBtn.classList.remove("btn-copied-success");
      }, 2500);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showSuccess).catch(() => {
      fallbackCopyToClipboard(text, showSuccess);
    });
  } else {
    fallbackCopyToClipboard(text, showSuccess);
  }
}

/**
 * Fallback clipboard copy using textarea selection
 * @param {string} text 
 * @param {Function} successCb
 */
function fallbackCopyToClipboard(text, successCb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
    if (successCb) successCb();
    else showToastNotification("Order message copied to clipboard!");
  } catch (err) {
    showToastNotification("Please select and copy the text manually.");
  }
  document.body.removeChild(ta);
}

/**
 * Global Toast Notification banner system
 * Replaces browser alerts with elegant non-intrusive toast notices.
 * @param {string} message 
 * @param {number} [duration=3200]
 */
function showToastNotification(message, duration = 3200) {
  let toastContainer = document.getElementById("global-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "global-toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast-pill";
  toast.innerHTML = `
    <span class="toast-dot"></span>
    <span class="toast-text">${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 280);
  }, duration);
}
