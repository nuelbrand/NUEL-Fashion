/**
 * FILTER SIDEBAR COMPONENT
 * ========================
 * FILE: src/components/filters/FilterSidebar.jsx
 *
 * WHAT THIS IS:
 *   The filter panel on the Men and Women shop pages.
 *   Lets customers narrow products by:
 *   - Category (tee, hoodie, co-ord, accessory, etc.)
 *   - Size (XS, S, M, L, XL, XXL)
 *   - Max price (range slider)
 *   - Colour (dot swatches)
 *
 * PROPS:
 *   gender       - 'men' | 'women' (determines which categories to show)
 *   filters      - current filter state object
 *   onChange     - function called when any filter changes
 *   isOpen       - boolean (for mobile filter panel toggle)
 *   onClose      - function to close on mobile
 *
 * The parent page (MenPage / WomenPage) owns the filter state
 * and passes it down here. This component just renders controls
 * and calls onChange when something changes.
 */

import { formatPrice } from '../../utils/currency.js'
import { useUI }       from '../../store/UIContext'

// Categories available per gender
const CATEGORIES = {
  men:   [
    { value: 'tee',       label: 'Tees' },
    { value: 'hoodie',    label: 'Hoodies' },
    { value: 'co-ord',    label: 'Co-ord Sets' },
    { value: 'accessory', label: 'Accessories' },
  ],
  women: [
    { value: 'dress',     label: 'Dress Pieces' },
    { value: 'tee',       label: 'Tees' },
    { value: 'co-ord',    label: 'Co-ord Sets' },
    { value: 'accessory', label: 'Accessories' },
    { value: 'gift',      label: 'Gift Sets' },
  ],
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const COLOURS = [
  { value: 'deep-heaven', hex: '#042C53', label: 'Deep Heaven' },
  { value: 'covenant',    hex: '#185FA5', label: 'Covenant Blue' },
  { value: 'holiness',    hex: '#378ADD', label: 'Holiness' },
  { value: 'grace',       hex: '#B5D4F4', label: 'Grace Light' },
]

const MAX_PRICE = 80000

export default function FilterSidebar({ gender = 'men', filters, onChange, isOpen, onClose }) {
  const { currency } = useUI()
  const categories   = CATEGORIES[gender] || CATEGORIES.men

  function toggleCategory(value) {
    const current = filters.categories || []
    const updated  = current.includes(value)
      ? current.filter(c => c !== value)
      : [...current, value]
    // Always keep at least one category selected
    if (updated.length === 0) return
    onChange({ ...filters, categories: updated })
  }

  return (
    <>
      {/* ── SIDEBAR PANEL ────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 lg:w-auto
        bg-white dark:bg-gray-950 lg:bg-transparent dark:lg:bg-transparent
        shadow-2xl lg:shadow-none
        overflow-y-auto lg:overflow-visible
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block
      `}>

        {/* Mobile header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 lg:hidden">
          <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="p-5 lg:p-0 space-y-7">

          {/* ── CATEGORY ─────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Category</h3>
            <div className="space-y-2.5">
              {categories.map(cat => (
                <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(cat.value) ?? true}
                    onChange={() => toggleCategory(cat.value)}
                    className="w-4 h-4 rounded accent-covenant cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-covenant transition-colors">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── SIZE ─────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ ...filters, size: 'all' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${filters.size === 'all' ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant'}`}
              >
                All
              </button>
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => onChange({ ...filters, size })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${filters.size === size ? 'border-covenant text-covenant bg-mist dark:bg-covenant/10' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-covenant'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ── PRICE ────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Price Range</h3>
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={1000}
              value={filters.maxPrice ?? MAX_PRICE}
              onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatPrice(0, currency)}</span>
              <span className="text-covenant font-medium">
                Up to {formatPrice(filters.maxPrice ?? MAX_PRICE, currency)}
              </span>
            </div>
          </div>

          {/* ── COLOUR ───────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Colour</h3>
            <div className="flex gap-3 flex-wrap">
              {/* "All" option */}
              <button
                onClick={() => onChange({ ...filters, colour: 'all' })}
                title="All colours"
                className={`w-7 h-7 rounded-full bg-gray-800 dark:bg-gray-200 border-2 transition-all ${filters.colour === 'all' ? 'border-covenant ring-2 ring-covenant ring-offset-2' : 'border-transparent hover:ring-2 hover:ring-covenant hover:ring-offset-2'}`}
              />
              {COLOURS.map(colour => (
                <button
                  key={colour.value}
                  onClick={() => onChange({ ...filters, colour: colour.value })}
                  title={colour.label}
                  style={{ backgroundColor: colour.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${filters.colour === colour.value ? 'border-white ring-2 ring-covenant ring-offset-2' : 'border-white/50 hover:ring-2 hover:ring-covenant hover:ring-offset-2'}`}
                />
              ))}
            </div>
          </div>

          {/* ── RESET ────────────────────────────────────────────────── */}
          <button
            onClick={() => onChange({
              categories: categories.map(c => c.value),
              size: 'all',
              maxPrice: MAX_PRICE,
              colour: 'all',
            })}
            className="text-xs text-gray-400 hover:text-covenant transition-colors underline"
          >
            Reset all filters
          </button>

        </div>
      </aside>

      {/* Mobile overlay when filter panel is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}
