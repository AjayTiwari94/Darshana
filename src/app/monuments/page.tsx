'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { VirtualTourModal } from '@/components/modals'

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
    visitors: number
    rating: number
    reviews: number
  }
  features: string[]
  isFavorite?: boolean
  isBookmarked?: boolean
}

const MonumentsPage: React.FC = () => {
  const router = useRouter()
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [filteredMonuments, setFilteredMonuments] = useState<Monument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [navigating, setNavigating] = useState<string | null>(null) // Track which monument is being navigated to
  
  // Modal states
  const [virtualTourModalOpen, setVirtualTourModalOpen] = useState(false)
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null)

  const categories = ['Temple', 'Fort', 'Palace', 'Tomb', 'Archaeological Site', 'Museum', 'Natural Heritage']
  const states = ['Delhi', 'Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Madhya Pradesh']

  useEffect(() => {
    fetchMonuments()
  }, [])

  useEffect(() => {
    filterAndSortMonuments()
  }, [monuments, searchQuery, selectedCategory, selectedState, sortBy])

  const fetchMonuments = async () => {
    try {
      const response = await fetch('/api/monuments')
      const data = await response.json()
      
      if (data.success) {
        setMonuments(data.data)
      } else {
        // Mock data for development
        setMonuments(getMockMonuments())
      }
    } catch (error) {
      console.error('Failed to fetch monuments:', error)
      // Use mock data on error
      setMonuments(getMockMonuments())
    } finally {
      setLoading(false)
    }
  }

  const getMockMonuments = (): Monument[] => {
    return [
      {
        _id: '1',
        name: 'Taj Mahal',
        description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.',
        location: {
          city: 'Agra',
          state: 'Uttar Pradesh',
          coordinates: { latitude: 27.1751, longitude: 78.0421 }
        },
        category: 'Tomb',
        period: 'Mughal Era (1632-1653)',
        significance: 'UNESCO World Heritage Site, Symbol of Love',
        images: ['https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1583325/pexels-photo-1583325.jpeg?auto=compress&cs=tinysrgb&w=800'],
        virtualTours: [
          { _id: 'vt1', title: '360° Main Complex', type: '360_tour', duration: 15 },
          { _id: 'vt2', title: 'AR Experience', type: 'ar_overlay', duration: 10 }
        ],
        stories: [
          { _id: 's1', title: 'Love Story of Shah Jahan', type: 'historical', duration: 8 },
          { _id: 's2', title: 'Architecture Marvel', type: 'educational', duration: 12 }
        ],
        ticketInfo: {
          price: { indian: 50, foreign: 1100 },
          timings: '6:00 AM - 6:00 PM (Closed on Fridays)',
          availableSlots: 25
        },
        statistics: { visitors: 6500000, rating: 4.8, reviews: 125000 },
        features: ['Night Viewing', 'Audio Guide', 'Photography Allowed', 'Wheelchair Accessible'],
        isFavorite: false,
        isBookmarked: false
      },
      {
        _id: '2',
        name: 'Red Fort',
        description: 'A historic fortified palace of the Mughal emperors for nearly 200 years.',
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          coordinates: { latitude: 28.6562, longitude: 77.2410 }
        },
        category: 'Fort',
        period: 'Mughal Era (1639-1648)',
        significance: 'UNESCO World Heritage Site, Symbol of Independence',
        images: ['/red-fort.jpg', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        virtualTours: [
          { _id: 'vt3', title: 'Throne Hall Tour', type: 'vr_immersive', duration: 20 }
        ],
        stories: [
          { _id: 's3', title: 'Independence Day Speeches', type: 'historical', duration: 6 },
          { _id: 's4', title: 'Mughal Court Life', type: 'cultural', duration: 15 }
        ],
        ticketInfo: {
          price: { indian: 35, foreign: 500 },
          timings: '9:30 AM - 4:30 PM (Closed on Mondays)',
          availableSlots: 40
        },
        statistics: { visitors: 9000000, rating: 4.6, reviews: 89000 },
        features: ['Sound & Light Show', 'Museum', 'Audio Guide', 'Photography Allowed'],
        isFavorite: false,
        isBookmarked: false
      },
      {
        _id: '3',
        name: 'Hawa Mahal',
        description: 'Palace of Winds with its unique five-story exterior resembling a honeycomb.',
        location: {
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: { latitude: 26.9239, longitude: 75.8267 }
        },
        category: 'Palace',
        period: 'Rajput Era (1799)',
        significance: 'Iconic Pink City Architecture',
        images: ['/images/hawa-mahal.jpg', 'https://images.pexels.com/photos/9373897/pexels-photo-9373897.jpeg?auto=compress&cs=tinysrgb&w=800'],
        virtualTours: [
          { _id: 'vt4', title: 'Window View Experience', type: '360_tour', duration: 12 }
        ],
        stories: [
          { _id: 's5', title: 'Royal Ladies Observatory', type: 'historical', duration: 7 },
          { _id: 's6', title: 'Pink City Architecture', type: 'educational', duration: 10 }
        ],
        ticketInfo: {
          price: { indian: 50, foreign: 200 },
          timings: '9:00 AM - 4:30 PM',
          availableSlots: 30
        },
        statistics: { visitors: 2500000, rating: 4.4, reviews: 45000 },
        features: ['Photography Allowed', 'City View', 'Historical Museum'],
        isFavorite: false,
        isBookmarked: false
      },
      {
        _id: '4',
        name: 'Amer Fort',
        description: 'A majestic sandstone and marble fort on a hilltop in Jaipur, overlooking Maota Lake.',
        location: {
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: { latitude: 26.9855, longitude: 75.8513 }
        },
        category: 'Fort',
        period: 'Rajput Era (1592)',
        significance: 'UNESCO World Heritage Site, Rajput Architecture',
        images: ['/amerfort.jpg', '/amer-fort.jpg'],
        virtualTours: [
          { _id: 'vt5', title: 'Palace Complex Tour', type: '360_tour', duration: 18 }
        ],
        stories: [
          { _id: 's7', title: 'Rajput Grandeur', type: 'historical', duration: 9 },
          { _id: 's8', title: 'Mirror Palace Secrets', type: 'architectural', duration: 11 }
        ],
        ticketInfo: {
          price: { indian: 100, foreign: 550 },
          timings: '8:00 AM - 5:30 PM',
          availableSlots: 35
        },
        statistics: { visitors: 3200000, rating: 4.7, reviews: 67000 },
        features: ['Elephant Rides', 'Mirror Palace', 'Photography Allowed', 'Audio Guide'],
        isFavorite: false,
        isBookmarked: false
      },
      {
        _id: '5',
        name: 'Bhangarh Fort',
        description: 'A 17th-century fort built by Raja Bhagwant Das, known for its mysterious legends and haunted reputation.',
        location: {
          city: 'Alwar',
          state: 'Rajasthan',
          coordinates: { latitude: 27.5647, longitude: 76.3878 }
        },
        category: 'Fort',
        period: 'Mughal Era (1608)',
        significance: 'Historic Fort, Haunted Site',
        images: ['/bhangarhfort.jpg', '/bhangarhfort.jpg'],
        virtualTours: [
          { _id: 'vt6', title: 'Haunted Corridors', type: '360_tour', duration: 15 }
        ],
        stories: [
          { _id: 'bhangarh-curse', title: 'The Curse of Bhangarh Fort', type: 'horror', duration: 8 },
          { _id: 'bhangarh-history', title: 'History of Bhangarh Fort', type: 'historical', duration: 10 }
        ],
        ticketInfo: {
          price: { indian: 25, foreign: 300 },
          timings: '8:00 AM - 5:00 PM',
          availableSlots: 15
        },
        statistics: { visitors: 2340000, rating: 4.5, reviews: 2340 },
        features: ['Guided Tours', 'Photography Allowed', 'Historical Museum'],
        isFavorite: false,
        isBookmarked: false
      }
    ]
  }

  const filterAndSortMonuments = () => {
    let filtered = monuments.filter(monument => {
      const matchesSearch = monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           monument.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           monument.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || monument.category === selectedCategory
      const matchesState = !selectedState || monument.location.state === selectedState
      
      return matchesSearch && matchesCategory && matchesState
    })

    // Sort monuments
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.statistics.rating - a.statistics.rating
        case 'visitors':
          return b.statistics.visitors - a.statistics.visitors
        case 'price':
          return a.ticketInfo.price.indian - b.ticketInfo.price.indian
        default:
          return 0
      }
    })

    setFilteredMonuments(filtered)
  }

  const toggleFavorite = async (monumentId: string) => {
    try {
      await fetch(`/api/monuments/${monumentId}/favorite`, { method: 'POST' })
      setMonuments(prev => prev.map(monument => 
        monument._id === monumentId 
          ? { ...monument, isFavorite: !monument.isFavorite }
          : monument
      ))
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const toggleBookmark = async (monumentId: string) => {
    try {
      await fetch(`/api/monuments/${monumentId}/bookmark`, { method: 'POST' })
      setMonuments(prev => prev.map(monument => 
        monument._id === monumentId 
          ? { ...monument, isBookmarked: !monument.isBookmarked }
          : monument
      ))
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const handleBookTicket = async (monument: Monument) => {
    // Set loading state for this specific monument
    setNavigating(monument._id)
    
    // Add a longer delay to show the smooth loading state and let page transition prepare
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Redirect to tickets page with monument pre-selected
    router.push(`/tickets?monument=${monument._id}&name=${encodeURIComponent(monument.name)}`)
  }

  const handleVirtualTour = (monument: Monument) => {
    setSelectedMonument(monument)
    setVirtualTourModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url('/images/heritage-background.jpg')"
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-2xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>
            Discover India's Heritage
          </h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)' }}>
            Explore magnificent monuments that tell the story of our rich cultural legacy
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search monuments, cities, or states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="visitors">Sort by Popularity</option>
                <option value="price">Sort by Price</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredMonuments.length} monuments found
              </div>
            </div>
          )}
        </div>

        {/* Monuments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMonuments.map(monument => (
            <div key={monument._id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden group">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={monument.images[0] || 'https://images.pexels.com/photos/10037438/pexels-photo-10037438.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={monument.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/10037438/pexels-photo-10037438.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(monument._id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                  >
                    {monument.isFavorite ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleBookmark(monument._id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                  >
                    {monument.isBookmarked ? (
                      <BookmarkSolidIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <BookmarkIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                    {monument.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{monument.name}</h3>
                  <div className="flex items-center">
                    <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{monument.statistics.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{monument.location.city}, {monument.location.state}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {monument.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    <span>{(monument.statistics.visitors / 1000000).toFixed(1)}M visitors</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{monument.virtualTours.length} tours</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-semibold text-orange-600">
                      ₹{monument.ticketInfo.price.indian}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      / ${monument.ticketInfo.price.foreign}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600">
                      {monument.ticketInfo.availableSlots} slots available
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleBookTicket(monument)}
                    disabled={navigating === monument._id}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-all duration-500 text-sm font-medium disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-95 flex items-center justify-center transform hover:scale-105"
                  >
                    {navigating === monument._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="animate-pulse">Preparing...</span>
                      </>
                    ) : (
                      'Book Tickets'
                    )}
                  </button>
                  <button 
                    onClick={() => handleVirtualTour(monument)}
                    className="flex-1 border border-orange-600 text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                  >
                    Virtual Tour
                  </button>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {monument.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {monument.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{monument.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMonuments.length === 0 && (
          <div className="text-center py-12">
            <InformationCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No monuments found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <VirtualTourModal
        isOpen={virtualTourModalOpen}
        onClose={() => setVirtualTourModalOpen(false)}
        monument={selectedMonument}
      />
    </div>
  )
}

export default MonumentsPage