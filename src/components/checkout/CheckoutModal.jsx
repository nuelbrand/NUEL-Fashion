/**
 * CHECKOUT MODAL COMPONENT
 * ========================
 * FILE: src/components/checkout/CheckoutModal.jsx
 *
 * WHAT THIS IS:
 *   The checkout popup with two steps:
 *   Step 1 → Customer fills in their information (name, email, address)
 *   Step 2 → Review order summary and pay with Paystack
 *
 *   On successful payment, the order is saved to Supabase
 *   and the cart is cleared.
 */

import { useState }       from 'react'
import { useCart }        from '../../store/CartContext'
import { useUI }          from '../../store/UIContext'
import { useAuth }        from '../../store/AuthContext'
import { formatPrice }    from '../../utils/currency.js'
import { initiatePaystack } from '../../services/payments.js'
import { saveOrder }      from '../../services/orders.js'

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm
  border border-gray-200 dark:border-gray-700
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-white
  placeholder:text-gray-400
  focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20
`

export default function CheckoutModal() {
  const { cartItems, subtotal, discount, total, clearCart } = useCart()
  const { drawers, closeDrawer, currency, showToast }       = useUI()
  const { user }                                            = useAuth()

  const [step, setStep]       = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Form fields
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '',
  })

  const isOpen = drawers.checkout

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleProceed(e) {
    e.preventDefault()
    if (!form.email || !form.firstName) {
      showToast('Please fill in all required fields')
      return
    }
    setStep(2)
  }

  async function handlePayment() {
    setIsLoading(true)
    initiatePaystack({
      email:     form.email,
      amountNGN: total,
      onSuccess: async (response) => {
        // Save order to Supabase
        const { error } = await saveOrder({
          userId:      user?.id || null,
          email:       form.email,
          firstName:   form.firstName,
          lastName:    form.lastName,
          phone:       form.phone,
          address:     form.address,
          items:       cartItems,
          subtotal,
          discount,
          total,
          paystackRef: response.reference,
        })
        setIsLoading(false)
        clearCart()
        closeDrawer('checkout')
        showToast(`Order confirmed! Ref: ${response.reference}`)
        setStep(1) // Reset for next time
        setForm({ firstName: '', lastName: '', email: '', phone: '', address: '' })
      },
      onCancel: () => {
        setIsLoading(false)
        showToast('Payment cancelled')
      },
    })
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={() => { closeDrawer('checkout'); setStep(1) }}
          aria-label="Close checkout"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ── LEFT: FORM ─────────────────────────────────────────── */}
          <div className="p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {step === 1 ? 'Your Information' : 'Confirm & Pay'}
            </h2>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-7">
              {[1, 2].map(s => (
                <div key={s} className={`flex items-center gap-2 ${s < 2 ? 'flex-1' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-covenant text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-covenant' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <form onSubmit={handleProceed} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">First Name *</label>
                    <input type="text" required value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} placeholder="First name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Last Name</label>
                    <input type="text" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} placeholder="Last name" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="your@email.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+234 800 000 0000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Delivery Address</label>
                  <textarea rows={3} value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder="Full delivery address" className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven transition-colors flex items-center justify-center gap-2">
                  Continue to Payment
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.firstName} {form.lastName}</p>
                  <p className="text-sm text-gray-500">{form.email}</p>
                  {form.phone && <p className="text-sm text-gray-500">{form.phone}</p>}
                  {form.address && <p className="text-sm text-gray-500">{form.address}</p>}
                </div>

                <div className="border-2 border-covenant/20 rounded-2xl p-4 flex items-center gap-3">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-covenant">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Card / Bank Transfer</p>
                    <p className="text-xs text-covenant font-medium">via Paystack</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  You will be redirected to Paystack's secure payment page to complete your transaction.
                </p>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  {isLoading ? 'Processing...' : `Pay ${formatPrice(total, currency)} Securely`}
                </button>

                <button onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-covenant transition-colors">
                  ← Back to information
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ────────────────────────────────── */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-r-3xl p-8 border-l border-gray-100 dark:border-gray-800">
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
              Order Summary
            </h3>

            <div className="space-y-3 mb-5">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm gap-4">
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {item.product?.name} ({item.size}) ×{item.qty}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium flex-shrink-0">
                    {formatPrice(item.product?.price * item.qty, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-brand-success font-medium">
                  <span>Volume Discount</span>
                  <span>−{formatPrice(discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at delivery</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span>
                <span className="text-covenant">{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex gap-4 mt-6 justify-center">
              {['SSL Secured', 'Paystack Protected'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
