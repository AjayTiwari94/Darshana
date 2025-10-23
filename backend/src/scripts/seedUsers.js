const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const User = require('../models/User')

const connectDB = require('../config/database')

const sampleUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@darshana.com",
    password: "admin123", // Will be hashed by the model
    role: "admin",
    profile: {
      bio: "Platform Administrator",
      location: "India"
    },
    preferences: {
      language: "en",
      contentTypes: [],
      interests: []
    },
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: "Cultural",
    lastName: "Explorer",
    email: "explorer@example.com",
    password: "explorer123", // Will be hashed by the model
    role: "user",
    profile: {
      bio: "Passionate about Indian heritage and culture",
      location: "Mumbai, India"
    },
    preferences: {
      language: "en",
      contentTypes: ["article", "video"],
      interests: ["History", "Architecture", "Mythology"]
    },
    isActive: true,
    isEmailVerified: true
  }
]

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...')
    
    // Connect to database
    await connectDB()
    
    // Clear existing users
    console.log('🧹 Clearing existing users...')
    await User.deleteMany({})
    
    // Seed Users
    console.log('👥 Seeding users...')
    for (let userData of sampleUsers) {
      // Don't hash the password here - let the model do it
      await User.create(userData)
    }
    
    console.log('✅ Users seeded successfully!')
    console.log(`📊 Seeded ${sampleUsers.length} users`)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedUsers()
}

module.exports = seedUsers