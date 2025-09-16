const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user'
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi', 'bn', 'ta', 'te', 'mr'],
      default: 'en'
    },
    contentTypes: [{
      type: String,
      enum: ['article', 'video', 'audio', 'comic', 'interactive']
    }],
    interests: [String],
    accessibility: {
      audioNarration: {
        type: Boolean,
        default: false
      },
      highContrast: {
        type: Boolean,
        default: false
      },
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
      },
      subtitles: {
        type: Boolean,
        default: false
      }
    }
  },
  profile: {
    bio: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    socialLinks: {
      type: Object,
      default: {}
    }
  },
  visitHistory: [{
    monumentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Monument'
    },
    visitDate: {
      type: Date,
      default: Date.now
    },
    storiesViewed: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Story'
    }],
    treasureHuntsCompleted: [{
      type: mongoose.Schema.ObjectId,
      ref: 'TreasureHunt'
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }],
  rewards: [{
    type: {
      type: String,
      enum: ['badge', 'discount', 'collectible', 'points'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    value: {
      type: Number,
      default: 0
    },
    iconUrl: String,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  socialProfiles: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpire: Date,
  lastLoginAt: Date,
  lastActivityAt: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for total points
UserSchema.virtual('totalPoints').get(function() {
  return this.rewards
    .filter(reward => reward.type === 'points')
    .reduce((total, reward) => total + reward.value, 0)
})

// Virtual for badges count
UserSchema.virtual('badgeCount').get(function() {
  return this.rewards.filter(reward => reward.type === 'badge').length
})

// Virtual for visit count
UserSchema.virtual('visitCount').get(function() {
  return this.visitHistory.length
})

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = require('crypto').randomBytes(20).toString('hex')
  
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Add reward to user
UserSchema.methods.addReward = function(rewardData) {
  this.rewards.push({
    ...rewardData,
    earnedAt: new Date()
  })
  return this.save()
}

// Check if user has specific reward
UserSchema.methods.hasReward = function(rewardName) {
  return this.rewards.some(reward => reward.name === rewardName)
}

// Update visit history
UserSchema.methods.addVisit = function(visitData) {
  // Check if monument already visited today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const existingVisit = this.visitHistory.find(visit => 
    visit.monumentId.toString() === visitData.monumentId.toString() &&
    visit.visitDate >= today
  )

  if (existingVisit) {
    // Update existing visit
    if (visitData.storiesViewed) {
      existingVisit.storiesViewed = [...new Set([...existingVisit.storiesViewed, ...visitData.storiesViewed])]
    }
    if (visitData.treasureHuntsCompleted) {
      existingVisit.treasureHuntsCompleted = [...new Set([...existingVisit.treasureHuntsCompleted, ...visitData.treasureHuntsCompleted])]
    }
    if (visitData.rating) existingVisit.rating = visitData.rating
    if (visitData.review) existingVisit.review = visitData.review
  } else {
    // Add new visit
    this.visitHistory.push(visitData)
  }

  return this.save()
}

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ 'preferences.interests': 1 })
UserSchema.index({ 'visitHistory.monumentId': 1 })
UserSchema.index({ createdAt: -1 })

module.exports = mongoose.model('User', UserSchema)