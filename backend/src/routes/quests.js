const express = require('express')
const { body } = require('express-validator')
const {
  getQuests,
  getQuest,
  startQuest,
  updateQuestProgress,
  getQuestProgress,
  getUserQuests,
  createQuest,
  updateQuest,
  deleteQuest
} = require('../controllers/quests')

const { protect, authorize, optionalAuth } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const questValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('type')
    .isIn(['location', 'knowledge', 'photo', 'social', 'exploration', 'story'])
    .withMessage('Invalid quest type'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard', 'Expert'])
    .withMessage('Invalid difficulty level'),
  body('category')
    .isIn(['Historical', 'Cultural', 'Archaeological', 'Architectural', 'Mythological'])
    .withMessage('Invalid category')
]

const progressValidation = [
  body('objectiveId')
    .notEmpty()
    .withMessage('Objective ID is required'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
]

// Public routes
router.get('/', optionalAuth, getQuests)
router.get('/:id', optionalAuth, getQuest)

// Protected routes
router.post('/:id/start', protect, startQuest)
router.put('/:id/progress', protect, progressValidation, validateRequest, updateQuestProgress)
router.get('/:id/progress', protect, getQuestProgress)

// User quest routes
router.get('/user/quests', protect, getUserQuests)

// Admin routes
router.post('/', protect, authorize('admin'), questValidation, validateRequest, createQuest)
router.put('/:id', protect, authorize('admin'), questValidation, validateRequest, updateQuest)
router.delete('/:id', protect, authorize('admin'), deleteQuest)

module.exports = router