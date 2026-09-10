/**
 * COMMUNITY PAGE
 * ==============
 * FILE: src/pages/CommunityPage.jsx
 * URL:  /community
 *
 * SECTIONS:
 *   1. Lookbook grid  — editorial-style photo cards
 *   2. UGC feed       — customer photos tagged #NUELFashion
 *   3. Brand events   — upcoming pop-ups and launch events
 */

import { useEffect } from 'react'

export default function CommunityPage() {
  useEffect(() => { document.title = 'Community — NUEL Fashion' }, [])

  const lookbookItems = [
    'Rooted in Love Drop 01',
    'Covenant Blue Essentials',
    'Kingdom at Work',
    'Sunday Best, NUEL Style',
    'Stewardship Is Worship',
    'Peaceful Saturdays',
  ]

  const events = [
    {
      month: 'OCT', day: '12',
      title: 'Harvest Drop Launch Event',
      location: 'Lagos, Nigeria',
      desc: 'Live launch of Drop 04, with in-person shopping, community worship, and brand activations.',
    },
    {
      month: 'APR', day: '05',
      title: 'Peace Drop Market Pop-up',
      location: 'Abuja, Nigeria',
      desc: 'The Peace Drop arrives at a curated kingdom creative market. Meet the brand, try pieces in person.',
    },
  ]

  return (
    <div className="pb-20">

      {/* ── PAGE HERO ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-50 to-mist dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl font-bold text-gray-900 dark:text-white mb-3">The Movement</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Real people. Real declarations. Real community.</p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-14 space-y-20">

        {/* ── LOOKBOOK ─────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Lookbook</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {lookbookItems.map((label, i) => (
              <div
                key={label}
                className="
                  relative aspect-[2/3]
                  bg-gradient-to-br from-mist to-grace/60
                  dark:from-gray-800 dark:to-gray-900
                  rounded-2xl overflow-hidden
                  border border-gray-100 dark:border-gray-800
                  flex items-center justify-center
                  cursor-pointer group
                  hover:scale-[1.02] transition-transform duration-200
                "
              >
                {/* Illustration placeholder */}
                <svg viewBox="0 0 80 100" fill="none" className="w-16 h-16 opacity-20">
                  <path
                    d="M27 20L40 14L53 20L58 36L48 36L48 86L32 86L32 36L22 36Z"
                    fill="#185FA5"
                    opacity={0.4 + (i % 3) * 0.15}
                  />
                  <path d="M22 36L9 44L13 57L28 50L28 36Z" fill="#378ADD" opacity="0.4"/>
                  <path d="M58 36L71 44L67 57L52 50L52 36Z" fill="#378ADD" opacity="0.4"/>
                </svg>

                {/* Label overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-deep-heaven/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── UGC FEED ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Style</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Tag us with <strong className="text-covenant">#NUELFashion</strong> to be featured here.
              </p>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm text-covenant font-semibold hover:underline"
            >
              Follow on Instagram
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          {/* UGC grid — placeholder tiles */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="
                  aspect-square rounded-xl
                  bg-gradient-to-br from-mist to-grace/40
                  dark:from-gray-800 dark:to-gray-900
                  border border-gray-100 dark:border-gray-800
                  flex items-center justify-center
                  cursor-pointer hover:scale-[1.03]
                  hover:shadow-md transition-all duration-200
                "
                title={`Community style #${i + 1}`}
              >
                <svg viewBox="0 0 50 60" fill="none" className="w-8 h-8 opacity-20">
                  <path
                    d="M17 12L25 8L33 12L36 22L30 22L30 52L20 52L20 22L14 22Z"
                    fill="#185FA5"
                    opacity={0.35 + (i % 4) * 0.12}
                  />
                </svg>
              </div>
            ))}
          </div>
        </section>

        {/* ── EVENTS ───────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">Brand Events</h2>
          <div className="space-y-5">
            {events.map(event => (
              <div
                key={event.title}
                className="
                  flex gap-6 items-start
                  bg-gray-50 dark:bg-gray-900
                  border border-gray-100 dark:border-gray-800
                  rounded-2xl p-6
                "
              >
                {/* Date block */}
                <div className="
                  flex-shrink-0 w-16 text-center
                  bg-deep-heaven text-white rounded-xl py-2
                ">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-grace">
                    {event.month}
                  </span>
                  <span className="block font-display text-3xl font-bold leading-none">
                    {event.day}
                  </span>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
                    {event.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-sm text-covenant font-medium mb-3">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {event.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
