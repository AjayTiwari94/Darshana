const mongoose = require('mongoose')

const TreasureHuntSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Treasure hunt title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  theme: {
    type: String,
    enum: ['Historical Mystery', 'Cultural Explorer', 'Architectural Wonder', 'Mythological Journey', 'Archaeological Discovery'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  locations: [{
    monument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monument',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    clues: [{
      type: {
        type: String,
        enum: ['riddle', 'photo', 'question', 'location', 'story'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      hint: String,
      answer: String,
      points: {
        type: Number,
        default: 20
      },
      timeLimit: Number // in minutes
    }],
    checkpoints: [{
      name: String,
      description: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      radius: {
        type: Number,
        default: 100 // meters
      },
      requiredAction: {
        type: String,
        enum: ['visit', 'photo', 'answer', 'scan_qr'],
        default: 'visit'
      }
    }]
  }],
  rewards: {
    points: {
      type: Number,
      required: true
    },
    badges: [String],
    certificates: [String],
    unlocks: [String],
    prizes: [{
      name: String,
      description: String,
      image: String,
      value: Number,
      quantity: Number
    }]
  },
  rules: [{
    type: String,
    description: String
  }],
  prerequisites: {
    level: {
      type: Number,
      default: 1
    },
    completedHunts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TreasureHunt'
    }],
    requiredBadges: [String]
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurrencePattern: String // 'daily', 'weekly', 'monthly'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    teamName: String,
    status: {
      type: String,
      enum: ['registered', 'started', 'in_progress', 'completed', 'disqualified'],
      default: 'registered'
    },
    progress: {
      currentLocation: {
        type: Number,
        default: 0
      },
      completedClues: [String],
      visitedCheckpoints: [String],
      totalPoints: {
        type: Number,
        default: 0
      },
      penalties: {
        type: Number,
        default: 0
      },
      hints_used: {
        type: Number,
        default: 0
      }
    },
    startTime: Date,
    endTime: Date,
    completionTime: Number, // in minutes
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    completedParticipants: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    popularClues: [{
      clueId: String,
      attempts: Number,
      successRate: Number
    }]
  },
  leaderboard: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rank: Number,
    score: Number,
    completionTime: Number,
    achievements: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
TreasureHuntSchema.index({ theme: 1, difficulty: 1 })
TreasureHuntSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 })
TreasureHuntSchema.index({ isActive: 1, isPublic: 1 })
TreasureHuntSchema.index({ 'participants.user': 1 })

// Virtual for completion rate
TreasureHuntSchema.virtual('completionRate').get(function() {
  if (this.statistics.totalParticipants === 0) return 0
  return (this.statistics.completedParticipants / this.statistics.totalParticipants) * 100
})

// Virtual for active status
TreasureHuntSchema.virtual('status').get(function() {
  const now = new Date()
  if (now < this.schedule.startDate) return 'upcoming'
  if (now > this.schedule.endDate) return 'ended'
  return 'active'
})

// Virtual for available spots
TreasureHuntSchema.virtual('availableSpots').get(function() {
  if (!this.maxParticipants) return null
  return this.maxParticipants - this.statistics.totalParticipants
})

// Methods
TreasureHuntSchema.methods.registerParticipant = function(userId, teamName = null) {
  // Check if hunt is accepting registrations
  if (this.status === 'ended') {
    throw new Error('Treasure hunt has ended')
  }

  if (this.maxParticipants && this.statistics.totalParticipants >= this.maxParticipants) {
    throw new Error('Treasure hunt is full')
  }

  // Check if user already registered
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString())
  if (existingParticipant) {
    throw new Error('User already registered for this treasure hunt')
  }

  // Add participant
  this.participants.push({
    user: userId,
    teamName,
    status: 'registered',
    progress: {
      currentLocation: 0,
      completedClues: [],
      visitedCheckpoints: [],
      totalPoints: 0,
      penalties: 0,
      hints_used: 0
    }
  })

  this.statistics.totalParticipants += 1
  return this.save()
}

