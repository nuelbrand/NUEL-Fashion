/**
 * CART DRAWER COMPONENT
 * =====================
 * FILE: src/components/cart/CartDrawer.jsx
 *
 * WHAT THIS IS:
 *   The slide-out panel from the right side of the screen
 *   that shows the customer's cart contents.
 *
 *   It includes:
 *   - Volume discount banner (encourages buying more)
 *   - List of cart items (with qty controls and remove button)
 *   - Order summary (subtotal, discount, total)
 *   - "Proceed to Checkout" button
 *
 * HOW IT OPENS:
 *   When the user clicks the shopping bag icon in the Header,
 *   UIContext.openDrawer('cart') is called.
 *   This component reads drawers.cart from UIContext to know
 *   whether to slide in or stay hidden.
 */

import { useCart } from '../../store/CartContext'
import { useUI } from '../../store/UIContext'
import { useWishlist } from '../../store/WishlistContext'
import { formatPrice } from '../../utils/currency.js'
import { getVolumeBannerMessage } from '../../utils/volumePricing.js'
import { getImageUrl } from '../../services/products.js'

// ─── CART ITEM ROW ──────────────────────────────────────────────────────────
function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart()
  const { currency }                  = useUI()

  const { product, size, qty } = item
  const imageUrl = getImageUrl(product?.image_url)

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">

      {/* Product thumbnail */}
      <div className="w-18 h-22 flex-shrink-0 rounded-xl bg-mist dark:bg-gray-800 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <svg viewBox="0 0 60 75" fill="none" className="w-10 h-10 opacity-25">
            <path d="M20 15L30 10L40 15L44 28L36 28L36 65L24 65L24 28L16 28Z" fill="#185FA5"/>
          </svg>
        )}
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {product?.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Size: {size}</p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
            <button
              onClick={() => updateQty(product?.id, size, qty - 1)}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-lg text-gray-600 dark:text-gray-300 hover:bg-covenant hover:text-white transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white">
              {qty}
            </span>
            <button
              onClick={() => updateQty(product?.id, size, qty + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-lg text-gray-600 dark:text-gray-300 hover:bg-covenant hover:text-white transition-colors"
            >
              +
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeFromCart(product?.id, size)}
            aria-label="Remove item"
            className="text-gray-300 hover:text-brand-error transition-colors"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Item price */}
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-covenant">
          {formatPrice(product?.price * qty, currency)}
        </span>
      </div>
    </div>
  )
}

// ─── MAIN CART DRAWER ───────────────────────────────────────────────────────
export default function CartDrawer() {
  const { cartItems, totalQty, subtotal, discount, total } = useCart()
  const { drawers, closeDrawer, openDrawer, currency }     = useUI()

  const isOpen  = drawers.cart
  const isEmpty = cartItems.length === 0

  function handleCheckout() {
    closeDrawer('cart')
    setTimeout(() => openDrawer('checkout'), 300)
  }

  return (
    <aside
      aria-label="Shopping cart"
      aria-hidden={!isOpen}
      className={`
        fixed top-0 right-0 h-full w-full max-w-sm
        bg-white dark:bg-gray-950
        z-[1050] flex flex-col
        shadow-2xl
        transition-transform duration-350 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
          Your Cart {totalQty > 0 && <span className="text-covenant">({totalQty})</span>}
        </h2>
        <button
          onClick={() => closeDrawer('cart')}
          aria-label="Close cart"
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── VOLUME DISCOUNT BANNER ── */}
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-deep-heaven to-covenant text-white text-sm font-medium flex-shrink-0">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span>{getVolumeBannerMessage(totalQty)}</span>
      </div>

      {/* ── CART BODY ── */}
      <div className="flex-1 overflow-y-auto px-6">
        {isEmpty ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center py-16 text-gray-400">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-30">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-lg font-medium mb-4">Your cart is empty</p>
            <button
              onClick={() => closeDrawer('cart')}
              className="px-6 py-2.5 bg-covenant text-white text-sm font-semibold rounded-full hover:bg-deep-heaven transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart items list
          cartItems.map(item => (
            <CartItem key={`${item.id}-${item.size}`} item={item} />
          ))
        )}
      </div>

      {/* ── CART FOOTER (totals + checkout) ── */}
      {!isEmpty && (
        <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0 space-y-3">

          {/* Subtotal row */}
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal, currency)}</span>
          </div>

          {/* Discount row (hidden if no discount) */}
          {discount > 0 && (
            <div className="flex justify-between text-sm text-brand-success font-medium">
              <span>Volume Discount</span>
              <span>−{formatPrice(discount, currency)}</span>
            </div>
          )}

          {/* Total row */}
          <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total</span>
            <span className="text-covenant">{formatPrice(total, currency)}</span>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* Security note */}
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Secured by Paystack
          </p>
        </div>
      )}
    </aside>
  )
}
