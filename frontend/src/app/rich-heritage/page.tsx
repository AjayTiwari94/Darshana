'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, Sparkles, BookOpenIcon, ClockIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { useNaradAIStore, useUIStore } from '@/store'
import PageTransition from '../../components/common/PageTransition'

const RichHeritagePage: React.FC = () => {
  const { startSession, messages } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('rich-heritage-session')
    }
    
    // Set context for the current page
    const pageContext = "The user is on the Rich Heritage page, which features history, myths, and beliefs about sacred places in India. This feature is coming soon."
    
    // Open the AI chat
    setNaradAIOpen(true)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200 opacity-10"
            style={{
              width: Math.random() * 120 + 60,
              height: Math.random() * 120 + 60,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 7 + 7,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/stories"
            className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Stories
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-xl">
              <BookOpenIcon className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 bg-clip-text text-transparent mb-6"
          >
            Rich Heritage
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            History, Myths & Beliefs
          </motion.p>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12"
          >
            <motion.p
              className="text-2xl md:text-3xl font-medium text-gray-600 leading-relaxed"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Thanks for checking out our platform! This feature is on the way and will be live soon. We're grateful for your patience and support.
            </motion.p>
          </motion.div>

          {/* Feature Preview Cards */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Historical Accounts */}
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Historical Accounts</h3>
              <p className="text-gray-600 text-sm">Discover the rich historical narratives of India's sacred places</p>
            </div>

            {/* Mythological Tales */}
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mythological Tales</h3>
              <p className="text-gray-600 text-sm">Explore the divine stories and legends from ancient texts</p>
            </div>

            {/* Spiritual Beliefs */}
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Spiritual Beliefs</h3>
              <p className="text-gray-600 text-sm">Understand the deep spiritual significance and traditions</p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <p className="text-gray-600 mb-6">
              While you wait, explore our other amazing features!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cultural-stories"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Cultural Stories
              </Link>
              <Link
                href="/monuments"
                className="inline-flex items-center px-6 py-3 bg-white text-amber-700 font-medium rounded-lg border-2 border-amber-200 hover:bg-amber-50 transition-colors"
              >
                <StarIcon className="h-5 w-5 mr-2" />
                Monuments
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </PageTransition>
  )
}

export default RichHeritagePage
