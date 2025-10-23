'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles, BookOpen, MapPin, Clock } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const AyodhyaRamMandirStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('ayodhya-ram-mandir-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the significance of Ram Mandir in Ayodhya and its connection to Lord Rama")
    
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
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200 opacity-10"
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
          className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
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
          <Link href="/stories" className="flex items-center text-amber-600 hover:text-amber-800 mb-6 transition-colors">
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
              src="/sacred_places/Ayodhya.jpg" 
              alt="Ayodhya Ram Mandir" 
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
                The Sacred Ayodhya Ram Mandir
              </motion.h1>
              <motion.p 
                className="text-xl text-amber-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Discover the ancient city of Ayodhya, the birthplace of Lord Rama
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
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
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
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600 flex items-center justify-end">
                  <Clock className="h-4 w-4 mr-1" />
                  12 min read
                </p>
                <p className="text-gray-600 flex items-center justify-end mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ancient Times
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
                <BookOpen className="h-6 w-6 mr-2 text-amber-600" />
                Introduction
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Located on the banks of the sacred Sarayu river in Uttar Pradesh, Ayodhya is one of the seven holiest 
                cities in Hinduism and is revered as the birthplace of Lord Rama, the seventh avatar of Lord Vishnu. 
                The city's name literally means "unconquerable by war" in Sanskrit, reflecting its spiritual significance 
                that transcends physical conquest.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-orange-600" />
                Historical Origins
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Ayodhya's history is deeply intertwined with the epic Ramayana, which describes it as the capital of 
                the ancient Kosala Kingdom ruled by King Dasharatha. According to the sacred text, Lord Rama was born 
                in this city and spent his childhood here before being exiled for 14 years. Archaeological evidence 
                suggests that the city has been continuously inhabited for over 2,500 years, making it one of the 
                world's oldest continuously inhabited cities.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/images/Ayodhya.jpg" 
                  alt="Ayodhya Ram Mandir Architecture" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The magnificent Ram Mandir architecture</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                The city has been a center of pilgrimage for centuries, attracting devotees who come to visit various 
                sacred sites associated with Lord Rama's life. The most significant among these is the Ram Janmabhoomi, 
                believed to be the exact spot where Lord Rama was born. This site has been the focus of religious and 
                historical significance, leading to the construction of the magnificent Ram Mandir that stands today 
                as a symbol of faith and devotion.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-red-600" />
                Spiritual Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Ayodhya holds immense spiritual significance for millions of Hindus worldwide. It is believed that 
                visiting this sacred city and taking a dip in the holy Sarayu river washes away sins and brings one 
                closer to moksha (liberation). The city is dotted with numerous temples and ghats, each associated 
                with different aspects of Lord Rama's life. The Kanak Bhawan temple, dedicated to Lord Rama and Sita, 
                is particularly revered by devotees who believe that sincere prayers here are always answered.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                Modern Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                In recent years, Ayodhya has gained renewed attention with the construction of the grand Ram Mandir, 
                which was completed in 2023. This magnificent structure, built in the Nagara style of architecture, 
                stands as a testament to the unwavering faith of millions of devotees. The temple complex covers an 
                area of 67 acres and features intricate carvings depicting scenes from the Ramayana. The consecration 
                ceremony in January 2024 was attended by millions of devotees, making it one of the largest religious 
                gatherings in modern history.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-amber-500 pl-4 italic text-gray-700 my-8 bg-amber-50 p-4 rounded-r-lg text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                "Ayodhya is not just a city; it is the embodiment of devotion, where every step taken is a step closer 
                to the divine presence of Lord Rama, and every prayer whispered echoes through centuries of unwavering faith."
              </motion.blockquote>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.6 }}
              >
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                Cultural Heritage
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                Ayodhya's cultural heritage extends far beyond its religious significance. The city has been a center 
                of learning and culture for centuries, with numerous scholars, poets, and saints having lived and worked 
                here. The annual Ram Navami festival, celebrating Lord Rama's birth, transforms the city into a vibrant 
                celebration of faith and devotion. The city's rich tradition of music, dance, and storytelling continues 
                to thrive, with local artists preserving ancient art forms that have been passed down through generations.
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
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  History
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Spiritual
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ramayana
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pilgrimage
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Culture
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
            Want to know more about Ayodhya and Ram Mandir? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-amber-600 hover:text-amber-800 font-medium flex items-center justify-center gap-1 inline-flex"
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

export default AyodhyaRamMandirStory