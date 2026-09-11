/**
 * PRODUCT DETAIL PAGE — SELL LIKE CRAZY EDITION
 * ==============================================
 * FILE: src/pages/ProductDetailPage.jsx
 * URL:  /product/:id
 *
 * PAGE SECTIONS (in order):
 *   1.  Breadcrumb navigation
 *   2.  Hero: image gallery + core product info
 *         - Price + volume tiers
 *         - Size selector + size guide
 *         - Quantity + Add to Cart
 *         - Free delivery badge
 *         - Urgency / scarcity bar
 *   3.  Social proof — star rating summary
 *   4.  Text testimonials
 *   5.  Video testimonials (from Supabase)
 *   6.  Objections handler (FAQ-style)
 *   7.  Brand trust section (NUEL ecosystem)
 *   8.  Guarantee
 *   9.  Product detail tabs (Features / Materials / Care)
 *  10.  Related products
 *
 * ALL CONTENT comes from Supabase — no hardcoding needed.
 * Fields left empty in Supabase simply don't render.
 */

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts }   from '../hooks/useProducts'
import { useCart }       from '../store/CartContext'
import { useWishlist }   from '../store/WishlistContext'
import { useUI }         from '../store/UIContext'
import { formatPrice }   from '../utils/currency.js'
import { getImageUrl }   from '../services/products.js'
import { colourToHex, clamp } from '../utils/helpers.js'
import ProductGrid       from '../components/product/ProductGrid'

/* ─── SMALL REUSABLE PIECES ─────────────────────────────────────────────── */

/** Star rating display */
function Stars({ rating = 5, size = 'sm' }) {
  const px = size === 'lg' ? 20 : 14
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <svg key={n} viewBox="0 0 24 24" width={px} height={px}
          fill={n <= rating ? '#F59E0B' : 'none'}
          stroke="#F59E0B" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

/** Verified badge */
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-success bg-brand-success/10 rounded-full px-2 py-0.5">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Verified Purchase
    </span>
  )
}

/** Bullet list with check icons */
function BulletList({ items = [], iconColour = 'text-covenant' }) {
  if (!items?.length) return null
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
          <svg viewBox="0 0 24 24" width="15" height="15"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            className={`flex-shrink-0 mt-0.5 ${iconColour}`}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Loading skeleton block */
function Skeleton({ className = '' }) {
  return <div className={`bg-gray-100 dark:bg-gray-800 rounded-xl animate-shimmer ${className}`} />
}

/** Section heading with optional subtitle */
function SectionHeading({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <p className="text-xs font-bold uppercase tracking-widest text-covenant mb-2">{subtitle}</p>
      )}
      <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white leading-snug">
        {title}
      </h2>
    </div>
  )
}

/* ─── URGENCY BAR ────────────────────────────────────────────────────────── */
function UrgencyBar({ text, unitsLeft }) {
  if (!text && !unitsLeft) return null

  // Pulse animation on the stock dot
  const stockLevel = unitsLeft <= 5 ? 'critical' : unitsLeft <= 15 ? 'low' : 'ok'
  const barColour  = stockLevel === 'critical'
    ? 'bg-red-500/10 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400'
    : stockLevel === 'low'
    ? 'bg-amber-50 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400'
    : 'bg-mist border-grace text-covenant'
  const dotColour = stockLevel === 'critical' ? 'bg-red-500' : stockLevel === 'low' ? 'bg-amber-500' : 'bg-brand-success'

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${barColour} my-5`}>
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse-dot ${dotColour}`} />
      <p className="text-sm font-semibold leading-snug">
        {text || `Hurry — only ${unitsLeft} unit${unitsLeft !== 1 ? 's' : ''} left in stock. This colourway will not return.`}
      </p>
    </div>
  )
}

/* ─── FREE DELIVERY BADGE ────────────────────────────────────────────────── */
function FreeDeliveryBadge({ deliveryNote }) {
  return (
    <div className="flex items-start gap-3 bg-brand-success/5 border border-brand-success/20 rounded-xl px-4 py-3 my-4">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
        className="text-brand-success flex-shrink-0 mt-0.5">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
      <div>
        <p className="text-sm font-bold text-brand-success">Free Delivery Available</p>
        {deliveryNote && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{deliveryNote}</p>
        )}
      </div>
    </div>
  )
}

