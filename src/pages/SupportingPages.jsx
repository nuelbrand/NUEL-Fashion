/**
 * SUPPORTING PAGES BUNDLE
 * =======================
 * This file contains the remaining smaller pages:
 *
 *   LoginPage         → /login
 *   RegisterPage      → /register
 *   ProfilePage       → /account/profile
 *   OrderHistoryPage  → /account/orders
 *   WishlistPage      → /account/wishlist
 *   NotFoundPage      → any unmatched URL (404)
 *
 * Each is its own exported component, imported individually
 * by the router (src/router/index.jsx).
 *
 * They are bundled here for conciseness — in a larger project
 * each would live in its own file in src/pages/ or src/pages/account/.
 */

import { useEffect, useState } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { useAuth }             from '../store/AuthContext'
import { useUI }               from '../store/UIContext'
import { useWishlist }         from '../store/WishlistContext'
import { useCart }             from '../store/CartContext'
import { useProducts }         from '../hooks/useProducts'
import { formatPrice }         from '../utils/currency.js'
import { formatDate }          from '../utils/helpers.js'
import { getOrdersByUser }     from '../services/orders.js'
import { getImageUrl }         from '../services/products.js'
import ProductGrid             from '../components/product/ProductGrid'

/* ============================================================
   LOGIN PAGE
   ============================================================ */
export function LoginPage() {
  useEffect(() => { document.title = 'Sign In — NUEL Fashion' }, [])

  const { login, isLoggedIn } = useAuth()
  const { showToast }         = useUI()
  const navigate              = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  // If already logged in, redirect to profile
  useEffect(() => {
    if (isLoggedIn) navigate('/account/profile')
  }, [isLoggedIn, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await login(email, password)
    setLoading(false)
    if (error) { showToast(error); return }
    navigate('/account/profile')
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20"

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-deep-heaven rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-xl font-bold text-grace">N</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400">Sign in to your NUEL account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-covenant font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   REGISTER PAGE
   ============================================================ */
export function RegisterPage() {
  useEffect(() => { document.title = 'Create Account — NUEL Fashion' }, [])

  const { signup, isLoggedIn } = useAuth()
  const { showToast }          = useUI()
  const navigate               = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/account/profile')
  }, [isLoggedIn, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signup(name, email, password)
    setLoading(false)
    if (error) { showToast(error); return }
    showToast('Account created! Check your email to verify.')
    navigate('/account/profile')
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20"

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-deep-heaven rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-xl font-bold text-grace">N</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Join the movement</h1>
          <p className="text-sm text-gray-400">Create your NUEL Fashion account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', type: 'text',     value: name,     set: setName,     placeholder: 'Your name' },
            { label: 'Email',     type: 'email',    value: email,    set: setEmail,    placeholder: 'you@example.com' },
            { label: 'Password',  type: 'password', value: password, set: setPassword, placeholder: 'Create a password (min 6 chars)' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">{field.label}</label>
              <input type={field.type} required value={field.value} onChange={e => field.set(e.target.value)} placeholder={field.placeholder} className={inputClass} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven disabled:opacity-50 transition-colors">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-covenant font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   PROFILE PAGE  (/account/profile)
   ============================================================ */
export function ProfilePage() {
  useEffect(() => { document.title = 'My Profile — NUEL Fashion' }, [])

  const { user, logout } = useAuth()
  const { showToast }    = useUI()
  const navigate         = useNavigate()

  async function handleLogout() {
    await logout()
    showToast('Signed out successfully')
    navigate('/')
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 md:px-8 py-16">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>

      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-covenant flex items-center justify-center text-white text-2xl font-bold">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.user_metadata?.full_name || 'NUEL Member'}
            </p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Order History', to: '/account/orders' },
            { label: 'My Wishlist',   to: '/account/wishlist' },
          ].map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-covenant hover:text-covenant transition-colors text-center"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:border-brand-error hover:text-brand-error transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}

/* ============================================================
   ORDER HISTORY PAGE  (/account/orders)
   ============================================================ */
export function OrderHistoryPage() {
  useEffect(() => { document.title = 'Order History — NUEL Fashion' }, [])

  const { user }          = useAuth()
  const { currency }      = useUI()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getOrdersByUser(user.id)
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account/profile" className="text-gray-400 hover:text-covenant transition-colors">
          ← Back
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Order History</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-shimmer"/>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-4">No orders yet</p>
          <Link to="/men" className="px-6 py-2.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors text-sm inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order · {order.paystack_ref}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-covenant">{formatPrice(order.total, currency)}</p>
                  <span className="text-xs bg-brand-success/10 text-brand-success font-semibold px-2 py-0.5 rounded-full capitalize">{order.status}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {Array.isArray(order.items) ? order.items.length : 0} item{order.items?.length !== 1 ? 's' : ''}
                {order.address && ` · Delivered to ${order.address.slice(0, 40)}...`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   WISHLIST PAGE  (/account/wishlist)
   ============================================================ */
export function WishlistPage() {
  useEffect(() => { document.title = 'My Wishlist — NUEL Fashion' }, [])

  const { wishlistIds }  = useWishlist()
  const { products }     = useProducts()

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id))

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account/profile" className="text-gray-400 hover:text-covenant transition-colors">← Back</Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
          My Wishlist {wishlistIds.length > 0 && <span className="text-covenant">({wishlistIds.length})</span>}
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-4">No saved items yet</p>
          <Link to="/men" className="px-6 py-2.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors text-sm inline-block">
            Explore Collection
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </div>
  )
}

/* ============================================================
   NOT FOUND PAGE  (404)
   ============================================================ */
export function NotFoundPage() {
  useEffect(() => { document.title = '404 — NUEL Fashion' }, [])
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="font-display text-8xl font-bold text-gray-100 dark:text-gray-800 mb-6 select-none">
        404
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm leading-relaxed">
        This page doesn't exist or may have been moved. Let's get you back to the collection.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-full hover:border-covenant hover:text-covenant transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
