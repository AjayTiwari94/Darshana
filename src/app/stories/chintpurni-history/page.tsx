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
import { useNaradAIStore, useUIStore } from '@/store'

const ChintpurniHistoryPage = () => {
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
    '/images/chintpurni.jpg',
    '/images/sacred_places/Naina-Devi.jpg',
    '/images/Naina-Devi.jpg',
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
      startSession('chintpurni-history-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the rich history of Chintpurni Temple and its evolution over the centuries")
    
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
            The Ancient Chintpurni Temple
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Discover the rich history of this deeply revered Shaktipeeth township in Himachal Pradesh
          </p>
          
          {/* Story Metadata */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Ajay Tiwari
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Chintpurni, Himachal Pradesh
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Ancient Times - Present
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
                alt={`Chintpurni heritage site ${currentImageIndex + 1}`}
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
            Nestled in the serene hills of Himachal Pradesh, the Chintpurni Temple stands as a testament to India's rich spiritual heritage. This deeply revered Shaktipeeth township attracts lakhs of pilgrims every year, drawn by its profound religious significance and the divine energy that permeates this sacred location.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Ancient Origins and Sacred Significance</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The history of Chintpurni Temple stretches back to ancient times, with its origins rooted in one of Hinduism's most sacred narratives. According to mythology, this holy site is where the feet of Goddess Sati fell during Lord Shiva's cosmic Tandava dance, making it one of the 51 revered Shaktipeeths across the Indian subcontinent.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The name "Chintpurni" is derived from "Chinta" (meaning worry or concern) and "Purni" (meaning fulfillment), signifying the temple's reputation for fulfilling the wishes and alleviating the worries of devotees who visit with sincere faith. This belief has made Chintpurni a major pilgrimage destination for those seeking divine intervention in their lives.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Architectural Heritage and Temple Complex</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Chintpurni Temple complex showcases a beautiful blend of traditional North Indian temple architecture with regional influences. The main shrine houses the idol of Goddess Chintpurni, an incarnation of Goddess Durga, adorned with intricate carvings and decorative elements that reflect the artistic traditions of different historical periods.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The temple complex includes several subsidiary shrines dedicated to other deities, creating a spiritual environment that caters to the diverse devotional needs of pilgrims. The architectural layout of the complex has evolved over centuries, with contributions from various rulers and devotees who have sought to enhance the sacred atmosphere of the site.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Historical Development and Royal Patronage</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Throughout its long history, the Chintpurni Temple has received patronage from various rulers and dynasties that governed the region. The temple's strategic location in the hill regions made it accessible to devotees from different parts of North India, contributing to its growth as a major pilgrimage center.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Historical records indicate that the temple underwent significant renovations and expansions during the medieval period, with local rulers contributing to its architectural development. The temple's administration has traditionally been managed by a lineage of priests who have preserved the sacred traditions and rituals associated with the shrine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cultural and Social Impact</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Chintpurni Temple has played a pivotal role in the cultural and social life of the surrounding regions. The annual Navratri festival, celebrated with great enthusiasm at the temple, brings together devotees from across the country, fostering a sense of community and shared spiritual purpose.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The temple has also been instrumental in promoting education and social welfare in the region. Various charitable activities, including the establishment of schools, healthcare facilities, and community development programs, have been undertaken by the temple authorities to serve the local population.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Modern Pilgrimage and Tourism Development</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In contemporary times, the Chintpurni Temple has emerged as a major pilgrimage destination, attracting devotees from across India and abroad. The temple administration has undertaken significant efforts to improve infrastructure and facilities for pilgrims, including the construction of guest houses, restaurants, and better transportation access.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The scenic beauty of the surrounding hills, combined with the spiritual atmosphere of the temple, makes Chintpurni a popular destination for both religious pilgrims and tourists seeking natural beauty and cultural experiences. The temple's location offers panoramic views of the surrounding landscape, adding to its appeal as a place of spiritual retreat.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Preservation and Future Challenges</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The preservation of the Chintpurni Temple's historical and architectural heritage presents ongoing challenges. The temple authorities, in collaboration with government agencies and heritage conservation organizations, work to maintain the structural integrity of the buildings while preserving their historical authenticity.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Balancing the needs of increasing pilgrim traffic with the preservation of the sacred environment requires careful planning and management. Efforts are being made to implement sustainable practices that ensure the temple remains accessible to future generations while maintaining its spiritual and cultural significance.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "At Chintpurni, where the feet of the Divine Mother touched the earth, her blessings flow endlessly to fulfill the deepest aspirations of her devoted children."
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
            <Link href="/stories/chintpurni-beliefs" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <HeartSolidIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Spiritual Significance of Chintpurni</h4>
                  <p className="text-gray-600 text-sm">Understanding the deep spiritual beliefs associated with the goddess's feet</p>
                </div>
              </div>
            </Link>
            
            <Link href="/stories/naina-devi-history" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Sacred Naina Devi Temple</h4>
                  <p className="text-gray-600 text-sm">Exploring the ancient history of this important Shaktipeeth pilgrimage center</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ChintpurniHistoryPage