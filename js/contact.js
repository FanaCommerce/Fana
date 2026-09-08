/**
 * =====================================================================
 * TESSÉ - Contact & Physical Shop Information System
 * =====================================================================
 * Handles:
 * - Dynamic rendering of all contact channels (Phone, Telegram, Email, SMS)
 * - Physical boutique studio details, opening hours, and location placeholder
 * - General inquiry message handler
 */

/**
 * Initialize contact section and shop presentation
 */
function initContactSection() {
  renderContactChannels();
  renderPhysicalShopDetails();
  bindInquiryForm();
}
/**
 * Render contact communication channels dynamically from config
 */
function renderContactChannels() {
  const container = document.getElementById("contact-channels-grid");
  if (!container) return;

  container.innerHTML = `
    <a href="https://t.me/${CONTACT_INFO.telegram}" target="_blank" rel="noopener" class="contact-card-link">
      <div class="contact-card">
        <div class="contact-card-icon telegram-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </div>
        <div class="contact-card-info">
          <span class="contact-card-label">Telegram Channel & Chat</span>
          <strong class="contact-card-val">${CONTACT_INFO.telegramDisplay}</strong>
          <span class="contact-card-hint">Fastest response for order confirmation</span>
        </div>
      </div>
    </a>

    <a href="tel:${CONTACT_INFO.phone}" class="contact-card-link">
      <div class="contact-card">
        <div class="contact-card-icon phone-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="contact-card-info">
          <span class="contact-card-label">Direct Phone Call</span>
          <strong class="contact-card-val">${CONTACT_INFO.phoneDisplay}</strong>
          <span class="contact-card-hint">Direct telephone consultation</span>
        </div>
      </div>
    </a>

    <a href="mailto:${CONTACT_INFO.email}?subject=Order%20Inquiry%20-%20${STORE_CONFIG.storeName}" class="contact-card-link">
      <div class="contact-card">
        <div class="contact-card-icon email-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <div class="contact-card-info">
          <span class="contact-card-label">Email Atelier</span>
          <strong class="contact-card-val">${CONTACT_INFO.email}</strong>
          <span class="contact-card-hint">Inquiries, custom sizes, & bulk orders</span>
        </div>
      </div>
    </a>

    <a href="sms:${CONTACT_INFO.sms}" class="contact-card-link">
      <div class="contact-card">
        <div class="contact-card-icon sms-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="contact-card-info">
          <span class="contact-card-label">SMS Message</span>
          <strong class="contact-card-val">${CONTACT_INFO.phoneDisplay}</strong>
          <span class="contact-card-hint">Direct text order dispatch</span>
        </div>
      </div>
    </a>
  `;
}

/**
 * Render the current online-only studio status.
 */
function renderPhysicalShopDetails() {
  const container = document.getElementById("physical-shop-details") || document.getElementById("physical-shop-card");
  if (!container) return;

  container.innerHTML = `
    <div class="online-only-notice" role="status">
      <strong>Online studio for now</strong>
      <span>We currently serve customers through the contact channels above. A physical location will be announced here when available.</span>
    </div>
  `;
}

/**
 * Bind general message inquiry form
 */
function bindInquiryForm() {
  const form = document.getElementById("general-inquiry-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("inquiry-name");
    const messageInput = document.getElementById("inquiry-message");

    const name = nameInput ? nameInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !message) {
      showToastNotification("Please enter your name and message.");
      return;
    }

    const compiledInquiry = [
      `Hello ${STORE_CONFIG.storeName},`,
      "",
      `Name: ${name}`,
      `Message:`,
      message,
      "",
      `Sent via ${STORE_CONFIG.storeName} Web Portal`
    ].filter(Boolean).join("\n");

    // Reuse the dispatch channels without presenting the inquiry as an order.
    const inquiryItem = [{
      name: `Inquiry from ${name}`,
      id: "INQUIRY",
      price: 0,
      quantity: 1,
      currency: STORE_CONFIG.currency
    }];

    openOrderDispatchModal(inquiryItem);

    const modalContainer = document.querySelector("#order-action-modal .order-modal-container");
    if (modalContainer) modalContainer.classList.add("inquiry-mode");

    const modalBadge = document.querySelector("#order-action-modal .order-modal-badge span:last-child");
    const modalTitle = document.getElementById("order-modal-title");
    const modalDescription = document.querySelector("#order-action-modal .order-modal-desc");
    const copyButtonText = document.querySelector("#btn-copy-order-text span");

    if (modalBadge) modalBadge.textContent = "DIRECT INQUIRY";
    if (modalTitle) modalTitle.textContent = "Send Your Inquiry";
    if (modalDescription) {
      modalDescription.textContent = "Your message is ready. Choose a direct channel to contact the studio.";
    }
    if (copyButtonText) copyButtonText.textContent = "Copy Inquiry Message";

    const msgDisplay = document.getElementById("order-message-preview");
    if (msgDisplay) {
      msgDisplay.value = compiledInquiry;
      bindDispatchButtons(compiledInquiry);
    }

    form.reset();
    showToastNotification("Inquiry ready. Select how you'd like to send it.");
  });
}
