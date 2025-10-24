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
  const { user, isAuthenticated, isLoading } = useAuthStore()
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
    console.log('Authentication check - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/auth/login?redirect=/dashboard')
      return
    }
  }, [isAuthenticated, isLoading, router])

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
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/auth/login?redirect=/dashboard')
        return
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
        let errorText = `${statsRes.status} ${statsRes.statusText}`;
        try {
          const errorData = await statsRes.json();
          errorText = errorData.message || errorText;
        } catch (e) {
          // If JSON parsing fails, just use the status text
          console.warn('Could not parse error response as JSON');
        }
        console.error('Stats API error response:', errorText);
        throw new Error(`Failed to fetch stats: ${errorText}`)
      }
      if (!activityRes.ok) {
        let errorText = `${activityRes.status} ${activityRes.statusText}`;
        try {
          const errorData = await activityRes.json();
          errorText = errorData.message || errorText;
        } catch (e) {
          console.warn('Could not parse error response as JSON');
        }
        console.error('Activity API error response:', errorText);
        throw new Error(`Failed to fetch activity: ${errorText}`)
      }
      if (!achievementsRes.ok) {
        let errorText = `${achievementsRes.status} ${achievementsRes.statusText}`;
        try {
          const errorData = await achievementsRes.json();
          errorText = errorData.message || errorText;
        } catch (e) {
          console.warn('Could not parse error response as JSON');
        }
        console.error('Achievements API error response:', errorText);
        throw new Error(`Failed to fetch achievements: ${errorText}`)
      }

      const [statsData, activityData, achievementsData] = await Promise.all([
        statsRes.json(),
        activityRes.json(),
        achievementsRes.json()
      ])

      console.log('API Data:', { statsData, activityData, achievementsData })

      if (statsData.success) {
        setStats(statsData.data)
      } else {
        // Use mock data if API returns no data
        setStats({
          totalVisits: 5,
          storiesViewed: 12,
          favoritesCount: 3,
          achievementsCount: 2,
          totalTimeSpent: 45,
          averageRating: 4.5
        })
      }
      
      if (activityData.success && activityData.data) {
        setRecentActivity(activityData.data)
      }
      
      if (achievementsData.success && achievementsData.data) {
        setAchievements(achievementsData.data)
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
      console.log('Using mock data for dashboard')
      
      // Use mock data when API fails
      setStats({
        totalVisits: 5,
        storiesViewed: 12,
        favoritesCount: 3,
        achievementsCount: 2,
        totalTimeSpent: 45,
        averageRating: 4.5
      })
      
      setRecentActivity([
        {
          _id: '1',
          type: 'visit',
          title: 'Visited Taj Mahal',
          description: 'Explored the iconic monument',
          timestamp: new Date().toISOString()
        },
        {
          _id: '2',
          type: 'story',
          title: 'Read about Rajasthan',
          description: 'Cultural heritage of Rajasthan',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ])
      
      setAchievements([
        {
          _id: '1',
          title: 'First Visit',
          description: 'Visited your first monument',
          icon: '🏛️',
          unlockedAt: new Date().toISOString(),
          category: 'exploration'
        }
      ])
      
      // Clear error after setting mock data
      setError('')
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

  // Show loading state while auth is initializing or data is loading
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Show error notification at the top if there's an error, but still show the dashboard
  const errorNotification = error ? (
    <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {error}. Showing demo data.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={fetchDashboardData}
            className="text-sm text-yellow-700 hover:text-yellow-600 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  ) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {errorNotification}
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