/**
 * NUEL Fashion : Application JavaScript
 * =====================================================================
 * Architecture: Modular ES5-compatible vanilla JS (no build step required)
 * Sections:
 *   1.  Configuration & Constants
 *   2.  State Management
 *   3.  Currency Engine
 *   4.  Volume Pricing Engine
 *   5.  Product Data
 *   6.  Product Rendering
 *   7.  Cart System
 *   8.  Wishlist System
 *   9.  Navigation
 *   10. Search System
 *   11. Filter System
 *   12. Modals & Drawers
 *   13. FAQ Accordion
 *   14. Theme Toggle
 *   15. Toast Notifications
 *   16. Checkout Flow (Paystack Hook)
 *   17. Supabase Auth Hooks
 *   18. Community Content
 *   19. Utility Functions
 *   20. Initialisation
 * =====================================================================
 */

/* =====================================================================
   1. CONFIGURATION & CONSTANTS
   ===================================================================== */

const CONFIG = {
  // Exchange rate (USD to NGN) : in production, fetch from a live API
  USD_TO_NGN: 1600,

  // Volume pricing tiers
  VOLUME_TIERS: [
    { minQty: 1,  maxQty: 1,        discount: 0,    label: 'Full price' },
    { minQty: 2,  maxQty: 3,        discount: 0.10, label: '10% off' },
    { minQty: 4,  maxQty: Infinity, discount: 0.20, label: '20% off' },
  ],

  // Supabase configuration : replace with real credentials before deployment
  SUPABASE: {
    url:    'https://qkfhiqmcczkxycshcodo.supabase.co',
    anonKey: 'sb_publishable_8UxWlPs1uPAkdomCCuu8KQ_692RCEFo',
  },

  // Paystack configuration : replace with real public key
  PAYSTACK: {
    publicKey: 'YOUR_PAYSTACK_PUBLIC_KEY',
    currency:  'NGN',
  },

  // Default currency
  DEFAULT_CURRENCY: 'NGN',
};

/* =====================================================================
   2. STATE MANAGEMENT
   ===================================================================== */

const State = {
  currency: CONFIG.DEFAULT_CURRENCY,   // 'NGN' | 'USD'
  theme:    'light',                    // 'light' | 'dark'
  cart:     [],                         // Array of cart items
  wishlist: [],                         // Array of wishlist product IDs
  user:     null,                       // Supabase user object (null = logged out)

  // Filter states
  menFilters:   { categories: ['tee','hoodie','co-ord','accessory'], size: 'all', maxPrice: 80000, colour: 'all' },
  womenFilters: { categories: ['dress','tee','co-ord','accessory','gift'], size: 'all', maxPrice: 80000, colour: 'all' },
};

/* =====================================================================
   3. CURRENCY ENGINE
   ===================================================================== */

const Currency = {
  /**
   * Format a price value to the active currency string.
   * @param {number} ngn : Price in Naira (source of truth)
   * @returns {string} formatted price string
   */
  format(ngn) {
    if (State.currency === 'USD') {
      const usd = ngn / CONFIG.USD_TO_NGN;
      return '$' + usd.toFixed(2);
    }
    return '₦' + ngn.toLocaleString('en-NG');
  },

  /**
   * Toggle active currency and re-render all price displays.
   */
  toggle() {
    State.currency = (State.currency === 'NGN') ? 'USD' : 'NGN';
    document.getElementById('currencyLabel').textContent = State.currency;
    Currency.refreshAll();
  },

  /**
   * Refresh all price elements on the page after a currency switch.
   */
  refreshAll() {
    // Re-render product grids
    Products.renderFeatured();
    Products.renderMen();
    Products.renderWomen();

    // Re-render cart
    Cart.render();

    // Update gift price display
    const giftDisplay = document.getElementById('giftPriceDisplay');
    if (giftDisplay) {
      giftDisplay.innerHTML = 'From <strong>' + Currency.format(28000) + '</strong>';
    }
  },
};

/* =====================================================================
   4. VOLUME PRICING ENGINE
   ===================================================================== */

const VolumePricing = {
  /**
   * Calculate the applicable discount for a given total item quantity.
   * @param {number} totalQty : Total units across all cart items
   * @returns {{ discount: number, label: string }}
   */
  getDiscount(totalQty) {
    for (let i = CONFIG.VOLUME_TIERS.length - 1; i >= 0; i--) {
      const tier = CONFIG.VOLUME_TIERS[i];
      if (totalQty >= tier.minQty) return tier;
    }
    return CONFIG.VOLUME_TIERS[0];
  },

  /**
   * Apply volume discount to a unit price.
   * @param {number} price : Original price in NGN
   * @param {number} totalQty : Total cart quantity
   * @returns {number} discounted price
   */
  applyToPrice(price, totalQty) {
    const tier = VolumePricing.getDiscount(totalQty);
    return price * (1 - tier.discount);
  },

  /**
   * Get human-readable discount label for a quantity.
   * @param {number} totalQty
   * @returns {string}
   */
  getLabel(totalQty) {
    const tier = VolumePricing.getDiscount(totalQty);
    return tier.discount > 0
      ? 'Volume discount: ' + Math.round(tier.discount * 100) + '% off each item'
      : 'Add 2+ items for 10% off each';
  },
};

/* =====================================================================
   5. PRODUCT DATA
   ===================================================================== */

