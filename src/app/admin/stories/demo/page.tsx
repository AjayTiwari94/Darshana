'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const StoryEditorDemoPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/admin/stories" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Stories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Story Editor Demo</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Features Demonstration</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">1. Rich Content Editing</h3>
              <p className="text-blue-800 text-sm mt-1">
                The editor now supports bold (**text**) and italic (*text*) formatting in addition to headings.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">2. Image Placement</h3>
              <p className="text-green-800 text-sm mt-1">
                You can upload images and place them anywhere in your content using the media library.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">3. Heading Customization</h3>
              <p className="text-purple-800 text-sm mt-1">
                Easily add H2 and H3 headings with the toolbar buttons.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900">4. Proper Date Tracking</h3>
              <p className="text-yellow-800 text-sm mt-1">
                Creation and update dates are automatically tracked and displayed.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-900">5. Story Deletion</h3>
              <p className="text-red-800 text-sm mt-1">
                Delete any story with confirmation to prevent accidental deletion.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Try the Enhanced Editor</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to try out the enhanced story editor with all the new features.
          </p>
          
          <div className="flex space-x-4">
            <Link 
              href="/admin/stories/create" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Story
            </Link>
            
            <Link 
              href="/admin/stories/test" 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Test Editor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryEditorDemoPage