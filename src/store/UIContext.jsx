/**
 * UI CONTEXT
 * ==========
 * FILE: src/store/UIContext.jsx
 *
 * WHAT THIS MANAGES:
 *   All the visual state of the app that isn't data:
 *   - Dark/light theme
 *   - Active currency (NGN or USD)
 *   - Which drawers/modals are open (cart, wishlist, search, account)
 *   - Toast notification messages
 *
 * HOW TO USE:
 *   import { useUI } from '../store/UIContext'
 *   const { theme, toggleTheme, openDrawer, showToast } = useUI()
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const UIContext = createContext(null)

// ─── INITIAL DRAWER STATE ───────────────────────────────────────────────────
// All drawers start closed
const initialDrawers = {
  cart:      false,
  wishlist:  false,
  search:    false,
  account:   false,
  quickview: false,
  checkout:  false,
  mobileNav: false,
}

export function UIProvider({ children }) {

  // ── THEME ────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    // Load saved theme from localStorage, default to 'light'
    try { return localStorage.getItem('nuel_theme') || 'light' }
    catch { return 'light' }
  })

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('nuel_theme', theme) } catch {}
  }, [theme])

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // ── CURRENCY ─────────────────────────────────────────────────────────────
  const [currency, setCurrency] = useState('NGN')

  function toggleCurrency() {
    setCurrency(prev => prev === 'NGN' ? 'USD' : 'NGN')
  }

  // ── DRAWERS / MODALS ─────────────────────────────────────────────────────
  const [drawers, setDrawers] = useState(initialDrawers)

  /**
   * Open a specific drawer or modal.
   * @param {'cart'|'wishlist'|'search'|'account'|'quickview'|'checkout'|'mobileNav'} name
   */
  function openDrawer(name) {
    setDrawers(prev => ({ ...prev, [name]: true }))
  }

  /**
   * Close a specific drawer or modal.
   * @param {string} name
   */
  function closeDrawer(name) {
    setDrawers(prev => ({ ...prev, [name]: false }))
  }

  /** Close every drawer and modal at once (e.g. when overlay is clicked) */
  function closeAllDrawers() {
    setDrawers(initialDrawers)
  }

  /** Check if ANY drawer/modal is currently open (used to show/hide overlay) */
  const anyDrawerOpen = Object.values(drawers).some(Boolean)

  // ── TOAST NOTIFICATIONS ──────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: '', visible: false })

  /**
   * Show a toast notification for 2.5 seconds.
   * @param {string} message - The message to display
   * @param {number} duration - How long to show it (ms), default 2500
   */
  const showToast = useCallback((message, duration = 2500) => {
    setToast({ message, visible: true })
    setTimeout(() => {
      setToast({ message: '', visible: false })
    }, duration)
  }, [])

  // ── QUICK VIEW PRODUCT ID ────────────────────────────────────────────────
  // Tracks which product the quick view modal should show
  const [quickViewProductId, setQuickViewProductId] = useState(null)

  function openQuickView(productId) {
    setQuickViewProductId(productId)
    openDrawer('quickview')
  }

  function closeQuickView() {
    closeDrawer('quickview')
    // Delay clearing the ID so the modal can animate closed first
    setTimeout(() => setQuickViewProductId(null), 350)
  }

  // ── KEYBOARD: ESC KEY CLOSES EVERYTHING ─────────────────────────────────
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') closeAllDrawers()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const value = {
    // Theme
    theme,
    toggleTheme,

    // Currency
    currency,
    toggleCurrency,

    // Drawers
    drawers,
    openDrawer,
    closeDrawer,
    closeAllDrawers,
    anyDrawerOpen,

    // Quick view
    quickViewProductId,
    openQuickView,
    closeQuickView,

    // Toast
    toast,
    showToast,
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used inside a <UIProvider>. Check App.jsx.')
  }
  return context
}
