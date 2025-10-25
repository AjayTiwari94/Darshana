'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const HeritageCarousel: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore India's Rich Heritage
          </h2>
          <p className="text-lg text-gray-600">
            Discover the stories behind our magnificent monuments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Historical Monuments
              </h3>
              <p className="text-gray-600">
                Explore the architectural marvels of ancient India
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cultural Stories
              </h3>
              <p className="text-gray-600">
                Immerse yourself in the legends and myths
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-red-400 to-pink-500"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sacred Places
              </h3>
              <p className="text-gray-600">
                Experience the spiritual essence of India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeritageCarousel




