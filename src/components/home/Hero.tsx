'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, MapPin, Sparkles, Users, ChevronDown } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stats = [
    { number: '500+', label: 'Monuments' },
    { number: '2000+', label: 'Stories' },
    { number: '50+', label: 'VR Experiences' },
    { number: '100K+', label: 'Explorers' },
  ]

  const { startSession, messages } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const handleOpenNaradAI = () => {
    if (messages.length === 0) {
      startSession('hero-section-session')
    }
    setNaradAIOpen(true)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background - Removed overlay to eliminate transparent effect */}
      <div className="absolute inset-0 z-0">
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-sans font-bold text-white leading-tight"
            >
              Where Heritage
              <br />
              <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Comes Alive
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            >
              Experience India's rich cultural heritage through AI-powered storytelling, 
              immersive AR/VR experiences, and interactive cultural journeys.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/monuments"
                className="group relative px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2"
              >
                <MapPin size={20} />
                <span>Explore Monuments</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/virtual-visit"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start Virtual Tour</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 contain-layout"
          >
            <motion.button 
              type="button" 
              onClick={handleOpenNaradAI} 
              className="glass hero-feature-card p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300 hover-lift"
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Narad AI Guide</h3>
              <p className="text-gray-300">Your intelligent cultural companion for immersive storytelling</p>
            </motion.button>
            
            <motion.div
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="hero-feature-card contain-layout"
            >
              <Link href="/virtual-visits" className="glass p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300 hover-lift block h-full">
                <motion.div 
                  className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  animate={{ 
                    rotate: [0, 5, 0], // Reduced rotation to prevent visual overlap
                  }}
                  transition={{ 
                    duration: 4, // Slower animation
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Play size={24} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">AR/VR Experiences</h3>
                <p className="text-gray-300">Step into history with cutting-edge immersive technology</p>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="hero-feature-card contain-layout"
            >
              <Link href="/treasure-hunt" className="glass p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300 hover-lift block h-full">
                <motion.div 
                  className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  animate={{ 
                    y: [0, -3, 0], // Reduced vertical movement
                  }}
                  transition={{ 
                    duration: 3, // Slower animation
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Users size={24} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Cultural Gaming</h3>
                <p className="text-gray-300">Discover hidden stories through interactive treasure hunts</p>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.2 + index * 0.1,
                  type: "spring",
                  stiffness: 200 
                }}
                className="text-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
        <motion.p 
          className="text-white/70 text-sm mt-2 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll Down
        </motion.p>
      </motion.div>
    </section>
  )
}

export default Hero