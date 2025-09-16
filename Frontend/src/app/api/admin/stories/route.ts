// Mock API routes for testing story management functionality
import { NextResponse } from 'next/server'

// Mock data
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
    mediaAssets: { images: ['/images/kedarnath-temple.jpg'] },
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
    mediaAssets: { images: ['/images/badrinath-temple.jpg'] },
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

  return NextResponse.json({
    success: true,
    data: filteredStories,
    total: filteredStories.length
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