'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, MapPin, Sparkles, Users } from 'lucide-react'

const Hero = () => {
  const stats = [
    { number: '500+', label: 'Monuments' },
    { number: '2000+', label: 'Stories' },
    { number: '50+', label: 'VR Experiences' },
    { number: '100K+', label: 'Explorers' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900" />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat"
        />
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
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight"
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
            
            <Link
              href="/virtual-visit"
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 flex items-center space-x-2"
            >
              <Play size={20} />
              <span>Start Virtual Tour</span>
            </Link>
          </motion.div>

          {/* Features Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
          >
            <div className="glass p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Narad AI Guide</h3>
              <p className="text-gray-300">Your intelligent cultural companion for immersive storytelling</p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AR/VR Experiences</h3>
              <p className="text-gray-300">Step into history with cutting-edge immersive technology</p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center group hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cultural Gaming</h3>
              <p className="text-gray-300">Discover hidden stories through interactive treasure hunts</p>
            </div>
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
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero