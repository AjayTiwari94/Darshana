const Quest = require('../models/Quest')
const User = require('../models/User')
const { validationResult } = require('express-validator')

// @desc    Get all active quests
// @route   GET /api/quests
// @access  Public
const getQuests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      difficulty,
      category,
      type,
      sort = 'createdAt'
    } = req.query

    const query = { isActive: true }
    
    if (difficulty) query.difficulty = difficulty
    if (category) query.category = category
    if (type) query.type = type

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
      populate: 'relatedMonuments',
      select: '-participants' // Don't include participant details in list view
    }

    const quests = await Quest.paginate(query, options)

    // If user is authenticated, include their progress
    if (req.user) {
      for (let quest of quests.docs) {
        const progress = quest.getParticipantProgress(req.user.id)
        if (progress) {
          quest.userProgress = progress
        }
      }
    }

    res.status(200).json({
      success: true,
      data: quests.docs,
      pagination: {
        currentPage: quests.page,
        totalPages: quests.totalPages,
        totalItems: quests.totalDocs,
        hasNext: quests.hasNextPage,
        hasPrev: quests.hasPrevPage
      }
    })
  } catch (error) {
    console.error('Get quests error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get quest by ID
// @route   GET /api/quests/:id
// @access  Public
const getQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
      .populate('relatedMonuments', 'name location images')
      .populate('createdBy', 'firstName lastName')

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    // Include user progress if authenticated
    let userProgress = null
    if (req.user) {
      userProgress = quest.getParticipantProgress(req.user.id)
    }

    res.status(200).json({
      success: true,
      data: {
        ...quest.toObject(),
        userProgress,
        participants: undefined // Don't expose participant details
      }
    })
  } catch (error) {
    console.error('Get quest error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Start a quest
// @route   POST /api/quests/:id/start
// @access  Private
const startQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    if (!quest.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Quest is not active'
      })
    }

    // Check prerequisites
    const user = await User.findById(req.user.id)
    const prerequisiteCheck = quest.checkPrerequisites(user)
    
    if (!prerequisiteCheck.eligible) {
      return res.status(400).json({
        success: false,
        message: prerequisiteCheck.reason
      })
    }

    // Add participant
    await quest.addParticipant(req.user.id)
    
    // Get updated progress
    const progress = quest.getParticipantProgress(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Quest started successfully',
      data: progress
    })
  } catch (error) {
    if (error.message.includes('already participating')) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    
    console.error('Start quest error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update quest progress
// @route   PUT /api/quests/:id/progress
// @access  Private
const updateQuestProgress = async (req, res) => {
  try {
    const { objectiveId, completed = true, data = {} } = req.body
    
    const quest = await Quest.findById(req.params.id)
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    // Update progress
    await quest.updateProgress(req.user.id, objectiveId, completed)
    
    // Get updated progress
    const progress = quest.getParticipantProgress(req.user.id)

    // If quest completed, add rewards to user
    if (progress.status === 'completed') {
      const user = await User.findById(req.user.id)
      await user.addReward(
        quest.rewards.points,
        'Quest Completion',
        `Completed quest: ${quest.title}`,
        quest._id
      )
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    })
  } catch (error) {
    console.error('Update quest progress error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    })
  }
}

// @desc    Get user's quest progress
// @route   GET /api/quests/:id/progress
// @access  Private
const getQuestProgress = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
    
    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    const progress = quest.getParticipantProgress(req.user.id)
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User not participating in this quest'
      })
    }

    res.status(200).json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Get quest progress error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Get user's active quests
// @route   GET /api/user/quests
// @access  Private
const getUserQuests = async (req, res) => {
  try {
    const { status } = req.query
    
    let matchStage = { 'participants.user': req.user.id }
    if (status) {
      matchStage['participants.status'] = status
    }

    const quests = await Quest.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          userProgress: {
            $arrayElemAt: [
              { $filter: { input: '$participants', cond: { $eq: ['$$this.user', req.user.id] } } },
              0
            ]
          }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          type: 1,
          difficulty: 1,
          category: 1,
          objectives: 1,
          rewards: 1,
          timeLimit: 1,
          'userProgress.status': 1,
          'userProgress.progress': 1,
          'userProgress.totalPointsEarned': 1,
          'userProgress.startedAt': 1,
          'userProgress.completedAt': 1
        }
      }
    ])

    res.status(200).json({
      success: true,
      data: quests
    })
  } catch (error) {
    console.error('Get user quests error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Create a new quest (Admin only)
// @route   POST /api/quests
// @access  Private (Admin)
const createQuest = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const questData = {
      ...req.body,
      createdBy: req.user.id
    }

    const quest = await Quest.create(questData)
    
    res.status(201).json({
      success: true,
      message: 'Quest created successfully',
      data: quest
    })
  } catch (error) {
    console.error('Create quest error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update quest (Admin only)
// @route   PUT /api/quests/:id
// @access  Private (Admin)
const updateQuest = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const quest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Quest updated successfully',
      data: quest
    })
  } catch (error) {
    console.error('Update quest error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Delete quest (Admin only)
// @route   DELETE /api/quests/:id
// @access  Private (Admin)
const deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: 'Quest not found'
      })
    }

    await quest.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Quest deleted successfully'
    })
  } catch (error) {
    console.error('Delete quest error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

module.exports = {
  getQuests,
  getQuest,
  startQuest,
  updateQuestProgress,
  getQuestProgress,
  getUserQuests,
  createQuest,
  updateQuest,
  deleteQuest
}