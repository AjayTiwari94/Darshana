const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error = { message, statusCode: 401 }
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error = { message, statusCode: 401 }
  }

  // Payment errors
  if (err.type === 'StripeCardError') {
    const message = 'Payment failed. Please check your card details.'
    error = { message, statusCode: 400 }
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large'
    error = { message, statusCode: 400 }
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later'
    error = { message, statusCode: 429 }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  })
}

module.exports = errorHandler