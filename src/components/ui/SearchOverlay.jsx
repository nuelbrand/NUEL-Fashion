/**
 * SEARCH OVERLAY COMPONENT
 * ========================
 * FILE: src/components/ui/SearchOverlay.jsx
 *
 * WHAT THIS IS:
 *   A full-width search bar that slides down from the top
 *   when the search icon is clicked in the header.
 *
 *   As the user types, it shows live product results.
 *   Clicking a result navigates to that product's page.
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUI }       from '../../store/UIContext'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice } from '../../utils/currency.js'
import { getImageUrl } from '../../services/products.js'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchOverlay() {
  const { drawers, closeDrawer, currency } = useUI()
  const { products } = useProducts()
  const navigate     = useNavigate()
  const inputRef     = useRef(null)

  const [query, setQuery]     = useState('')
  const debouncedQuery        = useDebounce(query, 250)
  const isOpen                = drawers.search

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('') // Clear search when closing
    }
  }, [isOpen])

  // Filter products by debounced query
  const results = debouncedQuery
    ? products.filter(p =>
        p.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 6)
    : []

  function handleResultClick(productId) {
    closeDrawer('search')
    navigate(`/product/${productId}`)
  }

  return (
    <div
      aria-hidden={!isOpen}
      role="search"
      className={`
        fixed top-0 left-0 right-0 z-[1200]
        bg-white dark:bg-gray-950
        border-b border-gray-100 dark:border-gray-800
        shadow-lg
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      {/* Search input row */}
      <div className="max-w-[700px] mx-auto px-6 py-5 flex items-center gap-4">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for tees, hoodies, faith..."
          aria-label="Search products"
          className="
            flex-1 font-display text-2xl bg-transparent
            text-gray-900 dark:text-white
            placeholder:text-gray-300 dark:placeholder:text-gray-600
            placeholder:italic
            outline-none
          "
        />
        <button
          onClick={() => closeDrawer('search')}
          aria-label="Close search"
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="max-w-[700px] mx-auto px-6 pb-6">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.map(product => (
              <button
                key={product.id}
                onClick={() => handleResultClick(product.id)}
                className="flex gap-3 items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 text-left transition-colors"
              >
                {/* Mini thumbnail */}
                <div className="w-12 h-14 flex-shrink-0 rounded-lg bg-mist dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  {getImageUrl(product.image_url) ? (
                    <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-6 h-6 bg-covenant/20 rounded" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate leading-tight">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.category}</p>
                  <p className="text-sm font-bold text-covenant mt-0.5">{formatPrice(product.price, currency)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {debouncedQuery && results.length === 0 && (
        <div className="max-w-[700px] mx-auto px-6 pb-6">
          <p className="text-sm text-gray-400">No products found for "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  )
}
