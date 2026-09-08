/**
 * =====================================================================
 * TESSÉ - Multi-Faceted Product Filtering & Sorting System
 * =====================================================================
 * Filters:
 * - Category
 * - Price Range (min / max)
 * - Availability (in-stock only)
 * - Discount (on-sale only)
 * - Color chips
 * - Size chips
 * - Brand filter
 * - Sorting: Featured, Newest, Price: Low to High, Price: High to Low, Name: A-Z
 * - Clear all filters
 */

const filterState = {
  category: "all",
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  discountOnly: false,
  selectedColors: [],
  selectedSizes: [],
  selectedBrand: "all",
  sort: "featured"
};

/**
 * Initialize dynamic filter controls from product data
 */
function initFilterControls() {
  populateCategoryFilters();
  populateColorFilterChips();
  populateSizeFilterChips();
  populateBrandFilters();
  bindFilterEventListeners();
}

/**
 * Bind event listeners for filter checkboxes, dropdowns, inputs, and clear buttons
 */
function bindFilterEventListeners() {
  // In-Stock checkbox
  const inStockCheck = document.getElementById("filter-in-stock-checkbox") || document.getElementById("filter-in-stock");
  if (inStockCheck) {
    inStockCheck.addEventListener("change", (e) => {
      toggleAvailabilityFilter(e.target.checked);
    });
  }

  // On-Sale checkbox
  const onSaleCheck = document.getElementById("filter-on-sale-checkbox") || document.getElementById("filter-on-sale");
  if (onSaleCheck) {
    onSaleCheck.addEventListener("change", (e) => {
      toggleDiscountFilter(e.target.checked);
    });
  }

  // Sort dropdown
  const sortDropdown = document.getElementById("catalog-sort-dropdown") || document.getElementById("catalog-sort-select");
  if (sortDropdown) {
    sortDropdown.addEventListener("change", (e) => {
      handleSortChange(e.target.value);
    });
  }

  // Brand dropdown if present
  const brandDropdown = document.getElementById("catalog-brand-filter");
  if (brandDropdown) {
    brandDropdown.addEventListener("change", (e) => {
      filterState.selectedBrand = e.target.value;
      applyAllFiltersAndRender();
    });
  }

  // Clear all filters buttons
  const clearBtn = document.getElementById("btn-clear-all-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      resetAllFilters();
    });
  }

  const emptyResetBtn = document.getElementById("btn-reset-filters-empty");
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener("click", () => {
      resetAllFilters();
    });
  }
}

/**
 * Render category filter navigation pills
 */
function populateCategoryFilters() {
  const container = document.getElementById("category-filter-pills");
  if (!container) return;

  let html = "";
  CATEGORIES.forEach(cat => {
    const isAll = cat.id === "all";
    const count = isAll 
      ? PRODUCTS.length 
      : PRODUCTS.filter(p => {
          const pCat = (p.category || "").toLowerCase();
          return pCat === cat.id.toLowerCase() || pCat === cat.name.toLowerCase();
        }).length;
    
    // Only show categories that have items or "all"
    if (count > 0 || isAll) {
      const isActive = filterState.category.toLowerCase() === cat.id.toLowerCase();
      html += `
        <button type="button" 
                class="category-pill-btn ${isActive ? 'is-active' : ''}" 
                data-category="${cat.id}"
                onclick="setCategoryFilter('${cat.id}')">
          <span>${cat.name}</span>
          <span class="pill-count">${count}</span>
        </button>
      `;
    }
  });

  container.innerHTML = html;
}

/**
 * Extract unique colors dynamically from PRODUCTS array
 */
function populateColorFilterChips() {
  const container = document.getElementById("filter-color-chips") || document.getElementById("color-filter-options");
  if (!container) return;

  const colorSet = new Set();
  PRODUCTS.forEach(p => {
    const colors = p.colors || p.color || [];
    if (Array.isArray(colors)) {
      colors.forEach(c => colorSet.add(c.trim()));
    }
  });

  let html = "";
  Array.from(colorSet).sort().forEach(color => {
    const isSelected = filterState.selectedColors.includes(color);
    html += `
      <button type="button" 
              class="filter-chip-btn ${isSelected ? 'is-selected' : ''}" 
              onclick="toggleColorFilter('${escapeHtml(color)}')">
        ${color}
      </button>
    `;
  });

  container.innerHTML = html || `<span class="filter-muted">No color variations</span>`;
}

