/**
 * VOLUME PRICING UTILITY
 * ======================
 * FILE: src/utils/volumePricing.js
 *
 * WHAT THIS FILE DOES:
 *   Calculates bulk discounts based on how many items
 *   are in the cart total.
 *
 * THE RULES:
 *   1 item  → full price (0% off)
 *   2–3 items → 10% off every item in the cart
 *   4+ items  → 20% off every item in the cart
 *
 * NOTE: The discount applies to EVERY item, not just extras.
 *   So buying 2 × ₦15,000 tees = 2 × ₦13,500 = ₦27,000 total.
 */

import CONFIG from '../config/app.config.js'

/**
 * Get the discount tier that applies for a given cart quantity.
 *
 * @param {number} totalQty - Total number of items across all cart lines
 * @returns {{ minQty, maxQty, discount, label }}
 *
 * EXAMPLE:
 *   getDiscountTier(3) → { discount: 0.10, label: '10% off', ... }
 *   getDiscountTier(5) → { discount: 0.20, label: '20% off', ... }
 */
export function getDiscountTier(totalQty) {
  // Work backwards through the tiers to find the highest applicable discount
  const tiers = CONFIG.VOLUME_TIERS
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalQty >= tiers[i].minQty) return tiers[i]
  }
  return tiers[0] // Default: full price
}

/**
 * Get the discount percentage (0 to 1) for a given quantity.
 *
 * @param {number} totalQty
 * @returns {number} - e.g. 0.10 for 10% off
 */
export function getDiscountRate(totalQty) {
  return getDiscountTier(totalQty).discount
}

/**
 * Apply volume discount to a unit price.
 *
 * @param {number} priceNGN  - Original price in Naira
 * @param {number} totalQty  - Total cart quantity
 * @returns {number}         - Discounted price in Naira
 *
 * EXAMPLE:
 *   applyVolumeDiscount(15000, 3) → 13500  (10% off)
 *   applyVolumeDiscount(15000, 5) → 12000  (20% off)
 */
export function applyVolumeDiscount(priceNGN, totalQty) {
  const rate = getDiscountRate(totalQty)
  return priceNGN * (1 - rate)
}

/**
 * Get a human-readable message about the current/next discount tier.
 * Used in the cart banner to encourage customers to add more items.
 *
 * @param {number} totalQty
 * @returns {string}
 *
 * EXAMPLES:
 *   getVolumeBannerMessage(1) → 'Add 1 more item for 10% off everything'
 *   getVolumeBannerMessage(2) → 'Volume discount: 10% off every item'
 *   getVolumeBannerMessage(4) → 'Volume discount: 20% off every item — best deal!'
 */
export function getVolumeBannerMessage(totalQty) {
  if (totalQty < 2) return `Add ${2 - totalQty} more item for 10% off everything`
  if (totalQty < 4) return `Volume discount: 10% off every item — add ${4 - totalQty} more for 20% off`
  return 'Volume discount: 20% off every item — best deal!'
}

/**
 * Calculate cart totals including volume discount.
 *
 * @param {Array}  cartItems - Array of { product, size, qty } objects
 * @returns {{ subtotal, discount, total }}  - All values in NGN
 */
export function calculateCartTotals(cartItems) {
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const rate     = getDiscountRate(totalQty)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  )

  const discount = subtotal * rate
  const total    = subtotal - discount

  return { subtotal, discount, total, rate, totalQty }
}
