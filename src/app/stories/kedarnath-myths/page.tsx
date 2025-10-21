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
      startSession('kedarnath-myths-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the myths and legends associated with Kedarnath Temple and Lord Shiva")
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div>
          <Link href="/stories" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Stories
          </Link>
        </div>
        
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-96">
            <img 
              src="/images/sacred_places/Kedarnath.jpg" 
              alt="Kedarnath Temple" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                The Legend of Kedarnath
              </h1>
              <p className="text-xl text-blue-200">
                The divine mythological tale of Lord Shiva and the Pandavas from the Mahabharata
              </p>
            </div>
            
            {/* Floating AI Button */}
            <div className="absolute top-4 right-4">
              <AnimatePresence>
                {showAIButton && (
                  <button
                    onClick={handleTalkToNarad}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles size={16} />
                    <span className="font-medium">Talk to Narad</span>
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200">
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
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
                The Great Mahabharata
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                After the great war of Kurukshetra, the Pandavas emerged victorious but were deeply troubled by the immense destruction and loss of life that the battle had caused. The five brothers - Yudhishthira, Bhima, Arjuna, Nakula, and Sahadeva - felt the weight of their actions and sought redemption for the sins they had committed during the war. They realized that to find peace and liberation, they needed to seek the blessings of Lord Shiva, the supreme deity who embodies both destruction and regeneration.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-purple-600" />
                The Search for Lord Shiva
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                The Pandavas embarked on a pilgrimage to find Lord Shiva, who had taken the form of a bull and was wandering in the Himalayas to avoid their worship. When the Pandavas finally caught up with the divine bull, Lord Shiva, in his bull form, tried to escape by diving into the earth. However, the determined Pandavas caught hold of the bull's tail, legs, and hump. In his attempt to free himself, Lord Shiva disappeared into the earth, leaving behind only parts of his form at different locations.
              </p>
              
              <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/images/sacred_places/Kedarnath_interior.jpg" 
                  alt="Kedarnath Temple Interior" 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-gray-50">
                  <p className="text-gray-600 italic">
                    "The Kedarnath Temple, one of the twelve Jyotirlingas, is believed to be built at the spot where Lord Shiva's hump landed."
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-green-600" />
                The Sacred Lingam
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                According to the legend, the part of Lord Shiva that remained above the earth became the sacred lingam that is worshipped in the Kedarnath Temple. The other parts of his form are believed to have manifested at four other locations in the region, forming the Panch Kedar pilgrimage circuit - Tungnath, Rudranath, Madhyamaheshwar, and Kalpeshwar. Each of these temples represents a different part of Lord Shiva's body.
              </p>
              
              <blockquote className="border-l-4 border-blue-500 pl-4 my-8 italic text-gray-700">
                "The journey to Kedarnath is not just a physical pilgrimage, but a spiritual quest to find the divine within oneself. The harsh terrain and challenging conditions are designed to purify the soul and prepare the devotee for the ultimate darshan of Lord Shiva."
              </blockquote>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-red-600" />
                The Eternal Abode
              </h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                The Kedarnath Temple, situated at an altitude of 3,583 meters above sea level, is one of the highest Shiva temples in the world. It is believed that Lord Shiva himself chose this location to reside, making it a place of immense spiritual power. The temple remains open only for six months in a year, from Akshaya Tritiya to Kartik Purnima, as it gets buried under snow during the winter months.
              </p>
              
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                The legend of Kedarnath serves as a reminder that the divine is not distant or inaccessible, but resides within each of us. The journey to the temple, both physical and spiritual, is a path to self-realization and union with the ultimate reality.
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleTalkToNarad}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">Ask Narad AI about this story</span>
                </button>
                
                <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow hover:shadow-md transition-all">
                  <BookOpen size={20} />
                  <span className="font-medium">Explore More Stories</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default KedarnathMythsStory
