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

const MathuraBeliefsPage = () => {
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
    '/images/sacred_places/Mathura.jpg',
    '/images/premmandir.jpg',
    '/images/konarksuntemple.jpg',
    '/images/golderntemple.jpg'
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
      startSession('mathura-beliefs-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the spiritual beliefs associated with Mathura and its significance as the birthplace of Lord Krishna")
    
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
            The Divine Leelas of Krishna
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Understanding the spiritual beliefs and divine plays of Lord Krishna in Mathura
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
              Ancient Traditions
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
            Mathura, the sacred birthplace of Lord Krishna, holds profound spiritual significance in Hinduism. The city is not merely a geographical location but a living embodiment of divine love, devotion, and the eternal play of the Supreme Being with his devotees. The spiritual beliefs associated with Mathura revolve around Krishna's divine leelas (pastimes) that continue to inspire millions of devotees worldwide.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Concept of Leela: Divine Play</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In Hindu philosophy, particularly within Vaishnavism, the concept of leela (divine play) represents the idea that the Supreme Being engages in various activities not out of necessity but out of pure joy and love. Krishna's leelas in Mathura are seen as manifestations of his divine nature, where he descends to earth to restore dharma and to provide his devotees with opportunities for spiritual growth.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The Bhagavata Purana describes numerous leelas of Krishna's childhood in Mathura, from his miraculous birth in the prison of Kansa to his playful activities with the gopis (milkmaids) and cowherd boys. These stories are not merely mythological tales but profound spiritual teachings that illustrate the nature of divine love and devotion.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Rasa Lila: The Supreme Expression of Divine Love</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Among all of Krishna's leelas, the Rasa Lila stands as the supreme expression of divine love. This celestial dance, performed on the banks of the Yamuna River during a full moon night, represents the ultimate union between the individual soul (jiva) and the Supreme Soul (Paramatma). In this divine dance, Krishna expands himself to dance with each of the gopis individually, demonstrating his infinite love for each devotee.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Spiritual seekers understand the Rasa Lila as a metaphor for the soul's longing for union with the Divine. The gopis represent the purified hearts of devotees, and their yearning for Krishna symbolizes the intense love and devotion that a seeker must cultivate to attain spiritual liberation.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Krishna's Role as the Divine Teacher</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Beyond his playful leelas, Krishna is revered as the divine teacher who imparts profound spiritual wisdom. The Bhagavad Gita, delivered by Krishna to Arjuna on the battlefield of Kurukshetra, forms the cornerstone of Hindu philosophy. This sacred discourse addresses fundamental questions about duty, righteousness, and the nature of the self.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In Mathura, devotees reflect on Krishna's teachings and seek to apply them in their daily lives. The city serves as a reminder that spiritual wisdom can be found not only in secluded ashrams but also in the midst of worldly activities, as demonstrated by Krishna's life in the royal court of Mathura.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Spiritual Significance of Mathura's Sacred Sites</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Each sacred site in Mathura carries deep spiritual significance for devotees. The Krishna Janmabhoomi Temple represents the divine descent of the Supreme Being into the material world. Vishram Ghat, where Krishna is believed to have rested after killing Kansa, symbolizes the peace that comes from fulfilling one's divine mission.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Pilgrims visiting these sites engage in spiritual practices such as meditation, prayer, and devotional singing (bhajan) to connect with the divine energy believed to permeate these locations. The act of pilgrimage itself is considered a form of spiritual discipline that purifies the mind and heart.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Devotional Practices and Spiritual Growth</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The spiritual beliefs associated with Mathura emphasize the path of bhakti (devotion) as the means to attain spiritual liberation. Devotees engage in various practices such as kirtan (devotional singing), japa (mantra repetition), and seva (selfless service) to cultivate love for Krishna.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The stories of Krishna's leelas serve as inspiration for devotees to develop qualities such as humility, compassion, and selfless love. By contemplating these divine pastimes, seekers learn to see the divine in all aspects of life and to approach challenges with the same playful confidence that Krishna displayed.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contemporary Relevance and Spiritual Practice</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In the modern world, the spiritual beliefs associated with Mathura continue to provide guidance and solace to millions of devotees. The teachings derived from Krishna's leelas offer practical wisdom for navigating life's challenges while maintaining spiritual awareness.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The concept of leela reminds practitioners that life itself is a divine play, and that by surrendering to the will of the Divine, one can find joy and peace even in difficult circumstances. This perspective transforms ordinary experiences into opportunities for spiritual growth and self-realization.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "In Mathura's sacred soil, every grain of dust carries the fragrance of Krishna's divine love, reminding us that the Supreme is not distant but intimately present in our lives."
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
            <Link href="/stories/mathura-history" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Birthplace of Lord Krishna</h4>
                  <p className="text-gray-600 text-sm">The ancient city where Lord Krishna was born and its historical significance</p>
                </div>
              </div>
            </Link>
            
            <Link href="/stories/ayodhya-myths" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Epic Tale of Lord Rama</h4>
                  <p className="text-gray-600 text-sm">The divine story of Lord Rama from the Ramayana and its spiritual significance</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MathuraBeliefsPage