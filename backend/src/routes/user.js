const express = require('express')
const {
  getUserCount,
  getUserStats,
  getUserActivity,
  getUserAchievements,
  getUserVisits,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} = require('../controllers/user')

const { protect } = require('../middleware/auth')

const router = express.Router()

// Public route (no authentication required)
router.get('/count', getUserCount)

// All other routes are protected (require authentication)
router.use(protect)

// User statistics and data
router.get('/stats', getUserStats)
router.get('/activity', getUserActivity)
router.get('/achievements', getUserAchievements)
router.get('/visits', getUserVisits)

// Favorites management
router.get('/favorites', getUserFavorites)
router.post('/favorites/:monumentId', addToFavorites)
router.delete('/favorites/:monumentId', removeFromFavorites)

module.exports = router