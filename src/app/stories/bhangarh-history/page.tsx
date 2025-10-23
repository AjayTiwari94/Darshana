'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ShareIcon, 
  BookmarkIcon, 
  ClockIcon, 
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Sparkles } from 'lucide-react'
import { useNaradAIStore, useUIStore } from '@/store'
import Link from 'next/link'

const BhangarhHistoryStory = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showAIButton, setShowAIButton] = useState(true) // Added this line

  // Story content data
  const story = {
    title: "The History of Bhangarh Fort",
    subtitle: "From Royal Residence to Haunted Ruins",
    image: "/bhangarhfort.jpg",
    images: [
      "/images/bhangarhfort.jpg",
      "/bhangarhfort.jpg"
    ],
    duration: 10,
    author: "Ajay Tiwari",
    date: "October 8, 2025",
    monument: {
      name: "Bhangarh Fort",
      location: "Alwar, Rajasthan"
    },
    content: `
      <p class="mb-6">Bhangarh Fort, located in the Alwar district of Rajasthan, stands as a testament to the grandeur of medieval Indian architecture. Built in 1573 by Raja Bhagwant Das, the son of Raja Todar Mal who served as a minister in the court of Emperor Akbar, this fort holds a significant place in Indian history.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">The Founder and His Legacy</h3>
      <p class="mb-6">Raja Bhagwant Das was not only a skilled warrior but also a trusted advisor to Emperor Akbar. His military prowess was evident in the numerous battles he fought alongside the Mughal emperor, including the conquest of Gujarat. As a reward for his loyalty and services, Akbar granted him the region of Bhangarh, where he decided to build a magnificent fort.</p>
      
      <p class="mb-6">The fort was strategically located on a hilltop, providing a commanding view of the surrounding areas. Its construction was a marvel of medieval engineering, with massive walls, intricate palaces, and sophisticated water management systems that ensured the fort could withstand prolonged sieges.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">Architectural Marvel</h3>
      <p class="mb-6">Bhangarh Fort is renowned for its exceptional architecture, which blends Rajput and Mughal styles. The fort complex includes several palaces, temples, and residential quarters, all built with precision and artistic flair. The most notable structure within the fort is the Bhangarh Fort Temple, dedicated to Lord Shiva, which showcases intricate carvings and architectural brilliance.</p>
      
      <p class="mb-6">The fort's design also reflects advanced knowledge of town planning. The residential areas were strategically placed to maximize security while ensuring easy access to water sources. The fort's water management system, which included step wells and underground channels, was particularly impressive for its time.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">The Rise and Fall</h3>
      <p class="mb-6">Under the rule of Raja Bhagwant Das and his successors, Bhangarh prospered as a center of culture and learning. The fort attracted scholars, artists, and traders from across the region, contributing to its economic and cultural growth. The royal court was known for its patronage of arts and literature.</p>
      
      <p class="mb-6">However, the fort's glory was short-lived. Political upheavals and conflicts with neighboring kingdoms eventually led to its decline. The fort changed hands multiple times during various power struggles, and by the 18th century, it was largely abandoned.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">Under the British Raj</h3>
      <p class="mb-6">During the British colonial period, Bhangarh Fort came under the administration of the British East India Company. The British recognized the fort's strategic importance and conducted several archaeological surveys of the site. However, they did little to preserve the fort's structures, which continued to deteriorate over time.</p>
      
      <p class="mb-6">The British classified Bhangarh as a "haunted" location, which only added to its mystique. Local folklore and the existing curse传说 further discouraged people from settling in the area, leading to its continued abandonment.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">Modern-Day Conservation</h3>
      <p class="mb-6">Today, Bhangarh Fort is protected by the Archaeological Survey of India (ASI) and is recognized as a site of historical and archaeological significance. The ASI has undertaken several conservation efforts to preserve the fort's remaining structures, though much of the original grandeur has been lost to time.</p>
      
      <p class="mb-6">The fort has become a popular destination for history enthusiasts and adventure seekers. However, due to its reputation as a haunted location, the ASI has imposed strict restrictions on visiting the fort after sunset, making it one of the few protected monuments in India with such regulations.</p>
      
      <p class="font-bold text-gray-900">Have questions about Bhangarh's history? Ask Narad AI below!</p>
    `
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === story.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? story.images.length - 1 : prev - 1
    )
  }

  const handleTalkToNarad = () => {
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('bhangarh-history-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the fascinating history of Bhangarh Fort and why it's considered one of India's most mysterious historical sites")
    
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center flex items-center justify-center" 
           style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${story.image}')` }}>
        <div className="text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {story.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light mb-6"
          >
            {story.subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center space-x-4 text-sm"
          >
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {story.author}
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {story.duration} min read
            </div>
            <div>{story.date}</div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/stories" className="flex items-center text-amber-600 hover:text-amber-700 font-medium">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Stories
          </Link>
          
          {/* Talk to Narad AI Button */}
          {showAIButton && (
            <button
              onClick={handleTalkToNarad}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles size={16} />
              <span className="font-medium">Ask Narad AI</span>
            </button>
          )}
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={story.images[currentImageIndex]}
            alt={story.title}
            className="w-full h-96 object-cover"
          />
          
          {story.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {story.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Story Meta */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.title}</h2>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">{story.monument.name}</span>
                <span className="mx-2">•</span>
                <span>{story.monument.location}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>Like</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="h-5 w-5" />
                ) : (
                  <BookmarkIcon className="h-5 w-5" />
                )}
                <span>Save</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>

        {/* Related Monument */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold mb-4">Explore Bhangarh Fort</h3>
              <p className="mb-4">Discover the historical Bhangarh Fort, a magnificent example of Rajput and Mughal architecture. Visit during daylight hours to explore its ancient ruins and learn about its fascinating history.</p>
              <Link href="/monuments/bhangarh" className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Visit Monument
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
            <div className="w-full md:w-1/3">
              <img 
                src={story.image} 
                alt="Bhangarh Fort" 
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BhangarhHistoryStory