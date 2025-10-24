'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  SparklesIcon,
  MapPinIcon,
  BookOpenIcon,
  TrophyIcon,
  ArrowRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Recommendation {
  id: string
  type: 'monument' | 'story' | 'treasure-hunt' | 'experience'
  title: string
  description: string
  image: string
  link: string
  relevanceScore: number
  tags: string[]
  estimatedTime?: string
}

interface PersonalizedRecommendationsProps {
  userId?: string
  context?: {
    currentPage?: string
    recentlyViewed?: string[]
    preferences?: {
      interests: string[]
      favoriteMonuments: string[]
      completedHunts: string[]
    }
  }
  limit?: number
}

export default function PersonalizedRecommendations({
  userId,
  context,
  limit = 6
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRecommendations()
    loadFavorites()
  }, [userId, context])

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteRecommendations')
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)))
    }
  }

  const fetchRecommendations = async () => {
    setLoading(true)
    
    // In production, this would call the recommendation API
    // For now, we'll use intelligent mock recommendations based on context
    const mockRecommendations: Recommendation[] = [
      {
        id: 'taj-mahal-rec',
        type: 'monument',
        title: 'Taj Mahal',
        description: 'Experience the monument of eternal love with AR/VR tours',
        image: '/taj-mahal.jpg',
        link: '/monuments/taj-mahal',
        relevanceScore: 0.95,
        tags: ['Mughal', 'UNESCO', 'Romance', 'Architecture'],
        estimatedTime: '2-3 hours'
      },
      {
        id: 'bhangarh-horror',
        type: 'story',
        title: 'Curse of Bhangarh Fort',
        description: 'Discover the spine-chilling tale of India\'s most haunted place',
        image: '/bhangarhfort.jpg',
        link: '/stories/bhangarh-curse',
        relevanceScore: 0.92,
        tags: ['Horror', 'Folklore', 'Mystery', 'Rajasthan'],
        estimatedTime: '10 min read'
      },
      {
        id: 'hampi-treasure',
        type: 'treasure-hunt',
        title: 'Lost Treasure of Hampi',
        description: 'Solve puzzles and uncover the secrets of Vijayanagara Empire',
        image: '/hampi.jpg',
        link: '/treasure-hunt',
        relevanceScore: 0.88,
        tags: ['Adventure', 'Puzzles', 'History', 'Gamification'],
        estimatedTime: '45-60 min'
      },
      {
        id: 'red-fort-vr',
        type: 'experience',
        title: 'Red Fort VR Experience',
        description: 'Walk through the Mughal court in immersive virtual reality',
        image: '/red-fort.jpg',
        link: '/ar-vr?monument=red_fort&mode=vr',
        relevanceScore: 0.85,
        tags: ['VR', 'Mughal', 'Immersive', 'Delhi'],
        estimatedTime: '20-30 min'
      },
      {
        id: 'ramayan-story',
        type: 'story',
        title: 'Ramayana: Epic of Dharma',
        description: 'Explore the timeless tale of Lord Rama and his journey',
        image: '/Ayodhya.jpg',
        link: '/stories/ramayana',
        relevanceScore: 0.82,
        tags: ['Mythology', 'Epic', 'Dharma', 'Ancient India'],
        estimatedTime: '15 min read'
      },
      {
        id: 'golden-temple-visit',
        type: 'monument',
        title: 'Golden Temple',
        description: 'Visit the holiest shrine of Sikhism with our guided tours',
        image: '/golderntemple.jpg',
        link: '/monuments/golden-temple',
        relevanceScore: 0.80,
        tags: ['Sikh', 'Spiritual', 'Punjab', 'Peace'],
        estimatedTime: '3-4 hours'
      }
    ]

    // Apply context-based filtering and sorting
    let filtered = mockRecommendations

    if (context?.preferences?.interests) {
      filtered = filtered.map(rec => {
        const matchingTags = rec.tags.filter(tag => 
          context.preferences!.interests.some(interest => 
            interest.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(interest.toLowerCase())
          )
        )
        return {
          ...rec,
          relevanceScore: rec.relevanceScore + (matchingTags.length * 0.05)
        }
      })
    }

    // Remove recently viewed items
    if (context?.recentlyViewed) {
      filtered = filtered.filter(rec => !context.recentlyViewed!.includes(rec.id))
    }

    // Sort by relevance score
    filtered.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Apply limit
    filtered = filtered.slice(0, limit)

    setRecommendations(filtered)
    setLoading(false)
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
    localStorage.setItem('favoriteRecommendations', JSON.stringify(Array.from(newFavorites)))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monument':
        return <MapPinIcon className="h-5 w-5" />
      case 'story':
        return <BookOpenIcon className="h-5 w-5" />
      case 'treasure-hunt':
        return <TrophyIcon className="h-5 w-5" />
      case 'experience':
        return <SparklesIcon className="h-5 w-5" />
      default:
        return <SparklesIcon className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'monument':
        return 'bg-blue-100 text-blue-800'
      case 'story':
        return 'bg-purple-100 text-purple-800'
      case 'treasure-hunt':
        return 'bg-yellow-100 text-yellow-800'
      case 'experience':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <SparklesIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                Recommended For You
              </h2>
            </div>
            <p className="text-gray-600">
              Personalized suggestions based on your interests and activity
            </p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/heritage-background.jpg'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.type)}`}>
                    {getTypeIcon(rec.type)}
                    <span className="capitalize">{rec.type.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(rec.id)
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  {favorites.has(rec.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {/* Relevance Score */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-xs font-bold">
                  <SparklesIcon className="h-3 w-3 text-yellow-500" />
                  <span>{Math.round(rec.relevanceScore * 100)}% match</span>
                </div>
              </div>

              {/* Content */}
              <Link href={rec.link} className="block p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {rec.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {rec.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {rec.estimatedTime && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {rec.estimatedTime}
                    </span>
                  )}
                  <span className="flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                    Explore
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {recommendations.length >= limit && (
          <div className="mt-8 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              View All Recommendations
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

