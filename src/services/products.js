/**
 * PRODUCTS SERVICE
 * ================
 * FILE: src/services/products.js
 *
 * WHAT THIS FILE DOES:
 *   Contains all the functions that talk to Supabase
 *   to fetch product data. Components never talk to
 *   Supabase directly — they call these functions instead.
 *
 * WHY THIS SEPARATION?
 *   If you ever switch from Supabase to another database,
 *   you only change THIS file. Every component stays the same.
 *
 * FUNCTIONS IN THIS FILE:
 *   loadAllProducts()      → get every product in the database
 *   getProductById(id)     → get one specific product
 *   getFeaturedProducts()  → get only the featured products
 *   getImageUrl(imagePath) → build the full image URL from storage
 */

import supabase from './supabase.js'
import CONFIG from '../config/app.config.js'

/**
 * Load every product from the Supabase 'products' table.
 *
 * @returns {Promise<Array>} - Array of product objects, or empty array on error
 *
 * EXAMPLE PRODUCT OBJECT:
 * {
 *   id: 'tee-001',
 *   name: 'Rooted in Love Tee',
 *   price: 15000,          ← price in Naira (NGN)
 *   category: 'tee',
 *   gender: 'men',
 *   sizes: ['XS','S','M','L','XL'],
 *   colours: ['covenant','holiness'],
 *   image_url: 'rooted-tee.jpg',
 *   badge: 'new',          ← optional: 'new' | 'limited' | 'sale'
 *   featured: true,        ← shows on homepage
 *   description: '...'
 * }
 */
export async function loadAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (err) {
    console.error('[ProductsService] Failed to load products:', err.message)
    return []
  }
}

/**
 * Get a single product by its ID.
 *
 * @param {string} id - The product ID (e.g. 'tee-001')
 * @returns {Promise<Object|null>} - Product object or null if not found
 */
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single() // .single() returns one object instead of an array

    if (error) throw error

    return data
  } catch (err) {
    console.error('[ProductsService] Failed to get product:', err.message)
    return null
  }
}

/**
 * Get only the products marked as featured (for the homepage).
 *
 * @param {number} limit - How many featured products to return (default: 4)
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (err) {
    console.error('[ProductsService] Failed to load featured products:', err.message)
    return []
  }
}

/**
 * Build the full image URL for a product image stored in Supabase Storage.
 *
 * Supabase Storage stores images as files in a "bucket".
 * To show them in the browser, we need the full URL.
 *
 * @param {string} imagePath - The image filename from the product (e.g. 'rooted-tee.jpg')
 * @returns {string|null} - Full URL or null if no image
 *
 * EXAMPLE:
 *   getImageUrl('rooted-tee.jpg')
 *   → 'https://xyz.supabase.co/storage/v1/object/public/product-images/rooted-tee.jpg'
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null

  return `${CONFIG.SUPABASE.url}/storage/v1/object/public/${CONFIG.IMAGE_BUCKET}/${imagePath}`
}
