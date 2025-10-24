'use client'

import React, { useState, useEffect } from 'react'
import { useNaradAIStore, useUIStore } from '@/store'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpenIcon, 
  ClockIcon, 
  MapPinIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { Sparkles } from 'lucide-react'

// Define the story types
type StoryType = 'history' | 'myths' | 'beliefs' | 'folk' | 'horror'

// Define the story structure
interface CulturalStory {
  id: string
  title: string
  description: string
  type: StoryType
  place: string
  state: string
  duration: number
  period?: string
  narrator: string
  imageUrl: string
  contentPreview: string
}

const CulturalStoriesPage: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [activeStory, setActiveStory] = useState<string | null>(null)
  const [activeStoryType, setActiveStoryType] = useState<StoryType>('history')
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredStory, setHoveredStory] = useState<string | null>(null)
  const [showAIButton, setShowAIButton] = useState(true)

  // The 6 stories you mentioned (including two from Himachal Pradesh website)
  const stories: CulturalStory[] = [
    {
      id: 'kedarnath-history',
      title: 'The Sacred Kedarnath Temple',
      description: 'Discover the ancient history of one of the twelve Jyotirlingas dedicated to Lord Shiva',
      type: 'history',
      place: 'Kedarnath',
      state: 'Uttarakhand',
      duration: 8,
      period: '8th Century AD',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Kedarnath.jpg',
      contentPreview: 'Nestled in the majestic Garhwal Himalayas at an altitude of 3,583 meters...'
    },
    {
      id: 'kedarnath-myths',
      title: 'The Legend of Kedarnath',
      description: 'The divine mythological tale of Lord Shiva and the Pandavas',
      type: 'myths',
      place: 'Kedarnath',
      state: 'Uttarakhand',
      duration: 6,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Kedarnath.jpg',
      contentPreview: 'According to the Mahabharata, after the great war of Kurukshetra...'
    },
    {
      id: 'badrinath-history',
      title: 'The Ancient Badrinath Temple',
      description: 'Explore the rich history of the sacred temple dedicated to Lord Vishnu',
      type: 'history',
      place: 'Badrinath',
      state: 'Uttarakhand',
      duration: 9,
      period: '8th Century AD',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Badrinath.jpg',
      contentPreview: 'The Badrinath Temple, located in the picturesque town of Badrinath...'
    },
    {
      id: 'badrinath-beliefs',
      title: 'The Spiritual Beliefs of Badrinath',
      description: 'Understanding the deep spiritual significance and beliefs associated with Badrinath',
      type: 'beliefs',
      place: 'Badrinath',
      state: 'Uttarakhand',
      duration: 7,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Badrinath.jpg',
      contentPreview: 'Badrinath is considered one of the holiest pilgrimage sites for Hindus...'
    },
    {
      id: 'ayodhya-history',
      title: 'The Royal City of Ayodhya',
      description: 'The ancient capital and birthplace of Lord Rama',
      type: 'history',
      place: 'Ayodhya',
      state: 'Uttar Pradesh',
      duration: 12,
      period: '2nd Millennium BC',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Ayodhya.jpg',
      contentPreview: 'Ayodhya, located on the banks of the sacred Sarayu river...'
    },
    {
      id: 'ayodhya-myths',
      title: 'The Epic Tale of Lord Rama',
      description: 'The divine story of Lord Rama from the Ramayana',
      type: 'myths',
      place: 'Ayodhya',
      state: 'Uttar Pradesh',
      duration: 15,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Ayodhya.jpg',
      contentPreview: 'The Ramayana, one of the greatest epics of ancient India...'
    },
    {
      id: 'mathura-history',
      title: 'The Birthplace of Lord Krishna',
      description: 'The ancient city where Lord Krishna was born',
      type: 'history',
      place: 'Mathura',
      state: 'Uttar Pradesh',
      duration: 10,
      period: '6th Century BC',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Mathura.jpg',
      contentPreview: 'Mathura, located on the banks of the Yamuna river...'
    },
    {
      id: 'mathura-beliefs',
      title: 'The Divine Leelas of Krishna',
      description: 'The spiritual beliefs and divine plays of Lord Krishna',
      type: 'beliefs',
      place: 'Mathura',
      state: 'Uttar Pradesh',
      duration: 8,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Mathura.jpg',
      contentPreview: 'Mathura is revered as the birthplace of Lord Krishna...'
    },
    {
      id: 'naina-devi-history',
      title: 'The Sacred Naina Devi Temple',
      description: 'Explore the ancient history of this important Shaktipeeth pilgrimage center',
      type: 'history',
      place: 'Naina Devi',
      state: 'Himachal Pradesh',
      duration: 11,
      period: '8th Century AD',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Naina-Devi.jpg',
      contentPreview: 'Perched on a hilltop on the borders with Punjab, Naina Devi is an important Shaktipeeth pilgrimage center...'
    },
    {
      id: 'naina-devi-myths',
      title: 'The Legend of Naina Devi',
      description: 'The divine mythological tale of how goddess Sati\'s eyes fell at this sacred place',
      type: 'myths',
      place: 'Naina Devi',
      state: 'Himachal Pradesh',
      duration: 9,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/Naina-Devi.jpg',
      contentPreview: 'Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva...'
    },
    {
      id: 'chintpurni-history',
      title: 'The Ancient Chintpurni Temple',
      description: 'Discover the rich history of this deeply revered Shaktipeeth township',
      type: 'history',
      place: 'Chintpurni',
      state: 'Himachal Pradesh',
      duration: 10,
      period: 'Ancient Times',
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/chintpurni.jpg',
      contentPreview: 'A deeply revered Shaktipeeth township, Chintpurni is a major pilgrimage centre that attracts lakhs of people every year...'
    },
    {
      id: 'chintpurni-beliefs',
      title: 'The Spiritual Significance of Chintpurni',
      description: 'Understanding the deep spiritual beliefs associated with the goddess\'s feet',
      type: 'beliefs',
      place: 'Chintpurni',
      state: 'Himachal Pradesh',
      duration: 8,
      narrator: 'Ajay Tiwari',
      imageUrl: '/images/sacred_places/chintpurni.jpg',
      contentPreview: 'Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva...'
    }
  ]

  // Filter stories by place
  const getStoriesByPlace = (place: string) => {
    return stories.filter(story => 
      story.place.toLowerCase().includes(place.toLowerCase()) || 
      story.state.toLowerCase().includes(place.toLowerCase())
    )
  }

  // Get unique places
  const places = Array.from(new Set(stories.map(story => story.place)))

  // Get stories for the active story
  const getActiveStories = () => {
    if (!activeStory) return []
    return stories.filter(story => 
      story.place === activeStory || 
      story.state === activeStory
    )
  }

  // Get stories by type for active place
  const getStoriesByType = () => {
    const activeStories = getActiveStories()
    return activeStories.filter(story => story.type === activeStoryType)
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('cultural-stories-session')
    }
    
    // Only set initial input if there are no user messages yet
    const hasUserMessages = messages.some(message => message.role === 'user');
    if (!hasUserMessages) {
      setInitialInput("The user is browsing cultural stories about sacred places in India including Kedarnath, Badrinath, Ayodhya, Mathura, Naina Devi, and Chintpurni. These stories cover history, myths, and spiritual beliefs.")
    }
    
    // Open the AI chat
    setNaradAIOpen(true)
    
    // Hide the button temporarily
    setShowAIButton(false)
    
    // Re-enable the button after a delay
    setTimeout(() => {
      setShowAIButton(true)
    }, 5000)
  }

  // Story type icons
  const storyTypeIcons = {
    history: <BookOpenIcon className="h-5 w-5" />,
    myths: <BookOpenIcon className="h-5 w-5" />,
    beliefs: <FireIcon className="h-5 w-5" />,
    folk: <UserGroupIcon className="h-5 w-5" />,
    horror: <FireIcon className="h-5 w-5" />
  }

  // Story type labels
  const storyTypeLabels = {
    history: 'Historical Accounts',
    myths: 'Mythological Tales',
    beliefs: 'Spiritual Beliefs',
    folk: 'Folk Traditions',
    horror: 'Horror Tales'
  }

  // Story type colors
  const storyTypeColors = {
    history: 'from-amber-500 to-orange-600',
    myths: 'from-purple-500 to-indigo-600',
    beliefs: 'from-emerald-500 to-teal-600',
    folk: 'from-blue-500 to-cyan-600',
    horror: 'from-red-500 to-pink-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200 opacity-10"
            style={{
              width: Math.random() * 120 + 60,
              height: Math.random() * 120 + 60,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 7 + 7,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
          </motion.div>
        ))}
      </div>

      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <AnimatePresence>
          {showAIButton && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleTalkToNarad}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} />
              <span className="font-medium">Ask Narad AI</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 bg-clip-text text-transparent mb-4"
            initial={{ y: -30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Cultural Stories of India
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover the rich tapestry of Indian heritage through captivating tales of history, mythology, and spiritual beliefs
          </motion.p>
        </motion.div>

        {!activeStory ? (
          // Places Grid
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {places.map((place, index) => {
              const placeStories = getStoriesByPlace(place)
              const primaryStory = placeStories[0]
              
              return (
                <motion.div
                  key={place}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl relative"
                  onClick={() => {
                    setActiveStory(place)
                    setIsLoading(true)
                    setTimeout(() => setIsLoading(false), 500)
                  }}
                  onMouseEnter={() => setHoveredStory(place)}
                  onMouseLeave={() => setHoveredStory(null)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={primaryStory?.imageUrl || '/placeholder-story.jpg'} 
                      alt={place}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-story.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-2xl font-bold text-white">{place}</h3>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                      {placeStories.length} stories
                    </div>
                    
                    {/* Floating AI Button for places */}
                    <AnimatePresence>
                      {hoveredStory === place && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Start a new session if one doesn't exist
                            if (messages.length === 0) {
                              startSession(`${place}-session`)
                            }
                            
                            // Only set initial input if there are no user messages yet
                            const hasUserMessages = messages.some(message => message.role === 'user');
                            if (!hasUserMessages) {
                              setInitialInput(`The user is interested in stories about ${place}, a sacred place in India.`)
                            }
                            
                            // Open the AI chat
                            setNaradAIOpen(true)
                          }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-5 w-5 mr-2 text-amber-600" />
                      <span>{primaryStory?.state}</span>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {primaryStory?.description || `Explore the rich cultural heritage of ${place}`}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(placeStories.map(s => s.type))).map(type => (
                        <span 
                          key={type} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                        >
                          {storyTypeLabels[type]}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          // Story Detail View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="flex items-center text-amber-700 hover:text-amber-900 mb-8 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Back to all places
            </button>

            {/* Place Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeStory}</h2>
                  <p className="text-gray-600">
                    {stories.find(s => s.place === activeStory)?.state}
                  </p>
                </div>
                
                {/* Story Type Selector */}
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                    {(['history', 'myths', 'beliefs', 'folk', 'horror'] as StoryType[]).map((type) => {
                      const typeStories = getActiveStories().filter(s => s.type === type)
                      // Only show horror tab if there are horror stories
                      if (type === 'horror' && typeStories.length === 0) return null
                      
                      return (
                        <button
                          key={type}
                          onClick={() => setActiveStoryType(type)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                            activeStoryType === type
                              ? `bg-gradient-to-r ${storyTypeColors[type]} text-white shadow-md`
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-2">{storyTypeIcons[type]}</span>
                          {storyTypeLabels[type]}
                          {typeStories.length > 0 && (
                            <span className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                              {typeStories.length}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getStoriesByType().map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl relative"
                  onMouseEnter={() => setHoveredStory(story.id)}
                  onMouseLeave={() => setHoveredStory(null)}
                >
                  <div className="relative">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-story.jpg';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${storyTypeColors[story.type]} opacity-70`}></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
                        {storyTypeLabels[story.type]}
                      </span>
                    </div>
                    
                    {/* Floating AI Button for individual stories */}
                    <AnimatePresence>
                      {hoveredStory === story.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Start a new session if one doesn't exist
                            if (messages.length === 0) {
                              startSession(`${story.id}-session`)
                            }
                            
                            // Set initial input with a query about the story
                            setInitialInput(`The user is interested in the story: ${story.title}. ${story.description}`)
                            
                            // Open the AI chat
                            setNaradAIOpen(true)
                          }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{story.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDuration(story.duration)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {story.period && <span>{story.period}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{story.narrator}</p>
                          <p className="text-xs text-gray-500">Narrator</p>
                        </div>
                      </div>
                      
                      <Link href={`/stories/${story.id}`} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                        Explore Story
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CulturalStoriesPage