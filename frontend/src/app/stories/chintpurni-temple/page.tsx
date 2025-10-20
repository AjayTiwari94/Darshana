'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const ChintpurniTempleStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('chintpurni-temple-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about Chintpurni Temple, its architecture, and what makes it a significant pilgrimage site")
    
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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/stories" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
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
              src="/images/chintpurni.jpeg" 
              alt="Chintpurni Temple" 
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
                The Sacred Chintpurni Temple
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Explore the ancient Shaktipeeth where Goddess Sati's feet are believed to have fallen
              </motion.p>
            </motion.div>
            
            {/* Floating AI Button */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              {showAIButton && (
                <motion.button
                  onClick={handleTalkToNarad}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={16} />
                  <span className="font-medium">Talk to Narad</span>
                </motion.button>
              )}
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
                <div className="bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Ancient Times</p>
                <p className="text-gray-600">10 min read</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="prose max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                Introduction
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Nestled in the serene hills of Una district in Himachal Pradesh, the Chintpurni Temple is one of the 
                51 Shaktipeeths and holds immense spiritual significance for devotees of Goddess Shakti. This ancient 
                temple, dedicated to Goddess Chintpurni (an aspect of Goddess Durga), is renowned for fulfilling the 
                wishes of sincere devotees, which is reflected in its name - "Chintpurni" meaning "the one who 
                fulfills all worries and concerns."
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                Historical Origins
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                The history of Chintpurni Temple is deeply rooted in Hindu mythology and the legend of Goddess Sati. 
                According to the Shakti Purana, when Lord Shiva carried the corpse of his beloved wife Sati and 
                performed the Tandava dance of destruction, Lord Vishnu used his Sudarshan Chakra to cut the body 
                into 51 pieces to stop the dance. The feet (Charan) of Goddess Sati are believed to have fallen at 
                this location, which is why the temple is associated with the divine feminine energy of the goddess's feet.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/images/chintpurni.jpeg" 
                  alt="Chintpurni Temple Architecture" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The sacred Chintpurni Temple complex</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                The current structure of the temple has evolved over centuries, with contributions from various rulers 
                and devotees. The temple complex features a beautiful blend of traditional North Indian architecture 
                with local Himachali influences. The main sanctum houses the idol of Goddess Chintpurni, depicted in 
                a serene form that radiates divine grace and compassion. The temple's architecture reflects the rich 
                cultural heritage of the region and showcases the devotion of countless generations.
              </motion.p>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                Spiritual Significance
              </motion.h2>
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Chintpurni Temple holds profound spiritual significance as one of the 51 Shaktipeeths, making it a 
                major pilgrimage destination for devotees of Goddess Shakti. The temple is particularly associated 
                with the goddess's form as Chintpurni, representing the divine feminine energy that removes all 
                worries and concerns of her devotees. Devotees believe that praying at this sacred site with sincere 
                devotion fulfills their wishes and brings them peace of mind.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-teal-500 pl-4 italic text-gray-700 my-8 bg-teal-50 p-4 rounded-r-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                "Chintpurni Temple is where the divine mother listens to the heartfelt prayers of her children. 
                The goddess's feet that fell here continue to bless devotees with the fulfillment of their sincere 
                desires and the removal of all their worries and concerns."
              </motion.blockquote>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-900 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
              >
                Modern Pilgrimage
              </motion.h2>
              <motion.p 
                className="text-gray-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                Today, Chintpurni Temple continues to attract thousands of pilgrims and tourists annually, especially 
                during the Navratri festival and Tuesdays and Fridays when special rituals are performed. The temple 
                is easily accessible by road, and the journey to the temple through the scenic hills of Himachal 
                Pradesh adds to the spiritual experience. The peaceful atmosphere of the temple complex and the 
                surrounding natural beauty make it a perfect destination for spiritual retreats and meditation. 
                The temple's reputation for fulfilling wishes has made it a popular destination for people from all 
                walks of life seeking divine blessings.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  History
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Spiritual
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shakti
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Himalayas
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
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <p className="text-gray-600">
            Want to know more about Chintpurni Temple? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-teal-600 hover:text-teal-800 font-medium flex items-center justify-center gap-1 inline-flex"
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

export default ChintpurniTempleStory