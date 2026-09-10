/**
 * useProducts HOOK
 * ================
 * FILE: src/hooks/useProducts.js
 *
 * WHAT IS A HOOK?
 *   A hook is a special React function (starts with "use")
 *   that adds reusable logic to your components.
 *
 * WHAT THIS HOOK DOES:
 *   Fetches ALL products from Supabase once, then provides
 *   filter functions so pages can show the right subset.
 *
 *   This is more efficient than fetching separately on
 *   every page — we fetch once and filter in memory.
 *
 * HOW TO USE:
 *   // In MenPage.jsx:
 *   const { products, isLoading, error } = useProducts({ gender: 'men' })
 *
 *   // In HomePage.jsx:
 *   const { products } = useProducts({ featured: true, limit: 4 })
 */

import { useState, useEffect, useMemo } from 'react'
import { loadAllProducts } from '../services/products.js'

// ─── GLOBAL CACHE ──────────────────────────────────────────────────────────
// We store all products here so we only fetch from Supabase ONCE,
// even if multiple components use this hook.
let productCache = null
let fetchPromise = null

export function useProducts(filters = {}) {
  const [allProducts, setAllProducts] = useState(productCache || [])
  const [isLoading, setIsLoading]     = useState(!productCache)
  const [error, setError]             = useState(null)

  // ── Fetch all products (once, then cache) ───────────────────────────────
  useEffect(() => {
    if (productCache) {
      // Already have data — no need to fetch again
      setAllProducts(productCache)
      setIsLoading(false)
      return
    }

    // If a fetch is already in progress (another component beat us to it),
    // wait for that same fetch to finish instead of starting a duplicate
    if (!fetchPromise) {
      fetchPromise = loadAllProducts()
    }

    fetchPromise
      .then(data => {
        productCache = data          // store in cache
        setAllProducts(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  // ── Apply filters ───────────────────────────────────────────────────────
  // useMemo re-calculates only when allProducts or filters change
  const products = useMemo(() => {
    let result = [...allProducts]

    // Filter by gender (e.g. 'men' or 'women')
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender)
    }

    // Filter: featured only
    if (filters.featured) {
      result = result.filter(p => p.featured === true)
    }

    // Filter by category (array of strings, e.g. ['tee', 'hoodie'])
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }

    // Filter by size
    if (filters.size && filters.size !== 'all') {
      result = result.filter(p =>
        Array.isArray(p.sizes) && p.sizes.includes(filters.size)
      )
    }

    // Filter by max price
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice)
    }

    // Filter by colour
    if (filters.colour && filters.colour !== 'all') {
      result = result.filter(p =>
        Array.isArray(p.colours) && p.colours.includes(filters.colour)
      )
    }

    // Filter by search query (name, description, category)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    // Limit number of results
    if (filters.limit) {
      result = result.slice(0, filters.limit)
    }

    return result
  }, [allProducts, JSON.stringify(filters)]) // eslint-disable-line

  return { products, isLoading, error, totalCount: allProducts.length }
}
