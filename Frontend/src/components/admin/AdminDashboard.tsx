'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import { apiCall } from '@/lib/api'
import { 
  UsersIcon,
  DocumentTextIcon,
  MapPinIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AdminStats {
  totalUsers: number
  totalStories: number
  totalMonuments: number
  pendingReviews: number
  monthlyGrowth: number
  activeUsers: number
}

interface RecentActivity {
  _id: string
  type: 'user_registration' | 'story_submission' | 'content_review' | 'system_alert'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

interface ContentReview {
  _id: string
  type: 'story' | 'monument' | 'user_report'
  title: string
  author: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const AdminDashboard: React.FC = () => {
  const { user, token } = useAuthStore()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalStories: 0,
    totalMonuments: 0,
    pendingReviews: 0,
    monthlyGrowth: 0,
    activeUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [pendingContent, setPendingContent] = useState<ContentReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (!token) {
        throw new Error('No authentication token available')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      // Fetch admin statistics
      const [statsRes, activityRes, pendingRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', { headers }),
        fetch('http://localhost:5000/api/admin/activity', { headers }),
        fetch('http://localhost:5000/api/admin/pending-content', { headers })
      ])

      if (!statsRes.ok) {
        throw new Error(`Stats API error: ${statsRes.status}`)
      }
      if (!activityRes.ok) {
        throw new Error(`Activity API error: ${activityRes.status}`)
      }
      if (!pendingRes.ok) {
        throw new Error(`Pending content API error: ${pendingRes.status}`)
      }

      const [statsData, activityData, pendingData] = await Promise.all([
        statsRes.json(),
        activityRes.json(),
        pendingRes.json()
      ])

      if (statsData.success) {
        setStats(statsData.data)
      }
      if (activityData.success) {
        setRecentActivity(activityData.data)
      }
      if (pendingData.success) {
        setPendingContent(pendingData.data)
      }
      
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
      setError('Failed to load admin data. Please try again.')
      
      // Fallback to mock data if API fails
      setStats({
        totalUsers: 0,
        totalStories: 0,
        totalMonuments: 0,
        pendingReviews: 0,
        monthlyGrowth: 0,
        activeUsers: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContentAction = async (contentId: string, action: 'approved' | 'rejected', type: 'story' | 'monument') => {
    try {
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`http://localhost:5000/api/admin/content/${contentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action, type })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} content`)
      }

      // Refresh pending content after action
      fetchAdminData()
      
    } catch (error) {
      console.error(`Failed to ${action} content:`, error)
      setError(`Failed to ${action} content. Please try again.`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'info': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="h-5 w-5" />
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'error': return <XCircleIcon className="h-5 w-5" />
      case 'info': return <EyeIcon className="h-5 w-5" />
      default: return <EyeIcon className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <CogIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.firstName}! Manage your platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Administrator
              </span>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-2 text-red-600 hover:text-red-800 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600">+{stats.monthlyGrowth}% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStories}</p>
                <p className="text-xs text-gray-500">Content library</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monuments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMonuments}</p>
                <p className="text-xs text-gray-500">Locations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                <p className="text-xs text-yellow-600">Needs attention</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions & Pending Reviews */}
          <div className="space-y-6">
            {/* Quick Admin Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-900">Add New Monument</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <UsersIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-900">Manage Users</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-900">Review Content</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <ChartBarIcon className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-900">View Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                  <CogIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-900">System Settings</span>
                </button>
              </div>
            </div>

            {/* Pending Content Reviews */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
                  {pendingContent.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {pendingContent.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                {pendingContent.length > 0 ? (
                  <div className="space-y-4">
                    {pendingContent.map((content) => (
                      <div key={content._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {content.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {content.author} • {content.type}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(content.submittedAt).toLocaleString()}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {content.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <button 
                            onClick={() => handleContentAction(content._id, 'approved', content.type)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            <CheckCircleIcon className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button 
                            onClick={() => handleContentAction(content._id, 'rejected', content.type)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            <XCircleIcon className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                            <EyeIcon className="h-3 w-3" />
                            <span>Review</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No pending reviews</p>
                    <p className="text-xs text-gray-400">All content is up to date</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Server Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Database</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active Users</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{stats.activeUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard