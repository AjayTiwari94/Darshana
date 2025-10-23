'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, User, MessageCircle, LayoutDashboard, HeadphonesIcon } from 'lucide-react'
import { useAuthStore, useUIStore } from '@/store'
import SearchModal from '@/components/common/SearchModal'
import NaradAIButton from '@/components/narad-ai/NaradAIButton'
import UserDropdown from '@/components/layout/UserDropdown'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const uiStore = useUIStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Monuments', href: '/monuments' },
    { name: 'Stories', href: '/stories' },
    { name: 'Virtual Visit', href: '/virtual-visits' },
    { name: 'Treasure Hunt', href: '/treasure-hunt' },
    { name: 'Tickets', href: '/tickets' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="font-sans font-bold text-lg text-gray-900">
                  Darshana
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-2 py-1.5 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                    )}
                    {isActive && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary-600 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button
                onClick={() => {
                  // @ts-ignore
                  uiStore.setSearchModalOpen(true)
                }}
                className="p-1.5 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Narad AI Button */}
              <div className="relative">
                <NaradAIButton />
              </div>

              {/* User Menu */}
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <nav className="flex flex-col space-y-1.5">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      } rounded-lg`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-primary-600 rounded-full ml-auto" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        // Redirect to appropriate dashboard based on user role
                        if (user?.role === 'admin') {
                          router.push('/admin')
                        } else {
                          router.push('/dashboard')
                        }
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    >
                      <LayoutDashboard size={14} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={async () => {
                        await logout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/auth/login"
                      className="text-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary text-sm text-center px-3 py-1.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal />
    </>
  )
}

export default Header