/**
 * ACCOUNT MODAL COMPONENT
 * =======================
 * FILE: src/components/ui/AccountModal.jsx
 *
 * WHAT THIS IS:
 *   The popup modal for signing in or creating an account.
 *   Has two tabs: "Sign In" and "Create Account".
 *   Uses Supabase Auth via our AuthContext.
 */

import { useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import { useUI }   from '../../store/UIContext'

export default function AccountModal() {
  const { login, signup, isLoggedIn, user, logout } = useAuth()
  const { drawers, closeDrawer, showToast }          = useUI()

  const [activeTab, setActiveTab]   = useState('login')
  const [isLoading, setIsLoading]   = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup form state
  const [signupName, setSignupName]         = useState('')
  const [signupEmail, setSignupEmail]       = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  const isOpen = drawers.account

  async function handleLogin(e) {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await login(loginEmail, loginPassword)
    setIsLoading(false)
    if (error) { showToast(error); return }
    showToast('Welcome back!')
    closeDrawer('account')
  }

  async function handleSignup(e) {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signup(signupName, signupEmail, signupPassword)
    setIsLoading(false)
    if (error) { showToast(error); return }
    showToast('Account created! Check your email to verify.')
    closeDrawer('account')
  }

  async function handleLogout() {
    await logout()
    showToast('Signed out successfully')
    closeDrawer('account')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={() => closeDrawer('account')}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Logged in state */}
        {isLoggedIn ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-covenant rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back!
            </h2>
            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:border-brand-error hover:text-brand-error transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-6">
              {[
                { key: 'login',  label: 'Sign In' },
                { key: 'signup', label: 'Create Account' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-200
                    ${activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-covenant shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Login form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
                  <p className="text-sm text-gray-400 mb-5">Sign in to your NUEL account</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email" required value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <input
                    type="password" required value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20 text-sm"
                  />
                </div>
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                <p className="text-center text-sm text-gray-400">
                  <a href="#" className="text-covenant hover:underline">Forgot password?</a>
                </p>
              </form>
            )}

            {/* Signup form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Join the movement</h2>
                  <p className="text-sm text-gray-400 mb-5">Create your NUEL Fashion account</p>
                </div>
                {[
                  { label: 'Full Name', type: 'text', value: signupName, set: setSignupName, placeholder: 'Your name' },
                  { label: 'Email', type: 'email', value: signupEmail, set: setSignupEmail, placeholder: 'you@example.com' },
                  { label: 'Password', type: 'password', value: signupPassword, set: setSignupPassword, placeholder: 'Create a password' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{field.label}</label>
                    <input
                      type={field.type} required value={field.value}
                      onChange={e => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-covenant focus:ring-2 focus:ring-covenant/20 text-sm"
                    />
                  </div>
                ))}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-3.5 bg-covenant text-white font-semibold rounded-full hover:bg-deep-heaven disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
