/**
 * =====================================================================
 * TESSÉ - Client-Side Real-Time Product Search
 * =====================================================================
 * Searches across:
 * - Product Name
 * - Product Code (ID)
 * - Category
 * - Brand / Maker
 * - Description
 * - Features
 * - Colors
 * - Specifications (Keys and Values)
 */

let currentSearchQuery = "";
let searchDebounceTimer = null;

/**
 * Filter an array of products by matching all query terms
 * @param {Array} productList 
 * @param {string} query 
 * @returns {Array}
 */
function filterProductsBySearch(productList, query) {
  if (!query || !query.trim()) {
    return productList;
  }

  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return productList.filter(product => {
    // Collect all searchable strings for this product
    const searchableParts = [
      product.name || "",
      product.id || "",
      product.category || "",
      product.brand || "",
      product.description || ""
    ];

    const colors = product.colors || product.color || [];
    if (Array.isArray(colors)) {
      searchableParts.push(colors.join(" "));
    }

    if (Array.isArray(product.features)) {
      searchableParts.push(product.features.join(" "));
    }

    if (product.specifications && typeof product.specifications === "object") {
      for (const [key, val] of Object.entries(product.specifications)) {
        searchableParts.push(`${key} ${val}`);
      }
    }

    const fullSearchText = searchableParts.join(" ").toLowerCase();

    // Must match all entered terms
    return terms.every(term => fullSearchText.includes(term));
  });
}

/**
 * Handle live input in search boxes with debouncing
 * @param {string} rawVal 
 */
function handleSearchInput(rawVal) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentSearchQuery = (rawVal || "").trim();
    
    // Sync all search input elements on the page
    const searchInputs = document.querySelectorAll(".live-search-input, #header-search-input, #catalog-search-input");
    searchInputs.forEach(input => {
      if (input.value !== currentSearchQuery) {
        input.value = currentSearchQuery;
      }
    });

    // Update clear search buttons visibility
    const clearBtns = document.querySelectorAll(".search-clear-btn, #btn-clear-search");
    clearBtns.forEach(btn => {
      btn.style.display = currentSearchQuery.length > 0 ? "flex" : "none";
    });

    // If user is actively typing a search and catalog section is not in view, scroll gently
    const catalogSection = document.getElementById("catalog");
    if (currentSearchQuery.length > 0 && catalogSection) {
      const rect = catalogSection.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) {
        catalogSection.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Trigger full filter re-evaluation
    if (typeof applyAllFiltersAndRender === "function") {
      applyAllFiltersAndRender();
    }
  }, 120);
}

/**
 * Clear the current search input
 */
function clearSearch() {
  currentSearchQuery = "";
  const searchInputs = document.querySelectorAll(".live-search-input, #header-search-input, #catalog-search-input");
  searchInputs.forEach(input => {
    input.value = "";
  });

  const clearBtns = document.querySelectorAll(".search-clear-btn, #btn-clear-search");
  clearBtns.forEach(btn => {
    btn.style.display = "none";
  });

  if (typeof applyAllFiltersAndRender === "function") {
    applyAllFiltersAndRender();
  }
}

/**
 * Bind search input events on DOM load
 */
function initSearchEvents() {
  const inputs = document.querySelectorAll(".live-search-input, #header-search-input, #catalog-search-input");
  inputs.forEach(input => {
    input.addEventListener("input", (e) => {
      handleSearchInput(e.target.value);
    });

    // Pressing Enter scrolls to catalog immediately
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const catalogSection = document.getElementById("catalog");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  const clearBtns = document.querySelectorAll(".search-clear-btn, #btn-clear-search");
  clearBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      clearSearch();
    });
  });
}
