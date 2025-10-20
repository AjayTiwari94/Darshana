const asyncHandler = require('../middleware/asyncHandler')
const Monument = require('../models/Monument')
const Story = require('../models/Story')
const { validationResult } = require('express-validator')
const logger = require('../utils/logger')

// @desc    Get all monuments
// @route   GET /api/monuments
// @access  Public
const getMonuments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit
  
  // Build filter query
  const filter = {}
  
  if (req.query.category) {
    filter.categories = { $in: req.query.category.split(',') }
  }
  
  if (req.query.state) {
    filter['location.state'] = new RegExp(req.query.state, 'i')
  }
  
  if (req.query.period) {
    filter['historicalPeriod.era'] = req.query.period
  }
  
  if (req.query.status) {
    filter.status = req.query.status
  } else {
    filter.status = 'active' // Default to active monuments
  }
  
  // Sort options
  let sortQuery = {}
  switch (req.query.sort) {
    case 'popular':
      sortQuery = { 'statistics.popularityScore': -1 }
      break
    case 'rating':
      sortQuery = { 'statistics.averageRating': -1 }
      break
    case 'name':
      sortQuery = { name: 1 }
      break
    case 'newest':
      sortQuery = { createdAt: -1 }
      break
    default:
      sortQuery = { 'statistics.popularityScore': -1 }
  }

  const monuments = await Monument.find(filter)
    .populate('stories', 'title type themes duration')
    .populate('treasureHunts', 'title difficulty duration')
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Monument.countDocuments(filter)

  res.status(200).json({
    success: true,
    data: monuments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})

// @desc    Get single monument
// @route   GET /api/monuments/:id
// @access  Public
const getMonument = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)
    .populate('stories')
    .populate('treasureHunts')

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  // Increment view count
  await Monument.findByIdAndUpdate(req.params.id, {
    $inc: { 'statistics.totalVisits': 1 }
  })

  res.status(200).json({
    success: true,
    data: monument
  })
})

// @desc    Search monuments
// @route   GET /api/monuments/search
// @access  Public
const searchMonuments = asyncHandler(async (req, res) => {
  const { q, category, state, lat, lng, radius } = req.query
  
  if (!q && !category && !state && !lat) {
    return res.status(400).json({
      success: false,
      message: 'Search query or filters required'
    })
  }

  const searchQuery = {}

  // Text search
  if (q) {
    searchQuery.$text = { $search: q }
  }

  // Category filter
  if (category) {
    searchQuery.categories = { $in: category.split(',') }
  }

  // State filter
  if (state) {
    searchQuery['location.state'] = new RegExp(state, 'i')
  }

  // Location-based search
  if (lat && lng) {
    const radiusInKm = radius ? parseInt(radius) : 50 // Default 50km radius
    
    searchQuery['location.coordinates'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: radiusInKm * 1000 // Convert to meters
      }
    }
  }

  const monuments = await Monument.find(searchQuery)
    .populate('stories', 'title type')
    .limit(20)
    .lean()

  // Add distance calculation if location provided
  if (lat && lng) {
    monuments.forEach(monument => {
      monument.distance = monument.calculateDistance(parseFloat(lat), parseFloat(lng))
    })
  }

  res.status(200).json({
    success: true,
    data: monuments,
    query: req.query
  })
})

// @desc    Create monument
// @route   POST /api/monuments
// @access  Private/Admin
const createMonument = asyncHandler(async (req, res) => {
  // Add user info
  req.body.createdBy = req.user.id

  const monument = await Monument.create(req.body)

  logger.info(`Monument created: ${monument.name} by user ${req.user.id}`)

  res.status(201).json({
    success: true,
    data: monument,
    message: 'Monument created successfully'
  })
})

// @desc    Update monument
// @route   PUT /api/monuments/:id
// @access  Private/Admin
const updateMonument = asyncHandler(async (req, res) => {
  let monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  monument = await Monument.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  logger.info(`Monument updated: ${monument.name} by user ${req.user.id}`)

  res.status(200).json({
    success: true,
    data: monument,
    message: 'Monument updated successfully'
  })
})