/**
 * Extract unique sizes dynamically from PRODUCTS array
 */
function populateSizeFilterChips() {
  const container = document.getElementById("filter-size-chips") || document.getElementById("size-filter-options");
  if (!container) return;

  const sizeSet = new Set();
  PRODUCTS.forEach(p => {
    if (Array.isArray(p.sizes)) {
      p.sizes.forEach(s => sizeSet.add(s.trim()));
    }
  });

  let html = "";
  Array.from(sizeSet).forEach(size => {
    const isSelected = filterState.selectedSizes.includes(size);
    html += `
      <button type="button" 
              class="filter-chip-btn ${isSelected ? 'is-selected' : ''}" 
              onclick="toggleSizeFilter('${escapeHtml(size)}')">
        ${size}
      </button>
    `;
  });

  container.innerHTML = html || `<span class="filter-muted">No sizing applicable</span>`;
}

/**
 * Extract unique brands dynamically from PRODUCTS array
 */
function populateBrandFilters() {
  const container = document.getElementById("catalog-brand-filter");
  if (!container) return;

  const brandSet = new Set();
  PRODUCTS.forEach(p => {
    if (p.brand && p.brand.trim()) {
      brandSet.add(p.brand.trim());
    }
  });

  let html = `<option value="all">All Brands</option>`;
  Array.from(brandSet).sort().forEach(brand => {
    html += `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`;
  });

  container.innerHTML = html;
}

/**
 * Set active category and re-render
 * @param {string} catId 
 */
function setCategoryFilter(catId) {
  filterState.category = (catId || "all").toLowerCase();
  populateCategoryFilters();
  applyAllFiltersAndRender();
}

/**
 * Toggle color selection
 * @param {string} color 
 */
function toggleColorFilter(color) {
  const idx = filterState.selectedColors.indexOf(color);
  if (idx > -1) {
    filterState.selectedColors.splice(idx, 1);
  } else {
    filterState.selectedColors.push(color);
  }
  populateColorFilterChips();
  applyAllFiltersAndRender();
}

/**
 * Toggle size selection
 * @param {string} size 
 */
function toggleSizeFilter(size) {
  const idx = filterState.selectedSizes.indexOf(size);
  if (idx > -1) {
    filterState.selectedSizes.splice(idx, 1);
  } else {
    filterState.selectedSizes.push(size);
  }
  populateSizeFilterChips();
  applyAllFiltersAndRender();
}

/**
 * Toggle availability (in stock only)
 * @param {boolean} isChecked 
 */
function toggleAvailabilityFilter(isChecked) {
  filterState.inStockOnly = Boolean(isChecked);
  applyAllFiltersAndRender();
}

/**
 * Toggle discount (on-sale only)
 * @param {boolean} isChecked 
 */
function toggleDiscountFilter(isChecked) {
  filterState.discountOnly = Boolean(isChecked);
  applyAllFiltersAndRender();
}

/**
 * Change sort order
 * @param {string} sortVal 
 */
function handleSortChange(sortVal) {
  filterState.sort = sortVal || "featured";
  applyAllFiltersAndRender();
}

/**
 * Reset all filters to default state
 */
function resetAllFilters() {
  filterState.category = "all";
  filterState.minPrice = null;
  filterState.maxPrice = null;
  filterState.inStockOnly = false;
  filterState.discountOnly = false;
  filterState.selectedColors = [];
  filterState.selectedSizes = [];
  filterState.selectedBrand = "all";
  filterState.sort = "featured";

  // Reset inputs
  const inStockCheck = document.getElementById("filter-in-stock-checkbox") || document.getElementById("filter-in-stock");
  if (inStockCheck) inStockCheck.checked = false;

  const onSaleCheck = document.getElementById("filter-on-sale-checkbox") || document.getElementById("filter-on-sale");
  if (onSaleCheck) onSaleCheck.checked = false;

  const sortSelect = document.getElementById("catalog-sort-dropdown") || document.getElementById("catalog-sort-select");
  if (sortSelect) sortSelect.value = "featured";

  const brandSelect = document.getElementById("catalog-brand-filter");
  if (brandSelect) brandSelect.value = "all";

  // Clear search query
  if (typeof clearSearch === "function") {
    clearSearch();
  }

  populateCategoryFilters();
  populateColorFilterChips();
  populateSizeFilterChips();
  applyAllFiltersAndRender();
  showToastNotification("All filters reset.");
}

