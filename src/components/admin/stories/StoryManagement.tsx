'use client'

import React, { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  HeartIcon,
  StarIcon,
  PlayIcon,
  BookmarkIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Story {
  _id: string
  title: string
  description: string
  content: string
  monument: {
    _id: string
    name: string
  }
  category: string
  period: string
  narrator: {
    name: string
    avatar?: string
  }
  duration: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  mediaAssets: {
    images: string[]
    audio?: string
    video?: string
  }
  isPublished: boolean
  isFeatured: boolean
  statistics: {
    views: number
    likes: number
    shares: number
    averageRating: number
    totalRatings: number
  }
  createdAt: string
  updatedAt: string
}

const StoryManagement: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState<{id: string, title: string} | null>(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [deleting, setDeleting] = useState(false)

  const categories = ['Historical', 'Mythological', 'Architectural', 'Cultural', 'Archaeological']
  const statusOptions = [
    { value: '', label: 'All Stories' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'featured', label: 'Featured' }
  ]

  useEffect(() => {
    fetchStories()
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  const fetchStories = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedStatus === 'published') params.append('isPublished', 'true')
      if (selectedStatus === 'draft') params.append('isPublished', 'false')
      if (selectedStatus === 'featured') params.append('isFeatured', 'true')
      params.append('sort', sortBy)
      params.append('order', sortOrder)

      const response = await fetch(`/api/admin/stories?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setStories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      alert('Failed to fetch stories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setStories(stories.filter(story => story._id !== storyId))
        setShowDeleteModal(null)
        alert('Story deleted successfully!')
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete story')
      }
    } catch (error) {
      console.error('Failed to delete story:', error)
      alert('Failed to delete story. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const toggleStoryStatus = async (storyId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })
      
      if (response.ok) {
        setStories(stories.map(story => 
          story._id === storyId 
            ? { ...story, isPublished: !isPublished }
            : story
        ))
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update story status')
      }
    } catch (error) {
      console.error('Failed to update story status:', error)
      alert('Failed to update story status. Please try again.')
    }
  }

  const toggleFeaturedStatus = async (storyId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })
      
      if (response.ok) {
        setStories(stories.map(story => 
          story._id === storyId 
            ? { ...story, isFeatured: !isFeatured }
            : story
        ))
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to update featured status')
      }
    } catch (error) {
      console.error('Failed to update featured status:', error)
      alert('Failed to update featured status. Please try again.')
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.monument.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || story.category === selectedCategory
    
    let matchesStatus = true
    if (selectedStatus === 'published') matchesStatus = story.isPublished
    if (selectedStatus === 'draft') matchesStatus = !story.isPublished
    if (selectedStatus === 'featured') matchesStatus = story.isFeatured
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const StoryCard: React.FC<{ story: Story }> = ({ story }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={story.mediaAssets.images[0] || '/placeholder-story.jpg'}
          alt={story.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          {story.isFeatured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            story.isPublished 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {story.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
          <PlayIcon className="h-4 w-4 mr-1" />
          {formatDuration(story.duration)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {story.title}
          </h3>
          <button
            onClick={() => toggleFeaturedStatus(story._id, story.isFeatured)}
            className={`p-1 rounded ${story.isFeatured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            {story.isFeatured ? <StarSolidIcon className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {story.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Monument: {story.monument.name}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              story.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              story.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {story.difficulty}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Category: {story.category}</span>
            <span>Period: {story.period}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {story.statistics.views.toLocaleString()}
            </span>
            <span className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-1" />
              {story.statistics.likes.toLocaleString()}
            </span>
            <span className="flex items-center">
              <StarIcon className="h-4 w-4 mr-1" />
              {story.statistics.averageRating.toFixed(1)} ({story.statistics.totalRatings})
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Created: {new Date(story.createdAt).toLocaleDateString()}
            <br />
            Updated: {new Date(story.updatedAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex space-x-2">
            <Link href={`/stories/${story._id}`} className="text-blue-600 hover:text-blue-800 p-1">
              <EyeIcon className="h-4 w-4" />
            </Link>
            <Link href={`/admin/stories/${story._id}/edit`} className="text-green-600 hover:text-green-800 p-1">
              <PencilIcon className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setShowDeleteModal({id: story._id, title: story.title})}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => toggleStoryStatus(story._id, story.isPublished)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              story.isPublished
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {story.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Story Management</h1>
            <p className="text-gray-600 mt-1">Manage cultural stories and narratives</p>
          </div>
          <Link href="/admin/stories/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Story
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookmarkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stories</p>
                <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stories.filter(s => s.isPublished).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stories.filter(s => s.isFeatured).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stories.reduce((acc, story) => acc + story.statistics.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="statistics.views-desc">Most Viewed</option>
                <option value="statistics.likes-desc">Most Liked</option>
                <option value="statistics.averageRating-desc">Highest Rated</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredStories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Story</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the story:
              </p>
              <p className="font-medium mb-4 text-red-600">
                "{showDeleteModal.title}"
              </p>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStory(showDeleteModal.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryManagement