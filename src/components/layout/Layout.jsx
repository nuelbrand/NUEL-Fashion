/**
 * LAYOUT COMPONENT
 * ================
 * FILE: src/components/layout/Layout.jsx
 *
 * WHAT THIS IS:
 *   A wrapper that puts the Header at the top and Footer
 *   at the bottom of every page automatically.
 *
 *   Instead of adding <Header /> and <Footer /> to every
 *   single page component, we wrap all pages in this Layout
 *   once inside the router. Clean and DRY (Don't Repeat Yourself).
 *
 * HOW IT WORKS:
 *   In router/index.jsx, every page route is wrapped in <Layout>.
 *   The {children} is where the specific page content goes.
 *
 * STRUCTURE:
 *   <Layout>
 *     <Header />
 *     <main>{children}</main>  ← your page content goes here
 *     <Footer />
 *   </Layout>
 */

import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import WishlistDrawer from '../cart/WishlistDrawer'
import SearchOverlay from '../ui/SearchOverlay'
import MobileNav from './MobileNav'
import AccountModal from '../ui/AccountModal'
import CheckoutModal from '../checkout/CheckoutModal'
import QuickViewModal from '../product/QuickViewModal'
import Overlay from '../ui/Overlay'
import Toast from '../ui/Toast'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">

      {/* Sticky header — always at top */}
      <Header />

      {/* Page content — grows to fill available space */}
      <main className="flex-1">
        {/*
          <Outlet /> is a React Router concept.
          It renders whichever page the user is currently on.
          Think of it as a "slot" where the page content goes.
        */}
        <Outlet />
      </main>

      {/* Footer — always at bottom */}
      <Footer />

      {/* ── GLOBAL UI LAYERS ──────────────────────────────────────────── */}
      {/* These are rendered outside the page content so they can
          overlay everything. They open/close via UIContext. */}

      <Overlay />         {/* Dark background behind drawers/modals */}
      <CartDrawer />      {/* Slide-out cart */}
      <WishlistDrawer />  {/* Slide-out wishlist */}
      <SearchOverlay />   {/* Full-width search popup */}
      <MobileNav />       {/* Mobile navigation drawer */}
      <AccountModal />    {/* Login / Sign up modal */}
      <CheckoutModal />   {/* Checkout modal with Paystack */}
      <QuickViewModal />  {/* Quick product view modal */}
      <Toast />           {/* "Added to cart" notification */}

    </div>
  )
}
