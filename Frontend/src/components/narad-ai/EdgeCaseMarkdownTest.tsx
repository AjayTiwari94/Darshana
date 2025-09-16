'use client'

import React from 'react'
import { processMarkdown } from './NaradAIChat'

const EdgeCaseMarkdownTest = () => {
  const edgeCases = [
    {
      name: "Empty Content",
      content: ""
    },
    {
      name: "Only Headings",
      content: `## Heading 1

### Heading 2

## Heading 3`
    },
    {
      name: "Only Paragraphs",
      content: `This is the first paragraph.

This is the second paragraph.

This is the third paragraph.`
    },
    {
      name: "Mixed with Empty Lines",
      content: `## Main Heading


This is a paragraph after empty lines.


### Subheading


Another paragraph.`
    },
    {
      name: "Bold at Start and End",
      content: `**Bold at start** of paragraph.

Paragraph with **bold at end**.

**Entire paragraph bold**.`
    },
    {
      name: "Italic at Start and End",
      content: `*Italic at start* of paragraph.

Paragraph with *italic at end*.

*Entire paragraph italic*.`
    },
    {
      name: "Nested Formatting",
      content: `This has ***bold and italic*** text.

This has **bold with *italic inside*** text.

This has *italic with **bold inside*** text.`
    },
    {
      name: "Special Characters",
      content: `## Heading with "quotes" and 'apostrophes'

Paragraph with "quotes" and 'apostrophes'.

Paragraph with **bold "quotes"** and *italic 'apostrophes'*.`
    }
  ]
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Edge Case Markdown Processing Test</h1>
      
      <div className="space-y-8">
        {edgeCases.map((testCase, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-primary-700">{testCase.name}</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[50px]">
              {testCase.content ? processMarkdown(testCase.content) : <p className="text-gray-500 italic">Empty content</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EdgeCaseMarkdownTest