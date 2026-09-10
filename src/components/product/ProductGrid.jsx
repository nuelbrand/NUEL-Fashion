/**
 * PRODUCT GRID COMPONENT
 * ======================
 * FILE: src/components/product/ProductGrid.jsx
 *
 * WHAT THIS IS:
 *   A responsive grid that wraps multiple ProductCard components.
 *   Handles three states:
 *     1. Loading → shows skeleton placeholder cards
 *     2. Empty   → shows a "no products" message
 *     3. Loaded  → shows the actual product cards
 *
 * HOW TO USE:
 *   <ProductGrid products={products} isLoading={isLoading} />
 *
 * PROPS:
 *   products  - Array of product objects from useProducts()
 *   isLoading - boolean, true while fetching from Supabase
 *   emptyMessage - custom message when no products match (optional)
 */

import ProductCard from './ProductCard'

// ─── SKELETON CARD ──────────────────────────────────────────────────────────
// Shown while products are loading — gives a "shimmer" placeholder effect
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Image placeholder */}
      <div className="
        aspect-[3/3.5]
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
        bg-[length:200%_100%] animate-shimmer
      " />
      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-shimmer" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 animate-shimmer" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 animate-shimmer" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-shimmer" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-shimmer" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer" />
      </div>
    </div>
  )
}

export default function ProductGrid({
  products    = [],
  isLoading   = false,
  emptyMessage = 'No products match your filters.',
  columns     = 3, // how many columns on desktop (2 or 3)
}) {
  const gridCols = columns === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  // ── LOADING STATE ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`grid ${gridCols} gap-5 lg:gap-6`}>
        {/* Show 6 skeleton cards while loading */}
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // ── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-500">
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="w-12 h-12 mx-auto mb-4 opacity-40"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p className="text-lg font-medium">{emptyMessage}</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    )
  }

  // ── PRODUCTS GRID ─────────────────────────────────────────────────────────
  return (
    <div className={`grid ${gridCols} gap-5 lg:gap-6`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
