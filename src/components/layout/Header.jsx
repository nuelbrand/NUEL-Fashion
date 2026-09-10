/**
 * HEADER COMPONENT
 * ================
 * FILE: src/components/layout/Header.jsx
 *
 * WHAT THIS IS:
 *   The sticky navigation bar that appears at the top of every page.
 *
 *   Contains:
 *   - NUEL Fashion logo (links to home)
 *   - Desktop navigation links (Home, Men, Women, About, Community, Contact)
 *   - Currency toggle (NGN ↔ USD)
 *   - Theme toggle (light ↔ dark)
 *   - Search button
 *   - Wishlist button (with count badge)
 *   - Cart button (with count badge)
 *   - Account button
 *   - Mobile hamburger menu button
 *
 * BEHAVIOUR:
 *   - Becomes slightly elevated (adds shadow) when user scrolls down
 *   - On mobile: hides desktop nav, shows hamburger button instead
 */

import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart }     from '../../store/CartContext'
import { useWishlist } from '../../store/WishlistContext'
import { useUI }       from '../../store/UIContext'
import CONFIG          from '../../config/app.config.js'

// ─── NAV LINK STYLES ────────────────────────────────────────────────────────
// NavLink from React Router adds an "active" class automatically
// when the current URL matches the link's "to" prop.
const navLinkClass = ({ isActive }) => `
  text-sm font-medium px-4 py-2 rounded-full transition-all duration-200
  ${isActive
    ? 'text-covenant bg-covenant/10'
    : 'text-gray-600 dark:text-gray-300 hover:text-covenant hover:bg-covenant/5'
  }
`

export default function Header() {
  const { totalQty }      = useCart()
  const { wishlistCount } = useWishlist()
  const { currency, toggleCurrency, toggleTheme, theme, openDrawer } = useUI()

  // Add shadow to header when user scrolls down
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`
      sticky top-0 z-[900]
      h-header bg-white dark:bg-gray-950
      border-b border-gray-100 dark:border-gray-800
      transition-shadow duration-200
      ${scrolled ? 'shadow-md' : ''}
    `}>
      <div className="h-full max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between gap-6">

        {/* ── LOGO ── */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
          <div className="w-10 h-10 bg-deep-heaven rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="font-display text-xl font-bold text-grace">N</span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-base font-semibold text-gray-900 dark:text-white">
              NUEL Fashion
            </span>
            <span className="text-[10px] text-gray-400 tracking-wide">Soul Winner</span>
          </div>
        </Link>

        {/* ── DESKTOP NAVIGATION ── */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          {CONFIG.NAV_LINKS.map(link => (
            <NavLink key={link.path} to={link.path} className={navLinkClass} end={link.path === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── UTILITY BUTTONS ── */}
        <div className="flex items-center gap-1">

          {/* Currency toggle */}
          <button
            onClick={toggleCurrency}
            aria-label="Toggle currency"
            className="
              hidden sm:flex items-center
              h-10 px-3 rounded-full
              text-xs font-bold tracking-wide text-covenant
              border border-gray-200 dark:border-gray-700
              hover:bg-covenant/5 transition-colors
            "
          >
            {currency}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? (
              // Sun icon (shown in dark mode to switch to light)
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              // Moon icon (shown in light mode to switch to dark)
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => openDrawer('search')}
            aria-label="Search products"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Wishlist with count badge */}
          <button
            onClick={() => openDrawer('wishlist')}
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-covenant text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart with count badge */}
          <button
            onClick={() => openDrawer('cart')}
            aria-label={`Cart (${totalQty} items)`}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalQty > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-covenant text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            onClick={() => openDrawer('account')}
            aria-label="Account"
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {/* Mobile hamburger — only visible on small screens */}
          <button
            onClick={() => openDrawer('mobileNav')}
            aria-label="Open navigation menu"
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

        </div>
      </div>
    </header>
  )
}
