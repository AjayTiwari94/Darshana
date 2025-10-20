// Mock API routes for testing story management functionality
import { NextResponse } from 'next/server'

// Mock data with more stories to fix the limited display issue
let mockStories = [
  {
    _id: '1',
    title: 'The Sacred Kedarnath Temple',
    description: 'Discover the ancient history of one of the twelve Jyotirlingas dedicated to Lord Shiva',
    content: '## The Legend of Kedarnath\n\nThe history of Kedarnath is deeply rooted in mythology...',
    monument: { _id: 'm1', name: 'Kedarnath Temple' },
    category: 'Historical',
    period: '8th Century AD',
    narrator: { name: 'Ajay Tiwari' },
    duration: 480,
    difficulty: 'Easy',
    mediaAssets: { images: ['/images/sacred_places/Kedarnath.jpg'] },
    isPublished: true,
    isFeatured: true,
    statistics: {
      views: 1250,
      likes: 890,
      shares: 150,
      averageRating: 4.8,
      totalRatings: 200
    },
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z'
  },
  {
    _id: '2',
    title: 'The Mystical Badrinath',
    description: 'Explore the spiritual significance of Badrinath Temple',
    content: '## The Divine Abode\n\nBadrinath Temple holds immense spiritual significance...',
    monument: { _id: 'm2', name: 'Badrinath Temple' },
    category: 'Spiritual',
    period: '9th Century AD',
    narrator: { name: 'Ajay Tiwari' },
    duration: 360,
    difficulty: 'Medium',
    mediaAssets: { images: ['/images/sacred_places/Badrinath.jpg'] },
    isPublished: true,
    isFeatured: false,
    statistics: {
      views: 980,
      likes: 720,
      shares: 95,
      averageRating: 4.6,
      totalRatings: 150
    },
    createdAt: '2023-06-10T09:15:00Z',
    updatedAt: '2023-06-12T16:20:00Z'
  },
  {
    _id: '3',
    title: 'The Golden Temple of Amritsar',
    description: 'Discover the spiritual heart of Sikhism and the architectural marvel of Harmandir Sahib',
    content: '## The Sacred Golden Temple\n\nThe Golden Temple, officially known as Harmandir Sahib...',
    monument: { _id: 'm3', name: 'Golden Temple' },
    category: 'Historical',
    period: '16th Century AD',
    narrator: { name: 'Ajay Tiwari' },
    duration: 660,
    difficulty: 'Easy',
    mediaAssets: { images: ['/images/golderntemple.jpg'] },
    isPublished: true,
    isFeatured: true,
    statistics: {
      views: 2100,
      likes: 1540,
      shares: 320,
      averageRating: 4.9,
      totalRatings: 350
    },
    createdAt: '2023-07-05T11:20:00Z',
    updatedAt: '2023-07-08T13:45:00Z'
  },
  {
    _id: '4',
    title: 'The Legends of Ayodhya',
    description: 'The ancient capital and birthplace of Lord Rama',
    content: '## The Royal City of Ayodhya\n\nAyodhya, located on the banks of the sacred Sarayu river...',
    monument: { _id: 'm4', name: 'Ayodhya' },
    category: 'Mythological',
    period: '2nd Millennium BC',
    narrator: { name: 'Ajay Tiwari' },
    duration: 720,
    difficulty: 'Medium',
    mediaAssets: { images: ['/images/sacred_places/Ayodhya.jpg'] },
    isPublished: true,
    isFeatured: false,
    statistics: {
      views: 1850,
      likes: 1320,
      shares: 280,
      averageRating: 4.7,
      totalRatings: 290
    },
    createdAt: '2023-08-12T14:30:00Z',
    updatedAt: '2023-08-15T16:15:00Z'
  },
  {
    _id: '5',
    title: 'Mathura: Birthplace of Lord Krishna',
    description: 'The ancient city where Lord Krishna was born',
    content: '## The Birthplace of Lord Krishna\n\nMathura, located on the banks of the Yamuna river...',
    monument: { _id: 'm5', name: 'Mathura' },
    category: 'Historical',
    period: '6th Century BC',
    narrator: { name: 'Ajay Tiwari' },
    duration: 600,
    difficulty: 'Easy',
    mediaAssets: { images: ['/images/sacred_places/Mathura.jpg'] },
    isPublished: true,
    isFeatured: true,
    statistics: {
      views: 1680,
      likes: 1210,
      shares: 240,
      averageRating: 4.8,
      totalRatings: 260
    },
    createdAt: '2023-09-18T09:45:00Z',
    updatedAt: '2023-09-21T12:30:00Z'
  },
  {
    _id: '6',
    title: 'Naina Devi: The Sacred Hilltop Temple',
    description: 'Explore the ancient history of this important Shaktipeeth pilgrimage center',
    content: '## The Sacred Naina Devi Temple\n\nPerched on a hilltop on the borders with Punjab...',
    monument: { _id: 'm6', name: 'Naina Devi Temple' },
    category: 'Historical',
    period: '8th Century AD',
    narrator: { name: 'Ajay Tiwari' },
    duration: 540,
    difficulty: 'Medium',
    mediaAssets: { images: ['/images/sacred_places/Naina-Devi.jpg'] },
    isPublished: true,
    isFeatured: false,
    statistics: {
      views: 920,
      likes: 680,
      shares: 120,
      averageRating: 4.5,
      totalRatings: 140
    },
    createdAt: '2023-10-22T13:15:00Z',
    updatedAt: '2023-10-25T15:40:00Z'
  }
]

