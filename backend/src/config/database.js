const mongoose = require('mongoose')
const logger = require('../utils/logger')

const connectDB = async () => {
  try {
    // Priority: Atlas when USE_ATLAS=true, otherwise local MongoDB
    const localURI = 'mongodb://localhost:27017/darshana'
    const atlasURI = process.env.MONGODB_URI
    
    let mongoURI = localURI
    let connectionType = 'Local MongoDB'
    
    // If explicitly set to use Atlas, prioritize it
    if (process.env.USE_ATLAS === 'true' && atlasURI) {
      mongoURI = atlasURI
      connectionType = 'MongoDB Atlas (Cloud)'
    }
    
    // If USE_ATLAS is explicitly set to false, force local MongoDB
    if (process.env.USE_ATLAS === 'false') {
      mongoURI = localURI
      connectionType = 'Local MongoDB (forced)'
    }
    
    const isAtlas = mongoURI.includes('mongodb+srv://')
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: isAtlas ? 15000 : 5000, // Shorter timeout for local
      retryWrites: true,
      w: 'majority'
    }
    
    logger.info('🔗 Attempting to connect to MongoDB...')
    logger.info(`💾 Using: ${connectionType}`)
    logger.info(`🔗 Connection URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`)
    
    const conn = await mongoose.connect(mongoURI, connectionOptions)

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`)
    logger.info(`📊 Database: ${conn.connection.name}`)
    logger.info(`🔧 Connection state: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting'}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected')
    })
    
    global.useDatabase = true
    
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`)
    
    if (error.message.includes('authentication failed')) {
      logger.error('🔑 Authentication Error: Check your username and password')
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      logger.error('🌐 Connection Error: ')
      logger.error('   • For local MongoDB: Ensure MongoDB is installed and running')
      logger.error('   • For Atlas: Check internet connection and cluster URL')
      logger.error('💡 To install local MongoDB, run: install_mongodb.bat')
    } else if (error.message.includes('IP not whitelisted')) {
      logger.error('🚫 IP Access Error: Add your IP address to MongoDB Atlas Network Access')
    }
    
    logger.info('💡 Running in development mode without database')
    logger.info('🔧 User data will not be persisted')
    logger.info('📖 See MONGODB_ATLAS_SETUP.md for cloud setup or install_mongodb.bat for local setup')
    
    // Force mock mode for development when database connection fails
    logger.info('🔧 Falling back to mock mode for development')
    global.useDatabase = false
  }
}

module.exports = connectDB