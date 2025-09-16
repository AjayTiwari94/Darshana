const mongoose = require('mongoose')

const QuestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quest title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quest description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['location', 'knowledge', 'photo', 'social', 'exploration', 'story'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    default: 'Easy'
  },
  category: {
    type: String,
    enum: ['Historical', 'Cultural', 'Archaeological', 'Architectural', 'Mythological'],
    required: true
  },
  relatedMonuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monument'
  }],
  objectives: [{
    id: String,
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['visit', 'answer', 'photo', 'share', 'rate', 'story', 'time']
    },
    target: mongoose.Schema.Types.Mixed,
    points: {
      type: Number,
      default: 10
    }
  }],
  rewards: {
    points: {
      type: Number,
      default: 100
    },
    badges: [String],
    unlocks: [String],
    experiencePoints: {
      type: Number,
      default: 50
    }
  },
  prerequisites: {
    level: {
      type: Number,
      default: 1
    },
    completedQuests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest'
    }],
    visitedMonuments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monument'
    }]
  },
  timeLimit: {
    type: Number, // in minutes
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['started', 'in_progress', 'completed', 'abandoned'],
      default: 'started'
    },
    progress: [{
      objectiveId: String,
      completed: Boolean,
      completedAt: Date,
      pointsEarned: Number
    }],
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    totalPointsEarned: {
      type: Number,
      default: 0
    }
  }],
  statistics: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    completedCount: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  hints: [{
    objectiveId: String,
    content: String,
    cost: {
      type: Number,
      default: 5 // points cost for hint
    }
  }],
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
QuestSchema.index({ type: 1, difficulty: 1 })
QuestSchema.index({ category: 1 })
QuestSchema.index({ isActive: 1, startDate: 1 })
QuestSchema.index({ 'participants.user': 1 })

// Virtual for completion rate
QuestSchema.virtual('completionRate').get(function() {
  if (this.statistics.totalParticipants === 0) return 0
  return (this.statistics.completedCount / this.statistics.totalParticipants) * 100
})

// Virtual for active participants
QuestSchema.virtual('activeParticipants').get(function() {
  return this.participants.filter(p => p.status === 'in_progress').length
})

// Methods
QuestSchema.methods.addParticipant = function(userId) {
  // Check if user already participating
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString())
  if (existingParticipant) {
    throw new Error('User already participating in this quest')
  }

  // Add new participant
  this.participants.push({
    user: userId,
    status: 'started',
    progress: this.objectives.map(obj => ({
      objectiveId: obj.id,
      completed: false,
      pointsEarned: 0
    }))
  })

  this.statistics.totalParticipants += 1
  return this.save()
}

QuestSchema.methods.updateProgress = function(userId, objectiveId, completed = true) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString())
  if (!participant) {
    throw new Error('User not participating in this quest')
  }

  const progressItem = participant.progress.find(p => p.objectiveId === objectiveId)
  if (!progressItem) {
    throw new Error('Objective not found')
  }

  if (!progressItem.completed && completed) {
    const objective = this.objectives.find(obj => obj.id === objectiveId)
    progressItem.completed = true
    progressItem.completedAt = new Date()
    progressItem.pointsEarned = objective.points
    participant.totalPointsEarned += objective.points

    // Check if all objectives completed
    const allCompleted = participant.progress.every(p => p.completed)
    if (allCompleted) {
      participant.status = 'completed'
      participant.completedAt = new Date()
      participant.totalPointsEarned += this.rewards.points
      this.statistics.completedCount += 1
    } else {
      participant.status = 'in_progress'
    }
  }

  return this.save()
}

QuestSchema.methods.getParticipantProgress = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString())
  if (!participant) return null

  const totalObjectives = this.objectives.length
  const completedObjectives = participant.progress.filter(p => p.completed).length
  const progressPercentage = (completedObjectives / totalObjectives) * 100

  return {
    status: participant.status,
    progress: participant.progress,
    totalPointsEarned: participant.totalPointsEarned,
    progressPercentage,
    completedObjectives,
    totalObjectives,
    startedAt: participant.startedAt,
    completedAt: participant.completedAt
  }
}

QuestSchema.methods.checkPrerequisites = function(user) {
  // Check level requirement
  if (user.level < this.prerequisites.level) {
    return {
      eligible: false,
      reason: `Requires level ${this.prerequisites.level}`
    }
  }

  // Check completed quests (simplified - would need proper user quest tracking)
  // This would require checking user's completed quests
  
  return { eligible: true }
}

module.exports = mongoose.model('Quest', QuestSchema)