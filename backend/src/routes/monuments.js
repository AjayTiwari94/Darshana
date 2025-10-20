const express = require('express')
const { body } = require('express-validator')
const {
  getMonuments,
  getMonument,
  searchMonuments,
  createMonument,
  updateMonument,
  deleteMonument,
  uploadMonumentImages,
  addARAsset,
  addVRExperience,
  rateMonument,
  getMonumentStats,
  viewMonument
} = require('../controllers/monuments')

const { protect, authorize, optionalAuth } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const monumentValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Monument name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required')
]

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters')
]

// Public routes
router.get('/', optionalAuth, getMonuments)
router.get('/search', optionalAuth, searchMonuments)
router.get('/:id', optionalAuth, getMonument)
router.post('/:id/view', optionalAuth, viewMonument) // Add view tracking endpoint
router.get('/:id/stats', getMonumentStats)

// Protected routes
router.post('/:id/rate', protect, ratingValidation, validateRequest, rateMonument)

// Admin routes
router.post('/', protect, authorize('admin'), monumentValidation, validateRequest, createMonument)
router.put('/:id', protect, authorize('admin'), monumentValidation, validateRequest, updateMonument)
router.delete('/:id', protect, authorize('admin'), deleteMonument)
router.post('/:id/images', protect, authorize('admin'), uploadMonumentImages)
router.post('/:id/ar-assets', protect, authorize('admin'), addARAsset)
router.post('/:id/vr-experiences', protect, authorize('admin'), addVRExperience)

module.exports = router