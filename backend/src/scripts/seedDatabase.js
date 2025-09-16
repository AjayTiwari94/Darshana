const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const User = require('../models/User')
const Monument = require('../models/Monument')
const Story = require('../models/Story')
const Quest = require('../models/Quest')

const connectDB = require('../config/database')

const sampleData = {
  monuments: [
    {
      name: "Taj Mahal",
      description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
      location: {
        city: "Agra",
        state: "Uttar Pradesh",
        country: "India",
        coordinates: {
          latitude: 27.1751,
          longitude: 78.0421
        }
      },
      category: "Tomb",
      period: "Mughal Era (1632-1653)",
      significance: "UNESCO World Heritage Site, Symbol of Love",
      images: [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523",
        "https://images.unsplash.com/photo-1548013146-72479768bada"
      ],
      ticketInfo: {
        price: {
          indian: 50,
          foreign: 1100
        },
        timings: "6:00 AM - 6:00 PM (Closed on Fridays)",
        availableSlots: 25
      },
      statistics: {
        visitors: 6500000,
        rating: 4.8,
        reviews: 125000
      },
      features: ["Night Viewing", "Audio Guide", "Photography Allowed", "Wheelchair Accessible"],
      isActive: true
    },
    {
      name: "Red Fort",
      description: "A historic fortified palace of the Mughal emperors for nearly 200 years, until 1856. It is located in the center of Delhi and houses a number of museums.",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        coordinates: {
          latitude: 28.6562,
          longitude: 77.2410
        }
      },
      category: "Fort",
      period: "Mughal Era (1639-1648)",
      significance: "UNESCO World Heritage Site, Symbol of Independence",
      images: [
        "https://images.unsplash.com/photo-1587474260584-136574528045",
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f"
      ],
      ticketInfo: {
        price: {
          indian: 35,
          foreign: 500
        },
        timings: "9:30 AM - 4:30 PM (Closed on Mondays)",
        availableSlots: 40
      },
      statistics: {
        visitors: 9000000,
        rating: 4.6,
        reviews: 89000
      },
      features: ["Sound & Light Show", "Museum", "Audio Guide", "Photography Allowed"],
      isActive: true
    },
    {
      name: "Hawa Mahal",
      description: "The Palace of Winds, constructed of red and pink sandstone, is a five-story exterior that resembles a honeycomb with its 953 small windows called jharokhas.",
      location: {
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        coordinates: {
          latitude: 26.9239,
          longitude: 75.8267
        }
      },
      category: "Palace",
      period: "Rajput Era (1799)",
      significance: "Iconic Pink City Architecture",
      images: [
        "https://images.unsplash.com/photo-1477587458883-47145ed94245",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
      ],
      ticketInfo: {
        price: {
          indian: 50,
          foreign: 200
        },
        timings: "9:00 AM - 4:30 PM",
        availableSlots: 30
      },
      statistics: {
        visitors: 2500000,
        rating: 4.4,
        reviews: 45000
      },
      features: ["Photography Allowed", "City View", "Historical Museum"],
      isActive: true
    }
  ],
  
  stories: [
    {
      title: "The Eternal Love Story of Shah Jahan and Mumtaz Mahal",
      description: "Discover the romantic tale behind the world's most beautiful monument",
      content: "In the garden of her memory, in the palace of her dreams, that is where you will find her, that is where she will always be...",
      monument: null, // Will be linked to Taj Mahal
      category: "Historical",
      type: "Romance",
      readTime: 8,
      audioDuration: 12,
      language: "English",
      difficulty: "Beginner",
      tags: ["love", "mughal", "architecture", "history"],
      author: {
        name: "Dr. Rajesh Kumar",
        bio: "Historian specializing in Mughal Era"
      },
      media: {
        coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
        audioFile: null,
        videoFile: null,
        gallery: []
      },
      statistics: {
        views: 125000,
        likes: 8900,
        bookmarks: 3200,
        rating: 4.7,
        reviews: 450
      },
      isPublished: true,
      isFeatured: true
    },
    {
      title: "The Architectural Marvel: Building the Red Fort",
      description: "Explore the engineering genius behind Delhi's most iconic fortress",
      content: "For nine years, thousands of skilled craftsmen worked tirelessly to create what would become the symbol of Mughal power...",
      monument: null, // Will be linked to Red Fort
      category: "Educational",
      type: "Architecture",
      readTime: 12,
      audioDuration: 18,
      language: "English",
      difficulty: "Intermediate",
      tags: ["architecture", "engineering", "mughal", "delhi"],
      author: {
        name: "Prof. Meera Sharma",
        bio: "Architecture historian and heritage expert"
      },
      media: {
        coverImage: "https://images.unsplash.com/photo-1587474260584-136574528045",
        audioFile: null,
        videoFile: null,
        gallery: []
      },
      statistics: {
        views: 89000,
        likes: 6700,
        bookmarks: 2100,
        rating: 4.5,
        reviews: 320
      },
      isPublished: true,
      isFeatured: false
    }
  ],
  
  quests: [
    {
      title: "Taj Mahal Explorer",
      description: "Discover hidden secrets and architectural marvels of the Taj Mahal",
      type: "Educational",
      difficulty: "Easy",
      category: "Historical",
      objectives: [
        {
          id: "obj1",
          title: "Find the calligraphy verses",
          description: "Locate and photograph the Quranic verses inscribed on the main gate",
          type: "photo",
          points: 50
        },
        {
          id: "obj2",
          title: "Identify the precious stones",
          description: "Name three types of precious stones used in the inlay work",
          type: "answer",
          points: 75
        },
        {
          id: "obj3",
          title: "Virtual time travel",
          description: "Experience the construction process through AR",
          type: "visit",
          points: 100
        }
      ],
      rewards: {
        points: 225,
        badges: ["Taj Explorer", "Architecture Enthusiast"],
        experiencePoints: 300
      },
      timeLimit: null,
      statistics: {
        totalParticipants: 1250,
        completedCount: 980,
        averageRating: 4.6
      },
      isActive: true
    }
  ],
  
  users: [
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@darshana.com",
      password: "admin123", // Will be hashed
      role: "admin",
      profile: {
        avatar: null,
        bio: "Platform Administrator",
        location: "India"
      },
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
      isActive: true,
      isEmailVerified: true
    },
    {
      firstName: "Cultural",
      lastName: "Explorer",
      email: "explorer@example.com",
      password: "explorer123", // Will be hashed
      role: "user",
      profile: {
        avatar: null,
        bio: "Passionate about Indian heritage and culture",
        location: "Mumbai, India"
      },
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
      rewards: [
        {
          type: "points",
          name: "Welcome Bonus",
          description: "Points for joining the platform",
          value: 100,
          rarity: "common"
        },
        {
          type: "badge",
          name: "Culture Enthusiast",
          description: "Awarded for showing interest in cultural heritage",
          value: 0,
          rarity: "common"
        }
      ],
      isActive: true,
      isEmailVerified: true
    },
    {
      firstName: "Heritage",
      lastName: "Guide",
      email: "guide@darshana.com",
      password: "guide123", // Will be hashed
      role: "guide",
      profile: {
        avatar: null,
        bio: "Certified heritage guide with 10+ years experience",
        location: "Delhi, India"
      },
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
      rewards: [
        {
          type: "badge",
          name: "Certified Guide",
          description: "Professional heritage guide certification",
          value: 0,
          rarity: "rare"
        }
      ],
      isActive: true,
      isEmailVerified: true
    }
  ]
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
    await Story.deleteMany({})
    await Quest.deleteMany({})
    
    // Seed Users
    console.log('👥 Seeding users...')
    for (let userData of sampleData.users) {
      userData.password = await bcrypt.hash(userData.password, 12)
      await User.create(userData)
    }
    
    // Seed Monuments
    console.log('🏛️ Seeding monuments...')
    const monuments = []
    for (let monumentData of sampleData.monuments) {
      const monument = await Monument.create(monumentData)
      monuments.push(monument)
    }
    
    // Seed Stories (link to monuments)
    console.log('📚 Seeding stories...')
    for (let i = 0; i < sampleData.stories.length; i++) {
      const storyData = sampleData.stories[i]
      if (monuments[i]) {
        storyData.monument = monuments[i]._id
      }
      await Story.create(storyData)
    }
    
    // Seed Quests (link to monuments)
    console.log('🎯 Seeding quests...')
    for (let i = 0; i < sampleData.quests.length; i++) {
      const questData = sampleData.quests[i]
      if (monuments[i]) {
        questData.monument = monuments[i]._id
      }
      await Quest.create(questData)
    }
    
    console.log('✅ Database seeded successfully!')
    console.log(`📊 Seeded:
    - ${sampleData.users.length} users
    - ${sampleData.monuments.length} monuments  
    - ${sampleData.stories.length} stories
    - ${sampleData.quests.length} quests`)
    
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