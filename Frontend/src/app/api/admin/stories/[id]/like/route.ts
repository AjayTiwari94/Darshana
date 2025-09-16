// Mock API route for liking a story
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

// POST /api/admin/stories/[id]/like - Like a story
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const story = mockStories.find(s => s._id === params.id)
  
  if (!story) {
    return NextResponse.json({
      success: false,
      message: 'Story not found'
    }, { status: 404 })
  }

  // Toggle like status (in a real app, you would check if the user has already liked the story)
  story.statistics.likes += 1

  return NextResponse.json({
    success: true,
    message: 'Story liked successfully'
  })
}