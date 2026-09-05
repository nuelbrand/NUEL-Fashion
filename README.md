# NUEL Fashion — E-Commerce Web Application

> *What you wear is a declaration. Make it count.*

A production-ready, multi-page e-commerce application for NUEL Fashion, built as a pure HTML/CSS/JS single-page application (SPA) — no build step, no framework, deployable directly to **Cloudflare Pages**.

---

## Project Structure

```
nuel-fashion/
├── index.html       — Full SPA: all 6 pages, all modals, all drawers
├── style.css        — Complete design system: light/dark themes, all components
├── app.js           — All JavaScript: cart, pricing, auth hooks, checkout, filters
├── _headers         — Cloudflare Pages security headers + cache rules
├── _redirects       — SPA routing fallback
└── README.md        — This file
```

---

## Features

### Core Features
- **6 Pages:** Home (long-form sales), Men, Women, About, Community, Contact
- **Light / Dark Mode** toggle with localStorage persistence
- **Multi-Currency:** NGN (₦) / USD ($) switcher, updates all prices live
- **Tiered Volume Pricing Engine:**
  - Buy 1 → Full price
  - Buy 2–3 → 10% off each
  - Buy 4+ → 20% off each
- **Sticky Header** with scroll detection and full utility bar

### Shopping Experience
- **Cart Drawer** — slide-over with live volume discount calculation
- **Wishlist Drawer** — saved items, persistent across sessions
- **Quick View Modal** — product detail with size and quantity selection
- **Product Filters** — category, size chips, price range slider, colour swatches
- **Search Overlay** — live product filtering as you type

### Backend Hooks (ready to wire up)
- **Supabase Auth** — login/signup modal with full form UI, stubs ready
- **Paystack Checkout** — complete checkout UI flow, payload built, hook ready
- **localStorage** — cart and wishlist persist across sessions

### Content
- **Home:** Hero, volume pricing bar, 5 sales letter sections, testimonials, drop preview, newsletter
- **Men / Women:** Filterable product grids with 14 products across all categories
- **About:** 80/20 audience-first copy with brand ethos and NUEL University pipeline
- **Community:** Lookbook grid, UGC feed, events listing
- **Contact:** Contact form, support info, social links, live agent card, FAQ accordion

---

## Deployment: Cloudflare Pages

### Option A — Drag and Drop
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages
2. Create a new project → Upload → drag the `nuel-fashion/` folder
3. Done. Live in under 60 seconds.

### Option B — GitHub
1. Push this folder to a GitHub repo
2. Connect the repo to Cloudflare Pages
3. Build command: *(none — static site)*
4. Output directory: `/` (or `nuel-fashion/` if the folder is the root)

---

## Integrating Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your Project URL and anon key
3. In `app.js`, update `CONFIG.SUPABASE`:
   ```js
   SUPABASE: {
     url:     'https://your-project.supabase.co',
     anonKey: 'your-anon-key',
   },
   ```
4. Add the Supabase CDN to `index.html` `<head>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
5. In `app.js`, uncomment the real Supabase calls inside `Auth.login()` and `Auth.signup()`
6. Initialize the client:
   ```js
   const supabase = window.supabase.createClient(CONFIG.SUPABASE.url, CONFIG.SUPABASE.anonKey)
   ```

---

## Integrating Paystack

1. Create an account at [paystack.com](https://paystack.com)
2. Copy your **test public key** (`pk_test_...`) from the dashboard
3. In `app.js`, update `CONFIG.PAYSTACK`:
   ```js
   PAYSTACK: {
     publicKey: 'pk_test_your_key_here',
     currency:  'NGN',
   },
   ```
4. Add Paystack Popup.js to `index.html`:
   ```html
   <script src="https://js.paystack.co/v1/inline.js"></script>
   ```
5. In `app.js`, inside `Checkout.initiatePaystack()`, uncomment the real `PaystackPop.setup()` block

---

## Adding Real Products (Supabase)

Create a `products` table in Supabase:
```sql
create table products (
  id          text primary key,
  name        text not null,
  category    text,
  gender      text,
  price       integer,   -- NGN, in full naira
  description text,
  sizes       text[],
  colours     text[],
  badge       text,
  featured    boolean default false,
  image_url   text,
  stock       integer default 0,
  created_at  timestamptz default now()
);
```

Then replace the `PRODUCTS` array in `app.js` with a fetch:
```js
const { data: products } = await supabase.from('products').select('*');
```

---

## Adding Real Product Images

Replace the inline SVG placeholders in `Products.cardHTML()` with:
```js
`<img src="${product.image_url}" alt="${product.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />`
```

---

## Brand Colour Reference

| Name          | Hex       | Usage                        |
|---------------|-----------|------------------------------|
| Deep Heaven   | `#042C53` | Backgrounds, text, logo      |
| Covenant      | `#185FA5` | Primary brand, CTAs          |
| Holiness      | `#378ADD` | Links, accents, highlights   |
| Grace Light   | `#B5D4F4` | Supporting elements          |
| Heavenly Mist | `#E6F1FB` | Backgrounds, cards           |

---

## Content Calendar (Weekly)

| Day       | Topic                        | Format                  | Goal     |
|-----------|------------------------------|-------------------------|----------|
| Monday    | Style tip with kingdom meaning | Outfit photo or reel  | Inspire  |
| Tuesday   | Scripture or identity reflection | Quote graphic       | Teach    |
| Wednesday | Behind-the-scenes            | Short video or story    | Connect  |
| Thursday  | Product feature              | Reel or carousel        | Showcase |
| Friday    | Community feature            | UGC or repost           | Celebrate |

---

*NUEL Fashion — Part of the NUEL Ecosystem. Heaven-sent. Purpose-driven. Rooted in love.*
