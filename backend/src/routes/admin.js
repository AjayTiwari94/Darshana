const express = require('express')
const { body } = require('express-validator')
const {
  getAdminStats,
  getAdminActivity,
  getPendingContent,
  getSystemHealth,
  updateContentStatus
} = require('../controllers/admin')

const { protect, authorize } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// All admin routes require authentication and admin role
router.use(protect)
router.use(authorize('admin'))

// Validation rules
const contentStatusValidation = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),
  body('type')
    .isIn(['story', 'monument'])
    .withMessage('Type must be story or monument')
]

// Admin dashboard routes
router.get('/stats', getAdminStats)
router.get('/activity', getAdminActivity)
router.get('/pending-content', getPendingContent)
router.get('/system-health', getSystemHealth)

// Content management routes
router.put('/content/:id/status', contentStatusValidation, validateRequest, updateContentStatus)

module.exports = router