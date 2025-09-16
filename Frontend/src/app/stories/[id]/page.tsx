'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  BookOpenIcon, 
  ClockIcon, 
  UserIcon, 
  HeartIcon, 
  ShareIcon, 
  BookmarkIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import StoryTypeSwitcher from '@/components/stories/StoryTypeSwitcher'
import AnimatedStoryContent from '@/components/stories/AnimatedStoryContent'

// Define the story type
type StoryType = 'history' | 'mythology' | 'belief' | 'horror' | 'folklore' | 'legend'

interface Story {
  _id: string
  title: string
  content: string
  type: StoryType
  summary: string
  excerpt: string
  monument: {
    _id: string
    name: string
    location: string
  }
  author: {
    _id: string
    name: string
    avatar: string
  }
  mediaAssets: {
    type: string
    url: string
    caption: string
  }[]
  narrator: {
    name: string
    voice: string
    bio: string
  }
  readingTime: number
  audioLength: number
  themes: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  ageRating: string
  sources: {
    title: string
    author: string
    url: string
  }[]
  statistics: {
    views: number
    likes: number
    shares: number
    bookmarks: number
    averageRating: number
    totalRatings: number
  }
  relatedStories: {
    _id: string
    title: string
    type: StoryType
    summary: string
  }[]
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
}

