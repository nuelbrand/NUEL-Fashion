/**
 * TAILWIND CSS CONFIGURATION
 * ==========================
 * This file adds NUEL Fashion's brand identity into Tailwind.
 *
 * What this means for a beginner:
 *   - Instead of writing custom CSS for brand colours,
 *     you can now write className="bg-blue-covenant text-white"
 *     and Tailwind knows exactly what colour "covenant" is.
 *
 * All colours come from the original NUEL Divine Blue Palette.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // ─── WHICH FILES TAILWIND SHOULD SCAN ───────────────────────────────────────
  // Tailwind only includes CSS classes that are actually used in these files.
  // This keeps the final CSS file tiny.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // ─── DARK MODE ──────────────────────────────────────────────────────────────
  // 'class' means dark mode is toggled by adding class="dark" to <html>
  // (controlled by our ThemeContext)
  darkMode: 'class',

  theme: {
    extend: {

      // ─── NUEL BRAND COLOURS ───────────────────────────────────────────────
      // Usage example: className="bg-covenant text-white"
      colors: {
        // The Divine Blue Palette
        'deep-heaven':  '#042C53',   // Deepest blue — authority, divinity
        'covenant':     '#185FA5',   // Core brand blue — trust, relationship
        'holiness':     '#378ADD',   // Medium blue — clarity, aspiration
        'grace':        '#B5D4F4',   // Light blue — accessibility, subtlety
        'mist':         '#E6F1FB',   // Palest blue — openness, gentleness

        // Semantic colours (used for success/error feedback)
        'brand-success': '#14A060',
        'brand-error':   '#C0392B',
        'brand-warning': '#E67E22',
      },

      // ─── NUEL BRAND FONTS ────────────────────────────────────────────────
      // Usage example: className="font-display text-4xl"
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body':    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // ─── CUSTOM SPACING ──────────────────────────────────────────────────
      // Adds a few larger spacing values beyond Tailwind's defaults
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '88':  '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ─── HEADER HEIGHT ───────────────────────────────────────────────────
      // Used to offset content below the sticky header
      height: {
        'header': '68px',
      },

      // ─── BORDER RADIUS ───────────────────────────────────────────────────
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },

      // ─── ANIMATIONS ──────────────────────────────────────────────────────
      keyframes: {
        // Slide in from the right (used for cart/wishlist drawers)
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        // Slide in from the left (used for mobile nav)
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        // Fade in (used for modals and overlays)
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Slide up from bottom (used for toast notifications)
        'slide-up': {
          '0%':   { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Gentle bounce (used for scroll cue arrow)
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(6px)' },
        },
        // Pulse (used for live support status dot)
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.3)' },
        },
        // Shimmer (used for loading skeleton placeholders)
        'shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.35s ease',
        'slide-in-left':  'slide-in-left 0.35s ease',
        'fade-in':        'fade-in 0.25s ease',
        'slide-up':       'slide-up 0.35s ease',
        'bounce-gentle':  'bounce-gentle 2s infinite',
        'pulse-dot':      'pulse-dot 2s infinite',
        'shimmer':        'shimmer 1.5s infinite',
      },
    },
  },

  plugins: [],
}
