/**
 * PAYMENTS SERVICE
 * ================
 * FILE: src/services/payments.js
 *
 * WHAT THIS FILE DOES:
 *   Handles the Paystack payment flow.
 *   Paystack is the payment gateway — it securely collects
 *   card details and processes the payment so we never
 *   touch sensitive financial information directly.
 *
 * HOW PAYSTACK WORKS:
 *   1. We call PaystackPop.setup() with the order total + email
 *   2. Paystack opens its own secure payment popup
 *   3. Customer enters their card details in Paystack's popup
 *   4. Paystack tells us if payment succeeded (callback)
 *      or if customer cancelled (onClose)
 *   5. On success, we save the order to Supabase
 *
 * REQUIREMENT:
 *   The Paystack inline script must be loaded in index.html:
 *   <script src="https://js.paystack.co/v1/inline.js"></script>
 */

import CONFIG from '../config/app.config.js'

/**
 * Initiate a Paystack payment.
 *
 * @param {Object} options
 * @param {string}   options.email       - Customer email (required by Paystack)
 * @param {number}   options.amountNGN   - Amount in Naira (we convert to kobo internally)
 * @param {Function} options.onSuccess   - Called with Paystack reference when payment succeeds
 * @param {Function} options.onCancel    - Called when customer closes payment popup
 *
 * IMPORTANT:
 *   Paystack requires amounts in KOBO (1 Naira = 100 Kobo).
 *   So ₦15,000 → 1,500,000 kobo. We handle this conversion here.
 *
 * USAGE:
 *   initiatePaystack({
 *     email: 'customer@email.com',
 *     amountNGN: 15000,
 *     onSuccess: (ref) => saveOrder({ paystackRef: ref.reference }),
 *     onCancel: () => showToast('Payment cancelled'),
 *   })
 */
export function initiatePaystack({ email, amountNGN, onSuccess, onCancel }) {
  // Check Paystack script is loaded
  if (typeof window.PaystackPop === 'undefined') {
    console.error('[PaymentsService] Paystack script not loaded. Check index.html.')
    return
  }

  // Generate a unique reference for this transaction
  const reference = `NUEL_${Date.now()}_${Math.random().toString(36).slice(2, 9).toUpperCase()}`

  const handler = window.PaystackPop.setup({
    key:      CONFIG.PAYSTACK.publicKey,
    email:    email,
    amount:   amountNGN * 100, // Convert Naira → Kobo
    currency: 'NGN',
    ref:      reference,

    // Called when payment is successful
    callback: function (response) {
      if (onSuccess) onSuccess(response)
    },

    // Called when customer closes the payment popup without paying
    onClose: function () {
      if (onCancel) onCancel()
    },
  })

  // Open the Paystack payment popup
  handler.openIframe()
}
