const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(protect)

// Placeholder routes - will be implemented later
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User profile endpoint',
    data: req.user
  })
})

router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Update user profile endpoint',
    data: req.user
  })
})

router.get('/visits', (req, res) => {
  res.json({
    success: true,
    message: 'User visit history endpoint',
    data: req.user.visitHistory || []
  })
})

router.get('/rewards', (req, res) => {
  res.json({
    success: true,
    message: 'User rewards endpoint',
    data: req.user.rewards || []
  })
})

module.exports = router