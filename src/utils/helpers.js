/**
 * GENERAL HELPERS
 * ===============
 * FILE: src/utils/helpers.js
 *
 * WHAT THIS FILE DOES:
 *   Small, reusable utility functions used across the app.
 *   These are "pure functions" — they take inputs and return
 *   outputs with no side effects (no API calls, no DOM changes).
 */

/**
 * Debounce: delays a function call until after the user stops typing.
 * Used in the search bar to avoid firing a search on every keystroke.
 *
 * @param {Function} fn    - The function to delay
 * @param {number} delay   - How many milliseconds to wait (e.g. 300)
 * @returns {Function}     - A debounced version of fn
 *
 * EXAMPLE:
 *   const debouncedSearch = debounce(search, 300)
 *   input.addEventListener('input', debouncedSearch)
 *   // search() only fires 300ms after the user stops typing
 */
export function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * Convert a product name into a URL-friendly slug.
 * Used when navigating to product detail pages.
 *
 * @param {string} text - e.g. 'Rooted in Love Tee'
 * @returns {string}    - e.g. 'rooted-in-love-tee'
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // multiple hyphens → single
    .trim()
}

/**
 * Format a date string into a readable format.
 *
 * @param {string} dateString - ISO date string (e.g. '2025-03-15T10:30:00Z')
 * @returns {string}          - e.g. '15 March 2025'
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-NG', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}

/**
 * Truncate a string to a maximum length, adding '...' if truncated.
 * Useful for product descriptions in cards.
 *
 * @param {string} text     - The text to truncate
 * @param {number} maxLen   - Maximum character count
 * @returns {string}
 *
 * EXAMPLE:
 *   truncate('Faith made visible, wearable, and beautiful', 20)
 *   → 'Faith made visible,...'
 */
export function truncate(text, maxLen = 80) {
  if (!text || text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '...'
}

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 *
 * EXAMPLE:
 *   clamp(0, 1, 99) → 1   (can't go below 1)
 *   clamp(5, 1, 99) → 5   (within range, unchanged)
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Map a NUEL colour name to its hex value.
 * Used for rendering colour dot swatches on product cards.
 *
 * @param {string} colourName - e.g. 'covenant', 'holiness'
 * @returns {string}          - hex colour string
 */
export function colourToHex(colourName) {
  const map = {
    'deep-heaven':    '#042C53',
    'covenant':       '#185FA5',
    'holiness':       '#378ADD',
    'grace':          '#B5D4F4',
    'grace-light':    '#B5D4F4',
    'mist':           '#E6F1FB',
    'heavenly-mist':  '#E6F1FB',
    'white':          '#FFFFFF',
    'black':          '#0D1B2A',
  }
  return map[colourName] || '#cccccc'
}
