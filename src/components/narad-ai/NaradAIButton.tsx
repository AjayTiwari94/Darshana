'use client'

import React from 'react'
import { MessageCircle, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNaradAIStore, useUIStore } from '@/store'

const NaradAIButton = () => {
  const naradAIStore = useNaradAIStore()
  const uiStore = useUIStore()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('NaradAIButton clicked - start')
    console.log('Current naradAIStore:', naradAIStore)
    console.log('Current uiStore:', uiStore)
    
    try {
      // Simply open the chat without any session management
      console.log('Opening Narad AI chat')
      if (typeof uiStore.setNaradAIOpen === 'function') {
        uiStore.setNaradAIOpen(true)
        console.log('Narad AI chat opened')
      } else {
        console.log('setNaradAIOpen is not a function')
      }
      
      console.log('NaradAIButton clicked - end')
    } catch (error) {
      console.error('Error handling NaradAI button click:', error)
    }
  }

  const isNaradAIOpen = uiStore.isNaradAIOpen
  console.log('Is Narad AI open:', isNaradAIOpen)
  
  if (isNaradAIOpen) {
    console.log('Hiding NaradAIButton because chat is open')
    return null
  }

  console.log('Rendering NaradAIButton')

  return (
    <motion.button
      onClick={handleClick}
      className="relative p-2 text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-110 cursor-pointer"
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
        {naradAIStore.isChatOpen ? (
          <Bot size={20} className="animate-pulse" />
        ) : (
          <MessageCircle size={20} />
        )}
      </div>
      
      {/* Active Indicator */}
      {naradAIStore.isChatOpen && (
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