TreasureHuntSchema.methods.startHunt = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString())
  if (!participant) {
    throw new Error('User not registered for this treasure hunt')
  }

  if (participant.status !== 'registered') {
    throw new Error('Treasure hunt already started or completed')
  }

  participant.status = 'started'
  participant.startTime = new Date()
  participant.progress.currentLocation = 1

  return this.save()
}

TreasureHuntSchema.methods.completeClue = function(userId, locationIndex, clueIndex, answer = null) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString())
  if (!participant) {
    throw new Error('User not participating in this treasure hunt')
  }

  const location = this.locations[locationIndex]
  if (!location) {
    throw new Error('Invalid location')
  }

  const clue = location.clues[clueIndex]
  if (!clue) {
    throw new Error('Invalid clue')
  }

  const clueId = `${locationIndex}-${clueIndex}`
  
  // Check if clue already completed
  if (participant.progress.completedClues.includes(clueId)) {
    throw new Error('Clue already completed')
  }

  // Validate answer if required
  if (clue.answer && answer && clue.answer.toLowerCase() !== answer.toLowerCase()) {
    throw new Error('Incorrect answer')
  }

  // Mark clue as completed
  participant.progress.completedClues.push(clueId)
  participant.progress.totalPoints += clue.points
  participant.status = 'in_progress'

  // Check if all clues for this location are completed
  const locationClueIds = location.clues.map((_, idx) => `${locationIndex}-${idx}`)
  const completedLocationClues = participant.progress.completedClues.filter(id => 
    locationClueIds.includes(id)
  )

  if (completedLocationClues.length === location.clues.length) {
    // Move to next location
    if (locationIndex + 1 < this.locations.length) {
      participant.progress.currentLocation = locationIndex + 2
    } else {
      // Hunt completed
      participant.status = 'completed'
      participant.endTime = new Date()
      participant.completionTime = Math.floor((participant.endTime - participant.startTime) / (1000 * 60))
      this.statistics.completedParticipants += 1
      this.updateLeaderboard(participant)
    }
  }

  return this.save()
}

TreasureHuntSchema.methods.useHint = function(userId, locationIndex, clueIndex) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString())
  if (!participant) {
    throw new Error('User not participating in this treasure hunt')
  }

  const location = this.locations[locationIndex]
  const clue = location.clues[clueIndex]
  
  if (!clue.hint) {
    throw new Error('No hint available for this clue')
  }

  // Deduct points for hint
  const hintCost = 5
  participant.progress.totalPoints = Math.max(0, participant.progress.totalPoints - hintCost)
  participant.progress.hints_used += 1

  return {
    hint: clue.hint,
    pointsDeducted: hintCost
  }
}

TreasureHuntSchema.methods.updateLeaderboard = function(participant) {
  // Remove existing entry if any
  this.leaderboard = this.leaderboard.filter(entry => 
    entry.user.toString() !== participant.user.toString()
  )

  // Add new entry
  this.leaderboard.push({
    user: participant.user,
    score: participant.progress.totalPoints,
    completionTime: participant.completionTime,
    achievements: this.calculateAchievements(participant)
  })

  // Sort by score (descending) and completion time (ascending)
  this.leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      return a.completionTime - b.completionTime
    }
    return b.score - a.score
  })

  // Update ranks
  this.leaderboard.forEach((entry, index) => {
    entry.rank = index + 1
  })

  // Keep only top 50
  this.leaderboard = this.leaderboard.slice(0, 50)
}

TreasureHuntSchema.methods.calculateAchievements = function(participant) {
  const achievements = []
  
  if (participant.completionTime <= this.estimatedDuration * 0.8) {
    achievements.push('Speed Demon')
  }
  
  if (participant.progress.hints_used === 0) {
    achievements.push('No Help Needed')
  }
  
  if (participant.progress.totalPoints >= this.rewards.points * 0.9) {
    achievements.push('High Scorer')
  }

  return achievements
}

module.exports = mongoose.model('TreasureHunt', TreasureHuntSchema)