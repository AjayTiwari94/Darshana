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
  Clock
} from 'lucide-react'

interface Notification {
  id: string
  type: 'comment' | 'like' | 'follow' | 'achievement' | 'event' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  avatar?: string
  link?: string
}

const UserNotifications: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'comment',
      title: 'New comment on your story',
      message: 'Alex commented on your story "The Hidden Temples of South India"',
      timestamp: '2023-06-15T14:30:00Z',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      link: '/stories/hidden-temples'
    },
    {
      id: '2',
      type: 'like',
      title: 'Your story was liked',
      message: 'Sarah and 12 others liked your story',
      timestamp: '2023-06-15T10:15:00Z',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'New achievement unlocked!',
      message: 'Congratulations! You\'ve unlocked the "Cultural Explorer" badge',
      timestamp: '2023-06-14T16:45:00Z',
      read: true,
      link: '/achievements'
    },
    {
      id: '4',
      type: 'event',
      title: 'Upcoming virtual tour',
      message: 'The Virtual Tour of Hampi is starting in 2 hours',
      timestamp: '2023-06-14T09:30:00Z',
      read: true,
      link: '/virtual-visits/hampi'
    },
    {
      id: '5',
      type: 'follow',
      title: 'New follower',
      message: 'Michael started following you',
      timestamp: '2023-06-13T18:20:00Z',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '6',
      type: 'system',
      title: 'Platform update',
      message: 'We\'ve added new features to enhance your experience',
      timestamp: '2023-06-12T12:00:00Z',
      read: true,
      link: '/changelog'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
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
      case 'comment': return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'like': return <Heart className="h-5 w-5 text-red-500" />
      case 'follow': return <Star className="h-5 w-5 text-yellow-500" />
      case 'achievement': return <Trophy className="h-5 w-5 text-purple-500" />
      case 'event': return <Calendar className="h-5 w-5 text-green-500" />
      case 'system': return <Bell className="h-5 w-5 text-gray-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-50 border-blue-200'
      case 'like': return 'bg-red-50 border-red-200'
      case 'follow': return 'bg-yellow-50 border-yellow-200'
      case 'achievement': return 'bg-purple-50 border-purple-200'
      case 'event': return 'bg-green-50 border-green-200'
      case 'system': return 'bg-gray-50 border-gray-200'
      default: return 'bg-white border-gray-200'
    }
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
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
                onClick={() => router.push('/dashboard/settings#notifications')}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
            
            {selectedNotifications.length > 0 && (
              <div className="mt-3 sm:mt-0 flex space-x-2">
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
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
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
                          View details →
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

export default UserNotifications