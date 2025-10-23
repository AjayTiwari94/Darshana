'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles, BookOpen, MapPin, Clock } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const BadrinathHistoryStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('badrinath-history-session')
    }
    
    // Only set initial input if there are no user messages yet
    const hasUserMessages = messages.some(message => message.role === 'user');
    if (!hasUserMessages) {
      setInitialInput("Tell me more about the rich history of Badrinath Temple and its significance as one of the Char Dham pilgrimage sites")
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-200 opacity-10"
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
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
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
          <Link href="/stories" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
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
              src="/images/Badrinath.webp" 
              alt="Badrinath Temple" 
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
                The Ancient Badrinath Temple
              </motion.h1>
              <motion.p 
                className="text-xl text-indigo-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Explore the rich history of the sacred temple dedicated to Lord Vishnu
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
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
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
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1" />
                  9 min read
                </p>
                <p className="text-gray-600 flex items-center justify-end mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  8th Century AD
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
                <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                Introduction
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                The Badrinath Temple, located in the picturesque town of Badrinath in Uttarakhand, stands as one of the most revered pilgrimage sites in Hinduism. As one of the Char Dham destinations, this sacred shrine dedicated to Lord Vishnu attracts thousands of devotees annually. Situated at an altitude of 3,133 meters in the Garhwal Himalayas, the temple is not just a place of worship but a symbol of spiritual devotion and architectural brilliance.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                Historical Origins
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                The history of Badrinath Temple is deeply intertwined with Hindu mythology and ancient texts. According to legend, the temple was originally established by the Pandavas, the heroes of the Mahabharata, as a place of penance. However, the current structure is attributed to Adi Shankaracharya, the 8th-century philosopher-saint, who revitalized Hinduism and established the temple as a major pilgrimage center.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/images/Badrinath.webp" 
                  alt="Badrinath Temple Architecture" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The iconic Badrinath Temple architecture</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                The temple's architecture reflects the traditional North Indian Nagara style, with a towering spire that rises majestically against the backdrop of snow-capped peaks. The sanctum sanctorum houses a black stone idol of Lord Vishnu in a meditative posture, believed to be a swayambhu (self-manifested) idol. The temple complex also includes several other shrines and structures that add to its spiritual and historical significance.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
                Architectural Marvel
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                The Badrinath Temple stands at an impressive height with its distinctive pyramid-shaped roof and intricate stone carvings. Constructed entirely of stone, the temple showcases the craftsmanship of ancient Indian architects. The main sanctum features a conical roof covered with silver, while the exterior walls are adorned with elaborate sculptures depicting various deities and mythological scenes. The temple's design not only serves aesthetic purposes but also provides structural stability in the challenging Himalayan terrain.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-teal-600" />
                Spiritual Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                Beyond its architectural grandeur, Badrinath holds immense spiritual significance in Hinduism. It is believed to be one of the 108 Divya Desams (holy abodes of Lord Vishnu) and forms part of the sacred Char Dham Yatra along with Dwarka, Puri, and Rameshwaram. The temple is dedicated to Lord Vishnu in his form as Badrinath, representing the aspect of meditation and austerity. Pilgrims believe that visiting this sacred site fulfills their spiritual aspirations and brings them closer to divine consciousness.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 my-8 bg-indigo-50 p-4 rounded-r-lg text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                "Badrinath is not just a destination; it's a journey of self-discovery where the soul finds its true purpose in the divine presence of Lord Vishnu."
              </motion.blockquote>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.6 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-amber-600" />
                Cultural Importance
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                The Badrinath Temple plays a crucial role in Indian culture and heritage. The annual Badrinath Yatra, which typically takes place between May and October, attracts pilgrims from across the country and abroad. The temple's rituals and traditions have been preserved for centuries, with daily pujas and special ceremonies during festivals like Badri Kedar Mahotsav. The site also serves as a center for spiritual learning, with discourses and cultural programs that promote Hindu philosophy and values.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  History
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Spiritual
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Himalayas
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Vishnu
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pilgrimage
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
          transition={{ duration: 0.5, delay: 2.0 }}
        >
          <p className="text-gray-600">
            Want to know more about Badrinath Temple? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1 inline-flex"
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

export default BadrinathHistoryStory