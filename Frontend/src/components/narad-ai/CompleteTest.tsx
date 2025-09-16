'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const CompleteTest = () => {
  const testCases = [
    {
      name: "Headings Processing",
      description: "Testing ## and ### heading conversion to bold headings",
      content: `## Main Heading
  
This is content under the main heading.
  
### Subheading
  
This is content under the subheading.`
    },
    {
      name: "Bold Text Processing",
      description: "Testing **bold** text formatting",
      content: `This paragraph has **bold text** in the middle.
  
This paragraph has **multiple** **bold** sections.`
    },
    {
      name: "Italic Text Processing",
      description: "Testing *italic* text formatting",
      content: `This paragraph has *italic text* in the middle.
  
This paragraph has *multiple* *italic* sections.`
    },
    {
      name: "Combined Formatting",
      description: "Testing combined bold and italic formatting",
      content: `## Mixed Formatting Example
  
This paragraph has **bold text** and *italic text* combined.
  
### Another Subheading
  
More **bold** and *italic* text here.`
    },
    {
      name: "Realistic AI Response",
      description: "Testing a complete AI response with all formatting types",
      content: `## The Legend of the Taj Mahal

The Taj Mahal is one of the **most iconic** monuments in the world, representing eternal love and architectural brilliance.

### A Monument of Love

Built by Emperor **Shah Jahan** in memory of his beloved wife *Mumtaz Mahal*, the Taj Mahal stands as a testament to their undying love.

The construction took **over 20 years** to complete, involving thousands of artisans and craftsmen from across the *Mughal Empire*.

### Architectural Marvel

The Taj Mahal showcases **exceptional** *Mughal architecture*, combining elements from Islamic, Persian, Ottoman Turkish and Indian architectural styles.

Key features include:
* The pristine white marble dome
* The intricate **pietra dura** inlay work
* The perfectly symmetrical gardens
* The reflecting pools that mirror the structure

### Cultural Significance

This monument holds **immense** cultural and historical significance, attracting millions of visitors from around the world each year.

UNESCO recognized the Taj Mahal as a *World Heritage Site* in 1983, acknowledging its universal value.

Would you like to know more about the **legends** surrounding the Taj Mahal or its *architectural features*?`
    }
  ]
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Complete Markdown Processing Test</h1>
      <p className="mb-8 text-gray-600 text-center">This comprehensive test demonstrates all markdown processing capabilities.</p>
      
      <div className="space-y-10">
        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-2 text-primary-700">{testCase.name}</h2>
            <p className="text-gray-600 mb-4">{testCase.description}</p>
            <div className="bg-gray-50 p-5 rounded-lg">
              {processMarkdown(testCase.content)}
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Raw Content:</h3>
              <div className="bg-gray-100 p-3 rounded font-mono text-xs whitespace-pre-wrap">
                {testCase.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompleteTest