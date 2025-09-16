'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import StoryEditor from '@/components/admin/stories/StoryEditor'

const EditStoryPage: React.FC = () => {
  const pathname = usePathname()
  const storyId = pathname.split('/')[4] // Extract ID from /admin/stories/[id]/edit
  const [loading, setLoading] = useState(true)
  const [storyData, setStoryData] = useState<any>(null)
  
  useEffect(() => {
    if (storyId) {
      fetchStoryData()
    }
  }, [storyId])
  
  const fetchStoryData = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`)
      const data = await response.json()
      
      if (data.success) {
        // Transform the API data to match the form structure
        const transformedData = {
          title: data.data.title,
          description: data.data.description,
          content: data.data.content,
          monument: data.data.monument?.name || '',
          type: data.data.category?.toLowerCase() || 'history',
          difficulty: data.data.difficulty?.toLowerCase() || 'intermediate',
          ageRating: data.data.ageRating || 'all',
          themes: data.data.themes || [],
          narrator: data.data.narrator?.name || 'Ajay Tiwari',
          isPublished: data.data.isPublished || false,
          isFeatured: data.data.isFeatured || false,
          mediaAssets: data.data.mediaAssets?.images?.map((url: string, index: number) => ({
            id: `image-${index}`,
            type: 'image',
            url,
            fileName: `image-${index}.jpg`
          })) || [],
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt
        }
        
        setStoryData(transformedData)
      } else {
        alert(data.message || 'Failed to fetch story data')
      }
    } catch (error) {
      console.error('Failed to fetch story data:', error)
      alert('Failed to fetch story data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!storyData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Story Not Found</h2>
          <p className="text-gray-600">The requested story could not be found.</p>
        </div>
      </div>
    )
  }
  
  return <StoryEditor initialData={storyData} isEditing={true} storyId={storyId} />
}

export default EditStoryPage