const asyncHandler = require('../middleware/asyncHandler')
const Story = require('../models/Story')
const Monument = require('../models/Monument')
const logger = require('../utils/logger')

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  const skip = (page - 1) * limit
  
  // Build filter query
  const filter = { publishStatus: 'published' }
  
  if (req.query.type) {
    filter.type = { $in: req.query.type.split(',') }
  }
  
  if (req.query.monument) {
    filter.monument = req.query.monument
  }
  
  if (req.query.themes) {
    filter.themes = { $in: req.query.themes.split(',') }
  }
  
  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty
  }
  
  if (req.query.language) {
    filter['language.primary'] = req.query.language
  }
  
  if (req.query.featured) {
    filter.featuredLevel = { $ne: 'none' }
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
    case 'recent':
      sortQuery = { createdAt: -1 }
      break
    case 'views':
      sortQuery = { 'statistics.views': -1 }
      break
    case 'title':
      sortQuery = { title: 1 }
      break
    default:
      sortQuery = { 'statistics.popularityScore': -1 }
  }

  const stories = await Story.find(filter)
    .populate('monument', 'name location images')
    .populate('author', 'name avatar')
    .select('-content -interactions') // Exclude heavy fields for list view
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Story.countDocuments(filter)

  res.status(200).json({
    success: true,
    data: stories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
})

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
const getStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)
    .populate('monument', 'name location images ticketInfo')
    .populate('author', 'name avatar bio')
    .populate('relatedStories', 'title type summary monument readingTime')

  if (!story || story.publishStatus !== 'published') {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Add view interaction if user is authenticated
  if (req.user) {
    await story.addInteraction(req.user.id, 'view')
  } else {
    // Increment view count for anonymous users
    story.statistics.views += 1
    await story.save()
  }

  res.status(200).json({
    success: true,
    data: story
  })
})

// @desc    Search stories
// @route   GET /api/stories/search
// @access  Public
const searchStories = asyncHandler(async (req, res) => {
  const { q, type, themes, monument, difficulty } = req.query
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query required'
    })
  }

  const searchQuery = {
    $text: { $search: q },
    publishStatus: 'published'
  }

  // Additional filters
  if (type) searchQuery.type = { $in: type.split(',') }
  if (themes) searchQuery.themes = { $in: themes.split(',') }
  if (monument) searchQuery.monument = monument
  if (difficulty) searchQuery.difficulty = difficulty

  const stories = await Story.find(searchQuery, { score: { $meta: 'textScore' } })
    .populate('monument', 'name location')
    .populate('author', 'name')
    .select('-content -interactions')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .lean()

  res.status(200).json({
    success: true,
    data: stories,
    query: req.query
  })
})

// @desc    Get stories by monument
// @route   GET /api/stories/monument/:monumentId
// @access  Public
const getStoriesByMonument = asyncHandler(async (req, res) => {
  const stories = await Story.find({
    monument: req.params.monumentId,
    publishStatus: 'published'
  })
    .populate('author', 'name avatar')
    .select('-content -interactions')
    .sort({ 'statistics.popularityScore': -1 })
    .lean()

  res.status(200).json({
    success: true,
    data: stories
  })
})

// @desc    Get featured stories
// @route   GET /api/stories/featured
// @access  Public
const getFeaturedStories = asyncHandler(async (req, res) => {
  const stories = await Story.find({
    publishStatus: 'published',
    featuredLevel: { $ne: 'none' }
  })
    .populate('monument', 'name location images')
    .populate('author', 'name avatar')
    .select('-content -interactions')
    .sort({ featuredLevel: -1, 'statistics.popularityScore': -1 })
    .limit(10)
    .lean()

  res.status(200).json({
    success: true,
    data: stories
  })
})

// @desc    Create story
// @route   POST /api/stories
// @access  Private
const createStory = asyncHandler(async (req, res) => {
  // Add author
  req.body.author = req.user.id

  // Validate monument exists
  if (req.body.monument) {
    const monument = await Monument.findById(req.body.monument)
    if (!monument) {
      return res.status(404).json({
        success: false,
        message: 'Monument not found'
      })
    }
  }

  const story = await Story.create(req.body)

  // Add story to monument
  if (req.body.monument) {
    await Monument.findByIdAndUpdate(req.body.monument, {
      $push: { stories: story._id }
    })
  }

  logger.info(`Story created: ${story.title} by user ${req.user.id}`)

  res.status(201).json({
    success: true,
    data: story,
    message: 'Story created successfully'
  })
})

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private
const updateStory = asyncHandler(async (req, res) => {
  let story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check ownership or admin role
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this story'
    })
  }

  // Add to edit history
  if (req.body.content && req.body.content !== story.content) {
    story.editHistory.push({
      editor: req.user.id,
      changes: 'Content updated',
      version: `v${story.editHistory.length + 1}`
    })
  }

  story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  logger.info(`Story updated: ${story.title} by user ${req.user.id}`)

  res.status(200).json({
    success: true,
    data: story,
    message: 'Story updated successfully'
  })
})

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check ownership or admin role
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this story'
    })
  }

  // Remove from monument
  if (story.monument) {
    await Monument.findByIdAndUpdate(story.monument, {
      $pull: { stories: story._id }
    })
  }

  await story.deleteOne()

  logger.info(`Story deleted: ${story.title} by user ${req.user.id}`)

  res.status(200).json({
    success: true,
    message: 'Story deleted successfully'
  })
})

