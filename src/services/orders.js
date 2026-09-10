/**
 * ORDERS SERVICE
 * ==============
 * FILE: src/services/orders.js
 *
 * WHAT THIS FILE DOES:
 *   Functions for saving orders to Supabase after a successful
 *   Paystack payment, and for fetching order history.
 *
 * ORDER FLOW:
 *   1. Customer fills checkout form
 *   2. Paystack payment succeeds → returns a reference number
 *   3. We call saveOrder() to record the order in Supabase
 *   4. Customer can view their orders via getOrdersByUser()
 */

import supabase from './supabase.js'

/**
 * Save a completed order to the Supabase 'orders' table.
 *
 * @param {Object} orderData
 * @param {string}   orderData.userId        - Logged-in user ID (or null for guest)
 * @param {string}   orderData.email         - Customer email
 * @param {string}   orderData.firstName     - Customer first name
 * @param {string}   orderData.lastName      - Customer last name
 * @param {string}   orderData.phone         - Customer phone
 * @param {string}   orderData.address       - Delivery address
 * @param {Array}    orderData.items         - Cart items array
 * @param {number}   orderData.subtotal      - Before discount (in NGN)
 * @param {number}   orderData.discount      - Discount amount (in NGN)
 * @param {number}   orderData.total         - Final total (in NGN)
 * @param {string}   orderData.paystackRef   - Paystack payment reference
 *
 * @returns {Promise<{ order: Object|null, error: string|null }>}
 */
export async function saveOrder(orderData) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id:       orderData.userId || null,
        email:         orderData.email,
        first_name:    orderData.firstName,
        last_name:     orderData.lastName,
        phone:         orderData.phone,
        address:       orderData.address,
        items:         orderData.items,       // stored as JSON
        subtotal:      orderData.subtotal,
        discount:      orderData.discount,
        total:         orderData.total,
        paystack_ref:  orderData.paystackRef,
        status:        'paid',                // initial status after payment
        created_at:    new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error

    return { order: data, error: null }
  } catch (err) {
    console.error('[OrdersService] Failed to save order:', err.message)
    return { order: null, error: err.message }
  }
}

/**
 * Get all orders for a specific user (for the order history page).
 *
 * @param {string} userId - The logged-in user's Supabase ID
 * @returns {Promise<Array>} - Array of orders, newest first
 */
export async function getOrdersByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (err) {
    console.error('[OrdersService] Failed to load orders:', err.message)
    return []
  }
}