const StoryDetailPage: React.FC = () => {
  const pathname = usePathname()
  const storyId = pathname.split('/')[2]
  
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStoryType, setActiveStoryType] = useState<StoryType>('history')
  const [direction, setDirection] = useState(0) // For animation direction

  // Mock data for demonstration
  const mockStory: Story = {
    _id: storyId,
    title: 'The Sacred Kedarnath Temple',
    content: `## The Ancient History of Kedarnath

The Kedarnath Temple, dedicated to Lord Shiva, is one of the twelve Jyotirlingas and holds immense spiritual significance for Hindus. Nestled in the majestic Garhwal Himalayas at an altitude of 3,583 meters, this ancient temple has been a pilgrimage destination for centuries.

### Historical Origins

According to historical records, the current temple structure was built by Adi Shankaracharya in the 8th century AD. However, the origins of the temple are believed to be much older, with references found in ancient Hindu scriptures.

The temple follows the Katyayanagama style of North Indian temple architecture. The main sanctum houses the lingam, which is believed to be swayambhu (self-manifested).

## The Divine Legend

According to the Mahabharata, after the great war of Kurukshetra, the Pandavas sought to atone for their sins by seeking Lord Shiva's blessings. Lord Shiva, not wishing to meet them, took the form of a bull and hid. The Pandavas recognized him and tried to catch him. Lord Shiva then dived into the ground, leaving only his hump visible at Kedarnath. The other parts of his body are believed to have appeared at four other places, forming the Panch Kedar pilgrimage circuit.

## Spiritual Beliefs

Kedarnath is considered one of the holiest shrines in Hinduism. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation). The temple is especially significant during the month of Shravan (July-August) when millions of devotees visit.

The spiritual atmosphere of Kedarnath is enhanced by its remote location, which requires a challenging trek through the Himalayas, symbolizing the journey towards spiritual enlightenment.

## The Annual Ritual

Every year, the temple undergoes a unique ritual. During the winter months (November to April), the idol is moved to Ukhimath for worship, while a replica is worshipped at Kedarnath during the pilgrimage season (May to October). This tradition has been followed for centuries.`,
    type: 'history',
    summary: 'Discover the ancient history and spiritual significance of the Kedarnath Temple, one of the twelve Jyotirlingas dedicated to Lord Shiva.',
    excerpt: 'Explore the rich history of the sacred Kedarnath Temple...',
    monument: {
      _id: 'monument-1',
      name: 'Kedarnath Temple',
      location: 'Uttarakhand'
    },
    author: {
      _id: 'author-1',
      name: 'Ajay Tiwari',
      avatar: '/placeholder-avatar.jpg'
    },
    mediaAssets: [
      {
        type: 'image',
        url: '/images/kedarnath-temple.jpg',
        caption: 'The majestic Kedarnath Temple in the Himalayas'
      }
    ],
    narrator: {
      name: 'Narad AI',
      voice: 'ai',
      bio: 'Your AI guide to Indian cultural heritage'
    },
    readingTime: 8,
    audioLength: 12,
    themes: ['history', 'spirituality', 'pilgrimage'],
    difficulty: 'intermediate',
    ageRating: 'all',
    sources: [
      {
        title: 'The Mahabharata',
        author: 'Vyasa',
        url: '#'
      },
      {
        title: 'History of Kedarnath Temple',
        author: 'Archaeological Survey of India',
        url: '#'
      }
    ],
    statistics: {
      views: 12500,
      likes: 890,
      shares: 245,
      bookmarks: 156,
      averageRating: 4.7,
      totalRatings: 234
    },
    relatedStories: [
      {
        _id: 'story-2',
        title: 'The Legend of Kedarnath',
        type: 'mythology',
        summary: 'The divine mythological tale of Lord Shiva and the Pandavas'
      },
      {
        _id: 'story-3',
        title: 'Spiritual Beliefs of Kedarnath',
        type: 'belief',
        summary: 'Understanding the deep spiritual significance of Kedarnath'
      }
    ],
    isLiked: false,
    isBookmarked: false,
    createdAt: '2023-05-15T10:30:00Z'
  }

  // Mock related stories for different types
  const relatedStories: Record<StoryType, Story[]> = {
    history: [mockStory],
    mythology: [{
      ...mockStory,
      _id: 'myth-1',
      title: 'The Legend of Kedarnath',
      type: 'mythology',
      summary: 'The divine mythological tale of Lord Shiva and the Pandavas',
      content: `## The Divine Legend of Kedarnath

According to the Mahabharata, after the great war of Kurukshetra, the Pandavas sought to atone for their sins by seeking Lord Shiva's blessings. Lord Shiva, not wishing to meet them, took the form of a bull and hid. The Pandavas recognized him and tried to catch him. Lord Shiva then dived into the ground, leaving only his hump visible at Kedarnath. The other parts of his body are believed to have appeared at four other places, forming the Panch Kedar pilgrimage circuit.`,
      author: {
        _id: 'author-1',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      }
    }],
    belief: [{
      ...mockStory,
      _id: 'belief-1',
      title: 'Spiritual Beliefs of Kedarnath',
      type: 'belief',
      summary: 'Understanding the deep spiritual significance of Kedarnath',
      content: `## Spiritual Beliefs of Kedarnath

Kedarnath is considered one of the holiest shrines in Hinduism. Devotees believe that a visit to this temple can wash away all sins and lead to moksha (liberation). The temple is especially significant during the month of Shravan (July-August) when millions of devotees visit.`,
      author: {
        _id: 'author-1',
        name: 'Ajay Tiwari',
        avatar: '/placeholder-avatar.jpg'
      }
    }],
    horror: [],
    folklore: [],
    legend: []
  }

  // Get available story types
  const getAvailableStoryTypes = (): StoryType[] => {
    return (Object.keys(relatedStories) as StoryType[]).filter(type => relatedStories[type].length > 0)
  }

  useEffect(() => {
    // Simulate fetching story data
    setTimeout(() => {
      setStory(mockStory)
      setLoading(false)
    }, 1000)
  }, [storyId])

  const toggleLike = () => {
    if (story) {
      setStory({
        ...story,
        isLiked: !story.isLiked,
        statistics: {
          ...story.statistics,
          likes: story.isLiked ? story.statistics.likes - 1 : story.statistics.likes + 1
        }
      })
    }
  }

  const toggleBookmark = () => {
    if (story) {
      setStory({
        ...story,
        isBookmarked: !story.isBookmarked,
        statistics: {
          ...story.statistics,
          bookmarks: story.isBookmarked ? story.statistics.bookmarks - 1 : story.statistics.bookmarks + 1
        }
      })
    }
  }

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: story?.summary,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const switchStoryType = (newType: StoryType) => {
    if (newType !== activeStoryType) {
      setDirection(newType > activeStoryType ? 1 : -1)
      setActiveStoryType(newType)
    }
  }

  const formatReadingTime = (minutes: number) => {
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story not found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story not found</h2>
          <Link href="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Cultural Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-4 1.79-4 4 1.79 4 4 4zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/stories" 
          className="flex items-center text-amber-700 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Stories
        </Link>

        {/* Story Type Switcher with Animation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Different Perspectives</h2>
          <StoryTypeSwitcher 
            activeType={activeStoryType}
            onTypeChange={switchStoryType}
            availableTypes={getAvailableStoryTypes()}
          />
        </div>

        {/* Animated Story Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Story Header */}
          <div className="relative">
            <div className="h-64 bg-gradient-to-r from-amber-500 to-orange-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
                  {relatedStories[activeStoryType][0]?.title || story.title}
                </h1>
              </div>
            </div>
            
            {/* Story Stats */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-700">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatReadingTime(story.readingTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm">{story.narrator.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleLike}
                      className={`p-2 rounded-full ${story.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                      {story.isLiked ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button 
                      onClick={toggleBookmark}
                      className={`p-2 rounded-full ${story.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                      {story.isBookmarked ? (
                        <BookmarkSolidIcon className="h-5 w-5" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button 
                      onClick={shareStory}
                      className="p-2 rounded-full text-gray-500 hover:text-amber-600"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Story Content */}
          <div className="p-6 md:p-8">
            <AnimatedStoryContent 
              content={relatedStories[activeStoryType][0]?.content || story.content}
              direction={direction}
            />
            
            {/* Story Metadata */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <img 
                    src={story.author.avatar} 
                    alt={story.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{story.author.name}</p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{story.statistics.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{story.statistics.likes} likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {story.relatedStories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.relatedStories.map((relatedStory) => (
                <Link 
                  key={relatedStory._id}
                  href={`/stories/${relatedStory._id}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{relatedStory.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{relatedStory.summary}</p>
                  <div className="flex items-center text-amber-600 text-sm font-medium">
                    <span>Read story</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryDetailPage