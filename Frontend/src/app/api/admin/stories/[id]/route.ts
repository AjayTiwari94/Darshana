// Mock API routes for individual story management functionality
import { NextResponse } from 'next/server'

// Mock data (in a real app, this would come from a database)
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
  }
]

// GET /api/admin/stories/[id] - Fetch a specific story
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const story = mockStories.find(s => s._id === params.id)
  
  if (!story) {
    return NextResponse.json({
      success: false,
      message: 'Story not found'
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: story
  })
}

// PUT /api/admin/stories/[id] - Update a story
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const storyIndex = mockStories.findIndex(s => s._id === params.id)
  
  if (storyIndex === -1) {
    return NextResponse.json({
      success: false,
      message: 'Story not found'
    }, { status: 404 })
  }

  const updatedStory = {
    ...mockStories[storyIndex],
    title: body.title,
    description: body.description,
    content: body.content,
    monument: { ...mockStories[storyIndex].monument, name: body.monument },
    category: body.type.charAt(0).toUpperCase() + body.type.slice(1),
    narrator: { ...mockStories[storyIndex].narrator, name: body.narrator },
    difficulty: body.difficulty === 'beginner' ? 'Easy' : 
               body.difficulty === 'intermediate' ? 'Medium' : 'Hard',
    mediaAssets: { images: body.mediaAssets.filter((a: any) => a.type === 'image').map((a: any) => a.url) },
    isPublished: body.isPublished,
    isFeatured: body.isFeatured,
    updatedAt: new Date().toISOString()
  }

  mockStories[storyIndex] = updatedStory

  return NextResponse.json({
    success: true,
    data: updatedStory,
    message: 'Story updated successfully'
  })
}

// PATCH /api/admin/stories/[id] - Partially update a story
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const storyIndex = mockStories.findIndex(s => s._id === params.id)
  
  if (storyIndex === -1) {
    return NextResponse.json({
      success: false,
      message: 'Story not found'
    }, { status: 404 })
  }

  // Only update the fields provided in the request
  if (body.isPublished !== undefined) {
    mockStories[storyIndex].isPublished = body.isPublished
  }
  
  if (body.isFeatured !== undefined) {
    mockStories[storyIndex].isFeatured = body.isFeatured
  }

  mockStories[storyIndex].updatedAt = new Date().toISOString()

  return NextResponse.json({
    success: true,
    data: mockStories[storyIndex],
    message: 'Story updated successfully'
  })
}

// DELETE /api/admin/stories/[id] - Delete a story
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const storyIndex = mockStories.findIndex(s => s._id === params.id)
  
  if (storyIndex === -1) {
    return NextResponse.json({
      success: false,
      message: 'Story not found'
    }, { status: 404 })
  }

  mockStories.splice(storyIndex, 1)

  return NextResponse.json({
    success: true,
    message: 'Story deleted successfully'
  })
}