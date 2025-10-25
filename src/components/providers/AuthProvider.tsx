'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store'

/**
 * AuthProvider - Initializes authentication state on app load
 * This component should be placed at the root of the app
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth state on mount
    initialize()
  }, [initialize])

  return <>{children}</>
}

export default AuthProvider






