const express = require('express')
const { body } = require('express-validator')
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
} = require('../controllers/auth')

const { protect } = require('../middleware/auth')
const { validateRequest } = require('../middleware/validation')

const router = express.Router()

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const profileUpdateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'bn', 'ta', 'te', 'mr'])
    .withMessage('Invalid language selection'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
]

const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
]

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
]

const resetPasswordValidation = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
]

// Public routes
router.post('/register', registerValidation, validateRequest, register)
router.post('/login', loginValidation, validateRequest, login)
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword)
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword)

// Protected routes
router.get('/me', protect, getMe)
router.put('/profile', protect, profileUpdateValidation, validateRequest, updateProfile)
router.put('/password', protect, passwordChangeValidation, validateRequest, changePassword)
router.post('/logout', protect, logout)

module.exports = router