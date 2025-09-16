'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar,
  Star,
  Users,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Palette
} from 'lucide-react'

interface Monument {
  _id: string
  name: string
  location: {
    city: string
    state: string
  }
  categories: string[]
  historicalPeriod: {
    era: string
    yearBuilt?: number
  }
  statistics: {
    totalVisits: number
    averageRating: number
    popularityScore: number
  }
  status: string
  images: Array<{
    url: string
    isPrimary: boolean
  }>
  stories: string[]
  arAssets: string[]
  vrExperiences: string[]
  createdAt: string
}

const MonumentManagement = () => {
  const [monuments, setMonuments] = useState<Monument[]>([])
  const [filteredMonuments, setFilteredMonuments] = useState<Monument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  const categories = [
    'temple', 'palace', 'fort', 'monument', 'cave', 
    'archaeological_site', 'museum', 'garden', 'tomb'
  ]

  const statusOptions = ['active', 'inactive', 'maintenance', 'coming_soon']

  useEffect(() => {
    fetchMonuments()
  }, [])

  useEffect(() => {
    filterAndSortMonuments()
  }, [monuments, searchQuery, selectedCategory, selectedStatus, sortBy])

  const fetchMonuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/monuments?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setMonuments(data.data)
      }
    } catch (error) {
      console.error('Error fetching monuments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortMonuments = () => {
    let filtered = [...monuments]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(monument =>
        monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monument.location.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(monument =>
        monument.categories.includes(selectedCategory)
      )
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(monument =>
        monument.status === selectedStatus
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'visits':
          return b.statistics.totalVisits - a.statistics.totalVisits
        case 'rating':
          return b.statistics.averageRating - a.statistics.averageRating
        case 'popularity':
        default:
          return b.statistics.popularityScore - a.statistics.popularityScore
      }
    })

    setFilteredMonuments(filtered)
  }

  const handleDeleteMonument = async (monumentId: string) => {
    try {
      const response = await fetch(`/api/monuments/${monumentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setMonuments(monuments.filter(m => m._id !== monumentId))
        setShowDeleteModal(null)
      }
    } catch (error) {
      console.error('Error deleting monument:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'coming_soon': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const MonumentCard = ({ monument }: { monument: Monument }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card hover:shadow-lg transition-all duration-300"
    >
      {/* Monument Image */}
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
        {monument.images.find(img => img.isPrimary) ? (
          <img
            src={monument.images.find(img => img.isPrimary)?.url}
            alt={monument.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(monument.status)}`}>
            {monument.status}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 bg-white/90 rounded-lg hover:bg-white transition-colors">
            <Eye size={16} className="text-gray-700" />
          </button>
          <button className="p-1 bg-white/90 rounded-lg hover:bg-white transition-colors">
            <Edit size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Monument Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {monument.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin size={14} className="mr-1" />
            {monument.location.city}, {monument.location.state}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {monument.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
            >
              {category.replace('_', ' ')}
            </span>
          ))}
          {monument.categories.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{monument.categories.length - 2}
            </span>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center border-t pt-3">
          <div>
            <div className="text-lg font-bold text-primary-600">
              {monument.statistics.totalVisits}
            </div>
            <div className="text-xs text-gray-500">Visits</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 flex items-center justify-center">
              {monument.statistics.averageRating.toFixed(1)}
              <Star size={14} className="ml-1 fill-current" />
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {monument.stories.length}
            </div>
            <div className="text-xs text-gray-500">Stories</div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Palette size={12} className="mr-1" />
              {monument.arAssets.length} AR
            </span>
            <span className="flex items-center">
              <Video size={12} className="mr-1" />
              {monument.vrExperiences.length} VR
            </span>
          </div>
          <div className="text-right">
            {new Date(monument.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 btn-outline text-sm py-1">
            Edit
          </button>
          <button 
            onClick={() => setShowDeleteModal(monument._id)}
            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 text-sm rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monument Management</h1>
          <p className="text-gray-600">Manage cultural heritage sites and monuments</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button className="btn-secondary">
            <Filter size={16} className="mr-2" />
            Export
          </button>
          <button className="btn-primary">
            <Plus size={16} className="mr-2" />
            Add Monument
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Monuments</p>
              <p className="text-2xl font-bold text-blue-900">{monuments.length}</p>
            </div>
            <MapPin className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Sites</p>
              <p className="text-2xl font-bold text-green-900">
                {monuments.filter(m => m.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Visits</p>
              <p className="text-2xl font-bold text-purple-900">
                {monuments.reduce((sum, m) => sum + m.statistics.totalVisits, 0).toLocaleString()}
              </p>
            </div>
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Rating</p>
              <p className="text-2xl font-bold text-orange-900">
                {(monuments.reduce((sum, m) => sum + m.statistics.averageRating, 0) / monuments.length || 0).toFixed(1)}
              </p>
            </div>
            <Star className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search monuments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field md:w-32"
          >
            <option value="">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field md:w-32"
          >
            <option value="popularity">Popularity</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="visits">Visits</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Showing {filteredMonuments.length} of {monuments.length} monuments
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-1">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className="w-4 h-4 flex flex-col space-y-1">
              <div className="bg-current h-1 rounded-sm"></div>
              <div className="bg-current h-1 rounded-sm"></div>
              <div className="bg-current h-1 rounded-sm"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Monument Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMonuments.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No monuments found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new monument.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredMonuments.map((monument) => (
            <MonumentCard key={monument._id} monument={monument} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Monument</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this monument? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMonument(showDeleteModal)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MonumentManagement