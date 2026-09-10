/**
 * PRODUCT CARD COMPONENT
 * ======================
 * FILE: src/components/product/ProductCard.jsx
 *
 * WHAT THIS IS:
 *   A single product card — the building block of every product grid.
 *   Shows the product image, name, price, size selector, and action buttons.
 *   Used on: Home (featured), Men page, Women page, Search results.
 *
 * PROPS:
 *   product - The product object from Supabase
 *
 * EXAMPLE PRODUCT OBJECT:
 *   {
 *     id: 'tee-001',
 *     name: 'Rooted in Love Tee',
 *     price: 15000,
 *     category: 'tee',
 *     sizes: ['XS', 'S', 'M', 'L', 'XL'],
 *     colours: ['covenant', 'holiness'],
 *     image_url: 'rooted-tee.jpg',
 *     badge: 'new',
 *   }
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../store/CartContext'
import { useWishlist } from '../../store/WishlistContext'
import { useUI } from '../../store/UIContext'
import { formatPrice } from '../../utils/currency.js'
import { colourToHex } from '../../utils/helpers.js'
import { getImageUrl } from '../../services/products.js'

// Heart icon (filled or outline depending on wishlist status)
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

// Eye icon for quick view
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

// Badge colours
const badgeStyles = {
  new:     'bg-covenant text-white',
  limited: 'bg-purple-600 text-white',
  sale:    'bg-brand-success text-white',
}

export default function ProductCard({ product }) {
  const navigate            = useNavigate()
  const { addToCart }       = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { currency, openQuickView, showToast } = useUI()

  // Track which size is selected on this card
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M')

  const wishlisted = isWishlisted(product.id)
  const imageUrl   = getImageUrl(product.image_url)

  // Prices for volume tier display on the card
  const tier2Price = formatPrice(product.price * 0.9, currency)
  const tier3Price = formatPrice(product.price * 0.8, currency)

  function handleAddToCart(e) {
    e.stopPropagation() // prevent navigating to product page
    addToCart(product, selectedSize)
    showToast(`${product.name} added to cart`)
  }

  function handleWishlist(e) {
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  function handleQuickView(e) {
    e.stopPropagation()
    openQuickView(product.id)
  }

  function handleCardClick() {
    navigate(`/product/${product.id}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className="
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-2xl overflow-hidden
        shadow-sm hover:shadow-md
        hover:-translate-y-1
        transition-all duration-200
        cursor-pointer group
        relative
      "
    >
      {/* ── PRODUCT IMAGE ─────────────────────────────────────────────── */}
      <div className="relative aspect-[3/3.5] bg-mist dark:bg-gray-800 overflow-hidden">

        {/* Badge (NEW / LIMITED / SALE) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`
              text-[10px] font-bold uppercase tracking-wide
              px-2 py-1 rounded-full
              ${badgeStyles[product.badge] || 'bg-covenant text-white'}
            `}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Product image or placeholder */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Placeholder when no image is uploaded yet
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 60 75" fill="none" className="w-20 h-20 opacity-20">
              <path d="M20 15L30 10L40 15L44 28L36 28L36 65L24 65L24 28L16 28Z"
                fill="#185FA5"/>
              <path d="M16 28L7 34L10 43L21 37L21 28Z" fill="#378ADD" opacity="0.7"/>
              <path d="M44 28L53 34L50 43L39 37L39 28Z" fill="#378ADD" opacity="0.7"/>
            </svg>
          </div>
        )}

        {/* Colour swatches (bottom left) */}
        {product.colours?.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.colours.map(colour => (
              <div
                key={colour}
                title={colour}
                className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: colourToHex(colour) }}
              />
            ))}
          </div>
        )}

        {/* Action buttons (wishlist + quick view) — appear on hover */}
        <div className="
          absolute top-3 right-3
          flex flex-col gap-2
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-200
        ">
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`
              w-9 h-9 rounded-full bg-white shadow-md
              flex items-center justify-center
              transition-all duration-150
              hover:bg-covenant hover:text-white
              ${wishlisted ? 'text-covenant' : 'text-gray-400'}
            `}
          >
            <HeartIcon filled={wishlisted} />
          </button>

          {/* Quick view button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick view"
            className="
              w-9 h-9 rounded-full bg-white shadow-md
              flex items-center justify-center text-gray-400
              hover:bg-covenant hover:text-white
              transition-all duration-150
            "
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* ── PRODUCT INFO ──────────────────────────────────────────────── */}
      <div className="p-4 space-y-3">

        {/* Category label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {product.category}
        </p>

        {/* Product name */}
        <h3 className="font-display font-semibold text-base text-gray-900 dark:text-white leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-covenant">
            {formatPrice(product.price, currency)}
          </span>
        </div>

        {/* Volume tier pills */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-2 py-0.5">
            2–3: {tier2Price}
          </span>
          <span className="text-[10px] font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-2 py-0.5">
            4+: {tier3Price}
          </span>
        </div>

        {/* Size selector */}
        <div
          className="flex flex-wrap gap-1.5"
          onClick={e => e.stopPropagation()} // prevent card navigation when clicking sizes
        >
          {product.sizes?.slice(0, 5).map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                text-xs font-medium px-2 py-1 rounded
                border transition-all duration-100
                ${selectedSize === size
                  ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant hover:text-covenant'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="
            w-full py-2.5 px-4 rounded-full
            bg-covenant text-white text-sm font-semibold
            hover:bg-deep-heaven active:scale-[0.98]
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-covenant focus-visible:ring-offset-2
          "
        >
          Add to Cart
        </button>
      </div>
    </article>
  )
}
