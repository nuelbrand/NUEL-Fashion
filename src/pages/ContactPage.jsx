/**
 * CONTACT PAGE
 * ============
 * FILE: src/pages/ContactPage.jsx
 * URL:  /contact
 *
 * SECTIONS:
 *   1. Contact form (name, email, subject, message)
 *   2. Support info (email, hours, location)
 *   3. Social links
 *   4. Live chat CTA
 *   5. FAQ accordion
 */

import { useState, useEffect } from 'react'
import { useUI } from '../store/UIContext'

// ─── FAQ ACCORDION ITEM ──────────────────────────────────────────────────────
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-expanded={isOpen}
        className="
          w-full flex items-center justify-between
          px-6 py-5 text-left
          text-base font-semibold text-gray-900 dark:text-white
          bg-gray-50 dark:bg-gray-900
          hover:text-covenant dark:hover:text-covenant
          transition-colors gap-4
        "
      >
        <span>{question}</span>
        <svg
          viewBox="0 0 24 24" width="18" height="18"
          fill="none" stroke="currentColor" strokeWidth="2"
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 py-5 bg-white dark:bg-gray-950">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

const FAQS = [
  {
    question: 'How does the drop model work?',
    answer: 'NUEL Fashion releases four drops per year, one per quarter. Each drop has a theme, a limited set of products, and a fixed run of units. When stock sells out, it does not return. We announce each drop 4–6 weeks in advance and open a waitlist before products go live.',
  },
  {
    question: 'What are the sizing options?',
    answer: 'NUEL Fashion uses an oversized, gender-neutral fit for tees and hoodies. We size from XS to XXL. Dress pieces for women follow a standard fit, available from XS to XL. A detailed size guide is available on each product page.',
  },
  {
    question: 'Do you ship outside Nigeria?',
    answer: 'Yes. The NUEL Fashion online store ships globally. International shipping costs are calculated at checkout. Delivery times vary: 3–5 days within Nigeria, 7–14 days internationally.',
  },
  {
    question: "What is your returns policy?",
    answer: 'We accept returns and exchanges within 14 days of delivery for unworn items with tags intact. Sale and limited edition items are final sale. Contact hello@nuelfashion.com to initiate a return.',
  },
  {
    question: 'How does volume pricing work?',
    answer: 'Buy 1 item at the standard price. Buy 2–3 items and each item is automatically discounted by 10%. Buy 4 or more items and each item gets 20% off. Discounts apply to every item in your cart and are calculated automatically at checkout.',
  },
  {
    question: 'How do I pay?',
    answer: "NUEL Fashion processes payments securely through Paystack. We accept cards, bank transfers, and USSD payments. Your card details are never stored on our servers.",
  },
]

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ContactPage() {
  useEffect(() => { document.title = 'Contact — NUEL Fashion' }, [])

  const { showToast } = useUI()

  const [form, setForm] = useState({
    name: '', email: '', subject: 'order', message: '',
  })

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    showToast('Message sent. We will reply within 24 hours.')
    setForm({ name: '', email: '', subject: 'order', message: '' })
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    border border-gray-200 dark:border-gray-700
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    placeholder:text-gray-400
    focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20
  `

  return (
    <div className="pb-20">

      {/* ── PAGE HERO ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-50 to-mist dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <h1 className="font-display text-5xl font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">We are here. Real humans, kingdom heart.</p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-12 space-y-20">

        {/* ── CONTACT GRID ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact form */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder="Your name" className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="you@example.com" className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => updateForm('subject', e.target.value)}
                  className={inputClass}
                >
                  <option value="order">Order enquiry</option>
                  <option value="returns">Returns and exchanges</option>
                  <option value="collab">Collaboration</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Message</label>
                <textarea
                  required rows={6} value={form.message}
                  onChange={e => updateForm('message', e.target.value)}
                  placeholder="How can we help?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info column */}
          <div className="space-y-5">

            {/* Support details */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">Support Details</h3>
              <div className="space-y-4">
                {[
                  { icon: '✉️', label: 'Email',         value: 'hello@nuelfashion.com', href: 'mailto:hello@nuelfashion.com' },
                  { icon: '⏰', label: 'Response Time', value: 'Within 24 hours' },
                  { icon: '📍', label: 'Location',      value: 'Lagos, Nigeria' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-covenant hover:underline font-medium">{item.value}</a>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-5">Follow the Movement</h3>
              <div className="space-y-3">
                {[
                  { label: 'Instagram', href: '#' },
                  { label: 'TikTok',    href: '#' },
                  { label: 'Twitter',   href: '#' },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      border border-gray-100 dark:border-gray-700
                      text-sm font-medium text-gray-600 dark:text-gray-300
                      hover:border-covenant hover:text-covenant
                      transition-colors
                    "
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Live chat card */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-success uppercase tracking-wide mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse-dot inline-block" />
                Live support available
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white mb-2">Chat with us</h3>
              <p className="text-sm text-gray-400 mb-5">Get instant answers from our support team.</p>
              <button
                onClick={() => showToast('Live chat launching soon...')}
                className="w-full py-3 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors"
              >
                Start Live Chat
              </button>
            </div>

          </div>
        </div>

        {/* ── FAQ SECTION ──────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
