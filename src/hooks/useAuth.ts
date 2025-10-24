import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store'

/**
 * Hook to check if user is authenticated
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading,
  }
}

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export const useRequireAuth = (redirectUrl: string = '/auth/login') => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, setLoading } = useAuthStore()

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('token')
    
    if (!token && !isLoading) {
      // No token found, redirect to login
      const loginUrl = `${redirectUrl}?redirect=${encodeURIComponent(pathname)}`
      router.push(loginUrl)
    }

    if (token && !isAuthenticated) {
      // Token exists but user not loaded, fetch user data
      setLoading(false)
    }
  }, [isAuthenticated, isLoading, router, redirectUrl, pathname, setLoading])

  return { isAuthenticated, isLoading }
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export const useRedirectIfAuthenticated = (redirectUrl: string = '/dashboard') => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, isLoading, router, redirectUrl])

  return { isAuthenticated, isLoading }
}


