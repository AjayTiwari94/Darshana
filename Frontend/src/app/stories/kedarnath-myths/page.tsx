'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles, BookOpen, MapPin, Clock } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const KedarnathMythsStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession()
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the myths and legends associated with Kedarnath Temple, particularly the story of Lord Shiva and the Pandavas")
    
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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-10"
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
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
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
          <Link href="/stories" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
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
              src="/images/sacred_places/Kedarnath.jpg" 
              alt="Kedarnath Temple" 
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
                The Legend of Kedarnath
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                The divine mythological tale of Lord Shiva and the Pandavas from the Mahabharata
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
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
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
            transition={{ duration: 0.5, delay: 0.2 }} >
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1" />
                  6 min read
                </p>
                <p className="text-gray-600 flex items-center justify-end mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Mahabharata Era
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
                <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
                The Great Mahabharata
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                After the great war of Kurukshetra, the Pandavas emerged victorious but were deeply troubled by the immense destruction and loss of life that the battle had caused. The five brothers - Yudhishthira, Bhima, Arjuna, Nakula, and Sahadeva - felt the weight of their actions and sought redemption for the sins they had committed during the war. They realized that to find peace and liberation, they needed to seek the blessings of Lord Shiva, the supreme deity who embodies both destruction and regeneration.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                The Search for Lord Shiva
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                The Pandavas embarked on a pilgrimage to find Lord Shiva, who had taken the form of a bull and was wandering in the Himalayas to avoid their worship. When the Pandavas finally caught up with the divine bull, Lord Shiva, in his bull form, tried to escape by diving into the earth. However, the determined Pandavas caught hold of the bull's tail, legs, and hump. In his attempt to free himself, Lord Shiva disappeared into the earth, leaving behind only parts of his form at different locations.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/images/sacred_places/Kedarnath.jpg" 
                  alt="Kedarnath Temple Legend" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The divine legend of Lord Shiva and the Pandavas at Kedarnath</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                The hump of the bull appeared at Kedarnath, which is why the main shrine here is in the shape of a bull's hump. The arms of the bull appeared at Tungnath, the face at Rudranath, the navel and stomach at Madhyamaheshwar, and the hair at Kalpeshwar. These five shrines together form the Panch Kedar pilgrimage circuit, with Kedarnath being the most significant and primary shrine.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                The Divine Blessing
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Pleased with the devotion and perseverance of the Pandavas, Lord Shiva revealed his true form and blessed them with liberation from their sins. He instructed them to build a temple at Kedarnath to worship him in the form of the bull's hump (Shiva Lingam). The Pandavas followed his instructions and established the Kedarnath Temple, which became one of the twelve Jyotirlingas - the most sacred shrines dedicated to Lord Shiva.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                According to the legend, after establishing the temple, the Pandavas attained salvation and joined Lord Shiva in the divine realm. The temple has since been a place of immense spiritual significance, where devotees come to seek the blessings of Lord Shiva and find redemption from their worldly sins.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-8 bg-blue-50 p-4 rounded-r-lg text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                "The path to Kedarnath is not just a physical journey through the Himalayas, but a spiritual pilgrimage that leads the devotee from the darkness of worldly attachments to the light of divine realization."
              </motion.blockquote>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-cyan-600" />
                The Eternal Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                The legend of Kedarnath continues to inspire millions of devotees who undertake the arduous journey to this sacred shrine. The story symbolizes the eternal human quest for spiritual liberation and the belief that sincere devotion and perseverance can lead to divine grace. The temple stands as a testament to the enduring power of faith and the timeless connection between humanity and the divine.
              </motion.p>
              
              <motion.p 
                className="text-gray-700 mt-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                Every year, thousands of pilgrims brave the harsh mountain conditions to reach Kedarnath, following in the footsteps of the Pandavas. The journey itself is considered a form of penance and spiritual practice, preparing the devotee for the divine darshan (vision) of Lord Shiva at the sacred temple.
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
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mythology
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mahabharata
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pandavas
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shiva
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
          </motion.article>
        
        {/* Contextual AI Prompt */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <p className="text-gray-600">
            Want to know more about the legends of Kedarnath and the Pandavas? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 inline-flex"
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

export default KedarnathMythsStory