const PRODUCTS = [
  // --- Men's Products ---
  {
    id: 'tee-001',
    name: 'Rooted in Love Oversized Tee',
    category: 'tee',
    gender: 'men',
    price: 15000,
    desc: 'Premium 100% pre-shrunk cotton. Scripture-forward print. Intentionally relaxed fit : gender-neutral sizing.',
    sizes: ['XS','S','M','L','XL','XXL'],
    colours: ['deep-heaven','covenant'],
    badge: 'new',
    featured: true,
  },
  {
    id: 'tee-002',
    name: 'Stewardship Is Worship Tee',
    category: 'tee',
    gender: 'men',
    price: 15000,
    desc: 'A daily reminder that your work is worship. Premium cotton, oversized fit, NUEL Covenant Blue colourway.',
    sizes: ['S','M','L','XL','XXL'],
    colours: ['holiness','covenant'],
    badge: null,
    featured: true,
  },
  {
    id: 'hoodie-001',
    name: 'Kingdom Heavyweight Hoodie',
    category: 'hoodie',
    gender: 'men',
    price: 35000,
    desc: '80% cotton, 20% polyester with fleece lining. NUEL branding on chest, kingdom phrase on back. Unisex oversized.',
    sizes: ['XS','S','M','L','XL','XXL'],
    colours: ['deep-heaven','covenant','holiness'],
    badge: 'new',
    featured: true,
  },
  {
    id: 'coord-001',
    name: 'Covenant Co-ord Set',
    category: 'co-ord',
    gender: 'men',
    price: 55000,
    desc: 'Matching hoodie and jogger set in the NUEL blue palette. Coordinated branding throughout. 10% savings vs separate.',
    sizes: ['S','M','L','XL'],
    colours: ['deep-heaven','covenant'],
    badge: null,
    featured: false,
  },
  {
    id: 'cap-001',
    name: 'NUEL Monogram Cap',
    category: 'accessory',
    gender: 'men',
    price: 12000,
    desc: 'NUEL monogram embroidered in Covenant Blue. Cotton twill construction. Adjustable back.',
    sizes: ['one-size'],
    colours: ['deep-heaven','covenant'],
    badge: null,
    featured: false,
  },
  {
    id: 'sock-001',
    name: 'Branded Crew Socks',
    category: 'accessory',
    gender: 'men',
    price: 4000,
    desc: '80% cotton, 15% polyester, 5% spandex. NUEL mark and Covenant blue stripes. Sold as a pair.',
    sizes: ['one-size'],
    colours: ['covenant'],
    badge: null,
    featured: false,
  },

  // --- Women's Products ---
  {
    id: 'dress-001',
    name: 'Covenant A-Line Dress',
    category: 'dress',
    gender: 'women',
    price: 30000,
    desc: 'A-line cut in 100% linen. Subtle scripture detail at cuff. Midi length. Available in Covenant and Deep Heaven.',
    sizes: ['XS','S','M','L','XL'],
    colours: ['covenant','deep-heaven'],
    badge: 'new',
    featured: true,
  },
  {
    id: 'dress-002',
    name: 'Grace Light Shift Dress',
    category: 'dress',
    gender: 'women',
    price: 30000,
    desc: 'Relaxed shift silhouette in linen-cotton blend. Grace Light colourway. Knee length with discreet NUEL branding.',
    sizes: ['XS','S','M','L'],
    colours: ['grace-light','holiness'],
    badge: null,
    featured: true,
  },
  {
    id: 'tee-womens-001',
    name: 'Generous Giver Tee',
    category: 'tee',
    gender: 'women',
    price: 15000,
    desc: 'Premium oversized cotton tee with the Generous Giver scripture print. Intentionally relaxed, gender-neutral.',
    sizes: ['XS','S','M','L','XL'],
    colours: ['holiness','grace-light'],
    badge: null,
    featured: false,
  },
  {
    id: 'coord-womens-001',
    name: 'Heavenly Mist Co-ord Set',
    category: 'co-ord',
    gender: 'women',
    price: 55000,
    desc: 'Hoodie and jogger set in the softest NUEL blue. Designed for the woman who moves with purpose.',
    sizes: ['XS','S','M','L'],
    colours: ['holiness','grace-light'],
    badge: null,
    featured: false,
  },
  {
    id: 'gift-001',
    name: 'Kingdom Starter Pack',
    category: 'gift',
    gender: 'women',
    price: 28000,
    desc: 'Tee, tote bag, and wristband set. Gift-wrapped in branded box with a personalised card. Faith milestone ready.',
    sizes: ['one-size'],
    colours: ['covenant'],
    badge: 'limited',
    featured: true,
  },
  {
    id: 'gift-002',
    name: 'Grad Gift Set',
    category: 'gift',
    gender: 'women',
    price: 60000,
    desc: 'Hoodie, NUEL devotional journal, and 9-piece wristband set. Branded box, personalised card. For kingdom graduates.',
    sizes: ['S','M','L'],
    colours: ['deep-heaven'],
    badge: null,
    featured: true,
  },
  {
    id: 'tote-001',
    name: 'Scripture Tote Bag',
    category: 'accessory',
    gender: 'women',
    price: 10000,
    desc: '12oz organic cotton canvas. NUEL monogram with scripture print. Long handles, reinforced stitching. 35x40cm.',
    sizes: ['one-size'],
    colours: ['covenant','deep-heaven'],
    badge: null,
    featured: false,
  },
  {
    id: 'wristband-001',
    name: 'Fruit of the Spirit Wristband Set',
    category: 'accessory',
    gender: 'women',
    price: 35000,
    desc: '9-piece set : one for each fruit of the Spirit. Silicone and fabric options. Individual bands also available.',
    sizes: ['one-size'],
    colours: ['covenant'],
    badge: null,
    featured: false,
  },
];

/* =====================================================================
   6. PRODUCT RENDERING
   ===================================================================== */

