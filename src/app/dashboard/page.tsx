'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/api'
import AdminDashboard from '../../components/admin/AdminDashboard'
import { 
  UserIcon, 
  MapPinIcon, 
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  TrophyIcon,
  BookmarkIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  CameraIcon,
  ShareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalVisits: number
  storiesViewed: number
  favoritesCount: number
  achievementsCount: number
  totalTimeSpent: number
  averageRating: number
}

interface RecentActivity {
  _id: string
  type: 'visit' | 'story' | 'rating' | 'achievement'
  title: string
  description: string
  timestamp: string
  image?: string
}

interface Achievement {
  _id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: string
}

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, token } = useAuthStore()
  const router = useRouter()

  // Redirect admin users to admin dashboard
  useEffect(() => {
    console.log('User dashboard check - user:', user, 'role:', user?.role);
    if (user?.role === 'admin') {
      console.log('User is admin, redirecting to admin dashboard');
      router.push('/admin')
    }
  }, [user, router])

  useEffect(() => {
    console.log('Authentication check - isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/login')
      return
    }
  }, [isAuthenticated, router])

  // Continue with regular user dashboard logic
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 0,
    storiesViewed: 0,
    favoritesCount: 0,
    achievementsCount: 0,
    totalTimeSpent: 0,
    averageRating: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (!token) {
        throw new Error('No authentication token available')
      }

      // Log the token for debugging (first 10 chars only)
      console.log('Using token (first 10 chars):', token.substring(0, Math.min(10, token.length)));
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      console.log('Fetching dashboard data with token:', token.substring(0, Math.min(10, token.length)) + '...')

      const [statsRes, activityRes, achievementsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/user/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/user/activity`, { headers }),
        fetch(`${API_BASE_URL}/api/user/achievements`, { headers })
      ])

      console.log('API Responses:', { 
        stats: { status: statsRes.status, ok: statsRes.ok },
        activity: { status: activityRes.status, ok: activityRes.ok },
        achievements: { status: achievementsRes.status, ok: achievementsRes.ok }
      })

      // Check if responses are ok
      if (!statsRes.ok) {
        let errorText = '';
        try {
          const errorData = await statsRes.json();
          errorText = errorData.message || await statsRes.text();
        } catch (e) {
          errorText = await statsRes.text();
        }
        console.error('Stats API error response:', errorText);
        throw new Error(`Failed to fetch stats: ${statsRes.status} ${statsRes.statusText} - ${errorText}`)
      }
      if (!activityRes.ok) {
        let errorText = '';
        try {
          const errorData = await activityRes.json();
          errorText = errorData.message || await activityRes.text();
        } catch (e) {
          errorText = await activityRes.text();
        }
        console.error('Activity API error response:', errorText);
        throw new Error(`Failed to fetch activity: ${activityRes.status} ${activityRes.statusText} - ${errorText}`)
      }
      if (!achievementsRes.ok) {
        let errorText = '';
        try {
          const errorData = await achievementsRes.json();
          errorText = errorData.message || await achievementsRes.text();
        } catch (e) {
          errorText = await achievementsRes.text();
        }
        console.error('Achievements API error response:', errorText);
        throw new Error(`Failed to fetch achievements: ${achievementsRes.status} ${achievementsRes.statusText} - ${errorText}`)
      }

      const [statsData, activityData, achievementsData] = await Promise.all([
        statsRes.json(),
        activityRes.json(),
        achievementsRes.json()
      ])

      console.log('API Data:', { statsData, activityData, achievementsData })

      if (statsData.success) setStats(statsData.data)
      if (activityData.success) setRecentActivity(activityData.data)
      if (achievementsData.success) setAchievements(achievementsData.data)
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
      // Set default values to prevent UI issues
      setStats({
        totalVisits: 0,
        storiesViewed: 0,
        favoritesCount: 0,
        achievementsCount: 0,
        totalTimeSpent: 0,
        averageRating: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return <MapPinIcon className="h-5 w-5" />
      case 'story': return <BookmarkIcon className="h-5 w-5" />
      case 'rating': return <StarIcon className="h-5 w-5" />
      case 'achievement': return <TrophyIcon className="h-5 w-5" />
      default: return <EyeIcon className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'visit': return 'text-blue-600 bg-blue-100'
      case 'story': return 'text-green-600 bg-green-100'
      case 'rating': return 'text-yellow-600 bg-yellow-100'
      case 'achievement': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              {(user as any)?.avatar ? (
                <img src={(user as any).avatar} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-8 w-8 text-orange-600" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {(user as any)?.firstName || 'User'}!
              </h1>
              <p className="text-gray-600">
                Continue your journey through India's cultural heritage
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">
                N/A
              </p>
              {user?.role === 'admin' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Places Visited</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookmarkIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stories Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.storiesViewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoritesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.achievementsCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity._id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
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
                        {activity.image && (
                          <img 
                            src={activity.image} 
                            alt="" 
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400">Start exploring to see your activity here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements & Quick Actions */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
              </div>
              <div className="p-6">
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement._id} className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <TrophyIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No achievements yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">Explore Monuments</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <BookmarkIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">Browse Stories</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <CameraIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">Take Virtual Tour</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <TrophyIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-900">Treasure Hunts</span>
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Stats</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Time Spent</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatTimeSpent(stats.totalTimeSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Avg Rating</span>
                  </div>
                  <span className="text-sm font-medium">
                    {stats.averageRating.toFixed(1)} ⭐
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard