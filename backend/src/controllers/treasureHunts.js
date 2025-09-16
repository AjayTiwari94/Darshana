const TreasureHunt = require('../models/TreasureHunt')
const User = require('../models/User')
const { validationResult } = require('express-validator')

// @desc    Get all treasure hunts
// @route   GET /api/treasure-hunts
// @access  Public
const getTreasureHunts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      theme,
      difficulty,
      status,
      sort = 'createdAt'
    } = req.query

    const query = { isActive: true, isPublic: true }
    
    if (theme) query.theme = theme
    if (difficulty) query.difficulty = difficulty
    if (status) {
      const now = new Date()
      if (status === 'active') {
        query['schedule.startDate'] = { $lte: now }
        query['schedule.endDate'] = { $gte: now }
      } else if (status === 'upcoming') {
        query['schedule.startDate'] = { $gt: now }
      } else if (status === 'ended') {
        query['schedule.endDate'] = { $lt: now }
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      populate: [
        { path: 'locations.monument', select: 'name location images' },
        { path: 'createdBy', select: 'firstName lastName' }
      ]
    }

    const hunts = await TreasureHunt.paginate(query, options)

    // Add user registration status if authenticated
    if (req.user) {
      for (let hunt of hunts.docs) {
        const isRegistered = hunt.participants.some(p => p.user.toString() === req.user.id)
        hunt.isRegistered = isRegistered
      }
    }

    res.status(200).json({
      success: true,
      data: hunts.docs,
      pagination: {
        currentPage: hunts.page,
        totalPages: hunts.totalPages,
        totalItems: hunts.totalDocs,
        hasNext: hunts.hasNextPage,
        hasPrev: hunts.hasPrevPage
      }
    })
  } catch (error) {
    console.error('Get treasure hunts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get treasure hunt by ID
// @route   GET /api/treasure-hunts/:id
// @access  Public
const getTreasureHunt = async (req, res) => {
  try {
    const hunt = await TreasureHunt.findById(req.params.id)
      .populate('locations.monument', 'name location images operatingHours')
      .populate('createdBy', 'firstName lastName')

    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    // Include user progress if authenticated
    let userProgress = null
    if (req.user) {
      const participant = hunt.participants.find(p => p.user.toString() === req.user.id)
      if (participant) {
        userProgress = participant
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...hunt.toObject(),
        userProgress,
        participants: undefined // Don't expose participant details
      }
    })
  } catch (error) {
    console.error('Get treasure hunt error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Register for treasure hunt
// @route   POST /api/treasure-hunts/:id/register
// @access  Private
const registerForHunt = async (req, res) => {
  try {
    const { teamName } = req.body
    
    const hunt = await TreasureHunt.findById(req.params.id)
    
    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    await hunt.registerParticipant(req.user.id, teamName)

    res.status(200).json({
      success: true,
      message: 'Successfully registered for treasure hunt'
    })
  } catch (error) {
    if (error.message.includes('already registered') || error.message.includes('full') || error.message.includes('ended')) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    
    console.error('Register for hunt error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Start treasure hunt
// @route   POST /api/treasure-hunts/:id/start
// @access  Private
const startHunt = async (req, res) => {
  try {
    const hunt = await TreasureHunt.findById(req.params.id)
    
    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    await hunt.startHunt(req.user.id)
    
    const participant = hunt.participants.find(p => p.user.toString() === req.user.id)

    res.status(200).json({
      success: true,
      message: 'Treasure hunt started successfully',
      data: participant
    })
  } catch (error) {
    console.error('Start hunt error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    })
  }
}

// @desc    Submit clue answer
// @route   POST /api/treasure-hunts/:id/submit-clue
// @access  Private
const submitClue = async (req, res) => {
  try {
    const { locationIndex, clueIndex, answer } = req.body
    
    const hunt = await TreasureHunt.findById(req.params.id)
    
    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    await hunt.completeClue(req.user.id, locationIndex, clueIndex, answer)
    
    const participant = hunt.participants.find(p => p.user.toString() === req.user.id)

    res.status(200).json({
      success: true,
      message: 'Clue completed successfully',
      data: participant
    })
  } catch (error) {
    console.error('Submit clue error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    })
  }
}

// @desc    Get hunt progress
// @route   GET /api/treasure-hunts/:id/progress
// @access  Private
const getHuntProgress = async (req, res) => {
  try {
    const hunt = await TreasureHunt.findById(req.params.id)
    
    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    const participant = hunt.participants.find(p => p.user.toString() === req.user.id)
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not participating in this hunt'
      })
    }

    res.status(200).json({
      success: true,
      data: participant
    })
  } catch (error) {
    console.error('Get hunt progress error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get hunt leaderboard
// @route   GET /api/treasure-hunts/:id/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const hunt = await TreasureHunt.findById(req.params.id)
      .populate('leaderboard.user', 'firstName lastName avatar')
    
    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    res.status(200).json({
      success: true,
      data: hunt.leaderboard
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Create treasure hunt (Admin only)
// @route   POST /api/treasure-hunts
// @access  Private (Admin)
const createTreasureHunt = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const huntData = {
      ...req.body,
      createdBy: req.user.id
    }

    const hunt = await TreasureHunt.create(huntData)
    
    res.status(201).json({
      success: true,
      message: 'Treasure hunt created successfully',
      data: hunt
    })
  } catch (error) {
    console.error('Create treasure hunt error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update treasure hunt (Admin only)
// @route   PUT /api/treasure-hunts/:id
// @access  Private (Admin)
const updateTreasureHunt = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const hunt = await TreasureHunt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Treasure hunt updated successfully',
      data: hunt
    })
  } catch (error) {
    console.error('Update treasure hunt error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Delete treasure hunt (Admin only)
// @route   DELETE /api/treasure-hunts/:id
// @access  Private (Admin)
const deleteTreasureHunt = async (req, res) => {
  try {
    const hunt = await TreasureHunt.findById(req.params.id)

    if (!hunt) {
      return res.status(404).json({
        success: false,
        message: 'Treasure hunt not found'
      })
    }

    await hunt.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Treasure hunt deleted successfully'
    })
  } catch (error) {
    console.error('Delete treasure hunt error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  getTreasureHunts,
  getTreasureHunt,
  registerForHunt,
  startHunt,
  submitClue,
  getHuntProgress,
  getLeaderboard,
  createTreasureHunt,
  updateTreasureHunt,
  deleteTreasureHunt
}