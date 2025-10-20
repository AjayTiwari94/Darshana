const express = require('express')
const axios = require('axios')
const { protect, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// AI Service configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// Real AI chat endpoint connected to Narad AI service
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, context, sessionId } = req.body
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    console.log('🔍 Processing AI request:', {
      message: message.substring(0, 50) + '...',
      sessionId,
      hasContext: !!context
    })

    // Forward request to AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/chat`, {
      message,
      session_id: sessionId || `session_${Date.now()}`,
      context: context || {},
      user_id: req.user?.id
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('✅ AI service responded successfully', {
      status: aiResponse.status,
      data: aiResponse.data
    })

    // Return AI response in expected format
    res.json({
      status: 'success',
      response: aiResponse.data.response,
      suggestions: aiResponse.data.suggestions || [],
      metadata: {
        sessionId: sessionId || Date.now().toString(),
        timestamp: new Date().toISOString(),
        context: context || {}
      }
    })

  } catch (error) {
    console.error('❌ AI Service Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    })

    // Fallback response when AI service is unavailable
    const fallbackResponses = [
      "I'm Narad AI, your cultural guide. I'm having a brief connection issue, but I'm here to help you explore India's heritage!",
      "Hello! I'm temporarily experiencing some technical difficulties, but I'd love to share India's amazing stories with you.",
      "Namaste! While I'm getting back to full strength, feel free to ask me about monuments, myths, or cultural adventures!"
    ]
    
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    // Use sessionId from req.body if available, otherwise generate a new one
    const fallbackSessionId = req.body?.sessionId || `session_${Date.now()}`;
    
    res.json({
      status: 'success',
      response: randomFallback,
      suggestions: [
        "Tell me about the Taj Mahal",
        "Share some mythology",
        "What ghost stories do you know?",
        "Plan my cultural journey"
      ],
      metadata: {
        sessionId: fallbackSessionId,
        timestamp: new Date().toISOString(),
        context: req.body?.context || {},
        fallback: true
      }
    })
  }
})

// Story summarization endpoint
router.post('/summarize', protect, async (req, res) => {
  try {
    const { content, maxLength, type } = req.body
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for summarization'
      })
    }

    // Forward to AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/summarize`, {
      content,
      max_length: maxLength || 150,
      type: type || 'general'
    })

    res.json({
      success: true,
      message: 'Story summarized successfully',
      data: aiResponse.data.data
    })

  } catch (error) {
    console.error('Summarization Error:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to summarize content',
      error: error.message
    })
  }
})

// Health check for AI service connection
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 })
    res.json({
      success: true,
      aiService: 'connected',
      status: response.data
    })
  } catch (error) {
    res.json({
      success: false,
      aiService: 'disconnected',
      error: error.message
    })
  }
})

module.exports = router