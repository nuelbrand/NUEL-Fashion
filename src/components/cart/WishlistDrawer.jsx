/**
 * WISHLIST DRAWER COMPONENT
 * =========================
 * FILE: src/components/cart/WishlistDrawer.jsx
 *
 * WHAT THIS IS:
 *   The slide-out panel from the right that shows products
 *   the customer has saved to their wishlist (heart icon).
 *
 *   Each item has an "Add to Cart" button so the customer
 *   can move items from wishlist to cart in one click.
 */

import { useWishlist } from '../../store/WishlistContext'
import { useCart }     from '../../store/CartContext'
import { useUI }       from '../../store/UIContext'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice } from '../../utils/currency.js'
import { getImageUrl } from '../../services/products.js'

export default function WishlistDrawer() {
  const { wishlistIds, toggleWishlist } = useWishlist()
  const { addToCart }                   = useCart()
  const { drawers, closeDrawer, currency, showToast } = useUI()

  // Get all products so we can look up wishlist items by ID
  const { products } = useProducts()
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id))

  const isOpen  = drawers.wishlist
  const isEmpty = wishlistProducts.length === 0

  function handleAddToCart(product) {
    addToCart(product, product.sizes?.[0] || 'M')
    showToast(`${product.name} added to cart`)
  }

  function handleRemove(productId, productName) {
    toggleWishlist(productId)
    showToast(`${productName} removed from wishlist`)
  }

  return (
    <aside
      aria-label="Wishlist"
      aria-hidden={!isOpen}
      className={`
        fixed top-0 right-0 h-full w-full max-w-sm
        bg-white dark:bg-gray-950
        z-[1050] flex flex-col shadow-2xl
        transition-transform duration-350 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
          Saved Items {wishlistIds.length > 0 && (
            <span className="text-covenant">({wishlistIds.length})</span>
          )}
        </h2>
        <button
          onClick={() => closeDrawer('wishlist')}
          aria-label="Close wishlist"
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 text-gray-400">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-30">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p className="text-lg font-medium mb-4">No saved items yet</p>
            <button
              onClick={() => closeDrawer('wishlist')}
              className="px-6 py-2.5 bg-covenant text-white text-sm font-semibold rounded-full hover:bg-deep-heaven transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistProducts.map(product => {
              const imageUrl = getImageUrl(product.image_url)
              return (
                <div key={product.id} className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">

                  {/* Thumbnail */}
                  <div className="w-16 h-20 flex-shrink-0 rounded-xl bg-mist dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <svg viewBox="0 0 60 75" fill="none" className="w-8 h-8 opacity-25">
                        <path d="M20 15L30 10L40 15L44 28L36 28L36 65L24 65L24 28L16 28Z" fill="#185FA5"/>
                      </svg>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.category}</p>
                    <p className="text-sm font-bold text-covenant mt-1">
                      {formatPrice(product.price, currency)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-2 px-4 py-1.5 bg-covenant text-white text-xs font-semibold rounded-full hover:bg-deep-heaven transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="flex-shrink-0 text-gray-300 hover:text-brand-error transition-colors self-start mt-1"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
