/**
 * AUTH CONTEXT
 * ============
 * FILE: src/store/AuthContext.jsx
 *
 * WHAT THIS MANAGES:
 *   - The currently logged-in user (or null if not logged in)
 *   - Login and logout functions available everywhere
 *   - Auto-detects if a user is already logged in on page load
 *     (Supabase stores session in the browser automatically)
 *
 * HOW TO USE:
 *   import { useAuth } from '../store/AuthContext'
 *   const { user, login, logout, isLoading } = useAuth()
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, signUpUser, logoutUser, onAuthChange } from '../services/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [isLoading, setIsLoading] = useState(true) // true while checking session

  // ── Listen for Supabase auth state changes ──────────────────────────────
  // This handles:
  //   - User was already logged in from a previous visit (session restore)
  //   - User logs in or out anywhere in the app
  useEffect(() => {
    // onAuthChange returns an unsubscribe function
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    // Cleanup: stop listening when this component unmounts
    return () => unsubscribe()
  }, [])

  /**
   * Log in with email and password.
   * @returns {{ error: string|null }}
   */
  async function login(email, password) {
    const { user: loggedInUser, error } = await loginUser(email, password)
    if (!error) setUser(loggedInUser)
    return { error }
  }

  /**
   * Create a new account.
   * @returns {{ error: string|null }}
   */
  async function signup(name, email, password) {
    const { user: newUser, error } = await signUpUser(name, email, password)
    if (!error) setUser(newUser)
    return { error }
  }

  /**
   * Log the current user out.
   */
  async function logout() {
    await logoutUser()
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,                      // true while checking if user is logged in
    isLoggedIn: user !== null,      // convenient boolean
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>. Check App.jsx.')
  }
  return context
}
