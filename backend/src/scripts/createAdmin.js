/**
 * Create Admin User Script
 * Run this to create an admin user for your Darshana application
 * 
 * Usage: node src/scripts/createAdmin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const readline = require('readline')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana'

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Function to ask question
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

// User Schema (inline to avoid dependencies)
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user'
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    contentTypes: [String],
    interests: [String],
    accessibility: {
      audioNarration: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      subtitles: { type: Boolean, default: false }
    }
  },
  profile: {
    bio: String,
    location: String,
    website: String,
    socialLinks: {
      twitter: String,
      instagram: String,
      facebook: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model('User', UserSchema)

async function createAdmin() {
  try {
    console.log('\n🚀 Darshana Admin User Creator\n')
    console.log('='.repeat(50))
    
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB!')
    
    // Get user input
    console.log('\n👤 Enter Admin Details:\n')
    
    const firstName = await question('First Name: ')
    const lastName = await question('Last Name: ')
    const email = await question('Email: ')
    const password = await question('Password (min 8 characters): ')
    const confirmPassword = await question('Confirm Password: ')
    
    // Validate input
    if (!firstName || !lastName || !email || !password) {
      console.error('\n❌ Error: All fields are required!')
      process.exit(1)
    }
    
    if (password !== confirmPassword) {
      console.error('\n❌ Error: Passwords do not match!')
      process.exit(1)
    }
    
    if (password.length < 8) {
      console.error('\n❌ Error: Password must be at least 8 characters!')
      process.exit(1)
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log('\n⚠️  User with this email already exists!')
      const updateRole = await question('Update to admin role? (y/n): ')
      
      if (updateRole.toLowerCase() === 'y') {
        existingUser.role = 'admin'
        await existingUser.save()
        console.log('\n✅ User role updated to admin!')
        console.log('\n👤 Admin User Details:')
        console.log('='.repeat(50))
        console.log(`Name: ${existingUser.firstName} ${existingUser.lastName}`)
        console.log(`Email: ${existingUser.email}`)
        console.log(`Role: ${existingUser.role}`)
        console.log(`Created: ${existingUser.createdAt}`)
        console.log('='.repeat(50))
      } else {
        console.log('\n❌ Operation cancelled.')
      }
      
      await mongoose.disconnect()
      rl.close()
      process.exit(0)
    }
    
    // Create admin user
    console.log('\n📝 Creating admin user...')
    
    const adminUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      preferences: {
        language: 'en',
        contentTypes: [],
        interests: ['History', 'Culture', 'Heritage']
      },
      profile: {
        bio: 'System Administrator',
        location: 'India'
      },
      isActive: true,
      emailVerified: true
    })
    
    console.log('\n✅ Admin user created successfully!')
    console.log('\n👤 Admin User Details:')
    console.log('='.repeat(50))
    console.log(`Name: ${adminUser.firstName} ${adminUser.lastName}`)
    console.log(`Email: ${adminUser.email}`)
    console.log(`Role: ${adminUser.role}`)
    console.log(`ID: ${adminUser._id}`)
    console.log('='.repeat(50))
    
    console.log('\n🎉 You can now login with these credentials!')
    console.log('\n📝 Login URL: http://localhost:3000/auth/login')
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Password: [the password you just entered]`)
    
    // Disconnect
    await mongoose.disconnect()
    console.log('\n✅ Disconnected from MongoDB')
    
    rl.close()
    process.exit(0)
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message)
    await mongoose.disconnect()
    rl.close()
    process.exit(1)
  }
}

// Run the script
createAdmin()



