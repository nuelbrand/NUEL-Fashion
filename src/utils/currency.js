/**
 * CURRENCY UTILITY
 * ================
 * FILE: src/utils/currency.js
 *
 * WHAT THIS FILE DOES:
 *   All price formatting functions for the app.
 *   Every price in the database is stored in NGN (Naira).
 *   This file handles converting and formatting them for display.
 *
 * IMPORTANT RULE:
 *   Prices are ALWAYS stored as NGN numbers (e.g. 15000).
 *   We only convert to USD at the display layer (on screen).
 *   Paystack always charges in NGN regardless of display currency.
 */

import CONFIG from '../config/app.config.js'

/**
 * Format a price for display in the current currency.
 *
 * @param {number} ngn          - Price in Nigerian Naira
 * @param {string} currency     - 'NGN' or 'USD'
 * @returns {string}            - Formatted price string
 *
 * EXAMPLES:
 *   formatPrice(15000, 'NGN') → '₦15,000'
 *   formatPrice(15000, 'USD') → '$9.38'
 */
export function formatPrice(ngn, currency = 'NGN') {
  if (currency === 'USD') {
    const usd = ngn / CONFIG.USD_TO_NGN
    return '$' + usd.toFixed(2)
  }

  // Nigerian Naira format with thousand separators
  return '₦' + ngn.toLocaleString('en-NG')
}

/**
 * Convert NGN to USD (for display only — not for payment).
 *
 * @param {number} ngn - Amount in Naira
 * @returns {number}   - Amount in USD
 */
export function ngnToUsd(ngn) {
  return ngn / CONFIG.USD_TO_NGN
}

/**
 * Get the currency symbol for the current currency.
 *
 * @param {string} currency - 'NGN' or 'USD'
 * @returns {string}        - '₦' or '$'
 */
export function getCurrencySymbol(currency = 'NGN') {
  return currency === 'USD' ? '$' : '₦'
}
