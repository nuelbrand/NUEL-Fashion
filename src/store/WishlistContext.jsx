/**
 * WISHLIST CONTEXT
 * ================
 * FILE: src/store/WishlistContext.jsx
 *
 * WHAT THIS MANAGES:
 *   The list of product IDs the user has saved to their wishlist.
 *   Persisted in localStorage so it survives page refresh.
 *
 * HOW TO USE:
 *   import { useWishlist } from '../store/WishlistContext'
 *   const { wishlistIds, toggleWishlist, isWishlisted } = useWishlist()
 */

import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  // Store just the product IDs (not full product objects)
  // Full product data is fetched separately when needed
  const [wishlistIds, setWishlistIds] = useState([])

  // ── Load from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nuel_wishlist')
      if (saved) setWishlistIds(JSON.parse(saved))
    } catch (e) {
      console.warn('Could not load wishlist from localStorage')
    }
  }, [])

  // ── Save to localStorage whenever wishlist changes ──────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('nuel_wishlist', JSON.stringify(wishlistIds))
    } catch (e) {
      console.warn('Could not save wishlist to localStorage')
    }
  }, [wishlistIds])

  /**
   * Add a product to wishlist if not there, remove it if it is.
   * @param {string} productId
   */
  function toggleWishlist(productId) {
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)   // remove
        : [...prev, productId]                   // add
    )
  }

  /**
   * Check if a product is in the wishlist.
   * @param {string} productId
   * @returns {boolean}
   */
  function isWishlisted(productId) {
    return wishlistIds.includes(productId)
  }

  const value = {
    wishlistIds,
    toggleWishlist,
    isWishlisted,
    wishlistCount: wishlistIds.length,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used inside a <WishlistProvider>. Check App.jsx.')
  }
  return context
}
