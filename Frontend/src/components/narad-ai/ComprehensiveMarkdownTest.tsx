'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const ComprehensiveMarkdownTest = () => {
  const testCases = [
    {
      name: "Headings",
      content: `## Main Heading
  
### Sub Heading
  
Normal paragraph after headings.`
    },
    {
      name: "Bold Text",
      content: `This is a paragraph with **bold text** in the middle.
  
Another paragraph with **multiple** **bold** sections.`
    },
    {
      name: "Italic Text",
      content: `This is a paragraph with *italic text* in the middle.
  
Another paragraph with *multiple* *italic* sections.`
    },
    {
      name: "Combined Formatting",
      content: `## Mixed Formatting Example
  
This paragraph has **bold text** and *italic text* combined.
  
### Another Subheading
  
More **bold** and *italic* text here.`
    },
    {
      name: "Complex Example",
      content: `## The Taj Mahal: A Monument of Love
  
The Taj Mahal is one of the **most iconic** monuments in the world.
  
### Historical Significance
  
Built by Emperor *Shah Jahan* in memory of his beloved wife.
  
The construction took **over 20 years** to complete.`
    }
  ]
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Markdown Processing Test</h1>
      
      <div className="space-y-8">
        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-primary-700">{testCase.name}</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {testCase.content ? processMarkdown(testCase.content) : <p className="text-gray-500 italic">Empty content</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComprehensiveMarkdownTest