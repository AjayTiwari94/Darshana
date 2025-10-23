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

const BhangarhCurseStory = () => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showAIButton, setShowAIButton] = useState(true) // Added this line

  // Story content data
  const story = {
    title: "The Curse of Bhangarh Fort",
    subtitle: "A Haunting Tale of Love and Vengeance",
    image: "/bhangarhfort.jpg",
    images: [
      "/images/bhangarhfort.jpg",
      "/bhangarhfort.jpg"
    ],
    duration: 8,
    author: "Narad AI",
    date: "October 8, 2025",
    monument: {
      name: "Bhangarh Fort",
      location: "Alwar, Rajasthan"
    },
    content: `
      <p class="mb-6">Deep in the Aravalli hills of Rajasthan lies Bhangarh Fort, a place so shrouded in mystery and fear that even the bravest souls hesitate to visit after sunset. Known as one of India's most haunted locations, Bhangarh carries with it a curse that has persisted for over 400 years.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">The Princess and the Siddha</h3>
      <p class="mb-6">In the early 17th century, Bhangarh was ruled by Raja Bhagwant Das, whose daughter, Princess Ratnavati, was renowned for her unparalleled beauty. Her radiance attracted many suitors, but none could capture her heart. Among her admirers was a Siddha (wizard) named Singhia, who was deeply infatuated with the princess.</p>
      
      <p class="mb-6">Singhia's advances were repeatedly rejected by Princess Ratnavati, which only intensified his obsession. In a desperate attempt to win her favor, he offered her a perfume that he had magically enchanted. However, the princess, being wise, suspected the wizard's intentions and threw the perfume on a rock instead of applying it.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">The Curse is Cast</h3>
      <p class="mb-6">The perfume bottle shattered upon impact with the rock, and the enraged Singhia cursed the entire city of Bhangarh. He declared that just as the perfume had been wasted, so too would the city be destroyed. As part of his curse, he prophesied that the city would be abandoned and that no one would live there after sunset.</p>
      
      <p class="mb-6">Soon after, a battle between rival kingdoms led to the destruction of Bhangarh. The once-thriving city was reduced to ruins, and its inhabitants were forced to flee. True to the curse, the city has remained uninhabited ever since, with locals believing that the spirits of the past still roam the fort's corridors.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">The Forbidden Territory</h3>
      <p class="mb-6">Today, Bhangarh Fort stands as a testament to this ancient curse. The Archaeological Survey of India (ASI) has issued strict warnings against visiting the fort after sunset, as it is believed that the curse becomes active when darkness falls. Visitors who have ventured into the fort after dark report eerie sounds, unexplained movements, and an overwhelming sense of being watched.</p>
      
      <p class="mb-6">The fort's temples, palaces, and residential quarters lie in ruins, but their architectural grandeur is still evident. The most famous structure is the Bhangarh Fort Temple, dedicated to Lord Shiva, which is said to be the epicenter of the supernatural activity.</p>
      
      <h3 class="text-xl font-bold mb-4 text-gray-900">Modern-Day Mystery</h3>
      <p class="mb-6">Despite the warnings, Bhangarh continues to attract thrill-seekers and paranormal investigators from around the world. Many have reported strange occurrences - from sudden temperature drops to disembodied voices echoing through the ruins. Some claim to have seen shadowy figures moving among the ancient stones, while others speak of an invisible force that pushes them away from certain areas of the fort.</p>
      
      <p class="mb-6">Whether the curse is real or merely a product of superstition and imagination, Bhangarh Fort remains one of India's most enigmatic destinations. Its haunting beauty and mysterious past continue to captivate those brave enough to explore its ruins during daylight hours.</p>
      
      <p class="font-bold text-gray-900">Have you heard other versions of this story? Share your thoughts with Narad AI below!</p>
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
      startSession('bhangarh-curse-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput("Tell me more about the curse of Bhangarh Fort and its haunted history")
    
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
          {showAIButton && ( // Added this condition
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
              <p className="mb-4">Discover the mysterious Bhangarh Fort, one of India's most haunted locations. Visit during daylight hours to explore its ancient ruins and learn about its fascinating history.</p>
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

export default BhangarhCurseStory