/**
 * PRODUCT DETAIL PAGE
 * ===================
 * FILE: src/pages/ProductDetailPage.jsx
 * URL:  /product/:id   (e.g. /product/tee-001)
 *
 * WHAT THIS PAGE SHOWS:
 *   - Large product image
 *   - Product name, category, description
 *   - Price + volume tier pricing
 *   - Size selector
 *   - Quantity selector
 *   - Add to Cart + Save to Wishlist buttons
 *   - Related products (same category)
 *
 * HOW IT GETS THE PRODUCT:
 *   The URL has an :id parameter (e.g. "tee-001").
 *   We read that with useParams(), then find the matching
 *   product from our useProducts() cache.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts }   from '../hooks/useProducts'
import { useCart }       from '../store/CartContext'
import { useWishlist }   from '../store/WishlistContext'
import { useUI }         from '../store/UIContext'
import { formatPrice }   from '../utils/currency.js'
import { getImageUrl }   from '../services/products.js'
import { colourToHex, clamp } from '../utils/helpers.js'
import ProductGrid       from '../components/product/ProductGrid'

export default function ProductDetailPage() {
  const { id }            = useParams()       // gets the product ID from the URL
  const navigate          = useNavigate()
  const { products, isLoading } = useProducts()
  const { addToCart }     = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { currency, showToast } = useUI()

  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty]                   = useState(1)

  // Find the specific product by ID
  const product = products.find(p => p.id === id)

  // Related products: same category, excluding this one, max 4
  const related = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  // Set default size and update page title when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null)
      document.title = `${product.name} — NUEL Fashion`
    }
  }, [product])

  // Reset qty when changing product
  useEffect(() => { setQty(1) }, [id])

  // ── LOADING STATE ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="aspect-[3/3.8] rounded-3xl bg-gray-100 dark:bg-gray-800 animate-shimmer" />
          {/* Text skeletons */}
          <div className="space-y-4 pt-4">
            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded-full animate-shimmer" />
            <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-full animate-shimmer" />
            <div className="h-7 w-1/3 bg-gray-100 dark:bg-gray-800 rounded-full animate-shimmer" />
            <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  // ── PRODUCT NOT FOUND ──────────────────────────────────────────────────
  if (!isLoading && !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Product Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          This product may have sold out or the link may be incorrect.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-7 py-3 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  const imageUrl   = getImageUrl(product.image_url)
  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    if (!selectedSize) { showToast('Please select a size'); return }
    addToCart(product, selectedSize, qty)
    showToast(`${product.name} added to cart`)
  }

  function handleWishlist() {
    toggleWishlist(product.id)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="pb-20">

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-covenant transition-colors">Home</Link>
          <span>/</span>
          <Link
            to={`/${product.gender}`}
            className="hover:text-covenant transition-colors capitalize"
          >
            {product.gender}
          </Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* ── MAIN PRODUCT SECTION ────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

          {/* ── PRODUCT IMAGE ───────────────────────────────────────── */}
          <div className="relative">
            <div className="aspect-[3/3.8] rounded-3xl overflow-hidden bg-mist dark:bg-gray-800 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder illustration */
                <svg viewBox="0 0 200 250" fill="none" className="w-48 h-48 opacity-20">
                  <path d="M65 50L100 35L135 50L150 90L125 90L125 215L75 215L75 90L50 90Z" fill="#185FA5"/>
                  <path d="M50 90L20 110L30 140L65 120L65 90Z" fill="#378ADD"/>
                  <path d="M150 90L180 110L170 140L135 120L135 90Z" fill="#378ADD"/>
                </svg>
              )}
            </div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className={`
                  text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full
                  ${product.badge === 'new' ? 'bg-covenant text-white' : ''}
                  ${product.badge === 'limited' ? 'bg-purple-600 text-white' : ''}
                  ${product.badge === 'sale' ? 'bg-brand-success text-white' : ''}
                `}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO ─────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-covenant">
                {formatPrice(product.price, currency)}
              </span>

              {/* Volume tier pills */}
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  2–3 items: {formatPrice(product.price * 0.9, currency)} each
                </span>
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  4+ items: {formatPrice(product.price * 0.8, currency)} each
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Colour dots */}
            {product.colours?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Available in
                </p>
                <div className="flex gap-2">
                  {product.colours.map(colour => (
                    <div
                      key={colour}
                      title={colour}
                      style={{ backgroundColor: colourToHex(colour) }}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all
                      ${selectedSize === size
                        ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10 font-semibold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant hover:text-covenant'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quantity</p>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full w-fit overflow-hidden">
                <button
                  onClick={() => setQty(q => clamp(q - 1, 1, 99))}
                  aria-label="Decrease quantity"
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-xl"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-semibold text-gray-900 dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => clamp(q + 1, 1, 99))}
                  aria-label="Increase quantity"
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                className="
                  flex-1 min-w-[200px] py-4 bg-covenant text-white
                  font-semibold rounded-full text-base
                  hover:bg-deep-heaven active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-covenant focus-visible:ring-offset-2
                "
              >
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`
                  w-14 h-14 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${wishlisted
                    ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-covenant hover:text-covenant'
                  }
                `}
              >
                <svg viewBox="0 0 24 24" width="20" height="20"
                  fill={wishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Delivery + returns info */}
            <div className="mt-8 space-y-3 pt-8 border-t border-gray-100 dark:border-gray-800">
              {[
                { icon: '🚚', text: '3–5 days delivery in Nigeria · 7–14 days internationally' },
                { icon: '↩️', text: 'Free returns within 14 days for unworn items' },
                { icon: '🔒', text: 'Secure payment via Paystack' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-16">
          <hr className="border-gray-100 dark:border-gray-800 mb-12" />
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
            You may also like
          </h2>
          <ProductGrid products={related} />
        </div>
      )}

    </div>
  )
}
