const express = require('express')
const { body } = require('express-validator')
const {
  getStories,
  getStory,
  searchStories,
  getStoriesByMonument,
  getFeaturedStories,
  createStory,
  updateStory,
  deleteStory,
  likeStory,
  rateStory,
  bookmarkStory,
  getStoryAnalytics,
  uploadStoryMedia,
  viewStory
} = require('../controllers/stories')

const { protect, authorize, optionalAuth } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const storyValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  body('type')
    .isIn(['history', 'mythology', 'folklore', 'horror', 'belief', 'legend', 'mystery', 'romance', 'adventure', 'spiritual'])
    .withMessage('Invalid story type'),
  body('monument')
    .isMongoId()
    .withMessage('Valid monument ID is required')
]

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
]

// Public routes
router.get('/', optionalAuth, getStories)
router.get('/search', optionalAuth, searchStories)
router.get('/featured', getFeaturedStories)
router.get('/monument/:monumentId', optionalAuth, getStoriesByMonument)
router.get('/:id', optionalAuth, getStory)

// View tracking endpoint
router.post('/:id/view', optionalAuth, viewStory)

// Protected routes
router.post('/', protect, storyValidation, validateRequest, createStory)
router.put('/:id', protect, updateStory)
router.delete('/:id', protect, deleteStory)
router.post('/:id/like', protect, likeStory)
router.post('/:id/rate', protect, ratingValidation, validateRequest, rateStory)
router.post('/:id/bookmark', protect, bookmarkStory)
router.post('/:id/media', protect, uploadStoryMedia)
router.get('/:id/analytics', protect, getStoryAnalytics)

module.exports = router