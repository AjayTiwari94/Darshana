'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles, BookOpen, MapPin, Clock } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const GoldenTempleStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('golden-temple-history-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the history of the Golden Temple (Harmandir Sahib) and its significance in Sikhism")
    
    // Open the AI chat
    setNaradAIOpen(true)
    
    // Hide the button temporarily
    setShowAIButton(false)
    
    // Re-enable the button after a delay
    setTimeout(() => {
      setShowAIButton(true)
    }, 5000)
  }

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-200 opacity-10"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 6,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/stories" className="flex items-center text-yellow-600 hover:text-yellow-800 mb-6 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Stories
          </Link>
        </motion.div>
        
        <motion.article 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative h-96">
            <motion.img 
              src="/golderntemple.jpg" 
              alt="Golden Temple Amritsar" 
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <motion.div 
              className="absolute bottom-0 left-0 p-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                The Sacred Golden Temple
              </motion.h1>
              <motion.p 
                className="text-xl text-yellow-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Discover the spiritual heart of Sikhism and the architectural marvel of Harmandir Sahib in Amritsar
              </motion.p>
            </motion.div>
            
            {/* Floating AI Button */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <AnimatePresence>
                {showAIButton && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={handleTalkToNarad}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles size={16} />
                    <span className="font-medium">Talk to Narad</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          <motion.div 
            className="p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1" />
                  11 min read
                </p>
                <p className="text-gray-600 flex items-center justify-end mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  16th Century AD
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="prose max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-yellow-600" />
                Introduction
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                The Golden Temple, officially known as Harmandir Sahib, stands as the most sacred shrine in Sikhism and one of the most revered religious sites in the world. Located in the heart of Amritsar, Punjab, this magnificent structure is not only an architectural marvel but also a symbol of spiritual equality, compassion, and service. The temple's golden dome and marble structure reflect in the sacred Amrit Sarovar (Pool of Nectar), creating a breathtaking sight that has captivated millions of visitors from all walks of life.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-amber-600" />
                Historical Origins
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                The foundation of the Golden Temple was laid by the fourth Sikh Guru, Guru Ram Das Ji, in 1574. However, the construction of the main temple structure began under the guidance of the fifth Sikh Guru, Guru Arjan Dev Ji, in 1581. Guru Arjan Dev Ji designed the temple with a unique architectural concept that reflected the core Sikh principles of equality and openness. The temple was built at a lower level than the surrounding land, symbolizing the Sikh belief in humility and the idea that one must descend to ascend spiritually.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/golderntemple.jpg" 
                  alt="Golden Temple Architecture" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The magnificent Golden Temple with its iconic golden dome reflecting in the sacred pool</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                The temple complex was completed in 1604, and Guru Arjan Dev Ji installed the Adi Granth (the holy scripture of Sikhism) within the temple. This made the Golden Temple the spiritual and cultural center of the Sikh community. The temple has undergone several renovations and expansions over the centuries, with the most significant being the covering of the dome with gold leaf in the early 19th century under the patronage of Maharaja Ranjit Singh, the founder of the Sikh Empire.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-red-600" />
                Architectural Marvel
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                The Golden Temple is a masterpiece of Indo-Islamic architecture, combining elements from Hindu and Islamic design traditions. The temple stands in the middle of the Amrit Sarovar, connected to the mainland by a causeway. The structure features a square platform with a large doorway on each side, symbolizing the openness of Sikhism to people from all directions and backgrounds. The main temple building is two stories high, with the upper floor housing the sanctum sanctorum where the Guru Granth Sahib is kept.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                The temple's most striking feature is its lotus-shaped dome covered in pure gold, which gleams magnificently in the sunlight. The dome is adorned with intricate floral patterns and precious stones. The marble structure is inlaid with precious and semi-precious stones, creating beautiful geometric and floral designs. The interior of the temple is equally impressive, with delicate frescoes, ornate chandeliers, and embroidered canopies (palkis) that add to the spiritual ambiance.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                Spiritual Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                The Golden Temple holds immense spiritual significance for Sikhs worldwide as the holiest shrine in Sikhism. It represents the core values of the Sikh faith: equality, service, and devotion to the divine. The temple is open 24 hours a day, 365 days a year, and welcomes people of all religions, castes, and backgrounds. This inclusivity is reflected in the four doorways of the temple, which face the four cardinal directions, symbolizing the Sikh belief that the divine is accessible to all.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                The daily rituals at the Golden Temple are conducted with great reverence and precision. The most significant ceremony is the Palki Sahib, where the Guru Granth Sahib is ceremoniously moved from the Akal Takht (the throne of the eternal) to the Harmandir Sahib in the morning and back again in the evening. The continuous recitation of the Guru Granth Sahib, known as Akhand Path, ensures that the sacred hymns are always being sung within the temple premises.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-yellow-500 pl-4 italic text-gray-700 my-8 bg-yellow-50 p-4 rounded-r-lg text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                "The Golden Temple is not just a place of worship; it is a living embodiment of the Sikh principles of selfless service, equality, and devotion. Every visit is a reminder that the divine resides within each of us and that true spirituality lies in serving humanity."
              </motion.blockquote>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.8 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                Cultural Impact
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.9 }}
              >
                The Golden Temple has had a profound impact on Indian culture and society, extending far beyond the Sikh community. The temple's langar (community kitchen) serves free meals to over 100,000 people daily, regardless of their religion, caste, or social status. This practice of selfless service has inspired countless individuals and organizations worldwide and has become a model for addressing hunger and promoting social equality.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 mt-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                The temple complex also includes several important historical and cultural sites, including the Akal Takht, the oldest Takht (seat of authority) of the Sikhs, and the Central Sikh Museum, which houses artifacts and manuscripts related to Sikh history. The Golden Temple has been the site of many significant events in Indian history, including the tragic 1984 Operation Blue Star, which remains a sensitive topic in Indian politics and society.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2.1 }}
            >
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sikhism
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Architecture
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Spirituality
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Equality
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Service
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        </motion.article>
        
        {/* Contextual AI Prompt */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          <p className="text-gray-600">
            Want to know more about the Golden Temple and its spiritual significance? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-yellow-600 hover:text-yellow-800 font-medium flex items-center justify-center gap-1 inline-flex"
            >
              <MessageCircle size={16} />
              Ask Narad AI
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GoldenTempleStory