'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPinIcon, 
  TruckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface TransportIntegrationProps {
  monumentName: string
  monumentLocation: string
  userLocation?: {
    lat: number
    lng: number
    address: string
  }
  onClose?: () => void
}

interface TransportOption {
  id: string
  provider: 'uber' | 'ola' | 'rapido' | 'auto'
  name: string
  type: string
  estimatedTime: string
  estimatedFare: number
  logo: string
  deepLink: string
  availability: 'available' | 'high_demand' | 'unavailable'
}

export default function TransportIntegration({
  monumentName,
  monumentLocation,
  userLocation,
  onClose
}: TransportIntegrationProps) {
  const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock transport options - in production, these would come from actual APIs
  const transportOptions: TransportOption[] = [
    {
      id: 'uber-go',
      provider: 'uber',
      name: 'Uber Go',
      type: 'Hatchback',
      estimatedTime: '5-8 mins',
      estimatedFare: 180,
      logo: '🚗',
      deepLink: `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=28.6139&dropoff[longitude]=77.2090&dropoff[nickname]=${encodeURIComponent(monumentName)}`,
      availability: 'available'
    },
    {
      id: 'uber-premier',
      provider: 'uber',
      name: 'Uber Premier',
      type: 'Sedan',
      estimatedTime: '7-10 mins',
      estimatedFare: 280,
      logo: '🚙',
      deepLink: `uber://?action=setPickup&pickup=my_location&product_id=uber_premier&dropoff[latitude]=28.6139&dropoff[longitude]=77.2090`,
      availability: 'available'
    },
    {
      id: 'ola-mini',
      provider: 'ola',
      name: 'Ola Mini',
      type: 'Hatchback',
      estimatedTime: '6-9 mins',
      estimatedFare: 175,
      logo: '🚕',
      deepLink: `olacabs://app/launch?lat=28.6139&lng=77.2090&drop_name=${encodeURIComponent(monumentName)}`,
      availability: 'available'
    },
    {
      id: 'ola-prime',
      provider: 'ola',
      name: 'Ola Prime',
      type: 'Sedan',
      estimatedTime: '8-12 mins',
      estimatedFare: 270,
      logo: '🚗',
      deepLink: `olacabs://app/launch?lat=28.6139&lng=77.2090&drop_name=${encodeURIComponent(monumentName)}&category=prime`,
      availability: 'high_demand'
    },
    {
      id: 'rapido-bike',
      provider: 'rapido',
      name: 'Rapido Bike',
      type: 'Two Wheeler',
      estimatedTime: '4-6 mins',
      estimatedFare: 85,
      logo: '🏍️',
      deepLink: `rapido://home?drop_lat=28.6139&drop_lng=77.2090`,
      availability: 'available'
    },
    {
      id: 'rapido-auto',
      provider: 'rapido',
      name: 'Rapido Auto',
      type: 'Auto Rickshaw',
      estimatedTime: '5-7 mins',
      estimatedFare: 120,
      logo: '🛺',
      deepLink: `rapido://home?category=auto&drop_lat=28.6139&drop_lng=77.2090`,
      availability: 'available'
    }
  ]

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'uber':
        return 'from-black to-gray-800'
      case 'ola':
        return 'from-green-500 to-green-600'
      case 'rapido':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
      case 'high_demand':
        return <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">High Demand</span>
      case 'unavailable':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Unavailable</span>
      default:
        return null
    }
  }

  const handleBookRide = (option: TransportOption) => {
    setSelectedOption(option)
    setShowConfirmation(true)
  }

  const confirmBooking = () => {
    if (!selectedOption) return

    // Try to open the deep link
    const link = document.createElement('a')
    link.href = selectedOption.deepLink
    link.click()

    // Fallback to web URLs if app is not installed
    setTimeout(() => {
      let fallbackUrl = ''
      switch (selectedOption.provider) {
        case 'uber':
          fallbackUrl = 'https://m.uber.com/'
          break
        case 'ola':
          fallbackUrl = 'https://book.olacabs.com/'
          break
        case 'rapido':
          fallbackUrl = 'https://www.rapido.bike/'
          break
      }
      
      // If deep link didn't work (app not installed), show fallback
      if (fallbackUrl) {
        const shouldOpenWeb = confirm(
          `${selectedOption.provider.toUpperCase()} app not installed. Open in browser?`
        )
        if (shouldOpenWeb) {
          window.open(fallbackUrl, '_blank')
        }
      }
    }, 2000)

    setShowConfirmation(false)
    if (onClose) onClose()
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Book Your Ride</h2>
            <div className="flex items-start space-x-2 text-sm">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="opacity-90">{monumentName}</p>
                <p className="text-xs opacity-75">{monumentLocation}</p>
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Transport Options */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Ride</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: option.availability !== 'unavailable' ? 1.02 : 1 }}
                whileTap={{ scale: option.availability !== 'unavailable' ? 0.98 : 1 }}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedOption?.id === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : option.availability === 'unavailable'
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => option.availability !== 'unavailable' && handleBookRide(option)}
              >
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getProviderColor(option.provider)} flex items-center justify-center text-2xl`}>
                      {option.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{option.name}</h4>
                      <p className="text-xs text-gray-600">{option.type}</p>
                    </div>
                  </div>
                  {getAvailabilityBadge(option.availability)}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{option.estimatedTime}</span>
                    </div>
                    <div className="flex items-center font-bold text-gray-900">
                      <CurrencyRupeeIcon className="h-4 w-4" />
                      <span>{option.estimatedFare}</span>
                    </div>
                  </div>
                  
                  {option.availability === 'high_demand' && (
                    <p className="text-xs text-orange-600">
                      ⚡ High demand - prices may be higher
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-blue-900">How it works</h4>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Select your preferred ride option above</li>
                  <li>You'll be redirected to the app to confirm booking</li>
                  <li>Driver details will be shared once confirmed</li>
                  <li>Track your ride in real-time through the app</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Transport */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Other Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
              <TruckIcon className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Local Bus</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
              <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Metro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getProviderColor(selectedOption.provider)} flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {selectedOption.logo}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Booking</h3>
                <p className="text-gray-600">
                  You're about to book {selectedOption.name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ride Type:</span>
                  <span className="font-medium">{selectedOption.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-medium">{selectedOption.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Fare:</span>
                  <span className="font-bold text-lg flex items-center">
                    <CurrencyRupeeIcon className="h-5 w-5" />
                    {selectedOption.estimatedFare}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className={`flex-1 py-3 px-4 bg-gradient-to-r ${getProviderColor(selectedOption.provider)} text-white rounded-lg font-medium hover:shadow-lg transition-all`}
                >
                  Confirm & Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

