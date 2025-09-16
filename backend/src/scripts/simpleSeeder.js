const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const User = require('../models/User')
const Monument = require('../models/Monument')

const connectDB = require('../config/database')

// Simple seed data with VALID PASSWORDS that meet all requirements
const seedUsers = async () => {
  const users = [
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@darshana.com",
      password: await bcrypt.hash("Admin123", 12), // ✅ Valid: 8+ chars, A-Z, a-z, 0-9
      role: "admin",
      preferences: {
        language: "en",
        contentTypes: [],
        interests: [],
        accessibility: {
          audioNarration: false,
          highContrast: false,
          fontSize: "medium",
          subtitles: false
        }
      },
      profile: {
        bio: "Platform Administrator with full access to system management",
        location: "India"
      },
      isActive: true,
      isEmailVerified: true
    },
    {
      firstName: "Cultural",
      lastName: "Explorer", 
      email: "explorer@example.com",
      password: await bcrypt.hash("Explorer123", 12), // ✅ Valid: 8+ chars, A-Z, a-z, 0-9
      role: "user",
      preferences: {
        language: "en",
        contentTypes: ["article", "video"],
        interests: ["History", "Architecture", "Mythology"],
        accessibility: {
          audioNarration: false,
          highContrast: false,
          fontSize: "medium",
          subtitles: false
        }
      },
      profile: {
        bio: "Passionate about Indian heritage and cultural exploration",
        location: "Mumbai, India"
      },
      isActive: true,
      isEmailVerified: true
    },
    {
      firstName: "Heritage",
      lastName: "Guide",
      email: "guide@darshana.com", 
      password: await bcrypt.hash("Guide123", 12), // ✅ Valid: 8+ chars, A-Z, a-z, 0-9
      role: "guide",
      preferences: {
        language: "en",
        contentTypes: ["article", "video", "audio"],
        interests: ["History", "Architecture", "Storytelling"],
        accessibility: {
          audioNarration: true,
          highContrast: false,
          fontSize: "medium",
          subtitles: false
        }
      },
      profile: {
        bio: "Certified heritage guide with 10+ years experience in cultural tours",
        location: "Delhi, India"
      },
      isActive: true,
      isEmailVerified: true
    },
    {
      firstName: "Test",
      lastName: "Student",
      email: "student@darshana.com", 
      password: await bcrypt.hash("Student123", 12), // ✅ Valid: 8+ chars, A-Z, a-z, 0-9
      role: "user",
      preferences: {
        language: "en",
        contentTypes: ["video", "interactive"],
        interests: ["Mythology", "Art & Culture", "Photography"],
        accessibility: {
          audioNarration: true,
          highContrast: false,
          fontSize: "large",
          subtitles: true
        }
      },
      profile: {
        bio: "Student passionate about learning Indian culture and heritage",
        location: "Bangalore, India"
      },
      isActive: true,
      isEmailVerified: true
    }
  ]

  for (const userData of users) {
    await User.create(userData)
  }
  console.log(`✅ Seeded ${users.length} users`)
}

const seedMonuments = async () => {
  const monuments = [
    {
      name: "Taj Mahal",
      description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra. Built by Shah Jahan as a tomb for his wife Mumtaz Mahal.",
      location: {
        address: "Dharmapuri, Forest Colony, Tajganj",
        city: "Agra",
        state: "Uttar Pradesh",
        country: "India",
        coordinates: {
          latitude: 27.1751,
          longitude: 78.0421
        }
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
          caption: "Main view of Taj Mahal",
          isPrimary: true
        }
      ],
      categories: ["tomb", "heritage_site"],
      historicalPeriod: {
        era: "medieval",
        dynasty: "Mughal",
        yearBuilt: 1653
      },
      ticketInfo: {
        available: true,
        prices: {
          indian: {
            adult: 50
          },
          foreign: {
            adult: 1100
          }
        },
        timings: {
          openTime: "06:00",
          closeTime: "18:00",
          closedDays: ["Friday"]
        }
      },
      statistics: {
        totalVisits: 6500000,
        averageRating: 4.8,
        totalReviews: 125000
      }
    },
    {
      name: "Red Fort", 
      description: "A historic fortified palace of the Mughal emperors located in Old Delhi, India.",
      location: {
        address: "Netaji Subhash Marg, Chandni Chowk",
        city: "New Delhi",
        state: "Delhi", 
        country: "India",
        coordinates: {
          latitude: 28.6562,
          longitude: 77.2410
        }
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1587474260584-136574528045",
          caption: "Red Fort Delhi Gate",
          isPrimary: true
        }
      ],
      categories: ["fort", "heritage_site"],
      historicalPeriod: {
        era: "medieval", 
        dynasty: "Mughal",
        yearBuilt: 1648
      },
      ticketInfo: {
        available: true,
        prices: {
          indian: {
            adult: 35
          },
          foreign: {
            adult: 500
          }
        },
        timings: {
          openTime: "09:30",
          closeTime: "16:30",
          closedDays: ["Monday"]
        }
      },
      statistics: {
        totalVisits: 9000000,
        averageRating: 4.6,
        totalReviews: 89000
      }
    }
  ]

  for (const monumentData of monuments) {
    await Monument.create(monumentData)
  }
  console.log(`✅ Seeded ${monuments.length} monuments`)
}

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to database
    await connectDB()
    
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Monument.deleteMany({})
    
    // Seed users
    console.log('👥 Seeding users...')
    await seedUsers()
    
    // Seed monuments
    console.log('🏛️ Seeding monuments...')
    await seedMonuments()
    
    console.log('✅ Database seeded successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase