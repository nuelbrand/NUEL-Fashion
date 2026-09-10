# NUEL Fashion — Developer Guide

**React + Vite + Tailwind CSS + Supabase + Paystack**
Deployed via GitHub → Cloudflare Pages

---

## What This Project Is

NUEL Fashion is a kingdom-first clothing brand website built with:

| Tool | What it does |
|------|-------------|
| **React** | Builds the user interface as reusable components |
| **Vite** | Runs the dev server and builds for production |
| **Tailwind CSS** | Styles everything using utility classes |
| **Supabase** | Stores products, handles user accounts |
| **Paystack** | Processes payments securely |
| **Cloudflare Pages** | Hosts the live website |

---

## First-Time Setup

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org) — install the LTS version.

### 2. Clone the project
```bash
git clone https://github.com/YOUR_USERNAME/nuel-fashion.git
cd nuel-fashion
```

### 3. Install dependencies
```bash
npm install
```
This reads `package.json` and downloads all required packages into `node_modules/`.

### 4. Set up environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in your real values:
- Get Supabase keys from: supabase.com → Your Project → Settings → API
- Get Paystack key from: dashboard.paystack.com → Settings → API Keys

### 5. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
The site auto-refreshes whenever you save a file.

---

## Project Structure (Quick Reference)

```
nuel-fashion/
├── src/
│   ├── pages/          ← One file per URL (/men → MenPage.jsx)
│   ├── components/     ← Reusable building blocks
│   │   ├── layout/     ← Header, Footer, Layout wrapper
│   │   ├── product/    ← ProductCard, ProductGrid, QuickView
│   │   ├── cart/       ← CartDrawer, WishlistDrawer
│   │   ├── checkout/   ← CheckoutModal
│   │   ├── filters/    ← FilterSidebar
│   │   └── ui/         ← Toast, Overlay, SearchOverlay, AccountModal
│   ├── store/          ← Global state (Context files)
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── UIContext.jsx
│   ├── services/       ← External API calls
│   │   ├── supabase.js ← Database connection
│   │   ├── products.js ← Load products from Supabase
│   │   ├── auth.js     ← Login, signup, logout
│   │   ├── orders.js   ← Save orders after payment
│   │   └── payments.js ← Paystack payment flow
│   ├── hooks/          ← Custom React hooks
│   ├── utils/          ← Helper functions
│   ├── config/         ← App settings (keys, tiers)
│   ├── router/         ← URL → page mapping
│   ├── styles/         ← Global CSS + Tailwind
│   ├── App.jsx         ← Root component
│   └── main.jsx        ← Entry point
├── public/
│   └── _redirects      ← Cloudflare routing fix
├── index.html          ← HTML shell
├── vite.config.js      ← Build tool settings
├── tailwind.config.js  ← Brand colours + fonts
└── .env.example        ← Required environment variables
```

---

## Adding a Product

Products live in your **Supabase database**.

1. Go to [supabase.com](https://supabase.com) → Your project → Table Editor
2. Open the `products` table
3. Click **Insert row** and fill in:

| Column | Example | Notes |
|--------|---------|-------|
| `id` | `tee-001` | Unique slug, no spaces |
| `name` | `Rooted in Love Tee` | Product name |
| `price` | `15000` | In Naira (NGN), no currency symbol |
| `category` | `tee` | tee / hoodie / co-ord / accessory / dress / gift |
| `gender` | `men` | men / women |
| `sizes` | `["XS","S","M","L","XL"]` | JSON array |
| `colours` | `["covenant","holiness"]` | JSON array of NUEL colour names |
| `image_url` | `rooted-tee.jpg` | Filename in Supabase Storage bucket |
| `badge` | `new` | new / limited / sale (or leave empty) |
| `featured` | `true` | Shows on homepage featured section |
| `description` | `100% cotton...` | Product description |

---

## Deploying to Cloudflare Pages

### One-time setup:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)

3. Click **Create a project** → **Connect to Git**

4. Select your `nuel-fashion` repository

5. Configure the build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

6. Add Environment Variables (same as your `.env` file):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PAYSTACK_PUBLIC_KEY`
   - `VITE_USD_TO_NGN`

7. Click **Save and Deploy**

### After that:
Every time you push to GitHub, Cloudflare automatically rebuilds and deploys. No manual uploads needed.

---

## Common Tasks

### Change a page's content
Edit the matching file in `src/pages/`. Save and the browser updates instantly.

### Change a colour
Edit `tailwind.config.js` → `theme.extend.colors`. All components using that colour update automatically.

### Add a new page
1. Create `src/pages/NewPage.jsx`
2. Add a route in `src/router/index.jsx`:
   ```jsx
   { path: '/new-page', element: <NewPage /> }
   ```
3. Add a link in `src/config/app.config.js` → `NAV_LINKS`

### Update Paystack to live mode
In your `.env` file (and in Cloudflare Environment Variables), change:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your-live-key-here
```

---

## Key Files for Beginners

If you're learning the codebase, start here (in this order):

1. `src/config/app.config.js` — understand what keys and settings exist
2. `src/store/CartContext.jsx` — understand how global state works
3. `src/components/product/ProductCard.jsx` — understand a React component
4. `src/pages/HomePage.jsx` — understand how a full page is built
5. `src/router/index.jsx` — understand how URLs map to pages

---

## Support

For help with this codebase, contact the development team.
For Supabase issues: [supabase.com/docs](https://supabase.com/docs)
For Paystack issues: [paystack.com/docs](https://paystack.com/docs)
