const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

// Mock data for development without database
let mockUsers = []

// Function to get mock users (for other controllers)
const getMockUsers = () => mockUsers

// Generate mock JWT token
const generateMockToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  )
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const { firstName, lastName, email, password, preferences } = req.body

    // Check if using database or mock data
    if (!global.useDatabase) {
      // Mock implementation
      const existingUser = mockUsers.find(u => u.email === email.toLowerCase())
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const mockUser = {
        _id: Date.now().toString(),
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        preferences: {
          language: preferences?.language || 'en',
          contentTypes: [],
          interests: preferences?.interests || []
        },
        createdAt: new Date()
      }
      
      mockUsers.push(mockUser)
      
      const userResponse = {
        _id: mockUser._id,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        role: mockUser.role,
        preferences: mockUser.preferences,
        createdAt: mockUser.createdAt
      }
      
      const token = generateMockToken(mockUser)
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (mock mode)',
        data: userResponse,
        token
      })
    }

    // Database implementation
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      preferences: {
        language: preferences?.language || 'en',
        contentTypes: [],
        interests: preferences?.interests || [],
        accessibility: {
          audioNarration: false,
          highContrast: false,
          fontSize: 'medium',
          subtitles: false
        }
      },
      profile: {
        bio: '',
        location: '',
        website: '',
        socialLinks: {}
      }
    })

    const token = user.getSignedJwtToken()
    const userResponse = {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      profile: user.profile,
      createdAt: user.createdAt
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check if using database or mock data
    if (!global.useDatabase) {
      // Mock implementation
      const user = mockUsers.find(u => u.email === email.toLowerCase())
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      const userResponse = {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
      
      const token = generateMockToken(user)
      
      return res.status(200).json({
        success: true,
        message: 'Login successful (mock mode)',
        data: userResponse,
        token
      })
    }

    // Database implementation
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const isPasswordMatch = await user.matchPassword(password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = user.getSignedJwtToken()
    const userResponse = {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      profile: user.profile,
      visitHistory: user.visitHistory,
      rewards: user.rewards,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userResponse,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('visitHistory.monument', 'name location')
      .populate('rewards.relatedMonument', 'name')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'preferences', 'profile'
    ]
    
    const updates = {}
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    })
  }
}

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user.id).select('+password')
    
    // Check current password
    const isPasswordMatch = await user.matchPassword(currentPassword)
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password (let User model handle hashing)
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      })
    }

    // Generate reset token (simplified for demo)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // In production, send email with reset link
    // For demo, just return the token
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken // Remove this in production
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Update password (let User model handle hashing)
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Invalid or expired reset token'
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const userId = req.user.id
    
    // Update user's last activity and login status
    await User.findByIdAndUpdate(userId, {
      lastActivityAt: new Date(),
      // You could add a field to track active sessions if needed
      // activeTokens: [] // Clear active tokens for enhanced security
    })

    // Log the logout action
    console.log(`User ${userId} logged out at ${new Date().toISOString()}`)

    res.status(200).json({
      success: true,
      message: 'Logout successful. Please clear your local session data.'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    })
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  getMockUsers
}