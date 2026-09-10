/**
 * QUICK VIEW MODAL COMPONENT
 * ==========================
 * FILE: src/components/product/QuickViewModal.jsx
 *
 * WHAT THIS IS:
 *   A popup that shows product details without leaving the
 *   current page. Opens when the eye icon is clicked on a product card.
 *
 *   The customer can select size, choose quantity, and add to cart
 *   all without navigating away from the product grid.
 */

import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useUI }               from '../../store/UIContext'
import { useCart }             from '../../store/CartContext'
import { useWishlist }         from '../../store/WishlistContext'
import { useProducts }         from '../../hooks/useProducts'
import { formatPrice }         from '../../utils/currency.js'
import { getImageUrl }         from '../../services/products.js'
import { clamp }               from '../../utils/helpers.js'

export default function QuickViewModal() {
  const { drawers, closeQuickView, quickViewProductId, currency, showToast } = useUI()
  const { addToCart }     = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { products }      = useProducts()
  const navigate          = useNavigate()

  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty]                   = useState(1)

  const isOpen  = drawers.quickview
  const product = products.find(p => p.id === quickViewProductId)

  // Reset selections when modal opens with a new product
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null)
      setQty(1)
    }
  }, [quickViewProductId])

  if (!isOpen || !product) return null

  const imageUrl   = getImageUrl(product.image_url)
  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    if (!selectedSize) { showToast('Please select a size'); return }
    addToCart(product, selectedSize, qty)
    showToast(`${product.name} added to cart`)
    closeQuickView()
  }

  function handleViewFull() {
    closeQuickView()
    navigate(`/product/${product.id}`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">

          {/* Image */}
          <div className="aspect-[3/3.8] bg-mist dark:bg-gray-800 rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 60 75" fill="none" className="w-24 h-24 opacity-20">
                <path d="M20 15L30 10L40 15L44 28L36 28L36 65L24 65L24 28L16 28Z" fill="#185FA5"/>
              </svg>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h2>

            {product.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{product.description}</p>
            )}

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-covenant">{formatPrice(product.price, currency)}</span>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-2 py-0.5">
                  2–3: {formatPrice(product.price * 0.9, currency)}
                </span>
                <span className="text-[10px] font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-2 py-0.5">
                  4+: {formatPrice(product.price * 0.8, currency)}
                </span>
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-lg border transition-all
                      ${selectedSize === size
                        ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</p>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full w-fit overflow-hidden">
                <button onClick={() => setQty(q => clamp(q - 1, 1, 99))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-white">{qty}</span>
                <button onClick={() => setQty(q => clamp(q + 1, 1, 99))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-lg">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto flex-wrap">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist') }}
                aria-label="Toggle wishlist"
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${wishlisted ? 'border-covenant text-covenant' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-covenant hover:text-covenant'}`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <button
              onClick={handleViewFull}
              className="mt-3 text-sm text-covenant hover:underline text-center"
            >
              View full product details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
