/**
 * AUTH SERVICE
 * ============
 * FILE: src/services/auth.js
 *
 * WHAT THIS FILE DOES:
 *   All functions related to user accounts:
 *   signing in, signing up, signing out, and
 *   getting the currently logged-in user.
 *
 * HOW AUTH WORKS IN THIS APP:
 *   Supabase handles ALL the hard parts:
 *   - Storing passwords securely (hashed, never plain text)
 *   - Managing sessions (staying logged in between visits)
 *   - Email verification
 *
 *   We just call Supabase functions and handle the result.
 */

import supabase from './supabase.js'

/**
 * Sign in with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object|null, error: string|null }>}
 *
 * USAGE:
 *   const { user, error } = await loginUser('me@email.com', 'mypassword')
 *   if (error) showToast(error)
 *   else setUser(user)
 */
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { user: null, error: error.message }

    return { user: data.user, error: null }
  } catch (err) {
    return { user: null, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Create a new account with name, email, and password.
 *
 * @param {string} name     - User's full name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object|null, error: string|null }>}
 */
export async function signUpUser(name, email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }, // Stored in user metadata
      },
    })

    if (error) return { user: null, error: error.message }

    return { user: data.user, error: null }
  } catch (err) {
    return { user: null, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Sign the current user out.
 *
 * @returns {Promise<{ error: string|null }>}
 */
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    return { error: null }
  } catch (err) {
    return { error: 'Could not sign out. Please try again.' }
  }
}

/**
 * Get the currently logged-in user (if any).
 * Returns null if nobody is logged in.
 *
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (err) {
    return null
  }
}

/**
 * Listen for auth state changes (login/logout events).
 * Useful for keeping your app's user state in sync.
 *
 * @param {Function} callback - Called whenever the user logs in or out
 * @returns {Function} unsubscribe - Call this to stop listening
 *
 * USAGE (in AuthContext.jsx):
 *   const unsub = onAuthChange((user) => setUser(user))
 *   return () => unsub() // cleanup on unmount
 */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null)
    }
  )

  // Return the unsubscribe function so the caller can clean up
  return () => subscription.unsubscribe()
}
