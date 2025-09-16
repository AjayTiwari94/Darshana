'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const MarkdownTest = () => {
  const testContent = `## This is a heading
  
This is a paragraph with **bold text** and *italic text*.
  
### This is a subheading
  
Another paragraph with **more bold text** and *more italic text*.`
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Processing Test</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        {processMarkdown(testContent)}
      </div>
    </div>
  )
}

export default MarkdownTest