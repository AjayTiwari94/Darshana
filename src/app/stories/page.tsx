'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Sparkles, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { apiCall } from '../../lib/api'
import { useNaradAIStore, useUIStore } from '@/store'

interface Story {
  _id: string
  title: string
  description: string
  content: string
  monument: {
    _id: string
    name: string
    location: string
  }
  category: string
  period: string
  narrator: {
    name: string
    avatar: string
    bio: string
  }
  duration: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  mediaAssets: {
    images: string[]
    audio?: string
    video?: string
    thumbnails: string[]
  }
  statistics: {
    views: number
    likes: number
    shares: number
    averageRating: number
    totalRatings: number
  }
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
}

// Define the story types for cultural stories
type CulturalStoryType = 'history' | 'myths' | 'beliefs' | 'folk' | 'horror'

interface CulturalStory {
  id: string
  title: string
  description: string
  type: CulturalStoryType
  place: string
  state: string
  duration: number
  period?: string
  narrator: string
  imageUrl: string
  contentPreview: string
}

interface MediaPlayer {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

const StorytellingHub: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [stories, setStories] = useState<Story[]>([])
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false
  })
  const [activeTab, setActiveTab] = useState<'all' | 'cultural'>('all')
  const [activeCulturalType, setActiveCulturalType] = useState<CulturalStoryType>('history')
  const [showAIButton, setShowAIButton] = useState(true)
  const [hoveredStory, setHoveredStory] = useState<string | null>(null)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('stories-page-session')
    }
    
    // Set initial input with a general query about the stories
    setInitialInput(`The user is browsing the story collection page which contains ${stories.length} featured stories and ${culturalStories.length} cultural stories. The cultural stories cover places like ${culturalPlaces.join(', ')} and include various types such as history, myths, and beliefs. Tell me about the different cultural stories available and recommend some interesting ones to explore.`)
    
    // Open the AI chat
    setNaradAIOpen(true)
    
    // Hide the button temporarily
    setShowAIButton(false)
    
    // Re-enable the button after a delay
    setTimeout(() => {
      setShowAIButton(true)
    }, 5000)
  }

  // Cultural stories data
  const culturalStories: CulturalStory[] = [
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
      imageUrl: '/sacred_places/Kedarnath.jpg',
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
      imageUrl: '/sacred_places/Kedarnath.jpg',
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
      imageUrl: '/sacred_places/Badrinath.jpg',
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
      imageUrl: '/sacred_places/Badrinath.jpg',
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
      imageUrl: '/sacred_places/Ayodhya.jpg',
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
      imageUrl: '/sacred_places/Ayodhya.jpg',
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
      imageUrl: '/sacred_places/Mathura.jpg',
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
      imageUrl: '/sacred_places/Mathura.jpg',
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
      imageUrl: '/sacred_places/Naina-Devi.jpg',
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
      imageUrl: '/sacred_places/Naina-Devi.jpg',
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
      imageUrl: '/sacred_places/chintpurni.jpg',
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
      imageUrl: '/sacred_places/chintpurni.jpg',
      contentPreview: 'Believers hold that as the dead body of Sati dismembered during an all consuming cosmic Tandav dance of Lord Shiva...'
    },
    {
      id: 'prem-mandir-history',
      title: 'The Divine Prem Mandir',
      description: 'Discover the spiritual beauty and architectural marvel of this modern temple dedicated to Radha Krishna',
      type: 'history',
      place: 'Vrindavan',
      state: 'Uttar Pradesh',
      duration: 10,
      period: 'Modern Era',
      narrator: 'Ajay Tiwari',
      imageUrl: '/premmandir.jpg',
      contentPreview: 'Nestled in the sacred town of Vrindavan, Uttar Pradesh, Prem Mandir stands as a magnificent testament to divine love and devotion...'
    },
    {
      id: 'konark-sun-temple-history',
      title: 'The Magnificent Konark Sun Temple',
      description: 'Discover the architectural brilliance and spiritual significance of this UNESCO World Heritage Site',
      type: 'history',
      place: 'Konark',
      state: 'Odisha',
      duration: 12,
      period: '13th Century AD',
      narrator: 'Ajay Tiwari',
      imageUrl: '/konarksuntemple.jpg',
      contentPreview: 'Rising majestically from the coastal plains of Odisha, the Konark Sun Temple stands as one of India\'s most spectacular architectural achievements...'
    },
    {
      id: 'golden-temple-history',
      title: 'The Sacred Golden Temple',
      description: 'Discover the spiritual heart of Sikhism and the architectural marvel of Harmandir Sahib in Amritsar',
      type: 'history',
      place: 'Amritsar',
      state: 'Punjab',
      duration: 11,
      period: '16th Century AD',
      narrator: 'Ajay Tiwari',
      imageUrl: '/golderntemple.jpg',
      contentPreview: 'The Golden Temple, officially known as Harmandir Sahib, stands as the most sacred shrine in Sikhism and one of the most revered religious sites in the world...'
    },
    {
      id: 'bhangarh-curse',
      title: 'The Curse of Bhangarh Fort',
      description: 'Discover the haunting legends that make Bhangarh one of India\'s most mysterious places',
      type: 'horror',
      place: 'Bhangarh',
      state: 'Rajasthan',
      duration: 8,
      period: '17th Century',
      narrator: 'Narad AI',
      imageUrl: '/bhangarhfort.jpg',
      contentPreview: 'Bhangarh Fort, located in the Alwar district of Rajasthan, is known for its mysterious curse and is considered one of the most haunted places in India...'
    },
    {
      id: 'bhangarh-history',
      title: 'The History of Bhangarh Fort',
      description: 'Explore the rich history of this 17th-century fort built by Raja Bhagwant Das',
      type: 'history',
      place: 'Bhangarh',
      state: 'Rajasthan',
      duration: 10,
      period: '17th Century',
      narrator: 'Ajay Tiwari',
      imageUrl: '/bhangarhfort.jpg',
      contentPreview: 'Bhangarh Fort was built in 1573 by Raja Bhagwant Das, the son of Raja Todar Mal, who was a minister in the court of Emperor Akbar...'
    }

  ]

  const categories = ['Historical', 'Mythological', 'Architectural', 'Cultural', 'Archaeological']
  const difficulties = ['Easy', 'Medium', 'Hard']

  // Get unique places for cultural stories
  const culturalPlaces = Array.from(new Set(culturalStories.map(story => story.place)))

  // Get cultural stories by type
  const getCulturalStoriesByType = () => {
    return culturalStories.filter(story => story.type === activeCulturalType)
  }

  // Get cultural stories by place
  const getCulturalStoriesByPlace = (place: string) => {
    return culturalStories.filter(story => story.place === place)
  }

  useEffect(() => {
    console.log('Stories page component mounted');
    fetchStories();
  }, []);

  // Add useEffect for filtering
  useEffect(() => {
    // Don't fetch on initial mount since we already did that
    if (searchTerm || selectedCategory || selectedDifficulty) {
      fetchStories();
    }
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  // Add debugging useEffects
  useEffect(() => {
    console.log('Stories state updated:', stories.length, stories);
  }, [stories]);

  useEffect(() => {
    console.log('Cultural stories count:', culturalStories.length);
  }, []); // Empty dependency array since culturalStories is a constant

  const fetchStories = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      params.append('sort', sortBy)
      // Set a high limit to fetch all stories and avoid pagination issues
      params.append('limit', '100')

      const response = await fetch(`/api/admin/stories?${params}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Fetched stories count:', data.data.length);
        console.log('Fetched stories:', data.data);
        setStories(data.data)
        if (data.data.length > 0 && !featuredStory) {
          setFeaturedStory(data.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = async (storyId: string) => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setStories(stories.map(story => 
          story._id === storyId 
            ? { ...story, isLiked: !story.isLiked, statistics: { 
                ...story.statistics, 
                likes: story.isLiked ? story.statistics.likes - 1 : story.statistics.likes + 1 
              }}
            : story
        ))
        
        if (featuredStory?._id === storyId) {
          setFeaturedStory({
            ...featuredStory,
            isLiked: !featuredStory.isLiked,
            statistics: {
              ...featuredStory.statistics,
              likes: featuredStory.isLiked ? featuredStory.statistics.likes - 1 : featuredStory.statistics.likes + 1
            }
          })
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const toggleBookmark = async (storyId: string) => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}/bookmark`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setStories(stories.map(story => 
          story._id === storyId 
            ? { ...story, isBookmarked: !story.isBookmarked }
            : story
        ))
        
        if (featuredStory?._id === storyId) {
          setFeaturedStory({
            ...featuredStory,
            isBookmarked: !featuredStory.isBookmarked
          })
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const shareStory = async (story: Story) => {
    if (navigator.share) {
      await navigator.share({
        title: story.title,
        text: story.description,
        url: `/stories/${story._id}`
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/stories/${story._id}`)
      alert('Story link copied to clipboard!')
    }
  }

  const playAudio = () => {
    if (featuredStory?.mediaAssets.audio) {
      setMediaPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
      // Audio play/pause logic would be implemented here
    }
  }

  const toggleMute = () => {
    setMediaPlayer(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const nextImage = () => {
    if (featuredStory?.mediaAssets.images) {
      setCurrentImageIndex((prev) => 
        prev === featuredStory.mediaAssets.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (featuredStory?.mediaAssets.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? featuredStory.mediaAssets.images.length - 1 : prev - 1
      )
    }
  }

  // Simplified background elements without complex animations
  const BackgroundElements = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-200 opacity-20"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  ), () => true) // Never re-render

  // Story Card Component with smooth scaling animation
  const StoryCardMemo = React.memo(({ story }: { story: Story }) => {
    const [showAIButton, setShowAIButton] = useState(false)
    
    return (
      <motion.div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
        onMouseEnter={() => setShowAIButton(true)}
        onMouseLeave={() => setShowAIButton(false)}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Link href={`/stories/${story._id}`} className="block">
          <div className="relative">
            <motion.img
              src={story.mediaAssets.images?.[0] || story.mediaAssets.thumbnails?.[0] || '/placeholder-story.jpg'}
              alt={story.title}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                story.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                story.difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {story.difficulty}
              </span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {formatDuration(story.duration)}
            </div>
            
            {/* Floating AI Button - simple fade in/out */}
            <AnimatePresence>
              {showAIButton && (
                <motion.button
                  className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg opacity-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Start a new session if one doesn't exist
                    if (messages.length === 0) {
                      startSession('cultural-story-card-session')
                    }
                    
                    // Set initial input with a query about the story
                    setInitialInput(`Tell me more about the story: ${story.title}. ${story.description}. This story is about ${story.monument?.name || 'a cultural site'} and falls under the ${story.category || 'cultural'} category. The story has a difficulty level of ${story.difficulty || 'medium'} and takes approximately ${formatDuration(story.duration)} to read.`)
                    
                    // Open the AI chat
                    setNaradAIOpen(true)
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
              {story.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {story.description}
            </p>
            
            <div className="flex items-center mb-3">
              <img
                src={story.narrator.avatar || '/placeholder-avatar.jpg'}
                alt={story.narrator.name}
                className="h-8 w-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{story.narrator.name}</p>
                <p className="text-xs text-gray-500">{story.monument.name}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <HeartIcon className="h-4 w-4 mr-1" />
                  {story.statistics.likes.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1" />
                  {story.statistics.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(story.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }, (prevProps, nextProps) => prevProps.story._id === nextProps.story._id)

  // Cultural Story Card Component with smooth scaling animation
  const CulturalStoryCardMemo = React.memo(({ story }: { story: CulturalStory }) => {
    const [showAIButton, setShowAIButton] = useState(false)
    
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
        onMouseEnter={() => setShowAIButton(true)}
        onMouseLeave={() => setShowAIButton(false)}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="relative">
          <motion.img
            src={story.imageUrl || '/placeholder-story.jpg'}
            alt={story.title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-story.jpg';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
              {story.type}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {story.duration} min
          </div>
          
          {/* Floating AI Button - simple fade in/out */}
          <AnimatePresence>
            {showAIButton && (
              <motion.button
                className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Start a new session if one doesn't exist
                  if (messages.length === 0) {
                    startSession('story-card-session')
                  }
                  
                  // Set initial input with a query about the story
                  setInitialInput(`Tell me more about the cultural story: ${story.title}. ${story.description}. This story is about ${story.place}, ${story.state} and is of type ${story.type}. The story takes approximately ${story.duration} minutes to read.`)
                  
                  // Open the AI chat
                  setNaradAIOpen(true)
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <Link href={`/stories/${story.id}`} className="block">
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
              {story.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {story.description}
            </p>
            
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-8 h-8 flex items-center justify-center shadow-md" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{story.narrator}</p>
                <p className="text-xs text-gray-500">{story.place}, {story.state}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                Explore
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }, (prevProps, nextProps) => prevProps.story.id === nextProps.story.id)

  // Story type icons
  const storyTypeIcons = {
    history: <BookOpenIcon className="h-5 w-5" />,
    myths: <BookOpenIcon className="h-5 w-5" />,
    beliefs: <HeartSolidIcon className="h-5 w-5" />,
    folk: <UserIcon className="h-5 w-5" />,
    horror: <BookmarkIcon className="h-5 w-5" />
  }

  // Story type labels
  const storyTypeLabels = {
    history: 'Historical Accounts',
    myths: 'Mythological Tales',
    beliefs: 'Spiritual Beliefs',
    folk: 'Folk Traditions',
    horror: 'Horror Tales'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-orange-600"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Animated background elements */}
      <BackgroundElements />

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

      {/* Cultural Stories Section - Added at the top */}
      <motion.div 
        className="bg-gradient-to-r from-amber-500 to-orange-600 py-12 mb-12 relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Static background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Cultural Stories of India
            </h2>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Discover the rich heritage of India through captivating tales from Uttarakhand, Himachal Pradesh, and Uttar Pradesh
              <br /><span className="text-lg">Curated by Ajay Tiwari</span>
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/cultural-stories" className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-30 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-3 mr-4">
                    <BookOpenIcon className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">6 Sacred Places</h3>
                    <p className="text-amber-100">Kedarnath, Badrinath, Ayodhya, Mathura & more</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/rich-heritage" className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-30 transition-all duration-500">
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Rich Heritage</h3>
                    <p className="text-amber-100">History, Myths & Beliefs</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/explore-now" className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-30 transition-all duration-500">
                <div className="flex items-center">
                  <div className="bg-white rounded-lg p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Explore Now</h3>
                    <p className="text-amber-100">Journey through ancient tales</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stories Collection Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured from Home - quick links */}
        <EditorsPicks />
        {/* Tab Selector */}
        <motion.div 
          className="flex border-b border-gray-200 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            All Stories
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('cultural')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'cultural'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Cultural Stories
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'all' ? (
            <motion.div
              key="all-stories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <motion.div 
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">All Stories</h2>
              </motion.div>

              {/* Filters */}
              <motion.div 
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Difficulties</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="duration">By Duration</option>
                  </select>
                </div>
              </motion.div>

              {/* Combined Stories Grid - API stories and cultural stories together */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* API Stories */}
                <AnimatePresence>
                  {stories.map((story, index) => (
                    <motion.div
                      key={story._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <StoryCardMemo story={story} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Cultural Stories */}
                <AnimatePresence>
                  {culturalStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: (stories.length + index) * 0.05 }}
                    >
                      <CulturalStoryCardMemo story={story} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            // Cultural Stories Tab
            <motion.div
              key="cultural-stories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Cultural Stories Header */}
              <motion.div 
                className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cultural Stories</h2>
                  <p className="text-gray-600">Explore India's rich heritage through stories of history, myths, and beliefs</p>
                </div>
                
                {/* Story Type Selector */}
                <motion.div 
                  className="mt-4 md:mt-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                    {(['history', 'myths', 'beliefs', 'folk', 'horror'] as CulturalStoryType[]).map((type) => {
                      const typeStories = culturalStories.filter(s => s.type === type)
                      // Only show horror tab if there are horror stories
                      if (type === 'horror' && typeStories.length === 0) return null
                      
                      return (
                        <motion.button
                          key={type}
                          onClick={() => setActiveCulturalType(type)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                            activeCulturalType === type
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="mr-1">{storyTypeIcons[type]}</span>
                          {storyTypeLabels[type]}
                          <span className="ml-1 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                            {typeStories.length}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              </motion.div>

              {/* Cultural Stories Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AnimatePresence>
                  {getCulturalStoriesByType().map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CulturalStoryCardMemo story={story} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Places Section */}
              <motion.div 
                className="mt-12" 
                id="cultural-stories-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Explore by Sacred Places</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {culturalPlaces.map((place, index) => {
                      const placeStories = getCulturalStoriesByPlace(place)
                      const primaryStory = placeStories[0]
                      
                      return (
                        <motion.div 
                          key={place} 
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => {
                            // Scroll to cultural stories section and set the appropriate type
                            const firstStory = placeStories[0]
                            if (firstStory) {
                              setActiveCulturalType(firstStory.type)
                            }
                            document.getElementById('cultural-stories-section')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="relative h-32 overflow-hidden">
                            <motion.img 
                              src={primaryStory?.imageUrl || '/placeholder-story.jpg'} 
                              alt={place}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder-story.jpg'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <h4 className="text-xl font-bold text-white text-center px-4">{place}</h4>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                              {placeStories.length} stories
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-2">
                              {primaryStory?.state}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {Array.from(new Set(placeStories.map(s => s.type))).map(type => (
                                <span 
                                  key={type} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                                >
                                  {storyTypeLabels[type]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StorytellingHub

// Editor's Picks component - loads featured stories from backend
function EditorsPicks() {
  const [items, setItems] = React.useState<Array<{ id: string; title: string; image: string }>>([])

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await apiCall('/api/stories/featured')
        const json = res
        if (json.success) {
          const mapped = (json.data as any[]).map((s) => ({
            id: s._id,
            title: s.title,
            image: (s.mediaAssets?.find((m: any) => m.type === 'image')?.url) || s.monument?.images?.[0] || '/placeholder-story.jpg'
          }))
          setItems(mapped.slice(0, 4))
        }
      } catch (e) {
        console.error('Failed to load featured stories', e)
      }
    }
    load()
  }, [])

  if (items.length === 0) return null

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Editor’s Picks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {items.map((s, index) => (
            <motion.div
              key={s.id}
              className="group rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/stories/${s.id}`}>
                <div className="relative h-36">
                  <motion.img 
                    src={s.image} 
                    alt={s.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">{s.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}