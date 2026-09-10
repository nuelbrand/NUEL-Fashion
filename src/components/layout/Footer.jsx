/**
 * FOOTER COMPONENT
 * ================
 * FILE: src/components/layout/Footer.jsx
 *
 * WHAT THIS IS:
 *   The footer that appears at the bottom of every page.
 *   Contains the logo, navigation links, newsletter signup, and copyright.
 */

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useUI } from '../../store/UIContext'

export default function Footer() {
  const { showToast } = useUI()
  const [email, setEmail] = useState('')

  function handleNewsletter(e) {
    e.preventDefault()
    if (email) {
      showToast('You are on the list! Watch your inbox for kingdom drops.')
      setEmail('')
    }
  }

  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 no-underline w-fit">
              <div className="w-10 h-10 bg-deep-heaven rounded-xl flex items-center justify-center">
                <span className="font-display text-xl font-bold text-grace">N</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-base font-semibold text-gray-900 dark:text-white">NUEL Fashion</span>
                <span className="text-[10px] text-gray-400 tracking-wide">Part of the NUEL Ecosystem</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[28ch]">
              What you wear is a declaration. Make it count.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Instagram', href: '#', icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                )},
                { label: 'Twitter', href: '#', icon: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                )},
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-covenant hover:border-covenant transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: "Men's Collection", to: '/men' },
                { label: "Women's Collection", to: '/women' },
                { label: 'Lookbook', to: '/community' },
                { label: 'New Arrivals', to: '/men' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-covenant transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Brand</h4>
            <ul className="space-y-3">
              {[
                { label: 'About NUEL Fashion', to: '/about' },
                { label: 'Community', to: '/community' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-covenant transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Stay in the kingdom loop
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Early access to drops, members-only discounts, and kingdom content.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="
                  flex-1 px-4 py-2.5 text-sm rounded-full
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-white
                  placeholder:text-gray-400
                  focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20
                "
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-covenant text-white text-sm font-semibold rounded-full hover:bg-deep-heaven transition-colors flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ── FOOTER BOTTOM BAR ── */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-5">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400">
            © {year} NUEL Fashion. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-gray-400 hover:text-covenant transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-covenant transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 hover:text-covenant transition-colors">Returns</a>
          </div>
        </div>
      </div>

    </footer>
  )
}
