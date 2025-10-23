'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  MapPinIcon,
  StarIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  CameraIcon,
  HeartIcon,
  ShareIcon,
  InformationCircleIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { apiCall } from '../../../lib/api'

interface Monument {
  _id: string
  name: string
  description: string
  location: {
    city: string
    state: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  category: string
  period: string
  significance: string
  images: string[]
  virtualTours: Array<{
    _id: string
    title: string
    type: string
    duration: number
  }>
  stories: Array<{
    _id: string
    title: string
    type: string
    duration: number
  }>
  ticketInfo: {
    price: {
      indian: number
      foreign: number
    }
    timings: string
    availableSlots: number
  }
  statistics: {
    totalVisits: number
    averageRating: number
    totalRatings: number
    totalReviews: number
  }
  features: string[]
  isFavorite?: boolean
  isBookmarked?: boolean
}

// Type guard to check if data is a single monument object
const isMonumentObject = (data: any): data is {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  category: string;
  period?: string;
  historicalPeriod?: {
    era: string;
  };
  significance: string | {
    historical: string;
  };
  images: string[];
  stories: Array<{
    _id: string;
    title: string;
    type: string;
    readingTime: number;
  }>;
  ticketInfo: {
    prices: {
      indian: {
        adult: number;
      };
      foreign: {
        adult: number;
      };
    };
    timings: {
      openTime: string;
      closeTime: string;
    };
    groupDiscounts: any[];
  };
  statistics: {
    totalVisits: number;
    averageRating: number;
    totalRatings: number;
    totalReviews: number;
  };
} => {
  return data && typeof data === 'object' && '_id' in data && 'name' in data;
};

const MonumentDetailPage: React.FC = () => {
  const pathname = usePathname()
  const monumentId = pathname.split('/')[2]
  
  const [monument, setMonument] = useState<Monument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMonument = async () => {
      try {
        const res = await apiCall(`/api/monuments/${monumentId}`)
        // The apiCall function returns mock data directly, not a Response object
        const json = res
        
        if (json.success && json.data && isMonumentObject(json.data)) {
          const m = json.data
          const mapped: Monument = {
            _id: m._id,
            name: m.name,
            description: m.description,
            location: {
              city: m.location?.city || '',
              state: m.location?.state || '',
              coordinates: {
                latitude: m.location?.coordinates?.latitude || 0,
                longitude: m.location?.coordinates?.longitude || 0
              }
            },
            category: m.category,
            period: m.historicalPeriod?.era || m.period || 'Unknown',
            significance: typeof m.significance === 'object' && m.significance !== null ? m.significance.historical : m.significance || '',
            images: (m.images || []).map((img: any) => img.url || img),
            virtualTours: [], // Will be populated from m.vrExperiences or m.arAssets
            stories: (m.stories || []).map((s: any) => ({
              _id: s._id,
              title: s.title,
              type: s.type,
              duration: s.readingTime || 5
            })),
            ticketInfo: {
              price: {
                indian: m.ticketInfo?.prices?.indian?.adult || 0,
                foreign: m.ticketInfo?.prices?.foreign?.adult || 0
              },
              timings: `${m.ticketInfo?.timings?.openTime || '9:00 AM'} - ${m.ticketInfo?.timings?.closeTime || '5:00 PM'}`,
              availableSlots: m.ticketInfo?.groupDiscounts?.length || 10
            },
            statistics: {
              totalVisits: m.statistics?.totalVisits || 0,
              averageRating: m.statistics?.averageRating || 0,
              totalRatings: m.statistics?.totalRatings || 0,
              totalReviews: m.statistics?.totalReviews || 0
            },
            features: [], // Will be populated from m.facilities
            isFavorite: false,
            isBookmarked: false
          }
          setMonument(mapped)
        } else {
          setError('Monument not found')
        }
      } catch (err) {
        console.error('Failed to load monument:', err)
        setError('Failed to load monument')
      } finally {
        setLoading(false)
      }
    }

    if (monumentId) {
      loadMonument()
    }
  }, [monumentId])

  // Track view when monument is loaded
  useEffect(() => {
    if (monument && monumentId) {
      // Send view tracking request
      fetch(`/api/monuments/${monumentId}/view`, {
        method: 'POST'
      }).catch(err => {
        console.error('Failed to track view:', err)
      })
    }
  }, [monument, monumentId])

  const toggleFavorite = async () => {
    if (!monument) return
    
    try {
      // In a real implementation, this would call an API endpoint
      setMonument({
        ...monument,
        isFavorite: !monument.isFavorite
      })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const toggleBookmark = async () => {
    if (!monument) return
    
    try {
      // In a real implementation, this would call an API endpoint
      setMonument({
        ...monument,
        isBookmarked: !monument.isBookmarked
      })
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const shareMonument = async () => {
    if (navigator.share && monument) {
      try {
        await navigator.share({
          title: monument.name,
          text: monument.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Sharing failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error || !monument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monument not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The monument you are looking for does not exist.'}</p>
          <Link href="/monuments" className="btn-primary">
            Back to Monuments
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/monuments" 
          className="flex items-center text-orange-600 hover:text-orange-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Monuments
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center relative">
          <img 
            src={monument.images[0] || '/placeholder-monument.jpg'} 
            alt={monument.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-monument.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{monument.name}</h1>
            <div className="flex items-center text-lg">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{monument.location.city}, {monument.location.state}</span>
            </div>
          </div>
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors shadow-lg"
          >
            {monument.isFavorite ? (
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <button
            onClick={toggleBookmark}
            className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors shadow-lg"
          >
            {monument.isBookmarked ? (
              <BookmarkSolidIcon className="h-6 w-6 text-blue-500" />
            ) : (
              <BookmarkIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
          <button
            onClick={shareMonument}
            className="p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors shadow-lg"
          >
            <ShareIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {monument.name}</h2>
              <p className="text-gray-700 mb-6">{monument.description}</p>
              
              {monument.significance && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                  <h3 className="font-semibold text-orange-800 mb-2">Significance</h3>
                  <p className="text-orange-700">{monument.significance}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-gray-700"><span className="font-medium">Period:</span> {monument.period}</span>
                </div>
                <div className="flex items-center">
                  <InformationCircleIcon className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-gray-700"><span className="font-medium">Category:</span> {monument.category}</span>
                </div>
              </div>
            </div>

            {/* Stories */}
            {monument.stories.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monument.stories.map(story => (
                    <Link 
                      key={story._id} 
                      href={`/stories/${story._id}`}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{story.duration} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tours */}
            {monument.virtualTours.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Virtual Experiences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monument.virtualTours.map(tour => (
                    <div key={tour._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{tour.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tour.type}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{tour.duration} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Views</span>
                  </div>
                  <span className="font-semibold">{monument.statistics.totalVisits.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarSolidIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-600">Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">{monument.statistics.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({monument.statistics.totalRatings} ratings)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">Reviews</span>
                  </div>
                  <span className="font-semibold">{monument.statistics.totalReviews.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Indian Nationals</span>
                    <span className="font-semibold">₹{monument.ticketInfo.price.indian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Foreign Nationals</span>
                    <span className="font-semibold">₹{monument.ticketInfo.price.foreign}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timings</h4>
                  <p className="text-gray-600">{monument.ticketInfo.timings}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Available Slots</h4>
                  <p className="text-gray-600">{monument.ticketInfo.availableSlots} slots available today</p>
                </div>
                <Link 
                  href={`/tickets?monument=${monument._id}&name=${encodeURIComponent(monument.name)}`}
                  className="block w-full bg-orange-600 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Book Tickets
                </Link>
              </div>
            </div>

            {/* Gallery */}
            {monument.images.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {monument.images.slice(1, 7).map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img 
                        src={img} 
                        alt={`${monument.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-monument.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonumentDetailPage