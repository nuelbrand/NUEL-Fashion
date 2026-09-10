/**
 * ROUTER
 * ======
 * FILE: src/router/index.jsx
 *
 * Maps every URL to its page component.
 * All pages are wrapped in <Layout> which provides Header + Footer.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Layout            from '../components/layout/Layout'
import ProtectedRoute    from './ProtectedRoute'

// Main pages
import HomePage          from '../pages/HomePage'
import MenPage           from '../pages/MenPage'
import WomenPage         from '../pages/WomenPage'
import AboutPage         from '../pages/AboutPage'
import CommunityPage     from '../pages/CommunityPage'
import ContactPage       from '../pages/ContactPage'
import ProductDetailPage from '../pages/ProductDetailPage'

// Supporting pages (login, register, account, 404)
import {
  LoginPage,
  RegisterPage,
  ProfilePage,
  OrderHistoryPage,
  WishlistPage,
  NotFoundPage,
} from '../pages/SupportingPages'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // ── Public pages ────────────────────────────────────────────────
      { path: '/',            element: <HomePage /> },
      { path: '/men',         element: <MenPage /> },
      { path: '/women',       element: <WomenPage /> },
      { path: '/about',       element: <AboutPage /> },
      { path: '/community',   element: <CommunityPage /> },
      { path: '/contact',     element: <ContactPage /> },
      { path: '/product/:id', element: <ProductDetailPage /> },
      { path: '/login',       element: <LoginPage /> },
      { path: '/register',    element: <RegisterPage /> },

      // ── Protected pages (must be logged in) ─────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/account/profile', element: <ProfilePage /> },
          { path: '/account/orders',  element: <OrderHistoryPage /> },
          { path: '/account/wishlist',element: <WishlistPage /> },
        ],
      },

      // ── 404 ─────────────────────────────────────────────────────────
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
