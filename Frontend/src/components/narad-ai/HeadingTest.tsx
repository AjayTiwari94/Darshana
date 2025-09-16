'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const HeadingTest = () => {
  const testContent = `## This is a Main Heading
  
This is a regular paragraph that comes after the heading.
  
### This is a Subheading
  
This is another paragraph after the subheading.
  
## Another Main Heading
  
More content after the second main heading.`;
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Heading Processing Test</h1>
      <p className="mb-4 text-gray-600">This test verifies that ## and ### markers are properly converted to bold headings.</p>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-primary-700">Processed Content</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {processMarkdown(testContent)}
        </div>
      </div>
      
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-primary-700">Raw Content</h2>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {testContent}
        </div>
      </div>
    </div>
  )
}

export default HeadingTest