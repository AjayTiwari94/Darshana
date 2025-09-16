const { validationResult } = require('express-validator')
const logger = require('../utils/logger')

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array())
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    })
  }
  
  next()
}

const sanitizeInput = (req, res, next) => {
  // Basic HTML sanitization for text fields
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>?/gm, '')
      .trim()
  }

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key])
      } else if (typeof obj[key] === 'object') {
        obj[key] = sanitizeObject(obj[key])
      }
    }
    return obj
  }

  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  
  next()
}

module.exports = {
  validateRequest,
  sanitizeInput
}