import React from 'react'
import Link from 'next/link'
import { PlayIcon, ClockIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline'

interface Story {
  _id: string
  title: string
  description: string
  monument: {
    _id: string
    name: string
  }
  narrator: {
    name: string
    avatar?: string
  }
  duration: number
  mediaAssets: {
    images: string[]
    thumbnails: string[]
  }
  statistics: {
    views: number
    likes: number
    averageRating: number
  }
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface StoryCardProps {
  story: Story
  className?: string
}

const StoryCard: React.FC<StoryCardProps> = ({ story, className = '' }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-white'
      case 'Medium': return 'bg-yellow-500 text-white'
      case 'Hard': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <Link href={`/stories/${story._id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="relative">
          <img
            src={story.mediaAssets.images?.[0] || story.mediaAssets.thumbnails?.[0] || '/placeholder-story.jpg'}
            alt={story.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
              {story.difficulty}
            </span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatDuration(story.duration)}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
            <PlayIcon className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {story.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {story.description}
          </p>
          
          <div className="flex items-center mb-3">
            <img
              src={story.narrator.avatar || '/placeholder-avatar.jpg'}
              alt={story.narrator.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{story.narrator.name}</p>
              <p className="text-xs text-gray-500">{story.monument.name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1" />
                {story.statistics.likes.toLocaleString()}
              </span>
              <span className="flex items-center">
                <StarIcon className="h-4 w-4 mr-1" />
                {story.statistics.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {story.statistics.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StoryCard