/* ─── RATING SUMMARY BAR ─────────────────────────────────────────────────── */
function RatingSummary({ testimonials = [] }) {
  if (!testimonials.length) return null

  const avg = (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
  const count = testimonials.length

  // Count per star level
  const dist = [5,4,3,2,1].map(star => ({
    star,
    count: testimonials.filter(t => (t.rating || 5) === star).length,
  }))

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl">
      {/* Big number */}
      <div className="text-center flex-shrink-0">
        <div className="font-display text-6xl font-bold text-gray-900 dark:text-white leading-none mb-2">{avg}</div>
        <Stars rating={Math.round(avg)} size="lg" />
        <p className="text-xs text-gray-400 mt-1.5">{count} verified review{count !== 1 ? 's' : ''}</p>
      </div>

      {/* Bar chart */}
      <div className="flex-1 w-full space-y-2">
        {dist.map(({ star, count: c }) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 w-4 text-right">{star}</span>
            <svg viewBox="0 0 12 12" width="12" height="12" fill="#F59E0B"><polygon points="6 1 7.545 4.09 11 4.545 8.5 6.98 9.09 10.455 6 8.836 2.91 10.455 3.5 6.98 1 4.545 4.455 4.09"/></svg>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${count ? (c / count) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-4">{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── TEXT TESTIMONIAL CARD ──────────────────────────────────────────────── */
function TestimonialCard({ testimonial }) {
  const { name, location, rating = 5, text, verified = false } = testimonial
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar initial */}
          <div className="w-10 h-10 rounded-full bg-covenant flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
            {location && <p className="text-xs text-gray-400">{location}</p>}
          </div>
        </div>
        <Stars rating={rating} />
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
        "{text}"
      </p>

      {/* Verified badge */}
      {verified && <VerifiedBadge />}
    </div>
  )
}

/* ─── VIDEO TESTIMONIAL CARD ─────────────────────────────────────────────── */
function VideoTestimonialCard({ testimonial }) {
  const { name, location, thumbnail, video_url, quote } = testimonial
  const [playing, setPlaying] = useState(false)
  const thumbUrl = thumbnail ? getImageUrl(thumbnail) : null

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      {/* Video embed or thumbnail */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {playing && video_url ? (
          <iframe
            src={`${video_url}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            title={`${name} testimonial`}
            frameBorder="0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Thumbnail */}
            {thumbUrl ? (
              <img src={thumbUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-mist to-grace/50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <svg viewBox="0 0 60 75" fill="none" className="w-12 h-12 opacity-20">
                  <path d="M20 15L30 10L40 15L44 28L36 28L36 65L24 65L24 28L16 28Z" fill="#185FA5"/>
                </svg>
              </div>
            )}

            {/* Play button overlay */}
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play video testimonial"
              className="
                absolute inset-0 flex items-center justify-center
                bg-black/20 hover:bg-black/30 transition-colors group
              "
            >
              <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#185FA5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {quote && (
          <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-3">
            "{quote}"
          </p>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-covenant flex items-center justify-center text-white text-xs font-bold">
            {name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{name}</p>
            {location && <p className="text-[10px] text-gray-400">{location}</p>}
          </div>
          <div className="ml-auto">
            <VerifiedBadge />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── OBJECTIONS ACCORDION ───────────────────────────────────────────────── */
function ObjectionsSection({ objections = [] }) {
  const [openIndex, setOpenIndex] = useState(null)
  if (!objections?.length) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <SectionHeading
          title="We know what you're thinking."
          subtitle="Honest answers"
        />
        <div className="space-y-3">
          {objections.map((obj, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                className="
                  w-full flex items-center justify-between
                  px-6 py-5 text-left gap-4
                  text-sm font-semibold text-gray-900 dark:text-white
                  hover:text-covenant transition-colors
                "
              >
                <span>{obj.question}</span>
                <svg
                  viewBox="0 0 24 24" width="18" height="18"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className={`flex-shrink-0 transition-transform duration-200 text-covenant ${openIndex === i ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6 pt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {obj.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── BRAND TRUST SECTION ────────────────────────────────────────────────── */
function BrandTrustSection({ text }) {
  if (!text) return null
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <SectionHeading
          title="Why NUEL Fashion?"
          subtitle="The Brand Behind the Piece"
        />
        {/* NUEL Logo mark */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-deep-heaven rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="font-display text-2xl font-bold text-grace">N</span>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-gray-900 dark:text-white">NUEL Fashion</p>
            <p className="text-xs text-gray-400">Part of the NUEL Kingdom Ecosystem</p>
          </div>
        </div>

        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{text}</p>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Kingdom Rooted', icon: '🙏' },
            { label: 'Premium Quality', icon: '✅' },
            { label: 'Drop Model',      icon: '🔒' },
            { label: 'Lagos Based',     icon: '📍' },
          ].map(item => (
            <div
              key={item.label}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800"
            >
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── GUARANTEE SECTION ──────────────────────────────────────────────────── */
function GuaranteeSection({ text }) {
  if (!text) return null
  return (
    <section className="py-12 bg-deep-heaven text-white">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Shield icon */}
          <div className="flex-shrink-0 w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold mb-3">Our Promise to You</h3>
            <p className="text-white/80 leading-relaxed text-base">{text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id }                   = useParams()
  const navigate                 = useNavigate()
  const { products, isLoading }  = useProducts()
  const { addToCart }            = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { currency, showToast }  = useUI()

  const [selectedSize, setSelectedSize]   = useState(null)
  const [qty, setQty]                     = useState(1)
  const [activeImage, setActiveImage]     = useState(0)
  const [activeTab, setActiveTab]         = useState('features')
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const addToCartRef = useRef(null) // for sticky bar scroll detection

  const product = products.find(p => p.id === id)

  // All images: primary first, then extras
  const allImages = [
    product?.image_url,
    ...(Array.isArray(product?.images) ? product.images : []),
  ].filter(Boolean)

  // Related products
  const related = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4)

  // Pull data from all Supabase columns (with safe defaults)
  const testimonials      = Array.isArray(product?.testimonials)       ? product.testimonials       : []
  const videoTestimonials = Array.isArray(product?.video_testimonials)  ? product.video_testimonials : []
  const objections        = Array.isArray(product?.objections)          ? product.objections         : []
  const features          = Array.isArray(product?.features)            ? product.features           : []
  const materials         = Array.isArray(product?.materials)           ? product.materials          : []
  const care              = Array.isArray(product?.care)                ? product.care               : []
  const sizeGuide         = Array.isArray(product?.size_guide)          ? product.size_guide         : []
  const tags              = Array.isArray(product?.tags)                ? product.tags               : []
  const inStock           = product?.in_stock !== false

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null)
      document.title = `${product.name} — NUEL Fashion`
    }
  }, [product])

  useEffect(() => {
    setQty(1)
    setActiveImage(0)
  }, [id])

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <Skeleton className="aspect-[3/3.8]" />
            <div className="flex gap-2">{[1,2,3].map(i => <Skeleton key={i} className="w-20 h-20" />)}</div>
          </div>
          <div className="space-y-5 pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-28" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    )
  }

  /* ── NOT FOUND ───────────────────────────────────────────────────────── */
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-6">😔</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Product Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">This product may have sold out or the link may be wrong.</p>
        <button onClick={() => navigate(-1)} className="px-7 py-3 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors">
          Go Back
        </button>
      </div>
    )
  }

  const wishlisted = isWishlisted(product.id)

  function handleAddToCart() {
    if (!selectedSize) { showToast('Please select a size'); return }
    if (!inStock) { showToast('This item is currently out of stock'); return }
    addToCart(product, selectedSize, qty)
    showToast(`${product.name} added to cart`)
  }

  function handleWishlist() {
    toggleWishlist(product.id)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  /* ── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <div className="pb-0 overflow-x-hidden">

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-covenant transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/${product.gender}`} className="hover:text-covenant transition-colors capitalize">{product.gender}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO: IMAGE + CORE INFO
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── IMAGE GALLERY ─────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[3/3.8] rounded-3xl overflow-hidden bg-mist dark:bg-gray-800 flex items-center justify-center">
              {!inStock && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center rounded-3xl">
                  <span className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full text-sm">Out of Stock</span>
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${product.badge === 'new' ? 'bg-covenant text-white' : product.badge === 'limited' ? 'bg-purple-600 text-white' : 'bg-brand-success text-white'}`}>
                    {product.badge}
                  </span>
                </div>
              )}
              {allImages[activeImage] ? (
                <img key={activeImage} src={getImageUrl(allImages[activeImage])} alt={`${product.name} view ${activeImage + 1}`} className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 200 250" fill="none" className="w-48 h-48 opacity-20">
                  <path d="M65 50L100 35L135 50L150 90L125 90L125 215L75 215L75 90L50 90Z" fill="#185FA5"/>
                  <path d="M50 90L20 110L30 140L65 120L65 90Z" fill="#378ADD"/>
                  <path d="M150 90L180 110L170 140L135 120L135 90Z" fill="#378ADD"/>
                </svg>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} aria-label={`View image ${i + 1}`}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-covenant shadow-md scale-105' : 'border-transparent hover:border-grace'}`}>
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Rating mini-summary under image (if testimonials exist) */}
            {testimonials.length > 0 && (
              <div className="flex items-center gap-3 px-2">
                <Stars rating={5} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">({testimonials.length} verified reviews)</span>
              </div>
            )}
          </div>

          {/* ── PRODUCT INFO COLUMN ───────────────────────────────── */}
          <div className="flex flex-col" ref={addToCartRef}>

            {/* Stock + category */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{product.category}</p>
              {inStock
                ? <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-success"><span className="w-1.5 h-1.5 rounded-full bg-brand-success" />In Stock</span>
                : <span className="text-xs font-semibold text-gray-400">Out of Stock</span>
              }
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p className="text-base font-medium text-covenant italic mb-4">{product.tagline}</p>
            )}

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, currency)}
              </span>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  Buy 2–3: {formatPrice(product.price * 0.9, currency)} each
                </span>
                <span className="text-xs font-semibold text-covenant bg-mist dark:bg-covenant/10 border border-grace rounded-full px-3 py-1">
                  Buy 4+: {formatPrice(product.price * 0.8, currency)} each
                </span>
              </div>
            </div>

            {/* Story */}
            {(product.story || product.description) && (
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                {product.story || product.description}
              </p>
            )}

            {/* Urgency bar */}
            <UrgencyBar text={product.urgency_text} unitsLeft={product.units_left} />

            {/* Free delivery */}
            {product.free_delivery && (
              <FreeDeliveryBadge deliveryNote={product.delivery_note} />
            )}

            {/* Colours */}
            {product.colours?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Available colours</p>
                <div className="flex gap-2">
                  {product.colours.map(colour => (
                    <div key={colour} title={colour}
                      style={{ backgroundColor: colourToHex(colour) }}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Size</p>
                {sizeGuide.length > 0 && (
                  <button onClick={() => setShowSizeGuide(s => !s)} className="text-xs text-covenant hover:underline font-medium">
                    {showSizeGuide ? 'Hide' : 'View'} Size Guide
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.sizes?.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} disabled={!inStock}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === size ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant hover:text-covenant'}`}>
                    {size}
                  </button>
                ))}
              </div>
              {product.fit && <p className="text-xs text-gray-400 leading-relaxed">📐 {product.fit}</p>}

              {/* Size guide table */}
              {showSizeGuide && sizeGuide.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-mist dark:bg-gray-800">
                        {Object.keys(sizeGuide[0]).map(col => (
                          <th key={col} className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide border border-grace dark:border-gray-700 capitalize">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuide.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}>
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-3 py-2 text-gray-600 dark:text-gray-400 border border-grace dark:border-gray-700">
                              {j === 0 ? <strong className="text-covenant">{val}</strong> : `${val}"`}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-gray-400 mt-1.5">All measurements in inches.</p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quantity</p>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full w-fit overflow-hidden">
                <button onClick={() => setQty(q => clamp(q - 1, 1, 99))} aria-label="Decrease" className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-xl">−</button>
                <span className="w-12 text-center text-base font-semibold text-gray-900 dark:text-white">{qty}</span>
                <button onClick={() => setQty(q => clamp(q + 1, 1, 99))} aria-label="Increase" className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-covenant hover:text-white transition-colors text-xl">+</button>
              </div>
            </div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-3 flex-wrap mb-6">
              <button onClick={handleAddToCart} disabled={!inStock}
                className="flex-1 min-w-[200px] py-4 bg-covenant text-white font-semibold rounded-full text-base hover:bg-deep-heaven active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-covenant focus-visible:ring-offset-2">
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button onClick={handleWishlist} aria-label={wishlisted ? 'Remove from wishlist' : 'Save'}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${wishlisted ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-covenant hover:text-covenant'}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <span key={tag} className="text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">#{tag}</span>
                ))}
              </div>
            )}

            {/* Delivery + returns */}
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              {[
                { icon: '🚚', text: '3–5 days within Nigeria · 7–14 days internationally' },
                { icon: '↩️', text: 'Free returns within 14 days for unworn items' },
                { icon: '🔒', text: 'Secure payment via Paystack — cards, bank transfer, USSD' },
                { icon: '📦', text: 'Branded NUEL packaging with every order' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — RATING SUMMARY + TEXT TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <SectionHeading
              title="Real people. Real declarations."
              subtitle="Customer Reviews"
              centered
            />

            {/* Rating summary */}
            <div className="max-w-[600px] mx-auto mb-12">
              <RatingSummary testimonials={testimonials} />
            </div>

            {/* Testimonial cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — VIDEO TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      {videoTestimonials.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <SectionHeading
              title="See it in real life."
              subtitle="Video Reviews"
              centered
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videoTestimonials.map((v, i) => (
                <VideoTestimonialCard key={i} testimonial={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — OBJECTIONS
      ══════════════════════════════════════════════════════════════ */}
      <ObjectionsSection objections={objections} />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — BRAND TRUST
      ══════════════════════════════════════════════════════════════ */}
      <BrandTrustSection text={product.brand_trust_text} />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — GUARANTEE
      ══════════════════════════════════════════════════════════════ */}
      <GuaranteeSection text={product.guarantee_text} />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — PRODUCT DETAILS TABS
      ══════════════════════════════════════════════════════════════ */}
      {(features.length > 0 || materials.length > 0 || care.length > 0) && (
        <div className="bg-white dark:bg-gray-950 py-12">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
              {/* Tab buttons */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                {[
                  { key: 'features',  label: 'Product Features', show: features.length > 0  },
                  { key: 'materials', label: 'Materials',         show: materials.length > 0 },
                  { key: 'care',      label: 'Care Instructions', show: care.length > 0      },
                ].filter(t => t.show).map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors text-center ${activeTab === tab.key ? 'text-covenant border-b-2 border-covenant bg-white dark:bg-gray-950' : 'text-gray-500 dark:text-gray-400 hover:text-covenant'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-8 bg-white dark:bg-gray-950">
                {activeTab === 'features'  && <div><h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">What makes this piece special</h3><BulletList items={features} /></div>}
                {activeTab === 'materials' && <div><h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">Fabric &amp; Construction</h3><BulletList items={materials} iconColour="text-holiness" /></div>}
                {activeTab === 'care'      && <div><h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">Care Instructions</h3><BulletList items={care} iconColour="text-gray-400" /><p className="text-xs text-gray-400 mt-5 leading-relaxed">Proper care extends the life of your garment and keeps the print sharp. When in doubt, wash cold and hang dry.</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 8 — RELATED PRODUCTS
      ══════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">You may also like</h2>
              <Link to={`/${product.gender}`} className="text-sm text-covenant font-semibold hover:underline hidden sm:block">View all →</Link>
            </div>
            <ProductGrid products={related} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STICKY BOTTOM BAR — mobile add to cart
          Shows on mobile only when user scrolls past the main CTA
      ══════════════════════════════════════════════════════════════ */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-[800] sm:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-3 shadow-xl">
          <div className="flex gap-3">
            <button onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors text-sm">
              Add to Cart — {formatPrice(product.price * qty, currency)}
            </button>
            <button onClick={handleWishlist}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${wishlisted ? 'border-covenant text-covenant' : 'border-gray-200 text-gray-400'}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
