const mongoose = require('mongoose')

const MonumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a monument name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Please add latitude']
      },
      longitude: {
        type: Number,
        required: [true, 'Please add longitude']
      }
    },
    nearbyLandmarks: [String]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    credits: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  categories: [{
    type: String,
    enum: [
      'temple',
      'palace',
      'fort',
      'monument',
      'cave',
      'archaeological_site',
      'museum',
      'garden',
      'tomb',
      'church',
      'mosque',
      'gurudwara',
      'wildlife',
      'heritage_site'
    ]
  }],
  historicalPeriod: {
    era: {
      type: String,
      enum: [
        'ancient',
        'medieval',
        'colonial',
        'modern',
        'prehistoric'
      ]
    },
    dynasty: String,
    yearBuilt: Number,
    yearRange: {
      start: Number,
      end: Number
    }
  },
  significance: {
    cultural: String,
    historical: String,
    architectural: String,
    religious: String
  },
  stories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Story'
  }],
  arAssets: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['animation', 'overlay', 'interactive', 'reconstruction']
    },
    modelUrl: String,
    triggerPoints: [{
      coordinates: {
        x: Number,
        y: Number,
        z: Number
      },
      radius: {
        type: Number,
        default: 5
      },
      action: String,
      description: String
    }],
    storyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Story'
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  vrExperiences: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    sceneUrl: String,
    duration: {
      type: Number, // in minutes
      default: 10
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    interactiveElements: [{
      name: String,
      position: {
        x: Number,
        y: Number,
        z: Number
      },
      action: String,
      content: String
    }],
    requiredEquipment: [{
      type: String,
      enum: ['smartphone', 'vr-headset', 'cardboard']
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  treasureHunts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'TreasureHunt'
  }],
  ticketInfo: {
    available: {
      type: Boolean,
      default: true
    },
    prices: {
      indian: {
        adult: Number,
        child: Number,
        senior: Number,
        student: Number
      },
      foreign: {
        adult: Number,
        child: Number,
        senior: Number,
        student: Number
      }
    },
    timings: {
      openTime: String,
      closeTime: String,
      closedDays: [String]
    },
    bookingUrl: String,
    restrictions: [String],
    groupDiscounts: [{
      minSize: Number,
      discountPercent: Number
    }]
  },
  accessibility: {
    wheelchairAccessible: {
      type: Boolean,
      default: false
    },
    audioGuideAvailable: {
      type: Boolean,
      default: false
    },
    signLanguageSupport: {
      type: Boolean,
      default: false
    },
    brailleInformation: {
      type: Boolean,
      default: false
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    }
  },
  facilities: {
    restrooms: Boolean,
    cafeteria: Boolean,
    giftShop: Boolean,
    guidedTours: Boolean,
    audioGuides: Boolean,
    wheelchairRental: Boolean,
    firstAid: Boolean,
    parking: Boolean,
    wifi: Boolean
  },
  statistics: {
    totalVisits: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    popularityScore: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'coming_soon'],
    default: 'active'
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Create monument slug from name
MonumentSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

// Virtual for primary image
MonumentSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary)
  return primaryImg || this.images[0] || null
})

// Virtual for story count
MonumentSchema.virtual('storyCount').get(function() {
  return this.stories.length
})

// Virtual for AR experience count
MonumentSchema.virtual('arExperienceCount').get(function() {
  return this.arAssets.filter(asset => asset.isActive).length
})

// Virtual for VR experience count
MonumentSchema.virtual('vrExperienceCount').get(function() {
  return this.vrExperiences.filter(exp => exp.isActive).length
})

// Virtual for treasure hunt count
MonumentSchema.virtual('treasureHuntCount').get(function() {
  return this.treasureHunts.length
})

// Method to calculate distance from given coordinates
MonumentSchema.methods.calculateDistance = function(lat, lng) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat - this.location.coordinates.latitude) * Math.PI / 180
  const dLng = (lng - this.location.coordinates.longitude) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.location.coordinates.latitude * Math.PI / 180) *
    Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Method to update statistics
MonumentSchema.methods.updateStatistics = function() {
  // This would typically be called after a visit or rating
  // Implementation would involve calculating averages from related data
  return this.save()
}

// Method to add story
MonumentSchema.methods.addStory = function(storyId) {
  if (!this.stories.includes(storyId)) {
    this.stories.push(storyId)
    return this.save()
  }
  return Promise.resolve(this)
}

// Method to add treasure hunt
MonumentSchema.methods.addTreasureHunt = function(huntId) {
  if (!this.treasureHunts.includes(huntId)) {
    this.treasureHunts.push(huntId)
    return this.save()
  }
  return Promise.resolve(this)
}

// Indexes for better performance
MonumentSchema.index({ slug: 1 })
MonumentSchema.index({ 'location.coordinates': '2dsphere' })
MonumentSchema.index({ categories: 1 })
MonumentSchema.index({ 'statistics.popularityScore': -1 })
MonumentSchema.index({ 'statistics.averageRating': -1 })
MonumentSchema.index({ status: 1 })
MonumentSchema.index({ createdAt: -1 })

// Text index for search
MonumentSchema.index({
  name: 'text',
  description: 'text',
  'location.city': 'text',
  'location.state': 'text',
  categories: 'text'
})

module.exports = mongoose.model('Monument', MonumentSchema)