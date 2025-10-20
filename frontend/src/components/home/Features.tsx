'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Eye, 
  Trophy, 
  BookOpen, 
  Ticket, 
  Car,
  Sparkles,
  HeadphonesIcon
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Narad AI Guide',
      description: 'Interactive cultural companion providing historical facts, myths, folklore, and personalized storytelling experiences.',
      highlights: ['Voice & Chat Interface', 'Multilingual Support', 'Contextual Stories', 'Audio Narration'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      title: 'Virtual Visit',
      description: 'Immersive AR/VR experiences that bring ancient monuments and legendary stories to life in stunning detail.',
      highlights: ['AR Overlays', 'VR Recreations', 'Interactive Elements', '360° Experiences'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Treasure Hunt',
      description: 'Gamified exploration with myth-based puzzles, folklore riddles, and rewards for discovering hidden cultural gems.',
      highlights: ['Interactive Puzzles', 'Digital Badges', 'Leaderboards', 'Cultural Challenges'],
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Story Hub',
      description: 'Rich multimedia library featuring articles, videos, podcasts, and illustrated comics about heritage sites.',
      highlights: ['Multiple Formats', 'Expert Narration', 'Visual Stories', 'Audio Guides'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Ticket,
      title: 'Smart Ticketing',
      description: 'Seamless booking integration with tourism departments, bundled with exclusive cultural content.',
      highlights: ['QR-based Tickets', 'Bundled Stories', 'Group Discounts', 'Skip Lines'],
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: Car,
      title: 'Travel Integration',
      description: 'End-to-end travel partnerships with transport services, hotels, and heritage circuit packages.',
      highlights: ['Transport Booking', 'Route Planning', 'Hotel Deals', 'Circuit Tours'],
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-primary-600 mr-2" size={24} />
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Platform Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-gray-900 mb-6">
            Reimagining Cultural
            <span className="text-gradient"> Exploration</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how Darshana transforms traditional heritage tourism into an 
            immersive, interactive, and deeply engaging cultural journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <Link href="/guide" className="block h-full">
                  <div className="card h-full hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 p-6 rounded-xl">
                    {/* Icon with Gradient Background */}
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <div className="absolute top-0 left-0 w-16 h-16 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-2">
                        {feature.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/guide" className="inline-flex items-center space-x-4 bg-primary-600 text-white px-8 py-4 rounded-full hover:bg-primary-700 transition-colors duration-300 group">
            <HeadphonesIcon size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold">Learn How to Use All Features</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Features