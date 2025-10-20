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

const ChintpurniBeliefsPage = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(480) // 8 minutes in seconds
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
        
        // Calculate time remaining (8 minutes total)
        const timeLeft = Math.max(0, 480 - Math.floor((scrollPercent / 100) * 480))
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
      startSession('chintpurni-beliefs-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the spiritual beliefs associated with Chintpurni Temple and its significance in Hindu mythology")
    
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
            The Spiritual Significance of Chintpurni
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Understanding the deep spiritual beliefs associated with the goddess's feet and the fulfillment of devotees' aspirations
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
              Ancient Spiritual Traditions
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              8 min read
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
            The spiritual beliefs associated with Chintpurni Temple center around the profound symbolism of Goddess Sati's feet, which are believed to have fallen at this sacred location. In Hindu philosophy, the feet of divine beings represent the foundation of spiritual liberation and the path to divine grace. The name "Chintpurni" itself embodies the belief that the goddess fulfills the deepest aspirations of her devotees.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Symbolism of Divine Feet</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In Hindu tradition, the feet of deities hold special significance as they represent the foundation upon which devotees tread their spiritual journey. The lotus feet of divine beings are considered the source of divine energy and blessings, offering protection and guidance to those who seek refuge.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            At Chintpurni, devotees believe that by worshipping the goddess's feet, they can overcome life's challenges and fulfill their heartfelt desires. The act of touching the ground where the divine feet fell is considered highly auspicious, symbolizing the devotee's surrender to the divine will and their desire to walk the path of righteousness.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Concept of Chinta Purna: Fulfillment of Desires</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The name "Chintpurni" translates to "fulfillment of worries" or "completion of concerns," reflecting the deep spiritual belief that the goddess grants the wishes of sincere devotees. This concept goes beyond mere material desires, encompassing the fulfillment of spiritual aspirations and the resolution of life's deeper dilemmas.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Devotees visiting Chintpurni often come with specific prayers or concerns, believing that the goddess's divine presence can provide solutions to their problems. The spiritual practice involves not just asking for fulfillment but also developing faith, patience, and the understanding that divine timing governs all outcomes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Path to Spiritual Liberation</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Beyond the fulfillment of worldly desires, Chintpurni represents the path to ultimate spiritual liberation (moksha). The goddess's feet symbolize the foundation of spiritual practice, reminding devotees that true fulfillment comes from connecting with the divine essence within themselves.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Spiritual seekers understand that worshipping at Chintpurni is not just about asking for favors but about cultivating the qualities necessary for self-realization. The goddess's grace is believed to help devotees overcome ego, attachment, and ignorance, leading them toward the ultimate goal of union with the Divine.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Devotional Practices and Rituals</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The spiritual practices associated with Chintpurni emphasize devotion, surrender, and faith. Pilgrims engage in various rituals such as offering flowers, lighting lamps, and performing circumambulation around the main shrine. These practices are believed to create a sacred connection between the devotee and the divine energy present at the site.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Special importance is given to the recitation of mantras and prayers dedicated to Goddess Chintpurni. The most commonly chanted mantra invokes the goddess's blessings for the fulfillment of sincere desires and the removal of obstacles on the spiritual path.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Role of Faith and Surrender</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Central to the spiritual beliefs of Chintpurni is the concept of complete surrender (prapatti) to the divine will. Devotees are encouraged to approach the goddess with unwavering faith, understanding that true devotion involves trusting in the divine plan even when immediate results are not apparent.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The spiritual journey at Chintpurni teaches that fulfillment comes not through demanding but through surrendering, not through attachment to outcomes but through faith in divine wisdom. This understanding helps devotees develop inner strength and resilience in facing life's challenges.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contemporary Relevance and Spiritual Practice</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In the modern world, the spiritual beliefs associated with Chintpurni continue to provide guidance and solace to millions of devotees. The teachings derived from the symbolism of the goddess's feet offer practical wisdom for navigating life's challenges while maintaining spiritual awareness.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The concept of Chintpurni reminds practitioners that the Divine is not distant but intimately present in their lives, ready to support them when they approach with genuine faith and surrender. This perspective transforms ordinary experiences into opportunities for spiritual growth and self-realization.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "Where the feet of the Divine Mother touched the earth, there lies the path to fulfillment of all sincere aspirations and the foundation of eternal peace."
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
            
            <Link href="/stories/naina-devi-beliefs" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <HeartSolidIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Spiritual Significance of Naina Devi</h4>
                  <p className="text-gray-600 text-sm">Understanding the deep spiritual beliefs associated with the goddess's eyes</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ChintpurniBeliefsPage