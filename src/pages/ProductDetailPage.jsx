/**
 * PRODUCT DETAIL PAGE
 * ===================
 * FILE: src/pages/ProductDetailPage.jsx
 * URL:  /product/:id
 *
 * WHAT THIS PAGE SHOWS:
 *   - Product image gallery (main image + extra images)
 *   - Tagline, name, price, story
 *   - Volume tier pricing pills
 *   - Size selector + size guide table
 *   - Quantity selector
 *   - Add to Cart + Save to Wishlist buttons
 *   - Stock status badge
 *   - Features list (selling points)
 *   - Materials + Care tabs
 *   - Delivery & returns info
 *   - Related products grid
 *
 * HOW THE DATA FLOWS:
 *   URL /product/tee-001
 *     → useParams() reads "tee-001"
 *     → useProducts() finds the matching product from cache
 *     → Page renders all the product's fields from Supabase
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

// ─── SMALL HELPER COMPONENTS ────────────────────────────────────────────────

/** Renders a bullet list with a check icon per item */
function BulletList({ items = [], iconColour = 'text-covenant' }) {
  if (!items || items.length === 0) return null
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
          <svg viewBox="0 0 24 24" width="15" height="15"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            className={`flex-shrink-0 mt-0.5 ${iconColour}`}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Skeleton block shown while loading */
function Skeleton({ className = '' }) {
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 rounded-xl animate-shimmer ${className}`} />
  )
}

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id }                   = useParams()
  const navigate                 = useNavigate()
  const { products, isLoading }  = useProducts()
  const { addToCart }            = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { currency, showToast }  = useUI()

  // Local UI state
  const [selectedSize, setSelectedSize]   = useState(null)
  const [qty, setQty]                     = useState(1)
  const [activeImage, setActiveImage]     = useState(0)  // index of the image showing
  const [activeTab, setActiveTab]         = useState('features') // features | materials | care
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  // Find the product whose id matches the URL
  const product = products.find(p => p.id === id)

  // All images: main image_url first, then any extras from the images[] column
  const allImages = [
    product?.image_url,
    ...(Array.isArray(product?.images) ? product.images : []),
  ].filter(Boolean) // remove nulls/undefined

  // Related: same category, different product, max 4
  const related = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  // Set the default size and page title when the product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null)
      document.title = `${product.name} — NUEL Fashion`
    }
  }, [product])

  // Reset qty and active image when navigating to a different product
  useEffect(() => {
    setQty(1)
    setActiveImage(0)
  }, [id])

  // ── LOADING STATE ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <Skeleton className="aspect-[3/3.8]" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <Skeleton key={i} className="w-20 h-20" />)}
            </div>
          </div>
          <div className="space-y-5 pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // ── NOT FOUND STATE ──────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">😔</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Product Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          This product may have sold out or the URL may be incorrect.
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

  // ── HELPER VALUES ────────────────────────────────────────────────────────
  const wishlisted   = isWishlisted(product.id)
  const inStock      = product.in_stock !== false // default true if column missing
  const features     = Array.isArray(product.features)  ? product.features  : []
  const materials    = Array.isArray(product.materials)  ? product.materials : []
  const care         = Array.isArray(product.care)       ? product.care      : []
  const sizeGuide    = Array.isArray(product.size_guide) ? product.size_guide : []
  const tags         = Array.isArray(product.tags)       ? product.tags      : []

  function handleAddToCart() {
    if (!selectedSize) { showToast('Please select a size'); return }
    if (!inStock) { showToast('This item is currently out of stock'); return }
    addToCart(product, selectedSize, qty)
    showToast(`${product.name} added to cart`)
  }

  function handleWishlist() {
    toggleWishlist(product.id)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  // ── PAGE RENDER ──────────────────────────────────────────────────────────
  return (
    <div className="pb-24">

      {/* ── BREADCRUMB ────────────────────────────────────────────────── */}
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
          <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN PRODUCT SECTION
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── LEFT: IMAGE GALLERY ─────────────────────────────────── */}
          <div className="space-y-3">

            {/* Main image */}
            <div className="relative aspect-[3/3.8] rounded-3xl overflow-hidden bg-mist dark:bg-gray-800 flex items-center justify-center">

              {/* Out of stock overlay */}
              {!inStock && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-3xl">
                  <span className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full text-sm tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className={`
                    text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full
                    ${product.badge === 'new'     ? 'bg-covenant text-white'      : ''}
                    ${product.badge === 'limited' ? 'bg-purple-600 text-white'    : ''}
                    ${product.badge === 'sale'    ? 'bg-brand-success text-white' : ''}
                  `}>
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Image or illustration placeholder */}
              {allImages[activeImage] ? (
                <img
                  key={activeImage}
                  src={getImageUrl(allImages[activeImage])}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg viewBox="0 0 200 250" fill="none" className="w-48 h-48 opacity-20">
                  <path d="M65 50L100 35L135 50L150 90L125 90L125 215L75 215L75 90L50 90Z" fill="#185FA5"/>
                  <path d="M50 90L20 110L30 140L65 120L65 90Z" fill="#378ADD"/>
                  <path d="M150 90L180 110L170 140L135 120L135 90Z" fill="#378ADD"/>
                </svg>
              )}
            </div>

            {/* Thumbnail strip — only shown if there are multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                      ${activeImage === i
                        ? 'border-covenant shadow-md scale-105'
                        : 'border-transparent hover:border-grace'
                      }
                    `}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: PRODUCT INFO ─────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Stock + category row */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {product.category}
              </p>
              {inStock ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success inline-block" />
                  In Stock
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-400">Out of Stock</span>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              {product.name}
            </h1>

            {/* Tagline — the one-line selling hook */}
            {product.tagline && (
              <p className="text-base font-medium text-covenant italic mb-5">
                {product.tagline}
              </p>
            )}

            {/* Price + volume tiers */}
            <div className="mb-5">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, currency)}
              </span>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  Buy 2–3: {formatPrice(product.price * 0.9, currency)} each
                </span>
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  Buy 4+: {formatPrice(product.price * 0.8, currency)} each
                </span>
              </div>
            </div>

            {/* Story / long description */}
            {(product.story || product.description) && (
              <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  {product.story || product.description}
                </p>
              </div>
            )}

            {/* Colour swatches */}
            {product.colours?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Available colours
                </p>
                <div className="flex gap-2">
                  {product.colours.map(colour => (
                    <div
                      key={colour}
                      title={colour}
                      style={{ backgroundColor: colourToHex(colour) }}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Size</p>
                {/* Size guide toggle */}
                {sizeGuide.length > 0 && (
                  <button
                    onClick={() => setShowSizeGuide(s => !s)}
                    className="text-xs text-covenant hover:underline font-medium flex items-center gap-1"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 3H3v7l9 9 9-9V3z"/><line x1="9" y1="3" x2="9" y2="10"/>
                    </svg>
                    {showSizeGuide ? 'Hide' : 'View'} Size Guide
                  </button>
                )}
              </div>

              {/* Size buttons */}
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!inStock}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all
                      disabled:opacity-40 disabled:cursor-not-allowed
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

              {/* Fit note */}
              {product.fit && (
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  📐 {product.fit}
                </p>
              )}

              {/* Size guide table */}
              {showSizeGuide && sizeGuide.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-mist dark:bg-gray-800">
                        {Object.keys(sizeGuide[0]).map(col => (
                          <th
                            key={col}
                            className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide border border-grace dark:border-gray-700 capitalize"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuide.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}
                        >
                          {Object.values(row).map((val, j) => (
                            <td
                              key={j}
                              className="px-3 py-2 text-gray-600 dark:text-gray-400 border border-grace dark:border-gray-700"
                            >
                              {j === 0
                                ? <strong className="text-covenant">{val}</strong>
                                : `${val}"`
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-gray-400 mt-1.5">All measurements in inches.</p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-7">
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
            <div className="flex gap-3 flex-wrap mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="
                  flex-1 min-w-[200px] py-4 bg-covenant text-white
                  font-semibold rounded-full text-base
                  hover:bg-deep-heaven active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-covenant focus-visible:ring-offset-2
                "
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
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

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Delivery info */}
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              {[
                { icon: '🚚', text: '3–5 days delivery within Nigeria · 7–14 days internationally' },
                { icon: '↩️', text: 'Free returns within 14 days for unworn items with tags intact' },
                { icon: '🔒', text: 'Secure payment via Paystack — cards, bank transfer, USSD' },
                { icon: '📦', text: 'Branded NUEL packaging with every order' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex-shrink-0 text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PRODUCT DETAILS TABS (Features / Materials / Care)
      ══════════════════════════════════════════════════════════════ */}
      {(features.length > 0 || materials.length > 0 || care.length > 0) && (
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
          <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">

            {/* Tab buttons */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              {[
                { key: 'features',  label: 'Product Features', show: features.length > 0  },
                { key: 'materials', label: 'Materials',         show: materials.length > 0 },
                { key: 'care',      label: 'Care Instructions', show: care.length > 0      },
              ].filter(t => t.show).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-1 px-6 py-4 text-sm font-semibold transition-colors text-center
                    ${activeTab === tab.key
                      ? 'text-covenant border-b-2 border-covenant bg-white dark:bg-gray-950'
                      : 'text-gray-500 dark:text-gray-400 hover:text-covenant'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-8 bg-white dark:bg-gray-950">
              {activeTab === 'features' && (
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">
                    What makes this piece special
                  </h3>
                  <BulletList items={features} />
                </div>
              )}

              {activeTab === 'materials' && (
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">
                    Fabric &amp; Construction
                  </h3>
                  <BulletList items={materials} iconColour="text-holiness" />
                </div>
              )}

              {activeTab === 'care' && (
                <div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">
                    Care Instructions
                  </h3>
                  <BulletList items={care} iconColour="text-gray-400" />
                  <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                    Proper care extends the life of your garment and keeps the print looking sharp.
                    When in doubt, wash cold and hang dry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          RELATED PRODUCTS
      ══════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-8">
          <hr className="border-gray-100 dark:border-gray-800 mb-12" />
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              You may also like
            </h2>
            <Link
              to={`/${product.gender}`}
              className="text-sm text-covenant font-semibold hover:underline hidden sm:block"
            >
              View all →
            </Link>
          </div>
          <ProductGrid products={related} />
        </div>
      )}

    </div>
  )
}
