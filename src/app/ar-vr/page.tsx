'use client'

import React from 'react'
import { View, Smartphone } from 'lucide-react'
import Link from 'next/link'

const ArVrPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="text-center p-8 bg-gradient-to-r from-primary-600 to-secondary-600">
            <View className="h-16 w-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">AR/VR Experiences</h1>
            <p className="text-xl text-white opacity-90">
              Immersive Cultural Heritage Experiences
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Coming Soon!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're working on bringing you immersive AR and VR experiences to explore India's rich cultural heritage.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <Smartphone className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Augmented Reality (AR)
                </h3>
                <p className="text-gray-700">
                  Experience historical monuments in your space with AR technology. See ancient structures come to life through your device.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <View className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Virtual Reality (VR)
                </h3>
                <p className="text-gray-700">
                  Step inside India's heritage sites with immersive VR experiences. Explore temples, forts, and palaces like never before.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Features:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">360° virtual tours of famous monuments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">AR overlays with historical information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Interactive 3D models of architectural wonders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">Time-travel experiences to see monuments in their prime</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span className="text-gray-700">VR headset support for full immersion</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                In the meantime, explore our other features:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/monuments"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Explore Monuments
                </Link>
                <Link
                  href="/cultural-stories"
                  className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Cultural Stories
                </Link>
                <Link
                  href="/tickets"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Book Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArVrPage
