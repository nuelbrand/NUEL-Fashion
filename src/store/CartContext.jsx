/**
 * CART CONTEXT
 * ============
 * FILE: src/store/CartContext.jsx
 *
 * WHAT IS A CONTEXT?
 *   In React, a "Context" is like a global variable that ANY
 *   component in your app can read or update — without having
 *   to pass it down through every parent component manually.
 *
 * WHAT THIS CONTEXT MANAGES:
 *   - The list of items in the cart
 *   - Adding, removing, and updating quantities
 *   - Persisting the cart to localStorage (survives page refresh)
 *   - Calculating totals with volume discounts
 *
 * HOW TO USE IN A COMPONENT:
 *   import { useCart } from '../store/CartContext'
 *   const { cartItems, addToCart, totalQty } = useCart()
 */

import { createContext, useContext, useReducer, useEffect } from 'react'
import { calculateCartTotals } from '../utils/volumePricing.js'

// ─── 1. CREATE THE CONTEXT ──────────────────────────────────────────────────
// This is the "container" that holds and shares the cart data.
const CartContext = createContext(null)

// ─── 2. CART REDUCER ────────────────────────────────────────────────────────
// A reducer is a function that takes the current state + an action,
// and returns the NEW state. It is the only place cart state changes.
//
// ACTION TYPES:
//   ADD_ITEM     → add a product to cart (or increase qty if already there)
//   REMOVE_ITEM  → remove a product+size line from cart
//   UPDATE_QTY   → set a specific quantity for a line item
//   CLEAR_CART   → empty the cart (used after successful payment)
//   LOAD_CART    → restore cart from localStorage on app start

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const { product, size, qty = 1 } = action.payload

      // Check if this exact product + size already exists in cart
      const existingIndex = state.findIndex(
        item => item.id === product.id && item.size === size
      )

      if (existingIndex >= 0) {
        // Item exists → increase its quantity
        const updated = [...state]
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + qty,
        }
        return updated
      }

      // Item is new → add it to the cart
      return [...state, { id: product.id, product, size, qty }]
    }

    case 'REMOVE_ITEM': {
      // Filter out the item that matches both product ID and size
      return state.filter(
        item => !(item.id === action.payload.productId && item.size === action.payload.size)
      )
    }

    case 'UPDATE_QTY': {
      const { productId, size, qty } = action.payload
      if (qty < 1) {
        // If qty goes below 1, remove the item
        return state.filter(item => !(item.id === productId && item.size === size))
      }
      return state.map(item =>
        item.id === productId && item.size === size
          ? { ...item, qty }
          : item
      )
    }

    case 'CLEAR_CART':
      return []

    case 'LOAD_CART':
      return action.payload || []

    default:
      return state
  }
}

// ─── 3. CART PROVIDER ───────────────────────────────────────────────────────
// The Provider is a React component that wraps your entire app.
// Everything inside it can access the cart.

export function CartProvider({ children }) {
  // useReducer is like useState but for complex state with multiple actions
  const [cartItems, dispatch] = useReducer(cartReducer, [])

  // ── Load cart from localStorage when app first starts ──────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nuel_cart')
      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
      }
    } catch (e) {
      // If localStorage fails (e.g. private browsing), just start with empty cart
      console.warn('Could not load cart from localStorage')
    }
  }, []) // Empty array = runs once on mount

  // ── Save cart to localStorage whenever it changes ───────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('nuel_cart', JSON.stringify(cartItems))
    } catch (e) {
      console.warn('Could not save cart to localStorage')
    }
  }, [cartItems]) // Runs every time cartItems changes

  // ── HELPER FUNCTIONS ────────────────────────────────────────────────────
  // These are the functions components will call to interact with the cart.

  /** Add a product to the cart */
  function addToCart(product, size, qty = 1) {
    dispatch({ type: 'ADD_ITEM', payload: { product, size, qty } })
  }

  /** Remove one line (product + size combo) from the cart */
  function removeFromCart(productId, size) {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } })
  }

  /** Update the quantity of a specific cart line */
  function updateQty(productId, size, qty) {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, size, qty } })
  }

  /** Empty the entire cart (called after successful payment) */
  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
  }

  /** Total number of individual items (e.g. 2 tees + 1 hoodie = 3) */
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0)

  /** Calculated totals with volume discount applied */
  const totals = calculateCartTotals(cartItems)

  // ── PROVIDE THE VALUES ──────────────────────────────────────────────────
  // Everything listed here is available to any component using useCart()
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalQty,
    ...totals,  // spreads: subtotal, discount, total, rate
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// ─── 4. CUSTOM HOOK ─────────────────────────────────────────────────────────
// This is the clean way for components to access the cart.
// Usage: const { cartItems, addToCart } = useCart()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>. Check App.jsx.')
  }
  return context
}