const Products = {
  /**
   * Generate a product card HTML string.
   * @param {object} product : Product data object
   * @returns {string} HTML string
   */
  cardHTML(product) {
    const price = Currency.format(product.price);
    const tier2Price = Currency.format(product.price * 0.9);
    const tier3Price = Currency.format(product.price * 0.8);

    const colourDots = product.colours.map(c => {
      const colourMap = {
        'deep-heaven': '#042C53',
        'covenant':    '#185FA5',
        'holiness':    '#378ADD',
        'grace-light': '#B5D4F4',
        'heavenly-mist': '#E6F1FB',
      };
      return '<div class="color-dot" style="background:' + (colourMap[c] || '#ccc') + ';" title="' + c + '"></div>';
    }).join('');

    const sizesHTML = product.sizes.slice(0, 4).map(s =>
      '<button class="size-option" data-size="' + s + '">' + s + '</button>'
    ).join('');

    const badgeHTML = product.badge
      ? '<div class="product-card-badges"><span class="product-badge ' + product.badge + '">' + product.badge + '</span></div>'
      : '';

    const isWishlisted = State.wishlist.includes(product.id);

    return `
      <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-gender="${product.gender}">
        <div class="product-card-image">
          ${badgeHTML}
          <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M40 30 L60 20 L80 30 L88 55 L72 55 L72 130 L48 130 L48 55 L32 55 Z" fill="var(--blue-covenant)" opacity="0.55"/>
            <path d="M32 55 L14 68 L20 86 L42 74 L42 55Z" fill="var(--blue-holiness)" opacity="0.45"/>
            <path d="M88 55 L106 68 L100 86 L78 74 L78 55Z" fill="var(--blue-holiness)" opacity="0.45"/>
            <text x="60" y="98" text-anchor="middle" font-family="Georgia, serif" font-size="7" fill="var(--blue-deep)" opacity="0.8">${product.name.split(' ').slice(0,3).join(' ')}</text>
            <text x="60" y="108" text-anchor="middle" font-family="sans-serif" font-size="5" fill="var(--blue-covenant)" opacity="0.6" letter-spacing="1.5">NUEL</text>
          </svg>
          <div class="product-color-dots">${colourDots}</div>
          <div class="product-actions">
            <button class="product-action-btn" onclick="Wishlist.toggle('${product.id}', event)" aria-label="Save to wishlist" title="Save to wishlist">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button class="product-action-btn" onclick="QuickView.open('${product.id}')" aria-label="Quick view" title="Quick view">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <p class="product-card-category">${product.category}</p>
          <h3 class="product-card-name">${product.name}</h3>
          <div class="product-card-pricing">
            <span class="product-price">${price}</span>
          </div>
          <div class="product-volume-tiers">
            <span class="volume-tier-pill">2-3: ${tier2Price}</span>
            <span class="volume-tier-pill">4+: ${tier3Price}</span>
          </div>
          <div class="product-size-select" id="sizes-${product.id}">
            ${sizesHTML}
          </div>
          <button class="btn btn-primary btn-full" onclick="Cart.addFromCard('${product.id}')">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Render featured products on the home page.
   */
  renderFeatured() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
    container.innerHTML = featured.map(p => Products.cardHTML(p)).join('');
    feather.replace();
    Products.initSizeSelection();
  },

  /**
   * Render men's product grid, applying active filters.
   */
  renderMen(filters) {
    const f = filters || State.menFilters;
    const container = document.getElementById('menProducts');
    if (!container) return;

    let products = PRODUCTS.filter(p => p.gender === 'men')
      .filter(p => f.categories.includes(p.category))
      .filter(p => f.size === 'all' || p.sizes.includes(f.size))
      .filter(p => f.maxPrice >= p.price)
      .filter(p => f.colour === 'all' || p.colours.includes(f.colour));

    container.innerHTML = products.length
      ? products.map(p => Products.cardHTML(p)).join('')
      : '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:4rem 0;">No products match your filters.</p>';

    const count = document.getElementById('menResultsCount');
    if (count) count.textContent = 'Showing ' + products.length + ' product' + (products.length !== 1 ? 's' : '');

    feather.replace();
    Products.initSizeSelection();
  },

  /**
   * Render women's product grid, applying active filters.
   */
  renderWomen(filters) {
    const f = filters || State.womenFilters;
    const container = document.getElementById('womenProducts');
    if (!container) return;

    let products = PRODUCTS.filter(p => p.gender === 'women')
      .filter(p => f.categories.includes(p.category))
      .filter(p => f.size === 'all' || p.sizes.includes(f.size))
      .filter(p => f.maxPrice >= p.price)
      .filter(p => f.colour === 'all' || p.colours.includes(f.colour));

    container.innerHTML = products.length
      ? products.map(p => Products.cardHTML(p)).join('')
      : '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:4rem 0;">No products match your filters.</p>';

    const count = document.getElementById('womenResultsCount');
    if (count) count.textContent = 'Showing ' + products.length + ' product' + (products.length !== 1 ? 's' : '');

    feather.replace();
    Products.initSizeSelection();
  },

  /**
   * Attach size-selection click handlers to all product cards in the DOM.
   */
  initSizeSelection() {
    document.querySelectorAll('.product-size-select').forEach(container => {
      container.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
          container.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    });
  },
};

/* =====================================================================
   7. CART SYSTEM
   ===================================================================== */

const Cart = {
  /**
   * Add a product from its card (uses selected size or first size as default).
   * @param {string} productId
   */
  addFromCard(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Find selected size in DOM
    const sizeContainer = document.getElementById('sizes-' + productId);
    let selectedSize = product.sizes[0];
    if (sizeContainer) {
      const selected = sizeContainer.querySelector('.size-option.selected');
      if (selected) selectedSize = selected.dataset.size;
    }

    Cart.add(productId, selectedSize);
  },

  /**
   * Add a product to the cart.
   * @param {string} productId
   * @param {string} size
   * @param {number} qty
   */
  add(productId, size, qty) {
    qty = qty || 1;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Find existing line item matching product + size
    const existing = State.cart.find(i => i.id === productId && i.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      State.cart.push({ id: productId, size: size, qty: qty });
    }

    Cart.persist();
    Cart.updateCount();
    Cart.render();
    Toast.show(product.name + ' added to cart');
  },

  /**
   * Remove a line item from the cart.
   * @param {string} productId
   * @param {string} size
   */
  remove(productId, size) {
    State.cart = State.cart.filter(i => !(i.id === productId && i.size === size));
    Cart.persist();
    Cart.updateCount();
    Cart.render();
  },

  /**
   * Update quantity of a line item.
   * @param {string} productId
   * @param {string} size
   * @param {number} delta : +1 or -1
   */
  updateQty(productId, size, delta) {
    const item = State.cart.find(i => i.id === productId && i.size === size);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    Cart.persist();
    Cart.updateCount();
    Cart.render();
  },

  /**
   * Total quantity across all cart items.
   * @returns {number}
   */
  totalQty() {
    return State.cart.reduce((sum, i) => sum + i.qty, 0);
  },

  /**
   * Calculate cart totals: subtotal, discount, total (all in NGN).
   * @returns {{ subtotal: number, discount: number, total: number }}
   */
  totals() {
    const totalQty = Cart.totalQty();
    const tier = VolumePricing.getDiscount(totalQty);
    const subtotal = State.cart.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
    const discount = subtotal * tier.discount;
    return { subtotal, discount, total: subtotal - discount };
  },

  /**
   * Render all cart items and totals into the cart drawer.
   */
  render() {
    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const empty = document.getElementById('cartEmpty');
    const banner = document.getElementById('volumeBanner');
    const bannerText = document.getElementById('volumeBannerText');

    if (!container) return;

    if (State.cart.length === 0) {
      container.innerHTML = '';
      container.appendChild(document.getElementById('cartEmpty') || createEmptyCart());
      if (empty) empty.style.display = 'block';
      if (footer) footer.style.display = 'none';
      if (banner) banner.style.display = 'flex';
      if (bannerText) bannerText.textContent = 'Add 2+ items for 10% off each';
      return;
    }

    const totalQty = Cart.totalQty();
    const t = Cart.totals();

    // Update volume banner
    if (bannerText) bannerText.textContent = VolumePricing.getLabel(totalQty);

    // Render line items
    const itemsHTML = State.cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';

      const originalTotal = product.price * item.qty;
      const discountedUnit = VolumePricing.applyToPrice(product.price, totalQty);
      const discountedTotal = discountedUnit * item.qty;
      const tier = VolumePricing.getDiscount(totalQty);
      const hasDiscount = tier.discount > 0;

      return `
        <div class="cart-item">
          <div class="cart-item-image">
            <svg viewBox="0 0 60 75" fill="none" aria-hidden="true">
              <path d="M20 15 L30 10 L40 15 L44 28 L36 28 L36 65 L24 65 L24 28 L16 28 Z" fill="var(--blue-covenant)" opacity="0.5"/>
              <path d="M16 28 L7 34 L10 43 L21 37 L21 28Z" fill="var(--blue-holiness)" opacity="0.4"/>
              <path d="M44 28 L53 34 L50 43 L39 37 L39 28Z" fill="var(--blue-holiness)" opacity="0.4"/>
            </svg>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-meta">Size: ${item.size}</div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button class="qty-btn" onclick="Cart.updateQty('${product.id}','${item.size}',-1)" aria-label="Decrease quantity">-</button>
                <span class="qty-value" aria-live="polite">${item.qty}</span>
                <button class="qty-btn" onclick="Cart.updateQty('${product.id}','${item.size}',1)" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-btn" onclick="Cart.remove('${product.id}','${item.size}')" aria-label="Remove item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
            <span class="cart-item-price">${Currency.format(discountedTotal)}</span>
            ${hasDiscount ? '<span class="cart-item-original-price">' + Currency.format(originalTotal) + '</span>' : ''}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = itemsHTML;

    // Update footer
    if (footer) {
      footer.style.display = 'block';
      const hasDiscount = t.discount > 0;
      document.getElementById('cartSubtotal').textContent = Currency.format(t.subtotal);
      document.getElementById('cartTotal').textContent = Currency.format(t.total);

      const discountRow = document.getElementById('discountRow');
      if (discountRow) discountRow.style.display = hasDiscount ? 'flex' : 'none';
      const discountAmt = document.getElementById('discountAmount');
      if (discountAmt && hasDiscount) discountAmt.textContent = '-' + Currency.format(t.discount);
    }
  },

  /**
   * Update the cart badge count in the header.
   */
  updateCount() {
    const badge = document.getElementById('cartCount');
    if (badge) {
      const qty = Cart.totalQty();
      badge.textContent = qty;
      badge.style.opacity = qty > 0 ? '1' : '0';
    }
  },

  /**
   * Persist cart to localStorage.
   */
  persist() {
    try {
      localStorage.setItem('nuel_cart', JSON.stringify(State.cart));
    } catch (e) { /* localStorage may be unavailable */ }
  },

  /**
   * Load cart from localStorage on init.
   */
  load() {
    try {
      const saved = localStorage.getItem('nuel_cart');
      if (saved) State.cart = JSON.parse(saved);
    } catch (e) { /* ignore */ }
    Cart.updateCount();
  },
};

