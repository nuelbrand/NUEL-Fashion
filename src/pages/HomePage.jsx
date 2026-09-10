/**
 * HOME PAGE
 * =========
 * FILE: src/pages/HomePage.jsx
 * URL:  /
 *
 * SECTIONS ON THIS PAGE (top to bottom):
 *   1. Hero            — headline, CTA buttons, brand image
 *   2. Volume Pricing Bar — explains bulk discount tiers
 *   3. Identity Section   — brand values (Gentleness, Love, Joy)
 *   4. Featured Products  — 4 featured products from Supabase
 *   5. Quality Section    — material + quality stats
 *   6. Drop Countdown     — upcoming Drop 02: Peace teaser
 *   7. Testimonials       — social proof from customers
 *   8. Gift Sets          — lifestyle + gifting section
 *   9. Final CTA          — scarcity + urgency close
 *  10. Newsletter Strip   — email capture
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUI }       from '../store/UIContext'
import { useProducts } from '../hooks/useProducts'
import { formatPrice } from '../utils/currency.js'
import ProductGrid     from '../components/product/ProductGrid'

// ─── SEO helper: update page title ──────────────────────────────────────────
function usePageTitle(title) {
  useEffect(() => { document.title = title }, [title])
}

export default function HomePage() {
  usePageTitle('NUEL Fashion — What You Wear Is A Declaration')

  const navigate            = useNavigate()
  const { currency, openDrawer, showToast } = useUI()
  const { products, isLoading } = useProducts({ featured: true, limit: 4 })

  function handleNewsletterSubmit(e) {
    e.preventDefault()
    const input = e.target.querySelector('input[type="email"]')
    if (input?.value) {
      showToast('You are on the list! Watch your inbox for kingdom drops.')
      input.value = ''
    }
  }

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative md:min-h-[calc(100vh-68px)] flex flex-col bg-white dark:bg-gray-950 overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-covenant/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-holiness/5 rounded-full translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="flex-1 max-w-[1240px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 w-full">

          {/* Copy */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-covenant mb-4">
              Kingdom Culture. Every Day.
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-5">
              What you wear<br />
              <em className="italic text-covenant">is a declaration.</em>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-[48ch] leading-relaxed mb-8">
              NUEL Fashion turns everyday style into a kingdom statement.
              Faith made visible, wearable, and irresistibly beautiful.
            </p>
            <div className="flex gap-4 flex-wrap mb-7">
              <button
                onClick={() => navigate('/men')}
                className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-all hover:-translate-y-0.5 hover:shadow-lg text-base"
              >
                Shop Men
              </button>
              <button
                onClick={() => navigate('/women')}
                className="px-8 py-3.5 border-2 border-covenant text-covenant font-semibold rounded-full hover:bg-covenant hover:text-white transition-all text-base"
              >
                Shop Women
              </button>
            </div>
            {/* Trust signals */}
            <div className="flex gap-5 flex-wrap">
              {['Faith-forward design', 'Premium quality', 'Kingdom message'].map(item => (
                <span key={item} className="flex items-center gap-2 text-sm text-gray-400">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#14A060" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Drop 01 badge */}
              <div className="absolute -top-4 left-2 z-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 shadow-md">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Drop 01</p>
                <p className="text-sm font-bold text-covenant">Foundation</p>
              </div>

              {/* Clothing illustration */}
              <div className="w-full aspect-[3/3.8] bg-gradient-to-br from-mist to-grace/50 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center border border-grace/30">
                <svg viewBox="0 0 340 420" fill="none" className="w-5/6">
                  <path d="M120 80L170 60L220 80L240 130L200 130L200 340L140 340L140 130L100 130Z" fill="#185FA5" opacity="0.55"/>
                  <path d="M100 130L60 160L80 200L120 175L120 130Z" fill="#378ADD" opacity="0.5"/>
                  <path d="M240 130L280 160L260 200L220 175L220 130Z" fill="#378ADD" opacity="0.5"/>
                  <text x="170" y="235" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="13" fill="#042C53" opacity="0.85">Rooted in Love</text>
                  <text x="170" y="255" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="9" fill="#185FA5" opacity="0.7" letterSpacing="2">NUEL FASHION</text>
                  <line x1="165" y1="185" x2="175" y2="185" stroke="#042C53" strokeWidth="2" opacity="0.4"/>
                  <line x1="170" y1="180" x2="170" y2="190" stroke="#042C53" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>

              {/* Price badge */}
              <div className="absolute -bottom-4 right-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">From ₦15,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex justify-center pb-8 text-gray-300 dark:text-gray-600 animate-bounce-gentle">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. VOLUME PRICING BAR
      ══════════════════════════════════════════════════════ */}
      <div className="bg-deep-heaven text-white py-4">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 flex items-center gap-6 flex-wrap">
          <p className="text-[10px] font-bold uppercase tracking-widest text-grace flex-shrink-0">Volume Savings</p>
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { qty: 'Buy 1',   desc: 'Full price',       active: false, best: false },
              { qty: 'Buy 2–3', desc: '10% off each',     active: true,  best: false },
              { qty: 'Buy 4+',  desc: '20% off each',     active: false, best: true  },
            ].map((tier, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-7 bg-white/20" />}
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-bold ${tier.best ? 'text-yellow-400' : tier.active ? 'text-white' : 'text-grace'}`}>
                    {tier.qty}
                  </span>
                  <span className={`text-xs ${tier.best ? 'text-yellow-300/80' : 'text-white/60'}`}>{tier.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          3. IDENTITY SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                You were made to stand out.
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                Most people wear clothes. NUEL customers wear convictions.
                Every thread, every print, every colourway carries the weight
                of who you are in the kingdom.
              </p>
              <blockquote className="font-display text-xl italic text-covenant pl-5 border-l-4 border-covenant bg-mist dark:bg-covenant/10 py-4 pr-4 rounded-r-xl leading-relaxed">
                "What you wear is a declaration. Make it count."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: 'Gentleness', desc: 'Designs that speak with quiet confidence, never aggression.', icon: '🕊️' },
                { label: 'Love',       desc: 'Every piece crafted with care for the person who wears it.', icon: '❤️' },
                { label: 'Joy',        desc: 'Colour and form that make you feel as good as you look.',    icon: '☀️' },
              ].map(value => (
                <div key={value.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">{value.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. FEATURED PRODUCTS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-covenant mb-2">Drop 01: Foundation</p>
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Featured Collection</h2>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />

          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <button onClick={() => navigate('/men')} className="px-7 py-3 border-2 border-covenant text-covenant font-semibold rounded-full hover:bg-covenant hover:text-white transition-all">
              View Men's Collection
            </button>
            <button onClick={() => navigate('/women')} className="px-7 py-3 border-2 border-covenant text-covenant font-semibold rounded-full hover:bg-covenant hover:text-white transition-all">
              View Women's Collection
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. QUALITY SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">Built to last. Priced to reach.</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Premium 100% cotton. Reinforced stitching. Pre-shrunk fabric. NUEL Fashion refuses to
            compromise quality for affordability — or affordability for premium quality.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { num: '100%',  label: 'Cotton fabric' },
              { num: '45–55%', label: 'Gross margins' },
              { num: '4×',    label: 'Drops per year' },
              { num: '500+',  label: 'Units target' },
            ].map(stat => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl py-8 px-4 border border-gray-100 dark:border-gray-700">
                <span className="block font-display text-3xl font-bold text-covenant mb-2">{stat.num}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. DROP TEASER
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-deep-heaven to-covenant text-white">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-grace font-semibold mb-3">Coming Next</p>
              <h2 className="font-display text-5xl font-bold mb-5 leading-tight">Drop 02: Peace</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-[48ch]">
                Spring and summer co-ord sets, modest dress pieces, and the NUEL devotional journal bundle. Peace, rest, and beauty arriving in Q2.
              </p>
              <button
                onClick={() => openDrawer('account')}
                className="px-8 py-3.5 bg-white/15 border border-white/40 text-white font-semibold rounded-full hover:bg-white/25 transition-all backdrop-blur-sm"
              >
                Join the Waitlist
              </button>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="font-display text-2xl font-semibold mb-5">Peace &amp; Rest</h3>
              <div className="flex flex-wrap gap-2">
                {['Co-ord Sets', 'Dress Pieces', 'Journal Bundle', 'Caps & Beanies'].map(item => (
                  <span key={item} className="bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-12">The kingdom wears NUEL.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { initial: 'A', name: 'Adaeze, Lagos',        text: 'I wore the Rooted in Love tee to campus fellowship and three people asked where I got it. That conversation led to a discipleship series. This is what kingdom fashion does.' },
              { initial: 'E', name: 'Emmanuel, Abuja',      text: 'The hoodie quality is genuinely premium. I have bought things at triple the price that felt cheaper. NUEL gets the balance right.' },
              { initial: 'F', name: 'Funmi, Port Harcourt', text: 'Bought the tote bag as a gift for my sister and she immediately wanted the full tee as well. The packaging alone made her cry. So intentional.' },
            ].map(t => (
              <div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-sm border border-gray-100 dark:border-gray-700 text-left">
                <div className="w-10 h-10 rounded-full bg-covenant flex items-center justify-center text-white font-bold mb-4">{t.initial}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic mb-4">"{t.text}"</p>
                <p className="text-xs font-bold text-covenant uppercase tracking-wide">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. GIFT SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                The gift that carries a message.
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Every milestone deserves a meaningful gift. NUEL Fashion gift sets are curated
                for birthdays, graduations, and faith milestones.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Faith Milestone Bundle: Journal, mug, tote',
                  'Kingdom Starter Pack: Tee, tote, wristband',
                  'Grad Gift Set: Hoodie, journal, wristband set',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                    <span className="text-covenant mt-0.5">🎁</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/women')} className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-all">
                Shop Gift Sets
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-800 relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-covenant text-white text-xs font-bold px-5 py-1.5 rounded-full">Perfect Gift</span>
              <div className="flex justify-center gap-3 mb-6 mt-2 flex-wrap">
                {['Journal', 'Mug', 'Tote'].map(item => (
                  <div key={item} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-lg">From <strong className="font-display text-2xl text-covenant">{formatPrice(28000, currency)}</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
            Drop 01 is live. Limited units available.
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            NUEL Fashion operates on a drop model. When stock is gone, it is gone.
            Foundation Drop pieces will not return. This is your moment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/men')} className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-all text-base">
              Shop Men Now
            </button>
            <button onClick={() => navigate('/women')} className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-all text-base">
              Shop Women Now
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. NEWSLETTER
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-deep-heaven">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">Stay in the kingdom loop.</h3>
              <p className="text-sm text-white/70">Early access to drops, members-only discounts, and kingdom content.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email" required
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 text-sm"
              />
              <button type="submit" className="px-6 py-3 bg-white text-covenant font-semibold rounded-full hover:bg-grace transition-colors flex-shrink-0 text-sm">
                Join
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
