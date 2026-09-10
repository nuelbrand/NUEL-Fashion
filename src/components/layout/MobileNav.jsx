/**
 * MOBILE NAV COMPONENT
 * ====================
 * FILE: src/components/layout/MobileNav.jsx
 *
 * WHAT THIS IS:
 *   The navigation menu that slides in from the LEFT on mobile.
 *   Opens when the user taps the hamburger (≡) icon in the Header.
 *
 *   On desktop screens (lg:) this is never shown —
 *   the desktop nav in the Header handles navigation.
 */

import { NavLink } from 'react-router-dom'
import { useUI }   from '../../store/UIContext'
import CONFIG      from '../../config/app.config.js'

export default function MobileNav() {
  const { drawers, closeDrawer, openDrawer } = useUI()
  const isOpen = drawers.mobileNav

  function handleLinkClick() {
    closeDrawer('mobileNav')
  }

  return (
    <nav
      aria-label="Mobile navigation"
      aria-hidden={!isOpen}
      className={`
        fixed top-0 left-0 h-full w-72
        bg-white dark:bg-gray-950
        z-[1100] flex flex-col
        shadow-2xl
        transition-transform duration-350 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-deep-heaven rounded-xl flex items-center justify-center">
            <span className="font-display text-lg font-bold text-grace">N</span>
          </div>
          <span className="font-display font-semibold text-gray-900 dark:text-white">NUEL Fashion</span>
        </div>
        <button
          onClick={() => closeDrawer('mobileNav')}
          aria-label="Close navigation"
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {CONFIG.NAV_LINKS.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            onClick={handleLinkClick}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium
              transition-colors duration-150
              ${isActive
                ? 'bg-covenant/10 text-covenant'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <button
          onClick={() => { closeDrawer('mobileNav'); openDrawer('account') }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          Account
        </button>
        <button
          onClick={() => { closeDrawer('mobileNav'); openDrawer('cart') }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Cart
        </button>
      </div>
    </nav>
  )
}
