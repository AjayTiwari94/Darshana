const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a story title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: [true, 'Please specify story type'],
    enum: [
      'history',
      'mythology', 
      'folklore',
      'horror',
      'belief',
      'legend',
      'mystery',
      'romance',
      'adventure',
      'spiritual'
    ]
  },
  content: {
    type: String,
    required: [true, 'Please add story content']
  },
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  monument: {
    type: mongoose.Schema.ObjectId,
    ref: 'Monument',
    required: [true, 'Story must be associated with a monument']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  mediaAssets: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'illustration', 'map', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: String,
    credits: String,
    thumbnail: String,
    duration: Number, // for video/audio in seconds
    fileSize: Number,
    mimeType: String
  }],
  narrator: {
    name: {
      type: String,
      default: 'Narad AI'
    },
    voice: {
      type: String,
      enum: ['male', 'female', 'ai', 'child', 'elderly'],
      default: 'ai'
    },
    accent: {
      type: String,
      enum: ['neutral', 'indian', 'british', 'american', 'regional'],
      default: 'indian'
    },
    specialty: [String],
    bio: String
  },
  language: {
    primary: {
      type: String,
      enum: ['en', 'hi', 'regional'],
      default: 'en'
    },
    available: [{
      type: String,
      enum: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as']
    }]
  },
  themes: [{
    type: String,
    enum: [
      'love', 'war', 'devotion', 'sacrifice', 'wisdom', 'power',
      'mystery', 'supernatural', 'divine', 'justice', 'betrayal',
      'heroism', 'culture', 'tradition', 'architecture', 'art',
      'music', 'dance', 'festival', 'ritual', 'pilgrimage'
    ]
  }],
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  ageRating: {
    type: String,
    enum: ['all', '7+', '13+', '16+', '18+'],
    default: 'all'
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  audioLength: {
    type: Number, // in minutes
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'folklore', 'legend', 'disputed', 'fictional'],
    default: 'folklore'
  },
  culturalSignificance: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  historicalAccuracy: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  sources: [{
    title: String,
    author: String,
    publication: String,
    year: Number,
    url: String,
    type: {
      type: String,
      enum: ['book', 'article', 'website', 'oral_tradition', 'manuscript', 'inscription']
    }
  }],
  relatedStories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Story'
  }],
  characters: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['protagonist', 'antagonist', 'supporting', 'narrator', 'divine', 'historical']
    },
    description: String,
    significance: String,
    mythology: Boolean,
    historical: Boolean
  }],
  timeline: [{
    period: String,
    event: String,
    significance: String,
    year: Number,
    era: String
  }],
  locations: [{
    name: String,
    currentName: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    significance: String,
    stillExists: {
      type: Boolean,
      default: true
    }
  }],
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    popularityScore: {
      type: Number,
      default: 0
    }
  },
  interactions: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['view', 'like', 'share', 'bookmark', 'comment', 'rating']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  publishStatus: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  featuredLevel: {
    type: String,
    enum: ['none', 'bronze', 'silver', 'gold', 'platinum'],
    default: 'none'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiModel: String,
  aiPrompt: String,
  editHistory: [{
    editor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    changes: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    version: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Create story slug from title
StorySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

// Auto-generate summary if not provided
StorySchema.pre('save', function(next) {
  if (!this.summary && this.content) {
    // Simple extractive summary - first 3 sentences or 400 chars
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    if (sentences.length >= 3) {
      this.summary = sentences.slice(0, 3).join('. ') + '.'
    } else {
      this.summary = this.content.substring(0, 400) + '...'
    }
  }
  next()
})

// Auto-generate excerpt from summary
StorySchema.pre('save', function(next) {
  if (!this.excerpt && this.summary) {
    this.excerpt = this.summary.length > 200 
      ? this.summary.substring(0, 197) + '...'
      : this.summary
  }
  next()
})

// Calculate reading time based on word count
StorySchema.pre('save', function(next) {
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length
    this.readingTime = Math.ceil(wordCount / 200) // 200 words per minute
  }
  next()
})

// Virtual for word count
StorySchema.virtual('wordCount').get(function() {
  return this.content ? this.content.split(/\s+/).length : 0
})

// Virtual for character count
StorySchema.virtual('characterCount').get(function() {
  return this.content ? this.content.length : 0
})

// Virtual for engagement score
StorySchema.virtual('engagementScore').get(function() {
  const stats = this.statistics
  return (stats.likes * 2) + (stats.shares * 3) + (stats.bookmarks * 4) + (stats.comments * 5)
})

// Method to add interaction
StorySchema.methods.addInteraction = function(userId, type, data = {}) {
  const interaction = {
    user: userId,
    type: type,
    ...data
  }
  
  this.interactions.push(interaction)
  
  // Update statistics
  if (type === 'view') this.statistics.views += 1
  else if (type === 'like') this.statistics.likes += 1
  else if (type === 'share') this.statistics.shares += 1
  else if (type === 'bookmark') this.statistics.bookmarks += 1
  else if (type === 'comment') this.statistics.comments += 1
  else if (type === 'rating') {
    this.statistics.totalRatings += 1
    this.statistics.averageRating = (
      (this.statistics.averageRating * (this.statistics.totalRatings - 1)) + data.rating
    ) / this.statistics.totalRatings
  }
  
  // Recalculate popularity score
  this.calculatePopularityScore()
  
  return this.save()
}

// Method to calculate popularity score
StorySchema.methods.calculatePopularityScore = function() {
  const stats = this.statistics
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)
  
  // Weighted score considering recency
  const baseScore = (
    stats.views * 1 +
    stats.likes * 5 +
    stats.shares * 10 +
    stats.bookmarks * 8 +
    stats.comments * 15 +
    stats.averageRating * stats.totalRatings * 3
  )
  
  // Decay factor for older content
  const decayFactor = Math.exp(-daysSinceCreation / 30) // 30-day half-life
  
  this.statistics.popularityScore = Math.round(baseScore * decayFactor)
  return this.statistics.popularityScore
}

// Method to get related stories
StorySchema.methods.getRelatedStories = async function(limit = 5) {
  const Story = this.constructor
  
  // Find stories with similar themes, type, or monument
  const related = await Story.find({
    _id: { $ne: this._id },
    $or: [
      { themes: { $in: this.themes } },
      { type: this.type },
      { monument: this.monument },
      { tags: { $in: this.tags } }
    ],
    publishStatus: 'published'
  })
  .populate('monument', 'name location')
  .sort({ 'statistics.popularityScore': -1 })
  .limit(limit)
  .lean()
  
  return related
}

// Method to get story analytics
StorySchema.methods.getAnalytics = function(days = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  
  const recentInteractions = this.interactions.filter(
    interaction => interaction.timestamp >= cutoffDate
  )
  
  const analytics = {
    totalInteractions: recentInteractions.length,
    viewsInPeriod: recentInteractions.filter(i => i.type === 'view').length,
    likesInPeriod: recentInteractions.filter(i => i.type === 'like').length,
    sharesInPeriod: recentInteractions.filter(i => i.type === 'share').length,
    commentsInPeriod: recentInteractions.filter(i => i.type === 'comment').length,
    averageRatingInPeriod: this._calculateAverageRating(recentInteractions),
    engagementRate: this._calculateEngagementRate(recentInteractions),
    topDevices: this._getTopDevices(recentInteractions),
    peakHours: this._getPeakHours(recentInteractions)
  }
  
  return analytics
}

// Helper method to calculate average rating from interactions
StorySchema.methods._calculateAverageRating = function(interactions) {
  const ratings = interactions.filter(i => i.type === 'rating' && i.rating)
  if (ratings.length === 0) return 0
  
  const sum = ratings.reduce((total, rating) => total + rating.rating, 0)
  return (sum / ratings.length).toFixed(1)
}

// Helper method to calculate engagement rate
StorySchema.methods._calculateEngagementRate = function(interactions) {
  const views = interactions.filter(i => i.type === 'view').length
  const engagements = interactions.filter(i => i.type !== 'view').length
  
  return views > 0 ? ((engagements / views) * 100).toFixed(2) : 0
}

// Helper methods for analytics (simplified)
StorySchema.methods._getTopDevices = function(interactions) {
  // In real implementation, this would analyze user-agent data
  return ['Mobile', 'Desktop', 'Tablet']
}

StorySchema.methods._getPeakHours = function(interactions) {
  // In real implementation, this would analyze timestamp patterns
  return ['10:00-11:00', '15:00-16:00', '20:00-21:00']
}

// Indexes for performance
StorySchema.index({ slug: 1 })
StorySchema.index({ monument: 1 })
StorySchema.index({ type: 1 })
StorySchema.index({ themes: 1 })
StorySchema.index({ publishStatus: 1 })
StorySchema.index({ 'statistics.popularityScore': -1 })
StorySchema.index({ createdAt: -1 })
StorySchema.index({ language: 1 })

// Text index for search
StorySchema.index({
  title: 'text',
  content: 'text',
  summary: 'text',
  themes: 'text',
  tags: 'text'
})

// Compound indexes
StorySchema.index({ publishStatus: 1, 'statistics.popularityScore': -1 })
StorySchema.index({ monument: 1, type: 1 })
StorySchema.index({ type: 1, difficulty: 1 })

module.exports = mongoose.model('Story', StorySchema)