const User = require('../models/User')
const Monument = require('../models/Monument')
const Story = require('../models/Story')
const TreasureHunt = require('../models/TreasureHunt')

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Get total counts from database
    const [totalUsers, totalStories, totalMonuments, totalTreasureHunts] = await Promise.all([
      User.countDocuments(),
      Story.countDocuments(),
      Monument.countDocuments(),
      TreasureHunt.countDocuments()
    ])

    // Get pending content count (stories without verification)
    const pendingStories = await Story.countDocuments({ 
      verificationStatus: { $in: ['pending', null] } 
    })

    // Get recent user registrations for growth calculation
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    })

    const previousMonth = new Date()
    previousMonth.setMonth(previousMonth.getMonth() - 2)
    
    const newUsersPreviousMonth = await User.countDocuments({
      createdAt: { $gte: previousMonth, $lt: lastMonth }
    })

    // Calculate monthly growth percentage
    const monthlyGrowth = newUsersPreviousMonth > 0 
      ? ((newUsersThisMonth - newUsersPreviousMonth) / newUsersPreviousMonth * 100)
      : 100

    // Get active users (logged in within last 7 days)
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: lastWeek }
    })

    const stats = {
      totalUsers,
      totalStories,
      totalMonuments,
      pendingReviews: pendingStories,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10, // Round to 1 decimal
      activeUsers,
      totalTreasureHunts
    }

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get admin recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
const getAdminActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10

    // Get recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt')

    // Get recent story submissions
    const recentStories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'firstName lastName')
      .populate('monument', 'name')
      .select('title author monument createdAt verificationStatus')

    // Get recent monument ratings
    const recentRatings = await User.find({ 'visitHistory.rating': { $exists: true } })
      .sort({ 'visitHistory.visitDate': -1 })
      .limit(3)
      .populate('visitHistory.monumentId', 'name')
      .select('firstName lastName visitHistory')

    // Combine activities
    const activities = []

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        _id: `user-${user._id}`,
        type: 'user_registration',
        title: 'New User Registration',
        description: `${user.firstName} ${user.lastName} joined the platform`,
        timestamp: user.createdAt,
        status: 'success'
      })
    })

    // Add story submissions
    recentStories.forEach(story => {
      activities.push({
        _id: `story-${story._id}`,
        type: 'story_submission',
        title: 'Story Submitted for Review',
        description: `"${story.title}" submitted by ${story.author.firstName} ${story.author.lastName}`,
        timestamp: story.createdAt,
        status: story.verificationStatus === 'pending' ? 'warning' : 'info'
      })
    })

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    const limitedActivities = activities.slice(0, limit)

    res.status(200).json({
      success: true,
      data: limitedActivities
    })
  } catch (error) {
    console.error('Get admin activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get pending content for review
// @route   GET /api/admin/pending-content
// @access  Private/Admin
const getPendingContent = async (req, res) => {
  try {
    // Get pending stories
    const pendingStories = await Story.find({ 
      verificationStatus: { $in: ['pending', null] } 
    })
      .populate('author', 'firstName lastName')
      .populate('monument', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title author monument createdAt verificationStatus')

    // Get recently submitted monuments (if you have a review system)
    const recentMonuments = await Monument.find({ 
      status: 'inactive' // Assuming inactive means pending review
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt status')

    const content = []

    // Add pending stories
    pendingStories.forEach(story => {
      content.push({
        _id: story._id,
        type: 'story',
        title: story.title,
        author: `${story.author.firstName} ${story.author.lastName}`,
        submittedAt: story.createdAt,
        status: story.verificationStatus || 'pending',
        monumentName: story.monument?.name
      })
    })

    // Add pending monuments
    recentMonuments.forEach(monument => {
      content.push({
        _id: monument._id,
        type: 'monument',
        title: monument.name,
        author: 'System',
        submittedAt: monument.createdAt,
        status: 'pending'
      })
    })

    // Sort by submission date
    content.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

    res.status(200).json({
      success: true,
      data: content
    })
  } catch (error) {
    console.error('Get pending content error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get system health status
// @route   GET /api/admin/system-health
// @access  Private/Admin
const getSystemHealth = async (req, res) => {
  try {
    const mongoose = require('mongoose')
    
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    // Get server uptime
    const uptime = process.uptime()
    
    // Get memory usage
    const memoryUsage = process.memoryUsage()
    
    // Get active users in last hour
    const lastHour = new Date()
    lastHour.setHours(lastHour.getHours() - 1)
    
    const activeUsersLastHour = await User.countDocuments({
      lastActivityAt: { $gte: lastHour }
    })

    const health = {
      server: {
        status: 'online',
        uptime: Math.floor(uptime),
        memoryUsage: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) // MB
        }
      },
      database: {
        status: dbStatus,
        collections: {
          users: await User.countDocuments(),
          monuments: await Monument.countDocuments(),
          stories: await Story.countDocuments()
        }
      },
      users: {
        activeLastHour: activeUsersLastHour,
        totalRegistered: await User.countDocuments()
      }
    }

    res.status(200).json({
      success: true,
      data: health
    })
  } catch (error) {
    console.error('Get system health error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update content status (approve/reject)
// @route   PUT /api/admin/content/:id/status
// @access  Private/Admin
const updateContentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, type } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected'
      })
    }

    let updatedContent
    
    if (type === 'story') {
      updatedContent = await Story.findByIdAndUpdate(
        id,
        { verificationStatus: status === 'approved' ? 'verified' : 'rejected' },
        { new: true }
      ).populate('author', 'firstName lastName')
    } else if (type === 'monument') {
      updatedContent = await Monument.findByIdAndUpdate(
        id,
        { status: status === 'approved' ? 'active' : 'inactive' },
        { new: true }
      )
    }

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      })
    }

    res.status(200).json({
      success: true,
      message: `Content ${status} successfully`,
      data: updatedContent
    })
  } catch (error) {
    console.error('Update content status error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  getAdminStats,
  getAdminActivity,
  getPendingContent,
  getSystemHealth,
  updateContentStatus
}