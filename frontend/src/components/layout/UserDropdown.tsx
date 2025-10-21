'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Shield,
  HeadphonesIcon
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import LogoutConfirmation from '@/components/common/LogoutConfirmation'
import { User as UserType } from '@/types/user.types'

const UserDropdown = () => {
  const router = useRouter()
  const { user, logout, refreshUser } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Log user data for debugging
  useEffect(() => {
    console.log('User data in UserDropdown:', user)
  }, [user])

  // Refresh user data when component mounts
  useEffect(() => {
    console.log('Refreshing user data in UserDropdown')
    refreshUser()
  }, [refreshUser])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      await logout()
      setIsOpen(false)
      setShowLogoutConfirm(false)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoutClick = () => {
    setIsOpen(false)
    setShowLogoutConfirm(true)
  }

  const switchToAdminDashboard = () => {
    router.push('/admin')
    setIsOpen(false)
  }

  const switchToUserDashboard = () => {
    router.push('/dashboard')
    setIsOpen(false)
  }

  // Redirect admin users to admin dashboard automatically
  useEffect(() => {
    console.log('Checking user role for redirect:', user?.role)
    if (user?.role === 'admin' && window.location.pathname === '/dashboard') {
      console.log('Redirecting admin user to admin dashboard')
      router.push('/admin')
    }
  }, [user, router])

  // Generate display name with fallbacks
  const getDisplayName = () => {
    console.log('Getting display name for user:', user)
    if (user?.name && user.name !== 'undefined') return user.name
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
    if (user?.firstName) return user.firstName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  // Get user role with fallback
  const getUserRole = () => {
    console.log('Getting user role:', user?.role)
    if (user?.role) return user.role
    return 'member'
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: user?.role === 'admin' ? '/admin' : '/dashboard',
      description: 'Access your dashboard'
    },
    {
      icon: HeadphonesIcon,
      label: 'User Guide',
      href: '/guide',
      description: 'Learn how to use all features'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: user?.role === 'admin' ? '/admin/settings' : '/dashboard/settings',
      description: 'Account and privacy settings'
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: user?.role === 'admin' ? '/admin/notifications' : '/dashboard/notifications',
      description: 'Manage your notifications'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/help',
      description: 'Get help and support'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={getDisplayName()}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        )}
        <div className="hidden sm:block">
          <span className="text-sm font-medium text-gray-700">
            {getDisplayName()}
          </span>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 capitalize">{getUserRole()}</span>
            <ChevronDown 
              size={12} 
              className={`ml-1 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={getDisplayName()}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                    {getUserRole()}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems
                .filter(item => !(user?.role === 'admin' && window.location.pathname.startsWith('/admin') && 
                  (item.label === 'Settings' || item.label === 'Notifications')))
                .map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <item.icon size={16} className="text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut size={16} className="mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirmation
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            isLoading={isLoggingOut}
            userName={getDisplayName()}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDropdown