/**
 * APP ROOT COMPONENT
 * ==================
 * FILE: src/App.jsx
 *
 * WHAT THIS IS:
 *   The outermost component that wraps the entire application.
 *   Its only job is to set up all the "Providers" (global state containers)
 *   and then hand off to the Router.
 *
 * ORDER MATTERS:
 *   Providers must wrap everything that needs them.
 *   UIContext is outermost because CartContext uses showToast from UIContext
 *   if we ever add toast calls there.
 *
 * THINK OF IT LIKE LAYERS OF AN ONION:
 *   UIProvider        ← theme, currency, drawers, toast
 *     AuthProvider    ← user login state
 *       CartProvider  ← cart items and totals
 *         WishlistProvider ← saved items
 *           AppRouter ← the actual pages
 */

import { UIProvider }      from './store/UIContext'
import { AuthProvider }    from './store/AuthContext'
import { CartProvider }    from './store/CartContext'
import { WishlistProvider } from './store/WishlistContext'
import AppRouter           from './router/index'

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  )
}
