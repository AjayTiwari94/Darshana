import React, { useState } from 'react'
import Link from 'next/link'
import { MapPinIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useNaradAIStore, useUIStore } from '@/store'

interface CulturalStoryCardProps {
  place: string
  state: string
  storyCount: number
  description: string
  imageUrl?: string
  className?: string
}

const CulturalStoryCard: React.FC<CulturalStoryCardProps> = ({ 
  place, 
  state, 
  storyCount, 
  description, 
  imageUrl,
  className = '' 
}) => {
  const { startSession, messages, setInitialInput } = useNaradAIStore()
  const { setNaradAIOpen } = useUIStore()
  const [showAIButton, setShowAIButton] = useState(false)

  const handleTalkToNarad = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Start a new session if one doesn't exist
    if (messages.length === 0) {
      startSession('cultural-story-card-session')
    }
    
    // Set initial input with a query about the story
    setInitialInput(`Tell me more about cultural stories related to ${place} in ${state}. This location has ${storyCount} stories and is described as: ${description}`)
    
    // Open the AI chat
    setNaradAIOpen(true)
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 ease-in-out relative ${className}`}
      onMouseEnter={() => setShowAIButton(true)}
      onMouseLeave={() => setShowAIButton(false)}
    >
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={place}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
            <BookOpenIcon className="h-16 w-16 text-white opacity-80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white text-center px-4">{place}</h3>
        </div>
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
          {storyCount} stories
        </div>
        
        {/* AI Button with simple fade in/out */}
        {showAIButton && (
          <button
            className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg opacity-100 transition-opacity duration-200"
            onClick={handleTalkToNarad}
          >
            <SparklesIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="h-5 w-5 mr-2 text-amber-600" />
          <span>{state}</span>
        </div>
        
        <p className="text-gray-700 line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            History
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Myths
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Beliefs
          </span>
        </div>
      </div>
    </div>
  )
}

export default CulturalStoryCard