/* Expose cart functions globally for inline onclick handlers */
function closeCart() { Drawers.close('cart'); }

/* =====================================================================
   8. WISHLIST SYSTEM
   ===================================================================== */

const Wishlist = {
  /**
   * Toggle a product in the wishlist.
   * @param {string} productId
   * @param {Event} event : stops propagation from card click
   */
  toggle(productId, event) {
    if (event) event.stopPropagation();

    if (State.wishlist.includes(productId)) {
      State.wishlist = State.wishlist.filter(id => id !== productId);
      Toast.show('Removed from wishlist');
    } else {
      State.wishlist.push(productId);
      Toast.show('Added to wishlist');
    }

    Wishlist.persist();
    Wishlist.updateCount();
    Wishlist.render();

    // Re-render product grids to update heart icon state
    Products.renderFeatured();
    Products.renderMen();
    Products.renderWomen();
  },

  /**
   * Render wishlist drawer contents.
   */
  render() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    if (State.wishlist.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>No saved items yet</p>
          <button class="btn btn-primary" onclick="closeWishlist()">Explore Collection</button>
        </div>
      `;
      return;
    }

    const items = State.wishlist.map(id => {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return '';
      return `
        <div class="cart-item">
          <div class="cart-item-image">
            <svg viewBox="0 0 60 75" fill="none" aria-hidden="true">
              <path d="M20 15 L30 10 L40 15 L44 28 L36 28 L36 65 L24 65 L24 28 L16 28 Z" fill="var(--blue-covenant)" opacity="0.5"/>
            </svg>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-meta">${Currency.format(product.price)}</div>
            <button class="btn btn-primary" style="padding:0.4rem 1rem;font-size:0.75rem;margin-top:0.5rem;" onclick="Cart.add('${product.id}','${product.sizes[0]}')">
              Add to Cart
            </button>
          </div>
          <button class="remove-btn" onclick="Wishlist.toggle('${product.id}', event)" aria-label="Remove from wishlist">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = items;
  },

  /**
   * Update the wishlist badge in the header.
   */
  updateCount() {
    const badge = document.getElementById('wishlistCount');
    if (badge) {
      badge.textContent = State.wishlist.length;
      badge.style.opacity = State.wishlist.length > 0 ? '1' : '0';
    }
  },

  persist() {
    try { localStorage.setItem('nuel_wishlist', JSON.stringify(State.wishlist)); } catch(e) {}
  },

  load() {
    try {
      const saved = localStorage.getItem('nuel_wishlist');
      if (saved) State.wishlist = JSON.parse(saved);
    } catch(e) {}
    Wishlist.updateCount();
  },
};

function closeWishlist() { Drawers.close('wishlist'); }

/* =====================================================================
   9. NAVIGATION
   ===================================================================== */

const Nav = {
  init() {
    // Intercept all nav link clicks
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', function(e) {
        const page = this.dataset.page;
        if (page) {
          e.preventDefault();
          navigateTo(page);
        }
      });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  },
};

/**
 * Navigate to a page section by name.
 * @param {string} page : 'home' | 'men' | 'women' | 'about' | 'community' | 'contact'
 */
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav link active states
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  // Lazy-render page content
  if (page === 'home') Products.renderFeatured();
  if (page === 'men') Products.renderMen();
  if (page === 'women') Products.renderWomen();
  if (page === 'community') Community.render();

  // Close mobile nav
  Drawers.closeMobileNav();
}

/* =====================================================================
   10. SEARCH SYSTEM
   ===================================================================== */

const Search = {
  init() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', Utils.debounce(() => {
      const q = input.value.trim().toLowerCase();
      Search.query(q);
    }, 250));
  },

  /**
   * Filter products and display results in search overlay.
   * @param {string} query
   */
  query(query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!query) {
      container.innerHTML = '';
      return;
    }

    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).slice(0, 6);

    if (!results.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem;">No products found for "' + query + '"</p>';
      return;
    }

    container.innerHTML = results.map(p => `
      <div class="product-card" style="cursor:pointer;" onclick="QuickView.open('${p.id}'); Drawers.close('search');">
        <div class="product-card-image" style="aspect-ratio:1;">
          <svg viewBox="0 0 60 75" fill="none" aria-hidden="true" style="width:50px;height:50px;">
            <path d="M20 15 L30 10 L40 15 L44 28 L36 28 L36 65 L24 65 L24 28 L16 28 Z" fill="var(--blue-covenant)" opacity="0.5"/>
          </svg>
        </div>
        <div class="product-card-body">
          <p class="product-card-category">${p.category}</p>
          <h3 class="product-card-name" style="font-size:0.875rem;">${p.name}</h3>
          <span class="product-price" style="font-size:1rem;">${Currency.format(p.price)}</span>
        </div>
      </div>
    `).join('');
  },
};

/* =====================================================================
   11. FILTER SYSTEM
   ===================================================================== */

