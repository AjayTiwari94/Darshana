'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Clock, TrendingUp } from 'lucide-react'
import { useUIStore } from '@/store'

const SearchModal = () => {
  const uiStore = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const recentSearches = [
    'Taj Mahal',
    'Red Fort',
    'Hampi',
    'Ajanta Caves',
    'Mysore Palace'
  ]

  const trendingSearches = [
    'Ramayana stories',
    'Ghost stories',
    'Mughal architecture',
    'Temple mysteries',
    'Folk tales'
  ]

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // @ts-ignore
        uiStore.setSearchModalOpen(false)
      }
    }

    // @ts-ignore
    if (uiStore.searchModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [uiStore])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock results
      const mockResults = [
        {
          type: 'monument',
          id: '1',
          title: 'Taj Mahal',
          subtitle: 'Agra, Uttar Pradesh',
          description: 'Symbol of eternal love and Mughal architecture',
          image: '/taj-mahal.jpg'
        },
        {
          type: 'story',
          id: '2',
          title: 'The Legend of Shah Jahan',
          subtitle: 'Mythology • Taj Mahal',
          description: 'The romantic tale behind the creation of Taj Mahal',
          image: '/images/shah-jahan.jpg'
        }
      ]
      
      setResults(mockResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleClose = () => {
    // @ts-ignore
    uiStore.setSearchModalOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <AnimatePresence>
      {/* @ts-ignore */}
      {uiStore.searchModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center px-6 py-4 border-b border-gray-200">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search monuments, stories, experiences..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg outline-none placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {query ? (
                  <div className="p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Search Results
                        </h3>
                        {results.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <MapPin size={20} className="text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{result.title}</h4>
                              <p className="text-sm text-gray-500">{result.subtitle}</p>
                              <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No results found for "{query}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Clock className="text-gray-400 mr-2" size={16} />
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Recent Searches
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Searches */}
                    <div>
                      <div className="flex items-center mb-3">
                        <TrendingUp className="text-gray-400 mr-2" size={16} />
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Trending Now
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setQuery(search)}
                            className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg text-left hover:from-primary-100 hover:to-secondary-100 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal