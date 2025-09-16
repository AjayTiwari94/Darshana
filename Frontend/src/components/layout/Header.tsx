'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, User, MessageCircle, Globe } from 'lucide-react'
import { useAuthStore, useUIStore } from '@/store'
import SearchModal from '@/components/common/SearchModal'
import NaradAIButton from '@/components/narad-ai/NaradAIButton'
import UserDropdown from '@/components/layout/UserDropdown'

const Header = () => {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuthStore()
  const { sidebarOpen, setSidebarOpen, setSearchModalOpen } = useUIStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'Home', href: '/', icon: Globe },
    { name: 'Monuments', href: '/monuments', icon: Globe },
    { name: 'Stories', href: '/stories', icon: Globe },
    { name: 'Virtual Visit', href: '/virtual-visits', icon: Globe },
    { name: 'Treasure Hunt', href: '/quests', icon: Globe },
    { name: 'Tickets', href: '/tickets', icon: Globe },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="font-display font-bold text-xl text-gray-900">
                  Darshana
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Narad AI Button */}
              <NaradAIButton />

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
                    className="btn-primary text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      } rounded-lg`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>My Account</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await logout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/auth/login"
                      className="text-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary text-sm text-center"
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