const Filters = {
  initMen() {
    // Category checkboxes
    document.querySelectorAll('#menFilters [data-filter="category"]').forEach(cb => {
      cb.addEventListener('change', () => {
        State.menFilters.categories = Array.from(
          document.querySelectorAll('#menFilters [data-filter="category"]:checked')
        ).map(c => c.value);
        Products.renderMen();
      });
    });

    // Size chips
    document.querySelectorAll('#menSizeFilter .size-chip').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#menSizeFilter .size-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        State.menFilters.size = this.dataset.size;
        Products.renderMen();
      });
    });

    // Price range
    const priceRange = document.getElementById('menPriceRange');
    if (priceRange) {
      priceRange.addEventListener('input', function() {
        State.menFilters.maxPrice = parseInt(this.value);
        const label = document.getElementById('menPriceLabel');
        if (label) label.textContent = 'Up to ' + Currency.format(parseInt(this.value));
        Products.renderMen();
      });
    }

    // Colour filter
    document.querySelectorAll('#menColorFilter .colour-chip').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#menColorFilter .colour-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        State.menFilters.colour = this.dataset.colour;
        Products.renderMen();
      });
    });

    // Mobile filter toggle
    const toggleBtn = document.getElementById('filterToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('menFilters');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      });
    }
  },

  initWomen() {
    document.querySelectorAll('#womenFilters [data-filter="category"]').forEach(cb => {
      cb.addEventListener('change', () => {
        State.womenFilters.categories = Array.from(
          document.querySelectorAll('#womenFilters [data-filter="category"]:checked')
        ).map(c => c.value);
        Products.renderWomen();
      });
    });

    document.querySelectorAll('#womenSizeFilter .size-chip').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#womenSizeFilter .size-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        State.womenFilters.size = this.dataset.size;
        Products.renderWomen();
      });
    });

    const priceRange = document.getElementById('womenPriceRange');
    if (priceRange) {
      priceRange.addEventListener('input', function() {
        State.womenFilters.maxPrice = parseInt(this.value);
        const label = document.getElementById('womenPriceLabel');
        if (label) label.textContent = 'Up to ' + Currency.format(parseInt(this.value));
        Products.renderWomen();
      });
    }

    document.querySelectorAll('#womenColorFilter .colour-chip').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#womenColorFilter .colour-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        State.womenFilters.colour = this.dataset.colour;
        Products.renderWomen();
      });
    });

    const womenToggle = document.getElementById('womenFilterToggleBtn');
    if (womenToggle) {
      womenToggle.addEventListener('click', () => {
        const sidebar = document.getElementById('womenFilters');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      });
    }
  },
};

/* =====================================================================
   12. MODALS & DRAWERS
   ===================================================================== */

const Drawers = {
  /**
   * Open a named drawer or modal.
   * @param {'cart'|'wishlist'|'search'|'account'|'quickview'|'checkout'} name
   */
  open(name) {
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('visible');

    if (name === 'cart') {
      const el = document.getElementById('cartDrawer');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
      Cart.render();
    } else if (name === 'wishlist') {
      const el = document.getElementById('wishlistDrawer');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
      Wishlist.render();
    } else if (name === 'search') {
      const el = document.getElementById('searchOverlay');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
      const input = document.getElementById('searchInput');
      if (input) setTimeout(() => input.focus(), 100);
    } else if (name === 'account') {
      const el = document.getElementById('accountModal');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
    } else if (name === 'quickview') {
      const el = document.getElementById('quickViewModal');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
    } else if (name === 'checkout') {
      const el = document.getElementById('checkoutModal');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
      Checkout.renderSummary();
    } else if (name === 'mobile') {
      const el = document.getElementById('mobileNav');
      if (el) { el.classList.add('open'); el.removeAttribute('aria-hidden'); }
    }
  },

  /**
   * Close a named drawer or all drawers.
   */
  close(name) {
    if (name === 'cart') {
      const el = document.getElementById('cartDrawer');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    } else if (name === 'wishlist') {
      const el = document.getElementById('wishlistDrawer');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    } else if (name === 'search') {
      const el = document.getElementById('searchOverlay');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    } else if (name === 'account') {
      const el = document.getElementById('accountModal');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    } else if (name === 'quickview') {
      const el = document.getElementById('quickViewModal');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    } else if (name === 'checkout') {
      const el = document.getElementById('checkoutModal');
      if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
    }

    // Check if any drawer/modal is still open
    const anyOpen = [
      document.querySelector('.drawer.open'),
      document.querySelector('.modal.open'),
      document.querySelector('.search-overlay.open'),
    ].some(Boolean);

    if (!anyOpen) {
      const overlay = document.getElementById('overlay');
      if (overlay) overlay.classList.remove('visible');
    }
  },

  closeMobileNav() {
    const el = document.getElementById('mobileNav');
    if (el) { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
  },

  closeAll() {
    document.querySelectorAll('.drawer').forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); });
    document.querySelectorAll('.modal').forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); });
    const search = document.getElementById('searchOverlay');
    if (search) { search.classList.remove('open'); search.setAttribute('aria-hidden','true'); }
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('visible');
    Drawers.closeMobileNav();
  },

  init() {
    // Cart
    document.getElementById('cartTrigger')?.addEventListener('click', () => Drawers.open('cart'));
    document.getElementById('cartClose')?.addEventListener('click', () => Drawers.close('cart'));

    // Wishlist
    document.getElementById('wishlistTrigger')?.addEventListener('click', () => Drawers.open('wishlist'));
    document.getElementById('wishlistClose')?.addEventListener('click', () => Drawers.close('wishlist'));

    // Search
    document.getElementById('searchTrigger')?.addEventListener('click', () => Drawers.open('search'));
    document.getElementById('searchClose')?.addEventListener('click', () => Drawers.close('search'));

    // Account
    document.getElementById('accountTrigger')?.addEventListener('click', () => Drawers.open('account'));
    document.getElementById('accountClose')?.addEventListener('click', () => Drawers.close('account'));

    // Quick view
    document.getElementById('quickViewClose')?.addEventListener('click', () => Drawers.close('quickview'));

    // Checkout
    document.getElementById('checkoutClose')?.addEventListener('click', () => Drawers.close('checkout'));
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      Drawers.close('cart');
      setTimeout(() => Drawers.open('checkout'), 300);
    });

    // Overlay click closes everything
    document.getElementById('overlay')?.addEventListener('click', () => Drawers.closeAll());

    // Mobile nav
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => Drawers.open('mobile'));
    document.getElementById('mobileNavClose')?.addEventListener('click', () => Drawers.closeMobileNav());

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', function() {
        const page = this.dataset.page;
        if (page) { navigateTo(page); }
      });
    });

    // Escape key closes everything
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') Drawers.closeAll();
    });

    // Account modal tabs
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const panel = document.getElementById(this.dataset.tab + 'Panel');
        if (panel) panel.classList.add('active');
      });
    });
  },
};

