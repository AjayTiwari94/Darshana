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

const NainaDeviHistoryPage = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(660) // 11 minutes in seconds
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAIButton, setShowAIButton] = useState(true) // Added this line
  const contentRef = useRef<HTMLDivElement>(null)

  // Sample images for the carousel
  const images = [
    '/images/sacred_places/Naina-Devi.jpg',
    '/images/Naina-Devi.jpg',
    '/images/chintpurni.jpg',
    '/images/premmandir.jpg'
  ]

  // Update progress as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = window.scrollY
        const docHeight = contentRef.current.clientHeight - window.innerHeight
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
        setProgress(scrollPercent)
        
        // Calculate time remaining (11 minutes total)
        const timeLeft = Math.max(0, 660 - Math.floor((scrollPercent / 100) * 660))
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
      startSession('naina-devi-history-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the history of Naina Devi Temple and its significance as a Shakti Peetha")
    
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
        {showAIButton && ( // Added this condition
          <motion.button
            onClick={handleTalkToNarad}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            <span className="font-medium">Ask Narad AI</span>
          </motion.button>
        )}
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
            The Sacred Naina Devi Temple
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Exploring the ancient history of this important Shaktipeeth pilgrimage center in Himachal Pradesh
          </p>
          
          {/* Story Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Ajay Tiwari
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Naina Devi, Himachal Pradesh
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              8th Century AD - Present
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              11 min read
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
                alt={`Naina Devi heritage site ${currentImageIndex + 1}`}
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
            Perched majestically on a hilltop on the borders of Punjab and Himachal Pradesh, the Naina Devi Temple stands as one of the most revered Shaktipeeth pilgrimage centers in North India. This ancient shrine, dedicated to Goddess Naina Devi—an incarnation of Goddess Durga—has been a beacon of spiritual solace for devotees for over a millennium.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Origins and Mythological Significance</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            According to Hindu mythology, the Naina Devi Temple is one of the 51 Shaktipeeths where parts of Goddess Sati's body are believed to have fallen during Lord Shiva's cosmic Tandava dance. It is said that Sati's eyes (Naina) fell at this sacred location, giving the temple its name and profound spiritual significance.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The temple's origins can be traced back to the 8th century AD, with significant renovations and expansions occurring during various periods of Indian history. The current structure, while incorporating elements from different eras, maintains the essential architectural and spiritual characteristics that have made it a revered pilgrimage destination.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Historical Development and Architectural Evolution</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Throughout its long history, the Naina Devi Temple has undergone several phases of construction and renovation. The original temple structure was likely a simple shrine built by local devotees and rulers. During the medieval period, successive rulers of the region, including the Rajput kings, contributed to its expansion and embellishment.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The temple complex features a distinctive blend of North Indian temple architecture, with influences from both Hindu and regional architectural styles. The main sanctum sanctorum houses the idol of Goddess Naina Devi, adorned with intricate carvings and decorative elements that reflect the artistic sensibilities of different historical periods.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Spiritual Significance of Shaktipeethas</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            As one of the 51 Shaktipeeths, the Naina Devi Temple holds special significance in Shaktism, the tradition within Hinduism that worships the Divine Feminine. Devotees believe that visiting these sacred sites and offering prayers to the goddess can fulfill wishes, grant spiritual liberation, and bestow divine blessings.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The concept of Shaktipeethas represents the idea that the Divine Mother's energy is distributed across the Indian subcontinent, making her accessible to devotees in various locations. Each Shaktipeeth has its own unique characteristics and specializations, with Naina Devi being particularly associated with the fulfillment of desires and the protection of devotees.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cultural and Social Impact</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Naina Devi Temple has played a significant role in the cultural and social life of the surrounding regions. The annual Navratri festival, celebrated with great fervor at the temple, attracts thousands of devotees who participate in traditional dances, music, and religious ceremonies.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The temple has also been instrumental in promoting education and social welfare in the region. Various charitable activities, including the establishment of schools and healthcare facilities, have been undertaken by the temple authorities to serve the local community.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Modern Pilgrimage and Tourism</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In contemporary times, the Naina Devi Temple has become a major pilgrimage destination, attracting devotees from across India and abroad. The temple administration has undertaken significant efforts to improve infrastructure and facilities for pilgrims, including the construction of guest houses, restaurants, and better transportation access.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The scenic beauty of the surrounding hills, combined with the spiritual atmosphere of the temple, makes Naina Devi a popular destination for both religious pilgrims and tourists seeking natural beauty and cultural experiences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Preservation and Future Challenges</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The preservation of the Naina Devi Temple's historical and architectural heritage presents ongoing challenges. The temple authorities, in collaboration with government agencies and heritage conservation organizations, work to maintain the structural integrity of the buildings while preserving their historical authenticity.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Balancing the needs of increasing pilgrim traffic with the preservation of the sacred environment requires careful planning and management. Efforts are being made to implement sustainable practices that ensure the temple remains accessible to future generations while maintaining its spiritual and cultural significance.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "At Naina Devi, the eyes of the Divine Mother watch over her devotees, offering protection and guidance on their spiritual journey through the hills of devotion."
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
            <Link href="/stories/naina-devi-myths" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Legend of Naina Devi</h4>
                  <p className="text-gray-600 text-sm">The divine mythological tale of how goddess Sati's eyes fell at this sacred place</p>
                </div>
              </div>
            </Link>
            
            <Link href="/stories/chintpurni-history" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Ancient Chintpurni Temple</h4>
                  <p className="text-gray-600 text-sm">Discover the rich history of this deeply revered Shaktipeeth township</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NainaDeviHistoryPage