// GET /api/admin/stories - Fetch all stories
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const isPublished = searchParams.get('isPublished')
  const isFeatured = searchParams.get('isFeatured')
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  // Handle pagination parameters
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  let filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(search.toLowerCase()) ||
                         story.description.toLowerCase().includes(search.toLowerCase()) ||
                         story.monument.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !category || story.category === category
    const matchesPublished = isPublished === null || story.isPublished.toString() === isPublished
    const matchesFeatured = isFeatured === null || story.isFeatured.toString() === isFeatured
    
    return matchesSearch && matchesCategory && matchesPublished && matchesFeatured
  })

  // Simple sorting
  filteredStories.sort((a, b) => {
    if (sort === 'title') {
      return order === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title)
    } else if (sort === 'statistics.views') {
      return order === 'asc' 
        ? a.statistics.views - b.statistics.views 
        : b.statistics.views - a.statistics.views
    } else {
      return order === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Apply pagination
  const paginatedStories = filteredStories.slice(skip, skip + limit)

  return NextResponse.json({
    success: true,
    data: paginatedStories,
    total: filteredStories.length,
    pagination: {
      page,
      limit,
      total: filteredStories.length,
      pages: Math.ceil(filteredStories.length / limit)
    }
  })
}

// POST /api/admin/stories - Create a new story
export async function POST(request: Request) {
  const body = await request.json()
  
  const newStory = {
    _id: (mockStories.length + 1).toString(),
    title: body.title,
    description: body.description,
    content: body.content,
    monument: { _id: 'm' + (mockStories.length + 1), name: body.monument },
    category: body.type.charAt(0).toUpperCase() + body.type.slice(1),
    period: 'Present',
    narrator: { name: body.narrator },
    duration: 300,
    difficulty: body.difficulty === 'beginner' ? 'Easy' : 
               body.difficulty === 'intermediate' ? 'Medium' : 'Hard',
    mediaAssets: { images: body.mediaAssets.filter((a: any) => a.type === 'image').map((a: any) => a.url) },
    isPublished: body.isPublished,
    isFeatured: body.isFeatured,
    statistics: {
      views: 0,
      likes: 0,
      shares: 0,
      averageRating: 0,
      totalRatings: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockStories.push(newStory)

  return NextResponse.json({
    success: true,
    data: newStory,
    message: 'Story created successfully'
  })
}