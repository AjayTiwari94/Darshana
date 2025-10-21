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

const NainaDeviMythsPage = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(540) // 9 minutes in seconds
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
        
        // Calculate time remaining (9 minutes total)
        const timeLeft = Math.max(0, 540 - Math.floor((scrollPercent / 100) * 540))
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
      startSession('naina-devi-myths-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the myths and legends associated with Naina Devi Temple and the goddess Sati")
    
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
            The Legend of Naina Devi
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            The divine mythological tale of how goddess Sati's eyes fell at this sacred place
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
              Ancient Mythology
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              9 min read
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
            The legend of Naina Devi is deeply rooted in one of Hinduism's most profound mythological narratives—the story of Goddess Sati and Lord Shiva's cosmic dance. This divine tale explains how the sacred site of Naina Devi came to be, establishing its significance as one of the revered 51 Shaktipeeths where parts of Goddess Sati's body are believed to have fallen.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Divine Union of Shiva and Sati</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In the celestial realms, Lord Shiva, the ascetic god of destruction and transformation, was deeply immersed in meditation. Goddess Sati, the daughter of Daksha Prajapati, was captivated by Shiva's divine presence and chose him as her consort against her father's wishes. Their union represented the perfect balance of asceticism and worldly love.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Daksha, feeling insulted that his daughter had married a wandering ascetic, organized a grand yajna (sacrificial ritual) but deliberately did not invite Shiva. Despite Shiva's warnings, Sati's devotion to her father compelled her to attend the ceremony, where she was publicly humiliated by Daksha for her choice of husband.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Cosmic Tandava and Sati's Sacrifice</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Unable to bear the insult to her beloved husband, Sati immolated herself in the sacrificial fire, choosing death over dishonor. When Shiva learned of Sati's death, his grief transformed into uncontrollable rage. In his fury, he performed the Rudra Tandava, a cosmic dance of destruction that threatened to annihilate the entire universe.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The other gods, witnessing the devastating effects of Shiva's dance, realized that the universe itself was at risk. They pleaded with Lord Vishnu to intervene and stop the destruction. Vishnu, understanding the depth of Shiva's grief, used his Sudarshan Chakra to dismember Sati's body while Shiva was dancing, scattering her body parts across the Indian subcontinent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Fall of the Divine Eyes</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            As Vishnu's discus severed Sati's body, her eyes—representing divine vision and the power to see beyond the material world—fell upon the hilltop that would later become the Naina Devi Temple. This sacred spot, located on the border of present-day Punjab and Himachal Pradesh, instantly became sanctified by the presence of the goddess's divine eyes.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The name "Naina Devi" itself derives from "Naina," meaning eyes in Sanskrit, signifying the special significance of this location as the resting place of the goddess's eyes. Devotees believe that the goddess's eyes continue to watch over her devotees, offering protection and divine vision to those who seek her blessings.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Spiritual Significance of Divine Vision</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In Hindu philosophy, the eyes are considered windows to the soul and symbols of divine vision. The placement of Sati's eyes at Naina Devi imbues the site with special spiritual power related to inner vision, wisdom, and the ability to perceive spiritual truths beyond ordinary sight.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Pilgrims visiting Naina Devi Temple often pray for the goddess's blessings to gain clarity in their lives, overcome obstacles through divine insight, and develop the spiritual vision necessary for self-realization. The temple is particularly revered by those seeking guidance in difficult decisions or spiritual dilemmas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Connection to Other Shaktipeeths</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The legend of Naina Devi is part of the larger narrative that connects all 51 Shaktipeeths across India. Each Shaktipeeth represents a different aspect of the Divine Mother's power and energy, with Naina Devi embodying the aspect of divine vision and protection.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Devotees often undertake pilgrimages to multiple Shaktipeeths, including Naina Devi, as part of their spiritual journey. The interconnected nature of these sacred sites creates a spiritual map of the Indian subcontinent, with each location offering unique blessings and experiences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Modern Interpretations and Devotional Practices</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            In contemporary times, the legend of Naina Devi continues to inspire millions of devotees who visit the temple seeking the goddess's blessings. The story serves as a reminder of the power of unwavering devotion and the eternal bond between the devotee and the Divine.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The annual Navratri celebrations at Naina Devi Temple reenact elements of this divine legend through traditional dances, music, and religious ceremonies. Devotees participate in these festivities to connect with the eternal story and experience the living presence of the goddess.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 italic">
              "Where the eyes of the Divine Mother fell, there the light of wisdom shines eternal, guiding her devotees on the path of spiritual awakening."
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
            
            <Link href="/stories/chintpurni-myths" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-12 h-12 flex items-center justify-center shadow-md mr-4 flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">The Legend of Chintpurni</h4>
                  <p className="text-gray-600 text-sm">The divine tale of how Goddess Sati's feet fell at this sacred place</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NainaDeviMythsPage