/* =====================================================================
   13. QUICK VIEW
   ===================================================================== */

const QuickView = {
  currentProductId: null,
  selectedSize: null,
  qty: 1,

  open(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    QuickView.currentProductId = productId;
    QuickView.selectedSize = product.sizes[0];
    QuickView.qty = 1;

    const container = document.getElementById('quickViewContent');
    if (!container) return;

    const sizesHTML = product.sizes.map(s =>
      '<button class="size-option' + (s === product.sizes[0] ? ' selected' : '') + '" data-size="' + s + '" onclick="QuickView.selectSize(\'' + s + '\')">' + s + '</button>'
    ).join('');

    container.innerHTML = `
      <div class="quickview-image">
        <svg viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M60 45 L90 30 L120 45 L132 82 L108 82 L108 195 L72 195 L72 82 L48 82 Z" fill="var(--blue-covenant)" opacity="0.55"/>
          <path d="M48 82 L21 101 L30 128 L63 110 L63 82Z" fill="var(--blue-holiness)" opacity="0.45"/>
          <path d="M132 82 L159 101 L150 128 L117 110 L117 82Z" fill="var(--blue-holiness)" opacity="0.45"/>
          <text x="90" y="148" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="var(--blue-deep)" opacity="0.8">${product.name.split(' ').slice(0,2).join(' ')}</text>
          <text x="90" y="162" text-anchor="middle" font-family="sans-serif" font-size="7" fill="var(--blue-covenant)" opacity="0.6" letter-spacing="2">NUEL FASHION</text>
        </svg>
      </div>
      <div class="quickview-details">
        <p class="quickview-category">${product.category}</p>
        <h2 class="quickview-name">${product.name}</h2>
        <p class="quickview-desc">${product.desc}</p>
        <div class="quickview-pricing">
          <div class="quickview-price" id="qvPrice">${Currency.format(product.price)}</div>
          <div class="quickview-tiers">
            <span class="volume-tier-pill">2-3 items: ${Currency.format(product.price * 0.9)} each</span>
            <span class="volume-tier-pill">4+ items: ${Currency.format(product.price * 0.8)} each</span>
          </div>
        </div>
        <p class="quickview-label">Size</p>
        <div class="product-size-select" id="qvSizes">${sizesHTML}</div>
        <p class="quickview-label" style="margin-top:1rem;">Quantity</p>
        <div class="quickview-actions">
          <div class="qty-selector">
            <button class="qty-btn" onclick="QuickView.changeQty(-1)" aria-label="Decrease quantity">-</button>
            <span class="qty-value" id="qvQty" aria-live="polite">1</span>
            <button class="qty-btn" onclick="QuickView.changeQty(1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn-primary" style="flex:1;" onclick="QuickView.addToCart()">Add to Cart</button>
          <button class="btn btn-ghost" onclick="Wishlist.toggle('${product.id}')" aria-label="Save to wishlist">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    Drawers.open('quickview');
  },

  selectSize(size) {
    QuickView.selectedSize = size;
    document.querySelectorAll('#qvSizes .size-option').forEach(b => {
      b.classList.toggle('selected', b.dataset.size === size);
    });
  },

  changeQty(delta) {
    QuickView.qty = Math.max(1, QuickView.qty + delta);
    const el = document.getElementById('qvQty');
    if (el) el.textContent = QuickView.qty;
  },

  addToCart() {
    if (!QuickView.currentProductId) return;
    Cart.add(QuickView.currentProductId, QuickView.selectedSize, QuickView.qty);
    Drawers.close('quickview');
  },
};

/* =====================================================================
   14. FAQ ACCORDION
   ===================================================================== */

const FAQ = {
  init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', function() {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;

        // Close all
        document.querySelectorAll('.faq-question').forEach(q => {
          q.setAttribute('aria-expanded', 'false');
          const a = q.nextElementSibling;
          if (a) a.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) {
          this.setAttribute('aria-expanded', 'true');
          if (answer) answer.classList.add('open');
        }
      });
    });
  },
};

/* =====================================================================
   15. THEME TOGGLE
   ===================================================================== */

const Theme = {
  init() {
    // Load saved theme
    const saved = localStorage.getItem('nuel_theme') || 'light';
    Theme.set(saved);

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      Theme.toggle();
    });
  },

  set(theme) {
    State.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('nuel_theme', theme); } catch(e) {}
  },

  toggle() {
    Theme.set(State.theme === 'light' ? 'dark' : 'light');
  },
};

/* =====================================================================
   16. TOAST NOTIFICATIONS
   ===================================================================== */

const Toast = {
  timeout: null,

  show(message, duration) {
    duration = duration || 2500;
    const el = document.getElementById('toast');
    if (!el) return;

    if (Toast.timeout) clearTimeout(Toast.timeout);

    el.textContent = message;
    el.classList.add('show');

    Toast.timeout = setTimeout(() => {
      el.classList.remove('show');
    }, duration);
  },
};

/* =====================================================================
   17. CHECKOUT FLOW (Paystack Hook)
   ===================================================================== */

const Checkout = {
  step: 1,

  init() {
    document.getElementById('proceedToPayBtn')?.addEventListener('click', () => {
      const email = document.getElementById('checkoutEmail')?.value;
      const firstName = document.getElementById('checkoutFirstName')?.value;
      if (!email || !firstName) {
        Toast.show('Please fill in your information');
        return;
      }
      Checkout.goToStep(2);
    });

    document.getElementById('backToInfoBtn')?.addEventListener('click', () => {
      Checkout.goToStep(1);
    });

    document.getElementById('paystackPayBtn')?.addEventListener('click', () => {
      Checkout.initiatePaystack();
    });
  },

  goToStep(step) {
    Checkout.step = step;
    document.getElementById('checkoutStep1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('checkoutStep2').style.display = step === 2 ? 'block' : 'none';
  },

  renderSummary() {
    const container = document.getElementById('checkoutOrderItems');
    if (!container) return;

    const t = Cart.totals();
    const totalQty = Cart.totalQty();

    const itemsHTML = State.cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      const discountedUnit = VolumePricing.applyToPrice(product.price, totalQty);
      return `
        <div class="checkout-order-item">
          <span class="checkout-item-name">${product.name} (${item.size}) x${item.qty}</span>
          <span class="checkout-item-price">${Currency.format(discountedUnit * item.qty)}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = itemsHTML;

    const subEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const discountEl = document.getElementById('checkoutDiscount');

    if (subEl) subEl.textContent = Currency.format(t.subtotal);
    if (totalEl) totalEl.textContent = Currency.format(t.total);
    if (discountRow) discountRow.style.display = t.discount > 0 ? 'flex' : 'none';
    if (discountEl && t.discount > 0) discountEl.textContent = '-' + Currency.format(t.discount);
  },

  /**
   * Initiate Paystack payment.
   * Replace this stub with real Paystack Popup.js integration.
   * Docs: https://paystack.com/docs/payments/accept-payments/
   */
  initiatePaystack() {
    const email = document.getElementById('checkoutEmail')?.value;
    const t = Cart.totals();

    if (!email) {
      Toast.show('Please provide your email address');
      Checkout.goToStep(1);
      return;
    }

    /* 
      REAL PAYSTACK INTEGRATION:
      =========================================================
      Load Paystack's inline JS:
      <script src="https://js.paystack.co/v1/inline.js"></script>
      
      Then call:
      const handler = PaystackPop.setup({
        key:     CONFIG.PAYSTACK.publicKey,
        email:   email,
        amount:  t.total * 100, // Paystack expects kobo (NGN * 100)
        currency: 'NGN',
        ref:     'NUEL_' + Date.now(),
        callback: function(response) {
          // Verify on backend via Paystack API
          // POST /verify/:reference
          Cart.clear();
          Drawers.close('checkout');
          Toast.show('Order confirmed! Reference: ' + response.reference);
        },
        onClose: function() {
          Toast.show('Payment cancelled');
        }
      });
      handler.openIframe();
      =========================================================
    */

    Toast.show('Connecting to Paystack... (configure API key to go live)');
    console.log('PAYSTACK PAYLOAD:', {
      email,
      amount: t.total * 100,
      currency: 'NGN',
      cartItems: State.cart,
    });
  },

  clear() {
    State.cart = [];
    Cart.persist();
    Cart.updateCount();
    Cart.render();
  },
};

