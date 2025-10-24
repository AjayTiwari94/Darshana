'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAdmin?: boolean
}

/**
 * Component to protect routes that require authentication
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login',
  requireAdmin = false 
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token')
    
    if (!token && !isLoading) {
      // No token, redirect to login
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`
      router.push(loginUrl)
      return
    }

    // If requires admin and user is not admin
    if (requireAdmin && user && user.role !== 'admin') {
      router.push('/')
      return
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, pathname, requireAdmin])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show loading if no token
  const token = localStorage.getItem('token')
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // If requires admin and user is not admin, show loading
  if (requireAdmin && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}

export default ProtectedRoute


