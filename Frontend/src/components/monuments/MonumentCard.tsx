import React from 'react'
import Link from 'next/link'
import { MapPinIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline'

interface Monument {
  _id: string
  name: string
  location: {
    city: string
    state: string
  }
  images: string[]
  description: string
  category: string
  period: string
  statistics: {
    views: number
    averageRating: number
    totalRatings: number
  }
}

interface MonumentCardProps {
  monument: Monument
  className?: string
}

const MonumentCard: React.FC<MonumentCardProps> = ({ monument, className = '' }) => {
  return (
    <Link href={`/monuments/${monument._id}`}>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
        <div className="relative">
          <img
            src={monument.images?.[0] || '/placeholder-monument.jpg'}
            alt={monument.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
            {monument.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {monument.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {monument.description}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{monument.location.city}, {monument.location.state}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                {monument.statistics.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <StarIcon className="h-4 w-4 mr-1" />
                {monument.statistics.averageRating.toFixed(1)} ({monument.statistics.totalRatings})
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {monument.period}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MonumentCard