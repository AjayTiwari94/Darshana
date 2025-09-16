const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const User = require('../models/User')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')

    req.user = await User.findById(decoded.userId)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this token'
      })
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }
})

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      })
    }
    next()
  }
}

// Optional auth - adds user to req if token is valid, but doesn't require it
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token

  // Check if headers exist and authorization header exists
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
      const user = await User.findById(decoded.userId)
      if (user && user.isActive) {
        req.user = user
      } else {
        req.user = null
      }
    } catch (err) {
      // Token is invalid, but we continue without setting req.user
      req.user = null
    }
  } else {
    req.user = null
  }

  next()
})