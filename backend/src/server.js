const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')

// Load .env file from the backend directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const connectDB = require('./config/database')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')

// Import routes
const authRoutes = require('./routes/auth')
const monumentRoutes = require('./routes/monuments')
const storyRoutes = require('./routes/stories')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const aiRoutes = require('./routes/ai')
const questRoutes = require('./routes/quests')
const treasureHuntRoutes = require('./routes/treasureHunts')
const ticketRoutes = require('./routes/tickets')

const app = express()
const httpServer = createServer(app)

// Socket.io setup for real-time features
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Connect to database
connectDB()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// CORS configuration
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || "http://localhost:3000", 
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Accept']
}))

// General middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Debug endpoint to check database mode
app.get('/debug/mode', (req, res) => {
  res.json({
    useDatabase: global.useDatabase,
    forcedMockMode: process.env.FORCE_MOCK_MODE === 'true'
  })
})

// Debug endpoint to check mock users
app.get('/debug/mock-users', (req, res) => {
  // Import auth controller to get mock users
  const authController = require('./controllers/auth');
  const mockUsers = authController.getMockUsers();
  res.json({
    mockUsers: mockUsers
  });
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/monuments', monumentRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/treasure-hunts', treasureHuntRoutes)
app.use('/api/tickets', ticketRoutes)

// Serve temporary files (for WhatsApp screenshots)
app.use('/temp', express.static(path.join(__dirname, '..', 'temp')))

// API documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'Darshana API v1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      monuments: '/api/monuments',
      stories: '/api/stories',
      users: '/api/users',
      ai: '/api/ai',
      bookings: '/api/bookings',
      treasureHunt: '/api/treasure-hunt'
    }
  })
})

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)

  // Join user to their personal room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`)
    logger.info(`User ${userId} joined personal room`)
  })

  // Handle Narad AI chat
  socket.on('narad_message', async (data) => {
    try {
      // Process message with AI service
      const response = await processNaradMessage(data.message, data.context)
      socket.emit('narad_response', response)
    } catch (error) {
      logger.error('Narad AI error:', error)
      socket.emit('narad_error', { message: 'AI service unavailable' })
    }
  })

  // Handle treasure hunt events
  socket.on('treasure_hunt_progress', (data) => {
    socket.to(`treasure_hunt_${data.huntId}`).emit('participant_progress', data)
  })

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  httpServer.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server')
  httpServer.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

// Helper function for Narad AI (placeholder)
async function processNaradMessage(message, context) {
  // This will be implemented with actual AI service integration
  return {
    response: "I'm Narad AI, your cultural guide. How can I help you explore India's heritage today?",
    suggestions: ["Tell me about Taj Mahal", "What are some ghost stories?", "Plan my trip"],
    metadata: {
      timestamp: new Date().toISOString(),
      context: context
    }
  }
}

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  logger.info(`🚀 Darshana API server running on port ${PORT}`)
  logger.info(`📚 API documentation available at http://localhost:${PORT}/api`)
  logger.info(`🔍 Health check available at http://localhost:${PORT}/health`)
})

module.exports = app