// @desc    Like/Unlike story
// @route   POST /api/stories/:id/like
// @access  Private
const likeStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check if user already liked
  const existingLike = story.interactions.find(
    interaction => interaction.user.toString() === req.user.id && interaction.type === 'like'
  )

  if (existingLike) {
    // Unlike
    story.interactions = story.interactions.filter(
      interaction => !(interaction.user.toString() === req.user.id && interaction.type === 'like')
    )
    story.statistics.likes = Math.max(0, story.statistics.likes - 1)
  } else {
    // Like
    await story.addInteraction(req.user.id, 'like')
  }

  await story.save()

  res.status(200).json({
    success: true,
    message: existingLike ? 'Story unliked' : 'Story liked',
    liked: !existingLike
  })
})

// @desc    Rate story
// @route   POST /api/stories/:id/rate
// @access  Private
const rateStory = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    })
  }

  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Remove existing rating from same user
  story.interactions = story.interactions.filter(
    interaction => !(interaction.user.toString() === req.user.id && interaction.type === 'rating')
  )

  // Add new rating
  await story.addInteraction(req.user.id, 'rating', { rating, comment })

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully'
  })
})

// @desc    Bookmark story
// @route   POST /api/stories/:id/bookmark
// @access  Private
const bookmarkStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check if already bookmarked
  const existingBookmark = story.interactions.find(
    interaction => interaction.user.toString() === req.user.id && interaction.type === 'bookmark'
  )

  if (existingBookmark) {
    // Remove bookmark
    story.interactions = story.interactions.filter(
      interaction => !(interaction.user.toString() === req.user.id && interaction.type === 'bookmark')
    )
    story.statistics.bookmarks = Math.max(0, story.statistics.bookmarks - 1)
  } else {
    // Add bookmark
    await story.addInteraction(req.user.id, 'bookmark')
  }

  await story.save()

  res.status(200).json({
    success: true,
    message: existingBookmark ? 'Bookmark removed' : 'Story bookmarked',
    bookmarked: !existingBookmark
  })
})

// @desc    Get story analytics
// @route   GET /api/stories/:id/analytics
// @access  Private (Author or Admin)
const getStoryAnalytics = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check ownership or admin role
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view analytics'
    })
  }

  const days = parseInt(req.query.days) || 30
  const analytics = story.getAnalytics(days)

  res.status(200).json({
    success: true,
    data: analytics
  })
})

// @desc    Upload story media
// @route   POST /api/stories/:id/media
// @access  Private
const uploadStoryMedia = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Check ownership or admin role
  if (story.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to upload media'
    })
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least one file'
    })
  }

  // Process uploaded files
  const mediaAssets = req.files.map(file => ({
    type: file.mimetype.startsWith('image/') ? 'image' : 
          file.mimetype.startsWith('video/') ? 'video' :
          file.mimetype.startsWith('audio/') ? 'audio' : 'document',
    url: file.path, // Cloudinary URL
    caption: req.body.caption || '',
    credits: req.body.credits || '',
    mimeType: file.mimetype,
    fileSize: file.size
  }))

  story.mediaAssets.push(...mediaAssets)
  await story.save()

  res.status(200).json({
    success: true,
    data: story,
    message: 'Media uploaded successfully'
  })
})

// @desc    View story (track view)
// @route   POST /api/stories/:id/view
// @access  Public
const viewStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id)

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Story not found'
    })
  }

  // Add view interaction
  if (req.user) {
    // For authenticated users, track the view with user ID
    await story.addInteraction(req.user.id, 'view')
  } else {
    // For anonymous users, just increment the view count
    story.statistics.views += 1
    await story.save()
  }

  res.status(200).json({
    success: true,
    message: 'View tracked successfully',
    data: {
      views: story.statistics.views
    }
  })
})

module.exports = {
  getStories,
  getStory,
  searchStories,
  getStoriesByMonument,
  getFeaturedStories,
  createStory,
  updateStory,
  deleteStory,
  likeStory,
  rateStory,
  bookmarkStory,
  getStoryAnalytics,
  uploadStoryMedia,
  viewStory
}
