'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import PageTransition from '@/components/common/PageTransition'

const TreasureHuntComingSoon: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-rose-50 to-orange-50 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-rose-200 opacity-10"
            style={{
              width: Math.random() * 140 + 60,
              height: Math.random() * 140 + 60,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{ duration: Math.random() * 8 + 8, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-rose-700 hover:text-rose-900 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-700 via-fuchsia-600 to-orange-600 bg-clip-text text-transparent mb-6">
            Treasure Hunt
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-8">
            Interactive puzzles, folklore riddles, and rewards — coming soon!
          </p>

          {/* Coming soon card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12"
          >
            <p className="text-2xl md:text-3xl font-medium text-gray-600 leading-relaxed">
              Thank you for exploring our platform! This feature is currently under development and will be available soon. Thank you for your patience.
            </p>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/cultural-stories" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
              Explore Stories
            </Link>
            <Link href="/virtual-visits" className="inline-flex items-center px-6 py-3 bg-white text-rose-700 font-medium rounded-lg border-2 border-rose-200 hover:bg-rose-50 transition-colors">
              Virtual Visits
            </Link>
            <Link href="/monuments" className="inline-flex items-center px-6 py-3 bg-white text-rose-700 font-medium rounded-lg border-2 border-rose-200 hover:bg-rose-50 transition-colors">
              Monuments
            </Link>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </PageTransition>
  )
}

export default TreasureHuntComingSoon


