/**
 * APP CONFIGURATION
 * =================
 * FILE: src/config/app.config.js
 *
 * This is the single source of truth for all app-wide settings.
 *
 * WHY THIS FILE EXISTS:
 *   Instead of hardcoding values like the Paystack key or
 *   volume discount tiers in 10 different places, we define
 *   them ONCE here. If you ever need to change them, you
 *   only change them in this one file.
 *
 * HOW IT WORKS:
 *   Values starting with import.meta.env.VITE_ come from
 *   your .env file (which you never upload to GitHub).
 *   Cloudflare Pages reads those same values from its
 *   own Environment Variables settings panel.
 */

const CONFIG = {

  // ─── SUPABASE (Your database + auth) ──────────────────────────────────────
  // These come from your .env file. Never hardcode real keys here.
  SUPABASE: {
    url:     import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // ─── PAYSTACK (Payment processing) ────────────────────────────────────────
  PAYSTACK: {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency:  'NGN',
  },

  // ─── CURRENCY ─────────────────────────────────────────────────────────────
  // Exchange rate: NGN to USD conversion
  // In production: replace this with a call to an exchange rate API
  USD_TO_NGN: Number(import.meta.env.VITE_USD_TO_NGN) || 1600,
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'NGN',

  // ─── SUPABASE STORAGE ─────────────────────────────────────────────────────
  // The name of the storage bucket where product images are kept
  IMAGE_BUCKET: import.meta.env.VITE_IMAGE_BUCKET || 'product-images',

  // ─── VOLUME PRICING TIERS ─────────────────────────────────────────────────
  // Defines the bulk discount rules:
  //   Buy 1       → no discount (full price)
  //   Buy 2 or 3  → 10% off every item
  //   Buy 4+      → 20% off every item
  VOLUME_TIERS: [
    { minQty: 1,  maxQty: 1,        discount: 0,    label: 'Full price'  },
    { minQty: 2,  maxQty: 3,        discount: 0.10, label: '10% off'     },
    { minQty: 4,  maxQty: Infinity, discount: 0.20, label: '20% off'     },
  ],

  // ─── NAVIGATION PAGES ─────────────────────────────────────────────────────
  // The main pages shown in the header navigation
  NAV_LINKS: [
    { label: 'Home',      path: '/'          },
    { label: 'Men',       path: '/men'        },
    { label: 'Women',     path: '/women'      },
    { label: 'About',     path: '/about'      },
    { label: 'Community', path: '/community'  },
    { label: 'Contact',   path: '/contact'    },
  ],

  // ─── SEO / META ───────────────────────────────────────────────────────────
  APP_NAME:        'NUEL Fashion',
  APP_TAGLINE:     'What you wear is a declaration.',
  APP_DESCRIPTION: 'NUEL Fashion: Kingdom-first clothing, accessories, and lifestyle products rooted in faith and identity.',
}

export default CONFIG
