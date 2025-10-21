'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, MessageCircle, Sparkles } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '../../../store'

const MathuraKrishnaJanmabhoomiStory: React.FC = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(true)

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('mathura-krishna-janmabhoomi-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about Krishna Janmabhoomi in Mathura and its significance as the birthplace of Lord Krishna")
    
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
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50"
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
              src="/images/Mathura.jpg" 
              alt="Mathura Krishna Janmabhoomi" 
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
                The Divine Birthplace of Lord Krishna
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Explore Mathura, the sacred land where Lord Krishna was born
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
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
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
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-md" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">Ajay Tiwari</p>
                  <p className="text-gray-600">Storyteller</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">6th Century BC</p>
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
                Located on the banks of the sacred Yamuna river in Uttar Pradesh, Mathura is one of the seven holiest 
                cities in Hinduism and is revered as the birthplace of Lord Krishna, the eighth avatar of Lord Vishnu. 
                This ancient city, with its rich cultural heritage and spiritual significance, has been a center of 
                devotion and pilgrimage for thousands of years.
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
                Mathura's history dates back to the 6th century BC and is mentioned in ancient texts like the Mahabharata 
                and various Puranas. Archaeological evidence suggests that it was an important urban center during the 
                Mauryan and Sunga periods. The city flourished as a major trade center and was known for its artisans, 
                particularly those working with ivory, sandalwood, and textiles.
              </motion.p>
              
              <motion.div 
                className="my-8 rounded-lg overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <img 
                  src="/images/Mathura.jpg" 
                  alt="Krishna Janmabhoomi Temple" 
                  className="w-full h-auto"
                />
                <p className="text-center text-gray-600 mt-2">The sacred Krishna Janmabhoomi Temple complex</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                According to Hindu mythology, Mathura was the capital of the Yadava kingdom ruled by King Kamsa, the 
                maternal uncle of Lord Krishna. The Bhagavata Purana describes how Lord Krishna was born in a prison 
                cell to Devaki and Vasudeva, and how he was secretly taken to Gokul to be raised by Nanda and Yashoda. 
                The Krishna Janmabhoomi temple complex marks the exact spot where Lord Krishna is believed to have been born.
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
                Mathura holds immense spiritual significance for Hindus as the birthplace of Lord Krishna, who represents 
                love, joy, and divine playfulness (leela). The city is closely associated with Krishna's childhood 
                activities, including his playful pranks (makhan chor), his divine love with the gopis, and his 
                teachings in the Bhagavad Gita. The 108 Divya Desams (holy shrines) associated with Krishna are 
                primarily located in and around Mathura and Vrindavan.
              </motion.p>
              
              <motion.blockquote 
                className="border-l-4 border-purple-500 pl-4 italic text-gray-700 my-8 bg-purple-50 p-4 rounded-r-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                "Mathura is where divine love was born, where Krishna's flute first played the melody of devotion. 
                Every corner of this sacred land echoes with the sweet memories of Krishna's childhood and his eternal 
                love for his devotees."
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
                Today, Mathura continues to attract millions of pilgrims and tourists annually, especially during 
                festivals like Janmashtami (Krishna's birthday) and Holi. The city's temple complexes, including 
                Krishna Janmabhoomi, Dwarkadhish Temple, and Prem Mandir, are architectural marvels that showcase 
                the devotion of countless generations. The annual Braj Holi festival transforms the entire region 
                into a vibrant celebration of Krishna's divine love, making Mathura a living testament to India's 
                rich spiritual and cultural heritage.
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
                  Krishna
                </motion.span>
                <motion.span 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Bhagavad Gita
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
            Want to know more about Mathura and Lord Krishna? 
            <button 
              onClick={handleTalkToNarad}
              className="ml-2 text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-1 inline-flex"
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

export default MathuraKrishnaJanmabhoomiStory