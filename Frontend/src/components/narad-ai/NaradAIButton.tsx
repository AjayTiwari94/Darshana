'use client'

import React from 'react'
import { MessageCircle, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNaradAIStore, useUIStore } from '@/store'

const NaradAIButton = () => {
  const { isActive, startSession } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()

  const handleClick = () => {
    if (!isActive) {
      startSession()
    }
    setNaradAIOpen(true)
  }

  return (
    <motion.button
      onClick={handleClick}
      className="relative p-2 text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-110"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open Narad AI"
    >
      {/* Pulse Animation - Reduced frequency for better performance */}
      <motion.div
        className="absolute inset-0 bg-primary-400 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Icon */}
      <div className="relative z-10">
        {isActive ? (
          <Bot size={20} className="animate-pulse" />
        ) : (
          <MessageCircle size={20} />
        )}
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

export default NaradAIButton