/* =====================================================================
   18. SUPABASE AUTH HOOKS
   ===================================================================== */

const Auth = {
  /**
   * Initialize Supabase client and wire up auth state.
   * Replace stub credentials in CONFIG.SUPABASE before deployment.
   */
  init() {
    document.getElementById('loginBtn')?.addEventListener('click', Auth.login);
    document.getElementById('signupBtn')?.addEventListener('click', Auth.signup);
  },

  /**
   * Sign in with Supabase Auth.
   * Stub: replace with real Supabase client calls.
   * Docs: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
   */
  async login() {
    const email    = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      Toast.show('Please enter your email and password');
      return;
    }

      REAL SUPABASE AUTH:
      =========================================================
      const supabase = window.supabase.createClient(CONFIG.SUPABASE.url, CONFIG.SUPABASE.anonKey);
     
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { Toast.show(error.message); return; }
      State.user = data.user;
      Toast.show('Welcome back, ' + data.user.email);
      Drawers.close('account');
      =========================================================

  },

  async signup() {
    const name     = document.getElementById('signupName')?.value;
    const email    = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;

    if (!name || !email || !password) {
      Toast.show('Please fill in all fields');
      return;
    }

      REAL SUPABASE AUTH:
      =========================================================
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) { Toast.show(error.message); return; }
      Toast.show('Account created! Check your email to verify.');
      Drawers.close('account');
      =========================================================

  },
};

/* =====================================================================
   19. COMMUNITY CONTENT
   ===================================================================== */

const Community = {
  render() {
    Community.renderLookbook();
    Community.renderUGC();
  },

  renderLookbook() {
    const container = document.getElementById('lookbookGrid');
    if (!container || container.innerHTML.trim()) return;

    const items = [
      { label: 'Rooted in Love Drop 01' },
      { label: 'Covenant Blue Essentials' },
      { label: 'Kingdom at Work' },
      { label: 'Sunday Best, NUEL Style' },
      { label: 'Stewardship Is Worship' },
      { label: 'Peaceful Saturdays' },
    ];

    container.innerHTML = items.map((item, i) => `
      <div class="lookbook-item">
        <svg viewBox="0 0 80 100" fill="none" aria-hidden="true">
          <path d="M27 20 L40 14 L53 20 L58 36 L48 36 L48 86 L32 86 L32 36 L22 36 Z" fill="var(--blue-covenant)" opacity="${0.4 + (i % 3) * 0.15}"/>
          <path d="M22 36 L9 44 L13 57 L28 50 L28 36Z" fill="var(--blue-holiness)" opacity="0.4"/>
          <path d="M58 36 L71 44 L67 57 L52 50 L52 36Z" fill="var(--blue-holiness)" opacity="0.4"/>
        </svg>
        <div class="lookbook-label">${item.label}</div>
      </div>
    `).join('');
  },

  renderUGC() {
    const container = document.getElementById('ugcGrid');
    if (!container || container.innerHTML.trim()) return;

    const count = 8;
    container.innerHTML = Array.from({ length: count }, (_, i) => `
      <div class="ugc-item" title="Community style #${i + 1}">
        <svg viewBox="0 0 50 60" fill="none" aria-hidden="true">
          <path d="M17 12 L25 8 L33 12 L36 22 L30 22 L30 52 L20 52 L20 22 L14 22 Z" fill="var(--blue-covenant)" opacity="${0.35 + (i % 4) * 0.12}"/>
        </svg>
      </div>
    `).join('');
  },
};

/* =====================================================================
   20. UTILITY FUNCTIONS
   ===================================================================== */

const Utils = {
  /**
   * Debounce a function call.
   */
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },
};

/* =====================================================================
   FORM HANDLERS (inline onsubmit targets)
   ===================================================================== */

function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input[type="email"]');
  if (input && input.value) {
    Toast.show('You are on the list! Watch your inbox for kingdom drops.');
    input.value = '';
  }
}

function handleContact(event) {
  event.preventDefault();
  Toast.show('Message sent. We will reply within 24 hours.');
  event.target.reset();
}

/* Waitlist button handler */
function initWaitlist() {
  document.getElementById('waitlistBtn')?.addEventListener('click', () => {
    Drawers.open('account');
    Toast.show('Sign in or create an account to join the waitlist');
  });
}

/* Live chat stub */
function initLiveChat() {
  document.getElementById('liveChatBtn')?.addEventListener('click', () => {
    Toast.show('Live chat launching... (integrate your chat provider here)');
    /* Connect Intercom, Crisp, Tawk.to, or similar here */
  });
}

