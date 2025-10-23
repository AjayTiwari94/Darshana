const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

// Mock data for development without database
let mockUsers = []

// Function to get mock users (for other controllers)
const getMockUsers = () => mockUsers

// Generate mock JWT token (compatible with auth middleware)
const generateMockToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  )
}

// Initialize mock users with default data
const initializeMockUsers = () => {
  if (mockUsers.length === 0) {
    // Add default admin user
    const adminUser = {
      _id: '1',
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@darshana.com',
      password: '$2a$12$nn58e8TLzYCa/WOo4jaDlupDc5MWA8muUpoB5qsMTTnCjcpzNBY8C', // "Admin123"
      role: 'admin',
      preferences: {
        language: 'en',
        contentTypes: [],
        interests: []
      },
      profile: {
        bio: 'Platform Administrator',
        location: 'India'
      },
      createdAt: new Date()
    }
    
    // Add default regular user
    const regularUser = {
      _id: '2',
      name: 'Ajay Tiwari',
      firstName: 'Ajay',
      lastName: 'Tiwari',
      email: 'explorer@example.com',
      password: '$2a$12$nn58e8TLzYCa/WOo4jaDlupDc5MWA8muUpoB5qsMTTnCjcpzNBY8C', // "Admin123"
      role: 'user',
      preferences: {
        language: 'en',
        contentTypes: ['article', 'video'],
        interests: ['History', 'Architecture', 'Mythology']
      },
      profile: {
        bio: 'Passionate about Indian heritage and culture',
        location: 'Mumbai, India'
      },
      createdAt: new Date()
    }
    
    mockUsers.push(adminUser, regularUser)
    console.log('Mock users initialized with default data')
  }
}

// Initialize mock users on startup
initializeMockUsers()

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
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for register')
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
        name: `${firstName} ${lastName}`,
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
        profile: {
          bio: '',
          location: ''
        },
        createdAt: new Date()
      }
      
      mockUsers.push(mockUser)
      
      const userResponse = {
        _id: mockUser._id,
        name: mockUser.name,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        role: mockUser.role,
        preferences: mockUser.preferences,
        profile: mockUser.profile,
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
    console.log('Using database implementation for register')
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
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for login')
      console.log('Login attempt with email:', email)
      const user = mockUsers.find(u => u.email === email.toLowerCase())
      console.log('User found:', user)
      if (!user) {
        console.log('User not found in mock users')
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      console.log('Comparing password for user:', user.email)
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      console.log('Password match result:', isPasswordMatch)
      if (!isPasswordMatch) {
        console.log('Password does not match for user')
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      const userResponse = {
        _id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        profile: user.profile,
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
    console.log('Using database implementation for login')
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
    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for getMe')
      const mockUser = mockUsers.find(u => u._id === req.user.id)
      if (!mockUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }
      
      // Return the mock user data
      return res.status(200).json({
        success: true,
        data: mockUser
      })
    }

    // Database implementation
    console.log('Using database implementation for getMe')
    // Try to populate visitHistory and rewards, but handle errors gracefully
    let user;
    try {
      user = await User.findById(req.user.id)
        .populate('visitHistory.monumentId', 'name location')
        .populate('rewards.relatedMonument', 'name');
    } catch (populateError) {
      console.warn('Population failed, fetching user without populate:', populateError.message);
      // If population fails, fetch user without populate
      user = await User.findById(req.user.id);
    }

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

    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for updateProfile')
      const mockUser = mockUsers.find(u => u._id === req.user.id)
      if (!mockUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }
      
      // Update allowed fields
      const allowedUpdates = ['firstName', 'lastName', 'preferences', 'profile']
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          mockUser[key] = req.body[key]
        }
      })
      
      // Update name field
      mockUser.name = `${mockUser.firstName} ${mockUser.lastName}`
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully (mock mode)',
        data: mockUser
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

    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for changePassword')
      const mockUser = mockUsers.find(u => u._id === req.user.id)
      if (!mockUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }
      
      // Check current password
      const isPasswordMatch = await bcrypt.compare(req.body.currentPassword, mockUser.password)
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }
      
      // Update password
      mockUser.password = await bcrypt.hash(req.body.newPassword, 12)
      
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully (mock mode)'
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
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const { email } = req.body

    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for forgotPassword')
      const mockUser = mockUsers.find(u => u.email === email.toLowerCase())
      if (!mockUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found with that email'
        })
      }
      
      // In mock mode, just return a success message
      return res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to your email (mock mode)',
        data: 'http://localhost:5000/api/auth/resetpassword/mock-token' // Mock reset URL
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with that email'
      })
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`

    // Message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
      // TODO: Implement email sending
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password reset token',
      //   message
      // })

      res.status(200).json({
        success: true,
        message: 'Email sent',
        data: resetUrl // For development only
      })
    } catch (error) {
      console.error('Email error:', error)
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation
      console.log('Using mock implementation for resetPassword')
      return res.status(200).json({
        success: true,
        message: 'Password reset successfully (mock mode)'
      })
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      })
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Check if using database or mock data
    console.log('Global useDatabase value:', global.useDatabase)
    if (!global.useDatabase) {
      // Mock implementation - nothing to do
      console.log('Using mock implementation for logout')
      return res.status(200).json({
        success: true,
        message: 'Logout successful (mock mode)'
      })
    }

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