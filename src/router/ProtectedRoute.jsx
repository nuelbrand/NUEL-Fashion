/**
 * PROTECTED ROUTE
 * ===============
 * FILE: src/router/ProtectedRoute.jsx
 *
 * WHAT THIS DOES:
 *   Guards certain pages so only logged-in users can see them.
 *   If a user tries to visit /account/profile without being
 *   logged in, they are automatically redirected to /login.
 *
 * HOW IT WORKS:
 *   1. Checks if the auth state has finished loading (isLoading)
 *   2. If still loading → shows nothing (prevents flicker)
 *   3. If not logged in → redirects to /login
 *   4. If logged in → shows the actual page
 *
 * USAGE (in router/index.jsx):
 *   {
 *     element: <ProtectedRoute />,
 *     children: [
 *       { path: '/account/profile', element: <ProfilePage /> },
 *     ]
 *   }
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth()

  // Still checking if user is logged in — show nothing to prevent flicker
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-covenant border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → redirect to login page
  // The `replace` prop replaces the history entry so the user
  // can't press "back" to get to the protected page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Logged in → render the actual child page
  // <Outlet /> is where React Router puts the child page content
  return <Outlet />
}