/* =====================================================================
   21. INITIALISATION
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {

  /* 1. Initialise Feather Icons */
  if (typeof feather !== 'undefined') feather.replace();

  /* 2. Theme */
  Theme.init();

  /* 3. Currency toggle */
  document.getElementById('currencyToggle')?.addEventListener('click', Currency.toggle.bind(Currency));

  /* 4. Navigation */
  Nav.init();

  /* 5. Drawers and modals */
  Drawers.init();

  /* 6. Cart & Wishlist : load from localStorage */
  Cart.load();
  Wishlist.load();

  /* 7. Render initial page (home) */
  Products.renderFeatured();

  /* 8. Filters */
  Filters.initMen();
  Filters.initWomen();

  /* 9. Search */
  Search.init();

  /* 10. FAQ */
  FAQ.init();

  /* 11. Auth hooks */
  Auth.init();

  /* 12. Checkout */
  Checkout.init();

  /* 13. Misc */
  initWaitlist();
  initLiveChat();

  /* 14. Feather re-replace after dynamic content */
  setTimeout(() => {
    if (typeof feather !== 'undefined') feather.replace();
  }, 500);

  console.log('%c NUEL Fashion : Production Build Ready ', 'background:#185FA5;color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold;');
  console.log('Supabase URL:    ', CONFIG.SUPABASE.url);
  console.log('Paystack Key:    ', CONFIG.PAYSTACK.publicKey);
  console.log('To go live: replace CONFIG values and uncomment real API calls.');
});

/* =====================================================================
   22. ADDITIONAL INTERACTIONS & POLISH
   ===================================================================== */

/**
 * Animate hero scroll cue : hide after user scrolls
 */
(function() {
  window.addEventListener('scroll', function hideScrollCue() {
    const cue = document.querySelector('.hero-scroll-cue');
    if (cue && window.scrollY > 80) {
      cue.style.opacity = '0';
      cue.style.transition = 'opacity 0.4s';
      window.removeEventListener('scroll', hideScrollCue);
    }
  }, { passive: true });
})();

/**
 * Intersection Observer : fade-in sections as they enter viewport
 * (lightweight, no heavy animation library needed)
 */
(function() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Apply to sales sections on home page : run after DOM is ready
  function observeSections() {
    document.querySelectorAll('.sales-section, .drop-section, .newsletter-section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(el);
    });
  }

  // Run once home is active, re-run on navigation
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(observeSections, 400);
  });
})();

/**
 * Currency: auto-refresh price labels in filter sidebars
 * when currency changes
 */
const _origCurrencyToggle = Currency.toggle.bind(Currency);
Currency.toggle = function() {
  _origCurrencyToggle();
  // Update filter price labels
  const menLabel    = document.getElementById('menPriceLabel');
  const womenLabel  = document.getElementById('womenPriceLabel');
  const menRange    = document.getElementById('menPriceRange');
  const womenRange  = document.getElementById('womenPriceRange');
  if (menLabel   && menRange)   menLabel.textContent   = 'Up to ' + Currency.format(parseInt(menRange.value));
  if (womenLabel && womenRange) womenLabel.textContent = 'Up to ' + Currency.format(parseInt(womenRange.value));
};

/**
 * Cart: clear all items (used after successful Paystack payment)
 */
Cart.clear = function() {
  State.cart = [];
  Cart.persist();
  Cart.updateCount();
  Cart.render();
};

/**
 * Wishlist: check if a product is in wishlist
 */
Wishlist.has = function(productId) {
  return State.wishlist.includes(productId);
};

/**
 * Products: get a single product by ID
 */
Products.get = function(id) {
  return PRODUCTS.find(p => p.id === id) || null;
};

/**
 * Re-render Feather icons after any dynamic content injection.
 * Call this whenever new HTML containing data-feather attributes is injected.
 */
function refreshIcons() {
  if (typeof feather !== 'undefined') {
    try { feather.replace(); } catch(e) {}
  }
}

/**
 * Format NGN number without symbol (for internal calculations display)
 */
function formatNGN(amount) {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

/* =====================================================================
   23. SELL LIKE CRAZY : PHASE 3 LEAD CAPTURE
   Waitlist / email capture tied to the drop model
   ===================================================================== */

const Leads = {
  /**
   * Subscribe an email address to the waitlist.
   * Wire to Supabase 'leads' table or Mailchimp API.
   * @param {string} email
   * @param {string} drop : e.g. 'drop-02-peace'
   */
  async subscribe(email, drop) {
    drop = drop || 'general';

    if (!email || !email.includes('@')) {
      Toast.show('Please enter a valid email address');
      return false;
    }

    /*
      REAL SUPABASE LEAD CAPTURE:
      =========================================================
      const { error } = await supabase
        .from('leads')
        .insert([{ email, drop, created_at: new Date().toISOString() }]);
      
      if (error && error.code !== '23505') {  // 23505 = duplicate
        Toast.show('Something went wrong. Please try again.');
        return false;
      }

      MAILCHIMP INTEGRATION:
      =========================================================
      POST to your Mailchimp audience via a Cloudflare Worker proxy:
      fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email, tags: [drop] })
      });
      =========================================================
    */

    Toast.show('You are on the waitlist for Drop 02 : Peace!');
    console.log('LEAD CAPTURE:', { email, drop });
    return true;
  },
};

/* =====================================================================
   24. SELL LIKE CRAZY : PHASE 7 SALES CONVERSION HOOKS
   ===================================================================== */

/**
 * Sticky add-to-cart bar : appears when user scrolls past the hero on product pages.
 * In a multi-page app you would attach this to individual product detail pages.
 * Stub for future expansion.
 */
const StickyBar = {
  init() {
    // Placeholder : extend when individual product pages are built
  },
};

/**
 * Exit-intent popup : shows a discount when user is about to leave.
 * Triggers once per session.
 */
const ExitIntent = {
  shown: false,

  init() {
    if (ExitIntent.shown) return;

    document.addEventListener('mouseleave', function(e) {
      if (e.clientY > 0 || ExitIntent.shown) return;
      ExitIntent.shown = true;

      // Show a newsletter sign-up as exit-intent
      // Could be upgraded to a dedicated modal with a discount code
      setTimeout(() => {
        Toast.show('Wait : join the waitlist for Drop 02 and get early access');
      }, 300);
    });
  },
};

/* =====================================================================
   25. CLOUDFLARE ANALYTICS HOOK
   Drop-in ready for Cloudflare Web Analytics (no cookie banner needed)
   ===================================================================== */

/*
  To enable Cloudflare Web Analytics, add to <head> in index.html:

  <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
    data-cf-beacon='{"token": "YOUR_CF_ANALYTICS_TOKEN"}'></script>
*/

/* =====================================================================
   26. PERFORMANCE : LAZY ICON INIT
   Re-run feather.replace() after dynamic content is injected
   by cart, wishlist, or product renders.
   ===================================================================== */

// Patch Cart.render to refresh icons after render
const _originalCartRender = Cart.render.bind(Cart);
Cart.render = function() {
  _originalCartRender();
  setTimeout(refreshIcons, 50);
};

// Patch Products.renderFeatured to refresh icons
const _origRenderFeatured = Products.renderFeatured.bind(Products);
Products.renderFeatured = function() {
  _origRenderFeatured();
  setTimeout(refreshIcons, 50);
};

/* =====================================================================
   27. FINAL INIT EXTENSION : attach exit intent
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Exit intent (once all other init has run)
  setTimeout(() => ExitIntent.init(), 5000);
});

