'use client'

import React from 'react'
import StoryEditor from '@/components/admin/stories/StoryEditor'

const TestStoryEditorPage: React.FC = () => {
  // Sample test data to verify all features work
  const testData = {
    title: 'Test Story with All Features',
    description: 'This is a test story to verify all editor features work correctly',
    content: `## Introduction

This is a **bold** statement and this is *italic* text.

### Subheading

Here's an image:

![Test Image](/images/sacred_places/kedarnath-temple.svg)

More content with **bold** and *italic* formatting.`,
    monument: 'Test Monument',
    type: 'history',
    difficulty: 'intermediate' as 'intermediate',
    ageRating: 'all',
    themes: ['test', 'demo'],
    narrator: 'Ajay Tiwari',
    isPublished: false,
    isFeatured: true,
    mediaAssets: [
      {
        id: 'test-image-1',
        type: 'image' as const,
        url: '/images/sacred_places/kedarnath-temple.svg',
        fileName: 'kedarnath-temple.svg'
      },
      {
        id: 'test-image-2',
        type: 'image' as const,
        url: '/images/sacred_places/badrinath-temple.svg',
        fileName: 'badrinath-temple.svg'
      },
      {
        id: 'test-image-3',
        type: 'image' as const,
        url: '/images/sacred_places/ayodhya-ram-mandir.svg',
        fileName: 'ayodhya-ram-mandir.svg'
      },
      {
        id: 'test-image-4',
        type: 'image' as const,
        url: '/images/sacred_places/mathura-krishna-janmabhoomi.svg',
        fileName: 'mathura-krishna-janmabhoomi.svg'
      },
      {
        id: 'test-image-5',
        type: 'image' as const,
        url: '/images/sacred_places/naina-devi-temple.svg',
        fileName: 'naina-devi-temple.svg'
      },
      {
        id: 'test-image-6',
        type: 'image' as const,
        url: '/images/sacred_places/chintpurni-temple.svg',
        fileName: 'chintpurni-temple.svg'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Story Editor</h1>
      <p className="mb-6 text-gray-600">This page tests all the enhanced features of the story editor.</p>
      <StoryEditor initialData={testData} isEditing={true} storyId="test-story-id" />
    </div>
  )
}

export default TestStoryEditorPage