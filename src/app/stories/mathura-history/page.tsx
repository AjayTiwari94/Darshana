'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Sparkles, Volume2, VolumeX, BookOpen, MapPin, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useNaradAIStore, useUIStore } from '../../../store'

const MathuraHistoryPage = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAIButton, setShowAIButton] = useState(true) // Added this line
  const contentRef = useRef<HTMLDivElement>(null)

  // Sample images for the carousel
  const images = [
    '/sacred_places/Mathura.jpg',
    '/premmandir.jpg',
    '/konarksuntemple.jpg',
    '/golderntemple.jpg'
  ]

  // Update progress as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = window.scrollY
        const docHeight = contentRef.current.clientHeight - window.innerHeight
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
        setProgress(scrollPercent)
        
        // Calculate time remaining (10 minutes total)
        const timeLeft = Math.max(0, 600 - Math.floor((scrollPercent / 100) * 600))
        setTimeRemaining(timeLeft)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('mathura-history-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the ancient history of Mathura and its evolution over the centuries as an important cultural and religious center")
    
    // Open the AI chat
    setNaradAIOpen(true)
    
    // Hide the button temporarily
    setShowAIButton(false)
    
    // Re-enable the button after a delay
    setTimeout(() => {
      setShowAIButton(true)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Reading Time */}
      <div className="fixed top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-lg z-40 flex items-center">
        <ClockIcon className="h-4 w-4 mr-1" />
        {formatTime(timeRemaining)} left
      </div>

      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.button
          onClick={handleTalkToNarad}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          <span className="font-medium">Ask Narad AI</span>
        </motion.button>
      </motion.div>

      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/stories" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Stories
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Ancient City of Mathura
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Uncovering the rich history of the sacred city where Lord Krishna was born
          </p>
          
          {/* Story Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Ajay Tiwari
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Mathura, Uttar Pradesh
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              6th Century BC - Present
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              10 min read
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span>Like</span>
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
              <span>Save</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>

        {/* Image Carousel */}
        <motion.div 
          className="relative rounded-xl overflow-hidden shadow-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative h-64 sm:h-96">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Mathura heritage site ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-story.jpg'
                }}
              />
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div 
          className="prose prose-lg max-w-none bg-white rounded-xl shadow-sm p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Mathura, located on the banks of the sacred Yamuna River in Uttar Pradesh, holds a special place in the hearts of millions of devotees worldwide. Revered as the birthplace of Lord Krishna, one of Hinduism's most beloved deities, this ancient city has been a significant center of pilgrimage and spiritual learning for over two millennia.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Ancient Origins and Historical Significance</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Archaeological evidence suggests that Mathura has been inhabited since the 6th century BCE, making it one of the oldest continuously inhabited cities in the world. The city's strategic location on the trade routes connecting the Gangetic plains with the western regions contributed to its prosperity and cultural significance.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            During the Mauryan period (4th-2nd century BCE), Mathura emerged as a major center of art, culture, and learning. The city flourished under the Kushan Empire (1st-3rd century CE), when it became a hub for the development of Gandhara and Mathura art styles. The Kushan rulers, particularly Kanishka, patronized Buddhism and contributed to the city's architectural heritage.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Birthplace of Lord Krishna</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Mathura's most significant religious association is with Lord Krishna, who is believed to have been born here around 3228 BCE according to Hindu scriptures. The Bhagavata Purana describes in detail the divine circumstances surrounding Krishna's birth to Devaki and Vasudeva in the prison of Kansa, the tyrannical king of Mathura.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The exact location of Krishna's birth is marked by the Krishna Janmabhoomi Temple, which stands today as one of the most important pilgrimage sites for Hindus. The temple complex houses the Garbhagriha (sanctum sanctorum) where Krishna is believed to have been born, beneath a carved idol of the infant Krishna.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Architectural Marvels and Sacred Sites</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Mathura is home to numerous temples, each with its own unique architectural style and historical significance. The Dwarkadhish Temple, dedicated to Lord Krishna, is renowned for its magnificent architecture featuring intricate carvings and beautiful spires. The temple's main sanctum houses a four-armed idol of Krishna, adorned with precious stones and gold ornaments.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Vishram Ghat, located on the banks of the Yamuna River, is where Lord Krishna is believed to have rested after killing the demon Kansa. The ghat is adorned with beautiful temples and ghats, and pilgrims take a holy dip in the sacred waters of the Yamuna here.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cultural Renaissance and Modern Significance</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In the medieval period, Mathura became a center of the Bhakti movement, with saints like Surdas composing devotional poetry dedicated to Lord Krishna. The city's association with Krishna's childhood pastimes (leelas) has inspired countless works of art, literature, and music over the centuries.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Today, Mathura continues to attract millions of pilgrims, especially during festivals like Janmashtami (Krishna's birthday) and Holi. The city has undergone significant modernization while preserving its spiritual essence, with improved infrastructure and facilities for pilgrims.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Preserving Heritage for Future Generations</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Archaeological Survey of India and various cultural organizations work tirelessly to preserve Mathura's rich heritage. Conservation efforts focus on protecting ancient temples, sculptures, and historical sites from environmental degradation and urban development pressures.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            As Mathura continues to evolve in the modern era, it remains a beacon of India's spiritual heritage, where ancient traditions blend seamlessly with contemporary life. The city stands as a testament to the enduring power of faith and the timeless appeal of Lord Krishna's divine leelas.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "Mathura is not just a city; it's a living testament to India's spiritual heritage, where every street whispers tales of divine love and devotion."
            </p>
          </div>
        </motion.div>

        {/* Related Stories */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/stories/mathura-beliefs" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <HeartSolidIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Divine Leelas of Krishna</h4>
                  <p className="text-gray-600 text-sm">Understanding the spiritual beliefs and divine plays of Lord Krishna</p>
                </div>
              </div>
            </Link>
            
            <Link href="/stories/prem-mandir-history" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Divine Prem Mandir</h4>
                  <p className="text-gray-600 text-sm">Discover the spiritual beauty and architectural marvel of this modern temple</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MathuraHistoryPage