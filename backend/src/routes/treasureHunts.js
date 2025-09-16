const express = require('express')
const {
  getTreasureHunts,
  getTreasureHunt,
  createTreasureHunt,
  updateTreasureHunt,
  deleteTreasureHunt,
  registerForHunt,
  startHunt,
  submitClue,
  getHuntProgress,
  getLeaderboard
} = require('../controllers/treasureHunts')

const { protect, authorize, optionalAuth } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')
const { body } = require('express-validator')

const router = express.Router()

// Validation rules
const huntValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('theme')
    .isIn(['Historical Mystery', 'Cultural Explorer', 'Architectural Wonder', 'Mythological Journey', 'Archaeological Discovery'])
    .withMessage('Invalid theme'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid difficulty level')
]

// Public routes
router.get('/', optionalAuth, getTreasureHunts)
router.get('/:id', optionalAuth, getTreasureHunt)
router.get('/:id/leaderboard', getLeaderboard)

// Protected routes
router.post('/:id/register', protect, registerForHunt)
router.post('/:id/start', protect, startHunt)
router.post('/:id/submit-clue', protect, submitClue)
router.get('/:id/progress', protect, getHuntProgress)

// Admin routes
router.post('/', protect, authorize('admin'), huntValidation, validateRequest, createTreasureHunt)
router.put('/:id', protect, authorize('admin'), huntValidation, validateRequest, updateTreasureHunt)
router.delete('/:id', protect, authorize('admin'), deleteTreasureHunt)

module.exports = router