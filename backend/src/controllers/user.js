const User = require('../models/User')
const Monument = require('../models/Monument')
const Story = require('../models/Story')

// @desc    Get total user count and statistics (Admin/Public)
// @route   GET /api/user/count
// @access  Public
const getUserCount = async (req, res) => {
  try {
    // Check if using database or mock data
    if (!global.useDatabase) {
      // Mock implementation - get from auth controller's mockUsers
      const { getMockUsers } = require('./auth')
      const mockUsers = getMockUsers()
      
      return res.status(200).json({
        success: true,
        message: 'User statistics (mock mode)',
        data: {
          totalUsers: mockUsers.length,
          newUsersToday: 0, // Mock data doesn't track dates precisely
          newUsersThisWeek: mockUsers.length,
          usersByRole: {
            user: mockUsers.filter(u => u.role === 'user' || !u.role).length,
            admin: mockUsers.filter(u => u.role === 'admin').length
          },
          registrationTrend: 'Mock data - no historical tracking'
        }
      })
    }

    // Database implementation
    const totalUsers = await User.countDocuments()
    
    // Users registered today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    })
    
    // Users registered this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    })
    
    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])
    
    const roleStats = usersByRole.reduce((acc, role) => {
      acc[role._id] = role.count
      return acc
    }, {})

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        usersByRole: roleStats,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Get user count error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    })
  }
}

// @desc    Get user dashboard statistics
// @route   GET /api/user/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id
    
    const user = await User.findById(userId)
      .populate('visitHistory.monument', 'name')
      .populate('rewards.relatedMonument', 'name')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Calculate statistics
    const stats = {
      totalVisits: user.visitHistory.length,
      storiesViewed: user.visitHistory.reduce((total, visit) => total + visit.storiesViewed.length, 0),
      favoritesCount: user.favorites?.length || 0,
      achievementsCount: user.rewards.length,
      totalTimeSpent: user.visitHistory.reduce((total, visit) => total + (visit.timeSpent || 0), 0),
      averageRating: user.visitHistory.length > 0 
        ? user.visitHistory
            .filter(visit => visit.rating)
            .reduce((sum, visit) => sum + visit.rating, 0) / 
          user.visitHistory.filter(visit => visit.rating).length || 0
        : 0
    }

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user recent activity
// @route   GET /api/user/activity
// @access  Private
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id
    const limit = parseInt(req.query.limit) || 10

    const user = await User.findById(userId)
      .populate('visitHistory.monument', 'name images')
      .populate('rewards.relatedMonument', 'name images')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Combine different activities
    const activities = []

    // Add visit activities
    user.visitHistory.slice(-5).forEach(visit => {
      activities.push({
        _id: `visit-${visit._id}`,
        type: 'visit',
        title: `Visited ${visit.monument.name}`,
        description: `Explored stories and spent ${visit.timeSpent || 0} minutes`,
        timestamp: visit.visitDate,
        image: visit.monument.images?.[0]
      })
    })

    // Add achievement activities
    user.rewards.slice(-3).forEach(reward => {
      activities.push({
        _id: `achievement-${reward._id}`,
        type: 'achievement',
        title: `Earned ${reward.type}`,
        description: reward.description,
        timestamp: reward.earnedAt,
        image: reward.relatedMonument?.images?.[0]
      })
    })

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)

    res.status(200).json({
      success: true,
      data: sortedActivities
    })
  } catch (error) {
    console.error('Get user activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user achievements
// @route   GET /api/user/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
      .populate('rewards.relatedMonument', 'name images')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Format achievements
    const achievements = user.rewards.map(reward => ({
      _id: reward._id,
      title: reward.type,
      description: reward.description,
      icon: getAchievementIcon(reward.type),
      unlockedAt: reward.earnedAt,
      category: getAchievementCategory(reward.type)
    }))

    res.status(200).json({
      success: true,
      data: achievements
    })
  } catch (error) {
    console.error('Get user achievements error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user visit history
// @route   GET /api/user/visits
// @access  Private
const getUserVisits = async (req, res) => {
  try {
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await User.findById(userId)
      .populate({
        path: 'visitHistory.monument',
        select: 'name location images category period'
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const totalVisits = user.visitHistory.length
    const visits = user.visitHistory
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
      .slice(skip, skip + limit)

    res.status(200).json({
      success: true,
      data: visits,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalVisits / limit),
        totalVisits,
        hasNext: skip + limit < totalVisits,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get user visits error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Add monument to favorites
// @route   POST /api/user/favorites/:monumentId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id
    const { monumentId } = req.params

    const monument = await Monument.findById(monumentId)
    if (!monument) {
      return res.status(404).json({
        success: false,
        message: 'Monument not found'
      })
    }

    const user = await User.findById(userId)
    
    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = []
    }

    // Check if already in favorites
    if (user.favorites.includes(monumentId)) {
      return res.status(400).json({
        success: false,
        message: 'Monument already in favorites'
      })
    }

    user.favorites.push(monumentId)
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Monument added to favorites'
    })
  } catch (error) {
    console.error('Add to favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Remove monument from favorites
// @route   DELETE /api/user/favorites/:monumentId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id
    const { monumentId } = req.params

    const user = await User.findById(userId)
    
    if (!user.favorites || !user.favorites.includes(monumentId)) {
      return res.status(400).json({
        success: false,
        message: 'Monument not in favorites'
      })
    }

    user.favorites = user.favorites.filter(id => id.toString() !== monumentId)
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Monument removed from favorites'
    })
  } catch (error) {
    console.error('Remove from favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user favorites
// @route   GET /api/user/favorites
// @access  Private
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
      .populate({
        path: 'favorites',
        select: 'name location images category period statistics',
        model: 'Monument'
      })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user.favorites || []
    })
  } catch (error) {
    console.error('Get user favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Helper functions
const getAchievementIcon = (type) => {
  const icons = {
    'First Visit': '🏛️',
    'Explorer': '🗺️',
    'Storyteller': '📚',
    'Culture Enthusiast': '🎭',
    'Heritage Guardian': '🛡️',
    'Time Traveler': '⏰',
    'Photo Enthusiast': '📸',
    'Rating Expert': '⭐',
    'Social Explorer': '👥',
    'Milestone Achievement': '🏆'
  }
  return icons[type] || '🏅'
}

const getAchievementCategory = (type) => {
  const categories = {
    'First Visit': 'exploration',
    'Explorer': 'exploration',
    'Storyteller': 'engagement',
    'Culture Enthusiast': 'engagement',
    'Heritage Guardian': 'contribution',
    'Time Traveler': 'exploration',
    'Photo Enthusiast': 'engagement',
    'Rating Expert': 'contribution',
    'Social Explorer': 'social',
    'Milestone Achievement': 'milestone'
  }
  return categories[type] || 'general'
}

module.exports = {
  getUserCount,
  getUserStats,
  getUserActivity,
  getUserAchievements,
  getUserVisits,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
}