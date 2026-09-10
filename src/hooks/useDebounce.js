/**
 * useDebounce HOOK
 * ================
 * FILE: src/hooks/useDebounce.js
 *
 * WHAT THIS DOES:
 *   Returns a "delayed" version of a value.
 *   The delayed value only updates after the user
 *   has stopped changing it for X milliseconds.
 *
 * WHY WE NEED THIS:
 *   In the search bar, we don't want to search on
 *   every single keystroke — that's too many requests.
 *   We wait until the user pauses typing for 300ms,
 *   then search. This is called "debouncing."
 *
 * HOW TO USE:
 *   const [query, setQuery] = useState('')
 *   const debouncedQuery = useDebounce(query, 300)
 *
 *   // debouncedQuery only updates 300ms after user stops typing
 *   useEffect(() => {
 *     if (debouncedQuery) runSearch(debouncedQuery)
 *   }, [debouncedQuery])
 */

import { useState, useEffect } from 'react'

/**
 * @param {any}    value - The value to debounce (usually a search string)
 * @param {number} delay - Milliseconds to wait before updating
 * @returns {any}        - The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If value changes before the timer fires, cancel the timer
    // and start a new one. This is how debouncing works.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
