/**
 * MEN PAGE
 * ========
 * FILE: src/pages/MenPage.jsx
 * URL:  /men
 *
 * WHAT THIS PAGE HAS:
 *   - Page hero (title + subtitle)
 *   - Filter sidebar (category, size, price, colour)
 *   - Product grid (filtered results)
 *   - Result count + mobile filter toggle
 */

import { useState, useEffect } from 'react'
import { useProducts }     from '../hooks/useProducts'
import FilterSidebar       from '../components/filters/FilterSidebar'
import ProductGrid         from '../components/product/ProductGrid'

const DEFAULT_FILTERS = {
  categories: ['tee', 'hoodie', 'co-ord', 'accessory'],
  size:       'all',
  maxPrice:   80000,
  colour:     'all',
}

export default function MenPage() {
  useEffect(() => { document.title = "Men's Collection — NUEL Fashion" }, [])

  const [filters, setFilters]         = useState(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen]   = useState(false)

  const { products, isLoading } = useProducts({
    gender:     'men',
    categories: filters.categories,
    size:       filters.size,
    maxPrice:   filters.maxPrice,
    colour:     filters.colour,
  })

  return (
    <div>

      {/* ── PAGE HERO ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-50 to-mist dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl font-bold text-gray-900 dark:text-white mb-3">Men's Collection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Kingdom style, every day. Drop 01: Foundation.</p>
        </div>
      </div>

      {/* ── SHOP LAYOUT ───────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
        <div className="flex gap-10">

          {/* Filter sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar
              gender="men"
              filters={filters}
              onChange={setFilters}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />
          </div>

          {/* Mobile filter sidebar (portal-style) */}
          <div className="lg:hidden">
            <FilterSidebar
              gender="men"
              filters={filters}
              onChange={setFilters}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLoading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
              </p>
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-covenant hover:text-covenant transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters
              </button>
            </div>

            <ProductGrid products={products} isLoading={isLoading} />
          </div>

        </div>
      </div>
    </div>
  )
}