// @desc    Delete monument
// @route   DELETE /api/monuments/:id
// @access  Private/Admin
const deleteMonument = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  await monument.deleteOne()

  logger.info(`Monument deleted: ${monument.name} by user ${req.user.id}`)

  res.status(200).json({
    success: true,
    message: 'Monument deleted successfully'
  })
})

// @desc    Upload monument images
// @route   POST /api/monuments/:id/images
// @access  Private/Admin
const uploadMonumentImages = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least one image'
    })
  }

  // Process uploaded images (assuming Cloudinary integration)
  const images = req.files.map(file => ({
    url: file.path, // Cloudinary URL
    caption: req.body.caption || '',
    credits: req.body.credits || '',
    isPrimary: false
  }))

  // Set first image as primary if no primary image exists
  if (!monument.images.some(img => img.isPrimary)) {
    images[0].isPrimary = true
  }

  monument.images.push(...images)
  await monument.save()

  res.status(200).json({
    success: true,
    data: monument,
    message: 'Images uploaded successfully'
  })
})

// @desc    Add AR asset to monument
// @route   POST /api/monuments/:id/ar-assets
// @access  Private/Admin
const addARAsset = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  monument.arAssets.push(req.body)
  await monument.save()

  res.status(200).json({
    success: true,
    data: monument,
    message: 'AR asset added successfully'
  })
})

// @desc    Add VR experience to monument
// @route   POST /api/monuments/:id/vr-experiences
// @access  Private/Admin
const addVRExperience = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  monument.vrExperiences.push(req.body)
  await monument.save()

  res.status(200).json({
    success: true,
    data: monument,
    message: 'VR experience added successfully'
  })
})

// @desc    Rate monument
// @route   POST /api/monuments/:id/rate
// @access  Private
const rateMonument = asyncHandler(async (req, res) => {
  const { rating, review } = req.body
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    })
  }

  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  // Add to user's visit history
  await req.user.addVisit({
    monumentId: req.params.id,
    rating,
    review
  })

  // Update monument statistics (simplified - in production, calculate properly)
  monument.statistics.totalRatings += 1
  monument.statistics.averageRating = (monument.statistics.averageRating + rating) / 2
  
  if (review) {
    monument.statistics.totalReviews += 1
  }

  await monument.save()

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully'
  })
})

// @desc    Get monument statistics
// @route   GET /api/monuments/:id/stats
// @access  Private/Admin
const getMonumentStats = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  const stats = {
    basic: monument.statistics,
    timeline: monument.getTimeline ? monument.getTimeline() : [],
    relatedMonuments: await monument.getRelatedMonuments ? monument.getRelatedMonuments() : [],
    recentVisitors: await User.find({ 'visitHistory.monumentId': req.params.id })
      .sort({ 'visitHistory.visitDate': -1 })
      .limit(10)
      .select('name avatar visitHistory.$')
  }

  res.status(200).json({
    success: true,
    data: stats
  })
})

// @desc    View monument (track view)
// @route   POST /api/monuments/:id/view
// @access  Public
const viewMonument = asyncHandler(async (req, res) => {
  const monument = await Monument.findById(req.params.id)

  if (!monument) {
    return res.status(404).json({
      success: false,
      message: 'Monument not found'
    })
  }

  // Increment view count
  monument.statistics.totalVisits += 1
  await monument.save()

  res.status(200).json({
    success: true,
    message: 'View tracked successfully',
    data: {
      totalVisits: monument.statistics.totalVisits
    }
  })
})

module.exports = {
  getMonuments,
  getMonument,
  searchMonuments,
  createMonument,
  updateMonument,
  deleteMonument,
  uploadMonumentImages,
  addARAsset,
  addVRExperience,
  rateMonument,
  getMonumentStats,
  viewMonument
}