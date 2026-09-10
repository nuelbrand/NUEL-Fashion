/**
 * ABOUT PAGE
 * ==========
 * FILE: src/pages/AboutPage.jsx
 * URL:  /about
 *
 * SECTIONS:
 *   1. Hero           — bold headline against deep blue background
 *   2. Audience copy  — speaks directly to the reader's experience
 *   3. Brand values   — Gentleness, Love, Joy
 *   4. Brand story    — who NUEL Fashion is (20% about brand)
 *   5. NUEL University connection
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  useEffect(() => { document.title = 'About — NUEL Fashion' }, [])
  const navigate = useNavigate()

  return (
    <div>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-deep-heaven to-covenant text-white py-20 lg:py-28">
        <div className="max-w-[760px] mx-auto px-4 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-grace mb-4">The Movement</p>
          <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight">
            You were called to something more.
          </h1>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 md:px-8 py-16 space-y-16">

        {/* ── AUDIENCE SECTION (80% of page) ──────────────────────── */}
        <section className="space-y-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
              You feel it, don't you?
            </h2>
            <div className="space-y-5 text-lg text-gray-500 dark:text-gray-400 leading-[1.8]">
              <p>
                That tension between who you are in the kingdom and what the world tells you
                to wear. Between the conviction you carry and the clothing that expresses it.
                Between faith as a private matter and faith as a public declaration.
              </p>
              <p>
                You have tried the generic graphic tees with hollow inspirational quotes.
                You have tried dressing down your faith so it does not make people uncomfortable.
                You have settled for looking like everyone else because there was no alternative.
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                That changes today.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-snug">
              Style is a spiritual act.
            </h2>
            <div className="space-y-5 text-lg text-gray-500 dark:text-gray-400 leading-[1.8]">
              <p>
                Every morning, you make a choice about what to wear. NUEL Fashion believes
                that choice is not neutral. It is a declaration of who you are, what you carry,
                and where you belong.
              </p>
              <p>
                When you wear a NUEL piece, you are not just getting dressed. You are showing up
                as yourself: kingdom-rooted, faith-forward, and unapologetically beautiful.
              </p>
              <p>
                We design for the 25-year-old navigating Lagos with conviction. For the student
                who wants to represent faith without looking like a billboard. For the professional
                who believes excellence and kingdom identity are not opposites.
              </p>
            </div>
          </div>
        </section>

        {/* ── VALUES ───────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: 'Gentleness',
                desc:  'We do not shout. We speak quietly and clearly, through design that invites rather than demands attention.',
              },
              {
                label: 'Love',
                desc:  'Every product is made with care. For the person wearing it, for the community around them, for the message it carries.',
              },
              {
                label: 'Joy',
                desc:  'Faith is not heavy. NUEL Fashion celebrates identity with colour, form, and creative joy that makes you smile.',
              },
            ].map(value => (
              <div
                key={value.label}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6"
              >
                <h3 className="font-display text-xl font-semibold text-covenant mb-3">
                  {value.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BRAND SECTION (20%) ──────────────────────────────────── */}
        <section className="border-t border-gray-100 dark:border-gray-800 pt-14 space-y-6">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white leading-snug">
            About NUEL Fashion
          </h2>
          <div className="space-y-5 text-lg text-gray-500 dark:text-gray-400 leading-[1.8]">
            <p>
              NUEL Fashion is a sub-brand of NUEL, a kingdom ecosystem that exists to equip,
              inspire, and resource a generation of faith-forward creatives and leaders.
            </p>
            <p>
              Founded on three spirit pillars — Gentleness, Love, and Joy — NUEL Fashion
              operates on a seasonal drop model. Four intentional releases per year. Each drop
              has a theme, a story, and a limited run. When stock is gone, it is gone.
            </p>
            <p>
              Every piece is manufactured with sustainable intent, using premium 100% cotton
              and organic canvas where possible. The Divine Blue palette — anchored in Deep Heaven
              through Heavenly Mist — runs through every product as a visual signature.
            </p>
          </div>

          {/* NUEL University callout */}
          <div className="bg-mist dark:bg-covenant/10 border-l-4 border-covenant rounded-r-2xl p-6 mt-8">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-3">
              NUEL Fashion × NUEL University
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              NUEL Fashion feeds into NUEL University's Kingdom Creative Entrepreneur track.
              Students learn brand identity, product development, drop marketing, and e-commerce
              strategy using NUEL Fashion as the live case study.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/men')}
            className="px-8 py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-all mr-4"
          >
            Shop the Collection
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3.5 border-2 border-covenant text-covenant font-semibold rounded-full hover:bg-covenant hover:text-white transition-all"
          >
            Get in Touch
          </button>
        </div>

      </div>
    </div>
  )
}