/**
 * Unified filter engine: Applies Category, Search, Stock, Discount, Brand, Colors, Sizes, and Sort
 */
function applyAllFiltersAndRender() {
  let list = [...PRODUCTS];

  // 1. Search Query Filter
  if (typeof currentSearchQuery === "string" && currentSearchQuery.trim()) {
    list = filterProductsBySearch(list, currentSearchQuery);
  }

  // 2. Category Filter
  if (filterState.category && filterState.category !== "all") {
    const targetCat = filterState.category.toLowerCase();
    list = list.filter(p => {
      const pCat = (p.category || "").toLowerCase();
      return pCat === targetCat;
    });
  }

  // 3. Price Filter (if inputs provided)
  if (filterState.minPrice !== null && !isNaN(filterState.minPrice)) {
    list = list.filter(p => {
      const pricing = calculatePricing(p.price, p.discount);
      return pricing.finalPrice >= filterState.minPrice;
    });
  }
  if (filterState.maxPrice !== null && !isNaN(filterState.maxPrice)) {
    list = list.filter(p => {
      const pricing = calculatePricing(p.price, p.discount);
      return pricing.finalPrice <= filterState.maxPrice;
    });
  }

  // 4. Availability Filter
  if (filterState.inStockOnly) {
    list = list.filter(p => {
      if (typeof p.quantity === "number") {
        return p.quantity > 0;
      }
      return (p.availability || "").toLowerCase() !== "out of stock";
    });
  }

  // 5. Discount Only Filter
  if (filterState.discountOnly) {
    list = list.filter(p => (p.discount || 0) > 0);
  }

  // 6. Brand Filter
  if (filterState.selectedBrand && filterState.selectedBrand !== "all") {
    list = list.filter(p => (p.brand || "").toLowerCase() === filterState.selectedBrand.toLowerCase());
  }

  // 7. Color Filter
  if (filterState.selectedColors.length > 0) {
    list = list.filter(p => {
      const colors = p.colors || p.color || [];
      if (!Array.isArray(colors)) return false;
      return filterState.selectedColors.some(c => colors.includes(c));
    });
  }

  // 8. Size Filter
  if (filterState.selectedSizes.length > 0) {
    list = list.filter(p => {
      if (!Array.isArray(p.sizes)) return false;
      return filterState.selectedSizes.some(s => p.sizes.includes(s));
    });
  }

  // 9. Sorting
  switch (filterState.sort) {
    case "price-asc":
    case "price-low":
      list.sort((a, b) => {
        const pA = calculatePricing(a.price, a.discount).finalPrice;
        const pB = calculatePricing(b.price, b.discount).finalPrice;
        return pA - pB;
      });
      break;

    case "price-desc":
    case "price-high":
      list.sort((a, b) => {
        const pA = calculatePricing(a.price, a.discount).finalPrice;
        const pB = calculatePricing(b.price, b.discount).finalPrice;
        return pB - pA;
      });
      break;

    case "name-asc":
    case "name-az":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "name-desc":
    case "name-za":
      list.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "newest":
      list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      break;

    case "featured":
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  // Render the filtered catalog grid
  if (typeof renderCatalogGrid === "function") {
    renderCatalogGrid(list);
  }

  // Update counter & active summary text
  updateActiveFilterPillsUI(list.length);
}

/**
 * Update UI summary indicator of active filters
 * @param {number} currentCount 
 */
function updateActiveFilterPillsUI(currentCount = PRODUCTS.length) {
  const summaryEl = document.getElementById("catalog-results-summary") || document.getElementById("catalog-results-count");
  if (summaryEl) {
    if (filterState.category !== "all") {
      const catObj = getCategoryById(filterState.category);
      const catName = catObj ? catObj.name : filterState.category;
      summaryEl.textContent = `Showing ${currentCount} product${currentCount === 1 ? '' : 's'} in ${catName}`;
    } else {
      summaryEl.textContent = `Showing all ${currentCount} product${currentCount === 1 ? '' : 's'}`;
    }
  }

  const emptyStateEl = document.getElementById("catalog-empty-state");
  const gridEl = document.getElementById("catalog-products-grid");

  if (currentCount === 0) {
    if (emptyStateEl) emptyStateEl.style.display = "block";
    if (gridEl) gridEl.style.display = "none";
  } else {
    if (emptyStateEl) emptyStateEl.style.display = "none";
    if (gridEl) gridEl.style.display = "grid";
  }
}
