'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Heart, 
  Star, 
  Calendar, 
  Trophy, 
  Check, 
  X, 
  Filter,
  Settings,
  Eye,
  Trash2,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CreditCard
} from 'lucide-react'

interface AdminNotification {
  id: string
  type: 'user_registration' | 'content_submission' | 'system_alert' | 'user_report' | 'payment' | 'content_review'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  link?: string
}

const AdminNotifications: React.FC = () => {
  const { user, isAuthenticated, token } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login')
    }
  }, [isAuthenticated, user, router])

  // Mock admin notifications data
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: '1',
      type: 'user_registration',
      title: 'New user registered',
      message: 'A new user "Rajesh Kumar" has registered on the platform',
      timestamp: '2023-06-15T14:30:00Z',
      read: false,
      priority: 'low',
      category: 'Users'
    },
    {
      id: '2',
      type: 'content_submission',
      title: 'New story submitted',
      message: 'User "Priya Sharma" submitted a new story "The Temples of Khajuraho"',
      timestamp: '2023-06-15T13:15:00Z',
      read: false,
      priority: 'medium',
      category: 'Content',
      link: '/admin/content/review'
    },
    {
      id: '3',
      type: 'system_alert',
      title: 'High CPU usage detected',
      message: 'Server CPU usage has exceeded 85% for the past 10 minutes',
      timestamp: '2023-06-15T12:45:00Z',
      read: false,
      priority: 'high',
      category: 'System'
    },
    {
      id: '4',
      type: 'user_report',
      title: 'User reported inappropriate content',
      message: 'User "Amit Patel" reported inappropriate content in story "Ancient Warfare Tactics"',
      timestamp: '2023-06-15T11:20:00Z',
      read: true,
      priority: 'high',
      category: 'Reports',
      link: '/admin/reports'
    },
    {
      id: '5',
      type: 'payment',
      title: 'New subscription payment',
      message: 'User "Sunita Verma" upgraded to Premium subscription',
      timestamp: '2023-06-15T10:05:00Z',
      read: true,
      priority: 'low',
      category: 'Payments'
    },
    {
      id: '6',
      type: 'content_review',
      title: 'Content review required',
      message: '5 stories are pending review and require your attention',
      timestamp: '2023-06-15T09:30:00Z',
      read: true,
      priority: 'medium',
      category: 'Content',
      link: '/admin/content/review'
    },
    {
      id: '7',
      type: 'system_alert',
      title: 'Database backup completed',
      message: 'Daily database backup completed successfully',
      timestamp: '2023-06-15T02:00:00Z',
      read: true,
      priority: 'low',
      category: 'System'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(notifications.map(n => n.category)))]

  // Get unique priorities
  const priorities = ['all', 'low', 'medium', 'high', 'critical']

  const filteredNotifications = notifications.filter(notification => {
    // Apply read/unread filter
    if (filter === 'unread' && notification.read) return false
    if (filter === 'read' && !notification.read) return false
    
    // Apply category filter
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false
    
    // Apply priority filter
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false
    
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: false } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
    setSelectedNotifications([])
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
    setSelectedNotifications(selectedNotifications.filter(selectedId => selectedId !== id))
  }

  const deleteSelected = () => {
    setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)))
    setSelectedNotifications([])
  }

  const toggleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(selectedId => selectedId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-5 w-5 text-blue-500" />
      case 'content_submission': return <FileText className="h-5 w-5 text-green-500" />
      case 'system_alert': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'user_report': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'payment': return <CreditCard className="h-5 w-5 text-purple-500" />
      case 'content_review': return <FileText className="h-5 w-5 text-indigo-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-50 border-blue-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      case 'high': return 'bg-orange-50 border-orange-200'
      case 'critical': return 'bg-red-50 border-red-200'
      default: return 'bg-white border-gray-200'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    
    // Generate consistent color based on category name
    const index = Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Notifications</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                  : 'All caught up! No new notifications.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </button>
              <button
                onClick={() => router.push('/admin/settings#notifications')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === 'all' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === 'unread' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === 'read' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Read
                </button>
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedNotifications.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={deleteSelected}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete selected
                </button>
                <button
                  onClick={selectAll}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {selectedNotifications.length === filteredNotifications.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md ${
                  notification.read ? 'opacity-75' : 'border-l-4 border-l-primary-500'
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(notification.category)}`}>
                            {notification.category}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelectNotification(notification.id)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        
                        {notification.read ? (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Mark as unread"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.link && (
                      <div className="mt-3">
                        <button
                          onClick={() => router.push(notification.link!)}
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Take action →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications." 
                  : "You don't have any notifications matching your filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications